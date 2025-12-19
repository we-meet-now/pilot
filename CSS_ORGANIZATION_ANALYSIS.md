# CSS Organization Analysis - wemeettalk.html

## Overview
This document organizes all CSS selectors from the `wemeettalk.html` file (lines 10-2570) into logical categories for splitting into separate files.

---

## 1. CSS VARIABLES AND RESET (Lines 11-35)

### CSS Variables & Base Styles
- **Line 11** - `:root` - CSS custom properties definition
- **Line 28** - `body` - Body base styles

### Animations
- **Line 45** - `@keyframes fadeIn` - Fade in animation
- **Line 49** - `@keyframes pulse` - Pulse animation effect
- **Line 53** - `@keyframes float` - Float animation effect
- **Line 981** - `@keyframes pulse-ring` - Pulse ring animation (location marker)
- **Line 1596** - `@keyframes confetti-fall` - Confetti falling animation

---

## 2. LAYOUT (Lines 37-44)

### Container & Frame
- **Line 28** - `body` - Main body styling
- **Line 37** - `.phone-frame` - Phone mockup frame container (width: 390px, height: 844px)
- **Line 47** - `.screen` - Screen base styles (flex, hidden by default)
- **Line 53** - `.screen.active` - Active screen display state

---

## 3. COMPONENTS

### 3.1 BUTTONS (Various Lines)

#### Primary Button
- **Line 118** - `.btn-primary` - Main action button (white background)

#### Secondary Buttons
- **Line 138** - `.back-btn` - Back button (square, icon button)
- **Line 150** - `.back-btn svg` - Back button icon styling
- **Line 233** - `.btn-join` - Join meeting button (gradient primary)

#### Input & Navigation Buttons
- **Line 303** - `.btn-next` - Next step button
- **Line 307** - `.btn-next.active` - Active state for next button
- **Line 1069** - `.change-btn` - Change departure button

#### Voting Buttons
- **Line 481** - `.btn-vote` - Vote submission button
- **Line 463** - `.soft-vote-btn` - Soft vote button (emoji-based)
- **Line 474** - `.soft-vote-btn:hover` - Soft vote hover state
- **Line 475** - `.soft-vote-btn.selected` - Soft vote selected state
- **Line 480** - `.soft-vote-btn .emoji` - Emoji styling within soft vote button

#### Status & Action Buttons
- **Line 1110** - `.departure-btn` - Departure status button
- **Line 1118** - `.departure-btn.ready` - Ready state
- **Line 1122** - `.departure-btn.departed` - Departed state
- **Line 1143** - `.view-more-btn` - View more button
- **Line 913** - `.upcoming-btn` - Upcoming meeting button
- **Line 1371** - `.send-btn` - Chat send button
- **Line 1382** - `.send-btn svg` - Send button icon

#### Save/Auth/Complete Buttons
- **Line 1462** - `.btn-save` - Save button
- **Line 1474** - `.btn-skip` - Skip button
- **Line 1499** - `.auth-btn` - Authentication button
- **Line 1500** - `.auth-btn:hover` - Auth button hover
- **Line 1567** - `.btn-complete` - Complete button

#### Tab Buttons
- **Line 342** - `.tab-btn` - Tab navigation button
- **Line 354** - `.tab-btn.active` - Active tab button
- **Line 358** - `.tab-btn .badge` - Badge within tab button
- **Line 369** - `.tab-btn.active .badge` - Badge styling for active tab

### 3.2 CARDS (Various Lines)

#### Meeting Card
- **Line 157** - `.meeting-card` - Main meeting card container
- **Line 163** - `.meeting-cover` - Meeting card cover image area
- **Line 171** - `.meeting-cover::before` - Overlay gradient
- **Line 177** - `.meeting-type-badge` - Meeting type badge
- **Line 187** - `.meeting-title-area` - Title area positioning
- **Line 188** - `.meeting-title` - Meeting title text
- **Line 189** - `.meeting-host` - Host name text
- **Line 190** - `.meeting-details` - Details section

#### Info Cards
- **Line 376** - `.info-card` - Information card component
- **Line 383** - `.notice-card` - Notice/announcement card
- **Line 390** - `.notice-header` - Notice header
- **Line 396** - `.notice-badge` - Notice badge (text, danger, warning, etc)
- **Line 405** - `.notice-content` - Notice content text

#### Vote Card
- **Line 408** - `.vote-card` - Vote card container
- **Line 414** - `.vote-title` - Vote title
- **Line 415** - `.vote-meta` - Vote metadata (deadline, etc)

