const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// Serve arquivos estáticos (seu HTML, CSS, JS)
app.use(express.static('public'));

// Cardápios da semana
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
    img: 'feijoadasabado.jpg', 
    titulo: 'SEXTA: Lasanha de Carne Mussarela',
    descricao: 'HOJE TEM LASANHA ESPECIAL! 🍝 Arroz + Feijão + Salada + Farofa - R$ 21,90'
  },
  'sábado': { 
    img: 'marmitex2.jpg', 
    titulo: 'SÁBADO: Opção Normal OU Feijoada',
    descricao: 'SÁBADO COM DUPLA OPÇÃO! 🍱 Escolha entre Marmitex Normal ou Feijoada - R$ 21,90'
  },
  'domingo': { 
    img: 'logorei.jpg', 
    titulo: 'DOMINGO: Volte Amanhã!',
    descricao: 'HOJE É DOMINGO! 🎉 VOLTE SEGUNDA PELO CARDÁPIO ESPECIAL!'
  }
};

// Rota PRINCIPAL - Detecta automaticamente
app.get('/', (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const hoje = new Date().toLocaleString('pt-BR', { weekday: 'long' }).toLowerCase();
  const cardapio = cardapios[hoje] || cardapios['segunda-feira'];
  const imageUrl = `https://anshulaprashad.github.io/marmitex/${cardapio.img}`;

  // Detecta WhatsApp/Facebook/Twitter (bots de preview)
  const isBot = /WhatsApp|TelegramBot|facebookexternalhit|Twitterbot|LinkedInBot|Discordbot/i.test(userAgent) ||
                req.query._escaped_fragment_ !== undefined;

  if (isBot) {
    console.log(`🤖 BOT detectado - Gerando preview para: ${cardapio.titulo}`);
    
    // HTML para PREVIEW (WhatsApp vê isso)
    const htmlPreview = `
<!DOCTYPE html>
<html prefix="og: https://ogp.me/ns#" lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>👑 ${cardapio.titulo} - O REI DA MARMITEX</title>
    <meta name="description" content="${cardapio.descricao}">
    
    <!-- Open Graph Tags -->
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
    
    <!-- Redireciona para landing page após 0 segundos -->
    <meta http-equiv="refresh" content="0;url=/landing">
    
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
        .container {
            max-width: 800px;
            padding: 30px;
        }
        h1 { color: #FFD700; margin-bottom: 20px; }
        img { max-width: 100%; border-radius: 15px; margin: 20px 0; border: 3px solid #C41E3A; }
        p { color: #fff; font-size: 18px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>👑 O REI DA MARMITEX</h1>
        <h2>${cardapio.titulo}</h2>
        <p>${cardapio.descricao}</p>
        <img src="${imageUrl}" alt="${cardapio.titulo}">
        <p>Redirecionando para o cardápio completo...</p>
    </div>
</body>
</html>`;
    
    res.send(htmlPreview);
  } else {
    // Usuário normal - redireciona para landing page
    res.redirect('/landing');
  }
});

// Rota da LANDING PAGE real
app.get('/landing', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'online', service: 'Rei da Marmitex - Full System' });
});

// Inicia servidor
app.listen(PORT, () => {
  console.log('👑 O REI DA MARMITEX - Sistema Completo');
  console.log(`🚀 URL: https://marmitaria-premium.onrender.com/`);
  console.log(`📅 Preview automático ativado!`);
});
