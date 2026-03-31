import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Linking} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {COLORS, FONTS, SPACING, RADIUS} from '../utils/theme';
import {useNavigation} from '@react-navigation/native';
import {fetchProductFromUrl} from '../services/api';
import {useAppStore} from '../store/appStore';

// ─────────────────────────────────────
// PROFILE SCREEN
// ─────────────────────────────────────
export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const history = useAppStore(s => s.history);
  const wardrobe = useAppStore(s => s.wardrobe);

  const STATS = [
    {label: 'Try-Ons', value: history.length},
    {label: 'Wardrobe', value: wardrobe.length},
    {label: 'Saved', value: history.filter(h => h.liked).length},
  ];

  return (
    <View style={[pStyles.container, {paddingTop: insets.top}]}>
      <View style={pStyles.header}>
        <Text style={pStyles.headerTitle}>Profile</Text>
      </View>
      <ScrollView>
        {/* Avatar */}
        <View style={pStyles.avatarSection}>
          <View style={pStyles.avatar}><Text style={{fontSize: 48}}>👤</Text></View>
          <Text style={pStyles.userName}>Fashion Enthusiast</Text>
          <Text style={pStyles.userSub}>Lookr Member</Text>
        </View>

        {/* Stats */}
        <View style={pStyles.statsRow}>
          {STATS.map(s => (
            <View key={s.label} style={pStyles.statCard}>
              <Text style={pStyles.statValue}>{s.value}</Text>
              <Text style={pStyles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Upgrade */}
        <View style={pStyles.proCard}>
          <Text style={pStyles.proEmoji}>⚡</Text>
          <View style={{flex: 1}}>
            <Text style={pStyles.proTitle}>Upgrade to Pro</Text>
            <Text style={pStyles.proSub}>Unlimited try-ons, HD exports, priority AI</Text>
          </View>
          <TouchableOpacity style={pStyles.proBtn}>
            <Text style={pStyles.proBtnText}>Upgrade</Text>
          </TouchableOpacity>
        </View>

        {/* Settings */}
        {[
          {icon: '🔑', label: 'API Settings', action: () => {}},
          {icon: '🔒', label: 'Privacy Policy', action: () => Linking.openURL('https://yourapp.com/privacy')},
          {icon: '📋', label: 'Terms of Service', action: () => Linking.openURL('https://yourapp.com/terms')},
          {icon: '⭐', label: 'Rate Lookr', action: () => {}},
          {icon: '💬', label: 'Contact Support', action: () => Linking.openURL('mailto:support@lookr.app')},
        ].map(item => (
          <TouchableOpacity key={item.label} style={pStyles.menuItem} onPress={item.action}>
            <Text style={pStyles.menuIcon}>{item.icon}</Text>
            <Text style={pStyles.menuLabel}>{item.label}</Text>
            <Text style={pStyles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}

        <Text style={pStyles.version}>Lookr v1.0.0 · Powered by Nano Banana</Text>
      </ScrollView>
    </View>
  );
}

const pStyles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.bg},
  header: {
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: {fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.text},
  avatarSection: {alignItems: 'center', padding: SPACING.xl},
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: COLORS.surface2, borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md,
  },
  userName: {fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text},
  userSub: {fontSize: FONTS.sizes.sm, color: COLORS.textMuted, marginTop: 4},
  statsRow: {
    flexDirection: 'row', marginHorizontal: SPACING.lg, gap: SPACING.md, marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, alignItems: 'center',
  },
  statValue: {fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.accent},
  statLabel: {fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2},
  proCard: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    marginHorizontal: SPACING.lg, marginBottom: SPACING.lg,
    backgroundColor: COLORS.accent + '18', borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.accent + '44', padding: SPACING.md,
  },
  proEmoji: {fontSize: 28},
  proTitle: {fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text},
  proSub: {fontSize: FONTS.sizes.xs, color: COLORS.textMuted},
  proBtn: {
    backgroundColor: COLORS.accent, paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm, borderRadius: RADIUS.round,
  },
  proBtnText: {fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.black},
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  menuIcon: {fontSize: 20, width: 28},
  menuLabel: {flex: 1, fontSize: FONTS.sizes.md, color: COLORS.text},
  menuArrow: {fontSize: 20, color: COLORS.textMuted},
  version: {textAlign: 'center', padding: SPACING.xl, fontSize: FONTS.sizes.xs, color: COLORS.textMuted},
});

// ─────────────────────────────────────
// PRODUCT URL SCREEN
// ─────────────────────────────────────
export function ProductURLScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);

  const QUICK_LINKS = [
    {name: 'Amazon.in', icon: '🛒', url: 'https://www.amazon.in/'},
    {name: 'Myntra', icon: '👗', url: 'https://www.myntra.com/'},
    {name: 'Ajio', icon: '✨', url: 'https://www.ajio.com/'},
    {name: 'Flipkart', icon: '🛍️', url: 'https://www.flipkart.com/'},
    {name: 'Zara', icon: '🔲', url: 'https://www.zara.com/in/'},
    {name: 'H&M', icon: '🏷️', url: 'https://www2.hm.com/en_in/'},
  ];

  const handleFetch = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const data = await fetchProductFromUrl(url);
      setProduct(data);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not fetch product');
    }
    setLoading(false);
  };

  return (
    <View style={[urlStyles.container, {paddingTop: insets.top}]}>
      <View style={urlStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={urlStyles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={urlStyles.title}>Product URL</Text>
        <View style={{width: 50}} />
      </View>
      <ScrollView contentContainerStyle={{padding: SPACING.lg}}>
        <Text style={urlStyles.desc}>
          Paste a product link from any shopping app or website. Our AI will extract the product image and let you try it on.
        </Text>
        <View style={urlStyles.inputRow}>
          <TextInput
            style={urlStyles.input}
            placeholder="https://www.myntra.com/dress/…"
            placeholderTextColor={COLORS.textMuted}
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            keyboardType="url"
          />
          <TouchableOpacity style={urlStyles.fetchBtn} onPress={handleFetch} disabled={loading}>
            <Text style={urlStyles.fetchBtnText}>{loading ? '…' : 'Fetch'}</Text>
          </TouchableOpacity>
        </View>
        {product && (
          <View style={urlStyles.productCard}>
            <Text style={urlStyles.productName}>{product.name}</Text>
            <Text style={urlStyles.productBrand}>{product.brand} · {product.price}</Text>
            <TouchableOpacity style={urlStyles.useBtn} onPress={() => navigation.goBack()}>
              <Text style={urlStyles.useBtnText}>✨ Use This Item</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={urlStyles.quickLabel}>QUICK LINKS</Text>
        <View style={urlStyles.quickGrid}>
          {QUICK_LINKS.map(q => (
            <TouchableOpacity key={q.name} style={urlStyles.quickItem} onPress={() => setUrl(q.url)}>
              <Text style={urlStyles.quickIcon}>{q.icon}</Text>
              <Text style={urlStyles.quickName}>{q.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const urlStyles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.bg},
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  back: {color: COLORS.accent, fontSize: FONTS.sizes.md},
  title: {fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text},
  desc: {fontSize: FONTS.sizes.sm, color: COLORS.textMuted, lineHeight: 22, marginBottom: SPACING.lg},
  inputRow: {flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg},
  input: {
    flex: 1, backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    color: COLORS.text, fontSize: FONTS.sizes.sm,
  },
  fetchBtn: {
    backgroundColor: COLORS.accent, paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center',
  },
  fetchBtnText: {fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.black},
  productCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.accent + '44', padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  productName: {fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text},
  productBrand: {fontSize: FONTS.sizes.sm, color: COLORS.textMuted, marginTop: 4},
  useBtn: {
    backgroundColor: COLORS.accent, borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm, alignItems: 'center', marginTop: SPACING.md,
  },
  useBtnText: {fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.black},
  quickLabel: {fontSize: FONTS.sizes.xs, color: COLORS.textMuted, fontWeight: '700', letterSpacing: 1, marginBottom: SPACING.sm},
  quickGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm},
  quickItem: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  quickIcon: {fontSize: 16},
  quickName: {fontSize: FONTS.sizes.sm, color: COLORS.text},
});

// ─────────────────────────────────────
// WARDROBE DETAIL SCREEN
// ─────────────────────────────────────
export function WardrobeDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  return (
    <View style={[{flex: 1, backgroundColor: COLORS.bg, paddingTop: insets.top}]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: SPACING.lg}}>
        <Text style={{color: COLORS.accent}}>← Back</Text>
      </TouchableOpacity>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: COLORS.textMuted}}>Wardrobe Detail</Text>
      </View>
    </View>
  );
}

export default ProfileScreen;
