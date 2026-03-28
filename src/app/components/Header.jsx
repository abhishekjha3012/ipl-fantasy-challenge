import { useState } from 'react';
import { Trophy, Info } from 'lucide-react';
import { RulesModal } from './RulesModal';

export function Header({ isLoading, completedMatches }) {
    const [isRulesOpen, setIsRulesOpen] = useState(false);

    return (
        <>
            <div
            className="text-center pt-6 pb-2 relative"
            style={{ animation: 'slideUp 0.6s ease-out 0s both' }}
            >
            {/* Info Icon - Top Right */}
            <button
                onClick={() => setIsRulesOpen(true)}
                className="absolute top-6 right-0 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full p-2 transition-all hover:scale-110 active:scale-95"
                aria-label="View league rules"
            >
                <Info size={20} className="text-white" />
            </button>

            <div className="flex items-center justify-center gap-3 mb-2">
                <Trophy className="text-yellow-400 drop-shadow-lg" size={36} />
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">IPL Fantasy</h1>
            </div>
            <p className="text-blue-200 text-sm">League Dashboard 2026</p>
            <div className="mt-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 inline-block border border-white/20">
                <p className="text-white text-xs flex flex-col sm:flex-row items-center sm:gap-2 justify-center">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="font-semibold">{isLoading ? 'Loading matches...' : `Match ${completedMatches}`}</span>
                <span>of 75 completed</span>
                </p>
                </div>
            </div>
            {/* Rules Modal */}
            <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
        </>
    );
}