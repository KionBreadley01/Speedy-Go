import { Colors } from '@/constants/colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { orderService, OrderStatus, Order } from '../../../Lib/services/orderService';

export default function TrackingScreen() {
    const router = useRouter();
    const { orderId } = useLocalSearchParams<{ orderId: string }>();
    const pulse = useRef(new Animated.Value(1)).current;

    const [status, setStatus] = useState<OrderStatus>('pending');
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1.4, duration: 700, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
            ])
        ).start();

        if (orderId) {
            const unsubscribe = orderService.subscribeToOrder(orderId, (fetchedOrder) => {
                if (fetchedOrder) {
                    setOrder(fetchedOrder);
                    setStatus(fetchedOrder.status);
                }
                setLoading(false);
            });
            return () => unsubscribe();
        } else {
            setLoading(false);
        }
    }, [orderId]);

    const handleCancelOrder = () => {
        if (!orderId || (status !== 'pending' && status !== 'accepted')) return;
        Alert.alert(
            "Cancelar Pedido",
            "¿Estás seguro de que quieres cancelar este pedido?",
            [
                { text: "No", style: "cancel" },
                {
                    text: "Sí, cancelar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await orderService.cancelOrder(orderId);
                            router.replace('/(tabs)/orders');
                        } catch (error) {
                            Alert.alert("Error", "No se pudo cancelar el pedido. Intenta de nuevo.");
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const getSteps = () => {
        const statuses = ['pending', 'preparing', 'delivering', 'delivered'];
        const currentIndex = statuses.indexOf(status);

        return [
            { id: 'pending', icon: 'check-circle', label: 'Pedido confirmado', done: currentIndex >= 0, active: currentIndex === 0 },
            { id: 'preparing', icon: 'box', label: 'Preparando tu pedido', done: currentIndex >= 1, active: currentIndex === 1 },
            { id: 'delivering', icon: 'truck', label: 'En camino', done: currentIndex >= 2, active: currentIndex === 2 },
            { id: 'delivered', icon: 'home', label: 'Entregado', done: currentIndex >= 3, active: currentIndex === 3 },
        ];
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Top Nav */}
            <View style={styles.topNav}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => router.navigate('/(tabs)/orders')}
                    activeOpacity={0.7}
                >
                    <Feather name="chevron-left" size={26} color={Colors.slate900} />
                </TouchableOpacity>
                <Text style={styles.navTitle}>Estado del Pedido</Text>
                <TouchableOpacity
                    onPress={() => router.push('/incident')}
                    activeOpacity={0.7}
                >
                    <View style={styles.helpBadge}>
                        <Text style={styles.helpText}>Ayuda</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* ETA */}
            <View style={styles.etaSection}>
                <Text style={styles.etaLabel}>Llegada estimada</Text>
                <Text style={styles.etaTime}>12:45 PM</Text>
                <View style={styles.onTimeBadge}>
                    <Feather name="circle" size={10} color={Colors.green700} fill={Colors.green700} />
                    <Text style={styles.onTimeText}>En tiempo</Text>
                </View>
            </View>

            {/* Map area */}
            <View style={styles.mapWrap}>
                <Image
                    source={{
                        uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqHJhOgzwfkMwObpAMXTpUeHF9fJZsXAuzv6I6irnhX-XNPeSvQXFwRZ5T_7aq2CpHg0AOBC9jHL_Zdi0z33mNNugiStLHWZunYqnCHoRiOPWOTo_MSBk8zsLFC3XAILrxrGzYJ8LAzbT1tsLbMWZCcj8DTPeidu2fXHA8IFdbXLyLFWc1vJDhtAOUMc_GFioQsz0YapUjX2vQgX9TfioLKg_6uxC2_uf2YHMsrRGEN9aGWKSLWjgPQpNO5M5hoKF2ueMsVEOGwl-R',
                    }}
                    style={styles.mapImg}
                />
                {/* Rider pin */}
                <View style={styles.pinWrap}>
                    <Animated.View
                        style={[styles.pingRing, { transform: [{ scale: pulse }] }]}
                    />
                    <View style={styles.riderPin}>
                        <Feather name="truck" size={20} color={Colors.white} />
                    </View>
                </View>
            </View>

            {/* Progress steps (Individual Cards) */}
            <View style={styles.stepsContainer}>
                {getSteps().map((step, i) => (
                    <View key={i} style={[styles.stepCard, step.active && styles.stepCardActive]}>
                        <View style={[styles.stepIcon, step.active && styles.stepIconActive]}>
                            <Feather name={step.icon as any} size={20} color={step.active ? Colors.primary : Colors.slate500} />
                        </View>
                        <Text style={[styles.stepLabel, step.active && styles.stepLabelActive]}>
                            {step.label}
                        </Text>
                        {step.done ? <Feather name="check-circle" size={20} color={Colors.success} /> : null}
                    </View>
                ))}

                {(status === 'pending' || status === 'accepted') && (
                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={handleCancelOrder}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.cancelBtnText}>
                            Cancelar pedido
                        </Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.completedLink}
                    onPress={() => router.push('/review')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.completedLinkText}>
                        Simular entrega completada <Feather name="arrow-right" size={12} color={Colors.primary} />
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Order Items */}
            {order?.items && order.items.length > 0 && (
                <View style={styles.itemsCard}>
                    <Text style={styles.itemsCardTitle}>Tu pedido</Text>
                    {order.items.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <View style={styles.itemQtyBadge}>
                                <Text style={styles.itemQtyText}>{item.quantity}x</Text>
                            </View>
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                            </View>
                        </View>
                    ))}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>${order.totalAmount.toFixed(2)}</Text>
                    </View>
                </View>
            )}
        </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundLight },
    topNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    backBtn: {
        width: 40,
        height: 40,
        backgroundColor: Colors.white,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.gray100,
    },
    backIcon: { fontSize: 18, color: Colors.slate800 },
    navTitle: { fontSize: 17, fontWeight: '700', color: Colors.slate900 },
    helpBadge: {
        backgroundColor: `${Colors.primary}18`,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },
    helpText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
    etaSection: { alignItems: 'center', paddingVertical: 16, gap: 4 },
    etaLabel: { fontSize: 12, fontWeight: '600', color: Colors.slate500, textTransform: 'uppercase', letterSpacing: 1 },
    etaTime: { fontSize: 44, fontWeight: '800', color: Colors.slate900, letterSpacing: -1 },
    onTimeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.green100,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
    },
    onTimeDot: { fontSize: 10, color: Colors.green700 },
    onTimeText: { fontSize: 11, fontWeight: '700', color: Colors.green700 },
    mapWrap: {
        marginHorizontal: 16,
        height: 200,
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 1,
        borderColor: Colors.gray200,
    },
    mapImg: { width: '100%', height: '100%' },
    pinWrap: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -24,
        marginLeft: -24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pingRing: {
        position: 'absolute',
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: `${Colors.primary}40`,
    },
    riderPin: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 4,
    },
    riderEmoji: { fontSize: 22 },
    stepsContainer: { paddingHorizontal: 16, marginTop: 24, gap: 12 },
    stepCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        gap: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.gray100,
    },
    stepCardActive: {
        borderColor: `${Colors.primary}40`,
        shadowColor: Colors.primary,
        shadowOpacity: 0.1,
    },
    stepIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.gray100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepIconActive: { backgroundColor: `${Colors.primary}18` },
    stepLabel: { flex: 1, fontSize: 16, color: Colors.slate500, fontWeight: '600' },
    stepLabelActive: { color: Colors.slate900, fontWeight: '800' },
    cancelBtn: { 
        alignItems: 'center', 
        marginTop: 16, 
        paddingVertical: 14,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: 16,
    },
    cancelBtnText: { fontSize: 15, color: '#EF4444', fontWeight: '700' },
    completedLink: { alignItems: 'center', marginTop: 8, paddingVertical: 12 },
    completedLinkText: { fontSize: 13, color: Colors.primary, fontWeight: '700' },
    itemsCard: {
        marginHorizontal: 16,
        marginBottom: 30,
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    itemsCardTitle: { fontSize: 16, fontWeight: '700', color: Colors.slate900, marginBottom: 12 },
    itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    itemQtyBadge: {
        backgroundColor: `${Colors.primary}18`,
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    itemQtyText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
    itemDetails: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    itemName: { fontSize: 14, fontWeight: '500', color: Colors.slate800, flex: 1 },
    itemPrice: { fontSize: 14, fontWeight: '600', color: Colors.slate900, marginLeft: 12 },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.gray100,
        paddingTop: 16,
        marginTop: 4,
    },
    totalLabel: { fontSize: 15, fontWeight: '600', color: Colors.slate500 },
    totalValue: { fontSize: 18, fontWeight: '800', color: Colors.primary },
    scrollContent: { paddingBottom: 40 },
});
