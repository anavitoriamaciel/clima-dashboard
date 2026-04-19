# 🌦️ Dashboard Meteorológico — Dev Challenge

Dashboard meteorológico funcional construído com **Next.js 14 + TailwindCSS**, usando dados reais do INMET com fallback para Open-Meteo.

## ⚡ Setup em 5 Minutos

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variável de ambiente (opcional)
cp .env.local.example .env.local
# Edite .env.local e adicione seu token INMET (opcional)

# 3. Rodar em desenvolvimento
npm run dev

# 4. Acessar no navegador
# http://localhost:3000
```

## 🏗️ Arquitetura

```
Browser → Next.js Frontend → API Route (proxy) → INMET / Open-Meteo
```

### Estrutura de Pastas

```
clima-dashboard/
├── app/
│   ├── page.js              # Página principal do dashboard
│   ├── layout.js            # Layout raiz
│   ├── globals.css          # Estilos globais + Tailwind
│   ├── api/
│   │   ├── clima/route.js   # API Route — busca dados de estação
│   │   └── estacoes/route.js # API Route — lista estações
│   └── components/
│       ├── Header.js        # Cabeçalho do dashboard
│       ├── WeatherCard.js   # Card meteorológico por cidade
│       ├── TemperatureChart.js # Gráfico de histórico (Recharts)
│       └── CitySearch.js    # Busca/seleção de cidades
├── lib/
│   └── api.js               # Funções auxiliares de API
└── .env.local.example       # Template de variáveis de ambiente
```


## 🔌 API do INMET

- **Base URL**: `https://apitempo.inmet.gov.br`
- `GET /estacoes/T` — lista estações automáticas
- `GET /estacao/dados/{codigo}` — dados de uma estação
