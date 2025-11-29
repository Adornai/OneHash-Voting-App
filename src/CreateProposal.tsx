// src/CreateProposal.tsx

import { useState } from "react";
import { useWriteContract, useAccount } from "wagmi";

// --- USE THE VOTING CONTRACT INFO HERE ---
const VOTING_CONTRACT_ADDRESS = "0x1f17536a43312765C3c89107364022Dc34ca352c";
const VOTING_CONTRACT_ABI = [
  // This is the ABI for VotingContract.sol
  {
    "inputs": [{"internalType": "address", "name": "_tokenAddress", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "voter", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "proposalId", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "Voted",
    "type": "event"
  },
  {
    "inputs": [{"internalType": "string", "name": "_name", "type": "string"}],
    "name": "createProposal", 
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // ... make sure the rest of your VotingContract ABI is here ...
  {
    "inputs": [],
    "name": "getAllProposals",
    "outputs": [{"components": [{"internalType": "string", "name": "name", "type": "string"}, {"internalType": "uint256", "name": "voteCount", "type": "uint256"}], "internalType": "struct VotingContract.Proposal[]", "name": "", "type": "tuple[]"}],
    "stateMutability": "view",
    "type": "function"
  }
  // etc.
] as const;
// --- END OF CONTRACT INFO ---


// ==========================================================
// --- FIX #1: Define the "props" this component accepts ---
// This tells TypeScript that App.tsx is allowed to pass
// a function called "onProposalCreated" to this component.
// ==========================================================
type CreateProposalProps = {
  onProposalCreated: () => void;
};


// ==========================================================
// --- FIX #2: Accept the new 'onProposalCreated' prop ---
// We update the function to receive the props.
// ==========================================================
export function CreateProposal({ onProposalCreated }: CreateProposalProps) {
  const [proposalName, setProposalName] = useState("");
  const { address } = useAccount();
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const handleCreateProposal = async () => {
    if (!proposalName) {
      alert("Please enter a candiate name");
      return;
    }
    
    // ==========================================================
    // --- FIX #3: Call the prop on success ---
    // We add the 'onSuccess' callback to writeContract.
    // This will run when your transaction is confirmed on the
    // blockchain, and it will call the 'refetch' function
    // from App.tsx.
    // ==========================================================
    writeContract({
      address: VOTING_CONTRACT_ADDRESS,
      abi: VOTING_CONTRACT_ABI,
      functionName: "createProposal",
      args: [proposalName],
      chainId: 5700,
      account: address,
    }, 
    {
      onSuccess: () => {
        console.log("Candiate created! Refetching list...");
        onProposalCreated(); // This calls 'refetch'
        setProposalName(""); // Clear the input box
      }
    });
  };

  return (
    <div className="admin-form" style={{ marginTop: "1rem" }}>
      <h3>Admin: Create Candiates</h3>
      <input
        type="text"
        placeholder="Candiate Name"
        value={proposalName}
        onChange={(e) => setProposalName(e.target.value)}
        className="input-field"
      />
      <button onClick={handleCreateProposal} disabled={isPending} className="btn btn-admin">
        {isPending ? "Creating..." : "Create Candiate"}
        
      </button>

      {/* I updated this text to be more accurate */}
      {isSuccess && <p style={{ color: "green" }}>Candiate submitted! List will update upon confirmation.</p>}
      {error && <p style={{ color: "green", marginTop: "10px" }}>Error: {error?.message}</p>}
    </div>
  );
}