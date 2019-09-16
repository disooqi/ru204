#!/bin/bash

export _REDIS_VER="5.0.5"


if [ -n "$1" ]
then
  	export _REDIS_VER=$1
fi


sed 's/$REDIS_VERSION/'$_REDIS_VER'/' Dockerfile.template > Dockerfile.$_REDIS_VER
echo Building $_REDIS_VER

docker build -f Dockerfile.$_REDIS_VER $_BUILD_ARGS -t redisuniversity/virtual-lab-ide:$_REDIS_VER .
