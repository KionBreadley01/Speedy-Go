import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const RECENT_SEARCHES = ['Hamburguesas', 'Sushi', 'Pizza'];

const TRENDING = [
    { label: 'Pizza 🍕', hot: false },
    { label: 'Tacos 🌮', hot: false },
    { label: 'Sushi 🍱', hot: false },
    { label: 'Burgers 🍔', hot: true },
    { label: 'Hot Dogs 🌭', hot: false },
    { label: 'Alitas 🍗', hot: true },
];

const EXPLORE = [
    { label: 'Tacos',         image: require('../assets/categories/tacos.png') },
    { label: 'Pizza',         image: require('../assets/categories/pizza.png') },
    { label: 'Hamburguesas',  image: require('../assets/categories/burger.png') },
    { label: 'Sushi',         image: require('../assets/categories/sushi.png') },
    { label: 'Saludable',     image: require('../assets/categories/healthy.png') },
    { label: 'S\u00faper',         image: require('../assets/categories/super.png') },
];

export default function SearchInputScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const inputRef = useRef<TextInput>(null);

    const handleSearch = (term: string) => {
        if (term.trim()) {
            router.push({ pathname: '/search', params: { category: term } } as any);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Branded header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Feather name="chevron-left" size={26} color={Colors.white} />
                </TouchableOpacity>

                <View style={styles.searchBarWrap}>
                    <Feather name="search" size={18} color={Colors.slate500} />
                    <TextInput
                        ref={inputRef}
                        style={styles.searchInput}
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Restaurante, platillo, cocina..."
                        placeholderTextColor={Colors.gray400}
                        autoFocus
                        returnKeyType="search"
                        onSubmitEditing={() => handleSearch(query)}
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
                            <Feather name="x-circle" size={18} color={Colors.slate400} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Recientes */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <View style={styles.sectionDot} />
                            <Text style={styles.sectionTitle}>Recientes</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.clearBtn}
                            activeOpacity={0.7}
                        >
                            <Feather name="rotate-ccw" size={14} color={Colors.primary} />
                            <Text style={styles.clearBtnText}>Limpiar</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.recentRow}>
                        {RECENT_SEARCHES.map((item, i) => (
                            <TouchableOpacity
                                key={i}
                                style={styles.recentChip}
                                activeOpacity={0.7}
                                onPress={() => handleSearch(item)}
                            >
                                <Feather name="clock" size={13} color={Colors.slate500} />
                                <Text style={styles.recentChipText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Trending */}
                <View style={styles.section}>
                    <View style={styles.sectionTitleRow}>
                        <View style={[styles.sectionDot, { backgroundColor: '#EF4444' }]} />
                        <Text style={styles.sectionTitle}>Tendencias</Text>
                    </View>
                    <View style={styles.trendingGrid}>
                        {TRENDING.map((item, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.trendChip, item.hot && styles.trendChipHot]}
                                activeOpacity={0.75}
                                onPress={() => handleSearch(item.label)}
                            >
                                <Text style={[styles.trendText, item.hot && styles.trendTextHot]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Explorar */}
                <View style={styles.section}>
                    <View style={styles.sectionTitleRow}>
                        <View style={[styles.sectionDot, { backgroundColor: Colors.primary }]} />
                        <Text style={styles.sectionTitle}>Explorar</Text>
                    </View>
                    <View style={styles.exploreGrid}>
                        {EXPLORE.map((cat, i) => (
                            <TouchableOpacity
                                key={i}
                                style={styles.exploreCard}
                                activeOpacity={0.8}
                                onPress={() => handleSearch(cat.label)}
                            >
                                <Image source={cat.image} style={styles.exploreImage} resizeMode="contain" />
                                <Text style={styles.exploreLabel} numberOfLines={1}>
                                    {cat.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F8FA' },

    /* Header — orange brand background */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: Colors.primary,
        gap: 12,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    searchBarWrap: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 14,
        height: 46,
        paddingHorizontal: 14,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: Colors.slate900,
        fontWeight: '500',
    },

    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 80, paddingTop: 4 },

    section: { paddingHorizontal: 20, paddingTop: 28 },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    sectionDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.slate700,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: Colors.slate900,
        letterSpacing: -0.3,
    },
    clearBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    clearBtnText: {
        fontSize: 13,
        color: Colors.primary,
        fontWeight: '600',
    },

    /* Recientes */
    recentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    recentChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.white,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 1,
    },
    recentChipText: { fontSize: 14, color: Colors.slate700, fontWeight: '600' },

    /* Trending */
    trendingGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    trendChip: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    trendChipHot: {
        backgroundColor: `${Colors.primary}12`,
        borderColor: `${Colors.primary}50`,
    },
    trendText: { fontSize: 14, color: Colors.slate700, fontWeight: '600' },
    trendTextHot: { color: Colors.primary, fontWeight: '700' },

    /* Explorar grid */
    exploreGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    exploreCard: {
        width: '22%',
        aspectRatio: 0.9,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: 8,
        backgroundColor: `${Colors.primary}10`,
        borderWidth: 1,
        borderColor: `${Colors.primary}20`,
    },
    exploreImage: { width: 60, height: 60 },
    exploreLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.slate800,
        textAlign: 'center',
    },
});
