

export function Footer() {
  return (
    <footer className="app-footer fade-in-glow delay-3 mt-12 border-t border-gray-800 pt-8 pb-8">
      <br />
      <hr></hr>
      <div className="flex flex-col items-center justify-center space-y-2">
        <p className="text-gray-500 text-sm font-mono tracking-widest uppercase">
          Secured by Syscoin Blockchain
        </p>
        <p className="text-gray-600 text-xs">
          Decentralized Voting System © 2025
        </p>
        <div className="flex space-x-4 mt-4">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-green-500 text-xs">System Online 🟢</span>
        </div>
      </div>
    </footer>
  );
}