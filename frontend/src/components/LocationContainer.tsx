import { Card, Select } from "flowbite-react";
import Divider from "@mui/material/Divider";
import { useState, useEffect, useContext } from "react";
import { MapDataContext } from "./Contexts";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { setCurrentSelectedValue } from "../app/features/selectedValueSlice";

// import React from "react";
const LocationContainer = () => {
  const [selectValue, setSelectValue] = useState("");
  const mapData = useContext(MapDataContext);

  //redux
  const dispatch = useDispatch();
  const currentSelectedOption = useSelector(
    (state: RootState) => state.seletedValue.currentSelectedValue
  );
  // dispatch(setCurrentSelectedOption(someGeoJSONFeature));

  useEffect(() => {
    if (currentSelectedOption) {
      setSelectValue(currentSelectedOption.properties?.name);
    }
  }, [currentSelectedOption]);

  const items =
    mapData?.features.map((feature) => feature.properties.name) || [];

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = event.target.value;
    const selectedFeature = mapData?.features.find(
      (feature) => feature.properties.name === selectedName
    );
    if (selectedFeature) {
      dispatch(setCurrentSelectedValue(selectedFeature));
    }
  };

  return (
    <>
      <Card className="input-box">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Enter Location
        </h5>
        <p className="label-text">Select location from the dropdown</p>
        <Select
          id="location-select"
          value={selectValue}
          onChange={(event) => handleSelectChange(event)}
        >
          <option>Select plant</option>
          {items.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
        <Divider id="divider">OR</Divider>
        <p className="label-text">Choose from the map</p>
      </Card>
    </>
  );
};

export default LocationContainer;
