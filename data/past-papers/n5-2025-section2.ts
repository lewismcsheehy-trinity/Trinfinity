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
    topic: "Dynamics",
    subtopic: "Vectors and Scalars",
    question:
      "A gardener is mowing grass with a lawnmower. The gardener walks from point X to point Y as shown, while pushing the lawnmower. [Diagram: A path from X to Y. From X, the gardener moves 32 m East, then 15 m North, then 4 m West to reach Y. The diagram is not to scale.]",
    parts: [
      {
        id: "ai",
        text: "By scale diagram or otherwise, determine the magnitude of the resultant displacement of the gardener from point X to point Y.",
        marks: 2,
        answer: "32 m",
        markingScheme:
          "• Resultant horizontal displacement = 28 (m) (1)\n• Resultant displacement = √ (28² + 15²) = 31.76... (m) (1)\n\nOR\n\n• (Consistent) scale diagram (1)\n• Resultant displacement 32 m (± 1 m) (1)",
      },
      {
        id: "aii",
        text: "By scale diagram or otherwise, determine the direction of the resultant displacement of the gardener from point X to point Y.",
        marks: 2,
        answer: "(0)28",
        markingScheme:
          "• tan θ = 15/28 (1)\n• (0)28 (1)\n\nOR\n\n• (Consistent) scale diagram (1)\n• (0)28 (± 2°) (1)",
      },
      {
        id: "b",
        text: "The gardener takes 55 s to walk from point X to point Y. Determine the average velocity of the gardener from point X to point Y.",
        marks: 3,
        answer: "0.58 m s⁻¹ (0)28",
        markingScheme:
          "• v = s / t (1)\n• v = 32 / 55 (1)\n• v = 0.58 m s⁻¹ (0)28 (1)\n\nDirection must be consistent with (a)(ii).",
        dependsOn: ["ai", "aii"],
      },
      {
        id: "c",
        text: "The gardener pushes the lawnmower with an average force of 68 N while walking between point X and point Y. Calculate the work done in moving the lawnmower between point X and point Y.",
        marks: 3,
        answer: "3.5 × 10³ J",
        markingScheme:
          "• Ew = Fd (1)\n• Ew = 68 × (32 + 15 + 4) = 68 × 51 (1)\n• Ew = 3.5 × 10³ J (3468 J) (1)",
      },
    ],
  },
  {
    type: "paper",
    topic: "Dynamics",
    subtopic: "Newton's Laws",
    question:
      "The Falcon Heavy rocket is used to carry a satellite from Earth into space. [Image: Falcon Heavy rocket at launch.]",
    parts: [
      {
        id: "ai",
        text: "The total mass of the rocket and satellite at launch is 1.43 × 10⁶ kg. Calculate the weight of the rocket and satellite at launch.",
        marks: 3,
        answer: "1.40 × 10⁷ N",
        markingScheme:
          "• W = mg (1)\n• W = 1.43 × 10⁶ × 9.8 (1)\n• W = 1.40 × 10⁷ N (1)",
      },
      {
        id: "aii",
        text: "At launch, the initial upward thrust acting on the rocket is 2.28 × 10⁷ N. Determine the initial acceleration of the rocket and satellite.",
        marks: 4,
        answer: "6.2 m s⁻²",
        markingScheme:
          "• Fun = 2.28 × 10⁷ − 1.4014 × 10⁷ = 8.786 × 10⁶ (N) (1)\n• Fun = ma (1)\n• 8.786 × 10⁶ = 1.43 × 10⁶ × a (1)\n• a = 6.14... m s⁻² (1)\n\nConsistency with (a)(i).",
        dependsOn: ["ai"],
        featureTag: "a-level",
      },
      {
        id: "bi",
        text: "The rocket is designed so that many parts are reusable. Two reusable parts are the payload fairing sections, which protect the satellite during launch. Once the rocket reaches space, the payload fairing sections are detached and re-enter the Earth's atmosphere. [Diagram: Payload fairing sections and satellite.] On the diagram below, show all the forces acting on one of the payload fairing sections as it falls vertically through the Earth's atmosphere. You must name these forces and show their directions.",
        marks: 2,
        answer: "",
        markingScheme:
          "• Upward arrow labelled 'Air resistance' / 'Drag' / 'Friction' (1)\n• Downward arrow labelled 'Weight' (1)",
      },
      {
        id: "bii",
        text: "At one point, as it falls through the atmosphere, a parachute attached to the payload fairing section is opened. This causes the speed of the payload fairing section to decrease rapidly. Explain, in terms of forces, how the parachute reduces the speed of the payload fairing section.",
        marks: 2,
        answer: "",
        markingScheme:
          "• (Air resistance increases so) there is an upward unbalanced force. (1)\n• (The upward unbalanced force is in the opposite direction to motion so) the fairing decelerates/slows down. (1)",
      },
      {
        id: "biii",
        text: "The graph shows how the vertical velocity vv of one of the payload fairing sections varies with time from the moment the parachute is opened. [Graph: Velocity vs Time. Velocity decreases from an initial value and then levels off to a constant value at point P.] The weight of the payload fairing section is 9300 N. State the magnitude of the total upward force acting on the payload fairing section at point P. You must justify your answer.",
        marks: 2,
        answer: "9300 N",
        markingScheme:
          "• 9300 N (1)\n• At P it is travelling at constant velocity/terminal velocity/forces are balanced. (1)",
      },
    ],
  },
  {
    type: "paper",
    topic: "Dynamics",
    subtopic: "Newton's Laws",
    question:
      "Ski jumping is a winter sport in which competitors aim to achieve the longest jump after sliding down a specially designed curved ramp. During the jump, ski jumpers adopt the position shown below. [Image: Ski jumper in mid-air.] The length of the jump is measured from the end of the ramp to where the ski jumper lands.",
    parts: [
      {
        id: "a",
        text: "Using your knowledge of physics, comment on factors that affect the length of a jump made by a ski jumper.",
        marks: 3,
        answer: "",
        markingScheme:
          "The candidate's response will be marked out of 3. Marks are awarded for the breadth and/or depth of understanding shown.\n• 0 marks: No relevant physics/understanding.\n• 1 mark: Limited understanding (e.g., mention of air resistance).\n• 2 marks: Reasonable understanding (e.g., mention of forces and effect on acceleration).\n• 3 marks: Good understanding (e.g., detailed discussion of projectile motion, lift, and drag).",
        featureTag: "open-ended",
      },
    ],
  },
  {
    type: "paper",
    topic: "Space",
    subtopic: "Space Exploration",
    question:
      "In 2023, a spacecraft was launched from Earth to investigate the asteroid Psyche. Psyche is located in the asteroid belt, between Mars and Jupiter. The spacecraft will reach Psyche in 2029.",
    parts: [
      {
        id: "a",
        text: "On its journey to Psyche the spacecraft will pass close by the planet Mars. Explain how passing close to Mars will reduce the journey time to Psyche.",
        marks: 2,
        answer: "",
        markingScheme:
          "• The gravitational pull of Mars (1)\n• accelerates the spacecraft/increases its speed. (1)",
      },
      {
        id: "bi",
        text: "On its journey, the spacecraft uses an ion drive engine to provide thrust. The ion drive engine produces a small unbalanced force on the spacecraft. Explain how this small unbalanced force can still result in a large increase in speed, even though the spacecraft has a large mass.",
        marks: 1,
        answer: "",
        markingScheme:
          "• The engine is on for a long time. (1)",
      },
      {
        id: "bii",
        text: "The ion drive engine is powered by solar cells. Near the Earth the solar cells provide 20 kW of electrical power. As the spacecraft approaches Psyche, the solar cells will only produce 2.3 kW of electrical power. Explain why the solar cells produce less power as the spacecraft approaches Psyche.",
        marks: 1,
        answer: "",
        markingScheme:
          "• (It is further from the Sun so) light intensity is less. (1)",
      },
      {
        id: "ci",
        text: "When the spacecraft reaches its destination, it will go into orbit around Psyche. Initially, the spacecraft will complete 41 orbits of Psyche in 56 days. Determine the orbital period of the spacecraft.",
        marks: 1,
        answer: "1.4 days",
        markingScheme:
          "• T = 56 / 41 = 1.36... days (1)",
      },
      {
        id: "cii",
        text: "After 56 days the spacecraft will move to an orbit closer to Psyche. State the effect this change will have on the orbital period of the spacecraft.",
        marks: 1,
        answer: "Period decreases",
        markingScheme:
          "• (Orbital period) decreases (1)",
      },
    ],
  },
  {
    type: "paper",
    topic: "Electricity",
    subtopic: "Current, voltage and resistance",
    question:
      "A Van de Graaff generator is a device that is used to generate an electric charge on a hollow metal dome.",
    parts: [
      {
        id: "a",
        text: "During a classroom demonstration a teacher places some small aluminium foil dishes on top of the dome. When the Van de Graaff generator is switched on, the metal dome becomes positively charged. The foil dishes are observed to ‘fly away’ from the metal dome as shown. [Diagram: Metal dome with foil dishes flying off.] Explain why the foil dishes are repelled from the metal dome.",
        marks: 1,
        answer: "",
        markingScheme:
          "• (Dishes and dome have the) same (type of) charge. (1)",
      },
      {
        id: "bi",
        text: "The teacher then discharges the dome by placing a small metal sphere near the dome, as shown. [Diagram: Sphere near dome causing a spark.] During the discharge, 2.50 × 10⁻⁶ C of charge is transferred to the dome in 0.80 ms. Calculate the average current during the discharge.",
        marks: 3,
        answer: "3.1 × 10⁻³ A",
        markingScheme:
          "• Q = It (1)\n• 2.50 × 10⁻⁶ = I × 0.80 × 10⁻³ (1)\n• I = 3.125 × 10⁻³ A (1)",
      },
      {
        id: "bii",
        text: "The magnitude of the charge on an electron is 1.60 × 10⁻¹⁹ C. Determine the number of electrons transferred during the discharge process.",
        marks: 1,
        answer: "1.56 × 10¹³",
        markingScheme:
          "• 2.50 × 10⁻⁶ / 1.60 × 10⁻¹⁹ = 1.5625 × 10¹³ (1)",
      },
    ],
  },
  {
    type: "paper",
    topic: "Electricity",
    subtopic: "Current, voltage and resistance",
    question:
      "A student carries out an investigation to determine the resistance of a resistor R. The student is provided with the following components: resistor R, 6.0 V battery, variable resistor, ammeter, voltmeter, connecting leads.",
    parts: [
      {
        id: "a",
        text: "Complete the circuit diagram to show how these components are connected to allow the student to measure the current in and voltage across resistor R, for a range of different voltages across resistor R. [Partial diagram provided with Battery, R, and Variable Resistor in series.]",
        marks: 2,
        answer: "",
        markingScheme:
          "• Ammeter in series with R (1)\n• Voltmeter in parallel with R (1)",
      },
      {
        id: "b",
        text: "The student obtains a range of readings for the current in and the voltage across resistor R. The student uses these readings to draw the following graph. [Graph: Current in R (A) vs Voltage across R (V). Linear passing through origin. At V=5.0, I=0.08.] Using the gradient of the graph, determine the resistance of resistor R.",
        marks: 2,
        answer: "63 Ω",
        markingScheme:
          "• m = (0.08 − 0) / (5.0 − 0) = 0.016 (1)\n• R = 1 / m = 1 / 0.016 = 62.5 Ω (1)\n\nOR\n\n• R = V / I (1)\n• R = 5.0 / 0.08 = 62.5 Ω (1)",
      },
      {
        id: "c",
        text: "The student now replaces resistor R with a filament lamp and repeats the investigation. A sketch graph of the student’s results is shown. [Graph: Current vs Voltage curve, gradient decreasing.] State a conclusion that can be made about the resistance of the filament lamp.",
        marks: 1,
        answer: "Resistance increases",
        markingScheme:
          "• Resistance (of lamp) increases (as the voltage increases). (1)",
      },
    ],
  },
  {
    type: "paper",
    topic: "Electricity",
    subtopic: "Electrical Power",
    question:
      "At night a path is illuminated by a set of four LED spotlights. Each spotlight consists of an LED and a resistor connected in series. The circuit diagram shows how the four spotlights are connected. [Diagram: Four branches in parallel connected to 12V supply. Each branch has one spotlight.]",
    parts: [
      {
        id: "a",
        text: "Describe one advantage of connecting the spotlights as shown in the circuit diagram.",
        marks: 1,
        answer: "",
        markingScheme:
          "• If one goes out the others stay on.\nOR\n• They all get (the full) 12 V. (1)",
      },
      {
        id: "b",
        text: "Each spotlight has a power rating of 4.8 W. Determine the total current drawn from the power supply when all four spotlights are operating correctly.",
        marks: 3,
        answer: "1.6 A",
        markingScheme:
          "• P = IV (1)\n• 4 × 4.8 = I × 12 (1)\n• I = 1.6 A (1)",
      },
      {
        id: "ci",
        text: "The spotlight circuit is connected to the circuit shown below, so that the spotlights switch on automatically when it gets dark. [Diagram: Voltage divider with LDR and Variable Resistor. Relay connected across Variable Resistor.] State the name of component X.",
        marks: 1,
        answer: "LDR",
        markingScheme:
          "• LDR (light dependent resistor) (1)",
      },
      {
        id: "cii",
        text: "Explain how the circuit operates to activate the relay when it gets dark.",
        marks: 3,
        answer: "",
        markingScheme:
          "• As light (level) decreases, resistance of X increases. (1)\n• Voltage across X/V_out increases. (1)\n• Relay (activates). (1)",
      },
    ],
  },
  {
    type: "paper",
    topic: "Electricity",
    subtopic: "Current, voltage and resistance",
    question:
      "A student is describing how the following circuit works. [Diagram: Simple circuit with battery and lamp.] The student states: ‘When I connect the battery to the lamp, electrons are fired out from the battery and whizz round the circuit. The electrons are changed into light by the lamp. If I add another lamp to the circuit the lamps will be dimmer.’",
    parts: [
      {
        id: "a",
        text: "Using your knowledge of physics, comment on the statement made by the student.",
        marks: 3,
        answer: "",
        markingScheme:
          "The candidate's response will be marked out of 3. Marks are awarded for the breadth and/or depth of understanding shown.\n• Correctly identifies that electrons are already in the wires.\n• Correctly identifies that electrical energy is converted to light (not the electrons).\n• Correctly identifies that adding another lamp increases resistance and decreases current.",
        featureTag: "open-ended",
      },
    ],
  },
  {
    type: "paper",
    topic: "Properties of Matter",
    subtopic: "Specific Heat Capacity",
    question:
      "An ice making machine is an appliance used for making ice cubes. The ice making machine operates by first cooling water to 0 °C. The water is then frozen to form ice cubes. Once formed, the ice cubes are released into a collecting tray.",
    parts: [
      {
        id: "ai",
        text: "The ice making machine is initially filled with 0.38 kg of water at a temperature of 22 °C. Calculate the amount of energy removed from the water to reduce the temperature of the water to 0 °C.",
        marks: 3,
        answer: "3.5 × 10⁴ J",
        markingScheme:
          "• Eh = cmΔT (1)\n• Eh = 4180 × 0.38 × 22 (1)\n• Eh = 34944.8 J (3.5 × 10⁴ J) (1)",
      },
      {
        id: "aii",
        text: "The ice making machine has a power rating of 120 W. Calculate the minimum amount of time it takes to reduce the temperature of the water to 0 °C.",
        marks: 3,
        answer: "291 s",
        markingScheme:
          "• P = E / t (1)\n• 120 = 34944.8 / t (1)\n• t = 291 s (1)\n\nConsistency with (a)(i).",
        dependsOn: ["ai"],
      },
      {
        id: "aiii",
        text: "In practice, the time taken to reduce the temperature of the water to 0 °C is much greater than calculated in (a)(ii), due to heat gained from the surroundings. Suggest one way the manufacturer could improve the ice making machine to overcome this problem.",
        marks: 1,
        answer: "",
        markingScheme:
          "• Insulate (the machine). (1)",
      },
      {
        id: "b",
        text: "Once the water is at 0 °C, a further 15.3 kJ of energy is removed from the water to form ice cubes. Calculate the maximum mass of ice cubes produced in this process.",
        marks: 3,
        answer: "0.046 kg",
        markingScheme:
          "• Eh = mL (1)\n• 15.3 × 10³ = m × 3.34 × 10⁵ (1)\n• m = 0.0458... kg (1)",
      },
    ],
  },
  {
    type: "paper",
    topic: "Properties of Matter",
    subtopic: "Pressure, Kinetic Theory and Gas Laws",
    question:
      "A student sets up the apparatus shown to investigate how the volume of a fixed mass of air is related to its pressure, when temperature is kept constant. [Diagram: Syringe connected to a pressure meter.] The student varies the volume of the air in the syringe and measures the pressure of the air in the syringe with the pressure meter.",
    parts: [
      {
        id: "a",
        text: "Describe how the kinetic model accounts for the pressure of the air in the syringe.",
        marks: 1,
        answer: "",
        markingScheme:
          "• Particles collide with the walls (of the syringe/container). (1)",
      },
      {
        id: "bi",
        text: "For each volume of air in the syringe the student calculates the value of 1/volume. The results of the experiment are shown in the table. [Table: 1/volume (ml⁻¹) | Pressure (kPa): 0.05 | 32, 0.10 | 67, 0.13 | 81, 0.17 | 112, 0.25 | 160] Using the graph paper, draw a graph of these results.",
        marks: 3,
        answer: "",
        markingScheme:
          "• Correct axes labels and units (1)\n• Correct scales (1)\n• Points plotted correctly and line of best fit drawn (1)",
      },
      {
        id: "bii",
        text: "Using information from your graph, state a conclusion that can be made about the relationship between the volume of a fixed mass of air at constant temperature and its pressure.",
        marks: 1,
        answer: "Pressure is inversely proportional to volume",
        markingScheme:
          "• Pressure is inversely proportional to volume. (1)\n\n(Accept: P ∝ 1/V)",
      },
      {
        id: "biii",
        text: "Using your graph, determine the volume of trapped air in the syringe at a pressure of 148 kPa.",
        marks: 2,
        answer: "4.3 ml",
        markingScheme:
          "• 1/V = 0.23 (ml⁻¹) (1)\n• V = 1 / 0.23 = 4.3 ml (1)\n\nConsistency with graph.",
      },
      {
        id: "c",
        text: "Suggest one way in which the experimental procedure could be improved to give more reliable results.",
        marks: 1,
        answer: "Repeat the experiment",
        markingScheme:
          "• Repeat the experiment and calculate an average. (1)",
      },
    ],
  },
  {
    type: "paper",
    topic: "Waves",
    subtopic: "Wave properties",
    question:
      "Scotland’s first wave park for watersports opened in Edinburgh in 2024. A wave generator produces water waves that travel along the length of a pool. The wave generator produces 500 waves in 30 minutes and the length of the pool is 160 m.",
    parts: [
      {
        id: "a",
        text: "Water waves are transverse waves. State what is meant by the term transverse wave.",
        marks: 1,
        answer: "",
        markingScheme:
          "• (Vibration of particles is) at right angles to (the direction of) energy travel/wave travel. (1)",
      },
      {
        id: "bi",
        text: "Show that the frequency of the waves is 0.28 Hz.",
        marks: 2,
        answer: "0.28 Hz",
        markingScheme:
          "• f = N / t (1)\n• f = 500 / (30 × 60) = 0.277... Hz (1)",
      },
      {
        id: "bii",
        text: "Each wave takes 32 s to travel the length of the pool. Calculate the average speed of the waves.",
        marks: 3,
        answer: "5.0 m s⁻¹",
        markingScheme:
          "• v = d / t (1)\n• v = 160 / 32 (1)\n• v = 5.0 m s⁻¹ (1)",
      },
      {
        id: "biii",
        text: "Calculate the average wavelength of the waves.",
        marks: 3,
        answer: "18 m",
        markingScheme:
          "• v = fλ (1)\n• 5.0 = 0.28 × λ (1)\n• λ = 17.8... m (1)\n\nConsistency with (b)(i) and (b)(ii).",
        dependsOn: ["bi", "bii"],
      },
    ],
  },
  {
    type: "paper",
    topic: "Waves",
    subtopic: "EM Spectrum",
    question:
      "Many golfers now use either a GPS device or an infrared laser rangefinder to measure the distance required for their next shot.",
    parts: [
      {
        id: "ai",
        text: "The GPS device receives microwave signals from satellites orbiting the Earth. The satellites orbit at an altitude of 20 200 km and with a period of 12 hours. At one point in time a satellite is directly overhead. Show that the time taken for a microwave signal to travel from the satellite to the GPS device is 0.067 s.",
        marks: 2,
        answer: "0.067 s",
        markingScheme:
          "• d = vt (1)\n• 20 200 × 10³ = 3.0 × 10⁸ × t (1)\n• t = 0.0673... s",
      },
      {
        id: "aii",
        text: "State whether the GPS satellites are geostationary satellites. You must justify your answer.",
        marks: 2,
        answer: "No",
        markingScheme:
          "• No (1)\n• Period is 12 hours (must be 24 hours) / altitude is 20 200 km (must be 36 000 km). (1)",
      },
      {
        id: "bi",
        text: "The laser rangefinder emits a beam of infrared radiation with a wavelength of 904 nm. The beam of infrared radiation is directed towards a distant object. The beam reflects from the object and is detected in the rangefinder. State a suitable detector for infrared radiation in the rangefinder.",
        marks: 1,
        answer: "Photodiode",
        markingScheme:
          "• Phototransistor / Photodiode / Thermistor / Thermocouple (1)",
      },
      {
        id: "bii",
        text: "Calculate the frequency of the infrared radiation emitted by the rangefinder.",
        marks: 3,
        answer: "3.32 × 10¹⁴ Hz",
        markingScheme:
          "• v = fλ (1)\n• 3.0 × 10⁸ = f × 904 × 10⁻⁹ (1)\n• f = 3.318... × 10¹⁴ Hz (1)",
      },
      {
        id: "biii",
        text: "A golfer aims the beam of infrared radiation towards a target. The time taken between the infrared radiation being emitted and received by the rangefinder is 1.2 × 10⁻⁶ s. Determine the distance of the target from the golfer.",
        marks: 4,
        answer: "180 m",
        markingScheme:
          "• d = vt (1)\n• d = 3.0 × 10⁸ × 1.2 × 10⁻⁶ = 360 (m) (1)\n• target distance = 360 / 2 (1)\n• target distance = 180 m (1)",
      },
    ],
  },
  {
    type: "paper",
    topic: "Waves",
    subtopic: "Refraction of light",
    question:
      "A student carries out an experiment to investigate the path of red light through a circular glass block. [Diagram: Ray entering a glass block at an angle. Normal line shown. Angle in air is X, angle in glass is Y.]",
    parts: [
      {
        id: "a",
        text: "State the names given to angles X and Y.",
        marks: 1,
        answer: "X: angle of incidence, Y: angle of refraction",
        markingScheme:
          "• X: angle of incidence, Y: angle of refraction (1)",
      },
      {
        id: "b",
        text: "Explain why the ray of red light changes direction as it enters the circular glass block.",
        marks: 2,
        answer: "",
        markingScheme:
          "• Speed of light changes/decreases (1)\n• Different (optical) density (1)",
      },
      {
        id: "c",
        text: "Complete the diagram below to show the path of the ray of red light after it exits the block. [Diagram provided for completion.]",
        marks: 1,
        answer: "",
        markingScheme:
          "• Ray exits along the normal without bending. (1)",
      },
    ],
  },
  {
    type: "paper",
    topic: "Radiation",
    subtopic: "Nuclear Radiation",
    question:
      "Leaks in underground wastewater pipes can be investigated using a radioactive material known as a tracer. A small quantity of the tracer is added to the water entering the pipe being investigated and the radiation emitted is monitored over a period of a few hours. [Diagram: Underground pipe with a leak. Detector above ground detects radiation coming through various layers.]",
    parts: [
      {
        id: "a",
        text: "Explain why a tracer that emits gamma radiation is used for this investigation, rather than one that only emits alpha or beta radiation.",
        marks: 1,
        answer: "",
        markingScheme:
          "• (Only) gamma is able to penetrate the ground to reach the detector. (1)",
      },
      {
        id: "bi",
        text: "State what is meant by the term half-life.",
        marks: 1,
        answer: "",
        markingScheme:
          "• Time for activity to decrease by half. (1)",
      },
      {
        id: "bii",
        text: "[Table: Isotope | Radiation | Half-life: bismuth-204 | beta | 11 hours, sodium-24 | gamma | 15 hours, barium-133 | gamma | 11 years, barium-137m | gamma | 2.6 minutes] Select the most suitable isotope from the table to be used as a tracer for this investigation. You must justify your answer.",
        marks: 2,
        answer: "sodium-24",
        markingScheme:
          "• sodium-24 (1)\n• It is a gamma emitter and has a suitable half-life (not too short/long). (1)",
      },
      {
        id: "ci",
        text: "The graph shows how the activity of the tracer varies with time. [Graph: Activity vs Time. At t=0, A=200 kBq. At t=300, A=50 kBq.] Determine the half-life of the tracer.",
        marks: 1,
        answer: "150 s",
        markingScheme:
          "• 150 s (± 10 s) (1)",
      },
      {
        id: "cii",
        text: "Determine the activity of the tracer after 300 s.",
        marks: 1,
        answer: "50 kBq",
        markingScheme:
          "• 50 kBq (1)",
      },
    ],
  },
  {
    type: "paper",
    topic: "Radiation",
    subtopic: "Nuclear Radiation",
    question:
      "Security scanners at some airports use X-rays to detect hidden objects inside luggage.",
    parts: [
      {
        id: "a",
        text: "X-rays are a form of ionising radiation. State what is meant by the term ionisation.",
        marks: 1,
        answer: "Loss or gain of electrons",
        markingScheme:
          "• (Loss or gain of) electrons from an atom. (1)",
      },
      {
        id: "b",
        text: "The scanner is operated by a member of airport staff. Suggest one safety precaution the member of staff operating the scanner could take to minimise their exposure to the X-rays.",
        marks: 1,
        answer: "Stand behind a lead screen",
        markingScheme:
          "• Increase distance / decrease time / use shielding (lead screen). (1)",
      },
    ],
  },
]