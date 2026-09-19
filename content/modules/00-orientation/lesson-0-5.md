---
id: "0.5"
module: 0
order: 5
kind: lesson
title: Docker и учебная веб-цель OWASP Juice Shop
estimatedTime: 45
difficulty: beginner
skills: [linux, web-security]
prerequisites: ["0.4"]
tags: [docker, juice-shop, owasp, web, контейнеры]
quizIds: [quiz-0-5]
---

## Learning Objectives

- Объяснить, что такое контейнер и чем он отличается от VM.
- Установить Docker в Kali.
- Запустить OWASP Juice Shop на localhost как учебную веб-цель.
- Понять, почему для веба удобнее контейнер, а не отдельная VM.

## Theory

### Контейнер против VM

**Виртуальная машина** эмулирует целый компьютер с собственной ОС — тяжело, но полная изоляция. **Контейнер** запускает только приложение с его зависимостями, используя ядро хоста — легко и быстро.

| | VM | Контейнер |
|---|---|---|
| Что внутри | Целая ОС | Только приложение + зависимости |
| Вес | Гигабайты | Мегабайты |
| Старт | Минуты | Секунды |
| Изоляция | Полная | На уровне процессов |

Для веб-целей контейнер идеален: одна команда — и уязвимое приложение крутится на `localhost`.

### OWASP Juice Shop

**Juice Shop** — намеренно уязвимый интернет-магазин от OWASP, специально для обучения web security. В нём собраны все уязвимости из OWASP Top 10. Мы вернёмся к нему в M9.

```safety Juice Shop — только на localhost
Запускаем на `127.0.0.1` (localhost). Это твоя машина — тренироваться легально. Не публикуй контейнер в интернет.
```

## Command Walkthrough

Установка Docker и запуск Juice Shop:

```terminal
$ sudo apt install -y docker.io

$ sudo systemctl enable --now docker

$ sudo docker run --rm -p 127.0.0.1:3000:3000 bkimminich/juice-shop

info: Server listening on port 3000
```

`-p 127.0.0.1:3000:3000` привязывает порт **только** к localhost — снаружи контейнер недоступен. Теперь в браузере Kali открой `http://127.0.0.1:3000`.

```terminal
$ sudo docker ps

CONTAINER ID   IMAGE                    PORTS                      NAMES
a1b2c3d4e5f6   bkimminich/juice-shop    127.0.0.1:3000->3000/tcp   brave_kepler
```

## Guided Practice

```task
id: task-0-5-docker
title: Установить Docker
input: false
prompt: |
  ```bash
  sudo apt update
  sudo apt install -y docker.io
  sudo systemctl enable --now docker
  sudo docker --version
  ```

  Последняя команда должна показать версию Docker.
hints:
  - '`systemctl enable --now` включает сервис сразу и при загрузке.'
```

```task
id: task-0-5-juiceshop
title: Запустить Juice Shop
input: false
prompt: |
  ```bash
  sudo docker run --rm -p 127.0.0.1:3000:3000 bkimminich/juice-shop
  ```

  Дождись `Server listening on port 3000`, открой `http://127.0.0.1:3000` в браузере. Должен появиться магазин.
hints:
  - Первый запуск скачивает образ — это займёт пару минут.
  - Терминал останется занят логами; открой второй терминал для других команд или запусти с `-d` (detached).
solution: |
  Флаг `--rm` удаляет контейнер после остановки, `-p 127.0.0.1:3000:3000` открывает порт только на localhost. Останавливается контейнер по Ctrl+C в терминале с логами.
```

```task
id: task-0-5-localhost
title: Почему именно localhost
input: true
answers:
  - localhost
  - 127.0.0.1
answerPattern: "127\\.0\\.0\\.1|localhost"
prompt: |
  На каком IP-адресе (или его имени) мы запускаем Juice Shop, чтобы он был доступен только с нашей машины и это оставалось легальным? Введи адрес.
hints:
  - Петлевой адрес, «этот компьютер».
solution: |
  `127.0.0.1` (localhost) — петлевой интерфейс. Трафик не выходит за пределы твоей машины, поэтому тренировка легальна и безопасна.
```

## Independent Exercise

1. Запусти Juice Shop в фоне с флагом `-d` и найди контейнер через `docker ps`.
2. Останови его: `docker stop <id>`.
3. Сравни: сколько весит образ Juice Shop (`docker images`) против размера VM Kali?

## Common Mistakes

| Ошибка | Последствие |
|---|---|
| `-p 3000:3000` без `127.0.0.1` | Порт открыт для всей сети — не только тебе |
| Забыть `sudo` | Docker требует прав (или добавь себя в группу docker) |
| Путать контейнер и VM | Разные технологии и уровни изоляции |
| Оставить контейнер висеть | Занимает порт; останови ненужное |

## Summary

- **Контейнер** — лёгкая изоляция приложения; **VM** — тяжёлая изоляция целой ОС.
- Docker запускает уязвимые веб-цели одной командой.
- **OWASP Juice Shop** на `127.0.0.1:3000` — легальная веб-лаборатория.
- Привязка к localhost держит цель только у тебя.

## Quiz

```quiz
quiz-0-5
```

## Further Reading

- OWASP Juice Shop: [owasp.org/www-project-juice-shop](https://owasp.org/www-project-juice-shop/).
- Docker для начинающих: [docs.docker.com/get-started](https://docs.docker.com/get-started/).
