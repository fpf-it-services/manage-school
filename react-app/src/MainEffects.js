import React, { useEffect } from "react";

const MainEffects = () => {
  useEffect(() => {
    /**
     * Scroll Detection for Adding "scrolled" Class
     */
    const toggleScrolled = () => {
      const selectBody = document.querySelector("body");
      const selectHeader = document.querySelector("#header");

      if (!selectBody || !selectHeader) return;
      if (
        !selectHeader.classList.contains("scroll-up-sticky") &&
        !selectHeader.classList.contains("sticky-top") &&
        !selectHeader.classList.contains("fixed-top")
      )
        return;

      window.scrollY > 100
        ? selectBody.classList.add("scrolled")
        : selectBody.classList.remove("scrolled");
    };

    document.addEventListener("scroll", toggleScrolled);
    window.addEventListener("load", toggleScrolled);

    /**
     * Mobile Navigation Toggle
     */
    const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

    const mobileNavToogle = () => {
      document.querySelector("body").classList.toggle("mobile-nav-active");
      mobileNavToggleBtn.classList.toggle("bi-list");
      mobileNavToggleBtn.classList.toggle("bi-x");
    };

    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.addEventListener("click", mobileNavToogle);
    }

    /**
     * Initialize PureCounter via CDN
     */
    if (window.PureCounter) {
      new window.PureCounter();
    }

    return () => {
      document.removeEventListener("scroll", toggleScrolled);
      document.removeEventListener("scroll", toggleScrollTop);
      window.removeEventListener("load", toggleScrolled);
      window.removeEventListener("load", toggleScrollTop);
    };
  }, []);

  return null;
};

export default MainEffects;
