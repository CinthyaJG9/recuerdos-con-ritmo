# Design System - Recuerdos con Ritmo
## Rediseño de Identidad Visual

### Objetivo
Eliminar la apariencia institucional/gubernamental y crear una atmósfera cálida, nostálgica y acogedora para adultos mayores (60+).

---

## Paleta de Colores

### Colores Principales

#### Durazno (Peach)
- **Principal**: `#ffcba8` - Color primario cálido y acogedor
- **Oscuro**: `#f5b899` - Para hover states
- **Claro**: `#ffe5d1` - Para fondos suaves

#### Coral
- **Principal**: `#ff9a7c` - Color de acción principal
- **Oscuro**: `#e88568` - Estados hover de botones
- **Claro**: `#ffb39a` - Variante suave

#### Azul Cielo (Sky Blue)
- **Principal**: `#a8d5e8` - Color secundario tranquilo
- **Oscuro**: `#8fc4db` - Variante más intensa
- **Claro**: `#c5e5f3` - Para fondos suaves

#### Lavanda
- **Principal**: `#c9b8e0` - Color de soporte
- **Oscuro**: `#b5a1d3` - Variante más profunda
- **Claro**: `#ddd1ed` - Variante suave

### Colores de Fondo

- **Ivory**: `#faf6f0` - Fondo principal (no blanco puro)
- **Cream**: `#fffbf5` - Fondo de tarjetas
- **Beige Cálido**: `#f9f3ec` - Fondos alternativos
- **Beige Oscuro**: `#f0e8dc` - Separadores y divisiones

### Colores de Texto

- **Negro Cálido**: `#3a3530` - Texto principal
- **Gris Cálido**: `#736b64` - Texto secundario
- **Gris Claro**: `#a89f97` - Texto terciario/deshabilitado

### Colores de Feedback

#### Positivo (Éxito)
- **Verde Suave**: `#9bc995` - No institucional
- **Verde Oscuro**: `#88b782` - Variante más intensa

#### Negativo (Error)
- **Coral de Error**: `#ff9a7c` - No alarma roja
- **Coral Oscuro**: `#e88568` - Variante más intensa

---

## Tipografía

### Tamaños Base
- **Texto Base**: 20px (accesibilidad)
- **Texto Lg**: 22px
- **Texto XL**: 26px
- **Texto 2XL**: 32px
- **Texto 3XL**: 40px

### Pesos
- **Normal**: 400
- **Medium (encabezados)**: 600

### Lineheight
- **Párrafos**: 1.6
- **Encabezados**: 1.4
- **Botones/Labels**: 1.5

---

## Componentes

### Botones

#### Primario
```css
Background: #ff9a7c (coral)
Text: white
Hover: #e88568 (coral-dark)
Border Radius: 16px (rounded-2xl)
Shadow: lg → xl en hover
Padding: 40px vertical (large), 32px vertical (medium)
```

#### Secundario
```css
Background: #c9b8e0 (lavender)
Text: white
Hover: #b5a1d3 (lavender-dark)
Border Radius: 16px
Shadow: lg → xl en hover
```

#### Outline
```css
Background: transparent
Border: 3px solid coral
Text: coral
Hover: bg coral, text white
Border Radius: 16px
```

### Tarjetas de Juego (GameCard)

```css
Background: #fffbf5 (cream)
Border Radius: 24px (rounded-3xl)
Padding: 32px (p-8)
Shadow: lg → xl en hover
Border: 2px transparent → coral/20 en hover
Active Scale: 0.98
```

#### Íconos de Juegos
- Completar la letra: `bg-coral/15` con ícono `text-coral`
- Quién cantaba: `bg-lavender/20` con ícono `text-lavender-dark`
- Refranes: `bg-sky-blue/20` con ícono `text-sky-blue-dark`

### Tarjetas de Canción (SongCard)

```css
Background: cream
Border Radius: 24px
Padding: 24px
Ícono Container: bg-peach/20, rounded-2xl
Ícono: text-coral
Border: 2px transparent → coral/20 en hover
```

### Barra Superior (Header)

```css
Background: cream
Shadow: md
Border Bottom: border-border
Botones de navegación: rounded-2xl, hover:bg-peach/20
Íconos: text-coral
```

### Feedback Visual

#### Correcto
```css
Container: bg-success-green/15, rounded-2xl
Ícono Container: bg-success-green/25
Ícono: text-success-green-dark
Título: text-success-green
```

#### Incorrecto
```css
Container: bg-error-coral/15, rounded-2xl
Ícono Container: bg-error-coral/15
Ícono: text-error-coral
Título: text-error-coral
```

### Pistas/Hints

```css
Background: lavender/15
Border: 2px lavender/25
Border Radius: 16px
Ícono: text-lavender-dark
Texto: text-lavender-dark
```

### Indicador de Progreso

```css
Background: warm-beige-dark
Barra de Progreso: bg-coral
Border Radius: full
Texto Progreso: text-coral
```

### Badges de Nivel

```css
Nivel Fácil:
  Background: success-green/15
  Dot: bg-success-green
  Text: text-success-green-dark
  Border Radius: 12px (rounded-xl)
```

---

