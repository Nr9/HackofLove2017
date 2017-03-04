const chai = require('chai');
const expect = chai.expect;

import {readGeoJson} from '../../geo/GeoJsonReader';
import {PanneauxStationnement} from '../../geo/PanneauxStationnement';

const geoJson = readGeoJson('data/vdqpanneaustationnement.geojson');

describe('Panneaux stationnement', function() {
    this.timeout(10000);

    it('should return the features by code', function() {
        const panneaux = new PanneauxStationnement(geoJson);
        const features = panneaux.getFeaturesByTypeCode('PS8004');

        features.forEach(function(feature) {
            expect(feature.properties['TYPE_CODE']).to.eql('PS8004');
        });
    });

    describe('getZoneForCodes', function() {
        it('should return null if no matching zone is found', function() {
            const panneaux = new PanneauxStationnement(geoJson);
            expect(panneaux.getZoneForCodes(['a'])).to.be.null;
            expect(panneaux.getZoneForCodes(['PS1292','PS1291','PS1293','PS8002', 'a'])).to.be.null;
        });

        it('should return the correct zone', function() {
            const panneaux = new PanneauxStationnement(geoJson);
            expect(panneaux.getZoneForCodes(['PS1292','PS1291','PS1293','PS8002']).name).to.eql('1');
        });
    });

    describe('getFeaturesForCodes', function() {
        it('should return the features for the specific zone', function() {
            const panneaux = new PanneauxStationnement(geoJson);
            const codes = ['PS1292','PS1291','PS1293','PS8002'];
            const features = panneaux.getFeaturesForCodes(codes);
            expect(features.length).to.eql(227);
            features.forEach(function(feature) {
                expect(codes).to.include(feature.properties['TYPE_CODE']);

            });
        });
    });

    describe('getZoneHull', function() {
        it('should return a polygon for zone', function() {
            const panneaux = new PanneauxStationnement(geoJson);
            const codes = ['PS1292','PS1291','PS1293','PS8002'];
            const hull = panneaux.getZoneHull(codes);
            expect(hull.length).to.eql(18);
        });
    });

});