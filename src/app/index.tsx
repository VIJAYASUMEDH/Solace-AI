import React, { useEffect, useRef, useState } from 'react';

import {
  Animated,
  Easing,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const SOLACE_API_URL = 'http://172.30.107.137:3000/api/chat';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type MoodEntry = {
  id: string;
  mood: string;
  date: string;
  dayKey: string;
};

const STORAGE_KEY = 'solace_mood_history';
const MEMORY_STORAGE_KEY = 'solace_user_memory';
type JournalEntry = {
  id: string;
  text: string;
  date: string;
};

const JOURNAL_STORAGE_KEY = 'solace_journal_entries';

type UserMemory = {
  name: string;
  communicationStyle: string;
  preferences: string[];
};

const COLORS = {
  background: '#F8F6F0',
  card: '#FFFFFF',
  sage: '#78947D',
  darkSage: '#526F59',
  lightSage: '#E8EFE7',
  lavender: '#EAE5F3',
  darkLavender: '#82749B',
  text: '#343A34',
  muted: '#899087',
  border: '#EAE9E1',
  peach: '#F4E7DD',
};

const moods = [
  { name: 'Happy', emoji: '😊', color: '#F8E9C9' },
  { name: 'Calm', emoji: '😌', color: '#DFEDE2' },
  { name: 'Sad', emoji: '😔', color: '#E6E5F3' },
  { name: 'Anxious', emoji: '😟', color: '#F2E3DD' },
  { name: 'Tired', emoji: '😴', color: '#E8E4EF' },
];

const getTodayKey = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getPreviousDayKey = (dayKey: string) => {
  const date = new Date(`${dayKey}T12:00:00`);
  date.setDate(date.getDate() - 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const calculateStreak = (history: MoodEntry[]) => {
  const days = new Set(history.map(entry => entry.dayKey));
  const today = getTodayKey();

  let currentDay = days.has(today)
    ? today
    : getPreviousDayKey(today);

  let streak = 0;

  while (days.has(currentDay)) {
    streak++;
    currentDay = getPreviousDayKey(currentDay);
  }

  return streak;
};

const getMoodEmoji = (mood: string) => {
  return moods.find(item => item.name === mood)?.emoji || '🌿';
};

const getMoodMessage = (mood: string) => {
  switch (mood) {
    case 'Happy':
      return 'Hold on to this beautiful feeling. You deserve these moments of joy.';
    case 'Calm':
      return 'Enjoy this peaceful moment. Give yourself permission to slow down.';
    case 'Sad':
      return 'It is okay not to feel okay. Be gentle with yourself today.';
    case 'Anxious':
      return 'Take one breath at a time. You do not have to figure everything out right now.';
    case 'Tired':
      return 'Rest is productive too. You deserve a moment to recharge.';
    default:
      return 'Thank you for checking in with yourself today.';
  }
};

const getFormattedDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
};

export default function HomeScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
const [journalInput, setJournalInput] = useState('');
const [journalMessage, setJournalMessage] = useState('');

const [userMemory, setUserMemory] = useState<UserMemory>({
  name: '',
  communicationStyle: '',
  preferences: [],
});

const [memoryStatus, setMemoryStatus] = useState('');
const [memoryLoaded, setMemoryLoaded] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
  {
    role: 'assistant',
    content: "Hello! 🌿 I'm Solace, your wellness companion. How are you feeling today?",
  },
]);

const [chatHistoryLoaded, setChatHistoryLoaded] = useState(false);

