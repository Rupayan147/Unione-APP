---
name: Expo symbol typing
description: Expo SDK 54 strictly types dynamic SF Symbol names in SymbolView.
---

When classic tab fallbacks need dynamic icons, use the existing vector icon set rather than passing arbitrary strings into `SymbolView`.

**Why:** Expo SDK 54's `SymbolView` accepts a strict SF Symbols union, so dynamic Feather icon names do not type-check even when the platform branch would only run on iOS.

**How to apply:** Reserve `SymbolView` for literal, known SF Symbol names; use Feather or another Expo-provided icon set for dynamic tab icon helpers.