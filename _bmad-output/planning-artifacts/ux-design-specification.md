---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - product-brief-test-bmad-2026-01-29.md
  - prd.md
---

# UX Design Specification test-bmad

**Author:** Master
**Date:** 2026-01-29

---

## Executive Summary

### Project Vision

A cozy, developer-focused Pomodoro desktop application that combines serious focus enforcement with delightful minimal aesthetics. The app lives in the system tray (macOS/Linux), providing always-accessible focus sessions while respecting the developer's workflow. Local-first, file-based storage (Obsidian-style) ensures data ownership and offline functionality.

The UX goal: make productivity feel like a warm companion, not a corporate obligation.

### Target Users

**Alex - The Tech Lead**
- Senior developer working remotely with a mix of deep coding, meetings, and async communication
- Struggles with micro-distraction moments that spiral into lost time
- Needs objective proof of deep work hours for personal accountability
- Values tools that respect their time and intelligence
- Success: Weekly review showing 18+ hours of real deep work, guilt-free weekends

**Sam - The Junior Developer**
- 1-2 years experience, building professional discipline
- High distractibility, imposter syndrome triggers procrastination cycles
- Needs visible progress and gamification to build habits
- Responds to achievements and streaks as motivation
- Success: Growing streak counter, unlocked badges, tangible evidence of growth

### Key Design Challenges

1. **Menu Bar Economy**: System tray apps have limited interaction space. Core actions (start/stop session, view progress) must be accessible in 1-2 clicks without overwhelming the tray menu.

2. **Cozy Professional Balance**: The cute aesthetic (cats, bears, warm colors) must appeal to senior developers without feeling childish. Aim for Slack's playful-but-professional tone, not a children's game.

3. **Non-Intrusive Gamification**: Streaks and achievements should motivate without nagging. Celebrate wins subtly; never guilt-trip for missed days.

4. **Graceful Interruption Handling**: Production incidents happen. The UX must handle abandoned sessions without breaking streaks or inducing guilt - life > app.

### Design Opportunities

1. **Emotional Micro-Moments**: Character animations at key moments (session start, completion, milestone) can create genuine delight and differentiate from sterile competitors.

2. **The Proof Moment**: Stats views that show tangible deep work hours create the "aha!" moment for both personas - objective evidence that replaces guilt with pride.

3. **Cozy First Impression**: Onboarding sets the tone. A friendly character introduction immediately signals "this is different" from corporate productivity tools.

4. **Dark Theme Excellence**: Since dark mode is the default, there's opportunity to craft an exceptionally polished dark UI with warm accents that feels premium.

## Core User Experience

### Defining Experience

The core experience is **tray-first**: the menu bar icon IS the primary interface. Users interact with the app through the system tray for all daily actions. The main window exists only for deep dives into statistics and achievements.

**The Core Loop:**
1. Click tray icon → menu appears
2. Click "Start Session" → timer begins immediately (no confirmation)
3. Work for 25 minutes → icon shows active state with countdown
4. Session ends → notification + character celebration
5. Glance at tray menu → see updated session count and streak
6. Repeat

This loop should feel automatic after day one. Zero friction, zero thought required.

### Platform Strategy

| Aspect           | Decision                          | Rationale                               |
| ---------------- | --------------------------------- | --------------------------------------- |
| **Primary Platform** | macOS menu bar, Linux system tray | Developer-focused, where devs work      |
| **Input Method**     | Mouse/keyboard                    | Desktop-native interaction              |
| **Network**          | 100% offline                      | Local-first philosophy, no dependencies |
| **Performance**      | < 200MB memory, < 3s startup      | Runs all day without impact             |
| **Data**             | Local `.md` files                   | User owns data, git-friendly            |

### Effortless Interactions

**Tray Icon States:**
- **Idle**: Default cozy icon (character at rest)
- **Active Session**: Animated/distinct icon with countdown visible in icon or tooltip
- **Break Time**: Distinct break state indicator
- **Milestone**: Brief celebration state on achievements

**Tray Menu - Complete at a Glance:**
- Start/Stop Session (primary, top of menu)
- Current streak: "Day 12"
- Today's sessions: "4 completed"
- Quick stats: "2h 15m focus today"
- Separator
- Open Stats & History
- Open Achievements
- Settings
- Quit

**What Requires ZERO Clicks:**
- See if session is active (icon state)
- See remaining time (icon/tooltip)

