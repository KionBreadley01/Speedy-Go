import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { height } = Dimensions.get('window');

export default function LocationPermissionScreen() {
    const router = useRouter();
    const translateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(translateY, {
                    toValue: -12,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const goHome = () => router.replace('/(tabs)/home');

    return (
        <View style={styles.container}>
            {/* Map mock background */}
            <LinearGradient
                colors={['#e8f4f8', '#d4e8ef']}
                style={styles.mapBg}
            />

            {/* Top Content */}
            <View style={styles.topContent}>
                <Text style={styles.topTitle}>
                    Te ayudamos a encontrar los productos y servicios que están cerca de ti
                </Text>

                <Animated.Text
                    style={[styles.pinEmoji, { transform: [{ translateY }] }]}
                >
                    📍
                </Animated.Text>
            </View>

            {/* Bottom Sheet */}
            <View style={styles.sheet}>
                <View style={styles.sheetHandle} />

                <View style={styles.sheetContent}>
                    <View style={styles.iconCircle}>
                        <Text style={{ fontSize: 24 }}>📍</Text>
                    </View>

                    <Text style={styles.sheetTitle}>
                        ¿Permites que "Speedy Go" acceda a tu ubicación?
                    </Text>

                    <Text style={styles.sheetDesc}>
                        Utilizamos tu ubicación para mostrarte restaurantes y tiendas
                        cercanas y calcular el tiempo de entrega.
                    </Text>

                    <TouchableOpacity
                        style={styles.allowBtn}
                        onPress={goHome}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.allowBtnText}>Permitir ubicación</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.denyBtn}
                        onPress={goHome}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.denyBtnText}>No permitir</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    mapBg: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.8,
    },
    topContent: {
        flex: 1,
        paddingHorizontal: 28,
        paddingTop: 80,
        alignItems: 'center',
        gap: 40,
    },
    topTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.slate900,
        textAlign: 'center',
        lineHeight: 30,
    },
    pinEmoji: {
        fontSize: 100,
        marginTop: 20,
    },
    sheet: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 16,
    },
    sheetHandle: {
        width: 44,
        height: 5,
        borderRadius: 3,
        backgroundColor: Colors.gray300,
        alignSelf: 'center',
        marginBottom: 24,
    },
    sheetContent: {
        alignItems: 'center',
        gap: 16,
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#e0f2fe',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sheetTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: Colors.slate900,
        textAlign: 'center',
        lineHeight: 24,
    },
    sheetDesc: {
        fontSize: 13,
        color: Colors.gray500,
        textAlign: 'center',
        lineHeight: 20,
    },
    allowBtn: {
        width: '100%',
        backgroundColor: Colors.primary,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        marginTop: 8,
    },
    allowBtnText: {
        color: Colors.white,
        fontSize: 15,
        fontWeight: '600',
    },
    denyBtn: {
        width: '100%',
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    denyBtnText: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '500',
    },
});
