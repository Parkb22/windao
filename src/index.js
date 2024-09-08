import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { createConfig, WagmiConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// You need to replace 'YOUR_PROJECT_ID' with a valid WalletConnect Project ID.
// Get it from: https://cloud.walletconnect.com
const projectId = 'YOUR_PROJECT_ID';

const queryClient = new QueryClient();

const chains = [mainnet, sepolia];

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: projectId,
  chains: chains,
});

ReactDOM.render(
  <WagmiConfig config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider chains={chains}>
        <App />
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiConfig>,
  document.getElementById('root')
);
