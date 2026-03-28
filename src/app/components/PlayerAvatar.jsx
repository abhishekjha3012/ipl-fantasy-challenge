
import { AVATAR_GRADIENTS } from '../data/emptyData';
import { getInitials } from '../utils/leaderboard';

export function PlayerAvatar({ name }) {
  
  // Generate consistent gradient based on name
  const getGradient = (name) => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-10 h-10 text-sm rounded-full bg-gradient-to-br ${getGradient(name)} flex items-center justify-center font-bold text-white shadow-lg ring-2 ring-white/20`}
      >
        {getInitials(name)}
      </div>
    </div>
  );
}
