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
type ViewType = "landing" | "mode" | "setup" | "quiz" | "results" | "definitions"

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
  keyword: string
  blankedDefinition: string
}

interface DefMatchQuestion {
  type: "def-match"
  pairs: { term: string; definition: string }[]
}

type DefQuestion = DefMCQuestion | DefClozeQuestion | DefMatchQuestion

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

  // National 5 — Wave properties
  { term: "Amplitude", definition: "The maximum displacement of a wave from its undisturbed rest position", topic: "Wave properties", level: "National 5", keywords: ["displacement"] },
  { term: "Frequency", definition: "The number of complete waves passing a fixed point per second", topic: "Wave properties", level: "National 5", keywords: ["waves", "second"] },
  { term: "Wavelength", definition: "The distance between two successive identical points on a wave, such as crest to crest", topic: "Wave properties", level: "National 5", keywords: ["distance", "crest"] },
  { term: "Transverse wave", definition: "A wave in which the oscillations are perpendicular to the direction of propagation", topic: "Wave properties", level: "National 5", keywords: ["perpendicular", "propagation"] },
  { term: "Longitudinal wave", definition: "A wave in which the oscillations are parallel to the direction of propagation", topic: "Wave properties", level: "National 5", keywords: ["parallel", "propagation"] },

  // National 5 — Refraction of light
  { term: "Refraction", definition: "The change in direction of a wave as it passes from one medium to another due to a change in speed", topic: "Refraction of light", level: "National 5", keywords: ["direction", "speed"] },
  { term: "Critical angle", definition: "The angle of incidence beyond which total internal reflection occurs", topic: "Refraction of light", level: "National 5", keywords: ["total", "internal", "reflection"] },
  { term: "Total internal reflection", definition: "When a wave is completely reflected back into the original medium when the angle of incidence exceeds the critical angle", topic: "Refraction of light", level: "National 5", keywords: ["reflected", "critical"] },

  // National 5 — EM Spectrum
  { term: "Electromagnetic spectrum", definition: "The complete range of electromagnetic radiation ordered by frequency and wavelength", topic: "EM Spectrum", level: "National 5", keywords: ["frequency", "wavelength"] },
  { term: "Electromagnetic wave", definition: "A transverse wave consisting of oscillating electric and magnetic fields that travels at the speed of light", topic: "EM Spectrum", level: "National 5", keywords: ["electric", "magnetic", "light"] },

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

function generateMCDefQuestions(entries: DefinitionEntry[], allEntries: DefinitionEntry[], count: number = 5): DefMCQuestion[] {
  const shuffled = [...entries].sort(() => Math.random() - 0.5).slice(0, Math.min(count, entries.length))
  return shuffled.map((entry) => {
    const wrongPool = allEntries.filter((e) => e.term !== entry.term)
    const wrong = [...wrongPool].sort(() => Math.random() - 0.5).slice(0, 3)
    const options = [entry.definition, ...wrong.map((e) => e.definition)].sort(() => Math.random() - 0.5)
    return { type: "def-mc" as const, entry, options, answer: options.indexOf(entry.definition) }
  })
}

function generateClozeDefQuestions(entries: DefinitionEntry[], count: number = 5): DefClozeQuestion[] {
  const eligible = entries.filter((e) => e.keywords.length > 0)
  const shuffled = [...eligible].sort(() => Math.random() - 0.5).slice(0, Math.min(count, eligible.length))
  return shuffled.map((entry) => {
    const keyword = entry.keywords[Math.floor(Math.random() * entry.keywords.length)]
    const blankedDefinition = entry.definition.replace(new RegExp(`\\b${keyword}\\b`, "gi"), "___")
    return { type: "def-cloze" as const, entry, keyword, blankedDefinition }
  })
}

