FROM node:22.8.0-alpine as build-stage

WORKDIR /app

COPY package*.json ./
COPY index.html ./
COPY vite.config.ts ./

RUN npm install

COPY src ./src
COPY public ./public

RUN npm run build

FROM nginx:alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]