import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { restaurantService, Restaurant } from '../../Lib/services/restaurantService';
import { useCartStore } from '../../store/cartStore';
import { useAddressStore } from '../../store/addressStore';

// NO HARDCODED CATEGORIES

export default function HomePage() {
    const router = useRouter();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]); // general products
    const [visibleCount, setVisibleCount] = useState(5); // "Mostrar más" control
    const [showAllCategories, setShowAllCategories] = useState(false);

    const cartTotalItems = useCartStore((state) => state.getTotalItems());
    const cartTotalPrice = useCartStore((state) => state.getTotalPrice());
    
    const { getCurrentAddressName, setAddresses } = useAddressStore();

    const [favorites, setFavorites] = useState<string[]>([]); // liked IDs

    useEffect(() => {
        const loadUserData = async () => {
            const { auth } = await import('../../Lib/firebase');
            const { userService } = await import('../../Lib/services/userService');
            const user = auth.currentUser;
            if (user) {
                try {
                    const data = await userService.getAddresses(user.uid);
                    setAddresses(data);

                    const favs = await userService.getFavorites(user.uid);
                    setFavorites(favs);
                } catch (e) {
                    console.error(e);
                }
            }
        };
        loadUserData();
    }, []);

    const toggleFavorite = async (restaurantId: string) => {
        const { auth } = await import('../../Lib/firebase');
        const { userService } = await import('../../Lib/services/userService');
        const user = auth.currentUser;

        if (!user) {
            alert("Inicia sesión para guardar favoritos");
            return;
        }

        const isFav = favorites.includes(restaurantId);
        
        // Optimistic UI updates
        if (isFav) {
            setFavorites(prev => prev.filter(id => id !== restaurantId));
            try {
                await userService.deleteFavorite(user.uid, restaurantId);
            } catch (e) {
                console.error(e);
                setFavorites(prev => [...prev, restaurantId]); // Rollback on error
            }
        } else {
            setFavorites(prev => [...prev, restaurantId]);
            try {
                await userService.addFavorite(user.uid, restaurantId);
            } catch (e) {
                console.error(e);
                setFavorites(prev => prev.filter(id => id !== restaurantId)); // Rollback on error
            }
        }
    };

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                // Only show active restaurants in the app
                const data = await restaurantService.getActiveRestaurants();
                setRestaurants(data);
            } catch (error) {
                console.error("Failed to fetch restaurants:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchProducts = async () => {
            try {
                const data = await restaurantService.getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const data = await restaurantService.getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchRestaurants();
        fetchProducts();
        fetchCategories();
    }, []);

    // Filtered data logic
    const filteredRestaurants = selectedCategory 
        ? restaurants.filter(r => {
            // 1. Check restaurant's primary category
            if (r.category?.toLowerCase().includes(selectedCategory.toLowerCase())) return true;
            // 2. Check if restaurant has any products in this category
            const hasMatchingProduct = products.some(p => 
                p.restaurantId === r.id && 
                ((p as any).category?.toLowerCase().includes(selectedCategory.toLowerCase()) || 
                 p.name.toLowerCase().includes(selectedCategory.toLowerCase()))
            );
            return hasMatchingProduct;
        })
        : restaurants;

    // Reset visible count when category changes
    const visibleRestaurants = filteredRestaurants.slice(0, visibleCount);
    const hasMore = filteredRestaurants.length > visibleCount;

    const filteredProducts = selectedCategory
        ? products.filter(p => {
             const rest = restaurants.find(r => r.id === p.restaurantId);
             // 1. Check if restaurant category matches
             if (rest?.category.toLowerCase().includes(selectedCategory.toLowerCase())) return true;
             // 2. Check if product category matches
             if ((p as any).category?.toLowerCase().includes(selectedCategory.toLowerCase())) return true;
             // 3. Check if product name matches
             if (p.name.toLowerCase().includes(selectedCategory.toLowerCase())) return true;
             return false;
          })
        : [];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.locationRow}
                    onPress={() => router.push('/addresses' as any)}
                    activeOpacity={0.7}
                >
                    <View style={styles.locationNameRow}>
                        <Feather name="map-pin" size={14} color={Colors.primary} style={{ marginRight: 2 }} />
                        <Text style={styles.locationName} numberOfLines={2}>
                            {getCurrentAddressName()}
                        </Text>
                        <Feather name="chevron-down" size={16} color={Colors.gray400} />
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
                <View style={[styles.section, { paddingHorizontal: 0 }]}>
                    <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
                        <Text style={styles.sectionTitle}>Categorías</Text>
                        <TouchableOpacity onPress={() => setShowAllCategories(true)}>
                            <Text style={styles.seeAll}>Ver todo</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesRow}
                    >
                        {categories.map((cat, i) => {
                            const isActive = selectedCategory?.toLowerCase() === cat.label.toLowerCase();
                            return (
                                <TouchableOpacity
                                    key={cat.id || i}
                                    style={styles.categoryItem}
                                    onPress={() => setSelectedCategory(isActive ? null : cat.label)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[
                                        styles.categoryCircle, 
                                        isActive && styles.categoryActive
                                    ]}>
                                        <Image source={{ uri: cat.image }} style={styles.categoryImg} resizeMode="contain" />
                                    </View>
                                    <Text style={[
                                        styles.categoryLabel, 
                                        isActive && styles.categoryLabelActive
                                    ]}>{cat.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* --- PRODUCTS HORIZONTAL LIST FOR CATEGORY --- */}
                {selectedCategory && filteredProducts.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Productos en {selectedCategory}</Text>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.productsRow}
                        >
                            {filteredProducts.map((p, index) => (
                                <TouchableOpacity 
                                    key={index}
                                    style={styles.productItemCard}
                                    onPress={() => router.push(`/product/${p.id}` as any)}
                                    activeOpacity={0.85}
                                >
                                    <Image source={{ uri: p.image }} style={styles.productImg} />
                                    <View style={styles.productInfo}>
                                        <Text style={styles.productName} numberOfLines={1}>{p.name}</Text>
                                        <Text style={styles.productPrice}>${p.price?.toFixed(2)}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

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
                        filteredRestaurants.length > 0 ? (
                            <>
                                {visibleRestaurants.map((r, i) => (
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
                                            
                                            {/* Heart/Like Button */}
                                            <TouchableOpacity
                                                style={styles.likeBtn}
                                                onPress={() => toggleFavorite(r.id)}
                                                activeOpacity={0.8}
                                            >
                                                <FontAwesome 
                                                    name={favorites.includes(r.id) ? "heart" : "heart-o"} 
                                                    size={18} 
                                                    color={favorites.includes(r.id) ? Colors.primary : Colors.white} 
                                                />
                                            </TouchableOpacity>

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
                                ))}

                                {/* "Mostrar más" button */}
                                {hasMore && (
                                    <TouchableOpacity
                                        style={styles.showMoreBtn}
                                        onPress={() => setVisibleCount(c => c + 5)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.showMoreText}>Mostrar más restaurantes</Text>
                                        <Feather name="chevron-down" size={16} color={Colors.primary} />
                                    </TouchableOpacity>
                                )}
                            </>
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
            {/* Modal for All Categories */}
            <Modal
                visible={showAllCategories}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowAllCategories(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Todas las Categorías</Text>
                            <TouchableOpacity onPress={() => setShowAllCategories(false)} style={styles.closeBtn}>
                                <Feather name="x" size={24} color={Colors.slate900} />
                            </TouchableOpacity>
                        </View>
                        
                        <FlatList
                            data={categories}
                            keyExtractor={(item, index) => item.id || index.toString()}
                            numColumns={3}
                            contentContainerStyle={styles.modalGrid}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalCategoryItem}
                                    onPress={() => {
                                        setSelectedCategory(item.label);
                                        setShowAllCategories(false);
                                    }}
                                >
                                    <View style={styles.categoryCircle}>
                                        <Image source={{ uri: item.image }} style={styles.categoryImg} resizeMode="contain" />
                                    </View>
                                    <Text style={styles.categoryLabel}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
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
    locationRow: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
        paddingLeft: 44, // offset the cart icon for true centration
    },
    locationNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingHorizontal: 12,
    },
    locationName: { 
        fontSize: 13, 
        fontWeight: '700', 
        color: Colors.slate900, 
        textAlign: 'center',
        maxWidth: '85%',
    },
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
        marginTop: 6, // Raised slightly: from 10 to 6
        marginBottom: 8,
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
    categoriesRow: { gap: 16, paddingVertical: 10, paddingHorizontal: 16 },
    categoryItem: { alignItems: 'center', gap: 8, width: 80 },
    categoryCircle: {
        width: 76,
        height: 76,
        borderRadius: 22,
        backgroundColor: '#FFF7F2',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    categoryActive: {
        backgroundColor: '#FFEFE6',
        borderColor: Colors.primary,
    },
    categoryLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.slate700,
        textAlign: 'center',
    },
    categoryLabelActive: {
        color: Colors.primary,
        fontWeight: '800',
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
    likeBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.3)', 
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
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
    productsRow: { gap: 12, paddingVertical: 4 },
    productItemCard: {
        width: 140,
        backgroundColor: Colors.white,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.gray100,
        marginRight: 4,
    },
    productImg: { width: '100%', height: 100 },
    productInfo: { padding: 8 },
    productName: { fontSize: 13, fontWeight: '700', color: Colors.slate900 },
    productPrice: { fontSize: 13, color: Colors.primary, fontWeight: '700', marginTop: 2 },
    categoryImg: { width: 48, height: 48 },
    showMoreBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: `${Colors.primary}30`,
        backgroundColor: `${Colors.primary}08`,
        marginBottom: 8,
    },
    showMoreText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.primary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: '80%',
        paddingTop: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.slate900,
    },
    closeBtn: {
        padding: 4,
    },
    modalGrid: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    modalCategoryItem: {
        flex: 1 / 3,
        alignItems: 'center',
        marginBottom: 24,
        gap: 8,
    },
});
