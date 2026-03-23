// SQA Learning Outcomes for each subject × level
// Outcomes are linked to topics via linkedTopics[] which correspond
// to topic/subtopic names used in questions (topicTag, subtopic, topic fields).

export interface Outcome {
  id: string
  code: string
  title: string
  description: string
  linkedTopics: string[]
}

export type SubjectOutcomes = Partial<Record<string, Outcome[]>>

export const SUBJECT_LEVEL_OUTCOMES: Partial<Record<string, SubjectOutcomes>> = {
  // ─────────────────────────────────────────────────────────────────────────
  // PHYSICS
  // ─────────────────────────────────────────────────────────────────────────
  Physics: {
    "National 5": [
      {
        id: "phys-n5-01",
        code: "N5-P-01",
        title: "Scalars and Vectors",
        description:
          "Distinguish between scalar and vector quantities; add and resolve vectors in one and two dimensions.",
        linkedTopics: ["Vectors and Scalars"],
      },
      {
        id: "phys-n5-02",
        code: "N5-P-02",
        title: "Velocity–Time Graphs",
        description:
          "Interpret and draw velocity–time graphs; calculate displacement from area and acceleration from gradient.",
        linkedTopics: ["Velocity-time graphs", "Acceleration"],
      },
      {
        id: "phys-n5-03",
        code: "N5-P-03",
        title: "Newton's Laws of Motion",
        description:
          "Apply Newton's three laws to explain and calculate the motion of objects; use F = ma.",
        linkedTopics: ["Newton's Laws"],
      },
      {
        id: "phys-n5-04",
        code: "N5-P-04",
        title: "Projectile Motion",
        description:
          "Analyse the horizontal and vertical components of projectile motion independently.",
        linkedTopics: ["Projectile Motion"],
      },
      {
        id: "phys-n5-05",
        code: "N5-P-05",
        title: "Space Exploration",
        description:
          "Describe satellite motion, re-entry, and space travel; carry out calculations involving gravitational field strength.",
        linkedTopics: ["Space Exploration"],
      },
      {
        id: "phys-n5-06",
        code: "N5-P-06",
        title: "Cosmology",
        description:
          "Explain evidence for the Big Bang, the expanding universe, and describe the life cycle of stars.",
        linkedTopics: ["Cosmology"],
      },
      {
        id: "phys-n5-07",
        code: "N5-P-07",
        title: "Specific Heat Capacity",
        description:
          "Use Eh = cmΔT to calculate the energy required to change the temperature of a substance.",
        linkedTopics: ["Specific Heat Capacity"],
      },
      {
        id: "phys-n5-08",
        code: "N5-P-08",
        title: "Specific Latent Heat",
        description:
          "Use Eh = ml to calculate the energy needed for a change of state.",
        linkedTopics: ["Specific Latent Heat"],
      },
      {
        id: "phys-n5-09",
        code: "N5-P-09",
        title: "Pressure and Gas Laws",
        description:
          "Explain gas pressure in terms of the kinetic model; apply Boyle's Law, Charles's Law, and the Pressure Law.",
        linkedTopics: ["Pressure, Kinetic Theory and Gas Laws"],
      },
      {
        id: "phys-n5-10",
        code: "N5-P-10",
        title: "Current, Voltage and Resistance",
        description:
          "Use Ohm's Law in series and parallel circuits; measure and calculate current, voltage and resistance.",
        linkedTopics: ["Current, voltage and resistance"],
      },
      {
        id: "phys-n5-11",
        code: "N5-P-11",
        title: "Electrical Power",
        description:
          "Calculate electrical power and energy using P = IV, P = I²R and P = V²/R.",
        linkedTopics: ["Electrical Power"],
      },
      {
        id: "phys-n5-12",
        code: "N5-P-12",
        title: "Nuclear Radiation",
        description:
          "Describe alpha, beta and gamma radiation; calculate absorbed dose, equivalent dose and effective dose.",
        linkedTopics: ["Nuclear Radiation"],
      },
      {
        id: "phys-n5-13",
        code: "N5-P-13",
        title: "Wave Properties",
        description:
          "Describe transverse and longitudinal waves; use v = fλ and the relationship between frequency and period.",
        linkedTopics: ["Wave properties"],
      },
      {
        id: "phys-n5-14",
        code: "N5-P-14",
        title: "Refraction of Light",
        description:
          "Explain refraction; use Snell's Law and total internal reflection.",
        linkedTopics: ["Refraction of light"],
      },
      {
        id: "phys-n5-15",
        code: "N5-P-15",
        title: "Electromagnetic Spectrum",
        description:
          "Describe the properties and uses of all regions of the EM spectrum; state the speed of EM waves in a vacuum.",
        linkedTopics: ["EM Spectrum"],
      },
    ],

    Higher: [
      {
        id: "phys-h-01",
        code: "H-P-01",
        title: "Equations of Motion",
        description:
          "Apply the kinematic equations of motion to uniformly accelerating objects in one and two dimensions.",
        linkedTopics: ["Equations of Motion"],
      },
      {
        id: "phys-h-02",
        code: "H-P-02",
        title: "Forces, Energy and Power",
        description:
          "Resolve forces into components; apply work-energy theorem and conservation of energy; calculate power.",
        linkedTopics: ["Forces, Energy and Power"],
      },
      {
        id: "phys-h-03",
        code: "H-P-03",
        title: "Collisions, Momentum and Impulse",
        description:
          "Apply conservation of momentum to collisions and explosions; calculate impulse from force–time graphs.",
        linkedTopics: ["Collisions, Momentum and Impulse"],
      },
      {
        id: "phys-h-04",
        code: "H-P-04",
        title: "Gravitation",
        description:
          "Apply Newton's Law of Universal Gravitation; describe gravitational fields and satellite orbits.",
        linkedTopics: ["Gravitation"],
      },
      {
        id: "phys-h-05",
        code: "H-P-05",
        title: "Special Relativity",
        description:
          "Apply time dilation and length contraction; explain the consequences of the constant speed of light.",
        linkedTopics: ["Special Relativity"],
      },
      {
        id: "phys-h-06",
        code: "H-P-06",
        title: "The Expanding Universe",
        description:
          "Explain redshift and the Hubble relationship; calculate recession velocity and describe Big Bang evidence.",
        linkedTopics: ["The Expanding Universe"],
      },
      {
        id: "phys-h-07",
        code: "H-P-07",
        title: "The Standard Model",
        description:
          "Describe fundamental particles and forces; explain interactions using Feynman diagrams.",
        linkedTopics: ["The Standard Model"],
      },
      {
        id: "phys-h-08",
        code: "H-P-08",
        title: "Forces on Charged Particles",
        description:
          "Calculate the force on a charged particle in electric and magnetic fields; describe particle accelerators.",
        linkedTopics: ["Forces on Charged Particles"],
      },
      {
        id: "phys-h-09",
        code: "H-P-09",
        title: "Nuclear Reactions",
        description:
          "Describe fission and fusion; calculate energy from E = mc²; explain binding energy and mass defect.",
        linkedTopics: ["Nuclear Reactions"],
      },
      {
        id: "phys-h-10",
        code: "H-P-10",
        title: "Inverse Square Law",
        description:
          "Apply the inverse square law to irradiance; calculate irradiance at different distances from a source.",
        linkedTopics: ["Inverse Square Law"],
      },
      {
        id: "phys-h-11",
        code: "H-P-11",
        title: "Wave–Particle Duality",
        description:
          "Describe the photoelectric effect; calculate photon energy and the de Broglie wavelength.",
        linkedTopics: ["Wave-Particle Duality"],
      },
      {
        id: "phys-h-12",
        code: "H-P-12",
        title: "Interference",
        description:
          "Explain constructive and destructive interference; apply path difference criteria and calculate fringe spacing.",
        linkedTopics: ["Interference"],
      },
      {
        id: "phys-h-13",
        code: "H-P-13",
        title: "Refraction",
        description:
          "Apply Snell's Law to calculate refractive index; calculate critical angle and explain total internal reflection.",
        linkedTopics: ["Refraction"],
      },
      {
        id: "phys-h-14",
        code: "H-P-14",
        title: "Spectra",
        description:
          "Explain emission and absorption spectra; link spectral lines to electron energy level transitions.",
        linkedTopics: ["Spectra"],
      },
      {
        id: "phys-h-15",
        code: "H-P-15",
        title: "Rayleigh Criterion",
        description:
          "Apply the Rayleigh criterion to calculate the minimum angular resolution of an optical instrument.",
        linkedTopics: ["Rayleigh Criterion"],
      },
      {
        id: "phys-h-16",
        code: "H-P-16",
        title: "Monitoring and Measuring AC",
        description:
          "Distinguish peak and RMS values; calculate frequency from oscilloscope traces; use Vpeak = Vrms√2.",
        linkedTopics: ["Monitoring and Measuring AC"],
      },
      {
        id: "phys-h-17",
        code: "H-P-17",
        title: "Current, PD, Power and Resistance",
        description:
          "Apply Ohm's Law in series and parallel circuits with internal resistance; calculate power dissipation.",
        linkedTopics: ["Current, Potential Difference, Power and Resistance"],
      },
      {
        id: "phys-h-18",
        code: "H-P-18",
        title: "Electrical Sources and Internal Resistance",
        description:
          "Distinguish EMF and terminal potential difference; calculate internal resistance and lost volts.",
        linkedTopics: ["Electrical Sources and Internal Resistance"],
      },
      {
        id: "phys-h-19",
        code: "H-P-19",
        title: "Capacitors",
        description:
          "Explain capacitor charge and discharge; calculate capacitance, energy stored and time constant.",
        linkedTopics: ["Capacitors"],
      },
      {
        id: "phys-h-20",
        code: "H-P-20",
        title: "Semiconductors and p-n Junctions",
        description:
          "Describe n-type and p-type semiconductors; explain how a p-n junction operates as a diode.",
        linkedTopics: ["Semiconductors"],
      },
    ],

    "Advanced Higher": [
      {
        id: "phys-ah-01",
        code: "AH-P-01",
        title: "Kinematic Relationships",
        description:
          "Derive and apply kinematic equations using calculus methods.",
        linkedTopics: ["Kinematic Relationships"],
      },
      {
        id: "phys-ah-02",
        code: "AH-P-02",
        title: "Angular Motion",
        description:
          "Apply equations of angular motion; convert between angular and linear quantities.",
        linkedTopics: ["Angular Motion"],
      },
      {
        id: "phys-ah-03",
        code: "AH-P-03",
        title: "Rotational Dynamics",
        description:
          "Apply torque and moment of inertia; use rotational analogues of Newton's Second Law.",
        linkedTopics: ["Rotational Dynamics"],
      },
      {
        id: "phys-ah-04",
        code: "AH-P-04",
        title: "Angular Momentum",
        description:
          "Apply conservation of angular momentum; calculate angular momentum and torque.",
        linkedTopics: ["Angular Momentum"],
      },
      {
        id: "phys-ah-05",
        code: "AH-P-05",
        title: "Gravitation",
        description:
          "Apply the gravitational inverse square law; calculate gravitational potential and escape velocity.",
        linkedTopics: ["Gravitation"],
      },
      {
        id: "phys-ah-06",
        code: "AH-P-06",
        title: "General Relativity",
        description:
          "Explain the equivalence principle and gravitational time dilation; describe spacetime curvature.",
        linkedTopics: ["General Relativity"],
      },
      {
        id: "phys-ah-07",
        code: "AH-P-07",
        title: "Stellar Physics",
        description:
          "Use the Stefan-Boltzmann Law and the H-R diagram to classify stars; calculate stellar luminosity.",
        linkedTopics: ["Stellar Physics"],
      },
      {
        id: "phys-ah-08",
        code: "AH-P-08",
        title: "Quantum Theory",
        description:
          "Describe quantisation; apply the Heisenberg Uncertainty Principle and interpret wave functions.",
        linkedTopics: ["Introduction to Quantum Theory"],
      },
      {
        id: "phys-ah-09",
        code: "AH-P-09",
        title: "Particles from Space",
        description:
          "Describe cosmic rays, pair production and annihilation; perform conservation calculations.",
        linkedTopics: ["Particles from Space"],
      },
      {
        id: "phys-ah-10",
        code: "AH-P-10",
        title: "Simple Harmonic Motion",
        description:
          "Apply the equations of SHM; identify conditions for SHM and solve energy problems.",
        linkedTopics: ["Simple Harmonic Motion"],
      },
      {
        id: "phys-ah-11",
        code: "AH-P-11",
        title: "Waves (Standing Waves)",
        description:
          "Describe standing waves; identify nodes and antinodes; calculate wave properties.",
        linkedTopics: ["Waves"],
      },
      {
        id: "phys-ah-12",
        code: "AH-P-12",
        title: "Interference (Advanced)",
        description:
          "Apply path difference to multi-source interference patterns; calculate fringe spacing.",
        linkedTopics: ["Interference"],
      },
      {
        id: "phys-ah-13",
        code: "AH-P-13",
        title: "Polarisation",
        description:
          "Describe polarisation of transverse waves; apply Malus's Law.",
        linkedTopics: ["Polarisation"],
      },
      {
        id: "phys-ah-14",
        code: "AH-P-14",
        title: "Electrostatics",
        description:
          "Apply Coulomb's Law; describe electric fields and calculate electric potential.",
        linkedTopics: ["Electrostatics"],
      },
      {
        id: "phys-ah-15",
        code: "AH-P-15",
        title: "Electromagnetism",
        description:
          "Apply Faraday's and Lenz's Laws; calculate induced EMF from changing magnetic flux.",
        linkedTopics: ["Electromagnetism"],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BIOLOGY
  // ─────────────────────────────────────────────────────────────────────────
  Biology: {
    "National 5": [
      {
        id: "bio-n5-01",
        code: "N5-B-01",
        title: "Cell Structure",
        description:
          "Identify and describe the function of cell organelles in animal, plant and fungal cells.",
        linkedTopics: ["Cell Structure"],
      },
      {
        id: "bio-n5-02",
        code: "N5-B-02",
        title: "Transport Across Cell Membranes",
        description:
          "Describe osmosis, diffusion and active transport across cell membranes.",
        linkedTopics: ["Transport Across Cell Membranes"],
      },
      {
        id: "bio-n5-03",
        code: "N5-B-03",
        title: "DNA and the Production of Proteins",
        description:
          "Describe DNA structure, transcription, and translation; explain gene expression.",
        linkedTopics: ["DNA and the Production of Proteins"],
      },
      {
        id: "bio-n5-04",
        code: "N5-B-04",
        title: "Proteins",
        description:
          "Describe the structure and function of proteins; explain how protein structure relates to function.",
        linkedTopics: ["Proteins"],
      },
      {
        id: "bio-n5-05",
        code: "N5-B-05",
        title: "Photosynthesis",
        description:
          "Describe the stages of photosynthesis; explain how limiting factors affect the rate of photosynthesis.",
        linkedTopics: ["Photosynthesis"],
      },
      {
        id: "bio-n5-06",
        code: "N5-B-06",
        title: "Respiration",
        description:
          "Describe aerobic and anaerobic respiration; compare their efficiency and products.",
        linkedTopics: ["Respiration"],
      },
      {
        id: "bio-n5-07",
        code: "N5-B-07",
        title: "Reproduction",
        description:
          "Describe mitosis and meiosis; compare sexual and asexual reproduction.",
        linkedTopics: ["Reproduction"],
      },
      {
        id: "bio-n5-08",
        code: "N5-B-08",
        title: "Variation and Inheritance",
        description:
          "Apply Mendelian genetics to predict phenotype ratios; distinguish genotype from phenotype.",
        linkedTopics: ["Variation and Inheritance"],
      },
      {
        id: "bio-n5-09",
        code: "N5-B-09",
        title: "Transport Systems in Plants",
        description:
          "Describe the structure and function of xylem and phloem; explain osmosis in plant cells.",
        linkedTopics: ["Transport Systems in Plants"],
      },
      {
        id: "bio-n5-10",
        code: "N5-B-10",
        title: "Animal Behaviour",
        description:
          "Describe innate and learned behaviour; explain the evolutionary advantage of social behaviour.",
        linkedTopics: ["Animal Behaviour"],
      },
      {
        id: "bio-n5-11",
        code: "N5-B-11",
        title: "Evolution",
        description:
          "Explain natural selection and evolution; describe the role of mutation in genetic variation.",
        linkedTopics: ["Evolution"],
      },
      {
        id: "bio-n5-12",
        code: "N5-B-12",
        title: "Biodiversity and the Distribution of Life",
        description:
          "Describe factors affecting biodiversity; explain the role of abiotic and biotic factors.",
        linkedTopics: ["Biodiversity and the Distribution of Life"],
      },
      {
        id: "bio-n5-13",
        code: "N5-B-13",
        title: "Photosynthesis and Food Chains",
        description:
          "Explain energy flow through food chains; calculate efficiency of energy transfer.",
        linkedTopics: ["Photosynthesis and Food Chains"],
      },
    ],

    Higher: [
      {
        id: "bio-h-01",
        code: "H-B-01",
        title: "DNA Structure and Replication",
        description:
          "Describe semiconservative DNA replication; explain the role of DNA polymerase and other enzymes.",
        linkedTopics: ["DNA Structure and Replication"],
      },
      {
        id: "bio-h-02",
        code: "H-B-02",
        title: "Gene Expression",
        description:
          "Explain transcription and translation in detail; describe post-translational modification.",
        linkedTopics: ["Gene Expression"],
      },
      {
        id: "bio-h-03",
        code: "H-B-03",
        title: "Genome Implication",
        description:
          "Describe the human genome project and applications of genomics in medicine and research.",
        linkedTopics: ["Genome Implication"],
      },
      {
        id: "bio-h-04",
        code: "H-B-04",
        title: "Mutations",
        description:
          "Describe types of gene and chromosome mutations; explain their effects on protein structure.",
        linkedTopics: ["Mutations"],
      },
      {
        id: "bio-h-05",
        code: "H-B-05",
        title: "Metabolic Pathways",
        description:
          "Describe anabolic and catabolic pathways; explain enzyme regulation and feedback inhibition.",
        linkedTopics: ["Metabolic Pathways"],
      },
      {
        id: "bio-h-06",
        code: "H-B-06",
        title: "Cellular Respiration",
        description:
          "Describe the stages of aerobic respiration (glycolysis, Krebs cycle, oxidative phosphorylation) and their locations.",
        linkedTopics: ["Cellular Respiration"],
      },
      {
        id: "bio-h-07",
        code: "H-B-07",
        title: "Photosynthesis (Higher)",
        description:
          "Describe the light-dependent and light-independent reactions; explain the role of ATP and NADPH.",
        linkedTopics: ["Photosynthesis"],
      },
      {
        id: "bio-h-08",
        code: "H-B-08",
        title: "Evolution and Speciation",
        description:
          "Explain allopatric and sympatric speciation; apply the Hardy-Weinberg principle.",
        linkedTopics: ["Evolution and Speciation"],
      },
      {
        id: "bio-h-09",
        code: "H-B-09",
        title: "Phylogenetics",
        description:
          "Construct and interpret phylogenetic trees; describe molecular evidence for evolution.",
        linkedTopics: ["Phylogenetics"],
      },
      {
        id: "bio-h-10",
        code: "H-B-10",
        title: "Population Ecology",
        description:
          "Describe factors affecting population size; apply exponential growth and carrying capacity models.",
        linkedTopics: ["Population Ecology"],
      },
      {
        id: "bio-h-11",
        code: "H-B-11",
        title: "Biodiversity (Higher)",
        description:
          "Measure biodiversity using the Simpson index; describe threats to biodiversity and conservation measures.",
        linkedTopics: ["Biodiversity"],
      },
      {
        id: "bio-h-12",
        code: "H-B-12",
        title: "Homeostasis",
        description:
          "Describe negative feedback mechanisms; explain blood glucose, temperature, and water regulation.",
        linkedTopics: ["Homeostasis"],
      },
    ],

    "Advanced Higher": [
      {
        id: "bio-ah-01",
        code: "AH-B-01",
        title: "Cell Signalling",
        description:
          "Describe signal transduction pathways; explain how signals regulate cell behaviour.",
        linkedTopics: ["Cell Signalling"],
      },
      {
        id: "bio-ah-02",
        code: "AH-B-02",
        title: "Molecular Biology Techniques",
        description:
          "Describe PCR, gel electrophoresis, Southern blotting and gene cloning techniques.",
        linkedTopics: ["Molecular Biology Techniques"],
      },
      {
        id: "bio-ah-03",
        code: "AH-B-03",
        title: "Immunology",
        description:
          "Describe the structure and function of the immune system; explain adaptive immunity and vaccination.",
        linkedTopics: ["Immunology"],
      },
      {
        id: "bio-ah-04",
        code: "AH-B-04",
        title: "Neuroscience",
        description:
          "Describe the structure of neurons; explain synaptic transmission and nervous system organisation.",
        linkedTopics: ["Neuroscience"],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CHEMISTRY
  // ─────────────────────────────────────────────────────────────────────────
  Chemistry: {
    "National 5": [
      {
        id: "chem-n5-01",
        code: "N5-C-01",
        title: "Atomic Structure and Bonding",
        description:
          "Describe atomic structure; explain ionic, covalent and metallic bonding; draw Lewis diagrams.",
        linkedTopics: ["Atomic Structure and Bonding"],
      },
      {
        id: "chem-n5-02",
        code: "N5-C-02",
        title: "The Periodic Table",
        description:
          "Describe trends across periods and down groups; explain the arrangement of the periodic table.",
        linkedTopics: ["The Periodic Table"],
      },
      {
        id: "chem-n5-03",
        code: "N5-C-03",
        title: "Formulae and Reacting Quantities",
        description:
          "Write chemical formulae; calculate moles, mass and volumes using stoichiometry.",
        linkedTopics: ["Formulae and Reacting Quantities"],
      },
      {
        id: "chem-n5-04",
        code: "N5-C-04",
        title: "Acids and Bases",
        description:
          "Describe the pH scale; explain neutralisation and write equations for acid-base reactions.",
        linkedTopics: ["Acids and Bases"],
      },
      {
        id: "chem-n5-05",
        code: "N5-C-05",
        title: "Reactions of Acids",
        description:
          "Describe reactions of acids with metals, metal oxides, hydroxides and carbonates.",
        linkedTopics: ["Reactions of Acids"],
      },
      {
        id: "chem-n5-06",
        code: "N5-C-06",
        title: "Making Electricity",
        description:
          "Describe the operation of electrochemical cells; compare cells using the electrochemical series.",
        linkedTopics: ["Making Electricity"],
      },
      {
        id: "chem-n5-07",
        code: "N5-C-07",
        title: "Fuels",
        description:
          "Describe combustion reactions; explain fractional distillation and uses of fractions.",
        linkedTopics: ["Fuels"],
      },
      {
        id: "chem-n5-08",
        code: "N5-C-08",
        title: "Homologous Series",
        description:
          "Name and draw alkanes, alkenes, cycloalkanes and alkanols; identify members of homologous series.",
        linkedTopics: ["Homologous Series"],
      },
      {
        id: "chem-n5-09",
        code: "N5-C-09",
        title: "Reactions of Carbon Compounds",
        description:
          "Describe addition, fermentation, hydration and combustion reactions of carbon compounds.",
        linkedTopics: ["Reactions of Carbon Compounds"],
      },
      {
        id: "chem-n5-10",
        code: "N5-C-10",
        title: "Polymers",
        description:
          "Describe addition and condensation polymerisation; identify monomers from polymer structures.",
        linkedTopics: ["Polymers"],
      },
      {
        id: "chem-n5-11",
        code: "N5-C-11",
        title: "Fertilisers",
        description:
          "Describe the Haber process and uses of nitrogen-based fertilisers; identify sources of pollution.",
        linkedTopics: ["Fertilisers"],
      },
      {
        id: "chem-n5-12",
        code: "N5-C-12",
        title: "Radioactivity",
        description:
          "Describe types of radioactive decay; write nuclear equations; explain half-life.",
        linkedTopics: ["Radioactivity"],
      },
    ],

    Higher: [
      {
        id: "chem-h-01",
        code: "H-C-01",
        title: "Periodicity",
        description:
          "Explain trends in ionisation energy, electronegativity and atomic radius; describe bonding types.",
        linkedTopics: ["Periodicity"],
      },
      {
        id: "chem-h-02",
        code: "H-C-02",
        title: "Structure and Bonding",
        description:
          "Explain van der Waals forces, hydrogen bonding and their effects on physical properties.",
        linkedTopics: ["Structure and Bonding"],
      },
      {
        id: "chem-h-03",
        code: "H-C-03",
        title: "The Mole",
        description:
          "Use the mole concept for solutions; calculate concentration, volume and moles.",
        linkedTopics: ["The Mole"],
      },
      {
        id: "chem-h-04",
        code: "H-C-04",
        title: "Chemical Equilibrium",
        description:
          "Apply Le Chatelier's principle; calculate Kc and explain how conditions affect equilibrium.",
        linkedTopics: ["Chemical Equilibrium"],
      },
      {
        id: "chem-h-05",
        code: "H-C-05",
        title: "Acids and Bases (Higher)",
        description:
          "Apply Brønsted-Lowry theory; calculate pH for strong and weak acids; explain buffers.",
        linkedTopics: ["Acids and Bases"],
      },
      {
        id: "chem-h-06",
        code: "H-C-06",
        title: "Oxidation and Reduction",
        description:
          "Assign oxidation numbers; identify oxidising and reducing agents; balance redox equations.",
        linkedTopics: ["Oxidation and Reduction"],
      },
      {
        id: "chem-h-07",
        code: "H-C-07",
        title: "Reaction Rates",
        description:
          "Describe factors affecting reaction rate; explain collision theory and activation energy.",
        linkedTopics: ["Reaction Rates"],
      },
      {
        id: "chem-h-08",
        code: "H-C-08",
        title: "Enthalpy",
        description:
          "Calculate enthalpy changes using Hess's Law and bond enthalpies; interpret energy diagrams.",
        linkedTopics: ["Enthalpy"],
      },
      {
        id: "chem-h-09",
        code: "H-C-09",
        title: "Organic Reactions",
        description:
          "Describe substitution, addition and elimination reactions; identify functional groups.",
        linkedTopics: ["Organic Reactions"],
      },
      {
        id: "chem-h-10",
        code: "H-C-10",
        title: "Organic Compounds and Their Reactions",
        description:
          "Name and draw alcohols, aldehydes, ketones, carboxylic acids and esters; describe their reactions.",
        linkedTopics: ["Organic Compounds"],
      },
      {
        id: "chem-h-11",
        code: "H-C-11",
        title: "Pharmaceutical Chemistry",
        description:
          "Describe drug action; explain chirality and the importance of molecular shape in pharmacology.",
        linkedTopics: ["Pharmaceutical Chemistry"],
      },
    ],

    "Advanced Higher": [
      {
        id: "chem-ah-01",
        code: "AH-C-01",
        title: "Electronic Structure and Periodicity",
        description:
          "Explain electron configuration using quantum numbers; describe trends in ionisation energies.",
        linkedTopics: ["Electronic Structure and Periodicity"],
      },
      {
        id: "chem-ah-02",
        code: "AH-C-02",
        title: "Transition Metals",
        description:
          "Describe the properties of transition metals; explain complex formation and colour.",
        linkedTopics: ["Transition Metals"],
      },
      {
        id: "chem-ah-03",
        code: "AH-C-03",
        title: "Chemical Equilibrium (Advanced)",
        description:
          "Calculate Kp and Kc; apply the equilibrium law to acid-base and solubility equilibria.",
        linkedTopics: ["Chemical Equilibrium"],
      },
      {
        id: "chem-ah-04",
        code: "AH-C-04",
        title: "Kinetics",
        description:
          "Determine rate equations from experimental data; apply Arrhenius equation to activation energy.",
        linkedTopics: ["Kinetics"],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PRACTICAL ELECTRONICS
  // ─────────────────────────────────────────────────────────────────────────
  "Practical Electronics": {
    "National 5": [
      {
        id: "elec-n5-01",
        code: "N5-E-01",
        title: "Electronic Components",
        description:
          "Identify and describe the function of common electronic components including resistors, capacitors, diodes and transistors.",
        linkedTopics: ["Electronic Components"],
      },
      {
        id: "elec-n5-02",
        code: "N5-E-02",
        title: "Circuit Analysis",
        description:
          "Apply Ohm's Law to series and parallel circuits; calculate current, voltage and resistance.",
        linkedTopics: ["Circuit Analysis", "Current, voltage and resistance"],
      },
      {
        id: "elec-n5-03",
        code: "N5-E-03",
        title: "Input Devices and Sensors",
        description:
          "Describe the operation of input devices (LDR, thermistor, microphone, capacitor); explain voltage dividers.",
        linkedTopics: ["Input Devices and Sensors"],
      },
      {
        id: "elec-n5-04",
        code: "N5-E-04",
        title: "Transistor Switching",
        description:
          "Describe how a transistor acts as a switch; design simple switching circuits with sensors.",
        linkedTopics: ["Transistor Switching"],
      },
      {
        id: "elec-n5-05",
        code: "N5-E-05",
        title: "Amplifiers",
        description:
          "Describe the operation of operational amplifiers in inverting and non-inverting configurations; calculate voltage gain.",
        linkedTopics: ["Amplifiers"],
      },
      {
        id: "elec-n5-06",
        code: "N5-E-06",
        title: "Power Supplies",
        description:
          "Describe rectification using diodes; explain smoothing using capacitors; identify power supply stages.",
        linkedTopics: ["Power Supplies"],
      },
      {
        id: "elec-n5-07",
        code: "N5-E-07",
        title: "Digital Circuits",
        description:
          "Identify and apply logic gates (AND, OR, NOT, NAND, NOR); construct truth tables.",
        linkedTopics: ["Digital Circuits", "Logic Gates"],
      },
      {
        id: "elec-n5-08",
        code: "N5-E-08",
        title: "Counters and Clocks",
        description:
          "Describe the operation of clock circuits and binary counters; interpret timing diagrams.",
        linkedTopics: ["Counters and Clocks"],
      },
    ],
  },
}
