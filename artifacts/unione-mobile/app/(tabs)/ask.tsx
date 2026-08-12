import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DemoPill, styles as ui } from '@/components/Ui';
import { askUnione } from '@/services/aiService';
import { useUnione } from '@/context/UnioneContext';
import { getBenefit, type ChatMessage } from '@/data/mockData';
import { useColors } from '@/hooks/useColors';

const suggestedPrompts = [
  "I'm recently unemployed. What support should I explore?",
  'I need help with food expenses.',
  'What benefits might my family qualify for?',
  'What documents do I need for SNAP?',
];

export default function AskScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { chatMessages, addChatMessages } = useUnione();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const tabInset = Platform.OS === 'web' ? 68 : 60;

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const send = async (text = message) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    setMessage('');
    setIsSending(true);

    addChatMessages([{ id: `${Date.now()}-user`, role: 'user', text: trimmed }]);
    await new Promise((resolve) => setTimeout(resolve, 500));
    addChatMessages([await askUnione(trimmed)]);
    setIsSending(false);
  };

  const composerBottomPadding = keyboardVisible
    ? Platform.OS === 'ios' ? 8 : 12
    : Math.max(insets.bottom + 8, 16) + tabInset;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, 48) }]}>
        <View style={styles.headerCopy}>
          <View style={styles.headerTagRow}>
            <Text style={[ui.small, { color: colors.teal, letterSpacing: 1.3 }]}>AI ASSISTANT</Text>
            <DemoPill />
          </View>
          <Text style={[ui.h1, { color: colors.foreground, marginTop: 6 }]}>Ask Unione</Text>
          <Text style={[ui.body, { color: colors.mutedForeground, marginTop: 4 }]}>
            Tell me what’s going on. I’ll help you figure out what to explore.
          </Text>
        </View>

        <View style={[styles.aiAvatar, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <View style={[styles.avatarHalo, { backgroundColor: colors.accent }]}>
            <Ionicons name="sparkles" size={24} color={colors.teal} />
          </View>
        </View>
      </View>

      {/* MESSAGES LIST */}
      <FlatList
        data={chatMessages}
        keyExtractor={(item) => item.id}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.chatListContent, { paddingBottom: 20 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <MessageBubble item={item} />}
        ListHeaderComponent={
          chatMessages.length <= 1 ? (
            <View style={styles.suggestedSection}>
              <Text style={[ui.small, { color: colors.mutedForeground, marginBottom: 12 }]}>
                SUGGESTED QUESTIONS
              </Text>
              {suggestedPrompts.map((prompt) => (
                <Pressable
                  key={prompt}
                  onPress={() => send(prompt)}
                  accessibilityRole="button"
                  accessibilityLabel={prompt}
                  style={({ pressed }) => [
                    styles.promptChip,
                    { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.75 : 1 },
                  ]}
                >
                  <Text style={[ui.body, { color: colors.foreground, flex: 1, fontSize: 14 }]}>
                    {prompt}
                  </Text>
                  <View style={[styles.promptArrow, { backgroundColor: colors.secondary }]}>
                    <Ionicons name="arrow-forward" size={14} color={colors.teal} />
                  </View>
                </Pressable>
              ))}
            </View>
          ) : null
        }
        ListFooterComponent={
          isSending ? (
            <View style={[styles.typingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <ActivityIndicator size="small" color={colors.teal} />
              <Text style={[ui.small, { color: colors.mutedForeground }]}>
                Thinking about your situation…
              </Text>
            </View>
          ) : null
        }
      />

      {/* COMPOSER BAR */}
      <View
        style={[
          styles.inputWrap,
          { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: composerBottomPadding },
        ]}
      >
        <View style={[styles.inputShell, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Pressable
            onPress={() => alert('Document upload feature: Select files to help Unione analyze your situation.')}
            accessibilityRole="button"
            accessibilityLabel="Attach document"
            hitSlop={8}
            style={({ pressed }) => [
              styles.attachBtn,
              { backgroundColor: colors.secondary, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name="attach-outline" size={20} color={colors.teal} />
          </Pressable>

          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Tell Unione what you need help with..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            maxLength={500}
            style={[styles.input, { color: colors.foreground }]}
            onSubmitEditing={() => send()}
          />

          <Pressable
            onPress={() => send()}
            accessibilityRole="button"
            accessibilityLabel="Send message"
            disabled={!message.trim() || isSending}
            style={({ pressed }) => [
              styles.sendBtn,
              {
                backgroundColor: message.trim() ? colors.teal : colors.muted,
                opacity: pressed || !message.trim() ? 0.65 : 1,
              },
            ]}
          >
            <Ionicons
              name="arrow-up"
              size={18}
              color={message.trim() ? colors.primaryForeground : colors.mutedForeground}
            />
          </Pressable>
        </View>

        <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>
          Demo knowledge · Eligibility is never guaranteed
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

function MessageBubble({ item }: { item: ChatMessage }) {
  const colors = useColors();
  const isUser = item.role === 'user';

  if (isUser) {
    return (
      <View style={[styles.messageRow, { justifyContent: 'flex-end' }]}>
        <View style={[styles.userBubble, { backgroundColor: colors.teal }]}>
          <Text style={[ui.body, { color: colors.primaryForeground, fontSize: 15, lineHeight: 22 }]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.messageRow}>
      <View style={[styles.assistantBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {/* ASSISTANT HEADER */}
        <View style={styles.assistantLabel}>
          <View style={[styles.tinyAvatar, { backgroundColor: colors.secondary }]}>
            <Ionicons name="sparkles" size={13} color={colors.teal} />
          </View>
          <Text style={[ui.small, { color: colors.teal, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 }]}>
            UNIONE ASSISTANT
          </Text>
        </View>

        {/* MAIN TEXT RESPONSE */}
        <Text style={[ui.body, { color: colors.foreground, fontSize: 15, lineHeight: 23 }]}>
          {item.text}
        </Text>

        {/* RELEVANT BENEFITS CARDS */}
        {item.benefitIds?.length ? (
          <View style={styles.responseSection}>
            <Text style={[ui.small, { color: colors.mutedForeground, fontFamily: 'Inter_700Bold', letterSpacing: 0.8, marginBottom: 8 }]}>
              RECOMMENDED PROGRAMS TO EXPLORE
            </Text>
            {item.benefitIds.map((benefitId) => {
              const benefit = getBenefit(benefitId);
              if (!benefit) return null;
              return (
                <Pressable
                  key={benefit.id}
                  onPress={() => router.push(`/benefit/${benefit.id}` as any)}
                  accessibilityRole="button"
                  accessibilityLabel={`View ${benefit.name}`}
                  style={({ pressed }) => [
                    styles.benefitMini,
                    { backgroundColor: colors.secondary, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <View style={[styles.miniIcon, { backgroundColor: colors.card }]}>
                    <Ionicons name="checkmark-circle-outline" size={18} color={colors.teal} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[ui.small, { color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 13 }]}>
                      {benefit.name}
                    </Text>
                    <Text style={[ui.small, { color: colors.teal, marginTop: 2, fontSize: 11 }]}>
                      {benefit.potentialMatch}% potential match
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
                </Pressable>
              );
            })}
          </View>
        ) : null}

        {/* WHY THIS MAY APPLY */}
        {item.why ? (
          <View style={[styles.infoBlock, { backgroundColor: colors.accent }]}>
            <View style={styles.blockTitleRow}>
              <Ionicons name="information-circle-outline" size={15} color={colors.teal} />
              <Text style={[ui.small, { color: colors.teal, fontFamily: 'Inter_700Bold', letterSpacing: 0.6 }]}>
                WHY THIS MAY APPLY
              </Text>
            </View>
            <Text style={[ui.small, { color: colors.foreground, marginTop: 6, lineHeight: 19 }]}>
              {item.why}
            </Text>
          </View>
        ) : null}

        {/* NEXT STEP GUIDANCE */}
        {item.nextStep ? (
          <View style={[styles.infoBlock, { backgroundColor: colors.secondary }]}>
            <View style={styles.blockTitleRow}>
              <Ionicons name="arrow-forward-circle-outline" size={15} color={colors.teal} />
              <Text style={[ui.small, { color: colors.teal, fontFamily: 'Inter_700Bold', letterSpacing: 0.6 }]}>
                YOUR NEXT STEP
              </Text>
            </View>
            <Text style={[ui.small, { color: colors.foreground, marginTop: 6, lineHeight: 19 }]}>
              {item.nextStep}
            </Text>
          </View>
        ) : null}

        {/* SOURCES */}
        {item.sources?.map((source) => (
          <View key={source.label} style={[styles.sourceBadge, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <Ionicons name="globe-outline" size={14} color={colors.teal} />
            <Text style={[ui.small, { color: colors.foreground, flex: 1, fontSize: 12 }]}>
              {source.label}
            </Text>
            <View style={[styles.officialTag, { backgroundColor: colors.secondary }]}>
              <Text style={[ui.small, { color: colors.teal, fontSize: 10, fontFamily: 'Inter_700Bold' }]}>
                OFFICIAL SOURCE
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerCopy: { flex: 1, paddingRight: 16 },
  headerTagRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 2 },
  aiAvatar: {
    width: 62,
    height: 62,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarHalo: { width: 44, height: 44, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  chatListContent: { paddingHorizontal: 20, paddingTop: 12 },
  suggestedSection: { marginBottom: 16 },
  promptChip: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 52,
  },
  promptArrow: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  messageRow: { flexDirection: 'row', marginVertical: 8 },
  userBubble: {
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    maxWidth: '96%',
    padding: 18,
    borderRadius: 22,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    gap: 14,
  },
  assistantLabel: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tinyAvatar: { width: 26, height: 26, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  responseSection: { marginTop: 4 },
  benefitMini: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  miniIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  infoBlock: { borderRadius: 14, padding: 14 },
  blockTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sourceBadge: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  officialTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  typingCard: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  inputWrap: { borderTopWidth: 1, paddingHorizontal: 16, paddingTop: 12 },
  inputShell: {
    borderWidth: 1,
    borderRadius: 20,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 8,
    gap: 8,
  },
  attachBtn: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  input: {
    flex: 1,
    maxHeight: 100,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  sendBtn: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  disclaimer: { fontFamily: 'Inter_400Regular', fontSize: 11, textAlign: 'center', marginTop: 8 },
});