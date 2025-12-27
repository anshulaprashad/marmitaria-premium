const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// Serve arquivos estáticos
app.use(express.static('public'));

// ✅ Cardápios da semana com imagens reais
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
    img: 'feijoadasabado.jpg',
    titulo: 'SÁBADO: Opção Normal OU Feijoada 🍲',
    descricao: 'SÁBADO COM DUPLA OPÇÃO! 🍱 Escolha entre Marmitex Normal ou Feijoada Completa com Torresmo - R$ 21,90'
  },
  'domingo': { 
    img: 'logorei.jpg',
    titulo: 'DOMINGO: Volte Amanhã! 🎉',
    descricao: 'HOJE É DOMINGO! 🎉 ESTAMOS FECHADOS. VOLTE SEGUNDA-FEIRA PELO CARDÁPIO ESPECIAL!'
  }
};

const IMAGE_BASE = 'https://anshulaprashad.github.io/marmitex/';

// 🎯 Função para obter o dia da semana em português
function obterDiaSemana() {
  const dias = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  const hoje = new Date();
  return dias[hoje.getDay()];
}

// ⚡ ROTA PRINCIPAL - WhatsApp lê ESTA rota!
app.get('/', (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const hoje = obterDiaSemana();
  const cardapio = cardapios[hoje] || cardapios['segunda-feira'];
  const imageUrl = `${IMAGE_BASE}${cardapio.img}`;
  
  // Adiciona timestamp para evitar cache do WhatsApp
  const timestamp = Date.now();
  const imageUrlComCache = `${imageUrl}?v=${timestamp}`;

  console.log('='.repeat(60));
  console.log(`📅 Data/Hora: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
  console.log(`📅 Dia da semana: ${hoje}`);
  console.log(`🤖 User Agent: ${userAgent.substring(0, 100)}...`);
  console.log(`🖼️ Imagem do dia: ${cardapio.img}`);
  console.log(`🔗 URL da imagem: ${imageUrl}`);
  console.log(`📝 Título: ${cardapio.titulo}`);
  console.log('='.repeat(60));

  // Detecta bots (WhatsApp, Telegram, Facebook, etc)
  const isBot = /WhatsApp|TelegramBot|facebookexternalhit|Twitterbot|LinkedInBot|Discordbot|Slackbot|bot|crawler|spider/i.test(userAgent);

  if (isBot) {
    console.log('✅ BOT DETECTADO! Enviando HTML otimizado para preview...');
    
    const htmlPreview = `<!DOCTYPE html>
<html prefix="og: https://ogp.me/ns#" lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO Básico -->
    <title>🍱 ${cardapio.titulo} - O REI DA MARMITEX</title>
    <meta name="description" content="${cardapio.descricao}">
    
    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://marmitaria-premium.onrender.com/">
    <meta property="og:title" content="🍱 ${cardapio.titulo}">
    <meta property="og:description" content="${cardapio.descricao}">
    <meta property="og:image" content="${imageUrlComCache}">
    <meta property="og:image:secure_url" content="${imageUrlComCache}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${cardapio.titulo}">
    <meta property="og:site_name" content="O REI DA MARMITEX">
    <meta property="og:locale" content="pt_BR">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="🍱 ${cardapio.titulo}">
    <meta name="twitter:description" content="${cardapio.descricao}">
    <meta name="twitter:image" content="${imageUrlComCache}">
    
    <!-- Telegram -->
    <meta property="telegram:channel" content="@reidamarmitex">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a0f0a 0%, #2c1c10 100%);
            color: #fff;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            text-align: center;
            animation: fadeIn 0.5s ease-in;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .logo {
            font-size: 4rem;
            margin-bottom: 20px;
            animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        h1 {
            color: #FFD700;
            font-size: 2.5rem;
            margin-bottom: 20px;
            text-shadow: 0 4px 10px rgba(255, 215, 0, 0.3);
        }
        h2 {
            font-size: 1.8rem;
            margin-bottom: 15px;
            color: #FF3B30;
        }
        .description {
            font-size: 1.2rem;
            line-height: 1.6;
            margin-bottom: 30px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            border: 2px solid #FFD700;
        }
        img {
            max-width: 100%;
            height: auto;
            border-radius: 20px;
            border: 4px solid #FFD700;
            margin: 30px 0;
            box-shadow: 0 15px 40px rgba(255, 215, 0, 0.3);
        }
        .info {
            margin: 15px 0;
            font-size: 1.1rem;
            padding: 10px;
            background: rgba(255, 215, 0, 0.1);
            border-radius: 10px;
        }
        .whatsapp-btn {
            display: inline-block;
            background: linear-gradient(135deg, #25D366, #128C7E);
            color: white;
            padding: 15px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: bold;
            font-size: 1.2rem;
            margin-top: 30px;
            transition: transform 0.3s ease;
            box-shadow: 0 10px 30px rgba(37, 211, 102, 0.4);
        }
        .whatsapp-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(37, 211, 102, 0.6);
        }
        .loading {
            margin-top: 20px;
            color: #FFD700;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">👑</div>
        <h1>O REI DA MARMITEX</h1>
        <h2>${cardapio.titulo}</h2>
        
        <div class="description">
            ${cardapio.descricao}
        </div>
        
        <img src="${imageUrl}" alt="${cardapio.titulo}" loading="eager">
        
        <div class="info">📞 <strong>WhatsApp:</strong> (11) 99999-9999</div>
        <div class="info">⏰ <strong>Horário:</strong> Segunda a Sábado, 11h às 21h</div>
        <div class="info">🚚 <strong>Entregamos em toda região!</strong></div>
        
        <a href="https://wa.me/5511999999999?text=${encodeURIComponent(`🍱 Vi o cardápio de ${hoje}: ${cardapio.titulo}! Quero fazer meu pedido!`)}" class="whatsapp-btn">
            📱 FAZER PEDIDO AGORA
        </a>
        
        <p class="loading">⏳ Redirecionando para o site completo...</p>
    </div>
    
    <script>
        // Redireciona apenas usuários reais (não bots)
        setTimeout(function() {
            if (!navigator.userAgent.match(/bot|crawler|spider/i)) {
                window.location.href = '/landing';
            }
        }, 3000);
    </script>
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(htmlPreview);
    
  } else {
    console.log('👤 Usuário normal, redirecionando para landing page...');
    res.redirect(302, '/landing');
  }
});

// 🌐 Landing page completa
app.get('/landing', (req, res) => {
  console.log('🌐 Servindo landing page completa...');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🧪 Rota para testar preview de qualquer dia
app.get('/test/:dia', (req, res) => {
  const dia = req.params.dia;
  const diasValidos = ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado', 'domingo'];
  const diaTeste = diasValidos.includes(dia) ? dia : 'segunda-feira';
  const cardapio = cardapios[diaTeste];
  const imageUrl = `${IMAGE_BASE}${cardapio.img}`;
  
  res.send(`
<!DOCTYPE html>
<html prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="UTF-8">
    <title>🧪 Teste: ${cardapio.titulo}</title>
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:title" content="🍱 ${cardapio.titulo}">
    <meta property="og:description" content="${cardapio.descricao}">
    <meta property="og:url" content="https://marmitaria-premium.onrender.com/">
    <meta property="og:type" content="website">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 30px;
            background: #1a0f0a;
            color: white;
            max-width: 900px;
            margin: 0 auto;
        }
        h1 { color: #FFD700; margin-bottom: 30px; }
        .card {
            background: rgba(44, 44, 46, 0.9);
            border: 2px solid #FFD700;
            border-radius: 15px;
            padding: 25px;
            margin: 20px 0;
        }
        img { 
            max-width: 100%; 
            border-radius: 15px;
            border: 4px solid #FFD700;
            margin: 20px 0;
            display: block;
        }
        .info {
            background: rgba(255, 215, 0, 0.1);
            padding: 15px;
            border-radius: 10px;
            margin: 10px 0;
            border-left: 4px solid #FFD700;
        }
        .test-link {
            display: inline-block;
            background: linear-gradient(135deg, #25D366, #128C7E);
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            text-decoration: none;
            margin: 10px 5px;
            font-weight: bold;
            transition: transform 0.3s ease;
        }
        .test-link:hover {
            transform: translateY(-3px);
        }
        code {
            background: rgba(0, 0, 0, 0.5);
            padding: 2px 6px;
            border-radius: 4px;
            color: #FFD700;
        }
        .success { color: #34C759; }
        .warning { color: #FF9500; }
    </style>
</head>
<body>
    <h1>🧪 Teste de Preview - ${diaTeste}</h1>
    
    <div class="card">
        <h2>${cardapio.titulo}</h2>
        <img src="${imageUrl}" alt="${cardapio.titulo}" onerror="this.style.border='4px solid red'; this.alt='❌ ERRO AO CARREGAR IMAGEM';">
        <p>${cardapio.descricao}</p>
    </div>
    
    <div class="card">
        <h3>📋 Informações Técnicas</h3>
        <div class="info">
            <strong>Dia testado:</strong> <code>${diaTeste}</code>
        </div>
        <div class="info">
            <strong>Imagem:</strong> <code>${cardapio.img}</code>
        </div>
        <div class="info">
            <strong>URL completa:</strong><br>
            <code>${imageUrl}</code>
        </div>
        <div class="info">
            <strong>Meta OG:Image:</strong> <span class="success">✅ Configurada</span>
        </div>
    </div>
    
    <div class="card">
        <h3>🧪 Testar Preview</h3>
        <p>Clique nos botões abaixo para testar o preview em diferentes plataformas:</p>
        
        <a class="test-link" href="https://api.whatsapp.com/send?text=${encodeURIComponent(`Confira o cardápio de ${diaTeste}: https://marmitaria-premium.onrender.com/`)}" target="_blank">
            📱 Testar no WhatsApp
        </a>
        
        <a class="test-link" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://marmitaria-premium.onrender.com/')}" target="_blank">
            👥 Testar no Facebook
        </a>
        
        <a class="test-link" href="https://developers.facebook.com/tools/debug/?q=${encodeURIComponent('https://marmitaria-premium.onrender.com/')}" target="_blank">
            🔍 Debug Facebook/WhatsApp
        </a>
    </div>
    
    <div class="card">
        <h3>⚠️ Importante sobre Cache do WhatsApp</h3>
        <p class="warning">
            O WhatsApp faz cache agressivo das previews. Se você já compartilhou o link antes, 
            pode levar até 7 dias para o WhatsApp atualizar o preview.
        </p>
        <p>
            <strong>Soluções:</strong><br>
            1. Use o Facebook Debugger (botão acima) para limpar o cache<br>
            2. Teste com um link nunca compartilhado antes<br>
            3. Adicione parâmetros à URL: <code>?dia=${diaTeste}</code>
        </p>
    </div>
</body>
</html>
  `);
});

// 💚 Health check
app.get('/health', (req, res) => {
  const hoje = obterDiaSemana();
  const cardapio = cardapios[hoje];
  
  res.json({ 
    status: 'online',
    service: '👑 O REI DA MARMITEX',
    dia_atual: hoje,
    cardapio_hoje: cardapio.titulo,
    imagem_hoje: cardapio.img,
    imagem_url_completa: `${IMAGE_BASE}${cardapio.img}`,
    timestamp: new Date().toISOString(),
    timezone: 'America/Sao_Paulo',
    preview_disponivel: true
  });
});

// 🔄 Rota para forçar atualização de cache
app.get('/preview-fresh', (req, res) => {
  const hoje = obterDiaSemana();
  const cardapio = cardapios[hoje];
  const timestamp = Date.now();
  
  res.redirect(301, `/?refresh=${timestamp}`);
});

// 🚀 Inicia servidor
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('👑 O REI DA MARMITEX - Preview Dinâmico WhatsApp');
  console.log(`🚀 Servidor rodando na porta: ${PORT}`);
  console.log(`🔗 URL Principal: https://marmitaria-premium.onrender.com/`);
  console.log(`🌐 Landing Page: https://marmitaria-premium.onrender.com/landing`);
  console.log('');
  console.log('📅 URLs de Teste por Dia:');
  console.log(`   Segunda: /test/segunda-feira`);
  console.log(`   Terça: /test/terça-feira`);
  console.log(`   Quarta: /test/quarta-feira`);
  console.log(`   Quinta: /test/quinta-feira`);
  console.log(`   Sexta: /test/sexta-feira`);
  console.log(`   Sábado: /test/sábado`);
  console.log(`   Domingo: /test/domingo`);
  console.log('');
  console.log('🛠️ Ferramentas:');
  console.log(`   💚 Health: /health`);
  console.log(`   🔄 Preview Fresh: /preview-fresh`);
  console.log('');
  console.log(`📅 Dia atual: ${obterDiaSemana()}`);
  console.log('='.repeat(60));
});
