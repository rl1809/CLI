import chalk from "chalk";
import { build } from "./build";
import * as http from "http";
import handler from "serve-handler";
import { handleLogRequest } from "../utils/handleLog";
import { getLocalNetworkAddress } from "../utils/localNetwork";
export const serve = async (options: any) => {
  await build({});

  const server = http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/log") {
      return handleLogRequest(req, res);
    } else {
      return handler(req, res, {
        cleanUrls: true,
        public: "stt",
        directoryListing: false,
        unlisted: [".*"],
      });
    }
  });
  const port = options.port ?? 8080;
  server.listen(port, () => {
    console.info(
      chalk.green.bold(`Server Running @ http://127.0.0.1:${port}/`)
    );
    const localAddress = getLocalNetworkAddress();
    if (localAddress) {
      console.info(
        chalk.green.bold(
          `Accessible on local network @ http://${localAddress}:${port}/`
        )
      );
    }

    console.info(
      chalk.green.bold(
        `Log Address @ http://127.0.0.1:${port}/log${
          localAddress ? ` & http://${localAddress}:${port}/log` : ""
        }`
      )
    );
    console.info(chalk.blue.bold("Hit CTRL-C to stop the server"));
  });
};
