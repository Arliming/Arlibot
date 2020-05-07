FROM node:8-alpine

COPY . /usr/src/app/

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python && \
  npm install --quiet node-gyp -g &&\
  npm install --quiet && \
  apk del native-deps
  
RUN npm install
WORKDIR /usr/src/app/
VOLUME /usr/src/app/
CMD ["node", "index.js"]
