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
