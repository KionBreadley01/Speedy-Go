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
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { restaurantService, Restaurant } from '../../Lib/services/restaurantService';
import { useCartStore } from '../../store/cartStore';

const CATEGORIES = [
    { label: 'Pizza',    image: require('../../assets/categories/pizza.png') },
    { label: 'Burger',   image: require('../../assets/categories/burger.png') },
    { label: 'Asian',    image: require('../../assets/categories/sushi.png') },
    { label: 'Mexican',  image: require('../../assets/categories/tacos.png') },
    { label: 'Healthy',  image: require('../../assets/categories/healthy.png') },
    { label: 'Súper',    image: require('../../assets/categories/super.png') },
];

export default function HomePage() {
    const router = useRouter();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);

    const cartTotalItems = useCartStore((state) => state.getTotalItems());
    const cartTotalPrice = useCartStore((state) => state.getTotalPrice());

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const data = await restaurantService.getRestaurants();
                setRestaurants(data);
            } catch (error) {
                console.error("Failed to fetch restaurants:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.locationRow}
                    onPress={() => router.push('/addresses' as any)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.deliveringLabel}>Entregando en</Text>
                    <View style={styles.locationNameRow}>
                        <Text style={styles.pinEmoji}>📍</Text>
                        <Text style={styles.locationName} numberOfLines={1}>
                            123 Main St, Apt 4B
                        </Text>
                        <Text style={styles.chevron}>⌄</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/cart')}
                    activeOpacity={0.8}
                >
                    <View style={styles.cartIconBadge}>
                        <Feather name="shopping-cart" size={20} color={Colors.slate800} />
                        {cartTotalItems > 0 && (
                            <View style={styles.headerCartBadge}>
                                <Text style={styles.headerCartBadgeText}>
                                    {cartTotalItems > 9 ? '9+' : cartTotalItems}
                                </Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </View>

            {/* Search bar */}
            <TouchableOpacity
                style={styles.searchBar}
                onPress={() => router.push('/search-input' as any)}
                activeOpacity={0.8}
            >
                <Text style={styles.searchIcon}>🔍</Text>
                <Text style={styles.searchPlaceholder}>¿Qué se te antoja?</Text>
            </TouchableOpacity>

            {/* Main scroll */}
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Categories */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Categorías</Text>
                        <Text style={styles.seeAll}>Ver todo</Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesRow}
                    >
                        {CATEGORIES.map((cat, i) => (
                            <TouchableOpacity
                                key={i}
                                style={styles.categoryItem}
                                onPress={() => router.push('/search')}
                                activeOpacity={0.7}
                            >
                                <View style={styles.categoryCircle}>
                                    <Image source={cat.image} style={styles.categoryImg} resizeMode="contain" />
                                </View>
                                <Text style={styles.categoryLabel}>{cat.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Restaurants */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <View style={styles.boltBadge}>
                                <Text style={styles.boltText}>⚡</Text>
                            </View>
                            <Text style={styles.sectionTitle}>Rápido cerca de ti</Text>
                        </View>
                    </View>

                    {loading ? (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <ActivityIndicator size="large" color={Colors.primary} />
                        </View>
                    ) : (
                        restaurants.length > 0 ? (
                            restaurants.map((r, i) => (
                                <TouchableOpacity
                                    key={r.id || i}
                                    style={styles.card}
                                    onPress={() => router.push(`/restaurant/${r.id}` as any)}
                                    activeOpacity={0.9}
                                >
                                    <View style={styles.cardImageWrap}>
                                        <Image source={{ uri: r.image }} style={styles.cardImage} />
                                        {/* Optional promoted flag */}
                                        {(r as any).promoted && (
                                            <View style={styles.promotedBadge}>
                                                <Text style={styles.promotedText}>Promoted</Text>
                                            </View>
                                        )}
                                        <View style={styles.timeBadge}>
                                            <Text style={styles.timeDot}>●</Text>
                                            <Text style={styles.timeText}>{r.deliveryTime || '20-30 min'}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.cardInfo}>
                                        <View style={styles.cardInfoRow}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.cardName}>{r.name}</Text>
                                                <Text style={styles.cardCuisine}>{r.category}</Text>
                                            </View>
                                            <View style={styles.ratingBadge}>
                                                <Text style={styles.ratingText}>{r.rating || '4.5'}</Text>
                                                <Text style={styles.ratingStar}>⭐</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={{ padding: 40, alignItems: 'center' }}>
                                <Text style={{ color: Colors.gray400 }}>No hay restaurantes disponibles</Text>
                            </View>
                        )
                    )}
                </View>
            </ScrollView>

            {/* Floating Cart Button */}
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 4,
    },
    locationRow: { flex: 1 },
    deliveringLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: `${Colors.primary}cc`,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 2,
    },
    locationNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    pinEmoji: { fontSize: 15, color: Colors.primary },
    locationName: { fontSize: 13, fontWeight: '700', color: Colors.slate900, marginRight: 2 },
    chevron: { fontSize: 14, color: Colors.slate500, fontWeight: '800' },
    cartIconBadge: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: Colors.gray100,
    },
    headerCartBadge: {
        position: 'absolute',
        top: -2,
        right: -4,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.primary,
        borderWidth: 2,
        borderColor: Colors.backgroundLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCartBadgeText: {
        color: Colors.white,
        fontSize: 10,
        fontWeight: '800',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.gray100,
        borderRadius: 999,
        marginHorizontal: 16,
        marginVertical: 10,
        height: 48,
        paddingHorizontal: 16,
        gap: 10,
    },
    searchIcon: { fontSize: 18 },
    searchPlaceholder: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.gray400,
    },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 100, gap: 8 },
    section: { paddingHorizontal: 16, gap: 12, marginTop: 8 },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    boltBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    boltText: { fontSize: 12 },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.slate900,
    },
    seeAll: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.primary,
    },
    categoriesRow: { gap: 16, paddingVertical: 4 },
    categoryItem: { alignItems: 'center', gap: 6 },
    categoryCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: `${Colors.primary}18`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryEmoji: { fontSize: 26 },
    categoryLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.slate700,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.gray100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 16,
        overflow: 'hidden',
    },
    cardImageWrap: { position: 'relative', height: 180 },
    cardImage: { width: '100%', height: '100%' },
    promotedBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(255,255,255,0.92)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },
    promotedText: { fontSize: 10, fontWeight: '700', color: Colors.slate900, textTransform: 'uppercase', letterSpacing: 0.5 },
    timeBadge: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: Colors.white,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    timeDot: { fontSize: 8, color: Colors.primary },
    timeText: { fontSize: 12, fontWeight: '700', color: Colors.slate900 },
    cardInfo: { padding: 12 },
    cardInfoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
    cardName: { fontSize: 16, fontWeight: '700', color: Colors.slate900 },
    cardCuisine: { fontSize: 13, color: Colors.gray500, marginTop: 2 },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.green100,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        gap: 2,
        height: 28,
    },
    ratingText: { fontSize: 12, fontWeight: '700', color: Colors.green700 },
    ratingStar: { fontSize: 12 },
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
    categoryImg: { width: 48, height: 48 },
});
