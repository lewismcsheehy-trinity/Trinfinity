// N5 Physics Assignment data — Understanding Standards 2023-24
// Papers: https://www.understandingstandards.org.uk/Subjects/Physics/national5/Assignment

export interface AssignmentSection {
  id: string
  title: string
  maxMarks: number
  criterion: string
  guidance: string
  tips: string
}

export interface CandidatePaper {
  id: number
  topic: string
  pdfUrl: string
  sectionMarks: Record<string, number>
  sectionCommentary: Record<string, string>
}

export interface PracticeQuestion {
  id: string
  question: string
  type: "mc" | "text"
  options?: string[]
  answer: number | string
  explanation: string
  sectionRef: string
}

export interface ImproveExample {
  id: string
  topic: string
  section: string
  sectionRef: string
  context: string
  flawedExample: string
  question: string
  options: string[]
  correctOption: number
  explanation: string
}

// ── Marking Sections ─────────────────────────────────────────────────────────
// Total: 20 marks

export const ASSIGNMENT_SECTIONS: AssignmentSection[] = [
  {
    id: "aim",
    title: "Aim",
    maxMarks: 1,
    criterion:
      "Clearly states the variable being changed AND the variable being measured, with a clear link to the investigation.",
    guidance:
      "A good aim identifies the independent variable (what changes) and the dependent variable (what's measured). E.g. 'To investigate how temperature affects the pressure of a fixed volume of gas.'",
    tips: "Avoid vague aims like 'To investigate pressure'. Name both variables explicitly.",
  },
  {
    id: "background",
    title: "Background Physics",
    maxMarks: 4,
    criterion:
      "(1) Relevant physics theory explained in own words. (1) Relevant formula(e) stated correctly. (1) Formula linked to the experiment. (1) Explanation of why the variables are related using physics.",
    guidance:
      "Four marks are available. Cover: what the relevant law/formula is, what each symbol means, what the formula predicts, and how that applies to your experiment.",
    tips:
      "Don't just quote a formula. Explain the physics behind it and link it explicitly to your experimental setup.",
  },
  {
    id: "hypothesis",
    title: "Hypothesis",
    maxMarks: 1,
    criterion:
      "A clear prediction of the expected result AND a physics justification (references the relevant theory/formula).",
    guidance:
      "Say what you expect to happen and WHY using the physics. E.g. 'I predict pressure will increase proportionally with temperature because Gay-Lussac's Law states P/T = constant for a fixed volume.'",
    tips: "Without a physics reason, you cannot score this mark — a prediction alone is not enough.",
  },
  {
    id: "apparatus",
    title: "Apparatus / Diagram",
    maxMarks: 1,
    criterion: "A labelled diagram showing all key components of the experimental setup.",
    guidance:
      "Draw and label every piece of equipment used. The diagram should be clear enough that someone else could replicate your setup.",
    tips:
      "Unlabelled diagrams or diagrams missing key components will not score the mark.",
  },
  {
    id: "procedure",
    title: "Procedure / Method",
    maxMarks: 1,
    criterion:
      "A clear description of the method that states what is varied, what is measured, and how variables are controlled.",
    guidance:
      "Describe step-by-step how you conducted the experiment. State which variable is changed, which is measured, and which are kept constant.",
    tips:
      "Without mentioning control of variables (what's kept constant), you may not gain this mark.",
  },
  {
    id: "results",
    title: "Results / Data Collection",
    maxMarks: 3,
    criterion:
      "(1) Table with appropriate headings including quantities and units. (1) Sufficient data collected (minimum 5 different values). (1) Repeat readings taken and recorded.",
    guidance:
      "Three marks are available. Ensure your table has both the quantity name and unit in each heading, you have at least 5 data points, and you have taken repeat readings to reduce random error.",
    tips:
      "Headings like 'Temperature' without '(°C)' will lose the units mark. Fewer than 5 readings risks losing the sufficient data mark.",
  },
  {
    id: "graph",
    title: "Graph / Presentation of Data",
    maxMarks: 3,
    criterion:
      "(1) Both axes correctly labelled with quantity and unit. (1) Appropriate scale used and all points correctly plotted. (1) Best-fit straight line or smooth curve drawn.",
    guidance:
      "Three marks for the graph. Label both axes with the quantity and unit, use a scale that spreads data across at least half the graph paper, plot all points accurately, and draw a best-fit line (not dot-to-dot).",
    tips:
      "A dot-to-dot line is NOT a best-fit line. The scale must not begin at a non-zero value unless justified.",
  },
  {
    id: "conclusion",
    title: "Conclusion",
    maxMarks: 1,
    criterion:
      "A clear statement of the relationship found, linked back to the aim. Must mention whether results support the hypothesis.",
    guidance:
      "State what the graph/data shows about the relationship between the two variables (e.g. directly proportional, inversely proportional). Link back to your aim and say whether your hypothesis was supported.",
    tips:
      "Vague conclusions like 'As one increased, the other increased' without specifying which variables or mentioning proportionality will not score the mark.",
  },
  {
    id: "evaluation",
    title: "Evaluation",
    maxMarks: 3,
    criterion:
      "(1) A specific source of uncertainty or limitation identified. (1) The effect of this uncertainty on the results described. (1) A realistic improvement to address the uncertainty suggested.",
    guidance:
      "Three marks for evaluation. Identify one real source of error in YOUR experiment (not a general error), say how it affects your results (e.g. overestimates the pressure), and suggest a practical improvement.",
    tips:
      "Human error alone is not enough — identify a specific measurement issue. 'Use better equipment' is too vague for the improvement mark.",
  },
  {
    id: "bibliography",
    title: "Bibliography",
    maxMarks: 2,
    criterion:
      "(1) At least one relevant source cited in an appropriate format. (1) A second relevant source cited; sources are clearly relevant to the physics investigated.",
    guidance:
      "Two marks for bibliography. Cite at least two sources that are actually relevant to the physics of your experiment. Include enough detail that someone could find the source (author, title, URL, date accessed).",
    tips:
      "Wikipedia alone is generally not sufficient. Sources must be relevant to the specific physics topic, not just 'physics' in general.",
  },
]

