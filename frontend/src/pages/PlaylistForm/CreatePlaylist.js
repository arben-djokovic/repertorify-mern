import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import "./playlistForm.scss";

export default function CreatePlaylist() {
  return (
    <div className="registrationPlaylist page pageContent">
      <div className="formDiv">
        <button className="formBtnMobile">Create</button>
        <div className="slider">
          <Swiper navigation={true} modules={[Navigation]} loop={true} centeredSlides={true} className="mySwiper">
            <SwiperSlide>
              <img src="/assets/image.png" alt="testimg" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/assets/image2.png" alt="testimg" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/assets/image3.png" alt="testimg" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/assets/image4.png" alt="testimg" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/assets/image5.png" alt="testimg" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/assets/image6.png" alt="testimg" />
            </SwiperSlide>
          </Swiper>
          <p>Pick a cover picture</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="header">
            <h1>Create playlist</h1>
          </div>
          <div className="input">
            <label htmlFor="username">Playlist name</label>
            <input type="text" id="username" name="username" />
          </div>
          <div className="input">
            <div className="radioDiv">
              <div className="radio">
                <input type="radio" name="radio" id="private" defaultChecked />
                <label htmlFor="private">Private</label>
              </div>
              <div className="radio">
                <input type="radio" name="radio" id="public" />
                <label htmlFor="public">Public</label>
              </div>
            </div>
          </div>
          <button className="formBtn">Create</button>
        </form>
      </div>
    </div>
  );
}
