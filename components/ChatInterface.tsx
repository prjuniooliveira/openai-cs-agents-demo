'use client'

import { useState } from 'react'
import { Send, Bot, User, ChefHat, DollarSign, Sparkles } from 'lucide-react'

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
}

export function ChatInterface({ 
  onRecipeSuggestion, 
  onPriceAnalysis, 
  availableIngredients, 
  budget 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'agent',
      agent: 'Chef IA',
      content: 'Olá! Sou o Chef Inteligente da Maju! 🍳 Vou te ajudar a fazer um lanche delicioso e econômico. Que tal começarmos? Você pode me contar o que tem na geladeira ou me pedir uma sugestão!',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Receitas pré-definidas baseadas em ingredientes comuns
  const recipeDatabase = {
    'sanduiche_natural': {
      name: 'Sanduíche Natural da Maju',
      ingredients: ['Pão de forma', 'Queijo', 'Tomate', 'Alface'],
      steps: [
        'Corte o pão em fatias',
        'Lave bem o tomate e a alface',
        'Monte o sanduíche em camadas',
        'Corte em formato divertido para a Maju',
        'Sirva com muito amor! 💕'
      ],
      estimatedCost: 8.50,
      prepTime: '5 minutos',
      difficulty: 'Fácil'
    },
    'vitamina_banana': {
      name: 'Vitamina de Banana Especial',
      ingredients: ['Banana', 'Leite', 'Mel', 'Aveia'],
      steps: [
        'Descasque a banana',
        'Coloque todos os ingredientes no liquidificador',
        'Bata por 2 minutos',
        'Sirva gelado em um copo colorido',
        'Decore com uma fatia de banana'
      ],
      estimatedCost: 6.00,
      prepTime: '3 minutos',
      difficulty: 'Super Fácil'
    },
    'ovo_mexido': {
      name: 'Ovos Mexidos Cremosos',
      ingredients: ['Ovos', 'Leite', 'Manteiga', 'Sal'],
      steps: [
        'Quebre os ovos em uma tigela',
        'Adicione um pouco de leite',
        'Misture bem com um garfo',
        'Aqueça a manteiga na frigideira',
        'Cozinhe mexendo sempre até ficar cremoso'
      ],
      estimatedCost: 5.50,
      prepTime: '8 minutos',
      difficulty: 'Fácil'
    }
  }

  const getRandomRecipe = () => {
    const recipes = Object.values(recipeDatabase)
    return recipes[Math.floor(Math.random() * recipes.length)]
  }

  const findRecipeByIngredients = (ingredients: string[]) => {
    // Lógica simples para encontrar receita baseada nos ingredientes
    const hasIngredient = (recipe: any, ingredient: string) => {
      return recipe.ingredients.some((recipeIng: string) => 
        recipeIng.toLowerCase().includes(ingredient.toLowerCase()) ||
        ingredient.toLowerCase().includes(recipeIng.toLowerCase())
      )
    }

    for (const recipe of Object.values(recipeDatabase)) {
      const matchCount = ingredients.filter(ing => hasIngredient(recipe, ing)).length
      if (matchCount >= 2) {
        return recipe
      }
    }

    return getRandomRecipe()
  }

  const simulateAgentResponse = async (userMessage: string) => {
    setIsLoading(true)
    
    // Simula processamento
    await new Promise(resolve => setTimeout(resolve, 1500))

    let agentResponse = ''
    let agentName = 'Chef IA'

    const message = userMessage.toLowerCase()

    if (message.includes('lanche') || message.includes('receita') || message.includes('fazer')) {
      if (availableIngredients.length === 0) {
        agentResponse = 'Primeiro, preciso saber quais ingredientes você tem! 🥘 Pode adicionar alguns ingredientes na lista ao lado? Ou me conte o que tem na geladeira!'
        agentName = 'Agente de Inventário'
      } else {
        const recipe = findRecipeByIngredients(availableIngredients)
        onRecipeSuggestion(recipe)
        agentResponse = `Perfeito! Com os ingredientes que você tem, sugiro fazer: **${recipe.name}** 🍽️\n\n` +
          `**Ingredientes necessários:** ${recipe.ingredients.join(', ')}\n` +
          `**Tempo de preparo:** ${recipe.prepTime}\n` +
          `**Custo estimado:** R$ ${recipe.estimatedCost.toFixed(2)}\n` +
          `**Dificuldade:** ${recipe.difficulty}\n\n` +
          `Quer que eu te guie no passo a passo? 👨‍🍳`
        agentName = 'Chef de Receitas'
      }
    } else if (message.includes('preço') || message.includes('custo') || message.includes('quanto')) {
      const analysis = {
        totalCost: Math.min(budget * 0.6, 12.50),
        breakdown: [
          { item: 'Pão integral', price: 4.50 },
          { item: 'Queijo branco', price: 6.00 },
          { item: 'Tomate', price: 2.00 }
        ],
        savings: budget - 12.50,
        bestMarkets: ['Mercado do Bairro', 'Supermercado Central', 'Feira da Esquina']
      }
      
      onPriceAnalysis(analysis)
      agentResponse = `Analisei os preços nos mercados da região! 💰\n\n` +
        `**Custo total estimado:** R$ ${analysis.totalCost.toFixed(2)}\n` +
        `**Economia:** R$ ${Math.max(0, analysis.savings).toFixed(2)} do seu orçamento\n\n` +
        `**Melhores lugares para comprar:**\n` +
        analysis.bestMarkets.map(market => `• ${market}`).join('\n') + '\n\n' +
        `Quer que eu procure opções mais baratas? 🛒`
      agentName = 'Agente de Preços'
    } else if (message.includes('maju') || message.includes('criança') || message.includes('infantil')) {
      agentResponse = 'Ótimo! Para a Maju, vou adaptar tudo especialmente! 👧✨\n\n' +
        '**Adaptações especiais:**\n' +
        '• Sem temperos fortes\n' +
        '• Formato divertido (estrela, coração, etc.)\n' +
        '• Cores atrativas\n' +
        '• Tamanho adequado para criança\n\n' +
        'A Maju tem alguma alergia ou ingrediente que não gosta? 🤔'
      agentName = 'Agente Infantil'
    } else if (message.includes('passo') || message.includes('como') || message.includes('ensina')) {
      agentResponse = 'Claro! Vou te guiar passo a passo! 👨‍🍳\n\n' +
        '**Modo de preparo detalhado:**\n' +
        '1. Separe todos os ingredientes\n' +
        '2. Lave bem as mãos\n' +
        '3. Prepare os utensílios necessários\n' +
        '4. Siga cada etapa com calma\n\n' +
        'Quer que eu ative o timer inteligente? ⏰'
      agentName = 'Agente de Execução'
    } else if (message.includes('obrigad') || message.includes('valeu') || message.includes('legal')) {
      agentResponse = 'Fico muito feliz em ajudar! 😊 A Maju vai adorar o lanche! Se precisar de mais alguma coisa, é só chamar. Bom apetite! 🍽️✨'
      agentName = 'Chef IA'
    } else {
      agentResponse = 'Entendi! Como posso te ajudar hoje? 🤖\n\n' +
        '**Posso ajudar com:**\n' +
        '• Sugerir receitas deliciosas 🍳\n' +
        '• Verificar preços nos mercados 💰\n' +
        '• Adaptar receitas para crianças 👧\n' +
        '• Te guiar no preparo passo a passo 📝\n\n' +
        'O que você gostaria de fazer?'
      agentName = 'Assistente Principal'
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
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-600" />
          Chat com os Agentes IA
          <span className="ml-auto text-xs bg-success-500 text-white px-2 py-1 rounded-full">
            Online
          </span>
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
                <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-600" />
                </div>
              </div>
            )}
            
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
              message.type === 'user' 
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              {message.type === 'agent' && (
                <div className="text-xs font-medium text-primary-600 mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {message.agent}
                </div>
              )}
              <div className="text-sm whitespace-pre-line">{message.content}</div>
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
              <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-600" />
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setInputText('Quero fazer um lanche para a Maju')}
            className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full text-xs hover:bg-gray-50 transition-colors flex items-center gap-1"
          >
            <ChefHat className="w-3 h-3" />
            Sugerir receita
          </button>
          <button
            onClick={() => setInputText('Quanto vai custar?')}
            className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full text-xs hover:bg-gray-50 transition-colors flex items-center gap-1"
          >
            <DollarSign className="w-3 h-3" />
            Verificar preços
          </button>
          <button
            onClick={() => setInputText('Como fazer passo a passo?')}
            className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full text-xs hover:bg-gray-50 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            Passo a passo
          </button>
        </div>
      </div>
    </div>
  )
}