---
id: "19.0"
module: 19
order: 0
kind: lesson
title: "Введение — Bug Bounty"
estimatedTime: 30
difficulty: intermediate
skills: []
tags: [bug-bounty, hackerone, bugcrowd, methodology, report]
---

## Обзор темы

Bug Bounty — легальный способ применять навыки пентеста на реальных продуктах и получать деньги за найденные уязвимости. Программы ведут Google ($31,337 за критический Chrome баг), Microsoft, Apple, Meta, тысячи стартапов. HackerOne и Bugcrowd — основные платформы агрегирующие сотни программ. VDP (Vulnerability Disclosure Program) — без выплат, только благодарность; Paid Program — выплаты по CVSS severity.

Успех в Bug Bounty требует методологии: не браузить приложение случайно, а систематически исследовать все точки входа. Reconnaissance → Application mapping → Testing → Reproduction → Report. Качество отчёта определяет выплату: неполный PoC → дублируется → закрыт как N/A. Правильный отчёт с чётким impact → быстрый triage → выплата.

## Почему это важно для кибербеза

- **Реальный experience** → реальные системы с реальными пользователями — не CTF стенды.
- **Income** → опытный hunter зарабатывает $2,000-20,000+/месяц, топ-5% делают $100k+/год.
- **Portfolio** → публичные отчёты на HackerOne = лучшее резюме для работодателя.
- **Community** → Hacker101 CTF, Hacktivity feed, конференции — активное community.
- **Scope discipline** → работа строго в рамках scope учит точности и ответственности.

## Ресурсы

```resources
books:
  - title: "Bug Bounty Bootcamp"
    author: "Vickie Li"
    note: "No Starch Press — лучшая книга по методологии Bug Bounty"
  - title: "Real-World Bug Hunting"
    author: "Peter Yaworski"
    note: "No Starch Press — реальные writeup'ы с объяснением"
  - title: "The Web Application Hacker's Handbook"
    author: "Stuttard, Pinto"
    note: "Техническая база для веб-баг-хантинга"
platforms:
  - name: HackerOne
    url: https://www.hackerone.com
    note: "Крупнейшая Bug Bounty платформа"
  - name: Bugcrowd
    url: https://www.bugcrowd.com
    note: "Вторая по размеру платформа"
  - name: Intigriti
    url: https://www.intigriti.com
    note: "Европейская платформа, много EU программ"
  - name: HackerOne Hacktivity
    url: https://hackerone.com/hacktivity
    note: "Публичные отчёты — читай как другие находят баги"
tools:
  - name: Burp Suite
    url: https://portswigger.net/burp
    note: "Основной инструмент, Community Edition бесплатен"
  - name: Nuclei
    url: https://github.com/projectdiscovery/nuclei
    note: "Шаблонный сканер для быстрого нахождения известных проблем"
  - name: Subfinder
    url: https://github.com/projectdiscovery/subfinder
    note: "Поиск поддоменов для расширения scope"
videos:
  - name: "NahamSec — Bug Bounty"
    url: https://www.youtube.com/@NahamSec
    note: "YouTube, практические Bug Bounty стримы и tutorials"
  - name: "STÖK — Bug Bounty"
    url: https://www.youtube.com/@STOKfredrik
    note: "YouTube, методология и mindset Bug Bounty"
```

## Практические задания

1. **Зарегистрируйся на HackerOne** и Bugcrowd, изучи 10 программ — выбери 2 с широким scope.
2. **Hacker101 CTF** ([ctf.hacker101.com](https://ctf.hacker101.com)) — реши задания для получения invitations в private программы.
3. **Прочитай 20 публичных отчётов** на Hacktivity ([hackerone.com/hacktivity](https://hackerone.com/hacktivity)) — особенно IDOR и XSS.
4. **Напиши шаблон отчёта**: title, severity, description, steps to reproduce, impact, remediation.

## Чекпоинт

Готов идти дальше если можешь:
- Описать свою методологию reconnaissance для нового Bug Bounty target
- Написать отчёт по стандарту для учебной уязвимости с CVSS score
- Объяснить разницу между P1-P5 severity и какие уязвимости попадают в каждую категорию
- Настроить Burp Suite с правильными фильтрами и scope для конкретной программы
