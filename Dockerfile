FROM nginx:1.17-alpine

LABEL mantainer "Danilo Tuler (danilo@cartesi.io)"

WORKDIR /usr/share/nginx/html

# Add node and the react-env binary
RUN apk add --no-cache nodejs yarn
RUN yarn global add @beam-australia/react-env

# NGINX conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# static files built by webpack (and tsc)
COPY dist/ /usr/share/nginx/html

# environment variables, which will be resolved by the entrypoint below
COPY .env* /usr/share/nginx/html

# this entrypoint will call react-env, and then start nginx
COPY entrypoint.sh /var/entrypoint.sh
ENTRYPOINT ["/var/entrypoint.sh"]

# nginx
CMD ["nginx", "-g", "daemon off;"]
