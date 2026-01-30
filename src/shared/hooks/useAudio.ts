import { useCallback, useRef, useState } from "react";
import { useSettingsStore } from "@/features/settings/stores/settingsStore";

const FADE_IN_DURATION = 500;
const FADE_OUT_DURATION = 300;
const FADE_INTERVAL = 20;

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioEnabled = useSettingsStore((state) => state.settings.audioEnabled);

  const clearFadeInterval = useCallback(() => {
    if (fadeIntervalRef.current !== null) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  }, []);

  const fadeIn = useCallback((audio: HTMLAudioElement, targetVolume: number = 1) => {
    clearFadeInterval();
    audio.volume = 0;
    const steps = FADE_IN_DURATION / FADE_INTERVAL;
    const volumeStep = targetVolume / steps;
    let currentStep = 0;

    fadeIntervalRef.current = window.setInterval(() => {
      currentStep++;
      audio.volume = Math.min(volumeStep * currentStep, targetVolume);
      if (currentStep >= steps) {
        clearFadeInterval();
      }
    }, FADE_INTERVAL);
  }, [clearFadeInterval]);

  const fadeOut = useCallback((audio: HTMLAudioElement, onComplete?: () => void) => {
    clearFadeInterval();
    const startVolume = audio.volume;
    const steps = FADE_OUT_DURATION / FADE_INTERVAL;
    const volumeStep = startVolume / steps;
    let currentStep = 0;

    fadeIntervalRef.current = window.setInterval(() => {
      currentStep++;
      audio.volume = Math.max(startVolume - volumeStep * currentStep, 0);
      if (currentStep >= steps) {
        clearFadeInterval();
        audio.pause();
        audio.currentTime = 0;
        onComplete?.();
      }
    }, FADE_INTERVAL);
  }, [clearFadeInterval]);

  const playAmbient = useCallback(() => {
    if (!audioEnabled) return;

    if (!audioRef.current) {
      audioRef.current = new Audio("/assets/audio/ambient.mp3");
      audioRef.current.loop = true;
    }

    const audio = audioRef.current;
    audio.play()
      .then(() => {
        fadeIn(audio);
        setIsPlaying(true);
      })
      .catch((error) => {
        console.warn("Failed to play ambient audio:", error);
      });
  }, [audioEnabled, fadeIn]);

  const stopAmbient = useCallback(() => {
    if (!audioRef.current) return;

    fadeOut(audioRef.current, () => {
      setIsPlaying(false);
    });
  }, [fadeOut]);

  const setVolume = useCallback((level: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, level));
    }
  }, []);

  return {
    playAmbient,
    stopAmbient,
    setVolume,
    isPlaying,
  };
}
