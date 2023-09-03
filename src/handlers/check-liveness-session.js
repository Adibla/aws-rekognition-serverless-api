const { RekognitionClient, GetFaceLivenessSessionResultsCommand } = require("@aws-sdk/client-rekognition");
const ApiError = require("../exceptions/api-error");

const client = new RekognitionClient({});

const apiToken = process.env.API_TOKEN;

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'GET' || !event?.pathParameters?.sessionId) {
      throw new ApiError("Invalid Request", 400);
    }

    if (event?.headers?.Authorization !== apiToken) {
      throw new ApiError("Unauthorized", 401);
    }

    const input = {
      SessionId: event?.pathParameters?.sessionId,
    }

    const command = new GetFaceLivenessSessionResultsCommand(input);
    const sessionResult = await client.send(command);
    const response = {
      statusCode: 200,
      body: JSON.stringify(sessionResult),
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET"
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
