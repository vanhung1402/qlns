FROM node:latest
RUN mkdir -p /usr/src/authenticate-api
WORKDIR /usr/src/authenticate-api
COPY package.json /usr/src/authenticate-api/
RUN npm install && npm install -g nodemon
COPY . /usr/src/authenticate-api
EXPOSE 3000
CMD ["nodemon", "app.js"]