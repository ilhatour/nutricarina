// Carina Batista Nutricionista — gerador estático (Node puro, zero-dep, ESM)
// Uso: node build/generate.mjs  → escreve index.html, sitemap.xml, robots.txt, favicon.svg
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const D = JSON.parse(readFileSync(join(ROOT, 'data', 'site.json'), 'utf8'));

const GA4 = ""; // ← plugar "G-XXXXXXX" quando a propriedade GA4 existir

/* ---------- helpers ---------- */
const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const wa = txt => `https://wa.me/${D.brand.whatsapp}?text=${encodeURIComponent(txt || 'Olá, Carina! Vim pelo site e quero agendar minha avaliação.')}`;

/* ---------- ícones (stroke, currentColor) ---------- */
const I = {
  badge:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15a4 4 0 100-8 4 4 0 000 8z"/><path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5"/></svg>',
  screen:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.5-9.5-9A5 5 0 0112 6a5 5 0 019.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg>',
  leaf:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 014 13c0-6 5-9 15-10 1 8-2 15-8 17z"/><path d="M9 17c1.5-4 4-6 8-8"/></svg>',
  pulse:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2 6 4-14 2 8h6"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  spark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/></svg>',
  dot:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  app:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 18.5h3"/></svg>',
  gauge:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19a8 8 0 1116 0"/><path d="M12 19l4-5"/><circle cx="12" cy="19" r="1.1" fill="currentColor" stroke="none"/></svg>',
  list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9.5 3.4h5a1 1 0 011 1V6a1 1 0 01-1 1h-5a1 1 0 01-1-1V4.4a1 1 0 011-1z"/><path d="M8.5 11.5h7M8.5 15.5h4.5"/></svg>',
  pill:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2.8" y="8.8" width="18.4" height="6.4" rx="3.2" transform="rotate(-45 12 12)"/><path d="M8.6 8.6l6.8 6.8"/></svg>',
  chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a7.5 7.5 0 01-10.9 6.7L3 20l1.8-6.9A7.5 7.5 0 1121 11.5z"/></svg>',
  wa:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1s-.5-.1-.6.2-.7 1-.9 1.1-.3.2-.6 0a8 8 0 01-2.4-1.5 9 9 0 01-1.6-2c-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5a.5.5 0 000-.5L9 6.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3A2.8 2.8 0 006.3 9c0 1.5 1.1 3 1.3 3.3a12 12 0 004.6 4c.6.3 1.1.5 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.6-.6 1.8-1.3s.2-1.1.2-1.3-.2-.1-.5-.3zM12 2a10 10 0 00-8.5 15.3L2 22l4.8-1.5A10 10 0 1012 2z"/></svg>'
};

/* ---------- divisor de ONDA (assinatura) ----------
   Vai DENTRO da seção de cima (última filha, full-width), pintada com a cor
   da seção de BAIXO. A seção de cima fica com padding-bottom:0 (.section--flush)
   e a onda tem overshoot (path até y=61 > viewBox 60) → sem filete de 1px.
   As partes transparentes mostram o fundo da própria seção → sem "linha quebrada". */
const wave = (fill) => `<svg class="wave" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true"><path fill="${fill}" d="M0,61 L0,30 C170,53 340,57 500,41 C640,27 720,26 840,39 C980,54 1080,53 1200,36 L1200,61 Z"/></svg>`;

