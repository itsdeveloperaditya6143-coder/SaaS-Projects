/* TweetSplit v1.1 — 100% client-side SMART splitter (format-aware, no AI). */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var longInput = $("longInput"), threadList = $("threadList"), emptyState = $("emptyState"),
    statusPill = $("statusPill"), statusText = $("statusText"),
    totalChars = $("totalChars"), totalWords = $("totalWords"), toast = $("toast");

  var settings = { maxLen: 280, style: "start", auto: true, smart: true };
  var lastListCount = 0;
  var tweets = []; // final strings (with numbering applied)
  var manualEdits = {}; // index -> edited text (kept until re-split)
  var splitTimer = null;

  var SAMPLE = "I built my first micro-SaaS with zero money. No AI API, no paid domain, just Python + HTML.\n\nPeople said you need funding to build startups. I had only a laptop and 4 days.\n\nDay 1: I picked ONE painful problem — devs hate ugly code screenshots. Day 2: coded the theme engine. Day 3: added PNG export with Canvas. Day 4: shipped on Render free tier.\n\nResult? 58+ engagement on my first post. Small win, but it proved consistency beats perfection.\n\nNow I am building in public — 1 free tool every week. Next up is this thread splitter. Follow along, all code is open source. Let's grow together.";

  var LIST_SAMPLE = "10 Python tricks I wish I knew earlier:\n\n1. Swap two variables without temp: a, b = b, a\n2. Reverse a string in one line: s[::-1]\n3. Merge two dicts fast: {**a, **b}\n4. Most common item in a list: max(set(x), key=x.count)\n5. Check internet in 2 lines with requests.get\n6. Auto-save dict to file with json.dump\n7. List files in a folder with os.scandir\n8. Timer decorator for any function\n9. F-string debug trick: print(f\"{x=}\")\n10. Zip download of 200 certificates with Pillow\n\nI use at least 3 of these daily. Which one is new for you? Reply below.";

  /* ---------- v2 SMART splitter (format-aware, NO AI, mirrors backend/app.py) ----------
     Rules:
     1. Numbered lines (1.  2)  10:  -) and bullets (- * • >) are ATOMIC —
        a point is never cut in the middle, it moves whole to the next tweet.
     2. Single line-breaks inside a para are preserved (\n), paras split by \n\n.
     3. Normal text splits on sentence borders (abbreviations like Mr./e.g./3.14 safe).
     4. A point longer than the limit alone is word-split, continuation marked with "↳ ".
  --------------------------------------------------------------------------- */
  var NUM_RE = /^\s*\d{1,3}\s*[.)\:\-\]]\s+\S/;
  var NUM_ONLY_RE = /^\s*\d{1,3}\s*[.)\:\-\]]?\s*$/;
  var BUL_RE = /^\s*[-*•▪◦–—>]+\s+\S/;
  function isListLine(line) { return NUM_RE.test(line) || BUL_RE.test(line) || NUM_ONLY_RE.test(line); }

  var ABBREV = ["Mr", "Mrs", "Ms", "Dr", "Prof", "Sr", "Jr", "St", "vs", "e\\.g", "i\\.e", "etc", "Fig", "No", "Rs"];
  function splitSentencesSmart(line) {
    var prot = line;
    // protect abbreviations + decimals so "Mr. X" / "3.14" never split
    prot = prot.replace(new RegExp("\\b(" + ABBREV.join("|") + ")\\.", "g"), "$1<DOT>");
    prot = prot.replace(/(\d)\.(\d)/g, "$1<DOT>$2");
    var m = prot.match(/[^.!?]+[.!?]+["'”’)\]]*\s*|\s*\S[\s\S]*?(?=$)/g);
    var out = (m || [prot]).map(function (s) { return s.replace(/<DOT>/g, ".").trim(); }).filter(Boolean);
    return out.length ? out : [line.trim()];
  }

  // Break raw text into atomic units. Each unit: { t, join } where join = separator AFTER it.
  function tokenizeAtomic(text) {
    var units = [], listCount = 0;
    var paras = text.split(/\n\s*\n/);
    paras.forEach(function (rawPara) {
      var lines = rawPara.split("\n").map(function (l) { return l.replace(/\s+$/g, ""); });
      while (lines.length && !lines[0].trim()) lines.shift();
      while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
      if (!lines.length) return;
      var hasList = settings.smart && lines.some(isListLine);
      if (hasList) {
        var cur = null;
        function flush(join) {
          if (cur !== null) { units.push({ t: cur, join: join }); if (/^(\s*\d{1,3}\s*[.)\:\-\]]|\s*[-*•▪◦–—>])/.test(cur)) listCount++; cur = null; }
        }
        lines.forEach(function (line) {
          var tr = line.trim();
          if (!tr) { flush("\n"); return; }
          if (isListLine(line)) { flush("\n"); cur = tr; }
          else if (cur !== null) { cur = cur + " " + tr; } // wrapped continuation of same point
          else { units.push({ t: tr, join: "\n" }); }      // header line above the list
        });
        flush("\n\n"); // para break after list block
        if (units.length) units[units.length - 1].join = "\n\n";
      } else {
        lines.forEach(function (line, li) {
          var tr = line.trim();
          if (!tr) return;
          var sents = settings.smart ? splitSentencesSmart(tr) : [tr];
          sents.forEach(function (s, si) {
            var lastLine = (li === lines.length - 1), lastSent = (si === sents.length - 1);
            units.push({ t: s, join: !lastSent ? " " : !lastLine ? "\n" : "\n\n" });
          });
        });
      }
    });
    return { units: units, listCount: listCount };
  }

  function splitLongUnit(text, limit) {
    // word-split one oversized unit; follow-up pieces get "↳ " so readers see continuation
    var words = text.split(/\s+/), pieces = [], cur = "", cont = false;
    words.forEach(function (w) {
      var budget = limit - ((cont || pieces.length) ? 2 : 0);
      if (w.length > budget) {
        if (cur) { pieces.push(cur); cur = ""; }
        var startMark = (cont || pieces.length) ? "↳ " : "";
        var b0 = limit - startMark.length;
        for (var i = 0; i < w.length; i += b0) {
          var pre = (i === 0) ? startMark : "↳ ";
          pieces.push((pre + w.slice(i, i + limit - pre.length)).trim());
        }
        cont = true;
        return;
      }
      var pre2 = cur ? "" : ((cont || pieces.length) ? "↳ " : "");
      var trial = cur + (cur ? " " : "") + pre2 + w;
      if (trial.length <= limit) cur = trial;
      else {
        if (cur) pieces.push(cur);
        cur = ((pieces.length || cont) ? "↳ " : "") + w;
        cont = true;
      }
    });
    if (cur) pieces.push(cur);
    return pieces.length ? pieces : [text];
  }

  function packUnits(units, limit) {
    var chunks = [], cur = "", curSep = "";
    function pushCur() { if (cur.trim()) chunks.push(cur.trim()); cur = ""; curSep = ""; }
    units.forEach(function (u) {
      if (u.t.length > limit) {
        pushCur();
        splitLongUnit(u.t, limit).forEach(function (p) { chunks.push(p.trim()); });
        return;
      }
      if (!cur) { cur = u.t; curSep = u.join; return; }
      var trial = cur + curSep + u.t;
      if (trial.length <= limit) { cur = trial; curSep = u.join; }
      else { pushCur(); cur = u.t; curSep = u.join; }
    });
    pushCur();
    return chunks;
  }

  function splitSmart(text) {
    text = (text || "").replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
    if (!text) { lastListCount = 0; return []; }
    function pack(limit) {
      var tok = tokenizeAtomic(text);
      lastListCount = tok.listCount;
      return packUnits(tok.units, limit);
    }
    if (settings.style === "none") return pack(settings.maxLen);
    var guess = pack(settings.maxLen);
    var total = Math.max(1, guess.length);
    var reserve = String(total + "/" + total + " ").length;
    var chunks = pack(settings.maxLen - reserve);
    if (chunks.length !== total) {
      total = chunks.length;
      reserve = String(total + "/" + total + " ").length;
      var rechunk = pack(settings.maxLen - reserve);
      chunks = rechunk;
    }
    return chunks;
  }
  function applyNumbering(chunks) {
    var total = chunks.length;
    return chunks.map(function (c, i) {
      var n = i + 1;
      if (settings.style === "end") return c + "\n\n" + n + "/" + total;
      if (settings.style === "none") return c;
      return n + "/" + total + " " + c;
    });
  }

  /* ---------- render ---------- */
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function autoGrow(ta) { ta.style.height = "auto"; ta.style.height = (ta.scrollHeight) + "px"; }

  function render(rebuild) {
    if (rebuild !== false) {
      var chunks = splitSmart(longInput.value);
      var numbered = applyNumbering(chunks);
      // preserve manual edits by index where still in range
      tweets = numbered.map(function (t, i) {
        return (manualEdits[i] !== undefined) ? manualEdits[i] : t;
      });
    }
    threadList.innerHTML = "";
    if (!tweets.length) {
      threadList.appendChild(emptyState);
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
    }
    var overCount = 0;
    tweets.forEach(function (t, i) {
      if (i > 0) {
        var conn = document.createElement("div");
        conn.className = "thread-connector"; conn.innerHTML = "<span></span>";
        threadList.appendChild(conn);
      }
      var over = t.length > 280, warn = !over && t.length > settings.maxLen;
      if (over) overCount++;
      var card = document.createElement("div");
      card.className = "tweet" + (over ? " over" : "");
      var pct = Math.min(100, Math.round(t.length / 280 * 100));
      card.innerHTML =
        '<div class="tweet-head"><div class="avatar">A</div>' +
        '<div class="tmeta"><b>Aditya <span>· ' + (i + 1) + "/" + tweets.length + '</span></b><span>@you · now</span></div>' +
        '<span class="count-badge' + (over ? " over" : warn ? " warn" : "") + '">' + t.length + "/280</span></div>" +
        '<textarea rows="2" maxlength="2000" data-i="' + i + '"></textarea>' +
        '<div class="charbar"><i class="' + (over ? "over" : warn ? "warn" : "") + '" style="width:' + pct + '%"></i></div>' +
        '<div class="tfoot">' +
        '<button class="tbtn" data-act="up" data-i="' + i + '" ' + (i === 0 ? "disabled" : "") + '>↑</button>' +
        '<button class="tbtn" data-act="down" data-i="' + i + '" ' + (i === tweets.length - 1 ? "disabled" : "") + '>↓</button>' +
        '<button class="tbtn" data-act="copy" data-i="' + i + '">📋 copy</button>' +
        '<button class="tbtn" data-act="post" data-i="' + i + '">🐦 post</button>' +
        '<button class="tbtn danger" data-act="del" data-i="' + i + '">🗑️</button>' +
        "</div>";
      var ta = card.querySelector("textarea");
      ta.value = t;
      autoGrow(ta);
      ta.addEventListener("input", function () {
        var idx = +ta.getAttribute("data-i");
        manualEdits[idx] = ta.value;
        tweets[idx] = ta.value;
        autoGrow(ta);
        updateStatusOnly();
      });
      threadList.appendChild(card);
    });

    // stats
    var raw = longInput.value || "";
    totalChars.textContent = raw.length;
    totalWords.textContent = raw.trim() ? raw.trim().split(/\s+/).length : 0;
    updateStatusOnly(overCount);

    // persist
    try {
      localStorage.setItem("tweetsplit:v1", JSON.stringify({ text: longInput.value, settings: settings }));
    } catch (e) {}
  }

  function updateStatusOnly(overCount) {
    if (overCount === undefined) overCount = tweets.filter(function (t) { return t.length > 280; }).length;
    statusPill.className = "status-pill " + (!tweets.length ? "ok" : overCount ? "bad" : tweets.some(function (t) { return t.length > settings.maxLen; }) ? "warn" : "ok");
    if (!tweets.length) statusText.textContent = "Empty • paste text to start";
    else if (overCount) statusText.textContent = overCount + " tweet(s) over 280 — shorten red ones";
    else statusText.textContent = tweets.length + " tweet(s) • ready to post ✅";
    var fi = $("formatInfo");
    if (fi) {
      if (!tweets.length) fi.textContent = "Auto-splits as you type • edits below are kept until re-split";
      else if (settings.smart && lastListCount > 0) fi.textContent = "🔒 " + lastListCount + " list point(s) kept whole • format safe ✅";
      else if (settings.smart) fi.textContent = "🔒 smart lock on • lists & paras protected";
      else fi.textContent = "⚠️ smart lock off • lists may break mid-point";
    }
  }

  function showToast(msg) {
    toast.textContent = msg;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { toast.textContent = ""; }, 2200);
  }
  function copyText(s, msg) {
    function done() { showToast(msg || "Copied ✅"); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(s).then(done, function () { fallback(); });
    } else fallback();
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = s; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { showToast("Copy failed 😢"); }
      document.body.removeChild(ta);
    }
  }

  /* ---------- events ---------- */
  function scheduleSplit() {
    if (!settings.auto) return;
    clearTimeout(splitTimer);
    splitTimer = setTimeout(function () { manualEdits = {}; render(true); }, 350);
  }
  longInput.addEventListener("input", scheduleSplit);
  $("splitBtn").addEventListener("click", function () { manualEdits = {}; render(true); showToast("Split done ✂️"); });
  $("sampleBtn").addEventListener("click", function () { longInput.value = SAMPLE; manualEdits = {}; render(true); });
  $("listDemoBtn").addEventListener("click", function () { longInput.value = LIST_SAMPLE; manualEdits = {}; render(true); showToast("🔢 10-point list loaded — no point breaks ✅"); });
  $("clearBtn").addEventListener("click", function () { longInput.value = ""; manualEdits = {}; render(true); });
  $("pasteBtn").addEventListener("click", function () {
    if (navigator.clipboard && navigator.clipboard.readText) {
      navigator.clipboard.readText().then(function (t) { longInput.value = t; manualEdits = {}; render(true); }, function () { showToast("Press Ctrl+V to paste"); longInput.focus(); });
    } else { longInput.focus(); showToast("Press Ctrl+V to paste"); }
  });
  $("addBtn").addEventListener("click", function () {
    tweets.push("New tweet — edit me ✏️");
    manualEdits[tweets.length - 1] = tweets[tweets.length - 1];
    render(false);
  });

  // settings segments
  $("lenSeg").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    Array.prototype.forEach.call(this.querySelectorAll("button"), function (x) { x.classList.remove("active"); });
    b.classList.add("active");
    settings.maxLen = +b.getAttribute("data-len");
    manualEdits = {}; render(true);
  });
  $("styleSeg").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    Array.prototype.forEach.call(this.querySelectorAll("button"), function (x) { x.classList.remove("active"); });
    b.classList.add("active");
    settings.style = b.getAttribute("data-style");
    manualEdits = {}; render(true);
  });
  $("optAuto").addEventListener("change", function () { settings.auto = this.checked; });
  $("optSmart").addEventListener("change", function () { settings.smart = this.checked; manualEdits = {}; render(true); });

  // tweet card buttons (delegated)
  threadList.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-act]"); if (!b) return;
    var i = +b.getAttribute("data-i"), act = b.getAttribute("data-act");
    if (act === "copy") copyText(tweets[i], "Tweet " + (i + 1) + " copied 📋");
    else if (act === "post") window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweets[i]), "_blank");
    else if (act === "del") {
      tweets.splice(i, 1);
      var ne = {}; tweets.forEach(function (t, j) { ne[j] = t; }); manualEdits = ne;
      render(false);
    }
    else if (act === "up" && i > 0) {
      var tmp = tweets[i - 1]; tweets[i - 1] = tweets[i]; tweets[i] = tmp;
      var ne2 = {}; tweets.forEach(function (t, j) { ne2[j] = t; }); manualEdits = ne2;
      render(false);
    }
    else if (act === "down" && i < tweets.length - 1) {
      var tmp2 = tweets[i + 1]; tweets[i + 1] = tweets[i]; tweets[i] = tmp2;
      var ne3 = {}; tweets.forEach(function (t, j) { ne3[j] = t; }); manualEdits = ne3;
      render(false);
    }
  });

  // bulk actions
  $("copyAllBtn").addEventListener("click", function () {
    if (!tweets.length) return showToast("Nothing to copy yet");
    copyText(tweets.join("\n\n---\n\n"), tweets.length + " tweets copied 📋 — post one by one");
  });
  $("postBtn").addEventListener("click", function () {
    if (!tweets.length) return showToast("Nothing to post yet");
    copyText(tweets.slice(1).join("\n\n---\n\n"), "Rest copied! Posting 1st on X...");
    setTimeout(function () {
      window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweets[0]), "_blank");
    }, 600);
  });
  $("downloadBtn").addEventListener("click", function () {
    if (!tweets.length) return showToast("Nothing to download yet");
    var blob = new Blob([tweets.join("\n\n---\n\n") + "\n\n— Made with TweetSplit (free, open source)"], { type: "text/plain" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "thread.txt"; a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    showToast("Downloaded thread.txt ⬇️");
  });
  $("shareBtn").addEventListener("click", function () {
    var payload = { t: longInput.value.slice(0, 8000), m: settings.maxLen, s: settings.style, f: settings.smart ? 1 : 0 };
    var hash = "#t=" + btoa(unescape(encodeURIComponent(JSON.stringify(payload)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    var url = location.origin + location.pathname + hash;
    copyText(url, "Share link copied 🔗");
    try { history.replaceState(null, "", hash); } catch (e) {}
  });

  /* ---------- restore: hash > localStorage ---------- */
  function restore() {
    try {
      if (location.hash.indexOf("#t=") === 0) {
        var b64 = location.hash.slice(3).replace(/-/g, "+").replace(/_/g, "/");
        var obj = JSON.parse(decodeURIComponent(escape(atob(b64))));
        if (obj.t) longInput.value = obj.t;
        if (obj.m) settings.maxLen = Math.max(50, Math.min(280, +obj.m || 280));
        if (obj.s) settings.style = obj.s;
        if (obj.f === 0) settings.smart = false;
        syncSettingsUI();
        render(true);
        return;
      }
      var saved = JSON.parse(localStorage.getItem("tweetsplit:v1") || "null");
      if (saved) {
        if (saved.text) longInput.value = saved.text;
        if (saved.settings) {
          settings.maxLen = saved.settings.maxLen || 280;
          settings.style = saved.settings.style || "start";
          if (saved.settings.auto === false) { settings.auto = false; $("optAuto").checked = false; }
          if (saved.settings.smart === false) { settings.smart = false; }
        }
        syncSettingsUI();
      }
    } catch (e) {}
    render(true);
  }
  function syncSettingsUI() {
    Array.prototype.forEach.call($("lenSeg").querySelectorAll("button"), function (x) {
      x.classList.toggle("active", +x.getAttribute("data-len") === settings.maxLen);
    });
    Array.prototype.forEach.call($("styleSeg").querySelectorAll("button"), function (x) {
      x.classList.toggle("active", x.getAttribute("data-style") === settings.style);
    });
    if ($("optSmart")) $("optSmart").checked = settings.smart !== false;
    if ($("optAuto")) $("optAuto").checked = settings.auto !== false;
  }

  /* ---------- PWA ---------- */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function () {});
    });
  }
  var deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); deferredPrompt = e;
    $("installBtn").style.display = "inline-block";
    $("installBanner").style.display = "flex";
  });
  function doInstall() {
    if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt.userChoice.finally(function () { deferredPrompt = null; }); }
    $("installBanner").style.display = "none";
  }
  $("installBtn").addEventListener("click", doInstall);
  $("installBtn2").addEventListener("click", doInstall);
  $("installClose").addEventListener("click", function () { $("installBanner").style.display = "none"; });

  restore();
})();
