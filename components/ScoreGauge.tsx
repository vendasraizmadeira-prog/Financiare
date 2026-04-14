'use client'

import { useEffect, useRef } from 'react'
import { scoreColor, scoreLabel } from '@/lib/utils'

interface Props {
  score: number
  size?: number
}

export default function ScoreGauge({ score, size = 200 }: Props) {
  const circleRef = useRef<SVGCircleElement>(null)

  const radius = 80
  const stroke = 14
  const normalizedRadius = radius - stroke / 2
  const circumference = normalizedRadius * 2 * Math.PI

  // We show a 270° arc (from bottom-left, going clockwise)
  const arcFraction = 0.75
  const totalArc = circumference * arcFraction
  const offset = totalArc - (score / 100) * totalArc
  const color = scoreColor(score)

  useEffect(() => {
    const el = circleRef.current
    if (!el) return

    el.style.strokeDasharray = `${totalArc} ${circumference}`
    el.style.strokeDashoffset = String(totalArc)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
        el.style.strokeDashoffset = String(offset)
      })
    })
  }, [score, offset, totalArc, circumference])

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        style={{ transform: 'rotate(135deg)' }}
      >
        {/* Track */}
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={stroke}
          strokeDasharray={`${totalArc} ${circumference}`}
          strokeLinecap="round"
        />
        {/* Fill */}
        <circle
          ref={circleRef}
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          style={{
            strokeDasharray: `${totalArc} ${circumference}`,
            strokeDashoffset: String(totalArc),
            filter: `drop-shadow(0 0 8px ${color}66)`,
          }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingBottom: '10%' }}>
        <span className="text-4xl font-extrabold text-white leading-none" style={{ color }}>
          {score}%
        </span>
        <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
          {scoreLabel(score)}
        </span>
      </div>
    </div>
  )
}
