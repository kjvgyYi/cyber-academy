---
id: "0.6"
module: 0
order: 6
kind: lesson
title: Git и GitHub для заметок и портфолио
estimatedTime: 45
difficulty: beginner
skills: [linux, automation]
prerequisites: ["0.5"]
tags: [git, github, версионирование, портфолио, markdown]
quizIds: [quiz-0-6]
---

## Learning Objectives

- Объяснить, зачем в cybersecurity нужен контроль версий.
- Настроить Git и сделать первый коммит.
- Создать репозиторий на GitHub и связать его с локальным.
- Начать вести заметки курса как основу будущего портфолио.

## Theory

### Зачем Git

**Git** — система контроля версий: она хранит историю изменений файлов. Для тебя это два практических смысла:

- **Заметки и скрипты** — история правок, ничего не теряется, можно откатиться.
- **Портфолио** — публичный GitHub с проектами курса. Для поиска Ausbildung/работы в Германии это прямое доказательство навыков работодателю.

**GitHub** — облачный хостинг Git-репозиториев. Git работает локально, GitHub хранит копию в облаке и показывает её людям.

### Базовые понятия

| Термин | Что это |
|---|---|
| Repository (repo) | Папка проекта под контролем Git |
| Commit | Сохранённый снимок изменений с описанием |
| Push | Отправить коммиты на GitHub |
| Clone | Скачать репозиторий к себе |

## Command Walkthrough

Разовая настройка Git (имя и почта попадут в историю коммитов):

```terminal
$ git config --global user.name "Vasya"

$ git config --global user.email "you@example.com"

$ cd ~/cyber-course

$ git init

Initialized empty Git repository in /home/kali/cyber-course/.git/

$ git add .

$ git commit -m "Заметки по модулю 0"

[main (root-commit) a1b2c3d] Заметки по модулю 0
 3 files changed, 12 insertions(+)
```

Связать с GitHub (после создания пустого репозитория на сайте):

```terminal
$ git remote add origin https://github.com/USERNAME/cyber-course.git

$ git push -u origin main

… Branch 'main' set up to track 'origin/main'.
```

## Guided Practice

```task
id: task-0-6-config
title: Настроить Git
input: false
prompt: |
  ```bash
  sudo apt install -y git
  git config --global user.name "Твоё имя"
  git config --global user.email "твоя почта"
  git config --list
  ```

  Последняя команда покажет твои настройки.
hints:
  - Почта может быть любой; для приватности GitHub даёт noreply-адрес в настройках.
```

```task
id: task-0-6-firstcommit
title: Первый коммит
input: true
answers:
  - git init
answerPattern: "git\\s+init"
prompt: |
  Ты в папке `~/cyber-course`. Какой командой превратить её в Git-репозиторий (инициализировать)? Введи команду.
hints:
  - Два слова, «инициализация».
solution: |
  `git init` создаёт скрытую папку `.git`, и с этого момента Git отслеживает изменения. Дальше: `git add .` и `git commit -m "..."`.
```

```task
id: task-0-6-github
title: Репозиторий на GitHub
input: false
prompt: |
  1. Зарегистрируйся/войди на [github.com](https://github.com).
  2. Создай **новый пустой** репозиторий `cyber-course` (без README, чтобы не было конфликта).
  3. Свяжи и отправь:

  ```bash
  git remote add origin https://github.com/USERNAME/cyber-course.git
  git branch -M main
  git push -u origin main
  ```
hints:
  - Замени USERNAME на свой логин GitHub.
  - При запросе пароля используй Personal Access Token, а не пароль аккаунта (так теперь требует GitHub).
solution: |
  После `push` обнови страницу репозитория на GitHub — там появятся твои файлы. Это первый кирпич портфолио.
```

## Independent Exercise

1. Добавь в репозиторий `README.md` с описанием: что за курс, чему учишься.
2. Сделай отдельный коммит и запушь его.
3. Заведи файл `.gitignore` и добавь туда `*.tmp` — разберись, зачем он нужен.

## Common Mistakes

| Ошибка | Правильно |
|---|---|
| Коммитить пароли/токены в репозиторий | Никогда; используй `.gitignore` и секреты вне репо |
| `git push` без настроенного remote | Сначала `git remote add origin ...` |
| Создать репо с README, потом push пустого | Конфликт; создавай пустой или сделай `git pull` сначала |
| Коммит без `-m` | Откроется редактор; добавляй понятное сообщение |

## Summary

- **Git** хранит историю; **GitHub** публикует её и строит портфолио.
- Цикл: `git add` → `git commit -m "..."` → `git push`.
- Заметки курса на GitHub = доказательство навыков для работодателя.
- Секреты и пароли в репозиторий не коммитим.

## Quiz

```quiz
quiz-0-6
```

## Further Reading

- Интерактивный тренажёр Git: [learngitbranching.js.org](https://learngitbranching.js.org/).
- GitHub про Personal Access Tokens: [docs.github.com](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).