// ── Candidate Papers ─────────────────────────────────────────────────────────

export const COMMENTARY_PDF_URL =
  "https://www.understandingstandards.org.uk/National5_images/Physics/Assignment/2023-24-n5-physics-assignment-commentary.pdf"

export const CANDIDATE_PAPERS: CandidatePaper[] = [
  {
    id: 1,
    topic: "Pressure and Temperature",
    pdfUrl:
      "https://www.understandingstandards.org.uk/National5_images/Physics/Assignment/2023-24-n5-physics-assignment-candidate-1-evidence.pdf",
    sectionMarks: {
      aim: 1,
      background: 3,
      hypothesis: 1,
      apparatus: 1,
      procedure: 0,
      results: 3,
      graph: 2,
      conclusion: 1,
      evaluation: 2,
      bibliography: 2,
    },
    sectionCommentary: {
      aim:
        "The aim clearly states that the candidate is investigating how the pressure of a fixed volume of gas changes with temperature. Both the independent variable (temperature) and dependent variable (pressure) are identified. 1 mark awarded.",
      background:
        "The candidate explains the kinetic model well and correctly states Gay-Lussac's Law (P/T = constant). The formula is linked to the experiment. However, the candidate does not fully explain why particle collisions with the walls increase in frequency/force with temperature. 3 out of 4 marks awarded.",
      hypothesis:
        "A clear prediction is made that pressure will increase as temperature increases, with explicit reference to Gay-Lussac's Law. The physics justification is sufficient. 1 mark awarded.",
      apparatus:
        "A clear, labelled diagram showing the gas syringe, thermometer, water bath, and pressure sensor is provided. All key components are labelled. 1 mark awarded.",
      procedure:
        "The method describes varying the temperature but does not explicitly state that the volume of gas is kept constant throughout. This is a critical control variable. 0 marks awarded.",
      results:
        "The results table has correct headings with units (Temperature /°C and Pressure /kPa). Six data points are recorded with repeat readings shown and an average calculated. 3 marks awarded.",
      graph:
        "Both axes are labelled with quantity and unit. All points are plotted correctly. However, the line of best fit does not pass through the origin as expected by Gay-Lussac's Law for Kelvin temperature. 2 out of 3 marks awarded.",
      conclusion:
        "The candidate states that pressure increases proportionally with temperature, linking back to the aim and confirming the hypothesis. 1 mark awarded.",
      evaluation:
        "Two valid sources of uncertainty are identified (thermometer reading accuracy and heat loss to surroundings). Improvements are suggested. However, the effect of the identified uncertainties on the results is not clearly described for one of the sources. 2 out of 3 marks awarded.",
      bibliography:
        "Two relevant sources are cited in appropriate format, both relevant to gas laws and kinetic theory. 2 marks awarded.",
    },
  },
  {
    id: 2,
    topic: "Resistance and Current",
    pdfUrl:
      "https://www.understandingstandards.org.uk/National5_images/Physics/Assignment/2023-24-n5-physics-assignment-candidate-2-evidence.pdf",
    sectionMarks: {
      aim: 1,
      background: 4,
      hypothesis: 1,
      apparatus: 1,
      procedure: 1,
      results: 2,
      graph: 3,
      conclusion: 1,
      evaluation: 2,
      bibliography: 1,
    },
    sectionCommentary: {
      aim:
        "The aim clearly states the investigation of how current varies with resistance at a constant voltage. Both variables are named. 1 mark awarded.",
      background:
        "Excellent background. Ohm's Law (V = IR) is stated and rearranged correctly (I = V/R). The candidate explains that for constant voltage, increasing resistance reduces current. The underlying physics (resistance opposes current flow) is explained clearly. 4 out of 4 marks awarded.",
      hypothesis:
        "The candidate predicts that as resistance increases, current will decrease inversely, justified by Ohm's Law rearranged as I = V/R. 1 mark awarded.",
      apparatus:
        "A clear circuit diagram with ammeter, variable resistor, battery, and voltmeter is provided and labelled. 1 mark awarded.",
      procedure:
        "The procedure clearly describes setting the resistance, recording current, and keeping voltage constant using the voltmeter reading. Control of variables is stated. 1 mark awarded.",
      results:
        "The results table has appropriate headings and units. Five data points are recorded. However, repeat readings are not taken. 2 out of 3 marks awarded.",
      graph:
        "Both axes correctly labelled. An appropriate scale is used spreading data across most of the grid. All points plotted accurately. A smooth best-fit curve is drawn showing an inversely proportional relationship. 3 out of 3 marks awarded.",
      conclusion:
        "The conclusion states that current is inversely proportional to resistance (at constant voltage) and explicitly references the hypothesis. 1 mark awarded.",
      evaluation:
        "Two valid sources of uncertainty identified (contact resistance at connections, heating effect of current changing resistance). Effects described. However, only one improvement is suggested where two were expected. 2 out of 3 marks awarded.",
      bibliography:
        "Only one source is cited. It is relevant to Ohm's Law but a second source is not provided. 1 out of 2 marks awarded.",
    },
  },
  {
    id: 3,
    topic: "Projectile Motion",
    pdfUrl:
      "https://www.understandingstandards.org.uk/National5_images/Physics/Assignment/2023-24-n5-physics-assignment-candidate-3-evidence.pdf",
    sectionMarks: {
      aim: 1,
      background: 2,
      hypothesis: 0,
      apparatus: 1,
      procedure: 1,
      results: 3,
      graph: 3,
      conclusion: 1,
      evaluation: 2,
      bibliography: 2,
    },
    sectionCommentary: {
      aim:
        "The aim clearly identifies the investigation of how the horizontal range of a projectile varies with launch speed. 1 mark awarded.",
      background:
        "The candidate mentions that horizontal and vertical motion are independent, which is correct. However, the explanation of the physics is limited — the relevant kinematic equations (s = vt for horizontal, s = ½at² for vertical) are not stated, and the underlying physics of why independence occurs is not explained. 2 out of 4 marks awarded.",
      hypothesis:
        "The candidate states 'I think the range will increase as launch speed increases' but provides no physics justification. No formula is referenced, and no proportional relationship is predicted. 0 marks awarded.",
      apparatus:
        "A clear labelled diagram showing the ramp, launch position, and landing zone with a metre ruler is provided. 1 mark awarded.",
      procedure:
        "The method clearly states how launch speed is varied (height of ramp changed), how range is measured, and that air resistance is neglected. 1 mark awarded.",
      results:
        "Excellent results table with correct headings, units, five data points, and three repeat readings with an average calculated. 3 out of 3 marks awarded.",
      graph:
        "Both axes labelled correctly. The range is plotted against launch speed with an appropriate scale. All points plotted. A best-fit line of appropriate form (smooth curve) is drawn. 3 out of 3 marks awarded.",
      conclusion:
        "The conclusion states that range increases as launch speed increases, in line with the predictions from physics, and relates back to the aim. 1 mark awarded.",
      evaluation:
        "Two sources of uncertainty identified (air resistance neglected, landing zone measurement). Effects described. Improvement suggested for one. 2 out of 3 marks awarded.",
      bibliography:
        "Two relevant sources on projectile motion are cited with sufficient detail. 2 out of 2 marks awarded.",
    },
  },
  {
    id: 4,
    topic: "Braking Distance",
    pdfUrl:
      "https://www.understandingstandards.org.uk/National5_images/Physics/Assignment/2023-24-n5-physics-assignment-candidate-4-evidence.pdf",
    sectionMarks: {
      aim: 1,
      background: 4,
      hypothesis: 1,
      apparatus: 1,
      procedure: 1,
      results: 3,
      graph: 3,
      conclusion: 1,
      evaluation: 3,
      bibliography: 2,
    },
    sectionCommentary: {
      aim:
        "The aim clearly states investigating how the mass of a vehicle affects its braking distance on a fixed surface. Both variables are clearly identified. 1 mark awarded.",
      background:
        "Outstanding background. The candidate explains kinetic energy (Ek = ½mv²), work done by friction (W = Fd), and equates them to derive braking distance ∝ mass. The physics links directly to the experiment and demonstrates deep understanding. 4 out of 4 marks awarded.",
      hypothesis:
        "The candidate correctly predicts that braking distance will increase proportionally with mass, justified by the energy equation derived in the background. 1 mark awarded.",
      apparatus:
        "A labelled diagram showing the trolley, ramp, weighted trolley, and measuring tape on a surface is clear and complete. 1 mark awarded.",
      procedure:
        "Clear step-by-step procedure stating how mass is changed, how braking distance is measured, and which variables are kept constant (launch speed, surface roughness). 1 mark awarded.",
      results:
        "Excellent table with headings, units, six data points, and three repeat readings with averages. 3 out of 3 marks awarded.",
      graph:
        "Both axes correctly labelled. Appropriate scale, all points plotted accurately. The best-fit straight line through the origin supports the proportional relationship predicted. 3 out of 3 marks awarded.",
      conclusion:
        "The conclusion clearly states that braking distance is directly proportional to mass, linking back to the aim and confirming the hypothesis is supported. 1 mark awarded.",
      evaluation:
        "Three excellent points: uncertainty in measuring the exact moment the trolley stops (effect: could overestimate distance; improvement: use a motion sensor), variation in surface roughness across runs (effect: introduces random error; improvement: clean surface before each run), and air resistance at higher speeds (effect: slight underestimate of distance; improvement: use lower speeds). 3 out of 3 marks awarded.",
      bibliography:
        "Two highly relevant sources on braking distance and kinetic energy are cited with full bibliographic information. 2 out of 2 marks awarded.",
    },
  },
  {
    id: 5,
    topic: "Thermistor Resistance",
    pdfUrl:
      "https://www.understandingstandards.org.uk/National5_images/Physics/Assignment/2023-24-n5-physics-assignment-candidate-5-evidence.pdf",
    sectionMarks: {
      aim: 1,
      background: 3,
      hypothesis: 1,
      apparatus: 0,
      procedure: 1,
      results: 2,
      graph: 2,
      conclusion: 1,
      evaluation: 2,
      bibliography: 2,
    },
    sectionCommentary: {
      aim:
        "The aim clearly states that the investigation is into how the resistance of a thermistor changes with temperature. 1 mark awarded.",
      background:
        "The candidate explains that a thermistor is a temperature-sensitive resistor and that resistance decreases with temperature. Ohm's Law is stated. However, the explanation of the semiconductor physics (increased charge carriers at higher temperatures) is superficial and the formula linking resistance, temperature, and the mechanism is not clearly applied. 3 out of 4 marks awarded.",
      hypothesis:
        "A clear prediction that resistance will decrease as temperature increases, justified by the semiconductor nature of the thermistor. 1 mark awarded.",
      apparatus:
        "No labelled diagram is provided. The candidate describes the apparatus in text but a diagram is required for this mark. 0 out of 1 marks awarded.",
      procedure:
        "The procedure describes how temperature is varied using a water bath, how resistance is measured using an ohmmeter, and notes the voltage is kept constant. 1 mark awarded.",
      results:
        "The results table includes temperature and resistance values with five data points. However, the units are missing from the resistance column heading (Ω not stated). Repeat readings are not taken. 2 out of 3 marks awarded.",
      graph:
        "Both axes are present but the resistance axis is not labelled with units (Ω). All points are plotted. The scale chosen compresses the data to less than half the available grid. A best-fit smooth curve is drawn. 2 out of 3 marks awarded.",
      conclusion:
        "The conclusion states that resistance decreases as temperature increases and identifies the relationship as non-linear (inversely but not proportionally). Links back to aim. 1 mark awarded.",
      evaluation:
        "Two uncertainties identified (accuracy of thermometer, heat distribution in water bath). Effects described for both. However, only one improvement is suggested. 2 out of 3 marks awarded.",
      bibliography:
        "Two relevant sources on thermistors and semiconductor physics cited appropriately. 2 out of 2 marks awarded.",
    },
  },
]

