(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- menu hambúrguer ---- */
  var drawer = $("#drawer"), burger = $("#burger");
  function setMenu(open) {
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("menu-open", open);
    if (open) { var x = $(".x", drawer); if (x) x.focus(); }
  }
  if (drawer && burger) {
    burger.addEventListener("click", function () { setMenu(!drawer.classList.contains("open")); });
    $$("[data-close]", drawer).forEach(function (el) { el.addEventListener("click", function () { setMenu(false); burger.focus(); }); });
    $$("a", drawer).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && drawer.classList.contains("open")) { setMenu(false); burger.focus(); } });
  }

  /* ---- faixa de palavras (home) ---- */
  var m = $("#marquee");
  if (m) {
    var words = ["Shows", "Eventos", "Artistas", "Marcas", "Câmera", "Drone", "Conteúdo audiovisual"];
    var html = words.map(function (w) { return "<span>" + w + "</span>"; }).join("");
    m.innerHTML = html + html;
  }

  /* ---- timecode do painel (home) ---- */
  var tc = $("#tc");
  if (tc && !reduce) {
    var t0 = Date.now();
    var pad = function (n) { return String(n).padStart(2, "0"); };
    setInterval(function () {
      var s = (Date.now() - t0) / 1000, f = Math.floor((s % 1) * 24);
      tc.textContent = pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s / 60) % 60) + ":" + pad(Math.floor(s) % 60) + ":" + pad(f);
    }, 42);
  }

  /* ---- mensagem pronta para o WhatsApp (home) ---- */
  var form = $("#brief"), send = $("#send");
  if (form && send) {
    var base = "https://wa.me/556492137757";
    var update = function () {
      var tipo = form.querySelector("input[name=tipo]:checked").value;
      var data = $("#data").value.trim(), cidade = $("#cidade").value.trim();
      var txt = "Olá, Emanoel! Quero um orçamento de vídeo para " + tipo;
      if (data) txt += " no dia " + data;
      if (cidade) txt += ", em " + cidade;
      send.href = base + "?text=" + encodeURIComponent(txt + ".");
    };
    form.addEventListener("input", update);
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    update();
  }

  /* ---- botões de copiar (home) ---- */
  $$(".copy").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-copy");
      var done = function (t) { b.textContent = t; setTimeout(function () { b.textContent = "Copiar"; }, 1600); };
      var fallback = function () {
        var r = document.createRange(); r.selectNodeContents(b.previousElementSibling.querySelector("span"));
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); done("Selecionado");
      };
      try { navigator.clipboard.writeText(v).then(function () { done("Copiado"); }, fallback); } catch (e) { fallback(); }
    });
  });

  /* ---- vídeos de fundo dos clientes ---- */
  $$(".scene video").forEach(function (v) {
    var scene = v.closest(".scene"), btn = $(".snd", scene);
    v.muted = true;
    if (reduce) { v.controls = true; if (btn) btn.hidden = true; return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.4 });
    io.observe(v);
    if (btn) btn.addEventListener("click", function () {
      v.muted = !v.muted;
      btn.setAttribute("aria-pressed", v.muted ? "false" : "true");
      $("span", btn).textContent = v.muted ? "Ativar som" : "Desativar som";
      if (!v.muted) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    });
  });
})();
