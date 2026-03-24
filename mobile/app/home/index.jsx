import { useState, useEffect, useRef } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Animated, Alert, Platform, ActivityIndicator
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

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function HomeScreen() {
  const [worker, setWorker] = useState(null)
  const [location, setLocation] = useState(null)
  const [zone, setZone] = useState(null)
  const [locError, setLocError] = useState(false)
  const pulsAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const homeFallback = setTimeout(() => {
      if (!worker) {
        console.warn("Home fallback triggered. AsyncStorage hung.");
        router.replace('/')
      }
    }, 1500)

    AsyncStorage.getItem('worker')
      .then(val => {
        clearTimeout(homeFallback)
        if (!val) { router.replace('/'); return }
        setWorker(JSON.parse(val))
      })
      .catch(e => {
        clearTimeout(homeFallback)
        console.error("Home AsyncStorage Error", e)
        router.replace('/')
      })
    startLocationWatch()
    // Pulse animation for live indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulsAnim, { toValue: 1.3, duration: 800, useNativeDriver: false }),
        Animated.timing(pulsAnim, { toValue: 1, duration: 800, useNativeDriver: false }),
      ])
    ).start()
  }, [])

  async function startLocationWatch() {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') { setLocError(true); return }
    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 5 },
      (loc) => {
        setLocation(loc.coords)
        const { zone: z } = getNearestZone(loc.coords.latitude, loc.coords.longitude)
        setZone(z)
      }
    )
  }

  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm('Are you sure you want to log out?');
      if (confirmLogout) {
        setLoggingOut(true);
        await AsyncStorage.multiRemove(['worker', 'worker_tasks']);
        router.replace('/');
      }
    } else {
      Alert.alert('End Shift', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out', style: 'destructive',
          onPress: async () => {
            setLoggingOut(true)
            await AsyncStorage.multiRemove(['worker', 'worker_tasks'])
            router.replace('/')
          }
        }
      ])
    }
  }

  const isCheckedIn = worker?.checkedIn

  if (!worker) return null

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeft} onPress={() => router.push('/home/profile')} activeOpacity={0.8}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(worker.name)}</Text>
          </View>
          <View>
            <Text style={styles.workerName}>{worker.name}</Text>
            <Text style={styles.workerId}>ID: {worker.id}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} disabled={loggingOut}>
          {loggingOut ? <ActivityIndicator size="small" color={colors.accentRed} /> : <Text style={styles.logoutText}>⏻</Text>}
        </TouchableOpacity>
      </View>

      {/* Status badge */}
      <View style={[styles.statusBadge, isCheckedIn ? styles.badgeActive : styles.badgeWaiting]}>
        <Animated.View style={[styles.statusDot, { transform: [{ scale: pulsAnim }],
          backgroundColor: isCheckedIn ? colors.accentGreen : colors.accentAmber }]} />
        <Text style={[styles.statusText, { color: isCheckedIn ? colors.accentGreen : colors.accentAmber }]}>
          {isCheckedIn ? `✅  CHECKED IN · ${worker.checkTime}` : '⏳  AWAITING CHECK-IN'}
        </Text>
      </View>

      {/* GPS Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📡 Live Location</Text>
        {locError ? (
          <Text style={styles.errorText}>Location permission denied</Text>
        ) : location ? (
          <>
            <Text style={styles.gpsCoords}>
              {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
            </Text>
            <Text style={styles.accuracy}>Accuracy: ±{Math.round(location.accuracy)}m</Text>
            {zone && (
              <View style={styles.zoneRow}>
                <Text style={styles.zoneIcon}>📍</Text>
                <Text style={styles.zoneName}>{zone.name}</Text>
              </View>
            )}
          </>
        ) : (
          <Text style={styles.locLoading}>🔍  Fetching GPS location…</Text>
        )}
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</Text>
          <Text style={styles.statLabel}>Today's Date</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.accentGreen }]}>
            {isCheckedIn ? '✓ Active' : '—'}
          </Text>
          <Text style={styles.statLabel}>Shift Status</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <Text style={styles.sectionTitle}>ACTIONS</Text>

      <TouchableOpacity
        style={[styles.actionBtn, styles.actionPrimary]}
        onPress={() => router.push('/home/checkin')}
        activeOpacity={0.8}
      >
        <Text style={styles.actionIcon}>📍</Text>
        <View>
          <Text style={styles.actionTitle}>GPS Check-In</Text>
          <Text style={styles.actionSub}>Capture your location + geofence verify</Text>
        </View>
        <Text style={styles.actionArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionBtn, styles.actionSecondary]}
        onPress={() => router.push('/home/camera')}
        activeOpacity={0.8}
      >
        <Text style={styles.actionIcon}>📸</Text>
        <View>
          <Text style={styles.actionTitle}>Photo Proof</Text>
          <Text style={styles.actionSub}>Geo-tagged photo of work site</Text>
        </View>
        <Text style={styles.actionArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionBtn, styles.actionSecondary]}
        onPress={() => router.push('/home/tasks')}
        activeOpacity={0.8}
      >
        <Text style={styles.actionIcon}>📋</Text>
        <View>
          <Text style={styles.actionTitle}>My Tasks</Text>
          <Text style={styles.actionSub}>View worklists given by manager</Text>
        </View>
        <Text style={styles.actionArrow}>›</Text>
      </TouchableOpacity>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgPrimary },
  content: { padding: 20, paddingTop: 56, paddingBottom: 40 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.accentBlue,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  workerName: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  workerId: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  logoutBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  logoutText: { fontSize: 18 },

  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 14, borderRadius: radius.sm,
    borderWidth: 1, marginBottom: 16,
  },
  badgeActive: { backgroundColor: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.3)' },
  badgeWaiting: { backgroundColor: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.3)' },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },

  card: {
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    padding: 18, marginBottom: 16,
  },
  cardTitle: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  gpsCoords: { fontSize: 18, fontWeight: '700', color: colors.accentBlue, fontVariant: ['tabular-nums'], letterSpacing: 0.5 },
  accuracy: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  zoneRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  zoneIcon: { fontSize: 14 },
  zoneName: { fontSize: 13, color: colors.textPrimary, fontWeight: '500' },
  locLoading: { fontSize: 13, color: colors.textMuted, fontStyle: 'italic' },
  errorText: { fontSize: 13, color: colors.accentRed },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1, backgroundColor: colors.bgCard,
    borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border,
    padding: 14,
  },
  statValue: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.4 },

  sectionTitle: { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.8, marginBottom: 12 },

  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 18, borderRadius: radius.md,
    borderWidth: 1, marginBottom: 12,
  },
  actionPrimary: {
    backgroundColor: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.3)',
    shadowColor: colors.accentBlue, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  actionSecondary: { backgroundColor: colors.bgCard, borderColor: colors.border },
  actionIcon: { fontSize: 28 },
  actionTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  actionSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  actionArrow: { fontSize: 24, color: colors.textMuted, marginLeft: 'auto' },
})
