# Story 5.5: Add Lo-Fi Ambient Audio System

Status: ready-for-dev

## Story

As a user,
I want calming lo-fi music during my focus sessions,
So that I can enter a focused state more easily.

## Acceptance Criteria

1. **Given** the audio feature
   **When** I create audio management in `src/shared/hooks/useAudio.ts`
   **Then** the hook provides:
   - `playAmbient()` - starts lo-fi audio loop
   - `stopAmbient()` - stops ambient audio
   - `setVolume(level)` - adjusts volume (0-1)
   - `isPlaying` - current playback state
   **And** the hook uses Web Audio API or HTML5 Audio

2. **Given** audio management exists
   **When** I add ambient audio files
   **Then** `public/assets/audio/` contains lo-fi ambient track(s)
   **And** audio files are optimized for web (MP3 or OGG)
   **And** audio loops seamlessly without audible gap

3. **Given** ambient audio is available
   **When** a focus session starts (UX3)
   **Then** lo-fi audio fades in over 500ms
   **And** audio volume respects system volume settings
   **And** audio continues playing throughout the session

4. **Given** a focus session ends or is stopped
   **When** the session transitions
   **Then** lo-fi audio fades out over 300ms
   **And** audio stops completely (no background drain)

5. **Given** audio preferences exist
   **When** I add audio toggle to settings
   **Then** `audioEnabled` setting controls ambient audio
   **And** users can disable ambient audio entirely
   **And** the setting persists across sessions

6. **Given** break mode is active
   **When** ambient audio plays during break (optional)
   **Then** a different, lighter ambient track may play
   **And** or audio remains silent during breaks (based on preference)

## Tasks / Subtasks

- [ ] Task 1: Create useAudio Hook (AC: #1)
  - [ ] 1.1: Create `src/shared/hooks/useAudio.ts`
  - [ ] 1.2: Implement playAmbient() function
  - [ ] 1.3: Implement stopAmbient() function
  - [ ] 1.4: Implement setVolume() function
  - [ ] 1.5: Track isPlaying state

- [ ] Task 2: Add Audio Assets (AC: #2)
  - [ ] 2.1: Source/create lo-fi ambient track
  - [ ] 2.2: Optimize as MP3 (128kbps)
  - [ ] 2.3: Ensure seamless loop
  - [ ] 2.4: Place in `public/assets/audio/`

- [ ] Task 3: Implement Fade In/Out (AC: #3, #4)
  - [ ] 3.1: Fade in over 500ms on session start
  - [ ] 3.2: Fade out over 300ms on session end
  - [ ] 3.3: Use Web Audio API gain node or volume interpolation

- [ ] Task 4: Connect to Timer Events (AC: #3, #4)
  - [ ] 4.1: Listen to timer start event
  - [ ] 4.2: Listen to timer stop/complete events
  - [ ] 4.3: Handle pause (keep playing or fade?)

- [ ] Task 5: Add Audio Settings (AC: #5)
  - [ ] 5.1: Add audioEnabled to settings store
  - [ ] 5.2: Respect setting in useAudio
  - [ ] 5.3: Add toggle in settings UI (future)

- [ ] Task 6: Handle Break Mode (AC: #6)
  - [ ] 6.1: Option to continue during break
  - [ ] 6.2: Option to stop during break
  - [ ] 6.3: Optional different break track

- [ ] Task 7: Testing
  - [ ] 7.1: Test audio plays on session start
  - [ ] 7.2: Test audio stops on session end
  - [ ] 7.3: Test fade transitions
  - [ ] 7.4: Test settings toggle

## Dev Notes

### Audio Implementation

**Using Web Audio API:**
```typescript
const audioContext = new AudioContext();
const gainNode = audioContext.createGain();

async function playAmbient() {
  const response = await fetch('/assets/audio/ambient.mp3');
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = true;
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Fade in
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.5);
  
  source.start();
}
```

**Using HTML5 Audio (simpler):**
```typescript
const audio = new Audio('/assets/audio/ambient.mp3');
audio.loop = true;

function playAmbient() {
  audio.volume = 0;
  audio.play();
  
  // Fade in
  let vol = 0;
  const fadeIn = setInterval(() => {
    vol += 0.02;
    audio.volume = Math.min(vol, 1);
    if (vol >= 1) clearInterval(fadeIn);
  }, 10);
}
```

### Audio File Requirements

- Format: MP3 or OGG
- Duration: 2-5 minutes (will loop)
- Sample rate: 44.1kHz
- Bitrate: 128kbps (good quality, small size)
- Seamless loop point

### Settings Integration

```typescript
// In useAudio
const { audioEnabled } = useSettingsStore();

function playAmbient() {
  if (!audioEnabled) return;
  // ... play logic
}
```

### Files to Create

| File | Purpose |
|------|---------|
| `src/shared/hooks/useAudio.ts` | Audio management hook |
| `public/assets/audio/ambient.mp3` | Lo-fi ambient track |

### Files to Modify

| File | Changes |
|------|---------|
| `src/features/settings/stores/settingsStore.ts` | Add audioEnabled |
| Timer components | Connect audio to timer events |

### References

- [Source: epics.md#Story-5.5] - Full acceptance criteria
- [Source: ux-design-specification.md#UX3] - Lo-fi ambient audio

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
