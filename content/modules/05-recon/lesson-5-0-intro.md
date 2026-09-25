---
id: "5.0"
module: 5
order: 0
kind: lesson
title: "Введение — Разведка и сканирование"
estimatedTime: 30
difficulty: beginner
skills: []
tags: [osint, nmap, recon, scanning, google-dorks]
---

## Обзор темы

Разведка — первая фаза любой операции: пентест, Bug Bounty или CTF. Профессионал тратит 30-40% времени на этот этап, потому что качество разведки определяет качество атаки. Случайное сканирование «в надежде что-нибудь найдётся» — это не методология. Систематическая разведка приводит к точкам входа которые автоматические сканеры пропускают.

Разведка делится на пассивную (OSINT — без прямого взаимодействия с целью: Google, Shodan, DNS записи, Certificate Transparency, GitHub) и активную (nmap, Nessus, баннер-граббинг). Пассивная разведка — всегда первая, она не оставляет следов в логах цели.

## Почему это важно для кибербеза

- **OSINT** находит уязвимые поддомены, публичные ключи, credentials в GitHub репозиториях до первого nmap пакета.
- **Shodan** ([shodan.io](https://shodan.io)) — поисковик интернет-устройств. Уязвимые камеры, открытые базы данных, неправильно настроенные сервисы — всё это там.
- **nmap** — стандарт сканирования портов, умеет определять версии сервисов и ОС, запускать NSE скрипты.
- **Certificate Transparency logs** открывают все поддомены компании без сканирования.
- **Google Dorks** (advanced search operators) находят секретные файлы, открытые камеры, конфиги с паролями прямо в Google.

## Ресурсы

```resources
books:
  - title: "Open Source Intelligence Techniques"
    author: "Michael Bazzell"
    note: "IntelTechniques.com — библия OSINT, обновляется ежегодно"
  - title: "The Hacker Playbook 2"
    author: "Peter Kim"
    note: "Разведка глава с практическими примерами"
  - title: "Penetration Testing"
    author: "Georgia Weidman"
    note: "No Starch Press — классика пентеста, главы по разведке"
platforms:
  - name: TryHackMe — Passive Reconnaissance
    url: https://tryhackme.com/room/passiverecon
    note: "Пассивная разведка с практикой"
  - name: HackTheBox — Starting Point
    url: https://app.hackthebox.com/starting-point
    note: "Первые машины с разведкой и эксплуатацией"
  - name: OSINT Framework
    url: https://osintframework.com
    note: "Карта всех OSINT инструментов по категориям"
tools:
  - name: Nmap
    url: https://nmap.org
    note: "Основной сканер, учи NSE скрипты"
  - name: Shodan
    url: https://www.shodan.io
    note: "Поисковик интернет-устройств, API доступен"
  - name: theHarvester
    url: https://github.com/laramies/theHarvester
    note: "OSINT: email, поддомены, IP из открытых источников"
  - name: Amass
    url: https://github.com/owasp-amass/amass
    note: "Продвинутое обнаружение поддоменов"
videos:
  - name: "TCM Security — Practical OSINT"
    url: https://academy.tcm-sec.com/p/osint-fundamentals
    note: "Платный курс, считается лучшим практическим OSINT курсом"
  - name: "David Bombal — Nmap Tutorial"
    url: https://www.youtube.com/@davidbombal
    note: "YouTube, подробный разбор Nmap"
```

## Практические задания

1. **TryHackMe Passive Recon** ([tryhackme.com/room/passiverecon](https://tryhackme.com/room/passiverecon)) — пройди полностью.
2. **Google Dorks**: найди 5 открытых FTP-серверов через Google (`intitle:"index of" ftp`), убедись что не заходишь на них.
3. **Shodan**: зарегистрируйся, поищи уязвимые устройства по ключевым словам (только смотреть, не трогать).
4. **Nmap на Metasploitable**: выполни `-sV -sC -O` скан, задокументируй все найденные сервисы и версии.

## Чекпоинт

Готов идти дальше если можешь:
- Провести полную пассивную разведку произвольного домена используя минимум 5 источников
- Выполнить nmap скан и интерпретировать каждую строку вывода
- Объяснить разницу между TCP SYN scan и TCP Connect scan
- Написать отчёт по разведке: IP ranges, поддомены, открытые порты, версии сервисов
