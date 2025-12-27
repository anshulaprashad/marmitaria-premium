const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// Serve arquivos estáticos (seu HTML, CSS, JS)
app.use(express.static('public'));

// Cardápios da semana com imagens CORRETAS
const cardapios = {
  'segunda-feira': { 
    img: 'marmita20.png',
    titulo: 'SEGUNDA: Frango Grelhado Especial',
    descricao: 'HOJE TEM FRANGO GRELHADO! 🍗 Arroz + Feijão + Salada + Farofa - R$ 21,90'
  },
  'terça-feira': { 
    img: 'marmita21.png', 
    titulo: 'TERÇA: Carne de Panela Desfiada',
    descricao: 'HOJE TEM CARNE DE PANELA! 🥩 Arroz + Feijão + Salada + Farofa - R$ 21,90'
  },
  'quarta-feira': { 
    img: 'marmita25.png', 
    titulo: 'QUARTA: Moqueca de Frango Cremosa',
    descricao: 'HOJE TEM MOQUECA DE FRANGO! 🐔 Arroz + Feijão + Salada + Farofa - R$ 21,90'
  },
  'quinta-feira': { 
    img: 'marmita24.png', 
    titulo: 'QUINTA: Bife à Milanesa Crocante',
    descricao: 'HOJE TEM BIFE À MILANESA! 🥩 Arroz + Feijão + Salada + Farofa - R$ 21,90'
  },
  'sexta-feira': { 
    img: 'feijoadasabado.jpg',  // ⭐ SEXTA usa feijoadasabado.jpg
    titulo: 'SEXTA: Lasanha de Carne Mussarela',
    descricao: 'HOJE TEM LASANHA ESPECIAL! 🍝 Arroz + Feijão + Salada + Farofa - R$ 21,90'
  },
  'sábado': { 
    img: 'marmitex2.jpg', 
    titulo: 'SÁBADO: Opção Normal OU Feijoada',
    descricao: 'SÁBADO COM DUPLA OPÇÃO! 🍱 Escolha entre Marmitex Normal ou Feijoada Completa - R$ 21,90'
  },
  'domingo': { 
    img: 'logorei.jpg', 
    titulo: 'DOMINGO: Volte Amanhã!',
    descricao: 'HOJE É DOMINGO! 🎉 VOLTE SEGUNDA PELO CARDÁPIO ESPECIAL!'
  }
};

// URL base para imagens
const IMAGE_BASE = 'https://anshulaprashad.github.io/marmitex/';

// ⚡ Rota PRINCIPAL - O WhatsApp lê ESTA rota primeiro!
app.get('/', (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const hoje = new Date().toLocaleString('pt-BR', { weekday: 'long' }).toLowerCase();
  const cardapio = cardapios[hoje] || cardapios['segunda-feira'];
  const imageUrl = `${IMAGE_BASE}${cardapio.img}`;

  console.log('='.repeat(50));
  console.log(`📅 Dia: ${hoje}`);
  console.log(`🤖 User Agent: ${userAgent.substring(0, 80)}`);
  console.log(`🖼️ Imagem do dia: ${cardapio.img}`);

  // Detecta WhatsApp/Telegram/Facebook/Twitter
  const isBot = /WhatsApp|TelegramBot|facebookexternalhit|Twitterbot|LinkedInBot|Discordbot|Slackbot/i.test(userAgent);

  if (isBot) {
    console.log('🎯 BOT DETECTADO! Gerando preview dinâmico...');
    
    // ⭐⭐ IMPORTANTE: WhatsApp lê ESTE HTML, não faz redirecionamento!
    const htmlPreview = `
<!DOCTYPE html>
<html prefix="og: https://ogp.me/ns#" lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <title>👑 ${cardapio.titulo} - O REI DA MARMITEX</title>
    <meta name="description" content="${cardapio.descricao}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://marmitaria-premium.onrender.com/">
    <meta property="og:title" content="🍱 ${cardapio.titulo} - O REI DA MARMITEX">
    <meta property="og:description" content="${cardapio.descricao}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${cardapio.titulo}">
    <meta property="og:site_name" content="O REI DA MARMITEX">
    <meta property="og:locale" content="pt_BR">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="🍱 ${cardapio.titulo} - O REI DA MARMITEX">
    <meta name="twitter:description" content="${cardapio.descricao}">
    <meta name="twitter:image" content="${imageUrl}">
    
    <!-- ⭐⭐ WhatsApp PRECISA ver este conteúdo SEM redirecionamento! -->
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
            text-align: center;
        }
        .preview-box {
            max-width: 800px;
            background: rgba(28, 28, 30, 0.95);
            padding: 30px;
            border-radius: 20px;
            border: 3px solid #FFD700;
        }
        h1 { color: #FFD700; margin-bottom: 20px; }
        img { 
            max-width: 100%; 
            height: auto;
            border-radius: 15px;
            margin: 20px 0;
            border: 3px solid #C41E3A;
        }
    </style>
</head>
<body>
    <div class="preview-box">
        <h1>👑 O REI DA MARMITEX</h1>
        <h2>${cardapio.titulo}</h2>
        <p>${cardapio.descricao}</p>
        <img src="${imageUrl}" alt="${cardapio.titulo}">
        <p>📍 WhatsApp: (11) 99999-9999 | ⏰ 11h às 21h</p>
    </div>
    
    <!-- ⭐⭐ IMPORTANTE: Script que redireciona usuários normais, mas NÃO WhatsApp -->
    <script>
        // Verifica se é WhatsApp (WhatsApp não executa JavaScript!)
        const isWhatsApp = navigator.userAgent.includes('WhatsApp');
        
        if (!isWhatsApp) {
            // Se NÃO for WhatsApp, redireciona para landing page
            setTimeout(() => {
                window.location.href = '/landing';
            }, 100);
        }
    </script>
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(htmlPreview);
    
  } else {
    // Usuário normal - redireciona IMEDIATAMENTE para landing
    console.log('👤 Usuário normal detectado, redirecionando para /landing');
    res.redirect('/landing');
  }
});

// Rota da LANDING PAGE real (seu HTML completo)
app.get('/landing', (req, res) => {
  console.log('🌐 Servindo landing page completa...');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'online', 
    service: 'Rei da Marmitex - Preview Dinâmico',
    dia_atual: new Date().toLocaleString('pt-BR', { weekday: 'long' }),
    timestamp: new Date().toISOString()
  });
});

// Rota para forçar preview de um dia específico (para testes)
app.get('/preview/:dia', (req, res) => {
  const dia = req.params.dia;
  const cardapio = cardapios[dia] || cardapios['segunda-feira'];
  const imageUrl = `${IMAGE_BASE}${cardapio.img}`;
  
  console.log(`🧪 Preview forçado: ${dia} - ${cardapio.img}`);
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta property="og:image" content="${imageUrl}">
        <meta property="og:title" content="${cardapio.titulo}">
        <meta property="og:description" content="${cardapio.descricao}">
    </head>
    <body>
        <h1>Teste: ${dia}</h1>
        <img src="${imageUrl}" width="400">
        <p>${cardapio.descricao}</p>
    </body>
    </html>
  `);
});

// Inicia servidor
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('👑 O REI DA MARMITEX - Sistema de Preview WhatsApp');
  console.log(`🚀 URL Principal: https://marmitaria-premium.onrender.com/`);
  console.log(`🎯 Preview Teste: https://marmitaria-premium.onrender.com/preview/sexta-feira`);
  console.log(`🏥 Health Check: https://marmitaria-premium.onrender.com/health`);
  console.log('='.repeat(50));
});
