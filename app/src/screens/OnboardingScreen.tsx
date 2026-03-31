import React, {useState, useRef} from 'react';
import {
  View, Text, StyleSheet, FlatList, Dimensions,
  TouchableOpacity, Animated, StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, FONTS, SPACING, RADIUS} from '../utils/theme';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/RootNavigator';

const {width, height} = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    emoji: '✨',
    title: 'Try Any Outfit\nInstantly',
    subtitle: 'Share a product from any shopping app and see it on you in seconds using Nano Banana AI.',
    accent: COLORS.accent,
  },
  {
    id: '2',
    emoji: '📸',
    title: 'One Photo.\nInfinite Looks.',
    subtitle: 'Upload your photo once, then try on unlimited outfits from any brand, any store, anywhere.',
    accent: COLORS.accent2,
  },
  {
    id: '3',
    emoji: '🪆',
    title: 'Mannequin to\nModel Magic',
    subtitle: 'Transform flat mannequin product photos into realistic model shots instantly.',
    accent: COLORS.accent3,
  },
  {
    id: '4',
    emoji: '👗',
    title: 'Your AI-Powered\nWardrobe',
    subtitle: 'Save, organise, and mix & match outfits. Let AI plan your perfect look for every occasion.',
    accent: '#ffd166',
  },
];

type Nav = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

export default function OnboardingScreen() {
  const navigation = useNavigation<Nav>();
  const [current, setCurrent] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const goNext = () => {
    if (current < SLIDES.length - 1) {
      const next = current + 1;
      setCurrent(next);
      flatRef.current?.scrollToIndex({index: next, animated: true});
    } else {
      navigation.replace('MainTabs');
    }
  };

  const skip = () => navigation.replace('MainTabs');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Skip */}
      <TouchableOpacity style={styles.skipBtn} onPress={skip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatRef}
        data={SLIDES}
        keyExtractor={i => i.id}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <View style={styles.slide}>
            <LinearGradient
              colors={[COLORS.bg, item.accent + '18', COLORS.bg]}
              style={styles.slideBg}
            />
            <View style={styles.emojiWrap}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <Text style={[styles.title, {color: COLORS.text}]}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((s, i) => (
          <View
            key={s.id}
            style={[
              styles.dot,
              i === current && {backgroundColor: SLIDES[current].accent, width: 24},
            ]}
          />
        ))}
      </View>

      {/* CTA */}
      <TouchableOpacity onPress={goNext} activeOpacity={0.85}>
        <LinearGradient
          colors={[SLIDES[current].accent, SLIDES[current].accent + 'cc']}
          style={styles.cta}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <Text style={styles.ctaText}>
            {current === SLIDES.length - 1 ? 'Get Started 🚀' : 'Next →'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.bg, alignItems: 'center'},
  skipBtn: {
    position: 'absolute', top: 54, right: SPACING.lg, zIndex: 10,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
  },
  skipText: {color: COLORS.textMuted, fontSize: FONTS.sizes.md},
  slide: {
    width, paddingHorizontal: SPACING.xl,
    alignItems: 'center', justifyContent: 'center', flex: 1,
  },
  slideBg: {
    position: 'absolute', inset: 0,
  },
  emojiWrap: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: COLORS.surface2,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  emoji: {fontSize: 64},
  title: {
    fontSize: FONTS.sizes.hero, fontWeight: '800',
    textAlign: 'center', lineHeight: 44,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONTS.sizes.md, color: COLORS.textMuted,
    textAlign: 'center', lineHeight: 24, maxWidth: 300,
  },
  dots: {flexDirection: 'row', gap: 6, marginBottom: SPACING.xl},
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: COLORS.border,
    transition: 'width 0.3s',
  },
  cta: {
    paddingHorizontal: SPACING.xxl, paddingVertical: SPACING.md + 2,
    borderRadius: RADIUS.round, minWidth: 220, alignItems: 'center',
  },
  ctaText: {
    fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.black,
  },
  bottomSpacer: {height: 40},
});
