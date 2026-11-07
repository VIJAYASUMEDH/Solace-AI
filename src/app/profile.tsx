
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const menuItems = [
  { icon: '📖', title: 'My journal', subtitle: 'Your emotional journey' },
  { icon: '🔔', title: 'Reminders', subtitle: 'Gentle wellness reminders' },
  { icon: '🎨', title: 'Appearance', subtitle: 'Your Solace experience' },
  { icon: '🔒', title: 'Privacy', subtitle: 'Your personal space' },
  { icon: '💚', title: 'About Solace', subtitle: 'Made with care' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.brand}>solace.</Text>

        <Text style={styles.eyebrow}>YOUR PERSONAL SPACE</Text>
        <Text style={styles.heading}>A little about you.</Text>
        <Text style={styles.description}>
          This is your journey. Make yourself at home.
        </Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🌿</Text>
          </View>

          <Text style={styles.name}>Your wellness journey</Text>
          <Text style={styles.memberText}>A space to grow at your own pace.</Text>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>♡</Text>
              <Text style={styles.statLabel}>Self-care</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>✦</Text>
              <Text style={styles.statLabel}>Growth</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>🌱</Text>
              <Text style={styles.statLabel}>Mindfulness</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your preferences</Text>

        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.title}
              onPress={() => {}}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.pressed,
                index !== menuItems.length - 1 && styles.menuBorder,
              ]}
            >
              <View style={styles.menuIcon}>
                <Text style={styles.menuEmoji}>{item.icon}</Text>
              </View>

              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.quoteCard}>
          <Text style={styles.quoteMark}>“</Text>
          <Text style={styles.quote}>
            Becoming yourself is a journey worth taking.
          </Text>
          <Text style={styles.quoteFooter}>A LITTLE LOVE FROM SOLACE 💚</Text>
        </View>

        <Text style={styles.version}>SOLACE · YOUR SPACE TO FEEL BETTER</Text>
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
    fontSize: 35,
    color: '#304D3D',
    marginTop: 9,
  },
  description: {
    fontFamily: 'DMSansRegular',
    fontSize: 13,
    color: '#899389',
    marginTop: 8,
    marginBottom: 25,
  },
  profileCard: {
    backgroundColor: '#E5EDE2',
    borderRadius: 25,
    padding: 23,
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 29,
    backgroundColor: '#F8F6EF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D5E1D1',
  },
  avatarEmoji: {
    fontSize: 39,
  },
  name: {
    fontFamily: 'DMSerifDisplay',
    fontSize: 23,
    color: '#355744',
    marginTop: 15,
  },
  memberText: {
    fontFamily: 'DMSansRegular',
    fontSize: 11,
    color: '#829382',
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#D3DFD0',
    alignSelf: 'stretch',
    marginVertical: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 23,
    color: '#45634E',
  },
  statLabel: {
    fontFamily: 'DMSansMedium',
    fontSize: 10,
    color: '#718775',
    marginTop: 5,
  },
  statDivider: {
    height: 34,
    width: 1,
    backgroundColor: '#D3DFD0',
  },
  sectionTitle: {
    fontFamily: 'DMSerifDisplay',
    fontSize: 25,
    color: '#304D3D',
    marginBottom: 15,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#EFEEE6',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0E9',
  },
  pressed: {
    opacity: 0.65,
  },
  menuIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#EEF1E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuEmoji: {
    fontSize: 21,
  },
  menuContent: {
    flex: 1,
    marginLeft: 13,
  },
  menuTitle: {
    fontFamily: 'DMSansBold',
    fontSize: 13,
    color: '#405D48',
  },
  menuSubtitle: {
    fontFamily: 'DMSansRegular',
    fontSize: 10,
    color: '#9AA395',
    marginTop: 4,
  },
  arrow: {
    fontSize: 25,
    color: '#9AA895',
  },
  quoteCard: {
    backgroundColor: '#EAE7F2',
    padding: 22,
    borderRadius: 22,
    alignItems: 'center',
  },
  quoteMark: {
    fontFamily: 'DMSerifDisplay',
    fontSize: 43,
    color: '#9589AD',
    height: 39,
  },
  quote: {
    fontFamily: 'DMSerifDisplay',
    fontSize: 22,
    lineHeight: 31,
    color: '#514A6C',
    textAlign: 'center',
  },
  quoteFooter: {
    fontFamily: 'DMSansBold',
    fontSize: 9,
    letterSpacing: 1.4,
    color: '#9289A5',
    marginTop: 15,
  },
  version: {
    fontFamily: 'DMSansMedium',
    fontSize: 9,
    letterSpacing: 1.1,
    color: '#A0A89E',
    textAlign: 'center',
    marginTop: 27,
  },
});
