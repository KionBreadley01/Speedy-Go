import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useFavoriteStore } from '../../store/favoriteStore';

export default function FavoritesScreen() {
    const router = useRouter();
    const favorites = useFavoriteStore((state) => state.favorites);
    const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Feather name="chevron-left" size={26} color={Colors.slate900} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mis Favoritos</Text>
            </View>

            {favorites.length === 0 ? (
                <View style={styles.emptyWrap}>
                    <Feather name="heart" size={60} color={Colors.gray300} style={styles.emptyIcon} />
                    <Text style={styles.emptyTitle}>Aún no tienes favoritos</Text>
                    <Text style={styles.emptyText}>Toca el corazón en los productos que más te gusten para guardarlos aquí.</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {favorites.map((product) => (
                        <TouchableOpacity
                            key={product.id}
                            style={styles.card}
                            activeOpacity={0.8}
                            onPress={() => router.push(`/product/${product.id}`)}
                        >
                            <Image 
                                source={{ uri: product.image || 'https://via.placeholder.com/150' }} 
                                style={styles.cardImg} 
                            />
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardName} numberOfLines={2}>{product.name}</Text>
                                <Text style={styles.cardPrice}>${product.price.toFixed(2)}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.favBtn}
                                onPress={() => toggleFavorite(product)}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="heart" size={24} color={Colors.primary} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundLight },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray100,
    },
    backBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: Colors.gray100,
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: Colors.slate900,
        marginLeft: 16,
    },
    scrollContent: { padding: 16, gap: 16 },
    card: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: Colors.gray100,
    },
    cardImg: {
        width: 70,
        height: 70,
        borderRadius: 12,
        backgroundColor: Colors.gray100,
    },
    cardInfo: {
        flex: 1,
        marginLeft: 16,
        marginRight: 16,
    },
    cardName: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.slate900,
        marginBottom: 6,
    },
    cardPrice: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.primary,
    },
    favBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.slate800,
        marginBottom: 12,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 15,
        color: Colors.slate500,
        textAlign: 'center',
        lineHeight: 22,
    },
});