/* ---------- head ---------- */
const head = () => `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(D.seo.title)}</title>
<meta name="description" content="${esc(D.seo.description)}">
<meta name="keywords" content="${esc(D.seo.keywords||'')}">
<meta name="author" content="Carina Batista">
<meta name="geo.region" content="BR-RJ">
<meta name="geo.placename" content="Botafogo, Rio de Janeiro">
<meta name="geo.position" content="-22.9515;-43.1841">
<meta name="ICBM" content="-22.9515, -43.1841">${D.seo.gscVerification?`
<meta name="google-site-verification" content="${esc(D.seo.gscVerification)}">`:''}
<link rel="canonical" href="${D.brand.url}/">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(D.seo.title)}">
<meta property="og:description" content="${esc(D.seo.description)}">
<meta property="og:url" content="${D.brand.url}/">
<meta property="og:image" content="${D.brand.url}/${D.seo.ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Carina Batista Nutricionista — Botafogo e atendimento online">
<meta property="og:site_name" content="Carina Batista Nutricionista">
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${D.brand.url}/${D.seo.ogImage}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/img/logo-purple.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/styles.v2.css">
<script type="application/ld+json">${JSON.stringify(jsonLd())}</script>${GA4?`
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA4}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA4}');</script>`:''}
</head>
<body>`;

function jsonLd(){
  return {
    "@context":"https://schema.org",
    "@type":["Nutritionist","LocalBusiness"],
    "name":"Carina Batista Nutricionista",
    "url":D.brand.url+"/",
    "image":D.brand.url+"/assets/img/logo-purple.png",
    "description":D.seo.description,
    "@id":D.brand.url+"/#business",
    "telephone":"+"+D.brand.whatsapp,
    "priceRange":"R$ 350–3000",
    "knowsLanguage":"pt-BR",
    "areaServed":[
      {"@type":"City","name":"Botafogo, Rio de Janeiro"},
      {"@type":"Place","name":"Zona Sul do Rio de Janeiro"},
      {"@type":"City","name":"Rio de Janeiro"}
    ],
    "address":{"@type":"PostalAddress","addressLocality":"Botafogo","addressRegion":"Rio de Janeiro - RJ","addressCountry":"BR"},
    "geo":{"@type":"GeoCoordinates","latitude":-22.9515,"longitude":-43.1841},
    "makesOffer":{"@type":"Offer","priceCurrency":"BRL","price":"350","itemOffered":{"@type":"Service","name":"Consulta nutricional individualizada"}},
    ...(D.brand.instagramUrl?{"sameAs":[D.brand.instagramUrl]}:{}),
    "availableService":[
      {"@type":"MedicalTherapy","name":"Nutrição clínica"},
      {"@type":"MedicalTherapy","name":"Nutrição esportiva"},
      {"@type":"MedicalTherapy","name":"Acompanhamento para emagrecimento"}
    ]
  };
}

/* ---------- header ---------- */
const header = () => `
<header class="hdr">
  <div class="wrap hdr__in">
    <a class="brand" href="#top" aria-label="Carina Batista Nutricionista">
      <span class="brand__txt">
        <span class="brand__name">${esc(D.brand.name)}</span>
        <span class="brand__role">${esc(D.brand.role)}</span>
      </span>
    </a>
    <button class="burger" aria-label="Abrir menu"><span></span><span></span><span></span></button>
    <nav class="nav">
      ${D.nav.map(n=>`<a href="${n.href}">${esc(n.label)}</a>`).join('\n      ')}
      <a class="nav__cta" href="${wa()}" target="_blank" rel="noopener">Agendar</a>
    </nav>
  </div>
</header>`;

/* ---------- hero ---------- */
const hero = () => `
<section class="hero" id="top">
  <div class="wrap hero__in">
    <div class="reveal in">
      <span class="eyebrow hero__eyebrow">${esc(D.hero.eyebrow)}</span>
      <h1>${D.hero.titleHtml}</h1>
      <p class="hero__sub">${esc(D.hero.sub)}</p>
      <div class="hero__btns">
        <a class="btn btn--cta" href="${wa()}" target="_blank" rel="noopener">${I.wa}${esc(D.hero.ctaPrimary)}</a>
        <a class="btn btn--ghostlight" href="${D.hero.ctaSecondaryHref||'#metodo'}">${esc(D.hero.ctaSecondary)}</a>
      </div>
      <div class="hero__trust">
        ${D.hero.trust.map(t=>`<div>${I[t.icon]||I.check}<span>${esc(t.text)}</span></div>`).join('\n        ')}
      </div>
    </div>
    <aside class="hero__card reveal in">
      <img src="assets/img/logo-badge.png" alt="Selo Carina Batista Nutricionista">
      <p>Cada plano nasce da sua história — não de uma dieta pronta.</p>
    </aside>
  </div>
  ${wave('var(--bg)')}
</section>`;

/* ---------- para quem (dores) ---------- */
const pains = () => `
<section class="section section--flush" id="para-quem">
  <div class="wrap pains-grid reveal">
    <div class="pains-copy">
      <span class="eyebrow">${esc(D.pains.eyebrow)}</span>
      <h2>${esc(D.pains.title)}</h2>
      <p class="lead">${esc(D.pains.lead)}</p>
      <div class="pains">
        ${D.pains.items.map(p=>`<div class="pain">${I.dot}<span>${esc(p)}</span></div>`).join('\n        ')}
      </div>
    </div>
    ${D.pains.photo?`<figure class="pains-photo"><img src="${esc(D.pains.photo)}" alt="Carina Batista, nutricionista"></figure>`:''}
  </div>
  ${wave('var(--tint)')}
