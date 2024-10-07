import { ReactNode, useEffect, useState, useCallback } from "react";
import { api } from "../lib/axios";
import { createContext } from "use-context-selector";

interface Trasaction {
    id: number
    description: string
    type: 'income' | 'outcome'
    category: string
    price: number
    createdAt: string
}

interface CreateTransactionInput {
    description: string
    type: 'income' | 'outcome'
    category: string
    price: number
}

interface TransactionContextType {
    transactions: Trasaction[]
    fetchTransactions: (query?: string) => Promise<void>
    createTransaction: (data: CreateTransactionInput) => Promise<void>
}

interface TransactionsProviderProps {
    children: ReactNode
}

export const TransactionsContext = createContext({} as TransactionContextType)

export function TransactionsProvider({ children }: TransactionsProviderProps) {

    const [transactions, setTransactions] = useState<Trasaction[]>([])

    const fetchTransactions = useCallback(async (query?: string) => {

        const response = await api.get('/transactions', {
            params: {
                _sort: 'createdAt',
                _order: 'desc',
                q: query
            }
        })

        setTransactions(response.data)
    }, [])

    const createTransaction = useCallback(async (data: CreateTransactionInput) => {
        const { description, price, category, type } = data

        const response = await api.post('/transactions', {
            description,
            price,
            category,
            type,
            createdAt: new Date()
        })

        setTransactions(state => [response.data, ...state])
    }, [])

    useEffect(() => {
        fetchTransactions()
    }, [fetchTransactions])

    return (
        <TransactionsContext.Provider value={{
            transactions,
            fetchTransactions,
            createTransaction
        }}>
            {children}
        </TransactionsContext.Provider>
    )
}

