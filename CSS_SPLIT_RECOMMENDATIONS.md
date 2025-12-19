# CSS File Splitting Recommendations

## Overview
This document provides detailed recommendations on how to split the CSS from `wemeettalk.html` into modular, maintainable files.

---

## File Structure

```
we-meet-talk/
├── styles/
│   ├── base/
│   │   ├── variables.css       (Lines 11-27)
│   │   ├── reset.css           (Lines 28-35)
│   │   └── animations.css      (Lines 45-1605)
│   │
│   ├── layout/
│   │   ├── phone-frame.css     (Lines 37-44)
│   │   ├── screens.css         (Lines 47-53)
│   │   └── spacing.css         (Common margin/padding rules)
│   │
│   ├── components/
│   │   ├── buttons.css         (Lines 118-1474)
│   │   ├── cards.css           (Lines 157-1558)
│   │   ├── inputs.css          (Lines 264-955)
│   │   ├── avatars.css         (Lines 214-1260)
│   │   ├── badges.css          (Lines 92-1134)
│   │   ├── headers.css         (Lines 132-1427)
│   │   ├── labels.css          (Lines 151-1524)
│   │   └── toast.css           (Lines 1571-1591)
│   │
│   ├── navigation/
│   │   ├── tabs.css            (Lines 334-382)
│   │   └── bottom-nav.css      (Lines 1385-1408)
│   │
│   ├── screens/
│   │   ├── landing.css         (Lines 68-116)
│   │   ├── summary.css         (Lines 123-243)
│   │   ├── name-input.css      (Lines 246-316)
│   │   ├── home.css            (Lines 925-1179)
│   │   ├── save.css            (Lines 1402-1465)
│   │   ├── auth.css            (Lines 1476-1515)
│   │   ├── complete.css        (Lines 1518-1571)
│   │   └── profile.css         (Lines 1211-1297)
│   │
│   └── tabs/
│       ├── info.css            (Lines 376-414)
│       ├── vote.css            (Lines 417-514)
│       ├── calendar.css        (Lines 623-787 + 794-940)
│       ├── settle.css          (Lines 517-589)
│       ├── photos.css          (Lines 583-629)
│       ├── chat.css            (Lines 1295-1373)
│       └── profile.css         (Lines 1211-1297)
│
└── wemeettalk.html
```

---

## Detailed File Breakdown

### 1. BASE STYLES (Scope: Foundation)

#### `base/variables.css` (Lines 11-27)
**Purpose**: CSS custom properties for consistent theming
```
:root {
    --primary
    --primary-light
    --bg
    --card
    --text
    --text-secondary
    --text-light
    --border
    --radius
    --shadow
    --success
    --warning
}
```

#### `base/reset.css` (Lines 28-35)
**Purpose**: Base styling for body and default element styles
```
body {
    font-family
    background
    min-height
    display (flex centering)
    padding
}
```

#### `base/animations.css`
**Purpose**: All animation keyframes
```
@keyframes fadeIn (Line 45)
@keyframes pulse (Line 49)
@keyframes float (Line 53)
@keyframes pulse-ring (Line 981)
@keyframes confetti-fall (Line 1596)
```

---

### 2. LAYOUT FILES (Scope: Structure)

#### `layout/phone-frame.css` (Lines 37-44)
**Purpose**: Phone mockup container styling
**Selectors**:
- `.phone-frame` - Main 390x844px frame with rounded corners and shadow

#### `layout/screens.css` (Lines 47-53)
**Purpose**: Screen display and visibility
**Selectors**:
- `.screen` - Base screen styles (flex, hidden)
- `.screen.active` - Show active screen with fade animation

---

### 3. COMPONENT FILES (Scope: Reusable UI Elements)

#### `components/buttons.css`
**Purpose**: All button styles and states
**Line Ranges**:
- Primary: 118-131
- Back: 138-150
- Join: 233-245
- Next: 303-321
- Vote: 481-501
- Departure: 1101-1125
- More/Change: 1069-1076, 1143-1149
- Save/Skip: 1462-1484
- Auth: 1499-1515
- Complete: 1567-1578

**Selectors**: 20+ button variants

#### `components/cards.css`
**Purpose**: All card component styles
**Line Ranges**:
- Meeting: 157-198
- Info/Notice: 376-405
- Vote: 408-430
- Settlement: 551-589
- Event: 843-884
- Upcoming: 898-925
- Today Meeting: 1141-1172
- Gallery: 1188-1209
- Complete: 1558-1566

**Selectors**: 40+ card related

#### `components/inputs.css`
**Purpose**: Form input and text field styles
**Line Ranges**:
- Labels: 264-270
- Text Input: 271-282
- Quick Names: 284-300
- Search: 938-955
- Chat: 1352-1370

**Selectors**: 15+ input styles

