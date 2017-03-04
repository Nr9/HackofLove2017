const chai = require('chai');
const expect = chai.expect;
const geolib = require('geolib');

import {Parcometres} from '../../geo/Parcometres';
import {readGeoJson} from '../../geo/GeoJsonReader';

describe('Parcometres', function() {
   it('should return the correct distance', function() {
       let data = readGeoJson('data/parcometre.geojson');
       const distances = new Parcometres(data)
           .getPointsWithDistances({
               //Fontaine de tourny
               longitude: -71.212647,
               latitude:46.809626,
           }, data.features);
       expect(distances[0].distance).to.eql(945);
   });

   it('should filter the points within the specified radius', function() {
       const nearByCoordinates = {latitude:46.803607, longitude:-71.221283};
       const points = new Parcometres(readGeoJson('data/parcometre.geojson'))
           .findAllNearest(nearByCoordinates, 50, 50);

       expect(points.length).to.eql(9, 'should have 9 results');
       expect(points[0].distance).to.eql(20, 'distance of the first point should be 20 meters');
       expect(points[0].feature.properties['NOM_TOPOG']).to.eql('Avenue Louis-St-Laurent');
   });

    it('should filter the points within the specified radius no quantity', function() {
        const nearByCoordinates = {latitude:46.803607, longitude:-71.221283};
        const points = new Parcometres(readGeoJson('data/parcometre.geojson'))
            .findAllNearest(nearByCoordinates, 50);

        expect(points.length).to.eql(9, 'should have 9 results');
        expect(points[0].distance).to.eql(20, 'distance of the first point should be 20 meters');
        expect(points[0].feature.properties['NOM_TOPOG']).to.eql('Avenue Louis-St-Laurent');
    });

    it('should filter the points within the specified radius and return a maximum of points', function() {
        const nearByCoordinates = {latitude:46.803607, longitude:-71.221283};
        const points = new Parcometres(readGeoJson('data/parcometre.geojson'))
            .findAllNearest(nearByCoordinates, 50, 5);

        expect(points.length).to.eql(5, 'should have 9 results trimmed to 5 because of maxResults');
        expect(points[0].distance).to.eql(20, 'distance of the first point should be 20 meters');
        expect(points[0].feature.properties['NOM_TOPOG']).to.eql('Avenue Louis-St-Laurent');
    });

    it('geolib', () =>
    {
        let values = [
            {latitude: 52.516272, longitude: 13.377722},
            {latitude: 51.518, longitude: 7.45425},
            {latitude: 51.503333, longitude: -0.119722}
        ];
        let orderByDistance = geolib.orderByDistance({latitude: 51.515, longitude: 7.453619}, values);
        console.dir(values[parseInt(orderByDistance[0].key)]);
    })
});