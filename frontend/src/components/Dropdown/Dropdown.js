import React, { useEffect, useRef } from "react";
import "./dropdown.scss";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function Dropdown({
  isEllipsisOpen,
  setIsEllipsisOpen,
  children,
  i,
}) {
  const ellipsisRef = useRef(null);
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
      const i2 = String(i);
      console.log(event.target.classList.contains(i2));
      console.log(event.target.parentElement.classList.contains(i2));
      if (
        (ellipsisRef.current && !ellipsisRef.current.contains(event.target)) 
        || (
          event.target.classList.contains(i2) ||
          event.target.parentElement.classList.contains(i2)
        )
      ) {
        setTimeout(() => {
          setIsEllipsisOpen(false);
        }, 100);
      }
    };

    if (isEllipsisOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEllipsisOpen, setIsEllipsisOpen, ellipsisRef]);

  return (
    <>
      {isEllipsisOpen && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          ref={ellipsisRef}
          id="ellipsisOpen"
          className="ellipsisOpen"
        >
          {children}
        </motion.div>
      )}
    </>
  );
}
