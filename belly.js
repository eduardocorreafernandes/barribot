const wppconnect = require('@wppconnect-team/wppconnect');
const path = require('path');
const fs = require('fs');
const unzipper = require('unzipper');
const { execSync } = require('child_process');

const sessionPath = path.join(__dirname, 'tokens');
const zipPath = path.join(__dirname, 'tokens.zip');
const repoPath = path.join(__dirname, 'tokens-belly');

// ==== Passo 1: Clonar o repositório privado se não existir ====
const token = process.env.GITHUB_TOKEN;
const repoUrl = `https://${token}@github.com/eduardocorreafernandes/tokens-belly.git`;

if (!fs.existsSync(repoPath)) {
  console.log('Clonando repositório privado tokens-belly...');
  execSync(`git clone ${repoUrl} ${repoPath}`, { stdio: 'inherit' });
}

// ==== Passo 2: Pegar o zip dos tokens e descompactar ====
const zipFilePath = path.join(repoPath, 'tokens.zip');
if (fs.existsSync(zipFilePath)) {
  console.log('Descompactando tokens.zip...');
  fs.createReadStream(zipFilePath)
    .pipe(unzipper.Extract({ path: sessionPath }))
    .on('close', () => console.log('Tokens descompactados!'));
} else {
  console.log('tokens.zip não encontrado no repositório privado!');
}

// ==== Passo 3: Certifica que a pasta existe ====
if (!fs.existsSync(sessionPath)) {
  fs.mkdirSync(sessionPath, { recursive: true });
}

wppconnect.create({
  session: 'minha-sessao',
  sessionDataPath: sessionPath,
  catchQR: (base64Qrimg, asciiQR) => {
    
    console.log('Escaneie o QR Code abaixo:');
    console.log(asciiQR);
    //const base64Data = base64Qrimg.replace(/^data:image\/png;base64,/, '');
    //fs.writeFileSync('qrcode.png', base64Data, 'base64');
    //console.log('QR Code salvo como qrcode.png, abra no celular para escanear!');
  },
  statusFind: (statusSession, session) => {
    console.log('Status da sessão:', statusSession);
  },
  qrRefreshInterval: 5 * 60 * 1000 ,// 5 minutos
  headless: true,
  devtools: false,
  useChrome: false,
  autoClose: false,
  //pra funcionar no terminal, tira essa opção
  
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
     setTimeout(() => {
    console.log('Chamando start após timeout...');
    start(client);
  }, 10000);
  }

  client.onStateChange((newState) => {
    console.log('Mudou para:', newState);
    if (newState === 'CONNECTED') {
      console.log('Cliente acabou de conectar! Iniciando bot...');
       setTimeout(() => {
    console.log('Chamando start após timeout...');
    start(client);
  }, 5000);
    }
  });
})
.catch((err) => console.log(err));



async function start(client){
    try{
      const disparar_funcao = () => {
    return new Promise((resolve) => {
        const checar = () => {
            const agora = new Date();
            const horas = agora.getHours();
            const minutos = agora.getMinutes();

            if (true) {
                console.log("É 08:00! A função será disparada.");
                resolve(); // Finaliza a promise
            } else {
                console.log("Ainda não é 08:00.");
                setTimeout(checar, 60000); // Tenta novamente em 1 minuto
            }
        };

        checar(); // Inicia a verificação pela primeira vez
    });
};

const ativar = async () => {
    await disparar_funcao(); // Aguarda até dar 08:00
    //lembrar de alterar o msg.from da send message options, deve contar o jid do grupo=>120363399351241774@g.us  
    // With buttons
      const result =await client.sendPollMessage('120363399351241774@g.us', 'Ração da belly', [
  'Manhã',
  'Tarde',
  'Noite'
]);;
//console.log(result);

console.log("Função ativada após 08:00.");
};

ativar();
  }
catch(err){
  console.log('deu piru:',err);
}
} 
