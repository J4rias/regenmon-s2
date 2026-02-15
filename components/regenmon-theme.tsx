'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import * as Tone from 'tone'

interface RegenmonThemeProps {
  className?: string
}

export function RegenmonTheme({ className }: RegenmonThemeProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const synthRef = useRef<Tone.PolySynth | null>(null)
  const partRef = useRef<Tone.Part | null>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'square',
      },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.1,
        release: 1,
      },
    }).toDestination()

    synth.volume.value = -10

    synthRef.current = synth

    return () => {
      synth.dispose()
      partRef.current?.dispose()
    }
  }, [])

  const toggleMusic = useCallback(async () => {
    if (!isPlaying) {
      await Tone.start()

      const melody = [
        // Bar 1: C Minor Arpeggio
        { time: '0:0:0', note: ['C4', 'G4'] },
        { time: '0:0:2', note: ['Eb4', 'C5'] },
        { time: '0:1:0', note: ['G4', 'Eb5'] },
        { time: '0:1:2', note: ['C5', 'G5'] },
        // Bar 2: Ab Major (The broken world)
        { time: '0:2:0', note: ['Ab3', 'Eb4'] },
        { time: '0:2:2', note: ['C4', 'Ab4'] },
        { time: '0:3:0', note: ['Eb4', 'C5'] },
        { time: '0:3:2', note: ['Ab4', 'Eb5'] },
        // Bar 3: Bb Major (Reconstruction)
        { time: '1:0:0', note: ['Bb3', 'F4'] },
        { time: '1:0:2', note: ['D4', 'Bb4'] },
        { time: '1:1:0', note: ['F4', 'D5'] },
        { time: '1:1:2', note: ['Bb4', 'F5'] },
        // Bar 4: G Major (Tension / Resolution)
        { time: '1:2:0', note: ['G3', 'D4'] },
        { time: '1:2:2', note: ['B3', 'G4'] },
        { time: '1:3:0', note: ['D4', 'B4'] },
        { time: '1:3:2', note: ['G4', 'D5'] },
      ]

      const part = new Tone.Part((time, value) => {
        synthRef.current?.triggerAttackRelease(value.note, '16n', time)
      }, melody).start(0)

      part.loop = true
      part.loopEnd = '2m'
      partRef.current = part

      Tone.getTransport().bpm.value = 140
      Tone.getTransport().start()
      setIsPlaying(true)
    } else {
      Tone.getTransport().stop()
      Tone.getTransport().cancel()
      partRef.current?.dispose()
      partRef.current = null
      setIsPlaying(false)
    }
  }, [isPlaying])

  return (
    <button
      type="button"
      onClick={toggleMusic}
      className={`nes-btn btn-press flex items-center ${className ?? ''}`}
      style={{ fontSize: '9px', padding: '3px 8px' }}
      aria-label={isPlaying ? 'Stop music' : 'Play music'}
    >
      {isPlaying ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 19.36A9 9 0 0 0 12 3a9 9 0 0 0 0 18c1.77 0 3.51-.52 5-1.5" /><line x1="1" y1="1" x2="23" y2="23" /><path d="M9 9v6" /><path d="M15 9v6" /></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
      )}
    </button>
  )
}
