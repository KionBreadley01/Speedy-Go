import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore';
import { orderService } from '../../Lib/services/orderService';
import { restaurantService, Restaurant } from '../../Lib/services/restaurantService';
import { auth } from '../../Lib/firebase';

export default function CartScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

    const cartItems = useCartStore((state) => state.items);
    const restaurantId = useCartStore((state) => state.restaurantId);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const clearCart = useCartStore((state) => state.clearCart);
    const cartTotalPrice = useCartStore((state) => state.getTotalPrice());

    const deliveryFee: number = 0; 
    const tax = cartTotalPrice * 0.16;
    const finalTotal = cartTotalPrice + deliveryFee + tax;

    useEffect(() => {
        if (restaurantId) {
            restaurantService.getRestaurantById(restaurantId).then(setRestaurant);
        } else {
            setRestaurant(null);
        }
    }, [restaurantId]);

    const handleCheckout = async (itemToCheckout: any, itemFinalTotal: number) => {
        const user = auth.currentUser;
        if (!user) {
            alert("Debes iniciar sesión para realizar un pedido.");
            router.push('/login');
            return;
        }

        setLoading(true);

        try {
            const address = "123 Main St, Apt 4B"; 

            const orderId = await orderService.placeOrder(
                user.uid,
                restaurantId as string, // Technically item.restaurantId, but fast-bound
                [itemToCheckout], // Solamente pagar este producto
                itemFinalTotal,
                address
            );

            // Eliminar producto pagado del carrito
            updateQuantity(itemToCheckout.id, 0);

            router.navigate('/(tabs)/orders');

            setTimeout(() => {
                router.push({
                    pathname: '/tracking',
                    params: { orderId }
                } as any);
            }, 100);

        } catch (error) {
            console.error("Error creating order:", error);
            alert("Hubo un error al procesar tu pedido.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Feather name="chevron-left" size={26} color={Colors.slate900} />
                    <Text style={styles.title}>Carrito</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.ordersBtn}
                    onPress={() => router.navigate('/(tabs)/orders')} 
                    activeOpacity={0.7}
                >
                    <Feather name="file-text" size={16} color={Colors.slate900} />
                    <Text style={styles.ordersBtnText}>Pedidos</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {cartItems.length === 0 ? (
                    <View style={{ padding: 40, alignItems: 'center' }}>
                        <Text style={{ color: Colors.gray400, fontSize: 16 }}>Tu carrito está vacío</Text>
                    </View>
                ) : (
                    cartItems.map((item) => {
                        const itemDeliveryFee = 0;
                        const itemTax = (item.price * item.quantity) * 0.16;
                        const itemFinalTotal = (item.price * item.quantity) + itemDeliveryFee + itemTax;

                        return (
                            <View key={item.id} style={styles.restaurantCard}>
                                {/* Card Header */}
                                <View style={styles.cardHeaderRow}>
                                    <TouchableOpacity style={styles.restaurantRow} activeOpacity={0.7}>
                                        <Text style={styles.restaurantName}>{restaurant?.name || 'Cargando...'}</Text>
                                        <Feather name="chevron-right" size={18} color={Colors.slate900} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => updateQuantity(item.id, 0)} activeOpacity={0.7} style={styles.trashBtn}>
                                        <Feather name="trash-2" size={20} color={Colors.slate500} />
                                    </TouchableOpacity>
                                </View>

                                {/* Item */}
                                <View style={styles.cartItem}>
                                    {item.image && (
                                        <Image source={{ uri: item.image }} style={styles.itemImg} />
                                    )}
                                    <View style={styles.itemInfo}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        
                                        <View style={styles.priceRow}>
                                            <Text style={styles.itemPrice}>MX${(item.price || 0).toFixed(2)}</Text>
                                            <Text style={styles.itemOriginalPrice}>MX${((item.price || 0) * 1.3).toFixed(2)}</Text>
                                        </View>
                                        
                                        <View style={styles.badgeRow}>
                                            <View style={styles.newUsersBadge}>
                                                <Text style={styles.newUsersText}>Sólo nuevos usuarios</Text>
                                            </View>
                                            
                                            <View style={styles.qtyControlRow}>
                                                <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)} activeOpacity={0.7}>
                                                    <Feather name="minus-circle" size={26} color={Colors.slate900} />
                                                </TouchableOpacity>
                                                <Text style={styles.qtyValue}>{item.quantity}</Text>
                                                <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} activeOpacity={0.7}>
                                                    <Feather name="plus-circle" size={26} color={Colors.slate900} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Options */}
                                <TouchableOpacity style={styles.optionRow}>
                                    <View style={styles.optionLeft}>
                                        <Feather name="hash" size={20} color={Colors.slate800} /> 
                                        <Text style={styles.optionText}>Cubiertos</Text>
                                    </View>
                                    <View style={styles.checkbox} />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.optionRow}>
                                    <View style={styles.optionLeft}>
                                        <Feather name="edit-2" size={18} color={Colors.slate800} />
                                        <Text style={styles.optionText}>Agregar una nota</Text>
                                    </View>
                                    <Feather name="chevron-right" size={22} color={Colors.slate800} />
                                </TouchableOpacity>

                                {/* Footer & Checkout */}
                                <View style={styles.checkoutRow}>
                                    <View style={styles.checkoutInfo}>
                                        <Text style={styles.checkoutTotal}>MX${itemFinalTotal.toFixed(2)}</Text>
                                        <Text style={styles.checkoutSubtext}>Ahorraste MX${(itemFinalTotal * 0.3).toFixed(2)}</Text>
                                        <Text style={styles.checkoutShippingCheck}>Envío gratis</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.checkoutBtn}
                                        onPress={() => handleCheckout(item, itemFinalTotal)}
                                        activeOpacity={0.85}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color={Colors.white} />
                                        ) : (
                                            <Text style={styles.checkoutBtnText}>Pagar</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f2f2f4' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#f2f2f4',
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: { fontSize: 18, fontWeight: '700', color: Colors.slate900 },
    ordersBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.white,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.gray200,
    },
    ordersBtnText: { fontSize: 13, fontWeight: '600', color: Colors.slate900 },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 60, paddingTop: 6, gap: 16 },
    restaurantCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
        elevation: 2,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    restaurantRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.slate900,
    },
    trashBtn: { padding: 4 },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 24,
    },
    itemImg: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: Colors.gray100,
    },
    itemInfo: { flex: 1, gap: 4 },
    itemName: { fontSize: 15, fontWeight: '500', color: Colors.slate900 },
    priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    itemPrice: { fontSize: 15, fontWeight: '700', color: '#e55a15' },
    itemOriginalPrice: { fontSize: 12, color: Colors.slate400, textDecorationLine: 'line-through' },
    badgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
    newUsersBadge: {
        backgroundColor: '#ffebe0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    newUsersText: { color: '#e55a15', fontSize: 10, fontWeight: '600' },
    qtyControlRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    qtyValue: { fontSize: 15, fontWeight: '600', color: Colors.slate900, minWidth: 14, textAlign: 'center' },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.gray100,
    },
    optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    optionText: { fontSize: 15, fontWeight: '500', color: Colors.slate900 },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colors.gray200,
    },
    checkoutRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 16,
    },
    checkoutInfo: { gap: 2 },
    checkoutTotal: { fontSize: 18, fontWeight: '800', color: Colors.slate900 },
    checkoutSubtext: { fontSize: 11, color: '#e55a15', fontWeight: '500' },
    checkoutShippingCheck: { fontSize: 11, color: '#e55a15', fontWeight: '500' },
    checkoutBtn: {
        backgroundColor: '#f76a1c',
        borderRadius: 999,
        paddingHorizontal: 40,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#f76a1c',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    checkoutBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
});
