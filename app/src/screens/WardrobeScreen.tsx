import React, {useState} from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, Alert, Dimensions, TextInput,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {launchImageLibrary} from 'react-native-image-picker';
import {COLORS, FONTS, SPACING, RADIUS} from '../utils/theme';
import {useAppStore, WardrobeItem} from '../store/appStore';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');
const CARD_W = (width - SPACING.lg * 2 - SPACING.sm) / 2;

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Dresses', 'Accessories', 'Outerwear', 'Outfits'];

export default function WardrobeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const wardrobe = useAppStore(s => s.wardrobe);
  const addWardrobeItem = useAppStore(s => s.addWardrobeItem);
  const removeWardrobeItem = useAppStore(s => s.removeWardrobeItem);

  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = wardrobe.filter(w => {
    const matchCat = filter === 'All' || w.category.toLowerCase() === filter.toLowerCase();
    const matchSearch = !search || w.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAdd = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo', quality: 0.8,
    });
    if (result.assets?.[0]?.uri) {
      const uri = result.assets[0].uri!;
      Alert.alert('Add to Wardrobe', 'What is this item?', [
        {
          text: 'Top / Shirt', onPress: () => saveItem(uri, 'New Top', 'tops'),
        },
        {
          text: 'Bottom / Pants', onPress: () => saveItem(uri, 'New Bottom', 'bottoms'),
        },
        {
          text: 'Dress', onPress: () => saveItem(uri, 'New Dress', 'dresses'),
        },
        {
          text: 'Accessory', onPress: () => saveItem(uri, 'New Accessory', 'accessories'),
        },
        {text: 'Cancel', style: 'cancel'},
      ]);
    }
  };

  const saveItem = async (uri: string, name: string, category: string) => {
    await addWardrobeItem({
      id: Date.now().toString(),
      name, category, imageUri: uri,
      addedAt: new Date().toISOString(),
    });
    Toast.show({type: 'success', text1: 'Added to wardrobe!'});
  };

  const handleDelete = (item: WardrobeItem) => {
    Alert.alert('Remove Item', `Remove "${item.name}" from wardrobe?`, [
      {text: 'Remove', style: 'destructive', onPress: () => removeWardrobeItem(item.id)},
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const handleTryOn = (item: WardrobeItem) => {
    Toast.show({type: 'info', text1: `"${item.name}" ready to try on!`, text2: 'Go to Try On tab'});
    navigation.navigate('TryOn');
  };

  const renderItem = ({item}: {item: WardrobeItem}) => (
    <View style={styles.card}>
      {item.imageUri ? (
        <Image source={{uri: item.imageUri}} style={styles.cardImg} />
      ) : (
        <View style={[styles.cardImg, styles.cardImgPlaceholder]}>
          <Text style={{fontSize: 36}}>👗</Text>
        </View>
      )}
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cardCat}>{item.category}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.cardBtn} onPress={() => handleTryOn(item)}>
          <Text style={styles.cardBtnText}>Try</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.cardBtn, styles.cardBtnDanger]} onPress={() => handleDelete(item)}>
          <Text style={[styles.cardBtnText, {color: COLORS.accent2}]}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wardrobe</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items…"
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter chips */}
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={c => c}
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        renderItem={({item: cat}) => (
          <TouchableOpacity
            style={[styles.filterChip, filter === cat && styles.filterChipActive]}
            onPress={() => setFilter(cat)}>
            <Text style={[styles.filterChipText, filter === cat && {color: COLORS.accent}]}>
              {cat}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Grid */}
      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>👗</Text>
          <Text style={styles.emptyTitle}>Your wardrobe is empty</Text>
          <Text style={styles.emptySub}>Add items from your gallery or save try-on results</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={handleAdd}>
            <Text style={styles.emptyBtnText}>+ Add First Item</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  headerTitle: {fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.text},
  addBtn: {
    backgroundColor: COLORS.accent, paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm - 2, borderRadius: RADIUS.round,
  },
  addBtnText: {fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.black},

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: SPACING.lg, marginTop: SPACING.md,
    backgroundColor: COLORS.surface2, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  searchIcon: {fontSize: 16, marginRight: SPACING.sm},
  searchInput: {flex: 1, paddingVertical: SPACING.sm + 2, color: COLORS.text, fontSize: FONTS.sizes.md},

  filterRow: {paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, flexGrow: 0},
  filterChip: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm - 2,
    borderRadius: RADIUS.round, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.surface, marginRight: SPACING.sm,
  },
  filterChipActive: {borderColor: COLORS.accent, backgroundColor: COLORS.accent + '18'},
  filterChipText: {fontSize: FONTS.sizes.xs, color: COLORS.textMuted, fontWeight: '600'},

  grid: {padding: SPACING.lg, gap: SPACING.sm},
  row: {gap: SPACING.sm},

  card: {
    width: CARD_W, backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
  },
  cardImg: {width: '100%', aspectRatio: 3 / 4, resizeMode: 'cover'},
  cardImgPlaceholder: {
    backgroundColor: COLORS.surface2,
    alignItems: 'center', justifyContent: 'center',
  },
  cardInfo: {padding: SPACING.sm},
  cardName: {fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.text},
  cardCat: {
    fontSize: FONTS.sizes.xs, color: COLORS.accent3,
    marginTop: 2, textTransform: 'capitalize',
  },
  cardActions: {
    flexDirection: 'row', gap: SPACING.sm,
    paddingHorizontal: SPACING.sm, paddingBottom: SPACING.sm,
  },
  cardBtn: {
    flex: 1, paddingVertical: SPACING.sm - 2,
    backgroundColor: COLORS.surface2, borderRadius: RADIUS.sm,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  cardBtnDanger: {flex: 0, paddingHorizontal: SPACING.sm},
  cardBtnText: {fontSize: FONTS.sizes.xs, fontWeight: '600', color: COLORS.text},

  emptyState: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl},
  emptyEmoji: {fontSize: 56, marginBottom: SPACING.md},
  emptyTitle: {fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm},
  emptySub: {fontSize: FONTS.sizes.sm, color: COLORS.textMuted, textAlign: 'center', lineHeight: 22},
  emptyBtn: {
    marginTop: SPACING.lg, backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md,
    borderRadius: RADIUS.round,
  },
  emptyBtnText: {fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.black},
});
