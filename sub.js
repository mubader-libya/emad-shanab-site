/* ══ م. عماد شنب: الطبقة المشتركة. الترويسة والتذييل وقائمة الهاتف والعارض، وطبقة البيانات ══ */
(function(){
  "use strict";
  var Y = window.Y = {};
  var CFG = window.SITE_CONFIG || {cms:""};
  var root = document.documentElement;
  root.classList.add("js");
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (RM) root.classList.add("rm");

  /* ── أدوات عامة ── */
  var MONTHS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
  Y.date = function(iso){ if(!iso) return ""; var d = iso.split("-"); return (+d[2]) + " " + MONTHS[+d[1]-1] + " " + d[0]; };
  Y.esc = function(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); };
  Y.norm = function(s){ return String(s).replace(/[ً-ْـ]/g, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").toLowerCase(); };
  Y.n = function(n, many, few){
    var one = many.replace(/اً$/, "").replace(/ً$/, "");
    if (n === 1) return one + " واحد" + (/ة$/.test(one) ? "ة" : "");
    if (n === 2) return (/ة$/.test(one) ? one.replace(/ة$/, "تان") : one + "ان");
    return n + " " + (n % 100 >= 3 && n % 100 <= 10 ? few : many);
  };
  Y.KINDS = {meeting:"لقاء رسمي", event:"مشاركة", article:"مقال", occasion:"مناسبة", interview:"مقابلة"};
  Y.KINDS_PL = {meeting:"لقاءات رسمية", event:"مشاركات", article:"مقالات", occasion:"مناسبات", interview:"مقابلات"};
  Y.param = function(k){ return new URLSearchParams(location.search).get(k); };
  Y.ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m6-6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  Y.pic = function(im, sizes, alt, eager){
    if (!im) return "";
    return '<img src="' + im.s + '" srcset="' + im.s + ' 700w, ' + im.l + ' 1600w" sizes="' + (sizes || "(max-width:700px) 100vw, 33vw") + '" width="' + (im.w||1600) + '" height="' + (im.h||1000) + '" alt="' + Y.esc(alt || "") + '"' + (eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"') + '>';
  };

  /* ── الفصول والقائمة: مصدر واحد لكل الصفحات ── */
  Y.CHAPTERS = [
    {href:"index.html",      t:"الرئيسية", key:"home",       role:"من هو"},
    {href:"journey.html",    t:"المسيرة",  key:"journey",    role:"أدواره ومحطاته"},
    {href:"activities.html", t:"النشاطات", key:"activities", role:"ما يفعله اليوم"}
  ];
  Y.SOCIAL = [
    {t:"فيسبوك",  h:"facebook.com/Emad.Shanab.Ly",   u:"https://www.facebook.com/Emad.Shanab.Ly"},
    {t:"لينكدإن", h:"linkedin.com/in/emad-shanab",    u:"https://www.linkedin.com/in/emad-shanab"},
    {t:"إنستغرام",h:"instagram.com/emad_shanab",      u:"https://www.instagram.com/emad_shanab/"},
    {t:"إكس",     h:"x.com/Emad_Shanab_LY",           u:"https://x.com/Emad_Shanab_LY"}
  ];
  Y.CV = {t:"السيرة الذاتية", note:"ملف PDF · نسخة 2022", u:"https://emadshanab.com/wp-content/uploads/2022/08/cv-%D8%B9%D9%85%D8%A7%D8%AF-%D8%B4%D9%86%D8%A8.pdf"};

  function chrome(){
    var page = document.body.dataset.page || "";
    var cur = {role:"journey", activity:"activities"}[page] || page;
    var links = Y.CHAPTERS.map(function(c){ return '<a href="' + c.href + '"' + (c.key === cur ? ' aria-current="page"' : '') + '>' + c.t + '</a>'; }).join("") + '<a href="#contact">تواصل</a>';
    var top = document.createElement("header");
    top.className = "top";
    top.innerHTML = '<div class="bar glass"><a class="brand" href="index.html" aria-label="م. عماد شنب، الرئيسية"><img src="img/name.png" alt="عماد شنب" width="340" height="110"><span>رئيس منتدى حوار الشباب</span></a>'
      + '<nav class="nav" aria-label="القائمة الرئيسية">' + links + '</nav>'
      + '<button class="menu-btn" type="button" aria-label="فتح القائمة" aria-expanded="false" aria-controls="sheet"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></div>';
    document.body.insertBefore(top, document.body.firstChild);
    var skip = document.createElement("a"); skip.className = "skip"; skip.href = "#main"; skip.textContent = "تخطَّ إلى المحتوى";
    document.body.insertBefore(skip, top);
    var light = document.createElement("div"); light.className = "light"; light.setAttribute("aria-hidden","true"); light.innerHTML = "<i></i><i></i>";
    document.body.insertBefore(light, document.body.firstChild);

    /* قائمة الهاتف */
    var sheet = document.createElement("div");
    sheet.className = "sheet"; sheet.id = "sheet"; sheet.setAttribute("role","dialog"); sheet.setAttribute("aria-modal","true"); sheet.setAttribute("aria-label","القائمة");
    sheet.innerHTML = '<div class="panel glass"><header><img src="img/name.png" alt="عماد شنب" width="340" height="110" style="height:28px;width:auto"><button class="x" type="button" aria-label="إغلاق القائمة">×</button></header>'
      + links.replace(/<a /g, '<a class="l" ') + '</div>';
    document.body.appendChild(sheet);
    var btn = top.querySelector(".menu-btn");
    function close(){ sheet.classList.remove("open"); btn.setAttribute("aria-expanded","false"); btn.focus(); }
    btn.addEventListener("click", function(){ sheet.classList.add("open"); btn.setAttribute("aria-expanded","true"); sheet.querySelector("a").focus(); });
    sheet.querySelector(".x").addEventListener("click", close);
    sheet.addEventListener("click", function(e){ if (e.target === sheet || e.target.closest("a")) { sheet.classList.remove("open"); btn.setAttribute("aria-expanded","false"); } });
    document.addEventListener("keydown", function(e){ if (e.key === "Escape" && sheet.classList.contains("open")) close(); });

    /* التذييل: طريق التواصل في نهاية كل صفحة */
    var foot = document.createElement("footer");
    foot.className = "foot"; foot.id = "contact";
    foot.innerHTML = '<div class="wrap"><div class="box glass rv"><div><h2>للتواصل والدعوات</h2><p>للدعوات إلى الفعاليات واللقاءات الإعلامية، والتواصل مع م. عماد شنب: عبر حساباته الرسمية.</p></div>'
      + '<div class="links">' + Y.SOCIAL.map(function(s){ return '<a href="' + s.u + '" target="_blank" rel="noopener">' + s.t + '<small>' + s.h + '</small></a>'; }).join("")
      + '<a class="wide" href="' + Y.CV.u + '" target="_blank" rel="noopener">' + Y.CV.t + '<small style="direction:rtl">' + Y.CV.note + '</small></a></div></div></div>'
      + '<div class="copy"><span>م. عماد إبراهيم شنب © ' + new Date().getFullYear() + '</span><span>جميع الحقوق محفوظة</span></div>';
    document.body.appendChild(foot);
  }

  /* ── «أنت هنا» والفصل التالي ── */
  Y.trail = function(el, items){
    el.innerHTML = '<a href="index.html">الرئيسية</a>' + items.map(function(it, i){
      return '<span class="sep" aria-hidden="true">/</span>' + (it.href && i < items.length - 1 ? '<a href="' + it.href + '">' + Y.esc(it.t) + '</a>' : '<b aria-current="page">' + Y.esc(it.t) + '</b>');
    }).join("");
  };
  Y.nextChapter = function(el, key, line){
    var i = Y.CHAPTERS.map(function(c){ return c.key; }).indexOf(key);
    var nx = Y.CHAPTERS[(i + 1) % Y.CHAPTERS.length];
    el.innerHTML = '<div class="wrap"><a class="glass rv" href="' + nx.href + '"><div><small>' + (i + 1 < Y.CHAPTERS.length ? "الفصل التالي" : "العودة إلى البداية") + '</small><b>' + nx.t + ': ' + nx.role + '</b><span>' + Y.esc(line) + '</span></div><span class="arr">' + Y.ARROW + '</span></a></div>';
  };

  /* ── عارض الصور: لوحة المفاتيح والسحب، والتركيز محبوس داخله ── */
  var lb, lbImgs = [], lbI = 0, lbCap = "", lbBack = null;
  function lbShow(){ var im = lbImgs[lbI]; lb.querySelector("img").src = im.l; lb.querySelector("img").alt = lbCap; lb.querySelector("figcaption").textContent = lbCap + " · صورة " + (lbI + 1) + " من " + lbImgs.length; }
  function lbClose(){ lb.classList.remove("open"); if (lbBack) lbBack.focus(); }
  Y.gallery = function(container, imgs, cap){
    if (!lb){
      lb = document.createElement("div"); lb.className = "lb"; lb.setAttribute("role","dialog"); lb.setAttribute("aria-modal","true"); lb.setAttribute("aria-label","عارض الصور");
      lb.innerHTML = '<figure><img alt=""><figcaption></figcaption></figure>'
        + '<button class="c" type="button" aria-label="إغلاق"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>'
        + '<button class="pv" type="button" aria-label="الصورة السابقة"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'
        + '<button class="nx" type="button" aria-label="الصورة التالية"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
      document.body.appendChild(lb);
      lb.querySelector(".c").onclick = lbClose;
      lb.querySelector(".pv").onclick = function(){ lbI = (lbI - 1 + lbImgs.length) % lbImgs.length; lbShow(); };
      lb.querySelector(".nx").onclick = function(){ lbI = (lbI + 1) % lbImgs.length; lbShow(); };
      lb.addEventListener("click", function(e){ if (e.target === lb) lbClose(); });
      document.addEventListener("keydown", function(e){
        if (!lb.classList.contains("open")) return;
        if (e.key === "Escape") lbClose();
        if (e.key === "ArrowLeft") lb.querySelector(".nx").click();
        if (e.key === "ArrowRight") lb.querySelector(".pv").click();
        if (e.key === "Tab"){ var f = [].slice.call(lb.querySelectorAll("button")); var i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
      });
      var x0 = null;
      lb.addEventListener("touchstart", function(e){ x0 = e.touches[0].clientX; }, {passive:true});
      lb.addEventListener("touchend", function(e){ if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) (dx > 0 ? lb.querySelector(".pv") : lb.querySelector(".nx")).click(); x0 = null; });
    }
    container.addEventListener("click", function(e){
      var b = e.target.closest("[data-i]"); if (!b) return;
      lbImgs = imgs; lbI = +b.dataset.i; lbCap = cap; lbBack = b; lbShow(); lb.classList.add("open"); lb.querySelector(".c").focus();
    });
  };

  /* ══ طبقة البيانات: كل صفحة تطلب من هنا، ولا تعرف المصدر ══
     بلا CMS: البيانات المحلية فوراً. مع CMS (Strapi): الطلب، ثم الرجوع للمحلي عند أي خطأ. */
  var MEDIA = ["url","formats","width","height"];
  function pic(base){ return function(m){ if (!m) return null; var f = m.formats || {}; var u = function(x){ return x && (/^https?:/.test(x.url) ? x.url : base + x.url); };
    return {s:u(f.small || f.medium || m), l:u(f.large || m), w:m.width, h:m.height}; }; }
  var ENDPOINTS = {
    /* النشاطات: {id, date, t, k, p:[فقرات], img:[{s,l,w,h}], vid:{yt}|{fb}|null, src} */
    activities: {
      route:"/api/activities", fields:["title","slug","legacyId","date","kind","body","videoUrl"], populate:{images:MEDIA},
      sort:["date:desc","id:desc"],
      local:function(){ return {activities:(window.ACTS || []).slice()}; },
      map:function(json, base){ var p = pic(base); return {activities:(json.data || []).map(function(a){
        var yt = a.videoUrl && (a.videoUrl.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/) || [])[1];
        return {id:a.slug || a.legacyId || a.documentId, date:a.date, t:a.title, k:a.kind || "event", p:String(a.body || "").split(/\n{2,}/).filter(Boolean), img:(a.images || []).map(p), vid:yt ? {yt:yt} : (a.videoUrl ? {fb:a.videoUrl} : null)};
      })}; }
    },
    /* الأدوار والمحطات: {id, t, year, now, g:role|milestone, p:[…], img, more} */
    roles: {
      route:"/api/roles", fields:["title","slug","year","current","group","body","moreUrl","order"], populate:{image:MEDIA},
      sort:["order:asc","id:asc"],
      local:function(){ return {roles:(window.ROLES || []).slice()}; },
      map:function(json, base){ var p = pic(base); return {roles:(json.data || []).map(function(r){
        return {id:r.slug || r.documentId, t:r.title, year:r.year || null, now:!!r.current, g:r.group || "milestone", p:String(r.body || "").split(/\n{2,}/).filter(Boolean), img:p(r.image), more:r.moreUrl || null};
      })}; }
    }
  };
  function query(ep, page){
    var q = [];
    ep.fields.forEach(function(f, i){ q.push("fields[" + i + "]=" + f); });
    Object.keys(ep.populate || {}).forEach(function(k){ ep.populate[k].forEach(function(f, i){ q.push("populate[" + k + "][fields][" + i + "]=" + f); }); });
    (ep.sort || []).forEach(function(o, i){ q.push("sort[" + i + "]=" + o); });
    q.push("pagination[page]=" + page, "pagination[pageSize]=100");
    return q.join("&");
  }
  var cache = {};
  Y.load = function(name){
    var ep = ENDPOINTS[name];
    if (cache[name]) return cache[name];
    if (!CFG.cms) return (cache[name] = Promise.resolve(ep.local()));
    var base = CFG.cms.replace(/\/$/, "");
    var slow = setTimeout(function(){ root.classList.add("sk-on"); }, 400);
    var get = function(p){ return fetch(base + ep.route + "?" + query(ep, p)).then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); }); };
    return (cache[name] = get(1).then(function(first){
      var n = (first.meta && first.meta.pagination && first.meta.pagination.pageCount) || 1, rest = [];
      for (var i = 2; i <= n; i++) rest.push(get(i));
      return Promise.all(rest).then(function(more){ more.forEach(function(m){ first.data = first.data.concat(m.data || []); }); return ep.map(first, base); });
    }).then(function(d){ var k = Object.keys(d)[0]; if (!d[k].length) throw new Error("empty"); return d; })
      .catch(function(e){ console.warn("[data] " + name + ": local fallback (" + e.message + ")"); return ep.local(); })
      .finally(function(){ clearTimeout(slow); root.classList.remove("sk-on"); }));
  };

  /* ── الحركة: ظهور هادئ، وتمرير ناعم على الحاسوب فقط ── */
  Y.reveal = function(scope){
    var els = [].slice.call((scope || document).querySelectorAll(".rv:not(.in)"));
    if (RM || !window.gsap || !window.ScrollTrigger){ els.forEach(function(e){ e.classList.add("in"); e.style.opacity = 1; e.style.transform = "none"; }); return; }
    ScrollTrigger.batch(els, {start:"top 88%", once:true, onEnter:function(b){
      b.forEach(function(e){ e.classList.add("in"); });
      gsap.to(b, {opacity:1, y:0, duration:.9, ease:"power3.out", stagger:.08, overwrite:true, clearProps:"transform"});
    }});
  };
  function motion(){
    if (!window.gsap) { root.classList.add("no-anim"); return; }
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    if (!RM && window.Lenis && matchMedia("(pointer:fine)").matches && innerWidth > 900){
      var lenis = new Lenis({lerp:.1});
      lenis.on("scroll", function(){ window.ScrollTrigger && ScrollTrigger.update(); });
      gsap.ticker.add(function(t){ lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0);
      document.addEventListener("click", function(e){ var a = e.target.closest('a[href^="#"]'); if (a && a.getAttribute("href").length > 1){ var t = document.querySelector(a.getAttribute("href")); if (t){ e.preventDefault(); lenis.scrollTo(t, {offset:-90}); } } });
    }
    if (!RM && window.ScrollTrigger){
      gsap.to(".light i:nth-child(1)", {yPercent:-30, ease:"none", scrollTrigger:{start:0, end:"max", scrub:true}});
      gsap.to(".light i:nth-child(2)", {yPercent:40, ease:"none", scrollTrigger:{start:0, end:"max", scrub:true}});
    }
  }

  document.addEventListener("DOMContentLoaded", function(){
    chrome(); motion();
    if (window.PAGE) Promise.resolve(window.PAGE()).then(function(){ Y.reveal(); }); else Y.reveal();
  });
})();
