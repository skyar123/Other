// Skylar's Caseload Data
export const SKYLAR_CASELOAD = [
  {
    id: 1,
    codeName: "Turtle",
    child: "Royce Molina",
    caregiver: "Hillary Ridenhour",
    childDOB: "2022-03-12",
    childAge: "3y 10m",
    admissionDate: "2025-12-16",
    diagnosis: "Adjustment Disorder (F43.20)",
    phase: "baseline",
    avatarColor: "#81C784",
    relationship: "Kinship Guardian",
    therapist: "McKenna",
    completedDocs: ["sniff", "pq"],
    ccisObservations: 0,
    hopeObservations: 0,
    unsignedDocs: ["Clinical Direct (1/7)", "Caregiver A Baseline (12/16)"],
    needs: {
      dev5: { status: "wantsHelp", note: "Autism assessment - Seth's practice", priority: true },
      dev7: { status: "wantsHelp", note: "Daycare vouchers - Head Start" },
      cg6: { status: "wantsHelp", note: "CRITICAL - sole caregiver, sleep-deprived, no respite", priority: true },
      cg8: { status: "wantsHelp", note: "Needs new therapist (Dr. Rice now inpatient only)" },
      cn11: { status: "wantsHelp", note: "Toddler bed needed", priority: true },
      cn16: { status: "wantsHelp", note: "Legal guardian status unclear - DSS follow-up", priority: true },
      beh6: { status: "hasService", note: "McKenna providing" },
      hlt1: { status: "hasService", note: "Has ped - contact with Natasha/DSS" },
      cn2: { status: "hasService", note: "SSI" },
      cn3: { status: "hasService", note: "SNAP $50/mo" }
    },
    notes: "Kinship. Hillary='Ray Ray'. Bio mom (Jess) next door in recovery. No groups. Head-banging when dysregulated."
  },
  {
    id: 2,
    codeName: "Firecracker",
    child: "Kaizen Reyes",
    caregiver: "Gracie Griffin",
    childDOB: "2021-06-05",
    childAge: "4y 7m",
    admissionDate: "2025-07-17",
    diagnosis: "ADHD Hyperactive/Impulsive (F90.1)",
    phase: "intervention",
    avatarColor: "#E57373",
    therapist: "McKenna",
    completedDocs: ["intake", "sniff", "pq", "asq3", "pkbs", "sensory", "tesi", "psi", "cesd", "lscr", "pcl5", "hope", "ccis", "caregiver_a", "ycpc", "wmci", "angels"],
    ccisObservations: 4,
    hopeObservations: 3,
    unsignedDocs: ["Treatment Plan (1/6) - Awaiting Signature"],
    needs: {},
    notes: "6-month assessments due January. Tx Plan 1/6 awaiting signature."
  },
  {
    id: 3,
    codeName: "Bubbles",
    child: "Ezra Guernsey",
    caregiver: "Emily Guernsey",
    childDOB: "2023-01-24",
    childAge: "2y 11m",
    admissionDate: "2025-04-02",
    diagnosis: "Autism (F84.0)",
    phase: "intervention",
    avatarColor: "#64B5F6",
    therapist: "McKenna",
    completedDocs: ["intake", "sniff", "pq", "asq3", "mchat", "bitsea", "tesi", "psi", "cesd", "lscr", "pcl5", "hope", "ccis", "caregiver_a", "ycpc", "wmci", "angels", "asq3_6", "bitsea_6", "ccis_6", "psi_6", "cesd_6", "pcl5_6"],
    ccisObservations: 4,
    hopeObservations: 3,
    unsignedDocs: [],
    needs: {},
    notes: "6-month complete. Well-documented. SNIFF updated 12/10."
  },
  {
    id: 4,
    codeName: "Mermaid",
    child: "Harlie Yoder",
    caregiver: "Sabrina Crain",
    childDOB: "2023-04-06",
    childAge: "2y 9m",
    admissionDate: "2025-04-17",
    diagnosis: "DMDD (F34.81)",
    phase: "intervention",
    avatarColor: "#BA68C8",
    therapist: "McKenna",
    completedDocs: ["intake", "sniff", "pq", "asq3", "mchat", "sensory", "bitsea", "tesi", "psi", "cesd", "lscr", "pcl5", "hope", "ccis", "caregiver_a", "ycpc", "wmci", "angels", "asq3_6", "bitsea_6", "psi_6"],
    ccisObservations: 4,
    hopeObservations: 3,
    unsignedDocs: ["Treatment Plan (1/6) - Awaiting Signature"],
    needs: {},
    notes: "DMDD. 6-month assessments in progress. Tx Plan 1/6 awaiting signature."
  },
  {
    id: 5,
    codeName: "Puppy",
    child: "Grace Proffitt",
    caregiver: "Rhonda Proffitt",
    childDOB: "2023-02-13",
    childAge: "2y 11m",
    admissionDate: "2025-12-15",
    diagnosis: "Adjustment Disorder (F43.20)",
    phase: "baseline",
    avatarColor: "#FFB74D",
    therapist: "McKenna",
    isTwin: true,
    twinOf: "Peanut",
    completedDocs: ["pq"],
    ccisObservations: 0,
    hopeObservations: 0,
    unsignedDocs: ["Treatment Plan (12/29) - Awaiting Sig", "CCA (12/29) - Awaiting Sig", "Caregiver A (12/15)"],
    needs: {},
    notes: "Twin of Kayden (Peanut). Insurance submitted 12/31. SNIFF needed."
  },
  {
    id: 6,
    codeName: "Peanut",
    child: "Kayden Proffitt",
    caregiver: "Rhonda Proffitt",
    childDOB: "2023-02-13",
    childAge: "2y 11m",
    admissionDate: "2025-12-15",
    diagnosis: "Adjustment Disorder (F43.20)",
    phase: "baseline",
    avatarColor: "#FFD54F",
    therapist: "McKenna",
    isTwin: true,
    twinOf: "Puppy",
    completedDocs: ["pq", "sniff", "asq3", "bitsea"],
    ccisObservations: 0,
    hopeObservations: 0,
    unsignedDocs: ["Treatment Plan (12/29) - Awaiting Sig", "CCA (12/29) - Awaiting Sig", "Caregiver A (12/15)"],
    needs: {},
    notes: "Twin of Grace (Puppy). More assessments done than sibling."
  },
  {
    id: 7,
    codeName: "Fairy",
    child: "Nylah Harper",
    caregiver: "Nikiria Harper",
    childDOB: "2020-12-17",
    childAge: "5y 0m",
    admissionDate: "2025-12-01",
    diagnosis: "Unspecified Trauma/Stressor (F43.9)",
    phase: "baseline",
    avatarColor: "#F48FB1",
    therapist: "McKenna",
    completedDocs: [],
    ccisObservations: 0,
    hopeObservations: 0,
    unsignedDocs: ["Treatment Plan (12/8)", "Clinical Direct (12/1)", "Caregiver A (12/16)"],
    needs: {},
    notes: "Trauma dx. Day 37 - needs baseline assessments. No SNIFF yet."
  },
  {
    id: 8,
    codeName: "Milkshake",
    child: "Paxton Cody",
    caregiver: "Alyssa Brickett",
    childDOB: "2021-11-09",
    childAge: "4y 2m",
    admissionDate: "2025-12-16",
    diagnosis: null,
    phase: "baseline",
    avatarColor: "#CE93D8",
    therapist: "McKenna",
    completedDocs: ["pq"],
    ccisObservations: 0,
    hopeObservations: 0,
    unsignedDocs: ["Treatment Plan (12/31) - Awaiting Sig", "CCA (12/30) - Awaiting Sig", "Caregiver A (12/17)"],
    needs: {},
    notes: "No diagnosis yet. CCA 12/30 done, awaiting signature. SNIFF needed."
  }
];

