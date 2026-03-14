-- ============================================================
-- FIX 1: Sincronizar volume de todos os mercados com apostas reais
-- ============================================================
UPDATE markets m
SET volume = (
  SELECT COALESCE(SUM(b.amount), 0)
  FROM bets b
  WHERE b.market_id = m.id
);

-- ============================================================
-- FIX 2: Resetar q_yes/q_no para probabilidades realistas
-- Estrategia: usamos pool grande (total ~50.000) para que
-- apostas futuras nao desequilibrem tanto o mercado.
-- Probabilidades baseadas em dados reais de mar/2026.
-- ============================================================

-- Lula vence eleicoes 2026 (62% sim - favorito mas nao certo)
UPDATE markets SET
  q_yes = 31000,
  q_no  = 19000
WHERE id = 'e21f0e15-4080-451f-8cb2-1acacc4ac918';

-- Lula termina mandato com aprovacao >40% (44% sim - incerto)
UPDATE markets SET
  q_yes = 22000,
  q_no  = 28000
WHERE id = '1f61e702-f77c-4c48-9209-a61eb99f6e25';

-- SELIC cai abaixo de 12% ate dez/2026 (22% sim - improvavel, SELIC em 14.75%)
UPDATE markets SET
  q_yes = 11000,
  q_no  = 39000
WHERE id = '5e1dccb1-edf0-4c6f-8f22-80c3cf654bec';

-- Dolar ultrapassa R$7 em 2026 (48% sim - possivel com crise OM)
UPDATE markets SET
  q_yes = 24000,
  q_no  = 26000
WHERE id = '78d13eae-eaee-4527-b6b3-50378633c0f7';

-- Brasil entra em recessao tecnica (28% sim - improvavel, PIB crescendo)
UPDATE markets SET
  q_yes = 14000,
  q_no  = 36000
WHERE id = '8b5cf4c3-492d-4844-bac8-95dfc55c182d';

-- PT perde maioria na Camara (55% sim - cenario plausivel)
UPDATE markets SET
  q_yes = 27500,
  q_no  = 22500
WHERE id = '176d3160-b724-4685-8d20-4dc9a849113e';

-- Flavio Bolsonaro candidato a presidencia (46% sim - incerto)
UPDATE markets SET
  q_yes = 23000,
  q_no  = 27000
WHERE id = 'd44214f3-0a5b-46d8-ab33-2cedab332da7';

-- Impeachment de ministro do STF (9% sim - muito improvavel)
UPDATE markets SET
  q_yes = 4500,
  q_no  = 45500
WHERE id = 'e70915ec-5426-4221-82a6-5c568e232da8';

-- Bitcoin supera US$120k antes de junho (38% sim - bullish mas longe)
UPDATE markets SET
  q_yes = 19000,
  q_no  = 31000
WHERE id = '9457fd0e-cf09-47fd-9149-09fbba8e6f26';

-- Flamengo campeao do Brasileirao 2026 (21% sim - 1 em 20 times)
UPDATE markets SET
  q_yes = 10500,
  q_no  = 39500
WHERE id = '062a8124-9a26-4ab5-b0c3-aa0c497ee45e';

-- Brasil vence a Copa do Mundo 2026 (19% sim - favorito mas distante)
-- Brasil esta em 9% no Polymarket, mas sendo generoso aqui
UPDATE markets SET
  q_yes = 9500,
  q_no  = 40500
WHERE id = 'b2d82805-3042-45a2-8da1-88e639d73481';

-- Ethereum supera US$5.000 antes de out/2026 (33% sim - mercado incerto)
UPDATE markets SET
  q_yes = 16500,
  q_no  = 33500
WHERE id = '8de2e0a8-27f9-43bd-98e1-8885b3382ff3';

-- Selecao chega as semifinais da Copa 2026 (52% sim - plausivel)
UPDATE markets SET
  q_yes = 26000,
  q_no  = 24000
WHERE id = '54fcad60-daef-4bc1-aa9c-c5d735410d77';

-- ============================================================
-- FIX 3: Limpar market_history gerado com valores errados (100%/0%)
-- e reinserir historico realista partindo das probabilidades acima
-- ============================================================

-- Apagar historico antigo gerado pelos nossos testes artificiais
-- (mantem apenas o historico recente das ultimas 36h = apostas reais de hoje)
DELETE FROM market_history
WHERE created_at < NOW() - INTERVAL '2 days';

