FROM node:10-slim

EXPOSE 3000

WORKDIR /node

COPY package*.json ./

# create app dir and chown as root for node:node
RUN mkdir app && chown -R node:node .

# change to user node
USER node

# run npm install as node user
RUN npm install && npm cache clean --force

WORKDIR /node/app

COPY --chown=node:node . .
CMD ["node", "app.js"]

