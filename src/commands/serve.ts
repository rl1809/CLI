import chalk from "chalk";
import { build } from "./build";
import * as http from "http";
import handler from "serve-handler";
export const serve = async (options: any) => {
  await build({});

  const server = http.createServer((req, res) => {
    return handler(req, res, {
      cleanUrls: true,
      public: "stt",
      directoryListing: false,
      unlisted: [".*"],
    });
  });
  const port = options.port ?? 8080;
  server.listen(port, () => {
    console.info(chalk.green.bold(`Serving on Port ${port}`));
    console.info(chalk.blue.bold("Hit CTRL-C to stop the server"));
  });
};
