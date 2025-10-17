const wppconnect = require('@wppconnect-team/wppconnect');

wppconnect.create({
  session: 'minha-sessao',
  catchQR: (base64Qrimg, asciiQR) => {
    console.log('Escaneie o QR Code abaixo:');
    console.log(asciiQR);
  },
  statusFind: (statusSession, session) => {
    console.log('Status da sessão:', statusSession);
  },
  headless: true,
  devtools: false,
  useChrome: true,
   executablePath: '',
  autoClose: false,
  
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

            if (horas==8 && minutos==0) {
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