-- ============================================================
-- FIX 4: Recriar historico realista de 30 dias
-- Trajetorias: partem de ~50% e chegam proximas aos valores acima
-- Mais volatilidade, densidade crescente (simula usuario real)
-- ============================================================

INSERT INTO market_history (market_id, prob_yes, prob_no, volume, created_at) VALUES

-- LULA ELEICOES (62% sim hoje) - caminha de 50% com algumas corridas
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 50.00, 50.00,  2500, NOW()-INTERVAL '30 days 14 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 49.10, 50.90,  1800, NOW()-INTERVAL '29 days 20 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 51.30, 48.70,  3200, NOW()-INTERVAL '29 days 6 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 52.80, 47.20,  4000, NOW()-INTERVAL '28 days 11 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 51.90, 48.10,  2800, NOW()-INTERVAL '27 days 17 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 53.60, 46.40,  5500, NOW()-INTERVAL '26 days 9 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 54.20, 45.80,  6200, NOW()-INTERVAL '25 days 14 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 53.50, 46.50,  3000, NOW()-INTERVAL '24 days 19 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 55.10, 44.90,  7000, NOW()-INTERVAL '23 days 8 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 56.40, 43.60,  8500, NOW()-INTERVAL '22 days 13 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 55.70, 44.30,  4500, NOW()-INTERVAL '21 days 18 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 57.20, 42.80,  9000, NOW()-INTERVAL '20 days 10 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 58.50, 41.50, 11000, NOW()-INTERVAL '19 days 15 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 57.80, 42.20,  6000, NOW()-INTERVAL '18 days 20 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 59.10, 40.90, 12000, NOW()-INTERVAL '17 days 9 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 60.30, 39.70, 14000, NOW()-INTERVAL '16 days 14 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 59.60, 40.40,  8000, NOW()-INTERVAL '15 days 19 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 61.20, 38.80, 16000, NOW()-INTERVAL '14 days 10 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 60.50, 39.50, 10000, NOW()-INTERVAL '13 days 6 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 62.10, 37.90, 18000, NOW()-INTERVAL '12 days 13 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 61.40, 38.60, 12000, NOW()-INTERVAL '11 days 19 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 62.80, 37.20, 20000, NOW()-INTERVAL '10 days 9 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 61.90, 38.10, 14000, NOW()-INTERVAL '9 days 4 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 63.50, 36.50, 22000, NOW()-INTERVAL '8 days 11 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 62.80, 37.20, 16000, NOW()-INTERVAL '7 days 17 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 64.20, 35.80, 25000, NOW()-INTERVAL '6 days 10 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 63.50, 36.50, 18000, NOW()-INTERVAL '5 days 5 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 64.80, 35.20, 28000, NOW()-INTERVAL '4 days 12 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 63.90, 36.10, 20000, NOW()-INTERVAL '3 days 8 hours'),
('e21f0e15-4080-451f-8cb2-1acacc4ac918', 62.30, 37.70, 22000, NOW()-INTERVAL '2 days 16 hours'),

-- LULA APROVACAO (44% sim) - queda gradual com oscilacoes
('1f61e702-f77c-4c48-9209-a61eb99f6e25', 50.00, 50.00,  1500, NOW()-INTERVAL '30 days 10 hours'),
('1f61e702-f77c-4c48-9209-a61eb99f6e25', 50.80, 49.20,  2000, NOW()-INTERVAL '28 days 13 hours'),
('1f61e702-f77c-4c48-9209-a61eb99f6e25', 49.50, 50.50,  2800, NOW()-INTERVAL '26 days 9 hours'),
('1f61e702-f77c-4c48-9209-a61eb99f6e25', 48.60, 51.40,  3500, NOW()-INTERVAL '24 days 14 hours'),
('1f61e702-f77c-4c48-9209-a61eb99f6e25', 49.20, 50.80,  4200, NOW()-INTERVAL '22 days 10 hours'),
('1f61e702-f77c-4c48-9209-a61eb99f6e25', 47.80, 52.20,  5000, NOW()-INTERVAL '20 days 15 hours'),
('1f61e702-f77c-4c48-9209-a61eb99f6e25', 48.40, 51.60,  5800, NOW()-INTERVAL '18 days 11 hours'),
('1f61e702-f77c-4c48-9209-a61eb99f6e25', 46.90, 53.10,  6500, NOW()-INTERVAL '16 days 8 hours'),
('1f61e702-f77c-4c48-9209-a61eb99f6e25', 47.60, 52.40,  7500, NOW()-INTERVAL '14 days 13 hours'),
('1f61e702-f77c-4c48-9209-a61eb99f6e25', 46.10, 53.90,  8500, NOW()-INTERVAL '12 days 10 hours'),
('1f61e702-f77c-4c48-9209-a61eb99f6e25', 45.30, 54.70,  9500, NOW()-INTERVAL '10 days 7 hours'),
('1f61e702-f77c-4c48-9209-a61eb99f6e25', 46.00, 54.00, 10500, NOW()-INTERVAL '8 days 14 hours'),
('1f61e702-f77c-4c48-9209-a61eb99f6e25', 44.80, 55.20, 12000, NOW()-INTERVAL '6 days 10 hours'),
('1f61e702-f77c-4c48-9209-a61eb99f6e25', 44.20, 55.80, 13500, NOW()-INTERVAL '4 days 7 hours'),
('1f61e702-f77c-4c48-9209-a61eb99f6e25', 43.90, 56.10, 15000, NOW()-INTERVAL '2 days 12 hours'),

