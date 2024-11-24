import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import "./modal.scss"

export default function Modal({children, setModalOpen}) {
  return (<><div className='modalDiv'>
    <div className='modal'>
        <FontAwesomeIcon onClick={() => setModalOpen(false)} className='modalIcon' icon={faTimes} />
        {children}
    </div>
  </div>
    <div onClick={() => setModalOpen(false)} className="closeModal"></div>
  </>)
}
