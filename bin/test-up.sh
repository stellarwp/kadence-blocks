#!/usr/bin/env bash
docker-compose -f docker-compose.yml up -d
docker-compose exec -T wordpress chown -R www-data:www-data /var/www/html/wp-content/
