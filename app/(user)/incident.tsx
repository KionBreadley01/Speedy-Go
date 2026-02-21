import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
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

export default function IncidentScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backIcon}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Reportar incidente</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Order ref */}
                <View style={styles.orderCard}>
                    <Image
                        source={{
                            uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7xso3iBkY9p-yhGw6uEMi_ubNF2I1NGwgRLnOn1e57usSLb-SkOokwGIBSEEc9O9BjI8txCwCn-Jh7HcKMpFCN9MpVnioLUb3efyGlGCOjl99d8IRZ5LnGcmOTi7TbObgwTB1LC37ZYrBqn4a2_DYCGmni24Hs2sTXmePSWfwNMrJ-u0Qo3zXcTY5kaB8N7T9glHSMO91NkEPcrY__3ETycbQEYkIpK7ZElEjVp--mWhw9WbeDgT8kxKfOZRpPF5fUyHqdpvYwK6t',
                        }}
                        style={styles.orderImg}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.orderNum}>#4921</Text>
                        <Text style={styles.orderName}>Burger King • Downtown</Text>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.formSection}>
                    <Text style={styles.heading}>¿Qué pasó?</Text>
                    <Text style={styles.subheading}>
                        Lamentamos que algo salió mal. Cuéntanos para resolverlo de inmediato.
                    </Text>

                    {/* Category quick select */}
                    <Text style={styles.label}>Categoría</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                        {['Pedido incorrecto', 'Producto dañado', 'Entrega tardía', 'No llegó'].map((c, i) => (
                            <TouchableOpacity key={i} style={styles.chip} activeOpacity={0.7}>
                                <Text style={styles.chipText}>{c}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <Text style={styles.label}>Descripción</Text>
                    <TextInput
                        style={styles.textarea}
                        multiline
                        numberOfLines={6}
                        placeholder="Describe el problema brevemente para ayudarte más rápido..."
                        placeholderTextColor={Colors.gray400}
                        textAlignVertical="top"
                    />
                </View>
            </ScrollView>

            {/* Submit */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={() => router.back()}
                    activeOpacity={0.85}
                >
                    <Text style={styles.submitBtnText}>Enviar reporte</Text>
                    <Text style={styles.sendArrow}>→</Text>
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
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: { fontSize: 28, color: Colors.slate900 },
    title: { fontSize: 17, fontWeight: '700', color: Colors.slate900, flex: 1, textAlign: 'center' },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 120, gap: 20 },
    orderCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: Colors.white,
        padding: 14,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.gray100,
    },
    orderImg: { width: 52, height: 52, borderRadius: 12 },
    orderNum: { fontSize: 11, fontWeight: '700', color: Colors.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
    orderName: { fontSize: 15, fontWeight: '700', color: Colors.slate900 },
    formSection: { gap: 12 },
    heading: { fontSize: 22, fontWeight: '800', color: Colors.slate900 },
    subheading: { fontSize: 14, color: Colors.slate500, lineHeight: 20 },
    label: { fontSize: 13, fontWeight: '700', color: Colors.slate900, paddingLeft: 2 },
    chipRow: { gap: 8, paddingVertical: 4 },
    chip: {
        borderWidth: 1.5,
        borderColor: Colors.borderColor,
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 7,
        backgroundColor: Colors.white,
    },
    chipText: { fontSize: 13, fontWeight: '500', color: Colors.textMain },
    textarea: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        padding: 16,
        fontSize: 15,
        color: Colors.slate900,
        minHeight: 150,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: 28,
        paddingTop: 10,
        backgroundColor: 'rgba(248,247,246,0.97)',
        borderTopWidth: 1,
        borderTopColor: Colors.gray100,
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
    sendArrow: { fontSize: 18, color: Colors.white },
});
