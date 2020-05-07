FROM node:current-alpine

COPY . /usr/src/app

WORKDIR /usr/src/app

run apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python && \
  npm install --quiet node-gyp -g &&\
  npm install --quiet && \
  apk del native-deps
  
RUN npm install

CMD ["node", "index.js"]
