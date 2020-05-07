FROM node:current-alpine

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN apk --no-cache --virtual build-dependencies add \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \
    python \
    make \
    g++

RUN npm install

CMD ["node", "index.js"]
