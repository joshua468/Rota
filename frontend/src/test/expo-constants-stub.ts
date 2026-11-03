export const ExecutionEnvironment = {
  Bare: 'bare',
  Standalone: 'standalone',
  StoreClient: 'storeClient',
} as const;

const Constants: {
  expoConfig: { hostUri?: string } | null;
  manifest2: { extra?: { expoClient?: { hostUri?: string } } } | null;
  executionEnvironment: string;
} = { expoConfig: null, manifest2: null, executionEnvironment: ExecutionEnvironment.Standalone };

export default Constants;
