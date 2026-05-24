import { useGameStore } from './store/gameStore'
import { useGameLoop } from './hooks/useGameLoop'
import { useGameAudio } from './hooks/useGameAudio'
import { TitleScreen } from './components/TitleScreen'
import { TimeBar } from './components/TimeBar'
import { DesireMeters } from './components/DesireMeters'
import { Timeline } from './components/Timeline'
import { ActionButtons } from './components/ActionButtons'
import { Character } from './components/Character'
import { EndScreen } from './components/EndScreen'
import { AudioControls } from './components/AudioControls'

function App() {
  const status = useGameStore((s) => s.status)
  useGameLoop()
  useGameAudio()

  if (status === 'title') {
    return (
      <div className="min-h-svh flex relative">
        <AudioControls />
        <TitleScreen />
      </div>
    )
  }

  return (
    <div className="min-h-svh w-full flex flex-col p-3 md:p-4 relative">
      <AudioControls />
      {/* Top: time bar + meters */}
      <header className="space-y-3 mb-3">
        <TimeBar />
        <DesireMeters />
      </header>

      {/* Main: timeline (left) + character (right) */}
      <main className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-3 flex-1 min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          <div className="flex-1 min-h-0">
            <Timeline />
          </div>
          <ActionButtons />
        </div>
        <div className="hidden lg:block">
          <Character />
        </div>
      </main>

      {/* Mobile character on bottom right floating */}
      <div className="lg:hidden fixed bottom-3 right-3 w-24 h-24 pointer-events-none">
        <Character />
      </div>

      {(status === 'gameover' || status === 'clear') && (
        <EndScreen variant={status} />
      )}
    </div>
  )
}

export default App
