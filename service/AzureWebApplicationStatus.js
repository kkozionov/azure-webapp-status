"use strict";

var util = require("util");
var request = Promise.promisifyAll(require('request'));

var AzureWebApplicationStatus = {
	status: function (url, affinities) {
		return Promise.map(affinities, function (aff) {
			var j = request.jar();
			var cookie = request.cookie("ARRAffinity=" + aff);
			j.setCookie(cookie, url);
			return request.getAsync({
				url: url + '/api/test',
				jar: j
			}).then(function (res) {
				if (res.statusCode == 200) {
					var returnedAffinity = JSON.parse(res.body).data.affinity;
					if (returnedAffinity == aff) {
						return {"affinity": aff, healthy: true};
					} else {
						return {"affinity": aff, why: util.format("Returned wrong affinity = %s, expected = %s", returnedAffinity, aff), healthy: false};
					}
				} else {
					return {"affinity": aff, why:util.format("Status: %s", res.statusCode), healthy: false};
				}
			})
		}).then(function (results) {
			console.log("Results: %j", results);
			return results;
		});
	}
};

module.exports = AzureWebApplicationStatus;