#### `components/avatars.css`
**Purpose**: Avatar styling for different contexts
**Line Ranges**:
- Basic: 204-227
- Stack: 204-227
- Settlement: 559-579
- Sync: 641-661
- Profile: 1219-1260
- Member: 1092-1103
- Message: 1305-1317

**Selectors**: 20+ avatar variants

#### `components/badges.css`
**Purpose**: Badge and status indicator styles
**Line Ranges**:
- Tab: 358-369
- Type: 92-100, 177-186
- Sync: 654-669
- Status: 1117-1134
- Settlement: 573-589
- Event: 877-893
- Notice: 396-404

**Selectors**: 25+ badge types

#### `components/headers.css`
**Purpose**: Header and title area styling
**Line Ranges**:
- Main: 314-333
- Summary: 132-151
- Calendar: 623-634
- Gallery: 1174-1191
- Home: 925-937
- Departure: 1053-1068
- Auth: 1482-1498

**Selectors**: 20+ header styles

#### `components/labels.css`
**Purpose**: Text labels and typography styling
**Line Ranges**:
- Detail: 199-212
- Generic: 151, 1059, 1133, 1404-1413
- Vote: 414-424, 453-464
- Status: 1099-1109

**Selectors**: 15+ label types

#### `components/toast.css`
**Purpose**: Toast notification styling
**Lines**: 1571-1591
**Selectors**:
- `.toast` - Hidden notification
- `.toast.show` - Visible notification with animation

---

### 4. NAVIGATION FILES (Scope: UI Navigation)

#### `navigation/tabs.css`
**Purpose**: Tab navigation styling
**Lines**: 334-382
**Selectors**:
- `.tab-nav` - Container
- `.tab-btn` - Individual button (342)
- `.tab-btn.active` - Active state (354)
- `.tab-btn .badge` - Badge (358)
- `.tab-btn.active .badge` - Active badge (369)
- `.tab-content` - Content container (373)
- `.tab-panel` - Individual panel (378)
- `.tab-panel.active` - Active panel (382)

#### `navigation/bottom-nav.css`
**Purpose**: Bottom navigation bar styling
**Lines**: 1385-1408
**Selectors**:
- `.bottom-nav` - Container
- `.nav-item` - Individual item
- `.nav-item.active` - Active state
- `.nav-item svg` - Icon
- `.nav-item span` - Label

---

### 5. SCREEN FILES (Scope: Full-Page Layouts)

#### `screens/landing.css` (Lines 68-116)
**Purpose**: Landing/intro screen
**Size**: ~12 selectors
**Contains**:
- Background gradient
- Icon with animation
- Title and subtitle
- Call-to-action area

#### `screens/summary.css` (Lines 123-243)
**Purpose**: Meeting summary page
**Size**: ~30 selectors
**Contains**:
- Meeting card with cover
- Detail rows with icons
- Avatar stacks
- Join button footer

#### `screens/name-input.css` (Lines 246-316)
**Purpose**: Name input screen
**Size**: ~15 selectors
**Contains**:
- Title and subtitle
- Text input field
- Quick name suggestions
- Next button

#### `screens/home.css` (Lines 925-1179)
**Purpose**: Map and home screen
**Size**: ~60 selectors
**Contains**:
- Search bar
- Map placeholder
- Location markers with animations
- Members status
- Today's meeting info
- Gallery section

#### `screens/save.css` (Lines 1402-1465)
**Purpose**: Save/bookmark screen
**Size**: ~25 selectors
**Contains**:
- Icon display
- Title and subtitle
- Benefits list
- Save/skip buttons

#### `screens/auth.css` (Lines 1476-1515)
**Purpose**: Authentication screen
**Size**: ~20 selectors
**Contains**:
- Auth title and subtitle
- Auth button options
- Icon styling for providers (Kakao, Google, Phone)
- Button text styling

#### `screens/complete.css` (Lines 1518-1571)
**Purpose**: Completion confirmation screen
**Size**: ~15 selectors
**Contains**:
- Success icon
- Congratulation message
- Info cards
- Complete button

#### `screens/profile.css` (Lines 1211-1297)
**Purpose**: My page/profile screen
**Size**: ~20 selectors
**Contains**:
- Profile avatar with edit button
- User name and email
- Menu items
- Menu icons

---

### 6. TAB CONTENT FILES (Scope: Tab-specific content)

#### `tabs/info.css` (Lines 376-414)
**Purpose**: Information tab content
**Size**: ~10 selectors
**Contains**:
- Info card styles
- Notice card with badge
- Notice header and content
- Timestamp

#### `tabs/vote.css` (Lines 417-514)
**Purpose**: Voting tab content
**Size**: ~35 selectors
**Contains**:
- Vote card container
- Vote title and metadata
- Vote options (selectable)
- Radio button styling
- Option titles and counts
- Soft vote (emoji voting)
- AI suggestion tip
- Vote submission button

