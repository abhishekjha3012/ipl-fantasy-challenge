
import { AVATAR_GRADIENTS } from '../utils/emptyData';
import { getInitials } from '../utils/leaderboard';
export function PlayerAvatar({ name, size = 'md', showName = false }) {
  
  // Generate consistent gradient based on name
  const getGradient = (name) => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${getGradient(name)} flex items-center justify-center font-bold text-white shadow-lg ring-2 ring-white/20`}
      >
        {getInitials(name)}
      </div>
      {showName && (
        <span className="text-white font-medium text-sm">{name}</span>
      )}
    </div>
  );
}
