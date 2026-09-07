import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Métricas personalizadas
const htmlDuration = new Trend('frontend_html_duration', true);
const assetsDuration = new Trend('frontend_assets_duration', true);
const successRate = new Rate('successful_requests');

export const options = {
  insecureSkipTLSVerify: true, // Permite certificados autoassinados/locais (*.henrique.local)
  stages: [
    { duration: '10s', target: 5 },   // Ramp-up para 5 usuários virtuais
    { duration: '20s', target: 20 },  // Carga constante de 20 usuários
    { duration: '10s', target: 0 },   // Ramp-down
  ],
  thresholds: {
    'http_req_failed': ['rate<0.05'],           // Menos de 5% de requisições com falha
    'frontend_html_duration': ['p(95)<300'],    // 95% das páginas carregam em menos de 300ms
    'frontend_assets_duration': ['p(95)<200'],  // 95% dos assets carregam em menos de 200ms
    'successful_requests': ['rate>0.95'],       // Taxa de sucesso maior que 95%
  },
};

const BASE_URL = __ENV.FRONTEND_URL || 'https://app.henrique.local';

export default function () {
  // 1. Carga do Documento HTML (SPA Root)
  group('1. Carga do Documento HTML', function () {
    const res = http.get(BASE_URL, { tags: { name: 'Frontend_HTML' } });
    const ok = check(res, {
      'status é 200': (r) => r.status === 200,
      'HTML contém elemento root do React': (r) => r.body.includes('id="root"') || r.body.includes('<div'),
      'Content-Type é text/html': (r) => r.headers['Content-Type'] && r.headers['Content-Type'].includes('text/html'),
    });
    htmlDuration.add(res.timings.duration);
    successRate.add(ok);
  });

  sleep(0.5);

  // 2. Verificação de Arquivos Estáticos e Configuração
  group('2. Arquivos Estáticos & Configuração', function () {
    const resConfig = http.get(`${BASE_URL}/config.js`, { tags: { name: 'Frontend_Config' } });
    const ok = check(resConfig, {
      'config.js status é válido (200 ou 404 tratado)': (r) => r.status === 200 || r.status === 404,
    });
    assetsDuration.add(resConfig.timings.duration);
    successRate.add(ok);
  });

  sleep(0.5);
}
