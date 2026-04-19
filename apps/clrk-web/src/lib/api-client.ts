import axios from 'axios'
import { apiBaseUrl } from '#/lib/auth-client'

type ApiErrorPayload = {
  error?: string
  message?: string
}

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
})

export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    return error.response?.data?.error ?? error.response?.data?.message ?? fallbackMessage
  }

  return error instanceof Error ? error.message : fallbackMessage
}
