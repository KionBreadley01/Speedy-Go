import { Colors } from '@/constants/colors';
import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

type TabIconProps = {
  icon: string;
  focused: boolean;
  label: string;
  badge?: boolean;
};

const TabIcon = ({ icon, focused, label, badge }: TabIconProps) => (
  <View style={styles.tabItem}>
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Text style={[styles.icon, focused && styles.iconActive]}>{icon}</Text>
      {badge && <View style={styles.badge} />}
    </View>
    <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
  </View>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏠" focused={focused} label="Inicio" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🔍" focused={focused} label="Buscar" />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🧾" focused={focused} label="Pedidos" badge />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👤" focused={focused} label="Perfil" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderTopColor: '#f3f4f6',
    borderTopWidth: 1,
    height: 80,
    paddingBottom: 16,
    paddingTop: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    minWidth: 56,
  },
  iconWrap: {
    width: 56,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: `${Colors.primary}18`,
  },
  icon: {
    fontSize: 22,
  },
  iconActive: {
    // emoji stays same but bg changes
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: '#fff',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.gray400,
    letterSpacing: 0.3,
  },
  labelActive: {
    fontWeight: '700',
    color: Colors.primary,
  },
});
