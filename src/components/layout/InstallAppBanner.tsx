import React, { useState } from 'react';
import { Smartphone, Download, X, Sparkles } from 'lucide-react';
import { usePwaInstallPrompt } from '../../hooks/usePwaInstallPrompt';

export const InstallAppBanner: React.FC = () => {
  const { isInstallable, isInstalled, promptInstall } = usePwaInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || !isInstallable || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/50 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xl animate-in slide-in-from-top-2">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-950">
          <Smartphone className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-white tracking-tight">Pasang Aplikasi TokoBASMALAH</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />Cepat
            </span>
          </div>
          <p className="text-[10px] text-slate-300 line-clamp-1">Akses katalog instan, hemat kuota & pesan cepat langsung dari layar HP</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          type="button"
          onClick={promptInstall}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow-md shadow-emerald-950/60 active:scale-95 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Pasang</span>
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
          title="Tutup banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
