var util = require('util');

var request = Promise.promisifyAll(require('request'));
var _ = require('underscore');

var config = require('../config/index');

var SlackService = {
	sendTimeoutError: function (app, err) {
		this._sendMessageWithWebHook(app.slackHook, util.format("Health-status failed due to timeout: %sms", config.timeout), [{
				color: 'danger',
				pretext: "",
				text: err
			}
		]);
	},

	sendErrorMessage: function (app, statuses) {
		var message = util.format("Application at %s has at least one instance down\n", app.url);

		var attachments = [];
		_.each(statuses, function (status) {
			attachments.push({
				color: status.healthy ? 'good' :'danger',
				pretext: "",
				text: "Affinity: " + status.affinity + (!status.healthy ? "; _" + status.why + "_" : "")
			});
		});

		this._sendMessageWithWebHook(app.slackHook, message, attachments);
	},

	sendSuccessMessage: function (app, statuses) {
		this._sendMessageWithWebHook(app.slackHook, util.format("%s instances are up", statuses.length));
	},

	_sendMessageWithWebHook: function (hookURL, message, attachments) {
		if (hookURL) {
			return request.postAsync({
				url: hookURL,
				json: true,
				body: {
					text: message,
					username: "Sympli",
					attachments: attachments
				}
			}).catch(function (error) {
				console.error('Could not send message to Slack due to %j', error);
			}).done();
		}
	}
};

module.exports = SlackService;

