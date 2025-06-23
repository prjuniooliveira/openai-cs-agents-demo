'use client'

import { useState, useEffect } from 'react'
import { AgentOrchestrator } from '@/components/AgentOrchestrator'
import { ChatInterface } from '@/components/ChatInterface'
import { FinancialDashboard } from '@/components/FinancialDashboard'
import { IngredientInventory } from '@/components/IngredientInventory'

export default function Home() {
  const [currentStep, setCurrentStep] = useState('inventory')
  const [userBudget, setUserBudget] = useState(50.00)
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([])
  const [suggestedRecipe, setSuggestedRecipe] = useState<any>(null)
  const [priceAnalysis, setPriceAnalysis] = useState<any>(null)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🥪 Chef Inteligente da Maju
          </h1>
          <p className="text-gray-600">
            Sistema de agentes IA para fazer lanches deliciosos e econômicos
          </p>
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
          />
        </div>
      </div>
    </main>
  )
}