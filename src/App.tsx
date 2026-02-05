import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Countdown from './components/Countdown'
import Tank from './components/Tank'
import phasesData from './data/phases.json'
import './App.css'

function App() {
  const [fillPercentage, setFillPercentage] = useState(0)

  // Phase Management State
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [showPhaseName, setShowPhaseName] = useState(false)

  // Global Range for Tank
  const START_DATE = new Date('2026-02-05T10:00:00')
  const END_DATE = new Date('2026-02-06T18:00:00')

  // Phase Logic & Tank Fill Combined
  useEffect(() => {
    const updateState = () => {
      const now = new Date()
      let newPhaseIndex = -1
      let isCelebration = false

      // 1. Determine Phase
      // Check if we are in the 1 minute window AFTER a phase
      for (let i = 0; i < phasesData.length; i++) {
        const phaseTime = new Date(phasesData[i].timestamp)
        const diff = now.getTime() - phaseTime.getTime() // positive if now is after phase

        // If we are within 1 minute (60000ms) AFTER the phase timestamp
        if (diff >= 0 && diff < 60000) {
          newPhaseIndex = i
          isCelebration = true
          break
        }
      }

      // If not in a celebration window, find the next upcoming phase
      if (!isCelebration) {
        for (let i = 0; i < phasesData.length; i++) {
          const phaseTime = new Date(phasesData[i].timestamp)
          if (phaseTime > now) {
            newPhaseIndex = i
            break
          }
        }
      }

      // Handle Event Over case
      if (newPhaseIndex === -1 && !isCelebration) {
        // After last phase closing ceremony
        setCurrentPhaseIndex(phasesData.length - 1)
        setShowPhaseName(false)
        setFillPercentage(100)
        return
      }

      setCurrentPhaseIndex(newPhaseIndex)
      setShowPhaseName(isCelebration)

      // 2. Calculate Fill Percentage: [Previous Phase Time, Target Phase Time]
      if (isCelebration) {
        setFillPercentage(100)
      } else {
        const targetTime = new Date(phasesData[newPhaseIndex].timestamp).getTime()
        let startTime = START_DATE.getTime()

        if (newPhaseIndex > 0) {
          startTime = new Date(phasesData[newPhaseIndex - 1].timestamp).getTime()
        }

        // Safety check for weird dates or first phase logic
        if (startTime >= targetTime) {
          // If duration is invalid, assume full or empty based on time
          setFillPercentage(100)
        } else {
          const totalDuration = targetTime - startTime
          const elapsed = now.getTime() - startTime
          const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
          setFillPercentage(percentage)
        }
      }
    }

    updateState()
    const interval = setInterval(updateState, 1000)
    return () => clearInterval(interval)
  }, [])

  const activePhase = phasesData[currentPhaseIndex]
  const targetDate = activePhase ? new Date(activePhase.timestamp) : END_DATE

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white selection:bg-red-500">
      {/* 1. Background Image Placeholder */}
      <Tank fillPercentage={fillPercentage} />
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: 'url("/only-founders-bg.png")' }}
      ></div>

      {/* 2. Tank Background */}

      {/* 3. Content Overlay */}
      <div className="relative z-20 flex flex-col items-center pt-8 h-full w-full">
        {/* Logo */}
        <div className="mb-24 flex items-center justify-center w-full">
          <div className="w-[50%] max-w-[50%] flex items-center justify-center">
            <img src="/only-founders-logo.png" alt="Only Founders Logo" className="object-contain max-h-72 drop-shadow-[0_0_15px_rgba(220,38,38,0.4)]" />
          </div>
        </div>

        {/* Dynamic Content: Timer OR Phase Name */}
        <div className="w-full h-48 flex items-center justify-center">
          <AnimatePresence mode='wait'>
            {showPhaseName ? (
              <motion.div
                key="phase-name"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                className="text-center"
              >
                <h1 className="text-6xl md:text-8xl font-black text-yellow-500 uppercase tracking-tighter drop-shadow-[0_0_30px_rgba(234,179,8,0.8)] p-8 rounded-xl bg-black/80 backdrop-blur-xl">
                  {activePhase.name}
                </h1>
              </motion.div>
            ) : (
              <motion.div
                key="timer"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
              >
                {/* Pass key based on phase index to force re-mounting/resetting internal state if needed, though props update handles it */}
                <div className="flex flex-col items-center">
                  <div className="mb-4 text-3xl mt-10 tracking-[0.2em] font-bold text-gray-400 uppercase">{activePhase ? `Next stop at ${activePhase.name}` : phasesData[phasesData.length - 1].name}</div>
                  <Countdown targetDate={targetDate} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default App