function generateMatchDefQuestions(entries: DefinitionEntry[], count: number = 5): DefMatchQuestion[] {
  const shuffled = [...entries].sort(() => Math.random() - 0.5).slice(0, Math.min(count, entries.length))
  const pairs = shuffled.map((e) => ({ term: e.term, definition: e.definition }))
  return [{ type: "def-match" as const, pairs }]
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
  type DefPhase = "topic-select" | "quiz" | "results"
  type QuizType = "mc" | "cloze" | "match"

  const [phase, setPhase] = useState<DefPhase>("topic-select")
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [quizType, setQuizType] = useState<QuizType>("mc")
  const [questions, setQuestions] = useState<DefQuestion[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [mcAnswers, setMcAnswers] = useState<Record<number, number>>({})
  const [clozeAnswers, setClozeAnswers] = useState<Record<number, string>>({})
  const [matchSelections, setMatchSelections] = useState<Record<string, string>>({})
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [shuffledMatchDefs, setShuffledMatchDefs] = useState<{ term: string; definition: string }[]>([])

  const levelEntries = DEFINITIONS_BANK.filter((e) => e.level === selectedLevel)
  const topics = [...new Set(levelEntries.map((e) => e.topic))]

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]))
  }

  const selectAll = () => setSelectedTopics([...topics])
  const clearAll = () => setSelectedTopics([])

  const startQuiz = () => {
    const filtered = levelEntries.filter((e) => selectedTopics.includes(e.topic))
    if (filtered.length === 0) return
    let qs: DefQuestion[]
    if (quizType === "mc") qs = generateMCDefQuestions(filtered, DEFINITIONS_BANK, 8)
    else if (quizType === "cloze") qs = generateClozeDefQuestions(filtered, 8)
    else qs = generateMatchDefQuestions(filtered, 6)
    setQuestions(qs)
    setCurrentIdx(0)
    setMcAnswers({})
    setClozeAnswers({})
    setMatchSelections({})
    setSelectedTerm(null)
    setSubmitted(false)
    if (qs[0]?.type === "def-match") {
      setShuffledMatchDefs([...(qs[0] as DefMatchQuestion).pairs].sort(() => Math.random() - 0.5))
    }
    setPhase("quiz")
  }

  const calcScore = (): number => {
    let correct = 0
    questions.forEach((q, i) => {
      if (q.type === "def-mc") {
        if (mcAnswers[i] === q.answer) correct++
      } else if (q.type === "def-cloze") {
        const userAns = (clozeAnswers[i] || "").trim().toLowerCase()
        if (userAns === q.keyword.toLowerCase()) correct++
      } else if (q.type === "def-match") {
        q.pairs.forEach((pair) => {
          if (matchSelections[pair.term] === pair.definition) correct++
        })
      }
    })
    return correct
  }

  const totalQuestions = questions.reduce((acc, q) => {
    if (q.type === "def-match") return acc + q.pairs.length
    return acc + 1
  }, 0)

  const finishQuiz = () => {
    setSubmitted(true)
    setPhase("results")
  }

  const cardBase = isDarkMode
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-200 shadow-xl"

  // --- Phase: Topic Selection ---
  if (phase === "topic-select") {
    return (
      <div className="pt-24 min-h-screen p-6 animate-in fade-in slide-in-from-right-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-[#800000] mb-8 font-bold uppercase text-xs tracking-widest"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Modes
          </button>
          <h2 className="text-4xl font-black mb-2">Definitions</h2>
          <p className={`text-lg mb-8 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Select topics and quiz format for <span className="text-amber-600 font-bold">{selectedLevel}</span>
          </p>

          {/* Quiz type selection */}
          <div className={`rounded-2xl border-2 p-6 mb-6 ${cardBase}`}>
            <h3 className="text-lg font-black mb-4">Quiz Format</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: "mc" as const, icon: MousePointer2, title: "Multiple Choice", desc: "Pick the correct definition" },
                { id: "cloze" as const, icon: Type, title: "Cloze Test", desc: "Fill in the missing keyword" },
                { id: "match" as const, icon: Grid3X3, title: "Match Up", desc: "Match terms to definitions" },
              ].map((qt) => (
                <button
                  key={qt.id}
                  onClick={() => setQuizType(qt.id)}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                    quizType === qt.id
                      ? "border-[#800000] bg-red-50 dark:bg-red-900/20 text-[#800000]"
                      : isDarkMode
                        ? "border-slate-600 hover:border-slate-400"
                        : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <qt.icon className="w-6 h-6 mb-2" />
                  <span className="font-black text-sm">{qt.title}</span>
                  <span className={`text-xs mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{qt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Topic selection */}
          <div className={`rounded-2xl border-2 p-6 mb-6 ${cardBase}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black">Select Topics</h3>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 transition-colors"
                >
                  All
                </button>
                <button
                  onClick={clearAll}
                  className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {topics.map((topic) => {
                const count = levelEntries.filter((e) => e.topic === topic).length
                const selected = selectedTopics.includes(topic)
                return (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left transition-all ${
                      selected
                        ? "border-[#800000] bg-red-50 dark:bg-red-900/20"
                        : isDarkMode
                          ? "border-slate-600 hover:border-slate-500"
                          : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="font-semibold text-sm">{topic}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${selected ? "bg-[#800000] text-white" : isDarkMode ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <button
            onClick={startQuiz}
            disabled={selectedTopics.length === 0}
            className="w-full py-4 rounded-2xl font-black text-lg bg-[#800000] text-white hover:bg-[#600000] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
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

    return (
      <div className="pt-24 min-h-screen p-6 animate-in fade-in">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setPhase("topic-select")}
              className="flex items-center gap-2 text-slate-500 hover:text-[#800000] font-bold uppercase text-xs tracking-widest"
            >
              <ChevronLeft className="w-4 h-4" />
              Exit
            </button>
            <span className={`text-sm font-bold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              {q.type === "def-match" ? "Match Up" : `${currentIdx + 1} / ${questions.length}`}
            </span>
          </div>

          {/* Progress bar */}
          {q.type !== "def-match" && (
            <div className={`w-full h-2 rounded-full mb-6 ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>
              <div
                className="h-2 rounded-full bg-[#800000] transition-all"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>
          )}

          {/* MC Question */}
          {q.type === "def-mc" && (
            <div className={`rounded-2xl border-2 p-8 ${cardBase}`}>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 ${isDarkMode ? "bg-slate-700 text-amber-400" : "bg-amber-100 text-amber-700"}`}>
                {q.entry.topic}
              </div>
              <p className={`text-sm font-bold uppercase tracking-widest mb-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>What is the definition of…</p>
              <h3 className="text-2xl font-black mb-6">{q.entry.term}</h3>
              <div className="space-y-3">
                {q.options.map((opt, i) => {
                  const chosen = mcAnswers[currentIdx] === i
                  return (
                    <button
                      key={i}
                      onClick={() => setMcAnswers((prev) => ({ ...prev, [currentIdx]: i }))}
                      className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition-all ${
                        chosen
                          ? "border-[#800000] bg-red-50 dark:bg-red-900/20 text-[#800000]"
                          : isDarkMode
                            ? "border-slate-600 hover:border-slate-400"
                            : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
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
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 ${isDarkMode ? "bg-slate-700 text-amber-400" : "bg-amber-100 text-amber-700"}`}>
                {q.entry.topic}
              </div>
              <p className={`text-sm font-bold uppercase tracking-widest mb-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Complete the definition</p>
              <h3 className="text-2xl font-black mb-2">{q.entry.term}</h3>
              <p className={`text-lg mb-6 leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>{q.blankedDefinition}</p>
              <input
                type="text"
                value={clozeAnswers[currentIdx] || ""}
                onChange={(e) => setClozeAnswers((prev) => ({ ...prev, [currentIdx]: e.target.value }))}
                placeholder="Type the missing word…"
                className={`w-full px-4 py-3 rounded-xl border-2 font-medium text-lg outline-none transition-colors focus:border-[#800000] ${
                  isDarkMode ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" : "bg-white border-slate-200 placeholder:text-slate-400"
                }`}
              />
            </div>
          )}

          {/* Match Question */}
          {q.type === "def-match" && (
            <div className={`rounded-2xl border-2 p-6 ${cardBase}`}>
              <p className={`text-sm font-bold uppercase tracking-widest mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Click a term, then click its matching definition
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <p className={`text-xs font-black uppercase tracking-widest mb-2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Terms</p>
                  {q.pairs.map((pair) => {
                    const isMatched = matchSelections[pair.term] !== undefined
                    const isActive = selectedTerm === pair.term
                    return (
                      <button
                        key={pair.term}
                        onClick={() => {
                          if (isMatched) {
                            setMatchSelections((prev) => { const n = { ...prev }; delete n[pair.term]; return n })
                            setSelectedTerm(null)
                          } else {
                            setSelectedTerm(isActive ? null : pair.term)
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                          isMatched
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                            : isActive
                              ? "border-[#800000] bg-red-50 dark:bg-red-900/20 text-[#800000]"
                              : isDarkMode
                                ? "border-slate-600 hover:border-slate-400"
                                : "border-slate-200 hover:border-slate-400"
                        }`}
                      >
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
                      <button
                        key={pair.definition}
                        onClick={() => {
                          if (selectedTerm && !isMatched) {
                            setMatchSelections((prev) => ({ ...prev, [selectedTerm]: pair.definition }))
                            setSelectedTerm(null)
                          }
                        }}
                        disabled={isMatched || !selectedTerm}
                        className={`w-full text-left px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all ${
                          isMatched
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                            : selectedTerm
                              ? isDarkMode
                                ? "border-slate-500 hover:border-amber-400 cursor-pointer"
                                : "border-slate-300 hover:border-[#800000] cursor-pointer"
                              : isDarkMode
                                ? "border-slate-600 opacity-60"
                                : "border-slate-200 opacity-60"
                        }`}
                      >
                        {pair.definition}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {currentIdx > 0 && q.type !== "def-match" && (
              <button
                onClick={() => setCurrentIdx((i) => i - 1)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold border-2 transition-colors ${isDarkMode ? "border-slate-600 hover:border-slate-400" : "border-slate-200 hover:border-slate-400"}`}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (isLast || q.type === "def-match") finishQuiz()
                else setCurrentIdx((i) => i + 1)
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black bg-[#800000] text-white hover:bg-[#600000] transition-colors"
            >
              {isLast || q.type === "def-match" ? "Finish" : "Next"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // --- Phase: Results ---
  const score = calcScore()
  const pct = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
  const grade = pct >= 80 ? "Excellent" : pct >= 60 ? "Good" : pct >= 40 ? "Developing" : "Needs Practice"
  const gradeColor = pct >= 80 ? "text-green-600" : pct >= 60 ? "text-amber-600" : pct >= 40 ? "text-orange-500" : "text-red-600"

  return (
    <div className="pt-24 min-h-screen p-6 animate-in fade-in">
      <div className="max-w-2xl mx-auto text-center">
        <div className={`rounded-3xl border-2 p-10 mb-6 ${cardBase}`}>
          <div className="text-6xl mb-4">{pct >= 80 ? "🏆" : pct >= 60 ? "⭐" : pct >= 40 ? "📚" : "💪"}</div>
          <h2 className="text-4xl font-black mb-2">{grade}</h2>
          <p className={`text-lg mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            You scored <span className={`font-black text-2xl ${gradeColor}`}>{score}/{totalQuestions}</span> ({pct}%)
          </p>

          {/* Per-question review for MC and Cloze */}
          {questions.some((q) => q.type !== "def-match") && (
            <div className="text-left space-y-3 mt-6">
              {questions.map((q, i) => {
                if (q.type === "def-match") return null
                const isCorrect =
                  q.type === "def-mc"
                    ? mcAnswers[i] === q.answer
                    : (clozeAnswers[i] || "").trim().toLowerCase() === q.keyword.toLowerCase()
                return (
                  <div
                    key={i}
                    className={`px-4 py-3 rounded-xl border-2 text-sm ${
                      isCorrect
                        ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                        : "border-red-400 bg-red-50 dark:bg-red-900/20"
                    }`}
                  >
                    <p className="font-black">{q.entry.term}</p>
                    <p className={isDarkMode ? "text-slate-300" : "text-slate-600"}>{q.entry.definition}</p>
                    {!isCorrect && q.type === "def-mc" && (
                      <p className="text-red-600 dark:text-red-400 text-xs mt-1">
                        Your answer: {mcAnswers[i] !== undefined ? q.options[mcAnswers[i]] : "No answer"}
                      </p>
                    )}
                    {!isCorrect && q.type === "def-cloze" && (
                      <p className="text-red-600 dark:text-red-400 text-xs mt-1">
                        Your answer: "{clozeAnswers[i] || "no answer"}" — Correct: "{q.keyword}"
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { setPhase("topic-select") }}
            className={`flex-1 py-3 rounded-xl font-black border-2 transition-colors ${isDarkMode ? "border-slate-600 hover:border-slate-400" : "border-slate-200 hover:border-slate-400"}`}
          >
            New Quiz
          </button>
          <button
            onClick={startQuiz}
            className="flex-1 py-3 rounded-xl font-black bg-[#800000] text-white hover:bg-[#600000] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
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
