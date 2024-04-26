import axios from "axios";
import React, { useState } from "react";
import { hint as geojsonHint } from "@mapbox/geojsonhint";

function Form() {
  const [formData, setFormData] = useState({
    geoJson: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());
    if (geojsonHint(value.geoJson).length === 0) {
      axios
        .post("http://localhost:3001/getCatelog", JSON.stringify(value), {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      console.log("incorrect geojson");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="geoJson">Enter the geo json</label>
      <input
        type="text"
        name="geoJson"
        id="geoJson"
        value={formData.geoJson}
        onChange={handleChange}
      />
      <input type="submit" value="submit" />
    </form>
  );
}

export default Form;
