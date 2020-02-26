FROM node:11.2-slim

WORKDIR /app

EXPOSE 4000

COPY . .

RUN npm install typescript -g
RUN npm install
#RUN npm run build

CMD ["npm", "start"]
