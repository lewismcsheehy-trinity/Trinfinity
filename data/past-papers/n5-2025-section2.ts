// SQA National 5 Physics 2025 — Section 2 Past Paper Questions
// Source: data/past-papers/n5-2025-section2.JSON

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

export const source = "SQA National 5 Physics 2025 Section 2"


export const questions: RawPaperQuestion[] = [
  {
    type: "paper",
    topic: "Vectors and Scalars",
    subtopic: "Vectors and Scalars",
    question:
      "A gardener is mowing grass with a lawnmower. The gardener walks from point X to point Y as shown, while pushing the lawnmower. [Diagram: A path starting at X, going 15 m North, then 32 m East, then 4 m South to point Y. Not to scale.]",
    parts: [
      {
        id: "ai",
        text: "By scale diagram or otherwise, determine the magnitude of the resultant displacement of the gardener from point X to point Y.",
        marks: 2,
        answer: "$33.8\\text{ m}$",
        markingScheme:
          "• $s^2 = 11^2 + 32^2$ (1)\n• $s = 33.8\\text{ m}$ (1)",
        topicTag: "Vectors and Scalars",
      },
      {
        id: "aii",
        text: "By scale diagram or otherwise, determine the direction of the resultant displacement of the gardener from point X to point Y.",
        marks: 2,
        answer: "$071$ (or bearing $071$)",
        markingScheme:
          "• $\\tan\\theta = \\frac{32}{11}$ (1)\n• $\\theta = 71^\\circ$ (1)",
        topicTag: "Vectors and Scalars",
      },
      {
        id: "b",
        text: "The gardener takes 55 s to walk from point X to point Y. Determine the average velocity of the gardener from point X to point Y.",
        marks: 3,
        answer: "$0.61\\text{ m s}^{-1}$ at $071$",
        markingScheme:
          "• $v = \\frac{s}{t}$ (1)\n• $v = \\frac{33.8}{55}$ (1)\n• $v = 0.61\\text{ m s}^{-1}$ at $071$ (1)",
        dependsOn: ["ai", "aii"],
        topicTag: "Vectors and Scalars",
      },
      {
        id: "c",
        text: "The gardener pushes the lawnmower with an average force of 68 N while walking between point X and point Y. Calculate the work done in moving the lawnmower between point X and point Y.",
        marks: 3,
        answer: "$3468\\text{ J}$",
        markingScheme:
          "• $d = 15 + 32 + 4 = 51\\text{ m}$ (1)\n• $E_w = Fd$ (1)\n• $E_w = 68 \\times 51 = 3468\\text{ J}$ (1)",
        topicTag: "Newton's Laws",
      },
    ],
  },
  {
    type: "paper",
    topic: "Newton's Laws",
    subtopic: "Newton's Laws",
    question:
      "The Falcon Heavy rocket is used to carry a satellite from Earth into space. [Diagram: A rocket on a launchpad.]",
    parts: [
      {
        id: "ai",
        text: "The total mass of the rocket and satellite at launch is $1.43 \\times 10^6\\text{ kg}$. Calculate the weight of the rocket and satellite at launch.",
        marks: 3,
        answer: "$1.40 \\times 10^7\\text{ N}$",
        markingScheme:
          "• $W = mg$ (1)\n• $W = 1.43 \\times 10^6 \\times 9.8$ (1)\n• $W = 1.40 \\times 10^7\\text{ N}$ (1)",
        topicTag: "Newton's Laws",
      },
      {
        id: "aii",
        text: "At launch, the initial upward thrust acting on the rocket is $2.28 \\times 10^7\\text{ N}$. Determine the initial acceleration of the rocket and satellite.",
        marks: 4,
        answer: "$6.15\\text{ m s}^{-2}$",
        markingScheme:
          "• $F = \\text{thrust} - \\text{weight}$ (1)\n• $F = 2.28 \\times 10^7 - 1.40 \\times 10^7 = 0.88 \\times 10^7\\text{ N}$ (1)\n• $a = \\frac{F}{m}$ (1)\n• $a = 6.15\\text{ m s}^{-2}$ (1)",
        dependsOn: ["ai"],
        topicTag: "Newton's Laws",
      },
      {
        id: "bi",
        text: "The rocket is designed so that many parts are reusable. Two reusable parts are the payload fairing sections... On the diagram below, show all the forces acting on one of the payload fairing sections as it falls vertically through the Earth's atmosphere. You must name these forces and show their directions. [Diagram: A rectangular box representing a fairing section.]",
        marks: 2,
        answer: "",
        markingScheme:
          "• arrow pointing up labeled 'air resistance' or 'drag' (1)\n• arrow pointing down labeled 'weight' (1)",
        topicTag: "Newton's Laws",
      },
      {
        id: "bii",
        text: "At one point, as it falls through the atmosphere, a parachute attached to the payload fairing section is opened. This causes the speed of the payload fairing section to decrease rapidly. Explain, in terms of forces, how the parachute reduces the speed of the payload fairing section.",
        marks: 2,
        answer: "",
        markingScheme:
          "• Air resistance increases (1)\n• Upward/unbalanced force is in the opposite direction to motion (1)",
        topicTag: "Newton's Laws",
      },
      {
        id: "biii",
        text: "The graph shows how the vertical velocity $v_v$ varies with time... The weight of the payload fairing section is 9300 N. State the magnitude of the total upward force acting on the payload fairing section at point P. You must justify your answer. [Diagram: $v-t$ graph showing velocity becoming constant at point P.]",
        marks: 2,
        answer: "9300 N",
        markingScheme:
          "• 9300 N (1)\n• (Constant velocity means) forces are balanced/unbalanced force is zero (1)",
        topicTag: "Newton's Laws",
      },
    ],
  },
  {
    type: "paper",
    topic: "Projectile Motion",
    subtopic: "Projectile Motion",
    question:
      "Ski jumping is a winter sport in which competitors aim to achieve the longest jump after sliding down a specially designed curved ramp. During the jump, ski jumpers adopt the position shown below. [Diagram: A ski jumper mid-air.]",
    parts: [
      {
        id: "a",
        text: "Using your knowledge of physics, comment on factors that affect the length of a jump made by a ski jumper.",
        marks: 3,
        answer: "",
        markingScheme:
          "The candidate will gain credit for the breadth and/or depth of their conceptual understanding (marked out of 3).",
        featureTag: "open-ended",
        topicTag: "Projectile Motion",
      },
    ],
  },
  {
    type: "paper",
    topic: "Space Exploration",
    subtopic: "Space Exploration",
    question:
      "In 2023, a spacecraft was launched from Earth to investigate the asteroid Psyche. Psyche is located in the asteroid belt, between Mars and Jupiter.",
    parts: [
      {
        id: "a",
        text: "On its journey to Psyche the spacecraft will pass close by the planet Mars. Explain how passing close to Mars will reduce the journey time to Psyche.",
        marks: 2,
        answer: "",
        markingScheme:
          "• (The spacecraft) gains energy/velocity from the planet (Mars) (1)\n• Due to the gravitational pull/field of the planet (1)",
        topicTag: "Space Exploration",
      },
      {
        id: "bi",
        text: "The ion drive engine produces a small unbalanced force on the spacecraft. Explain how this small unbalanced force can still result in a large increase in speed, even though the spacecraft has a large mass.",
        marks: 1,
        answer: "",
        markingScheme:
          "• The force acts for a (very) long time (1)",
        topicTag: "Acceleration",
      },
      {
        id: "bii",
        text: "Near the Earth the solar cells provide 20 kW of electrical power. As the spacecraft approaches Psyche, the solar cells will only produce 2.3 kW. Explain why the solar cells produce less power as the spacecraft approaches Psyche.",
        marks: 1,
        answer: "",
        markingScheme:
          "• (Psyche is) further from the Sun (so light intensity is less) (1)",
        topicTag: "Cosmology",
      },
      {
        id: "ci",
        text: "Initially, the spacecraft will complete 41 orbits of Psyche in 56 days. Determine the orbital period of the spacecraft.",
        marks: 1,
        answer: "1.37 days (or 32.8 hours)",
        markingScheme:
          "• $T = \\frac{56}{41} = 1.37$ days (1)",
        topicTag: "Space Exploration",
      },
      {
        id: "cii",
        text: "After 56 days the spacecraft will move to an orbit closer to Psyche. State the effect this change will have on the orbital period of the spacecraft.",
        marks: 1,
        answer: "Period decreases",
        markingScheme:
          "• (Orbital period) decreases (1)",
        topicTag: "Space Exploration",
      },
    ],
  },
  {
    type: "paper",
    topic: "Current, voltage and resistance",
    subtopic: "Current, voltage and resistance",
    question:
      "A Van de Graaff generator is a device that is used to generate an electric charge on a hollow metal dome.",
    parts: [
      {
        id: "a",
        text: "When the Van de Graaff generator is switched on, the metal dome becomes positively charged. The foil dishes are observed to 'fly away' from the metal dome as shown. [Diagram: Foil dishes lifting off a dome.] Explain why the foil dishes are repelled from the metal dome.",
        marks: 1,
        answer: "",
        markingScheme:
          "• (The dishes) have the same charge (as the dome) (1)",
        topicTag: "Current, voltage and resistance",
      },
      {
        id: "bi",
        text: "During the discharge, $2.50 \\times 10^{-6}\\text{ C}$ of charge is transferred to the dome in 0.80 ms. Calculate the average current during the discharge.",
        marks: 3,
        answer: "$3.1 \\times 10^{-3}\\text{ A}$",
        markingScheme:
          "• $Q = It$ (1)\n• $2.50 \\times 10^{-6} = I \\times 0.80 \\times 10^{-3}$ (1)\n• $I = 3.1 \\times 10^{-3}\\text{ A}$ (1)",
        topicTag: "Current, voltage and resistance",
      },
      {
        id: "bii",
        text: "The magnitude of the charge on an electron is $1.60 \\times 10^{-19}\\text{ C}$. Determine the number of electrons transferred during the discharge process.",
        marks: 1,
        answer: "$1.56 \\times 10^{13}$",
        markingScheme:
          "• $N = \\frac{2.50 \\times 10^{-6}}{1.60 \\times 10^{-19}} = 1.56 \\times 10^{13}$ (1)",
        topicTag: "Current, voltage and resistance",
      },
    ],
  },
  {
    type: "paper",
    topic: "Current, voltage and resistance",
    subtopic: "Current, voltage and resistance",
    question:
      "A student carries out an investigation to determine the resistance of a resistor R. [Diagram: A 6.0 V battery, resistor R, and a variable resistor in series.]",
    parts: [
      {
        id: "a",
        text: "Complete the circuit diagram to show how these components are connected to allow the student to measure the current in and voltage across resistor R.",
        marks: 2,
        answer: "",
        markingScheme:
          "• Ammeter in series with R (1)\n• Voltmeter in parallel across R (1)",
        topicTag: "Current, voltage and resistance",
      },
      {
        id: "b",
        text: "The student obtains a range of readings... [Table/Graph: $I-V$ graph showing a straight line through the origin.] Using the gradient of the graph, determine the resistance of resistor R.",
        marks: 2,
        answer: "$62.5\\text{ }\\Omega$",
        markingScheme:
          "• $m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{0.08}{5.0}$ (1)\n• $R = \\frac{1}{m} = 62.5\\text{ }\\Omega$ (1)",
        topicTag: "Current, voltage and resistance",
      },
      {
        id: "c",
        text: "The student now replaces resistor R with a filament lamp... [Diagram: $I-V$ graph showing a curve.] State a conclusion that can be made about the resistance of the filament lamp.",
        marks: 1,
        answer: "Resistance increases (as voltage/current increases)",
        markingScheme:
          "• (The resistance) increases (1)",
        topicTag: "Current, voltage and resistance",
      },
    ],
  },
  {
    type: "paper",
    topic: "Electrical Power",
    subtopic: "Electrical Power",
    question:
      "At night a path is illuminated by a set of four LED spotlights. Each spotlight consists of an LED and a resistor connected in series. [Diagram: Four series-pairs of LED+resistor connected in parallel to a 12 V supply.]",
    parts: [
      {
        id: "a",
        text: "Describe one advantage of connecting the spotlights as shown in the circuit diagram.",
        marks: 1,
        answer: "",
        markingScheme:
          "• If one goes out the others stay on / each gets the full supply voltage (1)",
        topicTag: "Current, voltage and resistance",
      },
      {
        id: "b",
        text: "Each spotlight has a power rating of 4.8 W. Determine the total current drawn from the power supply when all four spotlights are operating correctly.",
        marks: 3,
        answer: "1.6 A",
        markingScheme:
          "• $P = IV$ (1)\n• $4 \\times 4.8 = I \\times 12$ (1)\n• $I = 1.6\\text{ A}$ (1)",
        topicTag: "Electrical Power",
      },
      {
        id: "ci",
        text: "State the name of component X. [Diagram: A potential divider with an LDR as the bottom component.]",
        marks: 1,
        answer: "LDR (Light Dependent Resistor)",
        markingScheme:
          "• LDR (1)",
        topicTag: "Current, voltage and resistance",
      },
      {
        id: "cii",
        text: "Explain how the circuit operates to activate the relay when it gets dark.",
        marks: 3,
        answer: "",
        markingScheme:
          "• Resistance of LDR increases (1)\n• Voltage across LDR/X increases (1)\n• This switches on the transistor/relay (1)",
        topicTag: "Current, voltage and resistance",
      },
    ],
  },
  {
    type: "paper",
    topic: "Current, voltage and resistance",
    subtopic: "Current, voltage and resistance",
    question:
      "A student is describing how a battery and lamp circuit works. The student states: 'When I connect the battery to the lamp, electrons are fired out from the battery and whizz round the circuit. The electrons are changed into light by the lamp. If I add another lamp to the circuit the lamps will be dimmer.'",
    parts: [
      {
        id: "a",
        text: "Using your knowledge of physics, comment on the statement made by the student.",
        marks: 3,
        answer: "",
        markingScheme:
          "The candidate will gain credit for the breadth and/or depth of their conceptual understanding (marked out of 3).",
        featureTag: "open-ended",
        topicTag: "Current, voltage and resistance",
      },
    ],
  },
  {
    type: "paper",
    topic: "Specific Heat Capacity",
    subtopic: "Specific Heat Capacity",
    question:
      "An ice making machine is an appliance used for making ice cubes by cooling water to 0 °C and then freezing it.",
    parts: [
      {
        id: "ai",
        text: "The ice making machine is initially filled with 0.38 kg of water at a temperature of 22 °C. Calculate the amount of energy removed from the water to reduce the temperature of the water to 0 °C.",
        marks: 3,
        answer: "$3.5 \\times 10^4\\text{ J}$",
        markingScheme:
          "• $E_h = cm\\Delta T$ (1)\n• $E_h = 4180 \\times 0.38 \\times 22$ (1)\n• $E_h = 34945\\text{ J}$ (1)",
        topicTag: "Specific Heat Capacity",
      },
      {
        id: "aii",
        text: "The ice making machine has a power rating of 120 W. Calculate the minimum amount of time it takes to reduce the temperature of the water to 0 °C.",
        marks: 3,
        answer: "$290\\text{ s}$",
        markingScheme:
          "• $P = \\frac{E}{t}$ (1)\n• $120 = \\frac{34945}{t}$ (1)\n• $t = 291\\text{ s}$ (1)",
        dependsOn: ["ai"],
        topicTag: "Electrical Power",
      },
      {
        id: "aiii",
        text: "Suggest one way the manufacturer could improve the ice making machine to overcome heat gain from surroundings.",
        marks: 1,
        answer: "Add insulation",
        markingScheme:
          "• Insulate the machine/tank (1)",
        topicTag: "Specific Heat Capacity",
      },
      {
        id: "b",
        text: "Once the water is at 0 °C, a further 15.3 kJ of energy is removed from the water to form ice cubes. Calculate the maximum mass of ice cubes produced in this process.",
        marks: 3,
        answer: "$0.046\\text{ kg}$",
        markingScheme:
          "• $E_h = mL_f$ (1)\n• $15.3 \\times 10^3 = m \\times 3.34 \\times 10^5$ (1)\n• $m = 0.0458\\text{ kg}$ (1)",
        topicTag: "Specific Latent Heat",
      },
    ],
  },
  {
    type: "paper",
    topic: "Pressure, Kinetic Theory and Gas Laws",
    subtopic: "Pressure, Kinetic Theory and Gas Laws",
    question:
      "A student investigates how the volume of a fixed mass of air is related to its pressure, when temperature is kept constant. [Diagram: A syringe connected to a pressure meter.]",
    parts: [
      {
        id: "a",
        text: "Describe how the kinetic model accounts for the pressure of the air in the syringe.",
        marks: 1,
        answer: "",
        markingScheme:
          "• Particles collide with the walls (of the syringe/container) (1)",
        topicTag: "Pressure, Kinetic Theory and Gas Laws",
      },
      {
        id: "bi",
        text: "Using the graph paper, draw a graph of these results. [Table: $1/V$ vs Pressure data provided.]",
        marks: 3,
        answer: "",
        markingScheme:
          "• Correct axes and labels (1)\n• Points plotted correctly (1)\n• Line of best fit drawn (1)",
        topicTag: "Pressure, Kinetic Theory and Gas Laws",
      },
      {
        id: "bii",
        text: "Using information from your graph, state a conclusion that can be made about the relationship between the volume and its pressure.",
        marks: 1,
        answer: "Pressure is inversely proportional to volume ($P \\propto 1/V$)",
        markingScheme:
          "• Pressure is inversely proportional to volume (1)",
        topicTag: "Pressure, Kinetic Theory and Gas Laws",
      },
      {
        id: "biii",
        text: "Using your graph, determine the volume of trapped air in the syringe at a pressure of 148 kPa.",
        marks: 2,
        answer: "$4.3\\text{ ml}$",
        markingScheme:
          "• $1/V = 0.23$ (from graph) (1)\n• $V = 4.35\\text{ ml}$ (1)",
        topicTag: "Pressure, Kinetic Theory and Gas Laws",
      },
      {
        id: "c",
        text: "Suggest one way in which the experimental procedure could be improved to give more reliable results.",
        marks: 1,
        answer: "Repeat and average",
        markingScheme:
          "• Repeat the experiment and calculate an average (1)",
        topicTag: "Pressure, Kinetic Theory and Gas Laws",
      },
    ],
  },
  {
    type: "paper",
    topic: "Wave properties",
    subtopic: "Wave properties",
    question:
      "A wave generator produces 500 water waves in 30 minutes in a 160 m long pool.",
    parts: [
      {
        id: "a",
        text: "Water waves are transverse waves. State what is meant by the term transverse wave.",
        marks: 1,
        answer: "",
        markingScheme:
          "• Particles vibrate at right angles to the direction of energy travel (1)",
        topicTag: "Wave properties",
      },
      {
        id: "bi",
        text: "Show that the frequency of the waves is 0.28 Hz.",
        marks: 2,
        answer: "0.28 Hz",
        markingScheme:
          "• $f = \\frac{N}{t} = \\frac{500}{30 \\times 60}$ (1)\n• $f = 0.277\\text{ Hz}$ (1)",
        topicTag: "Wave properties",
      },
      {
        id: "bii",
        text: "Each wave takes 32 s to travel the length of the pool. Calculate the average speed of the waves.",
        marks: 3,
        answer: "5.0 m s\u207b\u00b9",
        markingScheme:
          "• $v = \\frac{d}{t}$ (1)\n• $v = \\frac{160}{32}$ (1)\n• $v = 5.0\\text{ m s}^{-1}$ (1)",
        topicTag: "Wave properties",
      },
      {
        id: "biii",
        text: "Calculate the average wavelength of the waves.",
        marks: 3,
        answer: "18 m",
        markingScheme:
          "• $v = f\\lambda$ (1)\n• $5.0 = 0.28 \\times \\lambda$ (1)\n• $\\lambda = 17.9\\text{ m}$ (1)",
        dependsOn: ["bi", "bii"],
        topicTag: "Wave properties",
      },
    ],
  },
  {
    type: "paper",
    topic: "EM Spectrum",
    subtopic: "EM Spectrum",
    question:
      "Golfers use either a GPS device (microwaves) or an infrared laser rangefinder. GPS satellites orbit at 20,200 km.",
    parts: [
      {
        id: "ai",
        text: "Show that the time taken for a microwave signal to travel from the satellite to the GPS device is 0.067 s.",
        marks: 2,
        answer: "0.067 s",
        markingScheme:
          "• $t = \\frac{d}{v} = \\frac{20200 \\times 10^3}{3 \\times 10^8}$ (1)\n• $t = 0.0673\\text{ s}$ (1)",
        topicTag: "EM Spectrum",
      },
      {
        id: "aii",
        text: "State whether the GPS satellites are geostationary satellites. You must justify your answer.",
        marks: 2,
        answer: "No",
        markingScheme:
          "• No (1)\n• Period is 12 hours (not 24) / altitude is not 36,000 km (1)",
        topicTag: "Space Exploration",
      },
      {
        id: "bi",
        text: "State a suitable detector for infrared radiation in the rangefinder.",
        marks: 1,
        answer: "Photodiode / Phototransistor / Thermistor",
        markingScheme:
          "• Photodiode (or other valid detector) (1)",
        topicTag: "EM Spectrum",
      },
      {
        id: "bii",
        text: "Calculate the frequency of the infrared radiation (904 nm) emitted by the rangefinder.",
        marks: 3,
        answer: "$3.32 \\times 10^{14}\\text{ Hz}$",
        markingScheme:
          "• $v = f\\lambda$ (1)\n• $3 \\times 10^8 = f \\times 904 \\times 10^{-9}$ (1)\n• $f = 3.32 \\times 10^{14}\\text{ Hz}$ (1)",
        topicTag: "EM Spectrum",
      },
      {
        id: "biii",
        text: "The time taken for the radiation to be emitted and received is $1.2 \\times 10^{-6}\\text{ s}$. Determine the distance of the target from the golfer.",
        marks: 4,
        answer: "180 m",
        markingScheme:
          "• $t = 0.6 \\times 10^{-6}\\text{ s}$ (one way) (1)\n• $d = vt$ (1)\n• $d = 3 \\times 10^8 \\times 0.6 \\times 10^{-6}$ (1)\n• $d = 180\\text{ m}$ (1)",
        topicTag: "Wave properties",
      },
    ],
  },
  {
    type: "paper",
    topic: "Refraction of light",
    subtopic: "Refraction of light",
    question:
      "A student investigates the path of red light through a circular glass block. [Diagram: Ray entering air-glass boundary at angle X and refracting to angle Y inside.]",
    parts: [
      {
        id: "a",
        text: "State the names given to angles X and Y.",
        marks: 1,
        answer: "X: angle of incidence; Y: angle of refraction",
        markingScheme:
          "• Both correct (1)",
        topicTag: "Refraction of light",
      },
      {
        id: "b",
        text: "Explain why the ray of red light changes direction as it enters the circular glass block.",
        marks: 2,
        answer: "",
        markingScheme:
          "• Speed of light decreases (1)\n• Change in speed causes change in direction (1)",
        topicTag: "Refraction of light",
      },
      {
        id: "c",
        text: "Complete the diagram below to show the path of the ray of red light after it exits the block (at the center of the flat edge).",
        marks: 1,
        answer: "",
        markingScheme:
          "• Ray exits along the normal/radius (no further refraction) (1)",
        topicTag: "Refraction of light",
      },
    ],
  },
  {
    type: "paper",
    topic: "Nuclear Radiation",
    subtopic: "Nuclear Radiation",
    question:
      "Leaks in underground wastewater pipes are investigated using a radioactive tracer. [Diagram: A pipe under several layers of earth and road, with a leak being detected from the surface.]",
    parts: [
      {
        id: "a",
        text: "Explain why a tracer that emits gamma radiation is used for this investigation, rather than one that only emits alpha or beta radiation.",
        marks: 1,
        answer: "",
        markingScheme:
          "• Gamma is the only one that can penetrate the ground/layers (1)",
        topicTag: "Nuclear Radiation",
      },
      {
        id: "bi",
        text: "State what is meant by the term half-life.",
        marks: 1,
        answer: "Time for the activity of a source to fall to half its original value.",
        markingScheme:
          "• Correct definition (1)",
        topicTag: "Nuclear Radiation",
      },
      {
        id: "bii",
        text: "From the list: sodium-24 (15h), bismuth-204 (11.2h), barium-133 (10.5y), barium-137m (2.6m). State which source should be used and justify your answer.",
        marks: 2,
        answer: "sodium-24",
        markingScheme:
          "• sodium-24 (1)\n• gamma emitter AND suitable half-life (not too short/long) (1)",
        topicTag: "Nuclear Radiation",
      },
      {
        id: "ci",
        text: "Determine the half-life of this source. [Diagram: Activity vs Time graph starting at 800 kBq.]",
        marks: 1,
        answer: "150 s",
        markingScheme:
          "• 150 s (1)",
        topicTag: "Nuclear Radiation",
      },
      {
        id: "cii",
        text: "Predict the activity of the source at 700 s.",
        marks: 1,
        answer: "50 kBq",
        markingScheme:
          "• 50 kBq (1)",
        dependsOn: ["ci"],
        topicTag: "Nuclear Radiation",
      },
    ],
  },
  {
    type: "paper",
    topic: "Nuclear Radiation",
    subtopic: "Nuclear Radiation",
    question:
      "A full-body airport scanner uses X-rays. A 64 kg passenger receives an equivalent dose of 0.25 \u00b5Sv.",
    parts: [
      {
        id: "ai",
        text: "Calculate the absorbed dose received by the passenger.",
        marks: 3,
        answer: "$0.25\\text{ }\\mu\\text{Gy}$",
        markingScheme:
          "• $H = D w_r$ (1)\n• $0.25 \\times 10^{-6} = D \\times 1$ (1)\n• $D = 0.25 \\times 10^{-6}\\text{ Gy}$ (1)",
        topicTag: "Nuclear Radiation",
      },
      {
        id: "aii",
        text: "Calculate the energy absorbed by the passenger.",
        marks: 3,
        answer: "$1.6 \\times 10^{-5}\\text{ J}$",
        markingScheme:
          "• $D = \\frac{E}{m}$ (1)\n• $0.25 \\times 10^{-6} = \\frac{E}{64}$ (1)\n• $E = 1.6 \\times 10^{-5}\\text{ J}$ (1)",
        dependsOn: ["ai"],
        topicTag: "Nuclear Radiation",
      },
      {
        id: "b",
        text: "State what is meant by the term ionisation.",
        marks: 1,
        answer: "Loss or gain of electrons from an atom.",
        markingScheme:
          "• Loss or gain of electrons (1)",
        topicTag: "Nuclear Radiation",
      },
      {
        id: "c",
        text: "Suggest one safety precaution the staff operating the scanner could take to minimise exposure.",
        marks: 1,
        answer: "Stand behind a screen / increase distance",
        markingScheme:
          "• Lead screen / distance / time (1)",
        topicTag: "Nuclear Radiation",
      },
    ],
  },
]
