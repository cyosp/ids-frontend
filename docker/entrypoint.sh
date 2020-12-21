#!/bin/sh

set -e

for APP_TRANSLATED_FOLDER in /var/www/html/*
do
  ASSETS_PATH="$APP_TRANSLATED_FOLDER/assets"
  envsubst < "$ASSETS_PATH"/env.template.js > "$ASSETS_PATH"/env.js
done

exec nginx -g 'daemon off;'
