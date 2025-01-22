import { describe, it, expect, vi, beforeEach } from 'vitest'
import axiosInstance from '../../utils/axios'
import { RequestLogin, RequestRegister } from '../../api/User'
import { setAuthToken } from '../../utils/axios'
import { setSession } from '../../lib/localStorage'
import { AxiosError, AxiosResponse } from 'axios'

vi.mock('../../utils/axios')
vi.mock('../../lib/localStorage')

describe('User API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('RequestRegister', () => {
    it('registers successfully', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        status: 201
      })

      const result = await RequestRegister('newuser', 'password')
      expect(result.success).toBe(true)
    })
  })

  describe('RequestLogin', () => {
    it('logs in successfully', async () => {
      const mockResponse = {
        status: 200,
        data: {
          token: 'test-token',
          id: 'test-id'
        }
      }

      vi.mocked(axiosInstance.post).mockResolvedValueOnce(mockResponse)

      const result = await RequestLogin('testuser', 'password')

      expect(result.success).toBe(true)
      expect(result.username).toBe('testuser')
      expect(setAuthToken).toHaveBeenCalledWith('test-token')
      expect(setSession).toHaveBeenCalledWith('test-token', 'test-id', 'testuser')
    })

    it('handles invalid credentials', async () => {
      const error = new AxiosError()
      error.response = { status: 400, data: {}, headers: {}, config: {} } as AxiosResponse
      vi.mocked(axiosInstance.post).mockRejectedValueOnce(error)

      const result = await RequestLogin('wrong', 'wrong')

      expect(result.success).toBe(false)
      expect(result.error).toBe('ユーザー名またはパスワードが無効です')
    })
  })
})