import React, {useState} from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRoute, useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, FONTS, SPACING, RADIUS} from '../utils/theme';
import {runAIFeature} from '../services/api';
import {useAppStore} from '../store/appStore';

const FEATURE_CONFIG: Record<string, {
  title: string; emoji: string; desc: string; color: string;
  options?: string[]; optionLabel?: string; hasImage?: boolean; imagePlaceholder?: string;
  hasText?: boolean; textLabel?: string; textPlaceholder?: string;
}> = {
  aesthetic: {
    title: 'Viral AI Aesthetic', emoji: '✨', color: COLORS.accent,
    desc: 'Upload your outfit photo and choose an aesthetic style.',
    options: ['Y2K', 'Dark Academia', 'Cottagecore', 'Streetwear', 'Minimalist', 'Old Money', 'Grunge', 'Coquette', 'Barbiecore', 'Indie'],
    optionLabel: 'CHOOSE AESTHETIC',
    hasImage: true, imagePlaceholder: '📸 Upload Outfit Photo',
  },
  photoedit: {
    title: 'AI Photo Edit', emoji: '🖼️', color: COLORS.accent2,
    desc: 'Upload your fashion photo and choose an editing style.',
    options: ['Auto Enhance', 'Remove Background', 'Studio Lighting', 'Colour Grading', 'Magazine Editorial', 'Instagram Ready', 'Vintage Film'],
    optionLabel: 'EDIT TYPE',
    hasImage: true, imagePlaceholder: '🖼️ Upload Fashion Photo',
  },
  mannequin: {
    title: 'Mannequin → Model', emoji: '🪆', color: COLORS.accent3,
    desc: 'Upload a mannequin or ghost mannequin product image.',
    options: ['Diverse & Inclusive', 'Professional Model', 'Casual Everyday', 'Plus Size', 'Petite', 'Athletic'],
    optionLabel: 'MODEL TYPE',
    hasImage: true, imagePlaceholder: '🪆 Upload Mannequin Photo',
  },
  mix: {
    title: 'Mix & Match', emoji: '🔀', color: '#ffd166',
    desc: 'Tell us what\'s in your wardrobe and get AI outfit suggestions.',
    hasText: true, textLabel: 'YOUR WARDROBE ITEMS',
    textPlaceholder: 'e.g. white cotton shirt, blue jeans, black blazer, floral dress…',
    options: ['Casual', 'Work', 'Date Night', 'Party', 'Formal', 'Festival'],
    optionLabel: 'OCCASION',
  },
  size: {
    title: 'Size Predictor', emoji: '📏', color: '#06d6a0',
    desc: 'Upload your photo to get size recommendations across brands.',
    hasImage: true, imagePlaceholder: '🧍 Upload Full-Body Photo',
    hasText: true, textLabel: 'YOUR HEIGHT (CM)',
    textPlaceholder: 'e.g. 165',
  },
  style: {
    title: 'Style Advisor', emoji: '💡', color: '#ef476f',
    desc: 'Get personalised style advice tailored to your preferences.',
    options: ['Minimalist', 'Streetwear', 'Boho', 'Preppy', 'Edgy', 'Classic', 'Trendy'],
    optionLabel: 'YOUR STYLE',
    hasImage: true, imagePlaceholder: '🧍 Your Photo (optional)',
    hasText: true, textLabel: 'DESCRIBE YOUR LIFESTYLE',
    textPlaceholder: 'e.g. Office worker, loves outdoor brunches, budget-conscious…',
  },
};

