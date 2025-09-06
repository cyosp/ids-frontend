#!/bin/sh

set -e
if [ -z "${SHARING_TITLE}" ]; then export SHARING_TITLE="Ids"; fi
if [ -z "${BACKEND_LOCATION}" ]; then export BACKEND_LOCATION="http://localhost:8080"; fi
if [ -z "${DIRECTORY_REVERSED_ORDER}" ]; then export DIRECTORY_REVERSED_ORDER=true; fi
if [ -z "${PREVIEW_DIRECTORY_REVERSED_ORDER}" ]; then export PREVIEW_DIRECTORY_REVERSED_ORDER=false; fi
if [ -z "${MIX_DIRECTORIES_AND_MEDIAS}" ]; then export MIX_DIRECTORIES_AND_MEDIAS=false; fi
if [ -z "${IS_PUBLIC_SHARING}" ]; then export IS_PUBLIC_SHARING=false; fi
if [ -z "${REMOVE_DIRECTORY_PREFIX}" ]; then export REMOVE_DIRECTORY_PREFIX=""; fi
if [ -z "${ADD_TAKEN_DATE_ON_THUMBNAILS}" ]; then export ADD_TAKEN_DATE_ON_THUMBNAILS=false; fi

for APP_TRANSLATED_FOLDER in /var/www/html/*
do
  ASSETS_PATH="$APP_TRANSLATED_FOLDER/assets"
  envsubst < "$ASSETS_PATH"/env.template.js > "$ASSETS_PATH"/env.js
done

exec nginx -g 'daemon off;'
