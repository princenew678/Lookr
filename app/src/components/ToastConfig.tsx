import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, FONTS, SPACING, RADIUS} from '../utils/theme';

export const toastConfig = {
  success: ({text1, text2}: any) => (
    <View style={[styles.toast, styles.success]}>
      <Text style={styles.icon}>✅</Text>
      <View>
        <Text style={styles.text1}>{text1}</Text>
        {text2 && <Text style={styles.text2}>{text2}</Text>}
      </View>
    </View>
  ),
  error: ({text1, text2}: any) => (
    <View style={[styles.toast, styles.error]}>
      <Text style={styles.icon}>❌</Text>
      <View>
        <Text style={styles.text1}>{text1}</Text>
        {text2 && <Text style={styles.text2}>{text2}</Text>}
      </View>
    </View>
  ),
  info: ({text1, text2}: any) => (
    <View style={[styles.toast, styles.info]}>
      <Text style={styles.icon}>ℹ️</Text>
      <View>
        <Text style={styles.text1}>{text1}</Text>
        {text2 && <Text style={styles.text2}>{text2}</Text>}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  toast: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg, marginHorizontal: SPACING.lg,
    borderWidth: 1,
  },
  success: {backgroundColor: COLORS.accent + '18', borderColor: COLORS.accent + '60'},
  error: {backgroundColor: COLORS.accent2 + '18', borderColor: COLORS.accent2 + '60'},
  info: {backgroundColor: COLORS.accent3 + '18', borderColor: COLORS.accent3 + '60'},
  icon: {fontSize: 18},
  text1: {fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.text},
  text2: {fontSize: FONTS.sizes.xs, color: COLORS.textMuted},
});
