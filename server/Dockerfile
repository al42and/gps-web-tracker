FROM node:8-alpine

WORKDIR /app
COPY package.json /app
RUN npm install
RUN wget https://raw.githubusercontent.com/eficode/wait-for/master/wait-for -O /app/wait-for && chmod +x /app/wait-for
COPY . /app
