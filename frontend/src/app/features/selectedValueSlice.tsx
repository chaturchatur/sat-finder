import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GeoJSONFeature } from "../../components/MapContainer";

interface SelectedValueState {
  currentSelectedValue: GeoJSONFeature | null;
}

const initialState: SelectedValueState = {
  currentSelectedValue: null,
};

export const selectedValueSlice = createSlice({
  name: "selectedValue",
  initialState,
  reducers: {
    setCurrentSelectedValue: (
      state,
      action: PayloadAction<GeoJSONFeature | null>
    ) => {
      state.currentSelectedValue = action.payload;
    },
  },
});

export const { setCurrentSelectedValue } = selectedValueSlice.actions;

export default selectedValueSlice.reducer;
