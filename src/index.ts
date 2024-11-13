#!/usr/bin/env node
import { Command } from "commander";
import execa from "execa";
import { readFileSync } from "fs";
import handleExample from "./example";

const bootstrap = () => {
  const packageJson = JSON.parse(
    readFileSync(`${__dirname}/../package.json`, "utf8"),
  );

  const program = new Command();
  program
    .version(
      packageJson.version,
      "-v, --version",
      "Output the current version.",
    )
    .usage("<command> [options]")
    .helpOption("-h, --help", "Output usage information.")
    .option("-s, --source <source-path>", "specify a custom source of plugins")
    .option(
      "-b, --branch <source-git-branch>",
      "specify a custom branch in source of plugins",
    )
    .option(
      "-o, --preset <preset-name>",
      "specify a preset to use for the project",
    )
    .option(
      "-l, --lucky",
      "use this option to generate a project with random answers",
    )
    .option(
      "-e, --example <example> [destination]",
      "get a clone of an example from the uhuu-starter repository",
    )
    .option(
      "-d, --download <download>",
      "specify a download type (zip | git) of source",
      "zip",
    )
    .option("-p, --project <project-name>", "specify a project type to use")
    .option("--disable-telemetry", "disable telemetry data collection")
    .allowUnknownOption(true)
    .allowExcessArguments(true)
    .action(async (_, command: Command) => {
      try {

        // --example
        if (command.getOptionValue("example")) {
          handleExample(command.getOptionValue("example"), command.args[0]);
          return;
        }
      
      } catch (err) {}
    });

  program.parse(process.argv);
};

bootstrap();
