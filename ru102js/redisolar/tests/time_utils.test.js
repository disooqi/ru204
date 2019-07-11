const timeUtils = require('../src/utils/time_utils');

const testSuiteName = 'time_utils';

/* eslint-disable no-undef */

test(`${testSuiteName}: getMinuteOfDay from provided timestamp`, () => {
  // July 10 2019 00:00:00 UTC
  expect(timeUtils.getMinuteOfDay(1562716800)).toBe(0);

  // July 10 2019 00:10:59 UTC
  expect(timeUtils.getMinuteOfDay(1562717459)).toBe(10);

  // July 10 2019 01:12:30 UTC
  expect(timeUtils.getMinuteOfDay(1562721150)).toBe(72);

  // July 10 2019 13:01:01 UTC
  expect(timeUtils.getMinuteOfDay(1562763661)).toBe(781);

  // July 10 2019 23:59:59 UTC
  expect(timeUtils.getMinuteOfDay(1562803199)).toBe(1439);
});

test(`${testSuiteName}: getMinuteOfDay without providing timestamp`, () => {
  // This basically runs at whatever the current time is
  // so it's a looser test as we don't know what the result
  // will be and there's a chance that even if we worked it
  // out and compared to the return value of the funtion we
  // might cross a minute boundary during that time and get
  // an unexpected result.

  const minuteOfDay = timeUtils.getMinuteOfDay();

  expect(minuteOfDay).toBeGreaterThanOrEqual(0);
  expect(minuteOfDay).toBeLessThan(1440);
});

test(`${testSuiteName}: getTimestampForMinuteOfDay`, () => {
  // July 10 2019 21:00:00 UTC
  const today = 1562792400;

  // July 10 2019 00:00:00 UTC
  expect(timeUtils.getTimestampForMinuteOfDay(today, 0)).toBe(1562716800);

  // July 10 2019 00:10:00 UTC
  expect(timeUtils.getTimestampForMinuteOfDay(today, 10)).toBe(1562717400);

  // July 10 2019 01:12:00 UTC
  expect(timeUtils.getTimestampForMinuteOfDay(today, 72)).toBe(1562721120);

  // July 10 2019 13:01:00 UTC
  expect(timeUtils.getTimestampForMinuteOfDay(today, 781)).toBe(1562763660);

  // July 10 2019 23:59:00 UTC
  expect(timeUtils.getTimestampForMinuteOfDay(today, 1439)).toBe(1562803140);
});

/* eslint-enable */
