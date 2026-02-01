# 🎨 KCD Platform - Color Palettes & Theme Reference

## Theme Overview

### 1. Salesforce Setup Admin Theme
**File**: `SalesforceSystemAdminDashboard.jsx`
**Primary User**: System Admin
**Inspiration**: Salesforce Setup Interface (Light & Professional)

```
┌─────────────────────────────────────────┐
│  SALESFORCE SETUP - SYSTEM ADMIN        │
├─────────────────────────────────────────┤
│ Background:     #F5F5F5  (Light Gray)  │
│ Primary Blue:   #0070D2  (Salesforce)  │
│ Accent:         #2563EB  (Blue-600)    │
│ Text:           #1F2937  (Dark Gray)   │
│ Border:         #E5E7EB  (Light Gray)  │
│ Hover:          #F3F4F6  (Lighter)     │
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ STAT CARDS (Light Gray Background)  ││
│ │ ┌─────────┐ ┌─────────┐            ││
│ │ │  Users  │ │ Services│            ││
│ │ │  1,234  │ │   42    │            ││
│ │ └─────────┘ └─────────┘            ││
│ │ ┌─────────┐ ┌─────────┐            ││
│ │ │ Active  │ │ Pending │            ││
│ │ │  856    │ │   87    │            ││
│ │ └─────────┘ └─────────┘            ││
│ └─────────────────────────────────────┘│
│                                         │
│ [User Management Table - Light Theme]  │
│ [Services Grid - Blue Accents]         │
└─────────────────────────────────────────┘
```

**Use Cases**:
- User management interface
- Service microservices overview
- System performance metrics
- Administrative controls

---

### 2. Salesforce Lightning Admin Theme
**File**: `SalesforceAdminDashboard.jsx`
**Primary User**: Community Admin
**Inspiration**: Salesforce Lightning Experience (Blue Accents)

```
┌─────────────────────────────────────────┐
│ SALESFORCE LIGHTNING - COMMUNITY ADMIN  │
├─────────────────────────────────────────┤
│ Background:     #F0F9FF  (Light Blue)  │
│ Primary:        #2563EB  (Bright Blue) │
│ Accent:         #2563EB  (Blue-600)    │
│ Text:           #111827  (Dark Gray)   │
│ Header Gradient: Blue → Light Blue     │
│ Border:         #DBEAFE  (Blue-100)    │
│                                         │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│ ┃  [GRADIENT HEADER - BLUE]           ┃ │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ METRIC CARDS (Blue-50 Background)   ││
│ │ ┏━ BLUE LEFT BORDER ━┓             ││
│ │ ║ Subscriptions: 45  ║             ││
│ │ ┗━━━━━━━━━━━━━━━━━━━┛             ││
│ │ ┏━ BLUE LEFT BORDER ━┓             ││
│ │ ║ Campaigns: 12      ║             ││
│ │ ┗━━━━━━━━━━━━━━━━━━━┛             ││
│ │ ┏━ BLUE LEFT BORDER ━┓             ││
│ │ ║ Active Users: 567  ║             ││
│ │ ┗━━━━━━━━━━━━━━━━━━━┛             ││
│ │ ┏━ BLUE LEFT BORDER ━┓             ││
│ │ ║ Pending Reviews: 23║             ││
│ │ ┗━━━━━━━━━━━━━━━━━━━┛             ││
│ └─────────────────────────────────────┘│
│                                         │
│ [Subscriptions Table - Blue Theme]     │
│ [Campaigns Grid - Blue Accents]        │
│ [Vetting Section - Blue Theme]        │
└─────────────────────────────────────────┘
```

**Use Cases**:
- Campaign management
- Subscription tracking
- User vetting workflows
- Community administration

---

### 3. Disney+ Moderator Theme
**File**: `DisneyPlusModeratorDashboard.jsx`
**Primary User**: Moderator
**Inspiration**: Disney+ Entertainment Interface (Dark Blue)