// ── Practice Questions ───────────────────────────────────────────────────────
// Based on the SQA N5 Physics CAT marking scheme

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: "p1",
    question: "How many marks is the N5 Physics Assignment worth in total?",
    type: "mc",
    options: ["10 marks", "15 marks", "20 marks", "25 marks"],
    answer: 2,
    explanation:
      "The N5 Physics Assignment (Course Assessment Task) is worth 20 marks out of the overall course assessment.",
    sectionRef: "aim",
  },
  {
    id: "p2",
    question: "Which TWO things must a valid aim include to gain the mark?",
    type: "mc",
    options: [
      "The equipment used and the method followed",
      "The independent variable (what changes) and the dependent variable (what is measured)",
      "The hypothesis and the conclusion",
      "The physics formula and the results table",
    ],
    answer: 1,
    explanation:
      "An aim must clearly name both the independent variable (what you change) and the dependent variable (what you measure). Example: 'To investigate how temperature (IV) affects the pressure (DV) of a fixed volume of gas.'",
    sectionRef: "aim",
  },
  {
    id: "p3",
    question: "How many marks are available for the Background Physics section?",
    type: "mc",
    options: ["1 mark", "2 marks", "3 marks", "4 marks"],
    answer: 3,
    explanation:
      "The Background Physics section is worth 4 marks. Candidates must: explain the relevant physics theory, state the correct formula(e), link the formula to the experiment, and explain the underlying physics relationship.",
    sectionRef: "background",
  },
  {
    id: "p4",
    question:
      "A student writes: 'I think the pressure will increase as temperature increases.' Will this gain the hypothesis mark?",
    type: "mc",
    options: [
      "Yes — a prediction is all that's needed",
      "No — a physics justification must also be included",
      "Yes — as long as the conclusion confirms it",
      "No — only if supported by a graph",
    ],
    answer: 1,
    explanation:
      "The hypothesis mark requires BOTH a prediction AND a physics justification. A statement like 'as temperature increases, pressure increases because Gay-Lussac's Law states P/T = constant for a fixed volume' would gain the mark.",
    sectionRef: "hypothesis",
  },
  {
    id: "p5",
    question: "What is required to gain the Apparatus/Diagram mark?",
    type: "mc",
    options: [
      "A written list of all equipment used",
      "A labelled diagram showing all key components of the experimental setup",
      "A photograph of the experiment",
      "A description of each piece of equipment and its purpose",
    ],
    answer: 1,
    explanation:
      "The apparatus mark requires a labelled diagram — not just a written list or description. Every key component must be shown and labelled clearly so the setup could be replicated.",
    sectionRef: "apparatus",
  },
  {
    id: "p6",
    question: "How many marks are available for the Results / Data Collection section?",
    type: "mc",
    options: ["1 mark", "2 marks", "3 marks", "4 marks"],
    answer: 2,
    explanation:
      "The Results section is worth 3 marks: (1) for a table with correct headings including quantities and units, (1) for sufficient data (minimum 5 different values), and (1) for repeat readings taken and recorded.",
    sectionRef: "results",
  },
  {
    id: "p7",
    question:
      "A student's results table has the heading 'Temperature' without a unit. Which mark will this affect?",
    type: "mc",
    options: [
      "The 'sufficient data' mark",
      "The 'repeat readings' mark",
      "The 'headings with units' mark",
      "The graph mark",
    ],
    answer: 2,
    explanation:
      "One of the 3 results marks is specifically for table headings that include both the quantity name AND the unit (e.g. 'Temperature /°C' or 'Temperature (°C)'). Missing units from headings loses this mark.",
    sectionRef: "results",
  },
  {
    id: "p8",
    question: "How many marks are available for the Graph section?",
    type: "mc",
    options: ["1 mark", "2 marks", "3 marks", "4 marks"],
    answer: 2,
    explanation:
      "The Graph section is worth 3 marks: (1) for both axes correctly labelled with quantity and unit, (1) for an appropriate scale with all points correctly plotted, and (1) for a best-fit straight line or smooth curve.",
    sectionRef: "graph",
  },
  {
    id: "p9",
    question:
      "A student draws lines connecting each data point on their graph rather than a single best-fit line. Which mark is affected?",
    type: "mc",
    options: [
      "The axes labelling mark",
      "The scale and plotting mark",
      "The best-fit line mark",
      "The conclusion mark",
    ],
    answer: 2,
    explanation:
      "A dot-to-dot line is NOT a best-fit line. The third graph mark requires a single best-fit straight line or smooth curve that represents the trend of the data, not a zigzag connecting all points.",
    sectionRef: "graph",
  },
  {
    id: "p10",
    question:
      "To gain full marks (3/3) on the Evaluation section, what three elements must be present?",
    type: "mc",
    options: [
      "A list of equipment, a method improvement, and a conclusion",
      "A source of uncertainty, its effect on results, and a suggested improvement",
      "An error, a repeat reading, and a graph correction",
      "A limitation, a hypothesis revision, and a bibliography update",
    ],
    answer: 1,
    explanation:
      "Evaluation is worth 3 marks: (1) identify a specific source of uncertainty or limitation, (1) describe the effect of that uncertainty on the results (e.g. 'this would cause the pressure reading to be higher than the true value'), and (1) suggest a realistic improvement to address it.",
    sectionRef: "evaluation",
  },
  {
    id: "p11",
    question:
      "A student writes in their evaluation: 'There was human error in the experiment.' Will this gain the 'source of uncertainty' mark?",
    type: "mc",
    options: [
      "Yes — human error is always an acceptable source of uncertainty",
      "No — the source must be specific (e.g. parallax error reading a ruler at an angle)",
      "Yes — if they also suggest using more careful measurement",
      "No — human error is not a valid source of uncertainty in physics",
    ],
    answer: 1,
    explanation:
      "'Human error' is too vague to gain this mark. A specific source is needed, such as: 'parallax error when reading the thermometer scale', 'difficulty judging exactly when the trolley stopped', or 'heat loss to the surroundings through the container walls'.",
    sectionRef: "evaluation",
  },
  {
    id: "p12",
    question: "How many marks are available for the Bibliography section?",
    type: "mc",
    options: ["1 mark", "2 marks", "3 marks", "4 marks"],
    answer: 1,
    explanation:
      "The Bibliography section is worth 2 marks: one for each relevant source cited, up to a maximum of 2. Sources must be relevant to the physics topic investigated and cited in enough detail to be located.",
    sectionRef: "bibliography",
  },
  {
    id: "p13",
    question:
      "What must a conclusion include to gain the mark?",
    type: "mc",
    options: [
      "A numerical value calculated from the graph",
      "A clear statement of the relationship found, linked to the aim, and reference to the hypothesis",
      "A description of any errors in the experiment",
      "A repeat of the results table",
    ],
    answer: 1,
    explanation:
      "The conclusion must clearly state what relationship was found between the variables (e.g. directly proportional, inversely proportional), link this back to the aim, and comment on whether the hypothesis was supported.",
    sectionRef: "conclusion",
  },
  {
    id: "p14",
    question:
      "In the Procedure section, what is the most common reason candidates lose the mark?",
    type: "mc",
    options: [
      "Not listing all equipment",
      "Not stating which variables are kept constant (control variables)",
      "Not drawing a diagram",
      "Not describing how to calculate results",
    ],
    answer: 1,
    explanation:
      "The procedure mark requires candidates to state which variables are kept constant (control variables) in addition to describing what is changed and measured. Without explicitly controlling variables, the mark is not awarded.",
    sectionRef: "procedure",
  },
  {
    id: "p15",
    question:
      "The minimum number of different values needed in the results table to gain the 'sufficient data' mark is:",
    type: "mc",
    options: ["3", "4", "5", "6"],
    answer: 2,
    explanation:
      "At least 5 different values of the independent variable are required to demonstrate a sufficient range of data. Fewer values risk not showing a clear trend and will not gain this mark.",
    sectionRef: "results",
  },
]