#### Settlement Cards
- **Line 551** - `.settlement-item` - Settlement/bill item card
- **Line 558** - `.settlement-item:last-child` - Last item (no border)

#### Event Cards
- **Line 843** - `.my-event-card` - My event card
- **Line 855** - `.my-event-card:hover` - Event card hover
- **Line 898** - `.upcoming-card` - Upcoming event card

#### Meeting Info Cards
- **Line 1141** - `.today-meeting-card` - Today's meeting card
- **Line 1558** - `.complete-card` - Complete screen card

### 3.3 INPUTS & FORMS

#### Text Input
- **Line 271** - `.text-input` - Text input field
- **Line 280** - `.text-input:focus` - Input focus state

#### Input Label
- **Line 264** - `.input-label` - Label for input fields

#### Quick Selection
- **Line 284** - `.quick-names` - Quick name selection container
- **Line 289** - `.quick-name` - Quick name option
- **Line 298** - `.quick-name:hover` - Quick name hover state

#### Search Bar
- **Line 938** - `.search-bar` - Search input bar
- **Line 946** - `.search-bar svg` - Search icon
- **Line 947** - `.search-bar input` - Search input field
- **Line 955** - `.search-bar input:focus` - Search input focus

#### Chat Input
- **Line 1352** - `.chat-input` - Chat message input field
- **Line 1361** - `.chat-input:focus` - Chat input focus

### 3.4 TABS & NAVIGATION

#### Tab Navigation
- **Line 334** - `.tab-nav` - Tab navigation container
- **Line 373** - `.tab-content` - Tab content container
- **Line 378** - `.tab-panel` - Individual tab panel
- **Line 382** - `.tab-panel.active` - Active tab panel

#### Bottom Navigation
- **Line 1385** - `.bottom-nav` - Bottom navigation bar
- **Line 1396** - `.nav-item` - Navigation item
- **Line 1406** - `.nav-item.active` - Active nav item
- **Line 1407** - `.nav-item svg` - Nav item icon
- **Line 1408** - `.nav-item span` - Nav item label

### 3.5 HEADERS

#### Main Header
- **Line 314** - `.main-header` - Main app header
- **Line 322** - `.main-header-left` - Left side of header
- **Line 323** - `.main-header-info h2` - Header title
- **Line 324** - `.main-header-info span` - Header subtitle

#### Other Headers
- **Line 123** - `.summary-header` - Meeting summary header
- **Line 625** - `.calendar-header` - Calendar section header
- **Line 634** - `.calendar-title` - Calendar title
- **Line 625** - `.calendar-desc` - Calendar description
- **Line 1183** - `.gallery-section-header` - Gallery section header
- **Line 925** - `.home-header` - Home screen header
- **Line 1053** - `.departure-header` - Departure info header

### 3.6 AVATARS (Various Lines)

#### Avatar Component
- **Line 214** - `.avatar` - Avatar circle (32x32px)
- **Line 227** - `.avatar:first-child` - First avatar (no margin-left)
- **Line 204** - `.avatar-stack` - Avatar stacking container

#### Settlement Avatar
- **Line 559** - `.settlement-avatar` - Settlement/bill person avatar
- **Line 1092** - `.member-avatar` - Member status avatar

#### Profile Avatar
- **Line 1219** - `.profile-avatar` - Profile page avatar
- **Line 1223** - `.avatar-image` - Avatar image wrapper
- **Line 1233** - `.avatar-image svg` - Avatar SVG icon
- **Line 1238** - `.avatar-edit` - Avatar edit button
- **Line 1251** - `.avatar-edit svg` - Edit button icon

#### Sync Avatar
- **Line 641** - `.sync-avatar` - Sync status avatar
- **Line 652** - `.sync-avatar.small` - Small sync avatar

#### Chat Message Avatar
- **Line 1305** - `.message-avatar` - Message sender avatar

### 3.7 BADGES

#### Generic Badge
- **Line 358** - `.tab-btn .badge` - Badge within components
- **Line 369** - `.tab-btn.active .badge` - Active badge styling

#### Status Badges
- **Line 663** - `.sync-badge` - Sync status badge
- **Line 668** - `.sync-badge.done` - Completed sync badge
- **Line 669** - `.sync-badge.pending` - Pending sync badge
- **Line 1117** - `.status-badge` - General status badge
- **Line 1123** - `.status-badge.moving` - Moving status
- **Line 1124** - `.status-badge.preparing` - Preparing status
- **Line 1125** - `.status-badge.waiting` - Waiting status

