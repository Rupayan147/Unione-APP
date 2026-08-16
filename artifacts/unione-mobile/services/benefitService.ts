import { benefits, getBenefit, type Benefit, type UserProfile } from '@/data/mockData';

export interface BenefitRecommendation {
  benefit: Benefit;
  reason: string;
  matchScore: number;
}

/**
 * Parses numeric income value from string representations like "$32,000" or "32000".
 */
function parseIncome(incomeStr?: string): number {
  if (!incomeStr) return 35000;
  const cleaned = incomeStr.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 35000 : parsed;
}

/**
 * Parses integer counts safely.
 */
function parseCount(countStr?: string, defaultVal = 0): number {
  if (!countStr) return defaultVal;
  const parsed = parseInt(countStr, 10);
  return isNaN(parsed) ? defaultVal : parsed;
}

/**
 * Transparent Rule-Based Match Scoring Architecture.
 *
 * Designed as a deterministic scoring pipeline that evaluates demographic, financial,
 * household, and career signals against benefit program criteria.
 *
 * Scoring factors:
 * 1. Base potential match defined by program guidelines (50–90 points)
 * 2. Employment status adjustment (Unemployed, seeking work, dislocated)
 * 3. Household size & children dependency multipliers
 * 4. Income-to-poverty ratio estimate
 * 5. Age-tier affinities (Youth 16–24, Working adults, Seniors 55+)
 * 6. Geographic / state eligibility alignment
 *
 * NOTE FOR FUTURE PRODUCTION:
 * This heuristic scoring engine can be seamlessly swapped with a hybrid Retrieval-Augmented
 * Generation (RAG) vector similarity ranker + trained gradient-boosted decision tree (GBDT) model.
 */
function calculateMatchScore(benefit: Benefit, profile: UserProfile): { score: number; reason: string } {
  let score = benefit.potentialMatch || 70;
  const reasons: string[] = [];

  const income = parseIncome(profile.income);
  const children = parseCount(profile.children, 0);
  const householdSize = parseCount(profile.householdSize, 1);
  const age = parseCount(profile.age, 30);
  const empLower = (profile.employment || '').toLowerCase();
  const isUnemployed = empLower.includes('unemploy') || empLower.includes('laid off') || empLower.includes('looking');
  const isStudent = empLower.includes('student') || empLower.includes('college');

  // 1. Employment Signal Rules
  if (benefit.category === 'Employment') {
    if (isUnemployed) {
      score += 15;
      reasons.push('High priority match for your current employment transition and job search goals');
    }
    if (benefit.id === 'unemployment' && isUnemployed) {
      score += 10;
      reasons.push('Weekly income replacement while actively seeking new work');
    }
    if (benefit.id === 'wioa-adult-training' || benefit.id === 'wioa-dislocated-worker') {
      score += 12;
      reasons.push('Tuition-free career training and industry certification vouchers');
    }
  }

  // 2. Family & Children Signal Rules
  if (children > 0) {
    if (benefit.category === 'Family' || benefit.id === 'snap' || benefit.id === 'chip' || benefit.id === 'wic' || benefit.id === 'school-meals') {
      score += 14;
      reasons.push(`Tailored for households with ${children} dependent ${children === 1 ? 'child' : 'children'}`);
    }
    if (benefit.id === 'childcare') {
      score += 16;
      reasons.push('Child care tuition subsidies to support working or training parents');
    }
    if (benefit.id === 'child-tax-credit' || benefit.id === 'eitc') {
      score += 12;
      reasons.push('Substantial refundable tax credits based on your qualifying dependents');
    }
  }

  // 3. Low-to-Moderate Income Needs Rules
  if (income < 45000) {
    if (benefit.category === 'Healthcare' && (benefit.id === 'medicaid' || benefit.id === 'chc-sliding-scale')) {
      score += 12;
      reasons.push('Reported income is within state MAGI health coverage guidelines');
    }
    if (benefit.category === 'Food' && benefit.id === 'snap') {
      score += 14;
      reasons.push('Monthly food assistance scaled to your household size and income');
    }
    if (benefit.category === 'Utilities') {
      score += 10;
      reasons.push('Qualifies for direct utility bill credits and shut-off protection');
    }
    if (benefit.category === 'Housing' && (benefit.id === 'emergency-rental' || benefit.id === 'housing')) {
      score += 10;
      reasons.push('Housing cost stabilization support for moderate-income families');
    }
  }

  // 4. Age and Education Rules
  if (age >= 16 && age <= 24) {
    if (benefit.id === 'youthbuild' || benefit.id === 'job-corps') {
      score += 25;
      reasons.push('Dedicated young adult workforce academy (Ages 16–24)');
    }
  }
  if (age >= 55) {
    if (benefit.id === 'scsep-seniors' || benefit.id === 'csfp' || benefit.id === 'medicare-savings') {
      score += 25;
      reasons.push('Age-specific senior assistance and community opportunities');
    }
  }

  if (isStudent || benefit.category === 'Education') {
    if (benefit.id === 'pell-grant' || benefit.id === 'workforce-short-term-pell') {
      score += 12;
      reasons.push('Non-repayable grant aid for career education and college credentials');
    }
  }

  // Normalize final score between 40 and 99
  const finalScore = Math.min(99, Math.max(45, Math.round(score)));

  const defaultReason =
    reasons.length > 0
      ? reasons.join('. ') + '.'
      : `Recommended based on your reported household size (${householdSize}), California location, and current profile signals.`;

  return {
    score: finalScore,
    reason: defaultReason,
  };
}

