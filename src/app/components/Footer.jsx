import React from 'react';

export function Footer() {
  return (
    <footer className="mt-6 text-center text-white/70 text-xs sm:text-sm border-t border-white/10 pt-4 pb-4">
      <p>
        IPL Fantasy Challenge • Data sourced from npoint.io (2025) •
        Built with React
      </p>
      <p className="mt-1 text-white/50">© {new Date().getFullYear()} IPL Fantasy.</p>
    </footer>
  );
}
