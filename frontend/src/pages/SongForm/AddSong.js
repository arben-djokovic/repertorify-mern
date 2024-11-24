import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import "./songForm.scss";

export default function AddSong() {
  return (
    <div className="registrationAddSong page pageContent">
      <div className="formDiv">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="header">
            <h1>Add Song</h1>
          </div>
          <div className="input">
            <label htmlFor="username">Playlist name</label>
            <input type="text" id="username" name="username" />
          </div>
          <div className="input">
            <label htmlFor="username">Text (with acords)</label>
            <textarea  id="username" rows={5} />
          </div>
          <div className="input">
            <label htmlFor="username">Artist</label>
            <input type="text" id="username" name="username" />
          </div>
          <div className="input">
            <div className="genres">
              <label htmlFor="genres">Genre:</label>
              <select name="genres" id="genres">
                <option value=""></option>
                <option value="Pop">Pop</option>
                <option value="Rok">Rok</option>
                <option value="ExYu">ExYu</option>
              </select>
            </div>
          </div>
          <button className="formBtn">Add song</button>
        </form>
      </div>
    </div>
  );
}
