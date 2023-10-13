FROM public.ecr.aws/docker/library/node:lts
RUN mkdir -p /usr/src/admin-frontend/
WORKDIR /usr/src/admin-frontend/
COPY package*.json /usr/src/admin-frontend/
RUN yarn install
COPY . /usr/src/admin-frontend/
EXPOSE 8080
CMD ["yarn", "dev"]
