import { version } from '../../package.json';
import { Router } from 'express';
import {PanneauxStationnement} from '../geo/PanneauxStationnement'
import {readGeoJson} from '../geo/GeoJsonReader'

export default ({ config, db }) => {
	let api = Router();
    let data = readGeoJson('data/vdqpanneaustationnement.geojson');
    let panneaux = new PanneauxStationnement(data);

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		console.dir(req.query);
        let signType = req.query['sign_type'];
		let codes = signType.split(',');
		console.log('---parkingzone---')
		console.log(codes);

        let geoJson = panneaux.getZoneHullAsGeoJson(codes);
        console.log(JSON.stringify(geoJson));
		res.json(geoJson);
	});

	return api;
}
