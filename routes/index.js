var express = require('express');
var router = express.Router();

var AffinityProvider = require('../service/AffinityProvider');
var AzureWebApplicationStatus = require('../service/AzureWebApplicationStatus');
var config = require('../config/index');

router.get('/', function(req, res, next) {
	res.render('index', {config: config});
});

router.get('/app', function(req, res, next) {
	AffinityProvider.getAffinities().then(function (aff) {
		var url = 'https://app.sympli.io';
		AzureWebApplicationStatus.status(url, aff[url]).then(function (status) {
			res.render('status', {url: url, status: status});
		});
	});
});

router.get('/dev', function(req, res, next) {
	AffinityProvider.getAffinities().then(function (aff) {
		var url = 'https://dev.sympli.io';
		AzureWebApplicationStatus.status(url, aff[url]).then(function (status) {
			res.render('status', {url: url, status: status});
		});
	});
});

module.exports = router;
