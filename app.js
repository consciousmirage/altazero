/* ALTA ZERO x ACNE — shared engine.
   Depends on: archive-data.js (ARCHIVE), product-data.js (PRODUCTS, listingFor),
   site-content.js (COLLECTIONS, SIZEGUIDE, FOOTER, SPOKEN, LOOKBOOK, HOME, ABOUT, TAGS, FAQ).
   Classic script, no modules, works from the folder root over file:// with relative paths. */

(function () {
  "use strict";

  /* ------------------------------------------------------------------ data */
  const GROUPS = [
    { k: "all", label: "All" },
    { k: "tees", label: "Tees" },
    { k: "long", label: "Long Sleeves" },
    { k: "heavy", label: "Heavyweights" },
    { k: "trousers", label: "Trousers" },
    { k: "shorts", label: "Shorts" },
    { k: "layers", label: "Layers" },
  ];
  const COLOURS = { bone: "Bone", sand: "Sand", olive: "Olive", charcoal: "Charcoal" };

  function byNum(n) {
    n = String(n);
    return ARCHIVE.find((p) => p.n === n) || null;
  }
  function padN(i) {
    return String(i).padStart(3, "0");
  }
  function colourOf(p) {
    if (p.img) {
      const key = p.img.split("-").pop();
      if (COLOURS[key]) return COLOURS[key];
    }
    return p.cat;
  }
  /* deterministic pseudo coordinates near the Wasatch, for specimen tiles */
  function coordsFor(n) {
    const i = parseInt(n, 10);
    const lat = (40.42 + ((i * 7) % 55) * 0.01).toFixed(4);
    const lon = (111.55 + ((i * 11) % 60) * 0.01).toFixed(4);
    return lat + "° N · " + lon + "° W";
  }
  /* second image for the hover crossfade: a lifestyle mockup, cycled by number */
  function altShot(p) {
    const i = ((parseInt(p.n, 10) - 1) % 4) + 1;
    return "img/gm" + i + ".png";
  }
  /* neck tag paired to a piece, cycled deterministically */
  function tagShot(p) {
    const i = ((parseInt(p.n, 10) - 1) % 4) + 1;
    return "img/tag" + i + ".png";
  }

  /* --------------------------------------------------------------- tiles */
  function specimenHTML(p) {
    return (
      '<div class="ph">' +
      '<img class="ph-peng" src="img/az-penguin.png" alt="" aria-hidden="true">' +
      '<div class="ph-inner">' +
      '<span class="ph-num">No. ' + p.n + " / 114</span>" +
      '<span class="ph-cat">' + p.cat + "</span>" +
      '<span class="ph-coord">' + coordsFor(p.n) + "</span>" +
      "</div>" +
      "</div>"
    );
  }

  function tile(p) {
    const badge = p.badge
      ? '<span class="badge' + (p.badge === "Last Call" ? " last" : "") + '">' + p.badge + "</span>"
      : "";
    let media;
    if (p.img) {
      media =
        '<img class="ti-a" src="img/' + p.img + '.png" alt="' + p.name + '" loading="lazy">' +
        '<img class="ti-b" src="' + altShot(p) + '" alt="" aria-hidden="true" loading="lazy">';
    } else {
      media = specimenHTML(p);
    }
    return (
      '<a class="tile reveal" href="product.html?n=' + p.n + '">' +
      '<div class="tile-img">' + badge + media + "</div>" +
      '<div class="tile-cap"><div class="line">' +
      '<span class="name">' + p.name + "</span>" +
      '<span class="price">$' + p.price + "</span></div>" +
      '<div class="meta">No. ' + p.n + " · " + colourOf(p) + "</div>" +
      "</div></a>"
    );
  }

  function renderGrid(el, list) {
    if (!el) return;
    el.innerHTML = list.map(tile).join("");
    observe(el);
  }
  function renderPreview(el, nums) {
    if (!el) return;
    const pick = nums.map(byNum).filter(Boolean);
    renderGrid(el, pick);
  }

  /* archive: segmented toggle + count + grid */
  function renderArchive(toggleEl, metaEl, gridEl) {
    let current = "all";
    function list() {
      return current === "all" ? ARCHIVE : ARCHIVE.filter((p) => p.g === current);
    }
    toggleEl.innerHTML = GROUPS.map(
      (g) => '<button data-k="' + g.k + '" class="' + (g.k === "all" ? "on" : "") + '">' + g.label + "</button>"
    ).join("");
    const itemsEl = metaEl ? metaEl.querySelector(".items") : null;
    function draw() {
      const L = list();
      renderGrid(gridEl, L);
      if (itemsEl) itemsEl.textContent = L.length + " items";
      toggleEl.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.k === current));
    }
    toggleEl.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      current = b.dataset.k;
      draw();
    });
    draw();
  }

  /* ------------------------------------------------------------------ bag */
  const BAG_KEY = "az_bag";
  const Bag = {
    read() {
      try {
        return JSON.parse(localStorage.getItem(BAG_KEY)) || [];
      } catch (e) {
        return [];
      }
    },
    write(items) {
      localStorage.setItem(BAG_KEY, JSON.stringify(items));
      syncCount();
      renderBag();
    },
    count() {
      return this.read().reduce((s, i) => s + i.qty, 0);
    },
    subtotal() {
      return this.read().reduce((s, i) => s + i.price * i.qty, 0);
    },
    add(item) {
      const items = this.read();
      const key = item.n + "-" + item.size;
      const ex = items.find((i) => i.key === key);
      if (ex) ex.qty += item.qty || 1;
      else items.push(Object.assign({ qty: 1 }, item, { key: key }));
      this.write(items);
    },
    setQty(key, qty) {
      let items = this.read();
      const it = items.find((i) => i.key === key);
      if (it) {
        it.qty = qty;
        if (it.qty < 1) items = items.filter((i) => i.key !== key);
      }
      this.write(items);
    },
    remove(key) {
      this.write(this.read().filter((i) => i.key !== key));
    },
  };

  function syncCount() {
    const n = Bag.count();
    document.querySelectorAll("#bagCount").forEach((el) => {
      el.textContent = String(n).padStart(2, "0");
    });
  }

  function renderBag() {
    const body = document.getElementById("bagBody");
    if (!body) return;
    const items = Bag.read();
    if (!items.length) {
      body.innerHTML =
        '<div class="bag-empty"><p>Your bag is empty.</p>' +
        '<a class="link" href="archive.html">Enter The Archive</a></div>';
      const foot = document.getElementById("bagFoot");
      if (foot) foot.hidden = true;
      return;
    }
    body.innerHTML = items
      .map((i) => {
        const thumb = i.img
          ? '<img src="img/' + i.img + '.png" alt="' + i.name + '">'
          : '<span class="bag-ph">No. ' + i.n + "</span>";
        return (
          '<div class="bag-line">' +
          '<a class="bag-thumb" href="product.html?n=' + i.n + '">' + thumb + "</a>" +
          '<div class="bag-meta">' +
          '<a class="bag-name" href="product.html?n=' + i.n + '">' + i.name + "</a>" +
          '<div class="bag-sub">No. ' + i.n + " · Size " + i.size + "</div>" +
          '<div class="bag-row">' +
          '<div class="qty">' +
          '<button class="qminus" data-key="' + i.key + '" aria-label="Decrease quantity">−</button>' +
          "<span>" + i.qty + "</span>" +
          '<button class="qplus" data-key="' + i.key + '" aria-label="Increase quantity">+</button>' +
          "</div>" +
          '<span class="bag-price">$' + i.price * i.qty + "</span>" +
          "</div>" +
          '<button class="bag-remove" data-key="' + i.key + '">Remove</button>' +
          "</div></div>"
        );
      })
      .join("");
    const foot = document.getElementById("bagFoot");
    if (foot) {
      foot.hidden = false;
      const sub = document.getElementById("bagSubtotal");
      if (sub) sub.textContent = "$" + Bag.subtotal();
    }
  }

  function openBag() {
    const d = document.getElementById("bagDrawer");
    if (!d) return;
    renderBag();
    d.classList.add("open");
    document.getElementById("scrim").classList.add("on");
    document.body.classList.add("no-scroll");
  }
  function closeOverlays() {
    document.querySelectorAll(".drawer.open, .overlay.open").forEach((n) => n.classList.remove("open"));
    const s = document.getElementById("scrim");
    if (s) s.classList.remove("on");
    document.body.classList.remove("no-scroll");
  }

  /* --------------------------------------------------------------- search */
  function openSearch() {
    const o = document.getElementById("searchOverlay");
    if (!o) return;
    o.classList.add("open");
    document.getElementById("scrim").classList.add("on");
    document.body.classList.add("no-scroll");
    const input = document.getElementById("searchInput");
    if (input) {
      input.value = "";
      runSearch("");
      setTimeout(() => input.focus(), 40);
    }
  }
  function runSearch(q) {
    const grid = document.getElementById("searchGrid");
    const count = document.getElementById("searchCount");
    if (!grid) return;
    q = (q || "").trim().toLowerCase();
    let list;
    if (!q) list = ARCHIVE.slice(0, 8);
    else
      list = ARCHIVE.filter(
        (p) =>
          p.name.toLowerCase().indexOf(q) >= 0 ||
          p.cat.toLowerCase().indexOf(q) >= 0 ||
          colourOf(p).toLowerCase().indexOf(q) >= 0 ||
          ("no. " + p.n).indexOf(q) >= 0 ||
          p.n.indexOf(q) >= 0
      );
    renderGrid(grid, list);
    if (count) {
      count.textContent = !q
        ? "Start typing to search the archive"
        : list.length + (list.length === 1 ? " result" : " results") + ' for "' + q + '"';
    }
  }

  /* ----------------------------------------------------------- size guide */
  function openSizeGuide() {
    const m = document.getElementById("sizeModal");
    if (!m) return;
    m.classList.add("open");
    document.getElementById("scrim").classList.add("on");
    document.body.classList.add("no-scroll");
  }

  /* --------------------------------------------------------- newsletter */
  function bindNewsletter(scope) {
    (scope || document).querySelectorAll("form.az-news").forEach((f) => {
      if (f.dataset.bound) return;
      f.dataset.bound = "1";
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = f.querySelector("input");
        const email = (input.value || "").trim();
        if (!email) return;
        try {
          const list = JSON.parse(localStorage.getItem("az_news") || "[]");
          if (list.indexOf(email) < 0) list.push(email);
          localStorage.setItem("az_news", JSON.stringify(list));
        } catch (err) {}
        f.innerHTML = '<div class="news-thanks">You are on the list. We will see you at the top.</div>';
      });
    });
  }

  /* ------------------------------------------------------------ reveals */
  let _obs = null;
  function observe(scope) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = (scope || document).querySelectorAll(".reveal:not(.in)");
    if (reduce || !("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("in"));
      return;
    }
    if (!_obs) {
      _obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("in");
              _obs.unobserve(en.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
      );
    }
    nodes.forEach((n) => _obs.observe(n));
  }

  /* -------------------------------------------------------- chrome build */
  function collectionHref(slug) {
    return "collection.html?c=" + slug;
  }
  function resolveHref(href) {
    if (!href) return "#";
    if (href.indexOf("/collections/archive") === 0) return "archive.html";
    if (href.indexOf("/collections/") === 0) return "collection.html?c=" + href.split("/collections/")[1];
    if (href.indexOf("/pages/the-house") === 0) return "house.html";
    if (href.indexOf("/pages/the-tags") === 0) return "tags.html";
    if (href.indexOf("/pages/lookbook") === 0) return "index.html#lookbook";
    if (href.indexOf("/pages/size-guide") === 0) return "#size";
    if (href.indexOf("/pages/faq") === 0) return "house.html#faq";
    if (href.indexOf("/pages/contact") === 0) return "house.html#faq";
    return href;
  }

  const SEARCH_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>';
  const ACCT_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>';
  const RULER_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="8" width="18" height="8"/><line x1="8" y1="8" x2="8" y2="12"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="16" y1="8" x2="16" y2="12"/></svg>';

  function shopMenuHTML() {
    const cats = COLLECTIONS.filter((c) => c.filterKey !== "Edit");
    const edits = COLLECTIONS.filter((c) => c.filterKey === "Edit");
    const col = (heading, arr, extra) =>
      '<div class="sm-col"><h5>' + heading + "</h5><ul>" +
      arr.map((c) => '<li><a href="' + collectionHref(c.slug) + '">' + c.name + "</a></li>").join("") +
      (extra || "") +
      "</ul></div>";
    return (
      '<div class="shop-menu" id="shopMenu">' +
      '<div class="sm-inner">' +
      col("Shop By Type", cats) +
      col("The Edits", edits, '<li><a href="archive.html">The Full Archive</a></li>') +
      '<div class="sm-col sm-feature"><a href="collection.html?c=the-essentials-ten">' +
      '<img src="img/campaign.png" alt="Alta Zero essentials"><span>The Essentials Ten</span></a></div>' +
      "</div></div>"
    );
  }

  function navHTML(active) {
    const a = (href, k, label) =>
      '<a href="' + href + '"' + (active === k ? ' class="active"' : "") + ' data-k="' + k + '">' + label + "</a>";
    return (
      '<div class="marquee" id="marquee"><div class="marquee-track" id="marqueeTrack"></div>' +
      '<button class="marquee-x" id="marqueeX">Close</button></div>' +
      '<nav class="nav">' +
      '<div class="nav-inner">' +
      '<div class="nav-left" id="nl">' +
      '<button class="nav-shop" id="navShop" aria-expanded="false" aria-haspopup="true">Shop</button>' +
      a("archive.html", "archive", "Archive") +
      a("house.html", "house", "The House") +
      a("tags.html", "tags", "The Tags") +
      "</div>" +
      '<button class="nav-toggle" id="navToggle" aria-expanded="false" aria-label="Menu">Menu</button>' +
      '<a class="brand" href="index.html"><img src="img/az-wordmark-inline.png" alt="Alta Zero"></a>' +
      '<div class="nav-right">' +
      '<button class="srch" id="searchOpen">' + SEARCH_SVG + "Search</button>" +
      '<a href="#" class="acct">' + ACCT_SVG + "Account</a>" +
      '<button class="bag" id="bagOpen">Bag <span id="bagCount">00</span></button>' +
      "</div>" +
      "</div>" +
      shopMenuHTML() +
      "</nav>"
    );
  }

  function footerHTML() {
    const cols = FOOTER.columns
      .map(
        (c) =>
          "<div><h4>" + c.heading + "</h4><ul>" +
          c.links
            .map((l) => {
              const href = resolveHref(l.href);
              const attr = href === "#size" ? ' href="#" data-size' : ' href="' + href + '"';
              return "<li><a" + attr + ">" + l.label + "</a></li>";
            })
            .join("") +
          "</ul></div>"
      )
      .join("");
    const nl = FOOTER.newsletter;
    return (
      '<footer class="foot">' +
      '<div class="foot-top">' +
      '<div class="signup"><h4>Join The List</h4><h3>' + nl.heading + "</h3>" +
      "<p>" + nl.line + "</p>" +
      '<form class="az-news"><input type="email" placeholder="' + nl.placeholder + '" required>' +
      '<button class="sub" type="submit">' + nl.button + "</button></form></div>" +
      cols +
      "</div>" +
      '<div class="foot-bottom">' +
      '<a class="brand" href="index.html"><img src="img/az-wordmark-inline.png" alt="Alta Zero"></a>' +
      '<span class="fine">' + FOOTER.location + " · " + FOOTER.legal + "</span>" +
      "</div></footer>"
    );
  }

  function overlaysHTML() {
    /* bag drawer */
    const bag =
      '<aside class="drawer bag-drawer" id="bagDrawer" aria-label="Shopping bag">' +
      '<div class="drawer-head"><span class="drawer-t">Your Bag</span>' +
      '<button class="drawer-x" data-close aria-label="Close bag">Close</button></div>' +
      '<div class="bag-body" id="bagBody"></div>' +
      '<div class="bag-foot" id="bagFoot" hidden>' +
      '<div class="bag-sum"><span>Subtotal</span><span id="bagSubtotal">$0</span></div>' +
      '<p class="bag-note">Made to order. Taxes and shipping figured at checkout.</p>' +
      '<button class="addbag" id="checkoutBtn">Checkout</button></div>' +
      "</aside>";
    /* search overlay */
    const search =
      '<div class="overlay search-overlay" id="searchOverlay" aria-label="Search">' +
      '<div class="search-bar wrap">' +
      SEARCH_SVG +
      '<input id="searchInput" type="search" placeholder="Search the archive" autocomplete="off">' +
      '<button class="search-x" data-close>Close</button></div>' +
      '<div class="wrap"><div class="search-count" id="searchCount"></div>' +
      '<div class="grid four" id="searchGrid"></div></div>' +
      "</div>";
    /* size guide modal */
    const rows = SIZEGUIDE.rows
      .map(
        (r) => "<tr><td>" + r.size + "</td><td>" + r.chest + '"</td><td>' + r.length + '"</td></tr>'
      )
      .join("");
    const size =
      '<div class="overlay modal size-modal" id="sizeModal" aria-label="Size guide">' +
      '<div class="modal-card">' +
      '<div class="modal-head"><span class="drawer-t">Size Guide</span>' +
      '<button class="drawer-x" data-close aria-label="Close">Close</button></div>' +
      '<div class="modal-body">' +
      '<p class="size-measure">' + SIZEGUIDE.measure + "</p>" +
      '<table class="size-table"><thead><tr><th>' + SIZEGUIDE.columns.join("</th><th>") +
      "</th></tr></thead><tbody>" + rows + "</tbody></table>" +
      '<p class="size-note">' + SIZEGUIDE.fitNote + "</p>" +
      "</div></div></div>";
    const scrim = '<div class="scrim" id="scrim"></div>';
    return scrim + bag + search + size;
  }

  function initMarquee() {
    const track = document.getElementById("marqueeTrack");
    if (track) {
      const items = ["Made To Order In 5 To 8 Days", "The Mark Is On The Tag", "Salt Lake City / Everywhere"];
      let half = "";
      for (let r = 0; r < 4; r++) {
        items.forEach((t) => {
          half += "<span>" + t + '</span><span class="sep">·</span>';
        });
      }
      track.innerHTML = half + half;
    }
    const x = document.getElementById("marqueeX");
    if (x)
      x.addEventListener("click", () => {
        const bar = document.getElementById("marquee");
        if (bar) bar.style.display = "none";
      });
  }

  function wireChrome() {
    initMarquee();
    bindNewsletter(document);
    syncCount();

    const toggle = document.getElementById("navToggle");
    const nl = document.getElementById("nl");
    if (toggle && nl)
      toggle.addEventListener("click", () => {
        const open = nl.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });

    const shopBtn = document.getElementById("navShop");
    const shopMenu = document.getElementById("shopMenu");
    if (shopBtn && shopMenu) {
      shopBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = shopMenu.classList.toggle("open");
        shopBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      document.addEventListener("click", (e) => {
        if (!shopMenu.contains(e.target) && e.target !== shopBtn) {
          shopMenu.classList.remove("open");
          shopBtn.setAttribute("aria-expanded", "false");
        }
      });
    }

    const so = document.getElementById("searchOpen");
    if (so) so.addEventListener("click", openSearch);
    const bo = document.getElementById("bagOpen");
    if (bo) bo.addEventListener("click", openBag);

    const si = document.getElementById("searchInput");
    if (si) si.addEventListener("input", (e) => runSearch(e.target.value));

    const cb = document.getElementById("checkoutBtn");
    if (cb)
      cb.addEventListener("click", function () {
        if (!Bag.count()) return;
        this.textContent = "Thank You. This Is A Demo Checkout.";
        setTimeout(() => {
          this.textContent = "Checkout";
        }, 2400);
      });

    /* bag qty + remove (delegated) */
    const bagBody = document.getElementById("bagBody");
    if (bagBody)
      bagBody.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        const key = b.dataset.key;
        const item = Bag.read().find((i) => i.key === key);
        if (!item) return;
        if (b.classList.contains("qplus")) Bag.setQty(key, item.qty + 1);
        else if (b.classList.contains("qminus")) Bag.setQty(key, item.qty - 1);
        else if (b.classList.contains("bag-remove")) Bag.remove(key);
      });

    /* close controls */
    document.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeOverlays));
    const scrim = document.getElementById("scrim");
    if (scrim) scrim.addEventListener("click", closeOverlays);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeOverlays();
    });

    /* any element that opens the size guide */
    document.querySelectorAll("[data-size]").forEach((el) =>
      el.addEventListener("click", (e) => {
        e.preventDefault();
        openSizeGuide();
      })
    );
  }

  /* mount chrome into a page. opts: { active } */
  function mount(opts) {
    opts = opts || {};
    const top = document.getElementById("az-top");
    if (top) top.innerHTML = navHTML(opts.active || "");
    const foot = document.getElementById("az-foot");
    if (foot) foot.innerHTML = footerHTML();
    document.body.insertAdjacentHTML("beforeend", overlaysHTML());
    wireChrome();
    observe(document);
  }

  /* --------------------------------------------------------------- expose */
  window.AZ = {
    GROUPS: GROUPS,
    Bag: Bag,
    byNum: byNum,
    padN: padN,
    colourOf: colourOf,
    tile: tile,
    specimenHTML: specimenHTML,
    tagShot: tagShot,
    altShot: altShot,
    renderGrid: renderGrid,
    renderPreview: renderPreview,
    renderArchive: renderArchive,
    observe: observe,
    openSearch: openSearch,
    openBag: openBag,
    openSizeGuide: openSizeGuide,
    bindNewsletter: bindNewsletter,
    mount: mount,
  };
})();
