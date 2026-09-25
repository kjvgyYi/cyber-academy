---
id: "17.0"
module: 17
order: 0
kind: lesson
title: "Введение — Cloud Security"
estimatedTime: 30
difficulty: advanced
skills: []
tags: [cloud, aws, azure, iam, s3, containers]
---

## Обзор темы

Облако изменило threat landscape. S3 bucket с публичным доступом — это не теоретическая уязвимость, это реальные утечки данных которые происходят каждую неделю. IAM роль с правами AdministratorAccess на dev окружении которая может быть escalated до prod — типичная finding на любом cloud pentest. Понимание облака стало обязательным для любого security специалиста.

Модуль охватывает три провайдера (AWS, Azure, GCP) на уровне security-релевантных сервисов: IAM (identity and access management), storage (S3, Blob, GCS), compute (EC2, VMs), containers (ECS, AKS, GKE), serverless (Lambda, Functions). Отдельный блок — атаки: SSRF → cloud metadata → credentials, public S3 enumeration, IAM privilege escalation, container escape.

## Почему это важно для кибербеза

- **AWS SSRF → IMDSv1** → любой SSRF в приложении на EC2 = получение IAM credentials с metadata endpoint.
- **Public S3 buckets** → утечки данных через misconfiguration, находятся через S3Scanner / grayhatwarfare.com.
- **IAM Privilege Escalation** → разбор всех путей в Pacu + IAM Policy escalation матрица.
- **Container escape** → misconfigurations в Docker/K8s позволяют атакующему выйти за пределы контейнера.
- **Cloud Security Engineer** — одна из самых высокооплачиваемых ролей в кибербезопасности прямо сейчас.

## Ресурсы

```resources
books:
  - title: "Hacking the Cloud"
    url: https://hackingthe.cloud
    note: "Бесплатный онлайн ресурс с техниками атак на облако"
  - title: "AWS Security"
    author: "Dylan Shields"
    note: "Manning Publications — безопасность AWS от практика"
  - title: "Kubernetes Security and Observability"
    author: "Brendan Creane, Amit Gupta"
    note: "O'Reilly — K8s security в production"
platforms:
  - name: CloudGoat (Rhino Security)
    url: https://github.com/RhinoSecurityLabs/cloudgoat
    note: "Уязвимая AWS среда для практики cloud pentesting"
  - name: flaws.cloud
    url: http://flaws.cloud
    note: "Бесплатный challenge по AWS security от Scott Piper"
  - name: TryHackMe — Cloud Security
    url: https://tryhackme.com/module/cloud-security
    note: "AWS и Azure security модули"
tools:
  - name: Pacu
    url: https://github.com/RhinoSecurityLabs/pacu
    note: "AWS exploitation framework от Rhino Security"
  - name: ScoutSuite
    url: https://github.com/nccgroup/ScoutSuite
    note: "Multi-cloud security auditing tool"
  - name: Prowler
    url: https://github.com/prowler-cloud/prowler
    note: "AWS security best practices assessment"
videos:
  - name: "fwd:cloudsec конференция"
    url: https://www.youtube.com/@fwdcloudsec
    note: "YouTube, ведущая конференция по cloud security"
  - name: "HackTricks Cloud"
    url: https://cloud.hacktricks.xyz
    note: "Cloud pentesting techniques wiki"
```

## Практические задания

1. **flaws.cloud** ([flaws.cloud](http://flaws.cloud)) — пройди все 6 уровней, каждый раскрывает реальную AWS misconfiguration.
2. **CloudGoat**: разверни и реши сценарий "iam_privesc_by_rollback".
3. **AWS Free Tier**: создай аккаунт, настрой S3 bucket, проверь настройки публичного доступа через ScoutSuite.
4. **TryHackMe Cloud Security module** ([tryhackme.com/module/cloud-security](https://tryhackme.com/module/cloud-security)).

## Чекпоинт

Готов идти дальше если можешь:
- Найти и эксплуатировать публичный S3 bucket в CloudGoat среде
- Объяснить IAM Privilege Escalation и показать конкретный путь через iam:PassRole
- Описать как SSRF в приложении на EC2 ведёт к захвату IAM credentials
- Провести аудит AWS аккаунта с ScoutSuite и интерпретировать top-5 findings
