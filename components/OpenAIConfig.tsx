'use client'

import { useState, useEffect } from 'react'
import { Settings, Key, Eye, EyeOff, Check, X } from 'lucide-react'

interface OpenAIConfigProps {
  onApiKeyChange?: (apiKey: string) => void
}

export function OpenAIConfig({ onApiKeyChange }: OpenAIConfigProps) {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  // Carregar chave salva do localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key')
    if (savedKey) {
      setApiKey(savedKey)
      setIsValid(true)
      onApiKeyChange?.(savedKey)
    } else {
      setIsConfigOpen(true) // Abrir automaticamente se não tiver chave
    }
  }, [onApiKeyChange])

  const validateApiKey = (key: string) => {
    // Validação básica: deve começar com sk- e ter pelo menos 20 caracteres
    return key.startsWith('sk-') && key.length >= 20
  }

  const handleSaveKey = () => {
    if (validateApiKey(apiKey)) {
      localStorage.setItem('openai_api_key', apiKey)
      setIsValid(true)
      setIsConfigOpen(false)
      onApiKeyChange?.(apiKey)
    } else {
      setIsValid(false)
    }
  }

  const handleClearKey = () => {
    localStorage.removeItem('openai_api_key')
    setApiKey('')
    setIsValid(null)
    setIsConfigOpen(true)
    onApiKeyChange?.('')
  }

  return (
    <>
      {/* Botão de configuração */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsConfigOpen(!isConfigOpen)}
          className={`p-3 rounded-full shadow-lg transition-all ${
            isValid 
              ? 'bg-success-500 text-white hover:bg-success-600' 
              : 'bg-warning-500 text-white hover:bg-warning-600 animate-pulse'
          }`}
          title={isValid ? 'Configurações OpenAI' : 'Configurar chave OpenAI'}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Modal de configuração */}
      {isConfigOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Key className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Configuração OpenAI
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chave da API OpenAI
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value)
                      setIsValid(null)
                    }}
                    placeholder="sk-..."
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      isValid === false ? 'border-danger-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {isValid === false && (
                  <p className="text-sm text-danger-600 mt-1">
                    Chave inválida. Deve começar com "sk-" e ter pelo menos 20 caracteres.
                  </p>
                )}
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Como obter sua chave:</strong>
                </p>
                <ol className="text-sm text-blue-600 mt-1 space-y-1">
                  <li>1. Acesse <a href="https://platform.openai.com/api-keys" target="_blank" className="underline">platform.openai.com</a></li>
                  <li>2. Faça login na sua conta</li>
                  <li>3. Clique em "Create new secret key"</li>
                  <li>4. Copie e cole aqui</li>
                </ol>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveKey}
                  disabled={!apiKey.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4" />
                  Salvar
                </button>
                
                {isValid && (
                  <button
                    onClick={handleClearKey}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-danger-500 text-white rounded-lg hover:bg-danger-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Limpar
                  </button>
                )}
                
                {isValid && (
                  <button
                    onClick={() => setIsConfigOpen(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Fechar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}