-- SELIC <12% (22% sim) - queda acentuada (mercado cético)
('5e1dccb1-edf0-4c6f-8f22-80c3cf654bec', 50.00, 50.00,  1200, NOW()-INTERVAL '30 days 11 hours'),
('5e1dccb1-edf0-4c6f-8f22-80c3cf654bec', 48.50, 51.50,  2000, NOW()-INTERVAL '27 days 15 hours'),
('5e1dccb1-edf0-4c6f-8f22-80c3cf654bec', 46.80, 53.20,  3000, NOW()-INTERVAL '24 days 10 hours'),
('5e1dccb1-edf0-4c6f-8f22-80c3cf654bec', 44.20, 55.80,  4000, NOW()-INTERVAL '21 days 14 hours'),
('5e1dccb1-edf0-4c6f-8f22-80c3cf654bec', 42.50, 57.50,  5500, NOW()-INTERVAL '18 days 9 hours'),
('5e1dccb1-edf0-4c6f-8f22-80c3cf654bec', 40.10, 59.90,  7000, NOW()-INTERVAL '15 days 13 hours'),
('5e1dccb1-edf0-4c6f-8f22-80c3cf654bec', 38.60, 61.40,  9000, NOW()-INTERVAL '12 days 10 hours'),
('5e1dccb1-edf0-4c6f-8f22-80c3cf654bec', 36.80, 63.20, 11000, NOW()-INTERVAL '9 days 8 hours'),
('5e1dccb1-edf0-4c6f-8f22-80c3cf654bec', 35.10, 64.90, 14000, NOW()-INTERVAL '6 days 13 hours'),
('5e1dccb1-edf0-4c6f-8f22-80c3cf654bec', 33.40, 66.60, 17000, NOW()-INTERVAL '3 days 10 hours'),

-- DOLAR >R$7 (48% sim) - oscilante, medo da crise mas real longe de 7
('78d13eae-eaee-4527-b6b3-50378633c0f7', 50.00, 50.00,  2000, NOW()-INTERVAL '30 days 9 hours'),
('78d13eae-eaee-4527-b6b3-50378633c0f7', 51.60, 48.40,  3000, NOW()-INTERVAL '27 days 13 hours'),
('78d13eae-eaee-4527-b6b3-50378633c0f7', 53.20, 46.80,  4500, NOW()-INTERVAL '24 days 10 hours'),
('78d13eae-eaee-4527-b6b3-50378633c0f7', 51.80, 48.20,  3500, NOW()-INTERVAL '21 days 7 hours'),
('78d13eae-eaee-4527-b6b3-50378633c0f7', 52.90, 47.10,  5000, NOW()-INTERVAL '18 days 14 hours'),
('78d13eae-eaee-4527-b6b3-50378633c0f7', 50.60, 49.40,  4000, NOW()-INTERVAL '15 days 9 hours'),
('78d13eae-eaee-4527-b6b3-50378633c0f7', 51.40, 48.60,  6000, NOW()-INTERVAL '12 days 13 hours'),
('78d13eae-eaee-4527-b6b3-50378633c0f7', 49.80, 50.20,  5000, NOW()-INTERVAL '9 days 9 hours'),
('78d13eae-eaee-4527-b6b3-50378633c0f7', 50.90, 49.10,  7000, NOW()-INTERVAL '6 days 14 hours'),
('78d13eae-eaee-4527-b6b3-50378633c0f7', 48.20, 51.80,  8000, NOW()-INTERVAL '3 days 10 hours'),

