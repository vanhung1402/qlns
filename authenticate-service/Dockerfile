FROM node:latest
RUN mkdir -p /usr/src/authenticate-service/
WORKDIR /usr/src/authenticate-service/
COPY package.json /usr/src/authenticate-service/
RUN npm install && npm install -g nodemon
COPY . /usr/src/authenticate-service/
EXPOSE 3000
CMD ["nodemon", "app.js"]