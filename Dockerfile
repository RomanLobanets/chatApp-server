FROM node:12-alpine
WORKDIR /app
COPY package-lock.json .
COPY package.json .
RUN apk update && apk add bash
RUN npm install
COPY dist .
COPY wait-for-it.sh .
CMD node index.js