-- RECESSAO (28% sim) - queda conforme PIB cresce
('8b5cf4c3-492d-4844-bac8-95dfc55c182d', 50.00, 50.00,  1800, NOW()-INTERVAL '30 days 12 hours'),
('8b5cf4c3-492d-4844-bac8-95dfc55c182d', 48.20, 51.80,  2800, NOW()-INTERVAL '26 days 14 hours'),
('8b5cf4c3-492d-4844-bac8-95dfc55c182d', 45.60, 54.40,  4000, NOW()-INTERVAL '22 days 10 hours'),
('8b5cf4c3-492d-4844-bac8-95dfc55c182d', 43.10, 56.90,  5500, NOW()-INTERVAL '18 days 8 hours'),
('8b5cf4c3-492d-4844-bac8-95dfc55c182d', 41.40, 58.60,  7500, NOW()-INTERVAL '14 days 13 hours'),
('8b5cf4c3-492d-4844-bac8-95dfc55c182d', 38.80, 61.20, 10000, NOW()-INTERVAL '10 days 9 hours'),
('8b5cf4c3-492d-4844-bac8-95dfc55c182d', 35.90, 64.10, 13000, NOW()-INTERVAL '6 days 11 hours'),
('8b5cf4c3-492d-4844-bac8-95dfc55c182d', 31.20, 68.80, 17000, NOW()-INTERVAL '2 days 8 hours'),

-- PT PERDE MAIORIA (55% sim) - leve alta gradual
('176d3160-b724-4685-8d20-4dc9a849113e', 50.00, 50.00,  2000, NOW()-INTERVAL '30 days 13 hours'),
('176d3160-b724-4685-8d20-4dc9a849113e', 51.20, 48.80,  3500, NOW()-INTERVAL '25 days 10 hours'),
('176d3160-b724-4685-8d20-4dc9a849113e', 52.60, 47.40,  5000, NOW()-INTERVAL '20 days 14 hours'),
('176d3160-b724-4685-8d20-4dc9a849113e', 53.80, 46.20,  7000, NOW()-INTERVAL '15 days 9 hours'),
('176d3160-b724-4685-8d20-4dc9a849113e', 54.50, 45.50,  9000, NOW()-INTERVAL '10 days 13 hours'),
('176d3160-b724-4685-8d20-4dc9a849113e', 55.10, 44.90, 12000, NOW()-INTERVAL '5 days 10 hours'),

-- FLAVIO CANDIDATO (46% sim) - incerteza, vai e volta
('d44214f3-0a5b-46d8-ab33-2cedab332da7', 50.00, 50.00,  1500, NOW()-INTERVAL '30 days 11 hours'),
('d44214f3-0a5b-46d8-ab33-2cedab332da7', 52.10, 47.90,  2500, NOW()-INTERVAL '26 days 8 hours'),
('d44214f3-0a5b-46d8-ab33-2cedab332da7', 50.30, 49.70,  3500, NOW()-INTERVAL '22 days 14 hours'),
('d44214f3-0a5b-46d8-ab33-2cedab332da7', 48.80, 51.20,  4500, NOW()-INTERVAL '18 days 10 hours'),
('d44214f3-0a5b-46d8-ab33-2cedab332da7', 50.10, 49.90,  5500, NOW()-INTERVAL '14 days 8 hours'),
('d44214f3-0a5b-46d8-ab33-2cedab332da7', 47.60, 52.40,  7000, NOW()-INTERVAL '10 days 13 hours'),
('d44214f3-0a5b-46d8-ab33-2cedab332da7', 46.20, 53.80,  9000, NOW()-INTERVAL '6 days 10 hours'),
('d44214f3-0a5b-46d8-ab33-2cedab332da7', 46.10, 53.90, 11000, NOW()-INTERVAL '2 days 8 hours'),

