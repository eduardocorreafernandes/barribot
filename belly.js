const wppconnect = require('@wppconnect-team/wppconnect');
const path = require('path');
const fs = require('fs');
const open = require('open'); // npm i open

const sessionPath = process.env.TOKENS_PATH || path.join(__dirname, 'tokens');

// Certifica que a pasta existe
if (!fs.existsSync(sessionPath)) {
  fs.mkdirSync(sessionPath, { recursive: true });
}

wppconnect.create({
  session: 'minha-sessao',
  sessionDataPath: sessionPath,
  catchQR: async (base64Qrimg, asciiQR) => {
    console.log('QR Code gerado, abrindo no navegador...');
    
    // Salva o QR Code como PNG
    const base64Data = base64Qrimg.replace(/^data:image\/png;base64,/, '');
    const qrPath = path.join(sessionPath, 'qrcode.png');
    fs.writeFileSync(qrPath, base64Data, 'base64');

    // Abre automaticamente no navegador
    await open(qrPath);
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
.catch(err => console.log(err));

// Função principal do bot
async function start(client){
  try{
    const disparar_funcao = () => new Promise((resolve) => {
      const checar = () => {
        const agora = new Date();
        const horas = agora.getHours();

        if (true) { // Coloque sua condição de horário real
          console.log("Hora certa! Disparando função.");
          resolve();
        } else {
          setTimeout(checar, 60000); // tenta novamente em 1 min
        }
      };
      checar();
    });

    const ativar = async () => {
      await disparar_funcao();
      const result = await client.sendPollMessage(
        '120363399351241774@g.us',
        'Ração da belly',
        ['Manhã', 'Tarde', 'Noite']
      );
      console.log("Função ativada.", result);
    };

    ativar();
  }
  catch(err){
    console.log('Erro:', err);
  }
}

