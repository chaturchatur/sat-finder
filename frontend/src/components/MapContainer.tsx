import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import LocationContainer from "./LocationContainer";
import { MapDataContext } from "./Contexts";
import InfoContainer from "./InfoContainer";
import { useDispatch } from "react-redux";
import { setCurrentSelectedValue } from "../app/features/selectedValueSlice";
import { useSelector } from "react-redux";
import store, { RootState } from "../app/store";

export type GeoJSONFeature = {
  type: "Feature";
  properties: {
    name: string;
    capacity: number;
  };
  geometry: {
    coordinates: number[];
    type: "Point";
  };
};

export type GeoJSONFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
};

function convertToGeoJSONFeature(
  feature: mapboxgl.MapboxGeoJSONFeature
): GeoJSONFeature {
  // Check if the geometry is of type 'Point'
  if (feature.geometry.type === "Point") {
    // Extract the coordinates as a flat array of numbers
    const coordinates = (feature.geometry.coordinates as number[]).flat();

    return {
      type: "Feature",
      properties: {
        name: feature.properties?.name, // Assuming 'name' exists in both types
        capacity: feature.properties?.capacity, // Assuming 'capacity' exists in both types
      }, // Assuming properties are compatible
      geometry: {
        type: "Point",
        coordinates: coordinates,
      },
    };
  }

  throw new Error(`Unsupported geometry type: ${feature.geometry.type}`);
}

interface MapContainerProps {
  geoJsonData: GeoJSONFeatureCollection;
}

const MapContainer = ({ geoJsonData }: MapContainerProps) => {
  const [mapData, setMapData] = useState<
    GeoJSONFeatureCollection | undefined
  >();
  const [mapBoxData, setMapBoxData] = useState<mapboxgl.Map>();
  const mapContainer = useRef<HTMLDivElement>(null);

  //redux
  const dispatch = useDispatch();
  const currentSelectedValue = useSelector(
    (state: RootState) => state.seletedValue.currentSelectedValue
  );

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiY2hhdHVyciIsImEiOiJjbHVmZTAwdDUyMnM2MmtuaWc4Nnc0aHNhIn0.IHNdPFQAHDgvtnNV0uEFvw";

    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [78.47959219762913, 22.168379630747225],
        zoom: 4,
        maxZoom: 15,
      });

      setMapBoxData(map);
      console.log(map);

      map.on("load", () => {
        map.addSource("places", {
          type: "geojson",
          data: geoJsonData,
        });

        map.addLayer({
          id: "places",
          type: "circle",
          source: "places",
          paint: {
            "circle-color": "#4264fb",
            "circle-radius": 6,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          },
        });

        setMapData(geoJsonData);
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.on("mouseenter", "places", (e) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = "pointer";

        const description =
          e.features && e.features.length > 0
            ? e.features[0].properties?.name
            : undefined;

        const coordinates =
          e.features &&
          e.features.length > 0 &&
          e.features[0].geometry.type === "Point"
            ? e.features[0].geometry.coordinates?.slice()
            : undefined;

        if (coordinates) {
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          const lngLat: [number, number] = [coordinates[0], coordinates[1]];
          popup.setLngLat(lngLat).setHTML(description).addTo(map);
        }

        // setAlertState((prevAlertState) => ({
        //   ...prevAlertState,
        //   color: "info",
        //   infoalert: "Location Info:",
        //   text: ` ${description}`,
        // }));
      });

      map.on("click", "places", (e) => {
        const description =
          e.features && e.features.length > 0
            ? e.features[0].properties?.name
            : undefined;

        const feature = e.features && e.features[0];
        if (feature) {
          dispatch(setCurrentSelectedValue(convertToGeoJSONFeature(feature)));
        }
        // setAlertState((prevAlertState) => ({
        //   ...prevAlertState,
        //   color: "success",
        //   infoalert: "Location SET!",
        //   text: ` ${description}`,
        // }));

        map.setPaintProperty("places", "circle-color", [
          "match",
          ["get", "name"], // Get the 'id' property of the feature
          description, // Match if the 'id' is 1
          "#008000", // Color if the match is true
          "#4264fb", // Fallback color if the match is false
        ]);

        // setButtonVisibility(true);
      });

      map.on("mouseleave", "places", () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
      });

      map.addControl(new mapboxgl.NavigationControl(), "top-left");

      // Add map initialization logic here

      return () => map.remove();
    }
  }, []);

  useEffect(() => {
    const handleStateChange = () => {
      if (currentSelectedValue && mapBoxData) {
        mapBoxData.setPaintProperty("places", "circle-color", [
          "match",
          ["get", "name"], // Get the 'id' property of the feature
          currentSelectedValue.properties.name, // Match if the 'id' is 1
          "#4264fb", // Color if the match is true
          "#008000", //008000 // Fallback color if the match is false
        ]);
      }
    };

    // Subscribe to the store
    const unsubscribe = store.subscribe(handleStateChange);

    // Clean up the subscription when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [mapBoxData, currentSelectedValue]);

  return (
    <>
      <div
        ref={mapContainer}
        style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
      />
      <MapDataContext.Provider value={mapData}>
        <LocationContainer />
        <InfoContainer />
      </MapDataContext.Provider>
    </>
  );
};

export default MapContainer;
