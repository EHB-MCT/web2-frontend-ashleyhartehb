"use strict"

import _ from 'lodash';
import './style.css';

//importing the icons from the src folder
import Bike from './bike.png';
import Destination from './destination.png'
import Walk from './walk.png';
import Run from './run.png';

/*
function component() {
  const element = document.createElement('div');

  // Lodash now imported by this script
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  // Add icons to div.
  
  const walkIcon = new Image();
  walkIcon.src = Walk;

  const runIcon = new Image();
  runIcon.src = Run;

  const bikeIcon = new Image();
  bikeIcon.src = Bike;

  const destinationIcon = new Image();
  destinationIcon.src = Destination;

  element.appendChild(walkIcon);
  element.appendChild(runIcon);
  element.appendChild(bikeIcon);
  element.appendChild(destinationIcon);


  return element;
}


document.body.appendChild(component());
*/

window.onload = () => {
  let profile = "mapbox/walking";
  let accestoken = 'pk.eyJ1IjoiYXNobGV5aGFydCIsImEiOiJja3VzajN0OWIwZjYwMm9tZnRhNnFmM2NjIn0._6gEaBHQtsooSxw223YP7A';
  /*
    fetch(`https:// .mapbox.com/directions/v5/${profile}/${coordinates[0]},${coordinates[1]};${coordinates[2]},${coordinates[3]}?geometries=geojson&access_token=${accestoken}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
      });
  */
  navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy: true
  })

  function successLocation(position) {
    console.log(position)
    setupMap([position.coords.longitude, position.coords.latitude], 12)
  }

  function errorLocation() {

    alert("Unable to find your location, try again and reload the page")

    //this is giving the coordinates of the center of the world so we still get something to see otherwise it's just a blank page
    setupMap([40.866667, 34.566667], 1)
  }

  mapboxgl.accessToken = accestoken;


  function setupMap(coordinates, zoom) {
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: coordinates,
      //center: [coordinates[0], coordinates[1]], //starting position
      zoom: zoom

    });
    // creating a marker on your location.
    const marker = new mapboxgl.Marker()
      .setLngLat(coordinates)
      .addTo(map);

    //adding directions controller
    map.addControl(new MapboxDirections({
        accessToken: mapboxgl.accessToken
      }),
      'top-left'
    );

    //adding controls on the bottom right corner
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    //adding shade to the map where there are hills
    map.on('load', () => {
      map.addSource('dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1'
      });
      map.addLayer({
        'id': 'hillshading',
        'source': 'dem',
        'type': 'hillshade'

      }, );
    });

  }

}