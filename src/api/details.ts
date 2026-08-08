import { api } from './client'
import type {
  ProfessionalDetailsResponse,
  LeetcodeDetailsResponse,
  CodeforcesDetailsResponse,
  GitHubDetailsResponse,
  PersonalityDetailsResponse,
  ProfileDetailsResponse,
} from './types'

export const getProfessionalDetails = () =>
  api.get<ProfessionalDetailsResponse>('/details/professional').then((r) => r.professionalDetails)

export const getLeetcodeDetails = () =>
  api.get<LeetcodeDetailsResponse>('/details/leetcode').then((r) => r.leetcodeDetails)

export const getCodeforcesDetails = () =>
  api.get<CodeforcesDetailsResponse>('/details/codeforces').then((r) => r.codeforcesDetails)

export const getGitHubDetails = () =>
  api.get<GitHubDetailsResponse>('/details/github').then((r) => r.githubDetails)

export const getPersonalityDetails = () =>
  api.get<PersonalityDetailsResponse>('/details/personality').then((r) => r.personalityDetails)

export const getProfileDetails = () =>
  api.get<ProfileDetailsResponse>('/details/profile').then((r) => r.profileDetails)
