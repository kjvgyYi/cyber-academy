---
id: "1.0"
module: 1
order: 0
kind: lesson
title: "Введение — Компьютерные сети для кибербеза"
estimatedTime: 30
difficulty: beginner
skills: []
tags: [сети, tcp-ip, arp, dns, wireshark]
---

## Обзор темы

Компьютерные сети — среда в которой происходят атаки. Каждый эксплойт, каждый reverse shell, каждый C2-beacon использует сетевые протоколы. Без понимания как работает TCP handshake нельзя интерпретировать pcap из Wireshark. Без понимания DNS — пропустишь DNS tunneling в логах.

Модуль строится снизу вверх: канальный уровень (Ethernet, ARP, MAC), сетевой (IP, ICMP, маршрутизация), транспортный (TCP, UDP, порты), прикладной (DNS, HTTP, DHCP). Каждый протокол разбирается с точки зрения атакующего и защитника одновременно.

Wireshark — главный инструмент модуля. Захват трафика в своей лаборатории делает каждый протокол видимым и конкретным — теория мгновенно привязывается к реальным пакетам.

## Почему это важно для кибербеза

- **ARP spoofing** → Man-in-the-Middle. Понимание ARP → понимание как его детектировать (Dynamic ARP Inspection).
- **DNS poisoning** → перенаправление трафика. Понимание DNS → видишь DNS tunneling в SIEM.
- **TCP SYN flood** → DoS атака на полуоткрытые соединения. Понимание TCP → настройка SYN cookies на firewall.
- **Port scanning** (nmap) работает через понимание TCP флагов (SYN, ACK, RST). Без этого не интерпретировать результаты.
- **Firewall rules** основаны на IP/port/state — без понимания сетевой модели правила пишутся вслепую.

## Ресурсы

```resources
books:
  - title: "Computer Networks"
    author: "Andrew Tanenbaum"
    note: "Классический учебник, главы по TCP/IP и security"
  - title: "Network Security Assessment"
    author: "Chris McNab"
    note: "O'Reilly — сети с точки зрения пентестера"
  - title: "Wireshark Network Analysis"
    author: "Laura Chappell"
    note: "Библия Wireshark от основателя Wireshark University"
platforms:
  - name: TryHackMe — Pre-Security Path
    url: https://tryhackme.com/path/outline/presecurity
    note: "Networking basics модули, бесплатно"
  - name: Cisco Networking Academy (NetAcad)
    url: https://www.netacad.com/courses/networking
    note: "CCNA уровень, бесплатные курсы по сетям"
  - name: Professor Messer CompTIA Network+
    url: https://www.professormesser.com/network-plus/n10-008/n10-008-video/n10-008-training-course/
    note: "Бесплатный видеокурс по сетям"
tools:
  - name: Wireshark
    url: https://www.wireshark.org
    note: "Анализатор трафика, стандарт индустрии"
  - name: tcpdump
    url: https://www.tcpdump.org
    note: "CLI-альтернатива Wireshark, незаменима на серверах"
  - name: Nmap
    url: https://nmap.org
    note: "Сканер — понимание его вывода требует знания TCP"
videos:
  - name: "NetworkChuck — Networking for Hackers"
    url: https://www.youtube.com/@NetworkChuck
    note: "YouTube, доступно и по делу"
  - name: "Professor Messer CompTIA Network+"
    url: https://www.youtube.com/@professormesser
    note: "Систематический обзор всех сетевых тем"
```

## Практические задания

1. **Wireshark basics** на TryHackMe: [tryhackme.com/room/wireshark](https://tryhackme.com/room/wireshark) — захвати и проанализируй DNS, ARP, HTTP трафик в своей лабе.
2. **Packet Analysis** на HackTheBox: [app.hackthebox.com/challenges](https://app.hackthebox.com/challenges) → Forensics → pcap задания.
3. **Захвати ARP трафик** в Wireshark пока Kali пингует Metasploitable — найди ARP request/reply, определи MAC и IP обоих хостов.
4. **nmap scan** своей Metasploitable VM → сопоставь каждый открытый порт с сервисом, объясни что это за протокол.

## Чекпоинт

Готов идти дальше если можешь:
- Объяснить что происходит пошагово когда браузер открывает google.com (DNS → TCP → HTTP)
- В Wireshark capture найти TCP handshake и объяснить каждый пакет
- Объяснить разницу между TCP и UDP и назвать 3 примера приложений для каждого
- Сказать что такое NAT и зачем он нужен
