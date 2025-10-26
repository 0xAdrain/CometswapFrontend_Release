import { useMemo } from 'react'

export const useLatestArticle = () => {
  return useMemo(() => ({
    data: null,
    isLoading: false,
    error: null,
  }), [])
}

export const useAllNewsArticle = () => {
  return useMemo(() => ({
    data: [],
    isLoading: false,
    error: null,
  }), [])
}




