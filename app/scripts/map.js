var map;
$(function(){
  'use strict';

  L.mapbox.accessToken = 'pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA';
  map = L.mapbox.map('map', 'siggyf.c74e2e04');
  map.setView([51.95, 4.17], 12);

}());
