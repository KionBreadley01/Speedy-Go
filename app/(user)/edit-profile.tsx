import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    Alert,
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { auth } from '../../Lib/firebase';
import { userService, UserProfile } from '../../Lib/services/userService';

const GENDER_OPTIONS = ['Hombre', 'Mujer', 'Sin definir', '35 tipo de Gey'];

export default function EditProfileScreen() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState<UserProfile>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        const user = auth.currentUser;
        if (!user) {
            router.replace('/login');
            return;
        }

        try {
            const profileData = await userService.getUserProfile(user.uid);
            
            setForm({
                firstName: profileData?.firstName || '',
                lastName: profileData?.lastName || '',
                email: user.email || '',
                phone: profileData?.phone || '',
                dob: profileData?.dob || '',
                gender: profileData?.gender || '',
            });

            if (profileData?.dob) {
                setDate(new Date(profileData.dob));
            }
        } catch (error) {
            Alert.alert("Error", "No se pudo cargar el perfil");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        const user = auth.currentUser;
        if (!user) return;

        setSaving(true);
        try {
            await userService.saveUserProfile(user.uid, form);
            Alert.alert("Éxito", "Perfil actualizado correctamente", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } catch (error) {
            Alert.alert("Error", "No se pudo guardar el perfil");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Eliminar Cuenta",
            "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer y perderás todo tu historial.",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Sí, eliminar", 
                    style: "destructive",
                    onPress: async () => {
                        const user = auth.currentUser;
                        if (!user) return;
                        try {
                            setLoading(true);
                            await userService.deleteUserAccount(user);
                            router.replace('/');
                        } catch (error: any) {
                            Alert.alert("Error", "No se pudo eliminar la cuenta. " + error.message);
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
        
        // Format YYYY-MM-DD
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        
        setForm({ ...form, dob: `${year}-${month}-${day}` });
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Feather name="chevron-left" size={26} color={Colors.slate900} />
                </TouchableOpacity>
                <Text style={styles.title}>Editar Perfil</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Nombre</Text>
                        <TextInput
                            style={styles.input}
                            value={form.firstName}
                            onChangeText={(text) => setForm({...form, firstName: text})}
                            placeholder="Tu nombre"
                            placeholderTextColor={Colors.gray400}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Apellido</Text>
                        <TextInput
                            style={styles.input}
                            value={form.lastName}
                            onChangeText={(text) => setForm({...form, lastName: text})}
                            placeholder="Tu apellido"
                            placeholderTextColor={Colors.gray400}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Correo electrónico</Text>
                        <TextInput
                            style={[styles.input, styles.disabledInput]}
                            value={form.email}
                            editable={false}
                        />
                        <Text style={styles.hintMsg}>El correo no puede ser modificado</Text>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Celular</Text>
                        <TextInput
                            style={styles.input}
                            value={form.phone}
                            onChangeText={(text) => setForm({...form, phone: text})}
                            placeholder="Tu número de celular"
                            keyboardType="phone-pad"
                            placeholderTextColor={Colors.gray400}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Fecha de nacimiento</Text>
                        <TouchableOpacity 
                            style={styles.input} 
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={{ color: form.dob ? Colors.slate900 : Colors.gray400 }}>
                                {form.dob || "Selecciona una fecha"}
                            </Text>
                        </TouchableOpacity>
                        
                        {showDatePicker ? (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                                maximumDate={new Date()}
                            />
                        ) : null}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Género</Text>
                        <View style={styles.genderRow}>
                            {GENDER_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.genderChip, 
                                        form.gender === option && styles.genderChipActive
                                    ]}
                                    onPress={() => setForm({...form, gender: option as any})}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[
                                        styles.genderText,
                                        form.gender === option && styles.genderTextActive
                                    ]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={styles.saveBtn}
                        onPress={handleSave}
                        disabled={saving}
                        activeOpacity={0.8}
                    >
                        {saving ? (
                            <ActivityIndicator color={Colors.white} />
                        ) : (
                            <Text style={styles.saveBtnText}>Guardar cambios</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.dangerZone}>
                        <TouchableOpacity 
                            style={styles.deleteBtn}
                            onPress={handleDeleteAccount}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.deleteBtnText}>Eliminar mi cuenta</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.backgroundLight },
    container: { flex: 1, backgroundColor: Colors.backgroundLight },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: `${Colors.primary}15`,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: { fontSize: 20, color: Colors.slate900 },
    title: { fontSize: 18, fontWeight: '700', color: Colors.slate900 },
    scrollContent: { padding: 20, paddingBottom: 60, gap: 16 },
    
    formGroup: { gap: 6 },
    label: { fontSize: 13, fontWeight: '700', color: Colors.slate500, marginLeft: 4 },
    input: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.gray200,
        borderRadius: 14,
        paddingHorizontal: 16,
        height: 54,
        fontSize: 15,
        color: Colors.slate900,
        justifyContent: 'center'
    },
    disabledInput: { backgroundColor: Colors.gray100, color: Colors.gray400 },
    hintMsg: { fontSize: 12, color: Colors.gray400, marginLeft: 4 },
    
    genderRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    genderChip: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.gray200,
    },
    genderChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    genderText: { fontSize: 14, color: Colors.slate700, fontWeight: '500' },
    genderTextActive: { color: Colors.white, fontWeight: '700' },

    saveBtn: {
        backgroundColor: Colors.primary,
        borderRadius: 999,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 7,
    },
    saveBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
    
    dangerZone: {
        marginTop: 40,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: Colors.gray200,
        alignItems: 'center'
    },
    deleteBtn: { paddingVertical: 12, paddingHorizontal: 24 },
    deleteBtnText: { color: Colors.slate900 || 'red', fontSize: 15, fontWeight: '600' }
});