const [chatInput, setChatInput] = useState('');
const [chatLoading, setChatLoading] = useState(false);
const [chatError, setChatError] = useState('');
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [breathing, setBreathing] = useState(false);
  const [breathSeconds, setBreathSeconds] = useState(60);
  const [breathPhase, setBreathPhase] = useState('Ready');

  const totalElapsed = useRef(0);
  const breathScale = useRef(new Animated.Value(1)).current;

  // Load saved mood history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);

        if (stored) {
          const parsed: MoodEntry[] = JSON.parse(stored);

          const normalized = parsed.map(entry => ({
            ...entry,
            dayKey: entry.dayKey || entry.date.slice(0, 10),
          }));

          // Keep only one entry per calendar day.
          const uniqueEntries = Array.from(
            new Map(
              normalized.map(entry => [entry.dayKey, entry])
            ).values()
          );

          setMoodHistory(uniqueEntries);

          const todayEntry = uniqueEntries.find(
            entry => entry.dayKey === getTodayKey()
          );

          if (todayEntry) {
            setSelectedMood(todayEntry.mood);
          }
        }
      } catch (error) {
        console.log('Could not load mood history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  // Load saved personal journal entries
  useEffect(() => {
    const loadJournalEntries = async () => {
      try {
        const savedEntries = await AsyncStorage.getItem(JOURNAL_STORAGE_KEY);

        if (savedEntries) {
          setJournalEntries(JSON.parse(savedEntries));
        }
      } catch (error) {
        console.log('Error loading journal entries:', error);
      }
    };

    loadJournalEntries();
  }, []);

  // Save or update today's mood
  const handleMoodSelection = async (mood: string) => {
    if (saving || loading) return;

    setSaving(true);
    setSaveMessage('');

    const today = getTodayKey();

    const newEntry: MoodEntry = {
      id: today,
      mood,
      date: new Date().toISOString(),
      dayKey: today,
    };

    const updatedHistory = [
      ...moodHistory.filter(entry => entry.dayKey !== today),
      newEntry,
    ].sort((a, b) => a.dayKey.localeCompare(b.dayKey));

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedHistory)
      );

      setMoodHistory(updatedHistory);
      setSelectedMood(mood);
      setSaveMessage('Your feelings have been saved with care. 💚');
    } catch (error) {
      console.log('Could not save mood:', error);
      setSaveMessage('Could not save your mood. Please try again.');
    } finally {
      setSaving(false);
    }
  };

    
    // Save a personal journal entry
  const handleSaveJournalEntry = async () => {
    const text = journalInput.trim();

    if (!text) {
      setJournalMessage('Please write something before saving.');
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      text,
      date: new Date().toISOString(),
    };

    const updatedEntries = [newEntry, ...journalEntries];

    try {
      await AsyncStorage.setItem(
        JOURNAL_STORAGE_KEY,
        JSON.stringify(updatedEntries)
      );

      setJournalEntries(updatedEntries);
      setJournalInput('');
      setJournalMessage('Your journal entry has been saved.');
    } catch (error) {
      console.log('Could not save journal entry:', error);
      setJournalMessage('Could not save your entry. Please try again.');
    }
    };

  // Delete an individual personal journal entry
  const handleDeleteJournalEntry = async (entryId: string) => {
    const updatedEntries = journalEntries.filter(
      entry => entry.id !== entryId
    );

    try {
      await AsyncStorage.setItem(
        JOURNAL_STORAGE_KEY,
        JSON.stringify(updatedEntries)
      );

      setJournalEntries(updatedEntries);
      setJournalMessage('Journal entry deleted.');
    } catch (error) {
      console.log('Could not delete journal entry:', error);
      setJournalMessage('Could not delete your entry. Please try again.');
    }
  };

  // Send mood-aware messages to Solace AI
  const sendChatMessage = async () => {
    const message = chatInput.trim();

    if (!message || chatLoading || !memoryLoaded) return;

    const updatedMessages: ChatMessage[] = [
      ...chatMessages,
      {
        role: 'user',
        content: message,
      },
    ];

    setChatMessages(updatedMessages);
    setChatInput('');
    setChatLoading(true);
    setChatError('');

    try {
      const response = await fetch(SOLACE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
  messages: updatedMessages.slice(-12),
  mood: selectedMood,
  memory: userMemory,
}),
        
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.reply) {
        throw new Error('AI response failed');
      }

      setChatMessages(previous => [
        ...previous,
        {
          role: 'assistant',
          content: data.reply,
        },
      ]);
    } catch (error) {
      setChatError(
        'I could not connect right now. Please try again.'
      );
    } finally {
      setChatLoading(false);
    }
  };

// Save the user's profile memory
const saveUserMemory = async () => {
  try {
    await AsyncStorage.setItem(
      MEMORY_STORAGE_KEY,
      JSON.stringify(userMemory)
    );

    setMemoryStatus('Your memory has been saved! 🌿');
  } catch (error) {
    console.log('Could not save user memory:', error);
    setMemoryStatus('Could not save memory. Please try again.');
  }
};

