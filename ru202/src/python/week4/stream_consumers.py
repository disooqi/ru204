# Use Case: Partitioned Stream Example with Python
# Usage: Part of Redis University RU202 courseware
import json
import os
import random
import string
import sys
import time
import util.constants as const

from datetime import datetime, timedelta
from multiprocessing import Process
from util.connection import get_connection

AGGREGATING_CONSUMER_PREFIX = "agg"
AVERAGES_CONSUMER_PREFIX = "avg"

# Utility function for logging.
def log(prefix, message):
    if prefix == AVERAGES_CONSUMER_PREFIX:
        print(f"\033[93m{prefix}: {message}\033[0m")
    else:
        print(f"{prefix}: {message}")

# The aggregating consumer function: walks through a 
# time partitioned stream reading temperature values
# and computing hourly average temperature for each
# hour of data.  Those values are then published on 
# a capped length stream for the averages consumer
# function to read.
def aggregating_consumer_func(current_stream_key, last_message_id, current_hourly_total, current_hourly_count):
    log(AGGREGATING_CONSUMER_PREFIX, f"Starting aggregating consumer in stream {current_stream_key} at message {last_message_id}.")

    redis = get_connection()

    while True:
        # Get the next message from the stream, if any
        streamDict = {}
        streamDict[current_stream_key] = last_message_id

        response = redis.xread(streamDict, count = 1, block = 5000)

        if not response:
            # We either need to switch to another stream partition 
            # or wait for more messages to appear on the one we are 
            # on if no newer partitions exist.

            # Work out the name of the stream partition that is one
            # day newer than the current one.
            current_stream_date_str = current_stream_key[-8:]
            current_stream_date = datetime.strptime(current_stream_date_str, "%Y%m%d").date()
            new_stream_date = current_stream_date + timedelta(days = 1)
            new_stream_key = f"{const.STREAM_KEY_BASE}:{new_stream_date.strftime('%Y%m%d')}"

            # Does the next partition exist?  If so read from it otherwise
            # stick with this stream which will block as we are at the 
            # latest partition now.
            if (redis.exists(new_stream_key) == 1):
                # We are still catching up and have not reached
                # the latest stream partition yet, so move on to
                # consuming the next partition.
                current_stream_key = new_stream_key
    
                log(AGGREGATING_CONSUMER_PREFIX, f"Changing partition to consume stream: {new_stream_key}")
            else:
                # We are currently on the latest stream partition
                # and have caught up with the producer so should 
                # block for a while then try reading it again.      
                log(AGGREGATING_CONSUMER_PREFIX, f"Waiting for new messages in stream {current_stream_key}, or new stream partition.")      
        else:
            # Read the response that we got from Redis
            msg = response[0][1][0]

            # Get the ID of the message that was just read.
            msg_id = msg[0]

            # Get the timestamp value from the message ID 
            # (everything before the - in the ID).
            msg_timestamp = msg_id.split("-")[0]

            # Get the temperature value from the message.
            msg_temperature = msg[1]["temp_f"]

            # Get hour for this message
            msg_date = datetime.utcfromtimestamp(int(msg_timestamp))
            msg_hour = msg_date.hour

            # Get the hour for the last message
            last_message_hour = 0

            if "-" in last_message_id:
                last_message_timestamp = last_message_id.split("-")[0]
                last_message_date = datetime.utcfromtimestamp(int(last_message_timestamp))
                last_message_hour = last_message_date.hour

            # Did we start a new hour?
            if last_message_hour != msg_hour:
                # Starting a new hour, push our result to the averages stream.
                formatted_date = msg_date.strftime('%Y/%m/%d')

                # Publish result for this hour, trimming the stream each 
                # time a new message is added.
                payload = {
                    "hour": last_message_hour,
                    "date": formatted_date,
                    "average_temp_f": int(current_hourly_total / current_hourly_count)
                }

                # Keep the stream around 50 entries long.
                redis.xadd(const.AVERAGES_STREAM_KEY, payload, "*", maxlen = 50, approximate = True)

                # Reset values and put the current message's temperature
                # into the new hour.
                current_hourly_total = int(msg_temperature)
                current_hourly_count = 1
            else:
                # Still working through current hour.
                current_hourly_total += int(msg_temperature)
                current_hourly_count += 1

            # Update the last ID we've seen.
            last_message_id = msg_id
            
            # Store current state in Redis in case we crash and 
            # have to resume.
            redis.hmset(const.AGGREGATING_CONSUMER_STATE_KEY, {
                "current_stream_key": current_stream_key,
                "last_message_id": last_message_id,
                "current_hourly_total": current_hourly_total,
                "current_hourly_count": current_hourly_count
            })

