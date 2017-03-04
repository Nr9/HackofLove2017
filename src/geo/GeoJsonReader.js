var fs = require('fs');

export function readGeoJson(filename) {
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
}