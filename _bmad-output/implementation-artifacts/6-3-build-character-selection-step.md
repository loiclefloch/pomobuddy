# Story 6.3: Build Character Selection Step

Status: ready-for-dev

## Story

As a new user,
I want to choose my companion character during setup,
So that I feel personal ownership of my focus companion.

## Acceptance Criteria

1. **Given** the onboarding flow
   **When** I create `CharacterSelectionStep.tsx`
   **Then** the component displays all 5 characters in a selection grid
   **And** each character is shown with their idle animation
   **And** character names are displayed below each option

2. **Given** the character selection grid
   **When** displayed to the user (UX12)
   **Then** the screen shows:
   - Heading: "Choose your companion"
   - Subheading: "They'll be with you on your focus journey"
   - 5 character cards in a responsive grid (2-3 columns)
   - "Continue" button (disabled until selection made)

3. **Given** a character card
   **When** I implement the card design
   **Then** each card shows:
   - Character sprite in idle pose (80px)
   - Character name (e.g., "Cat", "Koala")
   - Subtle border in character's accent color on hover
   **And** cards have `rounded-xl` corners
   **And** cards have hover lift effect

4. **Given** the user clicks a character
   **When** a character is selected
   **Then** the selected card shows a visible selection indicator (border, checkmark, or glow)
   **And** the selection is stored in component state
   **And** the "Continue" button becomes enabled

5. **Given** the user clicks "Continue"
   **When** a character is selected
   **Then** the character preference is saved to settings (`character: "koala"`)
   **And** the flow proceeds to the tutorial step (Story 6.4)
   **And** the selected character appears in subsequent steps

6. **Given** no character is selected
   **When** the user tries to proceed
   **Then** the "Continue" button remains disabled
   **And** a subtle hint encourages selection

## Tasks / Subtasks

- [ ] Task 1: Create CharacterSelectionStep Component (AC: #1, #2)
  - [ ] 1.1: Create `CharacterSelectionStep.tsx`
  - [ ] 1.2: Add heading and subheading
  - [ ] 1.3: Display 5 character cards in grid
  - [ ] 1.4: Add Continue button

- [ ] Task 2: Create Character Card Component (AC: #3)
  - [ ] 2.1: Create reusable CharacterCard component
  - [ ] 2.2: Display character sprite (80px)
  - [ ] 2.3: Display character name
  - [ ] 2.4: Apply hover effects

- [ ] Task 3: Implement Selection Logic (AC: #4)
  - [ ] 3.1: Track selected character in state
  - [ ] 3.2: Show selection indicator
  - [ ] 3.3: Enable Continue button on selection

- [ ] Task 4: Save Character Preference (AC: #5)
  - [ ] 4.1: Save to settings on Continue
  - [ ] 4.2: Update character store
  - [ ] 4.3: Proceed to next step

- [ ] Task 5: Handle No Selection (AC: #6)
  - [ ] 5.1: Disable Continue when nothing selected
  - [ ] 5.2: Show subtle encouragement hint

- [ ] Task 6: Styling
  - [ ] 6.1: Responsive grid layout
  - [ ] 6.2: Character accent colors on hover
  - [ ] 6.3: Selection glow/border effect

## Dev Notes

### Visual Design

```
┌────────────────────────────────────────────────────┐
│                                                    │
│            Choose your companion                   │
│      They'll be with you on your focus journey     │
│                                                    │
│   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐│
│   │  🐱  │  │  🐮  │  │  🐻  │  │  🐨  │  │  🦆  ││
│   │      │  │      │  │      │  │      │  │      ││
│   │ Cat  │  │ Cow  │  │ Bear │  │Koala │  │Platy ││
│   └──────┘  └──────┘  └──────┘  └──────┘  └──────┘│
│                                                    │
│                  [ Continue ]                      │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Character Card Styling

```tsx
<div className={cn(
  "flex flex-col items-center p-4 rounded-xl cursor-pointer",
  "transition-all duration-200",
  "hover:shadow-lg hover:-translate-y-1",
  isSelected && "ring-2 ring-cozy-accent shadow-glow",
  `hover:border-2 hover:border-[${character.accentColor}]`
)}>
  <CharacterSprite character={character.id} state="idle" size="md" />
  <span className="mt-2 font-heading text-cozy-text">{character.name}</span>
</div>
```

### Files to Create

| File | Purpose |
|------|---------|
| `src/features/onboarding/components/CharacterSelectionStep.tsx` | Selection step |
| `src/features/onboarding/components/CharacterCard.tsx` | Card component |

### Files to Modify

| File | Changes |
|------|---------|
| `src/features/onboarding/components/OnboardingFlow.tsx` | Add character step |

### References

- [Source: epics.md#Story-6.3] - Full acceptance criteria
- [Source: ux-design-specification.md#UX12] - Onboarding flow

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
