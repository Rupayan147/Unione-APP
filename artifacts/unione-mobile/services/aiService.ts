import { benefits, type ChatMessage, type Source } from '@/data/mockData';

export async function getRelevantSources(_message: string): Promise<Source[]> {
  return [benefits[0].source];
}

export async function askUnione(message: string): Promise<ChatMessage> {
  const normalized = message.toLowerCase();
  let text =
    'Based on the information in your profile, you may want to explore SNAP, Unemployment Insurance, and Childcare Assistance. Eligibility is not guaranteed, but I can help you understand the next step for each program.';
  let benefitIds = ['snap', 'unemployment', 'childcare'];
  let why = 'Your household size, reported income, California residence, and recent employment change are the main signals behind these suggestions.';
  let nextStep = 'Open a program to review the general requirements and prepare a short list of documents.';

  if (normalized.includes('document') || normalized.includes('proof')) {
    text =
      'For the programs in your recommendations, you may want to gather proof of identity, household information, income information, and proof of California residence. Requirements can vary by program, so check the official source before applying.';
    benefitIds = ['snap', 'medicaid'];
    why = 'Most benefit applications start with a clear picture of identity, household, income, and residence.';
    nextStep = 'Start with the documents you already have, then confirm the current list with the official program source.';
  } else if (normalized.includes('snap') || normalized.includes('food')) {
    text =
      'SNAP may help with grocery expenses for eligible households. It appeared in your recommendations because of your household size, reported income, California residence, and current employment situation. A potential match is not a final eligibility decision.';
    benefitIds = ['snap'];
    why = 'SNAP is connected to the household and income details in your demo profile.';
    nextStep = 'Review the SNAP details page and note the identity, income, household, and residency information you may need.';
  } else if (normalized.includes('job') || normalized.includes('unemploy')) {
    text =
      'Since you recently lost your job, Unemployment Insurance may be worth exploring if you meet the program requirements. SNAP and Childcare Assistance may also be useful areas to review while you look for your next role.';
    benefitIds = ['unemployment', 'snap', 'childcare'];
    why = 'A recent employment change can affect both short-term income support and household assistance options.';
    nextStep = 'Review Unemployment Insurance first, then explore food and childcare support while you look for your next role.';
  }

  return {
    id: `${Date.now()}-assistant`,
    role: 'assistant',
    text,
    sources: await getRelevantSources(message),
    benefitIds,
    why,
    nextStep,
  };
}