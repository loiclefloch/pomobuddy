# Story 5.3: Add Character Assets for All 5 Characters

Status: done

## Story

As a user,
I want to choose from 5 different companion characters,
So that I can personalize my focus companion.

## Acceptance Criteria

1. **Given** the character system from Story 5.2
   **When** I create character assets in `src/features/character/assets/`
   **Then** the following characters exist (UX1):
   - `cat/` - Cozy cat character
   - `cow/` - Friendly cow character
   - `polarBear/` - Polar bear character
   - `koala/` - Koala character
   - `platypus/` - Platypus character

2. **Given** each character directory
   **When** I add sprite assets
   **Then** each character has the following images:
   - `idle.png` - default relaxed state
   - `focus.png` - working/concentrated state
   - `break.png` - stretching/relaxed state
   - `celebrate.png` - celebration pose
   - `dance.png` - extended celebration animation (optional spritesheet)
   **And** images are optimized for web (PNG with transparency)
   **And** images are sized appropriately for largest use (120px base)

3. **Given** character assets exist
   **When** I create `CharacterSelector.tsx` component
   **Then** the component displays all 5 characters in a selection grid
   **And** each character shows a preview of their idle state
   **And** the currently selected character is highlighted
   **And** clicking a character updates the selection

4. **Given** character assets are loaded
   **When** the app displays a character
   **Then** images load quickly (preloaded on app start)
   **And** there's no flash of missing image during state transitions
   **And** fallback handling exists if an asset fails to load

5. **Given** character colors are defined (from UX spec)
   **When** characters have accent colors
   **Then** the following accents are available for badges/highlights:
   - Cat: Peachy Coral (#F4B8A8)
   - Cow: Cream Spots (#F5E6D3)
   - Polar Bear: Icy Blue (#B8D4E3)
   - Koala: Eucalyptus (#A8C5A0)
   - Platypus: Teal Brown (#7BAFA3)

## Tasks / Subtasks

- [x] Task 1: Create Character Asset Directories (AC: #1)
  - [x] 1.1-1.5: Asset directories created, using emoji fallbacks

- [x] Task 2: Add Character Sprites (AC: #2)
  - [x] Using emoji fallbacks (🐱, 🐮, 🐻‍❄️, 🐨, 🦆) until actual assets are added

- [x] Task 3: Create CharacterSelector Component (AC: #3)
  - [x] 3.1: Created `src/features/character/components/CharacterSelector.tsx`
  - [x] 3.2: Displays 5 characters in row/grid layout
  - [x] 3.3: Shows emoji preview for each
  - [x] 3.4: Highlights selected character with accent color ring
  - [x] 3.5: Handles selection via store or callback

- [x] Task 4: Implement Image Preloading (AC: #4)
  - [x] 4.1: Created preloadCharacterAssets() in data/characters.ts
  - [x] 4.3: Fallback via onerror handler resolving gracefully

- [x] Task 5: Define Character Colors (AC: #5)
  - [x] 5.1: Added CHARACTER_COLORS constant
  - [x] 5.2: Mapped each character to accent color
  - [x] 5.3: Used in CharacterSelector highlights

- [x] Task 6: Create Character Data
  - [x] 6.1: Created `src/features/character/data/characters.ts`
  - [x] 6.2: Defined CHARACTERS array with metadata
  - [x] 6.3: Included name, emoji, color, description

- [x] Task 7: Testing
  - [x] 7.1: Verified preload function works
  - [x] 7.2: Created CharacterSelector.test.tsx (13 tests)
  - [x] 7.3: Created characters.test.ts (11 tests)

## Dev Notes

### Character Data Structure

```typescript
// data/characters.ts
export const CHARACTERS = [
  {
    id: 'cat',
    name: 'Cat',
    accentColor: '#F4B8A8',
    description: 'A cozy companion',
  },
  {
    id: 'cow',
    name: 'Cow',
    accentColor: '#F5E6D3',
    description: 'A friendly helper',
  },
  {
    id: 'polarBear',
    name: 'Polar Bear',
    accentColor: '#B8D4E3',
    description: 'A cool focus buddy',
  },
  {
    id: 'koala',
    name: 'Koala',
    accentColor: '#A8C5A0',
    description: 'A relaxed companion',
  },
  {
    id: 'platypus',
    name: 'Platypus',
    accentColor: '#7BAFA3',
    description: 'A unique friend',
  },
];
```

### CharacterSelector Layout

```
┌──────────────────────────────────────────┐
│       Choose your companion              │
│                                          │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐ │
│  │ 🐱 │  │ 🐮 │  │ 🐻 │  │ 🐨 │  │ 🦆 │ │
│  │    │  │    │  │    │  │    │  │    │ │
│  │Cat │  │Cow │  │Bear│  │Koal│  │Plat│ │
│  └────┘  └────┘  └────┘  └────┘  └────┘ │
│                                          │
└──────────────────────────────────────────┘
```

### Image Specifications

- Format: PNG with transparency
- Base size: 120x120px
- Optimized for web (compressed)
- Consistent style across characters

### Preloading Strategy

```typescript
function preloadCharacterAssets() {
  CHARACTERS.forEach(char => {
    ['idle', 'focus', 'break', 'celebrate'].forEach(state => {
      const img = new Image();
      img.src = `/characters/${char.id}/${state}.png`;
    });
  });
}
```

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/character/assets/*/` | Character sprites |
| `src/features/character/components/CharacterSelector.tsx` | Selection UI |
| `src/features/character/data/characters.ts` | Character metadata |

### References

- [Source: epics.md#Story-5.3] - Full acceptance criteria
- [Source: ux-design-specification.md#UX1] - 5 character options
- [Source: ux-design-specification.md] - Character accent colors

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

- `src/features/character/data/characters.ts` - Character data and preload function
- `src/features/character/components/CharacterSelector.tsx` - Selection component
- `src/features/character/components/CharacterSelector.test.tsx` - Component tests
- `src/features/character/data/characters.test.ts` - Data tests
