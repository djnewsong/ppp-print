/* ============================================================
   PPP 주문서, 상담 레이어
   index.html 과 builder.html 이 함께 씁니다.
   서버 없이 도는 정적 주문 흐름입니다.
   ============================================================ */
(function(){
  "use strict";
  if (window.PPPOrder) return;

  var KAKAO = "https://pf.kakao.com/_HxhwvX/chat";
  var FORM  = "https://naver.me/FORU0hO2";
  var TEL   = "tel:01040319191";
  var STORE = "ppp.buyer.v1";

  var won = function(n){ return (Math.round(n)||0).toLocaleString("ko-KR") + "원"; };
  var num = function(t){ var d = String(t||"").replace(/[^\d]/g, ""); return d ? parseInt(d,10) : NaN; };
  var esc = function(s){ return String(s==null?"":s).replace(/[&<>"']/g, function(c){
    return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]; }); };
  var txt = function(sel){ var el = document.querySelector(sel); return el ? el.textContent.trim() : ""; };

  /* ---------- 주문번호 ---------- */
  function orderNo(){
    var d = new Date();
    var p = function(n){ return n<10 ? "0"+n : ""+n; };
    var r;
    if (window.crypto && window.crypto.getRandomValues){
      var a = new Uint32Array(1); window.crypto.getRandomValues(a); r = a[0] % 10000;
    } else { r = Math.floor(Math.random()*10000); }
    var rs = String(r); while (rs.length < 4) rs = "0" + rs;
    return "PPP-" + String(d.getFullYear()).slice(2) + p(d.getMonth()+1) + p(d.getDate()) + "-" + rs;
  }
  function dateLine(){
    var d = new Date(), p = function(n){ return n<10?"0"+n:""+n; };
    return d.getFullYear() + "." + p(d.getMonth()+1) + "." + p(d.getDate());
  }

  /* ---------- 클립보드 ---------- */
  function copyText(t){
    try{
      var ta = document.createElement("textarea");
      ta.value = t;
      ta.style.position = "fixed"; ta.style.left = "-9999px"; ta.style.top = "0";
      document.body.appendChild(ta);
      ta.focus(); ta.select(); ta.setSelectionRange(0, ta.value.length);
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (ok) return true;
    }catch(e){}
    try{ if (navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(t); return true; } }catch(e){}
    return false;
  }

  /* ============================================================
     플로팅 상담 바
     ============================================================ */
  var fab = document.createElement("div");
  fab.className = "ppFab";
  fab.innerHTML =
    '<div class="ppFab-menu" id="ppFabMenu">' +
      '<a class="pp-kakao" href="' + KAKAO + '" target="_blank" rel="noopener">' +
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.9 3 3 6.2 3 10.1c0 2.5 1.6 4.7 4.1 6l-.8 3c-.1.4.3.7.7.5l3.5-2.3c.5.1 1 .1 1.5.1 5.1 0 9-3.2 9-7.1S17.1 3 12 3Z"/></svg>' +
        '<i>카톡 상담</i></a>' +
      '<a class="pp-ghost" href="' + FORM + '" target="_blank" rel="noopener">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 3h9l5 5v13H5z"/><path d="M14 3v5h5M8 13h8M8 17h5"/></svg>' +
        '<i>도안, 견적 폼</i></a>' +
      '<a class="pp-ghost" href="' + TEL + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6.6 3.5 9 8l-1.9 1.6a12.4 12.4 0 0 0 6.3 6.3L15 14l4.5 2.4-.6 3.1a1.6 1.6 0 0 1-1.8 1.3A16.6 16.6 0 0 1 3.2 6a1.6 1.6 0 0 1 1.3-1.8Z"/></svg>' +
        '<i>전화 010-4031-9191</i></a>' +
    '</div>' +
    '<button type="button" class="ppFab-btn" id="ppFabBtn" aria-expanded="false" aria-controls="ppFabMenu">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12a8 8 0 0 1-8 8H8l-5 2 1.6-4.2A8 8 0 1 1 21 12Z"/></svg> 상담</button>';
  document.body.appendChild(fab);

  if (document.querySelector(".dock") || document.querySelector(".bottombar")) fab.classList.add("ppFab-hide-m");

  var fabBtn = fab.querySelector("#ppFabBtn");
  fabBtn.addEventListener("click", function(){
    var on = fab.classList.toggle("open");
    fabBtn.setAttribute("aria-expanded", on ? "true" : "false");
  });

  function placeFab(){
    var bar = document.querySelector(".bottombar") || document.querySelector(".dock");
    var h = 0;
    if (bar){
      var cs = getComputedStyle(bar);
      if (cs.display !== "none") h = bar.getBoundingClientRect().height;
    }
    var base = h > 0 ? h + 14 : 18;
    document.documentElement.style.setProperty("--ppp-fab-offset", Math.round(base) + "px");
  }
  placeFab();
  window.addEventListener("resize", placeFab);
  setTimeout(placeFab, 400);

  /* ============================================================
     주문 모달
     ============================================================ */
  var modal = document.createElement("div");
  modal.className = "ppModal";
  modal.innerHTML =
  '<div class="ppModal-bg" data-close></div>' +
  '<div class="ppModal-box" role="dialog" aria-modal="true" aria-labelledby="ppModalTitle">' +
    '<div class="ppM-head">' +
      '<div>' +
        '<span class="ppM-eyebrow">Order</span>' +
        '<h2 id="ppModalTitle">주문서 작성</h2>' +
        '<p>아래 내용을 확인하고 주문서를 복사해 카카오톡으로 보내 주세요. 입금 계좌는 확인하는 대로 바로 안내드립니다.</p>' +
      '</div>' +
      '<button type="button" class="ppM-x" data-close aria-label="닫기">✕</button>' +
    '</div>' +
    '<div class="ppM-scroll" id="ppMScroll">' +
      '<div id="ppMView">' +
        '<div class="ppM-receipt" id="ppMReceipt"></div>' +
        '<form id="ppMForm" novalidate autocomplete="on">' +
          '<div class="ppM-sec">' +
            '<div class="ppM-sec-h"><b>주문자</b><i></i></div>' +
            '<div class="ppM-grid">' +
              '<label class="ppF" id="f-name"><span>이름 <em>*</em></span><input type="text" name="name" placeholder="주문자 성함" autocomplete="name"><span class="err">이름을 적어 주세요</span></label>' +
              '<label class="ppF" id="f-phone"><span>연락처 <em>*</em></span><input type="tel" name="phone" placeholder="010-0000-0000" autocomplete="tel"><span class="err">연락처를 확인해 주세요</span></label>' +
              '<label class="ppF full" id="f-addr"><span>배송지 <em>*</em></span><input type="text" name="addr" placeholder="도로명 주소와 상세 주소" autocomplete="street-address"><span class="err">배송지를 적어 주세요</span></label>' +
              '<label class="ppF full"><span>요청사항</span><textarea name="memo" placeholder="받는 분이 다르면 여기에 적어 주세요. 원단, 납기 요청도 함께 적어 주시면 좋습니다."></textarea></label>' +
            '</div>' +
          '</div>' +
          '<div class="ppM-sec">' +
            '<div class="ppM-sec-h"><b>증빙</b><i></i></div>' +
            '<div class="ppChips" id="ppMProof">' +
              '<label class="ppChip on"><input type="radio" name="proof" value="none" checked><b>신청 안 함</b></label>' +
              '<label class="ppChip"><input type="radio" name="proof" value="cash"><b>현금영수증</b></label>' +
              '<label class="ppChip"><input type="radio" name="proof" value="tax"><b>세금계산서</b></label>' +
            '</div>' +
            '<div class="ppM-extra" id="ppExtraCash">' +
              '<label class="ppF"><span>현금영수증 번호</span><input type="tel" name="cashno" placeholder="휴대폰 번호"><span class="err"></span></label>' +
            '</div>' +
            '<div class="ppM-extra" id="ppExtraTax">' +
              '<div class="ppM-grid">' +
                '<label class="ppF"><span>사업자등록번호</span><input type="text" name="bizno" placeholder="000-00-00000" inputmode="numeric"></label>' +
                '<label class="ppF"><span>이메일</span><input type="email" name="email" placeholder="세금계산서 받을 메일"></label>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="ppM-sec">' +
            '<div class="ppM-sec-h"><b>결제 방법</b><i></i></div>' +
            '<div class="ppChips" id="ppMPay">' +
              '<label class="ppChip on"><input type="radio" name="pay" value="bank" checked><b>무통장 입금</b><em>바로 주문 확정</em></label>' +
              '<label class="ppChip"><input type="radio" name="pay" value="card"><b>카드, 크몽</b><em>준비 중</em></label>' +
            '</div>' +
            '<p class="ppM-hint" id="ppPayHint"><b>무통장 입금</b>으로 접수합니다. 주문서를 보내 주시면 입금 계좌를 카카오톡으로 바로 안내드리고, 입금이 확인되면 출력에 들어갑니다.</p>' +
          '</div>' +
        '<div class="ppM-sec">' +
          '<div class="ppM-sec-h"><b>개인정보</b><i></i></div>' +
          '<label class="ppConsent" id="f-consent">' +
            '<input type="checkbox" name="consent" value="y">' +
            '<span class="box" aria-hidden="true"></span>' +
            '<span class="tx"><b>개인정보 수집 및 이용에 동의합니다</b> <em>(필수)</em>' +
              '<i>수집 항목: 이름, 연락처, 배송지, 요청사항 / 이용 목적: 주문 접수, 제작, 배송, 상담 / 보유 기간: 거래 기록 보존 기간(전자상거래법에 따른 계약 기록 5년)</i>' +
            '</span>' +
            '<span class="err">개인정보 수집 및 이용에 동의해 주세요</span>' +
          '</label>' +
          '<p class="ppM-hint">동의하지 않으시면 주문서를 만들 수 없습니다. 상담만 원하시면 카카오톡으로 문의해 주세요.</p>' +
        '</div>' +
        '</form>' +
        '<div class="ppM-sec" style="padding-bottom:10px">' +
          '<p class="ppM-hint" style="background:rgba(10,10,10,.04);border-left-color:rgba(10,10,10,.3)">이 화면은 결제 대행을 거치지 않는 <b>주문 접수용</b>입니다. 카드 결제와 현금영수증 발급은 상담에서 바로 처리해 드립니다.</p>' +
        '</div>' +
      '</div>' +
      '<div id="ppMDone" class="ppDone" style="display:none"></div>' +
    '</div>' +
    '<div class="ppM-foot" id="ppMFoot">' +
      '<div class="amt"><span>결제 금액</span><strong id="ppMTotal">0원</strong></div>' +
      '<button type="button" class="ppM-submit" id="ppMSubmit">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>' +
        '주문서 복사하고 카톡으로 결제 완료하기</button>' +
    '</div>' +
  '</div>';
  document.body.appendChild(modal);

  var box = modal.querySelector(".ppModal-box");
  var form = modal.querySelector("#ppMForm");
  var view = modal.querySelector("#ppMView");
  var done = modal.querySelector("#ppMDone");
  var foot = modal.querySelector("#ppMFoot");
  var receiptEl = modal.querySelector("#ppMReceipt");
  var totalEl = modal.querySelector("#ppMTotal");
  var scrollEl = modal.querySelector("#ppMScroll");

  var current = null;
  var lastFocus = null;

  function open(payload){
    current = payload || {};
    lastFocus = document.activeElement;

    var rows = (current.rows || []).map(function(r){
      return '<div class="ppM-r-line"><span>' + esc(r.k) + '</span><b>' + esc(r.v) + '</b></div>';
    }).join("");
    var meta = (current.meta || []).map(function(m){
      return '<span>' + esc(m) + '</span>';
    }).join('<i>·</i>');

    receiptEl.innerHTML =
      '<div class="ppM-r-head"><span>주문 내용</span><em>' + esc(current.headRight || "VAT 포함") + '</em></div>' +
      (meta ? '<div class="ppM-meta">' + meta + '</div>' : '') +
      rows +
      '<div class="ppM-r-total"><span>결제 금액</span><strong>' + won(current.total) + '</strong></div>' +
      (current.note ? '<p class="ppM-r-note">' + esc(current.note) + '</p>' : '');

    totalEl.textContent = won(current.total);
    form.reset();
    clearErrors();
    syncChips();
    syncExtras();
    restoreBuyer();
    view.style.display = "";
    foot.style.display = "";
    done.style.display = "none";
    done.innerHTML = "";
    modal.querySelector("#ppMSubmit").disabled = false;
    modal.classList.add("on");
    document.documentElement.style.overflow = "hidden";
    scrollEl.scrollTop = 0;
    setTimeout(function(){
      var f = form.querySelector('input[name="name"]');
      if (f) f.focus({preventScroll:true});
    }, 120);
  }

  function close(){
    modal.classList.remove("on");
    document.documentElement.style.overflow = "";
    if (lastFocus && lastFocus.focus) { try{ lastFocus.focus({preventScroll:true}); }catch(e){} }
  }

  modal.addEventListener("click", function(e){
    if (e.target.closest("[data-close]")) close();
  });
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape" && modal.classList.contains("on")) close();
  });

  /* 칩 */
  function syncChips(){
    ["#ppMProof", "#ppMPay"].forEach(function(sel){
      Array.prototype.forEach.call(modal.querySelectorAll(sel + " .ppChip"), function(c){
        var i = c.querySelector("input");
        c.classList.toggle("on", !!(i && i.checked));
      });
    });
  }
  function val(name){
    var el = form.querySelector('[name="' + name + '"]:checked');
    return el ? el.value : "";
  }
  function syncExtras(){
    var proof = val("proof");
    modal.querySelector("#ppExtraCash").classList.toggle("on", proof === "cash");
    modal.querySelector("#ppExtraTax").classList.toggle("on", proof === "tax");
    var pay = val("pay");
    var hint = modal.querySelector("#ppPayHint");
    if (pay === "card"){
      hint.innerHTML = '<b>카드, 크몽 결제</b>는 준비 중입니다. 주문서를 보내 주시면 상담에서 결제 링크를 바로 보내드립니다. 금액과 주문 내용은 그대로 접수됩니다.';
    } else {
      hint.innerHTML = '<b>무통장 입금</b>으로 접수합니다. 주문서를 보내 주시면 입금 계좌를 카카오톡으로 바로 안내드리고, 입금이 확인되면 출력에 들어갑니다.';
    }
  }
  modal.addEventListener("change", function(e){
    if (e.target && e.target.name) { syncChips(); syncExtras(); }
  });

  /* ---------- 저장된 주문자 ---------- */
  function saveBuyer(o){
    try{ localStorage.setItem(STORE, JSON.stringify(o)); }catch(e){}
  }
  function restoreBuyer(){
    try{
      var s = JSON.parse(localStorage.getItem(STORE) || "null");
      if (!s) return;
      if (s.name) form.querySelector('[name="name"]').value = s.name;
      if (s.phone) form.querySelector('[name="phone"]').value = s.phone;
      if (s.addr) form.querySelector('[name="addr"]').value = s.addr;
      if (s.email) form.querySelector('[name="email"]').value = s.email;
      if (s.bizno) form.querySelector('[name="bizno"]').value = s.bizno;
    }catch(e){}
  }

  /* ---------- 검증 ---------- */
  function clearErrors(){
    Array.prototype.forEach.call(form.querySelectorAll(".ppF.bad"), function(el){ el.classList.remove("bad"); });
  }
  function mark(id, bad){
    var el = modal.querySelector(id);
    if (el) el.classList.toggle("bad", bad);
  }
  function phoneFormat(v){
    var d = String(v||"").replace(/[^\d]/g, "");
    if (d.length === 11) return d.slice(0,3) + "-" + d.slice(3,7) + "-" + d.slice(7);
    if (d.length === 10) return d.slice(0,3) + "-" + d.slice(3,6) + "-" + d.slice(6);
    if (d.length > 7) return d.replace(/(\d{3})(\d+)(\d{4})/, "$1-$2-$3");
    return v;
  }
  form.addEventListener("blur", function(e){
    if (e.target && e.target.name === "phone" && e.target.value) e.target.value = phoneFormat(e.target.value);
  }, true);

  function readForm(){
    var o = {};
    ["name","phone","addr","memo","cashno","bizno","email"].forEach(function(n){
      var el = form.querySelector('[name="' + n + '"]');
      o[n] = el ? el.value.trim() : "";
    });
    o.proof = val("proof");
    o.pay = val("pay");
    var cs = form.querySelector('[name="consent"]');
    o.consent = !!(cs && cs.checked);
    return o;
  }

  function validate(o){
    clearErrors();
    var bad = false;
    if (o.name.length < 2){ mark("#f-name", true); bad = true; }
    if (String(o.phone).replace(/[^\d]/g,"").length < 9){ mark("#f-phone", true); bad = true; }
    if (o.addr.length < 4){ mark("#f-addr", true); bad = true; }
    if (!o.consent){ mark("#f-consent", true); bad = true; }
    if (bad){
      var first = form.querySelector(".ppF.bad input") || modal.querySelector("#f-consent.bad input");
      if (first) first.focus({preventScroll:true});
    }
    return !bad;
  }

  /* ---------- 주문서 문구 ---------- */
  function buildText(no, o){
    var L = [];
    L.push("[PPP 주문서] " + no);
    L.push("주문일 " + dateLine());
    L.push("");
    (current.rows || []).forEach(function(r){ L.push(r.k + " " + r.v); });
    L.push("결제 금액 " + won(current.total) + " (VAT 포함)");
    L.push("결제 방법 " + (o.pay === "card" ? "카드, 크몽 결제 문의" : "무통장 입금 (계좌는 카톡으로 안내)"));
    if (o.proof === "cash") L.push("증빙 현금영수증 " + (o.cashno || o.phone));
    else if (o.proof === "tax") L.push("증빙 세금계산서 " + (o.bizno || "사업자번호 미기재") + " " + (o.email || ""));
    else L.push("증빙 신청 안 함");
    L.push("");
    L.push("주문자 " + o.name);
    L.push("연락처 " + o.phone);
    L.push("배송지 " + o.addr);
    if (o.memo) L.push("요청사항 " + o.memo.replace(/\n/g, " / "));
    L.push("");
    L.push("개인정보 수집 및 이용 동의 완료");
    if (current.attach) L.push("");
    if (current.attach) L.push("첨부 " + current.attach);
    return L.join("\n");
  }

  /* ---------- 제출 ---------- */
  modal.querySelector("#ppMSubmit").addEventListener("click", function(){
    var o = readForm();
    if (!validate(o)) return;
    saveBuyer(o);

    var no = orderNo();
    var text = buildText(no, o);
    var copied = copyText(text);

    var payLine = o.pay === "card" ? "카드, 크몽 결제 문의" : "무통장 입금";

    done.innerHTML =
      '<div class="ok"><i>✓</i><h3>주문서를 만들었습니다</h3></div>' +
      '<span class="no">' + esc(no) + '</span>' +
      '<p>' + (copied
        ? '주문서를 클립보드에 <b>복사했습니다</b>. 카카오톡 채널을 열어 그대로 붙여넣어 보내 주세요.'
        : '아래 주문서를 <b>길게 눌러 복사</b>한 뒤 카카오톡 채널로 보내 주세요.') +
        '<br>' + esc(payLine) + ' 기준으로 접수되고, <b>입금 계좌는 카카오톡으로 바로 안내</b>드립니다.</p>' +
      '<textarea readonly>' + esc(text) + '</textarea>' +
      '<div class="acts">' +
        '<a class="kakao" href="' + KAKAO + '" target="_blank" rel="noopener">카카오톡으로 보내기</a>' +
        '<button type="button" id="ppCopyAgain">주문서 다시 복사</button>' +
        '<button type="button" id="ppClose">닫기</button>' +
      '</div>';

    view.style.display = "none";
    foot.style.display = "none";
    done.style.display = "";
    scrollEl.scrollTop = 0;

    done.querySelector("#ppCopyAgain").addEventListener("click", function(){
      var ok = copyText(text);
      this.textContent = ok ? "복사했습니다" : "직접 복사해 주세요";
      var self = this;
      setTimeout(function(){ self.textContent = "주문서 다시 복사"; }, 2000);
    });
    done.querySelector("#ppClose").addEventListener("click", close);

    setTimeout(function(){ window.open(KAKAO, "_blank", "noopener"); }, 120);
  });

  /* ---------- index 견적 계산기 연동 ---------- */
  function receiptPayload(){
    var item = txt("#rc-item") || "필름 60cm × 1m";
    var unit = txt("#rc-unit");
    var shipTxt = txt("#rc-ship");
    var totalTxt = txt("#rc-total");
    var note = txt("#rc-note");

    var total = num(totalTxt);
    if (isNaN(total)) total = 0;
    var ship = num(shipTxt);
    var hasShip = !isNaN(ship);
    var sub = hasShip ? total - ship : total;

    var rows = [{ k: item, v: unit || won(sub) }];
    if (hasShip) rows.push({ k: "배송비", v: won(ship) });
    else rows.push({ k: "배송비", v: "별도 (상담에서 안내)" });

    return {
      rows: rows,
      total: total,
      meta: [hasShip ? "배송비 포함" : "배송비 별도", "부가세 포함"],
      note: note || "부가세 포함 금액입니다.",
      headRight: "VAT 포함"
    };
  }

  document.addEventListener("click", function(e){
    var t = e.target.closest ? e.target.closest("[data-ppp-order]") : null;
    if (!t) return;
    e.preventDefault();
    open(receiptPayload());
  });

  window.PPPOrder = { open: open, close: close };
})();
