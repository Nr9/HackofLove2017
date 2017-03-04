import {_} from 'underscore';
import {zones} from './zones'
const geolib = require('geolib');
const grahamscan = require('./GrahamScan');

export class PanneauxStationnement {
    constructor(geoJsonData) {
        this.geoJsonData = geoJsonData;
        this.featuresByTypeCode = _.groupBy(this.geoJsonData.features, (feature) => feature.properties['TYPE_CODE']);
    }

    getFeaturesByTypeCode(code) {
        return this.featuresByTypeCode[code];
    }

    getZoneForCodes(codes) {
        const matchingZones = _.filter(zones, (zone) => _.difference(zone.codes, codes).length === 0 &&
                                                        _.difference(codes, zone.codes).length === 0);
        if (matchingZones.length == 1)
            return matchingZones[0];
        return null;
    }

    getFeaturesForCodes(codes) {
        const zone = this.getZoneForCodes(codes);
        if (!zone)
            throw new Error('codes dont resolve to a valid zone');

        const self = this;
        return _.flatten(_.map(zone.codes, (typeCode) => self.getFeaturesByTypeCode(typeCode)));
    }

    getZoneHull(codes) {
        const features = this.getFeaturesForCodes(codes);
        const validFeatures = this.keepNearbyFeatures(features, 500);

        const convexHull = new grahamscan();
        validFeatures.forEach(function(feature) {
            const point = featureToPoint(feature);
            convexHull.addPoint(point.longitude, point.latitude);
        });
        return convexHull.getHull();
    }

    getZoneHullAsGeoJson(codes) {
        const hull = this.getZoneHull(codes);
        const geoJson = {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'Polygon',
                'coordinates': [[]]
            }};
        hull.forEach(function(hullPoint) {
            geoJson.geometry.coordinates[0].push([hullPoint.x, hullPoint.y]);
        });
        //first point must be the same as the last
        geoJson.geometry.coordinates[0].push([hull[0].x, hull[0].y]);
        return geoJson;
    }

    keepNearbyFeatures(features, maxDistanceFromCenter) {
        const featuresPoints = _.map(features, featureToPoint);
        return _.filter(features, (feature) => {
            const location = {latitude: feature.geometry.coordinates[1], longitude: feature.geometry.coordinates[0]};
            const nearestIndex = parseInt(geolib.findNearest(location, featuresPoints,1).key);
            const nearest = featuresPoints[nearestIndex];
            const distance = geolib.getDistance(location, nearest);
            return distance < maxDistanceFromCenter;
        });
    }
}

function featureToPoint(feature) {
    return {
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0]
    };
}

