# Use Case: Examples with Lua and Python
# Usage: Part of Redis University RU101 courseware
from redis import Redis
from redis.exceptions import ResponseError
from collections import deque
import random
import time
import json
import socket
import os

def get_rolling_average(results, window):
    total = 0
    for result in results[0][1]:
        values = result[1]
        temperature = int(values["temp_f"])
        if len(window) < 10:
            window.append(temperature)
        else:
            window.popleft()
            window.append(temperature)
    for measurement in window:
        total += measurement

    return total / len(window)


def main():
    global redis
    redis = Redis(host=os.environ.get("REDIS_HOST", "localhost"),
                  port=os.environ.get("REDIS_PORT", 6379),
                  db=0, decode_responses=True)

    stream_key = "stream:weather"
    group_name = "rolling_average_printer"
    consumer_name = "consumer-" + socket.gethostname() + "-a"
    block_ms = 5000
    stream_offsets = {stream_key: ">"}
    window = deque([])

    try:
        redis.xgroup_create(stream_key, group_name)
    except ResponseError:
        print("Group already exists.")

    while True:
        results = redis.xreadgroup(group_name, consumer_name,
            stream_offsets, None, block_ms)
        print("Processing: " + json.dumps(results))
        print("Rolling Average:", get_rolling_average(results, window), "\n")
        time.sleep(1)


if __name__ == "__main__":
    main()
