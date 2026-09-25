---
id: "12.0"
module: 12
order: 0
kind: lesson
title: "Введение — Blue Team инструменты"
estimatedTime: 30
difficulty: intermediate
skills: []
tags: [blue-team, sysmon, yara, thehive, threat-intelligence]
---

## Обзор темы

Blue Team работает с данными: логи, алерты, индикаторы компрометации (IOC), threat intelligence. Правильный инструментарий позволяет обрабатывать этот поток информации систематически, а не тонуть в нём. Sysmon даёт данные, YARA ищет в них паттерны, TheHive управляет расследованиями командой, VirusTotal обогащает IOC контекстом.

Ключевая концепция: без правильных данных нет детектирования. Windows Event Log по умолчанию слепой — Sysmon добавляет видимость которой нет ни в одном другом источнике. Без Sysmon Event ID 4688 (process creation) не пишет командную строку процесса — с Sysmon Event ID 1 пишет всё включая аргументы.

## Почему это важно для кибербеза

- **Sysmon Event ID 1** (Process Create) + командная строка → обнаружение PowerShell encoded commands.
- **Sysmon Event ID 3** (Network Connection) → обнаружение необычных исходящих соединений (C2 beaconing).
- **YARA rules** → находят неизвестный malware по семейству даже без точного хеша.
- **TheHive** → структурированное управление инцидентами в команде с полным audit trail.
- **Threat Intelligence** → IOC feed + SIEM correlation = автоматическое обнаружение известных угроз.

## Ресурсы

```resources
books:
  - title: "The Threat Intelligence Handbook"
    author: "CrowdStrike"
    note: "Бесплатно на crowdstrike.com — введение в TI"
  - title: "Intelligence-Driven Incident Response"
    author: "Rebekah Brown, Scott Roberts"
    note: "O'Reilly — объединение TI и IR"
platforms:
  - name: TryHackMe — Cyber Threat Intelligence
    url: https://tryhackme.com/module/cyber-threat-intelligence
    note: "TI инструменты и MISP"
  - name: ANY.RUN
    url: https://any.run
    note: "Интерактивный sandbox для анализа, бесплатный tier"
  - name: VirusTotal
    url: https://www.virustotal.com
    note: "Анализ файлов и IOC, бесплатный"
tools:
  - name: Sysmon
    url: https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon
    note: "Sysinternals tool для детального Windows logging"
  - name: SwiftOnSecurity Sysmon Config
    url: https://github.com/SwiftOnSecurity/sysmon-config
    note: "Production-готовая конфигурация Sysmon"
  - name: YARA
    url: https://github.com/VirusTotal/yara
    note: "Pattern matching для malware identification"
  - name: TheHive Project
    url: https://thehive-project.org
    note: "Open source IR platform"
videos:
  - name: "SANS — Blue Team Summit talks"
    url: https://www.youtube.com/@SANSInstitute
    note: "YouTube, конференционные доклады Blue Team"
  - name: "BlackHills InfoSec — Threat Hunting"
    url: https://www.youtube.com/@BlackHillsInformationSecurity
    note: "Практика threat hunting с ELK"
```

## Практические задания

1. **Установи Sysmon** с конфигом SwiftOnSecurity на Windows VM, проверь в Event Viewer что пишется.
2. **Напиши YARA правило** для детектирования строки `Invoke-Mimikatz` или обфусцированного PowerShell.
3. **VirusTotal**: загрузи любой безвредный exe файл и изучи полный report — relations, behavior, MITRE TTPs.
4. **TheHive**: разверни по Docker Compose, создай тестовый инцидент, добавь IOC и задачи.

## Чекпоинт

Готов идти дальше если можешь:
- Найти в Sysmon логах Event ID 1 с PowerShell encoded command и декодировать payload
- Написать рабочее YARA правило которое детектирует конкретный образец
- Объяснить разницу между IOC (indicators) и TTP (tactics, techniques, procedures)
- Построить простой threat intel workflow: получить feed → обогатить → алерт в SIEM
