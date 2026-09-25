---
id: "2.0"
module: 2
order: 0
kind: lesson
title: "Введение — Linux для кибербеза"
estimatedTime: 30
difficulty: beginner
skills: []
tags: [linux, filesystem, permissions, processes, logs]
---

## Обзор темы

Linux — операционная система на которой работают веб-серверы, облачные платформы, маршрутизаторы, смартфоны и суперкомпьютеры. Как атакующий — твоя цель, как защитник — твоя среда работы, как пентестер — твой основной инструмент (Kali = Debian Linux). Без уверенного владения Linux прогресс в кибербезе упирается в стену на каждом шагу.

Модуль построен вокруг ключевых концепций: иерархия файловой системы FHS (зачем /etc, /var/log, /tmp), модель прав доступа DAC (rwx, SUID/SGID, sticky bit), управление процессами (fork, exec, signals, namespaces), система логирования (syslog, journald, auth.log). Это фундамент как для атак (privilege escalation через SUID), так и для защиты (audit trail в логах).

## Почему это важно для кибербеза

- **Privilege Escalation**: SUID-бинари, sudo misconfig, cron jobs с world-writable scripts — всё требует понимания прав Linux.
- **Log Analysis**: auth.log, syslog, /var/log/apache2 — основные источники для SIEM и IR. Нельзя их читать не зная формата.
- **Persistence**: атакующий добавляет backdoor в crontab, ~/.bashrc или /etc/profile. Defender ищет именно там.
- **Forensics**: при IR нужно быстро найти изменённые файлы (`find -newer`), подозрительные процессы, необычные SUID-файлы.
- **Kali и все инструменты** — это Linux. Терминал — основной интерфейс работы.

## Ресурсы

```resources
books:
  - title: "The Linux Command Line"
    author: "William Shotts"
    note: "Лучшая книга по Linux CLI, бесплатно на linuxcommand.org"
  - title: "Linux Basics for Hackers"
    author: "OccupyTheWeb"
    note: "No Starch Press — Linux специально с точки зрения кибербеза"
  - title: "How Linux Works"
    author: "Brian Ward"
    note: "No Starch Press — внутреннее устройство Linux"
platforms:
  - name: OverTheWire Bandit
    url: https://overthewire.org/wargames/bandit/
    note: "Wargame специально для изучения Linux commands, 34 уровня"
  - name: TryHackMe — Linux Fundamentals
    url: https://tryhackme.com/module/linux-fundamentals
    note: "3-частный модуль, полностью бесплатно"
  - name: Linux Journey
    url: https://linuxjourney.com
    note: "Интерактивный сайт по Linux с нуля"
tools:
  - name: man pages
    url: https://man7.org/linux/man-pages/
    note: "Документация всех Linux команд и системных вызовов"
  - name: explainshell.com
    url: https://explainshell.com
    note: "Объясняет любую shell команду по частям"
videos:
  - name: "tutoriaLinux на YouTube"
    url: https://www.youtube.com/@tutoriaLinux
    note: "Глубокое погружение в Linux internals"
  - name: "NetworkChuck — Linux for Hackers"
    url: https://www.youtube.com/playlist?list=PLIhvC56v63IJIujb5cyE13oLuyORZpdkL
    note: "Playlist с фокусом на практику"
```

## Практические задания

1. **OverTheWire Bandit** ([overthewire.org/wargames/bandit](https://overthewire.org/wargames/bandit/)) — пройди уровни 0-20, это лучший способ выучить команды через практику.
2. **TryHackMe Linux Fundamentals** ([tryhackme.com](https://tryhackme.com/module/linux-fundamentals)) — все три части.
3. На своём Kali: найди все SUID-файлы (`find / -perm -4000 2>/dev/null`), изучи каждый через man.
4. Прочитай `/var/log/auth.log` — найди последние 5 событий sudo, объясни что происходило.

## Чекпоинт

Готов идти дальше если можешь:
- Объяснить разницу между `chmod 755` и `chmod 4755` (SUID)
- Найти процесс по имени, убить его, запустить в фоне и вернуть на передний план
- Написать простой bash-скрипт который парсит `/var/log/auth.log` и выводит неудачные попытки входа
- Объяснить что такое inode и зачем он нужен
