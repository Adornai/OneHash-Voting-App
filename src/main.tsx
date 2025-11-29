// src/main.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import '@rainbow-me/rainbowkit/styles.css';
// --- FIX: Added 'type' before Chain ---
import { RainbowKitProvider, getDefaultConfig, type Chain } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// --- 1. DEFINE SYSCOIN TESTNET MANUALLY ---
const syscoinTestnet = {
  id: 5700,
  name: 'Syscoin Tanenbaum',
  iconUrl: 'https://syscoin.org/images/syscoin-logo.svg',
  iconBackground: '#fff',
  nativeCurrency: { name: 'Syscoin', symbol: 'tSYS', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.tanenbaum.io'] },
    public: { http: ['https://rpc.tanenbaum.io'] },
  },
  blockExplorers: {
    default: { name: 'Syscoin Explorer', url: 'https://tanenbaum.io' },
  },
} as const satisfies Chain;

// --- 2. UPDATE CONFIG ---
const config = getDefaultConfig({
  appName: 'Syscoin Voting dApp',
  // Make sure this variable exists in your .env
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  
  // Use the Syscoin chain we defined above
  chains: [syscoinTestnet],
  
  ssr: false, 
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)