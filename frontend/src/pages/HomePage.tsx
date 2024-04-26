import { Provider } from "react-redux";
import store from "../app/store";
import MapContainer, {
  GeoJSONFeatureCollection,
} from "../components/MapContainer";

function HomePage() {
  const geoJsonData: GeoJSONFeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          name: "Gandhinagar Thermal Plant",
          capacity: 300000,
        },
        geometry: {
          coordinates: [72.67293491086241, 23.254176803682284],
          type: "Point",
        },
      },
      {
        type: "Feature",
        properties: {
          name: "Tata Steel Jamshedpur Steel Plant",
          capacity: 10000000,
        },
        geometry: {
          coordinates: [86.1996, 22.788598],
          type: "Point",
        },
      },
    ],
  };
  return (
    <Provider store={store}>
      <MapContainer geoJsonData={geoJsonData} />
    </Provider>
  );
}

export default HomePage;
