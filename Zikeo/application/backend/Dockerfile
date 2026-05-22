FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Nodemon pour hot reload
RUN npm install -g nodemon


COPY . .

EXPOSE 5000

CMD ["nodemon", "-L", "server.js"]