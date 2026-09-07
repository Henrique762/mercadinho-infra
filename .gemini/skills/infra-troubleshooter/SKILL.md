---
name: infra-troubleshooter
description: Especialista em diagnóstico e correção de problemas de infraestrutura no HomeLab (Minikube, Envoy, Jenkins, Harbor, ArgoCD).
---

# Skill: Infra Troubleshooter (HomeLab)

Esta skill fornece diretrizes para diagnosticar e resolver problemas na infraestrutura do HomeLab, focando no ecossistema Minikube e no fluxo de GitOps.

## 1. Contexto do Ambiente
O projeto opera em um cluster local **Minikube** utilizando o driver do Docker. Toda a infraestrutura e aplicações são gerenciadas seguindo o fluxo:
- **Jenkins (CI):** Automatiza o build das imagens e integração contínua.
- **Harbor (Registry):** Atua como o repositório centralizado de imagens Docker.
- **ArgoCD (CD/GitOps):** Garante que o estado do cluster reflita fielmente os manifestos armazenados no Git.
- **Envoy Gateway:** Responsável pelo roteamento de tráfego externo e interno via Gateway API.

## 2. Diagnóstico de Fluxo (Pipeline & Deploy)
Quando houver falhas na atualização de aplicações:
1. **Jenkins:** Verifique se o Pipeline de build concluiu o push da imagem para o `harbor.henrique.local`.
2. **ArgoCD:** Acesse a interface do ArgoCD para verificar se a aplicação está em estado `Synced` e `Healthy`. Se estiver `Degraded`, verifique os eventos do Kubernetes.
3. **Imagens:** Certifique-se de que a tag da imagem no manifesto condiz com a tag disponível no Harbor.

## 3. Conectividade e Resolução Interna
O tráfego para domínios locais (ex: `harbor.henrique.local`, `argocd.henrique.local`) deve ser direcionado ao IP do Envoy Gateway.
- **IP Atual do Envoy:** `10.99.67.213`.
- **Configuração:** Pods que necessitam de comunicação interna com esses serviços devem possuir `hostAliases` configurados apontando para este IP.

## 4. Ferramentas de Debug
- **Logs:** `kubectl logs -n <namespace> <pod-name>` para erros de aplicação.
- **Descrição:** `kubectl describe pod -n <namespace> <pod-name>` para erros de agendamento ou falta de recursos.
- **Rede:** Verifique o status das `HTTPRoute` no namespace correspondente para validar o roteamento do Envoy.
