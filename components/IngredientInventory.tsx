'use client'

import { useState } from 'react'
import { Plus, X, Package, Camera, List } from 'lucide-react'

interface IngredientInventoryProps {
  ingredients: string[]
  onIngredientsChange: (ingredients: string[]) => void
}

export function IngredientInventory({ ingredients, onIngredientsChange }: IngredientInventoryProps) {
  const [newIngredient, setNewIngredient] = useState('')
  const [inputMode, setInputMode] = useState<'manual' | 'camera' | 'list'>('manual')

  const commonIngredients = [
    'Pão de forma', 'Ovos', 'Leite', 'Queijo', 'Presunto', 'Tomate',
    'Alface', 'Manteiga', 'Banana', 'Aveia', 'Mel', 'Canela',
    'Iogurte', 'Granola', 'Morango', 'Abacate', 'Limão', 'Sal'
  ]

  const addIngredient = (ingredient: string) => {
    if (ingredient.trim() && !ingredients.includes(ingredient.trim())) {
      onIngredientsChange([...ingredients, ingredient.trim()])
      setNewIngredient('')
    }
  }

  const removeIngredient = (ingredient: string) => {
    onIngredientsChange(ingredients.filter(i => i !== ingredient))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addIngredient(newIngredient)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-primary-600" />
        Inventário da Geladeira
      </h3>

      {/* Modo de Input */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setInputMode('manual')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
            inputMode === 'manual' 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <List className="w-3 h-3" />
          Manual
        </button>
        <button
          onClick={() => setInputMode('camera')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
            inputMode === 'camera' 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Camera className="w-3 h-3" />
          Foto
        </button>
      </div>

      {/* Input Manual */}
      {inputMode === 'manual' && (
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite um ingrediente..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
            <button
              onClick={() => addIngredient(newIngredient)}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Input por Câmera */}
      {inputMode === 'camera' && (
        <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">Tire uma foto da sua geladeira</p>
          <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm">
            Abrir Câmera
          </button>
          <p className="text-xs text-gray-500 mt-2">
            A IA irá detectar automaticamente os ingredientes
          </p>
        </div>
      )}

      {/* Ingredientes Comuns */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Ingredientes Comuns:</h4>
        <div className="flex flex-wrap gap-1">
          {commonIngredients.map((ingredient) => (
            <button
              key={ingredient}
              onClick={() => addIngredient(ingredient)}
              disabled={ingredients.includes(ingredient)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                ingredients.includes(ingredient)
                  ? 'bg-success-100 text-success-700 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {ingredient}
              {ingredients.includes(ingredient) && ' ✓'}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Ingredientes */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Seus Ingredientes ({ingredients.length}):
        </h4>
        {ingredients.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            Nenhum ingrediente adicionado ainda
          </p>
        ) : (
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-gray-900">{ingredient}</span>
                <button
                  onClick={() => removeIngredient(ingredient)}
                  className="text-gray-400 hover:text-danger-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      {ingredients.length > 0 && (
        <div className="mt-4 p-3 bg-success-50 rounded-lg">
          <p className="text-sm text-success-700">
            ✅ Inventário atualizado! Pronto para sugerir receitas.
          </p>
        </div>
      )}
    </div>
  )
}