#### Type Badges
- **Line 92** - `.landing-badge` - Landing page badge
- **Line 177** - `.meeting-type-badge` - Meeting type badge
- **Line 396** - `.notice-badge` - Notice type badge

#### Settlement Status
- **Line 573** - `.settlement-status` - Settlement status indicator
- **Line 579** - `.settlement-status.done` - Completed settlement
- **Line 580** - `.settlement-status.pending` - Pending settlement

#### Event Status
- **Line 877** - `.my-event-status` - Event completion status
- **Line 883** - `.my-event-status.confirmed` - Confirmed event
- **Line 884** - `.my-event-status.pending` - Pending event

### 3.8 LABELS & TEXT

#### Detail Labels
- **Line 210** - `.detail-label` - Small detail label
- **Line 211** - `.detail-value` - Detail value text
- **Line 212** - `.detail-sub` - Subtitle text

#### Generic Text
- **Line 151** - `.header-title` - Header title text
- **Line 1059** - `.departure-label` - Label text
- **Line 1133** - `.today-label` - Today label

#### Specific Text Elements
- **Line 405** - `.notice-time` - Notice timestamp
- **Line 404** - `.notice-content` - Notice content
- **Line 424** - `.vote-title` - Vote title
- **Line 415** - `.vote-meta` - Vote metadata
- **Line 1428** - `.save-title` - Save screen title
- **Line 1421** - `.save-subtitle` - Save screen subtitle
- **Line 1482** - `.auth-title` - Auth screen title
- **Line 1483** - `.auth-subtitle` - Auth screen subtitle
- **Line 1542** - `.complete-title` - Completion title
- **Line 1543** - `.complete-subtitle` - Completion subtitle

### 3.9 TOAST & NOTIFICATIONS

#### Toast
- **Line 1571** - `.toast` - Toast notification (hidden)
- **Line 1585** - `.toast.show` - Visible toast notification

---

## 4. SCREENS (Lines 68-1620)

### Landing Screen
- **Line 68** - `.landing-screen` - Landing/intro screen
- **Line 71** - `.landing-content` - Landing content container
- **Line 79** - `.landing-icon` - Large icon box
- **Line 91** - `.landing-icon svg` - Icon SVG
- **Line 92** - `.landing-badge` - Intro badge text
- **Line 101** - `.landing-title` - Landing title
- **Line 108** - `.landing-subtitle` - Landing subtitle
- **Line 114** - `.landing-action` - Landing action area

### Summary/Meeting Screen
- **Line 132** - `.summary-header` - Summary header
- **Line 152** - `.summary-content` - Scrollable content area
- **Line 228** - `.summary-footer` - Footer with join button

### Name Input Screen
- **Line 246** - `.name-content` - Name input content
- **Line 252** - `.name-title` - Title
- **Line 258** - `.name-subtitle` - Subtitle
- **Line 302** - `.name-footer` - Footer with next button

### Home/Map Screen
- **Line 957** - `.map-container` - Map area
- **Line 963** - `.map-placeholder` - Placeholder map
- **Line 973** - `.my-location-marker` - Current location marker
- **Line 979** - `.marker-pulse` - Pulsing marker animation
- **Line 985** - `.marker-dot` - Marker dot center
- **Line 995** - `.destination-marker` - Destination marker
- **Line 1003** - `.dest-icon` - Destination icon
- **Line 1016** - `.dest-icon::after` - Icon after element
- **Line 1020** - `.dest-label` - Destination label
- **Line 1030** - `.route-line` - Route line between markers
- **Line 1040** - `.home-bottom-sheet` - Bottom sheet (draggable)
- **Line 1046** - `.sheet-handle` - Sheet handle/drag indicator

### Save Screen
- **Line 1402** - `.save-content` - Save screen content
- **Line 1409** - `.save-icon` - Save icon display
- **Line 1428** - `.save-icon svg` - Icon SVG
- **Line 1437** - `.save-benefits` - Benefits list container
- **Line 1452** - `.save-actions` - Action buttons

### Auth Screen
- **Line 1476** - `.auth-content` - Authentication content
- **Line 1489** - `.auth-options` - Authentication options container

