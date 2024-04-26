// import React from "react";
import DemoApp from "../components/FullCalender";
import { useLocation } from "react-router-dom";
import { ArchivesDataContext } from "../components/Contexts";
import store from "../app/store";
import { Provider } from "react-redux";

function ResultPage() {
  const location = useLocation();
  const data = location.state?.resultData;
  return (
    <Provider store={store}>
      <ArchivesDataContext.Provider value={data.archives}>
        <DemoApp />
      </ArchivesDataContext.Provider>
    </Provider>
  );
}

export default ResultPage;