**What Requires ONE Click:**
- Start a session
- Stop a session
- See today's progress (tray menu)

**What Requires TWO Clicks:**
- Open detailed stats window
- Open achievements gallery

### Critical Success Moments

1. **First Session Complete**: Character celebrates, session count shows "1". User thinks "that was pleasant."

2. **First Streak Milestone (Day 7)**: Notification with achievement unlocked. User feels accomplishment without being nagged.

3. **Weekly Review Moment**: User opens stats, sees "18 hours of deep work this week." Objective proof replaces vague guilt.

4. **Interruption Recovery**: User stops mid-session for emergency. App records partial session gracefully, streak intact. User thinks "this app gets real life."

5. **Morning Ritual**: App launches, familiar icon appears, one click starts the day. Zero friction = habit formed.

### Experience Principles

1. **Tray-First**: The menu bar is the primary interface. If it requires opening a window, it's not a core action.

2. **One-Click Core Actions**: Start session, stop session, view progress - all achievable in a single click from the tray menu.

3. **Glanceable Status**: Current state (active timer, streak count, sessions today) visible without any interaction beyond looking at the icon or hovering.

4. **Window = Deep Dive Only**: Main window exists for statistics exploration and achievement gallery - never required for daily workflow.

5. **Silent Until Needed**: App stays invisible until session boundaries or milestones. No nagging, no guilt-tripping, no "you haven't started today" popups.

6. **Graceful Reality**: Interrupted sessions are recorded honestly. Streaks survive real life. The app adapts to users, not the other way around.

## Desired Emotional Response

### Primary Emotional Goals

**Core Feeling: "Cozy productivity companion with earned celebrations"**

The app should feel like a warm, supportive presence that helps without hovering. During work: quiet support. At milestones: genuine celebration. The emotional contrast between daily subtlety and milestone explosiveness creates meaningful dopamine hits that feel earned, not cheap.

**Target Emotional States:**
- **Welcomed** - From first launch, users feel this app was made for them
- **Supported** - During focus, the app is present but not intrusive
- **Proud** - Completions and stats create genuine sense of accomplishment  
- **Delighted** - Milestone moments create real joy, not just notifications
- **Understood** - When life interrupts, the app adapts without judgment

### Emotional Journey Mapping

| Stage            | User Feeling            | Design Driver                                                                   |
| ---------------- | ----------------------- | ------------------------------------------------------------------------------- |
| **First Launch**     | Welcomed, charmed       | Character greets by name, warm colors, cozy onboarding                          |
| **Character Select** | Personal ownership      | "This is MY companion" - choosing from Cat, Cow, Polar Bear, Koala, or Platypus |
| **Session Start**    | Calm, ready             | One click, lo-fi ambient fades in, character settles into focus pose            |
| **Mid-Session**      | Quietly supported       | Ambient sounds, character present but not distracting                           |
| **Session Complete** | Gentle satisfaction     | Soft chime, character nod, counter increments                                   |
| **Break Time**       | Permission to rest      | Character stretches, different ambient tone, guilt-free pause                   |
| **Milestone Unlock** | DELIGHT + pride         | Full-screen celebration, character dance, achievement fanfare                   |
| **Stats Review**     | Validated, accomplished | Numbers that feel like trophies, proof of real work                             |
| **Interruption**     | Understood              | Graceful exit, no guilt messaging, streak protected                             |
| **Return Next Day**  | Familiar comfort        | Same companion waiting, streak continues, ritual resumed                        |

### Micro-Emotions

**Emotions to Cultivate:**
- **Confidence** - "I know exactly how this works"
- **Delight** - "That made me smile"
- **Pride** - "Look what I accomplished"
- **Warmth** - "This feels cozy, not corporate"
- **Accomplishment** - "I'm building something (a habit)"
- **Belonging** - "This is my ritual now"

**Emotions to Prevent:**
- **Guilt** - Never "you haven't started today" messaging
- **Pressure** - Never aggressive streak warnings or countdown anxiety
- **Anxiety** - Never uncertain what will happen next
- **Coldness** - Never sterile or impersonal interactions
- **Judgment** - Never make users feel bad for interruptions or missed days

### Design Implications

**Character System → Personal Connection**
- 5 choosable companions: Cat, Cow, Polar Bear, Koala, Platypus
- Each with encouraging, cheerful personality
- Distinct idle, focus, celebration, and break animations
- Character choice persists and creates "my companion" ownership

