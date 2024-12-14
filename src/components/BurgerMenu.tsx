'use client'

import React, { useState } from 'react'
import { Menu, Volume2, VolumeX, Palette, ImageIcon, Info, Upload, X } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import styles from '../../styles/BurgerMenu.module.css' 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// **Constants**
const menuItems = [
  { icon: <Palette className="w-4 h-4" />, label: 'Appearance' },
  { icon: <ImageIcon className="w-4 h-4" />, label: 'Background' },
  { icon: <Info className="w-4 h-4" />, label: 'About' },
]

// **Interfaces**
interface BurgerMenuProps {
  settings: any;
  onSettingsChange: (settings: any) => void;
  onSoundToggle: (muted: boolean) => void;
  ieeeThemes: Array<{
    name: string;
    frame: string;
    body: string;
    font: string;
    background: string;
    inner: string;
  }>;
  menuBackground: string;
  menuFont: string;
}

// **Main Component**
export function BurgerMenu({
  settings,
  onSettingsChange,
  onSoundToggle,
  ieeeThemes,
  menuBackground,
  menuFont
}: BurgerMenuProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [activeTab, setActiveTab] = useState('Appearance')

  // **Handlers**
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const logoData = event.target?.result as string
        onSettingsChange({ ...settings, logo: logoData })
        localStorage.setItem('timerLogo', logoData)
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleSoundToggle = () => {
    setIsMuted(!isMuted)
    onSoundToggle(!isMuted)
  }

  // **Component Render**
  return (
    <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
      {/* Sound Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleSoundToggle}
        style={{
          backgroundColor: settings.body,
          borderColor: settings.frame,
          color: settings.font
        }}
        className="rounded-full shadow-lg hover:bg-opacity-90 border-2"
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>

      {/* Menu Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            style={{
              backgroundColor: settings.body,
              borderColor: settings.frame,
              color: settings.font
            }}
            className="rounded-full shadow-lg hover:bg-opacity-90 border-2"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>

        <SheetContent 
          className={`max-h-screen overflow-y-auto ${styles.menu}`}
          style={{
            backgroundColor: menuBackground,
            color: menuFont
          }}
        >
          <SheetHeader className="border-b pb-4" style={{ borderColor: settings.frame }}>
            <SheetTitle className="text-2xl font-bold" style={{ color: menuFont }}>Menu</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6 px-2">
            {/* Menu Tabs */}
            <TabNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              settings={settings}
            />

            {/* Tab Content */}
            <TabContent
              activeTab={activeTab}
              settings={settings}
              ieeeThemes={ieeeThemes}
              onSettingsChange={onSettingsChange}
              handleLogoUpload={handleLogoUpload}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

// **Tab Navigation Component**
function TabNavigation({ activeTab, setActiveTab, settings }: any) {
  return (
    <div className="space-y-2">
      {menuItems.map((item: any) => (
        <button
          key={item.label}
          onClick={() => setActiveTab(item.label)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors w-full mb-2 ${
            activeTab === item.label 
              ? 'shadow-md' 
              : 'hover:bg-opacity-90'
          }`}
          style={{
            //backgroundColor: settings.body,
            borderColor: settings.frame,
            color: settings.font,
            border: `2px solid ${settings.frame}`
          }}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  )
}

// **Tab Content Component**
function TabContent({ activeTab, settings, ieeeThemes, onSettingsChange, handleLogoUpload }: any) {
  if (activeTab === 'Appearance') {
    return <AppearanceTab settings={settings} ieeeThemes={ieeeThemes} onSettingsChange={onSettingsChange} />
  } else if (activeTab === 'Background') {
    return <BackgroundTab settings={settings} handleLogoUpload={handleLogoUpload} onSettingsChange={onSettingsChange} />
  } else if (activeTab === 'About') {
    return <AboutTab />
  }
  return null
}

// **Appearance Tab**
function AppearanceTab({ settings, ieeeThemes, onSettingsChange }: any) {
  return (
    <>
      {/* IEEE Themes */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">IEEE Themes</Label>
        <div className="grid grid-cols-2 gap-2">
            {ieeeThemes.map((theme: {
            name: string;
            frame: string;
            body: string;
            font: string;
            background: string;
            inner: string;
            }) => (
            <button
              key={theme.name}
              onClick={() => onSettingsChange(theme)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm shadow-sm hover:shadow-md transition-shadow w-full mb-2"
              style={{
              backgroundColor: theme.body,
              borderColor: theme.frame,
              color: theme.font,
              border: `2px solid ${theme.frame}`
              }}
            >
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.frame }} />
              <span>{theme.name}</span>
            </button>
            ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Custom Colors</Label>
        <div className="grid grid-cols-2 gap-4">
          {['Frame', 'Body', 'Font', 'Background', 'Inner'].map((key) => (
            <div key={key} className="space-y-2">
              <Label className="text-xs">{key}</Label>
              <Input
                type="color"
                value={settings[key.toLowerCase()]}
                onChange={(e) => onSettingsChange({
                  ...settings,
                  [key.toLowerCase()]: e.target.value,
                })}
                className="w-full h-8"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// **Background Tab**
interface BackgroundTabProps {
  settings: {
    backgroundImage: string | null;
    logo: string | null;
  };
  handleLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSettingsChange: (updatedSettings: any) => void;
}

export function BackgroundTab({ settings, handleLogoUpload, onSettingsChange }: BackgroundTabProps) {
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(settings.backgroundImage)
  const [logoPreview, setLogoPreview] = useState<string | null>(settings.logo)

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setBackgroundPreview(result)
        onSettingsChange({
          ...settings,
          backgroundImage: result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleLogoUpload(event)
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogoPreview(result)
        onSettingsChange({
          ...settings,
          logo: result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (type: 'background' | 'logo') => {
    if (type === 'background') {
      setBackgroundPreview(null)
      onSettingsChange({
        ...settings,
        backgroundImage: null,
      })
    } else {
      setLogoPreview(null)
      onSettingsChange({
        ...settings,
        logo: null,
      })
    }
  }

  const handleOpacityChange = (type: 'background' | 'logo', value: string) => {
    const opacity = parseFloat(value)
    if (type === 'background') {
      onSettingsChange({
        ...settings,
      })
    } else {
      onSettingsChange({
        ...settings,
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card settings={settings}>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Background Image</h3>
          <div className="space-y-4">
            <div className="aspect-video relative overflow-hidden rounded-lg border border-border">
              {backgroundPreview ? (
                <>
                  <img 
                    src={backgroundPreview} 
                    alt="Background preview" 
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                    onClick={() => removeImage('background')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-muted">
                  <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No background image</p>
                </div>
              )}
            </div>
            <div>
              <Input
                id="background-upload"
                type="file"
                accept="image/*"
                onChange={handleBackgroundUpload}
                className="hidden"
              />
              <Button variant="outline" onClick={() => document.getElementById('background-upload')?.click()} className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                {backgroundPreview ? 'Change Background' : 'Upload Background'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card settings={settings}>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Logo</h3>
          <div className="space-y-4">
            <div className="aspect-square w-40 mx-auto relative overflow-hidden rounded-lg border border-border">
              {logoPreview ? (
                <>
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="w-full h-full object-contain"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                    onClick={() => removeImage('logo')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-muted">
                  <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No logo</p>
                </div>
              )}
            </div>
            <div>
              <Input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <Button variant="outline" onClick={() => document.getElementById('logo-upload')?.click()} className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                {logoPreview ? 'Change Logo' : 'Upload Logo'}
              </Button>
            </div>
           
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
// **About Tab**
function AboutTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">About This Project</h2>
        <p className="text-sm text-muted-foreground">
          This elegant timer application was developed to provide a customizable and user-friendly experience.
          It features a range of appearance settings inspired by IEEE societies and persistent storage for your preferences.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          It was developed when I tried to find a good timer for a workshop I'm working on for the PR & Events team,
          under the <a href="https://www.ieee.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">IEEE Computer Society</a> umbrella.
        </p>
      </div>

      <div>
        <h3 className="text-md font-medium mb-1">Version</h3>
        <p className="text-sm text-muted-foreground">2.0.0</p>
      </div>

      <div>
        <h3 className="text-md font-medium mb-2">Contact Me</h3>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>Developer: Nagham Barari, copilot, V0, chatgpt.</p>
          <p>Email: <a href="mailto:naghambarari@ieee.org" className="text-primary hover:underline">naghambarari@ieee.org</a></p>
          <p>LinkedIn: <a href="https://www.linkedin.com/in/nagham-barari-23b986272/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Nagham Barari</a></p>
        </div>
      </div>

      <div className="mt-6">
        <img 
          src="/ieeecslogo.png" 
          alt="IEEE CS JU Logo" 
          className="w-full h-auto rounded-lg shadow-md" 
        />
      </div>
    </div>
  )
}