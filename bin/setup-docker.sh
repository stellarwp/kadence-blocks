#!/usr/bin/env bash
ls
curl -L https://github.com/docker/compose/releases/download/1.25.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
./bin/test-up.sh
./bin/wait-for-it.sh http://localhost:7253
