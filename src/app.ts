import {companies} from "./data/companies"
import * as L from "leaflet"
import "leaflet.heat"

const mapBounds = [
    [50.59, 30.25],
    [50.3, 30.8]
];

const map = L.map("map", {zoomSnap: 0.25}).fitBounds(mapBounds);

const tiles = L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const gamblingMarkers = L.layerGroup();

const points = [];

const latLngCompanyGroup = {};

for (let i = 1; i < companies.length; i++) {
    const company = companies[i];

    const offices = company[2];

    for (let j = 0; j < offices.length; j++) {
        const office = offices[j];

        const lat = office[0];
        const lng = office[1];

        if (latLngCompanyGroup.hasOwnProperty(lat)) {
            const latGroup = latLngCompanyGroup[lat];

            if (latGroup.hasOwnProperty([lng])) {
                latGroup[lng].push([company, office]);
            } else {
                latGroup[lng] = [[company, office]];
            }
        } else {
            latLngCompanyGroup[lat] = {
                [lng]: [[company, office]],
            };
        }
    }
}

const max = 5;

for (let lat in latLngCompanyGroup) {
    if (latLngCompanyGroup.hasOwnProperty(lat)) {
        const latGroup = latLngCompanyGroup[lat];

        for (let lng in latGroup) {
            if (latGroup.hasOwnProperty(lng)) {
                const group = latGroup[lng];
                const office = group[0][1];

                points.push([office[0], office[1], Math.max(group.length / max, 1)]);

                const links = new Array(group.length);

                for (let i = 0; i < group.length; i++) {
                    const company = group[i][0];

                    links[i] = `<a href="https://jobs.dou.ua/companies/${company[0]}/">${company[1]}</a>`;
                }

                L.marker(office).bindPopup(links.join("<br>")).addTo(gamblingMarkers);
            }
        }
    }
}

L.heatLayer(points, {
    maxZoom: 13,
    blur: 20
}).addTo(map);

map.on("zoomend", function () {
    if (map.getZoom() < 13) {
        map.removeLayer(gamblingMarkers);
    } else {
        map.addLayer(gamblingMarkers);
    }
});