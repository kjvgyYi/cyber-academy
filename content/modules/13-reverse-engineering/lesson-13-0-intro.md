---
id: "13.0"
module: 13
order: 0
kind: lesson
title: "Введение — Reverse Engineering"
estimatedTime: 30
difficulty: advanced
skills: []
tags: [reverse-engineering, ghidra, gdb, assembly, crackme]
---

## Обзор темы

Reverse Engineering — умение читать программу без исходного кода. Компилятор переводит C/C++ в машинный код, RE идёт в обратном направлении: от байтов к пониманию логики. Это навык применяемый в malware analysis (понять что делает подозрительный бинарник), vulnerability research (найти баг в проприетарном ПО), CTF (crackme, pwn задания), exploit dev.

Инструменты: Ghidra (статический анализ, декомпиляция), GDB с расширениями (динамический анализ — смотришь что происходит при запуске), radare2 (command-line альтернатива). Работа начинается с понимания форматов PE (Windows .exe) и ELF (Linux), затем x86/x64 ассемблер — без него декомпилятор Ghidra не поможет осмыслить нетривиальный код.

## Почему это важно для кибербеза

- **Malware Analysis** → без RE нельзя понять что делает неизвестный бинарник.
- **CTF Pwn/Rev категории** → требуют RE навыков на каждом соревновании.
- **Exploit Development** (M14) → невозможен без понимания ассемблера и памяти процесса.
- **License/DRM bypass research** → легальный RE в рамках собственного ПО или CTF.
- **Bug Bounty** → некоторые программы включают мобильные приложения (APK reverse engineering).

## Ресурсы

```resources
books:
  - title: "Hacking: The Art of Exploitation"
    author: "Jon Erickson"
    note: "No Starch Press — лучшее введение в x86, shellcode, exploit dev"
  - title: "Practical Malware Analysis"
    author: "Sikorski, Honig"
    note: "No Starch Press — RE в контексте malware"
  - title: "The IDA Pro Book"
    author: "Chris Eagle"
    note: "No Starch Press — для тех кто работает с IDA Pro"
platforms:
  - name: pwn.college
    url: https://pwn.college
    note: "Бесплатный курс по RE и binary exploitation от ASU"
  - name: crackmes.one
    url: https://crackmes.one
    note: "База crackme задач по сложности и платформе"
  - name: Reversing.kr
    url: http://reversing.kr
    note: "Задачи по reverse engineering"
tools:
  - name: Ghidra
    url: https://ghidra-sre.org
    note: "NSA open source RE suite, бесплатная альтернатива IDA Pro"
  - name: GDB + GEF
    url: https://github.com/hugsy/gef
    note: "GDB Enhanced Features — расширение для exploit dev"
  - name: Cutter
    url: https://cutter.re
    note: "GUI для radare2, хорош для начинающих"
videos:
  - name: "LiveOverflow — Binary Hacking"
    url: https://www.youtube.com/@LiveOverflow
    note: "YouTube, лучший канал по RE и binary exploitation"
  - name: "stacksmashing — Reverse Engineering"
    url: https://www.youtube.com/@stacksmashing
    note: "YouTube, hardware и software RE"
```

## Практические задания

1. **pwn.college** ([pwn.college](https://pwn.college)) — начни с "Program Misuse" и "Assembly Crash Course" модулей.
2. **crackmes.one**: найди beginner crackme для Linux, реверсни с Ghidra — найди проверку пароля.
3. **GDB + GEF**: скомпилируй простой C код с паролем, запусти в GDB, найди пароль через `disass` + breakpoint.
4. **Ghidra**: открой любой ELF бинарник из /usr/bin, найди функцию `main`, изучи её декомпиляцию.

## Чекпоинт

Готов идти дальше если можешь:
- Прочитать x86 ассемблер функции и объяснить что она делает
- Решить 3 beginner crackme самостоятельно используя Ghidra
- Установить breakpoint в GDB, посмотреть содержимое регистров и стека
- Объяснить разницу между статическим и динамическим анализом
