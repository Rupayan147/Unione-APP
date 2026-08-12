export type BenefitCategory =
  | 'Food'
  | 'Healthcare'
  | 'Housing'
  | 'Employment'
  | 'Family'
  | 'Financial'
  | 'Education'
  | 'Utilities';

export interface UserProfile {
  name: string;
  age: string;
  state: string;
  zip: string;
  householdSize: string;
  employment: string;
  income: string;
  children: string;
}

export interface Source {
  label: string;
  detail: string;
  url: string;
}

export interface Benefit {
  id: string;
  name: string;
  fullName: string;
  category: BenefitCategory;
  description: string;
  potentialMatch: number;
  whyRecommended: string[];
  whatItProvides: string;
  requirements: string[];
  applicationSteps: string[];
  source: Source;
}

export interface Application {
  id: string;
  benefitId: string;
  status: 'Action required' | 'Under review' | 'Submitted';
  progress: number;
  nextStep: string;
  timeline: { label: string; status: 'complete' | 'action' | 'pending' }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  sources?: Source[];
  benefitIds?: string[];
  why?: string;
  nextStep?: string;
}

export const demoProfile: UserProfile = {
  name: 'Sarah Johnson',
  age: '32',
  state: 'California',
  zip: '90001',
  householdSize: '4',
  employment: 'Recently unemployed',
  income: '$32,000',
  children: '2',
};

const demoSource: Source = {
  label: 'U.S. Government / State agency',
  detail: 'Last verified: Demo data',
  url: 'https://www.usa.gov/benefits',
};

export const benefits: Benefit[] = [
  {
    id: 'snap',
    name: 'SNAP',
    fullName: 'Supplemental Nutrition Assistance Program',
    category: 'Food',
    description: 'Food assistance for eligible households.',
    potentialMatch: 98,
    whyRecommended: ['Household size', 'Reported income', 'California residence', 'Current employment situation'],
    whatItProvides: 'Monthly support that can help eligible households with grocery expenses and nutritious food.',
    requirements: ['Proof of identity', 'Proof of income', 'Household information', 'Residency information'],
    applicationSteps: ['Check requirements', 'Prepare documents', 'Submit application', 'Wait for determination'],
    source: demoSource,
  },
  {
    id: 'medicaid',
    name: 'Medicaid',
    fullName: 'Medicaid health coverage',
    category: 'Healthcare',
    description: 'Healthcare coverage for eligible individuals and families.',
    potentialMatch: 95,
    whyRecommended: ['Household size', 'Reported income', 'California residence'],
    whatItProvides: 'Health coverage that may include doctor visits, prescriptions, and preventative care.',
    requirements: ['Proof of identity', 'Household information', 'Income information'],
    applicationSteps: ['Check requirements', 'Prepare documents', 'Submit application', 'Wait for determination'],
    source: demoSource,
  },
  {
    id: 'unemployment',
    name: 'Unemployment Insurance',
    fullName: 'Unemployment Insurance benefits',
    category: 'Employment',
    description: 'Temporary financial support for eligible workers.',
    potentialMatch: 93,
    whyRecommended: ['Recently unemployed', 'California residence', 'Reported income'],
    whatItProvides: 'Temporary payments for eligible workers while they look for new employment.',
    requirements: ['Identity information', 'Recent employment history', 'Banking or payment information'],
    applicationSteps: ['Review work history', 'Prepare documents', 'Submit application', 'Wait for determination'],
    source: demoSource,
  },
  {
    id: 'wic',
    name: 'WIC',
    fullName: 'Women, Infants, and Children nutrition support',
    category: 'Family',
    description: 'Nutrition support for eligible women, infants, and children.',
    potentialMatch: 91,
    whyRecommended: ['Children in household', 'Household size', 'Reported income'],
    whatItProvides: 'Nutrition education, healthy foods, and support for eligible families with young children.',
    requirements: ['Household information', 'Income information', 'Proof of residence'],
    applicationSteps: ['Check requirements', 'Find a local office', 'Prepare documents', 'Schedule an appointment'],
    source: demoSource,
  },
  {
    id: 'tanf',
    name: 'TANF',
    fullName: 'Temporary Assistance for Needy Families',
    category: 'Family',
    description: 'Support for families working toward stability.',
    potentialMatch: 89,
    whyRecommended: ['Children in household', 'Reported income', 'Recently unemployed'],
    whatItProvides: 'Cash assistance and supportive services that can help families meet basic needs.',
    requirements: ['Proof of identity', 'Household information', 'Income information'],
    applicationSteps: ['Review requirements', 'Prepare documents', 'Submit application', 'Wait for determination'],
    source: demoSource,
  },
  {
    id: 'housing',
    name: 'Housing Assistance',
    fullName: 'Housing cost assistance programs',
    category: 'Housing',
    description: 'Programs that may help eligible households with housing costs.',
    potentialMatch: 82,
    whyRecommended: ['Household size', 'Reported income', 'California residence'],
    whatItProvides: 'Potential support with rent, temporary housing, or housing stability resources.',
    requirements: ['Proof of residence', 'Income information', 'Household information'],
    applicationSteps: ['Explore local programs', 'Prepare documents', 'Submit application', 'Wait for determination'],
    source: demoSource,
  },
  {
    id: 'childcare',
    name: 'Childcare Assistance',
    fullName: 'Child care payment assistance',
    category: 'Family',
    description: 'Help with eligible child care costs.',
    potentialMatch: 87,
    whyRecommended: ['Children in household', 'Household size', 'Employment situation'],
    whatItProvides: 'Support that may lower child care costs for eligible families.',
    requirements: ['Household information', 'Child information', 'Income information'],
    applicationSteps: ['Check requirements', 'Find a local provider', 'Prepare documents', 'Submit application'],
    source: demoSource,
  },
  {
    id: 'ssi',
    name: 'SSI',
    fullName: 'Supplemental Security Income',
    category: 'Financial',
    description: 'Monthly support for eligible people with limited income and resources.',
    potentialMatch: 52,
    whyRecommended: ['Reported income', 'Household information'],
    whatItProvides: 'Monthly financial support for people who meet specific disability, blindness, or age requirements.',
    requirements: ['Identity information', 'Income and resource information', 'Supporting documentation'],
    applicationSteps: ['Review requirements', 'Gather documentation', 'Submit application', 'Wait for determination'],
    source: demoSource,
  },
  {
    id: 'utilities',
    name: 'Utility Assistance',
    fullName: 'Home energy and utility assistance',
    category: 'Utilities',
    description: 'Support that may help eligible households with energy costs.',
    potentialMatch: 78,
    whyRecommended: ['Reported income', 'Household size', 'California residence'],
    whatItProvides: 'Resources that may reduce energy bills or support utility stability.',
    requirements: ['Utility bill', 'Income information', 'Proof of residence'],
    applicationSteps: ['Find local program', 'Prepare documents', 'Submit application', 'Wait for determination'],
    source: demoSource,
  },
  {
    id: 'eitc',
    name: 'Earned Income Tax Credit',
    fullName: 'Earned Income Tax Credit',
    category: 'Financial',
    description: 'A tax credit that may support eligible working households.',
    potentialMatch: 74,
    whyRecommended: ['Children in household', 'Reported income'],
    whatItProvides: 'A tax credit that may reduce taxes owed or increase a refund for eligible workers.',
    requirements: ['Income information', 'Household information', 'Tax filing information'],
    applicationSteps: ['Review requirements', 'Prepare tax documents', 'File your return', 'Wait for determination'],
    source: demoSource,
  },
];

