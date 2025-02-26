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
            images: [
              {
                src: "/assets/prljavokazaliste.png",
                id: "6759e303653772529493360f"
              },
              {
                src: "/assets/parnivaljak.jpg",
                id: "675355a9e1018a6dedd926bc"
              },
              {
                src: "/assets/plaviorkestar.jpg",
                id: "6746fb19612b94fd8478421e"
              },
              {
                src: "/assets/dinomerlin.jpg",
                id: "6759e4706537725294933880"
              }
            ]
            }, {
            title: "ExYu songs",
            images: [
              {
                src: "/assets/indexi.jpg",
                id: "6753575de1018a6dedd92832"
              },
              {
                src: "/assets/bijelodugme.jpg",
                id: "6746fb19612b94fd8478421e"
              },
              {
                src: "/assets/crvenajabuka.jpg",
                id: "675758367c72a70f4ff2f70d"
              },
              {
                src: "/assets/sobic.jpg",
                id: "6746fb19612b94fd8478421e"
              }
            ]          }, {
            title: "Pop songs",
            images: [
              {
                src: "/assets/sars.jpg",
                id: "6746fb19612b94fd8478421e"
              },
              {
                src: "/assets/tomazdravkovic.jpg",
                id: "6755e355729c6c11f761e750"
              },
              {
                src: "/assets/yugrupa.jpg",
                id: "6746fb19612b94fd8478421e"
              },
              {
                src: "/assets/zdravkocolic.jpg",
                id: "6759de8d6537725294933225"
              }
            ]          }].map((slide, index) => (
            <SwiperSlide
              key={index}
              onClick={() => swiperRef.current.slideTo(index)}
            >
              <div className="slajd">
                <h1>{slide.title}</h1>
                <div className="slideContent">
                  {slide.images.map((image, i) => (
                      <img onClick={(e) => {
                        const list = [...e.target.parentElement.parentElement.parentElement.classList]
                        if(list.includes("swiper-slide-active")){
                          navigate("/songs/" + image.id)
                        }
                      }} src={image.src} alt="" key={i} />
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
