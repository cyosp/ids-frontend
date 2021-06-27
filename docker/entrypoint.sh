#!/bin/sh

set -e
if [ -z "${SHARING_TITLE}" ]; then export SHARING_TITLE="Ids"; fi
if [ -z "${BACKEND_LOCATION}" ]; then export BACKEND_LOCATION="http://localhost:8080"; fi
if [ -z "${DIRECTORY_REVERSED_ORDER}" ]; then export DIRECTORY_REVERSED_ORDER=true; fi
if [ -z "${PREVIEW_DIRECTORY_REVERSED_ORDER}" ]; then export PREVIEW_DIRECTORY_REVERSED_ORDER=false; fi
if [ -z "${MIX_DIRECTORIES_AND_IMAGES}" ]; then export MIX_DIRECTORIES_AND_IMAGES=false; fi

for APP_TRANSLATED_FOLDER in /var/www/html/*
do
  ASSETS_PATH="$APP_TRANSLATED_FOLDER/assets"
  envsubst < "$ASSETS_PATH"/env.template.js > "$ASSETS_PATH"/env.js
done

exec nginx -g 'daemon off;'
