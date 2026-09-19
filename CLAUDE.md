# CLAUDE.md — руководство для Claude Code

Этот файл читается Claude Code при работе в репозитории. Он описывает, что это за проект, как он устроен и как его безопасно расширять.

## Что это

Локальное/хостируемое учебное веб-приложение **Cybersecurity Academy** для самостоятельного курса «Python + Kali Linux для Cybersecurity». Весь UI — на русском, тёмная тема. Прогресс хранится в браузере (localStorage), бэкенда нет.

Ключевой принцип: **контент отделён от кода**. Тексты уроков, квизы, задачи, справочники лежат в `content/` (Markdown + YAML) и подхватываются автоматически. В компонентах `src/` нет текста уроков.

## Стек

React 19 · TypeScript (strict) · Vite 8 · Tailwind CSS v4 · react-router (HashRouter) · react-markdown · Vitest.

## Команды

| Команда | Назначение |
|---|---|
| `npm run dev` | Dev-сервер (http://localhost:5173) |
| `npm run build` | Production-сборка в `dist/` |
| `npm run build:single` | Одна самодостаточная HTML-страница в `dist-single/` (для хостинга) |
| `npm run preview` | Просмотр собранной версии |
| `npm run typecheck` | Проверка типов |
| `npm run test` | Тесты (Vitest) |
| `npm run check` | Всё сразу: типы + тесты + сборка. **Запускай перед коммитом.** |

## Архитектура

```
content/                 весь контент (Markdown + YAML) — правится чаще всего
  course.yaml            фазы + список всех 18 модулей
  skills.yaml projects.yaml labs.yaml challenges.yaml resources.yaml
  commands.yaml tools.yaml
  quizzes/quiz-*.yaml
  modules/NN-slug/module.md + lesson-*.md
src/
  content/               движок контента
    types.ts             модель данных (единственный источник истины по типам)
    parse.ts             frontmatter, YAML, slugify, splitSections
    loader.ts            buildCourse() собирает Course; validateCourse() проверяет ссылки
    index.ts             import.meta.glob подхватывает все файлы из /content
  lib/
    progress.tsx         ProgressProvider + useProgress (localStorage)
    selectors.ts         статусы, блокировки модулей, проценты
    search.ts            индекс и поиск (Ctrl+K)
  components/            UI, Markdown-рендер, карточки задач/квизов, Sidebar, Layout
  pages/                 страницы под каждый маршрут
  App.tsx main.tsx styles/index.css
```

Поток данных: файлы `/content` → `import.meta.glob` (`src/content/index.ts`) → `buildCourse` → объект `course` → страницы читают из него через хелперы (`lessonById`, `moduleByNumber`, и т.д.).

## Как добавлять контент

Подробные форматы — в `README.md` (разделы «Как добавлять контент»). Кратко:

- **Урок**: новый `content/modules/NN-slug/lesson-*.md` с frontmatter (`id`, `module`, `order`, `kind`, `title`, …) и телом Markdown. Появляется в дереве автоматически.
- **Спецблоки в уроке**: ` ```terminal ` (не выполняется), ` ```task ` (YAML → интерактивная карточка), ` ```quiz ` (id квиза), ` ```info|warning|safety|tip ` (callout).
- **Квиз**: `content/quizzes/quiz-*.yaml` (`questions[].answer` — индекс с 0).
- **Модуль**: запись в `course.yaml` + папка с `module.md`. Модуль становится «доступным», когда в нём есть хотя бы один урок.
- **Проект/лаборатория/challenge**: правка `projects.yaml` / `labs.yaml` / `challenges.yaml`.

Каждый `id` (урока, задачи, квиза, проекта…) должен быть уникален по всему курсу.

## Правила и подводные камни (важно!)

1. **YAML и двоеточие.** Если значение содержит `: ` (двоеточие с пробелом) или начинается со спецсимвола — бери его в кавычки: `explanation: "Linux: основы"`. Иначе парсер решит, что это вложенный ключ, и сборка упадёт.
2. **`import.meta.glob`.** Второй аргумент обязан быть инлайн-объектом (`{ import: 'default', eager: true }`), не переменной — иначе dev-сервер Vite падает.
3. **Плагин `rawContent`** в `vite.config.ts` читает `.md`/`.yaml` как строки. Не удаляй его — на Vite 8/rolldown встроенный `?raw` для yaml ломается.
4. **strict TS + noUnusedLocals.** Неиспользуемые импорты/переменные ломают сборку. Убирай их сразу.
5. **Amber (#e8b04b)** зарезервирован для акцентов «следующее действие / прогресс». Не используй его для декора.
6. **HashRouter** выбран намеренно (портируемая сборка). Маршруты вида `#/lessons/0.1`.

## После изменений

Всегда прогоняй `npm run check` перед коммитом. Валидатор контента (`validateCourse`) при старте в dev-режиме пишет проблемы в консоль браузера и на страницу «Прогресс и настройки».

## Деплой

- Статический хостинг: `npm run build` → залить `dist/` (см. `.github/workflows/deploy.yml` для GitHub Pages).
- Одна HTML-страница: `npm run build:single` → `dist-single/index.html` (самодостаточный файл, работает где угодно).
