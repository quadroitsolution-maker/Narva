'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export default function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showImage, setShowImage] = useState(false)
  const [transformStyle, setTransformStyle] = useState({
    transform: 'translate(0px, 0px) scale(0.748)',
  })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleEnded = () => {
      video.pause()
      setShowImage(true)
    }

    video.addEventListener('ended', handleEnded)
    return () => video.removeEventListener('ended', handleEnded)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateDimensions = () => {
      const W = container.clientWidth
      const H = container.clientHeight
      if (!W || !H) return

      const videoAspect = 1920 / 1080
      const containerAspect = W / H

      let scaleActual = 1
      if (containerAspect > videoAspect) {
        // Container is wider than video aspect ratio (16:9)
        scaleActual = W / 1920
      } else {
        // Container is taller/narrower than video aspect ratio (16:9)
        scaleActual = H / 1080
      }

      // Raw optimization values calculated in 1920x1080 space:
      // S_raw = 0.748, dX_raw = 62, dY_raw = 42
      const dX = 62 * scaleActual
      const dY = 42 * scaleActual
      const S = 0.748 * scaleActual

      setTransformStyle({
        transform: `translate(${dX}px, ${dY}px) scale(${S})`,
      })
    }

    // Initial run
    updateDimensions()

    // Observe size changes
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions()
    })
    resizeObserver.observe(container)

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-full">

      {/* Video */}
      <video
        ref={videoRef}
        src="/gummy bear hero narva.webm"
        autoPlay
        muted
        playsInline
        preload="auto"
        style={{ transition: 'opacity 0.6s ease', opacity: showImage ? 0 : 1 }}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* HD photo — positioned and scaled to match the video's last frame perfectly */}
      <div
        style={{ transition: 'opacity 0.6s ease', opacity: showImage ? 1 : 0, pointerEvents: 'none' }}
        className="absolute inset-0 w-full h-full flex items-center justify-center"
      >
        <div
          style={{
            ...transformStyle,
            width: '1024px',
            height: '1024px',
          }}
          className="relative flex items-center justify-center"
        >
          <Image
            src="/product-hero.jpg"
            alt="Narva Melatonin Sleep Gummies"
            fill
            priority
            className="object-contain"
            sizes="100vw"
          />
        </div>
      </div>

    </div>
  )
}
