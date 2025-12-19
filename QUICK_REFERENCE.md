# Quick CSS Reference Guide

## File Paths and Line Numbers

### BASE STYLES
- **variables.css**: Lines 11-27 (15 CSS variables)
- **reset.css**: Lines 28-35 (body styling)
- **animations.css**: Lines 45+, 981, 1596 (5 keyframe animations)

### LAYOUT
- **phone-frame.css**: Lines 37-44
- **screens.css**: Lines 47-53

### COMPONENTS (All in range 92-1591)
| Component | Line Range | Selector Count |
|-----------|-----------|-----------------|
| Buttons | 118-1515 | 20+ |
| Cards | 157-1558 | 40+ |
| Inputs | 264-1370 | 15+ |
| Avatars | 204-1260 | 20+ |
| Badges | 92-1134 | 25+ |
| Headers | 132-1427 | 20+ |
| Labels | 151-1524 | 15+ |
| Toast | 1571-1591 | 2 |

### NAVIGATION
- **tabs.css**: Lines 334-382 (8 selectors)
- **bottom-nav.css**: Lines 1385-1408 (5 selectors)

### SCREENS
| Screen | Line Range | Selector Count |
|--------|-----------|-----------------|
| Landing | 68-116 | 12 |
| Summary | 123-243 | 30 |
| Name Input | 246-316 | 15 |
| Home/Map | 925-1179 | 60 |
| Save | 1402-1465 | 25 |
| Auth | 1476-1515 | 20 |
| Complete | 1518-1571 | 15 |
| Profile | 1211-1297 | 20 |

### TAB CONTENT
| Tab | Line Range | Selector Count |
|-----|-----------|-----------------|
| Info | 376-414 | 10 |
| Vote | 417-514 | 35 |
| Calendar | 623-940 | 80 |
| Settle | 517-589 | 20 |
| Photos | 583-629 | 10 |
| Chat | 1295-1373 | 20 |

---

## CSS Variables Overview

```css
:root {
    --primary: [primary color]
    --primary-light: [light primary]
    --bg: [background]
    --card: [card background]
    --text: [main text]
    --text-secondary: [secondary text]
    --text-light: [light text]
    --border: [border color]
    --radius: [border radius]
    --shadow: [drop shadow]
    --success: [success color]
    --warning: [warning color]
}
```

---

## Key Class Patterns

### Button Classes
- `.btn-primary` - Main action
- `.btn-join` - Meeting join
- `.btn-next` - Navigation next
- `.btn-vote` - Vote submit
- `.btn-save`, `.btn-skip` - Save flow
- `.btn-complete` - Completion

### State Classes
- `.active` - Active/selected state
- `.selected` - Currently selected
- `.sent` - For messages
- `.done` - Completed status
- `.pending` - Waiting status

### Status Classes
- `.moving` - In transit
- `.preparing` - Getting ready
- `.waiting` - Waiting state
- `.confirmed` - Confirmed
- `.available` - Available option
- `.best` - Best option
- `.busy` - Busy time

### Color Modifier Classes
- `.sun` - Sunday styling
- `.sat` - Saturday styling
- `.kakao` - Kakao button
- `.google` - Google button
- `.phone` - Phone button

---

## Most Important Selectors by Frequency

### Layout Foundation (MUST KEEP TOGETHER)
```css
body
.phone-frame
.screen
.screen.active
```

### Color/Theme System (MUST KEEP TOGETHER)
```css
:root (all variables)
```

### Common Components (GROUPED)
```css
.btn-primary and variants (all buttons)
.card and variants (all cards)
.avatar (all avatar types)
.badge (all badge types)
```

### Animation System (GROUPED)
```css
@keyframes fadeIn
@keyframes pulse
@keyframes float
@keyframes pulse-ring
@keyframes confetti-fall
```

---

## Selector Naming Convention Analysis

### Naming Pattern 1: BEM-like
- `.card` / `.card-title` / `.card-content`
- `.button` / `.button-text`
- `.avatar` / `.avatar-image`

