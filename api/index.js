var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn2, res, err2) => function __init() {
  if (err2) throw err2[0];
  try {
    return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])(fn2 = 0)), res;
  } catch (e) {
    throw err2 = [e], e;
  }
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/.pnpm/@electric-sql+pglite@0.3.16/node_modules/@electric-sql/pglite/dist/chunk-QY3QWFKW.js
var p, i2, c, f, l, s, a, _, d, D, F, g, L, P, n, h, R, x, T, U, u;
var init_chunk_QY3QWFKW = __esm({
  "node_modules/.pnpm/@electric-sql+pglite@0.3.16/node_modules/@electric-sql/pglite/dist/chunk-QY3QWFKW.js"() {
    p = Object.create;
    i2 = Object.defineProperty;
    c = Object.getOwnPropertyDescriptor;
    f = Object.getOwnPropertyNames;
    l = Object.getPrototypeOf;
    s = Object.prototype.hasOwnProperty;
    a = (t2) => {
      throw TypeError(t2);
    };
    _ = (t2, e, o4) => e in t2 ? i2(t2, e, { enumerable: true, configurable: true, writable: true, value: o4 }) : t2[e] = o4;
    d = (t2, e) => () => (t2 && (e = t2(t2 = 0)), e);
    D = (t2, e) => () => (e || t2((e = { exports: {} }).exports, e), e.exports);
    F = (t2, e) => {
      for (var o4 in e) i2(t2, o4, { get: e[o4], enumerable: true });
    };
    g = (t2, e, o4, m4) => {
      if (e && typeof e == "object" || typeof e == "function") for (let r of f(e)) !s.call(t2, r) && r !== o4 && i2(t2, r, { get: () => e[r], enumerable: !(m4 = c(e, r)) || m4.enumerable });
      return t2;
    };
    L = (t2, e, o4) => (o4 = t2 != null ? p(l(t2)) : {}, g(e || !t2 || !t2.__esModule ? i2(o4, "default", { value: t2, enumerable: true }) : o4, t2));
    P = (t2, e, o4) => _(t2, typeof e != "symbol" ? e + "" : e, o4);
    n = (t2, e, o4) => e.has(t2) || a("Cannot " + o4);
    h = (t2, e, o4) => (n(t2, e, "read from private field"), o4 ? o4.call(t2) : e.get(t2));
    R = (t2, e, o4) => e.has(t2) ? a("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t2) : e.set(t2, o4);
    x = (t2, e, o4, m4) => (n(t2, e, "write to private field"), m4 ? m4.call(t2, o4) : e.set(t2, o4), o4);
    T = (t2, e, o4) => (n(t2, e, "access private method"), o4);
    U = (t2, e, o4, m4) => ({ set _(r) {
      x(t2, e, r, o4);
    }, get _() {
      return h(t2, e, m4);
    } });
    u = d(() => {
      "use strict";
    });
  }
});

// node_modules/.pnpm/@electric-sql+pglite@0.3.16/node_modules/@electric-sql/pglite/dist/chunk-3WWIVTCY.js
function ue(e, t2, n3) {
  if (e === null) return null;
  let r = n3?.[t2] ?? Se.parsers[t2];
  return r ? r(e, t2) : e;
}
function pn(e) {
  return Object.keys(e).reduce(({ parsers: t2, serializers: n3 }, r) => {
    let { to: i3, from: a2, serialize: u2, parse: f3 } = e[r];
    return n3[i3] = u2, n3[r] = u2, t2[r] = f3, Array.isArray(a2) ? a2.forEach((c2) => {
      t2[c2] = f3, n3[c2] = u2;
    }) : (t2[a2] = f3, n3[a2] = u2), { parsers: t2, serializers: n3 };
  }, { parsers: {}, serializers: {} });
}
function mn(e) {
  return e.replace(dn, "\\\\").replace(fn, '\\"');
}
function Ke(e, t2, n3) {
  if (Array.isArray(e) === false) return e;
  if (!e.length) return "{}";
  let r = e[0], i3 = n3 === 1020 ? ";" : ",";
  return Array.isArray(r) ? `{${e.map((a2) => Ke(a2, t2, n3)).join(i3)}}` : `{${e.map((a2) => (a2 === void 0 && (a2 = null), a2 === null ? "null" : '"' + mn(t2 ? t2(a2) : a2.toString()) + '"')).join(i3)}}`;
}
function yn(e, t2, n3) {
  return he.i = he.last = 0, Je(he, e, t2, n3)[0];
}
function Je(e, t2, n3, r) {
  let i3 = [], a2 = r === 1020 ? ";" : ",";
  for (; e.i < t2.length; e.i++) {
    if (e.char = t2[e.i], e.quoted) e.char === "\\" ? e.str += t2[++e.i] : e.char === '"' ? (i3.push(n3 ? n3(e.str) : e.str), e.str = "", e.quoted = t2[e.i + 1] === '"', e.last = e.i + 2) : e.str += e.char;
    else if (e.char === '"') e.quoted = true;
    else if (e.char === "{") e.last = ++e.i, i3.push(Je(e, t2, n3, r));
    else if (e.char === "}") {
      e.quoted = false, e.last < e.i && i3.push(n3 ? n3(t2.slice(e.last, e.i)) : t2.slice(e.last, e.i)), e.last = e.i + 1;
      break;
    } else e.char === a2 && e.p !== "}" && e.p !== '"' && (i3.push(n3 ? n3(t2.slice(e.last, e.i)) : t2.slice(e.last, e.i)), e.last = e.i + 1);
    e.p = e.char;
  }
  return e.last < e.i && i3.push(n3 ? n3(t2.slice(e.last, e.i + 1)) : t2.slice(e.last, e.i + 1)), i3;
}
function bn(e, t2, n3, r) {
  let i3 = [], a2 = { rows: [], fields: [] }, u2 = 0, f3 = { ...t2, ...n3?.parsers };
  return e.forEach((c2) => {
    switch (c2.name) {
      case "rowDescription": {
        let M2 = c2;
        a2.fields = M2.fields.map((E2) => ({ name: E2.name, dataTypeID: E2.dataTypeID }));
        break;
      }
      case "dataRow": {
        if (!a2) break;
        let M2 = c2;
        n3?.rowMode === "array" ? a2.rows.push(M2.fields.map((E2, ie2) => ue(E2, a2.fields[ie2].dataTypeID, f3))) : a2.rows.push(Object.fromEntries(M2.fields.map((E2, ie2) => [a2.fields[ie2].name, ue(E2, a2.fields[ie2].dataTypeID, f3)])));
        break;
      }
      case "commandComplete": {
        u2 += gn(c2), i3.push({ ...a2, affectedRows: u2, ...r ? { blob: r } : {} }), a2 = { rows: [], fields: [] };
        break;
      }
    }
  }), i3.length === 0 && i3.push({ affectedRows: 0, rows: [], fields: [] }), i3;
}
function gn(e) {
  let t2 = e.text.split(" ");
  switch (t2[0]) {
    case "INSERT":
      return parseInt(t2[2], 10);
    case "UPDATE":
    case "DELETE":
    case "COPY":
    case "MERGE":
      return parseInt(t2[1], 10);
    default:
      return 0;
  }
}
function De(e) {
  let t2 = e.find((n3) => n3.name === "parameterDescription");
  return t2 ? t2.dataTypeIDs : [];
}
function P2(e) {
  let t2 = e.length;
  for (let n3 = e.length - 1; n3 >= 0; n3--) {
    let r = e.charCodeAt(n3);
    r > 127 && r <= 2047 ? t2++ : r > 2047 && r <= 65535 && (t2 += 2), r >= 56320 && r <= 57343 && n3--;
  }
  return t2;
}
async function Rr() {
  if (Fe || se) return;
  let e = new URL("./pglite.wasm", import_meta.url);
  se = fetch(e);
}
async function Tr(e, t2) {
  if (t2 || re) return { instance: await WebAssembly.instantiate(t2 || re, e), module: t2 || re };
  let n3 = new URL("./pglite.wasm", import_meta.url);
  if (Fe) {
    let i3 = await (await import("fs/promises")).readFile(n3), { module: a2, instance: u2 } = await WebAssembly.instantiate(i3, e);
    return re = a2, { instance: u2, module: a2 };
  } else {
    se || (se = fetch(n3));
    let r = await se, { module: i3, instance: a2 } = await WebAssembly.instantiateStreaming(r, e);
    return re = i3, { instance: a2, module: i3 };
  }
}
async function Er() {
  let e = new URL("./pglite.data", import_meta.url);
  return Fe ? (await (await import("fs/promises")).readFile(e)).buffer : (await fetch(e)).arrayBuffer();
}
async function Pr(e, t2, n3, r) {
  if (!n3 || n3.length === 0) return t2;
  r = r ?? e;
  let i3 = [];
  try {
    await e.execProtocol(k.parse({ text: t2 }), { syncToFs: false }), i3.push(...(await e.execProtocol(k.describe({ type: "S" }), { syncToFs: false })).messages);
  } finally {
    i3.push(...(await e.execProtocol(k.sync(), { syncToFs: false })).messages);
  }
  let a2 = De(i3), u2 = t2.replace(/\$([0-9]+)/g, (c2, M2) => "%" + M2 + "L");
  return (await r.query(`SELECT format($1, ${n3.map((c2, M2) => `$${M2 + 2}`).join(", ")}) as query`, [u2, ...n3], { paramTypes: [V, ...a2] })).rows[0].query;
}
function Nr(e) {
  let t2;
  return e.startsWith('"') && e.endsWith('"') ? t2 = e.substring(1, e.length - 1) : t2 = e.toLowerCase(), t2;
}
var import_meta, hn, ht, bt, be, ge, gt, we, ve, Ge, wt, V, je, At, xt, St, Ae, Dt, Bt, It, Mt, Rt, Tt, Qe, We, Et, Ct, Pt, Ut, Nt, Lt, Ot, kt, Vt, _e, ze, He, Ft, qe, xe, vt, Gt, jt, Qt, Wt, _t, zt, Ht, qt, Yt, $t, Kt, Jt, Xt, Zt, en, tn, nn, rn, sn, an, Ye, on, un, $e, Se, ln, cn, dn, fn, he, wn, Ue, Be, Ie, Me, Re, Te, Ee, Ce, Pe, F2, v, G, j, Q, W, C, _2, z10, H, q, Y, $, K, J, X, Z, ee, te, zn, b, g2, N, ce, L2, x2, le, U2, Xe, T2, m, An, xn, Sn, Dn, Bn, In, Mn, Rn, O, Tn, En, Cn, Pn, Un, Ne, Nn, Ln, On, kn, Vn, Fn, pe, vn, Gn, jn, Qn, k, Le, Wn, R2, w, fe, me, ne, de, Oe, _n, Ze, et, A, S, D2, o, l2, tt, nt, rt, st, it, at, ot, ke, ut, lt, ct, pt, dt, ft, mt, yt, Ve, ye, Fe, se, re, Cr;
var init_chunk_3WWIVTCY = __esm({
  "node_modules/.pnpm/@electric-sql+pglite@0.3.16/node_modules/@electric-sql/pglite/dist/chunk-3WWIVTCY.js"() {
    init_chunk_QY3QWFKW();
    import_meta = {};
    hn = {};
    F(hn, { ABSTIME: () => Et, ACLITEM: () => Vt, BIT: () => jt, BOOL: () => be, BPCHAR: () => _e, BYTEA: () => ge, CHAR: () => gt, CID: () => St, CIDR: () => Tt, CIRCLE: () => Ut, DATE: () => He, FLOAT4: () => Qe, FLOAT8: () => We, GTSVECTOR: () => rn, INET: () => kt, INT2: () => ve, INT4: () => Ge, INT8: () => we, INTERVAL: () => vt, JSON: () => Ae, JSONB: () => Ye, MACADDR: () => Ot, MACADDR8: () => Nt, MONEY: () => Lt, NUMERIC: () => Wt, OID: () => je, PATH: () => Mt, PG_DEPENDENCIES: () => en, PG_LSN: () => Xt, PG_NDISTINCT: () => Zt, PG_NODE_TREE: () => Bt, POLYGON: () => Rt, REFCURSOR: () => _t, REGCLASS: () => Yt, REGCONFIG: () => sn, REGDICTIONARY: () => an, REGNAMESPACE: () => on, REGOPER: () => Ht, REGOPERATOR: () => qt, REGPROC: () => wt, REGPROCEDURE: () => zt, REGROLE: () => un, REGTYPE: () => $t, RELTIME: () => Ct, SMGR: () => It, TEXT: () => V, TID: () => At, TIME: () => Ft, TIMESTAMP: () => qe, TIMESTAMPTZ: () => xe, TIMETZ: () => Gt, TINTERVAL: () => Pt, TSQUERY: () => nn, TSVECTOR: () => tn, TXID_SNAPSHOT: () => Jt, UUID: () => Kt, VARBIT: () => Qt, VARCHAR: () => ze, XID: () => xt, XML: () => Dt, arrayParser: () => yn, arraySerializer: () => Ke, parseType: () => ue, parsers: () => ln, serializers: () => cn, types: () => $e });
    u();
    ht = globalThis.JSON.parse;
    bt = globalThis.JSON.stringify;
    be = 16;
    ge = 17;
    gt = 18;
    we = 20;
    ve = 21;
    Ge = 23;
    wt = 24;
    V = 25;
    je = 26;
    At = 27;
    xt = 28;
    St = 29;
    Ae = 114;
    Dt = 142;
    Bt = 194;
    It = 210;
    Mt = 602;
    Rt = 604;
    Tt = 650;
    Qe = 700;
    We = 701;
    Et = 702;
    Ct = 703;
    Pt = 704;
    Ut = 718;
    Nt = 774;
    Lt = 790;
    Ot = 829;
    kt = 869;
    Vt = 1033;
    _e = 1042;
    ze = 1043;
    He = 1082;
    Ft = 1083;
    qe = 1114;
    xe = 1184;
    vt = 1186;
    Gt = 1266;
    jt = 1560;
    Qt = 1562;
    Wt = 1700;
    _t = 1790;
    zt = 2202;
    Ht = 2203;
    qt = 2204;
    Yt = 2205;
    $t = 2206;
    Kt = 2950;
    Jt = 2970;
    Xt = 3220;
    Zt = 3361;
    en = 3402;
    tn = 3614;
    nn = 3615;
    rn = 3642;
    sn = 3734;
    an = 3769;
    Ye = 3802;
    on = 4089;
    un = 4096;
    $e = { string: { to: V, from: [V, ze, _e], serialize: (e) => {
      if (typeof e == "string") return e;
      if (typeof e == "number") return e.toString();
      throw new Error("Invalid input for string type");
    }, parse: (e) => e }, number: { to: 0, from: [ve, Ge, je, Qe, We], serialize: (e) => e.toString(), parse: (e) => +e }, bigint: { to: we, from: [we], serialize: (e) => e.toString(), parse: (e) => {
      let t2 = BigInt(e);
      return t2 < Number.MIN_SAFE_INTEGER || t2 > Number.MAX_SAFE_INTEGER ? t2 : Number(t2);
    } }, json: { to: Ae, from: [Ae, Ye], serialize: (e) => typeof e == "string" ? e : bt(e), parse: (e) => ht(e) }, boolean: { to: be, from: [be], serialize: (e) => {
      if (typeof e != "boolean") throw new Error("Invalid input for boolean type");
      return e ? "t" : "f";
    }, parse: (e) => e === "t" }, date: { to: xe, from: [He, qe, xe], serialize: (e) => {
      if (typeof e == "string") return e;
      if (typeof e == "number") return new Date(e).toISOString();
      if (e instanceof Date) return e.toISOString();
      throw new Error("Invalid input for date type");
    }, parse: (e) => new Date(e) }, bytea: { to: ge, from: [ge], serialize: (e) => {
      if (!(e instanceof Uint8Array)) throw new Error("Invalid input for bytea type");
      return "\\x" + Array.from(e).map((t2) => t2.toString(16).padStart(2, "0")).join("");
    }, parse: (e) => {
      let t2 = e.slice(2);
      return Uint8Array.from({ length: t2.length / 2 }, (n3, r) => parseInt(t2.substring(r * 2, (r + 1) * 2), 16));
    } } };
    Se = pn($e);
    ln = Se.parsers;
    cn = Se.serializers;
    dn = /\\/g;
    fn = /"/g;
    he = { i: 0, char: null, str: "", quoted: false, last: 0, p: null };
    wn = {};
    F(wn, { parseDescribeStatementResults: () => De, parseResults: () => bn });
    u();
    Ue = {};
    F(Ue, { AuthenticationCleartextPassword: () => v, AuthenticationMD5Password: () => G, AuthenticationOk: () => F2, AuthenticationSASL: () => j, AuthenticationSASLContinue: () => Q, AuthenticationSASLFinal: () => W, BackendKeyDataMessage: () => K, CommandCompleteMessage: () => Z, CopyDataMessage: () => _2, CopyResponse: () => z10, DataRowMessage: () => ee, DatabaseError: () => C, Field: () => H, NoticeMessage: () => te, NotificationResponseMessage: () => J, ParameterDescriptionMessage: () => Y, ParameterStatusMessage: () => $, ReadyForQueryMessage: () => X, RowDescriptionMessage: () => q, bindComplete: () => Ie, closeComplete: () => Me, copyDone: () => Pe, emptyQuery: () => Ce, noData: () => Re, parseComplete: () => Be, portalSuspended: () => Te, replicationStart: () => Ee });
    u();
    Be = { name: "parseComplete", length: 5 };
    Ie = { name: "bindComplete", length: 5 };
    Me = { name: "closeComplete", length: 5 };
    Re = { name: "noData", length: 5 };
    Te = { name: "portalSuspended", length: 5 };
    Ee = { name: "replicationStart", length: 4 };
    Ce = { name: "emptyQuery", length: 4 };
    Pe = { name: "copyDone", length: 4 };
    F2 = class {
      constructor(t2) {
        this.length = t2;
        this.name = "authenticationOk";
      }
    };
    v = class {
      constructor(t2) {
        this.length = t2;
        this.name = "authenticationCleartextPassword";
      }
    };
    G = class {
      constructor(t2, n3) {
        this.length = t2;
        this.salt = n3;
        this.name = "authenticationMD5Password";
      }
    };
    j = class {
      constructor(t2, n3) {
        this.length = t2;
        this.mechanisms = n3;
        this.name = "authenticationSASL";
      }
    };
    Q = class {
      constructor(t2, n3) {
        this.length = t2;
        this.data = n3;
        this.name = "authenticationSASLContinue";
      }
    };
    W = class {
      constructor(t2, n3) {
        this.length = t2;
        this.data = n3;
        this.name = "authenticationSASLFinal";
      }
    };
    C = class extends Error {
      constructor(n3, r, i3) {
        super(n3);
        this.length = r;
        this.name = i3;
      }
    };
    _2 = class {
      constructor(t2, n3) {
        this.length = t2;
        this.chunk = n3;
        this.name = "copyData";
      }
    };
    z10 = class {
      constructor(t2, n3, r, i3) {
        this.length = t2;
        this.name = n3;
        this.binary = r;
        this.columnTypes = new Array(i3);
      }
    };
    H = class {
      constructor(t2, n3, r, i3, a2, u2, f3) {
        this.name = t2;
        this.tableID = n3;
        this.columnID = r;
        this.dataTypeID = i3;
        this.dataTypeSize = a2;
        this.dataTypeModifier = u2;
        this.format = f3;
      }
    };
    q = class {
      constructor(t2, n3) {
        this.length = t2;
        this.fieldCount = n3;
        this.name = "rowDescription";
        this.fields = new Array(this.fieldCount);
      }
    };
    Y = class {
      constructor(t2, n3) {
        this.length = t2;
        this.parameterCount = n3;
        this.name = "parameterDescription";
        this.dataTypeIDs = new Array(this.parameterCount);
      }
    };
    $ = class {
      constructor(t2, n3, r) {
        this.length = t2;
        this.parameterName = n3;
        this.parameterValue = r;
        this.name = "parameterStatus";
      }
    };
    K = class {
      constructor(t2, n3, r) {
        this.length = t2;
        this.processID = n3;
        this.secretKey = r;
        this.name = "backendKeyData";
      }
    };
    J = class {
      constructor(t2, n3, r, i3) {
        this.length = t2;
        this.processId = n3;
        this.channel = r;
        this.payload = i3;
        this.name = "notification";
      }
    };
    X = class {
      constructor(t2, n3) {
        this.length = t2;
        this.status = n3;
        this.name = "readyForQuery";
      }
    };
    Z = class {
      constructor(t2, n3) {
        this.length = t2;
        this.text = n3;
        this.name = "commandComplete";
      }
    };
    ee = class {
      constructor(t2, n3) {
        this.length = t2;
        this.fields = n3;
        this.name = "dataRow";
        this.fieldCount = n3.length;
      }
    };
    te = class {
      constructor(t2, n3) {
        this.length = t2;
        this.message = n3;
        this.name = "notice";
      }
    };
    zn = {};
    F(zn, { Parser: () => ye, messages: () => Ue, serialize: () => k });
    u();
    u();
    u();
    u();
    T2 = class {
      constructor(t2 = 256) {
        this.size = t2;
        R(this, x2);
        R(this, b);
        R(this, g2, 5);
        R(this, N, false);
        R(this, ce, new TextEncoder());
        R(this, L2, 0);
        x(this, b, T(this, x2, le).call(this, t2));
      }
      addInt32(t2) {
        return T(this, x2, U2).call(this, 4), h(this, b).setInt32(h(this, g2), t2, h(this, N)), x(this, g2, h(this, g2) + 4), this;
      }
      addInt16(t2) {
        return T(this, x2, U2).call(this, 2), h(this, b).setInt16(h(this, g2), t2, h(this, N)), x(this, g2, h(this, g2) + 2), this;
      }
      addCString(t2) {
        return t2 && this.addString(t2), T(this, x2, U2).call(this, 1), h(this, b).setUint8(h(this, g2), 0), U(this, g2)._++, this;
      }
      addString(t2 = "") {
        let n3 = P2(t2);
        return T(this, x2, U2).call(this, n3), h(this, ce).encodeInto(t2, new Uint8Array(h(this, b).buffer, h(this, g2))), x(this, g2, h(this, g2) + n3), this;
      }
      add(t2) {
        return T(this, x2, U2).call(this, t2.byteLength), new Uint8Array(h(this, b).buffer).set(new Uint8Array(t2), h(this, g2)), x(this, g2, h(this, g2) + t2.byteLength), this;
      }
      flush(t2) {
        let n3 = T(this, x2, Xe).call(this, t2);
        return x(this, g2, 5), x(this, b, T(this, x2, le).call(this, this.size)), new Uint8Array(n3);
      }
    };
    b = /* @__PURE__ */ new WeakMap(), g2 = /* @__PURE__ */ new WeakMap(), N = /* @__PURE__ */ new WeakMap(), ce = /* @__PURE__ */ new WeakMap(), L2 = /* @__PURE__ */ new WeakMap(), x2 = /* @__PURE__ */ new WeakSet(), le = function(t2) {
      return new DataView(new ArrayBuffer(t2));
    }, U2 = function(t2) {
      if (h(this, b).byteLength - h(this, g2) < t2) {
        let r = h(this, b).buffer, i3 = r.byteLength + (r.byteLength >> 1) + t2;
        x(this, b, T(this, x2, le).call(this, i3)), new Uint8Array(h(this, b).buffer).set(new Uint8Array(r));
      }
    }, Xe = function(t2) {
      if (t2) {
        h(this, b).setUint8(h(this, L2), t2);
        let n3 = h(this, g2) - (h(this, L2) + 1);
        h(this, b).setInt32(h(this, L2) + 1, n3, h(this, N));
      }
      return h(this, b).buffer.slice(t2 ? 0 : 5, h(this, g2));
    };
    m = new T2();
    An = (e) => {
      m.addInt16(3).addInt16(0);
      for (let r of Object.keys(e)) m.addCString(r).addCString(e[r]);
      m.addCString("client_encoding").addCString("UTF8");
      let t2 = m.addCString("").flush(), n3 = t2.byteLength + 4;
      return new T2().addInt32(n3).add(t2).flush();
    };
    xn = () => {
      let e = new DataView(new ArrayBuffer(8));
      return e.setInt32(0, 8, false), e.setInt32(4, 80877103, false), new Uint8Array(e.buffer);
    };
    Sn = (e) => m.addCString(e).flush(112);
    Dn = (e, t2) => (m.addCString(e).addInt32(P2(t2)).addString(t2), m.flush(112));
    Bn = (e) => m.addString(e).flush(112);
    In = (e) => m.addCString(e).flush(81);
    Mn = [];
    Rn = (e) => {
      let t2 = e.name ?? "";
      t2.length > 63 && (console.error("Warning! Postgres only supports 63 characters for query names."), console.error("You supplied %s (%s)", t2, t2.length), console.error("This can cause conflicts and silent errors executing queries"));
      let n3 = m.addCString(t2).addCString(e.text).addInt16(e.types?.length ?? 0);
      return e.types?.forEach((r) => n3.addInt32(r)), m.flush(80);
    };
    O = new T2();
    Tn = (e, t2) => {
      for (let n3 = 0; n3 < e.length; n3++) {
        let r = t2 ? t2(e[n3], n3) : e[n3];
        if (r === null) m.addInt16(0), O.addInt32(-1);
        else if (r instanceof ArrayBuffer || ArrayBuffer.isView(r)) {
          let i3 = ArrayBuffer.isView(r) ? r.buffer.slice(r.byteOffset, r.byteOffset + r.byteLength) : r;
          m.addInt16(1), O.addInt32(i3.byteLength), O.add(i3);
        } else m.addInt16(0), O.addInt32(P2(r)), O.addString(r);
      }
    };
    En = (e = {}) => {
      let t2 = e.portal ?? "", n3 = e.statement ?? "", r = e.binary ?? false, i3 = e.values ?? Mn, a2 = i3.length;
      return m.addCString(t2).addCString(n3), m.addInt16(a2), Tn(i3, e.valueMapper), m.addInt16(a2), m.add(O.flush()), m.addInt16(r ? 1 : 0), m.flush(66);
    };
    Cn = new Uint8Array([69, 0, 0, 0, 9, 0, 0, 0, 0, 0]);
    Pn = (e) => {
      if (!e || !e.portal && !e.rows) return Cn;
      let t2 = e.portal ?? "", n3 = e.rows ?? 0, r = P2(t2), i3 = 4 + r + 1 + 4, a2 = new DataView(new ArrayBuffer(1 + i3));
      return a2.setUint8(0, 69), a2.setInt32(1, i3, false), new TextEncoder().encodeInto(t2, new Uint8Array(a2.buffer, 5)), a2.setUint8(r + 5, 0), a2.setUint32(a2.byteLength - 4, n3, false), new Uint8Array(a2.buffer);
    };
    Un = (e, t2) => {
      let n3 = new DataView(new ArrayBuffer(16));
      return n3.setInt32(0, 16, false), n3.setInt16(4, 1234, false), n3.setInt16(6, 5678, false), n3.setInt32(8, e, false), n3.setInt32(12, t2, false), new Uint8Array(n3.buffer);
    };
    Ne = (e, t2) => {
      let n3 = new T2();
      return n3.addCString(t2), n3.flush(e);
    };
    Nn = m.addCString("P").flush(68);
    Ln = m.addCString("S").flush(68);
    On = (e) => e.name ? Ne(68, `${e.type}${e.name ?? ""}`) : e.type === "P" ? Nn : Ln;
    kn = (e) => {
      let t2 = `${e.type}${e.name ?? ""}`;
      return Ne(67, t2);
    };
    Vn = (e) => m.add(e).flush(100);
    Fn = (e) => Ne(102, e);
    pe = (e) => new Uint8Array([e, 0, 0, 0, 4]);
    vn = pe(72);
    Gn = pe(83);
    jn = pe(88);
    Qn = pe(99);
    k = { startup: An, password: Sn, requestSsl: xn, sendSASLInitialResponseMessage: Dn, sendSCRAMClientFinalMessage: Bn, query: In, parse: Rn, bind: En, execute: Pn, describe: On, close: kn, flush: () => vn, sync: () => Gn, end: () => jn, copyData: Vn, copyDone: () => Qn, copyFail: Fn, cancel: Un };
    u();
    u();
    Le = { text: 0, binary: 1 };
    u();
    Wn = new ArrayBuffer(0);
    de = class {
      constructor(t2 = 0) {
        R(this, R2, new DataView(Wn));
        R(this, w);
        R(this, fe, "utf-8");
        R(this, me, new TextDecoder(h(this, fe)));
        R(this, ne, false);
        x(this, w, t2);
      }
      setBuffer(t2, n3) {
        x(this, w, t2), x(this, R2, new DataView(n3));
      }
      int16() {
        let t2 = h(this, R2).getInt16(h(this, w), h(this, ne));
        return x(this, w, h(this, w) + 2), t2;
      }
      byte() {
        let t2 = h(this, R2).getUint8(h(this, w));
        return U(this, w)._++, t2;
      }
      int32() {
        let t2 = h(this, R2).getInt32(h(this, w), h(this, ne));
        return x(this, w, h(this, w) + 4), t2;
      }
      string(t2) {
        return h(this, me).decode(this.bytes(t2));
      }
      cstring() {
        let t2 = h(this, w), n3 = t2;
        for (; h(this, R2).getUint8(n3++) !== 0; ) ;
        let r = this.string(n3 - t2 - 1);
        return x(this, w, n3), r;
      }
      bytes(t2) {
        let n3 = h(this, R2).buffer.slice(h(this, w), h(this, w) + t2);
        return x(this, w, h(this, w) + t2), new Uint8Array(n3);
      }
    };
    R2 = /* @__PURE__ */ new WeakMap(), w = /* @__PURE__ */ new WeakMap(), fe = /* @__PURE__ */ new WeakMap(), me = /* @__PURE__ */ new WeakMap(), ne = /* @__PURE__ */ new WeakMap();
    Oe = 1;
    _n = 4;
    Ze = Oe + _n;
    et = new ArrayBuffer(0);
    ye = class {
      constructor() {
        R(this, l2);
        R(this, A, new DataView(et));
        R(this, S, 0);
        R(this, D2, 0);
        R(this, o, new de());
      }
      parse(t2, n3) {
        T(this, l2, tt).call(this, ArrayBuffer.isView(t2) ? t2.buffer.slice(t2.byteOffset, t2.byteOffset + t2.byteLength) : t2);
        let r = h(this, D2) + h(this, S), i3 = h(this, D2);
        for (; i3 + Ze <= r; ) {
          let a2 = h(this, A).getUint8(i3), u2 = h(this, A).getUint32(i3 + Oe, false), f3 = Oe + u2;
          if (f3 + i3 <= r && u2 > 0) {
            let c2 = T(this, l2, nt).call(this, i3 + Ze, a2, u2, h(this, A).buffer);
            n3(c2), i3 += f3;
          } else break;
        }
        i3 === r ? (x(this, A, new DataView(et)), x(this, S, 0), x(this, D2, 0)) : (x(this, S, r - i3), x(this, D2, i3));
      }
    };
    A = /* @__PURE__ */ new WeakMap(), S = /* @__PURE__ */ new WeakMap(), D2 = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new WeakMap(), l2 = /* @__PURE__ */ new WeakSet(), tt = function(t2) {
      if (h(this, S) > 0) {
        let n3 = h(this, S) + t2.byteLength;
        if (n3 + h(this, D2) > h(this, A).byteLength) {
          let i3;
          if (n3 <= h(this, A).byteLength && h(this, D2) >= h(this, S)) i3 = h(this, A).buffer;
          else {
            let a2 = h(this, A).byteLength * 2;
            for (; n3 >= a2; ) a2 *= 2;
            i3 = new ArrayBuffer(a2);
          }
          new Uint8Array(i3).set(new Uint8Array(h(this, A).buffer, h(this, D2), h(this, S))), x(this, A, new DataView(i3)), x(this, D2, 0);
        }
        new Uint8Array(h(this, A).buffer).set(new Uint8Array(t2), h(this, D2) + h(this, S)), x(this, S, n3);
      } else x(this, A, new DataView(t2)), x(this, D2, 0), x(this, S, t2.byteLength);
    }, nt = function(t2, n3, r, i3) {
      switch (n3) {
        case 50:
          return Ie;
        case 49:
          return Be;
        case 51:
          return Me;
        case 110:
          return Re;
        case 115:
          return Te;
        case 99:
          return Pe;
        case 87:
          return Ee;
        case 73:
          return Ce;
        case 68:
          return T(this, l2, dt).call(this, t2, r, i3);
        case 67:
          return T(this, l2, st).call(this, t2, r, i3);
        case 90:
          return T(this, l2, rt).call(this, t2, r, i3);
        case 65:
          return T(this, l2, ut).call(this, t2, r, i3);
        case 82:
          return T(this, l2, yt).call(this, t2, r, i3);
        case 83:
          return T(this, l2, ft).call(this, t2, r, i3);
        case 75:
          return T(this, l2, mt).call(this, t2, r, i3);
        case 69:
          return T(this, l2, Ve).call(this, t2, r, i3, "error");
        case 78:
          return T(this, l2, Ve).call(this, t2, r, i3, "notice");
        case 84:
          return T(this, l2, lt).call(this, t2, r, i3);
        case 116:
          return T(this, l2, pt).call(this, t2, r, i3);
        case 71:
          return T(this, l2, at).call(this, t2, r, i3);
        case 72:
          return T(this, l2, ot).call(this, t2, r, i3);
        case 100:
          return T(this, l2, it).call(this, t2, r, i3);
        default:
          return new C("received invalid response: " + n3.toString(16), r, "error");
      }
    }, rt = function(t2, n3, r) {
      h(this, o).setBuffer(t2, r);
      let i3 = h(this, o).string(1);
      return new X(n3, i3);
    }, st = function(t2, n3, r) {
      h(this, o).setBuffer(t2, r);
      let i3 = h(this, o).cstring();
      return new Z(n3, i3);
    }, it = function(t2, n3, r) {
      let i3 = r.slice(t2, t2 + (n3 - 4));
      return new _2(n3, new Uint8Array(i3));
    }, at = function(t2, n3, r) {
      return T(this, l2, ke).call(this, t2, n3, r, "copyInResponse");
    }, ot = function(t2, n3, r) {
      return T(this, l2, ke).call(this, t2, n3, r, "copyOutResponse");
    }, ke = function(t2, n3, r, i3) {
      h(this, o).setBuffer(t2, r);
      let a2 = h(this, o).byte() !== 0, u2 = h(this, o).int16(), f3 = new z10(n3, i3, a2, u2);
      for (let c2 = 0; c2 < u2; c2++) f3.columnTypes[c2] = h(this, o).int16();
      return f3;
    }, ut = function(t2, n3, r) {
      h(this, o).setBuffer(t2, r);
      let i3 = h(this, o).int32(), a2 = h(this, o).cstring(), u2 = h(this, o).cstring();
      return new J(n3, i3, a2, u2);
    }, lt = function(t2, n3, r) {
      h(this, o).setBuffer(t2, r);
      let i3 = h(this, o).int16(), a2 = new q(n3, i3);
      for (let u2 = 0; u2 < i3; u2++) a2.fields[u2] = T(this, l2, ct).call(this);
      return a2;
    }, ct = function() {
      let t2 = h(this, o).cstring(), n3 = h(this, o).int32(), r = h(this, o).int16(), i3 = h(this, o).int32(), a2 = h(this, o).int16(), u2 = h(this, o).int32(), f3 = h(this, o).int16() === 0 ? Le.text : Le.binary;
      return new H(t2, n3, r, i3, a2, u2, f3);
    }, pt = function(t2, n3, r) {
      h(this, o).setBuffer(t2, r);
      let i3 = h(this, o).int16(), a2 = new Y(n3, i3);
      for (let u2 = 0; u2 < i3; u2++) a2.dataTypeIDs[u2] = h(this, o).int32();
      return a2;
    }, dt = function(t2, n3, r) {
      h(this, o).setBuffer(t2, r);
      let i3 = h(this, o).int16(), a2 = new Array(i3);
      for (let u2 = 0; u2 < i3; u2++) {
        let f3 = h(this, o).int32();
        a2[u2] = f3 === -1 ? null : h(this, o).string(f3);
      }
      return new ee(n3, a2);
    }, ft = function(t2, n3, r) {
      h(this, o).setBuffer(t2, r);
      let i3 = h(this, o).cstring(), a2 = h(this, o).cstring();
      return new $(n3, i3, a2);
    }, mt = function(t2, n3, r) {
      h(this, o).setBuffer(t2, r);
      let i3 = h(this, o).int32(), a2 = h(this, o).int32();
      return new K(n3, i3, a2);
    }, yt = function(t2, n3, r) {
      h(this, o).setBuffer(t2, r);
      let i3 = h(this, o).int32();
      switch (i3) {
        case 0:
          return new F2(n3);
        case 3:
          return new v(n3);
        case 5:
          return new G(n3, h(this, o).bytes(4));
        case 10: {
          let a2 = [];
          for (; ; ) {
            let u2 = h(this, o).cstring();
            if (u2.length === 0) return new j(n3, a2);
            a2.push(u2);
          }
        }
        case 11:
          return new Q(n3, h(this, o).string(n3 - 8));
        case 12:
          return new W(n3, h(this, o).string(n3 - 8));
        default:
          throw new Error("Unknown authenticationOk message type " + i3);
      }
    }, Ve = function(t2, n3, r, i3) {
      h(this, o).setBuffer(t2, r);
      let a2 = {}, u2 = h(this, o).string(1);
      for (; u2 !== "\0"; ) a2[u2] = h(this, o).cstring(), u2 = h(this, o).string(1);
      let f3 = a2.M, c2 = i3 === "notice" ? new te(n3, f3) : new C(f3, n3, i3);
      return c2.severity = a2.S, c2.code = a2.C, c2.detail = a2.D, c2.hint = a2.H, c2.position = a2.P, c2.internalPosition = a2.p, c2.internalQuery = a2.q, c2.where = a2.W, c2.schema = a2.s, c2.table = a2.t, c2.column = a2.c, c2.dataType = a2.d, c2.constraint = a2.n, c2.file = a2.F, c2.line = a2.L, c2.routine = a2.R, c2;
    };
    u();
    Fe = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
    Cr = () => {
      if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
      let e = new Uint8Array(16);
      if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(e);
      else for (let n3 = 0; n3 < e.length; n3++) e[n3] = Math.floor(Math.random() * 256);
      e[6] = e[6] & 15 | 64, e[8] = e[8] & 63 | 128;
      let t2 = [];
      return e.forEach((n3) => {
        t2.push(n3.toString(16).padStart(2, "0"));
      }), t2.slice(0, 4).join("") + "-" + t2.slice(4, 6).join("") + "-" + t2.slice(6, 8).join("") + "-" + t2.slice(8, 10).join("") + "-" + t2.slice(10).join("");
    };
  }
});

// node_modules/.pnpm/@electric-sql+pglite@0.3.16/node_modules/@electric-sql/pglite/dist/chunk-F4GETNPB.js
function s2(t2, r, ...e) {
  let a2 = t2.length - 1, p4 = e.length - 1;
  if (p4 !== -1) {
    if (p4 === 0) {
      t2[a2] = t2[a2] + e[0] + r;
      return;
    }
    t2[a2] = t2[a2] + e[0], t2.push(...e.slice(1, p4)), t2.push(e[p4] + r);
  }
}
function y(t2, ...r) {
  let e = [t2[0]];
  e.raw = [t2.raw[0]];
  let a2 = [];
  for (let p4 = 0; p4 < r.length; p4++) {
    let n3 = r[p4], i3 = p4 + 1;
    if (n3?._templateType === o2.part) {
      s2(e, t2[i3], n3.str), s2(e.raw, t2.raw[i3], n3.str);
      continue;
    }
    if (n3?._templateType === o2.container) {
      s2(e, t2[i3], ...n3.strings), s2(e.raw, t2.raw[i3], ...n3.strings.raw), a2.push(...n3.values);
      continue;
    }
    e.push(t2[i3]), e.raw.push(t2.raw[i3]), a2.push(n3);
  }
  return { _templateType: "container", strings: e, values: a2 };
}
function g3(t2, ...r) {
  let { strings: e, values: a2 } = y(t2, ...r);
  return { query: [e[0], ...a2.flatMap((p4, n3) => [`$${n3 + 1}`, e[n3 + 1]])].join(""), params: a2 };
}
var o2;
var init_chunk_F4GETNPB = __esm({
  "node_modules/.pnpm/@electric-sql+pglite@0.3.16/node_modules/@electric-sql/pglite/dist/chunk-F4GETNPB.js"() {
    init_chunk_QY3QWFKW();
    u();
    o2 = { part: "part", container: "container" };
  }
});

// node_modules/.pnpm/@electric-sql+pglite@0.3.16/node_modules/@electric-sql/pglite/dist/chunk-F2DQ4FIK.js
function E(m4) {
  let s4 = m4.e;
  return s4.query = m4.query, s4.params = m4.params, s4.queryOptions = m4.options, s4;
}
var T3, p2, t, y2, x3, h2, O2, k2;
var init_chunk_F2DQ4FIK = __esm({
  "node_modules/.pnpm/@electric-sql+pglite@0.3.16/node_modules/@electric-sql/pglite/dist/chunk-F2DQ4FIK.js"() {
    init_chunk_3WWIVTCY();
    init_chunk_F4GETNPB();
    init_chunk_QY3QWFKW();
    u();
    u();
    k2 = class {
      constructor() {
        R(this, t);
        this.serializers = { ...cn };
        this.parsers = { ...ln };
        R(this, T3, false);
        R(this, p2, false);
      }
      async _initArrayTypes({ force: s4 = false } = {}) {
        if (h(this, T3) && !s4) return;
        x(this, T3, true);
        let e = await this.query(`
      SELECT b.oid, b.typarray
      FROM pg_catalog.pg_type a
      LEFT JOIN pg_catalog.pg_type b ON b.oid = a.typelem
      WHERE a.typcategory = 'A'
      GROUP BY b.oid, b.typarray
      ORDER BY b.oid
    `);
        for (let r of e.rows) this.serializers[r.typarray] = (o4) => Ke(o4, this.serializers[r.oid], r.typarray), this.parsers[r.typarray] = (o4) => yn(o4, this.parsers[r.oid], r.typarray);
      }
      async refreshArrayTypes() {
        await this._initArrayTypes({ force: true });
      }
      async query(s4, e, r) {
        return await this._checkReady(), await this._runExclusiveTransaction(async () => await T(this, t, x3).call(this, s4, e, r));
      }
      async sql(s4, ...e) {
        let { query: r, params: o4 } = g3(s4, ...e);
        return await this.query(r, o4);
      }
      async exec(s4, e) {
        return await this._checkReady(), await this._runExclusiveTransaction(async () => await T(this, t, h2).call(this, s4, e));
      }
      async describeQuery(s4, e) {
        let r = [];
        try {
          await T(this, t, y2).call(this, k.parse({ text: s4, types: e?.paramTypes }), e), r = await T(this, t, y2).call(this, k.describe({ type: "S" }), e);
        } catch (n3) {
          throw n3 instanceof C ? E({ e: n3, options: e, params: void 0, query: s4 }) : n3;
        } finally {
          r.push(...await T(this, t, y2).call(this, k.sync(), e));
        }
        let o4 = r.find((n3) => n3.name === "parameterDescription"), i3 = r.find((n3) => n3.name === "rowDescription"), c2 = o4?.dataTypeIDs.map((n3) => ({ dataTypeID: n3, serializer: this.serializers[n3] })) ?? [], u2 = i3?.fields.map((n3) => ({ name: n3.name, dataTypeID: n3.dataTypeID, parser: this.parsers[n3.dataTypeID] })) ?? [];
        return { queryParams: c2, resultFields: u2 };
      }
      async transaction(s4) {
        return await this._checkReady(), await this._runExclusiveTransaction(async () => {
          await T(this, t, h2).call(this, "BEGIN"), x(this, p2, true);
          let e = false, r = () => {
            if (e) throw new Error("Transaction is closed");
          }, o4 = { query: async (i3, c2, u2) => (r(), await T(this, t, x3).call(this, i3, c2, u2)), sql: async (i3, ...c2) => {
            let { query: u2, params: n3 } = g3(i3, ...c2);
            return await T(this, t, x3).call(this, u2, n3);
          }, exec: async (i3, c2) => (r(), await T(this, t, h2).call(this, i3, c2)), rollback: async () => {
            r(), await T(this, t, h2).call(this, "ROLLBACK"), e = true;
          }, listen: async (i3, c2) => (r(), await this.listen(i3, c2, o4)), get closed() {
            return e;
          } };
          try {
            let i3 = await s4(o4);
            return e || (e = true, await T(this, t, h2).call(this, "COMMIT")), x(this, p2, false), i3;
          } catch (i3) {
            throw e || await T(this, t, h2).call(this, "ROLLBACK"), x(this, p2, false), i3;
          }
        });
      }
      async runExclusive(s4) {
        return await this._runExclusiveQuery(s4);
      }
    };
    T3 = /* @__PURE__ */ new WeakMap(), p2 = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakSet(), y2 = async function(s4, e = {}) {
      return await this.execProtocolStream(s4, { ...e, syncToFs: false });
    }, x3 = async function(s4, e = [], r) {
      return await this._runExclusiveQuery(async () => {
        T(this, t, O2).call(this, "runQuery", s4, e, r), await this._handleBlob(r?.blob);
        let o4 = [];
        try {
          let c2 = await T(this, t, y2).call(this, k.parse({ text: s4, types: r?.paramTypes }), r), u2 = De(await T(this, t, y2).call(this, k.describe({ type: "S" }), r)), n3 = e.map((b3, S3) => {
            let D4 = u2[S3];
            if (b3 == null) return null;
            let Q3 = r?.serializers?.[D4] ?? this.serializers[D4];
            return Q3 ? Q3(b3) : b3.toString();
          });
          o4 = [...c2, ...await T(this, t, y2).call(this, k.bind({ values: n3 }), r), ...await T(this, t, y2).call(this, k.describe({ type: "P" }), r), ...await T(this, t, y2).call(this, k.execute({}), r)];
        } catch (c2) {
          throw c2 instanceof C ? E({ e: c2, options: r, params: e, query: s4 }) : c2;
        } finally {
          o4.push(...await T(this, t, y2).call(this, k.sync(), r));
        }
        await this._cleanupBlob(), h(this, p2) || await this.syncToFs();
        let i3 = await this._getWrittenBlob();
        return bn(o4, this.parsers, r, i3)[0];
      });
    }, h2 = async function(s4, e) {
      return await this._runExclusiveQuery(async () => {
        T(this, t, O2).call(this, "runExec", s4, e), await this._handleBlob(e?.blob);
        let r = [];
        try {
          r = await T(this, t, y2).call(this, k.query(s4), e);
        } catch (i3) {
          throw i3 instanceof C ? E({ e: i3, options: e, params: void 0, query: s4 }) : i3;
        } finally {
          r.push(...await T(this, t, y2).call(this, k.sync(), e));
        }
        this._cleanupBlob(), h(this, p2) || await this.syncToFs();
        let o4 = await this._getWrittenBlob();
        return bn(r, this.parsers, e, o4);
      });
    }, O2 = function(...s4) {
      this.debug > 0 && console.log(...s4);
    };
  }
});

// node_modules/.pnpm/@electric-sql+pglite@0.3.16/node_modules/@electric-sql/pglite/dist/chunk-VBDAOXYI.js
async function H2(r, e, t2 = "pgdata", s4 = "auto") {
  let a2 = Br(r, e), [n3, o4] = await qr(a2, s4), i3 = t2 + (o4 ? ".tar.gz" : ".tar"), u2 = o4 ? "application/x-gzip" : "application/x-tar";
  return typeof File < "u" ? new File([n3], i3, { type: u2 }) : new Blob([n3], { type: u2 });
}
async function ce2(r, e, t2) {
  let s4 = new Uint8Array(await e.arrayBuffer()), a2 = typeof File < "u" && e instanceof File ? e.name : void 0;
  (Hr.includes(e.type) || a2?.endsWith(".tgz") || a2?.endsWith(".tar.gz")) && (s4 = await ar(s4));
  let o4;
  try {
    o4 = (0, g4.untar)(s4);
  } catch (i3) {
    if (i3 instanceof Error && i3.message.includes("File is corrupted")) s4 = await ar(s4), o4 = (0, g4.untar)(s4);
    else throw i3;
  }
  for (let i3 of o4) {
    let u2 = t2 + i3.name, c2 = u2.split("/").slice(0, -1);
    for (let m4 = 1; m4 <= c2.length; m4++) {
      let y4 = c2.slice(0, m4).join("/");
      r.analyzePath(y4).exists || r.mkdir(y4);
    }
    i3.type === g4.REGTYPE ? (r.writeFile(u2, i3.data), r.utime(u2, sr(i3.modifyTime), sr(i3.modifyTime))) : i3.type === g4.DIRTYPE && r.mkdir(u2);
  }
}
function jr(r, e) {
  let t2 = [], s4 = (a2) => {
    r.readdir(a2).forEach((o4) => {
      if (o4 === "." || o4 === "..") return;
      let i3 = a2 + "/" + o4, u2 = r.stat(i3), c2 = r.isFile(u2.mode) ? r.readFile(i3, { encoding: "binary" }) : new Uint8Array(0);
      t2.push({ name: i3.substring(e.length), mode: u2.mode, size: u2.size, type: r.isFile(u2.mode) ? g4.REGTYPE : g4.DIRTYPE, modifyTime: u2.mtime, data: c2 }), r.isDir(u2.mode) && s4(i3);
    });
  };
  return s4(e), t2;
}
function Br(r, e) {
  let t2 = jr(r, e);
  return (0, g4.tar)(t2);
}
async function qr(r, e = "auto") {
  if (e === "none") return [r, false];
  if (typeof CompressionStream < "u") return [await Yr(r), true];
  if (typeof process < "u" && process.versions && process.versions.node) return [await Wr(r), true];
  if (e === "auto") return [r, false];
  throw new Error("Compression not supported in this environment");
}
async function Yr(r) {
  let e = new CompressionStream("gzip"), t2 = e.writable.getWriter(), s4 = e.readable.getReader();
  t2.write(r), t2.close();
  let a2 = [];
  for (; ; ) {
    let { value: i3, done: u2 } = await s4.read();
    if (u2) break;
    i3 && a2.push(i3);
  }
  let n3 = new Uint8Array(a2.reduce((i3, u2) => i3 + u2.length, 0)), o4 = 0;
  return a2.forEach((i3) => {
    n3.set(i3, o4), o4 += i3.length;
  }), n3;
}
async function Wr(r) {
  let { promisify: e } = await import("util"), { gzip: t2 } = await import("zlib");
  return await e(t2)(r);
}
async function ar(r) {
  if (typeof CompressionStream < "u") return await Xr(r);
  if (typeof process < "u" && process.versions && process.versions.node) return await Kr(r);
  throw new Error("Unsupported environment for decompression");
}
async function Xr(r) {
  let e = new DecompressionStream("gzip"), t2 = e.writable.getWriter(), s4 = e.readable.getReader();
  t2.write(r), t2.close();
  let a2 = [];
  for (; ; ) {
    let { value: i3, done: u2 } = await s4.read();
    if (u2) break;
    i3 && a2.push(i3);
  }
  let n3 = new Uint8Array(a2.reduce((i3, u2) => i3 + u2.length, 0)), o4 = 0;
  return a2.forEach((i3) => {
    n3.set(i3, o4), o4 += i3.length;
  }), n3;
}
async function Kr(r) {
  let { promisify: e } = await import("util"), { gunzip: t2 } = await import("zlib");
  return await e(t2)(r);
}
function sr(r) {
  return r ? typeof r == "number" ? r : Math.floor(r.getTime() / 1e3) : Math.floor(Date.now() / 1e3);
}
var w2, x4, L3, er, nr, or, g4, Hr, Vr, C2, ur, cr, pr, Zr;
var init_chunk_VBDAOXYI = __esm({
  "node_modules/.pnpm/@electric-sql+pglite@0.3.16/node_modules/@electric-sql/pglite/dist/chunk-VBDAOXYI.js"() {
    init_chunk_QY3QWFKW();
    w2 = D(($r, l3) => {
      "use strict";
      u();
      var j3 = 9007199254740991, B2 = /* @__PURE__ */ (function(r) {
        return r;
      })();
      function mr(r) {
        return r === B2;
      }
      function q2(r) {
        return typeof r == "string" || Object.prototype.toString.call(r) == "[object String]";
      }
      function lr(r) {
        return Object.prototype.toString.call(r) == "[object Date]";
      }
      function N3(r) {
        return r !== null && typeof r == "object";
      }
      function U3(r) {
        return typeof r == "function";
      }
      function fr(r) {
        return typeof r == "number" && r > -1 && r % 1 == 0 && r <= j3;
      }
      function yr(r) {
        return Object.prototype.toString.call(r) == "[object Array]";
      }
      function Y3(r) {
        return N3(r) && !U3(r) && fr(r.length);
      }
      function D4(r) {
        return Object.prototype.toString.call(r) == "[object ArrayBuffer]";
      }
      function gr(r, e) {
        return Array.prototype.map.call(r, e);
      }
      function hr(r, e) {
        var t2 = B2;
        return U3(e) && Array.prototype.every.call(r, function(s4, a2, n3) {
          var o4 = e(s4, a2, n3);
          return o4 && (t2 = s4), !o4;
        }), t2;
      }
      function Sr(r) {
        return Object.assign.apply(null, arguments);
      }
      function W3(r) {
        var e, t2, s4;
        if (q2(r)) {
          for (t2 = r.length, s4 = new Uint8Array(t2), e = 0; e < t2; e++) s4[e] = r.charCodeAt(e) & 255;
          return s4;
        }
        return D4(r) ? new Uint8Array(r) : N3(r) && D4(r.buffer) ? new Uint8Array(r.buffer) : Y3(r) ? new Uint8Array(r) : N3(r) && U3(r.toString) ? W3(r.toString()) : new Uint8Array();
      }
      l3.exports.MAX_SAFE_INTEGER = j3;
      l3.exports.isUndefined = mr;
      l3.exports.isString = q2;
      l3.exports.isObject = N3;
      l3.exports.isDateTime = lr;
      l3.exports.isFunction = U3;
      l3.exports.isArray = yr;
      l3.exports.isArrayLike = Y3;
      l3.exports.isArrayBuffer = D4;
      l3.exports.map = gr;
      l3.exports.find = hr;
      l3.exports.extend = Sr;
      l3.exports.toUint8Array = W3;
    });
    x4 = D((Qr, X2) => {
      "use strict";
      u();
      var M2 = "\0";
      X2.exports = { NULL_CHAR: M2, TMAGIC: "ustar" + M2 + "00", OLDGNU_MAGIC: "ustar  " + M2, REGTYPE: 0, LNKTYPE: 1, SYMTYPE: 2, CHRTYPE: 3, BLKTYPE: 4, DIRTYPE: 5, FIFOTYPE: 6, CONTTYPE: 7, TSUID: parseInt("4000", 8), TSGID: parseInt("2000", 8), TSVTX: parseInt("1000", 8), TUREAD: parseInt("0400", 8), TUWRITE: parseInt("0200", 8), TUEXEC: parseInt("0100", 8), TGREAD: parseInt("0040", 8), TGWRITE: parseInt("0020", 8), TGEXEC: parseInt("0010", 8), TOREAD: parseInt("0004", 8), TOWRITE: parseInt("0002", 8), TOEXEC: parseInt("0001", 8), TPERMALL: parseInt("0777", 8), TPERMMASK: parseInt("0777", 8) };
    });
    L3 = D((ee2, f3) => {
      "use strict";
      u();
      var K3 = w2(), p4 = x4(), Fr = 512, I3 = p4.TPERMALL, V2 = 0, Z3 = 0, _3 = [["name", 100, 0, function(r, e) {
        return v3(r[e[0]], e[1]);
      }, function(r, e, t2) {
        return A2(r.slice(e, e + t2[1]));
      }], ["mode", 8, 100, function(r, e) {
        var t2 = r[e[0]] || I3;
        return t2 = t2 & p4.TPERMMASK, P4(t2, e[1], I3);
      }, function(r, e, t2) {
        var s4 = S3(r.slice(e, e + t2[1]));
        return s4 &= p4.TPERMMASK, s4;
      }], ["uid", 8, 108, function(r, e) {
        return P4(r[e[0]], e[1], V2);
      }, function(r, e, t2) {
        return S3(r.slice(e, e + t2[1]));
      }], ["gid", 8, 116, function(r, e) {
        return P4(r[e[0]], e[1], Z3);
      }, function(r, e, t2) {
        return S3(r.slice(e, e + t2[1]));
      }], ["size", 12, 124, function(r, e) {
        return P4(r.data.length, e[1]);
      }, function(r, e, t2) {
        return S3(r.slice(e, e + t2[1]));
      }], ["modifyTime", 12, 136, function(r, e) {
        return k4(r[e[0]], e[1]);
      }, function(r, e, t2) {
        return z12(r.slice(e, e + t2[1]));
      }], ["checksum", 8, 148, function(r, e) {
        return "        ";
      }, function(r, e, t2) {
        return S3(r.slice(e, e + t2[1]));
      }], ["type", 1, 156, function(r, e) {
        return "" + (parseInt(r[e[0]], 10) || 0) % 8;
      }, function(r, e, t2) {
        return (parseInt(String.fromCharCode(r[e]), 10) || 0) % 8;
      }], ["linkName", 100, 157, function(r, e) {
        return "";
      }, function(r, e, t2) {
        return A2(r.slice(e, e + t2[1]));
      }], ["ustar", 8, 257, function(r, e) {
        return p4.TMAGIC;
      }, function(r, e, t2) {
        return br(A2(r.slice(e, e + t2[1]), true));
      }, function(r, e) {
        return r[e[0]] == p4.TMAGIC || r[e[0]] == p4.OLDGNU_MAGIC;
      }], ["owner", 32, 265, function(r, e) {
        return v3(r[e[0]], e[1]);
      }, function(r, e, t2) {
        return A2(r.slice(e, e + t2[1]));
      }], ["group", 32, 297, function(r, e) {
        return v3(r[e[0]], e[1]);
      }, function(r, e, t2) {
        return A2(r.slice(e, e + t2[1]));
      }], ["majorNumber", 8, 329, function(r, e) {
        return "";
      }, function(r, e, t2) {
        return S3(r.slice(e, e + t2[1]));
      }], ["minorNumber", 8, 337, function(r, e) {
        return "";
      }, function(r, e, t2) {
        return S3(r.slice(e, e + t2[1]));
      }], ["prefix", 131, 345, function(r, e) {
        return v3(r[e[0]], e[1]);
      }, function(r, e, t2) {
        return A2(r.slice(e, e + t2[1]));
      }], ["accessTime", 12, 476, function(r, e) {
        return k4(r[e[0]], e[1]);
      }, function(r, e, t2) {
        return z12(r.slice(e, e + t2[1]));
      }], ["createTime", 12, 488, function(r, e) {
        return k4(r[e[0]], e[1]);
      }, function(r, e, t2) {
        return z12(r.slice(e, e + t2[1]));
      }]], $4 = (function(r) {
        var e = r[r.length - 1];
        return e[2] + e[1];
      })(_3);
      function br(r) {
        if (r.length == 8) {
          var e = r.split("");
          if (e[5] == p4.NULL_CHAR) return (e[6] == " " || e[6] == p4.NULL_CHAR) && (e[6] = "0"), (e[7] == " " || e[7] == p4.NULL_CHAR) && (e[7] = "0"), e = e.join(""), e == p4.TMAGIC ? e : r;
          if (e[7] == p4.NULL_CHAR) return e[5] == p4.NULL_CHAR && (e[5] = " "), e[6] == p4.NULL_CHAR && (e[6] = " "), e == p4.OLDGNU_MAGIC ? e : r;
        }
        return r;
      }
      function v3(r, e) {
        return e -= 1, K3.isUndefined(r) && (r = ""), r = ("" + r).substr(0, e), r + p4.NULL_CHAR;
      }
      function P4(r, e, t2) {
        for (t2 = parseInt(t2) || 0, e -= 1, r = (parseInt(r) || t2).toString(8).substr(-e, e); r.length < e; ) r = "0" + r;
        return r + p4.NULL_CHAR;
      }
      function k4(r, e) {
        if (K3.isDateTime(r)) r = Math.floor(1 * r / 1e3);
        else if (r = parseInt(r, 10), isFinite(r)) {
          if (r <= 0) return "";
        } else r = Math.floor(1 * /* @__PURE__ */ new Date() / 1e3);
        return P4(r, e, 0);
      }
      function A2(r, e) {
        var t2 = String.fromCharCode.apply(null, r);
        if (e) return t2;
        var s4 = t2.indexOf(p4.NULL_CHAR);
        return s4 >= 0 ? t2.substr(0, s4) : t2;
      }
      function S3(r) {
        var e = String.fromCharCode.apply(null, r);
        return parseInt(e.replace(/^0+$/g, ""), 8) || 0;
      }
      function z12(r) {
        return r.length == 0 || r[0] == 0 ? null : new Date(1e3 * S3(r));
      }
      function Tr2(r, e, t2) {
        var s4 = parseInt(e, 10) || 0, a2 = Math.min(s4 + $4, r.length), n3 = 0, o4 = 0, i3 = 0;
        t2 && _3.every(function(y4) {
          return y4[0] == "checksum" ? (o4 = s4 + y4[2], i3 = o4 + y4[1], false) : true;
        });
        for (var u2 = 32, c2 = s4; c2 < a2; c2++) {
          var m4 = c2 >= o4 && c2 < i3 ? u2 : r[c2];
          n3 = (n3 + m4) % 262144;
        }
        return n3;
      }
      f3.exports.recordSize = Fr;
      f3.exports.defaultFileMode = I3;
      f3.exports.defaultUid = V2;
      f3.exports.defaultGid = Z3;
      f3.exports.posixHeader = _3;
      f3.exports.effectiveHeaderSize = $4;
      f3.exports.calculateChecksum = Tr2;
      f3.exports.formatTarString = v3;
      f3.exports.formatTarNumber = P4;
      f3.exports.formatTarDateTime = k4;
      f3.exports.parseTarString = A2;
      f3.exports.parseTarNumber = S3;
      f3.exports.parseTarDateTime = z12;
    });
    er = D((ne3, rr) => {
      "use strict";
      u();
      var Ar = x4(), O4 = w2(), F4 = L3();
      function J3(r) {
        return F4.recordSize;
      }
      function Q3(r) {
        return Math.ceil(r.data.length / F4.recordSize) * F4.recordSize;
      }
      function Er2(r) {
        var e = 0;
        return r.forEach(function(t2) {
          e += J3(t2) + Q3(t2);
        }), e += F4.recordSize * 2, new Uint8Array(e);
      }
      function Pr2(r, e, t2) {
        t2 = parseInt(t2) || 0;
        var s4 = t2;
        F4.posixHeader.forEach(function(u2) {
          for (var c2 = u2[3](e, u2), m4 = c2.length, y4 = 0; y4 < m4; y4 += 1) r[s4 + y4] = c2.charCodeAt(y4) & 255;
          s4 += u2[1];
        });
        var a2 = O4.find(F4.posixHeader, function(u2) {
          return u2[0] == "checksum";
        });
        if (a2) {
          var n3 = F4.calculateChecksum(r, t2, true), o4 = F4.formatTarNumber(n3, a2[1] - 2) + Ar.NULL_CHAR + " ";
          s4 = t2 + a2[2];
          for (var i3 = 0; i3 < o4.length; i3 += 1) r[s4] = o4.charCodeAt(i3) & 255, s4++;
        }
        return t2 + J3(e);
      }
      function wr(r, e, t2) {
        return t2 = parseInt(t2, 10) || 0, r.set(e.data, t2), t2 + Q3(e);
      }
      function xr(r) {
        r = O4.map(r, function(s4) {
          return O4.extend({}, s4, { data: O4.toUint8Array(s4.data) });
        });
        var e = Er2(r), t2 = 0;
        return r.forEach(function(s4) {
          t2 = Pr2(e, s4, t2), t2 = wr(e, s4, t2);
        }), e;
      }
      rr.exports.tar = xr;
    });
    nr = D((oe2, tr) => {
      "use strict";
      u();
      var vr = x4(), G4 = w2(), h3 = L3(), Nr2 = { extractData: true, checkHeader: true, checkChecksum: true, checkFileSize: true }, Ur = { size: true, checksum: true, ustar: true }, R4 = { unexpectedEndOfFile: "Unexpected end of file.", fileCorrupted: "File is corrupted.", checksumCheckFailed: "Checksum check failed." };
      function kr(r) {
        return h3.recordSize;
      }
      function zr(r) {
        return Math.ceil(r / h3.recordSize) * h3.recordSize;
      }
      function Or(r, e) {
        for (var t2 = e, s4 = Math.min(r.length, e + h3.recordSize * 2), a2 = t2; a2 < s4; a2++) if (r[a2] != 0) return false;
        return true;
      }
      function Cr2(r, e, t2) {
        if (r.length - e < h3.recordSize) {
          if (t2.checkFileSize) throw new Error(R4.unexpectedEndOfFile);
          return null;
        }
        e = parseInt(e) || 0;
        var s4 = {}, a2 = e;
        if (h3.posixHeader.forEach(function(i3) {
          s4[i3[0]] = i3[4](r, a2, i3), a2 += i3[1];
        }), s4.type != 0 && (s4.size = 0), t2.checkHeader && h3.posixHeader.forEach(function(i3) {
          if (G4.isFunction(i3[5]) && !i3[5](s4, i3)) {
            var u2 = new Error(R4.fileCorrupted);
            throw u2.data = { offset: e + i3[2], field: i3[0] }, u2;
          }
        }), t2.checkChecksum) {
          var n3 = h3.calculateChecksum(r, e, true);
          if (n3 != s4.checksum) {
            var o4 = new Error(R4.checksumCheckFailed);
            throw o4.data = { offset: e, header: s4, checksum: n3 }, o4;
          }
        }
        return s4;
      }
      function Dr(r, e, t2, s4) {
        return s4.extractData ? t2.size <= 0 ? new Uint8Array() : r.slice(e, e + t2.size) : null;
      }
      function Mr(r, e) {
        var t2 = {};
        return h3.posixHeader.forEach(function(s4) {
          var a2 = s4[0];
          Ur[a2] || (t2[a2] = r[a2]);
        }), t2.isOldGNUFormat = r.ustar == vr.OLDGNU_MAGIC, e && (t2.data = e), t2;
      }
      function Ir(r, e) {
        e = G4.extend({}, Nr2, e);
        for (var t2 = [], s4 = 0, a2 = r.length; a2 - s4 >= h3.recordSize; ) {
          r = G4.toUint8Array(r);
          var n3 = Cr2(r, s4, e);
          if (!n3) break;
          s4 += kr(n3);
          var o4 = Dr(r, s4, n3, e);
          if (t2.push(Mr(n3, o4)), s4 += zr(n3.size), Or(r, s4)) break;
        }
        return t2;
      }
      tr.exports.untar = Ir;
    });
    or = D((se3, ir) => {
      "use strict";
      u();
      var _r = w2(), Lr = x4(), Rr2 = er(), Gr = nr();
      _r.extend(ir.exports, Rr2, Gr, Lr);
    });
    u();
    u();
    g4 = L(or(), 1);
    Hr = ["application/x-gtar", "application/x-tar+gzip", "application/x-gzip", "application/gzip"];
    Vr = "/tmp/pglite";
    C2 = Vr + "/base";
    ur = class {
      constructor(e) {
        this.dataDir = e;
      }
      async init(e, t2) {
        return this.pg = e, { emscriptenOpts: t2 };
      }
      async syncToFs(e) {
      }
      async initialSyncFs() {
      }
      async closeFs() {
      }
      async dumpTar(e, t2) {
        return H2(this.pg.Module.FS, C2, e, t2);
      }
    };
    cr = class {
      constructor(e, { debug: t2 = false } = {}) {
        this.dataDir = e, this.debug = t2;
      }
      async syncToFs(e) {
      }
      async initialSyncFs() {
      }
      async closeFs() {
      }
      async dumpTar(e, t2) {
        return H2(this.pg.Module.FS, C2, e, t2);
      }
      async init(e, t2) {
        return this.pg = e, { emscriptenOpts: { ...t2, preRun: [...t2.preRun || [], (a2) => {
          let n3 = Zr(a2, this);
          a2.FS.mkdir(C2), a2.FS.mount(n3, {}, C2);
        }] } };
      }
    };
    pr = { EBADF: 8, EBADFD: 127, EEXIST: 20, EINVAL: 28, EISDIR: 31, ENODEV: 43, ENOENT: 44, ENOTDIR: 54, ENOTEMPTY: 55 };
    Zr = (r, e) => {
      let t2 = r.FS, s4 = e.debug ? console.log : null, a2 = { tryFSOperation(n3) {
        try {
          return n3();
        } catch (o4) {
          throw o4.code ? o4.code === "UNKNOWN" ? new t2.ErrnoError(pr.EINVAL) : new t2.ErrnoError(o4.code) : o4;
        }
      }, mount(n3) {
        return a2.createNode(null, "/", 16895, 0);
      }, syncfs(n3, o4, i3) {
      }, createNode(n3, o4, i3, u2) {
        if (!t2.isDir(i3) && !t2.isFile(i3)) throw new t2.ErrnoError(28);
        let c2 = t2.createNode(n3, o4, i3);
        return c2.node_ops = a2.node_ops, c2.stream_ops = a2.stream_ops, c2;
      }, getMode: function(n3) {
        return s4?.("getMode", n3), a2.tryFSOperation(() => e.lstat(n3).mode);
      }, realPath: function(n3) {
        let o4 = [];
        for (; n3.parent !== n3; ) o4.push(n3.name), n3 = n3.parent;
        return o4.push(n3.mount.opts.root), o4.reverse(), o4.join("/");
      }, node_ops: { getattr(n3) {
        s4?.("getattr", a2.realPath(n3));
        let o4 = a2.realPath(n3);
        return a2.tryFSOperation(() => {
          let i3 = e.lstat(o4);
          return { ...i3, dev: 0, ino: n3.id, nlink: 1, rdev: n3.rdev, atime: new Date(i3.atime), mtime: new Date(i3.mtime), ctime: new Date(i3.ctime) };
        });
      }, setattr(n3, o4) {
        s4?.("setattr", a2.realPath(n3), o4);
        let i3 = a2.realPath(n3);
        a2.tryFSOperation(() => {
          o4.mode !== void 0 && e.chmod(i3, o4.mode), o4.size !== void 0 && e.truncate(i3, o4.size), o4.timestamp !== void 0 && e.utimes(i3, o4.timestamp, o4.timestamp), o4.size !== void 0 && e.truncate(i3, o4.size);
        });
      }, lookup(n3, o4) {
        s4?.("lookup", a2.realPath(n3), o4);
        let i3 = [a2.realPath(n3), o4].join("/"), u2 = a2.getMode(i3);
        return a2.createNode(n3, o4, u2);
      }, mknod(n3, o4, i3, u2) {
        s4?.("mknod", a2.realPath(n3), o4, i3, u2);
        let c2 = a2.createNode(n3, o4, i3, u2), m4 = a2.realPath(c2);
        return a2.tryFSOperation(() => (t2.isDir(c2.mode) ? e.mkdir(m4, { mode: i3 }) : e.writeFile(m4, "", { mode: i3 }), c2));
      }, rename(n3, o4, i3) {
        s4?.("rename", a2.realPath(n3), a2.realPath(o4), i3);
        let u2 = a2.realPath(n3), c2 = [a2.realPath(o4), i3].join("/");
        a2.tryFSOperation(() => {
          e.rename(u2, c2);
        }), n3.name = i3;
      }, unlink(n3, o4) {
        s4?.("unlink", a2.realPath(n3), o4);
        let i3 = [a2.realPath(n3), o4].join("/");
        try {
          e.unlink(i3);
        } catch {
        }
      }, rmdir(n3, o4) {
        s4?.("rmdir", a2.realPath(n3), o4);
        let i3 = [a2.realPath(n3), o4].join("/");
        return a2.tryFSOperation(() => {
          e.rmdir(i3);
        });
      }, readdir(n3) {
        s4?.("readdir", a2.realPath(n3));
        let o4 = a2.realPath(n3);
        return a2.tryFSOperation(() => e.readdir(o4));
      }, symlink(n3, o4, i3) {
        throw s4?.("symlink", a2.realPath(n3), o4, i3), new t2.ErrnoError(63);
      }, readlink(n3) {
        throw s4?.("readlink", a2.realPath(n3)), new t2.ErrnoError(63);
      } }, stream_ops: { open(n3) {
        s4?.("open stream", a2.realPath(n3.node));
        let o4 = a2.realPath(n3.node);
        return a2.tryFSOperation(() => {
          t2.isFile(n3.node.mode) && (n3.shared.refcount = 1, n3.nfd = e.open(o4));
        });
      }, close(n3) {
        return s4?.("close stream", a2.realPath(n3.node)), a2.tryFSOperation(() => {
          t2.isFile(n3.node.mode) && n3.nfd && --n3.shared.refcount === 0 && e.close(n3.nfd);
        });
      }, dup(n3) {
        s4?.("dup stream", a2.realPath(n3.node)), n3.shared.refcount++;
      }, read(n3, o4, i3, u2, c2) {
        return s4?.("read stream", a2.realPath(n3.node), i3, u2, c2), u2 === 0 ? 0 : a2.tryFSOperation(() => e.read(n3.nfd, o4, i3, u2, c2));
      }, write(n3, o4, i3, u2, c2) {
        return s4?.("write stream", a2.realPath(n3.node), i3, u2, c2), a2.tryFSOperation(() => e.write(n3.nfd, o4.buffer, i3, u2, c2));
      }, llseek(n3, o4, i3) {
        s4?.("llseek stream", a2.realPath(n3.node), o4, i3);
        let u2 = o4;
        if (i3 === 1 ? u2 += n3.position : i3 === 2 && t2.isFile(n3.node.mode) && a2.tryFSOperation(() => {
          let c2 = e.fstat(n3.nfd);
          u2 += c2.size;
        }), u2 < 0) throw new t2.ErrnoError(28);
        return u2;
      }, mmap(n3, o4, i3, u2, c2) {
        if (s4?.("mmap stream", a2.realPath(n3.node), o4, i3, u2, c2), !t2.isFile(n3.node.mode)) throw new t2.ErrnoError(pr.ENODEV);
        let m4 = r.mmapAlloc(o4);
        return a2.stream_ops.read(n3, r.HEAP8, m4, o4, i3), { ptr: m4, allocated: true };
      }, msync(n3, o4, i3, u2, c2) {
        return s4?.("msync stream", a2.realPath(n3.node), i3, u2, c2), a2.stream_ops.write(n3, o4, 0, u2, i3), 0;
      } } };
      return a2;
    };
  }
});

// node_modules/.pnpm/@electric-sql+pglite@0.3.16/node_modules/@electric-sql/pglite/dist/fs/nodefs.js
var nodefs_exports = {};
__export(nodefs_exports, {
  NodeFS: () => m2
});
var s3, o3, m2;
var init_nodefs = __esm({
  "node_modules/.pnpm/@electric-sql+pglite@0.3.16/node_modules/@electric-sql/pglite/dist/fs/nodefs.js"() {
    init_chunk_VBDAOXYI();
    init_chunk_QY3QWFKW();
    s3 = __toESM(require("fs"), 1);
    o3 = __toESM(require("path"), 1);
    u();
    m2 = class extends ur {
      constructor(t2) {
        super(t2), this.rootDir = o3.resolve(t2), s3.existsSync(o3.join(this.rootDir)) || s3.mkdirSync(this.rootDir);
      }
      async init(t2, e) {
        return this.pg = t2, { emscriptenOpts: { ...e, preRun: [...e.preRun || [], (r) => {
          let c2 = r.FS.filesystems.NODEFS;
          r.FS.mkdir(C2), r.FS.mount(c2, { root: this.rootDir }, C2);
        }] } };
      }
      async closeFs() {
        this.pg.Module.FS.quit();
      }
    };
  }
});

// node_modules/.pnpm/@electric-sql+pglite@0.3.16/node_modules/@electric-sql/pglite/dist/fs/opfs-ahp.js
var opfs_ahp_exports = {};
__export(opfs_ahp_exports, {
  OpfsAhpFS: () => L4
});
var $2, G2, T4, H3, v2, F3, M, y3, b2, m3, x5, P3, D3, S2, n2, C3, O3, k3, w3, f2, I, W2, j2, L4, p3;
var init_opfs_ahp = __esm({
  "node_modules/.pnpm/@electric-sql+pglite@0.3.16/node_modules/@electric-sql/pglite/dist/fs/opfs-ahp.js"() {
    init_chunk_VBDAOXYI();
    init_chunk_QY3QWFKW();
    u();
    $2 = "state.txt";
    G2 = "data";
    T4 = { DIR: 16384, FILE: 32768 };
    L4 = class extends cr {
      constructor(e, { initialPoolSize: t2 = 1e3, maintainedPoolSize: o4 = 100, debug: i3 = false } = {}) {
        super(e, { debug: i3 });
        R(this, n2);
        R(this, H3);
        R(this, v2);
        R(this, F3);
        R(this, M);
        R(this, y3);
        R(this, b2, /* @__PURE__ */ new Map());
        R(this, m3, /* @__PURE__ */ new Map());
        R(this, x5, 0);
        R(this, P3, /* @__PURE__ */ new Map());
        R(this, D3, /* @__PURE__ */ new Map());
        this.lastCheckpoint = 0;
        this.checkpointInterval = 1e3 * 60;
        this.poolCounter = 0;
        R(this, S2, /* @__PURE__ */ new Set());
        this.initialPoolSize = t2, this.maintainedPoolSize = o4;
      }
      async init(e, t2) {
        return await T(this, n2, C3).call(this), super.init(e, t2);
      }
      async syncToFs(e = false) {
        await this.maybeCheckpointState(), await this.maintainPool(), e || this.flush();
      }
      async closeFs() {
        for (let e of h(this, m3).values()) e.close();
        h(this, y3).flush(), h(this, y3).close(), this.pg.Module.FS.quit();
      }
      async maintainPool(e) {
        e = e || this.maintainedPoolSize;
        let t2 = e - this.state.pool.length, o4 = [];
        for (let i3 = 0; i3 < t2; i3++) o4.push(new Promise(async (c2) => {
          ++this.poolCounter;
          let a2 = `${(Date.now() - 1704063600).toString(16).padStart(8, "0")}-${this.poolCounter.toString(16).padStart(8, "0")}`, h3 = await h(this, F3).getFileHandle(a2, { create: true }), d2 = await h3.createSyncAccessHandle();
          h(this, b2).set(a2, h3), h(this, m3).set(a2, d2), T(this, n2, k3).call(this, { opp: "createPoolFile", args: [a2] }), this.state.pool.push(a2), c2();
        }));
        for (let i3 = 0; i3 > t2; i3--) o4.push(new Promise(async (c2) => {
          let a2 = this.state.pool.pop();
          T(this, n2, k3).call(this, { opp: "deletePoolFile", args: [a2] });
          let h3 = h(this, b2).get(a2);
          h(this, m3).get(a2)?.close(), await h(this, F3).removeEntry(h3.name), h(this, b2).delete(a2), h(this, m3).delete(a2), c2();
        }));
        await Promise.all(o4);
      }
      _createPoolFileState(e) {
        this.state.pool.push(e);
      }
      _deletePoolFileState(e) {
        let t2 = this.state.pool.indexOf(e);
        t2 > -1 && this.state.pool.splice(t2, 1);
      }
      async maybeCheckpointState() {
        Date.now() - this.lastCheckpoint > this.checkpointInterval && await this.checkpointState();
      }
      async checkpointState() {
        let e = new TextEncoder().encode(JSON.stringify(this.state));
        h(this, y3).truncate(0), h(this, y3).write(e, { at: 0 }), h(this, y3).flush(), this.lastCheckpoint = Date.now();
      }
      flush() {
        for (let e of h(this, S2)) try {
          e.flush();
        } catch {
        }
        h(this, S2).clear();
      }
      chmod(e, t2) {
        T(this, n2, O3).call(this, { opp: "chmod", args: [e, t2] }, () => {
          this._chmodState(e, t2);
        });
      }
      _chmodState(e, t2) {
        let o4 = T(this, n2, f2).call(this, e);
        o4.mode = t2;
      }
      close(e) {
        let t2 = T(this, n2, I).call(this, e);
        h(this, P3).delete(e), h(this, D3).delete(t2);
      }
      fstat(e) {
        let t2 = T(this, n2, I).call(this, e);
        return this.lstat(t2);
      }
      lstat(e) {
        let t2 = T(this, n2, f2).call(this, e), o4 = t2.type === "file" ? h(this, m3).get(t2.backingFilename).getSize() : 0, i3 = 4096;
        return { dev: 0, ino: 0, mode: t2.mode, nlink: 1, uid: 0, gid: 0, rdev: 0, size: o4, blksize: i3, blocks: Math.ceil(o4 / i3), atime: t2.lastModified, mtime: t2.lastModified, ctime: t2.lastModified };
      }
      mkdir(e, t2) {
        T(this, n2, O3).call(this, { opp: "mkdir", args: [e, t2] }, () => {
          this._mkdirState(e, t2);
        });
      }
      _mkdirState(e, t2) {
        let o4 = T(this, n2, w3).call(this, e), i3 = o4.pop(), c2 = [], a2 = this.state.root;
        for (let d2 of o4) {
          if (c2.push(e), !Object.prototype.hasOwnProperty.call(a2.children, d2)) if (t2?.recursive) this.mkdir(c2.join("/"));
          else throw new p3("ENOENT", "No such file or directory");
          if (a2.children[d2].type !== "directory") throw new p3("ENOTDIR", "Not a directory");
          a2 = a2.children[d2];
        }
        if (Object.prototype.hasOwnProperty.call(a2.children, i3)) throw new p3("EEXIST", "File exists");
        let h3 = { type: "directory", lastModified: Date.now(), mode: t2?.mode || T4.DIR, children: {} };
        a2.children[i3] = h3;
      }
      open(e, t2, o4) {
        if (T(this, n2, f2).call(this, e).type !== "file") throw new p3("EISDIR", "Is a directory");
        let c2 = T(this, n2, W2).call(this);
        return h(this, P3).set(c2, e), h(this, D3).set(e, c2), c2;
      }
      readdir(e) {
        let t2 = T(this, n2, f2).call(this, e);
        if (t2.type !== "directory") throw new p3("ENOTDIR", "Not a directory");
        return Object.keys(t2.children);
      }
      read(e, t2, o4, i3, c2) {
        let a2 = T(this, n2, I).call(this, e), h3 = T(this, n2, f2).call(this, a2);
        if (h3.type !== "file") throw new p3("EISDIR", "Is a directory");
        return h(this, m3).get(h3.backingFilename).read(new Uint8Array(t2.buffer, o4, i3), { at: c2 });
      }
      rename(e, t2) {
        T(this, n2, O3).call(this, { opp: "rename", args: [e, t2] }, () => {
          this._renameState(e, t2, true);
        });
      }
      _renameState(e, t2, o4 = false) {
        let i3 = T(this, n2, w3).call(this, e), c2 = i3.pop(), a2 = T(this, n2, f2).call(this, i3.join("/"));
        if (!Object.prototype.hasOwnProperty.call(a2.children, c2)) throw new p3("ENOENT", "No such file or directory");
        let h3 = T(this, n2, w3).call(this, t2), d2 = h3.pop(), l3 = T(this, n2, f2).call(this, h3.join("/"));
        if (o4 && Object.prototype.hasOwnProperty.call(l3.children, d2)) {
          let u2 = l3.children[d2];
          h(this, m3).get(u2.backingFilename).truncate(0), this.state.pool.push(u2.backingFilename);
        }
        l3.children[d2] = a2.children[c2], delete a2.children[c2];
      }
      rmdir(e) {
        T(this, n2, O3).call(this, { opp: "rmdir", args: [e] }, () => {
          this._rmdirState(e);
        });
      }
      _rmdirState(e) {
        let t2 = T(this, n2, w3).call(this, e), o4 = t2.pop(), i3 = T(this, n2, f2).call(this, t2.join("/"));
        if (!Object.prototype.hasOwnProperty.call(i3.children, o4)) throw new p3("ENOENT", "No such file or directory");
        let c2 = i3.children[o4];
        if (c2.type !== "directory") throw new p3("ENOTDIR", "Not a directory");
        if (Object.keys(c2.children).length > 0) throw new p3("ENOTEMPTY", "Directory not empty");
        delete i3.children[o4];
      }
      truncate(e, t2 = 0) {
        let o4 = T(this, n2, f2).call(this, e);
        if (o4.type !== "file") throw new p3("EISDIR", "Is a directory");
        let i3 = h(this, m3).get(o4.backingFilename);
        if (!i3) throw new p3("ENOENT", "No such file or directory");
        i3.truncate(t2), h(this, S2).add(i3);
      }
      unlink(e) {
        T(this, n2, O3).call(this, { opp: "unlink", args: [e] }, () => {
          this._unlinkState(e, true);
        });
      }
      _unlinkState(e, t2 = false) {
        let o4 = T(this, n2, w3).call(this, e), i3 = o4.pop(), c2 = T(this, n2, f2).call(this, o4.join("/"));
        if (!Object.prototype.hasOwnProperty.call(c2.children, i3)) throw new p3("ENOENT", "No such file or directory");
        let a2 = c2.children[i3];
        if (a2.type !== "file") throw new p3("EISDIR", "Is a directory");
        if (delete c2.children[i3], t2) {
          let h3 = h(this, m3).get(a2.backingFilename);
          h3?.truncate(0), h(this, S2).add(h3), h(this, D3).has(e) && (h(this, P3).delete(h(this, D3).get(e)), h(this, D3).delete(e));
        }
        this.state.pool.push(a2.backingFilename);
      }
      utimes(e, t2, o4) {
        T(this, n2, O3).call(this, { opp: "utimes", args: [e, t2, o4] }, () => {
          this._utimesState(e, t2, o4);
        });
      }
      _utimesState(e, t2, o4) {
        let i3 = T(this, n2, f2).call(this, e);
        i3.lastModified = o4;
      }
      writeFile(e, t2, o4) {
        let i3 = T(this, n2, w3).call(this, e), c2 = i3.pop(), a2 = T(this, n2, f2).call(this, i3.join("/"));
        if (Object.prototype.hasOwnProperty.call(a2.children, c2)) {
          let l3 = a2.children[c2];
          l3.lastModified = Date.now(), T(this, n2, k3).call(this, { opp: "setLastModified", args: [e, l3.lastModified] });
        } else {
          if (this.state.pool.length === 0) throw new Error("No more file handles available in the pool");
          let l3 = { type: "file", lastModified: Date.now(), mode: o4?.mode || T4.FILE, backingFilename: this.state.pool.pop() };
          a2.children[c2] = l3, T(this, n2, k3).call(this, { opp: "createFileNode", args: [e, l3] });
        }
        let h3 = a2.children[c2], d2 = h(this, m3).get(h3.backingFilename);
        t2.length > 0 && (d2.write(typeof t2 == "string" ? new TextEncoder().encode(t2) : new Uint8Array(t2), { at: 0 }), e.startsWith("/pg_wal") && h(this, S2).add(d2));
      }
      _createFileNodeState(e, t2) {
        let o4 = T(this, n2, w3).call(this, e), i3 = o4.pop(), c2 = T(this, n2, f2).call(this, o4.join("/"));
        c2.children[i3] = t2;
        let a2 = this.state.pool.indexOf(t2.backingFilename);
        return a2 > -1 && this.state.pool.splice(a2, 1), t2;
      }
      _setLastModifiedState(e, t2) {
        let o4 = T(this, n2, f2).call(this, e);
        o4.lastModified = t2;
      }
      write(e, t2, o4, i3, c2) {
        let a2 = T(this, n2, I).call(this, e), h3 = T(this, n2, f2).call(this, a2);
        if (h3.type !== "file") throw new p3("EISDIR", "Is a directory");
        let d2 = h(this, m3).get(h3.backingFilename);
        if (!d2) throw new p3("EBADF", "Bad file descriptor");
        let l3 = d2.write(new Uint8Array(t2, o4, i3), { at: c2 });
        return a2.startsWith("/pg_wal") && h(this, S2).add(d2), l3;
      }
    };
    H3 = /* @__PURE__ */ new WeakMap(), v2 = /* @__PURE__ */ new WeakMap(), F3 = /* @__PURE__ */ new WeakMap(), M = /* @__PURE__ */ new WeakMap(), y3 = /* @__PURE__ */ new WeakMap(), b2 = /* @__PURE__ */ new WeakMap(), m3 = /* @__PURE__ */ new WeakMap(), x5 = /* @__PURE__ */ new WeakMap(), P3 = /* @__PURE__ */ new WeakMap(), D3 = /* @__PURE__ */ new WeakMap(), S2 = /* @__PURE__ */ new WeakMap(), n2 = /* @__PURE__ */ new WeakSet(), C3 = async function() {
      x(this, H3, await navigator.storage.getDirectory()), x(this, v2, await T(this, n2, j2).call(this, this.dataDir, { create: true })), x(this, F3, await T(this, n2, j2).call(this, G2, { from: h(this, v2), create: true })), x(this, M, await h(this, v2).getFileHandle($2, { create: true })), x(this, y3, await h(this, M).createSyncAccessHandle());
      let e = new ArrayBuffer(h(this, y3).getSize());
      h(this, y3).read(e, { at: 0 });
      let t2, o4 = new TextDecoder().decode(e).split(`
`), i3 = false;
      try {
        t2 = JSON.parse(o4[0]);
      } catch {
        t2 = { root: { type: "directory", lastModified: Date.now(), mode: T4.DIR, children: {} }, pool: [] }, h(this, y3).truncate(0), h(this, y3).write(new TextEncoder().encode(JSON.stringify(t2)), { at: 0 }), i3 = true;
      }
      this.state = t2;
      let c2 = o4.slice(1).filter(Boolean).map((l3) => JSON.parse(l3));
      for (let l3 of c2) {
        let u2 = `_${l3.opp}State`;
        if (typeof this[u2] == "function") try {
          this[u2].bind(this)(...l3.args);
        } catch (N3) {
          console.warn("Error applying OPFS AHP WAL entry", l3, N3);
        }
      }
      let a2 = [], h3 = async (l3) => {
        if (l3.type === "file") try {
          let u2 = await h(this, F3).getFileHandle(l3.backingFilename), N3 = await u2.createSyncAccessHandle();
          h(this, b2).set(l3.backingFilename, u2), h(this, m3).set(l3.backingFilename, N3);
        } catch (u2) {
          console.error("Error opening file handle for node", l3, u2);
        }
        else for (let u2 of Object.values(l3.children)) a2.push(h3(u2));
      };
      await h3(this.state.root);
      let d2 = [];
      for (let l3 of this.state.pool) d2.push(new Promise(async (u2) => {
        h(this, b2).has(l3) && console.warn("File handle already exists for pool file", l3);
        let N3 = await h(this, F3).getFileHandle(l3), U3 = await N3.createSyncAccessHandle();
        h(this, b2).set(l3, N3), h(this, m3).set(l3, U3), u2();
      }));
      await Promise.all([...a2, ...d2]), await this.maintainPool(i3 ? this.initialPoolSize : this.maintainedPoolSize);
    }, O3 = function(e, t2) {
      let o4 = T(this, n2, k3).call(this, e);
      try {
        t2();
      } catch (i3) {
        throw h(this, y3).truncate(o4), i3;
      }
    }, k3 = function(e) {
      let t2 = JSON.stringify(e), o4 = new TextEncoder().encode(`
${t2}`), i3 = h(this, y3).getSize();
      return h(this, y3).write(o4, { at: i3 }), h(this, S2).add(h(this, y3)), i3;
    }, w3 = function(e) {
      return e.split("/").filter(Boolean);
    }, f2 = function(e, t2) {
      let o4 = T(this, n2, w3).call(this, e), i3 = t2 || this.state.root;
      for (let c2 of o4) {
        if (i3.type !== "directory") throw new p3("ENOTDIR", "Not a directory");
        if (!Object.prototype.hasOwnProperty.call(i3.children, c2)) throw new p3("ENOENT", "No such file or directory");
        i3 = i3.children[c2];
      }
      return i3;
    }, I = function(e) {
      let t2 = h(this, P3).get(e);
      if (!t2) throw new p3("EBADF", "Bad file descriptor");
      return t2;
    }, W2 = function() {
      let e = ++U(this, x5)._;
      for (; h(this, P3).has(e); ) U(this, x5)._++;
      return e;
    }, j2 = async function(e, t2) {
      let o4 = T(this, n2, w3).call(this, e), i3 = t2?.from || h(this, H3);
      for (let c2 of o4) i3 = await i3.getDirectoryHandle(c2, { create: t2?.create });
      return i3;
    };
    p3 = class extends Error {
      constructor(A2, e) {
        super(e), typeof A2 == "number" ? this.code = A2 : typeof A2 == "string" && (this.code = pr[A2]);
      }
    };
  }
});

// node_modules/.pnpm/@electric-sql+pglite@0.3.16/node_modules/@electric-sql/pglite/dist/index.js
var dist_exports = {};
__export(dist_exports, {
  IdbFs: () => ce3,
  MemoryFS: () => ge2,
  Mutex: () => Y2,
  PGlite: () => We2,
  formatQuery: () => Pr,
  messages: () => Ue,
  parse: () => wn,
  protocol: () => zn,
  types: () => hn,
  uuid: () => Cr
});
async function Fe2(e) {
  if (Fe) {
    let t2 = await import("fs"), r = await import("zlib"), { Writable: a2 } = await import("stream"), { pipeline: o4 } = await import("stream/promises");
    if (!t2.existsSync(e)) throw new Error(`Extension bundle not found: ${e}`);
    let s4 = r.createGunzip(), _3 = [];
    return await o4(t2.createReadStream(e), s4, new a2({ write(n3, l3, d2) {
      _3.push(n3), d2();
    } })), new Blob(_3);
  } else {
    let t2 = await fetch(e.toString());
    if (!t2.ok || !t2.body) return null;
    if (t2.headers.get("Content-Encoding") === "gzip") return t2.blob();
    {
      let r = new DecompressionStream("gzip");
      return new Response(t2.body.pipeThrough(r)).blob();
    }
  }
}
async function Be2(e, t2) {
  for (let r in e.pg_extensions) {
    let a2;
    try {
      a2 = await e.pg_extensions[r];
    } catch (o4) {
      console.error("Failed to fetch extension:", r, o4);
      continue;
    }
    if (a2) {
      let o4 = new Uint8Array(await a2.arrayBuffer());
      it2(e, r, o4, t2);
    } else console.error("Could not get binary data for extension:", r);
  }
}
function it2(e, t2, r, a2) {
  Le2.default.untar(r).forEach((s4) => {
    if (!s4.name.startsWith(".")) {
      let _3 = e.WASM_PREFIX + "/" + s4.name;
      if (s4.name.endsWith(".so")) {
        let n3 = (...d2) => {
          a2("pgfs:ext OK", _3, d2);
        }, l3 = (...d2) => {
          a2("pgfs:ext FAIL", _3, d2);
        };
        e.FS.createPreloadedFile(lt2(_3), s4.name.split("/").pop().slice(0, -3), s4.data, true, true, n3, l3, false);
      } else try {
        let n3 = _3.substring(0, _3.lastIndexOf("/"));
        e.FS.analyzePath(n3).exists === false && e.FS.mkdirTree(n3), e.FS.writeFile(_3, s4.data);
      } catch (n3) {
        console.error(`Error writing file ${_3}`, n3);
      }
    }
  });
}
function lt2(e) {
  let t2 = e.lastIndexOf("/");
  return t2 > 0 ? e.slice(0, t2) : e;
}
function Ge2(e) {
  let t2;
  if (e?.startsWith("file://")) {
    if (e = e.slice(7), !e) throw new Error("Invalid dataDir, must be a valid path");
    t2 = "nodefs";
  } else e?.startsWith("idb://") ? (e = e.slice(6), t2 = "idbfs") : e?.startsWith("opfs-ahp://") ? (e = e.slice(11), t2 = "opfs-ahp") : !e || e?.startsWith("memory://") ? t2 = "memoryfs" : t2 = "nodefs";
  return { dataDir: e, fsType: t2 };
}
async function Ue2(e, t2) {
  let r;
  if (e && t2 === "nodefs") {
    let { NodeFS: a2 } = await Promise.resolve().then(() => (init_nodefs(), nodefs_exports));
    r = new a2(e);
  } else if (e && t2 === "idbfs") r = new ce3(e);
  else if (e && t2 === "opfs-ahp") {
    let { OpfsAhpFS: a2 } = await Promise.resolve().then(() => (init_opfs_ahp(), opfs_ahp_exports));
    r = new a2(e);
  } else r = new ge2();
  return r;
}
var import_meta2, pt2, mt2, st2, _t2, ke2, nt2, Y2, Le2, ce3, ge2, dt2, He2, je2, _e2, te2, re2, ne2, ie, xe2, we2, Se2, ye2, le2, de2, Me2, pe2, ae, Q2, I2, oe, me2, B, $3, K2, ue2, se2, J2, N2, Z2, R3, G3, C4, Ve2, Xe2, fe2, Ke2, Ye2, L5, We2;
var init_dist = __esm({
  "node_modules/.pnpm/@electric-sql+pglite@0.3.16/node_modules/@electric-sql/pglite/dist/index.js"() {
    init_chunk_F2DQ4FIK();
    init_chunk_VBDAOXYI();
    init_chunk_3WWIVTCY();
    init_chunk_F4GETNPB();
    init_chunk_QY3QWFKW();
    import_meta2 = {};
    u();
    u();
    u();
    pt2 = new Error("timeout while waiting for mutex to become available");
    mt2 = new Error("mutex already locked");
    st2 = new Error("request for lock canceled");
    _t2 = function(e, t2, r, a2) {
      function o4(s4) {
        return s4 instanceof r ? s4 : new r(function(_3) {
          _3(s4);
        });
      }
      return new (r || (r = Promise))(function(s4, _3) {
        function n3(p4) {
          try {
            d2(a2.next(p4));
          } catch (m4) {
            _3(m4);
          }
        }
        function l3(p4) {
          try {
            d2(a2.throw(p4));
          } catch (m4) {
            _3(m4);
          }
        }
        function d2(p4) {
          p4.done ? s4(p4.value) : o4(p4.value).then(n3, l3);
        }
        d2((a2 = a2.apply(e, t2 || [])).next());
      });
    };
    ke2 = class {
      constructor(t2, r = st2) {
        this._value = t2, this._cancelError = r, this._weightedQueues = [], this._weightedWaiters = [];
      }
      acquire(t2 = 1) {
        if (t2 <= 0) throw new Error(`invalid weight ${t2}: must be positive`);
        return new Promise((r, a2) => {
          this._weightedQueues[t2 - 1] || (this._weightedQueues[t2 - 1] = []), this._weightedQueues[t2 - 1].push({ resolve: r, reject: a2 }), this._dispatch();
        });
      }
      runExclusive(t2, r = 1) {
        return _t2(this, void 0, void 0, function* () {
          let [a2, o4] = yield this.acquire(r);
          try {
            return yield t2(a2);
          } finally {
            o4();
          }
        });
      }
      waitForUnlock(t2 = 1) {
        if (t2 <= 0) throw new Error(`invalid weight ${t2}: must be positive`);
        return new Promise((r) => {
          this._weightedWaiters[t2 - 1] || (this._weightedWaiters[t2 - 1] = []), this._weightedWaiters[t2 - 1].push(r), this._dispatch();
        });
      }
      isLocked() {
        return this._value <= 0;
      }
      getValue() {
        return this._value;
      }
      setValue(t2) {
        this._value = t2, this._dispatch();
      }
      release(t2 = 1) {
        if (t2 <= 0) throw new Error(`invalid weight ${t2}: must be positive`);
        this._value += t2, this._dispatch();
      }
      cancel() {
        this._weightedQueues.forEach((t2) => t2.forEach((r) => r.reject(this._cancelError))), this._weightedQueues = [];
      }
      _dispatch() {
        var t2;
        for (let r = this._value; r > 0; r--) {
          let a2 = (t2 = this._weightedQueues[r - 1]) === null || t2 === void 0 ? void 0 : t2.shift();
          if (!a2) continue;
          let o4 = this._value, s4 = r;
          this._value -= r, r = this._value + 1, a2.resolve([o4, this._newReleaser(s4)]);
        }
        this._drainUnlockWaiters();
      }
      _newReleaser(t2) {
        let r = false;
        return () => {
          r || (r = true, this.release(t2));
        };
      }
      _drainUnlockWaiters() {
        for (let t2 = this._value; t2 > 0; t2--) this._weightedWaiters[t2 - 1] && (this._weightedWaiters[t2 - 1].forEach((r) => r()), this._weightedWaiters[t2 - 1] = []);
      }
    };
    nt2 = function(e, t2, r, a2) {
      function o4(s4) {
        return s4 instanceof r ? s4 : new r(function(_3) {
          _3(s4);
        });
      }
      return new (r || (r = Promise))(function(s4, _3) {
        function n3(p4) {
          try {
            d2(a2.next(p4));
          } catch (m4) {
            _3(m4);
          }
        }
        function l3(p4) {
          try {
            d2(a2.throw(p4));
          } catch (m4) {
            _3(m4);
          }
        }
        function d2(p4) {
          p4.done ? s4(p4.value) : o4(p4.value).then(n3, l3);
        }
        d2((a2 = a2.apply(e, t2 || [])).next());
      });
    };
    Y2 = class {
      constructor(t2) {
        this._semaphore = new ke2(1, t2);
      }
      acquire() {
        return nt2(this, void 0, void 0, function* () {
          let [, t2] = yield this._semaphore.acquire();
          return t2;
        });
      }
      runExclusive(t2) {
        return this._semaphore.runExclusive(() => t2());
      }
      isLocked() {
        return this._semaphore.isLocked();
      }
      waitForUnlock() {
        return this._semaphore.waitForUnlock();
      }
      release() {
        this._semaphore.isLocked() && this._semaphore.release();
      }
      cancel() {
        return this._semaphore.cancel();
      }
    };
    u();
    Le2 = L(or(), 1);
    u();
    u();
    ce3 = class extends ur {
      async init(t2, r) {
        return this.pg = t2, { emscriptenOpts: { ...r, preRun: [...r.preRun || [], (o4) => {
          let s4 = o4.FS.filesystems.IDBFS;
          o4.FS.mkdir("/pglite"), o4.FS.mkdir(`/pglite/${this.dataDir}`), o4.FS.mount(s4, {}, `/pglite/${this.dataDir}`), o4.FS.symlink(`/pglite/${this.dataDir}`, C2);
        }] } };
      }
      initialSyncFs() {
        return new Promise((t2, r) => {
          this.pg.Module.FS.syncfs(true, (a2) => {
            a2 ? r(a2) : t2();
          });
        });
      }
      syncToFs(t2) {
        return new Promise((r, a2) => {
          this.pg.Module.FS.syncfs(false, (o4) => {
            o4 ? a2(o4) : r();
          });
        });
      }
      async closeFs() {
        let t2 = this.pg.Module.FS.filesystems.IDBFS.dbs[this.dataDir];
        t2 && t2.close(), this.pg.Module.FS.quit();
      }
    };
    u();
    ge2 = class extends ur {
      async closeFs() {
        this.pg.Module.FS.quit();
      }
    };
    u();
    u();
    dt2 = (() => {
      var _scriptName = import_meta2.url;
      return async function(moduleArg = {}) {
        var moduleRtn, Module = moduleArg, readyPromiseResolve, readyPromiseReject, readyPromise = new Promise((e, t2) => {
          readyPromiseResolve = e, readyPromiseReject = t2;
        }), ENVIRONMENT_IS_WEB = typeof window == "object", ENVIRONMENT_IS_WORKER = typeof WorkerGlobalScope < "u", ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string" && process.type != "renderer";
        if (ENVIRONMENT_IS_NODE) {
          let { createRequire: e } = await import("module"), t2 = import_meta2.url;
          t2.startsWith("data:") && (t2 = "/");
          var require = e(t2);
        }
        Module.expectedDataFileDownloads ?? (Module.expectedDataFileDownloads = 0), Module.expectedDataFileDownloads++, (() => {
          var e = typeof ENVIRONMENT_IS_PTHREAD < "u" && ENVIRONMENT_IS_PTHREAD, t2 = typeof ENVIRONMENT_IS_WASM_WORKER < "u" && ENVIRONMENT_IS_WASM_WORKER;
          if (e || t2) return;
          var r = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
          function a2(o4) {
            var s4 = "";
            typeof window == "object" ? s4 = window.encodeURIComponent(window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")) + "/") : typeof process > "u" && typeof location < "u" && (s4 = encodeURIComponent(location.pathname.substring(0, location.pathname.lastIndexOf("/")) + "/"));
            var _3 = "pglite.data", n3 = "pglite.data", l3 = Module.locateFile ? Module.locateFile(n3, "") : n3, d2 = o4.remote_package_size;
            function p4(c2, w4, x6, S3) {
              if (r) {
                require("fs").readFile(c2, (h3, b3) => {
                  h3 ? S3(h3) : x6(b3.buffer);
                });
                return;
              }
              Module.dataFileDownloads ?? (Module.dataFileDownloads = {}), fetch(c2).catch((h3) => Promise.reject(new Error(`Network Error: ${c2}`, { cause: h3 }))).then((h3) => {
                if (!h3.ok) return Promise.reject(new Error(`${h3.status}: ${h3.url}`));
                if (!h3.body && h3.arrayBuffer) return h3.arrayBuffer().then(x6);
                let b3 = h3.body.getReader(), v3 = () => b3.read().then(ee2).catch((O4) => Promise.reject(new Error(`Unexpected error while handling : ${h3.url} ${O4}`, { cause: O4 }))), y4 = [], k4 = h3.headers, q2 = Number(k4.get("Content-Length") ?? w4), U3 = 0, ee2 = ({ done: O4, value: H4 }) => {
                  if (O4) {
                    let T5 = new Uint8Array(y4.map((A2) => A2.length).reduce((A2, Qe2) => A2 + Qe2, 0)), D4 = 0;
                    for (let A2 of y4) T5.set(A2, D4), D4 += A2.length;
                    x6(T5.buffer);
                  } else {
                    y4.push(H4), U3 += H4.length, Module.dataFileDownloads[c2] = { loaded: U3, total: q2 };
                    let T5 = 0, D4 = 0;
                    for (let A2 of Object.values(Module.dataFileDownloads)) T5 += A2.loaded, D4 += A2.total;
                    return Module.setStatus?.(`Downloading data... (${T5}/${D4})`), v3();
                  }
                };
                return Module.setStatus?.("Downloading data..."), v3();
              });
            }
            function m4(c2) {
              console.error("package error:", c2);
            }
            var g5 = null, u2 = Module.getPreloadedPackage ? Module.getPreloadedPackage(l3, d2) : null;
            u2 || p4(l3, d2, (c2) => {
              g5 ? (g5(c2), g5 = null) : u2 = c2;
            }, m4);
            function f3(c2) {
              function w4(v3, y4) {
                if (!v3) throw y4 + new Error().stack;
              }
              c2.FS_createPath("/", "home", true, true), c2.FS_createPath("/home", "web_user", true, true), c2.FS_createPath("/", "tmp", true, true), c2.FS_createPath("/tmp", "pglite", true, true), c2.FS_createPath("/tmp/pglite", "bin", true, true), c2.FS_createPath("/tmp/pglite", "lib", true, true), c2.FS_createPath("/tmp/pglite/lib", "postgresql", true, true), c2.FS_createPath("/tmp/pglite/lib/postgresql", "pgxs", true, true), c2.FS_createPath("/tmp/pglite/lib/postgresql/pgxs", "config", true, true), c2.FS_createPath("/tmp/pglite/lib/postgresql/pgxs", "src", true, true), c2.FS_createPath("/tmp/pglite/lib/postgresql/pgxs/src", "makefiles", true, true), c2.FS_createPath("/tmp/pglite", "share", true, true), c2.FS_createPath("/tmp/pglite/share", "postgresql", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql", "extension", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql", "timezone", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Africa", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "America", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql/timezone/America", "Argentina", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql/timezone/America", "Indiana", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql/timezone/America", "Kentucky", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql/timezone/America", "North_Dakota", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Antarctica", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Arctic", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Asia", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Atlantic", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Australia", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Brazil", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Canada", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Chile", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Etc", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Europe", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Indian", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Mexico", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "Pacific", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql/timezone", "US", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql", "timezonesets", true, true), c2.FS_createPath("/tmp/pglite/share/postgresql", "tsearch_data", true, true);
              function x6(v3, y4, k4) {
                this.start = v3, this.end = y4, this.audio = k4;
              }
              x6.prototype = { requests: {}, open: function(v3, y4) {
                this.name = y4, this.requests[y4] = this, c2.addRunDependency(`fp ${this.name}`);
              }, send: function() {
              }, onload: function() {
                var v3 = this.byteArray.subarray(this.start, this.end);
                this.finish(v3);
              }, finish: function(v3) {
                var y4 = this;
                c2.FS_createDataFile(this.name, null, v3, true, true, true), c2.removeRunDependency(`fp ${y4.name}`), this.requests[this.name] = null;
              } };
              for (var S3 = o4.files, h3 = 0; h3 < S3.length; ++h3) new x6(S3[h3].start, S3[h3].end, S3[h3].audio || 0).open("GET", S3[h3].filename);
              function b3(v3) {
                w4(v3, "Loading data file failed."), w4(v3.constructor.name === ArrayBuffer.name, "bad input to processPackageData");
                var y4 = new Uint8Array(v3);
                x6.prototype.byteArray = y4;
                for (var k4 = o4.files, q2 = 0; q2 < k4.length; ++q2) x6.prototype.requests[k4[q2].filename].onload();
                c2.removeRunDependency("datafile_pglite.data");
              }
              c2.addRunDependency("datafile_pglite.data"), c2.preloadResults ?? (c2.preloadResults = {}), c2.preloadResults[_3] = { fromCache: false }, u2 ? (b3(u2), u2 = null) : g5 = b3;
            }
            Module.calledRun ? f3(Module) : (Module.preRun ?? (Module.preRun = [])).push(f3);
          }
          a2({ files: [{ filename: "/home/web_user/.pgpass", start: 0, end: 204 }, { filename: "/tmp/pglite/bin/initdb", start: 204, end: 223 }, { filename: "/tmp/pglite/bin/postgres", start: 223, end: 242 }, { filename: "/tmp/pglite/lib/postgresql/cyrillic_and_mic.so", start: 242, end: 4736 }, { filename: "/tmp/pglite/lib/postgresql/dict_snowball.so", start: 4736, end: 577939 }, { filename: "/tmp/pglite/lib/postgresql/euc2004_sjis2004.so", start: 577939, end: 580012 }, { filename: "/tmp/pglite/lib/postgresql/euc_cn_and_mic.so", start: 580012, end: 580953 }, { filename: "/tmp/pglite/lib/postgresql/euc_jp_and_sjis.so", start: 580953, end: 588213 }, { filename: "/tmp/pglite/lib/postgresql/euc_kr_and_mic.so", start: 588213, end: 589164 }, { filename: "/tmp/pglite/lib/postgresql/euc_tw_and_big5.so", start: 589164, end: 593722 }, { filename: "/tmp/pglite/lib/postgresql/latin2_and_win1250.so", start: 593722, end: 595128 }, { filename: "/tmp/pglite/lib/postgresql/latin_and_mic.so", start: 595128, end: 596149 }, { filename: "/tmp/pglite/lib/postgresql/libpqwalreceiver.so", start: 596149, end: 717020 }, { filename: "/tmp/pglite/lib/postgresql/pgoutput.so", start: 717020, end: 730469 }, { filename: "/tmp/pglite/lib/postgresql/pgxs/config/install-sh", start: 730469, end: 744466 }, { filename: "/tmp/pglite/lib/postgresql/pgxs/config/missing", start: 744466, end: 745814 }, { filename: "/tmp/pglite/lib/postgresql/pgxs/src/Makefile.global", start: 745814, end: 782478 }, { filename: "/tmp/pglite/lib/postgresql/pgxs/src/Makefile.port", start: 782478, end: 783331 }, { filename: "/tmp/pglite/lib/postgresql/pgxs/src/Makefile.shlib", start: 783331, end: 798759 }, { filename: "/tmp/pglite/lib/postgresql/pgxs/src/makefiles/pgxs.mk", start: 798759, end: 814724 }, { filename: "/tmp/pglite/lib/postgresql/pgxs/src/nls-global.mk", start: 814724, end: 821592 }, { filename: "/tmp/pglite/lib/postgresql/plpgsql.so", start: 821592, end: 973259 }, { filename: "/tmp/pglite/lib/postgresql/utf8_and_big5.so", start: 973259, end: 1088007 }, { filename: "/tmp/pglite/lib/postgresql/utf8_and_cyrillic.so", start: 1088007, end: 1093981 }, { filename: "/tmp/pglite/lib/postgresql/utf8_and_euc2004.so", start: 1093981, end: 1298913 }, { filename: "/tmp/pglite/lib/postgresql/utf8_and_euc_cn.so", start: 1298913, end: 1374093 }, { filename: "/tmp/pglite/lib/postgresql/utf8_and_euc_jp.so", start: 1374093, end: 1525321 }, { filename: "/tmp/pglite/lib/postgresql/utf8_and_euc_kr.so", start: 1525321, end: 1628177 }, { filename: "/tmp/pglite/lib/postgresql/utf8_and_euc_tw.so", start: 1628177, end: 1827733 }, { filename: "/tmp/pglite/lib/postgresql/utf8_and_gb18030.so", start: 1827733, end: 2090110 }, { filename: "/tmp/pglite/lib/postgresql/utf8_and_gbk.so", start: 2090110, end: 2236642 }, { filename: "/tmp/pglite/lib/postgresql/utf8_and_iso8859.so", start: 2236642, end: 2260217 }, { filename: "/tmp/pglite/lib/postgresql/utf8_and_iso8859_1.so", start: 2260217, end: 2261189 }, { filename: "/tmp/pglite/lib/postgresql/utf8_and_johab.so", start: 2261189, end: 2422893 }, { filename: "/tmp/pglite/lib/postgresql/utf8_and_sjis.so", start: 2422893, end: 2504553 }, { filename: "/tmp/pglite/lib/postgresql/utf8_and_sjis2004.so", start: 2504553, end: 2631185 }, { filename: "/tmp/pglite/lib/postgresql/utf8_and_uhc.so", start: 2631185, end: 2798457 }, { filename: "/tmp/pglite/lib/postgresql/utf8_and_win.so", start: 2798457, end: 2824959 }, { filename: "/tmp/pglite/password", start: 2824959, end: 2824968 }, { filename: "/tmp/pglite/share/postgresql/errcodes.txt", start: 2824968, end: 2858360 }, { filename: "/tmp/pglite/share/postgresql/extension/plpgsql--1.0.sql", start: 2858360, end: 2859018 }, { filename: "/tmp/pglite/share/postgresql/extension/plpgsql.control", start: 2859018, end: 2859211 }, { filename: "/tmp/pglite/share/postgresql/information_schema.sql", start: 2859211, end: 2974734 }, { filename: "/tmp/pglite/share/postgresql/pg_hba.conf.sample", start: 2974734, end: 2980359 }, { filename: "/tmp/pglite/share/postgresql/pg_ident.conf.sample", start: 2980359, end: 2982999 }, { filename: "/tmp/pglite/share/postgresql/pg_service.conf.sample", start: 2982999, end: 2983603 }, { filename: "/tmp/pglite/share/postgresql/postgres.bki", start: 2983603, end: 3936871 }, { filename: "/tmp/pglite/share/postgresql/postgresql.conf.sample", start: 3936871, end: 3967533 }, { filename: "/tmp/pglite/share/postgresql/psqlrc.sample", start: 3967533, end: 3967811 }, { filename: "/tmp/pglite/share/postgresql/snowball_create.sql", start: 3967811, end: 4011987 }, { filename: "/tmp/pglite/share/postgresql/sql_features.txt", start: 4011987, end: 4047720 }, { filename: "/tmp/pglite/share/postgresql/system_constraints.sql", start: 4047720, end: 4056615 }, { filename: "/tmp/pglite/share/postgresql/system_functions.sql", start: 4056615, end: 4080918 }, { filename: "/tmp/pglite/share/postgresql/system_views.sql", start: 4080918, end: 4132612 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Abidjan", start: 4132612, end: 4132760 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Accra", start: 4132760, end: 4132908 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Addis_Ababa", start: 4132908, end: 4133173 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Algiers", start: 4133173, end: 4133908 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Asmara", start: 4133908, end: 4134173 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Asmera", start: 4134173, end: 4134438 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Bamako", start: 4134438, end: 4134586 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Bangui", start: 4134586, end: 4134821 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Banjul", start: 4134821, end: 4134969 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Bissau", start: 4134969, end: 4135163 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Blantyre", start: 4135163, end: 4135312 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Brazzaville", start: 4135312, end: 4135547 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Bujumbura", start: 4135547, end: 4135696 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Cairo", start: 4135696, end: 4138095 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Casablanca", start: 4138095, end: 4140524 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Ceuta", start: 4140524, end: 4142576 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Conakry", start: 4142576, end: 4142724 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Dakar", start: 4142724, end: 4142872 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Dar_es_Salaam", start: 4142872, end: 4143137 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Djibouti", start: 4143137, end: 4143402 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Douala", start: 4143402, end: 4143637 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/El_Aaiun", start: 4143637, end: 4145932 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Freetown", start: 4145932, end: 4146080 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Gaborone", start: 4146080, end: 4146229 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Harare", start: 4146229, end: 4146378 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Johannesburg", start: 4146378, end: 4146624 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Juba", start: 4146624, end: 4147303 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Kampala", start: 4147303, end: 4147568 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Khartoum", start: 4147568, end: 4148247 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Kigali", start: 4148247, end: 4148396 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Kinshasa", start: 4148396, end: 4148631 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Lagos", start: 4148631, end: 4148866 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Libreville", start: 4148866, end: 4149101 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Lome", start: 4149101, end: 4149249 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Luanda", start: 4149249, end: 4149484 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Lubumbashi", start: 4149484, end: 4149633 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Lusaka", start: 4149633, end: 4149782 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Malabo", start: 4149782, end: 4150017 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Maputo", start: 4150017, end: 4150166 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Maseru", start: 4150166, end: 4150412 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Mbabane", start: 4150412, end: 4150658 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Mogadishu", start: 4150658, end: 4150923 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Monrovia", start: 4150923, end: 4151131 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Nairobi", start: 4151131, end: 4151396 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Ndjamena", start: 4151396, end: 4151595 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Niamey", start: 4151595, end: 4151830 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Nouakchott", start: 4151830, end: 4151978 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Ouagadougou", start: 4151978, end: 4152126 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Porto-Novo", start: 4152126, end: 4152361 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Sao_Tome", start: 4152361, end: 4152615 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Timbuktu", start: 4152615, end: 4152763 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Tripoli", start: 4152763, end: 4153388 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Tunis", start: 4153388, end: 4154077 }, { filename: "/tmp/pglite/share/postgresql/timezone/Africa/Windhoek", start: 4154077, end: 4155032 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Adak", start: 4155032, end: 4157388 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Anchorage", start: 4157388, end: 4159759 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Anguilla", start: 4159759, end: 4160005 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Antigua", start: 4160005, end: 4160251 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Araguaina", start: 4160251, end: 4161135 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/Buenos_Aires", start: 4161135, end: 4162211 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/Catamarca", start: 4162211, end: 4163287 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/ComodRivadavia", start: 4163287, end: 4164363 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/Cordoba", start: 4164363, end: 4165439 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/Jujuy", start: 4165439, end: 4166487 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/La_Rioja", start: 4166487, end: 4167577 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/Mendoza", start: 4167577, end: 4168653 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/Rio_Gallegos", start: 4168653, end: 4169729 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/Salta", start: 4169729, end: 4170777 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/San_Juan", start: 4170777, end: 4171867 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/San_Luis", start: 4171867, end: 4172969 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/Tucuman", start: 4172969, end: 4174073 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Argentina/Ushuaia", start: 4174073, end: 4175149 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Aruba", start: 4175149, end: 4175395 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Asuncion", start: 4175395, end: 4177053 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Atikokan", start: 4177053, end: 4177235 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Atka", start: 4177235, end: 4179591 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Bahia", start: 4179591, end: 4180615 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Bahia_Banderas", start: 4180615, end: 4181715 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Barbados", start: 4181715, end: 4182151 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Belem", start: 4182151, end: 4182727 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Belize", start: 4182727, end: 4184341 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Blanc-Sablon", start: 4184341, end: 4184587 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Boa_Vista", start: 4184587, end: 4185219 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Bogota", start: 4185219, end: 4185465 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Boise", start: 4185465, end: 4187875 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Buenos_Aires", start: 4187875, end: 4188951 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Cambridge_Bay", start: 4188951, end: 4191205 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Campo_Grande", start: 4191205, end: 4192649 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Cancun", start: 4192649, end: 4193513 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Caracas", start: 4193513, end: 4193777 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Catamarca", start: 4193777, end: 4194853 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Cayenne", start: 4194853, end: 4195051 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Cayman", start: 4195051, end: 4195233 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Chicago", start: 4195233, end: 4198825 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Chihuahua", start: 4198825, end: 4199927 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Ciudad_Juarez", start: 4199927, end: 4201465 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Coral_Harbour", start: 4201465, end: 4201647 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Cordoba", start: 4201647, end: 4202723 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Costa_Rica", start: 4202723, end: 4203039 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Coyhaique", start: 4203039, end: 4205179 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Creston", start: 4205179, end: 4205539 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Cuiaba", start: 4205539, end: 4206955 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Curacao", start: 4206955, end: 4207201 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Danmarkshavn", start: 4207201, end: 4207899 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Dawson", start: 4207899, end: 4209513 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Dawson_Creek", start: 4209513, end: 4210563 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Denver", start: 4210563, end: 4213023 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Detroit", start: 4213023, end: 4215253 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Dominica", start: 4215253, end: 4215499 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Edmonton", start: 4215499, end: 4217831 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Eirunepe", start: 4217831, end: 4218487 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/El_Salvador", start: 4218487, end: 4218711 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Ensenada", start: 4218711, end: 4221169 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Fort_Nelson", start: 4221169, end: 4223409 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Fort_Wayne", start: 4223409, end: 4225091 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Fortaleza", start: 4225091, end: 4225807 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Glace_Bay", start: 4225807, end: 4227999 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Godthab", start: 4227999, end: 4229902 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Goose_Bay", start: 4229902, end: 4233112 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Grand_Turk", start: 4233112, end: 4234946 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Grenada", start: 4234946, end: 4235192 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Guadeloupe", start: 4235192, end: 4235438 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Guatemala", start: 4235438, end: 4235718 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Guayaquil", start: 4235718, end: 4235964 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Guyana", start: 4235964, end: 4236226 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Halifax", start: 4236226, end: 4239650 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Havana", start: 4239650, end: 4242066 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Hermosillo", start: 4242066, end: 4242454 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Indiana/Indianapolis", start: 4242454, end: 4244136 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Indiana/Knox", start: 4244136, end: 4246580 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Indiana/Marengo", start: 4246580, end: 4248318 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Indiana/Petersburg", start: 4248318, end: 4250238 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Indiana/Tell_City", start: 4250238, end: 4251938 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Indiana/Vevay", start: 4251938, end: 4253368 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Indiana/Vincennes", start: 4253368, end: 4255078 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Indiana/Winamac", start: 4255078, end: 4256872 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Indianapolis", start: 4256872, end: 4258554 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Inuvik", start: 4258554, end: 4260628 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Iqaluit", start: 4260628, end: 4262830 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Jamaica", start: 4262830, end: 4263312 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Jujuy", start: 4263312, end: 4264360 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Juneau", start: 4264360, end: 4266713 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Kentucky/Louisville", start: 4266713, end: 4269501 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Kentucky/Monticello", start: 4269501, end: 4271869 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Knox_IN", start: 4271869, end: 4274313 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Kralendijk", start: 4274313, end: 4274559 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/La_Paz", start: 4274559, end: 4274791 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Lima", start: 4274791, end: 4275197 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Los_Angeles", start: 4275197, end: 4278049 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Louisville", start: 4278049, end: 4280837 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Lower_Princes", start: 4280837, end: 4281083 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Maceio", start: 4281083, end: 4281827 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Managua", start: 4281827, end: 4282257 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Manaus", start: 4282257, end: 4282861 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Marigot", start: 4282861, end: 4283107 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Martinique", start: 4283107, end: 4283339 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Matamoros", start: 4283339, end: 4284757 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Mazatlan", start: 4284757, end: 4285817 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Mendoza", start: 4285817, end: 4286893 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Menominee", start: 4286893, end: 4289167 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Merida", start: 4289167, end: 4290171 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Metlakatla", start: 4290171, end: 4291594 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Mexico_City", start: 4291594, end: 4292816 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Miquelon", start: 4292816, end: 4294482 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Moncton", start: 4294482, end: 4297636 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Monterrey", start: 4297636, end: 4298750 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Montevideo", start: 4298750, end: 4300260 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Montreal", start: 4300260, end: 4303754 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Montserrat", start: 4303754, end: 4304e3 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Nassau", start: 4304e3, end: 4307494 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/New_York", start: 4307494, end: 4311046 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Nipigon", start: 4311046, end: 4314540 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Nome", start: 4314540, end: 4316907 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Noronha", start: 4316907, end: 4317623 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/North_Dakota/Beulah", start: 4317623, end: 4320019 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/North_Dakota/Center", start: 4320019, end: 4322415 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/North_Dakota/New_Salem", start: 4322415, end: 4324811 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Nuuk", start: 4324811, end: 4326714 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Ojinaga", start: 4326714, end: 4328238 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Panama", start: 4328238, end: 4328420 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Pangnirtung", start: 4328420, end: 4330622 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Paramaribo", start: 4330622, end: 4330884 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Phoenix", start: 4330884, end: 4331244 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Port-au-Prince", start: 4331244, end: 4332678 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Port_of_Spain", start: 4332678, end: 4332924 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Porto_Acre", start: 4332924, end: 4333552 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Porto_Velho", start: 4333552, end: 4334128 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Puerto_Rico", start: 4334128, end: 4334374 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Punta_Arenas", start: 4334374, end: 4336290 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Rainy_River", start: 4336290, end: 4339158 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Rankin_Inlet", start: 4339158, end: 4341224 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Recife", start: 4341224, end: 4341940 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Regina", start: 4341940, end: 4342920 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Resolute", start: 4342920, end: 4344986 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Rio_Branco", start: 4344986, end: 4345614 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Rosario", start: 4345614, end: 4346690 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Santa_Isabel", start: 4346690, end: 4349148 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Santarem", start: 4349148, end: 4349750 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Santiago", start: 4349750, end: 4352279 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Santo_Domingo", start: 4352279, end: 4352737 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Sao_Paulo", start: 4352737, end: 4354181 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Scoresbysund", start: 4354181, end: 4356130 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Shiprock", start: 4356130, end: 4358590 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Sitka", start: 4358590, end: 4360919 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/St_Barthelemy", start: 4360919, end: 4361165 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/St_Johns", start: 4361165, end: 4364820 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/St_Kitts", start: 4364820, end: 4365066 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/St_Lucia", start: 4365066, end: 4365312 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/St_Thomas", start: 4365312, end: 4365558 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/St_Vincent", start: 4365558, end: 4365804 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Swift_Current", start: 4365804, end: 4366364 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Tegucigalpa", start: 4366364, end: 4366616 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Thule", start: 4366616, end: 4368118 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Thunder_Bay", start: 4368118, end: 4371612 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Tijuana", start: 4371612, end: 4374070 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Toronto", start: 4374070, end: 4377564 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Tortola", start: 4377564, end: 4377810 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Vancouver", start: 4377810, end: 4380702 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Virgin", start: 4380702, end: 4380948 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Whitehorse", start: 4380948, end: 4382562 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Winnipeg", start: 4382562, end: 4385430 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Yakutat", start: 4385430, end: 4387735 }, { filename: "/tmp/pglite/share/postgresql/timezone/America/Yellowknife", start: 4387735, end: 4390067 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/Casey", start: 4390067, end: 4390504 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/Davis", start: 4390504, end: 4390801 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/DumontDUrville", start: 4390801, end: 4390987 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/Macquarie", start: 4390987, end: 4393247 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/Mawson", start: 4393247, end: 4393446 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/McMurdo", start: 4393446, end: 4395883 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/Palmer", start: 4395883, end: 4397301 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/Rothera", start: 4397301, end: 4397465 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/South_Pole", start: 4397465, end: 4399902 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/Syowa", start: 4399902, end: 4400067 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/Troll", start: 4400067, end: 4401229 }, { filename: "/tmp/pglite/share/postgresql/timezone/Antarctica/Vostok", start: 4401229, end: 4401456 }, { filename: "/tmp/pglite/share/postgresql/timezone/Arctic/Longyearbyen", start: 4401456, end: 4403754 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Aden", start: 4403754, end: 4403919 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Almaty", start: 4403919, end: 4404916 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Amman", start: 4404916, end: 4406363 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Anadyr", start: 4406363, end: 4407551 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Aqtau", start: 4407551, end: 4408534 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Aqtobe", start: 4408534, end: 4409545 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Ashgabat", start: 4409545, end: 4410164 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Ashkhabad", start: 4410164, end: 4410783 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Atyrau", start: 4410783, end: 4411774 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Baghdad", start: 4411774, end: 4412757 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Bahrain", start: 4412757, end: 4412956 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Baku", start: 4412956, end: 4414183 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Bangkok", start: 4414183, end: 4414382 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Barnaul", start: 4414382, end: 4415603 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Beirut", start: 4415603, end: 4417757 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Bishkek", start: 4417757, end: 4418740 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Brunei", start: 4418740, end: 4419223 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Calcutta", start: 4419223, end: 4419508 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Chita", start: 4419508, end: 4420729 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Choibalsan", start: 4420729, end: 4421620 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Chongqing", start: 4421620, end: 4422181 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Chungking", start: 4422181, end: 4422742 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Colombo", start: 4422742, end: 4423114 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Dacca", start: 4423114, end: 4423451 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Damascus", start: 4423451, end: 4425338 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Dhaka", start: 4425338, end: 4425675 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Dili", start: 4425675, end: 4425946 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Dubai", start: 4425946, end: 4426111 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Dushanbe", start: 4426111, end: 4426702 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Famagusta", start: 4426702, end: 4428730 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Gaza", start: 4428730, end: 4432574 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Harbin", start: 4432574, end: 4433135 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Hebron", start: 4433135, end: 4437007 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Ho_Chi_Minh", start: 4437007, end: 4437358 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Hong_Kong", start: 4437358, end: 4438591 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Hovd", start: 4438591, end: 4439482 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Irkutsk", start: 4439482, end: 4440725 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Istanbul", start: 4440725, end: 4442672 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Jakarta", start: 4442672, end: 4443055 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Jayapura", start: 4443055, end: 4443276 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Jerusalem", start: 4443276, end: 4445664 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Kabul", start: 4445664, end: 4445872 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Kamchatka", start: 4445872, end: 4447038 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Karachi", start: 4447038, end: 4447417 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Kashgar", start: 4447417, end: 4447582 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Kathmandu", start: 4447582, end: 4447794 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Katmandu", start: 4447794, end: 4448006 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Khandyga", start: 4448006, end: 4449277 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Kolkata", start: 4449277, end: 4449562 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Krasnoyarsk", start: 4449562, end: 4450769 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Kuala_Lumpur", start: 4450769, end: 4451184 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Kuching", start: 4451184, end: 4451667 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Kuwait", start: 4451667, end: 4451832 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Macao", start: 4451832, end: 4453059 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Macau", start: 4453059, end: 4454286 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Magadan", start: 4454286, end: 4455508 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Makassar", start: 4455508, end: 4455762 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Manila", start: 4455762, end: 4456184 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Muscat", start: 4456184, end: 4456349 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Nicosia", start: 4456349, end: 4458351 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Novokuznetsk", start: 4458351, end: 4459516 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Novosibirsk", start: 4459516, end: 4460737 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Omsk", start: 4460737, end: 4461944 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Oral", start: 4461944, end: 4462949 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Phnom_Penh", start: 4462949, end: 4463148 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Pontianak", start: 4463148, end: 4463501 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Pyongyang", start: 4463501, end: 4463738 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Qatar", start: 4463738, end: 4463937 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Qostanay", start: 4463937, end: 4464976 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Qyzylorda", start: 4464976, end: 4466001 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Rangoon", start: 4466001, end: 4466269 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Riyadh", start: 4466269, end: 4466434 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Saigon", start: 4466434, end: 4466785 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Sakhalin", start: 4466785, end: 4467987 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Samarkand", start: 4467987, end: 4468564 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Seoul", start: 4468564, end: 4469181 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Shanghai", start: 4469181, end: 4469742 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Singapore", start: 4469742, end: 4470157 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Srednekolymsk", start: 4470157, end: 4471365 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Taipei", start: 4471365, end: 4472126 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Tashkent", start: 4472126, end: 4472717 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Tbilisi", start: 4472717, end: 4473752 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Tehran", start: 4473752, end: 4475014 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Tel_Aviv", start: 4475014, end: 4477402 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Thimbu", start: 4477402, end: 4477605 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Thimphu", start: 4477605, end: 4477808 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Tokyo", start: 4477808, end: 4478117 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Tomsk", start: 4478117, end: 4479338 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Ujung_Pandang", start: 4479338, end: 4479592 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Ulaanbaatar", start: 4479592, end: 4480483 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Ulan_Bator", start: 4480483, end: 4481374 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Urumqi", start: 4481374, end: 4481539 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Ust-Nera", start: 4481539, end: 4482791 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Vientiane", start: 4482791, end: 4482990 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Vladivostok", start: 4482990, end: 4484198 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Yakutsk", start: 4484198, end: 4485405 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Yangon", start: 4485405, end: 4485673 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Yekaterinburg", start: 4485673, end: 4486916 }, { filename: "/tmp/pglite/share/postgresql/timezone/Asia/Yerevan", start: 4486916, end: 4488067 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/Azores", start: 4488067, end: 4491523 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/Bermuda", start: 4491523, end: 4493919 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/Canary", start: 4493919, end: 4495816 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/Cape_Verde", start: 4495816, end: 4496086 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/Faeroe", start: 4496086, end: 4497901 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/Faroe", start: 4497901, end: 4499716 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/Jan_Mayen", start: 4499716, end: 4502014 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/Madeira", start: 4502014, end: 4505391 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/Reykjavik", start: 4505391, end: 4505539 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/South_Georgia", start: 4505539, end: 4505703 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/St_Helena", start: 4505703, end: 4505851 }, { filename: "/tmp/pglite/share/postgresql/timezone/Atlantic/Stanley", start: 4505851, end: 4507065 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/ACT", start: 4507065, end: 4509255 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Adelaide", start: 4509255, end: 4511463 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Brisbane", start: 4511463, end: 4511882 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Broken_Hill", start: 4511882, end: 4514111 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Canberra", start: 4514111, end: 4516301 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Currie", start: 4516301, end: 4518659 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Darwin", start: 4518659, end: 4518984 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Eucla", start: 4518984, end: 4519454 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Hobart", start: 4519454, end: 4521812 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/LHI", start: 4521812, end: 4523672 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Lindeman", start: 4523672, end: 4524147 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Lord_Howe", start: 4524147, end: 4526007 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Melbourne", start: 4526007, end: 4528197 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/NSW", start: 4528197, end: 4530387 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/North", start: 4530387, end: 4530712 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Perth", start: 4530712, end: 4531158 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Queensland", start: 4531158, end: 4531577 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/South", start: 4531577, end: 4533785 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Sydney", start: 4533785, end: 4535975 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Tasmania", start: 4535975, end: 4538333 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Victoria", start: 4538333, end: 4540523 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/West", start: 4540523, end: 4540969 }, { filename: "/tmp/pglite/share/postgresql/timezone/Australia/Yancowinna", start: 4540969, end: 4543198 }, { filename: "/tmp/pglite/share/postgresql/timezone/Brazil/Acre", start: 4543198, end: 4543826 }, { filename: "/tmp/pglite/share/postgresql/timezone/Brazil/DeNoronha", start: 4543826, end: 4544542 }, { filename: "/tmp/pglite/share/postgresql/timezone/Brazil/East", start: 4544542, end: 4545986 }, { filename: "/tmp/pglite/share/postgresql/timezone/Brazil/West", start: 4545986, end: 4546590 }, { filename: "/tmp/pglite/share/postgresql/timezone/CET", start: 4546590, end: 4549523 }, { filename: "/tmp/pglite/share/postgresql/timezone/CST6CDT", start: 4549523, end: 4553115 }, { filename: "/tmp/pglite/share/postgresql/timezone/Canada/Atlantic", start: 4553115, end: 4556539 }, { filename: "/tmp/pglite/share/postgresql/timezone/Canada/Central", start: 4556539, end: 4559407 }, { filename: "/tmp/pglite/share/postgresql/timezone/Canada/Eastern", start: 4559407, end: 4562901 }, { filename: "/tmp/pglite/share/postgresql/timezone/Canada/Mountain", start: 4562901, end: 4565233 }, { filename: "/tmp/pglite/share/postgresql/timezone/Canada/Newfoundland", start: 4565233, end: 4568888 }, { filename: "/tmp/pglite/share/postgresql/timezone/Canada/Pacific", start: 4568888, end: 4571780 }, { filename: "/tmp/pglite/share/postgresql/timezone/Canada/Saskatchewan", start: 4571780, end: 4572760 }, { filename: "/tmp/pglite/share/postgresql/timezone/Canada/Yukon", start: 4572760, end: 4574374 }, { filename: "/tmp/pglite/share/postgresql/timezone/Chile/Continental", start: 4574374, end: 4576903 }, { filename: "/tmp/pglite/share/postgresql/timezone/Chile/EasterIsland", start: 4576903, end: 4579136 }, { filename: "/tmp/pglite/share/postgresql/timezone/Cuba", start: 4579136, end: 4581552 }, { filename: "/tmp/pglite/share/postgresql/timezone/EET", start: 4581552, end: 4583814 }, { filename: "/tmp/pglite/share/postgresql/timezone/EST", start: 4583814, end: 4583996 }, { filename: "/tmp/pglite/share/postgresql/timezone/EST5EDT", start: 4583996, end: 4587548 }, { filename: "/tmp/pglite/share/postgresql/timezone/Egypt", start: 4587548, end: 4589947 }, { filename: "/tmp/pglite/share/postgresql/timezone/Eire", start: 4589947, end: 4593439 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT", start: 4593439, end: 4593553 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+0", start: 4593553, end: 4593667 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+1", start: 4593667, end: 4593783 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+10", start: 4593783, end: 4593900 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+11", start: 4593900, end: 4594017 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+12", start: 4594017, end: 4594134 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+2", start: 4594134, end: 4594250 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+3", start: 4594250, end: 4594366 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+4", start: 4594366, end: 4594482 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+5", start: 4594482, end: 4594598 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+6", start: 4594598, end: 4594714 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+7", start: 4594714, end: 4594830 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+8", start: 4594830, end: 4594946 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT+9", start: 4594946, end: 4595062 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-0", start: 4595062, end: 4595176 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-1", start: 4595176, end: 4595293 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-10", start: 4595293, end: 4595411 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-11", start: 4595411, end: 4595529 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-12", start: 4595529, end: 4595647 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-13", start: 4595647, end: 4595765 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-14", start: 4595765, end: 4595883 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-2", start: 4595883, end: 4596e3 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-3", start: 4596e3, end: 4596117 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-4", start: 4596117, end: 4596234 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-5", start: 4596234, end: 4596351 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-6", start: 4596351, end: 4596468 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-7", start: 4596468, end: 4596585 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-8", start: 4596585, end: 4596702 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT-9", start: 4596702, end: 4596819 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/GMT0", start: 4596819, end: 4596933 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/Greenwich", start: 4596933, end: 4597047 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/UCT", start: 4597047, end: 4597161 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/UTC", start: 4597161, end: 4597275 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/Universal", start: 4597275, end: 4597389 }, { filename: "/tmp/pglite/share/postgresql/timezone/Etc/Zulu", start: 4597389, end: 4597503 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Amsterdam", start: 4597503, end: 4600436 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Andorra", start: 4600436, end: 4602178 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Astrakhan", start: 4602178, end: 4603343 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Athens", start: 4603343, end: 4605605 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Belfast", start: 4605605, end: 4609269 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Belgrade", start: 4609269, end: 4611189 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Berlin", start: 4611189, end: 4613487 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Bratislava", start: 4613487, end: 4615788 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Brussels", start: 4615788, end: 4618721 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Bucharest", start: 4618721, end: 4620905 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Budapest", start: 4620905, end: 4623273 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Busingen", start: 4623273, end: 4625182 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Chisinau", start: 4625182, end: 4627572 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Copenhagen", start: 4627572, end: 4629870 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Dublin", start: 4629870, end: 4633362 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Gibraltar", start: 4633362, end: 4636430 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Guernsey", start: 4636430, end: 4640094 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Helsinki", start: 4640094, end: 4641994 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Isle_of_Man", start: 4641994, end: 4645658 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Istanbul", start: 4645658, end: 4647605 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Jersey", start: 4647605, end: 4651269 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Kaliningrad", start: 4651269, end: 4652762 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Kiev", start: 4652762, end: 4654882 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Kirov", start: 4654882, end: 4656067 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Kyiv", start: 4656067, end: 4658187 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Lisbon", start: 4658187, end: 4661714 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Ljubljana", start: 4661714, end: 4663634 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/London", start: 4663634, end: 4667298 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Luxembourg", start: 4667298, end: 4670231 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Madrid", start: 4670231, end: 4672845 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Malta", start: 4672845, end: 4675465 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Mariehamn", start: 4675465, end: 4677365 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Minsk", start: 4677365, end: 4678686 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Monaco", start: 4678686, end: 4681648 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Moscow", start: 4681648, end: 4683183 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Nicosia", start: 4683183, end: 4685185 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Oslo", start: 4685185, end: 4687483 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Paris", start: 4687483, end: 4690445 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Podgorica", start: 4690445, end: 4692365 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Prague", start: 4692365, end: 4694666 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Riga", start: 4694666, end: 4696864 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Rome", start: 4696864, end: 4699505 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Samara", start: 4699505, end: 4700720 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/San_Marino", start: 4700720, end: 4703361 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Sarajevo", start: 4703361, end: 4705281 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Saratov", start: 4705281, end: 4706464 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Simferopol", start: 4706464, end: 4707933 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Skopje", start: 4707933, end: 4709853 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Sofia", start: 4709853, end: 4711930 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Stockholm", start: 4711930, end: 4714228 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Tallinn", start: 4714228, end: 4716376 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Tirane", start: 4716376, end: 4718460 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Tiraspol", start: 4718460, end: 4720850 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Ulyanovsk", start: 4720850, end: 4722117 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Uzhgorod", start: 4722117, end: 4724237 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Vaduz", start: 4724237, end: 4726146 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Vatican", start: 4726146, end: 4728787 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Vienna", start: 4728787, end: 4730987 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Vilnius", start: 4730987, end: 4733149 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Volgograd", start: 4733149, end: 4734342 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Warsaw", start: 4734342, end: 4736996 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Zagreb", start: 4736996, end: 4738916 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Zaporozhye", start: 4738916, end: 4741036 }, { filename: "/tmp/pglite/share/postgresql/timezone/Europe/Zurich", start: 4741036, end: 4742945 }, { filename: "/tmp/pglite/share/postgresql/timezone/Factory", start: 4742945, end: 4743061 }, { filename: "/tmp/pglite/share/postgresql/timezone/GB", start: 4743061, end: 4746725 }, { filename: "/tmp/pglite/share/postgresql/timezone/GB-Eire", start: 4746725, end: 4750389 }, { filename: "/tmp/pglite/share/postgresql/timezone/GMT", start: 4750389, end: 4750503 }, { filename: "/tmp/pglite/share/postgresql/timezone/GMT+0", start: 4750503, end: 4750617 }, { filename: "/tmp/pglite/share/postgresql/timezone/GMT-0", start: 4750617, end: 4750731 }, { filename: "/tmp/pglite/share/postgresql/timezone/GMT0", start: 4750731, end: 4750845 }, { filename: "/tmp/pglite/share/postgresql/timezone/Greenwich", start: 4750845, end: 4750959 }, { filename: "/tmp/pglite/share/postgresql/timezone/HST", start: 4750959, end: 4751288 }, { filename: "/tmp/pglite/share/postgresql/timezone/Hongkong", start: 4751288, end: 4752521 }, { filename: "/tmp/pglite/share/postgresql/timezone/Iceland", start: 4752521, end: 4752669 }, { filename: "/tmp/pglite/share/postgresql/timezone/Indian/Antananarivo", start: 4752669, end: 4752934 }, { filename: "/tmp/pglite/share/postgresql/timezone/Indian/Chagos", start: 4752934, end: 4753133 }, { filename: "/tmp/pglite/share/postgresql/timezone/Indian/Christmas", start: 4753133, end: 4753332 }, { filename: "/tmp/pglite/share/postgresql/timezone/Indian/Cocos", start: 4753332, end: 4753600 }, { filename: "/tmp/pglite/share/postgresql/timezone/Indian/Comoro", start: 4753600, end: 4753865 }, { filename: "/tmp/pglite/share/postgresql/timezone/Indian/Kerguelen", start: 4753865, end: 4754064 }, { filename: "/tmp/pglite/share/postgresql/timezone/Indian/Mahe", start: 4754064, end: 4754229 }, { filename: "/tmp/pglite/share/postgresql/timezone/Indian/Maldives", start: 4754229, end: 4754428 }, { filename: "/tmp/pglite/share/postgresql/timezone/Indian/Mauritius", start: 4754428, end: 4754669 }, { filename: "/tmp/pglite/share/postgresql/timezone/Indian/Mayotte", start: 4754669, end: 4754934 }, { filename: "/tmp/pglite/share/postgresql/timezone/Indian/Reunion", start: 4754934, end: 4755099 }, { filename: "/tmp/pglite/share/postgresql/timezone/Iran", start: 4755099, end: 4756361 }, { filename: "/tmp/pglite/share/postgresql/timezone/Israel", start: 4756361, end: 4758749 }, { filename: "/tmp/pglite/share/postgresql/timezone/Jamaica", start: 4758749, end: 4759231 }, { filename: "/tmp/pglite/share/postgresql/timezone/Japan", start: 4759231, end: 4759540 }, { filename: "/tmp/pglite/share/postgresql/timezone/Kwajalein", start: 4759540, end: 4759856 }, { filename: "/tmp/pglite/share/postgresql/timezone/Libya", start: 4759856, end: 4760481 }, { filename: "/tmp/pglite/share/postgresql/timezone/MET", start: 4760481, end: 4763414 }, { filename: "/tmp/pglite/share/postgresql/timezone/MST", start: 4763414, end: 4763774 }, { filename: "/tmp/pglite/share/postgresql/timezone/MST7MDT", start: 4763774, end: 4766234 }, { filename: "/tmp/pglite/share/postgresql/timezone/Mexico/BajaNorte", start: 4766234, end: 4768692 }, { filename: "/tmp/pglite/share/postgresql/timezone/Mexico/BajaSur", start: 4768692, end: 4769752 }, { filename: "/tmp/pglite/share/postgresql/timezone/Mexico/General", start: 4769752, end: 4770974 }, { filename: "/tmp/pglite/share/postgresql/timezone/NZ", start: 4770974, end: 4773411 }, { filename: "/tmp/pglite/share/postgresql/timezone/NZ-CHAT", start: 4773411, end: 4775479 }, { filename: "/tmp/pglite/share/postgresql/timezone/Navajo", start: 4775479, end: 4777939 }, { filename: "/tmp/pglite/share/postgresql/timezone/PRC", start: 4777939, end: 4778500 }, { filename: "/tmp/pglite/share/postgresql/timezone/PST8PDT", start: 4778500, end: 4781352 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Apia", start: 4781352, end: 4781964 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Auckland", start: 4781964, end: 4784401 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Bougainville", start: 4784401, end: 4784669 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Chatham", start: 4784669, end: 4786737 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Chuuk", start: 4786737, end: 4786923 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Easter", start: 4786923, end: 4789156 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Efate", start: 4789156, end: 4789694 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Enderbury", start: 4789694, end: 4789928 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Fakaofo", start: 4789928, end: 4790128 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Fiji", start: 4790128, end: 4790706 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Funafuti", start: 4790706, end: 4790872 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Galapagos", start: 4790872, end: 4791110 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Gambier", start: 4791110, end: 4791274 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Guadalcanal", start: 4791274, end: 4791440 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Guam", start: 4791440, end: 4791934 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Honolulu", start: 4791934, end: 4792263 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Johnston", start: 4792263, end: 4792592 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Kanton", start: 4792592, end: 4792826 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Kiritimati", start: 4792826, end: 4793064 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Kosrae", start: 4793064, end: 4793415 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Kwajalein", start: 4793415, end: 4793731 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Majuro", start: 4793731, end: 4793897 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Marquesas", start: 4793897, end: 4794070 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Midway", start: 4794070, end: 4794245 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Nauru", start: 4794245, end: 4794497 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Niue", start: 4794497, end: 4794700 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Norfolk", start: 4794700, end: 4795580 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Noumea", start: 4795580, end: 4795884 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Pago_Pago", start: 4795884, end: 4796059 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Palau", start: 4796059, end: 4796239 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Pitcairn", start: 4796239, end: 4796441 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Pohnpei", start: 4796441, end: 4796607 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Ponape", start: 4796607, end: 4796773 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Port_Moresby", start: 4796773, end: 4796959 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Rarotonga", start: 4796959, end: 4797562 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Saipan", start: 4797562, end: 4798056 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Samoa", start: 4798056, end: 4798231 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Tahiti", start: 4798231, end: 4798396 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Tarawa", start: 4798396, end: 4798562 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Tongatapu", start: 4798562, end: 4798934 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Truk", start: 4798934, end: 4799120 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Wake", start: 4799120, end: 4799286 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Wallis", start: 4799286, end: 4799452 }, { filename: "/tmp/pglite/share/postgresql/timezone/Pacific/Yap", start: 4799452, end: 4799638 }, { filename: "/tmp/pglite/share/postgresql/timezone/Poland", start: 4799638, end: 4802292 }, { filename: "/tmp/pglite/share/postgresql/timezone/Portugal", start: 4802292, end: 4805819 }, { filename: "/tmp/pglite/share/postgresql/timezone/ROC", start: 4805819, end: 4806580 }, { filename: "/tmp/pglite/share/postgresql/timezone/ROK", start: 4806580, end: 4807197 }, { filename: "/tmp/pglite/share/postgresql/timezone/Singapore", start: 4807197, end: 4807612 }, { filename: "/tmp/pglite/share/postgresql/timezone/Turkey", start: 4807612, end: 4809559 }, { filename: "/tmp/pglite/share/postgresql/timezone/UCT", start: 4809559, end: 4809673 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/Alaska", start: 4809673, end: 4812044 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/Aleutian", start: 4812044, end: 4814400 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/Arizona", start: 4814400, end: 4814760 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/Central", start: 4814760, end: 4818352 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/East-Indiana", start: 4818352, end: 4820034 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/Eastern", start: 4820034, end: 4823586 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/Hawaii", start: 4823586, end: 4823915 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/Indiana-Starke", start: 4823915, end: 4826359 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/Michigan", start: 4826359, end: 4828589 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/Mountain", start: 4828589, end: 4831049 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/Pacific", start: 4831049, end: 4833901 }, { filename: "/tmp/pglite/share/postgresql/timezone/US/Samoa", start: 4833901, end: 4834076 }, { filename: "/tmp/pglite/share/postgresql/timezone/UTC", start: 4834076, end: 4834190 }, { filename: "/tmp/pglite/share/postgresql/timezone/Universal", start: 4834190, end: 4834304 }, { filename: "/tmp/pglite/share/postgresql/timezone/W-SU", start: 4834304, end: 4835839 }, { filename: "/tmp/pglite/share/postgresql/timezone/WET", start: 4835839, end: 4839366 }, { filename: "/tmp/pglite/share/postgresql/timezone/Zulu", start: 4839366, end: 4839480 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/Africa.txt", start: 4839480, end: 4846453 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/America.txt", start: 4846453, end: 4857460 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/Antarctica.txt", start: 4857460, end: 4858594 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/Asia.txt", start: 4858594, end: 4866905 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/Atlantic.txt", start: 4866905, end: 4870438 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/Australia", start: 4870438, end: 4871573 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/Australia.txt", start: 4871573, end: 4874957 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/Default", start: 4874957, end: 4902171 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/Etc.txt", start: 4902171, end: 4903421 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/Europe.txt", start: 4903421, end: 4912167 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/India", start: 4912167, end: 4912760 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/Indian.txt", start: 4912760, end: 4914021 }, { filename: "/tmp/pglite/share/postgresql/timezonesets/Pacific.txt", start: 4914021, end: 4917789 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/danish.stop", start: 4917789, end: 4918213 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/dutch.stop", start: 4918213, end: 4918666 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/english.stop", start: 4918666, end: 4919288 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/finnish.stop", start: 4919288, end: 4920867 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/french.stop", start: 4920867, end: 4921672 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/german.stop", start: 4921672, end: 4923021 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/hungarian.stop", start: 4923021, end: 4924248 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/hunspell_sample.affix", start: 4924248, end: 4924491 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/hunspell_sample_long.affix", start: 4924491, end: 4925124 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/hunspell_sample_long.dict", start: 4925124, end: 4925222 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/hunspell_sample_num.affix", start: 4925222, end: 4925684 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/hunspell_sample_num.dict", start: 4925684, end: 4925813 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/ispell_sample.affix", start: 4925813, end: 4926278 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/ispell_sample.dict", start: 4926278, end: 4926359 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/italian.stop", start: 4926359, end: 4928013 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/nepali.stop", start: 4928013, end: 4932274 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/norwegian.stop", start: 4932274, end: 4933125 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/portuguese.stop", start: 4933125, end: 4934392 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/russian.stop", start: 4934392, end: 4935627 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/spanish.stop", start: 4935627, end: 4937805 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/swedish.stop", start: 4937805, end: 4938364 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/synonym_sample.syn", start: 4938364, end: 4938437 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/thesaurus_sample.ths", start: 4938437, end: 4938910 }, { filename: "/tmp/pglite/share/postgresql/tsearch_data/turkish.stop", start: 4938910, end: 4939170 }], remote_package_size: 4939170 });
        })();
        var moduleOverrides = Object.assign({}, Module), arguments_ = [], thisProgram = "./this.program", quit_ = (e, t2) => {
          throw t2;
        }, scriptDirectory = "";
        function locateFile(e) {
          return Module.locateFile ? Module.locateFile(e, scriptDirectory) : scriptDirectory + e;
        }
        var readAsync, readBinary;
        if (ENVIRONMENT_IS_NODE) {
          var fs = require("fs"), nodePath = require("path");
          import_meta2.url.startsWith("data:") || (scriptDirectory = nodePath.dirname(require("url").fileURLToPath(import_meta2.url)) + "/"), readBinary = (e) => {
            e = isFileURI(e) ? new URL(e) : e;
            var t2 = fs.readFileSync(e);
            return t2;
          }, readAsync = async (e, t2 = true) => {
            e = isFileURI(e) ? new URL(e) : e;
            var r = fs.readFileSync(e, t2 ? void 0 : "utf8");
            return r;
          }, !Module.thisProgram && process.argv.length > 1 && (thisProgram = process.argv[1].replace(/\\/g, "/")), arguments_ = process.argv.slice(2), quit_ = (e, t2) => {
            throw process.exitCode = e, t2;
          };
        } else (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && (ENVIRONMENT_IS_WORKER ? scriptDirectory = self.location.href : typeof document < "u" && document.currentScript && (scriptDirectory = document.currentScript.src), _scriptName && (scriptDirectory = _scriptName), scriptDirectory.startsWith("blob:") ? scriptDirectory = "" : scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1), ENVIRONMENT_IS_WORKER && (readBinary = (e) => {
          var t2 = new XMLHttpRequest();
          return t2.open("GET", e, false), t2.responseType = "arraybuffer", t2.send(null), new Uint8Array(t2.response);
        }), readAsync = async (e) => {
          var t2 = await fetch(e, { credentials: "same-origin" });
          if (t2.ok) return t2.arrayBuffer();
          throw new Error(t2.status + " : " + t2.url);
        });
        var out = Module.print || console.log.bind(console), err = Module.printErr || console.error.bind(console);
        Object.assign(Module, moduleOverrides), moduleOverrides = null, Module.arguments && (arguments_ = Module.arguments), Module.thisProgram && (thisProgram = Module.thisProgram);
        var dynamicLibraries = Module.dynamicLibraries || [], wasmBinary = Module.wasmBinary;
        function intArrayFromBase64(e) {
          if (typeof ENVIRONMENT_IS_NODE < "u" && ENVIRONMENT_IS_NODE) {
            var t2 = Buffer.from(e, "base64");
            return new Uint8Array(t2.buffer, t2.byteOffset, t2.length);
          }
          for (var r = atob(e), a2 = new Uint8Array(r.length), o4 = 0; o4 < r.length; ++o4) a2[o4] = r.charCodeAt(o4);
          return a2;
        }
        var wasmMemory, ABORT = false, EXITSTATUS;
        function assert(e, t2) {
          e || abort(t2);
        }
        var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAP64, HEAPU64, HEAPF64;
        function updateMemoryViews() {
          var e = wasmMemory.buffer;
          Module.HEAP8 = HEAP8 = new Int8Array(e), Module.HEAP16 = HEAP16 = new Int16Array(e), Module.HEAPU8 = HEAPU8 = new Uint8Array(e), Module.HEAPU16 = HEAPU16 = new Uint16Array(e), Module.HEAP32 = HEAP32 = new Int32Array(e), Module.HEAPU32 = HEAPU32 = new Uint32Array(e), Module.HEAPF32 = HEAPF32 = new Float32Array(e), Module.HEAPF64 = HEAPF64 = new Float64Array(e), Module.HEAP64 = HEAP64 = new BigInt64Array(e), Module.HEAPU64 = HEAPU64 = new BigUint64Array(e);
        }
        if (Module.wasmMemory) wasmMemory = Module.wasmMemory;
        else {
          var INITIAL_MEMORY = Module.INITIAL_MEMORY || 16777216;
          wasmMemory = new WebAssembly.Memory({ initial: INITIAL_MEMORY / 65536, maximum: 32768 });
        }
        updateMemoryViews();
        var __ATPRERUN__ = [], __ATINIT__ = [], __ATMAIN__ = [], __ATPOSTRUN__ = [], __RELOC_FUNCS__ = [], runtimeInitialized = false;
        function preRun() {
          if (Module.preRun) for (typeof Module.preRun == "function" && (Module.preRun = [Module.preRun]); Module.preRun.length; ) addOnPreRun(Module.preRun.shift());
          callRuntimeCallbacks(__ATPRERUN__);
        }
        function initRuntime() {
          runtimeInitialized = true, callRuntimeCallbacks(__RELOC_FUNCS__), !Module.noFSInit && !FS.initialized && FS.init(), FS.ignorePermissions = false, TTY.init(), SOCKFS.root = FS.mount(SOCKFS, {}, null), PIPEFS.root = FS.mount(PIPEFS, {}, null), callRuntimeCallbacks(__ATINIT__);
        }
        function preMain() {
          callRuntimeCallbacks(__ATMAIN__);
        }
        function postRun() {
          if (Module.postRun) for (typeof Module.postRun == "function" && (Module.postRun = [Module.postRun]); Module.postRun.length; ) addOnPostRun(Module.postRun.shift());
          callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPreRun(e) {
          __ATPRERUN__.unshift(e);
        }
        function addOnInit(e) {
          __ATINIT__.unshift(e);
        }
        function addOnPostRun(e) {
          __ATPOSTRUN__.unshift(e);
        }
        var runDependencies = 0, dependenciesFulfilled = null;
        function getUniqueRunDependency(e) {
          return e;
        }
        function addRunDependency(e) {
          runDependencies++, Module.monitorRunDependencies?.(runDependencies);
        }
        function removeRunDependency(e) {
          if (runDependencies--, Module.monitorRunDependencies?.(runDependencies), runDependencies == 0 && dependenciesFulfilled) {
            var t2 = dependenciesFulfilled;
            dependenciesFulfilled = null, t2();
          }
        }
        function abort(e) {
          Module.onAbort?.(e), e = "Aborted(" + e + ")", err(e), ABORT = true, e += ". Build with -sASSERTIONS for more info.";
          var t2 = new WebAssembly.RuntimeError(e);
          throw readyPromiseReject(t2), t2;
        }
        var dataURIPrefix = "data:application/octet-stream;base64,", isDataURI = (e) => e.startsWith(dataURIPrefix), isFileURI = (e) => e.startsWith("file://");
        function findWasmBinary() {
          if (Module.locateFile) {
            var e = "pglite.wasm";
            return isDataURI(e) ? e : locateFile(e);
          }
          return new URL("pglite.wasm", import_meta2.url).href;
        }
        var wasmBinaryFile;
        function getBinarySync(e) {
          if (e == wasmBinaryFile && wasmBinary) return new Uint8Array(wasmBinary);
          if (readBinary) return readBinary(e);
          throw "both async and sync fetching of the wasm failed";
        }
        async function getWasmBinary(e) {
          if (!wasmBinary) try {
            var t2 = await readAsync(e);
            return new Uint8Array(t2);
          } catch {
          }
          return getBinarySync(e);
        }
        async function instantiateArrayBuffer(e, t2) {
          try {
            var r = await getWasmBinary(e), a2 = await WebAssembly.instantiate(r, t2);
            return a2;
          } catch (o4) {
            err(`failed to asynchronously prepare wasm: ${o4}`), abort(o4);
          }
        }
        async function instantiateAsync(e, t2, r) {
          if (!e && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(t2) && !ENVIRONMENT_IS_NODE && typeof fetch == "function") try {
            var a2 = fetch(t2, { credentials: "same-origin" }), o4 = await WebAssembly.instantiateStreaming(a2, r);
            return o4;
          } catch (s4) {
            err(`wasm streaming compile failed: ${s4}`), err("falling back to ArrayBuffer instantiation");
          }
          return instantiateArrayBuffer(t2, r);
        }
        function getWasmImports() {
          return { env: wasmImports, wasi_snapshot_preview1: wasmImports, "GOT.mem": new Proxy(wasmImports, GOTHandler), "GOT.func": new Proxy(wasmImports, GOTHandler) };
        }
        async function createWasm() {
          function e(o4, s4) {
            wasmExports = o4.exports, wasmExports = relocateExports(wasmExports, 1024);
            var _3 = getDylinkMetadata(s4);
            return _3.neededDynlibs && (dynamicLibraries = _3.neededDynlibs.concat(dynamicLibraries)), mergeLibSymbols(wasmExports, "main"), LDSO.init(), loadDylibs(), addOnInit(wasmExports.__wasm_call_ctors), __RELOC_FUNCS__.push(wasmExports.__wasm_apply_data_relocs), removeRunDependency("wasm-instantiate"), wasmExports;
          }
          addRunDependency("wasm-instantiate");
          function t2(o4) {
            e(o4.instance, o4.module);
          }
          var r = getWasmImports();
          if (Module.instantiateWasm) try {
            return Module.instantiateWasm(r, e);
          } catch (o4) {
            err(`Module.instantiateWasm callback failed with error: ${o4}`), readyPromiseReject(o4);
          }
          wasmBinaryFile ?? (wasmBinaryFile = findWasmBinary());
          try {
            var a2 = await instantiateAsync(wasmBinary, wasmBinaryFile, r);
            return t2(a2), a2;
          } catch (o4) {
            readyPromiseReject(o4);
            return;
          }
        }
        var ASM_CONSTS = { 2537496: (e) => {
          Module.is_worker = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope, Module.FD_BUFFER_MAX = e, Module.emscripten_copy_to = console.warn;
        }, 2537668: () => {
          Module.postMessage = function(t2) {
            console.log("# pg_main_emsdk.c:544: onCustomMessage:", t2);
          };
        }, 2537797: () => {
          if (Module.is_worker) {
            let t2 = function(r) {
              console.log("onCustomMessage:", r);
            };
            var e = t2;
            Module.onCustomMessage = t2;
          } else Module.postMessage = function(r) {
            switch (r.type) {
              case "raw":
                break;
              case "stdin": {
                stringToUTF8(r.data, 1, Module.FD_BUFFER_MAX);
                break;
              }
              case "rcon":
                break;
              default:
                console.warn("custom_postMessage?", r);
            }
          };
        } };
        class ExitStatus {
          constructor(t2) {
            P(this, "name", "ExitStatus");
            this.message = `Program terminated with exit(${t2})`, this.status = t2;
          }
        }
        var GOT = {}, currentModuleWeakSymbols = /* @__PURE__ */ new Set([]), GOTHandler = { get(e, t2) {
          var r = GOT[t2];
          return r || (r = GOT[t2] = new WebAssembly.Global({ value: "i32", mutable: true })), currentModuleWeakSymbols.has(t2) || (r.required = true), r;
        } }, callRuntimeCallbacks = (e) => {
          for (; e.length > 0; ) e.shift()(Module);
        }, UTF8Decoder = typeof TextDecoder < "u" ? new TextDecoder() : void 0, UTF8ArrayToString = (e, t2 = 0, r = NaN) => {
          for (var a2 = t2 + r, o4 = t2; e[o4] && !(o4 >= a2); ) ++o4;
          if (o4 - t2 > 16 && e.buffer && UTF8Decoder) return UTF8Decoder.decode(e.subarray(t2, o4));
          for (var s4 = ""; t2 < o4; ) {
            var _3 = e[t2++];
            if (!(_3 & 128)) {
              s4 += String.fromCharCode(_3);
              continue;
            }
            var n3 = e[t2++] & 63;
            if ((_3 & 224) == 192) {
              s4 += String.fromCharCode((_3 & 31) << 6 | n3);
              continue;
            }
            var l3 = e[t2++] & 63;
            if ((_3 & 240) == 224 ? _3 = (_3 & 15) << 12 | n3 << 6 | l3 : _3 = (_3 & 7) << 18 | n3 << 12 | l3 << 6 | e[t2++] & 63, _3 < 65536) s4 += String.fromCharCode(_3);
            else {
              var d2 = _3 - 65536;
              s4 += String.fromCharCode(55296 | d2 >> 10, 56320 | d2 & 1023);
            }
          }
          return s4;
        }, getDylinkMetadata = (e) => {
          var t2 = 0, r = 0;
          function a2() {
            return e[t2++];
          }
          function o4() {
            for (var T5 = 0, D4 = 1; ; ) {
              var A2 = e[t2++];
              if (T5 += (A2 & 127) * D4, D4 *= 128, !(A2 & 128)) break;
            }
            return T5;
          }
          function s4() {
            var T5 = o4();
            return t2 += T5, UTF8ArrayToString(e, t2 - T5, T5);
          }
          function _3(T5, D4) {
            if (T5) throw new Error(D4);
          }
          var n3 = "dylink.0";
          if (e instanceof WebAssembly.Module) {
            var l3 = WebAssembly.Module.customSections(e, n3);
            l3.length === 0 && (n3 = "dylink", l3 = WebAssembly.Module.customSections(e, n3)), _3(l3.length === 0, "need dylink section"), e = new Uint8Array(l3[0]), r = e.length;
          } else {
            var d2 = new Uint32Array(new Uint8Array(e.subarray(0, 24)).buffer), p4 = d2[0] == 1836278016;
            _3(!p4, "need to see wasm magic number"), _3(e[8] !== 0, "need the dylink section to be first"), t2 = 9;
            var m4 = o4();
            r = t2 + m4, n3 = s4();
          }
          var g5 = { neededDynlibs: [], tlsExports: /* @__PURE__ */ new Set(), weakImports: /* @__PURE__ */ new Set() };
          if (n3 == "dylink") {
            g5.memorySize = o4(), g5.memoryAlign = o4(), g5.tableSize = o4(), g5.tableAlign = o4();
            for (var u2 = o4(), f3 = 0; f3 < u2; ++f3) {
              var c2 = s4();
              g5.neededDynlibs.push(c2);
            }
          } else {
            _3(n3 !== "dylink.0");
            for (var w4 = 1, x6 = 2, S3 = 3, h3 = 4, b3 = 256, v3 = 3, y4 = 1; t2 < r; ) {
              var k4 = a2(), q2 = o4();
              if (k4 === w4) g5.memorySize = o4(), g5.memoryAlign = o4(), g5.tableSize = o4(), g5.tableAlign = o4();
              else if (k4 === x6) for (var u2 = o4(), f3 = 0; f3 < u2; ++f3) c2 = s4(), g5.neededDynlibs.push(c2);
              else if (k4 === S3) for (var U3 = o4(); U3--; ) {
                var ee2 = s4(), O4 = o4();
                O4 & b3 && g5.tlsExports.add(ee2);
              }
              else if (k4 === h3) for (var U3 = o4(); U3--; ) {
                var H4 = s4(), ee2 = s4(), O4 = o4();
                (O4 & v3) == y4 && g5.weakImports.add(ee2);
              }
              else t2 += q2;
            }
          }
          return g5;
        };
        function getValue(e, t2 = "i8") {
          switch (t2.endsWith("*") && (t2 = "*"), t2) {
            case "i1":
              return HEAP8[e];
            case "i8":
              return HEAP8[e];
            case "i16":
              return HEAP16[e >> 1];
            case "i32":
              return HEAP32[e >> 2];
            case "i64":
              return HEAP64[e >> 3];
            case "float":
              return HEAPF32[e >> 2];
            case "double":
              return HEAPF64[e >> 3];
            case "*":
              return HEAPU32[e >> 2];
            default:
              abort(`invalid type for getValue: ${t2}`);
          }
        }
        var newDSO = (e, t2, r) => {
          var a2 = { refcount: 1 / 0, name: e, exports: r, global: true };
          return LDSO.loadedLibsByName[e] = a2, t2 != null && (LDSO.loadedLibsByHandle[t2] = a2), a2;
        }, LDSO = { loadedLibsByName: {}, loadedLibsByHandle: {}, init() {
          newDSO("__main__", 0, wasmImports);
        } }, ___heap_base = 2765616, alignMemory = (e, t2) => Math.ceil(e / t2) * t2, getMemory = (e) => {
          if (runtimeInitialized) return _calloc(e, 1);
          var t2 = ___heap_base, r = t2 + alignMemory(e, 16);
          return ___heap_base = r, GOT.__heap_base.value = r, t2;
        }, isInternalSym = (e) => ["__cpp_exception", "__c_longjmp", "__wasm_apply_data_relocs", "__dso_handle", "__tls_size", "__tls_align", "__set_stack_limits", "_emscripten_tls_init", "__wasm_init_tls", "__wasm_call_ctors", "__start_em_asm", "__stop_em_asm", "__start_em_js", "__stop_em_js"].includes(e) || e.startsWith("__em_js__"), uleb128Encode = (e, t2) => {
          e < 128 ? t2.push(e) : t2.push(e % 128 | 128, e >> 7);
        }, sigToWasmTypes = (e) => {
          for (var t2 = { i: "i32", j: "i64", f: "f32", d: "f64", e: "externref", p: "i32" }, r = { parameters: [], results: e[0] == "v" ? [] : [t2[e[0]]] }, a2 = 1; a2 < e.length; ++a2) r.parameters.push(t2[e[a2]]);
          return r;
        }, generateFuncType = (e, t2) => {
          var r = e.slice(0, 1), a2 = e.slice(1), o4 = { i: 127, p: 127, j: 126, f: 125, d: 124, e: 111 };
          t2.push(96), uleb128Encode(a2.length, t2);
          for (var s4 = 0; s4 < a2.length; ++s4) t2.push(o4[a2[s4]]);
          r == "v" ? t2.push(0) : t2.push(1, o4[r]);
        }, convertJsFunctionToWasm = (e, t2) => {
          if (typeof WebAssembly.Function == "function") return new WebAssembly.Function(sigToWasmTypes(t2), e);
          var r = [1];
          generateFuncType(t2, r);
          var a2 = [0, 97, 115, 109, 1, 0, 0, 0, 1];
          uleb128Encode(r.length, a2), a2.push(...r), a2.push(2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
          var o4 = new WebAssembly.Module(new Uint8Array(a2)), s4 = new WebAssembly.Instance(o4, { e: { f: e } }), _3 = s4.exports.f;
          return _3;
        }, wasmTableMirror = [], wasmTable = new WebAssembly.Table({ initial: 5610, element: "anyfunc" }), getWasmTableEntry = (e) => {
          var t2 = wasmTableMirror[e];
          return t2 || (e >= wasmTableMirror.length && (wasmTableMirror.length = e + 1), wasmTableMirror[e] = t2 = wasmTable.get(e)), t2;
        }, updateTableMap = (e, t2) => {
          if (functionsInTableMap) for (var r = e; r < e + t2; r++) {
            var a2 = getWasmTableEntry(r);
            a2 && functionsInTableMap.set(a2, r);
          }
        }, functionsInTableMap, getFunctionAddress = (e) => (functionsInTableMap || (functionsInTableMap = /* @__PURE__ */ new WeakMap(), updateTableMap(0, wasmTable.length)), functionsInTableMap.get(e) || 0), freeTableIndexes = [], getEmptyTableSlot = () => {
          if (freeTableIndexes.length) return freeTableIndexes.pop();
          try {
            wasmTable.grow(1);
          } catch (e) {
            throw e instanceof RangeError ? "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH." : e;
          }
          return wasmTable.length - 1;
        }, setWasmTableEntry = (e, t2) => {
          wasmTable.set(e, t2), wasmTableMirror[e] = wasmTable.get(e);
        }, addFunction = (e, t2) => {
          var r = getFunctionAddress(e);
          if (r) return r;
          var a2 = getEmptyTableSlot();
          try {
            setWasmTableEntry(a2, e);
          } catch (s4) {
            if (!(s4 instanceof TypeError)) throw s4;
            var o4 = convertJsFunctionToWasm(e, t2);
            setWasmTableEntry(a2, o4);
          }
          return functionsInTableMap.set(e, a2), a2;
        }, updateGOT = (e, t2) => {
          for (var r in e) if (!isInternalSym(r)) {
            var a2 = e[r];
            GOT[r] || (GOT[r] = new WebAssembly.Global({ value: "i32", mutable: true })), (t2 || GOT[r].value == 0) && (typeof a2 == "function" ? GOT[r].value = addFunction(a2) : typeof a2 == "number" ? GOT[r].value = a2 : err(`unhandled export type for '${r}': ${typeof a2}`));
          }
        }, relocateExports = (e, t2, r) => {
          var a2 = {};
          for (var o4 in e) {
            var s4 = e[o4];
            typeof s4 == "object" && (s4 = s4.value), typeof s4 == "number" && (s4 += t2), a2[o4] = s4;
          }
          return updateGOT(a2, r), a2;
        }, isSymbolDefined = (e) => {
          var t2 = wasmImports[e];
          return !(!t2 || t2.stub);
        }, dynCall = (e, t2, r = []) => {
          var a2 = getWasmTableEntry(t2)(...r);
          return a2;
        }, stackSave = () => _emscripten_stack_get_current(), stackRestore = (e) => __emscripten_stack_restore(e), createInvokeFunction = (e) => (t2, ...r) => {
          var a2 = stackSave();
          try {
            return dynCall(e, t2, r);
          } catch (o4) {
            if (stackRestore(a2), o4 !== o4 + 0) throw o4;
            if (_setThrew(1, 0), e[0] == "j") return 0n;
          }
        }, resolveGlobalSymbol = (e, t2 = false) => {
          var r;
          return isSymbolDefined(e) ? r = wasmImports[e] : e.startsWith("invoke_") && (r = wasmImports[e] = createInvokeFunction(e.split("_")[1])), { sym: r, name: e };
        }, UTF8ToString = (e, t2) => e ? UTF8ArrayToString(HEAPU8, e, t2) : "", loadWebAssemblyModule = (binary, flags, libName, localScope, handle) => {
          var metadata = getDylinkMetadata(binary);
          currentModuleWeakSymbols = metadata.weakImports;
          function loadModule() {
            var firstLoad = !handle || !HEAP8[handle + 8];
            if (firstLoad) {
              var memAlign = Math.pow(2, metadata.memoryAlign), memoryBase = metadata.memorySize ? alignMemory(getMemory(metadata.memorySize + memAlign), memAlign) : 0, tableBase = metadata.tableSize ? wasmTable.length : 0;
              handle && (HEAP8[handle + 8] = 1, HEAPU32[handle + 12 >> 2] = memoryBase, HEAP32[handle + 16 >> 2] = metadata.memorySize, HEAPU32[handle + 20 >> 2] = tableBase, HEAP32[handle + 24 >> 2] = metadata.tableSize);
            } else memoryBase = HEAPU32[handle + 12 >> 2], tableBase = HEAPU32[handle + 20 >> 2];
            var tableGrowthNeeded = tableBase + metadata.tableSize - wasmTable.length;
            tableGrowthNeeded > 0 && wasmTable.grow(tableGrowthNeeded);
            var moduleExports;
            function resolveSymbol(e) {
              var t2 = resolveGlobalSymbol(e).sym;
              return !t2 && localScope && (t2 = localScope[e]), t2 || (t2 = moduleExports[e]), t2;
            }
            var proxyHandler = { get(e, t2) {
              switch (t2) {
                case "__memory_base":
                  return memoryBase;
                case "__table_base":
                  return tableBase;
              }
              if (t2 in wasmImports && !wasmImports[t2].stub) return wasmImports[t2];
              if (!(t2 in e)) {
                var r;
                e[t2] = (...a2) => (r || (r = resolveSymbol(t2)), r(...a2));
              }
              return e[t2];
            } }, proxy = new Proxy({}, proxyHandler), info = { "GOT.mem": new Proxy({}, GOTHandler), "GOT.func": new Proxy({}, GOTHandler), env: proxy, wasi_snapshot_preview1: proxy };
            function postInstantiation(module, instance) {
              updateTableMap(tableBase, metadata.tableSize), moduleExports = relocateExports(instance.exports, memoryBase), flags.allowUndefined || reportUndefinedSymbols();
              function addEmAsm(addr, body) {
                for (var args = [], arity = 0; arity < 16 && body.indexOf("$" + arity) != -1; arity++) args.push("$" + arity);
                args = args.join(",");
                var func = `(${args}) => { ${body} };`;
                ASM_CONSTS[start] = eval(func);
              }
              if ("__start_em_asm" in moduleExports) for (var start = moduleExports.__start_em_asm, stop = moduleExports.__stop_em_asm; start < stop; ) {
                var jsString = UTF8ToString(start);
                addEmAsm(start, jsString), start = HEAPU8.indexOf(0, start) + 1;
              }
              function addEmJs(name, cSig, body) {
                var jsArgs = [];
                if (cSig = cSig.slice(1, -1), cSig != "void") {
                  cSig = cSig.split(",");
                  for (var i in cSig) {
                    var jsArg = cSig[i].split(" ").pop();
                    jsArgs.push(jsArg.replace("*", ""));
                  }
                }
                var func = `(${jsArgs}) => ${body};`;
                moduleExports[name] = eval(func);
              }
              for (var name in moduleExports) if (name.startsWith("__em_js__")) {
                var start = moduleExports[name], jsString = UTF8ToString(start), parts = jsString.split("<::>");
                addEmJs(name.replace("__em_js__", ""), parts[0], parts[1]), delete moduleExports[name];
              }
              var applyRelocs = moduleExports.__wasm_apply_data_relocs;
              applyRelocs && (runtimeInitialized ? applyRelocs() : __RELOC_FUNCS__.push(applyRelocs));
              var init = moduleExports.__wasm_call_ctors;
              return init && (runtimeInitialized ? init() : __ATINIT__.push(init)), moduleExports;
            }
            if (flags.loadAsync) {
              if (binary instanceof WebAssembly.Module) {
                var instance = new WebAssembly.Instance(binary, info);
                return Promise.resolve(postInstantiation(binary, instance));
              }
              return WebAssembly.instantiate(binary, info).then((e) => postInstantiation(e.module, e.instance));
            }
            var module = binary instanceof WebAssembly.Module ? binary : new WebAssembly.Module(binary), instance = new WebAssembly.Instance(module, info);
            return postInstantiation(module, instance);
          }
          return flags.loadAsync ? metadata.neededDynlibs.reduce((e, t2) => e.then(() => loadDynamicLibrary(t2, flags, localScope)), Promise.resolve()).then(loadModule) : (metadata.neededDynlibs.forEach((e) => loadDynamicLibrary(e, flags, localScope)), loadModule());
        }, mergeLibSymbols = (e, t2) => {
          for (var [r, a2] of Object.entries(e)) {
            let o4 = (_3) => {
              isSymbolDefined(_3) || (wasmImports[_3] = a2);
            };
            o4(r);
            let s4 = "__main_argc_argv";
            r == "main" && o4(s4), r == s4 && o4("main");
          }
        }, asyncLoad = async (e) => {
          var t2 = await readAsync(e);
          return new Uint8Array(t2);
        }, preloadPlugins = Module.preloadPlugins || [], registerWasmPlugin = () => {
          var e = { promiseChainEnd: Promise.resolve(), canHandle: (t2) => !Module.noWasmDecoding && t2.endsWith(".so"), handle: (t2, r, a2, o4) => {
            e.promiseChainEnd = e.promiseChainEnd.then(() => loadWebAssemblyModule(t2, { loadAsync: true, nodelete: true }, r, {})).then((s4) => {
              preloadedWasm[r] = s4, a2(t2);
            }, (s4) => {
              err(`failed to instantiate wasm: ${r}: ${s4}`), o4();
            });
          } };
          preloadPlugins.push(e);
        }, preloadedWasm = {};
        function loadDynamicLibrary(e, t2 = { global: true, nodelete: true }, r, a2) {
          var o4 = LDSO.loadedLibsByName[e];
          if (o4) return t2.global ? o4.global || (o4.global = true, mergeLibSymbols(o4.exports, e)) : r && Object.assign(r, o4.exports), t2.nodelete && o4.refcount !== 1 / 0 && (o4.refcount = 1 / 0), o4.refcount++, a2 && (LDSO.loadedLibsByHandle[a2] = o4), t2.loadAsync ? Promise.resolve(true) : true;
          o4 = newDSO(e, a2, "loading"), o4.refcount = t2.nodelete ? 1 / 0 : 1, o4.global = t2.global;
          function s4() {
            if (a2) {
              var l3 = HEAPU32[a2 + 28 >> 2], d2 = HEAPU32[a2 + 32 >> 2];
              if (l3 && d2) {
                var p4 = HEAP8.slice(l3, l3 + d2);
                return t2.loadAsync ? Promise.resolve(p4) : p4;
              }
            }
            var m4 = locateFile(e);
            if (t2.loadAsync) return asyncLoad(m4);
            if (!readBinary) throw new Error(`${m4}: file not found, and synchronous loading of external files is not available`);
            return readBinary(m4);
          }
          function _3() {
            var l3 = preloadedWasm[e];
            return l3 ? t2.loadAsync ? Promise.resolve(l3) : l3 : t2.loadAsync ? s4().then((d2) => loadWebAssemblyModule(d2, t2, e, r, a2)) : loadWebAssemblyModule(s4(), t2, e, r, a2);
          }
          function n3(l3) {
            o4.global ? mergeLibSymbols(l3, e) : r && Object.assign(r, l3), o4.exports = l3;
          }
          return t2.loadAsync ? _3().then((l3) => (n3(l3), true)) : (n3(_3()), true);
        }
        var reportUndefinedSymbols = () => {
          for (var [e, t2] of Object.entries(GOT)) if (t2.value == 0) {
            var r = resolveGlobalSymbol(e, true).sym;
            if (!r && !t2.required) continue;
            if (typeof r == "function") t2.value = addFunction(r, r.sig);
            else if (typeof r == "number") t2.value = r;
            else throw new Error(`bad export type for '${e}': ${typeof r}`);
          }
        }, loadDylibs = () => {
          if (!dynamicLibraries.length) {
            reportUndefinedSymbols();
            return;
          }
          addRunDependency("loadDylibs"), dynamicLibraries.reduce((e, t2) => e.then(() => loadDynamicLibrary(t2, { loadAsync: true, global: true, nodelete: true, allowUndefined: true })), Promise.resolve()).then(() => {
            reportUndefinedSymbols(), removeRunDependency("loadDylibs");
          });
        }, noExitRuntime = Module.noExitRuntime || true;
        function setValue(e, t2, r = "i8") {
          switch (r.endsWith("*") && (r = "*"), r) {
            case "i1":
              HEAP8[e] = t2;
              break;
            case "i8":
              HEAP8[e] = t2;
              break;
            case "i16":
              HEAP16[e >> 1] = t2;
              break;
            case "i32":
              HEAP32[e >> 2] = t2;
              break;
            case "i64":
              HEAP64[e >> 3] = BigInt(t2);
              break;
            case "float":
              HEAPF32[e >> 2] = t2;
              break;
            case "double":
              HEAPF64[e >> 3] = t2;
              break;
            case "*":
              HEAPU32[e >> 2] = t2;
              break;
            default:
              abort(`invalid type for setValue: ${r}`);
          }
        }
        var ___assert_fail = (e, t2, r, a2) => abort(`Assertion failed: ${UTF8ToString(e)}, at: ` + [t2 ? UTF8ToString(t2) : "unknown filename", r, a2 ? UTF8ToString(a2) : "unknown function"]);
        ___assert_fail.sig = "vppip";
        var ___call_sighandler = (e, t2) => getWasmTableEntry(e)(t2);
        ___call_sighandler.sig = "vpi";
        var ___memory_base = new WebAssembly.Global({ value: "i32", mutable: false }, 1024);
        Module.___memory_base = ___memory_base;
        var ___stack_pointer = new WebAssembly.Global({ value: "i32", mutable: true }, 2765616);
        Module.___stack_pointer = ___stack_pointer;
        var PATH = { isAbs: (e) => e.charAt(0) === "/", splitPath: (e) => {
          var t2 = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
          return t2.exec(e).slice(1);
        }, normalizeArray: (e, t2) => {
          for (var r = 0, a2 = e.length - 1; a2 >= 0; a2--) {
            var o4 = e[a2];
            o4 === "." ? e.splice(a2, 1) : o4 === ".." ? (e.splice(a2, 1), r++) : r && (e.splice(a2, 1), r--);
          }
          if (t2) for (; r; r--) e.unshift("..");
          return e;
        }, normalize: (e) => {
          var t2 = PATH.isAbs(e), r = e.substr(-1) === "/";
          return e = PATH.normalizeArray(e.split("/").filter((a2) => !!a2), !t2).join("/"), !e && !t2 && (e = "."), e && r && (e += "/"), (t2 ? "/" : "") + e;
        }, dirname: (e) => {
          var t2 = PATH.splitPath(e), r = t2[0], a2 = t2[1];
          return !r && !a2 ? "." : (a2 && (a2 = a2.substr(0, a2.length - 1)), r + a2);
        }, basename: (e) => {
          if (e === "/") return "/";
          e = PATH.normalize(e), e = e.replace(/\/$/, "");
          var t2 = e.lastIndexOf("/");
          return t2 === -1 ? e : e.substr(t2 + 1);
        }, join: (...e) => PATH.normalize(e.join("/")), join2: (e, t2) => PATH.normalize(e + "/" + t2) }, initRandomFill = () => {
          if (typeof crypto == "object" && typeof crypto.getRandomValues == "function") return (a2) => crypto.getRandomValues(a2);
          if (ENVIRONMENT_IS_NODE) try {
            var e = require("crypto"), t2 = e.randomFillSync;
            if (t2) return (a2) => e.randomFillSync(a2);
            var r = e.randomBytes;
            return (a2) => (a2.set(r(a2.byteLength)), a2);
          } catch {
          }
          abort("initRandomDevice");
        }, randomFill = (e) => (randomFill = initRandomFill())(e), PATH_FS = { resolve: (...e) => {
          for (var t2 = "", r = false, a2 = e.length - 1; a2 >= -1 && !r; a2--) {
            var o4 = a2 >= 0 ? e[a2] : FS.cwd();
            if (typeof o4 != "string") throw new TypeError("Arguments to path.resolve must be strings");
            if (!o4) return "";
            t2 = o4 + "/" + t2, r = PATH.isAbs(o4);
          }
          return t2 = PATH.normalizeArray(t2.split("/").filter((s4) => !!s4), !r).join("/"), (r ? "/" : "") + t2 || ".";
        }, relative: (e, t2) => {
          e = PATH_FS.resolve(e).substr(1), t2 = PATH_FS.resolve(t2).substr(1);
          function r(d2) {
            for (var p4 = 0; p4 < d2.length && d2[p4] === ""; p4++) ;
            for (var m4 = d2.length - 1; m4 >= 0 && d2[m4] === ""; m4--) ;
            return p4 > m4 ? [] : d2.slice(p4, m4 - p4 + 1);
          }
          for (var a2 = r(e.split("/")), o4 = r(t2.split("/")), s4 = Math.min(a2.length, o4.length), _3 = s4, n3 = 0; n3 < s4; n3++) if (a2[n3] !== o4[n3]) {
            _3 = n3;
            break;
          }
          for (var l3 = [], n3 = _3; n3 < a2.length; n3++) l3.push("..");
          return l3 = l3.concat(o4.slice(_3)), l3.join("/");
        } }, FS_stdin_getChar_buffer = [], lengthBytesUTF8 = (e) => {
          for (var t2 = 0, r = 0; r < e.length; ++r) {
            var a2 = e.charCodeAt(r);
            a2 <= 127 ? t2++ : a2 <= 2047 ? t2 += 2 : a2 >= 55296 && a2 <= 57343 ? (t2 += 4, ++r) : t2 += 3;
          }
          return t2;
        }, stringToUTF8Array = (e, t2, r, a2) => {
          if (!(a2 > 0)) return 0;
          for (var o4 = r, s4 = r + a2 - 1, _3 = 0; _3 < e.length; ++_3) {
            var n3 = e.charCodeAt(_3);
            if (n3 >= 55296 && n3 <= 57343) {
              var l3 = e.charCodeAt(++_3);
              n3 = 65536 + ((n3 & 1023) << 10) | l3 & 1023;
            }
            if (n3 <= 127) {
              if (r >= s4) break;
              t2[r++] = n3;
            } else if (n3 <= 2047) {
              if (r + 1 >= s4) break;
              t2[r++] = 192 | n3 >> 6, t2[r++] = 128 | n3 & 63;
            } else if (n3 <= 65535) {
              if (r + 2 >= s4) break;
              t2[r++] = 224 | n3 >> 12, t2[r++] = 128 | n3 >> 6 & 63, t2[r++] = 128 | n3 & 63;
            } else {
              if (r + 3 >= s4) break;
              t2[r++] = 240 | n3 >> 18, t2[r++] = 128 | n3 >> 12 & 63, t2[r++] = 128 | n3 >> 6 & 63, t2[r++] = 128 | n3 & 63;
            }
          }
          return t2[r] = 0, r - o4;
        };
        function intArrayFromString(e, t2, r) {
          var a2 = r > 0 ? r : lengthBytesUTF8(e) + 1, o4 = new Array(a2), s4 = stringToUTF8Array(e, o4, 0, o4.length);
          return t2 && (o4.length = s4), o4;
        }
        var FS_stdin_getChar = () => {
          if (!FS_stdin_getChar_buffer.length) {
            var e = null;
            if (ENVIRONMENT_IS_NODE) {
              var t2 = 256, r = Buffer.alloc(t2), a2 = 0, o4 = process.stdin.fd;
              try {
                a2 = fs.readSync(o4, r, 0, t2);
              } catch (s4) {
                if (s4.toString().includes("EOF")) a2 = 0;
                else throw s4;
              }
              a2 > 0 && (e = r.slice(0, a2).toString("utf-8"));
            } else typeof window < "u" && typeof window.prompt == "function" && (e = window.prompt("Input: "), e !== null && (e += `
`));
            if (!e) return null;
            FS_stdin_getChar_buffer = intArrayFromString(e, true);
          }
          return FS_stdin_getChar_buffer.shift();
        }, TTY = { ttys: [], init() {
        }, shutdown() {
        }, register(e, t2) {
          TTY.ttys[e] = { input: [], output: [], ops: t2 }, FS.registerDevice(e, TTY.stream_ops);
        }, stream_ops: { open(e) {
          var t2 = TTY.ttys[e.node.rdev];
          if (!t2) throw new FS.ErrnoError(43);
          e.tty = t2, e.seekable = false;
        }, close(e) {
          e.tty.ops.fsync(e.tty);
        }, fsync(e) {
          e.tty.ops.fsync(e.tty);
        }, read(e, t2, r, a2, o4) {
          if (!e.tty || !e.tty.ops.get_char) throw new FS.ErrnoError(60);
          for (var s4 = 0, _3 = 0; _3 < a2; _3++) {
            var n3;
            try {
              n3 = e.tty.ops.get_char(e.tty);
            } catch {
              throw new FS.ErrnoError(29);
            }
            if (n3 === void 0 && s4 === 0) throw new FS.ErrnoError(6);
            if (n3 == null) break;
            s4++, t2[r + _3] = n3;
          }
          return s4 && (e.node.atime = Date.now()), s4;
        }, write(e, t2, r, a2, o4) {
          if (!e.tty || !e.tty.ops.put_char) throw new FS.ErrnoError(60);
          try {
            for (var s4 = 0; s4 < a2; s4++) e.tty.ops.put_char(e.tty, t2[r + s4]);
          } catch {
            throw new FS.ErrnoError(29);
          }
          return a2 && (e.node.mtime = e.node.ctime = Date.now()), s4;
        } }, default_tty_ops: { get_char(e) {
          return FS_stdin_getChar();
        }, put_char(e, t2) {
          t2 === null || t2 === 10 ? (out(UTF8ArrayToString(e.output)), e.output = []) : t2 != 0 && e.output.push(t2);
        }, fsync(e) {
          e.output && e.output.length > 0 && (out(UTF8ArrayToString(e.output)), e.output = []);
        }, ioctl_tcgets(e) {
          return { c_iflag: 25856, c_oflag: 5, c_cflag: 191, c_lflag: 35387, c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
        }, ioctl_tcsets(e, t2, r) {
          return 0;
        }, ioctl_tiocgwinsz(e) {
          return [24, 80];
        } }, default_tty1_ops: { put_char(e, t2) {
          t2 === null || t2 === 10 ? (err(UTF8ArrayToString(e.output)), e.output = []) : t2 != 0 && e.output.push(t2);
        }, fsync(e) {
          e.output && e.output.length > 0 && (err(UTF8ArrayToString(e.output)), e.output = []);
        } } }, zeroMemory = (e, t2) => {
          HEAPU8.fill(0, e, e + t2);
        }, mmapAlloc = (e) => {
          e = alignMemory(e, 65536);
          var t2 = _emscripten_builtin_memalign(65536, e);
          return t2 && zeroMemory(t2, e), t2;
        }, MEMFS = { ops_table: null, mount(e) {
          return MEMFS.createNode(null, "/", 16895, 0);
        }, createNode(e, t2, r, a2) {
          if (FS.isBlkdev(r) || FS.isFIFO(r)) throw new FS.ErrnoError(63);
          MEMFS.ops_table || (MEMFS.ops_table = { dir: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr, lookup: MEMFS.node_ops.lookup, mknod: MEMFS.node_ops.mknod, rename: MEMFS.node_ops.rename, unlink: MEMFS.node_ops.unlink, rmdir: MEMFS.node_ops.rmdir, readdir: MEMFS.node_ops.readdir, symlink: MEMFS.node_ops.symlink }, stream: { llseek: MEMFS.stream_ops.llseek } }, file: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr }, stream: { llseek: MEMFS.stream_ops.llseek, read: MEMFS.stream_ops.read, write: MEMFS.stream_ops.write, allocate: MEMFS.stream_ops.allocate, mmap: MEMFS.stream_ops.mmap, msync: MEMFS.stream_ops.msync } }, link: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr, readlink: MEMFS.node_ops.readlink }, stream: {} }, chrdev: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr }, stream: FS.chrdev_stream_ops } });
          var o4 = FS.createNode(e, t2, r, a2);
          return FS.isDir(o4.mode) ? (o4.node_ops = MEMFS.ops_table.dir.node, o4.stream_ops = MEMFS.ops_table.dir.stream, o4.contents = {}) : FS.isFile(o4.mode) ? (o4.node_ops = MEMFS.ops_table.file.node, o4.stream_ops = MEMFS.ops_table.file.stream, o4.usedBytes = 0, o4.contents = null) : FS.isLink(o4.mode) ? (o4.node_ops = MEMFS.ops_table.link.node, o4.stream_ops = MEMFS.ops_table.link.stream) : FS.isChrdev(o4.mode) && (o4.node_ops = MEMFS.ops_table.chrdev.node, o4.stream_ops = MEMFS.ops_table.chrdev.stream), o4.atime = o4.mtime = o4.ctime = Date.now(), e && (e.contents[t2] = o4, e.atime = e.mtime = e.ctime = o4.atime), o4;
        }, getFileDataAsTypedArray(e) {
          return e.contents ? e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents) : new Uint8Array(0);
        }, expandFileStorage(e, t2) {
          var r = e.contents ? e.contents.length : 0;
          if (!(r >= t2)) {
            var a2 = 1024 * 1024;
            t2 = Math.max(t2, r * (r < a2 ? 2 : 1.125) >>> 0), r != 0 && (t2 = Math.max(t2, 256));
            var o4 = e.contents;
            e.contents = new Uint8Array(t2), e.usedBytes > 0 && e.contents.set(o4.subarray(0, e.usedBytes), 0);
          }
        }, resizeFileStorage(e, t2) {
          if (e.usedBytes != t2) if (t2 == 0) e.contents = null, e.usedBytes = 0;
          else {
            var r = e.contents;
            e.contents = new Uint8Array(t2), r && e.contents.set(r.subarray(0, Math.min(t2, e.usedBytes))), e.usedBytes = t2;
          }
        }, node_ops: { getattr(e) {
          var t2 = {};
          return t2.dev = FS.isChrdev(e.mode) ? e.id : 1, t2.ino = e.id, t2.mode = e.mode, t2.nlink = 1, t2.uid = 0, t2.gid = 0, t2.rdev = e.rdev, FS.isDir(e.mode) ? t2.size = 4096 : FS.isFile(e.mode) ? t2.size = e.usedBytes : FS.isLink(e.mode) ? t2.size = e.link.length : t2.size = 0, t2.atime = new Date(e.atime), t2.mtime = new Date(e.mtime), t2.ctime = new Date(e.ctime), t2.blksize = 4096, t2.blocks = Math.ceil(t2.size / t2.blksize), t2;
        }, setattr(e, t2) {
          for (let r of ["mode", "atime", "mtime", "ctime"]) t2[r] && (e[r] = t2[r]);
          t2.size !== void 0 && MEMFS.resizeFileStorage(e, t2.size);
        }, lookup(e, t2) {
          throw MEMFS.doesNotExistError;
        }, mknod(e, t2, r, a2) {
          return MEMFS.createNode(e, t2, r, a2);
        }, rename(e, t2, r) {
          var a2;
          try {
            a2 = FS.lookupNode(t2, r);
          } catch {
          }
          if (a2) {
            if (FS.isDir(e.mode)) for (var o4 in a2.contents) throw new FS.ErrnoError(55);
            FS.hashRemoveNode(a2);
          }
          delete e.parent.contents[e.name], t2.contents[r] = e, e.name = r, t2.ctime = t2.mtime = e.parent.ctime = e.parent.mtime = Date.now();
        }, unlink(e, t2) {
          delete e.contents[t2], e.ctime = e.mtime = Date.now();
        }, rmdir(e, t2) {
          var r = FS.lookupNode(e, t2);
          for (var a2 in r.contents) throw new FS.ErrnoError(55);
          delete e.contents[t2], e.ctime = e.mtime = Date.now();
        }, readdir(e) {
          return [".", "..", ...Object.keys(e.contents)];
        }, symlink(e, t2, r) {
          var a2 = MEMFS.createNode(e, t2, 41471, 0);
          return a2.link = r, a2;
        }, readlink(e) {
          if (!FS.isLink(e.mode)) throw new FS.ErrnoError(28);
          return e.link;
        } }, stream_ops: { read(e, t2, r, a2, o4) {
          var s4 = e.node.contents;
          if (o4 >= e.node.usedBytes) return 0;
          var _3 = Math.min(e.node.usedBytes - o4, a2);
          if (_3 > 8 && s4.subarray) t2.set(s4.subarray(o4, o4 + _3), r);
          else for (var n3 = 0; n3 < _3; n3++) t2[r + n3] = s4[o4 + n3];
          return _3;
        }, write(e, t2, r, a2, o4, s4) {
          if (t2.buffer === HEAP8.buffer && (s4 = false), !a2) return 0;
          var _3 = e.node;
          if (_3.mtime = _3.ctime = Date.now(), t2.subarray && (!_3.contents || _3.contents.subarray)) {
            if (s4) return _3.contents = t2.subarray(r, r + a2), _3.usedBytes = a2, a2;
            if (_3.usedBytes === 0 && o4 === 0) return _3.contents = t2.slice(r, r + a2), _3.usedBytes = a2, a2;
            if (o4 + a2 <= _3.usedBytes) return _3.contents.set(t2.subarray(r, r + a2), o4), a2;
          }
          if (MEMFS.expandFileStorage(_3, o4 + a2), _3.contents.subarray && t2.subarray) _3.contents.set(t2.subarray(r, r + a2), o4);
          else for (var n3 = 0; n3 < a2; n3++) _3.contents[o4 + n3] = t2[r + n3];
          return _3.usedBytes = Math.max(_3.usedBytes, o4 + a2), a2;
        }, llseek(e, t2, r) {
          var a2 = t2;
          if (r === 1 ? a2 += e.position : r === 2 && FS.isFile(e.node.mode) && (a2 += e.node.usedBytes), a2 < 0) throw new FS.ErrnoError(28);
          return a2;
        }, allocate(e, t2, r) {
          MEMFS.expandFileStorage(e.node, t2 + r), e.node.usedBytes = Math.max(e.node.usedBytes, t2 + r);
        }, mmap(e, t2, r, a2, o4) {
          if (!FS.isFile(e.node.mode)) throw new FS.ErrnoError(43);
          var s4, _3, n3 = e.node.contents;
          if (!(o4 & 2) && n3 && n3.buffer === HEAP8.buffer) _3 = false, s4 = n3.byteOffset;
          else {
            if (_3 = true, s4 = mmapAlloc(t2), !s4) throw new FS.ErrnoError(48);
            n3 && ((r > 0 || r + t2 < n3.length) && (n3.subarray ? n3 = n3.subarray(r, r + t2) : n3 = Array.prototype.slice.call(n3, r, r + t2)), HEAP8.set(n3, s4));
          }
          return { ptr: s4, allocated: _3 };
        }, msync(e, t2, r, a2, o4) {
          return MEMFS.stream_ops.write(e, t2, 0, a2, r, false), 0;
        } } }, FS_createDataFile = (e, t2, r, a2, o4, s4) => {
          FS.createDataFile(e, t2, r, a2, o4, s4);
        }, FS_handledByPreloadPlugin = (e, t2, r, a2) => {
          typeof Browser < "u" && Browser.init();
          var o4 = false;
          return preloadPlugins.forEach((s4) => {
            o4 || s4.canHandle(t2) && (s4.handle(e, t2, r, a2), o4 = true);
          }), o4;
        }, FS_createPreloadedFile = (e, t2, r, a2, o4, s4, _3, n3, l3, d2) => {
          var p4 = t2 ? PATH_FS.resolve(PATH.join2(e, t2)) : e, m4 = `cp ${p4}`;
          function g5(u2) {
            function f3(c2) {
              d2?.(), n3 || FS_createDataFile(e, t2, c2, a2, o4, l3), s4?.(), removeRunDependency(m4);
            }
            FS_handledByPreloadPlugin(u2, p4, f3, () => {
              _3?.(), removeRunDependency(m4);
            }) || f3(u2);
          }
          addRunDependency(m4), typeof r == "string" ? asyncLoad(r).then(g5, _3) : g5(r);
        }, FS_modeStringToFlags = (e) => {
          var t2 = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }, r = t2[e];
          if (typeof r > "u") throw new Error(`Unknown file open mode: ${e}`);
          return r;
        }, FS_getMode = (e, t2) => {
          var r = 0;
          return e && (r |= 365), t2 && (r |= 146), r;
        }, IDBFS = { dbs: {}, indexedDB: () => {
          if (typeof indexedDB < "u") return indexedDB;
          var e = null;
          return typeof window == "object" && (e = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), e;
        }, DB_VERSION: 21, DB_STORE_NAME: "FILE_DATA", queuePersist: (e) => {
          function t2() {
            e.idbPersistState === "again" ? r() : e.idbPersistState = 0;
          }
          function r() {
            e.idbPersistState = "idb", IDBFS.syncfs(e, false, t2);
          }
          e.idbPersistState ? e.idbPersistState === "idb" && (e.idbPersistState = "again") : e.idbPersistState = setTimeout(r, 0);
        }, mount: (e) => {
          var t2 = MEMFS.mount(e);
          if (e?.opts?.autoPersist) {
            t2.idbPersistState = 0;
            var r = t2.node_ops;
            t2.node_ops = Object.assign({}, t2.node_ops), t2.node_ops.mknod = (a2, o4, s4, _3) => {
              var n3 = r.mknod(a2, o4, s4, _3);
              return n3.node_ops = t2.node_ops, n3.idbfs_mount = t2.mount, n3.memfs_stream_ops = n3.stream_ops, n3.stream_ops = Object.assign({}, n3.stream_ops), n3.stream_ops.write = (l3, d2, p4, m4, g5, u2) => (l3.node.isModified = true, n3.memfs_stream_ops.write(l3, d2, p4, m4, g5, u2)), n3.stream_ops.close = (l3) => {
                var d2 = l3.node;
                if (d2.isModified && (IDBFS.queuePersist(d2.idbfs_mount), d2.isModified = false), d2.memfs_stream_ops.close) return d2.memfs_stream_ops.close(l3);
              }, n3;
            }, t2.node_ops.mkdir = (...a2) => (IDBFS.queuePersist(t2.mount), r.mkdir(...a2)), t2.node_ops.rmdir = (...a2) => (IDBFS.queuePersist(t2.mount), r.rmdir(...a2)), t2.node_ops.symlink = (...a2) => (IDBFS.queuePersist(t2.mount), r.symlink(...a2)), t2.node_ops.unlink = (...a2) => (IDBFS.queuePersist(t2.mount), r.unlink(...a2)), t2.node_ops.rename = (...a2) => (IDBFS.queuePersist(t2.mount), r.rename(...a2));
          }
          return t2;
        }, syncfs: (e, t2, r) => {
          IDBFS.getLocalSet(e, (a2, o4) => {
            if (a2) return r(a2);
            IDBFS.getRemoteSet(e, (s4, _3) => {
              if (s4) return r(s4);
              var n3 = t2 ? _3 : o4, l3 = t2 ? o4 : _3;
              IDBFS.reconcile(n3, l3, r);
            });
          });
        }, quit: () => {
          Object.values(IDBFS.dbs).forEach((e) => e.close()), IDBFS.dbs = {};
        }, getDB: (e, t2) => {
          var r = IDBFS.dbs[e];
          if (r) return t2(null, r);
          var a2;
          try {
            a2 = IDBFS.indexedDB().open(e, IDBFS.DB_VERSION);
          } catch (o4) {
            return t2(o4);
          }
          if (!a2) return t2("Unable to connect to IndexedDB");
          a2.onupgradeneeded = (o4) => {
            var s4 = o4.target.result, _3 = o4.target.transaction, n3;
            s4.objectStoreNames.contains(IDBFS.DB_STORE_NAME) ? n3 = _3.objectStore(IDBFS.DB_STORE_NAME) : n3 = s4.createObjectStore(IDBFS.DB_STORE_NAME), n3.indexNames.contains("timestamp") || n3.createIndex("timestamp", "timestamp", { unique: false });
          }, a2.onsuccess = () => {
            r = a2.result, IDBFS.dbs[e] = r, t2(null, r);
          }, a2.onerror = (o4) => {
            t2(o4.target.error), o4.preventDefault();
          };
        }, getLocalSet: (e, t2) => {
          var r = {};
          function a2(l3) {
            return l3 !== "." && l3 !== "..";
          }
          function o4(l3) {
            return (d2) => PATH.join2(l3, d2);
          }
          for (var s4 = FS.readdir(e.mountpoint).filter(a2).map(o4(e.mountpoint)); s4.length; ) {
            var _3 = s4.pop(), n3;
            try {
              n3 = FS.stat(_3);
            } catch (l3) {
              return t2(l3);
            }
            FS.isDir(n3.mode) && s4.push(...FS.readdir(_3).filter(a2).map(o4(_3))), r[_3] = { timestamp: n3.mtime };
          }
          return t2(null, { type: "local", entries: r });
        }, getRemoteSet: (e, t2) => {
          var r = {};
          IDBFS.getDB(e.mountpoint, (a2, o4) => {
            if (a2) return t2(a2);
            try {
              var s4 = o4.transaction([IDBFS.DB_STORE_NAME], "readonly");
              s4.onerror = (l3) => {
                t2(l3.target.error), l3.preventDefault();
              };
              var _3 = s4.objectStore(IDBFS.DB_STORE_NAME), n3 = _3.index("timestamp");
              n3.openKeyCursor().onsuccess = (l3) => {
                var d2 = l3.target.result;
                if (!d2) return t2(null, { type: "remote", db: o4, entries: r });
                r[d2.primaryKey] = { timestamp: d2.key }, d2.continue();
              };
            } catch (l3) {
              return t2(l3);
            }
          });
        }, loadLocalEntry: (e, t2) => {
          var r, a2;
          try {
            var o4 = FS.lookupPath(e);
            a2 = o4.node, r = FS.stat(e);
          } catch (s4) {
            return t2(s4);
          }
          return FS.isDir(r.mode) ? t2(null, { timestamp: r.mtime, mode: r.mode }) : FS.isFile(r.mode) ? (a2.contents = MEMFS.getFileDataAsTypedArray(a2), t2(null, { timestamp: r.mtime, mode: r.mode, contents: a2.contents })) : t2(new Error("node type not supported"));
        }, storeLocalEntry: (e, t2, r) => {
          try {
            if (FS.isDir(t2.mode)) FS.mkdirTree(e, t2.mode);
            else if (FS.isFile(t2.mode)) FS.writeFile(e, t2.contents, { canOwn: true });
            else return r(new Error("node type not supported"));
            FS.chmod(e, t2.mode), FS.utime(e, t2.timestamp, t2.timestamp);
          } catch (a2) {
            return r(a2);
          }
          r(null);
        }, removeLocalEntry: (e, t2) => {
          try {
            var r = FS.stat(e);
            FS.isDir(r.mode) ? FS.rmdir(e) : FS.isFile(r.mode) && FS.unlink(e);
          } catch (a2) {
            return t2(a2);
          }
          t2(null);
        }, loadRemoteEntry: (e, t2, r) => {
          var a2 = e.get(t2);
          a2.onsuccess = (o4) => r(null, o4.target.result), a2.onerror = (o4) => {
            r(o4.target.error), o4.preventDefault();
          };
        }, storeRemoteEntry: (e, t2, r, a2) => {
          try {
            var o4 = e.put(r, t2);
          } catch (s4) {
            a2(s4);
            return;
          }
          o4.onsuccess = (s4) => a2(), o4.onerror = (s4) => {
            a2(s4.target.error), s4.preventDefault();
          };
        }, removeRemoteEntry: (e, t2, r) => {
          var a2 = e.delete(t2);
          a2.onsuccess = (o4) => r(), a2.onerror = (o4) => {
            r(o4.target.error), o4.preventDefault();
          };
        }, reconcile: (e, t2, r) => {
          var a2 = 0, o4 = [];
          Object.keys(e.entries).forEach((m4) => {
            var g5 = e.entries[m4], u2 = t2.entries[m4];
            (!u2 || g5.timestamp.getTime() != u2.timestamp.getTime()) && (o4.push(m4), a2++);
          });
          var s4 = [];
          if (Object.keys(t2.entries).forEach((m4) => {
            e.entries[m4] || (s4.push(m4), a2++);
          }), !a2) return r(null);
          var _3 = false, n3 = e.type === "remote" ? e.db : t2.db, l3 = n3.transaction([IDBFS.DB_STORE_NAME], "readwrite"), d2 = l3.objectStore(IDBFS.DB_STORE_NAME);
          function p4(m4) {
            if (m4 && !_3) return _3 = true, r(m4);
          }
          l3.onerror = l3.onabort = (m4) => {
            p4(m4.target.error), m4.preventDefault();
          }, l3.oncomplete = (m4) => {
            _3 || r(null);
          }, o4.sort().forEach((m4) => {
            t2.type === "local" ? IDBFS.loadRemoteEntry(d2, m4, (g5, u2) => {
              if (g5) return p4(g5);
              IDBFS.storeLocalEntry(m4, u2, p4);
            }) : IDBFS.loadLocalEntry(m4, (g5, u2) => {
              if (g5) return p4(g5);
              IDBFS.storeRemoteEntry(d2, m4, u2, p4);
            });
          }), s4.sort().reverse().forEach((m4) => {
            t2.type === "local" ? IDBFS.removeLocalEntry(m4, p4) : IDBFS.removeRemoteEntry(d2, m4, p4);
          });
        } }, ERRNO_CODES = { EPERM: 63, ENOENT: 44, ESRCH: 71, EINTR: 27, EIO: 29, ENXIO: 60, E2BIG: 1, ENOEXEC: 45, EBADF: 8, ECHILD: 12, EAGAIN: 6, EWOULDBLOCK: 6, ENOMEM: 48, EACCES: 2, EFAULT: 21, ENOTBLK: 105, EBUSY: 10, EEXIST: 20, EXDEV: 75, ENODEV: 43, ENOTDIR: 54, EISDIR: 31, EINVAL: 28, ENFILE: 41, EMFILE: 33, ENOTTY: 59, ETXTBSY: 74, EFBIG: 22, ENOSPC: 51, ESPIPE: 70, EROFS: 69, EMLINK: 34, EPIPE: 64, EDOM: 18, ERANGE: 68, ENOMSG: 49, EIDRM: 24, ECHRNG: 106, EL2NSYNC: 156, EL3HLT: 107, EL3RST: 108, ELNRNG: 109, EUNATCH: 110, ENOCSI: 111, EL2HLT: 112, EDEADLK: 16, ENOLCK: 46, EBADE: 113, EBADR: 114, EXFULL: 115, ENOANO: 104, EBADRQC: 103, EBADSLT: 102, EDEADLOCK: 16, EBFONT: 101, ENOSTR: 100, ENODATA: 116, ETIME: 117, ENOSR: 118, ENONET: 119, ENOPKG: 120, EREMOTE: 121, ENOLINK: 47, EADV: 122, ESRMNT: 123, ECOMM: 124, EPROTO: 65, EMULTIHOP: 36, EDOTDOT: 125, EBADMSG: 9, ENOTUNIQ: 126, EBADFD: 127, EREMCHG: 128, ELIBACC: 129, ELIBBAD: 130, ELIBSCN: 131, ELIBMAX: 132, ELIBEXEC: 133, ENOSYS: 52, ENOTEMPTY: 55, ENAMETOOLONG: 37, ELOOP: 32, EOPNOTSUPP: 138, EPFNOSUPPORT: 139, ECONNRESET: 15, ENOBUFS: 42, EAFNOSUPPORT: 5, EPROTOTYPE: 67, ENOTSOCK: 57, ENOPROTOOPT: 50, ESHUTDOWN: 140, ECONNREFUSED: 14, EADDRINUSE: 3, ECONNABORTED: 13, ENETUNREACH: 40, ENETDOWN: 38, ETIMEDOUT: 73, EHOSTDOWN: 142, EHOSTUNREACH: 23, EINPROGRESS: 26, EALREADY: 7, EDESTADDRREQ: 17, EMSGSIZE: 35, EPROTONOSUPPORT: 66, ESOCKTNOSUPPORT: 137, EADDRNOTAVAIL: 4, ENETRESET: 39, EISCONN: 30, ENOTCONN: 53, ETOOMANYREFS: 141, EUSERS: 136, EDQUOT: 19, ESTALE: 72, ENOTSUP: 138, ENOMEDIUM: 148, EILSEQ: 25, EOVERFLOW: 61, ECANCELED: 11, ENOTRECOVERABLE: 56, EOWNERDEAD: 62, ESTRPIPE: 135 }, NODEFS = { isWindows: false, staticInit() {
          NODEFS.isWindows = !!process.platform.match(/^win/);
          var e = process.binding("constants");
          e.fs && (e = e.fs), NODEFS.flagsForNodeMap = { 1024: e.O_APPEND, 64: e.O_CREAT, 128: e.O_EXCL, 256: e.O_NOCTTY, 0: e.O_RDONLY, 2: e.O_RDWR, 4096: e.O_SYNC, 512: e.O_TRUNC, 1: e.O_WRONLY, 131072: e.O_NOFOLLOW };
        }, convertNodeCode(e) {
          var t2 = e.code;
          return ERRNO_CODES[t2];
        }, tryFSOperation(e) {
          try {
            return e();
          } catch (t2) {
            throw t2.code ? t2.code === "UNKNOWN" ? new FS.ErrnoError(28) : new FS.ErrnoError(NODEFS.convertNodeCode(t2)) : t2;
          }
        }, mount(e) {
          return NODEFS.createNode(null, "/", NODEFS.getMode(e.opts.root), 0);
        }, createNode(e, t2, r, a2) {
          if (!FS.isDir(r) && !FS.isFile(r) && !FS.isLink(r)) throw new FS.ErrnoError(28);
          var o4 = FS.createNode(e, t2, r);
          return o4.node_ops = NODEFS.node_ops, o4.stream_ops = NODEFS.stream_ops, o4;
        }, getMode(e) {
          return NODEFS.tryFSOperation(() => {
            var t2 = fs.lstatSync(e).mode;
            return NODEFS.isWindows && (t2 |= (t2 & 292) >> 2), t2;
          });
        }, realPath(e) {
          for (var t2 = []; e.parent !== e; ) t2.push(e.name), e = e.parent;
          return t2.push(e.mount.opts.root), t2.reverse(), PATH.join(...t2);
        }, flagsForNode(e) {
          e &= -2097153, e &= -2049, e &= -32769, e &= -524289, e &= -65537;
          var t2 = 0;
          for (var r in NODEFS.flagsForNodeMap) e & r && (t2 |= NODEFS.flagsForNodeMap[r], e ^= r);
          if (e) throw new FS.ErrnoError(28);
          return t2;
        }, node_ops: { getattr(e) {
          var t2 = NODEFS.realPath(e), r;
          return NODEFS.tryFSOperation(() => r = fs.lstatSync(t2)), NODEFS.isWindows && (r.blksize || (r.blksize = 4096), r.blocks || (r.blocks = (r.size + r.blksize - 1) / r.blksize | 0), r.mode |= (r.mode & 292) >> 2), { dev: r.dev, ino: r.ino, mode: r.mode, nlink: r.nlink, uid: r.uid, gid: r.gid, rdev: r.rdev, size: r.size, atime: r.atime, mtime: r.mtime, ctime: r.ctime, blksize: r.blksize, blocks: r.blocks };
        }, setattr(e, t2) {
          var r = NODEFS.realPath(e);
          NODEFS.tryFSOperation(() => {
            if (t2.mode !== void 0) {
              var a2 = t2.mode;
              NODEFS.isWindows && (a2 &= 384), fs.chmodSync(r, a2), e.mode = t2.mode;
            }
            if (t2.atime || t2.mtime) {
              var o4 = t2.atime && new Date(t2.atime), s4 = t2.mtime && new Date(t2.mtime);
              fs.utimesSync(r, o4, s4);
            }
            t2.size !== void 0 && fs.truncateSync(r, t2.size);
          });
        }, lookup(e, t2) {
          var r = PATH.join2(NODEFS.realPath(e), t2), a2 = NODEFS.getMode(r);
          return NODEFS.createNode(e, t2, a2);
        }, mknod(e, t2, r, a2) {
          var o4 = NODEFS.createNode(e, t2, r, a2), s4 = NODEFS.realPath(o4);
          return NODEFS.tryFSOperation(() => {
            FS.isDir(o4.mode) ? fs.mkdirSync(s4, o4.mode) : fs.writeFileSync(s4, "", { mode: o4.mode });
          }), o4;
        }, rename(e, t2, r) {
          var a2 = NODEFS.realPath(e), o4 = PATH.join2(NODEFS.realPath(t2), r);
          try {
            FS.unlink(o4);
          } catch {
          }
          NODEFS.tryFSOperation(() => fs.renameSync(a2, o4)), e.name = r;
        }, unlink(e, t2) {
          var r = PATH.join2(NODEFS.realPath(e), t2);
          NODEFS.tryFSOperation(() => fs.unlinkSync(r));
        }, rmdir(e, t2) {
          var r = PATH.join2(NODEFS.realPath(e), t2);
          NODEFS.tryFSOperation(() => fs.rmdirSync(r));
        }, readdir(e) {
          var t2 = NODEFS.realPath(e);
          return NODEFS.tryFSOperation(() => fs.readdirSync(t2));
        }, symlink(e, t2, r) {
          var a2 = PATH.join2(NODEFS.realPath(e), t2);
          NODEFS.tryFSOperation(() => fs.symlinkSync(r, a2));
        }, readlink(e) {
          var t2 = NODEFS.realPath(e);
          return NODEFS.tryFSOperation(() => fs.readlinkSync(t2));
        }, statfs(e) {
          var t2 = NODEFS.tryFSOperation(() => fs.statfsSync(e));
          return t2.frsize = t2.bsize, t2;
        } }, stream_ops: { open(e) {
          var t2 = NODEFS.realPath(e.node);
          NODEFS.tryFSOperation(() => {
            FS.isFile(e.node.mode) && (e.shared.refcount = 1, e.nfd = fs.openSync(t2, NODEFS.flagsForNode(e.flags)));
          });
        }, close(e) {
          NODEFS.tryFSOperation(() => {
            FS.isFile(e.node.mode) && e.nfd && --e.shared.refcount === 0 && fs.closeSync(e.nfd);
          });
        }, dup(e) {
          e.shared.refcount++;
        }, read(e, t2, r, a2, o4) {
          return a2 === 0 ? 0 : NODEFS.tryFSOperation(() => fs.readSync(e.nfd, new Int8Array(t2.buffer, r, a2), 0, a2, o4));
        }, write(e, t2, r, a2, o4) {
          return NODEFS.tryFSOperation(() => fs.writeSync(e.nfd, new Int8Array(t2.buffer, r, a2), 0, a2, o4));
        }, llseek(e, t2, r) {
          var a2 = t2;
          if (r === 1 ? a2 += e.position : r === 2 && FS.isFile(e.node.mode) && NODEFS.tryFSOperation(() => {
            var o4 = fs.fstatSync(e.nfd);
            a2 += o4.size;
          }), a2 < 0) throw new FS.ErrnoError(28);
          return a2;
        }, mmap(e, t2, r, a2, o4) {
          if (!FS.isFile(e.node.mode)) throw new FS.ErrnoError(43);
          var s4 = mmapAlloc(t2);
          return NODEFS.stream_ops.read(e, HEAP8, s4, t2, r), { ptr: s4, allocated: true };
        }, msync(e, t2, r, a2, o4) {
          return NODEFS.stream_ops.write(e, t2, 0, a2, r, false), 0;
        } } }, FS = { root: null, mounts: [], devices: {}, streams: [], nextInode: 1, nameTable: null, currentPath: "/", initialized: false, ignorePermissions: true, ErrnoError: class {
          constructor(e) {
            P(this, "name", "ErrnoError");
            this.errno = e;
          }
        }, filesystems: null, syncFSRequests: 0, readFiles: {}, FSStream: class {
          constructor() {
            P(this, "shared", {});
          }
          get object() {
            return this.node;
          }
          set object(e) {
            this.node = e;
          }
          get isRead() {
            return (this.flags & 2097155) !== 1;
          }
          get isWrite() {
            return (this.flags & 2097155) !== 0;
          }
          get isAppend() {
            return this.flags & 1024;
          }
          get flags() {
            return this.shared.flags;
          }
          set flags(e) {
            this.shared.flags = e;
          }
          get position() {
            return this.shared.position;
          }
          set position(e) {
            this.shared.position = e;
          }
        }, FSNode: class {
          constructor(e, t2, r, a2) {
            P(this, "node_ops", {});
            P(this, "stream_ops", {});
            P(this, "readMode", 365);
            P(this, "writeMode", 146);
            P(this, "mounted", null);
            e || (e = this), this.parent = e, this.mount = e.mount, this.id = FS.nextInode++, this.name = t2, this.mode = r, this.rdev = a2, this.atime = this.mtime = this.ctime = Date.now();
          }
          get read() {
            return (this.mode & this.readMode) === this.readMode;
          }
          set read(e) {
            e ? this.mode |= this.readMode : this.mode &= ~this.readMode;
          }
          get write() {
            return (this.mode & this.writeMode) === this.writeMode;
          }
          set write(e) {
            e ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
          }
          get isFolder() {
            return FS.isDir(this.mode);
          }
          get isDevice() {
            return FS.isChrdev(this.mode);
          }
        }, lookupPath(e, t2 = {}) {
          if (!e) return { path: "", node: null };
          t2.follow_mount ?? (t2.follow_mount = true), PATH.isAbs(e) || (e = FS.cwd() + "/" + e);
          e: for (var r = 0; r < 40; r++) {
            for (var a2 = e.split("/").filter((d2) => !!d2 && d2 !== "."), o4 = FS.root, s4 = "/", _3 = 0; _3 < a2.length; _3++) {
              var n3 = _3 === a2.length - 1;
              if (n3 && t2.parent) break;
              if (a2[_3] === "..") {
                s4 = PATH.dirname(s4), o4 = o4.parent;
                continue;
              }
              s4 = PATH.join2(s4, a2[_3]);
              try {
                o4 = FS.lookupNode(o4, a2[_3]);
              } catch (d2) {
                if (d2?.errno === 44 && n3 && t2.noent_okay) return { path: s4 };
                throw d2;
              }
              if (FS.isMountpoint(o4) && (!n3 || t2.follow_mount) && (o4 = o4.mounted.root), FS.isLink(o4.mode) && (!n3 || t2.follow)) {
                if (!o4.node_ops.readlink) throw new FS.ErrnoError(52);
                var l3 = o4.node_ops.readlink(o4);
                PATH.isAbs(l3) || (l3 = PATH.dirname(s4) + "/" + l3), e = l3 + "/" + a2.slice(_3 + 1).join("/");
                continue e;
              }
            }
            return { path: s4, node: o4 };
          }
          throw new FS.ErrnoError(32);
        }, getPath(e) {
          for (var t2; ; ) {
            if (FS.isRoot(e)) {
              var r = e.mount.mountpoint;
              return t2 ? r[r.length - 1] !== "/" ? `${r}/${t2}` : r + t2 : r;
            }
            t2 = t2 ? `${e.name}/${t2}` : e.name, e = e.parent;
          }
        }, hashName(e, t2) {
          for (var r = 0, a2 = 0; a2 < t2.length; a2++) r = (r << 5) - r + t2.charCodeAt(a2) | 0;
          return (e + r >>> 0) % FS.nameTable.length;
        }, hashAddNode(e) {
          var t2 = FS.hashName(e.parent.id, e.name);
          e.name_next = FS.nameTable[t2], FS.nameTable[t2] = e;
        }, hashRemoveNode(e) {
          var t2 = FS.hashName(e.parent.id, e.name);
          if (FS.nameTable[t2] === e) FS.nameTable[t2] = e.name_next;
          else for (var r = FS.nameTable[t2]; r; ) {
            if (r.name_next === e) {
              r.name_next = e.name_next;
              break;
            }
            r = r.name_next;
          }
        }, lookupNode(e, t2) {
          var r = FS.mayLookup(e);
          if (r) throw new FS.ErrnoError(r);
          for (var a2 = FS.hashName(e.id, t2), o4 = FS.nameTable[a2]; o4; o4 = o4.name_next) {
            var s4 = o4.name;
            if (o4.parent.id === e.id && s4 === t2) return o4;
          }
          return FS.lookup(e, t2);
        }, createNode(e, t2, r, a2) {
          var o4 = new FS.FSNode(e, t2, r, a2);
          return FS.hashAddNode(o4), o4;
        }, destroyNode(e) {
          FS.hashRemoveNode(e);
        }, isRoot(e) {
          return e === e.parent;
        }, isMountpoint(e) {
          return !!e.mounted;
        }, isFile(e) {
          return (e & 61440) === 32768;
        }, isDir(e) {
          return (e & 61440) === 16384;
        }, isLink(e) {
          return (e & 61440) === 40960;
        }, isChrdev(e) {
          return (e & 61440) === 8192;
        }, isBlkdev(e) {
          return (e & 61440) === 24576;
        }, isFIFO(e) {
          return (e & 61440) === 4096;
        }, isSocket(e) {
          return (e & 49152) === 49152;
        }, flagsToPermissionString(e) {
          var t2 = ["r", "w", "rw"][e & 3];
          return e & 512 && (t2 += "w"), t2;
        }, nodePermissions(e, t2) {
          return FS.ignorePermissions ? 0 : t2.includes("r") && !(e.mode & 292) || t2.includes("w") && !(e.mode & 146) || t2.includes("x") && !(e.mode & 73) ? 2 : 0;
        }, mayLookup(e) {
          if (!FS.isDir(e.mode)) return 54;
          var t2 = FS.nodePermissions(e, "x");
          return t2 || (e.node_ops.lookup ? 0 : 2);
        }, mayCreate(e, t2) {
          if (!FS.isDir(e.mode)) return 54;
          try {
            var r = FS.lookupNode(e, t2);
            return 20;
          } catch {
          }
          return FS.nodePermissions(e, "wx");
        }, mayDelete(e, t2, r) {
          var a2;
          try {
            a2 = FS.lookupNode(e, t2);
          } catch (s4) {
            return s4.errno;
          }
          var o4 = FS.nodePermissions(e, "wx");
          if (o4) return o4;
          if (r) {
            if (!FS.isDir(a2.mode)) return 54;
            if (FS.isRoot(a2) || FS.getPath(a2) === FS.cwd()) return 10;
          } else if (FS.isDir(a2.mode)) return 31;
          return 0;
        }, mayOpen(e, t2) {
          return e ? FS.isLink(e.mode) ? 32 : FS.isDir(e.mode) && (FS.flagsToPermissionString(t2) !== "r" || t2 & 512) ? 31 : FS.nodePermissions(e, FS.flagsToPermissionString(t2)) : 44;
        }, MAX_OPEN_FDS: 4096, nextfd() {
          for (var e = 0; e <= FS.MAX_OPEN_FDS; e++) if (!FS.streams[e]) return e;
          throw new FS.ErrnoError(33);
        }, getStreamChecked(e) {
          var t2 = FS.getStream(e);
          if (!t2) throw new FS.ErrnoError(8);
          return t2;
        }, getStream: (e) => FS.streams[e], createStream(e, t2 = -1) {
          return e = Object.assign(new FS.FSStream(), e), t2 == -1 && (t2 = FS.nextfd()), e.fd = t2, FS.streams[t2] = e, e;
        }, closeStream(e) {
          FS.streams[e] = null;
        }, dupStream(e, t2 = -1) {
          var r = FS.createStream(e, t2);
          return r.stream_ops?.dup?.(r), r;
        }, chrdev_stream_ops: { open(e) {
          var t2 = FS.getDevice(e.node.rdev);
          e.stream_ops = t2.stream_ops, e.stream_ops.open?.(e);
        }, llseek() {
          throw new FS.ErrnoError(70);
        } }, major: (e) => e >> 8, minor: (e) => e & 255, makedev: (e, t2) => e << 8 | t2, registerDevice(e, t2) {
          FS.devices[e] = { stream_ops: t2 };
        }, getDevice: (e) => FS.devices[e], getMounts(e) {
          for (var t2 = [], r = [e]; r.length; ) {
            var a2 = r.pop();
            t2.push(a2), r.push(...a2.mounts);
          }
          return t2;
        }, syncfs(e, t2) {
          typeof e == "function" && (t2 = e, e = false), FS.syncFSRequests++, FS.syncFSRequests > 1 && err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
          var r = FS.getMounts(FS.root.mount), a2 = 0;
          function o4(_3) {
            return FS.syncFSRequests--, t2(_3);
          }
          function s4(_3) {
            if (_3) return s4.errored ? void 0 : (s4.errored = true, o4(_3));
            ++a2 >= r.length && o4(null);
          }
          r.forEach((_3) => {
            if (!_3.type.syncfs) return s4(null);
            _3.type.syncfs(_3, e, s4);
          });
        }, mount(e, t2, r) {
          var a2 = r === "/", o4 = !r, s4;
          if (a2 && FS.root) throw new FS.ErrnoError(10);
          if (!a2 && !o4) {
            var _3 = FS.lookupPath(r, { follow_mount: false });
            if (r = _3.path, s4 = _3.node, FS.isMountpoint(s4)) throw new FS.ErrnoError(10);
            if (!FS.isDir(s4.mode)) throw new FS.ErrnoError(54);
          }
          var n3 = { type: e, opts: t2, mountpoint: r, mounts: [] }, l3 = e.mount(n3);
          return l3.mount = n3, n3.root = l3, a2 ? FS.root = l3 : s4 && (s4.mounted = n3, s4.mount && s4.mount.mounts.push(n3)), l3;
        }, unmount(e) {
          var t2 = FS.lookupPath(e, { follow_mount: false });
          if (!FS.isMountpoint(t2.node)) throw new FS.ErrnoError(28);
          var r = t2.node, a2 = r.mounted, o4 = FS.getMounts(a2);
          Object.keys(FS.nameTable).forEach((_3) => {
            for (var n3 = FS.nameTable[_3]; n3; ) {
              var l3 = n3.name_next;
              o4.includes(n3.mount) && FS.destroyNode(n3), n3 = l3;
            }
          }), r.mounted = null;
          var s4 = r.mount.mounts.indexOf(a2);
          r.mount.mounts.splice(s4, 1);
        }, lookup(e, t2) {
          return e.node_ops.lookup(e, t2);
        }, mknod(e, t2, r) {
          var a2 = FS.lookupPath(e, { parent: true }), o4 = a2.node, s4 = PATH.basename(e);
          if (!s4 || s4 === "." || s4 === "..") throw new FS.ErrnoError(28);
          var _3 = FS.mayCreate(o4, s4);
          if (_3) throw new FS.ErrnoError(_3);
          if (!o4.node_ops.mknod) throw new FS.ErrnoError(63);
          return o4.node_ops.mknod(o4, s4, t2, r);
        }, statfs(e) {
          var t2 = { bsize: 4096, frsize: 4096, blocks: 1e6, bfree: 5e5, bavail: 5e5, files: FS.nextInode, ffree: FS.nextInode - 1, fsid: 42, flags: 2, namelen: 255 }, r = FS.lookupPath(e, { follow: true }).node;
          return r?.node_ops.statfs && Object.assign(t2, r.node_ops.statfs(r.mount.opts.root)), t2;
        }, create(e, t2 = 438) {
          return t2 &= 4095, t2 |= 32768, FS.mknod(e, t2, 0);
        }, mkdir(e, t2 = 511) {
          return t2 &= 1023, t2 |= 16384, FS.mknod(e, t2, 0);
        }, mkdirTree(e, t2) {
          for (var r = e.split("/"), a2 = "", o4 = 0; o4 < r.length; ++o4) if (r[o4]) {
            a2 += "/" + r[o4];
            try {
              FS.mkdir(a2, t2);
            } catch (s4) {
              if (s4.errno != 20) throw s4;
            }
          }
        }, mkdev(e, t2, r) {
          return typeof r > "u" && (r = t2, t2 = 438), t2 |= 8192, FS.mknod(e, t2, r);
        }, symlink(e, t2) {
          if (!PATH_FS.resolve(e)) throw new FS.ErrnoError(44);
          var r = FS.lookupPath(t2, { parent: true }), a2 = r.node;
          if (!a2) throw new FS.ErrnoError(44);
          var o4 = PATH.basename(t2), s4 = FS.mayCreate(a2, o4);
          if (s4) throw new FS.ErrnoError(s4);
          if (!a2.node_ops.symlink) throw new FS.ErrnoError(63);
          return a2.node_ops.symlink(a2, o4, e);
        }, rename(e, t2) {
          var r = PATH.dirname(e), a2 = PATH.dirname(t2), o4 = PATH.basename(e), s4 = PATH.basename(t2), _3, n3, l3;
          if (_3 = FS.lookupPath(e, { parent: true }), n3 = _3.node, _3 = FS.lookupPath(t2, { parent: true }), l3 = _3.node, !n3 || !l3) throw new FS.ErrnoError(44);
          if (n3.mount !== l3.mount) throw new FS.ErrnoError(75);
          var d2 = FS.lookupNode(n3, o4), p4 = PATH_FS.relative(e, a2);
          if (p4.charAt(0) !== ".") throw new FS.ErrnoError(28);
          if (p4 = PATH_FS.relative(t2, r), p4.charAt(0) !== ".") throw new FS.ErrnoError(55);
          var m4;
          try {
            m4 = FS.lookupNode(l3, s4);
          } catch {
          }
          if (d2 !== m4) {
            var g5 = FS.isDir(d2.mode), u2 = FS.mayDelete(n3, o4, g5);
            if (u2) throw new FS.ErrnoError(u2);
            if (u2 = m4 ? FS.mayDelete(l3, s4, g5) : FS.mayCreate(l3, s4), u2) throw new FS.ErrnoError(u2);
            if (!n3.node_ops.rename) throw new FS.ErrnoError(63);
            if (FS.isMountpoint(d2) || m4 && FS.isMountpoint(m4)) throw new FS.ErrnoError(10);
            if (l3 !== n3 && (u2 = FS.nodePermissions(n3, "w"), u2)) throw new FS.ErrnoError(u2);
            FS.hashRemoveNode(d2);
            try {
              n3.node_ops.rename(d2, l3, s4), d2.parent = l3;
            } catch (f3) {
              throw f3;
            } finally {
              FS.hashAddNode(d2);
            }
          }
        }, rmdir(e) {
          var t2 = FS.lookupPath(e, { parent: true }), r = t2.node, a2 = PATH.basename(e), o4 = FS.lookupNode(r, a2), s4 = FS.mayDelete(r, a2, true);
          if (s4) throw new FS.ErrnoError(s4);
          if (!r.node_ops.rmdir) throw new FS.ErrnoError(63);
          if (FS.isMountpoint(o4)) throw new FS.ErrnoError(10);
          r.node_ops.rmdir(r, a2), FS.destroyNode(o4);
        }, readdir(e) {
          var t2 = FS.lookupPath(e, { follow: true }), r = t2.node;
          if (!r.node_ops.readdir) throw new FS.ErrnoError(54);
          return r.node_ops.readdir(r);
        }, unlink(e) {
          var t2 = FS.lookupPath(e, { parent: true }), r = t2.node;
          if (!r) throw new FS.ErrnoError(44);
          var a2 = PATH.basename(e), o4 = FS.lookupNode(r, a2), s4 = FS.mayDelete(r, a2, false);
          if (s4) throw new FS.ErrnoError(s4);
          if (!r.node_ops.unlink) throw new FS.ErrnoError(63);
          if (FS.isMountpoint(o4)) throw new FS.ErrnoError(10);
          r.node_ops.unlink(r, a2), FS.destroyNode(o4);
        }, readlink(e) {
          var t2 = FS.lookupPath(e), r = t2.node;
          if (!r) throw new FS.ErrnoError(44);
          if (!r.node_ops.readlink) throw new FS.ErrnoError(28);
          return r.node_ops.readlink(r);
        }, stat(e, t2) {
          var r = FS.lookupPath(e, { follow: !t2 }), a2 = r.node;
          if (!a2) throw new FS.ErrnoError(44);
          if (!a2.node_ops.getattr) throw new FS.ErrnoError(63);
          return a2.node_ops.getattr(a2);
        }, lstat(e) {
          return FS.stat(e, true);
        }, chmod(e, t2, r) {
          var a2;
          if (typeof e == "string") {
            var o4 = FS.lookupPath(e, { follow: !r });
            a2 = o4.node;
          } else a2 = e;
          if (!a2.node_ops.setattr) throw new FS.ErrnoError(63);
          a2.node_ops.setattr(a2, { mode: t2 & 4095 | a2.mode & -4096, ctime: Date.now() });
        }, lchmod(e, t2) {
          FS.chmod(e, t2, true);
        }, fchmod(e, t2) {
          var r = FS.getStreamChecked(e);
          FS.chmod(r.node, t2);
        }, chown(e, t2, r, a2) {
          var o4;
          if (typeof e == "string") {
            var s4 = FS.lookupPath(e, { follow: !a2 });
            o4 = s4.node;
          } else o4 = e;
          if (!o4.node_ops.setattr) throw new FS.ErrnoError(63);
          o4.node_ops.setattr(o4, { timestamp: Date.now() });
        }, lchown(e, t2, r) {
          FS.chown(e, t2, r, true);
        }, fchown(e, t2, r) {
          var a2 = FS.getStreamChecked(e);
          FS.chown(a2.node, t2, r);
        }, truncate(e, t2) {
          if (t2 < 0) throw new FS.ErrnoError(28);
          var r;
          if (typeof e == "string") {
            var a2 = FS.lookupPath(e, { follow: true });
            r = a2.node;
          } else r = e;
          if (!r.node_ops.setattr) throw new FS.ErrnoError(63);
          if (FS.isDir(r.mode)) throw new FS.ErrnoError(31);
          if (!FS.isFile(r.mode)) throw new FS.ErrnoError(28);
          var o4 = FS.nodePermissions(r, "w");
          if (o4) throw new FS.ErrnoError(o4);
          r.node_ops.setattr(r, { size: t2, timestamp: Date.now() });
        }, ftruncate(e, t2) {
          var r = FS.getStreamChecked(e);
          if (!(r.flags & 2097155)) throw new FS.ErrnoError(28);
          FS.truncate(r.node, t2);
        }, utime(e, t2, r) {
          var a2 = FS.lookupPath(e, { follow: true }), o4 = a2.node;
          o4.node_ops.setattr(o4, { atime: t2, mtime: r });
        }, open(e, t2, r = 438) {
          if (e === "") throw new FS.ErrnoError(44);
          t2 = typeof t2 == "string" ? FS_modeStringToFlags(t2) : t2, t2 & 64 ? r = r & 4095 | 32768 : r = 0;
          var a2;
          if (typeof e == "object") a2 = e;
          else {
            var o4 = FS.lookupPath(e, { follow: !(t2 & 131072), noent_okay: true });
            a2 = o4.node, e = o4.path;
          }
          var s4 = false;
          if (t2 & 64) if (a2) {
            if (t2 & 128) throw new FS.ErrnoError(20);
          } else a2 = FS.mknod(e, r, 0), s4 = true;
          if (!a2) throw new FS.ErrnoError(44);
          if (FS.isChrdev(a2.mode) && (t2 &= -513), t2 & 65536 && !FS.isDir(a2.mode)) throw new FS.ErrnoError(54);
          if (!s4) {
            var _3 = FS.mayOpen(a2, t2);
            if (_3) throw new FS.ErrnoError(_3);
          }
          t2 & 512 && !s4 && FS.truncate(a2, 0), t2 &= -131713;
          var n3 = FS.createStream({ node: a2, path: FS.getPath(a2), flags: t2, seekable: true, position: 0, stream_ops: a2.stream_ops, ungotten: [], error: false });
          return n3.stream_ops.open && n3.stream_ops.open(n3), Module.logReadFiles && !(t2 & 1) && (e in FS.readFiles || (FS.readFiles[e] = 1)), n3;
        }, close(e) {
          if (FS.isClosed(e)) throw new FS.ErrnoError(8);
          e.getdents && (e.getdents = null);
          try {
            e.stream_ops.close && e.stream_ops.close(e);
          } catch (t2) {
            throw t2;
          } finally {
            FS.closeStream(e.fd);
          }
          e.fd = null;
        }, isClosed(e) {
          return e.fd === null;
        }, llseek(e, t2, r) {
          if (FS.isClosed(e)) throw new FS.ErrnoError(8);
          if (!e.seekable || !e.stream_ops.llseek) throw new FS.ErrnoError(70);
          if (r != 0 && r != 1 && r != 2) throw new FS.ErrnoError(28);
          return e.position = e.stream_ops.llseek(e, t2, r), e.ungotten = [], e.position;
        }, read(e, t2, r, a2, o4) {
          if (a2 < 0 || o4 < 0) throw new FS.ErrnoError(28);
          if (FS.isClosed(e)) throw new FS.ErrnoError(8);
          if ((e.flags & 2097155) === 1) throw new FS.ErrnoError(8);
          if (FS.isDir(e.node.mode)) throw new FS.ErrnoError(31);
          if (!e.stream_ops.read) throw new FS.ErrnoError(28);
          var s4 = typeof o4 < "u";
          if (!s4) o4 = e.position;
          else if (!e.seekable) throw new FS.ErrnoError(70);
          var _3 = e.stream_ops.read(e, t2, r, a2, o4);
          return s4 || (e.position += _3), _3;
        }, write(e, t2, r, a2, o4, s4) {
          if (a2 < 0 || o4 < 0) throw new FS.ErrnoError(28);
          if (FS.isClosed(e)) throw new FS.ErrnoError(8);
          if (!(e.flags & 2097155)) throw new FS.ErrnoError(8);
          if (FS.isDir(e.node.mode)) throw new FS.ErrnoError(31);
          if (!e.stream_ops.write) throw new FS.ErrnoError(28);
          e.seekable && e.flags & 1024 && FS.llseek(e, 0, 2);
          var _3 = typeof o4 < "u";
          if (!_3) o4 = e.position;
          else if (!e.seekable) throw new FS.ErrnoError(70);
          var n3 = e.stream_ops.write(e, t2, r, a2, o4, s4);
          return _3 || (e.position += n3), n3;
        }, allocate(e, t2, r) {
          if (FS.isClosed(e)) throw new FS.ErrnoError(8);
          if (t2 < 0 || r <= 0) throw new FS.ErrnoError(28);
          if (!(e.flags & 2097155)) throw new FS.ErrnoError(8);
          if (!FS.isFile(e.node.mode) && !FS.isDir(e.node.mode)) throw new FS.ErrnoError(43);
          if (!e.stream_ops.allocate) throw new FS.ErrnoError(138);
          e.stream_ops.allocate(e, t2, r);
        }, mmap(e, t2, r, a2, o4) {
          if (a2 & 2 && !(o4 & 2) && (e.flags & 2097155) !== 2) throw new FS.ErrnoError(2);
          if ((e.flags & 2097155) === 1) throw new FS.ErrnoError(2);
          if (!e.stream_ops.mmap) throw new FS.ErrnoError(43);
          if (!t2) throw new FS.ErrnoError(28);
          return e.stream_ops.mmap(e, t2, r, a2, o4);
        }, msync(e, t2, r, a2, o4) {
          return e.stream_ops.msync ? e.stream_ops.msync(e, t2, r, a2, o4) : 0;
        }, ioctl(e, t2, r) {
          if (!e.stream_ops.ioctl) throw new FS.ErrnoError(59);
          return e.stream_ops.ioctl(e, t2, r);
        }, readFile(e, t2 = {}) {
          if (t2.flags = t2.flags || 0, t2.encoding = t2.encoding || "binary", t2.encoding !== "utf8" && t2.encoding !== "binary") throw new Error(`Invalid encoding type "${t2.encoding}"`);
          var r, a2 = FS.open(e, t2.flags), o4 = FS.stat(e), s4 = o4.size, _3 = new Uint8Array(s4);
          return FS.read(a2, _3, 0, s4, 0), t2.encoding === "utf8" ? r = UTF8ArrayToString(_3) : t2.encoding === "binary" && (r = _3), FS.close(a2), r;
        }, writeFile(e, t2, r = {}) {
          r.flags = r.flags || 577;
          var a2 = FS.open(e, r.flags, r.mode);
          if (typeof t2 == "string") {
            var o4 = new Uint8Array(lengthBytesUTF8(t2) + 1), s4 = stringToUTF8Array(t2, o4, 0, o4.length);
            FS.write(a2, o4, 0, s4, void 0, r.canOwn);
          } else if (ArrayBuffer.isView(t2)) FS.write(a2, t2, 0, t2.byteLength, void 0, r.canOwn);
          else throw new Error("Unsupported data type");
          FS.close(a2);
        }, cwd: () => FS.currentPath, chdir(e) {
          var t2 = FS.lookupPath(e, { follow: true });
          if (t2.node === null) throw new FS.ErrnoError(44);
          if (!FS.isDir(t2.node.mode)) throw new FS.ErrnoError(54);
          var r = FS.nodePermissions(t2.node, "x");
          if (r) throw new FS.ErrnoError(r);
          FS.currentPath = t2.path;
        }, createDefaultDirectories() {
          FS.mkdir("/tmp"), FS.mkdir("/home"), FS.mkdir("/home/web_user");
        }, createDefaultDevices() {
          FS.mkdir("/dev"), FS.registerDevice(FS.makedev(1, 3), { read: () => 0, write: (a2, o4, s4, _3, n3) => _3, llseek: () => 0 }), FS.mkdev("/dev/null", FS.makedev(1, 3)), TTY.register(FS.makedev(5, 0), TTY.default_tty_ops), TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops), FS.mkdev("/dev/tty", FS.makedev(5, 0)), FS.mkdev("/dev/tty1", FS.makedev(6, 0));
          var e = new Uint8Array(1024), t2 = 0, r = () => (t2 === 0 && (t2 = randomFill(e).byteLength), e[--t2]);
          FS.createDevice("/dev", "random", r), FS.createDevice("/dev", "urandom", r), FS.mkdir("/dev/shm"), FS.mkdir("/dev/shm/tmp");
        }, createSpecialDirectories() {
          FS.mkdir("/proc");
          var e = FS.mkdir("/proc/self");
          FS.mkdir("/proc/self/fd"), FS.mount({ mount() {
            var t2 = FS.createNode(e, "fd", 16895, 73);
            return t2.stream_ops = { llseek: MEMFS.stream_ops.llseek }, t2.node_ops = { lookup(r, a2) {
              var o4 = +a2, s4 = FS.getStreamChecked(o4), _3 = { parent: null, mount: { mountpoint: "fake" }, node_ops: { readlink: () => s4.path }, id: o4 + 1 };
              return _3.parent = _3, _3;
            }, readdir() {
              return Array.from(FS.streams.entries()).filter(([r, a2]) => a2).map(([r, a2]) => r.toString());
            } }, t2;
          } }, {}, "/proc/self/fd");
        }, createStandardStreams(e, t2, r) {
          e ? FS.createDevice("/dev", "stdin", e) : FS.symlink("/dev/tty", "/dev/stdin"), t2 ? FS.createDevice("/dev", "stdout", null, t2) : FS.symlink("/dev/tty", "/dev/stdout"), r ? FS.createDevice("/dev", "stderr", null, r) : FS.symlink("/dev/tty1", "/dev/stderr");
          var a2 = FS.open("/dev/stdin", 0), o4 = FS.open("/dev/stdout", 1), s4 = FS.open("/dev/stderr", 1);
        }, staticInit() {
          FS.nameTable = new Array(4096), FS.mount(MEMFS, {}, "/"), FS.createDefaultDirectories(), FS.createDefaultDevices(), FS.createSpecialDirectories(), FS.filesystems = { MEMFS, IDBFS, NODEFS };
        }, init(e, t2, r) {
          FS.initialized = true, e ?? (e = Module.stdin), t2 ?? (t2 = Module.stdout), r ?? (r = Module.stderr), FS.createStandardStreams(e, t2, r);
        }, quit() {
          FS.initialized = false, _fflush(0);
          for (var e = 0; e < FS.streams.length; e++) {
            var t2 = FS.streams[e];
            t2 && FS.close(t2);
          }
        }, findObject(e, t2) {
          var r = FS.analyzePath(e, t2);
          return r.exists ? r.object : null;
        }, analyzePath(e, t2) {
          try {
            var r = FS.lookupPath(e, { follow: !t2 });
            e = r.path;
          } catch {
          }
          var a2 = { isRoot: false, exists: false, error: 0, name: null, path: null, object: null, parentExists: false, parentPath: null, parentObject: null };
          try {
            var r = FS.lookupPath(e, { parent: true });
            a2.parentExists = true, a2.parentPath = r.path, a2.parentObject = r.node, a2.name = PATH.basename(e), r = FS.lookupPath(e, { follow: !t2 }), a2.exists = true, a2.path = r.path, a2.object = r.node, a2.name = r.node.name, a2.isRoot = r.path === "/";
          } catch (o4) {
            a2.error = o4.errno;
          }
          return a2;
        }, createPath(e, t2, r, a2) {
          e = typeof e == "string" ? e : FS.getPath(e);
          for (var o4 = t2.split("/").reverse(); o4.length; ) {
            var s4 = o4.pop();
            if (s4) {
              var _3 = PATH.join2(e, s4);
              try {
                FS.mkdir(_3);
              } catch {
              }
              e = _3;
            }
          }
          return _3;
        }, createFile(e, t2, r, a2, o4) {
          var s4 = PATH.join2(typeof e == "string" ? e : FS.getPath(e), t2), _3 = FS_getMode(a2, o4);
          return FS.create(s4, _3);
        }, createDataFile(e, t2, r, a2, o4, s4) {
          var _3 = t2;
          e && (e = typeof e == "string" ? e : FS.getPath(e), _3 = t2 ? PATH.join2(e, t2) : e);
          var n3 = FS_getMode(a2, o4), l3 = FS.create(_3, n3);
          if (r) {
            if (typeof r == "string") {
              for (var d2 = new Array(r.length), p4 = 0, m4 = r.length; p4 < m4; ++p4) d2[p4] = r.charCodeAt(p4);
              r = d2;
            }
            FS.chmod(l3, n3 | 146);
            var g5 = FS.open(l3, 577);
            FS.write(g5, r, 0, r.length, 0, s4), FS.close(g5), FS.chmod(l3, n3);
          }
        }, createDevice(e, t2, r, a2) {
          var n3;
          var o4 = PATH.join2(typeof e == "string" ? e : FS.getPath(e), t2), s4 = FS_getMode(!!r, !!a2);
          (n3 = FS.createDevice).major ?? (n3.major = 64);
          var _3 = FS.makedev(FS.createDevice.major++, 0);
          return FS.registerDevice(_3, { open(l3) {
            l3.seekable = false;
          }, close(l3) {
            a2?.buffer?.length && a2(10);
          }, read(l3, d2, p4, m4, g5) {
            for (var u2 = 0, f3 = 0; f3 < m4; f3++) {
              var c2;
              try {
                c2 = r();
              } catch {
                throw new FS.ErrnoError(29);
              }
              if (c2 === void 0 && u2 === 0) throw new FS.ErrnoError(6);
              if (c2 == null) break;
              u2++, d2[p4 + f3] = c2;
            }
            return u2 && (l3.node.atime = Date.now()), u2;
          }, write(l3, d2, p4, m4, g5) {
            for (var u2 = 0; u2 < m4; u2++) try {
              a2(d2[p4 + u2]);
            } catch {
              throw new FS.ErrnoError(29);
            }
            return m4 && (l3.node.mtime = l3.node.ctime = Date.now()), u2;
          } }), FS.mkdev(o4, s4, _3);
        }, forceLoadFile(e) {
          if (e.isDevice || e.isFolder || e.link || e.contents) return true;
          if (typeof XMLHttpRequest < "u") throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
          try {
            e.contents = readBinary(e.url), e.usedBytes = e.contents.length;
          } catch {
            throw new FS.ErrnoError(29);
          }
        }, createLazyFile(e, t2, r, a2, o4) {
          class s4 {
            constructor() {
              P(this, "lengthKnown", false);
              P(this, "chunks", []);
            }
            get(u2) {
              if (!(u2 > this.length - 1 || u2 < 0)) {
                var f3 = u2 % this.chunkSize, c2 = u2 / this.chunkSize | 0;
                return this.getter(c2)[f3];
              }
            }
            setDataGetter(u2) {
              this.getter = u2;
            }
            cacheLength() {
              var u2 = new XMLHttpRequest();
              if (u2.open("HEAD", r, false), u2.send(null), !(u2.status >= 200 && u2.status < 300 || u2.status === 304)) throw new Error("Couldn't load " + r + ". Status: " + u2.status);
              var f3 = Number(u2.getResponseHeader("Content-length")), c2, w4 = (c2 = u2.getResponseHeader("Accept-Ranges")) && c2 === "bytes", x6 = (c2 = u2.getResponseHeader("Content-Encoding")) && c2 === "gzip", S3 = 1024 * 1024;
              w4 || (S3 = f3);
              var h3 = (v3, y4) => {
                if (v3 > y4) throw new Error("invalid range (" + v3 + ", " + y4 + ") or no bytes requested!");
                if (y4 > f3 - 1) throw new Error("only " + f3 + " bytes available! programmer error!");
                var k4 = new XMLHttpRequest();
                if (k4.open("GET", r, false), f3 !== S3 && k4.setRequestHeader("Range", "bytes=" + v3 + "-" + y4), k4.responseType = "arraybuffer", k4.overrideMimeType && k4.overrideMimeType("text/plain; charset=x-user-defined"), k4.send(null), !(k4.status >= 200 && k4.status < 300 || k4.status === 304)) throw new Error("Couldn't load " + r + ". Status: " + k4.status);
                return k4.response !== void 0 ? new Uint8Array(k4.response || []) : intArrayFromString(k4.responseText || "", true);
              }, b3 = this;
              b3.setDataGetter((v3) => {
                var y4 = v3 * S3, k4 = (v3 + 1) * S3 - 1;
                if (k4 = Math.min(k4, f3 - 1), typeof b3.chunks[v3] > "u" && (b3.chunks[v3] = h3(y4, k4)), typeof b3.chunks[v3] > "u") throw new Error("doXHR failed!");
                return b3.chunks[v3];
              }), (x6 || !f3) && (S3 = f3 = 1, f3 = this.getter(0).length, S3 = f3, out("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = f3, this._chunkSize = S3, this.lengthKnown = true;
            }
            get length() {
              return this.lengthKnown || this.cacheLength(), this._length;
            }
            get chunkSize() {
              return this.lengthKnown || this.cacheLength(), this._chunkSize;
            }
          }
          if (typeof XMLHttpRequest < "u") {
            if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
            var _3 = new s4(), n3 = { isDevice: false, contents: _3 };
          } else var n3 = { isDevice: false, url: r };
          var l3 = FS.createFile(e, t2, n3, a2, o4);
          n3.contents ? l3.contents = n3.contents : n3.url && (l3.contents = null, l3.url = n3.url), Object.defineProperties(l3, { usedBytes: { get: function() {
            return this.contents.length;
          } } });
          var d2 = {}, p4 = Object.keys(l3.stream_ops);
          p4.forEach((g5) => {
            var u2 = l3.stream_ops[g5];
            d2[g5] = (...f3) => (FS.forceLoadFile(l3), u2(...f3));
          });
          function m4(g5, u2, f3, c2, w4) {
            var x6 = g5.node.contents;
            if (w4 >= x6.length) return 0;
            var S3 = Math.min(x6.length - w4, c2);
            if (x6.slice) for (var h3 = 0; h3 < S3; h3++) u2[f3 + h3] = x6[w4 + h3];
            else for (var h3 = 0; h3 < S3; h3++) u2[f3 + h3] = x6.get(w4 + h3);
            return S3;
          }
          return d2.read = (g5, u2, f3, c2, w4) => (FS.forceLoadFile(l3), m4(g5, u2, f3, c2, w4)), d2.mmap = (g5, u2, f3, c2, w4) => {
            FS.forceLoadFile(l3);
            var x6 = mmapAlloc(u2);
            if (!x6) throw new FS.ErrnoError(48);
            return m4(g5, HEAP8, x6, u2, f3), { ptr: x6, allocated: true };
          }, l3.stream_ops = d2, l3;
        } }, SYSCALLS = { DEFAULT_POLLMASK: 5, calculateAt(e, t2, r) {
          if (PATH.isAbs(t2)) return t2;
          var a2;
          if (e === -100) a2 = FS.cwd();
          else {
            var o4 = SYSCALLS.getStreamFromFD(e);
            a2 = o4.path;
          }
          if (t2.length == 0) {
            if (!r) throw new FS.ErrnoError(44);
            return a2;
          }
          return a2 + "/" + t2;
        }, doStat(e, t2, r) {
          var a2 = e(t2);
          HEAP32[r >> 2] = a2.dev, HEAP32[r + 4 >> 2] = a2.mode, HEAPU32[r + 8 >> 2] = a2.nlink, HEAP32[r + 12 >> 2] = a2.uid, HEAP32[r + 16 >> 2] = a2.gid, HEAP32[r + 20 >> 2] = a2.rdev, HEAP64[r + 24 >> 3] = BigInt(a2.size), HEAP32[r + 32 >> 2] = 4096, HEAP32[r + 36 >> 2] = a2.blocks;
          var o4 = a2.atime.getTime(), s4 = a2.mtime.getTime(), _3 = a2.ctime.getTime();
          return HEAP64[r + 40 >> 3] = BigInt(Math.floor(o4 / 1e3)), HEAPU32[r + 48 >> 2] = o4 % 1e3 * 1e3 * 1e3, HEAP64[r + 56 >> 3] = BigInt(Math.floor(s4 / 1e3)), HEAPU32[r + 64 >> 2] = s4 % 1e3 * 1e3 * 1e3, HEAP64[r + 72 >> 3] = BigInt(Math.floor(_3 / 1e3)), HEAPU32[r + 80 >> 2] = _3 % 1e3 * 1e3 * 1e3, HEAP64[r + 88 >> 3] = BigInt(a2.ino), 0;
        }, doMsync(e, t2, r, a2, o4) {
          if (!FS.isFile(t2.node.mode)) throw new FS.ErrnoError(43);
          if (a2 & 2) return 0;
          var s4 = HEAPU8.slice(e, e + r);
          FS.msync(t2, s4, o4, r, a2);
        }, getStreamFromFD(e) {
          var t2 = FS.getStreamChecked(e);
          return t2;
        }, varargs: void 0, getStr(e) {
          var t2 = UTF8ToString(e);
          return t2;
        } }, ___syscall__newselect = function(e, t2, r, a2, o4) {
          try {
            for (var s4 = 0, _3 = t2 ? HEAP32[t2 >> 2] : 0, n3 = t2 ? HEAP32[t2 + 4 >> 2] : 0, l3 = r ? HEAP32[r >> 2] : 0, d2 = r ? HEAP32[r + 4 >> 2] : 0, p4 = a2 ? HEAP32[a2 >> 2] : 0, m4 = a2 ? HEAP32[a2 + 4 >> 2] : 0, g5 = 0, u2 = 0, f3 = 0, c2 = 0, w4 = 0, x6 = 0, S3 = (t2 ? HEAP32[t2 >> 2] : 0) | (r ? HEAP32[r >> 2] : 0) | (a2 ? HEAP32[a2 >> 2] : 0), h3 = (t2 ? HEAP32[t2 + 4 >> 2] : 0) | (r ? HEAP32[r + 4 >> 2] : 0) | (a2 ? HEAP32[a2 + 4 >> 2] : 0), b3 = (H4, T5, D4, A2) => H4 < 32 ? T5 & A2 : D4 & A2, v3 = 0; v3 < e; v3++) {
              var y4 = 1 << v3 % 32;
              if (b3(v3, S3, h3, y4)) {
                var k4 = SYSCALLS.getStreamFromFD(v3), q2 = SYSCALLS.DEFAULT_POLLMASK;
                if (k4.stream_ops.poll) {
                  var U3 = -1;
                  if (o4) {
                    var ee2 = t2 ? HEAP32[o4 >> 2] : 0, O4 = t2 ? HEAP32[o4 + 4 >> 2] : 0;
                    U3 = (ee2 + O4 / 1e6) * 1e3;
                  }
                  q2 = k4.stream_ops.poll(k4, U3);
                }
                q2 & 1 && b3(v3, _3, n3, y4) && (v3 < 32 ? g5 = g5 | y4 : u2 = u2 | y4, s4++), q2 & 4 && b3(v3, l3, d2, y4) && (v3 < 32 ? f3 = f3 | y4 : c2 = c2 | y4, s4++), q2 & 2 && b3(v3, p4, m4, y4) && (v3 < 32 ? w4 = w4 | y4 : x6 = x6 | y4, s4++);
              }
            }
            return t2 && (HEAP32[t2 >> 2] = g5, HEAP32[t2 + 4 >> 2] = u2), r && (HEAP32[r >> 2] = f3, HEAP32[r + 4 >> 2] = c2), a2 && (HEAP32[a2 >> 2] = w4, HEAP32[a2 + 4 >> 2] = x6), s4;
          } catch (H4) {
            if (typeof FS > "u" || H4.name !== "ErrnoError") throw H4;
            return -H4.errno;
          }
        };
        ___syscall__newselect.sig = "iipppp";
        var SOCKFS = { websocketArgs: {}, callbacks: {}, on(e, t2) {
          SOCKFS.callbacks[e] = t2;
        }, emit(e, t2) {
          SOCKFS.callbacks[e]?.(t2);
        }, mount(e) {
          return SOCKFS.websocketArgs = Module.websocket || {}, (Module.websocket ?? (Module.websocket = {})).on = SOCKFS.on, FS.createNode(null, "/", 16895, 0);
        }, createSocket(e, t2, r) {
          t2 &= -526337;
          var a2 = t2 == 1;
          if (a2 && r && r != 6) throw new FS.ErrnoError(66);
          var o4 = { family: e, type: t2, protocol: r, server: null, error: null, peers: {}, pending: [], recv_queue: [], sock_ops: SOCKFS.websocket_sock_ops }, s4 = SOCKFS.nextname(), _3 = FS.createNode(SOCKFS.root, s4, 49152, 0);
          _3.sock = o4;
          var n3 = FS.createStream({ path: s4, node: _3, flags: 2, seekable: false, stream_ops: SOCKFS.stream_ops });
          return o4.stream = n3, o4;
        }, getSocket(e) {
          var t2 = FS.getStream(e);
          return !t2 || !FS.isSocket(t2.node.mode) ? null : t2.node.sock;
        }, stream_ops: { poll(e) {
          var t2 = e.node.sock;
          return t2.sock_ops.poll(t2);
        }, ioctl(e, t2, r) {
          var a2 = e.node.sock;
          return a2.sock_ops.ioctl(a2, t2, r);
        }, read(e, t2, r, a2, o4) {
          var s4 = e.node.sock, _3 = s4.sock_ops.recvmsg(s4, a2);
          return _3 ? (t2.set(_3.buffer, r), _3.buffer.length) : 0;
        }, write(e, t2, r, a2, o4) {
          var s4 = e.node.sock;
          return s4.sock_ops.sendmsg(s4, t2, r, a2);
        }, close(e) {
          var t2 = e.node.sock;
          t2.sock_ops.close(t2);
        } }, nextname() {
          return SOCKFS.nextname.current || (SOCKFS.nextname.current = 0), `socket[${SOCKFS.nextname.current++}]`;
        }, websocket_sock_ops: { createPeer(e, t2, r) {
          var a2;
          if (typeof t2 == "object" && (a2 = t2, t2 = null, r = null), a2) if (a2._socket) t2 = a2._socket.remoteAddress, r = a2._socket.remotePort;
          else {
            var o4 = /ws[s]?:\/\/([^:]+):(\d+)/.exec(a2.url);
            if (!o4) throw new Error("WebSocket URL must be in the format ws(s)://address:port");
            t2 = o4[1], r = parseInt(o4[2], 10);
          }
          else try {
            var s4 = "ws:#".replace("#", "//"), _3 = "binary", n3 = void 0;
            if (SOCKFS.websocketArgs.url && (s4 = SOCKFS.websocketArgs.url), SOCKFS.websocketArgs.subprotocol ? _3 = SOCKFS.websocketArgs.subprotocol : SOCKFS.websocketArgs.subprotocol === null && (_3 = "null"), s4 === "ws://" || s4 === "wss://") {
              var l3 = t2.split("/");
              s4 = s4 + l3[0] + ":" + r + "/" + l3.slice(1).join("/");
            }
            _3 !== "null" && (_3 = _3.replace(/^ +| +$/g, "").split(/ *, */), n3 = _3);
            var d2;
            ENVIRONMENT_IS_NODE ? d2 = require("ws") : d2 = WebSocket, a2 = new d2(s4, n3), a2.binaryType = "arraybuffer";
          } catch {
            throw new FS.ErrnoError(23);
          }
          var p4 = { addr: t2, port: r, socket: a2, msg_send_queue: [] };
          return SOCKFS.websocket_sock_ops.addPeer(e, p4), SOCKFS.websocket_sock_ops.handlePeerEvents(e, p4), e.type === 2 && typeof e.sport < "u" && p4.msg_send_queue.push(new Uint8Array([255, 255, 255, 255, 112, 111, 114, 116, (e.sport & 65280) >> 8, e.sport & 255])), p4;
        }, getPeer(e, t2, r) {
          return e.peers[t2 + ":" + r];
        }, addPeer(e, t2) {
          e.peers[t2.addr + ":" + t2.port] = t2;
        }, removePeer(e, t2) {
          delete e.peers[t2.addr + ":" + t2.port];
        }, handlePeerEvents(e, t2) {
          var r = true, a2 = function() {
            e.connecting = false, SOCKFS.emit("open", e.stream.fd);
            try {
              for (var s4 = t2.msg_send_queue.shift(); s4; ) t2.socket.send(s4), s4 = t2.msg_send_queue.shift();
            } catch {
              t2.socket.close();
            }
          };
          function o4(s4) {
            if (typeof s4 == "string") {
              var _3 = new TextEncoder();
              s4 = _3.encode(s4);
            } else {
              if (assert(s4.byteLength !== void 0), s4.byteLength == 0) return;
              s4 = new Uint8Array(s4);
            }
            var n3 = r;
            if (r = false, n3 && s4.length === 10 && s4[0] === 255 && s4[1] === 255 && s4[2] === 255 && s4[3] === 255 && s4[4] === 112 && s4[5] === 111 && s4[6] === 114 && s4[7] === 116) {
              var l3 = s4[8] << 8 | s4[9];
              SOCKFS.websocket_sock_ops.removePeer(e, t2), t2.port = l3, SOCKFS.websocket_sock_ops.addPeer(e, t2);
              return;
            }
            e.recv_queue.push({ addr: t2.addr, port: t2.port, data: s4 }), SOCKFS.emit("message", e.stream.fd);
          }
          ENVIRONMENT_IS_NODE ? (t2.socket.on("open", a2), t2.socket.on("message", function(s4, _3) {
            _3 && o4(new Uint8Array(s4).buffer);
          }), t2.socket.on("close", function() {
            SOCKFS.emit("close", e.stream.fd);
          }), t2.socket.on("error", function(s4) {
            e.error = 14, SOCKFS.emit("error", [e.stream.fd, e.error, "ECONNREFUSED: Connection refused"]);
          })) : (t2.socket.onopen = a2, t2.socket.onclose = function() {
            SOCKFS.emit("close", e.stream.fd);
          }, t2.socket.onmessage = function(_3) {
            o4(_3.data);
          }, t2.socket.onerror = function(s4) {
            e.error = 14, SOCKFS.emit("error", [e.stream.fd, e.error, "ECONNREFUSED: Connection refused"]);
          });
        }, poll(e) {
          if (e.type === 1 && e.server) return e.pending.length ? 65 : 0;
          var t2 = 0, r = e.type === 1 ? SOCKFS.websocket_sock_ops.getPeer(e, e.daddr, e.dport) : null;
          return (e.recv_queue.length || !r || r && r.socket.readyState === r.socket.CLOSING || r && r.socket.readyState === r.socket.CLOSED) && (t2 |= 65), (!r || r && r.socket.readyState === r.socket.OPEN) && (t2 |= 4), (r && r.socket.readyState === r.socket.CLOSING || r && r.socket.readyState === r.socket.CLOSED) && (e.connecting ? t2 |= 4 : t2 |= 16), t2;
        }, ioctl(e, t2, r) {
          switch (t2) {
            case 21531:
              var a2 = 0;
              return e.recv_queue.length && (a2 = e.recv_queue[0].data.length), HEAP32[r >> 2] = a2, 0;
            default:
              return 28;
          }
        }, close(e) {
          if (e.server) {
            try {
              e.server.close();
            } catch {
            }
            e.server = null;
          }
          for (var t2 = Object.keys(e.peers), r = 0; r < t2.length; r++) {
            var a2 = e.peers[t2[r]];
            try {
              a2.socket.close();
            } catch {
            }
            SOCKFS.websocket_sock_ops.removePeer(e, a2);
          }
          return 0;
        }, bind(e, t2, r) {
          if (typeof e.saddr < "u" || typeof e.sport < "u") throw new FS.ErrnoError(28);
          if (e.saddr = t2, e.sport = r, e.type === 2) {
            e.server && (e.server.close(), e.server = null);
            try {
              e.sock_ops.listen(e, 0);
            } catch (a2) {
              if (a2.name !== "ErrnoError" || a2.errno !== 138) throw a2;
            }
          }
        }, connect(e, t2, r) {
          if (e.server) throw new FS.ErrnoError(138);
          if (typeof e.daddr < "u" && typeof e.dport < "u") {
            var a2 = SOCKFS.websocket_sock_ops.getPeer(e, e.daddr, e.dport);
            if (a2) throw a2.socket.readyState === a2.socket.CONNECTING ? new FS.ErrnoError(7) : new FS.ErrnoError(30);
          }
          var o4 = SOCKFS.websocket_sock_ops.createPeer(e, t2, r);
          e.daddr = o4.addr, e.dport = o4.port, e.connecting = true;
        }, listen(e, t2) {
          if (!ENVIRONMENT_IS_NODE) throw new FS.ErrnoError(138);
          if (e.server) throw new FS.ErrnoError(28);
          var r = require("ws").Server, a2 = e.saddr;
          e.server = new r({ host: a2, port: e.sport }), SOCKFS.emit("listen", e.stream.fd), e.server.on("connection", function(o4) {
            if (e.type === 1) {
              var s4 = SOCKFS.createSocket(e.family, e.type, e.protocol), _3 = SOCKFS.websocket_sock_ops.createPeer(s4, o4);
              s4.daddr = _3.addr, s4.dport = _3.port, e.pending.push(s4), SOCKFS.emit("connection", s4.stream.fd);
            } else SOCKFS.websocket_sock_ops.createPeer(e, o4), SOCKFS.emit("connection", e.stream.fd);
          }), e.server.on("close", function() {
            SOCKFS.emit("close", e.stream.fd), e.server = null;
          }), e.server.on("error", function(o4) {
            e.error = 23, SOCKFS.emit("error", [e.stream.fd, e.error, "EHOSTUNREACH: Host is unreachable"]);
          });
        }, accept(e) {
          if (!e.server || !e.pending.length) throw new FS.ErrnoError(28);
          var t2 = e.pending.shift();
          return t2.stream.flags = e.stream.flags, t2;
        }, getname(e, t2) {
          var r, a2;
          if (t2) {
            if (e.daddr === void 0 || e.dport === void 0) throw new FS.ErrnoError(53);
            r = e.daddr, a2 = e.dport;
          } else r = e.saddr || 0, a2 = e.sport || 0;
          return { addr: r, port: a2 };
        }, sendmsg(e, t2, r, a2, o4, s4) {
          if (e.type === 2) {
            if ((o4 === void 0 || s4 === void 0) && (o4 = e.daddr, s4 = e.dport), o4 === void 0 || s4 === void 0) throw new FS.ErrnoError(17);
          } else o4 = e.daddr, s4 = e.dport;
          var _3 = SOCKFS.websocket_sock_ops.getPeer(e, o4, s4);
          if (e.type === 1 && (!_3 || _3.socket.readyState === _3.socket.CLOSING || _3.socket.readyState === _3.socket.CLOSED)) throw new FS.ErrnoError(53);
          ArrayBuffer.isView(t2) && (r += t2.byteOffset, t2 = t2.buffer);
          var n3 = t2.slice(r, r + a2);
          if (!_3 || _3.socket.readyState !== _3.socket.OPEN) return e.type === 2 && (!_3 || _3.socket.readyState === _3.socket.CLOSING || _3.socket.readyState === _3.socket.CLOSED) && (_3 = SOCKFS.websocket_sock_ops.createPeer(e, o4, s4)), _3.msg_send_queue.push(n3), a2;
          try {
            return _3.socket.send(n3), a2;
          } catch {
            throw new FS.ErrnoError(28);
          }
        }, recvmsg(e, t2) {
          if (e.type === 1 && e.server) throw new FS.ErrnoError(53);
          var r = e.recv_queue.shift();
          if (!r) {
            if (e.type === 1) {
              var a2 = SOCKFS.websocket_sock_ops.getPeer(e, e.daddr, e.dport);
              if (!a2) throw new FS.ErrnoError(53);
              if (a2.socket.readyState === a2.socket.CLOSING || a2.socket.readyState === a2.socket.CLOSED) return null;
              throw new FS.ErrnoError(6);
            }
            throw new FS.ErrnoError(6);
          }
          var o4 = r.data.byteLength || r.data.length, s4 = r.data.byteOffset || 0, _3 = r.data.buffer || r.data, n3 = Math.min(t2, o4), l3 = { buffer: new Uint8Array(_3, s4, n3), addr: r.addr, port: r.port };
          if (e.type === 1 && n3 < o4) {
            var d2 = o4 - n3;
            r.data = new Uint8Array(_3, s4 + n3, d2), e.recv_queue.unshift(r);
          }
          return l3;
        } } }, getSocketFromFD = (e) => {
          var t2 = SOCKFS.getSocket(e);
          if (!t2) throw new FS.ErrnoError(8);
          return t2;
        }, inetNtop4 = (e) => (e & 255) + "." + (e >> 8 & 255) + "." + (e >> 16 & 255) + "." + (e >> 24 & 255), inetNtop6 = (e) => {
          var t2 = "", r = 0, a2 = 0, o4 = 0, s4 = 0, _3 = 0, n3 = 0, l3 = [e[0] & 65535, e[0] >> 16, e[1] & 65535, e[1] >> 16, e[2] & 65535, e[2] >> 16, e[3] & 65535, e[3] >> 16], d2 = true, p4 = "";
          for (n3 = 0; n3 < 5; n3++) if (l3[n3] !== 0) {
            d2 = false;
            break;
          }
          if (d2) {
            if (p4 = inetNtop4(l3[6] | l3[7] << 16), l3[5] === -1) return t2 = "::ffff:", t2 += p4, t2;
            if (l3[5] === 0) return t2 = "::", p4 === "0.0.0.0" && (p4 = ""), p4 === "0.0.0.1" && (p4 = "1"), t2 += p4, t2;
          }
          for (r = 0; r < 8; r++) l3[r] === 0 && (r - o4 > 1 && (_3 = 0), o4 = r, _3++), _3 > a2 && (a2 = _3, s4 = r - a2 + 1);
          for (r = 0; r < 8; r++) {
            if (a2 > 1 && l3[r] === 0 && r >= s4 && r < s4 + a2) {
              r === s4 && (t2 += ":", s4 === 0 && (t2 += ":"));
              continue;
            }
            t2 += Number(_ntohs(l3[r] & 65535)).toString(16), t2 += r < 7 ? ":" : "";
          }
          return t2;
        }, readSockaddr = (e, t2) => {
          var r = HEAP16[e >> 1], a2 = _ntohs(HEAPU16[e + 2 >> 1]), o4;
          switch (r) {
            case 2:
              if (t2 !== 16) return { errno: 28 };
              o4 = HEAP32[e + 4 >> 2], o4 = inetNtop4(o4);
              break;
            case 10:
              if (t2 !== 28) return { errno: 28 };
              o4 = [HEAP32[e + 8 >> 2], HEAP32[e + 12 >> 2], HEAP32[e + 16 >> 2], HEAP32[e + 20 >> 2]], o4 = inetNtop6(o4);
              break;
            default:
              return { errno: 5 };
          }
          return { family: r, addr: o4, port: a2 };
        }, inetPton4 = (e) => {
          for (var t2 = e.split("."), r = 0; r < 4; r++) {
            var a2 = Number(t2[r]);
            if (isNaN(a2)) return null;
            t2[r] = a2;
          }
          return (t2[0] | t2[1] << 8 | t2[2] << 16 | t2[3] << 24) >>> 0;
        }, jstoi_q = (e) => parseInt(e), inetPton6 = (e) => {
          var t2, r, a2, o4, s4 = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i, _3 = [];
          if (!s4.test(e)) return null;
          if (e === "::") return [0, 0, 0, 0, 0, 0, 0, 0];
          for (e.startsWith("::") ? e = e.replace("::", "Z:") : e = e.replace("::", ":Z:"), e.indexOf(".") > 0 ? (e = e.replace(new RegExp("[.]", "g"), ":"), t2 = e.split(":"), t2[t2.length - 4] = jstoi_q(t2[t2.length - 4]) + jstoi_q(t2[t2.length - 3]) * 256, t2[t2.length - 3] = jstoi_q(t2[t2.length - 2]) + jstoi_q(t2[t2.length - 1]) * 256, t2 = t2.slice(0, t2.length - 2)) : t2 = e.split(":"), a2 = 0, o4 = 0, r = 0; r < t2.length; r++) if (typeof t2[r] == "string") if (t2[r] === "Z") {
            for (o4 = 0; o4 < 8 - t2.length + 1; o4++) _3[r + o4] = 0;
            a2 = o4 - 1;
          } else _3[r + a2] = _htons(parseInt(t2[r], 16));
          else _3[r + a2] = t2[r];
          return [_3[1] << 16 | _3[0], _3[3] << 16 | _3[2], _3[5] << 16 | _3[4], _3[7] << 16 | _3[6]];
        }, DNS = { address_map: { id: 1, addrs: {}, names: {} }, lookup_name(e) {
          var t2 = inetPton4(e);
          if (t2 !== null || (t2 = inetPton6(e), t2 !== null)) return e;
          var r;
          if (DNS.address_map.addrs[e]) r = DNS.address_map.addrs[e];
          else {
            var a2 = DNS.address_map.id++;
            assert(a2 < 65535, "exceeded max address mappings of 65535"), r = "172.29." + (a2 & 255) + "." + (a2 & 65280), DNS.address_map.names[r] = e, DNS.address_map.addrs[e] = r;
          }
          return r;
        }, lookup_addr(e) {
          return DNS.address_map.names[e] ? DNS.address_map.names[e] : null;
        } }, getSocketAddress = (e, t2) => {
          var r = readSockaddr(e, t2);
          if (r.errno) throw new FS.ErrnoError(r.errno);
          return r.addr = DNS.lookup_addr(r.addr) || r.addr, r;
        };
        function ___syscall_bind(e, t2, r, a2, o4, s4) {
          try {
            var _3 = getSocketFromFD(e), n3 = getSocketAddress(t2, r);
            return _3.sock_ops.bind(_3, n3.addr, n3.port), 0;
          } catch (l3) {
            if (typeof FS > "u" || l3.name !== "ErrnoError") throw l3;
            return -l3.errno;
          }
        }
        ___syscall_bind.sig = "iippiii";
        function ___syscall_chdir(e) {
          try {
            return e = SYSCALLS.getStr(e), FS.chdir(e), 0;
          } catch (t2) {
            if (typeof FS > "u" || t2.name !== "ErrnoError") throw t2;
            return -t2.errno;
          }
        }
        ___syscall_chdir.sig = "ip";
        function ___syscall_chmod(e, t2) {
          try {
            return e = SYSCALLS.getStr(e), FS.chmod(e, t2), 0;
          } catch (r) {
            if (typeof FS > "u" || r.name !== "ErrnoError") throw r;
            return -r.errno;
          }
        }
        ___syscall_chmod.sig = "ipi";
        function ___syscall_dup(e) {
          try {
            var t2 = SYSCALLS.getStreamFromFD(e);
            return FS.dupStream(t2).fd;
          } catch (r) {
            if (typeof FS > "u" || r.name !== "ErrnoError") throw r;
            return -r.errno;
          }
        }
        ___syscall_dup.sig = "ii";
        function ___syscall_dup3(e, t2, r) {
          try {
            var a2 = SYSCALLS.getStreamFromFD(e);
            if (a2.fd === t2) return -28;
            if (t2 < 0 || t2 >= FS.MAX_OPEN_FDS) return -8;
            var o4 = FS.getStream(t2);
            return o4 && FS.close(o4), FS.dupStream(a2, t2).fd;
          } catch (s4) {
            if (typeof FS > "u" || s4.name !== "ErrnoError") throw s4;
            return -s4.errno;
          }
        }
        ___syscall_dup3.sig = "iiii";
        function ___syscall_faccessat(e, t2, r, a2) {
          try {
            if (t2 = SYSCALLS.getStr(t2), t2 = SYSCALLS.calculateAt(e, t2), r & -8) return -28;
            var o4 = FS.lookupPath(t2, { follow: true }), s4 = o4.node;
            if (!s4) return -44;
            var _3 = "";
            return r & 4 && (_3 += "r"), r & 2 && (_3 += "w"), r & 1 && (_3 += "x"), _3 && FS.nodePermissions(s4, _3) ? -2 : 0;
          } catch (n3) {
            if (typeof FS > "u" || n3.name !== "ErrnoError") throw n3;
            return -n3.errno;
          }
        }
        ___syscall_faccessat.sig = "iipii";
        var ___syscall_fadvise64 = (e, t2, r, a2) => 0;
        ___syscall_fadvise64.sig = "iijji";
        var INT53_MAX = 9007199254740992, INT53_MIN = -9007199254740992, bigintToI53Checked = (e) => e < INT53_MIN || e > INT53_MAX ? NaN : Number(e);
        function ___syscall_fallocate(e, t2, r, a2) {
          r = bigintToI53Checked(r), a2 = bigintToI53Checked(a2);
          try {
            if (isNaN(r)) return 61;
            var o4 = SYSCALLS.getStreamFromFD(e);
            return FS.allocate(o4, r, a2), 0;
          } catch (s4) {
            if (typeof FS > "u" || s4.name !== "ErrnoError") throw s4;
            return -s4.errno;
          }
        }
        ___syscall_fallocate.sig = "iiijj";
        var syscallGetVarargI = () => {
          var e = HEAP32[+SYSCALLS.varargs >> 2];
          return SYSCALLS.varargs += 4, e;
        }, syscallGetVarargP = syscallGetVarargI;
        function ___syscall_fcntl64(e, t2, r) {
          SYSCALLS.varargs = r;
          try {
            var a2 = SYSCALLS.getStreamFromFD(e);
            switch (t2) {
              case 0: {
                var o4 = syscallGetVarargI();
                if (o4 < 0) return -28;
                for (; FS.streams[o4]; ) o4++;
                var s4;
                return s4 = FS.dupStream(a2, o4), s4.fd;
              }
              case 1:
              case 2:
                return 0;
              case 3:
                return a2.flags;
              case 4: {
                var o4 = syscallGetVarargI();
                return a2.flags |= o4, 0;
              }
              case 12: {
                var o4 = syscallGetVarargP(), _3 = 0;
                return HEAP16[o4 + _3 >> 1] = 2, 0;
              }
              case 13:
              case 14:
                return 0;
            }
            return -28;
          } catch (n3) {
            if (typeof FS > "u" || n3.name !== "ErrnoError") throw n3;
            return -n3.errno;
          }
        }
        ___syscall_fcntl64.sig = "iiip";
        function ___syscall_fdatasync(e) {
          try {
            var t2 = SYSCALLS.getStreamFromFD(e);
            return 0;
          } catch (r) {
            if (typeof FS > "u" || r.name !== "ErrnoError") throw r;
            return -r.errno;
          }
        }
        ___syscall_fdatasync.sig = "ii";
        function ___syscall_fstat64(e, t2) {
          try {
            var r = SYSCALLS.getStreamFromFD(e);
            return SYSCALLS.doStat(FS.stat, r.path, t2);
          } catch (a2) {
            if (typeof FS > "u" || a2.name !== "ErrnoError") throw a2;
            return -a2.errno;
          }
        }
        ___syscall_fstat64.sig = "iip";
        function ___syscall_ftruncate64(e, t2) {
          t2 = bigintToI53Checked(t2);
          try {
            return isNaN(t2) ? 61 : (FS.ftruncate(e, t2), 0);
          } catch (r) {
            if (typeof FS > "u" || r.name !== "ErrnoError") throw r;
            return -r.errno;
          }
        }
        ___syscall_ftruncate64.sig = "iij";
        var stringToUTF8 = (e, t2, r) => stringToUTF8Array(e, HEAPU8, t2, r);
        function ___syscall_getcwd(e, t2) {
          try {
            if (t2 === 0) return -28;
            var r = FS.cwd(), a2 = lengthBytesUTF8(r) + 1;
            return t2 < a2 ? -68 : (stringToUTF8(r, e, t2), a2);
          } catch (o4) {
            if (typeof FS > "u" || o4.name !== "ErrnoError") throw o4;
            return -o4.errno;
          }
        }
        ___syscall_getcwd.sig = "ipp";
        function ___syscall_getdents64(e, t2, r) {
          try {
            var a2 = SYSCALLS.getStreamFromFD(e);
            a2.getdents || (a2.getdents = FS.readdir(a2.path));
            for (var o4 = 280, s4 = 0, _3 = FS.llseek(a2, 0, 1), n3 = Math.floor(_3 / o4), l3 = Math.min(a2.getdents.length, n3 + Math.floor(r / o4)), d2 = n3; d2 < l3; d2++) {
              var p4, m4, g5 = a2.getdents[d2];
              if (g5 === ".") p4 = a2.node.id, m4 = 4;
              else if (g5 === "..") {
                var u2 = FS.lookupPath(a2.path, { parent: true });
                p4 = u2.node.id, m4 = 4;
              } else {
                var f3;
                try {
                  f3 = FS.lookupNode(a2.node, g5);
                } catch (c2) {
                  if (c2?.errno === 28) continue;
                  throw c2;
                }
                p4 = f3.id, m4 = FS.isChrdev(f3.mode) ? 2 : FS.isDir(f3.mode) ? 4 : FS.isLink(f3.mode) ? 10 : 8;
              }
              HEAP64[t2 + s4 >> 3] = BigInt(p4), HEAP64[t2 + s4 + 8 >> 3] = BigInt((d2 + 1) * o4), HEAP16[t2 + s4 + 16 >> 1] = 280, HEAP8[t2 + s4 + 18] = m4, stringToUTF8(g5, t2 + s4 + 19, 256), s4 += o4;
            }
            return FS.llseek(a2, d2 * o4, 0), s4;
          } catch (c2) {
            if (typeof FS > "u" || c2.name !== "ErrnoError") throw c2;
            return -c2.errno;
          }
        }
        ___syscall_getdents64.sig = "iipp";
        function ___syscall_ioctl(e, t2, r) {
          SYSCALLS.varargs = r;
          try {
            var a2 = SYSCALLS.getStreamFromFD(e);
            switch (t2) {
              case 21509:
                return a2.tty ? 0 : -59;
              case 21505: {
                if (!a2.tty) return -59;
                if (a2.tty.ops.ioctl_tcgets) {
                  var o4 = a2.tty.ops.ioctl_tcgets(a2), s4 = syscallGetVarargP();
                  HEAP32[s4 >> 2] = o4.c_iflag || 0, HEAP32[s4 + 4 >> 2] = o4.c_oflag || 0, HEAP32[s4 + 8 >> 2] = o4.c_cflag || 0, HEAP32[s4 + 12 >> 2] = o4.c_lflag || 0;
                  for (var _3 = 0; _3 < 32; _3++) HEAP8[s4 + _3 + 17] = o4.c_cc[_3] || 0;
                  return 0;
                }
                return 0;
              }
              case 21510:
              case 21511:
              case 21512:
                return a2.tty ? 0 : -59;
              case 21506:
              case 21507:
              case 21508: {
                if (!a2.tty) return -59;
                if (a2.tty.ops.ioctl_tcsets) {
                  for (var s4 = syscallGetVarargP(), n3 = HEAP32[s4 >> 2], l3 = HEAP32[s4 + 4 >> 2], d2 = HEAP32[s4 + 8 >> 2], p4 = HEAP32[s4 + 12 >> 2], m4 = [], _3 = 0; _3 < 32; _3++) m4.push(HEAP8[s4 + _3 + 17]);
                  return a2.tty.ops.ioctl_tcsets(a2.tty, t2, { c_iflag: n3, c_oflag: l3, c_cflag: d2, c_lflag: p4, c_cc: m4 });
                }
                return 0;
              }
              case 21519: {
                if (!a2.tty) return -59;
                var s4 = syscallGetVarargP();
                return HEAP32[s4 >> 2] = 0, 0;
              }
              case 21520:
                return a2.tty ? -28 : -59;
              case 21531: {
                var s4 = syscallGetVarargP();
                return FS.ioctl(a2, t2, s4);
              }
              case 21523: {
                if (!a2.tty) return -59;
                if (a2.tty.ops.ioctl_tiocgwinsz) {
                  var g5 = a2.tty.ops.ioctl_tiocgwinsz(a2.tty), s4 = syscallGetVarargP();
                  HEAP16[s4 >> 1] = g5[0], HEAP16[s4 + 2 >> 1] = g5[1];
                }
                return 0;
              }
              case 21524:
                return a2.tty ? 0 : -59;
              case 21515:
                return a2.tty ? 0 : -59;
              default:
                return -28;
            }
          } catch (u2) {
            if (typeof FS > "u" || u2.name !== "ErrnoError") throw u2;
            return -u2.errno;
          }
        }
        ___syscall_ioctl.sig = "iiip";
        function ___syscall_lstat64(e, t2) {
          try {
            return e = SYSCALLS.getStr(e), SYSCALLS.doStat(FS.lstat, e, t2);
          } catch (r) {
            if (typeof FS > "u" || r.name !== "ErrnoError") throw r;
            return -r.errno;
          }
        }
        ___syscall_lstat64.sig = "ipp";
        function ___syscall_mkdirat(e, t2, r) {
          try {
            return t2 = SYSCALLS.getStr(t2), t2 = SYSCALLS.calculateAt(e, t2), FS.mkdir(t2, r, 0), 0;
          } catch (a2) {
            if (typeof FS > "u" || a2.name !== "ErrnoError") throw a2;
            return -a2.errno;
          }
        }
        ___syscall_mkdirat.sig = "iipi";
        function ___syscall_newfstatat(e, t2, r, a2) {
          try {
            t2 = SYSCALLS.getStr(t2);
            var o4 = a2 & 256, s4 = a2 & 4096;
            return a2 = a2 & -6401, t2 = SYSCALLS.calculateAt(e, t2, s4), SYSCALLS.doStat(o4 ? FS.lstat : FS.stat, t2, r);
          } catch (_3) {
            if (typeof FS > "u" || _3.name !== "ErrnoError") throw _3;
            return -_3.errno;
          }
        }
        ___syscall_newfstatat.sig = "iippi";
        function ___syscall_openat(e, t2, r, a2) {
          SYSCALLS.varargs = a2;
          try {
            t2 = SYSCALLS.getStr(t2), t2 = SYSCALLS.calculateAt(e, t2);
            var o4 = a2 ? syscallGetVarargI() : 0;
            return FS.open(t2, r, o4).fd;
          } catch (s4) {
            if (typeof FS > "u" || s4.name !== "ErrnoError") throw s4;
            return -s4.errno;
          }
        }
        ___syscall_openat.sig = "iipip";
        var PIPEFS = { BUCKET_BUFFER_SIZE: 8192, mount(e) {
          return FS.createNode(null, "/", 16895, 0);
        }, createPipe() {
          var e = { buckets: [], refcnt: 2 };
          e.buckets.push({ buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE), offset: 0, roffset: 0 });
          var t2 = PIPEFS.nextname(), r = PIPEFS.nextname(), a2 = FS.createNode(PIPEFS.root, t2, 4096, 0), o4 = FS.createNode(PIPEFS.root, r, 4096, 0);
          a2.pipe = e, o4.pipe = e;
          var s4 = FS.createStream({ path: t2, node: a2, flags: 0, seekable: false, stream_ops: PIPEFS.stream_ops });
          a2.stream = s4;
          var _3 = FS.createStream({ path: r, node: o4, flags: 1, seekable: false, stream_ops: PIPEFS.stream_ops });
          return o4.stream = _3, { readable_fd: s4.fd, writable_fd: _3.fd };
        }, stream_ops: { poll(e) {
          var t2 = e.node.pipe;
          if ((e.flags & 2097155) === 1) return 260;
          if (t2.buckets.length > 0) for (var r = 0; r < t2.buckets.length; r++) {
            var a2 = t2.buckets[r];
            if (a2.offset - a2.roffset > 0) return 65;
          }
          return 0;
        }, ioctl(e, t2, r) {
          return 28;
        }, fsync(e) {
          return 28;
        }, read(e, t2, r, a2, o4) {
          for (var s4 = e.node.pipe, _3 = 0, n3 = 0; n3 < s4.buckets.length; n3++) {
            var l3 = s4.buckets[n3];
            _3 += l3.offset - l3.roffset;
          }
          var d2 = t2.subarray(r, r + a2);
          if (a2 <= 0) return 0;
          if (_3 == 0) throw new FS.ErrnoError(6);
          for (var p4 = Math.min(_3, a2), m4 = p4, g5 = 0, n3 = 0; n3 < s4.buckets.length; n3++) {
            var u2 = s4.buckets[n3], f3 = u2.offset - u2.roffset;
            if (p4 <= f3) {
              var c2 = u2.buffer.subarray(u2.roffset, u2.offset);
              p4 < f3 ? (c2 = c2.subarray(0, p4), u2.roffset += p4) : g5++, d2.set(c2);
              break;
            } else {
              var c2 = u2.buffer.subarray(u2.roffset, u2.offset);
              d2.set(c2), d2 = d2.subarray(c2.byteLength), p4 -= c2.byteLength, g5++;
            }
          }
          return g5 && g5 == s4.buckets.length && (g5--, s4.buckets[g5].offset = 0, s4.buckets[g5].roffset = 0), s4.buckets.splice(0, g5), m4;
        }, write(e, t2, r, a2, o4) {
          var s4 = e.node.pipe, _3 = t2.subarray(r, r + a2), n3 = _3.byteLength;
          if (n3 <= 0) return 0;
          var l3 = null;
          s4.buckets.length == 0 ? (l3 = { buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE), offset: 0, roffset: 0 }, s4.buckets.push(l3)) : l3 = s4.buckets[s4.buckets.length - 1], assert(l3.offset <= PIPEFS.BUCKET_BUFFER_SIZE);
          var d2 = PIPEFS.BUCKET_BUFFER_SIZE - l3.offset;
          if (d2 >= n3) return l3.buffer.set(_3, l3.offset), l3.offset += n3, n3;
          d2 > 0 && (l3.buffer.set(_3.subarray(0, d2), l3.offset), l3.offset += d2, _3 = _3.subarray(d2, _3.byteLength));
          for (var p4 = _3.byteLength / PIPEFS.BUCKET_BUFFER_SIZE | 0, m4 = _3.byteLength % PIPEFS.BUCKET_BUFFER_SIZE, g5 = 0; g5 < p4; g5++) {
            var u2 = { buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE), offset: PIPEFS.BUCKET_BUFFER_SIZE, roffset: 0 };
            s4.buckets.push(u2), u2.buffer.set(_3.subarray(0, PIPEFS.BUCKET_BUFFER_SIZE)), _3 = _3.subarray(PIPEFS.BUCKET_BUFFER_SIZE, _3.byteLength);
          }
          if (m4 > 0) {
            var u2 = { buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE), offset: _3.byteLength, roffset: 0 };
            s4.buckets.push(u2), u2.buffer.set(_3);
          }
          return n3;
        }, close(e) {
          var t2 = e.node.pipe;
          t2.refcnt--, t2.refcnt === 0 && (t2.buckets = null);
        } }, nextname() {
          return PIPEFS.nextname.current || (PIPEFS.nextname.current = 0), "pipe[" + PIPEFS.nextname.current++ + "]";
        } };
        function ___syscall_pipe(e) {
          try {
            if (e == 0) throw new FS.ErrnoError(21);
            var t2 = PIPEFS.createPipe();
            return HEAP32[e >> 2] = t2.readable_fd, HEAP32[e + 4 >> 2] = t2.writable_fd, 0;
          } catch (r) {
            if (typeof FS > "u" || r.name !== "ErrnoError") throw r;
            return -r.errno;
          }
        }
        ___syscall_pipe.sig = "ip";
        function ___syscall_readlinkat(e, t2, r, a2) {
          try {
            if (t2 = SYSCALLS.getStr(t2), t2 = SYSCALLS.calculateAt(e, t2), a2 <= 0) return -28;
            var o4 = FS.readlink(t2), s4 = Math.min(a2, lengthBytesUTF8(o4)), _3 = HEAP8[r + s4];
            return stringToUTF8(o4, r, a2 + 1), HEAP8[r + s4] = _3, s4;
          } catch (n3) {
            if (typeof FS > "u" || n3.name !== "ErrnoError") throw n3;
            return -n3.errno;
          }
        }
        ___syscall_readlinkat.sig = "iippp";
        var writeSockaddr = (e, t2, r, a2, o4) => {
          switch (t2) {
            case 2:
              r = inetPton4(r), zeroMemory(e, 16), o4 && (HEAP32[o4 >> 2] = 16), HEAP16[e >> 1] = t2, HEAP32[e + 4 >> 2] = r, HEAP16[e + 2 >> 1] = _htons(a2);
              break;
            case 10:
              r = inetPton6(r), zeroMemory(e, 28), o4 && (HEAP32[o4 >> 2] = 28), HEAP32[e >> 2] = t2, HEAP32[e + 8 >> 2] = r[0], HEAP32[e + 12 >> 2] = r[1], HEAP32[e + 16 >> 2] = r[2], HEAP32[e + 20 >> 2] = r[3], HEAP16[e + 2 >> 1] = _htons(a2);
              break;
            default:
              return 5;
          }
          return 0;
        };
        function ___syscall_recvfrom(e, t2, r, a2, o4, s4) {
          try {
            var _3 = getSocketFromFD(e), n3 = _3.sock_ops.recvmsg(_3, r);
            if (!n3) return 0;
            if (o4) var l3 = writeSockaddr(o4, _3.family, DNS.lookup_name(n3.addr), n3.port, s4);
            return HEAPU8.set(n3.buffer, t2), n3.buffer.byteLength;
          } catch (d2) {
            if (typeof FS > "u" || d2.name !== "ErrnoError") throw d2;
            return -d2.errno;
          }
        }
        ___syscall_recvfrom.sig = "iippipp";
        function ___syscall_renameat(e, t2, r, a2) {
          try {
            return t2 = SYSCALLS.getStr(t2), a2 = SYSCALLS.getStr(a2), t2 = SYSCALLS.calculateAt(e, t2), a2 = SYSCALLS.calculateAt(r, a2), FS.rename(t2, a2), 0;
          } catch (o4) {
            if (typeof FS > "u" || o4.name !== "ErrnoError") throw o4;
            return -o4.errno;
          }
        }
        ___syscall_renameat.sig = "iipip";
        function ___syscall_rmdir(e) {
          try {
            return e = SYSCALLS.getStr(e), FS.rmdir(e), 0;
          } catch (t2) {
            if (typeof FS > "u" || t2.name !== "ErrnoError") throw t2;
            return -t2.errno;
          }
        }
        ___syscall_rmdir.sig = "ip";
        function ___syscall_sendto(e, t2, r, a2, o4, s4) {
          try {
            var _3 = getSocketFromFD(e);
            if (!o4) return FS.write(_3.stream, HEAP8, t2, r);
            var n3 = getSocketAddress(o4, s4);
            return _3.sock_ops.sendmsg(_3, HEAP8, t2, r, n3.addr, n3.port);
          } catch (l3) {
            if (typeof FS > "u" || l3.name !== "ErrnoError") throw l3;
            return -l3.errno;
          }
        }
        ___syscall_sendto.sig = "iippipp";
        function ___syscall_socket(e, t2, r) {
          try {
            var a2 = SOCKFS.createSocket(e, t2, r);
            return a2.stream.fd;
          } catch (o4) {
            if (typeof FS > "u" || o4.name !== "ErrnoError") throw o4;
            return -o4.errno;
          }
        }
        ___syscall_socket.sig = "iiiiiii";
        function ___syscall_stat64(e, t2) {
          try {
            return e = SYSCALLS.getStr(e), SYSCALLS.doStat(FS.stat, e, t2);
          } catch (r) {
            if (typeof FS > "u" || r.name !== "ErrnoError") throw r;
            return -r.errno;
          }
        }
        ___syscall_stat64.sig = "ipp";
        function ___syscall_symlinkat(e, t2, r) {
          try {
            return e = SYSCALLS.getStr(e), r = SYSCALLS.getStr(r), r = SYSCALLS.calculateAt(t2, r), FS.symlink(e, r), 0;
          } catch (a2) {
            if (typeof FS > "u" || a2.name !== "ErrnoError") throw a2;
            return -a2.errno;
          }
        }
        ___syscall_symlinkat.sig = "ipip";
        function ___syscall_truncate64(e, t2) {
          t2 = bigintToI53Checked(t2);
          try {
            return isNaN(t2) ? 61 : (e = SYSCALLS.getStr(e), FS.truncate(e, t2), 0);
          } catch (r) {
            if (typeof FS > "u" || r.name !== "ErrnoError") throw r;
            return -r.errno;
          }
        }
        ___syscall_truncate64.sig = "ipj";
        function ___syscall_unlinkat(e, t2, r) {
          try {
            return t2 = SYSCALLS.getStr(t2), t2 = SYSCALLS.calculateAt(e, t2), r === 0 ? FS.unlink(t2) : r === 512 ? FS.rmdir(t2) : abort("Invalid flags passed to unlinkat"), 0;
          } catch (a2) {
            if (typeof FS > "u" || a2.name !== "ErrnoError") throw a2;
            return -a2.errno;
          }
        }
        ___syscall_unlinkat.sig = "iipi";
        var ___table_base = new WebAssembly.Global({ value: "i32", mutable: false }, 1);
        Module.___table_base = ___table_base;
        var __abort_js = () => abort("");
        __abort_js.sig = "v";
        var ENV = {}, stackAlloc = (e) => __emscripten_stack_alloc(e), stringToUTF8OnStack = (e) => {
          var t2 = lengthBytesUTF8(e) + 1, r = stackAlloc(t2);
          return stringToUTF8(e, r, t2), r;
        }, dlSetError = (e) => {
          var t2 = stackSave(), r = stringToUTF8OnStack(e);
          ___dl_seterr(r, 0), stackRestore(t2);
        }, dlopenInternal = (e, t2) => {
          var r = UTF8ToString(e + 36), a2 = HEAP32[e + 4 >> 2];
          r = PATH.normalize(r);
          var o4 = !!(a2 & 256), s4 = o4 ? null : {}, _3 = { global: o4, nodelete: !!(a2 & 4096), loadAsync: t2.loadAsync };
          if (t2.loadAsync) return loadDynamicLibrary(r, _3, s4, e);
          try {
            return loadDynamicLibrary(r, _3, s4, e);
          } catch (n3) {
            return dlSetError(`Could not load dynamic lib: ${r}
${n3}`), 0;
          }
        }, __dlopen_js = (e) => dlopenInternal(e, { loadAsync: false });
        __dlopen_js.sig = "pp";
        var __dlsym_js = (e, t2, r) => {
          t2 = UTF8ToString(t2);
          var a2, o4, s4 = LDSO.loadedLibsByHandle[e];
          if (!s4.exports.hasOwnProperty(t2) || s4.exports[t2].stub) return dlSetError(`Tried to lookup unknown symbol "${t2}" in dynamic lib: ${s4.name}`), 0;
          if (o4 = Object.keys(s4.exports).indexOf(t2), a2 = s4.exports[t2], typeof a2 == "function") {
            var _3 = getFunctionAddress(a2);
            _3 ? a2 = _3 : (a2 = addFunction(a2, a2.sig), HEAPU32[r >> 2] = o4);
          }
          return a2;
        };
        __dlsym_js.sig = "pppp";
        var __emscripten_memcpy_js = (e, t2, r) => HEAPU8.copyWithin(e, t2, t2 + r);
        __emscripten_memcpy_js.sig = "vppp";
        var runtimeKeepaliveCounter = 0, __emscripten_runtime_keepalive_clear = () => {
          noExitRuntime = false, runtimeKeepaliveCounter = 0;
        };
        __emscripten_runtime_keepalive_clear.sig = "v";
        var __emscripten_system = (e) => {
          if (ENVIRONMENT_IS_NODE) {
            if (!e) return 1;
            var t2 = UTF8ToString(e);
            if (!t2.length) return 0;
            var r = require("child_process"), a2 = r.spawnSync(t2, [], { shell: true, stdio: "inherit" }), o4 = (_3, n3) => _3 << 8 | n3;
            if (a2.status === null) {
              var s4 = (_3) => {
                switch (_3) {
                  case "SIGHUP":
                    return 1;
                  case "SIGQUIT":
                    return 3;
                  case "SIGFPE":
                    return 8;
                  case "SIGKILL":
                    return 9;
                  case "SIGALRM":
                    return 14;
                  case "SIGTERM":
                    return 15;
                  default:
                    return 2;
                }
              };
              return o4(0, s4(a2.signal));
            }
            return o4(a2.status, 0);
          }
          return e ? -52 : 0;
        };
        __emscripten_system.sig = "ip";
        var __emscripten_throw_longjmp = () => {
          throw 1 / 0;
        };
        __emscripten_throw_longjmp.sig = "v";
        function __gmtime_js(e, t2) {
          e = bigintToI53Checked(e);
          var r = new Date(e * 1e3);
          HEAP32[t2 >> 2] = r.getUTCSeconds(), HEAP32[t2 + 4 >> 2] = r.getUTCMinutes(), HEAP32[t2 + 8 >> 2] = r.getUTCHours(), HEAP32[t2 + 12 >> 2] = r.getUTCDate(), HEAP32[t2 + 16 >> 2] = r.getUTCMonth(), HEAP32[t2 + 20 >> 2] = r.getUTCFullYear() - 1900, HEAP32[t2 + 24 >> 2] = r.getUTCDay();
          var a2 = Date.UTC(r.getUTCFullYear(), 0, 1, 0, 0, 0, 0), o4 = (r.getTime() - a2) / (1e3 * 60 * 60 * 24) | 0;
          HEAP32[t2 + 28 >> 2] = o4;
        }
        __gmtime_js.sig = "vjp";
        var isLeapYear = (e) => e % 4 === 0 && (e % 100 !== 0 || e % 400 === 0), MONTH_DAYS_LEAP_CUMULATIVE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], MONTH_DAYS_REGULAR_CUMULATIVE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], ydayFromDate = (e) => {
          var t2 = isLeapYear(e.getFullYear()), r = t2 ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE, a2 = r[e.getMonth()] + e.getDate() - 1;
          return a2;
        };
        function __localtime_js(e, t2) {
          e = bigintToI53Checked(e);
          var r = new Date(e * 1e3);
          HEAP32[t2 >> 2] = r.getSeconds(), HEAP32[t2 + 4 >> 2] = r.getMinutes(), HEAP32[t2 + 8 >> 2] = r.getHours(), HEAP32[t2 + 12 >> 2] = r.getDate(), HEAP32[t2 + 16 >> 2] = r.getMonth(), HEAP32[t2 + 20 >> 2] = r.getFullYear() - 1900, HEAP32[t2 + 24 >> 2] = r.getDay();
          var a2 = ydayFromDate(r) | 0;
          HEAP32[t2 + 28 >> 2] = a2, HEAP32[t2 + 36 >> 2] = -(r.getTimezoneOffset() * 60);
          var o4 = new Date(r.getFullYear(), 0, 1), s4 = new Date(r.getFullYear(), 6, 1).getTimezoneOffset(), _3 = o4.getTimezoneOffset(), n3 = (s4 != _3 && r.getTimezoneOffset() == Math.min(_3, s4)) | 0;
          HEAP32[t2 + 32 >> 2] = n3;
        }
        __localtime_js.sig = "vjp";
        function __mmap_js(e, t2, r, a2, o4, s4, _3) {
          o4 = bigintToI53Checked(o4);
          try {
            if (isNaN(o4)) return 61;
            var n3 = SYSCALLS.getStreamFromFD(a2), l3 = FS.mmap(n3, e, o4, t2, r), d2 = l3.ptr;
            return HEAP32[s4 >> 2] = l3.allocated, HEAPU32[_3 >> 2] = d2, 0;
          } catch (p4) {
            if (typeof FS > "u" || p4.name !== "ErrnoError") throw p4;
            return -p4.errno;
          }
        }
        __mmap_js.sig = "ipiiijpp";
        function __munmap_js(e, t2, r, a2, o4, s4) {
          s4 = bigintToI53Checked(s4);
          try {
            var _3 = SYSCALLS.getStreamFromFD(o4);
            r & 2 && SYSCALLS.doMsync(e, _3, t2, a2, s4);
          } catch (n3) {
            if (typeof FS > "u" || n3.name !== "ErrnoError") throw n3;
            return -n3.errno;
          }
        }
        __munmap_js.sig = "ippiiij";
        var timers = {}, handleException = (e) => {
          if (e instanceof ExitStatus || e == "unwind") return EXITSTATUS;
          quit_(1, e);
        }, keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0, _proc_exit = (e) => {
          EXITSTATUS = e, keepRuntimeAlive() || (Module.onExit?.(e), ABORT = true), quit_(e, new ExitStatus(e));
        };
        _proc_exit.sig = "vi";
        var exitJS = (e, t2) => {
          EXITSTATUS = e, _proc_exit(e);
        }, _exit = exitJS;
        _exit.sig = "vi";
        var maybeExit = () => {
          if (!keepRuntimeAlive()) try {
            _exit(EXITSTATUS);
          } catch (e) {
            handleException(e);
          }
        }, callUserCallback = (e) => {
          if (!ABORT) try {
            e(), maybeExit();
          } catch (t2) {
            handleException(t2);
          }
        }, _emscripten_get_now = () => performance.now();
        _emscripten_get_now.sig = "d";
        var __setitimer_js = (e, t2) => {
          if (timers[e] && (clearTimeout(timers[e].id), delete timers[e]), !t2) return 0;
          var r = setTimeout(() => {
            delete timers[e], callUserCallback(() => __emscripten_timeout(e, _emscripten_get_now()));
          }, t2);
          return timers[e] = { id: r, timeout_ms: t2 }, 0;
        };
        __setitimer_js.sig = "iid";
        var __tzset_js = (e, t2, r, a2) => {
          var o4 = (/* @__PURE__ */ new Date()).getFullYear(), s4 = new Date(o4, 0, 1), _3 = new Date(o4, 6, 1), n3 = s4.getTimezoneOffset(), l3 = _3.getTimezoneOffset(), d2 = Math.max(n3, l3);
          HEAPU32[e >> 2] = d2 * 60, HEAP32[t2 >> 2] = +(n3 != l3);
          var p4 = (u2) => {
            var f3 = u2 >= 0 ? "-" : "+", c2 = Math.abs(u2), w4 = String(Math.floor(c2 / 60)).padStart(2, "0"), x6 = String(c2 % 60).padStart(2, "0");
            return `UTC${f3}${w4}${x6}`;
          }, m4 = p4(n3), g5 = p4(l3);
          l3 < n3 ? (stringToUTF8(m4, r, 17), stringToUTF8(g5, a2, 17)) : (stringToUTF8(m4, a2, 17), stringToUTF8(g5, r, 17));
        };
        __tzset_js.sig = "vpppp";
        var _emscripten_date_now = () => Date.now();
        _emscripten_date_now.sig = "d";
        var nowIsMonotonic = 1, checkWasiClock = (e) => e >= 0 && e <= 3;
        function _clock_time_get(e, t2, r) {
          if (t2 = bigintToI53Checked(t2), !checkWasiClock(e)) return 28;
          var a2;
          if (e === 0) a2 = _emscripten_date_now();
          else if (nowIsMonotonic) a2 = _emscripten_get_now();
          else return 52;
          var o4 = Math.round(a2 * 1e3 * 1e3);
          return HEAP64[r >> 3] = BigInt(o4), 0;
        }
        _clock_time_get.sig = "iijp";
        var readEmAsmArgsArray = [], readEmAsmArgs = (e, t2) => {
          readEmAsmArgsArray.length = 0;
          for (var r; r = HEAPU8[e++]; ) {
            var a2 = r != 105;
            a2 &= r != 112, t2 += a2 && t2 % 8 ? 4 : 0, readEmAsmArgsArray.push(r == 112 ? HEAPU32[t2 >> 2] : r == 106 ? HEAP64[t2 >> 3] : r == 105 ? HEAP32[t2 >> 2] : HEAPF64[t2 >> 3]), t2 += a2 ? 8 : 4;
          }
          return readEmAsmArgsArray;
        }, runEmAsmFunction = (e, t2, r) => {
          var a2 = readEmAsmArgs(t2, r);
          return ASM_CONSTS[e](...a2);
        }, _emscripten_asm_const_int = (e, t2, r) => runEmAsmFunction(e, t2, r);
        _emscripten_asm_const_int.sig = "ippp";
        var _emscripten_force_exit = (e) => {
          __emscripten_runtime_keepalive_clear(), _exit(e);
        };
        _emscripten_force_exit.sig = "vi";
        var getHeapMax = () => 2147483648, growMemory = (e) => {
          var t2 = wasmMemory.buffer, r = (e - t2.byteLength + 65535) / 65536 | 0;
          try {
            return wasmMemory.grow(r), updateMemoryViews(), 1;
          } catch {
          }
        }, _emscripten_resize_heap = (e) => {
          var t2 = HEAPU8.length;
          e >>>= 0;
          var r = getHeapMax();
          if (e > r) return false;
          for (var a2 = 1; a2 <= 4; a2 *= 2) {
            var o4 = t2 * (1 + 0.2 / a2);
            o4 = Math.min(o4, e + 100663296);
            var s4 = Math.min(r, alignMemory(Math.max(e, o4), 65536)), _3 = growMemory(s4);
            if (_3) return true;
          }
          return false;
        };
        _emscripten_resize_heap.sig = "ip";
        var getExecutableName = () => thisProgram || "./this.program", getEnvStrings = () => {
          if (!getEnvStrings.strings) {
            var e = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", t2 = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: e, _: getExecutableName() };
            for (var r in ENV) ENV[r] === void 0 ? delete t2[r] : t2[r] = ENV[r];
            var a2 = [];
            for (var r in t2) a2.push(`${r}=${t2[r]}`);
            getEnvStrings.strings = a2;
          }
          return getEnvStrings.strings;
        }, stringToAscii = (e, t2) => {
          for (var r = 0; r < e.length; ++r) HEAP8[t2++] = e.charCodeAt(r);
          HEAP8[t2] = 0;
        }, _environ_get = (e, t2) => {
          var r = 0;
          return getEnvStrings().forEach((a2, o4) => {
            var s4 = t2 + r;
            HEAPU32[e + o4 * 4 >> 2] = s4, stringToAscii(a2, s4), r += a2.length + 1;
          }), 0;
        };
        _environ_get.sig = "ipp";
        var _environ_sizes_get = (e, t2) => {
          var r = getEnvStrings();
          HEAPU32[e >> 2] = r.length;
          var a2 = 0;
          return r.forEach((o4) => a2 += o4.length + 1), HEAPU32[t2 >> 2] = a2, 0;
        };
        _environ_sizes_get.sig = "ipp";
        function _fd_close(e) {
          try {
            var t2 = SYSCALLS.getStreamFromFD(e);
            return FS.close(t2), 0;
          } catch (r) {
            if (typeof FS > "u" || r.name !== "ErrnoError") throw r;
            return r.errno;
          }
        }
        _fd_close.sig = "ii";
        function _fd_fdstat_get(e, t2) {
          try {
            var r = 0, a2 = 0, o4 = 0, s4 = SYSCALLS.getStreamFromFD(e), _3 = s4.tty ? 2 : FS.isDir(s4.mode) ? 3 : FS.isLink(s4.mode) ? 7 : 4;
            return HEAP8[t2] = _3, HEAP16[t2 + 2 >> 1] = o4, HEAP64[t2 + 8 >> 3] = BigInt(r), HEAP64[t2 + 16 >> 3] = BigInt(a2), 0;
          } catch (n3) {
            if (typeof FS > "u" || n3.name !== "ErrnoError") throw n3;
            return n3.errno;
          }
        }
        _fd_fdstat_get.sig = "iip";
        var doReadv = (e, t2, r, a2) => {
          for (var o4 = 0, s4 = 0; s4 < r; s4++) {
            var _3 = HEAPU32[t2 >> 2], n3 = HEAPU32[t2 + 4 >> 2];
            t2 += 8;
            var l3 = FS.read(e, HEAP8, _3, n3, a2);
            if (l3 < 0) return -1;
            if (o4 += l3, l3 < n3) break;
            typeof a2 < "u" && (a2 += l3);
          }
          return o4;
        };
        function _fd_pread(e, t2, r, a2, o4) {
          a2 = bigintToI53Checked(a2);
          try {
            if (isNaN(a2)) return 61;
            var s4 = SYSCALLS.getStreamFromFD(e), _3 = doReadv(s4, t2, r, a2);
            return HEAPU32[o4 >> 2] = _3, 0;
          } catch (n3) {
            if (typeof FS > "u" || n3.name !== "ErrnoError") throw n3;
            return n3.errno;
          }
        }
        _fd_pread.sig = "iippjp";
        var doWritev = (e, t2, r, a2) => {
          for (var o4 = 0, s4 = 0; s4 < r; s4++) {
            var _3 = HEAPU32[t2 >> 2], n3 = HEAPU32[t2 + 4 >> 2];
            t2 += 8;
            var l3 = FS.write(e, HEAP8, _3, n3, a2);
            if (l3 < 0) return -1;
            if (o4 += l3, l3 < n3) break;
            typeof a2 < "u" && (a2 += l3);
          }
          return o4;
        };
        function _fd_pwrite(e, t2, r, a2, o4) {
          a2 = bigintToI53Checked(a2);
          try {
            if (isNaN(a2)) return 61;
            var s4 = SYSCALLS.getStreamFromFD(e), _3 = doWritev(s4, t2, r, a2);
            return HEAPU32[o4 >> 2] = _3, 0;
          } catch (n3) {
            if (typeof FS > "u" || n3.name !== "ErrnoError") throw n3;
            return n3.errno;
          }
        }
        _fd_pwrite.sig = "iippjp";
        function _fd_read(e, t2, r, a2) {
          try {
            var o4 = SYSCALLS.getStreamFromFD(e), s4 = doReadv(o4, t2, r);
            return HEAPU32[a2 >> 2] = s4, 0;
          } catch (_3) {
            if (typeof FS > "u" || _3.name !== "ErrnoError") throw _3;
            return _3.errno;
          }
        }
        _fd_read.sig = "iippp";
        function _fd_seek(e, t2, r, a2) {
          t2 = bigintToI53Checked(t2);
          try {
            if (isNaN(t2)) return 61;
            var o4 = SYSCALLS.getStreamFromFD(e);
            return FS.llseek(o4, t2, r), HEAP64[a2 >> 3] = BigInt(o4.position), o4.getdents && t2 === 0 && r === 0 && (o4.getdents = null), 0;
          } catch (s4) {
            if (typeof FS > "u" || s4.name !== "ErrnoError") throw s4;
            return s4.errno;
          }
        }
        _fd_seek.sig = "iijip";
        function _fd_sync(e) {
          try {
            var t2 = SYSCALLS.getStreamFromFD(e);
            return t2.stream_ops?.fsync ? t2.stream_ops.fsync(t2) : 0;
          } catch (r) {
            if (typeof FS > "u" || r.name !== "ErrnoError") throw r;
            return r.errno;
          }
        }
        _fd_sync.sig = "ii";
        function _fd_write(e, t2, r, a2) {
          try {
            var o4 = SYSCALLS.getStreamFromFD(e), s4 = doWritev(o4, t2, r);
            return HEAPU32[a2 >> 2] = s4, 0;
          } catch (_3) {
            if (typeof FS > "u" || _3.name !== "ErrnoError") throw _3;
            return _3.errno;
          }
        }
        _fd_write.sig = "iippp";
        var _getaddrinfo = (e, t2, r, a2) => {
          var o4 = 0, s4 = 0, _3 = 0, n3 = 0, l3 = 0, d2 = 0, p4;
          function m4(g5, u2, f3, c2, w4, x6) {
            var S3, h3, b3, v3;
            return h3 = g5 === 10 ? 28 : 16, w4 = g5 === 10 ? inetNtop6(w4) : inetNtop4(w4), S3 = _malloc(h3), v3 = writeSockaddr(S3, g5, w4, x6), assert(!v3), b3 = _malloc(32), HEAP32[b3 + 4 >> 2] = g5, HEAP32[b3 + 8 >> 2] = u2, HEAP32[b3 + 12 >> 2] = f3, HEAPU32[b3 + 24 >> 2] = c2, HEAPU32[b3 + 20 >> 2] = S3, g5 === 10 ? HEAP32[b3 + 16 >> 2] = 28 : HEAP32[b3 + 16 >> 2] = 16, HEAP32[b3 + 28 >> 2] = 0, b3;
          }
          if (r && (_3 = HEAP32[r >> 2], n3 = HEAP32[r + 4 >> 2], l3 = HEAP32[r + 8 >> 2], d2 = HEAP32[r + 12 >> 2]), l3 && !d2 && (d2 = l3 === 2 ? 17 : 6), !l3 && d2 && (l3 = d2 === 17 ? 2 : 1), d2 === 0 && (d2 = 6), l3 === 0 && (l3 = 1), !e && !t2) return -2;
          if (_3 & -1088 || r !== 0 && HEAP32[r >> 2] & 2 && !e) return -1;
          if (_3 & 32) return -2;
          if (l3 !== 0 && l3 !== 1 && l3 !== 2) return -7;
          if (n3 !== 0 && n3 !== 2 && n3 !== 10) return -6;
          if (t2 && (t2 = UTF8ToString(t2), s4 = parseInt(t2, 10), isNaN(s4))) return _3 & 1024 ? -2 : -8;
          if (!e) return n3 === 0 && (n3 = 2), _3 & 1 || (n3 === 2 ? o4 = _htonl(2130706433) : o4 = [0, 0, 0, _htonl(1)]), p4 = m4(n3, l3, d2, null, o4, s4), HEAPU32[a2 >> 2] = p4, 0;
          if (e = UTF8ToString(e), o4 = inetPton4(e), o4 !== null) if (n3 === 0 || n3 === 2) n3 = 2;
          else if (n3 === 10 && _3 & 8) o4 = [0, 0, _htonl(65535), o4], n3 = 10;
          else return -2;
          else if (o4 = inetPton6(e), o4 !== null) if (n3 === 0 || n3 === 10) n3 = 10;
          else return -2;
          return o4 != null ? (p4 = m4(n3, l3, d2, e, o4, s4), HEAPU32[a2 >> 2] = p4, 0) : _3 & 4 ? -2 : (e = DNS.lookup_name(e), o4 = inetPton4(e), n3 === 0 ? n3 = 2 : n3 === 10 && (o4 = [0, 0, _htonl(65535), o4]), p4 = m4(n3, l3, d2, null, o4, s4), HEAPU32[a2 >> 2] = p4, 0);
        };
        _getaddrinfo.sig = "ipppp";
        var _getnameinfo = (e, t2, r, a2, o4, s4, _3) => {
          var n3 = readSockaddr(e, t2);
          if (n3.errno) return -6;
          var l3 = n3.port, d2 = n3.addr, p4 = false;
          if (r && a2) {
            var m4;
            if (_3 & 1 || !(m4 = DNS.lookup_addr(d2))) {
              if (_3 & 8) return -2;
            } else d2 = m4;
            var g5 = stringToUTF8(d2, r, a2);
            g5 + 1 >= a2 && (p4 = true);
          }
          if (o4 && s4) {
            l3 = "" + l3;
            var g5 = stringToUTF8(l3, o4, s4);
            g5 + 1 >= s4 && (p4 = true);
          }
          return p4 ? -12 : 0;
        };
        _getnameinfo.sig = "ipipipii";
        var stringToNewUTF8 = (e) => {
          var t2 = lengthBytesUTF8(e) + 1, r = _malloc(t2);
          return r && stringToUTF8(e, r, t2), r;
        }, removeFunction = (e) => {
          functionsInTableMap.delete(getWasmTableEntry(e)), setWasmTableEntry(e, null), freeTableIndexes.push(e);
        }, FS_createPath = FS.createPath, FS_unlink = (e) => FS.unlink(e), FS_createLazyFile = FS.createLazyFile, FS_createDevice = FS.createDevice, setTempRet0 = (e) => __emscripten_tempret_set(e), _setTempRet0 = setTempRet0;
        Module._setTempRet0 = _setTempRet0;
        var getTempRet0 = (e) => __emscripten_tempret_get(), _getTempRet0 = getTempRet0;
        Module._getTempRet0 = _getTempRet0, registerWasmPlugin(), FS.createPreloadedFile = FS_createPreloadedFile, FS.staticInit(), Module.FS_createPath = FS.createPath, Module.FS_createDataFile = FS.createDataFile, Module.FS_createPreloadedFile = FS.createPreloadedFile, Module.FS_unlink = FS.unlink, Module.FS_createLazyFile = FS.createLazyFile, Module.FS_createDevice = FS.createDevice, MEMFS.doesNotExistError = new FS.ErrnoError(44), MEMFS.doesNotExistError.stack = "<generic error, no stack>", ENVIRONMENT_IS_NODE && NODEFS.staticInit();
        var wasmImports = { __assert_fail: ___assert_fail, __call_sighandler: ___call_sighandler, __heap_base: ___heap_base, __indirect_function_table: wasmTable, __memory_base: ___memory_base, __stack_pointer: ___stack_pointer, __syscall__newselect: ___syscall__newselect, __syscall_bind: ___syscall_bind, __syscall_chdir: ___syscall_chdir, __syscall_chmod: ___syscall_chmod, __syscall_dup: ___syscall_dup, __syscall_dup3: ___syscall_dup3, __syscall_faccessat: ___syscall_faccessat, __syscall_fadvise64: ___syscall_fadvise64, __syscall_fallocate: ___syscall_fallocate, __syscall_fcntl64: ___syscall_fcntl64, __syscall_fdatasync: ___syscall_fdatasync, __syscall_fstat64: ___syscall_fstat64, __syscall_ftruncate64: ___syscall_ftruncate64, __syscall_getcwd: ___syscall_getcwd, __syscall_getdents64: ___syscall_getdents64, __syscall_ioctl: ___syscall_ioctl, __syscall_lstat64: ___syscall_lstat64, __syscall_mkdirat: ___syscall_mkdirat, __syscall_newfstatat: ___syscall_newfstatat, __syscall_openat: ___syscall_openat, __syscall_pipe: ___syscall_pipe, __syscall_readlinkat: ___syscall_readlinkat, __syscall_recvfrom: ___syscall_recvfrom, __syscall_renameat: ___syscall_renameat, __syscall_rmdir: ___syscall_rmdir, __syscall_sendto: ___syscall_sendto, __syscall_socket: ___syscall_socket, __syscall_stat64: ___syscall_stat64, __syscall_symlinkat: ___syscall_symlinkat, __syscall_truncate64: ___syscall_truncate64, __syscall_unlinkat: ___syscall_unlinkat, __table_base: ___table_base, _abort_js: __abort_js, _dlopen_js: __dlopen_js, _dlsym_js: __dlsym_js, _emscripten_memcpy_js: __emscripten_memcpy_js, _emscripten_runtime_keepalive_clear: __emscripten_runtime_keepalive_clear, _emscripten_system: __emscripten_system, _emscripten_throw_longjmp: __emscripten_throw_longjmp, _gmtime_js: __gmtime_js, _localtime_js: __localtime_js, _mmap_js: __mmap_js, _munmap_js: __munmap_js, _setitimer_js: __setitimer_js, _tzset_js: __tzset_js, clock_time_get: _clock_time_get, emscripten_asm_const_int: _emscripten_asm_const_int, emscripten_date_now: _emscripten_date_now, emscripten_force_exit: _emscripten_force_exit, emscripten_get_now: _emscripten_get_now, emscripten_resize_heap: _emscripten_resize_heap, environ_get: _environ_get, environ_sizes_get: _environ_sizes_get, exit: _exit, fd_close: _fd_close, fd_fdstat_get: _fd_fdstat_get, fd_pread: _fd_pread, fd_pwrite: _fd_pwrite, fd_read: _fd_read, fd_seek: _fd_seek, fd_sync: _fd_sync, fd_write: _fd_write, getTempRet0: _getTempRet0, getaddrinfo: _getaddrinfo, getnameinfo: _getnameinfo, invoke_di, invoke_i, invoke_id, invoke_ii, invoke_iii, invoke_iiii, invoke_iiiii, invoke_iiiiii, invoke_iiiiiii, invoke_iiiiiiii, invoke_iiiiiiiii, invoke_iiiiiiiiii, invoke_iiiiiiiiiii, invoke_iiiiiiiiiiiiii, invoke_iiiiiiiiiiiiiiiiii, invoke_iiiiiji, invoke_iiiij, invoke_iiiijii, invoke_iiij, invoke_iiji, invoke_ij, invoke_ijiiiii, invoke_ijiiiiii, invoke_j, invoke_ji, invoke_jii, invoke_jiiii, invoke_jiiiiii, invoke_jiiiiiiiii, invoke_v, invoke_vi, invoke_vid, invoke_vii, invoke_viii, invoke_viiii, invoke_viiiii, invoke_viiiiii, invoke_viiiiiii, invoke_viiiiiiii, invoke_viiiiiiiii, invoke_viiiiiiiiiiii, invoke_viiiji, invoke_viij, invoke_viiji, invoke_viijii, invoke_viijiiii, invoke_vij, invoke_viji, invoke_vijiji, invoke_vj, invoke_vji, memory: wasmMemory, proc_exit: _proc_exit, setTempRet0: _setTempRet0 }, wasmExports;
        createWasm();
        var ___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports.__wasm_call_ctors)(), _fopen = Module._fopen = (e, t2) => (_fopen = Module._fopen = wasmExports.fopen)(e, t2), _fflush = Module._fflush = (e) => (_fflush = Module._fflush = wasmExports.fflush)(e), ___errno_location = Module.___errno_location = () => (___errno_location = Module.___errno_location = wasmExports.__errno_location)(), _ProcessInterrupts = Module._ProcessInterrupts = () => (_ProcessInterrupts = Module._ProcessInterrupts = wasmExports.ProcessInterrupts)(), _errstart_cold = Module._errstart_cold = (e, t2) => (_errstart_cold = Module._errstart_cold = wasmExports.errstart_cold)(e, t2), _errcode = Module._errcode = (e) => (_errcode = Module._errcode = wasmExports.errcode)(e), _errmsg = Module._errmsg = (e, t2) => (_errmsg = Module._errmsg = wasmExports.errmsg)(e, t2), _errfinish = Module._errfinish = (e, t2, r) => (_errfinish = Module._errfinish = wasmExports.errfinish)(e, t2, r), _puts = Module._puts = (e) => (_puts = Module._puts = wasmExports.puts)(e), _errstart = Module._errstart = (e, t2) => (_errstart = Module._errstart = wasmExports.errstart)(e, t2), _errmsg_internal = Module._errmsg_internal = (e, t2) => (_errmsg_internal = Module._errmsg_internal = wasmExports.errmsg_internal)(e, t2), _errdetail = Module._errdetail = (e, t2) => (_errdetail = Module._errdetail = wasmExports.errdetail)(e, t2), _errhint = Module._errhint = (e, t2) => (_errhint = Module._errhint = wasmExports.errhint)(e, t2), _pg_parse_query = Module._pg_parse_query = (e) => (_pg_parse_query = Module._pg_parse_query = wasmExports.pg_parse_query)(e), _gettimeofday = Module._gettimeofday = (e, t2) => (_gettimeofday = Module._gettimeofday = wasmExports.gettimeofday)(e, t2), _raw_parser = Module._raw_parser = (e, t2) => (_raw_parser = Module._raw_parser = wasmExports.raw_parser)(e, t2), _initStringInfo = Module._initStringInfo = (e) => (_initStringInfo = Module._initStringInfo = wasmExports.initStringInfo)(e), _appendStringInfoString = Module._appendStringInfoString = (e, t2) => (_appendStringInfoString = Module._appendStringInfoString = wasmExports.appendStringInfoString)(e, t2), _appendStringInfo = Module._appendStringInfo = (e, t2, r) => (_appendStringInfo = Module._appendStringInfo = wasmExports.appendStringInfo)(e, t2, r), _errdetail_internal = Module._errdetail_internal = (e, t2) => (_errdetail_internal = Module._errdetail_internal = wasmExports.errdetail_internal)(e, t2), _pfree = Module._pfree = (e) => (_pfree = Module._pfree = wasmExports.pfree)(e), _list_make1_impl = Module._list_make1_impl = (e, t2) => (_list_make1_impl = Module._list_make1_impl = wasmExports.list_make1_impl)(e, t2), _QueryRewrite = Module._QueryRewrite = (e) => (_QueryRewrite = Module._QueryRewrite = wasmExports.QueryRewrite)(e), _pg_plan_query = Module._pg_plan_query = (e, t2, r, a2) => (_pg_plan_query = Module._pg_plan_query = wasmExports.pg_plan_query)(e, t2, r, a2), _palloc0 = Module._palloc0 = (e) => (_palloc0 = Module._palloc0 = wasmExports.palloc0)(e), _lappend = Module._lappend = (e, t2) => (_lappend = Module._lappend = wasmExports.lappend)(e, t2), _GetCurrentTimestamp = Module._GetCurrentTimestamp = () => (_GetCurrentTimestamp = Module._GetCurrentTimestamp = wasmExports.GetCurrentTimestamp)(), _pg_prng_double = Module._pg_prng_double = (e) => (_pg_prng_double = Module._pg_prng_double = wasmExports.pg_prng_double)(e), _pg_snprintf = Module._pg_snprintf = (e, t2, r, a2) => (_pg_snprintf = Module._pg_snprintf = wasmExports.pg_snprintf)(e, t2, r, a2), _die = Module._die = (e) => (_die = Module._die = wasmExports.die)(e), _check_stack_depth = Module._check_stack_depth = () => (_check_stack_depth = Module._check_stack_depth = wasmExports.check_stack_depth)(), _pre_format_elog_string = Module._pre_format_elog_string = (e, t2) => (_pre_format_elog_string = Module._pre_format_elog_string = wasmExports.pre_format_elog_string)(e, t2), _format_elog_string = Module._format_elog_string = (e, t2) => (_format_elog_string = Module._format_elog_string = wasmExports.format_elog_string)(e, t2), _pstrdup = Module._pstrdup = (e) => (_pstrdup = Module._pstrdup = wasmExports.pstrdup)(e), _SplitIdentifierString = Module._SplitIdentifierString = (e, t2, r) => (_SplitIdentifierString = Module._SplitIdentifierString = wasmExports.SplitIdentifierString)(e, t2, r), _list_free = Module._list_free = (e) => (_list_free = Module._list_free = wasmExports.list_free)(e), _pg_strcasecmp = Module._pg_strcasecmp = (e, t2) => (_pg_strcasecmp = Module._pg_strcasecmp = wasmExports.pg_strcasecmp)(e, t2), _guc_malloc = Module._guc_malloc = (e, t2) => (_guc_malloc = Module._guc_malloc = wasmExports.guc_malloc)(e, t2), _SetConfigOption = Module._SetConfigOption = (e, t2, r, a2) => (_SetConfigOption = Module._SetConfigOption = wasmExports.SetConfigOption)(e, t2, r, a2), _pg_sprintf = Module._pg_sprintf = (e, t2, r) => (_pg_sprintf = Module._pg_sprintf = wasmExports.pg_sprintf)(e, t2, r), _strcmp = Module._strcmp = (e, t2) => (_strcmp = Module._strcmp = wasmExports.strcmp)(e, t2), _strdup = Module._strdup = (e) => (_strdup = Module._strdup = wasmExports.strdup)(e), _atoi = Module._atoi = (e) => (_atoi = Module._atoi = wasmExports.atoi)(e), _strlcpy = Module._strlcpy = (e, t2, r) => (_strlcpy = Module._strlcpy = wasmExports.strlcpy)(e, t2, r), _pgl_shutdown = Module._pgl_shutdown = () => (_pgl_shutdown = Module._pgl_shutdown = wasmExports.pgl_shutdown)(), _pgl_closed = Module._pgl_closed = () => (_pgl_closed = Module._pgl_closed = wasmExports.pgl_closed)(), _MemoryContextReset = Module._MemoryContextReset = (e) => (_MemoryContextReset = Module._MemoryContextReset = wasmExports.MemoryContextReset)(e), _resetStringInfo = Module._resetStringInfo = (e) => (_resetStringInfo = Module._resetStringInfo = wasmExports.resetStringInfo)(e), _getc = Module._getc = (e) => (_getc = Module._getc = wasmExports.getc)(e), _appendStringInfoChar = Module._appendStringInfoChar = (e, t2) => (_appendStringInfoChar = Module._appendStringInfoChar = wasmExports.appendStringInfoChar)(e, t2), _strlen = Module._strlen = (e) => (_strlen = Module._strlen = wasmExports.strlen)(e), _strncmp = Module._strncmp = (e, t2, r) => (_strncmp = Module._strncmp = wasmExports.strncmp)(e, t2, r), _pg_fprintf = Module._pg_fprintf = (e, t2, r) => (_pg_fprintf = Module._pg_fprintf = wasmExports.pg_fprintf)(e, t2, r), _pgstat_report_activity = Module._pgstat_report_activity = (e, t2) => (_pgstat_report_activity = Module._pgstat_report_activity = wasmExports.pgstat_report_activity)(e, t2), _errhidestmt = Module._errhidestmt = (e) => (_errhidestmt = Module._errhidestmt = wasmExports.errhidestmt)(e), _GetTransactionSnapshot = Module._GetTransactionSnapshot = () => (_GetTransactionSnapshot = Module._GetTransactionSnapshot = wasmExports.GetTransactionSnapshot)(), _PushActiveSnapshot = Module._PushActiveSnapshot = (e) => (_PushActiveSnapshot = Module._PushActiveSnapshot = wasmExports.PushActiveSnapshot)(e), _AllocSetContextCreateInternal = Module._AllocSetContextCreateInternal = (e, t2, r, a2, o4) => (_AllocSetContextCreateInternal = Module._AllocSetContextCreateInternal = wasmExports.AllocSetContextCreateInternal)(e, t2, r, a2, o4), _PopActiveSnapshot = Module._PopActiveSnapshot = () => (_PopActiveSnapshot = Module._PopActiveSnapshot = wasmExports.PopActiveSnapshot)(), _CreateDestReceiver = Module._CreateDestReceiver = (e) => (_CreateDestReceiver = Module._CreateDestReceiver = wasmExports.CreateDestReceiver)(e), _CommitTransactionCommand = Module._CommitTransactionCommand = () => (_CommitTransactionCommand = Module._CommitTransactionCommand = wasmExports.CommitTransactionCommand)(), _CommandCounterIncrement = Module._CommandCounterIncrement = () => (_CommandCounterIncrement = Module._CommandCounterIncrement = wasmExports.CommandCounterIncrement)(), _MemoryContextDelete = Module._MemoryContextDelete = (e) => (_MemoryContextDelete = Module._MemoryContextDelete = wasmExports.MemoryContextDelete)(e), _StartTransactionCommand = Module._StartTransactionCommand = () => (_StartTransactionCommand = Module._StartTransactionCommand = wasmExports.StartTransactionCommand)(), ___wasm_setjmp_test = Module.___wasm_setjmp_test = (e, t2) => (___wasm_setjmp_test = Module.___wasm_setjmp_test = wasmExports.__wasm_setjmp_test)(e, t2), _pg_printf = Module._pg_printf = (e, t2) => (_pg_printf = Module._pg_printf = wasmExports.pg_printf)(e, t2), ___wasm_setjmp = Module.___wasm_setjmp = (e, t2, r) => (___wasm_setjmp = Module.___wasm_setjmp = wasmExports.__wasm_setjmp)(e, t2, r), _FlushErrorState = Module._FlushErrorState = () => (_FlushErrorState = Module._FlushErrorState = wasmExports.FlushErrorState)(), _emscripten_longjmp = Module._emscripten_longjmp = (e, t2) => (_emscripten_longjmp = Module._emscripten_longjmp = wasmExports.emscripten_longjmp)(e, t2), _enlargeStringInfo = Module._enlargeStringInfo = (e, t2) => (_enlargeStringInfo = Module._enlargeStringInfo = wasmExports.enlargeStringInfo)(e, t2), _strtoint = Module._strtoint = (e, t2, r) => (_strtoint = Module._strtoint = wasmExports.strtoint)(e, t2, r), _malloc = Module._malloc = (e) => (_malloc = Module._malloc = wasmExports.malloc)(e), _realloc = Module._realloc = (e, t2) => (_realloc = Module._realloc = wasmExports.realloc)(e, t2), _getenv = Module._getenv = (e) => (_getenv = Module._getenv = wasmExports.getenv)(e), _strspn = Module._strspn = (e, t2) => (_strspn = Module._strspn = wasmExports.strspn)(e, t2), _memcpy = Module._memcpy = (e, t2, r) => (_memcpy = Module._memcpy = wasmExports.memcpy)(e, t2, r), _fileno = Module._fileno = (e) => (_fileno = Module._fileno = wasmExports.fileno)(e), _strchr = Module._strchr = (e, t2) => (_strchr = Module._strchr = wasmExports.strchr)(e, t2), _free = Module._free = (e) => (_free = Module._free = wasmExports.free)(e), _pg_vsnprintf = Module._pg_vsnprintf = (e, t2, r, a2) => (_pg_vsnprintf = Module._pg_vsnprintf = wasmExports.pg_vsnprintf)(e, t2, r, a2), _strcpy = Module._strcpy = (e, t2) => (_strcpy = Module._strcpy = wasmExports.strcpy)(e, t2), _psprintf = Module._psprintf = (e, t2) => (_psprintf = Module._psprintf = wasmExports.psprintf)(e, t2), _stat = Module._stat = (e, t2) => (_stat = Module._stat = wasmExports.stat)(e, t2), _fwrite = Module._fwrite = (e, t2, r, a2) => (_fwrite = Module._fwrite = wasmExports.fwrite)(e, t2, r, a2), _strftime = Module._strftime = (e, t2, r, a2) => (_strftime = Module._strftime = wasmExports.strftime)(e, t2, r, a2), _strstr = Module._strstr = (e, t2) => (_strstr = Module._strstr = wasmExports.strstr)(e, t2), _atexit = Module._atexit = (e) => (_atexit = Module._atexit = wasmExports.atexit)(e), _strtol = Module._strtol = (e, t2, r) => (_strtol = Module._strtol = wasmExports.strtol)(e, t2, r), _ferror = Module._ferror = (e) => (_ferror = Module._ferror = wasmExports.ferror)(e), _clear_error = Module._clear_error = () => (_clear_error = Module._clear_error = wasmExports.clear_error)(), _interactive_one = Module._interactive_one = (e, t2) => (_interactive_one = Module._interactive_one = wasmExports.interactive_one)(e, t2), _pq_getmsgint = Module._pq_getmsgint = (e, t2) => (_pq_getmsgint = Module._pq_getmsgint = wasmExports.pq_getmsgint)(e, t2), _palloc = Module._palloc = (e) => (_palloc = Module._palloc = wasmExports.palloc)(e), _makeParamList = Module._makeParamList = (e) => (_makeParamList = Module._makeParamList = wasmExports.makeParamList)(e), _getTypeInputInfo = Module._getTypeInputInfo = (e, t2, r) => (_getTypeInputInfo = Module._getTypeInputInfo = wasmExports.getTypeInputInfo)(e, t2, r), _pnstrdup = Module._pnstrdup = (e, t2) => (_pnstrdup = Module._pnstrdup = wasmExports.pnstrdup)(e, t2), _MemoryContextSetParent = Module._MemoryContextSetParent = (e, t2) => (_MemoryContextSetParent = Module._MemoryContextSetParent = wasmExports.MemoryContextSetParent)(e, t2), _pgl_backend = Module._pgl_backend = () => (_pgl_backend = Module._pgl_backend = wasmExports.pgl_backend)(), _pgl_initdb = Module._pgl_initdb = () => (_pgl_initdb = Module._pgl_initdb = wasmExports.pgl_initdb)(), _main = Module._main = (e, t2) => (_main = Module._main = wasmExports.__main_argc_argv)(e, t2), _appendStringInfoStringQuoted = Module._appendStringInfoStringQuoted = (e, t2, r) => (_appendStringInfoStringQuoted = Module._appendStringInfoStringQuoted = wasmExports.appendStringInfoStringQuoted)(e, t2, r), _set_errcontext_domain = Module._set_errcontext_domain = (e) => (_set_errcontext_domain = Module._set_errcontext_domain = wasmExports.set_errcontext_domain)(e), _errcontext_msg = Module._errcontext_msg = (e, t2) => (_errcontext_msg = Module._errcontext_msg = wasmExports.errcontext_msg)(e, t2), _pg_is_ascii = Module._pg_is_ascii = (e) => (_pg_is_ascii = Module._pg_is_ascii = wasmExports.pg_is_ascii)(e), _memchr = Module._memchr = (e, t2, r) => (_memchr = Module._memchr = wasmExports.memchr)(e, t2, r), _pg_strncasecmp = Module._pg_strncasecmp = (e, t2, r) => (_pg_strncasecmp = Module._pg_strncasecmp = wasmExports.pg_strncasecmp)(e, t2, r), _strrchr = Module._strrchr = (e, t2) => (_strrchr = Module._strrchr = wasmExports.strrchr)(e, t2), _xsltFreeStylesheet = Module._xsltFreeStylesheet = (e) => (_xsltFreeStylesheet = Module._xsltFreeStylesheet = wasmExports.xsltFreeStylesheet)(e), _xsltParseStylesheetDoc = Module._xsltParseStylesheetDoc = (e) => (_xsltParseStylesheetDoc = Module._xsltParseStylesheetDoc = wasmExports.xsltParseStylesheetDoc)(e), _xsltSaveResultToString = Module._xsltSaveResultToString = (e, t2, r, a2) => (_xsltSaveResultToString = Module._xsltSaveResultToString = wasmExports.xsltSaveResultToString)(e, t2, r, a2), _xsltCleanupGlobals = Module._xsltCleanupGlobals = () => (_xsltCleanupGlobals = Module._xsltCleanupGlobals = wasmExports.xsltCleanupGlobals)(), _xsltNewTransformContext = Module._xsltNewTransformContext = (e, t2) => (_xsltNewTransformContext = Module._xsltNewTransformContext = wasmExports.xsltNewTransformContext)(e, t2), _xsltFreeTransformContext = Module._xsltFreeTransformContext = (e) => (_xsltFreeTransformContext = Module._xsltFreeTransformContext = wasmExports.xsltFreeTransformContext)(e), _xsltApplyStylesheetUser = Module._xsltApplyStylesheetUser = (e, t2, r, a2, o4, s4) => (_xsltApplyStylesheetUser = Module._xsltApplyStylesheetUser = wasmExports.xsltApplyStylesheetUser)(e, t2, r, a2, o4, s4), _xsltNewSecurityPrefs = Module._xsltNewSecurityPrefs = () => (_xsltNewSecurityPrefs = Module._xsltNewSecurityPrefs = wasmExports.xsltNewSecurityPrefs)(), _xsltFreeSecurityPrefs = Module._xsltFreeSecurityPrefs = (e) => (_xsltFreeSecurityPrefs = Module._xsltFreeSecurityPrefs = wasmExports.xsltFreeSecurityPrefs)(e), _xsltSetSecurityPrefs = Module._xsltSetSecurityPrefs = (e, t2, r) => (_xsltSetSecurityPrefs = Module._xsltSetSecurityPrefs = wasmExports.xsltSetSecurityPrefs)(e, t2, r), _xsltSetCtxtSecurityPrefs = Module._xsltSetCtxtSecurityPrefs = (e, t2) => (_xsltSetCtxtSecurityPrefs = Module._xsltSetCtxtSecurityPrefs = wasmExports.xsltSetCtxtSecurityPrefs)(e, t2), _xsltSecurityForbid = Module._xsltSecurityForbid = (e, t2, r) => (_xsltSecurityForbid = Module._xsltSecurityForbid = wasmExports.xsltSecurityForbid)(e, t2, r), _replace_percent_placeholders = Module._replace_percent_placeholders = (e, t2, r, a2) => (_replace_percent_placeholders = Module._replace_percent_placeholders = wasmExports.replace_percent_placeholders)(e, t2, r, a2), _memset = Module._memset = (e, t2, r) => (_memset = Module._memset = wasmExports.memset)(e, t2, r), _MemoryContextAllocZero = Module._MemoryContextAllocZero = (e, t2) => (_MemoryContextAllocZero = Module._MemoryContextAllocZero = wasmExports.MemoryContextAllocZero)(e, t2), _MemoryContextAllocExtended = Module._MemoryContextAllocExtended = (e, t2, r) => (_MemoryContextAllocExtended = Module._MemoryContextAllocExtended = wasmExports.MemoryContextAllocExtended)(e, t2, r), _hash_bytes = Module._hash_bytes = (e, t2) => (_hash_bytes = Module._hash_bytes = wasmExports.hash_bytes)(e, t2), _memcmp = Module._memcmp = (e, t2, r) => (_memcmp = Module._memcmp = wasmExports.memcmp)(e, t2, r), _repalloc = Module._repalloc = (e, t2) => (_repalloc = Module._repalloc = wasmExports.repalloc)(e, t2), _pg_qsort = Module._pg_qsort = (e, t2, r, a2) => (_pg_qsort = Module._pg_qsort = wasmExports.pg_qsort)(e, t2, r, a2), _OpenTransientFile = Module._OpenTransientFile = (e, t2) => (_OpenTransientFile = Module._OpenTransientFile = wasmExports.OpenTransientFile)(e, t2), _errcode_for_file_access = Module._errcode_for_file_access = () => (_errcode_for_file_access = Module._errcode_for_file_access = wasmExports.errcode_for_file_access)(), _read = Module._read = (e, t2, r) => (_read = Module._read = wasmExports.read)(e, t2, r), _CloseTransientFile = Module._CloseTransientFile = (e) => (_CloseTransientFile = Module._CloseTransientFile = wasmExports.CloseTransientFile)(e), _time = Module._time = (e) => (_time = Module._time = wasmExports.time)(e), _close = Module._close = (e) => (_close = Module._close = wasmExports.close)(e), ___multi3 = Module.___multi3 = (e, t2, r, a2, o4) => (___multi3 = Module.___multi3 = wasmExports.__multi3)(e, t2, r, a2, o4), _isalnum = Module._isalnum = (e) => (_isalnum = Module._isalnum = wasmExports.isalnum)(e), _realpath = Module._realpath = (e, t2) => (_realpath = Module._realpath = wasmExports.realpath)(e, t2), _wait_result_to_str = Module._wait_result_to_str = (e) => (_wait_result_to_str = Module._wait_result_to_str = wasmExports.wait_result_to_str)(e), _float_to_shortest_decimal_bufn = Module._float_to_shortest_decimal_bufn = (e, t2) => (_float_to_shortest_decimal_bufn = Module._float_to_shortest_decimal_bufn = wasmExports.float_to_shortest_decimal_bufn)(e, t2), _float_to_shortest_decimal_buf = Module._float_to_shortest_decimal_buf = (e, t2) => (_float_to_shortest_decimal_buf = Module._float_to_shortest_decimal_buf = wasmExports.float_to_shortest_decimal_buf)(e, t2), _memmove = Module._memmove = (e, t2, r) => (_memmove = Module._memmove = wasmExports.memmove)(e, t2, r), _pwrite = Module._pwrite = (e, t2, r, a2) => (_pwrite = Module._pwrite = wasmExports.pwrite)(e, t2, r, a2), _hash_bytes_extended = Module._hash_bytes_extended = (e, t2, r) => (_hash_bytes_extended = Module._hash_bytes_extended = wasmExports.hash_bytes_extended)(e, t2, r), _tag_hash = Module._tag_hash = (e, t2) => (_tag_hash = Module._tag_hash = wasmExports.tag_hash)(e, t2), _calloc = (e, t2) => (_calloc = wasmExports.calloc)(e, t2), _IsValidJsonNumber = Module._IsValidJsonNumber = (e, t2) => (_IsValidJsonNumber = Module._IsValidJsonNumber = wasmExports.IsValidJsonNumber)(e, t2), _appendBinaryStringInfo = Module._appendBinaryStringInfo = (e, t2, r) => (_appendBinaryStringInfo = Module._appendBinaryStringInfo = wasmExports.appendBinaryStringInfo)(e, t2, r), _makeStringInfo = Module._makeStringInfo = () => (_makeStringInfo = Module._makeStringInfo = wasmExports.makeStringInfo)(), _GetDatabaseEncodingName = Module._GetDatabaseEncodingName = () => (_GetDatabaseEncodingName = Module._GetDatabaseEncodingName = wasmExports.GetDatabaseEncodingName)(), _ScanKeywordLookup = Module._ScanKeywordLookup = (e, t2) => (_ScanKeywordLookup = Module._ScanKeywordLookup = wasmExports.ScanKeywordLookup)(e, t2), _strtoul = Module._strtoul = (e, t2, r) => (_strtoul = Module._strtoul = wasmExports.strtoul)(e, t2, r), _sscanf = Module._sscanf = (e, t2, r) => (_sscanf = Module._sscanf = wasmExports.sscanf)(e, t2, r), _strtoll = Module._strtoll = (e, t2, r) => (_strtoll = Module._strtoll = wasmExports.strtoll)(e, t2, r), _strtoull = Module._strtoull = (e, t2, r) => (_strtoull = Module._strtoull = wasmExports.strtoull)(e, t2, r), _pg_prng_uint64 = Module._pg_prng_uint64 = (e) => (_pg_prng_uint64 = Module._pg_prng_uint64 = wasmExports.pg_prng_uint64)(e), _pg_prng_uint32 = Module._pg_prng_uint32 = (e) => (_pg_prng_uint32 = Module._pg_prng_uint32 = wasmExports.pg_prng_uint32)(e), _log = Module._log = (e) => (_log = Module._log = wasmExports.log)(e), _sin = Module._sin = (e) => (_sin = Module._sin = wasmExports.sin)(e), _readdir = Module._readdir = (e) => (_readdir = Module._readdir = wasmExports.readdir)(e), _forkname_to_number = Module._forkname_to_number = (e) => (_forkname_to_number = Module._forkname_to_number = wasmExports.forkname_to_number)(e), _unlink = Module._unlink = (e) => (_unlink = Module._unlink = wasmExports.unlink)(e), _pg_utf_mblen_private = Module._pg_utf_mblen_private = (e) => (_pg_utf_mblen_private = Module._pg_utf_mblen_private = wasmExports.pg_utf_mblen_private)(e), _bsearch = Module._bsearch = (e, t2, r, a2, o4) => (_bsearch = Module._bsearch = wasmExports.bsearch)(e, t2, r, a2, o4), _palloc_extended = Module._palloc_extended = (e, t2) => (_palloc_extended = Module._palloc_extended = wasmExports.palloc_extended)(e, t2), _appendStringInfoSpaces = Module._appendStringInfoSpaces = (e, t2) => (_appendStringInfoSpaces = Module._appendStringInfoSpaces = wasmExports.appendStringInfoSpaces)(e, t2), _geteuid = Module._geteuid = () => (_geteuid = Module._geteuid = wasmExports.geteuid)(), _fcntl = Module._fcntl = (e, t2, r) => (_fcntl = Module._fcntl = wasmExports.fcntl)(e, t2, r), _pg_popcount_optimized = Module._pg_popcount_optimized = (e, t2) => (_pg_popcount_optimized = Module._pg_popcount_optimized = wasmExports.pg_popcount_optimized)(e, t2), _pg_strong_random = Module._pg_strong_random = (e, t2) => (_pg_strong_random = Module._pg_strong_random = wasmExports.pg_strong_random)(e, t2), _open = Module._open = (e, t2, r) => (_open = Module._open = wasmExports.open)(e, t2, r), _pg_usleep = Module._pg_usleep = (e) => (_pg_usleep = Module._pg_usleep = wasmExports.pg_usleep)(e), _nanosleep = Module._nanosleep = (e, t2) => (_nanosleep = Module._nanosleep = wasmExports.nanosleep)(e, t2), _pg_toupper = Module._pg_toupper = (e) => (_pg_toupper = Module._pg_toupper = wasmExports.pg_toupper)(e), _pg_tolower = Module._pg_tolower = (e) => (_pg_tolower = Module._pg_tolower = wasmExports.pg_tolower)(e), _getpid = Module._getpid = () => (_getpid = Module._getpid = wasmExports.getpid)(), _qsort_arg = Module._qsort_arg = (e, t2, r, a2, o4) => (_qsort_arg = Module._qsort_arg = wasmExports.qsort_arg)(e, t2, r, a2, o4), _strerror = Module._strerror = (e) => (_strerror = Module._strerror = wasmExports.strerror)(e), _RelationGetNumberOfBlocksInFork = Module._RelationGetNumberOfBlocksInFork = (e, t2) => (_RelationGetNumberOfBlocksInFork = Module._RelationGetNumberOfBlocksInFork = wasmExports.RelationGetNumberOfBlocksInFork)(e, t2), _ExtendBufferedRel = Module._ExtendBufferedRel = (e, t2, r, a2) => (_ExtendBufferedRel = Module._ExtendBufferedRel = wasmExports.ExtendBufferedRel)(e, t2, r, a2), _MarkBufferDirty = Module._MarkBufferDirty = (e) => (_MarkBufferDirty = Module._MarkBufferDirty = wasmExports.MarkBufferDirty)(e), _XLogBeginInsert = Module._XLogBeginInsert = () => (_XLogBeginInsert = Module._XLogBeginInsert = wasmExports.XLogBeginInsert)(), _XLogRegisterData = Module._XLogRegisterData = (e, t2) => (_XLogRegisterData = Module._XLogRegisterData = wasmExports.XLogRegisterData)(e, t2), _XLogInsert = Module._XLogInsert = (e, t2) => (_XLogInsert = Module._XLogInsert = wasmExports.XLogInsert)(e, t2), _UnlockReleaseBuffer = Module._UnlockReleaseBuffer = (e) => (_UnlockReleaseBuffer = Module._UnlockReleaseBuffer = wasmExports.UnlockReleaseBuffer)(e), _brin_build_desc = Module._brin_build_desc = (e) => (_brin_build_desc = Module._brin_build_desc = wasmExports.brin_build_desc)(e), _EnterParallelMode = Module._EnterParallelMode = () => (_EnterParallelMode = Module._EnterParallelMode = wasmExports.EnterParallelMode)(), _CreateParallelContext = Module._CreateParallelContext = (e, t2, r) => (_CreateParallelContext = Module._CreateParallelContext = wasmExports.CreateParallelContext)(e, t2, r), _RegisterSnapshot = Module._RegisterSnapshot = (e) => (_RegisterSnapshot = Module._RegisterSnapshot = wasmExports.RegisterSnapshot)(e), _table_parallelscan_estimate = Module._table_parallelscan_estimate = (e, t2) => (_table_parallelscan_estimate = Module._table_parallelscan_estimate = wasmExports.table_parallelscan_estimate)(e, t2), _add_size = Module._add_size = (e, t2) => (_add_size = Module._add_size = wasmExports.add_size)(e, t2), _tuplesort_estimate_shared = Module._tuplesort_estimate_shared = (e) => (_tuplesort_estimate_shared = Module._tuplesort_estimate_shared = wasmExports.tuplesort_estimate_shared)(e), _InitializeParallelDSM = Module._InitializeParallelDSM = (e) => (_InitializeParallelDSM = Module._InitializeParallelDSM = wasmExports.InitializeParallelDSM)(e), _UnregisterSnapshot = Module._UnregisterSnapshot = (e) => (_UnregisterSnapshot = Module._UnregisterSnapshot = wasmExports.UnregisterSnapshot)(e), _DestroyParallelContext = Module._DestroyParallelContext = (e) => (_DestroyParallelContext = Module._DestroyParallelContext = wasmExports.DestroyParallelContext)(e), _ExitParallelMode = Module._ExitParallelMode = () => (_ExitParallelMode = Module._ExitParallelMode = wasmExports.ExitParallelMode)(), _shm_toc_allocate = Module._shm_toc_allocate = (e, t2) => (_shm_toc_allocate = Module._shm_toc_allocate = wasmExports.shm_toc_allocate)(e, t2), _ConditionVariableInit = Module._ConditionVariableInit = (e) => (_ConditionVariableInit = Module._ConditionVariableInit = wasmExports.ConditionVariableInit)(e), _s_init_lock_sema = Module._s_init_lock_sema = (e, t2) => (_s_init_lock_sema = Module._s_init_lock_sema = wasmExports.s_init_lock_sema)(e, t2), _table_parallelscan_initialize = Module._table_parallelscan_initialize = (e, t2, r) => (_table_parallelscan_initialize = Module._table_parallelscan_initialize = wasmExports.table_parallelscan_initialize)(e, t2, r), _tuplesort_initialize_shared = Module._tuplesort_initialize_shared = (e, t2, r) => (_tuplesort_initialize_shared = Module._tuplesort_initialize_shared = wasmExports.tuplesort_initialize_shared)(e, t2, r), _shm_toc_insert = Module._shm_toc_insert = (e, t2, r) => (_shm_toc_insert = Module._shm_toc_insert = wasmExports.shm_toc_insert)(e, t2, r), _LaunchParallelWorkers = Module._LaunchParallelWorkers = (e) => (_LaunchParallelWorkers = Module._LaunchParallelWorkers = wasmExports.LaunchParallelWorkers)(e), _WaitForParallelWorkersToAttach = Module._WaitForParallelWorkersToAttach = (e) => (_WaitForParallelWorkersToAttach = Module._WaitForParallelWorkersToAttach = wasmExports.WaitForParallelWorkersToAttach)(e), _tas_sema = Module._tas_sema = (e) => (_tas_sema = Module._tas_sema = wasmExports.tas_sema)(e), _s_lock = Module._s_lock = (e, t2, r, a2) => (_s_lock = Module._s_lock = wasmExports.s_lock)(e, t2, r, a2), _s_unlock_sema = Module._s_unlock_sema = (e) => (_s_unlock_sema = Module._s_unlock_sema = wasmExports.s_unlock_sema)(e), _ConditionVariableSleep = Module._ConditionVariableSleep = (e, t2) => (_ConditionVariableSleep = Module._ConditionVariableSleep = wasmExports.ConditionVariableSleep)(e, t2), _ConditionVariableCancelSleep = Module._ConditionVariableCancelSleep = () => (_ConditionVariableCancelSleep = Module._ConditionVariableCancelSleep = wasmExports.ConditionVariableCancelSleep)(), _tuplesort_performsort = Module._tuplesort_performsort = (e) => (_tuplesort_performsort = Module._tuplesort_performsort = wasmExports.tuplesort_performsort)(e), _tuplesort_end = Module._tuplesort_end = (e) => (_tuplesort_end = Module._tuplesort_end = wasmExports.tuplesort_end)(e), _brin_deform_tuple = Module._brin_deform_tuple = (e, t2, r) => (_brin_deform_tuple = Module._brin_deform_tuple = wasmExports.brin_deform_tuple)(e, t2, r), _log_newpage_buffer = Module._log_newpage_buffer = (e, t2) => (_log_newpage_buffer = Module._log_newpage_buffer = wasmExports.log_newpage_buffer)(e, t2), _LockBuffer = Module._LockBuffer = (e, t2) => (_LockBuffer = Module._LockBuffer = wasmExports.LockBuffer)(e, t2), _ReleaseBuffer = Module._ReleaseBuffer = (e) => (_ReleaseBuffer = Module._ReleaseBuffer = wasmExports.ReleaseBuffer)(e), _IndexGetRelation = Module._IndexGetRelation = (e, t2) => (_IndexGetRelation = Module._IndexGetRelation = wasmExports.IndexGetRelation)(e, t2), _table_open = Module._table_open = (e, t2) => (_table_open = Module._table_open = wasmExports.table_open)(e, t2), _ReadBufferExtended = Module._ReadBufferExtended = (e, t2, r, a2, o4) => (_ReadBufferExtended = Module._ReadBufferExtended = wasmExports.ReadBufferExtended)(e, t2, r, a2, o4), _table_close = Module._table_close = (e, t2) => (_table_close = Module._table_close = wasmExports.table_close)(e, t2), _build_reloptions = Module._build_reloptions = (e, t2, r, a2, o4, s4) => (_build_reloptions = Module._build_reloptions = wasmExports.build_reloptions)(e, t2, r, a2, o4, s4), _RelationGetIndexScan = Module._RelationGetIndexScan = (e, t2, r) => (_RelationGetIndexScan = Module._RelationGetIndexScan = wasmExports.RelationGetIndexScan)(e, t2, r), _pgstat_assoc_relation = Module._pgstat_assoc_relation = (e) => (_pgstat_assoc_relation = Module._pgstat_assoc_relation = wasmExports.pgstat_assoc_relation)(e), _index_getprocinfo = Module._index_getprocinfo = (e, t2, r) => (_index_getprocinfo = Module._index_getprocinfo = wasmExports.index_getprocinfo)(e, t2, r), _fmgr_info_copy = Module._fmgr_info_copy = (e, t2, r) => (_fmgr_info_copy = Module._fmgr_info_copy = wasmExports.fmgr_info_copy)(e, t2, r), _FunctionCall4Coll = Module._FunctionCall4Coll = (e, t2, r, a2, o4, s4) => (_FunctionCall4Coll = Module._FunctionCall4Coll = wasmExports.FunctionCall4Coll)(e, t2, r, a2, o4, s4), _FunctionCall1Coll = Module._FunctionCall1Coll = (e, t2, r) => (_FunctionCall1Coll = Module._FunctionCall1Coll = wasmExports.FunctionCall1Coll)(e, t2, r), _brin_free_desc = Module._brin_free_desc = (e) => (_brin_free_desc = Module._brin_free_desc = wasmExports.brin_free_desc)(e), _WaitForParallelWorkersToFinish = Module._WaitForParallelWorkersToFinish = (e) => (_WaitForParallelWorkersToFinish = Module._WaitForParallelWorkersToFinish = wasmExports.WaitForParallelWorkersToFinish)(e), _PageGetFreeSpace = Module._PageGetFreeSpace = (e) => (_PageGetFreeSpace = Module._PageGetFreeSpace = wasmExports.PageGetFreeSpace)(e), _BufferGetBlockNumber = Module._BufferGetBlockNumber = (e) => (_BufferGetBlockNumber = Module._BufferGetBlockNumber = wasmExports.BufferGetBlockNumber)(e), _BuildIndexInfo = Module._BuildIndexInfo = (e) => (_BuildIndexInfo = Module._BuildIndexInfo = wasmExports.BuildIndexInfo)(e), _Int64GetDatum = Module._Int64GetDatum = (e) => (_Int64GetDatum = Module._Int64GetDatum = wasmExports.Int64GetDatum)(e), _DirectFunctionCall2Coll = Module._DirectFunctionCall2Coll = (e, t2, r, a2) => (_DirectFunctionCall2Coll = Module._DirectFunctionCall2Coll = wasmExports.DirectFunctionCall2Coll)(e, t2, r, a2), _RecoveryInProgress = Module._RecoveryInProgress = () => (_RecoveryInProgress = Module._RecoveryInProgress = wasmExports.RecoveryInProgress)(), _GetUserIdAndSecContext = Module._GetUserIdAndSecContext = (e, t2) => (_GetUserIdAndSecContext = Module._GetUserIdAndSecContext = wasmExports.GetUserIdAndSecContext)(e, t2), _SetUserIdAndSecContext = Module._SetUserIdAndSecContext = (e, t2) => (_SetUserIdAndSecContext = Module._SetUserIdAndSecContext = wasmExports.SetUserIdAndSecContext)(e, t2), _NewGUCNestLevel = Module._NewGUCNestLevel = () => (_NewGUCNestLevel = Module._NewGUCNestLevel = wasmExports.NewGUCNestLevel)(), _RestrictSearchPath = Module._RestrictSearchPath = () => (_RestrictSearchPath = Module._RestrictSearchPath = wasmExports.RestrictSearchPath)(), _index_open = Module._index_open = (e, t2) => (_index_open = Module._index_open = wasmExports.index_open)(e, t2), _object_ownercheck = Module._object_ownercheck = (e, t2, r) => (_object_ownercheck = Module._object_ownercheck = wasmExports.object_ownercheck)(e, t2, r), _aclcheck_error = Module._aclcheck_error = (e, t2, r) => (_aclcheck_error = Module._aclcheck_error = wasmExports.aclcheck_error)(e, t2, r), _AtEOXact_GUC = Module._AtEOXact_GUC = (e, t2) => (_AtEOXact_GUC = Module._AtEOXact_GUC = wasmExports.AtEOXact_GUC)(e, t2), _relation_close = Module._relation_close = (e, t2) => (_relation_close = Module._relation_close = wasmExports.relation_close)(e, t2), _GetUserId = Module._GetUserId = () => (_GetUserId = Module._GetUserId = wasmExports.GetUserId)(), _ReadBuffer = Module._ReadBuffer = (e, t2) => (_ReadBuffer = Module._ReadBuffer = wasmExports.ReadBuffer)(e, t2), _shm_toc_lookup = Module._shm_toc_lookup = (e, t2, r) => (_shm_toc_lookup = Module._shm_toc_lookup = wasmExports.shm_toc_lookup)(e, t2, r), _tuplesort_attach_shared = Module._tuplesort_attach_shared = (e, t2) => (_tuplesort_attach_shared = Module._tuplesort_attach_shared = wasmExports.tuplesort_attach_shared)(e, t2), _index_close = Module._index_close = (e, t2) => (_index_close = Module._index_close = wasmExports.index_close)(e, t2), _table_beginscan_parallel = Module._table_beginscan_parallel = (e, t2) => (_table_beginscan_parallel = Module._table_beginscan_parallel = wasmExports.table_beginscan_parallel)(e, t2), _ConditionVariableSignal = Module._ConditionVariableSignal = (e) => (_ConditionVariableSignal = Module._ConditionVariableSignal = wasmExports.ConditionVariableSignal)(e), _datumCopy = Module._datumCopy = (e, t2, r) => (_datumCopy = Module._datumCopy = wasmExports.datumCopy)(e, t2, r), _lookup_type_cache = Module._lookup_type_cache = (e, t2) => (_lookup_type_cache = Module._lookup_type_cache = wasmExports.lookup_type_cache)(e, t2), _get_fn_opclass_options = Module._get_fn_opclass_options = (e) => (_get_fn_opclass_options = Module._get_fn_opclass_options = wasmExports.get_fn_opclass_options)(e), _pg_detoast_datum = Module._pg_detoast_datum = (e) => (_pg_detoast_datum = Module._pg_detoast_datum = wasmExports.pg_detoast_datum)(e), _index_getprocid = Module._index_getprocid = (e, t2, r) => (_index_getprocid = Module._index_getprocid = wasmExports.index_getprocid)(e, t2, r), _init_local_reloptions = Module._init_local_reloptions = (e, t2) => (_init_local_reloptions = Module._init_local_reloptions = wasmExports.init_local_reloptions)(e, t2), _FunctionCall2Coll = Module._FunctionCall2Coll = (e, t2, r, a2) => (_FunctionCall2Coll = Module._FunctionCall2Coll = wasmExports.FunctionCall2Coll)(e, t2, r, a2), _SysCacheGetAttrNotNull = Module._SysCacheGetAttrNotNull = (e, t2, r) => (_SysCacheGetAttrNotNull = Module._SysCacheGetAttrNotNull = wasmExports.SysCacheGetAttrNotNull)(e, t2, r), _ReleaseSysCache = Module._ReleaseSysCache = (e) => (_ReleaseSysCache = Module._ReleaseSysCache = wasmExports.ReleaseSysCache)(e), _fmgr_info_cxt = Module._fmgr_info_cxt = (e, t2, r) => (_fmgr_info_cxt = Module._fmgr_info_cxt = wasmExports.fmgr_info_cxt)(e, t2, r), _Float8GetDatum = Module._Float8GetDatum = (e) => (_Float8GetDatum = Module._Float8GetDatum = wasmExports.Float8GetDatum)(e), _numeric_float8 = Module._numeric_float8 = (e) => (_numeric_float8 = Module._numeric_float8 = wasmExports.numeric_float8)(e), _numeric_sub = Module._numeric_sub = (e) => (_numeric_sub = Module._numeric_sub = wasmExports.numeric_sub)(e), _DirectFunctionCall1Coll = Module._DirectFunctionCall1Coll = (e, t2, r) => (_DirectFunctionCall1Coll = Module._DirectFunctionCall1Coll = wasmExports.DirectFunctionCall1Coll)(e, t2, r), _pg_detoast_datum_packed = Module._pg_detoast_datum_packed = (e) => (_pg_detoast_datum_packed = Module._pg_detoast_datum_packed = wasmExports.pg_detoast_datum_packed)(e), _add_local_int_reloption = Module._add_local_int_reloption = (e, t2, r, a2, o4, s4, _3) => (_add_local_int_reloption = Module._add_local_int_reloption = wasmExports.add_local_int_reloption)(e, t2, r, a2, o4, s4, _3), _getTypeOutputInfo = Module._getTypeOutputInfo = (e, t2, r) => (_getTypeOutputInfo = Module._getTypeOutputInfo = wasmExports.getTypeOutputInfo)(e, t2, r), _fmgr_info = Module._fmgr_info = (e, t2) => (_fmgr_info = Module._fmgr_info = wasmExports.fmgr_info)(e, t2), _OutputFunctionCall = Module._OutputFunctionCall = (e, t2) => (_OutputFunctionCall = Module._OutputFunctionCall = wasmExports.OutputFunctionCall)(e, t2), _cstring_to_text_with_len = Module._cstring_to_text_with_len = (e, t2) => (_cstring_to_text_with_len = Module._cstring_to_text_with_len = wasmExports.cstring_to_text_with_len)(e, t2), _accumArrayResult = Module._accumArrayResult = (e, t2, r, a2, o4) => (_accumArrayResult = Module._accumArrayResult = wasmExports.accumArrayResult)(e, t2, r, a2, o4), _makeArrayResult = Module._makeArrayResult = (e, t2) => (_makeArrayResult = Module._makeArrayResult = wasmExports.makeArrayResult)(e, t2), _OidOutputFunctionCall = Module._OidOutputFunctionCall = (e, t2) => (_OidOutputFunctionCall = Module._OidOutputFunctionCall = wasmExports.OidOutputFunctionCall)(e, t2), _cstring_to_text = Module._cstring_to_text = (e) => (_cstring_to_text = Module._cstring_to_text = wasmExports.cstring_to_text)(e), _PageGetExactFreeSpace = Module._PageGetExactFreeSpace = (e) => (_PageGetExactFreeSpace = Module._PageGetExactFreeSpace = wasmExports.PageGetExactFreeSpace)(e), _PageIndexTupleOverwrite = Module._PageIndexTupleOverwrite = (e, t2, r, a2) => (_PageIndexTupleOverwrite = Module._PageIndexTupleOverwrite = wasmExports.PageIndexTupleOverwrite)(e, t2, r, a2), _PageInit = Module._PageInit = (e, t2, r) => (_PageInit = Module._PageInit = wasmExports.PageInit)(e, t2, r), _PageAddItemExtended = Module._PageAddItemExtended = (e, t2, r, a2, o4) => (_PageAddItemExtended = Module._PageAddItemExtended = wasmExports.PageAddItemExtended)(e, t2, r, a2, o4), _LockRelationForExtension = Module._LockRelationForExtension = (e, t2) => (_LockRelationForExtension = Module._LockRelationForExtension = wasmExports.LockRelationForExtension)(e, t2), _UnlockRelationForExtension = Module._UnlockRelationForExtension = (e, t2) => (_UnlockRelationForExtension = Module._UnlockRelationForExtension = wasmExports.UnlockRelationForExtension)(e, t2), _smgropen = Module._smgropen = (e, t2) => (_smgropen = Module._smgropen = wasmExports.smgropen)(e, t2), _smgrpin = Module._smgrpin = (e) => (_smgrpin = Module._smgrpin = wasmExports.smgrpin)(e), _ItemPointerEquals = Module._ItemPointerEquals = (e, t2) => (_ItemPointerEquals = Module._ItemPointerEquals = wasmExports.ItemPointerEquals)(e, t2), _detoast_external_attr = Module._detoast_external_attr = (e) => (_detoast_external_attr = Module._detoast_external_attr = wasmExports.detoast_external_attr)(e), _CreateTemplateTupleDesc = Module._CreateTemplateTupleDesc = (e) => (_CreateTemplateTupleDesc = Module._CreateTemplateTupleDesc = wasmExports.CreateTemplateTupleDesc)(e), _TupleDescInitEntry = Module._TupleDescInitEntry = (e, t2, r, a2, o4, s4) => (_TupleDescInitEntry = Module._TupleDescInitEntry = wasmExports.TupleDescInitEntry)(e, t2, r, a2, o4, s4), _SearchSysCache1 = Module._SearchSysCache1 = (e, t2) => (_SearchSysCache1 = Module._SearchSysCache1 = wasmExports.SearchSysCache1)(e, t2), _SearchSysCacheList = Module._SearchSysCacheList = (e, t2, r, a2, o4) => (_SearchSysCacheList = Module._SearchSysCacheList = wasmExports.SearchSysCacheList)(e, t2, r, a2, o4), _check_amproc_signature = Module._check_amproc_signature = (e, t2, r, a2, o4, s4) => (_check_amproc_signature = Module._check_amproc_signature = wasmExports.check_amproc_signature)(e, t2, r, a2, o4, s4), _check_amoptsproc_signature = Module._check_amoptsproc_signature = (e) => (_check_amoptsproc_signature = Module._check_amoptsproc_signature = wasmExports.check_amoptsproc_signature)(e), _format_procedure = Module._format_procedure = (e) => (_format_procedure = Module._format_procedure = wasmExports.format_procedure)(e), _format_operator = Module._format_operator = (e) => (_format_operator = Module._format_operator = wasmExports.format_operator)(e), _check_amop_signature = Module._check_amop_signature = (e, t2, r, a2) => (_check_amop_signature = Module._check_amop_signature = wasmExports.check_amop_signature)(e, t2, r, a2), _identify_opfamily_groups = Module._identify_opfamily_groups = (e, t2) => (_identify_opfamily_groups = Module._identify_opfamily_groups = wasmExports.identify_opfamily_groups)(e, t2), _format_type_be = Module._format_type_be = (e) => (_format_type_be = Module._format_type_be = wasmExports.format_type_be)(e), _ReleaseCatCacheList = Module._ReleaseCatCacheList = (e) => (_ReleaseCatCacheList = Module._ReleaseCatCacheList = wasmExports.ReleaseCatCacheList)(e), _format_type_with_typemod = Module._format_type_with_typemod = (e, t2) => (_format_type_with_typemod = Module._format_type_with_typemod = wasmExports.format_type_with_typemod)(e, t2), _DatumGetEOHP = Module._DatumGetEOHP = (e) => (_DatumGetEOHP = Module._DatumGetEOHP = wasmExports.DatumGetEOHP)(e), _EOH_get_flat_size = Module._EOH_get_flat_size = (e) => (_EOH_get_flat_size = Module._EOH_get_flat_size = wasmExports.EOH_get_flat_size)(e), _EOH_flatten_into = Module._EOH_flatten_into = (e, t2, r) => (_EOH_flatten_into = Module._EOH_flatten_into = wasmExports.EOH_flatten_into)(e, t2, r), _getmissingattr = Module._getmissingattr = (e, t2, r) => (_getmissingattr = Module._getmissingattr = wasmExports.getmissingattr)(e, t2, r), _hash_create = Module._hash_create = (e, t2, r, a2) => (_hash_create = Module._hash_create = wasmExports.hash_create)(e, t2, r, a2), _hash_search = Module._hash_search = (e, t2, r, a2) => (_hash_search = Module._hash_search = wasmExports.hash_search)(e, t2, r, a2), _nocachegetattr = Module._nocachegetattr = (e, t2, r) => (_nocachegetattr = Module._nocachegetattr = wasmExports.nocachegetattr)(e, t2, r), _heap_getsysattr = Module._heap_getsysattr = (e, t2, r, a2) => (_heap_getsysattr = Module._heap_getsysattr = wasmExports.heap_getsysattr)(e, t2, r, a2), _heap_form_tuple = Module._heap_form_tuple = (e, t2, r) => (_heap_form_tuple = Module._heap_form_tuple = wasmExports.heap_form_tuple)(e, t2, r), _heap_modify_tuple = Module._heap_modify_tuple = (e, t2, r, a2, o4) => (_heap_modify_tuple = Module._heap_modify_tuple = wasmExports.heap_modify_tuple)(e, t2, r, a2, o4), _heap_deform_tuple = Module._heap_deform_tuple = (e, t2, r, a2) => (_heap_deform_tuple = Module._heap_deform_tuple = wasmExports.heap_deform_tuple)(e, t2, r, a2), _heap_modify_tuple_by_cols = Module._heap_modify_tuple_by_cols = (e, t2, r, a2, o4, s4) => (_heap_modify_tuple_by_cols = Module._heap_modify_tuple_by_cols = wasmExports.heap_modify_tuple_by_cols)(e, t2, r, a2, o4, s4), _heap_freetuple = Module._heap_freetuple = (e) => (_heap_freetuple = Module._heap_freetuple = wasmExports.heap_freetuple)(e), _index_form_tuple = Module._index_form_tuple = (e, t2, r) => (_index_form_tuple = Module._index_form_tuple = wasmExports.index_form_tuple)(e, t2, r), _nocache_index_getattr = Module._nocache_index_getattr = (e, t2, r) => (_nocache_index_getattr = Module._nocache_index_getattr = wasmExports.nocache_index_getattr)(e, t2, r), _index_deform_tuple = Module._index_deform_tuple = (e, t2, r, a2) => (_index_deform_tuple = Module._index_deform_tuple = wasmExports.index_deform_tuple)(e, t2, r, a2), _slot_getsomeattrs_int = Module._slot_getsomeattrs_int = (e, t2) => (_slot_getsomeattrs_int = Module._slot_getsomeattrs_int = wasmExports.slot_getsomeattrs_int)(e, t2), _pg_lltoa = Module._pg_lltoa = (e, t2) => (_pg_lltoa = Module._pg_lltoa = wasmExports.pg_lltoa)(e, t2), _pg_ltoa = Module._pg_ltoa = (e, t2) => (_pg_ltoa = Module._pg_ltoa = wasmExports.pg_ltoa)(e, t2), _relation_open = Module._relation_open = (e, t2) => (_relation_open = Module._relation_open = wasmExports.relation_open)(e, t2), _LockRelationOid = Module._LockRelationOid = (e, t2) => (_LockRelationOid = Module._LockRelationOid = wasmExports.LockRelationOid)(e, t2), _try_relation_open = Module._try_relation_open = (e, t2) => (_try_relation_open = Module._try_relation_open = wasmExports.try_relation_open)(e, t2), _relation_openrv = Module._relation_openrv = (e, t2) => (_relation_openrv = Module._relation_openrv = wasmExports.relation_openrv)(e, t2), _AcceptInvalidationMessages = Module._AcceptInvalidationMessages = () => (_AcceptInvalidationMessages = Module._AcceptInvalidationMessages = wasmExports.AcceptInvalidationMessages)(), _RangeVarGetRelidExtended = Module._RangeVarGetRelidExtended = (e, t2, r, a2, o4) => (_RangeVarGetRelidExtended = Module._RangeVarGetRelidExtended = wasmExports.RangeVarGetRelidExtended)(e, t2, r, a2, o4), _add_reloption_kind = Module._add_reloption_kind = () => (_add_reloption_kind = Module._add_reloption_kind = wasmExports.add_reloption_kind)(), _register_reloptions_validator = Module._register_reloptions_validator = (e, t2) => (_register_reloptions_validator = Module._register_reloptions_validator = wasmExports.register_reloptions_validator)(e, t2), _add_int_reloption = Module._add_int_reloption = (e, t2, r, a2, o4, s4, _3) => (_add_int_reloption = Module._add_int_reloption = wasmExports.add_int_reloption)(e, t2, r, a2, o4, s4, _3), _MemoryContextStrdup = Module._MemoryContextStrdup = (e, t2) => (_MemoryContextStrdup = Module._MemoryContextStrdup = wasmExports.MemoryContextStrdup)(e, t2), _transformRelOptions = Module._transformRelOptions = (e, t2, r, a2, o4, s4) => (_transformRelOptions = Module._transformRelOptions = wasmExports.transformRelOptions)(e, t2, r, a2, o4, s4), _deconstruct_array_builtin = Module._deconstruct_array_builtin = (e, t2, r, a2, o4) => (_deconstruct_array_builtin = Module._deconstruct_array_builtin = wasmExports.deconstruct_array_builtin)(e, t2, r, a2, o4), _defGetString = Module._defGetString = (e) => (_defGetString = Module._defGetString = wasmExports.defGetString)(e), _defGetBoolean = Module._defGetBoolean = (e) => (_defGetBoolean = Module._defGetBoolean = wasmExports.defGetBoolean)(e), _untransformRelOptions = Module._untransformRelOptions = (e) => (_untransformRelOptions = Module._untransformRelOptions = wasmExports.untransformRelOptions)(e), _text_to_cstring = Module._text_to_cstring = (e) => (_text_to_cstring = Module._text_to_cstring = wasmExports.text_to_cstring)(e), _makeString = Module._makeString = (e) => (_makeString = Module._makeString = wasmExports.makeString)(e), _makeDefElem = Module._makeDefElem = (e, t2, r) => (_makeDefElem = Module._makeDefElem = wasmExports.makeDefElem)(e, t2, r), _heap_reloptions = Module._heap_reloptions = (e, t2, r) => (_heap_reloptions = Module._heap_reloptions = wasmExports.heap_reloptions)(e, t2, r), _MemoryContextAlloc = Module._MemoryContextAlloc = (e, t2) => (_MemoryContextAlloc = Module._MemoryContextAlloc = wasmExports.MemoryContextAlloc)(e, t2), _parse_bool = Module._parse_bool = (e, t2) => (_parse_bool = Module._parse_bool = wasmExports.parse_bool)(e, t2), _parse_int = Module._parse_int = (e, t2, r, a2) => (_parse_int = Module._parse_int = wasmExports.parse_int)(e, t2, r, a2), _parse_real = Module._parse_real = (e, t2, r, a2) => (_parse_real = Module._parse_real = wasmExports.parse_real)(e, t2, r, a2), _ScanKeyInit = Module._ScanKeyInit = (e, t2, r, a2, o4) => (_ScanKeyInit = Module._ScanKeyInit = wasmExports.ScanKeyInit)(e, t2, r, a2, o4), _dsm_segment_handle = Module._dsm_segment_handle = (e) => (_dsm_segment_handle = Module._dsm_segment_handle = wasmExports.dsm_segment_handle)(e), _dsm_create = Module._dsm_create = (e, t2) => (_dsm_create = Module._dsm_create = wasmExports.dsm_create)(e, t2), _dsm_segment_address = Module._dsm_segment_address = (e) => (_dsm_segment_address = Module._dsm_segment_address = wasmExports.dsm_segment_address)(e), _dsm_attach = Module._dsm_attach = (e) => (_dsm_attach = Module._dsm_attach = wasmExports.dsm_attach)(e), _dsm_detach = Module._dsm_detach = (e) => (_dsm_detach = Module._dsm_detach = wasmExports.dsm_detach)(e), _ShmemInitStruct = Module._ShmemInitStruct = (e, t2, r) => (_ShmemInitStruct = Module._ShmemInitStruct = wasmExports.ShmemInitStruct)(e, t2, r), _LWLockAcquire = Module._LWLockAcquire = (e, t2) => (_LWLockAcquire = Module._LWLockAcquire = wasmExports.LWLockAcquire)(e, t2), _LWLockRelease = Module._LWLockRelease = (e) => (_LWLockRelease = Module._LWLockRelease = wasmExports.LWLockRelease)(e), _LWLockInitialize = Module._LWLockInitialize = (e, t2) => (_LWLockInitialize = Module._LWLockInitialize = wasmExports.LWLockInitialize)(e, t2), _MemoryContextMemAllocated = Module._MemoryContextMemAllocated = (e, t2) => (_MemoryContextMemAllocated = Module._MemoryContextMemAllocated = wasmExports.MemoryContextMemAllocated)(e, t2), _GetCurrentCommandId = Module._GetCurrentCommandId = (e) => (_GetCurrentCommandId = Module._GetCurrentCommandId = wasmExports.GetCurrentCommandId)(e), _toast_open_indexes = Module._toast_open_indexes = (e, t2, r, a2) => (_toast_open_indexes = Module._toast_open_indexes = wasmExports.toast_open_indexes)(e, t2, r, a2), _heap_insert = Module._heap_insert = (e, t2, r, a2, o4) => (_heap_insert = Module._heap_insert = wasmExports.heap_insert)(e, t2, r, a2, o4), _RelationGetIndexList = Module._RelationGetIndexList = (e) => (_RelationGetIndexList = Module._RelationGetIndexList = wasmExports.RelationGetIndexList)(e), _systable_beginscan = Module._systable_beginscan = (e, t2, r, a2, o4, s4) => (_systable_beginscan = Module._systable_beginscan = wasmExports.systable_beginscan)(e, t2, r, a2, o4, s4), _systable_getnext = Module._systable_getnext = (e) => (_systable_getnext = Module._systable_getnext = wasmExports.systable_getnext)(e), _systable_endscan = Module._systable_endscan = (e) => (_systable_endscan = Module._systable_endscan = wasmExports.systable_endscan)(e), _toast_close_indexes = Module._toast_close_indexes = (e, t2, r) => (_toast_close_indexes = Module._toast_close_indexes = wasmExports.toast_close_indexes)(e, t2, r), _systable_beginscan_ordered = Module._systable_beginscan_ordered = (e, t2, r, a2, o4) => (_systable_beginscan_ordered = Module._systable_beginscan_ordered = wasmExports.systable_beginscan_ordered)(e, t2, r, a2, o4), _systable_getnext_ordered = Module._systable_getnext_ordered = (e, t2) => (_systable_getnext_ordered = Module._systable_getnext_ordered = wasmExports.systable_getnext_ordered)(e, t2), _systable_endscan_ordered = Module._systable_endscan_ordered = (e) => (_systable_endscan_ordered = Module._systable_endscan_ordered = wasmExports.systable_endscan_ordered)(e), _init_toast_snapshot = Module._init_toast_snapshot = (e) => (_init_toast_snapshot = Module._init_toast_snapshot = wasmExports.init_toast_snapshot)(e), _convert_tuples_by_position = Module._convert_tuples_by_position = (e, t2, r) => (_convert_tuples_by_position = Module._convert_tuples_by_position = wasmExports.convert_tuples_by_position)(e, t2, r), _execute_attr_map_tuple = Module._execute_attr_map_tuple = (e, t2) => (_execute_attr_map_tuple = Module._execute_attr_map_tuple = wasmExports.execute_attr_map_tuple)(e, t2), _ExecStoreVirtualTuple = Module._ExecStoreVirtualTuple = (e) => (_ExecStoreVirtualTuple = Module._ExecStoreVirtualTuple = wasmExports.ExecStoreVirtualTuple)(e), _bms_is_member = Module._bms_is_member = (e, t2) => (_bms_is_member = Module._bms_is_member = wasmExports.bms_is_member)(e, t2), _bms_add_member = Module._bms_add_member = (e, t2) => (_bms_add_member = Module._bms_add_member = wasmExports.bms_add_member)(e, t2), _CreateTupleDescCopy = Module._CreateTupleDescCopy = (e) => (_CreateTupleDescCopy = Module._CreateTupleDescCopy = wasmExports.CreateTupleDescCopy)(e), _ResourceOwnerEnlarge = Module._ResourceOwnerEnlarge = (e) => (_ResourceOwnerEnlarge = Module._ResourceOwnerEnlarge = wasmExports.ResourceOwnerEnlarge)(e), _ResourceOwnerRemember = Module._ResourceOwnerRemember = (e, t2, r) => (_ResourceOwnerRemember = Module._ResourceOwnerRemember = wasmExports.ResourceOwnerRemember)(e, t2, r), _DecrTupleDescRefCount = Module._DecrTupleDescRefCount = (e) => (_DecrTupleDescRefCount = Module._DecrTupleDescRefCount = wasmExports.DecrTupleDescRefCount)(e), _ResourceOwnerForget = Module._ResourceOwnerForget = (e, t2, r) => (_ResourceOwnerForget = Module._ResourceOwnerForget = wasmExports.ResourceOwnerForget)(e, t2, r), _datumIsEqual = Module._datumIsEqual = (e, t2, r, a2) => (_datumIsEqual = Module._datumIsEqual = wasmExports.datumIsEqual)(e, t2, r, a2), _namestrcpy = Module._namestrcpy = (e, t2) => (_namestrcpy = Module._namestrcpy = wasmExports.namestrcpy)(e, t2), _TupleDescInitEntryCollation = Module._TupleDescInitEntryCollation = (e, t2, r) => (_TupleDescInitEntryCollation = Module._TupleDescInitEntryCollation = wasmExports.TupleDescInitEntryCollation)(e, t2, r), _stringToNode = Module._stringToNode = (e) => (_stringToNode = Module._stringToNode = wasmExports.stringToNode)(e), _pg_detoast_datum_copy = Module._pg_detoast_datum_copy = (e) => (_pg_detoast_datum_copy = Module._pg_detoast_datum_copy = wasmExports.pg_detoast_datum_copy)(e), _get_typlenbyvalalign = Module._get_typlenbyvalalign = (e, t2, r, a2) => (_get_typlenbyvalalign = Module._get_typlenbyvalalign = wasmExports.get_typlenbyvalalign)(e, t2, r, a2), _deconstruct_array = Module._deconstruct_array = (e, t2, r, a2, o4, s4, _3, n3) => (_deconstruct_array = Module._deconstruct_array = wasmExports.deconstruct_array)(e, t2, r, a2, o4, s4, _3, n3), _tbm_add_tuples = Module._tbm_add_tuples = (e, t2, r, a2) => (_tbm_add_tuples = Module._tbm_add_tuples = wasmExports.tbm_add_tuples)(e, t2, r, a2), _ginPostingListDecode = Module._ginPostingListDecode = (e, t2) => (_ginPostingListDecode = Module._ginPostingListDecode = wasmExports.ginPostingListDecode)(e, t2), _ItemPointerCompare = Module._ItemPointerCompare = (e, t2) => (_ItemPointerCompare = Module._ItemPointerCompare = wasmExports.ItemPointerCompare)(e, t2), _LockPage = Module._LockPage = (e, t2, r) => (_LockPage = Module._LockPage = wasmExports.LockPage)(e, t2, r), _UnlockPage = Module._UnlockPage = (e, t2, r) => (_UnlockPage = Module._UnlockPage = wasmExports.UnlockPage)(e, t2, r), _vacuum_delay_point = Module._vacuum_delay_point = () => (_vacuum_delay_point = Module._vacuum_delay_point = wasmExports.vacuum_delay_point)(), _RecordFreeIndexPage = Module._RecordFreeIndexPage = (e, t2) => (_RecordFreeIndexPage = Module._RecordFreeIndexPage = wasmExports.RecordFreeIndexPage)(e, t2), _IndexFreeSpaceMapVacuum = Module._IndexFreeSpaceMapVacuum = (e) => (_IndexFreeSpaceMapVacuum = Module._IndexFreeSpaceMapVacuum = wasmExports.IndexFreeSpaceMapVacuum)(e), _log_newpage_range = Module._log_newpage_range = (e, t2, r, a2, o4) => (_log_newpage_range = Module._log_newpage_range = wasmExports.log_newpage_range)(e, t2, r, a2, o4), _GetFreeIndexPage = Module._GetFreeIndexPage = (e) => (_GetFreeIndexPage = Module._GetFreeIndexPage = wasmExports.GetFreeIndexPage)(e), _ConditionalLockBuffer = Module._ConditionalLockBuffer = (e) => (_ConditionalLockBuffer = Module._ConditionalLockBuffer = wasmExports.ConditionalLockBuffer)(e), _LockBufferForCleanup = Module._LockBufferForCleanup = (e) => (_LockBufferForCleanup = Module._LockBufferForCleanup = wasmExports.LockBufferForCleanup)(e), _gistcheckpage = Module._gistcheckpage = (e, t2) => (_gistcheckpage = Module._gistcheckpage = wasmExports.gistcheckpage)(e, t2), _PageIndexMultiDelete = Module._PageIndexMultiDelete = (e, t2, r) => (_PageIndexMultiDelete = Module._PageIndexMultiDelete = wasmExports.PageIndexMultiDelete)(e, t2, r), _lcons = Module._lcons = (e, t2) => (_lcons = Module._lcons = wasmExports.lcons)(e, t2), _pow = Module._pow = (e, t2) => (_pow = Module._pow = wasmExports.pow)(e, t2), _smgrnblocks = Module._smgrnblocks = (e, t2) => (_smgrnblocks = Module._smgrnblocks = wasmExports.smgrnblocks)(e, t2), _list_free_deep = Module._list_free_deep = (e) => (_list_free_deep = Module._list_free_deep = wasmExports.list_free_deep)(e), _pairingheap_remove_first = Module._pairingheap_remove_first = (e) => (_pairingheap_remove_first = Module._pairingheap_remove_first = wasmExports.pairingheap_remove_first)(e), _pairingheap_add = Module._pairingheap_add = (e, t2) => (_pairingheap_add = Module._pairingheap_add = wasmExports.pairingheap_add)(e, t2), _float_overflow_error = Module._float_overflow_error = () => (_float_overflow_error = Module._float_overflow_error = wasmExports.float_overflow_error)(), _float_underflow_error = Module._float_underflow_error = () => (_float_underflow_error = Module._float_underflow_error = wasmExports.float_underflow_error)(), _DirectFunctionCall5Coll = Module._DirectFunctionCall5Coll = (e, t2, r, a2, o4, s4, _3) => (_DirectFunctionCall5Coll = Module._DirectFunctionCall5Coll = wasmExports.DirectFunctionCall5Coll)(e, t2, r, a2, o4, s4, _3), _pairingheap_allocate = Module._pairingheap_allocate = (e, t2) => (_pairingheap_allocate = Module._pairingheap_allocate = wasmExports.pairingheap_allocate)(e, t2), _GenerationContextCreate = Module._GenerationContextCreate = (e, t2, r, a2, o4) => (_GenerationContextCreate = Module._GenerationContextCreate = wasmExports.GenerationContextCreate)(e, t2, r, a2, o4), _pgstat_progress_update_param = Module._pgstat_progress_update_param = (e, t2) => (_pgstat_progress_update_param = Module._pgstat_progress_update_param = wasmExports.pgstat_progress_update_param)(e, t2), __hash_getbuf = Module.__hash_getbuf = (e, t2, r, a2) => (__hash_getbuf = Module.__hash_getbuf = wasmExports._hash_getbuf)(e, t2, r, a2), __hash_relbuf = Module.__hash_relbuf = (e, t2) => (__hash_relbuf = Module.__hash_relbuf = wasmExports._hash_relbuf)(e, t2), __hash_get_indextuple_hashkey = Module.__hash_get_indextuple_hashkey = (e) => (__hash_get_indextuple_hashkey = Module.__hash_get_indextuple_hashkey = wasmExports._hash_get_indextuple_hashkey)(e), __hash_getbuf_with_strategy = Module.__hash_getbuf_with_strategy = (e, t2, r, a2, o4) => (__hash_getbuf_with_strategy = Module.__hash_getbuf_with_strategy = wasmExports._hash_getbuf_with_strategy)(e, t2, r, a2, o4), _hashcharextended = Module._hashcharextended = (e) => (_hashcharextended = Module._hashcharextended = wasmExports.hashcharextended)(e), _hashint8 = Module._hashint8 = (e) => (_hashint8 = Module._hashint8 = wasmExports.hashint8)(e), _hashint8extended = Module._hashint8extended = (e) => (_hashint8extended = Module._hashint8extended = wasmExports.hashint8extended)(e), _hashfloat8 = Module._hashfloat8 = (e) => (_hashfloat8 = Module._hashfloat8 = wasmExports.hashfloat8)(e), _hashfloat8extended = Module._hashfloat8extended = (e) => (_hashfloat8extended = Module._hashfloat8extended = wasmExports.hashfloat8extended)(e), __hash_ovflblkno_to_bitno = Module.__hash_ovflblkno_to_bitno = (e, t2) => (__hash_ovflblkno_to_bitno = Module.__hash_ovflblkno_to_bitno = wasmExports._hash_ovflblkno_to_bitno)(e, t2), _hash_destroy = Module._hash_destroy = (e) => (_hash_destroy = Module._hash_destroy = wasmExports.hash_destroy)(e), _OidFunctionCall1Coll = Module._OidFunctionCall1Coll = (e, t2, r) => (_OidFunctionCall1Coll = Module._OidFunctionCall1Coll = wasmExports.OidFunctionCall1Coll)(e, t2, r), _list_member_oid = Module._list_member_oid = (e, t2) => (_list_member_oid = Module._list_member_oid = wasmExports.list_member_oid)(e, t2), _HeapTupleSatisfiesVisibility = Module._HeapTupleSatisfiesVisibility = (e, t2, r) => (_HeapTupleSatisfiesVisibility = Module._HeapTupleSatisfiesVisibility = wasmExports.HeapTupleSatisfiesVisibility)(e, t2, r), _read_stream_begin_relation = Module._read_stream_begin_relation = (e, t2, r, a2, o4, s4, _3) => (_read_stream_begin_relation = Module._read_stream_begin_relation = wasmExports.read_stream_begin_relation)(e, t2, r, a2, o4, s4, _3), _GetAccessStrategy = Module._GetAccessStrategy = (e) => (_GetAccessStrategy = Module._GetAccessStrategy = wasmExports.GetAccessStrategy)(e), _FreeAccessStrategy = Module._FreeAccessStrategy = (e) => (_FreeAccessStrategy = Module._FreeAccessStrategy = wasmExports.FreeAccessStrategy)(e), _read_stream_end = Module._read_stream_end = (e) => (_read_stream_end = Module._read_stream_end = wasmExports.read_stream_end)(e), _heap_getnext = Module._heap_getnext = (e, t2) => (_heap_getnext = Module._heap_getnext = wasmExports.heap_getnext)(e, t2), _HeapTupleSatisfiesVacuum = Module._HeapTupleSatisfiesVacuum = (e, t2, r) => (_HeapTupleSatisfiesVacuum = Module._HeapTupleSatisfiesVacuum = wasmExports.HeapTupleSatisfiesVacuum)(e, t2, r), _GetMultiXactIdMembers = Module._GetMultiXactIdMembers = (e, t2, r, a2) => (_GetMultiXactIdMembers = Module._GetMultiXactIdMembers = wasmExports.GetMultiXactIdMembers)(e, t2, r, a2), _TransactionIdPrecedes = Module._TransactionIdPrecedes = (e, t2) => (_TransactionIdPrecedes = Module._TransactionIdPrecedes = wasmExports.TransactionIdPrecedes)(e, t2), _HeapTupleGetUpdateXid = Module._HeapTupleGetUpdateXid = (e) => (_HeapTupleGetUpdateXid = Module._HeapTupleGetUpdateXid = wasmExports.HeapTupleGetUpdateXid)(e), _GetBulkInsertState = Module._GetBulkInsertState = () => (_GetBulkInsertState = Module._GetBulkInsertState = wasmExports.GetBulkInsertState)(), _FreeBulkInsertState = Module._FreeBulkInsertState = (e) => (_FreeBulkInsertState = Module._FreeBulkInsertState = wasmExports.FreeBulkInsertState)(e), _visibilitymap_clear = Module._visibilitymap_clear = (e, t2, r, a2) => (_visibilitymap_clear = Module._visibilitymap_clear = wasmExports.visibilitymap_clear)(e, t2, r, a2), _pgstat_count_heap_insert = Module._pgstat_count_heap_insert = (e, t2) => (_pgstat_count_heap_insert = Module._pgstat_count_heap_insert = wasmExports.pgstat_count_heap_insert)(e, t2), _heap_multi_insert = Module._heap_multi_insert = (e, t2, r, a2, o4, s4) => (_heap_multi_insert = Module._heap_multi_insert = wasmExports.heap_multi_insert)(e, t2, r, a2, o4, s4), _ExecFetchSlotHeapTuple = Module._ExecFetchSlotHeapTuple = (e, t2, r) => (_ExecFetchSlotHeapTuple = Module._ExecFetchSlotHeapTuple = wasmExports.ExecFetchSlotHeapTuple)(e, t2, r), _PageGetHeapFreeSpace = Module._PageGetHeapFreeSpace = (e) => (_PageGetHeapFreeSpace = Module._PageGetHeapFreeSpace = wasmExports.PageGetHeapFreeSpace)(e), _heap_delete = Module._heap_delete = (e, t2, r, a2, o4, s4, _3) => (_heap_delete = Module._heap_delete = wasmExports.heap_delete)(e, t2, r, a2, o4, s4, _3), _visibilitymap_pin = Module._visibilitymap_pin = (e, t2, r) => (_visibilitymap_pin = Module._visibilitymap_pin = wasmExports.visibilitymap_pin)(e, t2, r), _HeapTupleSatisfiesUpdate = Module._HeapTupleSatisfiesUpdate = (e, t2, r) => (_HeapTupleSatisfiesUpdate = Module._HeapTupleSatisfiesUpdate = wasmExports.HeapTupleSatisfiesUpdate)(e, t2, r), _TransactionIdIsCurrentTransactionId = Module._TransactionIdIsCurrentTransactionId = (e) => (_TransactionIdIsCurrentTransactionId = Module._TransactionIdIsCurrentTransactionId = wasmExports.TransactionIdIsCurrentTransactionId)(e), _TransactionIdDidCommit = Module._TransactionIdDidCommit = (e) => (_TransactionIdDidCommit = Module._TransactionIdDidCommit = wasmExports.TransactionIdDidCommit)(e), _TransactionIdIsInProgress = Module._TransactionIdIsInProgress = (e) => (_TransactionIdIsInProgress = Module._TransactionIdIsInProgress = wasmExports.TransactionIdIsInProgress)(e), _bms_free = Module._bms_free = (e) => (_bms_free = Module._bms_free = wasmExports.bms_free)(e), _bms_add_members = Module._bms_add_members = (e, t2) => (_bms_add_members = Module._bms_add_members = wasmExports.bms_add_members)(e, t2), _bms_next_member = Module._bms_next_member = (e, t2) => (_bms_next_member = Module._bms_next_member = wasmExports.bms_next_member)(e, t2), _bms_overlap = Module._bms_overlap = (e, t2) => (_bms_overlap = Module._bms_overlap = wasmExports.bms_overlap)(e, t2), _heap_lock_tuple = Module._heap_lock_tuple = (e, t2, r, a2, o4, s4, _3, n3) => (_heap_lock_tuple = Module._heap_lock_tuple = wasmExports.heap_lock_tuple)(e, t2, r, a2, o4, s4, _3, n3), _MultiXactIdPrecedes = Module._MultiXactIdPrecedes = (e, t2) => (_MultiXactIdPrecedes = Module._MultiXactIdPrecedes = wasmExports.MultiXactIdPrecedes)(e, t2), _heap_tuple_needs_eventual_freeze = Module._heap_tuple_needs_eventual_freeze = (e) => (_heap_tuple_needs_eventual_freeze = Module._heap_tuple_needs_eventual_freeze = wasmExports.heap_tuple_needs_eventual_freeze)(e), _PrefetchBuffer = Module._PrefetchBuffer = (e, t2, r, a2) => (_PrefetchBuffer = Module._PrefetchBuffer = wasmExports.PrefetchBuffer)(e, t2, r, a2), _XLogRecGetBlockTagExtended = Module._XLogRecGetBlockTagExtended = (e, t2, r, a2, o4, s4) => (_XLogRecGetBlockTagExtended = Module._XLogRecGetBlockTagExtended = wasmExports.XLogRecGetBlockTagExtended)(e, t2, r, a2, o4, s4), _read_stream_next_buffer = Module._read_stream_next_buffer = (e, t2) => (_read_stream_next_buffer = Module._read_stream_next_buffer = wasmExports.read_stream_next_buffer)(e, t2), _smgrexists = Module._smgrexists = (e, t2) => (_smgrexists = Module._smgrexists = wasmExports.smgrexists)(e, t2), _table_slot_create = Module._table_slot_create = (e, t2) => (_table_slot_create = Module._table_slot_create = wasmExports.table_slot_create)(e, t2), _ExecDropSingleTupleTableSlot = Module._ExecDropSingleTupleTableSlot = (e) => (_ExecDropSingleTupleTableSlot = Module._ExecDropSingleTupleTableSlot = wasmExports.ExecDropSingleTupleTableSlot)(e), _CreateExecutorState = Module._CreateExecutorState = () => (_CreateExecutorState = Module._CreateExecutorState = wasmExports.CreateExecutorState)(), _MakePerTupleExprContext = Module._MakePerTupleExprContext = (e) => (_MakePerTupleExprContext = Module._MakePerTupleExprContext = wasmExports.MakePerTupleExprContext)(e), _ExecPrepareQual = Module._ExecPrepareQual = (e, t2) => (_ExecPrepareQual = Module._ExecPrepareQual = wasmExports.ExecPrepareQual)(e, t2), _GetOldestNonRemovableTransactionId = Module._GetOldestNonRemovableTransactionId = (e) => (_GetOldestNonRemovableTransactionId = Module._GetOldestNonRemovableTransactionId = wasmExports.GetOldestNonRemovableTransactionId)(e), _FreeExecutorState = Module._FreeExecutorState = (e) => (_FreeExecutorState = Module._FreeExecutorState = wasmExports.FreeExecutorState)(e), _MakeSingleTupleTableSlot = Module._MakeSingleTupleTableSlot = (e, t2) => (_MakeSingleTupleTableSlot = Module._MakeSingleTupleTableSlot = wasmExports.MakeSingleTupleTableSlot)(e, t2), _tuplesort_getdatum = Module._tuplesort_getdatum = (e, t2, r, a2, o4, s4) => (_tuplesort_getdatum = Module._tuplesort_getdatum = wasmExports.tuplesort_getdatum)(e, t2, r, a2, o4, s4), _ExecStoreHeapTuple = Module._ExecStoreHeapTuple = (e, t2, r) => (_ExecStoreHeapTuple = Module._ExecStoreHeapTuple = wasmExports.ExecStoreHeapTuple)(e, t2, r), _visibilitymap_get_status = Module._visibilitymap_get_status = (e, t2, r) => (_visibilitymap_get_status = Module._visibilitymap_get_status = wasmExports.visibilitymap_get_status)(e, t2, r), _ExecStoreAllNullTuple = Module._ExecStoreAllNullTuple = (e) => (_ExecStoreAllNullTuple = Module._ExecStoreAllNullTuple = wasmExports.ExecStoreAllNullTuple)(e), _XidInMVCCSnapshot = Module._XidInMVCCSnapshot = (e, t2) => (_XidInMVCCSnapshot = Module._XidInMVCCSnapshot = wasmExports.XidInMVCCSnapshot)(e, t2), _hash_seq_init = Module._hash_seq_init = (e, t2) => (_hash_seq_init = Module._hash_seq_init = wasmExports.hash_seq_init)(e, t2), _hash_seq_search = Module._hash_seq_search = (e) => (_hash_seq_search = Module._hash_seq_search = wasmExports.hash_seq_search)(e), _ftruncate = Module._ftruncate = (e, t2) => (_ftruncate = Module._ftruncate = wasmExports.ftruncate)(e, t2), _fd_fsync_fname = Module._fd_fsync_fname = (e, t2) => (_fd_fsync_fname = Module._fd_fsync_fname = wasmExports.fd_fsync_fname)(e, t2), _get_namespace_name = Module._get_namespace_name = (e) => (_get_namespace_name = Module._get_namespace_name = wasmExports.get_namespace_name)(e), _GetRecordedFreeSpace = Module._GetRecordedFreeSpace = (e, t2) => (_GetRecordedFreeSpace = Module._GetRecordedFreeSpace = wasmExports.GetRecordedFreeSpace)(e, t2), _vac_estimate_reltuples = Module._vac_estimate_reltuples = (e, t2, r, a2) => (_vac_estimate_reltuples = Module._vac_estimate_reltuples = wasmExports.vac_estimate_reltuples)(e, t2, r, a2), _WaitLatch = Module._WaitLatch = (e, t2, r, a2) => (_WaitLatch = Module._WaitLatch = wasmExports.WaitLatch)(e, t2, r, a2), _ResetLatch = Module._ResetLatch = (e) => (_ResetLatch = Module._ResetLatch = wasmExports.ResetLatch)(e), _clock_gettime = Module._clock_gettime = (e, t2) => (_clock_gettime = Module._clock_gettime = wasmExports.clock_gettime)(e, t2), _WalUsageAccumDiff = Module._WalUsageAccumDiff = (e, t2, r) => (_WalUsageAccumDiff = Module._WalUsageAccumDiff = wasmExports.WalUsageAccumDiff)(e, t2, r), _BufferUsageAccumDiff = Module._BufferUsageAccumDiff = (e, t2, r) => (_BufferUsageAccumDiff = Module._BufferUsageAccumDiff = wasmExports.BufferUsageAccumDiff)(e, t2, r), _visibilitymap_prepare_truncate = Module._visibilitymap_prepare_truncate = (e, t2) => (_visibilitymap_prepare_truncate = Module._visibilitymap_prepare_truncate = wasmExports.visibilitymap_prepare_truncate)(e, t2), _check_enable_rls = Module._check_enable_rls = (e, t2, r) => (_check_enable_rls = Module._check_enable_rls = wasmExports.check_enable_rls)(e, t2, r), _pg_class_aclcheck = Module._pg_class_aclcheck = (e, t2, r) => (_pg_class_aclcheck = Module._pg_class_aclcheck = wasmExports.pg_class_aclcheck)(e, t2, r), _btboolcmp = Module._btboolcmp = (e) => (_btboolcmp = Module._btboolcmp = wasmExports.btboolcmp)(e), _btint2cmp = Module._btint2cmp = (e) => (_btint2cmp = Module._btint2cmp = wasmExports.btint2cmp)(e), _btint4cmp = Module._btint4cmp = (e) => (_btint4cmp = Module._btint4cmp = wasmExports.btint4cmp)(e), _btint8cmp = Module._btint8cmp = (e) => (_btint8cmp = Module._btint8cmp = wasmExports.btint8cmp)(e), _btoidcmp = Module._btoidcmp = (e) => (_btoidcmp = Module._btoidcmp = wasmExports.btoidcmp)(e), _btcharcmp = Module._btcharcmp = (e) => (_btcharcmp = Module._btcharcmp = wasmExports.btcharcmp)(e), __bt_form_posting = Module.__bt_form_posting = (e, t2, r) => (__bt_form_posting = Module.__bt_form_posting = wasmExports._bt_form_posting)(e, t2, r), __bt_mkscankey = Module.__bt_mkscankey = (e, t2) => (__bt_mkscankey = Module.__bt_mkscankey = wasmExports._bt_mkscankey)(e, t2), __bt_checkpage = Module.__bt_checkpage = (e, t2) => (__bt_checkpage = Module.__bt_checkpage = wasmExports._bt_checkpage)(e, t2), __bt_compare = Module.__bt_compare = (e, t2, r, a2) => (__bt_compare = Module.__bt_compare = wasmExports._bt_compare)(e, t2, r, a2), __bt_relbuf = Module.__bt_relbuf = (e, t2) => (__bt_relbuf = Module.__bt_relbuf = wasmExports._bt_relbuf)(e, t2), __bt_search = Module.__bt_search = (e, t2, r, a2, o4) => (__bt_search = Module.__bt_search = wasmExports._bt_search)(e, t2, r, a2, o4), __bt_binsrch_insert = Module.__bt_binsrch_insert = (e, t2) => (__bt_binsrch_insert = Module.__bt_binsrch_insert = wasmExports._bt_binsrch_insert)(e, t2), __bt_freestack = Module.__bt_freestack = (e) => (__bt_freestack = Module.__bt_freestack = wasmExports._bt_freestack)(e), __bt_metaversion = Module.__bt_metaversion = (e, t2, r) => (__bt_metaversion = Module.__bt_metaversion = wasmExports._bt_metaversion)(e, t2, r), __bt_allequalimage = Module.__bt_allequalimage = (e, t2) => (__bt_allequalimage = Module.__bt_allequalimage = wasmExports._bt_allequalimage)(e, t2), _before_shmem_exit = Module._before_shmem_exit = (e, t2) => (_before_shmem_exit = Module._before_shmem_exit = wasmExports.before_shmem_exit)(e, t2), _cancel_before_shmem_exit = Module._cancel_before_shmem_exit = (e, t2) => (_cancel_before_shmem_exit = Module._cancel_before_shmem_exit = wasmExports.cancel_before_shmem_exit)(e, t2), _pg_re_throw = Module._pg_re_throw = () => (_pg_re_throw = Module._pg_re_throw = wasmExports.pg_re_throw)(), _get_opfamily_member = Module._get_opfamily_member = (e, t2, r, a2) => (_get_opfamily_member = Module._get_opfamily_member = wasmExports.get_opfamily_member)(e, t2, r, a2), _datum_image_eq = Module._datum_image_eq = (e, t2, r, a2) => (_datum_image_eq = Module._datum_image_eq = wasmExports.datum_image_eq)(e, t2, r, a2), __bt_check_natts = Module.__bt_check_natts = (e, t2, r, a2) => (__bt_check_natts = Module.__bt_check_natts = wasmExports._bt_check_natts)(e, t2, r, a2), _strncpy = Module._strncpy = (e, t2, r) => (_strncpy = Module._strncpy = wasmExports.strncpy)(e, t2, r), _timestamptz_to_str = Module._timestamptz_to_str = (e) => (_timestamptz_to_str = Module._timestamptz_to_str = wasmExports.timestamptz_to_str)(e), _XLogRecGetBlockRefInfo = Module._XLogRecGetBlockRefInfo = (e, t2, r, a2, o4) => (_XLogRecGetBlockRefInfo = Module._XLogRecGetBlockRefInfo = wasmExports.XLogRecGetBlockRefInfo)(e, t2, r, a2, o4), _varstr_cmp = Module._varstr_cmp = (e, t2, r, a2, o4) => (_varstr_cmp = Module._varstr_cmp = wasmExports.varstr_cmp)(e, t2, r, a2, o4), _getBaseType = Module._getBaseType = (e) => (_getBaseType = Module._getBaseType = wasmExports.getBaseType)(e), _exprType = Module._exprType = (e) => (_exprType = Module._exprType = wasmExports.exprType)(e), _GetActiveSnapshot = Module._GetActiveSnapshot = () => (_GetActiveSnapshot = Module._GetActiveSnapshot = wasmExports.GetActiveSnapshot)(), _errdetail_relkind_not_supported = Module._errdetail_relkind_not_supported = (e) => (_errdetail_relkind_not_supported = Module._errdetail_relkind_not_supported = wasmExports.errdetail_relkind_not_supported)(e), _table_openrv = Module._table_openrv = (e, t2) => (_table_openrv = Module._table_openrv = wasmExports.table_openrv)(e, t2), _table_slot_callbacks = Module._table_slot_callbacks = (e) => (_table_slot_callbacks = Module._table_slot_callbacks = wasmExports.table_slot_callbacks)(e), _clamp_row_est = Module._clamp_row_est = (e) => (_clamp_row_est = Module._clamp_row_est = wasmExports.clamp_row_est)(e), _estimate_expression_value = Module._estimate_expression_value = (e, t2) => (_estimate_expression_value = Module._estimate_expression_value = wasmExports.estimate_expression_value)(e, t2), _XLogFlush = Module._XLogFlush = (e) => (_XLogFlush = Module._XLogFlush = wasmExports.XLogFlush)(e), _get_call_result_type = Module._get_call_result_type = (e, t2, r) => (_get_call_result_type = Module._get_call_result_type = wasmExports.get_call_result_type)(e, t2, r), _HeapTupleHeaderGetDatum = Module._HeapTupleHeaderGetDatum = (e) => (_HeapTupleHeaderGetDatum = Module._HeapTupleHeaderGetDatum = wasmExports.HeapTupleHeaderGetDatum)(e), _GenericXLogStart = Module._GenericXLogStart = (e) => (_GenericXLogStart = Module._GenericXLogStart = wasmExports.GenericXLogStart)(e), _GenericXLogRegisterBuffer = Module._GenericXLogRegisterBuffer = (e, t2, r) => (_GenericXLogRegisterBuffer = Module._GenericXLogRegisterBuffer = wasmExports.GenericXLogRegisterBuffer)(e, t2, r), _GenericXLogFinish = Module._GenericXLogFinish = (e) => (_GenericXLogFinish = Module._GenericXLogFinish = wasmExports.GenericXLogFinish)(e), _GenericXLogAbort = Module._GenericXLogAbort = (e) => (_GenericXLogAbort = Module._GenericXLogAbort = wasmExports.GenericXLogAbort)(e), _errmsg_plural = Module._errmsg_plural = (e, t2, r, a2) => (_errmsg_plural = Module._errmsg_plural = wasmExports.errmsg_plural)(e, t2, r, a2), _ReadNextMultiXactId = Module._ReadNextMultiXactId = () => (_ReadNextMultiXactId = Module._ReadNextMultiXactId = wasmExports.ReadNextMultiXactId)(), _ReadMultiXactIdRange = Module._ReadMultiXactIdRange = (e, t2) => (_ReadMultiXactIdRange = Module._ReadMultiXactIdRange = wasmExports.ReadMultiXactIdRange)(e, t2), _MultiXactIdPrecedesOrEquals = Module._MultiXactIdPrecedesOrEquals = (e, t2) => (_MultiXactIdPrecedesOrEquals = Module._MultiXactIdPrecedesOrEquals = wasmExports.MultiXactIdPrecedesOrEquals)(e, t2), _init_MultiFuncCall = Module._init_MultiFuncCall = (e) => (_init_MultiFuncCall = Module._init_MultiFuncCall = wasmExports.init_MultiFuncCall)(e), _TupleDescGetAttInMetadata = Module._TupleDescGetAttInMetadata = (e) => (_TupleDescGetAttInMetadata = Module._TupleDescGetAttInMetadata = wasmExports.TupleDescGetAttInMetadata)(e), _per_MultiFuncCall = Module._per_MultiFuncCall = (e) => (_per_MultiFuncCall = Module._per_MultiFuncCall = wasmExports.per_MultiFuncCall)(e), _BuildTupleFromCStrings = Module._BuildTupleFromCStrings = (e, t2) => (_BuildTupleFromCStrings = Module._BuildTupleFromCStrings = wasmExports.BuildTupleFromCStrings)(e, t2), _end_MultiFuncCall = Module._end_MultiFuncCall = (e, t2) => (_end_MultiFuncCall = Module._end_MultiFuncCall = wasmExports.end_MultiFuncCall)(e, t2), _GetCurrentSubTransactionId = Module._GetCurrentSubTransactionId = () => (_GetCurrentSubTransactionId = Module._GetCurrentSubTransactionId = wasmExports.GetCurrentSubTransactionId)(), _WaitForBackgroundWorkerShutdown = Module._WaitForBackgroundWorkerShutdown = (e) => (_WaitForBackgroundWorkerShutdown = Module._WaitForBackgroundWorkerShutdown = wasmExports.WaitForBackgroundWorkerShutdown)(e), _RegisterDynamicBackgroundWorker = Module._RegisterDynamicBackgroundWorker = (e, t2) => (_RegisterDynamicBackgroundWorker = Module._RegisterDynamicBackgroundWorker = wasmExports.RegisterDynamicBackgroundWorker)(e, t2), _pq_getmsgint64 = Module._pq_getmsgint64 = (e) => (_pq_getmsgint64 = Module._pq_getmsgint64 = wasmExports.pq_getmsgint64)(e), _BackgroundWorkerUnblockSignals = Module._BackgroundWorkerUnblockSignals = () => (_BackgroundWorkerUnblockSignals = Module._BackgroundWorkerUnblockSignals = wasmExports.BackgroundWorkerUnblockSignals)(), _BackgroundWorkerInitializeConnectionByOid = Module._BackgroundWorkerInitializeConnectionByOid = (e, t2, r) => (_BackgroundWorkerInitializeConnectionByOid = Module._BackgroundWorkerInitializeConnectionByOid = wasmExports.BackgroundWorkerInitializeConnectionByOid)(e, t2, r), _GetDatabaseEncoding = Module._GetDatabaseEncoding = () => (_GetDatabaseEncoding = Module._GetDatabaseEncoding = wasmExports.GetDatabaseEncoding)(), _RmgrNotFound = Module._RmgrNotFound = (e) => (_RmgrNotFound = Module._RmgrNotFound = wasmExports.RmgrNotFound)(e), _InitMaterializedSRF = Module._InitMaterializedSRF = (e, t2) => (_InitMaterializedSRF = Module._InitMaterializedSRF = wasmExports.InitMaterializedSRF)(e, t2), _tuplestore_putvalues = Module._tuplestore_putvalues = (e, t2, r, a2) => (_tuplestore_putvalues = Module._tuplestore_putvalues = wasmExports.tuplestore_putvalues)(e, t2, r, a2), _AllocateFile = Module._AllocateFile = (e, t2) => (_AllocateFile = Module._AllocateFile = wasmExports.AllocateFile)(e, t2), _FreeFile = Module._FreeFile = (e) => (_FreeFile = Module._FreeFile = wasmExports.FreeFile)(e), _fd_durable_rename = Module._fd_durable_rename = (e, t2, r) => (_fd_durable_rename = Module._fd_durable_rename = wasmExports.fd_durable_rename)(e, t2, r), _BlessTupleDesc = Module._BlessTupleDesc = (e) => (_BlessTupleDesc = Module._BlessTupleDesc = wasmExports.BlessTupleDesc)(e), _fstat = Module._fstat = (e, t2) => (_fstat = Module._fstat = wasmExports.fstat)(e, t2), _superuser_arg = Module._superuser_arg = (e) => (_superuser_arg = Module._superuser_arg = wasmExports.superuser_arg)(e), _wal_segment_close = Module._wal_segment_close = (e) => (_wal_segment_close = Module._wal_segment_close = wasmExports.wal_segment_close)(e), _wal_segment_open = Module._wal_segment_open = (e, t2, r) => (_wal_segment_open = Module._wal_segment_open = wasmExports.wal_segment_open)(e, t2, r), _XLogReaderAllocate = Module._XLogReaderAllocate = (e, t2, r, a2) => (_XLogReaderAllocate = Module._XLogReaderAllocate = wasmExports.XLogReaderAllocate)(e, t2, r, a2), _XLogReadRecord = Module._XLogReadRecord = (e, t2) => (_XLogReadRecord = Module._XLogReadRecord = wasmExports.XLogReadRecord)(e, t2), _XLogReaderFree = Module._XLogReaderFree = (e) => (_XLogReaderFree = Module._XLogReaderFree = wasmExports.XLogReaderFree)(e), _GetTopFullTransactionId = Module._GetTopFullTransactionId = () => (_GetTopFullTransactionId = Module._GetTopFullTransactionId = wasmExports.GetTopFullTransactionId)(), _GetCurrentTransactionNestLevel = Module._GetCurrentTransactionNestLevel = () => (_GetCurrentTransactionNestLevel = Module._GetCurrentTransactionNestLevel = wasmExports.GetCurrentTransactionNestLevel)(), _ResourceOwnerCreate = Module._ResourceOwnerCreate = (e, t2) => (_ResourceOwnerCreate = Module._ResourceOwnerCreate = wasmExports.ResourceOwnerCreate)(e, t2), _RegisterXactCallback = Module._RegisterXactCallback = (e, t2) => (_RegisterXactCallback = Module._RegisterXactCallback = wasmExports.RegisterXactCallback)(e, t2), _RegisterSubXactCallback = Module._RegisterSubXactCallback = (e, t2) => (_RegisterSubXactCallback = Module._RegisterSubXactCallback = wasmExports.RegisterSubXactCallback)(e, t2), _BeginInternalSubTransaction = Module._BeginInternalSubTransaction = (e) => (_BeginInternalSubTransaction = Module._BeginInternalSubTransaction = wasmExports.BeginInternalSubTransaction)(e), _ReleaseCurrentSubTransaction = Module._ReleaseCurrentSubTransaction = () => (_ReleaseCurrentSubTransaction = Module._ReleaseCurrentSubTransaction = wasmExports.ReleaseCurrentSubTransaction)(), _ResourceOwnerDelete = Module._ResourceOwnerDelete = (e) => (_ResourceOwnerDelete = Module._ResourceOwnerDelete = wasmExports.ResourceOwnerDelete)(e), _RollbackAndReleaseCurrentSubTransaction = Module._RollbackAndReleaseCurrentSubTransaction = () => (_RollbackAndReleaseCurrentSubTransaction = Module._RollbackAndReleaseCurrentSubTransaction = wasmExports.RollbackAndReleaseCurrentSubTransaction)(), _ReleaseExternalFD = Module._ReleaseExternalFD = () => (_ReleaseExternalFD = Module._ReleaseExternalFD = wasmExports.ReleaseExternalFD)(), _GetFlushRecPtr = Module._GetFlushRecPtr = (e) => (_GetFlushRecPtr = Module._GetFlushRecPtr = wasmExports.GetFlushRecPtr)(e), _GetXLogReplayRecPtr = Module._GetXLogReplayRecPtr = (e) => (_GetXLogReplayRecPtr = Module._GetXLogReplayRecPtr = wasmExports.GetXLogReplayRecPtr)(e), _TimestampDifferenceMilliseconds = Module._TimestampDifferenceMilliseconds = (e, t2) => (_TimestampDifferenceMilliseconds = Module._TimestampDifferenceMilliseconds = wasmExports.TimestampDifferenceMilliseconds)(e, t2), _numeric_in = Module._numeric_in = (e) => (_numeric_in = Module._numeric_in = wasmExports.numeric_in)(e), _DirectFunctionCall3Coll = Module._DirectFunctionCall3Coll = (e, t2, r, a2, o4) => (_DirectFunctionCall3Coll = Module._DirectFunctionCall3Coll = wasmExports.DirectFunctionCall3Coll)(e, t2, r, a2, o4), _XLogFindNextRecord = Module._XLogFindNextRecord = (e, t2) => (_XLogFindNextRecord = Module._XLogFindNextRecord = wasmExports.XLogFindNextRecord)(e, t2), _RestoreBlockImage = Module._RestoreBlockImage = (e, t2, r) => (_RestoreBlockImage = Module._RestoreBlockImage = wasmExports.RestoreBlockImage)(e, t2, r), _timestamptz_in = Module._timestamptz_in = (e) => (_timestamptz_in = Module._timestamptz_in = wasmExports.timestamptz_in)(e), _fscanf = Module._fscanf = (e, t2, r) => (_fscanf = Module._fscanf = wasmExports.fscanf)(e, t2, r), _XLogRecStoreStats = Module._XLogRecStoreStats = (e, t2) => (_XLogRecStoreStats = Module._XLogRecStoreStats = wasmExports.XLogRecStoreStats)(e, t2), _hash_get_num_entries = Module._hash_get_num_entries = (e) => (_hash_get_num_entries = Module._hash_get_num_entries = wasmExports.hash_get_num_entries)(e), _read_local_xlog_page_no_wait = Module._read_local_xlog_page_no_wait = (e, t2, r, a2, o4) => (_read_local_xlog_page_no_wait = Module._read_local_xlog_page_no_wait = wasmExports.read_local_xlog_page_no_wait)(e, t2, r, a2, o4), _escape_json = Module._escape_json = (e, t2) => (_escape_json = Module._escape_json = wasmExports.escape_json)(e, t2), _list_sort = Module._list_sort = (e, t2) => (_list_sort = Module._list_sort = wasmExports.list_sort)(e, t2), _getegid = Module._getegid = () => (_getegid = Module._getegid = wasmExports.getegid)(), _pg_checksum_page = Module._pg_checksum_page = (e, t2) => (_pg_checksum_page = Module._pg_checksum_page = wasmExports.pg_checksum_page)(e, t2), _bbsink_forward_end_archive = Module._bbsink_forward_end_archive = (e) => (_bbsink_forward_end_archive = Module._bbsink_forward_end_archive = wasmExports.bbsink_forward_end_archive)(e), _bbsink_forward_begin_manifest = Module._bbsink_forward_begin_manifest = (e) => (_bbsink_forward_begin_manifest = Module._bbsink_forward_begin_manifest = wasmExports.bbsink_forward_begin_manifest)(e), _bbsink_forward_end_manifest = Module._bbsink_forward_end_manifest = (e) => (_bbsink_forward_end_manifest = Module._bbsink_forward_end_manifest = wasmExports.bbsink_forward_end_manifest)(e), _bbsink_forward_end_backup = Module._bbsink_forward_end_backup = (e, t2, r) => (_bbsink_forward_end_backup = Module._bbsink_forward_end_backup = wasmExports.bbsink_forward_end_backup)(e, t2, r), _bbsink_forward_cleanup = Module._bbsink_forward_cleanup = (e) => (_bbsink_forward_cleanup = Module._bbsink_forward_cleanup = wasmExports.bbsink_forward_cleanup)(e), _list_concat = Module._list_concat = (e, t2) => (_list_concat = Module._list_concat = wasmExports.list_concat)(e, t2), _bbsink_forward_begin_backup = Module._bbsink_forward_begin_backup = (e) => (_bbsink_forward_begin_backup = Module._bbsink_forward_begin_backup = wasmExports.bbsink_forward_begin_backup)(e), _bbsink_forward_archive_contents = Module._bbsink_forward_archive_contents = (e, t2) => (_bbsink_forward_archive_contents = Module._bbsink_forward_archive_contents = wasmExports.bbsink_forward_archive_contents)(e, t2), _bbsink_forward_begin_archive = Module._bbsink_forward_begin_archive = (e, t2) => (_bbsink_forward_begin_archive = Module._bbsink_forward_begin_archive = wasmExports.bbsink_forward_begin_archive)(e, t2), _bbsink_forward_manifest_contents = Module._bbsink_forward_manifest_contents = (e, t2) => (_bbsink_forward_manifest_contents = Module._bbsink_forward_manifest_contents = wasmExports.bbsink_forward_manifest_contents)(e, t2), _has_privs_of_role = Module._has_privs_of_role = (e, t2) => (_has_privs_of_role = Module._has_privs_of_role = wasmExports.has_privs_of_role)(e, t2), _BaseBackupAddTarget = Module._BaseBackupAddTarget = (e, t2, r) => (_BaseBackupAddTarget = Module._BaseBackupAddTarget = wasmExports.BaseBackupAddTarget)(e, t2, r), _list_copy = Module._list_copy = (e) => (_list_copy = Module._list_copy = wasmExports.list_copy)(e), _tuplestore_puttuple = Module._tuplestore_puttuple = (e, t2) => (_tuplestore_puttuple = Module._tuplestore_puttuple = wasmExports.tuplestore_puttuple)(e, t2), _makeRangeVar = Module._makeRangeVar = (e, t2, r) => (_makeRangeVar = Module._makeRangeVar = wasmExports.makeRangeVar)(e, t2, r), _DefineIndex = Module._DefineIndex = (e, t2, r, a2, o4, s4, _3, n3, l3, d2, p4, m4) => (_DefineIndex = Module._DefineIndex = wasmExports.DefineIndex)(e, t2, r, a2, o4, s4, _3, n3, l3, d2, p4, m4), _fread = Module._fread = (e, t2, r, a2) => (_fread = Module._fread = wasmExports.fread)(e, t2, r, a2), _clearerr = Module._clearerr = (e) => (_clearerr = Module._clearerr = wasmExports.clearerr)(e), _copyObjectImpl = Module._copyObjectImpl = (e) => (_copyObjectImpl = Module._copyObjectImpl = wasmExports.copyObjectImpl)(e), _lappend_oid = Module._lappend_oid = (e, t2) => (_lappend_oid = Module._lappend_oid = wasmExports.lappend_oid)(e, t2), _makeTypeNameFromNameList = Module._makeTypeNameFromNameList = (e) => (_makeTypeNameFromNameList = Module._makeTypeNameFromNameList = wasmExports.makeTypeNameFromNameList)(e), _get_namespace_oid = Module._get_namespace_oid = (e, t2) => (_get_namespace_oid = Module._get_namespace_oid = wasmExports.get_namespace_oid)(e, t2), _CatalogTupleUpdate = Module._CatalogTupleUpdate = (e, t2, r) => (_CatalogTupleUpdate = Module._CatalogTupleUpdate = wasmExports.CatalogTupleUpdate)(e, t2, r), _get_rel_name = Module._get_rel_name = (e) => (_get_rel_name = Module._get_rel_name = wasmExports.get_rel_name)(e), _CatalogTupleDelete = Module._CatalogTupleDelete = (e, t2) => (_CatalogTupleDelete = Module._CatalogTupleDelete = wasmExports.CatalogTupleDelete)(e, t2), _performDeletion = Module._performDeletion = (e, t2, r) => (_performDeletion = Module._performDeletion = wasmExports.performDeletion)(e, t2, r), _CatalogTupleInsert = Module._CatalogTupleInsert = (e, t2) => (_CatalogTupleInsert = Module._CatalogTupleInsert = wasmExports.CatalogTupleInsert)(e, t2), _recordDependencyOn = Module._recordDependencyOn = (e, t2, r) => (_recordDependencyOn = Module._recordDependencyOn = wasmExports.recordDependencyOn)(e, t2, r), _get_element_type = Module._get_element_type = (e) => (_get_element_type = Module._get_element_type = wasmExports.get_element_type)(e), _object_aclcheck = Module._object_aclcheck = (e, t2, r, a2) => (_object_aclcheck = Module._object_aclcheck = wasmExports.object_aclcheck)(e, t2, r, a2), _isTempNamespace = Module._isTempNamespace = (e) => (_isTempNamespace = Module._isTempNamespace = wasmExports.isTempNamespace)(e), _superuser = Module._superuser = () => (_superuser = Module._superuser = wasmExports.superuser)(), _SearchSysCacheAttName = Module._SearchSysCacheAttName = (e, t2) => (_SearchSysCacheAttName = Module._SearchSysCacheAttName = wasmExports.SearchSysCacheAttName)(e, t2), _new_object_addresses = Module._new_object_addresses = () => (_new_object_addresses = Module._new_object_addresses = wasmExports.new_object_addresses)(), _free_object_addresses = Module._free_object_addresses = (e) => (_free_object_addresses = Module._free_object_addresses = wasmExports.free_object_addresses)(e), _performMultipleDeletions = Module._performMultipleDeletions = (e, t2, r) => (_performMultipleDeletions = Module._performMultipleDeletions = wasmExports.performMultipleDeletions)(e, t2, r), _recordDependencyOnExpr = Module._recordDependencyOnExpr = (e, t2, r, a2) => (_recordDependencyOnExpr = Module._recordDependencyOnExpr = wasmExports.recordDependencyOnExpr)(e, t2, r, a2), _query_tree_walker_impl = Module._query_tree_walker_impl = (e, t2, r, a2) => (_query_tree_walker_impl = Module._query_tree_walker_impl = wasmExports.query_tree_walker_impl)(e, t2, r, a2), _expression_tree_walker_impl = Module._expression_tree_walker_impl = (e, t2, r) => (_expression_tree_walker_impl = Module._expression_tree_walker_impl = wasmExports.expression_tree_walker_impl)(e, t2, r), _add_exact_object_address = Module._add_exact_object_address = (e, t2) => (_add_exact_object_address = Module._add_exact_object_address = wasmExports.add_exact_object_address)(e, t2), _get_rel_relkind = Module._get_rel_relkind = (e) => (_get_rel_relkind = Module._get_rel_relkind = wasmExports.get_rel_relkind)(e), _get_typtype = Module._get_typtype = (e) => (_get_typtype = Module._get_typtype = wasmExports.get_typtype)(e), _list_delete_last = Module._list_delete_last = (e) => (_list_delete_last = Module._list_delete_last = wasmExports.list_delete_last)(e), _type_is_collatable = Module._type_is_collatable = (e) => (_type_is_collatable = Module._type_is_collatable = wasmExports.type_is_collatable)(e), _CatalogOpenIndexes = Module._CatalogOpenIndexes = (e) => (_CatalogOpenIndexes = Module._CatalogOpenIndexes = wasmExports.CatalogOpenIndexes)(e), _CatalogCloseIndexes = Module._CatalogCloseIndexes = (e) => (_CatalogCloseIndexes = Module._CatalogCloseIndexes = wasmExports.CatalogCloseIndexes)(e), _get_relname_relid = Module._get_relname_relid = (e, t2) => (_get_relname_relid = Module._get_relname_relid = wasmExports.get_relname_relid)(e, t2), _GetSysCacheOid = Module._GetSysCacheOid = (e, t2, r, a2, o4, s4) => (_GetSysCacheOid = Module._GetSysCacheOid = wasmExports.GetSysCacheOid)(e, t2, r, a2, o4, s4), _CheckTableNotInUse = Module._CheckTableNotInUse = (e, t2) => (_CheckTableNotInUse = Module._CheckTableNotInUse = wasmExports.CheckTableNotInUse)(e, t2), _construct_array = Module._construct_array = (e, t2, r, a2, o4, s4) => (_construct_array = Module._construct_array = wasmExports.construct_array)(e, t2, r, a2, o4, s4), _make_parsestate = Module._make_parsestate = (e) => (_make_parsestate = Module._make_parsestate = wasmExports.make_parsestate)(e), _addRangeTableEntryForRelation = Module._addRangeTableEntryForRelation = (e, t2, r, a2, o4, s4) => (_addRangeTableEntryForRelation = Module._addRangeTableEntryForRelation = wasmExports.addRangeTableEntryForRelation)(e, t2, r, a2, o4, s4), _addNSItemToQuery = Module._addNSItemToQuery = (e, t2, r, a2, o4) => (_addNSItemToQuery = Module._addNSItemToQuery = wasmExports.addNSItemToQuery)(e, t2, r, a2, o4), _transformExpr = Module._transformExpr = (e, t2, r) => (_transformExpr = Module._transformExpr = wasmExports.transformExpr)(e, t2, r), _coerce_to_boolean = Module._coerce_to_boolean = (e, t2, r) => (_coerce_to_boolean = Module._coerce_to_boolean = wasmExports.coerce_to_boolean)(e, t2, r), _assign_expr_collations = Module._assign_expr_collations = (e, t2) => (_assign_expr_collations = Module._assign_expr_collations = wasmExports.assign_expr_collations)(e, t2), _equal = Module._equal = (e, t2) => (_equal = Module._equal = wasmExports.equal)(e, t2), _pull_var_clause = Module._pull_var_clause = (e, t2) => (_pull_var_clause = Module._pull_var_clause = wasmExports.pull_var_clause)(e, t2), _get_attname = Module._get_attname = (e, t2, r) => (_get_attname = Module._get_attname = wasmExports.get_attname)(e, t2, r), _coerce_to_target_type = Module._coerce_to_target_type = (e, t2, r, a2, o4, s4, _3, n3) => (_coerce_to_target_type = Module._coerce_to_target_type = wasmExports.coerce_to_target_type)(e, t2, r, a2, o4, s4, _3, n3), _nodeToString = Module._nodeToString = (e) => (_nodeToString = Module._nodeToString = wasmExports.nodeToString)(e), _CatalogTupleInsertWithInfo = Module._CatalogTupleInsertWithInfo = (e, t2, r) => (_CatalogTupleInsertWithInfo = Module._CatalogTupleInsertWithInfo = wasmExports.CatalogTupleInsertWithInfo)(e, t2, r), _buildoidvector = Module._buildoidvector = (e, t2) => (_buildoidvector = Module._buildoidvector = wasmExports.buildoidvector)(e, t2), _parser_errposition = Module._parser_errposition = (e, t2) => (_parser_errposition = Module._parser_errposition = wasmExports.parser_errposition)(e, t2), _exprTypmod = Module._exprTypmod = (e) => (_exprTypmod = Module._exprTypmod = wasmExports.exprTypmod)(e), _get_base_element_type = Module._get_base_element_type = (e) => (_get_base_element_type = Module._get_base_element_type = wasmExports.get_base_element_type)(e), _SystemFuncName = Module._SystemFuncName = (e) => (_SystemFuncName = Module._SystemFuncName = wasmExports.SystemFuncName)(e), _CreateTrigger = Module._CreateTrigger = (e, t2, r, a2, o4, s4, _3, n3, l3, d2, p4, m4) => (_CreateTrigger = Module._CreateTrigger = wasmExports.CreateTrigger)(e, t2, r, a2, o4, s4, _3, n3, l3, d2, p4, m4), _plan_create_index_workers = Module._plan_create_index_workers = (e, t2) => (_plan_create_index_workers = Module._plan_create_index_workers = wasmExports.plan_create_index_workers)(e, t2), _tuplesort_begin_datum = Module._tuplesort_begin_datum = (e, t2, r, a2, o4, s4, _3) => (_tuplesort_begin_datum = Module._tuplesort_begin_datum = wasmExports.tuplesort_begin_datum)(e, t2, r, a2, o4, s4, _3), _tuplesort_putdatum = Module._tuplesort_putdatum = (e, t2, r) => (_tuplesort_putdatum = Module._tuplesort_putdatum = wasmExports.tuplesort_putdatum)(e, t2, r), _get_rel_namespace = Module._get_rel_namespace = (e) => (_get_rel_namespace = Module._get_rel_namespace = wasmExports.get_rel_namespace)(e), _ExecOpenIndices = Module._ExecOpenIndices = (e, t2) => (_ExecOpenIndices = Module._ExecOpenIndices = wasmExports.ExecOpenIndices)(e, t2), _ExecCloseIndices = Module._ExecCloseIndices = (e) => (_ExecCloseIndices = Module._ExecCloseIndices = wasmExports.ExecCloseIndices)(e), _ConditionalLockRelationOid = Module._ConditionalLockRelationOid = (e, t2) => (_ConditionalLockRelationOid = Module._ConditionalLockRelationOid = wasmExports.ConditionalLockRelationOid)(e, t2), _RelnameGetRelid = Module._RelnameGetRelid = (e) => (_RelnameGetRelid = Module._RelnameGetRelid = wasmExports.RelnameGetRelid)(e), _get_relkind_objtype = Module._get_relkind_objtype = (e) => (_get_relkind_objtype = Module._get_relkind_objtype = wasmExports.get_relkind_objtype)(e), _RelationIsVisible = Module._RelationIsVisible = (e) => (_RelationIsVisible = Module._RelationIsVisible = wasmExports.RelationIsVisible)(e), _get_func_arg_info = Module._get_func_arg_info = (e, t2, r, a2) => (_get_func_arg_info = Module._get_func_arg_info = wasmExports.get_func_arg_info)(e, t2, r, a2), _NameListToString = Module._NameListToString = (e) => (_NameListToString = Module._NameListToString = wasmExports.NameListToString)(e), _OpernameGetOprid = Module._OpernameGetOprid = (e, t2, r) => (_OpernameGetOprid = Module._OpernameGetOprid = wasmExports.OpernameGetOprid)(e, t2, r), _makeRangeVarFromNameList = Module._makeRangeVarFromNameList = (e) => (_makeRangeVarFromNameList = Module._makeRangeVarFromNameList = wasmExports.makeRangeVarFromNameList)(e), _quote_identifier = Module._quote_identifier = (e) => (_quote_identifier = Module._quote_identifier = wasmExports.quote_identifier)(e), _GetSearchPathMatcher = Module._GetSearchPathMatcher = (e) => (_GetSearchPathMatcher = Module._GetSearchPathMatcher = wasmExports.GetSearchPathMatcher)(e), _SearchPathMatchesCurrentEnvironment = Module._SearchPathMatchesCurrentEnvironment = (e) => (_SearchPathMatchesCurrentEnvironment = Module._SearchPathMatchesCurrentEnvironment = wasmExports.SearchPathMatchesCurrentEnvironment)(e), _get_collation_oid = Module._get_collation_oid = (e, t2) => (_get_collation_oid = Module._get_collation_oid = wasmExports.get_collation_oid)(e, t2), _CacheRegisterSyscacheCallback = Module._CacheRegisterSyscacheCallback = (e, t2, r) => (_CacheRegisterSyscacheCallback = Module._CacheRegisterSyscacheCallback = wasmExports.CacheRegisterSyscacheCallback)(e, t2, r), _fetch_search_path = Module._fetch_search_path = (e) => (_fetch_search_path = Module._fetch_search_path = wasmExports.fetch_search_path)(e), _get_object_address = Module._get_object_address = (e, t2, r, a2, o4, s4) => (_get_object_address = Module._get_object_address = wasmExports.get_object_address)(e, t2, r, a2, o4, s4), _get_extension_oid = Module._get_extension_oid = (e, t2) => (_get_extension_oid = Module._get_extension_oid = wasmExports.get_extension_oid)(e, t2), _get_role_oid = Module._get_role_oid = (e, t2) => (_get_role_oid = Module._get_role_oid = wasmExports.get_role_oid)(e, t2), _GetForeignServerByName = Module._GetForeignServerByName = (e, t2) => (_GetForeignServerByName = Module._GetForeignServerByName = wasmExports.GetForeignServerByName)(e, t2), _typeStringToTypeName = Module._typeStringToTypeName = (e, t2) => (_typeStringToTypeName = Module._typeStringToTypeName = wasmExports.typeStringToTypeName)(e, t2), _makeFloat = Module._makeFloat = (e) => (_makeFloat = Module._makeFloat = wasmExports.makeFloat)(e), _list_make2_impl = Module._list_make2_impl = (e, t2, r) => (_list_make2_impl = Module._list_make2_impl = wasmExports.list_make2_impl)(e, t2, r), _check_object_ownership = Module._check_object_ownership = (e, t2, r, a2, o4) => (_check_object_ownership = Module._check_object_ownership = wasmExports.check_object_ownership)(e, t2, r, a2, o4), _GetUserNameFromId = Module._GetUserNameFromId = (e, t2) => (_GetUserNameFromId = Module._GetUserNameFromId = wasmExports.GetUserNameFromId)(e, t2), _format_type_extended = Module._format_type_extended = (e, t2, r) => (_format_type_extended = Module._format_type_extended = wasmExports.format_type_extended)(e, t2, r), _quote_qualified_identifier = Module._quote_qualified_identifier = (e, t2) => (_quote_qualified_identifier = Module._quote_qualified_identifier = wasmExports.quote_qualified_identifier)(e, t2), _get_tablespace_name = Module._get_tablespace_name = (e) => (_get_tablespace_name = Module._get_tablespace_name = wasmExports.get_tablespace_name)(e), _GetForeignServerExtended = Module._GetForeignServerExtended = (e, t2) => (_GetForeignServerExtended = Module._GetForeignServerExtended = wasmExports.GetForeignServerExtended)(e, t2), _GetForeignServer = Module._GetForeignServer = (e) => (_GetForeignServer = Module._GetForeignServer = wasmExports.GetForeignServer)(e), _get_extension_name = Module._get_extension_name = (e) => (_get_extension_name = Module._get_extension_name = wasmExports.get_extension_name)(e), _construct_empty_array = Module._construct_empty_array = (e) => (_construct_empty_array = Module._construct_empty_array = wasmExports.construct_empty_array)(e), _format_type_be_qualified = Module._format_type_be_qualified = (e) => (_format_type_be_qualified = Module._format_type_be_qualified = wasmExports.format_type_be_qualified)(e), _get_namespace_name_or_temp = Module._get_namespace_name_or_temp = (e) => (_get_namespace_name_or_temp = Module._get_namespace_name_or_temp = wasmExports.get_namespace_name_or_temp)(e), _list_make3_impl = Module._list_make3_impl = (e, t2, r, a2) => (_list_make3_impl = Module._list_make3_impl = wasmExports.list_make3_impl)(e, t2, r, a2), _construct_md_array = Module._construct_md_array = (e, t2, r, a2, o4, s4, _3, n3, l3) => (_construct_md_array = Module._construct_md_array = wasmExports.construct_md_array)(e, t2, r, a2, o4, s4, _3, n3, l3), _pull_varattnos = Module._pull_varattnos = (e, t2, r) => (_pull_varattnos = Module._pull_varattnos = wasmExports.pull_varattnos)(e, t2, r), _makeBoolExpr = Module._makeBoolExpr = (e, t2, r) => (_makeBoolExpr = Module._makeBoolExpr = wasmExports.makeBoolExpr)(e, t2, r), _get_func_name = Module._get_func_name = (e) => (_get_func_name = Module._get_func_name = wasmExports.get_func_name)(e), _construct_array_builtin = Module._construct_array_builtin = (e, t2, r) => (_construct_array_builtin = Module._construct_array_builtin = wasmExports.construct_array_builtin)(e, t2, r), _makeObjectName = Module._makeObjectName = (e, t2, r) => (_makeObjectName = Module._makeObjectName = wasmExports.makeObjectName)(e, t2, r), _get_primary_key_attnos = Module._get_primary_key_attnos = (e, t2, r) => (_get_primary_key_attnos = Module._get_primary_key_attnos = wasmExports.get_primary_key_attnos)(e, t2, r), _check_functional_grouping = Module._check_functional_grouping = (e, t2, r, a2, o4) => (_check_functional_grouping = Module._check_functional_grouping = wasmExports.check_functional_grouping)(e, t2, r, a2, o4), _bms_is_subset = Module._bms_is_subset = (e, t2) => (_bms_is_subset = Module._bms_is_subset = wasmExports.bms_is_subset)(e, t2), _getExtensionOfObject = Module._getExtensionOfObject = (e, t2) => (_getExtensionOfObject = Module._getExtensionOfObject = wasmExports.getExtensionOfObject)(e, t2), _find_inheritance_children = Module._find_inheritance_children = (e, t2) => (_find_inheritance_children = Module._find_inheritance_children = wasmExports.find_inheritance_children)(e, t2), _lappend_int = Module._lappend_int = (e, t2) => (_lappend_int = Module._lappend_int = wasmExports.lappend_int)(e, t2), _has_superclass = Module._has_superclass = (e) => (_has_superclass = Module._has_superclass = wasmExports.has_superclass)(e), _CheckFunctionValidatorAccess = Module._CheckFunctionValidatorAccess = (e, t2) => (_CheckFunctionValidatorAccess = Module._CheckFunctionValidatorAccess = wasmExports.CheckFunctionValidatorAccess)(e, t2), _AcquireRewriteLocks = Module._AcquireRewriteLocks = (e, t2, r) => (_AcquireRewriteLocks = Module._AcquireRewriteLocks = wasmExports.AcquireRewriteLocks)(e, t2, r), _function_parse_error_transpose = Module._function_parse_error_transpose = (e) => (_function_parse_error_transpose = Module._function_parse_error_transpose = wasmExports.function_parse_error_transpose)(e), _geterrposition = Module._geterrposition = () => (_geterrposition = Module._geterrposition = wasmExports.geterrposition)(), _getinternalerrposition = Module._getinternalerrposition = () => (_getinternalerrposition = Module._getinternalerrposition = wasmExports.getinternalerrposition)(), _pg_mblen = Module._pg_mblen = (e) => (_pg_mblen = Module._pg_mblen = wasmExports.pg_mblen)(e), _pg_mbstrlen_with_len = Module._pg_mbstrlen_with_len = (e, t2) => (_pg_mbstrlen_with_len = Module._pg_mbstrlen_with_len = wasmExports.pg_mbstrlen_with_len)(e, t2), _errposition = Module._errposition = (e) => (_errposition = Module._errposition = wasmExports.errposition)(e), _internalerrposition = Module._internalerrposition = (e) => (_internalerrposition = Module._internalerrposition = wasmExports.internalerrposition)(e), _internalerrquery = Module._internalerrquery = (e) => (_internalerrquery = Module._internalerrquery = wasmExports.internalerrquery)(e), _list_delete_nth_cell = Module._list_delete_nth_cell = (e, t2) => (_list_delete_nth_cell = Module._list_delete_nth_cell = wasmExports.list_delete_nth_cell)(e, t2), _get_array_type = Module._get_array_type = (e) => (_get_array_type = Module._get_array_type = wasmExports.get_array_type)(e), _smgrtruncate2 = Module._smgrtruncate2 = (e, t2, r, a2, o4) => (_smgrtruncate2 = Module._smgrtruncate2 = wasmExports.smgrtruncate2)(e, t2, r, a2, o4), _smgrreadv = Module._smgrreadv = (e, t2, r, a2, o4) => (_smgrreadv = Module._smgrreadv = wasmExports.smgrreadv)(e, t2, r, a2, o4), _NewRelationCreateToastTable = Module._NewRelationCreateToastTable = (e, t2) => (_NewRelationCreateToastTable = Module._NewRelationCreateToastTable = wasmExports.NewRelationCreateToastTable)(e, t2), _transformStmt = Module._transformStmt = (e, t2) => (_transformStmt = Module._transformStmt = wasmExports.transformStmt)(e, t2), _free_parsestate = Module._free_parsestate = (e) => (_free_parsestate = Module._free_parsestate = wasmExports.free_parsestate)(e), _makeFromExpr = Module._makeFromExpr = (e, t2) => (_makeFromExpr = Module._makeFromExpr = wasmExports.makeFromExpr)(e, t2), _assign_query_collations = Module._assign_query_collations = (e, t2) => (_assign_query_collations = Module._assign_query_collations = wasmExports.assign_query_collations)(e, t2), _exprLocation = Module._exprLocation = (e) => (_exprLocation = Module._exprLocation = wasmExports.exprLocation)(e), _ParseFuncOrColumn = Module._ParseFuncOrColumn = (e, t2, r, a2, o4, s4, _3) => (_ParseFuncOrColumn = Module._ParseFuncOrColumn = wasmExports.ParseFuncOrColumn)(e, t2, r, a2, o4, s4, _3), _exprCollation = Module._exprCollation = (e) => (_exprCollation = Module._exprCollation = wasmExports.exprCollation)(e), _transformSortClause = Module._transformSortClause = (e, t2, r, a2, o4) => (_transformSortClause = Module._transformSortClause = wasmExports.transformSortClause)(e, t2, r, a2, o4), _transformDistinctClause = Module._transformDistinctClause = (e, t2, r, a2) => (_transformDistinctClause = Module._transformDistinctClause = wasmExports.transformDistinctClause)(e, t2, r, a2), _makeTargetEntry = Module._makeTargetEntry = (e, t2, r, a2) => (_makeTargetEntry = Module._makeTargetEntry = wasmExports.makeTargetEntry)(e, t2, r, a2), _select_common_type = Module._select_common_type = (e, t2, r, a2) => (_select_common_type = Module._select_common_type = wasmExports.select_common_type)(e, t2, r, a2), _coerce_to_common_type = Module._coerce_to_common_type = (e, t2, r, a2) => (_coerce_to_common_type = Module._coerce_to_common_type = wasmExports.coerce_to_common_type)(e, t2, r, a2), _select_common_collation = Module._select_common_collation = (e, t2, r) => (_select_common_collation = Module._select_common_collation = wasmExports.select_common_collation)(e, t2, r), _contain_vars_of_level = Module._contain_vars_of_level = (e, t2) => (_contain_vars_of_level = Module._contain_vars_of_level = wasmExports.contain_vars_of_level)(e, t2), _expandNSItemAttrs = Module._expandNSItemAttrs = (e, t2, r, a2, o4) => (_expandNSItemAttrs = Module._expandNSItemAttrs = wasmExports.expandNSItemAttrs)(e, t2, r, a2, o4), _makeAlias = Module._makeAlias = (e, t2) => (_makeAlias = Module._makeAlias = wasmExports.makeAlias)(e, t2), _addRangeTableEntryForSubquery = Module._addRangeTableEntryForSubquery = (e, t2, r, a2, o4) => (_addRangeTableEntryForSubquery = Module._addRangeTableEntryForSubquery = wasmExports.addRangeTableEntryForSubquery)(e, t2, r, a2, o4), _assign_list_collations = Module._assign_list_collations = (e, t2) => (_assign_list_collations = Module._assign_list_collations = wasmExports.assign_list_collations)(e, t2), _expandNSItemVars = Module._expandNSItemVars = (e, t2, r, a2, o4) => (_expandNSItemVars = Module._expandNSItemVars = wasmExports.expandNSItemVars)(e, t2, r, a2, o4), _markTargetListOrigins = Module._markTargetListOrigins = (e, t2) => (_markTargetListOrigins = Module._markTargetListOrigins = wasmExports.markTargetListOrigins)(e, t2), _addRangeTableEntryForJoin = Module._addRangeTableEntryForJoin = (e, t2, r, a2, o4, s4, _3, n3, l3, d2, p4) => (_addRangeTableEntryForJoin = Module._addRangeTableEntryForJoin = wasmExports.addRangeTableEntryForJoin)(e, t2, r, a2, o4, s4, _3, n3, l3, d2, p4), _list_truncate = Module._list_truncate = (e, t2) => (_list_truncate = Module._list_truncate = wasmExports.list_truncate)(e, t2), _makeVar = Module._makeVar = (e, t2, r, a2, o4, s4) => (_makeVar = Module._makeVar = wasmExports.makeVar)(e, t2, r, a2, o4, s4), _makeNullConst = Module._makeNullConst = (e, t2, r) => (_makeNullConst = Module._makeNullConst = wasmExports.makeNullConst)(e, t2, r), _get_sort_group_operators = Module._get_sort_group_operators = (e, t2, r, a2, o4, s4, _3, n3) => (_get_sort_group_operators = Module._get_sort_group_operators = wasmExports.get_sort_group_operators)(e, t2, r, a2, o4, s4, _3, n3), _locate_var_of_level = Module._locate_var_of_level = (e, t2) => (_locate_var_of_level = Module._locate_var_of_level = wasmExports.locate_var_of_level)(e, t2), _setup_parser_errposition_callback = Module._setup_parser_errposition_callback = (e, t2, r) => (_setup_parser_errposition_callback = Module._setup_parser_errposition_callback = wasmExports.setup_parser_errposition_callback)(e, t2, r), _cancel_parser_errposition_callback = Module._cancel_parser_errposition_callback = (e) => (_cancel_parser_errposition_callback = Module._cancel_parser_errposition_callback = wasmExports.cancel_parser_errposition_callback)(e), _makeBoolean = Module._makeBoolean = (e) => (_makeBoolean = Module._makeBoolean = wasmExports.makeBoolean)(e), _makeInteger = Module._makeInteger = (e) => (_makeInteger = Module._makeInteger = wasmExports.makeInteger)(e), _makeSimpleA_Expr = Module._makeSimpleA_Expr = (e, t2, r, a2, o4) => (_makeSimpleA_Expr = Module._makeSimpleA_Expr = wasmExports.makeSimpleA_Expr)(e, t2, r, a2, o4), _makeTypeName = Module._makeTypeName = (e) => (_makeTypeName = Module._makeTypeName = wasmExports.makeTypeName)(e), _SystemTypeName = Module._SystemTypeName = (e) => (_SystemTypeName = Module._SystemTypeName = wasmExports.SystemTypeName)(e), _makeFuncCall = Module._makeFuncCall = (e, t2, r, a2) => (_makeFuncCall = Module._makeFuncCall = wasmExports.makeFuncCall)(e, t2, r, a2), _makeA_Expr = Module._makeA_Expr = (e, t2, r, a2, o4) => (_makeA_Expr = Module._makeA_Expr = wasmExports.makeA_Expr)(e, t2, r, a2, o4), _list_make4_impl = Module._list_make4_impl = (e, t2, r, a2, o4) => (_list_make4_impl = Module._list_make4_impl = wasmExports.list_make4_impl)(e, t2, r, a2, o4), _addTargetToSortList = Module._addTargetToSortList = (e, t2, r, a2, o4) => (_addTargetToSortList = Module._addTargetToSortList = wasmExports.addTargetToSortList)(e, t2, r, a2, o4), _locate_agg_of_level = Module._locate_agg_of_level = (e, t2) => (_locate_agg_of_level = Module._locate_agg_of_level = wasmExports.locate_agg_of_level)(e, t2), _list_intersection_int = Module._list_intersection_int = (e, t2) => (_list_intersection_int = Module._list_intersection_int = wasmExports.list_intersection_int)(e, t2), _get_sortgroupclause_tle = Module._get_sortgroupclause_tle = (e, t2) => (_get_sortgroupclause_tle = Module._get_sortgroupclause_tle = wasmExports.get_sortgroupclause_tle)(e, t2), _flatten_join_alias_vars = Module._flatten_join_alias_vars = (e, t2, r) => (_flatten_join_alias_vars = Module._flatten_join_alias_vars = wasmExports.flatten_join_alias_vars)(e, t2, r), _list_member_int = Module._list_member_int = (e, t2) => (_list_member_int = Module._list_member_int = wasmExports.list_member_int)(e, t2), _list_union_int = Module._list_union_int = (e, t2) => (_list_union_int = Module._list_union_int = wasmExports.list_union_int)(e, t2), _makeFuncExpr = Module._makeFuncExpr = (e, t2, r, a2, o4, s4) => (_makeFuncExpr = Module._makeFuncExpr = wasmExports.makeFuncExpr)(e, t2, r, a2, o4, s4), _get_rte_attribute_name = Module._get_rte_attribute_name = (e, t2) => (_get_rte_attribute_name = Module._get_rte_attribute_name = wasmExports.get_rte_attribute_name)(e, t2), _checkNameSpaceConflicts = Module._checkNameSpaceConflicts = (e, t2, r) => (_checkNameSpaceConflicts = Module._checkNameSpaceConflicts = wasmExports.checkNameSpaceConflicts)(e, t2, r), _addRangeTableEntryForENR = Module._addRangeTableEntryForENR = (e, t2, r) => (_addRangeTableEntryForENR = Module._addRangeTableEntryForENR = wasmExports.addRangeTableEntryForENR)(e, t2, r), _addRangeTableEntry = Module._addRangeTableEntry = (e, t2, r, a2, o4) => (_addRangeTableEntry = Module._addRangeTableEntry = wasmExports.addRangeTableEntry)(e, t2, r, a2, o4), _FigureColname = Module._FigureColname = (e) => (_FigureColname = Module._FigureColname = wasmExports.FigureColname)(e), _coerce_to_specific_type = Module._coerce_to_specific_type = (e, t2, r, a2) => (_coerce_to_specific_type = Module._coerce_to_specific_type = wasmExports.coerce_to_specific_type)(e, t2, r, a2), _typenameTypeIdAndMod = Module._typenameTypeIdAndMod = (e, t2, r, a2) => (_typenameTypeIdAndMod = Module._typenameTypeIdAndMod = wasmExports.typenameTypeIdAndMod)(e, t2, r, a2), _get_typcollation = Module._get_typcollation = (e) => (_get_typcollation = Module._get_typcollation = wasmExports.get_typcollation)(e), _markNullableIfNeeded = Module._markNullableIfNeeded = (e, t2) => (_markNullableIfNeeded = Module._markNullableIfNeeded = wasmExports.markNullableIfNeeded)(e, t2), _markVarForSelectPriv = Module._markVarForSelectPriv = (e, t2) => (_markVarForSelectPriv = Module._markVarForSelectPriv = wasmExports.markVarForSelectPriv)(e, t2), _coerce_type = Module._coerce_type = (e, t2, r, a2, o4, s4, _3, n3) => (_coerce_type = Module._coerce_type = wasmExports.coerce_type)(e, t2, r, a2, o4, s4, _3, n3), _addRangeTableEntryForFunction = Module._addRangeTableEntryForFunction = (e, t2, r, a2, o4, s4, _3) => (_addRangeTableEntryForFunction = Module._addRangeTableEntryForFunction = wasmExports.addRangeTableEntryForFunction)(e, t2, r, a2, o4, s4, _3), _parserOpenTable = Module._parserOpenTable = (e, t2, r) => (_parserOpenTable = Module._parserOpenTable = wasmExports.parserOpenTable)(e, t2, r), _strip_implicit_coercions = Module._strip_implicit_coercions = (e) => (_strip_implicit_coercions = Module._strip_implicit_coercions = wasmExports.strip_implicit_coercions)(e), _colNameToVar = Module._colNameToVar = (e, t2, r, a2) => (_colNameToVar = Module._colNameToVar = wasmExports.colNameToVar)(e, t2, r, a2), _can_coerce_type = Module._can_coerce_type = (e, t2, r, a2) => (_can_coerce_type = Module._can_coerce_type = wasmExports.can_coerce_type)(e, t2, r, a2), _get_sortgroupref_tle = Module._get_sortgroupref_tle = (e, t2) => (_get_sortgroupref_tle = Module._get_sortgroupref_tle = wasmExports.get_sortgroupref_tle)(e, t2), _assignSortGroupRef = Module._assignSortGroupRef = (e, t2) => (_assignSortGroupRef = Module._assignSortGroupRef = wasmExports.assignSortGroupRef)(e, t2), _targetIsInSortList = Module._targetIsInSortList = (e, t2, r) => (_targetIsInSortList = Module._targetIsInSortList = wasmExports.targetIsInSortList)(e, t2, r), _contain_aggs_of_level = Module._contain_aggs_of_level = (e, t2) => (_contain_aggs_of_level = Module._contain_aggs_of_level = wasmExports.contain_aggs_of_level)(e, t2), _find_coercion_pathway = Module._find_coercion_pathway = (e, t2, r, a2) => (_find_coercion_pathway = Module._find_coercion_pathway = wasmExports.find_coercion_pathway)(e, t2, r, a2), _typeidType = Module._typeidType = (e) => (_typeidType = Module._typeidType = wasmExports.typeidType)(e), _typeTypeCollation = Module._typeTypeCollation = (e) => (_typeTypeCollation = Module._typeTypeCollation = wasmExports.typeTypeCollation)(e), _typeLen = Module._typeLen = (e) => (_typeLen = Module._typeLen = wasmExports.typeLen)(e), _typeByVal = Module._typeByVal = (e) => (_typeByVal = Module._typeByVal = wasmExports.typeByVal)(e), _makeConst = Module._makeConst = (e, t2, r, a2, o4, s4, _3) => (_makeConst = Module._makeConst = wasmExports.makeConst)(e, t2, r, a2, o4, s4, _3), _lookup_rowtype_tupdesc = Module._lookup_rowtype_tupdesc = (e, t2) => (_lookup_rowtype_tupdesc = Module._lookup_rowtype_tupdesc = wasmExports.lookup_rowtype_tupdesc)(e, t2), _verify_common_type = Module._verify_common_type = (e, t2) => (_verify_common_type = Module._verify_common_type = wasmExports.verify_common_type)(e, t2), _bms_del_member = Module._bms_del_member = (e, t2) => (_bms_del_member = Module._bms_del_member = wasmExports.bms_del_member)(e, t2), _list_member = Module._list_member = (e, t2) => (_list_member = Module._list_member = wasmExports.list_member)(e, t2), _raw_expression_tree_walker_impl = Module._raw_expression_tree_walker_impl = (e, t2, r) => (_raw_expression_tree_walker_impl = Module._raw_expression_tree_walker_impl = wasmExports.raw_expression_tree_walker_impl)(e, t2, r), _type_is_rowtype = Module._type_is_rowtype = (e) => (_type_is_rowtype = Module._type_is_rowtype = wasmExports.type_is_rowtype)(e), _refnameNamespaceItem = Module._refnameNamespaceItem = (e, t2, r, a2, o4) => (_refnameNamespaceItem = Module._refnameNamespaceItem = wasmExports.refnameNamespaceItem)(e, t2, r, a2, o4), _scanNSItemForColumn = Module._scanNSItemForColumn = (e, t2, r, a2, o4) => (_scanNSItemForColumn = Module._scanNSItemForColumn = wasmExports.scanNSItemForColumn)(e, t2, r, a2, o4), _make_op = Module._make_op = (e, t2, r, a2, o4, s4) => (_make_op = Module._make_op = wasmExports.make_op)(e, t2, r, a2, o4, s4), _make_scalar_array_op = Module._make_scalar_array_op = (e, t2, r, a2, o4, s4) => (_make_scalar_array_op = Module._make_scalar_array_op = wasmExports.make_scalar_array_op)(e, t2, r, a2, o4, s4), _count_nonjunk_tlist_entries = Module._count_nonjunk_tlist_entries = (e) => (_count_nonjunk_tlist_entries = Module._count_nonjunk_tlist_entries = wasmExports.count_nonjunk_tlist_entries)(e), _makeWholeRowVar = Module._makeWholeRowVar = (e, t2, r, a2) => (_makeWholeRowVar = Module._makeWholeRowVar = wasmExports.makeWholeRowVar)(e, t2, r, a2), _expandRTE = Module._expandRTE = (e, t2, r, a2, o4, s4, _3) => (_expandRTE = Module._expandRTE = wasmExports.expandRTE)(e, t2, r, a2, o4, s4, _3), _geterrcode = Module._geterrcode = () => (_geterrcode = Module._geterrcode = wasmExports.geterrcode)(), _bit_in = Module._bit_in = (e) => (_bit_in = Module._bit_in = wasmExports.bit_in)(e), _bms_union = Module._bms_union = (e, t2) => (_bms_union = Module._bms_union = wasmExports.bms_union)(e, t2), _varstr_levenshtein_less_equal = Module._varstr_levenshtein_less_equal = (e, t2, r, a2, o4, s4, _3, n3, l3) => (_varstr_levenshtein_less_equal = Module._varstr_levenshtein_less_equal = wasmExports.varstr_levenshtein_less_equal)(e, t2, r, a2, o4, s4, _3, n3, l3), _errsave_start = Module._errsave_start = (e, t2) => (_errsave_start = Module._errsave_start = wasmExports.errsave_start)(e, t2), _errsave_finish = Module._errsave_finish = (e, t2, r, a2) => (_errsave_finish = Module._errsave_finish = wasmExports.errsave_finish)(e, t2, r, a2), _makeColumnDef = Module._makeColumnDef = (e, t2, r, a2) => (_makeColumnDef = Module._makeColumnDef = wasmExports.makeColumnDef)(e, t2, r, a2), _GetDefaultOpClass = Module._GetDefaultOpClass = (e, t2) => (_GetDefaultOpClass = Module._GetDefaultOpClass = wasmExports.GetDefaultOpClass)(e, t2), _ChooseRelationName = Module._ChooseRelationName = (e, t2, r, a2, o4) => (_ChooseRelationName = Module._ChooseRelationName = wasmExports.ChooseRelationName)(e, t2, r, a2, o4), _scanner_init = Module._scanner_init = (e, t2, r, a2) => (_scanner_init = Module._scanner_init = wasmExports.scanner_init)(e, t2, r, a2), _scanner_finish = Module._scanner_finish = (e) => (_scanner_finish = Module._scanner_finish = wasmExports.scanner_finish)(e), _core_yylex = Module._core_yylex = (e, t2, r) => (_core_yylex = Module._core_yylex = wasmExports.core_yylex)(e, t2, r), _isxdigit = Module._isxdigit = (e) => (_isxdigit = Module._isxdigit = wasmExports.isxdigit)(e), _scanner_isspace = Module._scanner_isspace = (e) => (_scanner_isspace = Module._scanner_isspace = wasmExports.scanner_isspace)(e), _truncate_identifier = Module._truncate_identifier = (e, t2, r) => (_truncate_identifier = Module._truncate_identifier = wasmExports.truncate_identifier)(e, t2, r), _downcase_truncate_identifier = Module._downcase_truncate_identifier = (e, t2, r) => (_downcase_truncate_identifier = Module._downcase_truncate_identifier = wasmExports.downcase_truncate_identifier)(e, t2, r), _pg_database_encoding_max_length = Module._pg_database_encoding_max_length = () => (_pg_database_encoding_max_length = Module._pg_database_encoding_max_length = wasmExports.pg_database_encoding_max_length)(), _RenameSchema = Module._RenameSchema = (e, t2, r) => (_RenameSchema = Module._RenameSchema = wasmExports.RenameSchema)(e, t2, r), _namein = Module._namein = (e) => (_namein = Module._namein = wasmExports.namein)(e), _BlockSampler_Init = Module._BlockSampler_Init = (e, t2, r, a2) => (_BlockSampler_Init = Module._BlockSampler_Init = wasmExports.BlockSampler_Init)(e, t2, r, a2), _reservoir_init_selection_state = Module._reservoir_init_selection_state = (e, t2) => (_reservoir_init_selection_state = Module._reservoir_init_selection_state = wasmExports.reservoir_init_selection_state)(e, t2), _reservoir_get_next_S = Module._reservoir_get_next_S = (e, t2, r) => (_reservoir_get_next_S = Module._reservoir_get_next_S = wasmExports.reservoir_get_next_S)(e, t2, r), _sampler_random_fract = Module._sampler_random_fract = (e) => (_sampler_random_fract = Module._sampler_random_fract = wasmExports.sampler_random_fract)(e), _BlockSampler_HasMore = Module._BlockSampler_HasMore = (e) => (_BlockSampler_HasMore = Module._BlockSampler_HasMore = wasmExports.BlockSampler_HasMore)(e), _BlockSampler_Next = Module._BlockSampler_Next = (e) => (_BlockSampler_Next = Module._BlockSampler_Next = wasmExports.BlockSampler_Next)(e), _Async_Notify = Module._Async_Notify = (e, t2) => (_Async_Notify = Module._Async_Notify = wasmExports.Async_Notify)(e, t2), _RangeVarCallbackMaintainsTable = Module._RangeVarCallbackMaintainsTable = (e, t2, r, a2) => (_RangeVarCallbackMaintainsTable = Module._RangeVarCallbackMaintainsTable = wasmExports.RangeVarCallbackMaintainsTable)(e, t2, r, a2), _make_new_heap = Module._make_new_heap = (e, t2, r, a2, o4) => (_make_new_heap = Module._make_new_heap = wasmExports.make_new_heap)(e, t2, r, a2, o4), _finish_heap_swap = Module._finish_heap_swap = (e, t2, r, a2, o4, s4, _3, n3, l3) => (_finish_heap_swap = Module._finish_heap_swap = wasmExports.finish_heap_swap)(e, t2, r, a2, o4, s4, _3, n3, l3), _wasm_OpenPipeStream = Module._wasm_OpenPipeStream = (e, t2) => (_wasm_OpenPipeStream = Module._wasm_OpenPipeStream = wasmExports.wasm_OpenPipeStream)(e, t2), _ClosePipeStream = Module._ClosePipeStream = (e) => (_ClosePipeStream = Module._ClosePipeStream = wasmExports.ClosePipeStream)(e), _BeginCopyFrom = Module._BeginCopyFrom = (e, t2, r, a2, o4, s4, _3, n3) => (_BeginCopyFrom = Module._BeginCopyFrom = wasmExports.BeginCopyFrom)(e, t2, r, a2, o4, s4, _3, n3), _EndCopyFrom = Module._EndCopyFrom = (e) => (_EndCopyFrom = Module._EndCopyFrom = wasmExports.EndCopyFrom)(e), _ProcessCopyOptions = Module._ProcessCopyOptions = (e, t2, r, a2) => (_ProcessCopyOptions = Module._ProcessCopyOptions = wasmExports.ProcessCopyOptions)(e, t2, r, a2), _CopyFromErrorCallback = Module._CopyFromErrorCallback = (e) => (_CopyFromErrorCallback = Module._CopyFromErrorCallback = wasmExports.CopyFromErrorCallback)(e), _ExecInitRangeTable = Module._ExecInitRangeTable = (e, t2, r) => (_ExecInitRangeTable = Module._ExecInitRangeTable = wasmExports.ExecInitRangeTable)(e, t2, r), _ExecInitResultRelation = Module._ExecInitResultRelation = (e, t2, r) => (_ExecInitResultRelation = Module._ExecInitResultRelation = wasmExports.ExecInitResultRelation)(e, t2, r), _ExecInitQual = Module._ExecInitQual = (e, t2) => (_ExecInitQual = Module._ExecInitQual = wasmExports.ExecInitQual)(e, t2), _NextCopyFrom = Module._NextCopyFrom = (e, t2, r, a2) => (_NextCopyFrom = Module._NextCopyFrom = wasmExports.NextCopyFrom)(e, t2, r, a2), _ExecCloseResultRelations = Module._ExecCloseResultRelations = (e) => (_ExecCloseResultRelations = Module._ExecCloseResultRelations = wasmExports.ExecCloseResultRelations)(e), _ExecCloseRangeTableRelations = Module._ExecCloseRangeTableRelations = (e) => (_ExecCloseRangeTableRelations = Module._ExecCloseRangeTableRelations = wasmExports.ExecCloseRangeTableRelations)(e), _ExecConstraints = Module._ExecConstraints = (e, t2, r) => (_ExecConstraints = Module._ExecConstraints = wasmExports.ExecConstraints)(e, t2, r), _ExecInsertIndexTuples = Module._ExecInsertIndexTuples = (e, t2, r, a2, o4, s4, _3, n3) => (_ExecInsertIndexTuples = Module._ExecInsertIndexTuples = wasmExports.ExecInsertIndexTuples)(e, t2, r, a2, o4, s4, _3, n3), _build_column_default = Module._build_column_default = (e, t2) => (_build_column_default = Module._build_column_default = wasmExports.build_column_default)(e, t2), _ExecInitExpr = Module._ExecInitExpr = (e, t2) => (_ExecInitExpr = Module._ExecInitExpr = wasmExports.ExecInitExpr)(e, t2), _NextCopyFromRawFields = Module._NextCopyFromRawFields = (e, t2, r) => (_NextCopyFromRawFields = Module._NextCopyFromRawFields = wasmExports.NextCopyFromRawFields)(e, t2, r), _tolower = Module._tolower = (e) => (_tolower = Module._tolower = wasmExports.tolower)(e), _PushCopiedSnapshot = Module._PushCopiedSnapshot = (e) => (_PushCopiedSnapshot = Module._PushCopiedSnapshot = wasmExports.PushCopiedSnapshot)(e), _UpdateActiveSnapshotCommandId = Module._UpdateActiveSnapshotCommandId = () => (_UpdateActiveSnapshotCommandId = Module._UpdateActiveSnapshotCommandId = wasmExports.UpdateActiveSnapshotCommandId)(), _CreateQueryDesc = Module._CreateQueryDesc = (e, t2, r, a2, o4, s4, _3, n3) => (_CreateQueryDesc = Module._CreateQueryDesc = wasmExports.CreateQueryDesc)(e, t2, r, a2, o4, s4, _3, n3), _ExecutorStart = Module._ExecutorStart = (e, t2) => (_ExecutorStart = Module._ExecutorStart = wasmExports.ExecutorStart)(e, t2), _ExecutorFinish = Module._ExecutorFinish = (e) => (_ExecutorFinish = Module._ExecutorFinish = wasmExports.ExecutorFinish)(e), _ExecutorEnd = Module._ExecutorEnd = (e) => (_ExecutorEnd = Module._ExecutorEnd = wasmExports.ExecutorEnd)(e), _FreeQueryDesc = Module._FreeQueryDesc = (e) => (_FreeQueryDesc = Module._FreeQueryDesc = wasmExports.FreeQueryDesc)(e), _pg_server_to_any = Module._pg_server_to_any = (e, t2, r) => (_pg_server_to_any = Module._pg_server_to_any = wasmExports.pg_server_to_any)(e, t2, r), _ExecutorRun = Module._ExecutorRun = (e, t2, r, a2) => (_ExecutorRun = Module._ExecutorRun = wasmExports.ExecutorRun)(e, t2, r, a2), _CreateTableAsRelExists = Module._CreateTableAsRelExists = (e) => (_CreateTableAsRelExists = Module._CreateTableAsRelExists = wasmExports.CreateTableAsRelExists)(e), _DefineRelation = Module._DefineRelation = (e, t2, r, a2, o4, s4) => (_DefineRelation = Module._DefineRelation = wasmExports.DefineRelation)(e, t2, r, a2, o4, s4), _atof = Module._atof = (e) => (_atof = Module._atof = wasmExports.atof)(e), _int8in = Module._int8in = (e) => (_int8in = Module._int8in = wasmExports.int8in)(e), _oidin = Module._oidin = (e) => (_oidin = Module._oidin = wasmExports.oidin)(e), _RemoveObjects = Module._RemoveObjects = (e) => (_RemoveObjects = Module._RemoveObjects = wasmExports.RemoveObjects)(e), _GetCommandTagName = Module._GetCommandTagName = (e) => (_GetCommandTagName = Module._GetCommandTagName = wasmExports.GetCommandTagName)(e), _ExplainBeginOutput = Module._ExplainBeginOutput = (e) => (_ExplainBeginOutput = Module._ExplainBeginOutput = wasmExports.ExplainBeginOutput)(e), _NewExplainState = Module._NewExplainState = () => (_NewExplainState = Module._NewExplainState = wasmExports.NewExplainState)(), _ExplainEndOutput = Module._ExplainEndOutput = (e) => (_ExplainEndOutput = Module._ExplainEndOutput = wasmExports.ExplainEndOutput)(e), _ExplainPrintPlan = Module._ExplainPrintPlan = (e, t2) => (_ExplainPrintPlan = Module._ExplainPrintPlan = wasmExports.ExplainPrintPlan)(e, t2), _ExplainPrintTriggers = Module._ExplainPrintTriggers = (e, t2) => (_ExplainPrintTriggers = Module._ExplainPrintTriggers = wasmExports.ExplainPrintTriggers)(e, t2), _ExplainPrintJITSummary = Module._ExplainPrintJITSummary = (e, t2) => (_ExplainPrintJITSummary = Module._ExplainPrintJITSummary = wasmExports.ExplainPrintJITSummary)(e, t2), _InstrEndLoop = Module._InstrEndLoop = (e) => (_InstrEndLoop = Module._InstrEndLoop = wasmExports.InstrEndLoop)(e), _ExplainPropertyInteger = Module._ExplainPropertyInteger = (e, t2, r, a2) => (_ExplainPropertyInteger = Module._ExplainPropertyInteger = wasmExports.ExplainPropertyInteger)(e, t2, r, a2), _ExplainQueryText = Module._ExplainQueryText = (e, t2) => (_ExplainQueryText = Module._ExplainQueryText = wasmExports.ExplainQueryText)(e, t2), _ExplainPropertyText = Module._ExplainPropertyText = (e, t2, r) => (_ExplainPropertyText = Module._ExplainPropertyText = wasmExports.ExplainPropertyText)(e, t2, r), _ExplainQueryParameters = Module._ExplainQueryParameters = (e, t2, r) => (_ExplainQueryParameters = Module._ExplainQueryParameters = wasmExports.ExplainQueryParameters)(e, t2, r), _get_func_namespace = Module._get_func_namespace = (e) => (_get_func_namespace = Module._get_func_namespace = wasmExports.get_func_namespace)(e), _CreateSchemaCommand = Module._CreateSchemaCommand = (e, t2, r, a2) => (_CreateSchemaCommand = Module._CreateSchemaCommand = wasmExports.CreateSchemaCommand)(e, t2, r, a2), _get_rel_type_id = Module._get_rel_type_id = (e) => (_get_rel_type_id = Module._get_rel_type_id = wasmExports.get_rel_type_id)(e), _set_config_option = Module._set_config_option = (e, t2, r, a2, o4, s4, _3, n3) => (_set_config_option = Module._set_config_option = wasmExports.set_config_option)(e, t2, r, a2, o4, s4, _3, n3), _pg_any_to_server = Module._pg_any_to_server = (e, t2, r) => (_pg_any_to_server = Module._pg_any_to_server = wasmExports.pg_any_to_server)(e, t2, r), _DirectFunctionCall4Coll = Module._DirectFunctionCall4Coll = (e, t2, r, a2, o4, s4) => (_DirectFunctionCall4Coll = Module._DirectFunctionCall4Coll = wasmExports.DirectFunctionCall4Coll)(e, t2, r, a2, o4, s4), _replace_text = Module._replace_text = (e) => (_replace_text = Module._replace_text = wasmExports.replace_text)(e), _ProcessUtility = Module._ProcessUtility = (e, t2, r, a2, o4, s4, _3, n3) => (_ProcessUtility = Module._ProcessUtility = wasmExports.ProcessUtility)(e, t2, r, a2, o4, s4, _3, n3), _list_delete_cell = Module._list_delete_cell = (e, t2) => (_list_delete_cell = Module._list_delete_cell = wasmExports.list_delete_cell)(e, t2), _GetForeignDataWrapper = Module._GetForeignDataWrapper = (e) => (_GetForeignDataWrapper = Module._GetForeignDataWrapper = wasmExports.GetForeignDataWrapper)(e), _CreateExprContext = Module._CreateExprContext = (e) => (_CreateExprContext = Module._CreateExprContext = wasmExports.CreateExprContext)(e), _EnsurePortalSnapshotExists = Module._EnsurePortalSnapshotExists = () => (_EnsurePortalSnapshotExists = Module._EnsurePortalSnapshotExists = wasmExports.EnsurePortalSnapshotExists)(), _CheckIndexCompatible = Module._CheckIndexCompatible = (e, t2, r, a2) => (_CheckIndexCompatible = Module._CheckIndexCompatible = wasmExports.CheckIndexCompatible)(e, t2, r, a2), _pgstat_count_truncate = Module._pgstat_count_truncate = (e) => (_pgstat_count_truncate = Module._pgstat_count_truncate = wasmExports.pgstat_count_truncate)(e), _SPI_connect = Module._SPI_connect = () => (_SPI_connect = Module._SPI_connect = wasmExports.SPI_connect)(), _SPI_exec = Module._SPI_exec = (e, t2) => (_SPI_exec = Module._SPI_exec = wasmExports.SPI_exec)(e, t2), _SPI_execute = Module._SPI_execute = (e, t2, r) => (_SPI_execute = Module._SPI_execute = wasmExports.SPI_execute)(e, t2, r), _SPI_getvalue = Module._SPI_getvalue = (e, t2, r) => (_SPI_getvalue = Module._SPI_getvalue = wasmExports.SPI_getvalue)(e, t2, r), _generate_operator_clause = Module._generate_operator_clause = (e, t2, r, a2, o4, s4) => (_generate_operator_clause = Module._generate_operator_clause = wasmExports.generate_operator_clause)(e, t2, r, a2, o4, s4), _SPI_finish = Module._SPI_finish = () => (_SPI_finish = Module._SPI_finish = wasmExports.SPI_finish)(), _CreateTransientRelDestReceiver = Module._CreateTransientRelDestReceiver = (e) => (_CreateTransientRelDestReceiver = Module._CreateTransientRelDestReceiver = wasmExports.CreateTransientRelDestReceiver)(e), _MemoryContextSetIdentifier = Module._MemoryContextSetIdentifier = (e, t2) => (_MemoryContextSetIdentifier = Module._MemoryContextSetIdentifier = wasmExports.MemoryContextSetIdentifier)(e, t2), _checkExprHasSubLink = Module._checkExprHasSubLink = (e) => (_checkExprHasSubLink = Module._checkExprHasSubLink = wasmExports.checkExprHasSubLink)(e), _SetTuplestoreDestReceiverParams = Module._SetTuplestoreDestReceiverParams = (e, t2, r, a2, o4, s4) => (_SetTuplestoreDestReceiverParams = Module._SetTuplestoreDestReceiverParams = wasmExports.SetTuplestoreDestReceiverParams)(e, t2, r, a2, o4, s4), _tuplestore_rescan = Module._tuplestore_rescan = (e) => (_tuplestore_rescan = Module._tuplestore_rescan = wasmExports.tuplestore_rescan)(e), _MemoryContextDeleteChildren = Module._MemoryContextDeleteChildren = (e) => (_MemoryContextDeleteChildren = Module._MemoryContextDeleteChildren = wasmExports.MemoryContextDeleteChildren)(e), _ReleaseCachedPlan = Module._ReleaseCachedPlan = (e, t2) => (_ReleaseCachedPlan = Module._ReleaseCachedPlan = wasmExports.ReleaseCachedPlan)(e, t2), _DefineSequence = Module._DefineSequence = (e, t2, r) => (_DefineSequence = Module._DefineSequence = wasmExports.DefineSequence)(e, t2, r), _AlterSequence = Module._AlterSequence = (e, t2, r) => (_AlterSequence = Module._AlterSequence = wasmExports.AlterSequence)(e, t2, r), _nextval = Module._nextval = (e) => (_nextval = Module._nextval = wasmExports.nextval)(e), _textToQualifiedNameList = Module._textToQualifiedNameList = (e) => (_textToQualifiedNameList = Module._textToQualifiedNameList = wasmExports.textToQualifiedNameList)(e), _nextval_internal = Module._nextval_internal = (e, t2) => (_nextval_internal = Module._nextval_internal = wasmExports.nextval_internal)(e, t2), _setval_oid = Module._setval_oid = (e) => (_setval_oid = Module._setval_oid = wasmExports.setval_oid)(e), _tuplestore_gettupleslot = Module._tuplestore_gettupleslot = (e, t2, r, a2) => (_tuplestore_gettupleslot = Module._tuplestore_gettupleslot = wasmExports.tuplestore_gettupleslot)(e, t2, r, a2), _list_delete = Module._list_delete = (e, t2) => (_list_delete = Module._list_delete = wasmExports.list_delete)(e, t2), _tuplestore_end = Module._tuplestore_end = (e) => (_tuplestore_end = Module._tuplestore_end = wasmExports.tuplestore_end)(e), _list_append_unique = Module._list_append_unique = (e, t2) => (_list_append_unique = Module._list_append_unique = wasmExports.list_append_unique)(e, t2), _quote_literal_cstr = Module._quote_literal_cstr = (e) => (_quote_literal_cstr = Module._quote_literal_cstr = wasmExports.quote_literal_cstr)(e), _contain_mutable_functions = Module._contain_mutable_functions = (e) => (_contain_mutable_functions = Module._contain_mutable_functions = wasmExports.contain_mutable_functions)(e), _RemoveRelations = Module._RemoveRelations = (e) => (_RemoveRelations = Module._RemoveRelations = wasmExports.RemoveRelations)(e), _ExecuteTruncateGuts = Module._ExecuteTruncateGuts = (e, t2, r, a2, o4, s4) => (_ExecuteTruncateGuts = Module._ExecuteTruncateGuts = wasmExports.ExecuteTruncateGuts)(e, t2, r, a2, o4, s4), _InitResultRelInfo = Module._InitResultRelInfo = (e, t2, r, a2, o4) => (_InitResultRelInfo = Module._InitResultRelInfo = wasmExports.InitResultRelInfo)(e, t2, r, a2, o4), _AlterTable = Module._AlterTable = (e, t2, r) => (_AlterTable = Module._AlterTable = wasmExports.AlterTable)(e, t2, r), _bms_make_singleton = Module._bms_make_singleton = (e) => (_bms_make_singleton = Module._bms_make_singleton = wasmExports.bms_make_singleton)(e), _ChangeVarNodes = Module._ChangeVarNodes = (e, t2, r, a2) => (_ChangeVarNodes = Module._ChangeVarNodes = wasmExports.ChangeVarNodes)(e, t2, r, a2), _tuplestore_puttupleslot = Module._tuplestore_puttupleslot = (e, t2) => (_tuplestore_puttupleslot = Module._tuplestore_puttupleslot = wasmExports.tuplestore_puttupleslot)(e, t2), _tuplestore_begin_heap = Module._tuplestore_begin_heap = (e, t2, r) => (_tuplestore_begin_heap = Module._tuplestore_begin_heap = wasmExports.tuplestore_begin_heap)(e, t2, r), _ExecForceStoreHeapTuple = Module._ExecForceStoreHeapTuple = (e, t2, r) => (_ExecForceStoreHeapTuple = Module._ExecForceStoreHeapTuple = wasmExports.ExecForceStoreHeapTuple)(e, t2, r), _ExecUpdateLockMode = Module._ExecUpdateLockMode = (e, t2) => (_ExecUpdateLockMode = Module._ExecUpdateLockMode = wasmExports.ExecUpdateLockMode)(e, t2), _strtod = Module._strtod = (e, t2) => (_strtod = Module._strtod = wasmExports.strtod)(e, t2), _plain_crypt_verify = Module._plain_crypt_verify = (e, t2, r, a2) => (_plain_crypt_verify = Module._plain_crypt_verify = wasmExports.plain_crypt_verify)(e, t2, r, a2), _ProcessConfigFile = Module._ProcessConfigFile = (e) => (_ProcessConfigFile = Module._ProcessConfigFile = wasmExports.ProcessConfigFile)(e), _ExecReScan = Module._ExecReScan = (e) => (_ExecReScan = Module._ExecReScan = wasmExports.ExecReScan)(e), _ExecAsyncResponse = Module._ExecAsyncResponse = (e) => (_ExecAsyncResponse = Module._ExecAsyncResponse = wasmExports.ExecAsyncResponse)(e), _ExecAsyncRequestDone = Module._ExecAsyncRequestDone = (e, t2) => (_ExecAsyncRequestDone = Module._ExecAsyncRequestDone = wasmExports.ExecAsyncRequestDone)(e, t2), _ExecAsyncRequestPending = Module._ExecAsyncRequestPending = (e) => (_ExecAsyncRequestPending = Module._ExecAsyncRequestPending = wasmExports.ExecAsyncRequestPending)(e), _ExprEvalPushStep = Module._ExprEvalPushStep = (e, t2) => (_ExprEvalPushStep = Module._ExprEvalPushStep = wasmExports.ExprEvalPushStep)(e, t2), _ExecInitExprWithParams = Module._ExecInitExprWithParams = (e, t2) => (_ExecInitExprWithParams = Module._ExecInitExprWithParams = wasmExports.ExecInitExprWithParams)(e, t2), _ExecInitExprList = Module._ExecInitExprList = (e, t2) => (_ExecInitExprList = Module._ExecInitExprList = wasmExports.ExecInitExprList)(e, t2), _ExecGetResultType = Module._ExecGetResultType = (e) => (_ExecGetResultType = Module._ExecGetResultType = wasmExports.ExecGetResultType)(e), _ExecInitExtraTupleSlot = Module._ExecInitExtraTupleSlot = (e, t2, r) => (_ExecInitExtraTupleSlot = Module._ExecInitExtraTupleSlot = wasmExports.ExecInitExtraTupleSlot)(e, t2, r), _MakeExpandedObjectReadOnlyInternal = Module._MakeExpandedObjectReadOnlyInternal = (e) => (_MakeExpandedObjectReadOnlyInternal = Module._MakeExpandedObjectReadOnlyInternal = wasmExports.MakeExpandedObjectReadOnlyInternal)(e), _tuplesort_puttupleslot = Module._tuplesort_puttupleslot = (e, t2) => (_tuplesort_puttupleslot = Module._tuplesort_puttupleslot = wasmExports.tuplesort_puttupleslot)(e, t2), _ArrayGetNItems = Module._ArrayGetNItems = (e, t2) => (_ArrayGetNItems = Module._ArrayGetNItems = wasmExports.ArrayGetNItems)(e, t2), _expanded_record_fetch_tupdesc = Module._expanded_record_fetch_tupdesc = (e) => (_expanded_record_fetch_tupdesc = Module._expanded_record_fetch_tupdesc = wasmExports.expanded_record_fetch_tupdesc)(e), _expanded_record_fetch_field = Module._expanded_record_fetch_field = (e, t2, r) => (_expanded_record_fetch_field = Module._expanded_record_fetch_field = wasmExports.expanded_record_fetch_field)(e, t2, r), _json_validate = Module._json_validate = (e, t2, r) => (_json_validate = Module._json_validate = wasmExports.json_validate)(e, t2, r), _JsonbValueToJsonb = Module._JsonbValueToJsonb = (e) => (_JsonbValueToJsonb = Module._JsonbValueToJsonb = wasmExports.JsonbValueToJsonb)(e), _numeric_out = Module._numeric_out = (e) => (_numeric_out = Module._numeric_out = wasmExports.numeric_out)(e), _boolout = Module._boolout = (e) => (_boolout = Module._boolout = wasmExports.boolout)(e), _bool_int4 = Module._bool_int4 = (e) => (_bool_int4 = Module._bool_int4 = wasmExports.bool_int4)(e), _lookup_rowtype_tupdesc_domain = Module._lookup_rowtype_tupdesc_domain = (e, t2, r) => (_lookup_rowtype_tupdesc_domain = Module._lookup_rowtype_tupdesc_domain = wasmExports.lookup_rowtype_tupdesc_domain)(e, t2, r), _MemoryContextGetParent = Module._MemoryContextGetParent = (e) => (_MemoryContextGetParent = Module._MemoryContextGetParent = wasmExports.MemoryContextGetParent)(e), _DeleteExpandedObject = Module._DeleteExpandedObject = (e) => (_DeleteExpandedObject = Module._DeleteExpandedObject = wasmExports.DeleteExpandedObject)(e), _ExecFindJunkAttributeInTlist = Module._ExecFindJunkAttributeInTlist = (e, t2) => (_ExecFindJunkAttributeInTlist = Module._ExecFindJunkAttributeInTlist = wasmExports.ExecFindJunkAttributeInTlist)(e, t2), _standard_ExecutorStart = Module._standard_ExecutorStart = (e, t2) => (_standard_ExecutorStart = Module._standard_ExecutorStart = wasmExports.standard_ExecutorStart)(e, t2), _ExecInitNode = Module._ExecInitNode = (e, t2, r) => (_ExecInitNode = Module._ExecInitNode = wasmExports.ExecInitNode)(e, t2, r), _standard_ExecutorRun = Module._standard_ExecutorRun = (e, t2, r, a2) => (_standard_ExecutorRun = Module._standard_ExecutorRun = wasmExports.standard_ExecutorRun)(e, t2, r, a2), _standard_ExecutorFinish = Module._standard_ExecutorFinish = (e) => (_standard_ExecutorFinish = Module._standard_ExecutorFinish = wasmExports.standard_ExecutorFinish)(e), _standard_ExecutorEnd = Module._standard_ExecutorEnd = (e) => (_standard_ExecutorEnd = Module._standard_ExecutorEnd = wasmExports.standard_ExecutorEnd)(e), _ExecEndNode = Module._ExecEndNode = (e) => (_ExecEndNode = Module._ExecEndNode = wasmExports.ExecEndNode)(e), _InstrAlloc = Module._InstrAlloc = (e, t2, r) => (_InstrAlloc = Module._InstrAlloc = wasmExports.InstrAlloc)(e, t2, r), _MakeTupleTableSlot = Module._MakeTupleTableSlot = (e, t2) => (_MakeTupleTableSlot = Module._MakeTupleTableSlot = wasmExports.MakeTupleTableSlot)(e, t2), _ExecWithCheckOptions = Module._ExecWithCheckOptions = (e, t2, r, a2) => (_ExecWithCheckOptions = Module._ExecWithCheckOptions = wasmExports.ExecWithCheckOptions)(e, t2, r, a2), _get_typlenbyval = Module._get_typlenbyval = (e, t2, r) => (_get_typlenbyval = Module._get_typlenbyval = wasmExports.get_typlenbyval)(e, t2, r), _ExecAssignExprContext = Module._ExecAssignExprContext = (e, t2) => (_ExecAssignExprContext = Module._ExecAssignExprContext = wasmExports.ExecAssignExprContext)(e, t2), _ExecInitScanTupleSlot = Module._ExecInitScanTupleSlot = (e, t2, r, a2) => (_ExecInitScanTupleSlot = Module._ExecInitScanTupleSlot = wasmExports.ExecInitScanTupleSlot)(e, t2, r, a2), _InputFunctionCall = Module._InputFunctionCall = (e, t2, r, a2) => (_InputFunctionCall = Module._InputFunctionCall = wasmExports.InputFunctionCall)(e, t2, r, a2), _list_delete_ptr = Module._list_delete_ptr = (e, t2) => (_list_delete_ptr = Module._list_delete_ptr = wasmExports.list_delete_ptr)(e, t2), _FreeExprContext = Module._FreeExprContext = (e, t2) => (_FreeExprContext = Module._FreeExprContext = wasmExports.FreeExprContext)(e, t2), _ExecAssignProjectionInfo = Module._ExecAssignProjectionInfo = (e, t2) => (_ExecAssignProjectionInfo = Module._ExecAssignProjectionInfo = wasmExports.ExecAssignProjectionInfo)(e, t2), _ExecOpenScanRelation = Module._ExecOpenScanRelation = (e, t2, r) => (_ExecOpenScanRelation = Module._ExecOpenScanRelation = wasmExports.ExecOpenScanRelation)(e, t2, r), _bms_intersect = Module._bms_intersect = (e, t2) => (_bms_intersect = Module._bms_intersect = wasmExports.bms_intersect)(e, t2), _ExecGetReturningSlot = Module._ExecGetReturningSlot = (e, t2) => (_ExecGetReturningSlot = Module._ExecGetReturningSlot = wasmExports.ExecGetReturningSlot)(e, t2), _ExecGetResultRelCheckAsUser = Module._ExecGetResultRelCheckAsUser = (e, t2) => (_ExecGetResultRelCheckAsUser = Module._ExecGetResultRelCheckAsUser = wasmExports.ExecGetResultRelCheckAsUser)(e, t2), _get_call_expr_argtype = Module._get_call_expr_argtype = (e, t2) => (_get_call_expr_argtype = Module._get_call_expr_argtype = wasmExports.get_call_expr_argtype)(e, t2), _tuplestore_clear = Module._tuplestore_clear = (e) => (_tuplestore_clear = Module._tuplestore_clear = wasmExports.tuplestore_clear)(e), _InstrUpdateTupleCount = Module._InstrUpdateTupleCount = (e, t2) => (_InstrUpdateTupleCount = Module._InstrUpdateTupleCount = wasmExports.InstrUpdateTupleCount)(e, t2), _tuplesort_begin_heap = Module._tuplesort_begin_heap = (e, t2, r, a2, o4, s4, _3, n3, l3) => (_tuplesort_begin_heap = Module._tuplesort_begin_heap = wasmExports.tuplesort_begin_heap)(e, t2, r, a2, o4, s4, _3, n3, l3), _tuplesort_gettupleslot = Module._tuplesort_gettupleslot = (e, t2, r, a2, o4) => (_tuplesort_gettupleslot = Module._tuplesort_gettupleslot = wasmExports.tuplesort_gettupleslot)(e, t2, r, a2, o4), _AddWaitEventToSet = Module._AddWaitEventToSet = (e, t2, r, a2, o4) => (_AddWaitEventToSet = Module._AddWaitEventToSet = wasmExports.AddWaitEventToSet)(e, t2, r, a2, o4), _GetNumRegisteredWaitEvents = Module._GetNumRegisteredWaitEvents = (e) => (_GetNumRegisteredWaitEvents = Module._GetNumRegisteredWaitEvents = wasmExports.GetNumRegisteredWaitEvents)(e), _get_attstatsslot = Module._get_attstatsslot = (e, t2, r, a2, o4) => (_get_attstatsslot = Module._get_attstatsslot = wasmExports.get_attstatsslot)(e, t2, r, a2, o4), _free_attstatsslot = Module._free_attstatsslot = (e) => (_free_attstatsslot = Module._free_attstatsslot = wasmExports.free_attstatsslot)(e), _tuplesort_reset = Module._tuplesort_reset = (e) => (_tuplesort_reset = Module._tuplesort_reset = wasmExports.tuplesort_reset)(e), _pairingheap_first = Module._pairingheap_first = (e) => (_pairingheap_first = Module._pairingheap_first = wasmExports.pairingheap_first)(e), _bms_nonempty_difference = Module._bms_nonempty_difference = (e, t2) => (_bms_nonempty_difference = Module._bms_nonempty_difference = wasmExports.bms_nonempty_difference)(e, t2), _datum_image_hash = Module._datum_image_hash = (e, t2, r) => (_datum_image_hash = Module._datum_image_hash = wasmExports.datum_image_hash)(e, t2, r), _tuplesort_rescan = Module._tuplesort_rescan = (e) => (_tuplesort_rescan = Module._tuplesort_rescan = wasmExports.tuplesort_rescan)(e), _SPI_connect_ext = Module._SPI_connect_ext = (e) => (_SPI_connect_ext = Module._SPI_connect_ext = wasmExports.SPI_connect_ext)(e), _SPI_commit = Module._SPI_commit = () => (_SPI_commit = Module._SPI_commit = wasmExports.SPI_commit)(), _CopyErrorData = Module._CopyErrorData = () => (_CopyErrorData = Module._CopyErrorData = wasmExports.CopyErrorData)(), _ReThrowError = Module._ReThrowError = (e) => (_ReThrowError = Module._ReThrowError = wasmExports.ReThrowError)(e), _SPI_commit_and_chain = Module._SPI_commit_and_chain = () => (_SPI_commit_and_chain = Module._SPI_commit_and_chain = wasmExports.SPI_commit_and_chain)(), _SPI_rollback = Module._SPI_rollback = () => (_SPI_rollback = Module._SPI_rollback = wasmExports.SPI_rollback)(), _SPI_rollback_and_chain = Module._SPI_rollback_and_chain = () => (_SPI_rollback_and_chain = Module._SPI_rollback_and_chain = wasmExports.SPI_rollback_and_chain)(), _SPI_freetuptable = Module._SPI_freetuptable = (e) => (_SPI_freetuptable = Module._SPI_freetuptable = wasmExports.SPI_freetuptable)(e), _SPI_execute_extended = Module._SPI_execute_extended = (e, t2) => (_SPI_execute_extended = Module._SPI_execute_extended = wasmExports.SPI_execute_extended)(e, t2), _SPI_execute_plan = Module._SPI_execute_plan = (e, t2, r, a2, o4) => (_SPI_execute_plan = Module._SPI_execute_plan = wasmExports.SPI_execute_plan)(e, t2, r, a2, o4), _SPI_execp = Module._SPI_execp = (e, t2, r, a2) => (_SPI_execp = Module._SPI_execp = wasmExports.SPI_execp)(e, t2, r, a2), _SPI_execute_plan_extended = Module._SPI_execute_plan_extended = (e, t2) => (_SPI_execute_plan_extended = Module._SPI_execute_plan_extended = wasmExports.SPI_execute_plan_extended)(e, t2), _SPI_execute_plan_with_paramlist = Module._SPI_execute_plan_with_paramlist = (e, t2, r, a2) => (_SPI_execute_plan_with_paramlist = Module._SPI_execute_plan_with_paramlist = wasmExports.SPI_execute_plan_with_paramlist)(e, t2, r, a2), _SPI_prepare = Module._SPI_prepare = (e, t2, r) => (_SPI_prepare = Module._SPI_prepare = wasmExports.SPI_prepare)(e, t2, r), _SPI_prepare_extended = Module._SPI_prepare_extended = (e, t2) => (_SPI_prepare_extended = Module._SPI_prepare_extended = wasmExports.SPI_prepare_extended)(e, t2), _SPI_keepplan = Module._SPI_keepplan = (e) => (_SPI_keepplan = Module._SPI_keepplan = wasmExports.SPI_keepplan)(e), _SPI_freeplan = Module._SPI_freeplan = (e) => (_SPI_freeplan = Module._SPI_freeplan = wasmExports.SPI_freeplan)(e), _SPI_copytuple = Module._SPI_copytuple = (e) => (_SPI_copytuple = Module._SPI_copytuple = wasmExports.SPI_copytuple)(e), _SPI_returntuple = Module._SPI_returntuple = (e, t2) => (_SPI_returntuple = Module._SPI_returntuple = wasmExports.SPI_returntuple)(e, t2), _SPI_fnumber = Module._SPI_fnumber = (e, t2) => (_SPI_fnumber = Module._SPI_fnumber = wasmExports.SPI_fnumber)(e, t2), _SPI_fname = Module._SPI_fname = (e, t2) => (_SPI_fname = Module._SPI_fname = wasmExports.SPI_fname)(e, t2), _SPI_getbinval = Module._SPI_getbinval = (e, t2, r, a2) => (_SPI_getbinval = Module._SPI_getbinval = wasmExports.SPI_getbinval)(e, t2, r, a2), _SPI_gettype = Module._SPI_gettype = (e, t2) => (_SPI_gettype = Module._SPI_gettype = wasmExports.SPI_gettype)(e, t2), _SPI_gettypeid = Module._SPI_gettypeid = (e, t2) => (_SPI_gettypeid = Module._SPI_gettypeid = wasmExports.SPI_gettypeid)(e, t2), _SPI_getrelname = Module._SPI_getrelname = (e) => (_SPI_getrelname = Module._SPI_getrelname = wasmExports.SPI_getrelname)(e), _SPI_palloc = Module._SPI_palloc = (e) => (_SPI_palloc = Module._SPI_palloc = wasmExports.SPI_palloc)(e), _SPI_datumTransfer = Module._SPI_datumTransfer = (e, t2, r) => (_SPI_datumTransfer = Module._SPI_datumTransfer = wasmExports.SPI_datumTransfer)(e, t2, r), _datumTransfer = Module._datumTransfer = (e, t2, r) => (_datumTransfer = Module._datumTransfer = wasmExports.datumTransfer)(e, t2, r), _SPI_cursor_open_with_paramlist = Module._SPI_cursor_open_with_paramlist = (e, t2, r, a2) => (_SPI_cursor_open_with_paramlist = Module._SPI_cursor_open_with_paramlist = wasmExports.SPI_cursor_open_with_paramlist)(e, t2, r, a2), _SPI_cursor_parse_open = Module._SPI_cursor_parse_open = (e, t2, r) => (_SPI_cursor_parse_open = Module._SPI_cursor_parse_open = wasmExports.SPI_cursor_parse_open)(e, t2, r), _SPI_cursor_find = Module._SPI_cursor_find = (e) => (_SPI_cursor_find = Module._SPI_cursor_find = wasmExports.SPI_cursor_find)(e), _SPI_cursor_fetch = Module._SPI_cursor_fetch = (e, t2, r) => (_SPI_cursor_fetch = Module._SPI_cursor_fetch = wasmExports.SPI_cursor_fetch)(e, t2, r), _SPI_scroll_cursor_fetch = Module._SPI_scroll_cursor_fetch = (e, t2, r) => (_SPI_scroll_cursor_fetch = Module._SPI_scroll_cursor_fetch = wasmExports.SPI_scroll_cursor_fetch)(e, t2, r), _SPI_scroll_cursor_move = Module._SPI_scroll_cursor_move = (e, t2, r) => (_SPI_scroll_cursor_move = Module._SPI_scroll_cursor_move = wasmExports.SPI_scroll_cursor_move)(e, t2, r), _SPI_cursor_close = Module._SPI_cursor_close = (e) => (_SPI_cursor_close = Module._SPI_cursor_close = wasmExports.SPI_cursor_close)(e), _SPI_plan_is_valid = Module._SPI_plan_is_valid = (e) => (_SPI_plan_is_valid = Module._SPI_plan_is_valid = wasmExports.SPI_plan_is_valid)(e), _SPI_result_code_string = Module._SPI_result_code_string = (e) => (_SPI_result_code_string = Module._SPI_result_code_string = wasmExports.SPI_result_code_string)(e), _SPI_plan_get_plan_sources = Module._SPI_plan_get_plan_sources = (e) => (_SPI_plan_get_plan_sources = Module._SPI_plan_get_plan_sources = wasmExports.SPI_plan_get_plan_sources)(e), _SPI_plan_get_cached_plan = Module._SPI_plan_get_cached_plan = (e) => (_SPI_plan_get_cached_plan = Module._SPI_plan_get_cached_plan = wasmExports.SPI_plan_get_cached_plan)(e), _SPI_register_relation = Module._SPI_register_relation = (e) => (_SPI_register_relation = Module._SPI_register_relation = wasmExports.SPI_register_relation)(e), _create_queryEnv = Module._create_queryEnv = () => (_create_queryEnv = Module._create_queryEnv = wasmExports.create_queryEnv)(), _register_ENR = Module._register_ENR = (e, t2) => (_register_ENR = Module._register_ENR = wasmExports.register_ENR)(e, t2), _SPI_register_trigger_data = Module._SPI_register_trigger_data = (e) => (_SPI_register_trigger_data = Module._SPI_register_trigger_data = wasmExports.SPI_register_trigger_data)(e), _tuplestore_tuple_count = Module._tuplestore_tuple_count = (e) => (_tuplestore_tuple_count = Module._tuplestore_tuple_count = wasmExports.tuplestore_tuple_count)(e), _GetUserMapping = Module._GetUserMapping = (e, t2) => (_GetUserMapping = Module._GetUserMapping = wasmExports.GetUserMapping)(e, t2), _GetForeignTable = Module._GetForeignTable = (e) => (_GetForeignTable = Module._GetForeignTable = wasmExports.GetForeignTable)(e), _GetForeignColumnOptions = Module._GetForeignColumnOptions = (e, t2) => (_GetForeignColumnOptions = Module._GetForeignColumnOptions = wasmExports.GetForeignColumnOptions)(e, t2), _initClosestMatch = Module._initClosestMatch = (e, t2, r) => (_initClosestMatch = Module._initClosestMatch = wasmExports.initClosestMatch)(e, t2, r), _updateClosestMatch = Module._updateClosestMatch = (e, t2) => (_updateClosestMatch = Module._updateClosestMatch = wasmExports.updateClosestMatch)(e, t2), _getClosestMatch = Module._getClosestMatch = (e) => (_getClosestMatch = Module._getClosestMatch = wasmExports.getClosestMatch)(e), _GetExistingLocalJoinPath = Module._GetExistingLocalJoinPath = (e) => (_GetExistingLocalJoinPath = Module._GetExistingLocalJoinPath = wasmExports.GetExistingLocalJoinPath)(e), _bloom_create = Module._bloom_create = (e, t2, r) => (_bloom_create = Module._bloom_create = wasmExports.bloom_create)(e, t2, r), _bloom_free = Module._bloom_free = (e) => (_bloom_free = Module._bloom_free = wasmExports.bloom_free)(e), _bloom_add_element = Module._bloom_add_element = (e, t2, r) => (_bloom_add_element = Module._bloom_add_element = wasmExports.bloom_add_element)(e, t2, r), _bloom_lacks_element = Module._bloom_lacks_element = (e, t2, r) => (_bloom_lacks_element = Module._bloom_lacks_element = wasmExports.bloom_lacks_element)(e, t2, r), _bloom_prop_bits_set = Module._bloom_prop_bits_set = (e) => (_bloom_prop_bits_set = Module._bloom_prop_bits_set = wasmExports.bloom_prop_bits_set)(e), _gai_strerror = Module._gai_strerror = (e) => (_gai_strerror = Module._gai_strerror = wasmExports.gai_strerror)(e), _socket = Module._socket = (e, t2, r) => (_socket = Module._socket = wasmExports.socket)(e, t2, r), _connect = Module._connect = (e, t2, r) => (_connect = Module._connect = wasmExports.connect)(e, t2, r), _send = Module._send = (e, t2, r, a2) => (_send = Module._send = wasmExports.send)(e, t2, r, a2), _recv = Module._recv = (e, t2, r, a2) => (_recv = Module._recv = wasmExports.recv)(e, t2, r, a2), _be_lo_unlink = Module._be_lo_unlink = (e) => (_be_lo_unlink = Module._be_lo_unlink = wasmExports.be_lo_unlink)(e), _text_to_cstring_buffer = Module._text_to_cstring_buffer = (e, t2, r) => (_text_to_cstring_buffer = Module._text_to_cstring_buffer = wasmExports.text_to_cstring_buffer)(e, t2, r), _set_read_write_cbs = Module._set_read_write_cbs = (e, t2) => (_set_read_write_cbs = Module._set_read_write_cbs = wasmExports.set_read_write_cbs)(e, t2), _setsockopt = Module._setsockopt = (e, t2, r, a2, o4) => (_setsockopt = Module._setsockopt = wasmExports.setsockopt)(e, t2, r, a2, o4), _getsockopt = Module._getsockopt = (e, t2, r, a2, o4) => (_getsockopt = Module._getsockopt = wasmExports.getsockopt)(e, t2, r, a2, o4), _getsockname = Module._getsockname = (e, t2, r) => (_getsockname = Module._getsockname = wasmExports.getsockname)(e, t2, r), _poll = Module._poll = (e, t2, r) => (_poll = Module._poll = wasmExports.poll)(e, t2, r), _pg_mb2wchar_with_len = Module._pg_mb2wchar_with_len = (e, t2, r) => (_pg_mb2wchar_with_len = Module._pg_mb2wchar_with_len = wasmExports.pg_mb2wchar_with_len)(e, t2, r), _pg_regcomp = Module._pg_regcomp = (e, t2, r, a2, o4) => (_pg_regcomp = Module._pg_regcomp = wasmExports.pg_regcomp)(e, t2, r, a2, o4), _pg_regerror = Module._pg_regerror = (e, t2, r, a2) => (_pg_regerror = Module._pg_regerror = wasmExports.pg_regerror)(e, t2, r, a2), _strcat = Module._strcat = (e, t2) => (_strcat = Module._strcat = wasmExports.strcat)(e, t2), _pq_sendtext = Module._pq_sendtext = (e, t2, r) => (_pq_sendtext = Module._pq_sendtext = wasmExports.pq_sendtext)(e, t2, r), _pq_sendfloat4 = Module._pq_sendfloat4 = (e, t2) => (_pq_sendfloat4 = Module._pq_sendfloat4 = wasmExports.pq_sendfloat4)(e, t2), _pq_sendfloat8 = Module._pq_sendfloat8 = (e, t2) => (_pq_sendfloat8 = Module._pq_sendfloat8 = wasmExports.pq_sendfloat8)(e, t2), _pq_begintypsend = Module._pq_begintypsend = (e) => (_pq_begintypsend = Module._pq_begintypsend = wasmExports.pq_begintypsend)(e), _pq_endtypsend = Module._pq_endtypsend = (e) => (_pq_endtypsend = Module._pq_endtypsend = wasmExports.pq_endtypsend)(e), _pq_getmsgfloat4 = Module._pq_getmsgfloat4 = (e) => (_pq_getmsgfloat4 = Module._pq_getmsgfloat4 = wasmExports.pq_getmsgfloat4)(e), _pq_getmsgfloat8 = Module._pq_getmsgfloat8 = (e) => (_pq_getmsgfloat8 = Module._pq_getmsgfloat8 = wasmExports.pq_getmsgfloat8)(e), _pq_getmsgtext = Module._pq_getmsgtext = (e, t2, r) => (_pq_getmsgtext = Module._pq_getmsgtext = wasmExports.pq_getmsgtext)(e, t2, r), _pg_strtoint32 = Module._pg_strtoint32 = (e) => (_pg_strtoint32 = Module._pg_strtoint32 = wasmExports.pg_strtoint32)(e), _bms_membership = Module._bms_membership = (e) => (_bms_membership = Module._bms_membership = wasmExports.bms_membership)(e), _RegisterExtensibleNodeMethods = Module._RegisterExtensibleNodeMethods = (e) => (_RegisterExtensibleNodeMethods = Module._RegisterExtensibleNodeMethods = wasmExports.RegisterExtensibleNodeMethods)(e), _list_make5_impl = Module._list_make5_impl = (e, t2, r, a2, o4, s4) => (_list_make5_impl = Module._list_make5_impl = wasmExports.list_make5_impl)(e, t2, r, a2, o4, s4), _list_insert_nth = Module._list_insert_nth = (e, t2, r) => (_list_insert_nth = Module._list_insert_nth = wasmExports.list_insert_nth)(e, t2, r), _list_member_ptr = Module._list_member_ptr = (e, t2) => (_list_member_ptr = Module._list_member_ptr = wasmExports.list_member_ptr)(e, t2), _list_append_unique_ptr = Module._list_append_unique_ptr = (e, t2) => (_list_append_unique_ptr = Module._list_append_unique_ptr = wasmExports.list_append_unique_ptr)(e, t2), _make_opclause = Module._make_opclause = (e, t2, r, a2, o4, s4, _3) => (_make_opclause = Module._make_opclause = wasmExports.make_opclause)(e, t2, r, a2, o4, s4, _3), _exprIsLengthCoercion = Module._exprIsLengthCoercion = (e, t2) => (_exprIsLengthCoercion = Module._exprIsLengthCoercion = wasmExports.exprIsLengthCoercion)(e, t2), _fix_opfuncids = Module._fix_opfuncids = (e) => (_fix_opfuncids = Module._fix_opfuncids = wasmExports.fix_opfuncids)(e), _outToken = Module._outToken = (e, t2) => (_outToken = Module._outToken = wasmExports.outToken)(e, t2), _outNode = Module._outNode = (e, t2) => (_outNode = Module._outNode = wasmExports.outNode)(e, t2), _CleanQuerytext = Module._CleanQuerytext = (e, t2, r) => (_CleanQuerytext = Module._CleanQuerytext = wasmExports.CleanQuerytext)(e, t2, r), _EnableQueryId = Module._EnableQueryId = () => (_EnableQueryId = Module._EnableQueryId = wasmExports.EnableQueryId)(), _nodeRead = Module._nodeRead = (e, t2) => (_nodeRead = Module._nodeRead = wasmExports.nodeRead)(e, t2), _pg_strtok = Module._pg_strtok = (e) => (_pg_strtok = Module._pg_strtok = wasmExports.pg_strtok)(e), _debackslash = Module._debackslash = (e, t2) => (_debackslash = Module._debackslash = wasmExports.debackslash)(e, t2), _find_base_rel = Module._find_base_rel = (e, t2) => (_find_base_rel = Module._find_base_rel = wasmExports.find_base_rel)(e, t2), _add_path = Module._add_path = (e, t2) => (_add_path = Module._add_path = wasmExports.add_path)(e, t2), _pathkeys_contained_in = Module._pathkeys_contained_in = (e, t2) => (_pathkeys_contained_in = Module._pathkeys_contained_in = wasmExports.pathkeys_contained_in)(e, t2), _create_sort_path = Module._create_sort_path = (e, t2, r, a2, o4) => (_create_sort_path = Module._create_sort_path = wasmExports.create_sort_path)(e, t2, r, a2, o4), _set_baserel_size_estimates = Module._set_baserel_size_estimates = (e, t2) => (_set_baserel_size_estimates = Module._set_baserel_size_estimates = wasmExports.set_baserel_size_estimates)(e, t2), _clauselist_selectivity = Module._clauselist_selectivity = (e, t2, r, a2, o4) => (_clauselist_selectivity = Module._clauselist_selectivity = wasmExports.clauselist_selectivity)(e, t2, r, a2, o4), _get_tablespace_page_costs = Module._get_tablespace_page_costs = (e, t2, r) => (_get_tablespace_page_costs = Module._get_tablespace_page_costs = wasmExports.get_tablespace_page_costs)(e, t2, r), _cost_qual_eval = Module._cost_qual_eval = (e, t2, r) => (_cost_qual_eval = Module._cost_qual_eval = wasmExports.cost_qual_eval)(e, t2, r), _estimate_num_groups = Module._estimate_num_groups = (e, t2, r, a2, o4) => (_estimate_num_groups = Module._estimate_num_groups = wasmExports.estimate_num_groups)(e, t2, r, a2, o4), _cost_sort = Module._cost_sort = (e, t2, r, a2, o4, s4, _3, n3, l3) => (_cost_sort = Module._cost_sort = wasmExports.cost_sort)(e, t2, r, a2, o4, s4, _3, n3, l3), _get_sortgrouplist_exprs = Module._get_sortgrouplist_exprs = (e, t2) => (_get_sortgrouplist_exprs = Module._get_sortgrouplist_exprs = wasmExports.get_sortgrouplist_exprs)(e, t2), _make_restrictinfo = Module._make_restrictinfo = (e, t2, r, a2, o4, s4, _3, n3, l3, d2) => (_make_restrictinfo = Module._make_restrictinfo = wasmExports.make_restrictinfo)(e, t2, r, a2, o4, s4, _3, n3, l3, d2), _generate_implied_equalities_for_column = Module._generate_implied_equalities_for_column = (e, t2, r, a2, o4) => (_generate_implied_equalities_for_column = Module._generate_implied_equalities_for_column = wasmExports.generate_implied_equalities_for_column)(e, t2, r, a2, o4), _eclass_useful_for_merging = Module._eclass_useful_for_merging = (e, t2, r) => (_eclass_useful_for_merging = Module._eclass_useful_for_merging = wasmExports.eclass_useful_for_merging)(e, t2, r), _join_clause_is_movable_to = Module._join_clause_is_movable_to = (e, t2) => (_join_clause_is_movable_to = Module._join_clause_is_movable_to = wasmExports.join_clause_is_movable_to)(e, t2), _get_plan_rowmark = Module._get_plan_rowmark = (e, t2) => (_get_plan_rowmark = Module._get_plan_rowmark = wasmExports.get_plan_rowmark)(e, t2), _update_mergeclause_eclasses = Module._update_mergeclause_eclasses = (e, t2) => (_update_mergeclause_eclasses = Module._update_mergeclause_eclasses = wasmExports.update_mergeclause_eclasses)(e, t2), _find_join_rel = Module._find_join_rel = (e, t2) => (_find_join_rel = Module._find_join_rel = wasmExports.find_join_rel)(e, t2), _make_canonical_pathkey = Module._make_canonical_pathkey = (e, t2, r, a2, o4) => (_make_canonical_pathkey = Module._make_canonical_pathkey = wasmExports.make_canonical_pathkey)(e, t2, r, a2, o4), _get_sortgroupref_clause_noerr = Module._get_sortgroupref_clause_noerr = (e, t2) => (_get_sortgroupref_clause_noerr = Module._get_sortgroupref_clause_noerr = wasmExports.get_sortgroupref_clause_noerr)(e, t2), _extract_actual_clauses = Module._extract_actual_clauses = (e, t2) => (_extract_actual_clauses = Module._extract_actual_clauses = wasmExports.extract_actual_clauses)(e, t2), _change_plan_targetlist = Module._change_plan_targetlist = (e, t2, r) => (_change_plan_targetlist = Module._change_plan_targetlist = wasmExports.change_plan_targetlist)(e, t2, r), _make_foreignscan = Module._make_foreignscan = (e, t2, r, a2, o4, s4, _3, n3) => (_make_foreignscan = Module._make_foreignscan = wasmExports.make_foreignscan)(e, t2, r, a2, o4, s4, _3, n3), _tlist_member = Module._tlist_member = (e, t2) => (_tlist_member = Module._tlist_member = wasmExports.tlist_member)(e, t2), _pull_vars_of_level = Module._pull_vars_of_level = (e, t2) => (_pull_vars_of_level = Module._pull_vars_of_level = wasmExports.pull_vars_of_level)(e, t2), _IncrementVarSublevelsUp = Module._IncrementVarSublevelsUp = (e, t2, r) => (_IncrementVarSublevelsUp = Module._IncrementVarSublevelsUp = wasmExports.IncrementVarSublevelsUp)(e, t2, r), _standard_planner = Module._standard_planner = (e, t2, r, a2) => (_standard_planner = Module._standard_planner = wasmExports.standard_planner)(e, t2, r, a2), _get_relids_in_jointree = Module._get_relids_in_jointree = (e, t2, r) => (_get_relids_in_jointree = Module._get_relids_in_jointree = wasmExports.get_relids_in_jointree)(e, t2, r), _SS_process_sublinks = Module._SS_process_sublinks = (e, t2, r) => (_SS_process_sublinks = Module._SS_process_sublinks = wasmExports.SS_process_sublinks)(e, t2, r), _add_new_columns_to_pathtarget = Module._add_new_columns_to_pathtarget = (e, t2) => (_add_new_columns_to_pathtarget = Module._add_new_columns_to_pathtarget = wasmExports.add_new_columns_to_pathtarget)(e, t2), _get_agg_clause_costs = Module._get_agg_clause_costs = (e, t2, r) => (_get_agg_clause_costs = Module._get_agg_clause_costs = wasmExports.get_agg_clause_costs)(e, t2, r), _grouping_is_sortable = Module._grouping_is_sortable = (e) => (_grouping_is_sortable = Module._grouping_is_sortable = wasmExports.grouping_is_sortable)(e), _copy_pathtarget = Module._copy_pathtarget = (e) => (_copy_pathtarget = Module._copy_pathtarget = wasmExports.copy_pathtarget)(e), _create_projection_path = Module._create_projection_path = (e, t2, r, a2) => (_create_projection_path = Module._create_projection_path = wasmExports.create_projection_path)(e, t2, r, a2), _GetSysCacheHashValue = Module._GetSysCacheHashValue = (e, t2, r, a2, o4) => (_GetSysCacheHashValue = Module._GetSysCacheHashValue = wasmExports.GetSysCacheHashValue)(e, t2, r, a2, o4), _get_translated_update_targetlist = Module._get_translated_update_targetlist = (e, t2, r, a2) => (_get_translated_update_targetlist = Module._get_translated_update_targetlist = wasmExports.get_translated_update_targetlist)(e, t2, r, a2), _add_row_identity_var = Module._add_row_identity_var = (e, t2, r, a2) => (_add_row_identity_var = Module._add_row_identity_var = wasmExports.add_row_identity_var)(e, t2, r, a2), _get_rel_all_updated_cols = Module._get_rel_all_updated_cols = (e, t2) => (_get_rel_all_updated_cols = Module._get_rel_all_updated_cols = wasmExports.get_rel_all_updated_cols)(e, t2), _get_baserel_parampathinfo = Module._get_baserel_parampathinfo = (e, t2, r) => (_get_baserel_parampathinfo = Module._get_baserel_parampathinfo = wasmExports.get_baserel_parampathinfo)(e, t2, r), _create_foreignscan_path = Module._create_foreignscan_path = (e, t2, r, a2, o4, s4, _3, n3, l3, d2, p4) => (_create_foreignscan_path = Module._create_foreignscan_path = wasmExports.create_foreignscan_path)(e, t2, r, a2, o4, s4, _3, n3, l3, d2, p4), _create_foreign_join_path = Module._create_foreign_join_path = (e, t2, r, a2, o4, s4, _3, n3, l3, d2, p4) => (_create_foreign_join_path = Module._create_foreign_join_path = wasmExports.create_foreign_join_path)(e, t2, r, a2, o4, s4, _3, n3, l3, d2, p4), _create_foreign_upper_path = Module._create_foreign_upper_path = (e, t2, r, a2, o4, s4, _3, n3, l3, d2) => (_create_foreign_upper_path = Module._create_foreign_upper_path = wasmExports.create_foreign_upper_path)(e, t2, r, a2, o4, s4, _3, n3, l3, d2), _adjust_limit_rows_costs = Module._adjust_limit_rows_costs = (e, t2, r, a2, o4) => (_adjust_limit_rows_costs = Module._adjust_limit_rows_costs = wasmExports.adjust_limit_rows_costs)(e, t2, r, a2, o4), _add_to_flat_tlist = Module._add_to_flat_tlist = (e, t2) => (_add_to_flat_tlist = Module._add_to_flat_tlist = wasmExports.add_to_flat_tlist)(e, t2), _get_fn_expr_variadic = Module._get_fn_expr_variadic = (e) => (_get_fn_expr_variadic = Module._get_fn_expr_variadic = wasmExports.get_fn_expr_variadic)(e), _get_fn_expr_argtype = Module._get_fn_expr_argtype = (e, t2) => (_get_fn_expr_argtype = Module._get_fn_expr_argtype = wasmExports.get_fn_expr_argtype)(e, t2), _on_shmem_exit = Module._on_shmem_exit = (e, t2) => (_on_shmem_exit = Module._on_shmem_exit = wasmExports.on_shmem_exit)(e, t2), _SignalHandlerForConfigReload = Module._SignalHandlerForConfigReload = (e) => (_SignalHandlerForConfigReload = Module._SignalHandlerForConfigReload = wasmExports.SignalHandlerForConfigReload)(e), _SignalHandlerForShutdownRequest = Module._SignalHandlerForShutdownRequest = (e) => (_SignalHandlerForShutdownRequest = Module._SignalHandlerForShutdownRequest = wasmExports.SignalHandlerForShutdownRequest)(e), _procsignal_sigusr1_handler = Module._procsignal_sigusr1_handler = (e) => (_procsignal_sigusr1_handler = Module._procsignal_sigusr1_handler = wasmExports.procsignal_sigusr1_handler)(e), _RegisterBackgroundWorker = Module._RegisterBackgroundWorker = (e) => (_RegisterBackgroundWorker = Module._RegisterBackgroundWorker = wasmExports.RegisterBackgroundWorker)(e), _WaitForBackgroundWorkerStartup = Module._WaitForBackgroundWorkerStartup = (e, t2) => (_WaitForBackgroundWorkerStartup = Module._WaitForBackgroundWorkerStartup = wasmExports.WaitForBackgroundWorkerStartup)(e, t2), _GetConfigOption = Module._GetConfigOption = (e, t2, r) => (_GetConfigOption = Module._GetConfigOption = wasmExports.GetConfigOption)(e, t2, r), _toupper = Module._toupper = (e) => (_toupper = Module._toupper = wasmExports.toupper)(e), _pg_reg_getinitialstate = Module._pg_reg_getinitialstate = (e) => (_pg_reg_getinitialstate = Module._pg_reg_getinitialstate = wasmExports.pg_reg_getinitialstate)(e), _pg_reg_getfinalstate = Module._pg_reg_getfinalstate = (e) => (_pg_reg_getfinalstate = Module._pg_reg_getfinalstate = wasmExports.pg_reg_getfinalstate)(e), _pg_reg_getnumoutarcs = Module._pg_reg_getnumoutarcs = (e, t2) => (_pg_reg_getnumoutarcs = Module._pg_reg_getnumoutarcs = wasmExports.pg_reg_getnumoutarcs)(e, t2), _pg_reg_getoutarcs = Module._pg_reg_getoutarcs = (e, t2, r, a2) => (_pg_reg_getoutarcs = Module._pg_reg_getoutarcs = wasmExports.pg_reg_getoutarcs)(e, t2, r, a2), _pg_reg_getnumcolors = Module._pg_reg_getnumcolors = (e) => (_pg_reg_getnumcolors = Module._pg_reg_getnumcolors = wasmExports.pg_reg_getnumcolors)(e), _pg_reg_colorisbegin = Module._pg_reg_colorisbegin = (e, t2) => (_pg_reg_colorisbegin = Module._pg_reg_colorisbegin = wasmExports.pg_reg_colorisbegin)(e, t2), _pg_reg_colorisend = Module._pg_reg_colorisend = (e, t2) => (_pg_reg_colorisend = Module._pg_reg_colorisend = wasmExports.pg_reg_colorisend)(e, t2), _pg_reg_getnumcharacters = Module._pg_reg_getnumcharacters = (e, t2) => (_pg_reg_getnumcharacters = Module._pg_reg_getnumcharacters = wasmExports.pg_reg_getnumcharacters)(e, t2), _pg_reg_getcharacters = Module._pg_reg_getcharacters = (e, t2, r, a2) => (_pg_reg_getcharacters = Module._pg_reg_getcharacters = wasmExports.pg_reg_getcharacters)(e, t2, r, a2), _OutputPluginPrepareWrite = Module._OutputPluginPrepareWrite = (e, t2) => (_OutputPluginPrepareWrite = Module._OutputPluginPrepareWrite = wasmExports.OutputPluginPrepareWrite)(e, t2), _OutputPluginWrite = Module._OutputPluginWrite = (e, t2) => (_OutputPluginWrite = Module._OutputPluginWrite = wasmExports.OutputPluginWrite)(e, t2), _array_contains_nulls = Module._array_contains_nulls = (e) => (_array_contains_nulls = Module._array_contains_nulls = wasmExports.array_contains_nulls)(e), _CacheRegisterRelcacheCallback = Module._CacheRegisterRelcacheCallback = (e, t2) => (_CacheRegisterRelcacheCallback = Module._CacheRegisterRelcacheCallback = wasmExports.CacheRegisterRelcacheCallback)(e, t2), _hash_seq_term = Module._hash_seq_term = (e) => (_hash_seq_term = Module._hash_seq_term = wasmExports.hash_seq_term)(e), _FreeErrorData = Module._FreeErrorData = (e) => (_FreeErrorData = Module._FreeErrorData = wasmExports.FreeErrorData)(e), _RelidByRelfilenumber = Module._RelidByRelfilenumber = (e, t2) => (_RelidByRelfilenumber = Module._RelidByRelfilenumber = wasmExports.RelidByRelfilenumber)(e, t2), _WaitLatchOrSocket = Module._WaitLatchOrSocket = (e, t2, r, a2, o4) => (_WaitLatchOrSocket = Module._WaitLatchOrSocket = wasmExports.WaitLatchOrSocket)(e, t2, r, a2, o4), _get_row_security_policies = Module._get_row_security_policies = (e, t2, r, a2, o4, s4, _3) => (_get_row_security_policies = Module._get_row_security_policies = wasmExports.get_row_security_policies)(e, t2, r, a2, o4, s4, _3), _hash_estimate_size = Module._hash_estimate_size = (e, t2) => (_hash_estimate_size = Module._hash_estimate_size = wasmExports.hash_estimate_size)(e, t2), _ShmemInitHash = Module._ShmemInitHash = (e, t2, r, a2, o4) => (_ShmemInitHash = Module._ShmemInitHash = wasmExports.ShmemInitHash)(e, t2, r, a2, o4), _LockBufHdr = Module._LockBufHdr = (e) => (_LockBufHdr = Module._LockBufHdr = wasmExports.LockBufHdr)(e), _EvictUnpinnedBuffer = Module._EvictUnpinnedBuffer = (e) => (_EvictUnpinnedBuffer = Module._EvictUnpinnedBuffer = wasmExports.EvictUnpinnedBuffer)(e), _have_free_buffer = Module._have_free_buffer = () => (_have_free_buffer = Module._have_free_buffer = wasmExports.have_free_buffer)(), _copy_file = Module._copy_file = (e, t2) => (_copy_file = Module._copy_file = wasmExports.copy_file)(e, t2), _AcquireExternalFD = Module._AcquireExternalFD = () => (_AcquireExternalFD = Module._AcquireExternalFD = wasmExports.AcquireExternalFD)(), _GetNamedDSMSegment = Module._GetNamedDSMSegment = (e, t2, r, a2) => (_GetNamedDSMSegment = Module._GetNamedDSMSegment = wasmExports.GetNamedDSMSegment)(e, t2, r, a2), _RequestAddinShmemSpace = Module._RequestAddinShmemSpace = (e) => (_RequestAddinShmemSpace = Module._RequestAddinShmemSpace = wasmExports.RequestAddinShmemSpace)(e), _GetRunningTransactionData = Module._GetRunningTransactionData = () => (_GetRunningTransactionData = Module._GetRunningTransactionData = wasmExports.GetRunningTransactionData)(), _BackendXidGetPid = Module._BackendXidGetPid = (e) => (_BackendXidGetPid = Module._BackendXidGetPid = wasmExports.BackendXidGetPid)(e), _LWLockRegisterTranche = Module._LWLockRegisterTranche = (e, t2) => (_LWLockRegisterTranche = Module._LWLockRegisterTranche = wasmExports.LWLockRegisterTranche)(e, t2), _GetNamedLWLockTranche = Module._GetNamedLWLockTranche = (e) => (_GetNamedLWLockTranche = Module._GetNamedLWLockTranche = wasmExports.GetNamedLWLockTranche)(e), _LWLockNewTrancheId = Module._LWLockNewTrancheId = () => (_LWLockNewTrancheId = Module._LWLockNewTrancheId = wasmExports.LWLockNewTrancheId)(), _RequestNamedLWLockTranche = Module._RequestNamedLWLockTranche = (e, t2) => (_RequestNamedLWLockTranche = Module._RequestNamedLWLockTranche = wasmExports.RequestNamedLWLockTranche)(e, t2), _standard_ProcessUtility = Module._standard_ProcessUtility = (e, t2, r, a2, o4, s4, _3, n3) => (_standard_ProcessUtility = Module._standard_ProcessUtility = wasmExports.standard_ProcessUtility)(e, t2, r, a2, o4, s4, _3, n3), _lookup_ts_dictionary_cache = Module._lookup_ts_dictionary_cache = (e) => (_lookup_ts_dictionary_cache = Module._lookup_ts_dictionary_cache = wasmExports.lookup_ts_dictionary_cache)(e), _get_tsearch_config_filename = Module._get_tsearch_config_filename = (e, t2) => (_get_tsearch_config_filename = Module._get_tsearch_config_filename = wasmExports.get_tsearch_config_filename)(e, t2), _lowerstr = Module._lowerstr = (e) => (_lowerstr = Module._lowerstr = wasmExports.lowerstr)(e), _readstoplist = Module._readstoplist = (e, t2, r) => (_readstoplist = Module._readstoplist = wasmExports.readstoplist)(e, t2, r), _lowerstr_with_len = Module._lowerstr_with_len = (e, t2) => (_lowerstr_with_len = Module._lowerstr_with_len = wasmExports.lowerstr_with_len)(e, t2), _searchstoplist = Module._searchstoplist = (e, t2) => (_searchstoplist = Module._searchstoplist = wasmExports.searchstoplist)(e, t2), _tsearch_readline_begin = Module._tsearch_readline_begin = (e, t2) => (_tsearch_readline_begin = Module._tsearch_readline_begin = wasmExports.tsearch_readline_begin)(e, t2), _tsearch_readline = Module._tsearch_readline = (e) => (_tsearch_readline = Module._tsearch_readline = wasmExports.tsearch_readline)(e), _t_isspace = Module._t_isspace = (e) => (_t_isspace = Module._t_isspace = wasmExports.t_isspace)(e), _tsearch_readline_end = Module._tsearch_readline_end = (e) => (_tsearch_readline_end = Module._tsearch_readline_end = wasmExports.tsearch_readline_end)(e), _stringToQualifiedNameList = Module._stringToQualifiedNameList = (e, t2) => (_stringToQualifiedNameList = Module._stringToQualifiedNameList = wasmExports.stringToQualifiedNameList)(e, t2), _t_isdigit = Module._t_isdigit = (e) => (_t_isdigit = Module._t_isdigit = wasmExports.t_isdigit)(e), _t_isalnum = Module._t_isalnum = (e) => (_t_isalnum = Module._t_isalnum = wasmExports.t_isalnum)(e), _get_restriction_variable = Module._get_restriction_variable = (e, t2, r, a2, o4, s4) => (_get_restriction_variable = Module._get_restriction_variable = wasmExports.get_restriction_variable)(e, t2, r, a2, o4, s4), _MemoryContextAllocHuge = Module._MemoryContextAllocHuge = (e, t2) => (_MemoryContextAllocHuge = Module._MemoryContextAllocHuge = wasmExports.MemoryContextAllocHuge)(e, t2), _WaitEventExtensionNew = Module._WaitEventExtensionNew = (e) => (_WaitEventExtensionNew = Module._WaitEventExtensionNew = wasmExports.WaitEventExtensionNew)(e), _expand_array = Module._expand_array = (e, t2, r) => (_expand_array = Module._expand_array = wasmExports.expand_array)(e, t2, r), _arraycontsel = Module._arraycontsel = (e) => (_arraycontsel = Module._arraycontsel = wasmExports.arraycontsel)(e), _arraycontjoinsel = Module._arraycontjoinsel = (e) => (_arraycontjoinsel = Module._arraycontjoinsel = wasmExports.arraycontjoinsel)(e), _initArrayResult = Module._initArrayResult = (e, t2, r) => (_initArrayResult = Module._initArrayResult = wasmExports.initArrayResult)(e, t2, r), _array_create_iterator = Module._array_create_iterator = (e, t2, r) => (_array_create_iterator = Module._array_create_iterator = wasmExports.array_create_iterator)(e, t2, r), _array_iterate = Module._array_iterate = (e, t2, r) => (_array_iterate = Module._array_iterate = wasmExports.array_iterate)(e, t2, r), _ArrayGetIntegerTypmods = Module._ArrayGetIntegerTypmods = (e, t2) => (_ArrayGetIntegerTypmods = Module._ArrayGetIntegerTypmods = wasmExports.ArrayGetIntegerTypmods)(e, t2), _boolin = Module._boolin = (e) => (_boolin = Module._boolin = wasmExports.boolin)(e), _cash_cmp = Module._cash_cmp = (e) => (_cash_cmp = Module._cash_cmp = wasmExports.cash_cmp)(e), _int64_to_numeric = Module._int64_to_numeric = (e) => (_int64_to_numeric = Module._int64_to_numeric = wasmExports.int64_to_numeric)(e), _numeric_div = Module._numeric_div = (e) => (_numeric_div = Module._numeric_div = wasmExports.numeric_div)(e), _numeric_round = Module._numeric_round = (e) => (_numeric_round = Module._numeric_round = wasmExports.numeric_round)(e), _numeric_int8 = Module._numeric_int8 = (e) => (_numeric_int8 = Module._numeric_int8 = wasmExports.numeric_int8)(e), _numeric_mul = Module._numeric_mul = (e) => (_numeric_mul = Module._numeric_mul = wasmExports.numeric_mul)(e), _j2date = Module._j2date = (e, t2, r, a2) => (_j2date = Module._j2date = wasmExports.j2date)(e, t2, r, a2), _EncodeDateOnly = Module._EncodeDateOnly = (e, t2, r) => (_EncodeDateOnly = Module._EncodeDateOnly = wasmExports.EncodeDateOnly)(e, t2, r), _EncodeSpecialDate = Module._EncodeSpecialDate = (e, t2) => (_EncodeSpecialDate = Module._EncodeSpecialDate = wasmExports.EncodeSpecialDate)(e, t2), _date_eq = Module._date_eq = (e) => (_date_eq = Module._date_eq = wasmExports.date_eq)(e), _date_lt = Module._date_lt = (e) => (_date_lt = Module._date_lt = wasmExports.date_lt)(e), _date_le = Module._date_le = (e) => (_date_le = Module._date_le = wasmExports.date_le)(e), _date_gt = Module._date_gt = (e) => (_date_gt = Module._date_gt = wasmExports.date_gt)(e), _date_ge = Module._date_ge = (e) => (_date_ge = Module._date_ge = wasmExports.date_ge)(e), _date_cmp = Module._date_cmp = (e) => (_date_cmp = Module._date_cmp = wasmExports.date_cmp)(e), _date_mi = Module._date_mi = (e) => (_date_mi = Module._date_mi = wasmExports.date_mi)(e), _timestamp2tm = Module._timestamp2tm = (e, t2, r, a2, o4, s4) => (_timestamp2tm = Module._timestamp2tm = wasmExports.timestamp2tm)(e, t2, r, a2, o4, s4), _time2tm = Module._time2tm = (e, t2, r) => (_time2tm = Module._time2tm = wasmExports.time2tm)(e, t2, r), _EncodeTimeOnly = Module._EncodeTimeOnly = (e, t2, r, a2, o4, s4) => (_EncodeTimeOnly = Module._EncodeTimeOnly = wasmExports.EncodeTimeOnly)(e, t2, r, a2, o4, s4), _time_eq = Module._time_eq = (e) => (_time_eq = Module._time_eq = wasmExports.time_eq)(e), _time_lt = Module._time_lt = (e) => (_time_lt = Module._time_lt = wasmExports.time_lt)(e), _time_le = Module._time_le = (e) => (_time_le = Module._time_le = wasmExports.time_le)(e), _time_gt = Module._time_gt = (e) => (_time_gt = Module._time_gt = wasmExports.time_gt)(e), _time_ge = Module._time_ge = (e) => (_time_ge = Module._time_ge = wasmExports.time_ge)(e), _time_cmp = Module._time_cmp = (e) => (_time_cmp = Module._time_cmp = wasmExports.time_cmp)(e), _time_mi_time = Module._time_mi_time = (e) => (_time_mi_time = Module._time_mi_time = wasmExports.time_mi_time)(e), _timetz2tm = Module._timetz2tm = (e, t2, r, a2) => (_timetz2tm = Module._timetz2tm = wasmExports.timetz2tm)(e, t2, r, a2), _timetz_cmp = Module._timetz_cmp = (e) => (_timetz_cmp = Module._timetz_cmp = wasmExports.timetz_cmp)(e), _EncodeDateTime = Module._EncodeDateTime = (e, t2, r, a2, o4, s4, _3) => (_EncodeDateTime = Module._EncodeDateTime = wasmExports.EncodeDateTime)(e, t2, r, a2, o4, s4, _3), _TransferExpandedObject = Module._TransferExpandedObject = (e, t2) => (_TransferExpandedObject = Module._TransferExpandedObject = wasmExports.TransferExpandedObject)(e, t2), _numeric_lt = Module._numeric_lt = (e) => (_numeric_lt = Module._numeric_lt = wasmExports.numeric_lt)(e), _numeric_abs = Module._numeric_abs = (e) => (_numeric_abs = Module._numeric_abs = wasmExports.numeric_abs)(e), _numeric_add = Module._numeric_add = (e) => (_numeric_add = Module._numeric_add = wasmExports.numeric_add)(e), _numeric_ge = Module._numeric_ge = (e) => (_numeric_ge = Module._numeric_ge = wasmExports.numeric_ge)(e), _err_generic_string = Module._err_generic_string = (e, t2) => (_err_generic_string = Module._err_generic_string = wasmExports.err_generic_string)(e, t2), _domain_check = Module._domain_check = (e, t2, r, a2, o4) => (_domain_check = Module._domain_check = wasmExports.domain_check)(e, t2, r, a2, o4), _enum_lt = Module._enum_lt = (e) => (_enum_lt = Module._enum_lt = wasmExports.enum_lt)(e), _enum_le = Module._enum_le = (e) => (_enum_le = Module._enum_le = wasmExports.enum_le)(e), _enum_ge = Module._enum_ge = (e) => (_enum_ge = Module._enum_ge = wasmExports.enum_ge)(e), _enum_gt = Module._enum_gt = (e) => (_enum_gt = Module._enum_gt = wasmExports.enum_gt)(e), _enum_cmp = Module._enum_cmp = (e) => (_enum_cmp = Module._enum_cmp = wasmExports.enum_cmp)(e), _make_expanded_record_from_typeid = Module._make_expanded_record_from_typeid = (e, t2, r) => (_make_expanded_record_from_typeid = Module._make_expanded_record_from_typeid = wasmExports.make_expanded_record_from_typeid)(e, t2, r), _make_expanded_record_from_tupdesc = Module._make_expanded_record_from_tupdesc = (e, t2) => (_make_expanded_record_from_tupdesc = Module._make_expanded_record_from_tupdesc = wasmExports.make_expanded_record_from_tupdesc)(e, t2), _make_expanded_record_from_exprecord = Module._make_expanded_record_from_exprecord = (e, t2) => (_make_expanded_record_from_exprecord = Module._make_expanded_record_from_exprecord = wasmExports.make_expanded_record_from_exprecord)(e, t2), _expanded_record_set_tuple = Module._expanded_record_set_tuple = (e, t2, r, a2) => (_expanded_record_set_tuple = Module._expanded_record_set_tuple = wasmExports.expanded_record_set_tuple)(e, t2, r, a2), _expanded_record_get_tuple = Module._expanded_record_get_tuple = (e) => (_expanded_record_get_tuple = Module._expanded_record_get_tuple = wasmExports.expanded_record_get_tuple)(e), _deconstruct_expanded_record = Module._deconstruct_expanded_record = (e) => (_deconstruct_expanded_record = Module._deconstruct_expanded_record = wasmExports.deconstruct_expanded_record)(e), _expanded_record_lookup_field = Module._expanded_record_lookup_field = (e, t2, r) => (_expanded_record_lookup_field = Module._expanded_record_lookup_field = wasmExports.expanded_record_lookup_field)(e, t2, r), _expanded_record_set_field_internal = Module._expanded_record_set_field_internal = (e, t2, r, a2, o4, s4) => (_expanded_record_set_field_internal = Module._expanded_record_set_field_internal = wasmExports.expanded_record_set_field_internal)(e, t2, r, a2, o4, s4), _expanded_record_set_fields = Module._expanded_record_set_fields = (e, t2, r, a2) => (_expanded_record_set_fields = Module._expanded_record_set_fields = wasmExports.expanded_record_set_fields)(e, t2, r, a2), _float4in_internal = Module._float4in_internal = (e, t2, r, a2, o4) => (_float4in_internal = Module._float4in_internal = wasmExports.float4in_internal)(e, t2, r, a2, o4), _strtof = Module._strtof = (e, t2) => (_strtof = Module._strtof = wasmExports.strtof)(e, t2), _float8in = Module._float8in = (e) => (_float8in = Module._float8in = wasmExports.float8in)(e), _float8in_internal = Module._float8in_internal = (e, t2, r, a2, o4) => (_float8in_internal = Module._float8in_internal = wasmExports.float8in_internal)(e, t2, r, a2, o4), _float8out = Module._float8out = (e) => (_float8out = Module._float8out = wasmExports.float8out)(e), _float8out_internal = Module._float8out_internal = (e) => (_float8out_internal = Module._float8out_internal = wasmExports.float8out_internal)(e), _float8pl = Module._float8pl = (e) => (_float8pl = Module._float8pl = wasmExports.float8pl)(e), _btfloat4cmp = Module._btfloat4cmp = (e) => (_btfloat4cmp = Module._btfloat4cmp = wasmExports.btfloat4cmp)(e), _btfloat8cmp = Module._btfloat8cmp = (e) => (_btfloat8cmp = Module._btfloat8cmp = wasmExports.btfloat8cmp)(e), _dtoi4 = Module._dtoi4 = (e) => (_dtoi4 = Module._dtoi4 = wasmExports.dtoi4)(e), _dtoi2 = Module._dtoi2 = (e) => (_dtoi2 = Module._dtoi2 = wasmExports.dtoi2)(e), _dexp = Module._dexp = (e) => (_dexp = Module._dexp = wasmExports.dexp)(e), _dacos = Module._dacos = (e) => (_dacos = Module._dacos = wasmExports.dacos)(e), _acos = Module._acos = (e) => (_acos = Module._acos = wasmExports.acos)(e), _dasin = Module._dasin = (e) => (_dasin = Module._dasin = wasmExports.dasin)(e), _asin = Module._asin = (e) => (_asin = Module._asin = wasmExports.asin)(e), _datan = Module._datan = (e) => (_datan = Module._datan = wasmExports.datan)(e), _datan2 = Module._datan2 = (e) => (_datan2 = Module._datan2 = wasmExports.datan2)(e), _dcos = Module._dcos = (e) => (_dcos = Module._dcos = wasmExports.dcos)(e), _cos = Module._cos = (e) => (_cos = Module._cos = wasmExports.cos)(e), _dcot = Module._dcot = (e) => (_dcot = Module._dcot = wasmExports.dcot)(e), _dsin = Module._dsin = (e) => (_dsin = Module._dsin = wasmExports.dsin)(e), _dtan = Module._dtan = (e) => (_dtan = Module._dtan = wasmExports.dtan)(e), _fmod = Module._fmod = (e, t2) => (_fmod = Module._fmod = wasmExports.fmod)(e, t2), _degrees = Module._degrees = (e) => (_degrees = Module._degrees = wasmExports.degrees)(e), _dpi = Module._dpi = (e) => (_dpi = Module._dpi = wasmExports.dpi)(e), _radians = Module._radians = (e) => (_radians = Module._radians = wasmExports.radians)(e), _float8_accum = Module._float8_accum = (e) => (_float8_accum = Module._float8_accum = wasmExports.float8_accum)(e), _float8_stddev_pop = Module._float8_stddev_pop = (e) => (_float8_stddev_pop = Module._float8_stddev_pop = wasmExports.float8_stddev_pop)(e), _float8_stddev_samp = Module._float8_stddev_samp = (e) => (_float8_stddev_samp = Module._float8_stddev_samp = wasmExports.float8_stddev_samp)(e), _str_tolower = Module._str_tolower = (e, t2, r) => (_str_tolower = Module._str_tolower = wasmExports.str_tolower)(e, t2, r), _numeric_power = Module._numeric_power = (e) => (_numeric_power = Module._numeric_power = wasmExports.numeric_power)(e), _numeric_int4 = Module._numeric_int4 = (e) => (_numeric_int4 = Module._numeric_int4 = wasmExports.numeric_int4)(e), _int84 = Module._int84 = (e) => (_int84 = Module._int84 = wasmExports.int84)(e), _dtoi8 = Module._dtoi8 = (e) => (_dtoi8 = Module._dtoi8 = wasmExports.dtoi8)(e), _int8out = Module._int8out = (e) => (_int8out = Module._int8out = wasmExports.int8out)(e), _int4in = Module._int4in = (e) => (_int4in = Module._int4in = wasmExports.int4in)(e), _int4_bool = Module._int4_bool = (e) => (_int4_bool = Module._int4_bool = wasmExports.int4_bool)(e), _int8pl = Module._int8pl = (e) => (_int8pl = Module._int8pl = wasmExports.int8pl)(e), _int82 = Module._int82 = (e) => (_int82 = Module._int82 = wasmExports.int82)(e), _json_in = Module._json_in = (e) => (_json_in = Module._json_in = wasmExports.json_in)(e), _EncodeSpecialTimestamp = Module._EncodeSpecialTimestamp = (e, t2) => (_EncodeSpecialTimestamp = Module._EncodeSpecialTimestamp = wasmExports.EncodeSpecialTimestamp)(e, t2), _extract_variadic_args = Module._extract_variadic_args = (e, t2, r, a2, o4, s4) => (_extract_variadic_args = Module._extract_variadic_args = wasmExports.extract_variadic_args)(e, t2, r, a2, o4, s4), _pushJsonbValue = Module._pushJsonbValue = (e, t2, r) => (_pushJsonbValue = Module._pushJsonbValue = wasmExports.pushJsonbValue)(e, t2, r), _numeric_int2 = Module._numeric_int2 = (e) => (_numeric_int2 = Module._numeric_int2 = wasmExports.numeric_int2)(e), _numeric_float4 = Module._numeric_float4 = (e) => (_numeric_float4 = Module._numeric_float4 = wasmExports.numeric_float4)(e), _numeric_normalize = Module._numeric_normalize = (e) => (_numeric_normalize = Module._numeric_normalize = wasmExports.numeric_normalize)(e), _numeric_cmp = Module._numeric_cmp = (e) => (_numeric_cmp = Module._numeric_cmp = wasmExports.numeric_cmp)(e), _numeric_eq = Module._numeric_eq = (e) => (_numeric_eq = Module._numeric_eq = wasmExports.numeric_eq)(e), _hash_numeric = Module._hash_numeric = (e) => (_hash_numeric = Module._hash_numeric = wasmExports.hash_numeric)(e), _hash_numeric_extended = Module._hash_numeric_extended = (e) => (_hash_numeric_extended = Module._hash_numeric_extended = wasmExports.hash_numeric_extended)(e), _int2_numeric = Module._int2_numeric = (e) => (_int2_numeric = Module._int2_numeric = wasmExports.int2_numeric)(e), _int4_numeric = Module._int4_numeric = (e) => (_int4_numeric = Module._int4_numeric = wasmExports.int4_numeric)(e), _int8_numeric = Module._int8_numeric = (e) => (_int8_numeric = Module._int8_numeric = wasmExports.int8_numeric)(e), _float4_numeric = Module._float4_numeric = (e) => (_float4_numeric = Module._float4_numeric = wasmExports.float4_numeric)(e), _float8_numeric = Module._float8_numeric = (e) => (_float8_numeric = Module._float8_numeric = wasmExports.float8_numeric)(e), _numeric_uminus = Module._numeric_uminus = (e) => (_numeric_uminus = Module._numeric_uminus = wasmExports.numeric_uminus)(e), _numeric_is_nan = Module._numeric_is_nan = (e) => (_numeric_is_nan = Module._numeric_is_nan = wasmExports.numeric_is_nan)(e), _numeric_ceil = Module._numeric_ceil = (e) => (_numeric_ceil = Module._numeric_ceil = wasmExports.numeric_ceil)(e), _numeric_floor = Module._numeric_floor = (e) => (_numeric_floor = Module._numeric_floor = wasmExports.numeric_floor)(e), _timestamp_cmp = Module._timestamp_cmp = (e) => (_timestamp_cmp = Module._timestamp_cmp = wasmExports.timestamp_cmp)(e), _macaddr_cmp = Module._macaddr_cmp = (e) => (_macaddr_cmp = Module._macaddr_cmp = wasmExports.macaddr_cmp)(e), _macaddr_lt = Module._macaddr_lt = (e) => (_macaddr_lt = Module._macaddr_lt = wasmExports.macaddr_lt)(e), _macaddr_le = Module._macaddr_le = (e) => (_macaddr_le = Module._macaddr_le = wasmExports.macaddr_le)(e), _macaddr_eq = Module._macaddr_eq = (e) => (_macaddr_eq = Module._macaddr_eq = wasmExports.macaddr_eq)(e), _macaddr_ge = Module._macaddr_ge = (e) => (_macaddr_ge = Module._macaddr_ge = wasmExports.macaddr_ge)(e), _macaddr_gt = Module._macaddr_gt = (e) => (_macaddr_gt = Module._macaddr_gt = wasmExports.macaddr_gt)(e), _macaddr8_cmp = Module._macaddr8_cmp = (e) => (_macaddr8_cmp = Module._macaddr8_cmp = wasmExports.macaddr8_cmp)(e), _macaddr8_lt = Module._macaddr8_lt = (e) => (_macaddr8_lt = Module._macaddr8_lt = wasmExports.macaddr8_lt)(e), _macaddr8_le = Module._macaddr8_le = (e) => (_macaddr8_le = Module._macaddr8_le = wasmExports.macaddr8_le)(e), _macaddr8_eq = Module._macaddr8_eq = (e) => (_macaddr8_eq = Module._macaddr8_eq = wasmExports.macaddr8_eq)(e), _macaddr8_ge = Module._macaddr8_ge = (e) => (_macaddr8_ge = Module._macaddr8_ge = wasmExports.macaddr8_ge)(e), _macaddr8_gt = Module._macaddr8_gt = (e) => (_macaddr8_gt = Module._macaddr8_gt = wasmExports.macaddr8_gt)(e), _current_query = Module._current_query = (e) => (_current_query = Module._current_query = wasmExports.current_query)(e), _get_fn_expr_arg_stable = Module._get_fn_expr_arg_stable = (e, t2) => (_get_fn_expr_arg_stable = Module._get_fn_expr_arg_stable = wasmExports.get_fn_expr_arg_stable)(e, t2), _unpack_sql_state = Module._unpack_sql_state = (e) => (_unpack_sql_state = Module._unpack_sql_state = wasmExports.unpack_sql_state)(e), _get_fn_expr_rettype = Module._get_fn_expr_rettype = (e) => (_get_fn_expr_rettype = Module._get_fn_expr_rettype = wasmExports.get_fn_expr_rettype)(e), _btnamecmp = Module._btnamecmp = (e) => (_btnamecmp = Module._btnamecmp = wasmExports.btnamecmp)(e), _inet_in = Module._inet_in = (e) => (_inet_in = Module._inet_in = wasmExports.inet_in)(e), _network_cmp = Module._network_cmp = (e) => (_network_cmp = Module._network_cmp = wasmExports.network_cmp)(e), _convert_network_to_scalar = Module._convert_network_to_scalar = (e, t2, r) => (_convert_network_to_scalar = Module._convert_network_to_scalar = wasmExports.convert_network_to_scalar)(e, t2, r), _numeric_sign = Module._numeric_sign = (e) => (_numeric_sign = Module._numeric_sign = wasmExports.numeric_sign)(e), _numeric_gt = Module._numeric_gt = (e) => (_numeric_gt = Module._numeric_gt = wasmExports.numeric_gt)(e), _numeric_le = Module._numeric_le = (e) => (_numeric_le = Module._numeric_le = wasmExports.numeric_le)(e), _numeric_mod = Module._numeric_mod = (e) => (_numeric_mod = Module._numeric_mod = wasmExports.numeric_mod)(e), _numeric_sqrt = Module._numeric_sqrt = (e) => (_numeric_sqrt = Module._numeric_sqrt = wasmExports.numeric_sqrt)(e), _numeric_exp = Module._numeric_exp = (e) => (_numeric_exp = Module._numeric_exp = wasmExports.numeric_exp)(e), _numeric_ln = Module._numeric_ln = (e) => (_numeric_ln = Module._numeric_ln = wasmExports.numeric_ln)(e), _numeric_log = Module._numeric_log = (e) => (_numeric_log = Module._numeric_log = wasmExports.numeric_log)(e), _numeric_float8_no_overflow = Module._numeric_float8_no_overflow = (e) => (_numeric_float8_no_overflow = Module._numeric_float8_no_overflow = wasmExports.numeric_float8_no_overflow)(e), _pg_strtoint64 = Module._pg_strtoint64 = (e) => (_pg_strtoint64 = Module._pg_strtoint64 = wasmExports.pg_strtoint64)(e), _oidout = Module._oidout = (e) => (_oidout = Module._oidout = wasmExports.oidout)(e), _btrim1 = Module._btrim1 = (e) => (_btrim1 = Module._btrim1 = wasmExports.btrim1)(e), _ltrim1 = Module._ltrim1 = (e) => (_ltrim1 = Module._ltrim1 = wasmExports.ltrim1)(e), _rtrim1 = Module._rtrim1 = (e) => (_rtrim1 = Module._rtrim1 = wasmExports.rtrim1)(e), _tuplesort_skiptuples = Module._tuplesort_skiptuples = (e, t2, r) => (_tuplesort_skiptuples = Module._tuplesort_skiptuples = wasmExports.tuplesort_skiptuples)(e, t2, r), _interval_mi = Module._interval_mi = (e) => (_interval_mi = Module._interval_mi = wasmExports.interval_mi)(e), _drandom = Module._drandom = (e) => (_drandom = Module._drandom = wasmExports.drandom)(e), _quote_ident = Module._quote_ident = (e) => (_quote_ident = Module._quote_ident = wasmExports.quote_ident)(e), _textregexeq = Module._textregexeq = (e) => (_textregexeq = Module._textregexeq = wasmExports.textregexeq)(e), _text_substr = Module._text_substr = (e) => (_text_substr = Module._text_substr = wasmExports.text_substr)(e), _pg_wchar2mb_with_len = Module._pg_wchar2mb_with_len = (e, t2, r) => (_pg_wchar2mb_with_len = Module._pg_wchar2mb_with_len = wasmExports.pg_wchar2mb_with_len)(e, t2, r), _regexp_split_to_array = Module._regexp_split_to_array = (e) => (_regexp_split_to_array = Module._regexp_split_to_array = wasmExports.regexp_split_to_array)(e), _regtypeout = Module._regtypeout = (e) => (_regtypeout = Module._regtypeout = wasmExports.regtypeout)(e), _pg_get_indexdef_columns_extended = Module._pg_get_indexdef_columns_extended = (e, t2) => (_pg_get_indexdef_columns_extended = Module._pg_get_indexdef_columns_extended = wasmExports.pg_get_indexdef_columns_extended)(e, t2), _pg_get_querydef = Module._pg_get_querydef = (e, t2) => (_pg_get_querydef = Module._pg_get_querydef = wasmExports.pg_get_querydef)(e, t2), _strcspn = Module._strcspn = (e, t2) => (_strcspn = Module._strcspn = wasmExports.strcspn)(e, t2), _generic_restriction_selectivity = Module._generic_restriction_selectivity = (e, t2, r, a2, o4, s4) => (_generic_restriction_selectivity = Module._generic_restriction_selectivity = wasmExports.generic_restriction_selectivity)(e, t2, r, a2, o4, s4), _genericcostestimate = Module._genericcostestimate = (e, t2, r, a2) => (_genericcostestimate = Module._genericcostestimate = wasmExports.genericcostestimate)(e, t2, r, a2), _tidin = Module._tidin = (e) => (_tidin = Module._tidin = wasmExports.tidin)(e), _tidout = Module._tidout = (e) => (_tidout = Module._tidout = wasmExports.tidout)(e), _timestamp_in = Module._timestamp_in = (e) => (_timestamp_in = Module._timestamp_in = wasmExports.timestamp_in)(e), _timestamp_eq = Module._timestamp_eq = (e) => (_timestamp_eq = Module._timestamp_eq = wasmExports.timestamp_eq)(e), _timestamp_lt = Module._timestamp_lt = (e) => (_timestamp_lt = Module._timestamp_lt = wasmExports.timestamp_lt)(e), _timestamp_gt = Module._timestamp_gt = (e) => (_timestamp_gt = Module._timestamp_gt = wasmExports.timestamp_gt)(e), _timestamp_le = Module._timestamp_le = (e) => (_timestamp_le = Module._timestamp_le = wasmExports.timestamp_le)(e), _timestamp_ge = Module._timestamp_ge = (e) => (_timestamp_ge = Module._timestamp_ge = wasmExports.timestamp_ge)(e), _interval_eq = Module._interval_eq = (e) => (_interval_eq = Module._interval_eq = wasmExports.interval_eq)(e), _interval_lt = Module._interval_lt = (e) => (_interval_lt = Module._interval_lt = wasmExports.interval_lt)(e), _interval_gt = Module._interval_gt = (e) => (_interval_gt = Module._interval_gt = wasmExports.interval_gt)(e), _interval_le = Module._interval_le = (e) => (_interval_le = Module._interval_le = wasmExports.interval_le)(e), _interval_ge = Module._interval_ge = (e) => (_interval_ge = Module._interval_ge = wasmExports.interval_ge)(e), _interval_cmp = Module._interval_cmp = (e) => (_interval_cmp = Module._interval_cmp = wasmExports.interval_cmp)(e), _timestamp_mi = Module._timestamp_mi = (e) => (_timestamp_mi = Module._timestamp_mi = wasmExports.timestamp_mi)(e), _interval_um = Module._interval_um = (e) => (_interval_um = Module._interval_um = wasmExports.interval_um)(e), _has_fn_opclass_options = Module._has_fn_opclass_options = (e) => (_has_fn_opclass_options = Module._has_fn_opclass_options = wasmExports.has_fn_opclass_options)(e), _uuid_in = Module._uuid_in = (e) => (_uuid_in = Module._uuid_in = wasmExports.uuid_in)(e), _uuid_out = Module._uuid_out = (e) => (_uuid_out = Module._uuid_out = wasmExports.uuid_out)(e), _uuid_cmp = Module._uuid_cmp = (e) => (_uuid_cmp = Module._uuid_cmp = wasmExports.uuid_cmp)(e), _gen_random_uuid = Module._gen_random_uuid = (e) => (_gen_random_uuid = Module._gen_random_uuid = wasmExports.gen_random_uuid)(e), _varbit_in = Module._varbit_in = (e) => (_varbit_in = Module._varbit_in = wasmExports.varbit_in)(e), _biteq = Module._biteq = (e) => (_biteq = Module._biteq = wasmExports.biteq)(e), _bitlt = Module._bitlt = (e) => (_bitlt = Module._bitlt = wasmExports.bitlt)(e), _bitle = Module._bitle = (e) => (_bitle = Module._bitle = wasmExports.bitle)(e), _bitgt = Module._bitgt = (e) => (_bitgt = Module._bitgt = wasmExports.bitgt)(e), _bitge = Module._bitge = (e) => (_bitge = Module._bitge = wasmExports.bitge)(e), _bitcmp = Module._bitcmp = (e) => (_bitcmp = Module._bitcmp = wasmExports.bitcmp)(e), _bpchareq = Module._bpchareq = (e) => (_bpchareq = Module._bpchareq = wasmExports.bpchareq)(e), _bpcharlt = Module._bpcharlt = (e) => (_bpcharlt = Module._bpcharlt = wasmExports.bpcharlt)(e), _bpcharle = Module._bpcharle = (e) => (_bpcharle = Module._bpcharle = wasmExports.bpcharle)(e), _bpchargt = Module._bpchargt = (e) => (_bpchargt = Module._bpchargt = wasmExports.bpchargt)(e), _bpcharge = Module._bpcharge = (e) => (_bpcharge = Module._bpcharge = wasmExports.bpcharge)(e), _bpcharcmp = Module._bpcharcmp = (e) => (_bpcharcmp = Module._bpcharcmp = wasmExports.bpcharcmp)(e), _text_substr_no_len = Module._text_substr_no_len = (e) => (_text_substr_no_len = Module._text_substr_no_len = wasmExports.text_substr_no_len)(e), _texteq = Module._texteq = (e) => (_texteq = Module._texteq = wasmExports.texteq)(e), _text_lt = Module._text_lt = (e) => (_text_lt = Module._text_lt = wasmExports.text_lt)(e), _text_le = Module._text_le = (e) => (_text_le = Module._text_le = wasmExports.text_le)(e), _text_gt = Module._text_gt = (e) => (_text_gt = Module._text_gt = wasmExports.text_gt)(e), _text_ge = Module._text_ge = (e) => (_text_ge = Module._text_ge = wasmExports.text_ge)(e), _bttextcmp = Module._bttextcmp = (e) => (_bttextcmp = Module._bttextcmp = wasmExports.bttextcmp)(e), _byteaeq = Module._byteaeq = (e) => (_byteaeq = Module._byteaeq = wasmExports.byteaeq)(e), _bytealt = Module._bytealt = (e) => (_bytealt = Module._bytealt = wasmExports.bytealt)(e), _byteale = Module._byteale = (e) => (_byteale = Module._byteale = wasmExports.byteale)(e), _byteagt = Module._byteagt = (e) => (_byteagt = Module._byteagt = wasmExports.byteagt)(e), _byteage = Module._byteage = (e) => (_byteage = Module._byteage = wasmExports.byteage)(e), _byteacmp = Module._byteacmp = (e) => (_byteacmp = Module._byteacmp = wasmExports.byteacmp)(e), _to_hex32 = Module._to_hex32 = (e) => (_to_hex32 = Module._to_hex32 = wasmExports.to_hex32)(e), _text_left = Module._text_left = (e) => (_text_left = Module._text_left = wasmExports.text_left)(e), _text_right = Module._text_right = (e) => (_text_right = Module._text_right = wasmExports.text_right)(e), _text_reverse = Module._text_reverse = (e) => (_text_reverse = Module._text_reverse = wasmExports.text_reverse)(e), _varstr_levenshtein = Module._varstr_levenshtein = (e, t2, r, a2, o4, s4, _3, n3) => (_varstr_levenshtein = Module._varstr_levenshtein = wasmExports.varstr_levenshtein)(e, t2, r, a2, o4, s4, _3, n3), _pg_xml_init = Module._pg_xml_init = (e) => (_pg_xml_init = Module._pg_xml_init = wasmExports.pg_xml_init)(e), _xmlInitParser = Module._xmlInitParser = () => (_xmlInitParser = Module._xmlInitParser = wasmExports.xmlInitParser)(), _xml_ereport = Module._xml_ereport = (e, t2, r, a2) => (_xml_ereport = Module._xml_ereport = wasmExports.xml_ereport)(e, t2, r, a2), _pg_xml_done = Module._pg_xml_done = (e, t2) => (_pg_xml_done = Module._pg_xml_done = wasmExports.pg_xml_done)(e, t2), _xmlXPathNewContext = Module._xmlXPathNewContext = (e) => (_xmlXPathNewContext = Module._xmlXPathNewContext = wasmExports.xmlXPathNewContext)(e), _xmlXPathFreeContext = Module._xmlXPathFreeContext = (e) => (_xmlXPathFreeContext = Module._xmlXPathFreeContext = wasmExports.xmlXPathFreeContext)(e), _xmlFreeDoc = Module._xmlFreeDoc = (e) => (_xmlFreeDoc = Module._xmlFreeDoc = wasmExports.xmlFreeDoc)(e), _xmlXPathCtxtCompile = Module._xmlXPathCtxtCompile = (e, t2) => (_xmlXPathCtxtCompile = Module._xmlXPathCtxtCompile = wasmExports.xmlXPathCtxtCompile)(e, t2), _xmlXPathCompiledEval = Module._xmlXPathCompiledEval = (e, t2) => (_xmlXPathCompiledEval = Module._xmlXPathCompiledEval = wasmExports.xmlXPathCompiledEval)(e, t2), _xmlXPathFreeObject = Module._xmlXPathFreeObject = (e) => (_xmlXPathFreeObject = Module._xmlXPathFreeObject = wasmExports.xmlXPathFreeObject)(e), _xmlXPathFreeCompExpr = Module._xmlXPathFreeCompExpr = (e) => (_xmlXPathFreeCompExpr = Module._xmlXPathFreeCompExpr = wasmExports.xmlXPathFreeCompExpr)(e), _pg_do_encoding_conversion = Module._pg_do_encoding_conversion = (e, t2, r, a2) => (_pg_do_encoding_conversion = Module._pg_do_encoding_conversion = wasmExports.pg_do_encoding_conversion)(e, t2, r, a2), _xmlStrdup = Module._xmlStrdup = (e) => (_xmlStrdup = Module._xmlStrdup = wasmExports.xmlStrdup)(e), _xmlEncodeSpecialChars = Module._xmlEncodeSpecialChars = (e, t2) => (_xmlEncodeSpecialChars = Module._xmlEncodeSpecialChars = wasmExports.xmlEncodeSpecialChars)(e, t2), _xmlStrlen = Module._xmlStrlen = (e) => (_xmlStrlen = Module._xmlStrlen = wasmExports.xmlStrlen)(e), _xmlBufferCreate = Module._xmlBufferCreate = () => (_xmlBufferCreate = Module._xmlBufferCreate = wasmExports.xmlBufferCreate)(), _xmlBufferFree = Module._xmlBufferFree = (e) => (_xmlBufferFree = Module._xmlBufferFree = wasmExports.xmlBufferFree)(e), _xmlXPathCastNodeToString = Module._xmlXPathCastNodeToString = (e) => (_xmlXPathCastNodeToString = Module._xmlXPathCastNodeToString = wasmExports.xmlXPathCastNodeToString)(e), _xmlNodeDump = Module._xmlNodeDump = (e, t2, r, a2, o4) => (_xmlNodeDump = Module._xmlNodeDump = wasmExports.xmlNodeDump)(e, t2, r, a2, o4), _CreateCacheMemoryContext = Module._CreateCacheMemoryContext = () => (_CreateCacheMemoryContext = Module._CreateCacheMemoryContext = wasmExports.CreateCacheMemoryContext)(), _get_typsubscript = Module._get_typsubscript = (e, t2) => (_get_typsubscript = Module._get_typsubscript = wasmExports.get_typsubscript)(e, t2), _CachedPlanAllowsSimpleValidityCheck = Module._CachedPlanAllowsSimpleValidityCheck = (e, t2, r) => (_CachedPlanAllowsSimpleValidityCheck = Module._CachedPlanAllowsSimpleValidityCheck = wasmExports.CachedPlanAllowsSimpleValidityCheck)(e, t2, r), _CachedPlanIsSimplyValid = Module._CachedPlanIsSimplyValid = (e, t2, r) => (_CachedPlanIsSimplyValid = Module._CachedPlanIsSimplyValid = wasmExports.CachedPlanIsSimplyValid)(e, t2, r), _GetCachedExpression = Module._GetCachedExpression = (e) => (_GetCachedExpression = Module._GetCachedExpression = wasmExports.GetCachedExpression)(e), _FreeCachedExpression = Module._FreeCachedExpression = (e) => (_FreeCachedExpression = Module._FreeCachedExpression = wasmExports.FreeCachedExpression)(e), _ReleaseAllPlanCacheRefsInOwner = Module._ReleaseAllPlanCacheRefsInOwner = (e) => (_ReleaseAllPlanCacheRefsInOwner = Module._ReleaseAllPlanCacheRefsInOwner = wasmExports.ReleaseAllPlanCacheRefsInOwner)(e), _in_error_recursion_trouble = Module._in_error_recursion_trouble = () => (_in_error_recursion_trouble = Module._in_error_recursion_trouble = wasmExports.in_error_recursion_trouble)(), _GetErrorContextStack = Module._GetErrorContextStack = () => (_GetErrorContextStack = Module._GetErrorContextStack = wasmExports.GetErrorContextStack)(), _find_rendezvous_variable = Module._find_rendezvous_variable = (e) => (_find_rendezvous_variable = Module._find_rendezvous_variable = wasmExports.find_rendezvous_variable)(e), _CallerFInfoFunctionCall2 = Module._CallerFInfoFunctionCall2 = (e, t2, r, a2, o4) => (_CallerFInfoFunctionCall2 = Module._CallerFInfoFunctionCall2 = wasmExports.CallerFInfoFunctionCall2)(e, t2, r, a2, o4), _FunctionCall0Coll = Module._FunctionCall0Coll = (e, t2) => (_FunctionCall0Coll = Module._FunctionCall0Coll = wasmExports.FunctionCall0Coll)(e, t2), _resolve_polymorphic_argtypes = Module._resolve_polymorphic_argtypes = (e, t2, r, a2) => (_resolve_polymorphic_argtypes = Module._resolve_polymorphic_argtypes = wasmExports.resolve_polymorphic_argtypes)(e, t2, r, a2), _hash_freeze = Module._hash_freeze = (e) => (_hash_freeze = Module._hash_freeze = wasmExports.hash_freeze)(e), _pg_bindtextdomain = Module._pg_bindtextdomain = (e) => (_pg_bindtextdomain = Module._pg_bindtextdomain = wasmExports.pg_bindtextdomain)(e), _DefineCustomBoolVariable = Module._DefineCustomBoolVariable = (e, t2, r, a2, o4, s4, _3, n3, l3, d2) => (_DefineCustomBoolVariable = Module._DefineCustomBoolVariable = wasmExports.DefineCustomBoolVariable)(e, t2, r, a2, o4, s4, _3, n3, l3, d2), _DefineCustomIntVariable = Module._DefineCustomIntVariable = (e, t2, r, a2, o4, s4, _3, n3, l3, d2, p4, m4) => (_DefineCustomIntVariable = Module._DefineCustomIntVariable = wasmExports.DefineCustomIntVariable)(e, t2, r, a2, o4, s4, _3, n3, l3, d2, p4, m4), _DefineCustomRealVariable = Module._DefineCustomRealVariable = (e, t2, r, a2, o4, s4, _3, n3, l3, d2, p4, m4) => (_DefineCustomRealVariable = Module._DefineCustomRealVariable = wasmExports.DefineCustomRealVariable)(e, t2, r, a2, o4, s4, _3, n3, l3, d2, p4, m4), _DefineCustomStringVariable = Module._DefineCustomStringVariable = (e, t2, r, a2, o4, s4, _3, n3, l3, d2) => (_DefineCustomStringVariable = Module._DefineCustomStringVariable = wasmExports.DefineCustomStringVariable)(e, t2, r, a2, o4, s4, _3, n3, l3, d2), _DefineCustomEnumVariable = Module._DefineCustomEnumVariable = (e, t2, r, a2, o4, s4, _3, n3, l3, d2, p4) => (_DefineCustomEnumVariable = Module._DefineCustomEnumVariable = wasmExports.DefineCustomEnumVariable)(e, t2, r, a2, o4, s4, _3, n3, l3, d2, p4), _MarkGUCPrefixReserved = Module._MarkGUCPrefixReserved = (e) => (_MarkGUCPrefixReserved = Module._MarkGUCPrefixReserved = wasmExports.MarkGUCPrefixReserved)(e), _sampler_random_init_state = Module._sampler_random_init_state = (e, t2) => (_sampler_random_init_state = Module._sampler_random_init_state = wasmExports.sampler_random_init_state)(e, t2), _pchomp = Module._pchomp = (e) => (_pchomp = Module._pchomp = wasmExports.pchomp)(e), _PinPortal = Module._PinPortal = (e) => (_PinPortal = Module._PinPortal = wasmExports.PinPortal)(e), _UnpinPortal = Module._UnpinPortal = (e) => (_UnpinPortal = Module._UnpinPortal = wasmExports.UnpinPortal)(e), _xmlBufferWriteCHAR = Module._xmlBufferWriteCHAR = (e, t2) => (_xmlBufferWriteCHAR = Module._xmlBufferWriteCHAR = wasmExports.xmlBufferWriteCHAR)(e, t2), _xmlBufferWriteChar = Module._xmlBufferWriteChar = (e, t2) => (_xmlBufferWriteChar = Module._xmlBufferWriteChar = wasmExports.xmlBufferWriteChar)(e, t2), _xmlReadMemory = Module._xmlReadMemory = (e, t2, r, a2, o4) => (_xmlReadMemory = Module._xmlReadMemory = wasmExports.xmlReadMemory)(e, t2, r, a2, o4), _pthread_mutex_lock = Module._pthread_mutex_lock = (e) => (_pthread_mutex_lock = Module._pthread_mutex_lock = wasmExports.pthread_mutex_lock)(e), _pthread_mutex_unlock = Module._pthread_mutex_unlock = (e) => (_pthread_mutex_unlock = Module._pthread_mutex_unlock = wasmExports.pthread_mutex_unlock)(e), _xmlDocGetRootElement = Module._xmlDocGetRootElement = (e) => (_xmlDocGetRootElement = Module._xmlDocGetRootElement = wasmExports.xmlDocGetRootElement)(e), _xmlXPathIsNaN = Module._xmlXPathIsNaN = (e) => (_xmlXPathIsNaN = Module._xmlXPathIsNaN = wasmExports.xmlXPathIsNaN)(e), _xmlXPathCastToBoolean = Module._xmlXPathCastToBoolean = (e) => (_xmlXPathCastToBoolean = Module._xmlXPathCastToBoolean = wasmExports.xmlXPathCastToBoolean)(e), _xmlXPathCastToNumber = Module._xmlXPathCastToNumber = (e) => (_xmlXPathCastToNumber = Module._xmlXPathCastToNumber = wasmExports.xmlXPathCastToNumber)(e), ___dl_seterr = (e, t2) => (___dl_seterr = wasmExports.__dl_seterr)(e, t2), _getgid = Module._getgid = () => (_getgid = Module._getgid = wasmExports.getgid)(), _getuid = Module._getuid = () => (_getuid = Module._getuid = wasmExports.getuid)(), _gmtime = Module._gmtime = (e) => (_gmtime = Module._gmtime = wasmExports.gmtime)(e), _htonl = (e) => (_htonl = wasmExports.htonl)(e), _htons = (e) => (_htons = wasmExports.htons)(e), _ioctl = Module._ioctl = (e, t2, r) => (_ioctl = Module._ioctl = wasmExports.ioctl)(e, t2, r), _emscripten_builtin_memalign = (e, t2) => (_emscripten_builtin_memalign = wasmExports.emscripten_builtin_memalign)(e, t2), _ntohs = (e) => (_ntohs = wasmExports.ntohs)(e), _perror = Module._perror = (e) => (_perror = Module._perror = wasmExports.perror)(e), _qsort = Module._qsort = (e, t2, r, a2) => (_qsort = Module._qsort = wasmExports.qsort)(e, t2, r, a2), _srand = Module._srand = (e) => (_srand = Module._srand = wasmExports.srand)(e), _rand = Module._rand = () => (_rand = Module._rand = wasmExports.rand)(), __emscripten_timeout = (e, t2) => (__emscripten_timeout = wasmExports._emscripten_timeout)(e, t2), _strcasecmp = Module._strcasecmp = (e, t2) => (_strcasecmp = Module._strcasecmp = wasmExports.strcasecmp)(e, t2), _strerror_r = Module._strerror_r = (e, t2, r) => (_strerror_r = Module._strerror_r = wasmExports.strerror_r)(e, t2, r), _strncat = Module._strncat = (e, t2, r) => (_strncat = Module._strncat = wasmExports.strncat)(e, t2, r), _setThrew = (e, t2) => (_setThrew = wasmExports.setThrew)(e, t2), __emscripten_tempret_set = (e) => (__emscripten_tempret_set = wasmExports._emscripten_tempret_set)(e), __emscripten_tempret_get = () => (__emscripten_tempret_get = wasmExports._emscripten_tempret_get)(), __emscripten_stack_restore = (e) => (__emscripten_stack_restore = wasmExports._emscripten_stack_restore)(e), __emscripten_stack_alloc = (e) => (__emscripten_stack_alloc = wasmExports._emscripten_stack_alloc)(e), _emscripten_stack_get_current = () => (_emscripten_stack_get_current = wasmExports.emscripten_stack_get_current)(), ___wasm_apply_data_relocs = () => (___wasm_apply_data_relocs = wasmExports.__wasm_apply_data_relocs)(), _stderr = Module._stderr = 2536864, _InterruptPending = Module._InterruptPending = 2677888, _MyLatch = Module._MyLatch = 2678076, _CritSectionCount = Module._CritSectionCount = 2677940, _MyProc = Module._MyProc = 2647692, _pg_global_prng_state = Module._pg_global_prng_state = 2624272, _error_context_stack = Module._error_context_stack = 2676184, _GUC_check_errdetail_string = Module._GUC_check_errdetail_string = 2681836, _IsUnderPostmaster = Module._IsUnderPostmaster = 2677969, _CurrentMemoryContext = Module._CurrentMemoryContext = 2683264, _stdout = Module._stdout = 2537168, _debug_query_string = Module._debug_query_string = 2538716, _MyProcPort = Module._MyProcPort = 2678064, ___THREW__ = Module.___THREW__ = 2698932, ___threwValue = Module.___threwValue = 2698936, _MyDatabaseId = Module._MyDatabaseId = 2677948, _TopMemoryContext = Module._TopMemoryContext = 2683268, _PG_exception_stack = Module._PG_exception_stack = 2676188, _MyProcPid = Module._MyProcPid = 2678040, _stdin = Module._stdin = 2537016, _ScanKeywords = Module._ScanKeywords = 2374056, _pg_number_of_ones = Module._pg_number_of_ones = 925120, _LocalBufferBlockPointers = Module._LocalBufferBlockPointers = 2644268, _BufferBlocks = Module._BufferBlocks = 2639004, _wal_level = Module._wal_level = 2387936, _SnapshotAnyData = Module._SnapshotAnyData = 2474112, _maintenance_work_mem = Module._maintenance_work_mem = 2421592, _ParallelWorkerNumber = Module._ParallelWorkerNumber = 2379496, _MainLWLockArray = Module._MainLWLockArray = 2645876, _CurrentResourceOwner = Module._CurrentResourceOwner = 2683312, _work_mem = Module._work_mem = 2421576, _NBuffers = Module._NBuffers = 2421600, _bsysscan = Module._bsysscan = 2625508, _CheckXidAlive = Module._CheckXidAlive = 2625504, _RecentXmin = Module._RecentXmin = 2474204, _TTSOpsHeapTuple = Module._TTSOpsHeapTuple = 2391676, _XactIsoLevel = Module._XactIsoLevel = 2387800, _pgWalUsage = Module._pgWalUsage = 2628976, _pgBufferUsage = Module._pgBufferUsage = 2628848, _TTSOpsVirtual = Module._TTSOpsVirtual = 2391624, _TransamVariables = Module._TransamVariables = 2625496, _TopTransactionContext = Module._TopTransactionContext = 2683288, _RmgrTable = Module._RmgrTable = 2379520, _process_shared_preload_libraries_in_progress = Module._process_shared_preload_libraries_in_progress = 2681232, _wal_segment_size = Module._wal_segment_size = 2387956, _TopTransactionResourceOwner = Module._TopTransactionResourceOwner = 2683320, _arch_module_check_errdetail_string = Module._arch_module_check_errdetail_string = 2638388, _object_access_hook = Module._object_access_hook = 2627616, _InvalidObjectAddress = Module._InvalidObjectAddress = 1520620, _check_function_bodies = Module._check_function_bodies = 2421766, _post_parse_analyze_hook = Module._post_parse_analyze_hook = 2627656, _ScanKeywordTokens = Module._ScanKeywordTokens = 1551648, _None_Receiver = Module._None_Receiver = 2396108, _SPI_processed = Module._SPI_processed = 2629e3, _SPI_tuptable = Module._SPI_tuptable = 2629008, _CacheMemoryContext = Module._CacheMemoryContext = 2683280, _TTSOpsMinimalTuple = Module._TTSOpsMinimalTuple = 2391728, _check_password_hook = Module._check_password_hook = 2627924, _ConfigReloadPending = Module._ConfigReloadPending = 2638376, _max_parallel_maintenance_workers = Module._max_parallel_maintenance_workers = 2421596, _DateStyle = Module._DateStyle = 2421564, _ExecutorStart_hook = Module._ExecutorStart_hook = 2628824, _ExecutorRun_hook = Module._ExecutorRun_hook = 2628828, _ExecutorFinish_hook = Module._ExecutorFinish_hook = 2628832, _ExecutorEnd_hook = Module._ExecutorEnd_hook = 2628836, _SPI_result = Module._SPI_result = 2629012, _ClientAuthentication_hook = Module._ClientAuthentication_hook = 2629184, _set_rel_pathlist_hook = Module._set_rel_pathlist_hook = 2638032, _cpu_tuple_cost = Module._cpu_tuple_cost = 2392184, _cpu_operator_cost = Module._cpu_operator_cost = 2392200, _seq_page_cost = Module._seq_page_cost = 2392168, _planner_hook = Module._planner_hook = 2638072, _ShutdownRequestPending = Module._ShutdownRequestPending = 2638380, _MyStartTime = Module._MyStartTime = 2678048, _cluster_name = Module._cluster_name = 2421816, _application_name = Module._application_name = 2682060, _row_security_policy_hook_restrictive = Module._row_security_policy_hook_restrictive = 2638996, _row_security_policy_hook_permissive = Module._row_security_policy_hook_permissive = 2638992, _BufferDescriptors = Module._BufferDescriptors = 2639e3, _shmem_startup_hook = Module._shmem_startup_hook = 2644948, _ProcessUtility_hook = Module._ProcessUtility_hook = 2647780, _IntervalStyle = Module._IntervalStyle = 2677972, _extra_float_digits = Module._extra_float_digits = 2411992, _pg_crc32_table = Module._pg_crc32_table = 2112304, _xmlFree = Module._xmlFree = 2523416, _shmem_request_hook = Module._shmem_request_hook = 2681236;
        function invoke_iii(e, t2, r) {
          var a2 = stackSave();
          try {
            return getWasmTableEntry(e)(t2, r);
          } catch (o4) {
            if (stackRestore(a2), o4 !== o4 + 0) throw o4;
            _setThrew(1, 0);
          }
        }
        function invoke_viiii(e, t2, r, a2, o4) {
          var s4 = stackSave();
          try {
            getWasmTableEntry(e)(t2, r, a2, o4);
          } catch (_3) {
            if (stackRestore(s4), _3 !== _3 + 0) throw _3;
            _setThrew(1, 0);
          }
        }
        function invoke_vi(e, t2) {
          var r = stackSave();
          try {
            getWasmTableEntry(e)(t2);
          } catch (a2) {
            if (stackRestore(r), a2 !== a2 + 0) throw a2;
            _setThrew(1, 0);
          }
        }
        function invoke_v(e) {
          var t2 = stackSave();
          try {
            getWasmTableEntry(e)();
          } catch (r) {
            if (stackRestore(t2), r !== r + 0) throw r;
            _setThrew(1, 0);
          }
        }
        function invoke_j(e) {
          var t2 = stackSave();
          try {
            return getWasmTableEntry(e)();
          } catch (r) {
            if (stackRestore(t2), r !== r + 0) throw r;
            return _setThrew(1, 0), 0n;
          }
        }
        function invoke_viiiiii(e, t2, r, a2, o4, s4, _3) {
          var n3 = stackSave();
          try {
            getWasmTableEntry(e)(t2, r, a2, o4, s4, _3);
          } catch (l3) {
            if (stackRestore(n3), l3 !== l3 + 0) throw l3;
            _setThrew(1, 0);
          }
        }
        function invoke_vii(e, t2, r) {
          var a2 = stackSave();
          try {
            getWasmTableEntry(e)(t2, r);
          } catch (o4) {
            if (stackRestore(a2), o4 !== o4 + 0) throw o4;
            _setThrew(1, 0);
          }
        }
        function invoke_iiiiii(e, t2, r, a2, o4, s4) {
          var _3 = stackSave();
          try {
            return getWasmTableEntry(e)(t2, r, a2, o4, s4);
          } catch (n3) {
            if (stackRestore(_3), n3 !== n3 + 0) throw n3;
            _setThrew(1, 0);
          }
        }
        function invoke_i(e) {
          var t2 = stackSave();
          try {
            return getWasmTableEntry(e)();
          } catch (r) {
            if (stackRestore(t2), r !== r + 0) throw r;
            _setThrew(1, 0);
          }
        }
        function invoke_ii(e, t2) {
          var r = stackSave();
          try {
            return getWasmTableEntry(e)(t2);
          } catch (a2) {
            if (stackRestore(r), a2 !== a2 + 0) throw a2;
            _setThrew(1, 0);
          }
        }
        function invoke_viii(e, t2, r, a2) {
          var o4 = stackSave();
          try {
            getWasmTableEntry(e)(t2, r, a2);
          } catch (s4) {
            if (stackRestore(o4), s4 !== s4 + 0) throw s4;
            _setThrew(1, 0);
          }
        }
        function invoke_vji(e, t2, r) {
          var a2 = stackSave();
          try {
            getWasmTableEntry(e)(t2, r);
          } catch (o4) {
            if (stackRestore(a2), o4 !== o4 + 0) throw o4;
            _setThrew(1, 0);
          }
        }
        function invoke_iiii(e, t2, r, a2) {
          var o4 = stackSave();
          try {
            return getWasmTableEntry(e)(t2, r, a2);
          } catch (s4) {
            if (stackRestore(o4), s4 !== s4 + 0) throw s4;
            _setThrew(1, 0);
          }
        }
        function invoke_iiiiiiii(e, t2, r, a2, o4, s4, _3, n3) {
          var l3 = stackSave();
          try {
            return getWasmTableEntry(e)(t2, r, a2, o4, s4, _3, n3);
          } catch (d2) {
            if (stackRestore(l3), d2 !== d2 + 0) throw d2;
            _setThrew(1, 0);
          }
        }
        function invoke_iiiii(e, t2, r, a2, o4) {
          var s4 = stackSave();
          try {
            return getWasmTableEntry(e)(t2, r, a2, o4);
          } catch (_3) {
            if (stackRestore(s4), _3 !== _3 + 0) throw _3;
            _setThrew(1, 0);
          }
        }
        function invoke_viiiiiiiii(e, t2, r, a2, o4, s4, _3, n3, l3, d2) {
          var p4 = stackSave();
          try {
            getWasmTableEntry(e)(t2, r, a2, o4, s4, _3, n3, l3, d2);
          } catch (m4) {
            if (stackRestore(p4), m4 !== m4 + 0) throw m4;
            _setThrew(1, 0);
          }
        }
        function invoke_viiiii(e, t2, r, a2, o4, s4) {
          var _3 = stackSave();
          try {
            getWasmTableEntry(e)(t2, r, a2, o4, s4);
          } catch (n3) {
            if (stackRestore(_3), n3 !== n3 + 0) throw n3;
            _setThrew(1, 0);
          }
        }
        function invoke_jii(e, t2, r) {
          var a2 = stackSave();
          try {
            return getWasmTableEntry(e)(t2, r);
          } catch (o4) {
            if (stackRestore(a2), o4 !== o4 + 0) throw o4;
            return _setThrew(1, 0), 0n;
          }
        }
        function invoke_ji(e, t2) {
          var r = stackSave();
          try {
            return getWasmTableEntry(e)(t2);
          } catch (a2) {
            if (stackRestore(r), a2 !== a2 + 0) throw a2;
            return _setThrew(1, 0), 0n;
          }
        }
        function invoke_jiiiiiiiii(e, t2, r, a2, o4, s4, _3, n3, l3, d2) {
          var p4 = stackSave();
          try {
            return getWasmTableEntry(e)(t2, r, a2, o4, s4, _3, n3, l3, d2);
          } catch (m4) {
            if (stackRestore(p4), m4 !== m4 + 0) throw m4;
            return _setThrew(1, 0), 0n;
          }
        }
        function invoke_jiiiiii(e, t2, r, a2, o4, s4, _3) {
          var n3 = stackSave();
          try {
            return getWasmTableEntry(e)(t2, r, a2, o4, s4, _3);
          } catch (l3) {
            if (stackRestore(n3), l3 !== l3 + 0) throw l3;
            return _setThrew(1, 0), 0n;
          }
        }
        function invoke_iiiiiiiiiiiiii(e, t2, r, a2, o4, s4, _3, n3, l3, d2, p4, m4, g5, u2) {
          var f3 = stackSave();
          try {
            return getWasmTableEntry(e)(t2, r, a2, o4, s4, _3, n3, l3, d2, p4, m4, g5, u2);
          } catch (c2) {
            if (stackRestore(f3), c2 !== c2 + 0) throw c2;
            _setThrew(1, 0);
          }
        }
        function invoke_iiiijii(e, t2, r, a2, o4, s4, _3) {
          var n3 = stackSave();
          try {
            return getWasmTableEntry(e)(t2, r, a2, o4, s4, _3);
          } catch (l3) {
            if (stackRestore(n3), l3 !== l3 + 0) throw l3;
            _setThrew(1, 0);
          }
        }
        function invoke_vijiji(e, t2, r, a2, o4, s4) {
          var _3 = stackSave();
          try {
            getWasmTableEntry(e)(t2, r, a2, o4, s4);
          } catch (n3) {
            if (stackRestore(_3), n3 !== n3 + 0) throw n3;
            _setThrew(1, 0);
          }
        }
        function invoke_viji(e, t2, r, a2) {
          var o4 = stackSave();
          try {
            getWasmTableEntry(e)(t2, r, a2);
          } catch (s4) {
            if (stackRestore(o4), s4 !== s4 + 0) throw s4;
            _setThrew(1, 0);
          }
        }
        function invoke_iiji(e, t2, r, a2) {
          var o4 = stackSave();
          try {
            return getWasmTableEntry(e)(t2, r, a2);
          } catch (s4) {
            if (stackRestore(o4), s4 !== s4 + 0) throw s4;
            _setThrew(1, 0);
          }
        }
        function invoke_iiiiiiiii(e, t2, r, a2, o4, s4, _3, n3, l3) {
          var d2 = stackSave();
          try {
            return getWasmTableEntry(e)(t2, r, a2, o4, s4, _3, n3, l3);
          } catch (p4) {
            if (stackRestore(d2), p4 !== p4 + 0) throw p4;
            _setThrew(1, 0);
          }
        }
        function invoke_iiiiiiiiiiiiiiiiii(e, t2, r, a2, o4, s4, _3, n3, l3, d2, p4, m4, g5, u2, f3, c2, w4, x6) {
          var S3 = stackSave();
          try {
            return getWasmTableEntry(e)(t2, r, a2, o4, s4, _3, n3, l3, d2, p4, m4, g5, u2, f3, c2, w4, x6);
          } catch (h3) {
            if (stackRestore(S3), h3 !== h3 + 0) throw h3;
            _setThrew(1, 0);
          }
        }
        function invoke_iiiij(e, t2, r, a2, o4) {
          var s4 = stackSave();
          try {
            return getWasmTableEntry(e)(t2, r, a2, o4);
          } catch (_3) {
            if (stackRestore(s4), _3 !== _3 + 0) throw _3;
            _setThrew(1, 0);
          }
        }
        function invoke_iiiiiii(e, t2, r, a2, o4, s4, _3) {
          var n3 = stackSave();
          try {
            return getWasmTableEntry(e)(t2, r, a2, o4, s4, _3);
          } catch (l3) {
            if (stackRestore(n3), l3 !== l3 + 0) throw l3;
            _setThrew(1, 0);
          }
        }
        function invoke_vj(e, t2) {
          var r = stackSave();
          try {
            getWasmTableEntry(e)(t2);
          } catch (a2) {
            if (stackRestore(r), a2 !== a2 + 0) throw a2;
            _setThrew(1, 0);
          }
        }
        function invoke_iiiiiiiiii(e, t2, r, a2, o4, s4, _3, n3, l3, d2) {
          var p4 = stackSave();
          try {
            return getWasmTableEntry(e)(t2, r, a2, o4, s4, _3, n3, l3, d2);
          } catch (m4) {
            if (stackRestore(p4), m4 !== m4 + 0) throw m4;
            _setThrew(1, 0);
          }
        }
        function invoke_viiji(e, t2, r, a2, o4) {
          var s4 = stackSave();
          try {
            getWasmTableEntry(e)(t2, r, a2, o4);
          } catch (_3) {
            if (stackRestore(s4), _3 !== _3 + 0) throw _3;
            _setThrew(1, 0);
          }
        }
        function invoke_viiiiiiii(e, t2, r, a2, o4, s4, _3, n3, l3) {
          var d2 = stackSave();
          try {
            getWasmTableEntry(e)(t2, r, a2, o4, s4, _3, n3, l3);
          } catch (p4) {
            if (stackRestore(d2), p4 !== p4 + 0) throw p4;
            _setThrew(1, 0);
          }
        }
        function invoke_vij(e, t2, r) {
          var a2 = stackSave();
          try {
            getWasmTableEntry(e)(t2, r);
          } catch (o4) {
            if (stackRestore(a2), o4 !== o4 + 0) throw o4;
            _setThrew(1, 0);
          }
        }
        function invoke_ij(e, t2) {
          var r = stackSave();
          try {
            return getWasmTableEntry(e)(t2);
          } catch (a2) {
            if (stackRestore(r), a2 !== a2 + 0) throw a2;
            _setThrew(1, 0);
          }
        }
        function invoke_viiiiiii(e, t2, r, a2, o4, s4, _3, n3) {
          var l3 = stackSave();
          try {
            getWasmTableEntry(e)(t2, r, a2, o4, s4, _3, n3);
          } catch (d2) {
            if (stackRestore(l3), d2 !== d2 + 0) throw d2;
            _setThrew(1, 0);
          }
        }
        function invoke_viiiji(e, t2, r, a2, o4, s4) {
          var _3 = stackSave();
          try {
            getWasmTableEntry(e)(t2, r, a2, o4, s4);
          } catch (n3) {
            if (stackRestore(_3), n3 !== n3 + 0) throw n3;
            _setThrew(1, 0);
          }
        }
        function invoke_iiij(e, t2, r, a2) {
          var o4 = stackSave();
          try {
            return getWasmTableEntry(e)(t2, r, a2);
          } catch (s4) {
            if (stackRestore(o4), s4 !== s4 + 0) throw s4;
            _setThrew(1, 0);
          }
        }
        function invoke_vid(e, t2, r) {
          var a2 = stackSave();
          try {
            getWasmTableEntry(e)(t2, r);
          } catch (o4) {
            if (stackRestore(a2), o4 !== o4 + 0) throw o4;
            _setThrew(1, 0);
          }
        }
        function invoke_ijiiiiii(e, t2, r, a2, o4, s4, _3, n3) {
          var l3 = stackSave();
          try {
            return getWasmTableEntry(e)(t2, r, a2, o4, s4, _3, n3);
          } catch (d2) {
            if (stackRestore(l3), d2 !== d2 + 0) throw d2;
            _setThrew(1, 0);
          }
        }
        function invoke_viijii(e, t2, r, a2, o4, s4) {
          var _3 = stackSave();
          try {
            getWasmTableEntry(e)(t2, r, a2, o4, s4);
          } catch (n3) {
            if (stackRestore(_3), n3 !== n3 + 0) throw n3;
            _setThrew(1, 0);
          }
        }
        function invoke_iiiiiji(e, t2, r, a2, o4, s4, _3) {
          var n3 = stackSave();
          try {
            return getWasmTableEntry(e)(t2, r, a2, o4, s4, _3);
          } catch (l3) {
            if (stackRestore(n3), l3 !== l3 + 0) throw l3;
            _setThrew(1, 0);
          }
        }
        function invoke_viijiiii(e, t2, r, a2, o4, s4, _3, n3) {
          var l3 = stackSave();
          try {
            getWasmTableEntry(e)(t2, r, a2, o4, s4, _3, n3);
          } catch (d2) {
            if (stackRestore(l3), d2 !== d2 + 0) throw d2;
            _setThrew(1, 0);
          }
        }
        function invoke_viij(e, t2, r, a2) {
          var o4 = stackSave();
          try {
            getWasmTableEntry(e)(t2, r, a2);
          } catch (s4) {
            if (stackRestore(o4), s4 !== s4 + 0) throw s4;
            _setThrew(1, 0);
          }
        }
        function invoke_jiiii(e, t2, r, a2, o4) {
          var s4 = stackSave();
          try {
            return getWasmTableEntry(e)(t2, r, a2, o4);
          } catch (_3) {
            if (stackRestore(s4), _3 !== _3 + 0) throw _3;
            return _setThrew(1, 0), 0n;
          }
        }
        function invoke_viiiiiiiiiiii(e, t2, r, a2, o4, s4, _3, n3, l3, d2, p4, m4, g5) {
          var u2 = stackSave();
          try {
            getWasmTableEntry(e)(t2, r, a2, o4, s4, _3, n3, l3, d2, p4, m4, g5);
          } catch (f3) {
            if (stackRestore(u2), f3 !== f3 + 0) throw f3;
            _setThrew(1, 0);
          }
        }
        function invoke_di(e, t2) {
          var r = stackSave();
          try {
            return getWasmTableEntry(e)(t2);
          } catch (a2) {
            if (stackRestore(r), a2 !== a2 + 0) throw a2;
            _setThrew(1, 0);
          }
        }
        function invoke_id(e, t2) {
          var r = stackSave();
          try {
            return getWasmTableEntry(e)(t2);
          } catch (a2) {
            if (stackRestore(r), a2 !== a2 + 0) throw a2;
            _setThrew(1, 0);
          }
        }
        function invoke_ijiiiii(e, t2, r, a2, o4, s4, _3) {
          var n3 = stackSave();
          try {
            return getWasmTableEntry(e)(t2, r, a2, o4, s4, _3);
          } catch (l3) {
            if (stackRestore(n3), l3 !== l3 + 0) throw l3;
            _setThrew(1, 0);
          }
        }
        function invoke_iiiiiiiiiii(e, t2, r, a2, o4, s4, _3, n3, l3, d2, p4) {
          var m4 = stackSave();
          try {
            return getWasmTableEntry(e)(t2, r, a2, o4, s4, _3, n3, l3, d2, p4);
          } catch (g5) {
            if (stackRestore(m4), g5 !== g5 + 0) throw g5;
            _setThrew(1, 0);
          }
        }
        Module.addRunDependency = addRunDependency, Module.removeRunDependency = removeRunDependency, Module.wasmTable = wasmTable, Module.addFunction = addFunction, Module.removeFunction = removeFunction, Module.setValue = setValue, Module.getValue = getValue, Module.UTF8ToString = UTF8ToString, Module.stringToNewUTF8 = stringToNewUTF8, Module.stringToUTF8OnStack = stringToUTF8OnStack, Module.FS_createPreloadedFile = FS_createPreloadedFile, Module.FS_unlink = FS_unlink, Module.FS_createPath = FS_createPath, Module.FS_createDevice = FS_createDevice, Module.FS = FS, Module.FS_createDataFile = FS_createDataFile, Module.FS_createLazyFile = FS_createLazyFile, Module.MEMFS = MEMFS, Module.IDBFS = IDBFS;
        var calledRun;
        dependenciesFulfilled = function e() {
          calledRun || run(), calledRun || (dependenciesFulfilled = e);
        };
        function callMain(e = []) {
          var t2 = resolveGlobalSymbol("main").sym;
          if (t2) {
            e.unshift(thisProgram);
            var r = e.length, a2 = stackAlloc((r + 1) * 4), o4 = a2;
            e.forEach((_3) => {
              HEAPU32[o4 >> 2] = stringToUTF8OnStack(_3), o4 += 4;
            }), HEAPU32[o4 >> 2] = 0;
            try {
              var s4 = t2(r, a2);
              return exitJS(s4, true), s4;
            } catch (_3) {
              return handleException(_3);
            }
          }
        }
        function run(e = arguments_) {
          if (runDependencies > 0 || (preRun(), runDependencies > 0)) return;
          function t2() {
            calledRun || (calledRun = true, Module.calledRun = true, !ABORT && (initRuntime(), preMain(), readyPromiseResolve(Module), Module.onRuntimeInitialized?.(), shouldRunNow && callMain(e), postRun()));
          }
          Module.setStatus ? (Module.setStatus("Running..."), setTimeout(() => {
            setTimeout(() => Module.setStatus(""), 1), t2();
          }, 1)) : t2();
        }
        if (Module.preInit) for (typeof Module.preInit == "function" && (Module.preInit = [Module.preInit]); Module.preInit.length > 0; ) Module.preInit.pop()();
        var shouldRunNow = true;
        return Module.noInitialRun && (shouldRunNow = false), run(), moduleRtn = readyPromise, moduleRtn;
      };
    })();
    He2 = dt2;
    je2 = He2;
    L5 = class L6 extends k2 {
      constructor(r = {}, a2 = {}) {
        super();
        R(this, C4);
        R(this, _e2, false);
        R(this, te2, false);
        R(this, re2, false);
        R(this, ne2, false);
        R(this, ie, false);
        R(this, xe2, new Y2());
        R(this, we2, new Y2());
        R(this, Se2, new Y2());
        R(this, ye2, new Y2());
        R(this, le2, false);
        this.debug = 0;
        R(this, de2);
        R(this, Me2, []);
        R(this, pe2, new ye());
        R(this, ae);
        R(this, Q2);
        R(this, I2, /* @__PURE__ */ new Map());
        R(this, oe, /* @__PURE__ */ new Set());
        R(this, me2, -1);
        R(this, B, []);
        R(this, $3, false);
        R(this, K2);
        R(this, ue2, -1);
        R(this, se2, []);
        R(this, J2, 0);
        R(this, N2, null);
        R(this, Z2, true);
        R(this, R3, new Uint8Array(0));
        R(this, G3, 0);
        typeof r == "string" ? a2 = { dataDir: r, ...a2 } : a2 = r, this.dataDir = a2.dataDir, a2.parsers !== void 0 && (this.parsers = { ...this.parsers, ...a2.parsers }), a2.serializers !== void 0 && (this.serializers = { ...this.serializers, ...a2.serializers }), a2?.debug !== void 0 && (this.debug = a2.debug), a2?.relaxedDurability !== void 0 && x(this, ie, a2.relaxedDurability), x(this, de2, a2.extensions ?? {}), this.waitReady = T(this, C4, Ve2).call(this, a2 ?? {});
      }
      static async create(r, a2) {
        let o4 = typeof r == "string" ? { dataDir: r, ...a2 ?? {} } : r ?? {}, s4 = new L6(o4);
        return await s4.waitReady, s4;
      }
      get Module() {
        return this.mod;
      }
      get ready() {
        return h(this, _e2) && !h(this, te2) && !h(this, re2);
      }
      get closed() {
        return h(this, re2);
      }
      async close() {
        await this._checkReady(), x(this, te2, true);
        for (let r of h(this, Me2)) await r();
        try {
          await this.execProtocol(k.end()), this.mod._pgl_shutdown(), this.mod.removeFunction(h(this, ue2)), this.mod.removeFunction(h(this, me2));
        } catch (r) {
          let a2 = r;
          if (!(a2.name === "ExitStatus" && a2.status === 0)) throw r;
        }
        await this.fs.closeFs(), x(this, re2, true), x(this, te2, false);
      }
      async [Symbol.asyncDispose]() {
        await this.close();
      }
      async _handleBlob(r) {
        x(this, ae, r ? await r.arrayBuffer() : void 0);
      }
      async _cleanupBlob() {
        x(this, ae, void 0);
      }
      async _getWrittenBlob() {
        if (!h(this, Q2)) return;
        let r = new Blob(h(this, Q2));
        return x(this, Q2, void 0), r;
      }
      async _checkReady() {
        if (h(this, te2)) throw new Error("PGlite is closing");
        if (h(this, re2)) throw new Error("PGlite is closed");
        h(this, _e2) || await this.waitReady;
      }
      execProtocolRawSync(r) {
        let a2 = this.mod;
        return x(this, J2, 0), x(this, G3, 0), x(this, se2, r), h(this, Z2) && h(this, R3).length !== L6.DEFAULT_RECV_BUF_SIZE && x(this, R3, new Uint8Array(L6.DEFAULT_RECV_BUF_SIZE)), a2._interactive_one(r.length, r[0]), x(this, se2, []), h(this, Z2) && h(this, G3) ? new Uint8Array(h(this, R3).subarray(0, h(this, G3))) : new Uint8Array(0);
      }
      async execProtocolRaw(r, { syncToFs: a2 = true } = {}) {
        let o4 = this.execProtocolRawSync(r);
        return a2 && await this.syncToFs(), o4;
      }
      async execProtocol(r, { syncToFs: a2 = true, throwOnError: o4 = true, onNotice: s4 } = {}) {
        x(this, $3, o4), x(this, K2, s4), x(this, B, []), x(this, N2, null);
        let _3 = await this.execProtocolRaw(r, { syncToFs: a2 }), n3 = h(this, N2);
        x(this, $3, false), x(this, K2, void 0), x(this, N2, null);
        let l3 = { messages: h(this, B), data: _3 };
        if (x(this, B, []), o4 && n3) throw x(this, pe2, new ye()), n3;
        return l3;
      }
      async execProtocolStream(r, { syncToFs: a2, throwOnError: o4 = true, onNotice: s4 } = {}) {
        x(this, $3, o4), x(this, K2, s4), x(this, B, []), x(this, N2, null), x(this, Z2, false), await this.execProtocolRaw(r, { syncToFs: a2 }), x(this, Z2, true);
        let _3 = h(this, N2);
        x(this, $3, false), x(this, K2, void 0), x(this, N2, null);
        let n3 = h(this, B);
        if (x(this, B, []), o4 && _3) throw x(this, pe2, new ye()), _3;
        return n3;
      }
      isInTransaction() {
        return h(this, ne2);
      }
      async syncToFs() {
        if (h(this, le2)) return;
        x(this, le2, true);
        let r = async () => {
          await h(this, ye2).runExclusive(async () => {
            x(this, le2, false), await this.fs.syncToFs(h(this, ie));
          });
        };
        h(this, ie) ? r() : await r();
      }
      async listen(r, a2, o4) {
        return this._runExclusiveListen(() => T(this, C4, Ke2).call(this, r, a2, o4));
      }
      async unlisten(r, a2, o4) {
        return this._runExclusiveListen(() => T(this, C4, Ye2).call(this, r, a2, o4));
      }
      onNotification(r) {
        return h(this, oe).add(r), () => {
          h(this, oe).delete(r);
        };
      }
      offNotification(r) {
        h(this, oe).delete(r);
      }
      async dumpDataDir(r) {
        await this._checkReady();
        let a2 = this.dataDir?.split("/").pop() ?? "pgdata";
        return this.fs.dumpTar(a2, r);
      }
      _runExclusiveQuery(r) {
        return h(this, xe2).runExclusive(r);
      }
      _runExclusiveTransaction(r) {
        return h(this, we2).runExclusive(r);
      }
      async clone() {
        let r = await this.dumpDataDir("none");
        return L6.create({ loadDataDir: r, extensions: h(this, de2) });
      }
      _runExclusiveListen(r) {
        return h(this, Se2).runExclusive(r);
      }
    };
    _e2 = /* @__PURE__ */ new WeakMap(), te2 = /* @__PURE__ */ new WeakMap(), re2 = /* @__PURE__ */ new WeakMap(), ne2 = /* @__PURE__ */ new WeakMap(), ie = /* @__PURE__ */ new WeakMap(), xe2 = /* @__PURE__ */ new WeakMap(), we2 = /* @__PURE__ */ new WeakMap(), Se2 = /* @__PURE__ */ new WeakMap(), ye2 = /* @__PURE__ */ new WeakMap(), le2 = /* @__PURE__ */ new WeakMap(), de2 = /* @__PURE__ */ new WeakMap(), Me2 = /* @__PURE__ */ new WeakMap(), pe2 = /* @__PURE__ */ new WeakMap(), ae = /* @__PURE__ */ new WeakMap(), Q2 = /* @__PURE__ */ new WeakMap(), I2 = /* @__PURE__ */ new WeakMap(), oe = /* @__PURE__ */ new WeakMap(), me2 = /* @__PURE__ */ new WeakMap(), B = /* @__PURE__ */ new WeakMap(), $3 = /* @__PURE__ */ new WeakMap(), K2 = /* @__PURE__ */ new WeakMap(), ue2 = /* @__PURE__ */ new WeakMap(), se2 = /* @__PURE__ */ new WeakMap(), J2 = /* @__PURE__ */ new WeakMap(), N2 = /* @__PURE__ */ new WeakMap(), Z2 = /* @__PURE__ */ new WeakMap(), R3 = /* @__PURE__ */ new WeakMap(), G3 = /* @__PURE__ */ new WeakMap(), C4 = /* @__PURE__ */ new WeakSet(), Ve2 = async function(r) {
      if (r.fs) this.fs = r.fs;
      else {
        let { dataDir: m4, fsType: g5 } = Ge2(r.dataDir);
        this.fs = await Ue2(m4, g5);
      }
      let a2 = {}, o4 = [], s4 = [`PGDATA=${C2}`, `PREFIX=${Vr}`, `PGUSER=${r.username ?? "postgres"}`, `PGDATABASE=${r.database ?? "template1"}`, "MODE=REACT", "REPL=N", ...this.debug ? ["-d", this.debug.toString()] : []];
      r.wasmModule || Rr();
      let _3 = r.fsBundle ? r.fsBundle.arrayBuffer() : Er(), n3;
      _3.then((m4) => {
        n3 = m4;
      });
      let l3 = { WASM_PREFIX: Vr, arguments: s4, INITIAL_MEMORY: r.initialMemory, noExitRuntime: true, ...this.debug > 0 ? { print: console.info, printErr: console.error } : { print: () => {
      }, printErr: () => {
      } }, instantiateWasm: (m4, g5) => (Tr(m4, r.wasmModule).then(({ instance: u2, module: f3 }) => {
        g5(u2, f3);
      }), {}), getPreloadedPackage: (m4, g5) => {
        if (m4 === "pglite.data") {
          if (n3.byteLength !== g5) throw new Error(`Invalid FS bundle size: ${n3.byteLength} !== ${g5}`);
          return n3;
        }
        throw new Error(`Unknown package: ${m4}`);
      }, preRun: [(m4) => {
        let g5 = m4.FS.makedev(64, 0), u2 = { open: (f3) => {
        }, close: (f3) => {
        }, read: (f3, c2, w4, x6, S3) => {
          let h3 = h(this, ae);
          if (!h3) throw new Error("No /dev/blob File or Blob provided to read from");
          let b3 = new Uint8Array(h3);
          if (S3 >= b3.length) return 0;
          let v3 = Math.min(b3.length - S3, x6);
          for (let y4 = 0; y4 < v3; y4++) c2[w4 + y4] = b3[S3 + y4];
          return v3;
        }, write: (f3, c2, w4, x6, S3) => (h(this, Q2) ?? x(this, Q2, []), h(this, Q2).push(c2.slice(w4, w4 + x6)), x6), llseek: (f3, c2, w4) => {
          let x6 = h(this, ae);
          if (!x6) throw new Error("No /dev/blob File or Blob provided to llseek");
          let S3 = c2;
          if (w4 === 1 ? S3 += f3.position : w4 === 2 && (S3 = new Uint8Array(x6).length), S3 < 0) throw new m4.FS.ErrnoError(28);
          return S3;
        } };
        m4.FS.registerDevice(g5, u2), m4.FS.mkdev("/dev/blob", g5);
      }] }, { emscriptenOpts: d2 } = await this.fs.init(this, l3);
      l3 = d2;
      for (let [m4, g5] of Object.entries(h(this, de2))) if (g5 instanceof URL) a2[m4] = Fe2(g5);
      else {
        let u2 = await g5.setup(this, l3);
        if (u2.emscriptenOpts && (l3 = u2.emscriptenOpts), u2.namespaceObj) {
          let f3 = this;
          f3[m4] = u2.namespaceObj;
        }
        u2.bundlePath && (a2[m4] = Fe2(u2.bundlePath)), u2.init && o4.push(u2.init), u2.close && h(this, Me2).push(u2.close);
      }
      if (l3.pg_extensions = a2, await _3, this.mod = await je2(l3), x(this, me2, this.mod.addFunction((m4, g5) => {
        let u2;
        try {
          u2 = this.mod.HEAPU8.subarray(m4, m4 + g5);
        } catch (f3) {
          throw console.error("error", f3), f3;
        }
        if (h(this, pe2).parse(u2, (f3) => {
          T(this, C4, Xe2).call(this, f3);
        }), h(this, Z2)) {
          let f3 = u2.slice(), c2 = h(this, G3) + f3.length;
          if (c2 > h(this, R3).length) {
            let w4 = h(this, R3).length + (h(this, R3).length >> 1) + c2;
            c2 > L5.MAX_BUFFER_SIZE && (c2 = L5.MAX_BUFFER_SIZE);
            let x6 = new Uint8Array(w4);
            x6.set(h(this, R3).subarray(0, h(this, G3))), x(this, R3, x6);
          }
          return h(this, R3).set(f3, h(this, G3)), x(this, G3, h(this, G3) + f3.length), h(this, R3).length;
        }
        return g5;
      }, "iii")), x(this, ue2, this.mod.addFunction((m4, g5) => {
        let u2 = h(this, se2).length - h(this, J2);
        u2 > g5 && (u2 = g5);
        try {
          this.mod.HEAP8.set(h(this, se2).subarray(h(this, J2), h(this, J2) + u2), m4), x(this, J2, h(this, J2) + u2);
        } catch (f3) {
          console.log(f3);
        }
        return u2;
      }, "iii")), this.mod._set_read_write_cbs(h(this, ue2), h(this, me2)), await this.fs.initialSyncFs(), r.loadDataDir) {
        if (this.mod.FS.analyzePath(C2 + "/PG_VERSION").exists) throw new Error("Database already exists, cannot load from tarball");
        T(this, C4, fe2).call(this, "pglite: loading data from tarball"), await ce2(this.mod.FS, r.loadDataDir, C2);
      }
      this.mod.FS.analyzePath(C2 + "/PG_VERSION").exists ? T(this, C4, fe2).call(this, "pglite: found DB, resuming") : T(this, C4, fe2).call(this, "pglite: no db"), await Be2(this.mod, (...m4) => T(this, C4, fe2).call(this, ...m4));
      let p4 = this.mod._pgl_initdb();
      if (!p4) throw new Error("INITDB failed to return value");
      if (p4 & 1) throw new Error("INITDB: failed to execute");
      if (p4 & 2) {
        let m4 = r.username ?? "postgres", g5 = r.database ?? "template1";
        if (p4 & 4) {
          if (!(p4 & 12)) throw new Error(`INITDB: Invalid db ${g5}/user ${m4} combination`);
        } else if (g5 !== "template1" && m4 !== "postgres") throw new Error(`INITDB: created a new datadir ${C2}, but an alternative db ${g5}/user ${m4} was requested`);
      }
      this.mod._pgl_backend(), await this.syncToFs(), x(this, _e2, true), await this.exec("SET search_path TO public;"), await this._initArrayTypes();
      for (let m4 of o4) await m4();
    }, Xe2 = function(r) {
      if (!h(this, N2)) {
        if (r instanceof C) h(this, $3) && x(this, N2, r);
        else if (r instanceof te) this.debug > 0 && console.warn(r), h(this, K2) && h(this, K2).call(this, r);
        else if (r instanceof Z) switch (r.text) {
          case "BEGIN":
            x(this, ne2, true);
            break;
          case "COMMIT":
          case "ROLLBACK":
            x(this, ne2, false);
            break;
        }
        else if (r instanceof J) {
          let a2 = h(this, I2).get(r.channel);
          a2 && a2.forEach((o4) => {
            queueMicrotask(() => o4(r.payload));
          }), h(this, oe).forEach((o4) => {
            queueMicrotask(() => o4(r.channel, r.payload));
          });
        }
        h(this, B).push(r);
      }
    }, fe2 = function(...r) {
      this.debug > 0 && console.log(...r);
    }, Ke2 = async function(r, a2, o4) {
      let s4 = Nr(r), _3 = o4 ?? this;
      h(this, I2).has(s4) || h(this, I2).set(s4, /* @__PURE__ */ new Set()), h(this, I2).get(s4).add(a2);
      try {
        await _3.exec(`LISTEN ${r}`);
      } catch (n3) {
        throw h(this, I2).get(s4).delete(a2), h(this, I2).get(s4)?.size === 0 && h(this, I2).delete(s4), n3;
      }
      return async (n3) => {
        await this.unlisten(s4, a2, n3);
      };
    }, Ye2 = async function(r, a2, o4) {
      let s4 = Nr(r), _3 = o4 ?? this, n3 = async () => {
        await _3.exec(`UNLISTEN ${r}`), h(this, I2).get(s4)?.size === 0 && h(this, I2).delete(s4);
      };
      a2 ? (h(this, I2).get(s4)?.delete(a2), h(this, I2).get(s4)?.size === 0 && await n3()) : await n3();
    }, L5.DEFAULT_RECV_BUF_SIZE = 1 * 1024 * 1024, L5.MAX_BUFFER_SIZE = Math.pow(2, 30);
    We2 = L5;
    u();
  }
});

// api/index.ts
var index_exports = {};
__export(index_exports, {
  config: () => config,
  default: () => handler
});
module.exports = __toCommonJS(index_exports);

// backend/src/app.ts
var import_cors = __toESM(require("@fastify/cors"), 1);
var import_fastify = __toESM(require("fastify"), 1);
var import_zod10 = require("zod");

// backend/src/lib/errors.ts
var ApiError = class extends Error {
  code;
  status;
  reqId;
  constructor(code, status, message, reqId = "") {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.reqId = reqId;
  }
  envelope(reqId) {
    return { error: { code: this.code, message: this.message, reqId: this.reqId || reqId } };
  }
};
var badRequest = (message) => new ApiError("VALIDATION_FAILED", 400, message);
var unauthorized = (message = "Unauthorized") => new ApiError("UNAUTHORIZED", 401, message);
var forbidden = (message = "Forbidden") => new ApiError("FORBIDDEN", 403, message);
var notFound = (message = "Not found") => new ApiError("NOT_FOUND", 404, message);
var conflict = (message) => new ApiError("CONFLICT", 409, message);
var rateLimited = (message = "Too many requests") => new ApiError("RATE_LIMITED", 429, message);
var seatLimit = (message = "Seat limit reached") => new ApiError("SEAT_LIMIT", 402, message);
var paymentFailed = (message = "Payment failed") => new ApiError("PAYMENT_FAILED", 402, message);
var planUpgradeRequiredError = (message = "Upgrade your plan to continue") => new ApiError("PLAN_UPGRADE_REQUIRED", 422, message);
var subscriptionRestricted = (message = "Your subscription is restricted because a payment is overdue. Restore billing to continue.") => new ApiError("SUBSCRIPTION_RESTRICTED", statusFor("SUBSCRIPTION_RESTRICTED"), message);
var idempotencyMismatch = (message = "Idempotency-Key reused with a different body") => new ApiError("IDEMPOTENCY_MISMATCH", 422, message);
var idempotencyInProgress = () => new ApiError("IDEMPOTENCY_IN_PROGRESS", 409, "An identical request is already running");
var internal = (message = "Internal error") => new ApiError("INTERNAL", 500, message);
function statusFor(code) {
  switch (code) {
    case "VALIDATION_FAILED":
      return 400;
    case "UNAUTHORIZED":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "CONFLICT":
    case "IDEMPOTENCY_IN_PROGRESS":
      return 409;
    case "SEAT_LIMIT":
    case "PAYMENT_FAILED":
      return 402;
    case "PLAN_UPGRADE_REQUIRED":
    case "IDEMPOTENCY_MISMATCH":
      return 422;
    case "RATE_LIMITED":
      return 429;
    case "SUBSCRIPTION_RESTRICTED":
      return 403;
    case "PAYLOAD_TOO_LARGE":
      return 413;
    default:
      return 500;
  }
}

// backend/src/lib/ids.ts
var import_node_crypto2 = require("node:crypto");

// backend/src/lib/crypto.ts
var import_node_crypto = require("node:crypto");
var import_argon2 = require("@node-rs/argon2");
function sha256(value) {
  return (0, import_node_crypto.createHash)("sha256").update(value).digest("hex");
}
function safeEqual(a2, b3) {
  const left = Buffer.from(a2, "utf8");
  const right = Buffer.from(b3, "utf8");
  if (left.length !== right.length) return false;
  return (0, import_node_crypto.timingSafeEqual)(left, right);
}
async function hashPassword(password) {
  return (0, import_argon2.hash)(password, { algorithm: import_argon2.Algorithm.Argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 });
}
async function verifyPassword(hash, password) {
  try {
    return await (0, import_argon2.verify)(hash, password);
  } catch {
    return false;
  }
}
function randomSecret(bytes = 32) {
  return (0, import_node_crypto.randomBytes)(bytes).toString("base64url");
}

// backend/src/lib/ids.ts
function newId() {
  return (0, import_node_crypto2.randomUUID)();
}
function randomToken(bytes = 32) {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(bytes))).toString("base64url");
}

// backend/src/lib/telemetry.ts
function parseDsn(dsn) {
  try {
    const url = new URL(dsn);
    const projectId = url.pathname.replace(/^\/+/, "");
    if (!url.username || !projectId) return null;
    return {
      storeUrl: `${url.protocol}//${url.host}/api/${projectId}/store/`,
      auth: `Sentry sentry_version=7, sentry_key=${url.username}, sentry_client=rota-api/0.1.0`
    };
  } catch {
    return null;
  }
}
function describe(error) {
  if (error instanceof Error) return { type: error.name, value: error.message };
  if (typeof error === "string") return { type: "Error", value: error };
  try {
    return { type: "Error", value: JSON.stringify(error) };
  } catch {
    return { type: "Error", value: "Unknown error" };
  }
}
function createErrorReporter(env, log) {
  const target = env.SENTRY_DSN ? parseDsn(env.SENTRY_DSN) : null;
  if (!target) return { capture: () => void 0 };
  return {
    capture(error, context = {}) {
      const { type, value } = describe(error);
      const stack = error instanceof Error ? error.stack : void 0;
      const event = {
        event_id: crypto.randomUUID().replace(/-/g, ""),
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        platform: "node",
        level: "error",
        environment: env.NODE_ENV,
        exception: { values: [{ type, value, stacktrace: stack ? { frames: [{ filename: "rota-api" }] } : void 0 }] },
        extra: context
      };
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2e3);
      void fetch(target.storeUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-sentry-auth": target.auth
        },
        body: JSON.stringify(event),
        signal: controller.signal
      }).catch((err2) => log.debug({ err: err2 }, "sentry capture failed")).finally(() => clearTimeout(timer));
    }
  };
}

// backend/src/routes/health.ts
async function readiness(deps) {
  const checks = {};
  checks.database = deps.topology.global ? "ok" : "fail";
  try {
    await deps.topology.global.query("SELECT 1");
  } catch {
    checks.database = "fail";
  }
  const shardResults = await Promise.all(
    deps.topology.shards.map((shard) => shard.query("SELECT 1").then(() => true).catch(() => false))
  );
  checks.shards = shardResults.every(Boolean) ? "ok" : "fail";
  checks.redis = deps.rateLimiter.healthy() ? "ok" : "fail";
  if (deps.queue.healthy) {
    checks.queue = await deps.queue.healthy().catch(() => false) ? "ok" : "fail";
  } else {
    checks.queue = "ok";
  }
  const production = deps.env.NODE_ENV === "production";
  checks.mail = deps.env.MAIL_DRIVER === "resend" && deps.env.RESEND_API_KEY && deps.env.MAIL_FROM ? "ok" : production ? "fail" : "ok";
  checks.payments = deps.env.FLUTTERWAVE_SECRET_KEY && deps.env.FLUTTERWAVE_SECRET_HASH ? "ok" : production ? "fail" : "ok";
  return { ok: Object.values(checks).every((value) => value === "ok"), checks };
}
function registerHealthRoutes(app, deps) {
  app.get("/healthz", async () => ({ status: "ok" }));
  app.get("/readyz", async (_req, reply) => {
    const result = await readiness(deps);
    reply.status(result.ok ? 200 : 503);
    return { status: result.ok ? "ok" : "degraded", checks: result.checks };
  });
  app.get("/metrics", async (_req, reply) => {
    const metrics = deps.metrics;
    const ready = await readiness(deps);
    let webhookCounts = [];
    try {
      webhookCounts = await deps.topology.global.query(
        "SELECT status, count(*)::text AS count FROM webhook_events GROUP BY status"
      );
    } catch {
      webhookCounts = [];
    }
    const lines = [
      "# HELP rota_uptime_seconds Process uptime in seconds.",
      "# TYPE rota_uptime_seconds gauge",
      `rota_uptime_seconds ${metrics ? Math.floor((Date.now() - metrics.startedAt) / 1e3) : 0}`,
      "# HELP rota_ready Whether every readiness check passed.",
      "# TYPE rota_ready gauge",
      `rota_ready ${ready.ok ? 1 : 0}`,
      "# HELP rota_http_requests_total HTTP requests served.",
      "# TYPE rota_http_requests_total counter",
      `rota_http_requests_total ${metrics?.requests ?? 0}`,
      "# HELP rota_http_errors_total HTTP responses with status >= 500.",
      "# TYPE rota_http_errors_total counter",
      `rota_http_errors_total ${metrics?.errors ?? 0}`,
      "# HELP rota_http_responses_total HTTP responses by status code.",
      "# TYPE rota_http_responses_total counter",
      ...Object.entries(metrics?.byStatus ?? {}).map(
        ([status, count]) => `rota_http_responses_total{status="${status}"} ${count}`
      ),
      "# HELP rota_webhook_events Webhook inbox rows by status.",
      "# TYPE rota_webhook_events gauge",
      ...webhookCounts.map((row) => `rota_webhook_events{status="${row.status}"} ${row.count}`),
      ""
    ];
    reply.type("text/plain; version=0.0.4");
    return lines.join("\n");
  });
}

// packages/contract/src/index.ts
var import_zod = require("zod");
var Id = import_zod.z.string().uuid();
var Cursor = import_zod.z.string().min(1).max(512);
var CursorPayload = import_zod.z.object({
  t: import_zod.z.string().datetime(),
  i: Id
});
var Role = import_zod.z.enum(["owner", "admin", "manager", "member"]);
var PlanKey = import_zod.z.enum(["starter", "team", "business"]);
var SubscriptionStatus = import_zod.z.enum([
  "trialing",
  "active",
  "past_due",
  "restricted",
  "canceled"
]);
var SwapStatus = import_zod.z.enum(["pending", "approved", "rejected", "canceled"]);
var AssignmentStatus = import_zod.z.enum(["pending", "accepted", "declined"]);
var IsoDateTime = import_zod.z.string().datetime({ offset: true });
var ErrorCode = import_zod.z.enum([
  "VALIDATION_FAILED",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "RATE_LIMITED",
  "PAYMENT_FAILED",
  "SEAT_LIMIT",
  "PLAN_UPGRADE_REQUIRED",
  "IDEMPOTENCY_MISMATCH",
  "IDEMPOTENCY_IN_PROGRESS",
  "SUBSCRIPTION_RESTRICTED",
  "PAYLOAD_TOO_LARGE",
  "INTERNAL"
]);
var ErrorEnvelope = import_zod.z.object({
  error: import_zod.z.object({
    code: ErrorCode,
    message: import_zod.z.string(),
    reqId: import_zod.z.string()
  })
});
var Email = import_zod.z.string().email().max(320);
var Password = import_zod.z.string().min(10).max(200);
var AvatarContentType = import_zod.z.enum(["image/jpeg", "image/png", "image/webp"]);
var AVATAR_MAX_BYTES = 2 * 1024 * 1024;
var AVATAR_MAX_BASE64 = Math.ceil(AVATAR_MAX_BYTES * 4 / 3) + 4;
var RequestBodies = {
  signup: import_zod.z.object({
    email: Email,
    password: Password,
    name: import_zod.z.string().min(1).max(80),
    /** pending invite token from a deep link; consumed after account creation */
    inviteToken: import_zod.z.string().min(1).max(200).optional()
  }).strict(),
  login: import_zod.z.object({
    email: Email,
    password: Password,
    deviceId: import_zod.z.string().min(1).max(120)
  }).strict(),
  magicStart: import_zod.z.object({ email: Email }).strict(),
  magicConsume: import_zod.z.object({ token: import_zod.z.string().min(10).max(200), deviceId: import_zod.z.string().min(1).max(120) }).strict(),
  refresh: import_zod.z.object({ refreshToken: import_zod.z.string().min(10).max(512), deviceId: import_zod.z.string().min(1).max(120) }).strict(),
  logout: import_zod.z.object({ refreshToken: import_zod.z.string().min(10).max(512) }).strict(),
  forgot: import_zod.z.object({ email: Email }).strict(),
  reset: import_zod.z.object({ token: import_zod.z.string().min(10).max(200), password: Password }).strict(),
  acceptInvite: import_zod.z.object({ token: import_zod.z.string().min(10).max(200) }).strict(),
  createTeam: import_zod.z.object({ name: import_zod.z.string().min(1).max(80) }).strict(),
  createInvite: import_zod.z.object({ email: Email, role: Role.exclude(["owner"]) }).strict(),
  createShift: import_zod.z.object({
    userId: Id,
    startsAt: IsoDateTime,
    endsAt: IsoDateTime,
    role: import_zod.z.string().min(1).max(60).optional(),
    location: import_zod.z.string().min(1).max(60).optional(),
    meetingUrl: import_zod.z.string().url().max(500).optional(),
    notes: import_zod.z.string().max(280).optional()
  }).strict(),
  updateShift: import_zod.z.object({
    /** reassign to another active member (omitted = keep the current assignee) */
    userId: Id.optional(),
    startsAt: IsoDateTime.optional(),
    endsAt: IsoDateTime.optional(),
    role: import_zod.z.string().min(1).max(60).nullish(),
    location: import_zod.z.string().min(1).max(60).nullish(),
    meetingUrl: import_zod.z.string().url().max(500).nullish(),
    notes: import_zod.z.string().max(280).nullish()
  }).strict(),
  createSwapRequest: import_zod.z.object({
    /** open request = no target; targeted request names the colleague */
    toUserId: Id.optional(),
    note: import_zod.z.string().max(280).optional()
  }).strict(),
  decideSwap: import_zod.z.object({ decision: import_zod.z.enum(["approve", "reject"]) }).strict(),
  /** the assignee answers an assignment: `decline` releases the shift */
  respondToShift: import_zod.z.object({ action: import_zod.z.enum(["accept", "decline"]) }).strict(),
  checkout: import_zod.z.object({
    planKey: PlanKey,
    seats: import_zod.z.number().int().min(1).max(500),
    callbackUrl: import_zod.z.string().url().max(500).optional()
  }).strict(),
  patchSettings: import_zod.z.object({
    changes: import_zod.z.object({
      quiet_start: import_zod.z.string().regex(/^\d{2}:\d{2}$/).optional(),
      quiet_end: import_zod.z.string().regex(/^\d{2}:\d{2}$/).optional(),
      time_zone: import_zod.z.string().min(1).max(64).optional(),
      notif_shifts: import_zod.z.boolean().optional(),
      notif_swaps: import_zod.z.boolean().optional(),
      notif_billing: import_zod.z.boolean().optional(),
      language: import_zod.z.enum(["en"]).optional(),
      theme: import_zod.z.enum(["system", "light", "dark", "sage"]).optional()
    }).strict(),
    /** per-field server updatedAt the client last saw (settings-sync) */
    baseUpdatedAt: import_zod.z.record(import_zod.z.string(), import_zod.z.string().datetime()).optional()
  }).strict(),
  putPushToken: import_zod.z.object({ pushToken: import_zod.z.string().min(10).max(400) }).strict(),
  /** the user's own profile photo, base64-encoded (no data: prefix) */
  putAvatar: import_zod.z.object({
    dataBase64: import_zod.z.string().min(1).max(AVATAR_MAX_BASE64),
    contentType: AvatarContentType
  }).strict()
};
var QueryParams = {
  feed: import_zod.z.object({
    cursor: Cursor.optional(),
    limit: import_zod.z.coerce.number().int().min(1).max(50).optional()
  }).strict(),
  shifts: import_zod.z.object({
    mine: import_zod.z.enum(["0", "1"]).optional(),
    from: import_zod.z.string().datetime({ offset: true }),
    to: import_zod.z.string().datetime({ offset: true })
  }).strict(),
  swaps: import_zod.z.object({
    status: SwapStatus.optional(),
    cursor: Cursor.optional(),
    limit: import_zod.z.coerce.number().int().min(1).max(50).optional()
  }).strict(),
  ledger: import_zod.z.object({
    cursor: Cursor.optional(),
    limit: import_zod.z.coerce.number().int().min(1).max(50).optional()
  }).strict(),
  /** `?v=` is the upload version of the photo (cache busting) */
  avatar: import_zod.z.object({ v: import_zod.z.string().max(64).optional() }).strict()
};
var PathParams = {
  deviceId: import_zod.z.object({ deviceId: import_zod.z.string().min(1).max(120) }).strict(),
  userId: import_zod.z.object({ userId: import_zod.z.string().uuid() }).strict()
};
var PublicUser = import_zod.z.object({
  id: Id,
  name: import_zod.z.string(),
  /** masked for privacy: jâ€¢â€¢â€¢@example.com */
  emailMasked: import_zod.z.string(),
  role: Role,
  active: import_zod.z.boolean(),
  /** the user's own uploaded photo (API path), null when they have none */
  avatarUrl: import_zod.z.string().nullable()
});
var SelfUser = import_zod.z.object({
  id: Id,
  name: import_zod.z.string(),
  email: Email,
  tokenVersion: import_zod.z.number().int(),
  timezone: import_zod.z.string(),
  /** the signed-in user's own uploaded photo (API path), null when they have none */
  avatarUrl: import_zod.z.string().nullable()
});
var AuthTokens = import_zod.z.object({
  accessToken: import_zod.z.string().min(10),
  refreshToken: import_zod.z.string().min(10),
  /** access token lifetime, seconds â€” the client refreshes before it expires */
  expiresIn: import_zod.z.number().int().positive()
});
var SessionPayload = import_zod.z.object({
  user: SelfUser,
  tokens: AuthTokens,
  team: import_zod.z.object({ id: Id, name: import_zod.z.string(), role: Role }).nullable()
});
var Plan = import_zod.z.object({
  key: PlanKey,
  name: import_zod.z.string(),
  priceCents: import_zod.z.number().int().nonnegative(),
  currency: import_zod.z.literal("USD"),
  includedSeats: import_zod.z.number().int().positive(),
  extraSeatCents: import_zod.z.number().int().nonnegative().nullable(),
  maxSeats: import_zod.z.number().int().positive()
});
var Subscription = import_zod.z.object({
  teamId: Id,
  planKey: PlanKey,
  status: SubscriptionStatus,
  seats: import_zod.z.number().int().positive(),
  extraSeats: import_zod.z.number().int().nonnegative(),
  periodStart: import_zod.z.string().datetime(),
  periodEnd: import_zod.z.string().datetime(),
  /** what the next renewal will cost, integer cents, from the plans table */
  nextAmountCents: import_zod.z.number().int().nonnegative(),
  graceUntil: import_zod.z.string().datetime().nullable(),
  pendingPlanKey: PlanKey.nullable(),
  pendingSeats: import_zod.z.number().int().positive().nullable()
});
var Shift = import_zod.z.object({
  id: Id,
  teamId: Id,
  /** null when the shift is open / unassigned. */
  userId: Id.nullable(),
  user: PublicUser.pick({ id: true, name: true, avatarUrl: true }).nullable(),
  /** the assignee's answer ï¿½?" absent only on payloads built before the column existed */
  assignmentStatus: AssignmentStatus.optional(),
  startsAt: import_zod.z.string().datetime(),
  endsAt: import_zod.z.string().datetime(),
  role: import_zod.z.string().nullable(),
  location: import_zod.z.string().nullable(),
  meetingUrl: import_zod.z.string().nullable().optional(),
  notes: import_zod.z.string().nullable(),
  version: import_zod.z.number().int().positive()
});
var ActivityItem = import_zod.z.object({
  id: Id,
  type: import_zod.z.string(),
  actor: PublicUser.pick({ id: true, name: true, avatarUrl: true }).nullable(),
  summary: import_zod.z.string(),
  data: import_zod.z.record(import_zod.z.string(), import_zod.z.unknown()).optional(),
  createdAt: import_zod.z.string().datetime()
});
var SwapRequest = import_zod.z.object({
  id: Id,
  shift: Shift,
  fromUser: PublicUser,
  toUser: PublicUser.nullable(),
  status: SwapStatus,
  note: import_zod.z.string().nullable(),
  createdAt: import_zod.z.string().datetime(),
  decidedAt: import_zod.z.string().datetime().nullable()
});
var LedgerEntry = import_zod.z.object({
  id: Id,
  kind: import_zod.z.enum(["charge", "credit", "refund", "adjustment"]),
  amountCents: import_zod.z.number().int(),
  currency: import_zod.z.literal("USD"),
  ref: import_zod.z.string(),
  reason: import_zod.z.string(),
  createdAt: import_zod.z.string().datetime()
});
var Settings = import_zod.z.object({
  quiet_start: import_zod.z.string(),
  quiet_end: import_zod.z.string(),
  time_zone: import_zod.z.string(),
  notif_shifts: import_zod.z.boolean(),
  notif_swaps: import_zod.z.boolean(),
  notif_billing: import_zod.z.boolean(),
  language: import_zod.z.enum(["en"]),
  theme: import_zod.z.enum(["system", "light", "dark", "sage"])
});
var SettingsEnvelope = import_zod.z.object({
  values: Settings,
  /** per-field server updatedAt, ISO; the client sends its base for conflict detection */
  updatedAt: import_zod.z.record(import_zod.z.string(), import_zod.z.string().datetime()),
  conflicts: import_zod.z.array(Settings.keyof()).optional()
});
var SwapSuggestion = import_zod.z.object({
  userId: Id,
  name: import_zod.z.string(),
  score: import_zod.z.number(),
  eligible: import_zod.z.boolean(),
  reasons: import_zod.z.array(import_zod.z.string()).max(10),
  blockers: import_zod.z.array(import_zod.z.string()).max(10),
  /** optional LLM wording; deterministic reasons stay authoritative */
  sentence: import_zod.z.string().nullable()
});
var SwapSuggestionsResponse = import_zod.z.object({
  shiftId: Id,
  suggestions: import_zod.z.array(SwapSuggestion).max(3),
  /** always present so the UI can show "why" without the model */
  deterministic: import_zod.z.literal(true)
});

// backend/src/auth/tokens.ts
var import_jose = require("jose");
var ACCESS_TTL_SECONDS = 15 * 60;
var REFRESH_TTL_DAYS = 30;
var encoder = new TextEncoder();
async function issueAccessToken(secret, userId, tokenVersion) {
  return new import_jose.SignJWT({ tv: tokenVersion }).setProtectedHeader({ alg: "HS256" }).setSubject(userId).setIssuedAt().setExpirationTime(`${ACCESS_TTL_SECONDS}s`).sign(encoder.encode(secret));
}
async function verifyAccessToken(secret, token) {
  try {
    const { payload } = await (0, import_jose.jwtVerify)(token, encoder.encode(secret), { algorithms: ["HS256"] });
    if (typeof payload.sub !== "string" || typeof payload.tv !== "number") return null;
    return { sub: payload.sub, tv: payload.tv };
  } catch {
    return null;
  }
}
async function createSession(db, userId, deviceId, familyId = newId()) {
  const refreshToken = randomSecret(32);
  const expiresAt = new Date(Date.now() + REFRESH_TTL_DAYS * 864e5);
  await db.query(
    `INSERT INTO refresh_tokens (id, family_id, user_id, device_id, token_hash, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [newId(), familyId, userId, deviceId, sha256(refreshToken), expiresAt]
  );
  return { familyId, refreshToken, expiresAt };
}
async function rotateRefresh(db, refreshToken, deviceId) {
  const row = await db.one(
    `SELECT id, family_id, user_id, device_id, used_at, revoked_at, expires_at
       FROM refresh_tokens WHERE token_hash = $1`,
    [sha256(refreshToken)]
  );
  if (!row) return { ok: false, reason: "unknown" };
  if (row.revoked_at || row.used_at) {
    await revokeFamily(db, row.family_id);
    return { ok: false, reason: "reused" };
  }
  if (row.expires_at.getTime() <= Date.now()) return { ok: false, reason: "expired" };
  await db.query("UPDATE refresh_tokens SET used_at = now() WHERE id = $1", [row.id]);
  const next = await createSession(db, row.user_id, deviceId || row.device_id, row.family_id);
  return {
    ok: true,
    userId: row.user_id,
    familyId: row.family_id,
    refreshToken: next.refreshToken,
    expiresAt: next.expiresAt
  };
}
async function revokeFamily(db, familyId) {
  await db.query("UPDATE refresh_tokens SET revoked_at = now() WHERE family_id = $1 AND revoked_at IS NULL", [
    familyId
  ]);
}
async function revokeAllForUser(db, userId) {
  await db.tx(async (tx) => {
    await tx.query("UPDATE refresh_tokens SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL", [
      userId
    ]);
    await tx.query("UPDATE users SET token_version = token_version + 1, updated_at = now() WHERE id = $1", [
      userId
    ]);
  });
}
var ONE_TIME_TTL = { magic: 15 * 6e4, reset: 30 * 6e4 };
async function issueOneTime(db, userId, purpose) {
  const token = randomSecret(32);
  const expiresAt = new Date(Date.now() + ONE_TIME_TTL[purpose]);
  await db.query(
    `INSERT INTO one_time_tokens (id, user_id, purpose, token_hash, expires_at) VALUES ($1, $2, $3, $4, $5)`,
    [newId(), userId, purpose, sha256(token), expiresAt]
  );
  return { token, expiresAt };
}
async function consumeOneTime(db, token, purpose) {
  return db.tx(async (tx) => {
    const row = await tx.one(
      `SELECT id, user_id, expires_at, used_at FROM one_time_tokens WHERE token_hash = $1 AND purpose = $2`,
      [sha256(token), purpose]
    );
    if (!row || !row.user_id || row.used_at || row.expires_at.getTime() <= Date.now()) return null;
    const updated = await tx.query(
      "UPDATE one_time_tokens SET used_at = now() WHERE id = $1 AND used_at IS NULL RETURNING id",
      [row.id]
    );
    if (updated.length === 0) return null;
    return row.user_id;
  });
}

// backend/src/jobs/mail.ts
var import_promises = require("node:fs/promises");
var import_node_path = __toESM(require("node:path"), 1);
var EMAIL_QUEUE = "email";
var RESEND_ENDPOINT = "https://api.resend.com/emails";
async function deliverMail(env, mail, log) {
  log.info({ to: mail.to, kind: mail.kind, subject: mail.subject }, "mail");
  if (env.MAIL_DRIVER === "dev") {
    const mailbox = import_node_path.default.join(process.cwd(), ".mail.jsonl");
    try {
      await (0, import_promises.mkdir)(import_node_path.default.dirname(mailbox), { recursive: true });
      await (0, import_promises.appendFile)(mailbox, `${JSON.stringify({ at: (/* @__PURE__ */ new Date()).toISOString(), ...mail })}
`, "utf8");
    } catch {
    }
    return;
  }
  if (env.MAIL_DRIVER === "log") return;
  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      from: env.MAIL_FROM,
      to: [mail.to],
      subject: mail.subject,
      text: mail.text
    })
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`mail provider rejected ${mail.kind} (${res.status}): ${detail.slice(0, 200)}`);
  }
}
function registerMailJobs(queue, env, log) {
  queue.register(EMAIL_QUEUE, async (payload) => {
    await deliverMail(env, payload, log);
  });
}
async function enqueueMail(queue, mail) {
  await queue.add(EMAIL_QUEUE, mail, { attempts: 5 });
}
function magicLinkMail(to, baseUrl, token, expiresAt) {
  const link = `rota://auth/magic?token=${encodeURIComponent(token)}`;
  return {
    to,
    kind: "magic",
    subject: "Your Rota sign-in link",
    text: [
      "Use this link on the device you signed in from:",
      "",
      link,
      "",
      `Or enter this code in the app: ${token}`,
      "",
      `It expires ${expiresAt.toISOString()}.`,
      "If you did not ask for this, you can ignore this email."
    ].join("\n")
  };
}
function resetMail(to, token, expiresAt) {
  return {
    to,
    kind: "reset",
    subject: "Reset your Rota password",
    text: [
      "Open this link to choose a new password:",
      "",
      `rota://auth/reset?token=${encodeURIComponent(token)}`,
      "",
      `Or use this code in the app: ${token}`,
      "",
      `It expires ${expiresAt.toISOString()}.`,
      "If you did not ask for this, you can ignore this email."
    ].join("\n")
  };
}
function inviteMail(to, input) {
  const link = `${input.baseUrl}/v1/i/${encodeURIComponent(input.token)}`;
  return {
    to,
    kind: "invite",
    subject: `You have been invited to ${input.teamName} on Rota`,
    text: [
      `Accept your ${input.role} invite to ${input.teamName}:`,
      "",
      link,
      "",
      `Or open rota://invite/${input.token} in the app.`,
      `This invite expires ${input.expiresAt.toISOString()}.`
    ].join("\n")
  };
}

// backend/src/lib/policy.ts
var ALL = ["owner", "admin", "manager", "member"];
var SCHEDULERS = ["owner", "admin", "manager"];
var ADMINS = ["owner", "admin"];
var OWNER = ["owner"];
var POLICY = {
  "me.read": ALL,
  "settings.read": ALL,
  "settings.write": ALL,
  "plans.read": ALL,
  "team.read": ALL,
  "team.update": ADMINS,
  "team.invite": ADMINS,
  "team.removeMember": ADMINS,
  "member.read": ALL,
  "shift.read": ALL,
  "shift.create": SCHEDULERS,
  "shift.update": SCHEDULERS,
  "shift.delete": SCHEDULERS,
  "shift.respond": ALL,
  "swap.read": ALL,
  "swap.request": ALL,
  // Swaps get manager approval: only schedulers approve or decline someone
  // else's request. The requester withdrawing their own is handled at the
  // route (it never reaches `can`) so every role may cancel their own.
  "swap.decide": SCHEDULERS,
  "swap.suggest": ALL,
  "feed.read": ALL,
  "billing.read": ADMINS,
  "billing.ledger": OWNER,
  "billing.checkout": OWNER
};
function can(role, action) {
  const allowed = POLICY[action];
  if (!allowed) throw new Error(`Unknown policy action: ${action}`);
  return allowed.includes(role);
}

// backend/src/http/auth.ts
function bearer(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim();
}
async function requireUser(env, topology, req) {
  if (req.authz) return req.authz.user;
  const token = bearer(req);
  if (!token) throw unauthorized();
  const claims = await verifyAccessToken(env.JWT_SECRET, token);
  if (!claims) throw unauthorized();
  const user = await topology.global.one(
    "SELECT id, email, name, token_version, timezone FROM users WHERE id = $1",
    [claims.sub]
  );
  if (!user || user.token_version !== claims.tv) throw unauthorized();
  req.authz = { userId: user.id, user };
  return user;
}
async function requireMembership(env, topology, req, teamId) {
  const user = await requireUser(env, topology, req);
  const scope = topology.scopeFor(teamId);
  const member = await topology.shardDb(scope).one(
    "SELECT role, active FROM team_members WHERE team_id = $1 AND user_id = $2",
    [teamId, user.id]
  );
  if (!member || !member.active) throw notFound();
  req.team = { scope, role: member.role };
  return { user, scope, role: member.role };
}
function assertCan(role, action) {
  if (!can(role, action)) throw forbidden();
}
function clientIp(req) {
  return req.ip;
}

// backend/src/http/rate-limit.ts
var import_node_crypto3 = require("node:crypto");
var MemoryRateStore = class {
  hits = /* @__PURE__ */ new Map();
  clear() {
    this.hits.clear();
  }
  async hit(key, windowMs, limit) {
    const now = Date.now();
    const window2 = (this.hits.get(key) ?? []).filter((t2) => now - t2 < windowMs);
    window2.push(now);
    this.hits.set(key, window2);
    return { allowed: window2.length <= limit, remaining: Math.max(0, limit - window2.length) };
  }
  healthy() {
    return true;
  }
  async close() {
    this.hits.clear();
  }
};
var RedisRateStore = class {
  constructor(redis) {
    this.redis = redis;
  }
  redis;
  broken = false;
  async hit(key, windowMs, limit) {
    try {
      const count = await this.redis.incr(key);
      if (count === 1) await this.redis.pexpire(key, windowMs);
      this.broken = false;
      return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
    } catch {
      this.broken = true;
      throw new Error("rate limit store unavailable");
    }
  }
  healthy() {
    return !this.broken;
  }
  async close() {
    try {
      await this.redis.quit();
    } catch {
    }
  }
};
var RATE_RULES = {
  login: { bucket: "auth:login", limit: 10, windowMs: 6e4, failClosed: true },
  signup: { bucket: "auth:signup", limit: 5, windowMs: 6e4, failClosed: true },
  magic: { bucket: "auth:magic", limit: 5, windowMs: 6e4, failClosed: true },
  forgot: { bucket: "auth:forgot", limit: 5, windowMs: 3e5, failClosed: true },
  reset: { bucket: "auth:reset", limit: 10, windowMs: 3e5, failClosed: true },
  refresh: { bucket: "auth:refresh", limit: 60, windowMs: 6e4, failClosed: true },
  checkout: { bucket: "billing:checkout", limit: 10, windowMs: 6e4, failClosed: true },
  swapSuggest: { bucket: "swap:suggest", limit: 30, windowMs: 6e4, failClosed: false },
  read: { bucket: "read", limit: 600, windowMs: 6e4, failClosed: false }
};
var RateLimiter = class {
  constructor(store, log) {
    this.store = store;
    this.log = log;
  }
  store;
  log;
  /**
   * Throws the contract's RATE_LIMITED error when the caller is over budget or
   * when a fail-closed bucket cannot reach its store.
   */
  async enforce(rule, identity) {
    const key = `${rule.bucket}:${identity}`;
    try {
      const decision = await this.store.hit(key, rule.windowMs, rule.limit);
      if (!decision.allowed) throw rateLimited();
    } catch (error) {
      if (error instanceof Error && error.name === "ApiError") throw error;
      if (rule.failClosed) {
        this.log.error({ bucket: rule.bucket }, "rate limit store down \u2014 failing closed");
        throw rateLimited("Service temporarily unavailable");
      }
      this.log.error({ bucket: rule.bucket, err: error }, "rate limit store down \u2014 failing open");
    }
  }
  healthy() {
    return this.store.healthy();
  }
  close() {
    return this.store.close();
  }
  clearLimits() {
    this.store.clear?.();
  }
};
function hashKey(...parts2) {
  return (0, import_node_crypto3.createHash)("sha256").update(parts2.join(":")).digest("hex").slice(0, 32);
}
async function createRateLimiter(env, log) {
  const required = env.NODE_ENV === "production";
  if (env.REDIS_URL) {
    try {
      const { default: Redis } = await import("ioredis");
      const client = new Redis(env.REDIS_URL, { maxRetriesPerRequest: 1, lazyConnect: true, connectTimeout: 5e3 });
      await client.connect();
      await client.ping();
      return new RateLimiter(new RedisRateStore(client), log);
    } catch (error) {
      if (required) {
        throw new Error(`Refusing to start: Redis rate-limit store is unavailable (${error.message})`);
      }
      log.error({ err: error }, 'redis unavailable at boot \uFFFD?" rate limits run in-process');
    }
  }
  if (required) throw new Error("Refusing to start: REDIS_URL is required in production");
  return new RateLimiter(new MemoryRateStore(), log);
}

// backend/src/repos/members.ts
async function membershipsForUser(shards, userId) {
  const found = [];
  for (const shard of shards) {
    const rows = await shard.query(
      `SELECT tm.team_id, tm.user_id, tm.role, tm.active, tm.joined_at, t.name AS "teamName"
         FROM team_members tm
         JOIN teams t ON t.id = tm.team_id
        WHERE tm.user_id = $1 AND tm.active = true
        ORDER BY tm.joined_at ASC`,
      [userId]
    );
    found.push(...rows);
  }
  return found;
}

// backend/src/billing/entitlements.ts
async function getPlan(db, key) {
  const plan = await db.one("SELECT * FROM plans WHERE key = $1", [key]);
  if (!plan) throw new ApiError("INTERNAL", 500, `plan ${key} missing from plans table`);
  return plan;
}
async function getSubscription(db, teamId) {
  return db.one("SELECT * FROM subscriptions WHERE team_id = $1 FOR UPDATE", [teamId]);
}
async function entitlementsFor(db, teamId) {
  const subscription = await db.one("SELECT * FROM subscriptions WHERE team_id = $1", [
    teamId
  ]) ?? null;
  const planKey = subscription?.plan_key ?? "starter";
  const plan = await getPlan(db, planKey);
  const extraSeats = subscription?.extra_seats ?? 0;
  return {
    plan,
    subscription,
    status: subscription?.status ?? "trialing",
    seats: subscription?.seats ?? plan.included_seats,
    extraSeats,
    seatCap: plan.included_seats + (plan.extra_seat_cents === null ? 0 : extraSeats)
  };
}
async function assertTeamWritable(db, teamId) {
  const subscription = await db.one(
    "SELECT status FROM subscriptions WHERE team_id = $1",
    [teamId]
  );
  if (subscription?.status === "restricted") throw subscriptionRestricted();
}
async function seatUsage(db, teamId) {
  const members = await db.one(
    "SELECT count(*)::text AS n FROM team_members WHERE team_id = $1 AND active = true",
    [teamId]
  );
  const invites = await db.one(
    `SELECT count(*)::text AS n FROM invites
      WHERE team_id = $1 AND accepted_at IS NULL AND revoked_at IS NULL AND expires_at > now()`,
    [teamId]
  );
  const entitlements = await entitlementsFor(db, teamId);
  const used = Number(members?.n ?? 0) + Number(invites?.n ?? 0);
  return { members: Number(members?.n ?? 0), invites: Number(invites?.n ?? 0), used, cap: entitlements.seatCap };
}
async function assertSeatAvailable(tx, teamId, additional = 1) {
  const subscription = await getSubscription(tx, teamId);
  const planKey = subscription?.plan_key ?? "starter";
  const plan = await getPlan(tx, planKey);
  const extraSeats = subscription?.extra_seats ?? 0;
  const cap = plan.included_seats + (plan.extra_seat_cents === null ? 0 : extraSeats);
  const members = await tx.one(
    "SELECT count(*)::text AS n FROM team_members WHERE team_id = $1 AND active = true",
    [teamId]
  );
  const invites = await tx.one(
    `SELECT count(*)::text AS n FROM invites
      WHERE team_id = $1 AND accepted_at IS NULL AND revoked_at IS NULL AND expires_at > now()`,
    [teamId]
  );
  const used = Number(members?.n ?? 0) + Number(invites?.n ?? 0);
  if (used + additional <= cap) return;
  if (plan.extra_seat_cents === null) {
    throw seatLimit(`The ${plan.name} plan includes ${plan.included_seats} seats. Upgrade your plan to add more people.`);
  }
  if (used + additional > plan.max_seats) {
    throw seatLimit(`This plan allows at most ${plan.max_seats} seats.`);
  }
  throw seatLimit(`Seat limit reached (${used}/${cap}). Add seats at checkout.`);
}

// backend/src/repos/invites.ts
var INVITE_TTL_DAYS = 7;
function inviteStatus(row) {
  if (row.accepted_at) return "accepted";
  if (row.revoked_at) return "revoked";
  if (row.expires_at.getTime() <= Date.now()) return "expired";
  return "pending";
}
async function createInvite(db, input) {
  const token = `${input.teamId}.${randomSecret(24)}`;
  const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 864e5);
  const row = await db.one(
    `INSERT INTO invites (id, team_id, email, role, token_hash, invited_by, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [newId(), input.teamId, input.email.toLowerCase(), input.role, sha256(token), input.invitedBy, expiresAt]
  );
  if (!row) throw new Error("failed to create invite");
  return { token, row };
}
async function findInviteByToken(db, token) {
  return db.one("SELECT * FROM invites WHERE token_hash = $1", [sha256(token)]);
}
async function acceptInvite(db, scope, token, user) {
  return db.tx(async (tx) => {
    const invite = await tx.one("SELECT * FROM invites WHERE token_hash = $1 FOR UPDATE", [
      sha256(token)
    ]);
    if (!invite || invite.team_id !== scope.teamId) return null;
    if (inviteStatus(invite) !== "pending") return null;
    if (invite.email.toLowerCase() !== user.email.toLowerCase()) return null;
    await assertSeatAvailable(tx, invite.team_id, 1);
    const existing = await tx.one(
      "SELECT role, active FROM team_members WHERE team_id = $1 AND user_id = $2",
      [invite.team_id, user.id]
    );
    let role = invite.role;
    if (existing) {
      if (existing.active) {
        role = existing.role;
      } else {
        await tx.query("UPDATE team_members SET active = true, role = $1, joined_at = now() WHERE team_id = $2 AND user_id = $3", [
          invite.role,
          invite.team_id,
          user.id
        ]);
      }
    } else {
      await tx.query("INSERT INTO team_members (team_id, user_id, role, active) VALUES ($1, $2, $3, true)", [
        invite.team_id,
        user.id,
        invite.role
      ]);
    }
    await tx.query("UPDATE invites SET accepted_at = now() WHERE id = $1", [invite.id]);
    const team = await tx.one("SELECT name FROM teams WHERE id = $1", [invite.team_id]);
    return { teamId: invite.team_id, teamName: team?.name ?? "", role };
  });
}

// backend/src/repos/users.ts
var SELECT = "SELECT id, email, name, password_hash, token_version, timezone, created_at FROM users";
async function findUserByEmail(db, email) {
  return db.one(`${SELECT} WHERE lower(email) = lower($1)`, [email]);
}
async function findUserById(db, id) {
  return db.one(`${SELECT} WHERE id = $1`, [id]);
}
async function createUser(db, input) {
  const passwordHash = input.password ? await hashPassword(input.password) : null;
  const row = await db.one(
    `INSERT INTO users (id, email, name, password_hash, timezone)
     VALUES ($1, lower($2), $3, $4, $5)
     RETURNING id, email, name, password_hash, token_version, timezone, created_at`,
    [newId(), input.email, input.name, passwordHash, input.timezone ?? "UTC"]
  );
  if (!row) throw new Error("failed to create user");
  await db.query("INSERT INTO user_settings (user_id, time_zone) VALUES ($1, $2) ON CONFLICT (user_id) DO NOTHING", [
    row.id,
    input.timezone ?? "UTC"
  ]);
  return row;
}
async function setUserPassword(db, userId, password) {
  const hash = await hashPassword(password);
  await db.query("UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2", [hash, userId]);
}

// backend/src/repos/avatars.ts
var SELECT2 = "SELECT user_id, content_type, bytes, created_at, updated_at FROM user_avatars";
async function findAvatar(db, userId) {
  return db.one(`${SELECT2} WHERE user_id = $1`, [userId]);
}
async function upsertAvatar(db, input) {
  const row = await db.one(
    `INSERT INTO user_avatars (user_id, content_type, bytes)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id) DO UPDATE
       SET content_type = EXCLUDED.content_type,
           bytes = EXCLUDED.bytes,
           updated_at = now()
     RETURNING user_id, content_type, bytes, created_at, updated_at`,
    [input.userId, input.contentType, input.bytes]
  );
  if (!row) throw new Error("failed to store avatar");
  return row;
}
async function deleteAvatar(db, userId) {
  const row = await db.one(
    "DELETE FROM user_avatars WHERE user_id = $1 RETURNING user_id",
    [userId]
  );
  return Boolean(row);
}
function avatarPath(userId, version) {
  const path2 = `/v1/users/${userId}/avatar`;
  if (!version) return path2;
  const stamp = typeof version === "string" ? version : version.toISOString();
  return `${path2}?v=${encodeURIComponent(stamp)}`;
}

// backend/src/routes/auth.ts
var SIGNUP_DEVICE_ID = "signup";
var dummyHash = null;
function dummyPasswordHash() {
  dummyHash ??= hashPassword(randomToken(16));
  return dummyHash;
}
async function toSelf(deps, user) {
  const avatar = await findAvatar(deps.topology.global, user.id);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    tokenVersion: user.token_version,
    timezone: user.timezone,
    avatarUrl: avatar ? avatarPath(user.id, avatar.updated_at) : null
  };
}
async function buildSession(deps, user, deviceId) {
  const accessToken = await issueAccessToken(deps.env.JWT_SECRET, user.id, user.token_version);
  const refresh = await createSession(deps.topology.global, user.id, deviceId);
  const memberships = await membershipsForUser(deps.topology.shards, user.id);
  const first = memberships[0];
  return {
    user: await toSelf(deps, user),
    tokens: { accessToken, refreshToken: refresh.refreshToken, expiresIn: ACCESS_TTL_SECONDS },
    team: first ? { id: first.team_id, name: first.teamName, role: first.role } : null
  };
}
async function consumeInviteAtSignup(deps, token, user) {
  const teamId = token.split(".")[0];
  if (!teamId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(teamId)) return;
  try {
    const scope = deps.topology.scopeFor(teamId);
    await acceptInvite(deps.topology.shardDb(scope), scope, token, user);
  } catch {
  }
}
function registerAuthRoutes(app, deps) {
  const { topology, rateLimiter, env, queue } = deps;
  app.post("/v1/auth/signup", async (req) => {
    const body2 = RequestBodies.signup.parse(req.body);
    await rateLimiter.enforce(RATE_RULES.signup, `ip:${clientIp(req)}`);
    const existing = await findUserByEmail(topology.global, body2.email);
    if (existing) throw conflict("An account with that email is already registered.");
    let user;
    try {
      user = await createUser(topology.global, { email: body2.email, name: body2.name, password: body2.password });
    } catch (error) {
      if (error instanceof Error && /users_email_key|duplicate key/.test(error.message)) {
        throw conflict("An account with that email is already registered.");
      }
      throw error;
    }
    if (body2.inviteToken) await consumeInviteAtSignup(deps, body2.inviteToken, user);
    return buildSession(deps, user, SIGNUP_DEVICE_ID);
  });
  app.post("/v1/auth/login", async (req) => {
    const body2 = RequestBodies.login.parse(req.body);
    const identity = `ip:${clientIp(req)}|email:${hashKey(body2.email.toLowerCase())}`;
    await rateLimiter.enforce(RATE_RULES.login, identity);
    const user = await findUserByEmail(topology.global, body2.email);
    const ok = user?.password_hash ? await verifyPassword(user.password_hash, body2.password) : await verifyPassword(await dummyPasswordHash(), body2.password);
    if (!user || !user.password_hash || !ok) throw unauthorized("Email or password is incorrect.");
    return buildSession(deps, user, body2.deviceId);
  });
  app.post("/v1/auth/magic", async (req) => {
    const body2 = RequestBodies.magicStart.parse(req.body);
    const identity = `ip:${clientIp(req)}|email:${hashKey(body2.email.toLowerCase())}`;
    await rateLimiter.enforce(RATE_RULES.magic, identity);
    const user = await findUserByEmail(topology.global, body2.email);
    if (user) {
      const issued = await issueOneTime(topology.global, user.id, "magic");
      await enqueueMail(queue, magicLinkMail(user.email, env.PUBLIC_BASE_URL, issued.token, issued.expiresAt));
    }
    return { sent: true };
  });
  app.post("/v1/auth/magic/consume", async (req) => {
    const body2 = RequestBodies.magicConsume.parse(req.body);
    await rateLimiter.enforce(RATE_RULES.magic, `ip:${clientIp(req)}`);
    const userId = await consumeOneTime(topology.global, body2.token, "magic");
    if (!userId) throw unauthorized("That link is invalid or has expired.");
    const user = await findUserById(topology.global, userId);
    if (!user) throw unauthorized("That link is invalid or has expired.");
    return buildSession(deps, user, body2.deviceId);
  });
  app.post("/v1/auth/refresh", async (req) => {
    const body2 = RequestBodies.refresh.parse(req.body);
    await rateLimiter.enforce(RATE_RULES.refresh, `device:${hashKey(body2.deviceId)}|ip:${clientIp(req)}`);
    const rotated = await rotateRefresh(topology.global, body2.refreshToken, body2.deviceId);
    if (!rotated.ok) {
      throw unauthorized(rotated.reason === "reused" ? "Session revoked. Sign in again." : "Session expired.");
    }
    const user = await findUserById(topology.global, rotated.userId);
    if (!user) throw unauthorized("Session expired.");
    const accessToken = await issueAccessToken(env.JWT_SECRET, user.id, user.token_version);
    return { accessToken, refreshToken: rotated.refreshToken, expiresIn: ACCESS_TTL_SECONDS };
  });
  app.post("/v1/auth/logout", async (req, reply) => {
    const body2 = RequestBodies.logout.parse(req.body);
    const row = await topology.global.one(
      "SELECT family_id FROM refresh_tokens WHERE token_hash = $1",
      [sha256(body2.refreshToken)]
    );
    if (row) await revokeFamily(topology.global, row.family_id);
    reply.status(204);
    return null;
  });
  app.post("/v1/auth/logout-all", async (req, reply) => {
    const user = await requireUser(env, topology, req);
    await revokeAllForUser(topology.global, user.id);
    reply.status(204);
    return null;
  });
  app.post("/v1/auth/forgot", async (req) => {
    const body2 = RequestBodies.forgot.parse(req.body);
    const identity = `ip:${clientIp(req)}|email:${hashKey(body2.email.toLowerCase())}`;
    await rateLimiter.enforce(RATE_RULES.forgot, identity);
    const user = await findUserByEmail(topology.global, body2.email);
    if (user?.password_hash) {
      const issued = await issueOneTime(topology.global, user.id, "reset");
      await enqueueMail(queue, resetMail(user.email, issued.token, issued.expiresAt));
    }
    return { sent: true };
  });
  app.post("/v1/auth/reset", async (req) => {
    const body2 = RequestBodies.reset.parse(req.body);
    await rateLimiter.enforce(RATE_RULES.reset, `ip:${clientIp(req)}`);
    const userId = await consumeOneTime(topology.global, body2.token, "reset");
    if (!userId) throw unauthorized("That link is invalid or has expired.");
    await setUserPassword(topology.global, userId, body2.password);
    await revokeAllForUser(topology.global, userId);
    return { ok: true };
  });
}

// backend/src/http/validate.ts
var import_zod2 = require("zod");
var NoQuery = import_zod2.z.object({}).strict();
function parseWith(schema, value, where) {
  const result = schema.safeParse(value);
  if (!result.success) {
    const first = result.error.issues[0];
    const where2 = first ? `${where}.${first.path.join(".")}` : where;
    throw new ApiError("VALIDATION_FAILED", 400, `${where2}: ${first?.message ?? "invalid"}`);
  }
  return result.data;
}

// backend/src/routes/me.ts
var SETTINGS_FIELDS = [
  "quiet_start",
  "quiet_end",
  "time_zone",
  "notif_shifts",
  "notif_swaps",
  "notif_billing",
  "language",
  "theme"
];
async function loadSettings(deps, userId) {
  const existing = await deps.topology.global.one("SELECT * FROM user_settings WHERE user_id = $1", [
    userId
  ]);
  if (existing) return existing;
  const created = await deps.topology.global.one(
    "INSERT INTO user_settings (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING RETURNING *",
    [userId]
  );
  if (created) return created;
  const row = await deps.topology.global.one("SELECT * FROM user_settings WHERE user_id = $1", [
    userId
  ]);
  if (!row) throw new Error("settings row missing");
  return row;
}
function toEnvelope(row, conflicts) {
  const values = {
    quiet_start: row.quiet_start,
    quiet_end: row.quiet_end,
    time_zone: row.time_zone,
    notif_shifts: row.notif_shifts,
    notif_swaps: row.notif_swaps,
    notif_billing: row.notif_billing,
    language: row.language,
    theme: row.theme
  };
  const updatedAt = {};
  for (const field of SETTINGS_FIELDS) {
    const stamp = row[`${field}_updated_at`];
    updatedAt[field] = stamp.toISOString();
  }
  return conflicts && conflicts.length > 0 ? { values, updatedAt, conflicts } : { values, updatedAt };
}
function registerMeRoutes(app, deps) {
  app.get("/v1/me", async (req) => {
    parseWith(NoQuery, req.query, "query");
    const user = await requireUser(deps.env, deps.topology, req);
    const memberships = await membershipsForUser(deps.topology.shards, user.id);
    const first = memberships[0];
    const avatar = await findAvatar(deps.topology.global, user.id);
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        tokenVersion: user.token_version,
        timezone: user.timezone,
        avatarUrl: avatar ? avatarPath(user.id, avatar.updated_at) : null
      },
      team: first ? { id: first.team_id, name: first.teamName, role: first.role } : null
    };
  });
  app.get("/v1/me/settings", async (req) => {
    parseWith(NoQuery, req.query, "query");
    const user = await requireUser(deps.env, deps.topology, req);
    const row = await loadSettings(deps, user.id);
    return toEnvelope(row);
  });
  app.patch("/v1/me/settings", async (req) => {
    const user = await requireUser(deps.env, deps.topology, req);
    const body2 = RequestBodies.patchSettings.parse(req.body);
    const row = await loadSettings(deps, user.id);
    const conflicts = [];
    const assignments = [];
    const params = [user.id];
    let touchesTimeZone = false;
    for (const [key, value] of Object.entries(body2.changes)) {
      const field = key;
      if (!SETTINGS_FIELDS.includes(field)) continue;
      const base = body2.baseUpdatedAt?.[field];
      if (base) {
        const server = row[`${field}_updated_at`];
        if (new Date(base).getTime() !== server.getTime()) {
          conflicts.push(field);
          continue;
        }
      }
      params.push(value);
      assignments.push(`${field} = $${params.length}, ${field}_updated_at = now()`);
      if (field === "time_zone") touchesTimeZone = true;
    }
    let updated = row;
    if (assignments.length > 0) {
      const result = await deps.topology.global.one(
        `UPDATE user_settings SET ${assignments.join(", ")} WHERE user_id = $1 RETURNING *`,
        params
      );
      if (result) updated = result;
      if (touchesTimeZone) {
        await deps.topology.global.query("UPDATE users SET timezone = $1, updated_at = now() WHERE id = $2", [
          updated.time_zone,
          user.id
        ]);
      }
    }
    return toEnvelope(updated, conflicts);
  });
  app.put("/v1/me/devices/:deviceId/push-token", async (req, reply) => {
    const { deviceId } = parseWith(PathParams.deviceId, req.params, "params");
    const user = await requireUser(deps.env, deps.topology, req);
    const body2 = RequestBodies.putPushToken.parse(req.body);
    const owned = await deps.topology.global.one(
      "SELECT device_id FROM devices WHERE device_id = $1 AND user_id = $2",
      [deviceId, user.id]
    );
    const stray = !owned ? await deps.topology.global.one("SELECT device_id FROM devices WHERE device_id = $1", [
      deviceId
    ]) : void 0;
    if (stray) throw notFound("That device belongs to another account.");
    await deps.topology.global.query(
      `INSERT INTO devices (device_id, user_id, push_token) VALUES ($1, $2, $3)
       ON CONFLICT (device_id) DO UPDATE SET push_token = EXCLUDED.push_token, updated_at = now()`,
      [deviceId, user.id, body2.pushToken]
    );
    reply.status(204);
    return null;
  });
}

// backend/src/lib/avatar.ts
var BASE64 = /^[A-Za-z0-9+/]*={0,2}$/;
function decodeAvatarBase64(data) {
  if (data.length % 4 !== 0 || !BASE64.test(data)) {
    throw badRequest("That image could not be read. Upload it again.");
  }
  const bytes = Buffer.from(data, "base64");
  if (bytes.length === 0) throw badRequest("That image could not be read. Upload it again.");
  if (bytes.length > AVATAR_MAX_BYTES) {
    throw badRequest("That image is too large. Use a picture under 2 MB.");
  }
  return bytes;
}
function sniffImageType(bytes) {
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) {
    return "image/jpeg";
  }
  if (bytes.length >= 8 && bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71 && bytes[4] === 13 && bytes[5] === 10 && bytes[6] === 26 && bytes[7] === 10) {
    return "image/png";
  }
  if (bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") {
    return "image/webp";
  }
  return null;
}

// backend/src/routes/avatars.ts
var AVATAR_BODY_LIMIT = AVATAR_MAX_BASE64 + 4 * 1024;
async function sharesTeam(deps, viewerId, ownerId) {
  if (viewerId === ownerId) return true;
  const memberships = await membershipsForUser(deps.topology.shards, viewerId);
  for (const membership of memberships) {
    const scope = deps.topology.scopeFor(membership.team_id);
    const member = await deps.topology.shardDb(scope).one(
      "SELECT user_id FROM team_members WHERE team_id = $1 AND user_id = $2 AND active = true",
      [membership.team_id, ownerId]
    );
    if (member) return true;
  }
  return false;
}
function registerAvatarRoutes(app, deps) {
  app.put("/v1/me/avatar", { bodyLimit: AVATAR_BODY_LIMIT }, async (req) => {
    const user = await requireUser(deps.env, deps.topology, req);
    const body2 = RequestBodies.putAvatar.parse(req.body);
    const bytes = decodeAvatarBase64(body2.dataBase64);
    const sniffed = sniffImageType(bytes);
    if (!sniffed) {
      throw badRequest("That image could not be read. Use a JPEG, PNG or WebP file.");
    }
    if (sniffed !== body2.contentType) {
      throw badRequest("That image does not match the file type. Upload it again.");
    }
    const stored = await upsertAvatar(deps.topology.global, {
      userId: user.id,
      contentType: sniffed,
      bytes
    });
    return { avatarUrl: avatarPath(user.id, stored.updated_at), updatedAt: stored.updated_at.toISOString() };
  });
  app.delete("/v1/me/avatar", async (req, reply) => {
    const user = await requireUser(deps.env, deps.topology, req);
    await deleteAvatar(deps.topology.global, user.id);
    reply.status(204);
    return null;
  });
  app.get("/v1/users/:userId/avatar", async (req, reply) => {
    const { userId } = parseWith(PathParams.userId, req.params, "params");
    parseWith(QueryParams.avatar, req.query, "query");
    const viewer = await requireUser(deps.env, deps.topology, req);
    if (!await sharesTeam(deps, viewer.id, userId)) {
      throw notFound("No photo found.");
    }
    const avatar = await findAvatar(deps.topology.global, userId);
    if (!avatar) throw notFound("No photo found.");
    reply.header("content-type", avatar.content_type);
    reply.header("cache-control", "private, max-age=300");
    reply.header("content-length", String(avatar.bytes.length));
    return reply.status(200).send(avatar.bytes);
  });
}

// backend/src/routes/teams.ts
var import_zod3 = require("zod");

// backend/src/cache/cache.ts
var MemoryCache = class {
  store = /* @__PURE__ */ new Map();
  async get(key) {
    const entry = this.store.get(key);
    if (!entry) return void 0;
    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return void 0;
    }
    return entry.value;
  }
  async set(key, value, ttlMs) {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }
  async del(keys) {
    for (const key of keys) this.store.delete(key);
  }
  async delByPrefix(prefix) {
    for (const key of [...this.store.keys()]) {
      if (key.startsWith(prefix)) this.store.delete(key);
    }
  }
  async close() {
    this.store.clear();
  }
};
var RedisCache = class {
  constructor(url) {
    this.url = url;
  }
  url;
  client = null;
  async conn() {
    if (!this.client) {
      const { default: Redis } = await import("ioredis");
      this.client = new Redis(this.url, { maxRetriesPerRequest: 2 });
    }
    return this.client;
  }
  async get(key) {
    const raw = await (await this.conn()).get(key);
    if (raw === null) return void 0;
    return JSON.parse(raw);
  }
  async set(key, value, ttlMs) {
    await (await this.conn()).set(key, JSON.stringify(value), "PX", ttlMs);
  }
  async del(keys) {
    if (keys.length === 0) return;
    await (await this.conn()).del(...keys);
  }
  async delByPrefix(prefix) {
    const client = await this.conn();
    let cursor = "0";
    do {
      const [next, batch] = await client.scan(cursor, "MATCH", `${prefix}*`, "COUNT", 100);
      cursor = next;
      if (batch.length > 0) await client.del(...batch);
    } while (cursor !== "0");
  }
  async close() {
    if (!this.client) return;
    const client = this.client;
    this.client = null;
    await client.quit();
  }
};
async function createCache(redisUrl, log) {
  if (redisUrl) {
    try {
      await import("ioredis");
      return new RedisCache(redisUrl);
    } catch (error) {
      log.error({ err: error }, "redis unavailable for cache \u2014 using in-memory cache");
    }
  }
  return new MemoryCache();
}
async function cached(cache, key, ttlMs, load) {
  const hit = await cache.get(key).catch(() => void 0);
  if (hit !== void 0) return hit;
  const value = await load();
  await cache.set(key, value, ttlMs).catch(() => void 0);
  return value;
}
async function invalidate(cache, keys) {
  await cache.del(keys).catch(() => void 0);
}
async function invalidatePrefix(cache, prefix) {
  await cache.delByPrefix(prefix).catch(() => void 0);
}

// backend/src/cache/keys.ts
function rosterKey(teamId) {
  return `roster:${teamId}`;
}
function calendarPrefix(teamId) {
  return `cal:${teamId}:`;
}
function calendarKey(teamId, query) {
  return `${calendarPrefix(teamId)}${query.from}|${query.to}|${query.mine}|${query.user}|${query.cursor}|${query.limit}`;
}
var ROSTER_TTL_MS = 3e4;
var CALENDAR_TTL_MS = 15e3;

// backend/src/repos/activity.ts
async function logActivity(shard, scope, input) {
  const id = newId();
  await shard.query(
    "INSERT INTO activity (id, team_id, type, actor_id, summary, data) VALUES ($1, $2, $3, $4, $5, $6)",
    [id, scope.teamId, input.type, input.actorId, input.summary, JSON.stringify(input.data ?? {})]
  );
  return id;
}

// backend/src/repos/public.ts
async function loadUsersByIds(db, ids) {
  const unique = [...new Set(ids.filter((id) => typeof id === "string" && id.length > 0))];
  const found = /* @__PURE__ */ new Map();
  if (unique.length === 0) return found;
  const placeholders = unique.map((_3, index) => `$${index + 1}`).join(", ");
  const rows = await db.query(
    `SELECT u.id, u.name, u.email,
            (a.user_id IS NOT NULL) AS has_avatar,
            a.updated_at AS avatar_updated_at
       FROM users u
       LEFT JOIN user_avatars a ON a.user_id = u.id
      WHERE u.id IN (${placeholders})`,
    unique
  );
  for (const row of rows) {
    found.set(row.id, {
      id: row.id,
      name: row.name,
      email: row.email,
      avatarUrl: row.has_avatar ? avatarPath(row.id, row.avatar_updated_at) : null
    });
  }
  return found;
}
async function loadUserZones(db, ids) {
  const unique = [...new Set(ids.filter((id) => typeof id === "string" && id.length > 0))];
  const zones = /* @__PURE__ */ new Map();
  if (unique.length === 0) return zones;
  const placeholders = unique.map((_3, index) => `$${index + 1}`).join(", ");
  const rows = await db.query(
    `SELECT id, timezone FROM users WHERE id IN (${placeholders})`,
    unique
  );
  for (const row of rows) zones.set(row.id, row.timezone ?? "UTC");
  return zones;
}
function maskEmail(email) {
  const at2 = email.indexOf("@");
  if (at2 < 1) return "\u2022\u2022\u2022";
  const local = email.slice(0, at2);
  const domain = email.slice(at2);
  const hidden = Math.min(3, local.length - 1);
  return `${local[0] ?? ""}${"\u2022".repeat(hidden)}${domain}`;
}
function toPublicUser(user, role, active, id) {
  const entry = user ?? { id, name: "Unknown user", email: "", avatarUrl: null };
  return {
    id: entry.id,
    name: entry.name,
    emailMasked: maskEmail(entry.email),
    role,
    active,
    avatarUrl: entry.avatarUrl
  };
}
function briefUser(directory, id) {
  if (!id) return null;
  const entry = directory.get(id);
  return { id, name: entry?.name ?? "Unknown user", avatarUrl: entry?.avatarUrl ?? null };
}
function isoStamp(date) {
  const iso = date.toISOString();
  return iso.endsWith(".000Z") ? `${iso.slice(0, -5)}Z` : iso;
}

// backend/src/repos/teams.ts
var MEMBER_COLUMNS = "team_id, user_id, role, active, joined_at";
async function createTeam(db, scope, input) {
  return db.tx(async (tx) => {
    const team = await tx.one("INSERT INTO teams (id, name) VALUES ($1, $2) RETURNING id, name, created_at", [
      scope.teamId,
      input.name
    ]);
    if (!team) throw new Error("failed to create team");
    await tx.query("INSERT INTO team_members (team_id, user_id, role, active) VALUES ($1, $2, $3, true)", [
      scope.teamId,
      input.owner.id,
      "owner"
    ]);
    await logActivity(tx, scope, {
      type: "team.created",
      actorId: input.owner.id,
      summary: `${input.owner.name} created ${input.name}`,
      data: { teamId: scope.teamId }
    });
    return team;
  });
}
async function getTeam(db, scope) {
  return db.one("SELECT id, name, created_at FROM teams WHERE id = $1", [scope.teamId]);
}
async function findMember(db, scope, userId) {
  return db.one(`SELECT ${MEMBER_COLUMNS} FROM team_members WHERE team_id = $1 AND user_id = $2`, [
    scope.teamId,
    userId
  ]);
}
async function listActiveMembers(db, scope) {
  return db.query(
    `SELECT ${MEMBER_COLUMNS} FROM team_members WHERE team_id = $1 AND active = true
      ORDER BY joined_at ASC, user_id ASC`,
    [scope.teamId]
  );
}
async function membersByIds(db, scope, ids) {
  const unique = [...new Set(ids.filter((id) => id.length > 0))];
  const found = /* @__PURE__ */ new Map();
  if (unique.length === 0) return found;
  const placeholders = unique.map((_3, index) => `$${index + 2}`).join(", ");
  const rows = await db.query(
    `SELECT ${MEMBER_COLUMNS} FROM team_members WHERE team_id = $1 AND user_id IN (${placeholders})`,
    [scope.teamId, ...unique]
  );
  for (const row of rows) found.set(row.user_id, row);
  return found;
}
async function countActiveOwners(db, scope) {
  const row = await db.one(
    "SELECT count(*)::text AS n FROM team_members WHERE team_id = $1 AND active = true AND role = 'owner'",
    [scope.teamId]
  );
  return Number(row?.n ?? 0);
}
async function deactivateMember(db, scope, userId) {
  const rows = await db.query(
    "UPDATE team_members SET active = false WHERE team_id = $1 AND user_id = $2 AND active = true RETURNING user_id",
    [scope.teamId, userId]
  );
  return rows.length > 0;
}

// backend/src/routes/teams.ts
var TeamParams = import_zod3.z.object({ teamId: Id }).strict();
var MemberParams = import_zod3.z.object({ teamId: Id, userId: Id }).strict();
var TokenParams = import_zod3.z.object({ token: import_zod3.z.string().min(1).max(300) }).strict();
var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function scopeFromToken(deps, token) {
  const teamId = token.split(".")[0] ?? "";
  if (!UUID_RE.test(teamId)) throw notFound("This invite is no longer valid.");
  return deps.topology.scopeFor(teamId);
}
async function findInviteRow(deps, token) {
  const scope = scopeFromToken(deps, token);
  const invite = await findInviteByToken(deps.topology.shardDb(scope), token);
  if (!invite || invite.team_id !== scope.teamId) return void 0;
  return invite;
}
function registerTeamRoutes(app, deps) {
  app.post("/v1/teams", async (req) => {
    const body2 = parseWith(RequestBodies.createTeam, req.body, "body");
    const user = await requireUser(deps.env, deps.topology, req);
    const teamId = newId();
    const scope = deps.topology.scopeFor(teamId);
    const team = await createTeam(deps.topology.shardDb(scope), scope, {
      name: body2.name,
      owner: { id: user.id, name: user.name }
    });
    return { id: team.id, name: team.name, role: "owner" };
  });
  app.get("/v1/teams/:teamId", async (req) => {
    const { teamId } = parseWith(TeamParams, req.params, "params");
    parseWith(NoQuery, req.query, "query");
    const membership = await requireMembership(deps.env, deps.topology, req, teamId);
    assertCan(membership.role, "team.read");
    const team = await getTeam(deps.topology.shardDb(membership.scope), membership.scope);
    if (!team) throw notFound("That team does not exist.");
    return { id: team.id, name: team.name, role: membership.role };
  });
  app.get("/v1/teams/:teamId/members", async (req) => {
    const { teamId } = parseWith(TeamParams, req.params, "params");
    parseWith(NoQuery, req.query, "query");
    const membership = await requireMembership(deps.env, deps.topology, req, teamId);
    assertCan(membership.role, "member.read");
    const db = deps.topology.shardDb(membership.scope);
    return cached(deps.cache, rosterKey(teamId), ROSTER_TTL_MS, async () => {
      const roster = await listActiveMembers(db, membership.scope);
      const directory = await loadUsersByIds(deps.topology.global, roster.map((row) => row.user_id));
      return roster.map((row) => toPublicUser(directory.get(row.user_id), row.role, row.active, row.user_id));
    });
  });
  app.post("/v1/teams/:teamId/invites", async (req) => {
    const { teamId } = parseWith(TeamParams, req.params, "params");
    const membership = await requireMembership(deps.env, deps.topology, req, teamId);
    assertCan(membership.role, "team.invite");
    await assertTeamWritable(deps.topology.shardDb(membership.scope), membership.scope.teamId);
    const body2 = parseWith(RequestBodies.createInvite, req.body, "body");
    const db = deps.topology.shardDb(membership.scope);
    const { token, row } = await db.tx(async (tx) => {
      await assertSeatAvailable(tx, teamId, 1);
      return createInvite(tx, { teamId, email: body2.email, role: body2.role, invitedBy: membership.user.id });
    });
    const team = await getTeam(db, membership.scope);
    await enqueueMail(
      deps.queue,
      inviteMail(body2.email, {
        teamName: team?.name ?? "",
        role: row.role,
        token,
        expiresAt: row.expires_at,
        baseUrl: deps.env.PUBLIC_BASE_URL
      })
    );
    await logActivity(db, membership.scope, {
      type: "member.invited",
      actorId: membership.user.id,
      summary: `${membership.user.name} invited ${row.email} as ${row.role}`,
      data: { inviteId: row.id, email: row.email, role: row.role }
    });
    return {
      id: row.id,
      email: row.email,
      role: row.role,
      expiresAt: isoStamp(row.expires_at)
    };
  });
  app.get("/v1/invites/:token", async (req) => {
    const { token } = parseWith(TokenParams, req.params, "params");
    parseWith(NoQuery, req.query, "query");
    const invite = await findInviteRow(deps, token);
    if (!invite || inviteStatus(invite) !== "pending") throw notFound("This invite is no longer valid.");
    const scope = deps.topology.scopeFor(invite.team_id);
    const team = await getTeam(deps.topology.shardDb(scope), scope);
    if (!team) throw notFound("This invite is no longer valid.");
    return {
      teamName: team.name,
      role: invite.role,
      emailMasked: maskEmail(invite.email),
      expiresAt: isoStamp(invite.expires_at)
    };
  });
  app.post("/v1/invites/:token/accept", async (req) => {
    const { token } = parseWith(TokenParams, req.params, "params");
    parseWith(RequestBodies.acceptInvite, req.body, "body");
    const user = await requireUser(deps.env, deps.topology, req);
    const scope = scopeFromToken(deps, token);
    const db = deps.topology.shardDb(scope);
    const accepted = await acceptInvite(db, scope, token, { id: user.id, email: user.email });
    if (!accepted) throw notFound("This invite is no longer valid.");
    await logActivity(db, scope, {
      type: "member.joined",
      actorId: user.id,
      summary: `${user.name} joined the team`,
      data: { teamId: accepted.teamId, role: accepted.role }
    });
    await invalidate(deps.cache, [rosterKey(accepted.teamId)]);
    return accepted;
  });
  app.get("/v1/i/:token", async (req, reply) => {
    const { token } = parseWith(TokenParams, req.params, "params");
    parseWith(NoQuery, req.query, "query");
    const invite = await findInviteRow(deps, token);
    if (!invite || inviteStatus(invite) !== "pending") throw notFound("This invite is no longer valid.");
    return reply.redirect(`rota://invite/${token}`, 302);
  });
  app.delete("/v1/teams/:teamId/members/:userId", async (req, reply) => {
    const { teamId, userId } = parseWith(MemberParams, req.params, "params");
    parseWith(NoQuery, req.query, "query");
    const membership = await requireMembership(deps.env, deps.topology, req, teamId);
    const leaving = userId === membership.user.id;
    if (!leaving) {
      assertCan(membership.role, "team.removeMember");
      await assertTeamWritable(deps.topology.shardDb(membership.scope), membership.scope.teamId);
    }
    const db = deps.topology.shardDb(membership.scope);
    const target = await findMember(db, membership.scope, userId);
    if (!target || !target.active) throw notFound("That member is not part of this team.");
    if (target.role === "owner") {
      const owners = await countActiveOwners(db, membership.scope);
      if (owners <= 1) throw conflict("A team must always keep at least one active owner.");
    }
    await deactivateMember(db, membership.scope, userId);
    const directory = await loadUsersByIds(deps.topology.global, [userId]);
    const name2 = directory.get(userId)?.name ?? "A member";
    await logActivity(db, membership.scope, {
      type: leaving ? "member.left" : "member.removed",
      actorId: membership.user.id,
      summary: leaving ? `${name2} left the team` : `${membership.user.name} removed ${name2} from the team`,
      data: { userId, role: target.role }
    });
    await invalidate(deps.cache, [rosterKey(teamId)]);
    reply.status(204);
    return null;
  });
}

// backend/src/routes/shifts.ts
var import_zod4 = require("zod");

// backend/src/lib/zone-time.ts
var formatterCache = /* @__PURE__ */ new Map();
function formatterFor(timeZone) {
  const cached3 = formatterCache.get(timeZone);
  if (cached3) return cached3;
  let formatter;
  try {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h12",
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      hourCycle: "h12",
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  formatterCache.set(timeZone, formatter);
  return formatter;
}
function partsOf(instant, timeZone) {
  const out2 = { weekday: "", day: "", month: "", hour: "", minute: "", meridiem: "" };
  for (const part of formatterFor(timeZone).formatToParts(instant)) {
    switch (part.type) {
      case "weekday":
        out2.weekday = part.value;
        break;
      case "day":
        out2.day = part.value;
        break;
      case "month":
        out2.month = part.value;
        break;
      case "hour":
        out2.hour = part.value;
        break;
      case "minute":
        out2.minute = part.value;
        break;
      case "dayPeriod":
        out2.meridiem = part.value.toUpperCase();
        break;
      default:
        break;
    }
  }
  return out2;
}
function wallRange(start2, end, timeZone) {
  const a2 = partsOf(start2, timeZone);
  const b3 = partsOf(end, timeZone);
  const head = `${a2.weekday} ${a2.day} ${a2.month}, ${a2.hour}:${a2.minute} ${a2.meridiem}`;
  const sameDay = a2.weekday === b3.weekday && a2.day === b3.day && a2.month === b3.month;
  const tail = sameDay ? `${b3.hour}:${b3.minute} ${b3.meridiem}` : `${b3.weekday} ${b3.day} ${b3.month}, ${b3.hour}:${b3.minute} ${b3.meridiem}`;
  return `${head} \u2013 ${tail}`;
}

// backend/src/jobs/push.ts
var import_expo_server_sdk = require("expo-server-sdk");

// backend/src/jobs/queue.ts
var DEFAULT_ATTEMPTS = 5;
var BASE_BACKOFF_MS = 500;
var MAX_BACKOFF_MS = 6e4;
function backoffMs(attempt) {
  return Math.min(BASE_BACKOFF_MS * 2 ** attempt, MAX_BACKOFF_MS);
}
var MemoryQueue = class {
  constructor(log) {
    this.log = log;
  }
  log;
  handlers = /* @__PURE__ */ new Map();
  queue = [];
  timers = /* @__PURE__ */ new Set();
  active = 0;
  idleWaiters = [];
  register(queue, handler2) {
    this.handlers.set(queue, handler2);
  }
  async add(queue, payload, options = {}) {
    const job = {
      queue,
      jobId: newId(),
      payload,
      runAt: Date.now() + (options.delayMs ?? 0),
      attempts: options.attempts ?? DEFAULT_ATTEMPTS,
      attempt: 0
    };
    this.queue.push(job);
    this.schedule();
    return job.jobId;
  }
  inFlight() {
    return this.queue.length + this.active;
  }
  async drain(timeoutMs = 1e4) {
    if (this.inFlight() === 0) return;
    await new Promise((resolve2) => {
      const timer = setTimeout(resolve2, timeoutMs);
      this.idleWaiters.push(() => {
        clearTimeout(timer);
        resolve2();
      });
    });
  }
  async healthy() {
    return true;
  }
  async close() {
    for (const timer of this.timers) clearTimeout(timer);
    this.timers.clear();
    this.queue.length = 0;
    this.settleIdle();
  }
  schedule() {
    const now = Date.now();
    const next = this.queue.filter((job) => job.runAt <= now);
    if (next.length === 0) return;
    for (const job of next) this.queue.splice(this.queue.indexOf(job), 1);
    for (const job of next) void this.run(job);
    if (this.queue.length > 0) {
      const timer = setTimeout(() => {
        this.timers.delete(timer);
        this.schedule();
      }, Math.max(0, this.queue[0].runAt - Date.now()));
      this.timers.add(timer);
    }
  }
  async run(job) {
    const handler2 = this.handlers.get(job.queue);
    const started = Date.now();
    this.active += 1;
    job.attempt += 1;
    if (!handler2) {
      this.log.error({ queue: job.queue, jobId: job.jobId }, "no handler registered");
      this.finish();
      return;
    }
    try {
      await handler2(job.payload, {
        queue: job.queue,
        jobId: job.jobId,
        attempt: job.attempt,
        log: this.log
      });
      this.log.info(
        { queue: job.queue, jobId: job.jobId, attempt: job.attempt, result: "ok", ms: Date.now() - started },
        "job finished"
      );
    } catch (error) {
      const result = job.attempt >= job.attempts ? "failed" : "retry";
      this.log.warn(
        { queue: job.queue, jobId: job.jobId, attempt: job.attempt, result, ms: Date.now() - started, err: error },
        "job failed"
      );
      if (job.attempt < job.attempts) {
        job.runAt = Date.now() + backoffMs(job.attempt);
        this.queue.push(job);
        this.schedule();
      }
    } finally {
      this.finish();
    }
  }
  finish() {
    this.active -= 1;
    if (this.inFlight() === 0) this.settleIdle();
  }
  settleIdle() {
    const waiters = this.idleWaiters;
    this.idleWaiters = [];
    for (const wake of waiters) wake();
  }
};
var BullMqQueue = class {
  constructor(redisUrl, log) {
    this.log = log;
    this.connection = { url: redisUrl };
  }
  log;
  queues = /* @__PURE__ */ new Map();
  workers = [];
  handlers = /* @__PURE__ */ new Map();
  connection;
  register(queue, handler2) {
    this.handlers.set(queue, handler2);
    void this.ensureWorker(queue);
  }
  async add(queue, payload, options = {}) {
    const { Queue: BullQueue } = await import("bullmq");
    let q2 = this.queues.get(queue);
    if (!q2) {
      q2 = new BullQueue(queue, { connection: { url: this.connection.url } });
      this.queues.set(queue, q2);
    }
    const job = await q2.add(queue, payload, {
      delay: options.delayMs,
      attempts: options.attempts ?? DEFAULT_ATTEMPTS,
      backoff: { type: "exponential", delay: BASE_BACKOFF_MS },
      removeOnComplete: 1e3,
      removeOnFail: 5e3
    });
    return String(job.id);
  }
  inFlight() {
    return 0;
  }
  async drain() {
  }
  async healthy() {
    try {
      const { default: Redis } = await import("ioredis");
      const client = new Redis(this.connection.url, {
        maxRetriesPerRequest: 1,
        lazyConnect: true,
        connectTimeout: 3e3
      });
      try {
        await client.connect();
        await client.ping();
        return true;
      } finally {
        await client.quit().catch(() => void 0);
      }
    } catch {
      return false;
    }
  }
  async close() {
    await Promise.all([...this.workers.map((w4) => w4.close()), ...[...this.queues.values()].map((q2) => q2.close())]);
  }
  async ensureWorker(queue) {
    if (this.workers.some((w4) => w4.name === queue)) return;
    const { Worker } = await import("bullmq");
    const handler2 = this.handlers.get(queue);
    if (!handler2) return;
    const worker = new Worker(
      queue,
      async (job) => {
        const started = Date.now();
        try {
          await handler2(job.data, { queue, jobId: String(job.id), attempt: job.attemptsMade + 1, log: this.log });
          this.log.info(
            { queue, jobId: job.id, attempt: job.attemptsMade + 1, result: "ok", ms: Date.now() - started },
            "job finished"
          );
        } catch (error) {
          this.log.warn(
            { queue, jobId: job.id, attempt: job.attemptsMade + 1, result: "retry", ms: Date.now() - started, err: error },
            "job failed"
          );
          throw error;
        }
      },
      { connection: { url: this.connection.url } }
    );
    this.workers.push(worker);
  }
};
async function createQueue(redisUrl, log, required = false) {
  if (redisUrl) {
    try {
      await import("bullmq");
      const { default: Redis } = await import("ioredis");
      const probe = new Redis(redisUrl, { maxRetriesPerRequest: 1, lazyConnect: true, connectTimeout: 5e3 });
      try {
        await probe.connect();
        await probe.ping();
      } finally {
        await probe.quit().catch(() => void 0);
      }
      return new BullMqQueue(redisUrl, log);
    } catch (error) {
      if (required) {
        throw new Error(`Refusing to start: Redis queue is unavailable (${error.message})`);
      }
      log.error({ err: error }, 'bullmq unavailable \uFFFD?" falling back to in-process queue');
    }
  }
  if (required) throw new Error("Refusing to start: REDIS_URL is required in production");
  return new MemoryQueue(log);
}

// backend/src/jobs/push.ts
var PUSH_QUEUE = "push";
var MAX_PUSH_ATTEMPTS = 5;
function requestPushDelivery(queue) {
  return queue.add(PUSH_QUEUE, {}, { attempts: MAX_PUSH_ATTEMPTS });
}
var OUTBOX_COLUMNS = "id, team_id, user_id, category, urgency, title, body, data, status, attempts, next_attempt_at, created_at";
function parseHhMm(value) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}
function localMinutes(date, timeZone) {
  try {
    const parts2 = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).formatToParts(date);
    const hour = Number(parts2.find((p4) => p4.type === "hour")?.value ?? "0");
    const minute = Number(parts2.find((p4) => p4.type === "minute")?.value ?? "0");
    return hour % 24 * 60 + minute;
  } catch {
    return date.getUTCHours() * 60 + date.getUTCMinutes();
  }
}
function msUntilQuietEnd(now, quietStart, quietEnd, timeZone) {
  const start2 = parseHhMm(quietStart);
  const end = parseHhMm(quietEnd);
  if (start2 === null || end === null || start2 === end) return null;
  const minutes = localMinutes(now, timeZone);
  const inside = start2 < end ? minutes >= start2 && minutes < end : minutes >= start2 || minutes < end;
  if (!inside) return null;
  const minutesUntilEnd = (end - minutes + 1440) % 1440;
  const secondsIntoMinute = now.getUTCSeconds() * 1e3 + now.getUTCMilliseconds();
  return Math.max(0, minutesUntilEnd * 6e4 - secondsIntoMinute);
}
async function markSent(db, row) {
  await db.query(
    `UPDATE outbox SET status = 'sent', updated_at = now()
      WHERE id = $1 AND status = 'sending' AND team_id IS NOT DISTINCT FROM $2`,
    [row.id, row.team_id]
  );
}
async function markFailed(db, row, attempts) {
  await db.query(
    `UPDATE outbox SET status = 'failed', attempts = $3, updated_at = now()
      WHERE id = $1 AND status = 'sending' AND team_id IS NOT DISTINCT FROM $2`,
    [row.id, row.team_id, attempts]
  );
}
async function markAttempt(db, row, attempts, nextAttemptAt) {
  await db.query(
    `UPDATE outbox SET status = 'pending', attempts = $3, next_attempt_at = $4, updated_at = now()
      WHERE id = $1 AND status = 'sending' AND team_id IS NOT DISTINCT FROM $2`,
    [row.id, row.team_id, attempts, nextAttemptAt]
  );
}
async function claimDue(db, now) {
  await db.query(
    "UPDATE outbox SET status = 'pending', next_attempt_at = now(), updated_at = now() WHERE status = 'sending' AND updated_at < now() - interval '15 minutes'"
  );
  return db.query(
    `UPDATE outbox SET status = 'sending', attempts = attempts + 1, updated_at = now()
      WHERE id IN (
        SELECT id FROM outbox
         WHERE status = 'pending' AND next_attempt_at <= $1
         ORDER BY created_at ASC, id ASC
         LIMIT 100
         FOR UPDATE SKIP LOCKED
      )
      RETURNING ${OUTBOX_COLUMNS}`,
    [now]
  );
}
async function settingsFor(global, userId) {
  return global.one(
    `SELECT quiet_start, quiet_end, time_zone, notif_shifts, notif_swaps, notif_billing
       FROM user_settings WHERE user_id = $1`,
    [userId]
  );
}
function categoryEnabled(settings, category) {
  if (category === "billing") return settings?.notif_billing ?? true;
  if (category === "swaps") return settings?.notif_swaps ?? true;
  return settings?.notif_shifts ?? true;
}
async function drainOutbox(deps, send, log) {
  const now = /* @__PURE__ */ new Date();
  for (const shard of deps.topology.shards) {
    const rows = await claimDue(shard, now);
    for (const row of rows) {
      try {
        const settings = await settingsFor(deps.topology.global, row.user_id);
        if (!categoryEnabled(settings, row.category)) {
          await markSent(shard, row);
          log.info({ outboxId: row.id, category: row.category }, "push skipped: category disabled");
          continue;
        }
        const devices = await deps.topology.global.query(
          "SELECT push_token FROM devices WHERE user_id = $1 AND push_token IS NOT NULL",
          [row.user_id]
        );
        const tokens = devices.map((d2) => d2.push_token).filter((token) => import_expo_server_sdk.Expo.isExpoPushToken(token));
        if (tokens.length === 0) {
          await markSent(shard, row);
          log.info({ outboxId: row.id }, "push skipped: no device tokens");
          continue;
        }
        if (row.urgency !== "urgent") {
          const quiet = msUntilQuietEnd(
            /* @__PURE__ */ new Date(),
            settings?.quiet_start ?? "22:00",
            settings?.quiet_end ?? "07:00",
            settings?.time_zone ?? "UTC"
          );
          if (quiet !== null) {
            const resumeAt = new Date(Date.now() + quiet);
            await markAttempt(shard, row, Math.max(0, row.attempts - 1), resumeAt);
            await deps.queue.add(PUSH_QUEUE, {}, { delayMs: quiet, attempts: MAX_PUSH_ATTEMPTS });
            log.info({ outboxId: row.id, resumeAt }, "push deferred: quiet hours");
            continue;
          }
        }
        await send(
          tokens.map((token) => ({
            to: token,
            title: row.title,
            body: row.body,
            data: row.data,
            sound: "default"
          }))
        );
        await markSent(shard, row);
      } catch (error) {
        const attempts = row.attempts;
        if (attempts >= MAX_PUSH_ATTEMPTS) {
          await markFailed(shard, row, attempts);
          log.warn({ outboxId: row.id, attempts, err: error }, "push gave up");
        } else {
          const delayMs = backoffMs(attempts);
          await markAttempt(shard, row, attempts, new Date(Date.now() + delayMs));
          await deps.queue.add(PUSH_QUEUE, {}, { delayMs, attempts: MAX_PUSH_ATTEMPTS });
          log.warn({ outboxId: row.id, attempts, err: error }, "push retry scheduled");
        }
      }
    }
  }
}
function expoSender(deps) {
  const expo = new import_expo_server_sdk.Expo({ accessToken: deps.env.EXPO_ACCESS_TOKEN || void 0 });
  return async (messages) => {
    const dead = [];
    for (const chunk of expo.chunkPushNotifications(messages)) {
      const tickets = await expo.sendPushNotificationsAsync(chunk);
      tickets.forEach((ticket, index) => {
        if (ticket.status === "error" && ticket.details?.error === "DeviceNotRegistered") {
          const to = chunk[index]?.to;
          if (typeof to === "string") dead.push(to);
        }
      });
    }
    if (dead.length > 0) {
      await deps.topology.global.query("DELETE FROM devices WHERE push_token = ANY($1)", [dead]);
    }
  };
}
async function runPushJob(deps, log) {
  await drainOutbox(deps, expoSender(deps), log);
}

// backend/src/repos/cursor.ts
function encodeCursor(t2, id) {
  const iso = t2 instanceof Date ? t2.toISOString() : new Date(t2).toISOString();
  return Buffer.from(JSON.stringify({ t: iso, i: id }), "utf8").toString("base64url");
}
function decodeCursor(cursor) {
  try {
    const payload = CursorPayload.parse(JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")));
    return { t: new Date(payload.t), i: payload.i };
  } catch {
    throw badRequest("Invalid cursor");
  }
}

// backend/src/repos/outbox.ts
async function insertOutbox(db, scope, input) {
  await db.query(
    `INSERT INTO outbox (id, team_id, user_id, category, urgency, title, body, data)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      newId(),
      scope.teamId,
      input.userId,
      input.category,
      input.urgency ?? "normal",
      input.title,
      input.body,
      JSON.stringify(input.data ?? {})
    ]
  );
}

// backend/src/repos/shifts.ts
var SHIFT_COLUMNS = "id, team_id, user_id, assignment_status, starts_at, ends_at, role, location, meeting_url, notes, version, created_by, created_at, updated_at";
function toShift(row, user) {
  return {
    id: row.id,
    teamId: row.team_id,
    userId: row.user_id,
    user,
    assignmentStatus: row.assignment_status,
    startsAt: isoStamp(row.starts_at),
    endsAt: isoStamp(row.ends_at),
    role: row.role,
    location: row.location,
    meetingUrl: row.meeting_url,
    notes: row.notes,
    version: row.version
  };
}
async function findShift(shards, shiftId) {
  for (const shard of shards) {
    const row = await shard.one(`SELECT ${SHIFT_COLUMNS} FROM shifts WHERE id = $1`, [shiftId]);
    if (row) return row;
  }
  return void 0;
}
async function getShift(db, scope, shiftId) {
  return db.one(`SELECT ${SHIFT_COLUMNS} FROM shifts WHERE id = $1 AND team_id = $2`, [
    shiftId,
    scope.teamId
  ]);
}
async function getShiftsByIds(db, scope, ids) {
  const unique = [...new Set(ids)];
  const found = /* @__PURE__ */ new Map();
  if (unique.length === 0) return found;
  const placeholders = unique.map((_3, index) => `$${index + 2}`).join(", ");
  const rows = await db.query(
    `SELECT ${SHIFT_COLUMNS} FROM shifts WHERE team_id = $1 AND id IN (${placeholders})`,
    [scope.teamId, ...unique]
  );
  for (const row of rows) found.set(row.id, row);
  return found;
}
async function hasOverlap(db, scope, args2) {
  const params = [scope.teamId, args2.userId, args2.startsAt.toISOString(), args2.endsAt.toISOString()];
  const conditions = ["team_id = $1", "user_id = $2", "starts_at < $4::timestamptz", "ends_at > $3::timestamptz"];
  if (args2.excludeShiftId) {
    params.push(args2.excludeShiftId);
    conditions.push(`id <> $${params.length}`);
  }
  const row = await db.one(`SELECT 1 FROM shifts WHERE ${conditions.join(" AND ")} LIMIT 1`, params);
  return row !== void 0;
}
async function insertShift(db, scope, input) {
  const row = await db.one(
    `INSERT INTO shifts (id, team_id, user_id, assignment_status, starts_at, ends_at, role, location, meeting_url, notes, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING ${SHIFT_COLUMNS}`,
    [
      newId(),
      scope.teamId,
      input.userId,
      input.assignmentStatus ?? "pending",
      input.startsAt.toISOString(),
      input.endsAt.toISOString(),
      input.role ?? null,
      input.location ?? null,
      input.meetingUrl ?? null,
      input.notes ?? null,
      input.createdBy
    ]
  );
  if (!row) throw new Error("failed to create shift");
  return row;
}
async function updateShift(db, scope, shiftId, values) {
  const reassign = values.userId !== void 0;
  return db.one(
    `UPDATE shifts
        SET starts_at = $3::timestamptz, ends_at = $4::timestamptz, role = $5, location = $6,
            meeting_url = $7, notes = $8,
            ${reassign ? "user_id = $9, assignment_status = $10," : ""}
            version = version + 1, updated_at = now()
      WHERE id = $1 AND team_id = $2
      RETURNING ${SHIFT_COLUMNS}`,
    reassign ? [
      shiftId,
      scope.teamId,
      values.startsAt.toISOString(),
      values.endsAt.toISOString(),
      values.role,
      values.location,
      values.meetingUrl,
      values.notes,
      values.userId,
      values.assignmentStatus ?? "pending"
    ] : [
      shiftId,
      scope.teamId,
      values.startsAt.toISOString(),
      values.endsAt.toISOString(),
      values.role,
      values.location,
      values.meetingUrl,
      values.notes
    ]
  );
}
async function deleteShift(db, scope, shiftId) {
  return db.one(`DELETE FROM shifts WHERE id = $1 AND team_id = $2 RETURNING ${SHIFT_COLUMNS}`, [
    shiftId,
    scope.teamId
  ]);
}
async function respondToShift(db, scope, shiftId, action) {
  const setAssignment = action === "accept" ? "assignment_status = 'accepted'" : "user_id = NULL, assignment_status = 'accepted'";
  return db.one(
    `UPDATE shifts
        SET ${setAssignment},
            version = version + 1,
            updated_at = now()
      WHERE id = $1 AND team_id = $2 AND user_id IS NOT NULL
      RETURNING ${SHIFT_COLUMNS}`,
    [shiftId, scope.teamId]
  );
}
async function listShifts(db, scope, args2) {
  const params = [scope.teamId, args2.to.toISOString(), args2.from.toISOString()];
  const conditions = ["team_id = $1", "starts_at < $2::timestamptz", "ends_at > $3::timestamptz"];
  if (args2.userId) {
    params.push(args2.userId);
    conditions.push(`user_id = $${params.length}`);
  }
  if (args2.after) {
    params.push(args2.after.t.toISOString(), args2.after.i);
    conditions.push(`(starts_at, id) > ($${params.length - 1}::timestamptz, $${params.length}::uuid)`);
  }
  params.push(args2.limit);
  return db.query(
    `SELECT ${SHIFT_COLUMNS} FROM shifts
      WHERE ${conditions.join(" AND ")}
      ORDER BY starts_at ASC, id ASC
      LIMIT $${params.length}`,
    params
  );
}

// backend/src/routes/shifts.ts
var TeamParams2 = import_zod4.z.object({ teamId: Id }).strict();
var ShiftParams = import_zod4.z.object({ shiftId: Id }).strict();
var ListShiftsQuery = QueryParams.shifts.extend({
  cursor: Cursor.optional(),
  limit: import_zod4.z.coerce.number().int().min(1).max(50).optional()
}).strict();
async function shiftPayload(deps, row) {
  const directory = await loadUsersByIds(deps.topology.global, [row.user_id]);
  return toShift(row, briefUser(directory, row.user_id));
}
async function requireShiftMembership(deps, req, shiftId) {
  const row = await findShift(deps.topology.shards, shiftId);
  if (!row) throw notFound("That shift does not exist.");
  const membership = await requireMembership(deps.env, deps.topology, req, row.team_id);
  const shift = await getShift(deps.topology.shardDb(membership.scope), membership.scope, shiftId);
  if (!shift) throw notFound("That shift does not exist.");
  return { membership, scope: membership.scope, shift };
}
function registerShiftRoutes(app, deps) {
  app.get("/v1/teams/:teamId/shifts", async (req) => {
    const { teamId } = parseWith(TeamParams2, req.params, "params");
    const membership = await requireMembership(deps.env, deps.topology, req, teamId);
    assertCan(membership.role, "shift.read");
    const query = parseWith(ListShiftsQuery, req.query, "query");
    const from = new Date(query.from);
    const to = new Date(query.to);
    const limit = query.limit ?? 50;
    const after = query.cursor ? decodeCursor(query.cursor) : void 0;
    const db = deps.topology.shardDb(membership.scope);
    const userId = query.mine === "1" ? membership.user.id : void 0;
    const key = calendarKey(membership.scope.teamId, {
      from: query.from,
      to: query.to,
      mine: query.mine ?? "0",
      user: userId ?? "",
      cursor: query.cursor ?? "",
      limit
    });
    return cached(deps.cache, key, CALENDAR_TTL_MS, async () => {
      const rows = await listShifts(db, membership.scope, { from, to, userId, after, limit: limit + 1 });
      const hasMore = rows.length > limit;
      const page = hasMore ? rows.slice(0, limit) : rows;
      const last = page[page.length - 1];
      const directory = await loadUsersByIds(deps.topology.global, page.map((row) => row.user_id));
      return {
        items: page.map((row) => toShift(row, briefUser(directory, row.user_id))),
        nextCursor: hasMore && last ? encodeCursor(last.starts_at, last.id) : null
      };
    });
  });
  app.post("/v1/teams/:teamId/shifts", async (req) => {
    const { teamId } = parseWith(TeamParams2, req.params, "params");
    const membership = await requireMembership(deps.env, deps.topology, req, teamId);
    assertCan(membership.role, "shift.create");
    await assertTeamWritable(deps.topology.shardDb(membership.scope), membership.scope.teamId);
    const body2 = parseWith(RequestBodies.createShift, req.body, "body");
    const startsAt = new Date(body2.startsAt);
    const endsAt = new Date(body2.endsAt);
    if (endsAt.getTime() <= startsAt.getTime()) throw badRequest("endsAt must be after startsAt");
    const db = deps.topology.shardDb(membership.scope);
    const target = (await membersByIds(db, membership.scope, [body2.userId])).get(body2.userId);
    if (!target?.active) throw conflict("That user is not an active member.");
    const assignee = (await loadUsersByIds(deps.topology.global, [body2.userId])).get(body2.userId);
    const row = await db.tx(async (tx) => {
      if (await hasOverlap(tx, membership.scope, { userId: body2.userId, startsAt, endsAt })) {
        throw conflict("That member already has a shift in this window.");
      }
      return insertShift(tx, membership.scope, {
        userId: body2.userId,
        startsAt,
        endsAt,
        role: body2.role,
        location: body2.location,
        meetingUrl: body2.meetingUrl,
        notes: body2.notes,
        createdBy: membership.user.id,
        // Only the assignee can answer an assignment, so planning your own
        // shift is already settled; anyone else's lands as pending.
        assignmentStatus: body2.userId === membership.user.id ? "accepted" : "pending"
      });
    });
    if (body2.userId !== membership.user.id) {
      const zones = await loadUserZones(deps.topology.global, [body2.userId]);
      const zone = zones.get(body2.userId) ?? "UTC";
      await insertOutbox(db, membership.scope, {
        userId: body2.userId,
        category: "shifts",
        urgency: "normal",
        title: "You have a new shift",
        body: `You were assigned a shift: ${wallRange(row.starts_at, row.ends_at, zone)}.`,
        data: {
          shiftId: row.id,
          startsAt: row.starts_at.toISOString(),
          endsAt: row.ends_at.toISOString(),
          url: `rota://shift/${row.id}`
        }
      });
      await requestPushDelivery(deps.queue);
    }
    await logActivity(db, membership.scope, {
      type: "shift.created",
      actorId: membership.user.id,
      summary: `${membership.user.name} scheduled a shift for ${assignee?.name ?? "a team member"}`,
      data: { shiftId: row.id, userId: body2.userId }
    });
    await invalidatePrefix(deps.cache, calendarPrefix(membership.scope.teamId));
    return shiftPayload(deps, row);
  });
  app.patch("/v1/shifts/:shiftId", async (req) => {
    const { shiftId } = parseWith(ShiftParams, req.params, "params");
    const { membership, scope, shift } = await requireShiftMembership(deps, req, shiftId);
    assertCan(membership.role, "shift.update");
    await assertTeamWritable(deps.topology.shardDb(membership.scope), membership.scope.teamId);
    const body2 = parseWith(RequestBodies.updateShift, req.body, "body");
    const hasTimes = body2.startsAt !== void 0 || body2.endsAt !== void 0;
    if (hasTimes && (body2.startsAt === void 0 || body2.endsAt === void 0)) {
      throw badRequest("startsAt and endsAt must be provided together");
    }
    const startsAt = body2.startsAt ? new Date(body2.startsAt) : shift.starts_at;
    const endsAt = body2.endsAt ? new Date(body2.endsAt) : shift.ends_at;
    if (endsAt.getTime() <= startsAt.getTime()) throw badRequest("endsAt must be after startsAt");
    const db = deps.topology.shardDb(membership.scope);
    const reassign = body2.userId !== void 0 && body2.userId !== shift.user_id;
    const nextUserId = reassign ? body2.userId : shift.user_id;
    if (reassign && nextUserId) {
      const target = (await membersByIds(db, scope, [nextUserId])).get(nextUserId);
      if (!target?.active) throw conflict("That user is not an active member.");
    }
    const updated = await db.tx(async (tx) => {
      if ((hasTimes || reassign) && nextUserId && await hasOverlap(tx, scope, { userId: nextUserId, startsAt, endsAt, excludeShiftId: shiftId })) {
        throw conflict("That member already has a shift in this window.");
      }
      return updateShift(tx, scope, shiftId, {
        startsAt,
        endsAt,
        role: body2.role === void 0 ? shift.role : body2.role,
        location: body2.location === void 0 ? shift.location : body2.location,
        meetingUrl: body2.meetingUrl === void 0 ? shift.meeting_url : body2.meetingUrl,
        notes: body2.notes === void 0 ? shift.notes : body2.notes,
        ...reassign ? {
          userId: nextUserId ?? void 0,
          // Reassignment lands as pending for the new assignee, except when
          // a scheduler hands the shift to themselves (same rule as create).
          assignmentStatus: nextUserId === membership.user.id ? "accepted" : "pending"
        } : {}
      });
    });
    if (!updated) throw notFound("That shift does not exist.");
    if (reassign) {
      if (shift.user_id && shift.user_id !== nextUserId) {
        await insertOutbox(db, scope, {
          userId: shift.user_id,
          category: "shifts",
          urgency: "normal",
          title: "A shift was reassigned",
          body: `A shift you held now belongs to someone else: ${wallRange(updated.starts_at, updated.ends_at, "UTC")}.`,
          data: { shiftId: shift.id, url: `rota://shift/${shift.id}` }
        });
      }
      if (nextUserId && nextUserId !== membership.user.id) {
        const zones = await loadUserZones(deps.topology.global, [nextUserId]);
        const zone = zones.get(nextUserId) ?? "UTC";
        await insertOutbox(db, scope, {
          userId: nextUserId,
          category: "shifts",
          urgency: "normal",
          title: "You have a new shift",
          body: `You were assigned a shift: ${wallRange(updated.starts_at, updated.ends_at, zone)}.`,
          data: {
            shiftId: updated.id,
            startsAt: updated.starts_at.toISOString(),
            endsAt: updated.ends_at.toISOString(),
            url: `rota://shift/${updated.id}`
          }
        });
      }
      await requestPushDelivery(deps.queue);
    } else if (shift.user_id && shift.user_id !== membership.user.id) {
      const zone = (await loadUserZones(deps.topology.global, [shift.user_id])).get(shift.user_id) ?? "UTC";
      await insertOutbox(db, scope, {
        userId: shift.user_id,
        category: "shifts",
        urgency: "normal",
        title: "One of your shifts changed",
        body: `A shift you are assigned to was updated: ${wallRange(updated.starts_at, updated.ends_at, zone)}.`,
        data: {
          shiftId: shift.id,
          startsAt: updated.starts_at.toISOString(),
          endsAt: updated.ends_at.toISOString(),
          url: `rota://shift/${shift.id}`
        }
      });
      await requestPushDelivery(deps.queue);
    }
    const reassignee = reassign && nextUserId ? (await loadUsersByIds(deps.topology.global, [nextUserId])).get(nextUserId) : void 0;
    await logActivity(db, scope, {
      type: "shift.updated",
      actorId: membership.user.id,
      summary: reassignee ? `${membership.user.name} reassigned a shift on ${wallRange(updated.starts_at, updated.ends_at, membership.user.timezone)} to ${reassignee.name}` : `${membership.user.name} updated a shift on ${wallRange(updated.starts_at, updated.ends_at, membership.user.timezone)}`,
      data: { shiftId: shift.id }
    });
    await invalidatePrefix(deps.cache, calendarPrefix(scope.teamId));
    return shiftPayload(deps, updated);
  });
  app.delete("/v1/shifts/:shiftId", async (req, reply) => {
    const { shiftId } = parseWith(ShiftParams, req.params, "params");
    parseWith(NoQuery, req.query, "query");
    const { membership, scope, shift } = await requireShiftMembership(deps, req, shiftId);
    assertCan(membership.role, "shift.delete");
    await assertTeamWritable(deps.topology.shardDb(membership.scope), membership.scope.teamId);
    const db = deps.topology.shardDb(membership.scope);
    const deleted = await deleteShift(db, scope, shiftId);
    if (!deleted) throw notFound("That shift does not exist.");
    if (shift.user_id && shift.user_id !== membership.user.id) {
      await insertOutbox(db, scope, {
        userId: shift.user_id,
        category: "shifts",
        urgency: "normal",
        title: "One of your shifts was removed",
        body: "A shift you were assigned to was removed.",
        data: { shiftId: shift.id, url: `rota://shift/${shift.id}` }
      });
      await requestPushDelivery(deps.queue);
    }
    await logActivity(db, scope, {
      type: "shift.deleted",
      actorId: membership.user.id,
      summary: `${membership.user.name} removed a shift on ${wallRange(deleted.starts_at, deleted.ends_at, membership.user.timezone)}`,
      data: { shiftId: shift.id }
    });
    await invalidatePrefix(deps.cache, calendarPrefix(scope.teamId));
    reply.status(204);
    return null;
  });
  app.post("/v1/shifts/:shiftId/respond", async (req) => {
    const { shiftId } = parseWith(ShiftParams, req.params, "params");
    const { membership, scope, shift } = await requireShiftMembership(deps, req, shiftId);
    assertCan(membership.role, "shift.respond");
    await assertTeamWritable(deps.topology.shardDb(membership.scope), membership.scope.teamId);
    const body2 = parseWith(RequestBodies.respondToShift, req.body, "body");
    if (!shift.user_id || shift.user_id !== membership.user.id) {
      throw forbidden("Only the assigned member can respond to this shift.");
    }
    const db = deps.topology.shardDb(membership.scope);
    const updated = await db.tx((tx) => respondToShift(tx, scope, shiftId, body2.action));
    if (!updated) throw notFound("That shift does not exist.");
    if (body2.action === "decline") {
      const schedulers = (await listActiveMembers(db, scope)).filter(
        (member) => member.role === "owner" || member.role === "admin" || member.role === "manager"
      );
      const zones = await loadUserZones(
        deps.topology.global,
        schedulers.map((member) => member.user_id)
      );
      for (const scheduler of schedulers) {
        if (scheduler.user_id === membership.user.id) continue;
        const zone = zones.get(scheduler.user_id) ?? "UTC";
        await insertOutbox(db, scope, {
          userId: scheduler.user_id,
          category: "shifts",
          urgency: "urgent",
          title: "A shift was declined",
          body: `${membership.user.name} declined the shift on ${wallRange(shift.starts_at, shift.ends_at, zone)}. It is open again.`,
          data: {
            shiftId: shift.id,
            startsAt: shift.starts_at.toISOString(),
            endsAt: shift.ends_at.toISOString(),
            url: `rota://shift/${shift.id}`
          }
        });
      }
      await requestPushDelivery(deps.queue);
    }
    await logActivity(db, scope, {
      type: body2.action === "decline" ? "shift.declined" : "shift.accepted",
      actorId: membership.user.id,
      summary: body2.action === "decline" ? `${membership.user.name} declined a shift on ${wallRange(shift.starts_at, shift.ends_at, membership.user.timezone)}` : `${membership.user.name} accepted a shift on ${wallRange(shift.starts_at, shift.ends_at, membership.user.timezone)}`,
      data: { shiftId: shift.id }
    });
    await invalidatePrefix(deps.cache, calendarPrefix(scope.teamId));
    return shiftPayload(deps, updated);
  });
}

// backend/src/routes/swaps.ts
var import_zod5 = require("zod");

// backend/src/repos/swaps.ts
var SWAP_COLUMNS = "id, team_id, shift_id, from_user_id, to_user_id, note, status, decided_by, decided_at, created_at, updated_at";
async function findSwap(shards, swapId) {
  for (const shard of shards) {
    const row = await shard.one(`SELECT ${SWAP_COLUMNS} FROM swap_requests WHERE id = $1`, [swapId]);
    if (row) return row;
  }
  return void 0;
}
async function pendingForShift(db, scope, shiftId) {
  return db.one(
    `SELECT ${SWAP_COLUMNS} FROM swap_requests WHERE team_id = $1 AND shift_id = $2 AND status = 'pending'`,
    [scope.teamId, shiftId]
  );
}
async function insertSwap(db, scope, input) {
  const row = await db.one(
    `INSERT INTO swap_requests (id, team_id, shift_id, from_user_id, to_user_id, note)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${SWAP_COLUMNS}`,
    [newId(), scope.teamId, input.shiftId, input.fromUserId, input.toUserId, input.note]
  );
  if (!row) throw new Error("failed to create swap request");
  return row;
}
async function decideSwap(db, scope, swapId, decision) {
  const rows = await db.query(
    `UPDATE swap_requests
        SET status = $3, decided_by = $4, decided_at = now(), updated_at = now()
      WHERE id = $1 AND team_id = $2 AND status = 'pending'
      RETURNING ${SWAP_COLUMNS}`,
    [swapId, scope.teamId, decision.status, decision.decidedBy]
  );
  return rows[0];
}
async function listSwaps(db, scope, args2) {
  const params = [scope.teamId];
  const conditions = ["team_id = $1"];
  if (args2.status) {
    params.push(args2.status);
    conditions.push(`status = $${params.length}`);
  }
  if (args2.after) {
    params.push(args2.after.t.toISOString(), args2.after.i);
    conditions.push(`(created_at, id) < ($${params.length - 1}::timestamptz, $${params.length}::uuid)`);
  }
  params.push(args2.limit);
  return db.query(
    `SELECT ${SWAP_COLUMNS} FROM swap_requests
      WHERE ${conditions.join(" AND ")}
      ORDER BY created_at DESC, id DESC
      LIMIT $${params.length}`,
    params
  );
}

// backend/src/routes/swaps.ts
var TeamParams3 = import_zod5.z.object({ teamId: Id }).strict();
var ShiftParams2 = import_zod5.z.object({ shiftId: Id }).strict();
var SwapParams = import_zod5.z.object({ swapId: Id }).strict();
var SCHEDULERS2 = /* @__PURE__ */ new Set(["owner", "admin", "manager"]);
async function requireShiftMembership2(deps, req, shiftId) {
  const row = await getShiftFromAnyShard(deps, shiftId);
  if (!row) throw notFound("That shift does not exist.");
  const membership = await requireMembership(deps.env, deps.topology, req, row.team_id);
  const shift = await getShift(deps.topology.shardDb(membership.scope), membership.scope, shiftId);
  if (!shift) throw notFound("That shift does not exist.");
  return { membership, scope: membership.scope, shift };
}
async function getShiftFromAnyShard(deps, shiftId) {
  const cols = "id, team_id, user_id, starts_at, ends_at, role, location, notes, version, created_by, created_at, updated_at";
  for (const shard of deps.topology.shards) {
    const row = await shard.one(`SELECT ${cols} FROM shifts WHERE id = $1`, [shiftId]);
    if (row) return row;
  }
  return void 0;
}
function toSwapPayload(row, shift, members, directory) {
  const from = members.get(row.from_user_id);
  const to = row.to_user_id ? members.get(row.to_user_id) : void 0;
  return {
    id: row.id,
    shift: toShift(shift, briefUser(directory, shift.user_id)),
    fromUser: toPublicUser(
      directory.get(row.from_user_id),
      from?.role ?? "member",
      from?.active ?? true,
      row.from_user_id
    ),
    toUser: row.to_user_id && to ? toPublicUser(directory.get(row.to_user_id), to.role, to.active, row.to_user_id) : null,
    status: row.status,
    note: row.note,
    createdAt: isoStamp(row.created_at),
    decidedAt: row.decided_at ? isoStamp(row.decided_at) : null
  };
}
async function swapPayloads(deps, db, scope, rows) {
  const shiftIds = rows.map((row) => row.shift_id);
  const userIds = rows.flatMap((row) => [row.from_user_id, row.to_user_id ?? ""]).filter((id) => id.length > 0);
  const shifts = await getShiftsByIds(db, scope, shiftIds);
  const members = await membersByIds(db, scope, userIds);
  const directory = await loadUsersByIds(deps.topology.global, userIds);
  return rows.map((row) => {
    const shift = shifts.get(row.shift_id);
    if (!shift) throw notFound("That shift does not exist.");
    return toSwapPayload(row, shift, members, directory);
  });
}
async function swapPayload(deps, db, scope, row) {
  const [payload] = await swapPayloads(deps, db, scope, [row]);
  if (!payload) throw notFound("That shift does not exist.");
  return payload;
}
function registerSwapRoutes(app, deps) {
  app.get("/v1/teams/:teamId/swaps", async (req) => {
    const { teamId } = parseWith(TeamParams3, req.params, "params");
    const membership = await requireMembership(deps.env, deps.topology, req, teamId);
    assertCan(membership.role, "swap.read");
    const query = parseWith(QueryParams.swaps, req.query, "query");
    const limit = query.limit ?? 50;
    const after = query.cursor ? decodeCursor(query.cursor) : void 0;
    const db = deps.topology.shardDb(membership.scope);
    const rows = await listSwaps(db, membership.scope, { status: query.status, after, limit: limit + 1 });
    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    const last = page[page.length - 1];
    return {
      items: await swapPayloads(deps, db, membership.scope, page),
      nextCursor: hasMore && last ? encodeCursor(last.created_at, last.id) : null
    };
  });
  app.post("/v1/shifts/:shiftId/swap-requests", async (req) => {
    const { shiftId } = parseWith(ShiftParams2, req.params, "params");
    const { membership, scope, shift } = await requireShiftMembership2(deps, req, shiftId);
    assertCan(membership.role, "swap.request");
    await assertTeamWritable(deps.topology.shardDb(membership.scope), membership.scope.teamId);
    if (shift.user_id !== membership.user.id && !SCHEDULERS2.has(membership.role)) {
      throw forbidden("Only the assigned member or a scheduler can request a swap.");
    }
    const assigneeId = shift.user_id;
    if (!assigneeId) throw conflict("This shift is open \u2014 there is nobody to swap with.");
    const body2 = parseWith(RequestBodies.createSwapRequest, req.body, "body");
    if (body2.toUserId === assigneeId) throw conflict("That member already holds this shift.");
    if (body2.toUserId === membership.user.id && assigneeId === body2.toUserId) {
      throw badRequest("You cannot swap a shift with yourself.");
    }
    const db = deps.topology.shardDb(membership.scope);
    if (body2.toUserId) {
      const members = await membersByIds(db, scope, [body2.toUserId]);
      const target = members.get(body2.toUserId);
      if (!target?.active) throw conflict("That user is not an active member.");
    }
    const row = await db.tx(async (tx) => {
      const locked = await tx.one(
        "SELECT id FROM shifts WHERE id = $1 AND team_id = $2 FOR UPDATE",
        [shiftId, scope.teamId]
      );
      if (!locked) throw notFound("That shift does not exist.");
      if (await pendingForShift(tx, scope, shiftId)) {
        throw conflict("That shift already has a pending swap request.");
      }
      return insertSwap(tx, scope, {
        shiftId,
        fromUserId: assigneeId,
        toUserId: body2.toUserId ?? null,
        note: body2.note ?? null
      });
    });
    const recipients = body2.toUserId ? [body2.toUserId] : (await listActiveMembers(db, scope)).filter((m4) => m4.user_id !== assigneeId).map((m4) => m4.user_id);
    for (const userId of recipients) {
      await insertOutbox(db, scope, {
        userId,
        category: "swaps",
        urgency: "normal",
        title: body2.toUserId ? "You were asked to take a shift" : "A shift is up for grabs",
        body: `${membership.user.name} requested a swap ${body2.toUserId ? "from you" : "open to the team"}.`,
        data: { swapId: row.id, shiftId: row.shift_id, url: `rota://swap/${row.id}` }
      });
    }
    if (recipients.length > 0) await requestPushDelivery(deps.queue);
    await logActivity(db, scope, {
      type: "swap.requested",
      actorId: membership.user.id,
      summary: `${membership.user.name} requested a swap for a shift on ${new Date(shift.starts_at).toISOString()}`,
      data: { swapId: row.id, shiftId: shift.id, targeted: body2.toUserId ? true : false }
    });
    return swapPayload(deps, db, scope, row);
  });
  app.post("/v1/swaps/:swapId/decision", async (req) => {
    const { swapId } = parseWith(SwapParams, req.params, "params");
    const body2 = parseWith(RequestBodies.decideSwap, req.body, "body");
    const swap = await findSwap(deps.topology.shards, swapId);
    if (!swap) throw notFound("That swap request does not exist.");
    const membership = await requireMembership(deps.env, deps.topology, req, swap.team_id);
    const caller = membership.user.id;
    const isRequester = swap.from_user_id === caller;
    if (!(isRequester && body2.decision === "reject")) {
      assertCan(membership.role, "swap.decide");
    }
    await assertTeamWritable(deps.topology.shardDb(membership.scope), membership.scope.teamId);
    if (swap.status !== "pending") throw conflict("This request has already been decided.");
    const status = body2.decision === "approve" ? "approved" : "rejected";
    if (body2.decision === "approve" && isRequester) {
      throw forbidden("You cannot approve your own swap request.");
    }
    const finalStatus = isRequester && body2.decision === "reject" ? "canceled" : status;
    const db = deps.topology.shardDb(membership.scope);
    const newOwner = body2.decision === "approve" ? swap.to_user_id ?? caller : swap.from_user_id;
    const decided = await db.tx(async (tx) => {
      const row = await decideSwap(tx, membership.scope, swapId, {
        status: finalStatus,
        decidedBy: caller
      });
      if (!row) throw conflict("This request has already been decided.");
      if (row.status === "approved") {
        await tx.query("UPDATE shifts SET user_id = $3, version = version + 1, updated_at = now() WHERE id = $1 AND team_id = $2", [
          row.shift_id,
          membership.scope.teamId,
          newOwner
        ]);
      }
      const shift = await getShift(tx, membership.scope, row.shift_id);
      return { row, shift };
    });
    if (!decided.shift) throw notFound("That shift does not exist.");
    const notify = /* @__PURE__ */ new Set();
    if (swap.from_user_id !== caller) notify.add(swap.from_user_id);
    if (finalStatus === "approved" && newOwner !== caller && newOwner !== swap.from_user_id) {
      notify.add(newOwner);
    }
    for (const userId of notify) {
      await insertOutbox(db, membership.scope, {
        userId,
        category: "swaps",
        urgency: "normal",
        title: finalStatus === "approved" ? "Your swap was approved" : "Your swap request was declined",
        body: finalStatus === "approved" ? `${membership.user.name} approved your swap.` : `${membership.user.name} ${finalStatus === "canceled" ? "canceled" : "declined"} your swap.`,
        data: { swapId: swap.id, shiftId: swap.shift_id, status: finalStatus, url: `rota://swap/${swap.id}` }
      });
    }
    if (notify.size > 0) await requestPushDelivery(deps.queue);
    await logActivity(db, membership.scope, {
      type: "swap.decided",
      actorId: caller,
      summary: `${membership.user.name} ${finalStatus} a swap on a shift on ${new Date(decided.shift.starts_at).toISOString()}`,
      data: { swapId: swap.id, shiftId: swap.shift_id, status: finalStatus }
    });
    if (finalStatus === "approved") {
      await invalidatePrefix(deps.cache, calendarPrefix(membership.scope.teamId));
    }
    return swapPayload(deps, db, membership.scope, decided.row);
  });
  app.get("/v1/shifts/:shiftId/swap-suggestions", async (req) => {
    const { shiftId } = parseWith(ShiftParams2, req.params, "params");
    parseWith(NoQuery, req.query, "query");
    const { membership, scope, shift } = await requireShiftMembership2(deps, req, shiftId);
    assertCan(membership.role, "swap.suggest");
    await deps.rateLimiter.enforce(RATE_RULES.swapSuggest, `user:${membership.user.id}`);
    if (!deps.env.FEATURE_SWAP_ASSIST) {
      throw notFound("Swap Assist is not enabled for this workspace.");
    }
    const db = deps.topology.shardDb(membership.scope);
    const authors = await listActiveMembers(db, scope);
    const directory = await loadUsersByIds(deps.topology.global, authors.map((member) => member.user_id));
    const suggestions = [];
    for (const member of authors) {
      if (member.user_id === membership.user.id) continue;
      const overlapping = await db.one(
        `SELECT 1 FROM shifts
          WHERE team_id = $1 AND user_id = $2 AND starts_at < $3::timestamptz AND ends_at > $4::timestamptz
          LIMIT 1`,
        [scope.teamId, member.user_id, shift.ends_at.toISOString(), shift.starts_at.toISOString()]
      );
      if (overlapping) {
        suggestions.push({
          userId: member.user_id,
          name: directory.get(member.user_id)?.name ?? "Unknown user",
          score: 0,
          eligible: false,
          reasons: [],
          blockers: ["has an overlapping shift"],
          sentence: null
        });
        continue;
      }
      const sameDay = await db.one(
        `SELECT 1 FROM shifts
          WHERE team_id = $1 AND user_id = $2
            AND starts_at >= date_trunc('day', $3::timestamptz) AND starts_at < date_trunc('day', $3::timestamptz) + interval '1 day'
          LIMIT 1`,
        [scope.teamId, member.user_id, shift.starts_at.toISOString()]
      );
      const sameRole = shift.role ? await db.one(
        `SELECT 1 FROM shifts
              WHERE team_id = $1 AND user_id = $2 AND role = $4
                AND starts_at >= $3::timestamptz - interval '30 days' AND starts_at < $3::timestamptz
              LIMIT 1`,
        [scope.teamId, member.user_id, shift.starts_at.toISOString(), shift.role]
      ) : void 0;
      const reasons = [];
      const score = 60 + (sameDay ? 20 : 0) + (sameRole ? 10 : 0);
      if (!sameDay) reasons.push("Free for the rest of that day");
      else reasons.push("Has no other shift that day");
      if (sameRole) reasons.push("Has worked this role recently");
      suggestions.push({
        userId: member.user_id,
        name: directory.get(member.user_id)?.name ?? "Unknown user",
        score,
        eligible: true,
        reasons,
        blockers: [],
        sentence: null
      });
    }
    suggestions.sort((a2, b3) => {
      if (a2.eligible !== b3.eligible) return a2.eligible ? -1 : 1;
      if (b3.score !== a2.score) return b3.score - a2.score;
      return a2.userId < b3.userId ? -1 : a2.userId > b3.userId ? 1 : 0;
    });
    return { shiftId, suggestions: suggestions.slice(0, 3), deterministic: true };
  });
}

// backend/src/routes/feed.ts
var import_zod6 = require("zod");

// backend/src/repos/feed.ts
var ACTIVITY_COLUMNS = "id, team_id, type, actor_id, summary, data, created_at";
async function listActivity(db, scope, args2) {
  if (args2.after) {
    return db.query(
      `SELECT ${ACTIVITY_COLUMNS} FROM activity
        WHERE team_id = $1 AND (created_at, id) < ($2::timestamptz, $3::uuid)
        ORDER BY created_at DESC, id DESC
        LIMIT $4`,
      [scope.teamId, args2.after.t.toISOString(), args2.after.i, args2.limit]
    );
  }
  return db.query(
    `SELECT ${ACTIVITY_COLUMNS} FROM activity
      WHERE team_id = $1
      ORDER BY created_at DESC, id DESC
      LIMIT $2`,
    [scope.teamId, args2.limit]
  );
}

// backend/src/routes/feed.ts
var TeamParams4 = import_zod6.z.object({ teamId: Id }).strict();
function toActivityItem(row, directory) {
  return {
    id: row.id,
    type: row.type,
    actor: row.actor_id ? briefUser(directory, row.actor_id) : null,
    summary: row.summary,
    data: row.data ?? {},
    createdAt: isoStamp(row.created_at)
  };
}
function registerFeedRoutes(app, deps) {
  app.get("/v1/teams/:teamId/activity", async (req) => {
    const { teamId } = parseWith(TeamParams4, req.params, "params");
    const membership = await requireMembership(deps.env, deps.topology, req, teamId);
    assertCan(membership.role, "feed.read");
    const query = parseWith(QueryParams.feed, req.query, "query");
    const limit = query.limit ?? 20;
    const after = query.cursor ? decodeCursor(query.cursor) : void 0;
    const db = deps.topology.shardDb(membership.scope);
    const rows = await listActivity(db, membership.scope, { after, limit: limit + 1 });
    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    const directory = await loadUsersByIds(
      deps.topology.global,
      page.map((row) => row.actor_id)
    );
    const items = page.map((row) => toActivityItem(row, directory));
    const last = page[page.length - 1];
    return {
      items,
      nextCursor: hasMore && last ? encodeCursor(last.created_at, last.id) : null
    };
  });
}

// backend/src/routes/billing.ts
var import_zod7 = require("zod");

// backend/src/repos/ledger.ts
var LEDGER_COLUMNS = "id, team_id, kind, amount_cents, currency, ref, reason, created_at";
async function appendLedgerEntry(db, scope, input) {
  return db.one(
    `INSERT INTO ledger_entries (id, team_id, kind, amount_cents, currency, ref, reason)
     VALUES ($1, $2, $3, $4, 'USD', $5, $6)
     ON CONFLICT (ref) DO NOTHING
     RETURNING ${LEDGER_COLUMNS}`,
    [newId(), scope.teamId, input.kind, input.amountCents, input.ref, input.reason]
  );
}
async function listLedger(db, scope, args2) {
  if (args2.after) {
    return db.query(
      `SELECT ${LEDGER_COLUMNS} FROM ledger_entries
        WHERE team_id = $1 AND (created_at, id) < ($2::timestamptz, $3::uuid)
        ORDER BY created_at DESC, id DESC
        LIMIT $4`,
      [scope.teamId, args2.after.t.toISOString(), args2.after.i, args2.limit]
    );
  }
  return db.query(
    `SELECT ${LEDGER_COLUMNS} FROM ledger_entries
      WHERE team_id = $1
      ORDER BY created_at DESC, id DESC
      LIMIT $2`,
    [scope.teamId, args2.limit]
  );
}

// backend/src/billing/ledger.ts
function toLedgerEntry(row) {
  if (row.currency !== "USD") throw new ApiError("INTERNAL", 500, `unsupported ledger currency ${row.currency}`);
  return {
    id: row.id,
    kind: row.kind,
    amountCents: row.amount_cents,
    currency: "USD",
    ref: row.ref,
    reason: row.reason,
    createdAt: new Date(row.created_at).toISOString()
  };
}
function encodeCursor2(row) {
  return Buffer.from(JSON.stringify({ t: new Date(row.created_at).toISOString(), i: row.id }), "utf8").toString(
    "base64url"
  );
}
function decodeCursor2(cursor) {
  try {
    const payload = CursorPayload.parse(JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")));
    return { t: new Date(payload.t), i: payload.i };
  } catch {
    throw badRequest("Invalid cursor");
  }
}
async function ledgerPage(db, scope, query) {
  const limit = query.limit ?? 20;
  const after = query.cursor ? decodeCursor2(query.cursor) : void 0;
  const rows = await listLedger(db, scope, { limit: limit + 1, after });
  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const last = page[page.length - 1];
  return {
    items: page.map(toLedgerEntry),
    nextCursor: hasMore && last ? encodeCursor2(last) : null
  };
}

// backend/src/billing/flutterwave.ts
var FLUTTERWAVE_API = "https://api.flutterwave.com/v3";
var FLUTTERWAVE_CURRENCY = "USD";
function toMajorUnits(amountCents) {
  return amountCents / 100;
}
function toMinorUnits(amount) {
  return Math.round(amount * 100);
}
var FlutterwaveProvider = class {
  constructor(secretKey, baseUrl = FLUTTERWAVE_API) {
    this.secretKey = secretKey;
    this.baseUrl = baseUrl;
  }
  secretKey;
  baseUrl;
  name = "flutterwave";
  async authorize(input) {
    const res = await fetch(`${this.baseUrl}/payments`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.secretKey}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        tx_ref: input.reference,
        amount: toMajorUnits(input.amountCents),
        currency: FLUTTERWAVE_CURRENCY,
        redirect_url: input.callbackUrl,
        customer: { email: input.email }
      })
    });
    const json = await res.json().catch(() => null);
    const url = json?.data?.link;
    if (!res.ok || json?.status === "error" || !url) {
      throw paymentFailed(`The payment provider did not start checkout (${json?.message ?? res.status}).`);
    }
    return { authorizationUrl: url };
  }
  async verify(reference) {
    const res = await fetch(
      `${this.baseUrl}/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`,
      { headers: { authorization: `Bearer ${this.secretKey}` } }
    );
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.data) return { ok: false };
    return {
      ok: json.data.status === "successful",
      amountCents: typeof json.data.amount === "number" ? toMinorUnits(json.data.amount) : void 0,
      currency: json.data.currency
    };
  }
};
var FakeFlutterwaveProvider = class {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  baseUrl;
  name = "fake";
  async authorize(input) {
    const params = new URLSearchParams({
      tx_ref: input.reference,
      amount: String(input.amountCents)
    });
    if (input.callbackUrl) params.set("callback", input.callbackUrl);
    return { authorizationUrl: `${this.baseUrl}/flutterwave/authorize?${params.toString()}` };
  }
  async verify(_reference) {
    return { ok: false };
  }
};
function createPaymentProvider(env) {
  if (env.FLUTTERWAVE_SECRET_KEY) return new FlutterwaveProvider(env.FLUTTERWAVE_SECRET_KEY);
  if (env.NODE_ENV === "production") {
    throw new Error("Refusing to use the fake payment provider in production");
  }
  return new FakeFlutterwaveProvider(env.PUBLIC_BASE_URL);
}

// backend/src/billing/proration.ts
var MS_PER_DAY = 864e5;
var PERIOD_DAYS = 30;
function planFacts(row) {
  return {
    key: row.key,
    name: row.name,
    priceCents: row.price_cents,
    currency: row.currency,
    includedSeats: row.included_seats,
    extraSeatCents: row.extra_seat_cents,
    maxSeats: row.max_seats
  };
}
function extraSeatsFor(plan, seats) {
  return Math.max(0, seats - plan.includedSeats);
}
function periodPriceCents(plan, seats) {
  const extra = extraSeatsFor(plan, seats);
  return plan.priceCents + extra * (plan.extraSeatCents ?? 0);
}
function computeProration(input) {
  const periodMs = input.periodEnd.getTime() - input.periodStart.getTime();
  const periodDays = Math.max(1, Math.round(periodMs / MS_PER_DAY));
  const elapsedMs = input.now.getTime() - input.periodStart.getTime();
  const daysRemaining = Math.min(periodDays, Math.max(0, periodDays - Math.floor(elapsedMs / MS_PER_DAY)));
  const currentPrice = input.current ? periodPriceCents(input.current.plan, input.current.seats) : 0;
  const nextPrice = periodPriceCents(input.next.plan, input.next.seats);
  const creditCents = input.current ? Math.floor(currentPrice * daysRemaining / periodDays) : 0;
  const costCents = Math.floor(nextPrice * daysRemaining / periodDays);
  const chargeCents = Math.max(0, costCents - creditCents);
  return {
    chargeCents,
    creditCents,
    costCents,
    daysRemaining,
    effective: chargeCents > 0 ? "now" : "period_end"
  };
}

// backend/src/billing/checkout.ts
async function createCheckout(deps, input) {
  const db = deps.topology.shardDb(input.scope);
  const provider = createPaymentProvider(deps.env);
  const prepared = await db.tx((tx) => prepare(tx, input));
  let authorizationUrl;
  try {
    const result = await provider.authorize({
      reference: prepared.reference,
      amountCents: prepared.amountCents,
      email: input.email,
      callbackUrl: input.body.callbackUrl
    });
    authorizationUrl = result.authorizationUrl;
  } catch (error) {
    await db.query("UPDATE payment_intents SET status = 'failed', updated_at = now() WHERE reference = $1 AND team_id = $2", [
      prepared.reference,
      input.scope.teamId
    ]);
    throw error;
  }
  await db.query(
    "UPDATE payment_intents SET authorization_url = $1, updated_at = now() WHERE reference = $2 AND team_id = $3",
    [authorizationUrl, prepared.reference, input.scope.teamId]
  );
  return {
    url: authorizationUrl,
    reference: prepared.reference,
    amountCents: prepared.amountCents,
    proration: prepared.proration
  };
}
async function prepare(tx, input) {
  const { scope, body: body2 } = input;
  const now = /* @__PURE__ */ new Date();
  const nextPlan = await getPlan(tx, body2.planKey);
  const target = planFacts(nextPlan);
  if (target.extraSeatCents === null && body2.seats > target.includedSeats) {
    throw planUpgradeRequiredError(
      `The ${target.name} plan includes ${target.includedSeats} seats. Upgrade to add more people.`
    );
  }
  if (body2.seats > target.maxSeats) {
    throw seatLimit(`The ${target.name} plan allows at most ${target.maxSeats} seats.`);
  }
  const subscription = await getSubscription(tx, scope.teamId);
  if (subscription && !subscription.pending_plan_key && subscription.pending_seats === null && subscription.plan_key === body2.planKey && subscription.seats === body2.seats && (subscription.status === "active" || subscription.status === "trialing")) {
    throw conflict(
      `Already on ${subscription.plan_key} with ${subscription.seats} seats \u2014 there is nothing to change.`
    );
  }
  const usage = await seatUsage(tx, scope.teamId);
  if (body2.seats < usage.used) {
    throw seatLimit(
      `${usage.used} seat${usage.used === 1 ? "" : "s"} already in use (active members and open invites); cannot check out for ${body2.seats}.`
    );
  }
  const proration = await priceChange(tx, subscription, { plan: target, seats: body2.seats }, now);
  const reference = `co_${newId()}`;
  const inserted = await tx.one(
    `INSERT INTO payment_intents (team_id, reference, amount_cents, currency, plan_key, seats, created_by)
     VALUES ($1, $2, $3, 'USD', $4, $5, $6)
     RETURNING id`,
    [scope.teamId, reference, proration.chargeCents, body2.planKey, body2.seats, input.userId]
  );
  if (!inserted) throw conflict("Could not create a payment intent for this checkout.");
  return { reference, amountCents: proration.chargeCents, proration };
}
async function priceChange(tx, subscription, next, now) {
  const periodStart = subscription ? new Date(subscription.period_start) : now;
  const periodEnd = subscription ? new Date(subscription.period_end) : new Date(now.getTime() + PERIOD_DAYS * MS_PER_DAY);
  const hasRemaining = periodEnd.getTime() > now.getTime();
  const current = subscription && hasRemaining ? { plan: planFacts(await getPlan(tx, subscription.plan_key)), seats: subscription.seats } : null;
  return computeProration({
    current,
    next,
    now,
    periodStart: hasRemaining ? periodStart : now,
    periodEnd: hasRemaining ? periodEnd : new Date(now.getTime() + PERIOD_DAYS * MS_PER_DAY)
  });
}

// backend/src/billing/subscription.ts
function toPlanContract(row) {
  if (row.currency !== "USD") {
    throw new ApiError("INTERNAL", 500, `plan ${row.key} has an unsupported currency`);
  }
  return {
    key: row.key,
    name: row.name,
    priceCents: row.price_cents,
    currency: "USD",
    includedSeats: row.included_seats,
    extraSeatCents: row.extra_seat_cents,
    maxSeats: row.max_seats
  };
}
async function buildSubscription(db, row) {
  const currentPlan = await getPlan(db, row.plan_key);
  const targetPlan = row.pending_plan_key ? await getPlan(db, row.pending_plan_key) : currentPlan;
  const targetSeats = row.pending_seats ?? row.seats;
  return {
    teamId: row.team_id,
    planKey: row.plan_key,
    status: row.status,
    seats: row.seats,
    extraSeats: row.extra_seats,
    periodStart: new Date(row.period_start).toISOString(),
    periodEnd: new Date(row.period_end).toISOString(),
    nextAmountCents: periodPriceCents(planFacts(targetPlan), targetSeats),
    graceUntil: row.grace_until ? new Date(row.grace_until).toISOString() : null,
    pendingPlanKey: row.pending_plan_key,
    pendingSeats: row.pending_seats
  };
}

// backend/src/repos/idempotency.ts
var IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1e3;
var IN_FLIGHT_TAKEOVER_MS = 5 * 60 * 1e3;
async function beginIdempotent(global, input) {
  const now = input.now ?? /* @__PURE__ */ new Date();
  const expiresAt = new Date(now.getTime() + IDEMPOTENCY_TTL_MS);
  return global.tx(async (tx) => {
    const existing = await tx.one(
      "SELECT * FROM idempotency_keys WHERE user_id = $1 AND key = $2 FOR UPDATE",
      [input.userId, input.key]
    );
    if (existing) {
      const expired = new Date(existing.expires_at).getTime() <= now.getTime();
      const orphaned = existing.state === "in_flight" && new Date(existing.created_at).getTime() <= now.getTime() - IN_FLIGHT_TAKEOVER_MS;
      if (expired || orphaned) {
        await tx.query("DELETE FROM idempotency_keys WHERE user_id = $1 AND key = $2", [
          input.userId,
          input.key
        ]);
      } else if (existing.request_hash !== input.requestHash) {
        throw idempotencyMismatch();
      } else if (existing.state === "finished") {
        return {
          kind: "replay",
          status: existing.response_status ?? 500,
          body: existing.response_body ?? null
        };
      } else {
        throw idempotencyInProgress();
      }
    }
    const inserted = await tx.one(
      `INSERT INTO idempotency_keys (user_id, key, request_hash, expires_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, key) DO NOTHING
       RETURNING id`,
      [input.userId, input.key, input.requestHash, expiresAt]
    );
    if (!inserted) throw idempotencyInProgress();
    return { kind: "owned" };
  });
}
async function finishIdempotent(global, input) {
  await global.query(
    `UPDATE idempotency_keys SET state = 'finished', response_status = $3, response_body = $4
      WHERE user_id = $1 AND key = $2`,
    [input.userId, input.key, input.status, JSON.stringify(input.body ?? null)]
  );
}
async function releaseIdempotent(global, input) {
  await global.query(
    `DELETE FROM idempotency_keys WHERE user_id = $1 AND key = $2 AND state = 'in_flight'`,
    [input.userId, input.key]
  );
}
async function cleanupExpiredIdempotency(global, now = /* @__PURE__ */ new Date()) {
  const rows = await global.query("DELETE FROM idempotency_keys WHERE expires_at <= $1 RETURNING id", [
    now
  ]);
  return rows.length;
}
function canonicalJson(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  const entries = Object.entries(value).filter(([, v3]) => v3 !== void 0).sort(([a2], [b3]) => a2 < b3 ? -1 : a2 > b3 ? 1 : 0);
  return `{${entries.map(([k4, v3]) => `${JSON.stringify(k4)}:${canonicalJson(v3)}`).join(",")}}`;
}

// backend/src/routes/billing.ts
var TeamParams5 = import_zod7.z.object({ teamId: Id }).strict();
var IdempotencyKey = import_zod7.z.string().min(1).max(200);
function registerBillingRoutes(app, deps) {
  app.get("/v1/plans", async (req) => {
    parseWith(NoQuery, req.query, "query");
    const user = await requireUser(deps.env, deps.topology, req);
    const memberships = await membershipsForUser(deps.topology.shards, user.id);
    assertCan(memberships[0]?.role ?? "member", "plans.read");
    const rows = await deps.topology.global.query(
      "SELECT * FROM plans WHERE active = true ORDER BY price_cents ASC, key ASC"
    );
    return rows.map(toPlanContract);
  });
  app.get("/v1/teams/:teamId/billing/subscription", async (req) => {
    const { teamId } = parseWith(TeamParams5, req.params, "params");
    parseWith(NoQuery, req.query, "query");
    const membership = await requireMembership(deps.env, deps.topology, req, teamId);
    assertCan(membership.role, "billing.read");
    const row = await deps.topology.shardDb(membership.scope).one(
      "SELECT * FROM subscriptions WHERE team_id = $1",
      [teamId]
    );
    if (!row) return null;
    return buildSubscription(deps.topology.shardDb(membership.scope), row);
  });
  app.get("/v1/teams/:teamId/billing/ledger", async (req) => {
    const { teamId } = parseWith(TeamParams5, req.params, "params");
    const membership = await requireMembership(deps.env, deps.topology, req, teamId);
    assertCan(membership.role, "billing.ledger");
    const query = parseWith(QueryParams.ledger, req.query, "query");
    return ledgerPage(deps.topology.shardDb(membership.scope), membership.scope, query);
  });
  app.post("/v1/teams/:teamId/billing/checkout", async (req, reply) => {
    const { teamId } = parseWith(TeamParams5, req.params, "params");
    const membership = await requireMembership(deps.env, deps.topology, req, teamId);
    assertCan(membership.role, "billing.checkout");
    await deps.rateLimiter.enforce(RATE_RULES.checkout, `team:${teamId}|user:${membership.user.id}`);
    const key = parseWith(IdempotencyKey, req.headers["idempotency-key"], "headers.Idempotency-Key");
    const body2 = parseWith(RequestBodies.checkout, req.body, "body");
    const requestHash = sha256(canonicalJson({ teamId, body: body2 }));
    const begin = await beginIdempotent(deps.topology.global, {
      userId: membership.user.id,
      key,
      requestHash
    });
    if (begin.kind === "replay") {
      reply.status(begin.status);
      return begin.body;
    }
    try {
      const result = await createCheckout(deps, {
        scope: membership.scope,
        userId: membership.user.id,
        email: membership.user.email,
        body: body2
      });
      const payload = { url: result.url };
      await finishIdempotent(deps.topology.global, {
        userId: membership.user.id,
        key,
        status: 200,
        body: payload
      });
      req.log.info(
        {
          reqId: req.reqId,
          userId: membership.user.id,
          teamId,
          paymentRef: result.reference,
          amountCents: result.amountCents,
          daysRemaining: result.proration.daysRemaining,
          effective: result.proration.effective
        },
        "checkout"
      );
      reply.status(200);
      return payload;
    } catch (error) {
      if (error instanceof ApiError && error.status < 500) {
        const payload = error.envelope(req.reqId);
        await finishIdempotent(deps.topology.global, {
          userId: membership.user.id,
          key,
          status: error.status,
          body: payload
        });
        reply.status(error.status);
        return payload;
      }
      await releaseIdempotent(deps.topology.global, { userId: membership.user.id, key });
      throw error;
    }
  });
}

// backend/src/routes/webhooks.ts
var import_zod8 = require("zod");

// backend/src/repos/webhooks.ts
var WEBHOOK_EVENT_COLUMNS = "id, provider, event_key, payload, status, note, created_at, processed_at";
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function webhookEventKey(body2, raw) {
  const event = typeof body2.event === "string" && body2.event.length > 0 ? body2.event : "unknown";
  const data = isRecord(body2.data) ? body2.data : {};
  const id = data.id ?? data.reference ?? data.tx_ref;
  if (id !== void 0 && id !== null && id !== "") return `${event}:${String(id)}`;
  return `${event}:${sha256(raw)}`;
}
async function insertWebhookEvent(global, input) {
  return global.one(
    `INSERT INTO webhook_events (provider, event_key, payload)
     VALUES ($1, $2, $3)
     ON CONFLICT (provider, event_key) DO NOTHING
     RETURNING ${WEBHOOK_EVENT_COLUMNS}`,
    [input.provider, input.eventKey, JSON.stringify(input.payload)]
  );
}
async function getWebhookEvent(global, id) {
  return global.one(`SELECT ${WEBHOOK_EVENT_COLUMNS} FROM webhook_events WHERE id = $1`, [id]);
}
async function getWebhookEventByKey(global, provider, eventKey) {
  return global.one(
    `SELECT ${WEBHOOK_EVENT_COLUMNS} FROM webhook_events WHERE provider = $1 AND event_key = $2`,
    [provider, eventKey]
  );
}
async function deleteWebhookEvent(global, id) {
  await global.query("DELETE FROM webhook_events WHERE id = $1 AND status = 'received'", [id]);
}
async function staleWebhookEvents(global, olderThan, limit = 100) {
  return global.query(
    `SELECT ${WEBHOOK_EVENT_COLUMNS} FROM webhook_events
      WHERE status = 'received' AND created_at <= $1
      ORDER BY created_at ASC
      LIMIT $2`,
    [olderThan, limit]
  );
}
async function settleWebhookEvent(global, input) {
  const rows = await global.query(
    `UPDATE webhook_events SET status = $2, note = $3, processed_at = now()
      WHERE id = $1 AND status = 'received'
      RETURNING id`,
    [input.id, input.status, input.note]
  );
  return rows.length > 0;
}

// backend/src/jobs/billing.ts
var WEBHOOK_QUEUE = "webhooks";
var RENEWALS_QUEUE = "renewals";
var RENEWAL_SWEEP_MS = 60 * 60 * 1e3;
var RENEWAL_START_DELAY_MS = 3e4;
var GRACE_DAYS = 5;
var GRACE_MS = GRACE_DAYS * MS_PER_DAY;
var REMINDER_DAYS = [0, 1, 3, 5];
function registerBillingJobs(queue, deps, options = {}) {
  queue.register(WEBHOOK_QUEUE, async (payload, ctx) => {
    const eventId = isRecord(payload) && typeof payload.eventId === "string" ? payload.eventId : null;
    if (!eventId) throw new Error("webhooks job requires an eventId");
    await processWebhookEvent(deps, eventId, ctx.log);
  });
  queue.register(RENEWALS_QUEUE, async (_payload, ctx) => {
    await runRenewals(deps, ctx.log);
    await reconcileWebhookEvents(deps, ctx.log);
    const removed = await cleanupExpiredIdempotency(deps.topology.global);
    if (removed > 0) ctx.log.info({ removed }, "expired idempotency keys cleaned");
    await queue.add(RENEWALS_QUEUE, {}, { delayMs: RENEWAL_SWEEP_MS, attempts: 5 });
  });
  queue.register(PUSH_QUEUE, async (_payload, ctx) => {
    await runPushJob(deps, ctx.log);
  });
  if (options.scheduleRenewals !== false) {
    void queue.add(RENEWALS_QUEUE, {}, { delayMs: RENEWAL_START_DELAY_MS, attempts: 5 });
  }
}
async function reconcileWebhookEvents(deps, log) {
  const olderThan = new Date(Date.now() - 5 * 60 * 1e3);
  const stale = await staleWebhookEvents(deps.topology.global, olderThan);
  for (const event of stale) {
    await deps.queue.add(WEBHOOK_QUEUE, { eventId: event.id }, { attempts: 5 });
  }
  if (stale.length > 0) log.warn({ count: stale.length }, "re-enqueued stale webhook events");
  return stale.length;
}
async function processWebhookEvent(deps, eventId, log) {
  const event = await getWebhookEvent(deps.topology.global, eventId);
  if (!event) throw new Error(`webhook event ${eventId} not found`);
  if (event.status !== "received") return;
  const type = typeof event.payload.event === "string" ? event.payload.event : "";
  const data = isRecord(event.payload.data) ? event.payload.data : {};
  const chargeStatus = typeof data.status === "string" ? data.status : "";
  let outcome;
  try {
    if (type === "charge.completed" && chargeStatus === "successful") {
      outcome = await applyChargeSuccess(deps, event, log);
    } else if (type === "charge.failed" || type === "charge.completed" && chargeStatus === "failed") {
      outcome = await applyChargeFailed(deps, event, log);
    } else if (type === "charge.completed") {
      outcome = { status: "processed", note: `ignored charge.completed with status ${chargeStatus || "unknown"}` };
    } else {
      outcome = { status: "processed", note: `ignored event type ${type || "unknown"}` };
    }
  } catch (error) {
    log.warn({ paymentRef: event.event_key, eventId, err: error }, "webhook job failed \u2014 will retry");
    throw error;
  }
  await settleWebhookEvent(deps.topology.global, { id: event.id, status: outcome.status, note: outcome.note });
  log.info({ paymentRef: event.event_key, eventId, result: outcome.status, note: outcome.note }, "webhook handled");
}
async function findIntent(topology, reference) {
  for (const shard of topology.shards) {
    const row = await shard.one("SELECT * FROM payment_intents WHERE reference = $1", [reference]);
    if (row) return { scope: topology.scopeFor(row.team_id), row };
  }
  return null;
}
function paymentReference(data) {
  if (typeof data.tx_ref === "string") return data.tx_ref;
  if (typeof data.reference === "string") return data.reference;
  return "";
}
async function applyChargeSuccess(deps, event, log) {
  const data = isRecord(event.payload.data) ? event.payload.data : {};
  const reference = paymentReference(data);
  if (!reference) return { status: "rejected", note: "payload has no data.tx_ref" };
  const located = await findIntent(deps.topology, reference);
  if (!located) {
    log.warn({ paymentRef: reference }, "webhook references an unknown payment intent");
    return { status: "rejected", note: "unknown payment reference" };
  }
  const { scope, row: intent } = located;
  if (intent.status === "paid") return { status: "processed", note: "charge already applied" };
  let matches = true;
  if (typeof data.amount === "number") matches = toMinorUnits(data.amount) === intent.amount_cents;
  if (matches && typeof data.currency === "string" && data.currency.length > 0) {
    matches = data.currency.toLowerCase() === intent.currency.toLowerCase();
  }
  if (matches && typeof data.amount !== "number") {
    const verified = await createPaymentProvider(deps.env).verify(reference);
    matches = verified.ok && (verified.amountCents === void 0 || verified.amountCents === intent.amount_cents);
  }
  if (!matches) {
    await deps.topology.shardDb(scope).query(
      "UPDATE payment_intents SET status = 'failed', updated_at = now() WHERE id = $1 AND team_id = $2 AND status = 'pending'",
      [intent.id, scope.teamId]
    );
    log.warn({ paymentRef: reference }, "webhook rejected: amount or currency mismatch");
    return { status: "rejected", note: "amount or currency does not match the payment intent" };
  }
  const notified = await deps.topology.shardDb(scope).tx((tx) => applyChargeInTx(tx, scope, intent));
  if (notified) await deps.queue.add(PUSH_QUEUE, {}, { attempts: 5 });
  return { status: "processed", note: `charge ${intent.reference} applied` };
}
async function applyChargeInTx(tx, scope, intent) {
  const locked = await tx.one(
    "SELECT * FROM payment_intents WHERE id = $1 AND team_id = $2 FOR UPDATE",
    [intent.id, scope.teamId]
  );
  if (!locked || locked.status === "paid") return false;
  const now = /* @__PURE__ */ new Date();
  const plan = await getPlan(tx, locked.plan_key);
  const facts = planFacts(plan);
  const seats = locked.seats;
  const extra = extraSeatsFor(facts, seats);
  const price = periodPriceCents(facts, seats);
  const sub = await getSubscription(tx, scope.teamId);
  const periodEnd = new Date(now.getTime() + PERIOD_DAYS * MS_PER_DAY);
  if (!sub) {
    await tx.query(
      `INSERT INTO subscriptions (team_id, plan_key, status, seats, extra_seats, period_start, period_end, next_amount_cents)
       VALUES ($1, $2, 'active', $3, $4, $5, $6, $7)
       ON CONFLICT (team_id) DO UPDATE SET
         plan_key = EXCLUDED.plan_key, status = 'active', seats = EXCLUDED.seats,
         extra_seats = EXCLUDED.extra_seats, period_start = EXCLUDED.period_start,
         period_end = EXCLUDED.period_end, next_amount_cents = EXCLUDED.next_amount_cents,
         grace_until = NULL, pending_plan_key = NULL, pending_seats = NULL, updated_at = now()`,
      [scope.teamId, locked.plan_key, seats, extra, now.toISOString(), periodEnd.toISOString(), price]
    );
  } else {
    const currentPlan = await getPlan(tx, sub.plan_key);
    const currentPrice = periodPriceCents(planFacts(currentPlan), sub.seats);
    const isDowngrade = price < currentPrice || price === currentPrice && seats < sub.seats;
    const periodOver = new Date(sub.period_end).getTime() <= now.getTime();
    if (isDowngrade && !periodOver) {
      await tx.query(
        `UPDATE subscriptions SET pending_plan_key = $1, pending_seats = $2, next_amount_cents = $3, updated_at = now()
          WHERE team_id = $4`,
        [locked.plan_key, seats, price, scope.teamId]
      );
    } else {
      const start2 = periodOver ? now : new Date(sub.period_start);
      const end = periodOver ? periodEnd : new Date(sub.period_end);
      await tx.query(
        `UPDATE subscriptions SET plan_key = $1, seats = $2, extra_seats = $3, period_start = $4, period_end = $5,
           next_amount_cents = $6, status = 'active', grace_until = NULL,
           pending_plan_key = NULL, pending_seats = NULL, updated_at = now()
          WHERE team_id = $7`,
        [locked.plan_key, seats, extra, start2.toISOString(), end.toISOString(), price, scope.teamId]
      );
    }
  }
  await tx.query("UPDATE payment_intents SET status = 'paid', updated_at = now() WHERE id = $1 AND team_id = $2", [
    locked.id,
    scope.teamId
  ]);
  const previous = sub ? `${sub.plan_key} (${sub.seats} seats)` : "no previous subscription";
  await appendLedgerEntry(tx, scope, {
    kind: "charge",
    amountCents: locked.amount_cents,
    ref: `pay:${locked.reference}`,
    reason: `${plan.name} plan, ${seats} seats, ${locked.amount_cents} cents; before: ${previous}`
  });
  return notifyOwner(tx, scope, {
    kind: "payment_success",
    url: "rota://billing",
    reference: locked.reference,
    planKey: locked.plan_key,
    seats,
    amountCents: locked.amount_cents
  }, "Payment received", `Your ${plan.name} plan payment was received. The subscription is active.`);
}
async function applyChargeFailed(deps, event, log) {
  const data = isRecord(event.payload.data) ? event.payload.data : {};
  const reference = paymentReference(data);
  if (!reference) return { status: "rejected", note: "payload has no data.tx_ref" };
  const located = await findIntent(deps.topology, reference);
  if (!located) {
    log.warn({ paymentRef: reference }, "failed-charge webhook references an unknown payment intent");
    return { status: "rejected", note: "unknown payment reference" };
  }
  const { scope, row: intent } = located;
  const notified = await deps.topology.shardDb(scope).tx(async (tx) => {
    await tx.query(
      "UPDATE payment_intents SET status = 'failed', updated_at = now() WHERE id = $1 AND team_id = $2 AND status = 'pending'",
      [intent.id, scope.teamId]
    );
    return notifyOwner(
      tx,
      scope,
      { kind: "payment_failed", url: "rota://billing", reference: intent.reference },
      "Payment failed",
      "Your latest payment did not go through. Open Billing to try again."
    );
  });
  if (notified) await deps.queue.add(PUSH_QUEUE, {}, { attempts: 5 });
  return { status: "processed", note: `charge ${intent.reference} failed` };
}
async function notifyOwner(tx, scope, data, title, body2) {
  const owner = await tx.one(
    "SELECT user_id FROM team_members WHERE team_id = $1 AND role = $2 AND active = true",
    [scope.teamId, "owner"]
  );
  if (!owner) return false;
  await tx.query(
    `INSERT INTO outbox (team_id, user_id, category, urgency, title, body, data)
     VALUES ($1, $2, 'billing', 'urgent', $3, $4, $5)`,
    [scope.teamId, owner.user_id, title, body2, JSON.stringify(data)]
  );
  return true;
}
async function runRenewals(deps, log) {
  const release = await deps.lock.acquire("billing:renewals", 5 * 60 * 1e3);
  if (!release) {
    log.info("renewals sweep already running on another node \u2014 skipping");
    return;
  }
  try {
    for (const shard of deps.topology.shards) {
      const due = await shard.query(
        `SELECT * FROM subscriptions
          WHERE period_end <= now() AND status IN ('trialing', 'active', 'past_due', 'restricted')
          ORDER BY period_end ASC
          LIMIT 200`
      );
      for (const row of due) {
        const scope = deps.topology.scopeFor(row.team_id);
        try {
          const result = await renewOne(deps, shard, scope);
          if (result) {
            log.info(
              { teamId: scope.teamId, status: result.status, appliedPending: result.appliedPending },
              "renewal handled"
            );
            if (result.notified) await deps.queue.add(PUSH_QUEUE, {}, { attempts: 5 });
          }
        } catch (error) {
          log.warn({ teamId: scope.teamId, err: error }, "renewal failed");
        }
      }
    }
  } finally {
    await release();
  }
}
async function renewOne(deps, shard, scope) {
  let notified = false;
  const result = await shard.tx(async (tx) => {
    const sub = await getSubscription(tx, scope.teamId);
    if (!sub) return null;
    const now = Date.now();
    if (new Date(sub.period_end).getTime() > now) return null;
    const applyPending = sub.pending_plan_key !== null || sub.pending_seats !== null;
    const planKey = sub.pending_plan_key ?? sub.plan_key;
    const seats = sub.pending_seats ?? sub.seats;
    const plan = await getPlan(tx, planKey);
    const facts = planFacts(plan);
    const extra = extraSeatsFor(facts, seats);
    const price = periodPriceCents(facts, seats);
    let status = sub.status;
    let graceUntil = sub.grace_until ? new Date(sub.grace_until) : null;
    if (status === "trialing" || status === "active") {
      status = "past_due";
      graceUntil = graceUntil ?? new Date(now + GRACE_MS);
    }
    if (status === "past_due" && graceUntil && graceUntil.getTime() <= now) {
      status = "restricted";
    }
    await tx.query(
      `UPDATE subscriptions SET plan_key = $1, seats = $2, extra_seats = $3, next_amount_cents = $4,
         pending_plan_key = NULL, pending_seats = NULL, status = $5, grace_until = $6, updated_at = now()
        WHERE team_id = $7`,
      [
        planKey,
        seats,
        extra,
        price,
        status,
        graceUntil ? graceUntil.toISOString() : null,
        scope.teamId
      ]
    );
    if (status === "past_due" || status === "restricted") {
      notified = await writeRenewalNotice(tx, scope, status, plan.name, graceUntil, now);
    }
    return { status, appliedPending: applyPending, notified };
  });
  return result;
}
async function writeRenewalNotice(tx, scope, status, planName, graceUntil, now) {
  const owner = await tx.one(
    "SELECT user_id FROM team_members WHERE team_id = $1 AND role = $2 AND active = true",
    [scope.teamId, "owner"]
  );
  if (!owner) return false;
  if (status === "restricted") {
    if (await noticeExists(tx, scope.teamId, owner.user_id, "subscription_restricted")) return false;
    await tx.query(
      `INSERT INTO outbox (team_id, user_id, category, urgency, title, body, data)
       VALUES ($1, $2, 'billing', 'urgent', $3, $4, $5)`,
      [
        scope.teamId,
        owner.user_id,
        "Subscription restricted",
        `Payment is overdue, so ${planName} is restricted. Open Billing to restore it.`,
        JSON.stringify({ kind: "subscription_restricted", url: "rota://billing" })
      ]
    );
    return true;
  }
  if (!graceUntil) return false;
  const day = Math.floor((now - (graceUntil.getTime() - GRACE_MS)) / MS_PER_DAY);
  if (!REMINDER_DAYS.includes(day)) return false;
  if (await noticeExists(tx, scope.teamId, owner.user_id, "renewal_grace", day)) return false;
  await tx.query(
    `INSERT INTO outbox (team_id, user_id, category, urgency, title, body, data)
     VALUES ($1, $2, 'billing', 'urgent', $3, $4, $5)`,
    [
      scope.teamId,
      owner.user_id,
      "Payment needed",
      `${planName} renewal is awaiting payment (grace day ${day} of ${GRACE_DAYS}). Open Billing to pay.`,
      JSON.stringify({ kind: "renewal_grace", day, url: "rota://billing" })
    ]
  );
  return true;
}
async function noticeExists(tx, teamId, userId, kind, day) {
  const params = [teamId, userId, kind];
  let sql = `SELECT 1 AS present FROM outbox
              WHERE team_id = $1 AND user_id = $2 AND category = 'billing' AND data->>'kind' = $3`;
  if (day !== void 0) {
    params.push(String(day));
    sql += ` AND data->>'day' = $${params.length}`;
  }
  return await tx.one(sql, params) !== void 0;
}

// backend/src/routes/webhooks.ts
var EventBody = import_zod8.z.object({ event: import_zod8.z.string().min(1) }).passthrough();
function registerWebhookRoutes(app, deps) {
  app.register(async (scope) => {
    scope.addContentTypeParser("application/json", { parseAs: "string" }, (_req, body2, done) => {
      done(null, body2);
    });
    scope.post("/v1/webhooks/flutterwave", async (req, reply) => {
      const raw = typeof req.body === "string" ? req.body : "";
      const secretHash = deps.env.FLUTTERWAVE_SECRET_HASH;
      if (deps.env.NODE_ENV === "production" && !secretHash) {
        req.log.error({ reqId: req.reqId }, "flutterwave webhook rejected: no verif-hash configured");
        throw unauthorized();
      }
      const header = req.headers["verif-hash"];
      const provided = Array.isArray(header) ? header[0] : header;
      if (!secretHash || !provided || !safeEqual(secretHash, provided)) {
        req.log.warn({ reqId: req.reqId }, "webhook signature rejected");
        throw unauthorized("Invalid webhook signature");
      }
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        throw badRequest("Malformed JSON payload");
      }
      if (!isRecord(parsed)) throw badRequest("Malformed JSON payload");
      const body2 = EventBody.parse(parsed);
      const eventKey = webhookEventKey(body2, raw);
      const stored = await insertWebhookEvent(deps.topology.global, {
        provider: "flutterwave",
        eventKey,
        payload: body2
      });
      if (!stored) {
        const existing = await getWebhookEventByKey(deps.topology.global, "flutterwave", eventKey);
        if (existing?.status === "received") {
          try {
            await deps.queue.add(WEBHOOK_QUEUE, { eventId: existing.id }, { attempts: 5 });
            req.log.info({ reqId: req.reqId, eventKey }, "duplicate webhook requeued");
          } catch (error) {
            req.log.error({ reqId: req.reqId, eventKey, err: error }, "duplicate webhook requeue failed");
            throw error;
          }
        } else {
          req.log.info({ reqId: req.reqId, eventKey }, "duplicate webhook ignored");
        }
        reply.status(200);
        return { received: true };
      }
      try {
        await deps.queue.add(WEBHOOK_QUEUE, { eventId: stored.id }, { attempts: 5 });
      } catch (error) {
        await deleteWebhookEvent(deps.topology.global, stored.id).catch(() => void 0);
        req.log.error({ reqId: req.reqId, eventKey, err: error }, "webhook enqueue failed; event row rolled back");
        throw error;
      }
      reply.status(200);
      return { received: true };
    });
  });
}

// backend/src/routes/dev-checkout.ts
var import_zod9 = require("zod");
var AUTHORIZE_PATH = "/flutterwave/authorize";
var MoneyParam = import_zod9.z.string().regex(/^\d+$/);
var AuthorizeQuery = import_zod9.z.object({
  tx_ref: import_zod9.z.string().min(1).max(200),
  amount: MoneyParam.optional(),
  callback: import_zod9.z.string().min(1).max(500).optional()
}).strict();
function safeReturnUrl(callback) {
  if (!callback) return void 0;
  let parsed;
  try {
    parsed = new URL(callback);
  } catch {
    return void 0;
  }
  if (!parsed.protocol.endsWith(":") || parsed.protocol === "http:" || parsed.protocol === "https:") {
    return void 0;
  }
  return /^[a-z][a-z0-9+.-]*:\/\/[A-Za-z0-9._~:?#@!$&'()*+,;=%-]+$/i.test(callback) ? callback : void 0;
}
var CompleteBody = import_zod9.z.object({ tx_ref: import_zod9.z.string().min(1).max(200), amount: MoneyParam.optional() }).strict();
function registerDevCheckoutRoutes(app, deps) {
  if (deps.env.NODE_ENV === "production") return;
  if (createPaymentProvider(deps.env).name !== "fake") return;
  app.get(AUTHORIZE_PATH, async (req, reply) => {
    const query = AuthorizeQuery.parse(req.query);
    reply.type("text/html; charset=utf-8");
    return authorizePage(query.tx_ref, query.amount, safeReturnUrl(query.callback));
  });
  app.post(AUTHORIZE_PATH, async (req, reply) => {
    const body2 = CompleteBody.parse(req.body ?? {});
    const amountMajor = body2.amount !== void 0 ? Number(body2.amount) / 100 : void 0;
    const payload = {
      event: "charge.completed",
      data: {
        status: "successful",
        tx_ref: body2.tx_ref,
        ...amountMajor !== void 0 ? { amount: amountMajor, currency: "USD" } : {}
      }
    };
    const raw = JSON.stringify(payload);
    const eventKey = webhookEventKey(payload, raw);
    const stored = await insertWebhookEvent(deps.topology.global, {
      provider: "flutterwave",
      eventKey,
      payload
    });
    if (stored) await deps.queue.add(WEBHOOK_QUEUE, { eventId: stored.id }, { attempts: 5 });
    return { ok: true, reference: body2.tx_ref };
  });
}
var HTML_ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch] ?? ch);
}
function formatAmount(amount) {
  if (amount === void 0) return "the plan price";
  return `$${(Number(amount) / 100).toFixed(2)}`;
}
function authorizePage(txRef, amount, callback) {
  const display = formatAmount(amount);
  const refJson = JSON.stringify(txRef);
  const amountJson = JSON.stringify(amount ?? "");
  const callbackJson = JSON.stringify(callback ?? "");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Test checkout \xB7 Rota</title>
<style>
  :root { color-scheme: light; }
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #f6f7f9; color: #111; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
  .card { width: 100%; max-width: 360px; background: #fff; border-radius: 16px; padding: 32px;
    box-shadow: 0 10px 30px rgba(0,0,0,.08); text-align: center; }
  .kicker { color: #6b7280; font-size: 13px; }
  .amount { font-size: 34px; font-weight: 700; margin: 10px 0; }
  .ref { color: #6b7280; font-size: 12px; word-break: break-all; }
  button { width: 100%; margin-top: 24px; padding: 14px; border: 0; border-radius: 10px;
    background: #4f46e5; color: #fff; font-size: 16px; font-weight: 600; cursor: pointer; }
  button:disabled { opacity: .6; }
  .msg { margin-top: 16px; font-size: 14px; min-height: 20px; }
</style>
</head>
<body>
  <div class="card">
    <div class="kicker">Rota \xB7 test checkout \u2014 no real money moves</div>
    <div class="amount">${escapeHtml(display)}</div>
    <div class="ref">${escapeHtml(txRef)}</div>
    <button id="pay">Pay ${escapeHtml(display)}</button>
    <div class="msg" id="msg"></div>
  </div>
  <script>
    var txRef = ${refJson};
    var amount = ${amountJson};
    var callback = ${callbackJson};
    var btn = document.getElementById('pay');
    var msg = document.getElementById('msg');
    btn.addEventListener('click', function () {
      btn.disabled = true;
      msg.textContent = 'Completing\u2026';
      fetch(location.pathname, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(amount ? { tx_ref: txRef, amount: amount } : { tx_ref: txRef }),
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          btn.textContent = 'Paid';
          if (callback) {
            msg.textContent = 'Payment complete. Returning to the Rota app\u2026';
            window.location.href = callback;
          } else {
            msg.textContent = 'Payment complete. You can return to the Rota app.';
          }
        })
        .catch(function (err) {
          btn.disabled = false;
          msg.textContent = 'Could not complete: ' + err.message;
        });
    });
  </script>
</body>
</html>`;
}

// backend/src/app.ts
function createMetrics() {
  return { startedAt: Date.now(), requests: 0, errors: 0, byStatus: {} };
}
async function buildApp(options) {
  const { env, topology, queue, cache, rateLimiter, lock, log } = options;
  const metrics = options.metrics ?? createMetrics();
  const reporter = createErrorReporter(env, log);
  const deps = { env, topology, queue, cache, rateLimiter, lock, metrics, reporter };
  const baseLogger = log;
  const app = (0, import_fastify.default)({
    loggerInstance: baseLogger,
    bodyLimit: 256 * 1024,
    disableRequestLogging: true,
    genReqId: () => newId(),
    // Only trust X-Forwarded-For when the deployment explicitly opts in. With
    // this off, Fastify uses the socket address and an attacker cannot choose
    // the rate-limit identity by spoofing a header.
    trustProxy: env.TRUST_PROXY
  });
  const corsOrigin = env.CORS_ORIGINS.length > 0 ? env.CORS_ORIGINS.includes("*") ? true : env.CORS_ORIGINS : env.NODE_ENV === "production" ? false : true;
  await app.register(import_cors.default, {
    origin: corsOrigin,
    allowedHeaders: ["Content-Type", "Authorization", "Idempotency-Key", "X-Request-Id"]
  });
  app.decorateRequest("reqId", "");
  app.decorateRequest("startedAt", 0);
  app.decorateRequest("authz", void 0);
  app.decorateRequest("team", void 0);
  app.addHook("onRequest", async (req, reply) => {
    const incoming = req.headers["x-request-id"];
    req.reqId = typeof incoming === "string" && incoming.length > 0 && incoming.length < 128 ? incoming : req.id;
    req.startedAt = Date.now();
    reply.header("x-request-id", req.reqId);
  });
  app.addHook("onResponse", async (req, reply) => {
    metrics.requests += 1;
    const status = String(reply.statusCode);
    metrics.byStatus[status] = (metrics.byStatus[status] ?? 0) + 1;
    if (reply.statusCode >= 500) metrics.errors += 1;
    log.info(
      {
        reqId: req.reqId,
        userId: req.authz?.userId ?? null,
        teamId: req.team?.scope.teamId ?? null,
        route: `${req.method} ${req.routeOptions?.url ?? req.url}`,
        status: reply.statusCode,
        ms: Date.now() - req.startedAt
      },
      "request"
    );
  });
  app.setErrorHandler((error, req, reply) => {
    if (error instanceof ApiError) {
      reply.status(error.status).send(error.envelope(req.reqId));
      return;
    }
    if (error instanceof import_zod10.ZodError) {
      const issue = error.issues[0];
      const where = issue && issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
      const api2 = new ApiError("VALIDATION_FAILED", 400, `${where}${issue?.message ?? "invalid"}`, req.reqId);
      reply.status(400).send(api2.envelope(req.reqId));
      return;
    }
    const fastifyError = error;
    if (fastifyError.validation) {
      const api2 = new ApiError("VALIDATION_FAILED", 400, "Request failed validation", req.reqId);
      reply.status(400).send(api2.envelope(req.reqId));
      return;
    }
    if (fastifyError.statusCode === 413) {
      const api2 = new ApiError("PAYLOAD_TOO_LARGE", 413, "Payload too large", req.reqId);
      reply.status(413).send(api2.envelope(req.reqId));
      return;
    }
    if (typeof fastifyError.statusCode === "number" && fastifyError.statusCode >= 400 && fastifyError.statusCode < 500) {
      const api2 = new ApiError(
        "VALIDATION_FAILED",
        fastifyError.statusCode,
        fastifyError.message ?? "Request failed validation",
        req.reqId
      );
      reply.status(fastifyError.statusCode).send(api2.envelope(req.reqId));
      return;
    }
    log.error({ reqId: req.reqId, err: error }, "unhandled error");
    reporter.capture(error, { reqId: req.reqId, route: `${req.method} ${req.url}` });
    const api = internal();
    reply.status(500).send(api.envelope(req.reqId));
  });
  app.setNotFoundHandler((req, reply) => {
    const api = new ApiError("NOT_FOUND", 404, "Not found", req.reqId);
    reply.status(404).send(api.envelope(req.reqId));
  });
  registerHealthRoutes(app, deps);
  registerAuthRoutes(app, deps);
  registerMeRoutes(app, deps);
  registerAvatarRoutes(app, deps);
  registerTeamRoutes(app, deps);
  registerShiftRoutes(app, deps);
  registerSwapRoutes(app, deps);
  registerFeedRoutes(app, deps);
  registerBillingRoutes(app, deps);
  registerWebhookRoutes(app, deps);
  registerDevCheckoutRoutes(app, deps);
  return app;
}

// backend/src/db/pg.ts
var import_pg = __toESM(require("pg"), 1);
var POOL_SIZE = 10;
var PgQueryable = class _PgQueryable {
  constructor(acquire, release) {
    this.acquire = acquire;
    this.release = release;
  }
  acquire;
  release;
  async query(sql, params = []) {
    const client = await this.acquire();
    try {
      const res = await client.query(sql, params);
      return res.rows;
    } finally {
      this.release(client);
    }
  }
  async one(sql, params = []) {
    const rows = await this.query(sql, params);
    return rows[0];
  }
  async exec(sql) {
    const client = await this.acquire();
    try {
      await client.query(sql);
    } finally {
      this.release(client);
    }
  }
  async tx(fn2) {
    const client = await this.acquire();
    const tx = new _PgQueryable(
      () => Promise.resolve(client),
      () => void 0
    );
    try {
      await client.query("BEGIN");
      const result = await fn2(tx);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      this.release(client);
    }
  }
};
function createPgDatabase(url, options = {}) {
  const pool = new import_pg.default.Pool({
    connectionString: url,
    max: POOL_SIZE,
    ssl: options.ssl ? { rejectUnauthorized: true } : void 0,
    connectionTimeoutMillis: options.connectionTimeoutMs ?? 1e4,
    statement_timeout: options.statementTimeoutMs ?? 15e3,
    idle_in_transaction_session_timeout: 3e4,
    query_timeout: (options.statementTimeoutMs ?? 15e3) + 5e3,
    application_name: options.applicationName ?? "rota-api"
  });
  pool.on("error", (error) => {
    console.error(JSON.stringify({ level: "error", msg: "idle postgres client error", err: error.message }));
  });
  const acquire = async () => pool.connect();
  const release = (client) => client.release();
  const queryable = new PgQueryable(acquire, release);
  return {
    query: (sql, params) => queryable.query(sql, params),
    one: (sql, params) => queryable.one(sql, params),
    exec: (sql) => queryable.exec(sql),
    tx: (fn2) => queryable.tx(fn2),
    close: () => pool.end()
  };
}

// backend/src/db/pglite.ts
init_dist();
var PgliteQueryable = class {
  constructor(db) {
    this.db = db;
  }
  db;
  queue = Promise.resolve();
  async query(sql, params = []) {
    return this.serialise(async () => {
      const res = await this.db.query(sql, params);
      return res.rows;
    });
  }
  async one(sql, params = []) {
    const rows = await this.query(sql, params);
    return rows[0];
  }
  async exec(sql) {
    await this.serialise(() => this.db.exec(sql));
  }
  async tx(fn2) {
    return this.serialise(async () => {
      await this.db.exec("BEGIN");
      try {
        const result = await fn2(this.direct());
        await this.db.exec("COMMIT");
        return result;
      } catch (error) {
        await this.db.exec("ROLLBACK");
        throw error;
      }
    });
  }
  direct() {
    const db = this.db;
    return {
      async query(sql, params = []) {
        const res = await db.query(sql, params);
        return res.rows;
      },
      async one(sql, params = []) {
        const res = await db.query(sql, params);
        return res.rows[0];
      },
      async exec(sql) {
        await db.exec(sql);
      },
      async tx(fn2) {
        return fn2(this);
      }
    };
  }
  serialise(run2) {
    const next = this.queue.then(run2, run2);
    this.queue = next.catch(() => void 0);
    return next;
  }
};
function createPgliteDatabase(db) {
  const queryable = new PgliteQueryable(db);
  return {
    query: (sql, params) => queryable.query(sql, params),
    one: (sql, params) => queryable.one(sql, params),
    exec: (sql) => queryable.exec(sql),
    tx: (fn2) => queryable.tx(fn2),
    close: () => db.close()
  };
}

// backend/src/db/types.ts
function fnv1a(input) {
  let hash = 2166136261;
  for (let i3 = 0; i3 < input.length; i3 += 1) {
    hash ^= input.charCodeAt(i3);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}
function shardFor(teamId, shardCount) {
  return fnv1a(teamId) % shardCount;
}

// backend/src/db/topology.ts
function buildTopology(global, shards) {
  if (shards.length === 0) throw new Error("At least one shard is required");
  return {
    global,
    shards,
    shardCount: shards.length,
    scopeFor(teamId) {
      return { teamId, shard: shardFor(teamId, shards.length) };
    },
    shardDb(scope) {
      const db = shards[scope.shard];
      if (!db) throw new Error(`No shard ${scope.shard}`);
      return db;
    },
    async close() {
      await Promise.all([global.close(), ...shards.map((s4) => s4.close())]);
    }
  };
}
async function createTopology(env) {
  if (env.DB_DRIVER === "pglite") {
    const global2 = createPgliteDatabase(new (await Promise.resolve().then(() => (init_dist(), dist_exports))).PGlite());
    const shards2 = await Promise.all(
      Array.from(
        { length: env.SHARD_COUNT },
        async () => createPgliteDatabase(new (await Promise.resolve().then(() => (init_dist(), dist_exports))).PGlite())
      )
    );
    return buildTopology(global2, shards2);
  }
  const options = {
    ssl: env.DB_SSL,
    connectionTimeoutMs: env.DB_CONNECTION_TIMEOUT_MS,
    statementTimeoutMs: env.DB_STATEMENT_TIMEOUT_MS,
    applicationName: "rota-api"
  };
  const global = createPgDatabase(env.DATABASE_URL, options);
  const shards = env.SHARD_DATABASE_URLS.map((url) => createPgDatabase(url, options));
  if (shards.length !== env.SHARD_COUNT) {
    throw new Error(
      `SHARD_COUNT is ${env.SHARD_COUNT} but SHARD_DATABASE_URLS lists ${shards.length} URL(s)`
    );
  }
  return buildTopology(global, shards);
}

// backend/src/env.ts
var import_zod11 = require("zod");
var boolish = import_zod11.z.union([import_zod11.z.boolean(), import_zod11.z.string()]).transform((v3) => typeof v3 === "boolean" ? v3 : ["1", "true", "yes", "on"].includes(v3.toLowerCase()));
var urlList = import_zod11.z.string().transform((raw) => raw.split(",").map((s4) => s4.trim()).filter(Boolean)).refine((list) => list.length > 0, { message: "SHARD_DATABASE_URLS must contain at least one URL" });
var originList = import_zod11.z.string().default("").transform((raw) => raw.split(",").map((s4) => s4.trim()).filter(Boolean)).refine((list) => list.every((origin) => origin === "*" || /^https?:\/\/[^/]+$/.test(origin)), {
  message: "CORS_ORIGINS must be a comma-separated list of origins (or *)"
});
var EnvObject = import_zod11.z.object({
  NODE_ENV: import_zod11.z.enum(["development", "test", "production"]).default("development"),
  PORT: import_zod11.z.coerce.number().int().min(1).max(65535).default(4e3),
  /** identity/global database */
  DATABASE_URL: import_zod11.z.string().url(),
  /** one URL per shard, index = shard number (0-based) */
  SHARD_DATABASE_URLS: urlList,
  SHARD_COUNT: import_zod11.z.coerce.number().int().min(1).default(1),
  /** `pg` for the real server, `pglite` for hermetic dev/test (ADR-0006) */
  DB_DRIVER: import_zod11.z.enum(["pg", "pglite"]).default("pg"),
  /** require TLS on production database connections */
  DB_SSL: boolish.default(false),
  DB_CONNECTION_TIMEOUT_MS: import_zod11.z.coerce.number().int().min(1e3).default(1e4),
  DB_STATEMENT_TIMEOUT_MS: import_zod11.z.coerce.number().int().min(1e3).default(15e3),
  /**
   * Redis is the durable backend for jobs, rate limits and locks. It is
   * optional only outside production: production refuses to start without it
   * so a deploy can never silently degrade to per-instance memory.
   */
  REDIS_URL: import_zod11.z.string().refine((v3) => v3 === "" || v3.startsWith("redis://") || v3.startsWith("rediss://"), {
    message: "REDIS_URL must be empty or a redis:// URL"
  }).default(""),
  JWT_SECRET: import_zod11.z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  PUBLIC_BASE_URL: import_zod11.z.string().url().transform((value) => value.replace(/\/+$/, "")),
  /** Comma-separated browser origins. Empty means "reflect any origin" outside production. */
  CORS_ORIGINS: originList,
  /** Only enable behind a trusted proxy/load balancer; otherwise X-Forwarded-For is spoofable. */
  TRUST_PROXY: boolish.default(false),
  /** Flutterwave secret key (test or live). Empty selects the deterministic fake driver outside production. */
  FLUTTERWAVE_SECRET_KEY: import_zod11.z.string().default(""),
  FLUTTERWAVE_PUBLIC_KEY: import_zod11.z.string().default(""),
  /** the `verif-hash` value configured in the Flutterwave dashboard for webhooks */
  FLUTTERWAVE_SECRET_HASH: import_zod11.z.string().default(""),
  EXPO_ACCESS_TOKEN: import_zod11.z.string().default(""),
  SENTRY_DSN: import_zod11.z.string().default(""),
  FEATURE_SWAP_ASSIST: boolish.default(false),
  OPENAI_API_KEY: import_zod11.z.string().default(""),
  /** `dev` writes `.mail.jsonl`; `log` only logs; `resend` delivers through Resend. */
  MAIL_DRIVER: import_zod11.z.enum(["dev", "log", "resend"]).default("dev"),
  MAIL_FROM: import_zod11.z.string().default(""),
  RESEND_API_KEY: import_zod11.z.string().default("")
}).strict();
var EnvSchema = EnvObject.superRefine((env, ctx) => {
  if (env.NODE_ENV !== "production") return;
  const require2 = (value, path2, message) => {
    if (!value) ctx.addIssue({ code: import_zod11.z.ZodIssueCode.custom, path: [path2], message });
  };
  require2(env.REDIS_URL, "REDIS_URL", "REDIS_URL is required in production");
  require2(env.FLUTTERWAVE_SECRET_KEY, "FLUTTERWAVE_SECRET_KEY", "a real payment key is required in production");
  require2(env.FLUTTERWAVE_SECRET_HASH, "FLUTTERWAVE_SECRET_HASH", "webhook verification hash is required in production");
  require2(env.MAIL_FROM, "MAIL_FROM", "MAIL_FROM is required in production");
  require2(env.RESEND_API_KEY, "RESEND_API_KEY", "RESEND_API_KEY is required in production");
  if (env.MAIL_DRIVER !== "resend") {
    ctx.addIssue({
      code: import_zod11.z.ZodIssueCode.custom,
      path: ["MAIL_DRIVER"],
      message: 'MAIL_DRIVER must be "resend" in production'
    });
  }
  if (env.DB_DRIVER !== "pg") {
    ctx.addIssue({ code: import_zod11.z.ZodIssueCode.custom, path: ["DB_DRIVER"], message: 'DB_DRIVER must be "pg" in production' });
  }
  if (env.CORS_ORIGINS.length === 0) {
    ctx.addIssue({
      code: import_zod11.z.ZodIssueCode.custom,
      path: ["CORS_ORIGINS"],
      message: "CORS_ORIGINS must list the allowed origins in production"
    });
  }
  if (env.CORS_ORIGINS.includes("*")) {
    ctx.addIssue({
      code: import_zod11.z.ZodIssueCode.custom,
      path: ["CORS_ORIGINS"],
      message: 'CORS_ORIGINS cannot be "*" in production'
    });
  }
});
var cached2 = null;
function pickKnown(source) {
  const picked = {};
  for (const key of Object.keys(EnvObject.shape)) picked[key] = source[key];
  return picked;
}
function loadEnv(source = process.env) {
  if (cached2) return cached2;
  const parsed = EnvSchema.safeParse(pickKnown(source));
  if (!parsed.success) {
    const detail = parsed.error.issues.map((i3) => `${i3.path.join(".")}: ${i3.message}`).join("; ");
    throw new Error(`Refusing to start: invalid environment (${detail})`);
  }
  cached2 = parsed.data;
  return cached2;
}

// backend/src/locks/locks.ts
var MemoryLock = class {
  held = /* @__PURE__ */ new Map();
  async acquire(key, ttlMs) {
    const now = Date.now();
    const current = this.held.get(key);
    if (current && current.expiresAt > now) return null;
    const token = randomSecret(16);
    this.held.set(key, { token, expiresAt: now + ttlMs });
    return async () => {
      const latest = this.held.get(key);
      if (latest && latest.token === token) this.held.delete(key);
    };
  }
  async close() {
    this.held.clear();
  }
};
var RELEASE_SCRIPT = 'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end';
var RedisLock = class {
  constructor(url) {
    this.url = url;
  }
  url;
  client = null;
  async conn() {
    if (!this.client) {
      const { default: Redis } = await import("ioredis");
      this.client = new Redis(this.url, { maxRetriesPerRequest: 2 });
    }
    return this.client;
  }
  async acquire(key, ttlMs) {
    const client = await this.conn();
    const token = randomSecret(16);
    const result = await client.set(key, token, "PX", ttlMs, "NX");
    if (result !== "OK") return null;
    return async () => {
      await client.eval(RELEASE_SCRIPT, 1, key, token).catch(() => void 0);
    };
  }
  async close() {
    if (!this.client) return;
    const client = this.client;
    this.client = null;
    await client.quit();
  }
};
async function createLock(redisUrl, log, required = false) {
  if (redisUrl) {
    try {
      const { default: Redis } = await import("ioredis");
      const probe = new Redis(redisUrl, { maxRetriesPerRequest: 1, lazyConnect: true, connectTimeout: 5e3 });
      try {
        await probe.connect();
        await probe.ping();
      } finally {
        await probe.quit().catch(() => void 0);
      }
      return new RedisLock(redisUrl);
    } catch (error) {
      if (required) {
        throw new Error(`Refusing to start: Redis lock store is unavailable (${error.message})`);
      }
      log.error({ err: error }, "redis unavailable for locks \u2014 using in-memory locks");
    }
  }
  if (required) throw new Error("Refusing to start: REDIS_URL is required in production");
  return new MemoryLock();
}

// backend/src/lib/logger.ts
var import_pino = require("pino");
function createLogger(level = "info") {
  return (0, import_pino.pino)({
    level,
    redact: {
      paths: ["req.headers.authorization", "password", "token", "secret", "*.password", "*.token", "*.secret"],
      censor: "[redacted]"
    },
    serializers: {
      err: import_pino.stdSerializers.err
    }
  });
}
var logger = createLogger(process.env.LOG_LEVEL ?? "info");

// api/index.ts
var config = { maxDuration: 60 };
var runtime = null;
function boot() {
  if (runtime) return runtime;
  runtime = (async () => {
    const env = loadEnv();
    const log = createLogger(env.NODE_ENV === "test" ? "silent" : "info");
    const topology = await createTopology(env);
    const queue = await createQueue(env.REDIS_URL, log, false);
    registerMailJobs(queue, env, log);
    const cache = await createCache(env.REDIS_URL, log);
    const rateLimiter = await createRateLimiter(env, log);
    const lock = await createLock(env.REDIS_URL, log, false);
    const deps = { env, topology, queue, cache, rateLimiter, lock };
    registerBillingJobs(queue, deps, { scheduleRenewals: false });
    const app = await buildApp({ ...deps, log });
    await app.ready();
    return { app, queue };
  })();
  return runtime;
}
async function handler(req, res) {
  const { app, queue } = await boot();
  await new Promise((resolve2, reject) => {
    res.on("finish", resolve2);
    res.on("close", resolve2);
    try {
      app.routing(req, res);
    } catch (error) {
      reject(error);
    }
  });
  await queue.drain(8e3).catch(() => void 0);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  config
});
