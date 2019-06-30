import {companies} from "./data/companies"
import * as L from "leaflet"
import "leaflet.heat"
import {getEmployeeCount} from "./components/employee";

const mapBounds = [
    [50.59, 30.25],
    [50.3, 30.8]
];

const map = L.map("map", {zoomSnap: 0.25}).fitBounds(mapBounds);

const tiles = L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const gamblingMarkers = L.layerGroup();

const latLngCompanyGroup = {};

let totalOfficeEmployeeCount = 0;

for (let i = 1; i < companies.length; i++) {
    const company = companies[i];
    const offices = company[2];
    const employeeCount = company[3] as string;

    const [companyEmployeeCount, officeEmployeeCount] = getEmployeeCount(employeeCount, offices.length);

    totalOfficeEmployeeCount += companyEmployeeCount;

    for (let j = 0; j < offices.length; j++) {
        const office = offices[j];
        const lat = office[0];
        const lng = office[1];
        const data = [company, office, officeEmployeeCount];

        if (latLngCompanyGroup.hasOwnProperty(lat)) {
            const latGroup = latLngCompanyGroup[lat];

            if (latGroup.hasOwnProperty([lng])) {
                latGroup[lng].push(data);
            } else {
                latGroup[lng] = [data];
            }
        } else {
            latLngCompanyGroup[lat] = {
                [lng]: [data],
            };
        }
    }
}

const avgOfficeEmployeeCount = totalOfficeEmployeeCount / companies.length;

const points = [];

for (let lat in latLngCompanyGroup) {
    if (latLngCompanyGroup.hasOwnProperty(lat)) {
        const latGroup = latLngCompanyGroup[lat];

        for (let lng in latGroup) {
            if (latGroup.hasOwnProperty(lng)) {
                const group = latGroup[lng];
                const office = group[0][1];

                const links = new Array(group.length);
                let employeeCountByLocation = 0;

                for (let i = 0; i < group.length; i++) {
                    const [company, _, officeEmployeeCount] = group[i];

                    links[i] = `<a href="https://jobs.dou.ua/companies/${company[0]}/">${company[1]}</a>`;

                    employeeCountByLocation += officeEmployeeCount;
                }

                points.push([office[0], office[1], employeeCountByLocation / avgOfficeEmployeeCount]);

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