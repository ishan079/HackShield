import React from 'react'

export type Theme = 'dark' | 'light'

export interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

export interface NavLinkItem {
  to: string
  label: string
}

export interface PillarItem {
  title: string
  subtitle?: string
  description: string
  icon: React.ReactNode
  accentColor?: string
}

export interface ProgramCardItem {
  index: string
  title: string
  duration: string
  description: string
  tag: string
  dotColor: string
}

export interface ProgramTrack {
  badge: string
  title: string
  timeline: string
  desc: string
  features: string[]
  linkText: string
}

export interface WeekItem {
  num: string
  phase: string
  title: string
  desc: string
  topics: string[]
}

export interface CTFCategory {
  name: string
  icon: React.ReactNode
  tag: string
  desc: string
}

export interface PastCTFEvent {
  title: string
  date: string
  type: string
  teams?: string
  firstPlace?: string
}

export interface MiniCTFSprint {
  id: string
  title: string
  status: string
  statusColor: string
  date: string
  duration: string
  challenges: string
  difficulty: string
  format: string
  reward: string
  description: string
  questions: string;
}

export interface MiniStatItem {
  label: string
  val: string
  icon: React.ReactNode
}

export interface TerminalLine {
  type: 'system' | 'cmd' | 'output' | 'success' | 'error'
  text?: string
  cmd?: string
}

export interface ResourceCategory {
  id: string
  label: string
}

export interface ResourceItem {
  id: string
  category: string
  title: string
  badge: string
  desc: string
  tags: string[]
  link: string
  icon: React.ReactNode
}

export interface TeamMember {
  name: string
  role: string
  email: string
  linkedin?: string
  website?: string
  badge: string
  image?: string
}

export interface StatItemType {
  value: number
  suffix?: string
  label: string
  sub: string
}

export interface TreeParticle {
  id: number
  nx: number
  ny: number
  char: string
  treeChar: string
  color: { r: number; g: number; b: number }
  baseOpacity: number
  currentOpacity: number
  targetOpacity: number
  fontSize: number
  flickerSpeed: number
  detachThreshold: number
  rainX: number
  rainY: number
  rainSpeed: number
  scrambleInterval: number
  scrambleTimer: number
  isHead: boolean
  isAmbient: boolean
  lingersAsRain: boolean
}

export interface AmbientParticle {
  id: number
  rainX: number
  rainY: number
  rainSpeed: number
  char: string
  color: { r: number; g: number; b: number }
  baseOpacity: number
  fontSize: number
  scrambleInterval: number
  scrambleTimer: number
  isHead: boolean
  isAmbient: boolean
}

export type SponsorTag = 'current' | 'previous'

export interface SponsorItem {
  id: string
  name: string
  logo: string
  tag: SponsorTag | string
  websiteUrl?: string
}

