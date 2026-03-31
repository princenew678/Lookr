import React, {useState, useCallback} from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, ActivityIndicator, Alert, Dimensions, Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import {COLORS, FONTS, SPACING, RADIUS} from '../utils/theme';
import {tryOnOutfit, fetchProductFromUrl} from '../services/api';
import {useAppStore} from '../store/appStore';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const MODES = [
  {key: 'photo', label: 'Your Photo', emoji: '📸'},
  {key: 'url', label: 'Product URL', emoji: '🔗'},
  {key: 'mannequin', label: 'Mannequin', emoji: '🪆'},
  {key: 'snap', label: 'Snap', emoji: '📷'},
];

const CLOTH_TYPES = [
  {key: 'upper', label: 'Top'},
  {key: 'lower', label: 'Bottom'},
  {key: 'full', label: 'Dress'},
  {key: 'accessory', label: 'Accessory'},
];

const LOADING_MSGS = [
  'Analysing clothing…',
  'Fitting to your body…',
  'Adjusting shadows…',
  'Polishing your look…',
];

export default function TryOnScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const addHistory = useAppStore(s => s.addHistory);

  const [mode, setMode] = useState('photo');
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [clothImage, setClothImage] = useState<string | null>(null);
  const [productUrl, setProductUrl] = useState('');
  const [clothType, setClothType] = useState('upper');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MSGS[0]);
  const [strength, setStrength] = useState(7);

  const pickImage = useCallback(async (type: 'person' | 'cloth', source: 'library' | 'camera' = 'library') => {
    const options = {mediaType: 'photo' as const, quality: 0.8, includeBase64: true};
    const fn = source === 'camera' ? launchCamera : launchImageLibrary;
    const result = await fn(options);
    if (result.assets?.[0]) {
      const asset = result.assets[0];
      const uri = asset.uri || '';
      const b64 = asset.base64 || '';
      if (type === 'person') setPersonImage(uri);
      else setClothImage(uri);
      Toast.show({type: 'success', text1: type === 'person' ? 'Your photo ready!' : 'Clothing uploaded!'});
    }
  }, []);

  const handleTryOn = async () => {
    if (!clothImage && !productUrl) {
      Alert.alert('Missing Item', 'Please upload a clothing item or paste a product URL.');
      return;
    }

    setLoading(true);
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MSGS.length;
      setLoadingMsg(LOADING_MSGS[msgIdx]);
    }, 2000);

    try {
      // Convert images to base64
      let personB64: string | undefined;
      let clothB64: string | undefined;

      if (personImage) {
        const response = await fetch(personImage);
        const blob = await response.blob();
        personB64 = await blobToBase64(blob);
      }
      if (clothImage) {
        const response = await fetch(clothImage);
        const blob = await response.blob();
        clothB64 = await blobToBase64(blob);
      }

      const result = await tryOnOutfit({
        personImageBase64: personB64,
        clothImageBase64: clothB64,
        productUrl: productUrl || undefined,
        clothType,
        strength,
        mode: mode as any,
      });

      clearInterval(interval);
      setLoading(false);

      if (result.success) {
        const id = Date.now().toString();
        await addHistory({
          id,
          personImageUri: personImage || undefined,
          clothImageUri: clothImage || undefined,
          analysisText: result.analysis,
          mode,
          timestamp: new Date().toISOString(),
        });
        navigation.navigate('TryOnResult', {resultId: id});
      } else {
        throw new Error(result.error || 'Try-on failed');
      }
    } catch (err: any) {
      clearInterval(interval);
      setLoading(false);
      Alert.alert('Error', err.message || 'Something went wrong. Please try again.');
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onloadend = () => res((reader.result as string).split(',')[1]);
      reader.onerror = rej;
      reader.readAsDataURL(blob);
    });

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>Look<Text style={{color: COLORS.accent}}>r</Text></Text>
          <Text style={styles.headerSub}>Powered by Nano Banana AI</Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Mode Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modeRow}>
          {MODES.map(m => (
            <TouchableOpacity
              key={m.key}
              style={[styles.modeTab, mode === m.key && styles.modeTabActive]}
              onPress={() => setMode(m.key)}>
              <Text style={styles.modeEmoji}>{m.emoji}</Text>
              <Text style={[styles.modeLabel, mode === m.key && {color: COLORS.text}]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Upload Cards */}
        <View style={styles.uploadRow}>
          {/* Person Photo */}
          <TouchableOpacity
            style={styles.uploadCard}
            onPress={() => {
              Alert.alert('Select Source', 'Choose image source', [
                {text: 'Camera', onPress: () => pickImage('person', 'camera')},
                {text: 'Gallery', onPress: () => pickImage('person', 'library')},
                {text: 'Cancel', style: 'cancel'},
              ]);
            }}>
            {personImage ? (
              <>
                <Image source={{uri: personImage}} style={styles.uploadPreview} />
                <View style={styles.uploadBadge}><Text style={styles.uploadBadgeText}>You</Text></View>
              </>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Text style={styles.uploadPlaceholderEmoji}>🧍</Text>
                <Text style={styles.uploadPlaceholderTitle}>Your Photo</Text>
                <Text style={styles.uploadPlaceholderHint}>Full-body works best</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Plus */}
          <View style={styles.plusIcon}><Text style={styles.plusText}>＋</Text></View>

          {/* Cloth */}
          <TouchableOpacity
            style={styles.uploadCard}
            onPress={() => {
              if (mode === 'snap') {
                pickImage('cloth', 'camera');
              } else {
                Alert.alert('Select Source', 'Choose image source', [
                  {text: 'Camera', onPress: () => pickImage('cloth', 'camera')},
                  {text: 'Gallery', onPress: () => pickImage('cloth', 'library')},
                  {text: 'Cancel', style: 'cancel'},
                ]);
              }
            }}>
            {clothImage ? (
              <>
                <Image source={{uri: clothImage}} style={styles.uploadPreview} />
                <View style={[styles.uploadBadge, {backgroundColor: COLORS.accent2}]}>
                  <Text style={styles.uploadBadgeText}>Item</Text>
                </View>
              </>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Text style={styles.uploadPlaceholderEmoji}>
                  {mode === 'mannequin' ? '🪆' : mode === 'snap' ? '📷' : '👗'}
                </Text>
                <Text style={styles.uploadPlaceholderTitle}>
                  {mode === 'mannequin' ? 'Mannequin Photo' : mode === 'snap' ? 'Snap Clothing' : 'Clothing Item'}
                </Text>
                <Text style={styles.uploadPlaceholderHint}>
                  {mode === 'snap' ? 'Tap to snap in store' : 'Tap to upload'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Cloth Type */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CLOTHING TYPE</Text>
          <View style={styles.chipRow}>
            {CLOTH_TYPES.map(t => (
              <TouchableOpacity
                key={t.key}
                style={[styles.chip, clothType === t.key && styles.chipActive]}
                onPress={() => setClothType(t.key)}>
                <Text style={[styles.chipText, clothType === t.key && {color: COLORS.accent}]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Product URL (for url mode) */}
        {mode === 'url' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>PRODUCT URL</Text>
            <TouchableOpacity
              style={styles.urlBtn}
              onPress={() => navigation.navigate('ProductURL')}>
              <Text style={styles.urlBtnText}>
                {productUrl ? '🔗 ' + productUrl.substring(0, 40) + '…' : '🔗 Paste product URL from any store'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Try On Button */}
        <TouchableOpacity
          onPress={handleTryOn}
          disabled={loading}
          activeOpacity={0.85}
          style={styles.tryOnBtnWrap}>
          <LinearGradient
            colors={loading ? [COLORS.border, COLORS.border] : [COLORS.accent, '#a8e832']}
            style={styles.tryOnBtn}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={COLORS.text} size="small" />
                <Text style={[styles.tryOnBtnText, {color: COLORS.textMuted}]}>{loadingMsg}</Text>
              </View>
            ) : (
              <Text style={styles.tryOnBtnText}>✨ Try On Now</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Tips for best results</Text>
          <Text style={styles.tipItem}>• Use a clear, well-lit full-body photo</Text>
          <Text style={styles.tipItem}>• Simple background works best</Text>
          <Text style={styles.tipItem}>• Clothing on white background preferred</Text>
          <Text style={styles.tipItem}>• Front-facing pose recommended</Text>
        </View>

        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
}

const CARD_W = (width - SPACING.lg * 2 - SPACING.md * 2 - 32) / 2;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.bg},
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  logo: {fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.text},
  headerSub: {fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 1},
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: SPACING.sm, paddingVertical: 4,
    backgroundColor: COLORS.surface2, borderRadius: RADIUS.round,
    borderWidth: 1, borderColor: COLORS.border,
  },
  liveDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.accent},
  liveText: {fontSize: FONTS.sizes.xs, color: COLORS.accent, fontWeight: '700', letterSpacing: 1},

  scroll: {flex: 1},

  modeRow: {paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md},
  modeTab: {
    alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
    marginRight: SPACING.sm, backgroundColor: COLORS.surface,
  },
  modeTabActive: {backgroundColor: COLORS.surface2, borderColor: COLORS.accent3},
  modeEmoji: {fontSize: 22},
  modeLabel: {fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2, fontWeight: '600'},

  uploadRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: SPACING.lg, gap: SPACING.md,
  },
  uploadCard: {
    width: CARD_W, aspectRatio: 3 / 4,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed',
    overflow: 'hidden', position: 'relative',
  },
  uploadPreview: {width: '100%', height: '100%', resizeMode: 'cover'},
  uploadBadge: {
    position: 'absolute', bottom: 8, left: 8,
    backgroundColor: COLORS.accent, borderRadius: RADIUS.sm,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  uploadBadgeText: {fontSize: FONTS.sizes.xs, fontWeight: '700', color: COLORS.black},
  uploadPlaceholder: {flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6},
  uploadPlaceholderEmoji: {fontSize: 36},
  uploadPlaceholderTitle: {fontSize: FONTS.sizes.sm, color: COLORS.text, fontWeight: '600', textAlign: 'center'},
  uploadPlaceholderHint: {fontSize: FONTS.sizes.xs, color: COLORS.textMuted, textAlign: 'center'},

  plusIcon: {alignItems: 'center', justifyContent: 'center'},
  plusText: {fontSize: FONTS.sizes.xl, color: COLORS.textMuted},

  section: {paddingHorizontal: SPACING.lg, marginTop: SPACING.lg},
  sectionLabel: {fontSize: FONTS.sizes.xs, color: COLORS.textMuted, fontWeight: '700', letterSpacing: 1, marginBottom: SPACING.sm},

  chipRow: {flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap'},
  chip: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm - 2,
    borderRadius: RADIUS.round, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  chipActive: {borderColor: COLORS.accent, backgroundColor: COLORS.accent + '18'},
  chipText: {fontSize: FONTS.sizes.sm, color: COLORS.textMuted, fontWeight: '500'},

  urlBtn: {
    padding: SPACING.md, backgroundColor: COLORS.surface2,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
  },
  urlBtnText: {fontSize: FONTS.sizes.sm, color: COLORS.textMuted},

  tryOnBtnWrap: {marginHorizontal: SPACING.lg, marginTop: SPACING.lg},
  tryOnBtn: {
    borderRadius: RADIUS.lg, paddingVertical: SPACING.md + 2,
    alignItems: 'center', justifyContent: 'center',
  },
  tryOnBtnText: {fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.black},
  loadingRow: {flexDirection: 'row', alignItems: 'center', gap: SPACING.sm},

  tipsCard: {
    margin: SPACING.lg, padding: SPACING.md,
    backgroundColor: COLORS.surface2, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border,
    gap: 6,
  },
  tipsTitle: {fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.text, marginBottom: 4},
  tipItem: {fontSize: FONTS.sizes.xs, color: COLORS.textMuted, lineHeight: 20},
});
