import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../Lib/firebase";

export default function RegisterScreen() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    // Auth States
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            alert("Por favor llena todos los campos");
            return;
        }

        if (password.length < 8) {
            alert("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );

            // Set user name
            await updateProfile(userCredential.user, {
                displayName: name
            });

            console.log("Usuario registrado:", userCredential.user.email);

            // Navigate to next screen
            router.push('/location-permission');
        } catch (error: any) {
            console.log(error);
            alert("No se pudo registrar la cuenta. " + (error.message || ""));
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={{ width: 10 }} />
                <Text style={styles.headerTitle}>Crear cuenta</Text>
                <View style={{ width: 10 }} />
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Logo area */}
                <View style={styles.logoArea}>
                    <View style={styles.logoBadge}>
                        <Text style={styles.logoIcon}>🚀</Text>
                    </View>
                    <Text style={styles.title}>Únete a Speedy Go</Text>
                    <Text style={styles.subtitle}>
                        Tu comida favorita, más rápido que nunca.
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {/* Name */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Nombre completo</Text>
                        <View style={styles.inputWrap}>
                            <Text style={styles.inputIcon}>👤</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej. Juan Pérez"
                                placeholderTextColor={Colors.gray400}
                                autoCapitalize="words"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    </View>

                    {/* Email */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Correo electrónico</Text>
                        <View style={styles.inputWrap}>
                            <Text style={styles.inputIcon}>✉️</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="nombre@ejemplo.com"
                                placeholderTextColor={Colors.gray400}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                    </View>

                    {/* Password */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Contraseña</Text>
                        <View style={styles.inputWrap}>
                            <Text style={styles.inputIcon}>🔒</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Mínimo 8 caracteres"
                                placeholderTextColor={Colors.gray400}
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                activeOpacity={0.7}
                                style={styles.eyeBtn}
                            >
                                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ height: 8 }} />

                    {/* Submit */}
                    <TouchableOpacity
                        style={styles.submitBtn}
                        onPress={handleRegister}
                        activeOpacity={0.85}
                        disabled={loading}
                    >
                        <Text style={styles.submitBtnText}>
                            {loading ? "Registrando..." : "Crear cuenta"}
                        </Text>
                        <Text style={styles.arrow}>→</Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>O regístrate con</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Google */}
                    <View style={styles.socialRow}>
                        <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
                            <Text style={styles.socialBtnText}>G</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.loginText}>
                        ¿Ya tienes una cuenta?{' '}
                        <Text
                            style={styles.loginLink}
                            onPress={() => router.replace('/(auth)/login')}
                        >
                            Iniciar sesión
                        </Text>
                    </Text>
                </View>
            </ScrollView>
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
        justifyContent: 'space-between',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: { fontSize: 20, color: Colors.textMain },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textMain,
        flex: 1,
        textAlign: 'center',
    },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
    logoArea: {
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 32,
        gap: 8,
    },
    logoBadge: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: `${Colors.primary}18`,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    logoIcon: { fontSize: 32 },
    title: {
        fontSize: 30,
        fontWeight: '800',
        color: Colors.textMain,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '500',
        color: Colors.textSecondary,
        textAlign: 'center',
        maxWidth: 260,
        lineHeight: 22,
    },
    form: { gap: 20 },
    fieldGroup: { gap: 6 },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.textMain,
        paddingLeft: 4,
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        paddingHorizontal: 16,
        height: 52,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    inputIcon: { fontSize: 18, marginRight: 10 },
    eyeBtn: {
        padding: 6,
        marginLeft: 4,
    },
    eyeIcon: { fontSize: 18 },
    input: {
        flex: 1,
        fontSize: 14,
        color: Colors.textMain,
        fontWeight: '400',
    },
    submitBtn: {
        backgroundColor: Colors.primary,
        height: 56,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    submitBtnText: {
        color: Colors.white,
        fontSize: 17,
        fontWeight: '700',
    },
    arrow: { color: Colors.white, fontSize: 18 },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginVertical: 4,
    },
    dividerLine: { flex: 1, height: 1, backgroundColor: Colors.gray200 },
    dividerText: {
        fontSize: 11,
        color: Colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    socialBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    socialBtnText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#4285F4',
    },
    loginText: {
        textAlign: 'center',
        fontSize: 14,
        color: Colors.textMain,
        marginTop: 4,
        paddingBottom: 16,
    },
    loginLink: {
        color: Colors.primary,
        fontWeight: '700',
    },
});
