const chai = require('chai');
const expect = chai.expect;

import {Parcometres} from '../../geo/Parcometres';
import {readGeoJson} from '../../geo/GeoJsonReader';

describe('Parcometres', function() {
   it('should return the correct distance', function() {
       const distances = new Parcometres(readGeoJson('data/parcometre.geojson'))
           .getPointsWithDistances({
               //Fontaine de tourny
               longitude: -71.212647,
               latitude:46.809626,
           });
       expect(distances[0].distance).to.eql(945);
   });

   it('should filter the points within the specified radius', function() {
       const nearByCoordinates = {latitude:46.803607, longitude:-71.221283};
       const points = new Parcometres(readGeoJson('data/parcometre.geojson'))
           .findTopNearest(nearByCoordinates, 50, 50);

       expect(points.length).to.eql(9, 'should have 9 results');
       expect(points[0].distance).to.eql(20, 'distance of the first point should be 20 meters');
       expect(points[0].feature.properties['NOM_TOPOG']).to.eql('Avenue Louis-St-Laurent');
   });

    it('should filter the points within the specified radius and return a maximum of points', function() {
        const nearByCoordinates = {latitude:46.803607, longitude:-71.221283};
        const points = new Parcometres(readGeoJson('data/parcometre.geojson'))
            .findTopNearest(nearByCoordinates, 50, 5);

        expect(points.length).to.eql(5, 'should have 9 results trimmed to 5 because of maxResults');
        expect(points[0].distance).to.eql(20, 'distance of the first point should be 20 meters');
        expect(points[0].feature.properties['NOM_TOPOG']).to.eql('Avenue Louis-St-Laurent');
    });
});