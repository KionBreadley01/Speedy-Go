import { Colors } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../Lib/firebase';

type TabIconProps = {
  icon: keyof typeof Feather.glyphMap;
  focused: boolean;
  label: string;
  badge?: boolean;
};

const TabIcon = ({ icon, focused, label, badge }: TabIconProps) => (
  <View style={styles.tabItem}>
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Feather name={icon} size={30} color={focused ? Colors.primary : '#000'} />
      {badge && <View style={styles.badge} />}
    </View>
    <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
  </View>
);

export default function TabLayout() {
  const [hasActiveOrder, setHasActiveOrder] = useState(false);

  useEffect(() => {
    let unsubscribeOrders: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid)
        );

        unsubscribeOrders = onSnapshot(q, (snapshot) => {
          const activeOrders = snapshot.docs.filter(doc => {
             const status = doc.data().status;
             return ['pending', 'accepted', 'preparing', 'delivering'].includes(status);
          });
          setHasActiveOrder(activeOrders.length > 0);
        });
      } else {
        setHasActiveOrder(false);
        if (unsubscribeOrders) {
          unsubscribeOrders();
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeOrders) {
        unsubscribeOrders();
      }
    };
  }, []);

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
            <TabIcon icon="home" focused={focused} label="Inicio" />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          href: null, // Esto oculta la pestaña de búsqueda pero permite navegar allí
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="file-text" focused={focused} label="Pedidos" badge={hasActiveOrder} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="user" focused={focused} label="Perfil" />
          ),
        }}
      />
    </Tabs>
  );
}
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#e7e6e1ff', // Un tono de blanco diferente (off-white perlado) para destacar
    borderTopColor: '#000000ff',
    borderTopWidth: 1,
    height: 88, // Más grande
    paddingBottom: 10,
    paddingTop: 10,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 56,
    height: '100%',
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
    color: '#000',
    letterSpacing: 0.3,
  },
  labelActive: {
    fontWeight: '700',
    color: Colors.primary,
  },
});
