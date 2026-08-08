// Mirrors backendPortfolio's JSON contract. The backend serializes with
// `non_null` inclusion — absent optional data is omitted from the payload
// entirely, never sent as `null`. Every optional field below is therefore
// `field?: T`, not `field: T | null`.

// ---- Error envelope (every non-2xx response) ----
export interface ApiErrorPayload {
  showMessageAsIs: boolean
  errorMessage: string
}

// ---- Auth ----
export interface UserGateRequest {
  username: string
  password: string
}

// ---- /details/professional ----
export interface ProfessionalDetails {
  leetcodeLinks: string[]
  codeforcesLink: string[]
  githubLinks: string[]
  resumeLink: string
  profilePhotoLink: string[]
  websites?: string[]
  twitterUrl?: string
}

export interface ProfessionalDetailsResponse {
  professionalDetails: ProfessionalDetails
}

// ---- /details/leetcode ----
export interface LeetcodeDetails {
  username: string
  ranking?: number
  reputation?: number
  totalSolved?: number
  easySolved?: number
  mediumSolved?: number
  hardSolved?: number
  badges: string[]
  languageProblemsSolved: Record<string, number>
  advancedTagsSolved: Record<string, number>
  intermediateTagsSolved: Record<string, number>
  fundamentalTagsSolved: Record<string, number>
  contestRating?: number
  contestGlobalRanking?: number
  currentStreak?: number
  totalActiveDays?: number
}

export interface LeetcodeDetailsResponse {
  leetcodeDetails: LeetcodeDetails[]
}

// ---- /details/codeforces ----
export interface CodeforcesRatingTransition {
  contestName: string
  rank: number
  oldRating: number
  newRating: number
  contestTime: string // ISO-8601 instant
}

export interface CodeforcesDetails {
  handle: string
  currentRating?: number
  maxRating?: number
  contestsCount: number
  ratingHistory: CodeforcesRatingTransition[]
}

export interface CodeforcesDetailsResponse {
  codeforcesDetails: CodeforcesDetails[]
}

// ---- /details/github ----
export interface GitHubRepositorySummary {
  name: string
  description?: string
  htmlUrl: string
  language?: string
  stars: number
  forks: number
  updatedAt: string // ISO-8601 instant
}

export interface GitHubDetails {
  username: string
  name?: string
  avatarUrl: string
  bio?: string
  publicRepos: number
  followers: number
  following: number
  htmlUrl: string
  repositories: GitHubRepositorySummary[]
}

export interface GitHubDetailsResponse {
  githubDetails: GitHubDetails[]
}

// ---- /details/personality ----
export interface PersonalityHeight {
  feet?: number
  centimeters?: number
}

export interface PersonalityBasicInfo {
  nationality?: string
  gender?: string
  height?: PersonalityHeight
}

export interface PersonalityTraits {
  coreTraits?: string[]
  professionalTraits?: string[]
  workPreferences?: {
    preferredDomains?: string[]
    engineeringValues?: string[]
  }
  personalValues?: string[]
}

export interface PersonalitySportFavorite {
  favoriteTeam?: string
  favoritePlayer?: string
}

export interface PersonalityInterests {
  sports?: Record<string, PersonalitySportFavorite>
  fitness?: string[]
  technology?: string[]
}

export interface PersonalityTitledWork {
  title?: string
  genre?: string
}

export interface PersonalityArtist {
  name?: string
  type?: string
}

export interface PersonalityFavorites {
  movies?: PersonalityTitledWork[]
  games?: PersonalityTitledWork[]
  artists?: PersonalityArtist[]
  sportsIcons?: Record<string, string>
}

export interface PersonalityLifestyle {
  fitnessFocused?: boolean
  sportsEnthusiast?: boolean
  technologyEnthusiast?: boolean
  continuousLearning?: boolean
}

export interface PersonalityLanguage {
  name?: string
  proficiency?: string
}

// Physical-appearance data is fetched but intentionally not rendered in any
// dedicated UI section (product decision) — kept typed so the AI-context
// path stays fully typed if ever surfaced later.
export interface PersonalityPhysicalAppearance {
  bodyType?: string
  physique?: string
  fitnessLevel?: string
  strongestMuscleGroup?: string
  fitnessGoals?: string[]
  hair?: { color?: string; texture?: string; style?: string }
  eyes?: { color?: string }
  skinTone?: string
  face?: { shape?: string; eyebrows?: string; facialHair?: string }
  accessories?: { wearsGlasses?: boolean }
  fashion?: { style?: string; favoriteColors?: string[] }
}

export interface PersonalProfile {
  basicInfo?: PersonalityBasicInfo
  physicalAppearance?: PersonalityPhysicalAppearance
  personality?: PersonalityTraits
  interests?: PersonalityInterests
  favorites?: PersonalityFavorites
  lifestyle?: PersonalityLifestyle
  languages?: PersonalityLanguage[]
}

export interface PersonalityDetails {
  personalProfile?: PersonalProfile
  aboutMe?: string
}

export interface PersonalityDetailsResponse {
  personalityDetails: PersonalityDetails
}

// ---- /details/profile ----
export interface ProfileProject {
  name?: string
  year?: number
  description?: string[]
  technologies?: string[]
}

export interface ProfileExperience {
  company?: string
  location?: string
  employmentType?: string
  title?: string
  startDate?: string // YYYY-MM
  endDate?: string // YYYY-MM
  description?: string[]
  technologies?: string[]
}

export interface ProfileEducation {
  institution?: string
  degree?: string
  field?: string
  startDate?: string // YYYY-MM
  endDate?: string // YYYY-MM
  grade?: string
}

export interface ProfileIdentity {
  name?: string
  email?: string
}

export interface ProfileDetails {
  profileDetails?: ProfileIdentity
  projects?: ProfileProject[]
  languages?: string[]
  achievements?: string[]
  experience?: ProfileExperience[]
  education?: ProfileEducation[]
  skillsByCategory?: Record<string, string[]>
  leetcodeUsernames: string[]
  codeforcesUsernames: string[]
  githubUsernames: string[]
  linkedinUrl?: string
  twitterUrl?: string
  websites?: string[]
  countryName?: string
}

export interface ProfileDetailsResponse {
  profileDetails: ProfileDetails
}

// ---- Chat ----
export type MessageRole = 'USER' | 'ASSISTANT'

export interface Message {
  role: MessageRole
  message: string
  timestamp: string // ISO-8601 instant
}

export interface ChatObject {
  chatId: string
  username: string
  chatTitle: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export interface ListOfChatResponse {
  chats: ChatObject[]
}

export interface ChatResponse {
  chat: ChatObject
}

export interface SearchResponse {
  chats: ChatObject[]
  scores: Record<string, number>
}

export interface ChatRequest {
  chatId?: string
  chatTitle?: string
  message?: string
}

export interface SearchRequest {
  query: string
}
