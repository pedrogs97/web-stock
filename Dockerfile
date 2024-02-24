FROM node:20

USER 0

RUN mkdir -p /web_stock/

USER $CONTAINER_USER_ID

WORKDIR /web_stock
COPY . /web_stock

RUN npm install && npm run build

RUN npm ci