```
┌──────────────────────────────────────────────┐
│ DISNEY+ - COMMUNITY MODERATOR (DARK THEME)   │
├──────────────────────────────────────────────┤
│ Background:    #000000  (Pure Black)         │
│ Gradient:      #001F3F → #040514 (Dark)     │
│ Primary Blue:  #113CCF  (Disney Blue)        │
│ Secondary:     #6366F1  (Purple)             │
│ Accent Red:    #EF4444  (Red)                │
│ Accent Pink:   #EC4899  (Pink)               │
│ Text:          #FFFFFF  (White)              │
│ Card BG:       #1F2937  (Dark Gray)          │
│                                               │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓│
│ ┃  GRADIENT HEADER (Blue-900 → Black)      ┃│
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛│
│                                               │
│ ┌──────────────────────────────────────────┐│
│ │ METRIC CARDS (Gradient Backgrounds)      ││
│ │ ┌────────────────┐ ┌────────────────┐   ││
│ │ │▓▓ Blue →Blue   │ │▓▓ Purple→Pink  │   ││
│ │ │Engagement: 87% │ │Highlights: 24  │   ││
│ │ └────────────────┘ └────────────────┘   ││
│ │ ┌────────────────┐ ┌────────────────┐   ││
│ │ │▓▓ Pink→Pink    │ │▓▓ Red→Red      │   ││
│ │ │Opportunities:9 │ │Issues: 5       │   ││
│ │ └────────────────┘ └────────────────┘   ││
│ └──────────────────────────────────────────┘│
│                                               │
│ ╔═════════════════════════════════════════╗ │
│ ║  FEATURED HIGHLIGHTS (5-Column Grid)   ║ │
│ ║  [▶] [▶] [▶] [▶] [▶]                  ║ │
│ ║    WITH SCALE ON HOVER                ║ │
│ ╚═════════════════════════════════════════╝ │
│                                               │
│ [Opportunities Table - Dark Theme]           │
│ [Issues Management - Priority Colors]       │
│ [User Impersonation Tool - Orange CTA]     │
└──────────────────────────────────────────────┘
```

**Use Cases**:
- User engagement analytics
- Highlight/featured content management
- Opportunity tracking
- Issue management and resolution
- User experience review (impersonation)

---

### 4. Netflix User Workspace Theme
**File**: `NetflixUserDashboard.jsx`
**Primary User**: Regular User/Talent
**Inspiration**: Netflix Streaming Platform (Dark)

```
┌───────────────────────────────────────────────┐
│ NETFLIX - USER WORKSPACE (DARK STREAMING)     │
├───────────────────────────────────────────────┤
│ Background:    #000000  (Pure Black)          │
│ Dark Overlay:  #141414  (Netflix Black)       │
│ Primary Red:   #E50914  (Netflix Red)         │
│ Accent:        #E50914  (Red)                 │
│ Text:          #FFFFFF  (White)               │
│ Muted:         #4B5563  (Gray-600)            │
│ Hover:         #333333  (Slightly Lighter)   │
│                                                │
│ ╔═══════════════════════════════════════════╗│
│ ║ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ║│
│ ║ ┃  HERO BANNER (Red-900 Gradient)    ┃ ║│
│ ║ ┃  Welcome Back                      ┃ ║│
│ ║ ┃  [Play Explore] [Info Learn More]  ┃ ║│
│ ║ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ║│
│ ╚═══════════════════════════════════════════╝│
│                                                │
│ [🎯 Home] [❤️ Portfolio] [📺 Subscriptions] │
│ [▔▔▔▔▔]   [          ]   [                ] │
│                                                │
│ ┌───────────────────────────────────────────┐│
│ │ TRENDING OPPORTUNITIES (5-Column Grid)   ││
│ │ [▶] [▶] [▶] [▶] [▶]                    ││
│ │ Scale on hover with play button overlay  ││
│ └───────────────────────────────────────────┘│
│                                                │
│ ┌───────────────────────────────────────────┐│
│ │ RECOMMENDED FOR YOU (6-Column Grid)      ││
│ │ [❤] [❤] [❤] [❤] [❤] [❤]              ││
│ │                                           ││
│ └───────────────────────────────────────────┘│
│                                                │
│ ┌───────────────────────────────────────────┐│
│ │ POPULAR NOW (5-Column with Rankings)     ││
│ │ [1]  [2]  [3]  [4]  [5]                 ││
│ │                                           ││
│ └───────────────────────────────────────────┘│
└───────────────────────────────────────────────┘
```

**Use Cases**:
- Featured opportunities display
- Content recommendations
- Portfolio showcase
- Subscription management
- Career opportunity browsing

---

### 5. Netflix Guest Workspace Theme
**File**: `NetflixGuestDashboard.jsx`
**Primary User**: Guest/Visitor
**Inspiration**: Netflix Guest Account (Limited Access)

