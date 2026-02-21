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

const MENU_ITEMS = [
    { icon: '📍', label: 'Mis Direcciones', route: '/directions' },
    { icon: '💳', label: 'Métodos de pago', route: null },
    { icon: '🎁', label: 'Promociones', route: null },
];

const GENERAL_ITEMS = [
    { icon: '🎧', label: 'Ayuda y Soporte', route: '/incident' },
    { icon: '⚙️', label: 'Configuración', route: null },
];

export default function ProfileScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
                <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.7}>
                    <Text style={styles.settingsIcon}>⚙️</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Avatar */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrapper}>
                        <Image
                            source={{
                                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVyBQv4vFAOPV1_psZNJ4TJIClU7ULdGh53H_TE1JovT-_trWW1S8LFeLlpr8LNql05cgmNaBkh2LpjetqtrXORSYj-bijdMfc6sdHIAshYu2QbQTatXsMrA__KgT3W68w0gbXzNdOhNYwq8ehxJ_TNA68uTUIcbCGf-R4SzMCMjgBlX9iajmEJ_73q-Srx7aYB2uL-SFSwW6PK2jbV2ux52HyN5xcdeEGef5H5ShBwEpxHivJwXBTDB5XcW7cg24xnM3r4KQk2_Wi',
                            }}
                            style={styles.avatarImg}
                        />
                    </View>
                    <Text style={styles.userName}>Juan Pérez</Text>
                    <Text style={styles.userEmail}>juan.perez@email.com</Text>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>24</Text>
                        <Text style={styles.statLabel}>Pedidos</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>4.9</Text>
                        <Text style={styles.statLabel}>Rating</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>🏆</Text>
                        <Text style={styles.statLabel}>Gold</Text>
                    </View>
                </View>

                {/* Account section */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Cuenta</Text>
                    {MENU_ITEMS.map((item, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.menuItem}
                            onPress={() => item.route && router.push(item.route as any)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuIconWrap}>
                                <Text style={styles.menuEmoji}>{item.icon}</Text>
                            </View>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            <Text style={styles.chevron}>›</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* General section */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>General</Text>
                    {GENERAL_ITEMS.map((item, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.menuItem}
                            onPress={() => item.route && router.push(item.route as any)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuIconWrap}>
                                <Text style={styles.menuEmoji}>{item.icon}</Text>
                            </View>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            <Text style={styles.chevron}>›</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout */}
                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={() => router.replace('/')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.logoutIcon}>🚪</Text>
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
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
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray100,
        backgroundColor: '#fff',
    },
    headerTitle: { fontSize: 20, fontWeight: '700', color: Colors.slate900 },
    settingsBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingsIcon: { fontSize: 20 },
    scrollContent: { paddingBottom: 100, gap: 20, paddingHorizontal: 16 },
    avatarSection: { alignItems: 'center', paddingTop: 20, gap: 8 },
    avatarWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: Colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 6,
    },
    avatarImg: { width: '100%', height: '100%', borderRadius: 50 },
    userName: { fontSize: 22, fontWeight: '700', color: Colors.slate900 },
    userEmail: { fontSize: 14, color: Colors.slate500, fontWeight: '400' },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'space-around',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    statItem: { alignItems: 'center', gap: 4 },
    statValue: { fontSize: 22, fontWeight: '700', color: Colors.slate900 },
    statLabel: { fontSize: 12, color: Colors.slate500 },
    statDivider: { width: 1, height: 40, backgroundColor: Colors.gray200 },
    section: { gap: 8 },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.gray400,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        paddingLeft: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    menuIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: `${Colors.primary}14`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuEmoji: { fontSize: 20 },
    menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.slate900 },
    chevron: { fontSize: 22, color: Colors.gray400 },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 2,
        borderColor: Colors.gray200,
        borderRadius: 16,
        padding: 14,
        marginTop: 4,
    },
    logoutIcon: { fontSize: 20 },
    logoutText: { fontSize: 15, fontWeight: '600', color: Colors.slate500 },
});
