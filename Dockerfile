FROM node:15

WORKDIR /home/moga

COPY ./ /home/moga

RUN npm install

CMD node App.js