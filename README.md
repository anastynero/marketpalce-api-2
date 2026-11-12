# marketpalce-api-2
1. склонировать репозиторий
2. создать файл .env и написать там `DATABASE_URL='file:./dev.db'`
3. в терминале выполнить команды
```
npm install
npx prisma migrate dev --name init
npx prisma generate
```