### Complete Screen
- **Line 1518** - `.complete-screen` - Completion screen
- **Line 1521** - `.complete-content` - Completion content
- **Line 1530** - `.complete-icon` - Completion icon
- **Line 1541** - `.complete-icon svg` - Icon SVG
- **Line 1549** - `.complete-card` - Info card in completion

---

## 5. TAB CONTENT SECTIONS (Lines 376-1620)

### Info Tab
- **Line 376** - `.info-card` - Info section card
- **Line 383** - `.notice-card` - Notice/announcement
- **Line 390** - `.notice-header` - Notice title area
- **Line 396** - `.notice-badge` - Notice type badge
- **Line 413** - `.notice-time` - Notice timestamp
- **Line 414** - `.notice-content` - Notice content

### Vote Tab
- **Line 408** - `.vote-card` - Vote card
- **Line 414** - `.vote-title` - Vote question
- **Line 415** - `.vote-meta` - Vote deadline/info
- **Line 416** - `.vote-options` - Options container
- **Line 417** - `.vote-option` - Individual option
- **Line 427** - `.vote-option:hover` - Option hover
- **Line 428** - `.vote-option.selected` - Selected option
- **Line 432** - `.vote-radio` - Radio button
- **Line 441** - `.vote-option.selected .vote-radio` - Selected radio
- **Line 445** - `.vote-option.selected .vote-radio::after` - Radio checkmark
- **Line 452** - `.vote-option-content` - Option content
- **Line 453** - `.vote-option-title` - Option title text
- **Line 454** - `.vote-option-sub` - Option subtitle
- **Line 455** - `.vote-count` - Vote count display
- **Line 456** - `.soft-vote` - Soft vote container
- **Line 481** - `.btn-vote` - Vote button
- **Line 493** - `.ai-tip` - AI tip/suggestion box
- **Line 503** - `.ai-tip-icon` - Tip icon
- **Line 512** - `.ai-tip-icon svg` - Icon SVG
- **Line 513** - `.ai-tip-text` - Tip text
- **Line 514** - `.ai-tip-text strong` - Bold text in tip

### Calendar Tab
- **Line 623** - `.calendar-header` - Calendar section header
- **Line 624** - `.calendar-title` - Calendar title
- **Line 625** - `.calendar-desc` - Calendar description
- **Line 627** - `.calendar-sync-status` - Sync status area
- **Line 634** - `.sync-item` - Person sync item
- **Line 641** - `.sync-avatar` - Person's avatar
- **Line 652** - `.sync-avatar.small` - Small avatar variant
- **Line 653** - `.sync-name` - Person's name
- **Line 654** - `.sync-badge` - Sync status badge
- **Line 668** - `.sync-badge.done` - Done sync
- **Line 669** - `.sync-badge.pending` - Pending sync
- **Line 662** - `.calendar-container` - Main calendar
- **Line 669** - `.calendar-month-header` - Month header area
- **Line 675** - `.cal-nav-btn` - Month navigation buttons
- **Line 685** - `.cal-month-title` - Month title
- **Line 687** - `.calendar-weekdays` - Weekday headers
- **Line 693** - `.weekday` - Weekday text
- **Line 700** - `.weekday.sun` - Sunday color
- **Line 701** - `.weekday.sat` - Saturday color
- **Line 703** - `.calendar-days` - Days grid
- **Line 708** - `.cal-day` - Day cell
- **Line 719** - `.cal-day.other` - Other month days
- **Line 720** - `.cal-day.sun` - Sunday
- **Line 721** - `.cal-day.sat` - Saturday
- **Line 722** - `.cal-day.busy` - Busy indicator
- **Line 727** - `.cal-day.available` - Available day
- **Line 732** - `.cal-day.available:hover` - Available hover
- **Line 735** - `.cal-day.available.best` - Best available day
- **Line 740** - `.cal-day.selected` - Selected day
- **Line 746** - `.calendar-legend` - Legend section
- **Line 752** - `.legend-item` - Legend item
- **Line 759** - `.legend-dot` - Legend color dot
- **Line 764** - `.legend-dot.available` - Available color
- **Line 765** - `.legend-dot.best` - Best color
- **Line 766** - `.legend-dot.busy` - Busy color
- **Line 768** - `.calendar-selected-info` - Selected day info
- **Line 776** - `.selected-date` - Selected date display
- **Line 777** - `.selected-status` - Status of selected date
- **Line 778** - `.available-members` - Members available
- **Line 784** - `.waiting-text` - Waiting indicator text

