import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { colors } from '../constants/theme'

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bgSecondary },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '700', fontSize: 16 },
          contentStyle: { backgroundColor: colors.bgPrimary },
          headerShadowVisible: false,
          headerBackTitle: '',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home/index" options={{ headerShown: false }} />
        <Stack.Screen
          name="home/checkin"
          options={{
            title: 'GPS Check-In',
            headerStyle: { backgroundColor: colors.bgSecondary },
          }}
        />
        <Stack.Screen
          name="home/camera"
          options={{
            title: 'Photo Proof',
            headerStyle: { backgroundColor: colors.bgSecondary },
          }}
        />
        <Stack.Screen
          name="home/tasks"
          options={{
            title: 'My Tasks',
            headerStyle: { backgroundColor: colors.bgSecondary },
          }}
        />
        <Stack.Screen
          name="home/profile"
          options={{
            title: 'Analytics Profile',
            headerStyle: { backgroundColor: colors.bgSecondary },
          }}
        />
        <Stack.Screen
          name="public/map"
          options={{
            title: 'Live Traffic Map',
            headerStyle: { backgroundColor: colors.bgSecondary },
          }}
        />
      </Stack>
    </>
  )
}
