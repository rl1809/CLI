#!/usr/bin/env node

import { Command } from "commander";
import { build } from "./commands/build";
import { serve } from "./commands/serve";
import { getVersion } from "./utils/getDaisukeVersion";
const json = require("../package.json");

const program = new Command();

program.name("daisuke").description("Suwatte Dev Tools").version(json.version);

program
  .command("build")
  .alias("b")
  .description("Builds valid runners in project directory")
  .option("--noList", "Skips generating the runner list.")
  .action(build);

program
  .command("serve")
  .alias("s")
  .description("Builds & Serves a List on the local network")
  .option("-p, --port <string>", "Port server should run on.")
  .action(serve);

// TODO: Generate Command
// program
//   .command("generate <schematic> [name]")
//   .alias("g")
//   .action(generate)
//   .description("Generate a Standard Runner or Template Class");

program
  .version(getVersion(), "-v, --version", "Display the version number")
  .parse(process.argv);
