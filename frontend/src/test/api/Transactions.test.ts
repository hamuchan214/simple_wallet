import { describe, it, expect, vi, beforeEach } from 'vitest'
import axiosInstance from '../../utils/axios'
import { getTransactionsAll, createTransaction } from '../../api/Transactions'
import { getAuthToken } from '../../lib/localStorage'
import { AxiosError, AxiosResponse } from 'axios'

// axiosInstanceをモック化
vi.mock('../../utils/axios')
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

      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        status: 200,
        data: mockTransactions
      })

      const result = await getTransactionsAll()

      expect(result.success).toBe(true)
      expect(result.transactions).toEqual(mockTransactions)
    })

    it('handles unauthorized error', async () => {
      const error = new AxiosError()
      error.response = { status: 401, data: {}, headers: {}, config: {} } as AxiosResponse
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(error)

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

      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
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

      const error = new AxiosError()
      error.response = { status: 400, data: {}, headers: {}, config: {} } as AxiosResponse
      vi.mocked(axiosInstance.post).mockRejectedValueOnce(error)

      const result = await createTransaction(invalidTransaction)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid transaction data')
    })
  })
})