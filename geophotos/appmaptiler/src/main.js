import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { format } from 'date-fns';
import 'lightgallery.js';
import 'lg-fullscreen.js';
import 'lg-autoplay.js';
import 'lg-zoom.js';
import 'lightgallery.js/dist/css/lightgallery.css';

maptilersdk.config.apiKey = 'W61XbXMJwzZapVydUu4s';

const map = new maptilersdk.Map({
  container: 'map',
  projection: 'globe',
  style: maptilersdk.MapStyle.BASIC,
  center: [8.5417, 47.3769],
  zoom: 12
});

async function loadPhotos() {
  const response = await fetch('assets/photos.json');
  const photos = await response.json();

  let bounds = new maptilersdk.LngLatBounds();

  const geojson = {
    type: 'FeatureCollection',
    features: photos.map(photo => {
      bounds.extend([photo.lng, photo.lat]);
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [photo.lng, photo.lat]
        },
        properties: {
          img: photo.img,
          ts: photo.ts
        }
      };
    })
  };

  map.addSource('photos', {
    type: 'geojson',
    data: geojson,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50
  });

  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'photos',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        100,
        '#f1f075',
        750,
        '#f28cb1'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        100,
        30,
        750,
        40
      ]
    }
  });

  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'photos',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    }
  });

  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'photos',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#11b4da',
      'circle-radius': 8,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });

  map.fitBounds(bounds, {
    padding: 20
  });

  map.on('click', 'clusters', async function (e) {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['clusters']
    });
    const clusterId = features[0].properties.cluster_id;
    const zoom = await map.getSource('photos').getClusterExpansionZoom(clusterId);
    map.easeTo({
      center: features[0].geometry.coordinates,
      zoom
    });
  });

  map.on('click', 'unclustered-point', function (e) {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const img = e.features[0].properties.img;

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    const ts = e.features[0].properties.ts;
    const lat = e.features[0].geometry.coordinates[1];
    const lng = e.features[0].geometry.coordinates[0];
    const timestamp = ts ? format(new Date(ts * 1000), 'yyyy-MM-dd HH:mm') : '';

    new maptilersdk.Popup()
      .setLngLat(coordinates)
      .setHTML(`<img src="assets/thumbnails/${img}" alt="${img}" style="width: 100px;"/><br/><div>${img}</div><div>${timestamp}</div><div>Lat: ${lat}<br>Lng: ${lng}</div><button class="open-lightgallery">Open Lightgallery</button>`)
      .addTo(map);
  });
}

map.getContainer().addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('open-lightgallery')) {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['unclustered-point']
    });
    const img = features[0].properties.img;

    // Get visible photos
    const bounds = map.getBounds();
    const visiblePhotos = [];
    const geojson = map.getSource('photos')._data;
    geojson.features.forEach(feature => {
      if (bounds.contains([feature.geometry.coordinates[0], feature.geometry.coordinates[1]])) {
        visiblePhotos.push({ src: `assets/images/${feature.properties.img}` });
      }
    });

    const el = document.getElementById('lightgallery');
    const lg = window.lgData[el.getAttribute('lg-uid')];
    if (lg) {
      lg.destroy(true);
    }
    lightGallery(el, {
      dynamic: true,
      dynamicEl: visiblePhotos
    });
  }
});

map.on('load', () => {
  loadPhotos();
});
