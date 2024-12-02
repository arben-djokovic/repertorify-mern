import React from 'react'
import Modal from '../Modal/Modal'
import "./areYouSure.scss"

export default function AreYouSure({setModalOpen, onYes}) {

  return (<Modal setModalOpen={setModalOpen}>
    <div className="areYouSure">
        <h3>Are you sure?</h3>
        <div className="buttons">
            <button className='addBtn' onClick={() => {onYes(); setModalOpen(false) }}>Yes</button>
            <button className='addBtn' onClick={() => setModalOpen(false)}>No</button>
        </div>
    </div>
  </Modal>
  )
}
