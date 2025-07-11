'use client'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import Astar from './Astar'
import buildGraph from './buildGraph'
import getDistance from './StraightDistance'

export default function MapComponent ({
  userAddress,
  userCoords,
  selectedItem: selectedItemProp
}) {
  const [markers, setMarkers] = useState([])
  const [map, setMap] = useState(null)
  const [oriDest, setOriDest] = useState(null)
  const [truckMarker, setTruckMarker] = useState(null)
  const [progress, setProgress] = useState(0)
  const [deliveryPath, setDeliveryPath] = useState([]) //list of lat/lngs to follow
  // State for polyline reference
  const [routePolyline, setRoutePolyline] = useState(null)

  // Add reroute states
  const [rerouteInput, setRerouteInput] = useState('')
  const [reroutePreviewPath, setReroutePreviewPath] = useState([])
  const [reroutePolyline, setReroutePolyline] = useState(null)
  const [showAcceptReroute, setShowAcceptReroute] = useState(false)
  const rerouteInputRef = useRef(null)
  const [rerouteLatLng, setRerouteLatLng] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [animationInterval, setAnimationInterval] = useState(null)
  // If selectedItemProp is provided, use it as the selected item
  const [selectedItem, setSelectedItem] = useState(selectedItemProp || 'item1')
  const [directionsRenderer, setDirectionsRenderer] = useState(null)
  const [reroutePreviewLabel, setReroutePreviewLabel] = useState('')
  const [truckPathIndex, setTruckPathIndex] = useState(0)

  //Warehouse Locations
  const wareHouseLocations = [
    {
      id: 0,
      district: 'Thiruvananthapuram',
      name: 'TVM Central Warehouse',
      coordinates: [8.5241, 76.9366],
      inventory: ['item1', 'item2']
    },
    {
      id: 1,
      district: 'Kollam',
      name: 'Kollam Logistics Hub',
      coordinates: [8.8932, 76.6141],
      inventory: ['item3', 'item4']
    },
    {
      id: 2,
      district: 'Pathanamthitta',
      name: 'Pathanamthitta Depot',
      coordinates: [9.2646, 76.787],
      inventory: ['item5', 'item6']
    },
    {
      id: 3,
      district: 'Alappuzha',
      name: 'Alappuzha Warehouse',
      coordinates: [9.4981, 76.3388],
      inventory: ['item7', 'item8']
    },
    {
      id: 4,
      district: 'Kottayam',
      name: 'Kottayam Storage Facility',
      coordinates: [9.5916, 76.5222],
      inventory: ['item9', 'item10']
    },
    {
      id: 5,
      district: 'Idukki',
      name: 'Idukki Hill Depot',
      coordinates: [9.8498, 77.0697],
      inventory: ['item1', 'item3']
    },
    {
      id: 6,
      district: 'Ernakulam',
      name: 'Ernakulam Mega Warehouse',
      coordinates: [9.9312, 76.2673],
      inventory: ['item2', 'item4']
    },
    {
      id: 7,
      district: 'Thrissur',
      name: 'Thrissur Distribution Center',
      coordinates: [10.5276, 76.2144],
      inventory: ['item5', 'item7']
    },
    {
      id: 8,
      district: 'Palakkad',
      name: 'Palakkad Warehouse',
      coordinates: [10.7867, 76.6548],
      inventory: ['item6', 'item8']
    },
    {
      id: 9,
      district: 'Malappuram',
      name: 'Malappuram Hub',
      coordinates: [11.0412, 76.0817],
      inventory: ['item9', 'item2']
    },
    {
      id: 10,
      district: 'Kozhikode',
      name: 'Kozhikode Coastal Storage',
      coordinates: [11.2588, 75.7804],
      inventory: ['item2', 'item10']
    },
    {
      id: 11,
      district: 'Wayanad',
      name: 'Wayanad Hilltop Depot',
      coordinates: [11.6854, 76.131],
      inventory: ['item3', 'item6']
    },
    {
      id: 12,
      district: 'Kannur',
      name: 'Kannur Northern Warehouse',
      coordinates: [11.8745, 75.3704],
      inventory: ['item4', 'item7']
    },
    {
      id: 13,
      district: 'Kasaragod',
      name: 'Kasaragod Border Hub',
      coordinates: [12.5001, 75.018],
      inventory: ['item5', 'item8']
    }
  ]

  const displayWarehouses = map => {
    //Custom icon for warehouse markers
    const warehouseIcon = {
      url: '/warehouse.png', // Path to your custom icon
      scaledSize: new google.maps.Size(20, 20) // Adjust size as neede
    }

    wareHouseLocations.forEach(location => {
      const marker = new google.maps.Marker({
        position: {
          lat: location.coordinates[0],
          lng: location.coordinates[1]
        },
        map: map,
        title: location.name,
        icon: warehouseIcon
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `<div><strong>${location.name}</strong><br>District: ${location.district}</div>`
      })

      marker.addListener('click', () => {
        infoWindow.open(map, marker)
      })
    })
  }

  function interpolatePoints (start, end, parts) {
    const latStep = (end.lat - start.lat) / (parts + 1)
    const lngStep = (end.lng - start.lng) / (parts + 1)
    const points = []

    for (let i = 1; i <= parts; i++) {
      points.push({
        lat: start.lat + latStep * i,
        lng: start.lng + lngStep * i
      })
    }

    return points
  }

  // Helper: interpolatePoints (already present)
  // Helper: get next warehouse index
  function getNextWarehouseIndex (path, progress) {
    // Each segment is 4 points (start + 3 steps), so find which warehouse the truck is heading to
    const totalSteps = (path.length - 1) * 4
    const currentStep = Math.floor((progress / 100) * totalSteps)
    // Find which segment (warehouse-to-warehouse) we're in
    const segment = Math.floor(currentStep / 4)
    return Math.min(segment + 1, path.length - 1) // next warehouse index in path
  }

  // Reroute logic
  const handleReroutePreview = async () => {
    if (progress >= 90) {
      alert('Rerouting not allowed after 90% delivery.')
      return
    }
    if (!rerouteInput || !rerouteLatLng) {
      alert('Please select a reroute destination from suggestions.')
      return
    }
    setIsPaused(true) // Pause animation

    // 1. Find the nearest warehouse to the reroute destination (this is the new delivery endpoint)
    let minDistDest = Infinity
    let nearestToDest = null
    wareHouseLocations.forEach(wh => {
      const dist = getDistance(
        rerouteLatLng.lat,
        rerouteLatLng.lng,
        wh.coordinates[0],
        wh.coordinates[1]
      )
      if (dist < minDistDest) {
        minDistDest = dist
        nearestToDest = wh
      }
    })
    if (!nearestToDest) {
      alert('No warehouse found near reroute destination.')
      setIsPaused(false)
      return
    }

    // 2. Determine reroute start warehouse index
    const segment = Math.floor(truckPathIndex / 4)
    const atWarehouse = truckPathIndex % 4 === 0
    const rerouteStartIdx = atWarehouse ? segment : segment + 1

    // 3. Check if the new destination is already in the remaining path
    let remainingPath = currentAStarPath
      ? currentAStarPath.slice(rerouteStartIdx)
      : []
    const destIdx = wareHouseLocations.findIndex(
      wh =>
        Math.abs(wh.coordinates[0] - nearestToDest.coordinates[0]) < 0.01 &&
        Math.abs(wh.coordinates[1] - nearestToDest.coordinates[1]) < 0.01
    )
    const destInPathIdx = remainingPath.indexOf(destIdx)
    if (destInPathIdx !== -1) {
      // Destination is in the remaining path
      // Build new path: from rerouteStartIdx to the destination warehouse
      const newAStarPath = currentAStarPath.slice(
        rerouteStartIdx,
        rerouteStartIdx + destInPathIdx + 1
      )
      // Interpolate deliveryPath for animation
      let animatedPath = []
      for (let i = 0; i < newAStarPath.length - 1; i++) {
        const start = wareHouseLocations[newAStarPath[i]]
        const end = wareHouseLocations[newAStarPath[i + 1]]
        animatedPath.push({
          lat: start.coordinates[0],
          lng: start.coordinates[1]
        })
        animatedPath.push(
          ...interpolatePoints(
            { lat: start.coordinates[0], lng: start.coordinates[1] },
            { lat: end.coordinates[0], lng: end.coordinates[1] },
            3
          )
        )
      }
      animatedPath.push({
        lat: wareHouseLocations[newAStarPath[newAStarPath.length - 1]]
          .coordinates[0],
        lng: wareHouseLocations[newAStarPath[newAStarPath.length - 1]]
          .coordinates[1]
      })
      setReroutePreviewPath(animatedPath)
      setReroutePreviewLabel(
        `${wareHouseLocations[currentAStarPath[rerouteStartIdx]].district} → ${
          nearestToDest.district
        }`
      )
      setShowAcceptReroute(true)
      // No reroute penalty, cost is for remaining path only
      setRerouteCost({
        distance: calculatePathDistance(animatedPath),
        warehouseCount: newAStarPath.length,
        penalty: 0,
        type: 'in-path',
        partialCost: {
          distance: 0,
          distanceCost: 0,
          warehouseCost: 0,
          total: 0
        },
        totalWithPenalty: 0,
        extraCost: 0
      })
      if (reroutePolyline) reroutePolyline.setMap(null)
      if (
        window.google &&
        window.google.maps &&
        animatedPath.length > 1 &&
        map
      ) {
        const poly = new window.google.maps.Polyline({
          path: animatedPath,
          geodesic: true,
          strokeColor: '#FFA500', // orange
          strokeOpacity: 1.0,
          strokeWeight: 4,
          map: map
        })
        setReroutePolyline(poly)
      }
      return
    }

    // 4. If not in path, compare next checkpoint vs nearest warehouse with item
    // Find original start warehouse with the item
    const originalStartIdx = currentAStarPath ? currentAStarPath[0] : null
    const originalStartWarehouse =
      originalStartIdx !== null ? wareHouseLocations[originalStartIdx] : null
    const originalStartHasItem =
      originalStartWarehouse &&
      originalStartWarehouse.inventory &&
      originalStartWarehouse.inventory.includes(selectedItem)

    // Find truck's next warehouse with the item
    let nextWarehouseWithItem = null
    if (currentAStarPath && rerouteStartIdx < currentAStarPath.length - 1) {
      for (let i = rerouteStartIdx + 1; i < currentAStarPath.length; i++) {
        const wh = wareHouseLocations[currentAStarPath[i]]
        if (wh.inventory && wh.inventory.includes(selectedItem)) {
          nextWarehouseWithItem = wh
          break
        }
      }
    }
    // If not found, fallback to nearest warehouse with item from truck's current position
    if (!nextWarehouseWithItem) {
      const truckPos = deliveryPath[truckPathIndex] || deliveryPath[0]
      let minDistItem = Infinity
      wareHouseLocations.forEach(wh => {
        if (wh.inventory && wh.inventory.includes(selectedItem)) {
          const dist = getDistance(
            truckPos.lat,
            truckPos.lng,
            wh.coordinates[0],
            wh.coordinates[1]
          )
          if (dist < minDistItem) {
            minDistItem = dist
            nextWarehouseWithItem = wh
          }
        }
      })
    }

    // Calculate both distances
    let options = []
    // Option 1: from rerouteStartIdx warehouse
    if (currentAStarPath && rerouteStartIdx < currentAStarPath.length) {
      const wh = wareHouseLocations[currentAStarPath[rerouteStartIdx]]
      options.push({
        start: wh,
        label: `${wh.district} → ${nearestToDest.district}`,
        distance: getDistance(
          wh.coordinates[0],
          wh.coordinates[1],
          nearestToDest.coordinates[0],
          nearestToDest.coordinates[1]
        ),
        type: 'from-next'
      })
    }
    // Option 2: from nearest warehouse with item
    if (nextWarehouseWithItem) {
      options.push({
        start: nextWarehouseWithItem,
        label: `${nextWarehouseWithItem.district} → ${nearestToDest.district}`,
        distance: getDistance(
          nextWarehouseWithItem.coordinates[0],
          nextWarehouseWithItem.coordinates[1],
          nearestToDest.coordinates[0],
          nearestToDest.coordinates[1]
        ),
        type: 'from-item-warehouse'
      })
    }
    if (options.length === 0) {
      alert('No valid reroute start warehouse with the item found.')
      setIsPaused(false)
      return
    }
    // Pick the shortest
    options.sort((a, b) => a.distance - b.distance)
    const best = options[0]

    // Build reroute path and label
    const bestPath = [
      {
        lat: best.start.coordinates[0],
        lng: best.start.coordinates[1]
      },
      { lat: nearestToDest.coordinates[0], lng: nearestToDest.coordinates[1] }
    ]
    setReroutePreviewPath(bestPath)
    setReroutePreviewLabel(best.label)
    setShowAcceptReroute(true)
    setRerouteCost({
      distance: best.distance,
      warehouseCount: 2,
      penalty: 50,
      type: best.type,
      partialCost: { distance: 0, distanceCost: 0, warehouseCost: 0, total: 0 },
      totalWithPenalty: 0,
      extraCost: 0
    })
    if (reroutePolyline) reroutePolyline.setMap(null)
    if (window.google && window.google.maps && bestPath.length > 1 && map) {
      const poly = new window.google.maps.Polyline({
        path: bestPath,
        geodesic: true,
        strokeColor: '#FFA500', // orange
        strokeOpacity: 1.0,
        strokeWeight: 4,
        map: map
      })
      setReroutePolyline(poly)
    }
  }

  const handleAcceptReroute = () => {
    setDeliveryPath(reroutePreviewPath)
    if (reroutePolyline) reroutePolyline.setMap(null)
    if (routePolyline) routePolyline.setMap(null) // Remove old path
    setReroutePreviewPath([])
    setShowAcceptReroute(false)
    // Reset animation state for new path
    animationIndexRef.current = 0
    setProgress(0)
    setTruckPathIndex(0)
    setIsPaused(false) // Resume animation with new path
    // Find new start and end warehouse based on reroutePreviewPath
    if (reroutePreviewPath.length === 2) {
      // Find nearest warehouse objects for start and end
      const start = reroutePreviewPath[0]
      const end = reroutePreviewPath[1]
      let startWarehouse = null
      let endWarehouse = null
      wareHouseLocations.forEach(wh => {
        if (
          !startWarehouse &&
          Math.abs(wh.coordinates[0] - start.lat) < 0.01 &&
          Math.abs(wh.coordinates[1] - start.lng) < 0.01
        )
          startWarehouse = wh
        if (
          !endWarehouse &&
          Math.abs(wh.coordinates[0] - end.lat) < 0.01 &&
          Math.abs(wh.coordinates[1] - end.lng) < 0.01
        )
          endWarehouse = wh
      })
      if (startWarehouse && endWarehouse) {
        setOriDest({ startWarehouse, endWarehouse })
      } else {
        // fallback: just use lat/lng
        setOriDest({
          startWarehouse: { coordinates: [start.lat, start.lng] },
          endWarehouse: { coordinates: [end.lat, end.lng] }
        })
      }
    }
    // Store the last reroute cost details for display in blue box
    if (rerouteCost) setLastRerouteCost(rerouteCost)
    else setLastRerouteCost(null)
  }

  const handleCancelReroute = () => {
    if (reroutePolyline) reroutePolyline.setMap(null)
    setReroutePreviewPath([])
    setShowAcceptReroute(false)
    setIsPaused(false) // Resume animation with original path
    // Resume from current animation index
    if (animationInterval) clearInterval(animationInterval)
    if (map && deliveryPath.length > 0 && truckMarker) {
      let index = animationIndexRef.current
      const interval = setInterval(() => {
        if (index >= deliveryPath.length) {
          clearInterval(interval)
          setAnimationInterval(null)
          return
        }
        truckMarker.setPosition(deliveryPath[index])
        setProgress(((index + 1) / deliveryPath.length) * 100)
        animationIndexRef.current = index
        index++
      }, 1000)
      setAnimationInterval(interval)
    }
  }

  // Track the current A* path in state for reroute logic
  const [currentAStarPath, setCurrentAStarPath] = useState([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0) // Track current step index

  // In displayAStarPath, update currentAStarPath
  // Remove the displayAStarPath function and any calls to it.
  // Remove any code that creates a google.maps.Polyline with strokeColor: '#FF0000'.
  // Only keep DirectionsRenderer for the main route and orange Polyline for reroute preview.

  useEffect(() => {
    if (typeof window === 'undefined') return

    const waitForGoogle = () => {
      if (typeof window.google === 'undefined') {
        setTimeout(waitForGoogle, 100)
      } else {
        window.initMap = () => initMap()
      }
    }

    waitForGoogle()
  }, [])

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.google &&
      document.getElementById('map')
    ) {
      initMap()
    }
  }, [])

  // Define initMap on window so Google Maps can call it
  const initMap = () => {
    const google = window.google
    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 10.8505, lng: 76.2711 },
      zoom: 8
    })

    //Having only one marker instead of multiple
    //Remove this if you want to add multiple markers

    //Setting the map to the state
    setMap(map)
    displayWarehouses(map)

    //Custom icon for destination marker (user)
    const destinationIcon = {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillColor: '#4285F4', // Blue
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: '#ffffff'
    }

    // Place destination marker if oriDest is set
    if (oriDest && oriDest.endWarehouse) {
      new window.google.maps.Marker({
        position: {
          lat: oriDest.endWarehouse.coordinates[0],
          lng: oriDest.endWarehouse.coordinates[1]
        },
        map: map,
        title: 'Destination',
        icon: destinationIcon
      })
    }

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

      const userLat = place.geometry.location.lat()
      const userLng = place.geometry.location.lng()

      const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name
      })

      // Add the marker to the markers array
      setMarkers([...markers, marker])

      let nearestWarehouse = null
      let minDistance = Infinity
      wareHouseLocations.forEach(warehouse => {
        const [lat, lng] = warehouse.coordinates
        const dist = getDistance(userLat, userLng, lat, lng)
        if (dist < minDistance) {
          minDistance = dist
          nearestWarehouse = warehouse
        }
      })

      if (nearestWarehouse) {
        console.log('Nearest Warehouse: ', nearestWarehouse)
        setOriDest(nearestWarehouse)
      }
    })

    // const graph = buildGraph(wareHouseLocations)
    // if (oriDest) {
    //   const path = Astar(graph, 0, oriDest, wareHouseLocations)
    //   displayAStarPath(map, graph, path, wareHouseLocations)
    //   console.log(path)
    // }
  }

  // Update extractPathAndCheckpoints to draw a custom polyline and remove old one
  const extractPathAndCheckpoints = (result, wareHouseLocations, path) => {
    const fullPath = []
    for (let i = 0; i < path.length - 1; i++) {
      const start = {
        lat: wareHouseLocations[path[i]].coordinates[0],
        lng: wareHouseLocations[path[i]].coordinates[1]
      }
      const end = {
        lat: wareHouseLocations[path[i + 1]].coordinates[0],
        lng: wareHouseLocations[path[i + 1]].coordinates[1]
      }
      const segment = interpolatePoints(start, end, 3) // 3 steps per segment
      fullPath.push(start, ...segment)
    }
    // Add the last warehouse
    if (path.length > 0) {
      const last = {
        lat: wareHouseLocations[path[path.length - 1]].coordinates[0],
        lng: wareHouseLocations[path[path.length - 1]].coordinates[1]
      }
      fullPath.push(last)
    }

    setDeliveryPath(fullPath)

    // Remove old polyline if exists
    if (routePolyline) {
      routePolyline.setMap(null)
    }
    // Draw new polyline
    if (window.google && window.google.maps && fullPath.length > 1 && map) {
      const polyline = new window.google.maps.Polyline({
        path: fullPath,
        geodesic: true,
        strokeColor: '#4285F4',
        strokeOpacity: 1.0,
        strokeWeight: 4,
        map: map
      })
      setRoutePolyline(polyline)
    }
  }

  // Truck animation and progress tracking
  const animationIndexRef = useRef(0) // Track current animation index

  useEffect(() => {
    if (!map || deliveryPath.length === 0 || isPaused) return

    let marker = truckMarker
    if (!marker) {
      marker = new window.google.maps.Marker({
        position: deliveryPath[0],
        map,
        icon: {
          url: '/truck-icon.png',
          scaledSize: new window.google.maps.Size(40, 40)
        },
        title: 'Delivery Truck'
      })
      setTruckMarker(marker)
    }

    let index = animationIndexRef.current || 0
    setTruckPathIndex(index) // Set initial
    const interval = setInterval(() => {
      if (index >= deliveryPath.length) {
        clearInterval(interval)
        setAnimationInterval(null)
        return
      }
      marker.setPosition(deliveryPath[index])
      setProgress(((index + 1) / deliveryPath.length) * 100)
      animationIndexRef.current = index
      setTruckPathIndex(index)
      index++
    }, 1000)

    setAnimationInterval(interval)
    return () => clearInterval(interval)
  }, [map, deliveryPath, isPaused])

  // Update the effect that draws the A* route
  useEffect(() => {
    if (!oriDest || !map) return
    if (
      oriDest.startWarehouse &&
      oriDest.endWarehouse &&
      typeof oriDest.startWarehouse.id === 'number' &&
      typeof oriDest.endWarehouse.id === 'number'
    ) {
      const graph = buildGraph(wareHouseLocations)
      const path = Astar(
        graph,
        oriDest.startWarehouse.id,
        oriDest.endWarehouse.id,
        wareHouseLocations
      )
      setCurrentAStarPath(path)
      console.log('A* Path:', path)
    }
  }, [oriDest, map])

  // When currentAStarPath changes, build the full path with 3 interpolated steps per segment, and animate the truck along this path, but do NOT draw a polyline for this path.
  useEffect(() => {
    if (!currentAStarPath || currentAStarPath.length < 2) return
    // Build warehouse coordinates array
    const warehouseCoords = currentAStarPath.map(idx => ({
      lat: wareHouseLocations[idx].coordinates[0],
      lng: wareHouseLocations[idx].coordinates[1]
    }))
    // Interpolate 3 steps per segment
    let animatedPath = []
    for (let i = 0; i < warehouseCoords.length - 1; i++) {
      const start = warehouseCoords[i]
      const end = warehouseCoords[i + 1]
      animatedPath.push(start)
      animatedPath.push(...interpolatePoints(start, end, 3))
    }
    animatedPath.push(warehouseCoords[warehouseCoords.length - 1])
    setDeliveryPath(animatedPath)
    setProgress(0)
    // Do NOT draw a polyline for this path.
    if (routePolyline) routePolyline.setMap(null)
  }, [currentAStarPath])

  // Defensive Autocomplete initialization for reroute input
  useEffect(() => {
    if (!window.google) return
    const input = rerouteInputRef.current
    if (input && input instanceof window.HTMLInputElement) {
      const autocomplete = new window.google.maps.places.Autocomplete(input)
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (place.geometry && place.geometry.location) {
          setRerouteLatLng({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          })
          setRerouteInput(place.formatted_address || place.name)
        }
      })
    }
  }, [rerouteInputRef.current])

  // In the autocomplete for the main search box, after a place is selected, find the nearest warehouse with the item (start) and the nearest warehouse to the user (end), and route from start to end.
  useEffect(() => {
    if (!window.google || !map) return
    const input = document.getElementById('search-box')
    if (!input) return
    const autocomplete = new window.google.maps.places.Autocomplete(input)
    autocomplete.bindTo('bounds', map)
    autocomplete.addListener('place_changed', async () => {
      const place = autocomplete.getPlace()
      if (!place.geometry || !place.geometry.location) {
        window.alert("No details available for input: '" + place.name + "'")
        return
      }
      const userLat = place.geometry.location.lat()
      const userLng = place.geometry.location.lng()
      // Find the nearest warehouse to the user (end)
      let minDistEnd = Infinity
      let nearestToUser = null
      wareHouseLocations.forEach(warehouse => {
        const [lat, lng] = warehouse.coordinates
        const dist = Math.sqrt((userLat - lat) ** 2 + (userLng - lng) ** 2)
        if (dist < minDistEnd) {
          minDistEnd = dist
          nearestToUser = warehouse
        }
      })
      // Find the nearest warehouse to the user that contains the item (start)
      let minDistStart = Infinity
      let nearestWithItem = null
      wareHouseLocations.forEach(warehouse => {
        if (warehouse.inventory && warehouse.inventory.includes(selectedItem)) {
          const [lat, lng] = warehouse.coordinates
          const dist = Math.sqrt((userLat - lat) ** 2 + (userLng - lng) ** 2)
          if (dist < minDistStart) {
            minDistStart = dist
            nearestWithItem = warehouse
          }
        }
      })
      if (!nearestWithItem) {
        window.alert(`No warehouse found with ${selectedItem}.`)
        return
      }
      // Route from nearestWithItem to nearestToUser
      setOriDest({
        startWarehouse: nearestWithItem,
        endWarehouse: nearestToUser
      })
      setTimeout(() => {
        if (deliveryPath.length > 0) {
          const bounds = new window.google.maps.LatLngBounds()
          deliveryPath.forEach(p => bounds.extend(p))
          map.fitBounds(bounds)
        }
      }, 500)
    })
  }, [map, deliveryPath, selectedItem])

  // Update the effect that draws the route to use startWarehouse and endWarehouse
  useEffect(() => {
    if (!oriDest || !map) return
    if (oriDest.startWarehouse && oriDest.endWarehouse) {
      const origin = {
        lat: oriDest.startWarehouse.coordinates[0],
        lng: oriDest.startWarehouse.coordinates[1]
      }
      const destination = {
        lat: oriDest.endWarehouse.coordinates[0],
        lng: oriDest.endWarehouse.coordinates[1]
      }
      if (window.google && window.google.maps) {
        // Remove previous DirectionsRenderer
        if (directionsRenderer) directionsRenderer.setMap(null)
        const newDirectionsRenderer = new window.google.maps.DirectionsRenderer(
          {
            suppressMarkers: true
          }
        )
        newDirectionsRenderer.setMap(map)
        setDirectionsRenderer(newDirectionsRenderer)
        const directionsService = new window.google.maps.DirectionsService()
        directionsService.route(
          {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING
          },
          (result, status) => {
            if (status === 'OK') {
              newDirectionsRenderer.setDirections(result)
              // Use currentAStarPath for animation if available
              let warehouseCoords = []
              if (currentAStarPath && currentAStarPath.length > 1) {
                warehouseCoords = currentAStarPath.map(idx => ({
                  lat: wareHouseLocations[idx].coordinates[0],
                  lng: wareHouseLocations[idx].coordinates[1]
                }))
              } else if (
                oriDest &&
                oriDest.startWarehouse &&
                oriDest.endWarehouse
              ) {
                warehouseCoords.push({
                  lat: oriDest.startWarehouse.coordinates[0],
                  lng: oriDest.startWarehouse.coordinates[1]
                })
                warehouseCoords.push({
                  lat: oriDest.endWarehouse.coordinates[0],
                  lng: oriDest.endWarehouse.coordinates[1]
                })
              }
              // Interpolate 3 steps per segment
              let animatedPath = []
              for (let i = 0; i < warehouseCoords.length - 1; i++) {
                const start = warehouseCoords[i]
                const end = warehouseCoords[i + 1]
                animatedPath.push(start)
                animatedPath.push(...interpolatePoints(start, end, 3))
              }
              animatedPath.push(warehouseCoords[warehouseCoords.length - 1])
              // In the DirectionsRenderer callback (status === 'OK'), remove setDeliveryPath(animatedPath) and setProgress(0). Only add markers, do not touch deliveryPath here.
              // Add custom start marker (warehouse)
              new window.google.maps.Marker({
                position: origin,
                map: map,
                title: 'Warehouse',
                icon: {
                  url: '/warehouse.png',
                  scaledSize: new window.google.maps.Size(20, 20)
                }
              })
              // Add custom destination marker (user)
              new window.google.maps.Marker({
                position: destination,
                map: map,
                title: 'Destination',
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: '#4285F4',
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: '#ffffff'
                }
              })
            } else {
              console.error('Directions request failed due to ' + status)
            }
          }
        )
      }
    }
  }, [oriDest, map])

  // If userCoords is provided, trigger delivery logic on mount
  useEffect(() => {
    if (userCoords && selectedItemProp) {
      // Find the nearest warehouse to the user (end)
      let minDistEnd = Infinity
      let nearestToUser = null
      wareHouseLocations.forEach(warehouse => {
        const [lat, lng] = warehouse.coordinates
        const dist = Math.sqrt(
          (userCoords.lat - lat) ** 2 + (userCoords.lng - lng) ** 2
        )
        if (dist < minDistEnd) {
          minDistEnd = dist
          nearestToUser = warehouse
        }
      })
      // Find the nearest warehouse to the user that contains the item (start)
      let minDistStart = Infinity
      let nearestWithItem = null
      wareHouseLocations.forEach(warehouse => {
        if (
          warehouse.inventory &&
          warehouse.inventory.includes(selectedItemProp)
        ) {
          const [lat, lng] = warehouse.coordinates
          const dist = Math.sqrt(
            (userCoords.lat - lat) ** 2 + (userCoords.lng - lng) ** 2
          )
          if (dist < minDistStart) {
            minDistStart = dist
            nearestWithItem = warehouse
          }
        }
      })
      if (!nearestWithItem) {
        window.alert(`No warehouse found with ${selectedItemProp}.`)
        return
      }
      // Route from nearestWithItem to nearestToUser
      setOriDest({
        startWarehouse: nearestWithItem,
        endWarehouse: nearestToUser
      })
    }
  }, [userCoords, selectedItemProp])

  // Helper to calculate distance between two points
  function getDistanceKm (a, b) {
    const R = 6371
    const dLat = ((b.lat - a.lat) * Math.PI) / 180
    const dLng = ((b.lng - a.lng) * Math.PI) / 180
    const lat1 = (a.lat * Math.PI) / 180
    const lat2 = (b.lat * Math.PI) / 180
    const aVal =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal))
    return R * c
  }

  // Cost calculation for a path (array of warehouse indices)
  function calculatePathCost (pathIdxArr, warehouseList) {
    if (!pathIdxArr || pathIdxArr.length < 2)
      return { distance: 0, warehouseCost: 0, total: 0 }
    let distance = 0
    for (let i = 0; i < pathIdxArr.length - 1; i++) {
      const a = warehouseList[pathIdxArr[i]].coordinates
      const b = warehouseList[pathIdxArr[i + 1]].coordinates
      distance += getDistanceKm(
        { lat: a[0], lng: a[1] },
        { lat: b[0], lng: b[1] }
      )
    }
    const warehouseCost = pathIdxArr.length * 10
    const distanceCost = distance * 0.1
    const total = warehouseCost + distanceCost
    return { distance, warehouseCost, distanceCost, total }
  }

  // State for reroute cost
  const [rerouteCost, setRerouteCost] = useState(null)

  // Add state to track last reroute cost details
  const [lastRerouteCost, setLastRerouteCost] = useState(null)

  // Calculate and display cost for the current path
  const originalCost = calculatePathCost(currentAStarPath, wareHouseLocations)

  // Helper to get the index of the truck's current position in the A* path
  function getCurrentWarehouseIndex () {
    // Find the closest warehouse index in currentAStarPath to the truck's current position
    if (
      !deliveryPath ||
      deliveryPath.length === 0 ||
      !currentAStarPath ||
      currentAStarPath.length === 0
    )
      return 0
    // Find the closest point in deliveryPath to the truckMarker's position
    let truckPos = null
    if (truckMarker) {
      const pos = truckMarker.getPosition()
      if (pos) truckPos = { lat: pos.lat(), lng: pos.lng() }
    }
    // If no marker, assume at start
    if (!truckPos) return 0
    // Find the closest warehouse index
    let minDist = Infinity
    let closestIdx = 0
    currentAStarPath.forEach((idx, i) => {
      const wh = wareHouseLocations[idx]
      const dist = getDistanceKm(truckPos, {
        lat: wh.coordinates[0],
        lng: wh.coordinates[1]
      })
      if (dist < minDist) {
        minDist = dist
        closestIdx = i
      }
    })
    return closestIdx
  }

  // When reroutePreviewPath is set, calculate reroute cost
  useEffect(() => {
    if (
      showAcceptReroute &&
      reroutePreviewPath &&
      reroutePreviewPath.length > 1
    ) {
      const previewIdxArr = reroutePreviewPath
        .map(point => {
          const wh = wareHouseLocations.find(
            w =>
              Math.abs(w.coordinates[0] - point.lat) < 0.01 &&
              Math.abs(w.coordinates[1] - point.lng) < 0.01
          )
          return wh ? wh.id : null
        })
        .filter(idx => idx !== null)
      const previewCost = calculatePathCost(previewIdxArr, wareHouseLocations)
      const newDestIdx = previewIdxArr[previewIdxArr.length - 1]
      const isOnOriginalPath = currentAStarPath.includes(newDestIdx)
      let extraCost = 0
      let totalWithPenalty = 0
      let partialCost = {
        distance: 0,
        warehouseCost: 0,
        distanceCost: 0,
        total: 0
      }
      if (!isOnOriginalPath) {
        // Calculate cost for the portion already traveled
        const currentIdx = getCurrentWarehouseIndex()
        const traveledPath = currentAStarPath.slice(0, currentIdx + 1)
        partialCost = calculatePathCost(traveledPath, wareHouseLocations)
        extraCost = previewCost.total + partialCost.total
        totalWithPenalty = previewCost.total + partialCost.total + 50
      } else {
        extraCost = 0
        totalWithPenalty = previewCost.total + 50
      }
      setRerouteCost({
        ...previewCost,
        extraCost,
        penalty: 50,
        totalWithPenalty,
        isOnOriginalPath,
        partialCost
      })
    } else {
      setRerouteCost(null)
    }
  }, [
    showAcceptReroute,
    reroutePreviewPath,
    currentAStarPath,
    deliveryPath,
    truckMarker
  ])

  // Helper to calculate total distance of a path
  function calculatePathDistance (path) {
    let dist = 0
    for (let i = 0; i < path.length - 1; i++) {
      dist += getDistance(
        path[i].lat,
        path[i].lng,
        path[i + 1].lat,
        path[i + 1].lng
      )
    }
    return dist
  }

  // Helper to safely format numbers
  function safeToFixed (val, digits = 2) {
    return typeof val === 'number' && !isNaN(val) ? val.toFixed(digits) : 'N/A'
  }

  // Helper to safely format nested numbers
  function safeNestedToFixed (obj, path, digits = 2) {
    try {
      let val = obj
      for (const key of path) {
        if (val == null) return 'N/A'
        val = val[key]
      }
      return typeof val === 'number' && !isNaN(val)
        ? val.toFixed(digits)
        : 'N/A'
    } catch {
      return 'N/A'
    }
  }

  // Helper to safely get nested property
  function get (obj, path) {
    return path.reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      obj
    )
  }

  return (
    <div className='w-full'>
      <h1 className='text-2xl font-bold text-center mb-6 font-mono text-blue-700 tracking-wide'>
        Delivery Route Simulator
      </h1>
      {/* Input fields group */}
      <div className='mb-4 flex flex-col md:flex-row items-center justify-center gap-4'>
        {/* Remove item select and search box */}
      </div>
      <div className='flex flex-col md:flex-row gap-4 mb-4 items-center justify-center bg-gray-50 p-4 rounded-lg shadow-sm'>
        {/* Only reroute input and buttons */}
        <div className='flex items-center gap-2 w-full md:w-1/2'>
          <input
            type='text'
            ref={rerouteInputRef}
            value={rerouteInput}
            onChange={e => setRerouteInput(e.target.value)}
            placeholder='Enter reroute destination...'
            className='w-full px-4 py-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-orange-400 transition'
            disabled={progress >= 90}
          />
          <button
            className='px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition'
            disabled={progress >= 90}
            onClick={handleReroutePreview}
          >
            Reroute
          </button>
          {showAcceptReroute && (
            <>
              <button
                className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-2 transition'
                onClick={handleAcceptReroute}
              >
                Accept Reroute
              </button>
              <button
                className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ml-2 transition'
                onClick={handleCancelReroute}
                title='Cancel reroute'
              >
                ✕
              </button>
            </>
          )}
        </div>
      </div>
      {/* Show last and next checkpoint */}
      {currentAStarPath && currentAStarPath.length > 1 && (
        <div className='mb-2 flex flex-col items-center justify-center'>
          <div className='bg-yellow-50 rounded-lg px-4 py-2 shadow text-yellow-900 font-mono text-base flex gap-4'>
            {(() => {
              const segment = Math.floor(truckPathIndex / 4)
              const atWarehouse = truckPathIndex % 4 === 0
              if (atWarehouse) {
                const idx = currentAStarPath[segment]
                return (
                  <span>
                    <b>Reached:</b> {wareHouseLocations[idx]?.district || 'N/A'}
                  </span>
                )
              } else {
                const idxA = currentAStarPath[segment]
                const idxB = currentAStarPath[segment + 1]
                return (
                  <span>
                    <b>Between:</b>{' '}
                    {wareHouseLocations[idxA]?.district || 'N/A'} →{' '}
                    {wareHouseLocations[idxB]?.district || 'N/A'}
                  </span>
                )
              }
            })()}
          </div>
        </div>
      )}
      {showAcceptReroute &&
        reroutePreviewPath &&
        reroutePreviewPath.length > 1 && (
          <div className='flex flex-wrap items-center justify-center mb-4 p-2 bg-orange-50 rounded-xl shadow text-orange-800 font-mono text-lg border border-orange-300'>
            {reroutePreviewPath.map((point, i) => {
              // Try to find the warehouse for this point
              const wh = wareHouseLocations.find(
                w =>
                  Math.abs(w.coordinates[0] - point.lat) < 0.01 &&
                  Math.abs(w.coordinates[1] - point.lng) < 0.01
              )
              return (
                <span key={i} className='flex items-center'>
                  {wh
                    ? wh.district
                    : `${point.lat.toFixed(2)},${point.lng.toFixed(2)}`}
                  {i < reroutePreviewPath.length - 1 && (
                    <span className='mx-2 text-orange-400'>&#8594;</span>
                  )}
                </span>
              )
            })}
          </div>
        )}
      {showAcceptReroute && reroutePreviewLabel && (
        <div className='flex flex-wrap items-center justify-center mb-4 p-2 bg-orange-50 rounded-xl shadow text-orange-800 font-mono text-lg border border-orange-300'>
          <span className='flex items-center'>{reroutePreviewLabel}</span>
        </div>
      )}
      {currentAStarPath && currentAStarPath.length > 1 && (
        <div className='mb-2 flex flex-col items-center justify-center'>
          <div className='bg-blue-100 rounded-lg px-4 py-2 shadow text-blue-900 font-mono text-base'>
            <div>
              <b>Current Route Cost</b>
            </div>
            {lastRerouteCost && (
              <>
                <div className='text-xs text-blue-700 mb-1'>
                  Rerouting Charges:
                </div>
                {!lastRerouteCost.isOnOriginalPath &&
                  lastRerouteCost.partialCost &&
                  lastRerouteCost.partialCost.total > 0 && (
                    <>
                      <div>
                        Cost due to travel already made in original path
                        (distance + warehouse):
                      </div>
                      <div>
                        Distance:{' '}
                        {safeNestedToFixed(lastRerouteCost, [
                          'partialCost',
                          'distance'
                        ])}
                        × ₹0.1 = ₹
                        {safeNestedToFixed(lastRerouteCost, [
                          'partialCost',
                          'distanceCost'
                        ])}
                      </div>
                      <div>
                        Warehouses:{' '}
                        {safeNestedToFixed(lastRerouteCost, [
                          'partialCost',
                          'distance'
                        ])}
                        × ₹10 = ₹
                        {safeNestedToFixed(lastRerouteCost, [
                          'partialCost',
                          'warehouseCost'
                        ])}
                      </div>
                      <div className='mb-1'>
                        Subtotal: ₹
                        {safeToFixed(
                          (get(lastRerouteCost, [
                            'partialCost',
                            'distanceCost'
                          ]) || 0) +
                            (get(lastRerouteCost, [
                              'partialCost',
                              'warehouseCost'
                            ]) || 0)
                        )}
                      </div>
                    </>
                  )}
                <div>Reroute Penalty: ₹{lastRerouteCost.penalty}</div>
              </>
            )}
            <div>
              Distance: {safeToFixed(originalCost.distance)} km × ₹0.1 = ₹
              {safeToFixed(originalCost.distanceCost)}
            </div>
            <div>
              Warehouses: {currentAStarPath.length} × ₹10 = ₹
              {safeToFixed(originalCost.warehouseCost)}
            </div>
            <div className='font-bold'>
              Total: ₹
              {lastRerouteCost
                ? lastRerouteCost.totalWithPenalty.toFixed(2)
                : originalCost.total.toFixed(2)}
            </div>
          </div>
        </div>
      )}
      {showAcceptReroute && rerouteCost && (
        <div className='mb-2 flex flex-col items-center justify-center'>
          <div className='bg-orange-100 rounded-lg px-4 py-2 shadow text-orange-900 font-mono text-base border border-orange-300'>
            <div>
              <b>Reroute Cost</b>
            </div>
            {!rerouteCost.isOnOriginalPath &&
              rerouteCost.partialCost &&
              rerouteCost.partialCost.total > 0 && (
                <>
                  <div className='text-xs text-orange-700 mb-1'>
                    Cost due to travel already made in original path (distance +
                    warehouse):
                  </div>
                  <div>
                    Distance:{' '}
                    {safeNestedToFixed(rerouteCost, [
                      'partialCost',
                      'distance'
                    ])}
                    km × ₹0.1 = ₹
                    {safeNestedToFixed(rerouteCost, [
                      'partialCost',
                      'distanceCost'
                    ])}
                  </div>
                  <div>
                    Warehouses:{' '}
                    {safeNestedToFixed(rerouteCost, [
                      'partialCost',
                      'distance'
                    ])}
                    × ₹10 = ₹
                    {safeNestedToFixed(rerouteCost, [
                      'partialCost',
                      'warehouseCost'
                    ])}
                  </div>
                  <div className='mb-1'>
                    Subtotal: ₹
                    {safeToFixed(
                      (get(rerouteCost, ['partialCost', 'distanceCost']) || 0) +
                        (get(rerouteCost, ['partialCost', 'warehouseCost']) ||
                          0)
                    )}
                  </div>
                </>
              )}
            <div>
              Distance: {safeToFixed(rerouteCost.distance)} km × ₹0.1 = ₹
              {safeToFixed(rerouteCost.distanceCost)}
            </div>
            <div>
              Warehouses: {safeToFixed(rerouteCost.distance)}× ₹10 = ₹
              {safeToFixed(rerouteCost.warehouseCost)}
            </div>
            <div>Reroute Penalty: ₹{rerouteCost.penalty}</div>
            <div className='font-bold'>
              Total with Penalty: ₹{safeToFixed(rerouteCost.totalWithPenalty)}
            </div>
            <div className='text-xs mt-1'>
              Additional cost: ₹{safeToFixed(rerouteCost.extraCost)}{' '}
              {rerouteCost.extraCost <= 0 ? '(No extra distance)' : ''}
            </div>
          </div>
        </div>
      )}
      {currentAStarPath && currentAStarPath.length > 1 && (
        <div className='flex flex-wrap items-center justify-center mb-4 p-2 bg-blue-50 rounded-xl shadow text-blue-800 font-mono text-lg'>
          {currentAStarPath.map((idx, i) => (
            <span key={idx} className='flex items-center'>
              {wareHouseLocations[idx].district}
              {i < currentAStarPath.length - 1 && (
                <span className='mx-2 text-blue-400'>&#8594;</span>
              )}
            </span>
          ))}
        </div>
      )}
      {/* Map Container */}
      <div
        id='map'
        className='w-full border-2 border-blue-200 rounded-xl shadow-lg mb-6'
        style={{
          height: '400px',
          minWidth: '100%',
          borderRadius: '16px'
        }}
      ></div>
      {/* Progress Bar */}
      <div className='w-full bg-gray-200 h-3 rounded-full mt-2'>
        <div
          className='bg-green-600 h-3 rounded-full transition-all duration-500'
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className='text-xs text-gray-700 mt-1 text-center'>
        Delivery Progress: {Math.floor(progress)}%
      </p>
    </div>
  )
}
