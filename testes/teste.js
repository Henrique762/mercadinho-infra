import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. Configuração do Teste de Carga (Options)
export const options = {
  stages: [
    { duration: '20s', target: 30 }, // Sobe para 30 usuários simultâneos em 20s
    { duration: '20s', target: 30 },  // Mantém 5 usuários por 20 segundos
    { duration: '10s', target: 0 },  // Desce para 0 (ramping-down)
  ],
  thresholds: {
    http_req_failed: ['rate<0.15'], // O teste falha se mais de 1% das requisições derem erro
    http_req_duration: ['p(95)<500'], // 95% das requisições devem ser abaixo de 500ms
  },
};

// 2. Função de Teste
export default function () {
  const url = 'http://127.0.0.1:8080/api/sellers';
  
  // Gerando um identificador único para evitar erro de duplicidade
  const uniqueID = Date.now() + Math.random();
  
  const payload = JSON.stringify({
    nome: `${uniqueID}`,
    cnpj: `${Math.floor(Math.random() * 100000000000000)}`, // CNPJ randômico simples
    email: `${uniqueID}@gmail.com`,
    senha: "12345aH@",
    celular: "+5511962968213"
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Realiza o POST
  const res = http.post(url, payload, params);

  // 3. Validações
  check(res, {
    'status é 201 ou 200': (r) => r.status === 201 || r.status === 200,
    'tempo de resposta < 500ms': (r) => r.timings.duration < 500,
  });
}