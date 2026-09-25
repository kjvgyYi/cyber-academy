---
id: "10.0"
module: 10
order: 0
kind: lesson
title: "Введение — Мониторинг и SIEM"
estimatedTime: 30
difficulty: intermediate
skills: []
tags: [siem, elk, wazuh, snort, suricata, monitoring]
---

## Обзор темы

SIEM (Security Information and Event Management) — центр нервной системы Security Operations Center. Он агрегирует логи с сотен систем, нормализует их в единый формат, применяет правила корреляции и генерирует алерты. Без SIEM попытка мониторить инфраструктуру — это попытка найти иголку в стоге сена без стога.

ELK Stack (Elasticsearch + Logstash + Kibana) — основа большинства open-source SIEM решений. Wazuh добавляет поверх ELK возможности IDS/IPS, File Integrity Monitoring и агентов. Snort и Suricata — network IDS/IPS которые анализируют трафик в реальном времени и могут блокировать атаки.

## Почему это важно для кибербеза

- **SOC работа** — основной рабочий инструмент аналитика; без понимания SIEM на рынке труда нет.
- **Detection Engineering** — написание правил корреляции, которые находят атаки и не генерируют false positives, — отдельное искусство.
- **Threat Hunting** — активный поиск угроз в данных SIEM без ожидания алерта.
- **Red Team perspective** — понимание что логируется помогает атакующему действовать тише (evasion).
- **IR** — при расследовании SIEM — первый источник timeline атаки.

## Ресурсы

```resources
books:
  - title: "The Practice of Network Security Monitoring"
    author: "Richard Bejtlich"
    note: "О'Reilly — классика NSM и SIEM"
  - title: "Applied Network Security Monitoring"
    author: "Chris Sanders, Jason Smith"
    note: "Практика NSM с Snort и другими инструментами"
platforms:
  - name: TryHackMe — SOC Level 1
    url: https://tryhackme.com/path/outline/soclevel1
    note: "Path специально для SOC аналитика с ELK и Splunk"
  - name: Elastic SIEM Learning Path
    url: https://www.elastic.co/training/
    note: "Официальное обучение от Elastic"
  - name: Wazuh Documentation
    url: https://documentation.wazuh.com
    note: "Лучшее место для изучения Wazuh"
tools:
  - name: Wazuh
    url: https://wazuh.com
    note: "Open source XDR/SIEM, бесплатный self-hosted"
  - name: ELK Stack
    url: https://www.elastic.co/elastic-stack
    note: "Elasticsearch + Logstash + Kibana"
  - name: Suricata
    url: https://suricata.io
    note: "High-performance IDS/IPS/NSM"
  - name: Snort
    url: https://www.snort.org
    note: "Классический IDS/IPS от Cisco"
videos:
  - name: "John Strand — SIEM and Log Analysis"
    url: https://www.youtube.com/@BlackHillsInformationSecurity
    note: "YouTube, практические SIEM сессии от Black Hills InfoSec"
  - name: "HackerSploit — ELK Stack Tutorial"
    url: https://www.youtube.com/@HackerSploit
    note: "Развёртывание и настройка ELK"
```

## Практические задания

1. **Разверни Wazuh** по официальному quickstart guide ([documentation.wazuh.com](https://documentation.wazuh.com/current/quickstart.html)) — подключи Kali как агент.
2. **TryHackMe SOC Level 1** ([tryhackme.com/path/outline/soclevel1](https://tryhackme.com/path/outline/soclevel1)) — пройди ELK и Splunk модули.
3. **Kibana Dashboard**: создай дашборд показывающий топ-10 source IP по количеству failed SSH попыток.
4. **Suricata rule**: напиши правило детектирующее nmap SYN scan, проверь на трафике от своего Kali.

## Чекпоинт

Готов идти дальше если можешь:
- Развернуть Wazuh + ELK и получить логи с минимум 2 агентов
- Написать Elasticsearch KQL запрос для поиска событий за последние 24 часа с severity: high
- Объяснить разницу между SIEM, IDS/IPS и EDR
- Написать Snort/Suricata правило для детектирования конкретной атаки
