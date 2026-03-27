"use client"

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react"
import * as n5_2021_s2 from "@/data/past-papers/n5-2021-section2"
import * as n5_2022_s2 from "@/data/past-papers/n5-2022-section2"
import * as n5_2023_s2 from "@/data/past-papers/n5-2023-section2"
import * as n5_2024_s2 from "@/data/past-papers/n5-2024-section2"
import * as n5_2025_s2 from "@/data/past-papers/n5-2025-section2"
import { SUBJECT_LEVEL_OUTCOMES, type Outcome } from "@/data/outcomes"
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Award,
  Eye,
  EyeOff,
  FileText,
  MousePointer2,
  Atom,
  Sparkles,
  Zap,
  Loader2,
  Menu,
  X,
  Moon,
  Sun,
  Table2,
  CheckCircle2,
  Settings2,
  Pencil,
  Minus,
  Circle,
  Square,
  Type,
  Eraser,
  Trash2,
  Grid3X3,
  ClipboardList,
  BookOpen,
  Clock,
  AlertTriangle,
  ArrowLeftRight,
  Key,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Lightbulb,
  LogIn,
  LogOut,
  UserCircle,
  Users,
  GraduationCap,
  ChevronDown,
  Plus,
  UserPlus,
  Copy,
  CheckCheck,
  Upload,
  BookMarked,
  RefreshCw,
  Keyboard,
  Target,
  LayoutGrid,
  Workflow,
  GitFork,
  FlaskConical,
  Sigma,
  PoundSterling,
} from "lucide-react"

// Trinity High School Maroon: #800000
// Trinity High School Gold: #D4AF37

const QA_SUBTOPICS: Record<string, string[]> = {
  "National 5": [
    "Vectors and Scalars",
    "Velocity-time graphs",
    "Acceleration",
    "Newton's Laws",
    "Projectile Motion",
    "Space Exploration",
    "Cosmology",
    "Specific Heat Capacity",
    "Pressure, Kinetic Theory and Gas Laws",
    "Current, voltage and resistance",
    "Electrical Power",
    "Specific Latent Heat",
    "Nuclear Radiation",
    "Wave properties",
    "Refraction of light",
    "EM Spectrum",
  ],
  Higher: [
    "Equations of Motion",
    "Forces, Energy and Power",
    "Collisions, Momentum and Impulse",
    "Gravitation",
    "Special Relativity",
    "The Expanding Universe",
    "The Standard Model",
    "Forces on Charged Particles",
    "Nuclear Reactions",
    "Inverse Square Law",
    "Wave-Particle Duality",
    "Interference",
    "Refraction",
    "Spectra",
    "Rayleigh Criterion",
    "Monitoring and Measuring AC",
    "Current, Potential Difference, Power and Resistance",
    "Electrical Sources and Internal Resistance",
    "Capacitors",
    "Semiconductors",
  ],
  "Advanced Higher": [
    "Kinematic Relationships",
    "Angular Motion",
    "Rotational Dynamics",
    "Angular Momentum",
    "Gravitation",
    "General Relativity",
    "Stellar Physics",
    "Introduction to Quantum Theory",
    "Particles from Space",
    "Simple Harmonic Motion",
    "Waves",
    "Interference",
    "Polarisation",
    "Electrostatics",
    "Electromagnetism",
    "Capacitance and Inductance",
    "Uncertainties",
  ],
  "Chemistry-National 5": [
    "Rates of Reaction",
    "Atomic Structure",
    "Bonding and Structure",
    "Formulae and Reacting Quantities",
    "Acids and Bases",
    "Homologous Series & Hydrocarbons",
    "Everyday Consumer Products",
    "Energy from Fuels",
    "Metals",
    "Plastics",
    "Fertilisers",
    "Nuclear Chemistry",
    "Chemical Analysis",
  ],
}

type AppMode = "mc" | "paper" | "retrieval" | "definitions" | "calculations" | "problem-solving" | "essay" | "assignment" | "practice" | "exam-paper" | "stripboarding" | "block-diagrams" | "logic-gates" | "testing" | "symbols" | "costing" | null
type TimingMode = "relaxed" | "exam" | "none"
type ViewType = "subject-select" | "landing" | "mode" | "setup" | "quiz" | "results" | "definitions" | "calculations" | "assignment" | "exam-paper" | "electronics-tool"

type SubjectId = "Physics" | "Biology" | "Chemistry" | "Practical Electronics"

/** Returns the subject-qualified level key used as a lookup key in QA_SUBTOPICS and DEF_UNIT_TOPICS/DEFINITIONS_BANK. */
function getDefLevelKey(subject: SubjectId | string | undefined, level: string): string {
  return subject === "Chemistry" ? `${subject}-${level}` : level
}

/** Returns the subtopic list for the given subject and level, falling back to the level-only list. */
function getSubtopics(subject: SubjectId | string | undefined, level: string): string[] {
  return QA_SUBTOPICS[`${subject}-${level}`] || QA_SUBTOPICS[level] || []
}

interface Subject {
  id: SubjectId
  label: string
  desc: string
  dept: string
}

const SUBJECTS: Subject[] = [
  { id: "Physics", label: "Physics", desc: "Mechanics, Electricity, Waves & more", dept: "Physics Dept" },
  { id: "Biology", label: "Biology", desc: "Cells, Organisms, Ecosystems & more", dept: "Biology Dept" },
  { id: "Chemistry", label: "Chemistry", desc: "Bonding, Reactions, Analysis & more", dept: "Chemistry Dept" },
  { id: "Practical Electronics", label: "Practical Electronics", desc: "Circuits, Components & Electronics", dept: "Physics Dept" },
]

// Exam dates for each subject (all exams at the same date regardless of level)
const EXAM_DATES: Partial<Record<SubjectId, string>> = {
  Physics: "2026-05-21",
  Chemistry: "2026-05-12",
  "Practical Electronics": "2026-05-07",
  Biology: "2026-04-28",
}

interface MCQuestion {
  type: "mc"
  topic: string
  subtopic: string
  question: string
  options: string[]
  answer: number
  explanation: string
  sourcePaperId?: string
}

interface PaperPart {
  id: string
  text: string
  marks: number
  answer: string
  markingScheme: string
  dependsOn?: string[]
  featureTag?: "standard" | "a-level" | "open-ended"
  topicTag?: string
}

interface PaperQuestion {
  type: "paper"
  topic: string
  subtopic: string
  question: string
  parts: PaperPart[]
  sourcePaperId?: string
}

type Question = MCQuestion | PaperQuestion

// --- Past Paper Banks ---

interface PastPaperMeta {
  id: string
  label: string
  source: string
  questions: Question[]
}

const PAST_PAPER_BANKS: Record<string, PastPaperMeta[]> = {
  "National 5": [
    {
      id: "n5-2025-s2",
      label: "N5 2025 — Section 2",
      source: n5_2025_s2.source,
      questions: n5_2025_s2.questions as unknown as Question[],
    },
    {
      id: "n5-2024-s2",
      label: "N5 2024 — Section 2",
      source: n5_2024_s2.source,
      questions: n5_2024_s2.questions as unknown as Question[],
    },
    {
      id: "n5-2023-s2",
      label: "N5 2023 — Section 2",
      source: n5_2023_s2.source,
      questions: n5_2023_s2.questions as unknown as Question[],
    },
    {
      id: "n5-2022-s2",
      label: "N5 2022 — Section 2",
      source: n5_2022_s2.source,
      questions: n5_2022_s2.questions as unknown as Question[],
    },
    {
      id: "n5-2021-s2",
      label: "N5 2021 — Section 2",
      source: n5_2021_s2.source,
      questions: n5_2021_s2.questions as unknown as Question[],
    },
  ],
}

// --- Auth Types & Helpers ---

type AccountType = "pupil" | "teacher"

interface UserAccount {
  id: string
  name: string
  email: string
  accountType: AccountType
  password?: string
  isTestAccount?: boolean
  subjectLevels?: Partial<Record<SubjectId, string>>  // "National 5" | "Higher" | "Advanced Higher" | "not sitting"
  lastLogin?: number  // timestamp in ms
  totalSessions?: number  // number of times signed in
  disableModeLocking?: boolean  // pupils only: opt-out of progressive mode locking
}

// Hardcoded test accounts — always available regardless of localStorage state.
// Password format "test:<plaintext>" is recognised by verifyPassword below.
const TEST_ACCOUNT_PASSWORD = "Trinfinity1"
const TEST_ACCOUNTS: UserAccount[] = [
  {
    id: "test-pupil-1",
    name: "Test Pupil One",
    email: "testpupil1@trinfinity.test",
    accountType: "pupil",
    password: `test:${TEST_ACCOUNT_PASSWORD}`,
    isTestAccount: true,
    subjectLevels: { Physics: "National 5", Biology: "National 5", Chemistry: "not sitting", "Practical Electronics": "not sitting" },
  },
  {
    id: "test-pupil-2",
    name: "Test Pupil Two",
    email: "testpupil2@trinfinity.test",
    accountType: "pupil",
    password: `test:${TEST_ACCOUNT_PASSWORD}`,
    isTestAccount: true,
    subjectLevels: { Physics: "Higher", Biology: "not sitting", Chemistry: "Higher", "Practical Electronics": "National 5" },
  },
  {
    id: "test-teacher-1",
    name: "Test Teacher One",
    email: "testteacher1@trinfinity.test",
    accountType: "teacher",
    password: `test:${TEST_ACCOUNT_PASSWORD}`,
    isTestAccount: true,
  },
  {
    id: "test-teacher-2",
    name: "Test Teacher Two",
    email: "testteacher2@trinfinity.test",
    accountType: "teacher",
    password: `test:${TEST_ACCOUNT_PASSWORD}`,
    isTestAccount: true,
  },
]

interface ClassGroup {
  id: string
  name: string
  teacherId: string
  memberIds: string[]
  code: string
}

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

async function hashPassword(password: string): Promise<string> {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    throw new Error("Secure password hashing is not available in this environment.")
  }
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, "0")).join("")
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  )
  const hashBuffer = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  )
  const hashHex = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("")
  return `${saltHex}$${hashHex}`
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  // Test accounts use a plain-text prefix instead of PBKDF2
  if (stored.startsWith("test:")) {
    return password === stored.slice(5)
  }
  if (typeof crypto === "undefined" || !crypto.subtle) {
    throw new Error("Secure password verification is not available in this environment.")
  }
  const [saltHex, hashHex] = stored.split("$")
  if (!saltHex || !hashHex) return false
  const salt = new Uint8Array((saltHex.match(/.{2}/g) ?? []).map((b) => parseInt(b, 16)))
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  )
  const hashBuffer = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  )
  const computedHash = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("")
  return computedHash === hashHex
}

function generateClassCode(): string {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const arr = new Uint8Array(4)
    crypto.getRandomValues(arr)
    return Array.from(arr, (b) => b.toString(36)).join("").slice(0, 6).toUpperCase()
  }
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

function loadAccounts(): UserAccount[] {
  if (typeof window === "undefined") return TEST_ACCOUNTS
  try {
    const stored: UserAccount[] = JSON.parse(localStorage.getItem("trinfinity_accounts") || "[]")
    // Always include the hardcoded test accounts, then any non-test user accounts
    const userAccounts = stored.filter((a) => !a.isTestAccount)
    return [...TEST_ACCOUNTS, ...userAccounts]
  } catch {
    return TEST_ACCOUNTS
  }
}

function saveAccounts(accounts: UserAccount[]): void {
  if (typeof window === "undefined") return
  // Never persist test accounts to localStorage — they are always injected at load time
  const userAccounts = accounts.filter((a) => !a.isTestAccount)
  localStorage.setItem("trinfinity_accounts", JSON.stringify(userAccounts))
}

function loadCurrentUser(): UserAccount | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem("trinfinity_current_user")
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveCurrentUser(user: UserAccount | null): void {
  if (typeof window === "undefined") return
  if (user) localStorage.setItem("trinfinity_current_user", JSON.stringify(user))
  else localStorage.removeItem("trinfinity_current_user")
}

function loadClassGroups(): ClassGroup[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem("trinfinity_class_groups") || "[]")
  } catch {
    return []
  }
}

function saveClassGroups(groups: ClassGroup[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem("trinfinity_class_groups", JSON.stringify(groups))
}

// --- Definitions Mode Types & Data ---

interface DefinitionEntry {
  term: string
  definition: string
  topic: string
  level: string
  keywords: string[]
}

interface DefMCQuestion {
  type: "def-mc"
  entry: DefinitionEntry
  options: string[]
  answer: number
}

interface DefClozeQuestion {
  type: "def-cloze"
  entry: DefinitionEntry
  keywords: string[]
  blankedDefinition: string
}

interface DefMatchQuestion {
  type: "def-match"
  pairs: { term: string; definition: string }[]
}

type DifficultyLevel = "easy" | "medium" | "hard"

interface DefProgress {
  correct: number
  incorrect: number
  lastSeen: number
  missedKeywords: string[]
}

// Tracks which (topic, quizType, difficulty) combinations have been completed
// Key format: `${topic}::${quizType}::${difficulty}`
type DefCompletion = Record<string, boolean>

interface DefSpotMistakeQuestion {
  type: "def-spot-mistake"
  entry: DefinitionEntry
  wrongStatement: string
  wrongWord: string
  correctWord: string
  options: string[]
  answer: number
}

interface DefSwappedQuestion {
  type: "def-swapped"
  pairs: { term: string; correctDef: string; displayedDef: string; isSwapped: boolean }[]
}

interface DefKeywordBuilderQuestion {
  type: "def-keyword-builder"
  entry: DefinitionEntry
  scrambledWords: string[]
  correctWords: string[]
}

type DefQuestion = DefMCQuestion | DefClozeQuestion | DefMatchQuestion | DefSpotMistakeQuestion | DefSwappedQuestion | DefKeywordBuilderQuestion

const DEFINITIONS_BANK: DefinitionEntry[] = [
  // National 5 — Vectors and Scalars
  { term: "Vector", definition: "A quantity that has both magnitude and direction", topic: "Vectors and Scalars", level: "National 5", keywords: ["magnitude", "direction"] },
  { term: "Scalar", definition: "A quantity that has magnitude only", topic: "Vectors and Scalars", level: "National 5", keywords: ["magnitude"] },
  { term: "Resultant", definition: "The single equivalent vector that produces the same effect as two or more vectors combined", topic: "Vectors and Scalars", level: "National 5", keywords: ["equivalent", "vector"] },

  // National 5 — Velocity-time graphs
  { term: "Velocity", definition: "The rate of change of displacement; a vector quantity with both magnitude and direction", topic: "Velocity-time graphs", level: "National 5", keywords: ["displacement", "direction"] },
  { term: "Displacement", definition: "The distance travelled in a specified direction from a starting point", topic: "Velocity-time graphs", level: "National 5", keywords: ["distance", "direction"] },
  { term: "Uniform velocity", definition: "Motion in which equal distances are covered in equal time intervals in the same direction", topic: "Velocity-time graphs", level: "National 5", keywords: ["distances", "time"] },

  // National 5 — Acceleration
  { term: "Acceleration", definition: "The rate of change of velocity", topic: "Acceleration", level: "National 5", keywords: ["velocity"] },
  { term: "Deceleration", definition: "A negative acceleration where an object is slowing down", topic: "Acceleration", level: "National 5", keywords: ["negative", "slowing"] },

  // National 5 — Newton's Laws
  { term: "Newton's First Law", definition: "An object remains at rest or in uniform motion unless acted upon by an unbalanced force", topic: "Newton's Laws", level: "National 5", keywords: ["unbalanced", "force"] },
  { term: "Newton's Second Law", definition: "The unbalanced force on an object equals the product of its mass and acceleration", topic: "Newton's Laws", level: "National 5", keywords: ["mass", "acceleration"] },
  { term: "Newton's Third Law", definition: "Every action has an equal and opposite reaction force acting on a different object", topic: "Newton's Laws", level: "National 5", keywords: ["equal", "opposite"] },
  { term: "Friction", definition: "A contact force that opposes the relative motion of two surfaces", topic: "Newton's Laws", level: "National 5", keywords: ["opposes", "motion"] },

  // National 5 — Projectile Motion
  { term: "Projectile", definition: "An object given an initial velocity that then moves under gravity alone", topic: "Projectile Motion", level: "National 5", keywords: ["gravity", "velocity"] },

  // National 5 — Space Exploration
  { term: "Gravitational field strength", definition: "The gravitational force acting per unit mass at a point in a gravitational field", topic: "Space Exploration", level: "National 5", keywords: ["force", "mass"] },
  { term: "Weight", definition: "The gravitational force acting on an object due to its mass", topic: "Space Exploration", level: "National 5", keywords: ["gravitational", "force"] },

  // National 5 — Cosmology
  { term: "Light year", definition: "The distance light travels in one year through a vacuum", topic: "Cosmology", level: "National 5", keywords: ["distance", "light"] },
  { term: "Big Bang", definition: "The theory that the universe began as an extremely hot, dense point and has been expanding ever since", topic: "Cosmology", level: "National 5", keywords: ["universe", "expanding"] },

  // National 5 — Specific Heat Capacity
  { term: "Specific heat capacity", definition: "The energy required to raise the temperature of 1 kg of a substance by 1°C", topic: "Specific Heat Capacity", level: "National 5", keywords: ["energy", "temperature"] },
  { term: "Thermal energy", definition: "The energy stored internally in a substance due to the motion of its particles", topic: "Specific Heat Capacity", level: "National 5", keywords: ["energy", "particles"] },

  // National 5 — Pressure, Kinetic Theory and Gas Laws
  { term: "Pressure", definition: "The force acting per unit area on a surface", topic: "Pressure, Kinetic Theory and Gas Laws", level: "National 5", keywords: ["force", "area"] },
  { term: "Kinetic theory", definition: "The model that describes gas behaviour by considering the random motion of particles", topic: "Pressure, Kinetic Theory and Gas Laws", level: "National 5", keywords: ["random", "motion"] },

  // National 5 — Current, voltage and resistance
  { term: "Electric current", definition: "The rate of flow of electric charge", topic: "Current, voltage and resistance", level: "National 5", keywords: ["charge"] },
  { term: "Potential difference", definition: "The energy transferred per unit charge between two points in a circuit", topic: "Current, voltage and resistance", level: "National 5", keywords: ["energy", "charge"] },
  { term: "Resistance", definition: "The opposition to the flow of electric current in a conductor", topic: "Current, voltage and resistance", level: "National 5", keywords: ["opposition", "current"] },

  // National 5 — Electrical Power
  { term: "Power", definition: "The rate at which energy is transferred or work is done", topic: "Electrical Power", level: "National 5", keywords: ["energy", "rate"] },

  // National 5 — Specific Latent Heat
  { term: "Specific latent heat", definition: "The energy required to change the state of 1 kg of a substance without a change in temperature", topic: "Specific Latent Heat", level: "National 5", keywords: ["energy", "state", "temperature"] },

  // National 5 — Nuclear Radiation
  { term: "Alpha particle", definition: "A helium nucleus consisting of 2 protons and 2 neutrons emitted from a radioactive nucleus", topic: "Nuclear Radiation", level: "National 5", keywords: ["protons", "neutrons"] },
  { term: "Beta particle", definition: "A fast-moving electron emitted from a nucleus during radioactive decay", topic: "Nuclear Radiation", level: "National 5", keywords: ["electron", "nucleus"] },
  { term: "Gamma ray", definition: "A high-frequency electromagnetic wave emitted from an excited nucleus", topic: "Nuclear Radiation", level: "National 5", keywords: ["electromagnetic", "nucleus"] },
  { term: "Half-life", definition: "The time taken for half the radioactive nuclei in a sample to decay", topic: "Nuclear Radiation", level: "National 5", keywords: ["decay", "time"] },

  // National 5 - Waves
  { term: "Longitudinal Wave", definition: "A longitudinal wave is one where oscillations are parallel to the direction of energy transfer", topic: "Waves", level: "National 5", keywords: ["oscillations", "energy", "parallel"] },
  { term: "Transverse Wave", definition: "A Transverse wave is one where oscillations are perpendicular to the direction of energy transfer", topic: "Waves", level: "National 5", keywords: ["oscillations", "perpendicular"] },
  { term: "Frequency", definition: "The number of waves produced per second.", topic: "Waves", level: "National 5", keywords: ["number", "waves", "second"] },
  { term: "Period", definition: "The time taken to produce 1 wave.", topic: "Waves", level: "National 5", keywords: ["time", "1 wave"] },
  { term: "Crest", definition: "The top point (peak) of a wave.", topic: "Waves", level: "National 5", keywords: ["peak", "top point"] },
  { term: "Trough", definition: "The bottom point of a wave.", topic: "Waves", level: "National 5", keywords: ["bottom point"] },
  { term: "Amplitude", definition: "The vertical distance from the axis to the top of the wave (crest) or bottom of the wave (trough). It is also half the vertical height of the wave.", topic: "Waves", level: "National 5", keywords: ["vertical distance", "height", "peak", "trough"] },
  { term: "Wavelength", definition: "The distance between any two repeated points on adjacent waves.", topic: "Waves", level: "National 5", keywords: ["distance", "adjacent", "repeated"] },
  { term: "Wave Speed", definition: "The distance travelled per second.", topic: "Waves", level: "National 5", keywords: ["distance per second"] },
  { term: "Diffraction", definition: "The bending of waves through gaps or around obstacles.", topic: "Waves", level: "National 5", keywords: ["bending", "gaps", "obstacles"] },

  // National 5 - EM Spectrum
  { term: "Electromagnetic Spectrum", definition: "A group of all the types of electromagnetic radiation ordered in terms of their wavelength/frequency.", topic: "EM Spectrum", level: "National 5", keywords: ["radiation", "wavelength", "frequency"] },
  { term: "Refraction", definition: "The change in speed of light as it passes between media.", topic: "Refraction of Light", level: "National 5", keywords: ["change in speed", "medium", "between"] },
  { term: "Normal", definition: "A dashed line that is drawn perpendicular (at 90°) to any surface.", topic: "Refraction of Light", level: "National 5", keywords: ["perpendicular"] },
  { term: "Angle of Incidence", definition: "The angle measured between the incident ray and the normal.", topic: "Refraction of Light", level: "National 5", keywords: ["incident ray", "normal"] },
  { term: "Angle of Refraction", definition: "The angle measured between the refracted ray and the normal.", topic: "Refraction of Light", level: "National 5", keywords: ["refracted ray", "normal"] },

  // Higher — Equations of Motion
  { term: "Uniform acceleration", definition: "Motion where the rate of change of velocity remains constant over time", topic: "Equations of Motion", level: "Higher", keywords: ["constant", "velocity"] },

  // Higher — Forces, Energy and Power
  { term: "Work", definition: "The energy transferred when a force causes displacement in the direction of the force", topic: "Forces, Energy and Power", level: "Higher", keywords: ["energy", "force", "displacement"] },
  { term: "Kinetic energy", definition: "The energy an object possesses due to its motion", topic: "Forces, Energy and Power", level: "Higher", keywords: ["motion"] },
  { term: "Gravitational potential energy", definition: "The energy stored in an object due to its height in a gravitational field", topic: "Forces, Energy and Power", level: "Higher", keywords: ["height", "gravitational"] },

  // Higher — Collisions, Momentum and Impulse
  { term: "Momentum", definition: "The product of an object's mass and velocity; a vector quantity", topic: "Collisions, Momentum and Impulse", level: "Higher", keywords: ["mass", "velocity"] },
  { term: "Conservation of momentum", definition: "The total momentum of a closed system remains constant when no external forces act", topic: "Collisions, Momentum and Impulse", level: "Higher", keywords: ["constant", "external"] },
  { term: "Impulse", definition: "The change in momentum of an object; equal to the product of force and the time it acts", topic: "Collisions, Momentum and Impulse", level: "Higher", keywords: ["momentum", "force", "time"] },
  { term: "Elastic collision", definition: "A collision in which both momentum and kinetic energy are conserved", topic: "Collisions, Momentum and Impulse", level: "Higher", keywords: ["kinetic", "momentum", "conserved"] },
  { term: "Inelastic collision", definition: "A collision in which momentum is conserved but kinetic energy is not conserved", topic: "Collisions, Momentum and Impulse", level: "Higher", keywords: ["momentum", "kinetic"] },

  // Higher — Gravitation
  { term: "Newton's Law of Universal Gravitation", definition: "Every object attracts every other object with a force proportional to the product of their masses and inversely proportional to the square of the distance between them", topic: "Gravitation", level: "Higher", keywords: ["masses", "distance"] },
  { term: "Gravitational field", definition: "A region of space in which an object with mass experiences a force", topic: "Gravitation", level: "Higher", keywords: ["mass", "force"] },

  // Higher — Special Relativity
  { term: "Time dilation", definition: "The slowing of time experienced by an object moving at high speed relative to a stationary observer", topic: "Special Relativity", level: "Higher", keywords: ["time", "speed"] },
  { term: "Length contraction", definition: "The shortening of an object in the direction of motion as observed from a stationary reference frame", topic: "Special Relativity", level: "Higher", keywords: ["shortening", "motion"] },
  { term: "Proper time", definition: "The time interval measured by a clock that is at rest relative to the events being observed", topic: "Special Relativity", level: "Higher", keywords: ["rest", "clock"] },
  { term: "Rest mass", definition: "The mass of an object measured when it is stationary relative to the observer", topic: "Special Relativity", level: "Higher", keywords: ["stationary", "observer"] },

  // Higher — The Expanding Universe
  { term: "Hubble's Law", definition: "The recession speed of a galaxy is proportional to its distance from us", topic: "The Expanding Universe", level: "Higher", keywords: ["recession", "distance"] },
  { term: "Red shift", definition: "The shift of spectral lines toward longer wavelengths due to the recession of a light source", topic: "The Expanding Universe", level: "Higher", keywords: ["wavelengths", "recession"] },

  // Higher — The Standard Model
  { term: "Quark", definition: "A fundamental particle that combines with other quarks to form hadrons such as protons and neutrons", topic: "The Standard Model", level: "Higher", keywords: ["fundamental", "hadrons"] },
  { term: "Lepton", definition: "A fundamental particle such as the electron or neutrino that does not experience the strong nuclear force", topic: "The Standard Model", level: "Higher", keywords: ["electron", "strong"] },
  { term: "Hadron", definition: "A composite particle made of quarks bound together by the strong nuclear force", topic: "The Standard Model", level: "Higher", keywords: ["quarks", "strong"] },
  { term: "Antimatter", definition: "Matter composed of antiparticles that have the same mass as their corresponding particles but opposite charge", topic: "The Standard Model", level: "Higher", keywords: ["antiparticles", "charge"] },

  // Higher — Forces on Charged Particles
  { term: "Electric field", definition: "A region of space in which a charged particle experiences an electric force", topic: "Forces on Charged Particles", level: "Higher", keywords: ["charged", "force"] },
  { term: "Magnetic force", definition: "The force experienced by a moving charged particle in a magnetic field", topic: "Forces on Charged Particles", level: "Higher", keywords: ["moving", "charged"] },

  // Higher — Nuclear Reactions
  { term: "Nuclear fission", definition: "The splitting of a large nucleus into smaller nuclei accompanied by the release of energy", topic: "Nuclear Reactions", level: "Higher", keywords: ["splitting", "energy"] },
  { term: "Nuclear fusion", definition: "The joining of two light nuclei to form a heavier nucleus accompanied by the release of energy", topic: "Nuclear Reactions", level: "Higher", keywords: ["joining", "energy"] },
  { term: "Binding energy", definition: "The energy required to completely separate all the nucleons in a nucleus", topic: "Nuclear Reactions", level: "Higher", keywords: ["nucleons", "separate"] },
  { term: "Mass defect", definition: "The difference between the mass of a nucleus and the sum of the masses of its individual nucleons", topic: "Nuclear Reactions", level: "Higher", keywords: ["mass", "nucleons"] },

  // Higher — Inverse Square Law
  { term: "Inverse square law", definition: "The intensity of radiation decreases in proportion to the square of the distance from the source", topic: "Inverse Square Law", level: "Higher", keywords: ["intensity", "distance"] },
  { term: "Irradiance", definition: "The power of electromagnetic radiation incident per unit area of a surface", topic: "Inverse Square Law", level: "Higher", keywords: ["power", "area"] },

  // Higher — Wave-Particle Duality
  { term: "Photoelectric effect", definition: "The emission of electrons from a metal surface when light of sufficient frequency shines on it", topic: "Wave-Particle Duality", level: "Higher", keywords: ["electrons", "frequency"] },
  { term: "Work function", definition: "The minimum energy required to remove an electron from the surface of a metal", topic: "Wave-Particle Duality", level: "Higher", keywords: ["minimum", "energy", "electron"] },
  { term: "de Broglie wavelength", definition: "The wavelength associated with a moving particle, inversely proportional to its momentum", topic: "Wave-Particle Duality", level: "Higher", keywords: ["wavelength", "momentum"] },
  { term: "Photon", definition: "A discrete packet (quantum) of electromagnetic energy", topic: "Wave-Particle Duality", level: "Higher", keywords: ["quantum", "energy"] },

  // Higher — Interference
  { term: "Constructive interference", definition: "When two waves meet in phase so their amplitudes add together to give a larger resultant amplitude", topic: "Interference", level: "Higher", keywords: ["phase", "amplitudes"] },
  { term: "Destructive interference", definition: "When two waves meet exactly out of phase so their amplitudes cancel to give a smaller resultant amplitude", topic: "Interference", level: "Higher", keywords: ["out of phase", "cancel"] },
  { term: "Coherent sources", definition: "Sources that emit waves of the same frequency with a constant phase relationship", topic: "Interference", level: "Higher", keywords: ["frequency", "phase"] },

  // Higher — Refraction
  { term: "Snell's Law", definition: "The ratio of the sine of the angle of incidence to the sine of the angle of refraction equals the refractive index", topic: "Refraction", level: "Higher", keywords: ["sine", "incidence", "refraction"] },
  { term: "Refractive index", definition: "The ratio of the speed of light in a vacuum to the speed of light in a given medium", topic: "Refraction", level: "Higher", keywords: ["speed", "vacuum", "medium"] },

  // Higher — Spectra
  { term: "Line emission spectrum", definition: "A series of discrete bright lines produced when excited atoms emit photons at specific wavelengths", topic: "Spectra", level: "Higher", keywords: ["discrete", "photons"] },
  { term: "Line absorption spectrum", definition: "Dark lines on an otherwise continuous spectrum where specific wavelengths have been absorbed by atoms", topic: "Spectra", level: "Higher", keywords: ["absorbed", "wavelengths"] },
  { term: "Continuous spectrum", definition: "A spectrum that contains all wavelengths of light within a given range", topic: "Spectra", level: "Higher", keywords: ["wavelengths", "range"] },

  // Higher — Rayleigh Criterion
  { term: "Rayleigh criterion", definition: "Two point sources are just resolved when the central maximum of one diffraction pattern coincides with the first minimum of the other", topic: "Rayleigh Criterion", level: "Higher", keywords: ["maximum", "minimum", "diffraction"] },
  { term: "Angular resolution", definition: "The minimum angular separation at which two objects can be distinguished as separate", topic: "Rayleigh Criterion", level: "Higher", keywords: ["angular", "separation"] },

  // Higher — Monitoring and Measuring AC
  { term: "Peak voltage", definition: "The maximum voltage reached during one AC cycle", topic: "Monitoring and Measuring AC", level: "Higher", keywords: ["maximum", "voltage"] },
  { term: "RMS voltage", definition: "The equivalent DC voltage that delivers the same average power as the AC voltage", topic: "Monitoring and Measuring AC", level: "Higher", keywords: ["equivalent", "power"] },
  { term: "Frequency (AC)", definition: "The number of complete AC cycles per second, measured in hertz", topic: "Monitoring and Measuring AC", level: "Higher", keywords: ["cycles", "hertz"] },

  // Higher — Current, Potential Difference, Power and Resistance
  { term: "Ohm's Law", definition: "The current through a conductor is directly proportional to the potential difference across it, provided temperature remains constant", topic: "Current, Potential Difference, Power and Resistance", level: "Higher", keywords: ["proportional", "temperature"] },
  { term: "Series circuit", definition: "A circuit in which components are connected end to end so the same current flows through each", topic: "Current, Potential Difference, Power and Resistance", level: "Higher", keywords: ["current", "components"] },
  { term: "Parallel circuit", definition: "A circuit in which components are connected across the same potential difference", topic: "Current, Potential Difference, Power and Resistance", level: "Higher", keywords: ["potential", "components"] },

  // Higher — Electrical Sources and Internal Resistance
  { term: "EMF (electromotive force)", definition: "The energy given to each coulomb of charge by the source of electrical energy", topic: "Electrical Sources and Internal Resistance", level: "Higher", keywords: ["energy", "charge"] },
  { term: "Internal resistance", definition: "The resistance to current flow within the electrical source itself", topic: "Electrical Sources and Internal Resistance", level: "Higher", keywords: ["resistance", "source"] },
  { term: "Terminal potential difference", definition: "The potential difference across the terminals of a source when it is delivering current to an external circuit", topic: "Electrical Sources and Internal Resistance", level: "Higher", keywords: ["terminals", "current"] },

  // Higher — Capacitors
  { term: "Capacitance", definition: "The ratio of the charge stored on a capacitor to the potential difference across its plates", topic: "Capacitors", level: "Higher", keywords: ["charge", "potential"] },
  { term: "Time constant", definition: "The time for the charge on a discharging capacitor to fall to approximately 37% of its initial value", topic: "Capacitors", level: "Higher", keywords: ["charge", "discharging"] },

  // Higher — Semiconductors
  { term: "n-type semiconductor", definition: "A semiconductor doped with donor atoms that provide extra free electrons as charge carriers", topic: "Semiconductors", level: "Higher", keywords: ["electrons", "donor"] },
  { term: "p-type semiconductor", definition: "A semiconductor doped with acceptor atoms that create positive holes as charge carriers", topic: "Semiconductors", level: "Higher", keywords: ["holes", "acceptor"] },
  { term: "p-n junction", definition: "The boundary between p-type and n-type semiconductor material where a depletion layer forms", topic: "Semiconductors", level: "Higher", keywords: ["depletion", "boundary"] },

  // Advanced Higher — Kinematic Relationships
  { term: "Jerk", definition: "The rate of change of acceleration with respect to time", topic: "Kinematic Relationships", level: "Advanced Higher", keywords: ["acceleration", "time"] },

  // Advanced Higher — Angular Motion
  { term: "Angular velocity", definition: "The rate of change of angular displacement; measured in radians per second", topic: "Angular Motion", level: "Advanced Higher", keywords: ["angular", "displacement"] },
  { term: "Angular acceleration", definition: "The rate of change of angular velocity; measured in radians per second squared", topic: "Angular Motion", level: "Advanced Higher", keywords: ["angular", "velocity"] },
  { term: "Radian", definition: "The angle subtended at the centre of a circle by an arc whose length equals the radius", topic: "Angular Motion", level: "Advanced Higher", keywords: ["arc", "radius"] },

  // Advanced Higher — Rotational Dynamics
  { term: "Torque", definition: "The turning effect of a force about an axis; equal to the force multiplied by the perpendicular distance from the axis", topic: "Rotational Dynamics", level: "Advanced Higher", keywords: ["force", "perpendicular", "distance"] },
  { term: "Moment of inertia", definition: "The rotational analogue of mass; a measure of an object's resistance to angular acceleration", topic: "Rotational Dynamics", level: "Advanced Higher", keywords: ["mass", "angular", "resistance"] },

  // Advanced Higher — Angular Momentum
  { term: "Angular momentum", definition: "The product of an object's moment of inertia and its angular velocity", topic: "Angular Momentum", level: "Advanced Higher", keywords: ["moment of inertia", "angular velocity"] },
  { term: "Conservation of angular momentum", definition: "The total angular momentum of an isolated system remains constant when no external torques act on it", topic: "Angular Momentum", level: "Advanced Higher", keywords: ["constant", "torques"] },

  // Advanced Higher — Gravitation
  { term: "Gravitational potential", definition: "The work done per unit mass to bring a test mass from infinity to a given point in a gravitational field", topic: "Gravitation", level: "Advanced Higher", keywords: ["work", "mass", "infinity"] },
  { term: "Escape velocity", definition: "The minimum speed an object needs to escape a gravitational field without further propulsion", topic: "Gravitation", level: "Advanced Higher", keywords: ["minimum", "speed", "escape"] },

  // Advanced Higher — General Relativity
  { term: "Equivalence principle", definition: "A gravitational field is locally indistinguishable from an accelerating reference frame", topic: "General Relativity", level: "Advanced Higher", keywords: ["gravitational", "accelerating"] },
  { term: "Spacetime", definition: "The four-dimensional continuum that combines three spatial dimensions with time", topic: "General Relativity", level: "Advanced Higher", keywords: ["four-dimensional", "time"] },
  { term: "Gravitational time dilation", definition: "Clocks run slower in regions of stronger gravitational fields compared to regions of weaker gravitational fields", topic: "General Relativity", level: "Advanced Higher", keywords: ["slower", "gravitational"] },

  // Advanced Higher — Stellar Physics
  { term: "Luminosity", definition: "The total power output of a star, measured in watts", topic: "Stellar Physics", level: "Advanced Higher", keywords: ["power", "star"] },
  { term: "Stefan-Boltzmann Law", definition: "The total energy radiated per unit surface area of a black body is proportional to the fourth power of its absolute temperature", topic: "Stellar Physics", level: "Advanced Higher", keywords: ["temperature", "power"] },
  { term: "Hertzsprung-Russell diagram", definition: "A scatter graph plotting stellar luminosity against surface temperature used to classify stars into groups", topic: "Stellar Physics", level: "Advanced Higher", keywords: ["luminosity", "temperature"] },

  // Advanced Higher — Introduction to Quantum Theory
  { term: "Wave function", definition: "A mathematical function whose squared modulus gives the probability density of finding a particle at a given location", topic: "Introduction to Quantum Theory", level: "Advanced Higher", keywords: ["probability", "particle"] },
  { term: "Heisenberg Uncertainty Principle", definition: "It is impossible to simultaneously know both the exact position and exact momentum of a particle with unlimited precision", topic: "Introduction to Quantum Theory", level: "Advanced Higher", keywords: ["position", "momentum", "precision"] },
  { term: "Quantisation", definition: "The restriction of a physical quantity such as energy to discrete allowed values", topic: "Introduction to Quantum Theory", level: "Advanced Higher", keywords: ["discrete", "energy"] },

  // Advanced Higher — Particles from Space
  { term: "Cosmic rays", definition: "High-energy particles, mainly protons and alpha particles, arriving at Earth from space", topic: "Particles from Space", level: "Advanced Higher", keywords: ["high-energy", "protons", "space"] },
  { term: "Pair production", definition: "The creation of a particle and its antiparticle from a high-energy photon in the vicinity of a nucleus", topic: "Particles from Space", level: "Advanced Higher", keywords: ["antiparticle", "photon"] },
  { term: "Annihilation", definition: "The process in which a particle meets its antiparticle and both are converted into two photons of equal energy", topic: "Particles from Space", level: "Advanced Higher", keywords: ["antiparticle", "photons"] },

  // Advanced Higher — Simple Harmonic Motion
  { term: "Simple harmonic motion", definition: "Oscillatory motion in which the acceleration is directly proportional to displacement from equilibrium and directed towards it", topic: "Simple Harmonic Motion", level: "Advanced Higher", keywords: ["acceleration", "displacement", "equilibrium"] },
  { term: "Period (SHM)", definition: "The time taken for one complete oscillation of a simple harmonic oscillator", topic: "Simple Harmonic Motion", level: "Advanced Higher", keywords: ["time", "oscillation"] },
  { term: "Restoring force", definition: "The force that acts to return an oscillating object towards its equilibrium position", topic: "Simple Harmonic Motion", level: "Advanced Higher", keywords: ["equilibrium", "return"] },

  // Advanced Higher — Waves
  { term: "Standing wave", definition: "A wave pattern formed by the superposition of two identical waves travelling in opposite directions", topic: "Waves", level: "Advanced Higher", keywords: ["superposition", "opposite"] },
  { term: "Node", definition: "A point of zero displacement on a standing wave where destructive interference occurs permanently", topic: "Waves", level: "Advanced Higher", keywords: ["zero", "displacement"] },
  { term: "Antinode", definition: "A point of maximum displacement on a standing wave where constructive interference occurs permanently", topic: "Waves", level: "Advanced Higher", keywords: ["maximum", "displacement"] },

  // Advanced Higher — Interference
  { term: "Path difference", definition: "The difference in distance travelled by two waves from their respective sources to a given observation point", topic: "Interference", level: "Advanced Higher", keywords: ["distance", "sources"] },
  { term: "Fringe spacing", definition: "The distance between adjacent bright (or dark) fringes in a two-source interference pattern", topic: "Interference", level: "Advanced Higher", keywords: ["bright", "dark", "distance"] },

  // Advanced Higher — Polarisation
  { term: "Polarisation", definition: "The restriction of transverse wave oscillations to a single plane", topic: "Polarisation", level: "Advanced Higher", keywords: ["transverse", "plane"] },
  { term: "Malus's Law", definition: "The intensity of polarised light transmitted through a polariser is proportional to the square of the cosine of the angle between their transmission axes", topic: "Polarisation", level: "Advanced Higher", keywords: ["intensity", "cosine", "angle"] },

  // Advanced Higher — Electrostatics
  { term: "Electric potential", definition: "The work done per unit positive charge in bringing a test charge from infinity to a given point in an electric field", topic: "Electrostatics", level: "Advanced Higher", keywords: ["work", "charge", "infinity"] },
  { term: "Coulomb's Law", definition: "The electrostatic force between two point charges is proportional to the product of the charges and inversely proportional to the square of the distance between them", topic: "Electrostatics", level: "Advanced Higher", keywords: ["charges", "distance"] },

  // Advanced Higher — Electromagnetism
  { term: "Magnetic flux", definition: "The product of the component of magnetic field perpendicular to an area and that area", topic: "Electromagnetism", level: "Advanced Higher", keywords: ["magnetic", "area"] },
  { term: "Faraday's Law", definition: "The induced EMF in a circuit is equal to the negative rate of change of magnetic flux linkage", topic: "Electromagnetism", level: "Advanced Higher", keywords: ["EMF", "flux"] },
  { term: "Lenz's Law", definition: "The direction of an induced current is always such that it opposes the change in magnetic flux that caused it", topic: "Electromagnetism", level: "Advanced Higher", keywords: ["opposes", "flux"] },

  // Advanced Higher — Capacitance and Inductance
  { term: "Self-inductance", definition: "The property of a coil by which a changing current through it induces an opposing EMF in the coil itself", topic: "Capacitance and Inductance", level: "Advanced Higher", keywords: ["EMF", "current"] },
  { term: "Inductor", definition: "A component that stores energy in a magnetic field and opposes changes in current through it", topic: "Capacitance and Inductance", level: "Advanced Higher", keywords: ["magnetic", "energy", "current"] },

  // Advanced Higher — Uncertainties
  { term: "Absolute uncertainty", definition: "The uncertainty in a measurement expressed in the same units as the measurement itself", topic: "Uncertainties", level: "Advanced Higher", keywords: ["units", "measurement"] },
  { term: "Percentage uncertainty", definition: "The absolute uncertainty expressed as a percentage of the measured value", topic: "Uncertainties", level: "Advanced Higher", keywords: ["absolute", "percentage"] },
  { term: "Random error", definition: "An unpredictable variation in measurements that causes readings to scatter around the true value", topic: "Uncertainties", level: "Advanced Higher", keywords: ["unpredictable", "scatter"] },
  { term: "Systematic error", definition: "A consistent error in the same direction that affects every measurement by the same amount", topic: "Uncertainties", level: "Advanced Higher", keywords: ["consistent", "direction"] },

  // Chemistry National 5 — Rates of Reaction
  { term: "Average Rate", definition: "The change in a measurable quantity (like mass or volume) divided by the time taken for that change to occur", topic: "Rates of Reaction", level: "Chemistry-National 5", keywords: ["change", "quantity", "time"] },
  { term: "Catalyst", definition: "A substance that increases the rate of a chemical reaction without being used up itself", topic: "Rates of Reaction", level: "Chemistry-National 5", keywords: ["increases", "rate", "reaction"] },
  { term: "Collision Theory", definition: "The theory that for a reaction to occur, particles must collide with enough energy (activation energy) and in the correct orientation", topic: "Rates of Reaction", level: "Chemistry-National 5", keywords: ["collide", "energy", "activation energy"] },
  { term: "End-point", definition: "The moment a reaction is finished, often shown on a graph when the curve flattens out", topic: "Rates of Reaction", level: "Chemistry-National 5", keywords: ["finished", "reaction", "graph"] },

  // Chemistry National 5 — Atomic Structure
  { term: "Atom", definition: "The smallest particle of an element that can exist", topic: "Atomic Structure", level: "Chemistry-National 5", keywords: ["smallest", "particle", "element"] },
  { term: "Proton", definition: "A positively charged particle found in the nucleus (mass = 1 amu)", topic: "Atomic Structure", level: "Chemistry-National 5", keywords: ["positive", "nucleus", "mass"] },
  { term: "Neutron", definition: "A neutral particle found in the nucleus (mass = 1 amu)", topic: "Atomic Structure", level: "Chemistry-National 5", keywords: ["neutral", "nucleus", "mass"] },
  { term: "Electron", definition: "A negatively charged particle found in energy levels orbiting the nucleus (mass is negligible)", topic: "Atomic Structure", level: "Chemistry-National 5", keywords: ["negative", "energy levels", "nucleus"] },
  { term: "Atomic Number", definition: "The number of protons in the nucleus of an atom", topic: "Atomic Structure", level: "Chemistry-National 5", keywords: ["protons", "nucleus"] },
  { term: "Mass Number", definition: "The total number of protons and neutrons in the nucleus", topic: "Atomic Structure", level: "Chemistry-National 5", keywords: ["protons", "neutrons", "nucleus"] },
  { term: "Isotopes", definition: "Atoms of the same element with the same number of protons but a different number of neutrons", topic: "Atomic Structure", level: "Chemistry-National 5", keywords: ["same element", "protons", "neutrons"] },
  { term: "Nuclide Notation", definition: "A way of writing an atom showing its mass number (top) and atomic number (bottom) next to the element symbol", topic: "Atomic Structure", level: "Chemistry-National 5", keywords: ["mass number", "atomic number", "symbol"] },
  { term: "Ion", definition: "An atom (or group of atoms) that has gained or lost electrons, resulting in a positive or negative charge", topic: "Atomic Structure", level: "Chemistry-National 5", keywords: ["gained", "lost", "electrons", "charge"] },

  // Chemistry National 5 — Bonding and Structure
  { term: "Periodic Table", definition: "A table of elements arranged by increasing atomic number", topic: "Bonding and Structure", level: "Chemistry-National 5", keywords: ["elements", "atomic number"] },
  { term: "Group", definition: "A vertical column in the periodic table; elements in the same group have the same number of outer electrons and similar chemical properties", topic: "Bonding and Structure", level: "Chemistry-National 5", keywords: ["vertical", "outer electrons", "properties"] },
  { term: "Period", definition: "A horizontal row in the periodic table", topic: "Bonding and Structure", level: "Chemistry-National 5", keywords: ["horizontal", "row"] },
  { term: "Covalent Bond", definition: "A bond formed between non-metal atoms by the sharing of a pair of electrons", topic: "Bonding and Structure", level: "Chemistry-National 5", keywords: ["sharing", "electrons", "non-metal"] },
  { term: "Diatomic", definition: "A molecule consisting of only two atoms", topic: "Bonding and Structure", level: "Chemistry-National 5", keywords: ["two atoms", "molecule"] },
  { term: "Covalent Molecular", definition: "Substances with strong covalent bonds inside molecules but weak forces between molecules; they have low melting/boiling points and do not conduct electricity", topic: "Bonding and Structure", level: "Chemistry-National 5", keywords: ["covalent bonds", "weak forces", "low melting points"] },
  { term: "Covalent Network", definition: "A giant structure of atoms held together by strong covalent bonds; they have very high melting points and do not conduct electricity (except graphite)", topic: "Bonding and Structure", level: "Chemistry-National 5", keywords: ["giant structure", "strong bonds", "high melting points"] },
  { term: "Ionic Bond", definition: "The strong electrostatic attraction between positive and negative ions", topic: "Bonding and Structure", level: "Chemistry-National 5", keywords: ["electrostatic", "attraction", "ions"] },
  { term: "Ionic Lattice", definition: "A repeating 3D structure of oppositely charged ions; they have high melting points and conduct electricity only when molten or in solution", topic: "Bonding and Structure", level: "Chemistry-National 5", keywords: ["3D structure", "oppositely charged", "conduct electricity"] },
  { term: "Valency", definition: "The combining power of an element or group of atoms, related to the number of electrons an atom needs to gain or lose to reach a stable shell", topic: "Bonding and Structure", level: "Chemistry-National 5", keywords: ["combining power", "electrons", "stable shell"] },

  // Chemistry National 5 — Formulae and Reacting Quantities
  { term: "Chemical Formula", definition: "Represents the ratio of atoms or ions in a substance", topic: "Formulae and Reacting Quantities", level: "Chemistry-National 5", keywords: ["ratio", "atoms", "ions"] },
  { term: "Balanced Equation", definition: "An equation where the number of each type of atom is the same on both the reactant and product sides", topic: "Formulae and Reacting Quantities", level: "Chemistry-National 5", keywords: ["atoms", "reactant", "product"] },
  { term: "Mole", definition: "The unit used to measure the amount of a substance", topic: "Formulae and Reacting Quantities", level: "Chemistry-National 5", keywords: ["unit", "amount", "substance"] },
  { term: "Gram Formula Mass (GFM)", definition: "The mass of one mole of a substance in grams", topic: "Formulae and Reacting Quantities", level: "Chemistry-National 5", keywords: ["mass", "mole", "grams"] },
  { term: "State Symbols", definition: "Letters used in equations to show the state of matter: (s) solid, (l) liquid, (g) gas, (aq) aqueous (dissolved in water)", topic: "Formulae and Reacting Quantities", level: "Chemistry-National 5", keywords: ["solid", "liquid", "gas", "aqueous"] },
  { term: "Concentration", definition: "The amount of solute (in moles) dissolved in a given volume of solvent, usually in mol per litre", topic: "Formulae and Reacting Quantities", level: "Chemistry-National 5", keywords: ["solute", "moles", "volume", "solvent"] },

  // Chemistry National 5 — Acids and Bases
  { term: "Acid", definition: "A substance with a pH less than 7; it contains a higher concentration of H+ ions than OH- ions", topic: "Acids and Bases", level: "Chemistry-National 5", keywords: ["pH", "H+ ions", "OH- ions"] },
  { term: "Alkali", definition: "A soluble base with a pH greater than 7; it contains a higher concentration of OH- ions than H+ ions", topic: "Acids and Bases", level: "Chemistry-National 5", keywords: ["pH", "OH- ions", "H+ ions", "soluble"] },
  { term: "Neutral Solution", definition: "A solution with a pH of 7; the concentration of H+ ions equals the concentration of OH- ions", topic: "Acids and Bases", level: "Chemistry-National 5", keywords: ["pH 7", "H+ ions", "OH- ions"] },
  { term: "Neutralisation", definition: "A reaction where an acid reacts with a base to form salt and water", topic: "Acids and Bases", level: "Chemistry-National 5", keywords: ["acid", "base", "salt", "water"] },
  { term: "Spectator Ions", definition: "Ions that are present during a reaction but do not take part in the actual chemical change", topic: "Acids and Bases", level: "Chemistry-National 5", keywords: ["ions", "reaction", "chemical change"] },
  { term: "Titration", definition: "A technique used to determine the exact volume of acid or alkali required to reach the end-point of a neutralisation reaction", topic: "Acids and Bases", level: "Chemistry-National 5", keywords: ["volume", "acid", "alkali", "neutralisation"] },
  { term: "Indicator", definition: "A substance that changes colour to show the end-point of a titration", topic: "Acids and Bases", level: "Chemistry-National 5", keywords: ["colour", "end-point", "titration"] },

  // Chemistry National 5 — Homologous Series & Hydrocarbons
  { term: "Homologous Series", definition: "A family of compounds with the same general formula, similar chemical properties, and a trend in physical properties", topic: "Homologous Series & Hydrocarbons", level: "Chemistry-National 5", keywords: ["general formula", "similar properties", "trend"] },
  { term: "Hydrocarbon", definition: "A compound containing only carbon and hydrogen atoms", topic: "Homologous Series & Hydrocarbons", level: "Chemistry-National 5", keywords: ["carbon", "hydrogen"] },
  { term: "Saturated", definition: "Compounds containing only carbon-carbon single bonds", topic: "Homologous Series & Hydrocarbons", level: "Chemistry-National 5", keywords: ["single bonds", "carbon"] },
  { term: "Unsaturated", definition: "Compounds containing at least one carbon-carbon double bond", topic: "Homologous Series & Hydrocarbons", level: "Chemistry-National 5", keywords: ["double bond", "carbon"] },
  { term: "Alkanes", definition: "A saturated homologous series with the general formula CnH2n+2", topic: "Homologous Series & Hydrocarbons", level: "Chemistry-National 5", keywords: ["saturated", "CnH2n+2"] },
  { term: "Alkenes", definition: "An unsaturated homologous series with the general formula CnH2n", topic: "Homologous Series & Hydrocarbons", level: "Chemistry-National 5", keywords: ["unsaturated", "CnH2n"] },
  { term: "Cycloalkanes", definition: "A saturated, ring-shaped homologous series with the general formula CnH2n", topic: "Homologous Series & Hydrocarbons", level: "Chemistry-National 5", keywords: ["saturated", "ring", "CnH2n"] },
  { term: "Isomers", definition: "Compounds with the same molecular formula but different structural formulae", topic: "Homologous Series & Hydrocarbons", level: "Chemistry-National 5", keywords: ["molecular formula", "structural formulae"] },
  { term: "Bromine Water Test", definition: "Used to distinguish between saturated and unsaturated compounds; unsaturated compounds (alkenes) quickly turn bromine water from orange/brown to colourless", topic: "Homologous Series & Hydrocarbons", level: "Chemistry-National 5", keywords: ["saturated", "unsaturated", "colourless"] },
  { term: "Addition Reaction", definition: "A reaction where a molecule adds across the double bond of an unsaturated compound, breaking the double bond", topic: "Homologous Series & Hydrocarbons", level: "Chemistry-National 5", keywords: ["double bond", "unsaturated", "adds across"] },

  // Chemistry National 5 — Everyday Consumer Products
  { term: "Alcohol", definition: "A homologous series containing a hydroxyl group (-OH); general formula CnH2n+1OH", topic: "Everyday Consumer Products", level: "Chemistry-National 5", keywords: ["hydroxyl group", "-OH", "CnH2n+1OH"] },
  { term: "Carboxylic Acid", definition: "A homologous series containing a carboxyl group (-COOH); general formula CnH2n+1COOH", topic: "Everyday Consumer Products", level: "Chemistry-National 5", keywords: ["carboxyl group", "-COOH", "CnH2n+1COOH"] },

  // Chemistry National 5 — Energy from Fuels
  { term: "Combustion", definition: "The burning of a substance in oxygen; it is an exothermic reaction", topic: "Energy from Fuels", level: "Chemistry-National 5", keywords: ["burning", "oxygen", "exothermic"] },
  { term: "Exothermic Reaction", definition: "A reaction that releases energy to the surroundings, causing the temperature of the surroundings to increase", topic: "Energy from Fuels", level: "Chemistry-National 5", keywords: ["releases energy", "temperature increases"] },
  { term: "Endothermic Reaction", definition: "A reaction that absorbs energy from the surroundings, causing the temperature of the surroundings to decrease", topic: "Energy from Fuels", level: "Chemistry-National 5", keywords: ["absorbs energy", "temperature decreases"] },
  { term: "Fuel", definition: "A substance that burns to release energy", topic: "Energy from Fuels", level: "Chemistry-National 5", keywords: ["burns", "energy"] },

  // Chemistry National 5 — Metals
  { term: "Metallic Bonding", definition: "The electrostatic attraction between positively charged metal ions and delocalised electrons", topic: "Metals", level: "Chemistry-National 5", keywords: ["electrostatic", "metal ions", "delocalised electrons"] },
  { term: "Delocalised Electrons", definition: "Electrons that are not bound to a specific atom and are free to move throughout the metallic structure, which is why metals conduct electricity", topic: "Metals", level: "Chemistry-National 5", keywords: ["free to move", "metallic structure", "conduct electricity"] },
  { term: "Reactivity Series", definition: "A list of metals arranged in order of how vigorously they react with substances like oxygen, water, or acids", topic: "Metals", level: "Chemistry-National 5", keywords: ["metals", "order", "reactivity"] },
  { term: "Redox Reaction", definition: "A reaction where both reduction (gain of electrons) and oxidation (loss of electrons) occur simultaneously", topic: "Metals", level: "Chemistry-National 5", keywords: ["reduction", "oxidation", "electrons"] },
  { term: "Reduction", definition: "The gain of electrons; in metal extraction, metal ions are reduced to metal atoms", topic: "Metals", level: "Chemistry-National 5", keywords: ["gain", "electrons", "metal ions"] },
  { term: "Oxidation", definition: "The loss of electrons", topic: "Metals", level: "Chemistry-National 5", keywords: ["loss", "electrons"] },
  { term: "Ion-Electron Equation", definition: "An equation showing the oxidation or reduction process, including the movement of electrons", topic: "Metals", level: "Chemistry-National 5", keywords: ["oxidation", "reduction", "electrons"] },
  { term: "Ore", definition: "A naturally occurring rock from which a metal can be extracted", topic: "Metals", level: "Chemistry-National 5", keywords: ["rock", "metal", "extracted"] },
  { term: "Electrolyte", definition: "An ionic solution that conducts electricity", topic: "Metals", level: "Chemistry-National 5", keywords: ["ionic", "conducts", "electricity"] },
  { term: "Electrochemical Cell", definition: "A setup that produces electricity using two different metals and an electrolyte", topic: "Metals", level: "Chemistry-National 5", keywords: ["electricity", "two metals", "electrolyte"] },
  { term: "Ion Bridge", definition: "A connection between two half-cells that allows ions to flow and completes the electrical circuit", topic: "Metals", level: "Chemistry-National 5", keywords: ["half-cells", "ions", "circuit"] },
  { term: "Electrolysis", definition: "Breaking up an ionic compound using electricity to separate the products", topic: "Metals", level: "Chemistry-National 5", keywords: ["ionic compound", "electricity", "separate"] },

  // Chemistry National 5 — Plastics
  { term: "Polymer", definition: "A long-chain molecule formed by joining together many small units called monomers", topic: "Plastics", level: "Chemistry-National 5", keywords: ["long-chain", "monomers"] },
  { term: "Monomer", definition: "A small, unsaturated molecule that reacts to form a polymer", topic: "Plastics", level: "Chemistry-National 5", keywords: ["small", "unsaturated", "polymer"] },
  { term: "Addition Polymerisation", definition: "The reaction where small, unsaturated monomers join together to form a polymer, with no other product formed", topic: "Plastics", level: "Chemistry-National 5", keywords: ["monomers", "polymer", "no other product"] },

  // Chemistry National 5 — Fertilisers
  { term: "Essential Elements", definition: "The three primary nutrients required for plant growth: Nitrogen (N), Phosphorus (P), and Potassium (K)", topic: "Fertilisers", level: "Chemistry-National 5", keywords: ["nitrogen", "phosphorus", "potassium", "plant growth"] },
  { term: "Haber Process", definition: "The industrial process used to produce ammonia (NH3) from nitrogen and hydrogen gases using an iron catalyst, at approximately 500°C and 250 atmospheres", topic: "Fertilisers", level: "Chemistry-National 5", keywords: ["ammonia", "nitrogen", "hydrogen", "iron catalyst"] },
  { term: "Ostwald Process", definition: "The industrial process used to produce nitric acid from ammonia, water and oxygen using a platinum catalyst", topic: "Fertilisers", level: "Chemistry-National 5", keywords: ["nitric acid", "ammonia", "platinum catalyst"] },

  // Chemistry National 5 — Nuclear Chemistry
  { term: "Radioisotope", definition: "An unstable isotope that emits radiation to become more stable", topic: "Nuclear Chemistry", level: "Chemistry-National 5", keywords: ["unstable", "isotope", "radiation"] },
  { term: "Alpha Particle", definition: "A helium nucleus with a positive charge; it is heavy, slow-moving, and easily stopped by paper", topic: "Nuclear Chemistry", level: "Chemistry-National 5", keywords: ["helium nucleus", "positive charge", "paper"] },
  { term: "Beta Particle", definition: "A high-speed electron ejected from the nucleus; lighter and more penetrating than alpha particles, stopped by thin aluminium", topic: "Nuclear Chemistry", level: "Chemistry-National 5", keywords: ["electron", "nucleus", "aluminium"] },
  { term: "Gamma Ray", definition: "High-energy electromagnetic radiation with no mass or charge; highly penetrating and requires thick lead or concrete to stop", topic: "Nuclear Chemistry", level: "Chemistry-National 5", keywords: ["electromagnetic", "no mass", "lead"] },
  { term: "Half-life", definition: "The time taken for the activity or mass of a radioisotope to decrease by half", topic: "Nuclear Chemistry", level: "Chemistry-National 5", keywords: ["time", "radioisotope", "decrease"] },

  // Chemistry National 5 — Chemical Analysis
  { term: "Qualitative Analysis", definition: "Identifies what substances are present (e.g., flame tests to identify metal ions)", topic: "Chemical Analysis", level: "Chemistry-National 5", keywords: ["identifies", "substances", "flame tests"] },
  { term: "Quantitative Analysis", definition: "Determines how much of a substance is present (e.g., titrations)", topic: "Chemical Analysis", level: "Chemistry-National 5", keywords: ["how much", "substance", "titrations"] },
  { term: "Titration (Analysis)", definition: "A technique used to accurately measure the volume of a substance required to react with another, often used to determine concentration", topic: "Chemical Analysis", level: "Chemistry-National 5", keywords: ["volume", "react", "concentration"] },
  { term: "Concordant", definition: "Titration results that are within 0.2 cm3 of each other", topic: "Chemical Analysis", level: "Chemistry-National 5", keywords: ["titration", "0.2 cm3", "results"] },
  { term: "Precipitation", definition: "The formation of an insoluble solid when two solutions are mixed", topic: "Chemical Analysis", level: "Chemistry-National 5", keywords: ["insoluble", "solid", "solutions"] },
]

const VALID_LEVELS = ["National 5", "Higher", "Advanced Higher"]

// Unit → topic mapping per qualification level (used in Definitions mode)
const DEF_UNIT_TOPICS: Record<string, Record<string, string[]>> = {
  "National 5": {
    Dynamics: ["Vectors and Scalars", "Velocity-time graphs", "Acceleration", "Newton's Laws", "Projectile Motion"],
    Space: ["Space Exploration", "Cosmology"],
    "Properties of Matter": ["Specific Heat Capacity", "Pressure, Kinetic Theory and Gas Laws", "Specific Latent Heat"],
    Electricity: ["Current, voltage and resistance", "Electrical Power"],
    Waves: ["Waves", "Refraction of Light", "EM Spectrum"],
    Radiation: ["Nuclear Radiation"],
  },
  Higher: {
    Dynamics: ["Equations of Motion", "Forces, Energy and Power", "Collisions, Momentum and Impulse"],
    Space: ["Gravitation", "Special Relativity", "The Expanding Universe", "The Standard Model"],
    Electricity: [
      "Monitoring and Measuring AC",
      "Current, Potential Difference, Power and Resistance",
      "Electrical Sources and Internal Resistance",
      "Capacitors",
      "Semiconductors",
    ],
    Waves: ["Wave-Particle Duality", "Interference", "Refraction", "Spectra", "Rayleigh Criterion"],
    Radiation: ["Forces on Charged Particles", "Nuclear Reactions", "Inverse Square Law"],
  },
  "Advanced Higher": {
    Dynamics: ["Kinematic Relationships", "Angular Motion", "Rotational Dynamics", "Angular Momentum"],
    Space: ["Gravitation", "General Relativity", "Stellar Physics", "Introduction to Quantum Theory", "Particles from Space"],
    Electricity: ["Electrostatics", "Electromagnetism", "Capacitance and Inductance"],
    Waves: ["Simple Harmonic Motion", "Waves", "Interference", "Polarisation"],
    Other: ["Uncertainties"],
  },
  "Chemistry-National 5": {
    "Unit 1": ["Rates of Reaction", "Atomic Structure", "Bonding and Structure", "Formulae and Reacting Quantities", "Acids and Bases"],
    "Unit 2": ["Homologous Series & Hydrocarbons", "Everyday Consumer Products", "Energy from Fuels"],
    "Unit 3": ["Metals", "Plastics", "Fertilisers", "Nuclear Chemistry", "Chemical Analysis"],
  },
}

function loadDefProgress(level: string): Record<string, DefProgress> {
  try {
    if (typeof window === "undefined") return {}
    if (!VALID_LEVELS.includes(level)) return {}
    const saved = localStorage.getItem(`trinfinity_def_progress_${level}`)
    return saved ? JSON.parse(saved) : {}
  } catch { return {} }
}

function saveDefProgress(level: string, progress: Record<string, DefProgress>) {
  try {
    if (typeof window === "undefined") return
    if (!VALID_LEVELS.includes(level)) return
    localStorage.setItem(`trinfinity_def_progress_${level}`, JSON.stringify(progress))
  } catch {}
}

// --- Per-user progress helpers ---

interface PaperAttempt {
  date: number
  timeTakenSeconds: number
  marksEarned: number
  marksTotal: number
  partMarks: Record<string, number>
}

interface ExamProgress {
  mc: Record<string, { correct: number; total: number }>
  paper: Record<string, { correct: number; total: number }>
  pastPapers: Record<string, PaperAttempt[]>
}

interface CalcProgress {
  singleEq: Record<number, { correct: number; total: number }>
  easyMode: Record<string, { correct: number; total: number }>
  mediumMode: Record<string, { correct: number; total: number }>
  hardMode: Record<string, { correct: number; total: number }>
  examLevel: { correct: number; total: number }
  correctMe: { correct: number; total: number }
}

function loadUserDefProgress(userId: string, level: string): Record<string, DefProgress> {
  try {
    if (typeof window === "undefined") return {}
    if (!VALID_LEVELS.includes(level)) return {}
    const saved = localStorage.getItem(`trinfinity_def_progress_${userId}_${level}`)
    return saved ? JSON.parse(saved) : {}
  } catch { return {} }
}

function saveUserDefProgress(userId: string, level: string, progress: Record<string, DefProgress>): void {
  try {
    if (typeof window === "undefined") return
    if (!VALID_LEVELS.includes(level)) return
    localStorage.setItem(`trinfinity_def_progress_${userId}_${level}`, JSON.stringify(progress))
  } catch {}
}

function loadDefCompletion(level: string): DefCompletion {
  try {
    if (typeof window === "undefined") return {}
    if (!VALID_LEVELS.includes(level)) return {}
    const saved = localStorage.getItem(`trinfinity_def_completion_${level}`)
    return saved ? JSON.parse(saved) : {}
  } catch { return {} }
}

function saveDefCompletion(level: string, completion: DefCompletion): void {
  try {
    if (typeof window === "undefined") return
    if (!VALID_LEVELS.includes(level)) return
    localStorage.setItem(`trinfinity_def_completion_${level}`, JSON.stringify(completion))
  } catch {}
}

function loadUserDefCompletion(userId: string, level: string): DefCompletion {
  try {
    if (typeof window === "undefined") return {}
    if (!VALID_LEVELS.includes(level)) return {}
    const saved = localStorage.getItem(`trinfinity_def_completion_${userId}_${level}`)
    return saved ? JSON.parse(saved) : {}
  } catch { return {} }
}

function saveUserDefCompletion(userId: string, level: string, completion: DefCompletion): void {
  try {
    if (typeof window === "undefined") return
    if (!VALID_LEVELS.includes(level)) return
    localStorage.setItem(`trinfinity_def_completion_${userId}_${level}`, JSON.stringify(completion))
  } catch {}
}

function loadUserExamProgress(userId: string, level: string): ExamProgress {
  try {
    if (typeof window === "undefined") return { mc: {}, paper: {}, pastPapers: {} }
    const saved = localStorage.getItem(`trinfinity_exam_progress_${userId}_${level}`)
    if (!saved) return { mc: {}, paper: {}, pastPapers: {} }
    const data = JSON.parse(saved)
    return { mc: data.mc ?? {}, paper: data.paper ?? {}, pastPapers: data.pastPapers ?? {} }
  } catch { return { mc: {}, paper: {}, pastPapers: {} } }
}

function saveUserExamProgress(userId: string, level: string, progress: ExamProgress): void {
  try {
    if (typeof window === "undefined") return
    localStorage.setItem(`trinfinity_exam_progress_${userId}_${level}`, JSON.stringify(progress))
  } catch {}
}

const defaultCalcProgress = (): CalcProgress => ({
  singleEq: {},
  easyMode: {},
  mediumMode: {},
  hardMode: {},
  examLevel: { correct: 0, total: 0 },
  correctMe: { correct: 0, total: 0 },
})

function loadUserCalcProgress(userId: string, level: string): CalcProgress {
  try {
    if (typeof window === "undefined") return defaultCalcProgress()
    const saved = localStorage.getItem(`trinfinity_calc_progress_${userId}_${level}`)
    if (!saved) return defaultCalcProgress()
    const data = JSON.parse(saved)
    return {
      singleEq: data.singleEq ?? {},
      easyMode: data.easyMode ?? {},
      mediumMode: data.mediumMode ?? {},
      hardMode: data.hardMode ?? {},
      examLevel: data.examLevel ?? { correct: 0, total: 0 },
      correctMe: data.correctMe ?? { correct: 0, total: 0 },
    }
  } catch { return defaultCalcProgress() }
}

function saveUserCalcProgress(userId: string, level: string, progress: CalcProgress): void {
  try {
    if (typeof window === "undefined") return
    localStorage.setItem(`trinfinity_calc_progress_${userId}_${level}`, JSON.stringify(progress))
  } catch {}
}

// 0 = not rated, 1 = needs work, 2 = getting there, 3 = confident, 4 = mastered
type OutcomeRating = 0 | 1 | 2 | 3 | 4
type OutcomeRatings = Record<string, OutcomeRating>

function loadOutcomeRatings(userId: string, subject: string, level: string): OutcomeRatings {
  try {
    if (typeof window === "undefined") return {}
    const raw = localStorage.getItem(`trinfinity_outcome_ratings_${userId}_${subject}_${level}`)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveOutcomeRatings(userId: string, subject: string, level: string, ratings: OutcomeRatings): void {
  try {
    if (typeof window === "undefined") return
    localStorage.setItem(`trinfinity_outcome_ratings_${userId}_${subject}_${level}`, JSON.stringify(ratings))
  } catch {}
}

// ── Question bank document helpers ──────────────────────────────────────────

interface CalcDocumentEntry {
  fileName: string
  content: string
  uploadedAt: number
}

function loadCalcDocument(equationId: string): CalcDocumentEntry | null {
  try {
    if (typeof window === "undefined") return null
    const saved = localStorage.getItem(`trinfinity_calc_doc_${equationId}`)
    if (!saved) return null
    return JSON.parse(saved)
  } catch { return null }
}

function saveCalcDocument(equationId: string, entry: CalcDocumentEntry): void {
  try {
    if (typeof window === "undefined") return
    localStorage.setItem(`trinfinity_calc_doc_${equationId}`, JSON.stringify(entry))
  } catch {}
}

function removeCalcDocument(equationId: string): void {
  try {
    if (typeof window === "undefined") return
    localStorage.removeItem(`trinfinity_calc_doc_${equationId}`)
  } catch {}
}

// ── Assessment Sheet helpers (relationship sheet / data sheet per subject+level) ──

type SheetType = "relationship" | "data"

const ASSESSMENT_SHEET_ACCEPT = ".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"

interface AssessmentSheetEntry {
  fileName: string
  content: string
  uploadedAt: number
}

function assessmentSheetKey(sheetType: SheetType, subject: string, level: string): string {
  const safeSubject = subject.replace(/\s+/g, "_")
  const safeLevel = level.replace(/\s+/g, "_")
  return `trinfinity_assessment_${sheetType}_sheet_${safeSubject}_${safeLevel}`
}

function loadAssessmentSheet(sheetType: SheetType, subject: string, level: string): AssessmentSheetEntry | null {
  try {
    if (typeof window === "undefined") return null
    const saved = localStorage.getItem(assessmentSheetKey(sheetType, subject, level))
    if (!saved) return null
    return JSON.parse(saved)
  } catch { return null }
}

function saveAssessmentSheet(sheetType: SheetType, subject: string, level: string, entry: AssessmentSheetEntry): void {
  try {
    if (typeof window === "undefined") return
    localStorage.setItem(assessmentSheetKey(sheetType, subject, level), JSON.stringify(entry))
  } catch {}
}

function removeAssessmentSheet(sheetType: SheetType, subject: string, level: string): void {
  try {
    if (typeof window === "undefined") return
    localStorage.removeItem(assessmentSheetKey(sheetType, subject, level))
  } catch {}
}

interface AICalcQuestionsCache {
  questions: CalcQuestion[]
  generatedAt: number
}

const AI_QUESTIONS_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

function loadAICalcQuestions(equationId: string, difficulty: string): CalcQuestion[] | null {
  try {
    if (typeof window === "undefined") return null
    const saved = localStorage.getItem(`trinfinity_ai_calc_${equationId}_${difficulty}`)
    if (!saved) return null
    const cache: AICalcQuestionsCache = JSON.parse(saved)
    if (Date.now() - cache.generatedAt > AI_QUESTIONS_TTL_MS) return null
    return cache.questions
  } catch { return null }
}

function saveAICalcQuestions(equationId: string, difficulty: string, questions: CalcQuestion[]): void {
  try {
    if (typeof window === "undefined") return
    const cache: AICalcQuestionsCache = { questions, generatedAt: Date.now() }
    localStorage.setItem(`trinfinity_ai_calc_${equationId}_${difficulty}`, JSON.stringify(cache))
  } catch {}
}

async function generateAndCacheCalcQuestions(
  equationId: string,
  equationFormula: string,
  equationDescription: string,
  difficulty: string,
): Promise<CalcQuestion[]> {
  const docEntry = loadCalcDocument(equationId)
  const body = {
    equationId,
    equationFormula,
    equationDescription,
    difficulty,
    documentContext: docEntry?.content ?? null,
  }
  const res = await fetch("/api/generate-calc-questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error("Generation failed")
  const data = await res.json()
  if (!data.questions) throw new Error("No questions returned")
  saveAICalcQuestions(equationId, difficulty, data.questions)
  return data.questions
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function generateMCDefQuestions(
  entries: DefinitionEntry[],
  allEntries: DefinitionEntry[],
  count: number = 5,
  difficulty: DifficultyLevel = "medium",
  // unitEntries: entries from the same unit as the question topic (for medium)
  unitEntriesMap?: Record<string, DefinitionEntry[]>,
  // selectedTopicEntries: entries from only the selected topics (for hard)
  selectedTopicEntries?: DefinitionEntry[]
): DefMCQuestion[] {
  const shuffled = shuffleArray(entries).slice(0, Math.min(count, entries.length))
  return shuffled.map((entry) => {
    let wrongPool: DefinitionEntry[]
    if (difficulty === "easy") {
      // Easy: distractors from any entry across all units (whole level bank)
      wrongPool = allEntries.filter((e) => e.term !== entry.term)
    } else if (difficulty === "medium") {
      // Medium: distractors from the same unit as the question's topic
      const sameUnitEntries = unitEntriesMap?.[entry.topic] ?? allEntries
      wrongPool = sameUnitEntries.filter((e) => e.term !== entry.term)
      if (wrongPool.length < 3) wrongPool = allEntries.filter((e) => e.term !== entry.term)
    } else {
      // Hard: distractors from the same selected topics
      const sameTopicPool = (selectedTopicEntries ?? allEntries).filter((e) => e.term !== entry.term)
      wrongPool = sameTopicPool.length >= 3 ? sameTopicPool : allEntries.filter((e) => e.term !== entry.term)
    }
    if (wrongPool.length < 3) wrongPool = allEntries.filter((e) => e.term !== entry.term)
    const wrong = shuffleArray(wrongPool).slice(0, 3)
    const options = shuffleArray([entry.definition, ...wrong.map((e) => e.definition)])
    return { type: "def-mc" as const, entry, options, answer: options.indexOf(entry.definition) }
  })
}

function generateClozeDefQuestions(
  entries: DefinitionEntry[],
  count: number = 5,
  difficulty: DifficultyLevel = "easy"
): DefClozeQuestion[] {
  const eligible = entries.filter((e) => e.keywords.length > 0)
  const shuffled = shuffleArray(eligible).slice(0, Math.min(count, eligible.length))
  return shuffled.map((entry) => {
    let keywordsToBlank: string[]
    if (difficulty === "easy") {
      keywordsToBlank = [entry.keywords[Math.floor(Math.random() * entry.keywords.length)]]
    } else if (difficulty === "medium") {
      const blankCount = Math.min(Math.max(2, Math.floor(entry.keywords.length * 0.6)), entry.keywords.length)
      keywordsToBlank = shuffleArray([...entry.keywords]).slice(0, blankCount)
    } else {
      keywordsToBlank = [...entry.keywords]
    }
    let blankedDefinition = entry.definition
    keywordsToBlank.forEach((kw) => {
      blankedDefinition = blankedDefinition.replace(new RegExp(`\\b${escapeRegex(kw)}\\b`, "gi"), "___")
    })
    return { type: "def-cloze" as const, entry, keywords: keywordsToBlank, blankedDefinition }
  })
}

function generateMatchDefQuestions(
  entries: DefinitionEntry[],
  count: number = 5,
  difficulty: DifficultyLevel = "medium"
): DefMatchQuestion[] {
  let pairCount: number
  if (difficulty === "easy") pairCount = 5
  else if (difficulty === "medium") pairCount = 10
  else pairCount = 5
  const shuffled = shuffleArray(entries).slice(0, Math.min(pairCount, entries.length))
  if (difficulty === "hard") {
    const normalPairs = shuffled.map((e) => ({ term: e.term, definition: e.definition }))
    const remaining = entries.filter((e) => !shuffled.includes(e))
    const extraEntries = shuffleArray(remaining).slice(0, 5)
    const blankPairs = extraEntries.map((e) => {
      const kw = e.keywords[0]
      const blanked = kw ? e.definition.replace(new RegExp(`\\b${escapeRegex(kw)}\\b`, "gi"), "___") : e.definition
      return { term: e.term, definition: blanked }
    })
    return [{ type: "def-match" as const, pairs: [...normalPairs, ...blankPairs] }]
  }
  const pairs = shuffled.map((e) => ({ term: e.term, definition: e.definition }))
  return [{ type: "def-match" as const, pairs }]
}

function generateSpotMistakeQuestions(
  entries: DefinitionEntry[],
  allEntries: DefinitionEntry[],
  count: number = 5,
  difficulty: DifficultyLevel = "easy"
): DefSpotMistakeQuestion[] {
  const eligible = entries.filter((e) => e.keywords.length > 0)
  const shuffled = shuffleArray(eligible).slice(0, Math.min(count, eligible.length))
  return shuffled.map((entry) => {
    const keyword = entry.keywords[Math.floor(Math.random() * entry.keywords.length)]
    let wrongWord: string
    if (difficulty === "easy") {
      const pool = allEntries.filter((e) => e.topic !== entry.topic && e.keywords.length > 0)
      wrongWord = shuffleArray(pool)[0]?.keywords[0] ?? "temperature"
    } else if (difficulty === "medium") {
      const pool = allEntries.filter((e) => e.term !== entry.term && e.level === entry.level && e.keywords.length > 0)
      wrongWord = shuffleArray(pool)[0]?.keywords.find((k) => k !== keyword) ?? shuffleArray(pool)[0]?.keywords[0] ?? "displacement"
    } else {
      const pool = allEntries.filter((e) => e.topic === entry.topic && e.term !== entry.term && e.keywords.length > 0)
      const fallback = allEntries.filter((e) => e.term !== entry.term && e.keywords.length > 0)
      wrongWord = shuffleArray(pool.length > 0 ? pool : fallback)[0]?.keywords[0] ?? "mass"
    }
    const wrongStatement = entry.definition.replace(new RegExp(`\\b${escapeRegex(keyword)}\\b`, "gi"), wrongWord)
    const correctOption = `"${wrongWord}" should be "${keyword}"`
    const distractorPool = allEntries
      .flatMap((e) => e.keywords)
      .filter((k) => k !== keyword && k !== wrongWord)
    const distKws = shuffleArray([...new Set(distractorPool)]).slice(0, 3)
    const distractors = distKws.map((k) => `"${k}" should be "${keyword}"`)
    const options = shuffleArray([correctOption, ...distractors.slice(0, 3)])
    return {
      type: "def-spot-mistake" as const,
      entry,
      wrongStatement,
      wrongWord,
      correctWord: keyword,
      options,
      answer: options.indexOf(correctOption),
    }
  })
}

function generateSwappedQuestions(
  entries: DefinitionEntry[],
  difficulty: DifficultyLevel = "easy"
): DefSwappedQuestion[] {
  let numPairs: number
  let numSwapped: number
  if (difficulty === "easy") { numPairs = 5; numSwapped = 2 }
  else if (difficulty === "medium") { numPairs = 7; numSwapped = 3 }
  else { numPairs = 10; numSwapped = 4 }
  numPairs = Math.min(numPairs, entries.length)
  numSwapped = Math.min(numSwapped, Math.floor(numPairs / 2))
  const shuffled = shuffleArray(entries).slice(0, numPairs)
  const pairs = shuffled.map((entry) => ({
    term: entry.term,
    correctDef: entry.definition,
    displayedDef: entry.definition,
    isSwapped: false,
  }))
  const swapIdxs = shuffleArray(pairs.map((_, i) => i)).slice(0, numSwapped * 2)
  for (let i = 0; i + 1 < swapIdxs.length; i += 2) {
    const a = swapIdxs[i]
    const b = swapIdxs[i + 1]
    const tmp = pairs[a].displayedDef
    pairs[a].displayedDef = pairs[b].displayedDef
    pairs[b].displayedDef = tmp
    pairs[a].isSwapped = true
    pairs[b].isSwapped = true
  }
  return [{ type: "def-swapped" as const, pairs }]
}

function generateKeywordBuilderQuestions(
  entries: DefinitionEntry[],
  count: number = 5
): DefKeywordBuilderQuestion[] {
  const shuffled = shuffleArray(entries).slice(0, Math.min(count, entries.length))
  return shuffled.map((entry) => {
    const correctWords = entry.definition.split(/\s+/)
    return {
      type: "def-keyword-builder" as const,
      entry,
      scrambledWords: shuffleArray([...correctWords]),
      correctWords,
    }
  })
}

// Generates a mixed mc + match + keyword quiz focused on the user's weakest topic
function generateQuickGainsQuiz(
  levelEntries: DefinitionEntry[],
  progress: Record<string, DefProgress>
): { questions: DefQuestion[]; weakTopic: string } | null {
  // Build per-topic attempt stats
  const topicMap: Record<string, { incorrect: number; total: number }> = {}
  levelEntries.forEach((e) => {
    const p = progress[e.term]
    if (!p || p.correct + p.incorrect === 0) return
    if (!topicMap[e.topic]) topicMap[e.topic] = { incorrect: 0, total: 0 }
    topicMap[e.topic].incorrect += p.incorrect
    topicMap[e.topic].total += p.correct + p.incorrect
  })

  const sorted = Object.entries(topicMap)
    .filter(([, v]) => v.total > 0)
    .sort(([, a], [, b]) => b.incorrect / b.total - a.incorrect / a.total)

  if (sorted.length === 0) return null
  const weakTopic = sorted[0][0]
  const topicEntries = levelEntries.filter((e) => e.topic === weakTopic)

  // Prioritise terms they've got wrong, then unseen, then correct
  const wrongEntries = topicEntries.filter((e) => (progress[e.term]?.incorrect ?? 0) > 0)
  const unseenEntries = topicEntries.filter((e) => !progress[e.term])
  const otherEntries = topicEntries.filter((e) => progress[e.term] && (progress[e.term].incorrect ?? 0) === 0)
  const orderedEntries = [...shuffleArray(wrongEntries), ...shuffleArray(unseenEntries), ...shuffleArray(otherEntries)]

  const mcQs = generateMCDefQuestions(orderedEntries.slice(0, 3), levelEntries, 3, "easy")
  const matchQs = topicEntries.length >= 3 ? generateMatchDefQuestions(topicEntries, 3, "easy") : []
  const kwQs = generateKeywordBuilderQuestions(orderedEntries.slice(0, 2), 2)

  return { questions: [...mcQs, ...matchQs, ...kwQs], weakTopic }
}

// Ordered progression for definitions: quiz types must be completed in this order (each with all 3 difficulties)
const DEF_QUIZ_ORDER = ["mc", "match", "swapped", "cloze", "keyword-builder", "spot-mistake"] as const
type DefQuizOrder = (typeof DEF_QUIZ_ORDER)[number]

// Ordered progression for difficulties within each quiz type
const DEF_DIFF_ORDER: DifficultyLevel[] = ["easy", "medium", "hard"]

// --- Definitions Mode Component ---

function DefinitionsMode({
  selectedLevel,
  selectedSubject,
  onBack,
  isDarkMode,
  currentUser,
}: {
  selectedLevel: string
  selectedSubject?: SubjectId
  onBack: () => void
  isDarkMode: boolean
  currentUser?: UserAccount | null
}) {
  type DefPhase = "unit-select" | "topic-select" | "quiz" | "results" | "progress"
  type QuizType = "mc" | "cloze" | "match" | "spot-mistake" | "swapped" | "keyword-builder"

  const currentUserId = currentUser?.id

  // Locking applies only to pupils who haven't opted out
  const lockingEnabled = currentUser?.accountType === "pupil" && !currentUser?.disableModeLocking

  // Compute a subject-qualified level key so chemistry entries are kept separate from physics
  const levelKey = getDefLevelKey(selectedSubject, selectedLevel)

  const [phase, setPhase] = useState<DefPhase>("unit-select")
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [quizType, setQuizType] = useState<QuizType>("mc")
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("easy")
  const [questions, setQuestions] = useState<DefQuestion[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [mcAnswers, setMcAnswers] = useState<Record<number, number>>({})
  const [clozeAnswers, setClozeAnswers] = useState<Record<number, string[]>>({})
  const [matchSelections, setMatchSelections] = useState<Record<string, string>>({})
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [shuffledMatchDefs, setShuffledMatchDefs] = useState<{ term: string; definition: string }[]>([])
  const [spotMistakeAnswers, setSpotMistakeAnswers] = useState<Record<number, number>>({})
  const [swappedSelections, setSwappedSelections] = useState<Set<number>>(new Set())
  const [kwBuilderPlaced, setKwBuilderPlaced] = useState<Record<number, string[]>>({})
  const [kwBuilderBank, setKwBuilderBank] = useState<Record<number, string[]>>({})
  const [progress, setProgress] = useState<Record<string, DefProgress>>(() =>
    currentUserId ? loadUserDefProgress(currentUserId, selectedLevel) : loadDefProgress(selectedLevel)
  )
  const [completion, setCompletion] = useState<DefCompletion>(() =>
    currentUserId ? loadUserDefCompletion(currentUserId, selectedLevel) : loadDefCompletion(selectedLevel)
  )

  // Check if a specific quizType+difficulty combo is unlocked for a given topic
  const isUnlockedForTopic = (topic: string, qt: QuizType, diff: DifficultyLevel): boolean => {
    if (!lockingEnabled) return true
    const qtIdx = DEF_QUIZ_ORDER.indexOf(qt)
    const diffIdx = DEF_DIFF_ORDER.indexOf(diff)
    // First quiz type + first difficulty is always unlocked
    if (qtIdx === 0 && diffIdx === 0) return true
    // To unlock a higher difficulty in the same quiz type, previous difficulty must be completed
    if (diffIdx > 0) {
      const prevDiff = DEF_DIFF_ORDER[diffIdx - 1]
      if (!completion[`${topic}::${qt}::${prevDiff}`]) return false
    }
    // To unlock the first difficulty of a new quiz type, must complete all 3 difficulties of the previous quiz type
    if (qtIdx > 0 && diffIdx === 0) {
      const prevQt = DEF_QUIZ_ORDER[qtIdx - 1]
      for (const d of DEF_DIFF_ORDER) {
        if (!completion[`${topic}::${prevQt}::${d}`]) return false
      }
    }
    return true
  }

  // Check if a combo is unlocked for ALL selected topics (or uses fresh-start defaults if no topics selected)
  const isUnlocked = (qt: QuizType, diff: DifficultyLevel): boolean => {
    if (!lockingEnabled) return true
    if (selectedTopics.length === 0) return qt === "mc" && diff === "easy"
    return selectedTopics.every((topic) => isUnlockedForTopic(topic, qt, diff))
  }

  // Check if a combo has been completed for ALL selected topics
  const isCompleted = (qt: QuizType, diff: DifficultyLevel): boolean => {
    if (selectedTopics.length === 0) return false
    return selectedTopics.every((topic) => Boolean(completion[`${topic}::${qt}::${diff}`]))
  }

  const unitTopicsForLevel = DEF_UNIT_TOPICS[levelKey] ?? {}
  const levelEntries = DEFINITIONS_BANK.filter((e) => e.level === levelKey)
  // When a unit is selected, only expose topics that belong to that unit AND have entries in the bank
  const topicsInUnit = selectedUnit
    ? (unitTopicsForLevel[selectedUnit] ?? []).filter((t) => levelEntries.some((e) => e.topic === t))
    : []
  const topics = topicsInUnit

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]))
  }
  const selectAll = () => setSelectedTopics([...topicsInUnit])
  const clearAll = () => setSelectedTopics([])

  function prioritisedEntries(pool: DefinitionEntry[]): DefinitionEntry[] {
    return [...pool].sort((a, b) => {
      const pa = progress[a.term]
      const pb = progress[b.term]
      const scoreA = pa ? pa.incorrect / Math.max(1, pa.correct + pa.incorrect) : 0.5
      const scoreB = pb ? pb.incorrect / Math.max(1, pb.correct + pb.incorrect) : 0.5
      return scoreB - scoreA
    })
  }

  const startQuiz = () => {
    const filtered = levelEntries.filter((e) => selectedTopics.includes(e.topic))
    if (filtered.length === 0) return
    const ordered = prioritisedEntries(filtered)

    // Build unit→entries map for MC medium distractor pool (same unit)
    const unitEntriesMap: Record<string, DefinitionEntry[]> = {}
    Object.entries(unitTopicsForLevel).forEach(([, topicsList]) => {
      const unitPool = levelEntries.filter((e) => topicsList.includes(e.topic))
      topicsList.forEach((t) => { unitEntriesMap[t] = unitPool })
    })
    // Selected topic entries for MC hard distractor pool (same selected topics)
    const selectedTopicEntries = levelEntries.filter((e) => selectedTopics.includes(e.topic))

    let qs: DefQuestion[]
    if (quizType === "mc") qs = generateMCDefQuestions(ordered, levelEntries, 8, difficulty, unitEntriesMap, selectedTopicEntries)
    else if (quizType === "cloze") qs = generateClozeDefQuestions(ordered, 8, difficulty)
    else if (quizType === "match") qs = generateMatchDefQuestions(ordered, difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 10, difficulty)
    else if (quizType === "spot-mistake") qs = generateSpotMistakeQuestions(ordered, levelEntries, 6, difficulty)
    else if (quizType === "swapped") qs = generateSwappedQuestions(ordered, difficulty)
    else qs = generateKeywordBuilderQuestions(ordered, 6)
    setQuestions(qs)
    setCurrentIdx(0)
    setMcAnswers({})
    setClozeAnswers({})
    setMatchSelections({})
    setSelectedTerm(null)
    setSubmitted(false)
    setSpotMistakeAnswers({})
    setSwappedSelections(new Set())
    if (qs[0]?.type === "def-match") {
      setShuffledMatchDefs(shuffleArray((qs[0] as DefMatchQuestion).pairs))
    }
    const initPlaced: Record<number, string[]> = {}
    const initBank: Record<number, string[]> = {}
    qs.forEach((q, i) => {
      if (q.type === "def-keyword-builder") {
        initPlaced[i] = []
        initBank[i] = [...(q as DefKeywordBuilderQuestion).scrambledWords]
      }
    })
    setKwBuilderPlaced(initPlaced)
    setKwBuilderBank(initBank)
    setPhase("quiz")
  }

  const calcScore = (): { score: number; total: number; wrongTerms: string[]; missedKws: string[] } => {
    let score = 0; let total = 0
    const wrongTerms: string[] = []
    const missedKws: string[] = []
    questions.forEach((q, i) => {
      if (q.type === "def-mc") {
        total++
        if (mcAnswers[i] === q.answer) score++
        else wrongTerms.push(q.entry.term)
      } else if (q.type === "def-cloze") {
        q.keywords.forEach((kw, ki) => {
          total++
          const ans = (clozeAnswers[i]?.[ki] || "").trim().toLowerCase()
          if (ans === kw.toLowerCase()) score++
          else { wrongTerms.push(q.entry.term); missedKws.push(kw) }
        })
      } else if (q.type === "def-match") {
        q.pairs.forEach((pair) => {
          total++
          if (matchSelections[pair.term] === pair.definition) score++
          else wrongTerms.push(pair.term)
        })
      } else if (q.type === "def-spot-mistake") {
        total++
        if (spotMistakeAnswers[i] === q.answer) score++
        else wrongTerms.push(q.entry.term)
      } else if (q.type === "def-swapped") {
        q.pairs.forEach((pair, pi) => {
          total++
          const userSaysSwapped = swappedSelections.has(pi)
          if (userSaysSwapped === pair.isSwapped) score++
          else wrongTerms.push(pair.term)
        })
      } else if (q.type === "def-keyword-builder") {
        total++
        const placed = kwBuilderPlaced[i] ?? []
        if (placed.join(" ").toLowerCase() === q.correctWords.join(" ").toLowerCase()) score++
        else wrongTerms.push(q.entry.term)
      }
    })
    return { score, total, wrongTerms, missedKws }
  }

  const finishQuiz = () => {
    const { wrongTerms, missedKws } = calcScore()
    const updated = { ...progress }
    questions.forEach((q) => {
      const terms: string[] = []
      if ("entry" in q) terms.push((q as DefMCQuestion | DefClozeQuestion | DefSpotMistakeQuestion | DefKeywordBuilderQuestion).entry.term)
      else if (q.type === "def-match") q.pairs.forEach((p) => terms.push(p.term))
      else if (q.type === "def-swapped") q.pairs.forEach((p) => terms.push(p.term))
      terms.forEach((t) => {
        const prev = updated[t] || { correct: 0, incorrect: 0, lastSeen: 0, missedKeywords: [] }
        if (wrongTerms.includes(t)) {
          const termKws = DEFINITIONS_BANK.find((e) => e.term === t)?.keywords ?? []
          const newMissed = [...new Set([...prev.missedKeywords, ...missedKws.filter((k) => termKws.includes(k))])]
          updated[t] = { ...prev, incorrect: prev.incorrect + 1, lastSeen: Date.now(), missedKeywords: newMissed }
        } else {
          updated[t] = { ...prev, correct: prev.correct + 1, lastSeen: Date.now() }
        }
      })
    })
    setProgress(updated)
    if (currentUserId) saveUserDefProgress(currentUserId, selectedLevel, updated)
    else saveDefProgress(selectedLevel, updated)
    setSubmitted(true)
    // For each selected topic, mark this quizType+difficulty as completed only if ALL
    // definitions for that topic covered in this quiz were answered correctly.
    const updatedCompletion = { ...completion }
    // Build a set of terms answered wrongly for quick lookup
    const wrongTermSet = new Set(wrongTerms)
    // Collect which terms from which topics were tested in this quiz
    const topicTermsInQuiz: Record<string, string[]> = {}
    questions.forEach((q) => {
      const pairs: { term: string; topic: string }[] = []
      if ("entry" in q) {
        const entry = (q as DefMCQuestion | DefClozeQuestion | DefSpotMistakeQuestion | DefKeywordBuilderQuestion).entry
        pairs.push({ term: entry.term, topic: entry.topic })
      } else if (q.type === "def-match") {
        q.pairs.forEach((p) => {
          const entry = DEFINITIONS_BANK.find((e) => e.term === p.term)
          if (entry) pairs.push({ term: entry.term, topic: entry.topic })
        })
      } else if (q.type === "def-swapped") {
        q.pairs.forEach((p) => {
          const entry = DEFINITIONS_BANK.find((e) => e.term === p.term)
          if (entry) pairs.push({ term: entry.term, topic: entry.topic })
        })
      }
      pairs.forEach(({ term, topic }) => {
        if (!topicTermsInQuiz[topic]) topicTermsInQuiz[topic] = []
        if (!topicTermsInQuiz[topic].includes(term)) topicTermsInQuiz[topic].push(term)
      })
    })
    // Mark completion per topic: only if all terms for that topic were answered correctly
    selectedTopics.forEach((topic) => {
      const termsInQuiz = topicTermsInQuiz[topic] ?? []
      const allTopicTerms = levelEntries.filter((e) => e.topic === topic).map((e) => e.term)
      // All terms for this topic that appeared in the quiz must be answered correctly
      const allTestedCorrect = termsInQuiz.length > 0 && termsInQuiz.every((t) => !wrongTermSet.has(t))
      // Additionally, all terms in the subtopic must have been tested (full coverage) for locking-aware completion
      const fullCoverage = allTopicTerms.length > 0 && allTopicTerms.every((t) => termsInQuiz.includes(t))
      if (lockingEnabled) {
        // Under strict locking: require all subtopic terms to be tested AND all correct
        if (allTestedCorrect && fullCoverage) {
          updatedCompletion[`${topic}::${quizType}::${difficulty}`] = true
        }
      } else {
        // Without locking: mark complete if all tested terms were correct (partial coverage counts)
        if (allTestedCorrect) {
          updatedCompletion[`${topic}::${quizType}::${difficulty}`] = true
        }
      }
    })
    setCompletion(updatedCompletion)
    if (currentUserId) saveUserDefCompletion(currentUserId, selectedLevel, updatedCompletion)
    else saveDefCompletion(selectedLevel, updatedCompletion)
    setPhase("results")
  }

  const cardBase = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-xl"

  // Performance colour thresholds used throughout the component
  const STRONG_PCT = 70
  const MODERATE_PCT = 50
  const perfColour = (pct: number) =>
    pct >= STRONG_PCT ? "text-green-600" : pct >= MODERATE_PCT ? "text-amber-600" : "text-red-600"
  const perfBar = (pct: number) =>
    pct >= STRONG_PCT ? "bg-green-500" : pct >= MODERATE_PCT ? "bg-amber-500" : "bg-red-500"

  const diffColour = (d: DifficultyLevel) =>
    d === "easy" ? "text-green-600 dark:text-green-400" : d === "medium" ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
  const diffBg = (d: DifficultyLevel) =>
    d === "easy" ? "border-green-500 bg-green-50 dark:bg-green-900/20" : d === "medium" ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20" : "border-red-500 bg-red-50 dark:bg-red-900/20"

  function diffDesc(qt: QuizType, d: DifficultyLevel): string {
    const descs: Record<QuizType, Record<DifficultyLevel, string>> = {
      mc: { easy: "Very different distractors", medium: "Similar-sounding distractors", hard: "Plausible distractors" },
      cloze: { easy: "Remove 1 keyword", medium: "Remove 2–3 keywords", hard: "Remove all key terms" },
      match: { easy: "5 terms", medium: "10 terms", hard: "5 + 5 with blanks" },
      "spot-mistake": { easy: "Obvious mistake", medium: "Subtle misconception", hard: "Plausible wrong term" },
      swapped: { easy: "2 swaps from 5", medium: "3 swaps from 7", hard: "4 swaps from 10" },
      "keyword-builder": { easy: "Short definition", medium: "Full definition", hard: "Full definition" },
    }
    return descs[qt][d]
  }

  function toggleSwappedSelection(pi: number) {
    setSwappedSelections((prev) => {
      const next = new Set(prev)
      if (next.has(pi)) next.delete(pi)
      else next.add(pi)
      return next
    })
  }

  function updateClozeAnswer(qIdx: number, blankIdx: number, value: string) {
    setClozeAnswers((prev) => {
      const answers = [...(prev[qIdx] || [])]
      answers[blankIdx] = value
      return { ...prev, [qIdx]: answers }
    })
  }

  // --- Phase: Unit Selection ---
  if (phase === "unit-select") {
    const unitEmoji: Record<string, string> = {
      Dynamics: "⚡",
      Space: "🌌",
      "Properties of Matter": "🌡️",
      Electricity: "🔋",
      Waves: "〰️",
      Radiation: "☢️",
      Other: "📐",
    }

    const quickGains = generateQuickGainsQuiz(levelEntries, progress)

    const startQuickGainsQuiz = () => {
      if (!quickGains) return
      setQuestions(quickGains.questions)
      setCurrentIdx(0)
      setMcAnswers({})
      setClozeAnswers({})
      setMatchSelections({})
      setSelectedTerm(null)
      setSubmitted(false)
      setSpotMistakeAnswers({})
      setSwappedSelections(new Set())
      if (quickGains.questions[0]?.type === "def-match") {
        setShuffledMatchDefs(shuffleArray((quickGains.questions[0] as DefMatchQuestion).pairs))
      }
      const initPlaced: Record<number, string[]> = {}
      const initBank: Record<number, string[]> = {}
      quickGains.questions.forEach((q, i) => {
        if (q.type === "def-keyword-builder") {
          initPlaced[i] = []
          initBank[i] = [...(q as DefKeywordBuilderQuestion).scrambledWords]
        }
      })
      setKwBuilderPlaced(initPlaced)
      setKwBuilderBank(initBank)
      setPhase("quiz")
    }

    return (
      <div className="pt-24 min-h-screen p-6 animate-in fade-in slide-in-from-right-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-[#800000] mb-8 font-bold uppercase text-xs tracking-widest">
            <ChevronLeft className="w-4 h-4" />Back to Modes
          </button>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div>
              <h2 className="text-4xl font-black mb-1">Definitions</h2>
              <p className={`text-lg ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Select a unit for <span className="text-amber-600 font-bold">{selectedLevel}</span>
              </p>
            </div>
            <button
              onClick={() => setPhase("progress")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${isDarkMode ? "border-slate-600 hover:border-amber-400 hover:text-amber-400" : "border-slate-200 hover:border-amber-500 hover:text-amber-600"}`}>
              <BarChart2 className="w-4 h-4" />
              Progress Dashboard
            </button>
          </div>

          {/* Try This Today! */}
          {quickGains && (
            <div className={`rounded-2xl border-2 p-5 mb-6 ${isDarkMode ? "border-amber-700 bg-amber-900/20" : "border-amber-300 bg-amber-50"}`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className={`font-black text-sm uppercase tracking-widest ${isDarkMode ? "text-amber-300" : "text-amber-700"}`}>Try This Today for Quick Gains!</p>
                    <p className={`text-sm mt-1 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                      Suggested focus: <span className="font-bold">{quickGains.weakTopic}</span>
                    </p>
                    <p className={`text-xs mt-0.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Mixed quiz — multiple choice, match &amp; keyword builder — targeting your weak terms
                    </p>
                  </div>
                </div>
                <button
                  onClick={startQuickGainsQuiz}
                  className="shrink-0 px-5 py-2.5 rounded-xl font-black text-sm bg-amber-500 text-white hover:bg-amber-600 transition-colors">
                  Start Now →
                </button>
              </div>
            </div>
          )}

          {/* Unit cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {Object.entries(unitTopicsForLevel)
              .filter(([, topicsList]) => topicsList.some((t) => levelEntries.some((e) => e.topic === t)))
              .map(([unit, topicsList]) => {
                const unitEntries = levelEntries.filter((e) => topicsList.includes(e.topic))
                const totalTerms = unitEntries.length
                const topicCount = topicsList.filter((t) => levelEntries.some((e) => e.topic === t)).length
                const weakTerms = unitEntries.filter((e) => (progress[e.term]?.incorrect ?? 0) > 0).length
                return (
                  <button
                    key={unit}
                    onClick={() => { setSelectedUnit(unit); setSelectedTopics([]); setPhase("topic-select") }}
                    className={`flex flex-col items-start p-5 rounded-2xl border-2 text-left transition-all hover:-translate-y-1 hover:shadow-lg ${isDarkMode ? "border-slate-700 bg-slate-800 hover:border-amber-500" : "border-slate-200 bg-white hover:border-[#800000]"}`}>
                    <span className="text-3xl mb-3">{unitEmoji[unit] ?? "📚"}</span>
                    <h3 className="font-black text-base">{unit}</h3>
                    <p className={`text-xs mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{topicCount} topic{topicCount !== 1 ? "s" : ""} · {totalTerms} terms</p>
                    {weakTerms > 0 && <span className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-1.5">⚠ {weakTerms} weak term{weakTerms !== 1 ? "s" : ""}</span>}
                  </button>
                )
              })}
          </div>
        </div>
      </div>
    )
  }

  // --- Phase: Topic Selection ---
  if (phase === "topic-select") {
    const quizTypes = [
      { id: "mc" as const, icon: MousePointer2, title: "Multiple Choice", desc: "Pick the correct definition" },
      { id: "match" as const, icon: Grid3X3, title: "Match Up", desc: "Match terms to definitions" },
      { id: "swapped" as const, icon: ArrowLeftRight, title: "Swapped Definitions", desc: "Identify incorrectly matched pairs" },
      { id: "cloze" as const, icon: Type, title: "Cloze Test", desc: "Fill in missing keywords" },
      { id: "keyword-builder" as const, icon: Key, title: "Keyword Builder", desc: "Arrange words into a definition" },
      { id: "spot-mistake" as const, icon: AlertTriangle, title: "Spot the Mistake", desc: "Find the error in the definition" },
    ]
    const difficulties: { id: DifficultyLevel; label: string }[] = [
      { id: "easy", label: "Easy" },
      { id: "medium", label: "Medium" },
      { id: "hard", label: "Hard" },
    ]

    // A quiz type is selectable if at least "easy" is unlocked for all selected topics
    const isQTAvailable = (qt: QuizType) => isUnlocked(qt, "easy")
    // Whether the current quizType+difficulty selection is valid to start
    const canStart = selectedTopics.length > 0 && isUnlocked(quizType, difficulty)

    return (
      <div className="pt-24 min-h-screen p-6 animate-in fade-in slide-in-from-right-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setPhase("unit-select")} className="flex items-center gap-2 text-slate-500 hover:text-[#800000] mb-8 font-bold uppercase text-xs tracking-widest">
            <ChevronLeft className="w-4 h-4" />Back to Units
          </button>
          <h2 className="text-4xl font-black mb-2">Definitions — {selectedUnit}</h2>
          <p className={`text-lg mb-8 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Select topics and quiz format for <span className="text-amber-600 font-bold">{selectedLevel}</span>
          </p>

          {/* Topic selection */}
          <div className={`rounded-2xl border-2 p-6 mb-6 ${cardBase}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black">Select Topics</h3>
              <div className="flex gap-2">
                <button onClick={selectAll} className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 transition-colors">All</button>
                <button onClick={clearAll} className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">Clear</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {topics.map((topic) => {
                const count = levelEntries.filter((e) => e.topic === topic).length
                const sel = selectedTopics.includes(topic)
                const topicEntries = levelEntries.filter((e) => e.topic === topic)
                const weakCount = topicEntries.filter((e) => (progress[e.term]?.incorrect ?? 0) > 0).length
                return (
                  <button key={topic} onClick={() => toggleTopic(topic)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left transition-all ${sel ? "border-[#800000] bg-red-50 dark:bg-red-900/20" : isDarkMode ? "border-slate-600 hover:border-slate-500" : "border-slate-200 hover:border-slate-300"}`}>
                    <div>
                      <span className="font-semibold text-sm">{topic}</span>
                      {weakCount > 0 && <span className="ml-2 text-xs text-amber-600 dark:text-amber-400 font-bold">⚠ {weakCount} weak</span>}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${sel ? "bg-[#800000] text-white" : isDarkMode ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-500"}`}>{count}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quiz type selection */}
          <div className={`rounded-2xl border-2 p-6 mb-6 ${cardBase}`}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-black">Quiz Format</h3>
              {lockingEnabled && <span className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Complete each format in order to unlock the next</span>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {quizTypes.map((qt) => {
                const locked = !isQTAvailable(qt.id)
                const done = isCompleted(qt.id, "hard") // fully completed (all 3 difficulties)
                return (
                  <button
                    key={qt.id}
                    onClick={() => { if (!locked) setQuizType(qt.id) }}
                    disabled={locked}
                    title={locked ? "Complete the previous quiz format first" : undefined}
                    className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                      locked
                        ? isDarkMode
                          ? "border-slate-700 opacity-40 cursor-not-allowed"
                          : "border-slate-200 opacity-40 cursor-not-allowed"
                        : quizType === qt.id
                          ? "border-[#800000] bg-red-50 dark:bg-red-900/20 text-[#800000]"
                          : isDarkMode
                            ? "border-slate-600 hover:border-slate-400"
                            : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    {locked && <span className="absolute top-2 right-2 text-xs">🔒</span>}
                    {done && !locked && <span className="absolute top-2 right-2 text-xs">✅</span>}
                    <qt.icon className="w-6 h-6 mb-2" />
                    <span className="font-black text-sm">{qt.title}</span>
                    <span className={`text-xs mt-1 text-center ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{qt.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Difficulty selection */}
          <div className={`rounded-2xl border-2 p-6 mb-6 ${cardBase}`}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-black">Difficulty</h3>
              {lockingEnabled && <span className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Complete easy before medium, medium before hard</span>}
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {difficulties.map((d) => {
                const locked = !isUnlocked(quizType, d.id)
                const done = isCompleted(quizType, d.id)
                return (
                  <button
                    key={d.id}
                    onClick={() => { if (!locked) setDifficulty(d.id) }}
                    disabled={locked}
                    title={locked ? "Complete the previous difficulty first" : undefined}
                    className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                      locked
                        ? isDarkMode
                          ? "border-slate-700 opacity-40 cursor-not-allowed"
                          : "border-slate-200 opacity-40 cursor-not-allowed"
                        : difficulty === d.id
                          ? diffBg(d.id)
                          : isDarkMode
                            ? "border-slate-600 hover:border-slate-400"
                            : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    {locked && <span className="absolute top-2 right-2 text-xs">🔒</span>}
                    {done && !locked && <span className="absolute top-2 right-2 text-xs">✅</span>}
                    <span className={`font-black text-sm ${difficulty === d.id && !locked ? diffColour(d.id) : ""}`}>{d.label}</span>
                    <span className={`text-xs mt-1 text-center ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{diffDesc(quizType, d.id)}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <button onClick={startQuiz} disabled={!canStart}
            className="w-full py-4 rounded-2xl font-black text-lg bg-[#800000] text-white hover:bg-[#600000] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            {!canStart && selectedTopics.length > 0
              ? "🔒 Complete prerequisites first"
              : `Start Quiz (${selectedTopics.reduce((acc, t) => acc + levelEntries.filter((e) => e.topic === t).length, 0)} terms available)`}
          </button>
        </div>
      </div>
    )
  }

  // --- Phase: Quiz ---
  if (phase === "quiz") {
    const q = questions[currentIdx]
    const isLast = currentIdx === questions.length - 1
    const isSinglePage = q.type === "def-match" || q.type === "def-swapped"

    return (
      <div className="pt-24 min-h-screen p-6 animate-in fade-in">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => selectedTopics.length > 0 ? setPhase("topic-select") : setPhase("unit-select")} className="flex items-center gap-2 text-slate-500 hover:text-[#800000] font-bold uppercase text-xs tracking-widest">
              <ChevronLeft className="w-4 h-4" />Exit
            </button>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${diffBg(difficulty)} ${diffColour(difficulty)}`}>{difficulty}</span>
              <span className={`text-sm font-bold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                {isSinglePage ? (q.type === "def-match" ? "Match Up" : "Swapped Definitions") : `${currentIdx + 1} / ${questions.length}`}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          {!isSinglePage && (
            <div className={`w-full h-2 rounded-full mb-6 ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>
              <div className="h-2 rounded-full bg-[#800000] transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
            </div>
          )}

          {/* MC Question */}
          {q.type === "def-mc" && (
            <div className={`rounded-2xl border-2 p-8 ${cardBase}`}>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 ${isDarkMode ? "bg-slate-700 text-amber-400" : "bg-amber-100 text-amber-700"}`}>{q.entry.topic}</div>
              <p className={`text-sm font-bold uppercase tracking-widest mb-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>What is the definition of…</p>
              <h3 className="text-2xl font-black mb-6">{q.entry.term}</h3>
              <div className="space-y-3">
                {q.options.map((opt, i) => {
                  const chosen = mcAnswers[currentIdx] === i
                  return (
                    <button key={i} onClick={() => setMcAnswers((prev) => ({ ...prev, [currentIdx]: i }))}
                      className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition-all ${chosen ? "border-[#800000] bg-red-50 dark:bg-red-900/20 text-[#800000]" : isDarkMode ? "border-slate-600 hover:border-slate-400" : "border-slate-200 hover:border-slate-400"}`}>
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Cloze Question */}
          {q.type === "def-cloze" && (
            <div className={`rounded-2xl border-2 p-8 ${cardBase}`}>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 ${isDarkMode ? "bg-slate-700 text-amber-400" : "bg-amber-100 text-amber-700"}`}>{q.entry.topic}</div>
              <p className={`text-sm font-bold uppercase tracking-widest mb-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Complete the definition</p>
              <h3 className="text-2xl font-black mb-4">{q.entry.term}</h3>
              <div className={`text-lg leading-relaxed mb-2 flex flex-wrap items-center gap-1 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                {q.blankedDefinition.split("___").map((part, pi, arr) => (
                  <React.Fragment key={pi}>
                    <span>{part}</span>
                    {pi < arr.length - 1 && (
                      <input
                        type="text"
                        value={clozeAnswers[currentIdx]?.[pi] || ""}
                        onChange={(e) => updateClozeAnswer(currentIdx, pi, e.target.value)}
                        placeholder={`word ${pi + 1}`}
                        className={`inline-block w-32 px-2 py-1 rounded-lg border-2 font-medium text-base outline-none transition-colors focus:border-[#800000] ${isDarkMode ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" : "bg-white border-slate-200 placeholder:text-slate-400"}`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
              {q.keywords.length > 1 && <p className={`text-xs mt-2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>{q.keywords.length} blanks to fill</p>}
            </div>
          )}

          {/* Match Question */}
          {q.type === "def-match" && (
            <div className={`rounded-2xl border-2 p-6 ${cardBase}`}>
              <p className={`text-sm font-bold uppercase tracking-widest mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Click a term, then click its matching definition</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <p className={`text-xs font-black uppercase tracking-widest mb-2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Terms</p>
                  {q.pairs.map((pair) => {
                    const isMatched = matchSelections[pair.term] !== undefined
                    const isActive = selectedTerm === pair.term
                    return (
                      <button key={pair.term}
                        onClick={() => {
                          if (isMatched) { setMatchSelections((prev) => { const n = { ...prev }; delete n[pair.term]; return n }); setSelectedTerm(null) }
                          else setSelectedTerm(isActive ? null : pair.term)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${isMatched ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" : isActive ? "border-[#800000] bg-red-50 dark:bg-red-900/20 text-[#800000]" : isDarkMode ? "border-slate-600 hover:border-slate-400" : "border-slate-200 hover:border-slate-400"}`}>
                        {pair.term}
                        {isMatched && <span className={`block text-xs font-normal mt-0.5 truncate ${isDarkMode ? "text-green-400" : "text-green-600"}`}>✓ matched</span>}
                      </button>
                    )
                  })}
                </div>
                <div className="space-y-2">
                  <p className={`text-xs font-black uppercase tracking-widest mb-2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Definitions</p>
                  {(shuffledMatchDefs.length > 0 ? shuffledMatchDefs : [...q.pairs]).map((pair) => {
                    const matchedTerm = Object.entries(matchSelections).find(([, def]) => def === pair.definition)?.[0]
                    const isMatched = matchedTerm !== undefined
                    return (
                      <button key={pair.definition}
                        onClick={() => { if (selectedTerm && !isMatched) { setMatchSelections((prev) => ({ ...prev, [selectedTerm]: pair.definition })); setSelectedTerm(null) } }}
                        disabled={isMatched || !selectedTerm}
                        className={`w-full text-left px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all ${isMatched ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" : selectedTerm ? isDarkMode ? "border-slate-500 hover:border-amber-400 cursor-pointer" : "border-slate-300 hover:border-[#800000] cursor-pointer" : isDarkMode ? "border-slate-600 opacity-60" : "border-slate-200 opacity-60"}`}>
                        {pair.definition}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Spot the Mistake Question */}
          {q.type === "def-spot-mistake" && (
            <div className={`rounded-2xl border-2 p-8 ${cardBase}`}>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 ${isDarkMode ? "bg-slate-700 text-amber-400" : "bg-amber-100 text-amber-700"}`}>{q.entry.topic}</div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <p className={`text-sm font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Spot the Mistake</p>
              </div>
              <h3 className="text-2xl font-black mb-2">{q.entry.term}</h3>
              <p className={`text-lg mb-2 leading-relaxed font-medium ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>"{q.wrongStatement}"</p>
              <p className={`text-sm mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>What is wrong with this definition?</p>
              <div className="space-y-3">
                {q.options.map((opt, i) => {
                  const chosen = spotMistakeAnswers[currentIdx] === i
                  return (
                    <button key={i} onClick={() => setSpotMistakeAnswers((prev) => ({ ...prev, [currentIdx]: i }))}
                      className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition-all ${chosen ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300" : isDarkMode ? "border-slate-600 hover:border-slate-400" : "border-slate-200 hover:border-slate-400"}`}>
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Swapped Definitions Question */}
          {q.type === "def-swapped" && (
            <div className={`rounded-2xl border-2 p-6 ${cardBase}`}>
              <div className="flex items-center gap-2 mb-2">
                <ArrowLeftRight className="w-5 h-5 text-purple-500" />
                <p className={`text-sm font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Swapped Definitions</p>
              </div>
              <p className={`text-sm mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Click on any pairs where the definition is <strong>wrong</strong> for that term</p>
              <div className="space-y-2">
                {q.pairs.map((pair, pi) => {
                  const selected = swappedSelections.has(pi)
                  return (
                    <button key={pi} onClick={() => toggleSwappedSelection(pi)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${selected ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" : isDarkMode ? "border-slate-600 hover:border-slate-400" : "border-slate-200 hover:border-slate-400"}`}>
                      <span className={`font-black text-sm ${isDarkMode ? "text-white" : "text-slate-900"}`}>{pair.term}</span>
                      {selected && <span className="ml-2 text-xs text-purple-600 dark:text-purple-400 font-bold">⚠ marked as wrong</span>}
                      <p className={`text-sm mt-1 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>{pair.displayedDef}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Keyword Builder Question */}
          {q.type === "def-keyword-builder" && (
            <div className={`rounded-2xl border-2 p-8 ${cardBase}`}>
              <div className="flex items-center gap-2 mb-2">
                <Key className="w-5 h-5 text-blue-500" />
                <p className={`text-sm font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Keyword Builder</p>
              </div>
              <h3 className="text-2xl font-black mb-2">{q.entry.term}</h3>
              <p className={`text-sm mb-4 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Arrange the words to build the correct definition:</p>
              {/* Placed words area */}
              <div className={`min-h-16 p-3 rounded-xl border-2 mb-4 flex flex-wrap gap-2 ${isDarkMode ? "border-slate-600 bg-slate-700/50" : "border-slate-300 bg-slate-50"}`}>
                {(kwBuilderPlaced[currentIdx] ?? []).length === 0 && <span className={`text-sm italic ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Click words below to build the definition…</span>}
                {(kwBuilderPlaced[currentIdx] ?? []).map((word, wi) => (
                  <button key={`placed-${wi}-${word}`}
                    onClick={() => {
                      setKwBuilderPlaced((prev) => {
                        const arr = [...(prev[currentIdx] ?? [])]
                        arr.splice(wi, 1)
                        return { ...prev, [currentIdx]: arr }
                      })
                      setKwBuilderBank((prev) => ({ ...prev, [currentIdx]: [...(prev[currentIdx] ?? []), word] }))
                    }}
                    className="px-3 py-1 rounded-lg bg-[#800000] text-white text-sm font-bold hover:bg-[#600000] transition-colors">
                    {word}
                  </button>
                ))}
              </div>
              {/* Word bank */}
              <div className="flex flex-wrap gap-2">
                {(kwBuilderBank[currentIdx] ?? []).map((word, wi) => (
                  <button key={`bank-${wi}-${word}`}
                    onClick={() => {
                      setKwBuilderBank((prev) => {
                        const arr = [...(prev[currentIdx] ?? [])]
                        arr.splice(wi, 1)
                        return { ...prev, [currentIdx]: arr }
                      })
                      setKwBuilderPlaced((prev) => ({ ...prev, [currentIdx]: [...(prev[currentIdx] ?? []), word] }))
                    }}
                    className={`px-3 py-1 rounded-lg border-2 text-sm font-bold transition-all ${isDarkMode ? "border-slate-600 hover:border-amber-400 bg-slate-700" : "border-slate-300 hover:border-[#800000] bg-white"}`}>
                    {word}
                  </button>
                ))}
              </div>
              {(kwBuilderBank[currentIdx] ?? []).length === 0 && (kwBuilderPlaced[currentIdx] ?? []).length > 0 && (
                <p className={`text-xs mt-3 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>All words placed — click Next to confirm.</p>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {currentIdx > 0 && !isSinglePage && (
              <button onClick={() => setCurrentIdx((i) => i - 1)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold border-2 transition-colors ${isDarkMode ? "border-slate-600 hover:border-slate-400" : "border-slate-200 hover:border-slate-400"}`}>
                <ChevronLeft className="w-4 h-4" />Back
              </button>
            )}
            <button
              onClick={() => {
                if (isLast || isSinglePage) {
                  finishQuiz()
                } else {
                  setCurrentIdx((i) => i + 1)
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black bg-[#800000] text-white hover:bg-[#600000] transition-colors">
              {isLast || isSinglePage ? "Finish" : "Next"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // --- Phase: Progress Dashboard ---
  if (phase === "progress") {
    // Build per-topic stats from the definitions progress data
    const progressByTopic = Object.entries(unitTopicsForLevel)
      .flatMap(([unit, topicsList]) => topicsList.map((topic) => ({ unit, topic })))
      .filter(({ topic }) => levelEntries.some((e) => e.topic === topic))
      .map(({ unit, topic }) => {
        const entries = levelEntries.filter((e) => e.topic === topic)
        const seen = entries.filter((e) => progress[e.term] && (progress[e.term].correct + progress[e.term].incorrect) > 0)
        const totalAttempts = seen.reduce((acc, e) => acc + progress[e.term].correct + progress[e.term].incorrect, 0)
        const correctAttempts = seen.reduce((acc, e) => acc + progress[e.term].correct, 0)
        const pctTopic = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : null
        return { unit, topic, entries, seen, totalAttempts, pctTopic }
      })

    const attempted = progressByTopic.filter((t) => t.pctTopic !== null)
    const notAttempted = progressByTopic.filter((t) => t.pctTopic === null)
    const weakTopicsProgress = [...attempted].sort((a, b) => a.pctTopic! - b.pctTopic!).slice(0, 5)
    const strongTopicsProgress = [...attempted].sort((a, b) => b.pctTopic! - a.pctTopic!).slice(0, 5)

    const totalAttemptedTerms = Object.values(progress).filter((p) => p.correct + p.incorrect > 0).length
    const totalCorrectAll = Object.values(progress).reduce((acc, p) => acc + p.correct, 0)
    const totalAttemptsAll = Object.values(progress).reduce((acc, p) => acc + p.correct + p.incorrect, 0)
    const overallPct = totalAttemptsAll > 0 ? Math.round((totalCorrectAll / totalAttemptsAll) * 100) : null

    return (
      <div className="pt-24 min-h-screen p-6 animate-in fade-in slide-in-from-right-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setPhase("unit-select")} className="flex items-center gap-2 text-slate-500 hover:text-[#800000] mb-8 font-bold uppercase text-xs tracking-widest">
            <ChevronLeft className="w-4 h-4" />Back to Units
          </button>
          <h2 className="text-4xl font-black mb-2">Progress Dashboard</h2>
          <p className={`text-lg mb-8 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Definitions progress for <span className="text-amber-600 font-bold">{selectedLevel}</span>
          </p>

          {/* Overall summary */}
          <div className={`rounded-2xl border-2 p-6 mb-6 ${cardBase}`}>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className={`text-3xl font-black ${overallPct !== null ? perfColour(overallPct) : "text-slate-400"}`}>
                  {overallPct !== null ? `${overallPct}%` : "—"}
                </p>
                <p className={`text-xs font-bold uppercase mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Overall</p>
              </div>
              <div>
                <p className="text-3xl font-black text-amber-600">{totalAttemptedTerms}</p>
                <p className={`text-xs font-bold uppercase mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Terms Seen</p>
              </div>
              <div>
                <p className="text-3xl font-black text-blue-600">{attempted.length}</p>
                <p className={`text-xs font-bold uppercase mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Topics Started</p>
              </div>
            </div>
          </div>

          {/* Needs Focus (weakest topics) */}
          {weakTopicsProgress.length > 0 && (
            <div className={`rounded-2xl border-2 p-6 mb-6 ${cardBase}`}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-black">Needs Focus</h3>
              </div>
              <div className="space-y-4">
                {weakTopicsProgress.map(({ unit, topic, entries, pctTopic }) => (
                  <div key={topic}>
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="font-semibold text-sm">{topic}</span>
                        <span className={`ml-2 text-xs ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>{unit}</span>
                      </div>
                      <span className={`text-sm font-black ${perfColour(pctTopic!)}`}>{pctTopic}%</span>
                    </div>
                    <div className={`w-full h-2 rounded-full mb-2 ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>
                      <div className={`h-2 rounded-full ${perfBar(pctTopic!)}`} style={{ width: `${pctTopic}%` }} />
                    </div>
                    {/* Individual terms */}
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      {entries
                        .filter((e) => progress[e.term] && (progress[e.term].correct + progress[e.term].incorrect) > 0)
                        .sort((a, b) => {
                          const pa = progress[a.term]; const pb = progress[b.term]
                          return (pb.incorrect / Math.max(1, pb.correct + pb.incorrect)) - (pa.incorrect / Math.max(1, pa.correct + pa.incorrect))
                        })
                        .map((e) => {
                          const p = progress[e.term]
                          const tot = p.correct + p.incorrect
                          const termPct = Math.round((p.correct / tot) * 100)
                          return (
                            <div key={e.term} className={`flex items-center justify-between px-2 py-1 rounded-lg text-xs ${isDarkMode ? "bg-slate-700/50" : "bg-slate-100"}`}>
                              <span className="font-medium truncate mr-2">{e.term}</span>
                              <span className={`font-bold shrink-0 ${perfColour(termPct)}`}>{termPct}%</span>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strongest topics */}
          {strongTopicsProgress.length > 0 && (
            <div className={`rounded-2xl border-2 p-6 mb-6 ${cardBase}`}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-black">Strongest Topics</h3>
              </div>
              <div className="space-y-3">
                {strongTopicsProgress.map(({ unit, topic, pctTopic }) => (
                  <div key={topic} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between mb-0.5">
                        <span className="text-sm font-semibold">{topic}</span>
                        <span className={`text-sm font-black ${perfColour(pctTopic!)}`}>{pctTopic}%</span>
                      </div>
                      <p className={`text-xs ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>{unit}</p>
                      <div className={`w-full h-1.5 rounded-full mt-1 ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>
                        <div className={`h-1.5 rounded-full ${perfBar(pctTopic!)}`} style={{ width: `${pctTopic}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Not yet attempted */}
          {notAttempted.length > 0 && (
            <div className={`rounded-2xl border-2 p-6 mb-6 ${cardBase}`}>
              <h3 className={`text-lg font-black mb-4 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>📚 Not Yet Attempted</h3>
              <div className="flex flex-wrap gap-2">
                {notAttempted.map(({ topic, unit }) => (
                  <span key={topic} className={`text-xs px-3 py-1.5 rounded-full font-bold ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                    {topic} <span className={`${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>· {unit}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {attempted.length === 0 && (
            <div className={`rounded-2xl border-2 p-10 text-center ${cardBase}`}>
              <p className="text-4xl mb-4">📊</p>
              <p className={`font-bold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>No data yet — complete some quizzes to see your progress here.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // --- Phase: Results ---
  const { score, total: totalQuestions, wrongTerms } = calcScore()
  const pct = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
  const grade = pct >= 80 ? "Excellent" : pct >= 60 ? "Good" : pct >= 40 ? "Developing" : "Needs Practice"
  const gradeColor = pct >= 80 ? "text-green-600" : pct >= 60 ? "text-amber-600" : pct >= 40 ? "text-orange-500" : "text-red-600"

  const suggestedDifficulty: DifficultyLevel = pct >= 80 && difficulty !== "hard" ? (difficulty === "easy" ? "medium" : "hard") : difficulty

  return (
    <div className="pt-24 min-h-screen p-6 animate-in fade-in">
      <div className="max-w-2xl mx-auto text-center">
        <div className={`rounded-3xl border-2 p-10 mb-6 ${cardBase}`}>
          <div className="text-6xl mb-4">{pct >= 80 ? "🏆" : pct >= 60 ? "⭐" : pct >= 40 ? "📚" : "💪"}</div>
          <h2 className="text-4xl font-black mb-2">{grade}</h2>
          <p className={`text-lg mb-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            You scored <span className={`font-black text-2xl ${gradeColor}`}>{score}/{totalQuestions}</span> ({pct}%)
          </p>
          {pct >= 80 && difficulty !== "hard" && (
            <p className="text-sm mb-4 font-bold text-green-600 dark:text-green-400">
              🎯 Great work! Try <span className="capitalize">{suggestedDifficulty}</span> difficulty next time.
            </p>
          )}
          {wrongTerms.length > 0 && (
            <div className={`mt-4 p-4 rounded-xl border-2 text-left ${isDarkMode ? "border-amber-700 bg-amber-900/20" : "border-amber-200 bg-amber-50"}`}>
              <p className={`text-sm font-black mb-2 ${isDarkMode ? "text-amber-300" : "text-amber-700"}`}>⚠ Definitions to review ({wrongTerms.length}):</p>
              <div className="flex flex-wrap gap-2">
                {[...new Set(wrongTerms)].map((t) => (
                  <span key={t} className={`text-xs px-2 py-1 rounded-full font-bold ${isDarkMode ? "bg-amber-900/40 text-amber-300" : "bg-amber-100 text-amber-700"}`}>{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Per-question review for MC, Cloze, Spot the Mistake */}
          {questions.some((q) => q.type === "def-mc" || q.type === "def-cloze" || q.type === "def-spot-mistake") && (
            <div className="text-left space-y-3 mt-6">
              {questions.map((q, i) => {
                if (q.type === "def-match" || q.type === "def-swapped" || q.type === "def-keyword-builder") return null
                let isCorrect = false
                if (q.type === "def-mc") isCorrect = mcAnswers[i] === q.answer
                else if (q.type === "def-cloze") isCorrect = q.keywords.every((kw, ki) => (clozeAnswers[i]?.[ki] || "").trim().toLowerCase() === kw.toLowerCase())
                else if (q.type === "def-spot-mistake") isCorrect = spotMistakeAnswers[i] === q.answer
                return (
                  <div key={i} className={`px-4 py-3 rounded-xl border-2 text-sm ${isCorrect ? "border-green-400 bg-green-50 dark:bg-green-900/20" : "border-red-400 bg-red-50 dark:bg-red-900/20"}`}>
                    <p className="font-black">{q.entry.term}</p>
                    <p className={isDarkMode ? "text-slate-300" : "text-slate-600"}>
                      {q.type === "def-spot-mistake" ? <>Correct answer: <span className="font-medium">{q.options[q.answer]}</span></> : q.entry.definition}
                    </p>
                    {!isCorrect && q.type === "def-mc" && <p className="text-red-600 dark:text-red-400 text-xs mt-1">Your answer: {mcAnswers[i] !== undefined ? q.options[mcAnswers[i]] : "No answer"}</p>}
                    {!isCorrect && q.type === "def-cloze" && <p className="text-red-600 dark:text-red-400 text-xs mt-1">Expected: {q.keywords.join(", ")}</p>}
                  </div>
                )
              })}
            </div>
          )}

          {/* Swapped review */}
          {questions.some((q) => q.type === "def-swapped") && (
            <div className="text-left space-y-2 mt-6">
              <p className={`text-sm font-black mb-2 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Swapped Definitions — Correct Answers:</p>
              {(questions.find((q) => q.type === "def-swapped") as DefSwappedQuestion | undefined)?.pairs.map((pair, pi) => {
                const userSaid = swappedSelections.has(pi)
                const wasSwapped = pair.isSwapped
                const correct = userSaid === wasSwapped
                return (
                  <div key={pi} className={`px-4 py-3 rounded-xl border-2 text-sm ${correct ? "border-green-400 bg-green-50 dark:bg-green-900/20" : "border-red-400 bg-red-50 dark:bg-red-900/20"}`}>
                    <span className="font-black">{pair.term}</span>
                    {wasSwapped && <span className="ml-2 text-xs font-bold text-red-600">⚠ Was swapped</span>}
                    {wasSwapped && <p className={`text-xs mt-1 ${isDarkMode ? "text-green-400" : "text-green-700"}`}>Correct: {pair.correctDef}</p>}
                  </div>
                )
              })}
            </div>
          )}

          {/* Progress snapshot */}
          {Object.keys(progress).length > 0 && (
            <div className={`mt-6 p-4 rounded-xl border-2 text-left ${isDarkMode ? "border-slate-600 bg-slate-700/30" : "border-slate-200 bg-slate-50"}`}>
              <p className={`text-sm font-black mb-3 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>📊 Progress Tracker</p>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {Object.entries(progress)
                  .filter(([, p]) => p.correct + p.incorrect > 0)
                  .sort(([, a], [, b]) => (b.incorrect / Math.max(1, b.correct + b.incorrect)) - (a.incorrect / Math.max(1, a.correct + a.incorrect)))
                  .slice(0, 10)
                  .map(([term, p]) => {
                    const total = p.correct + p.incorrect
                    const pctCorrect = Math.round((p.correct / total) * 100)
                    return (
                      <div key={term} className="flex items-center justify-between text-xs">
                        <span className={`font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{term}</span>
                        <div className="flex items-center gap-2">
                          <div className={`w-16 h-1.5 rounded-full ${isDarkMode ? "bg-slate-600" : "bg-slate-200"}`}>
                            <div className={`h-1.5 rounded-full ${perfBar(pctCorrect)}`} style={{ width: `${pctCorrect}%` }} />
                          </div>
                          <span className={`w-8 text-right font-bold ${perfColour(pctCorrect)}`}>{pctCorrect}%</span>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={() => { setDifficulty(suggestedDifficulty); setPhase("unit-select") }}
            className={`flex-1 py-3 rounded-xl font-black border-2 transition-colors ${isDarkMode ? "border-slate-600 hover:border-slate-400" : "border-slate-200 hover:border-slate-400"}`}>
            New Quiz
          </button>
          <button onClick={() => setPhase("progress")}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-black border-2 transition-colors ${isDarkMode ? "border-amber-600 hover:border-amber-400 text-amber-400" : "border-amber-400 hover:border-amber-600 text-amber-600"}`}>
            <BarChart2 className="w-4 h-4" />
            Progress
          </button>
          <button onClick={() => { startQuiz() }}
            className="flex-1 py-3 rounded-xl font-black bg-[#800000] text-white hover:bg-[#600000] transition-colors">
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Calculations Mode
// ─────────────────────────────────────────────────────────────────────────────

interface CalcQuestion {
  id: string
  /** The stem shown to the student */
  stem: string
  /** Equation / formula hint */
  equation?: string
  /** Multiple-choice options (undefined → typed answer) */
  options?: string[]
  /** Index into options for the correct answer (MC) */
  correctOption?: number
  /** Correct typed answer, may include unit */
  correctAnswer?: string
  /** Mark scheme / worked solution shown after answering */
  markScheme: string
  /** For "correct-me" questions: index of the wrong option */
  mistakeOptionIndex?: number
  /** For "correct-me" questions: step-by-step lines of working (replaces options) */
  workingLines?: string[]
  /** For multi-step exam questions: sub-steps */
  steps?: CalcStep[]
}

interface CalcStep {
  id: string
  stem: string
  equation?: string
  options?: string[]
  correctOption?: number
  correctAnswer?: string
  markScheme: string
}

// Demonstration question banks ─────────────────────────────────────────────

const CALC_SINGLE_EQ_LEVELS: {
  level: number
  label: string
  desc: string
  emoji: string
}[] = [
  { level: 1, label: "Basic MC",             emoji: "1️⃣", desc: "Basic numbers, multiple-choice, no rearranging" },
  { level: 2, label: "Basic Typed",          emoji: "2️⃣", desc: "Basic numbers, typed answers, no rearranging" },
  { level: 3, label: "Rearranging MC",       emoji: "3️⃣", desc: "Rearranging required, basic numbers, multiple-choice" },
  { level: 4, label: "Rearranging Typed",    emoji: "4️⃣", desc: "Rearranging required, basic numbers, typed answers" },
  { level: 5, label: "Complex Numbers",      emoji: "5️⃣", desc: "Complex numbers, rearranging, rounding required" },
  { level: 6, label: "Prefixes",             emoji: "6️⃣", desc: "Complex numbers, rearranging, SI prefixes" },
  { level: 7, label: "Non-SI Units",         emoji: "7️⃣", desc: "Complex numbers, rearranging, non-SI units" },
  { level: 8, label: "Everything",           emoji: "8️⃣", desc: "All of the above combined" },
]

function getDemoSingleEqQuestions(level: number): CalcQuestion[] {
  const mc = level === 1 || level === 3
  if (level <= 2) {
    return [
      {
        id: "l1-1",
        stem: "A force of 12 N acts on a mass of 3 kg. Calculate the acceleration.",
        equation: "F = ma",
        options: mc ? ["2 ms⁻²", "4 ms⁻²", "9 ms⁻²", "36 ms⁻²"] : undefined,
        correctOption: mc ? 1 : undefined,
        correctAnswer: mc ? undefined : "4 ms⁻²",
        markScheme: "a = F ÷ m = 12 ÷ 3 = 4 ms⁻²",
      },
      {
        id: "l1-2",
        stem: "A wave travels at 300 ms⁻¹ with a frequency of 50 Hz. Calculate the wavelength.",
        equation: "v = f λ",
        options: mc ? ["250 m", "6 m", "350 m", "15 000 m"] : undefined,
        correctOption: mc ? 1 : undefined,
        correctAnswer: mc ? undefined : "6 m",
        markScheme: "λ = v ÷ f = 300 ÷ 50 = 6 m",
      },
      {
        id: "l1-3",
        stem: "An object of mass 5 kg is on Earth (g = 10 Nkg⁻¹). Calculate its weight.",
        equation: "W = mg",
        options: mc ? ["0.5 N", "2 N", "50 N", "500 N"] : undefined,
        correctOption: mc ? 2 : undefined,
        correctAnswer: mc ? undefined : "50 N",
        markScheme: "W = m × g = 5 × 10 = 50 N",
      },
    ]
  }
  if (level <= 4) {
    return [
      {
        id: "l3-1",
        stem: "The acceleration of an object is 5 ms⁻² when a force of 20 N is applied. Calculate the mass.",
        equation: "F = ma  →  m = F ÷ a",
        options: mc ? ["0.25 kg", "4 kg", "15 kg", "100 kg"] : undefined,
        correctOption: mc ? 1 : undefined,
        correctAnswer: mc ? undefined : "4 kg",
        markScheme: "m = F ÷ a = 20 ÷ 5 = 4 kg",
      },
      {
        id: "l3-2",
        stem: "A wave has a wavelength of 2 m and speed 340 ms⁻¹. Calculate the frequency.",
        equation: "v = f λ  →  f = v ÷ λ",
        options: mc ? ["170 Hz", "680 Hz", "342 Hz", "338 Hz"] : undefined,
        correctOption: mc ? 0 : undefined,
        correctAnswer: mc ? undefined : "170 Hz",
        markScheme: "f = v ÷ λ = 340 ÷ 2 = 170 Hz",
      },
      {
        id: "l3-3",
        stem: "An object weighs 49 N on Earth (g = 9.8 Nkg⁻¹). Calculate its mass.",
        equation: "W = mg  →  m = W ÷ g",
        options: mc ? ["5 kg", "58.8 kg", "39.2 kg", "480.2 kg"] : undefined,
        correctOption: mc ? 0 : undefined,
        correctAnswer: mc ? undefined : "5 kg",
        markScheme: "m = W ÷ g = 49 ÷ 9.8 = 5 kg",
      },
    ]
  }
  if (level === 5) {
    return [
      {
        id: "l5-1",
        stem: "A car of mass 1 250 kg accelerates at 3.6 ms⁻². Calculate the resultant force. Give your answer to 3 significant figures.",
        equation: "F = ma",
        correctAnswer: "4 500 N",
        markScheme: "F = 1 250 × 3.6 = 4 500 N",
      },
      {
        id: "l5-2",
        stem: "A wave has speed 3.4 × 10² ms⁻¹ and wavelength 0.034 m. Calculate the frequency. Give your answer to 3 significant figures.",
        equation: "v = f λ  →  f = v ÷ λ",
        correctAnswer: "1.00 × 10⁴ Hz",
        markScheme: "f = 340 ÷ 0.034 = 10 000 Hz = 1.00 × 10⁴ Hz",
      },
    ]
  }
  if (level === 6) {
    return [
      {
        id: "l6-1",
        stem: "A resistor has a voltage of 12 V across it and a current of 40 mA through it. Calculate the resistance.",
        equation: "V = IR  →  R = V ÷ I",
        correctAnswer: "300 Ω",
        markScheme: "I = 40 mA = 0.040 A;  R = 12 ÷ 0.040 = 300 Ω",
      },
      {
        id: "l6-2",
        stem: "A wave has frequency 2.5 kHz and speed 340 ms⁻¹. Calculate the wavelength.",
        equation: "v = f λ  →  λ = v ÷ f",
        correctAnswer: "0.136 m",
        markScheme: "f = 2.5 kHz = 2 500 Hz;  λ = 340 ÷ 2 500 = 0.136 m",
      },
    ]
  }
  if (level === 7) {
    return [
      {
        id: "l7-1",
        stem: "A car travels at 72 km/h for 15 minutes. Calculate the distance covered in metres.",
        equation: "d = v t",
        correctAnswer: "18 000 m",
        markScheme: "v = 72 km/h = 20 ms⁻¹;  t = 15 min = 900 s;  d = 20 × 900 = 18 000 m",
      },
      {
        id: "l7-2",
        stem: "A temperature of 25 °C is converted to kelvin. Calculate the value.",
        equation: "T (K) = T (°C) + 273",
        correctAnswer: "298 K",
        markScheme: "T = 25 + 273 = 298 K",
      },
    ]
  }
  // level 8 – everything
  return [
    {
      id: "l8-1",
      stem: "An object of mass 850 g is accelerated from rest to 72 km/h in 8.0 s. Calculate the resultant force in newtons. Give your answer to 2 significant figures.",
      equation: "a = Δv ÷ t;  F = ma",
      correctAnswer: "2.1 N",
      markScheme: "v = 72 km/h = 20 ms⁻¹;  a = 20 ÷ 8 = 2.5 ms⁻²;  m = 0.850 kg;  F = 0.850 × 2.5 = 2.125 N ≈ 2.1 N",
    },
    {
      id: "l8-2",
      stem: "A 2.2 kΩ resistor carries a current of 5.0 mA. Calculate the voltage across it.",
      equation: "V = IR",
      correctAnswer: "11 V",
      markScheme: "R = 2 200 Ω;  I = 0.005 A;  V = 2 200 × 0.005 = 11 V",
    },
    {
      id: "l8-3",
      stem: "An X-ray photon has wavelength 0.10 nm. Calculate its frequency. (speed of light = 3.0 × 10⁸ ms⁻¹)",
      equation: "v = f λ  →  f = v ÷ λ",
      correctAnswer: "3.0 × 10¹⁸ Hz",
      markScheme: "λ = 0.10 nm = 1.0 × 10⁻¹⁰ m;  f = 3.0×10⁸ ÷ 1.0×10⁻¹⁰ = 3.0×10¹⁸ Hz",
    },
  ]
}

const CALC_EXAM_QUESTIONS: CalcQuestion[] = [
  {
    id: "exam-1",
    stem: "A ball is launched horizontally at 15 ms⁻¹ from a cliff. Use the following steps to find where it lands.",
    markScheme: "See individual steps.",
    steps: [
      {
        id: "exam-1-a",
        stem: "(a) The ball takes 2.0 s to reach the ground. Calculate the horizontal distance travelled.",
        equation: "d = v t",
        correctAnswer: "30 m",
        markScheme: "d = 15 × 2.0 = 30 m",
      },
      {
        id: "exam-1-b",
        stem: "(b) Calculate the vertical velocity of the ball just before impact. (g = 9.8 ms⁻²)",
        equation: "v = u + at",
        correctAnswer: "19.6 ms⁻¹",
        markScheme: "v = 0 + 9.8 × 2.0 = 19.6 ms⁻¹",
      },
      {
        id: "exam-1-c",
        stem: "(c) Using your horizontal velocity (15 ms⁻¹) and the vertical velocity from (b), calculate the resultant speed.",
        equation: "v = √(vₓ² + vᵧ²)",
        correctAnswer: "24.7 ms⁻¹",
        markScheme: "v = √(15² + 19.6²) = √(225 + 384.16) = √609.16 ≈ 24.7 ms⁻¹",
      },
    ],
  },
  {
    id: "exam-2",
    stem: "A circuit has a 9 V battery and two resistors in series: R₁ = 100 Ω, R₂ = 200 Ω.",
    markScheme: "See individual steps.",
    steps: [
      {
        id: "exam-2-a",
        stem: "(a) Calculate the total resistance.",
        equation: "R_total = R₁ + R₂",
        correctAnswer: "300 Ω",
        markScheme: "R_total = 100 + 200 = 300 Ω",
      },
      {
        id: "exam-2-b",
        stem: "(b) Calculate the current through the circuit.",
        equation: "I = V ÷ R",
        correctAnswer: "0.030 A",
        markScheme: "I = 9 ÷ 300 = 0.030 A (30 mA)",
      },
      {
        id: "exam-2-c",
        stem: "(c) Using your answer from (b), calculate the voltage across R₂.",
        equation: "V = IR",
        correctAnswer: "6 V",
        markScheme: "V = 0.030 × 200 = 6 V",
      },
    ],
  },
]

const CALC_CORRECT_ME_QUESTIONS: CalcQuestion[] = [
  {
    id: "cm-1",
    stem: "A student calculated the weight of a 5 kg mass on Earth (g = 9.8 Nkg⁻¹). One line contains a mistake — tap it.",
    equation: "W = mg",
    workingLines: [
      "W = mg",
      "W = 5 ÷ 9.8",
      "W = 0.51 N",
    ],
    mistakeOptionIndex: 1,
    markScheme: "Line 2 is wrong: the student divided by g instead of multiplying.\nCorrect working: W = m × g = 5 × 9.8 = 49 N",
  },
  {
    id: "cm-2",
    stem: "A student found the frequency of a wave with speed 340 ms⁻¹ and wavelength 0.68 m. One line contains a mistake — tap it.",
    equation: "f = v ÷ λ",
    workingLines: [
      "f = v ÷ λ",
      "f = 340 × 0.68",
      "f = 231.2 Hz",
    ],
    mistakeOptionIndex: 1,
    markScheme: "Line 2 is wrong: the student multiplied v × λ instead of dividing.\nCorrect working: f = v ÷ λ = 340 ÷ 0.68 = 500 Hz",
  },
  {
    id: "cm-3",
    stem: "A student used F = ma to find the force on a 2 kg object accelerating at 3 ms⁻². One line contains a mistake — tap it.",
    equation: "F = ma",
    workingLines: [
      "F = ma",
      "F = 2 + 3",
      "F = 5 N",
    ],
    mistakeOptionIndex: 1,
    markScheme: "Line 2 is wrong: the student added m and a instead of multiplying.\nCorrect working: F = m × a = 2 × 3 = 6 N",
  },
  {
    id: "cm-4",
    stem: "A student calculated the kinetic energy of a 4 kg object moving at 3 ms⁻¹. One line contains a mistake — tap it.",
    equation: "Ek = ½mv²",
    workingLines: [
      "Ek = ½mv²",
      "Ek = ½ × 4 × 3",
      "Ek = 6 J",
    ],
    mistakeOptionIndex: 1,
    markScheme: "Line 2 is wrong: the student forgot to square the velocity.\nCorrect working: Ek = ½ × 4 × 3² = ½ × 4 × 9 = 18 J",
  },
  {
    id: "cm-5",
    stem: "A student calculated the current through a 12 Ω resistor with a voltage of 6 V across it. One line contains a mistake — tap it.",
    equation: "V = IR  →  I = V ÷ R",
    workingLines: [
      "I = V ÷ R",
      "I = 12 ÷ 6",
      "I = 2 A",
    ],
    mistakeOptionIndex: 1,
    markScheme: "Line 2 is wrong: the student divided R by V instead of V by R.\nCorrect working: I = V ÷ R = 6 ÷ 12 = 0.5 A",
  },
  {
    id: "cm-6",
    stem: "A student calculated the gravitational potential energy of a 3 kg mass raised 5 m on Earth (g = 10 Nkg⁻¹). One line contains a mistake — tap it.",
    equation: "Ep = mgh",
    workingLines: [
      "Ep = mgh",
      "Ep = 3 × 5",
      "Ep = 15 J",
    ],
    mistakeOptionIndex: 1,
    markScheme: "Line 2 is wrong: the student forgot to include g in the calculation.\nCorrect working: Ep = m × g × h = 3 × 10 × 5 = 150 J",
  },
]

// ─── SQA Relationship Sheet Equations ────────────────────────────────────────

interface SQAEquation {
  id: string
  formula: string
  description: string
  topic: string
  sqaLevel: "N5" | "Higher" | "AH"
}

const SQA_EQUATIONS: SQAEquation[] = [
  // National 5 — Dynamics
  { id: "d-vt",        formula: "d = vt",          description: "Distance, Speed and Time",                 topic: "Dynamics",    sqaLevel: "N5" },
  { id: "v-uat",       formula: "v = u + at",       description: "Equations of Motion (v)",                  topic: "Dynamics",    sqaLevel: "N5" },
  { id: "s-uat2",      formula: "s = ut + ½at²",    description: "Equations of Motion (s)",                  topic: "Dynamics",    sqaLevel: "N5" },
  { id: "v2-uas",      formula: "v² = u² + 2as",    description: "Equations of Motion (v²)",                 topic: "Dynamics",    sqaLevel: "N5" },
  { id: "F-ma",        formula: "F = ma",            description: "Newton's Second Law",                      topic: "Dynamics",    sqaLevel: "N5" },
  { id: "W-mg",        formula: "W = mg",            description: "Weight",                                   topic: "Dynamics",    sqaLevel: "N5" },
  // National 5 — Energy
  { id: "Ek",          formula: "Ek = ½mv²",         description: "Kinetic Energy",                           topic: "Energy",      sqaLevel: "N5" },
  { id: "Ep",          formula: "Ep = mgh",           description: "Gravitational Potential Energy",           topic: "Energy",      sqaLevel: "N5" },
  { id: "P-Et",        formula: "P = E/t",            description: "Power",                                    topic: "Energy",      sqaLevel: "N5" },
  { id: "Eh",          formula: "Eh = cmΔT",          description: "Heat Energy",                              topic: "Energy",      sqaLevel: "N5" },
  // National 5 — Electricity
  { id: "Q-It",        formula: "Q = It",             description: "Charge",                                   topic: "Electricity", sqaLevel: "N5" },
  { id: "V-IR",        formula: "V = IR",             description: "Ohm's Law",                                topic: "Electricity", sqaLevel: "N5" },
  { id: "P-IV",        formula: "P = IV",             description: "Electrical Power (P = IV)",                topic: "Electricity", sqaLevel: "N5" },
  { id: "P-I2R",       formula: "P = I²R",            description: "Electrical Power (P = I²R)",               topic: "Electricity", sqaLevel: "N5" },
  { id: "P-V2R",       formula: "P = V²/R",           description: "Electrical Power (P = V²/R)",              topic: "Electricity", sqaLevel: "N5" },
  // National 5 — Waves
  { id: "v-fl",        formula: "v = fλ",             description: "Wave Equation",                            topic: "Waves",       sqaLevel: "N5" },
  { id: "T-1f",        formula: "T = 1/f",            description: "Period and Frequency",                     topic: "Waves",       sqaLevel: "N5" },
  { id: "diffraction", formula: "d sinθ = mλ",        description: "Diffraction Grating",                      topic: "Waves",       sqaLevel: "N5" },
  { id: "refraction",  formula: "n = sinθ₁ / sinθ₂", description: "Snell's Law",                              topic: "Waves",       sqaLevel: "N5" },
  // National 5 — Gas Laws
  { id: "temp-conv",   formula: "T(K) = T(°C) + 273", description: "Temperature Conversion",                  topic: "Gas Laws",    sqaLevel: "N5" },
  { id: "gas-law",     formula: "p₁V₁/T₁ = p₂V₂/T₂", description: "Ideal Gas Law",                           topic: "Gas Laws",    sqaLevel: "N5" },
  // Higher — Dynamics
  { id: "F-kx",        formula: "F = kx",             description: "Hooke's Law (Spring Constant)",            topic: "Dynamics",    sqaLevel: "Higher" },
  { id: "impulse",     formula: "Ft = mv − mu",       description: "Impulse and Change in Momentum",           topic: "Dynamics",    sqaLevel: "Higher" },
  // Higher — Electricity
  { id: "E-QV",        formula: "E = QV",             description: "Energy of Charged Particle",               topic: "Electricity", sqaLevel: "Higher" },
  { id: "int-resist",  formula: "V = E − Ir",         description: "Internal Resistance",                      topic: "Electricity", sqaLevel: "Higher" },
  // Higher — Waves & Radiation
  { id: "E-hf",        formula: "E = hf",             description: "Photon Energy",                            topic: "Radiation",   sqaLevel: "Higher" },
  { id: "photoelectric", formula: "Ek = hf − hf₀",   description: "Photoelectric Effect",                     topic: "Radiation",   sqaLevel: "Higher" },
  { id: "irradiance",  formula: "I = P/A",            description: "Irradiance",                               topic: "Radiation",   sqaLevel: "Higher" },
  // Higher — Space
  { id: "mass-energy", formula: "E = mc²",            description: "Mass-Energy Equivalence",                  topic: "Space",       sqaLevel: "Higher" },
  { id: "redshift",    formula: "z = Δλ/λ",           description: "Redshift",                                 topic: "Space",       sqaLevel: "Higher" },
  { id: "hubble",      formula: "v = Hd",             description: "Hubble's Law",                             topic: "Space",       sqaLevel: "Higher" },
  // Advanced Higher — Gravitation
  { id: "gravity",     formula: "F = GMm/r²",         description: "Newton's Law of Gravitation",              topic: "Gravitation", sqaLevel: "AH" },
  // Advanced Higher — Relativity
  { id: "time-dilation",  formula: "t' = t / √(1 − v²/c²)", description: "Time Dilation",                    topic: "Relativity",  sqaLevel: "AH" },
  { id: "len-contract",   formula: "l' = l√(1 − v²/c²)",    description: "Length Contraction",               topic: "Relativity",  sqaLevel: "AH" },
]

// ─── Per-equation question banks ─────────────────────────────────────────────

const EQUATION_QUESTION_BANKS: Record<string, { easy: CalcQuestion[]; medium: CalcQuestion[]; hard: CalcQuestion[] }> = {

  // ── F = ma ─────────────────────────────────────────────────────────────────
  "F-ma": {
    easy: [
      { id: "Fma-e1", stem: "A 5 kg mass accelerates at 3 ms⁻². Calculate the resultant force.", equation: "F = ma", options: ["2 N", "15 N", "8 N", "0.6 N"], correctOption: 1, markScheme: "F = m × a = 5 × 3 = 15 N" },
      { id: "Fma-e2", stem: "A force of 12 N acts on a mass of 4 kg. Calculate the acceleration.", equation: "F = ma  →  a = F ÷ m", options: ["48 ms⁻²", "8 ms⁻²", "3 ms⁻²", "0.33 ms⁻²"], correctOption: 2, markScheme: "a = F ÷ m = 12 ÷ 4 = 3 ms⁻²" },
      { id: "Fma-e3", stem: "A force of 30 N gives an object an acceleration of 6 ms⁻². Calculate the mass.", equation: "F = ma  →  m = F ÷ a", options: ["0.2 kg", "5 kg", "36 kg", "180 kg"], correctOption: 1, markScheme: "m = F ÷ a = 30 ÷ 6 = 5 kg" },
      { id: "Fma-e4", stem: "A 10 kg trolley accelerates at 2.5 ms⁻². Calculate the resultant force.", equation: "F = ma", options: ["25 N", "7.5 N", "4 N", "12.5 N"], correctOption: 0, markScheme: "F = 10 × 2.5 = 25 N" },
    ],
    medium: [
      { id: "Fma-m1", stem: "A force of 12 N acts on a mass of 4 kg. Calculate the acceleration.", equation: "F = ma  →  a = F ÷ m", correctAnswer: "3 ms⁻²", markScheme: "a = F ÷ m = 12 ÷ 4 = 3 ms⁻²" },
      { id: "Fma-m2", stem: "A 6 kg trolley accelerates at 2.5 ms⁻². Calculate the resultant force.", equation: "F = ma", correctAnswer: "15 N", markScheme: "F = 6 × 2.5 = 15 N" },
      { id: "Fma-m3", stem: "A force of 45 N accelerates an object at 9 ms⁻². Calculate the mass.", equation: "F = ma  →  m = F ÷ a", correctAnswer: "5 kg", markScheme: "m = F ÷ a = 45 ÷ 9 = 5 kg" },
      { id: "Fma-m4", stem: "A car of mass 1 250 kg accelerates at 3.6 ms⁻². Calculate the resultant force.", equation: "F = ma", correctAnswer: "4 500 N", markScheme: "F = 1 250 × 3.6 = 4 500 N" },
    ],
    hard: [
      { id: "Fma-h1", stem: "An object of mass 850 g accelerates at 4.0 ms⁻². Calculate the resultant force.", equation: "F = ma", correctAnswer: "3.4 N", markScheme: "m = 850 g = 0.850 kg;  F = 0.850 × 4.0 = 3.4 N" },
      { id: "Fma-h2", stem: "A force of 2.4 kN acts on an object of mass 800 kg. Calculate the acceleration.", equation: "F = ma  →  a = F ÷ m", correctAnswer: "3.0 ms⁻²", markScheme: "F = 2.4 kN = 2 400 N;  a = 2 400 ÷ 800 = 3.0 ms⁻²" },
      { id: "Fma-h3", stem: "A car of mass 1.2 t accelerates from rest to 90 km/h in 10 s. Calculate the resultant force.", equation: "a = Δv ÷ t;  F = ma", correctAnswer: "3 000 N", markScheme: "m = 1.2 t = 1 200 kg;  v = 90 km/h = 25 ms⁻¹;  a = 25 ÷ 10 = 2.5 ms⁻²;  F = 1 200 × 2.5 = 3 000 N" },
    ],
  },

  // ── W = mg ─────────────────────────────────────────────────────────────────
  "W-mg": {
    easy: [
      { id: "Wmg-e1", stem: "An object has a mass of 5 kg. Calculate its weight on Earth. (g = 10 Nkg⁻¹)", equation: "W = mg", options: ["0.5 N", "2 N", "50 N", "500 N"], correctOption: 2, markScheme: "W = 5 × 10 = 50 N" },
      { id: "Wmg-e2", stem: "An object weighs 60 N on Earth (g = 10 Nkg⁻¹). Calculate its mass.", equation: "W = mg  →  m = W ÷ g", options: ["6 kg", "600 kg", "0.17 kg", "70 kg"], correctOption: 0, markScheme: "m = W ÷ g = 60 ÷ 10 = 6 kg" },
      { id: "Wmg-e3", stem: "An object of mass 4 kg is on the Moon (g = 1.6 Nkg⁻¹). Calculate its weight.", equation: "W = mg", options: ["2.5 N", "5.6 N", "6.4 N", "40 N"], correctOption: 2, markScheme: "W = 4 × 1.6 = 6.4 N" },
      { id: "Wmg-e4", stem: "An object weighs 49 N on Earth (g = 9.8 Nkg⁻¹). Calculate its mass.", equation: "W = mg  →  m = W ÷ g", options: ["5 kg", "58.8 kg", "39.2 kg", "480 kg"], correctOption: 0, markScheme: "m = W ÷ g = 49 ÷ 9.8 = 5 kg" },
    ],
    medium: [
      { id: "Wmg-m1", stem: "An object has a mass of 8 kg. Calculate its weight on Earth. (g = 9.8 Nkg⁻¹)", equation: "W = mg", correctAnswer: "78.4 N", markScheme: "W = 8 × 9.8 = 78.4 N" },
      { id: "Wmg-m2", stem: "An object weighs 250 N on Earth (g = 9.8 Nkg⁻¹). Calculate its mass to 3 sig. figs.", equation: "W = mg  →  m = W ÷ g", correctAnswer: "25.5 kg", markScheme: "m = 250 ÷ 9.8 = 25.510... ≈ 25.5 kg" },
      { id: "Wmg-m3", stem: "A 70 kg person stands on Mars (g = 3.7 Nkg⁻¹). Calculate their weight.", equation: "W = mg", correctAnswer: "259 N", markScheme: "W = 70 × 3.7 = 259 N" },
    ],
    hard: [
      { id: "Wmg-h1", stem: "An object of mass 2.5 kg has a weight of 14.5 N on a planet. Calculate the gravitational field strength on that planet.", equation: "W = mg  →  g = W ÷ m", correctAnswer: "5.8 Nkg⁻¹", markScheme: "g = W ÷ m = 14.5 ÷ 2.5 = 5.8 Nkg⁻¹" },
      { id: "Wmg-h2", stem: "A 500 g rock is on the Moon (g = 1.6 Nkg⁻¹). Calculate its weight.", equation: "W = mg", correctAnswer: "0.80 N", markScheme: "m = 500 g = 0.500 kg;  W = 0.500 × 1.6 = 0.80 N" },
    ],
  },

  // ── v = fλ ─────────────────────────────────────────────────────────────────
  "v-fl": {
    easy: [
      { id: "vfl-e1", stem: "A wave has frequency 50 Hz and wavelength 6 m. Calculate the wave speed.", equation: "v = fλ", options: ["8.3 ms⁻¹", "300 ms⁻¹", "56 ms⁻¹", "44 ms⁻¹"], correctOption: 1, markScheme: "v = f × λ = 50 × 6 = 300 ms⁻¹" },
      { id: "vfl-e2", stem: "A wave travels at 300 ms⁻¹ with wavelength 6 m. Calculate the frequency.", equation: "v = fλ  →  f = v ÷ λ", options: ["1 800 Hz", "306 Hz", "50 Hz", "0.02 Hz"], correctOption: 2, markScheme: "f = v ÷ λ = 300 ÷ 6 = 50 Hz" },
      { id: "vfl-e3", stem: "A wave has speed 340 ms⁻¹ and frequency 170 Hz. Calculate the wavelength.", equation: "v = fλ  →  λ = v ÷ f", options: ["510 m", "0.5 m", "2 m", "170 m"], correctOption: 2, markScheme: "λ = v ÷ f = 340 ÷ 170 = 2 m" },
      { id: "vfl-e4", stem: "A sound wave has wavelength 0.4 m and speed 320 ms⁻¹. Calculate the frequency.", equation: "v = fλ  →  f = v ÷ λ", options: ["128 Hz", "800 Hz", "320.4 Hz", "80 Hz"], correctOption: 1, markScheme: "f = 320 ÷ 0.4 = 800 Hz" },
    ],
    medium: [
      { id: "vfl-m1", stem: "A wave has frequency 200 Hz and wavelength 1.5 m. Calculate the wave speed.", equation: "v = fλ", correctAnswer: "300 ms⁻¹", markScheme: "v = 200 × 1.5 = 300 ms⁻¹" },
      { id: "vfl-m2", stem: "Light travels at 3.0 × 10⁸ ms⁻¹ with wavelength 5.0 × 10⁻⁷ m. Calculate the frequency.", equation: "v = fλ  →  f = v ÷ λ", correctAnswer: "6.0 × 10¹⁴ Hz", markScheme: "f = 3.0×10⁸ ÷ 5.0×10⁻⁷ = 6.0×10¹⁴ Hz" },
      { id: "vfl-m3", stem: "A wave has speed 3.4 × 10² ms⁻¹ and wavelength 0.034 m. Calculate the frequency.", equation: "v = fλ  →  f = v ÷ λ", correctAnswer: "1.0 × 10⁴ Hz", markScheme: "f = 340 ÷ 0.034 = 10 000 Hz = 1.0 × 10⁴ Hz" },
      { id: "vfl-m4", stem: "A radio station broadcasts at 98 MHz (c = 3.0 × 10⁸ ms⁻¹). Calculate the wavelength.", equation: "v = fλ  →  λ = v ÷ f", correctAnswer: "3.1 m", markScheme: "f = 98×10⁶ Hz;  λ = 3.0×10⁸ ÷ 98×10⁶ = 3.06... ≈ 3.1 m" },
    ],
    hard: [
      { id: "vfl-h1", stem: "A wave has frequency 2.5 kHz and speed 340 ms⁻¹. Calculate the wavelength.", equation: "v = fλ  →  λ = v ÷ f", correctAnswer: "0.136 m", markScheme: "f = 2.5 kHz = 2 500 Hz;  λ = 340 ÷ 2 500 = 0.136 m" },
      { id: "vfl-h2", stem: "An X-ray photon has wavelength 0.10 nm. Calculate its frequency. (c = 3.0 × 10⁸ ms⁻¹)", equation: "v = fλ  →  f = v ÷ λ", correctAnswer: "3.0 × 10¹⁸ Hz", markScheme: "λ = 0.10 nm = 1.0×10⁻¹⁰ m;  f = 3.0×10⁸ ÷ 1.0×10⁻¹⁰ = 3.0×10¹⁸ Hz" },
      { id: "vfl-h3", stem: "A microwave oven uses microwaves of wavelength 12 cm. (c = 3.0 × 10⁸ ms⁻¹). Calculate the frequency.", equation: "v = fλ  →  f = v ÷ λ", correctAnswer: "2.5 × 10⁹ Hz", markScheme: "λ = 12 cm = 0.12 m;  f = 3.0×10⁸ ÷ 0.12 = 2.5×10⁹ Hz" },
    ],
  },

  // ── V = IR ─────────────────────────────────────────────────────────────────
  "V-IR": {
    easy: [
      { id: "VIR-e1", stem: "A resistor has a resistance of 5 Ω and carries a current of 2 A. Calculate the voltage across it.", equation: "V = IR", options: ["7 V", "10 V", "2.5 V", "3 V"], correctOption: 1, markScheme: "V = I × R = 2 × 5 = 10 V" },
      { id: "VIR-e2", stem: "A voltage of 12 V is applied across a 3 Ω resistor. Calculate the current.", equation: "V = IR  →  I = V ÷ R", options: ["36 A", "15 A", "0.25 A", "4 A"], correctOption: 3, markScheme: "I = V ÷ R = 12 ÷ 3 = 4 A" },
      { id: "VIR-e3", stem: "A current of 3 A flows through a resistor with a voltage of 24 V across it. Calculate the resistance.", equation: "V = IR  →  R = V ÷ I", options: ["72 Ω", "8 Ω", "21 Ω", "0.125 Ω"], correctOption: 1, markScheme: "R = V ÷ I = 24 ÷ 3 = 8 Ω" },
      { id: "VIR-e4", stem: "A 10 Ω resistor is connected to a 5 A supply. Calculate the voltage across it.", equation: "V = IR", options: ["0.5 V", "50 V", "15 V", "2 V"], correctOption: 1, markScheme: "V = 5 × 10 = 50 V" },
    ],
    medium: [
      { id: "VIR-m1", stem: "A resistor has resistance 8 Ω. A current of 2.5 A flows through it. Calculate the voltage.", equation: "V = IR", correctAnswer: "20 V", markScheme: "V = 2.5 × 8 = 20 V" },
      { id: "VIR-m2", stem: "A 9 V battery is connected to a 180 Ω resistor. Calculate the current.", equation: "V = IR  →  I = V ÷ R", correctAnswer: "0.050 A", markScheme: "I = 9 ÷ 180 = 0.050 A (50 mA)" },
      { id: "VIR-m3", stem: "A current of 0.25 A flows through a resistor when a 6 V source is connected. Calculate the resistance.", equation: "V = IR  →  R = V ÷ I", correctAnswer: "24 Ω", markScheme: "R = V ÷ I = 6 ÷ 0.25 = 24 Ω" },
      { id: "VIR-m4", stem: "A circuit draws a current of 1.5 A from a 12 V supply. Calculate the resistance of the circuit.", equation: "V = IR  →  R = V ÷ I", correctAnswer: "8 Ω", markScheme: "R = 12 ÷ 1.5 = 8 Ω" },
    ],
    hard: [
      { id: "VIR-h1", stem: "A resistor has a voltage of 12 V across it and a current of 40 mA. Calculate the resistance.", equation: "V = IR  →  R = V ÷ I", correctAnswer: "300 Ω", markScheme: "I = 40 mA = 0.040 A;  R = 12 ÷ 0.040 = 300 Ω" },
      { id: "VIR-h2", stem: "A current of 5.0 mA flows through a 2.2 kΩ resistor. Calculate the voltage across it.", equation: "V = IR", correctAnswer: "11 V", markScheme: "I = 0.0050 A;  R = 2 200 Ω;  V = 0.0050 × 2 200 = 11 V" },
      { id: "VIR-h3", stem: "A 6 V battery drives a current of 4.0 mA through a resistor. Calculate the resistance.", equation: "V = IR  →  R = V ÷ I", correctAnswer: "1 500 Ω", markScheme: "I = 4.0 mA = 0.0040 A;  R = 6 ÷ 0.0040 = 1 500 Ω (1.5 kΩ)" },
    ],
  },

  // ── Q = It ─────────────────────────────────────────────────────────────────
  "Q-It": {
    easy: [
      { id: "QIt-e1", stem: "A current of 2 A flows for 5 s. Calculate the charge transferred.", equation: "Q = It", options: ["0.4 C", "7 C", "10 C", "3 C"], correctOption: 2, markScheme: "Q = I × t = 2 × 5 = 10 C" },
      { id: "QIt-e2", stem: "A charge of 30 C flows through a wire in 6 s. Calculate the current.", equation: "Q = It  →  I = Q ÷ t", options: ["24 A", "36 A", "5 A", "180 A"], correctOption: 2, markScheme: "I = Q ÷ t = 30 ÷ 6 = 5 A" },
      { id: "QIt-e3", stem: "A current of 3 A transfers 24 C of charge. Calculate the time taken.", equation: "Q = It  →  t = Q ÷ I", options: ["72 s", "8 s", "21 s", "0.125 s"], correctOption: 1, markScheme: "t = Q ÷ I = 24 ÷ 3 = 8 s" },
      { id: "QIt-e4", stem: "A charge of 40 C flows in 8 s. Calculate the current.", equation: "Q = It  →  I = Q ÷ t", options: ["320 A", "48 A", "5 A", "32 A"], correctOption: 2, markScheme: "I = 40 ÷ 8 = 5 A" },
    ],
    medium: [
      { id: "QIt-m1", stem: "A current of 0.5 A flows for 20 s. Calculate the charge transferred.", equation: "Q = It", correctAnswer: "10 C", markScheme: "Q = 0.5 × 20 = 10 C" },
      { id: "QIt-m2", stem: "A charge of 180 C is transferred in 2 minutes. Calculate the current.", equation: "Q = It  →  I = Q ÷ t", correctAnswer: "1.5 A", markScheme: "t = 2 × 60 = 120 s;  I = 180 ÷ 120 = 1.5 A" },
      { id: "QIt-m3", stem: "A current of 0.25 A flows until 15 C of charge has been transferred. Calculate the time.", equation: "Q = It  →  t = Q ÷ I", correctAnswer: "60 s", markScheme: "t = Q ÷ I = 15 ÷ 0.25 = 60 s" },
    ],
    hard: [
      { id: "QIt-h1", stem: "A current of 40 mA flows for 5 minutes. Calculate the charge transferred.", equation: "Q = It", correctAnswer: "12 C", markScheme: "I = 40 mA = 0.040 A;  t = 5 × 60 = 300 s;  Q = 0.040 × 300 = 12 C" },
      { id: "QIt-h2", stem: "A charge of 600 mC is transferred in 30 s. Calculate the current in mA.", equation: "Q = It  →  I = Q ÷ t", correctAnswer: "20 mA", markScheme: "Q = 0.600 C;  I = 0.600 ÷ 30 = 0.020 A = 20 mA" },
    ],
  },

  // ── P = IV ─────────────────────────────────────────────────────────────────
  "P-IV": {
    easy: [
      { id: "PIV-e1", stem: "A bulb has a current of 2 A and a voltage of 6 V. Calculate the power.", equation: "P = IV", options: ["4 W", "12 W", "8 W", "3 W"], correctOption: 1, markScheme: "P = I × V = 2 × 6 = 12 W" },
      { id: "PIV-e2", stem: "A device uses 30 W of power and draws a current of 5 A. Calculate the voltage.", equation: "P = IV  →  V = P ÷ I", options: ["150 V", "6 V", "25 V", "35 V"], correctOption: 1, markScheme: "V = P ÷ I = 30 ÷ 5 = 6 V" },
      { id: "PIV-e3", stem: "A kettle operates at 230 V and uses 1 150 W. Calculate the current.", equation: "P = IV  →  I = P ÷ V", options: ["264 500 A", "5 A", "920 A", "0.2 A"], correctOption: 1, markScheme: "I = P ÷ V = 1 150 ÷ 230 = 5 A" },
    ],
    medium: [
      { id: "PIV-m1", stem: "An electric motor draws a current of 3.5 A at 12 V. Calculate its power.", equation: "P = IV", correctAnswer: "42 W", markScheme: "P = 3.5 × 12 = 42 W" },
      { id: "PIV-m2", stem: "A hairdryer has a power of 1 500 W and operates on a 230 V supply. Calculate the current.", equation: "P = IV  →  I = P ÷ V", correctAnswer: "6.52 A", markScheme: "I = 1 500 ÷ 230 = 6.52 A (3 sig. figs.)" },
      { id: "PIV-m3", stem: "A lamp operates at 2.4 A and dissipates 60 W. Calculate the voltage across the lamp.", equation: "P = IV  →  V = P ÷ I", correctAnswer: "25 V", markScheme: "V = P ÷ I = 60 ÷ 2.4 = 25 V" },
    ],
    hard: [
      { id: "PIV-h1", stem: "A device draws 250 mA from a 12 V supply. Calculate its power.", equation: "P = IV", correctAnswer: "3.0 W", markScheme: "I = 250 mA = 0.250 A;  P = 0.250 × 12 = 3.0 W" },
      { id: "PIV-h2", stem: "A motor has a power of 3.6 kW and operates at 230 V. Calculate the current to 3 significant figures.", equation: "P = IV  →  I = P ÷ V", correctAnswer: "15.7 A", markScheme: "P = 3 600 W;  I = 3 600 ÷ 230 = 15.65... ≈ 15.7 A" },
    ],
  },

  // ── P = E/t ────────────────────────────────────────────────────────────────
  "P-Et": {
    easy: [
      { id: "PEt-e1", stem: "A device transfers 60 J of energy in 5 s. Calculate the power.", equation: "P = E/t", options: ["300 W", "12 W", "65 W", "55 W"], correctOption: 1, markScheme: "P = E ÷ t = 60 ÷ 5 = 12 W" },
      { id: "PEt-e2", stem: "A 40 W lamp is left on for 10 s. Calculate the energy transferred.", equation: "P = E/t  →  E = Pt", options: ["4 J", "50 J", "400 J", "30 J"], correctOption: 2, markScheme: "E = P × t = 40 × 10 = 400 J" },
      { id: "PEt-e3", stem: "A 100 W motor transfers 500 J of energy. Calculate the time taken.", equation: "P = E/t  →  t = E ÷ P", options: ["50 000 s", "5 s", "600 s", "0.2 s"], correctOption: 1, markScheme: "t = E ÷ P = 500 ÷ 100 = 5 s" },
      { id: "PEt-e4", stem: "An engine produces 2 000 J of work in 8 s. Calculate its power.", equation: "P = E/t", options: ["16 000 W", "250 W", "1 992 W", "2 008 W"], correctOption: 1, markScheme: "P = 2 000 ÷ 8 = 250 W" },
    ],
    medium: [
      { id: "PEt-m1", stem: "A 1 200 W microwave runs for 3.5 minutes. Calculate the energy transferred.", equation: "P = E/t  →  E = Pt", correctAnswer: "252 000 J", markScheme: "t = 3.5 × 60 = 210 s;  E = 1 200 × 210 = 252 000 J" },
      { id: "PEt-m2", stem: "A motor transfers 45 000 J of energy in 3 minutes. Calculate the power.", equation: "P = E/t", correctAnswer: "250 W", markScheme: "t = 3 × 60 = 180 s;  P = 45 000 ÷ 180 = 250 W" },
      { id: "PEt-m3", stem: "A 75 W device is left on for 2 hours. Calculate the energy transferred in joules.", equation: "P = E/t  →  E = Pt", correctAnswer: "540 000 J", markScheme: "t = 2 × 3 600 = 7 200 s;  E = 75 × 7 200 = 540 000 J" },
    ],
    hard: [
      { id: "PEt-h1", stem: "A pump transfers 1.8 MJ of energy in 30 minutes. Calculate the power.", equation: "P = E/t", correctAnswer: "1 000 W", markScheme: "E = 1.8×10⁶ J;  t = 30 × 60 = 1 800 s;  P = 1.8×10⁶ ÷ 1 800 = 1 000 W (1 kW)" },
      { id: "PEt-h2", stem: "A 2.5 kW water heater runs for 12 minutes. Calculate the energy transferred in MJ.", equation: "P = E/t  →  E = Pt", correctAnswer: "1.8 MJ", markScheme: "P = 2 500 W;  t = 12 × 60 = 720 s;  E = 2 500 × 720 = 1 800 000 J = 1.8 MJ" },
    ],
  },

  // ── d = vt ─────────────────────────────────────────────────────────────────
  "d-vt": {
    easy: [
      { id: "dvt-e1", stem: "An object travels at 5 ms⁻¹ for 10 s. Calculate the distance.", equation: "d = vt", options: ["2 m", "15 m", "50 m", "0.5 m"], correctOption: 2, markScheme: "d = v × t = 5 × 10 = 50 m" },
      { id: "dvt-e2", stem: "A car travels 120 m in 6 s. Calculate its average speed.", equation: "d = vt  →  v = d ÷ t", options: ["720 ms⁻¹", "20 ms⁻¹", "114 ms⁻¹", "126 ms⁻¹"], correctOption: 1, markScheme: "v = d ÷ t = 120 ÷ 6 = 20 ms⁻¹" },
      { id: "dvt-e3", stem: "A cyclist travels at 8 ms⁻¹ and covers 56 m. Calculate the time taken.", equation: "d = vt  →  t = d ÷ v", options: ["448 s", "7 s", "64 s", "48 s"], correctOption: 1, markScheme: "t = d ÷ v = 56 ÷ 8 = 7 s" },
      { id: "dvt-e4", stem: "A train travels at 25 ms⁻¹ for 4 s. Calculate the distance.", equation: "d = vt", options: ["6.25 m", "29 m", "21 m", "100 m"], correctOption: 3, markScheme: "d = 25 × 4 = 100 m" },
    ],
    medium: [
      { id: "dvt-m1", stem: "A car travels at 30 ms⁻¹ for 25 s. Calculate the distance.", equation: "d = vt", correctAnswer: "750 m", markScheme: "d = 30 × 25 = 750 m" },
      { id: "dvt-m2", stem: "A signal travels 1.5 × 10⁸ m in 0.5 s. Calculate its speed.", equation: "d = vt  →  v = d ÷ t", correctAnswer: "3.0 × 10⁸ ms⁻¹", markScheme: "v = 1.5×10⁸ ÷ 0.5 = 3.0×10⁸ ms⁻¹" },
      { id: "dvt-m3", stem: "Sound travels at 340 ms⁻¹. How long does it take to travel 1.02 km?", equation: "d = vt  →  t = d ÷ v", correctAnswer: "3.0 s", markScheme: "d = 1 020 m;  t = 1 020 ÷ 340 = 3.0 s" },
    ],
    hard: [
      { id: "dvt-h1", stem: "A car travels at 72 km/h for 15 minutes. Calculate the distance in metres.", equation: "d = vt", correctAnswer: "18 000 m", markScheme: "v = 72 km/h = 20 ms⁻¹;  t = 15 × 60 = 900 s;  d = 20 × 900 = 18 000 m" },
      { id: "dvt-h2", stem: "A train covers 4.5 km in 90 s. Calculate its speed in ms⁻¹.", equation: "d = vt  →  v = d ÷ t", correctAnswer: "50 ms⁻¹", markScheme: "d = 4 500 m;  v = 4 500 ÷ 90 = 50 ms⁻¹" },
      { id: "dvt-h3", stem: "A probe travels at 1.5 × 10⁴ ms⁻¹ for 2.0 hours. Calculate the distance in km.", equation: "d = vt", correctAnswer: "1.08 × 10⁵ km", markScheme: "t = 2.0 × 3 600 = 7 200 s;  d = 1.5×10⁴ × 7 200 = 1.08×10⁸ m = 1.08×10⁵ km" },
    ],
  },

  // ── Ek = ½mv² ──────────────────────────────────────────────────────────────
  "Ek": {
    easy: [
      { id: "Ek-e1", stem: "A 2 kg ball moves at 4 ms⁻¹. Calculate its kinetic energy.", equation: "Ek = ½mv²", options: ["8 J", "16 J", "4 J", "32 J"], correctOption: 1, markScheme: "Ek = ½ × 2 × 4² = ½ × 2 × 16 = 16 J" },
      { id: "Ek-e2", stem: "An object has kinetic energy of 50 J and a mass of 4 kg. Calculate its speed.", equation: "Ek = ½mv²  →  v = √(2Ek ÷ m)", options: ["25 ms⁻¹", "5 ms⁻¹", "6.25 ms⁻¹", "100 ms⁻¹"], correctOption: 1, markScheme: "v = √(2×50 ÷ 4) = √25 = 5 ms⁻¹" },
      { id: "Ek-e3", stem: "A 10 kg trolley moves at 3 ms⁻¹. Calculate its kinetic energy.", equation: "Ek = ½mv²", options: ["30 J", "15 J", "45 J", "90 J"], correctOption: 2, markScheme: "Ek = ½ × 10 × 9 = 45 J" },
    ],
    medium: [
      { id: "Ek-m1", stem: "A 1 200 kg car moves at 15 ms⁻¹. Calculate its kinetic energy.", equation: "Ek = ½mv²", correctAnswer: "135 000 J", markScheme: "Ek = ½ × 1 200 × 15² = ½ × 1 200 × 225 = 135 000 J" },
      { id: "Ek-m2", stem: "A 0.5 kg ball has kinetic energy of 36 J. Calculate its speed.", equation: "Ek = ½mv²  →  v = √(2Ek ÷ m)", correctAnswer: "12 ms⁻¹", markScheme: "v = √(2×36 ÷ 0.5) = √144 = 12 ms⁻¹" },
      { id: "Ek-m3", stem: "A 2 500 kg van moves at 20 ms⁻¹. Calculate its kinetic energy.", equation: "Ek = ½mv²", correctAnswer: "500 000 J", markScheme: "Ek = ½ × 2 500 × 400 = 500 000 J" },
    ],
    hard: [
      { id: "Ek-h1", stem: "A 1.2 t car travels at 72 km/h. Calculate its kinetic energy.", equation: "Ek = ½mv²", correctAnswer: "240 000 J", markScheme: "m = 1 200 kg;  v = 72 km/h = 20 ms⁻¹;  Ek = ½ × 1 200 × 400 = 240 000 J" },
      { id: "Ek-h2", stem: "A 500 g ball has kinetic energy of 90 J. Calculate its speed.", equation: "Ek = ½mv²  →  v = √(2Ek ÷ m)", correctAnswer: "19.0 ms⁻¹", markScheme: "m = 0.500 kg;  v = √(2×90 ÷ 0.500) = √360 ≈ 19.0 ms⁻¹" },
    ],
  },

  // ── Ep = mgh ───────────────────────────────────────────────────────────────
  "Ep": {
    easy: [
      { id: "Ep-e1", stem: "A 3 kg ball is raised 5 m above the ground. (g = 10 Nkg⁻¹) Calculate the gravitational PE.", equation: "Ep = mgh", options: ["0.06 J", "150 J", "8 J", "53 J"], correctOption: 1, markScheme: "Ep = m × g × h = 3 × 10 × 5 = 150 J" },
      { id: "Ep-e2", stem: "An object has GPE of 200 J when raised 4 m. (g = 10 Nkg⁻¹) Calculate the mass.", equation: "Ep = mgh  →  m = Ep ÷ (gh)", options: ["800 kg", "5 kg", "0.2 kg", "40 kg"], correctOption: 1, markScheme: "m = 200 ÷ (10 × 4) = 200 ÷ 40 = 5 kg" },
      { id: "Ep-e3", stem: "A 2 kg object has 40 J of GPE. (g = 10 Nkg⁻¹) Calculate the height above the ground.", equation: "Ep = mgh  →  h = Ep ÷ (mg)", options: ["800 m", "2 m", "0.5 m", "200 m"], correctOption: 1, markScheme: "h = 40 ÷ (2 × 10) = 40 ÷ 20 = 2 m" },
    ],
    medium: [
      { id: "Ep-m1", stem: "A 70 kg person climbs to a height of 15 m. (g = 9.8 Nkg⁻¹) Calculate the gain in GPE.", equation: "Ep = mgh", correctAnswer: "10 290 J", markScheme: "Ep = 70 × 9.8 × 15 = 10 290 J" },
      { id: "Ep-m2", stem: "A ball of mass 0.50 kg is dropped from a height of 20 m. (g = 9.8 Nkg⁻¹) Calculate the GPE at the start.", equation: "Ep = mgh", correctAnswer: "98 J", markScheme: "Ep = 0.50 × 9.8 × 20 = 98 J" },
      { id: "Ep-m3", stem: "An object has GPE of 588 J at a height of 3.0 m. (g = 9.8 Nkg⁻¹) Calculate the mass.", equation: "Ep = mgh  →  m = Ep ÷ (gh)", correctAnswer: "20 kg", markScheme: "m = 588 ÷ (9.8 × 3) = 588 ÷ 29.4 = 20 kg" },
    ],
    hard: [
      { id: "Ep-h1", stem: "A 750 g ball is raised to a height of 1.2 m. (g = 9.8 Nkg⁻¹) Calculate its GPE.", equation: "Ep = mgh", correctAnswer: "8.82 J", markScheme: "m = 0.750 kg;  Ep = 0.750 × 9.8 × 1.2 = 8.82 J" },
      { id: "Ep-h2", stem: "A 2.5 kJ of GPE is stored in a 50 kg object on a planet with g = 5.0 Nkg⁻¹. Calculate the height.", equation: "Ep = mgh  →  h = Ep ÷ (mg)", correctAnswer: "10 m", markScheme: "Ep = 2 500 J;  h = 2 500 ÷ (50 × 5.0) = 2 500 ÷ 250 = 10 m" },
    ],
  },

  // ── v = u + at ─────────────────────────────────────────────────────────────
  "v-uat": {
    easy: [
      { id: "vuat-e1", stem: "A car starts from rest (u = 0) and accelerates at 3 ms⁻² for 5 s. Calculate its final velocity.", equation: "v = u + at", options: ["2 ms⁻¹", "8 ms⁻¹", "15 ms⁻¹", "35 ms⁻¹"], correctOption: 2, markScheme: "v = 0 + 3 × 5 = 15 ms⁻¹" },
      { id: "vuat-e2", stem: "An object decelerates from 20 ms⁻¹ at −4 ms⁻² for 3 s. Calculate its final velocity.", equation: "v = u + at", options: ["8 ms⁻¹", "32 ms⁻¹", "17 ms⁻¹", "−12 ms⁻¹"], correctOption: 0, markScheme: "v = 20 + (−4) × 3 = 20 − 12 = 8 ms⁻¹" },
      { id: "vuat-e3", stem: "An object accelerates from 5 ms⁻¹ to 25 ms⁻¹ in 4 s. Calculate the acceleration.", equation: "v = u + at  →  a = (v − u) ÷ t", options: ["0.2 ms⁻²", "5 ms⁻²", "7.5 ms⁻²", "30 ms⁻²"], correctOption: 1, markScheme: "a = (25 − 5) ÷ 4 = 20 ÷ 4 = 5 ms⁻²" },
    ],
    medium: [
      { id: "vuat-m1", stem: "A train starts from rest and accelerates at 0.8 ms⁻² for 30 s. Calculate its final speed.", equation: "v = u + at", correctAnswer: "24 ms⁻¹", markScheme: "v = 0 + 0.8 × 30 = 24 ms⁻¹" },
      { id: "vuat-m2", stem: "A ball is thrown upwards at 15 ms⁻¹. (g = −9.8 ms⁻²) Calculate the velocity after 1.5 s.", equation: "v = u + at", correctAnswer: "0.3 ms⁻¹", markScheme: "v = 15 + (−9.8) × 1.5 = 15 − 14.7 = 0.3 ms⁻¹" },
      { id: "vuat-m3", stem: "A car slows from 30 ms⁻¹ to 10 ms⁻¹ in 5.0 s. Calculate the deceleration.", equation: "v = u + at  →  a = (v − u) ÷ t", correctAnswer: "−4.0 ms⁻²", markScheme: "a = (10 − 30) ÷ 5 = −20 ÷ 5 = −4.0 ms⁻²" },
    ],
    hard: [
      { id: "vuat-h1", stem: "A car accelerates from 18 km/h to 90 km/h in 8.0 s. Calculate the acceleration.", equation: "v = u + at  →  a = (v − u) ÷ t", correctAnswer: "2.5 ms⁻²", markScheme: "u = 18 km/h = 5 ms⁻¹;  v = 90 km/h = 25 ms⁻¹;  a = (25 − 5) ÷ 8 = 2.5 ms⁻²" },
      { id: "vuat-h2", stem: "A ball is dropped from rest near Earth (g = 9.8 ms⁻²). Calculate its speed after falling for 2.5 s.", equation: "v = u + at", correctAnswer: "24.5 ms⁻¹", markScheme: "v = 0 + 9.8 × 2.5 = 24.5 ms⁻¹" },
    ],
  },

  // ── T = 1/f ────────────────────────────────────────────────────────────────
  "T-1f": {
    easy: [
      { id: "T1f-e1", stem: "A wave has frequency 5 Hz. Calculate its period.", equation: "T = 1/f", options: ["5 s", "0.2 s", "0.5 s", "25 s"], correctOption: 1, markScheme: "T = 1 ÷ 5 = 0.2 s" },
      { id: "T1f-e2", stem: "A wave has period 0.25 s. Calculate its frequency.", equation: "T = 1/f  →  f = 1 ÷ T", options: ["4 Hz", "0.25 Hz", "25 Hz", "0.04 Hz"], correctOption: 0, markScheme: "f = 1 ÷ 0.25 = 4 Hz" },
      { id: "T1f-e3", stem: "A wave has frequency 20 Hz. Calculate its period.", equation: "T = 1/f", options: ["20 s", "0.05 s", "0.5 s", "200 s"], correctOption: 1, markScheme: "T = 1 ÷ 20 = 0.05 s" },
      { id: "T1f-e4", stem: "A pendulum has period 2 s. Calculate its frequency.", equation: "T = 1/f  →  f = 1 ÷ T", options: ["0.5 Hz", "2 Hz", "4 Hz", "0.25 Hz"], correctOption: 0, markScheme: "f = 1 ÷ 2 = 0.5 Hz" },
    ],
    medium: [
      { id: "T1f-m1", stem: "A wave has frequency 250 Hz. Calculate its period.", equation: "T = 1/f", correctAnswer: "0.004 s", markScheme: "T = 1 ÷ 250 = 0.004 s (4 ms)" },
      { id: "T1f-m2", stem: "A sound wave has period 0.0025 s. Calculate its frequency.", equation: "T = 1/f  →  f = 1 ÷ T", correctAnswer: "400 Hz", markScheme: "f = 1 ÷ 0.0025 = 400 Hz" },
      { id: "T1f-m3", stem: "A light wave has frequency 6.0 × 10¹⁴ Hz. Calculate its period.", equation: "T = 1/f", correctAnswer: "1.67 × 10⁻¹⁵ s", markScheme: "T = 1 ÷ 6.0×10¹⁴ = 1.67×10⁻¹⁵ s" },
    ],
    hard: [
      { id: "T1f-h1", stem: "A wave has frequency 5.0 kHz. Calculate its period.", equation: "T = 1/f", correctAnswer: "0.20 ms", markScheme: "f = 5 000 Hz;  T = 1 ÷ 5 000 = 2.0×10⁻⁴ s = 0.20 ms" },
      { id: "T1f-h2", stem: "A microwave has period 1.25 ns. Calculate its frequency.", equation: "T = 1/f  →  f = 1 ÷ T", correctAnswer: "8.0 × 10⁸ Hz", markScheme: "T = 1.25×10⁻⁹ s;  f = 1 ÷ 1.25×10⁻⁹ = 8.0×10⁸ Hz (800 MHz)" },
    ],
  },

  // ── Eh = cmΔT ──────────────────────────────────────────────────────────────
  "Eh": {
    easy: [
      { id: "Eh-e1", stem: "Calculate the heat energy needed to raise 2 kg of water by 5 °C. (c = 4 200 Jkg⁻¹°C⁻¹)", equation: "Eh = cmΔT", options: ["42 000 J", "8 400 J", "2 100 J", "100 800 J"], correctOption: 0, markScheme: "Eh = 4 200 × 2 × 5 = 42 000 J" },
      { id: "Eh-e2", stem: "800 J of heat energy raises the temperature of 0.5 kg of a substance by 4 °C. Calculate the specific heat capacity.", equation: "Eh = cmΔT  →  c = Eh ÷ (mΔT)", options: ["400 Jkg⁻¹°C⁻¹", "1 600 Jkg⁻¹°C⁻¹", "6 400 Jkg⁻¹°C⁻¹", "100 Jkg⁻¹°C⁻¹"], correctOption: 0, markScheme: "c = 800 ÷ (0.5 × 4) = 800 ÷ 2 = 400 Jkg⁻¹°C⁻¹" },
      { id: "Eh-e3", stem: "5 040 J of energy heats 1.2 kg of water. (c = 4 200 Jkg⁻¹°C⁻¹) Calculate the temperature rise.", equation: "Eh = cmΔT  →  ΔT = Eh ÷ (cm)", options: ["1 °C", "25 200 °C", "4 °C", "10 °C"], correctOption: 0, markScheme: "ΔT = 5 040 ÷ (4 200 × 1.2) = 5 040 ÷ 5 040 = 1 °C" },
    ],
    medium: [
      { id: "Eh-m1", stem: "Calculate the heat energy needed to raise 3 kg of copper by 20 °C. (c = 385 Jkg⁻¹°C⁻¹)", equation: "Eh = cmΔT", correctAnswer: "23 100 J", markScheme: "Eh = 385 × 3 × 20 = 23 100 J" },
      { id: "Eh-m2", stem: "A 2 kg block of aluminium absorbs 90 000 J. (c = 900 Jkg⁻¹°C⁻¹) Calculate the temperature rise.", equation: "Eh = cmΔT  →  ΔT = Eh ÷ (cm)", correctAnswer: "50 °C", markScheme: "ΔT = 90 000 ÷ (900 × 2) = 90 000 ÷ 1 800 = 50 °C" },
      { id: "Eh-m3", stem: "A 500 g sample is heated by 4 200 J and its temperature rises by 10 °C. Calculate its specific heat capacity.", equation: "Eh = cmΔT  →  c = Eh ÷ (mΔT)", correctAnswer: "840 Jkg⁻¹°C⁻¹", markScheme: "m = 0.500 kg;  c = 4 200 ÷ (0.500 × 10) = 4 200 ÷ 5 = 840 Jkg⁻¹°C⁻¹" },
    ],
    hard: [
      { id: "Eh-h1", stem: "A 300 g iron block (c = 450 Jkg⁻¹°C⁻¹) is heated from 20 °C to 120 °C. Calculate the energy absorbed.", equation: "Eh = cmΔT", correctAnswer: "13 500 J", markScheme: "m = 0.300 kg;  ΔT = 100 °C;  Eh = 450 × 0.300 × 100 = 13 500 J" },
      { id: "Eh-h2", stem: "A 4 kJ heat source warms 250 g of a substance by 80 °C. Calculate its specific heat capacity.", equation: "Eh = cmΔT  →  c = Eh ÷ (mΔT)", correctAnswer: "200 Jkg⁻¹°C⁻¹", markScheme: "Eh = 4 000 J;  m = 0.250 kg;  c = 4 000 ÷ (0.250 × 80) = 4 000 ÷ 20 = 200 Jkg⁻¹°C⁻¹" },
    ],
  },

  // ── P = I²R ────────────────────────────────────────────────────────────────
  "P-I2R": {
    easy: [
      { id: "PI2R-e1", stem: "A current of 3 A flows through a 4 Ω resistor. Calculate the power dissipated.", equation: "P = I²R", options: ["12 W", "36 W", "0.75 W", "144 W"], correctOption: 1, markScheme: "P = 3² × 4 = 9 × 4 = 36 W" },
      { id: "PI2R-e2", stem: "A 50 W resistor carries a current of 5 A. Calculate the resistance.", equation: "P = I²R  →  R = P ÷ I²", options: ["10 Ω", "2 Ω", "250 Ω", "0.5 Ω"], correctOption: 1, markScheme: "R = P ÷ I² = 50 ÷ 25 = 2 Ω" },
      { id: "PI2R-e3", stem: "A 8 Ω resistor dissipates 72 W. Calculate the current through it.", equation: "P = I²R  →  I = √(P ÷ R)", options: ["576 A", "9 A", "3 A", "0.33 A"], correctOption: 2, markScheme: "I = √(P ÷ R) = √(72 ÷ 8) = √9 = 3 A" },
    ],
    medium: [
      { id: "PI2R-m1", stem: "A current of 2.5 A flows through a 10 Ω resistor. Calculate the power dissipated.", equation: "P = I²R", correctAnswer: "62.5 W", markScheme: "P = 2.5² × 10 = 6.25 × 10 = 62.5 W" },
      { id: "PI2R-m2", stem: "A resistor dissipates 180 W when a current of 6 A flows through it. Calculate the resistance.", equation: "P = I²R  →  R = P ÷ I²", correctAnswer: "5 Ω", markScheme: "R = 180 ÷ 36 = 5 Ω" },
      { id: "PI2R-m3", stem: "A 100 Ω resistor dissipates 400 W. Calculate the current.", equation: "P = I²R  →  I = √(P ÷ R)", correctAnswer: "2 A", markScheme: "I = √(400 ÷ 100) = √4 = 2 A" },
    ],
    hard: [
      { id: "PI2R-h1", stem: "A current of 50 mA flows through a 2.2 kΩ resistor. Calculate the power dissipated.", equation: "P = I²R", correctAnswer: "5.5 W", markScheme: "I = 0.050 A;  R = 2 200 Ω;  P = 0.050² × 2 200 = 0.0025 × 2 200 = 5.5 W" },
      { id: "PI2R-h2", stem: "A resistor dissipates 0.36 W when a current of 60 mA flows through it. Calculate the resistance.", equation: "P = I²R  →  R = P ÷ I²", correctAnswer: "100 Ω", markScheme: "I = 0.060 A;  R = 0.36 ÷ (0.060²) = 0.36 ÷ 0.0036 = 100 Ω" },
    ],
  },

  // ── P = V²/R ───────────────────────────────────────────────────────────────
  "P-V2R": {
    easy: [
      { id: "PV2R-e1", stem: "A 12 V voltage is applied across a 4 Ω resistor. Calculate the power.", equation: "P = V²/R", options: ["48 W", "36 W", "3 W", "6 W"], correctOption: 1, markScheme: "P = 12² ÷ 4 = 144 ÷ 4 = 36 W" },
      { id: "PV2R-e2", stem: "A 50 W device operates at 10 V. Calculate the resistance.", equation: "P = V²/R  →  R = V² ÷ P", options: ["500 Ω", "5 Ω", "2 Ω", "0.5 Ω"], correctOption: 2, markScheme: "R = 10² ÷ 50 = 100 ÷ 50 = 2 Ω" },
      { id: "PV2R-e3", stem: "A 25 Ω resistor dissipates 100 W. Calculate the voltage across it.", equation: "P = V²/R  →  V = √(PR)", options: ["4 V", "50 V", "2 500 V", "2 V"], correctOption: 1, markScheme: "V = √(100 × 25) = √2 500 = 50 V" },
    ],
    medium: [
      { id: "PV2R-m1", stem: "A 230 V appliance has a resistance of 52.9 Ω. Calculate the power. (give your answer to 3 sig. figs.)", equation: "P = V²/R", correctAnswer: "1 000 W", markScheme: "P = 230² ÷ 52.9 = 52 900 ÷ 52.9 = 1 000 W" },
      { id: "PV2R-m2", stem: "A 60 W bulb operates at 230 V. Calculate its resistance.", equation: "P = V²/R  →  R = V² ÷ P", correctAnswer: "882 Ω", markScheme: "R = 230² ÷ 60 = 52 900 ÷ 60 = 881.7... ≈ 882 Ω" },
      { id: "PV2R-m3", stem: "A 400 Ω resistor dissipates 25 W. Calculate the voltage across it.", equation: "P = V²/R  →  V = √(PR)", correctAnswer: "100 V", markScheme: "V = √(25 × 400) = √10 000 = 100 V" },
    ],
    hard: [
      { id: "PV2R-h1", stem: "A device connected to a 12 V supply dissipates 720 mW. Calculate its resistance.", equation: "P = V²/R  →  R = V² ÷ P", correctAnswer: "200 Ω", markScheme: "P = 0.720 W;  R = 12² ÷ 0.720 = 144 ÷ 0.720 = 200 Ω" },
      { id: "PV2R-h2", stem: "A 2.2 kΩ resistor dissipates 4.4 W. Calculate the voltage across it.", equation: "P = V²/R  →  V = √(PR)", correctAnswer: "98.5 V", markScheme: "R = 2 200 Ω;  V = √(4.4 × 2 200) = √9 680 ≈ 98.5 V" },
    ],
  },

  // ── E = hf (Higher) ────────────────────────────────────────────────────────
  "E-hf": {
    easy: [
      { id: "Ehf-e1", stem: "A photon has frequency 6.0 × 10¹⁴ Hz. (h = 6.63 × 10⁻³⁴ Js) Calculate the energy of the photon.", equation: "E = hf", options: ["3.98 × 10⁻¹⁹ J", "6.63 × 10⁻³⁴ J", "9.05 × 10⁻⁴⁸ J", "1.1 × 10¹⁵ J"], correctOption: 0, markScheme: "E = 6.63×10⁻³⁴ × 6.0×10¹⁴ = 3.98×10⁻¹⁹ J" },
      { id: "Ehf-e2", stem: "A photon has energy 2.0 × 10⁻¹⁹ J. (h = 6.63 × 10⁻³⁴ Js) Calculate its frequency.", equation: "E = hf  →  f = E ÷ h", options: ["3.0 × 10¹⁴ Hz", "1.33 × 10⁻⁵³ Hz", "6.63 × 10⁻³⁴ Hz", "3.0 × 10⁸ Hz"], correctOption: 0, markScheme: "f = 2.0×10⁻¹⁹ ÷ 6.63×10⁻³⁴ = 3.0×10¹⁴ Hz" },
    ],
    medium: [
      { id: "Ehf-m1", stem: "A UV photon has frequency 8.5 × 10¹⁵ Hz. (h = 6.63 × 10⁻³⁴ Js) Calculate the energy.", equation: "E = hf", correctAnswer: "5.64 × 10⁻¹⁸ J", markScheme: "E = 6.63×10⁻³⁴ × 8.5×10¹⁵ = 5.64×10⁻¹⁸ J" },
      { id: "Ehf-m2", stem: "A photon carries energy 3.3 × 10⁻¹⁹ J. (h = 6.63 × 10⁻³⁴ Js) Calculate the frequency.", equation: "E = hf  →  f = E ÷ h", correctAnswer: "4.98 × 10¹⁴ Hz", markScheme: "f = 3.3×10⁻¹⁹ ÷ 6.63×10⁻³⁴ = 4.98×10¹⁴ Hz" },
    ],
    hard: [
      { id: "Ehf-h1", stem: "A photon has wavelength 450 nm. (h = 6.63 × 10⁻³⁴ Js, c = 3.0 × 10⁸ ms⁻¹) Calculate the photon energy.", equation: "f = v ÷ λ;  E = hf", correctAnswer: "4.42 × 10⁻¹⁹ J", markScheme: "λ = 450×10⁻⁹ m;  f = 3.0×10⁸ ÷ 450×10⁻⁹ = 6.67×10¹⁴ Hz;  E = 6.63×10⁻³⁴ × 6.67×10¹⁴ = 4.42×10⁻¹⁹ J" },
      { id: "Ehf-h2", stem: "A 3.0 eV photon strikes a surface. (1 eV = 1.6 × 10⁻¹⁹ J, h = 6.63 × 10⁻³⁴ Js) Calculate the frequency.", equation: "E = hf  →  f = E ÷ h", correctAnswer: "7.24 × 10¹⁴ Hz", markScheme: "E = 3.0 × 1.6×10⁻¹⁹ = 4.8×10⁻¹⁹ J;  f = 4.8×10⁻¹⁹ ÷ 6.63×10⁻³⁴ = 7.24×10¹⁴ Hz" },
    ],
  },

  // ── E = QV (Higher) ────────────────────────────────────────────────────────
  "E-QV": {
    easy: [
      { id: "EQV-e1", stem: "A charge of 5 C is accelerated through a potential difference of 12 V. Calculate the energy gained.", equation: "E = QV", options: ["2.4 J", "17 J", "60 J", "7 J"], correctOption: 2, markScheme: "E = Q × V = 5 × 12 = 60 J" },
      { id: "EQV-e2", stem: "An electron (Q = 1.6 × 10⁻¹⁹ C) gains 3.2 × 10⁻¹⁸ J of energy. Calculate the potential difference.", equation: "E = QV  →  V = E ÷ Q", options: ["5.12 × 10⁻³⁷ V", "20 V", "3.2 × 10⁻¹⁸ V", "2 × 10⁰ V"], correctOption: 1, markScheme: "V = 3.2×10⁻¹⁸ ÷ 1.6×10⁻¹⁹ = 20 V" },
    ],
    medium: [
      { id: "EQV-m1", stem: "A proton (Q = 1.6 × 10⁻¹⁹ C) is accelerated through 500 V. Calculate the energy gained.", equation: "E = QV", correctAnswer: "8.0 × 10⁻¹⁷ J", markScheme: "E = 1.6×10⁻¹⁹ × 500 = 8.0×10⁻¹⁷ J" },
      { id: "EQV-m2", stem: "A charge of 0.02 C is accelerated through 60 V. Calculate the kinetic energy gained.", equation: "E = QV", correctAnswer: "1.2 J", markScheme: "E = 0.02 × 60 = 1.2 J" },
    ],
    hard: [
      { id: "EQV-h1", stem: "An alpha particle (Q = 3.2 × 10⁻¹⁹ C) is accelerated through 2 500 V. Calculate the energy gained in eV. (1 eV = 1.6 × 10⁻¹⁹ J)", equation: "E = QV", correctAnswer: "5 000 eV", markScheme: "E = 3.2×10⁻¹⁹ × 2 500 = 8.0×10⁻¹⁶ J;  E(eV) = 8.0×10⁻¹⁶ ÷ 1.6×10⁻¹⁹ = 5 000 eV" },
      { id: "EQV-h2", stem: "An electron gains 10 keV of energy. (1 eV = 1.6 × 10⁻¹⁹ J, Q = 1.6 × 10⁻¹⁹ C) Calculate the accelerating voltage.", equation: "E = QV  →  V = E ÷ Q", correctAnswer: "10 000 V", markScheme: "E = 10 000 × 1.6×10⁻¹⁹ = 1.6×10⁻¹⁵ J;  V = 1.6×10⁻¹⁵ ÷ 1.6×10⁻¹⁹ = 10 000 V (10 kV)" },
    ],
  },

  // ── F = kx (Higher) ────────────────────────────────────────────────────────
  "F-kx": {
    easy: [
      { id: "Fkx-e1", stem: "A spring with spring constant k = 50 Nm⁻¹ is stretched by 0.2 m. Calculate the force.", equation: "F = kx", options: ["0.004 N", "10 N", "50.2 N", "250 N"], correctOption: 1, markScheme: "F = k × x = 50 × 0.2 = 10 N" },
      { id: "Fkx-e2", stem: "A 20 N force stretches a spring by 0.4 m. Calculate the spring constant.", equation: "F = kx  →  k = F ÷ x", options: ["8 Nm⁻¹", "50 Nm⁻¹", "0.02 Nm⁻¹", "8 Nm⁻¹"], correctOption: 1, markScheme: "k = F ÷ x = 20 ÷ 0.4 = 50 Nm⁻¹" },
      { id: "Fkx-e3", stem: "A spring with k = 100 Nm⁻¹ is compressed by a 15 N force. Calculate the compression.", equation: "F = kx  →  x = F ÷ k", options: ["1 500 m", "85 m", "0.15 m", "6.67 m"], correctOption: 2, markScheme: "x = F ÷ k = 15 ÷ 100 = 0.15 m" },
    ],
    medium: [
      { id: "Fkx-m1", stem: "A spring (k = 200 Nm⁻¹) is stretched by 0.35 m. Calculate the restoring force.", equation: "F = kx", correctAnswer: "70 N", markScheme: "F = 200 × 0.35 = 70 N" },
      { id: "Fkx-m2", stem: "A 450 N force stretches a spring by 9.0 cm. Calculate the spring constant.", equation: "F = kx  →  k = F ÷ x", correctAnswer: "5 000 Nm⁻¹", markScheme: "x = 9.0 cm = 0.090 m;  k = 450 ÷ 0.090 = 5 000 Nm⁻¹" },
    ],
    hard: [
      { id: "Fkx-h1", stem: "A spring (k = 2.5 kNm⁻¹) is compressed by 40 mm. Calculate the force.", equation: "F = kx", correctAnswer: "100 N", markScheme: "k = 2 500 Nm⁻¹;  x = 0.040 m;  F = 2 500 × 0.040 = 100 N" },
      { id: "Fkx-h2", stem: "A 250 g mass hangs from a spring and stretches it by 5.0 cm. (g = 9.8 Nkg⁻¹) Calculate k.", equation: "F = kx  →  k = F ÷ x", correctAnswer: "49 Nm⁻¹", markScheme: "F = W = 0.250 × 9.8 = 2.45 N;  x = 0.050 m;  k = 2.45 ÷ 0.050 = 49 Nm⁻¹" },
    ],
  },

  // ── I = P/A (Irradiance, Higher) ───────────────────────────────────────────
  "irradiance": {
    easy: [
      { id: "irr-e1", stem: "A light source radiates 60 W uniformly through an area of 3 m². Calculate the irradiance.", equation: "I = P/A", options: ["0.05 Wm⁻²", "20 Wm⁻²", "180 Wm⁻²", "57 Wm⁻²"], correctOption: 1, markScheme: "I = P ÷ A = 60 ÷ 3 = 20 Wm⁻²" },
      { id: "irr-e2", stem: "Radiation of irradiance 50 Wm⁻² falls on a 0.5 m² detector. Calculate the power received.", equation: "I = P/A  →  P = IA", options: ["100 W", "25 W", "50.5 W", "0.01 W"], correctOption: 1, markScheme: "P = I × A = 50 × 0.5 = 25 W" },
    ],
    medium: [
      { id: "irr-m1", stem: "A 100 W source radiates uniformly over a sphere of radius 2 m. Calculate the irradiance at that distance.", equation: "I = P/A;  A = 4πr²", correctAnswer: "1.99 Wm⁻²", markScheme: "A = 4π × 2² = 50.27 m²;  I = 100 ÷ 50.27 = 1.99 Wm⁻²" },
      { id: "irr-m2", stem: "Radiation of irradiance 200 Wm⁻² falls on a 20 cm × 15 cm solar panel. Calculate the power incident on the panel.", equation: "I = P/A  →  P = IA", correctAnswer: "6 W", markScheme: "A = 0.20 × 0.15 = 0.030 m²;  P = 200 × 0.030 = 6 W" },
    ],
    hard: [
      { id: "irr-h1", stem: "A point source emits 240 W. Calculate the irradiance at a distance of 4.0 m from the source.", equation: "I = P / (4πr²)", correctAnswer: "1.19 Wm⁻²", markScheme: "A = 4π × 4² = 201.1 m²;  I = 240 ÷ 201.1 ≈ 1.19 Wm⁻²" },
      { id: "irr-h2", stem: "The irradiance from a source is 80 Wm⁻² at 3.0 m. Calculate the irradiance at 6.0 m.", equation: "I ∝ 1/d²", correctAnswer: "20 Wm⁻²", markScheme: "Distance doubles → irradiance ÷ 4;  I = 80 ÷ 4 = 20 Wm⁻²" },
    ],
  },

  // ── E = mc² (Higher) ───────────────────────────────────────────────────────
  "mass-energy": {
    easy: [
      { id: "Emc2-e1", stem: "Calculate the energy released when a mass of 1.0 × 10⁻³⁰ kg is converted to energy. (c = 3.0 × 10⁸ ms⁻¹)", equation: "E = mc²", options: ["9.0 × 10⁻¹⁴ J", "3.0 × 10⁻²² J", "1.0 × 10⁻³⁰ J", "6.0 × 10⁻²³ J"], correctOption: 0, markScheme: "E = 1.0×10⁻³⁰ × (3.0×10⁸)² = 1.0×10⁻³⁰ × 9.0×10¹⁶ = 9.0×10⁻¹⁴ J" },
      { id: "Emc2-e2", stem: "A nuclear reaction releases 4.5 × 10¹³ J of energy. (c = 3.0 × 10⁸ ms⁻¹) Calculate the mass converted.", equation: "E = mc²  →  m = E ÷ c²", options: ["5.0 × 10⁻⁴ kg", "1.5 × 10²² kg", "1.35 × 10²² kg", "4.5 × 10¹³ kg"], correctOption: 0, markScheme: "m = 4.5×10¹³ ÷ (3.0×10⁸)² = 4.5×10¹³ ÷ 9.0×10¹⁶ = 5.0×10⁻⁴ kg" },
    ],
    medium: [
      { id: "Emc2-m1", stem: "The Sun converts 4.0 × 10⁹ kg of mass to energy each second. (c = 3.0 × 10⁸ ms⁻¹) Calculate the power output.", equation: "E = mc²", correctAnswer: "3.6 × 10²⁶ W", markScheme: "E = 4.0×10⁹ × (3.0×10⁸)² = 4.0×10⁹ × 9.0×10¹⁶ = 3.6×10²⁶ J;  P = 3.6×10²⁶ W (per second)" },
      { id: "Emc2-m2", stem: "A fission reaction releases 3.2 × 10⁻¹¹ J. (c = 3.0 × 10⁸ ms⁻¹) Calculate the mass converted.", equation: "E = mc²  →  m = E ÷ c²", correctAnswer: "3.6 × 10⁻²⁸ kg", markScheme: "m = 3.2×10⁻¹¹ ÷ 9.0×10¹⁶ = 3.6×10⁻²⁸ kg" },
    ],
    hard: [
      { id: "Emc2-h1", stem: "A reaction converts 2.0 μg of mass into energy. (c = 3.0 × 10⁸ ms⁻¹) Calculate the energy released in joules.", equation: "E = mc²", correctAnswer: "1.8 × 10⁸ J", markScheme: "m = 2.0 μg = 2.0×10⁻⁶ g = 2.0×10⁻⁹ kg;  E = 2.0×10⁻⁹ × 9.0×10¹⁶ = 1.8×10⁸ J" },
    ],
  },

  // ── Temperature conversion ─────────────────────────────────────────────────
  "temp-conv": {
    easy: [
      { id: "temp-e1", stem: "Convert 25 °C to kelvin.", equation: "T(K) = T(°C) + 273", options: ["248 K", "298 K", "25 K", "273 K"], correctOption: 1, markScheme: "T = 25 + 273 = 298 K" },
      { id: "temp-e2", stem: "Convert 300 K to degrees Celsius.", equation: "T(°C) = T(K) − 273", options: ["573 °C", "27 °C", "300 °C", "−273 °C"], correctOption: 1, markScheme: "T = 300 − 273 = 27 °C" },
      { id: "temp-e3", stem: "Convert −40 °C to kelvin.", equation: "T(K) = T(°C) + 273", options: ["233 K", "313 K", "−40 K", "40 K"], correctOption: 0, markScheme: "T = −40 + 273 = 233 K" },
    ],
    medium: [
      { id: "temp-m1", stem: "Convert 127 °C to kelvin.", equation: "T(K) = T(°C) + 273", correctAnswer: "400 K", markScheme: "T = 127 + 273 = 400 K" },
      { id: "temp-m2", stem: "Convert 350 K to degrees Celsius.", equation: "T(°C) = T(K) − 273", correctAnswer: "77 °C", markScheme: "T = 350 − 273 = 77 °C" },
      { id: "temp-m3", stem: "The temperature of a gas changes from 17 °C to 117 °C. Calculate the temperature change in kelvin.", equation: "T(K) = T(°C) + 273", correctAnswer: "100 K", markScheme: "T₁ = 290 K;  T₂ = 390 K;  ΔT = 100 K" },
    ],
    hard: [
      { id: "temp-h1", stem: "A gas has temperature −173 °C. Convert to kelvin.", equation: "T(K) = T(°C) + 273", correctAnswer: "100 K", markScheme: "T = −173 + 273 = 100 K" },
      { id: "temp-h2", stem: "The temperature of a gas is doubled from 150 K. Calculate the new temperature in °C.", equation: "T(°C) = T(K) − 273", correctAnswer: "27 °C", markScheme: "New T = 150 × 2 = 300 K;  T(°C) = 300 − 273 = 27 °C" },
    ],
  },
}

/**
 * Return questions for a given SQA equation at the requested difficulty.
 * Falls back to demo questions when a specific bank is not available.
 */
function getEquationQuestions(equationId: string, difficulty: "easy" | "medium" | "hard"): CalcQuestion[] {
  const bank = EQUATION_QUESTION_BANKS[equationId]
  if (bank) return bank[difficulty]
  // Fallback: use the legacy demo questions mapped to the closest difficulty
  if (difficulty === "easy")   return getDemoSingleEqQuestions(1)
  if (difficulty === "medium") return getDemoSingleEqQuestions(4)
  return getDemoSingleEqQuestions(7)
}

function CalculationsMode({
  selectedLevel,
  onBack,
  isDarkMode,
  currentUser,
}: {
  selectedLevel: string
  onBack: () => void
  isDarkMode: boolean
  currentUser?: UserAccount | null
}) {
  type CalcDifficulty = "easy" | "medium" | "hard"
  type CalcSubMode = CalcDifficulty | "exam-level" | "correct-me" | null
  type CalcPhase = "hub" | "equation-select" | "quiz" | "results"

  const currentUserId = currentUser?.id
  // Locking applies only to pupils who haven't opted out
  const lockingEnabled = currentUser?.accountType === "pupil" && !currentUser?.disableModeLocking

  const [phase, setPhase] = useState<CalcPhase>("hub")
  const [subMode, setSubMode] = useState<CalcSubMode>(null)
  const [selectedEquationId, setSelectedEquationId] = useState<string | null>(null)
  const [equationSqaTab, setEquationSqaTab] = useState<"N5" | "Higher" | "AH">("N5")
  const [questions, setQuestions] = useState<CalcQuestion[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [typedAnswers, setTypedAnswers] = useState<Record<number, string>>({})
  const [mcAnswers, setMcAnswers] = useState<Record<number, number>>({})
  const [stepTypedAnswers, setStepTypedAnswers] = useState<Record<string, string>>({})
  const [stepMcAnswers, setStepMcAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [hotspotChoice, setHotspotChoice] = useState<Record<number, number>>({})
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [isPreparingQuestions, setIsPreparingQuestions] = useState(false)
  const [calcProgress, setCalcProgress] = useState<CalcProgress>(() =>
    currentUserId ? loadUserCalcProgress(currentUserId, selectedLevel) : defaultCalcProgress()
  )

  const cardBase = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-xl"

  const startEquationQuiz = async (equationId: string, difficulty: CalcDifficulty) => {
    setSelectedEquationId(equationId)
    setSubMode(difficulty)
    setCurrentIdx(0)
    setTypedAnswers({})
    setMcAnswers({})
    setSubmitted(false)
    setHotspotChoice({})

    // Check for cached AI-generated questions first
    const cached = loadAICalcQuestions(equationId, difficulty)
    if (cached && cached.length > 0) {
      setQuestions(cached)
      setPhase("quiz")
      // Generate fresh batch in background for next session
      const eqInfo = SQA_EQUATIONS.find((e) => e.id === equationId)
      if (eqInfo) {
        generateAndCacheCalcQuestions(equationId, eqInfo.formula, eqInfo.description, difficulty).catch(() => {})
      }
      return
    }

    // No cache: show static questions immediately then generate in background
    setQuestions(getEquationQuestions(equationId, difficulty))
    setPhase("quiz")

    // Trigger AI generation in background (results cached for next session)
    const eqInfo = SQA_EQUATIONS.find((e) => e.id === equationId)
    if (eqInfo) {
      setIsPreparingQuestions(true)
      generateAndCacheCalcQuestions(equationId, eqInfo.formula, eqInfo.description, difficulty)
        .catch(() => {})
        .finally(() => setIsPreparingQuestions(false))
    }
  }

  const startExamLevel = () => {
    setSubMode("exam-level")
    setQuestions(CALC_EXAM_QUESTIONS)
    setCurrentIdx(0)
    setCurrentStepIdx(0)
    setStepTypedAnswers({})
    setStepMcAnswers({})
    setSubmitted(false)
    setPhase("quiz")
  }

  const startCorrectMe = () => {
    setSubMode("correct-me")
    setQuestions(CALC_CORRECT_ME_QUESTIONS)
    setCurrentIdx(0)
    setHotspotChoice({})
    setSubmitted(false)
    setPhase("quiz")
  }

  const currentQ = questions[currentIdx]

  // ── Hub ──────────────────────────────────────────────────────────────────
  if (phase === "hub") {
    const difficultyModes = [
      {
        id: "easy" as CalcDifficulty,
        icon: "⭐",
        title: "Easy",
        desc: "Basic calculations with MC Answers",
        color: "from-green-600 to-green-800",
        accent: "border-green-500",
      },
      {
        id: "medium" as CalcDifficulty,
        icon: "⭐⭐",
        title: "Medium",
        desc: "Typed answer calculations",
        color: "from-blue-600 to-blue-800",
        accent: "border-blue-500",
      },
      {
        id: "hard" as CalcDifficulty,
        icon: "⭐⭐⭐",
        title: "Hard",
        desc: "Exam Level Calculations",
        color: "from-[#800000] to-[#600000]",
        accent: "border-red-700",
      },
    ]
    const extraModes = [
      {
        id: "exam-level" as const,
        icon: "📋",
        title: "Exam Level Calculations",
        desc: "Multi-step problems that chain different equations together — just like SQA exam questions.",
        color: "from-purple-700 to-purple-900",
      },
      {
        id: "correct-me" as const,
        icon: "🔍",
        title: "Correct Me!",
        desc: "Spot and fix mistakes in worked calculations. Tap the hotspot to identify the error.",
        color: "from-amber-600 to-amber-800",
      },
    ]
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center p-6 animate-in fade-in slide-in-from-right-4">
        <div className="max-w-4xl w-full">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-[#800000] mb-8 font-bold uppercase text-xs tracking-widest"
          >
            <ChevronLeft className="w-4 h-4" />
            Mode Selection
          </button>
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-black mb-3">
              <span className="text-[#800000]">Calculations</span> Practice
            </h2>
            <p className={`text-lg ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Choose your practice type for{" "}
              <span className="text-amber-600 font-bold">{selectedLevel}</span>
            </p>
          </div>
          {/* Primary difficulty modes */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {difficultyModes.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setSubMode(m.id)
                  setEquationSqaTab("N5")
                  setPhase("equation-select")
                }}
                className={`group text-left rounded-3xl border-2 p-7 transition-all hover:scale-[1.02] hover:shadow-2xl ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 hover:border-slate-500"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-lg"
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center text-2xl mb-5 shadow-lg`}>
                  {m.icon}
                </div>
                <h3 className="text-xl font-black mb-2">{m.title}</h3>
                <p className={`text-sm leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{m.desc}</p>
              </button>
            ))}
          </div>
          {/* Secondary modes */}
          <div className="grid md:grid-cols-2 gap-4">
            {extraModes.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  if (m.id === "exam-level") startExamLevel()
                  else startCorrectMe()
                }}
                className={`group text-left rounded-2xl border-2 p-5 transition-all hover:scale-[1.01] hover:shadow-xl ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 hover:border-slate-500"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-md"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-xl shadow-md`}>
                    {m.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-black mb-1">{m.title}</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{m.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Equation Select ───────────────────────────────────────────────────────
  if (phase === "equation-select") {
    const difficulty = subMode as CalcDifficulty
    const diffLabel = difficulty === "easy" ? "Easy" : difficulty === "medium" ? "Medium" : "Hard"
    const diffColor = difficulty === "easy" ? "text-green-600" : difficulty === "medium" ? "text-blue-600" : "text-[#800000]"
    const tabs: ("N5" | "Higher" | "AH")[] = ["N5", "Higher", "AH"]
    const tabLabels: Record<string, string> = { N5: "National 5", Higher: "Higher", AH: "Advanced Higher" }
    // Determine which tabs are allowed based on the user's selected level
    const levelOrder: Record<string, number> = { "National 5": 0, "Higher": 1, "Advanced Higher": 2 }
    const sqaTabOrder: Record<string, number> = { "N5": 0, "Higher": 1, "AH": 2 }
    const userLevelIdx = levelOrder[selectedLevel] ?? 2
    const isTabLocked = (tab: "N5" | "Higher" | "AH") => sqaTabOrder[tab] > userLevelIdx
    const filteredEqs = SQA_EQUATIONS.filter((e) => e.sqaLevel === equationSqaTab)
    const topics = [...new Set(filteredEqs.map((e) => e.topic))]

    return (
      <div className="pt-24 min-h-screen p-6 animate-in fade-in slide-in-from-right-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setPhase("hub")}
            className="flex items-center gap-2 text-slate-500 hover:text-[#800000] mb-8 font-bold uppercase text-xs tracking-widest"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <div className="mb-8">
            <h2 className="text-3xl font-black mb-1">
              Select an Equation
              <span className={`ml-3 text-xl font-black ${diffColor}`}>— {diffLabel}</span>
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Based on the SQA Relationship Sheet. Choose which equation you want to practise.
              {lockingEnabled && difficulty !== "easy" && <span className="ml-1 font-semibold">🔒 Equations are unlocked by completing the previous difficulty first.</span>}
            </p>
          </div>
          {/* SQA level tabs */}
          <div className="flex gap-2 mb-6">
            {tabs.map((tab) => {
              const locked = isTabLocked(tab)
              return (
              <button
                key={tab}
                onClick={() => { if (!locked) setEquationSqaTab(tab) }}
                title={locked ? `Not available at ${selectedLevel}` : undefined}
                className={`px-4 py-2 rounded-xl font-black text-sm transition-all border-2 ${
                  locked
                    ? isDarkMode
                      ? "border-slate-700 text-slate-600 cursor-not-allowed opacity-40"
                      : "border-slate-200 text-slate-300 cursor-not-allowed opacity-40"
                    : equationSqaTab === tab
                      ? "bg-[#800000] text-white border-[#800000]"
                      : isDarkMode
                        ? "border-slate-600 text-slate-300 hover:border-slate-400"
                        : "border-slate-200 text-slate-600 hover:border-slate-400"
                }`}
              >
                {tabLabels[tab]}
                {locked && <span className="ml-1 text-[10px]">🔒</span>}
              </button>
              )
            })}
          </div>
          {/* Equations grouped by topic */}
          <div className="space-y-6 pb-8">
            {topics.map((topic) => (
              <div key={topic}>
                <h3 className={`text-xs font-black uppercase tracking-widest mb-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {topic}
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {filteredEqs
                    .filter((e) => e.topic === topic)
                    .map((eq) => {
                      const hasBank = Boolean(EQUATION_QUESTION_BANKS[eq.id])
                      // Lock logic applies only to pupils without disableModeLocking
                      const isEqLocked = lockingEnabled && (
                        difficulty === "medium"
                          ? !(calcProgress.easyMode[eq.id]?.total > 0)
                          : difficulty === "hard"
                            ? !(calcProgress.mediumMode[eq.id]?.total > 0)
                            : false
                      )
                      const lockReason =
                        difficulty === "medium"
                          ? "Complete Easy first"
                          : difficulty === "hard"
                            ? "Complete Medium first"
                            : ""
                      return (
                        <button
                          key={eq.id}
                          onClick={() => { if (!isEqLocked) startEquationQuiz(eq.id, difficulty) }}
                          disabled={isEqLocked}
                          title={isEqLocked ? lockReason : undefined}
                          className={`relative text-left p-4 rounded-2xl border-2 transition-all ${
                            isEqLocked
                              ? isDarkMode
                                ? "bg-slate-800 border-slate-700 opacity-40 cursor-not-allowed"
                                : "bg-white border-slate-200 opacity-40 cursor-not-allowed shadow-sm"
                              : isDarkMode
                                ? "bg-slate-800 border-slate-700 hover:border-amber-500 hover:scale-[1.01]"
                                : "bg-white border-slate-200 hover:border-[#800000] hover:scale-[1.01] shadow-sm"
                          }`}
                        >
                          {isEqLocked && <span className="absolute top-2 right-2 text-xs">🔒</span>}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className={`font-black font-mono text-base ${isDarkMode ? "text-amber-300" : "text-amber-700"}`}>
                                {eq.formula}
                              </p>
                              <p className={`text-xs mt-0.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                {eq.description}
                              </p>
                              {isEqLocked && (
                                <p className={`text-xs mt-1 font-bold ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                  {lockReason}
                                </p>
                              )}
                            </div>
                            {!hasBank && !isEqLocked && (
                              <span className={`text-xs shrink-0 px-2 py-0.5 rounded-full ${isDarkMode ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                                demo
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Quiz ─────────────────────────────────────────────────────────────────
  if (phase === "quiz" && currentQ) {
    const isExam = subMode === "exam-level"
    const isCorrectMe = subMode === "correct-me"
    const isDifficultyMode = subMode === "easy" || subMode === "medium" || subMode === "hard"

    // Easy = MC answers; Medium/Hard = typed
    const useMC = subMode === "easy"

    const steps = currentQ.steps ?? []
    const currentStep = isExam && steps.length > 0 ? steps[currentStepIdx] : null

    const hasAnswered = isCorrectMe
      ? hotspotChoice[currentIdx] !== undefined
      : isExam && currentStep
        ? (stepTypedAnswers[currentStep.id] ?? "").trim().length > 0
        : useMC
          ? mcAnswers[currentIdx] !== undefined
          : (typedAnswers[currentIdx] ?? "").trim().length > 0

    const isLastStep = isExam ? currentStepIdx >= steps.length - 1 : true
    const isLastQ = currentIdx >= questions.length - 1

    const handleNext = () => {
      if (isExam && !isLastStep) {
        setCurrentStepIdx((s) => s + 1)
      } else if (isLastQ) {
        if (currentUserId) {
          const existing = loadUserCalcProgress(currentUserId, selectedLevel)
          if (isDifficultyMode && selectedEquationId) {
            const modeKey = subMode === "easy" ? "easyMode" : subMode === "medium" ? "mediumMode" : "hardMode"
            let correct = 0
            if (subMode === "easy") {
              questions.forEach((q, i) => {
                if (q.options && q.correctOption !== undefined && mcAnswers[i] === q.correctOption) correct++
              })
            }
            const prev = existing[modeKey][selectedEquationId] ?? { correct: 0, total: 0 }
            existing[modeKey][selectedEquationId] = { correct: prev.correct + correct, total: prev.total + questions.length }
          } else if (subMode === "exam-level") {
            existing.examLevel = { correct: existing.examLevel.correct, total: existing.examLevel.total + 1 }
          } else if (subMode === "correct-me") {
            const correct = questions.filter((q, i) => hotspotChoice[i] === q.mistakeOptionIndex).length
            existing.correctMe = { correct: existing.correctMe.correct + correct, total: existing.correctMe.total + questions.length }
          }
          saveUserCalcProgress(currentUserId, selectedLevel, existing)
          setCalcProgress(existing)
        }
        setPhase("results")
      } else {
        setCurrentIdx((i) => i + 1)
        setCurrentStepIdx(0)
        setSubmitted(false)
      }
    }

    const activeQ = currentStep ?? currentQ
    const eqInfo = selectedEquationId ? SQA_EQUATIONS.find((e) => e.id === selectedEquationId) : null

    return (
      <div className="pt-24 min-h-screen p-6 animate-in fade-in">
        <div className="max-w-2xl mx-auto">
          {/* Progress bar */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                setPhase(isDifficultyMode ? "equation-select" : "hub")
                setSubmitted(false)
              }}
              className="flex items-center gap-1 text-slate-500 hover:text-[#800000] font-bold uppercase text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              {isDifficultyMode ? "Equations" : "Hub"}
            </button>
            <span className={`text-sm font-bold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Q{currentIdx + 1}/{questions.length}
              {isExam && steps.length > 0 && ` • Step ${currentStepIdx + 1}/${steps.length}`}
            </span>
          </div>
          <div className={`w-full h-1.5 rounded-full mb-6 ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>
            <div
              className="h-1.5 rounded-full bg-[#800000] transition-all"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className={`rounded-3xl border-2 p-7 mb-4 ${cardBase}`}>
            {/* Badge row */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {isDifficultyMode && (
                <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                  subMode === "easy"
                    ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                    : subMode === "medium"
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                      : "bg-red-100 dark:bg-red-900/40 text-[#800000] dark:text-red-300"
                }`}>
                  {subMode === "easy" ? "Easy" : subMode === "medium" ? "Medium" : "Hard"}
                </span>
              )}
              {isDifficultyMode && eqInfo && (
                <span className={`text-xs font-black font-mono px-3 py-1 rounded-full ${isDarkMode ? "bg-slate-700 text-amber-300" : "bg-amber-50 text-amber-700"}`}>
                  {eqInfo.formula}
                </span>
              )}
              {isExam && (
                <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                  Exam Level
                </span>
              )}
              {isCorrectMe && (
                <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                  Correct Me!
                </span>
              )}
            </div>

            {/* Stem */}
            {isExam && currentStep ? (
              <>
                <p className={`text-base mb-3 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>{currentQ.stem}</p>
                <p className="text-lg font-bold mb-3">{currentStep.stem}</p>
                {currentStep.equation && (
                  <div className={`inline-block mb-4 px-4 py-2 rounded-xl text-sm font-mono font-bold ${isDarkMode ? "bg-slate-700 text-amber-300" : "bg-amber-50 text-amber-800 border border-amber-200"}`}>
                    {currentStep.equation}
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="text-lg font-bold mb-3">{currentQ.stem}</p>
                {currentQ.equation && (
                  <div className={`inline-block mb-4 px-4 py-2 rounded-xl text-sm font-mono font-bold ${isDarkMode ? "bg-slate-700 text-amber-300" : "bg-amber-50 text-amber-800 border border-amber-200"}`}>
                    {currentQ.equation}
                  </div>
                )}
              </>
            )}

            {/* Answer input */}
            {isCorrectMe && currentQ.workingLines ? (
              <div className="mt-5">
                <p className={`text-sm font-black uppercase tracking-wide mb-3 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  🔍 Tap the line that contains the mistake:
                </p>
                <div className={`rounded-2xl border-2 overflow-hidden ${isDarkMode ? "border-slate-600" : "border-slate-200"}`}>
                  {currentQ.workingLines.map((line, li) => {
                    const chosen = hotspotChoice[currentIdx] === li
                    const showResult = submitted
                    const isMistakeLine = li === currentQ.mistakeOptionIndex
                    let rowCls = `w-full text-left px-5 py-3 font-mono text-base flex items-center gap-3 transition-all border-b last:border-b-0 `
                    if (showResult) {
                      if (isMistakeLine) {
                        rowCls += isDarkMode
                          ? "border-red-700 bg-red-900/30 text-red-300"
                          : "border-red-300 bg-red-50 text-red-800"
                      } else {
                        rowCls += isDarkMode
                          ? "border-slate-700 bg-slate-800/60 text-slate-400"
                          : "border-slate-200 bg-white text-slate-500"
                      }
                    } else {
                      if (chosen) {
                        rowCls += isDarkMode
                          ? "border-amber-600 bg-amber-900/30 text-amber-200"
                          : "border-amber-300 bg-amber-50 text-amber-900"
                      } else {
                        rowCls += isDarkMode
                          ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-amber-300"
                          : "border-slate-200 bg-white text-slate-800 hover:bg-amber-50 hover:text-[#800000]"
                      }
                    }
                    return (
                      <button
                        key={li}
                        disabled={submitted}
                        onClick={() => setHotspotChoice((p) => ({ ...p, [currentIdx]: li }))}
                        className={rowCls}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                          showResult && isMistakeLine
                            ? "bg-red-500 text-white"
                            : showResult
                              ? isDarkMode ? "bg-slate-700 text-slate-400" : "bg-slate-200 text-slate-500"
                              : chosen
                                ? "bg-amber-500 text-white"
                                : isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-500"
                        }`}>
                          {li + 1}
                        </span>
                        <span>{line}</span>
                        {showResult && isMistakeLine && (
                          <span className="ml-auto text-xs font-black text-red-500 shrink-0">← mistake here</span>
                        )}
                        {showResult && !isMistakeLine && (
                          <span className={`ml-auto text-xs font-bold shrink-0 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>✓</span>
                        )}
                      </button>
                    )
                  })}
                </div>
                {submitted && hotspotChoice[currentIdx] !== undefined && hotspotChoice[currentIdx] !== currentQ.mistakeOptionIndex && (
                  <p className={`mt-2 text-sm font-bold ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                    ✗ Incorrect — the mistake was on line {(currentQ.mistakeOptionIndex ?? 0) + 1}.
                  </p>
                )}
                {submitted && hotspotChoice[currentIdx] === currentQ.mistakeOptionIndex && (
                  <p className={`mt-2 text-sm font-bold ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                    ✓ Correct — you spotted the mistake!
                  </p>
                )}
              </div>
            ) : useMC && currentQ.options ? (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {currentQ.options.map((opt, oi) => {
                  const chosen = mcAnswers[currentIdx] === oi
                  const showResult = submitted
                  const isCorrectChoice = oi === currentQ.correctOption
                  let cls = `px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all `
                  if (showResult) {
                    if (isCorrectChoice) cls += "border-green-500 bg-green-50 dark:bg-green-900/20"
                    else if (chosen) cls += "border-red-500 bg-red-50 dark:bg-red-900/20"
                    else cls += isDarkMode ? "border-slate-700 opacity-50" : "border-slate-200 opacity-50"
                  } else {
                    cls += chosen
                      ? "border-[#800000] bg-red-50 dark:bg-red-900/20"
                      : isDarkMode
                        ? "border-slate-700 hover:border-amber-500"
                        : "border-slate-200 hover:border-[#800000]"
                  }
                  return (
                    <button key={oi} disabled={submitted} onClick={() => setMcAnswers((p) => ({ ...p, [currentIdx]: oi }))} className={cls}>
                      {opt}
                    </button>
                  )
                })}
              </div>
            ) : isExam && currentStep ? (
              <div className="mt-4">
                <label className={`block text-sm font-black mb-2 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Your Answer:</label>
                <input
                  type="text"
                  disabled={submitted}
                  value={stepTypedAnswers[currentStep.id] ?? ""}
                  onChange={(e) => setStepTypedAnswers((p) => ({ ...p, [currentStep.id]: e.target.value }))}
                  placeholder="e.g. 4 ms⁻²"
                  className={`w-full px-4 py-3 rounded-xl border-2 font-mono text-base outline-none transition-all ${
                    submitted
                      ? isDarkMode ? "border-slate-600 bg-slate-700/50" : "border-slate-300 bg-slate-50"
                      : isDarkMode
                        ? "border-slate-600 bg-slate-700 hover:border-amber-500 focus:border-amber-400 text-white"
                        : "border-slate-300 bg-white hover:border-[#800000] focus:border-[#800000]"
                  }`}
                />
              </div>
            ) : (
              <div className="mt-4">
                <label className={`block text-sm font-black mb-2 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Your Answer:</label>
                <input
                  type="text"
                  disabled={submitted}
                  value={typedAnswers[currentIdx] ?? ""}
                  onChange={(e) => setTypedAnswers((p) => ({ ...p, [currentIdx]: e.target.value }))}
                  placeholder="e.g. 4 ms⁻²"
                  className={`w-full px-4 py-3 rounded-xl border-2 font-mono text-base outline-none transition-all ${
                    submitted
                      ? isDarkMode ? "border-slate-600 bg-slate-700/50" : "border-slate-300 bg-slate-50"
                      : isDarkMode
                        ? "border-slate-600 bg-slate-700 hover:border-amber-500 focus:border-amber-400 text-white"
                        : "border-slate-300 bg-white hover:border-[#800000] focus:border-[#800000]"
                  }`}
                />
              </div>
            )}

            {/* Mark scheme reveal */}
            {submitted && (
              <div className={`mt-5 p-4 rounded-xl border-2 ${isDarkMode ? "border-green-700 bg-green-900/20" : "border-green-400 bg-green-50"}`}>
                <p className={`text-xs font-black uppercase mb-1 ${isDarkMode ? "text-green-400" : "text-green-700"}`}>✅ Mark Scheme</p>
                <p className={`text-sm font-mono ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                  {isExam && currentStep ? currentStep.markScheme : currentQ.markScheme}
                </p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            {!submitted ? (
              <button
                disabled={!hasAnswered}
                onClick={() => setSubmitted(true)}
                className={`flex-1 py-3 rounded-2xl font-black border-2 transition-all ${
                  hasAnswered
                    ? "bg-[#800000] text-white border-[#800000] hover:bg-[#600000]"
                    : isDarkMode
                      ? "border-slate-700 text-slate-600 cursor-not-allowed"
                      : "border-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 py-3 rounded-2xl font-black bg-[#800000] text-white border-2 border-[#800000] hover:bg-[#600000] transition-all flex items-center justify-center gap-2"
              >
                {isLastQ && isLastStep ? "See Results" : isExam && !isLastStep ? "Next Step" : "Next Question"}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Results ───────────────────────────────────────────────────────────────
  if (phase === "results") {
    const totalQ = questions.length
    const isDifficultyMode = subMode === "easy" || subMode === "medium" || subMode === "hard"
    const eqInfo = selectedEquationId ? SQA_EQUATIONS.find((e) => e.id === selectedEquationId) : null
    return (
      <div className="pt-24 min-h-screen p-6 animate-in fade-in">
        <div className="max-w-2xl mx-auto text-center">
          <div className={`rounded-3xl border-2 p-10 mb-6 ${cardBase}`}>
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-black mb-3">Session Complete</h2>
            <p className={`text-lg mb-2 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              You worked through{" "}
              <span className="font-black text-2xl text-[#800000]">{totalQ}</span>{" "}
              question{totalQ !== 1 ? "s" : ""}.
            </p>
            {isDifficultyMode && eqInfo && (
              <p className={`text-sm mt-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Equation: <strong className="font-mono">{eqInfo.formula}</strong>
                {" · "}
                Difficulty: <strong className="capitalize">{subMode}</strong>
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setPhase("hub"); setSubmitted(false) }}
              className={`flex-1 py-3 rounded-xl font-black border-2 transition-colors ${isDarkMode ? "border-slate-600 hover:border-slate-400" : "border-slate-200 hover:border-slate-400"}`}
            >
              Hub
            </button>
            {isDifficultyMode && (
              <button
                onClick={() => setPhase("equation-select")}
                className={`flex-1 py-3 rounded-xl font-black border-2 transition-colors ${isDarkMode ? "border-slate-600 hover:border-slate-400" : "border-slate-200 hover:border-slate-400"}`}
              >
                Change Equation
              </button>
            )}
            <button
              onClick={() => {
                if (isDifficultyMode && selectedEquationId) startEquationQuiz(selectedEquationId, subMode as CalcDifficulty)
                else if (subMode === "exam-level") startExamLevel()
                else startCorrectMe()
              }}
              className="flex-1 py-3 rounded-xl font-black bg-[#800000] text-white hover:bg-[#600000] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

function AssignmentMode({
  selectedLevel,
  onBack,
  isDarkMode,
}: {
  selectedLevel: string
  onBack: () => void
  isDarkMode: boolean
}) {
  type AssignPhase = "hub" | "practice" | "mark" | "review" | "improve"

  const [phase, setPhase] = useState<AssignPhase>("hub")
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [markingNotes, setMarkingNotes] = useState<Record<number, string>>({})
  const [markScores, setMarkScores] = useState<Record<number, number>>({})
  const [reviewFilter, setReviewFilter] = useState<"all" | "strong" | "weak">("all")
  const [improveAnswers, setImproveAnswers] = useState<Record<number, number>>({})
  const [improveSubmitted, setImproveSubmitted] = useState(false)

  const cardBase = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-xl"
  const btnOutline = `rounded-xl font-black border-2 transition-all px-5 py-3`

  // Sample guided practice questions tailored to level
  const practiceQuestions = [
    {
      id: 0,
      topic: "Forces",
      guidance: "Think about Newton's Second Law: F = ma. Make sure your answer includes units.",
      question: `A 5 kg object accelerates at 3 ms⁻². Calculate the resultant force acting on it. Show all working.`,
      markScheme: "F = ma = 5 × 3 = 15 N",
      marks: 2,
    },
    {
      id: 1,
      topic: "Energy",
      guidance: "Use Ek = ½mv². Don't forget to square the velocity before multiplying.",
      question: `Calculate the kinetic energy of a 2 kg ball moving at 4 ms⁻¹.`,
      markScheme: "Ek = ½ × 2 × 4² = ½ × 2 × 16 = 16 J",
      marks: 2,
    },
    {
      id: 2,
      topic: "Waves",
      guidance: "Use the wave equation: v = fλ. Check that your units are consistent.",
      question: `A wave has a frequency of 200 Hz and a wavelength of 1.5 m. Calculate its speed.`,
      markScheme: "v = fλ = 200 × 1.5 = 300 ms⁻¹",
      marks: 2,
    },
  ]

  // Sample marking document with rubric
  const markingDocument = {
    title: "Assignment Task — Newton's Laws",
    description: "Read the pupil response below and award marks according to the rubric.",
    pupilResponse: `A car of mass 1200 kg accelerates from rest to 30 ms⁻¹ in 10 s.
(a) The student writes: "Using F=ma, a = 30/10 = 3 ms⁻². Therefore F = 1200 × 3 = 3600 N."
(b) The student writes: "The work done is W = F × d. I need to find distance first using v² = u² + 2as.  30² = 0 + 2 × 3 × s, so s = 900/6 = 150 m. W = 3600 × 150 = 540 000 J."`,
    rubric: [
      { id: 0, criterion: "(a) Correct acceleration calculation: a = Δv/t = 30/10 = 3 ms⁻²", maxMarks: 1 },
      { id: 1, criterion: "(a) Correct force: F = ma = 1200 × 3 = 3600 N with unit", maxMarks: 1 },
      { id: 2, criterion: "(b) Correct use of kinematic equation to find distance (s = 150 m)", maxMarks: 2 },
      { id: 3, criterion: "(b) Correct work done: W = 540 000 J (or 540 kJ)", maxMarks: 1 },
    ],
  }

  // Sample review data: previous performance on topics (score = percentage 0–100)
  const reviewData = [
    { topic: "Forces", score: 80, lastAttempted: "2 days ago", feedback: "Strong understanding of Newton's Laws. Revisit free-body diagrams." },
    { topic: "Energy", score: 60, lastAttempted: "4 days ago", feedback: "Good with kinetic energy but review potential energy and conservation." },
    { topic: "Waves", score: 40, lastAttempted: "1 week ago", feedback: "Struggling with wave equation applications. Practice more examples." },
    { topic: "Electricity", score: 20, lastAttempted: "1 week ago", feedback: "Significant gaps in Ohm's Law and circuit analysis. Prioritise this topic." },
  ]

  // Improve: targeted multiple-choice questions on weak areas
  const improveQuestions = [
    {
      id: 0,
      topic: "Waves",
      question: "A wave has a period of 0.02 s. What is its frequency?",
      options: ["0.02 Hz", "20 Hz", "50 Hz", "500 Hz"],
      answer: 2,
      explanation: "f = 1/T = 1/0.02 = 50 Hz",
    },
    {
      id: 1,
      topic: "Electricity",
      question: "A 12 V battery is connected to a 4 Ω resistor. What current flows?",
      options: ["0.33 A", "3 A", "48 A", "8 A"],
      answer: 1,
      explanation: "I = V/R = 12/4 = 3 A",
    },
    {
      id: 2,
      topic: "Waves",
      question: "Which property of a wave determines its pitch?",
      options: ["Amplitude", "Speed", "Frequency", "Wavelength only"],
      answer: 2,
      explanation: "Frequency determines pitch — higher frequency = higher pitch.",
    },
  ]

  const filteredReview = reviewData.filter((d) => {
    if (reviewFilter === "strong") return d.score >= 70
    if (reviewFilter === "weak") return d.score < 70
    return true
  })

  const perfColour = (pct: number) =>
    pct >= 70 ? "text-green-600" : pct >= 50 ? "text-amber-600" : "text-red-600"
  const perfBar = (pct: number) =>
    pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500"

  // ── Hub ──────────────────────────────────────────────────────────────────
  if (phase === "hub") {
    const subModes = [
      {
        id: "practice" as const,
        icon: "📝",
        title: "Practice",
        desc: "Guided questions tailored to your level with hints and worked examples to support your learning.",
        color: "from-blue-600 to-blue-800",
      },
      {
        id: "mark" as const,
        icon: "✅",
        title: "Mark",
        desc: "Mark pupil responses against a preset rubric to develop your understanding of the marking criteria.",
        color: "from-green-600 to-green-800",
      },
      {
        id: "review" as const,
        icon: "🔍",
        title: "Review",
        desc: "Review your previous performance across topics and see detailed feedback on your strengths and gaps.",
        color: "from-amber-600 to-amber-800",
      },
      {
        id: "improve" as const,
        icon: "🚀",
        title: "Improve",
        desc: "Targeted questions on your weakest topics to help you close gaps and boost your overall grade.",
        color: "from-[#800000] to-[#600000]",
      },
    ]

    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center p-6 animate-in fade-in slide-in-from-right-4">
        <div className="max-w-4xl w-full">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-[#800000] mb-8 font-bold uppercase text-xs tracking-widest"
          >
            <ChevronLeft className="w-4 h-4" />
            Mode Selection
          </button>
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-black mb-3">
              <span className="text-[#800000]">Assignment</span> Practice
            </h2>
            <p className={`text-lg ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Choose your activity for{" "}
              <span className="text-amber-600 font-bold">{selectedLevel}</span>
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {subModes.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setPhase(m.id)
                  setCurrentQuestionIdx(0)
                  setAnswers({})
                  setSubmitted(false)
                  setMarkingNotes({})
                  setMarkScores({})
                  setImproveAnswers({})
                  setImproveSubmitted(false)
                }}
                className={`group text-left rounded-3xl border-2 p-7 transition-all hover:scale-[1.02] hover:shadow-2xl ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 hover:border-slate-500"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-lg"
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center text-2xl mb-5 shadow-lg`}>
                  {m.icon}
                </div>
                <h3 className="text-xl font-black mb-2">{m.title}</h3>
                <p className={`text-sm leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{m.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Practice ─────────────────────────────────────────────────────────────
  if (phase === "practice") {
    const q = practiceQuestions[currentQuestionIdx]
    const isLast = currentQuestionIdx === practiceQuestions.length - 1

    return (
      <div className="pt-24 min-h-screen p-6 animate-in fade-in slide-in-from-right-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setPhase("hub")}
              className="flex items-center gap-1 text-slate-500 hover:text-[#800000] font-bold uppercase text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              Hub
            </button>
            <span className={`text-sm font-bold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Question {currentQuestionIdx + 1} / {practiceQuestions.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className={`h-2 rounded-full mb-8 ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>
            <div
              className="h-full bg-[#800000] rounded-full transition-all"
              style={{ width: `${((currentQuestionIdx + 1) / practiceQuestions.length) * 100}%` }}
            />
          </div>

          <div className={`rounded-3xl border-2 p-8 mb-6 ${cardBase}`}>
            {/* Guidance banner */}
            <div className={`rounded-2xl p-4 mb-6 flex gap-3 ${isDarkMode ? "bg-blue-900/30 border border-blue-700" : "bg-blue-50 border border-blue-200"}`}>
              <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">Pupil Guidance</p>
                <p className={`text-sm ${isDarkMode ? "text-blue-300" : "text-blue-700"}`}>{q.guidance}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-black ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                {q.topic}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                {q.marks} marks
              </span>
            </div>

            <p className="text-lg font-semibold leading-relaxed mb-6">{q.question}</p>

            <textarea
              value={answers[q.id] || ""}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
              placeholder="Write your answer here, showing all working..."
              rows={5}
              disabled={submitted}
              className={`w-full rounded-2xl border-2 p-4 text-sm font-medium resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-[#800000] ${
                isDarkMode
                  ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
              } ${submitted ? "opacity-60" : ""}`}
            />

            {submitted && (
              <div className={`mt-4 rounded-2xl p-4 ${isDarkMode ? "bg-green-900/30 border border-green-700" : "bg-green-50 border border-green-200"}`}>
                <p className="text-xs font-black uppercase tracking-widest text-green-600 dark:text-green-400 mb-1">Mark Scheme</p>
                <p className={`text-sm ${isDarkMode ? "text-green-300" : "text-green-700"}`}>{q.markScheme}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {!submitted ? (
              <button
                onClick={() => setSubmitted(true)}
                disabled={!answers[q.id]?.trim()}
                className="flex-1 py-3 rounded-xl font-black bg-[#800000] text-white hover:bg-[#600000] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Check Answer
              </button>
            ) : isLast ? (
              <button
                onClick={() => setPhase("hub")}
                className="flex-1 py-3 rounded-xl font-black bg-[#800000] text-white hover:bg-[#600000] transition-colors"
              >
                Finish Practice
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentQuestionIdx((i) => i + 1)
                  setSubmitted(false)
                }}
                className="flex-1 py-3 rounded-xl font-black bg-[#800000] text-white hover:bg-[#600000] transition-colors"
              >
                Next Question →
              </button>
            )}
            <button
              onClick={() => { setPhase("hub"); setSubmitted(false) }}
              className={`${btnOutline} ${isDarkMode ? "border-slate-600 hover:border-slate-400" : "border-slate-200 hover:border-slate-400"}`}
            >
              Hub
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Mark ─────────────────────────────────────────────────────────────────
  if (phase === "mark") {
    const totalAwarded = Object.values(markScores).reduce((a, b) => a + b, 0)
    const totalAvailable = markingDocument.rubric.reduce((a, r) => a + r.maxMarks, 0)
    const allMarked = markingDocument.rubric.every((r) => markScores[r.id] !== undefined)

    return (
      <div className="pt-24 min-h-screen p-6 animate-in fade-in slide-in-from-right-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setPhase("hub")}
              className="flex items-center gap-1 text-slate-500 hover:text-[#800000] font-bold uppercase text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              Hub
            </button>
            <span className={`text-sm font-bold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Marking Task
            </span>
          </div>

          <h2 className="text-2xl font-black mb-1">{markingDocument.title}</h2>
          <p className={`text-sm mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{markingDocument.description}</p>

          {/* Pupil response */}
          <div className={`rounded-3xl border-2 p-6 mb-6 ${cardBase}`}>
            <p className="text-xs font-black uppercase tracking-widest text-amber-600 mb-3">Pupil Response</p>
            <pre className={`text-sm leading-relaxed whitespace-pre-wrap font-sans ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
              {markingDocument.pupilResponse}
            </pre>
          </div>

          {/* Rubric */}
          <div className={`rounded-3xl border-2 p-6 mb-6 ${cardBase}`}>
            <p className="text-xs font-black uppercase tracking-widest text-[#800000] mb-4">Marking Rubric</p>
            <div className="space-y-4">
              {markingDocument.rubric.map((criterion) => (
                <div key={criterion.id} className={`p-4 rounded-2xl border ${isDarkMode ? "border-slate-600 bg-slate-700/50" : "border-slate-100 bg-slate-50"}`}>
                  <p className="text-sm font-semibold mb-3">{criterion.criterion}</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: criterion.maxMarks + 1 }, (_, i) => i).map((v) => (
                      <button
                        key={v}
                        onClick={() => setMarkScores((prev) => ({ ...prev, [criterion.id]: v }))}
                        className={`w-10 h-10 rounded-xl font-black text-sm border-2 transition-all ${
                          markScores[criterion.id] === v
                            ? "bg-[#800000] text-white border-[#800000] scale-105"
                            : isDarkMode
                              ? "border-slate-600 hover:border-slate-400"
                              : "border-slate-200 hover:border-[#800000]"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                    <span className={`self-center text-xs font-bold ml-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      / {criterion.maxMarks}
                    </span>
                  </div>
                  {/* Notes field */}
                  <input
                    type="text"
                    placeholder="Add a note (optional)..."
                    value={markingNotes[criterion.id] || ""}
                    onChange={(e) => setMarkingNotes((prev) => ({ ...prev, [criterion.id]: e.target.value }))}
                    className={`mt-3 w-full rounded-xl border px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#800000] ${
                      isDarkMode
                        ? "bg-slate-600 border-slate-500 text-slate-200 placeholder-slate-400"
                        : "bg-white border-slate-200 text-slate-700 placeholder-slate-400"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Total & submit */}
          <div className={`rounded-3xl border-2 p-6 mb-4 flex items-center justify-between ${cardBase}`}>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Total Awarded</p>
              <p className="text-3xl font-black">
                <span className="text-[#800000]">{totalAwarded}</span>
                <span className={`text-lg ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}> / {totalAvailable}</span>
              </p>
            </div>
            {allMarked && (
              <div className={`px-4 py-2 rounded-xl text-sm font-black ${
                totalAwarded >= totalAvailable * 0.7
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : totalAwarded >= totalAvailable * 0.5
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}>
                {totalAwarded >= totalAvailable * 0.7 ? "Strong pass ✓" : totalAwarded >= totalAvailable * 0.5 ? "Borderline" : "Needs work"}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setMarkScores({}); setMarkingNotes({}) }}
              className={`${btnOutline} ${isDarkMode ? "border-slate-600 hover:border-slate-400" : "border-slate-200 hover:border-slate-400"}`}
            >
              Reset
            </button>
            <button
              onClick={() => setPhase("hub")}
              className="flex-1 py-3 rounded-xl font-black bg-[#800000] text-white hover:bg-[#600000] transition-colors"
            >
              Back to Hub
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Review ────────────────────────────────────────────────────────────────
  if (phase === "review") {
    return (
      <div className="pt-24 min-h-screen p-6 animate-in fade-in slide-in-from-right-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setPhase("hub")}
              className="flex items-center gap-1 text-slate-500 hover:text-[#800000] font-bold uppercase text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              Hub
            </button>
            <span className={`text-sm font-bold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Performance Review
            </span>
          </div>

          <h2 className="text-2xl font-black mb-1">Review</h2>
          <p className={`text-sm mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Your recent topic performance for <span className="text-amber-600 font-bold">{selectedLevel}</span>. Use this to guide your next study session.
          </p>

          {/* Filter tabs */}
          <div className={`inline-flex rounded-xl border p-1 mb-6 gap-1 ${isDarkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-100"}`}>
            {(["all", "strong", "weak"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setReviewFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wide transition-all ${
                  reviewFilter === f
                    ? "bg-[#800000] text-white shadow"
                    : isDarkMode
                      ? "text-slate-400 hover:text-slate-200"
                      : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f === "all" ? "All Topics" : f === "strong" ? "Strong (≥70%)" : "Needs Work (<70%)"}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredReview.map((item) => {
              const pct = item.score
              return (
                <div key={item.topic} className={`rounded-3xl border-2 p-6 ${cardBase}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-black text-lg">{item.topic}</h3>
                      <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Last attempted: {item.lastAttempted}</p>
                    </div>
                    <span className={`text-2xl font-black ${perfColour(pct)}`}>{pct}%</span>
                  </div>
                  <div className={`h-2 rounded-full mb-4 ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>
                    <div className={`h-full rounded-full transition-all ${perfBar(pct)}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className={`rounded-xl p-3 flex gap-2 ${isDarkMode ? "bg-slate-700/50" : "bg-slate-50"}`}>
                    <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className={`text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>{item.feedback}</p>
                  </div>
                </div>
              )
            })}
            {filteredReview.length === 0 && (
              <div className={`rounded-3xl border-2 p-10 text-center ${cardBase}`}>
                <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>No topics match this filter.</p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <button
              onClick={() => setPhase("hub")}
              className={`w-full py-3 rounded-xl font-black border-2 transition-colors ${isDarkMode ? "border-slate-600 hover:border-slate-400" : "border-slate-200 hover:border-slate-400"}`}
            >
              Back to Hub
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Improve ───────────────────────────────────────────────────────────────
  if (phase === "improve") {
    const q = improveQuestions[currentQuestionIdx]
    const isLast = currentQuestionIdx === improveQuestions.length - 1
    const hasAnswered = improveAnswers[q.id] !== undefined
    const isCorrect = improveAnswers[q.id] === q.answer

    return (
      <div className="pt-24 min-h-screen p-6 animate-in fade-in slide-in-from-right-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setPhase("hub")}
              className="flex items-center gap-1 text-slate-500 hover:text-[#800000] font-bold uppercase text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              Hub
            </button>
            <span className={`text-sm font-bold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Question {currentQuestionIdx + 1} / {improveQuestions.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className={`h-2 rounded-full mb-8 ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>
            <div
              className="h-full bg-[#800000] rounded-full transition-all"
              style={{ width: `${((currentQuestionIdx + 1) / improveQuestions.length) * 100}%` }}
            />
          </div>

          <div className={`rounded-3xl border-2 p-8 mb-6 ${cardBase}`}>
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-black ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                {q.topic}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                Needs Work
              </span>
            </div>

            <p className="text-lg font-semibold leading-relaxed mb-6">{q.question}</p>

            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                let btnCls = `w-full text-left px-5 py-4 rounded-2xl border-2 font-semibold text-sm transition-all `
                if (!hasAnswered) {
                  btnCls += isDarkMode
                    ? "border-slate-600 hover:border-slate-400 bg-slate-700/50"
                    : "border-slate-200 hover:border-[#800000] bg-white"
                } else if (idx === q.answer) {
                  btnCls += "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                } else if (idx === improveAnswers[q.id]) {
                  btnCls += "border-red-400 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                } else {
                  btnCls += isDarkMode ? "border-slate-700 bg-slate-800/50 opacity-50" : "border-slate-100 bg-slate-50 opacity-50"
                }
                return (
                  <button
                    key={idx}
                    disabled={hasAnswered}
                    onClick={() => setImproveAnswers((prev) => ({ ...prev, [q.id]: idx }))}
                    className={btnCls}
                  >
                    <span className="font-black mr-2">{String.fromCharCode(65 + idx)}.</span> {opt}
                  </button>
                )
              })}
            </div>

            {hasAnswered && (
              <div className={`mt-4 rounded-2xl p-4 ${
                isCorrect
                  ? isDarkMode ? "bg-green-900/30 border border-green-700" : "bg-green-50 border border-green-200"
                  : isDarkMode ? "bg-red-900/30 border border-red-700" : "bg-red-50 border border-red-200"
              }`}>
                <p className={`text-xs font-black uppercase tracking-widest mb-1 ${isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {isCorrect ? "Correct! ✓" : "Incorrect ✗"}
                </p>
                <p className={`text-sm ${isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>{q.explanation}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {improveSubmitted ? (
              <button
                onClick={() => setPhase("hub")}
                className="flex-1 py-3 rounded-xl font-black bg-[#800000] text-white hover:bg-[#600000] transition-colors"
              >
                Back to Hub
              </button>
            ) : hasAnswered && isLast ? (
              <button
                onClick={() => setImproveSubmitted(true)}
                className="flex-1 py-3 rounded-xl font-black bg-[#800000] text-white hover:bg-[#600000] transition-colors"
              >
                See Results
              </button>
            ) : hasAnswered ? (
              <button
                onClick={() => setCurrentQuestionIdx((i) => i + 1)}
                className="flex-1 py-3 rounded-xl font-black bg-[#800000] text-white hover:bg-[#600000] transition-colors"
              >
                Next Question →
              </button>
            ) : null}
            <button
              onClick={() => setPhase("hub")}
              className={`${btnOutline} ${isDarkMode ? "border-slate-600 hover:border-slate-400" : "border-slate-200 hover:border-slate-400"}`}
            >
              Hub
            </button>
          </div>

          {improveSubmitted && (
            <div className={`mt-6 rounded-3xl border-2 p-6 text-center ${cardBase}`}>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Session Complete</p>
              <p className="text-4xl font-black mb-1">
                <span className="text-[#800000]">{Object.values(improveAnswers).filter((a, i) => a === improveQuestions[i]?.answer).length}</span>
                <span className={`text-xl ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}> / {improveQuestions.length}</span>
              </p>
              <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Keep practising your weak topics to improve your grade.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}

// --- Components ---

// --- Auth Modal ---

function AuthModal({
  isOpen,
  onClose,
  onSignIn,
  isDarkMode,
}: {
  isOpen: boolean
  onClose: () => void
  onSignIn: (user: UserAccount, isNewAccount?: boolean) => void
  isDarkMode: boolean
}) {
  const [tab, setTab] = useState<"signin" | "signup">("signin")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [accountType, setAccountType] = useState<AccountType>("pupil")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  // Level selection step (for pupils after signup)
  const [signupStep, setSignupStep] = useState<"details" | "levels">("details")
  const [pendingUser, setPendingUser] = useState<UserAccount | null>(null)
  const LEVEL_OPTIONS = ["not sitting", "National 5", "Higher", "Advanced Higher"] as const
  const [subjectLevels, setSubjectLevels] = useState<Partial<Record<SubjectId, string>>>({})

  // Reset form state each time the modal opens
  useEffect(() => {
    if (isOpen) {
      setTab("signin")
      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setShowPassword(false)
      setShowConfirmPassword(false)
      setAccountType("pupil")
      setError("")
      setSuccess("")
      setSignupStep("details")
      setPendingUser(null)
      setSubjectLevels({})
    }
  }, [isOpen])

  if (!isOpen) return null

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    try {
      const accounts = loadAccounts()
      const found = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase())
      if (!found) {
        setError("No account found with that email. Please create an account first.")
        return
      }
      if (found.password) {
        const valid = await verifyPassword(password, found.password)
        if (!valid) {
          setError("Incorrect password. Please try again.")
          return
        }
      }
      saveCurrentUser(found)
      onSignIn(found)
      onClose()
    } catch {
      setError("An error occurred during sign in. Please try again.")
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one capital letter.")
      return
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    const accounts = loadAccounts()
    if (accounts.find((a) => a.email.toLowerCase() === email.toLowerCase())) {
      setError("An account with this email already exists. Please sign in.")
      return
    }
    try {
      const hashedPassword = await hashPassword(password)
      const newUser: UserAccount = {
        id: generateId(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        accountType,
        password: hashedPassword,
      }
      if (accountType === "pupil") {
        // For pupils: go to level selection step before finalising
        setPendingUser(newUser)
        setSignupStep("levels")
      } else {
        // Teachers: create account immediately
        saveAccounts([...accounts, newUser])
        saveCurrentUser(newUser)
        setSuccess("Account created!")
        setTimeout(() => {
          onSignIn(newUser, true)
          onClose()
        }, 800)
      }
    } catch {
      setError("An error occurred during account creation. Please try again.")
    }
  }

  function handleLevelSelectionDone() {
    if (!pendingUser) return
    const finalUser: UserAccount = { ...pendingUser, subjectLevels }
    const accounts = loadAccounts()
    saveAccounts([...accounts, finalUser])
    saveCurrentUser(finalUser)
    setSuccess("Account created!")
    setTimeout(() => {
      onSignIn(finalUser, true)
      onClose()
    }, 800)
  }

  // ── Level Selection Step (pupils only) ──────────────────────────────────
  if (signupStep === "levels") {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div
          className={`relative w-full max-w-md rounded-2xl shadow-2xl p-8 ${
            isDarkMode ? "bg-slate-900 text-white border border-slate-700" : "bg-white text-slate-900 border border-slate-200"
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#800000] rounded-xl text-white shadow-lg">
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#800000]">Select Your Levels</h2>
              <p className="text-xs text-slate-500">Tell us what you&apos;re sitting this year</p>
            </div>
          </div>
          <p className={`text-sm mb-5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            For each subject, select the level you&apos;re sitting. Choose <strong>&quot;Not Sitting&quot;</strong> if you&apos;re not studying that subject.
          </p>
          <div className="space-y-4 mb-6">
            {SUBJECTS.map((subject) => {
              const availableLevels = subject.id === "Practical Electronics"
                ? (["not sitting", "National 5"] as const)
                : LEVEL_OPTIONS
              const current = subjectLevels[subject.id] ?? "not sitting"
              return (
                <div key={subject.id}>
                  <p className={`text-xs font-black uppercase tracking-widest mb-2 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                    {subject.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {availableLevels.map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSubjectLevels((prev) => ({ ...prev, [subject.id]: lvl }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${
                          current === lvl
                            ? lvl === "not sitting"
                              ? "bg-slate-500 text-white border-slate-500"
                              : "bg-[#800000] text-white border-[#800000]"
                            : isDarkMode
                              ? "border-slate-600 text-slate-300 hover:border-slate-400"
                              : "border-slate-200 text-slate-600 hover:border-slate-400"
                        }`}
                      >
                        {lvl === "not sitting" ? "Not Sitting" : lvl}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          {success && <p className="text-green-500 text-sm font-semibold mb-3">{success}</p>}
          <button
            onClick={handleLevelSelectionDone}
            className="w-full py-3 bg-[#800000] hover:bg-[#600000] text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Create Account
          </button>
          <button
            onClick={() => setSignupStep("details")}
            className={`mt-3 w-full py-2 text-xs font-semibold transition-colors ${isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
          >
            ← Back to details
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl p-8 ${
          isDarkMode ? "bg-slate-900 text-white border border-slate-700" : "bg-white text-slate-900 border border-slate-200"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#800000] rounded-xl text-white shadow-lg">
            <Atom className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#800000]">Trinity Boost</h2>
            <p className="text-xs text-slate-500">Physics Study Portal</p>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex rounded-xl p-1 mb-6 ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}>
          <button
            onClick={() => { setTab("signin"); setError(""); }}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${
              tab === "signin"
                ? "bg-[#800000] text-white shadow-md"
                : isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab("signup"); setError(""); }}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${
              tab === "signup"
                ? "bg-[#800000] text-white shadow-md"
                : isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Create Account
          </button>
        </div>

        {tab === "signin" ? (
          <form onSubmit={handleSignIn} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-[#800000]"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#800000]"
                } outline-none focus:ring-2 focus:ring-[#800000]/20`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  className={`w-full px-4 py-2.5 pr-10 rounded-xl border text-sm transition-colors ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-[#800000]"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#800000]"
                  } outline-none focus:ring-2 focus:ring-[#800000]/20`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-[#800000] hover:bg-[#600000] text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>

            {/* Demo / Test Accounts */}
            <div className={`mt-2 rounded-xl border p-3 ${isDarkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"}`}>
              <p className="text-xs font-semibold text-slate-500 mb-2">Demo accounts (password: <span className="font-mono">{TEST_ACCOUNT_PASSWORD}</span>)</p>
              <div className="grid grid-cols-2 gap-1.5">
                {TEST_ACCOUNTS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => { setEmail(a.email); setPassword(TEST_ACCOUNT_PASSWORD); }}
                    className={`text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      a.accountType === "teacher"
                        ? isDarkMode ? "bg-amber-900/30 hover:bg-amber-900/50 text-amber-300" : "bg-amber-50 hover:bg-amber-100 text-amber-700"
                        : isDarkMode ? "bg-[#800000]/20 hover:bg-[#800000]/40 text-red-300" : "bg-red-50 hover:bg-red-100 text-[#800000]"
                    }`}
                  >
                    <span className="font-semibold block">{a.name}</span>
                    <span className="opacity-70">{a.accountType}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-[#800000]"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#800000]"
                } outline-none focus:ring-2 focus:ring-[#800000]/20`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-[#800000]"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#800000]"
                } outline-none focus:ring-2 focus:ring-[#800000]/20`}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  className={`w-full px-4 py-2.5 pr-10 rounded-xl border text-sm transition-colors ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-[#800000]"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#800000]"
                  } outline-none focus:ring-2 focus:ring-[#800000]/20`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Must be at least 8 characters and include a capital letter and a number.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  className={`w-full px-4 py-2.5 pr-10 rounded-xl border text-sm transition-colors ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-[#800000]"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#800000]"
                  } outline-none focus:ring-2 focus:ring-[#800000]/20`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Account Type Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2">I am a…</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAccountType("pupil")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    accountType === "pupil"
                      ? "border-[#800000] bg-[#800000]/10"
                      : isDarkMode ? "border-slate-700 hover:border-slate-500" : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <UserCircle className={`w-7 h-7 ${accountType === "pupil" ? "text-[#800000]" : "text-slate-400"}`} />
                  <span className={`text-sm font-bold ${accountType === "pupil" ? "text-[#800000]" : ""}`}>Pupil</span>
                  <span className="text-[10px] text-slate-400 text-center leading-tight">Access quizzes &amp; progress</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType("teacher")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    accountType === "teacher"
                      ? "border-amber-600 bg-amber-600/10"
                      : isDarkMode ? "border-slate-700 hover:border-slate-500" : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <GraduationCap className={`w-7 h-7 ${accountType === "teacher" ? "text-amber-600" : "text-slate-400"}`} />
                  <span className={`text-sm font-bold ${accountType === "teacher" ? "text-amber-600" : ""}`}>Teacher</span>
                  <span className="text-[10px] text-slate-400 text-center leading-tight">Manage classes &amp; view progress</span>
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm font-semibold">{success}</p>}
            <p className={`text-[11px] rounded-xl p-3 border ${isDarkMode ? "text-slate-400 bg-slate-800 border-slate-700" : "text-slate-500 bg-slate-50 border-slate-200"}`}>
              🔒 <strong>Data Protection:</strong> Your name and email are stored securely on this device and are only used within Trinity Boost. Your progress data is visible to your teacher within your class. We do not share your information with third parties.
            </p>
            <button
              type="submit"
              className="w-full py-3 bg-[#800000] hover:bg-[#600000] text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Create Account
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// --- Class Management (Teacher) ---

function ClassManagement({
  currentUser,
  isDarkMode,
  onClose,
}: {
  currentUser: UserAccount
  isDarkMode: boolean
  onClose: () => void
}) {
  const [groups, setGroups] = useState<ClassGroup[]>(() => loadClassGroups())
  const [newClassName, setNewClassName] = useState("")
  const [joinCode, setJoinCode] = useState("")
  const [joinError, setJoinError] = useState("")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const myGroups = currentUser.accountType === "teacher"
    ? groups.filter((g) => g.teacherId === currentUser.id)
    : groups.filter((g) => g.memberIds.includes(currentUser.id))

  const allAccounts = loadAccounts()

  function getMemberName(id: string): string {
    return allAccounts.find((a) => a.id === id)?.name ?? "Unknown"
  }

  function handleCreateClass(e: React.FormEvent) {
    e.preventDefault()
    if (!newClassName.trim()) return
    const newGroup: ClassGroup = {
      id: generateId(),
      name: newClassName.trim(),
      teacherId: currentUser.id,
      memberIds: [],
      code: generateClassCode(),
    }
    const updated = [...groups, newGroup]
    saveClassGroups(updated)
    setGroups(updated)
    setNewClassName("")
  }

  function handleDeleteClass(groupId: string) {
    const updated = groups.filter((g) => g.id !== groupId)
    saveClassGroups(updated)
    setGroups(updated)
  }

  function handleJoinClass(e: React.FormEvent) {
    e.preventDefault()
    setJoinError("")
    const group = groups.find((g) => g.code === joinCode.trim().toUpperCase())
    if (!group) {
      setJoinError("Class code not found. Please check and try again.")
      return
    }
    if (group.memberIds.includes(currentUser.id)) {
      setJoinError("You are already in this class.")
      return
    }
    const updated = groups.map((g) =>
      g.id === group.id ? { ...g, memberIds: [...g.memberIds, currentUser.id] } : g
    )
    saveClassGroups(updated)
    setGroups(updated)
    setJoinCode("")
  }

  function handleLeaveClass(groupId: string) {
    const updated = groups.map((g) =>
      g.id === groupId ? { ...g, memberIds: g.memberIds.filter((id) => id !== currentUser.id) } : g
    )
    saveClassGroups(updated)
    setGroups(updated)
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code).then(
      () => {
        setCopiedCode(code)
        setTimeout(() => setCopiedCode(null), 2000)
      },
      () => {
        setCopiedCode(code)
        setTimeout(() => setCopiedCode(null), 2000)
      }
    )
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl p-8 ${
          isDarkMode ? "bg-slate-900 text-white border border-slate-700" : "bg-white text-slate-900 border border-slate-200"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-600 rounded-xl text-white shadow-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black">Class Management</h2>
            <p className="text-xs text-slate-500">
              {currentUser.accountType === "teacher" ? "Manage your class groups" : "Your enrolled classes"}
            </p>
          </div>
        </div>

        {currentUser.accountType === "teacher" ? (
          <>
            {/* Create new class */}
            <form onSubmit={handleCreateClass} className="flex gap-2 mb-6">
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="New class name…"
                className={`flex-1 px-4 py-2.5 rounded-xl border text-sm ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white placeholder-slate-500"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                } outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500`}
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Create
              </button>
            </form>

            {myGroups.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No classes yet. Create one above.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {myGroups.map((group) => (
                  <div
                    key={group.id}
                    className={`rounded-xl border p-4 ${
                      isDarkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold">{group.name}</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyCode(group.code)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            copiedCode === group.code
                              ? "border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20"
                              : isDarkMode ? "border-slate-600 hover:border-amber-500 text-slate-300 hover:text-amber-400" : "border-slate-300 hover:border-amber-500 text-slate-600 hover:text-amber-600"
                          }`}
                          title="Copy join code"
                        >
                          {copiedCode === group.code ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {group.code}
                        </button>
                        <button
                          onClick={() => handleDeleteClass(group.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete class"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-400">{group.memberIds.length} pupil{group.memberIds.length !== 1 ? "s" : ""}</span>
                    </div>
                    {group.memberIds.length > 0 && (
                      <ul className="flex flex-col gap-1 mt-2">
                        {group.memberIds.map((id) => (
                          <li key={id} className="flex items-center gap-2 text-sm">
                            <UserCircle className="w-4 h-4 text-slate-400" />
                            {getMemberName(id)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Join a class */}
            <form onSubmit={handleJoinClass} className="flex gap-2 mb-6">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter class code…"
                maxLength={6}
                className={`flex-1 px-4 py-2.5 rounded-xl border text-sm uppercase tracking-widest font-mono ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white placeholder-slate-500"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                } outline-none focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000]`}
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#800000] hover:bg-[#600000] text-white rounded-xl font-bold text-sm transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Join
              </button>
            </form>
            {joinError && <p className="text-red-500 text-sm mb-4">{joinError}</p>}

            {myGroups.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">You haven't joined any classes yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {myGroups.map((group) => {
                  const resolvedName = getMemberName(group.teacherId)
                  const teacherName = resolvedName !== "Unknown"
                    ? resolvedName
                    : allAccounts.find((a) => a.id === group.teacherId)?.name ?? "Teacher"
                  return (
                    <div
                      key={group.id}
                      className={`rounded-xl border p-4 ${
                        isDarkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold">{group.name}</h3>
                        <button
                          onClick={() => handleLeaveClass(group.id)}
                          className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors"
                        >
                          Leave
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-xs text-slate-400">{teacherName}</span>
                        <span className="text-slate-300 dark:text-slate-600">·</span>
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs text-slate-400">{group.memberIds.length} pupil{group.memberIds.length !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function Navbar({
  view,
  appMode,
  selectedLevel,
  selectedSubject,
  onHome,
  isDarkMode,
  currentUser,
  onSignInClick,
  onSignOut,
  onClassesClick,
  onProfileClick,
}: {
  view: ViewType
  appMode: AppMode
  selectedLevel: string
  selectedSubject: SubjectId
  onHome: () => void
  isDarkMode: boolean
  currentUser: UserAccount | null
  onSignInClick: () => void
  onSignOut: () => void
  onClassesClick: () => void
  onProfileClick: () => void
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [daysToExam, setDaysToExam] = useState<number | null>(null)

  useEffect(() => {
    const examDate = EXAM_DATES[selectedSubject]
    if (!examDate) { setDaysToExam(null); return }
    const compute = () => {
      const now = new Date()
      const exam = new Date(examDate + "T00:00:00")
      const diffMs = exam.getTime() - now.getTime()
      setDaysToExam(diffMs > 0 ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : null)
    }
    compute()
    const id = setInterval(compute, 60_000)
    return () => clearInterval(id)
  }, [selectedSubject])

  return (
    <nav
      className={`fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md border-b transition-colors duration-300 ${
        isDarkMode ? "bg-slate-900/80 border-slate-700 text-white" : "bg-white/80 border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center gap-3 cursor-pointer" onClick={onHome}>
        <div className="p-2 bg-[#800000] rounded-xl text-white shadow-lg">
          <Atom className="w-6 h-6" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-xl font-black tracking-tight text-[#800000] dark:text-red-500">Trinity High</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
            {SUBJECTS.find((s) => s.id === selectedSubject)!.dept}
          </span>
        </div>
      </div>

      {view !== "landing" && view !== "subject-select" && (
        <div className="hidden md:flex items-center gap-4 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium">{selectedLevel}</span>
          </div>
          {appMode && (
            <>
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-600" />
              <div className="flex items-center gap-2">
                {appMode === "mc" ? (
                  <MousePointer2 className="w-4 h-4 text-[#800000]" />
                ) : appMode === "definitions" ? (
                  <BookOpen className="w-4 h-4 text-[#800000]" />
                ) : (
                  <FileText className="w-4 h-4 text-[#800000]" />
                )}
                <span className="text-sm font-medium">
                  {appMode === "mc"
                    ? "Multiple Choice"
                    : appMode === "definitions"
                      ? "Definitions"
                      : appMode === "retrieval"
                        ? "Retrieval"
                        : appMode === "calculations"
                          ? "Calculations"
                          : appMode === "assignment"
                            ? "Assignment"
                            : appMode === "practice"
                              ? "Practice"
                              : "Paper Questions"}
                </span>
              </div>
            </>
          )}
          {daysToExam !== null && (
            <>
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-600" />
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#800000]" />
                <span className="text-sm font-bold text-[#800000]">
                  {daysToExam}d to exam
                </span>
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button onClick={onHome} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <Home className="w-6 h-6" />
        </button>

        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                isDarkMode
                  ? "border-slate-700 bg-slate-800 hover:border-slate-500"
                  : "border-slate-200 bg-white hover:border-slate-400"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black ${
                  currentUser.accountType === "teacher" ? "bg-amber-600" : "bg-[#800000]"
                }`}
              >
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block text-sm font-semibold max-w-[100px] truncate">{currentUser.name}</span>
              {currentUser.accountType === "teacher" && (
                <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-700">
                  Teacher
                </span>
              )}
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {userMenuOpen && (
              <div
                className={`absolute right-0 top-full mt-2 w-52 rounded-xl shadow-xl border overflow-hidden ${
                  isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
                }`}
              >
                <div className={`px-4 py-3 border-b ${isDarkMode ? "border-slate-700" : "border-slate-100"}`}>
                  <p className="text-sm font-bold truncate">{currentUser.name}</p>
                  <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                </div>
                <button
                  onClick={() => { onProfileClick(); setUserMenuOpen(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors ${
                    isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-50"
                  }`}
                >
                  <UserCircle className="w-4 h-4 text-[#800000]" />
                  My Profile
                </button>
                <button
                  onClick={() => { onClassesClick(); setUserMenuOpen(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors ${
                    isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-50"
                  }`}
                >
                  <Users className="w-4 h-4 text-amber-600" />
                  {currentUser.accountType === "teacher" ? "Manage Classes" : "My Classes"}
                </button>
                <button
                  onClick={() => { onSignOut(); setUserMenuOpen(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 transition-colors ${
                    isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-50"
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}

            {/* Click-outside overlay */}
            {userMenuOpen && (
              <div className="fixed inset-0 z-[-1]" onClick={() => setUserMenuOpen(false)} />
            )}
          </div>
        ) : (
          <button
            onClick={onSignInClick}
            className="flex items-center gap-2 px-4 py-2 bg-[#800000] hover:bg-[#600000] text-white rounded-xl font-bold text-sm transition-colors shadow-md"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>
    </nav>
  )
}

function SubjectSelection({
  onSelectSubject,
  isDarkMode,
}: {
  onSelectSubject: (subject: SubjectId) => void
  isDarkMode: boolean
}) {
  return (
    <div className="pt-24 min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-4xl w-full">
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-block px-4 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs font-black uppercase tracking-widest mb-6 border border-amber-200 dark:border-amber-800">
            Official Study Portal
          </div>
          <h1 className={`text-5xl md:text-7xl font-black mb-6 ${isDarkMode ? "text-white" : "text-[#800000]"}`}>
            Trinity Boost.
          </h1>
          <p className={`text-xl md:text-2xl mb-12 max-w-2xl mx-auto ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Choose your subject to access custom assessments and mark schemes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {SUBJECTS.map((subject) => (
            <button
              key={subject.id}
              onClick={() => onSelectSubject(subject.id)}
              className={`group relative p-10 rounded-3xl border-2 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700 hover:border-amber-500"
                  : "bg-white border-slate-200 hover:border-[#800000]"
              }`}
            >
              <div
                className={`text-2xl font-black mb-2 transition-colors ${
                  isDarkMode ? "group-hover:text-amber-500" : "group-hover:text-[#800000]"
                }`}
              >
                {subject.label}
              </div>
              <p className="text-sm text-slate-500">{subject.desc}</p>
              <div className="mt-6 flex justify-center">
                <div className="w-10 h-1 bg-amber-500 transition-all duration-500 group-hover:w-full" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Landing({
  onSelectLevel,
  onBack,
  selectedSubject,
  isDarkMode,
}: {
  onSelectLevel: (level: string) => void
  onBack: () => void
  selectedSubject: SubjectId
  isDarkMode: boolean
}) {
  const [comingSoonLevel, setComingSoonLevel] = React.useState<string | null>(null)

  const allLevels = [
    { id: "National 5", desc: "SCQF Level 5 Fundamentals" },
    {
      id: "Higher",
      displayId: selectedSubject === "Biology" ? "Human Higher" : undefined,
      desc: "SCQF Level 6 Advanced Concepts",
    },
    { id: "Advanced Higher", desc: "SCQF Level 7 Calculus Based" },
  ]
  const levels = selectedSubject === "Practical Electronics" ? allLevels.slice(0, 1) : allLevels

  const subjectInfo = SUBJECTS.find((s) => s.id === selectedSubject)!

  function handleLevelClick(level: { id: string; displayId?: string; desc: string }) {
    if (level.id !== "National 5") {
      setComingSoonLevel(level.displayId ?? level.id)
    } else {
      onSelectLevel(level.id)
    }
  }

  return (
    <div className="pt-24 min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-4xl w-full">
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-block px-4 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs font-black uppercase tracking-widest mb-6 border border-amber-200 dark:border-amber-800">
            {subjectInfo.label}
          </div>
          <h1 className={`text-5xl md:text-7xl font-black mb-6 ${isDarkMode ? "text-white" : "text-[#800000]"}`}>
            Trinity Boost.
          </h1>
          <p className={`text-xl md:text-2xl mb-12 max-w-2xl mx-auto ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Select your academic level to access custom {subjectInfo.label.toLowerCase()} assessments and mark schemes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => handleLevelClick(level)}
              className={`group relative p-10 rounded-3xl border-2 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700 hover:border-amber-500"
                  : "bg-white border-slate-200 hover:border-[#800000]"
              }`}
            >
              <div
                className={`text-2xl font-black mb-2 transition-colors ${
                  isDarkMode ? "group-hover:text-amber-500" : "group-hover:text-[#800000]"
                }`}
              >
                {level.displayId ?? level.id}
              </div>
              <p className="text-sm text-slate-500">{level.desc}</p>
              {level.id !== "National 5" && (
                <div className="mt-3 inline-block px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest border border-amber-200 dark:border-amber-700">
                  Coming Soon
                </div>
              )}
              <div className="mt-4 flex justify-center">
                <div className="w-10 h-1 bg-amber-500 transition-all duration-500 group-hover:w-full" />
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onBack}
          className={`text-sm font-semibold transition-colors ${isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-[#800000]"}`}
        >
          ← Back to Subjects
        </button>
      </div>

      {/* Coming Soon popup for Higher / Advanced Higher */}
      {comingSoonLevel && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-3xl shadow-2xl border-4 border-amber-500 p-8 text-center animate-in fade-in zoom-in-95 ${isDarkMode ? "bg-slate-900" : "bg-white"}`}>
            <div className="text-5xl mb-4">🚧</div>
            <h2 className="text-2xl font-black mb-3">{comingSoonLevel} — Coming Soon!</h2>
            <p className={`text-sm mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Content for <strong>{comingSoonLevel}</strong> is currently under development and will be available shortly. Stay tuned!
            </p>
            <button
              onClick={() => setComingSoonLevel(null)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm transition-colors"
            >
              OK, got it!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── ExamPaperMode ────────────────────────────────────────────────────────────

function ExamPaperMode({
  selectedLevel,
  onBack,
  isDarkMode,
  currentUserId,
}: {
  selectedLevel: string
  onBack: () => void
  isDarkMode: boolean
  currentUserId: string | undefined
}) {
  type ExamPhase = "hub" | "exam" | "review" | "results"

  const [phase, setPhase] = useState<ExamPhase>("hub")
  const [selectedPaper, setSelectedPaper] = useState<PastPaperMeta | null>(null)
  const [currentQIdx, setCurrentQIdx] = useState(0)
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({})
  const [examMarks, setExamMarks] = useState<Record<string, number>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [examStartTime, setExamStartTime] = useState(0)
  const [timeTaken, setTimeTaken] = useState(0)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [resultsSaved, setResultsSaved] = useState(false)

  const papers = PAST_PAPER_BANKS[selectedLevel] || []

  const totalMarks = useMemo(() => {
    if (!selectedPaper) return 0
    return selectedPaper.questions.reduce((sum, q) => {
      if (q.type === "paper") return sum + q.parts.reduce((s, p) => s + p.marks, 0)
      return sum + 1
    }, 0)
  }, [selectedPaper])

  // Countdown timer
  useEffect(() => {
    if (phase !== "exam") return
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [phase])

  const startExam = (paper: PastPaperMeta) => {
    const paperTotalMarks = paper.questions.reduce((sum, q) => {
      if (q.type === "paper") return sum + q.parts.reduce((s, p) => s + p.marks, 0)
      return sum + 1
    }, 0)
    setSelectedPaper(paper)
    setCurrentQIdx(0)
    setExamAnswers({})
    setExamMarks({})
    setExamStartTime(Date.now())
    setTimeTaken(0)
    setTimeLeft(Math.round(paperTotalMarks * (60 / 0.9)))
    setShowSubmitDialog(false)
    setResultsSaved(false)
    setPhase("exam")
  }

  const submitExam = () => {
    const taken = Math.round((Date.now() - examStartTime) / 1000)
    setTimeTaken(taken)
    setPhase("review")
  }

  const attemptedQuestions = useMemo(() => {
    if (!selectedPaper) return new Set<number>()
    const attempted = new Set<number>()
    selectedPaper.questions.forEach((q, qIdx) => {
      if (q.type === "paper") {
        const hasAnswer = q.parts.some((_, pIdx) => {
          const ans = examAnswers[`${qIdx}-${pIdx}`]
          return ans && ans.trim().length > 0
        })
        if (hasAnswer) attempted.add(qIdx)
      }
    })
    return attempted
  }, [selectedPaper, examAnswers])

  const totalEarned = useMemo(() => {
    if (!selectedPaper) return 0
    let sum = 0
    selectedPaper.questions.forEach((q, qIdx) => {
      if (q.type === "paper") {
        q.parts.forEach((_, pIdx) => {
          sum += examMarks[`${qIdx}-${pIdx}`] ?? 0
        })
      }
    })
    return sum
  }, [selectedPaper, examMarks])

  const topicBreakdown = useMemo(() => {
    if (!selectedPaper) return []
    const breakdown: Record<string, { earned: number; total: number }> = {}
    selectedPaper.questions.forEach((q, qIdx) => {
      if (q.type === "paper") {
        const topic = q.subtopic || q.topic
        if (!breakdown[topic]) breakdown[topic] = { earned: 0, total: 0 }
        q.parts.forEach((p, pIdx) => {
          breakdown[topic].total += p.marks
          breakdown[topic].earned += examMarks[`${qIdx}-${pIdx}`] ?? 0
        })
      }
    })
    return Object.entries(breakdown).map(([topic, { earned, total }]) => ({
      topic,
      earned,
      total,
      pct: total > 0 ? Math.round((earned / total) * 100) : 0,
    }))
  }, [selectedPaper, examMarks])

  const percentage = totalMarks > 0 ? Math.round((totalEarned / totalMarks) * 100) : 0
  const grade = percentage >= 70 ? "A" : percentage >= 60 ? "B" : percentage >= 50 ? "C" : percentage >= 40 ? "D" : "NA"

  function getPaperAttempts(paperId: string): PaperAttempt[] {
    if (!currentUserId) return []
    const progress = loadUserExamProgress(currentUserId, selectedLevel)
    return progress.pastPapers?.[paperId] ?? []
  }

  function saveAttempt() {
    if (!currentUserId || !selectedPaper || resultsSaved) return
    const attempt: PaperAttempt = {
      date: Date.now(),
      timeTakenSeconds: timeTaken,
      marksEarned: totalEarned,
      marksTotal: totalMarks,
      partMarks: { ...examMarks },
    }
    const existing = loadUserExamProgress(currentUserId, selectedLevel)
    const paperId = selectedPaper.id
    existing.pastPapers = {
      ...existing.pastPapers,
      [paperId]: [...(existing.pastPapers?.[paperId] ?? []), attempt],
    }
    selectedPaper.questions.forEach((q, qIdx) => {
      if (q.type === "paper") {
        const topic = q.subtopic || q.topic
        if (!existing.paper[topic]) existing.paper[topic] = { correct: 0, total: 0 }
        q.parts.forEach((p, pIdx) => {
          existing.paper[topic].total += p.marks
          existing.paper[topic].correct += examMarks[`${qIdx}-${pIdx}`] ?? 0
        })
      }
    })
    saveUserExamProgress(currentUserId, selectedLevel, existing)
    setResultsSaved(true)
  }

  const cardBg = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"

  // ── Hub Phase ────────────────────────────────────────────────────────────
  if (phase === "hub") {
    return (
      <div className="pt-24 min-h-screen p-6 animate-in fade-in slide-in-from-right-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-[#800000] mb-8 font-bold uppercase text-xs tracking-widest"
          >
            <ChevronLeft className="w-4 h-4" />
            Mode selection
          </button>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#800000] text-white rounded-full font-black text-sm uppercase tracking-widest mb-6">
              <FileText className="w-4 h-4" />
              Exam Mode
            </div>
            <h2 className="text-4xl font-black mb-3">Choose Your Paper</h2>
            <p className={`text-lg ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Select a past paper to attempt under timed exam conditions.
            </p>
          </div>
          {papers.length === 0 ? (
            <div className={`p-8 rounded-3xl border text-center ${cardBg}`}>
              <p className="text-slate-400 font-bold">No past papers available for {selectedLevel}.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {papers.map((paper) => {
                const paperTotalMarks = paper.questions.reduce((sum, q) => {
                  if (q.type === "paper") return sum + q.parts.reduce((s, p) => s + p.marks, 0)
                  return sum + 1
                }, 0)
                const minutes = Math.floor(Math.round(paperTotalMarks * (60 / 0.9)) / 60)
                const prevAttempts = getPaperAttempts(paper.id)
                const bestPct =
                  prevAttempts.length > 0
                    ? Math.max(
                        ...prevAttempts.map((a) =>
                          a.marksTotal > 0 ? Math.round((a.marksEarned / a.marksTotal) * 100) : 0
                        )
                      )
                    : null
                const year = paper.id.match(/\d{4}/)?.[0] ?? ""
                return (
                  <button
                    key={paper.id}
                    onClick={() => startExam(paper)}
                    className={`text-left p-8 rounded-3xl border-2 transition-all hover:border-[#800000] hover:shadow-xl ${cardBg}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl font-black text-[#800000]">{year}</div>
                      {bestPct !== null && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black ${
                            bestPct >= 70
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : bestPct >= 50
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          Best: {bestPct}%
                        </span>
                      )}
                    </div>
                    <p className="font-black text-lg mb-1">{paper.label}</p>
                    <div className={`flex items-center gap-4 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      <span>{paper.questions.length} questions</span>
                      <span>•</span>
                      <span>{paperTotalMarks} marks</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {minutes} min
                      </span>
                    </div>
                    {prevAttempts.length > 0 && (
                      <p className={`text-xs mt-2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                        {prevAttempts.length} previous attempt{prevAttempts.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Exam Phase ───────────────────────────────────────────────────────────
  if (phase === "exam" && selectedPaper) {
    const q = selectedPaper.questions[currentQIdx] as PaperQuestion
    const mins = Math.floor(timeLeft / 60)
    const secs = timeLeft % 60
    const timeWarning = timeLeft < 300
    const timeExpired = timeLeft === 0
    const totalQ = selectedPaper.questions.length

    return (
      <div className="min-h-screen pb-40">
        {/* Fixed exam header */}
        <div
          className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b-2 ${
            isDarkMode ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-slate-100"
          } backdrop-blur-xl`}
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Exam Mode
              </p>
              <h2 className="font-black text-[#800000] dark:text-red-400 truncate">{selectedPaper.label}</h2>
            </div>
            <div
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 shrink-0 ${
                timeExpired
                  ? "bg-red-100 dark:bg-red-900/20 border-red-500 text-red-600 dark:text-red-400"
                  : timeWarning
                    ? "bg-amber-50 dark:bg-amber-900/20 border-amber-500 text-amber-700 dark:text-amber-400"
                    : isDarkMode
                      ? "bg-slate-800 border-slate-700 text-slate-200"
                      : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="font-black text-xl">
                {timeExpired ? "Time Up!" : `${mins}:${String(secs).padStart(2, "0")}`}
              </span>
            </div>
            <button
              onClick={() => setShowSubmitDialog(true)}
              className="shrink-0 px-6 py-2.5 bg-[#800000] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-800 transition-colors"
            >
              Submit Paper
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 pt-28 flex gap-6">
          {/* Question navigator */}
          <div className={`w-44 shrink-0 sticky top-28 self-start p-4 rounded-3xl border-2 ${cardBg}`}>
            <p className={`text-xs font-black uppercase tracking-widest mb-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Questions
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {selectedPaper.questions.map((_, idx) => {
                const isAttempted = attemptedQuestions.has(idx)
                const isCurrent = idx === currentQIdx
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQIdx(idx)}
                    className={`h-8 w-8 rounded-xl text-xs font-black transition-all ${
                      isCurrent
                        ? "bg-[#800000] text-white scale-110 shadow-lg"
                        : isAttempted
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700"
                          : isDarkMode
                            ? "bg-slate-700 text-slate-300 border border-slate-600"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
            <div className={`mt-4 space-y-1.5 text-[10px] font-bold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#800000] inline-block" />
                Current
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-200 dark:bg-emerald-800 inline-block" />
                Attempted
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded inline-block ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`} />
                Not yet
              </div>
            </div>
            <p className={`mt-4 text-[10px] font-black ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
              {attemptedQuestions.size}/{totalQ} attempted
            </p>
          </div>

          {/* Question display */}
          <div className="flex-1 min-w-0">
            <div className={`rounded-[2.5rem] p-8 shadow-xl border-2 mb-6 ${cardBg}`}>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-[#800000] dark:text-red-400">Q{currentQIdx + 1}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black ${
                      isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {q.subtopic || q.topic}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                  {q.type === "paper" ? q.parts.reduce((s, p) => s + p.marks, 0) : 1} marks
                </span>
              </div>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-8 leading-relaxed">{q.question}</p>
              {q.type === "paper" && (
                <div className="space-y-6">
                  {q.parts.map((part, pIdx) => (
                    <div
                      key={part.id}
                      className={`p-6 rounded-[2rem] border-2 ${
                        isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-100"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-full bg-[#800000] text-white flex items-center justify-center font-black text-xs shrink-0">
                            {part.id}
                          </span>
                          <p className="font-bold text-slate-700 dark:text-slate-200">{part.text}</p>
                        </div>
                        <span className="shrink-0 text-xs font-black px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full">
                          {part.marks} mark{part.marks !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <textarea
                        placeholder="Enter your answer here..."
                        className={`w-full p-4 rounded-2xl border-2 focus:ring-4 ring-red-500/10 focus:border-[#800000] outline-none transition-all font-medium resize-none ${
                          isDarkMode
                            ? "border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-500"
                            : "border-slate-200 bg-white text-slate-800 placeholder-slate-400"
                        }`}
                        rows={3}
                        value={examAnswers[`${currentQIdx}-${pIdx}`] || ""}
                        onChange={(e) =>
                          setExamAnswers((prev) => ({ ...prev, [`${currentQIdx}-${pIdx}`]: e.target.value }))
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                disabled={currentQIdx === 0}
                onClick={() => setCurrentQIdx((i) => i - 1)}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>
              <button
                disabled={currentQIdx === totalQ - 1}
                onClick={() => setCurrentQIdx((i) => i + 1)}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Submit confirmation dialog */}
        {showSubmitDialog && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div
              className={`w-full max-w-md rounded-[2.5rem] shadow-2xl border-4 border-[#800000] p-10 ${
                isDarkMode ? "bg-slate-900" : "bg-white"
              }`}
            >
              <h3 className="text-2xl font-black mb-2 text-center">Submit Paper?</h3>
              <div
                className={`text-center text-4xl font-black mb-6 ${timeWarning ? "text-amber-600" : "text-emerald-600"}`}
              >
                {mins}:{String(secs).padStart(2, "0")} remaining
              </div>
              <div className={`p-4 rounded-2xl mb-6 ${isDarkMode ? "bg-slate-800" : "bg-amber-50"}`}>
                <p className="font-black text-sm text-amber-700 dark:text-amber-400 mb-3">Before you submit, check:</p>
                <ul className={`text-sm space-y-2 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  <li>✓ All questions have been attempted</li>
                  <li>✓ Units are included in all numerical answers</li>
                  <li>✓ Working is shown for calculation questions</li>
                  <li>✓ You have reviewed any uncertain answers</li>
                </ul>
              </div>
              <p className={`text-xs text-center mb-6 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                Attempted: {attemptedQuestions.size} / {totalQ} questions
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitDialog(false)}
                  className={`flex-1 py-4 rounded-2xl font-black text-sm border-2 transition-colors ${
                    isDarkMode
                      ? "border-slate-700 hover:bg-slate-800"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Continue Exam
                </button>
                <button
                  onClick={() => {
                    setShowSubmitDialog(false)
                    submitExam()
                  }}
                  className="flex-1 py-4 bg-[#800000] text-white rounded-2xl font-black text-sm hover:bg-red-800 transition-colors"
                >
                  Submit Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Review Phase ─────────────────────────────────────────────────────────
  if (phase === "review" && selectedPaper) {
    return (
      <div className="pt-24 min-h-screen pb-36">
        <div className="max-w-4xl mx-auto px-6">
          {/* Sticky total banner */}
          <div
            className={`sticky top-20 z-30 flex items-center justify-between p-4 rounded-2xl shadow-lg mb-8 border-2 ${cardBg}`}
          >
            <div>
              <p className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Mark Your Paper
              </p>
              <p className="font-black text-lg">{selectedPaper.label}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-[#800000] dark:text-red-400">
                {totalEarned}
                <span className={`text-xl ${isDarkMode ? "text-slate-500" : "text-slate-300"}`}>/{totalMarks}</span>
              </p>
              <p className={`text-xs font-black ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{percentage}%</p>
            </div>
          </div>

          {/* Questions with marking scheme */}
          <div className="space-y-10">
            {selectedPaper.questions.map((q, qIdx) => {
              if (q.type !== "paper") return null
              const pq = q as PaperQuestion
              return (
                <div key={qIdx} className={`rounded-[2.5rem] p-8 border-2 shadow-xl ${cardBg}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl font-black text-[#800000] dark:text-red-400">Q{qIdx + 1}</span>
                    <span className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {pq.subtopic || pq.topic}
                    </span>
                  </div>
                  <p className="text-xl font-bold mb-8 leading-relaxed">{pq.question}</p>
                  {pq.parts.map((part, pIdx) => {
                    const key = `${qIdx}-${pIdx}`
                    const userAnswer = examAnswers[key]
                    const currentMark = examMarks[key] ?? 0
                    return (
                      <div
                        key={part.id}
                        className={`mb-6 p-6 rounded-[2rem] border-2 ${
                          isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-100"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-full bg-[#800000] text-white flex items-center justify-center font-black text-xs shrink-0">
                              {part.id}
                            </span>
                            <p className="font-bold text-slate-700 dark:text-slate-200">{part.text}</p>
                          </div>
                          <span className="shrink-0 text-xs font-black px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full">
                            {part.marks} mark{part.marks !== 1 ? "s" : ""}
                          </span>
                        </div>

                        {/* User's answer */}
                        {userAnswer ? (
                          <div
                            className={`p-4 rounded-xl mb-4 text-sm font-medium border ${
                              isDarkMode
                                ? "bg-slate-800 border-slate-700 text-slate-300"
                                : "bg-white border-slate-200 text-slate-700"
                            }`}
                          >
                            <p className={`text-xs font-black uppercase mb-1 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                              Your Answer:
                            </p>
                            <p>{userAnswer}</p>
                          </div>
                        ) : (
                          <div className={`p-4 rounded-xl mb-4 text-sm italic ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                            No answer provided
                          </div>
                        )}

                        {/* Model answer + marking scheme */}
                        <div className="p-4 bg-white dark:bg-slate-900 border-4 border-[#800000] rounded-[1.5rem] mb-4">
                          <div className="flex items-center gap-2 mb-2 text-[#800000]">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-xs font-black uppercase tracking-widest">Model Answer</span>
                          </div>
                          <p className="text-[#800000] dark:text-red-400 font-black text-lg leading-snug mb-3">
                            {part.answer}
                          </p>
                          <div
                            className={`text-xs italic border-l-4 border-amber-500 pl-3 py-1 ${
                              isDarkMode ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            <span className="not-italic font-black text-slate-700 dark:text-slate-300 block mb-1">
                              SQA Marking Instructions:
                            </span>
                            {part.markingScheme}
                          </div>
                        </div>

                        {/* Mark selector */}
                        <div>
                          <p className="text-xs font-black uppercase mb-2 text-slate-400">
                            Award marks:
                          </p>
                          <div className="flex gap-2">
                            {[...Array(part.marks + 1)].map((_, mIdx) => (
                              <button
                                key={mIdx}
                                onClick={() => setExamMarks((prev) => ({ ...prev, [key]: mIdx }))}
                                className={`w-10 h-10 rounded-xl font-black text-sm transition-all border-2 ${
                                  currentMark === mIdx
                                    ? "bg-amber-500 text-white border-amber-600 scale-110 shadow-md"
                                    : isDarkMode
                                      ? "bg-slate-800 border-slate-700 hover:border-amber-500"
                                      : "bg-white border-slate-200 hover:border-amber-500"
                                }`}
                              >
                                {mIdx}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          {/* Fixed finalize bar */}
          <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center z-40">
            <div
              className={`flex items-center gap-6 px-8 py-4 rounded-[2rem] shadow-2xl border-2 ${
                isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
              }`}
            >
              <div className="text-right">
                <p className="text-xs font-black uppercase text-slate-400">Total</p>
                <p className="text-2xl font-black">
                  {totalEarned}
                  <span className={isDarkMode ? "text-slate-500" : "text-slate-400"}>/{totalMarks}</span>
                </p>
              </div>
              <button
                onClick={() => {
                  saveAttempt()
                  setPhase("results")
                }}
                className="px-10 py-4 bg-[#800000] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-800 transition-colors"
              >
                Finalise Results
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Results Phase ────────────────────────────────────────────────────────
  if (phase === "results" && selectedPaper) {
    const gradeColor =
      grade === "A"
        ? "text-amber-500"
        : grade === "B"
          ? "text-emerald-600"
          : grade === "C"
            ? "text-blue-600"
            : grade === "D"
              ? "text-amber-700"
              : "text-red-600"
    const strengths = topicBreakdown.filter((t) => t.pct >= 70)
    const weaknesses = topicBreakdown.filter((t) => t.pct < 50)
    const takenMins = Math.floor(timeTaken / 60)
    const takenSecs = timeTaken % 60

    return (
      <div className="pt-24 min-h-screen pb-20 animate-in fade-in zoom-in-95">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block p-8 rounded-[2rem] bg-red-50 dark:bg-red-950/20 mb-6 border-4 border-[#800000] shadow-2xl">
              <Award className="w-16 h-16 text-[#800000]" />
            </div>
            <h1 className="text-5xl font-black mb-3">{selectedPaper.label}</h1>
            <p className={`font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Exam Complete
            </p>
          </div>

          {/* Grade cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Grade", value: grade, color: gradeColor },
              { label: "Marks", value: `${totalEarned}/${totalMarks}`, color: isDarkMode ? "text-white" : "text-slate-800" },
              { label: "Percentage", value: `${percentage}%`, color: "text-[#800000] dark:text-red-400" },
              {
                label: "Time Taken",
                value: `${takenMins}:${String(takenSecs).padStart(2, "0")}`,
                color: isDarkMode ? "text-slate-300" : "text-slate-600",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className={`p-6 rounded-[2rem] border-2 text-center ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-xl"}`}
              >
                <p className="text-xs font-black uppercase tracking-widest mb-2 text-slate-400">
                  {label}
                </p>
                <p className={`text-3xl font-black ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Grade boundaries */}
          <div className={`p-6 rounded-3xl border-2 mb-8 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <p className="text-xs font-black uppercase tracking-widest mb-4 text-slate-400">
              Grade Boundaries
            </p>
            <div className="flex gap-2">
              {[
                { label: "A", range: "70%+", active: grade === "A", color: "bg-amber-500" },
                { label: "B", range: "60–69%", active: grade === "B", color: "bg-emerald-500" },
                { label: "C", range: "50–59%", active: grade === "C", color: "bg-blue-500" },
                { label: "D", range: "40–49%", active: grade === "D", color: "bg-amber-600" },
                { label: "NA", range: "<40%", active: grade === "NA", color: "bg-red-500" },
              ].map(({ label, range, active, color }) => (
                <div
                  key={label}
                  className={`flex-1 p-3 rounded-2xl text-center border-2 transition-all ${
                    active
                      ? `${color} text-white border-transparent scale-105 shadow-md`
                      : isDarkMode
                        ? "border-slate-700 text-slate-400"
                        : "border-slate-100 text-slate-400"
                  }`}
                >
                  <p className="font-black text-lg">{label}</p>
                  <p className="text-xs">{range}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Topic breakdown */}
          <div className={`p-8 rounded-3xl border-2 mb-8 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <h3 className="font-black text-lg mb-6 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-amber-500" />
              Topic Breakdown
            </h3>
            <div className="space-y-4">
              {topicBreakdown.map(({ topic, earned, total, pct: topicPct }) => (
                <div key={topic}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold">{topic}</span>
                    <span
                      className={`text-sm font-black ${
                        topicPct >= 70 ? "text-emerald-600" : topicPct >= 50 ? "text-amber-600" : "text-red-600"
                      }`}
                    >
                      {earned}/{total} ({topicPct}%)
                    </span>
                  </div>
                  <div className={`h-2.5 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-slate-100"}`}>
                    <div
                      className={`h-full rounded-full transition-all ${
                        topicPct >= 70 ? "bg-emerald-500" : topicPct >= 50 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${topicPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths and Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className={`p-6 rounded-3xl border-2 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <h4 className="font-black text-sm uppercase tracking-widest text-emerald-600 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Strengths
              </h4>
              {strengths.length > 0 ? (
                <ul className="space-y-2">
                  {strengths.map((t) => (
                    <li key={t.topic} className="flex items-center gap-2 text-sm font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {t.topic} ({t.pct}%)
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-400"}`}>Keep practising to build strengths!</p>
              )}
            </div>
            <div className={`p-6 rounded-3xl border-2 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <h4 className="font-black text-sm uppercase tracking-widest text-red-600 mb-4 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Areas to Improve
              </h4>
              {weaknesses.length > 0 ? (
                <ul className="space-y-2">
                  {weaknesses.map((t) => (
                    <li key={t.topic} className="flex items-center gap-2 text-sm font-bold text-red-600 dark:text-red-400">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      {t.topic} ({t.pct}%)
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-400"}`}>No significant weaknesses — great work!</p>
              )}
            </div>
          </div>

          {currentUserId && (
            <div
              className={`p-4 rounded-2xl border mb-8 text-center ${
                isDarkMode
                  ? "bg-emerald-900/20 border-emerald-800 text-emerald-400"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}
            >
              <CheckCircle2 className="w-5 h-5 inline mr-2" />
              <span className="text-sm font-bold">Results saved to your progress summary</span>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setPhase("hub")}
              className={`px-8 py-4 rounded-2xl font-black border-2 transition-colors ${
                isDarkMode ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              Back to Papers
            </button>
            <button
              onClick={() => setPhase("review")}
              className="px-8 py-4 bg-[#800000] text-white rounded-2xl font-black hover:bg-red-800 transition-colors"
            >
              Review Answers
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

// ─── ElectronicsToolMode ──────────────────────────────────────────────────────

type ElectronicsToolAppMode = "stripboarding" | "block-diagrams" | "logic-gates" | "testing" | "symbols" | "costing"

const ELECTRONICS_TOOL_MODES: { id: ElectronicsToolAppMode; icon: React.ElementType; title: string; desc: string }[] = [
  { id: "stripboarding", icon: LayoutGrid, title: "Stripboarding", desc: "Plan and lay out stripboard circuits" },
  { id: "block-diagrams", icon: Workflow, title: "Block Diagrams", desc: "System block diagram practice" },
  { id: "logic-gates", icon: GitFork, title: "Logic Gates", desc: "Boolean logic and gate circuits" },
  { id: "testing", icon: FlaskConical, title: "Testing", desc: "Circuit testing and fault finding" },
  { id: "symbols", icon: Sigma, title: "Symbols", desc: "Electronic component symbols" },
  { id: "costing", icon: PoundSterling, title: "Costing", desc: "Component costing and budgeting" },
]

function ElectronicsToolMode({
  appMode,
  onBack,
  isDarkMode,
}: {
  appMode: AppMode
  onBack: () => void
  isDarkMode: boolean
}) {
  const info = ELECTRONICS_TOOL_MODES.find((m) => m.id === appMode) ?? null

  return (
    <div className="pt-24 min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in slide-in-from-right-4">
      <div className="max-w-2xl w-full">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-[#800000] mb-8 mx-auto font-bold uppercase text-xs tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Modes
        </button>
        {info && (
          <div
            className={`p-16 rounded-3xl border-2 ${
              isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-xl"
            }`}
          >
            <div
              className={`inline-flex p-6 rounded-2xl mb-8 ${
                isDarkMode ? "bg-slate-700 text-amber-500" : "bg-red-50 text-[#800000]"
              }`}
            >
              <info.icon className="w-16 h-16" />
            </div>
            <h2 className="text-4xl font-black mb-4">{info.title}</h2>
            <p className={`text-lg mb-8 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>{info.desc}</p>
            <div
              className={`inline-block px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest border-2 ${
                isDarkMode
                  ? "bg-amber-900/20 border-amber-700 text-amber-400"
                  : "bg-amber-50 border-amber-300 text-amber-700"
              }`}
            >
              Coming Soon
            </div>
            <p className={`mt-4 text-sm ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
              This section is under development and will be available shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}


function ModeSelection({
  onSelectMode,
  onBack,
  selectedLevel,
  selectedSubject,
  isDarkMode,
}: {
  onSelectMode: (mode: AppMode) => void
  onBack: () => void
  selectedLevel: string
  selectedSubject: SubjectId
  isDarkMode: boolean
}) {
  const [comingSoonMode, setComingSoonMode] = React.useState<string | null>(null)

  const allModes = [
    { id: "mc" as const, icon: MousePointer2, title: "Multiple Choice", desc: "Quick-fire recall testing", comingSoon: false },
    { id: "paper" as const, icon: FileText, title: "Paper Questions", desc: "Exam-style written problems", comingSoon: false },
    { id: "retrieval" as const, icon: Sparkles, title: "Retrieval", desc: "Active recall practice", comingSoon: false },
    { id: "definitions" as const, icon: FileText, title: "Definitions", desc: "Key terms and concepts", comingSoon: false },
    { id: "calculations" as const, icon: Zap, title: "Calculations", desc: "Numerical problem solving", comingSoon: false },
    { id: "assignment" as const, icon: ClipboardList, title: "Assignment", desc: "Structured task practice", comingSoon: false },
    { id: "practice" as const, icon: BookOpen, title: "Practice", desc: "Progress-based adaptive practice", comingSoon: false },
    { id: "exam-paper" as const, icon: Award, title: "Exam Mode", desc: "Full past paper under timed conditions", comingSoon: false },
  ]

  const biologyModes = [
    { id: "mc" as const, icon: MousePointer2, title: "Multiple Choice", desc: "Quick-fire recall testing", comingSoon: false },
    { id: "paper" as const, icon: FileText, title: "Paper Questions", desc: "Exam-style written problems", comingSoon: false },
    { id: "retrieval" as const, icon: Sparkles, title: "Retrieval", desc: "Active recall practice", comingSoon: false },
    { id: "definitions" as const, icon: FileText, title: "Definitions", desc: "Key terms and concepts", comingSoon: false },
    { id: "problem-solving" as const, icon: FlaskConical, title: "Problem Solving", desc: "Guided biology problem solving practice", comingSoon: true },
    { id: "essay" as const, icon: Pencil, title: "Essay Questions", desc: "Structured essay writing practice", comingSoon: true },
    { id: "assignment" as const, icon: ClipboardList, title: "Assignment", desc: "Structured task practice", comingSoon: false },
    { id: "practice" as const, icon: BookOpen, title: "Practice", desc: "Progress-based adaptive practice", comingSoon: false },
    { id: "exam-paper" as const, icon: Award, title: "Exam Mode", desc: "Full past paper under timed conditions", comingSoon: false },
  ]

  const electronicsModes = [
    { id: "mc" as const, icon: MousePointer2, title: "Multiple Choice", desc: "Quick-fire recall testing", comingSoon: false },
    { id: "exam-paper" as const, icon: Award, title: "Past Papers", desc: "Full past paper under timed conditions", comingSoon: false },
    { id: "calculations" as const, icon: Zap, title: "Calculations", desc: "Numerical problem solving", comingSoon: false },
    ...ELECTRONICS_TOOL_MODES.map((m) => ({ ...m, comingSoon: false })),
  ]

  const modes =
    selectedSubject === "Biology"
      ? biologyModes
      : selectedSubject === "Practical Electronics"
      ? electronicsModes
      : allModes

  function handleModeClick(mode: { id: AppMode; title: string; comingSoon: boolean }) {
    if (mode.comingSoon) {
      setComingSoonMode(mode.title)
    } else {
      onSelectMode(mode.id)
    }
  }

  return (
    <div className="pt-24 min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in slide-in-from-right-4">
      <div className="max-w-4xl w-full">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-[#800000] mb-8 mx-auto font-bold uppercase text-xs tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" />
          Change Level
        </button>
        <h2 className="text-4xl md:text-5xl font-black mb-4">Select Practice Mode</h2>
        <p className={`text-lg mb-12 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
          Prepare for your <span className="text-amber-600 font-bold">{selectedLevel}</span> prelims.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleModeClick(mode)}
              className={`group flex flex-col items-center p-10 rounded-3xl transition-all text-center relative overflow-hidden border-2 ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 hover:border-amber-500"
                  : "bg-white border-slate-200 hover:border-[#800000] shadow-xl"
              }`}
            >
              <div
                className={`p-5 rounded-2xl mb-6 transition-colors ${
                  isDarkMode ? "bg-slate-700 text-amber-500" : "bg-red-50 text-[#800000]"
                }`}
              >
                <mode.icon className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black mb-2">{mode.title}</h3>
              <p className="text-sm opacity-70 font-medium">{mode.desc}</p>
              {mode.comingSoon && (
                <div className="mt-3 inline-block px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest border border-amber-200 dark:border-amber-700">
                  Coming Soon
                </div>
              )}
              <div className="absolute top-0 right-0 p-4 transition-opacity opacity-5 group-hover:opacity-10">
                <mode.icon className="w-24 h-24" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Coming Soon popup for modes under development */}
      {comingSoonMode && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-3xl shadow-2xl border-4 border-amber-500 p-8 text-center animate-in fade-in zoom-in-95 ${isDarkMode ? "bg-slate-900" : "bg-white"}`}>
            <div className="text-5xl mb-4">🚧</div>
            <h2 className="text-2xl font-black mb-3">{comingSoonMode} — Coming Soon!</h2>
            <p className={`text-sm mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              <strong>{comingSoonMode}</strong> is currently under development and will be available shortly. Stay tuned!
            </p>
            <button
              onClick={() => setComingSoonMode(null)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm transition-colors"
            >
              OK, got it!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

interface WeakTopic {
  topic: string
  score: number
}

function SetupView({
  selectedLevel,
  selectedSubject,
  appMode,
  onGenerate,
  isGenerating,
  onBack,
  includeALevel,
  setIncludeALevel,
  includeOpenEnded,
  setIncludeOpenEnded,
  includeMultiTopic,
  setIncludeMultiTopic,
  isDarkMode,
  weakTopics,
  userCoverage,
  topicPerformance,
  timingMode,
  setTimingMode,
  numberOfQuestions,
  setNumberOfQuestions,
  questionSource,
  setQuestionSource,
  availablePastPapers,
}: {
  selectedLevel: string
  selectedSubject: SubjectId
  appMode: AppMode
  onGenerate: (topics: string) => void
  isGenerating: boolean
  onBack: () => void
  includeALevel: boolean
  setIncludeALevel: (val: boolean) => void
  includeOpenEnded: boolean
  setIncludeOpenEnded: (val: boolean) => void
  includeMultiTopic: boolean
  setIncludeMultiTopic: (val: boolean) => void
  isDarkMode: boolean
  weakTopics: WeakTopic[]
  userCoverage: Record<string, boolean>
  topicPerformance: Record<string, { correct: number; total: number }>
  timingMode: TimingMode
  setTimingMode: (val: TimingMode) => void
  numberOfQuestions: number
  setNumberOfQuestions: (val: number) => void
  questionSource: string
  setQuestionSource: (val: string) => void
  availablePastPapers: PastPaperMeta[]
}) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const subtopics = getSubtopics(selectedSubject, selectedLevel)
  const isPracticeOrMC = appMode === "mc" || appMode === "practice"
  const topicsToShow = subtopics

  const timingOptions: { value: TimingMode; label: string; desc: string }[] =
    selectedSubject === "Chemistry" || selectedSubject === "Biology"
      ? [
          { value: "none", label: "No Time Limit", desc: "Take as long as you need" },
          { value: "relaxed", label: "Relaxed", desc: "0.44 marks per minute (~2 min 16 sec/mark)" },
          { value: "exam", label: "Exam Conditions", desc: "0.67 marks per minute (~90 sec/mark)" },
        ]
      : selectedSubject === "Practical Electronics"
      ? [
          { value: "relaxed", label: "Relaxed", desc: "0.67 marks per minute (~90 sec/mark)" },
          { value: "exam", label: "Exam Conditions", desc: "1 mark per minute (60 sec/mark)" },
        ]
      : [
          { value: "none", label: "No Time Limit", desc: "Take as long as you need" },
          { value: "relaxed", label: "Relaxed", desc: "0.5 marks per minute (2 min/mark)" },
          { value: "exam", label: "Exam Conditions", desc: "0.9 marks per minute (~67 sec/mark)" },
        ]

  // Auto-select topics from coverage for retrieval mode
  useEffect(() => {
    if (appMode === "retrieval") {
      const selectedFromCoverage = subtopics.filter(t => userCoverage[t])
      setSelectedTopics(selectedFromCoverage)
    }
  }, [appMode, subtopics, userCoverage])

  // Auto-select topics for practice mode based on performance < 50%
  useEffect(() => {
    if (appMode === "practice") {
      const practiceTopics = subtopics.filter(t => {
        const perf = topicPerformance[t]
        if (!perf || perf.total === 0) return true
        return (perf.correct / perf.total) * 100 < 50
      })
      setSelectedTopics(practiceTopics.length > 0 ? practiceTopics : subtopics)
    }
  }, [appMode, subtopics, topicPerformance])

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]))
  }

  return (
    <div className="pt-24 max-w-4xl mx-auto p-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-[#800000] font-bold uppercase text-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          Mode selection
        </button>
        <h2 className="text-3xl font-black">Configure Topics</h2>
        <div className="w-20" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8 pb-32">
        <div className="lg:col-span-2 space-y-8">
          {appMode !== "retrieval" && appMode !== "practice" && (
            <section
              className={`p-8 rounded-3xl shadow-sm border ${
                isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
              }`}
            >
              <h3 className="text-lg font-black mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Study Units
                </div>
                {selectedTopics.length > 0 && (
                  <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-[#800000] dark:text-red-400 px-3 py-1 rounded-full font-black uppercase">
                    {selectedTopics.length} Focus areas
                  </span>
                )}
              </h3>
              <div className="flex flex-wrap gap-2">
                {topicsToShow.map((topic) => {
                  const isSelected = selectedTopics.includes(topic)
                  return (
                    <button
                      key={topic}
                      onClick={() => toggleTopic(topic)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                        isSelected
                          ? "border-[#800000] bg-[#800000] text-white shadow-lg"
                          : isDarkMode
                            ? "border-slate-700 hover:border-amber-500 hover:text-amber-600 bg-slate-900"
                            : "border-slate-100 hover:border-amber-500 hover:text-amber-600 bg-white"
                      }`}
                    >
                      {topic}
                    </button>
                  )
                })}
              </div>
            </section>
          )}
          {appMode === "retrieval" && (
            <section className={`p-8 rounded-3xl shadow-sm border ${
              isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            }`}>
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Topics from Coverage
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Topics are automatically selected from your Coverage settings below.</p>
              <div className="flex flex-wrap gap-2">
                {selectedTopics.map((topic) => (
                  <span
                    key={topic}
                    className="px-4 py-2 rounded-xl text-sm font-bold border-2 border-[#800000] bg-[#800000] text-white shadow-lg"
                  >
                    {topic}
                  </span>
                ))}
                {selectedTopics.length === 0 && (
                  <p className="text-sm text-slate-500 italic">Select topics from Coverage below to begin</p>
                )}
              </div>
            </section>
          )}
          {appMode === "practice" && (
            <section className={`p-8 rounded-3xl shadow-sm border ${
              isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            }`}>
              <h3 className="text-lg font-black mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                Practice Topics
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Topics are automatically selected where your progress is below 50%. Topics not yet attempted are also included.
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedTopics.map((topic) => (
                  <span
                    key={topic}
                    className="px-4 py-2 rounded-xl text-sm font-bold border-2 border-[#800000] bg-[#800000] text-white shadow-lg"
                  >
                    {topic}
                  </span>
                ))}
                {selectedTopics.length === 0 && (
                  <p className="text-sm text-slate-500 italic">No topics below 50% found — all topics are included.</p>
                )}
              </div>
            </section>
          )}
          <section
            className={`p-8 rounded-3xl shadow-sm border ${
              isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            }`}
          >
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-slate-400" />
              Assessment Depth
            </h3>
            <div className="space-y-4">
              <label
                className={`group flex items-center justify-between p-5 rounded-2xl ${
                  isPracticeOrMC ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                } transition-colors border border-transparent ${
                  isDarkMode
                    ? "bg-slate-900 hover:bg-red-950/20 hover:border-[#800000]/20"
                    : "bg-slate-50 hover:bg-red-50 hover:border-[#800000]/20"
                }`}
              >
                <div>
                  <p className="font-black text-slate-800 dark:text-white">A-Level Challenge</p>
                  <p className="text-xs text-slate-500">
                    {isPracticeOrMC
                      ? "Not applicable in this mode"
                      : "Include challenge questions beyond core syllabus"}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isPracticeOrMC ? false : includeALevel}
                  onChange={(e) => !isPracticeOrMC && setIncludeALevel(e.target.checked)}
                  disabled={isPracticeOrMC}
                  className="w-6 h-6 rounded-lg accent-[#800000]"
                />
              </label>
              {selectedSubject !== "Biology" && (
              <label
                className={`group flex items-center justify-between p-5 rounded-2xl ${
                  isPracticeOrMC ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                } transition-colors border border-transparent ${
                  isDarkMode
                    ? "bg-slate-900 hover:bg-red-950/20 hover:border-[#800000]/20"
                    : "bg-slate-50 hover:bg-red-50 hover:border-[#800000]/20"
                }`}
              >
                <div>
                  <p className="font-black text-slate-800 dark:text-white">Open Ended</p>
                  <p className="text-xs text-slate-500">
                    {isPracticeOrMC
                      ? "Not applicable in this mode"
                      : "Include open-ended problem solving questions"}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isPracticeOrMC ? false : includeOpenEnded}
                  onChange={(e) => !isPracticeOrMC && setIncludeOpenEnded(e.target.checked)}
                  disabled={isPracticeOrMC}
                  className="w-6 h-6 rounded-lg accent-[#800000]"
                />
              </label>
              )}
              <label
                className={`group flex items-center justify-between p-5 rounded-2xl ${
                  appMode === "retrieval" || isPracticeOrMC ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                } transition-colors border border-transparent ${
                  isDarkMode
                    ? "bg-slate-900 hover:bg-red-950/20 hover:border-[#800000]/20"
                    : "bg-slate-50 hover:bg-red-50 hover:border-[#800000]/20"
                }`}
              >
                <div>
                  <p className="font-black text-slate-800 dark:text-white">Multi-topic</p>
                  <p className="text-xs text-slate-500">
                    {appMode === "retrieval"
                      ? "Automatically enabled for Retrieval practice"
                      : isPracticeOrMC
                      ? "Not applicable in this mode"
                      : "Cross-topic application and problem solving"}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={appMode === "retrieval" ? true : !isPracticeOrMC && includeMultiTopic}
                  onChange={(e) => appMode !== "retrieval" && !isPracticeOrMC && setIncludeMultiTopic(e.target.checked)}
                  disabled={appMode === "retrieval" || isPracticeOrMC}
                  className="w-6 h-6 rounded-lg accent-[#800000]"
                />
              </label>
            </div>
          </section>

          <section
            className={`p-8 rounded-3xl shadow-sm border ${
              isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            }`}
          >
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Timing
            </h3>
            <div className="space-y-3">
              {timingOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-colors border ${
                    timingMode === option.value
                      ? "border-[#800000] bg-red-50 dark:bg-red-950/20"
                      : isDarkMode
                        ? "border-slate-700 bg-slate-900 hover:border-slate-600"
                        : "border-slate-100 bg-slate-50 hover:border-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="timingMode"
                    value={option.value}
                    checked={timingMode === option.value}
                    onChange={() => setTimingMode(option.value)}
                    className="accent-[#800000]"
                  />
                  <div>
                    <p className="font-black text-sm text-slate-800 dark:text-white">{option.label}</p>
                    <p className="text-xs text-slate-500">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <section
            className={`p-8 rounded-3xl shadow-sm border ${
              isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            }`}
          >
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-slate-400" />
              Number of Questions
            </h3>
            <p className="text-xs text-slate-500 mb-4">Select how many full questions to include in this assessment.</p>
            <div className="flex flex-wrap gap-3">
              {[1, 3, 5, 10, 15].map((n) => (
                <button
                  key={n}
                  onClick={() => setNumberOfQuestions(n)}
                  className={`w-14 h-14 rounded-2xl font-black text-lg border-2 transition-all ${
                    numberOfQuestions === n
                      ? "bg-[#800000] text-white border-amber-500 shadow-lg scale-105"
                      : isDarkMode
                        ? "bg-slate-900 border-slate-700 hover:border-amber-500 hover:text-amber-500"
                        : "bg-white border-slate-200 hover:border-[#800000] hover:text-[#800000]"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          {appMode === "practice" ? (
            <div className="bg-[#800000] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <h3 className="font-black text-lg uppercase tracking-tighter italic">Auto-selected</h3>
                </div>
                <p className="text-xs text-red-200 mb-4 font-medium">
                  Practice mode targets areas where your progress is below 50%. Topics not yet attempted are automatically included.
                </p>
                <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                  <p className="text-sm font-bold text-red-100">
                    {selectedTopics.length > 0
                      ? `${selectedTopics.length} topic${selectedTopics.length !== 1 ? "s" : ""} selected for practice`
                      : "All topics included for practice"}
                  </p>
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-10">
                <Atom className="w-32 h-32" />
              </div>
            </div>
          ) : (
            <div className="bg-[#800000] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <h3 className="font-black text-lg uppercase tracking-tighter italic">Needs Revision</h3>
                </div>
                <p className="text-xs text-red-200 mb-6 font-medium">
                  Based on your recent performance, focus on these areas:
                </p>
                <div className="space-y-3">
                  {weakTopics.length > 0 ? (
                    weakTopics.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => toggleTopic(item.topic)}
                        className={`w-full p-4 rounded-xl text-left transition-all border font-bold text-sm ${
                          selectedTopics.includes(item.topic)
                            ? "bg-amber-500 text-white border-amber-400"
                            : "bg-white/10 hover:bg-white/20 border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{item.topic}</span>
                          <span className="text-xs opacity-70">{item.score}%</span>
                        </div>
                        <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-400 rounded-full" 
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-red-200 italic">
                      Complete some quizzes to see your weak areas here.
                    </p>
                  )}
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-10">
                <Atom className="w-32 h-32" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-6 flex justify-center pointer-events-none z-50">
        <button
          disabled={selectedTopics.length === 0}
          onClick={() => onGenerate(selectedTopics.join(","))}
          className={`pointer-events-auto px-12 py-5 rounded-full font-black text-xl shadow-2xl transition-all flex items-center gap-3 border-4 ${
            selectedTopics.length > 0
              ? "bg-[#800000] text-white border-amber-500 hover:scale-105 active:scale-95"
              : "bg-slate-200 dark:bg-slate-800 text-slate-400 border-transparent cursor-not-allowed opacity-50"
          }`}
        >
          {isGenerating ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Zap className="w-6 h-6 fill-amber-400 text-amber-400" />
          )}
          {isGenerating ? "Prepping Papers..." : "Start Assessment"}
        </button>
      </div>

      {isGenerating && (
        <div className="fixed inset-0 bg-[#800000]/20 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div
            className={`p-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 max-w-sm text-center border-4 border-[#800000] ${
              isDarkMode ? "bg-slate-800" : "bg-white"
            }`}
          >
            <div className="relative">
              <div className="w-24 h-24 border-8 border-amber-500/20 border-t-[#800000] rounded-full animate-spin" />
              <Atom className="w-12 h-12 text-[#800000] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div>
              <h3 className="text-3xl font-black mb-2 text-[#800000] dark:text-white">Generating...</h3>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                Curating Trinity Physics Resources
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

type DrawingTool = "pen" | "line" | "circle" | "square" | "label" | "eraser"

interface DrawingElement {
  type: DrawingTool
  points?: { x: number; y: number }[]
  start?: { x: number; y: number }
  end?: { x: number; y: number }
  text?: string
  color: string
  lineWidth: number
}

function Whiteboard({
  isOpen,
  onClose,
  isDarkMode,
  onSubmit,
}: {
  isOpen: boolean
  onClose: () => void
  isDarkMode: boolean
  onSubmit?: (drawingData: string) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tool, setTool] = useState<DrawingTool>("pen")
  const [isDrawing, setIsDrawing] = useState(false)
  const [elements, setElements] = useState<DrawingElement[]>([])
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null)
  const [color, setColor] = useState("#800000")
  const [lineWidth, setLineWidth] = useState(3)
  const [labelText, setLabelText] = useState("")
  const [labelPosition, setLabelPosition] = useState<{ x: number; y: number } | null>(null)
  const [showGrid, setShowGrid] = useState(false)

  const canvasWidth = 1000
  const canvasHeight = 600

  const getCanvasCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }, [])

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    const gridSize = 25
    ctx.strokeStyle = isDarkMode ? "#334155" : "#e2e8f0"
    ctx.lineWidth = 1

    // Draw vertical lines
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvasHeight)
      ctx.stroke()
    }

    // Draw horizontal lines
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvasWidth, y)
      ctx.stroke()
    }

    // Draw thicker lines for major gridlines (every 5 squares)
    ctx.strokeStyle = isDarkMode ? "#475569" : "#cbd5e1"
    ctx.lineWidth = 1.5
    for (let x = 0; x <= canvasWidth; x += gridSize * 5) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvasHeight)
      ctx.stroke()
    }
    for (let y = 0; y <= canvasHeight; y += gridSize * 5) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvasWidth, y)
      ctx.stroke()
    }
  }, [isDarkMode])

  const drawElement = useCallback((ctx: CanvasRenderingContext2D, el: DrawingElement) => {
    ctx.strokeStyle = el.color
    ctx.fillStyle = el.color
    ctx.lineWidth = el.lineWidth
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    if (el.type === "pen" && el.points && el.points.length > 1) {
      ctx.beginPath()
      ctx.moveTo(el.points[0].x, el.points[0].y)
      for (let i = 1; i < el.points.length; i++) {
        ctx.lineTo(el.points[i].x, el.points[i].y)
      }
      ctx.stroke()
    } else if (el.type === "eraser" && el.points && el.points.length > 1) {
      ctx.strokeStyle = isDarkMode ? "#1e293b" : "#ffffff"
      ctx.lineWidth = el.lineWidth * 4
      ctx.beginPath()
      ctx.moveTo(el.points[0].x, el.points[0].y)
      for (let i = 1; i < el.points.length; i++) {
        ctx.lineTo(el.points[i].x, el.points[i].y)
      }
      ctx.stroke()
    } else if (el.type === "line" && el.start && el.end) {
      ctx.beginPath()
      ctx.moveTo(el.start.x, el.start.y)
      ctx.lineTo(el.end.x, el.end.y)
      ctx.stroke()
    } else if (el.type === "circle" && el.start && el.end) {
      const radius = Math.sqrt(Math.pow(el.end.x - el.start.x, 2) + Math.pow(el.end.y - el.start.y, 2))
      ctx.beginPath()
      ctx.arc(el.start.x, el.start.y, radius, 0, Math.PI * 2)
      ctx.stroke()
    } else if (el.type === "square" && el.start && el.end) {
      const width = el.end.x - el.start.x
      const height = el.end.y - el.start.y
      ctx.beginPath()
      ctx.strokeRect(el.start.x, el.start.y, width, height)
    } else if (el.type === "label" && el.start && el.text) {
      ctx.font = `bold ${el.lineWidth * 6}px sans-serif`
      ctx.fillText(el.text, el.start.x, el.start.y)
    }
  }, [isDarkMode])

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = isDarkMode ? "#1e293b" : "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (showGrid) {
      drawGrid(ctx)
    }

    elements.forEach((el) => drawElement(ctx, el))
    if (currentElement) {
      drawElement(ctx, currentElement)
    }
  }, [elements, currentElement, drawElement, isDarkMode, showGrid, drawGrid])

  useEffect(() => {
    redrawCanvas()
  }, [redrawCanvas])

  const handleStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const coords = getCanvasCoords(e)

    if (tool === "label") {
      setLabelPosition(coords)
      return
    }

    setIsDrawing(true)

    if (tool === "pen" || tool === "eraser") {
      setCurrentElement({
        type: tool,
        points: [coords],
        color,
        lineWidth,
      })
    } else {
      setCurrentElement({
        type: tool,
        start: coords,
        end: coords,
        color,
        lineWidth,
      })
    }
  }

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentElement) return
    e.preventDefault()
    const coords = getCanvasCoords(e)

    if (tool === "pen" || tool === "eraser") {
      setCurrentElement({
        ...currentElement,
        points: [...(currentElement.points || []), coords],
      })
    } else {
      setCurrentElement({
        ...currentElement,
        end: coords,
      })
    }
  }

  const handleEnd = () => {
    if (!isDrawing || !currentElement) return
    setIsDrawing(false)
    setElements([...elements, currentElement])
    setCurrentElement(null)
  }

  const handleLabelSubmit = () => {
    if (!labelPosition || !labelText.trim()) {
      setLabelPosition(null)
      setLabelText("")
      return
    }

    const newElement: DrawingElement = {
      type: "label",
      start: labelPosition,
      text: labelText,
      color,
      lineWidth,
    }
    setElements([...elements, newElement])
    setLabelPosition(null)
    setLabelText("")
  }

  const clearCanvas = () => {
    setElements([])
    setCurrentElement(null)
  }

  const handleSubmitDrawing = () => {
    const canvas = canvasRef.current
    if (!canvas || !onSubmit) return
    const drawingData = canvas.toDataURL("image/png")
    onSubmit(drawingData)
    onClose()
  }

  const tools: { id: DrawingTool; icon: typeof Pencil; label: string }[] = [
    { id: "pen", icon: Pencil, label: "Free Draw" },
    { id: "line", icon: Minus, label: "Line" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "square", icon: Square, label: "Square" },
    { id: "label", icon: Type, label: "Label" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
  ]

  const colors = ["#800000", "#000000", "#2563eb", "#16a34a", "#d97706", "#dc2626"]

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border-4 ${
          isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-[#800000]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDarkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-gradient-to-r from-[#800000] to-[#a00000]"
        }`}>
          <h3 className={`text-xl font-black uppercase tracking-tight ${isDarkMode ? "text-white" : "text-white"}`}>
            Drawing Canvas
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-white/20 text-white"
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Toolbar */}
        <div
          className={`px-6 py-4 border-b flex flex-wrap items-center gap-3 ${
            isDarkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"
          }`}
        >
          {/* Drawing Tools */}
          <div className={`flex gap-1 p-1 rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-white shadow-sm"}`}>
            {tools.map((t) => (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                title={t.label}
                className={`p-2.5 rounded-lg transition-all ${
                  tool === t.id
                    ? "bg-[#800000] text-white shadow-lg"
                    : isDarkMode
                      ? "hover:bg-slate-700 text-slate-300"
                      : "hover:bg-slate-100 text-slate-600"
                }`}
              >
                <t.icon className="w-5 h-5" />
              </button>
            ))}
          </div>

          <div className="w-px h-8 bg-slate-300 dark:bg-slate-600" />

          {/* Colors */}
          <div className={`flex gap-1.5 p-2 rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-white shadow-sm"}`}>
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full transition-all border-2 ${
                  color === c 
                    ? "ring-2 ring-offset-2 ring-[#800000] scale-110 border-white" 
                    : "hover:scale-110 border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="w-px h-8 bg-slate-300 dark:bg-slate-600" />

          {/* Line Width */}
          <div className={`flex items-center gap-3 px-4 py-2 rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-white shadow-sm"}`}>
            <span className="text-xs font-bold text-slate-500 uppercase">Size</span>
            <input
              type="range"
              min="1"
              max="10"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-24 accent-[#800000]"
            />
            <span className="text-sm font-bold text-[#800000] w-4">{lineWidth}</span>
          </div>

          <div className="w-px h-8 bg-slate-300 dark:bg-slate-600" />

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Grid"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              showGrid
                ? "bg-[#800000] text-white shadow-lg"
                : isDarkMode
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  : "bg-white shadow-sm hover:bg-slate-100 text-slate-600"
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            Grid
          </button>

          <div className="flex-1" />

          {/* Clear */}
          <button
            onClick={clearCanvas}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>

        {/* Canvas */}
        <div className="relative p-4">
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className={`w-full rounded-2xl cursor-crosshair touch-none shadow-inner ${
              isDarkMode ? "bg-slate-800" : "bg-white"
            }`}
            style={{ aspectRatio: `${canvasWidth}/${canvasHeight}` }}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          />

          {/* Label Input Popup */}
          {labelPosition && (
            <div
              className={`absolute p-4 rounded-2xl shadow-2xl border-2 z-10 ${
                isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-[#800000]"
              }`}
              style={{ 
                left: `calc(${(labelPosition.x / canvasWidth) * 100}% + 1rem)`, 
                top: `calc(${(labelPosition.y / canvasHeight) * 100}% + 1rem)` 
              }}
            >
              <input
                type="text"
                placeholder="Enter label..."
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLabelSubmit()}
                autoFocus
                className={`px-4 py-2.5 rounded-xl border-2 text-sm font-medium outline-none focus:ring-2 ring-[#800000] w-48 ${
                  isDarkMode ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
                }`}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleLabelSubmit}
                  className="flex-1 px-4 py-2 bg-[#800000] text-white text-sm font-bold rounded-xl hover:bg-[#600000] transition-colors"
                >
                  Add Label
                </button>
                <button
                  onClick={() => {
                    setLabelPosition(null)
                    setLabelText("")
                  }}
                  className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-between gap-3 ${
          isDarkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"
        }`}>
          <p className="text-xs text-slate-500 font-medium">
            Use the tools above to draw diagrams, label components, or show your working
          </p>
          {onSubmit && (
            <button
              onClick={handleSubmitDrawing}
              className="px-6 py-2.5 bg-[#800000] hover:bg-[#600000] text-white font-bold rounded-xl transition-colors flex items-center gap-2 shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              Submit Drawing
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Quiz({
  currentQuestions,
  currentQuestionIdx,
  appMode,
  paperAnswers,
  setPaperAnswers,
  visibleAnswers,
  toggleAnswer,
  paperMarks,
  handleMarkSelect,
  userSelections,
  handleMCSelect,
  onBackToSetup,
  onPrev,
  onNext,
  isDarkMode,
  timingMode,
  selectedSubject,
}: {
  currentQuestions: Question[]
  currentQuestionIdx: number
  appMode: AppMode
  paperAnswers: Record<string, string>
  setPaperAnswers: (id: string, val: string) => void
  visibleAnswers: Record<string, boolean>
  toggleAnswer: (id: string) => void
  paperMarks: Record<string, number>
  handleMarkSelect: (id: string, val: number) => void
  userSelections: Record<number, number>
  handleMCSelect: (qIdx: number, optIdx: number) => void
  onBackToSetup: () => void
  onPrev: () => void
  onNext: () => void
  isDarkMode: boolean
  timingMode: TimingMode
  selectedSubject: SubjectId
}) {
  const [openWhiteboards, setOpenWhiteboards] = useState<Record<string, boolean>>({})
  const [submittedDrawings, setSubmittedDrawings] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [timerExpired, setTimerExpired] = useState(false)

  // Reset and start timer when question or timing mode changes
  useEffect(() => {
    if (timingMode === "none") {
      setTimeLeft(null)
      setTimerExpired(false)
      return
    }
    const q = currentQuestions[currentQuestionIdx]
    if (!q) return
    const marks = q.type === "mc" ? 1 : q.parts.reduce((sum, p) => sum + p.marks, 0)
    // relaxed: 1 mark / 0.5 marks per minute = 2 min/mark = 120 s/mark
    // exam:    1 mark / 0.9 marks per minute ≈ 67 s/mark
    let secondsPerMark: number
    if (selectedSubject === "Chemistry" || selectedSubject === "Biology") {
      // relaxed: 0.44 marks/min → ~136 s/mark; exam: 0.67 marks/min → ~90 s/mark
      secondsPerMark = timingMode === "relaxed" ? Math.round(60 / 0.44) : Math.round(60 / 0.67)
    } else if (selectedSubject === "Practical Electronics") {
      // relaxed: 0.67 marks/min → ~90 s/mark; exam: 1 mark/min → 60 s/mark
      secondsPerMark = timingMode === "relaxed" ? Math.round(60 / 0.67) : 60
    } else {
      secondsPerMark = timingMode === "relaxed" ? 120 : Math.round(60 / 0.9)
    }
    setTimeLeft(marks * secondsPerMark)
    setTimerExpired(false)
  }, [currentQuestionIdx, timingMode, currentQuestions, selectedSubject])

  // Countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) {
      if (timeLeft === 0) setTimerExpired(true)
      return
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLeft])
  
  const toggleWhiteboard = (id: string) => {
    setOpenWhiteboards((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleDrawingSubmit = (id: string, drawingData: string) => {
    setSubmittedDrawings((prev) => ({ ...prev, [id]: drawingData }))
    const currentAnswer = paperAnswers[id] || ""
    const newAnswer = currentAnswer.trim() ? currentAnswer + "\n[Drawing submitted]" : "[Drawing submitted]"
    setPaperAnswers(id, newAnswer)
  }

  const q = currentQuestions[currentQuestionIdx]
  const progress = ((currentQuestionIdx + 1) / currentQuestions.length) * 100

  return (
    <div className="pt-24 min-h-screen pb-40">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToSetup}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#800000]" />
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black text-[#800000] dark:text-red-500 line-clamp-1">{q.topic}</h2>
                {q.sourcePaperId && (
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full border border-amber-200 dark:border-amber-700 shrink-0">
                    {q.sourcePaperId.match(/\d{4}/)?.[0] ?? q.sourcePaperId}
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{q.subtopic}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-black text-amber-600 uppercase">
              Step {currentQuestionIdx + 1} of {currentQuestions.length}
            </span>
            <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-[#800000] transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {timeLeft !== null && (
          <div
            className={`flex items-center justify-center gap-3 mb-6 p-4 rounded-2xl border-2 transition-colors ${
              timerExpired
                ? "bg-red-100 dark:bg-red-900/20 border-red-500 text-red-600 dark:text-red-400"
                : timeLeft < 60
                  ? "bg-amber-50 dark:bg-amber-900/20 border-amber-500 text-amber-600 dark:text-amber-400"
                  : isDarkMode
                    ? "bg-slate-800 border-slate-700 text-slate-300"
                    : "bg-slate-50 border-slate-200 text-slate-600"
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="font-black text-xl">
              {timerExpired
                ? "Time's Up!"
                : `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest opacity-70">
              {timingMode === "relaxed" ? "Relaxed" : "Exam Conditions"}
            </span>
          </div>
        )}

        <div
          className={`rounded-[2.5rem] p-10 shadow-xl border-b-8 border-amber-500/20 border-x border-t animate-in fade-in zoom-in-95 duration-300 ${
            isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
          }`}
        >
          <div className="prose dark:prose-invert max-w-none mb-10 text-xl md:text-2xl leading-relaxed font-bold text-slate-800 dark:text-slate-100">
            {q.question}
          </div>

          {(appMode === "mc" || appMode === "practice") && q.type === "mc" ? (
            <div className="grid gap-4">
              {q.options.map((opt, idx) => {
                const isSelected = userSelections[currentQuestionIdx] === idx
                return (
                  <button
                    key={idx}
                    onClick={() => handleMCSelect(currentQuestionIdx, idx)}
                    className={`flex items-center gap-5 p-6 rounded-3xl border-2 text-left transition-all ${
                      isSelected
                        ? "border-[#800000] bg-red-50 dark:bg-red-900/10"
                        : isDarkMode
                          ? "border-slate-700 hover:border-[#800000]/30 hover:bg-slate-700/50"
                          : "border-slate-100 hover:border-[#800000]/30 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shrink-0 transition-all ${
                        isSelected
                          ? "bg-[#800000] text-white shadow-xl rotate-3"
                          : isDarkMode
                            ? "bg-slate-700"
                            : "bg-slate-100"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-lg font-bold">{opt}</span>
                  </button>
                )
              })}
            </div>
          ) : (
            q.type === "paper" && (
              <div className="space-y-10">
                {q.parts.map((part, pIdx) => (
                  <div
                    key={part.id}
                    className={`p-8 rounded-[2rem] border-2 ${
                      isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-100"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-full bg-[#800000] text-white flex items-center justify-center font-black text-sm">
                          {part.id}
                        </span>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">Sub-question</span>
                      </div>
                      <span className="text-xs font-black px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full border border-amber-200 dark:border-amber-800">
                        {part.marks} Marks
                      </span>
                    </div>
                    <p className="text-xl mb-6 font-bold text-slate-700 dark:text-slate-200">{part.text}</p>
                    <textarea
                      placeholder="Enter your calculation or response..."
                      className={`w-full p-6 rounded-2xl border-2 mb-4 focus:ring-4 ring-red-500/10 focus:border-[#800000] outline-none transition-all font-medium ${
                        isDarkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"
                      }`}
                      rows={4}
                      value={paperAnswers[`${currentQuestionIdx}-${pIdx}`] || ""}
                      onChange={(e) => setPaperAnswers(`${currentQuestionIdx}-${pIdx}`, e.target.value)}
                    />

                    {submittedDrawings[`${currentQuestionIdx}-${pIdx}`] && (
                      <div className="mb-4 p-4 rounded-2xl border-2 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Submitted Drawing:</p>
                        <img 
                          src={submittedDrawings[`${currentQuestionIdx}-${pIdx}`]} 
                          alt="Submitted drawing" 
                          className="w-full rounded-xl shadow-sm max-h-64 object-contain"
                        />
                      </div>
                    )}
                    
                    {/* Draw Button */}
                    <button
                      onClick={() => toggleWhiteboard(`${currentQuestionIdx}-${pIdx}`)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all mb-4 ${
                        openWhiteboards[`${currentQuestionIdx}-${pIdx}`]
                          ? "bg-[#800000] text-white"
                          : isDarkMode
                            ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      <Pencil className="w-4 h-4" />
                      {openWhiteboards[`${currentQuestionIdx}-${pIdx}`] ? "Hide Drawing" : "Draw"}
                    </button>
                    
                    {/* Whiteboard */}
                    <Whiteboard
                      isOpen={openWhiteboards[`${currentQuestionIdx}-${pIdx}`] || false}
                      onClose={() => toggleWhiteboard(`${currentQuestionIdx}-${pIdx}`)}
                      isDarkMode={isDarkMode}
                      onSubmit={(drawingData) => {
                        handleDrawingSubmit(`${currentQuestionIdx}-${pIdx}`, drawingData)
                      }}
                    />
                    
                    <div className="space-y-4 mt-4">
                      <button
                        onClick={() => toggleAnswer(`${currentQuestionIdx}-${pIdx}`)}
                        className="flex items-center gap-2 text-sm font-black text-[#800000] dark:text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest"
                      >
                        {visibleAnswers[`${currentQuestionIdx}-${pIdx}`] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                        {visibleAnswers[`${currentQuestionIdx}-${pIdx}`] ? "Hide Solutions" : "Check Marking Scheme"}
                      </button>
                      {visibleAnswers[`${currentQuestionIdx}-${pIdx}`] && (
                        <div className="p-8 bg-white dark:bg-slate-900 border-4 border-[#800000] rounded-[2rem] animate-in fade-in slide-in-from-top-4 shadow-2xl">
                          <div className="flex items-center gap-2 mb-4 text-[#800000]">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-black uppercase tracking-widest text-xs">
                              Ad Veritatem - Model Answer
                            </span>
                          </div>
                          <p className="mb-6 text-[#800000] dark:text-red-400 font-black text-2xl leading-tight">
                            {part.answer}
                          </p>
                          <div
                            className={`text-sm p-5 rounded-2xl italic border-l-4 border-amber-500 ${
                              isDarkMode ? "text-slate-500 bg-black/20" : "text-slate-500 bg-slate-50"
                            }`}
                          >
                            <span className="font-black not-italic text-slate-800 dark:text-slate-200 block mb-1">
                              SQA Marking Instructions:
                            </span>
                            {part.markingScheme}
                          </div>
                          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 text-center">
                              Assign marks for this part
                            </p>
                            <div className="flex justify-center gap-3">
                              {[...Array(part.marks + 1)].map((_, mIdx) => (
                                <button
                                  key={mIdx}
                                  onClick={() => handleMarkSelect(`${currentQuestionIdx}-${pIdx}`, mIdx)}
                                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all border-2 ${
                                    paperMarks[`${currentQuestionIdx}-${pIdx}`] === mIdx
                                      ? "bg-amber-500 text-white border-amber-600 scale-110 shadow-lg"
                                      : isDarkMode
                                        ? "bg-slate-800 border-slate-700 hover:border-[#800000]"
                                        : "bg-white border-slate-100 hover:border-[#800000]"
                                  }`}
                                >
                                  {mIdx}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      <div
        className={`fixed bottom-0 w-full p-6 backdrop-blur-xl border-t-2 flex justify-center z-40 ${
          isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/90 border-slate-100"
        }`}
      >
        <div className="max-w-4xl w-full flex justify-between items-center">
          <button
            disabled={currentQuestionIdx === 0}
            onClick={onPrev}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={onNext}
            className="flex items-center gap-3 px-12 py-5 rounded-full font-black bg-[#800000] text-white hover:bg-red-900 transition-all shadow-2xl shadow-red-900/30 border-2 border-amber-500/50"
          >
            {currentQuestionIdx === currentQuestions.length - 1 ? "Finish Assessment" : "Next Question"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function Results({
  paperMarks,
  userSelections,
  currentQuestions,
  appMode,
  onHome,
}: {
  paperMarks: Record<string, number>
  userSelections: Record<number, number>
  currentQuestions: Question[]
  appMode: AppMode
  onHome: () => void
}) {
  const stats = useMemo(() => {
    if (appMode === "mc" || appMode === "practice") {
      const hasMCQuestions = currentQuestions.some((q) => q.type === "mc")
      if (hasMCQuestions) {
        const correct = currentQuestions.reduce(
          (acc, q, idx) => acc + (q.type === "mc" && userSelections[idx] === q.answer ? 1 : 0),
          0
        )
        return {
          score: correct,
          total: currentQuestions.length,
          percentage: Math.round((correct / currentQuestions.length) * 100),
        }
      }
      // All questions are paper type (e.g. loaded from a past paper bank) — score by marks
      let totalMarks = 0
      let earnedMarks = 0
      currentQuestions.forEach((q, qIdx) => {
        if (q.type === "paper") {
          q.parts.forEach((p, pIdx) => {
            totalMarks += p.marks
            earnedMarks += paperMarks[`${qIdx}-${pIdx}`] || 0
          })
        }
      })
      return {
        score: earnedMarks,
        total: totalMarks,
        percentage: totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0,
      }
    } else {
      let totalMarks = 0
      let earnedMarks = 0
      currentQuestions.forEach((q, qIdx) => {
        if (q.type === "paper") {
          q.parts.forEach((p, pIdx) => {
            totalMarks += p.marks
            earnedMarks += paperMarks[`${qIdx}-${pIdx}`] || 0
          })
        }
      })
      return {
        score: earnedMarks,
        total: totalMarks,
        percentage: totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0,
      }
    }
  }, [appMode, currentQuestions, userSelections, paperMarks])

  const grade = stats.percentage >= 70 ? "A" : stats.percentage >= 60 ? "B" : stats.percentage >= 50 ? "C" : "D"

  return (
    <div className="pt-24 min-h-screen flex flex-col items-center p-6 animate-in fade-in zoom-in-95">
      <div className="max-w-4xl w-full text-center">
        <div className="inline-block p-8 rounded-[2rem] bg-red-50 dark:bg-red-950/20 mb-10 border-4 border-[#800000] shadow-2xl relative">
          <Award className="w-20 h-20 text-[#800000]" />
          <div className="absolute -top-3 -right-3 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white border-2 border-white">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
        <h1 className="text-6xl font-black mb-4 text-slate-900 dark:text-white">Review Complete</h1>
        <p className="text-xl text-slate-500 font-bold uppercase tracking-[0.2em] mb-12">
          Trinity Physics Performance
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-700 shadow-xl">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">Final Grade</p>
            <div className={`text-7xl font-black ${grade === "A" ? "text-amber-500" : "text-[#800000] dark:text-red-500"}`}>
              {grade}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-700 shadow-xl">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">Total Marks</p>
            <div className="text-7xl font-black text-slate-900 dark:text-white">
              {stats.score}
              <span className="text-2xl text-slate-300">/{stats.total}</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-700 shadow-xl">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">Percentage</p>
            <div className="text-7xl font-black text-[#800000] dark:text-red-500">{stats.percentage}%</div>
          </div>
        </div>

        <div className="bg-[#800000] text-white p-12 rounded-[3rem] mb-12 text-left relative overflow-hidden shadow-2xl border-4 border-amber-500">
          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-8 flex items-center gap-4 italic tracking-tighter">
              <Sparkles className="w-8 h-8 text-amber-400" />
              TUTOR FEEDBACK
            </h3>
            <p className="text-red-100 leading-relaxed mb-10 text-xl font-medium">
              Excellent focus during today&apos;s session.{" "}
              {stats.percentage >= 70
                ? "Your command of the quantitative physics relationships is exceptional. Ensure you maintain this standard in descriptive definitions."
                : "A solid performance, however, ensure you are double checking the units for final answers as per SQA requirements."}
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 bg-white/10 rounded-3xl border border-white/20">
                <h4 className="font-black text-xs uppercase tracking-widest mb-4 text-amber-400">Strengths Detected</h4>
                <ul className="text-sm space-y-3 font-bold">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Systematic Problem Solving
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Algebraic Re-arrangement
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-white/10 rounded-3xl border border-white/20">
                <h4 className="font-black text-xs uppercase tracking-widest mb-4 text-red-300">Revision Focus</h4>
                <ul className="text-sm space-y-3 font-bold">
                  <li className="flex items-center gap-2 text-red-100">• Written Explanations (3 Marks)</li>
                  <li className="flex items-center gap-2 text-red-100">• Graph Interpretation</li>
                </ul>
              </div>
            </div>
          </div>
          <Atom className="absolute -right-20 -bottom-20 w-80 h-80 text-white/5 rotate-45" />
        </div>

        <button
          onClick={onHome}
          className="px-16 py-6 bg-[#800000] text-white rounded-full font-black text-xl shadow-2xl shadow-red-900/40 hover:scale-105 active:scale-95 transition-all border-4 border-amber-500"
        >
          Return to Hub
        </button>
      </div>
    </div>
  )
}

const CHAR_CATEGORIES: Record<string, string[]> = {
  Greek: ["α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ", "μ", "ν", "ξ", "π", "ρ", "σ", "τ", "υ", "φ", "χ", "ψ", "ω", "Γ", "Δ", "Θ", "Λ", "Ξ", "Π", "Σ", "Φ", "Ψ", "Ω"],
  Math: ["×", "÷", "±", "≈", "≠", "≤", "≥", "√", "∞", "∝", "∴", "∵", "²", "³", "⁻¹", "⁻²", "°", "½", "¼", "¾", "∫", "∂", "∇", "∑", "∏", "∈", "∉", "⊂", "∪", "∩"],
  "Super/Sub": ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹", "⁺", "⁻", "ⁿ", "₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉", "₊", "₋", "ₙ", "ₐ", "ₑ", "ₒ", "ᵢ", "ⱼ", "ₓ"],
  Units: ["m", "kg", "s", "A", "K", "mol", "cd", "N", "J", "W", "Pa", "Hz", "C", "V", "Ω", "F", "H", "T", "Wb", "Bq", "Gy", "Sv", "lm", "lx", "rad"],
  Prefixes: ["T", "G", "M", "k", "h", "d", "c", "m", "μ", "n", "p", "f", "a"],
}

function CharacterKeyboard({ isDarkMode, onClose }: { isDarkMode: boolean; onClose: () => void }) {
  const [activeCategory, setActiveCategory] = useState<string>("Greek")
  const [copiedChar, setCopiedChar] = useState<string | null>(null)

  const insertCharacter = (char: string) => {
    const el = document.activeElement as HTMLInputElement | HTMLTextAreaElement
    if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) {
      const start = el.selectionStart ?? el.value.length
      const end = el.selectionEnd ?? el.value.length
      const newValue = el.value.substring(0, start) + char + el.value.substring(end)
      const nativeValueSetter =
        Object.getOwnPropertyDescriptor(
          el.tagName === "TEXTAREA" ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype,
          "value"
        )?.set
      if (nativeValueSetter) {
        nativeValueSetter.call(el, newValue)
      } else {
        el.value = newValue
      }
      el.dispatchEvent(new Event("input", { bubbles: true }))
      el.focus()
      requestAnimationFrame(() => {
        el.selectionStart = start + char.length
        el.selectionEnd = start + char.length
      })
    } else {
      navigator.clipboard.writeText(char).then(() => {
        setCopiedChar(char)
        setTimeout(() => setCopiedChar(null), 1500)
      }).catch(() => {
        setCopiedChar("!")
        setTimeout(() => setCopiedChar(null), 1500)
      })
    }
  }

  return (
    <div
      className={`w-72 rounded-3xl shadow-2xl border-2 overflow-hidden animate-in fade-in slide-in-from-bottom-4 ${
        isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-slate-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#800000] text-white">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-widest">Character Keyboard</span>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Category tabs */}
      <div className={`flex border-b ${isDarkMode ? "border-slate-700" : "border-slate-100"}`}>
        {Object.keys(CHAR_CATEGORIES).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider transition-colors ${
              activeCategory === cat
                ? "bg-[#800000] text-white"
                : isDarkMode
                  ? "text-slate-400 hover:text-white hover:bg-slate-700"
                  : "text-slate-500 hover:text-[#800000] hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Characters grid */}
      <div className="p-3 grid grid-cols-6 gap-1 max-h-48 overflow-y-auto">
        {CHAR_CATEGORIES[activeCategory].map((char) => (
          <button
            key={char}
            onClick={() => insertCharacter(char)}
            title={char}
            className={`h-10 rounded-xl text-base font-bold transition-all hover:scale-110 active:scale-95 ${
              isDarkMode
                ? "bg-slate-700 hover:bg-amber-500 hover:text-white text-slate-200"
                : "bg-slate-100 hover:bg-[#800000] hover:text-white text-slate-700"
            }`}
          >
            {char}
          </button>
        ))}
      </div>

      <p className={`px-4 pb-3 text-[10px] text-center ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
        {copiedChar && copiedChar !== "!"
          ? <span className="text-emerald-600 font-bold">"{copiedChar}" copied to clipboard!</span>
          : copiedChar === "!"
            ? <span className="text-red-500 font-bold">Could not copy to clipboard</span>
            : "Click to insert at cursor; copies to clipboard if no field is focused"
        }
      </p>
    </div>
  )
}

function FloatingMenu({
  isDarkMode,
  toggleDarkMode,
  openModal,
  view,
  currentUser,
}: {
  isDarkMode: boolean
  toggleDarkMode: () => void
  openModal: (modal: string) => void
  view: ViewType
  currentUser: UserAccount | null
}) {
const [isOpen, setIsOpen] = useState(false)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const showSyllabus = view === "mode" || view === "setup"
  const showProgress = view !== "landing"
  const isTeacher = currentUser?.accountType === "teacher"
  const isPupil = !isTeacher
  const showOutcomes = isPupil && view !== "landing" && view !== "subject-select"
  const showCharKeyboard = view === "quiz" || view === "definitions" || view === "calculations" || view === "assignment" || view === "exam-paper" || view === "electronics-tool"
  
  return (
  <div className="fixed bottom-6 right-6 z-[150] flex flex-col items-end gap-3">
  {showKeyboard && (
    <CharacterKeyboard isDarkMode={isDarkMode} onClose={() => setShowKeyboard(false)} />
  )}
  {isOpen && (
  <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4">
  {showProgress && (
  <button
  onClick={() => {
  openModal("progress")
  setIsOpen(false)
  }}
  className="bg-white dark:bg-slate-800 shadow-xl border-2 border-amber-500 p-4 pr-6 rounded-3xl flex items-center gap-3 hover:scale-105 transition-all"
  >
  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
  <Award className="w-5 h-5 text-amber-600" />
  </div>
  <span className="text-sm font-black uppercase tracking-widest">Progress</span>
  </button>
  )}
  {showOutcomes && (
    <button
      onClick={() => {
        openModal("outcomes")
        setIsOpen(false)
      }}
      className="bg-white dark:bg-slate-800 shadow-xl border-2 border-violet-500 p-4 pr-6 rounded-3xl flex items-center gap-3 hover:scale-105 transition-all"
    >
      <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
        <Target className="w-5 h-5 text-violet-600" />
      </div>
      <span className="text-sm font-black uppercase tracking-widest">Outcomes</span>
    </button>
  )}
  {showSyllabus && (
            <button
              onClick={() => {
                openModal("coverage")
                setIsOpen(false)
              }}
              className="bg-white dark:bg-slate-800 shadow-xl border-2 border-[#800000] p-4 pr-6 rounded-3xl flex items-center gap-3 hover:scale-105 transition-all"
            >
              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <Table2 className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm font-black uppercase tracking-widest">Syllabus</span>
            </button>
          )}
          {isTeacher && (
            <button
              onClick={() => {
                openModal("question-banks")
                setIsOpen(false)
              }}
              className="bg-white dark:bg-slate-800 shadow-xl border-2 border-emerald-500 p-4 pr-6 rounded-3xl flex items-center gap-3 hover:scale-105 transition-all"
            >
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <BookMarked className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm font-black uppercase tracking-widest">Question Banks</span>
            </button>
          )}
          {isTeacher && (
            <button
              onClick={() => {
                openModal("assessment-sheets")
                setIsOpen(false)
              }}
              className="bg-white dark:bg-slate-800 shadow-xl border-2 border-sky-500 p-4 pr-6 rounded-3xl flex items-center gap-3 hover:scale-105 transition-all"
            >
              <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-lg">
                <Upload className="w-5 h-5 text-sky-600" />
              </div>
              <span className="text-sm font-black uppercase tracking-widest">Assessment Sheets</span>
            </button>
          )}
          {showCharKeyboard && (
            <button
              onClick={() => {
                setShowKeyboard((prev) => !prev)
                setIsOpen(false)
              }}
              className={`bg-white dark:bg-slate-800 shadow-xl border-2 p-4 pr-6 rounded-3xl flex items-center gap-3 hover:scale-105 transition-all ${
                showKeyboard ? "border-amber-500" : "border-violet-500"
              }`}
            >
              <div className={`p-2 rounded-lg ${showKeyboard ? "bg-amber-100 dark:bg-amber-900/30" : "bg-violet-100 dark:bg-violet-900/30"}`}>
                <Keyboard className={`w-5 h-5 ${showKeyboard ? "text-amber-600" : "text-violet-600"}`} />
              </div>
              <span className="text-sm font-black uppercase tracking-widest">
                {showKeyboard ? "Hide Keyboard" : "Char Keyboard"}
              </span>
            </button>
          )}
          <button
            onClick={toggleDarkMode}
            className="bg-white dark:bg-slate-800 shadow-xl border-2 border-slate-200 dark:border-slate-700 p-4 pr-6 rounded-3xl flex items-center gap-3 hover:scale-105 transition-all"
          >
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </div>
            <span className="text-sm font-black uppercase tracking-widest">{isDarkMode ? "Light" : "Dark"}</span>
          </button>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#800000] rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-red-900/40 hover:scale-110 active:scale-95 transition-all border-4 border-amber-500"
      >
        {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
      </button>
    </div>
  )
}

function GenericModal({
  activeModal,
  onClose,
  userCoverage,
  onToggleTopic,
  selectedLevel,
  selectedSubject,
  isDarkMode,
  topicPerformance,
  currentUser,
}: {
  activeModal: string | null
  onClose: () => void
  userCoverage: Record<string, boolean>
  onToggleTopic: (topic: string) => void
  selectedLevel: string
  selectedSubject: SubjectId
  isDarkMode: boolean
  topicPerformance: Record<string, { correct: number; total: number }>
  currentUser: UserAccount | null
}) {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [selectedPupilId, setSelectedPupilId] = useState<string | null>(null)
  const [docUploadStatus, setDocUploadStatus] = useState<Record<string, "uploading" | "done" | "error" | undefined>>({})
  const [docRefresh, setDocRefresh] = useState(0)
  const [sheetSubject, setSheetSubject] = useState<string>(SUBJECTS[0].id)
  const [sheetLevel, setSheetLevel] = useState<string>("National 5")
  const [sheetUploadStatus, setSheetUploadStatus] = useState<Record<string, "uploading" | "done" | "error" | undefined>>({})
  const [sheetRefresh, setSheetRefresh] = useState(0)
  const [outcomeRatings, setOutcomeRatings] = useState<OutcomeRatings>(() =>
    currentUser ? loadOutcomeRatings(currentUser.id, selectedSubject, selectedLevel) : {}
  )
  const [expandedOutcomeId, setExpandedOutcomeId] = useState<string | null>(null)

  // Reload ratings when the modal opens or subject/level changes
  useEffect(() => {
    if (!currentUser) return
    setOutcomeRatings(loadOutcomeRatings(currentUser.id, selectedSubject, selectedLevel))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModal, currentUser?.id, selectedSubject, selectedLevel])

  if (!activeModal) return null

  const isTeacher = currentUser?.accountType === "teacher"
  const subtopics = getSubtopics(selectedSubject, selectedLevel)

  // ── Pupil progress view ──────────────────────────────────────────────────
  const totalQuestions = Object.values(topicPerformance).reduce((sum, p) => sum + p.total, 0)
  const totalCorrect = Object.values(topicPerformance).reduce((sum, p) => sum + p.correct, 0)
  const overallPercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  const topicsAttempted = Object.keys(topicPerformance).filter(t => topicPerformance[t].total > 0).length

  // ── Teacher progress helpers ─────────────────────────────────────────────
  const allGroups = loadClassGroups()
  const allAccounts = loadAccounts()
  const teacherClasses = isTeacher && currentUser
    ? allGroups.filter((g) => g.teacherId === currentUser.id)
    : []

  function getPupilName(id: string): string {
    return allAccounts.find((a) => a.id === id)?.name ?? "Unknown Pupil"
  }

  function getPupilDefSummary(pupilId: string): { correct: number; total: number } | null {
    const prog = loadUserDefProgress(pupilId, selectedLevel)
    const vals = Object.values(prog)
    if (vals.length === 0) return null
    const total = vals.reduce((s, p) => s + p.correct + p.incorrect, 0)
    const correct = vals.reduce((s, p) => s + p.correct, 0)
    return total > 0 ? { correct, total } : null
  }

  function getPupilExamSummary(pupilId: string): { mc: { correct: number; total: number } | null; paper: { correct: number; total: number } | null } {
    const prog = loadUserExamProgress(pupilId, selectedLevel)
    const mcVals = Object.values(prog.mc)
    const paperVals = Object.values(prog.paper)
    const mcTotal = mcVals.reduce((s, p) => s + p.total, 0)
    const mcCorrect = mcVals.reduce((s, p) => s + p.correct, 0)
    const paperTotal = paperVals.reduce((s, p) => s + p.total, 0)
    const paperCorrect = paperVals.reduce((s, p) => s + p.correct, 0)
    return {
      mc: mcTotal > 0 ? { correct: mcCorrect, total: mcTotal } : null,
      paper: paperTotal > 0 ? { correct: paperCorrect, total: paperTotal } : null,
    }
  }

  function getPupilCalcSummary(pupilId: string): { correct: number; total: number } | null {
    const prog = loadUserCalcProgress(pupilId, selectedLevel)
    const singleEqVals = Object.values(prog.singleEq)
    const total =
      singleEqVals.reduce((s, p) => s + p.total, 0) +
      prog.examLevel.total +
      prog.correctMe.total
    const correct =
      singleEqVals.reduce((s, p) => s + p.correct, 0) +
      prog.examLevel.correct +
      prog.correctMe.correct
    return total > 0 ? { correct, total } : null
  }

  function pct(s: { correct: number; total: number } | null): number | null {
    if (!s || s.total === 0) return null
    return Math.round((s.correct / s.total) * 100)
  }

  function perfColor(p: number): string {
    return p >= 70 ? "text-emerald-600" : p >= 50 ? "text-amber-600" : "text-red-600"
  }

  function perfBarColor(p: number): string {
    return p >= 70 ? "bg-emerald-500" : p >= 50 ? "bg-amber-500" : "bg-red-500"
  }

  const selectedClass = teacherClasses.find((g) => g.id === selectedClassId) ?? null
  const selectedPupil = selectedPupilId && selectedClass?.memberIds.includes(selectedPupilId) ? selectedPupilId : null

  // Class overview for selected class
  function classOverview(group: ClassGroup) {
    const pupils = group.memberIds
    const defScores = pupils.map((id) => pct(getPupilDefSummary(id))).filter((p): p is number => p !== null)
    const mcScores = pupils.map((id) => pct(getPupilExamSummary(id).mc)).filter((p): p is number => p !== null)
    const paperScores = pupils.map((id) => pct(getPupilExamSummary(id).paper)).filter((p): p is number => p !== null)
    const calcScores = pupils.map((id) => pct(getPupilCalcSummary(id))).filter((p): p is number => p !== null)
    const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null
    return {
      def: avg(defScores),
      mc: avg(mcScores),
      paper: avg(paperScores),
      calc: avg(calcScores),
      defCount: defScores.length,
      mcCount: mcScores.length,
      paperCount: paperScores.length,
      calcCount: calcScores.length,
      total: pupils.length,
    }
  }

  const cardBg = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-2xl rounded-[2.5rem] shadow-2xl border-4 border-[#800000] flex flex-col max-h-[90vh] ${
          isDarkMode ? "bg-slate-900" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-8 pb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            {isTeacher && activeModal === "progress" && selectedClassId && !selectedPupilId && (
              <button
                onClick={() => { setSelectedClassId(null); setSelectedPupilId(null) }}
                className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {isTeacher && activeModal === "progress" && selectedClassId && selectedPupilId && (
              <button
                onClick={() => setSelectedPupilId(null)}
                className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h3 className="text-2xl font-black italic tracking-tighter uppercase">
              {activeModal === "progress"
                ? isTeacher
                  ? selectedPupilId
                    ? getPupilName(selectedPupilId)
                    : selectedClassId
                      ? (selectedClass?.name ?? "Class")
                      : "Class Progress"
                  : "My Progress"
                : activeModal === "question-banks"
                  ? "Question Banks"
                  : activeModal === "assessment-sheets"
                    ? "Assessment Sheets"
                    : activeModal === "outcomes"
                      ? "My Outcomes"
                      : activeModal}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-8 pb-8">

          {/* ── Teacher progress view ──────────────────────────────────────── */}
          {activeModal === "progress" && isTeacher && !selectedClassId && (
            <div className="space-y-4">
              <p className={`text-xs font-black uppercase tracking-widest mb-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Your Classes
              </p>
              {teacherClasses.length === 0 ? (
                <div className={`p-6 rounded-2xl text-center border ${cardBg}`}>
                  <GraduationCap className="w-10 h-10 mx-auto mb-3 text-slate-400" />
                  <p className={`font-bold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    No classes yet — create a class to start tracking pupil progress.
                  </p>
                </div>
              ) : (
                teacherClasses.map((group) => {
                  const ov = classOverview(group)
                  return (
                    <button
                      key={group.id}
                      onClick={() => { setSelectedClassId(group.id); setSelectedPupilId(null) }}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all hover:scale-[1.01] hover:shadow-md ${cardBg}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                            <GraduationCap className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-black text-base">{group.name}</p>
                            <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                              {group.memberIds.length} pupil{group.memberIds.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </div>
                      {/* Mini overview row */}
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {[
                          { label: "Defs", val: ov.def, count: ov.defCount },
                          { label: "MCQ", val: ov.mc, count: ov.mcCount },
                          { label: "Paper", val: ov.paper, count: ov.paperCount },
                          { label: "Calc", val: ov.calc, count: ov.calcCount },
                        ].map(({ label, val, count }) => (
                          <div key={label} className={`p-2 rounded-xl ${isDarkMode ? "bg-slate-700/50" : "bg-slate-50"}`}>
                            <p className={`text-sm font-black ${val !== null ? perfColor(val) : "text-slate-400"}`}>
                              {val !== null ? `${val}%` : "—"}
                            </p>
                            <p className={`text-[10px] font-bold uppercase ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>{label}</p>
                            <p className={`text-[9px] ${isDarkMode ? "text-slate-600" : "text-slate-300"}`}>
                              {count}/{ov.total}
                            </p>
                          </div>
                        ))}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          )}

          {/* ── Teacher: class detail view ─────────────────────────────────── */}
          {activeModal === "progress" && isTeacher && selectedClassId && !selectedPupilId && selectedClass && (
            <div className="space-y-5">
              {/* Class Overview */}
              {(() => {
                const ov = classOverview(selectedClass)
                return (
                  <div className={`p-5 rounded-2xl border ${cardBg}`}>
                    <p className={`text-xs font-black uppercase tracking-widest mb-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Class Overview — {selectedLevel}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Definitions", val: ov.def, count: ov.defCount, icon: "📖" },
                        { label: "Exam MCQ", val: ov.mc, count: ov.mcCount, icon: "🎯" },
                        { label: "Exam Paper", val: ov.paper, count: ov.paperCount, icon: "📝" },
                        { label: "Calculations", val: ov.calc, count: ov.calcCount, icon: "🔢" },
                      ].map(({ label, val, count, icon }) => (
                        <div key={label} className={`p-4 rounded-xl ${isDarkMode ? "bg-slate-700/50" : "bg-slate-50"}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-base">{icon}</span>
                            <p className={`text-xs font-black uppercase ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>{label}</p>
                          </div>
                          {val !== null ? (
                            <>
                              <p className={`text-2xl font-black ${perfColor(val)}`}>{val}%</p>
                              <div className={`h-1.5 rounded-full mt-1 ${isDarkMode ? "bg-slate-600" : "bg-slate-200"}`}>
                                <div className={`h-full rounded-full ${perfBarColor(val)}`} style={{ width: `${val}%` }} />
                              </div>
                              <p className={`text-[10px] mt-1 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                {count} of {ov.total} attempted
                              </p>
                            </>
                          ) : (
                            <p className={`text-sm ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>No data yet</p>
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Analysis text */}
                    {(ov.def !== null || ov.mc !== null || ov.paper !== null || ov.calc !== null) && (
                      <div className={`mt-4 p-3 rounded-xl border ${isDarkMode ? "border-slate-600 bg-slate-700/30" : "border-amber-100 bg-amber-50"}`}>
                        <p className={`text-xs font-black uppercase mb-1 text-amber-600`}>💡 Quick Analysis</p>
                        <p className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                          {[
                            ov.def !== null && `Definitions avg: ${ov.def}% (${ov.defCount}/${ov.total} pupils).`,
                            ov.mc !== null && `MCQ avg: ${ov.mc}% (${ov.mcCount}/${ov.total} pupils).`,
                            ov.paper !== null && `Paper avg: ${ov.paper}% (${ov.paperCount}/${ov.total} pupils).`,
                            ov.calc !== null && `Calculations avg: ${ov.calc}% (${ov.calcCount}/${ov.total} pupils).`,
                            (() => {
                              const scores = [ov.def, ov.mc, ov.paper, ov.calc].filter((v): v is number => v !== null)
                              if (scores.length === 0) return null
                              const min = Math.min(...scores)
                              const labels = ["Definitions", "MCQ", "Paper", "Calculations"]
                              const vals = [ov.def, ov.mc, ov.paper, ov.calc]
                              const weakIdx = vals.indexOf(min)
                              return min < 60 ? `Weakest area: ${labels[weakIdx]} — consider focusing practice here.` : "Good overall performance across all areas."
                            })(),
                          ].filter(Boolean).join(" ")}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })()}

              {/* Pupil List */}
              <div>
                <p className={`text-xs font-black uppercase tracking-widest mb-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Pupils ({selectedClass.memberIds.length})
                </p>
                {selectedClass.memberIds.length === 0 ? (
                  <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>No pupils have joined this class yet.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedClass.memberIds.map((pupilId) => {
                      const defS = getPupilDefSummary(pupilId)
                      const examS = getPupilExamSummary(pupilId)
                      const calcS = getPupilCalcSummary(pupilId)
                      const defPct = pct(defS)
                      const mcPct = pct(examS.mc)
                      const paperPct = pct(examS.paper)
                      const calcPct = pct(calcS)
                      return (
                        <button
                          key={pupilId}
                          onClick={() => setSelectedPupilId(pupilId)}
                          className={`w-full text-left p-4 rounded-2xl border-2 transition-all hover:scale-[1.01] hover:shadow-md ${cardBg}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${isDarkMode ? "bg-slate-700 text-slate-200" : "bg-slate-100 text-slate-700"}`}>
                                {getPupilName(pupilId).charAt(0).toUpperCase()}
                              </div>
                              <span className="font-bold text-sm">{getPupilName(pupilId)}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </div>
                          <div className="grid grid-cols-4 gap-1.5 text-center">
                            {[
                              { label: "Defs", val: defPct },
                              { label: "MCQ", val: mcPct },
                              { label: "Paper", val: paperPct },
                              { label: "Calc", val: calcPct },
                            ].map(({ label, val }) => (
                              <div key={label} className={`px-1 py-1.5 rounded-lg ${isDarkMode ? "bg-slate-700/50" : "bg-slate-50"}`}>
                                <p className={`text-xs font-black ${val !== null ? perfColor(val) : "text-slate-400"}`}>
                                  {val !== null ? `${val}%` : "—"}
                                </p>
                                <p className={`text-[9px] font-bold uppercase ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>{label}</p>
                              </div>
                            ))}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Teacher: individual pupil detail ──────────────────────────── */}
          {activeModal === "progress" && isTeacher && selectedClassId && selectedPupil && (
            <div className="space-y-4">
              {/* Definitions */}
              {(() => {
                const prog = loadUserDefProgress(selectedPupil, selectedLevel)
                const defLevelKey = getDefLevelKey(selectedSubject, selectedLevel)
                const unitTopics = DEF_UNIT_TOPICS[defLevelKey] ?? {}
                const levelEntries = DEFINITIONS_BANK.filter((e) => e.level === defLevelKey)
                const byTopic = Object.entries(unitTopics)
                  .flatMap(([unit, topics]) => (topics as string[]).map((t) => ({ unit, t })))
                  .filter(({ t }) => levelEntries.some((e) => e.topic === t))
                  .map(({ unit, t }) => {
                    const entries = levelEntries.filter((e) => e.topic === t)
                    const vals = entries.map((e) => prog[e.term]).filter(Boolean)
                    const total = vals.reduce((s, p) => s + p.correct + p.incorrect, 0)
                    const correct = vals.reduce((s, p) => s + p.correct, 0)
                    return { unit, topic: t, pct: total > 0 ? Math.round((correct / total) * 100) : null, total }
                  })
                  .filter((x) => x.total > 0)
                return (
                  <div className={`p-5 rounded-2xl border ${cardBg}`}>
                    <p className={`text-xs font-black uppercase tracking-widest mb-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      📖 Definitions
                    </p>
                    {byTopic.length === 0 ? (
                      <p className={`text-sm ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>No definitions attempted yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {byTopic.map(({ topic, pct: p }) => (
                          <div key={topic}>
                            <div className="flex justify-between items-center mb-0.5">
                              <span className={`text-xs font-semibold truncate max-w-[70%] ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{topic}</span>
                              <span className={`text-xs font-black ${p !== null ? perfColor(p) : "text-slate-400"}`}>
                                {p !== null ? `${p}%` : "—"}
                              </span>
                            </div>
                            {p !== null && (
                              <div className={`h-1.5 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>
                                <div className={`h-full rounded-full ${perfBarColor(p)}`} style={{ width: `${p}%` }} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })()}

              {/* Exam MCQ */}
              {(() => {
                const prog = loadUserExamProgress(selectedPupil, selectedLevel)
                const mcTopics = Object.entries(prog.mc).filter(([, v]) => v.total > 0)
                return (
                  <div className={`p-5 rounded-2xl border ${cardBg}`}>
                    <p className={`text-xs font-black uppercase tracking-widest mb-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      🎯 Exam — Multiple Choice
                    </p>
                    {mcTopics.length === 0 ? (
                      <p className={`text-sm ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>No MCQ attempts yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {mcTopics.map(([topic, v]) => {
                          const p = Math.round((v.correct / v.total) * 100)
                          return (
                            <div key={topic}>
                              <div className="flex justify-between items-center mb-0.5">
                                <span className={`text-xs font-semibold truncate max-w-[70%] ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{topic}</span>
                                <span className={`text-xs font-black ${perfColor(p)}`}>{p}%</span>
                              </div>
                              <div className={`h-1.5 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>
                                <div className={`h-full rounded-full ${perfBarColor(p)}`} style={{ width: `${p}%` }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })()}

              {/* Exam Paper */}
              {(() => {
                const prog = loadUserExamProgress(selectedPupil, selectedLevel)
                const paperTopics = Object.entries(prog.paper).filter(([, v]) => v.total > 0)
                return (
                  <div className={`p-5 rounded-2xl border ${cardBg}`}>
                    <p className={`text-xs font-black uppercase tracking-widest mb-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      📝 Exam — Paper Questions
                    </p>
                    {paperTopics.length === 0 ? (
                      <p className={`text-sm ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>No paper attempts yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {paperTopics.map(([topic, v]) => {
                          const p = Math.round((v.correct / v.total) * 100)
                          return (
                            <div key={topic}>
                              <div className="flex justify-between items-center mb-0.5">
                                <span className={`text-xs font-semibold truncate max-w-[70%] ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{topic}</span>
                                <span className={`text-xs font-black ${perfColor(p)}`}>{p}%</span>
                              </div>
                              <div className={`h-1.5 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>
                                <div className={`h-full rounded-full ${perfBarColor(p)}`} style={{ width: `${p}%` }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })()}

              {/* Calculations */}
              {(() => {
                const prog = loadUserCalcProgress(selectedPupil, selectedLevel)
                const singleEqEntries = Object.entries(prog.singleEq).filter(([, v]) => v.total > 0)
                const hasCalc = singleEqEntries.length > 0 || prog.examLevel.total > 0 || prog.correctMe.total > 0
                return (
                  <div className={`p-5 rounded-2xl border ${cardBg}`}>
                    <p className={`text-xs font-black uppercase tracking-widest mb-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      🔢 Calculations
                    </p>
                    {!hasCalc ? (
                      <p className={`text-sm ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>No calculations attempted yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {singleEqEntries.map(([lvl, v]) => {
                          const p = v.total > 0 ? Math.round((v.correct / v.total) * 100) : null
                          const lvlInfo = CALC_SINGLE_EQ_LEVELS[Number(lvl) - 1]
                          return p !== null ? (
                            <div key={lvl}>
                              <div className="flex justify-between items-center mb-0.5">
                                <span className={`text-xs font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                                  {lvlInfo?.emoji ?? ""} {lvlInfo?.label ?? `Level ${lvl}`}
                                </span>
                                <span className={`text-xs font-black ${perfColor(p)}`}>{p}%</span>
                              </div>
                              <div className={`h-1.5 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>
                                <div className={`h-full rounded-full ${perfBarColor(p)}`} style={{ width: `${p}%` }} />
                              </div>
                            </div>
                          ) : null
                        })}
                        {prog.examLevel.total > 0 && (
                          <div>
                            <div className="flex justify-between items-center mb-0.5">
                              <span className={`text-xs font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>📋 Exam Level</span>
                              <span className={`text-xs font-black text-emerald-600`}>{prog.examLevel.total} completed</span>
                            </div>
                          </div>
                        )}
                        {prog.correctMe.total > 0 && (() => {
                          const p = Math.round((prog.correctMe.correct / prog.correctMe.total) * 100)
                          return (
                            <div>
                              <div className="flex justify-between items-center mb-0.5">
                                <span className={`text-xs font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>🔍 Correct Me!</span>
                                <span className={`text-xs font-black ${perfColor(p)}`}>{p}%</span>
                              </div>
                              <div className={`h-1.5 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>
                                <div className={`h-full rounded-full ${perfBarColor(p)}`} style={{ width: `${p}%` }} />
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          )}

          {/* ── Pupil progress view ────────────────────────────────────────── */}
          {activeModal === "progress" && !isTeacher && (
            <div className="space-y-6">
              {/* Overall Stats */}
              <div className={`p-6 rounded-2xl ${isDarkMode ? "bg-slate-800" : "bg-slate-50"}`}>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-black text-[#800000]">{overallPercentage}%</p>
                    <p className="text-xs text-slate-500 font-bold uppercase">Overall</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-amber-600">{totalQuestions}</p>
                    <p className="text-xs text-slate-500 font-bold uppercase">Questions</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-emerald-600">{topicsAttempted}</p>
                    <p className="text-xs text-slate-500 font-bold uppercase">Topics</p>
                  </div>
                </div>
              </div>

              {/* Topic Breakdown */}
              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Topic Breakdown</p>
                {subtopics.map((topic) => {
                  const perf = topicPerformance[topic]
                  const score = perf && perf.total > 0 ? Math.round((perf.correct / perf.total) * 100) : null
                  const hasData = perf && perf.total > 0
                  return (
                    <div
                      key={topic}
                      className={`p-4 rounded-2xl border ${
                        isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold">{topic}</span>
                        {hasData ? (
                          <span className={`text-sm font-black ${
                            score! >= 70 ? "text-emerald-600" : score! >= 50 ? "text-amber-600" : "text-red-600"
                          }`}>
                            {score}%
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Not attempted</span>
                        )}
                      </div>
                      {hasData && (
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              score! >= 70 ? "bg-emerald-500" : score! >= 50 ? "bg-amber-500" : "bg-red-500"
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Past Paper Year History */}
              {currentUser && (() => {
                const paperBanks = PAST_PAPER_BANKS[selectedLevel] || []
                if (paperBanks.length === 0) return null
                const examProg = loadUserExamProgress(currentUser.id, selectedLevel)
                const hasAnyAttempts = paperBanks.some((p) => (examProg.pastPapers?.[p.id] ?? []).length > 0)
                return (
                  <div className="space-y-3">
                    <p className="text-xs font-black uppercase tracking-widest text-amber-600 mb-2">Past Paper History</p>
                    {paperBanks.map((paper) => {
                      const attempts = examProg.pastPapers?.[paper.id] ?? []
                      const year = paper.id.match(/\d{4}/)?.[0] ?? paper.label
                      const paperTotalMarks = paper.questions.reduce((sum, q) => {
                        if (q.type === "paper") return sum + q.parts.reduce((s, p) => s + p.marks, 0)
                        return sum + 1
                      }, 0)
                      const bestPct =
                        attempts.length > 0
                          ? Math.max(...attempts.map((a) => (a.marksTotal > 0 ? Math.round((a.marksEarned / a.marksTotal) * 100) : 0)))
                          : null
                      const latestAttempt = attempts.length > 0 ? attempts[attempts.length - 1] : null
                      const attemptedQs = latestAttempt
                        ? new Set(
                            Object.keys(latestAttempt.partMarks).map((k) => parseInt(k.split("-")[0]))
                          )
                        : new Set<number>()
                      return (
                        <div key={paper.id} className={`p-4 rounded-2xl border ${cardBg}`}>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-black text-base">{year} Paper</p>
                              <p className={`text-xs ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                {attempts.length > 0
                                  ? `${attempts.length} attempt${attempts.length !== 1 ? "s" : ""}`
                                  : "Not attempted"}
                              </p>
                            </div>
                            {bestPct !== null && (
                              <p className={`text-xl font-black ${perfColor(bestPct)}`}>Best: {bestPct}%</p>
                            )}
                          </div>
                          {/* Question attempt status for latest attempt */}
                          <div className="mb-2">
                            <p className={`text-[10px] font-black uppercase mb-1.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                              {latestAttempt ? "Latest attempt — questions:" : "No attempts yet"}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {paper.questions.map((_, idx) => (
                                <span
                                  key={idx}
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${
                                    attemptedQs.has(idx)
                                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700"
                                      : isDarkMode
                                        ? "bg-slate-700 text-slate-500 border border-slate-600"
                                        : "bg-slate-100 text-slate-400 border border-slate-200"
                                  }`}
                                >
                                  {idx + 1}
                                </span>
                              ))}
                            </div>
                          </div>
                          {/* Mark history */}
                          {attempts.length > 0 && (
                            <div className="mt-2">
                              <p className={`text-[10px] font-black uppercase mb-1 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                Mark history ({paperTotalMarks} total marks):
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {attempts.map((a, i) => {
                                  const p = a.marksTotal > 0 ? Math.round((a.marksEarned / a.marksTotal) * 100) : 0
                                  return (
                                    <span
                                      key={i}
                                      title={`${a.marksEarned}/${a.marksTotal} marks — ${new Date(a.date).toLocaleDateString()}`}
                                      className={`text-xs font-black px-2 py-0.5 rounded-full ${
                                        p >= 70
                                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                          : p >= 50
                                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                      }`}
                                    >
                                      {a.marksEarned}/{a.marksTotal} ({p}%)
                                    </span>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                    {!hasAnyAttempts && (
                      <p className={`text-sm text-center py-2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                        Complete a past paper in Exam Mode to see your history here.
                      </p>
                    )}
                  </div>
                )
              })()}
            </div>
          )}

          {/* ── Coverage view ──────────────────────────────────────────────── */}
          {activeModal === "coverage" && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {subtopics.map((t) => (
                <div
                  key={t}
                  className={`flex justify-between items-center p-4 rounded-2xl border ${
                    isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <span className="text-sm font-bold">{t}</span>
                  <button
                    onClick={() => onToggleTopic(t)}
                    className={`w-12 h-7 rounded-full relative transition-colors ${
                      userCoverage[t] ? "bg-amber-500" : isDarkMode ? "bg-slate-600" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                        userCoverage[t] ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── Question Banks view (teacher only) ─────────────────────────── */}
          {activeModal === "question-banks" && isTeacher && (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border ${cardBg}`}>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex-shrink-0">
                    <BookMarked className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-black text-sm">Upload Calculation Documents</p>
                    <p className={`text-xs mt-1 leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Upload a PDF or text document of worked examples for each equation. When pupils start a session,
                      the AI will automatically generate 15 fresh questions based on your document — creating an
                      almost-infinite variety so questions never repeat.
                    </p>
                  </div>
                </div>
              </div>
              <p className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                SQA Equations
              </p>
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {SQA_EQUATIONS.map((eq) => {
                  const doc = loadCalcDocument(eq.id)
                  const status = docUploadStatus[eq.id]
                  return (
                    <div
                      key={`${eq.id}-${docRefresh}`}
                      className={`p-4 rounded-2xl border ${cardBg}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-black text-sm font-mono truncate">{eq.formula}</p>
                          <p className={`text-xs truncate ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                            {eq.description}
                            <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              eq.sqaLevel === "N5" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                              eq.sqaLevel === "Higher" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                              "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                            }`}>{eq.sqaLevel}</span>
                          </p>
                          {doc && (
                            <p className={`text-[11px] mt-1 ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                              ✓ {doc.fileName} · {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {status === "uploading" && (
                            <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
                          )}
                          {status === "done" && (
                            <span className="text-emerald-500 text-xs font-bold">Saved!</span>
                          )}
                          {status === "error" && (
                            <span className="text-red-500 text-xs font-bold">Error</span>
                          )}
                          {doc && (
                            <button
                              onClick={() => {
                                removeCalcDocument(eq.id)
                                setDocRefresh((n) => n + 1)
                              }}
                              className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                                isDarkMode ? "text-red-400 hover:bg-red-900/30" : "text-red-500 hover:bg-red-50"
                              }`}
                              title="Remove document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <label className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${
                            doc
                              ? isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                              : "bg-emerald-600 hover:bg-emerald-700 text-white"
                          }`}>
                            <Upload className="w-3.5 h-3.5" />
                            {doc ? "Replace" : "Upload"}
                            <input
                              type="file"
                              accept=".txt,.pdf,.doc,.docx"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                setDocUploadStatus((s) => ({ ...s, [eq.id]: "uploading" }))
                                try {
                                  let content = ""
                                  if (file.type === "application/pdf") {
                                    // PDF binary is decoded as latin1 (ISO-8859-1) to preserve all byte values
                                    // intact before extracting text tokens from the raw PDF stream
                                    const arrayBuffer = await file.arrayBuffer()
                                    const uint8Array = new Uint8Array(arrayBuffer)
                                    const text = new TextDecoder("latin1").decode(uint8Array)
                                    // PDF text is stored in parenthesised strings: (text token)
                                    // Limit each token to 200 chars to skip binary blobs masquerading as text
                                    const PDF_TOKEN_MAX_CHARS = 200
                                    const matches = text.match(new RegExp(`\\(([^)]{2,${PDF_TOKEN_MAX_CHARS}})\\)`, "g")) ?? []
                                    content = matches
                                      .map((m) => m.slice(1, -1))
                                      .filter((s) => /[a-zA-Z]/.test(s))
                                      .join(" ")
                                    if (content.length < 20) {
                                      content = `Document: ${file.name}\n[PDF content — use as context for generating physics calculation questions about ${eq.description} using the formula ${eq.formula}]`
                                    }
                                  } else {
                                    content = await file.text()
                                  }
                                  saveCalcDocument(eq.id, {
                                    fileName: file.name,
                                    content,
                                    uploadedAt: Date.now(),
                                  })
                                  setDocUploadStatus((s) => ({ ...s, [eq.id]: "done" }))
                                  setDocRefresh((n) => n + 1)
                                  setTimeout(() => setDocUploadStatus((s) => ({ ...s, [eq.id]: undefined })), 2000)
                                } catch {
                                  setDocUploadStatus((s) => ({ ...s, [eq.id]: "error" }))
                                }
                                // Reset input so same file can be re-uploaded
                                e.target.value = ""
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          {/* ── Assessment Sheets view (teacher only) ──────────────────────── */}
          {activeModal === "assessment-sheets" && isTeacher && (
            <div key={sheetRefresh} className="space-y-4">
              {/* Info banner */}
              <div className={`p-4 rounded-2xl border ${cardBg}`}>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex-shrink-0">
                    <Upload className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="font-black text-sm">Upload Assessment Reference Sheets</p>
                    <p className={`text-xs mt-1 leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Upload a Relationship Sheet and Data Sheet for each subject and level. These sheets will be
                      available to pupils during assessments. Each subject and level can have its own distinct sheets.
                    </p>
                  </div>
                </div>
              </div>

              {/* Subject tabs */}
              <div>
                <p className={`text-xs font-black uppercase tracking-widest mb-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Subject
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSheetSubject(s.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${
                        sheetSubject === s.id
                          ? "bg-sky-600 text-white"
                          : isDarkMode
                            ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level tabs */}
              <div>
                <p className={`text-xs font-black uppercase tracking-widest mb-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Level
                </p>
                <div className="flex flex-wrap gap-2">
                  {["National 5", "Higher", "Advanced Higher"].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSheetLevel(lvl)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${
                        sheetLevel === lvl
                          ? "bg-sky-600 text-white"
                          : isDarkMode
                            ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload cards */}
              <div className="space-y-3">
                {(["relationship", "data"] as SheetType[]).map((sheetType) => {
                  const sheetKey = `${sheetType}_${sheetSubject}_${sheetLevel}`
                  const existingSheet = loadAssessmentSheet(sheetType, sheetSubject, sheetLevel)
                  const uploadStatus = sheetUploadStatus[sheetKey]
                  const label = sheetType === "relationship" ? "Relationship Sheet" : "Data Sheet"

                  return (
                    <div key={`${sheetKey}-${sheetRefresh}`} className={`p-4 rounded-2xl border ${cardBg}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-black text-sm">{label}</p>
                          <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                            {sheetSubject} · {sheetLevel}
                          </p>
                          {existingSheet && (
                            <p className={`text-[11px] mt-1 ${isDarkMode ? "text-sky-400" : "text-sky-600"}`}>
                              ✓ {existingSheet.fileName} · {new Date(existingSheet.uploadedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {uploadStatus === "uploading" && (
                            <RefreshCw className="w-4 h-4 animate-spin text-sky-500" />
                          )}
                          {uploadStatus === "done" && (
                            <span className="text-sky-500 text-xs font-bold">Saved!</span>
                          )}
                          {uploadStatus === "error" && (
                            <span className="text-red-500 text-xs font-bold">Error</span>
                          )}
                          {existingSheet && (
                            <button
                              onClick={() => {
                                removeAssessmentSheet(sheetType, sheetSubject, sheetLevel)
                                setSheetRefresh((n) => n + 1)
                              }}
                              className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                                isDarkMode ? "text-red-400 hover:bg-red-900/30" : "text-red-500 hover:bg-red-50"
                              }`}
                              title="Remove sheet"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <label className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${
                            existingSheet
                              ? isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                              : "bg-sky-600 hover:bg-sky-700 text-white"
                          }`}>
                            <Upload className="w-3.5 h-3.5" />
                            {existingSheet ? "Replace" : "Upload"}
                            <input
                              type="file"
                              accept={ASSESSMENT_SHEET_ACCEPT}
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                setSheetUploadStatus((s) => ({ ...s, [sheetKey]: "uploading" }))
                                try {
                                  let content = ""
                                  if (file.type.startsWith("image/")) {
                                    // Store images as base64 data URLs for display
                                    const arrayBuffer = await file.arrayBuffer()
                                    const bytes = new Uint8Array(arrayBuffer)
                                    let binary = ""
                                    bytes.forEach((b) => { binary += String.fromCharCode(b) })
                                    content = `data:${file.type};base64,${btoa(binary)}`
                                  } else if (file.type === "application/pdf") {
                                    // Extract readable text tokens from the PDF stream
                                    const arrayBuffer = await file.arrayBuffer()
                                    const uint8Array = new Uint8Array(arrayBuffer)
                                    const text = new TextDecoder("latin1").decode(uint8Array)
                                    const PDF_TOKEN_MAX_CHARS = 200
                                    const matches = text.match(new RegExp(`\\(([^)]{2,${PDF_TOKEN_MAX_CHARS}})\\)`, "g")) ?? []
                                    content = matches
                                      .map((m) => m.slice(1, -1))
                                      .filter((s) => /[a-zA-Z]/.test(s))
                                      .join(" ")
                                    if (content.length < 20) {
                                      content = `[PDF: ${file.name}]`
                                    }
                                  } else {
                                    content = await file.text()
                                  }
                                  saveAssessmentSheet(sheetType, sheetSubject, sheetLevel, {
                                    fileName: file.name,
                                    content,
                                    uploadedAt: Date.now(),
                                  })
                                  setSheetUploadStatus((s) => ({ ...s, [sheetKey]: "done" }))
                                  setSheetRefresh((n) => n + 1)
                                  setTimeout(() => setSheetUploadStatus((s) => ({ ...s, [sheetKey]: undefined })), 2000)
                                } catch {
                                  setSheetUploadStatus((s) => ({ ...s, [sheetKey]: "error" }))
                                }
                                e.target.value = ""
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Outcomes view (pupil only) ──────────────────────────────────── */}
          {activeModal === "outcomes" && !isTeacher && (() => {
            const outcomes: Outcome[] = SUBJECT_LEVEL_OUTCOMES[selectedSubject]?.[selectedLevel] ?? []
            const ratingLabels: [string, string][] = [
              ["", "Not rated"],
              ["🔴", "Needs work"],
              ["🟡", "Getting there"],
              ["🟢", "Confident"],
              ["⭐", "Mastered"],
            ]

            function setRating(outcomeId: string, rating: OutcomeRating) {
              const updated = { ...outcomeRatings, [outcomeId]: rating }
              setOutcomeRatings(updated)
              if (currentUser) {
                saveOutcomeRatings(currentUser.id, selectedSubject, selectedLevel, updated)
              }
            }

            // Calculate outcome progress from topicPerformance (linked topics)
            function outcomeProgress(outcome: Outcome): { correct: number; total: number } | null {
              let correct = 0; let total = 0
              outcome.linkedTopics.forEach((t) => {
                const p = topicPerformance[t]
                if (p && p.total > 0) { correct += p.correct; total += p.total }
              })
              return total > 0 ? { correct, total } : null
            }

            const rated = outcomes.filter((o) => (outcomeRatings[o.id] ?? 0) > 0).length
            const mastered = outcomes.filter((o) => (outcomeRatings[o.id] ?? 0) === 4).length
            const confident = outcomes.filter((o) => (outcomeRatings[o.id] ?? 0) === 3).length
            const getting = outcomes.filter((o) => (outcomeRatings[o.id] ?? 0) === 2).length
            const needsWork = outcomes.filter((o) => (outcomeRatings[o.id] ?? 0) === 1).length

            if (outcomes.length === 0) {
              return (
                <div className="text-center py-12">
                  <Target className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className={`font-bold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    No outcomes defined yet for {selectedSubject} — {selectedLevel}.
                  </p>
                </div>
              )
            }

            return (
              <div className="space-y-5">
                {/* Summary row */}
                <div className={`p-4 rounded-2xl ${isDarkMode ? "bg-slate-800" : "bg-slate-50"} grid grid-cols-4 gap-3 text-center`}>
                  {[
                    { label: "Needs Work", value: needsWork, color: "text-red-500" },
                    { label: "Getting There", value: getting, color: "text-amber-500" },
                    { label: "Confident", value: confident, color: "text-emerald-500" },
                    { label: "Mastered", value: mastered, color: "text-violet-500" },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <p className={`text-2xl font-black ${color}`}>{value}</p>
                      <p className="text-[10px] font-bold uppercase text-slate-400">{label}</p>
                    </div>
                  ))}
                </div>

                <p className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {selectedSubject} — {selectedLevel} ({rated}/{outcomes.length} rated)
                </p>

                <div className="space-y-3 max-h-[48vh] overflow-y-auto pr-1">
                  {outcomes.map((outcome) => {
                    const rating = (outcomeRatings[outcome.id] ?? 0) as OutcomeRating
                    const prog = outcomeProgress(outcome)
                    const pct = prog ? Math.round((prog.correct / prog.total) * 100) : null
                    const isExpanded = expandedOutcomeId === outcome.id

                    const ratingColors: string[] = [
                      isDarkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200",
                      "bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700",
                      "bg-amber-50 border-amber-300 dark:bg-amber-900/20 dark:border-amber-700",
                      "bg-emerald-50 border-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-700",
                      "bg-violet-50 border-violet-300 dark:bg-violet-900/20 dark:border-violet-700",
                    ]

                    return (
                      <div
                        key={outcome.id}
                        className={`rounded-2xl border-2 transition-all ${ratingColors[rating]}`}
                      >
                        {/* Outcome header row */}
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                  isDarkMode ? "bg-slate-600 text-slate-300" : "bg-slate-200 text-slate-600"
                                }`}>
                                  {outcome.code}
                                </span>
                              </div>
                              <p className="font-black text-sm leading-snug">{outcome.title}</p>
                            </div>
                            {/* Rating selector */}
                            <div className="flex gap-1 flex-shrink-0">
                              {ratingLabels.slice(1).map(([emoji, label], idx) => {
                                const val = (idx + 1) as OutcomeRating
                                return (
                                  <button
                                    key={val}
                                    title={label}
                                    onClick={() => setRating(outcome.id, rating === val ? 0 : val)}
                                    className={`w-7 h-7 rounded-full text-base flex items-center justify-center transition-all hover:scale-110 ${
                                      rating === val
                                        ? "ring-2 ring-offset-1 ring-violet-400 scale-110"
                                        : "opacity-40 hover:opacity-100"
                                    }`}
                                  >
                                    {emoji}
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          {/* Progress bar (from topic performance) */}
                          {pct !== null && (
                            <div className="mt-2">
                              <div className="flex justify-between items-center mb-1">
                                <span className={`text-[10px] font-bold uppercase ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                  Practice Score
                                </span>
                                <span className={`text-xs font-black ${pct >= 70 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-600"}`}>
                                  {pct}% ({prog!.correct}/{prog!.total})
                                </span>
                              </div>
                              <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${pct >= 70 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Expand/collapse button */}
                          <button
                            onClick={() => setExpandedOutcomeId(isExpanded ? null : outcome.id)}
                            className={`mt-2 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-colors ${
                              isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-400 hover:text-slate-700"
                            }`}
                          >
                            <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                            {isExpanded ? "Hide detail" : "Show detail"}
                          </button>
                        </div>

                        {/* Expanded detail */}
                        {isExpanded && (
                          <div className={`px-4 pb-4 border-t ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}>
                            <p className={`text-xs leading-relaxed mt-3 mb-3 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                              {outcome.description}
                            </p>
                            <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                              Linked Topics
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {outcome.linkedTopics.map((t) => {
                                const tp = topicPerformance[t]
                                const tPct = tp && tp.total > 0 ? Math.round((tp.correct / tp.total) * 100) : null
                                return (
                                  <span
                                    key={t}
                                    className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                                      tPct !== null
                                        ? tPct >= 70
                                          ? "bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-400"
                                          : tPct >= 50
                                            ? "bg-amber-100 border-amber-300 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-400"
                                            : "bg-red-100 border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400"
                                        : isDarkMode
                                          ? "bg-slate-700 border-slate-600 text-slate-300"
                                          : "bg-slate-100 border-slate-300 text-slate-600"
                                    }`}
                                  >
                                    {t}
                                    {tPct !== null && <span className="font-black">{tPct}%</span>}
                                  </span>
                                )
                              })}
                            </div>
                            {!currentUser && (
                              <p className={`mt-3 text-xs italic ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                Sign in to save your outcome ratings across sessions.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {!currentUser && (
                  <p className={`text-xs text-center italic ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                    Sign in to save your ratings across sessions.
                  </p>
                )}
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

// ─── ProfileModal ─────────────────────────────────────────────────────────────

function ProfileModal({
  currentUser,
  isDarkMode,
  onClose,
  onUpdateUser,
}: {
  currentUser: UserAccount
  isDarkMode: boolean
  onClose: () => void
  onUpdateUser: (user: UserAccount) => void
}) {
  const [activeTab, setActiveTab] = useState<"subjects" | "achievements" | "stats">("subjects")
  const [subjectLevels, setSubjectLevels] = useState<Partial<Record<SubjectId, string>>>(
    currentUser.subjectLevels ?? {}
  )
  const [saved, setSaved] = useState(false)
  const [disableModeLocking, setDisableModeLocking] = useState<boolean>(currentUser.disableModeLocking ?? false)
  const [showLockingWarning, setShowLockingWarning] = useState(false)
  const LEVEL_OPTIONS = ["not sitting", "National 5", "Higher", "Advanced Higher"] as const

  const isPupil = currentUser.accountType === "pupil"

  function handleToggleModeLocking() {
    if (!disableModeLocking) {
      // Trying to disable locking — show warning first
      setShowLockingWarning(true)
    } else {
      // Re-enabling locking — just save immediately
      const newValue = false
      setDisableModeLocking(newValue)
      const updated: UserAccount = { ...currentUser, subjectLevels, disableModeLocking: newValue }
      const accounts = loadAccounts()
      saveAccounts(accounts.map((a) => (a.id === updated.id ? updated : a)))
      saveCurrentUser(updated)
      onUpdateUser(updated)
    }
  }

  function confirmDisableLocking() {
    setDisableModeLocking(true)
    setShowLockingWarning(false)
    const updated: UserAccount = { ...currentUser, subjectLevels, disableModeLocking: true }
    const accounts = loadAccounts()
    saveAccounts(accounts.map((a) => (a.id === updated.id ? updated : a)))
    saveCurrentUser(updated)
    onUpdateUser(updated)
  }

  // Compute total stats from stored progress
  const totalQuestionsAnswered = useMemo(() => {
    let total = 0
    for (const level of ["National 5", "Higher", "Advanced Higher"]) {
      const exam = loadUserExamProgress(currentUser.id, level)
      total += Object.values(exam.mc).reduce((s, p) => s + p.total, 0)
      total += Object.values(exam.paper).reduce((s, p) => s + p.total, 0)
      const calc = loadUserCalcProgress(currentUser.id, level)
      total += Object.values(calc.singleEq).reduce((s, p) => s + p.total, 0)
      total += calc.examLevel.total + calc.correctMe.total
    }
    return total
  }, [currentUser.id])

  const totalCorrect = useMemo(() => {
    let correct = 0
    for (const level of ["National 5", "Higher", "Advanced Higher"]) {
      const exam = loadUserExamProgress(currentUser.id, level)
      correct += Object.values(exam.mc).reduce((s, p) => s + p.correct, 0)
      correct += Object.values(exam.paper).reduce((s, p) => s + p.correct, 0)
      const calc = loadUserCalcProgress(currentUser.id, level)
      correct += Object.values(calc.singleEq).reduce((s, p) => s + p.correct, 0)
      correct += calc.examLevel.correct + calc.correctMe.correct
    }
    return correct
  }, [currentUser.id])

  // Cross-subject master progress for selected subjects
  const studiedSubjects = SUBJECTS.filter((s) => {
    const lvl = subjectLevels[s.id]
    return lvl && lvl !== "not sitting"
  })

  // Achievements definitions
  const achievements: { id: string; emoji: string; title: string; desc: string; unlocked: boolean }[] = [
    { id: "first-steps", emoji: "🎯", title: "First Steps", desc: "Answer your first question", unlocked: totalQuestionsAnswered >= 1 },
    { id: "ten-questions", emoji: "📚", title: "Getting Started", desc: "Answer 10 questions", unlocked: totalQuestionsAnswered >= 10 },
    { id: "fifty-questions", emoji: "🔥", title: "On Fire", desc: "Answer 50 questions", unlocked: totalQuestionsAnswered >= 50 },
    { id: "hundred-questions", emoji: "💯", title: "Century", desc: "Answer 100 questions", unlocked: totalQuestionsAnswered >= 100 },
    { id: "five-hundred", emoji: "🏆", title: "Study Champion", desc: "Answer 500 questions", unlocked: totalQuestionsAnswered >= 500 },
    { id: "good-accuracy", emoji: "⭐", title: "Sharp Mind", desc: "Achieve 70%+ overall accuracy", unlocked: totalQuestionsAnswered >= 10 && totalCorrect / Math.max(totalQuestionsAnswered, 1) >= 0.7 },
    { id: "multi-subject", emoji: "🌟", title: "All-Rounder", desc: "Study 2 or more subjects", unlocked: studiedSubjects.length >= 2 },
    { id: "full-house", emoji: "🎓", title: "Full House", desc: "Study all 4 subjects", unlocked: studiedSubjects.length >= 4 },
    { id: "logged-in", emoji: "👋", title: "Welcome Back", desc: "Sign in to your account", unlocked: true },
    { id: "profile-set", emoji: "📋", title: "Prepared", desc: "Set your subject levels", unlocked: Object.keys(subjectLevels).length > 0 },
  ]

  const unlockedCount = achievements.filter((a) => a.unlocked).length

  function handleSaveLevels() {
    const updated: UserAccount = { ...currentUser, subjectLevels, disableModeLocking }
    const accounts = loadAccounts()
    saveAccounts(accounts.map((a) => (a.id === updated.id ? updated : a)))
    saveCurrentUser(updated)
    onUpdateUser(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const cardBg = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`w-full max-w-lg rounded-[2.5rem] shadow-2xl border-4 border-[#800000] flex flex-col max-h-[90vh] ${isDarkMode ? "bg-slate-900" : "bg-white"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-black ${currentUser.accountType === "teacher" ? "bg-amber-600" : "bg-[#800000]"}`}>
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-black text-lg">{currentUser.name}</p>
              <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{currentUser.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X /></button>
        </div>

        {/* Tabs */}
        <div className={`flex gap-1 mx-6 mb-4 p-1 rounded-xl flex-shrink-0 ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}>
          {(isPupil ? (["subjects", "achievements", "stats"] as const) : (["stats"] as const)).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t as typeof activeTab)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === t ? "bg-[#800000] text-white shadow" : isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {t === "subjects" ? "My Subjects" : t === "achievements" ? "Achievements" : "Stats"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 pb-6">

          {/* ── Subjects Tab ── */}
          {activeTab === "subjects" && isPupil && (
            <div className="space-y-4">
              <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Set the level you&apos;re sitting for each subject. Choose <strong>Not Sitting</strong> if you&apos;re not studying it.
              </p>
              {SUBJECTS.map((subject) => {
                const availableLevels = subject.id === "Practical Electronics"
                  ? (["not sitting", "National 5"] as const)
                  : (["not sitting", "National 5", "Higher", "Advanced Higher"] as const)
                const current = subjectLevels[subject.id] ?? "not sitting"
                return (
                  <div key={subject.id} className={`p-4 rounded-2xl border ${cardBg}`}>
                    <p className="font-black text-sm mb-3">{subject.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {availableLevels.map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setSubjectLevels((prev) => ({ ...prev, [subject.id]: lvl }))}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${
                            current === lvl
                              ? lvl === "not sitting"
                                ? "bg-slate-500 text-white border-slate-500"
                                : "bg-[#800000] text-white border-[#800000]"
                              : isDarkMode
                                ? "border-slate-600 text-slate-300 hover:border-slate-400"
                                : "border-slate-200 text-slate-600 hover:border-slate-400"
                          }`}
                        >
                          {lvl === "not sitting" ? "Not Sitting" : lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}

              {/* Master Progress Tracker */}
              {studiedSubjects.length > 0 && (
                <div className={`p-4 rounded-2xl border ${cardBg}`}>
                  <p className={`text-xs font-black uppercase tracking-widest mb-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    📊 Master Progress Tracker
                  </p>
                  <div className="space-y-3">
                    {studiedSubjects.map((subject) => {
                      const lvl = subjectLevels[subject.id] ?? ""
                      if (!lvl) return null
                      const exam = loadUserExamProgress(currentUser.id, lvl)
                      const mcTotal = Object.values(exam.mc).reduce((s, p) => s + p.total, 0)
                      const mcCorrect = Object.values(exam.mc).reduce((s, p) => s + p.correct, 0)
                      const calc = loadUserCalcProgress(currentUser.id, lvl)
                      const calcTotal = Object.values(calc.singleEq).reduce((s, p) => s + p.total, 0) + calc.examLevel.total
                      const calcCorrect = Object.values(calc.singleEq).reduce((s, p) => s + p.correct, 0) + calc.examLevel.correct
                      const total = mcTotal + calcTotal
                      const correct = mcCorrect + calcCorrect
                      const pct = total > 0 ? Math.round((correct / total) * 100) : null
                      return (
                        <div key={subject.id}>
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-sm font-bold ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>{subject.label}</span>
                            <span className={`text-xs font-black ${pct !== null ? (pct >= 70 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-500") : isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                              {pct !== null ? `${pct}% (${correct}/${total})` : "No data yet"} · {lvl}
                            </span>
                          </div>
                          {pct !== null && (
                            <div className={`h-2 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>
                              <div className={`h-full rounded-full transition-all ${pct >= 70 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Mode Locking Setting */}
              <div className={`p-4 rounded-2xl border ${cardBg}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-sm mb-1">📐 Progressive Mode Locking</p>
                    <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {disableModeLocking
                        ? "Locking is disabled — all quiz formats and difficulties are available freely."
                        : "Locking is active — complete each format and difficulty in order to unlock the next."}
                    </p>
                  </div>
                  <button
                    onClick={handleToggleModeLocking}
                    role="switch"
                    aria-checked={!disableModeLocking}
                    aria-label={disableModeLocking ? "Progressive locking disabled — click to re-enable" : "Progressive locking enabled — click to disable"}
                    className={`shrink-0 w-12 h-6 rounded-full relative transition-colors ${disableModeLocking ? "bg-slate-400" : "bg-[#800000]"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${disableModeLocking ? "left-0.5" : "left-6"}`} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveLevels}
                  className="flex-1 py-3 bg-[#800000] hover:bg-[#600000] text-white rounded-xl font-bold text-sm transition-colors"
                >
                  {saved ? "✓ Saved!" : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* Mode Locking Warning Popup */}
          {showLockingWarning && (
            <div
              className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
              onClick={() => setShowLockingWarning(false)}
              onKeyDown={(e) => { if (e.key === "Escape") setShowLockingWarning(false) }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="locking-warning-title"
            >
              <div
                className={`w-full max-w-sm rounded-3xl shadow-2xl border-4 border-amber-500 p-6 ${isDarkMode ? "bg-slate-900" : "bg-white"}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-3xl mb-3 text-center">🔬</div>
                <h3 id="locking-warning-title" className="text-lg font-black text-center mb-3">Why Progressive Locking Matters</h3>
                <div className={`text-sm space-y-2 mb-5 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  <p>Research on learning science consistently shows that <strong>spaced, linear progression</strong> leads to significantly better long-term retention than random access:</p>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li><strong>Mastery before advancement</strong> — completing easier formats first builds the mental scaffolding needed for harder ones.</li>
                    <li><strong>Interleaving effect</strong> — moving through difficulty levels in order maximises the spacing between repetitions of the same material.</li>
                    <li><strong>Reduced cognitive overload</strong> — tackling formats sequentially keeps working memory free for deeper processing.</li>
                  </ul>
                  <p className="text-xs mt-2">Students who follow the unlocking order consistently outperform those who skip ahead. We strongly recommend keeping locking enabled.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setShowLockingWarning(false)}
                    className="w-full py-3 rounded-xl font-black text-sm bg-[#800000] text-white hover:bg-[#600000] transition-colors"
                  >
                    Keep Progressive Locking ✓
                  </button>
                  <button
                    onClick={confirmDisableLocking}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm border-2 transition-colors ${isDarkMode ? "border-slate-600 text-slate-400 hover:border-slate-400" : "border-slate-300 text-slate-500 hover:border-slate-400"}`}
                  >
                    I understand, disable locking
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Achievements Tab ── */}
          {activeTab === "achievements" && isPupil && (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl ${isDarkMode ? "bg-slate-800" : "bg-amber-50"} text-center`}>
                <p className="text-3xl font-black text-amber-500">{unlockedCount} / {achievements.length}</p>
                <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Achievements Unlocked</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((a) => (
                  <div
                    key={a.id}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      a.unlocked
                        ? isDarkMode ? "border-amber-500 bg-amber-900/20" : "border-amber-400 bg-amber-50"
                        : isDarkMode ? "border-slate-700 bg-slate-800 opacity-50" : "border-slate-200 bg-slate-50 opacity-50"
                    }`}
                  >
                    <div className="text-2xl mb-2">{a.unlocked ? a.emoji : "🔒"}</div>
                    <p className={`text-xs font-black ${a.unlocked ? isDarkMode ? "text-amber-300" : "text-amber-700" : isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                      {a.title}
                    </p>
                    <p className={`text-[10px] mt-0.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>{a.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Stats Tab ── */}
          {activeTab === "stats" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Questions Answered", value: totalQuestionsAnswered.toString(), icon: "❓" },
                  { label: "Correct Answers", value: totalCorrect.toString(), icon: "✅" },
                  {
                    label: "Overall Accuracy",
                    value: totalQuestionsAnswered > 0 ? `${Math.round((totalCorrect / totalQuestionsAnswered) * 100)}%` : "—",
                    icon: "🎯",
                  },
                  {
                    label: "Last Login",
                    value: currentUser.lastLogin ? new Date(currentUser.lastLogin).toLocaleDateString() : "—",
                    icon: "🕐",
                  },
                  { label: "Account Type", value: currentUser.accountType === "teacher" ? "Teacher" : "Pupil", icon: "👤" },
                  {
                    label: "Sessions",
                    value: (currentUser.totalSessions ?? 1).toString(),
                    icon: "📅",
                  },
                ].map(({ label, value, icon }) => (
                  <div key={label} className={`p-4 rounded-2xl border ${cardBg}`}>
                    <div className="text-xl mb-1">{icon}</div>
                    <p className="text-lg font-black">{value}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>{label}</p>
                  </div>
                ))}
              </div>
              {isPupil && studiedSubjects.length > 0 && (
                <div className={`p-4 rounded-2xl border ${cardBg}`}>
                  <p className={`text-xs font-black uppercase tracking-widest mb-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    📊 Master Progress Tracker
                  </p>
                  <div className="space-y-3">
                    {studiedSubjects.map((subject) => {
                      const lvl = subjectLevels[subject.id] ?? ""
                      if (!lvl) return null
                      const exam = loadUserExamProgress(currentUser.id, lvl)
                      const mcTotal = Object.values(exam.mc).reduce((s, p) => s + p.total, 0)
                      const mcCorrect = Object.values(exam.mc).reduce((s, p) => s + p.correct, 0)
                      const calc = loadUserCalcProgress(currentUser.id, lvl)
                      const calcTotal = Object.values(calc.singleEq).reduce((s, p) => s + p.total, 0) + calc.examLevel.total
                      const calcCorrect = Object.values(calc.singleEq).reduce((s, p) => s + p.correct, 0) + calc.examLevel.correct
                      const total = mcTotal + calcTotal
                      const correct = mcCorrect + calcCorrect
                      const pct = total > 0 ? Math.round((correct / total) * 100) : null
                      return (
                        <div key={subject.id}>
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs font-bold ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>{subject.label} ({lvl})</span>
                            <span className={`text-xs font-black ${pct !== null ? (pct >= 70 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-500") : isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                              {pct !== null ? `${pct}%` : "—"}
                            </span>
                          </div>
                          {pct !== null && (
                            <div className={`h-1.5 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>
                              <div className={`h-full rounded-full ${pct >= 70 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [view, setView] = useState<ViewType>("subject-select")
  const [selectedLevel, setSelectedLevel] = useState("National 5")
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>("Physics")
  const [appMode, setAppMode] = useState<AppMode>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [userCoverage, setUserCoverage] = useState<Record<string, boolean>>({})
  const [includeALevel, setIncludeALevel] = useState(false)
  const [includeOpenEnded, setIncludeOpenEnded] = useState(false)
  const [includeMultiTopic, setIncludeMultiTopic] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([])
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [userSelections, setUserSelections] = useState<Record<number, number>>({})
  const [paperAnswers, setPaperAnswers] = useState<Record<string, string>>({})
  const [paperMarks, setPaperMarks] = useState<Record<string, number>>({})
  const [visibleAnswers, setVisibleAnswers] = useState<Record<string, boolean>>({})
  const [topicPerformance, setTopicPerformance] = useState<Record<string, { correct: number; total: number }>>({})
  const [timingMode, setTimingMode] = useState<TimingMode>("none")
  const [numberOfQuestions, setNumberOfQuestions] = useState(5)
  const [questionSource, setQuestionSource] = useState<string>("ai")
  // "Wrong place" popup for "not sitting" subjects
  const [wrongPlaceSubject, setWrongPlaceSubject] = useState<SubjectId | null>(null)

  // Auth state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => loadCurrentUser())
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [classesModalOpen, setClassesModalOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)

  function handleSignIn(user: UserAccount, isNewAccount = false) {
    // Record last login; only increment session count for returning logins (not new account creation)
    const updated: UserAccount = {
      ...user,
      lastLogin: Date.now(),
      totalSessions: isNewAccount ? 1 : (user.totalSessions ?? 0) + 1,
    }
    const accounts = loadAccounts()
    if (!updated.isTestAccount) {
      saveAccounts(accounts.map((a) => (a.id === updated.id ? updated : a)))
    }
    saveCurrentUser(updated)
    setCurrentUser(updated)
  }

  function handleSignOut() {
    saveCurrentUser(null)
    setCurrentUser(null)
  }

  // Calculate weak topics based on performance data
  const weakTopics = useMemo(() => {
    const subtopics = getSubtopics(selectedSubject, selectedLevel)
    const performanceList: WeakTopic[] = []
    
    subtopics.forEach(topic => {
      const perf = topicPerformance[topic]
      if (perf && perf.total > 0) {
        const score = Math.round((perf.correct / perf.total) * 100)
        if (score < 70) { // Topics with less than 70% are considered weak
          performanceList.push({ topic, score })
        }
      }
    })
    
    // Sort by lowest score first and take top 3
    return performanceList.sort((a, b) => a.score - b.score).slice(0, 3)
  }, [selectedSubject, selectedLevel, topicPerformance])

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }, [isDarkMode])

  const handleSubjectSelect = (subject: SubjectId) => {
    setSelectedSubject(subject)
    // If pupil has subject levels configured, use them
    if (currentUser?.accountType === "pupil" && currentUser.subjectLevels) {
      const level = currentUser.subjectLevels[subject]
      if (level === "not sitting") {
        // Show "wrong place" popup and return to subject selection
        setWrongPlaceSubject(subject)
        return
      }
      if (level) {
        // Skip landing page - go directly to mode selection with pre-set level
        setSelectedLevel(level)
        setQuestionSource("ai")
        setView("mode")
        return
      }
    }
    setView("landing")
  }

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level)
    setQuestionSource("ai")
    setView("mode")
  }

  const handleModeSelect = (mode: AppMode) => {
    setAppMode(mode)
    setQuestionSource("ai")
    if (mode === "mc" || mode === "practice") {
      setIncludeALevel(false)
      setIncludeOpenEnded(false)
      setIncludeMultiTopic(false)
    }
    if (mode === "definitions") {
      setView("definitions")
    } else if (mode === "calculations") {
      setView("calculations")
    } else if (mode === "assignment") {
      setView("assignment")
    } else if (mode === "exam-paper") {
      setView("exam-paper")
    } else if (
      mode === "stripboarding" ||
      mode === "block-diagrams" ||
      mode === "logic-gates" ||
      mode === "testing" ||
      mode === "symbols" ||
      mode === "costing"
    ) {
      setView("electronics-tool")
    } else {
      setView("setup")
    }
  }

  const updateTopicPerformance = () => {
    const newPerformance = { ...topicPerformance }

    currentQuestions.forEach((q, idx) => {
      const topic = q.subtopic || q.topic
      if (!newPerformance[topic]) {
        newPerformance[topic] = { correct: 0, total: 0 }
      }

      if (q.type === "mc") {
        newPerformance[topic].total += 1
        if (userSelections[idx] === q.answer) {
          newPerformance[topic].correct += 1
        }
      } else if (q.type === "paper") {
        q.parts.forEach((part) => {
          newPerformance[topic].total += part.marks
          newPerformance[topic].correct += paperMarks[part.id] || 0
        })
      }
    })

    setTopicPerformance(newPerformance)

    // Persist exam progress per user
    if (currentUser) {
      const existing = loadUserExamProgress(currentUser.id, selectedLevel)
      currentQuestions.forEach((q, idx) => {
        const topic = q.subtopic || q.topic
        if (q.type === "mc") {
          if (!existing.mc[topic]) existing.mc[topic] = { correct: 0, total: 0 }
          existing.mc[topic].total += 1
          if (userSelections[idx] === q.answer) existing.mc[topic].correct += 1
        } else if (q.type === "paper") {
          if (!existing.paper[topic]) existing.paper[topic] = { correct: 0, total: 0 }
          q.parts.forEach((part) => {
            existing.paper[topic].total += part.marks
            existing.paper[topic].correct += paperMarks[part.id] || 0
          })
        }
      })
      saveUserExamProgress(currentUser.id, selectedLevel, existing)
    }
  }

  const handleFinishQuiz = () => {
    updateTopicPerformance()
    setView("results")
  }

  const generateQuestions = async (topicString: string) => {
    // Load from all past paper banks when in paper mode
    if (appMode === "paper") {
      const banks = PAST_PAPER_BANKS[selectedLevel] || []
      const allPaperQuestions = banks.flatMap((bank) =>
        bank.questions.map((q) => ({ ...q, sourcePaperId: bank.id }))
      )
      if (allPaperQuestions.length > 0) {
        const selectedTopicsList = topicString.split(",").filter(Boolean)
        const topicsSet = new Set(selectedTopicsList)
        const hasCoverage = Object.values(userCoverage).some(Boolean)

        // Build the set of allowed topics when Mixed Questions is on
        const mixedTopicsSet = new Set(topicsSet)
        if (includeMultiTopic && hasCoverage) {
          Object.entries(userCoverage).forEach(([topic, covered]) => {
            if (covered) mixedTopicsSet.add(topic)
          })
        }

        // Helper: filter and validate parts for a question given an allowed topic set
        const filterParts = (pq: PaperQuestion, allowedTopics: Set<string>): PaperPart[] => {
          // Step 1: filter by topic tag (part's topicTag or inherited question subtopic)
          const byTopic = pq.parts.filter((p) => {
            const partTopic = p.topicTag || pq.subtopic
            return allowedTopics.has(partTopic)
          })
          // Step 2: filter by feature tag
          const byFeature = byTopic.filter((p) => {
            if (p.featureTag === "a-level" && !includeALevel) return false
            if (p.featureTag === "open-ended" && !includeOpenEnded) return false
            return true
          })
          // Step 3: dependency filtering — remove parts whose dependsOn are not satisfied
          const includedIds = new Set(byFeature.map((p) => p.id))
          let changed = true
          while (changed) {
            changed = false
            for (const part of byFeature) {
              if (includedIds.has(part.id) && part.dependsOn && part.dependsOn.length > 0) {
                for (const depId of part.dependsOn) {
                  if (!includedIds.has(depId)) {
                    includedIds.delete(part.id)
                    changed = true
                    break
                  }
                }
              }
            }
          }
          return byFeature.filter((p) => includedIds.has(p.id))
        }

        // Determine which topic set to use for question-level filtering
        // A question is a candidate if its subtopic is selected, or any part's topicTag is selected
        const isQuestionCandidate = (pq: PaperQuestion): boolean => {
          if (topicsSet.has(pq.subtopic)) return true
          return pq.parts.some((p) => p.topicTag && topicsSet.has(p.topicTag))
        }

        const filteredQuestions: Question[] = allPaperQuestions
          .filter((q) => {
            if (q.type !== "paper") return false
            return isQuestionCandidate(q as PaperQuestion)
          })
          .map((q) => {
            const pq = q as PaperQuestion
            const allowedTopics = includeMultiTopic ? mixedTopicsSet : topicsSet
            const validParts = filterParts(pq, allowedTopics)
            return { ...pq, parts: validParts }
          })
          .filter((q) => (q as PaperQuestion).parts.length > 0)

        // Apply numberOfQuestions limit — each whole question counts as one question
        const limitedQuestions = numberOfQuestions > 0 ? filteredQuestions.slice(0, numberOfQuestions) : filteredQuestions

        setCurrentQuestions(limitedQuestions)
        setCurrentQuestionIdx(0)
        setUserSelections({})
        setPaperAnswers({})
        setPaperMarks({})
        setVisibleAnswers({})
        setView("quiz")
      }
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: appMode === "practice" ? "mc" : appMode,
          level: selectedLevel,
          topics: topicString,
          includeALevel,
          includeMultiTopic,
          numberOfQuestions,
        }),
      })

      const data = await response.json()

      if (data.questions) {
        const allQuestions = Array.isArray(data.questions) ? data.questions : [data.questions]
        const limitedQuestions = numberOfQuestions > 0 ? allQuestions.slice(0, numberOfQuestions) : allQuestions
        setCurrentQuestions(limitedQuestions)
        setCurrentQuestionIdx(0)
        setUserSelections({})
        setPaperAnswers({})
        setPaperMarks({})
        setVisibleAnswers({})
        setIsGenerating(false)
        setView("quiz")
      } else {
        throw new Error("No questions returned")
      }
    } catch (error) {
      console.error("AI Generation failed:", error)
      setIsGenerating(false)

      // Demo Fallback
      setCurrentQuestions(
        appMode === "mc" || appMode === "practice"
          ? [
              {
                type: "mc",
                topic: "Dynamics",
                subtopic: "Newton's Laws",
                question: "Calculate the acceleration of a 5 kg mass acted on by a 20 N force.",
                options: ["2 ms⁻²", "4 ms⁻²", "5 ms⁻²", "100 ms⁻²"],
                answer: 1,
                explanation: "a = F/m = 20/5 = 4 ms⁻²",
              },
              {
                type: "mc",
                topic: "Dynamics",
                subtopic: "Newton's Laws",
                question: "Which of Newton's laws states that for every action there is an equal and opposite reaction?",
                options: ["First Law", "Second Law", "Third Law", "Law of Gravitation"],
                answer: 2,
                explanation: "Newton's Third Law states that forces always occur in pairs - action and reaction.",
              },
              {
                type: "mc",
                topic: "Waves",
                subtopic: "Wave properties",
                question: "A wave has a frequency of 50 Hz and a wavelength of 2 m. What is its speed?",
                options: ["25 ms⁻¹", "52 ms⁻¹", "100 ms⁻¹", "0.04 ms⁻¹"],
                answer: 2,
                explanation: "v = fλ = 50 × 2 = 100 ms⁻¹",
              },
            ]
          : [
              {
                type: "paper",
                topic: "Dynamics",
                subtopic: "Gravity",
                question: "A ball is dropped from a height of 20 m.",
                parts: [
                  {
                    id: "a",
                    text: "Calculate the time taken for the ball to hit the ground.",
                    marks: 3,
                    answer: "2.02 s",
                    markingScheme:
                      "Using s = ut + ½at², with u = 0, s = 20 m, a = 9.8 ms⁻². 20 = 0 + ½(9.8)t². t² = 4.08, t = 2.02 s",
                  },
                  {
                    id: "b",
                    text: "Calculate the velocity of the ball just before it hits the ground.",
                    marks: 2,
                    answer: "19.8 ms⁻¹",
                    markingScheme: "Using v = u + at = 0 + 9.8 × 2.02 = 19.8 ms⁻¹",
                  },
                ],
              },
            ]
      )
      setView("quiz")
    }
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}
    >
      <Navbar
        view={view}
        appMode={appMode}
        selectedLevel={selectedLevel}
        selectedSubject={selectedSubject}
        onHome={() => setView("subject-select")}
        isDarkMode={isDarkMode}
        currentUser={currentUser}
        onSignInClick={() => setAuthModalOpen(true)}
        onSignOut={handleSignOut}
        onClassesClick={() => setClassesModalOpen(true)}
        onProfileClick={() => setProfileModalOpen(true)}
      />
      <main className="pb-20">
        {view === "subject-select" && <SubjectSelection onSelectSubject={handleSubjectSelect} isDarkMode={isDarkMode} />}
        {view === "landing" && (
          <Landing
            onSelectLevel={handleLevelSelect}
            onBack={() => setView("subject-select")}
            selectedSubject={selectedSubject}
            isDarkMode={isDarkMode}
          />
        )}
        {view === "mode" && (
          <ModeSelection
            selectedLevel={selectedLevel}
            selectedSubject={selectedSubject}
            onSelectMode={handleModeSelect}
            onBack={() => {
              // If user has a pre-selected level for this subject, go back to subject select
              if (currentUser?.accountType === "pupil" && currentUser.subjectLevels?.[selectedSubject] && currentUser.subjectLevels[selectedSubject] !== "not sitting") {
                setView("subject-select")
              } else {
                setView("landing")
              }
            }}
            isDarkMode={isDarkMode}
          />
        )}
        {view === "setup" && (
          <SetupView
            selectedLevel={selectedLevel}
            selectedSubject={selectedSubject}
            appMode={appMode}
            onGenerate={generateQuestions}
            isGenerating={isGenerating}
            onBack={() => setView("mode")}
            includeALevel={includeALevel}
            setIncludeALevel={setIncludeALevel}
            includeOpenEnded={includeOpenEnded}
            setIncludeOpenEnded={setIncludeOpenEnded}
            includeMultiTopic={includeMultiTopic}
            setIncludeMultiTopic={setIncludeMultiTopic}
            isDarkMode={isDarkMode}
            weakTopics={weakTopics}
            userCoverage={userCoverage}
            topicPerformance={topicPerformance}
            timingMode={timingMode}
            setTimingMode={setTimingMode}
            numberOfQuestions={numberOfQuestions}
            setNumberOfQuestions={setNumberOfQuestions}
            questionSource={questionSource}
            setQuestionSource={setQuestionSource}
            availablePastPapers={PAST_PAPER_BANKS[selectedLevel] || []}
          />
        )}
        {view === "quiz" && (
          <Quiz
            currentQuestions={currentQuestions}
            currentQuestionIdx={currentQuestionIdx}
            appMode={appMode}
            paperAnswers={paperAnswers}
            setPaperAnswers={(id, val) => setPaperAnswers((prev) => ({ ...prev, [id]: val }))}
            visibleAnswers={visibleAnswers}
            toggleAnswer={(id) => setVisibleAnswers((prev) => ({ ...prev, [id]: !prev[id] }))}
            paperMarks={paperMarks}
            handleMarkSelect={(id, val) => setPaperMarks((prev) => ({ ...prev, [id]: val }))}
            userSelections={userSelections}
            handleMCSelect={(qIdx, optIdx) => setUserSelections((prev) => ({ ...prev, [qIdx]: optIdx }))}
            onBackToSetup={() => setView("setup")}
            onPrev={() => setCurrentQuestionIdx((i) => i - 1)}
            onNext={() => (currentQuestionIdx < currentQuestions.length - 1 ? setCurrentQuestionIdx((i) => i + 1) : handleFinishQuiz())}
            isDarkMode={isDarkMode}
            timingMode={timingMode}
            selectedSubject={selectedSubject}
          />
        )}
        {view === "results" && (
          <Results
            paperMarks={paperMarks}
            userSelections={userSelections}
            currentQuestions={currentQuestions}
            appMode={appMode}
            onHome={() => setView("landing")}
          />
        )}
        {view === "definitions" && (
          <DefinitionsMode
            selectedLevel={selectedLevel}
            selectedSubject={selectedSubject}
            onBack={() => setView("mode")}
            isDarkMode={isDarkMode}
            currentUser={currentUser}
          />
        )}
        {view === "calculations" && (
          <CalculationsMode
            selectedLevel={selectedLevel}
            onBack={() => setView("mode")}
            isDarkMode={isDarkMode}
            currentUser={currentUser}
          />
        )}
        {view === "assignment" && (
          <AssignmentMode
            selectedLevel={selectedLevel}
            onBack={() => setView("mode")}
            isDarkMode={isDarkMode}
          />
        )}
        {view === "exam-paper" && (
          <ExamPaperMode
            selectedLevel={selectedLevel}
            onBack={() => setView("mode")}
            isDarkMode={isDarkMode}
            currentUserId={currentUser?.id}
          />
        )}
        {view === "electronics-tool" && (
          <ElectronicsToolMode
            appMode={appMode}
            onBack={() => setView("mode")}
            isDarkMode={isDarkMode}
          />
        )}
      </main>
      <FloatingMenu isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} openModal={setActiveModal} view={view} currentUser={currentUser} />
      <GenericModal
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        userCoverage={userCoverage}
        onToggleTopic={(t) => setUserCoverage((p) => ({ ...p, [t]: !p[t] }))}
        selectedLevel={selectedLevel}
        selectedSubject={selectedSubject}
        isDarkMode={isDarkMode}
        topicPerformance={topicPerformance}
        currentUser={currentUser}
      />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSignIn={handleSignIn}
        isDarkMode={isDarkMode}
      />
      {classesModalOpen && currentUser && (
        <ClassManagement
          currentUser={currentUser}
          isDarkMode={isDarkMode}
          onClose={() => setClassesModalOpen(false)}
        />
      )}
      {profileModalOpen && currentUser && (
        <ProfileModal
          currentUser={currentUser}
          isDarkMode={isDarkMode}
          onClose={() => setProfileModalOpen(false)}
          onUpdateUser={(updated) => setCurrentUser(updated)}
        />
      )}
      {/* "Wrong place" popup for "not sitting" subjects */}
      {wrongPlaceSubject && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-3xl shadow-2xl border-4 border-[#800000] p-8 text-center animate-in fade-in zoom-in-95 ${isDarkMode ? "bg-slate-900" : "bg-white"}`}>
            <div className="text-5xl mb-4">🤔</div>
            <h2 className="text-2xl font-black mb-3">I think you&apos;re in the wrong place!</h2>
            <p className={`text-sm mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              You&apos;ve set <strong>{wrongPlaceSubject}</strong> as <strong>&quot;Not Sitting&quot;</strong> in your profile. Head back and choose a subject you&apos;re studying, or update your profile to change your levels.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setWrongPlaceSubject(null); setView("subject-select") }}
                className="w-full py-3 bg-[#800000] hover:bg-[#600000] text-white rounded-xl font-bold text-sm transition-colors"
              >
                ← Back to Subjects
              </button>
              <button
                onClick={() => { setWrongPlaceSubject(null); setProfileModalOpen(true) }}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-colors border-2 ${isDarkMode ? "border-slate-600 text-slate-300 hover:border-slate-400" : "border-slate-200 text-slate-600 hover:border-slate-400"}`}
              >
                Update My Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
