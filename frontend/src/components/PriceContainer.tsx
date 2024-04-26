import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { Card, Badge } from "flowbite-react";

const PriceContainer = () => {
  const [price, setPrice] = useState(0);
  const currentSelectedImages = useSelector(
    (state: RootState) => state.selectedImages.currentSelectedImages
  );

  useEffect(() => {
    if (currentSelectedImages) {
      let newPrice = 0;
      currentSelectedImages.forEach((Image) => {
        newPrice +=
          Image.extendedProps.priceForOneSquareKm *
          Image.extendedProps.totalAreaSquareKm;
      });
      setPrice(newPrice);
    }
  }, [currentSelectedImages]);

  return (
    <Card className="price-box">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Total Cost Estimate
      </h5>
      <div className="flex gap-2 justify-center">
        <strong>Total Price</strong>
        <Badge color="info" size="sm" className="price-badge">
          {price}$
        </Badge>
      </div>
    </Card>
  );
};

export default PriceContainer;
