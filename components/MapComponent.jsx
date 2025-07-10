'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function MapComponent () {
  const [markers, setMarkers] = useState([])
  const [map, setMap] = useState(null)

  const wareHouseLocations = [
    {
      district: 'Thiruvananthapuram',
      name: 'TVM Central Warehouse',
      coordinates: [8.5241, 76.9366]
    },
    {
      district: 'Kollam',
      name: 'Kollam Logistics Hub',
      coordinates: [8.8932, 76.6141]
    },
    {
      district: 'Pathanamthitta',
      name: 'Pathanamthitta Depot',
      coordinates: [9.2646, 76.787]
    },
    {
      district: 'Alappuzha',
      name: 'Alappuzha Warehouse',
      coordinates: [9.4981, 76.3388]
    },
    {
      district: 'Kottayam',
      name: 'Kottayam Storage Facility',
      coordinates: [9.5916, 76.5222]
    },
    {
      district: 'Idukki',
      name: 'Idukki Hill Depot',
      coordinates: [9.8498, 77.0697]
    },
    {
      district: 'Ernakulam',
      name: 'Ernakulam Mega Warehouse',
      coordinates: [9.9312, 76.2673]
    },
    {
      district: 'Thrissur',
      name: 'Thrissur Distribution Center',
      coordinates: [10.5276, 76.2144]
    },
    {
      district: 'Palakkad',
      name: 'Palakkad Warehouse',
      coordinates: [10.7867, 76.6548]
    },
    {
      district: 'Malappuram',
      name: 'Malappuram Hub',
      coordinates: [11.0412, 76.0817]
    },
    {
      district: 'Kozhikode',
      name: 'Kozhikode Coastal Storage',
      coordinates: [11.2588, 75.7804]
    },
    {
      district: 'Wayanad',
      name: 'Wayanad Hilltop Depot',
      coordinates: [11.6854, 76.131]
    },
    {
      district: 'Kannur',
      name: 'Kannur Northern Warehouse',
      coordinates: [11.8745, 75.3704]
    },
    {
      district: 'Kasaragod',
      name: 'Kasaragod Border Hub',
      coordinates: [12.5001, 75.018]
    }
  ]

  useEffect(() => {
    // Define initMap on window so Google Maps can call it
    window.initMap = () => {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 10.8505, lng: 76.2711 },
        zoom: 8
      })

      //Custom icon for warehouse markers
      const warehouseIcon = {
        url: '/warehouse.png', // Path to your custom icon
        scaledSize: new google.maps.Size(30, 30) // Adjust size as needed
      }

      wareHouseLocations.forEach(location => {
        const marker = new google.maps.Marker({
          position: {
            lat: location.coordinates[0],
            lng: location.coordinates[1]
          },
          map: map,
          title: location.name,
          icon: warehouseIcon // Use custom icon for warehouse markers
        })

        const infoWindow = new google.maps.InfoWindow({
          content: `<div><strong>${location.name}</strong><br>District: ${location.district}</div>`
        })

        marker.addListener('click', () => {
          infoWindow.open(map, marker)
        })
      })

      //Having only one marker instead of multiple
      //Remove this if you want to add multiple markers
      const newMarkers = []

      //Setting the map to the state
      setMap(map)

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
