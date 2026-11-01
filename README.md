# Reseller Simulator — сайт загрузки

Статический сайт для прямой загрузки APK. Публикуется через GitHub Pages.

- **Сайт:** https://ivan1241.github.io/reseller-simulator-site/
- **APK:** https://github.com/ivan1241/reseller-simulator-site/releases/latest/download/ResellerSimulator.apk
- **Репозиторий:** https://github.com/ivan1241/reseller-simulator-site

## Как обновить APK

1. Собери новый APK в Hefesto и проверь его.
2. Открой на GitHub вкладку **Releases** → **Draft a new release**.
3. Поставь новый тег, например `v2.3.0`, и прикрепи файл с именем `ResellerSimulator.apk`.
4. Опубликуй релиз. Ссылка на сайте обновится сама, потому что она ведёт на `releases/latest/download/ResellerSimulator.apk`.
5. Если изменились версия, размер, контрольные суммы или количество товаров, обнови их в `index.html` и отправь коммит.

## Как редактировать сайт

Меняй `index.html`, `styles.css`, `app.js` и иконки. После изменений:

```bash
git add .
git commit -m "Обновить сайт"
git push
```

GitHub Actions автоматически опубликует новую версию.

## Локальная проверка

Открой `index.html` в браузере. Для проверки скачивания нужен интернет: кнопка ведёт на GitHub Releases.