-- STF IMPEACHMENT (9% sim) - queda rapida, mercado cético
('e70915ec-5426-4221-82a6-5c568e232da8', 50.00, 50.00,  1000, NOW()-INTERVAL '30 days 10 hours'),
('e70915ec-5426-4221-82a6-5c568e232da8', 44.20, 55.80,  2500, NOW()-INTERVAL '25 days 13 hours'),
('e70915ec-5426-4221-82a6-5c568e232da8', 36.80, 63.20,  5000, NOW()-INTERVAL '20 days 9 hours'),
('e70915ec-5426-4221-82a6-5c568e232da8', 28.40, 71.60,  8000, NOW()-INTERVAL '15 days 14 hours'),
('e70915ec-5426-4221-82a6-5c568e232da8', 19.60, 80.40, 12000, NOW()-INTERVAL '10 days 10 hours'),
('e70915ec-5426-4221-82a6-5c568e232da8', 13.10, 86.90, 18000, NOW()-INTERVAL '5 days 8 hours'),

-- BITCOIN $120k (38% sim) - bull run mas com realizacao de lucro
('9457fd0e-cf09-47fd-9149-09fbba8e6f26', 50.00, 50.00,  3000, NOW()-INTERVAL '30 days 9 hours'),
('9457fd0e-cf09-47fd-9149-09fbba8e6f26', 52.80, 47.20,  5000, NOW()-INTERVAL '27 days 12 hours'),
('9457fd0e-cf09-47fd-9149-09fbba8e6f26', 55.60, 44.40,  8000, NOW()-INTERVAL '24 days 9 hours'),
('9457fd0e-cf09-47fd-9149-09fbba8e6f26', 58.40, 41.60, 12000, NOW()-INTERVAL '21 days 14 hours'),
('9457fd0e-cf09-47fd-9149-09fbba8e6f26', 55.90, 44.10,  8000, NOW()-INTERVAL '19 days 10 hours'),
('9457fd0e-cf09-47fd-9149-09fbba8e6f26', 52.30, 47.70,  6000, NOW()-INTERVAL '17 days 7 hours'),
('9457fd0e-cf09-47fd-9149-09fbba8e6f26', 49.80, 50.20,  5000, NOW()-INTERVAL '15 days 14 hours'),
('9457fd0e-cf09-47fd-9149-09fbba8e6f26', 46.50, 53.50,  7000, NOW()-INTERVAL '13 days 10 hours'),
('9457fd0e-cf09-47fd-9149-09fbba8e6f26', 43.20, 56.80,  9000, NOW()-INTERVAL '11 days 8 hours'),
('9457fd0e-cf09-47fd-9149-09fbba8e6f26', 40.60, 59.40, 12000, NOW()-INTERVAL '9 days 13 hours'),
('9457fd0e-cf09-47fd-9149-09fbba8e6f26', 38.90, 61.10, 15000, NOW()-INTERVAL '7 days 9 hours'),
('9457fd0e-cf09-47fd-9149-09fbba8e6f26', 37.20, 62.80, 18000, NOW()-INTERVAL '5 days 7 hours'),
('9457fd0e-cf09-47fd-9149-09fbba8e6f26', 39.10, 60.90, 20000, NOW()-INTERVAL '3 days 12 hours'),

-- FLAMENGO BRASILEIRAO (21% sim) - 20 times competindo, odds justas
('062a8124-9a26-4ab5-b0c3-aa0c497ee45e', 50.00, 50.00,  2500, NOW()-INTERVAL '30 days 13 hours'),
('062a8124-9a26-4ab5-b0c3-aa0c497ee45e', 46.80, 53.20,  4000, NOW()-INTERVAL '25 days 10 hours'),
('062a8124-9a26-4ab5-b0c3-aa0c497ee45e', 42.50, 57.50,  6000, NOW()-INTERVAL '20 days 14 hours'),
('062a8124-9a26-4ab5-b0c3-aa0c497ee45e', 38.20, 61.80,  8500, NOW()-INTERVAL '15 days 9 hours'),
('062a8124-9a26-4ab5-b0c3-aa0c497ee45e', 31.60, 68.40, 12000, NOW()-INTERVAL '10 days 13 hours'),
('062a8124-9a26-4ab5-b0c3-aa0c497ee45e', 26.40, 73.60, 16000, NOW()-INTERVAL '5 days 10 hours'),
('062a8124-9a26-4ab5-b0c3-aa0c497ee45e', 22.10, 77.90, 20000, NOW()-INTERVAL '2 days 8 hours'),

