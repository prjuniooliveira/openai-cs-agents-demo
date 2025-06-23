'use client'

import { useState } from 'react'
import { Send, Bot, User, ChefHat, DollarSign, AlertCircle } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'agent'
  agent?: string
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  onRecipeSuggestion: (recipe: any) => void
  onPriceAnalysis: (analysis: any) => void
  availableIngredients: string[]
  budget: number
  apiKey: string
}

export function ChatInterface({ 
  onRecipeSuggestion, 
  onPriceAnalysis, 
  availableIngredients, 
  budget,
  apiKey
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'agent',
      agent: 'Triage Agent',
      content: 'Olá! Sou o Chef Inteligente da Maju. Vou te ajudar a fazer um lanche delicioso e econômico. O que você gostaria de preparar hoje?',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const simulateAgentResponse = async (userMessage: string) => {
    if (!apiKey) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'agent',
        agent: 'System',
        content: '⚠️ Configure sua chave da OpenAI primeiro para usar o chat.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      return
    }

    setIsLoading(true)
    
    // Simula processamento dos agentes
    await new Promise(resolve => setTimeout(resolve, 1500))

    let agentResponse = ''
    let agentName = 'Chef Agent'

    if (userMessage.toLowerCase().includes('lanche') || userMessage.toLowerCase().includes('receita')) {
      if (availableIngredients.length === 0) {
        agentResponse = 'Primeiro, preciso saber quais ingredientes você tem disponíveis. Pode me contar o que tem na geladeira?'
        agentName = 'Inventory Agent'
      } else {
        // Simula sugestão de receita
        const recipe = {
          name: 'Sanduíche Natural da Maju',
          ingredients: availableIngredients.slice(0, 4),
          steps: [
            'Corte o pão em fatias',
            'Adicione os ingredientes em camadas',
            'Corte em formato de coração para a Maju',
            'Sirva com amor!'
          ],
          estimatedCost: Math.min(budget * 0.7, 15.50),
          prepTime: '10 minutos'
        }
        
        onRecipeSuggestion(recipe)
        agentResponse = `Perfeito! Com os ingredientes que você tem (${availableIngredients.slice(0, 3).join(', ')}), posso sugerir um ${recipe.name}. Custo estimado: R$ ${recipe.estimatedCost.toFixed(2)}. Quer que eu te guie no preparo?`
        agentName = 'Recipe Agent'
      }
    } else if (userMessage.toLowerCase().includes('preço') || userMessage.toLowerCase().includes('custo')) {
      const analysis = {
        totalCost: 12.50,
        breakdown: [
          { item: 'Pão integral', price: 4.50 },
          { item: 'Queijo branco', price: 6.00 },
          { item: 'Tomate', price: 2.00 }
        ],
        savings: budget - 12.50
      }
      
      onPriceAnalysis(analysis)
      agentResponse = `Analisei os preços nos mercados da região. O custo total seria R$ ${analysis.totalCost.toFixed(2)}, sobrando R$ ${analysis.savings.toFixed(2)} do seu orçamento. Quer que eu procure opções mais baratas?`
      agentName = 'Pricing Agent'
    } else if (userMessage.toLowerCase().includes('maju') || userMessage.toLowerCase().includes('criança')) {
      agentResponse = 'Ótimo! Para a Maju, vou adaptar a receita: sem temperos fortes, formato divertido (que tal um sanduíche em formato de estrela?), e com ingredientes que ela já gosta. Ela tem alguma alergia ou ingrediente que não gosta?'
      agentName = 'Child Adaptation Agent'
    } else {
      agentResponse = 'Entendi! Como posso te ajudar com o lanche? Posso sugerir receitas, verificar preços, ou adaptar algo especial para a Maju.'
      agentName = 'Triage Agent'
    }

    const agentMessage: Message = {
      id: Date.now().toString(),
      type: 'agent',
      agent: agentName,
      content: agentResponse,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, agentMessage])
    setIsLoading(false)
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const messageText = inputText
    setInputText('')

    await simulateAgentResponse(messageText)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-96 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary-600" />
          Chat com os Agentes
          {!apiKey && (
            <div className="ml-auto flex items-center gap-1 text-warning-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">API não configurada</span>
            </div>
          )}
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'agent' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-600" />
                </div>
              </div>
            )}
            
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.type === 'user' 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              {message.type === 'agent' && (
                <div className="text-xs font-medium text-primary-600 mb-1">
                  {message.agent}
                </div>
              )}
              <p className="text-sm">{message.content}</p>
            </div>

            {message.type === 'user' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-600" />
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={apiKey ? "Digite sua mensagem..." : "Configure a chave OpenAI primeiro..."}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            disabled={isLoading || !apiKey}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading || !apiKey}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {/* Quick Actions */}
        {apiKey && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setInputText('Quero fazer um lanche para a Maju')}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
            >
              <ChefHat className="w-3 h-3 inline mr-1" />
              Sugerir receita
            </button>
            <button
              onClick={() => setInputText('Quanto vai custar?')}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
            >
              <DollarSign className="w-3 h-3 inline mr-1" />
              Verificar preços
            </button>
          </div>
        )}
      </div>
    </div>
  )
}