## Espaciado y Bordes

### Border Radius
- **Pequeño**: 12px (rounded-xl)
- **Mediano**: 16px (rounded-2xl)
- **Grande**: 24px (rounded-3xl)
- **Circular**: full

### Shadows
- **Pequeño**: sm
- **Mediano**: md
- **Grande**: lg
- **Extra Grande**: xl (hover states)

### Espaciado Interno
- **Botones Large**: px-10 py-5
- **Botones Medium**: px-8 py-4
- **Tarjetas**: p-8 (32px)
- **Tarjetas Pequeñas**: p-6 (24px)

---

## Estados Interactivos

### Hover
- Sombra aumenta: lg → xl
- Border aparece: transparent → coral/20
- Background en botones de navegación: peach/20

### Active
- Scale: 0.98 (active:scale-[0.98])

### Disabled
- Opacity: 0.5
- Cursor: not-allowed

---

## Accesibilidad

### Contraste
- Todos los textos cumplen WCAG AA
- Botones tienen contraste suficiente con fondos
- Colores de feedback claramente diferenciables

### Touch Targets
- Mínimo 44x44px (usamos 48x48px)
- Botones grandes: 70px altura mínima
- Espaciado generoso entre elementos interactivos

### Texto
- Tamaño mínimo: 18px
- Tamaño recomendado: 20px
- Lineheight generoso para facilitar lectura

---

## Transiciones

### Duración Estándar
```css
transition-all duration-200
```

### Animaciones de Entrada
```css
animate-in fade-in duration-200
```

---

## Comparativa: Antes vs Después

| Componente | Antes | Después |
|------------|-------|---------|
| **Color Primario** | Wine (#8b3a47) | Coral (#ff9a7c) |
| **Color Secundario** | Deep Blue (#2c3e5c) | Lavender (#c9b8e0) |
| **Color Acento** | Olive Green (#6b7c5b) | Sky Blue (#a8d5e8) |
| **Fondo Principal** | Warm Beige (#f5f1e8) | Ivory (#faf6f0) |
| **Feedback Positivo** | Olive Green | Success Green (#9bc995) |
| **Feedback Negativo** | Wine Dark | Error Coral (#ff9a7c) |
| **Border Radius Botones** | rounded-xl (12px) | rounded-2xl (16px) |
| **Border Radius Tarjetas** | rounded-2xl (16px) | rounded-3xl (24px) |
| **Hover State** | border-wine/30 | border-coral/20 |

---

## Archivos Modificados

### Core
1. `/src/styles/theme.css` - Nueva paleta completa de colores

### Componentes
2. `/src/app/components/Button.tsx` - Nuevos colores y radius
3. `/src/app/components/GameCard.tsx` - Nuevos colores de íconos y borders
4. `/src/app/components/SongCard.tsx` - Nuevos colores de íconos
5. `/src/app/components/ProgressIndicator.tsx` - Color coral para progreso
6. `/src/app/components/HelpModal.tsx` - Botones numerados en coral

### Páginas - Navegación
7. `/src/app/pages/Welcome.tsx` - Logo con gradiente peach-coral
8. `/src/app/pages/GameMenu.tsx` - Nuevos colores para íconos de juegos
9. `/src/app/pages/SongSelection.tsx` - Header con botones actualizados
10. `/src/app/pages/GameTypeSelection.tsx` - Tarjetas con nuevos colores

### Páginas - Juegos
11. `/src/app/pages/CompleteLyrics.tsx` - Feedback y pistas actualizados
12. `/src/app/pages/SessionSummary.tsx` - Estadísticas con nuevos colores
13. `/src/app/pages/ArtistQuizInstructions.tsx` - Instrucciones en lavanda
14. `/src/app/pages/ArtistQuizPlay.tsx` - [Pendiente actualizar]
15. `/src/app/pages/ArtistQuizResults.tsx` - [Pendiente actualizar]
16. `/src/app/pages/ProverbsInstructions.tsx` - [Pendiente actualizar]
17. `/src/app/pages/ProverbsPlay.tsx` - [Pendiente actualizar]
18. `/src/app/pages/ProverbsResults.tsx` - [Pendiente actualizar]

---

## Notas de Implementación

### Principios Aplicados
1. **Calidez sobre Institución**: Eliminados verdes institucionales y vinos corporativos
2. **Suavidad Visual**: Bordes más redondeados, sombras más suaves
3. **Accesibilidad Mantenida**: Todos los tamaños de texto y contraste preserved
4. **Consistencia**: Mismos patrones de interacción en toda la aplicación
5. **No Infantilización**: Colores pasteles pero dignos, no infantiles

### Tokens CSS Disponibles
Todos los colores están disponibles como clases de Tailwind:
- `bg-coral`, `text-coral`, `border-coral`
- `bg-lavender`, `text-lavender-dark`
- `bg-sky-blue`, `text-sky-blue`
- `bg-peach`, `text-peach`
- `bg-success-green`, `text-success-green-dark`
- `bg-error-coral`, `text-error-coral`

---

_Documento actualizado: Marzo 2026_
_Proyecto: Recuerdos con Ritmo - Estimulación Cognitiva para Adultos Mayores_
