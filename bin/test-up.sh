#!/usr/bin/env bash
docker-compose -f docker-compose.yml up -d
docker-compose exec -T wordpress chown www-data:www-data wp-content wp-content/plugins
