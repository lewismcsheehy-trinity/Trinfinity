"use client"

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react"
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
}

type AppMode = "mc" | "paper" | "retrieval" | "definitions" | "calculations" | "assignment" | "practice" | null
type TimingMode = "relaxed" | "exam" | "none"
type ViewType = "landing" | "mode" | "setup" | "quiz" | "results" | "definitions" | "calculations" | "assignment"

interface MCQuestion {
  type: "mc"
  topic: string
  subtopic: string
  question: string
  options: string[]
  answer: number
  explanation: string
}

interface PaperPart {
  id: string
  text: string
  marks: number
  answer: string
  markingScheme: string
}

interface PaperQuestion {
  type: "paper"
  topic: string
  subtopic: string
  question: string
  parts: PaperPart[]
}

type Question = MCQuestion | PaperQuestion

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
  { term: "Electromagnetic Spectrum", definition: "A group of all the types of electromagnetic radiation ordered in terms of their wavelength/frequency.", topic: "Waves", level: "National 5", keywords: ["radiation", "wavelength", "frequency"] },
  { term: "Refraction", definition: "The change in speed of light as it passes between media.", topic: "Waves", level: "National 5", keywords: ["change in speed", "medium", "between"] },
  { term: "Normal", definition: "A dashed line that is drawn perpendicular (at 90°) to any surface.", topic: "Waves", level: "National 5", keywords: ["perpendicular"] },
  { term: "Angle of Incidence", definition: "The angle measured between the incident ray and the normal.", topic: "Waves", level: "National 5", keywords: ["incident ray", "normal"] },
  { term: "Angle of Refraction", definition: "The angle measured between the refracted ray and the normal.", topic: "Waves", level: "National 5", keywords: ["refracted ray", "normal"] },

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
]

const VALID_LEVELS = ["National 5", "Higher", "Advanced Higher"]

