import { Colors } from '@/constants/colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
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

const CATEGORIES = [
    { label: 'Pizza', image: require('../../assets/categories/pizza.png') },
    { label: 'Hamburguesas', image: require('../../assets/categories/burger.png') },
    { label: 'Tacos', image: require('../../assets/categories/tacos.png') },
    { label: 'Sushi', image: require('../../assets/categories/sushi.png') },
    { label: 'Saludable', image: require('../../assets/categories/healthy.png') },
    { label: 'Súper', image: require('../../assets/categories/super.png') },
];

export default function SearchScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ category?: string }>();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        if (params.category) {
            setSelectedCategory(params.category);
        }
    }, [params.category]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header with title */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Feather name="chevron-left" size={26} color={Colors.slate900} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {selectedCategory ?? 'Buscar'}
                </Text>
                <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={() => router.push('/search-input' as any)}>
                    <Feather name="search" size={22} color={Colors.slate900} />
                </TouchableOpacity>
            </View>

            {/* Filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersRow}
                style={styles.filtersScroll}
            >
                <TouchableOpacity style={styles.filterOutline}>
                    <Text style={styles.filterOutlineText}>Sort by</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterActive}>
                    <Text style={styles.filterActiveText}>Under 30 min</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOutline}>
                    <Text style={styles.filterOutlineText}>Rating 4+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOutline}>
                    <Text style={styles.filterOutlineText}>Free delivery</Text>
                </TouchableOpacity>
            </ScrollView>

            <View style={styles.categoriesSection}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesRow}
                >
                    {CATEGORIES.map((cat, i) => {
                        const isSelected = selectedCategory === cat.label;
                        return (
                            <TouchableOpacity
                                key={i}
                                style={[
                                    styles.categoryCard,
                                    isSelected && styles.categoryCardActive,
                                ]}
                                activeOpacity={0.8}
                                onPress={() => setSelectedCategory(isSelected ? null : cat.label)}
                            >
                                <Image source={cat.image} style={styles.categoryImage} resizeMode="contain" />
                                <Text style={[
                                    styles.categoryLabel,
                                    isSelected && styles.categoryLabelActive,
                                ]} numberOfLines={1}>
                                    {cat.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Results */}
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => router.push('/restaurant/1' as any)}
                    activeOpacity={0.88}
                >
                    <View style={styles.cardImageWrap}>
                        <Image
                            source={{
                                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6Je7dOSbCBanw7wRfhe4SSZ8bZmJZIWYD0zU7PXeixUBHI3iZ0PSnqzahzgjSZNEwGgkn4vl9ub6ELl7rGEO6Ubw1LodHdxSixXyjduJtq5M1adiLD5rqUIUZEl_4w7pJynckrr-GhAdLnc96HmlSfvY2Z42dhz-jq2OKbD_EWsYwjvzR1_1dqruHM5FUnUaHaTPLfFDCqlyz0NDHArS5teyeg_mrw_S6DQssj1R7niPzhQfXA0ulW-Pd802OeNAUeWiOzeSau6-X',
                            }}
                            style={styles.cardImage}
                        />
                    </View>
                    <View style={styles.cardInfo}>
                        <Text style={styles.cardName}>Burger King</Text>
                        <View style={styles.cardMeta}>
                            <Text style={styles.cardMetaText}>American</Text>
                            <View style={styles.metaDot} />
                            <Text style={styles.cardMetaText}>Fast Food</Text>
                            <View style={styles.metaDot} />
                            <Text style={styles.cardMetaText}>15-20 min</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => router.push('/restaurant/1' as any)}
                    activeOpacity={0.88}
                >
                    <View style={styles.cardImageWrap}>
                        <Image
                            source={{
                                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIhomPRZzyN13C9Nr297Lbuxd42ChLmhF_hWFLVC5Gh_j94JkWjLKRh7wCLFW2-2XaZeKfzBk0HdMN98GfJH8q99wjQV9-II5euaFjXSkPtDZTKVW0drdFYdeeOE21Z-44Frsf_yTYUvBY3hGdz8bRrH29ITx5mEch_eXuQnWE6871mwDBE6PO0FR_w8bHnp9-7TqcAslumIlA_5cmkr2s5vojnqaL1kNG5GgHFViLFPNPTiwmA0aayZi4FcMdyBEkgD6sErFSPf4T',
                            }}
                            style={styles.cardImage}
                        />
                    </View>
                    <View style={styles.cardInfo}>
                        <Text style={styles.cardName}>The Burger Lab</Text>
                        <View style={styles.cardMeta}>
                            <Text style={styles.cardMetaText}>Burgers</Text>
                            <View style={styles.metaDot} />
                            <Text style={styles.cardMetaText}>Gourmet</Text>
                            <View style={styles.metaDot} />
                            <Text style={styles.cardMetaText}>20-30 min</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundLight },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 12,
        paddingTop: 8,
        gap: 12,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray100,
    },
    headerTitle: {
        flex: 1,
        fontSize: 22,
        fontWeight: '800',
        color: Colors.slate900,
    },
    backBtn: {
        width: 40,
        height: 40,
        backgroundColor: Colors.gray100,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchBar: { flex: 1 },
    searchIcon: {},
    searchInput: {},
    filtersScroll: { maxHeight: 60, flexGrow: 0 },
    filtersRow: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 8,
        alignItems: 'center',
    },
    categoriesSection: { paddingVertical: 16, paddingTop: 20 },
    categoriesRow: { paddingHorizontal: 16, gap: 12, paddingBottom: 4 },
    categoryCard: {
        width: 90,
        backgroundColor: Colors.white,
        borderRadius: 20,
        paddingVertical: 14,
        paddingHorizontal: 8,
        alignItems: 'center',
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.gray100,
    },
    categoryCardActive: {
        backgroundColor: `${Colors.primary}15`,
        borderColor: `${Colors.primary}40`,
    },
    categoryImage: {
        width: 60,
        height: 60,
    },
    categoryLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.slate700,
        textAlign: 'center',
    },
    categoryLabelActive: {
        color: Colors.primary,
        fontWeight: '700',
    },
    filterOutline: {
        height: 36,
        paddingHorizontal: 16,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: `${Colors.primary}30`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterOutlineText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.primary,
    },
    filterActive: {
        height: 36,
        paddingHorizontal: 16,
        borderRadius: 999,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    filterActiveText: { fontSize: 13, fontWeight: '500', color: Colors.white },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 100, gap: 20 },
    resultsTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.slate900,
        marginTop: 8,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    cardImageWrap: { height: 180 },
    cardImage: { width: '100%', height: '100%' },
    cardInfo: { padding: 14 },
    cardName: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.slate900,
        marginBottom: 4,
    },
    cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    cardMetaText: { fontSize: 13, color: Colors.slate500 },
    metaDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.gray300,
    },
});
