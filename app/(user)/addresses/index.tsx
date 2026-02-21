import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DirectionsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <View style={styles.closeBtnInner}>
                        <Text style={styles.closeIcon}>✕</Text>
                    </View>
                </TouchableOpacity>
                <Text style={styles.title}>Direcciones</Text>
            </View>

            {/* Empty State */}
            <View style={styles.emptyState}>
                <View style={styles.emptyIconWrap}>
                    <View style={styles.emptyIconBg}>
                        <Text style={styles.emptyEmoji}>📍</Text>
                    </View>
                </View>
                <Text style={styles.emptyTitle}>Tu zona, tus tiendas</Text>
                <Text style={styles.emptyDesc}>
                    Agrega tu primera dirección y empieza a explorar lo que hay cerca de ti.
                </Text>
            </View>

            {/* Add button */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => router.push('/addresses/add')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.addBtnText}>Agregar nueva dirección</Text>
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
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 4,
    },
    closeBtn: { marginRight: 4 },
    closeBtnInner: {
        width: 36,
        height: 36,
        backgroundColor: Colors.gray100,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeIcon: { fontSize: 14, color: Colors.slate700 },
    title: { fontSize: 17, fontWeight: '600', color: Colors.slate900 },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        gap: 14,
        marginTop: -60,
    },
    emptyIconWrap: {
        padding: 24,
        borderRadius: 999,
    },
    emptyIconBg: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.gray100,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    emptyEmoji: { fontSize: 34 },
    emptyTitle: { fontSize: 19, fontWeight: '700', color: Colors.slate900, textAlign: 'center' },
    emptyDesc: {
        fontSize: 14,
        color: Colors.gray500,
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: 260,
    },
    bottomBar: {
        paddingHorizontal: 24,
        paddingBottom: 36,
        paddingTop: 10,
    },
    addBtn: {
        backgroundColor: Colors.primary,
        height: 56,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    },
    addBtnText: { fontSize: 16, fontWeight: '600', color: Colors.white },
});
