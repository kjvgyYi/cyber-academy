---
id: "20.0"
module: 20
order: 0
kind: lesson
title: "Введение — Домашняя лаборатория"
estimatedTime: 30
difficulty: beginner
skills: []
tags: [homelab, virtualbox, proxmox, kali, pfsense, security-onion]
---

## Обзор темы

Домашняя лаборатория — персональная площадка для безопасных экспериментов с любыми техниками из роадмапа. Хорошо спроектированный homelab воспроизводит корпоративную инфраструктуру: firewall с сегментированными VLAN, Active Directory домен, уязвимые цели, SIEM для мониторинга. Это и тренировочная среда, и демонстрация навыков работодателю.

Базовый стенд из M0 (Kali + Metasploitable) достаточен для начала. Продвинутый homelab: Proxmox или VMware ESXi как гипервизор, pfSense как firewall, Windows Server с AD, Security Onion для NSM, несколько машин из VulnHub. С таким стендом ты воспроизводишь реальные сценарии атак и защиты которые встречаются в корпоративных средах.

## Почему это важно для кибербеза

- **Безопасная практика** → любые техники без риска для реальных систем.
- **Интервью** → «расскажи о своей лаборатории» — стандартный вопрос; наличие homelab выделяет кандидата.
- **Воспроизведение CVE** → новая уязвимость вышла → поднял уязвимую версию → изучил в безопасной среде.
- **Automation testing** → тестирование Ansible playbooks, Terraform конфигов без страха сломать production.
- **Network segmentation практика** → настройка VLAN, firewall rules, routing — на реальном железе.

## Ресурсы

```resources
books:
  - title: "Building Virtual Machine Labs"
    author: "Tony Robinson"
    note: "Гайд по построению homelab специально для security"
  - title: "The Practice of Network Security Monitoring"
    author: "Richard Bejtlich"
    note: "Security Onion и NSM в homelab"
platforms:
  - name: VulnHub
    url: https://www.vulnhub.com
    note: "Бесплатные уязвимые VM для скачивания"
  - name: r/homelab
    url: https://www.reddit.com/r/homelab/
    note: "Reddit community с идеями и гайдами"
  - name: Security Onion Solutions
    url: https://securityonionsolutions.com
    note: "Документация и гайды по Security Onion"
tools:
  - name: Proxmox VE
    url: https://www.proxmox.com/en/proxmox-ve
    note: "Бесплатный type-1 гипервизор для homelab"
  - name: pfSense
    url: https://www.pfsense.org
    note: "Open source firewall/router на базе FreeBSD"
  - name: Security Onion
    url: https://securityonionsolutions.com
    note: "Linux дистрибутив для NSM, SIEM и threat hunting"
  - name: VirtualBox
    url: https://www.virtualbox.org
    note: "Бесплатный тип-2 гипервизор, достаточен для начала"
videos:
  - name: "Christian Lempa — Homelab"
    url: https://www.youtube.com/@christianlempa
    note: "YouTube, homelab setup и automation"
  - name: "NetworkChuck — Home Lab"
    url: https://www.youtube.com/@NetworkChuck
    note: "YouTube, networking и security homelab"
```

## Практические задания

1. **Расширь стенд M0**: добавь Windows Server VM, создай AD домен, присоедини Kali к нему как workstation.
2. **pfSense**: разверни в VirtualBox как виртуальный router, настрой DHCP и DNS, направи трафик Kali через него.
3. **Security Onion** ([securityonionsolutions.com/software](https://securityonionsolutions.com/software)): разверни Import mode, загрузи pcap из Wireshark — изучи что Security Onion видит в трафике.
4. **VulnHub**: скачай [DC-1](https://www.vulnhub.com/entry/dc-1,292/) или [Basic Pentesting 1](https://www.vulnhub.com/entry/basic-pentesting-1,216/), реши без подсказок.

## Чекпоинт

Готов идти дальше если можешь:
- Объяснить сетевую топологию своей лабы: сегменты, IP ranges, правила между ними
- Показать что трафик между сегментами проходит через pfSense/firewall
- Security Onion видит трафик атаки от Kali к уязвимой VM
- Самостоятельно добавить новую VM в лабу и подключить её к нужному сегменту
