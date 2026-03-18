// SQA National 5 Physics 2022 — Section 2 Past Paper Questions
// Source: data/past-papers/n5-2022-section2

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

export const source = "SQA National 5 Physics 2022 Section 2"


export const questions: RawPaperQuestion[] = [
  {
    type: "paper",
    topic: "Dynamics",
    subtopic: "Velocity-time graphs",
    question:
      "The graph represents the motion of a bus travelling along a straight, level road between two stops. [Diagram: Velocity-time graph showing constant acceleration from 0 to 10 m/s in 20s (A to B), constant velocity of 10 m/s for 40s (B to C), and constant deceleration to rest in 20s (C to D).]",
    parts: [
      {
        id: "1ai",
        text: "Describe the motion of the bus between A and B.",
        marks: 1,
        answer: "(Constant/uniform) acceleration",
        markingScheme:
          "\u2022 (Constant/uniform) acceleration (1)",
        topicTag: "Velocity-time graphs",
      },
      {
        id: "1aii",
        text: "Describe the motion of the bus between B and C.",
        marks: 1,
        answer: "Constant/steady/uniform velocity (or speed)",
        markingScheme:
          "\u2022 Constant/steady/uniform velocity/speed (1)",
        topicTag: "Velocity-time graphs",
      },
      {
        id: "1b",
        text: "Calculate the acceleration of the bus between C and D.",
        marks: 3,
        answer: "$-0.50\\text{ m s}^{-2}$ (or magnitude $0.50\\text{ m s}^{-2}$)",
        markingScheme:
          "\u2022 $a = \\frac{v-u}{t}$ (1)\n\u2022 $a = \\frac{0 - 10}{80 - 60}$ (1)\n\u2022 $a = -0.50\\text{ m s}^{-2}$ (1)",
        topicTag: "Acceleration",
      },
      {
        id: "1c",
        text: "Determine the distance travelled by the bus between A and D.",
        marks: 3,
        answer: "$600\\text{ m}$",
        markingScheme:
          "\u2022 $d = \\text{area under graph}$ (1)\n\u2022 $d = (0.5 \\times 20 \\times 10) + (40 \\times 10) + (0.5 \\times 20 \\times 10)$ (1)\n\u2022 $d = 600\\text{ m}$ (1)",
        topicTag: "Velocity-time graphs",
      },
    ],
  },
  {
    type: "paper",
    topic: "Dynamics",
    subtopic: "Newton's Laws",
    question:
      "The triathlon is an endurance race consisting of three stages: swimming, cycling, and running. (a) The first stage is a 1.5 km open-water swim. At one point, the unbalanced forward force is 25 N at bearing 090. A current exerts a force of 12 N at bearing 180.",
    parts: [
      {
        id: "2aiA",
        text: "By scale drawing or otherwise, determine the magnitude of the resultant of these forces.",
        marks: 2,
        answer: "$27.7\\text{ N}$ (accept 28)",
        markingScheme:
          "\u2022 $F = \\sqrt{25^2 + 12^2}$ (1)\n\u2022 $F = 27.7\\text{ N}$ (1)",
        topicTag: "Vectors and Scalars",
      },
      {
        id: "2aiB",
        text: "By scale drawing or otherwise, determine the direction of the resultant of these forces.",
        marks: 2,
        answer: "$116$ (or $26^\\circ$ South of East)",
        markingScheme:
          "\u2022 $\\tan\\theta = \\frac{12}{25}$ (1)\n\u2022 Bearing $= 116$ (1)",
        topicTag: "Vectors and Scalars",
      },
      {
        id: "2aii",
        text: "The triathlete has a mass of 75 kg. Calculate the acceleration of the triathlete.",
        marks: 3,
        answer: "$0.37\\text{ m s}^{-2}$",
        markingScheme:
          "\u2022 $F = ma$ (1)\n\u2022 $27.7 = 75 \\times a$ (1)\n\u2022 $a = 0.37\\text{ m s}^{-2}$ (1)",
        topicTag: "Newton's Laws",
      },
      {
        id: "2b",
        text: "Suggest one way in which the triathlete could reduce the frictional forces acting against them when cycling.",
        marks: 1,
        answer: "Use aerodynamic helmet/clothing, lubricate chain, etc.",
        markingScheme:
          "\u2022 Any valid suggestion like: tri-bars, aero helmet, tight clothing, lubricant. (1)",
        topicTag: "Newton's Laws",
      },
      {
        id: "2ci",
        text: "The third stage involves running four laps of a 2.5 km course in 38 minutes. Determine the average speed of the triathlete for this stage.",
        marks: 3,
        answer: "$4.4\\text{ m s}^{-1}$",
        markingScheme:
          "\u2022 $v = \\frac{d}{t}$ (1)\n\u2022 $v = \\frac{10000}{2280}$ (1)\n\u2022 $v = 4.4\\text{ m s}^{-1}$ (1)",
        topicTag: "Vectors and Scalars",
      },
      {
        id: "2cii",
        text: "State the magnitude of the average velocity of the triathlete for this stage.",
        marks: 1,
        answer: "$0\\text{ m s}^{-1}$",
        markingScheme:
          "\u2022 $0$ (because displacement is zero). (1)",
        topicTag: "Vectors and Scalars",
      },
    ],
  },
  {
    type: "paper",
    topic: "Dynamics",
    subtopic: "Newton's Laws",
    question:
      "A skateboarder and board (mass 65 kg) slide along a 2.0 m horizontal rail. Speed decreases from 7.0 m/s to 3.0 m/s.",
    parts: [
      {
        id: "3ai",
        text: "Determine the decrease in kinetic energy as they slide along the rail.",
        marks: 4,
        answer: "$1300\\text{ J}$",
        markingScheme:
          "\u2022 $E_k = \\frac{1}{2}mv^2$ (1)\n\u2022 $\\Delta E_k = (0.5 \\times 65 \\times 7^2) - (0.5 \\times 65 \\times 3^2)$ (2)\n\u2022 $\\Delta E_k = 1300\\text{ J}$ (1)",
        topicTag: "Newton's Laws",
      },
      {
        id: "3aii",
        text: "Calculate the average frictional force between the rail and the skateboard.",
        marks: 3,
        answer: "$650\\text{ N}$",
        markingScheme:
          "\u2022 $E_w = Fd$ (1)\n\u2022 $1300 = F \\times 2.0$ (1)\n\u2022 $F = 650\\text{ N}$ (1)",
        topicTag: "Newton's Laws",
      },
      {
        id: "3b",
        text: "Sketch the path of the skateboarder and board between leaving the rail and reaching the ground.",
        marks: 1,
        answer: "Curved path (parabola).",
        markingScheme:
          "\u2022 Curved path starting horizontally. (1)",
        topicTag: "Projectile Motion",
      },
    ],
  },
  {
    type: "paper",
    topic: "Space",
    subtopic: "Newton's Laws",
    question:
      "NASA plans a mission to the Moon, placing a spacecraft in orbit at 140 km altitude.",
    parts: [
      {
        id: "4a",
        text: "Calculate the weight of a 67 kg astronaut at 140 km altitude (using provided graph).",
        marks: 3,
        answer: "$94\\text{ N}$",
        markingScheme:
          "\u2022 $g = 1.4\\text{ N kg}^{-1}$ (from graph) (1)\n\u2022 $W = mg = 67 \\times 1.4$ (1)\n\u2022 $W = 94\\text{ N}$ (1)",
        topicTag: "Newton's Laws",
      },
      {
        id: "4b",
        text: "Describe one physics-related challenge astronauts will face on the surface of the Moon.",
        marks: 1,
        answer: "Temperature extremes / no atmosphere / radiation.",
        markingScheme:
          "\u2022 Any valid physics challenge like vacuum, cosmic rays, or extreme temp. (1)",
        topicTag: "Space Exploration",
      },
      {
        id: "4c",
        text: "State what will happen to the acceleration of the module as rockets exert a constant upward force while returning to orbit. Justify your answer.",
        marks: 3,
        answer: "Acceleration increases.",
        markingScheme:
          "\u2022 Acceleration increases (1)\n\u2022 Mass decreases (fuel used) (1)\n\u2022 Weight/gravity decreases (increasing altitude) (1)",
        topicTag: "Newton's Laws",
      },
    ],
  },
  {
    type: "paper",
    topic: "Space",
    subtopic: "Cosmology",
    question:
      "Nicolaus Copernicus proposed a model of the Universe with the Sun motionless at its centre and stars fixed. Comment on this model.",
    parts: [
      {
        id: "5",
        text: "Using your knowledge of physics, comment on this model.",
        marks: 3,
        answer: "Open response.",
        markingScheme:
          "\u2022 Credit for breadth/depth: Sun is centre of Solar System, not Universe; Universe is expanding; stars are moving. (Max 3)",
        featureTag: "open-ended",
        topicTag: "Cosmology",
      },
    ],
  },
  {
    type: "paper",
    topic: "Space",
    subtopic: "Space Exploration",
    question:
      "James Webb Space Telescope (JWST) is used to study exoplanet LHS 475 b.",
    parts: [
      {
        id: "6a",
        text: "State an advantage of using a space-based telescope compared to ground-based telescopes.",
        marks: 1,
        answer: "No atmosphere to distort/absorb light.",
        markingScheme:
          "\u2022 No atmospheric distortion / no light pollution / can detect IR/UV blocked by atmosphere. (1)",
        topicTag: "Space Exploration",
      },
      {
        id: "6bi",
        text: "State what is meant by the term exoplanet.",
        marks: 1,
        answer: "A planet outside our Solar System.",
        markingScheme:
          "\u2022 A planet orbiting another star (outside our Solar System). (1)",
        topicTag: "Space Exploration",
      },
      {
        id: "6bii",
        text: "The star is 41 light-years from Earth. Determine the distance in metres.",
        marks: 3,
        answer: "$3.9 \\times 10^{17}\\text{ m}$",
        markingScheme:
          "\u2022 $d = vt$ (1)\n\u2022 $d = 3 \\times 10^8 \\times (41 \\times 365.25 \\times 24 \\times 3600)$ (1)\n\u2022 $d = 3.9 \\times 10^{17}\\text{ m}$ (1)",
        topicTag: "Cosmology",
      },
      {
        id: "6c",
        text: "Determine which elements (from Hydrogen, Helium, Mercury, Nitrogen) are present in the star based on provided spectra.",
        marks: 1,
        answer: "Hydrogen, Helium, and Mercury.",
        markingScheme:
          "\u2022 Hydrogen, Helium, and Mercury. (1)",
        topicTag: "Cosmology",
      },
    ],
  },
  {
    type: "paper",
    topic: "Electricity",
    subtopic: "Current, voltage and resistance",
    question:
      "A wireless phone charger connected to a d.c. supply.",
    parts: [
      {
        id: "7a",
        text: "Explain in terms of electron flow what is meant by direct current.",
        marks: 1,
        answer: "Electrons flow in one direction only.",
        markingScheme:
          "\u2022 Electrons flow in one direction only. (1)",
        topicTag: "Current, voltage and resistance",
      },
      {
        id: "7b",
        text: "Current is 2.5 A for 1.5 hours. Calculate the charge supplied.",
        marks: 3,
        answer: "$13500\\text{ C}$",
        markingScheme:
          "\u2022 $Q = It$ (1)\n\u2022 $Q = 2.5 \\times (1.5 \\times 3600)$ (1)\n\u2022 $Q = 13500\\text{ C}$ (1)",
        topicTag: "Current, voltage and resistance",
      },
      {
        id: "7c",
        text: "Explain how the fan circuit operates to switch on when temperature increases.",
        marks: 3,
        answer: "Temp up, resistance down, transistor turns on.",
        markingScheme:
          "\u2022 Temp up $\\rightarrow$ thermistor resistance down (1)\n\u2022 Voltage across thermistor/transistor input increases (1)\n\u2022 Transistor switches on (above 0.7 V) (1)",
        topicTag: "Current, voltage and resistance",
      },
      {
        id: "7d",
        text: "LED: 2.2 V, 18 mA. Supply: 5.0 V. Determine resistance of series resistor.",
        marks: 4,
        answer: "$156\\text{ }\\Omega$",
        markingScheme:
          "\u2022 $V_R = 5.0 - 2.2 = 2.8\\text{ V}$ (1)\n\u2022 $R = \\frac{V}{I}$ (1)\n\u2022 $R = \\frac{2.8}{0.018}$ (1)\n\u2022 $R = 156\\text{ }\\Omega$ (1)",
        topicTag: "Current, voltage and resistance",
      },
    ],
  },
  {
    type: "paper",
    topic: "Electricity",
    subtopic: "Current, voltage and resistance",
    question:
      "A student investigates the current-voltage relationship for a lamp.",
    parts: [
      {
        id: "8ai",
        text: "Draw a graph of the results (table provided).",
        marks: 3,
        answer: "Best-fit curve.",
        markingScheme:
          "\u2022 Scaled axes with labels/units (1)\n\u2022 Points plotted correctly (1)\n\u2022 Best-fit curve (1)",
        topicTag: "Current, voltage and resistance",
      },
      {
        id: "8aii",
        text: "Determine voltage at 0.70 A from the graph.",
        marks: 1,
        answer: "$6.6\\text{ V}$ (approx)",
        markingScheme:
          "\u2022 Correct reading from candidate's graph. (1)",
        topicTag: "Current, voltage and resistance",
      },
      {
        id: "8aiii",
        text: "Describe how the student obtained a range of values.",
        marks: 1,
        answer: "Adjusting the variable resistor.",
        markingScheme:
          "\u2022 By adjusting/changing the resistance of the variable resistor. (1)",
        topicTag: "Current, voltage and resistance",
      },
    ],
  },
  {
    type: "paper",
    topic: "Properties of Matter",
    subtopic: "Specific Heat Capacity",
    question:
      "An aluminum block (mass 2.0 kg) is heated by a 48 W heater for 10 minutes. Temp rises from 21\u00b0C to 45\u00b0C.",
    parts: [
      {
        id: "9a",
        text: "Calculate the energy supplied.",
        marks: 3,
        answer: "$28800\\text{ J}$",
        markingScheme:
          "\u2022 $E = Pt$ (1)\n\u2022 $E = 48 \\times 600$ (1)\n\u2022 $E = 28800\\text{ J}$ (1)",
        topicTag: "Specific Heat Capacity",
      },
      {
        id: "9b",
        text: "Calculate the specific heat capacity of aluminum from these results.",
        marks: 3,
        answer: "$600\\text{ J kg}^{-1\\text{ }\\circ}\\text{C}^{-1}$",
        markingScheme:
          "\u2022 $c = \\frac{E}{m\\Delta T}$ (1)\n\u2022 $c = \\frac{28800}{2.0 \\times 24}$ (1)\n\u2022 $c = 600\\text{ J kg}^{-1\\text{ }\\circ}\\text{C}^{-1}$ (1)",
        topicTag: "Specific Heat Capacity",
      },
      {
        id: "9c",
        text: "Suggest one way to improve accuracy.",
        marks: 1,
        answer: "Insulate the block.",
        markingScheme:
          "\u2022 Insulate the block / oil in thermometer hole. (1)",
        topicTag: "Specific Heat Capacity",
      },
    ],
  },
  {
    type: "paper",
    topic: "Properties of Matter",
    subtopic: "Pressure, Kinetic Theory and Gas Laws",
    question:
      "Pressure of a gas at 20\u00b0C is 120 kPa. Volume is constant.",
    parts: [
      {
        id: "10a",
        text: "State the relationship between pressure and temperature (in Kelvin).",
        marks: 1,
        answer: "Directly proportional.",
        markingScheme:
          "\u2022 Pressure is directly proportional to temperature in Kelvin. (1)",
        topicTag: "Pressure, Kinetic Theory and Gas Laws",
      },
      {
        id: "10b",
        text: "Calculate the final pressure when temperature rises to 60\u00b0C.",
        marks: 3,
        answer: "$136\\text{ kPa}$",
        markingScheme:
          "\u2022 $\\frac{P_1}{T_1} = \\frac{P_2}{T_2}$ (1)\n\u2022 $\\frac{120}{293} = \\frac{P_2}{333}$ (1)\n\u2022 $P_2 = 136\\text{ kPa}$ (1)",
        topicTag: "Pressure, Kinetic Theory and Gas Laws",
      },
      {
        id: "10c",
        text: "Explain the pressure increase in terms of kinetic theory.",
        marks: 3,
        answer: "Particles move faster, hit walls harder/more often.",
        markingScheme:
          "\u2022 Particles gain kinetic energy/move faster (1)\n\u2022 Particles hit walls more frequently/harder (1)\n\u2022 Total force on walls increases (so pressure up) (1)",
        topicTag: "Pressure, Kinetic Theory and Gas Laws",
      },
    ],
  },
  {
    type: "paper",
    topic: "Waves",
    subtopic: "Refraction of light",
    question:
      "Light ray enters a glass block from air.",
    parts: [
      {
        id: "11a",
        text: "Calculate refractive index of the glass (angles 50\u00b0 and 30\u00b0 provided).",
        marks: 3,
        answer: "$1.53$",
        markingScheme:
          "\u2022 $n = \\frac{\\sin i}{\\sin r}$ (1)\n\u2022 $n = \\frac{\\sin 50}{\\sin 30}$ (1)\n\u2022 $n = 1.53$ (1)",
        topicTag: "Refraction of light",
      },
      {
        id: "11b",
        text: "State what happens to speed, wavelength, and frequency in the glass.",
        marks: 3,
        answer: "Speed down, wavelength down, frequency same.",
        markingScheme:
          "\u2022 Speed decreases (1), wavelength decreases (1), frequency same (1).",
        topicTag: "Refraction of light",
      },
    ],
  },
  {
    type: "paper",
    topic: "Waves",
    subtopic: "EM Spectrum",
    question:
      "Applications of EM radiation.",
    parts: [
      {
        id: "12a",
        text: "Identify the member of the spectrum with the highest frequency.",
        marks: 1,
        answer: "Gamma rays.",
        markingScheme:
          "\u2022 Gamma rays. (1)",
        topicTag: "EM Spectrum",
      },
      {
        id: "12b",
        text: "Describe a medical application for X-rays.",
        marks: 1,
        answer: "Detecting broken bones.",
        markingScheme:
          "\u2022 Detecting broken bones / dental scans / CT scans. (1)",
        topicTag: "EM Spectrum",
      },
    ],
  },
  {
    type: "paper",
    topic: "Radiation",
    subtopic: "Nuclear Radiation",
    question:
      "A worker is exposed to alpha and beta radiation.",
    parts: [
      {
        id: "13a",
        text: "Define equivalent dose.",
        marks: 1,
        answer: "Measure of biological effect.",
        markingScheme:
          "\u2022 Measure of the biological effect/harm of radiation. (1)",
        topicTag: "Nuclear Radiation",
      },
      {
        id: "13b",
        text: "Calculate total equivalent dose (Absorbed doses and $w_r$ values provided).",
        marks: 4,
        answer: "Calculated total.",
        markingScheme:
          "\u2022 $H = Dw_r$ for each (2)\n\u2022 $H_{total} = H_1 + H_2$ (1)\n\u2022 Final answer with unit (Sv) (1)",
        topicTag: "Nuclear Radiation",
      },
    ],
  },
  {
    type: "paper",
    topic: "Radiation",
    subtopic: "Nuclear Radiation",
    question:
      "Nuclear power generation using Uranium-235.",
    parts: [
      {
        id: "14a",
        text: "Describe a nuclear fission chain reaction.",
        marks: 2,
        answer: "Neutrons hit nuclei, release more neutrons.",
        markingScheme:
          "\u2022 One fission releases neutrons (1)\n\u2022 These go on to cause further fissions (1)",
        topicTag: "Nuclear Radiation",
      },
      {
        id: "14b",
        text: "State one challenge of nuclear fusion as a power source.",
        marks: 1,
        answer: "High temperature / containment.",
        markingScheme:
          "\u2022 Challenge like: plasma containment / high temperature requirement. (1)",
        topicTag: "Nuclear Radiation",
      },
    ],
  },
]
