(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var html = document.documentElement;
  var lang = 'ar';
  var T = function (ar, en) { return lang === 'ar' ? ar : en; };

  /* ---------- header ---------- */
  var hdr = $('#hdr');
  function onScroll() { hdr.classList.toggle('solid', window.scrollY > 60); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var drawer = $('#drawer');
  $('#burger').addEventListener('click', function () { drawer.classList.add('open'); });
  $('#close').addEventListener('click', function () { drawer.classList.remove('open'); });
  $$('#drawer a').forEach(function (a) { a.addEventListener('click', function () { drawer.classList.remove('open'); }); });

  /* office / currency menu */
  var regBtn = $('#regBtn'), regMenu = $('#regMenu');
  regBtn.addEventListener('click', function (e) { e.stopPropagation(); regMenu.classList.toggle('open'); });
  document.addEventListener('click', function () { regMenu.classList.remove('open'); });
  $$('#regMenu button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('#regMenu button').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on'); regMenu.classList.remove('open'); regLabel();
    });
  });
  function regLabel() {
    var b = $('#regMenu button.on');
    $('#regTxt').textContent = b.getAttribute(lang === 'ar' ? 'data-r' : 'data-ren');
  }

  /* ---------- hero slider ---------- */
  var slides = $$('.slide'), dots = $('#dots'), cur = 0, timer;
  slides.forEach(function (_, i) {
    var d = document.createElement('button');
    d.className = 'dot' + (i === 0 ? ' on' : ''); d.setAttribute('aria-label', 'slide ' + (i + 1));
    d.innerHTML = '<i></i>'; d.addEventListener('click', function () { go(i); }); dots.appendChild(d);
  });
  function label() {
    var s = slides[cur];
    $('#destName').textContent = s.getAttribute('data-' + (lang === 'ar' ? 'ar' : 'en'));
    $('#destCountry').textContent = s.getAttribute('data-c-' + (lang === 'ar' ? 'ar' : 'en'));
  }
  function go(n) {
    slides[cur].classList.remove('on'); $$('.dot')[cur].classList.remove('on');
    cur = (n + slides.length) % slides.length;
    void slides[cur].offsetWidth; slides[cur].classList.add('on');
    var dt = $$('.dot')[cur]; void dt.offsetWidth; dt.classList.add('on');
    label(); restart();
  }
  function restart() { clearTimeout(timer); timer = setTimeout(function () { go(cur + 1); }, 6000); }
  restart();
  document.addEventListener('visibilitychange', function () { if (document.hidden) clearTimeout(timer); else restart(); });

  /* ---------- request widget ---------- */
  $$('.tw').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.tw').forEach(function (x) { x.classList.toggle('on', x === b); });
      $$('.panel').forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-p') === b.getAttribute('data-t')); });
      $('#toast').classList.remove('show');
    });
  });
  $$('.cat-list a[data-tab]').forEach(function (a) {
    a.addEventListener('click', function () {
      var t = a.getAttribute('data-tab'), opt = parseInt(a.getAttribute('data-opt'), 10);
      var tb = $('.tw[data-t="' + t + '"]'); if (tb) tb.click();
      var sel = t === 'visa' ? $$('.panel[data-p="visa"] select')[1] : $$('.panel[data-p="' + t + '"] select')[0];
      if (sel && sel.options[opt]) sel.selectedIndex = opt;
    });
  });
  $$('.panel').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault(); $('#toast').classList.add('show');
    });
  });

  /* ---------- reveal ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' }) : null;
  $$('.rv').forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });

  /* ---------- destination carousel ---------- */
  var feat = [
    ['تركيا', 'Türkiye', 'tr', 'photo-1763965368246-5e89755e4455', [7, 4, 3]],
    ['فرنسا', 'France', 'fr', 'photo-1502602898657-3e91760cbb34', [6, 3, 4]],
    ['كندا', 'Canada', 'ca', 'photo-1497373637916-e47a55e22d0a', [5, 4, 2]],
    ['الإمارات', 'UAE', 'ae', 'photo-1512632578888-169bbbc64f33', [8, 3, 5]],
    ['اليابان', 'Japan', 'jp', 'photo-1513407030348-c983a97b98d8', [6, 2, 3]],
    ['ماليزيا', 'Malaysia', 'my', 'photo-1597148543182-830ef7bbb904', [6, 3, 3]],
    ['سنغافورة', 'Singapore', 'sg', 'photo-1510923119584-fc67ed7ff3de', [5, 2, 2]],
    ['المالديف', 'Maldives', 'mv', 'photo-1743356174397-d6da6f014f8f', [4, 1, 3]]
  ];
  var car = $('#car');
  function drawCar() {
    car.innerHTML = '';
    feat.forEach(function (c) {
      var a = document.createElement('a'); a.href = '#req'; a.className = 'dcard';
      a.innerHTML = '<img class="bg" loading="lazy" alt="" src="https://images.unsplash.com/' + c[3] + '?auto=format&fit=crop&w=700&q=75">' +
        '<img class="fl" alt="" src="https://flagcdn.com/w80/' + c[2] + '.png">' +
        '<h3>' + T(c[0], c[1]) + '</h3>' +
        '<div class="stats"><div><b>' + c[4][0] + '</b>' + T('خدمات', 'Services') + '</div><div><b>' + c[4][1] + '</b>' + T('أنواع تأشيرة', 'Visa types') + '</div><div><b>' + c[4][2] + '</b>' + T('باقات', 'Packages') + '</div></div>';
      car.appendChild(a);
    });
  }
  function scrollCar(dir) {
    var w = 288 * dir * (lang === 'ar' ? -1 : 1);
    car.scrollBy({ left: w * 2, behavior: 'smooth' });
  }
  /* drag the carousel with the mouse (touch already scrolls natively) */
  var dDown = false, dSx = 0, dSl = 0, dMoved = 0;
  car.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    dDown = true; dMoved = 0; dSx = e.clientX; dSl = car.scrollLeft; car.classList.add('drag');
  });
  window.addEventListener('pointermove', function (e) {
    if (!dDown) return;
    var dx = e.clientX - dSx; dMoved = Math.max(dMoved, Math.abs(dx)); car.scrollLeft = dSl - dx;
  });
  window.addEventListener('pointerup', function () { if (dDown) { dDown = false; car.classList.remove('drag'); } });
  car.addEventListener('click', function (e) { if (dMoved > 5) { e.preventDefault(); e.stopPropagation(); } dMoved = 0; }, true);
  car.addEventListener('dragstart', function (e) { e.preventDefault(); });
  $('#cPrev').addEventListener('click', function () { scrollCar(-1); });
  $('#cNext').addEventListener('click', function () { scrollCar(1); });

  /* ---------- all destinations ---------- */
  var regions = [
    { ar: 'أوروبا', en: 'Europe', items: [['فرنسا', 'France', 'fr'], ['إيطاليا', 'Italy', 'it'], ['إسبانيا', 'Spain', 'es'], ['ألمانيا', 'Germany', 'de'], ['سويسرا', 'Switzerland', 'ch'], ['اليونان', 'Greece', 'gr'], ['هولندا', 'Netherlands', 'nl'], ['النمسا', 'Austria', 'at']] },
    { ar: 'كندا', en: 'Canada', items: [['كندا', 'Canada', 'ca']] },
    { ar: 'الخليج والدول العربية', en: 'Gulf & Arab world', items: [['عُمان', 'Oman', 'om'], ['الإمارات', 'UAE', 'ae'], ['السعودية', 'Saudi Arabia', 'sa'], ['قطر', 'Qatar', 'qa'], ['الكويت', 'Kuwait', 'kw'], ['البحرين', 'Bahrain', 'bh'], ['الأردن', 'Jordan', 'jo'], ['مصر', 'Egypt', 'eg'], ['المغرب', 'Morocco', 'ma']] },
    { ar: 'تركيا والهند وباكستان', en: 'Türkiye, India & Pakistan', items: [['تركيا', 'Türkiye', 'tr'], ['الهند', 'India', 'in'], ['باكستان', 'Pakistan', 'pk']] },
    { ar: 'شرق وجنوب شرق آسيا', en: 'East & Southeast Asia', items: [['الصين', 'China', 'cn'], ['كوريا الجنوبية', 'South Korea', 'kr'], ['اليابان', 'Japan', 'jp'], ['ماليزيا', 'Malaysia', 'my'], ['تايلاند', 'Thailand', 'th'], ['سنغافورة', 'Singapore', 'sg'], ['إندونيسيا', 'Indonesia', 'id'], ['فيتنام', 'Vietnam', 'vn']] }
  ];
  var active = regions[0], tabs = $('#tabs'), grid = $('#dgrid'), q = $('#dq');
  var counts = [5, 6, 4, 7, 5, 6, 3, 8];
  regions.forEach(function (r, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'tab' + (i === 0 ? ' on' : '');
    b.addEventListener('click', function () {
      active = r; q.value = '';
      $$('.tab').forEach(function (t) { t.classList.toggle('on', t === b); }); drawGrid();
    });
    tabs.appendChild(b);
  });
  function tabText() { $$('.tab').forEach(function (t, i) { t.textContent = T(regions[i].ar, regions[i].en); }); }
  function drawGrid() {
    var term = q.value.trim().toLowerCase(), list = [];
    if (term) { regions.forEach(function (r) { r.items.forEach(function (it) { if (it[0].indexOf(term) > -1 || it[1].toLowerCase().indexOf(term) > -1) list.push(it); }); }); }
    else list = active.items;
    grid.innerHTML = '';
    list.forEach(function (it, i) {
      var a = document.createElement('a'); a.href = '#req'; a.className = 'dc'; a.style.animationDelay = (i * 45) + 'ms';
      var n = counts[(i + it[2].charCodeAt(0)) % counts.length];
      a.innerHTML = '<img src="https://flagcdn.com/w80/' + it[2] + '.png" alt="" loading="lazy"><div><b>' + T(it[0], it[1]) + '</b><span>' + n + T(' خدمات متاحة', ' services available') + '</span></div>';
      grid.appendChild(a);
    });
    if (!list.length) grid.innerHTML = '<p style="grid-column:1/-1;color:var(--muted)">' + T('لا توجد نتائج', 'No results') + '</p>';
  }
  q.addEventListener('input', drawGrid);

  /* ---------- journey ---------- */
  var steps = $$('.step'), scr = $$('.sc-i'), si = 0, st;
  function setStep(i) {
    si = i;
    steps.forEach(function (s, k) { s.classList.remove('on'); if (k === i) { void s.offsetWidth; s.classList.add('on'); } });
    scr.forEach(function (s, k) { s.classList.toggle('on', k === i); });
    clearTimeout(st); st = setTimeout(function () { setStep((si + 1) % steps.length); }, 3600);
  }
  steps.forEach(function (s, i) { s.addEventListener('click', function () { setStep(i); }); });
  setStep(0);

  /* ---------- tracking ---------- */
  var recs = {
    'SH-2041': { idx: 2, svc: ['تأشيرة سياحية، تركيا', 'Tourist visa, Türkiye'], off: ['قسم التأشيرات', 'Visa team'], upd: ['قبل ساعتين', '2 hours ago'] },
    'SH-2042': { idx: 4, svc: ['باقة سياحية، المالديف', 'Tour package, Maldives'], off: ['قسم الباقات', 'Packages team'], upd: ['أمس', 'Yesterday'] }
  };
  var hs = $$('.hs');
  function track(code) {
    var r = recs[code.trim().toUpperCase()], line = $('#hline');
    if (!r) { line.style.setProperty('--p', '0%'); hs.forEach(function (h) { h.className = 'hs'; });
      $('#tkSvc').textContent = T('لم نجد هذا الرقم', 'Number not found'); $('#tkOff').textContent = '—'; $('#tkPay').textContent = '—'; return; }
    hs.forEach(function (h, i) { h.className = 'hs' + (i < r.idx || r.idx === 4 ? ' done' : (i === r.idx ? ' cur' : '')); });
    line.style.setProperty('--p', (r.idx * 20) + '%');
    $('#tkSvc').textContent = T(r.svc[0], r.svc[1]); $('#tkOff').textContent = T(r.off[0], r.off[1]); $('#tkPay').textContent = T(r.upd[0], r.upd[1]);
  }
  $('#trkForm').addEventListener('submit', function (e) { e.preventDefault(); track($('#trkIn').value); });
  var tObs = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { track($('#trkIn').value); tObs.disconnect(); } }); }, { threshold: .4 }) : null;
  if (tObs) tObs.observe($('#hline')); else track('SH-2041');

  /* ---------- offices ---------- */
  var offs = [
    { ar: 'اليمن', en: 'Yemen', f: 'ye', city: ['مكتب اليمن', 'Yemen office'], addr: ['المدينة، الحي، الشارع', 'City, district, street'], hrs: ['الأحد إلى الخميس، 9 ص إلى 5 م', 'Sunday to Thursday, 9 am to 5 pm'] },
    { ar: 'مصر', en: 'Egypt', f: 'eg', city: ['مكتب مصر', 'Egypt office'], addr: ['المدينة، الحي، الشارع', 'City, district, street'], hrs: ['الأحد إلى الخميس، 9 ص إلى 5 م', 'Sunday to Thursday, 9 am to 5 pm'] },
    { ar: 'عُمان', en: 'Oman', f: 'om', city: ['مكتب عُمان', 'Oman office'], addr: ['المدينة، الحي، الشارع', 'City, district, street'], hrs: ['الأحد إلى الخميس، 9 ص إلى 5 م', 'Sunday to Thursday, 9 am to 5 pm'] }
  ];
  var oi = 0, ol = $('#offList');
  offs.forEach(function (o, i) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'ob' + (i === 0 ? ' on' : '');
    b.addEventListener('click', function () { oi = i; $$('.ob').forEach(function (x, k) { x.classList.toggle('on', k === i); }); drawOff(); });
    ol.appendChild(b);
  });
  function drawOff() {
    $$('.ob').forEach(function (b, i) {
      var o = offs[i];
      b.innerHTML = '<img src="https://flagcdn.com/w80/' + o.f + '.png" alt=""><div><b>' + T(o.ar, o.en) + '</b><span>' + T(o.city[0], o.city[1]) + '</span></div>';
    });
    var o = offs[oi];
    $('#ofName').textContent = T(o.ar, o.en); $('#ofSub').textContent = T(o.city[0], o.city[1]);
    $('#ofAddr').textContent = T(o.addr[0], o.addr[1]); $('#ofHrs').textContent = T(o.hrs[0], o.hrs[1]);
  }

  /* ---------- faq ---------- */
  var fc = $$('.fcat'), qa = $$('.qa');
  fc.forEach(function (b, i) { b.addEventListener('click', function () { fc.forEach(function (x) { x.classList.toggle('on', x === b); }); qa.forEach(function (x, k) { x.classList.toggle('on', k === i); }); }); });

  /* ---------- language ---------- */
  $$('[data-en]').forEach(function (el) { el.setAttribute('data-ar', el.innerHTML); });
  var ph = {}; $$('[data-ph-en]').forEach(function (el, i) { ph[i] = el.getAttribute('placeholder'); });
  function setLang(l) {
    lang = l; html.lang = l; html.dir = l === 'ar' ? 'rtl' : 'ltr';
    $$('[data-en]').forEach(function (el) { el.innerHTML = el.getAttribute(l === 'ar' ? 'data-ar' : 'data-en'); });
    $$('[data-ph-en]').forEach(function (el, i) { el.placeholder = l === 'ar' ? ph[i] : el.getAttribute('data-ph-en'); });
    $('#langtxt').textContent = l === 'ar' ? 'English' : 'العربية';
    document.title = l === 'ar' ? 'الشهم للسفريات والسياحة وخدمات الأعمال' : 'AL SHAHEM Travel, Tourism & Business Services';
    tabText(); drawGrid(); drawCar(); drawOff(); label(); regLabel(); track($('#trkIn').value);
  }
  $('#lang').addEventListener('click', function () { setLang(lang === 'ar' ? 'en' : 'ar'); });
  tabText(); drawGrid(); drawCar(); drawOff(); label(); regLabel();
})();
