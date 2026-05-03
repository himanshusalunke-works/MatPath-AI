import { useState, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { GoogleMap, useJsApiLoader, InfoWindow } from '@react-google-maps/api'
import { MapPinIcon, MagnifyingGlassIcon, ArrowRightIcon, GlobeAsiaAustraliaIcon } from '@heroicons/react/24/outline'
import api from '../services/api'

const libraries = ['marker']

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '24px'
}

const defaultCenter = {
  lat: 18.5204, // Pune center
  lng: 73.8567
}

const mapOptions = {
  mapId: 'DEMO_MAP_ID', // Required for AdvancedMarkerElement
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "poi",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "transit",
      "stylers": [{ "visibility": "off" }]
    }
  ]
}

const AdvancedMarker = ({ map, position, onClick, iconUrl, title }) => {
  const markerRef = useRef(null)

  useEffect(() => {
    if (!map || !position || !window.google?.maps?.marker?.AdvancedMarkerElement) return

    let content = undefined
    if (iconUrl) {
      const img = document.createElement('img')
      img.src = typeof iconUrl === 'string' ? iconUrl : iconUrl.url
      img.style.width = '32px'
      img.style.height = '32px'
      content = img
    }

    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      map,
      position,
      title,
      content
    })

    if (onClick) {
      const listener = marker.addListener('click', onClick)
      return () => {
        listener.remove()
        marker.map = null
      }
    }

    markerRef.current = marker

    return () => {
      if (markerRef.current) {
        markerRef.current.map = null
      }
    }
  }, [map, position, iconUrl, title, onClick])

  return null
}

export default function MapPage() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBooth, setSelectedBooth] = useState(null)
  const [map, setMap] = useState(null)
  const [userLocation, setUserLocation] = useState(null)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  })

  const [assignedBooth, setAssignedBooth] = useState(null)

  useEffect(() => {
    const fetchBooths = async () => {
      try {
        const response = await api.get('/booth')
        const allBooths = response.data.booths || []
        
        if (allBooths.length > 0) {
          const user = JSON.parse(localStorage.getItem('matpath_user') || '{}')
          const epicId = user.profile?.epicId || 'DEFAULT_USER'
          const userAC = user.profile?.assemblyConstituency || ''
          
          // Filter booths that match the user's AC (e.g., if userAC contains "Kothrud", match "Kothrud" booths)
          let eligibleBooths = allBooths.filter(b => b.ac && userAC.toLowerCase().includes(b.ac.toLowerCase()))
          
          // Fallback to all booths if no match is found for their specific AC
          if (eligibleBooths.length === 0) {
            eligibleBooths = allBooths
          }
          
          // Deterministically pick ONE booth based on their EPIC ID from the eligible list
          const charCodeSum = epicId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
          const myBooth = eligibleBooths[charCodeSum % eligibleBooths.length]
          
          setAssignedBooth(myBooth)
          setSelectedBooth(myBooth)
          setUserLocation({ lat: myBooth.lat, lng: myBooth.lng })
        }
      } catch (error) {
        console.error('Failed to fetch booths:', error)
      }
    }
    fetchBooths()
  }, [])

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(pos)
          map?.panTo(pos)
          map?.setZoom(15)
        },
        () => alert("Error getting your location")
      )
    }
  }

  const onLoad = useCallback(function callback(m) {
    setMap(m)
  }, [])

  return (
    <div className="map-page animate-fade-in">
      <section className="ed-hero ed-hero--map">
        <div className="ed-hero__content">
          <div className="ed-hero__info-wrap">
            <div className="ed-hero__badge">
              <MapPinIcon className="w-5 h-5" />
              <span>{t('booth_locator', 'Booth Locator')}</span>
            </div>
            <h1 className="ed-hero__title">
              {t('find_booth')}
            </h1>
            <p className="ed-hero__subtitle">
              {t('map_subtitle', 'Real-time polling station locator and queue status updates.')}
            </p>
          </div>
        </div>
      </section>


      <div className="map-main-container">
        <div className="map-view-wrap shadow-2xl">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={userLocation || defaultCenter}
              zoom={13}
              onLoad={onLoad}
              options={mapOptions}
            >
              {assignedBooth && (
                <AdvancedMarker
                  map={map}
                  key={assignedBooth.id}
                  position={{ lat: assignedBooth.lat, lng: assignedBooth.lng }}
                  onClick={() => setSelectedBooth(assignedBooth)}
                  iconUrl="https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  title={assignedBooth.name}
                />
              )}

              {userLocation && (
                <AdvancedMarker 
                  map={map}
                  position={userLocation}
                  iconUrl="https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                  title="Your Location"
                />
              )}

              {selectedBooth && (
                <InfoWindow
                  position={{ lat: selectedBooth.lat, lng: selectedBooth.lng }}
                  onCloseClick={() => setSelectedBooth(null)}
                >
                  <div className="p-2 max-w-[200px]">
                    <h3 className="font-bold text-sm text-[#1C1C1E]">{selectedBooth.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{selectedBooth.address}</p>
                    <div className="mt-2 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-[10px] font-bold text-green-700 uppercase">{selectedBooth.status}</span>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-[24px]">
              <p className="text-gray-500 font-medium">Loading Interactive Map...</p>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <aside className="map-sidebar space-y-6">
          <div className="space-y-4">
            {assignedBooth ? (
              <div 
                onClick={() => {
                  setSelectedBooth(assignedBooth);
                  map?.panTo({ lat: assignedBooth.lat, lng: assignedBooth.lng });
                  map?.setZoom(17);
                }}
                className="map-booth-card map-booth-card--active p-0 overflow-hidden border-none shadow-2xl hover:scale-[1.01] transition-all cursor-pointer group"
              >
                <div className="p-6 bg-white">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-[var(--primary-container)] rounded-lg">
                          <MapPinIcon className="w-4 h-4 text-[var(--primary)]" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)]">{t('your_polling_station')}</span>
                      </div>
                      <h4 className="text-2xl font-black text-[var(--on-surface)] leading-tight group-hover:text-[var(--primary)] transition-colors">
                        {assignedBooth.name}
                      </h4>
                      <p className="text-sm text-gray-500 mt-2 font-medium leading-relaxed">
                        {assignedBooth.address}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                        <span className="text-sm font-bold text-green-600 uppercase tracking-wide">{assignedBooth.status}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[var(--tertiary)] rounded-full text-[10px] font-bold">
                        <GlobeAsiaAustraliaIcon className="w-3 h-3" />
                        {t('live_status', 'LIVE STATUS')}
                      </div>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${assignedBooth.lat},${assignedBooth.lng}`;
                        window.open(url, '_blank');
                      }}
                      className="w-full bg-[var(--on-surface)] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[var(--primary)] transition-all shadow-xl active:scale-[0.98]"
                    >
                      {t('get_directions')}
                      <ArrowRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Loading your booth...</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
