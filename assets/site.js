/* ============================================================
   PPP 사이트 동작
   카테고리 라우팅(해시), 모바일 메뉴, 실시간 견적 계산기
   ============================================================ */
(function(){
  "use strict";

  /* ---------------- 카테고리 라우팅 ---------------- */
  var VIEWS = ["home","film","press","special","quote"];
  var TITLES = {
    home:"PPP | 60cm 풀폭 DTF 필름, 프레스 임가공, 완성티",
    film:"DTF 필름 | PPP",
    press:"프레스 임가공·완성티 | PPP",
    special:"180cm 승화·스페셜 | PPP",
    quote:"실시간 견적·FAQ | PPP"
  };
  /* 예전 페이지의 앵커로 들어온 링크를 새 카테고리로 받아 줍니다 */
  var LEGACY = {
    top:"home", studio:"home", edge:"film", why:"film", process:"film",
    price:"quote", files:"quote", faq:"quote", contact:"quote",
    garment:"press", tee:"press", lineup:"special"
  };

  var views = {};
  Array.prototype.forEach.call(document.querySelectorAll("[data-view]"), function(v){
    views[v.getAttribute("data-view")] = v;
  });
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var current = null;

  function setNav(name){
    navLinks.forEach(function(t){
      if (t.getAttribute("data-nav") === name) t.setAttribute("aria-current","page");
      else t.removeAttribute("aria-current");
    });
  }

  function show(name){
    if (!views[name]) name = "home";
    Object.keys(views).forEach(function(k){
      views[k].classList.toggle("is-on", k === name);
    });
    setNav(name);
    document.title = TITLES[name] || TITLES.home;
    current = name;
    window.scrollTo({top:0, left:0, behavior:"auto"});
    revealScan();
  }

  function route(){
    var h = (location.hash || "").replace(/^#/,"");
    if (!h) h = "home";
    var name = VIEWS.indexOf(h) >= 0 ? h : LEGACY[h];
    show(name || "home");
  }

  window.addEventListener("hashchange", route);

  /* 같은 탭을 다시 누르면 맨 위로 */
  document.addEventListener("click", function(e){
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    var name = VIEWS.indexOf(id) >= 0 ? id : LEGACY[id];
    if (!name) return;
    closeDrawer();
    if (current === name && VIEWS.indexOf(id) >= 0){
      e.preventDefault();
      window.scrollTo({top:0, left:0, behavior:"smooth"});
      if (history.replaceState) history.replaceState(null, "", "#" + id);
    }
  });

  /* ---------------- 헤더, 모바일 메뉴 ---------------- */
  var hd = document.getElementById("hd");
  var burger = document.getElementById("burger");
  var drawer = document.getElementById("drawer");

  function closeDrawer(){
    if (!drawer || !burger) return;
    drawer.classList.remove("on");
    burger.setAttribute("aria-expanded","false");
    burger.setAttribute("aria-label","메뉴 열기");
  }
  function toggleDrawer(){
    if (!drawer || !burger) return;
    var on = !drawer.classList.contains("on");
    drawer.classList.toggle("on", on);
    burger.setAttribute("aria-expanded", on ? "true" : "false");
    burger.setAttribute("aria-label", on ? "메뉴 닫기" : "메뉴 열기");
  }
  if (burger) burger.addEventListener("click", toggleDrawer);
  document.addEventListener("keydown", function(e){ if (e.key === "Escape") closeDrawer(); });
  window.addEventListener("resize", function(){ if (window.innerWidth > 1020) closeDrawer(); });

  function onScroll(){
    if (!hd) return;
    hd.classList.toggle("solid", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();

  /* ---------------- 등장 애니메이션 ---------------- */
  var obs = null;
  if ("IntersectionObserver" in window){
    obs = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting){ en.target.classList.add("in"); obs.unobserve(en.target); }
      });
    }, {rootMargin:"0px 0px -8% 0px", threshold:.06});
  }
  function revealScan(){
    var list = document.querySelectorAll(".rv:not(.in)");
    Array.prototype.forEach.call(list, function(el){
      if (obs) obs.observe(el); else el.classList.add("in");
    });
  }
  revealScan();

  /* ---------------- 견적 계산기 ---------------- */
  var el = function(id){ return document.getElementById(id); };
  var won = function(n){ return Math.round(n).toLocaleString("ko-KR") + "원"; };

  if (el("rc-total")){
    var state = { tab:"film", film:"m", press:"a4", tee:"tee", qty:{film:1, press:10, tee:20} };

    Array.prototype.forEach.call(document.querySelectorAll(".ctab"), function(t){
      t.addEventListener("click", function(){
        Array.prototype.forEach.call(document.querySelectorAll(".ctab"), function(x){ x.setAttribute("aria-selected","false"); });
        t.setAttribute("aria-selected","true");
        Array.prototype.forEach.call(document.querySelectorAll(".panel"), function(p){ p.classList.remove("on"); });
        var panel = el("p-" + t.dataset.tab);
        if (panel) panel.classList.add("on");
        state.tab = t.dataset.tab;
        render();
      });
    });

    function bindOpts(groupId, key){
      var box = el(groupId);
      if (!box) return;
      box.addEventListener("click", function(e){
        var b = e.target.closest(".opt");
        if (!b || b.dataset.key === "none" || b.dataset.key === "tee2") return;
        Array.prototype.forEach.call(box.querySelectorAll(".opt"), function(o){ o.setAttribute("aria-pressed","false"); });
        b.setAttribute("aria-pressed","true");
        state[key] = b.dataset.key;
        render();
      });
    }
    bindOpts("film-opts","film");
    bindOpts("press-opts","press");

    Array.prototype.forEach.call(document.querySelectorAll("[data-step]"), function(btn){
      btn.addEventListener("click", function(){
        var input = el(btn.dataset.target);
        if (!input) return;
        var step = parseInt(btn.dataset.step,10);
        var v = (parseInt(input.value,10) || 0) + step;
        var min = parseInt(input.min,10), max = parseInt(input.max,10);
        v = Math.min(max, Math.max(min, v));
        input.value = v;
        syncQty(input.id, v);
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll(".stepper input"), function(input){
      input.addEventListener("input", function(){
        var v = parseInt(input.value,10) || 0;
        var max = parseInt(input.max,10);
        if (v > max) v = max;
        syncQty(input.id, v);
      });
      input.addEventListener("blur", function(){
        var min = parseInt(input.min,10), max = parseInt(input.max,10);
        var v = Math.min(max, Math.max(min, parseInt(input.value,10) || min));
        input.value = v;
        syncQty(input.id, v);
      });
    });
    function syncQty(id, v){
      if (id === "q-film") state.qty.film = v;
      if (id === "q-press") state.qty.press = v;
      if (id === "q-tee") state.qty.tee = v;
      render();
    }

    var PRESS = {
      chest:{ name:"왼가슴, 소매 10×10", tiers:[[1,9,4000],[10,29,3500],[30,Infinity,3000]] },
      a4:{ name:"앞판 A4", tiers:[[1,9,6500],[10,29,5500],[30,Infinity,5000]] },
      a3:{ name:"등판 A3", tiers:[[1,9,8500],[10,29,7500],[30,Infinity,6500]] }
    };
    var TEE = [[10,29,12500],[30,99,11500],[100,Infinity,10500]];

    function tierPrice(tiers, q){
      for (var i=0;i<tiers.length;i++){ if (q >= tiers[i][0] && q <= tiers[i][1]) return {p:tiers[i][2], i:i}; }
      return {p:tiers[0][2], i:0};
    }

    /* 1m 9,000 / 5m 42,500 / 10m 80,000, 그 사이는 5m 묶음 + 1m */
    function filmPrice(q){
      if (q <= 0) return 0;
      var base = Math.floor(q/10) * 80000;
      var rem = q % 10;
      if (rem >= 5){ base += 42500; rem -= 5; }
      base += rem * 9000;
      return Math.min(base, 80000 * Math.ceil(q/10));
    }

    function render(){
      var item, unitLine, total = 0, ship = 0, note = "";

      if (state.tab === "film"){
        var q = Math.max(1, state.qty.film);
        var mTotal = filmPrice(q);
        total = mTotal;
        ship = 5000;
        item = "필름 60cm × 1m";
        unitLine = q < 5 ? ("9,000원 × " + q + "m") : (q + "m 묶음 " + won(mTotal));
        if (q < 5) note = "부가세 포함. 5m부터 1m당 값이 내려갑니다. 배송비 5,000원 별도.";
        else if (q < 10) note = "5m 42,500원, 10m 80,000원입니다. 배송비 5,000원 별도.";
        else note = "10m 이상은 1m당 8,000원입니다. 부가세 포함, 배송비 5,000원 별도.";
      }

      if (state.tab === "press"){
        var pg = PRESS[state.press];
        var pq = Math.max(5, state.qty.press);
        var t = tierPrice(pg.tiers, pq);
        total = t.p * pq;
        item = "프레스 " + pg.name;
        unitLine = won(t.p) + " × " + pq + "장";
        var next = pg.tiers[t.i+1];
        note = next
          ? ("지금 장당 " + won(t.p) + ". " + next[0] + "장부터 " + won(next[2]) + "으로 내려갑니다.")
          : "가장 낮은 구간입니다. 부가세 포함, 왕복 배송비 별도.";
      }

      if (state.tab === "tee"){
        var tq = Math.max(10, state.qty.tee);
        var tt = tierPrice(TEE, tq);
        total = tt.p * tq;
        item = "완성티, 무지티 포함";
        unitLine = won(tt.p) + " × " + tq + "장";
        var tnext = TEE[tt.i+1];
        note = tnext
          ? ("지금 장당 " + won(tt.p) + ". " + tnext[0] + "장부터 " + won(tnext[2]) + "입니다. 납기 4~5영업일.")
          : "가장 낮은 구간입니다. 납기 4~5영업일.";
      }

      el("rc-item").textContent = item;
      el("rc-unit").textContent = unitLine;
      el("rc-ship").textContent = ship ? won(ship) : "별도";
      el("rc-total").textContent = won(total + ship);
      el("rc-note").textContent = note;

      window.__quote = item + " / " + unitLine + " = " + won(total + ship) + (ship ? " (배송비 포함)" : " (배송비 별도)");
    }

    var copyBtn = el("rc-copy");
    if (copyBtn) copyBtn.addEventListener("click", function(){
      var text = window.__quote || "";
      var done = function(){
        var tt = el("toast");
        if (!tt) return;
        tt.textContent = "견적 문구를 복사했습니다";
        tt.classList.add("on");
        setTimeout(function(){ tt.classList.remove("on"); }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        try{ document.execCommand("copy"); }catch(err){}
        document.body.removeChild(ta); done();
      }
    });

    render();
  }

  route();
})();
