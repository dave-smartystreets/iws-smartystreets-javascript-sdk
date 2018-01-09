const Response = require("./response");
// const Axios = require("axios");
const Axios = require("axios-proxy-fix");
const axiosRetry = require("axios-retry");
const Promise = require("promise");

class HttpSender {
	constructor(timeout = 10000, retries = 5, proxyConfig) {
		axiosRetry(Axios, {
			retries: retries,
		});
		this.timeout = timeout;
		this.proxyConfig = proxyConfig;
	}

	buildRequestConfig({payload, parameters, headers, baseUrl}) {
		let config = {
			method: "GET",
			timeout: this.timeout,
			params: Object.assign({}, parameters),
			headers: Object.assign({}, headers),
			baseURL: baseUrl,
			validateStatus: function (status) {
				return status < 500;
			}
		};

		if (payload) {
			config.method = "POST";
			config.data = payload;
		}

		if (this.proxyConfig) config.proxy = this.proxyConfig;
		return config;
	}

	buildSmartyResponse(response, error) {
		if (response) {
			return new Response(response.status, response.data);
		}
		return new Response(undefined, undefined, error)
	}

	send(request) {
		return new Promise((resolve, reject) => {
			let requestConfig = this.buildRequestConfig(request);

			Axios(requestConfig).then(response => {
				resolve(this.buildSmartyResponse(response));
			}, error => {
				reject(this.buildSmartyResponse(undefined, error));
			});
		});
	}
}

module.exports = HttpSender;