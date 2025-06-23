'use client'

import { useState } from 'react'
import { CreditCard, DollarSign, TrendingDown, TrendingUp, Wallet } from 'lucide-react'

interface FinancialDashboardProps {
  budget: number
  onBudgetChange: (budget: number) => void
}

export function FinancialDashboard({ budget, onBudgetChange }: FinancialDashboardProps) {
  const [accounts] = useState([
    { name: 'Nubank', balance: 127.50, type: 'Conta Corrente' },
    { name: 'PicPay', balance: 23.80, type: 'Carteira Digital' },
    { name: 'Cartão de Crédito', balance: 450.00, type: 'Limite Disponível' }
  ])

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Wallet className="w-5 h-5 text-primary-600" />
        Dashboard Financeiro
      </h3>

      {/* Saldo Total */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary-600 font-medium">Saldo Total</p>
            <p className="text-2xl font-bold text-primary-700">
              R$ {totalBalance.toFixed(2)}
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-primary-600" />
        </div>
      </div>

      {/* Orçamento para Lanche */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Orçamento para o Lanche
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">R$</span>
          <input
            type="number"
            value={budget}
            onChange={(e) => onBudgetChange(Number(e.target.value))}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            min="0"
            step="0.50"
          />
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs">
          {budget <= totalBalance * 0.1 ? (
            <>
              <TrendingDown className="w-3 h-3 text-success-500" />
              <span className="text-success-600">Orçamento conservador</span>
            </>
          ) : budget <= totalBalance * 0.3 ? (
            <>
              <TrendingUp className="w-3 h-3 text-warning-500" />
              <span className="text-warning-600">Orçamento moderado</span>
            </>
          ) : (
            <>
              <TrendingUp className="w-3 h-3 text-danger-500" />
              <span className="text-danger-600">Orçamento alto</span>
            </>
          )}
        </div>
      </div>

      {/* Contas Disponíveis */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Contas Disponíveis</h4>
        <div className="space-y-2">
          {accounts.map((account, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{account.name}</p>
                  <p className="text-xs text-gray-500">{account.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  R$ {account.balance.toFixed(2)}
                </p>
                <p className={`text-xs ${
                  account.balance >= budget ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {account.balance >= budget ? 'Suficiente' : 'Insuficiente'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dicas de Economia */}
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
        <h4 className="text-sm font-medium text-yellow-800 mb-1">💡 Dica de Economia</h4>
        <p className="text-xs text-yellow-700">
          {budget > 30 ? 
            'Que tal usar ingredientes que já tem em casa? Pode economizar até 70%!' :
            'Ótimo orçamento! Você pode fazer um lanche delicioso e ainda sobrar dinheiro.'
          }
        </p>
      </div>
    </div>
  )
}