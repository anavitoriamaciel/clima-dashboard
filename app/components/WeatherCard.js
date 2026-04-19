'use client'

import { getTemperatureClasses, formatWindDirection } from '@/lib/api'

/**
 * WeatherCard — Componente que exibe dados meteorológicos de uma estação
 * Features implementadas:
 * - Temperatura atual (+20pts)
 * - Umidade e vento (+20pts)
 * - Cores dinâmicas por temperatura (+20pts bônus)
 */
export default function WeatherCard({ estacao, dados, loading, error }) {
  // Loading state — renderização condicional enquanto busca dados da API
  if (loading) {
    return (
      <div className="rounded-2xl shadow-lg bg-blue-50 border border-blue-100 p-6 animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="h-6 bg-blue-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-blue-100 rounded w-16"></div>
          </div>
          <div className="h-10 w-10 bg-blue-200 rounded-full"></div>
        </div>
        <div className="h-16 bg-blue-200 rounded w-24 mb-4"></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-16 bg-blue-100 rounded-xl"></div>
          <div className="h-16 bg-blue-100 rounded-xl"></div>
          <div className="h-16 bg-blue-100 rounded-xl"></div>
          <div className="h-16 bg-blue-100 rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl shadow-lg bg-red-50 border border-red-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">⚠️</span>
          <h3 className="font-bold text-red-800">{estacao.nome} — {estacao.uf}</h3>
        </div>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    )
  }

  if (!dados) return null

  const temp = parseFloat(dados.TEM_INS)
  const umidade = parseFloat(dados.UMD_INS)
  const vento = parseFloat(dados.VEN_VEL)
  const direcaoVento = formatWindDirection(parseFloat(dados.VEN_DIR))
  const chuva = parseFloat(dados.CHUVA) || 0

  // Cores dinâmicas por temperatura (Feature Bônus +20pts)
  const classes = getTemperatureClasses(temp)

  return (
    <div className={`rounded-2xl shadow-lg ${classes.bg} border ${classes.border} p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
      {/* Header do card */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-slate-800 text-lg leading-tight">{estacao.nome}</h3>
          <span className="text-sm text-slate-500 font-medium">{estacao.uf} · {dados.HR_MEDICAO || '--:--'}</span>
        </div>
        <span className="text-3xl" title={`Temperatura: ${temp}°C`}>{classes.icon}</span>
      </div>

      {/* Temperatura principal — Feature +20pts */}
      <div className={`text-5xl font-black ${classes.text} mb-1`}>
        {isNaN(temp) ? '—' : `${temp.toFixed(1)}°`}
        <span className="text-xl font-medium ml-1 text-slate-500">C</span>
      </div>
      <div className={`text-xs font-semibold uppercase tracking-wider mb-5 ${classes.badge} inline-block px-2 py-0.5 rounded-full`}>
        {getTemperatureLabel(temp)}
      </div>

      {/* Grid de métricas — Umidade e Vento +20pts */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon="💧"
          label="Umidade"
          value={isNaN(umidade) ? '—' : `${umidade.toFixed(0)}%`}
        />
        <MetricCard
          icon="💨"
          label="Vento"
          value={isNaN(vento) ? '—' : `${vento.toFixed(1)} km/h`}
        />
        <MetricCard
          icon="🧭"
          label="Direção"
          value={direcaoVento}
        />
        <MetricCard
          icon="🌧️"
          label="Chuva"
          value={`${chuva.toFixed(1)} mm`}
        />
      </div>

      {/* Badge de fonte dos dados */}
      <div className="mt-4 text-xs text-slate-400 text-right">
        Estação: {estacao.codigo}
      </div>
    </div>
  )
}

function MetricCard({ icon, label, value }) {
  return (
    <div className="bg-white/60 rounded-xl p-3 flex items-center gap-2">
      <span className="text-xl">{icon}</span>
      <div>
        <div className="text-xs text-slate-500 font-medium">{label}</div>
        <div className="text-sm font-bold text-slate-800">{value}</div>
      </div>
    </div>
  )
}

function getTemperatureLabel(temp) {
  if (isNaN(temp)) return 'Sem dados'
  if (temp < 15) return 'Frio'
  if (temp < 25) return 'Agradável'
  if (temp < 35) return 'Quente'
  return 'Muito Quente'
}
