import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Métricas personalizadas
const frontendDuration = new Trend('frontend_req_duration', true);
const apiHealthDuration = new Trend('api_health_duration', true);
const apiLoginDuration = new Trend('api_login_duration', true);
const successRate = new Rate('successful_requests');

export const options = {
  insecureSkipTLSVerify: true, // Aceita o certificado TLS wildcard local (*.henrique.local)
  stages: [
    { duration: '10s', target: 5 },   // Ramp-up gradual para 5 usuários virtuais
    { duration: '15s', target: 15 },  // Pico de carga com 15 usuários concorrentes
    { duration: '5s', target: 0 },    // Ramp-down
  ],
  thresholds: {
    'frontend_req_duration': ['p(95)<300'], // 95% das requisições do frontend abaixo de 300ms
    'api_health_duration': ['p(95)<200'],   // 95% do health check da API abaixo de 200ms
    'successful_requests': ['rate>0.95'],   // 95%+ de sucesso nas validações esperadas
  },
};

const FRONTEND_URL = 'https://frontend.henrique.local';
const API_URL = 'https://api.henrique.local';

export default function () {
  // 1. Testes de Frontend
  group('1. Frontend Web App', function () {
    // 1.1 Página Inicial (HTML)
    const resHome = http.get(FRONTEND_URL, { tags: { name: 'Frontend_HTML' } });
    const isHomeOk = check(resHome, {
      'Frontend HTML status é 200': (r) => r.status === 200,
      'Frontend contém título Mercado Virtual': (r) => r.body.includes('Mercado Virtual'),
    });
    frontendDuration.add(resHome.timings.duration);
    successRate.add(isHomeOk);

    // 1.2 Asset Estático (config.js)
    const resConfig = http.get(`${FRONTEND_URL}/config.js`, { tags: { name: 'Frontend_Config' } });
    check(resConfig, {
      'Frontend config.js status é 200': (r) => r.status === 200,
    });

    // 1.3 Bundle JS principal
    const resBundle = http.get(`${FRONTEND_URL}/assets/index-DX4WU2CV.js`, { tags: { name: 'Frontend_Bundle_JS' } });
    check(resBundle, {
      'Frontend bundle JS status é 200': (r) => r.status === 200,
    });
  });

  sleep(0.5);

  // 2. Testes de API Backend (Flask + OpenTelemetry)
  group('2. Backend API & Tracing', function () {
    // 2.1 Health Check (Valida conectividade com PostgreSQL)
    const resHealth = http.get(`${API_URL}/api/health`, { tags: { name: 'API_Health' } });
    const isHealthOk = check(resHealth, {
      'API Health status é 200': (r) => r.status === 200,
      'API Health DB connected': (r) => r.body.includes('"database": "connected"'),
    });
    apiHealthDuration.add(resHealth.timings.duration);
    successRate.add(isHealthOk);

    // 2.2 Rota protegida sem token (Valida middleware de JWT)
    const resProdutos = http.get(`${API_URL}/api/produtos`, { tags: { name: 'API_Produtos_Auth_Check' } });
    check(resProdutos, {
      'API Produtos sem auth retorna 401': (r) => r.status === 401,
    });

    // 2.3 Tentativa de Login (Valida serviço de autenticação)
    const loginPayload = JSON.stringify({
      email: 'teste_k6@mercadinho.local',
      senha: 'senha_incorreta_teste',
    });
    const loginParams = {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'API_Login_Validation' },
    };
    const resLogin = http.post(`${API_URL}/api/login/auth`, loginPayload, loginParams);
    const isLoginHandled = check(resLogin, {
      'API Login rejeita credenciais com 400': (r) => r.status === 400,
    });
    apiLoginDuration.add(resLogin.timings.duration);
    successRate.add(isLoginHandled);
  });

  sleep(0.5);
}
