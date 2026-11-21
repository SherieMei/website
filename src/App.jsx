
import { useState } from "react";
import "./App.css";
import LotusCursor from "./LotusCursor";
import ThreeDScene from "./ThreeDScene";


function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
  <div className="website" id="home">
    <LotusCursor />
    <div className="ambient-world" aria-hidden="true">
      <span className="ambient-orb orb-one"></span>
      <span className="ambient-orb orb-two"></span>
      <span className="ambient-orb orb-three"></span>
      <span className="ambient-orb orb-four"></span>
      <span className="ambient-star star-five">✧</span>
<span className="ambient-star star-six">✦</span>
<span className="ambient-star star-seven">✳</span>

<span className="ambient-bubble bubble-seven"></span>
<span className="ambient-bubble bubble-eight"></span>
<span className="ambient-bubble bubble-nine"></span>

<span className="ambient-orb orb-five"></span>
<span className="ambient-orb orb-six"></span>

      <span className="ambient-bubble bubble-one"></span>
      <span className="ambient-bubble bubble-two"></span>
      <span className="ambient-bubble bubble-three"></span>
      <span className="ambient-bubble bubble-four"></span>
      <span className="ambient-bubble bubble-five"></span>
      <span className="ambient-bubble bubble-six"></span>

      <span className="ambient-star star-one">✦</span>
      <span className="ambient-star star-two">✧</span>
      <span className="ambient-star star-three">✳</span>
      <span className="ambient-star star-four">✦</span>
    </div>

      {/* NAVIGATION */}
      <nav className="navbar">
        <a href="#home" className="logo">
          SHE<span>.</span>
        </a>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>Our Space</a>
          <a href="#features" onClick={() => setMenuOpen(false)}>Discover</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Connect</a>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">

          <div className="hero-tag">
            <span className="tag-dot"></span>
            A LITTLE SPACE TO CREATE
          </div>

          <p className="hero-label">WELCOME TO SHE</p>

          <h1>
            A world of
            <br />
            your <span>own.</span>
          </h1>

          <p className="hero-description">
            A space where creativity blooms, ideas take shape,
            and little things turn into something extraordinary.
            Explore a world made to inspire you.
          </p>

          <div className="hero-buttons">
            <a href="#features" className="btn-primary">
              Explore the space <span>↗</span>
            </a>

            <a href="#about" className="btn-secondary">
              Discover SHE
            </a>
          </div>

          <div className="hero-bottom-note">
            <span>CREATIVITY</span>
            <span className="note-divider">✦</span>
            <span>IMAGINATION</span>
            <span className="note-divider">✦</span>
            <span>EXPLORATION</span>
          </div>
        </div>

        {/* 3D LOTUS */}
        <div className="hero-visual">
          <div className="visual-glow"></div>

          <div className="floating-label label-top">
            <span>✦</span> DREAM IN COLOR
          </div>

          <div className="lotus-scene">
            <ThreeDScene />
          </div>

          <div className="floating-label label-bottom">
            A universe of possibilities
          </div>

          <div className="decor decor-star">✦</div>
          <div className="decor decor-sparkle">✧</div>
          <div className="decor decor-circle"></div>
        </div>

        <div className="hero-scroll">
          <span>SCROLL TO EXPLORE</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="section-heading">
          <div className="section-eyebrow">
            <span>01</span> — THE SHE EXPERIENCE
          </div>

          <h2>
            A little bit of
            <span> everything.</span>
          </h2>

          <p>
            Explore the different things that make this space
            special. Curiosity is always welcome here.
          </p>
        </div>

        <div className="feature-grid">

          <div className="feature-card feature-lavender">
            <div className="feature-top">
              <span className="feature-number">01</span>
              <span className="feature-icon">✳</span>
            </div>

            <h3>Create</h3>

            <p>
              Turn your thoughts, imagination, and ideas
              into something uniquely yours.
            </p>

            <a href="#about" className="feature-link">Discover more ↗</a>
          </div>

          <div className="feature-card feature-pink">
            <div className="feature-top">
              <span className="feature-number">02</span>
              <span className="feature-icon">♡</span>
            </div>

            <h3>Explore</h3>

            <p>
              Wander through new experiences, discover
              inspiration, and see things differently.
            </p>

            <a href="#about" className="feature-link">Discover more ↗</a>
          </div>

          <div className="feature-card feature-blue">
            <div className="feature-top">
              <span className="feature-number">03</span>
              <span className="feature-icon">✧</span>
            </div>

            <h3>Imagine</h3>

            <p>
              Let your creativity grow without limits.
              There is always room for something new.
            </p>

            <a href="#about" className="feature-link">Discover more ↗</a>
          </div>

        </div>
      </section>

      {/* ABOUT */}
      <section className="about" id="about">
        <div className="about-visual">
          <div className="about-orbit orbit-one"></div>
          <div className="about-orbit orbit-two"></div>

          <div className="about-art">
            <span className="about-art-star">✦</span>
            <span className="about-art-flower">✿</span>
            <span className="about-art-sparkle">✧</span>
            <span className="about-art-circle"></span>
          </div>

          <div className="about-sticker">
            <span>MADE WITH</span>
            <strong>♡</strong>
            <span>IMAGINATION</span>
          </div>
        </div>

        <div className="about-content">
          <div className="section-eyebrow">
            <span>02</span> — GET TO KNOW US
          </div>

          <h2>
            Not just a website.
            <br />
            A little <span>universe.</span>
          </h2>

          <p>
            SHE is a space for creativity, inspiration, and
            discovery. A place where colors, ideas, and
            experiences come together to create something
            memorable.
          </p>

          <p>
            Take your time, explore around, and make this
            little corner of the internet your own.
          </p>

          <a href="#contact" className="btn-primary">
            Find your way here <span>↗</span>
          </a>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact" id="contact">
        <div className="contact-decoration">✳</div>

        <div className="section-eyebrow">
          03 — THE NEXT LITTLE THING
        </div>

        <h2>
          Have something
          <br />
          <span>in mind?</span>
        </h2>

        <p>
          Every idea starts somewhere. Let's make room
          for something wonderful.
        </p>

        <a href="mailto:hello@example.com" className="btn-primary">
          Let's connect <span>↗</span>
        </a>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <a href="#home" className="footer-logo">SHE<span>.</span></a>

        <p>A little universe of creativity.</p>

        <a href="#home" className="back-top">BACK TO TOP ↑</a>

        <div className="footer-bottom">
          © 2026 SHE. MADE WITH IMAGINATION.
        </div>
      </footer>

    </div>
  );
}

export default App;
