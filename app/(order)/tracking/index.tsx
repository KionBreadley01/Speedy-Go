import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
    Animated,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrackingScreen() {
    const router = useRouter();
    const pulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1.4, duration: 700, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Top Nav */}
            <View style={styles.topNav}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.navTitle}>Estado del Pedido</Text>
                <TouchableOpacity
                    onPress={() => router.push('/incident')}
                    activeOpacity={0.7}
                >
                    <View style={styles.helpBadge}>
                        <Text style={styles.helpText}>Ayuda</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* ETA */}
            <View style={styles.etaSection}>
                <Text style={styles.etaLabel}>Llegada estimada</Text>
                <Text style={styles.etaTime}>12:45 PM</Text>
                <View style={styles.onTimeBadge}>
                    <Text style={styles.onTimeDot}>◉</Text>
                    <Text style={styles.onTimeText}>En tiempo</Text>
                </View>
            </View>

            {/* Map area */}
            <View style={styles.mapWrap}>
                <Image
                    source={{
                        uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqHJhOgzwfkMwObpAMXTpUeHF9fJZsXAuzv6I6irnhX-XNPeSvQXFwRZ5T_7aq2CpHg0AOBC9jHL_Zdi0z33mNNugiStLHWZunYqnCHoRiOPWOTo_MSBk8zsLFC3XAILrxrGzYJ8LAzbT1tsLbMWZCcj8DTPeidu2fXHA8IFdbXLyLFWc1vJDhtAOUMc_GFioQsz0YapUjX2vQgX9TfioLKg_6uxC2_uf2YHMsrRGEN9aGWKSLWjgPQpNO5M5hoKF2ueMsVEOGwl-R',
                    }}
                    style={styles.mapImg}
                />
                {/* Rider pin */}
                <View style={styles.pinWrap}>
                    <Animated.View
                        style={[styles.pingRing, { transform: [{ scale: pulse }] }]}
                    />
                    <View style={styles.riderPin}>
                        <Text style={styles.riderEmoji}>🛵</Text>
                    </View>
                </View>
            </View>

            {/* Progress steps */}
            <View style={styles.progressCard}>
                {[
                    { icon: '✅', label: 'Pedido confirmado', done: true },
                    { icon: '🍳', label: 'Preparando tu pedido', done: true },
                    { icon: '🛵', label: 'En camino', done: false, active: true },
                    { icon: '🏠', label: 'Entregado', done: false },
                ].map((step, i) => (
                    <View key={i} style={styles.stepRow}>
                        <View style={[styles.stepIcon, step.active && styles.stepIconActive]}>
                            <Text style={styles.stepEmoji}>{step.icon}</Text>
                        </View>
                        <Text style={[styles.stepLabel, step.active && styles.stepLabelActive]}>
                            {step.label}
                        </Text>
                        {step.done && <Text style={styles.stepCheck}>✓</Text>}
                    </View>
                ))}

                <TouchableOpacity
                    style={styles.completedLink}
                    onPress={() => router.push('/review')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.completedLinkText}>Simular entrega completada →</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundLight },
    topNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    backBtn: {
        width: 40,
        height: 40,
        backgroundColor: Colors.white,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.gray100,
    },
    backIcon: { fontSize: 18, color: Colors.slate800 },
    navTitle: { fontSize: 17, fontWeight: '700', color: Colors.slate900 },
    helpBadge: {
        backgroundColor: `${Colors.primary}18`,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },
    helpText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
    etaSection: { alignItems: 'center', paddingVertical: 16, gap: 4 },
    etaLabel: { fontSize: 12, fontWeight: '600', color: Colors.slate500, textTransform: 'uppercase', letterSpacing: 1 },
    etaTime: { fontSize: 44, fontWeight: '800', color: Colors.slate900, letterSpacing: -1 },
    onTimeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.green100,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
    },
    onTimeDot: { fontSize: 10, color: Colors.green700 },
    onTimeText: { fontSize: 11, fontWeight: '700', color: Colors.green700 },
    mapWrap: {
        marginHorizontal: 16,
        height: 200,
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 1,
        borderColor: Colors.gray200,
    },
    mapImg: { width: '100%', height: '100%' },
    pinWrap: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -24,
        marginLeft: -24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pingRing: {
        position: 'absolute',
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: `${Colors.primary}40`,
    },
    riderPin: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 4,
    },
    riderEmoji: { fontSize: 22 },
    progressCard: {
        margin: 16,
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 16,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    stepIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.gray100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepIconActive: { backgroundColor: `${Colors.primary}18` },
    stepEmoji: { fontSize: 16 },
    stepLabel: { flex: 1, fontSize: 14, color: Colors.slate500, fontWeight: '500' },
    stepLabelActive: { color: Colors.slate900, fontWeight: '700' },
    stepCheck: { fontSize: 16, color: Colors.success },
    completedLink: { alignItems: 'center', marginTop: 4 },
    completedLinkText: { fontSize: 13, color: Colors.primary, fontWeight: '700' },
});
