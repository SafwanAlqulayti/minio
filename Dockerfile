FROM node:12.18.4

WORKDIR /docker

ENV PORT 80

COPY package.json /docker/package.json

RUN npm install

COPY . /docker

CMD [ "node" , "src/main.ts" ]