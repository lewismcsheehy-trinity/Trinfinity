// N5 Chemistry Assignment data — Understanding Standards 2023-24
// Papers: https://www.understandingstandards.org.uk/Subjects/Chemistry/national5/Assignment

import type {
  SubCriterion,
  AssignmentSection,
  CandidatePaper,
  PracticeQuestion,
  ImproveExample,
} from "@/data/n5-physics-assignment"

export type { SubCriterion, AssignmentSection, CandidatePaper, PracticeQuestion, ImproveExample }

// ── Marking Sections ─────────────────────────────────────────────────────────
// Sections 1–8 per the SQA N5 Chemistry Assignment marking scheme. Total: 20 marks.

export const ASSIGNMENT_SECTIONS: AssignmentSection[] = [
  {
    id: "aim",
    title: "1 – Aim",
    maxMarks: 1,
    criterion:
      "An aim that describes clearly the purpose of the investigation.",
    guidance:
      "The aim should be a separate statement from the title. Identify what you are investigating, e.g. 'To investigate how the concentration of hydrochloric acid affects the rate of reaction with marble chips.' A vague aim like 'To investigate rates' or 'To investigate alcohols' will not gain the mark.",
    tips: "Name both the independent variable (what you change) and the dependent variable (what you measure) in your aim.",
    markDescriptions: {
      0: "Not awarded — aim does not clearly describe the purpose of the investigation",
      1: "Awarded — aim clearly describes the purpose of the investigation",
    },
  },
  {
    id: "underlyingChemistry",
    title: "2 – Underlying Chemistry",
    maxMarks: 3,
    criterion:
      "An account of chemistry relevant to the aim of the investigation. Marked holistically — candidates must demonstrate an understanding of relevant chemistry and use their own words wherever possible.",
    guidance:
      "Cover the chemistry behind your investigation at National 5 depth. Explain relevant theories, equations, and how they relate to your experiment. Credit is given for quality of chemistry understanding, not for historical or socio-economic information.",
    tips:
      "Use your own words wherever possible. Including complex diagrams and structural formulae from an internet/literature source is acceptable. Aim to explain not just what the formula is, but why the variables are related.",
    markDescriptions: {
      0: "No understanding of relevant chemistry demonstrated",
      1: "Limited understanding of relevant chemistry demonstrated",
      2: "Reasonable understanding of relevant chemistry demonstrated",
      3: "Good understanding of relevant chemistry demonstrated",
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
    subCriteria: [
      { id: "3a", label: "3a — Brief description of approach that allows the experiment to be visualised" },
      { id: "3b", label: "3b — Sufficient unprocessed (raw) data from the candidate's experiment" },
      { id: "3c", label: "3c — Data in a correctly produced table with headings and units in every column" },
      { id: "3d", label: "3d — Mean and/or derived values calculated correctly" },
      { id: "3e", label: "3e — Relevant data from an internet or literature source included" },
      { id: "3f", label: "3f — A retrievable reference for the internet/literature source" },
    ],
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
    subCriteria: [
      { id: "4a", label: "4a — An appropriate graph format used (scatter, line, or bar)" },
      { id: "4b", label: "4b — Suitable scale(s) spreading the data across most of the grid" },
      { id: "4c", label: "4c — Axes have suitable labels with units on both axes" },
      { id: "4d", label: "4d — Data points accurately plotted with an appropriate best-fit line or curve" },
    ],
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
      "Vague conclusions like 'As one increased, the other increased' without specifying the variables or the nature of the relationship will not gain the mark.",
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
      "A specific source of uncertainty (e.g. 'heat loss to the surroundings during combustion') is needed for the first mark. 'Use better equipment' is too vague for the second mark — name the specific improvement (e.g. 'use an insulating jacket around the calorimeter to reduce heat loss').",
    markDescriptions: {
      0: "Not awarded — no significant factor identified",
      1: "Factor with significant effect on reliability/accuracy/precision identified, but no explanation of how to minimise it or evidence supporting it",
      2: "Factor identified AND explanation of minimisation, what was done, or evidence supporting the identification",
    },
    subCriteria: [
      { id: "7a", label: "7a — Identifies a specific factor with a significant effect on reliability, accuracy, or precision" },
      { id: "7b", label: "7b — Explains how to minimise the effect, what was done, or provides evidence supporting the identification" },
    ],
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
      "A title like 'Chemistry Investigation' is not informative — name the variables. The report should be concise; excessively long or repetitive reports can still gain this mark if the overall flow is logical.",
    markDescriptions: {
      0: "Not awarded — no informative title and report structure is unclear or illogical",
      1: "Either an informative title OR a clear and concise report (not both)",
      2: "Both an informative title AND a clear and concise report that flows logically",
    },
    subCriteria: [
      { id: "8a", label: "8a — An informative title that indicates the topic and nature of the investigation" },
      { id: "8b", label: "8b — A clear and concise report that flows logically from start to finish" },
    ],
  },
]

// ── Candidate Papers ─────────────────────────────────────────────────────────

export const COMMENTARY_PDF_URL =
  "https://www.understandingstandards.org.uk/National5_images/Chemistry/Assignment/2023-24-n5-chemistry-assignment-candidate-commentary.pdf"

export const CANDIDATE_PAPERS: CandidatePaper[] = [
  {
    id: 1,
    topic: "Particle Size",
    pdfUrl:
      "https://www.understandingstandards.org.uk/National5_images/Chemistry/Assignment/2023-2024-n5-chemistry-assignment-candidate-1-evidence.pdf",
    sectionMarks: {
      aim: 1,
      underlyingChemistry: 2,
      dataCollection: 5,
      graphical: 3,
      analysis: 1,
      conclusion: 1,
      evaluation: 1,
      structure: 2,
    },
    subCriteriaMarks: {
      dataCollection: { "3a": 1, "3b": 1, "3c": 1, "3d": 0, "3e": 1, "3f": 1 },
      graphical:      { "4a": 1, "4b": 1, "4c": 1, "4d": 0 },
      evaluation:     { "7a": 1, "7b": 0 },
      structure:      { "8a": 1, "8b": 1 },
    },
    sectionCommentary: {
      aim:
        "The aim clearly states the investigation of how particle size (surface area) affects the rate of reaction between marble chips and hydrochloric acid. Both the independent variable (particle size) and dependent variable (rate of reaction/volume of gas produced) are identified. 1 mark awarded.",
      underlyingChemistry:
        "The candidate explains that smaller particles have a greater surface area, leading to more frequent successful collisions per unit time, which increases the rate of reaction. Collision theory is referenced. However, the explanation of activation energy and why increased collision frequency increases the rate is not fully developed. A reasonable understanding of relevant chemistry — 2 out of 3 marks awarded.",
      dataCollection:
        "A clear description of the approach is provided, explaining that different sizes of marble chips were added to acid and gas volume measured over time (3a ✓). Sufficient raw data points for each particle size are recorded (3b ✓). The results table has correct headings with units — 'Particle Size' and 'Volume of CO₂ /cm³' (3c ✓). However, no mean values are calculated from the repeated readings — the mean/derived values mark is not awarded (3d ✗). Relevant literature data on surface area and reaction rate is included (3e ✓). The source is cited with a retrievable reference (3f ✓). 5 out of 6 marks awarded.",
      graphical:
        "An appropriate line graph format is used (4a ✓). The scale is suitable and data spreads across most of the grid (4b ✓). Both axes are correctly labelled with quantities and units (4c ✓). However, the candidate has drawn a dot-to-dot line connecting each data point rather than a best-fit smooth curve — the plotting and best-fit line mark is not awarded (4d ✗). 3 out of 4 marks awarded.",
      analysis:
        "The candidate compares their experimental results with the published data from the literature source, noting that both show an increase in reaction rate as particle size decreases, consistent with increased surface area. 1 mark awarded.",
      conclusion:
        "The conclusion clearly states that decreasing particle size increases the rate of reaction, and links this back to the aim. The conclusion is supported by the data in the report. 1 mark awarded.",
      evaluation:
        "The candidate identifies heat production during the reaction as a source of uncertainty that could affect results. However, no explanation is given of how to minimise this effect or what was done to reduce it. Factor identified (1 mark) but no explanation (0 marks). 1 out of 2 marks awarded.",
      structure:
        "The report has an informative title and is presented in a clear, logical sequence from aim through to evaluation. 2 marks awarded.",
    },
  },
  {
    id: 2,
    topic: "Combustion of Alcohols",
    pdfUrl:
      "https://www.understandingstandards.org.uk/National5_images/Chemistry/Assignment/2023-2024-n5-chemistry-assignment-candidate-2-evidence.pdf",
    sectionMarks: {
      aim: 1,
      underlyingChemistry: 1,
      dataCollection: 4,
      graphical: 4,
      analysis: 0,
      conclusion: 1,
      evaluation: 2,
      structure: 1,
    },
    subCriteriaMarks: {
      dataCollection: { "3a": 1, "3b": 1, "3c": 0, "3d": 1, "3e": 0, "3f": 1 },
      graphical:      { "4a": 1, "4b": 1, "4c": 1, "4d": 1 },
      evaluation:     { "7a": 1, "7b": 1 },
      structure:      { "8a": 0, "8b": 1 },
    },
    sectionCommentary: {
      aim:
        "The aim clearly states the investigation of how the number of carbon atoms in an alcohol affects the energy released during combustion. Both variables are identified. 1 mark awarded.",
      underlyingChemistry:
        "The candidate states that alcohols are a homologous series and that combustion releases energy as heat. However, the combustion equations for the alcohols are not given, and the explanation of why longer-chain alcohols release more energy (more C–H bonds broken and formed) is absent. A limited understanding of relevant chemistry — 1 out of 3 marks awarded.",
      dataCollection:
        "The approach is clearly described — burning alcohols under a copper calorimeter and measuring the temperature rise of a fixed volume of water (3a ✓). Three repeat readings of temperature rise for each alcohol are recorded (3b ✓). However, the units are missing from the temperature column heading (°C not stated), so the correctly produced table mark is not awarded (3c ✗). Mean temperature rises and calculated energy values (E = mcΔT) are given for each alcohol (3d ✓). No internet/literature data on combustion enthalpies is included in the report (3e ✗). A reference is cited in the bibliography but it does not correspond to any data included in the report (3f ✓). 4 out of 6 marks awarded.",
      graphical:
        "An appropriate bar chart is used to compare energy released by different alcohols — this is an appropriate format for categorical data (4a ✓). The scale is suitable and bars extend to most of the available height (4b ✓). Both axes are correctly labelled with quantities and units (4c ✓). All bars are accurately plotted to the correct heights based on the calculated energy values (4d ✓). 4 out of 4 marks awarded.",
      analysis:
        "No comparison is made between the candidate's experimental energy values and any literature or internet data. The analysis mark cannot be awarded as there is no internet/literature data included in the report for comparison. 0 out of 1 mark awarded.",
      conclusion:
        "The conclusion states that alcohols with more carbon atoms release more energy on combustion, and links this back to the aim. The conclusion is supported by the experimental data. 1 mark awarded.",
      evaluation:
        "Heat loss to the surroundings during combustion is identified as a significant source of uncertainty, and the candidate explains that this would cause the temperature rise to be smaller than expected, leading to an underestimate of the energy released. An improvement (using an insulating jacket around the calorimeter) is clearly stated. Factor identified (1 mark) and explanation with improvement given (1 mark). 2 out of 2 marks awarded.",
      structure:
        "The report is clear and flows logically from aim through to evaluation. However, the title 'Chemistry Investigation — Combustion' is not sufficiently informative as it does not identify the variables being investigated. Mark 8b awarded but not 8a. 1 out of 2 marks awarded.",
    },
  },
  {
    id: 3,
    topic: "Concentration",
    pdfUrl:
      "https://www.understandingstandards.org.uk/National5_images/Chemistry/Assignment/2023-2024-n5-chemistry-assignment-candidate-3-evidence.pdf",
    sectionMarks: {
      aim: 1,
      underlyingChemistry: 3,
      dataCollection: 6,
      graphical: 4,
      analysis: 1,
      conclusion: 1,
      evaluation: 2,
      structure: 2,
    },
    subCriteriaMarks: {
      dataCollection: { "3a": 1, "3b": 1, "3c": 1, "3d": 1, "3e": 1, "3f": 1 },
      graphical:      { "4a": 1, "4b": 1, "4c": 1, "4d": 1 },
      evaluation:     { "7a": 1, "7b": 1 },
      structure:      { "8a": 1, "8b": 1 },
    },
    sectionCommentary: {
      aim:
        "The aim clearly identifies the investigation of how the concentration of sodium thiosulfate solution affects the rate of reaction with hydrochloric acid. Both the independent variable (concentration) and dependent variable (rate of reaction, measured by time for the cross to disappear) are named. 1 mark awarded.",
      underlyingChemistry:
        "Excellent chemistry. The candidate explains collision theory in detail: increasing concentration increases the number of particles per unit volume, leading to more frequent collisions between reactant particles. The equation for the reaction is given and balanced. The candidate also explains that only collisions with sufficient energy (activation energy) lead to a successful reaction, and links this directly to the experimental variables. A good understanding of relevant chemistry — 3 out of 3 marks awarded.",
      dataCollection:
        "The approach is clearly described: different concentrations of sodium thiosulfate were reacted with a fixed volume and concentration of hydrochloric acid, and the time for a cross on paper beneath the flask to disappear was recorded (3a ✓). Five concentrations are used with three repeat readings each, providing sufficient raw data (3b ✓). The results table has correct headings with units in every column — 'Concentration /mol l⁻¹', 'Time 1 /s', 'Time 2 /s', 'Time 3 /s' and 'Mean Time /s' (3c ✓). Mean times are correctly calculated for each concentration (3d ✓). Published data on the relationship between concentration and reaction rate from a peer-reviewed chemistry journal is included (3e ✓). The full citation is given with author, journal, volume, and page number (3f ✓). 6 out of 6 marks awarded.",
      graphical:
        "An appropriate line graph is used (4a ✓). The scale is appropriate and data spreads across most of the grid (4b ✓). Both axes are correctly labelled with quantities and units — 'Concentration /mol l⁻¹' and 'Rate /s⁻¹' (4c ✓). All data points are accurately plotted and a best-fit smooth curve is drawn that appropriately represents the non-linear relationship (4d ✓). 4 out of 4 marks awarded.",
      analysis:
        "The candidate explicitly compares their experimental rate values (calculated as 1/time) with the published rate data from the cited journal, noting that both show an approximately proportional increase in rate with concentration, with experimental values within 8% of literature values. 1 mark awarded.",
      conclusion:
        "The conclusion clearly states that increasing the concentration of sodium thiosulfate increases the rate of reaction, as shown by the decreasing time for the cross to disappear. The conclusion relates directly to the aim and is supported by all the data in the report. 1 mark awarded.",
      evaluation:
        "The candidate identifies that the judgement of when the cross has disappeared is subjective and depends on the observer, which could introduce inconsistency between repeat readings. This is identified as a significant factor affecting reliability. The candidate explains that they minimised this by always using the same observer and viewing the flask from the same angle, which is cited as evidence that they were aware of this factor and took steps to reduce it. Factor identified (1 mark) and explanation of what was done to minimise it given (1 mark). 2 out of 2 marks awarded.",
      structure:
        "The report has a clear, informative title ('The Effect of Concentration on the Rate of Reaction between Sodium Thiosulfate and Hydrochloric Acid') and is exceptionally well-structured, flowing logically from aim through underlying chemistry, data collection, graphical presentation, analysis, conclusion, and evaluation. 2 marks awarded.",
    },
  },
  {
    id: 4,
    topic: "Voltage of Metals",
    pdfUrl:
      "https://www.understandingstandards.org.uk/National5_images/Chemistry/Assignment/2023-2024-n5-chemistry-assignment-candidate-4-evidence.pdf",
    sectionMarks: {
      aim: 1,
      underlyingChemistry: 2,
      dataCollection: 5,
      graphical: 3,
      analysis: 1,
      conclusion: 1,
      evaluation: 2,
      structure: 2,
    },
    subCriteriaMarks: {
      dataCollection: { "3a": 1, "3b": 1, "3c": 1, "3d": 1, "3e": 1, "3f": 0 },
      graphical:      { "4a": 1, "4b": 0, "4c": 1, "4d": 1 },
      evaluation:     { "7a": 1, "7b": 1 },
      structure:      { "8a": 1, "8b": 1 },
    },
    sectionCommentary: {
      aim:
        "The aim clearly states investigating how different metal pairs affect the voltage produced in an electrochemical cell. Both variables — the independent variable (metal pair used) and dependent variable (voltage produced) — are identified. 1 mark awarded.",
      underlyingChemistry:
        "The candidate correctly explains that in an electrochemical cell, the metal higher in the electrochemical series loses electrons (oxidation) and the metal lower in the series gains electrons (reduction). The reactivity series is referenced and linked to voltage output. However, the candidate does not explain why a greater difference in reactivity produces a higher voltage, nor is the concept of electron flow through the external circuit fully developed. A reasonable understanding of relevant chemistry — 2 out of 3 marks awarded.",
      dataCollection:
        "The approach is clearly described: pairs of different metals were connected as electrodes in a salt bridge cell containing electrolyte solution, and the voltage was measured using a voltmeter (3a ✓). Voltage readings for six different metal pairs, with three repeat readings each, are recorded as raw data (3b ✓). The results table has correct headings with units in every column — 'Metal Pair' and 'Voltage /V' for each repeat and the mean (3c ✓). Mean voltages are correctly calculated (3d ✓). Literature data showing expected voltage differences based on standard electrode potentials is included (3e ✓). However, the reference given is only 'BBC Bitesize' without a full URL — this is insufficient for a third party to retrieve the specific page (3f ✗). 5 out of 6 marks awarded.",
      graphical:
        "An appropriate bar chart is used to compare voltages across different metal pairs — a suitable choice for categorical data (4a ✓). However, the scale on the voltage axis compresses the bars into the lower third of the grid, with too much empty space above — the scale mark is not awarded (4b ✗). Both axes are correctly labelled with quantities and units (4c ✓). All bars are accurately plotted to the correct heights based on the mean voltage values (4d ✓). 3 out of 4 marks awarded.",
      analysis:
        "The candidate compares their experimental voltage values with the expected values based on standard electrode potentials from the literature, noting that the trend matches (metal pairs further apart in the electrochemical series give higher voltages) but that their experimental values are consistently lower than the theoretical values, which they attribute to internal resistance and salt bridge limitations. 1 mark awarded.",
      conclusion:
        "The conclusion clearly states that metal pairs further apart in the electrochemical series produce a higher voltage in an electrochemical cell, linking back to the aim and supported by all the experimental data. 1 mark awarded.",
      evaluation:
        "The candidate identifies that the concentration of the electrolyte solution could vary between trials due to contamination from the metal electrodes, affecting the voltage produced. An improvement is suggested: using fresh electrolyte solution for each metal pair and rinsing the electrodes between measurements. Factor identified (1 mark) and a specific, realistic improvement given (1 mark). 2 out of 2 marks awarded.",
      structure:
        "The report has an informative title ('Investigating the Effect of Different Metal Pairs on the Voltage Produced in Electrochemical Cells') and is clearly structured throughout, flowing logically from aim to evaluation. 2 marks awarded.",
    },
  },
]

// ── Practice Questions ───────────────────────────────────────────────────────
// Based on the SQA N5 Chemistry CAT marking scheme

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: "c1",
    question: "How many marks is the N5 Chemistry Assignment worth in total?",
    type: "mc",
    options: ["10 marks", "15 marks", "20 marks", "25 marks"],
    answer: 2,
    explanation:
      "The N5 Chemistry Assignment (Course Assessment Task) is worth 20 marks out of the overall course assessment.",
    sectionRef: "aim",
  },
  {
    id: "c2",
    question: "Which TWO things must a valid aim include to gain the mark?",
    type: "mc",
    options: [
      "The equipment used and the method followed",
      "The independent variable (what changes) and the dependent variable (what is measured)",
      "The hypothesis and the conclusion",
      "The chemical equation and the results table",
    ],
    answer: 1,
    explanation:
      "An aim must clearly name both the independent variable (what you change) and the dependent variable (what you measure). Example: 'To investigate how concentration (IV) affects the rate of reaction (DV) between sodium thiosulfate and hydrochloric acid.'",
    sectionRef: "aim",
  },
  {
    id: "c3",
    question: "How many marks are available for the Underlying Chemistry section?",
    type: "mc",
    options: ["1 mark", "2 marks", "3 marks", "4 marks"],
    answer: 2,
    explanation:
      "The Underlying Chemistry section is worth 3 marks and is marked holistically. 3 marks = good understanding, 2 marks = reasonable understanding, 1 mark = limited understanding, 0 marks = no understanding of relevant chemistry.",
    sectionRef: "underlyingChemistry",
  },
  {
    id: "c4",
    question: "Which of the following would NOT gain the Underlying Chemistry mark?",
    type: "mc",
    options: [
      "A clear explanation of collision theory and how it links to the experimental variables",
      "A detailed account of who discovered collision theory and when it was published",
      "A description of how increasing concentration increases the frequency of particle collisions",
      "An explanation of why only collisions with sufficient energy lead to a reaction",
    ],
    answer: 1,
    explanation:
      "Credit is given only for relevant chemistry, not for general, historical, or socio-economic information. Knowing who discovered a theory is not chemistry understanding — explaining what the theory means and how it applies to the experiment is.",
    sectionRef: "underlyingChemistry",
  },
  {
    id: "c5",
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
      "The description of approach mark (3a) requires only enough detail for a marker to visualise the nature of the experiment. Details such as the concentrations and volumes of solutions do not need to be included. A diagram alone is insufficient — some written description is needed.",
    sectionRef: "dataCollection",
  },
  {
    id: "c6",
    question: "How many marks are available for the Data Collection and Handling section?",
    type: "mc",
    options: ["3 marks", "4 marks", "5 marks", "6 marks"],
    answer: 3,
    explanation:
      "Data Collection and Handling is worth 6 marks across six sub-criteria: (3a) description of approach, (3b) sufficient raw data, (3c) correctly produced table with headings and units, (3d) mean and/or derived values, (3e) data from an internet/literature source, and (3f) a retrievable reference for that source.",
    sectionRef: "dataCollection",
  },
  {
    id: "c7",
    question: "A student's results table has the heading 'Temperature' without a unit. Which mark will this affect?",
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
    id: "c8",
    question: "How many marks are available for the Graphical Presentation section?",
    type: "mc",
    options: ["1 mark", "2 marks", "3 marks", "4 marks"],
    answer: 3,
    explanation:
      "Graphical Presentation is worth 4 marks: (4a) an appropriate graph format, (4b) suitable scale(s), (4c) axes with suitable labels and units, and (4d) accurately plotted data points with a line of best fit where appropriate.",
    sectionRef: "graphical",
  },
  {
    id: "c9",
    question: "A student draws lines connecting each data point on their graph rather than a single best-fit line. Which mark is affected?",
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
    id: "c10",
    question: "To gain both marks (2/2) on the Evaluation section, what two elements must be present?",
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
    id: "c11",
    question: "A student writes in their evaluation: 'There was human error in the experiment.' Will this gain the first Evaluation mark?",
    type: "mc",
    options: [
      "Yes — human error is always an acceptable source of uncertainty",
      "No — the source must be specific (e.g. heat loss to the surroundings during combustion)",
      "Yes — if they also suggest using more careful measurement",
      "No — human error is not a valid source of uncertainty in chemistry",
    ],
    answer: 1,
    explanation:
      "'Human error' is too vague to gain the first evaluation mark. A specific factor is needed, such as: 'heat loss to the surroundings during combustion', 'difficulty judging exactly when the cross disappeared through the cloudy solution', or 'contamination of electrodes between readings'.",
    sectionRef: "evaluation",
  },
  {
    id: "c12",
    question: "Where in the assignment are marks awarded for including a reference to an internet/literature source?",
    type: "mc",
    options: [
      "In the Conclusion section",
      "In the Analysis section",
      "In the Data Collection and Handling section (marks 3e and 3f)",
      "In the Underlying Chemistry section",
    ],
    answer: 2,
    explanation:
      "Two separate marks within Data Collection and Handling are awarded for internet/literature sources: (3e) for including relevant data from a source, and (3f) for a reference cited in sufficient detail that a third party could retrieve it (e.g. full URL, or author/title/volume/page for a book or journal).",
    sectionRef: "dataCollection",
  },
  {
    id: "c13",
    question: "What must a conclusion include to gain the mark?",
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
    id: "c14",
    question: "What does the Analysis section require to gain its mark?",
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
    id: "c15",
    question: "The raw data mark (3b) is awarded for:",
    type: "mc",
    options: [
      "Calculated mean or average values in a table",
      "Derived quantities such as rate calculated from 1/time",
      "Unprocessed measurements directly from the experiment",
      "Data copied from a literature source",
    ],
    answer: 2,
    explanation:
      "The raw data mark (3b) is specifically for unprocessed experimental measurements — the numbers recorded directly from the experiment before any calculation. Mean values or derived quantities belong to mark 3d, not 3b.",
    sectionRef: "dataCollection",
  },
  {
    id: "c16",
    question: "Which of the following BEST describes what makes a reference sufficient to gain mark 3f?",
    type: "mc",
    options: [
      "Any website address (URL), even if it no longer works",
      "The name of the website visited (e.g. 'BBC Bitesize')",
      "Enough detail that a third party could retrieve the source (e.g. full URL, or author, title, volume and page number)",
      "A screenshot of the webpage pasted into the report",
    ],
    answer: 2,
    explanation:
      "Mark 3f requires a reference detailed enough for a third party to find and retrieve the source. For a website this means the full URL; for a book or journal it means author, title, volume, and page number. A partial URL, or just a website name like 'BBC Bitesize', would not be sufficient.",
    sectionRef: "dataCollection",
  },
  {
    id: "c17",
    question: "Why is 'human error' alone NOT sufficient to gain the first mark in the Evaluation section?",
    type: "mc",
    options: [
      "Because human error is not a valid type of uncertainty in chemistry",
      "Because the mark requires the candidate to name a specific factor whose effect on the result can be assessed",
      "Because evaluation marks are only for equipment faults",
      "Because the candidate must identify two separate errors to gain the first mark",
    ],
    answer: 1,
    explanation:
      "The evaluation mark requires a specific, identifiable factor (e.g. 'heat loss to surroundings during combustion', 'subjective judgement of when the cross disappeared'). 'Human error' is too vague — a marker cannot assess its expected effect on accuracy or reliability. One specific factor is enough for the first mark.",
    sectionRef: "evaluation",
  },
  {
    id: "c18",
    question: "A candidate writes: 'To improve accuracy I would repeat the experiment more times.' Does this gain the second Evaluation mark (7b)?",
    type: "mc",
    options: [
      "Yes — repeating experiments always improves accuracy",
      "No — the mark requires a specific improvement linked to the identified factor, not a generic suggestion",
      "Yes — if combined with identifying a specific error",
      "No — only instrumental improvements count for the second mark",
    ],
    answer: 1,
    explanation:
      "'Repeat the experiment more times' is too generic to gain mark 7b. The improvement must be specifically linked to the identified factor — for example, 'use an insulating jacket around the calorimeter to reduce heat loss to the surroundings'. Generic advice about repeating measurements or using better equipment is insufficient.",
    sectionRef: "evaluation",
  },
  {
    id: "c19",
    question: "What is the key requirement for gaining the Graphical Presentation scale mark (4b)?",
    type: "mc",
    options: [
      "The scale must start at zero on both axes",
      "The plotted data points must spread across most of the available grid area",
      "The scale must use only multiples of 2, 5, or 10",
      "The scale must be the same on both axes",
    ],
    answer: 1,
    explanation:
      "Mark 4b requires a suitable scale that spreads the data points across most of the graph grid. If all the data points are bunched into a small corner of the grid, this mark is not awarded. The scale does NOT have to start at zero — an interrupted scale or a scale that starts part-way up is acceptable.",
    sectionRef: "graphical",
  },
  {
    id: "c20",
    question: "A candidate draws an appropriate graph, uses a suitable scale, and correctly labels both axes with units. Their line of best fit is a smooth curve through most of the points. How many graphical marks (4a–4d) should be awarded?",
    type: "mc",
    options: [
      "2 — smooth curves are not acceptable",
      "3 — a curve can only count if the relationship is known to be non-linear",
      "4 — all four criteria are met",
      "1 — only the format mark is awarded without a straight line",
    ],
    answer: 2,
    explanation:
      "All four graphical criteria are met: appropriate format (4a ✓), suitable scale (4b ✓), labelled axes with units (4c ✓), and accurately plotted points with a best-fit line or curve (4d ✓). A smooth curve is a valid best-fit line when the data suggests a non-linear relationship. 4/4 marks awarded.",
    sectionRef: "graphical",
  },
  {
    id: "c21",
    question: "The Analysis section is worth 1 mark. Which response BEST demonstrates what is required?",
    type: "mc",
    options: [
      "'My results matched the literature values.'",
      "'As concentration increased, rate also increased — this is consistent with collision theory as expected.'",
      "'My experimental rate values (0.012–0.048 s⁻¹) showed the same increasing trend with concentration as the published data from the SQA data booklet (0.010–0.050 s⁻¹), with differences of less than 10%.'",
      "'The graph shows that the results are roughly proportional.'",
    ],
    answer: 2,
    explanation:
      "The Analysis mark requires a valid, specific comparison between the candidate's own experimental data and the literature/internet source data. Option C explicitly references both datasets with numerical values and describes the comparison. Vague statements like 'my results matched' or 'the results are proportional' are insufficient.",
    sectionRef: "analysis",
  },
  {
    id: "c22",
    question: "A candidate states in their conclusion: 'As concentration increases, rate increases.' No reference is made to the aim or to the data. Will this gain the Conclusion mark?",
    type: "mc",
    options: [
      "Yes — it correctly identifies the direction of the relationship",
      "No — the conclusion must relate to the aim and be supported by all the data in the report",
      "Yes — as long as it is consistent with collision theory",
      "No — the conclusion must also include a chemical equation",
    ],
    answer: 1,
    explanation:
      "The Conclusion mark requires a valid statement that (a) relates to the aim and (b) is supported by all the data in the report. Simply stating the direction of change without linking back to the aim or to the data in the report is not sufficient.",
    sectionRef: "conclusion",
  },
  {
    id: "c23",
    question: "How many marks are available for the Structure section, and how are they awarded?",
    type: "mc",
    options: [
      "1 mark — for having a clear title",
      "2 marks — one for an informative title (8a) and one for a clear, logical, concise report (8b)",
      "2 marks — both awarded together only if both criteria are met",
      "3 marks — title, structure, and length",
    ],
    answer: 1,
    explanation:
      "Structure is worth 2 marks: 8a for an informative title that indicates the topic and nature of the investigation, and 8b for a report that is clear, concise, and flows logically. These are separate marks — a candidate can gain 8a without 8b and vice versa.",
    sectionRef: "structure",
  },
  {
    id: "c24",
    question: "A title reads 'Chemistry Investigation — Combustion'. Will this gain mark 8a?",
    type: "mc",
    options: [
      "Yes — any title gains the mark",
      "No — the title must indicate the topic and nature of the investigation (e.g. naming the variables)",
      "Yes — because it identifies that it is a chemistry investigation about combustion",
      "No — only titles written at the top of the first page are accepted",
    ],
    answer: 1,
    explanation:
      "Mark 8a requires an informative title that tells the reader what is being investigated — what is being changed and what is being measured. 'Chemistry Investigation — Combustion' is too vague. An informative title might be 'An investigation into how the number of carbon atoms in an alcohol affects the energy released during combustion'.",
    sectionRef: "structure",
  },
  {
    id: "c25",
    question: "The Underlying Chemistry section is marked holistically. What does this mean in practice?",
    type: "mc",
    options: [
      "The marker adds up sub-marks and converts to a score out of 3",
      "The marker assigns 3 marks only if every chemical equation in the report is correct",
      "The marker reads the whole section and awards 0, 1, 2, or 3 based on the overall quality of chemistry understanding shown",
      "The marker awards 1 mark for each correct equation stated, up to a maximum of 3",
    ],
    answer: 2,
    explanation:
      "Holistic marking means the marker considers the entire Underlying Chemistry section and makes an overall judgement. 3 marks = good understanding, 2 marks = reasonable understanding, 1 mark = limited understanding. There is no sub-mark breakdown — a single equation mentioned correctly is unlikely to gain 3 marks on its own.",
    sectionRef: "underlyingChemistry",
  },
  {
    id: "c26",
    question: "What is the minimum number of data points required for mark 3b (sufficient raw data)?",
    type: "mc",
    options: [
      "At least 2 data points",
      "Exactly 5 data points",
      "At least 3 repeat readings per condition",
      "Enough unprocessed readings to allow a meaningful relationship to be identified — typically at least 4–5 values of the independent variable",
    ],
    answer: 3,
    explanation:
      "The marking scheme does not specify an exact number but requires 'sufficient' raw data. In practice this means enough unprocessed readings to show a meaningful trend — typically a minimum of 4–5 different values of the independent variable. Three or fewer readings would rarely be considered sufficient.",
    sectionRef: "dataCollection",
  },
  {
    id: "c27",
    question: "Which section contains the mark for comparing experimental data with data from a literature or internet source?",
    type: "mc",
    options: [
      "Section 5 – Analysis",
      "Section 3 – Data Collection and Handling (mark 3e)",
      "Section 6 – Conclusion",
      "Both 3e and 5 require this comparison",
    ],
    answer: 3,
    explanation:
      "Both sections involve the literature source but for different purposes. Mark 3e (Data Collection) is awarded for including relevant data from an internet/literature source. Mark 5 (Analysis) is awarded for making a valid comparison between that literature data and the candidate's own experimental data. These are separate marks targeting different skills.",
    sectionRef: "analysis",
  },
  {
    id: "c28",
    question: "A candidate's graph uses a scale where all data points fit within the bottom-left quarter of the grid. Which mark is NOT awarded?",
    type: "mc",
    options: [
      "4a — appropriate format",
      "4b — suitable scale",
      "4c — axes labelled with units",
      "4d — accurately plotted points with best-fit line",
    ],
    answer: 1,
    explanation:
      "Mark 4b (suitable scale) requires the data points to be spread across most of the available grid. If all points are bunched in one quarter of the graph, the scale is not appropriate. Marks 4a, 4c and 4d can still be awarded independently of the scale choice.",
    sectionRef: "graphical",
  },
  {
    id: "c29",
    question: "A candidate's report has an informative title but jumps straight from the data table to the conclusion with no analysis or evaluation sections. Can mark 8b (logical structure) be awarded?",
    type: "mc",
    options: [
      "Yes — the title is informative so both structure marks are awarded",
      "No — the report must contain all sections to gain 8b",
      "Possibly — 8b is about whether the reader can follow the flow of the investigation, not about having every section present. If the sections that are present flow logically, 8b may still be awarded.",
      "No — missing sections always prevent 8b from being awarded",
    ],
    answer: 2,
    explanation:
      "Mark 8b is about whether the report flows logically so a reader can follow the investigation from start to finish. The marking scheme does not require a fixed set of headings. However, if key sections are missing it becomes difficult for the reader to follow the full investigation. The marker makes a holistic judgement — a report missing significant sections would likely not be considered clear and logical.",
    sectionRef: "structure",
  },
  {
    id: "c30",
    question: "Which of the following would gain mark 3d (mean and/or derived values)?",
    type: "mc",
    options: [
      "A table that shows three repeat readings but no calculated average",
      "A table where averages of three repeat readings are calculated for each value of the independent variable",
      "A single set of readings with no repeats",
      "A graph plotted from raw data",
    ],
    answer: 1,
    explanation:
      "Mark 3d requires evidence of mean (average) values or derived quantities (e.g. rate calculated as 1/time). A table with three repeat readings and calculated averages satisfies this criterion. Three repeat readings with no average would earn mark 3b (raw data) but not 3d.",
    sectionRef: "dataCollection",
  },
]

