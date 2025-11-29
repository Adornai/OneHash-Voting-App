import { useState } from "react";
import { useWriteContract, useAccount } from "wagmi";


const VOTING_CONTRACT_ADDRESS = import.meta.env.VITE_VOTING_CONTRACT_ADDRESS as `0x${string}`;
const VOTING_CONTRACT_ABI = [{ inputs: [{ name: "_category", type: "string" }, { name: "_name", type: "string" }, { name: "_party", type: "string" }, { name: "_imageUrl", type: "string" }], name: "addCandidate", outputs: [], stateMutability: "nonpayable", type: "function" }] as const;

type AddCandidateProps = { onCandidateAdded: () => void };

export function AddCandidate({ onCandidateAdded }: AddCandidateProps) {
  const { address } = useAccount();
  const { writeContract, isPending, isSuccess } = useWriteContract();
  const [name, setName] = useState("");
  const [party, setParty] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("Presidential");

  const handleAdd = () => {
    if (!name || !party || !imageUrl) return alert("Please fill all fields");
    writeContract({
      address: VOTING_CONTRACT_ADDRESS,
      abi: VOTING_CONTRACT_ABI,
      functionName: "addCandidate",
      args: [category, name, party, imageUrl],
      chainId: 5700,
      account: address,
    }, { onSuccess: () => { onCandidateAdded(); setName(""); setParty(""); setImageUrl(""); } });
  };

  return (
    <div className="card fade-in-glow delay-2 border-t-4 border-orange-500">
      <h3 className="text-xl font-bold text-white mb-4 font-orbitron">Add Candidate</h3>
      <div className="grid grid-cols-1 gap-3">
        <label className="text-xs text-gray-400">Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field w-full">
          <option value="Presidential">Presidential Election</option>
          <option value="Governmental">Governmental Election</option>
          <option value="Private">Private Firms</option>
          <option value="School">School Election</option>
        </select>
        
        <input placeholder="Name (e.g. Tinubu)" value={name} onChange={(e) => setName(e.target.value)} className="input-field w-full" />
        <input placeholder="Party (e.g. APC)" value={party} onChange={(e) => setParty(e.target.value)} className="input-field w-full" />
        <input placeholder="Image URL (http...)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="input-field w-full" />
      </div>
      <button onClick={handleAdd} disabled={isPending} className="btn btn-admin w-full mt-4">{isPending ? "Adding..." : "Add to Blockchain"}</button>
      {isSuccess && <p className="text-green-400 text-center text-sm mt-2">Candidate Added!</p>}
    </div>
  );
}