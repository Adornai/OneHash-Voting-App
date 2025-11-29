// src/App.tsx

import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract } from "wagmi";
import { formatEther } from "viem";

// Import Components
import { AddCandidate } from "./AddCandidate";
import { MintToken } from "./MintToken";
import { VoteComponent } from "./VoteComponent";
import { TokenBalance } from "./TokenBalance";
import { CategoryTabs } from "./CategoryTabs";
import { VoterList } from "./VoterList";
import { RegisterButton } from "./RegisterButton";
import { AdminDashboard } from "./AdminDashboard";
import { Footer } from "./Footer";

// --- SAFER ENV VAR LOADING ---
// We use 'as string' first to avoid immediate crashes if undefined
const VOTING_CONTRACT_ADDRESS = (import.meta.env.VITE_VOTING_CONTRACT_ADDRESS || "") as `0x${string}`;
const ADMIN_ADDRESS = (import.meta.env.VITE_ADMIN_ADDRESS || "") as `0x${string}`;

const VOTING_CONTRACT_ABI = [
  {
    inputs: [{ name: "_category", type: "string" }],
    name: "getCandidatesForCategory",
    outputs: [{
      components: [
        { name: "name", type: "string" },
        { name: "party", type: "string" },
        { name: "imageUrl", type: "string" },
        { name: "voteCount", type: "uint256" },
        { name: "active", type: "bool" }
      ],
      name: "",
      type: "tuple[]"
    }],
    stateMutability: "view",
    type: "function"
  }
] as const;

type Candidate = {
  name: string;
  party: string;
  imageUrl: string;
  voteCount: bigint;
  active: boolean;
};

function App() {
  const { address } = useAccount();
  const [selectedCategory, setSelectedCategory] = useState("Presidential");

  // --- DEBUGGING LOGS ---
  // This will tell you in the browser console if your .env is broken
  useEffect(() => {
    if (!VOTING_CONTRACT_ADDRESS) console.error("CRITICAL ERROR: VITE_VOTING_CONTRACT_ADDRESS is missing in .env");
    if (!ADMIN_ADDRESS) console.error("CRITICAL ERROR: VITE_ADMIN_ADDRESS is missing in .env");
  }, []);

  // --- SAFER ADMIN CHECK ---
  // We explicitly check that both addresses exist before comparing
  const is_Admin = 
    address && 
    ADMIN_ADDRESS && 
    address.toLowerCase() === ADMIN_ADDRESS.toLowerCase();

  const { data: candidates, isLoading, refetch } = useReadContract({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    functionName: "getCandidatesForCategory",
    args: [selectedCategory],
    chainId: 5700,
    query: { refetchInterval: 5000, enabled: !!VOTING_CONTRACT_ADDRESS }
  });

  return (
    <div className="app-container">
      <header className="app-header fade-in-glow">
        <h1 className="app-header-title">One Hash 1#</h1>
        <ConnectButton />
      </header>

      <p className="intro-text fade-in-glow delay-1">
        System Initialized. Select an election category below to view candidates and cast your vote on the decentralized ledger.
      </p>

      {/* --- ADMIN SECTION --- */}
      {is_Admin && (
        <div className="space-y-8 mb-12 fade-in-glow delay-2">
          <AdminDashboard />
          <VoterList />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AddCandidate onCandidateAdded={refetch} />
            <MintToken />
          </div>
        </div>
      )}

      {/* --- USER SECTION --- */}
      {address && !is_Admin && (
        <div className="user-panel card fade-in-glow delay-2 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-green-400 mb-1">Voter Dashboard</h3>
            <p className="text-gray-500 text-xs font-mono">voters Address : {address}</p>
          </div>
          <div className="flex gap-4 items-center">
            <TokenBalance />
          </div>
          <RegisterButton />
        </div>
      )}

      <hr className="border-gray-800 my-8" />

      {/* --- VOTING SECTION --- */}
      <div className="fade-in-glow delay-3">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-white font-orbitron">Active Elections</h2>
        </div>
        
        <CategoryTabs selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        {isLoading ? (
          <div className="flex justify-center py-12"><div className="loader w-8 h-8 border-4"></div></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates && (candidates as Candidate[]).length > 0 ? (
              (candidates as Candidate[]).map((candidate, index) => (
                candidate.active && (
                  <div key={index} className="card group hover:border-green-500/40 transition-all duration-300 relative overflow-hidden">
                    
                    {/* Candidate Image */}
                    <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
                      <img 
                        src={candidate.imageUrl} 
                        alt={candidate.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-lg"
                        onError={(e) => {e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image"}}
                      />
                      <div className="absolute bottom-2 left-2">
                        <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                          {candidate.party}
                        </span>
                      </div>
                    </div>

                    {/* Candidate Info */}
                    <h3 className="text-xl font-bold text-white mb-1">{candidate.name}</h3>
                    
                    {/* Vote Count */}
                    <div className="bg-gray-900/60 p-3 rounded-lg mb-4 border border-gray-700 flex justify-between items-center">
                      <span className="text-gray-400 text-xs uppercase tracking-wider">Total Votes</span>
                      <span className="text-2xl font-bold text-green-400 font-orbitron">
                        {formatEther(candidate.voteCount)}
                      </span>
                    </div>

                    {/* Vote Component */}
                    {address ? (
                      <VoteComponent 
                        category={selectedCategory} 
                        candidateIndex={index} 
                        onVoteSuccess={refetch} 
                      />
                    ) : (
                      <p className="text-xs text-center text-gray-500 mt-4">Connect wallet to vote</p>
                    )}
                  </div>
                )
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
                <p className="text-gray-500">No candidates found for {selectedCategory}.</p>
                {is_Admin && <p className="text-sm text-green-400 mt-2">Use Admin Panel to add candidates.</p>}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default App;