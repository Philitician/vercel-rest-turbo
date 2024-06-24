/**
 * This script does the following:
 * 1. Create a new feature branch from the current branch
 * 2. Commit an empty commit to trigger a deployment
 * 3. Push the feature branch to the remote repository
 * 4. Retrieve the environment variable 'PGHOST' from Vercel for preview branch with same name as the feature branch
 */

import { spawn } from "child_process";
import shell from "shelljs";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

const main = async () => {
  // add help option
  const argv = await yargs(hideBin(process.argv)).option("branch", {
    alias: "b",
    type: "string",
    demandOption: true,
    describe: "The name for the feature branch",
  }).argv;

  const { branch } = argv;

  console.log("Creating a new feature branch...", branch);

  // const { code: checkoutCode } = shell.exec(`git checkout -b ${branch}`);

  // if (checkoutCode !== 0) {
  //   console.error(`git checkout failed with code ${checkoutCode}`);
  //   process.exit(checkoutCode);
  // }

  // const { code: commitCode } = shell.exec(
  //   'git commit --allow-empty -m "trigger deployment"'
  // );
  // if (commitCode !== 0) {
  //   console.error(`git commit failed with code ${commitCode}`);
  //   process.exit(commitCode);
  // }

  // const { code: pushCode } = shell.exec(
  //   `git push --set-upstream origin ${branch}`
  // );
  // if (pushCode !== 0) {
  //   console.error(`git push failed with code ${pushCode}`);
  //   process.exit(pushCode);
  // }
};

main().catch(console.error);
