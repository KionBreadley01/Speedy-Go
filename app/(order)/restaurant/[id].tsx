import { Colors } from '@/constants/colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
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
import { restaurantService, Restaurant } from '../../../Lib/services/restaurantService';
import { useCartStore, Product } from '../../../store/cartStore';

export default function RestaurantMenu() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const cartItems = useCartStore((state) => state.items);
    const cartTotalPrice = useCartStore((state) => state.getTotalPrice());
    const cartTotalItems = useCartStore((state) => state.getTotalItems());
    const addItemToCart = useCartStore((state) => state.addItem);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                const [resData, prodData] = await Promise.all([
                    restaurantService.getRestaurantById(id),
                    restaurantService.getProductsByRestaurant(id)
                ]);
                setRestaurant(resData);
                setProducts(prodData);
            } catch (error) {
                console.error("Error loading restaurant details:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleAddToCart = (product: Product) => {
        addItemToCart(product, 1);
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!restaurant) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
                <TouchableOpacity
                    style={[styles.backBtn, { position: 'absolute', top: 16, left: 16 }]}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Feather name="chevron-left" size={26} color={Colors.slate900} />
                </TouchableOpacity>
                <Text style={{ fontSize: 16, color: Colors.slate500, fontWeight: '500' }}>Restaurante no encontrado</Text>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <SafeAreaView edges={['top']} style={styles.headerSafe}>
                <View style={styles.headerTop}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <Feather name="chevron-left" size={26} color={Colors.slate900} />
                    </TouchableOpacity>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Feather name="search" size={20} color={Colors.slate900} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Feather name="more-horizontal" size={20} color={Colors.slate900} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.restaurantInfo}>
                    <View style={styles.restaurantLeft}>
                        <Text style={styles.restaurantName}>{restaurant.name}</Text>
                        <View style={styles.metaRow}>
                            <Feather name="star" size={14} color="#FBBF24" fill="#FBBF24" />
                            <Text style={styles.metaValue}>{restaurant.rating}</Text>
                            <Text style={styles.metaSep}>•</Text>
                            <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
                            <Text style={styles.metaSep}>•</Text>
                            <Text style={styles.freeDelivery}>{restaurant.deliveryFee === 0 ? 'Free Delivery' : `$${restaurant.deliveryFee}`}</Text>
                        </View>
                    </View>
                    <Image
                        source={{ uri: restaurant.image }}
                        style={styles.restaurantLogo}
                    />
                </View>

                {/* Category tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabsRow}
                >
                    <TouchableOpacity style={styles.tabActive}>
                        <Text style={styles.tabActiveText}>Entradas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabText}>Platos Fuertes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabText}>Bebidas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabText}>Postres</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>

            {/* Menu Items */}
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.sectionTitle}>Platos Fuertes</Text>

                {products.map((item, i) => (
                    <View key={item.id}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => router.push(`/product/${item.id}` as any)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.menuItemInfo}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemDesc} numberOfLines={2}>
                                    {item.description}
                                </Text>
                                <View style={styles.itemBottom}>
                                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                                    <TouchableOpacity 
                                        style={styles.addBtn} 
                                        activeOpacity={0.8}
                                        onPress={() => handleAddToCart(item)}
                                    >
                                        <Text style={styles.addBtnText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {item.image && <Image source={{ uri: item.image }} style={styles.itemImage} />}
                        </TouchableOpacity>
                        <View style={styles.divider} />
                    </View>
                ))}
            </ScrollView>

            {cartTotalItems > 0 && (
                <View style={styles.cartBarWrap}>
                    <TouchableOpacity
                        style={styles.cartBar}
                        onPress={() => router.push('/cart')}
                        activeOpacity={0.9}
                    >
                        <View style={styles.cartCount}>
                            <Text style={styles.cartCountText}>{cartTotalItems} items</Text>
                        </View>
                        <Text style={styles.cartLabel}>Ver Carrito</Text>
                        <Text style={styles.cartTotal}>${cartTotalPrice.toFixed(2)}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundLight },
    headerSafe: { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: { fontSize: 20, color: Colors.slate900 },
    headerActions: { flexDirection: 'row', gap: 4 },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconBtnText: { fontSize: 20 },
    restaurantInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingBottom: 12,
        gap: 12,
    },
    restaurantLeft: { flex: 1 },
    restaurantName: { fontSize: 22, fontWeight: '800', color: Colors.slate900, letterSpacing: -0.5 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    star: { fontSize: 15 },
    metaValue: { fontSize: 13, fontWeight: '700', color: Colors.slate900 },
    metaSep: { fontSize: 13, color: Colors.slate400 },
    metaText: { fontSize: 13, color: Colors.slate500 },
    freeDelivery: { fontSize: 13, fontWeight: '700', color: Colors.primary },
    restaurantLogo: {
        width: 60,
        height: 60,
        borderRadius: 16,
    },
    tabsRow: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
    tabActive: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
    },
    tabActiveText: { fontSize: 13, fontWeight: '700', color: Colors.white },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: Colors.gray100,
    },
    tabText: { fontSize: 13, fontWeight: '600', color: Colors.slate500 },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 120, paddingTop: 16 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: Colors.slate900, marginBottom: 16 },
    menuItem: { flexDirection: 'row', gap: 16, alignItems: 'flex-start', marginBottom: 16 },
    menuItemInfo: { flex: 1, gap: 4 },
    tagRow: { flexDirection: 'row' },
    tag: { backgroundColor: `${Colors.primary}18`, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
    tagText: { fontSize: 10, fontWeight: '700', color: Colors.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
    itemName: { fontSize: 15, fontWeight: '700', color: Colors.slate900 },
    itemDesc: { fontSize: 13, color: Colors.slate500, lineHeight: 18 },
    itemBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
    itemPrice: { fontSize: 15, fontWeight: '700', color: Colors.slate900 },
    addBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.gray100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addBtnText: { fontSize: 20, color: Colors.primary, lineHeight: 24 },
    itemImage: { width: 104, height: 104, borderRadius: 16 },
    divider: { height: 1, backgroundColor: Colors.gray100, marginBottom: 16 },
    cartBarWrap: { position: 'absolute', bottom: 24, left: 20, right: 20 },
    cartBar: {
        backgroundColor: Colors.primary,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
    },
    cartCount: {
        backgroundColor: 'rgba(255,255,255,0.22)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
    },
    cartCountText: { fontSize: 13, fontWeight: '700', color: Colors.white },
    cartLabel: { fontSize: 15, fontWeight: '700', color: Colors.white },
    cartTotal: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
