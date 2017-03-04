import { version } from '../../package.json';
import { Router } from 'express';
import { readGeoJson} from '../geo/GeoJsonReader'
import {Parcometres } from '../geo/Parcometres'
export default ({ config, db }) => {
	let api = Router();

    let data = readGeoJson('data/parcometre.geojson');
	let parcometres = new Parcometres(data)
	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {

        let [latitude, longitude] = req.query.location.split(',');
        let radius = req.query.radius;
        let quantity = req.query.quantity;
        console.dir(location);
        console.dir(radius);
        console.dir(quantity);
		//console.dir(req);
		res.json(parcometres.findTopNearest({latitude,longitude}, radius, quantity));
	});

	return api;
}
