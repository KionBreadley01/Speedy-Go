import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddAddressScreen() {
    const router = useRouter();

    const RECENT = [
        { icon: '🏠', label: 'Casa', sub: 'Calle 5, Col. Centro' },
        { icon: '💼', label: 'Trabajo', sub: 'Av. Reforma 123, Piso 4' },
    ];

    const SUGGESTIONS = [
        { icon: '📍', label: 'Seleccionar en el mapa' },
        { icon: '🎯', label: 'Usar mi ubicación actual' },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Agregar nueva dirección</Text>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Search */}
                <View style={styles.searchWrap}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar dirección"
                        placeholderTextColor={Colors.gray400}
                        autoFocus
                    />
                </View>

                {/* Quick actions */}
                {SUGGESTIONS.map((s, i) => (
                    <TouchableOpacity key={i} style={styles.rowItem} activeOpacity={0.7}>
                        <View style={styles.rowIcon}>
                            <Text style={{ fontSize: 20 }}>{s.icon}</Text>
                        </View>
                        <Text style={styles.rowLabel}>{s.label}</Text>
                        <Text style={styles.rowArrow}>›</Text>
                    </TouchableOpacity>
                ))}

                <View style={styles.divider} />

                {/* Recent */}
                <Text style={styles.sectionLabel}>Recientes</Text>
                {RECENT.map((r, i) => (
                    <TouchableOpacity
                        key={i}
                        style={styles.rowItem}
                        activeOpacity={0.7}
                        onPress={() => router.back()}
                    >
                        <View style={[styles.rowIcon, { backgroundColor: `${Colors.primary}14` }]}>
                            <Text style={{ fontSize: 20 }}>{r.icon}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.rowLabel}>{r.label}</Text>
                            <Text style={styles.rowSub} numberOfLines={1}>{r.sub}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray100,
        gap: 6,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: { fontSize: 20, color: Colors.slate900 },
    title: { fontSize: 16, fontWeight: '600', color: Colors.slate900 },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40, gap: 4 },
    searchWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.gray50,
        borderRadius: 20,
        paddingHorizontal: 16,
        height: 52,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: Colors.gray100,
        gap: 10,
    },
    searchIcon: { fontSize: 18 },
    searchInput: { flex: 1, fontSize: 15, color: Colors.slate900 },
    rowItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        gap: 14,
    },
    rowIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.gray100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.slate900 },
    rowSub: { fontSize: 12, color: Colors.slate500, marginTop: 2 },
    rowArrow: { fontSize: 22, color: Colors.gray400 },
    divider: { height: 1, backgroundColor: Colors.gray100, marginVertical: 8 },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.gray400,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        paddingLeft: 14,
        marginTop: 4,
        marginBottom: 4,
    },
});