</section>`;

/* ---------- método ---------- */
const method = () => `
<section class="section section--tint section--flush" id="metodo">
  <div class="wrap reveal">
    <span class="eyebrow">${esc(D.method.eyebrow)}</span>
    <h2>${esc(D.method.title)}</h2>
    <p class="lead">${esc(D.method.lead)}</p>
    <div class="steps${D.method.todo?' todo':''}">
      ${D.method.steps.map(s=>`<div class="step"><div class="step__n"></div><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></div>`).join('\n      ')}
    </div>
  </div>
  ${wave('var(--primary)')}
</section>`;

/* ---------- citação (assinatura da Carina) ---------- */
const quote = () => D.quote ? `
<section class="quoteband section--flush">
  <div class="wrap quoteband__in reveal">
    <span class="quoteband__mark" aria-hidden="true">&ldquo;</span>
    <p class="quoteband__q">${esc(D.quote.text)}</p>
    <span class="quoteband__by">${esc(D.quote.author)} · Nutricionista</span>
  </div>
  ${wave('var(--bg)')}
</section>` : '';

/* ---------- serviços ---------- */
const services = () => `
<section class="section section--flush" id="servicos">
  <div class="wrap reveal">
    <span class="eyebrow">${esc(D.services.eyebrow)}</span>
    <h2>${esc(D.services.title)}</h2>
    ${D.services.lead?`<p class="lead">${esc(D.services.lead)}</p>`:''}
    <div class="grid grid--3${D.services.todo?' todo':''}" style="margin-top:2.2rem">
      ${D.services.items.map(s=>`<div class="card"><div class="card__ic">${I[s.icon]||I.leaf}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join('\n      ')}
    </div>
  </div>
  ${wave('var(--tint)')}
</section>`;

/* ---------- planos ---------- */
const planos = () => `
<section class="section section--tint section--flush" id="planos">
  <div class="wrap reveal">
    <span class="eyebrow">${esc(D.planos.eyebrow)}</span>
    <h2>${esc(D.planos.title)}</h2>
    <p class="lead">${esc(D.planos.lead)}</p>
    ${D.planos.incluido?`<div class="incluido"><span class="incluido__t">${esc(D.planos.incluidoTitle)}</span><ul>${D.planos.incluido.map(i=>`<li><span class="incluido__ic">${I[i.icon]||I.check}</span><span class="incluido__lb">${esc(i.text)}</span></li>`).join('')}</ul></div>`:''}
    <div class="plans">
      ${D.planos.items.map(p=>`<div class="plan${p.featured?' plan--feat':''}">${p.tag?`<span class="plan__tag">${esc(p.tag)}</span>`:''}<div class="plan__name">${esc(p.name)}</div><div class="plan__unit">${esc(p.unit)}</div><div class="plan__price"><small>R$</small>${esc(p.price)}</div>${p.installment?`<div class="plan__inst">${esc(p.installment)}</div>`:''}<p class="plan__desc">${esc(p.desc)}</p><a class="btn ${p.featured?'btn--cta':'btn--ghost'}" href="${wa('Olá, Carina! Tenho interesse no plano '+p.name+'. Pode me explicar como funciona?')}" target="_blank" rel="noopener">Agendar</a></div>`).join('\n      ')}
    </div>
    <p class="plans__note">${esc(D.planos.note)}</p>
  </div>
  ${wave('var(--bg)')}
</section>`;

/* ---------- sobre ---------- */
const about = () => `
<section class="section" id="sobre">
  <div class="wrap about reveal">
    <div class="about__photo${!D.about.photo?' todo':''}">
      ${D.about.photo?`<img src="${esc(D.about.photo)}" alt="Carina Batista, nutricionista">`:`<div style="text-align:center;color:var(--secondary);padding:1rem;font-weight:600">⟢ Foto da Carina</div>`}
    </div>
    <div>
      <span class="about__badge">${I.leaf}${esc(D.about.eyebrow)}</span>
      <h2>${esc(D.about.title)}</h2>
      ${(Array.isArray(D.about.bio)?D.about.bio:[D.about.bio]).map(p=>`<p>${esc(p)}</p>`).join('\n      ')}
      <ul>
        ${D.about.highlights.map(h=>`<li>${I.check}<span>${esc(h)}</span></li>`).join('\n        ')}
      </ul>
    </div>
  </div>
</section>`;

/* ---------- faq ---------- */
const faq = () => `
<section class="section section--flush" id="faq">
  <div class="wrap reveal" style="text-align:center">
    <span class="eyebrow" style="justify-content:center">${esc(D.faq.eyebrow)}</span>
    <h2 style="margin:0 auto">${esc(D.faq.title)}</h2>
  </div>
  <div class="wrap"><div class="faq${D.faq.todo?' todo':''}">
    ${D.faq.items.map(f=>`<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n    ')}
  </div></div>
  ${wave('var(--primary)')}
</section>`;

/* ---------- CTA band ---------- */
const ctaband = () => `
<section class="ctaband">
  <div class="wrap ctaband__in reveal">
    <h2>${esc(D.ctaband.title)}</h2>
    <p>${esc(D.ctaband.sub)}</p>
    <a class="btn btn--ondark" href="${wa()}" target="_blank" rel="noopener">${I.wa}${esc(D.ctaband.cta)}</a>
  </div>
</section>`;

/* ---------- footer ---------- */
const footer = () => `
<footer class="ft">
  <div class="wrap ft__grid">
    <div class="ft__brand">
      <img src="assets/img/logo-badge.png" alt="Carina Batista Nutricionista">
      <p>Nutricionista em Botafogo, na Zona Sul do Rio de Janeiro, e atendimento online. Acompanhamento individualizado para uma relação mais leve e saudável com a comida.</p>
    </div>
    <div>
      <h4>Navegação</h4>
      ${D.nav.map(n=>`<a href="${n.href}">${esc(n.label)}</a>`).join('\n      ')}
      <a href="${wa()}" target="_blank" rel="noopener">Agendar consulta</a>
    </div>
    <div>
      <h4>Contato</h4>
      <p class="ft__nap">
        ${D.brand.whatsapp!=='5500000000000'?`<a href="${wa()}" target="_blank" rel="noopener">WhatsApp ${esc(D.brand.whatsappLabel)}</a>`:'⟢ WhatsApp a definir<br>'}
        ${D.brand.email?`<a href="mailto:${esc(D.brand.email)}">${esc(D.brand.email)}</a>`:'⟢ E-mail a definir<br>'}
        ${D.brand.instagramUrl?`<a href="${esc(D.brand.instagramUrl)}" target="_blank" rel="noopener">${esc(D.brand.instagram)}</a>`:'⟢ Instagram a definir<br>'}
        ${esc(D.brand.crn)} · ${esc(D.brand.atendimento)}
        ${D.brand.city?`<br>${esc(D.brand.city)}`:''}
      </p>
    </div>
  </div>
  <div class="wrap ft__bar">
    <span>© ${'{{YEAR}}'} ${esc(D.brand.name)} ${esc(D.brand.role)}. Todos os direitos reservados.</span>
    <span>${esc(D.brand.domain)}</span>
  </div>
</footer>
<a class="wa" href="${wa()}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${I.wa}</a>
<script src="assets/js/main.js"></script>
</body>
</html>`;

/* ---------- montagem ---------- */
const YEAR = '2026'; // estático (Date.now indisponível no harness; atualizar manualmente)
const html = [head(), header(), hero(), pains(), method(), quote(), services(), planos(), about(), faq(), ctaband(), footer()]
  .join('\n').replace(/\{\{YEAR\}\}/g, YEAR);

writeFileSync(join(ROOT,'index.html'), html);

/* favicon.svg — símbolo simplificado (lótus roxa) */
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#521370"/><g fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M32 16c5 6 5 14 0 20-5-6-5-14 0-20z"/><path d="M20 26c7 1 11 6 12 12-7-1-11-6-12-12z"/><path d="M44 26c-7 1-11 6-12 12 7-1 11-6 12-12z"/><path d="M26 44c3-3 9-3 12 0"/></g></svg>`;
writeFileSync(join(ROOT,'favicon.svg'), favicon);

/* sitemap + robots */
writeFileSync(join(ROOT,'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${D.brand.url}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>
</urlset>`);

writeFileSync(join(ROOT,'robots.txt'),
`User-agent: *\nAllow: /\nSitemap: ${D.brand.url}/sitemap.xml\n`);

console.log('✓ Gerado: index.html, favicon.svg, sitemap.xml, robots.txt');
