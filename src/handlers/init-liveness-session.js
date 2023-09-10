const { RekognitionClient, CreateFaceLivenessSessionCommand } = require("@aws-sdk/client-rekognition");

const client = new RekognitionClient({});
const apiToken = process.env.API_TOKEN;
const ApiError = require("../exceptions/api-error");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST" || !event.body) {
      throw new ApiError("Invalid Request", 400);
    }

    if (event?.headers?.Authorization !== apiToken) {
      throw new ApiError("Unauthorized", 401);
    }

    let body = JSON.parse(event.body);

    const input = {
      ClientRequestToken: body?.clientRequestToken,
    };
    const command = new CreateFaceLivenessSessionCommand(input);
    const responseSession = await client.send(command);
    const response = {
      statusCode: 200,
      body: JSON.stringify(responseSession),
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST"
      }
    };
    return response;
  }
  catch (err) {
    const response = {
      statusCode: err?.code || err?.$metadata?.httpStatusCode || 500,
      body: JSON.stringify({
        message: err?.message || "Generic error"
      })
    };
    return response;
  }


}