#### `tabs/calendar.css` (Lines 623-940)
**Purpose**: Calendar and schedule tab
**Size**: ~80 selectors
**Contains**:
- Main calendar:
  - Month/year selector
  - Weekday headers
  - Day cells with states (busy, available, best, selected)
  - Color legend
  - Selected date info
- My Calendar:
  - Month navigation
  - Day cells with event indicators
  - Today highlight
- My Events:
  - Event cards with date
  - Member avatars
  - Event status badges
- Upcoming:
  - D-day counter
  - Event cards

#### `tabs/settle.css` (Lines 517-589)
**Purpose**: Settlement/payment tab
**Size**: ~20 selectors
**Contains**:
- Settlement summary with total
- Progress bar
- Settlement item list
- Person avatar and info
- Payment status badge

#### `tabs/photos.css` (Lines 583-629)
**Purpose**: Photos tab content
**Size**: ~10 selectors
**Contains**:
- Photos header with count
- Grid layout
- Photo item placeholders
- Upload button

#### `tabs/chat.css` (Lines 1295-1373)
**Purpose**: Chat tab content
**Size**: ~20 selectors
**Contains**:
- Messages container
- Message bubbles (sent/received)
- Message avatars
- Message timestamps
- System messages
- Chat input area
- Send button

---

## Recommended Import Order

In your main stylesheet, import in this order:

```css
/* Base styles (foundation) */
@import url('base/variables.css');
@import url('base/reset.css');
@import url('base/animations.css');

/* Layout structures */
@import url('layout/phone-frame.css');
@import url('layout/screens.css');

/* Reusable components */
@import url('components/buttons.css');
@import url('components/cards.css');
@import url('components/inputs.css');
@import url('components/avatars.css');
@import url('components/badges.css');
@import url('components/headers.css');
@import url('components/labels.css');
@import url('components/toast.css');

/* Navigation */
@import url('navigation/tabs.css');
@import url('navigation/bottom-nav.css');

/* Screen-specific styles */
@import url('screens/landing.css');
@import url('screens/summary.css');
@import url('screens/name-input.css');
@import url('screens/home.css');
@import url('screens/save.css');
@import url('screens/auth.css');
@import url('screens/complete.css');
@import url('screens/profile.css');

/* Tab content */
@import url('tabs/info.css');
@import url('tabs/vote.css');
@import url('tabs/calendar.css');
@import url('tabs/settle.css');
@import url('tabs/photos.css');
@import url('tabs/chat.css');
```

---

## Size Estimates

| File | Selectors | Est. Size |
|------|-----------|-----------|
| base/variables.css | 15 | < 1KB |
| base/reset.css | 1 | < 1KB |
| base/animations.css | 5 | 2KB |
| layout/phone-frame.css | 2 | 1KB |
| layout/screens.css | 2 | 1KB |
| components/buttons.css | 20 | 4KB |
| components/cards.css | 40 | 5KB |
| components/inputs.css | 15 | 2KB |
| components/avatars.css | 20 | 3KB |
| components/badges.css | 25 | 3KB |
| components/headers.css | 20 | 3KB |
| components/labels.css | 15 | 2KB |
| components/toast.css | 2 | 1KB |
| navigation/tabs.css | 8 | 2KB |
| navigation/bottom-nav.css | 5 | 1KB |
| screens/landing.css | 12 | 2KB |
| screens/summary.css | 30 | 4KB |
| screens/name-input.css | 15 | 2KB |
| screens/home.css | 60 | 8KB |
| screens/save.css | 25 | 3KB |
| screens/auth.css | 20 | 3KB |
| screens/complete.css | 15 | 2KB |
| screens/profile.css | 20 | 3KB |
| tabs/info.css | 10 | 2KB |
| tabs/vote.css | 35 | 5KB |
| tabs/calendar.css | 80 | 10KB |
| tabs/settle.css | 20 | 3KB |
| tabs/photos.css | 10 | 2KB |
| tabs/chat.css | 20 | 3KB |

**Total**: ~220 selectors, ~95KB split across 30 files

---

## Migration Strategy

1. **Create directory structure** (3 min)
2. **Extract base styles** (5 min)
3. **Extract components** (20 min)
4. **Extract screens** (20 min)
5. **Extract tab content** (15 min)
6. **Create index/import file** (5 min)
7. **Test in HTML** (10 min)
8. **Verify all styles load correctly** (5 min)

**Total estimated time**: ~1.5 hours

---

## Benefits of This Split

### Organization
- Clear separation of concerns
- Easy to locate specific styles
- Logical grouping by purpose

### Maintainability
- Smaller files are easier to edit
- Reduced chance of breaking unrelated styles
- Better for team collaboration

### Performance
- Can lazy-load tab-specific CSS
- Faster to deploy individual changes
- Smaller initial CSS bundle

### Scalability
- Easy to add new screens
- New features get their own files
- Clear conventions for future developers

