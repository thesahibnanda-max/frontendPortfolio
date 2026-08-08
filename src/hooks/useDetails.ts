import { useQuery } from '@tanstack/react-query'
import {
  getProfessionalDetails,
  getLeetcodeDetails,
  getCodeforcesDetails,
  getGitHubDetails,
  getPersonalityDetails,
  getProfileDetails,
} from '@/api/details'

// Public, unauthenticated, rarely-changing data (server-side config + hosted
// JSON) — safe to cache aggressively and skip refetch-on-focus.
const detailsQueryOptions = {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
} as const

export const useProfessionalDetails = () =>
  useQuery({ queryKey: ['details', 'professional'], queryFn: getProfessionalDetails, ...detailsQueryOptions })

export const useLeetcodeDetails = () =>
  useQuery({ queryKey: ['details', 'leetcode'], queryFn: getLeetcodeDetails, ...detailsQueryOptions })

export const useCodeforcesDetails = () =>
  useQuery({ queryKey: ['details', 'codeforces'], queryFn: getCodeforcesDetails, ...detailsQueryOptions })

export const useGitHubDetails = () =>
  useQuery({ queryKey: ['details', 'github'], queryFn: getGitHubDetails, ...detailsQueryOptions })

export const usePersonalityDetails = () =>
  useQuery({ queryKey: ['details', 'personality'], queryFn: getPersonalityDetails, ...detailsQueryOptions })

export const useProfileDetails = () =>
  useQuery({ queryKey: ['details', 'profile'], queryFn: getProfileDetails, ...detailsQueryOptions })
