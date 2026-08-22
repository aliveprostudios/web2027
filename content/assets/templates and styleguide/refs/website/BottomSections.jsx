/* ---------- TESTIMONIAL ---------- */
function Testimonial() {
  return (
    <section className="testimonial">
      <div className="container t-grid">
        <div className="t-mark">
          <img src="../../assets/logo-mark.svg" alt="" width="72" height="72" />
        </div>
        <blockquote className="t-quote">
          <p>"We had five vendors and zero alignment. Alive Pro replaced all of it. Six months in, we've got one team, one roadmap, and a pipeline that finally makes sense."</p>
          <footer>
            <strong>Alex Morgan</strong><span className="sep">·</span><span>VP Marketing, Northbound Industries</span>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}

/* ---------- STATS ---------- */
function Stats() {
  const stats = [
    ['29', 'years of brand marketing experience'],
    ['6',  'countries served across 3 continents'],
    ['1',  'integrated team · not five vendors'],
    ['100%','accountability for the outcome'],
  ];
  return (
    <section className="stats">
      <div className="container stats-grid">
        {stats.map(([n,l]) => (
          <div className="stat" key={l}>
            <div className="stat-n">{n}</div>
            <div className="stat-l">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- CTA ---------- */
function CTA() {
  return (
    <section id="contact" className="cta section-dark">
      <div className="container cta-inner">
        <span className="eyebrow">Do you have a project in mind?</span>
        <h2>Let's talk<span className="dot"></span></h2>
        <p>The businesses that lead their markets don't get there by patching together disconnected tactics. They get there with a partner who sees the full picture — and has the capability to execute every part of it.</p>
        <div className="cta-actions">
          <a className="btn btn-primary btn-lg" href="#">Book a Consultation</a>
          <a className="btn btn-ghost-light btn-lg" href="#">Request a Quote</a>
        </div>
        <div className="cta-phone">
          <span className="eyebrow" style={{color:'var(--brand-lime)'}}>Call direct</span>
          <a href="tel:9055533044" className="phone">905&middot;553&middot;3044</a>
        </div>
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  const cols = [
    ['Foundation', ['Brand Strategy','Brand Identity','Brand Voice','Rebranding']],
    ['Execution',  ['Web Solutions','Video Production','Motion Graphics','AI Production']],
    ['Growth',     ['Digital Marketing','Sales Funnels','SEO & AEO','Reputation']],
    ['Infrastructure', ['Custom Apps','Systems Integration','Dashboards','Lifecycle']],
  ];
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <img src="../../assets/logo-full-white.svg" alt="Alive ProStudios" height="44" />
            <p>Full-service brand marketing agency.<br/>Toronto · Vaughan · GTA.</p>
            <p className="phone-mini">905·553·3044</p>
          </div>
          <div className="footer-cols">
            {cols.map(([h,items]) => (
              <div key={h} className="footer-col">
                <h4>{h}</h4>
                <ul>{items.map(i => <li key={i}><a href="#">{i}</a></li>)}</ul>
              </div>
            ))}
          </div>
        </div>
        <div className="footer-base">
          <span>© 2026 Alive ProStudios Inc. All rights reserved.</span>
          <span>29 years of brand marketing · <a href="#">javad.ca</a></span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Testimonial, Stats, CTA, Footer });
