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
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReviewScreen() {
    const router = useRouter();
    const [rating, setRating] = useState(0);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => router.replace('/(tabs)/home')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Califica tu pedido</Text>
                <TouchableOpacity
                    onPress={() => router.replace('/(tabs)/home')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.skipText}>Omitir</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.heading}>¿Cómo estuvo Burger King?</Text>

                {/* Restaurant card */}
                <View style={styles.restaurantCard}>
                    <Image
                        source={{
                            uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATxwg-ZOi518ct2KQt16O0ZlGOi9se8gitwZ6sEge6xB2H47okl6Qsc_vsIr--EycsrPqzmmHwIXqTqPzJ9rwSxmt-ffI1xDSqsaWZjpgsHBkRQ4yLUmlLuCXEuXX4DUdPauIeBKZCj-HTCR57LkD9dIXkOvz7hWOyCw4tj1nXxhJjlgdHTUrDdoQKGDMF4TkvanbSJpswNqB9AAO5mSRB7rDxpTwp_ehNM7N1RJef7eHDXCseKgk7tbs_Rmod0A9xTf3r730Pia3D',
                        }}
                        style={styles.restaurantLogo}
                    />
                    <Text style={styles.restaurantName}>Burger King</Text>
                    <Text style={styles.orderDetail}>3 artículos • 12 Oct</Text>

                    {/* Stars */}
                    <View style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => setRating(i)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.star, i <= rating && styles.starActive]}>
                                    ★
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.ratingLabel}>
                        {rating === 0
                            ? 'Toca para calificar'
                            : rating <= 2
                                ? 'Podría mejorar'
                                : rating === 3
                                    ? 'Regular'
                                    : rating === 4
                                        ? '¡Muy bueno!'
                                        : '¡Excelente! 🎉'}
                    </Text>
                </View>

                {/* Quick tags */}
                <View style={styles.tagsSection}>
                    <Text style={styles.tagsTitle}>¿Qué fue bien?</Text>
                    <View style={styles.tagsRow}>
                        {['Entrega rápida', 'Comida caliente', 'Delicioso', 'Buenos precios', 'Buen empaque'].map(
                            (t, i) => (
                                <TouchableOpacity key={i} style={styles.tag} activeOpacity={0.7}>
                                    <Text style={styles.tagText}>{t}</Text>
                                </TouchableOpacity>
                            )
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Submit */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={() => router.replace('/(tabs)/home')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.submitBtnText}>Enviar Review</Text>
                    <Text style={styles.sendIcon}>→</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundLight },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray100,
    },
    closeBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeIcon: { fontSize: 18, color: Colors.slate900 },
    title: { fontSize: 17, fontWeight: '700', color: Colors.slate900 },
    skipText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 120, paddingTop: 20, gap: 20 },
    heading: { fontSize: 22, fontWeight: '700', color: Colors.slate900, textAlign: 'center' },
    restaurantCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: Colors.gray100,
    },
    restaurantLogo: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    restaurantName: { fontSize: 20, fontWeight: '700', color: Colors.slate900 },
    orderDetail: { fontSize: 13, color: Colors.slate500 },
    starsRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
    star: { fontSize: 38, color: Colors.gray200 },
    starActive: { color: '#f59e0b' },
    ratingLabel: { fontSize: 14, color: Colors.slate500, fontWeight: '500' },
    tagsSection: { gap: 12 },
    tagsTitle: { fontSize: 16, fontWeight: '700', color: Colors.slate900 },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tag: {
        borderWidth: 1.5,
        borderColor: Colors.borderColor,
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 7,
        backgroundColor: Colors.white,
    },
    tagText: { fontSize: 13, fontWeight: '500', color: Colors.textMain },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(248,247,246,0.96)',
        borderTopWidth: 1,
        borderTopColor: Colors.gray100,
        paddingHorizontal: 20,
        paddingBottom: 28,
        paddingTop: 10,
    },
    submitBtn: {
        backgroundColor: Colors.primary,
        height: 56,
        borderRadius: 999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    submitBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
    sendIcon: { fontSize: 18, color: Colors.white },
});
