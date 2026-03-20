import { Colors } from '@/constants/colors';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
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
import { auth } from '../../Lib/firebase';
import { userService } from '../../Lib/services/userService';
import { restaurantService, Restaurant } from '../../Lib/services/restaurantService';
import { Product } from '../../store/cartStore';

export default function FavoritesScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'restaurants' | 'products'>('products');
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const loadFavorites = async () => {
        const user = auth.currentUser;
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            if (activeTab === 'restaurants') {
                const favIds = await userService.getFavorites(user.uid);
                const fetched = await Promise.all(
                    favIds.map(id => restaurantService.getRestaurantById(id))
                );
                setRestaurants(fetched.filter(r => r !== null) as Restaurant[]);
            } else {
                const favIds = await userService.getProductFavorites(user.uid);
                const fetched = await Promise.all(
                    favIds.map(id => restaurantService.getProductById(id))
                );
                setProducts(fetched.filter(p => p !== null) as Product[]);
            }
        } catch (error) {
            console.error("Error loading favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            loadFavorites();
        }, [activeTab])
    );

    const toggleRestaurantFavorite = async (restaurantId: string) => {
        const user = auth.currentUser;
        if (!user) return;
        setRestaurants(prev => prev.filter(r => r.id !== restaurantId));
        await userService.deleteFavorite(user.uid, restaurantId);
    };

    const toggleProductFavorite = async (productId: string) => {
        const user = auth.currentUser;
        if (!user) return;
        setProducts(prev => prev.filter(p => p.id !== productId));
        await userService.deleteProductFavorite(user.uid, productId);
    };

    const renderRestaurants = () => (
        restaurants.length > 0 ? (
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {restaurants.map((r) => (
                    <TouchableOpacity
                        key={r.id}
                        style={styles.card}
                        onPress={() => router.push(`/restaurant/${r.id}` as any)}
                        activeOpacity={0.9}
                    >
                        <View style={styles.cardImageWrap}>
                            <Image source={{ uri: r.image }} style={styles.cardImage} />
                            <TouchableOpacity
                                style={styles.likeBtn}
                                onPress={() => toggleRestaurantFavorite(r.id)}
                            >
                                <FontAwesome name="heart" size={18} color={Colors.primary} />
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
            </ScrollView>
        ) : <EmptyView message="No hay restaurantes favoritos" />
    );

    const renderProducts = () => (
        products.length > 0 ? (
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {products.map((p) => (
                    <TouchableOpacity
                        key={p.id}
                        style={styles.card}
                        onPress={() => router.push(`/product/${p.id}` as any)}
                        activeOpacity={0.9}
                    >
                        <View style={styles.cardImageWrap}>
                            <Image source={{ uri: p.image }} style={styles.cardImage} />
                            <TouchableOpacity
                                style={styles.likeBtn}
                                onPress={() => toggleProductFavorite(p.id)}
                            >
                                <FontAwesome name="heart" size={18} color={Colors.primary} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.cardInfo}>
                            <View style={styles.titleRow}>
                                <Text style={styles.cardName}>{p.name}</Text>
                                <Text style={styles.price}>${p.price?.toFixed(2)}</Text>
                            </View>
                            <Text style={styles.desc} numberOfLines={2}>{p.description}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        ) : <EmptyView message="No hay productos favoritos" />
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Feather name="chevron-left" size={26} color={Colors.slate900} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mis Favoritos</Text>
            </View>

            {/* Sub-tabs */}
            <View style={styles.tabsRow}>
                <TouchableOpacity 
                    style={[styles.tabItem, activeTab === 'products' && styles.tabItemActive]}
                    onPress={() => setActiveTab('products')}
                >
                    <Text style={[styles.tabLabel, activeTab === 'products' && styles.tabLabelActive]}>Productos</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tabItem, activeTab === 'restaurants' && styles.tabItemActive]}
                    onPress={() => setActiveTab('restaurants')}
                >
                    <Text style={[styles.tabLabel, activeTab === 'restaurants' && styles.tabLabelActive]}>Restaurantes</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>
            ) : activeTab === 'restaurants' ? renderRestaurants() : renderProducts()}
        </SafeAreaView>
    );
}

const EmptyView = ({ message }: { message: string }) => (
    <View style={styles.center}>
        <FontAwesome name="heart-o" size={60} color={Colors.gray300} style={{ marginBottom: 12 }} />
        <Text style={styles.emptyText}>{message}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, paddingTop: 8, backgroundColor: Colors.white, gap: 8 },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.slate900, flex: 1 },
    
    tabsRow: { flexDirection: 'row', backgroundColor: Colors.white, paddingHorizontal: 16, paddingBottom: 8 },
    tabItem: { flex: 1, alignItems: 'center', paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
    tabItemActive: { borderBottomColor: Colors.primary },
    tabLabel: { fontSize: 14, fontWeight: '600', color: Colors.slate500 },
    tabLabelActive: { color: Colors.primary, fontWeight: '700' },

    center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
    emptyText: { fontSize: 16, fontWeight: '600', color: Colors.slate700 },
    scrollContent: { padding: 16, paddingBottom: 40 },
    card: { backgroundColor: Colors.white, borderRadius: 16, marginBottom: 16, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
    cardImageWrap: { position: 'relative', height: 160 },
    cardImage: { width: '100%', height: '100%' },
    likeBtn: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.3)', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
    timeBadge: { position: 'absolute', bottom: 12, right: 12, backgroundColor: Colors.white, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 4 },
    timeDot: { fontSize: 8, color: Colors.primary },
    timeText: { fontSize: 12, fontWeight: '700', color: Colors.slate900 },
    cardInfo: { padding: 12 },
    cardInfoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    price: { fontSize: 16, fontWeight: '700', color: Colors.primary },
    desc: { fontSize: 13, color: Colors.gray500, lineHeight: 18 },
    cardName: { fontSize: 16, fontWeight: '700', color: Colors.slate900 },
    cardCuisine: { fontSize: 13, color: Colors.gray500, marginTop: 2 },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6F4EA', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, gap: 2 },
    ratingText: { fontSize: 12, fontWeight: '700', color: '#1E7B3A' },
    ratingStar: { fontSize: 12 },
});