// Delete the user's saved profile memory
const deleteUserMemory = async () => {
  try {
    await AsyncStorage.removeItem(MEMORY_STORAGE_KEY);

    setUserMemory({
      name: '',
      communicationStyle: '',
      preferences: [],
    });

    setMemoryStatus('Your saved memory has been deleted.');
  } catch (error) {
    console.log('Could not delete user memory:', error);
    setMemoryStatus('Could not delete memory. Please try again.');
  }
};

  // Load the user's saved profile memory when Solace opens
  useEffect(() => {
    const loadUserMemory = async () => {
      try {
        const savedMemory = await AsyncStorage.getItem(MEMORY_STORAGE_KEY);

        if (savedMemory) {
          const parsed = JSON.parse(savedMemory);

          if (parsed && typeof parsed === 'object') {
            setUserMemory({
              name: typeof parsed.name === 'string' ? parsed.name : '',
              communicationStyle:
                typeof parsed.communicationStyle === 'string'
                  ? parsed.communicationStyle
                  : '',
              preferences: Array.isArray(parsed.preferences)
                ? parsed.preferences
                    .filter(
                      (item: unknown): item is string =>
                        typeof item === 'string'
                    )
                    .slice(0, 5)
                : [],
            });
          }
        }
      } catch (error) {
        console.log('Could not load user memory:', error);
      } finally {
        setMemoryLoaded(true);
      }
    };

    loadUserMemory();
  }, []);
  // Load saved conversation when Solace opens
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const savedChat = await AsyncStorage.getItem(
          'solace_chat_history'
        );

        if (savedChat) {
          const parsedChat = JSON.parse(savedChat);

          if (Array.isArray(parsedChat) && parsedChat.length > 0) {
            setChatMessages(parsedChat);
          }
        }
      } catch (error) {
        console.log('Could not load chat history:', error);
      } finally {
        setChatHistoryLoaded(true);
      }
    };

    loadChatHistory();
  }, []);

  // Automatically save conversation whenever messages change
  useEffect(() => {
    if (!chatHistoryLoaded) return;

    const saveChatHistory = async () => {
      try {
        await AsyncStorage.setItem(
          'solace_chat_history',
          JSON.stringify(chatMessages)
        );
      } catch (error) {
        console.log('Could not save chat history:', error);
      }
    };

    saveChatHistory();
  }, [chatMessages, chatHistoryLoaded]);

  // Breathing animation

  useEffect(() => {
    if (!breathing) {
      breathScale.stopAnimation();
          return;
    }

    let targetScale = 1;
    let duration = 2000;

    if (breathPhase === 'Inhale') {
      targetScale = 1.4;
      duration = 4000;
    } else if (breathPhase === 'Hold') {
      targetScale = 1.4;
      duration = 4000;
    } else if (breathPhase === 'Exhale') {
      targetScale = 1;
      duration = 6000;
    } else if (breathPhase === 'Rest') {
      targetScale = 1;
      duration = 2000;
    }

    Animated.timing(breathScale, {
      toValue: targetScale,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();

    return () => {
      breathScale.stopAnimation();
    };
  }, [breathing, breathPhase, breathScale]);

  // Breathing timer
  useEffect(() => {
    if (!breathing) return;

    const interval = setInterval(() => {
      totalElapsed.current += 1;

      const elapsed = totalElapsed.current;

      if (elapsed >= 60) {
        setBreathSeconds(0);
        setBreathPhase('Beautifully done');
        setBreathing(false);
        return;
      }

      setBreathSeconds(60 - elapsed);

      const position = elapsed % 16;

      if (position < 4) {
        setBreathPhase('Inhale');
      } else if (position < 8) {
        setBreathPhase('Hold');
      } else if (position < 14) {
        setBreathPhase('Exhale');
      } else {
        setBreathPhase('Rest');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [breathing]);

  const startBreathing = () => {
    if (totalElapsed.current >= 60) {
      totalElapsed.current = 0;
      setBreathSeconds(60);
    }

    if (totalElapsed.current === 0) {
      setBreathPhase('Inhale');
    }

    setBreathing(true);
  };

  const resetBreathing = () => {
    setBreathing(false);
    totalElapsed.current = 0;
    setBreathSeconds(60);
    setBreathPhase('Ready');

    breathScale.stopAnimation();
    breathScale.setValue(1);
  };

  const todayEntry = moodHistory.find(
    entry => entry.dayKey === getTodayKey()
  );

  const recentMoods = [...moodHistory].reverse().slice(0, 5);

  const totalXP = new Set(
    moodHistory.map(entry => entry.dayKey)
  ).size * 10;

  const currentStreak = calculateStreak(moodHistory);

  const minutes = Math.floor(breathSeconds / 60);
  const seconds = breathSeconds % 60;

  return (
    <SafeAreaView style={styles.safeArea}>
     <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>solace</Text>
            <Text style={styles.tagline}>A little space for you.</Text>
          </View>

          <View style={styles.profileCircle}>
            <Text style={styles.profileEmoji}>🌿</Text>
          </View>
        </View>

        {/* Welcome */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeSmall}>YOUR PERSONAL WELLNESS SPACE</Text>
          <Text style={styles.welcomeTitle}>Hello, beautiful soul.</Text>
          <Text style={styles.welcomeDescription}>
            Take a moment for yourself. You deserve it.
          </Text>
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.cardEyebrow}>YOUR JOURNEY</Text>

          <View style={styles.progressRow}>
            <View style={styles.progressItem}>
              <Text style={styles.progressEmoji}>✨</Text>
              <Text style={styles.progressNumber}>{totalXP} XP</Text>
              <Text style={styles.progressLabel}>Total earned</Text>
            </View>

            <View style={styles.progressDivider} />

            <View style={styles.progressItem}>
              <Text style={styles.progressEmoji}>🔥</Text>
              <Text style={styles.progressNumber}>
                {currentStreak} days
              </Text>
              <Text style={styles.progressLabel}>Current streak</Text>
            </View>
          </View>

          <Text style={styles.progressNote}>
            Every small step matters. Keep showing up for yourself.
          </Text>
        </View>

        {/* Mood Check-in */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>CHECK IN WITH YOURSELF</Text>
          <Text style={styles.sectionTitle}>How are you feeling today?</Text>
          <Text style={styles.sectionDescription}>
            There is no right or wrong answer.
          </Text>

          <View style={styles.moodGrid}>
            {moods.map(mood => {
              const isSelected = selectedMood === mood.name;

              return (
                <Pressable
                  key={mood.name}
                  disabled={loading || saving}
                  onPress={() => handleMoodSelection(mood.name)}
                  style={[
                    styles.moodButton,
                    { backgroundColor: mood.color },
                    isSelected && styles.moodSelected,
                  ]}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodName}>{mood.name}</Text>

                  {isSelected && (
                    <Text style={styles.selectedMark}>✓</Text>
                  )}
                </Pressable>
              );
            })}
          </View>

          {loading && (
            <Text style={styles.statusText}>Loading your mood history...</Text>
          )}

          {saving && (
            <Text style={styles.statusText}>Saving your check-in...</Text>
          )}

          {selectedMood && !saving && (
            <View style={styles.moodMessageCard}>
              <Text style={styles.moodMessageEmoji}>
                {getMoodEmoji(selectedMood)}
              </Text>
              <Text style={styles.moodMessage}>
                {getMoodMessage(selectedMood)}
              </Text>
            </View>
          )}

          {!!saveMessage && (
            <Text style={styles.statusText}>{saveMessage}</Text>
          )}

          {todayEntry && (
            <Text style={styles.todayNote}>
              Today's check-in is saved. You can update your mood anytime today.
            </Text>
          )}
        </View>

        {/* Breathing Exercise */}
        <View style={styles.breathingCard}>
          <Text style={styles.sectionEyebrow}>FIND YOUR BALANCE</Text>
          <Text style={styles.breathingTitle}>A moment to breathe</Text>
          <Text style={styles.breathingDescription}>
            Let go of the noise. Come back to yourself.
          </Text>

          <View style={styles.breathingVisual}>
            <View style={styles.outerCircle}>
              <Animated.View
                style={[
                  styles.breathCircle,
                  {
                    transform: [{ scale: breathScale }],
                  },
                ]}
              >
                <View style={styles.innerCircle}>
                  <Text style={styles.breathLeaf}>🌿</Text>
                  <Text style={styles.breathPhase}>
                    {breathPhase}
                  </Text>
                </View>
              </Animated.View>
            </View>
          </View>

          <Text style={styles.timerText}>
            {breathing || totalElapsed.current > 0
              ? `${minutes}:${String(seconds).padStart(2, '0')}`
              : '60 seconds'}
          </Text>

          <Text style={styles.breathingHint}>
            {breathPhase === 'Inhale'
              ? 'Breathe in slowly...'
              : breathPhase === 'Hold'
              ? 'Gently hold your breath...'
              : breathPhase === 'Exhale'
              ? 'Breathe out softly...'
              : breathPhase === 'Rest'
              ? 'Rest and relax...'
              : breathPhase === 'Beautifully done'
              ? 'You did something beautiful for yourself.'
              : 'Follow the circle and relax.'}
          </Text>

          <View style={styles.breathingButtons}>
            {!breathing ? (
              <Pressable
                style={styles.primaryButton}
                onPress={startBreathing}
              >
                <Text style={styles.primaryButtonText}>
                  {totalElapsed.current > 0 && totalElapsed.current < 60
                    ? 'Resume breathing'
                    : 'Start breathing'}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.primaryButton}
                onPress={() => setBreathing(false)}
              >
                <Text style={styles.primaryButtonText}>Pause</Text>
              </Pressable>
            )}

            <Pressable
              style={styles.resetButton}
              onPress={resetBreathing}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </Pressable>
          </View>
        </View>

        {/* Journal */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>YOUR REFLECTIONS</Text>
          <Text style={styles.sectionTitle}>Your mood journal</Text>
          <Text style={styles.sectionDescription}>
            A little reminder of how far you have come.
          </Text>

          <View style={styles.journalCard}>
            {recentMoods.length === 0 ? (
              <Text style={styles.emptyJournal}>
                Your journey starts with one small check-in. 💚
              </Text>
            ) : (
              recentMoods.map((entry, index) => (
                <View
                  key={entry.dayKey}
                  style={[
                    styles.journalRow,
                    index === recentMoods.length - 1 &&
                      styles.journalLastRow,
                  ]}
                >
                  <Text style={styles.journalEmoji}>
                    {getMoodEmoji(entry.mood)}
                  </Text>

                  <View style={styles.journalDetails}>
                    <Text style={styles.journalMood}>{entry.mood}</Text>
                    <Text style={styles.journalDate}>
                      {getFormattedDate(entry.date)}
                    </Text>
<Pressable
  onPress={() => handleDeleteJournalEntry(entry.id)}
  style={styles.journalDeleteButton}
>
  <Text style={styles.journalDeleteButtonText}>
    Delete
  </Text>
</Pressable>
                  </View>

                  <Text style={styles.journalHeart}>♡</Text>
                </View>
              ))
            )}
          </View>
        </View>

                       {/* Personal Writing Journal */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>PERSONAL JOURNAL</Text>

          <Text style={styles.sectionTitle}>
            Your private space to write
          </Text>

          <Text style={styles.sectionDescription}>
            Write your thoughts, feelings, and little moments.
          </Text>

          <View style={styles.journalCard}>
            <TextInput
              style={styles.journalInput}
              placeholder="What's on your mind today?"
              placeholderTextColor={COLORS.muted}
              multiline
              value={journalInput}
              onChangeText={setJournalInput}
            />

            <Pressable
              style={styles.journalSaveButton}
              onPress={handleSaveJournalEntry}
            >
              <Text style={styles.journalSaveButtonText}>
                Save Entry
              </Text>
            </Pressable>

            {!!journalMessage && (
              <Text style={styles.journalMessage}>
                {journalMessage}
              </Text>
            )}

            <Text style={styles.sectionTitle}>
              Your written entries
            </Text>

            {journalEntries.length === 0 ? (
              <Text style={styles.emptyJournal}>
                Your first reflection is waiting here. 💚
              </Text>
            ) : (
              journalEntries.map(entry => (
                <View key={entry.id} style={styles.journalRow}>
                  <View style={styles.journalDetails}>
                    <Text style={styles.journalDate}>
                      {new Date(entry.date).toLocaleString()}
                    </Text>
                    <Text style={styles.journalMood}>
                      {entry.text}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
{/* AI Companion */}
        <View style={styles.companionCard}>
          <View style={styles.companionTop}>
            <View style={styles.companionIcon}>
              <Text style={styles.companionEmoji}>✨</Text>
            </View>

            <View style={styles.companionBadge}>
              <Text style={styles.companionBadgeText}>AI COMPANION</Text>
            </View>
          </View>

          <Text style={styles.companionTitle}>
            Your companion, Solace.
          </Text>

          <Text style={styles.companionDescription}>
            A gentle space to talk, reflect, and feel understood.
            I'm here to listen.
          </Text>

          <View style={styles.chatMessages}>
            {chatMessages.map((message, index) => (
              <View
                key={index}
                style={[
                  styles.chatBubble,
                  message.role === 'user'
                    ? styles.userBubble
                    : styles.assistantBubble,
                ]}
              >
                <Text
                  style={[
                    styles.chatMessageText,
                    message.role === 'user'
                      ? styles.userMessageText
                      : styles.assistantMessageText,
                  ]}
                >
                  {message.content}
                </Text>
              </View>
            ))}

            {chatLoading && (
              <View style={styles.chatLoading}>
                <ActivityIndicator color={COLORS.darkLavender} />
                <Text style={styles.chatLoadingText}>
                  Solace is thinking...
                </Text>
              </View>
            )}
          </View>

          {!!chatError && (
            <Text style={styles.chatError}>{chatError}</Text>
          )}

          <View style={styles.chatInputRow}>
            <TextInput
              style={styles.chatInput}
              placeholder="Share what's on your mind..."
              placeholderTextColor={COLORS.muted}
              value={chatInput}
              onChangeText={setChatInput}
              multiline
              maxLength={1000}
              editable={!chatLoading}
            />

            <Pressable
              style={[
                styles.chatSendButton,
                chatLoading && { opacity: 0.5 },
              ]}
              onPress={sendChatMessage}
              disabled={chatLoading || !chatInput.trim() || !memoryLoaded}
            >
              <Text style={styles.chatSendText}>Send</Text>
            </Pressable>
          </View>
         </View>

        {/* Saved User Memory */}
<View style={styles.memoryCard}>
  <Text style={styles.memoryTitle}>
    Your Saved Memory 🌿
  </Text>

 <Text
  style={{
    fontSize: 14,
    color: '#000000',
    marginBottom: 16,
    fontWeight: '600',
  }}
>
  PRIVACY: Deleting saved memory does not delete previous conversations.
</Text>

  <Text style={styles.memoryHint}>
    Choose what Solace remembers about you.
  </Text>

          <TextInput
            style={styles.memoryInput}
            placeholder="Your name"
            placeholderTextColor={COLORS.muted}
            value={userMemory.name}
            onChangeText={(text) =>
              setUserMemory(prev => ({ ...prev, name: text }))
            }
          />

          <TextInput
            style={styles.memoryInput}
            placeholder="Communication style (e.g. Friendly)"
            placeholderTextColor={COLORS.muted}
            value={userMemory.communicationStyle}
            onChangeText={(text) =>
              setUserMemory(prev => ({
                ...prev,
                communicationStyle: text,
              }))
            }
          />

          <TextInput
            style={styles.memoryInput}
            placeholder="Preferences (separate with commas)"
            placeholderTextColor={COLORS.muted}
            value={userMemory.preferences.join(', ')}
            onChangeText={(text) =>
              setUserMemory(prev => ({
                ...prev,
                preferences: text
                  .split(',')
                  .map(item => item.trim())
                  .filter(Boolean)
                  .slice(0, 5),
              }))
            }
          />

          <View style={styles.memoryButtonRow}>
            <Pressable
              style={styles.memorySaveButton}
              onPress={saveUserMemory}
              disabled={!memoryLoaded}
            >
              <Text style={styles.memoryButtonText}>
                Save Memory
              </Text>
            </Pressable>

            <Pressable
              style={styles.memoryDeleteButton}
              onPress={deleteUserMemory}
            >
              <Text style={styles.memoryButtonText}>
                Delete Memory
              </Text>
            </Pressable>
          </View>

          {memoryStatus ? (
            <Text style={styles.memoryStatus}>
              {memoryStatus}
            </Text>
          ) : null}
        </View>
        <View style={styles.affirmationCard}>
          <Text style={styles.affirmationLabel}>A THOUGHT TO CARRY WITH YOU</Text>
          <Text style={styles.affirmationText}>
            "You are allowed to grow at your own pace. Beautiful things take time."
          </Text>
          <Text style={styles.affirmationHeart}>♡</Text>
        </View>

        <Text style={styles.footer}>
          Made with care, for your wellbeing. 💚
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginBottom: 30,
  },

  logo: {
    fontSize: 31,
    fontWeight: '700',
    letterSpacing: -1.5,
    color: COLORS.darkSage,
  },

  tagline: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 1,
  },

  profileCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.lightSage,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileEmoji: {
    fontSize: 23,
  },

  welcomeSection: {
    marginBottom: 25,
  },

  welcomeSmall: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.sage,
    marginBottom: 10,
  },

  welcomeTitle: {
    fontSize: 29,
    fontWeight: '600',
    color: COLORS.text,
    letterSpacing: -0.8,
  },

  welcomeDescription: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 8,
    lineHeight: 21,
  },

  progressCard: {
    backgroundColor: COLORS.lightSage,
    borderRadius: 23,
    padding: 20,
    marginBottom: 34,
  },

  cardEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8,
    color: COLORS.darkSage,
    marginBottom: 20,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  progressItem: {
    flex: 1,
    alignItems: 'center',
  },

  progressEmoji: {
    fontSize: 23,
    marginBottom: 8,
  },

  progressNumber: {
    fontSize: 23,
    fontWeight: '700',
    color: COLORS.darkSage,
  },

  progressLabel: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 4,
  },

  progressDivider: {
    height: 58,
    width: 1,
    backgroundColor: '#CAD8CA',
  },

  progressNote: {
    textAlign: 'center',
    color: COLORS.darkSage,
    fontSize: 11,
    marginTop: 19,
  },

  section: {
    marginBottom: 34,
  },

  sectionEyebrow: {
    color: COLORS.sage,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.7,
    marginBottom: 9,
  },

  sectionTitle: {
    fontSize: 23,
    fontWeight: '600',
    color: COLORS.text,
  },

  sectionDescription: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 6,
    marginBottom: 18,
    lineHeight: 20,
  },

  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },

  moodButton: {
    width: '31%',
    minHeight: 102,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    position: 'relative',
  },

  moodSelected: {
    borderColor: COLORS.darkSage,
    borderWidth: 2,
  },

  moodEmoji: {
    fontSize: 27,
    marginBottom: 7,
  },

  moodName: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
  },

  selectedMark: {
    position: 'absolute',
    top: 6,
    right: 9,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.darkSage,
  },

  moodMessageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightSage,
    borderRadius: 15,
    padding: 15,
    marginTop: 16,
  },

  moodMessageEmoji: {
    fontSize: 23,
    marginRight: 12,
  },

  moodMessage: {
    flex: 1,
    color: COLORS.darkSage,
    fontSize: 13,
    lineHeight: 20,
  },

  statusText: {
    fontSize: 12,
    color: COLORS.darkSage,
    marginTop: 12,
    textAlign: 'center',
  },

  todayNote: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 17,
  },

  breathingCard: {
    backgroundColor: COLORS.card,
    borderRadius: 25,
    padding: 22,
    alignItems: 'center',
    marginBottom: 34,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  breathingTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },

  breathingDescription: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 19,
  },

  breathingVisual: {
    height: 235,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 5,
  },

  outerCircle: {
    height: 180,
    width: 180,
    borderRadius: 90,
    backgroundColor: '#F0F4EE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  breathCircle: {
    height: 130,
    width: 130,
    borderRadius: 65,
    backgroundColor: COLORS.sage,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.sage,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
  },

  innerCircle: {
    height: 112,
    width: 112,
    borderRadius: 56,
    backgroundColor: COLORS.darkSage,
    justifyContent: 'center',
    alignItems: 'center',
  },

  breathLeaf: {
    fontSize: 24,
    marginBottom: 5,
  },

  breathPhase: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  timerText: {
    fontSize: 22,
    color: COLORS.darkSage,
    fontWeight: '700',
    marginTop: 5,
  },

  breathingHint: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 8,
    textAlign: 'center',
    minHeight: 19,
  },

  breathingButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
    width: '100%',
  },

  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.darkSage,
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  resetButton: {
    backgroundColor: COLORS.lightSage,
    borderRadius: 15,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  resetButtonText: {
    color: COLORS.darkSage,
    fontSize: 13,
    fontWeight: '700',
  },

  journalCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingHorizontal: 17,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  emptyJournal: {
    padding: 20,
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.muted,
    lineHeight: 21,
  },

  journalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  journalLastRow: {
    borderBottomWidth: 0,
  },

  journalEmoji: {
    fontSize: 25,
    marginRight: 13,
  },

    journalDetails: {
    flex: 1,
  },

  journalInput: {
    minHeight: 120,
    padding: 14,
    fontSize: 14,
    color: COLORS.text,
    textAlignVertical: 'top',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  journalSaveButton: {
    backgroundColor: COLORS.darkSage,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },

  journalSaveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  journalMessage: {
    color: COLORS.darkSage,
    fontSize: 12,
    marginBottom: 14,
    textAlign: 'center',
  },

  journalMood: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  journalDate: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 4,
  },
  journalDeleteButton: {
    backgroundColor: '#FCE8E8',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 8,
    alignSelf: 'flex-start',
  },

  journalDeleteButtonText: {
    color: '#C94C4C',
    fontSize: 12,
    fontWeight: '600',
  },

  journalHeart: {
    fontSize: 22,
    color: COLORS.sage,
  },

  companionCard: {
    backgroundColor: COLORS.lavender,
    borderRadius: 24,
    padding: 21,
    marginBottom: 25,
  },

  companionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 17,
  },

  companionIcon: {
    height: 43,
    width: 43,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  companionEmoji: {
    fontSize: 22,
  },

  companionBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  companionBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.darkLavender,
    letterSpacing: 1,
  },

  companionTitle: {
    fontSize: 21,
    fontWeight: '600',
    color: '#51485F',
  },

  companionDescription: {
    color: '#777084',
    fontSize: 13,
    lineHeight: 21,
    marginTop: 9,
  },

  companionButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 17,
  },

  companionButtonText: {
    color: COLORS.darkLavender,
    fontWeight: '700',
    fontSize: 12,
  },

    chatMessages: {
    marginTop: 20,
    gap: 12,
  },

  chatBubble: {
    maxWidth: '88%',
    padding: 13,
    borderRadius: 16,
  },

  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.darkLavender,
    borderBottomRightRadius: 4,
  },

  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },

  chatMessageText: {
    fontSize: 13,
    lineHeight: 20,
  },

  userMessageText: {
    color: '#FFFFFF',
  },

  assistantMessageText: {
    color: COLORS.text,
  },

  chatLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 10,
  },

  chatLoadingText: {
    fontSize: 12,
    color: COLORS.darkLavender,
  },

  chatError: {
    color: '#A34F4F',
    fontSize: 12,
    marginTop: 10,
  },

  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: 18,
  },

  chatInput: {
    flex: 1,
    minHeight: 48,
    maxHeight: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: COLORS.text,
  },

  chatSendButton: {
    backgroundColor: COLORS.darkLavender,
    borderRadius: 14,
    paddingHorizontal: 17,
    paddingVertical: 15,
  },

  chatSendText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  chatDisclaimer: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  memoryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
  },

  memoryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.darkSage,
    marginBottom: 8,
  },

  memoryHint: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 16,
  },

  memoryInput: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 13,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 12,
  },

  memoryButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },

  memorySaveButton: {
    flex: 1,
    backgroundColor: COLORS.sage,
    padding: 13,
    borderRadius: 12,
    alignItems: 'center',
  },

  memoryDeleteButton: {
    flex: 1,
    backgroundColor: COLORS.darkSage,
    padding: 13,
    borderRadius: 12,
    alignItems: 'center',
  },

  memoryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },

  memoryStatus: {
    color: COLORS.darkSage,
    fontSize: 13,
    marginTop: 12,
  },

  affirmationCard: {
    backgroundColor: COLORS.peach,
    borderRadius: 21,
    padding: 21,
    alignItems: 'center',
    marginBottom: 27,
  },

  affirmationLabel: {
    fontSize: 9,
    color: '#9A7665',
    fontWeight: '700',
    letterSpacing: 1.6,
    marginBottom: 13,
  },

  affirmationText: {
    color: '#6F5549',
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'center',
    fontWeight: '500',
  },

  affirmationHeart: {
    color: '#A77F6E',
    fontSize: 24,
    marginTop: 10,
  },

  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: COLORS.muted,
    marginBottom: 10,
  },
});
