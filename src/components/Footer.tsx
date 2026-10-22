import { Heart, Terminal } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 glass-panel py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <img
              src="/logo_johmann.png"
              alt="Logo Johmann Formation"
              className="w-10 h-10 object-contain shrink-0"
            />
            <div>
              <p className="text-sm font-bold text-white tracking-tight">Johmann Formation</p>
              <p className="text-xs text-slate-400">Projet React Vite + Tailwind CSS + PWA Ultra-Premium</p>
            </div>
          </div>

          {/* Tech Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-slate-300">
              React 19
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-slate-300">
              Vite 8
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-slate-300">
              Tailwind CSS v4
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-slate-300">
              PWA Offline
            </span>
          </div>

          {/* Terminal Command reminder */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-950/80 px-3 py-1.5 rounded-xl border border-white/5">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>npm run dev</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-500 flex items-center justify-center gap-1">
          <span>Conçu avec</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          <span>pour Johmann Formation. Prêt pour le déploiement et l'extension.</span>
        </div>
      </div>
    </footer>
  )
}
