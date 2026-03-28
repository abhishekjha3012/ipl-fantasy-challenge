interface StatsCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon: React.ReactNode;
  gradient: string;
  delay?: number;
}

export function StatsCard({ label, value, subtext, icon, gradient, delay = 0 }: StatsCardProps) {
  return (
    <div
      className="bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-xl border border-white/20 relative overflow-hidden transition-all hover:scale-105 active:scale-95 cursor-pointer"
      style={{
        animation: `slideUp 0.6s ease-out ${delay}s both`
      }}
    >
      <div className={`absolute inset-0 ${gradient} opacity-10`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/60 text-xs font-medium uppercase tracking-wide">
            {label}
          </span>
          {icon}
        </div>
        <div className="text-2xl font-bold text-white mb-1">
          {value}
        </div>
        {subtext && (
          <div className="text-xs text-white/50">{subtext}</div>
        )}
      </div>
    </div>
  );
}