FROM node:22.8.0-alpine

WORKDIR /app

# Установка зависимостей для сборки
RUN apk add --no-cache python3 make g++

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы
COPY . .

# Собираем проект
RUN npm run build

# Проверяем, что файлы собрались
RUN ls -la dist/

EXPOSE 3000

CMD ["node", "dist/server.js"]