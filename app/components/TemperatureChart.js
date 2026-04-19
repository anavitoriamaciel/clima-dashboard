'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

/**
 * TemperatureChart — Gráfico de histórico de temperatura (Feature +40pts)
 * Usa Recharts para exibir variação de temperatura nas últimas horas
 * Eixo X = horários, Eixo Y = temperatura em °C
 */
export default function TemperatureChart({ dados, estacoes }) {
  // Monta dados do gráfico a partir do histórico
  const chartData = buildChartData(dados, estacoes)

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-sky-100 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-2">📈 Histórico de Temperatura</h2>
        <p className="text-slate-400 text-sm">Aguardando dados para exibir o gráfico...</p>
      </div>
    )
  }

  const colors = ['#0ea5e9', '#f97316', '#22c55e', '#a855f7', '#ef4444']

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-sky-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">📈 Histórico de Temperatura</h2>
          <p className="text-xs text-slate-400 mt-0.5">Variação nas últimas horas por cidade</p>
        </div>
        <span className="text-xs bg-sky-50 text-sky-600 font-medium px-3 py-1 rounded-full border border-sky-100">
          Ao vivo
        </span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="hora"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            unit="°C"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            width={50}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              fontSize: '12px',
            }}
            formatter={(value, name) => [`${value?.toFixed(1)}°C`, name]}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
          />
          {estacoes.map((est, i) => (
            <Line
              key={est.codigo}
              type="monotone"
              dataKey={est.nome}
              stroke={colors[i % colors.length]}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

/**
 * Transforma os dados brutos em formato para o Recharts
 * Combina histórico de múltiplas estações num array de pontos por hora
 */
function buildChartData(dados, estacoes) {
  if (!dados || Object.keys(dados).length === 0) return []

  // Coleta todos os horários
  const horariosSet = new Set()
  estacoes.forEach(est => {
    const d = dados[est.codigo]
    if (d?.historico) {
      d.historico.forEach(h => horariosSet.add(h.hora))
    } else if (Array.isArray(d?.data)) {
      d.data.slice(-12).forEach(item => {
        const hora = item.HR_MEDICAO || item.hora
        if (hora) horariosSet.add(hora)
      })
    }
  })

  const horarios = Array.from(horariosSet).sort()
  if (horarios.length === 0) return []

  return horarios.map(hora => {
    const ponto = { hora }
    estacoes.forEach(est => {
      const d = dados[est.codigo]
      if (d?.historico) {
        const h = d.historico.find(h => h.hora === hora)
        ponto[est.nome] = h ? parseFloat(h.temp) : null
      } else if (Array.isArray(d?.data)) {
        const item = d.data.find(i => (i.HR_MEDICAO || i.hora) === hora)
        ponto[est.nome] = item ? parseFloat(item.TEM_INS) : null
      }
    })
    return ponto
  })
}
