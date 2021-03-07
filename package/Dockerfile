FROM nginx:stable-alpine

## Copy the builded files and the nginx config
COPY ./build /usr/share/nginx/html
COPY ./package/nginx.conf /etc/nginx/conf.d/default.conf

## Expose the http and https ports
EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
