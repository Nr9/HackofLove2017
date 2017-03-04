import {_} from 'underscore';
const geolib = require('geolib');

export class Parcometres {
    constructor(geoJsonData) {
        this.geoJsonData = geoJsonData;
    }

    findAllNearest(location, radius, maxResults) {
        let pointsWithDistances = this.orderByDistance(location);
        pointsWithDistances = this.getPointsWithDistances(location, pointsWithDistances);
        //pointsWithDistances = _.sortBy(pointsWithDistances, 'distance');

        if (radius) {
            pointsWithDistances = _.filter(pointsWithDistances, (point) => (point.distance <= radius))
        }

        if (!maxResults || pointsWithDistances.length <= maxResults)
        {
            return pointsWithDistances
        }
        return pointsWithDistances.slice(0, maxResults);
    }

    findTopNearest(location) {
        let nearest = this.findAllNearest(location, undefined, 1);
        return nearest[0];
    }

    orderByDistance(location) {
        const featuresPoints = _.map(this.geoJsonData.features, (feature) => {
            return {
                feature: feature,
                latitude: feature.geometry.coordinates[1],
                longitude: feature.geometry.coordinates[0]
            };
        });

        let points = geolib.orderByDistance(location, featuresPoints);
        return _.map(points, (i) => i.feature);
    }

    getPointsWithDistances(location, data) {
        return _.map(data, (feature) => {
            return {
                distance: geolib.getDistance(
                    location,
                    {latitude: feature.geometry.coordinates[1], longitude: feature.geometry.coordinates[0]},
                ),
                feature: feature
            }
        });
    }
}