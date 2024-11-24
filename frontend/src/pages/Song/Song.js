import React, { useState } from "react";
import "./song.scss";
import {
    faArrowLeft,
    faArrowRight,
  faEllipsisV,
  faFilePdf,
  faMinus,
  faPlus,
  faShuffle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown from "../../components/Dropdown/Dropdown";
import { isAuthenticated } from "../../controllers/TokenController";

export default function Song() {
  const [isEllipsisOpen, setIsEllipsisOpen] = useState(false);
  const songLyrics = `Am         
Dosla si iz plave praznine
C                          G
sa gomile velikih oblaka
Am          
iz dva mlaza žute magle
C                               G
pravo u moj sinocnji san.

Am
Ni kiše ni sunca
C                        G
nema ni svadbi Cigana
Am
prve zvijezde trljaju oči   
C                              G
o kome li ces nocas doći u san.

Ref:
Am       F                  G 
Ja sam nalik čistom zidu,
    E        Am
ti si slika i ram.
Am       F            G
Ja sam prazna tišina
E                                Am
ti najljepsa muzika sto znam
`;

  return (
    <div className="song page pageContent">
      <div className="icons">
        <FontAwesomeIcon className="icon" icon={faFilePdf} />
        {isAuthenticated() && <>
        <FontAwesomeIcon
          id="icon"
          className="modalIcon"
          onClick={(e) => setIsEllipsisOpen(!isEllipsisOpen)}
          icon={faEllipsisV}
        />
        {isEllipsisOpen && (
          <Dropdown
            isEllipsisOpen={isEllipsisOpen}
            setIsEllipsisOpen={setIsEllipsisOpen}
          >
            <p id="ellipsisItem" className="ellipsisItem link">
              Add to playlist
            </p>
            <p id="ellipsisItem" className="ellipsisItem link">
              Edit
            </p>
            <p
              id="ellipsisItem"
              onClick={() => {
                setIsEllipsisOpen(false);
              }}
              className="ellipsisItem link delete"
            >
              Delete
            </p>
          </Dropdown>
        )}
        </>}
      </div>
      <div className="songInfo">
        <h1 className="title">Kome dolazis u san</h1>
        <p>Perper</p>
        <div className="songsBtns">
          <button>
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <p>0</p>
          <button>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <pre className="text">{songLyrics}</pre>
        <div className="arrows">
          <FontAwesomeIcon className="arrow moreBtn link" icon={faArrowLeft} />
          <FontAwesomeIcon className="shuffle link" icon={faShuffle} />
          <FontAwesomeIcon className="arrow moreBtn link" icon={faArrowRight} />
        </div>
      </div>
    </div>
  );
}
