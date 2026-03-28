interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

const AVATAR_GRADIENTS = [
  'from-pink-500 to-rose-500',
  'from-purple-500 to-indigo-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-yellow-500 to-orange-500',
  'from-red-500 to-pink-500',
  'from-indigo-500 to-purple-500',
  'from-cyan-500 to-blue-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-red-500',
  'from-fuchsia-500 to-pink-500',
  'from-teal-500 to-cyan-500',
];

export function PlayerAvatar({ name, size = 'md', showName = false }: AvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate consistent gradient based on name
  const getGradient = (name: string) => {
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
