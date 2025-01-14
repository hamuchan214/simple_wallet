import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { getTransactionsAll, createTransaction } from '../../api/Transactions'
import { getAuthToken } from '../../lib/localStorage'

// axiosをモック化
vi.mock('axios')
vi.mock('../../lib/localStorage')

describe('Transactions API', () => {
  beforeEach(() => {
    vi.mocked(getAuthToken).mockReturnValue('test-token')
  })

  describe('getTransactionsAll', () => {
    it('returns transactions when API call is successful', async () => {
      const mockTransactions = [
        { id: '1', amount: 1000, description: 'Test 1', date: '2024-01-01', userId: '1', tags: [] },
        { id: '2', amount: -2000, description: 'Test 2', date: '2024-01-02', userId: '1', tags: [] }
      ]

      vi.mocked(axios.get).mockResolvedValueOnce({
        status: 200,
        data: mockTransactions
      })

      const result = await getTransactionsAll()

      expect(result.success).toBe(true)
      expect(result.transactions).toEqual(mockTransactions)
    })

    it('handles unauthorized error', async () => {
      vi.mocked(axios.get).mockRejectedValueOnce({
        response: { status: 401 }
      })

      const result = await getTransactionsAll()

      expect(result.success).toBe(false)
      expect(result.error).toBe('Unauthorized')
    })
  })

  describe('createTransaction', () => {
    it('creates transaction successfully', async () => {
      const newTransaction = {
        amount: 1000,
        description: 'Test Transaction',
        date: '2024-01-01',
        tags: []
      }

      const mockResponse = {
        id: '1',
        userId: '1',
        ...newTransaction
      }

      vi.mocked(axios.post).mockResolvedValueOnce({
        status: 200,
        data: mockResponse
      })

      const result = await createTransaction(newTransaction)

      expect(result.success).toBe(true)
      expect(result.transaction).toEqual(mockResponse)
    })

    it('handles invalid data error', async () => {
      const invalidTransaction = {
        amount: 1000,
        description: 'Test',
        date: '2024-01-01',
        tags: []
      }

      vi.mocked(axios.post).mockRejectedValueOnce({
        response: { status: 400 }
      })

      const result = await createTransaction(invalidTransaction)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid transaction data')
    })
  })
}) 