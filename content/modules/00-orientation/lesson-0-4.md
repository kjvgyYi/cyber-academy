---
id: "0.4"
module: 0
order: 4
kind: lesson
title: Уязвимая цель и host-only сеть
estimatedTime: 45
difficulty: beginner
skills: [kali, networking, cybersecurity]
prerequisites: ["0.3"]
tags: [metasploitable, host-only, изоляция, цель, сеть]
quizIds: [quiz-0-4]
---

## Learning Objectives

- Понять, зачем нужна отдельная уязвимая машина для тренировки.
- Развернуть Metasploitable 2 как учебную цель.
- Настроить **host-only** сеть, чтобы цель была изолирована от интернета.
- Проверить связь между Kali и целью.

## Theory

### Зачем отдельная цель

Атаковать (даже учебно) можно только то, что тебе разрешено. Своя Kali — это инструмент, но тренироваться «на себе» неудобно. Поэтому поднимают **намеренно уязвимую машину** — на ней десятки дыр, специально созданных для обучения.

**Metasploitable 2** — классическая учебная цель: старый Linux с открытыми уязвимыми сервисами. Она нужна именно для того, чтобы её ломали.

```warning Metasploitable нельзя выпускать в интернет
Эта машина дырявая по замыслу. Если она получит доступ в реальную сеть, её может заразить кто угодно. Держи её **только** в host-only сети.
```

### Что такое host-only сеть

VirtualBox умеет несколько типов сетей. Нам важны два:

| Тип | Кто с кем видится | Для чего |
|---|---|---|
| **NAT** | VM → интернет, но не другие VM | Обновления, скачивание |
| **Host-only** | VM ↔ VM ↔ хост, **без интернета** | Изолированная лаборатория |

Идея стенда: Kali и Metasploitable в **одной host-only сети** видят друг друга, но цель отрезана от внешнего мира. Kali может иметь второй адаптер (NAT) для обновлений.

```info Аналогия
Host-only сеть — это закрытая песочница. Внутри можно всё, наружу — ничего. Именно так безопасно тренироваться на уязвимой машине.
```

## Command Walkthrough

После настройки сети проверь, что Kali видит цель. Узнать адрес Metasploitable (войти `msfadmin`/`msfadmin`):

```terminal
$ ip a

… inet 192.168.56.102/24 …  (адрес в host-only сети)
```

С Kali пропинговать цель:

```terminal
$ ping -c 3 192.168.56.102

64 bytes from 192.168.56.102: icmp_seq=1 ttl=64 time=0.6 ms
64 bytes from 192.168.56.102: icmp_seq=2 ttl=64 time=0.5 ms

--- 192.168.56.102 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss
```

`0% packet loss` — связь есть, стенд собран.

## Guided Practice

```task
id: task-0-4-download
title: Развернуть Metasploitable 2
input: false
prompt: |
  1. Скачай Metasploitable 2 (поиск: «Metasploitable 2 download», официальный источник — Rapid7/SourceForge).
  2. Распакуй — внутри готовый `.vmdk` диск.
  3. В VirtualBox создай новую VM (тип Linux), подключи этот диск как существующий.
  4. **Не запускай, пока не настроишь сеть (следующий шаг).**
hints:
  - Логин/пароль Metasploitable по умолчанию — `msfadmin` / `msfadmin`.
```

```task
id: task-0-4-network
title: Настроить host-only
input: false
prompt: |
  1. В VirtualBox: **File → Tools → Network Manager** → создай host-only сеть (обычно `vboxnet0`, сеть 192.168.56.0/24).
  2. У **Metasploitable**: Settings → Network → Adapter 1 → **Host-only Adapter**.
  3. У **Kali**: Adapter 1 = Host-only (для связи с целью), Adapter 2 = NAT (для интернета).
  4. Запусти обе VM.
hints:
  - Metasploitable должна иметь ТОЛЬКО host-only адаптер — никакого NAT.
solution: |
  После запуска на Metasploitable выполни `ifconfig` (старая система, не `ip a`), запиши её адрес 192.168.56.x. Он понадобится для проверки связи.
```

```task
id: task-0-4-verify
title: Проверить связь
input: true
answers:
  - ping
  - ping -c 3
answerPattern: "^ping"
prompt: |
  Какой командой с Kali проверить, что цель по адресу 192.168.56.102 доступна по сети? Введи команду (без адреса или с ним).
hints:
  - Отправляет ICMP-эхо и ждёт ответа.
solution: |
  `ping -c 3 192.168.56.102`. Если видишь `0% packet loss` — стенд собран правильно и изолированно.
```

## Independent Exercise

1. Убедись, что Metasploitable **не** имеет доступа в интернет: с неё выполни `ping -c 2 8.8.8.8` — пакеты не должны доходить.
2. Проверь обратное: Kali через NAT-адаптер интернет имеет.
3. Сделай снапшоты обеих VM в чистом состоянии.

## Common Mistakes

| Ошибка | Риск |
|---|---|
| Дать Metasploitable NAT/Bridged | Уязвимая машина в реальной сети — опасно |
| Забыть host-only адаптер у Kali | Kali не увидит цель |
| Не записать адрес цели | Придётся каждый раз искать заново |
| Тестировать на «настоящих» сайтах вместо цели | Нелегально — см. урок 0.1 |

## Summary

- Учебная цель (**Metasploitable 2**) специально уязвима — для тренировки.
- **Host-only сеть** изолирует её от интернета: VM видят друг друга, наружу хода нет.
- Kali: host-only (цель) + NAT (интернет). Metasploitable: только host-only.
- `ping` подтверждает связь; `0% packet loss` = стенд готов.

## Quiz

```quiz
quiz-0-4
```

## Further Reading

- Rapid7 про Metasploitable: [docs.rapid7.com/metasploit/metasploitable-2](https://docs.rapid7.com/metasploit/metasploitable-2/).
- VirtualBox networking modes: [virtualbox.org/manual/ch06.html](https://www.virtualbox.org/manual/ch06.html).
