export type IsoDateTime = string

export interface FieldValidationError {
  field: string
  issue: string
}

export interface ApiError {
  code: string
  message: string
  details?: FieldValidationError[] | Record<string, unknown> | null
}

export interface ApiSuccess<T> {
  success: true
  data: T
  timestamp: IsoDateTime
}

export interface ApiFailure {
  success: false
  error: ApiError
  timestamp: IsoDateTime
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure

export type MiniSprintStatus =
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_OPENING_SOON'
  | 'REGISTRATION_CLOSED'
  | 'LIVE'
  | 'COMPLETED'

export interface MiniSprintDto {
  id: string
  title: string
  status: MiniSprintStatus
  statusColor: string
  startsAt: IsoDateTime
  endsAt: IsoDateTime
  durationMinutes: number
  challengeCount: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mixed'
  format: 'Solo' | 'Duos' | 'Solo or Duos' | 'Teams'
  reward: string
  description: string
  registrationOpen: boolean
}

export interface MiniSprintRegistrationRequest {
  email: string
  pwnUsername: string
}

export interface MiniSprintRegistrationDto {
  registrationId: string
  sprintId: string
  email: string
  pwnUsername: string
  status: 'CONFIRMED' | 'WAITLISTED'
  arenaUrl: string | null
  registeredAt: IsoDateTime
}

export type FlagshipStatusCode =
  | 'REGISTRATION_OPENING_SOON'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSED'
  | 'LIVE'
  | 'COMPLETED'

export interface FlagshipStatusDto {
  title: string
  status: FlagshipStatusCode
  eventStart: IsoDateTime
  eventEnd: IsoDateTime
  registrationOpens: IsoDateTime
  registrationCloses: IsoDateTime
  serverTime: IsoDateTime
  prizePool: string
  minTeamSize: number
  maxTeamSize: number
}

export interface FlagshipRegistrationRequest {
  teamName: string
  email: string
  membersCount: number
}

export interface FlagshipRegistrationDto {
  registrationId: string
  teamName: string
  captainEmail: string
  membersCount: number
  status: 'PRE_REGISTERED' | 'CONFIRMED' | 'WAITLISTED'
  registeredAt: IsoDateTime
}

export interface ValidateFlagRequest {
  flag: string
}

export interface FlagValidationDto {
  correct: boolean
  pointsAwarded: number
  rank: number | null
  badgeEarned: string | null
  message: string
}

export interface TerminalChallengeDto {
  id: string
  title: string
  prompt: string
  ciphertext: string
  hint: string | null
  category: 'Crypto' | 'Web' | 'Pwn' | 'Reverse' | 'Forensics' | 'OSINT'
  points: number
}

export interface LiveStatDto {
  key: 'activeMembers' | 'ctfCompetitions' | 'handsOnLabs' | 'yearsOfExcellence'
  value: number
  suffix: string
  label: string
  sub: string
}

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export interface ProgramApplicationRequest {
  programId: string
  email: string
  experienceLevel: ExperienceLevel
  motivation?: string
}

export interface ProgramApplicationDto {
  applicationId: string
  programId: string
  email: string
  status: 'RECEIVED' | 'WAITLISTED' | 'ACCEPTED'
  submittedAt: IsoDateTime
}

export type ResourceCategoryId = 'platforms' | 'tools' | 'guides' | 'community'

export type ResourceIconKey =
  | 'terminal'
  | 'globe'
  | 'lock'
  | 'cpu'
  | 'code'
  | 'file'
  | 'bookmark'
  | 'community'

export interface ResourceDto {
  id: string
  category: ResourceCategoryId
  title: string
  badge: string
  description: string
  tags: string[]
  url: string
  icon: ResourceIconKey
}

export interface ResourceQuery {
  category?: ResourceCategoryId | 'all'
  search?: string
}

export interface ResourceListDto {
  items: ResourceDto[]
  total: number
}
