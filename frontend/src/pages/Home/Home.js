import React, { useEffect, useRef, useState } from "react";
import "./home.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link, useNavigate } from "react-router-dom";
import SongItem from "../../components/SongItem/SongItem";
import api from "../../api/api";

export default function Home() {
  const navigate = useNavigate()
  const swiperRef = useRef(null);
  const [songs, setSongs] = useState([]);

  const fetchSongs = async () => {
    try{
      const respone = await api.get('/songs/home')
      setSongs(respone.data.songs)
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div className="home page">
      <section className="swiperSection">
        <Swiper
          slidesPerView={3}
          initialSlide={1}
          centeredSlides={true}
          modules={[Pagination]}
          className="mySwiper"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {[{
            title: "Rap songs",
            imgSrcs: ["/assets/sobic.jpg", "/assets/sobic.jpg", "/assets/sobic.jpg", "/assets/sobic.jpg"]
          }, {
            title: "ExYu songs",
            imgSrcs: ["/assets/sobic.jpg", "/assets/sobic.jpg", "/assets/sobic.jpg", "/assets/sobic.jpg"]
          }, {
            title: "Pop songs",
            imgSrcs: ["/assets/sobic.jpg", "/assets/sobic.jpg", "/assets/sobic.jpg", "/assets/sobic.jpg"]
          }].map((slide, index) => (
            <SwiperSlide
              key={index}
              onClick={() => swiperRef.current.slideTo(index)}
            >
              <div className="slajd">
                <h1>{slide.title}</h1>
                <div className="slideContent">
                  {slide.imgSrcs.map((src, i) => (
                      <img onClick={(e) => {
                        const list = [...e.target.parentElement.parentElement.parentElement.classList]
                        if(list.includes("swiper-slide-active")){
                          navigate("/songs/6746fb19612b94fd8478421e")
                        }
                      }} src={src} alt="" key={i} />
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="songsHome">
        <h1>Songs</h1>
        <div className="listSongs">
          {songs.map((song, i) => <SongItem song={song} key={i} i={i+1} />)}
        </div>
          <Link to="/songs" className="moreBtn">Show more...</Link>
      </section>
    </div>
  );
}
