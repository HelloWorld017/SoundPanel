const {app, protocol} = require('electron');
const SoundPanel = require('./SoundPanel');

protocol.registerSchemesAsPrivileged([{
	scheme: 'soundpanel',
	privileges: {standard: true, secure: true, supportFetchAPI: true}
}]);

const soundPanel = new SoundPanel();
app.on('ready', async () => {
	await soundPanel.init();
	await soundPanel.show();
});
