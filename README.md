# Account Manager

Форма управления учетными записями на Vue 3 + TypeScript

## Стек
- Vue 3 (Composition API)
- TypeScript
- Pinia
- Bootstrap 5

## Установка
```bash
npm install
npm run dev
```

## Функционал
- Добавление/удаление учетных записей
- Два типа: Локальная и LDAP
- Валидация при потере фокуса
- Сохранение в LocalStorage
- Метки через разделитель `;`

## Особенности
- При выборе LDAP поле пароля скрывается
- Поле логин растягивается на место пароля для LDAP
- Метки преобразуются в массив объектов `{text: string}[]`
- Максимальная длина: метки - 50, логин/пароль - 100 символов

## Структура
```
src/
├── components/
│   ├── AccountForm.vue    # Основная форма
│   └── AccountItem.vue    # Элемент списка
├── stores/
│   └── accountStore.ts    # Хранилище Pinia
├── types/
│   └── account.ts         # TypeScript типы
└── main.ts
```

## Сборка
```bash
npm run build
```