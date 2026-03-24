import { useState, useEffect, useRef } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator, Animated,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { colors, radius } from '../constants/theme'

export default function LoginScreen() {
  const [name, setName] = useState('')
  const [workerId, setWorkerId] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Check if already logged in
    // Failsafe: if AsyncStorage hangs (e.g., due to native module mismatch), unlock the screen after 2 seconds.
    const fallbackTimeout = setTimeout(() => {
      setLoading(false)
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: false }).start()
    }, 1500)

    AsyncStorage.getItem('worker')
      .then((val) => {
        clearTimeout(fallbackTimeout)
        if (loading) {
          if (val) {
            router.replace('/home')
          } else {
            setLoading(false)
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: false }).start()
          }
        }
      })
      .catch((e) => {
        clearTimeout(fallbackTimeout)
        console.error("AsyncStorage Error", e)
        if (loading) {
          setLoading(false)
          Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: false }).start()
        }
      })
  }, [])

  const handleLogin = async () => {
    if (!name.trim() || !workerId.trim()) return
    setSubmitting(true)
    const worker = { name: name.trim(), id: workerId.trim(), checkedIn: false, checkTime: null }
    await AsyncStorage.setItem('worker', JSON.stringify(worker))
    router.replace('/home')
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accentBlue} size="large" />
      </View>
    )
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Animated.View style={[styles.inner, { opacity: fadeAnim }]}>

        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>📍</Text>
          </View>
          <Text style={styles.appName}>GeoTrack</Text>
          <Text style={styles.subtitle}>Municipal Workforce System</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Worker Login</Text>
          <Text style={styles.cardSubtitle}>Enter your details to begin your shift</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>👷 Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Ravi Kumar"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>🪪 Worker ID</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. WRK-001"
              placeholderTextColor={colors.textMuted}
              value={workerId}
              onChangeText={setWorkerId}
              autoCapitalize="characters"
            />
          </View>

          <TouchableOpacity
            style={[styles.btn, (!name.trim() || !workerId.trim()) && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={!name.trim() || !workerId.trim() || submitting}
            activeOpacity={0.8}
          >
            {submitting
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Start Shift →</Text>
            }
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, paddingVertical: 12, backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: radius.md, borderWidth: 1, borderColor: 'rgba(59,130,246,0.2)' }}
          onPress={() => router.push('/public/map')}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 20, marginRight: 8 }}>🗺️</Text>
          <Text style={{ color: colors.accentBlue, fontWeight: '700', fontSize: 16 }}>Public Tracking Map</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>GeoTrack v1.0 · Hackathon Demo</Text>
      </Animated.View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgPrimary },
  center: { flex: 1, backgroundColor: colors.bgPrimary, justifyContent: 'center', alignItems: 'center' },
  inner: { flex: 1, justifyContent: 'center', padding: 24 },

  logoWrap: { alignItems: 'center', marginBottom: 40 },
  logoBox: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: colors.accentBlue,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 14,
    shadowColor: colors.accentBlue, shadowOpacity: 0.5, shadowRadius: 16, elevation: 8,
  },
  logoIcon: { fontSize: 36 },
  appName: { fontSize: 32, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 12, color: colors.textMuted, marginTop: 4, letterSpacing: 0.5, textTransform: 'uppercase' },

  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: colors.textMuted, marginBottom: 24 },

  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 8, letterSpacing: 0.3 },
  input: {
    backgroundColor: colors.bgSecondary,
    borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.sm,
    padding: 14,
    fontSize: 15,
    color: colors.textPrimary,
  },

  btn: {
    backgroundColor: colors.accentBlue,
    borderRadius: radius.sm,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: colors.accentBlue, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  footer: { textAlign: 'center', color: colors.textMuted, fontSize: 11, marginTop: 32 },
})
