import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventContentArg } from "@fullcalendar/core";

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

// Adjust the SelectedImagesState interface to include an array of images
interface SelectedImagesState {
  currentSelectedImages: Array<{
    id: string;
    title: string;
    start: string;
    extendedProps: ExtendedProps;
  }>;
}

const initialState: SelectedImagesState = {
  currentSelectedImages: [],
};

export const selectedImagesSlice = createSlice({
  name: "selectedImages",
  initialState,
  reducers: {
    setCurrentSelectedImages: (
      state,
      action: PayloadAction<EventContentArg | null>
    ) => {
      if (action.payload) {
        // Add the new image to the array
        state.currentSelectedImages.push({
          id: action.payload.event.id,
          title: action.payload.event.title,
          start: action.payload.event.startStr,
          extendedProps: action.payload.event.extendedProps as ExtendedProps, // Cast to ExtendedProps
        });
      } else {
        // Optionally, clear the array if the payload is null
        state.currentSelectedImages = [];
      }
    },
    removeSelectedImage: (
      state,
      action: PayloadAction<string> // Assuming the payload is the ID of the image to remove
    ) => {
      state.currentSelectedImages = state.currentSelectedImages.filter(
        (image) => image.id !== action.payload
      );
    },
  },
});

export const { setCurrentSelectedImages, removeSelectedImage } =
  selectedImagesSlice.actions;

export default selectedImagesSlice.reducer;
