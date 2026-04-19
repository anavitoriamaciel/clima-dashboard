/**
 * lib/api.js
 * Funções auxiliares para chamadas à API e tratamento de dados
 */

/**
 * Busca dados meteorológicos de uma estação
 * @param {string} codigoEstacao - Código da estação INMET
 */
export async function fetchClima(codigoEstacao) {
  const res = await fetch(`/api/clima?estacao=${codigoEstacao}`)
  if (!res.ok) throw new Error('Erro ao buscar dados climáticos')
  return res.json()
}

/**
 * Busca lista de estações disponíveis
 */
export async function fetchEstacoes() {
  const res = await fetch('/api/estacoes')
  if (!res.ok) throw new Error('Erro ao buscar estações')
  return res.json()
}

/**
 * Determina a cor do card baseada na temperatura (Feature Bônus)
 * @param {number} temp - Temperatura em °C
 */
export function getTemperatureColor(temp) {
  if (temp === null || temp === undefined) return 'blue'
  if (temp < 15) return 'blue'    // Frio
  if (temp < 25) return 'green'   // Agradável
  if (temp < 35) return 'orange'  // Quente
  return 'red'                     // Muito quente
}

/**
 * Retorna classes Tailwind baseadas na temperatura
 * @param {number} temp
 */
export function getTemperatureClasses(temp) {
  const color = getTemperatureColor(temp)
  const map = {
    blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',  text: 'text-blue-700',   badge: 'bg-blue-100 text-blue-800',   icon: '🥶' },
    green:  { bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-700',  badge: 'bg-green-100 text-green-800', icon: '😊' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200',text: 'text-orange-700', badge: 'bg-orange-100 text-orange-800',icon: '☀️' },
    red:    { bg: 'bg-red-50',    border: 'border-red-200',   text: 'text-red-700',    badge: 'bg-red-100 text-red-800',     icon: '🔥' },
  }
  return map[color]
}

/**
 * Extrai os dados mais recentes de um array de medições
 */
export function getLatestData(data) {
  if (!data || data.length === 0) return null
  return data[data.length - 1]
}

/**
 * Formata direção do vento em texto
 */
export function formatWindDirection(degrees) {
  if (degrees === null || degrees === undefined) return '—'
  const dirs = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO']
  return dirs[Math.round(degrees / 45) % 8]
}
