---
number: 6
objectives:
  - Понять и эксплуатировать SQL Injection (классическую, слепую, out-of-band).
  - Разобраться в XSS (reflected, stored, DOM-based) и обойти WAF.
  - Находить CSRF, IDOR, Path Traversal, SSRF, XXE в реальных приложениях.
  - Знать как работает Same-Origin Policy и почему она важна.
  - Использовать PortSwigger Web Security Academy как основную учебную платформу.
prerequisites:
  - Модуль 1 (HTTP/HTTPS, cookies, sessions).
  - Базовое понимание HTML и SQL.
skills:
  - cybersecurity
---

Веб-приложения — основная поверхность атаки в 90% программ Bug Bounty и большинства реальных пентестов. SQLi в 2024 году всё ещё в OWASP Top 10 не случайно — неправильная обработка пользовательского ввода воспроизводится снова и снова в разных формах. SSRF открывает доступ к внутренней инфраструктуре через само приложение.

Модуль построен вокруг практики на PortSwigger Web Security Academy — лучшем бесплатном ресурсе по веб-безопасности. Каждая уязвимость разбирается по схеме: механизм → как искать → как эксплуатировать → как защититься. OWASP Juice Shop и DVWA используются как учебные стенды для применения знаний без Burp Suite Pro.

```info PortSwigger Academy — твой главный инструмент
Все лаборатории PortSwigger (labs.portswigger.net) доступны бесплатно. 250+ labs, от beginner до expert. Это лучший способ набить руку перед реальным Bug Bounty.
```
