/* Carina Batista Nutricionista — interações discretas */
(function(){
  'use strict';

  // Header sombra ao rolar
  var hdr = document.querySelector('.hdr');
  var onScroll = function(){
    if(hdr) hdr.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Menu mobile
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');
  if(burger && nav){
    burger.addEventListener('click', function(){
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ nav.classList.remove('open'); });
    });
  }

  // Reveal ao rolar
  var els = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && els.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){ io.observe(el); });
  } else {
    els.forEach(function(el){ el.classList.add('in'); });
  }

  // GA4 — mede clique no WhatsApp (conversão). Sem efeito até o GA4 estar plugado.
  document.querySelectorAll('a[href*="wa.me/"], a[href*="api.whatsapp"]').forEach(function(a){
    a.addEventListener('click', function(){
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'whatsapp_click', {
          link_url: a.href,
          cta_text: (a.textContent || '').trim().slice(0, 80),
          page_path: location.pathname
        });
      }
    });
  });
})();
