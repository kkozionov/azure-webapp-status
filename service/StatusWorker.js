"use strict";

var CronJob = require('cron').CronJob;
var _ = require('underscore');

var config = require('../config/index');
var AzureWebApplicationStatus = require('./AzureWebApplicationStatus');
var AffinityProvider = require('./AffinityProvider');
var SlackService = require('./SlackService');


var StatusWorker = {
	start: function () {
		_.each(config.applications, function (app) {
			this._doStart(app);
		}.bind(this));
	},

	_doStart: function (app) {
		new CronJob(app.interval, function () {
			AffinityProvider.getAffinities(app.url)
				.then(function (affinities) {
					AzureWebApplicationStatus.status(app.url, affinities)
						.timeout(config.timeout)
						.then(function (statuses) {
							var problem = false;
							console.log("%s got response: %j", app.url, statuses);
							_.each(statuses, function (status) {
								if (!status.healthy && !problem) {
									problem = !status.healthy;
								}
							});

							if (problem) {
								SlackService.sendErrorMessage(app, statuses);
							}
						})
				})
				.catch(Promise.TimeoutError, function (err) {
					SlackService.sendTimeoutError(app, err);
				})
				.catch(function (err) {
					console.error(err);
				});
		}, null, true, null);
	}
};

module.exports = StatusWorker;