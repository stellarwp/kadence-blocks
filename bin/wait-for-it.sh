#!/usr/bin/env bash

attempt_counter=0
max_attempts=30

until curl --output /dev/null --silent --fail "$1"; do
    if [ ${attempt_counter} -eq ${max_attempts} ];then
      echo "Max attempts reached"
      exit 1
    fi

    printf '.'
    attempt_counter=$(($attempt_counter+1))
    sleep 1
done

echo "Connected to host"