export const applications: Application[] = [
  {
    id: 'snap-application',
    benefitId: 'snap',
    status: 'Action required',
    progress: 80,
    nextStep: 'Upload proof of income',
    timeline: [
      { label: 'Profile', status: 'complete' },
      { label: 'Eligibility information', status: 'complete' },
      { label: 'Documents', status: 'action' },
      { label: 'Submission', status: 'pending' },
      { label: 'Decision', status: 'pending' },
    ],
  },
  {
    id: 'medicaid-application',
    benefitId: 'medicaid',
    status: 'Under review',
    progress: 60,
    nextStep: 'Wait for a determination',
    timeline: [
      { label: 'Profile', status: 'complete' },
      { label: 'Eligibility information', status: 'complete' },
      { label: 'Documents', status: 'complete' },
      { label: 'Submission', status: 'complete' },
      { label: 'Decision', status: 'pending' },
    ],
  },
  {
    id: 'unemployment-application',
    benefitId: 'unemployment',
    status: 'Submitted',
    progress: 100,
    nextStep: 'Check for updates',
    timeline: [
      { label: 'Profile', status: 'complete' },
      { label: 'Eligibility information', status: 'complete' },
      { label: 'Documents', status: 'complete' },
      { label: 'Submission', status: 'complete' },
      { label: 'Decision', status: 'pending' },
    ],
  },
];

export const categories: BenefitCategory[] = [
  'Food',
  'Healthcare',
  'Housing',
  'Employment',
  'Family',
  'Financial',
  'Education',
  'Utilities',
];

export const getBenefit = (id: string) => benefits.find((benefit) => benefit.id === id);
export const getApplication = (id: string) => applications.find((application) => application.id === id);