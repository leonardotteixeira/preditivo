/**
 * Corrige mojibake em preditivo/preditivo/index.html (byte 0x9D e "?" onde havia acentos).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, '..', 'preditivo', 'index.html');

let s = fs.readFileSync(filePath, 'latin1');

const pairs = [
  ['Opera\x9d?o realizada com ?xito.', 'Operação realizada com êxito.'],
  ['Portf\x9dlio', 'Portfólio'],
  ['? O futuro \x9d agora', '✨ O futuro é agora'],
  [
    'voc? acredita. Pol\x9dtica, esportes, economia e entretenimento com pagamentos instant\x9dneos via PIX.',
    'você acredita. Política, esportes, economia e entretenimento com pagamentos instantâneos via PIX.',
  ],
  ['Come\x9dar Agora ? R$100 Gr\x9dtis', 'Começar Agora — R$100 Grátis'],
  ['?? Em Alta', '🔥 Em Alta'],
  ['??? Pol\x9dtica', '🏛️ Política'],
  ['?? Economia', '📈 Economia'],
  ['? Esportes', '⚽ Esportes'],
  ['?? Tecnologia', '💡 Tecnologia'],
  ['Carregando sua pr\x9dxima previs?o...', 'Carregando sua próxima previsão...'],
  ['Portf\x9dlio Ativo', 'Portfólio Ativo'],
  ['posi\x9d?es em tempo real.', 'posições em tempo real.'],
  ['previs?es e lucros', 'previsões e lucros'],
  ['Calculando posi\x9d?es...', 'Calculando posições...'],
  ['Bem-vindo de volta ? Bubuya.', 'Bem-vindo de volta à Bubuya.'],
  ['Come\x9dar Agora', 'Começar Agora'],
  ['D? seu primeiro palpite com R$100 de b\x9dnus.', 'Dê seu primeiro palpite com R$100 de bônus.'],
  ['O saldo \x9d creditado instantaneamente.', 'O saldo é creditado instantaneamente.'],
  ['Transfer?ncia imediata', 'Transferência imediata'],
  ["window.showToast('?', 'Erro'", "window.showToast('❌', 'Erro'"],
  ["window.showToast('??', 'Ol\x9d!'", "window.showToast('👋', 'Olá!'"],
  ['Falha na conex?o com o servidor.', 'Falha na conexão com o servidor.'],
  ['`Ol\x9d, <span>', '`Olá, <span>'],
  [
    'Seu portf\x9dlio est\x9d esperando. Vamos lucrar hoje?',
    'Seu portfólio está esperando. Vamos lucrar hoje?',
  ],
  ['previs?es.', 'previsões.'],
  ['Voc? ainda n?o possui', 'Você ainda não possui'],
  ['Visualiza\x9d?o detalhada', 'Visualização detalhada'],
  ["window.showToast('??', 'Aten\x9d?o'", "window.showToast('⚠️', 'Atenção'"],
  ['Digite um valor v\x9dlido.', 'Digite um valor válido.'],
  ["'Voc? ser\x9d levado", "'Você será levado"],
  ['checkout n?o recebida.', 'checkout não recebida.'],
  ["window.showToast('??', 'MetaMask'", "window.showToast('🦊', 'MetaMask'"],
  ["window.showToast('??', 'Conectado'", "window.showToast('✅', 'Conectado'"],
  ["window.showToast('??', 'Redirecionando'", "window.showToast('↪', 'Redirecionando'"],
  ['Valor m\x9dnimo de R$1.', 'Valor mínimo de R$1.'],
  ['Seu saque est\x9d sendo enviado', 'Seu saque está sendo enviado'],
  ["window.showToast('???', 'Admin'", "window.showToast('🖼️', 'Admin'"],
  ['Bubuya ? Mercados de Previs?o', 'Bubuya — Mercados de Previsão'],
  ['mercados de previs\x9do.', 'mercados de previsão.'],
  ['Pol\x9dtica</a>', 'Política</a>'],
  ['Pol\x9dtica de privacidade', 'Política de privacidade'],
  ['Prote\x9d\x9do ao investidor', 'Proteção ao investidor'],
  ['A Bubuya \x9d uma plataforma', 'A Bubuya é uma plataforma'],
  ['previs\x9do.', 'previsão.'],
  ['N\x9do constitui recomenda\x9d\x9do', 'Não constitui recomendação'],
  ['<p>\x9d 2026 Bubuya \x9d Todos', '<p>© 2026 Bubuya · Todos'],
  ['A Bubuya e a principal', 'A Bubuya é a principal'],
  ['mercados de previsao.', 'mercados de previsão.'],
  ['SIM ou NAO e lucre', 'SIM ou NÃO e lucre'],
];

for (const [bad, good] of pairs) {
  if (!s.includes(bad)) {
    console.warn('SKIP (não encontrado):', JSON.stringify(bad.slice(0, 50)));
    continue;
  }
  s = s.split(bad).join(good);
}

fs.writeFileSync(filePath, s, 'utf8');
console.log('OK:', filePath);
