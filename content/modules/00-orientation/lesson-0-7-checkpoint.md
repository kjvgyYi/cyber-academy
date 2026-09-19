---
id: "0.cp"
module: 0
order: 7
kind: checkpoint
title: Checkpoint — стенд собран
estimatedTime: 30
difficulty: beginner
skills: [cybersecurity, kali, linux]
prerequisites: ["0.6"]
tags: [проверка, стенд, итог]
quizIds: [quiz-0-cp]
---

## Learning Objectives

Это контрольная точка модуля. Пройди её, когда закончил уроки 0.1–0.6. Цель — убедиться, что стенд действительно работает и ты понимаешь, что построил.

## Self-Check

Отметь каждый пункт, только если он реально сделан на твоей машине.

```task
id: task-0-cp-vm
title: Kali в VM
input: false
prompt: |
  Kali Linux запускается в VirtualBox, `systemd-detect-virt` возвращает `oracle`, есть снапшот «clean-install».
```

```task
id: task-0-cp-target
title: Изолированная цель
input: false
prompt: |
  Metasploitable 2 поднята в host-only сети, Kali её пингует (`0% packet loss`), а сама цель **не имеет** доступа в интернет.
```

```task
id: task-0-cp-web
title: Веб-лаборатория
input: false
prompt: |
  Docker установлен, OWASP Juice Shop открывается на `http://127.0.0.1:3000`.
```

```task
id: task-0-cp-git
title: Портфолио
input: false
prompt: |
  Репозиторий `cyber-course` создан, заметки по M0 отправлены (`push`) на GitHub.
```

## Guided Practice

Итоговое задание: опиши свой стенд своими словами.

```task
id: task-0-cp-describe
title: Схема стенда
input: false
prompt: |
  В `cyber-course/module-0/lab-setup.md` опиши схему:

  - Какие VM у тебя есть и какие у них адаптеры (host-only / NAT).
  - IP-адреса Kali и Metasploitable в host-only сети.
  - Почему Metasploitable изолирована от интернета.
  - Как запускается Juice Shop.

  Закоммить и запушь файл. Это первый элемент проекта **Lab Setup**.
hints:
  - Нарисуй словами: «Kali (host-only 192.168.56.x + NAT) ↔ Metasploitable (host-only, без интернета)».
solution: |
  Хороший ответ показывает, что ты понимаешь принцип изоляции: атакующая машина имеет выход наружу для обновлений, уязвимая цель — нет, а тренировочный трафик замкнут внутри host-only сети и localhost.
```

## Security Challenge

```warning Проверь понимание изоляции
Друг предлагает: «Давай выложим твой Juice Shop в интернет по твоему белому IP, чтобы потренироваться удалённо».

1. В чём проблема с точки зрения безопасности?
2. В чём возможная проблема с точки зрения закона?
3. Как потренироваться удалённо легально и безопасно?
```

## Quiz

```quiz
quiz-0-cp
```

## Summary

Если все четыре пункта self-check отмечены — **модуль 0 пройден**. У тебя есть изолированная, легальная и воспроизводимая лаборатория. Дальше — модуль 1: основы информационной безопасности.

## Further Reading

- OWASP про безопасную лабораторию: [owasp.org](https://owasp.org/).
- Обзор методологии обучения на уязвимых машинах: [vulnhub.com](https://www.vulnhub.com/).
