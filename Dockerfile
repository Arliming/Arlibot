FROM node:8

COPY . /usr/src/app/

WORKDIR /usr/src/app/

RUN npm install

RUN ls

VOLUME /usr/src/app/

CMD ["node", "index.js"]
