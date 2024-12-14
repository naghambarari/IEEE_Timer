'use client'

import React, { useState, useEffect } from 'react'
import { BurgerMenu } from '@/components/BurgerMenu'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { FaCog } from 'react-icons/fa'
import Image from 'next/image'

const ieeeThemes = [
  { name: 'WIE', frame: '#000000', body: '#F3E8F1', font: '#000000', background: '#FCE4F3', inner: '#FCE4F3', backgroundImage: '', logo: '' },
  { name: 'CIS', frame: '#000000', body: '#D9E8F5', font: '#000000', background: '#EBF4FB', inner: '#EBF4FB', backgroundImage: '', logo: '' },
  { name: 'AESS', frame: '#000000', body: '#2E2E2E', font: '#FFFFFF', background: '#121212', inner: '#121212', backgroundImage: '', logo: '' }, // Dark theme
  { name: 'CS', frame: '#000000', body: '#FFF4D6', font: '#000000', background: '#FFF9EB', inner: '#FFF9EB', backgroundImage: '/csbg.png', logo: '/ieeecslogo.png' },
  { name: 'PES', frame: '#000000', body: '#E5F4E3', font: '#000000', background: '#F2FAF2', inner: '#F2FAF2', backgroundImage: '', logo: '' },
]

export default function Timer() {
  const [time, setTime] = useState(0) // Initial time set to 0
  const [isRunning, setIsRunning] = useState(false)
  const [timerName, setTimerName] = useState('pupus') // Initial name set to "pupus"
  const [settings, setSettings] = useState(ieeeThemes[3]) // Default theme (CS)
  const [audio] = useState(new Audio('/sounds/timersound.wav'))
  const [stoppingSound] = useState(new Audio('/sounds/stoppingsound.wav'))
  const [isMuted, setIsMuted] = useState(false)
  const [userSettings, setUserSettings] = useState(settings)
  const [isRedMode, setIsRedMode] = useState(false)

  useEffect(() => {
    sessionStorage.setItem('timerSettings', JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    let redModeTimeout: NodeJS.Timeout | null = null
    if (time === 0 && isRunning && time !== 0) {
      stoppingSound.play().catch(error => console.error('Stopping sound play failed:', error))
    }
    if (isRunning && time > 0) {
      interval = setInterval(() => {
      setTime((prevTime) => {
        if ((prevTime === 300 && time <= 900) || (prevTime === 600 && time > 1200)) {
        audio.loop = true
        audio.play().catch(error => console.error('Audio play failed:', error))
        }
        if (prevTime === 300) {
        setUserSettings(settings) // Save user settings before changing to red mode
        setIsRedMode(true)
        setSettings((prevSettings) => ({
          ...prevSettings,
          frame: '#000000',
          body: '#d00000',
          backgroundImage: '/red_mode_background.gif', // Red mode background
          font: '#000000', // Black font color
          inner: '#fff0f3', // Red mode inner
        }))
        }
        if (prevTime === 0) {
        setIsRunning(false)
        audio.pause()
        audio.currentTime = 0
        stoppingSound.play().catch(error => console.error('Stopping sound play failed:', error))
        redModeTimeout = setTimeout(() => {
          setSettings(userSettings) // Reset to user settings after 3 seconds
          setIsRedMode(false)
          stoppingSound.play().catch(error => console.error('Stopping sound play failed:', error))
        }, 3000)
        }
        return prevTime - 1
      })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
      if (redModeTimeout) clearTimeout(redModeTimeout)
    }
  }, [isRunning, time, audio, stoppingSound, settings, userSettings])

  useEffect(() => {
    audio.muted = isMuted
    stoppingSound.muted = isMuted
  }, [isMuted, audio, stoppingSound])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  const handleStartPause = () => {
    if (isRunning) {
      audio.pause()
    } else if (time > 0 && ((time <= 900 && time > 300) || (time <= 300 && time > 0))) {
      audio.play()
    }
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setTime(0) // Set time to 0 when reset
    setIsRunning(false)
    audio.pause()
    audio.currentTime = 0
    setSettings(userSettings) // Reset to user settings
    setIsRedMode(false)
  }

  const handleAddTime = () => {
    setTime((prevTime) => prevTime + 5 * 60) // Add 5 minutes
  }

  const handleSoundToggle = (muted: boolean) => {
    setIsMuted(muted)
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden transition-all duration-500"
      style={{
        backgroundColor: settings.background,
        backgroundImage: settings.backgroundImage ? `url(${settings.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {settings.logo && (
        <div className="absolute bottom-4 left-4 w-48 h-48 transition-all duration-500"> {/* Increased size */}
          <Image 
            src={settings.logo} 
            alt="Logo" 
            layout="fill"
            objectFit="contain"
          />
        </div>
      )}
      <Card settings={settings} className="w-[28rem]">
        <CardHeader>
          <input
            type="text"
            value={timerName}
            onChange={(e) => setTimerName(e.target.value)}
            className="text-2xl font-bold mb-4 text-center bg-transparent border-none outline-none w-full transition-all duration-500"
            style={{ color: settings.name === 'AESS' ? '#FFFFFF' : (settings.font === '#FF6666' ? '#000000' : settings.font) }} // Adjust font color based on theme
            placeholder="Enter timer name"
          />
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded-lg p-4 mb-6 border-2 transition-all duration-500" style={{ borderColor: settings.frame }}>
            <div className="text-7xl font-bold text-center transition-all duration-500" style={{ color: '#000000' }}> {/* Keep inner timer clock color black */}
              {formatTime(time)}
            </div>
          </div>
          <div className="flex justify-between">
            {['Reset', isRunning ? 'Pause' : 'Start', '+5 min'].map((label, index) => (
              <button
                key={label}
                className="px-6 py-3 rounded-xl font-semibold text-lg border-2 transition-all duration-500 ease-in-out hover:bg-opacity-90 shadow-md"
                style={{
                  backgroundColor: isRedMode ? '#fff0f3' : settings.inner,
                  borderColor: isRedMode ? '#000000' : settings.frame,
                  color: settings.name === 'AESS' ? '#FFFFFF' : (settings.font === '#FF6666' ? '#000000' : '#000000') // Adjust font color based on theme
                }}
                onClick={[handleReset, handleStartPause, handleAddTime][index]}
              >
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <BurgerMenu 
        settings={settings}
        onSettingsChange={isRedMode ? () => {} : setSettings} // Prevent theme change during red mode
        onSoundToggle={handleSoundToggle}
        ieeeThemes={ieeeThemes}
        menuBackground={settings.font === '#FF6666' ? '#fff0f3' : settings.background} // Menu background in red mode
        menuFont={settings.font === '#FF6666' ? '#000000' : settings.font} // Menu font in red mode
      />
    </div>
  )
}