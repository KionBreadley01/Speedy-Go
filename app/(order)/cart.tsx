import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
    const router = useRouter();
    const [qty, setQty] = useState(2);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Mi Carrito</Text>
                <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.clearBtn}>Limpiar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Cart Item */}
                <View style={styles.cartItem}>
                    <Image
                        source={{
                            uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPMwltLOTif0gQd4iMAq3RqKHB4zxUvdAcDqFu1pvkaaan2VXI3gAVQf6jEGOttVWtI1aaHejUOROMq_dVxSR_vTB-vPkFaCXuCl1mXoD6IhP2In0jvEYax2gega4M9maLvx4SgecwPgqaN9DSsDvFPkQ8zAZnrgGHVennXYF_gbIGwjNuC4srnUNm29glQ9vObLJoXMR-mCnZlI-clj1aqkevcu4eUV0-SXZKknPWyNR3FZuSzUcLm8ZwTiQRXt5o_KweF_DceiJF',
                        }}
                        style={styles.itemImg}
                    />
                    <View style={styles.itemInfo}>
                        <View style={styles.itemNameRow}>
                            <Text style={styles.itemName}>Burger Clásica</Text>
                            <Text style={styles.itemPrice}>$12.50</Text>
                        </View>
                        <Text style={styles.itemCustom} numberOfLines={2}>
                            Con queso extra, sin cebolla, pan brioche tostado.
                        </Text>
                        {/* Qty Control */}
                        <View style={styles.qtyRow}>
                            <View style={styles.qtyControl}>
                                <TouchableOpacity
                                    onPress={() => setQty(Math.max(1, qty - 1))}
                                    style={styles.qtyBtn}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.qtyBtnText}>−</Text>
                                </TouchableOpacity>
                                <Text style={styles.qtyValue}>{qty}</Text>
                                <TouchableOpacity
                                    onPress={() => setQty(qty + 1)}
                                    style={styles.qtyBtnPrimary}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.qtyBtnPrimaryText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Promo Code */}
                <View style={styles.promoRow}>
                    <Text style={styles.promoIcon}>🏷️</Text>
                    <Text style={styles.promoText}>Agregar código de descuento</Text>
                    <Text style={styles.promoArrow}>›</Text>
                </View>

                {/* Summary */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>${(12.5 * qty).toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Envío</Text>
                        <Text style={styles.freeShipping}>Gratis</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>IVA (16%)</Text>
                        <Text style={styles.summaryValue}>${(12.5 * qty * 0.16).toFixed(2)}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>${(12.5 * qty * 1.16).toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Checkout button */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.checkoutBtn}
                    onPress={() => router.push('/tracking' as any)}
                    activeOpacity={0.85}
                >
                    <Text style={styles.checkoutBtnText}>Confirmar pedido</Text>
                    <Text style={styles.checkoutArrow}>→</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundLight },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: `${Colors.primary}15`,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: { fontSize: 20, color: Colors.slate900 },
    title: { fontSize: 18, fontWeight: '700', color: Colors.slate900 },
    clearBtn: { fontSize: 14, fontWeight: '600', color: Colors.primary },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 120, paddingTop: 16, gap: 16 },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14,
    },
    itemImg: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: Colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    itemInfo: { flex: 1, gap: 4 },
    itemNameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    itemName: { fontSize: 15, fontWeight: '700', color: Colors.slate900, flex: 1, marginRight: 8 },
    itemPrice: { fontSize: 15, fontWeight: '700', color: Colors.primary },
    itemCustom: { fontSize: 13, color: Colors.slate500, lineHeight: 18 },
    qtyRow: { flexDirection: 'row' },
    qtyControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: `${Colors.primary}25`,
        borderRadius: 999,
        height: 36,
        paddingHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
        gap: 0,
    },
    qtyBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyBtnText: { fontSize: 18, color: Colors.slate500, lineHeight: 22 },
    qtyValue: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.slate900,
        width: 28,
        textAlign: 'center',
    },
    qtyBtnPrimary: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
    },
    qtyBtnPrimaryText: { fontSize: 18, color: Colors.white, lineHeight: 22 },
    promoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: Colors.white,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.gray100,
        borderStyle: 'dashed',
    },
    promoIcon: { fontSize: 18 },
    promoText: { flex: 1, fontSize: 14, color: Colors.slate500, fontWeight: '500' },
    promoArrow: { fontSize: 20, color: Colors.slate400 },
    summaryCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: `${Colors.primary}12`,
    },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    summaryLabel: { fontSize: 14, color: Colors.slate500, fontWeight: '500' },
    summaryValue: { fontSize: 14, color: Colors.slate900, fontWeight: '600' },
    freeShipping: { fontSize: 14, color: Colors.success, fontWeight: '600' },
    divider: { height: 1, backgroundColor: Colors.gray100 },
    totalLabel: { fontSize: 17, fontWeight: '700', color: Colors.slate900 },
    totalValue: { fontSize: 22, fontWeight: '700', color: Colors.primary },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.backgroundLight,
        paddingHorizontal: 16,
        paddingBottom: 32,
        paddingTop: 8,
    },
    checkoutBtn: {
        backgroundColor: Colors.primary,
        borderRadius: 999,
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 7,
    },
    checkoutBtnText: { fontSize: 17, fontWeight: '700', color: Colors.white },
    checkoutArrow: { fontSize: 20, color: Colors.white },
});
