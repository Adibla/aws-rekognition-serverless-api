## Serverless API for Liveness Detection and Face Comparison

This API project consists of three Lambda functions that leverage AWS Face Recognition services:

1. **init-liveness-session**: This function initiates a liveness session and returns a unique session ID. The session will disconnect after a specified amount of time, after which the session can be retrieved using the session ID.
2. **check-liveness-session**: This function retrieves the result of a liveness session based on the session ID.
3. **face-comparison**: This function compares two images using the AWS Face Comparison service and returns a similarity score.

### Infrastructure

The AWS SAM template defines a serverless architecture consisting of the following resources:

* Three AWS Lambda functions
* An API Gateway
* Two Amazon S3 buckets

The Lambda functions are responsible for handling the API requests and performing the required operations, such as initiating a liveness session, retrieving the session result, and comparing two images. The API Gateway is used to expose the Lambda functions as a RESTful API, handling the routing and security of incoming requests. The Amazon S3 buckets are used to store the images and session data.

### Parameters

The following parameters can be set using SAM:

* `ApiRateLimitRequest`: This parameter sets the maximum number of requests that can be made per unit of time.
* `ApiBurstLimitRequest`: This parameter sets a higher limit on the number of requests that can be made within a short period of time, allowing for occasional spikes in traffic.
* `ApiMonthLimitRequest`: This parameter sets the maximum number of requests that can be made per month.
* `tempApiToken`: This parameter sets a temporary API token used to protect endpoints for a short time before moving to API Gateway authentication.
* `Environment`: This parameter sets the environment (development, production, or staging) in which the API is deployed.

### Setup

To deploy this project, follow these steps:

1. Clone the repository and navigate to the project directory.
2. Install the AWS CLI and AWS SAM CLI.
3. Run `sam build` to build the Lambda functions.
4. Run `sam deploy --guided` to deploy the API to your AWS account.

### Usage
To use the API, send a request to one of the endpoints using an HTTP client. Here are some examples:

### Starting a new session

1. Send a POST request to the "init session" endpoint:
   `````
   POST http://api-gateway/session
   
   {
     "clientRequestToken": "random-string-generated-by-client"
   }
   ```

2. The API will respond with the session ID:
   ````
   {
     "SessionId": "session-id-generated-by-api"
   }
   ````

3. Use the session ID to make subsequent requests to the API.

### Comparing two images

1. Encode the two images you want to compare in base64.
2. Send a POST request to the "comparison" endpoint with the encoded images in the request body:
   ````
   POST [http://api-gateway/compare ↗]()
   
   {
     "source": "base64-encoded-source-image",
     "target": "base64-encoded-target-image"
   }
   ````
3. The API will respond with the result of the comparison:
   ````
   {
     "comparisonResult": 0.75
   }
   ````

### Checking the status of a session

1. Send a GET request to the "check session" endpoint with the session ID:
   ````
   GET [http://api-gateway/session/:sessionId ↗]()
   
   ````
2. The API will respond with the status of the session:
   ````
   {
     "clientRequestToken": "random-string-generated-by-client",
     "status": "processing",
     "comparisonResult": null
   }
   ````

### Security

This API is secured using AWS IAM roles and policies. The IAM roles associated with the Lambda functions restrict access to the specific AWS services they require. Additionally, the API is deployed using HTTPS to ensure secure communication.

The API currently uses a static token for authentication, which can be set using a dedicated parameter in the SAM template. To use the token, include it in the `Authorization` header of your API requests as `Bearer {TOKEN_VALUE}`.

### Building and Publishing

To build the Lambda functions, run the following command:

```
sam build
```

To publish the API, run the following command:

```
sam deploy --guided
```

This will guide you through the deployment process, including setting the deployment region, stack name, and other configuration options.

When deploy is completed, you can check API Gateway endpoint from console output

### TODO

These are the tasks that still need to be completed to improve the project:

- Add tests to verify the application locally
- Improve input filters for incoming payloads
- Add more optional resources to the SAM template
- Integrate authentication mechanisms internal to the infrastructure as an alternative to static tokens

### Conclusion

This AWS SAM API project demonstrates how to leverage AWS Recognitions services to perform session-based liveness detection and image comparison. It can be used as a starting point for building more complex applications that require biometric authentication and verification.



