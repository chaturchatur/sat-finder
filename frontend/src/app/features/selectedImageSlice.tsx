import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventClickArg } from "@fullcalendar/core";

// Define a type for the extendedProps you're storing
interface ExtendedProps {
  provider: string;
  constellation: string;
  productType: string;
  platformResolution: number;
  resolution: string;
  captureTimestamp: string;
  cloudCoveragePercent: number;
  offNadirAngle: number;
  footprint: string;
  minSqKm: number;
  maxSqKm: number;
  priceForOneSquareKm: number;
  openData: boolean;
  totalAreaSquareKm: number;
  deliveryTimeHours: number;
  thumbnailUrls: {
    "300x300": string;
    "2048x2048": string;
  };
  gsd: number;
  tilesUrl: string;
  overlapRatio: number;
  overlapSqkm: number;
}

// Adjust the SelectedImageState interface to include extendedProps
interface SelectedImageState {
  currentSelectedImage: {
    id: string;
    title: string;
    start: string;
    extendedProps: ExtendedProps;
  } | null;
}

const initialState: SelectedImageState = {
  currentSelectedImage: null,
};

export const selectedImageSlice = createSlice({
  name: "selectedImage",
  initialState,
  reducers: {
    setCurrentSelectedImage: (
      state,
      action: PayloadAction<EventClickArg | null>
    ) => {
      if (action.payload) {
        state.currentSelectedImage = {
          id: action.payload.event.id,
          title: action.payload.event.title,
          start: action.payload.event.startStr,
          extendedProps: action.payload.event.extendedProps as ExtendedProps, // Cast to ExtendedProps
        };
      } else {
        state.currentSelectedImage = null;
      }
    },
  },
});

export const { setCurrentSelectedImage } = selectedImageSlice.actions;

export default selectedImageSlice.reducer;
