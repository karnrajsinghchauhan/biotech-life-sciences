"use client"

import { useEffect, useRef } from "react"

export default function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: 0 | 1 | 2 | 3; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current!
    let done = false
    const ob = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && show()),
      { threshold: 0.1 }
    )
    // Fallback: position check on scroll + interval, in case observer
    // delivery is delayed or the element was jumped past.
    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.96) show()
    }
    const timer = window.setInterval(check, 350)
    function show() {
      if (done) return
      done = true
      el.classList.add("in")
      ob.disconnect()
      window.removeEventListener("scroll", check)
      window.clearInterval(timer)
    }
    ob.observe(el)
    window.addEventListener("scroll", check, { passive: true })
    check()
    return () => {
      ob.disconnect()
      window.removeEventListener("scroll", check)
      window.clearInterval(timer)
    }
  }, [])

  return (
    <div ref={ref} className={`reveal ${delay ? `d${delay}` : ""} ${className}`}>
      {children}
    </div>
  )
}
