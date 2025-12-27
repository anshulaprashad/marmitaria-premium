const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// Serve arquivos estáticos (seu HTML, CSS, JS)
app.use(express.static('public'));

// ✅ Cardápios da semana com imagens que EXISTEM no seu repositório
const cardapios = {
  'segunda-feira': { 
    img: 'marmita20.png',
    titulo: 'SEGUNDA: Frango Grelhado Especial 🍗',
    descricao: 'HOJE TEM FRANGO GRELHADO! 🍗 Arroz + Feijão + Frango Suculento + Salada Fresca + Farofa Crocante - R$ 21,90'
  },
  'terça-feira': { 
    img: 'marmita21.png',
    titulo: 'TERÇA: Carne de Panela Desfiada 🥩',
    descricao: 'HOJE TEM CARNE DE PANELA! 🥩 Arroz + Feijão + Carne Macia Desfiada + Salada + Farofa - R$ 21,90'
  },
  'quarta-feira': { 
    img: 'marmita25.png',
    titulo: 'QUARTA: Moqueca de Frango Cremosa 🍲',
    descricao: 'HOJE TEM MOQUECA DE FRANGO! 🍲 Arroz + Feijão + Moqueca Cremosa + Salada + Farofa - R$ 21,90'
  },
  'quinta-feira': { 
    img: 'marmita24.png',
    titulo: 'QUINTA: Bife à Milanesa Crocante 🥩',
    descricao: 'HOJE TEM BIFE À MILANESA! 🥩 Arroz + Feijão + Milanesa Crocante + Salada + Farofa - R$ 21,90'
  },
  'sexta-feira': { 
    img: 'marmita20.png',
    titulo: 'SEXTA: Lasanha de Carne Mussarela 🍝',
    descricao: 'HOJE TEM LASANHA ESPECIAL! 🍝 Arroz + Feijão + Lasanha Recheada + Salada + Farofa - R$ 21,90'
  },
  'sábado': { 
    img: 'feijoadasabado.jpg',  // ⭐⭐ CORRIGIDO: feijoadasabado.jpg para sábado
    titulo: 'SÁBADO: Opção Normal OU Feijoada 🍲',
    descricao: 'SÁBADO COM DUPLA OPÇÃO! 🍱 Escolha entre Marmitex Normal ou Feijoada Completa com Torresmo - R$ 21,90'
  },
  'domingo': { 
    img: 'logorei.jpg',
    titulo: 'DOMINGO: Volte Amanhã! 🎉',
    descricao: 'HOJE É DOMINGO! 🎉 ESTAMOS FECHADOS. VOLTE SEGUNDA-FEIRA PELO CARDÁPIO ESPECIAL!'
  }
};

// URL base para imagens (SUAS imagens reais)
const IMAGE_BASE = 'https://anshulaprashad.github.io/marmitex/';

