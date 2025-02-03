import { DatadogSite, DatadogTransport } from "@rfx-exchange/datadog-logger";
import winston from "winston";

/// @dev can be expanded to provided better format and service supports
const createLogger = (apiKey: string | undefined) => {
  const transports = apiKey
    ? [
        new DatadogTransport({
          hostname: process.env.HOST || "GELATO",
          service: "serverless-keepers",
          site: DatadogSite.US5_COMMERCIAL,
          apiKey: apiKey,
        }),
        new winston.transports.Console(),
      ]
    : [new winston.transports.Console()];
  return winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: transports,
  });
};

export default createLogger;
