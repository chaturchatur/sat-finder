import { Alert, Button, Card, Badge } from "flowbite-react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useEffect, useState } from "react";

const SideContainer = () => {
  const [url, setUrl] = useState("");
  const currentSelectedImage = useSelector(
    (state: RootState) => state.selectedImage.currentSelectedImage
  );

  useEffect(() => {
    if (currentSelectedImage) {
      const encodedAoi = encodeURIComponent(
        currentSelectedImage?.extendedProps.footprint
      );
      const encodedId = encodeURIComponent(currentSelectedImage?.title);
      setUrl(
        `https://app.skyfi.com/explore/crop/${encodedId}?aoi=${encodedAoi}`
      );
    }
  }, [currentSelectedImage]);

  return (
    <Card className="side-box">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Image Information
      </h5>
      {!currentSelectedImage && (
        <Alert color="warning" rounded>
          <span className="font-medium">Info Alert!</span> Select an image from
          the calendar to view more Information.
        </Alert>
      )}
      {currentSelectedImage?.extendedProps.thumbnailUrls && (
        <img
          src={currentSelectedImage.extendedProps.thumbnailUrls["300x300"]}
          alt=""
        />
      )}
      {currentSelectedImage?.title && (
        <p>
          <strong>Title:</strong> {currentSelectedImage.title}
        </p>
      )}
      {currentSelectedImage?.start && (
        <p>
          <strong>Date:</strong> {currentSelectedImage.start}
        </p>
      )}
      {currentSelectedImage?.extendedProps && (
        <>
          <p>
            <strong>Provider:</strong>{" "}
            {currentSelectedImage.extendedProps.provider} -{" "}
            {currentSelectedImage.extendedProps.constellation}
          </p>
          <p>
            <strong>Resolution:</strong>{" "}
            {currentSelectedImage.extendedProps.resolution}
          </p>
        </>
      )}
      {currentSelectedImage?.extendedProps && (
        <div className="flex gap-2 justify-center">
          <strong>Price:</strong>
          <Badge color="info" size="sm" className="price-badge">
            {currentSelectedImage.extendedProps.totalAreaSquareKm *
              currentSelectedImage.extendedProps.priceForOneSquareKm}{" "}
            $
          </Badge>
        </div>
      )}
      {currentSelectedImage && (
        <Button color="purple">
          <a href={url} target="_blank" rel="noopener noreferrer">
            View on Skyfi
          </a>
        </Button>
      )}
    </Card>
  );
};

export default SideContainer;