### Naming Pattern 2: Descriptive
- `.meeting-card` - Specific card type
- `.settlement-item` - Item in list
- `.vote-option` - Vote option item

### Naming Pattern 3: State-based
- `.active` - Active state
- `.selected` - Selected state
- `.hover` (used as `.class:hover`)

### Naming Pattern 4: Screen-specific
- `.landing-*` - Landing screen
- `.summary-*` - Summary screen
- `.home-*` - Home screen
- `.mypage-*` - Profile/my page

### Naming Pattern 5: Functional
- `.tab-btn` - Tab button
- `.nav-item` - Navigation item
- `.message-bubble` - Message display

---

## Copy-Paste Line Ranges for Manual Extraction

### Option 1: Using sed in Windows PowerShell
```powershell
# Extract lines 11-27 (variables)
Get-Content wemeettalk.html -TotalCount 27 | Select-Object -Index 10..26

# Extract range 118-131 (buttons)
Get-Content wemeettalk.html | Select-Object -Index 117..130
```

### Option 2: Using sed in Git Bash
```bash
# Extract lines 11-27
sed -n '11,27p' wemeettalk.html > styles/base/variables.css

# Extract lines 118-131
sed -n '118,131p' wemeettalk.html > styles/components/buttons.css
```

### Option 3: Manual in Editor
1. Open wemeettalk.html in VS Code
2. Press Ctrl+G to go to line
3. Select desired range
4. Cut and paste to new file
5. Save with appropriate name

---

## Testing After Split

To verify your CSS split is correct:

```html
<!-- In wemeettalk.html, replace: -->
<style>/* all CSS here */</style>

<!-- With: -->
<link rel="stylesheet" href="styles/base/variables.css">
<link rel="stylesheet" href="styles/base/reset.css">
<link rel="stylesheet" href="styles/base/animations.css">
<!-- ... etc for all files -->
<!-- Or create a main.css that imports all others -->
```

### Checklist
- [ ] All colors render correctly (use CSS variables test)
- [ ] All animations work (floating icon, fade in, pulsing)
- [ ] All buttons are styled (check hover states)
- [ ] All cards display correctly
- [ ] All tabs work and style correctly
- [ ] All screens load with proper styling
- [ ] Responsive design still works
- [ ] No console errors about missing styles

---

## File Interdependencies

**Critical**: These must be imported first (in order):
1. `base/variables.css` - Defines all color variables
2. `base/reset.css` - Applies base styles
3. `base/animations.css` - Defines animations used elsewhere

**Important**: These can be imported in any order after base:
- Component files
- Layout files
- Navigation files

**Optional**: Can be lazy-loaded or imported on demand:
- Screen-specific CSS
- Tab-specific CSS

---

## Common Issues and Solutions

### Issue: Buttons don't have color
**Solution**: Verify `base/variables.css` is imported first

### Issue: Animations don't work
**Solution**: Make sure `base/animations.css` is imported

### Issue: Avatars have wrong size/color
**Solution**: Check `components/avatars.css` and component-specific overrides

### Issue: Tab content doesn't show
**Solution**: Verify `navigation/tabs.css` and specific tab CSS both loaded

### Issue: Hover states missing
**Solution**: All `:hover` states are in the same file as base selector

---

## Statistics Summary

- **Total Lines of CSS**: ~2,560 lines (from line 10 to ~2570)
- **Total Selectors**: ~220
- **Unique Components**: 8 types
- **Unique Screens**: 8 screens
- **Unique Tabs**: 6 tabs
- **Animation Keyframes**: 5
- **CSS Variables**: 15+

---

## Next Steps

1. **Review** - Read `CSS_ORGANIZATION_ANALYSIS.md` for detailed breakdown
2. **Plan** - Check `CSS_SPLIT_RECOMMENDATIONS.md` for file structure
3. **Reference** - Use `CSS_SELECTORS_REFERENCE.csv` to find selectors
4. **Extract** - Split CSS using line ranges provided
5. **Test** - Verify styling loads correctly
6. **Optimize** - Consider lazy-loading for tab content