export const SNIFF_CATEGORIES = {
  childDevelopment: {
    title: "Child Development & Early Education",
    icon: "📚",
    color: "#1565C0",
    items: [
      { id: "dev1", name: "Developmental screening" },
      { id: "dev2", name: "Early intervention services" },
      { id: "dev5", name: "Comprehensive developmental assessment" },
      { id: "dev7", name: "Child care/preschool (center-based)" },
      { id: "dev12", name: "Speech therapy" }
    ]
  },
  childBehavior: {
    title: "Child Behavior & Emotions",
    icon: "💭",
    color: "#7B1FA2",
    items: [
      { id: "beh1", name: "Behavioral/emotional screening" },
      { id: "beh2", name: "Assessments to understand behavior" },
      { id: "beh6", name: "Home-based treatment for behavior" }
    ]
  },
  childHealth: {
    title: "Child Health",
    icon: "🏥",
    color: "#00838F",
    items: [
      { id: "hlt1", name: "Pediatrician/medical home" },
      { id: "hlt3", name: "Dentist for child" },
      { id: "hlt5", name: "Health insurance for child" }
    ]
  },
  caregiverSupport: {
    title: "Caregiver Support",
    icon: "🤝",
    color: "#2E7D32",
    items: [
      { id: "cg1", name: "Phone info/referral services" },
      { id: "cg3", name: "Home-based individual parenting help" },
      { id: "cg6", name: "Help getting a break/respite care" },
      { id: "cg8", name: "Individual therapy for caregiver" }
    ]
  },
  familyHealth: {
    title: "Family Health",
    icon: "❤️",
    color: "#C62828",
    items: [
      { id: "fh1", name: "Medical doctor for caregiver/family" },
      { id: "fh4", name: "Health insurance for family members" }
    ]
  },
  adultMentalHealth: {
    title: "Adult Mental Health",
    icon: "🧠",
    color: "#6A1B9A",
    items: [
      { id: "mh2", name: "Individual counseling/therapy" }
    ]
  },
  concreteNeeds: {
    title: "Social Services & Concrete Needs",
    icon: "🏠",
    color: "#455A64",
    items: [
      { id: "cn2", name: "SSI/disability assistance" },
      { id: "cn3", name: "Food stamps (SNAP)" },
      { id: "cn5", name: "Food pantry" },
      { id: "cn6", name: "Housing assistance" },
      { id: "cn9", name: "Child care financial assistance" },
      { id: "cn11", name: "Equipment/furniture for child" },
      { id: "cn16", name: "Legal assistance" }
    ]
  }
};

export const NEED_STATUS_TYPES = {
  hasService: { label: "Has", color: "#9E9E9E" },
  wantsHelp: { label: "Wants", color: "#C44536" },
  inProgress: { label: "In Progress", color: "#D4A72C" },
  connected: { label: "Connected", color: "#5B8C5A" }
};
