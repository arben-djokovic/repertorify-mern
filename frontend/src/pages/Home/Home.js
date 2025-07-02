import React, { useEffect, useRef, useState } from "react";
import "./home.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link, useNavigate } from "react-router-dom";
import SongItem from "../../components/SongItem/SongItem";
import api from "../../api/api";
import { Helmet } from "react-helmet-async";

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
      <Helmet>
        <title>Repertorify – Guitar Chords, Lyrics & Songbook</title>
        <meta
          name="description"
          content="Find songs with guitar chords and lyrics, transpose easily, and build your digital songbook on Repertorify. Start playing today."
        />
      </Helmet>
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
                path: "Prljavo Kazalište"
              },
              {
                src: "/assets/parnivaljak.jpg",
                path: "Parni Valjak"
              },
              {
                src: "/assets/plaviorkestar.jpg",
                path: "Plavi Orkestar"
              },
              {
                src: "/assets/dinomerlin.jpg",
                path: "Dino Merlin"
              }
            ]
            }, {
            title: "ExYu songs",
            images: [
              {
                src: "/assets/indexi.jpg",
                path: "Indexi"
              },
              {
                src: "/assets/bijelodugme.jpg",
                path: "Bijelo Dugme"
              },
              {
                src: "/assets/crvenajabuka.jpg",
                path: "Crvena Jabuka"
              },
              {
                src: "/assets/sobic.jpg",
                path: "Miladin Sobic"
              }
            ]          }, {
            title: "Pop songs",
            images: [
              {
                src: "/assets/sars.jpg",
                path: "Sars"
              },
              {
                src: "/assets/tomazdravkovic.jpg",
                path: "Toma Zdravković"
              },
              {
                src: "/assets/yugrupa.jpg",
                path: "YuGrupa"
              },
              {
                src: "/assets/zdravkocolic.jpg",
                path: "Zdravko Čolić"
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
                          navigate("/songs?artist=" + image.path)
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
