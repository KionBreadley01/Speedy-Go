import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    Modal,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { useAddressStore, AddressItem } from '@/store/addressStore';
import { userService } from '@/Lib/services/userService';
import { auth } from '@/Lib/firebase';
import { useEffect, useState } from 'react';

const FRECUENTES = [
    { label: 'Casa', sub: 'Establecer dirección', icon: 'home' },
    { label: 'Oficina', sub: 'Establecer dirección', icon: 'briefcase' },
];

export default function DirectionsScreen() {
    const router = useRouter();
    const { addresses, setAddresses, currentAddress, setCurrentAddress, removeAddressFromStore } = useAddressStore();
    const [loading, setLoading] = useState(true);
    const [menuAddress, setMenuAddress] = useState<AddressItem | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchAddresses = async () => {
             const user = auth.currentUser;
             if (user) {
                  try {
                       const data = await userService.getAddresses(user.uid);
                       setAddresses(data);
                  } catch (e) {
                       console.error(e);
                  }
             }
             setLoading(false);
        };
        fetchAddresses();
    }, []);

    const handleDeleteAddress = async () => {
        if (!menuAddress?.id) return;
        const user = auth.currentUser;
        if (!user) return;

        setDeleting(true);
        try {
             await userService.deleteAddress(user.uid, menuAddress.id);
             removeAddressFromStore(menuAddress.id);
             setMenuAddress(null);
        } catch (e) {
             console.error(e);
             alert("No se pudo eliminar la dirección");
        } finally {
             setDeleting(false);
        }
    };

    const handleSelectAddress = (address: AddressItem) => {
        setCurrentAddress(address);
        router.replace('/(tabs)/home'); 
    };

    const getIcon = (type?: string) => {
        switch(type) {
            case 'Oficina': return 'briefcase';
            case 'Casa': return 'home';
            case 'Departamento': return 'shield';
            case 'Residencial': return 'user';
            case 'Hotel': return 'heart';
            default: return 'map-pin';
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Feather name="x" size={18} color={Colors.slate900} />
                </TouchableOpacity>
                <Text style={styles.title}>Direcciones</Text>
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
            >
                {/* Direcciones frecuentes */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Direcciones frecuentes</Text>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        contentContainerStyle={styles.frecuentesRow}
                    >
                        {FRECUENTES.map((f, i) => (
                            <TouchableOpacity key={i} style={styles.frequentCard} activeOpacity={0.84}>
                                <View style={styles.frequentIconWrap}>
                                    <Feather name={f.icon as any} size={20} color={Colors.slate800} />
                                </View>
                                <Text style={styles.frequentLabel}>{f.label}</Text>
                                <Text style={styles.frequentSub} numberOfLines={1}>{f.sub}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Direcciones guardadas */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Direcciones guardadas</Text>
                    <View style={styles.listContainer}>
                        {loading ? (
                            <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: 10 }} />
                        ) : addresses.length > 0 ? (
                            addresses.map((g, i) => (
                                <TouchableOpacity 
                                    key={g.id || i} 
                                    style={[
                                        styles.savedItem, 
                                        currentAddress?.id === g.id && styles.savedItemActive
                                    ]}
                                    activeOpacity={0.8}
                                    onPress={() => handleSelectAddress(g)}
                                >
                                    <View style={styles.savedIconWrap}>
                                        <Feather name={getIcon(g.type) as any} size={20} color={Colors.slate900} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.savedTitle}>{g.title}</Text>
                                        <Text style={styles.savedDesc}>{g.description}</Text>
                                    </View>
                                    <TouchableOpacity 
                                        style={styles.dotsBtn} 
                                        activeOpacity={0.6}
                                        onPress={() => setMenuAddress(g)}
                                    >
                                        <Feather name="more-horizontal" size={20} color={Colors.slate700} />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={styles.emptyText}>No hay direcciones guardadas</Text>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Button */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => router.push('/addresses/add')}
                    activeOpacity={0.88}
                >
                    <Text style={styles.addBtnText}>Agregar nueva dirección</Text>
                </TouchableOpacity>
            </View>

            {/* Context Menu Modal "Más opciones" */}
            <Modal
                visible={!!menuAddress}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setMenuAddress(null)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => setMenuAddress(null)} />
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Más opciones</Text>
                            <TouchableOpacity onPress={() => setMenuAddress(null)} style={styles.modalCloseBtn}>
                                <Feather name="x" size={18} color={Colors.slate900} />
                            </TouchableOpacity>
                        </View>

                        {menuAddress && (
                            <View style={styles.modalHeaderAddress}>
                                <View style={styles.modalHeaderIconWrap}>
                                    <Feather name={getIcon(menuAddress.type) as any} size={20} color={Colors.slate900} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.modalAddressTitle}>{menuAddress.title}</Text>
                                    <Text style={styles.modalAddressDesc}>{menuAddress.description}</Text>
                                </View>
                            </View>
                        )}

                        <View style={styles.modalDivider} />

                        {/* Options */}
                        <TouchableOpacity 
                            style={styles.modalOption} 
                            activeOpacity={0.7}
                            onPress={() => {
                                const id = menuAddress?.id;
                                setMenuAddress(null);
                                router.push(`/addresses/add?id=${id}`);
                            }}
                        >
                            <Text style={styles.optionText}>Editar dirección</Text>
                            <Feather name="edit" size={20} color={Colors.slate900} />
                        </TouchableOpacity>

                        <View style={styles.modalDivider} />

                        <TouchableOpacity 
                            style={[
                                styles.modalOption, 
                                currentAddress?.id === menuAddress?.id && { opacity: 0.6 }
                            ]} 
                            activeOpacity={0.7}
                            onPress={handleDeleteAddress}
                            disabled={deleting || currentAddress?.id === menuAddress?.id}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.optionText, { color: Colors.slate900 }]}>Eliminar</Text>
                                {currentAddress?.id === menuAddress?.id && (
                                    <Text style={styles.disabledText}>No puedes borrar esta dirección mientras esté en uso</Text>
                                )}
                            </View>
                            {deleting ? (
                                <ActivityIndicator size="small" color={Colors.red500} />
                            ) : (
                                <Feather name="trash-2" size={20} color={currentAddress?.id === menuAddress?.id ? Colors.gray400 : Colors.slate700} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAFAFA' }, // Slightly off-white back
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        gap: 12,
    },
    closeBtn: {
        width: 38,
        height: 38,
        backgroundColor: '#FFFFFF',
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    title: { fontSize: 20, fontWeight: '800', color: Colors.slate900, letterSpacing: -0.3 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 120 },
    section: { marginBottom: 38 },
    sectionTitle: { 
        fontSize: 22, 
        fontWeight: '900', 
        color: Colors.slate900, 
        marginBottom: 16,
        letterSpacing: -0.6
    },
    frecuentesRow: { gap: 14, paddingRight: 20 },
    frequentCard: {
        width: 160,
        padding: 18,
        borderRadius: 24,
        backgroundColor: Colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
    },
    frequentIconWrap: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    frequentLabel: { fontSize: 16, fontWeight: '800', color: Colors.slate900, marginBottom: 4 },
    frequentSub: { fontSize: 13, color: Colors.gray400, fontWeight: '500' },
    listContainer: { gap: 14 },
    savedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 24,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 1,
    },
    savedItemActive: {
        borderWidth: 2,
        borderColor: Colors.slate900,
    },
    savedIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    savedTitle: { fontSize: 16, fontWeight: '800', color: Colors.slate900, marginBottom: 3 },
    savedDesc: { fontSize: 14, color: Colors.gray400, fontWeight: '500' },
    dotsBtn: { padding: 6 },
    emptyText: { color: Colors.gray400, textAlign: 'center', padding: 20, fontWeight: '500' },
    bottomBar: { 
        position: 'absolute', 
        bottom: 34, 
        left: 20, 
        right: 20, 
        backgroundColor: 'transparent' 
    },
    addBtn: {
        backgroundColor: '#22c55e', 
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    addBtnText: { color: Colors.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.1 },

    /* Options Context Menu Modal */
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    modalContent: { 
        backgroundColor: Colors.white, 
        borderTopLeftRadius: 28, 
        borderTopRightRadius: 28, 
        paddingHorizontal: 24, 
        paddingTop: 22, 
        paddingBottom: 40 
    },
    modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    modalTitle: { fontSize: 24, fontWeight: '900', color: Colors.slate900, letterSpacing: -0.5 },
    modalCloseBtn: { width: 32, height: 32, backgroundColor: '#F3F4F6', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    modalHeaderAddress: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
    modalHeaderIconWrap: { width: 44, height: 44, backgroundColor: '#F3F4F6', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    modalAddressTitle: { fontSize: 16, fontWeight: '800', color: Colors.slate900, marginBottom: 2 },
    modalAddressDesc: { fontSize: 13, color: Colors.gray400, fontWeight: '500' },
    modalDivider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 4 },
    modalOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18 },
    optionText: { fontSize: 16, fontWeight: '700', color: Colors.slate900 },
    disabledText: { fontSize: 12, color: Colors.gray400, marginTop: 4, fontWeight: '500' }
});
