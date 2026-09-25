---
number: 17
objectives:
  - Понять модель shared responsibility для AWS/Azure/GCP.
  - Находить типичные IAM misconfigurations (overprivileged roles, public S3 buckets).
  - Использовать ScoutSuite, Prowler, CloudMapper для аудита облачной инфраструктуры.
  - Понимать атаки на контейнеры (container escape, SSRF в cloud metadata endpoint).
  - Знать основы Kubernetes security (RBAC, Network Policies, Pod Security).
prerequisites:
  - Модуль 5 (разведка) — поиск публичных ресурсов облака.
  - Базовое понимание Docker и Kubernetes (рекомендуется).
skills:
  - cybersecurity
---

Облако стало основной инфраструктурой для большинства компаний, и вместе с ней пришли новые классы уязвимостей. Публичный S3 bucket с чувствительными данными, SSRF дающий доступ к metadata endpoint с credentials, роль IAM с overprivileged правами — эти проблемы воспроизводятся снова и снова. По данным Gartner, 99% облачных инцидентов к 2025 году будут вызваны ошибками пользователя (misconfiguration), а не провайдера.

Cloud Security требует понимания как трёх основных провайдеров (AWS, Azure, GCP), так и модели shared responsibility: провайдер отвечает за безопасность облака, клиент — за безопасность в облаке. IAM — сердце облачной безопасности: если IAM настроен правильно, атакующий с credential dump не уйдёт далеко.

```info Бесплатные учебные среды
AWS, Azure, GCP — все предоставляют free tier для практики. CloudGoat (Rhino Security) и flaws.cloud созданы специально как уязвимые облачные среды для обучения.
```
