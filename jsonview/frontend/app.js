/* JSONView v1.0 — pure converters (testable, no DOM) + guarded UI app. */

/* ================= PURE LOGIC (no DOM, no deps) ================= */

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* Tiny strict JSON locator: returns error index, or -1 if valid.
   Used only to pinpoint errors when the engine message has no position (newer V8). */
function jsonErrorPos(text) {
  var i = 0, n = text.length, guard = 0;
  function err(msg) { var e = new Error(msg); e.pos = i; throw e; }
  function ws() { while (i < n && " \t\n\r".indexOf(text[i]) >= 0) i++; }
  function expectLit(w) {
    if (text.slice(i, i + w.length) === w) i += w.length;
    else err("Unexpected token '" + (text[i] || "") + "'");
  }
  function parseStr() {
    i++; // opening quote
    while (i < n) {
      var c = text[i];
      if (c === '"') { i++; return; }
      if (c === "\\") {
        i++;
        if (i >= n) err("Unterminated string");
        var e2 = text[i];
        if ('"\\/bfnrt'.indexOf(e2) >= 0) i++;
        else if (e2 === "u") {
          if (!/^[0-9a-fA-F]{4}$/.test(text.slice(i + 1, i + 5))) err("Bad unicode escape");
          i += 5;
        } else err("Bad escape character");
        continue;
      }
      if (c === "\n" || c === "\r") err("Unterminated string");
      i++;
    }
    err("Unterminated string");
  }
  function parseNum() {
    var m = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/.exec(text.slice(i));
    if (!m) err("Unexpected token '" + (text[i] || "") + "'");
    i += m[0].length;
  }
  function parseArr() {
    i++; ws();
    if (text[i] === "]") { i++; return; }
    while (true) {
      if (++guard > 1000000) err("Too complex");
      parseVal(); ws();
      if (text[i] === ",") { i++; ws(); if (text[i] === "]") err("Trailing comma"); continue; }
      if (text[i] === "]") { i++; return; }
      err("Expected ',' or ']'");
    }
  }
  function parseObj() {
    i++; ws();
    if (text[i] === "}") { i++; return; }
    while (true) {
      if (++guard > 1000000) err("Too complex");
      ws();
      if (text[i] !== '"') err("Expected string key");
      parseStr(); ws();
      if (text[i] !== ":") err("Expected ':'");
      i++; parseVal(); ws();
      if (text[i] === ",") { i++; ws(); if (text[i] === "}") err("Trailing comma"); continue; }
      if (text[i] === "}") { i++; return; }
      err("Expected ',' or '}'");
    }
  }
  function parseVal() {
    ws();
    if (i >= n) err("Unexpected end of input");
    var c = text[i];
    if (c === "{") return parseObj();
    if (c === "[") return parseArr();
    if (c === '"') return parseStr();
    if (c === "t") return expectLit("true");
    if (c === "f") return expectLit("false");
    if (c === "n") return expectLit("null");
    if (c === "-" || (c >= "0" && c <= "9")) return parseNum();
    err("Unexpected token '" + c + "'");
  }
  try {
    ws(); parseVal(); ws();
    if (i !== n) err("Unexpected token '" + text[i] + "'");
    return -1;
  } catch (e) {
    return (typeof e.pos === "number") ? e.pos : 0;
  }
}

function parseJsonWithPos(text) {
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch (e) {
    var msg = e.message || "Invalid JSON";
    var line = 1, col = 1, found = false;
    var m = msg.match(/at position (\d+)/) || msg.match(/at line (\d+) column (\d+)/);
    if (m && msg.indexOf("line") !== -1 && m[2] !== undefined) {
      line = +m[1]; col = +m[2]; found = true;
    } else if (m) {
      var upto = text.slice(0, +m[1]).split("\n");
      line = upto.length; col = upto[upto.length - 1].length + 1; found = true;
    }
    if (!found) {
      // newer engines omit position -> locate with own strict parser
      var pos = jsonErrorPos(text);
      if (pos >= 0) {
        var up2 = text.slice(0, pos).split("\n");
        line = up2.length; col = up2[up2.length - 1].length + 1; found = true;
      }
    }
    if (msg.indexOf("is not valid JSON") >= 0) msg = "Unexpected token here";
    var srcLines = text.split("\n");
    var excerpt = (srcLines[line - 1] !== undefined ? srcLines[line - 1].slice(0, 120) : "");
    return { ok: false, error: { message: msg.split(" in JSON")[0], line: line, col: col, excerpt: excerpt } };
  }
}

