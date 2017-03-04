import {version} from '../../package.json';
import {Router} from 'express';
import {readGeoJson} from '../geo/GeoJsonReader'
import {Parcometres} from '../geo/Parcometres'
export default ({config, db}) => {
    let api = Router();

    let data = readGeoJson('data/parcometre.geojson');
    let parcometres = new Parcometres(data);


    // perhaps expose some API metadata at the root
    function getParam(req) {
        let [latitude, longitude] = req.query.location.split(',');
        let radius = req.query.radius;
        let quantity = req.query.quantity;
        return {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            radius: parseInt(radius),
            quantity: parseInt(quantity),
        };
    }

    function buildResponse(latitude, longitude, radius, quantity) {
        let date = parcometres.findTopNearest({latitude, longitude}, radius, quantity);
        const features = (date||[]).map((item) => item.feature);
        return {name: 'HackOfLove', type: 'FeatureCollection', features};
    }

    api.get('/', (req, res) => {
        let {latitude, longitude, radius, quantity} = getParam(req);
        console.dir({latitude, longitude, radius, quantity});
        res.json(buildResponse(latitude, longitude, radius, quantity));
    });

    return api;
}
