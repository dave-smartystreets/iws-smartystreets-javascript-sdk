const chai = require("chai");
const SmartySDK = require("../../index.js");
const SmartyCore = SmartySDK.core;
const expect = chai.expect;
const Lookup = require("../../src/international_address_autocomplete/Lookup.js");

describe("Dave's test", () => {
	it("Real test with real authId and authToken - do not commit to repo", () => {

		// !!!!!!!!!!!!!!! do not commit real credentials to repo !!!!!!!!!
		const credentials = new SmartyCore.StaticCredentials(
			"",
			""
		);
		// !!!!!!!!!!!!!!! do not commit real credentials to repo !!!!!!!!!

		const clientBuilder = new SmartyCore.ClientBuilder(credentials).withLicenses(["international-autocomplete-cloud"])
		const client = clientBuilder.buildInternationalAddressAutocompleteClient();

		(async () => {
			const handleRequest = async (lookup) => {
				try {
					const results = await client.send(lookup);

					console.log("results", results);

					return results;
				} catch(err) {
					console.log(err)
				}
			};

			const lookup = new Lookup(
				"300+ROSLYN+RD",
				"CAN",
				undefined,
				"",
				"",
				"",
				true
				);
			const results = await handleRequest(lookup);
		})();

		expect("").to.equal("");
	});
});
