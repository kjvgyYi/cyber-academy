---
id: "4.0"
module: 4
order: 0
kind: lesson
title: "Введение — Криптография для кибербеза"
estimatedTime: 30
difficulty: beginner
skills: []
tags: [cryptography, tls, hashing, asymmetric, symmetric]
---

## Обзор темы

Криптография — это язык безопасных коммуникаций. TLS шифрует твой трафик. Хеши защищают пароли в базе данных. Цифровые подписи гарантируют что обновление ПО пришло от легитимного издателя. Каждый раз когда ты видишь замочек в браузере — это криптография в работе.

Модуль строится от основ: симметричное шифрование (AES, работа блочных шифров, режимы ECB/CBC/GCM), асимметричное (RSA, ECC, Diffie-Hellman), хеш-функции (SHA-256, bcrypt для паролей), PKI и TLS handshake. Отдельный раздел — реальные атаки: Padding Oracle, BEAST, POODLE, Heartbleed, недостатки кастомных реализаций.

## Почему это важно для кибербеза

- **CTF Crypto задания** — 20% CTF заданий по криптографии, нужно ломать слабые реализации.
- **TLS misconfiguration** — устаревшие версии (TLS 1.0/1.1), слабые cipher suites — находятся на каждом пентесте.
- **Password cracking** — понимание bcrypt/scrypt/Argon2 vs MD5/SHA1 определяет скорость взлома и реальный риск.
- **Web security** — JWT tokens, cookie signing, HMAC — всё это криптография, и ошибки в ней = критические уязвимости.
- **Code review** — нахождение crypto ошибок (неправильный IV, реиспользование nonce) требует понимания протоколов.

## Ресурсы

```resources
books:
  - title: "Serious Cryptography"
    author: "Jean-Philippe Aumasson"
    note: "No Starch Press — лучшая практическая книга по крипто для разработчиков"
  - title: "Applied Cryptography"
    author: "Bruce Schneier"
    note: "Классика, исчерпывающий справочник"
  - title: "The Code Book"
    author: "Simon Singh"
    note: "История криптографии, легко читается"
platforms:
  - name: Cryptohack
    url: https://cryptohack.org
    note: "Специализированная платформа для изучения криптографии через задачи"
  - name: CryptoSmith
    url: https://cryptosmith.io
    note: "Интерактивные упражнения по криптографии"
  - name: PortSwigger Web Security — Crypto topics
    url: https://portswigger.net/web-security
    note: "JWT attacks, padding oracle, CBC bitflipping"
tools:
  - name: CyberChef
    url: https://gchq.github.io/CyberChef/
    note: "Браузерный инструмент для всех крипто-операций"
  - name: Hashcat
    url: https://hashcat.net/hashcat/
    note: "GPU-ускоренный взлом хешей"
  - name: OpenSSL CLI
    url: https://www.openssl.org
    note: "Стандартная криптографическая библиотека и CLI инструмент"
videos:
  - name: "Christof Paar — Introduction to Cryptography"
    url: https://www.youtube.com/channel/UC1usFRN4LCMcfIV7UjHNuQg
    note: "YouTube, академический курс Рурского университета — бесплатно"
  - name: "LiveOverflow — Crypto for Hackers"
    url: https://www.youtube.com/@LiveOverflow
    note: "CTF-ориентированные объяснения крипто"
```

## Практические задания

1. **CryptoHack** ([cryptohack.org](https://cryptohack.org)) — начни с Introduction раздела, пройди первые 10 задач.
2. **CyberChef**: зашифруй текст AES-CBC, попробуй расшифровать с неправильным IV — поймёшь почему IV важен.
3. **PortSwigger** Padding Oracle lab ([portswigger.net/web-security/authentication/other-mechanisms](https://portswigger.net/web-security/authentication/other-mechanisms)).
4. **Hashcat**: скачай rockyou.txt, взломай несколько MD5 и bcrypt хешей — почувствуй разницу в скорости.

## Чекпоинт

Готов идти дальше если можешь:
- Объяснить разницу между симметричным и асимметричным шифрованием и когда использовать каждое
- Объяснить почему MD5 больше не используется для паролей и что нужно вместо него
- Описать TLS 1.3 handshake по шагам (без заглядывания в материалы)
- Объяснить что такое Perfect Forward Secrecy и зачем она нужна
