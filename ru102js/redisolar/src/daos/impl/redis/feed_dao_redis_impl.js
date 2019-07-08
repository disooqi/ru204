const redis = require('./redis_client');
const keyGenerator = require('./redis_key_generator');

const globalMaxFeedLength = 10000;
const siteMaxFeedLength = 2440;

const remap = (streamEntry) => {
  const remappedStreamEntry = { ...streamEntry };

  remappedStreamEntry.siteId = parseInt(streamEntry.siteId, 10);
  remappedStreamEntry.whUsed = parseFloat(streamEntry.whUsed, 10);
  remappedStreamEntry.whGenerated = parseFloat(streamEntry.whGenerated, 10);
  remappedStreamEntry.tempC = parseFloat(streamEntry.tempC, 10);

  return remappedStreamEntry;
};

const insert = async (meterReading) => {
  // Unpack meterReading into array of alternating key
  // names and values for addition to the stream.

  const fields = [];

  for (const k in meterReading) {
    if (meterReading.hasOwnProperty(k)) {
      fields.push(k);
      fields.push(meterReading[k]);
    }
  }

  const client = redis.getClient();
  const pipeline = client.batch();

  pipeline.xadd(keyGenerator.getGlobalFeedKey(), 'MAXLEN', globalMaxFeedLength, '*', ...fields);
  pipeline.xadd(keyGenerator.getFeedKey(meterReading.siteId), 'MAXLEN', siteMaxFeedLength, '*', ...fields);

  await pipeline.execAsync();
};

const getRecent = async (key, limit) => {
  const client = redis.getClient();
  let meterReadings = [];

  const response = await client.xrevrangeAsync(key, '+', '-', 'COUNT', limit);

  // Stream entries need to be unpacked as the Redis
  // client returns them as an array of arrays, rather
  // than an array of objects.
  if (response && Array.isArray(response)) {
    meterReadings = response.map((entry) => {
      // entry[0] is the stream ID, we don't need that.
      const keyValueArray = entry[1];
      const keyValueObj = {};

      // keyValueArray will always contain an even number of
      // entries, with alternating keys and values.  An empty
      // set of key/value pairs is not permitted in Redis Streams.
      for (let n = 0; n < keyValueArray.length; n += 2) {
        const k = keyValueArray[n];
        const v = keyValueArray[n + 1];

        keyValueObj[k] = v;
      }

      return remap(keyValueObj);
    });
  }

  return meterReadings;
};

const getRecentGlobal = async limit => getRecent(keyGenerator.getGlobalFeedKey(), limit);

const getRecentForSite = async (siteId, limit) => getRecent(
  keyGenerator.getFeedKey(siteId),
  limit,
);

module.exports = {
  insert,
  getRecentGlobal,
  getRecentForSite,
};
