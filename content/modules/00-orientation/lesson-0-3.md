---
id: "0.3"
module: 0
order: 3
kind: lesson
title: Первые шаги в терминале Kali
estimatedTime: 45
difficulty: beginner
skills: [linux, kali]
prerequisites: ["0.2"]
tags: [терминал, навигация, команды, файловая-система]
quizIds: [quiz-0-3]
---

## Learning Objectives

- Ориентироваться в терминале и понимать структуру приглашения Kali.
- Перемещаться по файловой системе и создавать файлы/папки.
- Читать вывод команд и понимать абсолютные/относительные пути.
- Обновить систему через пакетный менеджер.

## Theory

### Терминал — основной инструмент

В cybersecurity почти всё делается в терминале: он быстрее, скриптуется и работает по SSH. Приглашение Kali выглядит так:

```text
┌──(kali㉿student)-[~]
└─$
```

`kali` — пользователь, `student` — имя хоста, `~` — текущая папка (домашняя). После `$` ты вводишь команды.

### Файловая система Linux

Всё начинается от корня `/`. Ключевые папки, которые встретишь сразу:

| Путь | Что это |
|---|---|
| `/` | Корень всей системы |
| `/home/kali` (он же `~`) | Твоя домашняя папка |
| `/etc` | Конфигурационные файлы |
| `/var/log` | **Логи** — сюда мы вернёмся в анализе |
| `/tmp` | Временные файлы |

**Абсолютный путь** начинается от `/` (`/var/log/auth.log`). **Относительный** — от текущей папки (`log/auth.log`).

## Command Walkthrough

Базовая навигация — попробуй каждую команду в своей Kali:

```terminal
$ pwd

/home/kali

$ ls

Desktop  Documents  Downloads  Pictures

$ cd /tmp

$ pwd

/tmp

$ cd ~

$ mkdir lab-notes

$ ls -la lab-notes

total 8
drwxr-xr-x 2 kali kali 4096 ...  .
drwxr-xr-x ... kali kali 4096 ...  ..
```

Разбор ключевых команд:

| Команда | Действие |
|---|---|
| `pwd` | Показать текущую папку (print working directory) |
| `ls` | Список файлов; `ls -la` — подробно и со скрытыми |
| `cd путь` | Перейти в папку; `cd ~` — домой, `cd ..` — на уровень вверх |
| `mkdir имя` | Создать папку |
| `cat файл` | Вывести содержимое файла |
| `clear` | Очистить экран (Ctrl+L) |

## Guided Practice

```task
id: task-0-3-navigate
title: Навигация
input: true
answers:
  - pwd
prompt: |
  Какой командой узнать, в какой папке ты сейчас находишься? Введи её.
hints:
  - Три буквы, print working directory.
solution: |
  `pwd` выводит абсолютный путь текущей папки.
```

```task
id: task-0-3-create
title: Создать рабочую папку
input: false
prompt: |
  В домашней папке создай структуру для заметок курса:

  ```bash
  cd ~
  mkdir -p cyber-course/module-0
  cd cyber-course/module-0
  echo "Мои заметки по M0" > notes.md
  cat notes.md
  ```

  Убедись, что `cat` показал текст.
hints:
  - '`echo "текст" > файл` создаёт файл с этим текстом.'
  - '`-p` у mkdir создаёт вложенные папки за один раз.'
```

```task
id: task-0-3-update
title: Обновить систему
input: false
prompt: |
  Обнови списки пакетов и систему (это часто первое, что делают на свежей Kali):

  ```bash
  sudo apt update
  sudo apt upgrade -y
  ```

  Пароль по умолчанию — `kali`.
hints:
  - '`apt update` обновляет списки, `apt upgrade` — сами пакеты.'
solution: |
  `apt update` синхронизирует список доступных версий с репозиториями, `apt upgrade` устанавливает новые версии уже установленных пакетов. Первый запуск может занять несколько минут.
```

## Independent Exercise

1. Создай в `cyber-course` папки `module-0`, `module-1`, `notes`.
2. Одной командой (`ls -R cyber-course`) покажи всё дерево.
3. Разберись, что делает `cd -` (переход в предыдущую папку).

## Common Mistakes

| Ошибка | Правильно |
|---|---|
| Путаница `/` и `~` | `/` — корень системы, `~` — домашняя папка |
| `cd Downloads` из любой папки | Относительный путь работает только если `Downloads` рядом |
| Забыть `sudo` для apt | Установка пакетов требует прав root |

## Summary

- Терминал — главный инструмент; приглашение показывает пользователя, хост и папку.
- Навигация: `pwd`, `ls`, `cd`, `mkdir`, `cat`.
- Абсолютные пути от `/`, относительные — от текущей папки.
- `sudo apt update && sudo apt upgrade` — обновление системы.

## Quiz

```quiz
quiz-0-3
```

## Further Reading

- Интерактивный тренажёр команд: [linuxjourney.com](https://linuxjourney.com/).
- Kali docs: [kali.org/docs](https://www.kali.org/docs/).
