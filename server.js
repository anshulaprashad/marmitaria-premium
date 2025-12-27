const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Cardápios COMPLETO da semana
const cardapios = {
  'segunda-feira': { 
    img: 'marmita20.jpg', 
    titulo: 'SEGUNDA: Frango Grelhado Especial',
    descricao: 'HOJE TEM FRANGO GRELHADO! 🍗 Arroz + Feijão + Salada + Farofa - R$ 21,90'
  },
  'terça-feira': { 
    img: 'marmita21.jpg', 
    titulo: 'TERÇA: Carne de Panela Desfiada',
    descricao: 'HOJE TEM CARNE DE PANELA! 🥩 Arroz + Feijão + Salada + Farofa - R$ 21,90'
  },
  'quarta-feira': { 
    img: 'marmita25.jpg', 
    titulo: 'QUARTA: Moqueca de Frango Cremosa',
    descricao: 'HOJE TEM MOQUECA DE FRANGO! 🐔 Arroz + Feijão + Salada + Farofa - R$ 21,90'
  },
  'quinta-feira': { 
    img: 'marmita24.jpg', 
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

// Rota PRINCIPAL para preview do WhatsApp
app.get('/', (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const hoje = new Date().toLocaleString('pt-BR', { weekday: 'long' }).toLowerCase();
  
  console.log(`📱 User Agent: ${userAgent}`);
  console.log(`📅 Dia da semana: ${hoje}`);
  
  const cardapio = cardapios[hoje] || cardapios['segunda-feira'];
  const imageUrl = `https://anshulaprashad.github.io/marmitex/${cardapio.img}`;
  
  // Se for WhatsApp ou qualquer bot de scraping
  if (userAgent.includes('WhatsApp') || 
      userAgent.includes('TelegramBot') || 
      userAgent.includes('facebookexternalhit') ||
      userAgent.includes('Twitterbot') ||
      userAgent.includes('LinkedInBot') ||
      req.query.preview === 'sim') {
    
    console.log(`✅ Gerando preview para: ${cardapio.titulo}`);
    
    const htmlPreview = `
<!DOCTYPE html>
<html prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Open Graph Tags -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://marmitex-premium.onrender.com">
    <meta property="og:title" content="🍱 ${cardapio.titulo} - O REI DA MARMITEX">
    <meta property="og:description" content="${cardapio.descricao}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${cardapio.titulo}">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="🍱 ${cardapio.titulo} - O REI DA MARMITEX">
    <meta name="twitter:description" content="${cardapio.descricao}">
    <meta name="twitter:image" content="${imageUrl}">
    
    <!-- Redireciona para landing page real após 1 seg -->
    <meta http-equiv="refresh" content="1;url=https://anshulaprashad.github.io/marmitex/">
    
    <title>👑 O REI DA MARMITEX - ${cardapio.titulo}</title>
    
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #1a0f0a 0%, #2c1c10 100%);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            text-align: center;
        }
        .container {
            max-width: 800px;
            background: rgba(28, 28, 30, 0.95);
            padding: 30px;
            border-radius: 20px;
            border: 3px solid #FFD700;
        }
        h1 {
            color: #FFD700;
            margin-bottom: 20px;
        }
        img {
            max-width: 100%;
            border-radius: 15px;
            margin: 20px 0;
            border: 3px solid #C41E3A;
        }
        .loading {
            color: #FFD700;
            font-size: 18px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>👑 O REI DA MARMITEX</h1>
        <h2>${cardapio.titulo}</h2>
        <p>${cardapio.descricao}</p>
        
        <img src="${imageUrl}" alt="${cardapio.titulo}" 
             onerror="this.src='https://anshulaprashad.github.io/marmitex/logorei.jpg'">
        
        <p class="loading">🔄 Redirecionando para o cardápio completo...</p>
        
        <p style="margin-top: 30px; color: #8E8E93;">
            📞 WhatsApp: (11) 99999-9999<br>
            ⏰ Segunda a Sábado, 11h às 21h
        </p>
    </div>
</body>
</html>
    `;
    
    res.send(htmlPreview);
  } else {
    // Se for usuário normal, redireciona direto
    res.redirect('https://anshulaprashad.github.io/marmitex/');
  }
});

// Rota de saúde da API
app.get('/health', (req, res) => {
  res.json({ 
    status: 'online',
    message: '👑 O REI DA MARMITEX - Preview Generator',
    timestamp: new Date().toISOString()
  });
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📅 Pronto para gerar previews do WhatsApp!`);
});
