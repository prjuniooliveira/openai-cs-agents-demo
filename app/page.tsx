'use client'

import { useState, useEffect } from 'react'
import { AgentOrchestrator } from '@/components/AgentOrchestrator'
import { ChatInterface } from '@/components/ChatInterface'
import { FinancialDashboard } from '@/components/FinancialDashboard'
import { IngredientInventory } from '@/components/IngredientInventory'
import { OpenAIConfig } from '@/components/OpenAIConfig'

export default function Home() {
  const [currentStep, setCurrentStep] = useState('inventory')
  const [userBudget, setUserBudget] = useState(50.00)
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([])
  const [suggestedRecipe, setSuggestedRecipe] = useState<any>(null)
  const [priceAnalysis, setPriceAnalysis] = useState<any>(null)
  const [openaiApiKey, setOpenaiApiKey] = useState('')
  const [showApiKeyWarning, setShowApiKeyWarning] = useState(false)

  // Verificar se tem chave da OpenAI ao carregar
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key')
    if (savedKey) {
      setOpenaiApiKey(savedKey)
    } else {
      setShowApiKeyWarning(true)
    }
  }, [])

  const handleApiKeyChange = (apiKey: string) => {
    setOpenaiApiKey(apiKey)
    setShowApiKeyWarning(!apiKey)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Configuração OpenAI */}
      <OpenAIConfig onApiKeyChange={handleApiKeyChange} />

      {/* Aviso se não tiver chave configurada */}
      {showApiKeyWarning && (
        <div className="bg-warning-50 border-l-4 border-warning-500 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-warning-700">
                <strong>Atenção:</strong> Configure sua chave da OpenAI no botão de configurações no canto superior direito para usar o sistema.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🥪 Chef Inteligente da Maju
          </h1>
          <p className="text-gray-600">
            Sistema de agentes IA para fazer lanches deliciosos e econômicos
          </p>
          {openaiApiKey && (
            <div className="mt-2 inline-flex items-center px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm">
              ✅ OpenAI configurada
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Painel de Agentes */}
          <div className="lg:col-span-2">
            <AgentOrchestrator 
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              userBudget={userBudget}
              availableIngredients={availableIngredients}
              suggestedRecipe={suggestedRecipe}
              priceAnalysis={priceAnalysis}
            />
          </div>

          {/* Painel Lateral */}
          <div className="space-y-6">
            <FinancialDashboard 
              budget={userBudget}
              onBudgetChange={setUserBudget}
            />
            
            <IngredientInventory 
              ingredients={availableIngredients}
              onIngredientsChange={setAvailableIngredients}
            />
          </div>
        </div>

        {/* Interface de Chat */}
        <div className="mt-8">
          <ChatInterface 
            onRecipeSuggestion={setSuggestedRecipe}
            onPriceAnalysis={setPriceAnalysis}
            availableIngredients={availableIngredients}
            budget={userBudget}
            apiKey={openaiApiKey}
          />
        </div>
      </div>
    </main>
  )
}