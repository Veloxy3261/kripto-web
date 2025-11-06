import React from 'react';
import './circle.css';
import { useState, useEffect, useRef } from 'react'
import { IconName, IoEye, IoEyeOffSharp } from "react-icons/io5";
import { Link, Outlet } from "react-router-dom";

function BackgroundCircle() {
    
    const circleRef = useRef(null);

    const moveCircleToMouse = (e) => {
      const circle = circleRef.current;
  
      if ( document.activeElement == document.body ) {
        circle.animate(
          {
            left: `${e.clientX - circle.clientHeight / 2}px`,
            top: `${e.clientY - circle.clientWidth / 2}px`,
          },
          { duration: 3000, fill: 'forwards' }
        );
      }
    };

    useEffect(() => {
      document.addEventListener('pointermove', moveCircleToMouse);
  
      return () => {
        document.removeEventListener('pointermove', moveCircleToMouse);
      };
    })


  return (
    <>
        <div class="circle" ref={circleRef}></div>
        <div class="cover"></div>
        <Outlet/>
    </>
  );
}

export default BackgroundCircle;
