const wppconnect = require('@wppconnect-team/wppconnect');
const fs = require('fs');
const path = require('path');

// Caminho do arquivo que guarda a última data de disparo
const dataFile = path.join(__dirname, 'ultimaExecucao.json');

// Função pra verificar se já disparou hoje
function jaDisparouHoje() {
  if (!fs.existsSync(dataFile)) return false;

  const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  const hoje = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  return data.data === hoje;
}

// Função pra registrar a execução
function registrarExecucao() {
  const hoje = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(dataFile, JSON.stringify({ data: hoje }));
}

wppconnect.create({
  session: 'minha-sessao',
  catchQR: (base64Qrimg, asciiQR) => {
    console.log('Escaneie o QR Code abaixo:');
    console.log(asciiQR);
  },
  statusFind: (statusSession, session) => {
    console.log('Status da sessão:', statusSession);
  },
  qrRefreshInterval: 5 * 60 * 1000, // 5 minutos
  headless: true,
  devtools: false,
  useChrome: false,
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

async function start(client) {
  try {
    const disparar_funcao = () => {
      return new Promise((resolve) => {
        const checar = () => {
          const agora = new Date();
          const horas = agora.getHours();
          const minutos = agora.getMinutes();

          if (horas > 6 && horas < 19) {
            console.log("É hora de disparar a enquete.");
            resolve(); // Finaliza a promise
          } else {
            console.log("Ainda não é hora. Tentando novamente em 1 minuto...");
            setTimeout(checar, 60000); // Tenta novamente em 1 minuto
          }
        };

        checar(); // Inicia a verificação
      });
    };

    const ativar = async () => {
      //  Verifica se já disparou hoje
      if (jaDisparouHoje()) {
        console.log("🔁 Enquete já enviada hoje. Não será reenviada.");
        return;
      }

      await disparar_funcao(); // Espera dar o horário

      //  Envia enquete
      const result = await client.sendPollMessage(
        '120363399351241774@g.us',
        '🐾 Já colocaram ração pra Belly hoje?',
        ['Manhã', 'Tarde', 'Noite']
      );

      //console.log(" Enquete enviada:", result);
      registrarExecucao(); // Salva a data da execução
    };

    ativar();
  } catch (err) {
    console.log('deu piru:', err);
  }
}

