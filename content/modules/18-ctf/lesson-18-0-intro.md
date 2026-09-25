---
id: "18.0"
module: 18
order: 0
kind: lesson
title: "Введение — CTF соревнования"
estimatedTime: 30
difficulty: intermediate
skills: []
tags: [ctf, jeopardy, hackthebox, tryhackme, writeup]
---

## Обзор темы

CTF (Capture The Flag) — соревновательный формат кибербезопасности где нужно найти и захватить «флаг» — строку доказывающую что ты решил задачу или скомпрометировал систему. CTF — лучшая непрерывная практика: задания охватывают все области (web, crypto, pwn, reverse, forensics, misc), прогресс измерим, community огромное.

Два основных формата: Jeopardy (независимые задачи по категориям, чем сложнее — тем больше очков) и Attack-Defense (команды атакуют инфраструктуру друг друга и защищают свою). CTFtime.org — главный ресурс: календарь соревнований, рейтинги команд, архив writeup'ов. Writeup'ы других участников — бесценный источник обучения.

## Почему это важно для кибербеза

- **Практика без рисков** → реальные техники в безопасной среде, структурированные задания.
- **Portfolio** → CTF профиль и writeup'ы демонстрируют работодателю реальные навыки лучше сертификата.
- **Community** → Discord серверы команд, writeup блоги — лучшее техническое community в кибербезе.
- **Покрытие всех областей** → CTF заставляет развиваться в областях где слаб (не только веб если ты веб-специалист).
- **Подготовка к OSCP** → Buffer overflow задания в CTF = прямая подготовка к OSCP экзамену.

## Ресурсы

```resources
books:
  - title: "CTF Field Guide"
    url: https://trailofbits.github.io/ctf/
    note: "Бесплатно онлайн — методология CTF от Trail of Bits"
  - title: "The CTF Primer"
    url: https://primer.picoctf.org
    note: "Бесплатно, от команды picoCTF — введение для начинающих"
platforms:
  - name: CTFtime.org
    url: https://ctftime.org
    note: "Календарь соревнований, рейтинги, архив writeup'ов"
  - name: picoCTF
    url: https://picoctf.org
    note: "Постоянная платформа с 400+ задач, идеально для начала"
  - name: HackTheBox
    url: https://app.hackthebox.com
    note: "Machines и Challenges — лучший Jeopardy-style CTF"
  - name: pwn.college
    url: https://pwn.college
    note: "Специализация на binary exploitation"
tools:
  - name: CyberChef
    url: https://gchq.github.io/CyberChef/
    note: "Обязательный инструмент для Crypto/Misc задач"
  - name: pwntools
    url: https://github.com/Gallopsled/pwntools
    note: "Python framework для Pwn задач"
  - name: Ghidra / IDA Free
    url: https://ghidra-sre.org
    note: "Reverse Engineering задания"
videos:
  - name: "IppSec — HackTheBox Walkthroughs"
    url: https://www.youtube.com/@ippsec
    note: "YouTube, сотни подробных writeup видео"
  - name: "LiveOverflow — CTF"
    url: https://www.youtube.com/@LiveOverflow
    note: "YouTube, crypto/pwn/re CTF writeups с объяснением"
```

## Практические задания

1. **picoCTF** ([picoctf.org](https://picoctf.org)) — реши 20 задач любых категорий, начни с beginner.
2. **HackTheBox**: заверши 5 retired easy machines, напиши writeup для каждой.
3. **CTFtime**: зарегистрируйся и участвуй в ближайшем online CTF с рейтингом 25+ — даже не решив ни одной задачи, ты увидишь как это работает.
4. **Напиши writeup**: опубликуй решение одной задачи в своём GitHub или блоге.

## Чекпоинт

Готов идти дальше если можешь:
- Решить 50+ задач на picoCTF охватывая минимум 4 категории
- Завершить 3 HackTheBox машины самостоятельно без writeup
- Написать и опубликовать 2 writeup'а — это учит структурировать решения
- Объяснить методологию подхода к незнакомой задаче в любой категории
