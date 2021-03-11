FROM node:latest
RUN mkdir -p /usr/src/frontend-admin
WORKDIR /usr/src/frontend-admin
COPY package*.json /usr/src/frontend-admin/
RUN yarn install
COPY . /usr/src/frontend-admin
EXPOSE 8080
CMD ["yarn", "dev"]