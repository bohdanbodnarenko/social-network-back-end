FROM node

WORKDIR /app

EXPOSE 4000

COPY . .
COPY package.json ./package.json

#RUN npm install typescript -g
RUN npm install
#RUN npm run build

CMD ["npm", "start"]
