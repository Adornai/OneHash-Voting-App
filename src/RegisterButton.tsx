import { useWriteContract, useReadContract, useAccount, useWaitForTransactionReceipt } from "wagmi";

const VOTING_CONTRACT_ADDRESS = import.meta.env.VITE_VOTING_CONTRACT_ADDRESS as `0x${string}`;

// Minimal ABI for registration
const VOTING_ABI = [
  { inputs: [], name: "register", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{name: "", type: "address"}], name: "isRegistered", outputs: [{name: "", type: "bool"}], stateMutability: "view", type: "function" }
] as const;

export function RegisterButton() {
  const { address } = useAccount();
  
  // 1. Check if the user is already registered
  const { data: isRegistered, refetch } = useReadContract({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_ABI,
    functionName: "isRegistered",
    args: [address!],
    query: { enabled: !!address }
  });

  // 2. Setup the write hook
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({ hash });

  if (isSuccess) {
    refetch(); // Refresh status after success
  }

  // --- STATE: ALREADY REGISTERED ---
  if (isRegistered) {
    return (
      <div className="p-3 mt-4 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center justify-center gap-2">
        <span className="text-green-400 text-xl">✅</span>
        <span className="text-green-400 font-semibold">Voter Status: Verified</span>
      </div>
    );
  }

  // --- STATE: NOT REGISTERED ---
  return (
    <div className="card fade-in-glow delay-1 mt-6 border-l-4 border-l-blue-500">
      <h3 className="text-xl font-bold text-white mb-2">New User Registration</h3>
      <p className="text-gray-400 mb-4 text-sm">
        You must register your wallet on the blockchain before the Admin can send you voting tokens.
      </p>
      
      <button 
        onClick={() => writeContract({
          address: VOTING_CONTRACT_ADDRESS,
          abi: VOTING_ABI,
          functionName: "register",
          args: [],
          chainId: 5700
        })}
        disabled={isPending || isWaiting}
        className="btn w-full bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
      >
        {isPending ? "Check Wallet..." : isWaiting ? "Registering..." : "✋ Register to Vote"}
      </button>
    </div>
  );
}