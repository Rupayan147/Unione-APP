# UNIONE — AI-Assisted Government Benefits Discovery and Utilization

> **Find support. Understand your options. Take the next step.**

UNIONE is a modern mobile AI-assisted platform designed to help individuals and families discover, understand, and navigate government assistance programs across federal, state, and local levels.

---

## 1. Executive Summary

Navigating public assistance in the United States is notoriously complex, fragmented, and overwhelming. **UNIONE** simplifies this journey by acting as a personal, intelligent guide rather than a static database. 

Through guided conversational onboarding, contextual benefit matching, structured AI assistance, and personal case tracking, UNIONE empowers users to discover programs they may qualify for and take actionable steps with confidence.

> [!NOTE]
> **Prototype & Demonstration Notice**: This repository contains the mobile client prototype built using **Expo**, **React Native**, **Expo Router**, and **TypeScript**. Current AI responses, benefit catalogs, and user state run locally via demonstration data services and `@react-native-async-storage/async-storage`.

---

## 2. The Problem

Every year, billions of dollars in government assistance (such as food support, healthcare coverage, housing assistance, and utility relief) go unclaimed because people:
1. **Don't know programs exist**: Information is scattered across dozens of federal, state, county, and local agency websites.
2. **Are confused by eligibility requirements**: Program guidelines use legal jargon and complex income thresholds that make self-assessment difficult.
3. **Don't know what documents are required**: Missing paystubs, IDs, or proof of residency frequently lead to delayed or rejected applications.
4. **Lack personal guidance**: Traditional portals require users to know what they are looking for rather than asking about their situation.

---

## 3. Our Solution

UNIONE replaces static search tables with an **action-oriented personal guide**. The app centers on cognitive ease, emotional positivity, and progressive information disclosure.

```
       [ USER ]
          │
          ▼
┌───────────────────┐
│ Profile Situation │ (State, ZIP, Household, Income, Employment)
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Personalized Home │ (Command Center, Priority Next Step, Match Scores)
└─────────┬─────────┘
          │
    ┌─────┴─────────────────────┐
    ▼                           ▼
┌──────────────┐         ┌──────────────┐
│ Ask Unione   │         │ Discover     │ (Filter by Food, Health, Housing, etc.)
│ (AI Assistant)│        └──────┬───────┘
└──────┬───────┘                │
       └────────────┬───────────┘
                    │
                    ▼
          ┌───────────────────┐
          │  Benefit Details  │ (Why Match, Requirements, Timeline, Agency Link)
          └─────────┬─────────┘
                    │
                    ▼
          ┌───────────────────┐
          │ Application Tracker│ (Step Progress, Action Needed Alerts)
          └───────────────────┘
```

---

## 4. Key Implemented Features

| Feature | Description | Implementation Status |
| :--- | :--- | :--- |
| **Guided Onboarding** | 4-step conversational setup capturing age, location, household size, employment status, and annual income. | **Implemented** (Local State) |
| **Home Command Center** | Personalized dashboard with greeting, context pill (*California • Household of 4*), Ask Unione Hero, Priority Next Step, and Top Recommended Programs. | **Implemented** |
| **Ask Unione (AI Assistant)** | Conversational assistant offering structured responses, suggested questions, **Relevant Benefit Cards**, *"Why this applies"* explanations, and agency source tags. | **Implemented** (Mock AI Engine) |
| **Discover & Search** | Live search bar with instant clear, horizontal category chips (*Food, Healthcare, Housing, Employment, Financial, Utilities*), and dynamic section grouping. | **Implemented** |
| **Benefit Details** | Program breakdown featuring match score assessment (*"98% potential match"*), document checklist, step-by-step application timeline, and official agency website linking. | **Implemented** |
| **Personal Case Tracker** | Status tracking dashboard with progress bars, status badges (*Action Required*, *Under Review*, *Submitted*), and highlighted **Action Needed** alert banners. | **Implemented** |
| **Profile & Settings** | User profile manager with initials avatar, grouped information cards, saved benefit links, and a one-tap **Reset Demo State** option. | **Implemented** (AsyncStorage) |

---

## 5. Technology Stack

