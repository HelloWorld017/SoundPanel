const {app, protocol} = require('electron');
const SoundPanel = require('./SoundPanel');

protocol.registerStandardSchemes(['soundpanel']);

const soundPanel = new SoundPanel();
app.on('ready', async () => {
	await soundPanel.start();
});
