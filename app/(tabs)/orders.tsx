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
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { orderService, Order } from '../../Lib/services/orderService';
import { auth } from '../../Lib/firebase';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function OrdersScreen() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = async () => {
        const user = auth.currentUser;
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            const data = await orderService.getUserOrders(user.uid);
            setOrders(data);
        } catch (error) {
            console.error("Error loading orders:", error);
        } finally {
            setLoading(false);
        }
    };

    // Load orders every time the tab is focused
    useFocusEffect(
        useCallback(() => {
            loadOrders();
        }, [])
    );

    const activeOrders = orders.filter(o => ['pending', 'accepted', 'preparing', 'delivering'].includes(o.status));
    const pastOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.status));

    const renderOrderStatus = (status: string) => {
        switch (status) {
            case 'delivered':
                return (
                    <View style={styles.statusRow}>
                        <Feather name="check" size={14} color={Colors.success} style={{ marginRight: 4 }} />
                        <Text style={styles.deliveredText}>Entregado</Text>
                    </View>
                );
            case 'cancelled':
                return (
                    <View style={styles.statusRow}>
                        <Feather name="x" size={14} color="red" style={{ marginRight: 4 }} />
                        <Text style={styles.cancelledText}>Cancelado</Text>
                    </View>
                );
            default:
                return (
                    <View style={styles.statusRow}>
                        <Feather name="clock" size={14} color={Colors.primary} style={{ marginRight: 4 }} />
                        <Text style={styles.pendingText}>En proceso</Text>
                    </View>
                );
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Mis Pedidos</Text>
                <TouchableOpacity 
                    onPress={() => router.push('/cart')}
                    activeOpacity={0.7}
                    style={{ padding: 8 }}
                >
                    <Feather name="shopping-cart" size={24} color={Colors.slate900} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Active Order Banners */}
                {activeOrders.map(activeOrder => (
                    <TouchableOpacity
                        key={activeOrder.id}
                        style={[styles.activeBanner, { marginBottom: 12 }]}
                        onPress={() => router.push({ pathname: '/tracking', params: { orderId: activeOrder.id } } as any)}
                        activeOpacity={0.9}
                    >
                        <View style={styles.activeLeft}>
                            <View style={styles.iconCircle}>
                                <Feather name="truck" size={22} color={Colors.white} />
                            </View>
                            <View>
                                <Text style={styles.activeStatus}>
                                    {activeOrder.status === 'delivering' ? 'En camino' : 'En proceso'}
                                </Text>
                                {/* We don't have the restaurant name in the order data easily without a join, so fallback to "Tu pedido" */}
                                <Text style={styles.activeRestaurant}>Tu pedido #{activeOrder.id?.substring(0, 4)}</Text>
                            </View>
                        </View>
                        <View style={styles.etaBadge}>
                            <Feather name="chevron-right" size={20} color={Colors.primary} />
                        </View>
                    </TouchableOpacity>
                ))}

                {/* History label */}
                <Text style={styles.historyLabel}>Historial</Text>

                {loading ? (
                    <View style={{ padding: 40, alignItems: 'center' }}>
                         <Text style={{ color: Colors.gray400 }}>Cargando pedidos...</Text>
                    </View>
                ) : pastOrders.length === 0 && activeOrders.length === 0 ? (
                    <View style={{ padding: 40, alignItems: 'center' }}>
                         <Text style={{ color: Colors.gray400, fontSize: 16 }}>Aún no tienes pedidos.</Text>
                    </View>
                ) : (
                    pastOrders.map(order => (
                        <View key={order.id} style={styles.pastOrderCard}>
                            <View style={styles.pastOrderRow}>
                                <View style={styles.pastOrderLogoPlaceholder}>
                                    <Feather name="shopping-bag" size={20} color={Colors.slate500} />
                                </View>
                                <View style={styles.pastOrderInfo}>
                                    <Text style={styles.pastOrderName}>Pedido #{order.id?.substring(0,6)}</Text>
                                    <Text style={styles.pastOrderMeta}>
                                        {formatDate(order.createdAt)} • {order.items?.length || 0} artículos
                                    </Text>
                                    {renderOrderStatus(order.status)}
                                </View>
                                <Text style={styles.pastOrderTotal}>${order.totalAmount.toFixed(2)}</Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.reorderBtn} 
                                activeOpacity={0.8}
                                onPress={() => router.push({ pathname: '/tracking', params: { orderId: order.id } } as any)}
                            >
                                <Text style={styles.reorderBtnText}>Ver detalles</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundLight },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray100,
    },
    title: { fontSize: 22, fontWeight: '700', color: Colors.slate900 },
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
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
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
        padding: 6,
        borderRadius: 16,
    },
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
    statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    deliveredText: { fontSize: 12, fontWeight: '500', color: Colors.success },
    cancelledText: { fontSize: 12, fontWeight: '500', color: 'red' },
    pendingText: { fontSize: 12, fontWeight: '500', color: Colors.primary },
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
