FROM node:8

COPY . /usr/src/app/

RUN npm install

WORKDIR /usr/src/app/

VOLUME /usr/src/app/

CMD ["node", "index.js"]
