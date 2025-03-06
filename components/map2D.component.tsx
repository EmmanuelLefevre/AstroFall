"use client";
import 'ol/ol.css';
import React, { useEffect, useState } from "react";
import Feature from "ol/Feature";
import Map from "ol/Map";
import Point from "ol/geom/Point";
import VectorSource from "ol/source/Vector";
import View from "ol/View";

import { Checkbox } from "@/components/ui/checkbox";
import { defaults as defaultControls } from "ol/control";
import { fromLonLat } from "ol/proj";
import { OSM } from "ol/source";
import { Style, Circle as CircleStyle, Fill } from "ol/style";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";

import { useGenericColorsHook } from "@/lib/utils/use-generic-colors-hook";
import { Meteorite, MeteoriteType } from "@/lib/interfaces/meteorite-interface";


type MeteoriteTypeKey = MeteoriteType | "null";


export default function Map2D({ meteorites }: { meteorites: Meteorite[] }) {
	// Get generic colors
	const { colorMeteoriteType, primaryColor, secondaryColor } = useGenericColorsHook();

	const meteoriteTypes: MeteoriteTypeKey[] = ["Stone", "Iron", "Stony-Iron", "null"];

	const [selectedTypes, setSelectedTypes] = useState<Set<MeteoriteTypeKey>>(
		new Set(meteoriteTypes)
	);

	const [tooltip, setTooltip] = useState<string>("");

	const [activeLayer, setActiveLayer] = useState<string>('normal');

	const toggleType = (type: MeteoriteTypeKey) => {
		setSelectedTypes((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(type)) {
				newSet.delete(type);
			}
			else {
				newSet.add(type);
			}
			return newSet;
		});
	};

	useEffect(() => {
		const mapElement = document.getElementById("map");
    if (!mapElement) return;

		const filteredMeteorites = meteorites.filter((meteorite) => {
			const typeKey: MeteoriteTypeKey = meteorite.Type ? meteorite.Type : "null";
			return selectedTypes.has(typeKey);
		});

		const vectorSource = new VectorSource();

		const addMeteoritesToMap = () => {
			filteredMeteorites.forEach((meteorite) => {
				if (meteorite.latitude && meteorite.longitude) {
					const typeKey: MeteoriteTypeKey = meteorite.Type ? meteorite.Type : "null";
					const feature = new Feature({
						geometry: new Point(fromLonLat([meteorite.longitude, meteorite.latitude])),
						properties: {
							name: meteorite.Name,
							type: meteorite.Type,
							mass: meteorite["Recovered weight"]
						}
					});

					feature.setStyle(
						new Style({
							image: new CircleStyle({
								radius: 5,
								fill: new Fill({ color: colorMeteoriteType[typeKey] })
							})
						})
					);

					vectorSource.addFeature(feature);
				}
			});
		};

		const vectorLayer = new VectorLayer({
			source: vectorSource
		});

		// Normal view
		const normalLayer = new TileLayer({
      source: new OSM()
    });

		// Relief view
		const reliefLayer = new TileLayer({
			source: new OSM({
				url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.jpg'
			})
		});

		// Satellite view
		const satelliteLayer = new TileLayer({
			source: new OSM({
				url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
			})
		});

		const map = new Map({
			target: "map",
			layers: [
				normalLayer,
				reliefLayer,
				satelliteLayer,
				vectorLayer
			],
			view: new View({
				projection: "EPSG:3857",
				center: fromLonLat([0, 0]),
				zoom: 2,
				maxZoom: 18,
        minZoom: 2,
				extent: undefined,
				constrainRotation: false,
				showFullExtent: true
			}),
			controls: defaultControls()
		});

		map.on('loadstart', function () {
			map.getTargetElement().classList.add('loader');
		});

		map.on('loadend', function () {
			map.getTargetElement().classList.remove('loader');
			addMeteoritesToMap();
		});

		let isUpdatingTooltip = false;

		map.on("pointermove", function (evt) {
			if (evt.dragging) {
				setTooltip("");
				return;
			}

			if (!isUpdatingTooltip) {
				isUpdatingTooltip = true;

				requestAnimationFrame(() => {
					const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
						return feature;
					});

					const tooltipElement = document.getElementById("tooltip");

					if (feature) {
						const properties = feature.getProperties().properties;

						let tooltipContent = '';

						if (properties.name) {
							tooltipContent += `
							<div>
								<div style="color: ${ secondaryColor }">Nom : </div>
								<strong style="color: #eb0000">${ properties.name }</strong>
							</div>`;
						}

						if (properties.type) {
							const meteoriteTypeColor = colorMeteoriteType[properties.type];
							tooltipContent += `
							<div>
								<div style="color: ${ secondaryColor }">Type : </div>
								<strong style="color: ${ meteoriteTypeColor }">${ properties.type }</strong>
							</div>`;
						}

						if (properties.mass !== null) {
							tooltipContent += `
							<div>
								<div style="color: ${ secondaryColor }">Masse : </div>
								<strong style="color: ${ primaryColor }">${ properties.mass.toLocaleString('fr-FR') } kg</strong>
							</div>`;
						}

						if (!tooltipContent) {
							tooltipContent = `
							<div>
								<strong style="color: ${ secondaryColor }">Aucunes données !</strong>
							</div>`;
						}

						setTooltip(tooltipContent);

						if (tooltipElement) {
							if (map && map.getSize()) {
								const mapSize = map.getSize();
								if (mapSize) {
									const mapWidth = mapSize[0];
									const tooltipWidth = tooltipElement.offsetWidth;
									const mouseX = evt.pixel[0];

									if (mouseX + tooltipWidth + 400 > mapWidth) {
										tooltipElement.style.left = `${mouseX - tooltipWidth - 50}px`;
									}
									else {
										tooltipElement.style.left = `${mouseX + 50}px`;
									}

									tooltipElement.style.top = `${evt.pixel[1] + 0}px`;
									tooltipElement.style.visibility = 'visible';
								}
							}
						}
					}
					else {
						setTooltip("");
						if (tooltipElement) {
							tooltipElement.style.visibility = 'hidden';
						}
					}

					isUpdatingTooltip = false;
				});
			}
		});


		const toggleLayers = () => {
			// Hide all layers => only show selected one
			normalLayer.setVisible(activeLayer === 'normal');
			satelliteLayer.setVisible(activeLayer === 'satellite');
			reliefLayer.setVisible(activeLayer === 'relief');
		};

		toggleLayers();


		return () => {
			if (map) {
				map.setTarget(undefined);
			}
		};
	}, [meteorites, secondaryColor, selectedTypes, colorMeteoriteType, activeLayer, primaryColor]);

	return (
		<div id="map-container">
			<div id="map">
				<div id="tooltip"
						style={{ visibility: tooltip ? 'visible' : 'hidden' }}
						dangerouslySetInnerHTML={{ __html: tooltip }}>
				</div>
				<div id="layer-control-buttons">
					<button onClick={ () => setActiveLayer('normal') }
									className={ activeLayer === 'normal' ? 'active' : '' } >
						Normal
					</button>
					<button onClick={ () => setActiveLayer('relief') }
									className={ activeLayer === 'relief' ? 'active' : '' } >
						Relief
					</button>
					<button onClick={ () => setActiveLayer('satellite') }
									className={ activeLayer === 'satellite' ? 'active' : '' } >
						Satellite
					</button>
				</div>
			</div>
			<div id="checkbox-wrapper">
				<div id="checkbox-container">
					{ meteoriteTypes.map((type) => (
						<div key={ type } id="checkbox-div">
							<Checkbox
								id={ `checkbox-${type}` }
								checked={ selectedTypes.has(type) }
								onCheckedChange={() => toggleType(type) }
								style={{ accentColor: colorMeteoriteType[type] }} />
							<label
								htmlFor={ `checkbox-${type}` }
								style={{ color: colorMeteoriteType[type] }} >
								{ type === "null" ? "Sans Type" : type }
							</label>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
