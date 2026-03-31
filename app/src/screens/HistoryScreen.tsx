// HistoryScreen.tsx
import React, {useState} from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {COLORS, FONTS, SPACING, RADIUS} from '../utils/theme';
import {useAppStore, TryOnResult} from '../store/appStore';
import {useNavigation} from '@react-navigation/native';
import {format} from 'date-fns';

export function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const history = useAppStore(s => s.history);
  const toggleLike = useAppStore(s => s.toggleLike);
  const clearHistory = useAppStore(s => s.clearHistory);
  const removeHistoryItem = useAppStore(s => s.removeHistoryItem);

  const renderItem = ({item}: {item: TryOnResult}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('TryOnResult', {resultId: item.id})}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardEmoji}>
          {item.mode === 'mannequin' ? '🪆' : item.mode === 'url' ? '🔗' : item.mode === 'snap' ? '📷' : '✨'}
        </Text>
      </View>
      <View style={styles.cardMid}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.analysisText.substring(0, 50)}…
        </Text>
        <Text style={styles.cardSub}>
          {item.mode.toUpperCase()} • {format(new Date(item.timestamp), 'd MMM, h:mm a')}
        </Text>
      </View>
      <View style={styles.cardRight}>
        <TouchableOpacity onPress={() => toggleLike(item.id)}>
          <Text style={{fontSize: 20}}>{item.liked ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeHistoryItem(item.id)}>
          <Text style={styles.delBtn}>🗑</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={() => Alert.alert('Clear All', 'Remove all history?', [
            {text: 'Clear', style: 'destructive', onPress: clearHistory},
            {text: 'Cancel', style: 'cancel'},
          ])}>
            <Text style={styles.clearBtn}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🕐</Text>
          <Text style={styles.emptyTitle}>No history yet</Text>
          <Text style={styles.emptySub}>Your try-ons will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={i => i.id}
          renderItem={renderItem}
          contentContainerStyle={{padding: SPACING.lg}}
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
  clearBtn: {color: COLORS.accent2, fontSize: FONTS.sizes.sm},

  card: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md, marginBottom: SPACING.md,
  },
  cardLeft: {
    width: 48, height: 48, borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface2, alignItems: 'center', justifyContent: 'center',
  },
  cardEmoji: {fontSize: 24},
  cardMid: {flex: 1},
  cardTitle: {fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.text},
  cardSub: {fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 3},
  cardRight: {gap: SPACING.sm, alignItems: 'center'},
  delBtn: {fontSize: 16, opacity: 0.6},

  empty: {flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.sm},
  emptyEmoji: {fontSize: 56},
  emptyTitle: {fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text},
  emptySub: {fontSize: FONTS.sizes.sm, color: COLORS.textMuted},
});

export default HistoryScreen;
