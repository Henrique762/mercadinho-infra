#!/bin/bash
set -e

# ======================================================
# VARIABLES (EDIT IF NEEDED)
# ======================================================
ARGO_NS="argocd"

echo "📌 Atualizando repositórios Helm..."
helm repo add argo https://argoproj.github.io/argo-helm
helm repo add eks https://aws.github.io/eks-charts
helm repo update

# ======================================================
# ARGO CD INSTALLATION
# ======================================================

echo "🚀 Instalando Argo CD via Helm..."
helm upgrade --install argocd argo/argo-cd \
  --namespace $ARGO_NS \
  --create-namespace

echo "✅ Argo CD instalado com sucesso!"

### ARGO Rollout ###

echo "Instalando Argo CD Rollouts..."
kubectl create namespace argo-rollouts
kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml


echo "✅ Argo Rollout instalado com sucesso!"


echo "🚀 Aplicando Storage Class"

kubectl apply -f resources-k8s/storageclass.yaml

echo "✅ Storage Class instalado com sucesso!"

echo "🚀 Aplicando Application do ArgoCD"

kubectl apply -f ../argocd/app.yaml

echo "✅ Storage Class instalado com sucesso!"


