"use strict"

import _ from 'lodash';
import './style.css';

//importing the icons from the src folder
import Bike from './bike.png';
import Destination from './destination.png'
import Walk from './walk.png';
import Run from './run.png';



//strava info:
//access token: bc4bc1c934a9285f6fe9f88d5afa6fcb9861da92
//refresh token: 4a00427bb2a5508e4f7020bda319b94f8a0a9e77
//100 req. /15min

//mapbox:
//pk.eyJ1IjoiYXNobGV5aGFydCIsImEiOiJja3VzajN0OWIwZjYwMm9tZnRhNnFmM2NjIn0._6gEaBHQtsooSxw223YP7A


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


window.onload = () => {
  let profile = "mapbox/walking";
  let coordinates = [4.294575328274752, 50.78668775413435, 4.2646456534138135, 50.752852661976945];
  let accestoken = 'pk.eyJ1IjoiYXNobGV5aGFydCIsImEiOiJja3VzajN0OWIwZjYwMm9tZnRhNnFmM2NjIn0._6gEaBHQtsooSxw223YP7A';

  fetch(`https://api.mapbox.com/directions/v5/${profile}/${coordinates[0]},${coordinates[1]};${coordinates[2]},${coordinates[3]}?geometries=geojson&access_token=${accestoken}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
    });


  mapboxgl.accessToken = accestoken;
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v11',
    center: [coordinates[0], coordinates[1]], //starting position
    zoom: 15
  });



  // an arbitrary start will always be the same
  // only the end or destination will change
  const start = [coordinates[0], coordinates[1]];

// create a function to make a directions request
async function getRoute(end) {
  // make a directions request using cycling profile
  // an arbitrary start will always be the same
  // only the end or destination will change
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
    { method: 'GET' }
  );
  const json = await query.json();
  const data = json.routes[0];
  const route = data.geometry.coordinates;
  const geojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: route
    }
  };
  // if the route already exists on the map, we'll reset it using setData
  if (map.getSource('route')) {
    map.getSource('route').setData(geojson);
  }
  // otherwise, we'll make a new request
  else {
    map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: geojson
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3887be',
        'line-width': 5,
        'line-opacity': 0.75
      }
    });
  }
  // add turn instructions here at the end
}

map.on('load', () => {
  // make an initial directions request that
  // starts and ends at the same location
  getRoute(start);

  // Add starting point to the map
  map.addLayer({
    id: 'point',
    type: 'circle',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: start
            }
          }
        ]
      }
    },
    paint: {
      'circle-radius': 10,
      'circle-color': '#3887be'
    }
  });
  // this is where the code from the next step will go
});

}