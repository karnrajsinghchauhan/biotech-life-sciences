"use client"

// Adapted from the canvas-confetti shadcn component to this project's design
// system — no Radix/cva/Tailwind, and restrained to brand colours so an order
// confirmation feels considered rather than like a game.

import type { ReactNode } from "react"
import React, { createContext, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from "react"
import type {
  GlobalOptions as ConfettiGlobalOptions,
  CreateTypes as ConfettiInstance,
  Options as ConfettiOptions,
} from "canvas-confetti"
import confetti from "canvas-confetti"

type Api = { fire: (options?: ConfettiOptions) => void }

type Props = React.ComponentPropsWithRef<"canvas"> & {
  options?: ConfettiOptions
  globalOptions?: ConfettiGlobalOptions
  manualstart?: boolean
  children?: ReactNode
}

export type ConfettiRef = Api | null

const ConfettiContext = createContext<Api>({} as Api)

/** Brand palette — navy, scientific blue, teal. No rainbow. */
export const BRAND_COLORS = ["#0b1f3a", "#1156d6", "#0e9a8d", "#7fb0ff", "#cfd9e6"]

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

const Confetti = forwardRef<ConfettiRef, Props>((props, ref) => {
  const { options, globalOptions = { resize: true, useWorker: true }, manualstart = false, children, ...rest } = props
  const instanceRef = useRef<ConfettiInstance | null>(null)

  const canvasRef = useCallback(
    (node: HTMLCanvasElement | null) => {
      if (node !== null) {
        if (instanceRef.current) return
        instanceRef.current = confetti.create(node, { ...globalOptions, resize: true })
      } else if (instanceRef.current) {
        instanceRef.current.reset()
        instanceRef.current = null
      }
    },
    [globalOptions]
  )

  const fire = useCallback(
    (opts: ConfettiOptions = {}) => {
      if (prefersReducedMotion()) return
      void instanceRef.current?.({ colors: BRAND_COLORS, ...options, ...opts })
    },
    [options]
  )

  const api = useMemo(() => ({ fire }), [fire])
  useImperativeHandle(ref, () => api, [api])

  useEffect(() => {
    if (!manualstart) fire()
  }, [manualstart, fire])

  return (
    <ConfettiContext.Provider value={api}>
      <canvas ref={canvasRef} {...rest} />
      {children}
    </ConfettiContext.Provider>
  )
})
Confetti.displayName = "Confetti"

type ConfettiButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  options?: ConfettiOptions & ConfettiGlobalOptions & { canvas?: HTMLCanvasElement }
  children?: React.ReactNode
}

/** Fires from the button's own position. Uses this site's .btn styles. */
export function ConfettiButton({ options, children, className = "btn primary", onClick, ...props }: ConfettiButtonProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    if (!prefersReducedMotion()) {
      void confetti({
        colors: BRAND_COLORS,
        ...options,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
      })
    }
    onClick?.(event)
  }
  return (
    <button className={className} onClick={handleClick} {...props}>
      {children}
    </button>
  )
}

/**
 * Two soft side cannons — the restrained celebration used on order
 * confirmation. Silently does nothing when reduced motion is requested.
 */
export function fireOrderConfirmation() {
  if (prefersReducedMotion()) return
  const end = Date.now() + 1400
  const frame = () => {
    if (Date.now() > end) return
    void confetti({ particleCount: 2, angle: 60, spread: 48, startVelocity: 42, origin: { x: 0, y: 0.62 }, colors: BRAND_COLORS, scalar: 0.9, ticks: 180 })
    void confetti({ particleCount: 2, angle: 120, spread: 48, startVelocity: 42, origin: { x: 1, y: 0.62 }, colors: BRAND_COLORS, scalar: 0.9, ticks: 180 })
    requestAnimationFrame(frame)
  }
  frame()
}

export { Confetti }
