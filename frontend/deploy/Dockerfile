FROM node:24-alpine

WORKDIR /opt/extract-audio-app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "preview"]