**Celebration Contrast → Earned Dopamine**
- Daily session completions: Subtle (character nod, soft chime)
- Streak milestones (7, 14, 30 days): BIG full-screen celebrations with character dance
- Achievement unlocks: Full-screen moment with fanfare
- The quiet-to-explosive contrast makes milestones feel genuinely earned

**Sound Design → Ambient Companion**
- Lo-fi ambient audio during focus sessions (toggleable)
- Gentle chimes at session boundaries
- Celebratory sounds for achievements and milestones
- All audio respects system volume and can be fully muted
- Sound reinforces cozy atmosphere without demanding attention

**Graceful Interruption → Trust Building**
- Stop button always available, no confirmation dialogs
- Partial sessions recorded honestly (no guilt)
- Streak logic forgives real life (one session per day maintains streak)
- No "are you sure?" when stopping - trust the user

### Emotional Design Principles

1. **Quiet Daily, Explosive Milestones**: Reserve big celebrations for earned moments. Daily work gets subtle acknowledgment; milestones get the party.

2. **Character as Companion**: The chosen animal isn't decoration - it's an encouraging presence that users develop affection for over time.

3. **Sound Reinforces Mood**: Lo-fi ambient creates focus atmosphere; celebratory sounds mark achievements. Audio is emotional, not functional.

4. **Never Guilt, Always Support**: The app never makes users feel bad. Missed days, stopped sessions, broken streaks - all handled with grace.

5. **Personalization Creates Ownership**: Character choice and customization make users feel "this is MY app" from the first session.

6. **Trust Through Consistency**: Same character, same sounds, same interactions every day. Ritual familiarity builds emotional comfort.

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

| Product             | Core UX Strength                                                  | Key Lesson for test-bmad                                                                |
| ------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Concentration (iOS)** | Rounded, soft UI with calming colors and minimal friction         | Timer UI should feel soft and calming, not urgent. Rounded corners + muted tones = cozy |
| **Obsidian**            | Local-first file-based storage that feels polished and premium    | Prove that `.md` files can feel premium. Complex power, simple surface                    |
| **Lo-fi Girl**          | Ambient companion presence; audio that triggers focus state       | Character as ambient presence (not interactive toy). Lo-fi audio = focus ritual trigger |
| **Tamagotchi**          | Emotional bond through simple daily care loop                     | Users develop real affection for digital companions. Daily ritual = relationship        |
| **Forest**              | Gamification through visual growth metaphor; stakes without guilt | Progress visualization (growing = completing). Motivation without punishment            |

### Transferable UX Patterns

**Visual Patterns:**
- **Rounded Everything**: Corners, buttons, icons, containers - all softened. Sharp edges feel corporate; rounded feels cozy.
- **Soft Color Palette**: Muted, warm tones. No harsh contrasts. Colors that lower heart rate.
- **Generous Spacing**: Breathing room in layouts. Dense = stressful; spacious = calm.

**Interaction Patterns:**
- **Ambient Companion (Lo-fi Girl model)**: Character is present but doesn't demand interaction. Background presence, not foreground distraction.
- **Visual Progress Metaphor (Forest model)**: Sessions accumulate into something visible - not just numbers, but a growing collection or visual representation.
- **Invisible Complexity (Obsidian model)**: Power features exist but stay hidden. Simple by default, powerful when needed.

**Emotional Patterns:**
- **Bond Through Ritual (Tamagotchi model)**: Daily interaction builds affection. The companion "remembers" you, welcomes you back.
- **Calm UI (Concentration model)**: Every design choice should lower tension, not raise it. Soft sounds, gentle transitions, no urgency.
- **Stakes Without Guilt (Forest model)**: Progress feels meaningful, but failure doesn't punish. Streaks encourage, never shame.

### Anti-Patterns to Avoid

| Anti-Pattern                  | Why It Fails                                     | Our Alternative                                             |
| ----------------------------- | ------------------------------------------------ | ----------------------------------------------------------- |
| **Sharp corners, harsh borders**  | Creates visual tension, feels corporate          | Rounded corners everywhere, soft shadows                    |
| **Aggressive countdown displays** | Induces anxiety, defeats focus purpose           | Gentle time display, progress-focused not countdown-focused |
| **Guilt-based gamification**      | "Your streak died!" creates negative association | Graceful streak logic, no death messaging                   |
| **Overly interactive mascots**    | Distracts from focus, becomes annoying           | Ambient companion that responds, doesn't demand             |
| **Exposed file management**       | Technical friction breaks cozy immersion         | Files invisible by default (Obsidian approach)              |
| **Notification spam**             | Erodes trust, users disable notifications        | Minimal notifications, only at session boundaries           |

