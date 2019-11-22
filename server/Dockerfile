FROM node:8-alpine

WORKDIR /app
RUN apk update && apk add --no-cache git
COPY package.json /app
RUN npm install && npm install --save express
RUN wget https://raw.githubusercontent.com/eficode/wait-for/master/wait-for -O /app/wait-for && chmod +x /app/wait-for
COPY . /app
