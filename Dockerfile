FROM alpine:3.12.1
MAINTAINER CYOSP <cyosp@cyosp.com>

RUN apk upgrade \
    && apk add \
      nginx

RUN mkdir -p /run/nginx /var/www/html

RUN rm /etc/nginx/conf.d/default.conf
ADD docker/nginx.conf /etc/nginx/conf.d/ids.conf

ADD dist/ids /var/www/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
