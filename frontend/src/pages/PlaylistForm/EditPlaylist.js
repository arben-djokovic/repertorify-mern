import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import "./playlistForm.scss";
import { toast } from "react-toastify";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../../controllers/TokenController"

export default function EditPlaylist() {
  const formRef = useRef(null)
  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(false);
  const [selectedImage, setSelectedImage] = useState("image.png");
  const [initialSlide, setInitialSlide] = useState(0);
  const [playlistName, setPlaylistName] = useState("")
  const { id } = useParams();
  const { getDecodedToken } = useToken();

  const editPlaylist = async () => {
    console.log(isPublic)
    console.log(selectedImage)
    console.log(playlistName)
    if(playlistName.length < 3 || playlistName.length > 20) return toast.error("Playlist name must be between 3 and 20 characters")

    try{
      const response = await api.put("/playlists/" + id, { name: playlistName, isPublic: isPublic, imageLocation: selectedImage })
    }catch(err){
      console.log(err)
    }
  }

  const fetchPlaylist = async () => {
    try{
      const response = await api.get("/playlists/" + id)
      console.log(response)
      if(response.data.success){
        const imageLocation = response.data.playlist.imageLocation
        setIsPublic(response.data.playlist.isPublic)
        setPlaylistName(response.data.playlist.name)
        setSelectedImage(imageLocation)
        if(imageLocation === "image.png") {
          setInitialSlide(1)
        }else if(imageLocation === "image2.png") {
          setInitialSlide(2)
        }else if(imageLocation === "image3.png") {
          setInitialSlide(3)
        }else if(imageLocation === "image4.png") {
          setInitialSlide(4)
        }else if(imageLocation === "image5.png") {
          setInitialSlide(5)
        }else if(imageLocation === "image6.png") {
          setInitialSlide(6)
        }
      }
      console.log(getDecodedToken())
      if(getDecodedToken() === null || (getDecodedToken()._id !== response.data.playlist.user._id && getDecodedToken().role !== "admin")) navigate("/")
    }catch(err){
      console.log(err)
    }
  }

  const handleSlideChange = (swiper) => {
    const currentSlide = swiper.slides[swiper.activeIndex];
    const imgElement = currentSlide.querySelector("img");
    if (imgElement) {
      setSelectedImage(imgElement.src.split("/")[4]);
    }
  };


  useEffect(()=>{
    fetchPlaylist()
  },[])

  return (
    <div className="registrationPlaylist page pageContent">
      <div className="formDiv">
        <button onClick={editPlaylist} className="formBtnMobile">Edit playlist</button>
        <div className="slider">
          {initialSlide && <Swiper navigation={true} modules={[Navigation]} loop={true} centeredSlides={true}
          initialSlide={initialSlide - 1}
          onSlideChange={handleSlideChange} className="mySwiper">
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
          </Swiper>}
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
            <input onChange={(e) => {setPlaylistName(e.target.value)}} value={playlistName} type="text" id="name" name="name" />
          </div>
          <div className="input">
            <div className="radioDiv">
              <div className="radio">
                {isPublic && <input onChange={(e) => {setIsPublic(!e.target.checked)}} type="radio" name="isPrivate" id="private"  />}
                {!isPublic && <input onChange={(e) => {setIsPublic(!e.target.checked)}} type="radio" name="isPrivate" id="private" defaultChecked />}
                <label htmlFor="private">Private</label>
              </div>
              <div className="radio">
                {isPublic && <input onChange={(e) => {setIsPublic(e.target.checked)}}  type="radio" name="isPrivate" id="public" defaultChecked  />}
                {!isPublic && <input onChange={(e) => {setIsPublic(e.target.checked)}}  type="radio" name="isPrivate" id="public"  />}
                <label htmlFor="public">Public</label>
              </div>
            </div>
          </div>
          <button onClick={editPlaylist} className="formBtn">Edit playlist</button>
        </form>
      </div>
    </div>
  );
}
