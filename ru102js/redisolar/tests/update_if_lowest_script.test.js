const redis = require('../src/daos/impl/redis/redis_client');
const updateIfLowestScript = require('../src/daos/impl/redis/scripts/update_if_lowest_script');

const client = redis.getClient();

const testSuiteName = 'update_if_lowest_script';
const testKeyPrefix = `test:${testSuiteName}`;

/* eslint-disable no-undef */

afterEach(async () => {
  const testKeys = await client.keysAsync(`${testKeyPrefix}:*`);

  if (testKeys.length > 0) {
    await client.delAsync(testKeys);
  }
});

afterAll(() => {
  // Release Redis connection.
  client.quit();
});

test(`${testSuiteName}: update if lowest`, async () => {
  const testKey = `${testKeyPrefix}:updateIfLowestScript`;

  // Set the value to 100.
  await client.setAsync(testKey, 100);

  await updateIfLowestScript.load();

  const result = await client.evalshaAsync(updateIfLowestScript.updateIfLowest(testKey, 50));

  // Expect the response to be 1 / truthy (value was updated).
  // Value is stored as a string in Redis, remember.
  expect(result).toBeTruthy();

  // Expect the stored value to be 50.
  const storedResult = await client.getAsync(testKey);
  expect(parseInt(storedResult, 10)).toEqual(50);
});

test(`${testSuiteName}: update if lowest unchanged`, async () => {
  const testKey = `${testKeyPrefix}:updateIfLowestScript`;

  await client.setAsync(testKey, 100);
  await updateIfLowestScript.load();

  const result = await client.evalshaAsync(updateIfLowestScript.updateIfLowest(testKey, 200));

  expect(result).toBeFalsy();

  const storedResult = await client.getAsync(testKey);
  expect(parseInt(storedResult, 10)).toEqual(100);
});

test(`${testSuiteName}: update if lowest with no key`, async () => {
  const testKey = `${testKeyPrefix}:updateIfLowestScript`;

  await updateIfLowestScript.load();

  const result = client.evalshaAsync(updateIfLowestScript.updateIfLowest(testKey, 200));

  expect(result).toBeTruthy();

  const storedResult = await client.getAsync(testKey);
  expect(parseInt(storedResult, 10)).toEqual(200);
});
