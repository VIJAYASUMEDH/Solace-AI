
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const suggestions = [
  'I feel overwhelmed',
  'I need some motivation',
  'Help me relax',
];

export default function CompanionScreen() {
  const [message, setMessage] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.brand}>solace.</Text>
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>YOUR SAFE SPACE</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <View style={styles.companionCircle}>
              <Text style={styles.companionIcon}>✦</Text>
            </View>

            <Text style={styles.eyebrow}>A FRIENDLY SPACE TO TALK</Text>
            <Text style={styles.title}>You don't have to{'\n'}figure it all out.</Text>
            <Text style={styles.description}>
              Take a breath. Share what's on your mind. This is your space,
              without judgment or pressure.
            </Text>
          </View>

          <View style={styles.messageCard}>
            <Text style={styles.messageLabel}>A LITTLE NOTE FOR YOU</Text>
            <Text style={styles.messageTitle}>Hello, there. 💚</Text>
            <Text style={styles.messageText}>
              Whatever you're feeling today, you are welcome here.
              You can start with just one word, if that's all you have.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>What is on your mind?</Text>
          <Text style={styles.sectionDescription}>
            Choose a starting point, or write your own.
          </Text>

          <View style={styles.suggestions}>
            {suggestions.map((item) => (
              <Pressable
                key={item}
                onPress={() => setMessage(item)}
                style={({ pressed }) => [
                  styles.suggestion,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.suggestionText}>{item}</Text>
                <Text style={styles.arrow}>↗</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.inputCard}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Share what's on your mind..."
              placeholderTextColor="#A0A89E"
              multiline
              style={styles.input}
              textAlignVertical="top"
            />
            <View style={styles.inputFooter}>
              <Text style={styles.inputHint}>Your feelings matter. Always.</Text>
              <Pressable
                onPress={() => setMessage('')}
                style={styles.clearButton}
              >
                <Text style={styles.clearText}>Clear</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              Your AI companion is being prepared. Conversation and AI
              responses will be connected in the next development stage.
            </Text>
          </View>

          <Text style={styles.footer}>
            Take your time. There's no rush. 🌿
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F6EF',
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 23,
    paddingTop: 8,
    paddingBottom: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontFamily: 'DMSansBold',
    fontSize: 28,
    color: '#355C49',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5EDE2',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 8,
    gap: 6,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#719477',
  },
  onlineText: {
    fontFamily: 'DMSansBold',
    fontSize: 8,
    letterSpacing: 1,
    color: '#526D58',
  },
  container: {
    padding: 23,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 13,
    paddingBottom: 26,
  },
  companionCircle: {
    width: 83,
    height: 83,
    borderRadius: 30,
    backgroundColor: '#EAE7F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DFD9EC',
  },
  companionIcon: {
    fontSize: 43,
    color: '#83779E',
  },
  eyebrow: {
    fontFamily: 'DMSansBold',
    fontSize: 9,
    letterSpacing: 2,
    color: '#9390A5',
  },
  title: {
    fontFamily: 'DMSerifDisplay',
    fontSize: 37,
    lineHeight: 44,
    color: '#304D3D',
    textAlign: 'center',
    marginTop: 13,
  },
  description: {
    fontFamily: 'DMSansRegular',
    fontSize: 13,
    lineHeight: 22,
    color: '#7C887D',
    textAlign: 'center',
    marginTop: 12,
  },
  messageCard: {
    backgroundColor: '#E5EDE2',
    padding: 21,
    borderRadius: 23,
    marginBottom: 27,
  },
  messageLabel: {
    fontFamily: 'DMSansBold',
    fontSize: 9,
    letterSpacing: 1.5,
    color: '#829382',
  },
  messageTitle: {
    fontFamily: 'DMSerifDisplay',
    fontSize: 25,
    color: '#355744',
    marginTop: 10,
  },
  messageText: {
    fontFamily: 'DMSansRegular',
    fontSize: 13,
    lineHeight: 22,
    color: '#647768',
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: 'DMSerifDisplay',
    fontSize: 25,
    color: '#304D3D',
  },
  sectionDescription: {
    fontFamily: 'DMSansRegular',
    fontSize: 12,
    color: '#899389',
    marginTop: 5,
    marginBottom: 15,
  },
  suggestions: {
    gap: 10,
    marginBottom: 22,
  },
  suggestion: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEEE6',
    padding: 16,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.7,
  },
  suggestionText: {
    fontFamily: 'DMSansMedium',
    fontSize: 13,
    color: '#526B54',
  },
  arrow: {
    color: '#8BA18B',
    fontSize: 18,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#EAE9E0',
    padding: 16,
  },
  input: {
    fontFamily: 'DMSansRegular',
    color: '#405D48',
    fontSize: 14,
    minHeight: 90,
    padding: 0,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  inputHint: {
    fontFamily: 'DMSansRegular',
    fontSize: 10,
    color: '#A0A89E',
  },
  clearButton: {
    padding: 7,
  },
  clearText: {
    fontFamily: 'DMSansBold',
    color: '#718775',
    fontSize: 11,
  },
  notice: {
    backgroundColor: '#EAE7F2',
    padding: 15,
    borderRadius: 16,
    marginTop: 16,
  },
  noticeText: {
    fontFamily: 'DMSansRegular',
    fontSize: 11,
    lineHeight: 18,
    color: '#716A86',
    textAlign: 'center',
  },
  footer: {
    fontFamily: 'DMSansRegular',
    fontSize: 11,
    color: '#9AA395',
    textAlign: 'center',
    marginTop: 25,
  },
});
