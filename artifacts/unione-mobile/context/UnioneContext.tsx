import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { applications as demoApplications, demoProfile, type Application, type ChatMessage, type UserProfile } from '@/data/mockData';

export interface ApplicationReviewRecord {
  applicationId: string;
  signedName: string;
  signedAt: string;
  reference: string;
  authorized: true;
}

interface UnioneContextValue {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  hasOnboarded: boolean;
  completeOnboarding: (profile: UserProfile) => void;
  applications: Application[];
  chatMessages: ChatMessage[];
  addChatMessages: (messages: ChatMessage[]) => void;
  reviewRecords: Record<string, ApplicationReviewRecord>;
  recordApplicationReview: (applicationId: string, signedName: string) => ApplicationReviewRecord;
  isHydrating: boolean;
  resetDemoState: () => void;
}

const STORAGE_KEY = 'unione-demo-state';
const UnioneContext = createContext<UnioneContextValue | null>(null);

export function UnioneProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(demoProfile);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [applications] = useState<Application[]>(demoApplications);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Welcome to Ask Unione. I can help you understand your potential matches, documents, and next steps. I use demo knowledge in this prototype, so eligibility is never guaranteed.',
    },
  ]);
  const [reviewRecords, setReviewRecords] = useState<Record<string, ApplicationReviewRecord>>({});
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    console.log('[UNIONE DEBUG] Reading state from AsyncStorage key:', STORAGE_KEY);
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) {
          console.log('[UNIONE DEBUG] No persisted state found. Defaulting hasOnboarded=false');
          return;
        }
        const saved = JSON.parse(raw) as Partial<{ profile: UserProfile; hasOnboarded: boolean; chatMessages: ChatMessage[]; reviewRecords: Record<string, ApplicationReviewRecord> }>;
        console.log('[UNIONE DEBUG] Persisted state loaded:', saved);
        if (saved.profile) setProfileState(saved.profile);
        if (saved.hasOnboarded) setHasOnboarded(true);
        if (saved.chatMessages?.length) setChatMessages(saved.chatMessages);
        if (saved.reviewRecords) setReviewRecords(saved.reviewRecords);
      })
      .catch((err) => console.log('[UNIONE DEBUG] Storage load error:', err))
      .finally(() => {
        console.log('[UNIONE DEBUG] Storage hydration complete.');
        setIsHydrating(false);
      });
  }, []);

  const persist = (nextProfile: UserProfile, nextHasOnboarded: boolean, nextChat: ChatMessage[], nextReviews = reviewRecords) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ profile: nextProfile, hasOnboarded: nextHasOnboarded, chatMessages: nextChat, reviewRecords: nextReviews })).catch(() => undefined);
  };

  const setProfile = (nextProfile: UserProfile) => {
    setProfileState(nextProfile);
    persist(nextProfile, hasOnboarded, chatMessages);
  };

  const completeOnboarding = (nextProfile: UserProfile) => {
    console.log('[UNIONE DEBUG] Completing onboarding for user:', nextProfile.name);
    setProfileState(nextProfile);
    setHasOnboarded(true);
    persist(nextProfile, true, chatMessages);
  };

  const resetDemoState = () => {
    console.log('[UNIONE DEBUG] Resetting demo state');
    setProfileState(demoProfile);
    setHasOnboarded(false);
    setReviewRecords({});
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => undefined);
  };

  const addChatMessages = (messages: ChatMessage[]) => {
    setChatMessages((current) => {
      const next = [...current, ...messages];
      persist(profile, hasOnboarded, next);
      return next;
    });
  };

  const recordApplicationReview = (applicationId: string, signedName: string) => {
    const record: ApplicationReviewRecord = {
      applicationId,
      signedName: signedName.trim(),
      signedAt: new Date().toISOString(),
      reference: `UNI-${applicationId.toUpperCase().replace(/[^A-Z0-9]/g, '-').slice(0, 18)}`,
      authorized: true,
    };
    setReviewRecords((current) => {
      const next = { ...current, [applicationId]: record };
      persist(profile, hasOnboarded, chatMessages, next);
      return next;
    });
    return record;
  };

  const value = useMemo(
    () => ({ profile, setProfile, hasOnboarded, completeOnboarding, applications, chatMessages, addChatMessages, reviewRecords, recordApplicationReview, isHydrating, resetDemoState }),
    [profile, hasOnboarded, applications, chatMessages, reviewRecords, isHydrating],
  );

  return <UnioneContext.Provider value={value}>{children}</UnioneContext.Provider>;
}

export function useUnione() {
  const context = useContext(UnioneContext);
  if (!context) throw new Error('useUnione must be used within UnioneProvider');
  return context;
}
