FROM node:11.2-slim

WORKDIR /app

EXPOSE 4000

COPY . .
COPY .env.docker ./.env
COPY package.json package.json
COPY ormconfig.docker.json ./ormconfig.json

RUN npm install typescript -g
RUN npm install
#RUN npm run build

CMD ["npm", "start"]

USER node