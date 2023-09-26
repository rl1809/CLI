import { IncomingMessage, ServerResponse } from "http";
import { StringDecoder } from "string_decoder";
import chalk from "chalk";
export const handleLogRequest = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) => {
  let body = "";
  const decoder = new StringDecoder("utf-8");

  req.on("data", (chunk) => {
    body += decoder.write(chunk);
  });

  req.on("end", () => {
    body += decoder.end();

    try {
      const parsed = JSON.parse(body);

      // Log the parsed JSON data
      logEntry(parsed);

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("OK");
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid JSON format" }));
    }
  });
};

type Log = {
  level: string;
  message: string;
  context: string;
  timestamp: Date;
};
function logEntry(parsed: Log) {
  switch (parsed.level.toLowerCase()) {
    case "info":
      console.info(
        chalk.blue.bold(
          `[INFO] [${parsed.timestamp}] [${parsed.context}] - ${parsed.message}`
        )
      );
      break;
    case "warn":
      console.warn(
        chalk.yellow.bold(
          `[WARN] [${parsed.timestamp}] [${parsed.context}] - ${parsed.message}`
        )
      );
      break;
    case "error":
      console.error(
        chalk.red.bold(
          `[ERROR] [${parsed.timestamp}] [${parsed.context}] - ${parsed.message}`
        )
      );
      break;
    case "debug":
      console.debug(
        chalk.magenta.bold(
          `[DEBUG] [${parsed.timestamp}] [${parsed.context}] - ${parsed.message}`
        )
      );
      break;
    default:
      console.log(
        chalk.gray.bold(
          `[LOG] [${parsed.timestamp}] [${parsed.context}] - ${parsed.message}`
        )
      );
  }
}
