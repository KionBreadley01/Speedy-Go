import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function TermsScreen() {
    const router = useRouter();
    const [accepted, setAccepted] = useState(false);

    return (
        <View style={styles.container}>
            {/* Top promo */}
            <LinearGradient colors={[Colors.primary, '#f97316']} style={styles.promoSection}>
                <Text style={styles.promoEmoji}>🎉</Text>
                <Text style={styles.promoTitle}>¡30 días de{'\n'}envíos gratis!</Text>
                <Text style={styles.promoSub}>Registrándote hoy</Text>
            </LinearGradient>

            {/* Bottom sheet */}
            <View style={styles.sheet}>
                <ScrollView
                    contentContainerStyle={styles.sheetContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.sheetTitle}>Términos y condiciones</Text>

                    <Text style={styles.termsText}>
                        Al usar Speedy Go, aceptas nuestros términos de servicio y política de privacidad. Speedy Go actúa como intermediario entre usuarios y restaurantes afiliados. Los tiempos de entrega son estimados y pueden variar según condiciones externas.{'\n\n'}
                        Al registrarte, confirmas que tienes al menos 18 años y que la información proporcionada es verídica. Speedy Go se reserva el derecho de suspender cuentas que incumplan estos términos.{'\n\n'}
                        Para más información visita nuestro sitio web.
                    </Text>

                    {/* Checkbox */}
                    <TouchableOpacity
                        style={styles.checkRow}
                        onPress={() => setAccepted(!accepted)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
                            {accepted && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.checkLabel}>
                            Acepto los Términos y condiciones.
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.acceptBtn, !accepted && styles.acceptBtnDisabled]}
                        onPress={() => accepted && router.back()}
                        activeOpacity={accepted ? 0.85 : 1}
                    >
                        <Text style={[styles.acceptBtnText, !accepted && styles.acceptBtnTextDisabled]}>
                            Aceptar
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    promoSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingTop: 60,
        paddingHorizontal: 24,
    },
    promoEmoji: { fontSize: 48 },
    promoTitle: {
        fontSize: 34,
        fontWeight: '800',
        color: Colors.white,
        textAlign: 'center',
        lineHeight: 42,
    },
    promoSub: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
    },
    sheet: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    sheetContent: {
        paddingHorizontal: 28,
        paddingTop: 28,
        paddingBottom: 40,
        gap: 20,
    },
    sheetTitle: { fontSize: 22, fontWeight: '700', color: Colors.slate900 },
    termsText: {
        fontSize: 14,
        color: Colors.slate500,
        lineHeight: 22,
    },
    checkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colors.gray300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    checkmark: { fontSize: 14, color: Colors.white, fontWeight: '700' },
    checkLabel: { flex: 1, fontSize: 14, color: Colors.slate700 },
    acceptBtn: {
        backgroundColor: Colors.primary,
        height: 54,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    acceptBtnDisabled: {
        backgroundColor: Colors.gray200,
        shadowOpacity: 0,
        elevation: 0,
    },
    acceptBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
    acceptBtnTextDisabled: { color: Colors.gray400 },
});
