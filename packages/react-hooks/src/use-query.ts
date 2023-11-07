import { useMemo } from 'react'
import { useLocation } from 'react-router'

export const useQuery = () => {
  const location = useLocation()
  const params = useMemo(() => new URLSearchParams(location.search), [location.search])
  return params
}
