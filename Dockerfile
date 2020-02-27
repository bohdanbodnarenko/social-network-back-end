FROM node:11.2-slim

WORKDIR /app

EXPOSE 4000

COPY . .
COPY .env.heroku ./.env
COPY package.json ./package.json
COPY ormconfig.heroku.json ./ormconfig.json

#RUN npm install typescript -g
RUN npm install
#RUN npm run build

CMD ["npm", "start"]
