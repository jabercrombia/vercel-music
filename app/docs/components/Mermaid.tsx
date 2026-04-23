'use client'

import { useEffect, useRef, useId } from 'react'

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId().replace(/:/g, '')

  useEffect(() => {
    if (!ref.current) return

    import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, theme: 'dark' })
      mermaid.render(`mermaid-${id}`, chart.trim()).then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg
      })
    })
  }, [chart, id])

  return <div ref={ref} className="my-6" />
}
