import { healthcareBenefits } from './benefits/healthcare';
import { employmentBenefits } from './benefits/employment';
import { foodBenefits } from './benefits/food';
import { housingBenefits } from './benefits/housing';
import { educationBenefits } from './benefits/education';
import { familyBenefits } from './benefits/family';
import { financialBenefits } from './benefits/financial';
import { utilitiesBenefits } from './benefits/utilities';

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

  // Rich metadata for realistic demo and future RAG pipeline
  agency?: string;
  targetGroup?: string;
  whoItsFor?: string;
  estimatedProcessingTime?: string;
  incomeThreshold?: string;
  tags?: string[];
}

export interface Application {
  id: string;
  benefitId: string;
  status: 'Action required' | 'Preparing' | 'Review complete';
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

/**
 * Aggregated master catalog of 70 realistic government assistance programs.
 * Sourced modularly across all 8 essential categories.
 */
export const benefits: Benefit[] = [
  ...healthcareBenefits,
  ...employmentBenefits,
  ...foodBenefits,
  ...housingBenefits,
  ...educationBenefits,
  ...familyBenefits,
  ...financialBenefits,
  ...utilitiesBenefits,
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
    status: 'Preparing',
    progress: 60,
    nextStep: 'Review mapped application information',
    timeline: [
      { label: 'Profile', status: 'complete' },
      { label: 'Eligibility information', status: 'complete' },
      { label: 'Documents', status: 'complete' },
      { label: 'Review & Attest', status: 'action' },
      { label: 'Official application', status: 'pending' },
    ],
  },
  {
    id: 'unemployment-application',
    benefitId: 'unemployment',
    status: 'Review complete',
    progress: 90,
    nextStep: 'Continue to the official application',
    timeline: [
      { label: 'Profile', status: 'complete' },
      { label: 'Eligibility information', status: 'complete' },
      { label: 'Documents', status: 'complete' },
      { label: 'Review & Attest', status: 'complete' },
      { label: 'Official application', status: 'action' },
    ],
  },
];

export const categories: BenefitCategory[] = [
  'Employment',
  'Healthcare',
  'Food',
  'Housing',
  'Family',
  'Education',
  'Financial',
  'Utilities',
];

export const getBenefit = (id: string) => benefits.find((benefit) => benefit.id === id);
export const getApplication = (id: string) => applications.find((application) => application.id === id);
