import { useMemo } from 'react'
import { V4ArticleDataType } from '../config/types'

export const useV4Articles = () => {
  return useMemo(() => ({
    data: [] as V4ArticleDataType[],
    isLoading: false,
    error: null,
  }), [])
}

export const useV4NewsArticle = () => {
  return useMemo(() => ({
    data: [] as V4ArticleDataType[],
    isLoading: false,
    error: null,
  }), [])
}

export const useV4Featured = () => {
  return useMemo(() => ({
    data: [] as V4ArticleDataType[],
    isLoading: false,
    error: null,
  }), [])
}




