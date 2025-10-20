const wppconnect = require('@wppconnect-team/wppconnect');
const path = require('path');
const fs = require('fs');

const sessionPath = process.env.TOKENS_PATH || path.join(__dirname, 'tokens');

// Certifica que a pasta de tokens existe
if (!fs.existsSync(sessionPath)) {
  fs.mkdirSync(sessionPath, { recursive: true });
}

wppconnect.create({
  session: 'minha-sessao',
  sessionDataPath: sessionPath,
  catchQR: (base64Qrimg, asciiQR) => {
    // QR Code no terminal (ASCII)
    console.log('QR Code ASCII:');
    console.log(asciiQR);

    // QR Code em base64 (copie e abra no navegador)
    console.log('\nQR Code Base64 (abra no navegador como data:image/png;base64,...):');
    console.log(base64Qrimg);
  },
  statusFind: (statusSession, session) => {
    console.log('Status da sessão:', statusSession);
  },
  qrRefreshInterval: 5 * 60 * 1000, // 5 minutos
  headless: true,
  devtools: false,
  useChrome: false,
  autoClose: false,
  puppeteerOptions: {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process',
      '--no-zygote'
    ],
  }
})
.then(async (client) => {
  const state = await client.getConnectionState();
  console.log('Estado inicial do cliente:', state);

  if (state === 'CONNECTED') {
    console.log('Cliente já está conectado! Iniciando bot...');
    setTimeout(() => start(client), 10000);
  }

  client.onStateChange((newState) => {
    console.log('Mudou para:', newState);
    if (newState === 'CONNECTED') {
      console.log('Cliente acabou de conectar! Iniciando bot...');
      setTimeout(() => start(client), 5000);
    }
  });
})
.catch(err => console.log('Erro ao iniciar WPPConnect:', err));

async function start(client) {
  try {
    // Função de disparo baseado em horário
    const disparar_funcao = () => new Promise((resolve) => {
      const checar = () => {
        const agora = new Date();
        const horas = agora.getHours();
        const minutos = agora.getMinutes();

        // Altere a hora que quiser disparar a função
        if (horas === 8 && minutos === 0) {
          console.log("É 08:00! Disparando função.");
          resolve();
        } else {
          console.log(`Ainda não é 08:00. Agora são ${horas}:${minutos}`);
          setTimeout(checar, 60000); // verifica a cada 1 minuto
        }
      };
      checar();
    });

    const ativar = async () => {
      await disparar_funcao();
      const result = await client.sendPollMessage(
        '120363399351241774@g.us', // altere para o JID do grupo
        'Ração da Belly',
        ['Manhã', 'Tarde', 'Noite']
      );
      console.log("Função ativada.", result);
    };

    ativar();
  } catch(err) {
    console.log('Erro na função start:', err);
  }
}


