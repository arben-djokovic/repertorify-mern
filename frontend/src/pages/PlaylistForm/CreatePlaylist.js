import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import "./playlistForm.scss";
import { toast } from "react-toastify";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function CreatePlaylist() {
  const formRef = useRef(null)
  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(false);
  const [selectedImage, setSelectedImage] = useState("/assets/image.png");


  const createPlaylist = async () => {
    console.log("create playlist")
    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData);
    const playlistName = data["name"];
    if(playlistName.length < 3 || playlistName.length > 20) return toast.error("Playlist name must be between 3 and 20 characters")
    try {
      const response = await api.post("/playlists", { name: playlistName, isPublic: isPublic, imageLocation: selectedImage });
      console.log(response);
      if (response.data.success) {
         localStorage.setItem("numberOfPlaylists", Number(localStorage.getItem("numberOfPlaylists")) + 1);
         toast.success(response.data.message);
         navigate("/playlists/" + response.data.playlist._id);
      }
    }catch(err){
      console.log(err)
        if(err.response?.data?.errors){
          toast.error(err.response.data.message)
          err.response.data.errors.forEach((error) => {
             const errorSpan = formRef.current.querySelector(`#${error.field}error`)
             if(errorSpan){
              errorSpan.innerText = `*${error.message}`
             }
          })
        }
      }
  }

  const handleSlideChange = (swiper) => {
    const currentSlide = swiper.slides[swiper.activeIndex];
    const imgElement = currentSlide.querySelector("img");
    if (imgElement) {
      setSelectedImage(imgElement.src.split("/")[4]);
    }
  };

  return (
    <div className="registrationPlaylist page pageContent">
      <div className="formDiv">
        <button onClick={createPlaylist} className="formBtnMobile">Create</button>
        <div className="slider">
          <Swiper navigation={true} modules={[Navigation]} loop={true} centeredSlides={true} onSlideChange={handleSlideChange} className="mySwiper">
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
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="header">
            <h1>Create playlist</h1>
          </div>
          <div className="input">
            <label htmlFor="name">Playlist name</label>
            <input type="text" id="name" name="name" />
          </div>
          <div className="input">
            <div className="radioDiv">
              <div className="radio">
                <input onChange={(e) => {setIsPublic(!e.target.checked)}} type="radio" name="isPrivate" id="private" defaultChecked />
                <label htmlFor="private">Private</label>
              </div>
              <div className="radio">
                <input onChange={(e) => {setIsPublic(e.target.checked)}} type="radio" name="isPrivate" id="public" />
                <label htmlFor="public">Public</label>
              </div>
            </div>
          </div>
          <button onClick={createPlaylist} className="formBtn">Create</button>
        </form>
      </div>
    </div>
  );
}