// Unit → topic mapping per qualification level (used in Definitions mode)
const DEF_UNIT_TOPICS: Record<string, Record<string, string[]>> = {
  "National 5": {
    Dynamics: ["Vectors and Scalars", "Velocity-time graphs", "Acceleration", "Newton's Laws", "Projectile Motion"],
    Space: ["Space Exploration", "Cosmology"],
    "Properties of Matter": ["Specific Heat Capacity", "Pressure, Kinetic Theory and Gas Laws", "Specific Latent Heat"],
    Electricity: ["Current, voltage and resistance", "Electrical Power"],
    Waves: ["Wave properties", "Refraction of light", "EM Spectrum"],
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
  difficulty: DifficultyLevel = "medium"
): DefMCQuestion[] {
  const shuffled = shuffleArray(entries).slice(0, Math.min(count, entries.length))
  return shuffled.map((entry) => {
    let wrongPool: DefinitionEntry[]
    if (difficulty === "easy") {
      wrongPool = allEntries.filter((e) => e.term !== entry.term && e.topic !== entry.topic)
    } else if (difficulty === "medium") {
      wrongPool = allEntries.filter((e) => e.term !== entry.term && e.level === entry.level)
    } else {
      const entryKws = new Set(entry.keywords)
      const withSharedKws = allEntries.filter(
        (e) => e.term !== entry.term && e.keywords.some((k) => entryKws.has(k))
      )
      wrongPool = withSharedKws.length >= 3 ? withSharedKws : allEntries.filter((e) => e.term !== entry.term && e.level === entry.level)
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

// --- Definitions Mode Component ---

function DefinitionsMode({
  selectedLevel,
  onBack,
  isDarkMode,
}: {
  selectedLevel: string
  onBack: () => void
  isDarkMode: boolean
}) {
  type DefPhase = "unit-select" | "topic-select" | "quiz" | "results" | "progress"
  type QuizType = "mc" | "cloze" | "match" | "spot-mistake" | "swapped" | "keyword-builder"

  const [phase, setPhase] = useState<DefPhase>("unit-select")
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [quizType, setQuizType] = useState<QuizType>("mc")
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("medium")
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
  const [progress, setProgress] = useState<Record<string, DefProgress>>(() => loadDefProgress(selectedLevel))

  const unitTopicsForLevel = DEF_UNIT_TOPICS[selectedLevel] ?? {}
  const levelEntries = DEFINITIONS_BANK.filter((e) => e.level === selectedLevel)
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
    let qs: DefQuestion[]
    if (quizType === "mc") qs = generateMCDefQuestions(ordered, DEFINITIONS_BANK, 8, difficulty)
    else if (quizType === "cloze") qs = generateClozeDefQuestions(ordered, 8, difficulty)
    else if (quizType === "match") qs = generateMatchDefQuestions(ordered, difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 10, difficulty)
    else if (quizType === "spot-mistake") qs = generateSpotMistakeQuestions(ordered, DEFINITIONS_BANK, 6, difficulty)
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
    saveDefProgress(selectedLevel, updated)
    setSubmitted(true)
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
      { id: "cloze" as const, icon: Type, title: "Cloze Test", desc: "Fill in missing keywords" },
      { id: "match" as const, icon: Grid3X3, title: "Match Up", desc: "Match terms to definitions" },
      { id: "spot-mistake" as const, icon: AlertTriangle, title: "Spot the Mistake", desc: "Find the error in the definition" },
      { id: "swapped" as const, icon: ArrowLeftRight, title: "Swapped Definitions", desc: "Identify incorrectly matched pairs" },
      { id: "keyword-builder" as const, icon: Key, title: "Keyword Builder", desc: "Arrange words into a definition" },
    ]
    const difficulties: { id: DifficultyLevel; label: string }[] = [
      { id: "easy", label: "Easy" },
      { id: "medium", label: "Medium" },
      { id: "hard", label: "Hard" },
    ]
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

          {/* Quiz type selection */}
          <div className={`rounded-2xl border-2 p-6 mb-6 ${cardBase}`}>
            <h3 className="text-lg font-black mb-4">Quiz Format</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {quizTypes.map((qt) => (
                <button key={qt.id} onClick={() => setQuizType(qt.id)}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${quizType === qt.id ? "border-[#800000] bg-red-50 dark:bg-red-900/20 text-[#800000]" : isDarkMode ? "border-slate-600 hover:border-slate-400" : "border-slate-200 hover:border-slate-400"}`}>
                  <qt.icon className="w-6 h-6 mb-2" />
                  <span className="font-black text-sm">{qt.title}</span>
                  <span className={`text-xs mt-1 text-center ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{qt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty selection */}
          <div className={`rounded-2xl border-2 p-6 mb-6 ${cardBase}`}>
            <h3 className="text-lg font-black mb-4">Difficulty</h3>
            <div className="grid grid-cols-3 gap-3">
              {difficulties.map((d) => (
                <button key={d.id} onClick={() => setDifficulty(d.id)}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${difficulty === d.id ? diffBg(d.id) : isDarkMode ? "border-slate-600 hover:border-slate-400" : "border-slate-200 hover:border-slate-400"}`}>
                  <span className={`font-black text-sm ${difficulty === d.id ? diffColour(d.id) : ""}`}>{d.label}</span>
                  <span className={`text-xs mt-1 text-center ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{diffDesc(quizType, d.id)}</span>
                </button>
              ))}
            </div>
          </div>

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

          <button onClick={startQuiz} disabled={selectedTopics.length === 0}
            className="w-full py-4 rounded-2xl font-black text-lg bg-[#800000] text-white hover:bg-[#600000] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Start Quiz ({selectedTopics.reduce((acc, t) => acc + levelEntries.filter((e) => e.topic === t).length, 0)} terms available)
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
    stem: "A student calculated the weight of a 5 kg mass on Earth (g = 9.8 Nkg⁻¹). Identify the mistake in their working.",
    equation: "W = m × g",
    options: [
      "W = 5 ÷ 9.8 = 0.51 N   ✗ (divided instead of multiplied)",
      "W = 5 × 9.8 = 49 N      ✓ (correct working)",
      "W = 5 + 9.8 = 14.8 N   ✗ (added instead of multiplied)",
      "W = 9.8 − 5 = 4.8 N    ✗ (subtracted instead of multiplied)",
    ],
    correctOption: 0,
    mistakeOptionIndex: 0,
    markScheme: "The student divided by g instead of multiplying. Correct: W = m × g = 5 × 9.8 = 49 N.",
  },
  {
    id: "cm-2",
    stem: "A student calculated the frequency of a wave (v = 340 ms⁻¹, λ = 0.68 m). Spot the error.",
    equation: "f = v ÷ λ",
    options: [
      "f = 340 × 0.68 = 231.2 Hz   ✗ (multiplied instead of divided)",
      "f = 340 ÷ 0.68 = 500 Hz     ✓ (correct working)",
      "f = 0.68 ÷ 340 = 0.002 Hz  ✗ (inverted the fraction)",
      "f = 340 + 0.68 = 340.68 Hz ✗ (added instead of divided)",
    ],
    correctOption: 0,
    mistakeOptionIndex: 0,
    markScheme: "The student multiplied v × λ instead of dividing. Correct: f = v ÷ λ = 340 ÷ 0.68 = 500 Hz.",
  },
  {
    id: "cm-3",
    stem: "A student used F = ma to find the force on a 2 kg object accelerating at 3 ms⁻². Find the mistake.",
    equation: "F = m × a",
    options: [
      "F = 2 × 3 = 6 N            ✓ (correct working)",
      "F = 2 + 3 = 5 N             ✗ (added instead of multiplied)",
      "F = 3 ÷ 2 = 1.5 N          ✗ (divided a by m instead of multiplying)",
      "F = 2 − 3 = −1 N           ✗ (subtracted instead of multiplied)",
    ],
    correctOption: 1,
    mistakeOptionIndex: 1,
    markScheme: "The student added m and a instead of multiplying. Correct: F = m × a = 2 × 3 = 6 N.",
  },
]

function CalculationsMode({
  selectedLevel,
  onBack,
  isDarkMode,
}: {
  selectedLevel: string
  onBack: () => void
  isDarkMode: boolean
}) {
  type CalcSubMode = "single-equation" | "exam-level" | "correct-me" | null
  type CalcPhase = "hub" | "level-select" | "quiz" | "results"

  const [phase, setPhase] = useState<CalcPhase>("hub")
  const [subMode, setSubMode] = useState<CalcSubMode>(null)
  const [eqLevel, setEqLevel] = useState<number>(1)
  const [questions, setQuestions] = useState<CalcQuestion[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [typedAnswers, setTypedAnswers] = useState<Record<number, string>>({})
  const [mcAnswers, setMcAnswers] = useState<Record<number, number>>({})
  /** For multi-step exam questions, track typed answers per step */
  const [stepTypedAnswers, setStepTypedAnswers] = useState<Record<string, string>>({})
  const [stepMcAnswers, setStepMcAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [answerMode, setAnswerMode] = useState<"mc" | "typed">("mc")
  /** For correct-me hotspot: which option the user tapped */
  const [hotspotChoice, setHotspotChoice] = useState<Record<number, number>>({})
  const [currentStepIdx, setCurrentStepIdx] = useState(0)

  const cardBase = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-xl"
  const btnBase = `rounded-2xl font-black border-2 transition-all px-5 py-3`

  const startSingleEq = (level: number) => {
    setEqLevel(level)
    setQuestions(getDemoSingleEqQuestions(level))
    setCurrentIdx(0)
    setTypedAnswers({})
    setMcAnswers({})
    setSubmitted(false)
    setHotspotChoice({})
    setPhase("quiz")
  }

  const startExamLevel = () => {
    setQuestions(CALC_EXAM_QUESTIONS)
    setCurrentIdx(0)
    setCurrentStepIdx(0)
    setStepTypedAnswers({})
    setStepMcAnswers({})
    setSubmitted(false)
    setPhase("quiz")
  }

  const startCorrectMe = () => {
    setQuestions(CALC_CORRECT_ME_QUESTIONS)
    setCurrentIdx(0)
    setHotspotChoice({})
    setSubmitted(false)
    setPhase("quiz")
  }

  const currentQ = questions[currentIdx]

  // ── Hub ──────────────────────────────────────────────────────────────────
  if (phase === "hub") {
    const modes = [
      {
        id: "single-equation" as const,
        icon: "🎯",
        title: "Single Equation Mastery",
        desc: "Progressive difficulty to master individual equations — from basic substitution through to complex multi-step rearrangements with non-SI units.",
        color: "from-blue-600 to-blue-800",
        accent: "border-blue-500",
      },
      {
        id: "exam-level" as const,
        icon: "📋",
        title: "Exam Level Calculations",
        desc: "Multi-step problems that chain different equations together — just like SQA exam questions.",
        color: "from-[#800000] to-[#600000]",
        accent: "border-red-700",
      },
      {
        id: "correct-me" as const,
        icon: "🔍",
        title: "Correct Me!",
        desc: "Spot and fix mistakes in worked calculations. Tap the hotspot to identify the error, then explain the correct working.",
        color: "from-amber-600 to-amber-800",
        accent: "border-amber-500",
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
          <div className="grid md:grid-cols-3 gap-6">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setSubMode(m.id)
                  if (m.id === "single-equation") setPhase("level-select")
                  else if (m.id === "exam-level") startExamLevel()
                  else startCorrectMe()
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

  // ── Level Select (Single Equation Mastery) ───────────────────────────────
  if (phase === "level-select") {
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
          <h2 className="text-3xl font-black mb-2">Single Equation Mastery</h2>
          <p className={`mb-8 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Select a difficulty level — they unlock in order. Start at Level 1 and progress when ready.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {CALC_SINGLE_EQ_LEVELS.map((l) => (
              <button
                key={l.level}
                onClick={() => startSingleEq(l.level)}
                className={`flex items-start gap-4 text-left p-5 rounded-2xl border-2 transition-all hover:scale-[1.01] ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 hover:border-amber-500"
                    : "bg-white border-slate-200 hover:border-[#800000] shadow-md"
                }`}
              >
                <span className="text-3xl">{l.emoji}</span>
                <div>
                  <p className="font-black text-lg">{l.label}</p>
                  <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{l.desc}</p>
                </div>
              </button>
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
    const isSingle = subMode === "single-equation"

    // Determine if typed or MC for single-equation
    const useMC = isCorrectMe || (isSingle && (eqLevel === 1 || eqLevel === 3))
    const useTyped = isSingle && !useMC

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
        setPhase("results")
      } else {
        setCurrentIdx((i) => i + 1)
        setCurrentStepIdx(0)
        setSubmitted(false)
      }
    }

    const activeQ = currentStep ?? currentQ

    return (
      <div className="pt-24 min-h-screen p-6 animate-in fade-in">
        <div className="max-w-2xl mx-auto">
          {/* Progress bar */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                setPhase(subMode === "single-equation" ? "level-select" : "hub")
                setSubmitted(false)
              }}
              className="flex items-center gap-1 text-slate-500 hover:text-[#800000] font-bold uppercase text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              {subMode === "single-equation" ? "Levels" : "Hub"}
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
            {/* Sub-mode badge */}
            <div className="flex items-center gap-2 mb-4">
              {isSingle && (
                <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  {CALC_SINGLE_EQ_LEVELS[eqLevel - 1].label}
                </span>
              )}
              {isExam && (
                <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-[#800000] dark:text-red-300">
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
            {isCorrectMe && currentQ.options ? (
              <div className="space-y-3 mt-4">
                <p className={`text-sm font-black uppercase tracking-wide mb-2 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  🔍 Which line contains the mistake?
                </p>
                {currentQ.options.map((opt, oi) => {
                  const chosen = hotspotChoice[currentIdx] === oi
                  const showResult = submitted
                  const isCorrectChoice = oi === currentQ.correctOption
                  let cls = `w-full text-left px-4 py-3 rounded-xl border-2 font-mono text-sm transition-all `
                  if (showResult) {
                    if (isCorrectChoice) cls += "border-green-500 bg-green-50 dark:bg-green-900/20 font-black"
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
                    <button key={oi} disabled={submitted} onClick={() => setHotspotChoice((p) => ({ ...p, [currentIdx]: oi }))} className={cls}>
                      {opt}
                    </button>
                  )
                })}
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
            {subMode === "single-equation" && (
              <p className={`text-sm mt-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Completed: <strong>{CALC_SINGLE_EQ_LEVELS[eqLevel - 1].label}</strong> (Level {eqLevel})
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
            <button
              onClick={() => {
                if (subMode === "single-equation") startSingleEq(eqLevel)
                else if (subMode === "exam-level") startExamLevel()
                else startCorrectMe()
              }}
              className="flex-1 py-3 rounded-xl font-black bg-[#800000] text-white hover:bg-[#600000] transition-colors"
            >
              Try Again
            </button>
            {subMode === "single-equation" && eqLevel < 8 && (
              <button
                onClick={() => startSingleEq(eqLevel + 1)}
                className="flex-1 py-3 rounded-xl font-black bg-blue-700 text-white hover:bg-blue-800 transition-colors"
              >
                Next Level →
              </button>
            )}
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

function Navbar({
  view,
  appMode,
  selectedLevel,
  onHome,
  isDarkMode,
}: {
  view: ViewType
  appMode: AppMode
  selectedLevel: string
  onHome: () => void
  isDarkMode: boolean
}) {
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
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Physics Dept</span>
        </div>
      </div>

      {view !== "landing" && (
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
        </div>
      )}

      <button onClick={onHome} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
        <Home className="w-6 h-6" />
      </button>
    </nav>
  )
}

function Landing({ onSelectLevel, isDarkMode }: { onSelectLevel: (level: string) => void; isDarkMode: boolean }) {
  const levels = [
    { id: "National 5", desc: "SCQF Level 5 Fundamentals" },
    { id: "Higher", desc: "SCQF Level 6 Advanced Concepts" },
    { id: "Advanced Higher", desc: "SCQF Level 7 Calculus Based" },
  ]

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
            Select your academic level to access custom physics assessments and mark schemes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => onSelectLevel(level.id)}
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
                {level.id}
              </div>
              <p className="text-sm text-slate-500">{level.desc}</p>
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

function ModeSelection({
  onSelectMode,
  onBack,
  selectedLevel,
  isDarkMode,
}: {
  onSelectMode: (mode: AppMode) => void
  onBack: () => void
  selectedLevel: string
  isDarkMode: boolean
}) {
  const modes = [
    { id: "mc" as const, icon: MousePointer2, title: "Multiple Choice", desc: "Quick-fire recall testing" },
    { id: "paper" as const, icon: FileText, title: "Paper Questions", desc: "Exam-style written problems" },
    { id: "retrieval" as const, icon: Sparkles, title: "Retrieval", desc: "Active recall practice" },
    { id: "definitions" as const, icon: FileText, title: "Definitions", desc: "Key terms and concepts" },
    { id: "calculations" as const, icon: Zap, title: "Calculations", desc: "Numerical problem solving" },
    { id: "assignment" as const, icon: ClipboardList, title: "Assignment", desc: "Structured task practice" },
    { id: "practice" as const, icon: BookOpen, title: "Practice", desc: "Progress-based adaptive practice" },
  ]

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
              onClick={() => onSelectMode(mode.id)}
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
              <div className="absolute top-0 right-0 p-4 transition-opacity opacity-5 group-hover:opacity-10">
                <mode.icon className="w-24 h-24" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

interface WeakTopic {
  topic: string
  score: number
}

function SetupView({
  selectedLevel,
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
}: {
  selectedLevel: string
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
}) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const subtopics = QA_SUBTOPICS[selectedLevel] || []
  const isPracticeOrMC = appMode === "mc" || appMode === "practice"

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
                {subtopics.map((topic) => {
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
              {[
                { value: "none" as TimingMode, label: "No Time Limit", desc: "Take as long as you need" },
                { value: "relaxed" as TimingMode, label: "Relaxed", desc: "0.5 marks per minute (2 min/mark)" },
                { value: "exam" as TimingMode, label: "Exam Conditions", desc: "0.9 marks per minute (~67 sec/mark)" },
              ].map((option) => (
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
    const secondsPerMark = timingMode === "relaxed" ? 120 : Math.round(60 / 0.9)
    setTimeLeft(marks * secondsPerMark)
    setTimerExpired(false)
  }, [currentQuestionIdx, timingMode, currentQuestions])

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
              <h2 className="text-lg font-black text-[#800000] dark:text-red-500 line-clamp-1">{q.topic}</h2>
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

          {appMode === "mc" && q.type === "mc" ? (
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
    if (appMode === "mc") {
      const correct = currentQuestions.reduce(
        (acc, q, idx) => acc + (q.type === "mc" && userSelections[idx] === q.answer ? 1 : 0),
        0
      )
      return {
        score: correct,
        total: currentQuestions.length,
        percentage: Math.round((correct / currentQuestions.length) * 100),
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

function FloatingMenu({
  isDarkMode,
  toggleDarkMode,
  openModal,
  view,
}: {
  isDarkMode: boolean
  toggleDarkMode: () => void
  openModal: (modal: string) => void
  view: ViewType
}) {
const [isOpen, setIsOpen] = useState(false)
  const showSyllabus = view === "mode" || view === "setup"
  const showProgress = view !== "landing"
  
  return (
  <div className="fixed bottom-6 right-6 z-[150] flex flex-col items-end gap-3">
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
  isDarkMode,
  topicPerformance,
}: {
  activeModal: string | null
  onClose: () => void
  userCoverage: Record<string, boolean>
  onToggleTopic: (topic: string) => void
  selectedLevel: string
  isDarkMode: boolean
  topicPerformance: Record<string, { correct: number; total: number }>
}) {
  if (!activeModal) return null

  const subtopics = QA_SUBTOPICS[selectedLevel] || []
  
  // Calculate overall stats
  const totalQuestions = Object.values(topicPerformance).reduce((sum, p) => sum + p.total, 0)
  const totalCorrect = Object.values(topicPerformance).reduce((sum, p) => sum + p.correct, 0)
  const overallPercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  const topicsAttempted = Object.keys(topicPerformance).filter(t => topicPerformance[t].total > 0).length

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 border-4 border-[#800000] ${
          isDarkMode ? "bg-slate-900" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-black italic tracking-tighter uppercase">
            {activeModal === "progress" ? "My Progress" : activeModal}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <X />
          </button>
        </div>
        
        {activeModal === "progress" && (
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
          </div>
        )}
        
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
      </div>
    </div>
  )
}

// --- Main App Logic ---

export default function App() {
  const [view, setView] = useState<ViewType>("landing")
  const [selectedLevel, setSelectedLevel] = useState("National 5")
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

  // Calculate weak topics based on performance data
  const weakTopics = useMemo(() => {
    const subtopics = QA_SUBTOPICS[selectedLevel] || []
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
  }, [selectedLevel, topicPerformance])

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }, [isDarkMode])

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level)
    setView("mode")
  }

  const handleModeSelect = (mode: AppMode) => {
    setAppMode(mode)
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
  }

  const handleFinishQuiz = () => {
    updateTopicPerformance()
    setView("results")
  }

  const generateQuestions = async (topicString: string) => {
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
        appMode === "mc"
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
      <Navbar view={view} appMode={appMode} selectedLevel={selectedLevel} onHome={() => setView("landing")} isDarkMode={isDarkMode} />
      <main className="pb-20">
        {view === "landing" && <Landing onSelectLevel={handleLevelSelect} isDarkMode={isDarkMode} />}
        {view === "mode" && (
          <ModeSelection
            selectedLevel={selectedLevel}
            onSelectMode={handleModeSelect}
            onBack={() => setView("landing")}
            isDarkMode={isDarkMode}
          />
        )}
        {view === "setup" && (
          <SetupView
            selectedLevel={selectedLevel}
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
            onBack={() => setView("mode")}
            isDarkMode={isDarkMode}
          />
        )}
        {view === "calculations" && (
          <CalculationsMode
            selectedLevel={selectedLevel}
            onBack={() => setView("mode")}
            isDarkMode={isDarkMode}
          />
        )}
        {view === "assignment" && (
          <AssignmentMode
            selectedLevel={selectedLevel}
            onBack={() => setView("mode")}
            isDarkMode={isDarkMode}
          />
        )}
      </main>
      <FloatingMenu isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} openModal={setActiveModal} view={view} />
      <GenericModal
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        userCoverage={userCoverage}
        onToggleTopic={(t) => setUserCoverage((p) => ({ ...p, [t]: !p[t] }))}
        selectedLevel={selectedLevel}
        isDarkMode={isDarkMode}
        topicPerformance={topicPerformance}
      />
    </div>
  )
}
