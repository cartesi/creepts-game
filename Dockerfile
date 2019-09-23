FROM nginx
LABEL mantainer "Danilo Tuler (danilo@cartesi.io)"
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY dist/ /usr/share/nginx/html
