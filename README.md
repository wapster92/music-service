## SPA с музыкой
[Посмотреть демо](http://185.229.227.69/)

### Установка

```
git clone https://github.com/wapster92/music-service.git
npm i
npm run start
cd front/
npm i
npm run build
```
### Основные возможности
1. Регистрация и авторизация
2. Удаление аккаунта
3. Загрузка аватарки
4. Создание и удаление плейлистов
5. Добавление треков в плейлист
6. Загрузка музыки
7. Прослушывание музыки

### Описание
Небольшой, но достаточно сложный проект на Vue. Применяется Vue-Router и Vuex. В верстке использовал grid layout, flexbox, BEM нейминг в scss каждый блок выделен и достаточно легко находить нужный и делать исправления в том числе медиа-запросы. Так же пришлось углубиться немного в backend. Использовал фреймворк express и mongoDB в качестве базы данных. Хотел бы выделить то, что при запущенном проигрывании переходя по страницам плеер не останавливает свою работу и будет проигрывать музыку из списка песен на котором был запущен. Лайки пока не работают.