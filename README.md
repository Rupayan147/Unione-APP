# UNIONE

**AI-Assisted Government Benefits Discovery & Access Platform**

UNIONE is a React Native mobile prototype that helps people discover, understand, prepare for, review, and track potentially relevant government benefit programs through a human-centered experience.

> **Current prototype:** bundled benefit information, local rule-based recommendations, deterministic Ask UNIONE guidance, local demo state, and simulated application workflows.
>
> **Planned production architecture:** secure backend services, verified live data sources, production authentication, institutional integrations, and retrieval-augmented AI. These capabilities are not live in the current repository.

## Overview

Public-benefit programs are distributed across agencies and portals, often with different eligibility language, evidence requirements, and processes. UNIONE explores how a single mobile experience could make those systems easier to navigate without making eligibility decisions or submitting information on a user's behalf.

## Core user journey

```text
Discover -> Understand -> Prepare / Apply -> Review & Attest -> Track
```

- **Discover:** search a structured catalog and view potential matches.
- **Understand:** review program descriptions, requirements, sources, and match reasoning.
- **Prepare:** organize profile information, documents, and next steps.
- **Review & Attest:** inspect mapped information and explicitly authorize the next action.
- **Track:** follow illustrative application stages and action items.

## Prototype features

- Onboarding and locally persisted demo profile
- Structured catalog of 70 benefit programs across eight categories
- Transparent, rule-based recommendation scoring
- Benefit search, category filters, and detailed program pages
- Deterministic Ask UNIONE guidance using the bundled catalog
- Demo application preparation and progress tracking
- Review & Attest flow with mapping review, integrity checks, attestations, and local signature records
- Human-in-the-loop safety: AI suggests, the user reviews, and the user authorizes
- Trust & Security, Policy Insights, and Institutional Impact information screens
- Responsive layouts for common Android phone widths and accessibility font scaling
- Bundled local illustrations and app assets

## Product areas

| Area | Purpose |
| --- | --- |
| Home | Personalized next steps, recommendations, journey progress, and quick actions |
| Discover | Search and browse the benefit catalog |
| Ask | Prototype conversational guidance backed by local rules and catalog content |
| Applications | Demo preparation status, timelines, and required actions |
| Profile | User context, preferences, and links to trust and institutional concepts |
| Benefit details | Program requirements, potential-match reasoning, and official source links |
| Review & Attest | User-controlled mapping review, confirmation, and authorization |
| Policy Insights | Illustrative, privacy-preserving institutional insight concepts |

## Technology stack

| Layer | Repository version / implementation |
| --- | --- |
| Mobile framework | Expo SDK 54 (`expo ~54.0.27`) |
| Native runtime | React Native `0.81.5` |
| UI | React `19.1.0`, React Native `StyleSheet`, Expo Vector Icons |
| Navigation | Expo Router `~6.0.17` |
| Language | TypeScript `~5.9.2` in the mobile package |
| Local persistence | React Context and AsyncStorage `2.2.0` |
| Workspace | pnpm workspaces, pinned to pnpm `11.21.0` |

## Architecture

### Current prototype

```text
Expo / React Native Mobile Application
                  |
                  v
       React Context + AsyncStorage
                  |
                  v
      Structured Demo Benefit Catalog
                  |
                  v
 Rule-Based Recommendations + Local Ask Logic
                  |
                  v
   Demo Preparation, Review, and Tracking UI
```

The mobile demo does not require the API server, a database, localhost, API keys, or environment variables.

### Planned production architecture

```text
Mobile App
    |
    v
Secure API Backend + Authentication
    |
    v
Encrypted PostgreSQL / Document Storage
    |
    v
Recommendation and Validation Services
    |
    v
RAG / Vector Search Layer
    |
    v
Verified Government and Institutional Sources
```

All components in this second diagram are planned production concepts, not claims about the current deployment.

## Responsible assistance and human review

UNIONE is designed around three steps:

```text
AI SUGGESTS -> USER REVIEWS -> USER AUTHORIZES
```

The current prototype never submits a government application. Potential-match scores are informational, users must review critical values, and the final action remains with the user and the official agency process.

## Project structure

```text
Unione-APP/
|-- artifacts/
|   |-- unione-mobile/       # Expo Router mobile application
|   |-- api-server/          # Optional backend workspace; not used by the mobile demo
|   `-- mockup-sandbox/      # Supporting web mockup workspace
|-- lib/
|   |-- api-client-react/    # Shared API client package
|   |-- api-spec/            # API specification tooling
|   |-- api-zod/             # Shared schemas
|   `-- db/                  # Optional PostgreSQL/Drizzle package
|-- scripts/                 # Workspace utilities
|-- package.json
|-- pnpm-workspace.yaml
|-- pnpm-lock.yaml
`-- README.md
```

## New-PC setup

For a complete Windows walkthrough—including prerequisites, Corepack, Expo Go, and troubleshooting—see [SETUP_NEW_PC.txt](./SETUP_NEW_PC.txt).

Quick setup from the repository root:

```powershell
corepack enable
corepack prepare pnpm@11.21.0 --activate
pnpm install
pnpm run typecheck
```

Recommended Node.js version: **22.18.0**. The repository accepts Node `>=20.19.4 <23` because React Native 0.81.5 requires Node 20.19.4 or newer.

## Run the mobile app

```powershell
cd artifacts\unione-mobile
npx expo start
```

Install Expo Go on a physical phone, keep the phone and PC on the same compatible network, and scan the QR code. Android Studio is not required for Expo Go testing. If LAN discovery is blocked, retry with:

```powershell
npx expo start --tunnel
```

Tunnel mode can be slower than LAN mode.

> The package's `pnpm run dev` command is configured for its Replit environment. Use `npx expo start` for ordinary local Windows development.

## Type checking

Run the workspace-wide validation from the repository root:

```powershell
pnpm run typecheck
```

This checks shared TypeScript projects and every artifact that defines a `typecheck` script.

## Optional Android APK build

The checked-in `eas.json` includes a `preview` profile with internal distribution. After installing EAS CLI and signing in to an Expo account that has access to the configured EAS project:

```powershell
npm install --global eas-cli
eas login
eas build --platform android --profile preview
```

The preview profile produces an internally distributed Android APK. Expo Go remains the normal development and demo workflow; EAS is only needed for a standalone build.

## Prototype disclaimer

UNIONE is a demonstration project, not an official government service. Benefit information, recommendation scores, application records, signatures, and Policy Insights may be bundled, simulated, or illustrative. They are not eligibility determinations, legal advice, live government analytics, or proof of agency submission.

Always review current requirements with the relevant official agency before applying.

## Roadmap

- Verified and versioned government-source ingestion
- Secure production identity, consent, audit, and data-retention controls
- Production backend and institutional integration layer
- Retrieval-augmented assistance with source-quality evaluation
- Document readiness and validation workflows
- Accessibility, localization, and broader device testing

## Development notes

- Use pnpm from the repository root; do not create npm or Yarn lockfiles.
- Keep `pnpm-lock.yaml` committed and synchronized with dependency changes.
- The current mobile demo does not require the optional API server or PostgreSQL package.
- Do not commit secrets or local `.env` files.
- Run `pnpm run typecheck` before sharing changes.
