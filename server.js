const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

// Cardápios COMPLETO da semana (ATUALIZADO com suas imagens reais)
const cardapios = {
  'segunda-feira': { 
    img: 'marmita20.png',  // Note: suas imagens são .png, não .jpg
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

// URL da sua landing page REAL
const LANDING_PAGE_URL = 'https://anshulaprashad.github.io/marmitex/';

// Middleware para log
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${req.headers['user-agent'] || 'No UA'}`);
  next();
});

// Rota PRINCIPAL para preview do WhatsApp
app.get('/', (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const hoje = new Date().toLocaleString('pt-BR', { weekday: 'long' }).toLowerCase();
  
  const cardapio = cardapios[hoje] || cardapios['segunda-feira'];
  const imageUrl = `https://anshulaprashad.github.io/marmitex/${cardapio.img}`;
  
  // Detecta se é bot/scraper
  const isBot = userAgent.includes('WhatsApp') || 
                userAgent.includes('TelegramBot') || 
                userAgent.includes('facebookexternalhit') ||
                userAgent.includes('Twitterbot') ||
                userAgent.includes('LinkedInBot') ||
                userAgent.includes('Discordbot') ||
                req.query.preview === 'sim' ||
                req.query._escaped_fragment_ !== undefined;

  if (isBot) {
    console.log(`🤖 BOT detectado: ${userAgent.substring(0, 50)}...`);
    console.log(`🎯 Gerando preview para: ${cardapio.titulo}`);
    
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
    <meta property="og:url" content="${LANDING_PAGE_URL}">
    <meta property="og:title" content="🍱 ${cardapio.titulo} - O REI DA MARMITEX">
    <meta property="og:description" content="${cardapio.descricao}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${cardapio.titulo}">
    <meta property="og:site_name" content="O REI DA MARMITEX">
    <meta property="og:locale" content="pt_BR">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@ReiDaMarmitex">
    <meta name="twitter:title" content="🍱 ${cardapio.titulo} - O REI DA MARMITEX">
    <meta name="twitter:description" content="${cardapio.descricao}">
    <meta name="twitter:image" content="${imageUrl}">
    
    <!-- Redireciona para landing page real -->
    <meta http-equiv="refresh" content="2;url=${LANDING_PAGE_URL}">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #1a0f0a 0%, #2c1c10 100%);
            color: #fff;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .preview-container {
            max-width: 800px;
            width: 100%;
            background: rgba(28, 28, 30, 0.95);
            border-radius: 20px;
            border: 3px solid #FFD700;
            padding: 30px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .logo {
            color: #FFD700;
            font-size: 2.5rem;
            margin-bottom: 15px;
        }
        h1 {
            color: #FFD700;
            margin-bottom: 20px;
            font-size: 1.8rem;
        }
        h2 {
            color: #fff;
            margin-bottom: 20px;
            font-size: 1.4rem;
        }
        .image-container {
            margin: 25px 0;
            border-radius: 15px;
            overflow: hidden;
            border: 3px solid #C41E3A;
            box-shadow: 0 5px 15px rgba(196, 30, 58, 0.3);
        }
        .image-container img {
            width: 100%;
            height: auto;
            display: block;
        }
        .description {
            background: rgba(255, 215, 0, 0.1);
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 4px solid #FFD700;
        }
        .loading {
            color: #FFD700;
            margin-top: 25px;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .contact {
            margin-top: 25px;
            color: #8E8E93;
            font-size: 0.9rem;
        }
        .pulse {
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    </style>
</head>
<body>
    <div class="preview-container">
        <div class="logo">👑</div>
        <h1>O REI DA MARMITEX</h1>
        <h2>${cardapio.titulo}</h2>
        
        <div class="description">
            <p>${cardapio.descricao}</p>
        </div>
        
        <div class="image-container">
            <img src="${imageUrl}" 
                 alt="${cardapio.titulo}"
                 onerror="this.src='https://anshulaprashad.github.io/marmitex/logorei.jpg'">
        </div>
        
        <div class="loading">
            <span class="pulse">🔄</span>
            Redirecionando para o cardápio completo...
        </div>
        
        <div class="contact">
            📞 <strong>WhatsApp:</strong> (11) 99999-9999<br>
            ⏰ <strong>Horário:</strong> Segunda a Sábado, 11h às 21h<br>
            🚚 <strong>Entrega grátis</strong> na região
        </div>
    </div>
    
    <script>
        // Força recache da imagem
        const img = document.querySelector('img');
        if (img) {
            img.src = img.src + '?t=' + new Date().getTime();
        }
    </script>
</body>
</html>
    `;
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(htmlPreview);
    
  } else {
    // Usuário normal - redireciona direto
    console.log('👤 Usuário normal detectado, redirecionando...');
    res.redirect(LANDING_PAGE_URL);
  }
});

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({ 
    status: 'online',
    service: 'Rei da Marmitex - WhatsApp Preview',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    cardapios_disponiveis: Object.keys(cardapios).length
  });
});

// Rota para testar preview específico
app.get('/test/:dia', (req, res) => {
  const dia = req.params.dia;
  const cardapio = cardapios[dia] || cardapios['segunda-feira'];
  
  res.json({
    dia: dia,
    cardapio: cardapio,
    preview_url: `/?preview=sim&force_dia=${dia}`
  });
});

// 404 handler
app.use((req, res) => {
  res.redirect(LANDING_PAGE_URL);
});

// Inicia servidor
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('👑 O REI DA MARMITEX - WhatsApp Preview Generator');
  console.log(`🚀 Servidor rodando na porta: ${PORT}`);
  console.log(`🌐 Preview URL: http://localhost:${PORT}/`);
  console.log(`🎯 Landing page: ${LANDING_PAGE_URL}`);
  console.log('='.repeat(50));
  console.log('\n📱 Para testar:');
  console.log(`   • Acesse: http://localhost:${PORT}/?preview=sim`);
  console.log(`   • Saúde: http://localhost:${PORT}/health`);
  console.log(`   • Teste dia: http://localhost:${PORT}/test/segunda-feira`);
  console.log('='.repeat(50));
});
