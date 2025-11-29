import { useReadContract, useWriteContract, useSendTransaction } from "wagmi";
import { parseEther } from "viem";

const VOTING_CONTRACT_ADDRESS = import.meta.env.VITE_VOTING_CONTRACT_ADDRESS as `0x${string}`;
const VOTE_TOKEN_ADDRESS = import.meta.env.VITE_VOTE_TOKEN_ADDRESS as `0x${string}`;

const VOTING_ABI = [{ inputs: [], name: "getVoterList", outputs: [{ name: "", type: "address[]" }], stateMutability: "view", type: "function" }] as const;
const TOKEN_ABI = [{ inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }], name: "mint", outputs: [], stateMutability: "nonpayable", type: "function" }] as const;

export function VoterList() {
  const { data: voters } = useReadContract({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_ABI,
    functionName: "getVoterList",
    chainId: 5700,
    query: { refetchInterval: 5000 }
  });

  const { writeContract } = useWriteContract();
  const { sendTransaction } = useSendTransaction();

  return (
    <div className="card fade-in-glow delay-1">
      <h2 className="text-2xl font-bold text-green-400 mb-4 font-orbitron">Voter Queue</h2>
      {!voters || voters.length === 0 ? <p className="text-gray-500">No voters yet.</p> : (
        <ul className="space-y-2">
          {(voters as string[]).map((voter, index) => (
            <li key={index} className="bg-gray-800 p-3 rounded flex flex-wrap justify-between items-center gap-2">
              <span className="font-mono text-sm text-gray-300">{voter}</span>
              <div className="flex gap-2">
                <button onClick={() => writeContract({ address: VOTE_TOKEN_ADDRESS, abi: TOKEN_ABI, functionName: "mint", args: [voter as `0x${string}`, parseEther("100")], chainId: 5700 })} className="btn btn-admin text-xs py-1 px-3">🎁 Send 100 Tokens</button>
                <button onClick={() => sendTransaction({ to: voter as `0x${string}`, value: parseEther("0.01"), chainId: 5700 })} className="btn bg-purple-600 hover:bg-purple-700 text-xs py-1 px-3">⛽ Send Gas</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}