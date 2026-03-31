import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, FONTS, SPACING, RADIUS} from '../utils/theme';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');
const CARD_W = (width - SPACING.lg * 2 - SPACING.md) / 2;

const FEATURES = [
  {
    key: 'aesthetic',
    emoji: '✨',
    title: 'Viral AI Aesthetic',
    desc: 'Transform outfits into trending aesthetics — Y2K, Dark Academia, Cottagecore & more.',
    badge: 'NEW',
    badgeColor: COLORS.accent,
    gradient: ['#c8ff3e18', '#0a0a0f'],
  },
  {
    key: 'photoedit',
    emoji: '🖼️',
    title: 'AI Photo Edit',
    desc: 'Auto-enhance, relight & stylize your fashion photos in one tap.',
    badge: 'HOT',
    badgeColor: COLORS.accent2,
    gradient: ['#ff6b9d18', '#0a0a0f'],
  },
  {
    key: 'mannequin',
    emoji: '🪆',
    title: 'Mannequin → Model',
    desc: 'Turn flat product photos into stunning model shots instantly.',
    badge: 'NEW',
    badgeColor: COLORS.accent3,
    gradient: ['#7b61ff18', '#0a0a0f'],
  },
  {
    key: 'mix',
    emoji: '🔀',
    title: 'Mix & Match',
    desc: 'AI outfit suggestions from your wardrobe for any occasion.',
    badge: null,
    badgeColor: '#ffd166',
    gradient: ['#ffd16618', '#0a0a0f'],
  },
  {
    key: 'size',
    emoji: '📏',
    title: 'Size Predictor',
    desc: 'AI recommends your perfect size based on your photo & height.',
    badge: null,
    badgeColor: '#06d6a0',
    gradient: ['#06d6a018', '#0a0a0f'],
  },
  {
    key: 'style',
    emoji: '💡',
    title: 'Style Advisor',
    desc: 'Personalised outfit advice tailored to your body type & lifestyle.',
    badge: null,
    badgeColor: '#ef476f',
    gradient: ['#ef476f18', '#0a0a0f'],
  },
];

export default function AIStudioScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>AI Studio</Text>
          <Text style={styles.headerSub}>Powered by Nano Banana</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Banner */}
        <LinearGradient
          colors={[COLORS.accent3 + '33', COLORS.accent2 + '22', COLORS.bg]}
          style={styles.banner}>
          <Text style={styles.bannerEmoji}>🎨</Text>
          <View>
            <Text style={styles.bannerTitle}>Generate Viral AI Looks</Text>
            <Text style={styles.bannerSub}>6 powerful AI features for fashion</Text>
          </View>
        </LinearGradient>

        {/* Feature Grid */}
        <View style={styles.grid}>
          {FEATURES.map(f => (
            <TouchableOpacity
              key={f.key}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('AIStudioFeature', {feature: f.key})}>
              <LinearGradient colors={f.gradient} style={styles.cardGrad}>
                {f.badge && (
                  <View style={[styles.badge, {backgroundColor: f.badgeColor + '28', borderColor: f.badgeColor + '60'}]}>
                    <Text style={[styles.badgeText, {color: f.badgeColor}]}>{f.badge}</Text>
                  </View>
                )}
                <Text style={styles.cardEmoji}>{f.emoji}</Text>
                <Text style={styles.cardTitle}>{f.title}</Text>
                <Text style={styles.cardDesc}>{f.desc}</Text>
                <View style={[styles.cardBtn, {borderColor: f.badgeColor + '60'}]}>
                  <Text style={[styles.cardBtnText, {color: f.badgeColor}]}>Try Now →</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.bg},
  header: {
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: {fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.text},
  headerSub: {fontSize: FONTS.sizes.xs, color: COLORS.textMuted},

  content: {padding: SPACING.lg},

  banner: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    padding: SPACING.lg, borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  bannerEmoji: {fontSize: 40},
  bannerTitle: {fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text},
  bannerSub: {fontSize: FONTS.sizes.sm, color: COLORS.textMuted, marginTop: 2},

  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md},

  card: {width: CARD_W, borderRadius: RADIUS.xl, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border},
  cardGrad: {padding: SPACING.md, gap: SPACING.sm, minHeight: 180},
  badge: {
    alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: RADIUS.round, borderWidth: 1, marginBottom: 4,
  },
  badgeText: {fontSize: FONTS.sizes.xs, fontWeight: '800', letterSpacing: 0.5},
  cardEmoji: {fontSize: 28},
  cardTitle: {fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.text},
  cardDesc: {fontSize: FONTS.sizes.xs, color: COLORS.textMuted, lineHeight: 18, flex: 1},
  cardBtn: {
    borderWidth: 1, borderRadius: RADIUS.sm,
    paddingVertical: 4, paddingHorizontal: SPACING.sm,
    alignSelf: 'flex-start', marginTop: 4,
  },
  cardBtnText: {fontSize: FONTS.sizes.xs, fontWeight: '700'},
});
