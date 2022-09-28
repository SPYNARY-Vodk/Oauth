const Client = require('disco-oauth');
const client = new Client("1011611413657169960", "pS0z3-HVoyCitJuUKsq_3iuzFkmyGFFC");

client.setScopes('identify', 'guilds');
client.setRedirect('https://test.spynaryvdk.repl.co/login');

module.exports = client;