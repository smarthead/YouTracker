# YouTracker — тайм-трекер для YouTrack

## Установка

- [Скачать для Windows](https://youtracker.smarthead.ru/YouTracker-installer.exe)
- [Скачать для macOS](https://youtracker.smarthead.ru/YouTracker.dmg)
- [Скачать для Linux](https://youtracker.smarthead.ru/YouTracker.AppImage)

После установки приложение обновляется автоматически.


## Разработка

YouTracker разработан на [Electron](https://electronjs.org) и [React](https://reactjs.org).

Дистрибутивы распространяются через Amazon S3.


### Инструкции

1. `git clone https://gitlab.smarthead.ru/youtrack/youtracker.git`
2. `cd youtracker`
3. `npm install && npm run rebuild-native`
4. `npm start`

### Доступные скрипты

#### `npm start`
Запускает приложение в режиме разработки.

#### `npm run build`
Собирает приложение в папку `build`.

#### `npm run rebuild-native`
Пересобирает нативные модули. Рекомендуется вызывать после `npm install`.

#### `npm run publish`
Собирает, упаковывает приложение для релиза и отправляет обновленную версию на
S3.
