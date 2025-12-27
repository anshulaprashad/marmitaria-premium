const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// Serve arquivos estáticos (seu HTML, CSS, JS)
app.use(express.static('public'));

// ✅ Cardápios da semana com imagens CORRETAS para cada dia
const cardapios = {
  'segunda-feira': { 
    img: 'marmita20.png',  // Frango Grelhado
    titulo: 'SEGUNDA: Frango Grelhado Especial 🍗',
    descricao: 'HOJE TEM FRANGO GRELHADO! 🍗 Arroz + Feijão + Frango Suculento + Salada Fresca + Farofa Crocante - R$ 21,90'
  },
  'terça-feira': { 
    img: 'marmita21.png',  // Carne de Panela
    titulo: 'TERÇA: Carne de Panela Desfiada 🥩',
    descricao: 'HOJE TEM CARNE DE PANELA! 🥩 Arroz + Feijão + Carne Macia Desfiada + Salada + Farofa - R$ 21,90'
  },
  'quarta-feira': { 
    img: 'marmita25.png',  // Moqueca
    titulo: 'QUARTA: Moqueca de Frango Cremosa 🍲',
    descricao: 'HOJE TEM MOQUECA DE FRANGO! 🍲 Arroz + Feijão + Moqueca Cremosa + Salada + Farofa - R$ 21,90'
  },
  'quinta-feira': { 
    img: 'marmita24.png',  // Milanesa
    titulo: 'QUINTA: Bife à Milanesa Crocante 🥩',
    descricao: 'HOJE TEM BIFE À MILANESA! 🥩 Arroz + Feijão + Milanesa Crocante + Salada + Farofa - R$ 21,90'
  },
  'sexta-feira': { 
    img: 'marmita20.png',  // Lasanha (pode usar outra imagem se tiver)
    titulo: 'SEXTA: Lasanha de Carne Mussarela 🍝',
    descricao: 'HOJE TEM LASANHA ESPECIAL! 🍝 Arroz + Feijão + Lasanha Recheada + Salada + Farofa - R$ 21,90'
  },
  'sábado': { 
    img: 'feijoadasabado.jpg',  // ✅ CORRIGIDO - Feijoada do Sábado!
    titulo: 'SÁBADO: Opção Normal OU Feijoada 🍲',
    descricao: 'SÁBADO COM DUPLA OPÇÃO! 🍱 Escolha entre Marmitex Normal ou Feijoada Completa com Torresmo - R$ 21,90'
  },
  'domingo': { 
    img: 'logorei.jpg',  // Logo (fechado)
    titulo: 'DOMINGO: Volte Amanhã! 🎉',
    descricao: 'HOJE É DOMINGO! 🎉 ESTAMOS FECHADOS. VOLTE SEGUNDA-FEIRA PELO CARDÁPIO ESPECIAL!'
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
  console.log(`📅 Dia da semana: ${hoje}`);
  console.log(`🤖 User Agent: ${userAgent.substring(0, 80)}`);
  console.log(`🖼️ Imagem do dia: ${cardapio.img}`);
  console.log(`🔗 URL completa da imagem: ${imageUrl}`);
  console.log(`📝 Título: ${cardapio.titulo}`);

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
    
    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://marmitaria-premium.onrender.com/">
    <meta property="og:title" content="🍱 ${cardapio.titulo} - O REI DA MARMITEX">
    <meta property="og:description" content="${cardapio.descricao}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:secure_url" content="${imageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${cardapio.titulo}">
    <meta property="og:image:type" content="image/jpeg">
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
        h1 { 
            color: #FFD700; 
            margin-bottom: 20px;
            font-size: 2rem;
        }
        h2 {
            color: #FFF;
            margin: 20px 0;
            font-size: 1.5rem;
        }
        img { 
            max-width: 100%; 
            height: auto;
            border-radius: 15px;
            margin: 20px 0;
            border: 3px solid #C41E3A;
            box-shadow: 0 10px 30px rgba(255, 204, 0, 0.3);
        }
        p {
            font-size: 1.1rem;
            line-height: 1.6;
            margin: 15px 0;
        }
        .info {
            background: rgba(255, 204, 0, 0.1);
            padding: 15px;
            border-radius: 10px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="preview-box">
        <h1>👑 O REI DA MARMITEX</h1>
        <h2>${cardapio.titulo}</h2>
        <p>${cardapio.descricao}</p>
        <img src="${imageUrl}" alt="${cardapio.titulo}">
        <div class="info">
            <p>📞 WhatsApp: (11) 99999-9999</p>
            <p>⏰ Segunda a Sábado: 11h às 21h</p>
            <p>🚚 Entrega Rápida na Região</p>
        </div>
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
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
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
  const hoje = new Date().toLocaleString('pt-BR', { weekday: 'long' }).toLowerCase();
  const cardapio = cardapios[hoje] || cardapios['segunda-feira'];
  
  res.json({ 
    status: 'online', 
    service: 'Rei da Marmitex - Preview Dinâmico',
    dia_atual: hoje,
    cardapio_hoje: cardapio.titulo,
    imagem_hoje: cardapio.img,
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
    <html prefix="og: https://ogp.me/ns#">
    <head>
        <meta charset="UTF-8">
        <meta property="og:image" content="${imageUrl}">
        <meta property="og:title" content="${cardapio.titulo}">
        <meta property="og:description" content="${cardapio.descricao}">
        <meta property="og:type" content="website">
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 50px auto;
                padding: 20px;
                background: #1a0f0a;
                color: white;
            }
            img {
                max-width: 100%;
                border-radius: 15px;
                border: 3px solid #FFD700;
            }
            h1 { color: #FFD700; }
        </style>
    </head>
    <body>
        <h1>🧪 Teste de Preview: ${dia}</h1>
        <h2>${cardapio.titulo}</h2>
        <img src="${imageUrl}" width="100%">
        <p>${cardapio.descricao}</p>
        <hr>
        <p><strong>URL da imagem:</strong> ${imageUrl}</p>
    </body>
    </html>
  `);
});

// Inicia servidor
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('👑 O REI DA MARMITEX - Sistema de Preview WhatsApp');
  console.log(`🚀 URL Principal: https://marmitaria-premium.onrender.com/`);
  console.log(`🎯 Teste Sábado: https://marmitaria-premium.onrender.com/preview/sábado`);
  console.log(`🎯 Teste Segunda: https://marmitaria-premium.onrender.com/preview/segunda-feira`);
  console.log(`💚 Health Check: https://marmitaria-premium.onrender.com/health`);
  console.log('='.repeat(50));
});
