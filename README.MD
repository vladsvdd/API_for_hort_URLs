## Запуск проекта

В корне проекта выполните команду:
```bash
docker-compose up --build -d
```

После запуска:
- Бэкенд будет доступен на порту 3000 http://localhost:3000
- Фронтенд будет доступен на порту 8080 http://localhost:8080
- PostgreSQL будет доступен на порту 5432

## Использование

1. Откройте в браузере http://localhost:8080
2. Введите URL для сокращения
3. Используйте полученную короткую ссылку
4. Просматривайте статистику и управляйте ссылками через интерфейс

## Тестирование

Для запуска тестов бэкенда:
```bash
docker-compose run --rm backend npm test
```

Этот код предоставляет полную реализацию URL-сокращателя с:
1. Созданием коротких ссылок
2. Переадресацией
3. Просмотром статистики
4. Удалением ссылок
5. Аналитикой переходов
6. Пользовательским интерфейсом на Vue.js

Остановка контенеров:
```bash
docker-compose down
```

Если нужно очистить контейнера и сразу запустить тест:
```bash
# 1. Очистка
docker-compose down -v --remove-orphans
docker system prune -f
rm -rf node_modules package-lock.json

# 2. Пересборка
docker-compose build --no-cache

# 3. Запуск тестов
docker-compose run --rm backend npm install
docker-compose run --rm backend npm run build
docker-compose run --rm backend npm test tests/url.test.ts --verbose --detectOpenHandles
```