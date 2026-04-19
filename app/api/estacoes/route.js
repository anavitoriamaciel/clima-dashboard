import { NextResponse } from 'next/server'

// Lista fixa — sempre retornada, independente do INMET
const ESTACOES = [
  { codigo: 'A117', nome: 'São Luís', uf: 'MA', lat: -2.519, lon: -44.286 },
  { codigo: 'A652', nome: 'São Paulo', uf: 'SP', lat: -23.496, lon: -46.620 },
  { codigo: 'A621', nome: 'Rio de Janeiro', uf: 'RJ', lat: -22.941, lon: -43.185 },
  { codigo: 'A001', nome: 'Brasília', uf: 'DF', lat: -15.789, lon: -47.926 },
  { codigo: 'A522', nome: 'Belo Horizonte', uf: 'MG', lat: -19.933, lon: -43.938 },
  { codigo: 'A756', nome: 'Curitiba', uf: 'PR', lat: -25.448, lon: -49.231 },
  { codigo: 'A801', nome: 'Porto Alegre', uf: 'RS', lat: -30.053, lon: -51.175 },
  { codigo: 'A301', nome: 'Fortaleza', uf: 'CE', lat: -3.745, lon: -38.527 },
  { codigo: 'A402', nome: 'Salvador', uf: 'BA', lat: -12.978, lon: -38.504 },
  { codigo: 'A101', nome: 'Recife', uf: 'PE', lat: -8.059, lon: -34.918 },
  { codigo: 'A316', nome: 'Teresina', uf: 'PI', lat: -5.089, lon: -42.801 },
  { codigo: 'A254', nome: 'Manaus', uf: 'AM', lat: -3.103, lon: -60.016 },
  { codigo: 'A702', nome: 'Campo Grande', uf: 'MS', lat: -20.440, lon: -54.646 },
  { codigo: 'A925', nome: 'Florianópolis', uf: 'SC', lat: -27.580, lon: -48.557 },
  { codigo: 'A603', nome: 'Goiânia', uf: 'GO', lat: -16.642, lon: -49.220 },
]

export async function GET() {
  // Sempre retorna a lista fixa — confiável e com São Luís garantida
  return NextResponse.json(ESTACOES)
}