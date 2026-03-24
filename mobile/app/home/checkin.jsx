import { useState, useEffect, useRef } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, Animated, Alert,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'
import { router } from 'expo-router'
import { colors, radius } from '../../constants/theme'

const ZONES = [
  { name: 'Zone A - Connaught Place', lat: 28.6139, lng: 77.2090 },
  { name: 'Zone B - Karol Bagh',      lat: 28.6229, lng: 77.2210 },
  { name: 'Zone C - Lajpat Nagar',    lat: 28.6080, lng: 77.2150 },
  { name: 'Zone D - Paharganj',       lat: 28.6300, lng: 77.2050 },
  { name: 'Zone E - Saket',           lat: 28.5970, lng: 77.2310 },
  { name: 'Zone F - Model Town',      lat: 28.6450, lng: 77.2180 },
  { name: 'Zone G - Dwarka',          lat: 28.6020, lng: 77.1980 },
  { name: 'Zone H - Shahdara',        lat: 28.6350, lng: 77.2400 },
]
const GEOFENCE_RADIUS_KM = 1.5 // demo-friendly radius

function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function getNearestZone(lat, lng) {
  let best = null, bestDist = Infinity
  for (const z of ZONES) {
    const d = distanceKm(lat, lng, z.lat, z.lng)
    if (d < bestDist) { bestDist = d; best = z }
  }
  return { zone: best, distKm: bestDist }
}

export default function CheckInScreen() {
  const [phase, setPhase] = useState('fetching') // fetching | ready | success
  const [location, setLocation] = useState(null)
  const [zone, setZone] = useState(null)
  const [distKm, setDistKm] = useState(null)
  const [inZone, setInZone] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const rotateAnim = useRef(new Animated.Value(0)).current
  const successScale = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Spin animation while fetching
    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 1500, useNativeDriver: true })
    ).start()
    fetchLocation()
  }, [])

  async function fetchLocation() {
    setPhase('fetching')
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required for check-in.')
      router.back()
      return
    }
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
    setLocation(loc.coords)
    const { zone: z, distKm: d } = getNearestZone(loc.coords.latitude, loc.coords.longitude)
    setZone(z)
    setDistKm(d)
    setInZone(d <= GEOFENCE_RADIUS_KM)
    setPhase('ready')
  }

  async function handleConfirm() {
    setConfirming(true)
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    const raw = await AsyncStorage.getItem('worker')
    const worker = JSON.parse(raw)
    worker.checkedIn = true
    worker.checkTime = timeStr
    worker.checkLat = location.latitude
    worker.checkLng = location.longitude
    worker.checkZone = zone?.name
    await AsyncStorage.setItem('worker', JSON.stringify(worker))

    setPhase('success')
    Animated.spring(successScale, { toValue: 1, useNativeDriver: true, damping: 12 }).start()
    setTimeout(() => router.replace('/home'), 2200)
  }

  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] })

  return (
    <View style={styles.root}>
      {/* ─── FETCHING ─── */}
      {phase === 'fetching' && (
        <View style={styles.centered}>
          <Animated.Text style={[styles.spinnerIcon, { transform: [{ rotate: spin }] }]}>📡</Animated.Text>
          <Text style={styles.fetchTitle}>Acquiring GPS Signal</Text>
          <Text style={styles.fetchSub}>Please stay still for best accuracy</Text>
          <ActivityIndicator color={colors.accentBlue} style={{ marginTop: 20 }} />
        </View>
      )}

      {/* ─── READY ─── */}
      {phase === 'ready' && location && (
        <View style={styles.inner}>

          {/* GPS Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📍 Your Location</Text>
            <Text style={styles.coords}>
              {location.latitude.toFixed(5)},{'\n'}{location.longitude.toFixed(5)}
            </Text>
            <Text style={styles.accuracy}>Accuracy: ±{Math.round(location.accuracy)}m</Text>
          </View>

          {/* Geofence status */}
          <View style={[styles.geoCard, inZone ? styles.geoIn : styles.geoOut]}>
            <Text style={styles.geoIcon}>{inZone ? '✅' : '⚠️'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.geoTitle, { color: inZone ? colors.accentGreen : colors.accentAmber }]}>
                {inZone ? 'Inside geofence' : 'Outside assigned zone'}
              </Text>
              <Text style={styles.geoSub}>
                Nearest: {zone?.name}
              </Text>
              <Text style={styles.geoSub}>
                Distance: {(distKm * 1000).toFixed(0)} m away
              </Text>
            </View>
          </View>

          {!inZone && (
            <View style={styles.warnBox}>
              <Text style={styles.warnText}>
                ⚠️  You are outside your zone ({GEOFENCE_RADIUS_KM} km radius). Check-in will be flagged.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.confirmBtn, inZone ? styles.confirmBtnGreen : styles.confirmBtnAmber]}
            onPress={handleConfirm}
            disabled={confirming}
            activeOpacity={0.8}
          >
            {confirming
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.confirmText}>{inZone ? '✅  Confirm Check-In' : '⚠️  Check-In Anyway'}</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={fetchLocation} style={styles.retryBtn}>
            <Text style={styles.retryText}>🔄  Refresh GPS</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ─── SUCCESS ─── */}
      {phase === 'success' && (
        <View style={styles.centered}>
          <Animated.View style={[styles.successCircle, { transform: [{ scale: successScale }] }]}>
            <Text style={styles.successIcon}>✅</Text>
          </Animated.View>
          <Text style={styles.successTitle}>Checked In!</Text>
          <Text style={styles.successSub}>Your location has been recorded</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgPrimary },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  inner: { flex: 1, padding: 20, paddingTop: 24 },

  spinnerIcon: { fontSize: 56, marginBottom: 24 },
  fetchTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  fetchSub: { fontSize: 14, color: colors.textMuted },

  card: {
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, padding: 20, marginBottom: 16,
  },
  cardTitle: { fontSize: 12, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 },
  coords: { fontSize: 22, fontWeight: '800', color: colors.accentBlue, letterSpacing: 0.5, lineHeight: 30 },
  accuracy: { fontSize: 12, color: colors.textMuted, marginTop: 8 },

  geoCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    padding: 16, borderRadius: radius.md, borderWidth: 1, marginBottom: 12,
  },
  geoIn: { backgroundColor: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.3)' },
  geoOut: { backgroundColor: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.3)' },
  geoIcon: { fontSize: 24, marginTop: 2 },
  geoTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  geoSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },

  warnBox: {
    backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: radius.sm,
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)', padding: 12, marginBottom: 16,
  },
  warnText: { fontSize: 12, color: colors.accentRed, lineHeight: 18 },

  confirmBtn: {
    padding: 18, borderRadius: radius.md, alignItems: 'center', marginBottom: 12,
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  confirmBtnGreen: { backgroundColor: colors.accentGreen, shadowColor: colors.accentGreen },
  confirmBtnAmber: { backgroundColor: colors.accentAmber, shadowColor: colors.accentAmber },
  confirmText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  retryBtn: { alignItems: 'center', padding: 12 },
  retryText: { fontSize: 14, color: colors.textMuted },

  successCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 2, borderColor: colors.accentGreen,
    justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },
  successIcon: { fontSize: 48 },
  successTitle: { fontSize: 28, fontWeight: '800', color: colors.accentGreen, marginBottom: 8 },
  successSub: { fontSize: 15, color: colors.textMuted },
})
