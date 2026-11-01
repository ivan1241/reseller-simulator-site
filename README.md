# Reseller Simulator — сайт загрузки

Статический сайт для прямой загрузки APK. Публикуется через GitHub Pages.

- **Сайт:** https://ivan1241.github.io/reseller-simulator-site/
- **Короткая ссылка:** https://is.gd/resellersim
- **APK:** https://github.com/ivan1241/reseller-simulator-site/releases/latest/download/ResellerSimulator.apk
- **Короткая ссылка APK:** https://is.gd/resellerapk
- **Telegram-канал разработчика:** https://t.me/resellersim
- **Репозиторий:** https://github.com/ivan1241/reseller-simulator-site

## Обновление APK

Договорённость: при выпуске новой версии агент сам публикует APK и обновляет сайт.

1. Собери новый APK в Hefesto и проверь его.
2. Скопируй файл в корень проекта как `ResellerSimulator.apk`.
3. Посчитай размер, MD5 и SHA-256.
4. Создай GitHub Release `vX.Y.Z` и прикрепи файл с именем `ResellerSimulator.apk`:

   ```bash
   gh release create vX.Y.Z ResellerSimulator.apk \
     --repo ivan1241/reseller-simulator-site \
     --title "Reseller Simulator X.Y.Z" \
     --notes "Новая версия Reseller Simulator." \
     --latest
   ```

5. Обнови в `index.html` версию, размер, SHA-256, MD5, `softwareVersion`/`fileSize` в JSON-LD и имена файлов `download="ResellerSimulator-X.Y.Z.apk"`; при необходимости обнови `lastmod` в `sitemap.xml`.
6. Закоммить и запушь `site/`; GitHub Actions опубликует страницу.
7. Проверь, что `releases/latest/download/ResellerSimulator.apk` отдаёт новый файл, а на сайте видны новые версия и контрольные суммы.

APK не версионируется в git: он хранится только в GitHub Releases. Ссылка `releases/latest/download/...` всегда ведёт на последний релиз.

## Счётчик игроков онлайн

Счётчик настоящий: запущенная игра отправляет анонимный heartbeat на публичный topic `ntfy.sh` раз в 45 секунд. Сайт опрашивает topic раз в 20 секунд и считает уникальные сессии за последние 90 секунд. Если игрок закрыл игру, отправляется `leave`.

- Topic: `reseller-sim-online-23742d83bb00a1ac9b4c74e5bc5f619a`
- В heartbeat передаются только случайный ID сессии и время.
- Без интернета счётчик показывает `—`, но игра работает офлайн.

Не публикуй в topic имена, аккаунты или другие личные данные.

## SEO и индексация

- `robots.txt` разрешает обход и указывает на `sitemap.xml`.
- В `index.html` есть canonical, Open Graph, Twitter Card и JSON-LD `SoftwareApplication`.
- `404.html` закрыт от индексации.
- Для IndexNow в корне лежит ключевой файл `03357cd0cc975231c101e1359d5293bb.txt`; после деплоя можно отправить URL через `https://api.indexnow.org/indexnow`.
- Google Search Console нужно подтвердить отдельно: добавить HTML-файл или meta-тег, который выдаст Google, затем отправить sitemap и нажать «Проверить URL» → «Запросить индексирование».

## Как редактировать сайт

Меняй `index.html`, `styles.css`, `app.js` и иконки. Ссылка «Поделиться сайтом» копирует короткий адрес `https://is.gd/resellersim`, а не URL GitHub Pages.

После изменений:

```bash
git add .
git commit -m "Обновить сайт"
git push
```

GitHub Actions автоматически опубликует новую версию.

## Локальная проверка

Открой `index.html` в браузере. Для проверки скачивания нужен интернет: кнопка ведёт на GitHub Releases. Счётчик онлайн тоже требует интернет.
