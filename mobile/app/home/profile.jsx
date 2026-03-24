import { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  ActivityIndicator, RefreshControl
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { colors, radius } from '../../constants/theme'

export default function WorkerProfileScreen() {
  const [worker, setWorker] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [refreshing, setRefreshing] = useState(true)

  useEffect(() => {
    fetchProfileData()
  }, [])

  async function fetchProfileData() {
    setRefreshing(true)
    try {
      const raw = await AsyncStorage.getItem('worker')
      if (raw) {
        setWorker(JSON.parse(raw))
      }
      
      // Simulate API call to Spring Boot: GET /api/v1/workers/{id}/stats
      // For now, we calculate locally based on assigned tasks if available.
      const taskRaw = await AsyncStorage.getItem('worker_tasks')
      let total = 12
      let completed = 8
      let pending = 4

      if (taskRaw) {
        const tasks = JSON.parse(taskRaw)
        total = tasks.length
        completed = tasks.filter(t => t.status === 'completed').length
        pending = total - completed
      }

      setMetrics({
        activeDays: 45,
        currentStreak: 5,
        tasksTotal: total,
        tasksCompleted: completed,
        tasksPending: pending,
        rating: 4.8
      })
    } catch (e) {
      console.error("Failed fetching profile", e)
    } finally {
      setRefreshing(false)
    }
  }

  if (refreshing && !metrics) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accentBlue} size="large" />
      </View>
    )
  }

  return (
    <ScrollView 
      style={styles.root} 
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchProfileData} tintColor={colors.accentBlue} />}
    >
      {/* Profile Header */}
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {worker?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'W'}
          </Text>
        </View>
        <Text style={styles.name}>{worker?.name || 'Worker Name'}</Text>
        <Text style={styles.workerId}>ID: {worker?.id || 'WRK-000'}</Text>
        
        <View style={styles.ratingBox}>
          <Text style={styles.ratingText}>⭐ {metrics?.rating} Performance</Text>
        </View>
      </View>

      {/* Analytics Grid */}
      <Text style={styles.sectionTitle}>PERFORMANCE ANALYTICS</Text>

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>{metrics?.activeDays}</Text>
          <Text style={styles.gridLabel}>Active Days</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={[styles.gridVal, { color: colors.accentAmber }]}>🔥 {metrics?.currentStreak}</Text>
          <Text style={styles.gridLabel}>Day Streak</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={[styles.gridVal, { color: colors.accentGreen }]}>{metrics?.tasksCompleted}</Text>
          <Text style={styles.gridLabel}>Tasks Done</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={[styles.gridVal, { color: colors.accentRed }]}>{metrics?.tasksPending}</Text>
          <Text style={styles.gridLabel}>Pending</Text>
        </View>
      </View>

      {/* Detailed Insights */}
      <Text style={styles.sectionTitle}>RECENT ACTIVITY INSIGHTS</Text>

      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>Task Completion Rate</Text>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${(metrics?.tasksCompleted / metrics?.tasksTotal) * 100 || 0}%` }]} />
        </View>
        <Text style={styles.insightSub}>
          {metrics?.tasksCompleted} out of {metrics?.tasksTotal} assignments completed successfully.
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>💡</Text>
        <Text style={styles.infoText}>
          Maintain your check-in streak to increase your priority for the upcoming zone rotation selections next month.
        </Text>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgPrimary },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bgPrimary },
  content: { padding: 20 },

  headerCard: {
    backgroundColor: colors.bgCard, borderRadius: radius.lg,
    alignItems: 'center', padding: 24, paddingVertical: 32,
    borderWidth: 1, borderColor: colors.border, marginBottom: 24,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(59,130,246,0.1)', borderWidth: 2, borderColor: colors.accentBlue,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  avatarText: { fontSize: 28, fontWeight: '800', color: colors.accentBlue },
  name: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  workerId: { fontSize: 14, color: colors.textMuted, marginBottom: 16 },
  
  ratingBox: {
    backgroundColor: 'rgba(245,158,11,0.1)', paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)'
  },
  ratingText: { fontSize: 13, fontWeight: '700', color: colors.accentAmber },

  sectionTitle: { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.8, marginBottom: 16 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  gridItem: {
    flex: 1, minWidth: '45%', backgroundColor: colors.bgCard,
    borderRadius: radius.md, padding: 16, borderWidth: 1, borderColor: colors.border,
  },
  gridVal: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  gridLabel: { fontSize: 12, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },

  insightCard: {
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 16,
  },
  insightTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  barBg: { height: 8, backgroundColor: colors.bgSecondary, borderRadius: 4, overflow: 'hidden', marginBottom: 12 },
  barFill: { height: '100%', backgroundColor: colors.accentBlue, borderRadius: 4 },
  insightSub: { fontSize: 13, color: colors.textSecondary },

  infoBox: {
    flexDirection: 'row', backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: radius.md,
    padding: 16, borderWidth: 1, borderColor: 'rgba(59,130,246,0.3)', gap: 12, marginBottom: 40,
  },
  infoIcon: { fontSize: 20 },
  infoText: { flex: 1, fontSize: 12, color: colors.accentBlue, lineHeight: 18 },
})
