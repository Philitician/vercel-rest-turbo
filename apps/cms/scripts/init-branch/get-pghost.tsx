import { EnvironmentVariablesResult } from "./types";

const BASE_URL = "https://api.vercel.com/v9/projects";
const CMS_PROJECT_ID = process.env.CMS_PROJECT_ID;
const TOKEN = process.env.VERCEL_REST_TOKEN;

type GetCmsPreviewPgHostResult =
  | {
      status: "error";
      message: string;
    }
  | {
      status: "success";
      value: string;
    };

const getCmsPreviewPgHost = async (
  branch: string
): Promise<GetCmsPreviewPgHostResult> => {
  const searchParams = new URLSearchParams({
    gitBranch: branch,
  });
  const url = `${BASE_URL}/${CMS_PROJECT_ID}/env?${searchParams.toString()}`;
  console.log(`Fetching PGHOST for branch ${branch}...`, url, TOKEN);
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

export const getPreviewPgHostPoller = async (
  branch: string
): Promise<string> => {
  console.log("Polling for PGHOST...");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const result = await getCmsPreviewPgHost(branch);
  if (result.status === "error") {
    console.log("PGHOST not found. Retrying in 3 seconds...");
    return getPreviewPgHostPoller(branch);
  }
  console.log(`PGHOST for branch ${branch}: ${result.value}`);
  return result.value;
};
