import {
    Map,
    View,
    Feature
} from 'ol';
import {
    fromLonLat,
    toLonLat
} from 'ol/proj';
import {
    Tile as TileLayer,
    Vector as VectorLayer
} from 'ol/layer';
import {
    OSM,
    Vector as VectorSource
} from 'ol/source';

import {
    Polygon,
    Point
} from 'ol/geom';

import {
    Fill,
    Stroke,
    Style
} from 'ol/style';

import {
    Translate,
    defaults as defaultInteractions
} from 'ol/interaction';

import $ from 'jquery';

var pos = fromLonLat([76.86687469482423, 8.564810721288154]);

//Position for our Triangle Polygon

var pos1 = fromLonLat([76.85860825505787, 8.575525035547585]);
var pos2 = fromLonLat([76.85286067404068, 8.56925661298456]);
var pos3 = fromLonLat([76.86300346314657, 8.56917303421666]);

//Position for arrow Polygon

var arrowOne = fromLonLat([76.86219331461274, 8.565926475435887]);
var arrowTwo = fromLonLat([76.86584111887299, 8.566053785302557]);
var arrowThree = fromLonLat([76.86566945749604, 8.56758150037902]);
var arrowFour = fromLonLat([76.87034723001801, 8.56456850087342]);
var arrowFive = fromLonLat([76.86635610300385, 8.562064722566959]);
var arrowSix = fromLonLat([76.86627027231538, 8.5638470749155]);
var arrowSeven = fromLonLat([76.86163541513764, 8.564016822322785]);

//Defining our TileLayer with OSM Source
var tileLayer = new TileLayer({
    source: new OSM()
});

//Setting our View for Map
var viewOne = new View({
    center: pos,
    zoom: 13
});

//Coordinates for our Polygons
var cordTriangle = [pos1, pos2, pos3, pos1];
var cordArrow = [arrowOne, arrowTwo, arrowThree, arrowFour, arrowFive, arrowSix, arrowSeven, arrowOne];

//Defining the Triangle Polygon
var polyTriangle = new Polygon([cordTriangle]);

//To get varying coordinates
var cordArray = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
];

//Getting the resolution at initial stage
var resOne = viewOne.getResolution();

//getting the values of pos into transPosArrow
var transPosArrow = pos.slice();

//Definition of myFunction

function myFunction() {

    var resol = viewOne.getResolution();
    for (var outer = 0; outer < cordArrow.length; outer++) {
        cordArray[outer][0] = transPosArrow[0] + (cordArrow[outer][0] - pos[0]) * resol / resOne;
        cordArray[outer][1] = transPosArrow[1] + (cordArrow[outer][1] - pos[1]) * resol / resOne;
    }
    console.log(cordArray);
    if (featureArrow) {
        featureArrow.setGeometry(new Polygon([cordArray]));
    }
}

//calling myFunction and creating out Polygon

myFunction();
var polyArrow = new Polygon([cordArray]);

//The below will select all the Features and add it for Translate
var translate = new Translate();
var transStartArrow = [];
var i;

//Below code is to set the coordinates when we Translate

translate.on('translatestart', function (evt) {
    for (i = 0; i < evt.features.getArray().length; i++) {
        console.log(evt.features.getArray().length);
        if (evt.features.getArray()[i] === featureArrow) {
            //centreArrow[0] = evt.coordinate[0];
            //centreArrow[1] = evt.coordinate[1];
            transStartArrow[0] = evt.coordinate[0];
            transStartArrow[1] = evt.coordinate[1];
        }
    }
});

translate.on('translateend', function (evt) {
    for (i = 0; i < evt.features.getArray().length; i++) {
        if (evt.features.getArray()[i] === featureArrow) {
            //centreArrow[0] = transPosArrow[0] + evt.coordinate[0] - transStartArrow[0];
            //centreArrow[1] = transPosArrow[1] + evt.coordinate[1] - transStartArrow[1];
            transPosArrow[0] = transPosArrow[0] + evt.coordinate[0] - transStartArrow[0];
            transPosArrow[1] = transPosArrow[1] + evt.coordinate[1] - transStartArrow[1];
        }
    }
});

//Adding the Feature for our Polygons
var featureTriangle = new Feature({
    geometry: polyTriangle,
    labelPoint: new Point(pos),
    name: 'My Polygon',
    id: 'triPoly'
});

var featureArrow = new Feature(polyArrow);

//Defining Style for the features
var featureStyle = new Style({

    fill: new Fill({
        color: '#ccff00'
    }),
    stroke: new Stroke({
        color: 'black'
    })

})

//Setting the style to featureArrow
featureArrow.setStyle(featureStyle);

//Setting out VectorSource
var vectorSource = new VectorSource({
    //projection: 'EPSG:4326',
    features: [featureTriangle, featureArrow]
});

//Setting out VectorLayer
var vectorLayer = new VectorLayer({
    source: vectorSource,
});

// Adding all Layers and creating our Map
var map = new Map({
    interactions: defaultInteractions().extend([ /*select,*/ translate]),
    target: 'map',
    layers: [tileLayer, vectorLayer],
    view: viewOne
});

//document.getElementById("map").addEventListener("wheel", myFunction); // deleted

viewOne.on("change:resolution", myFunction); // added

$(document).ready(function () {

    map.on('click', function (evt) {

        let cordClick = toLonLat(evt.coordinate);
        console.log(cordClick);
    });
});