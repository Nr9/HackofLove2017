import {_} from 'underscore';
const geolib = require('geolib');

export class Parcometres {
    constructor(geoJsonData) {
        this.geoJsonData = geoJsonData;
    }

    findAllNearest(location, radius, maxResults) {
        if (!radius && !maxResults)
        {
            maxResults = 1
        }

        let pointsWithDistances = this.getPointsWithDistances(location);
        pointsWithDistances = _.sortBy(pointsWithDistances, 'distance');
        if (radius > 0) {
            pointsWithDistances = _.filter(pointsWithDistances, (point) => (point.distance <= radius))
        }
        if (!maxResults || pointsWithDistances.length <= maxResults) {
            return pointsWithDistances
        }
        return pointsWithDistances.slice(0, maxResults);
    }

    getPointsWithDistances(location, data = this.geoJsonData.features) {
        return _.map(data, (feature) => {
            return {
                distance: geolib.getDistance(
                    location,
                    {latitude: feature.geometry.coordinates[1], longitude: feature.geometry.coordinates[0]}
                ),
                feature: feature
            }
        });
    }
}