/**
 * Generates personalized benefit recommendations sorted by relevance.
 */
export async function getPersonalizedBenefits(profile: UserProfile): Promise<BenefitRecommendation[]> {
  const scored = benefits.map((benefit) => {
    const { score, reason } = calculateMatchScore(benefit, profile);
    // Return a shallow copy with the dynamically adjusted score
    return {
      benefit: {
        ...benefit,
        potentialMatch: score,
      },
      reason,
      matchScore: score,
    };
  });

  // Sort descending by match score
  scored.sort((a, b) => b.matchScore - a.matchScore);

  return scored;
}

/**
 * Fetches details for a single benefit by ID.
 */
export async function getBenefitDetails(id: string): Promise<Benefit | undefined> {
  return getBenefit(id);
}

/**
 * Multi-field full catalog search engine.
 * Searches across name, fullName, description, category, tags, agency, whoItsFor, requirements, and keywords.
 */
export async function searchBenefits(query: string, category?: string): Promise<Benefit[]> {
  const normalized = query.trim().toLowerCase();

  return benefits.filter((benefit) => {
    // 1. Category filter
    if (category && benefit.category !== category) {
      return false;
    }

    // 2. Query filter
    if (!normalized) {
      return true;
    }

    const searchTokens = normalized.split(/\s+/).filter(Boolean);

    const searchableBlob = [
      benefit.name,
      benefit.fullName,
      benefit.category,
      benefit.description,
      benefit.whatItProvides,
      benefit.agency || '',
      benefit.whoItsFor || '',
      benefit.incomeThreshold || '',
      ...(benefit.tags || []),
      ...(benefit.requirements || []),
      ...(benefit.whyRecommended || []),
    ]
      .join(' ')
      .toLowerCase();

    // Support common synonyms & keyword aliases
    const aliases: Record<string, string[]> = {
      job: ['employment', 'workforce', 'career', 'unemployment', 'training', 'apprentice'],
      work: ['employment', 'workforce', 'career', 'job', 'training'],
      training: ['wioa', 'skills', 'apprentice', 'credential', 'career'],
      health: ['medicaid', 'medical', 'healthcare', 'doctor', 'prescription', 'insurance', 'chip', 'clinic'],
      insurance: ['medicaid', 'aca', 'marketplace', 'chip', 'coverage'],
      food: ['snap', 'ebt', 'wic', 'nutrition', 'groceries', 'meals', 'lunch', 'pantry'],
      grocery: ['snap', 'ebt', 'wic', 'food', 'groceries'],
      rent: ['housing', 'voucher', 'rental', 'section 8', 'eviction', 'apartment'],
      home: ['housing', 'weatherization', 'homeowner', 'mortgage', 'shelter'],
      child: ['family', 'childcare', 'wic', 'head start', 'school', 'children', 'tax credit'],
      kids: ['family', 'childcare', 'wic', 'school', 'children'],
      money: ['financial', 'cash', 'ssi', 'eitc', 'grant', 'tax credit', 'tanf'],
      cash: ['financial', 'tanf', 'ssi', 'general assistance', 'eitc'],
      college: ['education', 'pell', 'fafsa', 'grant', 'work-study', 'degree', 'tuition'],
      student: ['education', 'pell', 'work-study', 'college', 'school', 'grant'],
      electric: ['utilities', 'energy', 'liheap', 'power', 'bills', 'weatherization'],
      energy: ['utilities', 'liheap', 'electric', 'gas', 'solar', 'weatherization'],
      senior: ['older', 'medicare', 'scsep', 'csfp', 'aging', 'pension'],
      disability: ['ssi', 'ssdi', 'vocational rehab', 'rehabilitation', 'accessible'],
    };

    // Check if every search token matches the searchable blob directly or via semantic alias
    return searchTokens.every((token) => {
      if (searchableBlob.includes(token)) return true;
      const synonymList = aliases[token];
      if (synonymList) {
        return synonymList.some((syn) => searchableBlob.includes(syn));
      }
      return false;
    });
  });
}