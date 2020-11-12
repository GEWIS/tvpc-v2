FROM node:12

WORKDIR /usr/src/tvpc-v2-backend
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3939
CMD [ "node", "." ]
