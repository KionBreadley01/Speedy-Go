import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RestaurantMenu() {
    const router = useRouter();

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
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Text style={styles.iconBtnText}>🔍</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Text style={styles.iconBtnText}>⋯</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.restaurantInfo}>
                    <View style={styles.restaurantLeft}>
                        <Text style={styles.restaurantName}>Burger King</Text>
                        <View style={styles.metaRow}>
                            <Text style={styles.star}>⭐</Text>
                            <Text style={styles.metaValue}>4.8</Text>
                            <Text style={styles.metaSep}>•</Text>
                            <Text style={styles.metaText}>15-25 min</Text>
                            <Text style={styles.metaSep}>•</Text>
                            <Text style={styles.freeDelivery}>Free Delivery</Text>
                        </View>
                    </View>
                    <Image
                        source={{
                            uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2_ipDmNGAsZ-Z_yF5FwIMmOCYVoGhPYePJ0rU9sozPCBDPsVCeIheQ2BoFWnAXYd7qhvtAUBLXHJf-z9z5xlD8mUjiq4HGkExuIwFZzDJJAXhlXomQziRUF8yPaP2TFcCcbob17re9r1tHu9bQLkztDb2pbqMh8CSyDGV8rn9euY-j9s25ODFnwEEbhQQzcpcNWocXQH5ukjT7_IPtOghTcodxfs2sUs4XKMt3PDAKJYkXwSgmJMpnR_Y1asy2Y9fi2kJhDTjcLYq',
                        }}
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

                {[
                    {
                        name: 'Whopper Doble con Queso',
                        desc: 'Dos carnes de res a la parrilla, queso americano, lechuga y tomate fresco.',
                        price: '$145.00',
                        tag: 'Popular',
                        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3gONcJkHATsMmpKqsfnSaksvm3JxCtprL6dlymu2rDya37uVW_sco3yFyWzrlaZ8muhEcq4LvSX9qlcZeTQDzQGGSj7atPNSsArvwpG0kpkPneN6AjF-TvQdB0RiuPDnG8r3Lp4BK8gsnG3E2zLtcheE2g-GFauW3s5f9OdOWHLV4hHww-422EZk5DeVaJZ4vsPUQZqtBRXa6A-etTxXy2VGPUzEVLFfEFYTx6t05Zr56vvVN7ottHCyf1xjhfXCZqQGfJaOfyGo_',
                    },
                    {
                        name: 'Chicken Crispy Sandwich',
                        desc: 'Pollo crujiente, mayonesa de chipotle y lechuga fresca en pan tostado.',
                        price: '$98.00',
                        tag: 'Nuevo',
                        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIhomPRZzyN13C9Nr297Lbuxd42ChLmhF_hWFLVC5Gh_j94JkWjLKRh7wCLFW2-2XaZeKfzBk0HdMN98GfJH8q99wjQV9-II5euaFjXSkPtDZTKVW0drdFYdeeOE21Z-44Frsf_yTYUvBY3hGdz8bRrH29ITx5mEch_eXuQnWE6871mwDBE6PO0FR_w8bHnp9-7TqcAslumIlA_5cmkr2s5vojnqaL1kNG5GgHFViLFPNPTiwmA0aayZi4FcMdyBEkgD6sErFSPf4T',
                    },
                ].map((item, i) => (
                    <View key={i}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => router.push('/product/1' as any)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.menuItemInfo}>
                                <View style={styles.tagRow}>
                                    <View style={styles.tag}>
                                        <Text style={styles.tagText}>{item.tag}</Text>
                                    </View>
                                </View>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemDesc} numberOfLines={2}>
                                    {item.desc}
                                </Text>
                                <View style={styles.itemBottom}>
                                    <Text style={styles.itemPrice}>{item.price}</Text>
                                    <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
                                        <Text style={styles.addBtnText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Image source={{ uri: item.img }} style={styles.itemImage} />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                    </View>
                ))}
            </ScrollView>

            {/* Cart FAB */}
            <View style={styles.cartBarWrap}>
                <TouchableOpacity
                    style={styles.cartBar}
                    onPress={() => router.push('/cart')}
                    activeOpacity={0.9}
                >
                    <View style={styles.cartCount}>
                        <Text style={styles.cartCountText}>3 items</Text>
                    </View>
                    <Text style={styles.cartLabel}>Ver Carrito</Text>
                    <Text style={styles.cartTotal}>$375.00</Text>
                </TouchableOpacity>
            </View>
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
