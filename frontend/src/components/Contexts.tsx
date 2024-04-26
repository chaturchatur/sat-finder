import { createContext } from "react";
import { GeoJSONFeature, GeoJSONFeatureCollection } from "./MapContainer";
import { MapboxGeoJSONFeature } from "mapbox-gl";

export const MapDataContext = createContext<
  GeoJSONFeatureCollection | undefined
>(undefined);

export const SelectedDataContext = createContext<
  MapboxGeoJSONFeature | GeoJSONFeature | undefined
>(undefined);

export const ArchivesDataContext = createContext(undefined);
