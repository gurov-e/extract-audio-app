FROM node:24-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /opt/extract-audio-app

COPY backend/package*.json ./

RUN npm install
RUN npm install @types/multer@2.1.0

COPY backend/ .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]