// SQA National 5 Physics 2021 — Section 2 Past Paper Questions
// Source: data/past-papers/n5-2021-section2

export interface RawPaperPart {
  id: string
  text: string
  marks: number
  answer: string
  markingScheme: string
  dependsOn?: string[]
  featureTag?: "standard" | "a-level" | "open-ended"
  topicTag?: string
}

export interface RawPaperQuestion {
  type: "paper"
  topic: string
  subtopic: string
  question: string
  parts: RawPaperPart[]
}

export const source = "SQA National 5 Physics 2021 Section 2"


export const questions: RawPaperQuestion[] = [
  {
    type: "paper",
    topic: "Dynamics",
    subtopic: "Vectors and Scalars",
    question:
      "An aeroplane flies from Aberdeen to Glasgow. The aeroplane flies 140 km due south (180) from Aberdeen, then 130 km due west (270) to Glasgow.",
    parts: [
      {
        id: "1ai",
        text: "By scale diagram, or otherwise: determine the magnitude of the displacement from Aberdeen to Glasgow.",
        marks: 2,
        answer: "191 km",
        markingScheme:
          "\u2022 $s^2 = 140^2 + 130^2$ (1)\n\u2022 $s = 191\\text{ km}$ (1)",
        topicTag: "Vectors and Scalars",
      },
      {
        id: "1aii",
        text: "By scale diagram, or otherwise: determine the direction of the displacement from Aberdeen to Glasgow.",
        marks: 2,
        answer: "223 (or 43\u00b0 South of West / 47\u00b0 West of South)",
        markingScheme:
          "\u2022 $\\tan \\theta = \\frac{130}{140}$ (1)\n\u2022 Bearing = 223 (1)",
        topicTag: "Vectors and Scalars",
      },
      {
        id: "1bi",
        text: "On the return journey, the aeroplane flies directly from Glasgow to Aberdeen in 0.50 hours. Calculate the average speed of the aeroplane for this journey.",
        marks: 3,
        answer: "540 km/h (or $150\\text{ m s}^{-1}$)",
        markingScheme:
          "\u2022 $v = \\frac{d}{t}$ (1)\n\u2022 $v = \\frac{270}{0.50}$ (1)\n\u2022 $v = 540\\text{ km h}^{-1}$ (1)",
        topicTag: "Vectors and Scalars",
      },
      {
        id: "1bii",
        text: "Determine the average velocity of the aeroplane from Glasgow to Aberdeen.",
        marks: 2,
        answer: "382 km/h at bearing 043",
        markingScheme:
          "\u2022 Magnitude: $382\\text{ km h}^{-1}$ (1)\n\u2022 Direction: 043 (1)",
        topicTag: "Vectors and Scalars",
      },
    ],
  },
  {
    type: "paper",
    topic: "Dynamics",
    subtopic: "Projectile Motion",
    question:
      "A student investigating factors that affect the horizontal range of a marble.",
    parts: [
      {
        id: "2ai",
        text: "Using the graph paper provided, draw a graph of the results (Release height vs Horizontal range).",
        marks: 3,
        answer: "Best-fit line/curve based on data points.",
        markingScheme:
          "\u2022 Axes labeled with units (1)\n\u2022 Points plotted accurately (1)\n\u2022 Best-fit line or smooth curve (1)",
        topicTag: "Projectile Motion",
      },
      {
        id: "2aii",
        text: "Use your graph to predict the horizontal range of a marble released from a height of 0.22 m.",
        marks: 1,
        answer: "0.57 m (\u00b1 0.01 m based on graph)",
        markingScheme:
          "\u2022 Correct value from candidate's graph. (1)",
        topicTag: "Projectile Motion",
      },
      {
        id: "2aiii",
        text: "Suggest an improvement to the experiment to determine more accurately where the marble hit the ground.",
        marks: 1,
        answer: "Use sand / damp paper / carbon paper.",
        markingScheme:
          "\u2022 Use of a medium to mark the landing spot (e.g., sand). (1)",
        topicTag: "Projectile Motion",
      },
      {
        id: "2bi",
        text: "Suggest another variable that could be investigated, which may affect the horizontal range of a marble.",
        marks: 1,
        answer: "Mass of marble / surface of ramp / angle of ramp.",
        markingScheme:
          "\u2022 Any valid variable identified. (1)",
        topicTag: "Projectile Motion",
      },
      {
        id: "2bii",
        text: "Describe experimental work that could be carried out to investigate how the variable you suggested affects the horizontal range.",
        marks: 2,
        answer: "Vary identified variable, keep others constant, measure range.",
        markingScheme:
          "\u2022 Statement to change variable and measure range (1)\n\u2022 Statement to keep release height (or other variables) constant (1)",
        topicTag: "Projectile Motion",
      },
    ],
  },
  {
    type: "paper",
    topic: "Space",
    subtopic: "Newton's Laws",
    question:
      "A spaceship on Mars (mass $1.3 \\times 10^6\\text{ kg}$) produce a constant upward thrust of $1.2 \\times 10^7\\text{ N}$.",
    parts: [
      {
        id: "3ai",
        text: "Calculate the weight of the spaceship on Mars ($g = 3.7\\text{ N kg}^{-1}$).",
        marks: 3,
        answer: "$4.8 \\times 10^6\\text{ N}$",
        markingScheme:
          "\u2022 $W = mg$ (1)\n\u2022 $W = 1.3 \\times 10^6 \\times 3.7$ (1)\n\u2022 $W = 4.8 \\times 10^6\\text{ N}$ (1)",
        topicTag: "Newton's Laws",
      },
      {
        id: "3aii",
        text: "Show all the forces acting vertically on the spaceship just after it leaves the surface.",
        marks: 2,
        answer: "Thrust (up) and Weight (down).",
        markingScheme:
          "\u2022 Thrust/engine force arrow up (1)\n\u2022 Weight/gravity arrow down (1)",
        topicTag: "Newton's Laws",
      },
      {
        id: "3aiii",
        text: "Determine the acceleration of the spaceship at launch.",
        marks: 4,
        answer: "$5.5\\text{ m s}^{-2}$",
        markingScheme:
          "\u2022 $F_{un} = \\text{Thrust} - \\text{Weight}$ (1)\n\u2022 $F_{un} = 1.2 \\times 10^7 - 4.81 \\times 10^6 = 7.19 \\times 10^6\\text{ N}$ (1)\n\u2022 $a = \\frac{F}{m}$ (1)\n\u2022 $a = 5.5\\text{ m s}^{-2}$ (1)",
        topicTag: "Newton's Laws",
      },
      {
        id: "3b",
        text: "State what happens to the acceleration as altitude increases. Justify your answer.",
        marks: 2,
        answer: "Acceleration increases.",
        markingScheme:
          "\u2022 Acceleration increases (1)\n\u2022 Fuel is used up (mass decreases) OR weight decreases (value of g decreases) (1)",
        topicTag: "Newton's Laws",
      },
    ],
  },
  {
    type: "paper",
    topic: "Space",
    subtopic: "Space Exploration",
    question:
      "Using your knowledge of physics, comment on the similarities and/or differences between space exploration and underwater exploration.",
    parts: [
      {
        id: "4",
        text: "Comment on the similarities/differences.",
        marks: 3,
        answer: "Open response.",
        markingScheme:
          "\u2022 Award for breadth/depth: e.g., pressure differences (vacuum vs high pressure), communication challenges, life support systems. (Max 3)",
        featureTag: "open-ended",
        topicTag: "Space Exploration",
      },
    ],
  },
  {
    type: "paper",
    topic: "Space",
    subtopic: "Cosmology",
    question:
      "Rigel is a blue supergiant 860 light-years from Earth.",
    parts: [
      {
        id: "5ai",
        text: "Calculate the distance, in metres, from Rigel to Earth.",
        marks: 3,
        answer: "$8.1 \\times 10^{18}\\text{ m}$",
        markingScheme:
          "\u2022 $d = vt$ (1)\n\u2022 $d = 3 \\times 10^8 \\times (860 \\times 365.25 \\times 24 \\times 3600)$ (1)\n\u2022 $d = 8.1 \\times 10^{18}\\text{ m}$ (1)",
        topicTag: "Cosmology",
      },
      {
        id: "5aii",
        text: "Determine the approximate speed of debris ejected at 5% of the speed of light.",
        marks: 1,
        answer: "$1.5 \\times 10^7\\text{ m s}^{-1}$",
        markingScheme:
          "\u2022 $0.05 \\times 3 \\times 10^8 = 1.5 \\times 10^7\\text{ m s}^{-1}$ (1)",
        topicTag: "Cosmology",
      },
      {
        id: "5aiii",
        text: "Calculate the time it would take for this debris to reach Earth.",
        marks: 3,
        answer: "$5.4 \\times 10^{11}\\text{ s}$ (approx 17,200 years)",
        markingScheme:
          "\u2022 $t = \\frac{d}{v}$ (1)\n\u2022 $t = \\frac{8.1 \\times 10^{18}}{1.5 \\times 10^7}$ (1)\n\u2022 $t = 5.4 \\times 10^{11}\\text{ s}$ (1)",
        topicTag: "Cosmology",
      },
      {
        id: "5b",
        text: "Explain why the supernova may already have happened but not yet been detected.",
        marks: 1,
        answer: "Light takes 860 years to reach Earth.",
        markingScheme:
          "\u2022 Light takes time (860 years) to travel from Rigel to Earth. (1)",
        topicTag: "Cosmology",
      },
      {
        id: "5ci",
        text: "State the type of spectrum shown (continuous or line).",
        marks: 1,
        answer: "Line (absorption) spectrum.",
        markingScheme:
          "\u2022 Absorption / Line (1)",
        topicTag: "Cosmology",
      },
      {
        id: "5cii",
        text: "Explain how the spectrum identifies elements.",
        marks: 1,
        answer: "Each element has a unique pattern of lines.",
        markingScheme:
          "\u2022 Every element has its own unique/characteristic pattern of lines. (1)",
        topicTag: "Cosmology",
      },
    ],
  },
  {
    type: "paper",
    topic: "Electricity",
    subtopic: "Current, voltage and resistance",
    question:
      "A student investigates the resistance of a motor.",
    parts: [
      {
        id: "6a",
        text: "Draw a circuit diagram of the apparatus (6.0 V supply, variable resistor, motor, ammeter, voltmeter).",
        marks: 2,
        answer: "Series circuit with motor, ammeter, and variable resistor; Voltmeter in parallel with motor.",
        markingScheme:
          "\u2022 Ammeter, variable resistor and motor in series (1)\n\u2022 Voltmeter in parallel with motor (1)",
        topicTag: "Current, voltage and resistance",
      },
      {
        id: "6b",
        text: "Voltage is 4.5 V, current is 0.15 A. Calculate the resistance.",
        marks: 3,
        answer: "$30\\text{ }\\Omega$",
        markingScheme:
          "\u2022 $R = \\frac{V}{I}$ (1)\n\u2022 $R = \\frac{4.5}{0.15}$ (1)\n\u2022 $R = 30\\text{ }\\Omega$ (1)",
        topicTag: "Current, voltage and resistance",
      },
    ],
  },
  {
    type: "paper",
    topic: "Electricity",
    subtopic: "Current, voltage and resistance",
    question:
      "A greenhouse moisture sensor circuit using an NPN transistor.",
    parts: [
      {
        id: "7a",
        text: "The potential difference across the 0 V and point X is 0.4 V. State whether the fan is on or off.",
        marks: 1,
        answer: "Off",
        markingScheme:
          "\u2022 Off (1)",
        topicTag: "Current, voltage and resistance",
      },
      {
        id: "7b",
        text: "Explain how the circuit operates to switch the fan on when the soil becomes dry.",
        marks: 3,
        answer: "Resistance up, voltage up, transistor on.",
        markingScheme:
          "\u2022 Resistance of moisture sensor increases (when dry) (1)\n\u2022 Voltage across sensor/X increases (1)\n\u2022 Transistor switches on (above 0.7 V) (1)",
        topicTag: "Current, voltage and resistance",
      },
      {
        id: "7c",
        text: "The student replaces the NPN transistor with a MOSFET. Draw the symbol for a MOSFET.",
        marks: 1,
        answer: "MOSFET symbol.",
        markingScheme:
          "\u2022 Correct symbol for n-channel enhancement MOSFET. (1)",
        topicTag: "Current, voltage and resistance",
      },
    ],
  },
  {
    type: "paper",
    topic: "Properties of Matter",
    subtopic: "Specific Latent Heat",
    question:
      "A handheld steam cleaner contains 0.40 kg of water.",
    parts: [
      {
        id: "8a",
        text: "Calculate the energy required to heat the water from 15\u00b0C to 100\u00b0C ($c = 4180\\text{ J kg}^{-1\\text{ }\\circ}\\text{C}^{-1}$).",
        marks: 3,
        answer: "$142,000\\text{ J}$",
        markingScheme:
          "\u2022 $E_h = mc\\Delta T$ (1)\n\u2022 $E_h = 0.40 \\times 4180 \\times (100 - 15)$ (1)\n\u2022 $E_h = 142,120\\text{ J}$ (1)",
        topicTag: "Specific Heat Capacity",
      },
      {
        id: "8b",
        text: "Calculate the mass of steam produced if $5.0 \\times 10^5\\text{ J}$ of energy is used to turn 100\u00b0C water to steam.",
        marks: 3,
        answer: "0.22 kg",
        markingScheme:
          "\u2022 $E_h = ml_v$ (1)\n\u2022 $5.0 \\times 10^5 = m \\times 22.6 \\times 10^5$ (1)\n\u2022 $m = 0.22\\text{ kg}$ (1)",
        topicTag: "Specific Latent Heat",
      },
    ],
  },
  {
    type: "paper",
    topic: "Properties of Matter",
    subtopic: "Pressure, Kinetic Theory and Gas Laws",
    question:
      "A student uses a pump to inflate a bicycle tyre.",
    parts: [
      {
        id: "9a",
        text: "The pump exerts a force of 110 N over an area of $5.4 \\times 10^{-4}\\text{ m}^2$. Calculate the pressure.",
        marks: 3,
        answer: "$2.0 \\times 10^5\\text{ Pa}$",
        markingScheme:
          "\u2022 $P = \\frac{F}{A}$ (1)\n\u2022 $P = \\frac{110}{5.4 \\times 10^{-4}}$ (1)\n\u2022 $P = 2.04 \\times 10^5\\text{ Pa}$ (1)",
        topicTag: "Pressure, Kinetic Theory and Gas Laws",
      },
      {
        id: "9b",
        text: "The air in the pump is compressed from $4.0 \\times 10^{-4}\\text{ m}^3$ to $1.6 \\times 10^{-4}\\text{ m}^3$ at constant temperature. Calculate the final pressure.",
        marks: 3,
        answer: "$2.5 \\times 10^5\\text{ Pa}$",
        markingScheme:
          "\u2022 $P_1V_1 = P_2V_2$ (1)\n\u2022 $1.0 \\times 10^5 \\times 4.0 \\times 10^{-4} = P_2 \\times 1.6 \\times 10^{-4}$ (1)\n\u2022 $P_2 = 2.5 \\times 10^5\\text{ Pa}$ (1)",
        topicTag: "Pressure, Kinetic Theory and Gas Laws",
      },
      {
        id: "9c",
        text: "In reality, the temperature of the air increases during compression. Explain the effect on final pressure.",
        marks: 2,
        answer: "Pressure increases further.",
        markingScheme:
          "\u2022 Pressure increases (1)\n\u2022 Particles hit walls harder / with more kinetic energy / more frequently (1)",
        topicTag: "Pressure, Kinetic Theory and Gas Laws",
      },
    ],
  },
  {
    type: "paper",
    topic: "Waves",
    subtopic: "Wave properties",
    question:
      "A ripple tank shows water waves meeting a gap in a barrier.",
    parts: [
      {
        id: "10a",
        text: "State the name given to the effect of waves spreading out after the gap.",
        marks: 1,
        answer: "Diffraction",
        markingScheme:
          "\u2022 Diffraction (1)",
        topicTag: "Wave properties",
      },
      {
        id: "10b",
        text: "The gap size is increased. Describe the effect on the pattern.",
        marks: 1,
        answer: "Less diffraction (less spreading).",
        markingScheme:
          "\u2022 Less spreading / less curved / less diffraction. (1)",
        topicTag: "Wave properties",
      },
    ],
  },
  {
    type: "paper",
    topic: "Waves",
    subtopic: "Refraction of light",
    question:
      "Light passing through a glass block.",
    parts: [
      {
        id: "11ai",
        text: "Calculate the refractive index of the glass (angles 40\u00b0 in air and 25\u00b0 in glass).",
        marks: 3,
        answer: "1.52",
        markingScheme:
          "\u2022 $n = \\frac{\\sin i}{\\sin r}$ (1)\n\u2022 $n = \\frac{\\sin 40}{\\sin 25}$ (1)\n\u2022 $n = 1.52$ (1)",
        topicTag: "Refraction of light",
      },
      {
        id: "11aii",
        text: "The red light is replaced by blue light. Draw the path of the blue light in the glass.",
        marks: 1,
        answer: "Path refracted more (closer to normal).",
        markingScheme:
          "\u2022 Ray refracted more (towards normal) than red light. (1)",
        topicTag: "Refraction of light",
      },
    ],
  },
  {
    type: "paper",
    topic: "Waves",
    subtopic: "EM Spectrum",
    question:
      "An investigation into the effect of surface color on infrared radiation.",
    parts: [
      {
        id: "12ai",
        text: "State which color (matt black or shiny silver) is a better radiator of infrared.",
        marks: 1,
        answer: "Matt black",
        markingScheme:
          "\u2022 Matt black (1)",
        topicTag: "EM Spectrum",
      },
      {
        id: "12aii",
        text: "Determine the voltage at a distance of 0.35 m for the matt black surface from the graph.",
        marks: 1,
        answer: "2.4 mV (\u00b1 0.1 mV)",
        markingScheme:
          "\u2022 Correct reading from graph. (1)",
        topicTag: "EM Spectrum",
      },
    ],
  },
  {
    type: "paper",
    topic: "Radiation",
    subtopic: "Nuclear Radiation",
    question:
      "A smoke detector uses Americium-241, an alpha emitter.",
    parts: [
      {
        id: "13a",
        text: "Explain why an alpha emitter is more suitable than a gamma emitter for this application.",
        marks: 2,
        answer: "Alpha is easily absorbed by smoke; high ionisation.",
        markingScheme:
          "\u2022 Alpha is absorbed by air/smoke (1)\n\u2022 Alpha is highly ionising (1)",
        topicTag: "Nuclear Radiation",
      },
      {
        id: "13bi",
        text: "Identify which source (X, Y, or Z) is Americium-241 based on a half-life of 432 years.",
        marks: 1,
        answer: "Source Z (longest half-life).",
        markingScheme:
          "\u2022 Z (1)",
        topicTag: "Nuclear Radiation",
      },
      {
        id: "13bii",
        text: "Explain why sources X and Y are not suitable for a smoke detector designed to last 10 years.",
        marks: 2,
        answer: "Activity drops too fast.",
        markingScheme:
          "\u2022 Half-life is too short (1)\n\u2022 Detector would need replacing / stop working quickly (1)",
        topicTag: "Nuclear Radiation",
      },
      {
        id: "13c",
        text: "Calculate the absorbed dose for a 1.2 kg sample receiving $8.64 \\times 10^{-4}\\text{ J}$ of energy.",
        marks: 3,
        answer: "$7.2 \\times 10^{-4}\\text{ Gy}$",
        markingScheme:
          "\u2022 $D = \\frac{E}{m}$ (1)\n\u2022 $D = \\frac{8.64 \\times 10^{-4}}{1.2}$ (1)\n\u2022 $D = 7.2 \\times 10^{-4}\\text{ Gy}$ (1)",
        topicTag: "Nuclear Radiation",
      },
    ],
  },
  {
    type: "paper",
    topic: "Radiation",
    subtopic: "Nuclear Radiation",
    question:
      "Nuclear power generation.",
    parts: [
      {
        id: "14a",
        text: "State what is meant by the term nuclear fission.",
        marks: 1,
        answer: "A large nucleus splitting into smaller nuclei.",
        markingScheme:
          "\u2022 A large nucleus splitting into two (or more) smaller nuclei. (1)",
        topicTag: "Nuclear Radiation",
      },
      {
        id: "14b",
        text: "One fission releases $3.2 \\times 10^{-11}\\text{ J}$. Calculate the number of fissions required to produce $600\\text{ MJ}$ of energy.",
        marks: 3,
        answer: "$1.9 \\times 10^{19}$",
        markingScheme:
          "\u2022 Number = $\\frac{\\text{Total Energy}}{\\text{Energy per fission}}$ (1)\n\u2022 $n = \\frac{600 \\times 10^6}{3.2 \\times 10^{-11}}$ (1)\n\u2022 $n = 1.875 \\times 10^{19}$ (1)",
        topicTag: "Nuclear Radiation",
      },
    ],
  },
]
