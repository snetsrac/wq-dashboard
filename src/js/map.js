import mapboxgl from 'mapbox-gl';
import styles from './styles';

export default async function drawMap() {
  mapboxgl.accessToken = MAPBOX_TOKEN;

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v11',
    bounds: new mapboxgl.LngLatBounds(
      new mapboxgl.LngLat(-80.07, 26.51),
      new mapboxgl.LngLat(-80.03, 26.87)
    ),
    pitchWithRotate: false,
    boxZoom: false,
    dragRotate: false,
    touchPitch: false
  });
  
  map.touchZoomRotate.disableRotation();
  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));

  const sites = await fetch('/api/sites').then((response) => response.json());

  sites.forEach((site) => {
    const popup = new mapboxgl.Popup()
      .setHTML(`<p><strong>${site.name}</strong></p><p>${site.type}</p>`);

    const options = {};

    if (site.dbkey != undefined && Object.keys(styles).includes(site.dbkey)) {
      options.color = styles[site.dbkey].borderColor;
    } else {
      options.color = '#ccc';
    }
    
    new mapboxgl.Marker(options)
      .setLngLat(site.geometry.coordinates)
      .setPopup(popup)
      .addTo(map);
  });
};
