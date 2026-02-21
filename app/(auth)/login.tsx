import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Logo */}
                    <View style={styles.logoSection}>
                        <Image
                            source={require('../../assets/images/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.title}>Bienvenido de nuevo</Text>
                        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Correo electrónico</Text>
                            <View style={styles.inputWrap}>
                                <Text style={styles.inputIcon}>✉️</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="tu@correo.com"
                                    placeholderTextColor={Colors.gray400}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Contraseña</Text>
                            <View style={styles.inputWrap}>
                                <Text style={styles.inputIcon}>🔒</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor={Colors.gray400}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    activeOpacity={0.7}
                                    style={styles.eyeBtn}
                                >
                                    <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.forgotWrap} activeOpacity={0.7}>
                                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.submitBtn}
                            onPress={() => router.replace('/(tabs)/home')}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.submitBtnText}>Iniciar sesión</Text>
                            <Text style={styles.submitArrow}>→</Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.dividerRow}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>o continúa con</Text>
                            <View style={styles.divider} />
                        </View>

                        {/* Google */}
                        <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8}>
                            <Text style={styles.googleIcon}>G</Text>
                            <Text style={styles.googleBtnText}>Iniciar sesión con Google</Text>
                        </TouchableOpacity>

                        {/* Register link */}
                        <View style={styles.registerRow}>
                            <Text style={styles.registerText}>¿No tienes cuenta? </Text>
                            <TouchableOpacity onPress={() => router.push('/register')} activeOpacity={0.7}>
                                <Text style={styles.registerLink}>Regístrate</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundLight },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.gray100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: { fontSize: 20, color: Colors.slate900 },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        gap: 32,
    },
    logoSection: {
        alignItems: 'center',
        gap: 8,
        paddingTop: 8,
    },
    logo: { width: 120, height: 120 },
    title: { fontSize: 26, fontWeight: '800', color: Colors.slate900, letterSpacing: -0.5 },
    subtitle: { fontSize: 15, color: Colors.slate500 },
    form: { gap: 20 },
    inputGroup: { gap: 6 },
    label: { fontSize: 13, fontWeight: '700', color: Colors.slate700, paddingLeft: 4 },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: Colors.borderColor,
        paddingHorizontal: 16,
        height: 54,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    inputIcon: { fontSize: 18 },
    input: { flex: 1, fontSize: 15, color: Colors.slate900 },
    forgotWrap: { alignSelf: 'flex-end', marginTop: 4 },
    forgotText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
    submitBtn: {
        backgroundColor: Colors.primary,
        height: 56,
        borderRadius: 999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 4,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    submitBtnText: { fontSize: 17, fontWeight: '700', color: Colors.white },
    submitArrow: { fontSize: 20, color: Colors.white },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    divider: { flex: 1, height: 1, backgroundColor: Colors.gray200 },
    dividerText: { fontSize: 13, color: Colors.gray400, fontWeight: '500' },
    googleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        height: 54,
        borderRadius: 999,
        backgroundColor: Colors.white,
        borderWidth: 1.5,
        borderColor: Colors.gray200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    googleIcon: { fontSize: 18, fontWeight: '800', color: '#4285F4' },
    googleBtnText: { fontSize: 15, fontWeight: '600', color: Colors.slate900 },
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerText: { fontSize: 14, color: Colors.slate500 },
    registerLink: { fontSize: 14, fontWeight: '700', color: Colors.primary },
    eyeBtn: { padding: 6, marginLeft: 2 },
    eyeIcon: { fontSize: 18 },
});