# The averages consumer function: Listens for new messages
# on a stream and reports values from them.
def averages_consumer_func():
    redis = get_connection()

    # Recover our last message ID context or default to 0
    last_message_id = "0"
    h = redis.hgetall(const.AVERAGES_CONSUMER_STATE_KEY)
    
    if h:
        last_message_id = h["last_message_id"]

    log(AVERAGES_CONSUMER_PREFIX, f"Starting averages consumer in stream {const.AVERAGES_STREAM_KEY} at message {last_message_id}.")

    while True:
        # Get the next message from the stream, if any
        streamDict = {}
        streamDict[const.AVERAGES_STREAM_KEY] = last_message_id

        response = redis.xread(streamDict, count = 1, block = 5000)    

        if response:
            msg = response[0][1][0]

            # Get the ID of the message that was just read.
            msg_id = msg[0]   

            # Get the average temperature value from the message.
            msg_average_temperature = msg[1]["average_temp_f"]

            # Get the date value from the message.
            msg_date = msg[1]["date"]

            # Get the hour value from the message.
            msg_hour = msg[1]["hour"]

            log(AVERAGES_CONSUMER_PREFIX, f"Average temperature for {msg_date} at {msg_hour} was {msg_average_temperature}F.")

            # Update our last message for the next XREAD.
            last_message_id = msg_id

            # Store current state in Redis.
            redis.hmset(const.AVERAGES_CONSUMER_STATE_KEY, {
                "last_message_id": last_message_id
            })
        else:
            log(AVERAGES_CONSUMER_PREFIX, f"Waiting for new messages in stream {const.AVERAGES_STREAM_KEY}")

# Setup / initialization: Initializes the two separate 
# consumers and starts each in its own process.
def main():
    current_stream_key = ""
    last_message_id = "0"
    current_hourly_total = 0
    current_hourly_count = 0

    # The aggregator consumer needs to know its initial start
    # point stream partition name for reading temperatures from.
    # Try to read a stream name from arguments, if not supplied
    # then we are resuming from a crash so should instead load
    # the saved state from Redis.
    if len(sys.argv) == 2:
        current_stream_key = sys.argv[1]

        # Do very basic validation that we might have been supplied
        # with a stream name from the command line.
        if not current_stream_key.startswith(const.STREAM_KEY_BASE):
            print("Invalid stream key supplied.")
            sys.exit(1)
    else:
        # Load aggregator consumer saved state from Redis.
        redis = get_connection()

        h = redis.hgetall(const.AGGREGATING_CONSUMER_STATE_KEY)
        
        if not h:
            print("No stream key and last message ID found in Redis.")
            print("Start the consumer with stream key and last message ID parameters.")
            sys.exit(1)
        else:
            current_stream_key = h["current_stream_key"]
            last_message_id = h["last_message_id"]
            current_hourly_total = int(h["current_hourly_total"])
            current_hourly_count = int(h["current_hourly_count"])

    # Start the aggregating consumer process.
    aggregating_consumer = Process(target = aggregating_consumer_func, args = (current_stream_key, last_message_id, current_hourly_total, current_hourly_count))
    aggregating_consumer.start()

    # Start the averages consumer process which always loads its 
    # own saved state from Redis.
    averages_consumer = Process(target = averages_consumer_func, args = ())
    averages_consumer.start()

if __name__ == "__main__":
    main()
