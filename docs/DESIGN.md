# UI/UX Design System Specification (DESIGN.md) — PawPulse

**System Name**: PawPulse Design System & UI Specification  
**Version**: 1.0.0  
**Target Platform**: Web (Desktop, Tablet, Mobile)  
**Author**: Principal Product Designer & UI Systems Specialist  

---

## 1. Visual Direction & Design Principles

PawPulse is designed at the intersection of **clinical precision** and **compassionate pet care**. The interface balances high-density operational telemetry (for doctors and administrators) with clean, inviting clarity (for pet parents).

### Core Principles
1. **Clinical Legibility First**: Crucial clinical data (pet species, triage status, medication dosages) must be readable at a glance under stressful clinical environments.
2. **Harmonious Humanist Palette**: Avoid sterile stark whites and neon colors. Use deeply layered slates, calm oceanic blues, and warm organic accents.
3. **Information Density with Breathability**: Utilize clear 8px geometric grid spacing, generous padding, and subtle dividing borders instead of aggressive drop shadows.
4. **State Transparency**: Every asynchronous operation has distinct loading skeletons, empty state illustrations, and actionable error banners.

---

## 2. Color System & Design Tokens

### 2.1 Primary Brand & Neutral Palette
```css
:root {
  /* Brand Primary: Deep Clinical Indigo */
  --color-primary-50:  #EFF6FF;
  --color-primary-100: #DBEAFE;
  --color-primary-500: #3B82F6;
  --color-primary-600: #2563EB;
  --color-primary-700: #1D4ED8;

  /* Brand Secondary: Healing Teal */
  --color-teal-50:  #F0FDFA;
  --color-teal-500: #14B8A6;
  --color-teal-600: #0D9488;
  --color-teal-700: #0F766E;

  /* Neutrals: Deep Slate Dark Mode & Crisp Lights */
  --bg-app:        #F8FAFC;  /* Neutral cool canvas */
  --bg-surface:    #FFFFFF;  /* Cards, modals, sidebars */
  --bg-subtle:     #F1F5F9;  /* Inset tables, search bars */
  --border-subtle: #E2E8F0;  /* 1px clean separators */
  --border-focus:  #3B82F6;  /* Keyboard focus ring */

  /* Text Hierarchy */
  --text-primary:   #0F172A; /* Slate 900 */
  --text-secondary: #475569; /* Slate 600 */
  --text-muted:     #94A3B8; /* Slate 400 */
  --text-inverse:   #FFFFFF;
}
```

### 2.2 Semantic & Operational Status Colors
* **Booked / Pending**: Amber (`--amber-500: #F59E0B`, Background: `#FEF3C7`)
* **Completed / Active**: Emerald (`--emerald-500: #10B981`, Background: `#D1FAE5`)
* **Cancelled / Critical**: Rose (`--rose-500: #F43F5E`, Background: `#FFE4E6`)
* **No Show**: Violet (`--violet-500: #8B5CF6`, Background: `#EDE9FE`)
* **Referral Transferred**: Sky Blue (`--sky-500: #0EA5E9`, Background: `#E0F2FE`)

---

## 3. Typography System

**Font Family**: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

| Scale Token | Font Size | Line Height | Font Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `display-1` | 32px (2.000rem) | 38px | 800 (Extra Bold) | Executive KPI primary figures |
| `h1` | 24px (1.500rem) | 32px | 700 (Bold) | Main page titles (`Admin Dashboard`) |
| `h2` | 20px (1.250rem) | 28px | 600 (Semi Bold) | Section headers, card titles |
| `h3` | 16px (1.000rem) | 24px | 600 (Semi Bold) | Modal headers, table headers |
| `body-base` | 14px (0.875rem) | 20px | 400 (Regular) | Primary table cells, form labels |
| `body-sm` | 12px (0.750rem) | 16px | 500 (Medium) | Status badges, timestamps, helper text |
| `code` | 13px (0.812rem) | 18px | 500 (Mono) | UUIDs, prescription codes, dosage formulas |

---

## 4. Spacing, Elevation & Component System

### 4.1 Spacing & Grid System
* Base Unit: `8px`
* Spacing Scale: `2px (xs)`, `4px (sm)`, `8px (md)`, `16px (lg)`, `24px (xl)`, `32px (2xl)`, `48px (3xl)`
* Layout Container: Max width `1440px` with fluid responsive padding (`16px` on mobile, `32px` on desktop).

### 4.2 Elevation Tokens
* `elevation-0`: Flat borders `1px solid var(--border-subtle)` (Tables, inputs).
* `elevation-1`: `0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)` (Standard card).
* `elevation-2`: `0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)` (Modals, dropdowns).

---

## 5. Core Reusable UI Components

### 5.1 StatCard (KPI Metric Card)
* **Structure**: Top row contains title and colored icon pill. Middle row showcases large `display-1` metric value. Bottom row displays trend pill (`+14.2% vs last month`) and subtitle.
* **Micro-interaction**: Smooth `translateY(-2px)` with subtle elevation increase on mouse hover.

### 5.2 StatusBadge
* High contrast, pill-shaped (`border-radius: 9999px`) indicator with a 6px solid dot indicator beside the status text (`● Booked`, `● Completed`).

### 5.3 DataTable
* Striped alternating background for dense record reading.
* Sticky headers on vertical scroll.
* Inline search filtering, pagination controls, and row click drawer preview.

### 5.4 Universal Role Switcher (Top Bar)
* Pill selector located prominently in the navigation bar displaying active role (`Admin`, `Coordinator`, `Veterinarian`, `Pet Owner`).
* Clicking any role switches context instantly, allowing administrators and reviewers to evaluate any perspective seamlessly without re-logging in.

---

## 6. Responsive Breakpoints & Adaptability

| Breakpoint | Viewport Width | Layout Transformation |
| :--- | :--- | :--- |
| **Mobile (`sm`)** | `< 640px` | Sidebar collapses to bottom navigation bar or hamburger menu. KPI cards stack 1 per row. Tables convert to card stacks. |
| **Tablet (`md`)** | `641px - 1024px` | Sidebar icons-only rail. KPI cards 2 per row. Multi-column charts wrap vertically. |
| **Desktop (`lg`)** | `> 1024px` | Full persistent sidebar (240px width). 4-column KPI grid. Side-by-side analytics chart widgets. |
| **Ultrawide (`xl`)** | `> 1440px` | Centered layout with maximum readability boundaries. |

---

## 7. Accessibility (A11y) Standards
* **Color Contrast**: All text elements exceed minimum contrast ratios of 4.5:1 against their backgrounds (7:1 for headers).
* **Keyboard Navigation**: Complete focus outline ring (`outline: 2px solid #3B82F6; outline-offset: 2px`) on all interactive inputs, buttons, and row items.
* **Screen Reader Semantics**: Use of semantic HTML tags (`<main>`, `<nav>`, `<header>`, `<article>`, `<table>`, `<dialog>`) with descriptive `aria-label` attributes.
