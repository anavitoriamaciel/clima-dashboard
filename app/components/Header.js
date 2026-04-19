'use client'

export default function Header({ totalEstacoes, atualizadoEm }) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-sky-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-200">
              <span className="text-xl">⛅</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">
                Dashboard Meteorológico
              </h1>
              <p className="text-xs text-slate-500">
                Dados reais — API INMET / Open-Meteo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {totalEstacoes > 0 && (
              <span className="text-sm text-slate-500">
                <span className="font-bold text-sky-600">{totalEstacoes}</span> estações monitoradas
              </span>
            )}
            {atualizadoEm && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"></span>
                Atualizado {atualizadoEm}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
