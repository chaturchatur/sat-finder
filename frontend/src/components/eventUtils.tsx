// eventUtils.tsx
import { EventInput } from "@fullcalendar/core";
import { ArchivesDataContext } from "./Contexts";
import { useContext } from "react";

let eventGuid = 0;

export function createEventId() {
  return String(eventGuid++);
}

export function useEvents() {
  const archives = useContext(ArchivesDataContext);

  const events: EventInput[] =
    archives?.map((archive, index) => ({
      id: createEventId(),
      title: archive.archiveId,
      start: archive.captureTimestamp,
      extendedProps: {
        provider: archive.provider,
        constellation: archive.constellation,
        productType: archive.productType,
        platformResolution: archive.platformResolution,
        resolution: archive.resolution,
        captureTimestamp: archive.captureTimestamp,
        cloudCoveragePercent: archive.cloudCoveragePercent,
        offNadirAngle: archive.offNadirAngle,
        footprint: archive.footprint,
        minSqKm: archive.minSqKm,
        maxSqKm: archive.maxSqKm,
        priceForOneSquareKm: archive.priceForOneSquareKm,
        openData: archive.openData,
        totalAreaSquareKm: archive.totalAreaSquareKm,
        deliveryTimeHours: archive.deliveryTimeHours,
        thumbnailUrls: archive.thumbnailUrls,
        gsd: archive.gsd,
        tilesUrl: archive.tilesUrl,
        overlapRatio: archive.overlapRatio,
        overlapSqkm: archive.overlapSqkm,
      },
    })) || [];

  return events;
}
