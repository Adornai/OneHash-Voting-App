import { useState, useEffect } from "react";
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";

const VOTE_TOKEN_ADDRESS = import.meta.env.VITE_VOTE_TOKEN_ADDRESS as `0x${string}`;
const VOTING_CONTRACT_ADDRESS = import.meta.env.VITE_VOTING_CONTRACT_ADDRESS as `0x${string}`;

// ABI for Approve
const VOTE_TOKEN_ABI = [
  { inputs: [{ name: "spender", type: "address" }, { name: "value", type: "uint256" }], name: "approve", outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" }
] as const;

// NEW ABI for Vote (Takes Category + Index)
const VOTING_CONTRACT_ABI = [
  { inputs: [{ name: "_category", type: "string" }, { name: "_candidateIndex", type: "uint256" }, { name: "_amount", type: "uint256" }], name: "vote", outputs: [], stateMutability: "nonpayable", type: "function" }
] as const;

type VoteComponentProps = {
  category: string;       // <-- We need this now
  candidateIndex: number; // <-- We need this now
  onVoteSuccess: () => void;
};

export function VoteComponent({ category, candidateIndex, onVoteSuccess }: VoteComponentProps) {
  const { address } = useAccount();
  const [isApproved, setIsApproved] = useState(false);
  const voteAmount = "1"; // 1 Token = 1 Vote

  // Approve Hooks
  const { writeContract: approve, data: approveHash, isPending: isApproving } = useWriteContract();
  const { isLoading: isWaitingForApprove, isSuccess: isApproveConfirmed } = useWaitForTransactionReceipt({ hash: approveHash });

  // Vote Hooks
  const { writeContract: vote, data: voteHash, isPending: isVoting } = useWriteContract();
  const { isLoading: isWaitingForVote, isSuccess: isVoteConfirmed } = useWaitForTransactionReceipt({ hash: voteHash });

  // 1. Approve Function
  const handleApprove = () => approve({
    address: VOTE_TOKEN_ADDRESS,
    abi: VOTE_TOKEN_ABI,
    functionName: "approve",
    args: [VOTING_CONTRACT_ADDRESS, parseEther(voteAmount)],
    chainId: 5700,
    account: address,
  });

  // 2. Vote Function
  const handleVote = () => vote({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    functionName: "vote",
    args: [category, BigInt(candidateIndex), parseEther(voteAmount)], // <-- Passing Category & Index
    chainId: 5700,
    account: address,
  });

  // Effects
  useEffect(() => { if (isApproveConfirmed) setIsApproved(true); }, [isApproveConfirmed]);
  useEffect(() => { if (isVoteConfirmed) { onVoteSuccess(); setIsApproved(false); } }, [isVoteConfirmed, onVoteSuccess]);

  const isLoading = isApproving || isWaitingForApprove || isVoting || isWaitingForVote;

  return (
    <div className="mt-4">
      <div className="flex gap-2">
        <button 
          onClick={handleApprove} 
          disabled={isLoading} 
          className="btn btn-approve flex-1 text-xs"
        >
          {isWaitingForApprove ? "Approving..." : "1. Approve"}
        </button>
        
        <button 
          onClick={handleVote} 
          disabled={!isApproved || isLoading}
          className="btn btn-vote flex-1 text-xs"
        >
          {isWaitingForVote ? "Voting..." : "2. Vote"}
        </button>
      </div>

      {/* Loading Status */}
      <div className="mt-2 min-h-[20px]">
        {isLoading && (
          <div className="flex items-center gap-2 justify-center">
            <div className="loader w-4 h-4 border-2"></div>
            <span className="text-gray-400 text-xs">Processing...</span>
          </div>
        )}
        {isApproveConfirmed && isApproved && !isLoading && <p className="text-green-400 text-xs text-center">Approved! Click Vote.</p>}
        {isVoteConfirmed && !isLoading && <p className="text-green-400 text-xs text-center">Vote Cast!</p>}
      </div>
    </div>
  );
}