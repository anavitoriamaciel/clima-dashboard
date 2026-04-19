'use client'

import { useState } from 'react'

export default function CitySearch({ estacoes, selecionadas, onToggle }) {
  const [busca, setBusca] = useState('')

  const normalizar = (str) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  const estacoesFiltered = estacoes.filter(e =>
    normalizar(e.nome).includes(normalizar(busca)) ||
    normalizar(e.uf).includes(normalizar(busca))
  )

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-sky-100 p-5">
      <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
        🔍 Selecionar Cidades
      </h2>

      <input
        type="text"
        value={busca}
        onChange={e => setBusca(e.target.value)}
        placeholder="Buscar cidade ou estado..."
        className="w-full border border-sky-100 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent placeholder:text-slate-400 mb-3 transition"
      />

      <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
        {estacoesFiltered.map(est => {
          const selected = selecionadas.some(s => s.codigo === est.codigo)
          return (
            <button
              key={est.codigo}
              onClick={() => onToggle(est)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between gap-2 ${
                selected
                  ? 'bg-sky-500 text-white font-medium shadow-sm shadow-sky-200'
                  : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <span>
                <span className="font-medium">{est.nome}</span>
                <span className={`ml-2 text-xs ${selected ? 'text-sky-100' : 'text-slate-400'}`}>
                  {est.uf}
                </span>
              </span>
              {selected && <span className="text-white">✓</span>}
            </button>
          )
        })}
        {estacoesFiltered.length === 0 && (
          <p className="text-slate-400 text-xs text-center py-4">Nenhuma estação encontrada</p>
        )}
      </div>

      <p className="text-xs text-slate-400 mt-3">
        {selecionadas.length} cidade{selecionadas.length !== 1 ? 's' : ''} selecionada{selecionadas.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}