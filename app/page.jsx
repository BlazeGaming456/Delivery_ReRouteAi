import GoogleMapsScript from '../components/GoogleMapsScript'
import MapComponent from '../components/MapComponent'

export default function Page () {
  return (
    <>
      <GoogleMapsScript />
      <div className='min-h-screen'>
        <h1 className='text-center mt-6 text-xl font-mono font-bold'>
          My Google Map
        </h1>
        <MapComponent />
      </div>
    </>
  )
}
