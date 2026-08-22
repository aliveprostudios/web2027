const { useState, useEffect } = React;

/* ---------- NAV ---------- */
function Nav() {
  const [open, setOpen] = useState(null);
  const groups = [
    { label: 'Foundation', items: ['Brand Strategy & Positioning','Brand Name & Identity','Brand Voice','Rebranding'] },
    { label: 'Execution',  items: ['Communication Design','Web Solutions','Sales & Marketing Collateral','Video Production','Motion Graphics','AI-Generated Production'] },
    { label: 'Growth',     items: ['Sales Funnel Building','Digital Marketing','Lead Generation','Content Marketing','SEO & AEO','Reputation Management'] },
    { label: 'Infrastructure', items: ['Solution Architecture','Custom App Development','Systems Integration','Dashboards & Analytics','Lifecycle Support'] },
  ];
  return (
    <header className="nav">
      <div className="container nav-inner">
        <a className="nav-logo" href="#">
          <img src="../../assets/logo-full.svg" alt="Alive ProStudios" height="38" />
        </a>
        <nav className="nav-links">
          {groups.map(g => (
            <div key={g.label} className="nav-item" onMouseEnter={() => setOpen(g.label)} onMouseLeave={() => setOpen(null)}>
              <button className="nav-link">{g.label}<span className="chev">▾</span></button>
              {open === g.label && (
                <div className="nav-flyout">
                  {g.items.map(i => <a key={i} href="#">{i}</a>)}
                </div>
              )}
            </div>
          ))}
          <a className="nav-link simple" href="#work">Work</a>
          <a className="nav-link simple" href="#about">Alive Pro</a>
        </nav>
        <a className="btn btn-primary btn-sm" href="#contact">Start the Conversation</a>
      </div>
    </header>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <span className="eyebrow">29 Years · Toronto · Vaughan · GTA</span>
        <h1 className="hero-h">
          The all-in-one brand transformation system<br/>
          that replaces fragmented <em>marketing</em><span style={{color:'var(--brand-orange)'}}>.</span>
        </h1>
        <p className="hero-sub">
          Strategy, identity, voice, design, content, campaigns, production and technology — built by one team, from one strategic foundation, aimed at one outcome: your growth.
        </p>
        <div className="hero-ctas">
          <a className="btn btn-primary btn-lg" href="#contact">Book a Consultation</a>
          <a className="btn btn-ghost btn-lg" href="#process">Our Process →</a>
        </div>
        <div className="hero-meta">
          <span><strong>1997</strong> · Founded in Toronto</span>
          <span className="sep"></span>
          <span>Clients across <strong>Canada · USA · Germany · Dubai · China · Mexico</strong></span>
        </div>
      </div>
    </section>
  );
}

/* ---------- PROBLEM (alternating copy) ---------- */
function Problem() {
  return (
    <section className="problem">
      <div className="container prob-grid">
        <div>
          <span className="eyebrow">The problem</span>
          <h2 className="prob-h">The problems most businesses won't talk about<span className="dot"></span></h2>
        </div>
        <div className="prob-copy">
          <p>How many people are responsible for your brand right now? One agency handles design. Another runs your ads. A freelancer writes your content. Someone internal manages social media. Your website was built by a developer who's never read your brand strategy.</p>
          <p>The result? A brand that looks different on every platform, sounds different in every channel, and pulls in a different direction every quarter.</p>
          <ul className="prob-list">
            <li>Budget leaks.</li>
            <li>Messaging conflicts.</li>
            <li>Nobody owns the outcome.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Nav, Hero, Problem });