### Settle (Payment) Tab
- **Line 517** - `.settlement-summary` - Total settlement summary
- **Line 524** - `.settlement-amount` - Amount display
- **Line 525** - `.settlement-label` - Amount label
- **Line 526** - `.progress-bar` - Progress bar container
- **Line 533** - `.progress-fill` - Progress fill
- **Line 538** - `.progress-text` - Progress text/percentage
- **Line 545** - `.settlement-list` - Settlement items list
- **Line 551** - `.settlement-item` - Settlement item
- **Line 558** - `.settlement-item:last-child` - Last item style
- **Line 559** - `.settlement-avatar` - Person avatar
- **Line 570** - `.settlement-info` - Person info
- **Line 571** - `.settlement-name` - Person name
- **Line 572** - `.settlement-detail` - Amount/detail
- **Line 573** - `.settlement-status` - Payment status
- **Line 579** - `.settlement-status.done` - Paid status
- **Line 580** - `.settlement-status.pending` - Unpaid status

### Photos Tab
- **Line 583** - `.photos-header` - Photos section header
- **Line 588** - `.photos-title` - Photos title
- **Line 589** - `.photos-count` - Photo count
- **Line 590** - `.photos-grid` - Photo grid layout
- **Line 597** - `.photo-item` - Photo item/placeholder
- **Line 604** - `.photo-item svg` - Photo icon
- **Line 605** - `.upload-btn` - Upload button
- **Line 619** - `.upload-btn:hover` - Upload hover
- **Line 620** - `.upload-btn svg` - Upload icon

### Chat Tab
- **Line 1295** - `.chat-messages` - Messages container
- **Line 1303** - `.message` - Message container
- **Line 1304** - `.message.sent` - Sent message
- **Line 1305** - `.message-avatar` - Sender avatar
- **Line 1317** - `.message-content` - Message content wrapper
- **Line 1318** - `.message.sent .message-content` - Sent message content
- **Line 1319** - `.message-name` - Sender name
- **Line 1320** - `.message-bubble` - Message text bubble
- **Line 1329** - `.message.sent .message-bubble` - Sent bubble styling
- **Line 1335** - `.message-time` - Message timestamp
- **Line 1336** - `.system-message` - System message
- **Line 1345** - `.chat-input-area` - Input area container
- **Line 1352** - `.chat-input` - Message input field
- **Line 1361** - `.chat-input:focus` - Input focus
- **Line 1362** - `.send-btn` - Send button
- **Line 1373** - `.send-btn svg` - Send icon

### My Calendar (Calendar variation for personal use)
- **Line 787** - `.my-cal-month-nav` - Navigation for my calendar
- **Line 794** - `.my-cal-month` - My calendar month title
- **Line 796** - `.my-cal-container` - My calendar container
- **Line 800** - `.my-cal-days` - My calendar days grid
- **Line 805** - `.my-day` - My calendar day cell
- **Line 814** - `.my-day.sun` - Sunday
- **Line 815** - `.my-day.sat` - Saturday
- **Line 816** - `.my-day.other` - Other month days
- **Line 817** - `.my-day.today` - Today highlight
- **Line 822** - `.my-day.has-event::after` - Event indicator
- **Line 831** - `.my-day.today.has-event::after` - Today with event

### My Events Section
- **Line 833** - `.my-events-section` - My events container
- **Line 836** - `.my-events-title` - Section title
- **Line 843** - `.my-event-card` - Event card
- **Line 855** - `.my-event-card:hover` - Card hover
- **Line 857** - `.my-event-date` - Date box
- **Line 868** - `.event-day` - Day number
- **Line 869** - `.event-dow` - Day of week
- **Line 871** - `.my-event-info` - Event info
- **Line 872** - `.my-event-name` - Event name
- **Line 873** - `.my-event-detail` - Event detail
- **Line 874** - `.my-event-members` - Members list
- **Line 875** - `.member-count` - Member count
- **Line 877** - `.my-event-status` - Event status
- **Line 883** - `.my-event-status.confirmed` - Confirmed
- **Line 884** - `.my-event-status.pending` - Pending

### Upcoming Section
- **Line 886** - `.upcoming-section` - Upcoming events
- **Line 889** - `.upcoming-card` - Upcoming event card
- **Line 898** - `.upcoming-dday` - D-day display
- **Line 910** - `.upcoming-info` - Upcoming info
- **Line 911** - `.upcoming-name` - Upcoming name
- **Line 912** - `.upcoming-date` - Upcoming date
- **Line 913** - `.upcoming-btn` - Upcoming action button

