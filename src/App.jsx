
import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

gsap.registerPlugin(ScrollTrigger);

const asset = (name) => `${import.meta.env.BASE_URL}${name}`;

export default function App() {
  useEffect(() => {
    const main = document.querySelector(".smooth-scroll");
    const cookie = document.querySelector("#cookie");

    if (!main || !cookie) return;

    let locoScroll;
    let timeline;
    let resizeTimer;

    const secondO = document.querySelector(".cookie-slot");
    const tasteBox = document.querySelector(".img-section");
    const monsterTarget = document.querySelector(".monster-cookie-target");

    if (!secondO || !tasteBox || !monsterTarget) return;

    locoScroll = new LocomotiveScroll({
      el: main,
      smooth: true,
      multiplier: 1,
      smartphone: { smooth: true },
      tablet: { smooth: true },
    });

    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(main, {
      scrollTop(value) {
        if (arguments.length) {
          locoScroll.scrollTo(value, {
            duration: 0,
            disableLerp: true,
          });
        } else {
          return locoScroll.scroll.instance.scroll.y;
        }
      },

      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },

      pinType: main.style.transform ? "transform" : "fixed",
    });

    ScrollTrigger.defaults({
      scroller: main,
    });

    const updateScroll = () => {
      locoScroll.update();
    };

    ScrollTrigger.addEventListener("refresh", updateScroll);

    const getPosition = (element) => {
      const rect = element.getBoundingClientRect();
      const mainRect = main.getBoundingClientRect();

      return {
        x: rect.left - mainRect.left + rect.width / 2,
        y: rect.top - mainRect.top + rect.height / 2,
      };
    };

    const initialize = () => {
      if (!cookie.naturalWidth) return;

      locoScroll.update();

      const start = getPosition(secondO);
      const slotRect = secondO.getBoundingClientRect();

      start.y += slotRect.height * 0.2;

      const initialCookieSize = Math.min(
        slotRect.height * 0.76,
        slotRect.width * 0.92
      );

      gsap.set(cookie, {
        left: start.x,
        top: start.y,
        xPercent: -50,
        yPercent: -50,
        rotation: 0,
        width: initialCookieSize,
      });

      timeline?.scrollTrigger?.kill();
      timeline?.kill();

      timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".second-section",
          start: 0,
          endTrigger: ".third-section",
          end: "center center",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // First movement: Hero to taste section
      timeline.to(cookie, {
        left: () => getPosition(tasteBox).x,
        top: () => getPosition(tasteBox).y,
        rotation: 15,
        width: () => window.innerWidth * 0.13,
        ease: "none",
        duration: 1,
      });

      // Second movement: Taste section to Monster product
      timeline.to(cookie, {
        left: () => getPosition(monsterTarget).x,
        top: () => getPosition(monsterTarget).y,
        rotation: -20,
        width: () => {
          const sugarImage = document.querySelector(
            ".product-card .cooki-sm"
          );

          return sugarImage
            ? sugarImage.getBoundingClientRect().width
            : window.innerWidth * 0.1;
        },
        ease: "none",
        duration: 1,
      });

      ScrollTrigger.refresh();
    };

    const imageReady = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(initialize);
      });
    };

    if (cookie.complete && cookie.naturalWidth > 0) {
      imageReady();
    } else {
      cookie.addEventListener("load", imageReady, { once: true });
    }

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initialize, 250);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);

      cookie.removeEventListener("load", imageReady);

      timeline?.scrollTrigger?.kill();
      timeline?.kill();

      ScrollTrigger.removeEventListener("refresh", updateScroll);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      locoScroll.destroy();
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: auto;
        }

        body {
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
          overflow-x: hidden;
        }

        .smooth-scroll {
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        .container {
          width: 80%;
          max-width: 1500px;
          margin: auto;
        }

        .cta-btn {
          border: 1px solid #552c10;
          padding: 12px 28px;
          border-radius: 30px;
          color: #552c10;
          display: inline-block;
          text-decoration: none;
          transition: 0.3s ease;
        }

        .cta-btn:hover {
          background: #552c10;
          color: white;
        }

        /* HERO */

        .hero-section {
          width: 100%;
          min-height: 100vh;
          background: white;
          position: relative;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .hero-section .container {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-content {
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .hero-content h1.cookie-title {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20.5vw;
          font-weight: 900;
          color: #552c10;
          letter-spacing: -1.2vw;
          white-space: nowrap;
          line-height: 1;
        }

        .cookie-slot {
          display: inline-block;
          position: relative;
          width: 0.72em;
          height: 0.85em;
          flex-shrink: 0;
        }

        .hero-content img {
          position: absolute;
          pointer-events: none;
        }

        .hero-content .choco-chips {
          width: 12vw;
          top: 60%;
          left: 35%;
          z-index: 1;
        }

        .hero-content .peanut {
          width: 12vw;
          left: 90%;
          top: 45%;
          transform: translate(-40%, -90%);
          z-index: 0;
        }

        /* MOVING COOKIE */

        #cookie {
          position: absolute;
          width: 180px;
          height: auto;
          z-index: 20;
          pointer-events: none;
          object-fit: contain;
          filter: drop-shadow(0 10px 5px rgba(37,37,37,0.12));
          will-change: left, top, transform, width;
        }

        /* TASTE SECTION */

        .second-section {
          width: 100%;
          min-height: 100vh;
          background: rgba(85, 44, 16, 0.2);
          position: relative;
        }

        .second-section .container {
          min-height: 100vh;
        }

        .content-wrapper {
          min-height: 100vh;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .img-section {
          flex-basis: 50%;
          height: 100vh;
          position: relative;
        }

        .content-section {
          flex-basis: 50%;
          padding-left: 30px;
        }

        .content-section h2 {
          font-size: 5vw;
          line-height: 1;
          color: #552c10;
          font-weight: 900;
        }

        .sub-heading {
          font-size: 1.5vw;
          margin: 15px 0 25px;
          color: #552c10;
        }

        .content-section p {
          line-height: 30px;
          font-size: 15px;
          color: #29221e;
        }

        /* PRODUCT SECTION */

        .third-section {
          width: 100%;
          min-height: 100vh;
          background: white;
          position: relative;
        }

        .third-section .container {
          min-height: 100vh;
        }

        .third-section .content-wrapper {
          min-height: 100vh;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 3vw;
        }

        .product-card {
          background: #552c10;
          color: white;
          text-align: center;
          flex: 1 1 30%;
          height: 35vh;
          min-height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding: 35px 15px;
          border-radius: 30px;
          position: relative;
        }

        .product-card h4 {
          font-size: 2vw;
          font-weight: 700;
          position: relative;
          z-index: 2;
          white-space: nowrap;
        }

        .product-card .cta-btn {
          color: white;
          border-color: white;
          margin-top: 20px;
          position: relative;
          z-index: 2;
        }

        .product-card .cta-btn:hover {
          background: white;
          color: #552c10;
        }

        .product-card .cooki-sm {
          width: 10vw;
          max-width: 140px;
          height: auto;
          position: absolute;
          top: -35%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
          pointer-events: none;
        }

        .monster-cookie-target {
          position: absolute;
          width: 10vw;
          max-width: 140px;
          aspect-ratio: 1 / 1;
          top: -35%;
          left: 50%;
          transform: translateX(-50%);
          visibility: hidden;
          pointer-events: none;
        }

        /* LARGE SCREENS */

        @media (min-width: 1600px) {
          .hero-content h1.cookie-title {
            font-size: 18vw;
          }

          .container {
            width: 75%;
          }

          .content-section h2 {
            font-size: 75px;
          }

          .product-card h4 {
            font-size: 30px;
          }
        }

        /* LAPTOP */

        @media (max-width: 1200px) {
          .container {
            width: 88%;
          }

          .hero-content h1.cookie-title {
            font-size: 20vw;
          }

          .content-section h2 {
            font-size: 5.5vw;
          }

          .product-card {
            height: 32vh;
          }

          .product-card h4 {
            font-size: 2.2vw;
          }
        }

        /* TABLET */

        @media (max-width: 900px) {
          .container {
            width: 90%;
          }

          .hero-content h1.cookie-title {
            font-size: 19vw;
            letter-spacing: -1vw;
          }

          .hero-content .choco-chips,
          .hero-content .peanut {
            width: 16vw;
          }

          .second-section,
          .third-section {
            min-height: 100vh;
            padding: 60px 0;
          }

          .second-section .content-wrapper {
            gap: 20px;
          }

          .img-section {
            flex-basis: 45%;
            height: 70vh;
          }

          .content-section {
            flex-basis: 55%;
            padding-left: 15px;
          }

          .content-section h2 {
            font-size: 6vw;
          }

          .sub-heading {
            font-size: 2vw;
          }

          .content-section p {
            font-size: 14px;
            line-height: 26px;
          }

          .third-section .content-wrapper {
            gap: 18px;
          }

          .product-card {
            height: 280px;
            min-width: 0;
            border-radius: 22px;
          }

          .product-card h4 {
            font-size: 2.3vw;
          }

          .product-card .cooki-sm,
          .monster-cookie-target {
            width: 13vw;
          }
        }

        /* MOBILE */

        @media (max-width: 600px) {
          .container {
            width: 90%;
          }

          .hero-section,
          .hero-content {
            min-height: 85vh;
          }

          .hero-content h1.cookie-title {
            font-size: 20vw;
            letter-spacing: -1vw;
          }

          .hero-content .choco-chips {
            width: 25vw;
            top: 65%;
            left: 20%;
          }

          .hero-content .peanut {
            width: 24vw;
            left: 88%;
            top: 38%;
          }

          .second-section,
          .third-section {
            min-height: 100vh;
            padding: 55px 0;
          }

          .second-section .container {
            min-height: 100vh;
          }

          .second-section .content-wrapper {
            min-height: 100vh;
            flex-direction: column;
            justify-content: center;
            align-items: stretch;
            gap: 20px;
          }

          .img-section {
            width: 100%;
            height: 35vh;
            min-height: 180px;
            flex-basis: auto;
          }

          .content-section {
            width: 100%;
            flex-basis: auto;
            padding: 0;
          }

          .content-section h2 {
            font-size: 10vw;
          }

          .sub-heading {
            font-size: 4vw;
            margin: 12px 0 18px;
          }

          .content-section p {
            font-size: 13px;
            line-height: 24px;
          }

          .third-section .container {
            min-height: auto;
          }

          .third-section .content-wrapper {
            min-height: auto;
            flex-direction: column;
            gap: 100px;
            padding: 70px 0 50px;
          }

          .product-card {
            width: 100%;
            min-height: 240px;
            height: 250px;
            flex: none;
            border-radius: 25px;
          }

          .product-card h4 {
            font-size: 6vw;
          }

          .product-card .cooki-sm,
          .monster-cookie-target {
            width: 32vw;
            max-width: 125px;
            top: -35%;
          }

          .product-card .cta-btn {
            margin-top: 15px;
          }
        }

        /* SMALL MOBILE */

        @media (max-width: 380px) {
          .hero-content h1.cookie-title {
            font-size: 19vw;
            letter-spacing: -0.9vw;
          }

          .hero-section,
          .hero-content {
            min-height: 75vh;
          }

          .content-section h2 {
            font-size: 9vw;
          }

          .product-card {
            height: 220px;
            min-height: 220px;
          }

          .product-card h4 {
            font-size: 5.5vw;
          }
        }
      `}</style>

      <main className="smooth-scroll" data-scroll-container>

        {/* HERO SECTION */}

        <section className="hero-section">
          <div className="container">
            <div className="hero-content">

              <h1 className="cookie-title">
                <span>C</span>
                <span>o</span>
                <span className="cookie-slot"></span>
                <span>kie</span>
              </h1>

              <img
                src={asset("choco-chips.png")}
                alt="Chocolate Chips"
                className="choco-chips"
              />

              <img
                src={asset("peanut.png")}
                alt="Peanut"
                className="peanut"
              />

            </div>
          </div>
        </section>

        {/* MOVING COOKIE */}

        <img
          src={asset("cookie.png")}
          alt="Chocolate Cookie"
          id="cookie"
        />

        {/* TASTE SECTION */}

        <section className="second-section">
          <div className="container">
            <div className="content-wrapper">

              <div className="img-section"></div>

              <div className="content-section">
                <h2>TASTE THE DIFFERENCE.</h2>

                <div className="sub-heading">
                  Real Eggs, Real Butter, Real Sugar.
                </div>

                <p>
                  Cookie Co. was founded in 2020 during the height
                  of the Covid-19 pandemic by Elise and Matt Thomas.
                  Working behind the scenes to open the first Cookie
                  Co. location, Elise baked her signature cookie
                  recipes using real eggs, real butter, and real
                  cane sugar in her home, preparing hundreds of
                  boxes weekly by hand for driveway pick-up.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* PRODUCT SECTION */}

        <section className="third-section">
          <div className="container">
            <div className="content-wrapper">

              <div className="product-card">
                <img
                  src={asset("images.png")}
                  className="cooki-sm"
                  alt="Frosted Sugar Cookie"
                />

                <h4>FROSTED SUGAR</h4>

                <a href="#products" className="cta-btn">
                  Buy Now
                </a>
              </div>

              <div className="product-card monster-card">
                <div className="monster-cookie-target"></div>

                <h4>MONSTER</h4>

                <a href="#products" className="cta-btn">
                  Buy Now
                </a>
              </div>

              <div className="product-card">
                <img
                  src={asset("oreo.png")}
                  className="cooki-sm"
                  alt="Oreo Cookie"
                />

                <h4>OREO</h4>

                <a href="#products" className="cta-btn">
                  Buy Now
                </a>
              </div>

            </div>
          </div>
        </section>

      </main>
    </>
  );
}