### Mobile Client
- **Framework**: [Expo SDK 54](https://expo.dev/) with New Architecture enabled (`newArchEnabled: true`)
- **Core Library**: [React Native 0.81.5](https://reactnative.dev/)
- **Routing Engine**: [Expo Router v6](https://docs.expo.dev/router/introduction/) (File-based typed routing)
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org/)
- **UI Components**: Vanilla React Native `StyleSheet`, Custom Design Tokens, `@expo/vector-icons` (Ionicons)
- **Keyboard Handling**: `react-native-keyboard-controller` & Native `Keyboard` listeners
- **State & Persistence**: React Context API (`UnioneContext.tsx`) + `@react-native-async-storage/async-storage`
- **Compiler**: React Compiler enabled (`babel-plugin-react-compiler`)

---

## 6. Project Structure

```text
d:\Unione\
├── package.json                   # Root monorepo workspace configuration
├── pnpm-workspace.yaml            # PNPM workspace definition
├── README.md                      # Project documentation
└── artifacts/
    └── unione-mobile/             # Expo React Native application package
        ├── app/                   # Expo Router screens & layouts
        │   ├── _layout.tsx        # Root Stack & UnioneProvider wrapper
        │   ├── index.tsx          # Splash, Welcome & Onboarding flow
        │   ├── (tabs)/            # Main bottom tabs group
        │   │   ├── _layout.tsx    # Bottom Tab Navigation layout
        │   │   ├── index.tsx      # Home Command Center screen
        │   │   ├── discover.tsx   # Benefit Discovery & Search screen
        │   │   ├── ask.tsx        # Ask Unione AI Assistant screen
        │   │   ├── applications.tsx # Case Tracker dashboard screen
        │   │   └── profile.tsx    # User Profile & Settings screen
        │   ├── benefit/[id].tsx   # Dynamic Benefit Detail view
        │   └── application/[id].tsx # Dynamic Application Timeline view
        ├── components/            # Reusable UI components & design system
        │   ├── Ui.tsx             # Design tokens, PrimaryButton, StatusPill, MatchBar
        │   ├── BenefitCard.tsx    # Program card component
        │   └── KeyboardAwareScrollViewCompat.tsx
        ├── constants/
        │   └── colors.ts          # Semantic color token definitions
        ├── context/
        │   └── UnioneContext.tsx  # Application global state & storage hydration
        ├── data/
        │   └── mockData.ts        # Demo programs (SNAP, Medicaid, WIC, Lifeline, TANF)
        ├── hooks/
        │   └── useColors.ts       # Color scheme hook
        └── services/
            ├── aiService.ts       # Mock conversational AI logic
            └── benefitService.ts  # Benefit recommendation engine & search
```

---

## 7. Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [PNPM](https://pnpm.io/) package manager (`npm install -g pnpm`)
- [Expo Go](https://expo.dev/go) app installed on a physical iOS or Android phone

### Quick Start Instructions

1. **Clone the repository and install dependencies**:
   ```powershell
   git clone <repository-url>
   cd Unione
   pnpm install
   ```

2. **Run TypeScript verification**:
   ```powershell
   pnpm --filter ./artifacts/unione-mobile run typecheck
   ```

3. **Start the Expo Metro Development Server**:
   ```powershell
   pnpm --filter @workspace/unione-mobile exec expo start -c
   ```

4. **Run on Physical Device**:
   - Open **Expo Go** on your physical iPhone or Android phone.
   - Scan the QR code printed in your terminal.
   - The application bundle will load directly onto your device!

---

## 8. Data & Mock Architecture

- **`UnioneContext.tsx`**: Manages global application state (`profile`, `hasOnboarded`, `chatMessages`, `applications`). Persists state to `@react-native-async-storage/async-storage` under key `'unione-demo-state'`.
- **`mockData.ts`**: Contains realistic demo program profiles for SNAP (CalFresh), Medicaid (Medi-Cal), WIC, Lifeline, Section 8, and TANF.
- **`benefitService.ts`**: Calculates potential match percentages based on household size, income thresholds, and location.
- **`aiService.ts`**: Simulates streaming structured AI guidance tailored to user queries.

---

## 9. Planned / Future Implementation

While the current prototype fully demonstrates the mobile user experience, future production versions will include:

- **Live LLM Integration**: Connecting `askUnione` to a secure serverless LLM backend with retrieval-augmented generation (RAG) over verified federal/state benefit policy databases.
- **Official API Integrations**: Syncing program requirements and real-time status updates with Benefits.gov and state agency APIs.
- **OCR Document Scanner**: On-device camera scanning and document parsing for paystubs, tax forms, and photo IDs.
- **Secure Authentication**: Biometric sign-in (FaceID/Fingerprint) and encrypted local storage for sensitive household data.
- **Push Notifications**: Automated alerts when an application stage updates or additional documentation is requested by an agency.

---

## 10. License

This project is licensed under the MIT License.
