FROM node:latest
RUN mkdir -p /usr/src/recruitment-api
WORKDIR /usr/src/recruitment-api
COPY package.json /usr/src/recruitment-api/
RUN npm install && npm install -g nodemon
COPY . /usr/src/recruitment-api
EXPOSE 3000
CMD ["nodemon", "--exec", "babel-node", "src/index.js"]