import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES = [
    { label: 'Deals', icon: '🏷️' },
    { label: 'Pizza', icon: '🍕' },
    { label: 'Burger', icon: '🍔' },
    { label: 'Asian', icon: '🍜' },
    { label: 'Mexican', icon: '🌮' },
    { label: 'Healthy', icon: '🥗' },
];

const restaurants = [
    {
        name: 'Burger King',
        cuisine: 'American • Burgers • Fast Food',
        time: '15-20 min',
        rating: '4.5',
        promoted: true,
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCIhomPRZzyN13C9Nr297Lbuxd42ChLmhF_hWFLVC5Gh_j94JkWjLKRh7wCLFW2-2XaZeKfzBk0HdMN98GfJH8q99wjQV9-II5euaFjXSkPtDZTKVW0drdFYdeeOE21Z-44Frsf_yTYUvBY3hGdz8bRrH29ITx5mEch_eXuQnWE6871mwDBE6PO0FR_w8bHnp9-7TqcAslumIlA_5cmkr2s5vojnqaL1kNG5GgHFViLFPNPTiwmA0aayZi4FcMdyBEkgD6sErFSPf4T',
    },
    {
        name: 'Sushi Express',
        cuisine: 'Japanese • Sushi • Asian',
        time: '25-35 min',
        rating: '4.8',
        promoted: false,
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBUvvda9bbU34pR4VlFOm8yizPfRY6QX_T_UsQSVcgQH72YDmmQ-uZVbeyVwgc8e8JRqQakVUHAk3BwhxipCVXQVJFuro2C3DpdYwJkvxGvcq_kD4Y57co3FpUBCboQ50uGLCnVY36X7Q2ZnlhdzLf4KiqL8dveS1iv4Q_R4R4wzv1DW3XCcP30HhhDH3b_ljzcg97fKkA8KtFHHqiY1QNc6OrF7dIfXRhYE97YWbQApygnMU73weusnACjl2g9SZXt4ouOKDQohXeC',
    },
];

export default function HomePage() {
    const router = useRouter();

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
                    onPress={() => router.push('/profile')}
                    activeOpacity={0.8}
                >
                    <View style={styles.avatar}>
                        <Image
                            source={{
                                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtQkQQRwCJ0HZH2o9T3bacPz--BNe5e82OZlu9R2MmDOb2QqX8UmbHuG-A9x--UtBicP8dlTiaLbS6pf1s-MRGjbuZHwpor4fGR3NhLMZhT5eTQ4opanZwTtsc_12wCjrn9sZFr4QWJ-5-M5qXh3sYRi5na0Lx-l_7roIa5cH70cxjMca_gfM0wK9ggr7RQLb4D2F1bx7kJalH418xyyi4q9LjmPAAoBxBehAi_4I1LyzJczwDL1XfrqHvMVEmkjkA0OpjTb2gvvKi',
                            }}
                            style={styles.avatarImg}
                        />
                        <View style={styles.notifDot} />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Search bar */}
            <TouchableOpacity
                style={styles.searchBar}
                onPress={() => router.push('/search')}
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
                                    <Text style={styles.categoryEmoji}>{cat.icon}</Text>
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

                    {restaurants.map((r, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.card}
                            onPress={() => router.push('/restaurant/1' as any)}
                            activeOpacity={0.9}
                        >
                            <View style={styles.cardImageWrap}>
                                <Image source={{ uri: r.image }} style={styles.cardImage} />
                                {r.promoted && (
                                    <View style={styles.promotedBadge}>
                                        <Text style={styles.promotedText}>Promoted</Text>
                                    </View>
                                )}
                                <View style={styles.timeBadge}>
                                    <Text style={styles.timeDot}>●</Text>
                                    <Text style={styles.timeText}>{r.time}</Text>
                                </View>
                            </View>
                            <View style={styles.cardInfo}>
                                <View style={styles.cardInfoRow}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.cardName}>{r.name}</Text>
                                        <Text style={styles.cardCuisine}>{r.cuisine}</Text>
                                    </View>
                                    <View style={styles.ratingBadge}>
                                        <Text style={styles.ratingText}>{r.rating}</Text>
                                        <Text style={styles.ratingStar}>⭐</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
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
    locationName: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.slate900,
        maxWidth: 180,
    },
    chevron: { fontSize: 18, color: Colors.gray400, marginLeft: 2 },
    avatar: { position: 'relative' },
    avatarImg: {
        width: 42,
        height: 42,
        borderRadius: 21,
        borderWidth: 2,
        borderColor: Colors.white,
    },
    notifDot: {
        position: 'absolute',
        top: 2,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.red500,
        borderWidth: 2,
        borderColor: Colors.white,
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
});
