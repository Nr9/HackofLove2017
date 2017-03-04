import {_} from 'underscore';
const geolib = require('geolib');

export class Parcometres {
    constructor(geoJsonData) {
        this.geoJsonData = geoJsonData;
    }

    findTopNearest(location, radius, maxResults) {
        const pointsWithDistances = this.getPointsWithDistances(location);
        const sortedPointsWithDistances = _.sortBy(pointsWithDistances, 'distance');
        const filteredByRadius = _.filter(sortedPointsWithDistances, (point) => (point.distance <= radius));
        if (filteredByRadius.length <= maxResults)
            return filteredByRadius;
        return filteredByRadius.slice(0, maxResults);
    }

    getPointsWithDistances(location) {
        return _.map(this.geoJsonData.features, (feature) => {
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