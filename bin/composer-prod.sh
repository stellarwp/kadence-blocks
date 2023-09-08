#!/usr/bin/env bash
COMPOSER_VENDOR_DIR=vendor-prod composer install --prefer-dist --no-dev --no-ansi --no-interaction && COMPOSER_VENDOR_DIR=vendor-prod composer du -a --no-dev --no-ansi --no-interaction
