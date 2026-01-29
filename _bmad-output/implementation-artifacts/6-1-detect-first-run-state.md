# Story 6.1: Detect First-Run State

Status: ready-for-dev

## Story

As a user launching the app for the first time,
I want the app to recognize this is my first time,
So that I can be guided through setup instead of dropped into an empty interface.

## Acceptance Criteria

1. **Given** the app is launched
   **When** I implement first-run detection in Rust backend
   **Then** the app checks for existence of `settings.json` in data directory
   **And** if settings file doesn't exist, `isFirstRun` is true
   **And** if settings file exists with `onboardingComplete: true`, `isFirstRun` is false

2. **Given** first-run detection exists
   **When** I implement `getAppState()` Rust command
   **Then** the command returns `{ isFirstRun, onboardingComplete, ... }`
   **And** the frontend can check this on startup

3. **Given** the frontend checks first-run state
   **When** `isFirstRun` is true
   **Then** the onboarding flow is triggered automatically
   **And** the main app UI is not shown until onboarding completes

4. **Given** onboarding completes
   **When** the user finishes the flow
   **Then** `onboardingComplete: true` is saved to settings
   **And** subsequent app launches skip onboarding
   **And** the main tray interface becomes active

5. **Given** the user wants to replay onboarding
   **When** a "Replay Welcome" option exists in settings (optional)
   **Then** the user can trigger onboarding again
   **And** this resets `onboardingComplete` temporarily

## Tasks / Subtasks

- [ ] Task 1: Add First-Run Detection Logic (AC: #1)
  - [ ] 1.1: Check for settings.json existence
  - [ ] 1.2: Check for onboardingComplete field
  - [ ] 1.3: Return isFirstRun boolean

- [ ] Task 2: Create getAppState Command (AC: #2)
  - [ ] 2.1: Create `getAppState` Tauri command
  - [ ] 2.2: Return AppState struct with isFirstRun
  - [ ] 2.3: Include other relevant app state

- [ ] Task 3: Update Settings Schema (AC: #4)
  - [ ] 3.1: Add onboardingComplete field to Settings
  - [ ] 3.2: Default to false
  - [ ] 3.3: Implement saveOnboardingComplete()

- [ ] Task 4: Frontend App State Check (AC: #3)
  - [ ] 4.1: Create useAppState hook
  - [ ] 4.2: Call getAppState on mount
  - [ ] 4.3: Route to onboarding if first run

- [ ] Task 5: Onboarding Completion Handler (AC: #4)
  - [ ] 5.1: Mark onboardingComplete on finish
  - [ ] 5.2: Persist to settings
  - [ ] 5.3: Activate tray interface

- [ ] Task 6: Optional Replay Feature (AC: #5)
  - [ ] 6.1: Add "Replay Welcome" option in settings
  - [ ] 6.2: Temporarily reset onboarding state
  - [ ] 6.3: Trigger onboarding flow

## Dev Notes

### App State Response

```rust
#[derive(Serialize)]
struct AppState {
    is_first_run: bool,
    onboarding_complete: bool,
    version: String,
}

#[tauri::command]
fn getAppState(state: State<AppStateManager>) -> AppState {
    let settings = load_settings();
    AppState {
        is_first_run: settings.is_none(),
        onboarding_complete: settings
            .map(|s| s.onboarding_complete)
            .unwrap_or(false),
        version: env!("CARGO_PKG_VERSION").to_string(),
    }
}
```

### Settings Extension

```rust
#[derive(Serialize, Deserialize)]
struct Settings {
    // ... existing fields
    #[serde(default)]
    onboarding_complete: bool,
}
```

### Frontend Routing Logic

```typescript
function App() {
  const { isFirstRun, onboardingComplete } = useAppState();
  
  if (isFirstRun || !onboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }
  
  return <MainApp />;
}
```

### Files to Modify

| File | Changes |
|------|---------|
| `src-tauri/src/storage/settings.rs` | Add onboardingComplete |
| `src-tauri/src/commands/` | Add getAppState command |
| `src/App.tsx` | Add first-run routing |

### References

- [Source: epics.md#Story-6.1] - Full acceptance criteria

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
