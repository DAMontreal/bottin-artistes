import React, { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://sesxicapgrnjrebgidnn.supabase.co"
const supabaseKey = "public-anon-key"
const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
  const [showCalendar, setShowCalendar] = useState(false)
  const [artists, setArtists] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    async function fetchArtistsAndEvents() {
      const { data: artistData } = await supabase
        .from("artists")
        .select("*")
        .eq("validated", true)

      setArtists(artistData)

      const artistIds = artistData.map((a) => a.id)
      const { data: eventData } = await supabase
        .from("events")
        .select("*")
        .in("artist_id", artistIds)

      const formattedEvents = eventData.map((event) => ({
        title: event.title,
        start: event.date,
      }))

      setEvents(formattedEvents)
    }

    fetchArtistsAndEvents()
  }, [])

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Le Bottin des Artistes</h1>
      <button onClick={() => setShowCalendar(!showCalendar)} style={{ marginBottom: "20px" }}>
        {showCalendar ? "Voir le bottin" : "Voir le calendrier"}
      </button>

      {showCalendar ? (
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
        />
      ) : (
        <div>
          {artists.map((artist) => (
            <div key={artist.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
              <h2>{artist.name}</h2>
              <p>{artist.discipline}</p>
              <p>{artist.bio_fr}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
