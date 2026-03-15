import React from "react";

const page = () => {
  return (
    <div
      className="report-container no-scrollbar"
      style={{
        width: "100%",
        overflow: "hidden",
        paddingTop: "56.25%",
        position: "relative",
      }}
    >
      <iframe
        src="https://lookerstudio.google.com/embed/reporting/1462859d-5d3a-40be-8897-795cb6b6ce63/page/8pGsF"
        frameBorder="0"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: 0,
          overflow: "hidden",
        }}
        scrolling="no"
        allowFullScreen
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
};

export default page;
