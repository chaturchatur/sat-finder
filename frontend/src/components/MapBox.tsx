import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import { Button, Card, Alert, Select } from "flowbite-react";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";

// import * as turf from "@turf/turf";
// import { geojsonType } from "turf";

function MapBox() {
  const [mapData, setMapData] = useState();
  const [buttonVisiblity, setButtonVisibility] = useState(false);
  const [alertState, setAlertState] = useState({
    color: "warning",
    infoalert: "Location is NOT SET!",
    text: " Please set the location using the map.",
  });

  const mapContainer = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleSubmit = () => {
    axios
      .post("http://localhost:3001/getCatelog", mapData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        navigate("/result", { state: { resultData: response.data } });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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

      map.on("load", () => {
        map.addSource("places", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: { name: "Gandhinagar Thermal Plant" },
                geometry: {
                  coordinates: [72.67293491086241, 23.254176803682284],
                  type: "Point",
                },
              },
            ],
          },
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
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.on("mouseenter", "places", (e) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = "pointer";

        const description = e.features[0].properties.name;
        const coordinates = e.features[0].geometry.coordinates.slice();

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        setAlertState((prevAlertState) => ({
          ...prevAlertState,
          color: "info",
          infoalert: "Location Info:",
          text: ` ${description}`,
        }));
        popup.setLngLat(coordinates).setHTML(description).addTo(map);
      });

      map.on("click", "places", (e) => {
        const description = e.features[0].properties.name;

        setAlertState((prevAlertState) => ({
          ...prevAlertState,
          color: "success",
          infoalert: "Location SET!",
          text: ` ${description}`,
        }));

        map.setPaintProperty("places", "circle-color", [
          "match",
          ["get", "name"], // Get the 'id' property of the feature
          description, // Match if the 'id' is 1
          "#008000", // Color if the match is true
          "#4264fb", // Fallback color if the match is false
        ]);

        setButtonVisibility(true);
      });

      map.on("mouseleave", "places", () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
      });

      // const draw = new MapboxDraw({
      //   displayControlsDefault: false,
      //   // Select which mapbox-gl-draw control buttons to add to the map.
      //   controls: {
      //     polygon: true,
      //     trash: true,
      //   },
      //   // Set mapbox-gl-draw to draw by default.
      //   // The user does not have to click the polygon control button first.
      //   defaultMode: "draw_polygon",
      // });

      map.addControl(new mapboxgl.NavigationControl(), "top-left");

      // function updateArea(event: MapboxEvent) {
      //   const data = draw.getAll();
      //   const geoJson = JSON.stringify(data);
      //   setMapData(geoJson);

      //   if (data.features.length > 0) {
      //     setButtonVisibility(true);
      //     if (event.type === "draw.create") {
      //       setAlertState((prevAlertState) => ({
      //         ...prevAlertState,
      //         color: "success",
      //         infoalert: "Location SET!",
      //         text: " Click the submit button to request data.",
      //       }));
      //     }
      //     if (event.type === "draw.update") {
      //       setAlertState((prevAlertState) => ({
      //         ...prevAlertState,
      //         color: "info",
      //         infoalert: "Location is UPDATED!",
      //         text: " Click the submit button to request data.",
      //       }));
      //     }
      //   }
      //   if (event.type === "draw.delete") {
      //     setButtonVisibility((prevVisibility) => !prevVisibility);
      //     setAlertState((prevAlertState) => ({
      //       ...prevAlertState,
      //       color: "warning",
      //       infoalert: "Location is NOT set!",
      //       text: " Please set the location using the map.",
      //     }));
      //   }
      // }

      // Clean up on unmount
      return () => map.remove();
    }
  }, []);

  return (
    <>
      <div
        ref={mapContainer}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "100%",
        }}
      />
      <Card className="input-box">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Enter Information
        </h5>
        <p className="label-text">Select location from the dropdown</p>
        <Select
          id="location-select"
          onChange={(event) => {
            setAlertState((prevAlertState) => ({
              ...prevAlertState,
              color: "success",
              infoalert: "Location SET!",
              text: ` ${event.target.value}`,
            }));
          }}
        >
          <option>United States</option>
          <option>Canada</option>
          <option>France</option>
          <option>Germany</option>
        </Select>
        <Divider id="divider">OR</Divider>
        <p className="label-text">Choose from the map</p>
      </Card>
      <Card className="calculation-box">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Request Information
        </h5>
        <Alert color={alertState.color}>
          <span className="font-medium">{alertState.infoalert}</span>
          {alertState.text}
        </Alert>

        {buttonVisiblity && (
          <Button id="submit-button" color="purple" onClick={handleSubmit}>
            Submit
            <svg
              className="-mr-1 ml-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              ``
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        )}
      </Card>
    </>
  );
}

export default MapBox;
