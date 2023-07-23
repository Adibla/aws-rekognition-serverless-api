const { RekognitionClient, CompareFacesCommand } = require("@aws-sdk/client-rekognition");
const ApiError = require("../exceptions/api-error");
const client = new RekognitionClient({});
const apiToken = process.env.API_TOKEN;

exports.handler = async (event) => {
	try {
		if (event?.httpMethod !== 'POST' || !event.body) {
			throw new ApiError("Invalid Request", 400);
		}

		if (event?.headers?.Authorization !== apiToken) {
			throw new ApiError("Unauthorized", 401);
		}

		let body = JSON.parse(event.body)
		const input = {
			SourceImage: {
				Bytes: new Buffer.from(body?.source, "base64"),
			},
			TargetImage: {
				Bytes: new Buffer.from(body?.target, "base64"),
			}
		}
		const command = new CompareFacesCommand(input);
		const comparisonResult = await client.send(command);

		const response = {
			statusCode: 200,
			body: JSON.stringify(comparisonResult)
		};
		return response;
	}
	catch (err) {
		const response = {
			statusCode: err?.code || err?.$metadata?.httpStatusCode || 500,
			body: JSON.stringify({
				message: err?.message || "Generic Error"
			})
		};
		return response;
	}
};
