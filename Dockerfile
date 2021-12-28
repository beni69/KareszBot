FROM node

WORKDIR /code

COPY package.json /code/package.json

RUN npm i

COPY . /code

RUN npm run build

CMD [ "node", "dist/index.js" ]
