// src/TokenBalance.tsx

import { useReadContract, useAccount } from "wagmi";
import { formatEther } from "viem"; // This will convert the big number

// --- PASTE YOUR VOTE TOKEN INFO HERE ---
const VOTE_TOKEN_ADDRESS = "0x9256279569fce723E5DCe853e4D8aF582BD3625D";

// ====================================================================
// --- CHANGE: I have pasted your full VoteToken ABI here ---
// ====================================================================
const VOTE_TOKEN_ABI = [
  {
    "inputs": [{"internalType": "address","name": "initialOwner","type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{"internalType": "address","name": "spender","type": "address"},{"internalType": "uint256","name": "allowance","type": "uint256"},{"internalType": "uint256","name": "needed","type": "uint256"}],
    "name": "ERC20InsufficientAllowance",
    "type": "error"
  },
  {
    "inputs": [{"internalType": "address","name": "sender","type": "address"},{"internalType": "uint256","name": "balance","type": "uint256"},{"internalType": "uint256","name": "needed","type": "uint256"}],
    "name": "ERC20InsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [{"internalType": "address","name": "approver","type": "address"}],
    "name": "ERC20InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [{"internalType": "address","name": "receiver","type": "address"}],
    "name": "ERC20InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [{"internalType": "address","name": "sender","type": "address"}],
    "name": "ERC20InvalidSender",
    "type": "error"
  },
  {
    "inputs": [{"internalType": "address","name": "spender","type": "address"}],
    "name": "ERC20InvalidSpender",
    "type": "error"
  },
  {
    "inputs": [{"internalType": "address","name": "owner","type": "address"}],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [{"internalType": "address","name": "account","type": "address"}],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true,"internalType": "address","name": "owner","type": "address"},{"indexed": true,"internalType": "address","name": "spender","type": "address"},{"indexed": false,"internalType": "uint256","name": "value","type": "uint256"}],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true,"internalType": "address","name": "previousOwner","type": "address"},{"indexed": true,"internalType": "address","name": "newOwner","type": "address"}],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true,"internalType": "address","name": "from","type": "address"},{"indexed": true,"internalType": "address","name": "to","type": "address"},{"indexed": false,"internalType": "uint256","name": "value","type": "uint256"}],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [{"internalType": "address","name": "owner","type": "address"},{"internalType": "address","name": "spender","type": "address"}],
    "name": "allowance",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "spender","type": "address"},{"internalType": "uint256","name": "value","type": "uint256"}],
    "name": "approve",
    "outputs": [{"internalType": "bool","name": "","type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "account","type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8","name": "","type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"}],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string","name": "","type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address","name": "","type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string","name": "","type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "value","type": "uint256"}],
    "name": "transfer",
    "outputs": [{"internalType": "bool","name": "","type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "from","type": "address"},{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "value","type": "uint256"}],
    "name": "transferFrom",
    "outputs": [{"internalType": "bool","name": "","type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "newOwner","type": "address"}],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
// --- END OF CONTRACT INFO ---

export function TokenBalance() {
  const { address } = useAccount();

  const { data: balance, isLoading } = useReadContract({
    address: VOTE_TOKEN_ADDRESS,
    abi: VOTE_TOKEN_ABI,
    functionName: "balanceOf",
    args: [address!],
    chainId: 5700,
    query: {
      enabled: !!address, 
      refetchInterval: 5000, 
    }
  });

  if (!address) return null;

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3 style={{ borderTop: "1px solid #374151", paddingTop: "1rem" }}>Your Vote Tokens:</h3>
      {isLoading && <p>Loading balance...</p>}
      {balance !== undefined && (
        <p style={{ fontSize: "1.5rem", fontWeight: "700", color: "#4a9bdeff" }}>
          {formatEther(balance as bigint)} VoteTokens
        </p>
      )}
    </div>
  );
}