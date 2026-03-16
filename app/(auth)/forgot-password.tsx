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

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../Lib/firebase";

export default function ForgotPasswordScreen() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {

        if (!email) {
            alert("Por favor ingresa tu correo electrónico");
            return;
        }

        setLoading(true);

        try {

            await sendPasswordResetEmail(auth, email.trim());

            alert("Correo enviado. Revisa tu bandeja de entrada para restablecer tu contraseña.");
            router.back();

        } catch (error) {

            console.log(error);
            alert("No se pudo enviar el correo. Verifica tu dirección o intenta más tarde.");

        } finally {
            setLoading(false);
        }

    };

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

                    {/* Logo & Texts */}
                    <View style={styles.logoSection}>
                        <Image
                            source={require('../../assets/images/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.title}>Recuperar cuenta</Text>
                        <Text style={styles.subtitle}>Ingresa tu correo para restablecer la contraseña</Text>
                    </View>

                    <View style={styles.form}>

                        {/* EMAIL */}
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
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>

                        {/* SUBMIT BUTTON */}
                        <TouchableOpacity
                            style={styles.submitBtn}
                            onPress={handleResetPassword}
                            activeOpacity={0.85}
                            disabled={loading}
                        >
                            <Text style={styles.submitBtnText}>
                                {loading ? "Enviando..." : "Enviar enlace"}
                            </Text>

                            <Text style={styles.submitArrow}>→</Text>
                        </TouchableOpacity>

                    </View>

                </ScrollView>

            </KeyboardAvoidingView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundLight || '#F8FAFC' },

    header: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },

    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.gray100 || '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },

    backIcon: { fontSize: 20, color: Colors.slate900 || '#0F172A' },

    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        gap: 32,
    },

    logoSection: {
        alignItems: 'center',
        gap: 8,
        paddingTop: 8,
        paddingHorizontal: 10,
    },

    logo: { width: 120, height: 120 },

    title: {
        fontSize: 26,
        fontWeight: '800',
        color: Colors.slate900 || '#0F172A',
        letterSpacing: -0.5,
        textAlign: 'center'
    },

    subtitle: {
        fontSize: 15,
        color: Colors.slate500 || '#64748B',
        textAlign: 'center'
    },

    form: { gap: 20 },

    inputGroup: { gap: 6 },

    label: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.slate700 || '#334155',
        paddingLeft: 4
    },

    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white || '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: Colors.borderColor || '#E2E8F0',
        paddingHorizontal: 16,
        height: 54,
        gap: 10
    },

    inputIcon: { fontSize: 18 },

    input: {
        flex: 1,
        fontSize: 15,
        color: Colors.slate900 || '#0F172A'
    },

    submitBtn: {
        backgroundColor: Colors.primary || '#3B82F6',
        height: 56,
        borderRadius: 999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 10
    },

    submitBtnText: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.white || '#FFFFFF'
    },

    submitArrow: {
        fontSize: 20,
        color: Colors.white || '#FFFFFF'
    }
});
