// N5 Physics Assignment data — Understanding Standards 2023-24
// Papers: https://www.understandingstandards.org.uk/Subjects/Physics/national5/Assignment

export interface AssignmentSection {
  id: string
  title: string
  maxMarks: number
  criterion: string
  guidance: string
  tips: string
  markDescriptions: Record<number, string>
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
// Sections 1–8 per the SQA N5 Physics Assignment marking scheme. Total: 20 marks.

export const ASSIGNMENT_SECTIONS: AssignmentSection[] = [
  {
    id: "aim",
    title: "1 – Aim",
    maxMarks: 1,
    criterion:
      "An aim that describes clearly the purpose of the investigation.",
    guidance:
      "The aim should be a separate statement from the title. Identify what you are investigating, e.g. 'To investigate how the resistance of a lamp filament varies with applied voltage.' A vague aim like 'To investigate filaments' will not gain the mark.",
    tips: "Name both the independent variable (what you change) and the dependent variable (what you measure) in your aim.",
    markDescriptions: {
      0: "Not awarded — aim does not clearly describe the purpose of the investigation",
      1: "Awarded — aim clearly describes the purpose of the investigation",
    },
  },
  {
    id: "underlyingPhysics",
    title: "2 – Underlying Physics",
    maxMarks: 3,
    criterion:
      "An account of physics relevant to the aim of the investigation. Marked holistically — candidates must demonstrate an understanding of relevant physics and use their own words wherever possible.",
    guidance:
      "Cover the physics behind your investigation at National 5 depth. Explain relevant laws, formulae, and how they relate to your experiment. Credit is given for quality of physics understanding, not for historical or socio-economic information.",
    tips:
      "Use your own words wherever possible. Including complex diagrams from a literature/internet source is acceptable. Aim to explain not just what the formula is, but why the variables are related.",
    markDescriptions: {
      0: "No understanding of relevant physics demonstrated",
      1: "Limited understanding of relevant physics demonstrated",
      2: "Reasonable understanding of relevant physics demonstrated",
      3: "Good understanding of relevant physics demonstrated",
    },
  },
  {
    id: "dataCollection",
    title: "3 – Data Collection and Handling",
    maxMarks: 6,
    criterion:
      "(3a) A brief description of the approach used to collect experimental data. (3b) Sufficient raw data from the candidate's experiment. (3c) Data presented in a correctly produced table with headings and units. (3d) Mean and/or derived values calculated correctly. (3e) Data relevant to the experiment from an internet/literature source. (3f) A reference for the source of the internet/literature data.",
    guidance:
      "Six marks across six sub-criteria: description of approach, raw data, correct table (headings and units in every column), mean/derived values, literature/internet data, and a retrievable reference. The description need only allow a marker to visualise the experiment — a diagram alone is insufficient. The raw data mark is for unprocessed data only.",
    tips:
      "Every column in your table must have a clear heading with units. Your reference must be detailed enough that a third party could retrieve the source (e.g. full URL, or author, title, journal, volume and page number for a book/journal).",
    markDescriptions: {
      0: "None of the six data collection criteria met",
      1: "1 of 6 criteria met",
      2: "2 of 6 criteria met",
      3: "3 of 6 criteria met",
      4: "4 of 6 criteria met",
      5: "5 of 6 criteria met",
      6: "All 6 criteria met: description, raw data, correct table, derived values, literature data, and reference",
    },
  },
  {
    id: "graphical",
    title: "4 – Graphical Presentation",
    maxMarks: 4,
    criterion:
      "(4a) An appropriate format (scatter graph, line graph, or bar graph). (4b) The axis/axes have suitable scale(s). (4c) The axes have suitable labels and units. (4d) Accurately plotted data points and, where appropriate, a line of best fit.",
    guidance:
      "Four marks, one per sub-criterion. Graphs must be based on the candidate's own experimental data. Computer-generated graphs are marked the same as hand-drawn graphs. The graph should be large enough to check plotting accuracy — excessively large data points or omitted gridlines may prevent checking.",
    tips:
      "Spelling mistakes or abbreviations in axis labels are not penalised if the meaning is clear. A dot-to-dot line is NOT a best-fit line. Scales must spread data points sensibly across the graph.",
    markDescriptions: {
      0: "None of the four graphical criteria met",
      1: "1 of 4 criteria met",
      2: "2 of 4 criteria met",
      3: "3 of 4 criteria met",
      4: "All 4 criteria met: appropriate format, suitable scales, labelled axes with units, and accurately plotted points with best-fit line",
    },
  },
  {
    id: "analysis",
    title: "5 – Analysis",
    maxMarks: 1,
    criterion:
      "A valid comparison of the experimental data with data from the internet/literature source.",
    guidance:
      "State specifically how your experimental results compare to the literature/internet source data. Similarities, differences, or trends should be commented on. A vague statement that the results 'match' is not enough — describe the comparison.",
    tips:
      "Refer to both your data and the literature source explicitly in your comparison. Numerical comparisons (e.g. percentage difference) are helpful but not required.",
    markDescriptions: {
      0: "Not awarded — no valid comparison of experimental data with literature/internet source data",
      1: "Awarded — a valid comparison of experimental data with internet/literature source data is made",
    },
  },
  {
    id: "conclusion",
    title: "6 – Conclusion",
    maxMarks: 1,
    criterion:
      "A valid conclusion that relates to the aim and is supported by all the data in the report.",
    guidance:
      "State what the data shows about the relationship between the variables and link this back to your aim. If multiple aims were stated, the conclusion must address all of them. Where no aim was stated, this mark cannot be awarded.",
    tips:
      "Vague conclusions like 'As one increased, the other increased' without specifying the variables or the nature of the relationship (e.g. directly proportional) will not gain the mark.",
    markDescriptions: {
      0: "Not awarded — conclusion is absent, invalid, or does not relate to the aim",
      1: "Awarded — valid conclusion relating to the aim, supported by all data in the report",
    },
  },
  {
    id: "evaluation",
    title: "7 – Evaluation",
    maxMarks: 2,
    criterion:
      "(1) Identifies a factor that can be expected to have a significant effect on the reliability, accuracy, or precision of the experiment. (1) Explains what could have been done to minimise the effect, OR what was done to minimise it, OR provides evidence supporting the identification of the factor.",
    guidance:
      "Two marks for evaluation. The identified factor must be specific to your experiment — 'human error' on its own is too vague. The explanation must either describe a realistic improvement, what you actually did to reduce the error, or give evidence for why it is a significant factor.",
    tips:
      "A specific source of uncertainty (e.g. 'parallax error when reading the thermometer') is needed for the first mark. 'Use better equipment' is too vague for the second mark — name the specific improvement (e.g. 'use a digital thermometer to reduce reading uncertainty').",
    markDescriptions: {
      0: "Not awarded — no significant factor identified",
      1: "Factor with significant effect on reliability/accuracy/precision identified, but no explanation of how to minimise it or evidence supporting it",
      2: "Factor identified AND explanation of minimisation, what was done, or evidence supporting the identification",
    },
  },
  {
    id: "structure",
    title: "8 – Structure",
    maxMarks: 2,
    criterion:
      "(8a) An informative title. (8b) A clear and concise report that flows in a logical manner.",
    guidance:
      "Two marks for structure. The title should indicate the topic and nature of the investigation. The report does not need to follow any set structure, but should be presented logically so a reader can follow the investigation from start to finish.",
    tips:
      "A title like 'Physics Investigation' is not informative — name the variables. The report should be concise; excessively long or repetitive reports can still gain this mark if the overall flow is logical.",
    markDescriptions: {
      0: "Not awarded — no informative title and report structure is unclear or illogical",
      1: "Either an informative title OR a clear and concise report (not both)",
      2: "Both an informative title AND a clear and concise report that flows logically",
    },
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
      underlyingPhysics: 2,
      dataCollection: 6,
      graphical: 3,
      analysis: 1,
      conclusion: 1,
      evaluation: 1,
      structure: 2,
    },
    sectionCommentary: {
      aim:
        "The aim clearly states that the candidate is investigating how the pressure of a fixed volume of gas changes with temperature. Both the independent variable (temperature) and dependent variable (pressure) are identified. 1 mark awarded.",
      underlyingPhysics:
        "The candidate explains the kinetic model and correctly states Gay-Lussac's Law (P/T = constant). The formula is linked to the experiment. However, the explanation of why particle collisions with the walls increase in frequency and force with temperature is not fully developed. A reasonable understanding of relevant physics — 2 out of 3 marks awarded.",
      dataCollection:
        "A clear labelled diagram and method description are provided (3a ✓). Six data points of raw data are recorded (3b ✓). The results table has correct headings with units — Temperature /°C and Pressure /kPa (3c ✓). Repeat readings are shown and an average is calculated (3d ✓). An internet/literature source of data on gas laws is included (3e ✓). The source is fully cited with a retrievable reference (3f ✓). 6 out of 6 marks awarded.",
      graphical:
        "An appropriate line graph format is used (4a ✓). The scale is appropriate and data spreads across most of the grid (4b ✓). Both axes are correctly labelled with quantities and units (4c ✓). However, the line of best fit does not pass through the origin as expected by Gay-Lussac's Law when temperature is expressed in Kelvin — the plotting and best-fit mark is not awarded (4d ✗). 3 out of 4 marks awarded.",
      analysis:
        "The candidate compares their experimental results with the Gay-Lussac's Law values from the literature source and notes that the graph broadly follows the expected trend, though not perfectly through the origin. 1 mark awarded.",
      conclusion:
        "The candidate states that pressure increases proportionally with temperature and links the conclusion back to the aim. 1 mark awarded.",
      evaluation:
        "Two valid sources of uncertainty are identified (thermometer reading accuracy and heat loss to surroundings). However, the effect of one of the identified uncertainties on the results is not clearly described. The factor is identified (1 mark) but the explanation is incomplete. 1 out of 2 marks awarded.",
      structure:
        "The report has an informative title and is presented in a clear, logical sequence from aim through to evaluation. 2 marks awarded.",
    },
  },
  {
    id: 2,
    topic: "Resistance and Current",
    pdfUrl:
      "https://www.understandingstandards.org.uk/National5_images/Physics/Assignment/2023-24-n5-physics-assignment-candidate-2-evidence.pdf",
    sectionMarks: {
      aim: 1,
      underlyingPhysics: 3,
      dataCollection: 5,
      graphical: 4,
      analysis: 1,
      conclusion: 1,
      evaluation: 2,
      structure: 2,
    },
    sectionCommentary: {
      aim:
        "The aim clearly states the investigation of how current varies with resistance at a constant voltage. Both variables are named. 1 mark awarded.",
      underlyingPhysics:
        "Excellent physics. Ohm's Law (V = IR) is stated and rearranged correctly (I = V/R). The candidate explains that for constant voltage, increasing resistance reduces current, and describes the underlying physics of resistance opposing current flow. A good understanding of relevant physics — 3 out of 3 marks awarded.",
      dataCollection:
        "The approach is clearly described with a circuit diagram and method (3a ✓). Five data points of raw current and resistance values are recorded (3b ✓). The results table has appropriate headings and units (3c ✓). However, repeat readings are not taken so no mean values are calculated — the mean/derived values mark is not fully awarded (3d ✗). A relevant internet source on Ohm's Law is cited (3e ✓). The source reference is provided in sufficient detail (3f ✓). 5 out of 6 marks awarded.",
      graphical:
        "An appropriate graph format is used (4a ✓). An appropriate scale is used spreading data across most of the grid (4b ✓). Both axes are correctly labelled with quantities and units (4c ✓). All points are plotted accurately and a smooth best-fit curve showing an inversely proportional relationship is drawn (4d ✓). 4 out of 4 marks awarded.",
      analysis:
        "The candidate references their literature source and compares the expected inversely proportional relationship (I ∝ 1/R) with their experimental graph, noting good agreement. 1 mark awarded.",
      conclusion:
        "The conclusion states that current is inversely proportional to resistance at constant voltage, linking back to the aim. 1 mark awarded.",
      evaluation:
        "Two valid sources of uncertainty are identified (contact resistance at connections, heating effect of current). Effects are described for both. An improvement is suggested. The factor is identified (1 mark) and an explanation of how to minimise the effect is given (1 mark). 2 out of 2 marks awarded.",
      structure:
        "The report has an informative title and is well-structured and clear throughout. 2 marks awarded.",
    },
  },
  {
    id: 3,
    topic: "Projectile Motion",
    pdfUrl:
      "https://www.understandingstandards.org.uk/National5_images/Physics/Assignment/2023-24-n5-physics-assignment-candidate-3-evidence.pdf",
    sectionMarks: {
      aim: 1,
      underlyingPhysics: 1,
      dataCollection: 6,
      graphical: 4,
      analysis: 1,
      conclusion: 1,
      evaluation: 2,
      structure: 2,
    },
    sectionCommentary: {
      aim:
        "The aim clearly identifies the investigation of how the horizontal range of a projectile varies with launch speed. 1 mark awarded.",
      underlyingPhysics:
        "The candidate mentions that horizontal and vertical motion are independent, which is correct. However, the relevant kinematic equations (s = vt for horizontal, s = ½at² for vertical) are not stated, and the underlying physics of why independence occurs is not explained in sufficient depth. A limited understanding of relevant physics — 1 out of 3 marks awarded.",
      dataCollection:
        "The approach is clearly described with a labelled diagram of the ramp setup (3a ✓). Five data points of raw range and launch speed values are recorded, including three repeat readings (3b ✓). The results table has correct headings with quantities and units (3c ✓). Averages are calculated from the repeat readings (3d ✓). Two relevant internet sources on projectile motion are included as literature data (3e ✓). Both sources are cited with sufficient detail to be retrieved (3f ✓). 6 out of 6 marks awarded.",
      graphical:
        "An appropriate graph format is used (4a ✓). The range is plotted against launch speed with an appropriate scale (4b ✓). Both axes are correctly labelled with quantities and units (4c ✓). All points are plotted accurately and a best-fit smooth curve is drawn (4d ✓). 4 out of 4 marks awarded.",
      analysis:
        "The candidate compares their range vs. launch speed data with the theoretical predictions from the kinematic equations cited in the literature sources, noting that the experimental results follow the expected trend. 1 mark awarded.",
      conclusion:
        "The conclusion states that range increases as launch speed increases, relates back to the aim, and is supported by the data. 1 mark awarded.",
      evaluation:
        "Two sources of uncertainty are identified (air resistance neglected, difficulty measuring the exact landing point). Effects are described for both. A specific improvement (using a landing pad with a measuring scale) is suggested. Factor identified (1 mark) and explanation given (1 mark). 2 out of 2 marks awarded.",
      structure:
        "The report has an informative title and flows logically from aim through to evaluation. 2 marks awarded.",
    },
  },
  {
    id: 4,
    topic: "Braking Distance",
    pdfUrl:
      "https://www.understandingstandards.org.uk/National5_images/Physics/Assignment/2023-24-n5-physics-assignment-candidate-4-evidence.pdf",
    sectionMarks: {
      aim: 1,
      underlyingPhysics: 3,
      dataCollection: 6,
      graphical: 4,
      analysis: 1,
      conclusion: 1,
      evaluation: 2,
      structure: 2,
    },
    sectionCommentary: {
      aim:
        "The aim clearly states investigating how the mass of a vehicle affects its braking distance on a fixed surface. Both variables are clearly identified. 1 mark awarded.",
      underlyingPhysics:
        "Outstanding physics. The candidate explains kinetic energy (Ek = ½mv²), work done by friction (W = Fd), and equates them to derive braking distance ∝ mass. The physics links directly to the experiment and demonstrates deep understanding. A good understanding of relevant physics — 3 out of 3 marks awarded.",
      dataCollection:
        "The approach is clearly described with a labelled diagram of the trolley and ramp setup (3a ✓). Six data points of raw braking distance values for different masses are recorded (3b ✓). The table has correct headings with quantities and units, including an average column (3c ✓). Averages from three repeat readings are calculated for each mass (3d ✓). Relevant literature data on braking distance and kinetic energy is included (3e ✓). Both sources are cited with full bibliographic detail (3f ✓). 6 out of 6 marks awarded.",
      graphical:
        "An appropriate graph format is used (4a ✓). An appropriate scale is used and all points are plotted accurately (4b ✓). Both axes are correctly labelled with quantities and units (4c ✓). A best-fit straight line through the origin is drawn, supporting the proportional relationship (4d ✓). 4 out of 4 marks awarded.",
      analysis:
        "The candidate compares their experimental braking distance values with those predicted by the energy equation and with published data, noting good agreement and discussing a small systematic discrepancy attributed to friction variation. 1 mark awarded.",
      conclusion:
        "The conclusion clearly states that braking distance is directly proportional to mass, linking back to the aim and supported by all the data in the report. 1 mark awarded.",
      evaluation:
        "Excellent evaluation: uncertainty in measuring the exact moment the trolley stops is identified (effect: overestimate of distance; improvement: use a motion sensor connected to a data logger). Factor clearly identified (1 mark) and a specific, realistic improvement is given (1 mark). 2 out of 2 marks awarded.",
      structure:
        "The report has a clear, informative title and is exceptionally well-structured throughout, flowing logically from aim to evaluation. 2 marks awarded.",
    },
  },
  {
    id: 5,
    topic: "Thermistor Resistance",
    pdfUrl:
      "https://www.understandingstandards.org.uk/National5_images/Physics/Assignment/2023-24-n5-physics-assignment-candidate-5-evidence.pdf",
    sectionMarks: {
      aim: 1,
      underlyingPhysics: 2,
      dataCollection: 4,
      graphical: 2,
      analysis: 1,
      conclusion: 1,
      evaluation: 2,
      structure: 2,
    },
    sectionCommentary: {
      aim:
        "The aim clearly states that the investigation is into how the resistance of a thermistor changes with temperature. 1 mark awarded.",
      underlyingPhysics:
        "The candidate explains that a thermistor is a temperature-sensitive resistor and that resistance decreases with temperature. Ohm's Law is stated. However, the semiconductor physics explanation (increased charge carriers at higher temperatures) is superficial and not clearly linked to the experimental variables. A reasonable understanding of relevant physics — 2 out of 3 marks awarded.",
      dataCollection:
        "The approach is briefly described with a method for heating the thermistor in a water bath (3a ✓). Five data points of raw temperature and resistance values are recorded (3b ✓). However, the units are missing from the resistance column heading (Ω not stated), so the correctly produced table mark is not awarded (3c ✗). Repeat readings are not taken and no mean or derived values are calculated (3d ✗). Two relevant internet sources on thermistor characteristics are included (3e ✓). Both sources are cited with retrievable references (3f ✓). 4 out of 6 marks awarded.",
      graphical:
        "An appropriate graph format is used (4a ✓). However, the scale chosen compresses the data to less than half the available grid area (4b ✗). The resistance axis is not labelled with units (Ω missing), so the labels and units mark is not awarded (4c ✗). All points are plotted and a best-fit smooth curve is drawn (4d ✓). 2 out of 4 marks awarded.",
      analysis:
        "The candidate compares their experimental resistance vs. temperature curve with published thermistor characteristic data from the literature source, noting that the trend matches but values differ due to the specific thermistor type used. 1 mark awarded.",
      conclusion:
        "The conclusion states that resistance decreases as temperature increases and identifies the relationship as non-linear. The conclusion links back to the aim. 1 mark awarded.",
      evaluation:
        "Two uncertainties are identified (accuracy of thermometer, uneven heat distribution in the water bath). Effects are described for both. A specific improvement is suggested for one (using a stirrer to ensure even temperature distribution). Factor identified (1 mark) and explanation given (1 mark). 2 out of 2 marks awarded.",
      structure:
        "The report has an informative title and is generally clearly written and logically ordered. 2 marks awarded.",
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
    question: "How many marks are available for the Underlying Physics section?",
    type: "mc",
    options: ["1 mark", "2 marks", "3 marks", "4 marks"],
    answer: 2,
    explanation:
      "The Underlying Physics section is worth 3 marks and is marked holistically. 3 marks = good understanding, 2 marks = reasonable understanding, 1 mark = limited understanding, 0 marks = no understanding of relevant physics.",
    sectionRef: "underlyingPhysics",
  },
  {
    id: "p4",
    question:
      "Which of the following would NOT gain the Underlying Physics mark?",
    type: "mc",
    options: [
      "A clear explanation of the relevant law or formula in the candidate's own words",
      "A detailed account of who discovered the relevant law and when",
      "A description of how the formula links to the experimental variables",
      "An explanation of why the two variables are related using physics",
    ],
    answer: 1,
    explanation:
      "Credit is given only for relevant physics, not for general, historical, or socio-economic information. Knowing who discovered a law is not physics understanding — explaining what the law means and how it applies to the experiment is.",
    sectionRef: "underlyingPhysics",
  },
  {
    id: "p5",
    question: "What is required to gain the description of approach mark (section 3a)?",
    type: "mc",
    options: [
      "A step-by-step procedure listing every measurement taken",
      "A brief description that allows a marker to visualise the nature of the experiment",
      "A labelled diagram of the apparatus only",
      "A full written method with equipment list and control variables",
    ],
    answer: 1,
    explanation:
      "The description of approach mark (3a) requires only enough detail for a marker to visualise the nature of the experiment. Details such as the range of the independent variable and the number of repeats do not need to be included. A diagram alone is insufficient — some written description is needed.",
    sectionRef: "dataCollection",
  },
  {
    id: "p6",
    question: "How many marks are available for the Data Collection and Handling section?",
    type: "mc",
    options: ["3 marks", "4 marks", "5 marks", "6 marks"],
    answer: 3,
    explanation:
      "Data Collection and Handling is worth 6 marks across six sub-criteria: (3a) description of approach, (3b) sufficient raw data, (3c) correctly produced table with headings and units, (3d) mean and/or derived values, (3e) data from an internet/literature source, and (3f) a retrievable reference for that source.",
    sectionRef: "dataCollection",
  },
  {
    id: "p7",
    question:
      "A student's results table has the heading 'Temperature' without a unit. Which mark will this affect?",
    type: "mc",
    options: [
      "The raw data mark (3b)",
      "The mean/derived values mark (3d)",
      "The correctly produced table mark (3c)",
      "The graphical presentation mark",
    ],
    answer: 2,
    explanation:
      "The correctly produced table mark (3c) requires every column to have a clear heading with the quantity name AND the unit (e.g. 'Temperature /°C'). Missing units from any column heading means the table is not correctly produced and this mark is not awarded.",
    sectionRef: "dataCollection",
  },
  {
    id: "p8",
    question: "How many marks are available for the Graphical Presentation section?",
    type: "mc",
    options: ["1 mark", "2 marks", "3 marks", "4 marks"],
    answer: 3,
    explanation:
      "Graphical Presentation is worth 4 marks: (4a) an appropriate graph format, (4b) suitable scale(s), (4c) axes with suitable labels and units, and (4d) accurately plotted data points with a line of best fit where appropriate.",
    sectionRef: "graphical",
  },
  {
    id: "p9",
    question:
      "A student draws lines connecting each data point on their graph rather than a single best-fit line. Which mark is affected?",
    type: "mc",
    options: [
      "The appropriate format mark (4a)",
      "The suitable scale mark (4b)",
      "The plotting and best-fit line mark (4d)",
      "The conclusion mark",
    ],
    answer: 2,
    explanation:
      "A dot-to-dot line is NOT a best-fit line. Mark 4d requires a single best-fit straight line or smooth curve that represents the trend of the data — not a zigzag connecting all points in sequence.",
    sectionRef: "graphical",
  },
  {
    id: "p10",
    question:
      "To gain both marks (2/2) on the Evaluation section, what two elements must be present?",
    type: "mc",
    options: [
      "A list of equipment used and a suggestion to repeat the experiment",
      "A factor with significant effect on reliability/accuracy identified, AND an explanation of how to minimise it (or what was done, or evidence supporting it)",
      "Two separate sources of error and two separate improvements",
      "A description of random error and a description of systematic error",
    ],
    answer: 1,
    explanation:
      "Evaluation is worth 2 marks: (1) identify a factor that can be expected to have a significant effect on reliability, accuracy, or precision; (2) explain what could have been done to minimise its effect, what was done to minimise it, or provide evidence supporting why it is a significant factor.",
    sectionRef: "evaluation",
  },
  {
    id: "p11",
    question:
      "A student writes in their evaluation: 'There was human error in the experiment.' Will this gain the first Evaluation mark?",
    type: "mc",
    options: [
      "Yes — human error is always an acceptable source of uncertainty",
      "No — the source must be specific (e.g. parallax error reading a ruler at an angle)",
      "Yes — if they also suggest using more careful measurement",
      "No — human error is not a valid source of uncertainty in physics",
    ],
    answer: 1,
    explanation:
      "'Human error' is too vague to gain the first evaluation mark. A specific factor is needed, such as: 'parallax error when reading the thermometer scale', 'difficulty judging exactly when the trolley stopped', or 'heat loss to the surroundings through the container walls'.",
    sectionRef: "evaluation",
  },
  {
    id: "p12",
    question: "Where in the assignment are marks awarded for including a reference to an internet/literature source?",
    type: "mc",
    options: [
      "In the Conclusion section",
      "In the Analysis section",
      "In the Data Collection and Handling section (marks 3e and 3f)",
      "In the Underlying Physics section",
    ],
    answer: 2,
    explanation:
      "Two separate marks within Data Collection and Handling are awarded for internet/literature sources: (3e) for including relevant data from a source, and (3f) for a reference cited in sufficient detail that a third party could retrieve it (e.g. full URL, or author/title/volume/page for a book or journal).",
    sectionRef: "dataCollection",
  },
  {
    id: "p13",
    question:
      "What must a conclusion include to gain the mark?",
    type: "mc",
    options: [
      "A numerical value calculated from the graph",
      "A valid conclusion that relates to the aim and is supported by all the data in the report",
      "A description of any errors in the experiment",
      "A repeat of the results table",
    ],
    answer: 1,
    explanation:
      "The conclusion must be valid (correctly summarising what the data shows), relate to the aim, and be supported by all the data in the report. Where no aim has been stated, the conclusion mark cannot be awarded.",
    sectionRef: "conclusion",
  },
  {
    id: "p14",
    question:
      "What does the Analysis section require to gain its mark?",
    type: "mc",
    options: [
      "A calculation using data from the graph",
      "A valid comparison of the experimental data with data from an internet/literature source",
      "A description of the experimental procedure",
      "A statement about the accuracy of the equipment",
    ],
    answer: 1,
    explanation:
      "The Analysis mark is specifically for a valid comparison between the candidate's own experimental data and the data obtained from an internet or literature source. Both datasets must be referenced in the comparison.",
    sectionRef: "analysis",
  },
  {
    id: "p15",
    question:
      "The raw data mark (3b) is awarded for:",
    type: "mc",
    options: [
      "Calculated mean or average values in a table",
      "Derived quantities such as resistance calculated from V and I",
      "Unprocessed measurements directly from the experiment",
      "Data copied from a literature source",
    ],
    answer: 2,
    explanation:
      "The raw data mark (3b) is specifically for unprocessed experimental measurements — the numbers recorded directly from the experiment before any calculation. Mean values or derived quantities belong to mark 3d, not 3b.",
    sectionRef: "dataCollection",
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
    section: "Underlying Physics",
    sectionRef: "underlyingPhysics",
    context: "Candidate 2 wrote the following as their underlying physics section:",
    flawedExample: "Resistance opposes the flow of current. A higher resistance means less current flows. This is known as Ohm's Law.",
    question:
      "This underlying physics section only gained 1 out of 3 marks. Which addition would best address the missing marks?",
    options: [
      "Add a sentence about who discovered Ohm's Law and when it was published.",
      "State Ohm's Law as a formula (V = IR), rearrange it to show I = V/R, explain what each symbol means, and describe how this means that at constant voltage, current is inversely proportional to resistance.",
      "Add a diagram of a resistor symbol.",
      "Write more about how resistance is used in everyday devices like light bulbs.",
    ],
    correctOption: 1,
    explanation:
      "The original section states the basic idea but lacks the formula and any real explanation of the physics relationship. To gain higher marks, candidates need to state the relevant formula (V = IR), explain what each variable represents, and show how the formula applies to the experiment (e.g. rearranging to I = V/R shows that at constant V, I ∝ 1/R).",
  },
  {
    id: "i3",
    topic: "Projectile Motion",
    section: "Underlying Physics",
    sectionRef: "underlyingPhysics",
    context:
      "Candidate 3 wrote in the underlying physics section: 'In projectile motion, the horizontal and vertical components of motion are independent of each other.'",
    flawedExample:
      "In projectile motion, the horizontal and vertical components of motion are independent of each other. This means the object moves forward and falls at the same time.",
    question:
      "This underlying physics section only gained 1 out of 3 marks. Which addition would best address the missing marks?",
    options: [
      "Add a diagram of a projectile path.",
      "State the kinematic equations (s = vt for horizontal, s = ½at² for vertical), explain that gravity only acts vertically (g = 9.8 m s⁻²), and show how range depends on launch speed using these equations.",
      "Explain that the experiment uses a ramp to launch the ball.",
      "Add more sentences about how air resistance affects the projectile.",
    ],
    correctOption: 1,
    explanation:
      "The missing marks were for: stating the relevant formula(e) and linking them to the experiment. The kinematic equations s = vt (horizontal) and s = ½at² (vertical) are the core physics, and explaining how horizontal range depends on launch speed using these equations would demonstrate a good understanding of the relevant physics.",
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
      "This evaluation gained 0 out of 2 marks. Which version would be most likely to gain full marks?",
    options: [
      "Human error is a major source of uncertainty in all experiments.",
      "One source of uncertainty was difficulty judging exactly where the trolley stopped moving, which could cause an overestimate of the braking distance. An improvement would be to use a motion sensor connected to a data logger to record the precise stopping point.",
      "The experiment had many errors. We should repeat it more times.",
      "The ruler could have been read incorrectly. We could use a better ruler.",
    ],
    correctOption: 1,
    explanation:
      "The original version gains no marks: 'human error' is too vague (not a specific factor), and 'measure more carefully' is not a realistic improvement. The improved version names a specific factor (difficulty judging the stopping point), explains how it affects results (overestimate of distance), and suggests a realistic improvement (motion sensor with data logger).",
  },
  {
    id: "i5",
    topic: "Thermistor Resistance",
    section: "Data Collection",
    sectionRef: "dataCollection",
    context: "A student's results table for a thermistor experiment had the following headings:",
    flawedExample:
      "Table headings: 'Temperature' | 'Resistance'\nData: 20 | 4700\n30 | 3200\n40 | 2100\n50 | 1400\n60 | 950",
    question:
      "This table did not gain the correctly produced table mark (3c). Which single change would most likely gain it?",
    options: [
      "Add more decimal places to the resistance values.",
      "Add units to both headings (e.g. 'Temperature /°C' and 'Resistance /Ω').",
      "Remove one of the data points to make the table shorter.",
      "Change the temperature values to Kelvin.",
    ],
    correctOption: 1,
    explanation:
      "The correctly produced table mark (3c) requires every column heading to include both the quantity name AND the unit. 'Temperature' and 'Resistance' without units do not meet this criterion. Adding 'Temperature /°C' and 'Resistance /Ω' would gain this mark.",
  },
  {
    id: "i6",
    topic: "Pressure and Temperature",
    section: "Graphical Presentation",
    sectionRef: "graphical",
    context:
      "A student plotted a graph of pressure vs temperature. They labelled both axes correctly and plotted all 6 points accurately. Their graph is shown below (described):",
    flawedExample:
      "The student drew a line connecting each data point in sequence (dot-to-dot), creating a zigzag line through all 6 points.",
    question:
      "The student scored 3 out of 4 marks on the graph. What change is needed to gain the fourth mark?",
    options: [
      "Plot additional data points.",
      "Change the scale on one axis.",
      "Replace the dot-to-dot line with a single best-fit straight line that passes as close to as many points as possible.",
      "Add a title to the graph.",
    ],
    correctOption: 2,
    explanation:
      "Mark 4d is specifically for accurately plotted data points with a best-fit line (or smooth curve) where appropriate. A dot-to-dot zigzag does not represent a best-fit line. The line should be a single straight line (or smooth curve) that minimises the total distance from all data points.",
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
      "In conclusion, as resistance increases, current decreases inversely proportionally (I ∝ 1/R at constant voltage), as shown by Ohm's Law (I = V/R). This is consistent with the underlying physics and is supported by all data in the report.",
      "The results show that resistance and current are related to each other in a circuit.",
    ],
    correctOption: 2,
    explanation:
      "The original conclusion correctly identifies the direction of change but doesn't name the specific relationship (inversely proportional) and 'they are related' is too vague. A valid conclusion must state the nature of the relationship clearly and be supported by all the data in the report.",
  },
  {
    id: "i8",
    topic: "Thermistor Resistance",
    section: "Data Collection",
    sectionRef: "dataCollection",
    context:
      "A student investigating how thermistor resistance changes with temperature wrote the following description of their approach:",
    flawedExample:
      "I put the thermistor in a water bath and heated it. I measured the resistance using an ohmmeter at different temperatures.",
    question:
      "This description did not gain the description of approach mark (3a). Which improvement would most likely earn it?",
    options: [
      "I heated the water bath slowly to 100°C.",
      "I used a thermometer and an ohmmeter in my experiment.",
      "The resistance of the thermistor was measured using an ohmmeter as the temperature of the surrounding water bath was varied. Temperature was read from a thermometer placed in the water bath alongside the thermistor.",
      "I repeated the experiment three times to improve accuracy.",
    ],
    correctOption: 2,
    explanation:
      "The description of approach mark (3a) requires enough detail for a marker to visualise the nature of the experiment — what was changed (temperature) and what was measured (resistance), and how. The improved version makes clear that temperature was varied and resistance was measured, without needing every procedural detail.",
  },
]
