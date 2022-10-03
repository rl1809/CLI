import * as path from "path";
import * as fs from "fs";
import * as fsExtra from "fs-extra";
import emulate from "@suwatte/emulator";
import { exec } from "shelljs";
type config = {
  noList?: any;
};
const TEMP_DIR = "__temp__";
const OUT_DIR = "stt";
export const build = (config: config = {}) => {
  const BASE_PATH = process.cwd();

  const tempDir = path.join(BASE_PATH, TEMP_DIR);
  const outDir = path.join(BASE_PATH, OUT_DIR);
  // Clear Temp Directory
  fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  // Transpile TS
  exec(`npx tsc --outdir ${TEMP_DIR}`);
  const runnerDir = path.join(tempDir, "runners");

  // Clear Out Dir
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  // Bundle with browserify
  bundle(outDir, runnerDir);

  if (!config.noList) {
    generateList(runnerDir, outDir);
  }
  // Delete Temp
  fs.rmSync(tempDir, { recursive: true, force: true });

  // Copy Assets
  const assetsDirectory = path.join(BASE_PATH, "assets");
  if (fsExtra.existsSync(assetsDirectory)) {
    const dest = path.join(outDir, "assets");
    fsExtra.copySync(assetsDirectory, dest, { overwrite: true });
  }
  console.log("Built Runners");
};

// Bundle with browserify
const bundle = (outDir: string, runnerDir: string) => {
  fs.readdirSync(runnerDir).forEach((folderName) => {
    const folderDir = path.join(runnerDir, folderName);
    const isDirectory = fs.statSync(folderDir).isDirectory();

    if (!isDirectory) {
      return;
    }

    const targetFile = path.join(folderDir, "index.js");
    const targetExists = fs.existsSync(targetFile);

    if (!targetExists) {
      return;
    }
    const runnersDir = path.join(outDir, "runners");
    fsExtra.ensureDir(runnersDir);
    const outPath = path.join(runnersDir, `${folderName}.stt`);

    exec(
      `npx browserify ${targetFile} -o ${outPath} -s STTPackage -x cheerio -x lodash -x he -x fs -x axios -x crypto-js -x moment`
    );
  });
  //
};

// Generates Runner List
const generateList = (runnerDir: string, outDir: string) => {
  const runners = fs.readdirSync(runnerDir).map((folderName) => {
    const targetFile = path.join(runnerDir, folderName, "index.js");
    const targetExists = fs.existsSync(targetFile);

    if (!targetExists) {
      return;
    }
    const sttPackage = require(targetFile);
    const target = sttPackage.Target;
    const runner = emulate(target);
    return { ...runner.info, path: folderName, type: runner.type };
  });

  let listName = "Runner List";
  const pathToPkgJS = path.join(process.cwd(), "package.json");

  if (fs.existsSync(pathToPkgJS)) {
    const pkgJSON = require(pathToPkgJS);
    if (pkgJSON.stt?.listName) {
      listName = pkgJSON.stt.listName;
    }
  }
  const list = {
    runners,
    listName,
  };
  const json = JSON.stringify(list);
  const outPath = path.join(outDir, "runners.json");
  fs.writeFileSync(outPath, json);
};
