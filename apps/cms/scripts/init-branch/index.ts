import shell from "shelljs";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { getPreviewPgHostPoller } from "./get-pghost";
import { setPgHostPreview } from "./set-pghost";

const getArguments = async () => {
  const argv = await yargs(hideBin(process.argv)).option("branch", {
    alias: "b",
    type: "string",
    demandOption: true,
    describe: "The name for the feature branch",
  }).argv;

  return argv;
};

const pushBranch = async (branch: string) => {
  const { code: checkoutCode } = shell.exec(`git checkout -b ${branch}`);
  if (checkoutCode !== 0) {
    console.error(`git checkout failed with code ${checkoutCode}`);
    process.exit(checkoutCode);
  }

  const { code: commitCode } = shell.exec(
    'git commit --allow-empty -m "trigger deployment"'
  );
  if (commitCode !== 0) {
    console.error(`git commit failed with code ${commitCode}`);
    process.exit(commitCode);
  }

  const { code: pushCode } = shell.exec(
    `git push --set-upstream origin ${branch}`
  );
  if (pushCode !== 0) {
    console.error(`git push failed with code ${pushCode}`);
    process.exit(pushCode);
  }
};

const pullCmsPreviewEnv = async (branch: string) => {
  console.log("Pulling .env.preview from vercel...");
  const { code: pullEnvCode } = shell.exec(`
  vercel env pull .env.preview --environment preview --git-branch ${branch}`);
  if (pullEnvCode !== 0) {
    console.error(`Failed to pull .env.preview from vercel`);
    process.exit(pullEnvCode);
  }
};

const pullWebPreviewEnv = async (branch: string) => {
  const { code: pullEnvCode2 } = shell.exec(`
  cd ../web
  vercel env pull .env.preview --environment preview --git-branch ${branch}`);
  if (pullEnvCode2 !== 0) {
    console.error(`Failed to pull .env.preview from vercel`);
    process.exit(pullEnvCode2);
  }
};

const main = async () => {
  const { branch } = await getArguments();
  console.log("Creating a new feature branch...", branch);
  // await pushBranch(branch);
  // // delay 5 seconds
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  // await pullCmsPreviewEnv(branch);
  const pgHost = await getPreviewPgHostPoller(branch);
  await setPgHostPreview(branch, pgHost);
  await pullWebPreviewEnv(branch);
};

main().catch(console.error);
