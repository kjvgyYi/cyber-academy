---
id: "9.0"
module: 9
order: 0
kind: lesson
title: "Введение — Hardening систем"
estimatedTime: 30
difficulty: intermediate
skills: []
tags: [hardening, cis, firewall, selinux, ssh]
---

## Обзор темы

Hardening — методичное уменьшение attack surface: убрать всё ненужное, закрыть все лишние порты, отключить все неиспользуемые сервисы, настроить минимальные необходимые права. Цель не сделать систему «абсолютно безопасной» (это невозможно), а максимально затруднить и замедлить атаку.

CIS Benchmarks — стандарт де-факто: для каждой ОС и платформы есть документ с сотнями конкретных проверок и рекомендаций, каждая с обоснованием. Инструменты автоматизации (Lynis, OpenSCAP) позволяют быстро оценить текущее состояние и получить приоритизированный список действий.

## Почему это важно для кибербеза

- **Reduced attack surface** → меньше открытых портов = меньше точек входа для атакующего.
- **Principle of Least Privilege** → даже если атакующий получил shell www-data, он ограничен в правах.
- **SELinux/AppArmor** → мандатный контроль доступа блокирует попытки escape из контейнера или выход за пределы разрешённых операций.
- **SSH ключи vs пароли** → брутфорс паролей — один из самых распространённых векторов; ключи делают его невозможным.
- **Hardening as pentest prep** → зная что hardening делает, видишь где он не сделан на цели.

## Ресурсы

```resources
books:
  - title: "Linux Hardening in Hostile Networks"
    author: "Kyle Rankin"
    note: "O'Reilly — практическое руководство по hardening Linux"
  - title: "Windows Security Internals"
    author: "James Forshaw"
    note: "Глубокое понимание механизмов безопасности Windows"
platforms:
  - name: CIS Benchmarks (бесплатно при регистрации)
    url: https://www.cisecurity.org/cis-benchmarks/
    note: "Официальные benchmarks для всех платформ"
  - name: OpenSCAP
    url: https://www.open-scap.org
    note: "Автоматизированная проверка соответствия CIS/STIG"
  - name: TryHackMe — Linux Server Hardening
    url: https://tryhackme.com/room/linuxserverforensics
    note: "Практика hardening"
tools:
  - name: Lynis
    url: https://cisofy.com/lynis/
    note: "Аудит безопасности Linux систем, показывает что настроить"
  - name: Ansible
    url: https://www.ansible.com
    note: "Автоматизация hardening через playbooks (DevSecOps)"
  - name: OpenSCAP
    url: https://www.open-scap.org
    note: "SCAP compliance scanning"
videos:
  - name: "HackerSploit — Linux Hardening"
    url: https://www.youtube.com/@HackerSploit
    note: "YouTube, практические видео по hardening"
  - name: "LiveOverflow — SELinux Explained"
    url: https://www.youtube.com/@LiveOverflow
    note: "Глубокое объяснение SELinux"
```

## Практические задания

1. **Lynis на Kali**: установи и запусти `sudo lynis audit system` — изучи report, исправь топ-5 замечаний.
2. **CIS Benchmark для Debian/Ubuntu**: скачай, пройди первые 20 пунктов вручную на своей VM.
3. **SSH Hardening**: настрой `PermitRootLogin no`, `PasswordAuthentication no`, перенеси на нестандартный порт — убедись что вход по ключу работает.
4. **iptables**: напиши правила которые разрешают только SSH (22) и HTTP (80), блокируют всё остальное входящее.

## Чекпоинт

Готов идти дальше если можешь:
- Применить первые 20 пунктов CIS Benchmark Level 1 на тестовой VM
- Настроить iptables/nftables с правилом allow established, deny new для non-needed ports
- Включить SELinux в enforcing mode и убедиться что обычные операции продолжают работать
- Объяснить что такое principle of least privilege и привести 3 конкретных примера его применения