// ── Improve Examples ─────────────────────────────────────────────────────────
// Flawed candidate writing — user picks the best improvement

export const IMPROVE_EXAMPLES: ImproveExample[] = [
  {
    id: "i1",
    topic: "Pressure and Temperature",
    section: "Aim",
    sectionRef: "aim",
    context: "Candidate 1 wrote the following as their aim:",
    flawedExample: "To investigate pressure and temperature.",
    question:
      "This aim did not gain the mark. Which improvement would be most likely to earn it?",
    options: [
      "To investigate if pressure changes.",
      "To investigate how the pressure of a fixed volume of gas changes with temperature.",
      "To investigate the relationship between P and T using Gay-Lussac's Law.",
      "To see what happens when you heat a gas in a sealed container.",
    ],
    correctOption: 1,
    explanation:
      "The original aim is too vague — it doesn't state which variable is being changed (temperature) and which is being measured (pressure), or that the volume is fixed. The improved version names both variables explicitly and includes the key control variable (fixed volume).",
  },
  {
    id: "i2",
    topic: "Resistance and Current",
    section: "Hypothesis",
    sectionRef: "hypothesis",
    context: "Candidate 2 wrote the following hypothesis:",
    flawedExample: "I think that as resistance increases, the current will go down.",
    question:
      "This hypothesis did not gain the mark. Which improvement would be most likely to earn it?",
    options: [
      "I think that as resistance increases, the current will go down a lot.",
      "I think that as resistance increases, the current will increase because of Ohm's Law.",
      "I predict that as resistance increases, current will decrease proportionally, because Ohm's Law states I = V/R, so for constant voltage, current is inversely proportional to resistance.",
      "I predict current will decrease because resistance makes it harder for current to flow.",
    ],
    correctOption: 2,
    explanation:
      "The original prediction is correct but has no physics justification. The mark requires both a prediction AND a physics reason. Option C states the formula (I = V/R), explains the relationship (inversely proportional), and justifies why (constant voltage means current ∝ 1/R).",
  },
  {
    id: "i3",
    topic: "Projectile Motion",
    section: "Background Physics",
    sectionRef: "background",
    context:
      "Candidate 3 wrote in the background section: 'In projectile motion, the horizontal and vertical components of motion are independent of each other.'",
    flawedExample:
      "In projectile motion, the horizontal and vertical components of motion are independent of each other. This means the object moves forward and falls at the same time.",
    question:
      "This background section only gained 2 out of 4 marks. Which addition would best address the missing marks?",
    options: [
      "Add a diagram of a projectile path.",
      "State the kinematic equations (s = vt for horizontal, s = ½at² for vertical), explain that gravity only acts vertically (g = 9.8 m s⁻²), and show how range depends on launch speed using these equations.",
      "Explain that the experiment uses a ramp to launch the ball.",
      "Add more sentences about how air resistance affects the projectile.",
    ],
    correctOption: 1,
    explanation:
      "The missing marks were for: stating the relevant formula(e) and linking them to the experiment. The kinematic equations s = vt (horizontal) and s = ½at² (vertical) are the core physics, and explaining how horizontal range depends on launch speed using these equations would address the missing marks.",
  },
  {
    id: "i4",
    topic: "Braking Distance",
    section: "Evaluation",
    sectionRef: "evaluation",
    context: "A student investigating braking distance wrote in their evaluation:",
    flawedExample:
      "One source of error was human error when measuring the braking distance. An improvement would be to measure more carefully.",
    question:
      "This evaluation gained 0 out of 3 marks. Which version would be most likely to gain full marks?",
    options: [
      "Human error is a major source of uncertainty in all experiments.",
      "One source of uncertainty was difficulty judging exactly where the trolley stopped moving, which could cause an overestimate of the braking distance. An improvement would be to use a motion sensor connected to a data logger to record the precise stopping point.",
      "The experiment had many errors. We should repeat it more times.",
      "The ruler could have been read incorrectly. We could use a better ruler.",
    ],
    correctOption: 1,
    explanation:
      "The original version loses all 3 marks: 'human error' is too vague (not a specific source), the effect is not described, and 'measure more carefully' is not a realistic improvement. The improved version names a specific uncertainty (judging stopping point), describes the effect (overestimate of distance), and suggests a realistic improvement (motion sensor).",
  },
  {
    id: "i5",
    topic: "Thermistor Resistance",
    section: "Results",
    sectionRef: "results",
    context: "A student's results table for a thermistor experiment had the following headings:",
    flawedExample:
      "Table headings: 'Temperature' | 'Resistance'\nData: 20 | 4700\n30 | 3200\n40 | 2100\n50 | 1400\n60 | 950",
    question:
      "This results section only gained 2 out of 3 marks (the repeat readings mark was also not gained). Which single change would most likely gain an additional mark?",
    options: [
      "Add more decimal places to the resistance values.",
      "Add units to both headings (e.g. 'Temperature /°C' and 'Resistance /Ω') to gain the headings mark.",
      "Remove one of the data points to make the table shorter.",
      "Change the temperature values to Kelvin.",
    ],
    correctOption: 1,
    explanation:
      "The headings 'Temperature' and 'Resistance' without units would lose the headings mark. Adding the units ('Temperature /°C' and 'Resistance /Ω') would gain that mark. Note: the repeat readings mark would still be lost unless repeated measurements were shown.",
  },
  {
    id: "i6",
    topic: "Pressure and Temperature",
    section: "Graph",
    sectionRef: "graph",
    context:
      "A student plotted a graph of pressure vs temperature. They labelled both axes correctly and plotted all 6 points accurately. Their graph is shown below (described):",
    flawedExample:
      "The student drew a line connecting each data point in sequence (dot-to-dot), creating a zigzag line through all 6 points.",
    question:
      "The student scored 2 out of 3 marks on the graph. What change is needed to gain the third mark?",
    options: [
      "Plot additional data points.",
      "Change the scale on one axis.",
      "Replace the dot-to-dot line with a single best-fit straight line that passes as close to as many points as possible.",
      "Add a title to the graph.",
    ],
    correctOption: 2,
    explanation:
      "The third graph mark is specifically for a best-fit straight line (or smooth curve). A dot-to-dot zigzag does not represent a best-fit line. The line should be drawn as a single straight line that minimises the total distance from all points, not through every point.",
  },
  {
    id: "i7",
    topic: "Resistance and Current",
    section: "Conclusion",
    sectionRef: "conclusion",
    context: "Candidate 2 wrote the following conclusion:",
    flawedExample:
      "In conclusion, as the resistance increased, the current decreased. This shows the two are related.",
    question:
      "This conclusion did not gain the mark. Which improvement would earn it?",
    options: [
      "In conclusion, as the resistance increased, the current decreased significantly.",
      "My experiment was successful and the results were as expected.",
      "In conclusion, as resistance increases, current decreases inversely proportionally (I ∝ 1/R at constant voltage), as predicted by Ohm's Law (I = V/R). This confirms my hypothesis and is consistent with the background physics.",
      "The results show that resistance and current are related to each other in a circuit.",
    ],
    correctOption: 2,
    explanation:
      "The original conclusion correctly identifies the direction of change but doesn't name the specific relationship (inversely proportional), doesn't reference the formula or hypothesis, and the phrase 'they are related' is too vague. A good conclusion names the mathematical relationship and explicitly states whether the hypothesis was supported.",
  },
  {
    id: "i8",
    topic: "Thermistor Resistance",
    section: "Procedure",
    sectionRef: "procedure",
    context:
      "A student investigating how thermistor resistance changes with temperature wrote the following procedure:",
    flawedExample:
      "I put the thermistor in a water bath and heated it. I measured the resistance using an ohmmeter at different temperatures.",
    question:
      "This procedure did not gain the mark. Which improvement would most likely earn it?",
    options: [
      "I heated the water bath slowly to 100°C.",
      "I used a thermometer and an ohmmeter in my experiment.",
      "I set the water bath to a specific temperature and allowed it to stabilise, then measured the resistance of the thermistor using an ohmmeter. I varied the temperature from 20°C to 80°C in steps of 10°C, keeping the voltage across the thermistor constant using a voltmeter throughout. The thermistor was fully submerged at each temperature.",
      "I repeated the experiment three times to improve accuracy.",
    ],
    correctOption: 2,
    explanation:
      "The original procedure is too vague — it doesn't state the range of temperatures, the step size, how the temperature was controlled, or that a control variable (voltage) was kept constant. The improved version specifies what is varied (temperature, 20-80°C in 10°C steps), what is measured (resistance via ohmmeter), and what is controlled (voltage kept constant), which is needed for the mark.",
  },
]
