import { combineReducers } from "@reduxjs/toolkit";
import selectedValueReducer from "./features/selectedValueSlice";
import selectedImageReducer from "./features/selectedImageSlice";
import selectedImagesReducer from "./features/selectedImagesSlice";

const rootReducer = combineReducers({
  seletedValue: selectedValueReducer,
  selectedImage: selectedImageReducer,
  selectedImages: selectedImagesReducer,
});

export default rootReducer;
