// SQA National 5 Physics 2024 — Section 2 Past Paper Questions
// Source: data/past-papers/n5-2024-section2

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

export const source = "SQA National 5 Physics 2024 Section 2"


export const questions: RawPaperQuestion[] = [
  {
    type: "paper",
    topic: "Dynamics",
    subtopic: "Velocity-time graphs",
    question:
      "The graph represents the motion of a bus travelling along a straight, level road between two stops. [Diagram: v-t graph showing acceleration from 0 to 9 m/s over 20s, constant velocity of 9 m/s for 40s, and deceleration to 0 over 20s.]",
    parts: [
      {
        id: "ai",
        text: "Describe the motion of the bus between A and B.",
        marks: 1,
        answer: "Constant acceleration (or uniform acceleration)",
        markingScheme:
          "\u2022 Constant acceleration (1)",
        topicTag: "Velocity-time graphs",
      },
      {
        id: "aii",
        text: "Describe the motion of the bus between B and C.",
        marks: 1,
        answer: "Constant velocity (or uniform velocity)",
        markingScheme:
          "\u2022 Constant velocity (1)",
        topicTag: "Velocity-time graphs",
      },
      {
        id: "b",
        text: "Calculate the acceleration of the bus between C and D.",
        marks: 3,
        answer: "$-0.45\\text{ m s}^{-2}$",
        markingScheme:
          "\u2022 $a = \\frac{v-u}{t}$ (1)\n\u2022 $a = \\frac{0 - 9.0}{20}$ (1)\n\u2022 $a = -0.45\\text{ m s}^{-2}$ (1)",
        topicTag: "Acceleration",
      },
      {
        id: "c",
        text: "Determine the distance travelled by the bus between A and D.",
        marks: 3,
        answer: "$540\\text{ m}$",
        markingScheme:
          "\u2022 area under graph (1)\n\u2022 $d = (\\frac{1}{2} \\times 20 \\times 9) + (40 \\times 9) + (\\frac{1}{2} \\times 20 \\times 9)$ (1)\n\u2022 $d = 540\\text{ m}$ (1)",
        topicTag: "Velocity-time graphs",
      },
    ],
  },
  {
    type: "paper",
    topic: "Dynamics",
    subtopic: "Vectors and Scalars",
    question:
      "The triathlon is an endurance race consisting of three stages: swimming, cycling, and running.",
    parts: [
      {
        id: "aiA",
        text: "Determine the magnitude of the resultant of these forces (25 N at 090 and 12 N at 180).",
        marks: 2,
        answer: "$27.7\\text{ N}$",
        markingScheme:
          "\u2022 $R^2 = 25^2 + 12^2$ (1)\n\u2022 $R = 27.7\\text{ N}$ (1)",
        topicTag: "Vectors and Scalars",
      },
      {
        id: "aiB",
        text: "Determine the direction of the resultant of these forces.",
        marks: 2,
        answer: "Bearing 116 (or $26^\\circ$ South of East)",
        markingScheme:
          "\u2022 $\\tan\\theta = \\frac{12}{25}$ (1)\n\u2022 direction = bearing 116 (1)",
        topicTag: "Vectors and Scalars",
      },
      {
        id: "aii",
        text: "The triathlete has a mass of 75 kg. Calculate the acceleration of the triathlete.",
        marks: 3,
        answer: "$0.37\\text{ m s}^{-2}$",
        markingScheme:
          "\u2022 $F = ma$ (1)\n\u2022 $27.7 = 75 \\times a$ (1)\n\u2022 $a = 0.37\\text{ m s}^{-2}$ (1)",
        topicTag: "Newton's Laws",
      },
      {
        id: "b",
        text: "Suggest one way in which the triathlete could reduce the frictional forces acting against them when cycling.",
        marks: 1,
        answer: "Streamlined position / streamlined helmet / thinner tyres / lubricate chain.",
        markingScheme:
          "\u2022 Any valid suggestion related to reducing friction (1)",
        topicTag: "Newton's Laws",
      },
      {
        id: "ci",
        text: "The triathlete takes 38 minutes to complete four laps of a 2.5 km course. Determine the average speed.",
        marks: 3,
        answer: "$4.4\\text{ m s}^{-1}$",
        markingScheme:
          "\u2022 $v = \\frac{d}{t}$ (1)\n\u2022 $v = \\frac{10000}{2280}$ (1)\n\u2022 $v = 4.4\\text{ m s}^{-1}$ (1)",
        topicTag: "Vectors and Scalars",
      },
      {
        id: "cii",
        text: "State the magnitude of the average velocity of the triathlete for this stage.",
        marks: 1,
        answer: "$0\\text{ m s}^{-1}$",
        markingScheme:
          "\u2022 $0\\text{ m s}^{-1}$ (because displacement is zero) (1)",
        topicTag: "Vectors and Scalars",
      },
    ],
  },
  {
    type: "paper",
    topic: "Properties of Matter",
    subtopic: "Newton's Laws",
    question:
      "A skateboarder and board have a combined mass of 65 kg. They slide along a 2.0 m horizontal rail.",
    parts: [
      {
        id: "ai",
        text: "Determine the decrease in kinetic energy as the speed changes from 7.0 m/s to 3.0 m/s.",
        marks: 4,
        answer: "$1300\\text{ J}$",
        markingScheme:
          "\u2022 $E_k = \\frac{1}{2}mv^2$ (1)\n\u2022 $\\Delta E_k = (\\frac{1}{2} \\times 65 \\times 7^2) - (\\frac{1}{2} \\times 65 \\times 3^2)$ (2)\n\u2022 $\\Delta E_k = 1300\\text{ J}$ (1)",
        topicTag: "Newton's Laws",
      },
      {
        id: "aii",
        text: "Calculate the average frictional force between the rail and the skateboard.",
        marks: 3,
        answer: "$650\\text{ N}$",
        markingScheme:
          "\u2022 $E_w = Fd$ (1)\n\u2022 $1300 = F \\times 2.0$ (1)\n\u2022 $F = 650\\text{ N}$ (1)",
        topicTag: "Newton's Laws",
      },
      {
        id: "b",
        text: "Sketch the path of the skateboarder after leaving the rail. [Diagram: horizontal rail above ground.]",
        marks: 1,
        answer: "Curved path downwards (projectile motion).",
        markingScheme:
          "\u2022 Curved path from end of rail to ground (1)",
        topicTag: "Projectile Motion",
      },
    ],
  },
  {
    type: "paper",
    topic: "Space Exploration",
    subtopic: "Newton's Laws",
    question:
      "NASA is planning a crewed mission to the Moon.",
    parts: [
      {
        id: "a",
        text: "Calculate the weight of a 67 kg astronaut at an altitude of 140 km above the Moon (where g = 1.4 N/kg from graph).",
        marks: 3,
        answer: "$93.8\\text{ N}$",
        markingScheme:
          "\u2022 $W = mg$ (1)\n\u2022 $W = 67 \\times 1.4$ (1)\n\u2022 $W = 93.8\\text{ N}$ (1)",
        topicTag: "Newton's Laws",
      },
      {
        id: "b",
        text: "Describe one physics-related challenge these astronauts will face while on the surface of the Moon.",
        marks: 1,
        answer: "Lack of atmosphere / extreme temperatures / cosmic radiation / low gravity effects on body.",
        markingScheme:
          "\u2022 Any valid physics challenge (1)",
        topicTag: "Space Exploration",
      },
      {
        id: "c",
        text: "State and justify what will happen to the acceleration of the transportation module if rockets exert a constant upward force.",
        marks: 3,
        answer: "Acceleration increases.",
        markingScheme:
          "\u2022 Acceleration increases (1)\n\u2022 Mass decreases as fuel is used (1)\n\u2022 $a = F/m$ so as $m$ decreases, $a$ increases (1)",
        topicTag: "Newton's Laws",
      },
    ],
  },
  {
    type: "paper",
    topic: "Space Exploration",
    subtopic: "Cosmology",
    question:
      "Using your knowledge of physics, comment on Copernicus' model of the Universe (Sun motionless at centre, stars fixed).",
    parts: [
      {
        id: "a",
        text: "Using your knowledge of physics, comment on this model.",
        marks: 3,
        answer: "",
        markingScheme:
          "Marks based on breadth and depth of physics knowledge (e.g., Sun orbits Galaxy, stars are not fixed, expansion of universe). (3)",
        featureTag: "open-ended",
        topicTag: "Cosmology",
      },
    ],
  },
  {
    type: "paper",
    topic: "Space Exploration",
    subtopic: "Cosmology",
    question:
      "The James Webb Space Telescope (JWST) is a space-based science observatory.",
    parts: [
      {
        id: "a",
        text: "State an advantage of using a space-based telescope compared to ground-based telescopes.",
        marks: 1,
        answer: "No atmospheric interference / can detect wavelengths absorbed by atmosphere.",
        markingScheme:
          "\u2022 Any valid advantage (1)",
        topicTag: "Space Exploration",
      },
      {
        id: "bi",
        text: "State what is meant by the term exoplanet.",
        marks: 1,
        answer: "A planet outside of our solar system (orbiting another star).",
        markingScheme:
          "\u2022 Planet orbiting a star other than the Sun (1)",
        topicTag: "Space Exploration",
      },
      {
        id: "bii",
        text: "Determine the distance in metres to a star 41 light-years from Earth.",
        marks: 3,
        answer: "$3.88 \\times 10^{17}\\text{ m}$",
        markingScheme:
          "\u2022 $d = vt$ (1)\n\u2022 $d = 3 \\times 10^8 \\times (41 \\times 365.25 \\times 24 \\times 3600)$ (1)\n\u2022 $d = 3.88 \\times 10^{17}\\text{ m}$ (1)",
        topicTag: "Cosmology",
      },
      {
        id: "c",
        text: "Determine which elements (Hydrogen, Helium, Mercury, Nitrogen) are present in the star based on the line spectra.",
        marks: 1,
        answer: "Hydrogen and Helium",
        markingScheme:
          "\u2022 Hydrogen and Helium (1)",
        topicTag: "Cosmology",
      },
    ],
  },
  {
    type: "paper",
    topic: "Electricity",
    subtopic: "Current, voltage and resistance",
    question:
      "A wireless charger uses radio waves to charge the battery of a mobile phone.",
    parts: [
      {
        id: "a",
        text: "Explain in terms of electron flow what is meant by direct current.",
        marks: 1,
        answer: "Electrons flow in only one direction.",
        markingScheme:
          "\u2022 Flow of electrons in one direction only (1)",
        topicTag: "Current, voltage and resistance",
      },
      {
        id: "b",
        text: "Calculate the charge supplied in 1.5 hours if the current is 2.5 A.",
        marks: 3,
        answer: "$13500\\text{ C}$",
        markingScheme:
          "\u2022 $Q = It$ (1)\n\u2022 $Q = 2.5 \\times (1.5 \\times 3600)$ (1)\n\u2022 $Q = 13500\\text{ C}$ (1)",
        topicTag: "Current, voltage and resistance",
      },
      {
        id: "c",
        text: "Explain how a thermistor-based circuit operates to switch on a fan as temperature increases.",
        marks: 3,
        answer: "",
        markingScheme:
          "\u2022 Temperature increases, thermistor resistance decreases (1)\n\u2022 Voltage across thermistor decreases / voltage across variable resistor increases (1)\n\u2022 Transistor switches on, activating fan (1)",
        topicTag: "Current, voltage and resistance",
      },
      {
        id: "d",
        text: "An LED has 2.2 V and 18 mA. Determine the resistance of the series resistor connected to a 5.0 V supply.",
        marks: 4,
        answer: "$156\\text{ }\\Omega$",
        markingScheme:
          "\u2022 $V_R = 5.0 - 2.2 = 2.8\\text{ V}$ (1)\n\u2022 $V = IR$ (1)\n\u2022 $2.8 = 0.018 \\times R$ (1)\n\u2022 $R = 156\\text{ }\\Omega$ (1)",
        topicTag: "Current, voltage and resistance",
      },
    ],
  },
  {
    type: "paper",
    topic: "Electricity",
    subtopic: "Current, voltage and resistance",
    question:
      "A student investigates the relationship between current and voltage for a lamp.",
    parts: [
      {
        id: "ai",
        text: "Draw a graph of the results (Current vs Voltage table provided).",
        marks: 3,
        answer: "",
        markingScheme:
          "\u2022 Axes labeled and scaled (1), points plotted (1), curve of best fit (1)",
        topicTag: "Current, voltage and resistance",
      },
      {
        id: "aii",
        text: "Determine the voltage when current is 0.70 A using the graph.",
        marks: 1,
        answer: "Consistent with graph (approx 6.6 V).",
        markingScheme:
          "\u2022 Value from graph (1)",
        topicTag: "Current, voltage and resistance",
      },
      {
        id: "aiii",
        text: "Describe how the student obtained a range of values using the circuit.",
        marks: 1,
        answer: "Adjusted the variable resistor.",
        markingScheme:
          "\u2022 Adjusting variable resistor (1)",
        topicTag: "Current, voltage and resistance",
      },
      {
        id: "b",
        text: "Sketch a V-I graph for a fixed resistor.",
        marks: 1,
        answer: "Straight line through the origin.",
        markingScheme:
          "\u2022 Straight line through origin (1)",
        topicTag: "Current, voltage and resistance",
      },
    ],
  },
  {
    type: "paper",
    topic: "Properties of Matter",
    subtopic: "Specific Heat Capacity",
    question:
      "A microwave oven is used to heat 0.020 kg of water to sterilise a baby bottle.",
    parts: [
      {
        id: "ai",
        text: "Calculate the energy required to heat 0.020 kg water from 6.3 \u00b0C to 100 \u00b0C.",
        marks: 3,
        answer: "$7836\\text{ J}$",
        markingScheme:
          "\u2022 $E_h = cm\\Delta T$ (1)\n\u2022 $E_h = 4180 \\times 0.020 \\times (100 - 6.3)$ (1)\n\u2022 $E_h = 7836\\text{ J}$ (1)",
        topicTag: "Specific Heat Capacity",
      },
      {
        id: "aii",
        text: "Calculate the energy to change 0.014 kg of water at 100 \u00b0C to steam.",
        marks: 3,
        answer: "$31640\\text{ J}$",
        markingScheme:
          "\u2022 $E_h = mL_v$ (1)\n\u2022 $E_h = 0.014 \\times 2.26 \\times 10^6$ (1)\n\u2022 $E_h = 31640\\text{ J}$ (1)",
        topicTag: "Specific Latent Heat",
      },
      {
        id: "aiii",
        text: "Determine the minimum energy to produce 0.014 kg of steam from the initial state.",
        marks: 1,
        answer: "$39476\\text{ J}$",
        markingScheme:
          "\u2022 Sum of energy from (ai) and (aii) (1)",
        topicTag: "Specific Latent Heat",
        dependsOn: ["ai", "aii"],
      },
      {
        id: "bi",
        text: "Calculate total energy used by a 750 W microwave in 180 s.",
        marks: 3,
        answer: "$135000\\text{ J}$",
        markingScheme:
          "\u2022 $E = Pt$ (1)\n\u2022 $E = 750 \\times 180$ (1)\n\u2022 $E = 135000\\text{ J}$ (1)",
        topicTag: "Electrical Power",
      },
      {
        id: "bii",
        text: "Explain why total energy used is different from the minimum energy required.",
        marks: 1,
        answer: "Energy is lost to the surroundings / heating the bottle.",
        markingScheme:
          "\u2022 Heat lost to surroundings (1)",
        topicTag: "Specific Heat Capacity",
      },
    ],
  },
  {
    type: "paper",
    topic: "Properties of Matter",
    subtopic: "Pressure, Kinetic Theory and Gas Laws",
    question:
      "A cyclist inflates bike tyres.",
    parts: [
      {
        id: "ai",
        text: "Determine the pressure at 14 \u00b0C if initial pressure is 655 kPa at 21 \u00b0C (volume constant).",
        marks: 3,
        answer: "$639\\text{ kPa}$",
        markingScheme:
          "\u2022 $P_1/T_1 = P_2/T_2$ (1)\n\u2022 $655/294 = P_2/287$ (1)\n\u2022 $P_2 = 639\\text{ kPa}$ (1)",
        topicTag: "Pressure, Kinetic Theory and Gas Laws",
      },
      {
        id: "aii",
        text: "Explain using the kinetic model how decrease in temperature affects pressure.",
        marks: 3,
        answer: "",
        markingScheme:
          "\u2022 Speed/kinetic energy of particles decreases (1)\n\u2022 Particles hit walls less frequently / with less force (1)\n\u2022 Total force on walls decreases (1)",
        topicTag: "Pressure, Kinetic Theory and Gas Laws",
      },
      {
        id: "b",
        text: "Tyres have area $7.5 \\times 10^{-4}\\text{ m}^2$ and pressure $1.02 \\times 10^6\\text{ Pa}$. Determine the total mass.",
        marks: 4,
        answer: "$78\\text{ kg}$",
        markingScheme:
          "\u2022 $F = PA$ (1)\n\u2022 $F = 1.02 \\times 10^6 \\times 7.5 \\times 10^{-4} = 765\\text{ N}$ (1)\n\u2022 $m = W/g = 765/9.8$ (1)\n\u2022 $m = 78\\text{ kg}$ (1)",
        topicTag: "Pressure, Kinetic Theory and Gas Laws",
      },
    ],
  },
  {
    type: "paper",
    topic: "Waves",
    subtopic: "Wave properties",
    question:
      "A wave energy converter anchored to the seabed.",
    parts: [
      {
        id: "a",
        text: "State what is meant by the term transverse wave.",
        marks: 1,
        answer: "Oscillations are at right angles to the direction of energy transfer.",
        markingScheme:
          "\u2022 Vibration at right angles to energy direction (1)",
        topicTag: "Wave properties",
      },
      {
        id: "bi",
        text: "Calculate frequency if one wave takes 7.4 s to pass.",
        marks: 3,
        answer: "$0.14\\text{ Hz}$",
        markingScheme:
          "\u2022 $f = 1/T$ (1)\n\u2022 $f = 1/7.4$ (1)\n\u2022 $f = 0.14\\text{ Hz}$ (1)",
        topicTag: "Wave properties",
      },
      {
        id: "bii",
        text: "Suggest how accuracy of frequency determination could be improved.",
        marks: 1,
        answer: "Measure time for multiple waves and divide.",
        markingScheme:
          "\u2022 Measure many waves and average (1)",
        topicTag: "Wave properties",
      },
    ],
  },
  {
    type: "paper",
    topic: "Waves",
    subtopic: "Wave properties",
    question:
      "Water waves approaching a gap in a harbour wall. [Diagram: Waves entering a gap.]",
    parts: [
      {
        id: "a",
        text: "State the name given to the effect shown in the diagram.",
        marks: 1,
        answer: "Diffraction",
        markingScheme:
          "\u2022 Diffraction (1)",
        topicTag: "Wave properties",
      },
      {
        id: "b",
        text: "The gap is 20 m. Long wavelength waves (35 m) are now used. State the effect on the waves after passing through the gap.",
        marks: 1,
        answer: "More diffraction (greater spreading).",
        markingScheme:
          "\u2022 More diffraction / greater spreading (1)",
        topicTag: "Wave properties",
      },
    ],
  },
  {
    type: "paper",
    topic: "Waves",
    subtopic: "EM Spectrum",
    question:
      "A scanner uses X-rays to detect hidden objects.",
    parts: [
      {
        id: "ai",
        text: "State one other application of X-rays in medicine.",
        marks: 1,
        answer: "Detecting broken bones / dental scans.",
        markingScheme:
          "\u2022 Any valid medical use (1)",
        topicTag: "EM Spectrum",
      },
      {
        id: "aii",
        text: "Calculate the wavelength of X-rays with a frequency of $2.5 \\times 10^{17}\\text{ Hz}$.",
        marks: 3,
        answer: "$1.2 \\times 10^{-9}\\text{ m}$",
        markingScheme:
          "\u2022 $v = f\\lambda$ (1)\n\u2022 $3 \\times 10^8 = 2.5 \\times 10^{17} \\times \\lambda$ (1)\n\u2022 $\\lambda = 1.2 \\times 10^{-9}\\text{ m}$ (1)",
        topicTag: "EM Spectrum",
      },
      {
        id: "b",
        text: "Comment on the statement about electrons 'whizzing round' and turning into light.",
        marks: 3,
        answer: "",
        markingScheme:
          "Open-ended; credit for identifying misconceptions (energy conversion vs electron conversion). (3)",
        featureTag: "open-ended",
        topicTag: "EM Spectrum",
      },
    ],
  },
  {
    type: "paper",
    topic: "Radiation",
    subtopic: "Nuclear Radiation",
    question:
      "A worker in a nuclear power station is exposed to radiation.",
    parts: [
      {
        id: "a",
        text: "Calculate the equivalent dose for an absorbed dose of 0.50 mGy from alpha (Wr=20).",
        marks: 3,
        answer: "$10\\text{ mSv}$",
        markingScheme:
          "\u2022 $H = D w_r$ (1)\n\u2022 $H = 0.50 \\times 20$ (1)\n\u2022 $H = 10\\text{ mSv}$ (1)",
        topicTag: "Nuclear Radiation",
      },
      {
        id: "b",
        text: "The worker has a mass of 80 kg. Calculate the energy absorbed.",
        marks: 3,
        answer: "$0.04\\text{ J}$",
        markingScheme:
          "\u2022 $D = E/m$ (1)\n\u2022 $0.50 \\times 10^{-3} = E/80$ (1)\n\u2022 $E = 0.04\\text{ J}$ (1)",
        topicTag: "Nuclear Radiation",
      },
    ],
  },
  {
    type: "paper",
    topic: "Radiation",
    subtopic: "Nuclear Radiation",
    question:
      "Nuclear reactors use fission to generate electricity.",
    parts: [
      {
        id: "a",
        text: "State what is meant by the term nuclear fission.",
        marks: 1,
        answer: "A large nucleus splitting into smaller nuclei, releasing energy and neutrons.",
        markingScheme:
          "\u2022 Splitting of a large nucleus (1)",
        topicTag: "Nuclear Radiation",
      },
      {
        id: "b",
        text: "Describe the role of neutrons in a chain reaction.",
        marks: 2,
        answer: "Neutrons released in one fission hit other nuclei, causing more fission.",
        markingScheme:
          "\u2022 Neutrons cause further fission (1) \u2022 Chain reaction continues (1)",
        topicTag: "Nuclear Radiation",
      },
    ],
  },
]
