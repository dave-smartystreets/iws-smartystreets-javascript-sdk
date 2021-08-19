const Errors = require("../Errors");
const Request = require("../Request");
const Promise = require("promise");
const Suggestion = require("./Suggestion");

class Client {
	constructor(sender) {
		this.sender = sender;
	}

	send(lookup) {
		if (typeof lookup === "undefined") throw new Errors.UndefinedLookupError();

		let request = new Request();
		request.parameters = {
			search: lookup.search,
			country: lookup.country,
		};

		return new Promise((resolve, reject) => {
			this.sender.send(request)
				.then(response => {
					if (response.error) reject(response.error);

					lookup.result = buildSuggestionsFromResponse(response.payload);
					resolve(response);
				})
				.catch(reject);
		});

		function buildSuggestionsFromResponse(payload) {
			if (payload.response === null) return [];

			return payload.response.map(suggestion => new Suggestion(suggestion));
		}
	}
}

module.exports = Client;