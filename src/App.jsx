import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import RecentlyPlayed from './components/RecentlyPlayed'

function App() {

  return (

      <main className="min-h-screen bg-violet-950 flex flex-col gap-8 p-4 md:p-6 lg:p-8">
        <div className="bg-indigo-950 p-10 flex justify-center">
          <h1 className="text-4xl font-bold">Jamming Playlist App</h1>
        </div>
          
        <RecentlyPlayed />

        <div className="flex gap-6">
          <div className="container mx-auto bg-green-950 flex justify-center p-10 h-150">
            <h2 className="text-2xl font-bold">Your Playlist</h2>
          </div>

          <div className="container mx-auto bg-fuchsia-950 flex justify-center p-10 h-150">
            <h2 className="text-2xl font-bold">Playing now</h2>
          </div>
        </div>
      </main>
  )
}

export default App
