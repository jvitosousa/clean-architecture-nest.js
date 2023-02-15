FROM node:14.15.4-alpine3.12

RUN npm install -g @nestjs/cli@8.0.0

USER node

WORKDIR /home/node/app

COPY . .

USER root

RUN npm install

RUN chmod +x /home/node/app/init.sh

USER node

ENTRYPOINT [ "sh", "./init.sh" ] 
