import React, { useEffect, useState } from 'react'
import axios from 'axios'

const LiveDistanceTime = (props) => {
  const [liveLocation, setLiveLocation] = useState(null)
  const [distanceTime, setDistanceTime] = useState({ distance: '', time: '' })

  useEffect(() => {
    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLiveLocation({ latitude, longitude })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }

    updateLocation()
    const intervalId = setInterval(updateLocation, 10000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (liveLocation) {
      const fetchDistanceTime = async () => {
        try {
          const response = await axios.get('https://maps.gomaps.pro/maps/api/distancematrix/json', {
            params: {
              origins: `${liveLocation.latitude},${liveLocation.longitude}`,
              destinations: props.ride.destination,
              key: import.meta.env.VITE_GOMAPS_PRO_API_KEY
            }
          })
          const data = response.data.rows[0].elements[0]
          setDistanceTime({
            distance: data.distance.text,
            time: data.duration.text
          })
        } catch (error) {
          console.error('Error fetching distance and time:', error)
        }
      }

      fetchDistanceTime()
    }
  }, [liveLocation, props.ride.destination])

  return (
    <div>
      <p>{distanceTime.distance}</p>
      <p>{distanceTime.time}</p>
    </div>
  )
}

export default LiveDistanceTime