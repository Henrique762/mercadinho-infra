# Contexto do Projeto: HomeLab Mercadinho

## Visão Geral
Você está operando no diretório `/mercadinho`. Este é um monorepo de um HomeLab que contém o código das aplicações (front-end e back-end) e toda a infraestrutura como código (IaC). O projeto é versionado remotamente no GitHub e utiliza práticas de GitOps.

## Ambiente de Infraestrutura
* **Cluster Local:** Minikube operando com o driver do Docker.
* **Atenção a Volumes e Persistência:** Devido ao uso do driver Docker no Minikube, evite mapear ou depender de diretórios temporários do host (como `/tmp`) para persistência de dados dos containers, pois esses dados são perdidos ao reiniciar o cluster. Sempre alerte sobre a volatilidade do armazenamento local durante os testes.
* **Gestão de Permissões de Volume:** Em ambientes Minikube/Docker, volumes persistentes frequentemente apresentam erros de "Permission Denied" (Err: 13). Utilize `initContainers` com `chown` recursivo para garantir os UIDs corretos (Postgres: 999, Harbor Registry/Jobservice: 10000).
* **Resolução Interna via Gateway:** O tráfego interno para domínios locais (ex: `harbor.henrique.local`) deve ser direcionado ao IP do Envoy Gateway via `hostAliases`. O IP atual do Envoy é `10.99.67.213`.
* **Recursos:** Sendo um HomeLab local, os recursos (CPU/RAM) são limitados. Sempre defina e respeite `requests` e `limits` otimizados para laboratório nos manifestos e values do Helm.

## Stack Tecnológica e Ferramentas
* **Gerenciamento de Pacotes:** Helm (para instalação de ferramentas como Harbor, Jenkins e ArgoCD).
* **CD / GitOps:** ArgoCD (gerencia aplicações e rotas).
* **Ingress/Gateway:** Envoy Gateway (Gerenciado via Gateway API).
* **Orquestração:** Kubernetes (K8s) com namespaces separados: `flask-api`, `frontend`, `harbor`, `jenkins`, `envoy-gateway-system`.

## Regras de Operação do Agente (Guidelines)

1. **Transparência e Explicação de Mudanças:** Sempre que você sugerir, gerar ou executar uma modificação em qualquer arquivo, você DEVE explicar explicitamente o que está sendo alterado (estado anterior) e para o que está sendo alterado (novo estado), justificando o motivo técnico da mudança.
2. **Fluxo GitOps Estrito:** O estado do cluster é gerenciado pelo ArgoCD. NÃO aplique alterações permanentes diretamente no cluster via `kubectl apply` ou `helm install/upgrade`. O seu objetivo principal é modificar, validar e preparar os arquivos locais (YAMLs e Helm Charts) para que sejam commitados no GitHub. Lembrando que é para realizar Commits respeitando 100% o .gitignore. 
3. **Uso do Terminal:** Restrinja o uso de comandos aplicados diretamente no cluster apenas para operações de debug, troubleshooting, leitura de logs ou testes efêmeros. Exceção permitida para `helm upgrade` em fix de emergência, desde que o arquivo local seja atualizado.
4. **Validação Pré-Commit:** Antes de sugerir um `git commit`, valide rigorosamente a sintaxe da infraestrutura. Utilize comandos como `helm lint`, `helm template` ou `kubectl apply --dry-run=client` para garantir que os manifestos estão corretos.
5. **Gestão de Segredos:** Nunca grave senhas, tokens ou chaves em texto plano nos manifestos. Utilize `secrets` do Kubernetes criadas via CLI ou abordagem de secrets selados. Certifique-se de que `harbor-pull-secret` exista nos namespaces de aplicação.
6. **Caminhos Relativos:** Assuma sempre que a raiz da sua execução é o diretório `/mercadinho`. Respeite a separação estrutural entre as pastas do ArgoCD, aplicações e configurações de infraestrutura.
7. **Configuração do Harbor Registry:** Sempre garanta que `relativeurls: true` esteja habilitado no registry para evitar loops de redirecionamento HTTP->HTTPS quando atrás do Envoy Gateway durante operações de `kaniko push`.
