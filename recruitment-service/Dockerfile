FROM  public.ecr.aws/docker/library/node:lts
RUN mkdir -p /usr/src/recruitment-service/
WORKDIR /usr/src/recruitment-service/
COPY package.json /usr/src/recruitment-service/
RUN npm install && npm install -g nodemon
COPY . /usr/src/recruitment-service/
EXPOSE 3000
CMD ["nodemon", "--exec", "babel-node", "src/index.js"]
