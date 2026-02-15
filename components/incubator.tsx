'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ARCHETYPES, type ArchetypeId, type RegenmonData } from '@/lib/regenmon-types'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'

interface IncubatorProps {
  locale: Locale
  onHatch: (data: RegenmonData) => void
}

export function Incubator({ locale, onHatch }: IncubatorProps) {
  const [name, setName] = useState('')
  const [selectedType, setSelectedType] = useState<ArchetypeId | null>(null)
  const s = t(locale)

  const isValid = name.trim().length >= 2 && name.trim().length <= 15 && selectedType !== null

  function handleHatch() {
    if (!isValid || !selectedType) return
    const data: RegenmonData = {
      name: name.trim(),
      type: selectedType,
      stats: { happiness: 50, energy: 50, hunger: 50 },
      createdAt: new Date().toISOString(),
    }
    onHatch(data)
  }

  return (
    <div className="flex min-h-[calc(100vh-60px)] flex-col items-center justify-center px-4 py-10 sm:px-6">
      <div
        className="nes-container is-rounded w-full max-w-3xl"
        style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
      >
        {/* Title */}
        <h2
          className="mb-2 text-center text-lg leading-relaxed sm:text-2xl"
          style={{ color: 'var(--foreground)' }}
        >
          {s.createTitle}
        </h2>
        <p
          className="mb-8 text-center text-xs leading-relaxed sm:text-sm"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {s.subtitle}
        </p>

        {/* Name input */}
        <div className="mb-8">
          <label
            htmlFor="regenmon-name"
            className="mb-3 block text-xs leading-relaxed sm:text-sm"
            style={{ color: 'var(--foreground)' }}
          >
            {s.nameLabel}
          </label>
          <input
            id="regenmon-name"
            type="text"
            className="nes-input w-full"
            placeholder={s.namePlaceholder}
            value={name}
            maxLength={15}
            onChange={(e) => setName(e.target.value)}
            style={{
              backgroundColor: 'var(--secondary)',
              color: 'var(--foreground)',
              fontSize: '14px',
              padding: '10px 12px',
            }}
          />
          {name.length > 0 && name.trim().length < 2 && (
            <p className="mt-2 text-xs leading-relaxed" style={{ color: '#cd5c5c' }}>
              {s.nameMinError}
            </p>
          )}
        </div>

        {/* Archetype selection */}
        <div className="mb-8">
          <p className="mb-4 text-xs leading-relaxed sm:text-sm" style={{ color: 'var(--foreground)' }}>
            {s.selectArchetype}
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {ARCHETYPES.map((arch) => {
              const isSelected = selectedType === arch.id
              return (
                <button
                  key={arch.id}
                  type="button"
                  onClick={() => setSelectedType(arch.id)}
                  className="nes-container is-rounded cursor-pointer text-left transition-all"
                  style={{
                    borderColor: isSelected ? arch.color : 'var(--border)',
                    backgroundColor: isSelected ? arch.colorDark : 'var(--secondary)',
                    color: 'var(--foreground)',
                    boxShadow: isSelected ? `0 0 16px ${arch.color}50` : 'none',
                    padding: '16px',
                  }}
                >
                  <div className="flex flex-col items-center gap-3">
                    {/* Archetype illustration */}
                    <div className="relative h-24 w-24 sm:h-28 sm:w-28">
                      <Image
                        src={arch.image}
                        alt={arch.getName(locale)}
                        fill
                        className="object-contain"
                        style={{ imageRendering: 'pixelated' }}
                        unoptimized
                      />
                    </div>
                    <span className="text-sm font-bold sm:text-base" style={{ color: arch.color }}>
                      {arch.getName(locale)}
                    </span>
                    <span
                      className="text-center text-xs leading-relaxed"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {`"${arch.getLabel(locale)}"`}
                    </span>
                    <span
                      className="text-center leading-relaxed"
                      style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}
                    >
                      {arch.getDescription(locale)}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Hatch button */}
        <div className="flex justify-center">
          <button
            type="button"
            className={`nes-btn ${isValid ? 'is-primary' : 'is-disabled'}`}
            disabled={!isValid}
            onClick={handleHatch}
            style={{ fontSize: '14px', padding: '8px 24px' }}
          >
            {s.hatchButton}
          </button>
        </div>
      </div>
    </div>
  )
}
