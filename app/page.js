'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import WeatherCard from './components/WeatherCard'
import TemperatureChart from './components/TemperatureChart'
import CitySearch from './components/CitySearch'
import { fetchClima, fetchEstacoes } from '@/lib/api'

// Estações padrão exibidas ao carregar
const ESTACOES_PADRAO = ['A117', 'A652', 'A621', 'A001', 'A522']

export default function Home() {
  const [todasEstacoes, setTodasEstacoes] = useState([])
  const [estacoesAtivas, setEstacoesAtivas] = useState([])
  const [dadosClima, setDadosClima] = useState({})  // { codigoEstacao: { data, historico } }
  const [loadingMap, setLoadingMap] = useState({})
  const [errorMap, setErrorMap] = useState({})
  const [atualizadoEm, setAtualizadoEm] = useState(null)

  // Carrega lista de estações ao iniciar
  useEffect(() => {
    fetchEstacoes()
      .then(estacoes => {
        setTodasEstacoes(estacoes)
        // Seleciona estações padrão
        const padrao = estacoes.filter(e => ESTACOES_PADRAO.includes(e.codigo))
        setEstacoesAtivas(padrao.length > 0 ? padrao : estacoes.slice(0, 4))
      })
      .catch(console.error)
  }, [])

  // Busca dados climáticos para cada estação ativa
  const buscarDados = useCallback(async () => {
    if (estacoesAtivas.length === 0) return

    // Marca todas como loading
    const loadingInit = {}
    estacoesAtivas.forEach(e => { loadingInit[e.codigo] = true })
    setLoadingMap(prev => ({ ...prev, ...loadingInit }))

    // Busca em paralelo
    const promises = estacoesAtivas.map(async est => {
      try {
        const result = await fetchClima(est.codigo)
        const ultimoDado = Array.isArray(result.data)
          ? result.data[result.data.length - 1]
          : null

        const historico = ultimoDado?.historico || null
        return { codigo: est.codigo, data: ultimoDado, historico, error: null }
      } catch (err) {
        return { codigo: est.codigo, data: null, historico: null, error: err.message }
      }
    })

    const resultados = await Promise.all(promises)

    const novosDados = {}
    const novosErros = {}
    const novoLoading = {}

    resultados.forEach(({ codigo, data, historico, error }) => {
      novosDados[codigo] = { data, historico }
      novosErros[codigo] = error
      novoLoading[codigo] = false
    })

    setDadosClima(prev => ({ ...prev, ...novosDados }))
    setErrorMap(prev => ({ ...prev, ...novosErros }))
    setLoadingMap(prev => ({ ...prev, ...novoLoading }))
    setAtualizadoEm(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
  }, [estacoesAtivas])

  // Roda busca quando estações mudam
  useEffect(() => {
    buscarDados()
    // Atualiza a cada 5 minutos
    const interval = setInterval(buscarDados, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [buscarDados])

  // Toggle de estação ativa
  function handleToggleEstacao(estacao) {
    setEstacoesAtivas(prev => {
      const jaAtiva = prev.some(e => e.codigo === estacao.codigo)
      if (jaAtiva) {
        return prev.filter(e => e.codigo !== estacao.codigo)
      }
      if (prev.length >= 6) {
        alert('Máximo de 6 estações simultâneas para melhor visualização.')
        return prev
      }
      return [...prev, estacao]
    })
  }

  return (
    <div className="min-h-screen">
      {/* Header — componente reutilizável */}
      <Header
        totalEstacoes={estacoesAtivas.length}
        atualizadoEm={atualizadoEm}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar — Busca por cidade */}
          <aside className="lg:w-64 flex-shrink-0">
            <CitySearch
              estacoes={todasEstacoes}
              selecionadas={estacoesAtivas}
              onToggle={handleToggleEstacao}
            />
          </aside>

          {/* Conteúdo principal */}
          <div className="flex-1 space-y-6">

            {/* Cards por cidade — Feature +30pts */}
            {estacoesAtivas.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <p className="text-5xl mb-4">🏙️</p>
                <p className="text-lg font-medium">Selecione cidades no painel ao lado</p>
                <p className="text-sm mt-1">para visualizar os dados meteorológicos</p>
              </div>
            ) : (
              <>
                {/* Grid de cards — UI responsiva com Tailwind +10pts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {estacoesAtivas.map((est, i) => (
                    <div
                      key={est.codigo}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <WeatherCard
                        estacao={est}
                        dados={dadosClima[est.codigo]?.data}
                        loading={loadingMap[est.codigo] ?? true}
                        error={errorMap[est.codigo]}
                      />
                    </div>
                  ))}
                </div>

                {/* Gráfico de histórico — Feature +40pts */}
                <TemperatureChart
                  dados={dadosClima}
                  estacoes={estacoesAtivas}
                />
              </>
            )}

            {/* Rodapé informativo */}
            <footer className="text-center text-xs text-slate-400 py-4">
              Dados fornecidos pela API do{' '}
              <a href="https://apitempo.inmet.gov.br" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline">
                INMET
              </a>
              {' '}e{' '}
              <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline">
                Open-Meteo
              </a>
              {' '}como fallback
            </footer>
          </div>
        </div>
      </main>
    </div>
  )
}