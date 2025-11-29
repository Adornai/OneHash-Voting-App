import { useAccount, useBalance, useReadContract } from "wagmi";
import { formatEther } from "viem";

const VOTE_TOKEN_ADDRESS = import.meta.env.VITE_VOTE_TOKEN_ADDRESS as `0x${string}`;
const TOKEN_ABI = [{ inputs: [{ name: "account", type: "address" }], name: "balanceOf", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" }] as const;

export function AdminDashboard() {
  const { address } = useAccount();
  const { data: ethBalance } = useBalance({ address });
  const { data: tokenBalance } = useReadContract({
    address: VOTE_TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: !!address }
  });

  if (!address) return null;

  return (
    <div className="card fade-in-glow" style={{ border: "1px solid #d97706" }}>
      <h2 style={{ color: "#fbbf24", marginBottom: "1rem", fontFamily: "'Orbitron', sans-serif" }}>Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900/50 p-3 rounded-lg">
          <label className="text-xs text-gray-400">Gas Balance (SysCoin)</label>
          <div className="text-xl font-bold text-white">{ethBalance ? parseFloat(formatEther(ethBalance.value)).toFixed(4) : "0.00"}</div>
        </div>
        <div className="bg-gray-900/50 p-3 rounded-lg">
          <label className="text-xs text-gray-400">VoteTokens Available</label>
          <div className="text-xl font-bold text-green-400">{tokenBalance ? formatEther(tokenBalance) : "0"}</div>
        </div>
      </div>
    </div>
  );
}