// ── Teacher Custom Questions ──────────────────────────────────────────────────
// Teachers can add custom questions via the Practice UI; stored in localStorage.
export const ASSIGNMENT_CUSTOM_QUESTIONS_KEY = "trinfinity_chemistry_assignment_custom_questions"

// ── Improve Examples ─────────────────────────────────────────────────────────
// Flawed candidate writing — user picks the best improvement

export const IMPROVE_EXAMPLES: ImproveExample[] = [
  {
    id: "ci1",
    topic: "Particle Size",
    section: "Aim",
    sectionRef: "aim",
    context: "Candidate 1 wrote the following as their aim:",
    flawedExample: "To investigate particle size and rate of reaction.",
    question: "This aim did not gain the mark. Which improvement would be most likely to earn it?",
    options: [
      "To investigate if particle size changes anything.",
      "To investigate how the particle size of marble chips affects the rate of reaction with hydrochloric acid.",
      "To investigate the relationship between surface area and collision theory.",
      "To see what happens when you add marble chips to acid.",
    ],
    correctOption: 1,
    explanation:
      "The original aim is too vague — it doesn't state which variable is being changed (particle size) and which is being measured (rate of reaction), nor does it specify the reactants. The improved version names both variables explicitly and includes the key context (marble chips and hydrochloric acid).",
  },
  {
    id: "ci2",
    topic: "Combustion of Alcohols",
    section: "Underlying Chemistry",
    sectionRef: "underlyingChemistry",
    context: "Candidate 2 wrote the following as their underlying chemistry section:",
    flawedExample: "Alcohols are a homologous series. When they burn, they release energy as heat. Longer alcohols release more energy because they are bigger.",
    question: "This underlying chemistry section only gained 1 out of 3 marks. Which addition would best address the missing marks?",
    options: [
      "Add a sentence about when alcohols were first discovered as fuels.",
      "Write the balanced combustion equation for each alcohol (e.g. 2CH₃OH + 3O₂ → 2CO₂ + 4H₂O), explain that more C–H and C–C bonds are present in longer-chain alcohols so more energy is released when they break and form new bonds during combustion, and state the formula E = mcΔT used to calculate energy released.",
      "Add a diagram of a methanol molecule.",
      "Write more about how alcohols are used as fuels in racing cars.",
    ],
    correctOption: 1,
    explanation:
      "The original section states a basic idea but lacks the combustion equation, no bond energy explanation, and no formula linking to the experiment. To gain higher marks, candidates need to write balanced combustion equations, explain why longer-chain alcohols release more energy (more bonds broken and formed), and link the formula E = mcΔT to how energy was measured experimentally.",
  },
  {
    id: "ci3",
    topic: "Concentration",
    section: "Underlying Chemistry",
    sectionRef: "underlyingChemistry",
    context: "Candidate 3 wrote in the underlying chemistry section: 'Increasing the concentration means there are more particles in the solution so they collide more often.'",
    flawedExample: "Increasing the concentration means there are more particles in the solution so they collide more often. This means the reaction is faster.",
    question: "This underlying chemistry section only gained 1 out of 3 marks. Which addition would best address the missing marks?",
    options: [
      "Add a diagram showing particles in solution.",
      "Explain that increasing concentration increases the number of reacting particles per unit volume, leading to more frequent collisions; state that only collisions with energy equal to or greater than the activation energy result in a successful reaction; and write the balanced equation for the reaction between sodium thiosulfate and hydrochloric acid.",
      "Explain that the experiment uses a cross on paper to measure rate.",
      "Add more sentences about how concentration affects everyday reactions like vinegar.",
    ],
    correctOption: 1,
    explanation:
      "The missing marks were for: explaining what activation energy is and its role in successful collisions, and writing a balanced equation for the reaction. The kinetic particle model explanation needs the concept of activation energy to show good understanding. A balanced equation also demonstrates chemical understanding relevant to the investigation.",
  },
  {
    id: "ci4",
    topic: "Combustion of Alcohols",
    section: "Evaluation",
    sectionRef: "evaluation",
    context: "A student investigating combustion of alcohols wrote in their evaluation:",
    flawedExample: "One source of error was human error when measuring temperature. An improvement would be to measure more carefully.",
    question: "This evaluation gained 0 out of 2 marks. Which version would be most likely to gain full marks?",
    options: [
      "Human error is a major source of uncertainty in all chemistry experiments.",
      "One source of uncertainty was heat loss to the surroundings from the copper calorimeter during combustion, which would cause the temperature rise of the water to be smaller than expected, leading to an underestimate of the energy released. An improvement would be to wrap the calorimeter in insulating material to reduce heat loss to the surroundings.",
      "The experiment had many errors. We should repeat it more times.",
      "The thermometer could have been read incorrectly. We could use a better thermometer.",
    ],
    correctOption: 1,
    explanation:
      "The original version gains no marks: 'human error' is too vague (not a specific factor), and 'measure more carefully' is not a realistic improvement. The improved version names a specific factor (heat loss to surroundings), explains how it affects results (underestimate of energy), and suggests a realistic, specific improvement (insulating jacket around the calorimeter).",
  },
  {
    id: "ci5",
    topic: "Particle Size",
    section: "Data Collection",
    sectionRef: "dataCollection",
    context: "A student's results table for a particle size experiment had the following headings:",
    flawedExample: "Table headings: 'Particle Size' | 'Volume of Gas'\nData: Large | 12\nMedium | 28\nSmall | 45\nPowder | 67",
    question: "This table did not gain the correctly produced table mark (3c). Which single change would most likely gain it?",
    options: [
      "Add more decimal places to the gas volume values.",
      "Add units to the gas volume heading (e.g. 'Volume of Gas /cm³').",
      "Remove one of the data points to make the table shorter.",
      "Change the particle size to mass values.",
    ],
    correctOption: 1,
    explanation:
      "The correctly produced table mark (3c) requires every column heading to include both the quantity name AND the unit. 'Volume of Gas' without a unit does not meet this criterion. Adding 'Volume of Gas /cm³' (or '/mL') to the heading would gain this mark. Note that 'Particle Size' is a categorical variable so a unit is not required there.",
  },
  {
    id: "ci6",
    topic: "Concentration",
    section: "Graphical Presentation",
    sectionRef: "graphical",
    context: "A student plotted a graph of rate of reaction (1/time) vs concentration. They labelled both axes correctly and plotted all 5 points accurately. Their graph is described below:",
    flawedExample: "The student drew a line connecting each data point in sequence (dot-to-dot), creating a zigzag line through all 5 points.",
    question: "The student scored 3 out of 4 marks on the graph. What change is needed to gain the fourth mark?",
    options: [
      "Plot additional data points.",
      "Change the scale on one axis.",
      "Replace the dot-to-dot line with a single best-fit straight line (or smooth curve) that passes as close to as many points as possible.",
      "Add a title to the graph.",
    ],
    correctOption: 2,
    explanation:
      "Mark 4d is specifically for accurately plotted data points with a best-fit line (or smooth curve) where appropriate. A dot-to-dot zigzag does not represent a best-fit line. The line should be a single straight line (or smooth curve) that minimises the total distance from all data points.",
  },
  {
    id: "ci7",
    topic: "Voltage of Metals",
    section: "Conclusion",
    sectionRef: "conclusion",
    context: "Candidate 4 wrote the following conclusion:",
    flawedExample: "In conclusion, different metal pairs produced different voltages. Some pairs were higher than others.",
    question: "This conclusion did not gain the mark. Which improvement would earn it?",
    options: [
      "In conclusion, the voltages were quite variable between different metal pairs.",
      "My experiment was successful and the results were as expected from the reactivity series.",
      "In conclusion, metal pairs with a greater difference in reactivity (further apart in the electrochemical series) produced a higher voltage in the cell. This directly supports the aim of investigating how different metal pairs affect voltage, and is consistent with all the data in the report.",
      "The results show that metals and voltage are related to each other.",
    ],
    correctOption: 2,
    explanation:
      "The original conclusion correctly identifies that different pairs give different voltages but doesn't name the specific relationship (greater difference in reactivity → higher voltage) and doesn't link back to the aim. A valid conclusion must state the nature of the relationship clearly, relate to the aim, and be supported by all the data in the report.",
  },
  {
    id: "ci8",
    topic: "Particle Size",
    section: "Data Collection",
    sectionRef: "dataCollection",
    context: "A student investigating how particle size affects reaction rate wrote the following description of their approach:",
    flawedExample: "I put marble chips into acid and measured the gas. I used different sizes.",
    question: "This description did not gain the description of approach mark (3a). Which improvement would most likely earn it?",
    options: [
      "I measured the gas volume at 30 second intervals.",
      "I used a measuring cylinder and a conical flask in my experiment.",
      "Different sizes of marble chips (large, medium, small, and powdered) were added to a fixed volume of dilute hydrochloric acid, and the volume of carbon dioxide gas produced was measured using a gas syringe at fixed time intervals to determine the rate of reaction.",
      "I repeated the experiment three times to improve accuracy.",
    ],
    correctOption: 2,
    explanation:
      "The description of approach mark (3a) requires enough detail for a marker to visualise the nature of the experiment — what was changed (particle size), what was measured (volume of CO₂), and how. The improved version makes clear what the independent variable is (particle sizes), what the dependent variable is (gas volume), and how it was measured (gas syringe), without needing every procedural detail.",
  },
]
