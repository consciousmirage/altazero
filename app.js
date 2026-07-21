/* ALTA ZERO x ACNE · shared behavior. Depends on archive-data.js (const ARCHIVE). */

const GROUPS = [
  {k:'all',      label:'All'},
  {k:'tees',     label:'Tees'},
  {k:'long',     label:'Long Sleeves'},
  {k:'heavy',    label:'Heavyweights'},
  {k:'trousers', label:'Trousers'},
  {k:'shorts',   label:'Shorts'},
  {k:'layers',   label:'Layers'},
];

/* derive a colour word from the product photo name, else fall back to category */
const COLOURS = {bone:'Bone', sand:'Sand', olive:'Olive', charcoal:'Charcoal'};
function colourOf(p){
  if(p.img){
    const key = p.img.split('-').pop();
    if(COLOURS[key]) return COLOURS[key];
  }
  return p.cat;
}

/* Acne-style tile: photo (or numbered specimen) + name/price caption + meta line */
function tileHTML(p){
  const img = p.img
    ? `<img src="img/${p.img}.png" alt="${p.name}" loading="lazy">`
    : `<div class="ph"><div class="num">${p.n}</div><div class="cat">${p.cat}</div></div>`;
  const badge = p.badge
    ? `<span class="badge${p.badge==='Last Call'?' last':''}">${p.badge}</span>`
    : '';
  return `<a class="tile reveal" href="product.html?n=${p.n}">
    <div class="tile-img">${badge}${img}</div>
    <div class="tile-cap">
      <div class="line"><span class="name">${p.name}</span><span class="price">$${p.price}</span></div>
      <div class="meta">No. ${p.n} &middot; ${colourOf(p)}</div>
    </div>
  </a>`;
}

/* home preview grid */
function renderPreview(el, nums){
  const pick = nums.map(n => ARCHIVE.find(p => p.n===n)).filter(Boolean);
  el.innerHTML = pick.map(tileHTML).join('');
  observeReveals(el);
}

/* archive: segmented toggle + item count + zero-gutter grid */
function renderArchive(toggleEl, metaEl, gridEl){
  let current = 'all';
  function list(){ return current==='all' ? ARCHIVE : ARCHIVE.filter(p=>p.g===current); }
  toggleEl.innerHTML = GROUPS.map(g =>
    `<button data-k="${g.k}" class="${g.k==='all'?'on':''}">${g.label}</button>`).join('');
  const itemsEl = metaEl.querySelector('.items');
  function draw(){
    const L = list();
    gridEl.innerHTML = L.map(tileHTML).join('');
    if(itemsEl) itemsEl.textContent = L.length + ' items';
    toggleEl.querySelectorAll('button').forEach(b=>b.classList.toggle('on', b.dataset.k===current));
    observeReveals(gridEl);
  }
  toggleEl.addEventListener('click', e=>{
    const b = e.target.closest('button'); if(!b) return;
    current = b.dataset.k; draw();
  });
  draw();
}

/* top marquee bar: build a seamless looping track, wire the X CLOSE */
function initMarquee(){
  const track = document.getElementById('marqueeTrack');
  if(track){
    const items = ['Made To Order In 5 To 8 Days','The Mark Is On The Tag','Salt Lake City / Everywhere'];
    let half = '';
    for(let r=0; r<4; r++){
      items.forEach(t => { half += `<span>${t}</span><span class="sep">&middot;</span>`; });
    }
    track.innerHTML = half + half; /* two identical halves for the -50% loop */
  }
  const x = document.getElementById('marqueeX');
  if(x) x.addEventListener('click', ()=>{
    const bar = document.getElementById('marquee');
    if(bar) bar.style.display = 'none';
  });
}

/* fade-and-rise reveal on scroll (respects prefers-reduced-motion via CSS) */
let _revObserver = null;
function observeReveals(scope){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nodes = (scope || document).querySelectorAll('.reveal:not(.in)');
  if(reduce || !('IntersectionObserver' in window)){
    nodes.forEach(n=>n.classList.add('in'));
    return;
  }
  if(!_revObserver){
    _revObserver = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        if(en.isIntersecting){ en.target.classList.add('in'); _revObserver.unobserve(en.target); }
      });
    }, {rootMargin:'0px 0px -8% 0px', threshold:0.06});
  }
  nodes.forEach(n=>_revObserver.observe(n));
}

/* nav mobile toggle */
function initNav(){
  const t = document.querySelector('.nav-toggle');
  const nl = document.getElementById('nl');
  if(t && nl) t.addEventListener('click', ()=>nl.classList.toggle('open'));
}

document.addEventListener('DOMContentLoaded', ()=>{
  initMarquee();
  initNav();
  observeReveals(document);
});
