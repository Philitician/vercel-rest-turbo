import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

export type EnvironmentVariablesResult = {
  envs: EnvironmentVariable[];
};

export type EnvironmentVariable = {
  type: string;
  value: string;
  target: string[];
  configurationId: string;
  gitBranch: string;
  comment: string;
  id: string;
  key: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  updatedBy: string;
  decrypted: boolean;
  lastEditedByDisplayName: string;
};

const BASE_URL = "https://api.vercel.com/v9/projects";
const PROJECT_ID = process.env.PROJECT_ID;
const CMS_PROJECT_ID = process.env.CMS_PROJECT_ID;
const TOKEN = process.env.VERCEL_REST_TOKEN;

const getArguments = async () => {
  const argv = await yargs(hideBin(process.argv)).option("branch", {
    alias: "b",
    type: "string",
    demandOption: true,
    describe: "The name for the feature branch",
  }).argv;

  return argv;
};

const getCmsPreviewPgHost = async (branch: string) => {
  const searchParams = new URLSearchParams({
    gitBranch: branch,
  });
  const url = `${BASE_URL}/${CMS_PROJECT_ID}/env?${searchParams.toString()}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    method: "get",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch environment variables: ${res.statusText}`);
  }
  const data = (await res.json()) as EnvironmentVariablesResult | undefined;
  if (!data) {
    throw new Error("Failed to parse response");
  }
  const pgHost = data.envs.find((env) => env.key === "PGHOST");
  if (!pgHost) return { status: "error", message: "PGHOST not found" };
  return { status: "success", value: pgHost.value };
};

const getPreviewPgPoller = async (
  branch: string
): Promise<string | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const { status, value } = await getCmsPreviewPgHost(branch);
  if (status === "success") {
    console.log(`PGHOST for branch ${branch}: ${value}`);
    return value;
  }
  console.log("PGHOST not found. Retrying in 3 seconds...");
  return getPreviewPgPoller(branch);
};

const main = async () => {
  console.log("WEB: Getting arguments...");
  // const { branch } = await getArguments();
  // const pgHost = await getPreviewPgPoller(branch);
};

main().catch(console.error);
