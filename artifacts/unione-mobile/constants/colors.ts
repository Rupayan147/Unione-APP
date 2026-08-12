/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#142331',
    tint: '#087F75',

    background: '#FBFCFA',
    foreground: '#142331',

    card: '#FFFFFF',
    cardForeground: '#142331',

    primary: '#087F75',
    primaryForeground: '#ffffff',

    secondary: '#E8F6F3',
    secondaryForeground: '#087F75',

    muted: '#F1F5F3',
    mutedForeground: '#6B787C',

    accent: '#E8E9FA',
    accentForeground: '#087F75',

    destructive: '#B84A4A',
    destructiveForeground: '#ffffff',

    border: '#DFE9E5',
    input: '#CBD8D4',
    warning: '#D69A4C',
    success: '#087F75',
    navySoft: '#274353',
    teal: '#087F75',
  },

  dark: {
    text: '#142331',
    tint: '#087F75',
    background: '#FBFCFA',
    foreground: '#142331',
    card: '#FFFFFF',
    cardForeground: '#142331',
    primary: '#087F75',
    primaryForeground: '#FFFFFF',
    secondary: '#E8F6F3',
    secondaryForeground: '#087F75',
    muted: '#F1F5F3',
    mutedForeground: '#6B787C',
    accent: '#E8E9FA',
    accentForeground: '#5C61A8',
    destructive: '#B84A4A',
    destructiveForeground: '#FFFFFF',
    border: '#DFE9E5',
    input: '#CBD8D4',
    warning: '#D69A4C',
    success: '#087F75',
    navySoft: '#274353',
    teal: '#087F75',
  },

  radius: 16,
};

export default colors;
