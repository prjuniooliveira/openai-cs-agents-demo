'use client'

import { useState } from 'react'
import { 
  Package, 
  ChefHat, 
  Heart, 
  PlayCircle, 
  CreditCard, 
  Search, 
  Calculator,
  TrendingUp,
  MessageSquare,
  CheckCircle
} from 'lucide-react'

interface Agent {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  status: 'idle' | 'active' | 'completed' | 'error'
  tools: string[]
  result?: any
}

interface AgentOrchestratorProps {
  currentStep: string
  onStepChange: (step: string) => void
  userBudget: number
  availableIngredients: string[]
  suggestedRecipe: any
  priceAnalysis: any
}

export function AgentOrchestrator({ 
  currentStep, 
  onStepChange,
  userBudget,
  availableIngredients,
  suggestedRecipe,
  priceAnalysis
}: AgentOrchestratorProps) {
  const [agents] = useState<Agent[]>([
    {
      id: 'inventory',
      name: 'Agente de Inventário',
      description: 'Detecta ingredientes disponíveis na geladeira',
      icon: <Package className="w-5 h-5" />,
      status: availableIngredients.length > 0 ? 'completed' : 'idle',
      tools: ['OCR de Geladeira', 'Lista Manual', 'Detecção de Validade']
    },
    {
      id: 'recipe',
      name: 'Agente de Receitas',
      description: 'Sugere receitas baseadas nos ingredientes',
      icon: <ChefHat className="w-5 h-5" />,
      status: suggestedRecipe ? 'completed' : 'idle',
      tools: ['Base de Receitas', 'IA Generativa', 'Filtros Nutricionais']
    },
    {
      id: 'adaptation',
      name: 'Agente de Adaptação Infantil',
      description: 'Adapta receitas para o paladar da Maju',
      icon: <Heart className="w-5 h-5" />,
      status: 'idle',
      tools: ['Perfil de Preferências', 'Histórico de Gostos', 'Apresentação Lúdica']
    },
    {
      id: 'execution',
      name: 'Agente de Execução',
      description: 'Guia passo a passo no preparo',
      icon: <PlayCircle className="w-5 h-5" />,
      status: 'idle',
      tools: ['Instruções por Voz', 'Timer Inteligente', 'Dicas Visuais']
    },
    {
      id: 'balance',
      name: 'Agente de Saldo',
      description: 'Verifica saldo disponível nas contas',
      icon: <CreditCard className="w-5 h-5" />,
      status: userBudget > 0 ? 'completed' : 'idle',
      tools: ['Open Finance API', 'Carteiras Digitais', 'Análise de Gastos'],
      result: { balance: userBudget, accounts: ['Nubank', 'PicPay', 'Conta Corrente'] }
    },
    {
      id: 'pricing',
      name: 'Agente de Cotação',
      description: 'Pesquisa preços em tempo real',
      icon: <Search className="w-5 h-5" />,
      status: priceAnalysis ? 'completed' : 'idle',
      tools: ['Web Scraping', 'APIs de Mercado', 'Comparação de Preços']
    },
    {
      id: 'budget',
      name: 'Agente Orçamentário',
      description: 'Decide se o lanche cabe no orçamento',
      icon: <Calculator className="w-5 h-5" />,
      status: 'idle',
      tools: ['Análise de Custo', 'Sugestões Alternativas', 'Otimização']
    },
    {
      id: 'habits',
      name: 'Agente de Hábitos',
      description: 'Analisa padrões e sugere economia',
      icon: <TrendingUp className="w-5 h-5" />,
      status: 'idle',
      tools: ['Machine Learning', 'Análise Comportamental', 'Coaching Financeiro']
    },
    {
      id: 'feedback',
      name: 'Agente de Feedback',
      description: 'Coleta avaliação e aprende',
      icon: <MessageSquare className="w-5 h-5" />,
      status: 'idle',
      tools: ['Sistema de Notas', 'Aprendizado Contínuo', 'Personalização']
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'status-info'
      case 'completed': return 'status-success'
      case 'error': return 'status-danger'
      default: return 'status-warning'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Executando'
      case 'completed': return 'Concluído'
      case 'error': return 'Erro'
      default: return 'Aguardando'
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          🤖 Orquestração de Agentes
          <span className="text-sm font-normal text-gray-500">
            ({agents.filter(a => a.status === 'completed').length}/{agents.length} concluídos)
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <div 
              key={agent.id}
              className={`agent-card ${
                agent.status === 'active' ? 'agent-active' : 
                agent.status === 'idle' ? 'agent-inactive' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                    {agent.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900">
                      {agent.name}
                    </h3>
                  </div>
                </div>
                <span className={`status-badge ${getStatusColor(agent.status)}`}>
                  {agent.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {getStatusText(agent.status)}
                </span>
              </div>
              
              <p className="text-xs text-gray-600 mb-3">
                {agent.description}
              </p>
              
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700">Ferramentas:</div>
                <div className="flex flex-wrap gap-1">
                  {agent.tools.map((tool, index) => (
                    <span 
                      key={index}
                      className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {agent.result && (
                <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                  <div className="font-medium text-gray-700 mb-1">Resultado:</div>
                  {agent.id === 'balance' && (
                    <div className="text-gray-600">
                      Saldo: R$ {agent.result.balance.toFixed(2)}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline de Execução */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🔄 Pipeline de Execução
        </h3>
        
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {['inventory', 'recipe', 'balance', 'pricing', 'budget', 'adaptation', 'execution', 'feedback'].map((step, index) => {
            const agent = agents.find(a => a.id === step)
            const isActive = currentStep === step
            const isCompleted = agent?.status === 'completed'
            
            return (
              <div key={step} className="flex items-center">
                <div 
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${
                    isCompleted ? 'bg-success-500 text-white' :
                    isActive ? 'bg-primary-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                {index < 7 && (
                  <div className={`w-8 h-0.5 ${
                    isCompleted ? 'bg-success-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <strong>Próximo passo:</strong> {
            currentStep === 'inventory' ? 'Adicione ingredientes disponíveis' :
            currentStep === 'recipe' ? 'Aguardando sugestão de receita' :
            currentStep === 'balance' ? 'Verificando saldo disponível' :
            'Processando...'
          }
        </div>
      </div>
    </div>
  )
}