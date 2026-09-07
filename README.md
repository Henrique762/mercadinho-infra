# 🏗️ Mercadinho - Infraestrutura & HomeLab Kubernetes

Repositório central de Infraestrutura como Código (IaC), manifestos Kubernetes, configurações de Helm, automação de GitOps com ArgoCD e stack completa de observabilidade e CI/CD do ecossistema **Mercadinho**.

---

## 📌 Visão Geral da Arquitetura

O ambiente é executado sobre um cluster **Kubernetes (Minikube Multi-Node)** em ambiente local (WSL2), projetado para simular uma infraestrutura corporativa resiliente, segura e observável.

```text
                                  [ Navegador / Cliente ]
                                             │
                                   (https://*.henrique.local)
                                             ▼
                             ┌───────────────────────────────┐
                             │    Envoy Gateway (Gateway API)│
                             │    Cert-Manager Wildcard TLS  │
                             └───────────────┬───────────────┘
                                             │
             ┌───────────────────────────────┼───────────────────────────────┐
             │                               │                               │
             ▼                               ▼                               ▼
    [ app.henrique.local ]         [ api.henrique.local ]         [ grafana.henrique.local ]
      (Frontend React)               (Backend Flask API)           [ argocd.henrique.local  ]
      Namespace: frontend            Namespace: flask-api          [ harbor.henrique.local  ]
             │                               │                     [ sonar.henrique.local   ]
             │                               ▼
             │                      [ PostgreSQL (DB) ]
             │                               │
             └───────────────┬───────────────┘
                             │ (OpenTelemetry OTLP :4318)
                             ▼
              ┌──────────────────────────────┐
              │  OpenTelemetry Collector     │
              └──────────────┬───────────────┘
                             │
             ┌───────────────┴───────────────┐
             ▼ (Traces)                      ▼ (Métricas de Tracing via remote_write)
      [ Grafana Tempo ] ──────────────► [ VictoriaMetrics (TSDB) ]
             │                               ▲
             └───────────────┬───────────────┘
                             │ (TraceQL & PromQL)
                             ▼
                    [ Grafana Server ]
             (Waterfall + Node Graph Map)
```

---

## 🛠️ Componentes do Ecossistema

### 1. Ingress & Roteamento Moderno
* **Envoy Gateway:** Implementação moderna da **Kubernetes Gateway API** (`GatewayClass`, `Gateway`, `HTTPRoute`).
* **Cert-Manager:** Emissor de certificados TLS locais (`*.henrique.local`) com renovação automatizada.

### 2. Integração e Entrega Contínua (CI/CD & GitOps)
* **Jenkins:** Executado no Kubernetes com agentes dinâmicos em pods (executores descartáveis).
* **Kaniko:** Compilação de imagens Docker/OCI dentro de containers Kubernetes sem necessidade de Docker-in-Docker (`dind`) nem privilégios de root.
* **Harbor Registry:** Registro privado corporativo de imagens com escaneamento contínuo de vulnerabilidades via **Trivy**.
* **SonarQube:** Análise estática contínua de código, cobertura e Quality Gate.
* **ArgoCD:** Controladora GitOps que sincroniza e reconcilia os manifestos deste repositório com o estado desejado no cluster.

### 3. Stack Completa de Observabilidade
* **OpenTelemetry Operator:** Injeta agentes de auto-instrumentação (*Zero-Code Instrumentation*) nas aplicações via *Mutating Admission Webhook* e *Init Containers*.
* **OpenTelemetry Collector:** Proxy centralizador de telemetria que recebe traces via gRPC/HTTP OTLP e despacha para os destinos corretos.
* **Grafana Tempo:** Armazenamento de traces distribuídos em alta performance com o módulo `metrics-generator` ativo (`service-graphs` e `span-metrics`).
* **VictoriaMetrics:** Banco de dados de séries temporais (TSDB) de alta performance recebendo ingestão via `remote_write` do Tempo e servindo consultas PromQL.
* **Prometheus & Node Exporter:** Monitoramento da saúde de nós, containers e consumo de hardware do cluster.
* **Grafana:** Visualização com dashboards customizados, suporte a **TraceQL**, visualização em **Waterfall** e diagrama de dependências dinâmico em **Node Graph**.

---

## 📂 Estrutura do Repositório

```text
mercadinho-infra/
├── argocd/               # Definições de Applications do ArgoCD (GitOps)
├── dashboards/           # Modelos de dashboards do Grafana (JSON)
│   ├── traces-overview.json              # Dashboard de Traces, Waterfall & Node Graph
│   └── kubernetes-cluster-services.json # Dashboard de métricas do cluster
├── docs/                 # Documentação arquitetural aprofundada
│   └── observability-tracing-guide.md    # Guia completo de Tracing, OTel e Métricas
├── helm-manifests/       # Arquivos values customizados para charts Helm
│   ├── grafana_values_latest.yaml
│   ├── sonarqube-values.yaml
│   ├── tempo-values.yaml
│   └── victoria-metrics-values.yaml
├── manifests/            # Manifestos Kubernetes puros (Deployments, Services, Routes)
│   ├── argocd/           # Rotas do ArgoCD e Grafana Gateway
│   ├── flask-api/        # Deployments, banco e Instrumentation do OTel
│   ├── frontend/         # Deployments e rotas do Frontend
│   └── monitoring/       # Collector OTel e recursos de observabilidade
└── tests/                # Testes de carga e validação
    └── k6/               # Scripts k6 segregados para testes contínuos
        ├── backend/      # Testes de carga dedicados à API Flask e Banco
        ├── frontend/     # Testes de carga dedicados à SPA React e Assets
        └── e2e/          # Fluxo integrado de ponta a ponta (E2E)
```

---

## 🚀 Operações e Solução de Problemas no WSL2

### Ajustes Críticos de Sistema Operacional (WSL2)
* **Limite de Inotify (`too many open files` no kube-proxy):**
  ```bash
  minikube ssh -- "sudo sysctl -w fs.inotify.max_user_instances=8192"
  ```
* **Memória dos Nós Docker do Minikube:**
  Para evitar I/O thrashing nos nós com ferramentas Java (Jenkins e SonarQube):
  ```bash
  docker update --memory 3.5g --memory-swap 4g minikube minikube-m02 minikube-m03
  ```

### Gestão do Certificado Wildcard TLS (`*.henrique.local`)
Para confiar no certificado HTTPS no Windows:
```bash
kubectl get secret wildcard-tls-secret -n gateway-system -o jsonpath='{.data.tls\.crt}' | base64 -d > /tmp/henrique.local.crt
cp /tmp/henrique.local.crt /mnt/c/Users/Henrique/Desktop/henrique.local.crt
```
*Instale no Windows em **Autoridades de Certificação Raiz Confiáveis** (Trusted Root Certification Authorities).*

---

## 🔗 Repositórios Relacionados
* 🐍 **Backend (Flask REST API):** [mercadinho-backend](https://github.com/Henrique762/mercadinho-backend)
* 🛒 **Frontend (React SPA):** [mercadinho-frontend](https://github.com/Henrique762/mercadinho-frontend)
