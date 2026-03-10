# Azkar App - Design Guidelines

## Architecture Decisions

### Authentication
**No authentication required.** This is a single-user utility app for personal dhikr tracking with local state management.

### Navigation
**Stack-Only Navigation**
- Simple two-screen linear flow
- Screen 1 (Home Menu) → Screen 2 (Counter)
- Use React Navigation stack navigator
- No tab bar or drawer needed

---

## Screen Specifications

### Screen 1: Home Menu (أذكار)

**Purpose:** Main menu for selecting different types of dhikr (remembrance)

**Layout:**
- **Background:** Solid color #4CAF50 (Light Green)
- **Header:** No navigation header (full-screen design)
- **Safe Area Insets:** 
  - Top: insets.top + 60px (for title)
  - Bottom: insets.bottom + 40px

**Components:**
1. **Title Section:**
   - Text: "أذكار" (Adhkar)
   - Font size: 48px
   - Font weight: Bold
   - Color: White (#FFFFFF)
   - Text alignment: Center
   - Position: Top of screen, below safe area

2. **Button List (Vertical Column):**
   - Container: Centered vertically and horizontally
   - Spacing between buttons: 16px
   - 6 Buttons with the following Arabic text (in order):
     1. "لا اله الا الله"
     2. "سبحان الله"
     3. "صلاة على نبي"
     4. "استغفار"
     5. "الله اكبر"
     6. "الحمد لله"

**Button Specifications:**
- Background: White (#FFFFFF)
- Text color: #4CAF50 (matching screen background)
- Font size: 20px
- Font weight: 600 (Semi-bold)
- Border radius: 25px (rounded)
- Padding: 16px vertical, 48px horizontal
- Width: 80% of screen width (max 320px)
- Press feedback: Opacity 0.7 on press
- Shadow: None (flat design)

**Interaction:**
- All buttons navigate to Screen 2 (Counter) when pressed
- Each button passes its dhikr text to the counter screen as context

---

### Screen 2: Counter

**Purpose:** Interactive counter for tracking dhikr repetitions

**Layout:**
- **Background:** White (#FFFFFF)
- **Header:** Standard navigation header with back button
  - Title: The selected dhikr text from previous screen
  - Title color: #4CAF50
  - Left button: Back arrow (< icon)
- **Safe Area Insets:**
  - Top: Below navigation header + 20px
  - Bottom: insets.bottom + 100px (for FABs)

**Components:**

1. **Counter Display (Center of screen):**
   - Label text: "You have pushed the button this many times:"
     - Font size: 18px
     - Color: #666666
     - Text alignment: Center
     - Margin bottom: 16px
   
   - Count number:
     - Font size: 72px
     - Font weight: Bold
     - Color: #4CAF50
     - Text alignment: Center
     - Initial value: 0

2. **Floating Action Buttons (Bottom Right):**
   - Container position: Absolute, bottom-right corner
   - Spacing from bottom: insets.bottom + 20px
   - Spacing from right: 20px
   - Vertical spacing between buttons: 16px

   **Plus (+) Button (Top FAB):**
   - Size: 56px × 56px
   - Background: #4CAF50
   - Icon: Plus (+) symbol
   - Icon color: White
   - Icon size: 24px
   - Border radius: 28px (circular)
   - Action: Increment counter by 1
   - Shadow specifications:
     - shadowOffset: {width: 0, height: 2}
     - shadowOpacity: 0.25
     - shadowRadius: 4
     - shadowColor: #000000
   
   **Minus (-) Button (Bottom FAB):**
   - Size: 56px × 56px
   - Background: #F44336 (Red)
   - Icon: Minus (-) symbol
   - Icon color: White
   - Icon size: 24px
   - Border radius: 28px (circular)
   - Action: Decrement counter by 1 (minimum value: 0, cannot go negative)
   - Shadow specifications:
     - shadowOffset: {width: 0, height: 2}
     - shadowOpacity: 0.25
     - shadowRadius: 4
     - shadowColor: #000000

**Interaction:**
- Counter updates instantly when FABs are pressed
- FABs have scale animation feedback (scale to 0.95) on press
- Counter cannot go below 0

---

## Design System

### Color Palette
- **Primary Green:** #4CAF50
- **Background White:** #FFFFFF
- **Text Gray:** #666666
- **Error Red:** #F44336 (for minus button)
- **Shadow Black:** #000000

### Typography
- **Primary Font:** System default (San Francisco for iOS, Roboto for Android)
- **Right-to-Left Support:** Enable RTL text rendering for Arabic content
- **Title (أذكار):** 48px, Bold, White
- **Button Text:** 20px, Semi-bold, #4CAF50
- **Counter Label:** 18px, Regular, #666666
- **Counter Number:** 72px, Bold, #4CAF50
- **Navigation Title:** 18px, Semi-bold, #4CAF50

### Iconography
- Use standard Expo vector icons (@expo/vector-icons)
- Plus icon: "add" from Ionicons
- Minus icon: "remove" from Ionicons
- Back arrow: Default React Navigation back button

### Visual Feedback
- Buttons: Opacity reduction to 0.7 on press
- FABs: Scale animation to 0.95 on press
- No haptic feedback required (optional enhancement)

### Assets
**No custom assets required.** App uses text-based content and standard system icons only.

---

## Accessibility
- Ensure minimum touch target size of 44×44 points for all interactive elements
- Provide clear visual feedback for all button presses
- Support dynamic type scaling for Arabic text
- Maintain adequate color contrast (WCAG AA compliant)