
import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STORAGE_KEY = 'solace_mood_history';

const moodEmojis: Record<string, string> = {
  Happy: '😊',
  Calm: '😌',
  Sad: '😔',
  Anxious: '😰',
  Tired: '😴',
};

type MoodEntry = {
  id: string;
  mood: string;
  date: string;
  dayKey?: string;
};

export default function JournalScreen() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadJournal = async () => {
        try {
          const saved = await AsyncStorage.getItem(STORAGE_KEY);
          const parsed: MoodEntry[] = saved ? JSON.parse(saved) : [];

          if (active) {
            setEntries(parsed);
          }
        } catch (error) {
          console.log('Journal loading error:', error);
        } finally {
          if (active) setLoading(false);
        }
      };

      loadJournal();

      return () => {
        active = false;
      };
    }, [])
  );

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.brand}>solace.</Text>
        <Text style={styles.eyebrow}>YOUR PERSONAL SPACE</Text>
        <Text style={styles.heading}>Your emotional journal.</Text>
        <Text style={styles.description}>
          Every feeling is part of your story. Look back with kindness.
        </Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>YOUR JOURNEY</Text>
          <Text style={styles.summaryNumber}>{entries.length}</Text>
          <Text style={styles.summaryText}>Daily check-ins saved</Text>
        </View>

        <Text style={styles.sectionTitle}>Your recent feelings</Text>

        {loading ? (
          <ActivityIndicator color="#45634E" size="large" />
        ) : entries.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🌱</Text>
            <Text style={styles.emptyTitle}>Your story starts here.</Text>
            <Text style={styles.emptyText}>
              Visit Home and choose how you're feeling today.
              Your check-ins will appear here.
            </Text>
          </View>
        ) : (
          entries
            .slice()
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((entry) => (
              <View key={entry.id} style={styles.entryCard}>
                <View style={styles.emojiCircle}>
                  <Text style={styles.emoji}>
                    {moodEmojis[entry.mood] ?? '💚'}
                  </Text>
                </View>
                <View style={styles.entryContent}>
                  <Text style={styles.entryMood}>
                    Feeling {entry.mood}
                  </Text>
                  <Text style={styles.entryDate}>
                    {formatDate(entry.date)}
                  </Text>
                </View>
                <Text style={styles.heart}>♡</Text>
              </View>
            ))
        )}

        <View style={styles.reminder}>
          <Text style={styles.reminderTitle}>A gentle reminder</Text>
          <Text style={styles.reminderText}>
            You don't need to feel happy every day. Every emotion deserves
            to be heard.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F6EF',
  },
  container: {
    padding: 23,
    paddingBottom: 45,
  },
  brand: {
    fontFamily: 'DMSansBold',
    fontSize: 29,
    color: '#355C49',
    marginBottom: 28,
  },
  eyebrow: {
    fontFamily: 'DMSansBold',
    fontSize: 10,
    letterSpacing: 2,
    color: '#91A08E',
  },
  heading: {
    fontFamily: 'DMSerifDisplay',
    fontSize: 34,
    color: '#304D3D',
    marginTop: 10,
  },
  description: {
    fontFamily: 'DMSansRegular',
    fontSize: 14,
    lineHeight: 23,
    color: '#7C887D',
    marginTop: 9,
    marginBottom: 25,
  },
  summaryCard: {
    backgroundColor: '#E5EDE2',
    padding: 23,
    borderRadius: 23,
    marginBottom: 30,
  },
  summaryLabel: {
    fontFamily: 'DMSansBold',
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#718775',
  },
  summaryNumber: {
    fontFamily: 'DMSerifDisplay',
    fontSize: 48,
    color: '#355744',
    marginTop: 8,
  },
  summaryText: {
    fontFamily: 'DMSansRegular',
    fontSize: 13,
    color: '#718775',
  },
  sectionTitle: {
    fontFamily: 'DMSerifDisplay',
    fontSize: 25,
    color: '#304D3D',
    marginBottom: 17,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 22,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 36,
  },
  emptyTitle: {
    fontFamily: 'DMSansBold',
    fontSize: 16,
    color: '#45634E',
    marginTop: 12,
  },
  emptyText: {
    fontFamily: 'DMSansRegular',
    fontSize: 13,
    lineHeight: 21,
    color: '#899389',
    textAlign: 'center',
    marginTop: 8,
  },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    padding: 15,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: '#EFEEE6',
  },
  emojiCircle: {
    width: 49,
    height: 49,
    borderRadius: 16,
    backgroundColor: '#E8EEE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 26,
  },
  entryContent: {
    flex: 1,
    marginLeft: 14,
  },
  entryMood: {
    fontFamily: 'DMSansBold',
    fontSize: 14,
    color: '#405D48',
  },
  entryDate: {
    fontFamily: 'DMSansRegular',
    fontSize: 11,
    color: '#939C91',
    marginTop: 5,
  },
  heart: {
    fontSize: 25,
    color: '#91A88F',
  },
  reminder: {
    backgroundColor: '#EAE7F2',
    padding: 21,
    borderRadius: 21,
    marginTop: 24,
  },
  reminderTitle: {
    fontFamily: 'DMSerifDisplay',
    fontSize: 22,
    color: '#514A6C',
  },
  reminderText: {
    fontFamily: 'DMSansRegular',
    fontSize: 13,
    lineHeight: 21,
    color: '#817B91',
    marginTop: 8,
  },
});