function sortKeysDeep(v) {
  if (Array.isArray(v)) return v.map(sortKeysDeep);
  if (v !== null && typeof v === "object") {
    var out = {};
    Object.keys(v).sort().forEach(function (k) { out[k] = sortKeysDeep(v[k]); });
    return out;
  }
  return v;
}

function getStats(v) {
  var keys = 0, depth = 0;
  (function walk(x, d) {
    if (d > depth) depth = d;
    if (Array.isArray(x)) x.forEach(function (i) { walk(i, d + 1); });
    else if (x !== null && typeof x === "object") {
      keys += Object.keys(x).length;
      Object.keys(x).forEach(function (k) { walk(x[k], d + 1); });
    }
  })(v, 1);
  var type = Array.isArray(v) ? "array" : (v !== null && typeof v === "object") ? "object" : typeof v;
  return { keys: keys, depth: depth, type: type };
}

/* ---------- JSON -> YAML (own emitter, no libs) ---------- */
function yamlScalar(v) {
  if (v === null || v === undefined) return "null";
  if (v === true) return "true";
  if (v === false) return "false";
  if (typeof v === "number") return isFinite(v) ? String(v) : "null";
  if (typeof v !== "string") return JSON.stringify(v);
  if (v === "") return "''";
  if (/[\n\r]/.test(v)) return JSON.stringify(v);
  if (/^[A-Za-z0-9_\-@#\/.:+]+$/.test(v) &&
      !/^(true|false|null|True|False|Null|NULL|~|[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?)$/.test(v)) return v;
  return "'" + v.replace(/'/g, "''") + "'";
}

function yamlEmit(v, ind) {
  var pad = "  ".repeat(ind);
  if (Array.isArray(v)) {
    if (!v.length) return "[]";
    return v.map(function (it) {
      if (it !== null && typeof it === "object") {
        var nested0 = yamlEmit(it, ind);
        if (nested0 === "[]" || nested0 === "{}") return pad + "- " + nested0;
        var nlines = nested0.split("\n").map(function (l) { return l.slice(pad.length); });
        var nfirst = nlines.shift();
        var nrest = nlines.map(function (l) { return pad + "  " + l; }).join("\n");
        return pad + "- " + nfirst + (nrest ? "\n" + nrest : "");
      }
      return pad + "- " + yamlScalar(it);
    }).join("\n");
  }
  if (v !== null && typeof v === "object") {
    var ks = Object.keys(v);
    if (!ks.length) return "{}";
    return ks.map(function (k) {
      var val = v[k];
      var key = /^[A-Za-z0-9_\-]+$/.test(k) ? k : "'" + k.replace(/'/g, "''") + "'";
      if (val !== null && typeof val === "object") {
        var nested = yamlEmit(val, ind + 1);
        if (nested === "[]" || nested === "{}") return pad + key + ": " + nested;
        return pad + key + ":\n" + nested;
      }
      return pad + key + ": " + yamlScalar(val);
    }).join("\n");
  }
  return yamlScalar(v);
}

function jsonToYaml(v) {
  return yamlEmit(v, 0) + "\n";
}

/* ---------- Simple-YAML -> JSON (subset parser: mappings, sequences, scalars) ---------- */
function yamlParseScalar(s) {
  var t = s.trim();
  if (t === "" || t === "~" || t === "null" || t === "Null" || t === "NULL") return null;
  if (t === "true" || t === "True" || t === "TRUE") return true;
  if (t === "false" || t === "False" || t === "FALSE") return false;
  if ((t[0] === '"' && t[t.length - 1] === '"') || (t[0] === "'" && t[t.length - 1] === "'")) {
    if (t[0] === "'") return t.slice(1, -1).replace(/''/g, "'");
    try { return JSON.parse(t); } catch (e) { return t.slice(1, -1); }
  }
  if (/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(t)) return parseFloat(t);
  if ((t[0] === "[" && t[t.length - 1] === "]") || (t[0] === "{" && t[t.length - 1] === "}")) {
    try { return JSON.parse(t); } catch (e) { throw new Error("Bad flow value: " + t); }
  }
  return t;
}

function yamlStripComment(line) {
  var inS = false, inD = false;
  for (var i = 0; i < line.length; i++) {
    var c = line[i];
    if (c === "'" && !inD) inS = !inS;
    else if (c === '"' && !inS) {
      var bs = 0, j = i - 1;
      while (j >= 0 && line[j] === "\\") { bs++; j--; }
      if (bs % 2 === 0) inD = !inD;
    } else if (c === "#" && !inS && !inD && (i === 0 || /\s/.test(line[i - 1]))) {
      return line.slice(0, i);
    }
  }
  return line;
}

function yamlToJsonSimple(text) {
  var rawLines = text.replace(/\r\n/g, "\n").split("\n");
  var lines = [];
  rawLines.forEach(function (rl, i) {
    if (/\t/.test(rl)) throw new Error("Tabs not allowed (line " + (i + 1) + ") — use spaces");
    var noComment = yamlStripComment(rl);
    if (!noComment.trim()) return;
    var indent = noComment.match(/^ */)[0].length;
    lines.push({ text: noComment, indent: indent, no: i + 1, body: noComment.trim() });
  });
  if (!lines.length) throw new Error("Empty YAML");

  function splitKey(line) {
    var inS = false, inD = false;
    for (var i = 0; i < line.length; i++) {
      var c = line[i];
      if (c === "'" && !inD) inS = !inS;
      else if (c === '"' && !inS) inD = !inD;
      else if (c === ":" && !inS && !inD && (i + 1 >= line.length || /\s/.test(line[i + 1]))) {
        return [line.slice(0, i), line.slice(i + 1)];
      }
    }
    return null;
  }
  function unquoteKey(k) {
    k = k.trim();
    if (k.length > 1 && ((k[0] === '"' && k[k.length - 1] === '"') || (k[0] === "'" && k[k.length - 1] === "'"))) {
      return k[0] === "'" ? k.slice(1, -1).replace(/''/g, "'") : yamlParseScalar(k);
    }
    return k;
  }

  function parseBlock(idx, indent) {
    var L = lines[idx];
    if (/^-\s/.test(L.body) || L.body === "-") return parseSeq(idx, indent);
    return parseMap(idx, indent);
  }
  function parseSeq(idx, indent) {
    var arr = [], i = idx;
    while (i < lines.length && lines[i].indent === indent && (/^-\s/.test(lines[i].body) || lines[i].body === "-")) {
      var after = lines[i].body === "-" ? "" : lines[i].body.slice(2);
      if (!after.trim()) {
        if (i + 1 < lines.length && lines[i + 1].indent > indent) {
          var r = parseBlock(i + 1, lines[i + 1].indent);
          arr.push(r[0]); i = r[1];
        } else { arr.push(null); i++; }
      } else {
        var kv = splitKey(after);
        if (kv) {
          // "- key: value" -> mapping whose first pair lives on the dash line
          var obj = {};
          var v0 = kv[1].trim();
          if (v0) obj[unquoteKey(kv[0])] = yamlParseScalar(v0);
          else if (i + 1 < lines.length && lines[i + 1].indent > indent) {
            var r2 = parseBlock(i + 1, lines[i + 1].indent);
            obj[unquoteKey(kv[0])] = r2[0]; i = r2[1] - 1;
          } else obj[unquoteKey(kv[0])] = null;
          // following deeper lines belong to same mapping
          var j = i + 1;
          while (j < lines.length && lines[j].indent > indent) {
            var kv2 = splitKey(lines[j].body);
            if (!kv2) throw new Error("Expected key (line " + lines[j].no + ")");
            var v2 = kv2[1].trim();
            if (v2) { obj[unquoteKey(kv2[0])] = yamlParseScalar(v2); j++; }
            else if (j + 1 < lines.length && lines[j + 1].indent > lines[j].indent) {
              var r3 = parseBlock(j + 1, lines[j + 1].indent);
              obj[unquoteKey(kv2[0])] = r3[0]; j = r3[1];
            } else { obj[unquoteKey(kv2[0])] = null; j++; }
          }
          arr.push(obj); i = j;
        } else {
          arr.push(yamlParseScalar(after)); i++;
        }
      }
    }
    return [arr, i];
  }
  function parseMap(idx, indent) {
    var obj = {}, i = idx;
    while (i < lines.length && lines[i].indent === indent) {
      if (/^-\s/.test(lines[i].body) || lines[i].body === "-") break;
      var kv = splitKey(lines[i].body);
      if (!kv) throw new Error("Expected 'key: value' (line " + lines[i].no + ")");
      var key = unquoteKey(kv[0]);
      var val = kv[1].trim();
      if (val) { obj[key] = yamlParseScalar(val); i++; }
      else if (i + 1 < lines.length && lines[i + 1].indent > indent) {
        var r = parseBlock(i + 1, lines[i + 1].indent);
        obj[key] = r[0]; i = r[1];
      } else { obj[key] = null; i++; }
    }
    return [obj, i];
  }

  var res = parseBlock(0, lines[0].indent);
  if (res[1] < lines.length) throw new Error("Unexpected content (line " + lines[res[1]].no + ") — check indentation");
  return res[0];
}

/* ---------- JSON -> CSV ---------- */
function jsonToCsv(v) {
  var rows = Array.isArray(v) ? v : [v];
  if (!rows.length) throw new Error("Empty array — nothing to convert");
  var headers = [];
  rows.forEach(function (r) {
    if (r && typeof r === "object" && !Array.isArray(r)) {
      Object.keys(r).forEach(function (k) { if (headers.indexOf(k) < 0) headers.push(k); });
    }
  });
  if (!headers.length) throw new Error("CSV needs an array of objects");
  function cell(x) {
    if (x === null || x === undefined) return "";
    var s = (typeof x === "object") ? JSON.stringify(x) : String(x);
    return (/[",\n\r]/.test(s)) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  var out = [headers.map(cell).join(",")];
  rows.forEach(function (r) {
    out.push(headers.map(function (h) { return cell(r ? r[h] : ""); }).join(","));
  });
  return out.join("\n") + "\n";
}

/* ---------- JSON -> Python ---------- */
function pyEmit(v, ind) {
  var pad = "  ".repeat(ind);
  if (v === null || v === undefined) return "None";
  if (v === true) return "True";
  if (v === false) return "False";
  if (typeof v === "number") return isFinite(v) ? String(v) : "None";
  if (typeof v === "string") return JSON.stringify(v);
  if (Array.isArray(v)) {
    if (!v.length) return "[]";
    var items = v.map(function (it) { return pyEmit(it, ind + 1); });
    var oneLine = "[" + items.join(", ") + "]";
    if (oneLine.length <= 80 && items.every(function (s) { return s.indexOf("\n") < 0; })) return oneLine;
    return "[\n" + items.map(function (s) { return pad + "  " + s; }).join(",\n") + ",\n" + pad + "]";
  }
  var ks = Object.keys(v);
  if (!ks.length) return "{}";
  var pairs = ks.map(function (k) { return JSON.stringify(k) + ": " + pyEmit(v[k], ind + 1); });
  var flat = "{" + pairs.join(", ") + "}";
  if (flat.length <= 80 && pairs.every(function (s) { return s.indexOf("\n") < 0; })) return flat;
  return "{\n" + pairs.map(function (s) { return pad + "  " + s; }).join(",\n") + ",\n" + pad + "}";
}

function jsonToPython(v) {
  return "# Converted by JSONView (free, open source)\ndata = " + pyEmit(v, 0) + "\n";
}

/* ================= UI APP (browser only) ================= */
if (typeof document !== "undefined") (function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var jsonInput = $("jsonInput"), errBox = $("errBox"),
    statusPill = $("statusPill"), statusText = $("statusText"), statLine = $("statLine"),
    totalChars = $("totalChars"), toast = $("toast"), formatInfo = $("formatInfo"),
    prettyOut = $("prettyOut"), prettyCode = $("prettyCode"),
    treeOut = $("treeOut"), convOut = $("convOut"), convCode = $("convCode"),
    emptyState = $("emptyState"), treeTools = $("treeTools"), searchInput = $("searchInput");

  var state = { data: null, valid: false, tab: "pretty", conv: "yaml", timer: null };

  var SAMPLE = '{\n  "user": {\n    "id": 101,\n    "name": "Aditya",\n    "verified": true,\n    "balance": 250.75,\n    "tags": ["dev", "builder"]\n  },\n  "posts": [\n    { "id": 1, "likes": 58 },\n    { "id": 2, "likes": 120 }\n  ],\n  "meta": { "version": "1.0", "active": true, "notes": null }\n}';

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
  function fmtSize(n) {
    if (n < 1024) return n + " B";
    if (n < 1048576) return (n / 1024).toFixed(1) + " KB";
    return (n / 1048576).toFixed(2) + " MB";
  }

  /* ----- tree rendering ----- */
  function safeKey(k) {
    return /^[A-Za-z_$][\w$]*$/.test(k) ? k : '["' + k.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"]';
  }
  function childPath(parent, key, isArr, idx) {
    if (isArr) return parent + "[" + idx + "]";
    var sk = safeKey(key);
    if (!parent) return sk[0] === "[" ? "$" + sk : sk;
    return sk[0] === "[" ? parent + sk : parent + "." + sk;
  }
  function valHtml(v) {
    if (v === null) return '<span class="tnull">null</span>';
    if (v === true || v === false) return '<span class="tbool">' + v + "</span>";
    if (typeof v === "number") return '<span class="tnum">' + v + "</span>";
    return '<span class="tstr">"' + escapeHtml(v) + '"</span>';
  }
  function buildTree(v, path, isRoot) {
    var wrap = document.createElement("div");
    wrap.className = "tnode" + (isRoot ? " root" : "");
    if (Array.isArray(v)) {
      if (!v.length) { wrap.innerHTML = '<span class="trow"><span class="tbrace">[]</span></span>'; return wrap; }
      var head = document.createElement("div");
      head.className = "trow";
      head.innerHTML = '<span class="tcaret">▾</span><span class="tbrace">Array</span> <span class="tcount">[' + v.length + "]</span>";
      wrap.appendChild(head);
      var kids = document.createElement("div");
      kids.className = "tchildren";
      v.forEach(function (item, i) {
        var row = document.createElement("div");
        row.className = "trow";
        var p = childPath(path, null, true, i);
        if (item !== null && typeof item === "object") {
          row.innerHTML = '<span class="tcaret">▾</span><span class="tbrace">' + i + ":</span>";
          row.setAttribute("data-search", String(i));
          var sub = buildTree(item, p, false);
          var holder = document.createElement("div");
          holder.appendChild(row); holder.appendChild(sub);
          kids.appendChild(holder);
        } else {
          row.innerHTML = '<span class="tcaret"></span><span class="tbrace">' + i + ":</span> " + valHtml(item);
          row.setAttribute("data-search", i + " " + String(item));
          row.setAttribute("data-path", p);
          row.title = "Click value to copy path";
          kids.appendChild(row);
        }
      });
      wrap.appendChild(kids);
      head.querySelector(".tcaret").addEventListener("click", function () {
        var hidden = kids.classList.toggle("collapsed");
        this.textContent = hidden ? "▸" : "▾";
      });
    } else if (v !== null && typeof v === "object") {
      var ks = Object.keys(v);
      if (!ks.length) { wrap.innerHTML = '<span class="trow"><span class="tbrace">{}</span></span>'; return wrap; }
      if (!isRoot) {
        var h = document.createElement("div");
        h.className = "trow";
        h.innerHTML = '<span class="tcaret">▾</span><span class="tbrace">Object</span> <span class="tcount">(' + ks.length + " keys)</span>";
        wrap.appendChild(h);
      }
      var box = document.createElement("div");
      box.className = "tchildren";
      ks.forEach(function (k) {
        var item = v[k], p = childPath(path, k, false, 0);
        if (item !== null && typeof item === "object") {
          var holder2 = document.createElement("div");
          var r2 = document.createElement("div");
          r2.className = "trow";
          r2.innerHTML = '<span class="tcaret">▾</span><span class="tkey" data-path="' + escapeHtml(p) + '">' + escapeHtml(k) + '</span><span class="tbrace">:</span>';
          r2.setAttribute("data-search", k);
          var sub2 = buildTree(item, p, false);
          holder2.appendChild(r2); holder2.appendChild(sub2);
          box.appendChild(holder2);
        } else {
          var r = document.createElement("div");
          r.className = "trow";
          r.innerHTML = '<span class="tcaret"></span><span class="tkey" data-path="' + escapeHtml(p) + '">' + escapeHtml(k) + '</span><span class="tbrace">:</span> ' + valHtml(item);
          r.setAttribute("data-search", k + " " + String(item));
          box.appendChild(r);
        }
      });
      wrap.appendChild(box);
      if (!isRoot) {
        var caret = h.querySelector(".tcaret");
        caret.addEventListener("click", function () {
          var hidden = box.classList.toggle("collapsed");
          this.textContent = hidden ? "▸" : "▾";
        });
      }
    } else {
      wrap.innerHTML = '<span class="trow">' + valHtml(v) + "</span>";
    }
    return wrap;
  }

  /* ----- main render ----- */
  function currentTabText() {
    if (state.tab === "tree") return treeOut.innerText || "";
    if (state.tab === "convert") return convCode.textContent || "";
    return prettyCode.textContent || "";
  }
  function renderConvert() {
    if (!state.valid) { convCode.textContent = ""; return; }
    try {
      if (state.conv === "yaml") convCode.textContent = jsonToYaml(state.data);
      else if (state.conv === "csv") convCode.textContent = jsonToCsv(state.data);
      else convCode.textContent = jsonToPython(state.data);
    } catch (e) {
      convCode.textContent = "⚠ " + e.message;
    }
  }
  function applySearch() {
    var q = searchInput.value.trim().toLowerCase();
    var rows = treeOut.querySelectorAll(".trow[data-search]");
    rows.forEach(function (r) {
      var hit = !q || (r.getAttribute("data-search") || "").toLowerCase().indexOf(q) >= 0;
      r.classList.toggle("hidden", !hit);
      r.classList.toggle("hl", !!q && hit);
    });
  }
  function render(rebuild) {
    var raw = jsonInput.value;
    totalChars.textContent = raw.length;
    if (!raw.trim()) {
      state.valid = false; state.data = null;
      errBox.style.display = "none";
      prettyCode.textContent = ""; convCode.textContent = ""; treeOut.innerHTML = "";
      emptyState.style.display = "block";
      prettyOut.style.display = "none"; treeOut.style.display = "none"; convOut.style.display = "none";
      treeTools.style.display = "none";
      statusPill.className = "status-pill ok";
      statusText.textContent = "Empty • paste JSON to start";
      statLine.textContent = "";
      formatInfo.textContent = "Tip: click any key in the Tree tab to copy its path";
      try { localStorage.setItem("jsonview:v1", JSON.stringify({ text: "" })); } catch (e) {}
      return;
    }
    var res = parseJsonWithPos(raw);
    emptyState.style.display = "none";
    if (!res.ok) {
      state.valid = false;
      errBox.style.display = "block";
      errBox.textContent = "✕ " + res.error.message + " (line " + res.error.line + ", col " + res.error.col + ")\n" + res.error.excerpt;
      statusPill.className = "status-pill bad";
      statusText.textContent = "Invalid JSON — line " + res.error.line;
      statLine.textContent = "";
      return;
    }
    state.valid = true; state.data = res.data;
    errBox.style.display = "none";
    var pretty = JSON.stringify(state.data, null, 2);
    prettyCode.textContent = pretty;
    treeOut.innerHTML = "";
    treeOut.appendChild(buildTree(state.data, "", true));
    searchInput.value = "";
    renderConvert();
    showTab(state.tab);
    var st = getStats(state.data);
    statusPill.className = "status-pill ok";
    statusText.textContent = "Valid JSON ✅";
    statLine.textContent = st.keys + " keys • depth " + st.depth + " • " + fmtSize(raw.length) + " • " + st.type;
    formatInfo.textContent = st.keys + " keys • depth " + st.depth + " • click a key in Tree to copy path";
    try { localStorage.setItem("jsonview:v1", JSON.stringify({ text: raw.slice(0, 50000) })); } catch (e) {}
  }
  function showTab(t) {
    state.tab = t;
    var btns = $("tabBar").querySelectorAll("button");
    for (var i = 0; i < btns.length; i++) btns[i].classList.toggle("active", btns[i].getAttribute("data-tab") === t);
    prettyOut.style.display = t === "pretty" && state.valid ? "block" : "none";
    treeOut.style.display = t === "tree" && state.valid ? "block" : "none";
    convOut.style.display = t === "convert" && state.valid ? "block" : "none";
    treeTools.style.display = t === "tree" && state.valid ? "flex" : "none";
    if (t === "tree") applySearch();
  }

  function schedule() {
    clearTimeout(state.timer);
    state.timer = setTimeout(function () { render(true); }, 400);
  }

  /* ----- events ----- */
  jsonInput.addEventListener("input", schedule);
  $("formatBtn").addEventListener("click", function () {
    var res = parseJsonWithPos(jsonInput.value);
    if (!res.ok) { render(true); return; }
    jsonInput.value = JSON.stringify(res.data, null, 2);
    render(true); showToast("Formatted ✨");
  });
  $("minifyBtn").addEventListener("click", function () {
    var res = parseJsonWithPos(jsonInput.value);
    if (!res.ok) { render(true); return; }
    jsonInput.value = JSON.stringify(res.data);
    render(true); showToast("Minified");
  });
  $("sortBtn").addEventListener("click", function () {
    var res = parseJsonWithPos(jsonInput.value);
    if (!res.ok) { render(true); return; }
    jsonInput.value = JSON.stringify(sortKeysDeep(res.data), null, 2);
    render(true); showToast("Keys sorted 🔤");
  });
  $("validateBtn").addEventListener("click", function () {
    render(true);
    showToast(state.valid ? "Valid JSON ✅" : "Invalid — see error above");
  });
  $("sampleBtn").addEventListener("click", function () { jsonInput.value = SAMPLE; render(true); });
  $("clearBtn").addEventListener("click", function () { jsonInput.value = ""; render(true); });
  $("uploadBtn").addEventListener("click", function () { $("fileInput").click(); });
  $("fileInput").addEventListener("change", function () {
    var f = this.files && this.files[0];
    if (!f) return;
    if (f.size > 2000000) { showToast("File too big (2MB max)"); return; }
    var rd = new FileReader();
    rd.onload = function () { jsonInput.value = String(rd.result).slice(0, 100000); render(true); showToast("Loaded " + f.name); };
    rd.readAsText(f);
    this.value = "";
  });
  $("tabBar").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.getAttribute("data-tab") === "convert") renderConvert();
    showTab(b.getAttribute("data-tab"));
  });
  $("convSeg").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    var btns = this.querySelectorAll("button");
    for (var i = 0; i < btns.length; i++) btns[i].classList.remove("active");
    b.classList.add("active");
    state.conv = b.getAttribute("data-conv");
    renderConvert();
    if (state.tab !== "convert") showTab("convert");
  });
  searchInput.addEventListener("input", applySearch);
  $("expandBtn").addEventListener("click", function () {
    treeOut.querySelectorAll(".tchildren.collapsed").forEach(function (c) { c.classList.remove("collapsed"); });
    treeOut.querySelectorAll(".tcaret").forEach(function (c) { if (c.textContent === "▸") c.textContent = "▾"; });
  });
  $("collapseBtn").addEventListener("click", function () {
    treeOut.querySelectorAll(".tchildren").forEach(function (c) { c.classList.add("collapsed"); });
    treeOut.querySelectorAll(".tcaret").forEach(function (c) { if (c.textContent === "▾") c.textContent = "▸"; });
    applySearch();
  });
  treeOut.addEventListener("click", function (e) {
    var k = e.target.closest(".tkey");
    if (!k) return;
    var p = k.getAttribute("data-path") || "";
    copyText(p, "Path copied: " + p);
  });
  $("copyPathHint").addEventListener("click", function () {
    showTab("tree");
    showToast(state.valid ? "Click any blue key to copy its path 📍" : "Paste valid JSON first");
  });
  $("copyOutBtn").addEventListener("click", function () {
    var t = currentTabText();
    if (!t) return showToast("Nothing to copy yet");
    copyText(t, "Output copied 📋");
  });
  $("downloadBtn").addEventListener("click", function () {
    var t = currentTabText(), ext = "json", mime = "application/json";
    if (state.tab === "convert") {
      ext = state.conv === "yaml" ? "yaml" : state.conv === "csv" ? "csv" : "py";
      mime = "text/plain";
    } else if (state.tab === "tree") {
      ext = "txt"; mime = "text/plain";
    }
    if (!t) return showToast("Nothing to download yet");
    var blob = new Blob([t], { type: mime });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "jsonview." + ext; a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    showToast("Downloaded jsonview." + ext + " ⬇️");
  });
  $("shareBtn").addEventListener("click", function () {
    var raw = jsonInput.value;
    if (!raw.trim()) return showToast("Nothing to share yet");
    if (raw.length > 6000) return showToast("Too big for a link (6KB max) — download instead");
    var payload = { j: raw };
    var hash = "#j=" + btoa(unescape(encodeURIComponent(JSON.stringify(payload)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    copyText(location.origin + location.pathname + hash, "Share link copied 🔗");
    try { history.replaceState(null, "", hash); } catch (e) {}
  });

  /* ----- restore: hash > localStorage > sample-ish empty ----- */
  (function restore() {
    try {
      if (location.hash.indexOf("#j=") === 0) {
        var b64 = location.hash.slice(3).replace(/-/g, "+").replace(/_/g, "/");
        var obj = JSON.parse(decodeURIComponent(escape(atob(b64))));
        if (obj.j) { jsonInput.value = obj.j.slice(0, 100000); render(true); return; }
      }
      var saved = JSON.parse(localStorage.getItem("jsonview:v1") || "null");
      if (saved && saved.text) { jsonInput.value = saved.text; render(true); return; }
    } catch (e) {}
    render(true);
  })();

  /* ----- PWA ----- */
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
})();

/* node export for tests (browser ignores) */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { parseJsonWithPos: parseJsonWithPos, sortKeysDeep: sortKeysDeep, getStats: getStats, jsonToYaml: jsonToYaml, yamlToJsonSimple: yamlToJsonSimple, jsonToCsv: jsonToCsv, jsonToPython: jsonToPython };
}
