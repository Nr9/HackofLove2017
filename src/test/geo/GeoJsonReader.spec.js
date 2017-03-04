import {readGeoJson} from '../../geo/GeoJsonReader';

const chai = require('chai');
const expect = chai.expect;

describe('GeoJsonReader', function() {
    it('should return a valid json structure when reading a valid geojson file', function() {
        const parcometreData = readGeoJson('data/parcometre.geojson');
        expect(parcometreData.name).to.eql('PARCOMETRE');
        expect(parcometreData.features).not.to.be.null;
        expect(parcometreData.features[0]).not.to.be.null;
        expect(parcometreData.features[0].properties['COTE_RUE']).to.eql('Ouest');
    });
});