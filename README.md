# 🚀 Speedy Go — App Móvil

Aplicación de entrega de comida a domicilio construida con **React Native + Expo**. Este documento explica cómo configurar el entorno de desarrollo, la estructura del proyecto y cómo colaborar.

---

## 📋 Requisitos previos

Antes de clonar el repo, asegúrate de tener instalado lo siguiente:

| Herramienta | Versión mínima | Descarga |
|---|---|---|
| Node.js | 18.x o superior | https://nodejs.org |
| npm | 9.x o superior | (incluido con Node) |
| Git | cualquiera | https://git-scm.com |
| Expo Go (en tu celular) | última | App Store / Play Store |

> **Opcional:** Para correr en emulador, instala Android Studio (Android) o Xcode (iOS/macOS).

---

## ⚡ Instalación rápida

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPO>
cd my-appxd

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npx expo start
```

Escanea el código QR con la app **Expo Go** en tu celular y ya puedes ver la app en vivo.

---

## 📱 Correr en emulador

```bash
# Android (necesita Android Studio con un AVD configurado)
npx expo run:android

# iOS (solo macOS, necesita Xcode)
npx expo run:ios
```

---

## 🔧 Comandos útiles

```bash
# Iniciar con caché limpia (útil si hay errores raros)
npx expo start --clear

# Verificar errores de TypeScript
npx tsc --noEmit

# Ver la estructura de archivos del proyecto
npx expo install   # instala dependencias nativas faltantes
```

---

## 🗂️ Estructura del proyecto

```
my-appxd/
│
├── app/                          # 📍 Todas las pantallas (expo-router)
│   ├── _layout.tsx               # Layout raíz — configura el Stack navigator
│   ├── index.tsx                 # Pantalla de bienvenida (Welcome Screen)
│   │
│   ├── (auth)/                   # 🔐 Pantallas de autenticación
│   │   ├── login.tsx             # Iniciar sesión
│   │   ├── register.tsx          # Crear cuenta
│   │   └── terms.tsx             # Términos y condiciones
│   │
│   ├── (onboarding)/             # 🗺️ Flujo de inicio
│   │   └── location-permission.tsx  # Permiso de ubicación
│   │
│   ├── (tabs)/                   # 🏠 Navegación principal (Bottom Tabs)
│   │   ├── _layout.tsx           # Configura las 4 pestañas
│   │   ├── home.tsx              # Inicio — restaurantes y categorías
│   │   ├── search.tsx            # Buscar restaurantes
│   │   ├── orders.tsx            # Mis pedidos
│   │   └── profile.tsx           # Perfil de usuario
│   │
│   ├── (order)/                  # 🛒 Flujo de pedido
│   │   ├── restaurant/
│   │   │   └── [id].tsx          # Menú de un restaurante (ruta dinámica)
│   │   ├── product/
│   │   │   └── [id].tsx          # Detalle de un producto (ruta dinámica)
│   │   ├── cart.tsx              # Carrito de compras
│   │   ├── tracking/
│   │   │   └── index.tsx         # Seguimiento del pedido en tiempo real
│   │   └── review.tsx            # Calificar el pedido
│   │
│   └── (user)/                   # 👤 Secciones de cuenta
│       ├── addresses/
│       │   ├── index.tsx         # Mis direcciones guardadas
│       │   └── add.tsx           # Agregar nueva dirección
│       └── incident.tsx          # Reportar un problema
│
├── assets/
│   └── images/                   # Logos e íconos de la app
│       ├── logo.png              # Logo principal
│       ├── icon.png              # Ícono de la app (iOS/Android)
│       ├── splash-icon.png       # Pantalla de splash
│       └── favicon.png           # Favicon web
│
├── constants/
│   ├── colors.ts                 # 🎨 Paleta de colores del tema
│   └── theme.ts                  # Tokens de diseño adicionales
│
├── components/                   # Componentes reutilizables
├── app.json                      # Configuración de Expo (nombre, iconos, splash)
├── tsconfig.json                 # Configuración de TypeScript
└── package.json                  # Dependencias del proyecto
```

---

## 🧭 Cómo funciona la navegación

Este proyecto usa **expo-router**, que genera rutas automáticamente a partir de la estructura de carpetas.

| Carpeta | ¿Afecta la URL? | Propósito |
|---|---|---|
| `(auth)/` | ❌ No | Agrupa pantallas de autenticación |
| `(onboarding)/` | ❌ No | Agrupa el flujo de inicio |
| `(tabs)/` | ❌ No | Navegación por pestañas inferior |
| `(order)/` | ❌ No | Agrupa el flujo de pedido |
| `(user)/` | ❌ No | Agrupa secciones de cuenta |
| `restaurant/[id].tsx` | ✅ Sí → `/restaurant/123` | Ruta dinámica con parámetro `id` |
| `product/[id].tsx` | ✅ Sí → `/product/456` | Ruta dinámica con parámetro `id` |

---

## 🎨 Sistema de colores

Todos los colores están centralizados en `constants/colors.ts`. **No uses colores hardcodeados** en los componentes, siempre importa desde ahí:

```typescript
import { Colors } from '@/constants/colors';

// ✅ Correcto
backgroundColor: Colors.primary

// ❌ Incorrecto
backgroundColor: '#ec6d13'
```

---

## 🛠️ Stack tecnológico

| Tecnología | Uso |
|---|---|
| **React Native** | Framework base para la UI nativa |
| **Expo SDK 52** | Herramientas y APIs del dispositivo |
| **expo-router** | Navegación basada en archivos (similar a Next.js) |
| **expo-linear-gradient** | Gradientes en pantallas |
| **TypeScript** | Tipado estático |
| **react-native-safe-area-context** | Manejo de notch y bordes del dispositivo |

---

## 🔀 Flujo de la aplicación

```
Welcome Screen
    ├── Registrarse → Register → Location Permission → Home (tabs)
    └── Iniciar sesión → Login → Home (tabs)
                                    │
                        ┌───────────┼───────────┐
                      Home        Search     Orders     Profile
                        │                      │
                    Restaurant              Tracking
                        │                      │
                      Product               Review
                        │
                       Cart → Tracking → Review
```

---

## 🤝 Convenciones del equipo

1. **Una pantalla = un archivo** en la carpeta `app/` correspondiente
2. **Estilos siempre con `StyleSheet.create()`** al final de cada archivo, no inline
3. **Colores desde `Colors`**, nunca hardcodeados
4. **Rutas con `router.push('/ruta')`**, nunca manipules el historial directamente
5. **TypeScript estricto** — corre `npx tsc --noEmit` antes de hacer commit

---

## 🐛 Solución de problemas comunes

### Metro no encuentra un módulo tras mover archivos
```bash
npx expo start --clear
```

### Error "Cannot find module '@/constants/colors'"
Verifica que `tsconfig.json` tenga el path alias `@/*` apuntando a `./`:
```json
"paths": { "@/*": ["./*"] }
```

### La app no refleja cambios
Sacude el dispositivo en Expo Go y selecciona **"Reload"**, o presiona `r` en la terminal.
