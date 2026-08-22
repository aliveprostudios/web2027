const { useState: useS2 } = React;

/* ---------- 4-STAGE SYSTEM ---------- */
function SystemDiagram() {
  const [active, setActive] = useS2(0);
  const stages = [
    { n: '01', title: 'Foundation', kicker: 'Brand Clarity, Foundation & Blueprint', body: "Stop wasting budget on tactics that don't connect. Build the strategic foundation that makes every marketing dollar compound.", items: ['Competitive Intelligence Audit','Revenue-Driven Goals & KPIs','Market & Competitor Research','Brand Strategy & Positioning','Brand Purpose, Vision & Values','Precision 90-Day Action Plan'], tone: 'forest' },
    { n: '02', title: 'Execution', kicker: 'Brand Execution, Systems & Market Presence', body: 'Transform strategy into customer-facing assets that convert. Your brand becomes consistent, professional, and impossible to ignore.', items: ['Visual Brand Identity System','High-Converting Website','AI-Enabled Personalization','Brand Voice & Content','Sales-Ready Materials','Internal Brand Training'], tone: 'lime' },
    { n: '03', title: 'Growth', kicker: 'Revenue-Driven Marketing & Demand Generation', body: "Launch campaigns that don't just get noticed — they fill your pipeline. One integrated strategy, multiple revenue channels, measurable ROI.", items: ['Authority-Building Content','Sales Funnel Creation','Performance Marketing','Conversion Optimization','Organic Social Growth','Partnerships, PR, Credibility'], tone: 'orange' },
    { n: '04', title: 'Infrastructure', kicker: 'Ongoing Growth & Market Leadership', body: "Your brand doesn't plateau — it evolves. Continuous optimization, proactive strategy, and a partner invested in your long-term dominance.", items: ['Ongoing Brand Guardianship','Trust & Reputation Mgmt','Marketing Innovation Lab','Customer Retention','Future-Proofing Investment','Uncovering Opportunity'], tone: 'black' },
  ];
  return (
    <section id="process" className="system section-dark">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Dedicated · All-Inclusive · Lifecycle Support</span>
          <h2>The Alive Pro System<span className="dot"></span></h2>
          <p>Four connected stages. One integrated partner. Click any stage to see what's inside.</p>
        </div>
        <div className="stage-tabs">
          {stages.map((s, i) => (
            <button key={s.n} className={`stage-tab tone-${s.tone} ${active===i?'active':''}`} onClick={() => setActive(i)}>
              <span className="stage-n">{s.n}</span>
              <span className="stage-t">{s.title}</span>
            </button>
          ))}
        </div>
        <div className="stage-detail">
          <div className="stage-copy">
            <span className={`stage-tag tone-${stages[active].tone}`}>Stage {stages[active].n}</span>
            <h3>{stages[active].title}</h3>
            <p className="stage-kicker">{stages[active].kicker}</p>
            <p className="stage-body">{stages[active].body}</p>
          </div>
          <ul className="stage-items">
            {stages[active].items.map(i => <li key={i}>{i}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- SERVICES GRID ---------- */
function Services() {
  const svcs = [
    ['Brand Strategy & Positioning', 'Foundation', 'The blueprint that makes every dollar compound.'],
    ['Visual Identity System',       'Execution',  'A system, not a logo — one that scales with you.'],
    ['High-Converting Websites',     'Execution',  'Pages designed to fill pipelines, not portfolios.'],
    ['Performance Marketing',        'Growth',     'Campaigns measured by revenue, not vanity metrics.'],
    ['Sales Funnel Building',        'Growth',     'End-to-end journeys with conversion built in.'],
    ['Motion, Video & Photography',  'Execution',  'In-house production. Commercial-grade. Fast.'],
    ['AI-Generated Production',      'Execution',  'Scale content without flattening the brand.'],
    ['Custom App Development',       'Infrastructure', 'Proprietary tooling that gives you leverage.'],
    ['Dashboards & Analytics',       'Infrastructure','One source of truth for every brand signal.'],
  ];
  return (
    <section id="services" className="services">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">What we do</span>
          <h2>One partner. Every capability<span className="dot"></span></h2>
          <p>From strategic foundation to shipped asset to measurable revenue, the whole loop lives under one roof.</p>
        </div>
        <div className="svc-grid">
          {svcs.map(([t,cat,body]) => (
            <article key={t} className="svc-card">
              <span className="svc-cat">{cat}</span>
              <h3>{t}</h3>
              <p>{body}</p>
              <span className="svc-more">Learn more →</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { SystemDiagram, Services });
