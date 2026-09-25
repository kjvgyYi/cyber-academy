---
id: "11.0"
module: 11
order: 0
kind: lesson
title: "Введение — Incident Response и цифровая криминалистика"
estimatedTime: 30
difficulty: intermediate
skills: []
tags: [incident-response, forensics, volatility, autopsy, nist]
---

## Обзор темы

Когда атака случилась, начинается гонка: нужно остановить атакующего, сохранить доказательства, восстановить работу и понять как это произошло. Incident Response — это структурированный процесс который позволяет делать это правильно под давлением. Digital Forensics — наука восстановления произошедшего по артефактам.

NIST SP 800-61 определяет шесть фаз IR: Preparation, Detection & Analysis, Containment, Eradication, Recovery, Post-Incident Activity. Каждая фаза имеет конкретные шаги и инструменты. Volatility анализирует RAM dumps, Autopsy исследует дисковые образы, timeline analysis объединяет данные из разных источников в единую картину.

## Почему это важно для кибербеза

- **Сохранение доказательств** — неправильный порядок действий уничтожает улики до суда.
- **Volatility** → находит вредоносные процессы в памяти которых нет в tasklist (rootkit hiding).
- **Forensic artifacts** → prefetch, browser history, $MFT, Windows Registry — каждый содержит следы активности.
- **Timeline analysis** — восстановление хронологии из разнородных источников — ключевой навык IR.
- **Post-incident** — lessons learned предотвращают повторение; root cause analysis — основа отчёта.

## Ресурсы

```resources
books:
  - title: "The Art of Memory Forensics"
    author: "Ligh, Case, Levy, Walters"
    note: "Библия memory forensics, авторы создали Volatility"
  - title: "Digital Forensics and Incident Response"
    author: "Gerard Johansen"
    note: "Packt — DFIR от основ до продвинутых техник"
  - title: "Incident Response & Computer Forensics"
    author: "Jason Luttgens, Matthew Pepe"
    note: "McGraw-Hill — классика IR"
platforms:
  - name: TryHackMe — SOC Level 2
    url: https://tryhackme.com/path/outline/soclevel2
    note: "IR и forensics модули"
  - name: CyberDefenders
    url: https://cyberdefenders.org
    note: "Blue team CTF с реальными DFIR сценариями"
  - name: BlueTeamLabs Online
    url: https://blueteamlabs.online
    note: "IR и forensics задания"
tools:
  - name: Volatility 3
    url: https://github.com/volatilityfoundation/volatility3
    note: "Memory forensics framework, Python 3"
  - name: Autopsy
    url: https://www.sleuthkit.org/autopsy/
    note: "GUI для disk forensics анализа"
  - name: KAPE (Kroll Artifact Parser and Extractor)
    url: https://www.kroll.com/en/services/cyber-risk/incident-response-litigation-support/kroll-artifact-parser-extractor-kape
    note: "Быстрый сбор артефактов Windows"
videos:
  - name: "13Cubed — DFIR на YouTube"
    url: https://www.youtube.com/@13Cubed
    note: "Отличный канал по digital forensics"
  - name: "HuskyHacks — Volatility Tutorials"
    url: https://www.youtube.com/@HuskyHacks
    note: "Практика Volatility на CTF сценариях"
```

## Практические задания

1. **CyberDefenders** ([cyberdefenders.org](https://cyberdefenders.org)) — пройди бесплатный сценарий "BrokenDoor" или "OpenWire".
2. **Volatility**: скачай учебный memory dump ([github.com/volatilityfoundation/volatility/wiki](https://github.com/volatilityfoundation/volatility/wiki/Memory-Samples)), запусти `pslist`, `netscan`, `malfind`.
3. **Autopsy**: скачай образ диска CTF Challenge, найди удалённые файлы и артефакты браузера.
4. **Прочитай NIST SP 800-61** ([nvlpubs.nist.gov](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)) — 79 страниц, 2-3 часа.

## Чекпоинт

Готов идти дальше если можешь:
- Анализировать memory dump с Volatility и найти признаки подозрительного процесса
- Построить timeline инцидента из нескольких источников логов
- Объяснить фазы NIST IR без подглядывания и дать конкретный пример действий в каждой
- Написать IR report по стандарту после разбора учебного сценария
