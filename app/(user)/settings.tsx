import { Colors } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../Lib/firebase';

export default function SettingsScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSignOut = async () => {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro de que deseas cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Cerrar sesión',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await auth.signOut();
                            // Optional: navigate to login explicitly if onAuthStateChanged doesn't handle it
                            router.replace('/(auth)/login' as any);
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo cerrar la sesión.');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const renderListItem = (title: string, value?: string, onPress?: () => void) => (
        <TouchableOpacity style={styles.listItem} onPress={onPress} activeOpacity={0.7}>
            <Text style={styles.itemTitle}>{title}</Text>
            <View style={styles.itemRight}>
                {value && <Text style={styles.itemValue}>{value}</Text>}
                <Feather name="chevron-right" size={20} color={Colors.gray400} />
            </View>
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
                <Text style={styles.headerTitle}>Configuración</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>

                    {/* Block 1 */}
                    <View style={styles.block}>
                        {renderListItem('Mi perfil', undefined, () => router.push('/edit-profile'))}
                        <View style={styles.divider} />
                        {renderListItem('Idiomas', 'Español')}
                        <View style={styles.divider} />

                    </View>

                    {/* Block 2 */}
                    <View style={styles.block}>
                        {renderListItem('Legal')}
                        <View style={styles.divider} />
                        {renderListItem('Privacidad')}
                    </View>

                    {/* Block 3 */}
                    <View style={styles.block}>
                        {renderListItem('Acerca de Speedy-Go', undefined, () => router.push('/about'))}
                        <View style={styles.divider} />
                        {renderListItem('Cerrar sesión', undefined, handleSignOut)}
                    </View>

                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // Lighter gray to mimic the section spacing
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
        marginBottom: 12, // Space between arrow and title
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: Colors.slate900,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    block: {
        marginTop: 12,
        backgroundColor: Colors.white,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
    },
    itemTitle: {
        fontSize: 16,
        color: Colors.slate900,
        fontWeight: '400',
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    itemValue: {
        fontSize: 14,
        color: Colors.gray400,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.gray100,
        marginLeft: 20,
    },
});
