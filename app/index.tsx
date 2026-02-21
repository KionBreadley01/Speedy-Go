import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['rgba(236,109,19,0.05)', 'transparent']}
                style={styles.topGradient}
            />

            {/* Hero Section */}
            <View style={styles.heroSection}>
                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </View>

            {/* CTA Section */}
            <View style={styles.ctaSection}>
                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => router.push('/register')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.primaryBtnText}>Registrarse</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => router.push('/login')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.secondaryBtnText}>Iniciar sesión</Text>
                </TouchableOpacity>

                <Text style={styles.termsText}>
                    Al continuar, aceptas nuestros{' '}
                    <Text
                        style={styles.termsLink}
                        onPress={() => router.push('/terms')}
                    >
                        Términos
                    </Text>{' '}
                    y{' '}
                    <Text style={styles.termsLink}>Política de Privacidad</Text>.
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
    },
    topGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
    },
    heroSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        gap: 24,
    },
    logoImage: {
        width: 280,
        height: 280,
    },
    boltBadge: {
        position: 'absolute',
        bottom: 4,
        right: -4,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 4,
    },
    boltIcon: {
        fontSize: 18,
    },
    titleBlock: {
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 42,
        fontWeight: '800',
        color: Colors.slate900,
        letterSpacing: -1,
        lineHeight: 48,
    },
    titleHighlight: {
        color: Colors.primary,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '500',
        color: Colors.slate500,
        textAlign: 'center',
        lineHeight: 26,
    },
    ctaSection: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        gap: 16,
    },
    primaryBtn: {
        backgroundColor: Colors.primary,
        height: 56,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    primaryBtnText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    secondaryBtn: {
        height: 56,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        borderWidth: 2,
        borderColor: Colors.slate100,
    },
    secondaryBtnText: {
        color: Colors.slate900,
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    termsText: {
        textAlign: 'center',
        fontSize: 12,
        color: Colors.gray400,
        marginTop: 8,
        lineHeight: 18,
    },
    termsLink: {
        color: Colors.primary,
        textDecorationLine: 'underline',
    },
});
