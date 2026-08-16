import { getBenefit, type ChatMessage, type Source } from '@/data/mockData';
import { searchBenefits } from './benefitService';

const defaultSource: Source = {
  label: 'U.S. Government Services and Information Portal',
  detail: 'Demo assistance guidance · Verified with federal and state statutory guidelines',
  url: 'https://www.usa.gov/benefits',
};

export async function getRelevantSources(benefitIds: string[]): Promise<Source[]> {
  const sources: Source[] = [];
  for (const id of benefitIds) {
    const benefit = getBenefit(id);
    if (benefit?.source && !sources.some((s) => s.label === benefit.source.label)) {
      sources.push(benefit.source);
    }
  }
  return sources.length > 0 ? sources : [defaultSource];
}

export async function askUnione(message: string): Promise<ChatMessage> {
  const normalized = message.toLowerCase();

  let text =
    'Based on your reported profile signals (household of 4, California resident, and current employment transition), here are high-impact public assistance programs to explore. Eligibility is not guaranteed, but I can guide you through the requirements.';
  let benefitIds = ['wioa-adult-training', 'unemployment', 'snap', 'medicaid'];
  let why = 'Your recent employment change, dependent children, and household income create strong alignment for career retraining and household stability programs.';
  let nextStep = 'Select any program card below to inspect required verification paperwork and timeline steps.';

  if (normalized.includes('job') || normalized.includes('career') || normalized.includes('train') || normalized.includes('apprentice') || normalized.includes('work')) {
    text =
      'For career development and employment support, you have multiple pathways: WIOA Adult Training offers tuition-free career certifications, Registered Apprenticeships let you earn while you learn, and Unemployment Insurance provides temporary wage replacement while you job hunt.';
    benefitIds = ['wioa-adult-training', 'registered-apprenticeship', 'unemployment', 'wioa-dislocated-worker'];
    why = 'Public workforce programs provide direct funding for in-demand credentials, resume coaching, and paid on-the-job training.';
    nextStep = 'Explore the WIOA Career Training and Registered Apprenticeship programs to connect with local workforce centers.';
  } else if (normalized.includes('food') || normalized.includes('snap') || normalized.includes('ebt') || normalized.includes('grocery') || normalized.includes('wic') || normalized.includes('eat')) {
    text =
      'For food and grocery assistance, SNAP (CalFresh) provides monthly reloadable EBT grocery funds. If you have children under 5, WIC provides targeted nutritious foods and formula, while the National School Lunch Program provides free daily breakfast and lunch at school.';
    benefitIds = ['snap', 'wic', 'school-meals', 'summer-ebt'];
    why = 'Food assistance programs scale directly with household size and income to ease monthly grocery expenses.';
    nextStep = 'Review the SNAP and WIC details pages and gather proof of identification and 30 days of income verification.';
  } else if (normalized.includes('health') || normalized.includes('medicaid') || normalized.includes('doctor') || normalized.includes('insurance') || normalized.includes('medical') || normalized.includes('chip')) {
    text =
      'For health coverage, Medicaid (Medi-Cal) provides comprehensive zero-cost medical, dental, and prescription coverage if income is under 138% FPL. For children, CHIP provides low-cost coverage, and Community Health Centers offer sliding-scale fees regardless of insurance.';
    benefitIds = ['medicaid', 'chip', 'aca-marketplace', 'chc-sliding-scale'];
    why = 'Health coverage programs ensure your household has continuous access to primary care, emergency services, and prescriptions.';
    nextStep = 'Review Medicaid eligibility thresholds and check which managed care health plans operate in your county.';
  } else if (normalized.includes('rent') || normalized.includes('house') || normalized.includes('housing') || normalized.includes('evict') || normalized.includes('apartment') || normalized.includes('shelter')) {
    text =
      'For housing support, Emergency Rental Relief provides direct grants for past-due rent and utilities to halt eviction notices. The Housing Choice Voucher (Section 8) caps tenant rental payments at 30% of income, and Weatherization Assistance lowers heating/cooling costs.';
    benefitIds = ['emergency-rental', 'housing', 'public-housing', 'weatherization-housing'];
    why = 'Housing programs prioritize households facing sudden income reduction or rent burden above 30% of income.';
    nextStep = 'If you have an urgent past-due notice, check Emergency Rental Relief first to connect with county eviction prevention.';
  } else if (normalized.includes('college') || normalized.includes('school') || normalized.includes('student') || normalized.includes('pell') || normalized.includes('degree') || normalized.includes('tuition')) {
    text =
      'For education and skills training, the Federal Pell Grant provides up to $7,395/year in tuition aid that does not need to be repaid. Short-Term Credential Aid funds 8-to-15-week career certificates, and Federal Work-Study provides flexible part-time campus jobs.';
    benefitIds = ['pell-grant', 'workforce-short-term-pell', 'federal-work-study', 'trio-eoc'];
    why = 'Higher education grants and workforce certificates open doors to higher-wage career tracks without incurring debt.';
    nextStep = 'File your Free Application for Federal Student Aid (FAFSA®) or connect with a local community college CTE counselor.';
  } else if (normalized.includes('child') || normalized.includes('baby') || normalized.includes('daycare') || normalized.includes('kid') || normalized.includes('family')) {
    text =
      'For families with children, Child Care Subsidies (CCDF) pay licensed daycare and afterschool providers while you work or attend training. The Child Tax Credit provides up to $2,000/child, and Head Start offers free early learning and pediatric screenings for ages 0–5.';
    benefitIds = ['childcare', 'child-tax-credit', 'head-start', 'tanf'];
    why = 'Family support programs are designed to lower the cost of child rearing and early education for working parents.';
    nextStep = 'Contact your local Child Care Resource & Referral (R&R) agency to apply for childcare tuition certificates.';
  } else if (normalized.includes('electric') || normalized.includes('energy') || normalized.includes('gas') || normalized.includes('utility') || normalized.includes('water') || normalized.includes('phone') || normalized.includes('internet') || normalized.includes('wifi')) {
    text =
      'For utility and connectivity support, LIHEAP pays direct credits (up to $1,000+) to your electric and gas providers, Lifeline provides a free smartphone with unlimited talk/text/data, and LIHWAP assists with past-due water and sewer bills.';
    benefitIds = ['utilities', 'lifeline-connectivity', 'lihwap-water', 'solar-for-all'];
    why = 'Energy and communication assistance protects essential household utility services from disconnection.';
    nextStep = 'Gather your most recent electric and gas bills to submit for direct LIHEAP account credit.';
  } else if (normalized.includes('document') || normalized.includes('proof') || normalized.includes('apply') || normalized.includes('paperwork') || normalized.includes('verify')) {
    text =
      'Across most public assistance programs, the foundational verification documents you will need include: (1) Government photo ID, (2) Proof of income (paystubs, tax return, or unemployment statement), (3) Proof of state residency (lease or utility bill), and (4) Social Security numbers for applying family members.';
    benefitIds = ['snap', 'medicaid', 'unemployment'];
    why = 'Preparing these four standard documents in advance speeds up the eligibility determination process significantly.';
    nextStep = 'Create a secure digital folder on your device containing clear photos or PDFs of these key documents.';
  } else {
    // Dynamic search fallback if query contains general keywords
    const matches = await searchBenefits(message);
    if (matches.length > 0) {
      benefitIds = matches.slice(0, 4).map((b) => b.id);
      text = `I found ${matches.length} program${matches.length === 1 ? '' : 's'} matching your question in our demo catalog. Here are the top recommendations tailored to your situation.`;
      why = 'Matched based on program descriptions, eligibility categories, and target assistance areas.';
      nextStep = 'Select any program card below to review specific requirements and timeline steps.';
    }
  }

  const sources = await getRelevantSources(benefitIds);

  return {
    id: `${Date.now()}-assistant`,
    role: 'assistant',
    text,
    sources,
    benefitIds,
    why,
    nextStep,
  };
}