### Design Inspiration Strategy

**Adopt Directly:**
- Rounded corner language from Concentration
- Ambient companion presence from Lo-fi Girl
- Lo-fi audio as focus state trigger
- Local-first invisible file storage from Obsidian

**Adapt for Our Context:**
- Forest's growth metaphor → adapt to session/streak visualization (not trees, but character progress or collection)
- Tamagotchi's care loop → simplify to daily session ritual (no feeding/cleaning, just working together)
- Concentration's timer UI → adapt for tray menu context (even more minimal)

**Explicitly Avoid:**
- Any guilt or death language around streaks/sessions
- Sharp, corporate visual language
- Demanding or attention-seeking mascot behavior
- Visible file paths or technical storage UI
- Countdown anxiety (prefer progress framing)

**Unique Positioning:**
Combine Lo-fi Girl's ambient calm + Tamagotchi's companion bond + Forest's meaningful progress + Obsidian's invisible power + Concentration's soft visuals = A focus companion that feels like a cozy ritual, not a productivity tool.

## Design System Foundation

### Design System Choice

**Stack:** shadcn/ui + Tailwind CSS + Radix UI primitives on Electron

This combination provides:
- Full visual customization for unique cozy aesthetic
- Accessible, production-ready component primitives
- Utility-first styling for rapid iteration
- Copy-paste ownership (no vendor lock-in)
- Cross-platform desktop support via Electron

### Rationale for Selection

| Requirement           | How This Stack Delivers                                          |
| --------------------- | ---------------------------------------------------------------- |
| **Unique cozy aesthetic** | shadcn has no opinionated styling - full customization freedom   |
| **Rounded, soft UI**      | Tailwind utilities (rounded-2xl, shadow-soft) apply consistently |
| **Solo developer**        | Copy-paste components, no complex abstractions                   |
| **MVP speed**             | Pre-built accessible components, customize only visuals          |
| **Accessibility**         | Radix primitives handle a11y automatically                       |
| **Long-term ownership**   | You own the component code, no dependency on library updates     |

### Implementation Approach

**Phase 1: Foundation Setup**
- Initialize Tailwind with custom theme configuration
- Install shadcn/ui CLI and initialize project
- Define custom color palette (warm, cozy tones)
- Set global border-radius to rounded (2xl default)
- Configure custom shadows (soft, diffused)

**Phase 2: Core Components**
- Adapt shadcn Button → cozy rounded button with hover warmth
- Adapt shadcn DropdownMenu → tray menu styling
- Adapt shadcn Dialog → achievement celebration modals
- Adapt shadcn Progress → session timer display
- Create custom CharacterDisplay component

**Phase 3: Custom Components**
- TrayMenu (native Electron + styled dropdown)
- TimerRing (circular progress with character)
- AchievementCard (celebration modal content)
- StatsChart (weekly/daily visualization)
- CharacterSprite (animated companion states)

### Customization Strategy

**Theme Tokens (Tailwind config):**

| Token Category | Default shadcn     | Cozy Customization                      |
| -------------- | ------------------ | --------------------------------------- |
| **Border Radius**  | rounded-md         | rounded-2xl (16px) as base              |
| **Colors**         | Slate/Zinc grays   | Warm browns, cream, muted orange/coral  |
| **Shadows**        | Sharp drop shadows | Soft, diffused, warm-tinted shadows     |
| **Spacing**        | Compact            | Generous (more padding, breathing room) |
| **Typography**     | System fonts       | Rounded sans-serif (Inter, Nunito)      |
| **Transitions**    | 150ms ease         | 200-300ms ease-out (gentler motion)     |

**Component Customization Pattern:**
1. Copy shadcn component to project
2. Replace color classes with cozy palette tokens
3. Increase border-radius to rounded-2xl
4. Add softer shadows and gentler transitions
5. Test with character sprites and lo-fi aesthetic

**Design Tokens Preview:**
```css
/* Cozy color palette direction */
--cozy-bg: warm cream/off-white (dark: deep brown)
--cozy-surface: soft beige (dark: warm charcoal)
--cozy-accent: muted coral/peach
--cozy-text: warm brown (dark: cream)
--cozy-success: soft sage green
--cozy-border: warm tan with low opacity
```
