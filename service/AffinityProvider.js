"use strict";

var config = require('../config/index');
var request = Promise.promisifyAll(require('request'));
var _ = require('underscore');

var affinityMap = null;

var AffinityProvider = {
	getAffinities: function (url) {
		if (!affinityMap) {
			return this._read().then(function () {
				var map = url ? affinityMap[url] : affinityMap;
				return Promise.resolve(map);
			});
		} else {
			var map = url ? affinityMap[url] : affinityMap;
			return Promise.resolve(map);
		}
	},

	_read: function () {
		return Promise.map(config.urls, function (url) {
			return request.getAsync({
				url: url + '/api/affinities'
			}).then(function (res) {
				//if (err) {
				//	console.error(err);
				//} else {
					if (!affinityMap) {
						affinityMap = {};
					}

					var affinities = JSON.parse(res.body).data;
					// clear affinities
					affinityMap[url] = [];
					for (var k in affinities) {
						if (affinities.hasOwnProperty(k)) {
							affinityMap[url].push(k);
						}
					}
				//}
			});
		});
	}
};

module.exports = AffinityProvider;

