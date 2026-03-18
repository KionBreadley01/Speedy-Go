import React from 'react';
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export type AlertVariant = 'danger' | 'success' | 'warning' | 'info';

export interface CustomAlertAction {
    label: string;
    onPress: () => void;
    primary?: boolean; // If true, rendered as main CTA; if false, as secondary
    loading?: boolean; // Shows spinner on primary button
}

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    variant?: AlertVariant;
    actions: CustomAlertAction[];
    onClose?: () => void;
}

const VARIANT_CONFIG: Record<AlertVariant, { icon: string; iconColor: string; bgColor: string }> = {
    danger:  { icon: 'alert-triangle', iconColor: '#EF4444', bgColor: 'rgba(239,68,68,0.1)' },
    success: { icon: 'check-circle',   iconColor: '#22c55e', bgColor: 'rgba(34,197,94,0.1)' },
    warning: { icon: 'alert-circle',   iconColor: '#F59E0B', bgColor: 'rgba(245,158,11,0.1)' },
    info:    { icon: 'info',           iconColor: '#3B82F6', bgColor: 'rgba(59,130,246,0.1)' },
};

const BTN_VARIANT_COLOR: Record<AlertVariant, string> = {
    danger:  '#EF4444',
    success: '#22c55e',
    warning: '#F59E0B',
    info:    '#3B82F6',
};

export function CustomAlert({
    visible,
    title,
    message,
    variant = 'info',
    actions,
    onClose,
}: CustomAlertProps) {
    const cfg = VARIANT_CONFIG[variant];
    const primaryColor = BTN_VARIANT_COLOR[variant];

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
                <View style={styles.sheet}>
                    {/* Icon */}
                    <View style={[styles.iconWrap, { backgroundColor: cfg.bgColor }]}>
                        <Feather name={cfg.icon as any} size={30} color={cfg.iconColor} />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    {/* Action buttons */}
                    <View style={styles.actionsWrap}>
                        {actions.map((action, i) =>
                            action.primary ? (
                                <TouchableOpacity
                                    key={i}
                                    style={[styles.primaryBtn, { backgroundColor: primaryColor }, action.loading && { opacity: 0.7 }]}
                                    activeOpacity={0.85}
                                    onPress={action.onPress}
                                    disabled={action.loading}
                                >
                                    {action.loading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Text style={styles.primaryText}>{action.label}</Text>
                                    )}
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    key={i}
                                    style={styles.secondaryBtn}
                                    activeOpacity={0.8}
                                    onPress={action.onPress}
                                >
                                    <Text style={styles.secondaryText}>{action.label}</Text>
                                </TouchableOpacity>
                            )
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 28,
        paddingTop: 28,
        paddingBottom: 44,
        alignItems: 'center',
        gap: 12,
    },
    iconWrap: {
        width: 68,
        height: 68,
        borderRadius: 34,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -0.5,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
        fontWeight: '500',
        paddingHorizontal: 8,
    },
    actionsWrap: {
        width: '100%',
        gap: 10,
        marginTop: 8,
    },
    primaryBtn: {
        width: '100%',
        height: 58,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
    },
    primaryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.2,
    },
    secondaryBtn: {
        width: '100%',
        height: 54,
        backgroundColor: '#F1F5F9',
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryText: {
        color: '#0F172A',
        fontSize: 15,
        fontWeight: '700',
    },
});