```
┌────────────────────────────────────────────────┐
│ NETFLIX GUEST - LIMITED ACCESS (DARK THEME)    │
├────────────────────────────────────────────────┤
│ Same as User Dashboard with Restrictions      │
│                                                 │
│ Background:    #000000  (Pure Black)           │
│ Primary Red:   #E50914  (Netflix Red)          │
│ Lock Overlay:  #4B5563  (Gray-600)             │
│ Lock Icon:     ⏳ Icon with semi-transparency   │
│                                                 │
│ ╔════════════════════════════════════════════╗ │
│ ║ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ║ │
│ ║ ┃ [GUEST ACCESS - LIMITED] (Red Badge) ┃ ║ │
│ ║ ┃ Explore Opportunities                ┃ ║ │
│ ║ ┃ Sign up to unlock full access        ┃ ║ │
│ ║ ┃ [CREATE ACCOUNT NOW]                 ┃ ║ │
│ ║ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ║ │
│ ╚════════════════════════════════════════════╝ │
│                                                 │
│ ⚠️ You're browsing as guest                   │
│                                                 │
│ ┌────────────────────────────────────────────┐ │
│ │ FEATURED (5 Items Unlocked)                │ │
│ │ [✓] [✓] [✓] [✓] [✓]                      │ │
│ └────────────────────────────────────────────┘ │
│                                                 │
│ ┌────────────────────────────────────────────┐ │
│ │ MORE OPPORTUNITIES (10 Items - 5 Locked)   │ │
│ │ [✓] [✓] [✓] [✓] [✓]                      │ │
│ │ [🔒] [🔒] [🔒] [🔒] [🔒]                 │ │
│ │                                            │ │
│ └────────────────────────────────────────────┘ │
│                                                 │
│ ┌────────────────────────────────────────────┐ │
│ │ Ready to Explore Your Potential?           │ │
│ │ [SIGN UP FREE] [LEARN MORE]                │ │
│ │                                            │ │
│ │ ✨ Unlock All Content                      │ │
│ │ 🎯 Apply & Connect                         │ │
│ │ 💼 Build Your Profile                      │ │
│ └────────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

**Use Cases**:
- Guest preview of platform
- Convert to registered user
- Showcase platform benefits
- Limited content preview

---

## 🎨 Color Mapping Guide

### Primary Colors
```
Salesforce Setup:     #0070D2
Salesforce Lightning: #2563EB
Disney+:              #113CCF
Netflix User:         #141414
Netflix Guest:        #141414
```

### Accent Colors
```
Salesforce Setup:     #2563EB (Blue-600)
Salesforce Lightning: #2563EB (Blue-600)
Disney+:              #E50914 (Red) / #EC4899 (Pink)
Netflix User:         #E50914 (Netflix Red)
Netflix Guest:        #E50914 (Netflix Red)
```

### Background Colors
```
Salesforce Setup:     #F5F5F5 (Light Gray)
Salesforce Lightning: #F0F9FF (Light Blue)
Disney+:              #000000 (Pure Black)
Netflix User:         #000000 (Pure Black)
Netflix Guest:        #000000 (Pure Black)
```

### Text Colors
```
Salesforce Setup:     #1F2937 (Dark Gray)
Salesforce Lightning: #111827 (Dark Gray)
Disney+:              #FFFFFF (White)
Netflix User:         #FFFFFF (White)
Netflix Guest:        #FFFFFF (White)
```

---

## 📐 Layout Grid Systems

### Salesforce Themes
- 2-3 column layouts
- Left-aligned content
- Professional spacing
- Clear hierarchy

### Disney+ Theme
- 4-column metric cards
- 5-column featured grid
- Table layouts for data
- Dark overlay cards

### Netflix Themes
- 5-6 column grids
- Sticky navigation
- Hero banner
- Carousel layouts
- Tab navigation

---

## 🎯 Responsive Breakpoints

All themes use Tailwind CSS responsive design:
- Mobile: Base styles
- Tablet: md: prefix (768px)
- Desktop: lg: prefix (1024px)
- Large: xl: prefix (1280px)

Grid columns adapt:
- Single column on mobile
- 2-3 columns on tablet
- 3-6 columns on desktop

---

## ✨ Interactive States

### Hover Effects
- **Salesforce**: Subtle gray background
- **Disney+**: Gradient overlay, scale 1.05
- **Netflix**: Scale 1.1, opacity transitions

### Active States
- **Buttons**: Color change, border highlight
- **Navigation**: Bottom border highlight (red)
- **Cards**: Elevated shadow, scale

### Disabled States
- **Locked Content**: Opacity 0.5, lock icon overlay
- **Inactive Elements**: Gray color (#9CA3AF)

---

## 🎬 Micro-interactions

### Transitions
- All: `transition` with default timing
- Duration: 200-300ms for smooth feel
- Easing: `ease-in-out`

### Animations
- Scale: 1.05 to 1.1 on hover
- Opacity: 0 to 1 for overlays
- Color: Smooth transitions on state change

### Visual Feedback
- Play button appears on content hover
- Like heart appears on portfolio hover
- Lock icon on restricted content
- Loading spinner while fetching data

---

## 🎨 Summary

Each dashboard maintains visual consistency with:
1. **Unique color palette** matching reference platform
2. **Consistent typography** using Tailwind sizes
3. **Responsive grid layouts** adapting to screen size
4. **Interactive feedback** on user actions
5. **Dark/light theme** appropriate to use case
6. **Professional spacing** for visual hierarchy

All colors are implemented using Tailwind CSS utilities for maintainability and consistency.

---

**Last Updated**: January 31, 2026
