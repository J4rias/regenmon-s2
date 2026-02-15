'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import * as Tone from 'tone'

const MUSIC_KEY = 'regenmon-music'

export function RegenmonTheme() {
  // Default to playing -- music starts as soon as we get user gesture
  const [isPlaying, setIsPlaying] = useState(true)
  const synthRef = useRef<Tone.PolySynth | null>(null)
  const partRef = useRef<Tone.Part | null>(null)
  const loopRef = useRef<Tone.Loop | null>(null)
  const startedRef = useRef(false)

  const startMusic = useCallback(async () => {
    if (startedRef.current) return
    startedRef.current = true

    try {
      await Tone.start()

      const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'square' },
        envelope: {
          attack: 0.01,
          decay: 0.1,
          sustain: 0.1,
          release: 1,
        },
      }).toDestination()

      synth.volume.value = -10
      synthRef.current = synth

      const melody = [
        { time: '0:0:0', note: ['C4', 'G4'] },
        { time: '0:0:2', note: ['Eb4', 'C5'] },
        { time: '0:1:0', note: ['G4', 'Eb5'] },
        { time: '0:1:2', note: ['C5', 'G5'] },
        { time: '0:2:0', note: ['Ab3', 'Eb4'] },
        { time: '0:2:2', note: ['C4', 'Ab4'] },
        { time: '0:3:0', note: ['Eb4', 'C5'] },
        { time: '0:3:2', note: ['Ab4', 'Eb5'] },
        { time: '1:0:0', note: ['Bb3', 'F4'] },
        { time: '1:0:2', note: ['D4', 'Bb4'] },
        { time: '1:1:0', note: ['F4', 'D5'] },
        { time: '1:1:2', note: ['Bb4', 'F5'] },
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

      // Ambient random notes from the scale for texture
      const scale = ['C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'Bb4', 'C5']
      const ambientSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'square' },
        envelope: {
          attack: 0.01,
          decay: 0.05,
          sustain: 0.05,
          release: 0.5,
        },
      }).toDestination()
      ambientSynth.volume.value = -22

      const loop = new Tone.Loop((time) => {
        const randomNote = scale[Math.floor(Math.random() * scale.length)]
        ambientSynth.triggerAttackRelease(randomNote, '16n', time)
      }, '8n').start(0)

      loopRef.current = loop

      Tone.getTransport().bpm.value = 140
      Tone.getTransport().start()

      setIsPlaying(true)
    } catch {
      startedRef.current = false
    }
  }, [])

  const stopMusic = useCallback(() => {
    Tone.getTransport().stop()
    Tone.getTransport().cancel()
    partRef.current?.dispose()
    partRef.current = null
    loopRef.current?.dispose()
    loopRef.current = null
    synthRef.current?.dispose()
    synthRef.current = null
    startedRef.current = false
    setIsPlaying(false)
  }, [])

  // Auto-start music on first user interaction (browser requires gesture for AudioContext)
  useEffect(() => {
    const savedPref = localStorage.getItem(MUSIC_KEY)
    if (savedPref === 'off') {
      setIsPlaying(false)
      return
    }

    const handleInteraction = () => {
      startMusic()
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
    }

    document.addEventListener('click', handleInteraction, { once: false })
    document.addEventListener('touchstart', handleInteraction, { once: false })
    document.addEventListener('keydown', handleInteraction, { once: false })

    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
    }
  }, [startMusic])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (startedRef.current) {
        Tone.getTransport().stop()
        Tone.getTransport().cancel()
        partRef.current?.dispose()
        loopRef.current?.dispose()
        synthRef.current?.dispose()
      }
    }
  }, [])

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      stopMusic()
      localStorage.setItem(MUSIC_KEY, 'off')
    } else {
      localStorage.removeItem(MUSIC_KEY)
      startMusic()
    }
  }, [isPlaying, startMusic, stopMusic])

  return (
    <button
      type="button"
      onClick={toggleMusic}
      className="nes-btn btn-press flex items-center"
      style={{ fontSize: '9px', padding: '3px 8px' }}
      aria-label={isPlaying ? 'Stop music' : 'Play music'}
    >
      {isPlaying ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23" /><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
      )}
    </button>
  )
}