export default function AIStudioFeatureScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const featureKey = route.params?.feature || 'aesthetic';
  const config = FEATURE_CONFIG[featureKey];
  const wardrobe = useAppStore(s => s.wardrobe);

  const [selectedOption, setSelectedOption] = useState(config.options?.[0] || '');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageB64, setImageB64] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const pickImage = async () => {
    const res = await launchImageLibrary({mediaType: 'photo', quality: 0.8, includeBase64: true});
    if (res.assets?.[0]) {
      setImageUri(res.assets[0].uri || null);
      setImageB64(res.assets[0].base64 || null);
    }
  };

  const handleRun = async () => {
    setLoading(true);
    setResult(null);
    try {
      const params: Record<string, any> = {option: selectedOption, text};
      if (featureKey === 'mix' && wardrobe.length > 0) {
        params.wardrobeItems = wardrobe.slice(0, 10).map(w => w.name).join(', ');
      }
      const res = await runAIFeature({
        feature: featureKey as any,
        imageBase64: imageB64 || undefined,
        params,
      });
      setResult(res.result);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{config.emoji} {config.title}</Text>
        <View style={{width: 50}} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.desc}>{config.desc}</Text>

        {/* Image Upload */}
        {config.hasImage && (
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.uploadBox, imageUri && styles.uploadBoxFilled]}
              onPress={pickImage}>
              {imageUri ? (
                <View style={styles.uploadedRow}>
                  <Text style={styles.uploadedText}>✅ Image selected</Text>
                  <Text style={styles.changeText}>Change</Text>
                </View>
              ) : (
                <Text style={styles.uploadPlaceholder}>{config.imagePlaceholder}</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Option Pills */}
        {config.options && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{config.optionLabel}</Text>
            <View style={styles.pills}>
              {config.options.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.pill, selectedOption === opt && {
                    backgroundColor: config.color + '22',
                    borderColor: config.color,
                  }]}
                  onPress={() => setSelectedOption(opt)}>
                  <Text style={[styles.pillText, selectedOption === opt && {color: config.color}]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Text Input */}
        {config.hasText && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{config.textLabel}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={config.textPlaceholder}
              placeholderTextColor={COLORS.textMuted}
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={3}
            />
          </View>
        )}

        {/* Run Button */}
        <TouchableOpacity onPress={handleRun} disabled={loading} style={styles.runBtnWrap} activeOpacity={0.85}>
          <LinearGradient
            colors={loading ? [COLORS.border, COLORS.border] : [config.color, config.color + 'bb']}
            style={styles.runBtn}
            start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
            {loading ? (
              <ActivityIndicator color={COLORS.text} />
            ) : (
              <Text style={styles.runBtnText}>{config.emoji} Generate</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Result */}
        {result && (
          <View style={styles.resultCard}>
            <LinearGradient colors={[config.color + '18', 'transparent']} style={styles.resultHeader}>
              <Text style={[styles.resultLabel, {color: config.color}]}>AI Result</Text>
              <Text style={styles.resultSub}>Nano Banana AI</Text>
            </LinearGradient>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        )}

        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.bg},
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  back: {color: COLORS.accent, fontSize: FONTS.sizes.md},
  headerTitle: {fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text},

  content: {padding: SPACING.lg},
  desc: {fontSize: FONTS.sizes.md, color: COLORS.textMuted, lineHeight: 24, marginBottom: SPACING.lg},

  section: {marginBottom: SPACING.lg},
  sectionLabel: {fontSize: FONTS.sizes.xs, color: COLORS.textMuted, fontWeight: '700', letterSpacing: 1, marginBottom: SPACING.sm},

  uploadBox: {
    padding: SPACING.lg, backgroundColor: COLORS.surface2,
    borderRadius: RADIUS.lg, borderWidth: 2, borderColor: COLORS.border,
    borderStyle: 'dashed', alignItems: 'center',
  },
  uploadBoxFilled: {borderStyle: 'solid', borderColor: COLORS.accent3},
  uploadPlaceholder: {fontSize: FONTS.sizes.md, color: COLORS.textMuted},
  uploadedRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'},
  uploadedText: {fontSize: FONTS.sizes.md, color: COLORS.text},
  changeText: {fontSize: FONTS.sizes.sm, color: COLORS.accent3},

  pills: {flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm},
  pill: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm - 2,
    borderRadius: RADIUS.round, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  pillText: {fontSize: FONTS.sizes.sm, color: COLORS.textMuted, fontWeight: '500'},

  textInput: {
    backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md, padding: SPACING.md,
    color: COLORS.text, fontSize: FONTS.sizes.md, lineHeight: 22,
    minHeight: 80, textAlignVertical: 'top',
  },

  runBtnWrap: {},
  runBtn: {
    paddingVertical: SPACING.md + 2, borderRadius: RADIUS.lg,
    alignItems: 'center', justifyContent: 'center',
  },
  runBtnText: {fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.black},

  resultCard: {
    marginTop: SPACING.lg, backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
  },
  resultHeader: {
    padding: SPACING.md, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
  },
  resultLabel: {fontSize: FONTS.sizes.sm, fontWeight: '800', letterSpacing: 0.5},
  resultSub: {fontSize: FONTS.sizes.xs, color: COLORS.textMuted},
  resultText: {
    padding: SPACING.md, fontSize: FONTS.sizes.md,
    color: COLORS.text, lineHeight: 26,
  },
});
