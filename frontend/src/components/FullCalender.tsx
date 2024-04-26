import { EventClickArg, EventContentArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEvents } from "./eventUtils";
import SideContainer from "./SideContainer";
import { setCurrentSelectedImage } from "../app/features/selectedImageSlice";
import { useDispatch } from "react-redux";
import {
  removeSelectedImage,
  setCurrentSelectedImages,
} from "../app/features/selectedImagesSlice";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import PriceContainer from "./PriceContainer";

// function renderEventContent(eventContent: EventContentArg) {
//   return (
//     <>
//       <b>{eventContent.timeText}</b>
//       <i>{eventContent.event.title}</i>
//     </>
//   );
// }
const FullCalendarApp = () => {
  const dispatch = useDispatch();
  const events = useEvents();
  const currentSelectedImages = useSelector(
    (state: RootState) => state.selectedImages.currentSelectedImages
  );

  const handleClick = (event: EventClickArg) => {
    dispatch(setCurrentSelectedImage(event));
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    eventContent: EventContentArg
  ) => {
    const isChecked = event.target.checked;
    console.log(isChecked);
    if (isChecked === true) {
      dispatch(setCurrentSelectedImages(eventContent));
    }
    if (isChecked === false) {
      dispatch(removeSelectedImage(eventContent.event.id));
    }
    console.log(currentSelectedImages);
  };

  function renderEventContent(eventContent: EventContentArg) {
    return (
      <div className="text-black bg-blue-300 rounded px-1 py-1 truncate overflow-hidden cursor-pointer">
        <input
          id="image-checkbox"
          type="checkbox"
          className="rounded bg-white mx-1"
          onChange={(event) => handleCheckboxChange(event, eventContent)}
        ></input>
        <b>{eventContent.timeText}</b>
        <i>{eventContent.event.title}</i>
      </div>
    );
  }

  useEffect(() => {
    console.log(currentSelectedImages);
  }, [currentSelectedImages]);

  return (
    <div className="demo-app">
      <div className="demo-app-main">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          editable={false}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          initialEvents={events} // alternatively, use the `events` setting to fetch from a feed
          //   select={this.handleDateSelect}
          eventContent={renderEventContent} // custom render function
          eventClick={handleClick}
          //   eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
          /* you can update a remote database when these fire:
          eventAdd={function(){}}
          eventChange={function(){}}
          eventRemove={function(){}}
          */
        />
        <SideContainer />
        <PriceContainer />
      </div>
    </div>
  );
};

export default FullCalendarApp;