// ⚡ Rota PRINCIPAL - WhatsApp lê ESTA rota!
app.get('/', (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const hoje = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', weekday: 'long' }).toLowerCase();
  const cardapio = cardapios[hoje] || cardapios['segunda-feira'];
  const imageUrl = `${IMAGE_BASE}${cardapio.img}`;

  console.log('='.repeat(50));
  console.log(`📅 Data: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
  console.log(`📅 Dia da semana: ${hoje}`);
  console.log(`🤖 User Agent: ${userAgent.substring(0, 80)}...`);
  console.log(`🖼️ Imagem do dia: ${cardapio.img}`);
  console.log(`🔗 URL da imagem: ${imageUrl}`);
  console.log(`📝 Título: ${cardapio.titulo}`);

  // Detecta WhatsApp/Telegram/Facebook/Twitter
  const isBot = /WhatsApp|TelegramBot|facebookexternalhit|Twitterbot|LinkedInBot|Discordbot|Slackbot/i.test(userAgent);

  if (isBot) {
    console.log('🎯 BOT DETECTADO! Enviando HTML com meta tags dinâmicas...');
    
    const htmlPreview = `
<!DOCTYPE html>
<html prefix="og: https://ogp.me/ns#" lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>👑 ${cardapio.titulo} - O REI DA MARMITEX</title>
    <meta name="description" content="${cardapio.descricao}">
    
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://marmitaria-premium.onrender.com/">
    <meta property="og:title" content="👑 ${cardapio.titulo} - O REI DA MARMITEX">
    <meta property="og:description" content="${cardapio.descricao}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:secure_url" content="${imageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${cardapio.titulo}">
    <meta property="og:site_name" content="O REI DA MARMITEX">
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="👑 ${cardapio.titulo} - O REI DA MARMITEX">
    <meta name="twitter:description" content="${cardapio.descricao}">
    <meta name="twitter:image" content="${imageUrl}">
    
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #1a0f0a 0%, #2c1c10 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .container {
            max-width: 800px;
            text-align: center;
        }
        img {
            max-width: 100%;
            height: auto;
            border-radius: 15px;
            border: 4px solid #FFD700;
            margin: 20px 0;
        }
        h1 { color: #FFD700; font-size: 2rem; }
        p { font-size: 1.2rem; line-height: 1.6; }
        .emoji { font-size: 3rem; }
    </style>
</head>
<body>
    <div class="container">
        <div class="emoji">🍱</div>
        <h1>👑 O REI DA MARMITEX</h1>
        <h2>${cardapio.titulo}</h2>
        <p>${cardapio.descricao}</p>
        <img src="${imageUrl}" alt="${cardapio.titulo}">
        <p>📞 <strong>WhatsApp:</strong> (11) 99999-9999</p>
        <p>⏰ <strong>Horário:</strong> Segunda a Sábado, 11h às 21h</p>
        <p>📍 <strong>Entregamos em toda região!</strong></p>
    </div>
    
    <script>
        // WhatsApp NÃO executa JavaScript, então usuários normais são redirecionados
        setTimeout(() => {
            window.location.href = '/landing';
        }, 50);
    </script>
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.send(htmlPreview);
    
  } else {
    console.log('👤 Usuário normal detectado, redirecionando para /landing');
    res.redirect(302, '/landing');
  }
});

