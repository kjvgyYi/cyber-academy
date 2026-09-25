---
id: "3.0"
module: 3
order: 0
kind: lesson
title: "Введение — Windows и Active Directory для кибербеза"
estimatedTime: 30
difficulty: beginner
skills: []
tags: [windows, active-directory, powershell, registry, event-log]
---

## Обзор темы

Windows доминирует в корпоративных сетях — 70%+ рабочих станций и большинство инфраструктуры работают на Windows. Active Directory управляет идентификацией для миллионов организаций. Именно поэтому реальные APT-группы, ransomware операторы и пентестеры фокусируются на Windows и AD — там живут данные и там живут учётные записи с доступом к ним.

Модуль охватывает три уровня: операционная система (реестр, службы, WMI, Named Pipes), Active Directory (домены, Kerberos, LDAP, Group Policy, trusts) и PowerShell (как основной инструмент и как вектор атаки). Event Log здесь не просто «логи» — это источник данных для обнаружения атак типа Pass-the-Hash, DCSync, Golden Ticket.

## Почему это важно для кибербеза

- **Kerberoasting, AS-REP Roasting** — атаки на AD требуют понимания как работает Kerberos ticket system.
- **Pass-the-Hash / Pass-the-Ticket** — lateral movement через Windows без знания пароля.
- **DCSync** — выгрузка всех хешей паролей домена через DRS protocol.
- **Living off the Land** — атакующие используют PowerShell, WMI, certutil вместо своих инструментов — не будут детектированы AV.
- **BloodHound** — строит граф путей в AD. Без понимания AD граф бессмысленен.

## Ресурсы

```resources
books:
  - title: "The Hacker Playbook 3"
    author: "Peter Kim"
    note: "Практика атак на Windows/AD окружение"
  - title: "PowerShell for Sysadmins"
    author: "Adam Bertram"
    note: "No Starch Press — PowerShell от практики"
  - title: "Active Directory Security"
    author: "Sean Metcalf"
    note: "adsecurity.org — лучший блог по AD security"
platforms:
  - name: TryHackMe — Windows Fundamentals
    url: https://tryhackme.com/module/windows-fundamentals
    note: "3 части, основы Windows от beginner"
  - name: TryHackMe — Active Directory Basics
    url: https://tryhackme.com/room/winadbasics
    note: "AD концепции с практикой"
  - name: HackTheBox Academy — Active Directory
    url: https://academy.hackthebox.com/path/preview/active-directory-penetration-tester
    note: "Продвинутые AD атаки"
tools:
  - name: BloodHound
    url: https://github.com/BloodHoundAD/BloodHound
    note: "Графовый анализ путей атаки в AD"
  - name: Impacket
    url: https://github.com/fortra/impacket
    note: "Python библиотека для работы с Windows протоколами (SMB, Kerberos)"
  - name: PowerSploit / PowerView
    url: https://github.com/PowerShellMafia/PowerSploit
    note: "PowerShell инструменты для разведки в AD"
videos:
  - name: "John Hammond — Active Directory"
    url: https://www.youtube.com/@_JohnHammond
    note: "YouTube, практические атаки на AD с объяснением"
  - name: "TCM Security — Practical Ethical Hacking"
    url: https://academy.tcm-sec.com/p/practical-ethical-hacking-the-complete-course
    note: "Курс с большим блоком по AD (частично платный)"
```

## Практические задания

1. **Разверни Windows Server Evaluation** ([microsoft.com](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2022)) в VirtualBox, настрой AD DC.
2. **TryHackMe Active Directory Basics** — пройди комнату полностью.
3. **BloodHound** в своей AD лабе: запусти SharpHound, загрузи данные, найди пути к DA.
4. **Event Log**: выполни `net user hacker /add` в PowerShell → найди событие в Event Viewer (Event ID 4720).

## Чекпоинт

Готов идти дальше если можешь:
- Объяснить что такое Kerberos TGT и Service Ticket и как они используются для аутентификации
- Найти в реестре HKLM\SYSTEM\CurrentControlSet\Services и объяснить что там хранится
- Написать PowerShell скрипт который выводит список всех пользователей домена
- Объяснить разницу между NTLM и Kerberos аутентификацией
