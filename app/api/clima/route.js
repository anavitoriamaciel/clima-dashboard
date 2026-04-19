import { NextResponse } from 'next/server'

// Mapa de estações → coordenadas
const ESTACOES_COORDS = {
  'A001': { lat: -15.789, lon: -47.926 }, // Brasília
  'A652': { lat: -23.496, lon: -46.620 }, // São Paulo
  'A621': { lat: -22.941, lon: -43.185 }, // Rio de Janeiro
  'A301': { lat: -3.745,  lon: -38.527 }, // Fortaleza
  'A101': { lat: -8.059,  lon: -34.918 }, // Recife
  'A402': { lat: -12.978, lon: -38.504 }, // Salvador
  'A522': { lat: -19.933, lon: -43.938 }, // Belo Horizonte
  'A801': { lat: -30.053, lon: -51.175 }, // Porto Alegre
  'A756': { lat: -25.448, lon: -49.231 }, // Curitiba
  'A117': { lat: -2.519,  lon: -44.286 }, // São Luís
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const estacao = searchParams.get('estacao')

  if (!estacao) {
    return NextResponse.json({ error: 'Código de estação obrigatório' }, { status: 400 })
  }

  const coordenadas = ESTACOES_COORDS[estacao] || { lat: -2.519, lon: -44.286 }

  // Open-Meteo como fonte principal — sem token, sem CORS, 100% gratuita
  try {
    const url = `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${coordenadas.lat}&longitude=${coordenadas.lon}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation,weather_code` +
      `&hourly=temperature_2m` +
      `&timezone=America%2FSao_Paulo` +
      `&forecast_days=1`

    const res = await fetch(url, { cache: 'no-store' })

    if (!res.ok) throw new Error(`Open-Meteo erro: ${res.status}`)

    const meteo = await res.json()

    // Hora atual para pegar índice correto do histórico horário
    const agora = new Date()
    const horaAtual = agora.getHours()

    // Pega as últimas 12 horas até agora
    const historico = meteo.hourly.time
      .slice(0, horaAtual + 1)
      .slice(-12)
      .map((t, i, arr) => {
        const idx = horaAtual - (arr.length - 1 - i)
        return {
          hora: t.split('T')[1]?.substring(0, 5),
          temp: meteo.hourly.temperature_2m[idx] ?? null,
        }
      })

    const dadoAtual = {
      TEM_INS: meteo.current.temperature_2m,
      UMD_INS: meteo.current.relative_humidity_2m,
      VEN_VEL: meteo.current.wind_speed_10m,
      VEN_DIR: meteo.current.wind_direction_10m,
      CHUVA:   meteo.current.precipitation,
      PRE_INS: null,
      HR_MEDICAO: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      DT_MEDICAO: agora.toISOString().split('T')[0],
      historico,
    }

    return NextResponse.json({ source: 'open-meteo', data: [dadoAtual] })

  } catch (err) {
    console.error('Erro ao buscar dados:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}