import React from "react";
import "./rightSidebar.scss";

export default function RightSidebar() {
  return (
    <div className="rightSidebar">
      <div className="rightSidebarFilter">
        <ul className="custom-list">
          <li>All</li>
          <li>Playlist 2</li>
          <li>Playlist 3</li>
          <li>Playlist 4</li>
          <li>More...</li>
        </ul>
      </div>
    </div>
  );
}
