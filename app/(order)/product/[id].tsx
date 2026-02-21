import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProductDetails() {
    const router = useRouter();
    const [qty, setQty] = useState(1);

    return (
        <View style={styles.container}>
            {/* Hero Image */}
            <View style={styles.heroWrap}>
                <Image
                    source={{
                        uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUKmyhD91id4_mXm1jlYvdpyVjv6XfA22aDWvFmC-J7CALDc8sFyVpOiCSYcPLsJ9jtX8_uUEDTtTzvDPZVT1nZp0aq2VOi2u182aShokqENFHeroF9_RMCmAvmP5gWvKqIYfzn71606kesRgm8XMVcwRCmXW71ukuN_7s6oOjj41xxgfewQOTP9VpGXH5xdKKfY_458sJeTUbl3uhN7wJphwpwbaJUTCwkR7WEpe4H5ppKxRMep-9UO7xfLHaGn6sEe7WGN3FIOnt',
                    }}
                    style={styles.heroImg}
                />
                <View style={styles.heroOverlay} />
                <View style={styles.heroActions}>
                    <TouchableOpacity
                        style={styles.heroBtn}
                        onPress={() => router.back()}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.heroBtnText}>←</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.heroBtn} activeOpacity={0.8}>
                        <Text style={styles.heroBtnText}>♡</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            <View style={styles.contentCard}>
                <View style={styles.dragHandle} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>Hamburguesa Doble Queso</Text>
                        <View>
                            <Text style={styles.price}>$12.50</Text>
                            <Text style={styles.priceOld}>$14.00</Text>
                        </View>
                    </View>

                    <View style={styles.metaRow}>
                        <View style={styles.metaChip}>
                            <Text style={styles.metaEmoji}>⭐</Text>
                            <Text style={styles.metaBold}>4.8</Text>
                            <Text style={styles.metaSub}>(1.2k)</Text>
                        </View>
                        <View style={styles.metaChip}>
                            <Text style={styles.metaEmoji}>🕐</Text>
                            <Text style={styles.metaSub}>15-20 min</Text>
                        </View>
                        <View style={styles.metaChip}>
                            <Text style={styles.metaEmoji}>🔥</Text>
                            <Text style={styles.metaSub}>540 kcal</Text>
                        </View>
                    </View>

                    <View style={styles.descSection}>
                        <Text style={styles.descTitle}>Descripción</Text>
                        <Text style={styles.desc}>
                            Carne de res premium, doble queso cheddar derretido, lechuga
                            fresca, tomate y nuestra salsa secreta Speedy. Servida en pan
                            brioche artesanal recién horneado.
                        </Text>
                    </View>
                </ScrollView>
            </View>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                {/* Quantity */}
                <View style={styles.qtyControl}>
                    <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => setQty(Math.max(1, qty - 1))}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyValue}>{qty}</Text>
                    <TouchableOpacity
                        style={styles.qtyBtnPrimary}
                        onPress={() => setQty(qty + 1)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.qtyBtnPrimaryText}>+</Text>
                    </TouchableOpacity>
                </View>

                {/* Add to cart */}
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => router.push('/cart')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.addBtnLeft}>Agregar</Text>
                    <Text style={styles.addBtnRight}>${(12.5 * qty).toFixed(2)}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundLight },
    heroWrap: { height: '45%' as any, position: 'relative' },
    heroImg: { width: '100%', height: '100%' },
    heroOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 120,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    heroActions: {
        position: 'absolute',
        top: 52,
        left: 16,
        right: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    heroBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroBtnText: { fontSize: 20, color: Colors.white },
    contentCard: {
        flex: 1,
        marginTop: -32,
        backgroundColor: Colors.backgroundLight,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 120,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 12,
    },
    dragHandle: {
        width: 48,
        height: 5,
        borderRadius: 3,
        backgroundColor: Colors.slate200,
        alignSelf: 'center',
        marginBottom: 16,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 16,
    },
    title: {
        flex: 1,
        fontSize: 26,
        fontWeight: '800',
        color: Colors.slate900,
        letterSpacing: -0.5,
        lineHeight: 32,
    },
    price: { fontSize: 22, fontWeight: '700', color: Colors.primary, textAlign: 'right' },
    priceOld: {
        fontSize: 14,
        color: Colors.gray400,
        textDecorationLine: 'line-through',
        textAlign: 'right',
    },
    metaRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    metaChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaEmoji: { fontSize: 16 },
    metaBold: { fontSize: 13, fontWeight: '700', color: Colors.slate900 },
    metaSub: { fontSize: 13, color: Colors.slate500 },
    descSection: { gap: 8 },
    descTitle: { fontSize: 18, fontWeight: '700', color: Colors.slate900 },
    desc: { fontSize: 15, color: Colors.slate500, lineHeight: 22 },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(248,247,246,0.96)',
        borderTopWidth: 1,
        borderTopColor: Colors.gray100,
        paddingHorizontal: 20,
        paddingVertical: 12,
        paddingBottom: 28,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    qtyControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.gray200,
        borderRadius: 999,
        height: 52,
        paddingHorizontal: 6,
        gap: 0,
    },
    qtyBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 1,
    },
    qtyBtnText: { fontSize: 20, color: Colors.slate700, lineHeight: 24 },
    qtyValue: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.slate900,
        width: 32,
        textAlign: 'center',
    },
    qtyBtnPrimary: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 4,
        elevation: 3,
    },
    qtyBtnPrimaryText: { fontSize: 20, color: Colors.white, lineHeight: 24 },
    addBtn: {
        flex: 1,
        height: 52,
        backgroundColor: Colors.primary,
        borderRadius: 999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    addBtnLeft: { fontSize: 16, fontWeight: '700', color: Colors.white },
    addBtnRight: { fontSize: 16, fontWeight: '700', color: Colors.white },
});
