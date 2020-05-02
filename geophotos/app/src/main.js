import { HTMLMapMarker } from './HTMLMapMarker.js';
import MarkerClusterer from '@google/markerclustererplus';
import format from 'date-fns/format'
import 'lightgallery.js';
import 'lg-fullscreen.js';
import 'lg-autoplay.js';
import 'lg-zoom.js';

let map;
const markers = [];

loadMap();
loadPhotos();

function loadMap() {
  const latLng = new google.maps.LatLng(14.0290853, 98.0161546);

  const mapOptions = {
    center: latLng,
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.HYBRID
  }

  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

async function loadPhotos() {
  const response = await fetch('assets/photos.json');
  const photos = await response.json();
  for (const photo of photos) {
    drawMarker(photo);
  }
  new MarkerClusterer(map, markers, { imagePath: 'assets/', minimumClusterSize: 20 });
}

function drawMarker(photo) {
  const marker = new HTMLMapMarker({
    photo: photo.img,
    latlng: new google.maps.LatLng(photo.lat, photo.lng),
    html: `<div class="asset-map-image-marker"><div title="${photo.ts ? format(new Date(photo.ts * 1000), 'yyyy-MM-dd HH:mm') : ''}" class="image" style="background-image: url(assets/thumbnails/${photo.img})"></div></div>`
  });

  marker.addListener('click', () => {
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
  const result = [{ src: `assets/photos/${photo.img}` }];
  for (const marker of markers) {
    if (bounds.contains(marker.getPosition())) {
      if (photo.img !== marker.photo) {
        result.push({ src: `assets/photos/${marker.photo}` });
      }
    }
  }
  return result;
}


