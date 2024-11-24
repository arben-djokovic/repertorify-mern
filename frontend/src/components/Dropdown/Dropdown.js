import React, { useEffect, useRef } from 'react'
import "./dropdown.scss"
import {motion} from 'framer-motion'
import { useLocation } from 'react-router-dom';

export default function Dropdown({isEllipsisOpen, setIsEllipsisOpen, children}) {
    const ellipsisRef = useRef(null) 
    const location = useLocation();
    const prevPathname = useRef(location.pathname);

    // Close dropdown only when URL changes
    useEffect(() => {
      if (prevPathname.current !== location.pathname) {
        setIsEllipsisOpen(false);
        prevPathname.current = location.pathname;
      }
    }, [location.pathname, setIsEllipsisOpen]);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if ((ellipsisRef.current && !ellipsisRef.current.contains(event.target)) && event.target.tagName !== "path" && event.target.tagName !== "svg" && !event.target.classList.contains("link") ) {
          setIsEllipsisOpen(false)
        }
      }
  
      if (isEllipsisOpen) {
        document.addEventListener("mousedown", handleClickOutside)
      } else {
        document.removeEventListener("mousedown", handleClickOutside)
      }
      
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isEllipsisOpen, setIsEllipsisOpen, ellipsisRef])
  
  return (<>
        {isEllipsisOpen &&  <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} ref={ellipsisRef} id='ellipsisOpen' className="ellipsisOpen">{children}</motion.div>}
  </>)
}
