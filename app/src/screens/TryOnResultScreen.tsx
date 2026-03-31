import React, {useMemo} from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Share, Alert,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, FONTS, SPACING, RADIUS} from '../utils/theme';
import {useAppStore} from '../store/appStore';

export default function TryOnResultScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {resultId} = route.params;

  const history = useAppStore(s => s.history);
  const toggleLike = useAppStore(s => s.toggleLike);
  const addWardrobeItem = useAppStore(s => s.addWardrobeItem);

  const result = useMemo(() => history.find(h => h.id === resultId), [history, resultId]);

  if (!result) {
    return (
      <View style={[styles.container, {paddingTop: insets.top, alignItems: 'center', justifyContent: 'center'}]}>
        <Text style={{color: COLORS.textMuted}}>Result not found</Text>
      </View>
    );
  }

  const handleShare = async () => {
    await Share.share({
      message: `Check out my look on Lookr! 👗✨ – Powered by Nano Banana`,
    });
  };

  const handleSaveToWardrobe = () => {
    Alert.prompt?.('Save to Wardrobe', 'Enter a name for this look:', name => {
      if (name) {
        addWardrobeItem({
          id: Date.now().toString(),
          name: name || 'My Look',
          category: 'outfits',
          imageUri: result.clothImageUri || '',
          addedAt: new Date().toISOString(),
        });
        Alert.alert('Saved!', `"${name}" added to your wardrobe.`);
      }
    });
    // Android fallback
    if (!Alert.prompt) {
      addWardrobeItem({
        id: Date.now().toString(),
        name: 'My Look ' + new Date().toLocaleDateString(),
        category: 'outfits',
        imageUri: result.clothImageUri || '',
        addedAt: new Date().toISOString(),
      });
      Alert.alert('Saved!', 'Look saved to your wardrobe.');
    }
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Look</Text>
        <TouchableOpacity onPress={() => toggleLike(result.id)}>
          <Text style={styles.likeBtn}>{result.liked ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Composite */}
        <View style={styles.imageRow}>
          {result.personImageUri && (
            <Image source={{uri: result.personImageUri}} style={styles.previewImg} />
          )}
          <View style={styles.arrowWrap}>
            <Text style={styles.arrow}>✨</Text>
          </View>
          {result.clothImageUri && (
            <Image source={{uri: result.clothImageUri}} style={styles.previewImg} />
          )}
        </View>

        {/* Result Badge */}
        <LinearGradient
          colors={[COLORS.accent + '22', 'transparent']}
          style={styles.resultBadge}>
          <Text style={styles.resultBadgeText}>✨ AI Try-On Analysis</Text>
          <Text style={styles.timestamp}>
            {new Date(result.timestamp).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
            })}
          </Text>
        </LinearGradient>

        {/* Analysis Text */}
        <View style={styles.analysisCard}>
          <Text style={styles.analysisText}>{result.analysisText}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleSaveToWardrobe}>
            <LinearGradient colors={[COLORS.accent, '#a8e832']} style={styles.actionGradient}>
              <Text style={styles.actionBtnText}>👗 Save Look</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.shareBtn]} onPress={handleShare}>
            <Text style={styles.shareBtnText}>🔗 Share</Text>
          </TouchableOpacity>
        </View>

        {/* Try Again */}
        <TouchableOpacity
          style={styles.tryAgainBtn}
          onPress={() => navigation.goBack()}>
          <Text style={styles.tryAgainText}>← Try Another Outfit</Text>
        </TouchableOpacity>

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
  backBtn: {padding: 4},
  backText: {color: COLORS.accent, fontSize: FONTS.sizes.md},
  headerTitle: {fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text},
  likeBtn: {fontSize: 24},

  imageRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: SPACING.lg, gap: SPACING.md,
  },
  previewImg: {
    width: 140, height: 190, borderRadius: RADIUS.lg,
    borderWidth: 2, borderColor: COLORS.border,
  },
  arrowWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  arrow: {fontSize: 22},

  resultBadge: {
    marginHorizontal: SPACING.lg, padding: SPACING.md,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.accent + '44',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  resultBadgeText: {fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.accent},
  timestamp: {fontSize: FONTS.sizes.xs, color: COLORS.textMuted},

  analysisCard: {
    margin: SPACING.lg, padding: SPACING.lg,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
  },
  analysisText: {fontSize: FONTS.sizes.md, color: COLORS.text, lineHeight: 26},

  actionRow: {
    flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: SPACING.md,
  },
  actionBtn: {flex: 1},
  actionGradient: {
    paddingVertical: SPACING.md, borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  actionBtnText: {fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.black},
  shareBtn: {
    backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center',
  },
  shareBtnText: {fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text},

  tryAgainBtn: {
    alignItems: 'center', padding: SPACING.lg,
  },
  tryAgainText: {color: COLORS.accent3, fontSize: FONTS.sizes.md},
});
