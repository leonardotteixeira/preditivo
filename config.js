window.PREDITIVO_CONFIG = {
  API_BASE: window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://preditivo-backend-production.up.railway.app',
  APP_NAME: 'Bubuya.',
  APP_DOMAIN: 'bubuya.com.br',
  SUPPORT_EMAIL: 'suporte@bubuya.com.br',
  // Chave PIX da plataforma para depósitos manuais (PIX Direto)
  PIX_KEY: 'COLE_A_CHAVE_PIX_AQUI',
  PIX_KEY_TYPE: 'aleatoria', // cpf | cnpj | email | telefone | aleatoria
  PIX_RECEIVER_NAME: 'Bubuya Plataforma'
};
