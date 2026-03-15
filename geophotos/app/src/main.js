import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { format } from 'date-fns';
import 'lightgallery.js';
import 'lg-fullscreen.js';
import 'lg-autoplay.js';
import 'lg-zoom.js';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAZjJ216B4aJGdXTwXNevmXesob9RUSlPc';
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID || 'DEMO_MAP_ID';

let map;
let AdvancedMarkerElement;
const markers = [];

initialize();

async function initialize() {
  setOptions({
    key: GOOGLE_MAPS_API_KEY,
    v: 'weekly'
  });

  const [{ Map }, { AdvancedMarkerElement: LoadedAdvancedMarkerElement }] = await Promise.all([
    importLibrary('maps'),
    importLibrary('marker')
  ]);

  AdvancedMarkerElement = LoadedAdvancedMarkerElement;

  const latLng = { lat: 14.0290853, lng: 98.0161546 };

  const mapOptions = {
    center: latLng,
    zoom: 10,
    mapId: GOOGLE_MAP_ID,
    mapTypeId: 'hybrid'
  };

  map = new Map(document.getElementById('map'), mapOptions);
  await loadPhotos();
}

async function loadPhotos() {
  const response = await fetch('assets/photos.json');
  if (!response.ok) {
    throw new Error(`Failed to load assets/photos.json: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`Expected JSON from assets/photos.json but received ${contentType || 'unknown content type'}`);
  }

  const photos = await response.json();
  for (const photo of photos) {
    drawMarker(photo);
  }
  new MarkerClusterer({
    map,
    markers,
    algorithmOptions: {
      minPoints: 20
    }
  });
}

function drawMarker(photo) {
  const markerContent = document.createElement('div');
  markerContent.className = 'asset-map-image-marker';
  markerContent.title = photo.ts ? format(new Date(photo.ts * 1000), 'yyyy-MM-dd HH:mm') : '';

  const image = document.createElement('div');
  image.className = 'image';
  image.style.backgroundImage = `url(assets/thumbnails/${photo.img})`;
  markerContent.appendChild(image);

  const marker = new AdvancedMarkerElement({
    map,
    position: { lat: photo.lat, lng: photo.lng },
    title: markerContent.title,
    content: markerContent,
    gmpClickable: true
  });
  marker.photo = photo.img;

  marker.addEventListener('gmp-click', () => {
    const el = document.getElementById('lightgallery');
    const lg = window.lgData[el.getAttribute('lg-uid')];
    if (lg) {
      lg.destroy(true);
    }
    lightGallery(el, {
      dynamic: true,
      dynamicEl: visiblePhotos(photo)
    });
  });

  markers.push(marker);
}

function visiblePhotos(photo) {
  const bounds = map.getBounds();
  const result = [{ src: `assets/images/${photo.img}` }];
  if (!bounds) {
    return result;
  }

  for (const marker of markers) {
    if (bounds.contains(markerPosition(marker))) {
      if (photo.img !== marker.photo) {
        result.push({ src: `assets/images/${marker.photo}` });
      }
    }
  }
  return result;
}

function markerPosition(marker) {
  if (marker.position instanceof google.maps.LatLng) {
    return marker.position;
  }

  return new google.maps.LatLng(marker.position);
}