// Rota da LANDING PAGE real (seu HTML completo)
app.get('/landing', (req, res) => {
  console.log('🌐 Servindo landing page completa...');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para testar preview de qualquer dia
app.get('/test/:dia', (req, res) => {
  const dia = req.params.dia;
  const diasValidos = ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado', 'domingo'];
  const diaTeste = diasValidos.includes(dia) ? dia : 'segunda-feira';
  const cardapio = cardapios[diaTeste];
  const imageUrl = `${IMAGE_BASE}${cardapio.img}`;
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta property="og:image" content="${imageUrl}">
        <meta property="og:title" content="TESTE: ${cardapio.titulo}">
        <meta property="og:description" content="${cardapio.descricao}">
        <meta property="og:url" content="https://marmitaria-premium.onrender.com/">
        <style>
            body {
                font-family: Arial, sans-serif;
                padding: 20px;
                background: #1a0f0a;
                color: white;
                max-width: 800px;
                margin: 0 auto;
            }
            h1 { color: #FFD700; }
            img { 
                max-width: 100%; 
                border-radius: 15px;
                border: 4px solid #FFD700;
                margin: 20px 0;
            }
            .test-link {
                display: inline-block;
                background: #25D366;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                text-decoration: none;
                margin-top: 20px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <h1>🧪 Teste de Preview: ${diaTeste}</h1>
        <img src="${imageUrl}" alt="${cardapio.titulo}">
        <h2>${cardapio.titulo}</h2>
        <p>${cardapio.descricao}</p>
        <hr>
        <p><strong>URL da imagem:</strong> ${imageUrl}</p>
        <p><strong>Teste no WhatsApp:</strong></p>
        <a class="test-link" href="https://api.whatsapp.com/send?text=${encodeURIComponent(`🍱 Confira o cardápio de ${diaTeste}: ${cardapio.titulo} - https://marmitaria-premium.onrender.com/`)}" target="_blank">
            📱 Testar no WhatsApp
        </a>
    </body>
    </html>
  `);
});

// Rota para verificar se a imagem de sábado existe
app.get('/verificar-imagem-sabado', (req, res) => {
  const imageUrl = 'https://anshulaprashad.github.io/marmitex/feijoadasabado.jpg';
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Verificação da Imagem de Sábado</title>
        <style>
            body { font-family: Arial; padding: 20px; }
            .success { color: green; font-weight: bold; }
            .error { color: red; font-weight: bold; }
            img { max-width: 100%; border: 2px solid #ccc; }
        </style>
    </head>
    <body>
        <h1>Verificando imagem de sábado</h1>
        <p><strong>URL:</strong> ${imageUrl}</p>
        <img src="${imageUrl}" alt="Imagem de feijoada" onload="document.getElementById('status').className='success'; document.getElementById('status').innerText='✅ IMAGEM CARREGADA COM SUCESSO!'" onerror="document.getElementById('status').className='error'; document.getElementById('status').innerText='❌ ERRO AO CARREGAR IMAGEM!'">
        <p id="status">Carregando imagem...</p>
        <p>Se mostrar erro, a imagem não existe no repositório.</p>
        <p>Se mostrar sucesso, está tudo certo para o deploy.</p>
    </body>
    </html>
  `);
});

// Health check com informações do dia
app.get('/health', (req, res) => {
  const hoje = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', weekday: 'long' }).toLowerCase();
  const cardapio = cardapios[hoje] || cardapios['segunda-feira'];
  
  res.json({ 
    status: 'online', 
    service: 'Rei da Marmitex',
    dia_atual: hoje,
    cardapio_hoje: cardapio.titulo,
    imagem_hoje: cardapio.img,
    imagem_url_completa: `${IMAGE_BASE}${cardapio.img}`,
    timestamp: new Date().toISOString(),
    timezone: 'America/Sao_Paulo'
  });
});

// Inicia servidor
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('👑 O REI DA MARMITEX - Preview Dinâmico WhatsApp');
  console.log(`🚀 Servidor rodando na porta: ${PORT}`);
  console.log(`🔗 URL Principal: https://marmitaria-premium.onrender.com/`);
  console.log(`🔗 Landing Page: https://marmitaria-premium.onrender.com/landing`);
  console.log('');
  console.log('📅 URLs de Teste:');
  console.log(`🧪 Segunda: https://marmitaria-premium.onrender.com/test/segunda-feira`);
  console.log(`🧪 Terça: https://marmitaria-premium.onrender.com/test/terça-feira`);
  console.log(`🧪 Sábado: https://marmitaria-premium.onrender.com/test/sábado`);
  console.log(`🖼️ Verificar imagem sábado: https://marmitaria-premium.onrender.com/verificar-imagem-sabado`);
  console.log(`💚 Health Check: https://marmitaria-premium.onrender.com/health`);
  console.log('='.repeat(60));
  console.log('');
  console.log('📅 IMAGENS CONFIGURADAS:');
  console.log(`🖼️ Segunda: ${IMAGE_BASE}marmita20.png`);
  console.log(`🖼️ Terça: ${IMAGE_BASE}marmita21.png`);
  console.log(`🖼️ Quarta: ${IMAGE_BASE}marmita25.png`);
  console.log(`🖼️ Quinta: ${IMAGE_BASE}marmita24.png`);
  console.log(`🖼️ Sexta: ${IMAGE_BASE}marmita20.png`);
  console.log(`🖼️ Sábado: ${IMAGE_BASE}feijoadasabado.jpg ⭐ NOVO!`);
  console.log(`🖼️ Domingo: ${IMAGE_BASE}logorei.jpg`);
  console.log('');
});
