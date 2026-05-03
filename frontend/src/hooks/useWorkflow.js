import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'

export function useWorkflow() {
  return useQuery({
    queryKey: ['workflow'],
    queryFn: async () => {
      const res = await api.get('/workflow')
      return res.data
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useMarkStepComplete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ step, status = 'completed' }) => {
      const res = await api.patch('/workflow/step', { step, status })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow'] })
    },
  })
}

export function useGenerateWorkflow() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/workflow/generate')
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow'] })
    },
  })
}
