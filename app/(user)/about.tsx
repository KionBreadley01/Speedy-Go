import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';

export default function AboutScreen() {
    const router = useRouter();
    // Use expo-constants to get the app version, fallback to '1.0.0'
    const appVersion = Constants.expoConfig?.version || '1.0.0';

    const renderLink = (title: string, onPress?: () => void) => (
        <TouchableOpacity style={styles.linkItem} onPress={onPress} activeOpacity={0.7}>
            <Text style={styles.linkTitle}>{title}</Text>
            <Feather name="chevron-right" size={20} color={Colors.gray400} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Feather name="chevron-left" size={26} color={Colors.slate900} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Acerca de Speedy-Go</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
                {/* App Info Header */}
                <View style={styles.appInfoSection}>
                    <View style={styles.logoPlaceholder}>
                        <Feather name="zap" size={48} color={Colors.primary} />
                    </View>
                    <Text style={styles.appName}>Speedy-Go</Text>
                    <Text style={styles.appVersion}>Versión {appVersion}</Text>
                </View>

                {/* Links Section */}
                <View style={styles.linksSection}>
                    {renderLink('Términos y Condiciones')}
                    <View style={styles.divider} />
                    {renderLink('Aviso de Privacidad')}
                    <View style={styles.divider} />
                    {renderLink('Licencias de código abierto')}
                </View>

                {/* Footer / Copyright */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2026 Speedy-Go Inc.</Text>
                    <Text style={styles.footerText}>Todos los derechos reservados.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 8,
        backgroundColor: Colors.white,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: Colors.slate900,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    appInfoSection: {
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: Colors.white,
        marginBottom: 12,
    },
    logoPlaceholder: {
        width: 96,
        height: 96,
        borderRadius: 24,
        backgroundColor: `${Colors.primary}18`,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    appName: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.slate900,
        marginBottom: 4,
    },
    appVersion: {
        fontSize: 15,
        color: Colors.slate500,
    },
    linksSection: {
        backgroundColor: Colors.white,
    },
    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
    },
    linkTitle: {
        fontSize: 16,
        color: Colors.slate900,
        fontWeight: '400',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.gray100,
        marginLeft: 20,
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 13,
        color: Colors.gray400,
        lineHeight: 20,
    },
});
