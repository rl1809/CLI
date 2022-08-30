import { build } from "./build";
import * as http from "http";
import handler from "serve-handler";
export const serve = (options: any) => {
  build();

  const server = http.createServer((req, res) => {
    return handler(req, res, {
      cleanUrls: true,
      public: "stt",
      directoryListing: false,
      rewrites: [{ source: "**", destination: "/runners.json" }],
      unlisted: [".*"],
    });
  });
  const port = options.port ?? 80;
  server.listen(port, () => {
    console.info(`Running on Port ${port}`);
    console.info("Hit CTRL-C to stop the server");
  });
};
