---
name: jenkins-pipeline-expert
description: Especialista em criação e otimização de Pipelines Jenkins (Declarative e Scripted). Use para gerar Jenkinsfiles, configurar agentes Kubernetes, implementar builds com Kaniko, scans de segurança com Trivy e automação de GitOps.
---

# Jenkins Pipeline Expert

Esta skill fornece diretrizes e padrões para a criação de pipelines modernas, seguras e eficientes no Jenkins, com foco especial em ambientes rodando sobre Kubernetes.

## Workflows Principais

### 1. Criação de Nova Pipeline
Ao criar uma pipeline do zero:
- **Preferência:** Utilize **Declarative Pipeline** pela sua sintaxe estruturada e legibilidade.
- **Agentes:** Evite `agent any`. Prefira definir pods específicos via Kubernetes plugin para isolamento de recursos.
- **Segurança:** Nunca exponha segredos em texto puro. Utilize o bloco `withCredentials`.

### 2. Build de Imagens (Kaniko)
Em clusters Kubernetes, utilize o Kaniko para construir imagens sem a necessidade de privilégios de root ou Docker daemon:
- Consulte [patterns.md](references/patterns.md) para o exemplo de configuração do `config.json` e execução do executor.

### 3. Integração com GitOps
Para pipelines que atualizam manifestos:
- Utilize o estágio `Update Manifest` para realizar `sed` ou `yq` em arquivos YAML.
- Realize o `push` para o repositório de CD (ArgoCD/Flux) para disparar o deployment.

## Referências e Padrões
Consulte os arquivos abaixo para implementações específicas:
- [patterns.md](references/patterns.md): Snippets prontos para PodTemplates, Kaniko, Trivy e Stash.

## Boas Práticas
- **Early Exit:** Use `set -e` em scripts shell para falhar a pipeline imediatamente em caso de erro.
- **Cleanup:** Pipelines devem ser limpas. Utilize `post { always { cleanWs() } }` para evitar acúmulo de arquivos no agente.
- **Caching:** Utilize `stash`/`unstash` para evitar re-download de dependências entre estágios quando usar múltiplos pods.
