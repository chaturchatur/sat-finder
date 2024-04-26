import { Button, Card, Alert } from "flowbite-react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const InfoContainer = () => {
  const [visibility, setVisibility] = useState(true);
  const [alertState, setAlertState] = useState({
    color: "warning",
    infoalert: "Location is NOT SET!",
    text: " Please set the location using the map.",
  });
  const currentSelectedOption = useSelector(
    (state: RootState) => state.seletedValue.currentSelectedValue
  );
  const selectedName = currentSelectedOption?.properties?.name;
  const selectedCapacity = currentSelectedOption?.properties?.capacity;
  const navigate = useNavigate();

  const handleSubmit = () => {
    axios
      .post("http://localhost:3001/getCatelog", currentSelectedOption, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        navigate("/result", { state: { resultData: response.data } });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (currentSelectedOption) {
      setVisibility(false);
      setAlertState((prevAlertState) => ({
        ...prevAlertState,
        color: "info",
        infoalert: `${selectedName}`,
        text: `Capacity: ${selectedCapacity}`,
      }));
    } else {
      setVisibility(true);
    }
  }, [currentSelectedOption]);

  return (
    <Card className="info-box">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Location Information
      </h5>
      <Alert className="info-alert" color={alertState.color}>
        <span className="font-bold">{alertState.infoalert}</span>
        <br />
        {alertState.text}
      </Alert>
      {/* <p>{selectedName}</p>
      <p>{selectedCapacity}</p> */}
      <Button color="purple" onClick={handleSubmit} disabled={visibility}>
        Monitor Plant
        <svg
          className="-mr-1 ml-2 h-4 w-4"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </Button>
    </Card>
  );
};

export default InfoContainer;
