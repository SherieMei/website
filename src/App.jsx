import { useState } from "react";
import "./App.css";
import "./MonetTheme.css";
import LotusCursor from "./LotusCursor";
import ThreeDScene from "./ThreeDScene";
import PondEnvironment from "./PondEnvironment";


const panels = {
  discover: {
    number: "01",
    eyebrow: "THE SHE EXPERIENCE",
    title: "A little bit of everything.",
    description:
      "Explore the different things that make this space special. Curiosity is always welcome here.",
    cards: [
      {
        number: "01",
        title: "Create",
        description: "Turn your thoughts, imagination, and ideas into something uniquely yours.",
        symbol: "✳",
      },
      {
        number: "02",
        title: "Explore",
        description: "Wander through new experiences, discover inspiration, and see things differently.",
        symbol: "✧",
      },
      {
        number: "03",
        title: "Imagine",
        description: "Let your creativity grow without limits. There is always room for something new.",
        symbol: "♡",
      },
    ],
  },
  about: {
    number: "02",
    eyebrow: "GET TO KNOW US",
    title: "Not just a website. A little universe.",
    description:
      "SHE is a space for creativity, inspiration, and discovery. A place where colors, ideas, and experiences come together to create something memorable.",
    extra:
      "Take your time, explore around, and make this little corner of the internet your own.",
  },
  contact: {
    number: "03",
    eyebrow: "THE NEXT LITTLE THING",
    title: "Have something in mind?",
    description:
      "Every idea starts somewhere. Let's make room for something wonderful.",
  },
};

function App() {
  const [activePanel, setActivePanel] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (panel) => {
    setActivePanel(panel);
    setMenuOpen(false);
  };

  return (
    <div className="website monet-site">
  <PondEnvironment />
  <LotusCursor />

      {/* NAVIGATION */}
      <header className="monet-header">
        <button
          className="monet-logo"
          onClick={() => navigate("home")}
          aria-label="Go to home"
        >
          SHE<span>.</span>
        </button>

        <span className="header-caption">THE FLOATING GARDEN</span>

        <button
          className="menu-toggle monet-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav className={`monet-nav ${menuOpen ? "nav-open" : ""}`}>
          {[
            ["home", "Home"],
            ["discover", "Discover"],
            ["about", "Our Space"],
            ["contact", "Connect"],
          ].map(([panel, label]) => (
            <button
              key={panel}
              className={activePanel === panel ? "nav-active" : ""}
              onClick={() => navigate(panel)}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {/* MAIN SCENE */}
      <main className="monet-stage">
        <div className="scene-counter">
          <span>{activePanel === "home" ? "00" : panels[activePanel].number}</span>
          <i />
          THE SHE EXPERIENCE
        </div>

        {activePanel === "home" && (
          <section className="home-scene scene-enter">
            <div className="home-copy">
              <div className="hero-tag">
                <span className="tag-dot" />
                A LITTLE SPACE TO CREATE
              </div>

              <p className="hero-label">WELCOME TO SHE</p>

              <h1>
                A world of
                <br />
                your <em>own.</em>
              </h1>

              <p className="hero-description">
                A space where creativity blooms, ideas take shape,
                and little things turn into something extraordinary.
                Explore a world made to inspire you.
              </p>

              <div className="hero-buttons">
                <button
                  className="monet-primary"
                  onClick={() => navigate("discover")}
                >
                  Explore the space <span>↗</span>
                </button>

                <button
                  className="monet-secondary"
                  onClick={() => navigate("about")}
                >
                  Discover SHE
                </button>
              </div>

              <div className="hero-bottom-note">
                CREATIVITY <span>✧</span> IMAGINATION <span>✧</span> EXPLORATION
              </div>
            </div>

            <div className="home-art">
              <div className="lotus-aura" />
              <div className="lotus-frame">
                <ThreeDScene />
              </div>

              <div className="glass-note note-top">
                ✧ DREAM IN COLOR
              </div>

              <div className="glass-note note-bottom">
                A universe of possibilities
              </div>

              <span className="floating-petal petal-one">✿</span>
              <span className="floating-petal petal-two">✧</span>
            </div>
          </section>
        )}

        {activePanel !== "home" && (
          <section className="content-scene scene-enter" key={activePanel}>
            {activePanel === "discover" && (
              <>
                <div className="panel-heading">
                  <p className="panel-eyebrow">01 — THE SHE EXPERIENCE</p>
                  <h1>A little bit of <em>everything.</em></h1>
                  <p>
                    Explore the different things that make this space special.
                    Curiosity is always welcome here.
                  </p>
                </div>

                <div className="monet-card-grid">
                  {panels.discover.cards.map((card) => (
                    <article className="monet-card" key={card.number}>
                      <div className="card-top">
                        <span>{card.number}</span>
                        <span>{card.symbol}</span>
                      </div>
                      <h2>{card.title}</h2>
                      <p>{card.description}</p>
                      <button onClick={() => navigate("about")}>
                        Discover more ↗
                      </button>
                    </article>
                  ))}
                </div>
              </>
            )}

            {activePanel === "about" && (
              <div className="single-panel">
                <p className="panel-eyebrow">02 — GET TO KNOW US</p>
                <h1>Not just a website.<br />A little <em>universe.</em></h1>
                <p>{panels.about.description}</p>
                <p>{panels.about.extra}</p>
                <button
                  className="monet-primary"
                  onClick={() => navigate("contact")}
                >
                  Find your way here ↗
                </button>
              </div>
            )}

            {activePanel === "contact" && (
              <div className="single-panel contact-panel">
                <p className="panel-eyebrow">03 — THE NEXT LITTLE THING</p>
                <h1>Have something<br /><em>in mind?</em></h1>
                <p>{panels.contact.description}</p>
                <a className="monet-primary" href="mailto:hello@example.com">
                  Let's connect ↗
                </a>
              </div>
            )}
          </section>
        )}
      </main>

      {/* FOOTER / SCENE CONTROLS */}
      <footer className="monet-footer">
        <span>© 2026 SHE. MADE WITH IMAGINATION.</span>

        <div className="scene-dots">
          {["home", "discover", "about", "contact"].map((panel, index) => (
            <button
              key={panel}
              className={activePanel === panel ? "dot-active" : ""}
              onClick={() => navigate(panel)}
              aria-label={`Go to ${panel}`}
              title={panel}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>

        <button
          className="back-home"
          onClick={() => navigate("home")}
        >
          BACK TO HOME ↑
        </button>
      </footer>
    </div>
  );
}

export default App;
