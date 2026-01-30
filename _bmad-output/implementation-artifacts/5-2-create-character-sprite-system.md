# Story 5.2: Create Character Sprite System

Status: review

## Story

As a user,
I want to see an animated companion character in the app,
So that I have a cozy presence during my focus sessions.

## Acceptance Criteria

1. **Given** the character feature directory
   **When** I create `CharacterSprite.tsx` in `src/features/character/components/`
   **Then** the component renders a character image/sprite
   **And** the component accepts props: `character`, `state`, `size`
   **And** the component handles animation transitions smoothly

2. **Given** the CharacterSprite component
   **When** I define character states (UX2)
   **Then** the following states are supported:
   - `idle`: relaxed, occasional blink/breathing animation
   - `focus`: working pose, concentrated expression
   - `break`: stretching, relaxed pose
   - `celebrate`: happy dance, celebration animation
   **And** each state has corresponding sprite/animation

3. **Given** character states exist
   **When** I implement state transitions
   **Then** transitions between states are smooth (300ms ease-out)
   **And** the `prefers-reduced-motion` media query is respected (UX14)
   **And** if reduced motion is preferred, static images are shown instead

4. **Given** the CharacterSprite component
   **When** I define size variants
   **Then** the following sizes are available:
   - `sm`: 40px (tray icon area)
   - `md`: 80px (tray menu)
   - `lg`: 120px (main window, celebrations)
   **And** sprites scale appropriately for each size

5. **Given** character selection is needed
   **When** I create `useCharacterStore` in `src/features/character/stores/`
   **Then** the store holds `selectedCharacter` (persisted in settings)
   **And** the store provides `setCharacter(character)` action
   **And** character preference is loaded from settings on startup

## Tasks / Subtasks

- [x] Task 1: Create CharacterSprite Component (AC: #1)
  - [x] 1.1: Create `src/features/character/components/CharacterSprite.tsx`
  - [x] 1.2: Accept character, state, size props
  - [x] 1.3: Render appropriate sprite image
  - [x] 1.4: Handle image loading states

- [x] Task 2: Define Character States (AC: #2)
  - [x] 2.1: Create CharacterState type
  - [x] 2.2: Map states to sprite files
  - [x] 2.3: Define animation behaviors per state

- [x] Task 3: Implement State Transitions (AC: #3)
  - [x] 3.1: Add CSS transitions between states
  - [x] 3.2: 300ms ease-out timing
  - [x] 3.3: Check prefers-reduced-motion
  - [x] 3.4: Fallback to static images

- [x] Task 4: Create Size Variants (AC: #4)
  - [x] 4.1: Define sm (40px), md (80px), lg (120px)
  - [x] 4.2: Scale sprites appropriately
  - [x] 4.3: Maintain aspect ratio

- [x] Task 5: Create useCharacterStore (AC: #5)
  - [x] 5.1: Create `src/features/character/stores/characterStore.ts`
  - [x] 5.2: Store selectedCharacter state
  - [x] 5.3: Load from settings on init
  - [x] 5.4: Save to settings on change

- [x] Task 6: Create useReducedMotion Hook
  - [x] 6.1: Create `src/shared/hooks/useReducedMotion.ts`
  - [x] 6.2: Detect prefers-reduced-motion
  - [x] 6.3: Return boolean for components

- [x] Task 7: Testing
  - [x] 7.1: Test sprite renders for each state
  - [x] 7.2: Test size variants
  - [x] 7.3: Test reduced motion behavior
  - [x] 7.4: Test character switching

## Dev Notes

### Character State System

```typescript
type CharacterState = 'idle' | 'focus' | 'break' | 'celebrate';
type CharacterSize = 'sm' | 'md' | 'lg';
type CharacterType = 'cat' | 'cow' | 'polarBear' | 'koala' | 'platypus';

interface CharacterSpriteProps {
  character: CharacterType;
  state: CharacterState;
  size?: CharacterSize;
}
```

### Sprite File Structure

```
src/features/character/assets/
├── cat/
│   ├── idle.png
│   ├── focus.png
│   ├── break.png
│   └── celebrate.png
├── cow/
├── polarBear/
├── koala/
└── platypus/
```

### Animation Implementation

```tsx
const CharacterSprite: React.FC<CharacterSpriteProps> = ({
  character,
  state,
  size = 'md',
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  const sizeClass = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-30 h-30',
  }[size];
  
  return (
    <div className={cn(
      sizeClass,
      !prefersReducedMotion && 'transition-all duration-300 ease-out'
    )}>
      <img
        src={`/characters/${character}/${state}.png`}
        alt={`${character} ${state}`}
        className="w-full h-full object-contain"
      />
    </div>
  );
};
```

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/character/components/CharacterSprite.tsx` | Sprite component |
| `src/features/character/stores/characterStore.ts` | Character state |
| `src/features/character/types.ts` | Type definitions |
| `src/shared/hooks/useReducedMotion.ts` | Motion preference |

### References

- [Source: epics.md#Story-5.2] - Full acceptance criteria
- [Source: ux-design-specification.md#UX2] - Character states
- [Source: ux-design-specification.md#UX14] - Reduced motion

## Dev Agent Record

### Agent Model Used

Claude (Sisyphus Build Agent)

### Debug Log References

None - implementation was already complete, tests added

### Completion Notes List

- CharacterSprite component implemented with emoji placeholders (real sprites in Story 5-3)
- All 5 character types supported: cat, cow, polarBear, koala, platypus
- All 4 states with visual differences: idle, focus, break, celebrate
- Size variants: sm (40px), md (80px), lg (120px)
- 300ms ease-out transitions with prefers-reduced-motion support
- useCharacterStore with Zustand persists to settings
- useReducedMotion hook detects user preference
- 23 comprehensive tests covering all acceptance criteria

### File List

- src/features/character/components/CharacterSprite.tsx (pre-existing)
- src/features/character/components/CharacterSprite.test.tsx (created - 13 tests)
- src/features/character/stores/characterStore.ts (pre-existing)
- src/features/character/stores/characterStore.test.ts (created - 4 tests)
- src/features/character/types.ts (pre-existing)
- src/shared/hooks/useReducedMotion.ts (pre-existing)
- src/shared/hooks/useReducedMotion.test.ts (created - 6 tests)
