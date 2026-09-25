---
id: "6.0"
module: 6
order: 0
kind: lesson
title: "Введение — Веб-уязвимости (OWASP Top 10)"
estimatedTime: 30
difficulty: beginner
skills: []
tags: [web, sqli, xss, csrf, owasp, burp-suite]
---

## Обзор темы

Веб-приложения — основная поверхность атаки в современном Bug Bounty и большинстве корпоративных пентестов. OWASP Top 10 регулярно обновляется, но SQL Injection, XSS и IDOR присутствуют во всех изданиях с 2003 года — не потому что индустрия не знает о них, а потому что разработчики продолжают делать одни и те же ошибки.

Модуль строится по принципу «ломай чтобы понять»: каждая уязвимость сначала объясняется механически, затем эксплуатируется на учебном стенде. PortSwigger Web Security Academy ([portswigger.net/web-security](https://portswigger.net/web-security)) — основная платформа, 250+ бесплатных лабораторий с подробными объяснениями. Это не просто курс — это лучший существующий ресурс по веб-безопасности.

## Почему это важно для кибербеза

- **SQL Injection** — одна уязвимость → полная база данных: usernames, hashed passwords, emails. В 2023 году MOVEit SQLi взломал сотни компаний.
- **XSS** → кража сессионных cookies, keylogging, фишинг с доверенного домена.
- **IDOR** (Insecure Direct Object References) → доступ к данным других пользователей, одна из самых часто оплачиваемых в Bug Bounty.
- **SSRF** → доступ к внутренней сети через уязвимое приложение, cloud metadata endpoint с credentials.
- **XXE** → чтение системных файлов (/etc/passwd), SSRF через XML парсер.

## Ресурсы

```resources
books:
  - title: "The Web Application Hacker's Handbook"
    author: "Stuttard, Pinto"
    note: "Классика, немного устарела но фундамент неизменен"
  - title: "Real-World Bug Hunting"
    author: "Peter Yaworski"
    note: "No Starch Press — реальные баги с write-up'ами"
  - title: "Bug Bounty Bootcamp"
    author: "Vickie Li"
    note: "No Starch Press — методология от практикующего Bug Hunter"
platforms:
  - name: PortSwigger Web Security Academy
    url: https://portswigger.net/web-security
    note: "Лучший бесплатный ресурс по веб-безопасности, 250+ labs"
  - name: OWASP WebGoat
    url: https://owasp.org/www-project-webgoat/
    note: "Уязвимое приложение от OWASP, self-hosted"
  - name: DVWA (Damn Vulnerable Web Application)
    url: https://github.com/digininja/DVWA
    note: "Классический учебный стенд, запускается в Docker"
  - name: HackTheBox — Web Challenges
    url: https://app.hackthebox.com/challenges
    note: "Web категория, beginner до expert"
tools:
  - name: Burp Suite Community
    url: https://portswigger.net/burp/communitydownload
    note: "Основной инструмент веб-пентеста"
  - name: OWASP ZAP
    url: https://www.zaproxy.org
    note: "Бесплатная альтернатива Burp Suite от OWASP"
videos:
  - name: "PortSwigger Web Security Academy — видео"
    url: https://portswigger.net/web-security/all-videos
    note: "Официальные видео к каждой теме"
  - name: "Rana Khalil — Web Security"
    url: https://www.youtube.com/@RanaKhalil101
    note: "YouTube, подробные разборы PortSwigger labs"
```

## Практические задания

1. **PortSwigger SQLi** ([portswigger.net/web-security/sql-injection](https://portswigger.net/web-security/sql-injection)) — пройди все 18 labs уровня apprentice.
2. **XSS Apprentice** labs на PortSwigger — минимум 10 labs.
3. **DVWA**: разверни в Docker, пройди SQLi, XSS, CSRF на всех уровнях сложности.
4. **OWASP Juice Shop** ([owasp.org/www-project-juice-shop](https://owasp.org/www-project-juice-shop/)) — реши 5 задач из раздела Injection.

## Чекпоинт

Готов идти дальше если можешь:
- Провести SQL Injection вручную (без SQLMap) и получить данные из таблицы
- Объяснить разницу между reflected и stored XSS и чем каждый опасен
- Найти IDOR уязвимость в учебном приложении и получить данные другого пользователя
- Объяснить Same-Origin Policy и почему CSRF bypass работает когда её нет
