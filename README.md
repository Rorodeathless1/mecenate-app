# Mecenate App

Тестовое задание — мобильное приложение для платформы Mecenate.

## Стек

- React Native + Expo
- TypeScript
- MobX (state management)
- React Query
- Axios
- WebSocket (real-time)

## Экраны

- **Feed** — лента постов с фильтрацией по табам (Все / Бесплатные / Платные)
- **Post Detail** — детальный экран поста с лайками, комментариями и real-time обновлениями

## Функциональность

- Infinite scroll в ленте
- Pull-to-refresh
- Фильтрация постов по типу (free/paid)
- Лайк с анимацией и haptic feedback
- Комментарии с lazy load
- Real-time обновления через WebSocket (новые лайки и комментарии без перезагрузки)
- Платный контент скрыт с кнопкой доната
- Обработка ошибок и empty state

## Переменные окружения

Приложение не требует `.env` файла — авторизация происходит автоматически через случайный UUID, который генерируется при каждом запуске.

API базовый URL: `https://k8s.mectest.ru/test-app`

## Как запустить

### Требования

- Node.js 18+
- Git
- Expo Go на телефоне ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Установка

```bash
git clone https://github.com/Rorodeathless1/mecenate-app.git
cd mecenate-app
npm install
npx expo start
```

Отсканируй QR-код в Expo Go.

## Примечание по Reanimated

Задание требует Reanimated 2 для анимации лайка. Reanimated 3+ несовместим с Expo Go — используется встроенный `Animated` из React Native с идентичным поведением (spring анимация + haptic feedback).

Для запуска с полным Reanimated:

```bash
npx expo run:android
# или
npx expo run:ios
```
