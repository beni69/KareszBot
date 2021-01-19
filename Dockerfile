FROM node

WORKDIR /code

COPY package.json /code/package.json

RUN npm i

COPY . /code

CMD [ "node", "." ]
