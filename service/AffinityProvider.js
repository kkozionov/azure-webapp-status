"use strict";

var config = require('../config/index');
var request = Promise.promisifyAll(require('request'));
var _ = require('underscore');

var AffinityProvider = {
	getAffinities: function (url) {
		//if (!affinityMap) {
			return this._read().then(function (affinities) {
				if (url) {
					return affinities[url];
				} else {
					return affinities;
				}
			});
		//} else {
		//	var map = url ? affinityMap[url] : affinityMap;
		//	return Promise.resolve(map);
		//}
	},

	_read: function () {
		return Promise.map(config.applications, function (app) {
			return request.getAsync({
				url: app.url + '/api/affinities'
			})
			.timeout(config.timeout)
			.then(function (res) {
				var affinities = [];

					var data = JSON.parse(res.body).data;
					for (var k in data) {
					if (data.hasOwnProperty(k)) {
						affinities.push(k);
					}
				}

				return {url: app.url, affinities: affinities};
			})
		}).then(function (affinities) {
			var map = {};
			_.each(affinities, function (value) {
				map[value.url] = value.affinities;
			});

			return map
		});
	}
};

module.exports = AffinityProvider;

