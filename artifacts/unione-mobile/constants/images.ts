import { ImageSourcePropType } from 'react-native';
import type { BenefitCategory } from '@/data/mockData';

/**
 * Registry of all local bundled illustration assets for the UNIONE application.
 * All assets are local static bundles for high performance and offline support.
 */
export const APP_IMAGES = {
  // Hero and general discovery
  hero: require('@/assets/images/hero/unione-hero.png'),
  recommendationsHero: require('@/assets/images/hero/recommendations-hero.png'),
  benefitsDiscovery: require('@/assets/images/benefits/benefits-discovery.png'),

  // AI assistant & intelligent document handling
  aiAssistant: require('@/assets/images/ai/ai-assistant.png'),
  documentProcessing: require('@/assets/images/ai/document-processing.png'),

  // Case tracking & guided application steps
  applicationsTracker: require('@/assets/images/benefits/applications-tracker.png'),
  applicationSteps: require('@/assets/images/benefits/application-steps.png'),

  // Benefit category domains
  healthcare: require('@/assets/images/healthcare/healthcare-benefits.png'),
  housing: require('@/assets/images/housing/housing-support.png'),
  food: require('@/assets/images/food/food-assistance.png'),
  education: require('@/assets/images/education/education-support.png'),
} as const;

export type AppImageKey = keyof typeof APP_IMAGES;

/**
 * Returns the corresponding visual illustration asset for a given benefit category.
 */
export function getCategoryVisual(category?: BenefitCategory): ImageSourcePropType {
  switch (category) {
    case 'Healthcare':
      return APP_IMAGES.healthcare;
    case 'Housing':
      return APP_IMAGES.housing;
    case 'Food':
      return APP_IMAGES.food;
    case 'Education':
    case 'Employment':
      return APP_IMAGES.education;
    case 'Family':
    case 'Financial':
    case 'Utilities':
      return APP_IMAGES.recommendationsHero;
    default:
      return APP_IMAGES.benefitsDiscovery;
  }
}