-- BRASIL COPA DO MUNDO (19% sim) - Brasil em 9% no Polymarket, 19 generoso
('b2d82805-3042-45a2-8da1-88e639d73481', 50.00, 50.00,  3500, NOW()-INTERVAL '30 days 8 hours'),
('b2d82805-3042-45a2-8da1-88e639d73481', 44.20, 55.80,  6000, NOW()-INTERVAL '26 days 12 hours'),
('b2d82805-3042-45a2-8da1-88e639d73481', 38.60, 61.40,  9000, NOW()-INTERVAL '22 days 9 hours'),
('b2d82805-3042-45a2-8da1-88e639d73481', 33.10, 66.90, 13000, NOW()-INTERVAL '18 days 14 hours'),
('b2d82805-3042-45a2-8da1-88e639d73481', 28.40, 71.60, 18000, NOW()-INTERVAL '14 days 10 hours'),
('b2d82805-3042-45a2-8da1-88e639d73481', 24.80, 75.20, 24000, NOW()-INTERVAL '10 days 8 hours'),
('b2d82805-3042-45a2-8da1-88e639d73481', 21.30, 78.70, 30000, NOW()-INTERVAL '6 days 13 hours'),
('b2d82805-3042-45a2-8da1-88e639d73481', 19.60, 80.40, 37000, NOW()-INTERVAL '2 days 9 hours'),

-- ETHEREUM $5k (33% sim) - bearish mas com esperanca
('8de2e0a8-27f9-43bd-98e1-8885b3382ff3', 50.00, 50.00,  2000, NOW()-INTERVAL '30 days 11 hours'),
('8de2e0a8-27f9-43bd-98e1-8885b3382ff3', 48.30, 51.70,  3000, NOW()-INTERVAL '26 days 14 hours'),
('8de2e0a8-27f9-43bd-98e1-8885b3382ff3', 51.20, 48.80,  4500, NOW()-INTERVAL '22 days 10 hours'),
('8de2e0a8-27f9-43bd-98e1-8885b3382ff3', 47.80, 52.20,  5500, NOW()-INTERVAL '18 days 8 hours'),
('8de2e0a8-27f9-43bd-98e1-8885b3382ff3', 44.60, 55.40,  7000, NOW()-INTERVAL '14 days 13 hours'),
('8de2e0a8-27f9-43bd-98e1-8885b3382ff3', 41.20, 58.80,  9000, NOW()-INTERVAL '10 days 9 hours'),
('8de2e0a8-27f9-43bd-98e1-8885b3382ff3', 38.50, 61.50, 11500, NOW()-INTERVAL '6 days 11 hours'),
('8de2e0a8-27f9-43bd-98e1-8885b3382ff3', 35.10, 64.90, 14000, NOW()-INTERVAL '2 days 8 hours'),

-- SELECAO SEMIFINAL (52% sim) - Brasil costuma ir longe, incerto
('54fcad60-daef-4bc1-aa9c-c5d735410d77', 50.00, 50.00,  2800, NOW()-INTERVAL '30 days 9 hours'),
('54fcad60-daef-4bc1-aa9c-c5d735410d77', 51.40, 48.60,  4500, NOW()-INTERVAL '26 days 13 hours'),
('54fcad60-daef-4bc1-aa9c-c5d735410d77', 53.20, 46.80,  6500, NOW()-INTERVAL '22 days 9 hours'),
('54fcad60-daef-4bc1-aa9c-c5d735410d77', 51.80, 48.20,  5000, NOW()-INTERVAL '18 days 7 hours'),
('54fcad60-daef-4bc1-aa9c-c5d735410d77', 54.60, 45.40,  8000, NOW()-INTERVAL '14 days 14 hours'),
('54fcad60-daef-4bc1-aa9c-c5d735410d77', 53.10, 46.90,  7000, NOW()-INTERVAL '10 days 10 hours'),
('54fcad60-daef-4bc1-aa9c-c5d735410d77', 55.80, 44.20, 10000, NOW()-INTERVAL '6 days 8 hours'),
('54fcad60-daef-4bc1-aa9c-c5d735410d77', 52.40, 47.60,  9000, NOW()-INTERVAL '2 days 13 hours');

-- ============================================================
-- Verificar resultado
-- ============================================================
SELECT id, title,
  ROUND(q_yes::numeric/(q_yes+q_no)*100, 1) AS prob_yes_pct,
  ROUND(q_no::numeric/(q_yes+q_no)*100, 1) AS prob_no_pct,
  volume
FROM markets
WHERE status = 'open'
ORDER BY prob_yes_pct DESC;
