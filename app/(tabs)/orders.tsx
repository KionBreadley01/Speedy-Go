import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrdersScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Mis Pedidos</Text>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Active Order Banner */}
                <TouchableOpacity
                    style={styles.activeBanner}
                    onPress={() => router.push('/tracking' as any)}
                    activeOpacity={0.9}
                >
                    <View style={styles.activeLeft}>
                        <View style={styles.mopedCircle}>
                            <Text style={styles.mopedEmoji}>🛵</Text>
                        </View>
                        <View>
                            <Text style={styles.activeStatus}>En camino</Text>
                            <Text style={styles.activeRestaurant}>McDonald's</Text>
                        </View>
                    </View>
                    <View style={styles.etaBadge}>
                        <Text style={styles.etaText}>15 min</Text>
                    </View>
                </TouchableOpacity>

                {/* History label */}
                <Text style={styles.historyLabel}>Historial</Text>

                {/* Past orders */}
                <View style={styles.pastOrderCard}>
                    <View style={styles.pastOrderRow}>
                        <Image
                            source={{
                                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkdJA5zNrY2Bbxt6RIWlbPHuH4kE48gwIpzPd3AvkfOjPFbZpEGKcZ4_lpGvvLx4NcyQFKL8FLhtG65rg460LfwMF1KfnMlsR6rnnBnygJAQtDGIKLmDv3ywVTugot_lHqC8HJQw7TM_EKv6IBecJ9M3hjL53YSDGYKW7n9Q39_ekwpjyA6wOnlr6uCb8FDiw5Mn0YrADHabhRyM5YkBIuUbOvrnzXkKYtjVgRlbi3O_36_sJtji4SkJEQe_SKa2qctmAAlDrvCVq6',
                            }}
                            style={styles.pastOrderLogo}
                        />
                        <View style={styles.pastOrderInfo}>
                            <Text style={styles.pastOrderName}>Burger King</Text>
                            <Text style={styles.pastOrderMeta}>12 Oct, 14:30 • 3 artículos</Text>
                            <View style={styles.deliveredRow}>
                                <Text style={styles.checkIcon}>✅</Text>
                                <Text style={styles.deliveredText}>Entregado</Text>
                            </View>
                        </View>
                        <Text style={styles.pastOrderTotal}>$15.50</Text>
                    </View>
                    <TouchableOpacity style={styles.reorderBtn} activeOpacity={0.8}>
                        <Text style={styles.reorderBtnText}>Volver a pedir</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.pastOrderCard}>
                    <View style={styles.pastOrderRow}>
                        <View style={styles.pastOrderLogoPlaceholder}>
                            <Text style={{ fontSize: 24 }}>🍣</Text>
                        </View>
                        <View style={styles.pastOrderInfo}>
                            <Text style={styles.pastOrderName}>Sushi Express</Text>
                            <Text style={styles.pastOrderMeta}>9 Oct, 19:15 • 5 artículos</Text>
                            <View style={styles.deliveredRow}>
                                <Text style={styles.checkIcon}>✅</Text>
                                <Text style={styles.deliveredText}>Entregado</Text>
                            </View>
                        </View>
                        <Text style={styles.pastOrderTotal}>$32.80</Text>
                    </View>
                    <TouchableOpacity style={styles.reorderBtn} activeOpacity={0.8}>
                        <Text style={styles.reorderBtnText}>Volver a pedir</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundLight },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray100,
    },
    title: { fontSize: 22, fontWeight: '700', color: Colors.slate900, textAlign: 'center' },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 100, paddingTop: 16, gap: 16 },
    activeBanner: {
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 5,
        backgroundColor: Colors.primary,
    },
    activeLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    mopedCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mopedEmoji: { fontSize: 22 },
    activeStatus: {
        fontSize: 11,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.85)',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    activeRestaurant: { fontSize: 17, fontWeight: '700', color: Colors.white },
    etaBadge: {
        backgroundColor: Colors.white,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    etaText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
    historyLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.gray400,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    pastOrderCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.gray100,
        gap: 12,
    },
    pastOrderRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    pastOrderLogo: { width: 48, height: 48, borderRadius: 24 },
    pastOrderLogoPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.gray100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pastOrderInfo: { flex: 1 },
    pastOrderName: { fontSize: 15, fontWeight: '700', color: Colors.slate900 },
    pastOrderMeta: { fontSize: 12, color: Colors.slate500, marginTop: 2 },
    deliveredRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    checkIcon: { fontSize: 12 },
    deliveredText: { fontSize: 12, fontWeight: '500', color: Colors.success },
    pastOrderTotal: { fontSize: 15, fontWeight: '700', color: Colors.slate900 },
    reorderBtn: {
        borderWidth: 1.5,
        borderColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: 'center',
    },
    reorderBtnText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
});
