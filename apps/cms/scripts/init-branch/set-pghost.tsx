import { BASE_URL } from "./utils";

const WEB_PROJECT_ID = process.env.WEB_PROJECT_ID;
const TOKEN = process.env.VERCEL_REST_TOKEN;

export const setPgHostPreview = async (branch: string, pgHost: string) => {
  const searchParams = new URLSearchParams({
    upsert: "true",
  });
  const url = `${BASE_URL}/${WEB_PROJECT_ID}/env?${searchParams.toString()}`;
  const res = await fetch(url, {
    body: JSON.stringify({
      key: "PGHOST",
      value: pgHost,
      type: "plain",
      target: ["preview"],
      gitBranch: branch,
    }),
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    method: "post",
  });
  if (!res.ok) {
    throw new Error(`Failed to set environment variables: ${res.statusText}`);
  }
};
