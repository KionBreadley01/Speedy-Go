import { Colors } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LegalScreen() {
    const router = useRouter();

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
                <Text style={styles.headerTitle}>Privacidad</Text>
            </View>


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 12,
        paddingTop: 8,
        backgroundColor: Colors.white,
        gap: 8,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.slate900,
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
        paddingTop: 12,
    },
    linksSection: {
        backgroundColor: Colors.white,
        marginTop: 4,
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
});