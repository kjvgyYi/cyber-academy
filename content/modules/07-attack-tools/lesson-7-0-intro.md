---
id: "7.0"
module: 7
order: 0
kind: lesson
title: "Введение — Инструменты атаки (Burp, SQLMap, ffuf)"
estimatedTime: 30
difficulty: intermediate
skills: []
tags: [burp-suite, sqlmap, ffuf, gobuster, tools]
---

## Обзор темы

Инструменты — умножитель навыков. Burp Suite позволяет перехватывать, анализировать и изменять HTTP трафик в реальном времени. SQLMap автоматизирует то, что руками занимало бы часы. ffuf за секунды проверяет тысячи путей на директории и файлы. Без инструментов можно найти уязвимость, но масштабировать проверку невозможно.

Модуль фокусируется на четырёх инструментах которые нужны на каждом веб-пентесте и Bug Bounty: Burp Suite (перехват и манипуляция запросами), SQLMap (автоматизация SQLi), ffuf (content discovery), gobuster (directory brute-force). Акцент на кастомизации — дефолтные настройки часто блокируются WAF и ограничениями rate limiting.

## Почему это важно для кибербеза

- **Burp Repeater** → ручное тестирование каждого параметра без написания кода.
- **Burp Intruder** → автоматизация payload injection для fuzzing параметров.
- **SQLMap `--level` и `--risk`** → баланс между полнотой и незаметностью.
- **ffuf** с кастомными wordlists → находит admin panels, backup файлы, git репозитории которые Google не индексирует.
- **Правильный User-Agent, delay, rate-limit** → разница между детектированием и незамеченным сканом.

## Ресурсы

```resources
books:
  - title: "The Web Application Hacker's Handbook"
    author: "Stuttard, Pinto"
    note: "Авторы создали Burp Suite — книга и инструмент неразрывны"
  - title: "Hacking APIs"
    author: "Corey Ball"
    note: "No Starch Press — тестирование API с Burp Suite и инструментами"
platforms:
  - name: PortSwigger Web Security Academy
    url: https://portswigger.net/web-security
    note: "Все labs предполагают использование Burp Suite"
  - name: TryHackMe — Burp Suite
    url: https://tryhackme.com/module/learn-burp-suite
    note: "Полный модуль по Burp Suite, бесплатно"
  - name: HackTheBox Academy — Using Web Proxies
    url: https://academy.hackthebox.com/module/details/110
    note: "Burp Suite и ZAP для веб-пентеста"
tools:
  - name: Burp Suite
    url: https://portswigger.net/burp
    note: "Community Edition бесплатна, достаточна для учёбы"
  - name: SQLMap
    url: https://sqlmap.org
    note: "Автоматизация SQL Injection"
  - name: ffuf
    url: https://github.com/ffuf/ffuf
    note: "Быстрый web fuzzer на Go"
  - name: SecLists
    url: https://github.com/danielmiessler/SecLists
    note: "Коллекция wordlists для fuzzing, обязательна"
videos:
  - name: "IppSec — HTB Writeups (Burp Suite usage)"
    url: https://www.youtube.com/@ippsec
    note: "YouTube, каждый writeup использует Burp Suite в контексте"
  - name: "TCM Security — Practical Bug Bounty"
    url: https://academy.tcm-sec.com
    note: "Burp Suite в реальном Bug Bounty контексте"
```

## Практические задания

1. **TryHackMe Burp Suite module** ([tryhackme.com/module/learn-burp-suite](https://tryhackme.com/module/learn-burp-suite)) — все части.
2. **SQLMap на DVWA**: запусти `-u "http://localhost/dvwa/vulnerabilities/sqli/?id=1" --cookie="..." --dbs` — получи список баз данных.
3. **ffuf** на Metasploitable: `ffuf -w /usr/share/seclists/Discovery/Web-Content/common.txt -u http://TARGET/FUZZ` — найди скрытые директории.
4. **Burp Repeater**: поймай запрос в PortSwigger lab, измени параметр вручную, получи флаг.

## Чекпоинт

Готов идти дальше если можешь:
- Настроить браузер → Burp Proxy → перехватить HTTPS запрос к любому сайту
- SQLMap с `--level=5 --risk=3 --random-agent` — объяснить что меняет каждый параметр
- ffuf найти `/admin` директорию и скрытый файл `.env` на учебном стенде
- Объяснить когда нужен SQLMap, а когда лучше делать SQLi вручную
