// src/MintToken.tsx

import { useState } from "react";
import { useWriteContract, useAccount } from "wagmi";
import { parseEther } from "viem";

// --- USE THE VOTE TOKEN INFO HERE ---
const VOTE_TOKEN_ADDRESS = "0x9256279569fce723E5DCe853e4D8aF582BD3625D";
const VOTE_TOKEN_ABI = [
  // This is the first ABI you sent me (for VoteToken.sol)
  {
    "inputs": [{"internalType": "address", "name": "initialOwner", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  // ... ERC20 errors ...
  {
    "inputs": [{"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "mint", // <-- The function exists in this ABI!
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // ... and the rest of the VoteToken ABI ...
] as const;
// --- END OF CONTRACT INFO ---

export function MintToken() {
  const [mintAddress, setMintAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const { address } = useAccount();
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const handleMintToken = async () => {
    if (!mintAddress || !mintAmount) {
      alert("Please enter an address and amount");
      return;
    }
    writeContract({
      address: VOTE_TOKEN_ADDRESS,
      abi: VOTE_TOKEN_ABI,
      functionName: "mint",
      args: [mintAddress as `0x${string}`, parseEther(mintAmount)],
      chainId: 5700,
      account: address,
    });
  };

  return (
    <div className="admin-form" style={{ marginTop: "1rem" }}>
      <h3>Admin: Mint Tokens</h3>
      <input
        type="text"
        placeholder="Address to receive tokens"
        value={mintAddress}
        onChange={(e) => setMintAddress(e.target.value)}
        className="input-field"
        style={{ minWidth: "250px" }}
      />
      <input
        type="text"
        placeholder="Amount (1)"
        value={mintAmount}
        onChange={(e) => setMintAmount(e.target.value)}
        className="input-field"
        style={{ width: "100px" }}
      />
      <button onClick={handleMintToken} disabled={isPending} className="btn btn-admin">
        {isPending ? "Minting..." : "Mint Tokens"}
      </button>
      {isSuccess && <p style={{ color: "green", marginTop: "10px" }}>Tokens minted successfully!</p>}
      {error && <p style={{ color: "red" }}>Error: {error?.message}</p>}
    </div>
  );
}