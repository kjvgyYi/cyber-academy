---
id: "16.0"
module: 16
order: 0
kind: lesson
title: "Введение — Red Team Operations"
estimatedTime: 30
difficulty: advanced
skills: []
tags: [red-team, mitre-attack, c2, evasion, opsec]
---

## Обзор темы

Red Team Operation — это симуляция реальной атакующей группы (APT) с целью проверить не только наличие уязвимостей, но и эффективность обнаружения, реагирования и восстановления всей организации. Это не поиск дыр в firewall — это многонедельная операция с полным соблюдением OPSEC, persistence, lateral movement и exfiltration.

MITRE ATT&CK — карта реального поведения атакующих: каждая Tactics/Techniques/Procedures (TTP) задокументирована с примерами из реальных атак. C2-фреймворки (Cobalt Strike, Sliver, Havoc) организуют инфраструктуру управления скомпрометированными системами. Evasion — искусство действовать так, чтобы AV, EDR и SOC не заметили.

## Почему это важно для кибербеза

- **Purple Team** → Red Team без Blue Team — это односторонняя игра; Red/Blue взаимодействие улучшает детектирование.
- **ATT&CK mapping** → каждое действие операции должно маппироваться на ATT&CK — это основа отчёта.
- **C2 infrastructure** → правильно построенная C2 инфра обходит корпоративные прокси и DPI.
- **Evasion = понимание детекта** → знание как AV/EDR анализирует PE = знание как писать детектирующие правила.
- **OPSEC** → неправильный OPSEC = обнаружение операции = провал; правильный = месяцы в сети незамеченным.

## Ресурсы

```resources
books:
  - title: "Red Team Development and Operations"
    author: "Joe Vest, James Tubberville"
    note: "Методология Red Team операций от основ до операционного уровня"
  - title: "The Hacker Playbook 3"
    author: "Peter Kim"
    note: "Red Team тактики с конкретными примерами"
  - title: "RTFM: Red Team Field Manual"
    author: "Ben Clark"
    note: "Быстрый справочник команд и техник"
platforms:
  - name: MITRE ATT&CK
    url: https://attack.mitre.org
    note: "Основная матрица тактик и техник"
  - name: HackTheBox — ProLabs
    url: https://app.hackthebox.com/prolabs
    note: "Полноценные AD сети для Red Team практики (платно)"
  - name: RangeForce
    url: https://www.rangeforce.com
    note: "Cyber range для Red Team упражнений"
tools:
  - name: Sliver C2
    url: https://github.com/BishopFox/sliver
    note: "Open source C2 framework от BishopFox, Cobalt Strike alternative"
  - name: Havoc C2
    url: https://github.com/HavocFramework/Havoc
    note: "Modern C2 с продвинутыми evasion возможностями"
  - name: MITRE ATT&CK Navigator
    url: https://mitre-attack.github.io/attack-navigator/
    note: "Визуализация матрицы ATT&CK"
videos:
  - name: "SANS Red Team Summit"
    url: https://www.youtube.com/@SANSInstitute
    note: "YouTube, конференционные доклады по Red Team"
  - name: "Black Hills InfoSec — Red Team Operations"
    url: https://www.youtube.com/@BlackHillsInformationSecurity
    note: "Практические Red Team сессии"
```

## Практические задания

1. **MITRE ATT&CK**: выбери одну реальную APT группу (APT29, Lazarus, FIN7), изучи их TTPs в ATT&CK, составь список из 10 техник которые они используют.
2. **ATT&CK Navigator**: создай Layer для выбранной APT группы, визуализируй coverage твоих детектирующих правил.
3. **Sliver C2**: разверни в своей лаборатории, создай listener и payload, установи имплант на VM, убедись в связи.
4. **HackTheBox ProLabs** или **TryHackMe — Red Team Path** ([tryhackme.com/path/outline/redteam](https://tryhackme.com/path/outline/redteam)).

## Чекпоинт

Готов идти дальше если можешь:
- Описать полную Red Team операцию по фазам с конкретными TTPs из ATT&CK
- Настроить C2 listener, сгенерировать payload, установить соединение с тестовой VM
- Объяснить что такое OPSEC и назвать 5 конкретных мер OPSEC при проведении операции
- Написать раздел отчёта по итогам учебной Red Team операции
