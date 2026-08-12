import { benefits, getBenefit, type Benefit, type UserProfile } from '@/data/mockData';

export interface BenefitRecommendation {
  benefit: Benefit;
  reason: string;
}

export async function getPersonalizedBenefits(_profile: UserProfile): Promise<BenefitRecommendation[]> {
  return benefits.slice(0, 6).map((benefit) => ({
    benefit,
    reason: 'Based on your household size, location, income, and employment situation.',
  }));
}

export async function getBenefitDetails(id: string): Promise<Benefit | undefined> {
  return getBenefit(id);
}

export async function searchBenefits(query: string, category?: string): Promise<Benefit[]> {
  const normalized = query.trim().toLowerCase();
  return benefits.filter((benefit) => {
    const matchesQuery =
      !normalized ||
      [benefit.name, benefit.fullName, benefit.description, benefit.category]
        .join(' ')
        .toLowerCase()
        .includes(normalized);
    return matchesQuery && (!category || benefit.category === category);
  });
}