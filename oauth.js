const Client = require('disco-oauth');
const client = new Client("1011611413657169960", "pS0z3-HVoyCitJuUKsq_3iuzFkmyGFFC");

client.setScopes('identify', 'guilds');
client.setRedirect('https://before-united.herokuapp.com/login');

module.exports = client;
