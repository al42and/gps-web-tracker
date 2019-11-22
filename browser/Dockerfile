FROM node:8-alpine AS builder

WORKDIR /app
RUN npm install -g grunt && apk update && apk add --no-cache git
COPY package.json /app
RUN yarn install
COPY . /app
RUN grunt

FROM nginx:1.17-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder /app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

