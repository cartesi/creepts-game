FROM node:10-alpine AS builder
LABEL mantainer "Danilo Tuler (danilo@cartesi.io)"

WORKDIR /usr/src/app

# we need everything (or almost everything)
COPY . .

# Build using webpack
RUN npm install
RUN npm run build


FROM nginx:1.17-alpine

WORKDIR /usr/share/nginx/html

# Add node and the react-env binary
RUN apk add --no-cache nodejs yarn
RUN yarn global add @beam-australia/react-env

# NGINX conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# static files built by webpack (and tsc)
# COPY dist/ /usr/share/nginx/html
COPY --from=builder /usr/src/app/dist/ /usr/share/nginx/html

# environment variables, which will be resolved by the entrypoint below
COPY .env* /usr/share/nginx/html

# this entrypoint will call react-env, and then start nginx
COPY entrypoint.sh /var/entrypoint.sh
ENTRYPOINT ["/var/entrypoint.sh"]

# nginx runs at port 80
EXPOSE 80

# nginx
CMD ["nginx", "-g", "daemon off;"]
