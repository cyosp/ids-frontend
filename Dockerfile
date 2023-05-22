FROM alpine:3.12.1
MAINTAINER CYOSP <cyosp@cyosp.com>

RUN apk upgrade \
    && apk add \
      nginx \
      gettext

RUN mkdir -p /run/nginx /var/www/html
RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stderr /var/log/nginx/error.log

RUN rm /etc/nginx/conf.d/default.conf
ADD docker/nginx.conf /etc/nginx/conf.d/ids.conf

ADD dist/ids /var/www/html

EXPOSE 7070

ADD docker/entrypoint.sh /
RUN chmod +x /entrypoint.sh
ENTRYPOINT "/entrypoint.sh"
