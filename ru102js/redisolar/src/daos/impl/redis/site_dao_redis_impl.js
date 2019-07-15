const redis = require('./redis_client');
const keyGenerator = require('./redis_key_generator');

const capacityThreshold = 0.2;

const remap = (siteHash) => {
  const remappedSiteHash = { ...siteHash };

  remappedSiteHash.id = parseInt(siteHash.id, 10);
  remappedSiteHash.panels = parseInt(siteHash.panels, 10);
  remappedSiteHash.capacity = parseFloat(siteHash.capacity, 10);

  // coordinate is optional.
  if (siteHash.hasOwnProperty('lat') && siteHash.hasOwnProperty('lng')) {
    remappedSiteHash.coordinate = {
      lat: parseFloat(siteHash.lat, 10),
      lng: parseFloat(siteHash.lng, 10),
    };

    // Remove original fields from resulting object.
    delete remappedSiteHash.lat;
    delete remappedSiteHash.lng;
  }

  return remappedSiteHash;
};

const flatten = (site) => {
  const flattenedSite = { ...site };

  if (flattenedSite.hasOwnProperty('coordinate')) {
    flattenedSite.lat = flattenedSite.coordinate.lat;
    flattenedSite.lng = flattenedSite.coordinate.lng;
    delete flattenedSite.coordinate;
  }

  return flattenedSite;
};

const getSitesByKey = async (siteIds) => {
  const client = redis.getClient();

  // Lots of Promises...
  // This doesn't deal with string -> int / float conversions...
  // const sites = await Promise.all(siteIds.map(async siteId => client.hgetallAsync(siteId)));

  // const sites = await Promise.all(
  //   siteIds.map(
  //     async (siteId) => {
  //       const siteHash = await client.hgetallAsync(siteId);
  //       return remap(siteHash);
  //     },
  //   ),
  // );

  // For loop version
  const sites = [];

  for (const siteId of siteIds) {
    /* eslint-disable no-await-in-loop */
    const siteHash = await client.hgetallAsync(siteId);
    /* eslint-enable */

    if (siteHash) {
      sites.push(remap(siteHash));
    }
  }

  return sites;
};

const insert = async (site) => {
  const client = redis.getClient();

  const siteHashKey = keyGenerator.getSiteHashKey(site.id);

  await client.hmsetAsync(siteHashKey, flatten(site));
  await client.saddAsync(keyGenerator.getSiteIDsKey(), siteHashKey);

  // Co-ordinates are optional.
  if (site.hasOwnProperty('coordinate')) {
    await client.geoaddAsync(
      keyGenerator.getSiteGeoKey(),
      site.coordinate.lng,
      site.coordinate.lat,
      siteHashKey,
    );
  }

  return siteHashKey;
};

const findById = async (id) => {
  const client = redis.getClient();

  const siteHash = await client.hgetallAsync(keyGenerator.getSiteHashKey(id));

  return (siteHash ? remap(siteHash) : null);
};

const findAll = async () => {
  const client = redis.getClient();

  const siteIds = await client.smembersAsync(keyGenerator.getSiteIDsKey());
  const sites = await getSitesByKey(siteIds);

  return sites;
};

const findByGeo = async (lat, lng, radius, radiusUnit) => {
  const client = redis.getClient();

  const siteIds = await client.georadiusAsync(
    keyGenerator.getSiteGeoKey(),
    lng,
    lat,
    radius,
    radiusUnit.toLowerCase(),
  );

  const sites = await getSitesByKey(siteIds);

  return sites;
};

// TODO implement findByGeoWithExcessCapacityOptimized
// and rename the one below to findByGeoWithExcessCapacityBasic

const findByGeoWithExcessCapacity = async (lat, lng, radius, radiusUnit) => {
  const client = redis.getClient();
  const pipeline = client.batch();

  // Get sites within the radius.
  const sites = await findByGeo(lat, lng, radius, radiusUnit);

  // Get current capacity score for each site.
  for (const site of sites) {
    pipeline.zscore(keyGenerator.getCapacityRankingKey(), site.id);
  }

  const scores = await pipeline.execAsync();

  // Only return sites with capacity above the threshold.
  const sitesWithCapacity = [];

  for (let n = 0; n < sites.length; n += 1) {
    if (parseFloat(scores[n], 10) >= capacityThreshold) {
      sitesWithCapacity.push(sites[n]);
    }
  }

  return sitesWithCapacity;
};

module.exports = {
  insert,
  findById,
  findAll,
  findByGeo,
  findByGeoWithExcessCapacity,
};
