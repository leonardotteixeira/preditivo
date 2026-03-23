window.PREDITIVO_CONFIG = {
  API_BASE: window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://preditivo-backend-production.up.railway.app',
  APP_NAME: 'Futoro.',
  APP_DOMAIN: 'futoro.com.br',
  SUPPORT_EMAIL: 'suporte@futoro.com.br',
  // Chave PIX da plataforma para depósitos manuais (PIX Direto)
  PIX_KEY: '9bf0d836-a584-4436-8f45-61c650167cf3',
  PIX_KEY_TYPE: 'aleatoria',
  PIX_RECEIVER_NAME: 'Futoro Plataforma'
};
