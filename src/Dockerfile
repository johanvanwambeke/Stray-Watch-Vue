FROM node:alpine

# Create app directory
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/

COPY . .
RUN npm install && npm run build

ENV HOST 0.0.0.0
EXPOSE 3000
CMD [ "npm", "run", "start"]