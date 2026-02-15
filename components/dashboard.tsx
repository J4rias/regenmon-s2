'use client'

import { useState } from 'react'
import { ARCHETYPES, type RegenmonData } from '@/lib/regenmon-types'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'

interface DashboardProps {
  locale: Locale
  data: RegenmonData
  onReset: () => void
}

export function Dashboard({ locale, data, onReset }: DashboardProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const archetype = ARCHETYPES.find((a) => a.id === data.type)!
  const s = t(locale)

  function handleReset() {
    setShowConfirm(true)
  }

  function confirmReset() {
    setShowConfirm(false)
    onReset()
  }

  return (
    <div className="flex min-h-[calc(100vh-60px)] flex-col items-center px-4 py-8 sm:px-6 sm:py-10">
      {/* Sub-header with reset */}
      <div className="mb-6 flex w-full max-w-3xl items-center justify-between">
        <div>
          <p className="text-xs leading-relaxed sm:text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {archetype.getName(locale)} &mdash; {`"${archetype.getLabel(locale)}"`}
          </p>
        </div>
        <button
          type="button"
          className="nes-btn is-error"
          onClick={handleReset}
          style={{ fontSize: '12px', padding: '4px 14px' }}
        >
          {s.resetButton}
        </button>
      </div>

      {/* Display area */}
      <div
        className="nes-container is-rounded scanlines relative mb-8 w-full max-w-3xl overflow-hidden"
        style={{
          backgroundColor: archetype.colorDark,
          borderColor: archetype.color,
          color: 'var(--foreground)',
        }}
      >
        <div className="flex flex-col items-center gap-5 py-8 sm:py-10">
          <p className="text-center text-lg leading-relaxed sm:text-2xl" style={{ color: archetype.color }}>
            {data.name}
          </p>

          {/* Placeholder object simulating character position and effects */}
          <div className="animate-breathe flex flex-col items-center gap-3">
            {/* Main body */}
            <div
              className="relative flex h-28 w-28 items-center justify-center sm:h-36 sm:w-36"
              style={{ imageRendering: 'pixelated' }}
            >
              <div
                className="absolute inset-0 border-4"
                style={{
                  borderColor: archetype.color,
                  backgroundColor: archetype.colorDark,
                }}
              />
              <div
                className="relative z-10 h-12 w-12 sm:h-16 sm:w-16"
                style={{
                  backgroundColor: archetype.color,
                  boxShadow: `0 0 24px ${archetype.color}80, 0 0 48px ${archetype.color}40`,
                }}
              />
              <div
                className="absolute top-4 left-4 z-20 h-3 w-3 sm:h-4 sm:w-4"
                style={{ backgroundColor: 'var(--foreground)' }}
              />
              <div
                className="absolute top-4 right-4 z-20 h-3 w-3 sm:h-4 sm:w-4"
                style={{ backgroundColor: 'var(--foreground)' }}
              />
            </div>

            {/* Shadow */}
            <div
              className="h-2 w-20 animate-float opacity-30 sm:w-24"
              style={{
                backgroundColor: archetype.color,
                filter: 'blur(4px)',
              }}
            />
          </div>

          {/* Particles effect */}
          <div className="flex gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="animate-float h-2.5 w-2.5"
                style={{
                  backgroundColor: archetype.color,
                  animationDelay: `${i * 0.5}s`,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats panel */}
      <div
        className="nes-container is-rounded w-full max-w-3xl"
        style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
      >
        <h2
          className="mb-6 text-center text-sm leading-relaxed sm:text-base"
          style={{ color: 'var(--foreground)' }}
        >
          {s.statsTitle}
        </h2>

        <div className="flex flex-col gap-6">
          {/* Happiness */}
          <div>
            <label className="mb-2 flex items-center justify-between text-xs leading-relaxed sm:text-sm" style={{ color: 'var(--foreground)' }}>
              <span>{s.happiness}</span>
              <span style={{ color: 'var(--muted-foreground)' }}>
                {data.stats.happiness}/100
              </span>
            </label>
            <progress
              className="nes-progress is-success"
              value={data.stats.happiness}
              max={100}
            />
          </div>

          {/* Energy */}
          <div>
            <label className="mb-2 flex items-center justify-between text-xs leading-relaxed sm:text-sm" style={{ color: 'var(--foreground)' }}>
              <span>{s.energy}</span>
              <span style={{ color: 'var(--muted-foreground)' }}>
                {data.stats.energy}/100
              </span>
            </label>
            <progress
              className="nes-progress is-warning"
              value={data.stats.energy}
              max={100}
            />
          </div>

          {/* Hunger */}
          <div>
            <label className="mb-2 flex items-center justify-between text-xs leading-relaxed sm:text-sm" style={{ color: 'var(--foreground)' }}>
              <span>{s.hunger}</span>
              <span style={{ color: 'var(--muted-foreground)' }}>
                {data.stats.hunger}/100
              </span>
            </label>
            <progress
              className="nes-progress is-error"
              value={data.stats.hunger}
              max={100}
            />
          </div>
        </div>
      </div>

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div
            className="nes-container is-rounded w-full max-w-md"
            style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
          >
            <p className="mb-6 text-center text-xs leading-relaxed sm:text-sm" style={{ color: 'var(--foreground)' }}>
              {s.confirmReset}
            </p>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                className="nes-btn is-error"
                onClick={confirmReset}
                style={{ fontSize: '12px' }}
              >
                {s.yes}
              </button>
              <button
                type="button"
                className="nes-btn"
                onClick={() => setShowConfirm(false)}
                style={{ fontSize: '12px' }}
              >
                {s.no}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
