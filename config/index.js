var config = {
	timeout: 10000,
	applications: [
		{
			url: 'https://app.sympli.io',
			interval: '*/30 * * * * *',
			slackHook: '',
			email: '',
			name: 'app'
		},
		{
			url: 'https://dev.sympli.io',
			interval: '*/30 * * * * *',
			slackHook: '',
			email: '',
			name: 'dev'
		}
	]
};

module.exports = config;