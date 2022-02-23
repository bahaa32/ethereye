# EtherEye
An HTTP server used to keep an eye on gas prices for Ethereum.

## Usage
 - `/gas`
 Returns current fast, average, and low price in Gwei.
 Example response:
 ```json
{"error": false, "message": { "fast": 121, "average": 62, "low": 35, "blockNum": 14263482 }}
 ```
- `/average?fromTime=<ut>&toTime=<ut>` Returns average gas price (average of recorded fast, average, and low in time period, averaged) recorded between two unix timestamps.
Example response:
```json
{"error": false, "message": { "averageGasPrice": 337, "fromTime": 123, "toTime": 1645461834 }}
```

## Setup
1. Copy `.env.example` to `.env` and replace the username and password to the desired credentials to the MongoDB database along with the database name (which will run in Docker, not a pre-existing database).
2. Adjust `FETCH_INTERVAL` to configure how frequently the server reaches out to EthGasStation for new predictions (in seconds).
3. Run `docker-compose -f docker-compose.prod.yml up` to run in production mode.
    - If you would like to run in development mode, run `docker-compose up` instead. This will watch and reload the code on changes and will enable debug logs.

## Decisions & Reasoning
- MongoDB isn't configured to store a log file on disk since Docker's `log` command reads from stdout (which MongoDB is logging to)
- EthGasStation.info was utilized because it does not require an API key
- All numbers returned from this API use Gwei to measure price of gas and 
- Average is rounded since the example response in the challenge had integers.

## Troubleshooting
- If you are having issues with running the server or if you made changes and they don't appear on production mode try running `docker-compose build` to rebuild the Docker image for the server.

## Other notes
There are a few things that I would add before going to production with this:
- Automatically catching exceptions server-wide and handling them like the API endpoints handle them.
- Inquire about the usage of this API and consider returning cached responses if EthGasStation API is unavailable or a price was fetched within x seconds.
- While there are error strings, ideally I would include stable machine-readable error codes to ease development for users of the API and minimize required changes.
- Most importantly, I'd write tests for this code. If the API is going live it wouldn't be fun to know it's broken in production. However, I have not used Typescript before this challenge and did not have the time to explore testing.
