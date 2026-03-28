import { X, Trophy } from 'lucide-react';

import { rules } from '../data/rules';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-xl rounded-2xl border-2 border-white/20 shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-white/10 border-b border-white/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="text-yellow-400" size={24} />
              <h2 className="text-xl font-bold text-white">League Rules</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
            <div className="space-y-3">
              {rules.map((rule, index) => (
                <div 
                  key={index}
                  className="flex gap-3 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                  style={{ animation: `slideUp 0.3s ease-out ${index * 0.05}s both` }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                    {rule}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white/10 border-t border-white/20 p-4">
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
