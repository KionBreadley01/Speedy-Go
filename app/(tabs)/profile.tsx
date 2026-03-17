import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { auth } from '../../Lib/firebase';
import { userService, UserProfile } from '../../Lib/services/userService';

const MI_CUENTA_ITEMS = [
    { icon: 'settings', label: 'Configuración', route: '/settings' },
    { icon: 'headphones', label: 'Ayuda', route: '/incident' },
    { icon: 'heart', label: 'Mis favoritos', route: '/favorites' },
    { icon: 'map-pin', label: 'Mi dirección', route: '/addresses' },
];

const OTROS_ITEMS = [
    { icon: 'truck', label: 'Sé socio\nrepartidor', route: null },
    { icon: 'shopping-bag', label: 'Abrir una\ntienda', route: null },
];

export default function ProfileScreen() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const data = await userService.getUserProfile(user.uid);
                    setProfile(data);
                } catch (e) {
                    console.error(e);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </SafeAreaView>
        );
    }

    const getInitials = () => {
        if (profile?.firstName && profile?.lastName) {
            return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
        }
        return 'US'; // User Default
    };

    const getDisplayName = () => {
        if (profile?.firstName) {
            return `${profile.firstName} ${profile.lastName ? profile.lastName[0] + '.' : ''}`;
        }
        const user = auth.currentUser;
        if (user?.email) return user.email.split('@')[0];
        return 'Usuario';
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Cuenta</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* User Info Section */}
                <View style={styles.userInfoContainer}>
                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>{getInitials()}</Text>
                    </View>
                    
                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>{getDisplayName()}</Text>
                        <TouchableOpacity 
                            onPress={() => router.push('/edit-profile')}
                            activeOpacity={0.7}
                            style={styles.editProfileBtn}
                        >
                            <Text style={styles.editProfileText}>Editar perfil {'>'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Mi Cuenta Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Mi cuenta</Text>
                    <View style={styles.listContainer}>
                        {MI_CUENTA_ITEMS.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.listItem}
                                onPress={() => item.route && router.push(item.route as any)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.listLeft}>
                                    <View style={styles.listIconWrap}>
                                        <Feather name={item.icon as any} size={22} color={Colors.slate700} />
                                    </View>
                                    <Text style={styles.listLabel}>{item.label}</Text>
                                </View>
                                <Feather name="chevron-right" size={20} color={Colors.gray300} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Otros Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Otros</Text>
                    <View style={styles.listContainer}>
                        {OTROS_ITEMS.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.listItem}
                                onPress={() => item.route && router.push(item.route as any)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.listLeft}>
                                    <View style={styles.listIconWrap}>
                                        <Feather name={item.icon as any} size={22} color={Colors.slate700} />
                                    </View>
                                    <Text style={styles.listLabel}>{item.label.replace('\n', ' ')}</Text>
                                </View>
                                <Feather name="chevron-right" size={20} color={Colors.gray300} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Pedidos (Moved from main UI to keep functionality accessible) */}
                <TouchableOpacity
                    style={styles.floatingOrderBtn}
                    onPress={() => router.push('/tracking')}
                >
                    <Feather name="file-text" size={20} color={Colors.white} />
                    <Text style={styles.floatingOrderText}>Ver pedidos</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.backgroundLight },
    container: { flex: 1, backgroundColor: Colors.backgroundLight },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerTitle: { fontSize: 32, fontWeight: '800', color: Colors.slate900 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
    
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    avatarCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F3F4F6', // Light gray from image
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.slate900,
    },
    userDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    userName: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.slate900,
        marginBottom: 4,
    },
    editProfileBtn: {
        paddingVertical: 4,
    },
    editProfileText: {
        fontSize: 15,
        color: Colors.slate500,
        fontWeight: '500',
    },

    sectionCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        paddingTop: 24,
        paddingBottom: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.slate900,
        marginBottom: 8,
        paddingHorizontal: 24,
    },
    listContainer: {
        flexDirection: 'column',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 24,
    },
    listLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.gray100,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    listLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.slate800,
    },
    floatingOrderBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 999,
        paddingVertical: 14,
        marginTop: 12,
        gap: 8,
    },
    floatingOrderText: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.white,
    }
});