### Map Section (Home Screen)
- **Line 1077** - `.members-status` - Members status container
- **Line 1085** - `.member-status-item` - Individual member status
- **Line 1092** - `.member-avatar` - Member avatar
- **Line 1103** - `.member-status-info` - Member info
- **Line 1108** - `.member-name` - Member name
- **Line 1109** - `.member-time` - Time/status text

### Today's Meeting (Home Screen)
- **Line 1127** - `.today-meeting-info` - Today meeting section
- **Line 1133** - `.today-label` - Label
- **Line 1134** - `.view-more-btn` - View more link
- **Line 1141** - `.today-meeting-card` - Meeting card
- **Line 1150** - `.today-meeting-icon` - Meeting icon
- **Line 1160** - `.today-meeting-detail` - Meeting info
- **Line 1161** - `.today-meeting-name` - Meeting name
- **Line 1162** - `.today-meeting-address` - Meeting address
- **Line 1163** - `.today-meeting-time` - Meeting time

### Gallery Section (Home Screen)
- **Line 1170** - `.gallery-section` - Photo gallery section
- **Line 1174** - `.gallery-section-header` - Section header
- **Line 1180** - `.gallery-section-title` - Title
- **Line 1181** - `.gallery-section-date` - Date/meta
- **Line 1182** - `.gallery-section-count` - Photo count
- **Line 1183** - `.gallery-grid` - Grid layout
- **Line 1188** - `.gallery-item` - Gallery photo item
- **Line 1194** - `.gallery-item:hover` - Hover effect
- **Line 1195** - `.gallery-item:first-child` - First item (larger)
- **Line 1200** - `.gallery-item.more-photos` - More photos indicator

### My Page (Profile Tab)
- **Line 1211** - `.mypage-profile` - Profile section
- **Line 1219** - `.profile-avatar` - Avatar container
- **Line 1223** - `.avatar-image` - Avatar image
- **Line 1233** - `.avatar-image svg` - Avatar SVG
- **Line 1238** - `.avatar-edit` - Edit button
- **Line 1251** - `.avatar-edit svg` - Edit icon
- **Line 1256** - `.profile-name` - User name
- **Line 1261** - `.profile-email` - User email
- **Line 1266** - `.mypage-menu` - Menu section
- **Line 1269** - `.menu-item` - Menu item
- **Line 1278** - `.menu-item:hover` - Menu hover
- **Line 1281** - `.menu-item:last-child` - Last menu item
- **Line 1284** - `.menu-label` - Menu label
- **Line 1288** - `.menu-item svg` - Menu icon

---

## Summary Statistics

**Total CSS Selectors: ~200+**

### By Category:
1. **Variables & Reset**: 5 items (includes animations)
2. **Layout**: 4 items
3. **Components**:
   - Buttons: 20+ items
   - Cards: 15+ items
   - Inputs: 8 items
   - Tabs: 4 items
   - Headers: 10 items
   - Avatars: 15+ items
   - Badges: 15+ items
   - Labels: 10+ items
   - Toast: 2 items
   - **Total Components: 100+**
4. **Screens**: 20+ items
5. **Tab Content**: 120+ items

---

## File Structure Recommendation

Based on this analysis, you could organize the CSS into these files:

```
styles/
├── base.css           (Variables, Reset, Animations)
├── layout.css         (Phone frame, Screen layouts)
├── buttons.css        (All button styles)
├── cards.css          (All card components)
├── forms.css          (Inputs, labels, forms)
├── navigation.css     (Tabs, bottom nav, headers)
├── components.css     (Avatars, badges, toast)
├── screens/
│   ├── landing.css    (Landing screen)
│   ├── summary.css    (Meeting summary screen)
│   ├── name-input.css (Name input screen)
│   ├── home.css       (Map/home screen)
│   ├── auth.css       (Auth/save screens)
│   └── complete.css   (Completion screen)
└── tabs/
    ├── info.css       (Info tab content)
    ├── vote.css       (Vote tab content)
    ├── calendar.css   (Calendar & my calendar)
    ├── settle.css     (Settlement/payments)
    ├── photos.css     (Photos tab)
    ├── chat.css       (Chat tab)
    └── profile.css    (My page/profile)
```

This organization makes it easy to:
- Maintain and update specific features
- Reduce CSS file sizes
- Improve loading performance with lazy-loading
- Make code more scalable and maintainable
