import { Colors } from '@/constants/colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAddressStore, AddressItem } from '@/store/addressStore';
import { userService } from '@/Lib/services/userService';
import { auth } from '@/Lib/firebase';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const ADDRESS_TYPES = [
    { icon: 'briefcase', label: 'Oficina', desc: 'Edificios corporativos, etc.' },
    { icon: 'home', label: 'Casa', desc: 'Vivienda individual en calle pública' },
    { icon: 'user', label: 'Residencial', desc: 'Conjunto de casas en área cerrada con seguridad' },
    { icon: 'shield', label: 'Departamento', desc: 'Torres, condominios' },
    { icon: 'heart', label: 'Hotel', desc: 'Recepción del hotel' },
    { icon: 'star', label: 'Otro', desc: 'Hospital, Universidad, Bodega...' },
];

export default function AddAddressScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const editId = params.id as string | undefined;

    // Wizard Step State -> 1: Search, 2: MapForm
    const [step, setStep] = useState(editId ? 2 : 1); 
    const [showTypeModal, setShowTypeModal] = useState(false);
    const [addressType, setAddressType] = useState('Casa');
    
    // Form state
    const [description, setDescription] = useState('');
    const [details, setDetails] = useState('');
    const [label, setLabel] = useState('');
    const [tag, setTag] = useState(''); 
    const [deliveryOption, setDeliveryOption] = useState('door'); 
    const [instructions, setInstructions] = useState('');

    // Step 1 search autocomplete
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<{ name: string; lat: number; lon: number }[]>([]);
    const [suggestionLoading, setSuggestionLoading] = useState(false);

    useEffect(() => {
        if (searchQuery.trim().length < 3) {
            setSuggestions([]);
            return;
        }
        const timer = setTimeout(async () => {
            setSuggestionLoading(true);
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=6&accept-language=es`,
                    { headers: { 'User-Agent': 'SpeedyGoApp/1.0' } }
                );
                const data = await res.json();
                setSuggestions(data.map((item: any) => ({
                    name: item.display_name,
                    lat: parseFloat(item.lat),
                    lon: parseFloat(item.lon),
                })));
            } catch (_) {
                setSuggestions([]);
            } finally {
                setSuggestionLoading(false);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSelectSuggestion = (s: { name: string; lat: number; lon: number }) => {
        setCoords({ latitude: s.lat, longitude: s.lon });
        // Use first two parts (city, region) for description
        const short = s.name.split(',').slice(0, 2).join(',').trim();
        setDescription(short);
        setSuggestions([]);
        setSearchQuery('');
        setStep(2);
    };

    const { addresses, addAddressToStore, updateAddressInStore } = useAddressStore();
    const [locationLoading, setLocationLoading] = useState(false);
    const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

    useEffect(() => {
        if (editId) {
            const existing = addresses.find(a => a.id === editId);
            if (existing) {
                setAddressType(existing.type);
                setDescription(existing.description || '');
                setDetails(existing.details || '');
                setLabel(existing.title || '');
                setTag(existing.tag || '');
                setDeliveryOption(existing.deliveryOption || 'door');
                setInstructions(existing.instructions || '');
            }
        }
    }, [editId, addresses]);

    const handleTypeSelect = (typeLabel: string) => {
        setAddressType(typeLabel);
        setShowTypeModal(false);
    };

    const requestLocation = async () => {
        setLocationLoading(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permiso de ubicación denegado. Habilita el acceso en la configuración del dispositivo.');
                return;
            }
            const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            setCoords({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
            const [place] = await Location.reverseGeocodeAsync({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });
            if (place) {
                const localName = [place.city || place.subregion, place.region, place.country]
                    .filter(Boolean).join(', ');
                setDescription(localName);
            }
            setStep(2);
        } catch (e) {
            console.error(e);
            alert('No se pudo obtener la ubicación. Intenta de nuevo.');
        } finally {
            setLocationLoading(false);
        }
    };

    const [saving, setSaving] = useState(false);

    const handleSaveAddress = async () => {
        const user = auth.currentUser;
        if (!user) {
             alert("Por favor inicia sesión para guardar direcciones");
             return;
        }
        
        setSaving(true);
        const addressData: AddressItem = {
             title: label || tag || addressType, 
             description: description, // Use dynamic state instead of static
             type: addressType,
             details: details,
             tag: tag,
             deliveryOption: deliveryOption,
             instructions: instructions,
        };

        try {
             if (editId) {
                 await userService.updateAddress(user.uid, editId, addressData);
                 updateAddressInStore({ id: editId, ...addressData });
             } else {
                 const id = await userService.addAddress(user.uid, addressData);
                 addAddressToStore({ id, ...addressData });
             }
             router.back(); 
        } catch (e) {
             console.error(e);
             alert("Error al guardar la dirección");
        } finally {
             setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Pantalla B: Búsqueda */}
                {step === 1 && (
                    <>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backBtn}>
                                <Feather name="arrow-left" size={22} color={Colors.slate900} />
                            </TouchableOpacity>
                            <Text style={styles.title}>Agregar nueva dirección</Text>
                        </View>

                        <ScrollView 
                            style={styles.scroll} 
                            contentContainerStyle={styles.scrollContent} 
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.searchWrap}>
                                <Feather name="search" size={20} color={Colors.slate700} style={{ marginRight: 10 }} />
                                <TextInput 
                                    placeholder="Buscar dirección..." 
                                    placeholderTextColor={Colors.gray400} 
                                    style={styles.searchInput}
                                    autoFocus
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    returnKeyType="search"
                                />
                                {searchQuery.length > 0 && (
                                    <TouchableOpacity onPress={() => { setSearchQuery(''); setSuggestions([]); }}>
                                        <Feather name="x" size={18} color={Colors.gray400} />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Suggestions dropdown */}
                            {(suggestions.length > 0 || suggestionLoading) && (
                                <View style={styles.suggestionsBox}>
                                    {suggestionLoading ? (
                                        <View style={styles.suggestionLoading}>
                                            <ActivityIndicator size="small" color={Colors.slate700} />
                                            <Text style={styles.suggestionLoadText}>Buscando...</Text>
                                        </View>
                                    ) : suggestions.map((s, i) => (
                                        <TouchableOpacity 
                                            key={i} 
                                            style={[styles.suggestionItem, i < suggestions.length - 1 && styles.suggestionItemBorder]}
                                            activeOpacity={0.75}
                                            onPress={() => handleSelectSuggestion(s)}
                                        >
                                            <Feather name="map-pin" size={15} color={Colors.slate700} style={{ marginRight: 12, marginTop: 2 }} />
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.suggestionName} numberOfLines={1}>
                                                    {s.name.split(',')[0]}
                                                </Text>
                                                <Text style={styles.suggestionSub} numberOfLines={1}>
                                                    {s.name.split(',').slice(1, 3).join(',').trim()}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            {/* Use current GPS location */}
                            <TouchableOpacity 
                                style={styles.gpsBtn} 
                                activeOpacity={0.84}
                                onPress={requestLocation}
                                disabled={locationLoading}
                            >
                                <View style={styles.gpsIconCircle}>
                                    {locationLoading ? (
                                        <ActivityIndicator size="small" color={Colors.white} />
                                    ) : (
                                        <Feather name="navigation" size={18} color={Colors.white} />
                                    )}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.gpsText}>Mi ubicación actual</Text>
                                    <Text style={styles.gpsSub}>Usar el GPS para detectar dónde estás</Text>
                                </View>
                                {!locationLoading && <Feather name="chevron-right" size={18} color={Colors.gray400} />}
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.mapActionRow} 
                                activeOpacity={0.8}
                                onPress={() => setStep(2)}
                            >
                                <View style={styles.mapIconCircle}>
                                    <Feather name="map-pin" size={18} color={Colors.white} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.mapActionText}>Seleccionar en el mapa</Text>
                                    <Text style={styles.mapActionSub}>Ubica tu entrega con precisión</Text>
                                </View>
                                <Feather name="chevron-right" size={18} color={Colors.gray400} />
                            </TouchableOpacity>

                            <Text style={styles.poweredBy}>Powered by <Text style={{fontWeight: '800', color: '#4285F4'}}>G</Text><Text style={{fontWeight: '800', color: '#EA4335'}}>o</Text><Text style={{fontWeight: '800', color: '#FBBC05'}}>o</Text><Text style={{fontWeight: '800', color: '#4285F4'}}>g</Text><Text style={{fontWeight: '800', color: '#34A853'}}>l</Text><Text style={{fontWeight: '800', color: '#EA4335'}}>e</Text></Text>
                        </ScrollView>
                    </>
                )}

                {/* Pantalla D & E: Formulario */}
                {step === 2 && (
                    <>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => setStep(1)} activeOpacity={0.7} style={styles.backBtn}>
                                <Feather name="arrow-left" size={22} color={Colors.slate900} />
                            </TouchableOpacity>
                            <Text style={styles.title}>Detalles de entrega</Text>
                        </View>

                        <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 110 }}>
                            {/* Real Map */}
                            <View style={styles.mapPreview}>
                                <MapView
                                    style={styles.mapImage}
                                    provider={PROVIDER_GOOGLE}
                                    region={coords ? {
                                        latitude: coords.latitude,
                                        longitude: coords.longitude,
                                        latitudeDelta: 0.008,
                                        longitudeDelta: 0.008,
                                    } : {
                                        latitude: 19.41,
                                        longitude: -98.44,
                                        latitudeDelta: 0.04,
                                        longitudeDelta: 0.04,
                                    }}
                                    showsUserLocation={true}
                                    showsMyLocationButton={false}
                                    scrollEnabled={true}
                                    zoomEnabled={true}
                                    onPress={async (e) => {
                                        const { latitude, longitude } = e.nativeEvent.coordinate;
                                        setCoords({ latitude, longitude });
                                        try {
                                            const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
                                            if (place) {
                                                const localName = [place.city || place.subregion, place.region, place.country]
                                                    .filter(Boolean).join(', ');
                                                setDescription(localName);
                                            }
                                        } catch (_) {}
                                    }}
                                >
                                    {coords && (
                                        <Marker
                                            coordinate={coords}
                                            title={description || 'Mi ubicación'}
                                        />
                                    )}
                                </MapView>
                                <View style={styles.adjustBadge}>
                                    <Text style={styles.adjustText}>Toca el mapa para ajustar el punto 📍</Text>
                                </View>
                            </View>

                            {/* Location row */}
                            <View style={styles.locationRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.locationTitle}>{description || 'Ubicación'}</Text>
                                    <Text style={styles.locationSub}>Ubicación precisada en el mapa</Text>
                                </View>
                                <TouchableOpacity style={styles.changeBtn} activeOpacity={0.7} onPress={() => setStep(1)}>
                                    <Text style={styles.changeBtnText}>Cambiar</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Form */}
                            <View style={styles.form}>
                                <View style={styles.fieldLabelRow}>
                                    <Text style={styles.fieldLabel}>Tipo de dirección</Text>
                                </View>
                                <TouchableOpacity 
                                    style={styles.fieldPicker} 
                                    activeOpacity={0.84}
                                    onPress={() => setShowTypeModal(true)}
                                >
                                    <Text style={styles.pickerText}>{addressType}</Text>
                                    <Feather name="chevron-down" size={20} color={Colors.slate700} />
                                </TouchableOpacity>

                                <View style={styles.fieldLabelRow}>
                                    <Text style={styles.fieldLabel}>Localidad / Lugar</Text>
                                </View>
                                <TextInput 
                                    style={styles.inputField} 
                                    placeholder="Ej. Huamantla, Tlaxcala" 
                                    placeholderTextColor={Colors.gray400}
                                    value={description}
                                    onChangeText={setDescription}
                                />

                                <View style={styles.fieldLabelRow}>
                                    <Text style={styles.fieldLabel}>Detalles adicionales (opcional)</Text>
                                </View>
                                <TextInput 
                                    style={styles.inputField} 
                                    placeholder="Ej. Casa de tejado verde" 
                                    placeholderTextColor={Colors.gray400}
                                    value={details}
                                    onChangeText={setDetails}
                                />

                                <View style={styles.fieldLabelRow}>
                                    <Text style={styles.fieldLabel}>Etiqueta (Opcional)</Text>
                                </View>
                                <TextInput 
                                    style={styles.inputField} 
                                    placeholder="Ej. Mamá, Abuela, Consultorio..." 
                                    placeholderTextColor={Colors.gray400}
                                    value={label}
                                    onChangeText={setLabel}
                                />

                                <View style={styles.chipRow}>
                                    {['Casa', 'Oficina', 'Pareja'].map((c, i) => (
                                        <TouchableOpacity 
                                            key={i} 
                                            style={[styles.chip, tag === c && styles.chipActive]} 
                                            activeOpacity={0.8}
                                            onPress={() => setTag(c)}
                                        >
                                            <Text style={[styles.chipText, tag === c && styles.chipTextActive]}>{c}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Screen E Section */}
                                <View style={styles.formDivider} />
                                <Text style={styles.sectionHeading}>Opciones de entrega</Text>

                                <TouchableOpacity 
                                    style={[styles.deliveryRow, deliveryOption === 'door' && styles.deliveryRowActive]}
                                    activeOpacity={0.84}
                                    onPress={() => setDeliveryOption('door')}
                                >
                                    <View style={styles.deliveryIconBadge}>
                                        <Text style={{ fontSize: 18 }}>🤝</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.deliveryTitle}>Yo recibo el pedido en mi puerta</Text>
                                        <Text style={styles.deliverySub}>Más opciones disponibles</Text>
                                    </View>
                                    <View style={styles.radioOuter}>
                                        {deliveryOption === 'door' && <View style={styles.radioInner} />}
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.fieldLabelRow}>
                                    <Text style={styles.fieldLabel}>Instrucciones para tu Rappi</Text>
                                </View>
                                <TextInput 
                                    style={[styles.inputField, { height: 90, textAlignVertical: 'top', paddingTop: 14 }]} 
                                    placeholder="Ej. Casa con rejas negras junto a la panadería..." 
                                    placeholderTextColor={Colors.gray400}
                                    multiline
                                    value={instructions}
                                    onChangeText={setInstructions}
                                />

                                <TouchableOpacity 
                                    style={[styles.submitBtn, saving && { opacity: 0.7 }]} 
                                    activeOpacity={0.9} 
                                    onPress={handleSaveAddress}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <ActivityIndicator size="small" color={Colors.white} />
                                    ) : (
                                        <Text style={styles.submitText}>Guardar y continuar</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </>
                )}
            </KeyboardAvoidingView>

            {/* Pantalla C: Type Selector Modal */}
            <Modal
                visible={showTypeModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowTypeModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowTypeModal(false)} />
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Tipo de dirección</Text>
                            <TouchableOpacity onPress={() => setShowTypeModal(false)} style={styles.modalCloseBtn}>
                                <Feather name="x" size={18} color={Colors.slate900} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.modalSubtitle}>Ayuda a tu Rappi indicándole el tipo de dirección en donde debe entregar tu pedido:</Text>
                        
                        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                            {ADDRESS_TYPES.map((type, i) => (
                                <TouchableOpacity 
                                    key={i} 
                                    style={styles.modalItem} 
                                    activeOpacity={0.74}
                                    onPress={() => handleTypeSelect(type.label)}
                                >
                                    <View style={styles.modalItemIconWrap}>
                                        <Feather name={type.icon as any} size={20} color={Colors.slate900} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.modalItemTitle}>{type.label}</Text>
                                        <Text style={styles.modalItemDesc}>{type.desc}</Text>
                                    </View>
                                    <Feather name="chevron-right" size={18} color={Colors.gray400} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAFAFA' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, gap: 12 },
    backBtn: { 
        width: 38, 
        height: 38, 
        backgroundColor: Colors.white, 
        borderRadius: 19, 
        alignItems: 'center', 
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
        elevation: 1,
    },
    title: { fontSize: 20, fontWeight: '900', color: Colors.slate900, letterSpacing: -0.4 },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 16 },

    /* Step 1 Search */
    searchWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        height: 54,
        backgroundColor: Colors.white,
        borderRadius: 27,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
        marginBottom: 24,
    },
    searchInput: { flex: 1, fontSize: 15, color: Colors.slate900, fontWeight: '500' },
    gpsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 18,
        backgroundColor: '#F0FDF4',
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: '#22c55e',
        marginBottom: 14,
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 1,
    },
    gpsIconCircle: {
        width: 44,
        height: 44,
        backgroundColor: '#22c55e',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gpsText: { fontSize: 16, fontWeight: '800', color: '#16a34a' },
    gpsSub: { fontSize: 12, color: '#15803d', marginTop: 2, fontWeight: '500' },
    mapActionRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 14, 
        padding: 18, 
        backgroundColor: Colors.white, 
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 1,
    },
    mapIconCircle: { 
        width: 44, 
        height: 44, 
        backgroundColor: Colors.slate900, 
        borderRadius: 16, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    mapActionText: { fontSize: 16, fontWeight: '800', color: Colors.slate900 },
    mapActionSub: { fontSize: 12, color: Colors.gray400, marginTop: 2, fontWeight: '500' },
    poweredBy: { textAlign: 'center', color: Colors.gray400, marginTop: 24, fontSize: 13, fontWeight: '500' },
    suggestionsBox: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        marginBottom: 14,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    suggestionLoading: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        gap: 12,
    },
    suggestionLoadText: { fontSize: 14, color: Colors.slate700, fontWeight: '600' },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 18,
        paddingVertical: 14,
    },
    suggestionItemBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    suggestionName: { fontSize: 15, fontWeight: '800', color: Colors.slate900, marginBottom: 2 },
    suggestionSub: { fontSize: 12, color: Colors.gray400, fontWeight: '500' },

    /* Step 2 Form / Map */
    mapPreview: { height: 260, position: 'relative', width: '100%', overflow: 'hidden' },
    mapImage: { width: '100%', height: '100%' },
    mapPin: { 
        position: 'absolute', 
        top: '40%', 
        left: '46%', 
        width: 48, 
        height: 48, 
        borderRadius: 24, 
        backgroundColor: Colors.slate900, 
        alignItems: 'center', 
        justifyContent: 'center', 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 3 }, 
        shadowOpacity: 0.3, 
        shadowRadius: 4, 
        elevation: 5 
    },
    adjustBadge: { 
        position: 'absolute', 
        bottom: 16, 
        alignSelf: 'center', 
        backgroundColor: Colors.white, 
        paddingHorizontal: 16, 
        paddingVertical: 9, 
        borderRadius: 999, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 1 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 4, 
        elevation: 3 
    },
    adjustText: { fontSize: 12, fontWeight: '800', color: Colors.slate900 },
    locationRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 24, 
        backgroundColor: Colors.white, 
        borderBottomLeftRadius: 32, 
        borderBottomRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 1,
    },
    locationTitle: { fontSize: 18, fontWeight: '900', color: Colors.slate900 },
    locationSub: { fontSize: 14, color: Colors.gray400, marginTop: 2, fontWeight: '500' },
    changeBtn: { backgroundColor: '#F3F4F6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 18 },
    changeBtnText: { fontSize: 13, fontWeight: '800', color: Colors.slate900 },
    form: { paddingHorizontal: 20, gap: 16, paddingTop: 18 },
    fieldLabelRow: { marginTop: 2 },
    fieldLabel: { fontSize: 14, color: Colors.slate700, fontWeight: '600', paddingLeft: 4 },
    fieldPicker: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        borderRadius: 20, 
        paddingHorizontal: 18, 
        height: 56, 
        backgroundColor: Colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    pickerText: { fontSize: 15, color: Colors.slate900, fontWeight: '700' },
    inputField: { 
        borderRadius: 20, 
        paddingHorizontal: 18, 
        height: 56, 
        backgroundColor: Colors.white, 
        fontSize: 15, 
        color: Colors.slate900, 
        fontWeight: '500',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    chipRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
    chip: { 
        paddingHorizontal: 22, 
        paddingVertical: 12, 
        borderRadius: 20, 
        backgroundColor: Colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    chipActive: { 
        backgroundColor: Colors.slate900, 
    },
    chipText: { fontSize: 15, color: Colors.slate700, fontWeight: '700' },
    chipTextActive: { color: Colors.white },
    formDivider: { height: 1, backgroundColor: '#EFEFEF', marginVertical: 14 },
    sectionHeading: { fontSize: 20, fontWeight: '900', color: Colors.slate900, marginBottom: 8, letterSpacing: -0.4 },
    deliveryRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 18, 
        borderRadius: 24, 
        gap: 14, 
        backgroundColor: Colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    deliveryRowActive: { borderColor: Colors.slate900 },
    deliveryIconBadge: { width: 46, height: 46, backgroundColor: '#FFE4D6', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    deliveryTitle: { fontSize: 15, fontWeight: '800', color: Colors.slate900 },
    deliverySub: { fontSize: 13, color: '#10B981', fontWeight: '600', marginTop: 2 },
    radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.slate900, alignItems: 'center', justifyContent: 'center' },
    radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.slate900 },
    submitBtn: { 
        backgroundColor: '#22c55e', 
        height: 60, 
        borderRadius: 30, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginTop: 18,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    submitText: { color: Colors.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.2 },

    /* Modal styles C */
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 24, paddingTop: 22, maxHeight: '80%', paddingBottom: 40 },
    modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
    modalTitle: { fontSize: 24, fontWeight: '900', color: Colors.slate900, letterSpacing: -0.5 },
    modalCloseBtn: { width: 32, height: 32, backgroundColor: '#F3F4F6', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    modalSubtitle: { fontSize: 14, color: Colors.gray500, marginBottom: 20, lineHeight: 20, fontWeight: '500' },
    modalItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    modalItemIconWrap: { width: 44, height: 44, backgroundColor: '#F3F4F6', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    modalItemTitle: { fontSize: 16, fontWeight: '800', color: Colors.slate900, marginBottom: 3 },
    modalItemDesc: { fontSize: 13, color: Colors.gray400, fontWeight: '500' },
});
