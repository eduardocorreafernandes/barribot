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
 //obtenção dos ids dos grupos
      async function listar_grupos(client){
 const chats = await client.listChats({ onlyGroups: true });
   //debug do chat
  chats.forEach(chat => {
  console.log(chat); // veja toda a estrutura
});
    console.log("Grupos encontrados:");
    chats.forEach(Chat => {
      console.log(`Nome: ${Chat.name} | ID: ${Chat.id._serialized}`);
    });

}
async function start(client){
    try{
await listar_grupos(client);
} catch(err){
  console.log('deu piru:',err);
}


}