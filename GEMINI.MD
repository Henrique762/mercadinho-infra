# Contexto do Projeto: HomeLab Mercadinho

## Visão Geral
Você está operando no diretório `/mercadinho`. Este é um monorepo de um HomeLab que contém o código das aplicações (front-end e back-end) e toda a infraestrutura como código (IaC). O projeto é versionado remotamente no GitHub e utiliza práticas de GitOps.

## Ambiente de Infraestrutura
* **Cluster Local:** Minikube operando com o driver do Docker.
* **Atenção a Volumes e Persistência:** Devido ao uso do driver Docker no Minikube, evite mapear ou depender de diretórios temporários do host (como `/tmp`) para persistência de dados dos containers, pois esses dados são perdidos ao reiniciar o cluster. Sempre alerte sobre a volatilidade do armazenamento local durante os testes.
* **Recursos:** Sendo um HomeLab local, os recursos (CPU/RAM) são limitados. Sempre defina e respeite `requests` e `limits` otimizados para laboratório nos manifestos e values do Helm.

## Stack Tecnológica e Ferramentas
* **Gerenciamento de Pacotes:** Helm (para instalação de ferramentas e empacotamento das aplicações).
* **CD / GitOps:** ArgoCD.
* **Orquestração:** Kubernetes (K8s).

## Regras de Operação do Agente (Guidelines)

1. **Transparência e Explicação de Mudanças:** Sempre que você sugerir, gerar ou executar uma modificação em qualquer arquivo, você DEVE explicar explicitamente o que está sendo alterado (estado anterior) e para o que está sendo alterado (novo estado), justificando o motivo técnico da mudança.
2. **Fluxo GitOps Estrito:** O estado do cluster é gerenciado pelo ArgoCD. NÃO aplique alterações permanentes diretamente no cluster via `kubectl apply` ou `helm install/upgrade`. O seu objetivo principal é modificar, validar e preparar os arquivos locais (YAMLs e Helm Charts) para que sejam commitados no GitHub. 
3. **Uso do Terminal:** Restrinja o uso de comandos aplicados diretamente no cluster apenas para operações de debug, troubleshooting, leitura de logs ou testes efêmeros.
4. **Validação Pré-Commit:** Antes de sugerir um `git commit`, valide rigorosamente a sintaxe da infraestrutura. Utilize comandos como `helm lint`, `helm template` ou `kubectl apply --dry-run=client` para garantir que os manifestos estão corretos.
5. **Gestão de Segredos:** Nunca grave senhas, tokens ou chaves em texto plano nos manifestos. Caso seja necessário configurar uma nova credencial, utilize a abordagem de secrets selados ou instrua sobre a criação manual no cluster, mantendo o repositório limpo.
6. **Caminhos Relativos:** Assuma sempre que a raiz da sua execução é o diretório `/mercadinho`. Respeite a separação estrutural entre as pastas do ArgoCD, aplicações e configurações de infraestrutura.