import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createAppKit } from "@reown/appkit/react";
import { ChainId, configureRpcProviders } from "@swapr/sdk";
import { fallback, http } from "wagmi";
import { optimism } from "wagmi/chains";

const rpcEndpoint = (chain: string) =>
  `https://lb.drpc.org/${chain}/As_mVw7_50IPk85yNYubcezE_O23TT8R8JDnrqRhf0fE`;
const OPTIMISM_RPC = rpcEndpoint("optimism");

const projectId = import.meta.env.VITE_WC_PROJECT_ID;

configureRpcProviders({
  [ChainId.OPTIMISM_MAINNET]: OPTIMISM_RPC,
});

const wagmiAdapter = new WagmiAdapter({
  networks: [optimism],
  projectId,
  transports: {
    [optimism.id]: fallback([http(OPTIMISM_RPC), http("https://mainnet.optimism.io")]),
  },
});

export const config = wagmiAdapter.wagmiConfig;

createAppKit({
  adapters: [wagmiAdapter],
  networks: [optimism],
  projectId,
  features: {
    analytics: true,
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
