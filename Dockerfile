# build stage
FROM node:18

RUN apt update
RUN apt install dumb-init

WORKDIR /usr/src/app
COPY package*.json ./

# USER node
COPY . .
RUN npm install
RUN npm run build

ENV PORT=8000
EXPOSE 8000

CMD ["dumb-init", "node", "dist/index.js" ]
