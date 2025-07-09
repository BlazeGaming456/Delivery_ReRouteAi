'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function MapComponent () {
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState(null);
  useEffect(() => {
    // Define initMap on window so Google Maps can call it
    window.initMap = () => {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 20.5937, lng: 78.9629 }, // Example: India
        zoom: 5
      })

      //Having only one marker instead of multiple
      //Remove this if you want to add multiple markers
      const newMarkers = []

      //Setting the map to the state
      setMap(map);

      //Click event to place marker
      //This will update the marker position and title based on click location
      map.addListener('click', async e => {
        const lat = e.latLng.lat()
        const lng = e.latLng.lng()
        const title = `Location: ${lat.toFixed(2)}, ${lng.toFixed(2)}`

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: title
        })

        newMarkers.push(marker)
        setMarkers([...newMarkers])

        if (newMarkers.length === 2) {
          const origin = newMarkers[0].getPosition()
          const destination = newMarkers[1].getPosition()

          try {
            const res = await axios.post('/api/distance', {
              origin: { lat: origin.lat(), lng: origin.lng() },
              destination: { lat: destination.lat(), lng: destination.lng() }
            })
            const { distance, duration } = res.data
            alert(`Distance: ${distance}, Duration: ${duration}`)
          } catch (error) {
            console.log('Error: ', error.message)
          }

          newMarkers.forEach(m => setMap(null))
          newMarkers.length = 0
          setMarkers([])
        }

        // if (newMarkers.length > 2) {
        //   newMarkers.forEach(m => setMap(null))
        //   newMarkers.length = 0
        //   setMarkers([])
        // }
      })

      //Implementing a search box
      const input = document.getElementById('search-box')
      const autocomplete = new google.maps.places.Autocomplete(input)
      autocomplete.bindTo('bounds', map)
      autocomplete.addListener('place_changed', async () => {
        const place = autocomplete.getPlace()
        if (!place.geometry || !place.geometry.location) {
          // User entered the name of a Place that was not suggested
          window.alert("No details available for input: '" + place.name + "'")
          return
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport)
        } else {
          map.setCenter(place.geometry.location)
          map.setZoom(17)
        }

        const marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          title: place.name
        })

        // Add the marker to the markers array
        newMarkers.push(marker)
        setMarkers([...newMarkers])

        if (newMarkers.length === 2) {
          const origin = newMarkers[0].getPosition()
          const destination = newMarkers[1].getPosition()

          try {
            const res = await axios.post('/api/distance', {
              origin: { lat: origin.lat(), lng: origin.lng() },
              destination: { lat: destination.lat(), lng: destination.lng() }
            })
            const { distance, duration } = res.data
            alert(`Distance: ${distance}, Duration: ${duration}`)
          } catch (error) {
            console.log('Error: ', error.message)
          }

          newMarkers.forEach(m => setMap(null))
          newMarkers.length = 0
          setMarkers([])
        }

        // if (newMarkers.length > 2) {
        //   newMarkers.forEach(m => setMap(null))
        //   newMarkers.length = 0
        //   setMarkers([])
        // }

        // Set marker position and title
        marker.setPosition(place.geometry.location)
        marker.setTitle(place.name)
      })

      //   //Example locations to add markers
      //   const locations = [
      //     { lat: 28.6139, lng: 77.209, title: 'Delhi' },
      //     { lat: 19.076, lng: 72.8777, title: 'Mumbai' },
      //     { lat: 13.0827, lng: 80.2707, title: 'Chennai' }
      //   ]

      //   locations.forEach(loc => {
      //     new google.maps.Marker({
      //       position: { lat: loc.lat, lng: loc.lng },
      //       map: map,
      //       title: loc.title
      //     })
      //   })
    }
  }, [])

  return (
    <div className='w-full flex flex-col items-center justify-center mt-6'>
      <div className='w-3/4 border rounded-lg p-3'>
        {/* Search Box */}
        <input
          id='search-box'
          type='text'
          placeholder='Search for a place...'
          className='w-1/2 px-4 mb-2 py-2 border rounded shadow'
        />
        {/* Map Container */}
        <div
          id='map'
          style={{
            height: '400px',
            width: '100%',
            borderRadius: '10px'
          }}
        ></div>
      </div>
    </div>
  )
}
