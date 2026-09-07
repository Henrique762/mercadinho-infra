import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Métricas personalizadas
const apiHealthDuration = new Trend('api_health_duration', true);
const apiLoginDuration = new Trend('api_login_duration', true);
const apiProdutosDuration = new Trend('api_produtos_duration', true);
const successRate = new Rate('successful_requests');

export const options = {
  insecureSkipTLSVerify: true, // Permite certificados autoassinados/locais (*.henrique.local)
  stages: [
    { duration: '10s', target: 5 },   // Ramp-up para 5 usuários virtuais
    { duration: '20s', target: 20 },  // Carga com 20 usuários concorrentes
    { duration: '10s', target: 0 },   // Ramp-down
  ],
  thresholds: {
    'http_req_failed': ['rate<0.05'],       // Menos de 5% de falhas
    'api_health_duration': ['p(95)<200'],   // 95% dos health checks abaixo de 200ms
    'api_login_duration': ['p(95)<300'],    // 95% dos logins abaixo de 300ms
    'successful_requests': ['rate>0.95'],   // Taxa de sucesso maior que 95%
  },
};

const BASE_URL = __ENV.API_URL || 'https://api.henrique.local';

export default function () {
  // 1. Health Check da API e Conectividade com PostgreSQL
  group('1. Health Check', function () {
    const res = http.get(`${BASE_URL}/api/health`, { tags: { name: 'HealthCheck' } });
    const ok = check(res, {
      'status é 200': (r) => r.status === 200,
      'conectado ao banco': (r) => r.body.includes('"database": "connected"'),
    });
    apiHealthDuration.add(res.timings.duration);
    successRate.add(ok);
  });

  sleep(0.5);

  // 2. Autenticação & Validação de Credenciais
  group('2. Login & Auth', function () {
    const payload = JSON.stringify({
      email: 'admin@admin.com',
      senha: 'admin',
    });
    const params = {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'LoginAuth' },
    };
    const res = http.post(`${BASE_URL}/api/login/auth`, payload, params);
    const ok = check(res, {
      'resposta tratada pelo backend (200 ou 400)': (r) => r.status === 200 || r.status === 400,
      'tempo de resposta < 500ms': (r) => r.timings.duration < 500,
    });
    apiLoginDuration.add(res.timings.duration);
    successRate.add(ok);
  });

  sleep(0.5);

  // 3. Consulta de Produtos (Validação de Rota e Token)
  group('3. Produtos', function () {
    const res = http.get(`${BASE_URL}/api/produtos`, { tags: { name: 'GetProdutos' } });
    const ok = check(res, {
      'status esperado (401 sem token ou 200 com token)': (r) => r.status === 401 || r.status === 200,
    });
    apiProdutosDuration.add(res.timings.duration);
    successRate.add(ok);
  });

  sleep(0.5);

  // 4. Criação de Vendedor / Cadastro
  group('4. Vendedores (Registro)', function () {
    const uniqueID = Date.now() + Math.random();
    const payload = JSON.stringify({
      nome: `Vendedor_${uniqueID}`,
      cnpj: `${Math.floor(Math.random() * 100000000000000)}`,
      email: `vendedor_${uniqueID}@gmail.com`,
      senha: 'SenhaForte123@',
      celular: '+5511999999999',
    });
    const params = {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'CreateSeller' },
    };
    const res = http.post(`${BASE_URL}/api/vendedores`, payload, params);
    check(res, {
      'status de resposta válido': (r) => [200, 201, 400, 404].includes(r.status),
    });
  });

  sleep(0.5);
}
