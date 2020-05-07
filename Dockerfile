FROM node:8-alpine

WORKDIR /usr/src/app

COPY . .

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python && \
  npm install --quiet node-gyp -g &&\
  npm install --quiet && \
  apk del native-deps
  
RUN npm install

CMD ["node", "index.js"]
