/**
* @vue/shared v3.5.22
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function vr(e){const t=Object.create(null);for(const o of e.split(","))t[o]=1;return o=>o in t}const tt={},Be=[],Xt=()=>{},qi=()=>!1,pn=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),br=e=>e.startsWith("onUpdate:"),kt=Object.assign,mr=(e,t)=>{const o=e.indexOf(t);o>-1&&e.splice(o,1)},Jl=Object.prototype.hasOwnProperty,X=(e,t)=>Jl.call(e,t),F=Array.isArray,qe=e=>Ro(e)==="[object Map]",hn=e=>Ro(e)==="[object Set]",Qr=e=>Ro(e)==="[object Date]",K=e=>typeof e=="function",ft=e=>typeof e=="string",Qt=e=>typeof e=="symbol",et=e=>e!==null&&typeof e=="object",Ki=e=>(et(e)||K(e))&&K(e.then)&&K(e.catch),Wi=Object.prototype.toString,Ro=e=>Wi.call(e),Yl=e=>Ro(e).slice(8,-1),Gi=e=>Ro(e)==="[object Object]",yr=e=>ft(e)&&e!=="NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e,bo=vr(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),fn=e=>{const t=Object.create(null);return(o=>t[o]||(t[o]=e(o)))},Zl=/-\w/g,me=fn(e=>e.replace(Zl,t=>t.slice(1).toUpperCase())),Xl=/\B([A-Z])/g,Ie=fn(e=>e.replace(Xl,"-$1").toLowerCase()),Ji=fn(e=>e.charAt(0).toUpperCase()+e.slice(1)),On=fn(e=>e?`on${Ji(e)}`:""),be=(e,t)=>!Object.is(e,t),Ko=(e,...t)=>{for(let o=0;o<e.length;o++)e[o](...t)},Yi=(e,t,o,n=!1)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:n,value:o})},Zi=e=>{const t=parseFloat(e);return isNaN(t)?e:t};let ti;const gn=()=>ti||(ti=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function kr(e){if(F(e)){const t={};for(let o=0;o<e.length;o++){const n=e[o],r=ft(n)?oc(n):kr(n);if(r)for(const i in r)t[i]=r[i]}return t}else if(ft(e)||et(e))return e}const Ql=/;(?![^(]*\))/g,tc=/:([^]+)/,ec=/\/\*[^]*?\*\//g;function oc(e){const t={};return e.replace(ec,"").split(Ql).forEach(o=>{if(o){const n=o.split(tc);n.length>1&&(t[n[0].trim()]=n[1].trim())}}),t}function vn(e){let t="";if(ft(e))t=e;else if(F(e))for(let o=0;o<e.length;o++){const n=vn(e[o]);n&&(t+=n+" ")}else if(et(e))for(const o in e)e[o]&&(t+=o+" ");return t.trim()}const nc="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",rc=vr(nc);function Xi(e){return!!e||e===""}function ic(e,t){if(e.length!==t.length)return!1;let o=!0;for(let n=0;o&&n<e.length;n++)o=bn(e[n],t[n]);return o}function bn(e,t){if(e===t)return!0;let o=Qr(e),n=Qr(t);if(o||n)return o&&n?e.getTime()===t.getTime():!1;if(o=Qt(e),n=Qt(t),o||n)return e===t;if(o=F(e),n=F(t),o||n)return o&&n?ic(e,t):!1;if(o=et(e),n=et(t),o||n){if(!o||!n)return!1;const r=Object.keys(e).length,i=Object.keys(t).length;if(r!==i)return!1;for(const s in e){const a=e.hasOwnProperty(s),l=t.hasOwnProperty(s);if(a&&!l||!a&&l||!bn(e[s],t[s]))return!1}}return String(e)===String(t)}function sc(e,t){return e.findIndex(o=>bn(o,t))}const Qi=e=>!!(e&&e.__v_isRef===!0),rt=e=>ft(e)?e:e==null?"":F(e)||et(e)&&(e.toString===Wi||!K(e.toString))?Qi(e)?rt(e.value):JSON.stringify(e,ts,2):String(e),ts=(e,t)=>Qi(t)?ts(e,t.value):qe(t)?{[`Map(${t.size})`]:[...t.entries()].reduce((o,[n,r],i)=>(o[Ln(n,i)+" =>"]=r,o),{})}:hn(t)?{[`Set(${t.size})`]:[...t.values()].map(o=>Ln(o))}:Qt(t)?Ln(t):et(t)&&!F(t)&&!Gi(t)?String(t):t,Ln=(e,t="")=>{var o;return Qt(e)?`Symbol(${(o=e.description)!=null?o:t})`:e};/**
* @vue/reactivity v3.5.22
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let zt;class ac{constructor(t=!1){this.detached=t,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.parent=zt,!t&&zt&&(this.index=(zt.scopes||(zt.scopes=[])).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let t,o;if(this.scopes)for(t=0,o=this.scopes.length;t<o;t++)this.scopes[t].pause();for(t=0,o=this.effects.length;t<o;t++)this.effects[t].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let t,o;if(this.scopes)for(t=0,o=this.scopes.length;t<o;t++)this.scopes[t].resume();for(t=0,o=this.effects.length;t<o;t++)this.effects[t].resume()}}run(t){if(this._active){const o=zt;try{return zt=this,t()}finally{zt=o}}}on(){++this._on===1&&(this.prevScope=zt,zt=this)}off(){this._on>0&&--this._on===0&&(zt=this.prevScope,this.prevScope=void 0)}stop(t){if(this._active){this._active=!1;let o,n;for(o=0,n=this.effects.length;o<n;o++)this.effects[o].stop();for(this.effects.length=0,o=0,n=this.cleanups.length;o<n;o++)this.cleanups[o]();if(this.cleanups.length=0,this.scopes){for(o=0,n=this.scopes.length;o<n;o++)this.scopes[o].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!t){const r=this.parent.scopes.pop();r&&r!==this&&(this.parent.scopes[this.index]=r,r.index=this.index)}this.parent=void 0}}}function lc(){return zt}let at;const Pn=new WeakSet;class es{constructor(t){this.fn=t,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,zt&&zt.active&&zt.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Pn.has(this)&&(Pn.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||ns(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,ei(this),rs(this);const t=at,o=Vt;at=this,Vt=!0;try{return this.fn()}finally{is(this),at=t,Vt=o,this.flags&=-3}}stop(){if(this.flags&1){for(let t=this.deps;t;t=t.nextDep)wr(t);this.deps=this.depsTail=void 0,ei(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?Pn.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Xn(this)&&this.run()}get dirty(){return Xn(this)}}let os=0,mo,yo;function ns(e,t=!1){if(e.flags|=8,t){e.next=yo,yo=e;return}e.next=mo,mo=e}function _r(){os++}function xr(){if(--os>0)return;if(yo){let t=yo;for(yo=void 0;t;){const o=t.next;t.next=void 0,t.flags&=-9,t=o}}let e;for(;mo;){let t=mo;for(mo=void 0;t;){const o=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(n){e||(e=n)}t=o}}if(e)throw e}function rs(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function is(e){let t,o=e.depsTail,n=o;for(;n;){const r=n.prevDep;n.version===-1?(n===o&&(o=r),wr(n),cc(n)):t=n,n.dep.activeLink=n.prevActiveLink,n.prevActiveLink=void 0,n=r}e.deps=t,e.depsTail=o}function Xn(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(ss(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function ss(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===Eo)||(e.globalVersion=Eo,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!Xn(e))))return;e.flags|=2;const t=e.dep,o=at,n=Vt;at=e,Vt=!0;try{rs(e);const r=e.fn(e._value);(t.version===0||be(r,e._value))&&(e.flags|=128,e._value=r,t.version++)}catch(r){throw t.version++,r}finally{at=o,Vt=n,is(e),e.flags&=-3}}function wr(e,t=!1){const{dep:o,prevSub:n,nextSub:r}=e;if(n&&(n.nextSub=r,e.prevSub=void 0),r&&(r.prevSub=n,e.nextSub=void 0),o.subs===e&&(o.subs=n,!n&&o.computed)){o.computed.flags&=-5;for(let i=o.computed.deps;i;i=i.nextDep)wr(i,!0)}!t&&!--o.sc&&o.map&&o.map.delete(o.key)}function cc(e){const{prevDep:t,nextDep:o}=e;t&&(t.nextDep=o,e.prevDep=void 0),o&&(o.prevDep=t,e.nextDep=void 0)}let Vt=!0;const as=[];function se(){as.push(Vt),Vt=!1}function ae(){const e=as.pop();Vt=e===void 0?!0:e}function ei(e){const{cleanup:t}=e;if(e.cleanup=void 0,t){const o=at;at=void 0;try{t()}finally{at=o}}}let Eo=0;class uc{constructor(t,o){this.sub=t,this.dep=o,this.version=o.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class Sr{constructor(t){this.computed=t,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(t){if(!at||!Vt||at===this.computed)return;let o=this.activeLink;if(o===void 0||o.sub!==at)o=this.activeLink=new uc(at,this),at.deps?(o.prevDep=at.depsTail,at.depsTail.nextDep=o,at.depsTail=o):at.deps=at.depsTail=o,ls(o);else if(o.version===-1&&(o.version=this.version,o.nextDep)){const n=o.nextDep;n.prevDep=o.prevDep,o.prevDep&&(o.prevDep.nextDep=n),o.prevDep=at.depsTail,o.nextDep=void 0,at.depsTail.nextDep=o,at.depsTail=o,at.deps===o&&(at.deps=n)}return o}trigger(t){this.version++,Eo++,this.notify(t)}notify(t){_r();try{for(let o=this.subs;o;o=o.prevSub)o.sub.notify()&&o.sub.dep.notify()}finally{xr()}}}function ls(e){if(e.dep.sc++,e.sub.flags&4){const t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let n=t.deps;n;n=n.nextDep)ls(n)}const o=e.dep.subs;o!==e&&(e.prevSub=o,o&&(o.nextSub=e)),e.dep.subs=e}}const Qn=new WeakMap,Me=Symbol(""),tr=Symbol(""),$o=Symbol("");function mt(e,t,o){if(Vt&&at){let n=Qn.get(e);n||Qn.set(e,n=new Map);let r=n.get(o);r||(n.set(o,r=new Sr),r.map=n,r.key=o),r.track()}}function re(e,t,o,n,r,i){const s=Qn.get(e);if(!s){Eo++;return}const a=l=>{l&&l.trigger()};if(_r(),t==="clear")s.forEach(a);else{const l=F(e),d=l&&yr(o);if(l&&o==="length"){const c=Number(n);s.forEach((p,b)=>{(b==="length"||b===$o||!Qt(b)&&b>=c)&&a(p)})}else switch((o!==void 0||s.has(void 0))&&a(s.get(o)),d&&a(s.get($o)),t){case"add":l?d&&a(s.get("length")):(a(s.get(Me)),qe(e)&&a(s.get(tr)));break;case"delete":l||(a(s.get(Me)),qe(e)&&a(s.get(tr)));break;case"set":qe(e)&&a(s.get(Me));break}}xr()}function Fe(e){const t=Z(e);return t===e?t:(mt(t,"iterate",$o),Ut(e)?t:t.map(bt))}function mn(e){return mt(e=Z(e),"iterate",$o),e}const dc={__proto__:null,[Symbol.iterator](){return In(this,Symbol.iterator,bt)},concat(...e){return Fe(this).concat(...e.map(t=>F(t)?Fe(t):t))},entries(){return In(this,"entries",e=>(e[1]=bt(e[1]),e))},every(e,t){return ee(this,"every",e,t,void 0,arguments)},filter(e,t){return ee(this,"filter",e,t,o=>o.map(bt),arguments)},find(e,t){return ee(this,"find",e,t,bt,arguments)},findIndex(e,t){return ee(this,"findIndex",e,t,void 0,arguments)},findLast(e,t){return ee(this,"findLast",e,t,bt,arguments)},findLastIndex(e,t){return ee(this,"findLastIndex",e,t,void 0,arguments)},forEach(e,t){return ee(this,"forEach",e,t,void 0,arguments)},includes(...e){return Rn(this,"includes",e)},indexOf(...e){return Rn(this,"indexOf",e)},join(e){return Fe(this).join(e)},lastIndexOf(...e){return Rn(this,"lastIndexOf",e)},map(e,t){return ee(this,"map",e,t,void 0,arguments)},pop(){return po(this,"pop")},push(...e){return po(this,"push",e)},reduce(e,...t){return oi(this,"reduce",e,t)},reduceRight(e,...t){return oi(this,"reduceRight",e,t)},shift(){return po(this,"shift")},some(e,t){return ee(this,"some",e,t,void 0,arguments)},splice(...e){return po(this,"splice",e)},toReversed(){return Fe(this).toReversed()},toSorted(e){return Fe(this).toSorted(e)},toSpliced(...e){return Fe(this).toSpliced(...e)},unshift(...e){return po(this,"unshift",e)},values(){return In(this,"values",bt)}};function In(e,t,o){const n=mn(e),r=n[t]();return n!==e&&!Ut(e)&&(r._next=r.next,r.next=()=>{const i=r._next();return i.done||(i.value=o(i.value)),i}),r}const pc=Array.prototype;function ee(e,t,o,n,r,i){const s=mn(e),a=s!==e&&!Ut(e),l=s[t];if(l!==pc[t]){const p=l.apply(e,i);return a?bt(p):p}let d=o;s!==e&&(a?d=function(p,b){return o.call(this,bt(p),b,e)}:o.length>2&&(d=function(p,b){return o.call(this,p,b,e)}));const c=l.call(s,d,n);return a&&r?r(c):c}function oi(e,t,o,n){const r=mn(e);let i=o;return r!==e&&(Ut(e)?o.length>3&&(i=function(s,a,l){return o.call(this,s,a,l,e)}):i=function(s,a,l){return o.call(this,s,bt(a),l,e)}),r[t](i,...n)}function Rn(e,t,o){const n=Z(e);mt(n,"iterate",$o);const r=n[t](...o);return(r===-1||r===!1)&&$r(o[0])?(o[0]=Z(o[0]),n[t](...o)):r}function po(e,t,o=[]){se(),_r();const n=Z(e)[t].apply(e,o);return xr(),ae(),n}const hc=vr("__proto__,__v_isRef,__isVue"),cs=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!=="arguments"&&e!=="caller").map(e=>Symbol[e]).filter(Qt));function fc(e){Qt(e)||(e=String(e));const t=Z(this);return mt(t,"has",e),t.hasOwnProperty(e)}class us{constructor(t=!1,o=!1){this._isReadonly=t,this._isShallow=o}get(t,o,n){if(o==="__v_skip")return t.__v_skip;const r=this._isReadonly,i=this._isShallow;if(o==="__v_isReactive")return!r;if(o==="__v_isReadonly")return r;if(o==="__v_isShallow")return i;if(o==="__v_raw")return n===(r?i?Sc:fs:i?hs:ps).get(t)||Object.getPrototypeOf(t)===Object.getPrototypeOf(n)?t:void 0;const s=F(t);if(!r){let l;if(s&&(l=dc[o]))return l;if(o==="hasOwnProperty")return fc}const a=Reflect.get(t,o,yt(t)?t:n);if((Qt(o)?cs.has(o):hc(o))||(r||mt(t,"get",o),i))return a;if(yt(a)){const l=s&&yr(o)?a:a.value;return r&&et(l)?or(l):l}return et(a)?r?or(a):yn(a):a}}class ds extends us{constructor(t=!1){super(!1,t)}set(t,o,n,r){let i=t[o];if(!this._isShallow){const l=ye(i);if(!Ut(n)&&!ye(n)&&(i=Z(i),n=Z(n)),!F(t)&&yt(i)&&!yt(n))return l||(i.value=n),!0}const s=F(t)&&yr(o)?Number(o)<t.length:X(t,o),a=Reflect.set(t,o,n,yt(t)?t:r);return t===Z(r)&&(s?be(n,i)&&re(t,"set",o,n):re(t,"add",o,n)),a}deleteProperty(t,o){const n=X(t,o);t[o];const r=Reflect.deleteProperty(t,o);return r&&n&&re(t,"delete",o,void 0),r}has(t,o){const n=Reflect.has(t,o);return(!Qt(o)||!cs.has(o))&&mt(t,"has",o),n}ownKeys(t){return mt(t,"iterate",F(t)?"length":Me),Reflect.ownKeys(t)}}class gc extends us{constructor(t=!1){super(!0,t)}set(t,o){return!0}deleteProperty(t,o){return!0}}const vc=new ds,bc=new gc,mc=new ds(!0);const er=e=>e,Ho=e=>Reflect.getPrototypeOf(e);function yc(e,t,o){return function(...n){const r=this.__v_raw,i=Z(r),s=qe(i),a=e==="entries"||e===Symbol.iterator&&s,l=e==="keys"&&s,d=r[e](...n),c=o?er:t?Qo:bt;return!t&&mt(i,"iterate",l?tr:Me),{next(){const{value:p,done:b}=d.next();return b?{value:p,done:b}:{value:a?[c(p[0]),c(p[1])]:c(p),done:b}},[Symbol.iterator](){return this}}}}function Vo(e){return function(...t){return e==="delete"?!1:e==="clear"?void 0:this}}function kc(e,t){const o={get(r){const i=this.__v_raw,s=Z(i),a=Z(r);e||(be(r,a)&&mt(s,"get",r),mt(s,"get",a));const{has:l}=Ho(s),d=t?er:e?Qo:bt;if(l.call(s,r))return d(i.get(r));if(l.call(s,a))return d(i.get(a));i!==s&&i.get(r)},get size(){const r=this.__v_raw;return!e&&mt(Z(r),"iterate",Me),r.size},has(r){const i=this.__v_raw,s=Z(i),a=Z(r);return e||(be(r,a)&&mt(s,"has",r),mt(s,"has",a)),r===a?i.has(r):i.has(r)||i.has(a)},forEach(r,i){const s=this,a=s.__v_raw,l=Z(a),d=t?er:e?Qo:bt;return!e&&mt(l,"iterate",Me),a.forEach((c,p)=>r.call(i,d(c),d(p),s))}};return kt(o,e?{add:Vo("add"),set:Vo("set"),delete:Vo("delete"),clear:Vo("clear")}:{add(r){!t&&!Ut(r)&&!ye(r)&&(r=Z(r));const i=Z(this);return Ho(i).has.call(i,r)||(i.add(r),re(i,"add",r,r)),this},set(r,i){!t&&!Ut(i)&&!ye(i)&&(i=Z(i));const s=Z(this),{has:a,get:l}=Ho(s);let d=a.call(s,r);d||(r=Z(r),d=a.call(s,r));const c=l.call(s,r);return s.set(r,i),d?be(i,c)&&re(s,"set",r,i):re(s,"add",r,i),this},delete(r){const i=Z(this),{has:s,get:a}=Ho(i);let l=s.call(i,r);l||(r=Z(r),l=s.call(i,r)),a&&a.call(i,r);const d=i.delete(r);return l&&re(i,"delete",r,void 0),d},clear(){const r=Z(this),i=r.size!==0,s=r.clear();return i&&re(r,"clear",void 0,void 0),s}}),["keys","values","entries",Symbol.iterator].forEach(r=>{o[r]=yc(r,e,t)}),o}function Cr(e,t){const o=kc(e,t);return(n,r,i)=>r==="__v_isReactive"?!e:r==="__v_isReadonly"?e:r==="__v_raw"?n:Reflect.get(X(o,r)&&r in n?o:n,r,i)}const _c={get:Cr(!1,!1)},xc={get:Cr(!1,!0)},wc={get:Cr(!0,!1)};const ps=new WeakMap,hs=new WeakMap,fs=new WeakMap,Sc=new WeakMap;function Cc(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function Ec(e){return e.__v_skip||!Object.isExtensible(e)?0:Cc(Yl(e))}function yn(e){return ye(e)?e:Er(e,!1,vc,_c,ps)}function $c(e){return Er(e,!1,mc,xc,hs)}function or(e){return Er(e,!0,bc,wc,fs)}function Er(e,t,o,n,r){if(!et(e)||e.__v_raw&&!(t&&e.__v_isReactive))return e;const i=Ec(e);if(i===0)return e;const s=r.get(e);if(s)return s;const a=new Proxy(e,i===2?n:o);return r.set(e,a),a}function Ke(e){return ye(e)?Ke(e.__v_raw):!!(e&&e.__v_isReactive)}function ye(e){return!!(e&&e.__v_isReadonly)}function Ut(e){return!!(e&&e.__v_isShallow)}function $r(e){return e?!!e.__v_raw:!1}function Z(e){const t=e&&e.__v_raw;return t?Z(t):e}function Ac(e){return!X(e,"__v_skip")&&Object.isExtensible(e)&&Yi(e,"__v_skip",!0),e}const bt=e=>et(e)?yn(e):e,Qo=e=>et(e)?or(e):e;function yt(e){return e?e.__v_isRef===!0:!1}function xe(e){return zc(e,!1)}function zc(e,t){return yt(e)?e:new Mc(e,t)}class Mc{constructor(t,o){this.dep=new Sr,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=o?t:Z(t),this._value=o?t:bt(t),this.__v_isShallow=o}get value(){return this.dep.track(),this._value}set value(t){const o=this._rawValue,n=this.__v_isShallow||Ut(t)||ye(t);t=n?t:Z(t),be(t,o)&&(this._rawValue=t,this._value=n?t:bt(t),this.dep.trigger())}}function B(e){return yt(e)?e.value:e}const Tc={get:(e,t,o)=>t==="__v_raw"?e:B(Reflect.get(e,t,o)),set:(e,t,o,n)=>{const r=e[t];return yt(r)&&!yt(o)?(r.value=o,!0):Reflect.set(e,t,o,n)}};function gs(e){return Ke(e)?e:new Proxy(e,Tc)}class Oc{constructor(t,o,n){this.fn=t,this.setter=o,this._value=void 0,this.dep=new Sr(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Eo-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!o,this.isSSR=n}notify(){if(this.flags|=16,!(this.flags&8)&&at!==this)return ns(this,!0),!0}get value(){const t=this.dep.track();return ss(this),t&&(t.version=this.dep.version),this._value}set value(t){this.setter&&this.setter(t)}}function Lc(e,t,o=!1){let n,r;return K(e)?n=e:(n=e.get,r=e.set),new Oc(n,r,o)}const Bo={},tn=new WeakMap;let $e;function Pc(e,t=!1,o=$e){if(o){let n=tn.get(o);n||tn.set(o,n=[]),n.push(e)}}function Ic(e,t,o=tt){const{immediate:n,deep:r,once:i,scheduler:s,augmentJob:a,call:l}=o,d=j=>r?j:Ut(j)||r===!1||r===0?ie(j,1):ie(j);let c,p,b,k,y=!1,O=!1;if(yt(e)?(p=()=>e.value,y=Ut(e)):Ke(e)?(p=()=>d(e),y=!0):F(e)?(O=!0,y=e.some(j=>Ke(j)||Ut(j)),p=()=>e.map(j=>{if(yt(j))return j.value;if(Ke(j))return d(j);if(K(j))return l?l(j,2):j()})):K(e)?t?p=l?()=>l(e,2):e:p=()=>{if(b){se();try{b()}finally{ae()}}const j=$e;$e=c;try{return l?l(e,3,[k]):e(k)}finally{$e=j}}:p=Xt,t&&r){const j=p,pt=r===!0?1/0:r;p=()=>ie(j(),pt)}const G=lc(),P=()=>{c.stop(),G&&G.active&&mr(G.effects,c)};if(i&&t){const j=t;t=(...pt)=>{j(...pt),P()}}let W=O?new Array(e.length).fill(Bo):Bo;const ot=j=>{if(!(!(c.flags&1)||!c.dirty&&!j))if(t){const pt=c.run();if(r||y||(O?pt.some((Bt,ht)=>be(Bt,W[ht])):be(pt,W))){b&&b();const Bt=$e;$e=c;try{const ht=[pt,W===Bo?void 0:O&&W[0]===Bo?[]:W,k];W=pt,l?l(t,3,ht):t(...ht)}finally{$e=Bt}}}else c.run()};return a&&a(ot),c=new es(p),c.scheduler=s?()=>s(ot,!1):ot,k=j=>Pc(j,!1,c),b=c.onStop=()=>{const j=tn.get(c);if(j){if(l)l(j,4);else for(const pt of j)pt();tn.delete(c)}},t?n?ot(!0):W=c.run():s?s(ot.bind(null,!0),!0):c.run(),P.pause=c.pause.bind(c),P.resume=c.resume.bind(c),P.stop=P,P}function ie(e,t=1/0,o){if(t<=0||!et(e)||e.__v_skip||(o=o||new Map,(o.get(e)||0)>=t))return e;if(o.set(e,t),t--,yt(e))ie(e.value,t,o);else if(F(e))for(let n=0;n<e.length;n++)ie(e[n],t,o);else if(hn(e)||qe(e))e.forEach(n=>{ie(n,t,o)});else if(Gi(e)){for(const n in e)ie(e[n],t,o);for(const n of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,n)&&ie(e[n],t,o)}return e}/**
* @vue/runtime-core v3.5.22
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function jo(e,t,o,n){try{return n?e(...n):e()}catch(r){kn(r,t,o)}}function te(e,t,o,n){if(K(e)){const r=jo(e,t,o,n);return r&&Ki(r)&&r.catch(i=>{kn(i,t,o)}),r}if(F(e)){const r=[];for(let i=0;i<e.length;i++)r.push(te(e[i],t,o,n));return r}}function kn(e,t,o,n=!0){const r=t?t.vnode:null,{errorHandler:i,throwUnhandledErrorInProduction:s}=t&&t.appContext.config||tt;if(t){let a=t.parent;const l=t.proxy,d=`https://vuejs.org/error-reference/#runtime-${o}`;for(;a;){const c=a.ec;if(c){for(let p=0;p<c.length;p++)if(c[p](e,l,d)===!1)return}a=a.parent}if(i){se(),jo(i,null,10,[e,l,d]),ae();return}}Rc(e,o,r,n,s)}function Rc(e,t,o,n=!0,r=!1){if(r)throw e;console.error(e)}const St=[];let Yt=-1;const We=[];let he=null,He=0;const vs=Promise.resolve();let en=null;function bs(e){const t=en||vs;return e?t.then(this?e.bind(this):e):t}function jc(e){let t=Yt+1,o=St.length;for(;t<o;){const n=t+o>>>1,r=St[n],i=Ao(r);i<e||i===e&&r.flags&2?t=n+1:o=n}return t}function Ar(e){if(!(e.flags&1)){const t=Ao(e),o=St[St.length-1];!o||!(e.flags&2)&&t>=Ao(o)?St.push(e):St.splice(jc(t),0,e),e.flags|=1,ms()}}function ms(){en||(en=vs.then(ks))}function Uc(e){F(e)?We.push(...e):he&&e.id===-1?he.splice(He+1,0,e):e.flags&1||(We.push(e),e.flags|=1),ms()}function ni(e,t,o=Yt+1){for(;o<St.length;o++){const n=St[o];if(n&&n.flags&2){if(e&&n.id!==e.uid)continue;St.splice(o,1),o--,n.flags&4&&(n.flags&=-2),n(),n.flags&4||(n.flags&=-2)}}}function ys(e){if(We.length){const t=[...new Set(We)].sort((o,n)=>Ao(o)-Ao(n));if(We.length=0,he){he.push(...t);return}for(he=t,He=0;He<he.length;He++){const o=he[He];o.flags&4&&(o.flags&=-2),o.flags&8||o(),o.flags&=-2}he=null,He=0}}const Ao=e=>e.id==null?e.flags&2?-1:1/0:e.id;function ks(e){try{for(Yt=0;Yt<St.length;Yt++){const t=St[Yt];t&&!(t.flags&8)&&(t.flags&4&&(t.flags&=-2),jo(t,t.i,t.i?15:14),t.flags&4||(t.flags&=-2))}}finally{for(;Yt<St.length;Yt++){const t=St[Yt];t&&(t.flags&=-2)}Yt=-1,St.length=0,ys(),en=null,(St.length||We.length)&&ks()}}let Rt=null,_s=null;function on(e){const t=Rt;return Rt=e,_s=e&&e.type.__scopeId||null,t}function it(e,t=Rt,o){if(!t||e._n)return e;const n=(...r)=>{n._d&&sn(-1);const i=on(t);let s;try{s=e(...r)}finally{on(i),n._d&&sn(1)}return s};return n._n=!0,n._c=!0,n._d=!0,n}function ue(e,t){if(Rt===null)return e;const o=Sn(Rt),n=e.dirs||(e.dirs=[]);for(let r=0;r<t.length;r++){let[i,s,a,l=tt]=t[r];i&&(K(i)&&(i={mounted:i,updated:i}),i.deep&&ie(s),n.push({dir:i,instance:o,value:s,oldValue:void 0,arg:a,modifiers:l}))}return e}function we(e,t,o,n){const r=e.dirs,i=t&&t.dirs;for(let s=0;s<r.length;s++){const a=r[s];i&&(a.oldValue=i[s].value);let l=a.dir[n];l&&(se(),te(l,o,8,[e.el,a,e,t]),ae())}}const Nc=Symbol("_vte"),Dc=e=>e.__isTeleport,Fc=Symbol("_leaveCb");function zr(e,t){e.shapeFlag&6&&e.component?(e.transition=t,zr(e.component.subTree,t)):e.shapeFlag&128?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t}function Uo(e,t){return K(e)?kt({name:e.name},t,{setup:e}):e}function xs(e){e.ids=[e.ids[0]+e.ids[2]+++"-",0,0]}const nn=new WeakMap;function ko(e,t,o,n,r=!1){if(F(e)){e.forEach((y,O)=>ko(y,t&&(F(t)?t[O]:t),o,n,r));return}if(_o(n)&&!r){n.shapeFlag&512&&n.type.__asyncResolved&&n.component.subTree.component&&ko(e,t,o,n.component.subTree);return}const i=n.shapeFlag&4?Sn(n.component):n.el,s=r?null:i,{i:a,r:l}=e,d=t&&t.r,c=a.refs===tt?a.refs={}:a.refs,p=a.setupState,b=Z(p),k=p===tt?qi:y=>X(b,y);if(d!=null&&d!==l){if(ri(t),ft(d))c[d]=null,k(d)&&(p[d]=null);else if(yt(d)){d.value=null;const y=t;y.k&&(c[y.k]=null)}}if(K(l))jo(l,a,12,[s,c]);else{const y=ft(l),O=yt(l);if(y||O){const G=()=>{if(e.f){const P=y?k(l)?p[l]:c[l]:l.value;if(r)F(P)&&mr(P,i);else if(F(P))P.includes(i)||P.push(i);else if(y)c[l]=[i],k(l)&&(p[l]=c[l]);else{const W=[i];l.value=W,e.k&&(c[e.k]=W)}}else y?(c[l]=s,k(l)&&(p[l]=s)):O&&(l.value=s,e.k&&(c[e.k]=s))};if(s){const P=()=>{G(),nn.delete(e)};P.id=-1,nn.set(e,P),Tt(P,o)}else ri(e),G()}}}function ri(e){const t=nn.get(e);t&&(t.flags|=8,nn.delete(e))}gn().requestIdleCallback;gn().cancelIdleCallback;const _o=e=>!!e.type.__asyncLoader,ws=e=>e.type.__isKeepAlive;function Hc(e,t){Ss(e,"a",t)}function Vc(e,t){Ss(e,"da",t)}function Ss(e,t,o=Ct){const n=e.__wdc||(e.__wdc=()=>{let r=o;for(;r;){if(r.isDeactivated)return;r=r.parent}return e()});if(_n(t,n,o),o){let r=o.parent;for(;r&&r.parent;)ws(r.parent.vnode)&&Bc(n,t,o,r),r=r.parent}}function Bc(e,t,o,n){const r=_n(t,e,n,!0);Cs(()=>{mr(n[t],r)},o)}function _n(e,t,o=Ct,n=!1){if(o){const r=o[e]||(o[e]=[]),i=t.__weh||(t.__weh=(...s)=>{se();const a=No(o),l=te(t,o,e,s);return a(),ae(),l});return n?r.unshift(i):r.push(i),i}}const le=e=>(t,o=Ct)=>{(!Mo||e==="sp")&&_n(e,(...n)=>t(...n),o)},qc=le("bm"),Kc=le("m"),Wc=le("bu"),Gc=le("u"),Jc=le("bum"),Cs=le("um"),Yc=le("sp"),Zc=le("rtg"),Xc=le("rtc");function Qc(e,t=Ct){_n("ec",e,t)}const tu=Symbol.for("v-ndc");function It(e,t,o,n){let r;const i=o,s=F(e);if(s||ft(e)){const a=s&&Ke(e);let l=!1,d=!1;a&&(l=!Ut(e),d=ye(e),e=mn(e)),r=new Array(e.length);for(let c=0,p=e.length;c<p;c++)r[c]=t(l?d?Qo(bt(e[c])):bt(e[c]):e[c],c,void 0,i)}else if(typeof e=="number"){r=new Array(e);for(let a=0;a<e;a++)r[a]=t(a+1,a,void 0,i)}else if(et(e))if(e[Symbol.iterator])r=Array.from(e,(a,l)=>t(a,l,void 0,i));else{const a=Object.keys(e);r=new Array(a.length);for(let l=0,d=a.length;l<d;l++){const c=a[l];r[l]=t(e[c],c,l,i)}}else r=[];return r}const nr=e=>e?Ks(e)?Sn(e):nr(e.parent):null,xo=kt(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>nr(e.parent),$root:e=>nr(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>$s(e),$forceUpdate:e=>e.f||(e.f=()=>{Ar(e.update)}),$nextTick:e=>e.n||(e.n=bs.bind(e.proxy)),$watch:e=>_u.bind(e)}),jn=(e,t)=>e!==tt&&!e.__isScriptSetup&&X(e,t),eu={get({_:e},t){if(t==="__v_skip")return!0;const{ctx:o,setupState:n,data:r,props:i,accessCache:s,type:a,appContext:l}=e;let d;if(t[0]!=="$"){const k=s[t];if(k!==void 0)switch(k){case 1:return n[t];case 2:return r[t];case 4:return o[t];case 3:return i[t]}else{if(jn(n,t))return s[t]=1,n[t];if(r!==tt&&X(r,t))return s[t]=2,r[t];if((d=e.propsOptions[0])&&X(d,t))return s[t]=3,i[t];if(o!==tt&&X(o,t))return s[t]=4,o[t];rr&&(s[t]=0)}}const c=xo[t];let p,b;if(c)return t==="$attrs"&&mt(e.attrs,"get",""),c(e);if((p=a.__cssModules)&&(p=p[t]))return p;if(o!==tt&&X(o,t))return s[t]=4,o[t];if(b=l.config.globalProperties,X(b,t))return b[t]},set({_:e},t,o){const{data:n,setupState:r,ctx:i}=e;return jn(r,t)?(r[t]=o,!0):n!==tt&&X(n,t)?(n[t]=o,!0):X(e.props,t)||t[0]==="$"&&t.slice(1)in e?!1:(i[t]=o,!0)},has({_:{data:e,setupState:t,accessCache:o,ctx:n,appContext:r,propsOptions:i,type:s}},a){let l,d;return!!(o[a]||e!==tt&&a[0]!=="$"&&X(e,a)||jn(t,a)||(l=i[0])&&X(l,a)||X(n,a)||X(xo,a)||X(r.config.globalProperties,a)||(d=s.__cssModules)&&d[a])},defineProperty(e,t,o){return o.get!=null?e._.accessCache[t]=0:X(o,"value")&&this.set(e,t,o.value,null),Reflect.defineProperty(e,t,o)}};function ii(e){return F(e)?e.reduce((t,o)=>(t[o]=null,t),{}):e}let rr=!0;function ou(e){const t=$s(e),o=e.proxy,n=e.ctx;rr=!1,t.beforeCreate&&si(t.beforeCreate,e,"bc");const{data:r,computed:i,methods:s,watch:a,provide:l,inject:d,created:c,beforeMount:p,mounted:b,beforeUpdate:k,updated:y,activated:O,deactivated:G,beforeDestroy:P,beforeUnmount:W,destroyed:ot,unmounted:j,render:pt,renderTracked:Bt,renderTriggered:ht,errorCaptured:Dt,serverPrefetch:Ue,expose:Ft,inheritAttrs:_e,components:Ne,directives:De,filters:Et}=t;if(d&&nu(d,n,null),s)for(const g in s){const I=s[g];K(I)&&(n[g]=I.bind(o))}if(r){const g=r.call(o,o);et(g)&&(e.data=yn(g))}if(rr=!0,i)for(const g in i){const I=i[g],E=K(I)?I.bind(o,o):K(I.get)?I.get.bind(o,o):Xt,Pt=!K(I)&&K(I.set)?I.set.bind(o):Xt,Ht=Yo({get:E,set:Pt});Object.defineProperty(n,g,{enumerable:!0,configurable:!0,get:()=>Ht.value,set:qt=>Ht.value=qt})}if(a)for(const g in a)Es(a[g],n,o,g);if(l){const g=K(l)?l.call(o):l;Reflect.ownKeys(g).forEach(I=>{zs(I,g[I])})}c&&si(c,e,"c");function f(g,I){F(I)?I.forEach(E=>g(E.bind(o))):I&&g(I.bind(o))}if(f(qc,p),f(Kc,b),f(Wc,k),f(Gc,y),f(Hc,O),f(Vc,G),f(Qc,Dt),f(Xc,Bt),f(Zc,ht),f(Jc,W),f(Cs,j),f(Yc,Ue),F(Ft))if(Ft.length){const g=e.exposed||(e.exposed={});Ft.forEach(I=>{Object.defineProperty(g,I,{get:()=>o[I],set:E=>o[I]=E,enumerable:!0})})}else e.exposed||(e.exposed={});pt&&e.render===Xt&&(e.render=pt),_e!=null&&(e.inheritAttrs=_e),Ne&&(e.components=Ne),De&&(e.directives=De),Ue&&xs(e)}function nu(e,t,o=Xt){F(e)&&(e=ir(e));for(const n in e){const r=e[n];let i;et(r)?"default"in r?i=Wo(r.from||n,r.default,!0):i=Wo(r.from||n):i=Wo(r),yt(i)?Object.defineProperty(t,n,{enumerable:!0,configurable:!0,get:()=>i.value,set:s=>i.value=s}):t[n]=i}}function si(e,t,o){te(F(e)?e.map(n=>n.bind(t.proxy)):e.bind(t.proxy),t,o)}function Es(e,t,o,n){let r=n.includes(".")?Fs(o,n):()=>o[n];if(ft(e)){const i=t[e];K(i)&&Go(r,i)}else if(K(e))Go(r,e.bind(o));else if(et(e))if(F(e))e.forEach(i=>Es(i,t,o,n));else{const i=K(e.handler)?e.handler.bind(o):t[e.handler];K(i)&&Go(r,i,e)}}function $s(e){const t=e.type,{mixins:o,extends:n}=t,{mixins:r,optionsCache:i,config:{optionMergeStrategies:s}}=e.appContext,a=i.get(t);let l;return a?l=a:!r.length&&!o&&!n?l=t:(l={},r.length&&r.forEach(d=>rn(l,d,s,!0)),rn(l,t,s)),et(t)&&i.set(t,l),l}function rn(e,t,o,n=!1){const{mixins:r,extends:i}=t;i&&rn(e,i,o,!0),r&&r.forEach(s=>rn(e,s,o,!0));for(const s in t)if(!(n&&s==="expose")){const a=ru[s]||o&&o[s];e[s]=a?a(e[s],t[s]):t[s]}return e}const ru={data:ai,props:li,emits:li,methods:go,computed:go,beforeCreate:wt,created:wt,beforeMount:wt,mounted:wt,beforeUpdate:wt,updated:wt,beforeDestroy:wt,beforeUnmount:wt,destroyed:wt,unmounted:wt,activated:wt,deactivated:wt,errorCaptured:wt,serverPrefetch:wt,components:go,directives:go,watch:su,provide:ai,inject:iu};function ai(e,t){return t?e?function(){return kt(K(e)?e.call(this,this):e,K(t)?t.call(this,this):t)}:t:e}function iu(e,t){return go(ir(e),ir(t))}function ir(e){if(F(e)){const t={};for(let o=0;o<e.length;o++)t[e[o]]=e[o];return t}return e}function wt(e,t){return e?[...new Set([].concat(e,t))]:t}function go(e,t){return e?kt(Object.create(null),e,t):t}function li(e,t){return e?F(e)&&F(t)?[...new Set([...e,...t])]:kt(Object.create(null),ii(e),ii(t??{})):t}function su(e,t){if(!e)return t;if(!t)return e;const o=kt(Object.create(null),e);for(const n in t)o[n]=wt(e[n],t[n]);return o}function As(){return{app:null,config:{isNativeTag:qi,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let au=0;function lu(e,t){return function(n,r=null){K(n)||(n=kt({},n)),r!=null&&!et(r)&&(r=null);const i=As(),s=new WeakSet,a=[];let l=!1;const d=i.app={_uid:au++,_component:n,_props:r,_container:null,_context:i,_instance:null,version:Vu,get config(){return i.config},set config(c){},use(c,...p){return s.has(c)||(c&&K(c.install)?(s.add(c),c.install(d,...p)):K(c)&&(s.add(c),c(d,...p))),d},mixin(c){return i.mixins.includes(c)||i.mixins.push(c),d},component(c,p){return p?(i.components[c]=p,d):i.components[c]},directive(c,p){return p?(i.directives[c]=p,d):i.directives[c]},mount(c,p,b){if(!l){const k=d._ceVNode||q(n,r);return k.appContext=i,b===!0?b="svg":b===!1&&(b=void 0),e(k,c,b),l=!0,d._container=c,c.__vue_app__=d,Sn(k.component)}},onUnmount(c){a.push(c)},unmount(){l&&(te(a,d._instance,16),e(null,d._container),delete d._container.__vue_app__)},provide(c,p){return i.provides[c]=p,d},runWithContext(c){const p=Ge;Ge=d;try{return c()}finally{Ge=p}}};return d}}let Ge=null;function zs(e,t){if(Ct){let o=Ct.provides;const n=Ct.parent&&Ct.parent.provides;n===o&&(o=Ct.provides=Object.create(n)),o[e]=t}}function Wo(e,t,o=!1){const n=ju();if(n||Ge){let r=Ge?Ge._context.provides:n?n.parent==null||n.ce?n.vnode.appContext&&n.vnode.appContext.provides:n.parent.provides:void 0;if(r&&e in r)return r[e];if(arguments.length>1)return o&&K(t)?t.call(n&&n.proxy):t}}const Ms={},Ts=()=>Object.create(Ms),Os=e=>Object.getPrototypeOf(e)===Ms;function cu(e,t,o,n=!1){const r={},i=Ts();e.propsDefaults=Object.create(null),Ls(e,t,r,i);for(const s in e.propsOptions[0])s in r||(r[s]=void 0);o?e.props=n?r:$c(r):e.type.props?e.props=r:e.props=i,e.attrs=i}function uu(e,t,o,n){const{props:r,attrs:i,vnode:{patchFlag:s}}=e,a=Z(r),[l]=e.propsOptions;let d=!1;if((n||s>0)&&!(s&16)){if(s&8){const c=e.vnode.dynamicProps;for(let p=0;p<c.length;p++){let b=c[p];if(xn(e.emitsOptions,b))continue;const k=t[b];if(l)if(X(i,b))k!==i[b]&&(i[b]=k,d=!0);else{const y=me(b);r[y]=sr(l,a,y,k,e,!1)}else k!==i[b]&&(i[b]=k,d=!0)}}}else{Ls(e,t,r,i)&&(d=!0);let c;for(const p in a)(!t||!X(t,p)&&((c=Ie(p))===p||!X(t,c)))&&(l?o&&(o[p]!==void 0||o[c]!==void 0)&&(r[p]=sr(l,a,p,void 0,e,!0)):delete r[p]);if(i!==a)for(const p in i)(!t||!X(t,p))&&(delete i[p],d=!0)}d&&re(e.attrs,"set","")}function Ls(e,t,o,n){const[r,i]=e.propsOptions;let s=!1,a;if(t)for(let l in t){if(bo(l))continue;const d=t[l];let c;r&&X(r,c=me(l))?!i||!i.includes(c)?o[c]=d:(a||(a={}))[c]=d:xn(e.emitsOptions,l)||(!(l in n)||d!==n[l])&&(n[l]=d,s=!0)}if(i){const l=Z(o),d=a||tt;for(let c=0;c<i.length;c++){const p=i[c];o[p]=sr(r,l,p,d[p],e,!X(d,p))}}return s}function sr(e,t,o,n,r,i){const s=e[o];if(s!=null){const a=X(s,"default");if(a&&n===void 0){const l=s.default;if(s.type!==Function&&!s.skipFactory&&K(l)){const{propsDefaults:d}=r;if(o in d)n=d[o];else{const c=No(r);n=d[o]=l.call(null,t),c()}}else n=l;r.ce&&r.ce._setProp(o,n)}s[0]&&(i&&!a?n=!1:s[1]&&(n===""||n===Ie(o))&&(n=!0))}return n}const du=new WeakMap;function Ps(e,t,o=!1){const n=o?du:t.propsCache,r=n.get(e);if(r)return r;const i=e.props,s={},a=[];let l=!1;if(!K(e)){const c=p=>{l=!0;const[b,k]=Ps(p,t,!0);kt(s,b),k&&a.push(...k)};!o&&t.mixins.length&&t.mixins.forEach(c),e.extends&&c(e.extends),e.mixins&&e.mixins.forEach(c)}if(!i&&!l)return et(e)&&n.set(e,Be),Be;if(F(i))for(let c=0;c<i.length;c++){const p=me(i[c]);ci(p)&&(s[p]=tt)}else if(i)for(const c in i){const p=me(c);if(ci(p)){const b=i[c],k=s[p]=F(b)||K(b)?{type:b}:kt({},b),y=k.type;let O=!1,G=!0;if(F(y))for(let P=0;P<y.length;++P){const W=y[P],ot=K(W)&&W.name;if(ot==="Boolean"){O=!0;break}else ot==="String"&&(G=!1)}else O=K(y)&&y.name==="Boolean";k[0]=O,k[1]=G,(O||X(k,"default"))&&a.push(p)}}const d=[s,a];return et(e)&&n.set(e,d),d}function ci(e){return e[0]!=="$"&&!bo(e)}const Mr=e=>e==="_"||e==="_ctx"||e==="$stable",Tr=e=>F(e)?e.map(Zt):[Zt(e)],pu=(e,t,o)=>{if(t._n)return t;const n=it((...r)=>Tr(t(...r)),o);return n._c=!1,n},Is=(e,t,o)=>{const n=e._ctx;for(const r in e){if(Mr(r))continue;const i=e[r];if(K(i))t[r]=pu(r,i,n);else if(i!=null){const s=Tr(i);t[r]=()=>s}}},Rs=(e,t)=>{const o=Tr(t);e.slots.default=()=>o},js=(e,t,o)=>{for(const n in t)(o||!Mr(n))&&(e[n]=t[n])},hu=(e,t,o)=>{const n=e.slots=Ts();if(e.vnode.shapeFlag&32){const r=t._;r?(js(n,t,o),o&&Yi(n,"_",r,!0)):Is(t,n)}else t&&Rs(e,t)},fu=(e,t,o)=>{const{vnode:n,slots:r}=e;let i=!0,s=tt;if(n.shapeFlag&32){const a=t._;a?o&&a===1?i=!1:js(r,t,o):(i=!t.$stable,Is(t,r)),s=t}else t&&(Rs(e,t),s={default:1});if(i)for(const a in r)!Mr(a)&&s[a]==null&&delete r[a]},Tt=zu;function gu(e){return vu(e)}function vu(e,t){const o=gn();o.__VUE__=!0;const{insert:n,remove:r,patchProp:i,createElement:s,createText:a,createComment:l,setText:d,setElementText:c,parentNode:p,nextSibling:b,setScopeId:k=Xt,insertStaticContent:y}=e,O=(u,h,v,S=null,_=null,x=null,M=void 0,z=null,$=!!h.dynamicChildren)=>{if(u===h)return;u&&!ho(u,h)&&(S=Fo(u),qt(u,_,x,!0),u=null),h.patchFlag===-2&&($=!1,h.dynamicChildren=null);const{type:C,ref:N,shapeFlag:T}=h;switch(C){case wn:G(u,h,v,S);break;case ke:P(u,h,v,S);break;case Nn:u==null&&W(h,v,S,M);break;case ct:Ne(u,h,v,S,_,x,M,z,$);break;default:T&1?pt(u,h,v,S,_,x,M,z,$):T&6?De(u,h,v,S,_,x,M,z,$):(T&64||T&128)&&C.process(u,h,v,S,_,x,M,z,$,co)}N!=null&&_?ko(N,u&&u.ref,x,h||u,!h):N==null&&u&&u.ref!=null&&ko(u.ref,null,x,u,!0)},G=(u,h,v,S)=>{if(u==null)n(h.el=a(h.children),v,S);else{const _=h.el=u.el;h.children!==u.children&&d(_,h.children)}},P=(u,h,v,S)=>{u==null?n(h.el=l(h.children||""),v,S):h.el=u.el},W=(u,h,v,S)=>{[u.el,u.anchor]=y(u.children,h,v,S,u.el,u.anchor)},ot=({el:u,anchor:h},v,S)=>{let _;for(;u&&u!==h;)_=b(u),n(u,v,S),u=_;n(h,v,S)},j=({el:u,anchor:h})=>{let v;for(;u&&u!==h;)v=b(u),r(u),u=v;r(h)},pt=(u,h,v,S,_,x,M,z,$)=>{h.type==="svg"?M="svg":h.type==="math"&&(M="mathml"),u==null?Bt(h,v,S,_,x,M,z,$):Ue(u,h,_,x,M,z,$)},Bt=(u,h,v,S,_,x,M,z)=>{let $,C;const{props:N,shapeFlag:T,transition:R,dirs:H}=u;if($=u.el=s(u.type,x,N&&N.is,N),T&8?c($,u.children):T&16&&Dt(u.children,$,null,S,_,Un(u,x),M,z),H&&we(u,null,S,"created"),ht($,u,u.scopeId,M,S),N){for(const nt in N)nt!=="value"&&!bo(nt)&&i($,nt,null,N[nt],x,S);"value"in N&&i($,"value",null,N.value,x),(C=N.onVnodeBeforeMount)&&Jt(C,S,u)}H&&we(u,null,S,"beforeMount");const J=bu(_,R);J&&R.beforeEnter($),n($,h,v),((C=N&&N.onVnodeMounted)||J||H)&&Tt(()=>{C&&Jt(C,S,u),J&&R.enter($),H&&we(u,null,S,"mounted")},_)},ht=(u,h,v,S,_)=>{if(v&&k(u,v),S)for(let x=0;x<S.length;x++)k(u,S[x]);if(_){let x=_.subTree;if(h===x||Vs(x.type)&&(x.ssContent===h||x.ssFallback===h)){const M=_.vnode;ht(u,M,M.scopeId,M.slotScopeIds,_.parent)}}},Dt=(u,h,v,S,_,x,M,z,$=0)=>{for(let C=$;C<u.length;C++){const N=u[C]=z?fe(u[C]):Zt(u[C]);O(null,N,h,v,S,_,x,M,z)}},Ue=(u,h,v,S,_,x,M)=>{const z=h.el=u.el;let{patchFlag:$,dynamicChildren:C,dirs:N}=h;$|=u.patchFlag&16;const T=u.props||tt,R=h.props||tt;let H;if(v&&Se(v,!1),(H=R.onVnodeBeforeUpdate)&&Jt(H,v,h,u),N&&we(h,u,v,"beforeUpdate"),v&&Se(v,!0),(T.innerHTML&&R.innerHTML==null||T.textContent&&R.textContent==null)&&c(z,""),C?Ft(u.dynamicChildren,C,z,v,S,Un(h,_),x):M||I(u,h,z,null,v,S,Un(h,_),x,!1),$>0){if($&16)_e(z,T,R,v,_);else if($&2&&T.class!==R.class&&i(z,"class",null,R.class,_),$&4&&i(z,"style",T.style,R.style,_),$&8){const J=h.dynamicProps;for(let nt=0;nt<J.length;nt++){const Q=J[nt],$t=T[Q],At=R[Q];(At!==$t||Q==="value")&&i(z,Q,$t,At,_,v)}}$&1&&u.children!==h.children&&c(z,h.children)}else!M&&C==null&&_e(z,T,R,v,_);((H=R.onVnodeUpdated)||N)&&Tt(()=>{H&&Jt(H,v,h,u),N&&we(h,u,v,"updated")},S)},Ft=(u,h,v,S,_,x,M)=>{for(let z=0;z<h.length;z++){const $=u[z],C=h[z],N=$.el&&($.type===ct||!ho($,C)||$.shapeFlag&198)?p($.el):v;O($,C,N,null,S,_,x,M,!0)}},_e=(u,h,v,S,_)=>{if(h!==v){if(h!==tt)for(const x in h)!bo(x)&&!(x in v)&&i(u,x,h[x],null,_,S);for(const x in v){if(bo(x))continue;const M=v[x],z=h[x];M!==z&&x!=="value"&&i(u,x,z,M,_,S)}"value"in v&&i(u,"value",h.value,v.value,_)}},Ne=(u,h,v,S,_,x,M,z,$)=>{const C=h.el=u?u.el:a(""),N=h.anchor=u?u.anchor:a("");let{patchFlag:T,dynamicChildren:R,slotScopeIds:H}=h;H&&(z=z?z.concat(H):H),u==null?(n(C,v,S),n(N,v,S),Dt(h.children||[],v,N,_,x,M,z,$)):T>0&&T&64&&R&&u.dynamicChildren?(Ft(u.dynamicChildren,R,v,_,x,M,z),(h.key!=null||_&&h===_.subTree)&&Us(u,h,!0)):I(u,h,v,N,_,x,M,z,$)},De=(u,h,v,S,_,x,M,z,$)=>{h.slotScopeIds=z,u==null?h.shapeFlag&512?_.ctx.activate(h,v,S,M,$):Et(h,v,S,_,x,M,$):L(u,h,$)},Et=(u,h,v,S,_,x,M)=>{const z=u.component=Ru(u,S,_);if(ws(u)&&(z.ctx.renderer=co),Uu(z,!1,M),z.asyncDep){if(_&&_.registerDep(z,f,M),!u.el){const $=z.subTree=q(ke);P(null,$,h,v),u.placeholder=$.el}}else f(z,u,h,v,_,x,M)},L=(u,h,v)=>{const S=h.component=u.component;if($u(u,h,v))if(S.asyncDep&&!S.asyncResolved){g(S,h,v);return}else S.next=h,S.update();else h.el=u.el,S.vnode=h},f=(u,h,v,S,_,x,M)=>{const z=()=>{if(u.isMounted){let{next:T,bu:R,u:H,parent:J,vnode:nt}=u;{const Wt=Ns(u);if(Wt){T&&(T.el=nt.el,g(u,T,M)),Wt.asyncDep.then(()=>{u.isUnmounted||z()});return}}let Q=T,$t;Se(u,!1),T?(T.el=nt.el,g(u,T,M)):T=nt,R&&Ko(R),($t=T.props&&T.props.onVnodeBeforeUpdate)&&Jt($t,J,T,nt),Se(u,!0);const At=di(u),Kt=u.subTree;u.subTree=At,O(Kt,At,p(Kt.el),Fo(Kt),u,_,x),T.el=At.el,Q===null&&Au(u,At.el),H&&Tt(H,_),($t=T.props&&T.props.onVnodeUpdated)&&Tt(()=>Jt($t,J,T,nt),_)}else{let T;const{el:R,props:H}=h,{bm:J,m:nt,parent:Q,root:$t,type:At}=u,Kt=_o(h);Se(u,!1),J&&Ko(J),!Kt&&(T=H&&H.onVnodeBeforeMount)&&Jt(T,Q,h),Se(u,!0);{$t.ce&&$t.ce._def.shadowRoot!==!1&&$t.ce._injectChildStyle(At);const Wt=u.subTree=di(u);O(null,Wt,v,S,u,_,x),h.el=Wt.el}if(nt&&Tt(nt,_),!Kt&&(T=H&&H.onVnodeMounted)){const Wt=h;Tt(()=>Jt(T,Q,Wt),_)}(h.shapeFlag&256||Q&&_o(Q.vnode)&&Q.vnode.shapeFlag&256)&&u.a&&Tt(u.a,_),u.isMounted=!0,h=v=S=null}};u.scope.on();const $=u.effect=new es(z);u.scope.off();const C=u.update=$.run.bind($),N=u.job=$.runIfDirty.bind($);N.i=u,N.id=u.uid,$.scheduler=()=>Ar(N),Se(u,!0),C()},g=(u,h,v)=>{h.component=u;const S=u.vnode.props;u.vnode=h,u.next=null,uu(u,h.props,S,v),fu(u,h.children,v),se(),ni(u),ae()},I=(u,h,v,S,_,x,M,z,$=!1)=>{const C=u&&u.children,N=u?u.shapeFlag:0,T=h.children,{patchFlag:R,shapeFlag:H}=h;if(R>0){if(R&128){Pt(C,T,v,S,_,x,M,z,$);return}else if(R&256){E(C,T,v,S,_,x,M,z,$);return}}H&8?(N&16&&lo(C,_,x),T!==C&&c(v,T)):N&16?H&16?Pt(C,T,v,S,_,x,M,z,$):lo(C,_,x,!0):(N&8&&c(v,""),H&16&&Dt(T,v,S,_,x,M,z,$))},E=(u,h,v,S,_,x,M,z,$)=>{u=u||Be,h=h||Be;const C=u.length,N=h.length,T=Math.min(C,N);let R;for(R=0;R<T;R++){const H=h[R]=$?fe(h[R]):Zt(h[R]);O(u[R],H,v,null,_,x,M,z,$)}C>N?lo(u,_,x,!0,!1,T):Dt(h,v,S,_,x,M,z,$,T)},Pt=(u,h,v,S,_,x,M,z,$)=>{let C=0;const N=h.length;let T=u.length-1,R=N-1;for(;C<=T&&C<=R;){const H=u[C],J=h[C]=$?fe(h[C]):Zt(h[C]);if(ho(H,J))O(H,J,v,null,_,x,M,z,$);else break;C++}for(;C<=T&&C<=R;){const H=u[T],J=h[R]=$?fe(h[R]):Zt(h[R]);if(ho(H,J))O(H,J,v,null,_,x,M,z,$);else break;T--,R--}if(C>T){if(C<=R){const H=R+1,J=H<N?h[H].el:S;for(;C<=R;)O(null,h[C]=$?fe(h[C]):Zt(h[C]),v,J,_,x,M,z,$),C++}}else if(C>R)for(;C<=T;)qt(u[C],_,x,!0),C++;else{const H=C,J=C,nt=new Map;for(C=J;C<=R;C++){const Mt=h[C]=$?fe(h[C]):Zt(h[C]);Mt.key!=null&&nt.set(Mt.key,C)}let Q,$t=0;const At=R-J+1;let Kt=!1,Wt=0;const uo=new Array(At);for(C=0;C<At;C++)uo[C]=0;for(C=H;C<=T;C++){const Mt=u[C];if($t>=At){qt(Mt,_,x,!0);continue}let Gt;if(Mt.key!=null)Gt=nt.get(Mt.key);else for(Q=J;Q<=R;Q++)if(uo[Q-J]===0&&ho(Mt,h[Q])){Gt=Q;break}Gt===void 0?qt(Mt,_,x,!0):(uo[Gt-J]=C+1,Gt>=Wt?Wt=Gt:Kt=!0,O(Mt,h[Gt],v,null,_,x,M,z,$),$t++)}const Yr=Kt?mu(uo):Be;for(Q=Yr.length-1,C=At-1;C>=0;C--){const Mt=J+C,Gt=h[Mt],Zr=h[Mt+1],Xr=Mt+1<N?Zr.el||Zr.placeholder:S;uo[C]===0?O(null,Gt,v,Xr,_,x,M,z,$):Kt&&(Q<0||C!==Yr[Q]?Ht(Gt,v,Xr,2):Q--)}}},Ht=(u,h,v,S,_=null)=>{const{el:x,type:M,transition:z,children:$,shapeFlag:C}=u;if(C&6){Ht(u.component.subTree,h,v,S);return}if(C&128){u.suspense.move(h,v,S);return}if(C&64){M.move(u,h,v,co);return}if(M===ct){n(x,h,v);for(let T=0;T<$.length;T++)Ht($[T],h,v,S);n(u.anchor,h,v);return}if(M===Nn){ot(u,h,v);return}if(S!==2&&C&1&&z)if(S===0)z.beforeEnter(x),n(x,h,v),Tt(()=>z.enter(x),_);else{const{leave:T,delayLeave:R,afterLeave:H}=z,J=()=>{u.ctx.isUnmounted?r(x):n(x,h,v)},nt=()=>{x._isLeaving&&x[Fc](!0),T(x,()=>{J(),H&&H()})};R?R(x,J,nt):nt()}else n(x,h,v)},qt=(u,h,v,S=!1,_=!1)=>{const{type:x,props:M,ref:z,children:$,dynamicChildren:C,shapeFlag:N,patchFlag:T,dirs:R,cacheIndex:H}=u;if(T===-2&&(_=!1),z!=null&&(se(),ko(z,null,v,u,!0),ae()),H!=null&&(h.renderCache[H]=void 0),N&256){h.ctx.deactivate(u);return}const J=N&1&&R,nt=!_o(u);let Q;if(nt&&(Q=M&&M.onVnodeBeforeUnmount)&&Jt(Q,h,u),N&6)Gl(u.component,v,S);else{if(N&128){u.suspense.unmount(v,S);return}J&&we(u,null,h,"beforeUnmount"),N&64?u.type.remove(u,h,v,co,S):C&&!C.hasOnce&&(x!==ct||T>0&&T&64)?lo(C,h,v,!1,!0):(x===ct&&T&384||!_&&N&16)&&lo($,h,v),S&&Gr(u)}(nt&&(Q=M&&M.onVnodeUnmounted)||J)&&Tt(()=>{Q&&Jt(Q,h,u),J&&we(u,null,h,"unmounted")},v)},Gr=u=>{const{type:h,el:v,anchor:S,transition:_}=u;if(h===ct){Wl(v,S);return}if(h===Nn){j(u);return}const x=()=>{r(v),_&&!_.persisted&&_.afterLeave&&_.afterLeave()};if(u.shapeFlag&1&&_&&!_.persisted){const{leave:M,delayLeave:z}=_,$=()=>M(v,x);z?z(u.el,x,$):$()}else x()},Wl=(u,h)=>{let v;for(;u!==h;)v=b(u),r(u),u=v;r(h)},Gl=(u,h,v)=>{const{bum:S,scope:_,job:x,subTree:M,um:z,m:$,a:C}=u;ui($),ui(C),S&&Ko(S),_.stop(),x&&(x.flags|=8,qt(M,u,h,v)),z&&Tt(z,h),Tt(()=>{u.isUnmounted=!0},h)},lo=(u,h,v,S=!1,_=!1,x=0)=>{for(let M=x;M<u.length;M++)qt(u[M],h,v,S,_)},Fo=u=>{if(u.shapeFlag&6)return Fo(u.component.subTree);if(u.shapeFlag&128)return u.suspense.next();const h=b(u.anchor||u.el),v=h&&h[Nc];return v?b(v):h};let Tn=!1;const Jr=(u,h,v)=>{u==null?h._vnode&&qt(h._vnode,null,null,!0):O(h._vnode||null,u,h,null,null,null,v),h._vnode=u,Tn||(Tn=!0,ni(),ys(),Tn=!1)},co={p:O,um:qt,m:Ht,r:Gr,mt:Et,mc:Dt,pc:I,pbc:Ft,n:Fo,o:e};return{render:Jr,hydrate:void 0,createApp:lu(Jr)}}function Un({type:e,props:t},o){return o==="svg"&&e==="foreignObject"||o==="mathml"&&e==="annotation-xml"&&t&&t.encoding&&t.encoding.includes("html")?void 0:o}function Se({effect:e,job:t},o){o?(e.flags|=32,t.flags|=4):(e.flags&=-33,t.flags&=-5)}function bu(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function Us(e,t,o=!1){const n=e.children,r=t.children;if(F(n)&&F(r))for(let i=0;i<n.length;i++){const s=n[i];let a=r[i];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=r[i]=fe(r[i]),a.el=s.el),!o&&a.patchFlag!==-2&&Us(s,a)),a.type===wn&&a.patchFlag!==-1&&(a.el=s.el),a.type===ke&&!a.el&&(a.el=s.el)}}function mu(e){const t=e.slice(),o=[0];let n,r,i,s,a;const l=e.length;for(n=0;n<l;n++){const d=e[n];if(d!==0){if(r=o[o.length-1],e[r]<d){t[n]=r,o.push(n);continue}for(i=0,s=o.length-1;i<s;)a=i+s>>1,e[o[a]]<d?i=a+1:s=a;d<e[o[i]]&&(i>0&&(t[n]=o[i-1]),o[i]=n)}}for(i=o.length,s=o[i-1];i-- >0;)o[i]=s,s=t[s];return o}function Ns(e){const t=e.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:Ns(t)}function ui(e){if(e)for(let t=0;t<e.length;t++)e[t].flags|=8}const yu=Symbol.for("v-scx"),ku=()=>Wo(yu);function Go(e,t,o){return Ds(e,t,o)}function Ds(e,t,o=tt){const{immediate:n,deep:r,flush:i,once:s}=o,a=kt({},o),l=t&&n||!t&&i!=="post";let d;if(Mo){if(i==="sync"){const k=ku();d=k.__watcherHandles||(k.__watcherHandles=[])}else if(!l){const k=()=>{};return k.stop=Xt,k.resume=Xt,k.pause=Xt,k}}const c=Ct;a.call=(k,y,O)=>te(k,c,y,O);let p=!1;i==="post"?a.scheduler=k=>{Tt(k,c&&c.suspense)}:i!=="sync"&&(p=!0,a.scheduler=(k,y)=>{y?k():Ar(k)}),a.augmentJob=k=>{t&&(k.flags|=4),p&&(k.flags|=2,c&&(k.id=c.uid,k.i=c))};const b=Ic(e,t,a);return Mo&&(d?d.push(b):l&&b()),b}function _u(e,t,o){const n=this.proxy,r=ft(e)?e.includes(".")?Fs(n,e):()=>n[e]:e.bind(n,n);let i;K(t)?i=t:(i=t.handler,o=t);const s=No(this),a=Ds(r,i.bind(n),o);return s(),a}function Fs(e,t){const o=t.split(".");return()=>{let n=e;for(let r=0;r<o.length&&n;r++)n=n[o[r]];return n}}const xu=(e,t)=>t==="modelValue"||t==="model-value"?e.modelModifiers:e[`${t}Modifiers`]||e[`${me(t)}Modifiers`]||e[`${Ie(t)}Modifiers`];function wu(e,t,...o){if(e.isUnmounted)return;const n=e.vnode.props||tt;let r=o;const i=t.startsWith("update:"),s=i&&xu(n,t.slice(7));s&&(s.trim&&(r=o.map(c=>ft(c)?c.trim():c)),s.number&&(r=o.map(Zi)));let a,l=n[a=On(t)]||n[a=On(me(t))];!l&&i&&(l=n[a=On(Ie(t))]),l&&te(l,e,6,r);const d=n[a+"Once"];if(d){if(!e.emitted)e.emitted={};else if(e.emitted[a])return;e.emitted[a]=!0,te(d,e,6,r)}}const Su=new WeakMap;function Hs(e,t,o=!1){const n=o?Su:t.emitsCache,r=n.get(e);if(r!==void 0)return r;const i=e.emits;let s={},a=!1;if(!K(e)){const l=d=>{const c=Hs(d,t,!0);c&&(a=!0,kt(s,c))};!o&&t.mixins.length&&t.mixins.forEach(l),e.extends&&l(e.extends),e.mixins&&e.mixins.forEach(l)}return!i&&!a?(et(e)&&n.set(e,null),null):(F(i)?i.forEach(l=>s[l]=null):kt(s,i),et(e)&&n.set(e,s),s)}function xn(e,t){return!e||!pn(t)?!1:(t=t.slice(2).replace(/Once$/,""),X(e,t[0].toLowerCase()+t.slice(1))||X(e,Ie(t))||X(e,t))}function di(e){const{type:t,vnode:o,proxy:n,withProxy:r,propsOptions:[i],slots:s,attrs:a,emit:l,render:d,renderCache:c,props:p,data:b,setupState:k,ctx:y,inheritAttrs:O}=e,G=on(e);let P,W;try{if(o.shapeFlag&4){const j=r||n,pt=j;P=Zt(d.call(pt,j,c,p,k,b,y)),W=a}else{const j=t;P=Zt(j.length>1?j(p,{attrs:a,slots:s,emit:l}):j(p,null)),W=t.props?a:Cu(a)}}catch(j){wo.length=0,kn(j,e,1),P=q(ke)}let ot=P;if(W&&O!==!1){const j=Object.keys(W),{shapeFlag:pt}=ot;j.length&&pt&7&&(i&&j.some(br)&&(W=Eu(W,i)),ot=eo(ot,W,!1,!0))}return o.dirs&&(ot=eo(ot,null,!1,!0),ot.dirs=ot.dirs?ot.dirs.concat(o.dirs):o.dirs),o.transition&&zr(ot,o.transition),P=ot,on(G),P}const Cu=e=>{let t;for(const o in e)(o==="class"||o==="style"||pn(o))&&((t||(t={}))[o]=e[o]);return t},Eu=(e,t)=>{const o={};for(const n in e)(!br(n)||!(n.slice(9)in t))&&(o[n]=e[n]);return o};function $u(e,t,o){const{props:n,children:r,component:i}=e,{props:s,children:a,patchFlag:l}=t,d=i.emitsOptions;if(t.dirs||t.transition)return!0;if(o&&l>=0){if(l&1024)return!0;if(l&16)return n?pi(n,s,d):!!s;if(l&8){const c=t.dynamicProps;for(let p=0;p<c.length;p++){const b=c[p];if(s[b]!==n[b]&&!xn(d,b))return!0}}}else return(r||a)&&(!a||!a.$stable)?!0:n===s?!1:n?s?pi(n,s,d):!0:!!s;return!1}function pi(e,t,o){const n=Object.keys(t);if(n.length!==Object.keys(e).length)return!0;for(let r=0;r<n.length;r++){const i=n[r];if(t[i]!==e[i]&&!xn(o,i))return!0}return!1}function Au({vnode:e,parent:t},o){for(;t;){const n=t.subTree;if(n.suspense&&n.suspense.activeBranch===e&&(n.el=e.el),n===e)(e=t.vnode).el=o,t=t.parent;else break}}const Vs=e=>e.__isSuspense;function zu(e,t){t&&t.pendingBranch?F(e)?t.effects.push(...e):t.effects.push(e):Uc(e)}const ct=Symbol.for("v-fgt"),wn=Symbol.for("v-txt"),ke=Symbol.for("v-cmt"),Nn=Symbol.for("v-stc"),wo=[];let Ot=null;function D(e=!1){wo.push(Ot=e?null:[])}function Mu(){wo.pop(),Ot=wo[wo.length-1]||null}let zo=1;function sn(e,t=!1){zo+=e,e<0&&Ot&&t&&(Ot.hasOnce=!0)}function Bs(e){return e.dynamicChildren=zo>0?Ot||Be:null,Mu(),zo>0&&Ot&&Ot.push(e),e}function V(e,t,o,n,r,i){return Bs(m(e,t,o,n,r,i,!0))}function vo(e,t,o,n,r){return Bs(q(e,t,o,n,r,!0))}function an(e){return e?e.__v_isVNode===!0:!1}function ho(e,t){return e.type===t.type&&e.key===t.key}const qs=({key:e})=>e??null,Jo=({ref:e,ref_key:t,ref_for:o})=>(typeof e=="number"&&(e=""+e),e!=null?ft(e)||yt(e)||K(e)?{i:Rt,r:e,k:t,f:!!o}:e:null);function m(e,t=null,o=null,n=0,r=null,i=e===ct?0:1,s=!1,a=!1){const l={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&qs(t),ref:t&&Jo(t),scopeId:_s,slotScopeIds:null,children:o,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:i,patchFlag:n,dynamicProps:r,dynamicChildren:null,appContext:null,ctx:Rt};return a?(Or(l,o),i&128&&e.normalize(l)):o&&(l.shapeFlag|=ft(o)?8:16),zo>0&&!s&&Ot&&(l.patchFlag>0||i&6)&&l.patchFlag!==32&&Ot.push(l),l}const q=Tu;function Tu(e,t=null,o=null,n=0,r=null,i=!1){if((!e||e===tu)&&(e=ke),an(e)){const a=eo(e,t,!0);return o&&Or(a,o),zo>0&&!i&&Ot&&(a.shapeFlag&6?Ot[Ot.indexOf(e)]=a:Ot.push(a)),a.patchFlag=-2,a}if(Hu(e)&&(e=e.__vccOpts),t){t=Ou(t);let{class:a,style:l}=t;a&&!ft(a)&&(t.class=vn(a)),et(l)&&($r(l)&&!F(l)&&(l=kt({},l)),t.style=kr(l))}const s=ft(e)?1:Vs(e)?128:Dc(e)?64:et(e)?4:K(e)?2:0;return m(e,t,o,n,r,s,i,!0)}function Ou(e){return e?$r(e)||Os(e)?kt({},e):e:null}function eo(e,t,o=!1,n=!1){const{props:r,ref:i,patchFlag:s,children:a,transition:l}=e,d=t?Lu(r||{},t):r,c={__v_isVNode:!0,__v_skip:!0,type:e.type,props:d,key:d&&qs(d),ref:t&&t.ref?o&&i?F(i)?i.concat(Jo(t)):[i,Jo(t)]:Jo(t):i,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:a,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==ct?s===-1?16:s|16:s,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:l,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&eo(e.ssContent),ssFallback:e.ssFallback&&eo(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce};return l&&n&&zr(c,l.clone(c)),c}function st(e=" ",t=0){return q(wn,null,e,t)}function gt(e="",t=!1){return t?(D(),vo(ke,null,e)):q(ke,null,e)}function Zt(e){return e==null||typeof e=="boolean"?q(ke):F(e)?q(ct,null,e.slice()):an(e)?fe(e):q(wn,null,String(e))}function fe(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:eo(e)}function Or(e,t){let o=0;const{shapeFlag:n}=e;if(t==null)t=null;else if(F(t))o=16;else if(typeof t=="object")if(n&65){const r=t.default;r&&(r._c&&(r._d=!1),Or(e,r()),r._c&&(r._d=!0));return}else{o=32;const r=t._;!r&&!Os(t)?t._ctx=Rt:r===3&&Rt&&(Rt.slots._===1?t._=1:(t._=2,e.patchFlag|=1024))}else K(t)?(t={default:t,_ctx:Rt},o=32):(t=String(t),n&64?(o=16,t=[st(t)]):o=8);e.children=t,e.shapeFlag|=o}function Lu(...e){const t={};for(let o=0;o<e.length;o++){const n=e[o];for(const r in n)if(r==="class")t.class!==n.class&&(t.class=vn([t.class,n.class]));else if(r==="style")t.style=kr([t.style,n.style]);else if(pn(r)){const i=t[r],s=n[r];s&&i!==s&&!(F(i)&&i.includes(s))&&(t[r]=i?[].concat(i,s):s)}else r!==""&&(t[r]=n[r])}return t}function Jt(e,t,o,n=null){te(e,t,7,[o,n])}const Pu=As();let Iu=0;function Ru(e,t,o){const n=e.type,r=(t?t.appContext:e.appContext)||Pu,i={uid:Iu++,vnode:e,type:n,parent:t,appContext:r,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new ac(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(r.provides),ids:t?t.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:Ps(n,r),emitsOptions:Hs(n,r),emit:null,emitted:null,propsDefaults:tt,inheritAttrs:n.inheritAttrs,ctx:tt,data:tt,props:tt,attrs:tt,slots:tt,refs:tt,setupState:tt,setupContext:null,suspense:o,suspenseId:o?o.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return i.ctx={_:i},i.root=t?t.root:i,i.emit=wu.bind(null,i),e.ce&&e.ce(i),i}let Ct=null;const ju=()=>Ct||Rt;let ln,ar;{const e=gn(),t=(o,n)=>{let r;return(r=e[o])||(r=e[o]=[]),r.push(n),i=>{r.length>1?r.forEach(s=>s(i)):r[0](i)}};ln=t("__VUE_INSTANCE_SETTERS__",o=>Ct=o),ar=t("__VUE_SSR_SETTERS__",o=>Mo=o)}const No=e=>{const t=Ct;return ln(e),e.scope.on(),()=>{e.scope.off(),ln(t)}},hi=()=>{Ct&&Ct.scope.off(),ln(null)};function Ks(e){return e.vnode.shapeFlag&4}let Mo=!1;function Uu(e,t=!1,o=!1){t&&ar(t);const{props:n,children:r}=e.vnode,i=Ks(e);cu(e,n,i,t),hu(e,r,o||t);const s=i?Nu(e,t):void 0;return t&&ar(!1),s}function Nu(e,t){const o=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,eu);const{setup:n}=o;if(n){se();const r=e.setupContext=n.length>1?Fu(e):null,i=No(e),s=jo(n,e,0,[e.props,r]),a=Ki(s);if(ae(),i(),(a||e.sp)&&!_o(e)&&xs(e),a){if(s.then(hi,hi),t)return s.then(l=>{fi(e,l)}).catch(l=>{kn(l,e,0)});e.asyncDep=s}else fi(e,s)}else Ws(e)}function fi(e,t,o){K(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:et(t)&&(e.setupState=gs(t)),Ws(e)}function Ws(e,t,o){const n=e.type;e.render||(e.render=n.render||Xt);{const r=No(e);se();try{ou(e)}finally{ae(),r()}}}const Du={get(e,t){return mt(e,"get",""),e[t]}};function Fu(e){const t=o=>{e.exposed=o||{}};return{attrs:new Proxy(e.attrs,Du),slots:e.slots,emit:e.emit,expose:t}}function Sn(e){return e.exposed?e.exposeProxy||(e.exposeProxy=new Proxy(gs(Ac(e.exposed)),{get(t,o){if(o in t)return t[o];if(o in xo)return xo[o](e)},has(t,o){return o in t||o in xo}})):e.proxy}function Hu(e){return K(e)&&"__vccOpts"in e}const Yo=(e,t)=>Lc(e,t,Mo);function oo(e,t,o){try{sn(-1);const n=arguments.length;return n===2?et(t)&&!F(t)?an(t)?q(e,null,[t]):q(e,t):q(e,null,t):(n>3?o=Array.prototype.slice.call(arguments,2):n===3&&an(o)&&(o=[o]),q(e,t,o))}finally{sn(1)}}const Vu="3.5.22";/**
* @vue/runtime-dom v3.5.22
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let lr;const gi=typeof window<"u"&&window.trustedTypes;if(gi)try{lr=gi.createPolicy("vue",{createHTML:e=>e})}catch{}const Gs=lr?e=>lr.createHTML(e):e=>e,Bu="http://www.w3.org/2000/svg",qu="http://www.w3.org/1998/Math/MathML",oe=typeof document<"u"?document:null,vi=oe&&oe.createElement("template"),Ku={insert:(e,t,o)=>{t.insertBefore(e,o||null)},remove:e=>{const t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,o,n)=>{const r=t==="svg"?oe.createElementNS(Bu,e):t==="mathml"?oe.createElementNS(qu,e):o?oe.createElement(e,{is:o}):oe.createElement(e);return e==="select"&&n&&n.multiple!=null&&r.setAttribute("multiple",n.multiple),r},createText:e=>oe.createTextNode(e),createComment:e=>oe.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>oe.querySelector(e),setScopeId(e,t){e.setAttribute(t,"")},insertStaticContent(e,t,o,n,r,i){const s=o?o.previousSibling:t.lastChild;if(r&&(r===i||r.nextSibling))for(;t.insertBefore(r.cloneNode(!0),o),!(r===i||!(r=r.nextSibling)););else{vi.innerHTML=Gs(n==="svg"?`<svg>${e}</svg>`:n==="mathml"?`<math>${e}</math>`:e);const a=vi.content;if(n==="svg"||n==="mathml"){const l=a.firstChild;for(;l.firstChild;)a.appendChild(l.firstChild);a.removeChild(l)}t.insertBefore(a,o)}return[s?s.nextSibling:t.firstChild,o?o.previousSibling:t.lastChild]}},Wu=Symbol("_vtc");function Gu(e,t,o){const n=e[Wu];n&&(t=(t?[t,...n]:[...n]).join(" ")),t==null?e.removeAttribute("class"):o?e.setAttribute("class",t):e.className=t}const bi=Symbol("_vod"),Ju=Symbol("_vsh"),Yu=Symbol(""),Zu=/(?:^|;)\s*display\s*:/;function Xu(e,t,o){const n=e.style,r=ft(o);let i=!1;if(o&&!r){if(t)if(ft(t))for(const s of t.split(";")){const a=s.slice(0,s.indexOf(":")).trim();o[a]==null&&Zo(n,a,"")}else for(const s in t)o[s]==null&&Zo(n,s,"");for(const s in o)s==="display"&&(i=!0),Zo(n,s,o[s])}else if(r){if(t!==o){const s=n[Yu];s&&(o+=";"+s),n.cssText=o,i=Zu.test(o)}}else t&&e.removeAttribute("style");bi in e&&(e[bi]=i?n.display:"",e[Ju]&&(n.display="none"))}const mi=/\s*!important$/;function Zo(e,t,o){if(F(o))o.forEach(n=>Zo(e,t,n));else if(o==null&&(o=""),t.startsWith("--"))e.setProperty(t,o);else{const n=Qu(e,t);mi.test(o)?e.setProperty(Ie(n),o.replace(mi,""),"important"):e[n]=o}}const yi=["Webkit","Moz","ms"],Dn={};function Qu(e,t){const o=Dn[t];if(o)return o;let n=me(t);if(n!=="filter"&&n in e)return Dn[t]=n;n=Ji(n);for(let r=0;r<yi.length;r++){const i=yi[r]+n;if(i in e)return Dn[t]=i}return t}const ki="http://www.w3.org/1999/xlink";function _i(e,t,o,n,r,i=rc(t)){n&&t.startsWith("xlink:")?o==null?e.removeAttributeNS(ki,t.slice(6,t.length)):e.setAttributeNS(ki,t,o):o==null||i&&!Xi(o)?e.removeAttribute(t):e.setAttribute(t,i?"":Qt(o)?String(o):o)}function xi(e,t,o,n,r){if(t==="innerHTML"||t==="textContent"){o!=null&&(e[t]=t==="innerHTML"?Gs(o):o);return}const i=e.tagName;if(t==="value"&&i!=="PROGRESS"&&!i.includes("-")){const a=i==="OPTION"?e.getAttribute("value")||"":e.value,l=o==null?e.type==="checkbox"?"on":"":String(o);(a!==l||!("_value"in e))&&(e.value=l),o==null&&e.removeAttribute(t),e._value=o;return}let s=!1;if(o===""||o==null){const a=typeof e[t];a==="boolean"?o=Xi(o):o==null&&a==="string"?(o="",s=!0):a==="number"&&(o=0,s=!0)}try{e[t]=o}catch{}s&&e.removeAttribute(r||t)}function Js(e,t,o,n){e.addEventListener(t,o,n)}function td(e,t,o,n){e.removeEventListener(t,o,n)}const wi=Symbol("_vei");function ed(e,t,o,n,r=null){const i=e[wi]||(e[wi]={}),s=i[t];if(n&&s)s.value=n;else{const[a,l]=od(t);if(n){const d=i[t]=id(n,r);Js(e,a,d,l)}else s&&(td(e,a,s,l),i[t]=void 0)}}const Si=/(?:Once|Passive|Capture)$/;function od(e){let t;if(Si.test(e)){t={};let n;for(;n=e.match(Si);)e=e.slice(0,e.length-n[0].length),t[n[0].toLowerCase()]=!0}return[e[2]===":"?e.slice(3):Ie(e.slice(2)),t]}let Fn=0;const nd=Promise.resolve(),rd=()=>Fn||(nd.then(()=>Fn=0),Fn=Date.now());function id(e,t){const o=n=>{if(!n._vts)n._vts=Date.now();else if(n._vts<=o.attached)return;te(sd(n,o.value),t,5,[n])};return o.value=e,o.attached=rd(),o}function sd(e,t){if(F(t)){const o=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{o.call(e),e._stopped=!0},t.map(n=>r=>!r._stopped&&n&&n(r))}else return t}const Ci=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,ad=(e,t,o,n,r,i)=>{const s=r==="svg";t==="class"?Gu(e,n,s):t==="style"?Xu(e,o,n):pn(t)?br(t)||ed(e,t,o,n,i):(t[0]==="."?(t=t.slice(1),!0):t[0]==="^"?(t=t.slice(1),!1):ld(e,t,n,s))?(xi(e,t,n),!e.tagName.includes("-")&&(t==="value"||t==="checked"||t==="selected")&&_i(e,t,n,s,i,t!=="value")):e._isVueCE&&(/[A-Z]/.test(t)||!ft(n))?xi(e,me(t),n,i,t):(t==="true-value"?e._trueValue=n:t==="false-value"&&(e._falseValue=n),_i(e,t,n,s))};function ld(e,t,o,n){if(n)return!!(t==="innerHTML"||t==="textContent"||t in e&&Ci(t)&&K(o));if(t==="spellcheck"||t==="draggable"||t==="translate"||t==="autocorrect"||t==="form"||t==="list"&&e.tagName==="INPUT"||t==="type"&&e.tagName==="TEXTAREA")return!1;if(t==="width"||t==="height"){const r=e.tagName;if(r==="IMG"||r==="VIDEO"||r==="CANVAS"||r==="SOURCE")return!1}return Ci(t)&&ft(o)?!1:t in e}const Ei=e=>{const t=e.props["onUpdate:modelValue"]||!1;return F(t)?o=>Ko(t,o):t},Hn=Symbol("_assign"),de={deep:!0,created(e,{value:t,modifiers:{number:o}},n){const r=hn(t);Js(e,"change",()=>{const i=Array.prototype.filter.call(e.options,s=>s.selected).map(s=>o?Zi(cn(s)):cn(s));e[Hn](e.multiple?r?new Set(i):i:i[0]),e._assigning=!0,bs(()=>{e._assigning=!1})}),e[Hn]=Ei(n)},mounted(e,{value:t}){$i(e,t)},beforeUpdate(e,t,o){e[Hn]=Ei(o)},updated(e,{value:t}){e._assigning||$i(e,t)}};function $i(e,t){const o=e.multiple,n=F(t);if(!(o&&!n&&!hn(t))){for(let r=0,i=e.options.length;r<i;r++){const s=e.options[r],a=cn(s);if(o)if(n){const l=typeof a;l==="string"||l==="number"?s.selected=t.some(d=>String(d)===String(a)):s.selected=sc(t,a)>-1}else s.selected=t.has(a);else if(bn(cn(s),t)){e.selectedIndex!==r&&(e.selectedIndex=r);return}}!o&&e.selectedIndex!==-1&&(e.selectedIndex=-1)}}function cn(e){return"_value"in e?e._value:e.value}const cd=kt({patchProp:ad},Ku);let Ai;function ud(){return Ai||(Ai=gu(cd))}const dd=((...e)=>{const t=ud().createApp(...e),{mount:o}=t;return t.mount=n=>{const r=hd(n);if(!r)return;const i=t._component;!K(i)&&!i.render&&!i.template&&(i.template=r.innerHTML),r.nodeType===1&&(r.textContent="");const s=o(r,!1,pd(r));return r instanceof Element&&(r.removeAttribute("v-cloak"),r.setAttribute("data-v-app","")),s},t});function pd(e){if(e instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&e instanceof MathMLElement)return"mathml"}function hd(e){return ft(e)?document.querySelector(e):e}const Lr=e=>Object.keys(e).filter((t=>t!=="__")).map((t=>{const o=e[t];return(Array.isArray(o)?o:o()).map((n=>t==="default"?n:(r=>typeof r.type=="string")(n)?((r,i)=>((r.props??={}).slot=i,r))(n,t):((r,i)=>oo("span",{style:"display: contents;",slot:i},r))(n,t)))}));function Pr(e){return Uo({name:e.name,inheritAttrs:!1,setup(t,{attrs:o,slots:n}){return()=>oo(e.tagName,o,Lr(n))}})}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Xo=globalThis,Ir=Xo.ShadowRoot&&(Xo.ShadyCSS===void 0||Xo.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Rr=Symbol(),zi=new WeakMap;let Ys=class{constructor(t,o,n){if(this._$cssResult$=!0,n!==Rr)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=o}get styleSheet(){let t=this.o;const o=this.t;if(Ir&&t===void 0){const n=o!==void 0&&o.length===1;n&&(t=zi.get(o)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&zi.set(o,t))}return t}toString(){return this.cssText}};const To=e=>new Ys(typeof e=="string"?e:e+"",void 0,Rr),_t=(e,...t)=>{const o=e.length===1?e[0]:t.reduce((n,r,i)=>n+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[i+1],e[0]);return new Ys(o,e,Rr)},fd=(e,t)=>{if(Ir)e.adoptedStyleSheets=t.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(const o of t){const n=document.createElement("style"),r=Xo.litNonce;r!==void 0&&n.setAttribute("nonce",r),n.textContent=o.cssText,e.appendChild(n)}},Mi=Ir?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let o="";for(const n of t.cssRules)o+=n.cssText;return To(o)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:gd,defineProperty:vd,getOwnPropertyDescriptor:bd,getOwnPropertyNames:md,getOwnPropertySymbols:yd,getPrototypeOf:kd}=Object,Cn=globalThis,Ti=Cn.trustedTypes,_d=Ti?Ti.emptyScript:"",xd=Cn.reactiveElementPolyfillSupport,So=(e,t)=>e,un={toAttribute(e,t){switch(t){case Boolean:e=e?_d:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=e!==null;break;case Number:o=e===null?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch{o=null}}return o}},jr=(e,t)=>!gd(e,t),Oi={attribute:!0,type:String,converter:un,reflect:!1,useDefault:!1,hasChanged:jr};Symbol.metadata??=Symbol("metadata"),Cn.litPropertyMetadata??=new WeakMap;let Ve=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,o=Oi){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(t,o),!o.noAccessor){const n=Symbol(),r=this.getPropertyDescriptor(t,n,o);r!==void 0&&vd(this.prototype,t,r)}}static getPropertyDescriptor(t,o,n){const{get:r,set:i}=bd(this.prototype,t)??{get(){return this[o]},set(s){this[o]=s}};return{get:r,set(s){const a=r?.call(this);i?.call(this,s),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Oi}static _$Ei(){if(this.hasOwnProperty(So("elementProperties")))return;const t=kd(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(So("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(So("properties"))){const o=this.properties,n=[...md(o),...yd(o)];for(const r of n)this.createProperty(r,o[r])}const t=this[Symbol.metadata];if(t!==null){const o=litPropertyMetadata.get(t);if(o!==void 0)for(const[n,r]of o)this.elementProperties.set(n,r)}this._$Eh=new Map;for(const[o,n]of this.elementProperties){const r=this._$Eu(o,n);r!==void 0&&this._$Eh.set(r,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const o=[];if(Array.isArray(t)){const n=new Set(t.flat(1/0).reverse());for(const r of n)o.unshift(Mi(r))}else t!==void 0&&o.push(Mi(t));return o}static _$Eu(t,o){const n=o.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,o=this.constructor.elementProperties;for(const n of o.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fd(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,o,n){this._$AK(t,n)}_$ET(t,o){const n=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,n);if(r!==void 0&&n.reflect===!0){const i=(n.converter?.toAttribute!==void 0?n.converter:un).toAttribute(o,n.type);this._$Em=t,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(t,o){const n=this.constructor,r=n._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const i=n.getPropertyOptions(r),s=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:un;this._$Em=r;const a=s.fromAttribute(o,i.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(t,o,n,r=!1,i){if(t!==void 0){const s=this.constructor;if(r===!1&&(i=this[t]),n??=s.getPropertyOptions(t),!((n.hasChanged??jr)(i,o)||n.useDefault&&n.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,n))))return;this.C(t,o,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,o,{useDefault:n,reflect:r,wrapped:i},s){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??o??this[t]),i!==!0||s!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(o=void 0),this._$AL.set(t,o)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[r,i]of this._$Ep)this[r]=i;this._$Ep=void 0}const n=this.constructor.elementProperties;if(n.size>0)for(const[r,i]of n){const{wrapped:s}=i,a=this[r];s!==!0||this._$AL.has(r)||a===void 0||this.C(r,void 0,i,a)}}let t=!1;const o=this._$AL;try{t=this.shouldUpdate(o),t?(this.willUpdate(o),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(o)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(o)}willUpdate(t){}_$AE(t){this._$EO?.forEach(o=>o.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(o=>this._$ET(o,this[o])),this._$EM()}updated(t){}firstUpdated(t){}};Ve.elementStyles=[],Ve.shadowRootOptions={mode:"open"},Ve[So("elementProperties")]=new Map,Ve[So("finalized")]=new Map,xd?.({ReactiveElement:Ve}),(Cn.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ur=globalThis,Li=e=>e,dn=Ur.trustedTypes,Pi=dn?dn.createPolicy("lit-html",{createHTML:e=>e}):void 0,Zs="$lit$",ve=`lit$${Math.random().toFixed(9).slice(2)}$`,Xs="?"+ve,wd=`<${Xs}>`,Pe=document,Oo=()=>Pe.createComment(""),Lo=e=>e===null||typeof e!="object"&&typeof e!="function",Nr=Array.isArray,Sd=e=>Nr(e)||typeof e?.[Symbol.iterator]=="function",Vn=`[ 	
\f\r]`,fo=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ii=/-->/g,Ri=/>/g,Ce=RegExp(`>|${Vn}(?:([^\\s"'>=/]+)(${Vn}*=${Vn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ji=/'/g,Ui=/"/g,Qs=/^(?:script|style|textarea|title)$/i,Cd=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),Y=Cd(1),jt=Symbol.for("lit-noChange"),U=Symbol.for("lit-nothing"),Ni=new WeakMap,Ae=Pe.createTreeWalker(Pe,129);function ta(e,t){if(!Nr(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Pi!==void 0?Pi.createHTML(t):t}const Ed=(e,t)=>{const o=e.length-1,n=[];let r,i=t===2?"<svg>":t===3?"<math>":"",s=fo;for(let a=0;a<o;a++){const l=e[a];let d,c,p=-1,b=0;for(;b<l.length&&(s.lastIndex=b,c=s.exec(l),c!==null);)b=s.lastIndex,s===fo?c[1]==="!--"?s=Ii:c[1]!==void 0?s=Ri:c[2]!==void 0?(Qs.test(c[2])&&(r=RegExp("</"+c[2],"g")),s=Ce):c[3]!==void 0&&(s=Ce):s===Ce?c[0]===">"?(s=r??fo,p=-1):c[1]===void 0?p=-2:(p=s.lastIndex-c[2].length,d=c[1],s=c[3]===void 0?Ce:c[3]==='"'?Ui:ji):s===Ui||s===ji?s=Ce:s===Ii||s===Ri?s=fo:(s=Ce,r=void 0);const k=s===Ce&&e[a+1].startsWith("/>")?" ":"";i+=s===fo?l+wd:p>=0?(n.push(d),l.slice(0,p)+Zs+l.slice(p)+ve+k):l+ve+(p===-2?a:k)}return[ta(e,i+(e[o]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]};class Po{constructor({strings:t,_$litType$:o},n){let r;this.parts=[];let i=0,s=0;const a=t.length-1,l=this.parts,[d,c]=Ed(t,o);if(this.el=Po.createElement(d,n),Ae.currentNode=this.el.content,o===2||o===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(r=Ae.nextNode())!==null&&l.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(const p of r.getAttributeNames())if(p.endsWith(Zs)){const b=c[s++],k=r.getAttribute(p).split(ve),y=/([.?@])?(.*)/.exec(b);l.push({type:1,index:i,name:y[2],strings:k,ctor:y[1]==="."?Ad:y[1]==="?"?zd:y[1]==="@"?Md:En}),r.removeAttribute(p)}else p.startsWith(ve)&&(l.push({type:6,index:i}),r.removeAttribute(p));if(Qs.test(r.tagName)){const p=r.textContent.split(ve),b=p.length-1;if(b>0){r.textContent=dn?dn.emptyScript:"";for(let k=0;k<b;k++)r.append(p[k],Oo()),Ae.nextNode(),l.push({type:2,index:++i});r.append(p[b],Oo())}}}else if(r.nodeType===8)if(r.data===Xs)l.push({type:2,index:i});else{let p=-1;for(;(p=r.data.indexOf(ve,p+1))!==-1;)l.push({type:7,index:i}),p+=ve.length-1}i++}}static createElement(t,o){const n=Pe.createElement("template");return n.innerHTML=t,n}}function no(e,t,o=e,n){if(t===jt)return t;let r=n!==void 0?o._$Co?.[n]:o._$Cl;const i=Lo(t)?void 0:t._$litDirective$;return r?.constructor!==i&&(r?._$AO?.(!1),i===void 0?r=void 0:(r=new i(e),r._$AT(e,o,n)),n!==void 0?(o._$Co??=[])[n]=r:o._$Cl=r),r!==void 0&&(t=no(e,r._$AS(e,t.values),r,n)),t}class $d{constructor(t,o){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:o},parts:n}=this._$AD,r=(t?.creationScope??Pe).importNode(o,!0);Ae.currentNode=r;let i=Ae.nextNode(),s=0,a=0,l=n[0];for(;l!==void 0;){if(s===l.index){let d;l.type===2?d=new Do(i,i.nextSibling,this,t):l.type===1?d=new l.ctor(i,l.name,l.strings,this,t):l.type===6&&(d=new Td(i,this,t)),this._$AV.push(d),l=n[++a]}s!==l?.index&&(i=Ae.nextNode(),s++)}return Ae.currentNode=Pe,r}p(t){let o=0;for(const n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,o),o+=n.strings.length-2):n._$AI(t[o])),o++}}class Do{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,o,n,r){this.type=2,this._$AH=U,this._$AN=void 0,this._$AA=t,this._$AB=o,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const o=this._$AM;return o!==void 0&&t?.nodeType===11&&(t=o.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,o=this){t=no(this,t,o),Lo(t)?t===U||t==null||t===""?(this._$AH!==U&&this._$AR(),this._$AH=U):t!==this._$AH&&t!==jt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Sd(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==U&&Lo(this._$AH)?this._$AA.nextSibling.data=t:this.T(Pe.createTextNode(t)),this._$AH=t}$(t){const{values:o,_$litType$:n}=t,r=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=Po.createElement(ta(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(o);else{const i=new $d(r,this),s=i.u(this.options);i.p(o),this.T(s),this._$AH=i}}_$AC(t){let o=Ni.get(t.strings);return o===void 0&&Ni.set(t.strings,o=new Po(t)),o}k(t){Nr(this._$AH)||(this._$AH=[],this._$AR());const o=this._$AH;let n,r=0;for(const i of t)r===o.length?o.push(n=new Do(this.O(Oo()),this.O(Oo()),this,this.options)):n=o[r],n._$AI(i),r++;r<o.length&&(this._$AR(n&&n._$AB.nextSibling,r),o.length=r)}_$AR(t=this._$AA.nextSibling,o){for(this._$AP?.(!1,!0,o);t!==this._$AB;){const n=Li(t).nextSibling;Li(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class En{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,o,n,r,i){this.type=1,this._$AH=U,this._$AN=void 0,this.element=t,this.name=o,this._$AM=r,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=U}_$AI(t,o=this,n,r){const i=this.strings;let s=!1;if(i===void 0)t=no(this,t,o,0),s=!Lo(t)||t!==this._$AH&&t!==jt,s&&(this._$AH=t);else{const a=t;let l,d;for(t=i[0],l=0;l<i.length-1;l++)d=no(this,a[n+l],o,l),d===jt&&(d=this._$AH[l]),s||=!Lo(d)||d!==this._$AH[l],d===U?t=U:t!==U&&(t+=(d??"")+i[l+1]),this._$AH[l]=d}s&&!r&&this.j(t)}j(t){t===U?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ad extends En{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===U?void 0:t}}class zd extends En{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==U)}}class Md extends En{constructor(t,o,n,r,i){super(t,o,n,r,i),this.type=5}_$AI(t,o=this){if((t=no(this,t,o,0)??U)===jt)return;const n=this._$AH,r=t===U&&n!==U||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,i=t!==U&&(n===U||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Td{constructor(t,o,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=o,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){no(this,t)}}const Od=Ur.litHtmlPolyfillSupport;Od?.(Po,Do),(Ur.litHtmlVersions??=[]).push("3.3.3");const Ld=(e,t,o)=>{const n=o?.renderBefore??t;let r=n._$litPart$;if(r===void 0){const i=o?.renderBefore??null;n._$litPart$=r=new Do(t.insertBefore(Oo(),i),i,void 0,o??{})}return r._$AI(e),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Dr=globalThis;let Co=class extends Ve{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ld(o,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return jt}};Co._$litElement$=!0,Co.finalized=!0,Dr.litElementHydrateSupport?.({LitElement:Co});const Pd=Dr.litElementPolyfillSupport;Pd?.({LitElement:Co});(Dr.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Id={attribute:!0,type:String,converter:un,reflect:!1,hasChanged:jr},Rd=(e=Id,t,o)=>{const{kind:n,metadata:r}=o;let i=globalThis.litPropertyMetadata.get(r);if(i===void 0&&globalThis.litPropertyMetadata.set(r,i=new Map),n==="setter"&&((e=Object.create(e)).wrapped=!0),i.set(o.name,e),n==="accessor"){const{name:s}=o;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(s,l,e,!0,a)},init(a){return a!==void 0&&this.C(s,void 0,e,a),a}}}if(n==="setter"){const{name:s}=o;return function(a){const l=this[s];t.call(this,a),this.requestUpdate(s,l,e,!0,a)}}throw Error("Unsupported decorator location: "+n)};function A(e){return(t,o)=>typeof o=="object"?Rd(e,t,o):((n,r,i)=>{const s=r.hasOwnProperty(i);return r.constructor.createProperty(i,n),s?Object.getOwnPropertyDescriptor(r,i):void 0})(e,t,o)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Re(e){return A({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const jd=(e,t,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(e,t,o),o);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function $n(e,t){return(o,n,r)=>{const i=s=>s.renderRoot?.querySelector(e)??null;return jd(o,n,{get(){return i(this)}})}}var io=e=>(t,o)=>{const n=()=>{customElements.get(e)||customElements.define(e,t)};o!==void 0?o.addInitializer(n):n()},Di=new Map;function Ud(e,t,o){const n=t.flatMap(s=>Array.isArray(s)?s:[s]).map(s=>"cssText"in s&&typeof s.cssText=="string"?s.cssText:To(s).cssText).join(`
`);if(!("adoptedStyleSheets"in Document.prototype)||typeof CSSStyleSheet>"u"){const s=o;if(!e.querySelector(`style[data-pk-adopted-styles="${s}"]`)){const a=document.createElement("style");a.dataset.pkAdoptedStyles=s,a.textContent=n,e.prepend(a)}return}const r=o;let i=Di.get(r);i||(i=new CSSStyleSheet,i.replaceSync(n),Di.set(r,i)),e.adoptedStyleSheets=[...e.adoptedStyleSheets,i]}var ea=_t`
    @layer pk-component {
        :host {
            display: inline-block;
            vertical-align: middle;
        }
    }
`;_t`
    .pk-focus-ring:focus {
        outline: none;
    }

    .pk-focus-ring:focus-visible {
        box-shadow: var(--pk-shadow-focus);
    }
`;var Nd=_t`
    @layer pk-reset {
        :host {
            box-sizing: border-box;
        }

        :host *,
        :host *::before,
        :host *::after {
            box-sizing: border-box;
        }

        :host(:not([hidden])) {
            /* Prevent UA / CP margin on unstyled custom element hosts in light DOM. */
            margin: 0;
        }
    }
`,Je,An=(Je=class extends Co{constructor(...t){super(...t),this.pkRenderFailed=!1}connectedCallback(){super.connectedCallback(),this.hasAttribute("data-pk")||this.setAttribute("data-pk","")}createRenderRoot(){const t=super.createRenderRoot();return Ud(t,[Nd],"pk-shadow-reset"),t}performUpdate(){if(!this.pkRenderFailed)try{const t=super.performUpdate();t instanceof Promise&&t.catch(o=>{this.handleRenderFailure(o)})}catch(t){this.handleRenderFailure(t)}}handleRenderFailure(t){const o=t instanceof Error?t:new Error(String(t));this.pkRenderFailed=!0,this.dispatchEvent(new CustomEvent("pk-error",{detail:{tagName:this.localName||this.tagName.toLowerCase(),message:o.message,stack:o.stack},bubbles:!0,composed:!0}));try{const n=this.renderRoot;if(n){n.textContent="";const r=document.createElement("div");r.setAttribute("part","error"),r.setAttribute("role","alert"),r.textContent="This control failed to load.",n.appendChild(r)}}catch{}}},Je.shadowRootOptions={mode:"open",delegatesFocus:!0},Je);function w(e,t,o,n){var r=arguments.length,i=r<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,o):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,o,n);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,o,i):s(t,o))||i);return r>3&&i&&Object.defineProperty(t,o,i),i}function oa(e,t="var(--pk-btn-radius, var(--pk-radius-lg))"){const o=To(e),n=To(t);return _t`
        ${o} {
            border-top-left-radius: var(--pk-bg-start-start-radius, ${n});
            border-top-right-radius: var(--pk-bg-start-end-radius, ${n});
            border-bottom-left-radius: var(--pk-bg-end-start-radius, ${n});
            border-bottom-right-radius: var(--pk-bg-end-end-radius, ${n});
        }
    `}function na(){return _t`
        :host([data-pk-group-orientation='horizontal']:not([data-pk-group-item-first]):not([data-pk-group-item-last])) {
            --pk-bg-start-start-radius: 0;
            --pk-bg-start-end-radius: 0;
            --pk-bg-end-start-radius: 0;
            --pk-bg-end-end-radius: 0;
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-item-first]:not([data-pk-group-item-last])) {
            --pk-bg-start-end-radius: 0;
            --pk-bg-end-end-radius: 0;
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-item-last]:not([data-pk-group-item-first])) {
            --pk-bg-start-start-radius: 0;
            --pk-bg-end-start-radius: 0;
        }

        :host([data-pk-group-orientation='vertical']:not([data-pk-group-item-first]):not([data-pk-group-item-last])) {
            --pk-bg-start-start-radius: 0;
            --pk-bg-start-end-radius: 0;
            --pk-bg-end-start-radius: 0;
            --pk-bg-end-end-radius: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-item-first]:not([data-pk-group-item-last])) {
            --pk-bg-end-start-radius: 0;
            --pk-bg-end-end-radius: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-item-last]:not([data-pk-group-item-first])) {
            --pk-bg-start-start-radius: 0;
            --pk-bg-start-end-radius: 0;
        }
    `}function Dd(){return _t`
        :host([data-pk-group-orientation='horizontal'][data-pk-group-join][variant='outline']),
        :host([data-pk-group-orientation='horizontal'][data-pk-group-join][variant='dashed']) {
            margin-inline-start: var(--pk-bg-horizontal-indent-outlined, 0);
            margin-block-start: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-join][variant='outline']),
        :host([data-pk-group-orientation='vertical'][data-pk-group-join][variant='dashed']) {
            margin-block-start: var(--pk-bg-vertical-indent-outlined, 0);
            margin-inline-start: 0;
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:not([variant='outline']):not([variant='dashed']):not([variant='link']):not([variant='none'])) {
            margin-inline-start: var(--pk-bg-horizontal-indent, 0);
            margin-block-start: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-join]:not([variant='outline']):not([variant='dashed']):not([variant='link']):not([variant='none'])) {
            margin-block-start: var(--pk-bg-vertical-indent, 0);
            margin-inline-start: 0;
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][data-pk-group-join][variant='primary']),
        :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][data-pk-group-join][variant='secondary']),
        :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][data-pk-group-join][variant='default']) {
            margin-inline-start: 0;
            margin-block-start: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-divider][data-pk-group-join][variant='primary']),
        :host([data-pk-group-orientation='vertical'][data-pk-group-divider][data-pk-group-join][variant='secondary']),
        :host([data-pk-group-orientation='vertical'][data-pk-group-divider][data-pk-group-join][variant='default']) {
            margin-block-start: 0;
            margin-inline-start: 0;
        }

        /* Filled variants — Craft margin gap; parent background shows through.
         * !important: outer preflight/utilities beat non-important :host margin
         * (revert-layer cannot restore shadow host values — it still specifies outer 0).
         */
        :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail][variant='primary']),
        :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail][variant='secondary']),
        :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail][variant='default']) {
            margin-inline-end: var(--pk-btn-group-gap, 1px) !important;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail][variant='primary']),
        :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail][variant='secondary']),
        :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail][variant='default']) {
            margin-block-end: var(--pk-btn-group-gap, 1px) !important;
        }
    `}function ra(e){const t=To(e);return _t`
        :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:not([data-pk-group-divider])) ${t} {
            border-left-width: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-join]:not([data-pk-group-divider])) ${t} {
            border-top-width: 0;
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-divider]:not([variant='outline']):not([variant='dashed'])) ${t} {
            border-left-width: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-divider]:not([variant='outline']):not([variant='dashed'])) ${t} {
            border-top-width: 0;
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail][variant='outline']) ${t},
        :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail][variant='dashed']) ${t} {
            border-right-width: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail][variant='outline']) ${t},
        :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail][variant='dashed']) ${t} {
            border-bottom-width: 0;
        }
    `}var ia={width:448,height:512,path:"M352 64c0-17.7-14.3-32-32-32L128 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l192 0c17.7 0 32-14.3 32-32zm96 128c0-17.7-14.3-32-32-32L32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32zM0 448c0 17.7 14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 416c-17.7 0-32 14.3-32 32zM352 320c0-17.7-14.3-32-32-32l-192 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l192 0c17.7 0 32-14.3 32-32z"},sa={width:448,height:512,path:"M448 64c0-17.7-14.3-32-32-32L32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32L32 288c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32L32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32z"},aa={width:448,height:512,path:"M288 64c0 17.7-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l224 0c17.7 0 32 14.3 32 32zm0 256c0 17.7-14.3 32-32 32L32 352c-17.7 0-32-14.3-32-32s14.3-32 32-32l224 0c17.7 0 32 14.3 32 32zM0 192c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 224c-17.7 0-32-14.3-32-32zM448 448c0 17.7-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"},la={width:448,height:512,path:"M448 64c0 17.7-14.3 32-32 32L192 96c-17.7 0-32-14.3-32-32s14.3-32 32-32l224 0c17.7 0 32 14.3 32 32zm0 256c0 17.7-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l224 0c17.7 0 32 14.3 32 32zM0 192c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 224c-17.7 0-32-14.3-32-32zM448 448c0 17.7-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"},ca={width:384,height:512,path:"M169.4 502.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 402.7 224 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 370.7-105.4-105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"},ua={width:512,height:512,path:"M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 105.4-105.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"},da={width:512,height:512,path:"M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"},pa={width:512,height:512,path:"M256 64c-56.8 0-107.9 24.7-143.1 64l47.1 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 192c-17.7 0-32-14.3-32-32L0 32C0 14.3 14.3 0 32 0S64 14.3 64 32l0 54.7C110.9 33.6 179.5 0 256 0 397.4 0 512 114.6 512 256S397.4 512 256 512c-87 0-163.9-43.4-210.1-109.7-10.1-14.5-6.6-34.4 7.9-44.6s34.4-6.6 44.6 7.9c34.8 49.8 92.4 82.3 157.6 82.3 106 0 192-86 192-192S362 64 256 64z"},ha={width:512,height:512,path:"M436.7 74.7L448 85.4 448 32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l47.9 0-7.6-7.2c-.2-.2-.4-.4-.6-.6-75-75-196.5-75-271.5 0s-75 196.5 0 271.5 196.5 75 271.5 0c8.2-8.2 15.5-16.9 21.9-26.1 10.1-14.5 30.1-18 44.6-7.9s18 30.1 7.9 44.6c-8.5 12.2-18.2 23.8-29.1 34.7-100 100-262.1 100-362 0S-25 175 75 75c99.9-99.9 261.7-100 361.7-.3z"},fa={width:384,height:512,path:"M214.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 109.3 160 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-370.7 105.4 105.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"},ga={width:512,height:512,path:"M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0-201.4 201.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3 448 192c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 96C35.8 96 0 131.8 0 176L0 432c0 44.2 35.8 80 80 80l256 0c44.2 0 80-35.8 80-80l0-80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 80c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l80 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 96z"},va={width:448,height:512,path:"M224 0c17.7 0 32 14.3 32 32l0 168.6 144-83.1c15.3-8.8 34.9-3.6 43.7 11.7s3.6 34.9-11.7 43.7L288 256 432 339.1c15.3 8.8 20.6 28.4 11.7 43.7s-28.4 20.6-43.7 11.7L256 311.4 256 480c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-168.6-144 83.1c-15.3 8.8-34.9 3.6-43.7-11.7S.7 348 16 339.1L160 256 16 172.9C.7 164-4.5 144.5 4.3 129.1S32.7 108.6 48 117.4L192 200.6 192 32c0-17.7 14.3-32 32-32z"},ba={width:384,height:512,path:"M32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l32 0 0 320-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l224 0c70.7 0 128-57.3 128-128 0-46.5-24.8-87.3-62-109.7 18.7-22.3 30-51 30-82.3 0-70.7-57.3-128-128-128L32 32zM288 160c0 35.3-28.7 64-64 64l-96 0 0-128 96 0c35.3 0 64 28.7 64 64zM128 416l0-128 128 0c35.3 0 64 28.7 64 64s-28.7 64-64 64l-128 0z"},ma={width:576,height:512,path:"M416 32l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0c17.7 0 32 14.3 32 32l0 37.5c0 25.5 10.1 49.9 28.1 67.9l22.6 22.6-22.6 22.6c-18 18-28.1 42.4-28.1 67.9l0 37.5c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0c53 0 96-43 96-96l0-37.5c0-8.5 3.4-16.6 9.4-22.6l45.3-45.3c12.5-12.5 12.5-32.8 0-45.3l-45.3-45.3c-6-6-9.4-14.1-9.4-22.6l0-37.5c0-53-43-96-96-96zM160 32c-53 0-96 43-96 96l0 37.5c0 8.5-3.4 16.6-9.4 22.6L9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l45.3 45.3c6 6 9.4 14.1 9.4 22.6L64 384c0 53 43 96 96 96l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0c-17.7 0-32-14.3-32-32l0-37.5c0-25.5-10.1-49.9-28.1-67.9L77.3 256 99.9 233.4c18-18 28.1-42.4 28.1-67.9l0-37.5c0-17.7 14.3-32 32-32l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0z"},ya={width:448,height:512,path:"M128 0C110.3 0 96 14.3 96 32l0 32-32 0C28.7 64 0 92.7 0 128l0 48 448 0 0-48c0-35.3-28.7-64-64-64l-32 0 0-32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 32-128 0 0-32c0-17.7-14.3-32-32-32zM0 224L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-192-448 0z"},ka={width:320,height:512,path:"M140.3 376.8c12.6 10.2 31.1 9.5 42.8-2.2l128-128c9.2-9.2 11.9-22.9 6.9-34.9S301.4 192 288.5 192l-256 0c-12.9 0-24.6 7.8-29.6 19.8S.7 237.5 9.9 246.6l128 128 2.4 2.2z"},_a={width:320,height:512,path:"M140.3 135.2c12.6-10.3 31.1-9.5 42.8 2.2l128 128c9.2 9.2 11.9 22.9 6.9 34.9S301.4 320 288.5 320l-256 0c-12.9 0-24.6-7.8-29.6-19.8S.7 274.5 9.9 265.4l128-128 2.4-2.2z"},xa={width:448,height:512,path:"M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z"},Fr={width:448,height:512,path:"M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"},wa={width:320,height:512,path:"M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"},Sa={width:320,height:512,path:"M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"},Ca={width:448,height:512,path:"M201.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 173.3 54.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"},Ea={width:512,height:512,path:"M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0z"},$a={width:512,height:512,path:"M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c5 5 11.8 7.5 18.8 7s13.4-4.1 17.5-9.8L379.3 179.2c7.8-10.7 5.4-25.7-5.3-33.5z"},Aa={width:512,height:512,path:"M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zm0-192a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.6 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z"},za={width:512,height:512,path:"M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM224 160a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm-8 64l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"},Ma={width:384,height:512,path:"M320 32l-8.6 0C300.4 12.9 279.7 0 256 0L128 0C104.3 0 83.6 12.9 72.6 32L64 32C28.7 32 0 60.7 0 96L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-352c0-35.3-28.7-64-64-64zM136 112c-13.3 0-24-10.7-24-24s10.7-24 24-24l112 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-112 0z"},Ta={width:512,height:512,path:"M256 0a256 256 0 1 1 0 512 256 256 0 1 1 0-512zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"},Oa={width:512,height:512,path:"M288 448l-224 0 0-224 48 0 0-64-48 0c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l224 0c35.3 0 64-28.7 64-64l0-48-64 0 0 48zm-64-96l224 0c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L224 0c-35.3 0-64 28.7-64 64l0 224c0 35.3 28.7 64 64 64z"},La={width:576,height:512,path:"M360.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm64.6 136.1c-12.5 12.5-12.5 32.8 0 45.3l73.4 73.4-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0zm-274.7 0c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 150.6 182.6c12.5-12.5 12.5-32.8 0-45.3z"},Pa={width:448,height:512,path:"M192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-200.6c0-17.4-7.1-34.1-19.7-46.2L370.6 17.8C358.7 6.4 342.8 0 326.3 0L192 0zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-16-64 0 0 16-192 0 0-256 16 0 0-64-16 0z"},Ia={width:448,height:512,path:"M256 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 210.7-41.4-41.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 242.7 256 32zM64 320c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-46.9 0-56.6 56.6c-31.2 31.2-81.9 31.2-113.1 0L110.9 320 64 320zm304 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"},Ra={width:448,height:512,path:"M0 256a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm168 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm224-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"},ja={width:512,height:512,path:"M502.6 54.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L413 53.8C369.6 20.1 315.2 0 256 0 114.6 0 0 114.6 0 256 0 315.2 20.1 369.6 53.8 413L9.4 457.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L99 458.2c43.3 33.7 97.8 53.8 157 53.8 141.4 0 256-114.6 256-256 0-59.2-20.1-113.6-53.8-157l44.4-44.4zM367.2 99.5L99.5 367.2C77.1 335.9 64 297.5 64 256 64 150 150 64 256 64 297.5 64 335.9 77.1 367.2 99.5zm-222.5 313L412.5 144.8c22.4 31.4 35.5 69.8 35.5 111.2 0 106-86 192-192 192-41.5 0-79.9-13.1-111.2-35.5z"},Ua={width:576,height:512,path:"M288 32c-80.8 0-145.5 36.8-192.6 80.6-46.8 43.5-78.1 95.4-93 131.1-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64-11.5 0-22.3-3-31.7-8.4-1 10.9-.1 22.1 2.9 33.2 13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-12.2-45.7-55.5-74.8-101.1-70.8 5.3 9.3 8.4 20.1 8.4 31.7z"},Na={width:576,height:512,path:"M272 48L160 48c-8.8 0-16 7.2-16 16l0 176-48 0 0-176c0-35.3 28.7-64 64-64L293.5 0c17 0 33.3 6.7 45.3 18.7L461.3 141.3c12 12 18.7 28.3 18.7 45.3l0 53.5-48 0 0-32-88 0c-39.8 0-72-32.2-72-72l0-88zM96 384l48 0 0 64c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16l0-64 48 0 0 64c0 35.3-28.7 64-64 64l-256 0c-35.3 0-64-28.7-64-64l0-64zM412.1 160L320 67.9 320 136c0 13.3 10.7 24 24 24l68.1 0zM24 288l112 0c13.3 0 24 10.7 24 24s-10.7 24-24 24L24 336c-13.3 0-24-10.7-24-24s10.7-24 24-24zm208 0l112 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-112 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm208 0l112 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-112 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"},Da={width:448,height:512,path:"M32 0C49.7 0 64 14.3 64 32l0 16 69-17.2c38.1-9.5 78.3-5.1 113.5 12.5 46.3 23.2 100.8 23.2 147.1 0l9.6-4.8C423.8 28.1 448 43.1 448 66.1l0 279.7c0 13.3-8.3 25.3-20.8 30l-34.7 13c-46.2 17.3-97.6 14.6-141.7-7.4-37.9-19-81.4-23.7-122.5-13.4L64 384 64 480c0 17.7-14.3 32-32 32S0 497.7 0 480L0 32C0 14.3 14.3 0 32 0zM64 187.1l64-13.9 0 65.5-64 13.9 0 65.5 48.8-12.2c5.1-1.3 10.1-2.4 15.2-3.3l0-63.9 38.9-8.4c8.3-1.8 16.7-2.5 25.1-2.1l0-64c13.6 .4 27.2 2.6 40.4 6.4l23.6 6.9 0 66.7-41.7-12.3c-7.3-2.1-14.8-3.4-22.3-3.8l0 71.4c21.8 1.9 43.3 6.7 64 14.4l0-69.8 22.7 6.7c13.5 4 27.3 6.4 41.3 7.4l0-64.2c-7.8-.8-15.6-2.3-23.2-4.5l-40.8-12 0-62c-13-3.8-25.8-8.8-38.2-15-8.2-4.1-16.9-7-25.8-8.8l0 72.4c-13-.4-26 .8-38.7 3.6l-25.3 5.5 0-75.2-64 16 0 73.1zM320 335.7c16.8 1.5 33.9-.7 50-6.8l14-5.2 0-71.7-7.9 1.8c-18.4 4.3-37.3 5.7-56.1 4.5l0 77.4zm64-149.4l0-70.8c-20.9 6.1-42.4 9.1-64 9.1l0 69.4c13.9 1.4 28 .5 41.7-2.6l22.3-5.2z"},Fa={width:448,height:512,path:"M71.3 295.6c-21.9-21.9-21.9-57.3 0-79.2s57.3-21.9 79.2 0 21.9 57.3 0 79.2s-57.4 21.9-79.2 0zM184.4 182.5c-21.9-21.9-21.9-57.3 0-79.2s57.3-21.9 79.2 0 21.9 57.3 0 79.2-57.3 21.8-79.2 0zm0 147c21.9-21.9 57.3-21.9 79.2 0s21.9 57.3 0 79.2s-57.3 21.9-79.2 0c-21.9-21.8-21.9-57.3 0-79.2zM297.5 216.4c21.9-21.9 57.3-21.9 79.2 0s21.9 57.3 0 79.2s-57.3 21.9-79.2 0c-21.8-21.9-21.8-57.3 0-79.2z"},Ha={width:512,height:512,path:"M64 224a64 64 0 1 1 0-128 64 64 0 1 1 0 128zM256 96a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm192 0a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm0 192a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM256 416a64 64 0 1 1 0-128 64 64 0 1 1 0 128zM64 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"},Va={width:320,height:512,path:"M128 64A64 64 0 1 0 0 64 64 64 0 1 0 128 64zm0 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zM0 448c0 35.3 28.7 64 64 64s64-28.7 64-64-28.7-64-64-64-64 28.7-64 64zM320 64a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zM192 256a64 64 0 1 0 128 0 64 64 0 1 0 -128 0zM320 448c0-35.3-28.7-64-64-64s-64 28.7-64 64 28.7 64 64 64 64-28.7 64-64z"},Ba={width:512,height:512,path:"M448 96c0-11.1-5.7-21.4-15.2-27.2s-21.2-6.4-31.1-1.4l-64 32c-15.8 7.9-22.2 27.1-14.3 42.9s27.1 22.2 42.9 14.3l17.7-8.8 0 236.2-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0 0-288zM64 96c0-17.7-14.3-32-32-32S0 78.3 0 96L0 416c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 128 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-128 0 0-128z"},qa={width:576,height:512,path:"M96 96c0-17.7-14.3-32-32-32S32 78.3 32 96l0 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 96 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-96 0 0-128zM368 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l81.1 0c21.5 0 38.9 17.4 38.9 38.9 0 13.9-7.5 26.8-19.6 33.8l-76.3 43.6C347.5 269.7 320 317.1 320 368.5l0 47.5c0 17.7 14.3 32 32 32l160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-128 0 0-15.5c0-28.4 15.2-54.6 39.9-68.7l76.3-43.6C532.2 237.9 552 203.8 552 166.9 552 110.1 505.9 64 449.1 64L368 64z"},Ka={width:576,height:512,path:"M96 96c0-17.7-14.3-32-32-32S32 78.3 32 96l0 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 96 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-96 0 0-128zM352 256c0 17.7 14.3 32 32 32l56 0c26.5 0 48 21.5 48 48s-21.5 48-48 48l-88 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l88 0c61.9 0 112-50.1 112-112 0-31.3-12.9-59.7-33.6-80 20.7-20.3 33.6-48.7 33.6-80 0-61.9-50.1-112-112-112l-88 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l88 0c26.5 0 48 21.5 48 48s-21.5 48-48 48l-56 0c-17.7 0-32 14.3-32 32z"},Wa={width:512,height:512,path:"M64 96c0-17.7-14.3-32-32-32S0 78.3 0 96L0 416c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 96 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-96 0 0-128zm288 0c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 44.2 35.8 80 80 80l80 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-80 0c-8.8 0-16-7.2-16-16l0-112z"},Ga={width:576,height:512,path:"M96 96c0-17.7-14.3-32-32-32S32 78.3 32 96l0 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 96 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-96 0 0-128zM352 64c-17.7 0-32 14.3-32 32l0 144c0 17.7 14.3 32 32 32l80 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-80 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l80 0c66.3 0 120-53.7 120-120S498.3 208 432 208l-48 0 0-80 120 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L352 64z"},Ja={width:512,height:512,path:"M32 64c17.7 0 32 14.3 32 32l0 128 96 0 0-128c0-17.7 14.3-32 32-32s32 14.3 32 32l0 320c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-128-96 0 0 128c0 17.7-14.3 32-32 32S0 433.7 0 416L0 96C0 78.3 14.3 64 32 64zm352 64c-17.7 0-32 14.3-32 32l0 53.5c10-3.5 20.8-5.5 32-5.5l32 0c53 0 96 43 96 96l0 48c0 53-43 96-96 96l-32 0c-53 0-96-43-96-96l0-192c0-53 43-96 96-96l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0zM352 304l0 48c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-48c0-17.7-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32z"},Ya={width:576,height:512,path:"M315 315L473.4 99.9 444.1 70.6 229 229 315 315zm-187 5l0 0 0-71.7c0-15.3 7.2-29.6 19.5-38.6L420.6 8.4C428 2.9 437 0 446.2 0 457.6 0 468.5 4.5 476.6 12.6l54.8 54.8c8.1 8.1 12.6 19 12.6 30.5 0 9.2-2.9 18.2-8.4 25.6L334.4 396.5c-9 12.3-23.4 19.5-38.6 19.5l-71.7 0-25.4 25.4c-12.5 12.5-32.8 12.5-45.3 0l-50.7-50.7c-12.5-12.5-12.5-32.8 0-45.3L128 320zM7 466.3l51.7-51.7 70.6 70.6-19.7 19.7c-4.5 4.5-10.6 7-17 7L24 512c-13.3 0-24-10.7-24-24l0-4.7c0-6.4 2.5-12.5 7-17z"},Za={width:512,height:512,path:"M277.8 8.6c-12.3-11.4-31.3-11.4-43.5 0l-224 208c-9.6 9-12.8 22.9-8 35.1S18.8 272 32 272l16 0 0 176c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-176 16 0c13.2 0 25-8.1 29.8-20.3s1.6-26.2-8-35.1l-224-208zM240 320l32 0c26.5 0 48 21.5 48 48l0 96-128 0 0-96c0-26.5 21.5-48 48-48z"},Xa={width:384,height:512,path:"M128 64c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-58.7 0-133.3 320 64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l58.7 0 133.3-320-64 0c-17.7 0-32-14.3-32-32z"},Qa={width:384,height:512,path:"M292.9 384c7.3-22.3 21.9-42.5 38.4-59.9 32.7-34.4 52.7-80.9 52.7-132.1 0-106-86-192-192-192S0 86 0 192c0 51.2 20 97.7 52.7 132.1 16.5 17.4 31.2 37.6 38.4 59.9l201.7 0zM288 432l-192 0 0 16c0 44.2 35.8 80 80 80l32 0c44.2 0 80-35.8 80-80l0-16zM184 112c-39.8 0-72 32.2-72 72 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-66.3 53.7-120 120-120 13.3 0 24 10.7 24 24s-10.7 24-24 24z"},tl={width:576,height:512,path:"M419.5 96c-16.6 0-32.7 4.5-46.8 12.7-15.8-16-34.2-29.4-54.5-39.5 28.2-24 64.1-37.2 101.3-37.2 86.4 0 156.5 70 156.5 156.5 0 41.5-16.5 81.3-45.8 110.6l-71.1 71.1c-29.3 29.3-69.1 45.8-110.6 45.8-86.4 0-156.5-70-156.5-156.5 0-1.5 0-3 .1-4.5 .5-17.7 15.2-31.6 32.9-31.1s31.6 15.2 31.1 32.9c0 .9 0 1.8 0 2.6 0 51.1 41.4 92.5 92.5 92.5 24.5 0 48-9.7 65.4-27.1l71.1-71.1c17.3-17.3 27.1-40.9 27.1-65.4 0-51.1-41.4-92.5-92.5-92.5zM275.2 173.3c-1.9-.8-3.8-1.9-5.5-3.1-12.6-6.5-27-10.2-42.1-10.2-24.5 0-48 9.7-65.4 27.1L91.1 258.2c-17.3 17.3-27.1 40.9-27.1 65.4 0 51.1 41.4 92.5 92.5 92.5 16.5 0 32.6-4.4 46.7-12.6 15.8 16 34.2 29.4 54.6 39.5-28.2 23.9-64 37.2-101.3 37.2-86.4 0-156.5-70-156.5-156.5 0-41.5 16.5-81.3 45.8-110.6l71.1-71.1c29.3-29.3 69.1-45.8 110.6-45.8 86.6 0 156.5 70.6 156.5 156.9 0 1.3 0 2.6 0 3.9-.4 17.7-15.1 31.6-32.8 31.2s-31.6-15.1-31.2-32.8c0-.8 0-1.5 0-2.3 0-33.7-18-63.3-44.8-79.6z"},el={width:384,height:512,path:"M128 96l0 64 128 0 0-64c0-35.3-28.7-64-64-64s-64 28.7-64 64zM64 160l0-64C64 25.3 121.3-32 192-32S320 25.3 320 96l0 64c35.3 0 64 28.7 64 64l0 224c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 224c0-35.3 28.7-64 64-64z"},ol={width:512,height:512,path:"M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z"},nl={width:512,height:512,path:"M0 72C0 58.8 10.7 48 24 48l48 0c13.3 0 24 10.7 24 24l0 104 24 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-96 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l24 0 0-80-24 0C10.7 96 0 85.3 0 72zM30.4 301.2C41.8 292.6 55.7 288 70 288l4.9 0c33.7 0 61.1 27.4 61.1 61.1 0 19.6-9.4 37.9-25.2 49.4l-24 17.5 33.2 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-90.7 0C13.1 464 0 450.9 0 434.7 0 425.3 4.5 416.5 12.1 411l70.5-51.3c3.4-2.5 5.4-6.4 5.4-10.6 0-7.2-5.9-13.1-13.1-13.1L70 336c-3.9 0-7.7 1.3-10.8 3.6L38.4 355.2c-10.6 8-25.6 5.8-33.6-4.8S-1 324.8 9.6 316.8l20.8-15.6zM224 64l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"},rl={width:512,height:512,path:"M48 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM48 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM96 256a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"},il={width:448,height:512,path:"M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"},sl={width:448,height:512,path:"M0 64C0 46.3 14.3 32 32 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-16 0 0 112 224 0 0-112-16 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-16 0 0 320 16 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l16 0 0-144-224 0 0 144 16 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l16 0 0-320-16 0C14.3 96 0 81.7 0 64z"},al={width:448,height:512,path:"M160 0L416 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0 0 416c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-416-48 0 0 416c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160-48 0C71.6 320 0 248.4 0 160S71.6 0 160 0z"},ll={width:512,height:512,path:"M352.9 21.2L308 66.1 445.9 204 490.8 159.1C504.4 145.6 512 127.2 512 108s-7.6-37.6-21.2-51.1L455.1 21.2C441.6 7.6 423.2 0 404 0s-37.6 7.6-51.1 21.2zM274.1 100L58.9 315.1c-10.7 10.7-18.5 24.1-22.6 38.7L.9 481.6c-2.3 8.3 0 17.3 6.2 23.4s15.1 8.5 23.4 6.2l127.8-35.5c14.6-4.1 27.9-11.8 38.7-22.6L412 237.9 274.1 100z"},cl={width:448,height:512,path:"M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"},ul={width:512,height:512,path:"M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"},dl={width:448,height:512,path:"M448 296c0 66.3-53.7 120-120 120l-8 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l8 0c30.9 0 56-25.1 56-56l0-8-64 0c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l64 0c35.3 0 64 28.7 64 64l0 136zm-256 0c0 66.3-53.7 120-120 120l-8 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l8 0c30.9 0 56-25.1 56-56l0-8-64 0c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l64 0c35.3 0 64 28.7 64 64l0 136z"},pl={width:512,height:512,path:"M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"},hl={width:512,height:512,path:"M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"},fl={width:512,height:512,path:"M307.8 18.4c-12 5-19.8 16.6-19.8 29.6l0 80-112 0c-97.2 0-176 78.8-176 176 0 113.3 81.5 163.9 100.2 174.1 2.5 1.4 5.3 1.9 8.1 1.9 10.9 0 19.7-8.9 19.7-19.7 0-7.5-4.3-14.4-9.8-19.5-9.4-8.8-22.2-26.4-22.2-56.7 0-53 43-96 96-96l96 0 0 80c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-9.2-9.2-22.9-11.9-34.9-6.9z"},gl={width:576,height:512,path:"M32 448L160 64h64l128 384h-64l-32-96H128l-32 96H32zm117.3-160h85.3L192 160l-42.7 128zM336 448l80-240h48l80 240h-48l-16-48h-80l-16 48h-48zm80-96h48l-24-72-24 72z"},vl={width:512,height:512,path:"M32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 224zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384z"},bl={width:512,height:512,path:"M0 416c0 8.8 7.2 16 16 16l65.6 0c7.4 36.5 39.7 64 78.4 64s71-27.5 78.4-64L496 432c8.8 0 16-7.2 16-16s-7.2-16-16-16l-257.6 0c-7.4-36.5-39.7-64-78.4-64s-71 27.5-78.4 64L16 400c-8.8 0-16 7.2-16 16zm112 0a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM304 256a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm48-80c-38.7 0-71 27.5-78.4 64L16 240c-8.8 0-16 7.2-16 16s7.2 16 16 16l257.6 0c7.4 36.5 39.7 64 78.4 64s71-27.5 78.4-64l65.6 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-65.6 0c-7.4-36.5-39.7-64-78.4-64zM192 144a48 48 0 1 1 0-96 48 48 0 1 1 0 96zm78.4-64C263 43.5 230.7 16 192 16s-71 27.5-78.4 64L16 80C7.2 80 0 87.2 0 96s7.2 16 16 16l97.6 0c7.4 36.5 39.7 64 78.4 64s71-27.5 78.4-64L496 112c8.8 0 16-7.2 16-16s-7.2-16-16-16L270.4 80z"},ml={width:512,height:512,path:"M96 157.5C96 88.2 152.2 32 221.5 32L368 32c17.7 0 32 14.3 32 32s-14.3 32-32 32L221.5 96c-34 0-61.5 27.5-61.5 61.5 0 31 23.1 57.2 53.9 61l44.1 5.5 222 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l83.1 0C103 204.6 96 181.8 96 157.5zM349.2 336l65.5 0c.9 6.1 1.4 12.2 1.4 18.5 0 69.3-56.2 125.5-125.5 125.5L144 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l146.5 0c34 0 61.5-27.5 61.5-61.5 0-6.4-1-12.7-2.8-18.5z"},yl={width:576,height:512,path:"M96 64C78.3 64 64 78.3 64 96s14.3 32 32 32l15.3 0 89.6 128-89.6 128-15.3 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0c10.4 0 20.2-5.1 26.2-13.6L240 311.8 325.8 434.4c6 8.6 15.8 13.6 26.2 13.6l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-15.3 0-89.6-128 89.6-128 15.3 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0c-10.4 0-20.2 5.1-26.2 13.6L240 200.2 154.2 77.6C148.2 69.1 138.4 64 128 64L96 64zM544 320c0-11.1-5.7-21.4-15.2-27.2s-21.2-6.4-31.1-1.4l-32 16c-15.8 7.9-22.2 27.1-14.3 42.9 5.6 11.2 16.9 17.7 28.6 17.7l0 80c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-128z"},kl={width:576,height:512,path:"M544 32c0-11.1-5.7-21.4-15.2-27.2s-21.2-6.4-31.1-1.4l-32 16C449.9 27.3 443.5 46.5 451.4 62.3 457 73.5 468.3 80 480 80l0 80c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-128zM96 64C78.3 64 64 78.3 64 96s14.3 32 32 32l15.3 0 89.6 128-89.6 128-15.3 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0c10.4 0 20.2-5.1 26.2-13.6L240 311.8 325.8 434.4c6 8.6 15.8 13.6 26.2 13.6l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-15.3 0-89.6-128 89.6-128 15.3 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0c-10.4 0-20.2 5.1-26.2 13.6L240 200.2 154.2 77.6C148.2 69.1 138.4 64 128 64L96 64z"},_l={width:448,height:512,path:"M384 32c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64l-320 0-6.5-.3C25.2 476.4 0 449.1 0 416L0 96C0 60.7 28.7 32 64 32l320 0zM64 320l0 96 128 0 0-96-128 0zm192 0l0 96 128 0 0-96-128 0zM64 256l128 0 0-96-128 0 0 96zm192 0l128 0 0-96-128 0 0 96z"},xl={width:576,height:512,path:"M41-24.9c-9.4-9.4-24.6-9.4-33.9 0S-2.3-.3 7 9.1l528 528c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L322.7 256.9 368.2 96 471 96 465 120.2c-4.3 17.1 6.1 34.5 23.3 38.8s34.5-6.1 38.8-23.3l11-44.1C545.6 61.3 522.7 32 491.5 32l-319 0c-19.8 0-37.3 12.1-44.5 30.1l-87-87zM180.4 114.5l4.6-18.5 116.7 0-30.8 109-90.5-90.5zM241 310.8L211.3 416 160 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-42.2 0 15.1-53.3-51.9-51.9z"},wl={width:512,height:512,path:"M256 0c14.7 0 28.2 8.1 35.2 21l216 400c6.7 12.4 6.4 27.4-.8 39.5S486.1 480 472 480L40 480c-14.1 0-27.2-7.4-34.4-19.5s-7.5-27.1-.8-39.5l216-400c7-12.9 20.5-21 35.2-21zm0 352a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.5 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z"},Sl={width:384,height:512,path:"M0 32C0 14.3 14.3 0 32 0L96 0c17.7 0 32 14.3 32 32S113.7 64 96 64l0 160c0 53 43 96 96 96s96-43 96-96l0-160c-17.7 0-32-14.3-32-32S270.3 0 288 0l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 160c0 88.4-71.6 160-160 160S32 312.4 32 224L32 64C14.3 64 0 49.7 0 32zM0 480c0-17.7 14.3-32 32-32l320 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 512c-17.7 0-32-14.3-32-32z"},Cl={width:384,height:512,path:"M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"},El={width:128,height:512,path:"M64 144a56 56 0 1 1 0-112 56 56 0 1 1 0 112zm0 224c30.9 0 56 25.1 56 56s-25.1 56-56 56-56-25.1-56-56 25.1-56 56-56zm56-112c0 30.9-25.1 56-56 56s-56-25.1-56-56 25.1-56 56-56 56 25.1 56 56z"},$l={width:512,height:512,path:"M195.1 9.5C198.1-5.3 211.2-16 226.4-16l59.8 0c15.2 0 28.3 10.7 31.3 25.5L332 79.5c14.1 6 27.3 13.7 39.3 22.8l67.8-22.5c14.4-4.8 30.2 1.2 37.8 14.4l29.9 51.8c7.6 13.2 4.9 29.8-6.5 39.9L447 233.3c.9 7.4 1.3 15 1.3 22.7s-.5 15.3-1.3 22.7l53.4 47.5c11.4 10.1 14 26.8 6.5 39.9l-29.9 51.8c-7.6 13.1-23.4 19.2-37.8 14.4l-67.8-22.5c-12.1 9.1-25.3 16.7-39.3 22.8l-14.4 69.9c-3.1 14.9-16.2 25.5-31.3 25.5l-59.8 0c-15.2 0-28.3-10.7-31.3-25.5l-14.4-69.9c-14.1-6-27.2-13.7-39.3-22.8L73.5 432.3c-14.4 4.8-30.2-1.2-37.8-14.4L5.8 366.1c-7.6-13.2-4.9-29.8 6.5-39.9l53.4-47.5c-.9-7.4-1.3-15-1.3-22.7s.5-15.3 1.3-22.7L12.3 185.8c-11.4-10.1-14-26.8-6.5-39.9L35.7 94.1c7.6-13.2 23.4-19.2 37.8-14.4l67.8 22.5c12.1-9.1 25.3-16.7 39.3-22.8L195.1 9.5zM256.3 336a80 80 0 1 0 -.6-160 80 80 0 1 0 .6 160z"},Al={width:512,height:512,path:"M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L368 46.1 465.9 144 490.3 119.6c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L432 177.9 334.1 80 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"},zl={width:448,height:512,path:"M136.7 5.9L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-8.7-26.1C306.9-7.2 294.7-16 280.9-16L167.1-16c-13.8 0-26 8.8-30.4 21.9zM416 144L32 144 53.1 467.1C54.7 492.4 75.7 512 101 512L347 512c25.3 0 46.3-19.6 47.9-44.9L416 144z"},Fd={alignCenter:ia,alignJustify:sa,alignLeft:aa,alignRight:la,arrowDown:ca,arrowLeft:ua,arrowRight:da,arrowRotateLeft:pa,arrowRotateRight:ha,arrowUp:fa,arrowUpRightFromSquare:ga,asterisk:va,bold:ba,bracketsCurly:ma,calendar:ya,caretDown:ka,caretUp:_a,check:xa,chevronDown:Fr,chevronLeft:wa,chevronRight:Sa,chevronUp:Ca,circle:Ea,circleCheck:$a,circleExclamation:Aa,circleInfo:za,clipboard:Ma,clock:Ta,clone:Oa,code:La,copy:Pa,download:Ia,ellipsis:Ra,ellipsisVertical:El,emptySet:ja,eye:Ua,fileDashedLine:Na,flagCheckered:Da,gear:$l,gripDots:Ha,gripDotsVertical:Va,gripMove:Fa,h1:Ba,h2:qa,h3:Ka,h4:Wa,h5:Ga,h6:Ja,heading:sl,highlighter:Ya,house:Za,italic:Xa,lightbulb:Qa,link:tl,lock:el,list:ol,listOl:nl,listUl:rl,minus:il,paragraph:al,pen:ll,penToSquare:Al,plus:cl,circlePlus:ul,quoteRight:dl,arrowsRotate:pl,magnifyingGlass:hl,share:fl,smallCaps:gl,sliders:vl,slidersOutline:bl,strikethrough:ml,subscript:yl,superscript:kl,table:_l,textSlash:xl,trash:zl,triangleExclamation:wl,underline:Sl,xmark:Cl},Hd=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),zn=e=>{const t=e.trim();return t&&(/[A-Z]/.test(t)?Hd(t):t.toLowerCase())},Bn="__PK_ICON_REGISTRY__",qn="__PK_ICON_REGISTRY_LISTENERS__",Mn=()=>{const e=globalThis;return e[Bn]||(e[Bn]={}),e[Bn]},Ml=()=>{const e=globalThis;return e[qn]||(e[qn]=new Set),e[qn]},Tl=()=>{for(const e of Ml())try{e()}catch{}},Vd=e=>{const t=Ml();return t.add(e),()=>{t.delete(e)}},Bd=()=>Object.keys(Mn()).sort(),qd=e=>{if(!e)return;const t=Mn();return t[zn(e)]??t[e]},Kd=(e,t)=>{const o=zn(e);if(!o)throw new Error("registerIcon: name must be a non-empty string");if(!t?.path||!t.width||!t.height)throw new Error(`registerIcon: icon "${o}" must include width, height, and path`);Mn()[o]=t,Tl()},Wd=e=>{let t=!1;for(const[o,n]of Object.entries(e)){const r=zn(o);if(!r)throw new Error("registerIcon: name must be a non-empty string");if(!n?.path||!n.width||!n.height)throw new Error(`registerIcon: icon "${r}" must include width, height, and path`);Mn()[r]=n,t=!0}t&&Tl()},Fi=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),Ol=e=>{const{width:t,height:o}=e;if(t===o)return`0 0 ${t} ${o}`;const n=Math.max(t,o);return`${(t-n)/2} ${(o-n)/2} ${n} ${n}`},Hr=(e,t={})=>{const{title:o,className:n,attributes:r={}}=t,i={xmlns:"http://www.w3.org/2000/svg",viewBox:Ol(e),overflow:"visible",...r};return n&&(i.class=n),o?(i.role="img",i["aria-label"]=o):(i["aria-hidden"]="true",i.focusable="false"),`<svg ${Object.entries(i).map(([s,a])=>`${s}="${Fi(a)}"`).join(" ")}><path fill="currentColor" d="${Fi(e.path)}"/></svg>`};const Gd=Object.freeze(Object.defineProperty({__proto__:null,alignCenter:ia,alignJustify:sa,alignLeft:aa,alignRight:la,arrowDown:ca,arrowLeft:ua,arrowRight:da,arrowRotateLeft:pa,arrowRotateRight:ha,arrowUp:fa,arrowUpRightFromSquare:ga,arrowsRotate:pl,asterisk:va,bold:ba,bracketsCurly:ma,calendar:ya,caretDown:ka,caretUp:_a,check:xa,chevronDown:Fr,chevronLeft:wa,chevronRight:Sa,chevronUp:Ca,circle:Ea,circleCheck:$a,circleExclamation:Aa,circleInfo:za,circlePlus:ul,clipboard:Ma,clock:Ta,clone:Oa,code:La,copy:Pa,download:Ia,ellipsis:Ra,ellipsisVertical:El,emptySet:ja,eye:Ua,fileDashedLine:Na,flagCheckered:Da,gear:$l,getIcon:qd,getIconNames:Bd,gripDots:Ha,gripDotsVertical:Va,gripMove:Fa,h1:Ba,h2:qa,h3:Ka,h4:Wa,h5:Ga,h6:Ja,heading:sl,highlighter:Ya,house:Za,iconToSvg:Hr,iconViewBox:Ol,icons:Fd,italic:Xa,lightbulb:Qa,link:tl,list:ol,listOl:nl,listUl:rl,lock:el,magnifyingGlass:hl,minus:il,normalizeIconName:zn,paragraph:al,pen:ll,penToSquare:Al,plus:cl,quoteRight:dl,registerIcon:Kd,registerIcons:Wd,share:fl,sliders:vl,slidersOutline:bl,smallCaps:gl,strikethrough:ml,subscribeIconRegistry:Vd,subscript:yl,superscript:kl,table:_l,textSlash:xl,trash:zl,triangleExclamation:wl,underline:Sl,xmark:Cl},Symbol.toStringTag,{value:"Module"}));var Vr=(e,t={})=>Hr(e,{title:t.title}),Jd=(e,t={})=>{const o=document.createElement("template");o.innerHTML=Vr(e,t);const n=o.content.firstElementChild;if(!(n instanceof SVGSVGElement))throw new Error("Icon render did not produce an SVG element.");return n},cr=Object.defineProperty,Yd=Object.getOwnPropertyDescriptor,Zd=Object.getOwnPropertyNames,Xd=Object.prototype.hasOwnProperty,Qd=(e,t)=>{let o={};for(var n in e)cr(o,n,{get:e[n],enumerable:!0});return cr(o,Symbol.toStringTag,{value:"Module"}),o},tp=(e,t,o,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(var r=Zd(t),i=0,s=r.length,a;i<s;i++)a=r[i],!Xd.call(e,a)&&a!==o&&cr(e,a,{get:(l=>t[l]).bind(null,a),enumerable:!(n=Yd(t,a))||n.enumerable});return e},ep=(e,t,o)=>(tp(e,t,"default"),o),op="M64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l208 0 32 0 16 0 256 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L320 64l-16 0-32 0L64 64zm512 48c8.8 0 16 7.2 16 16l0 256c0 8.8-7.2 16-16 16l-256 0 0-288 256 0zM178.3 175.9l64 144c4.5 10.1-.1 21.9-10.2 26.4s-21.9-.1-26.4-10.2L196.8 316l-73.6 0-8.9 20.1c-4.5 10.1-16.3 14.6-26.4 10.2s-14.6-16.3-10.2-26.4l64-144c3.2-7.2 10.4-11.9 18.3-11.9s15.1 4.7 18.3 11.9zM179 276l-19-42.8L141 276l38 0zM456 164c-11 0-20 9-20 20l0 4-52 0c-11 0-20 9-20 20s9 20 20 20l72 0 35.1 0c-7.3 16.7-17.4 31.9-29.8 45l-.5-.5-14.6-14.6c-7.8-7.8-20.5-7.8-28.3 0s-7.8 20.5 0 28.3L430 298.3c-5.9 3.6-12.1 6.9-18.5 9.8l-3.6 1.6c-10.1 4.5-14.6 16.3-10.2 26.4s16.3 14.6 26.4 10.2l3.6-1.6c12-5.3 23.4-11.8 34-19.4c4.3 3 8.6 5.8 13.1 8.5l18.9 11.3c9.5 5.7 21.8 2.6 27.4-6.9s2.6-21.8-6.9-27.4l-18.9-11.3c-.9-.5-1.8-1.1-2.7-1.6c17.2-18.8 30.7-40.9 39.6-65.4L534 228l2 0c11 0 20-9 20-20s-9-20-20-20l-16 0-44 0 0-4c0-11-9-20-20-20z",np=()=>{const e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("aria-hidden","true"),e.setAttribute("xmlns","http://www.w3.org/2000/svg"),e.setAttribute("viewBox","0 0 640 512");const t=document.createElementNS("http://www.w3.org/2000/svg","path");return t.setAttribute("d",op),e.append(t),e},Ll=Qd({createIconElement:()=>Jd,createTranslationIconElement:()=>np,renderIconHtml:()=>Vr});ep(Ll,Gd);function rp(e="default"){return e==="xxs"||e==="xs"?"xxs":e==="lg"||e==="xl"?"sm":"xs"}function ip(e="default",t){return t||(e==="primary"||e==="secondary"||e==="dashed"||e==="outline"||e==="transparent"?e:"default")}var sp=[ea,_t`
        @layer pk-component {
            :host {
                display: block;
                box-sizing: border-box;
            }

            :host([centered]) {
                position: absolute;
                top: 50%;
                left: 50%;
                display: block;
                width: fit-content;
                height: fit-content;
                margin: 0;
                transform: translate(-50%, -50%);
            }

            .spinner {
                display: block;
                box-sizing: border-box;
                margin-inline: auto;
                border-style: solid;
                border-bottom-color: transparent;
                border-left-color: transparent;
                border-radius: 50%;
                animation: pk-spinner-spin 0.5s linear infinite;
            }

            /* Sizes */
            :host([size='xxs']) .spinner {
                width: 0.75rem;
                height: 0.75rem;
                border-width: 1px;
            }

            :host([size='xs']) .spinner {
                width: 1rem;
                height: 1rem;
                border-width: 2px;
            }

            :host([size='sm']) .spinner,
            :host(:not([size])) .spinner {
                width: 1.5rem;
                height: 1.5rem;
                border-width: 2px;
            }

            :host([size='md']) .spinner {
                width: 2rem;
                height: 2rem;
                border-width: 2px;
            }

            :host([size='lg']) .spinner {
                width: 3rem;
                height: 3rem;
                border-width: 2px;
            }

            :host([size='xl']) .spinner {
                width: 4rem;
                height: 4rem;
                border-width: 2px;
            }

            /* Variants — matched to button loading contrast */
            :host([variant='default']:not([tone])) .spinner {
                border-top-color: var(--pk-color-red-500);
                border-right-color: var(--pk-color-red-500);
            }

            :host([variant='primary']:not([tone])) .spinner,
            :host([variant='secondary']:not([tone])) .spinner {
                border-top-color: var(--pk-color-white);
                border-right-color: var(--pk-color-white);
            }

            :host([variant='dashed']:not([tone])) .spinner,
            :host([variant='outline']:not([tone])) .spinner,
            :host([variant='transparent']:not([tone])) .spinner {
                border-top-color: var(--pk-color-gray-700);
                border-right-color: var(--pk-color-gray-700);
            }

            /* Standalone tone overrides */
            :host([tone='sky']) .spinner {
                border-top-color: var(--pk-color-sky-600);
                border-right-color: var(--pk-color-sky-600);
            }

            :host([tone='emerald']) .spinner {
                border-top-color: var(--pk-color-emerald-600);
                border-right-color: var(--pk-color-emerald-600);
            }

            :host([tone='violet']) .spinner {
                border-top-color: var(--pk-color-violet-600);
                border-right-color: var(--pk-color-violet-600);
            }

            :host([tone='amber']) .spinner {
                border-top-color: var(--pk-color-amber-500);
                border-right-color: var(--pk-color-amber-500);
            }

            @keyframes pk-spinner-spin {
                to {
                    transform: rotate(360deg);
                }
            }
        }
    `],Ye,ro=(Ye=class extends An{constructor(...t){super(...t),this.variant="default",this.size="sm",this.centered=!1}render(){return Y`
            <div part="base" class="spinner" aria-hidden="true"></div>
        `}},Ye.styles=sp,Ye);w([A({reflect:!0})],ro.prototype,"variant",void 0);w([A({reflect:!0})],ro.prototype,"size",void 0);w([A({reflect:!0})],ro.prototype,"tone",void 0);w([A({type:Boolean,reflect:!0})],ro.prototype,"centered",void 0);ro=w([io("pk-spinner")],ro);var ap=_t`
    @layer pk-component {
        slot[name='start']::slotted(svg),
        slot[name='end']::slotted(svg) {
            display: block;
            width: 1em;
            height: 1em;
            flex-shrink: 0;
            pointer-events: none;
            vertical-align: middle;
            overflow: visible;
        }
    }
`;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ge={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},Br=e=>(...t)=>({_$litDirective$:e,values:t});class qr{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,o,n){this._$Ct=t,this._$AM=o,this._$Ci=n}_$AS(t,o){return this.update(t,o)}update(t,o){return this.render(...o)}}/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ze=Br(class extends qr{constructor(e){if(super(e),e.type!==ge.ATTRIBUTE||e.name!=="class"||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(n=>n!=="")));for(const n in t)t[n]&&!this.nt?.has(n)&&this.st.add(n);return this.render(t)}const o=e.element.classList;for(const n of this.st)n in t||(o.remove(n),this.st.delete(n));for(const n in t){const r=!!t[n];r===this.st.has(n)||this.nt?.has(n)||(r?(o.add(n),this.st.add(n)):(o.remove(n),this.st.delete(n)))}return jt}});/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ur extends qr{constructor(t){if(super(t),this.it=U,t.type!==ge.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===U||t==null)return this._t=void 0,this.it=t;if(t===jt)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const o=[t];return o.raw=o,this._t={_$litType$:this.constructor.resultType,strings:o,values:[]}}}ur.directiveName="unsafeHTML",ur.resultType=1;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class dr extends ur{}dr.directiveName="unsafeSVG",dr.resultType=2;const Pl=Br(dr);var lp=[ea,ap,na(),oa(".button"),Dd(),ra(".button"),_t`
        @layer pk-component {
            :host {
                font-family: var(--pk-font-family);
                cursor: pointer;
                --pk-btn-height: var(--pk-btn-height-default);
                --pk-btn-font: var(--pk-btn-font-default);
                --pk-btn-padding-inline: var(--pk-btn-padding-inline-default);
                --pk-btn-icon-size: var(--pk-btn-icon-size-default);
                --pk-btn-icon-gap: var(--pk-btn-icon-gap-default);
                --pk-btn-caret-size: var(--pk-btn-caret-size-default);
                --pk-btn-radius: var(--pk-btn-radius-default);
                /*
                 * Slotted labels inherit from the host — pin the size-token font
                 * (and button line-height) so Craft CP / Tailwind hosts match.
                 */
                font-size: var(--pk-btn-font);
                line-height: 1.2;
            }

            :host([disabled]) {
                cursor: not-allowed;
                pointer-events: none;
            }

            :host([loading]):not([disabled]) {
                pointer-events: none;
            }

            .button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: var(--pk-btn-icon-gap);
                box-sizing: border-box;
                width: auto;
                margin: 0;
                /* Every button carries a 1px border (transparent for fill/plain variants) so the box
                 * model is identical across variants and states. Prevents width shift when swapping a
                 * button between filled and outline/dashed, or toggling states. Matches Bootstrap
                 * (transparent baseline) and  (border always present, only color changes).
                 */
                border: 1px solid transparent;
                border-radius: var(--pk-btn-radius);
                font: inherit;
                font-size: var(--pk-btn-font);
                font-weight: 400;
                line-height: 1.2;
                text-decoration: none;
                white-space: nowrap;
                /* Inherit host cursor so className/style (e.g. cursor-move) pierce shadow. */
                cursor: inherit;
                user-select: none;
                vertical-align: middle;
                appearance: none;
                background: var(--pk-btn-fill, var(--pk-action-fill));
                color: var(--pk-btn-on, var(--pk-action-on));
                height: var(--pk-btn-height);
                min-height: var(--pk-btn-height);
                /* Block padding defaults to 0 (height tokens center content). Override for nav rows. */
                padding-block: var(--pk-btn-padding-block, 0);
                padding-inline: var(--pk-btn-padding-inline);
                transition: background-color 0.12s ease, box-shadow 0.12s ease, color 0.12s ease;
            }

            .button:disabled {
                opacity: 0.5;
            }

            .icon-slot {
                display: none;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                line-height: 0;
            }

            .icon-slot--has-content {
                display: inline-flex;
            }

            /* Fixed token sizes for all icons (labeled or icon-only) — matches plugin-kit-react Button. */
            .icon-slot slot::slotted(svg),
            slot[name='start']::slotted(svg),
            slot[name='end']::slotted(svg) {
                display: block;
                width: var(--pk-btn-icon-size);
                height: var(--pk-btn-icon-size);
                flex-shrink: 0;
                pointer-events: none;
            }

            .icon-slot slot::slotted(img),
            slot[name='start']::slotted(img),
            slot[name='end']::slotted(img) {
                display: block;
                width: var(--pk-btn-icon-size);
                height: var(--pk-btn-icon-size);
                object-fit: contain;
                flex-shrink: 0;
                pointer-events: none;
            }

            /* pk-icon sizes itself from font-size (1em), so scale it to the
             * icon token. This keeps the idiomatic slotted pk-icon usage in
             * sync with raw slotted svg. Set width/height explicitly — %/size-full
             * collapses when the icon-slot has no definite box.
             */
            .icon-slot slot::slotted(pk-icon),
            slot[name='start']::slotted(pk-icon),
            slot[name='end']::slotted(pk-icon) {
                font-size: var(--pk-btn-icon-size);
                width: var(--pk-btn-icon-size);
                height: var(--pk-btn-icon-size);
                /* Kill pk-icon's text-baseline nudge (-0.125em) — flex slots center optically. */
                vertical-align: 0;
                flex-shrink: 0;
                pointer-events: none;
            }

            .label {
                display: inline-flex;
                align-items: center;
                min-width: 0;
                line-height: 1.2;
            }

            /* Trailing slot (status): grow + clip the label so end sits at the far edge
             * and long titles truncate instead of colliding with the indicator.
             */
            .button:has(.icon-slot--end.icon-slot--has-content) .label:not(.is-empty) {
                flex: 1 1 auto;
                overflow: hidden;
            }

            .label.is-empty {
                display: none;
            }

            /* Icon-only (no label): square hit box = size height. Button owns the target;
             * glyph size comes from --pk-btn-icon-size. Do not Tailwind-size the Icon.
             * Opt out with icon (compact), size=none, or group-trigger (narrow disclosure cap).
             */
            :host(:not([icon]):not([size='none']):not([group-trigger])) .button:not(.has-label) {
                width: var(--pk-btn-height);
                min-width: var(--pk-btn-height);
                padding-inline: 0;
            }

            /* Compact density (icon attr): padless box that hugs the glyph.
             * size still drives --pk-btn-icon-size; height/width tiers do not apply.
             * Use for dense x / ellipsis in cells — not for table action rows (prefer square above).
             * line-height: 0 collapses whitespace flex-struts so the glyph sits dead-center.
             */
            :host([icon]) {
                display: inline-flex;
                line-height: 0;
                vertical-align: middle;
            }

            :host([icon]) .button {
                display: flex;
                width: auto;
                min-width: 0;
                height: auto;
                min-height: 0;
                padding-inline: 0.25rem;
                padding-block: 0;
                line-height: 0;
                align-items: center;
                justify-content: center;
            }

            /* Keep label space while loading even before slotchange runs. */
            .button.loading .label.is-empty {
                display: inline-flex;
                visibility: hidden;
            }

            /* Sizes — token-driven scale (see tokens.css) */
            :host([size='xxs']) {
                --pk-btn-height: var(--pk-btn-height-xxs);
                --pk-btn-font: var(--pk-btn-font-xxs);
                --pk-btn-padding-inline: var(--pk-btn-padding-inline-xxs);
                --pk-btn-icon-size: var(--pk-btn-icon-size-xxs);
                --pk-btn-icon-gap: var(--pk-btn-icon-gap-xxs);
                --pk-btn-caret-size: var(--pk-btn-caret-size-xxs);
                --pk-btn-radius: var(--pk-btn-radius-xxs);
            }

            :host([size='xs']) {
                --pk-btn-height: var(--pk-btn-height-xs);
                --pk-btn-font: var(--pk-btn-font-xs);
                --pk-btn-padding-inline: var(--pk-btn-padding-inline-xs);
                --pk-btn-icon-size: var(--pk-btn-icon-size-xs);
                --pk-btn-icon-gap: var(--pk-btn-icon-gap-xs);
                --pk-btn-caret-size: var(--pk-btn-caret-size-xs);
                --pk-btn-radius: var(--pk-btn-radius-xs);
            }

            :host([size='sm']) {
                --pk-btn-height: var(--pk-btn-height-sm);
                --pk-btn-font: var(--pk-btn-font-sm);
                --pk-btn-padding-inline: var(--pk-btn-padding-inline-sm);
                --pk-btn-icon-size: var(--pk-btn-icon-size-sm);
                --pk-btn-icon-gap: var(--pk-btn-icon-gap-sm);
                --pk-btn-caret-size: var(--pk-btn-caret-size-sm);
                --pk-btn-radius: var(--pk-btn-radius-sm);
            }

            :host([size='default']) {
                --pk-btn-height: var(--pk-btn-height-default);
                --pk-btn-font: var(--pk-btn-font-default);
                --pk-btn-padding-inline: var(--pk-btn-padding-inline-default);
                --pk-btn-icon-size: var(--pk-btn-icon-size-default);
                --pk-btn-icon-gap: var(--pk-btn-icon-gap-default);
                --pk-btn-caret-size: var(--pk-btn-caret-size-default);
                --pk-btn-radius: var(--pk-btn-radius-default);
            }

            :host([size='lg']) {
                --pk-btn-height: var(--pk-btn-height-lg);
                --pk-btn-font: var(--pk-btn-font-lg);
                --pk-btn-padding-inline: var(--pk-btn-padding-inline-lg);
                --pk-btn-icon-size: var(--pk-btn-icon-size-lg);
                --pk-btn-icon-gap: var(--pk-btn-icon-gap-lg);
                --pk-btn-caret-size: var(--pk-btn-caret-size-lg);
                --pk-btn-radius: var(--pk-btn-radius-lg);
            }

            :host([size='xl']) {
                --pk-btn-height: var(--pk-btn-height-xl);
                --pk-btn-font: var(--pk-btn-font-xl);
                --pk-btn-padding-inline: var(--pk-btn-padding-inline-xl);
                --pk-btn-icon-size: var(--pk-btn-icon-size-xl);
                --pk-btn-icon-gap: var(--pk-btn-icon-gap-xl);
                --pk-btn-caret-size: var(--pk-btn-caret-size-xl);
                --pk-btn-radius: var(--pk-btn-radius-xl);
            }

            /* No preset scale — size to content or set --pk-btn-* on the host for one-off dimensions
             * (height, padding, font, icon, radius) without fighting a named size tier.
             * Pair with icon for a padless glyph host, or set --pk-btn-padding-inline / --pk-btn-height yourself.
             */
            :host([size='none']) {
                --pk-btn-height: auto;
                --pk-btn-font: inherit;
                --pk-btn-padding-inline: 0px;
                --pk-btn-padding-block: 0px;
                --pk-btn-icon-size: 1em;
                --pk-btn-icon-gap: 0px;
                --pk-btn-caret-size: 1em;
                --pk-btn-radius: 0px;
            }

            :host([size='none']) .button {
                height: auto;
                min-height: auto;
                width: 100%;
            }

            /* Variants */
            :host([variant='default']) {
                --pk-btn-fill: var(--pk-action-fill);
                --pk-btn-fill-hover: var(--pk-action-fill-hover);
                --pk-btn-fill-active: var(--pk-action-fill-active);
                --pk-btn-on: var(--pk-action-on);
            }

            :host([variant='primary']) {
                --pk-btn-fill: var(--pk-action-primary-fill);
                --pk-btn-fill-hover: var(--pk-action-primary-fill-hover);
                --pk-btn-fill-active: var(--pk-action-primary-fill-active);
                --pk-btn-on: var(--pk-action-primary-on);
            }

            :host([variant='primary']) .button,
            :host([variant='secondary']) .button {
                -moz-osx-font-smoothing: grayscale;
                -webkit-font-smoothing: antialiased;
            }

            :host([variant='secondary']) {
                --pk-btn-fill: var(--pk-color-gray-500);
                --pk-btn-fill-hover: var(--pk-color-gray-550);
                --pk-btn-fill-active: var(--pk-color-gray-600);
                --pk-btn-on: var(--pk-color-white);
            }

            :host([variant='outline']) .button {
                background: transparent;
                border-color: var(--pk-color-slate-400);
                color: var(--pk-color-gray-700);
            }

            :host([variant='transparent']) .button {
                background: transparent;
                color: var(--pk-color-gray-700);
            }

            /* link/none opt out of the shared transparent 1px border: they never render a border, so
             * carrying one only pads the box by 2px inline (and 2px block at size='none', where height
             * is auto). These are the "inline text" / "no chrome" variants — content-sized is the point,
             * and neither participates in button-group border joins. Other variants keep the stable box.
             */
            /*
             * Craft CP sets --link-color on :root (inherits into shadow). Prefer that,
             * then kit --pk-color-link — not sky-700 (reads as a different “CP blue”).
             * Color on :host so consumer utilities (e.g. text-[var(--link-color)]) can override.
             * Height must be content-sized — default --pk-btn-height (34px) bloated table rows.
             */
            :host([variant='link']) {
                color: var(--link-color, var(--pk-color-link));
                --pk-btn-height: auto;
                --pk-btn-padding-inline: 0;
                --pk-btn-padding-block: 0;
            }

            :host([variant='link']) .button {
                background: transparent;
                border-width: 0;
                border-radius: 0;
                color: inherit;
                width: auto;
                height: auto;
                min-height: 0;
                padding: 0;
                text-underline-offset: 2px;
            }

            :host([variant='dashed']) .button {
                background: transparent;
                border-style: dashed;
                border-color: var(--pk-color-slate-500);
                color: var(--pk-color-gray-700);
            }

            :host([variant='none']) .button {
                border-width: 0;
                border-radius: 0;
                background: transparent;
                color: inherit;
            }

            /* Interaction — pseudo-classes only; playground matrices use dev/pk-button-demo-states.css */
            .button:hover:not(:disabled) {
                background: var(--pk-btn-fill-hover, var(--pk-btn-fill));
            }

            :host([variant='outline']) .button:hover:not(:disabled),
            :host([variant='transparent']) .button:hover:not(:disabled),
            :host([variant='dashed']) .button:hover:not(:disabled) {
                background: var(--pk-color-slate-150);
            }

            :host([variant='link']) .button:hover:not(:disabled) {
                background: transparent;
                text-decoration: underline;
            }

            :host([variant='none']) .button:hover:not(:disabled) {
                background: transparent;
            }

            .button:active:not(:disabled) {
                background: var(--pk-btn-fill-active, var(--pk-btn-fill-hover, var(--pk-btn-fill)));
            }

            :host([variant='outline']) .button:active:not(:disabled),
            :host([variant='transparent']) .button:active:not(:disabled),
            :host([variant='dashed']) .button:active:not(:disabled) {
                background: var(--pk-color-slate-200);
            }

            :host([variant='link']) .button:active:not(:disabled),
            :host([variant='none']) .button:active:not(:disabled) {
                background: transparent;
            }

            .button:focus {
                outline: none;
            }

            .button:focus-visible {
                box-shadow: var(--pk-shadow-focus);
            }

            /* Bordered variants: fold the button's own border into the focus ring by recoloring it to
             * the accent (and solidifying dashed) so focus reads as one cohesive ring instead of a
             * doubled border. The ring is thinned to 1px here because the recolored 1px border already
             * supplies the other half — total 2px, matching the filled variants' ring weight.
             */
            :host([variant='outline']) .button:focus-visible,
            :host([variant='dashed']) .button:focus-visible {
                border-color: var(--pk-color-sky-600);
                box-shadow: 0 0 0 1px var(--pk-color-sky-600), 0 0 5px 1px hsl(from var(--pk-color-sky-600) h s l / 0.7);
            }

            :host([variant='dashed']) .button:focus-visible {
                border-style: solid;
            }

            :host(.pk-dialog__close) .button:focus-visible {
                box-shadow: 0 0 0 2px var(--pk-color-gray-600);
            }

            :host-context(pk-button-group) {
                position: relative;
            }

            :host-context(pk-button-group[orientation='vertical']) {
                display: block;
                width: 100%;
                max-width: 100%;
                box-sizing: border-box;
            }

            :host-context(pk-button-group[orientation='vertical']) .button {
                width: 100%;
                box-sizing: border-box;
            }

            :host-context(pk-button-group:focus-visible) {
                z-index: 2;
            }

            /* Bordered variants — matching border divider (filled uses margin gap via buttonGroupIndentStyles) */

            :host([variant='primary']) .button:focus-visible,
            :host([variant='secondary']) .button:focus-visible {
                box-shadow: var(--pk-shadow-focus-inset);
            }

            :host-context(pk-button-group[exclusive]):host([aria-pressed='true']) .button {
                background: var(--pk-color-gray-500);
                color: var(--pk-color-white);
            }

            :host-context(pk-button-group[exclusive]):host([aria-pressed='true']) .button:hover:not(:disabled) {
                background: var(--pk-color-gray-550);
            }

            :host-context(pk-button-group[exclusive]):host([aria-pressed='true']) .button:active:not(:disabled) {
                background: var(--pk-color-gray-600);
            }

            :host-context(pk-button-group[exclusive]):host([aria-pressed='true']) .button:focus-visible {
                box-shadow: var(--pk-shadow-focus);
            }

            :host([variant='link']) .button:focus-visible {
                box-shadow: none;
                text-decoration: underline;
            }

            .button.loading {
                position: relative;
                cursor: default;
                pointer-events: none;
            }

            .label.loading {
                visibility: hidden;
            }

            .button.loading .icon-slot,
            .button.loading slot[name='start']::slotted(*),
            .button.loading slot[name='end']::slotted(*) {
                visibility: hidden;
            }

            .button.caret .icon-slot--end.icon-slot--has-content {
                display: none;
            }

            /* Scope to the caret span — the button host also gets class caret when
               with-caret is set; an unscoped .caret rule was adding 2px margin
               to the whole button and shifting dropdown anchors left. */
            .button > .caret {
                display: inline-flex;
                align-self: center;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                line-height: 0;
                /* Sits slightly further from the label than the flex gap alone. */
                margin-inline-start: 2px;
            }

            /* Caret has its own per-size token (--pk-btn-caret-size), kept deliberately smaller than
             * --pk-btn-icon-size so it reads as a subordinate dropdown affordance next to real icons.
             */
            .button > .caret svg {
                display: block;
                width: var(--pk-btn-caret-size);
                height: var(--pk-btn-caret-size);
            }

            :host([group-trigger]) .button {
                padding-inline: 6px;
            }

            /* Compact disclosure cap — hide content, keep only the shared SVG caret (centered). */
            :host([group-trigger]) .label,
            :host([group-trigger]) .icon-slot {
                display: none;
            }

            :host([group-trigger]) .button > .caret {
                margin-inline-start: 0;
            }

            :host([size='sm'][group-trigger]) .button,
            :host([size='xs'][group-trigger]) .button,
            :host([size='xxs'][group-trigger]) .button {
                padding-inline: 6px;
            }

            :host([size='lg'][group-trigger]) .button {
                padding-inline: 10px;
            }

            :host([size='xl'][group-trigger]) .button {
                padding-inline: 12px;
            }

            :host-context(pk-button-group[orientation='horizontal']):host([data-pk-group-join]:not([data-pk-group-divider])[variant='outline']) .button,
            :host-context(pk-button-group[orientation='horizontal']):host([data-pk-group-join]:not([data-pk-group-divider])[variant='dashed']) .button,
            :host-context(pk-button-group[orientation='horizontal']):host([data-pk-group-join]:not([data-pk-group-divider])[variant='transparent']) .button {
                border-left-width: 0;
            }

            :host-context(pk-button-group[orientation='vertical']):host([data-pk-group-join]:not([data-pk-group-divider])[variant='outline']) .button,
            :host-context(pk-button-group[orientation='vertical']):host([data-pk-group-join]:not([data-pk-group-divider])[variant='dashed']) .button,
            :host-context(pk-button-group[orientation='vertical']):host([data-pk-group-join]:not([data-pk-group-divider])[variant='transparent']) .button {
                border-top-width: 0;
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:not([data-pk-group-divider])[variant='outline']) .button,
            :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:not([data-pk-group-divider])[variant='dashed']) .button,
            :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:not([data-pk-group-divider])[variant='transparent']) .button {
                border-left-width: 0;
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-join]:not([data-pk-group-divider])[variant='outline']) .button,
            :host([data-pk-group-orientation='vertical'][data-pk-group-join]:not([data-pk-group-divider])[variant='dashed']) .button,
            :host([data-pk-group-orientation='vertical'][data-pk-group-join]:not([data-pk-group-divider])[variant='transparent']) .button {
                border-top-width: 0;
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][variant='outline']) .button {
                box-shadow: none;
                border-left-width: 1px;
                border-left-style: solid;
                border-left-color: var(--pk-btn-group-divider-color-outline, var(--pk-color-slate-400));
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-divider][variant='outline']) .button {
                box-shadow: none;
                border-top-width: 1px;
                border-top-style: solid;
                border-top-color: var(--pk-btn-group-divider-color-outline, var(--pk-color-slate-400));
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][variant='dashed']) .button {
                box-shadow: none;
                border-left-width: 1px;
                border-left-style: dashed;
                border-left-color: var(--pk-btn-group-divider-color-dashed, var(--pk-color-slate-500));
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-divider][variant='dashed']) .button {
                box-shadow: none;
                border-top-width: 1px;
                border-top-style: dashed;
                border-top-color: var(--pk-btn-group-divider-color-dashed, var(--pk-color-slate-500));
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][variant='outline']) .button:focus-visible,
            :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][variant='dashed']) .button:focus-visible {
                box-shadow: var(--pk-shadow-focus);
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-divider][variant='outline']) .button:focus-visible,
            :host([data-pk-group-orientation='vertical'][data-pk-group-divider][variant='dashed']) .button:focus-visible {
                box-shadow: var(--pk-shadow-focus);
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail][variant='outline']) .button,
            :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail][variant='dashed']) .button {
                border-right-width: 0;
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail][variant='outline']) .button,
            :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail][variant='dashed']) .button {
                border-bottom-width: 0;
            }
        }
    `],cp=Hr(Fr),Oe,ut=(Oe=class extends An{constructor(...t){super(...t),this.variant="default",this.size="default",this.disabled=!1,this.loading=!1,this.withCaret=!1,this.groupTrigger=!1,this.icon=!1,this.title="",this.type="button",this.hasDefaultSlotContent=!1,this.hasStartSlotContent=!1,this.hasEndSlotContent=!1,this.startSlotChanged=o=>{this.iconSlotChanged(o,"start")},this.endSlotChanged=o=>{this.iconSlotChanged(o,"end")},this.handleHostClick=o=>{if(this.disabled||this.loading||this.href||this.type!=="submit"&&this.type!=="reset")return;const n=this.resolveAssociatedForm();if(n){if(o.preventDefault(),o.stopPropagation(),this.type==="reset"){n.reset();return}if(typeof n.requestSubmit=="function"){n.requestSubmit();return}n.dispatchEvent(new Event("submit",{bubbles:!0,cancelable:!0}))}}}defaultSlotChanged(t){const o=t.target;this.hasDefaultSlotContent=o.assignedNodes({flatten:!0}).some(n=>n.nodeType===Node.TEXT_NODE?n.textContent?.trim():n.nodeType===Node.ELEMENT_NODE)}iconSlotChanged(t,o){const n=t.target.assignedNodes({flatten:!0}).some(r=>r.nodeType===Node.TEXT_NODE?r.textContent?.trim():r.nodeType===Node.ELEMENT_NODE);o==="start"?this.hasStartSlotContent=n:this.hasEndSlotContent=n}buttonClasses(){return ze({button:!0,"has-label":this.hasDefaultSlotContent,loading:this.loading,caret:this.withCaret,"group-trigger":this.groupTrigger})}connectedCallback(){super.connectedCallback(),this.setAttribute("data-slot","button"),this.addEventListener("click",this.handleHostClick)}disconnectedCallback(){this.removeEventListener("click",this.handleHostClick),super.disconnectedCallback()}resolveAssociatedForm(){const t=(this.form||this.getAttribute("form")||"").trim();if(t){const n=this.ownerDocument?.getElementById(t);if(n instanceof HTMLFormElement&&n.id!=="main")return n}const o=this.closest("form");return o&&o.id!=="main"?o:null}render(){const t=this.spinnerSize||rp(this.size),o=ip(this.variant,this.spinnerVariant);return Y`
            ${this.href?Y`
                    <a
                        part="base"
                        class=${this.buttonClasses()}
                        href=${this.href}
                        target=${this.target??U}
                        rel=${this.rel??U}
                        title=${this.title||U}
                    >
                        ${this.renderInner(t,o)}
                    </a>
                `:Y`
                    <button
                        part="base"
                        class=${this.buttonClasses()}
                        type=${this.type}
                        ?disabled=${this.disabled}
                        aria-disabled=${this.disabled?"true":U}
                        aria-busy=${this.loading?"true":U}
                        name=${this.name??U}
                        value=${this.value??U}
                        title=${this.title||U}
                    >
                        ${this.renderInner(t,o)}
                    </button>
                `}
        `}renderInner(t,o){return Y`
            <span
                class=${ze({"icon-slot":!0,"icon-slot--start":!0,"icon-slot--has-content":this.hasStartSlotContent})}
            >
                <slot name="start" @slotchange=${this.startSlotChanged}></slot>
            </span>
            ${this.loading?Y`
                    <pk-spinner
                        variant=${o}
                        size=${t}
                        tone=${this.spinnerTone??U}
                        centered
                    ></pk-spinner>
                `:U}
            <span
                class=${ze({label:!0,"is-empty":!this.hasDefaultSlotContent,loading:this.loading})}
            >
                <slot @slotchange=${this.defaultSlotChanged}></slot>
            </span>
            <span
                class=${ze({"icon-slot":!0,"icon-slot--end":!0,"icon-slot--has-content":this.hasEndSlotContent})}
            >
                <slot name="end" @slotchange=${this.endSlotChanged}></slot>
            </span>
            ${this.withCaret||this.groupTrigger?Y`<span part="caret" class="caret">${Pl(cp)}</span>`:U}
        `}},Oe.shadowRootOptions={mode:"open",delegatesFocus:!0},Oe.styles=lp,Oe);w([A({reflect:!0})],ut.prototype,"variant",void 0);w([A({reflect:!0})],ut.prototype,"size",void 0);w([A({type:Boolean,reflect:!0})],ut.prototype,"disabled",void 0);w([A({type:Boolean,reflect:!0})],ut.prototype,"loading",void 0);w([A({reflect:!0,attribute:"spinner-size"})],ut.prototype,"spinnerSize",void 0);w([A({reflect:!0,attribute:"spinner-variant"})],ut.prototype,"spinnerVariant",void 0);w([A({reflect:!0,attribute:"spinner-tone"})],ut.prototype,"spinnerTone",void 0);w([A({type:Boolean,reflect:!0,attribute:"with-caret"})],ut.prototype,"withCaret",void 0);w([A({type:Boolean,reflect:!0,attribute:"group-trigger"})],ut.prototype,"groupTrigger",void 0);w([A({type:Boolean,reflect:!0})],ut.prototype,"icon",void 0);w([A()],ut.prototype,"href",void 0);w([A()],ut.prototype,"target",void 0);w([A()],ut.prototype,"rel",void 0);w([A()],ut.prototype,"name",void 0);w([A()],ut.prototype,"value",void 0);w([A()],ut.prototype,"title",void 0);w([A()],ut.prototype,"type",void 0);w([A({reflect:!0})],ut.prototype,"form",void 0);w([Re()],ut.prototype,"hasDefaultSlotContent",void 0);w([Re()],ut.prototype,"hasStartSlotContent",void 0);w([Re()],ut.prototype,"hasEndSlotContent",void 0);ut=w([io("pk-button")],ut);var Kr=class{constructor(e,...t){this.host=e,this.boundSlots=new Set,this.lastHasContent=new Map,this.handleSlotChange=()=>{let o=!1;for(const n of this.slotNames){const r=this.test(n);this.lastHasContent.get(n)!==r&&(this.lastHasContent.set(n,r),o=!0)}o&&this.host.requestUpdate()},this.slotNames=t,e.addController(this)}hostConnected(){this.bindSlotListeners()}hostUpdated(){this.bindSlotListeners()}hostDisconnected(){for(const e of this.boundSlots)e.removeEventListener("slotchange",this.handleSlotChange);this.boundSlots.clear()}bindSlotListeners(){for(const e of this.slotNames){const t=this.findSlot(e);!t||this.boundSlots.has(t)||(this.boundSlots.add(t),t.addEventListener("slotchange",this.handleSlotChange),this.lastHasContent.has(e)||this.lastHasContent.set(e,this.test(e)))}}findSlot(e){return this.host.shadowRoot?e?this.host.shadowRoot.querySelector(`slot[name="${e}"]`):this.host.shadowRoot.querySelector("slot:not([name])"):null}test(e,t=!1){if(t||this.hasLightDomSlotContent(e))return!0;const o=this.findSlot(e);return o?o.assignedNodes({flatten:!0}).some(n=>n.nodeType===Node.TEXT_NODE?!!n.textContent?.trim():n.nodeType===Node.ELEMENT_NODE):!1}hasLightDomSlotContent(e){return[...this.host.children].some(t=>t.getAttribute("slot")===e)}},Il=_t`
    @layer pk-component {
        .form-control {
            display: flex;
            flex-direction: column;
            gap: 0.375rem;
            width: 100%;
        }

        .form-control__header {
            display: flex;
            flex-direction: column;
            gap: 0.125rem;
            min-width: 0;
        }

        .form-control__label {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            margin: 0;
            color: var(--pk-color-gray-700);
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            font-weight: 700;
            line-height: var(--pk-line-height);
        }

        .form-control__instructions,
        .form-control__hint {
            margin: 0;
            color: var(--pk-color-gray-500);
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
        }

        .form-control__instructions:empty,
        .form-control__hint:empty {
            display: none;
        }

        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }

        .form-control__input {
            display: flex;
            align-items: stretch;
            position: relative;
            width: 100%;
        }

        .form-control__start,
        .form-control__end {
            display: inline-flex;
            align-items: center;
            flex-shrink: 0;
        }

        .form-control__start {
            margin-inline-end: 6px;
        }

        .form-control__end {
            margin-inline-start: 6px;
        }

        .icon-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 0;
            border: 0;
            background: transparent;
            color: var(--pk-color-gray-500);
            cursor: pointer;
            line-height: 0;
        }

        .icon-button:focus-visible {
            outline: none;
            box-shadow: var(--pk-shadow-focus);
            border-radius: var(--pk-radius-sm);
        }

        .icon-button:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }
    }
`,Hi=0;function Rl(e="pk"){return Hi+=1,`${e}-${Hi}`}var Vi={},up=(e={})=>{Vi={...Vi,...e}},jl=["aria-labelledby","aria-describedby","aria-invalid","aria-errormessage","aria-required","aria-label"];function dp(e){return e.hasAttribute("aria-labelledby")||e.hasAttribute("aria-describedby")||e.hasAttribute("aria-errormessage")}function pp(e,t){for(const o of jl){const n=e.getAttribute(o);n!==null?t.setAttribute(o,n):t.removeAttribute(o)}}function Ul({control:e,labelId:t,instructionsId:o,hasLabel:n,hasInstructions:r,required:i=!1,invalid:s=!1}){n&&t?e.setAttribute("aria-labelledby",t):e.removeAttribute("aria-labelledby"),r&&o?e.setAttribute("aria-describedby",o):e.removeAttribute("aria-describedby"),i?e.setAttribute("aria-required","true"):e.removeAttribute("aria-required"),s?e.setAttribute("aria-invalid","true"):e.removeAttribute("aria-invalid"),e.removeAttribute("aria-errormessage")}var hp=class{constructor(e,t,o){this.host=e,this.getTarget=t,this.onSync=o}connect(){this.sync(),this.observer=new MutationObserver(()=>{this.sync()}),this.observer.observe(this.host,{attributes:!0,attributeFilter:[...jl]})}disconnect(){this.observer?.disconnect(),this.observer=void 0}sync(){if(!dp(this.host)){this.onSync?.();return}const e=this.getTarget();e&&pp(this.host,e)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ne=e=>e??U;var Te=[];function fp(e){Te.push(e)}function gp(e){for(let t=Te.length-1;t>=0;t-=1)if(Te[t]===e){Te.splice(t,1);break}}function Kn(e){return Te.length>0&&Te[Te.length-1]===e}var vp=class extends Event{constructor(){super("pk-show",{bubbles:!0,cancelable:!1,composed:!0})}},bp=class extends Event{constructor(){super("pk-after-show",{bubbles:!0,cancelable:!1,composed:!0})}},mp=class extends Event{constructor(e="unknown"){super("pk-hide",{bubbles:!0,cancelable:!0,composed:!0}),this.detail={source:e}}},yp=class extends Event{constructor(){super("pk-after-hide",{bubbles:!0,cancelable:!1,composed:!0})}};typeof globalThis.HTMLElement<"u"&&Object.prototype.hasOwnProperty.call(globalThis.HTMLElement.prototype,"popover");var kp=class extends Event{constructor(){super("pk-invalid",{bubbles:!0,cancelable:!1,composed:!0})}};function _p(){return{observedAttributes:["custom-error"],checkValidity(e){const t={message:"",isValid:!0,invalidKeys:[]};return e.customError&&(t.message=e.customError,t.isValid=!1,t.invalidKeys.push("customError")),t}}}var Ze,ce=(Ze=class extends An{static get validators(){return[_p()]}static get observedAttributes(){const t=new Set(super.observedAttributes??[]);for(const o of this.validators)for(const n of o.observedAttributes??[])t.add(n);return[...t]}constructor(){super(),this.internals=this.attachInternals(),this.assumeInteractionOn=["input"],this.validators=[],this.name=null,this.disabled=!1,this.required=!1,this.customError=null,this.valueHasChanged=!1,this.hasInteracted=!1,this.emittedEvents=[],this.emitInvalid=t=>{t.target===this&&(this.hasInteracted=!0,this.dispatchEvent(new kp))},this.handleInteraction=t=>{this.emittedEvents.includes(t.type)||this.emittedEvents.push(t.type),this.emittedEvents.length>=this.assumeInteractionOn.length&&(this.hasInteracted=!0,this.updateValidity())},this.addEventListener("invalid",this.emitInvalid)}connectedCallback(){super.connectedCallback();for(const t of this.assumeInteractionOn)this.addEventListener(t,this.handleInteraction);this.updateValidity()}disconnectedCallback(){this.hostAriaMirror?.disconnect(),this.hostAriaMirror=void 0;for(const t of this.assumeInteractionOn)this.removeEventListener(t,this.handleInteraction);this.removeEventListener("invalid",this.emitInvalid),super.disconnectedCallback()}updated(t){t.has("customError")&&this.setCustomValidity(this.customError??""),t.has("disabled")&&this.setState("disabled",!!this.disabled),(t.has("value")||t.has("disabled")||t.has("required")||t.has("name"))&&this.syncFormValue(),this.updateValidity(),super.updated(t),this.syncHostAriaMirror()}firstUpdated(t){super.firstUpdated(t),this.connectHostAriaMirror()}getAriaMirrorTarget(){return this.input??null}syncStandaloneAria(){}connectHostAriaMirror(){this.hostAriaMirror?.disconnect(),this.hostAriaMirror=new hp(this,()=>this.getAriaMirrorTarget(),()=>this.syncStandaloneAria()),this.hostAriaMirror.connect()}syncHostAriaMirror(){this.hostAriaMirror?.sync()}formResetCallback(){this.resetValidity(),this.hasInteracted=!1,this.valueHasChanged=!1,this.emittedEvents=[],this.resetToDefaultValue(),this.syncFormValue(),this.updateValidity()}formDisabledCallback(t){this.disabled=t,this.updateValidity()}formStateRestoreCallback(t,o){this.restoreFormState(t),this.syncFormValue(),this.updateValidity()}set form(t){t?this.setAttribute("form",t):this.removeAttribute("form")}get form(){return this.internals.form}get labels(){return this.internals.labels}get validity(){return this.internals.validity}get willValidate(){return this.internals.willValidate}get validationMessage(){return this.internals.validationMessage}getForm(){return this.internals.form}checkValidity(){return this.updateValidity(),this.internals.checkValidity()}reportValidity(){return this.updateValidity(),this.hasInteracted=!0,this.internals.reportValidity()}resetValidity(){this.setCustomValidity(""),this.internals.setValidity({}),this.syncCustomStates()}setCustomValidity(t){if(!t){this.customError=null,this.internals.setValidity({}),this.syncCustomStates();return}this.customError=t;const o=this.validationTarget;o instanceof HTMLElement?this.internals.setValidity({customError:!0},t,o):this.internals.setValidity({customError:!0},t),this.syncCustomStates()}get validationTarget(){return this.input}get allValidators(){return[...this.constructor.validators??[],...this.validators??[]]}setFormValue(t,o){this.internals.setFormValue(t,o??t)}setValue(t,o){this.setFormValue(t,o??t)}updateValidity(){if(this.disabled||this.hasAttribute("disabled")||!this.willValidate){this.internals.setValidity({}),this.syncCustomStates();return}const t=this.allValidators;if(!t.length)return;const o={customError:!!this.customError};let n="";const r=this.validationTarget;for(const i of t){const{isValid:s,message:a,invalidKeys:l}=i.checkValidity(this);if(!s){n||(n=a);for(const d of l)o[d]=!0}}n||(n=this.validationMessage),r instanceof HTMLElement?this.internals.setValidity(o,n,r):this.internals.setValidity(o,n),this.syncCustomStates()}syncCustomStates(){const t=this.internals.validity.valid;this.setState("required",this.required),this.setState("optional",!this.required),this.setState("invalid",!t),this.setState("valid",t),this.setState("user-invalid",!t&&this.hasInteracted),this.setState("user-valid",t&&this.hasInteracted)}setState(t,o){const n=this.internals.states;n&&(o?n.add(t):n.delete(t))}syncFormValue(){}resetToDefaultValue(){}restoreFormState(t){}},Ze.formAssociated=!0,Ze);w([A({reflect:!0})],ce.prototype,"name",void 0);w([A({type:Boolean,reflect:!0})],ce.prototype,"disabled",void 0);w([A({type:Boolean,reflect:!0})],ce.prototype,"required",void 0);w([A({attribute:"custom-error",reflect:!0})],ce.prototype,"customError",void 0);w([A({attribute:!1,state:!0})],ce.prototype,"valueHasChanged",void 0);w([A({attribute:!1,state:!0})],ce.prototype,"hasInteracted",void 0);function Nl(){return{checkValidity(e){const t=e.input,o={message:"",isValid:!0,invalidKeys:[]};if(!t)return o;let n=!0;if("checkValidity"in t&&typeof t.checkValidity=="function"&&(n=t.checkValidity()),n)return o;if(o.isValid=!1,"validationMessage"in t&&typeof t.validationMessage=="string"&&(o.message=t.validationMessage),!("validity"in t)||!t.validity)return o.invalidKeys.push("customError"),o;for(const r of Object.keys(t.validity)){if(r==="valid")continue;const i=r;t.validity[i]&&o.invalidKeys.push(i)}return o}}}function Wr(e={}){let{validationElement:t,validationProperty:o}=e;!t&&typeof document<"u"&&(t=Object.assign(document.createElement("input"),{required:!0})),o||(o="value");const n={observedAttributes:["required"],message:t?.validationMessage??"Please fill out this field.",checkValidity(r){const i={message:"",isValid:!0,invalidKeys:[]};if(!r.required)return i;const s=r[o];return(s==null||s===!1||s==="")&&(i.isValid=!1,i.message=typeof n.message=="function"?n.message(r):n.message??"",i.invalidKeys.push("valueMissing")),i}};return n}function xp(){return Y`
        <svg xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" viewBox="0 0 640 640">
            <path
                fill="currentColor"
                d="M557.5 192L534.9 214.6L278.9 470.6C266.4 483.1 246.1 483.1 233.6 470.6L105.6 342.6L83 320L128.3 274.7C129.6 276 172.3 318.7 256.3 402.7L489.7 169.3L512.3 146.7L557.6 192z"
            />
        </svg>
    `}function wp(){return Y`
        <svg xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" viewBox="0 0 640 640">
            <path fill="currentColor" d="M96 352V288H544V352H96z" />
        </svg>
    `}var Sp=[_t`
    @layer pk-component {
        .control {
            display: inline-flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            position: relative;
            box-sizing: border-box;
            width: var(--pk-checkbox-size);
            height: var(--pk-checkbox-size);
            border: 1px solid var(--pk-checkbox-border-color, #c0cbd9);
            border-radius: var(--pk-radius-sm);
            background: var(--pk-color-white);
            cursor: pointer;
            transition: border-color 0.12s ease, box-shadow 0.12s ease;
        }

        :host([disabled]) .control {
            cursor: not-allowed;
        }

        .input:focus-visible + .control {
            border-color: var(--pk-color-sky-600);
            box-shadow: 0 0 0 1px var(--pk-color-sky-600), 0 0 4px 0 hsl(from var(--pk-color-sky-600) h s l / 0.7);
        }

        :host([invalid]) .control,
        .input[aria-invalid='true'] + .control {
            border-color: var(--pk-color-rose-600);
        }

        :host([invalid]) .input:focus-visible + .control,
        .input[aria-invalid='true']:focus-visible + .control {
            border-color: var(--pk-color-rose-600);
            box-shadow: 0 0 0 1px var(--pk-color-rose-600), 0 0 4px 0 hsl(from var(--pk-color-rose-600) h s l / 0.7);
        }

        .indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--pk-color-gray-900);
        }

        .icon-check,
        .icon-indeterminate {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
        }

        .icon-check svg {
            width: 14px;
            height: 14px;
            transform: translateY(1px) scale(1.2);
        }

        .icon-indeterminate svg {
            width: 12px;
            height: 12px;
        }

        :host([checked]) .icon-check,
        .input:checked + .control .icon-check {
            opacity: 1;
        }

        :host([indeterminate]) .icon-check,
        .input:indeterminate + .control .icon-check {
            opacity: 0;
        }

        :host([indeterminate]) .icon-indeterminate,
        .input:indeterminate + .control .icon-indeterminate {
            opacity: 1;
        }
    }
`,_t`
    @layer pk-component {
        :host {
            display: inline-flex;
            vertical-align: middle;
            /* Hit target is the content-sized .root label (Craft checkbox-select), not the host. */
            cursor: default;
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
        }

        :host([disabled]) {
            cursor: not-allowed;
            opacity: 0.5;
        }

        .root {
            display: inline-flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: flex-start;
            gap: var(--pk-control-label-gap);
            /* Content-sized like Craft's <label> beside the checkbox — not full-row. */
            width: fit-content;
            max-width: 100%;
            margin: 0;
            min-height: 0;
            cursor: pointer;
            user-select: none;
            position: relative;
        }

        :host([disabled]) .root {
            cursor: not-allowed;
        }

        .root--with-hint {
            align-items: flex-start;
        }

        .input {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
            opacity: 0;
            appearance: none;
        }

        .text {
            display: flex;
            flex-direction: column;
            gap: 0.125rem;
            min-width: 0;
        }

        .label {
            line-height: max(1rem, var(--pk-checkbox-size));
            /* Match form-control / Craft body labels (gray-700), not gray-900. */
            color: var(--pk-color-gray-700);
            cursor: pointer;
        }

        :host([disabled]) .label {
            cursor: not-allowed;
        }

        :host(.all-option) .label {
            font-weight: 700;
        }

        .hint {
            margin: 0;
            color: var(--pk-color-gray-500);
            font-size: var(--pk-font-size-sm);
            line-height: var(--pk-line-height);
        }

        .hint:empty {
            display: none;
        }
    }
`],Le,Lt=(Le=class extends ce{constructor(...t){super(...t),this.assumeInteractionOn=["change"],this.hasSlotController=new Kr(this,"hint"),this.checked=!1,this.indeterminate=!1,this.disabled=!1,this.invalid=!1,this.checkboxValue="on",this.defaultChecked=!1,this.ariaLabel=null,this.hint="",this.withHint=!1,this.hasDefaultSlotContent=!1}static get validators(){return[...super.validators,Wr({validationProperty:"checked"})]}get validationTarget(){return this.input}syncFormValue(){this.setFormValue(this.checked?this.checkboxValue:null,this.checked?"on":"off")}resetToDefaultValue(){this.checked=this.defaultChecked,this.indeterminate=!1}restoreFormState(t){t==="on"||t===this.checkboxValue?this.checked=!0:this.checked=!1}updated(t){if(!this.input){super.updated(t);return}(t.has("indeterminate")||t.has("checked"))&&(this.input.indeterminate=this.indeterminate,this.input.checked=this.checked),super.updated(t)}defaultSlotChanged(t){const o=t.target;this.hasDefaultSlotContent=o.assignedNodes({flatten:!0}).some(n=>n.nodeType===Node.TEXT_NODE?n.textContent?.trim():n.nodeType===Node.ELEMENT_NODE)}handleChange(t){const o=t.target;this.checked=o.checked,this.indeterminate=!1,this.dispatchEvent(new CustomEvent("pk-change",{detail:{checked:this.checked},bubbles:!0,composed:!0})),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}render(){const t=this.hasDefaultSlotContent,o=!!this.hint||this.hasSlotController.test("hint",this.withHint);return Y`
            <label
                part="base"
                class=${ze({root:!0,"root--with-hint":o})}
            >
                <input
                    part="input"
                    class="input"
                    type="checkbox"
                    .checked=${this.checked}
                    ?disabled=${this.disabled}
                    ?required=${this.required}
                    name=${this.name??U}
                    value=${this.checkboxValue}
                    aria-labelledby=${t?"label":U}
                    aria-describedby=${o?"hint":U}
                    aria-label=${t?U:this.ariaLabel??U}
                    aria-invalid=${this.invalid?"true":U}
                    @change=${this.handleChange}
                />
                <span part="control" class="control">
                    <span part="checked-icon" class="icon-check">${xp()}</span>
                    <span part="indeterminate-icon" class="icon-indeterminate">${wp()}</span>
                </span>
                ${t||o?Y`
                        <span class="text">
                            ${t?Y`
                                    <span part="label" class="label" id="label">
                                        <slot @slotchange=${this.defaultSlotChanged}></slot>
                                    </span>
                                `:Y`<slot @slotchange=${this.defaultSlotChanged} hidden></slot>`}
                            ${o?Y`
                                    <span part="hint" class="hint" id="hint">
                                        <slot name="hint">${this.hint}</slot>
                                    </span>
                                `:U}
                        </span>
                    `:Y`<slot @slotchange=${this.defaultSlotChanged} hidden></slot>`}
            </label>
        `}},Le.shadowRootOptions={mode:"open",delegatesFocus:!0},Le.styles=Sp,Le);w([A({type:Boolean,reflect:!0})],Lt.prototype,"checked",void 0);w([A({type:Boolean,reflect:!0})],Lt.prototype,"indeterminate",void 0);w([A({type:Boolean,reflect:!0})],Lt.prototype,"disabled",void 0);w([A({type:Boolean,reflect:!0})],Lt.prototype,"invalid",void 0);w([A()],Lt.prototype,"checkboxValue",void 0);w([A({attribute:"default-checked",type:Boolean})],Lt.prototype,"defaultChecked",void 0);w([A({attribute:"aria-label"})],Lt.prototype,"ariaLabel",void 0);w([A()],Lt.prototype,"hint",void 0);w([A({type:Boolean,attribute:"with-hint"})],Lt.prototype,"withHint",void 0);w([$n(".input")],Lt.prototype,"input",void 0);w([Re()],Lt.prototype,"hasDefaultSlotContent",void 0);Lt=w([io("pk-checkbox")],Lt);var Cp=class extends Event{constructor(){super("pk-clear",{bubbles:!0,cancelable:!1,composed:!0})}};function Dl(e,t){return t||(e.getAttribute("hint")??"")}function pr(e,t,o=!1){return!!t||e("instructions",o)||e("hint")}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ep=e=>e.strings===void 0,$p={},Ap=(e,t=$p)=>e._$AH=t;/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Fl=Br(class extends qr{constructor(e){if(super(e),e.type!==ge.PROPERTY&&e.type!==ge.ATTRIBUTE&&e.type!==ge.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Ep(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===jt||t===U)return t;const o=e.element,n=e.name;if(e.type===ge.PROPERTY){if(t===o[n])return jt}else if(e.type===ge.BOOLEAN_ATTRIBUTE){if(!!t===o.hasAttribute(n))return jt}else if(e.type===ge.ATTRIBUTE&&o.getAttribute(n)===t+"")return jt;return Ap(e),t}});var zp=new Set(["button","submit","reset","checkbox","radio","file","image","hidden"]),Mp="pk-implicit-submit",Tp=(e,t)=>{if(e.key!=="Enter"||e.defaultPrevented||e.isComposing||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return!1;const o=(t||"text").toLowerCase();return!zp.has(o)},Op=e=>{const t=e.closest?.("pk-dialog");if(t){const n=t.querySelector("form");if(n)return n}const o=e.form;return o&&o.id==="main"?e.closest?.("form")!==o?e.closest("form"):null:o},Lp=(e,t,o)=>{if(e.disabled||e.readonly||!Tp(t,o))return!1;const n=Op(e);return!n||n.id==="main"?!1:(t.preventDefault(),t.stopPropagation(),n.dispatchEvent(new CustomEvent(Mp,{bubbles:!1,cancelable:!0})),!0)},Pp=_t`
    @layer pk-component {
        :host {
            display: block;
            width: 100%;
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
        }

        :host([data-pk-group-orientation]) {
            display: flex;
            flex-direction: column;
            width: auto;
            flex: 0 1 auto;
            align-self: stretch;
        }

        :host([data-pk-group-orientation]) .form-control {
            gap: 0;
            height: 100%;
        }

        :host([data-pk-group-orientation]) .form-control__input {
            min-height: var(--pk-btn-height-default);
            height: 100%;
        }

        :host([data-pk-group-orientation]) .form-control__start,
        :host([data-pk-group-orientation]) .form-control__end {
            display: none;
        }

        :host([data-pk-group-orientation]) .form-control__input {
            width: 100%;
        }

        :host([data-pk-group-orientation]) .input {
            width: 100%;
        }

        :host([data-pk-group-orientation]) .input {
            min-height: var(--pk-btn-height-default);
            height: 100%;
        }

        :host([data-pk-group-orientation='vertical']) {
            width: 100%;
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:not([data-pk-group-divider])) {
            margin-inline-start: var(--pk-bg-horizontal-indent-outlined, 0);
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-join]:not([data-pk-group-divider])) {
            margin-block-start: var(--pk-bg-vertical-indent-outlined, 0);
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][data-pk-group-join]) {
            margin-inline-start: var(--pk-bg-horizontal-indent-outlined, 0);
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-divider][data-pk-group-join]) {
            margin-block-start: var(--pk-bg-vertical-indent-outlined, 0);
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-divider]) .form-control__input {
            border-left-width: 1px;
            border-left-style: solid;
            border-left-color: var(--pk-btn-group-divider-color-outline, var(--pk-input-border-color));
            box-shadow: none;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-divider]) .form-control__input {
            border-top-width: 1px;
            border-top-style: solid;
            border-top-color: var(--pk-btn-group-divider-color-outline, var(--pk-input-border-color));
            box-shadow: none;
        }

        :host([data-pk-group-divider]) .form-control__input:focus-within,
        :host([data-pk-group-divider][data-state='focus-visible']) .form-control__input {
            box-shadow: var(--pk-input-focus-shadow);
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-divider]) .form-control__input:focus-within,
        :host([data-pk-group-orientation='vertical'][data-pk-group-divider][data-state='focus-visible']) .form-control__input {
            box-shadow: var(--pk-input-focus-shadow);
        }

        /* Chrome lives on the flex shell (part=base) so slot=start/end adornments sit
         * inside the border — same visual contract as pk-input-group / v1 InputGroup.
         * Height is content-sized (v1): padding-block + --pk-input-control-line-height + border.
         */
        .form-control__input {
            align-items: center;
            gap: 6px;
            padding-inline: 8px;
            border: var(--pk-input-border);
            border-radius: var(--pk-input-border-radius, var(--pk-radius-sm));
            background: var(--pk-input-bg);
            background-clip: padding-box;
            box-sizing: border-box;
            transition: border-color 0.12s ease, box-shadow 0.12s ease;
        }

        .form-control__start,
        .form-control__end {
            margin: 0;
            color: var(--pk-color-gray-400);
            line-height: 0;
        }

        .form-control__start ::slotted(*),
        .form-control__end ::slotted(*) {
            display: block;
            max-width: 1.25rem;
            max-height: 1.25rem;
        }

        .input {
            display: block;
            width: 100%;
            margin: 0;
            /* v1 Input default: py-1.5 + text-sm (14px / 1.25rem lh) → 34px with border. */
            padding-block: 6px;
            padding-inline: 0;
            border: 0;
            border-radius: 0;
            background: transparent;
            /* Craft CP body / field value text. */
            color: var(--pk-color-gray-700);
            font: inherit;
            line-height: var(--pk-input-control-line-height, 1.25rem);
            appearance: none;
            box-sizing: border-box;
            outline: none;
        }

        .form-control__input .input {
            flex: 1 1 auto;
            min-width: 0;
        }

        .input::placeholder {
            color: var(--pk-input-placeholder-color, var(--pk-color-gray-400));
        }

        /*
         * Craft text:focus-visible only sets box-shadow (--focus-ring); resting border stays.
         * Do not also set border-color — --pk-input-focus-shadow already includes 0 0 0 1px,
         * so border-color + that ring reads as a double focus treatment.
         */
        :host(:not([invalid]):not(:state(user-invalid))) .form-control__input:focus-within,
        :host([data-state='focus-visible']:not([invalid]):not(:state(user-invalid))) .form-control__input {
            box-shadow: var(--pk-input-focus-shadow);
        }

        .form-control__input:has(.input:disabled) {
            cursor: not-allowed;
            opacity: 0.5;
        }

        .input:disabled {
            cursor: not-allowed;
        }

        :host([invalid]) .form-control__input,
        :host(:state(user-invalid)) .form-control__input {
            border-color: var(--pk-color-rose-600);
        }

        /* Invalid + focus: rose ring (same token as select/combobox), not sky over rose border. */
        :host([invalid]) .form-control__input:focus-within,
        :host([invalid][data-state='focus-visible']) .form-control__input,
        :host(:state(user-invalid)) .form-control__input:focus-within {
            box-shadow: var(--pk-input-invalid-focus-shadow);
        }

        :host([size='xs']) .form-control__input {
            gap: 4px;
            padding-inline: 6px;
        }

        :host([size='xs']) .input {
            padding-block: 4px;
            font-size: 11px;
        }

        :host([size='sm']) .form-control__input {
            gap: 4px;
            padding-inline: 8px;
        }

        :host([size='sm']) .input {
            padding-block: 4px;
            font-size: 12px;
        }

        :host([size='lg']) .form-control__input {
            gap: 8px;
            padding-inline: 12px;
        }

        :host([size='lg']) .input {
            padding-block: 8px;
            font-size: var(--pk-font-size-base);
        }

        :host([size='xl']) .form-control__input {
            gap: 8px;
            padding-inline: 16px;
        }

        :host([size='xl']) .input {
            padding-block: 10px;
            font-size: 16px;
        }

        /*
         * Mono face + 0.9× optical size + line-height 1.5. The taller line-height
         * offsets the smaller face so padding + content height stays aligned with
         * stock inputs (1.25rem ≈ 1.5 × 12.6px). Scale the size's face, not
         * the parent em, so xs/sm/xl mono stay proportional.
         */
        :host([mono]) .input {
            font-family: var(--pk-input-mono-font-family);
            font-size: calc(var(--pk-font-size-base) * 0.9);
            line-height: var(--pk-input-mono-line-height, 1.5);
        }

        :host([mono][size='xs']) .input {
            font-size: calc(11px * 0.9);
        }

        :host([mono][size='sm']) .input {
            font-size: calc(12px * 0.9);
        }

        :host([mono][size='lg']) .input {
            font-size: calc(var(--pk-font-size-base) * 0.9);
        }

        :host([mono][size='xl']) .input {
            font-size: calc(16px * 0.9);
        }

        /* Editable-table cells (v1): flush into the row — no chrome border/radius.
         * Prefer reflected fit-cell (Lit property); data-editable-table-input is a legacy alias.
         * Fill host → form-control → input so the control spans the full td.
         */
        :host([fit-cell]),
        :host([data-editable-table-input]) {
            display: block;
            height: 100%;
            min-height: 100%;
            box-sizing: border-box;
        }

        :host([fit-cell]) .form-control,
        :host([data-editable-table-input]) .form-control {
            height: 100%;
            min-height: 100%;
            gap: 0;
        }

        :host([fit-cell]) .form-control__input,
        :host([data-editable-table-input]) .form-control__input {
            height: 100%;
            min-height: 100%;
            flex: 1 1 auto;
            padding-inline: 0;
            border: none;
            border-radius: 0;
            background: transparent;
            box-shadow: none;
        }

        :host([fit-cell]) .input,
        :host([data-editable-table-input]) .input {
            height: 100%;
            min-height: 100%;
        }

        :host([fit-cell]:not([invalid]):not(:state(user-invalid))) .form-control__input:focus-within,
        :host([fit-cell][data-state='focus-visible']:not([invalid]):not(:state(user-invalid))) .form-control__input,
        :host([data-editable-table-input]:not([invalid]):not(:state(user-invalid))) .form-control__input:focus-within,
        :host([data-editable-table-input][data-state='focus-visible']:not([invalid]):not(:state(user-invalid))) .form-control__input {
            border: none;
            box-shadow: inset 0 0 0 1px var(--pk-color-gray-200);
        }

        :host([fit-cell][invalid]) .form-control__input,
        :host([fit-cell]:state(user-invalid)) .form-control__input,
        :host([data-editable-table-input][invalid]) .form-control__input,
        :host([data-editable-table-input]:state(user-invalid)) .form-control__input {
            border: none;
            box-shadow: inset 0 0 0 1px var(--pk-color-rose-600);
        }

        :host([fit-cell][invalid]) .form-control__input:focus-within,
        :host([fit-cell][invalid][data-state='focus-visible']) .form-control__input,
        :host([fit-cell]:state(user-invalid)) .form-control__input:focus-within,
        :host([data-editable-table-input][invalid]) .form-control__input:focus-within,
        :host([data-editable-table-input][invalid][data-state='focus-visible']) .form-control__input,
        :host([data-editable-table-input]:state(user-invalid)) .form-control__input:focus-within {
            border: none;
            box-shadow: inset 0 0 0 1px var(--pk-color-rose-600);
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:not([data-pk-group-divider])) .form-control__input {
            border-left-width: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-join]:not([data-pk-group-divider])) .form-control__input {
            border-top-width: 0;
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-divider]) .form-control__input {
            border-left-width: 1px;
            border-left-style: solid;
            border-left-color: var(--pk-btn-group-divider-color-outline, var(--pk-input-border-color));
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-divider]) .form-control__input {
            border-top-width: 1px;
            border-top-style: solid;
            border-top-color: var(--pk-btn-group-divider-color-outline, var(--pk-input-border-color));
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail]) .form-control__input {
            border-right-width: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail]) .form-control__input {
            border-bottom-width: 0;
        }

        .clear-button {
            position: absolute;
            inset-inline-end: 6px;
            inset-block-start: 50%;
            translate: 0 -50%;
        }

        .form-control__input:has(.clear-button) .input {
            padding-inline-end: 20px;
        }
    }
`,Xe,lt=(Xe=class extends ce{constructor(...t){super(...t),this.assumeInteractionOn=["blur","input"],this.hasSlotController=new Kr(this,"instructions","hint","label","start","end"),this.inputId=Rl("pk-input"),this.type="text",this._value=null,this.defaultValue=null,this.size="default",this.label="",this.instructions="",this.withClear=!1,this.placeholder="",this.readonly=!1,this.invalid=!1,this.fitCell=!1,this.mono=!1,this.autofocus=!1,this.withLabel=!1,this.withInstructions=!1}static get validators(){return[...super.validators,Nl(),Wr()]}get value(){return this.valueHasChanged?this._value??"":this._value??this.defaultValue??""}set value(t){const o=t??"";this._value!==o&&(this.valueHasChanged=!0,this._value=o)}connectedCallback(){this.instructions=Dl(this,this.instructions),this.hasAttribute("with-hint")&&(this.withInstructions=!0),super.connectedCallback()}syncFormValue(){this.setValue(this.value||"")}resetToDefaultValue(){this.valueHasChanged=!1,this._value=null}restoreFormState(t){typeof t=="string"&&(this.value=t)}formResetCallback(){this.valueHasChanged=!1,this._value=null,this.input&&(this.input.value=this.defaultValue??""),super.formResetCallback()}updated(t){(t.has("value")||t.has("defaultValue"))&&this.setState("blank",!this.value),super.updated(t)}syncStandaloneAria(){if(!this.input)return;const t=!!this.label||this.hasSlotController.test("label",this.withLabel),o=pr((n,r)=>this.hasSlotController.test(n,r),this.instructions,this.withInstructions);Ul({control:this.input,labelId:`${this.inputId}-label`,instructionsId:`${this.inputId}-instructions`,hasLabel:t,hasInstructions:o,required:this.required,invalid:this.invalid||!this.internals.validity.valid})}hasLabelContent(){return!!this.label||this.hasSlotController.test("label",this.withLabel)}hasInstructionsContent(){return pr((t,o)=>this.hasSlotController.test(t,o),this.instructions,this.withInstructions)}focus(t){this.input?.focus(t)}blur(){this.input?.blur()}select(){this.input?.select()}handleInput(){this.value=this.input.value,this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}handleChange(t){this.value=this.input.value,t.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}handleKeyDown(t){Lp(this,t,this.type)}handleClearClick(t){t.preventDefault(),this.value!==""&&(this.value="",this.dispatchEvent(new Cp),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0})),this.input.focus())}render(){const t=this.hasLabelContent(),o=this.hasInstructionsContent(),n=this.withClear&&!this.disabled&&!this.readonly&&this.value.length>0,r=this.hasSlotController.test("start"),i=this.hasSlotController.test("end");return Y`
            <div part="form-control" class="form-control">
                ${t||o?Y`
                        <div part="header" class="form-control__header">
                            ${t?Y`
                                    <label
                                        part="label"
                                        class="form-control__label"
                                        id=${`${this.inputId}-label`}
                                        for=${`${this.inputId}-control`}
                                    >
                                        <slot name="label">${this.label}</slot>
                                    </label>
                                `:U}

                            ${o?Y`
                                    <p
                                        part="instructions"
                                        class="form-control__instructions"
                                        id=${`${this.inputId}-instructions`}
                                    >
                                        <slot name="instructions">${this.instructions}</slot>
                                        <slot name="hint"></slot>
                                    </p>
                                `:U}
                        </div>
                    `:U}

                <div part="base" class="form-control__input">
                    ${r?Y`
                            <span part="start" class="form-control__start">
                                <slot name="start"></slot>
                            </span>
                        `:Y`<slot name="start" hidden></slot>`}

                    <input
                        part="input"
                        class="input"
                        id=${t?`${this.inputId}-control`:U}
                        type=${this.type}
                        .value=${Fl(this.value)}
                        placeholder=${this.placeholder||U}
                        pattern=${ne(this.pattern)}
                        minlength=${ne(this.minlength)}
                        maxlength=${ne(this.maxlength)}
                        min=${ne(this.min)}
                        max=${ne(this.max)}
                        step=${ne(this.step)}
                        autocomplete=${ne(this.autocomplete)}
                        ?disabled=${this.disabled}
                        ?readonly=${this.readonly}
                        ?required=${this.required}
                        ?autofocus=${this.autofocus}
                        @input=${this.handleInput}
                        @change=${this.handleChange}
                        @keydown=${this.handleKeyDown}
                        @focus=${()=>this.dispatchEvent(new Event("focus",{bubbles:!0,composed:!0}))}
                        @blur=${()=>this.dispatchEvent(new Event("blur",{bubbles:!0,composed:!0}))}
                    />

                    ${n?Y`
                            <button
                                part="clear-button"
                                class="icon-button clear-button"
                                type="button"
                                tabindex="-1"
                                aria-label="Clear"
                                @click=${this.handleClearClick}
                            >
                                <slot name="clear-icon">×</slot>
                            </button>
                        `:U}

                    ${i?Y`
                            <span part="end" class="form-control__end">
                                <slot name="end"></slot>
                            </span>
                        `:Y`<slot name="end" hidden></slot>`}
                </div>
            </div>
        `}},Xe.styles=[Il,na(),oa(".input","var(--pk-input-border-radius, var(--pk-radius-sm))"),ra(".input"),Pp],Xe);w([$n("input")],lt.prototype,"input",void 0);w([A({reflect:!0})],lt.prototype,"type",void 0);w([Re()],lt.prototype,"value",null);w([A({attribute:"value",reflect:!0})],lt.prototype,"defaultValue",void 0);w([A({reflect:!0})],lt.prototype,"size",void 0);w([A()],lt.prototype,"label",void 0);w([A()],lt.prototype,"instructions",void 0);w([A({attribute:"with-clear",type:Boolean})],lt.prototype,"withClear",void 0);w([A()],lt.prototype,"placeholder",void 0);w([A({type:Boolean,reflect:!0})],lt.prototype,"readonly",void 0);w([A({type:Boolean,reflect:!0})],lt.prototype,"invalid",void 0);w([A({type:Boolean,reflect:!0,attribute:"fit-cell"})],lt.prototype,"fitCell",void 0);w([A({type:Boolean,reflect:!0})],lt.prototype,"mono",void 0);w([A()],lt.prototype,"pattern",void 0);w([A({type:Number})],lt.prototype,"minlength",void 0);w([A({type:Number})],lt.prototype,"maxlength",void 0);w([A()],lt.prototype,"min",void 0);w([A()],lt.prototype,"max",void 0);w([A()],lt.prototype,"step",void 0);w([A()],lt.prototype,"autocomplete",void 0);w([A({type:Boolean,reflect:!0})],lt.prototype,"autofocus",void 0);w([A({attribute:"with-label",type:Boolean})],lt.prototype,"withLabel",void 0);w([A({attribute:"with-instructions",type:Boolean})],lt.prototype,"withInstructions",void 0);lt=w([io("pk-input")],lt);var Ee=Pr({name:"PkInput",tagName:"pk-input"});function Ip(e){return!!e.detail?.checked}var Rp=_t`
    @layer pk-component {
        :host {
            display: block;
            width: 100%;
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
        }

        .textarea {
            display: block;
            width: 100%;
            min-height: 5rem;
            margin: 0;
            padding: 7px 10px;
            border: var(--pk-input-border);
            border-radius: var(--pk-textarea-border-radius, var(--pk-radius-md));
            background: var(--pk-input-bg);
            background-clip: padding-box;
            /* Craft CP body / field value text. */
            color: var(--pk-color-gray-700);
            font: inherit;
            line-height: 1.4;
            resize: vertical;
            appearance: none;
            box-sizing: border-box;
            outline: none;
            transition: border-color 0.12s ease, box-shadow 0.12s ease;
        }

        .textarea::placeholder {
            color: var(--pk-input-placeholder-color, var(--pk-color-gray-400));
        }

        /* Craft: focus is box-shadow only — do not also flip border-color (double ring). */
        :host(:not([invalid]):not(:state(user-invalid))) .textarea:focus,
        :host(:not([invalid]):not(:state(user-invalid))) .textarea:focus-visible,
        :host([data-state='focus-visible']:not([invalid]):not(:state(user-invalid))) .textarea {
            box-shadow: var(--pk-input-focus-shadow);
        }

        .textarea:disabled {
            cursor: not-allowed;
            opacity: 0.5;
            background: var(--pk-color-gray-50);
        }

        :host([invalid]) .textarea,
        :host(:state(user-invalid)) .textarea {
            border-color: var(--pk-color-rose-600);
        }

        :host([invalid]) .textarea:focus,
        :host([invalid]) .textarea:focus-visible,
        :host([invalid][data-state='focus-visible']) .textarea,
        :host(:state(user-invalid)) .textarea:focus,
        :host(:state(user-invalid)) .textarea:focus-visible {
            box-shadow: var(--pk-input-invalid-focus-shadow);
        }

        /* Editable-table cells (v1): flush into the row and fill cell height.
         * Chain height through form-control — percentage on .textarea alone
         * doesn't resolve when the wrapper sizes to content (rows / min-height). */
        :host([fit-cell]),
        :host([data-editable-table-input]) {
            display: block;
            height: 100%;
            min-height: 100%;
            box-sizing: border-box;
            overflow: hidden;
        }

        :host([fit-cell]) .form-control,
        :host([data-editable-table-input]) .form-control {
            display: flex;
            flex-direction: column;
            height: 100%;
            min-height: 100%;
        }

        :host([fit-cell]) .textarea,
        :host([data-editable-table-input]) .textarea {
            flex: 1 1 auto;
            border: none;
            border-radius: 0;
            background: transparent;
            box-shadow: none;
            height: 100%;
            min-height: 0;
            max-height: 100%;
            /* Match text-cell inset (v1 py-1.5 / px-2). 0.5rem block padding +
             * line-height 1.4 overflows the 34px et cell and shows a scrollbar
             * even for empty / single-line notes. */
            padding: 0.375rem 0.5rem;
            line-height: 1.25;
            overflow-x: hidden;
            overflow-y: auto;
            resize: none;
        }

        :host([fit-cell]:not([invalid]):not(:state(user-invalid))) .textarea:focus,
        :host([fit-cell]:not([invalid]):not(:state(user-invalid))) .textarea:focus-visible,
        :host([fit-cell][data-state='focus-visible']:not([invalid]):not(:state(user-invalid))) .textarea,
        :host([data-editable-table-input]:not([invalid]):not(:state(user-invalid))) .textarea:focus,
        :host([data-editable-table-input]:not([invalid]):not(:state(user-invalid))) .textarea:focus-visible,
        :host([data-editable-table-input][data-state='focus-visible']:not([invalid]):not(:state(user-invalid))) .textarea {
            border: none;
            box-shadow: inset 0 0 0 1px var(--pk-color-gray-200);
        }

        :host([fit-cell][invalid]) .textarea,
        :host([fit-cell]:state(user-invalid)) .textarea,
        :host([fit-cell][invalid]) .textarea:focus,
        :host([fit-cell][invalid]) .textarea:focus-visible,
        :host([fit-cell]:state(user-invalid)) .textarea:focus,
        :host([fit-cell]:state(user-invalid)) .textarea:focus-visible,
        :host([data-editable-table-input][invalid]) .textarea,
        :host([data-editable-table-input]:state(user-invalid)) .textarea,
        :host([data-editable-table-input][invalid]) .textarea:focus,
        :host([data-editable-table-input][invalid]) .textarea:focus-visible,
        :host([data-editable-table-input]:state(user-invalid)) .textarea:focus,
        :host([data-editable-table-input]:state(user-invalid)) .textarea:focus-visible {
            border: none;
            box-shadow: inset 0 0 0 1px var(--pk-color-rose-600);
        }
    }
`,Qe,xt=(Qe=class extends ce{constructor(...t){super(...t),this.assumeInteractionOn=["blur","input"],this.hasSlotController=new Kr(this,"instructions","hint","label"),this.controlId=Rl("pk-textarea"),this.placeholder="",this._value=null,this.defaultValue=null,this.size="default",this.label="",this.instructions="",this.readonly=!1,this.invalid=!1,this.fitCell=!1,this.withLabel=!1,this.withInstructions=!1}static get validators(){return[...super.validators,Nl(),Wr()]}get value(){return this.valueHasChanged?this._value??"":this._value??this.defaultValue??""}set value(t){const o=t??"";this._value!==o&&(this.valueHasChanged=!0,this._value=o)}connectedCallback(){this.instructions=Dl(this,this.instructions),this.hasAttribute("with-hint")&&(this.withInstructions=!0),super.connectedCallback()}syncFormValue(){this.setValue(this.value||"")}resetToDefaultValue(){this.valueHasChanged=!1,this._value=null}restoreFormState(t){typeof t=="string"&&(this.value=t)}formResetCallback(){this.valueHasChanged=!1,this._value=null,this.input&&(this.input.value=this.defaultValue??""),super.formResetCallback()}updated(t){(t.has("value")||t.has("defaultValue"))&&this.setState("blank",!this.value),super.updated(t)}syncStandaloneAria(){if(!this.input)return;const t=this.hasLabelContent(),o=this.hasInstructionsContent();Ul({control:this.input,labelId:`${this.controlId}-label`,instructionsId:`${this.controlId}-instructions`,hasLabel:t,hasInstructions:o,required:this.required,invalid:this.invalid||!this.internals.validity.valid})}hasLabelContent(){return!!this.label||this.hasSlotController.test("label",this.withLabel)}hasInstructionsContent(){return pr((t,o)=>this.hasSlotController.test(t,o),this.instructions,this.withInstructions)}focus(t){this.input?.focus(t)}blur(){this.input?.blur()}handleInput(){this.value=this.input.value,this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}handleChange(t){this.value=this.input.value,t.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}render(){const t=this.hasLabelContent(),o=this.hasInstructionsContent();return Y`
            <div part="form-control" class="form-control">
                ${t?Y`
                        <label
                            part="label"
                            class="form-control__label"
                            id=${`${this.controlId}-label`}
                            for=${`${this.controlId}-control`}
                        >
                            <slot name="label">${this.label}</slot>
                        </label>
                    `:U}

                ${o?Y`
                        <p
                            part="instructions"
                            class="form-control__instructions"
                            id=${`${this.controlId}-instructions`}
                        >
                            <slot name="instructions">${this.instructions}</slot>
                            <slot name="hint"></slot>
                        </p>
                    `:U}

                <textarea
                    part="textarea"
                    class="textarea"
                    id=${t?`${this.controlId}-control`:U}
                    rows=${ne(this.fitCell?this.rows??1:this.rows)}
                    .value=${Fl(this.value)}
                    placeholder=${this.placeholder||U}
                    maxlength=${ne(this.maxlength)}
                    ?disabled=${this.disabled}
                    ?readonly=${this.readonly}
                    ?required=${this.required}
                    @input=${this.handleInput}
                    @change=${this.handleChange}
                    @focus=${()=>this.dispatchEvent(new Event("focus",{bubbles:!0,composed:!0}))}
                    @blur=${()=>this.dispatchEvent(new Event("blur",{bubbles:!0,composed:!0}))}
                ></textarea>
            </div>
        `}},Qe.styles=[Il,Rp],Qe);w([$n("textarea")],xt.prototype,"input",void 0);w([A()],xt.prototype,"placeholder",void 0);w([Re()],xt.prototype,"value",null);w([A({attribute:"value",reflect:!0})],xt.prototype,"defaultValue",void 0);w([A({reflect:!0})],xt.prototype,"size",void 0);w([A()],xt.prototype,"label",void 0);w([A()],xt.prototype,"instructions",void 0);w([A({type:Boolean,reflect:!0})],xt.prototype,"readonly",void 0);w([A({type:Boolean,reflect:!0})],xt.prototype,"invalid",void 0);w([A({type:Boolean,reflect:!0,attribute:"fit-cell"})],xt.prototype,"fitCell",void 0);w([A({type:Number})],xt.prototype,"rows",void 0);w([A({type:Number,attribute:"max-length"})],xt.prototype,"maxlength",void 0);w([A({attribute:"with-label",type:Boolean})],xt.prototype,"withLabel",void 0);w([A({attribute:"with-instructions",type:Boolean})],xt.prototype,"withInstructions",void 0);xt=w([io("pk-textarea")],xt);var Wn=Pr({name:"PkTextarea",tagName:"pk-textarea"}),Io=new Set,hr=null,jp=new Set([" ","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","PageUp","PageDown","Home","End"]);function Gn(e){for(const t of e.composedPath())if(t instanceof HTMLElement&&Io.has(t))return!0;return!1}function Up(e){if(!(e instanceof HTMLElement))return!1;if(e.isContentEditable)return!0;const t=e.tagName;return t==="INPUT"||t==="TEXTAREA"||t==="SELECT"}function Np(){const e=document.body,t=e.style.overflow;e.style.setProperty("overflow","hidden","important");const o=i=>{Gn(i)||i.preventDefault()},n=i=>{Gn(i)||i.preventDefault()},r=i=>{jp.has(i.key)&&(Gn(i)||Up(i.target)||i.preventDefault())};return window.addEventListener("wheel",o,{passive:!1,capture:!0}),window.addEventListener("touchmove",n,{passive:!1,capture:!0}),window.addEventListener("keydown",r,{capture:!0}),()=>{window.removeEventListener("wheel",o,{capture:!0}),window.removeEventListener("touchmove",n,{capture:!0}),window.removeEventListener("keydown",r,{capture:!0}),e.style.removeProperty("overflow"),t&&(e.style.overflow=t)}}function Dp(e){Io.add(e),Io.size===1&&(document.documentElement.classList.add("pk-scroll-lock"),document.documentElement.style.setProperty("--pk-scroll-lock-size","0px"),hr=Np())}function Jn(e){Io.delete(e),Io.size===0&&(hr?.(),hr=null,document.documentElement.classList.remove("pk-scroll-lock"),document.documentElement.style.removeProperty("--pk-scroll-lock-size"),document.documentElement.style.removeProperty("--pk-scroll-lock-gutter"))}function qo(e,t,o=500){return new Promise(n=>{const r=new AbortController,{signal:i}=r;if(e.classList.contains(t)){n();return}e.classList.add(t);let s=!1;const a=()=>{s||(s=!0,e.classList.remove(t),window.clearTimeout(l),n(),r.abort())};e.addEventListener("animationend",a,{once:!0,signal:i}),e.addEventListener("animationcancel",a,{once:!0,signal:i});const l=window.setTimeout(a,o);requestAnimationFrame(()=>{!s&&e.getAnimations().length===0&&a()})})}var Fp=".modal-shade, .modal",Hp=e=>{const t=getComputedStyle(e);return t.display!=="none"&&t.visibility!=="hidden"&&Number.parseFloat(t.opacity||"1")>0};function fr(e=document){const t=e.querySelectorAll(Fp);for(const o of t)if(o instanceof HTMLElement&&!o.closest("pk-dialog")&&Hp(o))return!0;return!1}function Vp(e,t={}){const o=t.getDocument?.()??document,n=t.root??o.body;let r=fr(o);const i=()=>{const l=fr(o);l!==r&&(r=l,e(l))},s=new MutationObserver(()=>{i()});s.observe(n,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","hidden"]});const a=window.setInterval(i,250);return{disconnect:()=>{s.disconnect(),window.clearInterval(a)}}}var Bp=_t`
    @layer pk-component {
        :host {
            /* Not display:contents — that flattens the trigger slot into flex parents
               (e.g. playground cards) and stretches pk-button full width, same class of
               bug as the dropdown host. Dialog host is display none/block, not contents. */
            display: inline-block;
            width: fit-content;
            max-width: 100%;
            align-self: flex-start;
            flex: none;
            vertical-align: middle;
        }

        /*
         * Controlled dialogs (no slot="trigger") — panel is top-layer / fixed while
         * yielding. An inline-block host still sizes to the open <dialog> box in some
         * engines and expands parents (Formie nested field cards grow a blank gap).
         *
         * Zero box ≠ gone from the tree: Tailwind space-y-* uses :not(:last-child) on
         * DOM siblings, so an in-tree host still steals last-child and margins the
         * previous sibling. Prefer flex/grid gap-* (skips out-of-flow children), or
         * mount overlays outside the spaced stack. True light-DOM portal would also fix it.
         */
        :host(:not([data-has-trigger])) {
            position: absolute;
            width: 0;
            height: 0;
            max-width: none;
            margin: 0;
            padding: 0;
            overflow: visible;
            vertical-align: unset;
        }

        .dialog {
            display: flex;
            flex-direction: column;
            width: min(100%, var(--pk-dialog-width, var(--pk-dialog-max-width, 32rem)));
            min-width: var(--pk-dialog-min-width, 0);
            /* Keep UA :modal inset (0) — that + margin:auto centers the panel. Do not
             * unset inset; it breaks centering (field edit landed top-left). */
            height: var(--pk-dialog-height, fit-content);
            min-height: var(--pk-dialog-min-height, 0);
            max-height: var(--pk-dialog-max-height, calc(100vh - 2rem));
            margin: auto;
            padding: 0;
            /* v1 DialogContent: no CSS border — edge is the 1px ring inside --pk-shadow-modal. */
            border: 0;
            border-radius: var(--pk-radius-lg);
            background: var(--pk-color-white);
            box-shadow: var(--pk-shadow-modal);
            color: var(--pk-color-gray-900);
            overflow: hidden;
            opacity: 1;
            transform: scale(1);
        }

        .dialog:focus,
        .dialog:focus-visible {
            outline: none;
        }

        .dialog:not([open]) {
            display: none;
        }

        .dialog--wide {
            --pk-dialog-max-width: 42rem;
        }

        /* motion only via animateWithClass — never auto-animate on [open] alone. */
        .dialog.show {
            animation: pk-dialog-in 0.15s ease;
        }

        .dialog.hide {
            animation: pk-dialog-out 0.15s ease forwards;
        }

        .dialog.pulse {
            animation: pk-dialog-pulse 0.25s ease;
        }

        @keyframes pk-dialog-in {
            from {
                opacity: 0;
                transform: scale(0.95);
            }

            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes pk-dialog-out {
            from {
                opacity: 1;
                transform: scale(1);
            }

            to {
                opacity: 0;
                transform: scale(0.95);
            }
        }

        @keyframes pk-dialog-pulse {
            0%, 100% {
                transform: scale(1);
            }

            50% {
                transform: scale(0.98);
            }
        }

        .dialog.show::backdrop {
            animation: pk-dialog-backdrop-in 0.15s ease;
        }

        .dialog.hide::backdrop {
            animation: pk-dialog-backdrop-in 0.15s ease reverse;
        }

        .dialog::backdrop {
            background: hsl(from var(--pk-color-gray-900) h s l / 0.2);
            opacity: 1;
        }

        @keyframes pk-dialog-backdrop-in {
            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }
        }

        .header {
            position: relative;
            display: flex;
            flex-shrink: 0;
            flex-direction: column;
            gap: 0.2rem;
            padding: 1rem;
            border-bottom: 1px solid var(--pk-color-gray-150);
            border-radius: var(--pk-radius-lg) var(--pk-radius-lg) 0 0;
            background: #f3f7fb;
            text-align: left;
        }

        .title {
            margin: 0;
            padding-inline-end: 2rem;
            font-size: 0.9375rem;
            font-weight: 600;
            line-height: 1.2;
            color: var(--pk-color-gray-900);
        }

        .description {
            margin: 0;
            padding-inline-end: 2rem;
            font-size: 0.75rem;
            font-weight: 400;
            line-height: 1.4;
            color: var(--pk-color-gray-500);
        }

        .close {
            --pk-dialog-close-focus-padding: 0.25rem;
            position: absolute;
            top: calc(1rem - var(--pk-dialog-close-focus-padding));
            right: calc(1rem - var(--pk-dialog-close-focus-padding));
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: calc(1.125rem + 2 * var(--pk-dialog-close-focus-padding));
            height: calc(1.125rem + 2 * var(--pk-dialog-close-focus-padding));
            margin: 0;
            padding: var(--pk-dialog-close-focus-padding);
            border: 0;
            border-radius: var(--pk-radius-sm);
            background: transparent;
            color: var(--pk-color-gray-600);
            cursor: pointer;
            line-height: 0;
            opacity: 0.7;
            transition: opacity 0.12s ease;
            box-sizing: border-box;
        }

        .close-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 0;
        }

        .close-icon svg {
            display: block;
            width: 1.125rem;
            height: 1.125rem;
        }

        .close:hover {
            opacity: 1;
            background: transparent;
        }

        .close:focus-visible {
            opacity: 1;
            box-shadow: 0 0 0 2px var(--pk-color-gray-600);
        }

        .body {
            flex: 1 1 auto;
            min-height: 0;
            overflow: auto;
            padding: 0;
            /* v1 DialogContent inherited CP text defaults (14px / gray-700) — do not
             * downshift body copy to sm/gray-600 or slotted content reads smaller than v1. */
            font-size: var(--pk-font-size-base);
            line-height: 1.5;
            color: var(--pk-color-gray-700);
        }

        .body--padded {
            padding: 1rem;
        }

        .footer {
            display: flex;
            flex-shrink: 0;
            flex-direction: row;
            justify-content: flex-end;
            gap: 0.5rem;
            padding: 0.625rem 1rem;
            border-top: 1px solid var(--pk-color-gray-150);
            border-radius: 0 0 var(--pk-radius-lg) var(--pk-radius-lg);
            background: #e4edf6;
        }
    }
`,qp=Vr(Ll.xmark),to,Nt=(to=class extends An{constructor(...t){super(...t),this.open=!1,this.label="",this.description="",this.disablePointerDismissal=!1,this.withoutHeader=!1,this.withoutBodyPadding=!1,this.disableScrollLock=!1,this.size="default",this.triggerElement=null,this.previouslyFocused=null,this.yieldingToHostModal=!1,this.hostModalObserver=null,this.yieldBox=null,this.handleDocumentKeyDown=o=>{this.yieldingToHostModal||o.key==="Escape"&&this.open&&Kn(this)&&(o.preventDefault(),o.stopPropagation(),this.requestClose("escape"))},this.onHostModalPresenceChange=o=>{o?this.yieldToHostModal():this.restoreFromHostModal()},this.showing=!1,this.handleDialogCancel=o=>{o.preventDefault(),!this.dialogElement.classList.contains("hide")&&Kn(this)&&this.requestClose("escape")},this.handleDialogClick=o=>{o.composedPath().some(n=>n instanceof Element&&n.matches('[data-dialog="close"], [data-dialog-close]'))&&(o.stopPropagation(),this.requestClose("close-button"))},this.handleDialogPointerDown=async o=>{if(o.target===this.dialogElement&&Kn(this)){if(!this.disablePointerDismissal){this.requestClose("pointer-dismiss");return}await qo(this.dialogElement,"pulse")}},this.onTriggerClick=o=>{o.preventDefault(),this.open=!0},this.onFooterSlotChange=()=>{this.requestUpdate()}}hasCustomHeaderSlot(){return this.querySelector(':scope > [slot="header"]')!==null}applyYieldPosition(t){const o=this.dialogElement;o.style.position="fixed",o.style.top=`${t.top}px`,o.style.left=`${t.left}px`,o.style.width=`${t.width}px`,o.style.height=`${t.height}px`,o.style.margin="0",o.style.maxHeight="none",o.style.zIndex="99",o.toggleAttribute("data-yielding",!0)}clearYieldPosition(){const t=this.dialogElement;t&&(t.style.position="",t.style.top="",t.style.left="",t.style.width="",t.style.height="",t.style.margin="",t.style.maxHeight="",t.style.zIndex="",t.removeAttribute("data-yielding"),this.yieldBox=null)}yieldToHostModal(){if(this.yieldingToHostModal||!this.open||!this.dialogElement?.open)return;const t=this.dialogElement.getBoundingClientRect();this.yieldBox={top:t.top,left:t.left,width:t.width,height:t.height},this.yieldingToHostModal=!0;try{this.dialogElement.close(),this.dialogElement.show(),this.applyYieldPosition(this.yieldBox)}catch{this.yieldingToHostModal=!1,this.clearYieldPosition()}}restoreFromHostModal(){if(this.yieldingToHostModal&&(this.yieldingToHostModal=!1,this.clearYieldPosition(),!(!this.open||!this.dialogElement)))try{this.dialogElement.open&&this.dialogElement.close(),this.dialogElement.showModal()}catch{}}firstUpdated(){this.open&&this.show()}disconnectedCallback(){this.disableScrollLock||Jn(this),this.removeOpenListeners(),super.disconnectedCallback()}updated(t){super.updated(t),!(!t.has("open")||!this.hasUpdated)&&this.handleOpenChange()}handleOpenChange(){this.open&&!this.dialogElement.open?this.show():!this.open&&this.dialogElement.open&&(this.open=!0,this.requestClose("api"))}async show(t="api"){if(!(this.showing||this.dialogElement?.open)){this.showing=!0;try{const o=new vp;if(!this.dispatchEvent(o)){this.open=!1;return}this.addOpenListeners(),this.previouslyFocused=document.activeElement,this.open=!0,this.dialogElement.showModal(),this.disableScrollLock||Dp(this),requestAnimationFrame(()=>{const n=this.querySelector("[autofocus]");if(n){(n.shadowRoot?.querySelector("input, textarea, select, button")??n).focus({preventScroll:!0});return}this.dialogElement.focus({preventScroll:!0})}),await qo(this.dialogElement,"show"),this.dispatchEvent(new CustomEvent("pk-open-change",{detail:{open:!0},bubbles:!0,composed:!0})),this.dispatchEvent(new bp)}finally{this.showing=!1}}}async hide(t="unknown"){await this.requestClose(t)}closeDialog(){this.requestClose("close-button")}async requestClose(t="unknown"){const o=new mp(typeof t=="string"?t:"close-button");if(!this.dispatchEvent(o)){this.open=!0,await qo(this.dialogElement,"pulse");return}this.removeOpenListeners(),await qo(this.dialogElement,"hide"),this.open=!1,this.dialogElement.close(),this.disableScrollLock||Jn(this);const n=this.previouslyFocused;this.previouslyFocused=null,n?.isConnected&&window.setTimeout(()=>{n.focus({preventScroll:!0})},0),this.dispatchEvent(new yp),this.dispatchEvent(new CustomEvent("pk-open-change",{detail:{open:!1},bubbles:!0,composed:!0}))}forceOverlayReset(){if(this.open=!1,this.yieldingToHostModal=!1,this.clearYieldPosition(),this.removeOpenListeners(),this.dialogElement?.open)try{this.dialogElement.close()}catch{}this.dialogElement?.classList.remove("hide","show","pulse"),this.disableScrollLock||Jn(this)}addOpenListeners(){document.addEventListener("keydown",this.handleDocumentKeyDown),fp(this),this.hostModalObserver?.disconnect(),this.hostModalObserver=Vp(this.onHostModalPresenceChange),this.onHostModalPresenceChange(fr())}removeOpenListeners(){document.removeEventListener("keydown",this.handleDocumentKeyDown),gp(this),this.hostModalObserver?.disconnect(),this.hostModalObserver=null,this.yieldingToHostModal=!1,this.clearYieldPosition()}syncHasTriggerAttribute(){this.toggleAttribute("data-has-trigger",!!this.triggerElement)}onTriggerSlotChange(t){const[o]=t.target.assignedElements({flatten:!0});this.triggerElement&&this.triggerElement.removeEventListener("click",this.onTriggerClick),this.triggerElement=o??null,this.syncHasTriggerAttribute(),this.triggerElement&&this.triggerElement.addEventListener("click",this.onTriggerClick)}render(){const t=!this.hasCustomHeaderSlot()&&!this.withoutHeader&&!!this.label,o=t&&!this.withoutBodyPadding,n=this.querySelector(':scope > [slot="footer"]')!==null;return Y`
            <slot name="trigger" @slotchange=${this.onTriggerSlotChange}></slot>
            <dialog
                part="panel"
                class=${ze({dialog:!0,open:this.open,"dialog--wide":this.size==="wide"})}
                tabindex="-1"
                @cancel=${this.handleDialogCancel}
                @click=${this.handleDialogClick}
                @pointerdown=${this.handleDialogPointerDown}
            >
                <slot name="header">
                    ${t?Y`
                            <header part="header" class="header">
                                <h2 part="title" class="title">
                                    <slot name="label">${this.label}</slot>
                                </h2>
                                ${this.description?Y`
                                        <p part="description" class="description">
                                            <slot name="description">${this.description}</slot>
                                        </p>
                                    `:Y`<slot name="description" hidden></slot>`}
                                <button type="button" class="close" data-dialog="close" aria-label="Close">
                                    <span class="close-icon" aria-hidden="true">${Pl(qp)}</span>
                                </button>
                            </header>
                        `:U}
                </slot>
                <div
                    part="body"
                    class=${ze({body:!0,"body--padded":o})}
                >
                    <slot></slot>
                </div>
                ${n?Y`
                        <footer part="footer" class="footer">
                            <slot name="footer" @slotchange=${this.onFooterSlotChange}></slot>
                        </footer>
                    `:Y`<slot name="footer" @slotchange=${this.onFooterSlotChange} hidden></slot>`}
            </dialog>
        `}},to.styles=Bp,to);w([A({type:Boolean,reflect:!0})],Nt.prototype,"open",void 0);w([A()],Nt.prototype,"label",void 0);w([A()],Nt.prototype,"description",void 0);w([A({attribute:"disable-pointer-dismissal",type:Boolean,reflect:!0})],Nt.prototype,"disablePointerDismissal",void 0);w([A({attribute:"without-header",type:Boolean,reflect:!0})],Nt.prototype,"withoutHeader",void 0);w([A({attribute:"without-body-padding",type:Boolean,reflect:!0})],Nt.prototype,"withoutBodyPadding",void 0);w([A({attribute:"disable-scroll-lock",type:Boolean,reflect:!0})],Nt.prototype,"disableScrollLock",void 0);w([A({reflect:!0})],Nt.prototype,"size",void 0);w([$n("dialog")],Nt.prototype,"dialogElement",void 0);w([Re()],Nt.prototype,"triggerElement",void 0);Nt=w([io("pk-dialog")],Nt);var Kp=Pr({name:"PkDialog",tagName:"pk-dialog"}),vt=Uo({name:"PkCheckbox",inheritAttrs:!1,props:{checked:{type:Boolean,default:!1},indeterminate:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},invalid:{type:Boolean,default:!1},required:{type:Boolean,default:!1},name:{type:String,default:void 0},value:{type:String,default:"on"},dataState:{type:String,default:void 0}},emits:{"update:checked":e=>typeof e=="boolean"},setup(e,{attrs:t,slots:o,emit:n}){const r=i=>{const s=t.onPkChange;s?.(i),n("update:checked",Ip(i))};return()=>oo("pk-checkbox",{...t,checked:e.checked,indeterminate:e.indeterminate||void 0,disabled:e.disabled||void 0,invalid:e.invalid||void 0,required:e.required||void 0,...e.name?{name:e.name}:{},checkboxValue:e.value,...e.dataState?{"data-state":e.dataState}:{},onPkChange:r},Lr(o))}}),pe=Uo({name:"PkButton",inheritAttrs:!1,props:{variant:{type:String,default:"default"},size:{type:String,default:"default"},loading:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},type:{type:String,default:"button"},spinnerVariant:{type:String,default:void 0},spinnerTone:{type:String,default:void 0},dataState:{type:String,default:void 0},withCaret:{type:Boolean,default:!1},groupTrigger:{type:Boolean,default:!1}},setup(e,{attrs:t,slots:o}){return()=>oo("pk-button",{...t,variant:e.variant,size:e.size,loading:e.loading||void 0,disabled:e.disabled||void 0,type:e.type,...e.spinnerVariant?{"spinner-variant":e.spinnerVariant}:{},...e.spinnerTone?{"spinner-tone":e.spinnerTone}:{},...e.dataState?{"data-state":e.dataState}:{},...e.withCaret?{"with-caret":""}:{},...e.groupTrigger?{"group-trigger":""}:{}},Lr(o))}}),Wp={"pk-spinner":"components/spinner/spinner.js","pk-icon":"components/icon/icon.js","pk-button":"components/button/button.js","pk-checkbox":"components/checkbox/checkbox.js","pk-checkbox-select":"components/checkbox-select/checkbox-select.js","pk-color-input":"components/color-input/color-input.js","pk-code-editor":"components/code-editor/code-editor.js","pk-input":"components/input/input.js","pk-input-group":"components/input-group/input-group.js","pk-input-group-addon":"components/input-group/input-group-addon.js","pk-input-group-button":"components/input-group/input-group-button.js","pk-input-group-input":"components/input-group/input-group-input.js","pk-input-group-text":"components/input-group/input-group-text.js","pk-input-group-textarea":"components/input-group/input-group-textarea.js","pk-textarea":"components/textarea/textarea.js","pk-tiptap-editor":"components/tiptap/tiptap-editor.js","pk-tiptap-input":"components/tiptap/tiptap-input.js","pk-tiptap-content":"components/tiptap/tiptap-content.js","pk-field":"components/field/field.js","pk-separator":"components/separator/separator.js","pk-status":"components/status/status.js","pk-toggle":"components/toggle/toggle.js","pk-toggle-group":"components/toggle-group/toggle-group.js","pk-lightswitch":"components/lightswitch/lightswitch.js","pk-button-group":"components/button-group/button-group.js","pk-button-group-separator":"components/button-group/button-group-separator.js","pk-button-group-text":"components/button-group/button-group-text.js","pk-dialog":"components/dialog/dialog.js","pk-popup":"components/popup/popup.js","pk-dropdown-label":"components/dropdown-menu/dropdown-label.js","pk-dropdown-item":"components/dropdown-menu/dropdown-item.js","pk-dropdown-separator":"components/dropdown-menu/dropdown-separator.js","pk-dropdown-menu":"components/dropdown-menu/dropdown-menu.js","pk-popover":"components/popover/popover.js","pk-tooltip":"components/tooltip/tooltip.js","pk-radio":"components/radio-group/radio.js","pk-radio-group":"components/radio-group/radio-group.js","pk-tab":"components/tabs/tab.js","pk-tab-heading":"components/tabs/tab-heading.js","pk-tab-panel":"components/tabs/tab-panel.js","pk-tabs":"components/tabs/tabs.js","pk-scroll-area":"components/scroll-area/scroll-area.js","pk-option":"components/select/option.js","pk-option-group":"components/select/option-group.js","pk-select":"components/select/select.js","pk-calendar":"components/calendar/calendar.js","pk-date-picker":"components/date-picker/date-picker.js","pk-combobox":"components/combobox/combobox.js","pk-time-picker":"components/time-picker/time-picker.js","pk-copy-button":"components/copy-button/copy-button.js","pk-connect":"components/connect/connect.js","pk-connect-oauth":"components/connect/connect-oauth.js","pk-editable-table":"components/editable-table/editable-table.js"},Gp={"components/spinner/spinner":"src/components/spinner/pk-spinner.ts","components/icon/icon":"src/components/icon/pk-icon-loader.ts","components/button/button":"src/components/button/pk-button.ts","components/checkbox/checkbox":"src/components/checkbox/pk-checkbox.ts","components/checkbox-select/checkbox-select":"src/components/checkbox-select/pk-checkbox-select.ts","components/color-input/color-input":"src/components/color-input/pk-color-input.ts","components/code-editor/code-editor":"src/components/code-editor/pk-code-editor.ts","components/input/input":"src/components/input/pk-input.ts","components/input-group/input-group":"src/components/input-group/pk-input-group.ts","components/input-group/input-group-addon":"src/components/input-group/pk-input-group-addon.ts","components/input-group/input-group-button":"src/components/input-group/pk-input-group-button.ts","components/input-group/input-group-input":"src/components/input-group/pk-input-group-input.ts","components/input-group/input-group-text":"src/components/input-group/pk-input-group-text.ts","components/input-group/input-group-textarea":"src/components/input-group/pk-input-group-textarea.ts","components/textarea/textarea":"src/components/textarea/pk-textarea.ts","components/tiptap/tiptap-editor":"src/components/tiptap/pk-tiptap-editor.ts","components/tiptap/tiptap-input":"src/components/tiptap/pk-tiptap-input.ts","components/tiptap/tiptap-content":"src/components/tiptap/pk-tiptap-content.ts","components/field/field":"src/components/field/pk-field.ts","components/separator/separator":"src/components/separator/pk-separator.ts","components/status/status":"src/components/status/pk-status.ts","components/toggle/toggle":"src/components/toggle/pk-toggle.ts","components/toggle-group/toggle-group":"src/components/toggle-group/pk-toggle-group.ts","components/lightswitch/lightswitch":"src/components/lightswitch/pk-lightswitch.ts","components/button-group/button-group":"src/components/button-group/pk-button-group.ts","components/button-group/button-group-separator":"src/components/button-group/pk-button-group-separator.ts","components/button-group/button-group-text":"src/components/button-group/pk-button-group-text.ts","components/dialog/dialog":"src/components/dialog/pk-dialog.ts","components/popup/popup":"src/components/popup/pk-popup.ts","components/dropdown-menu/dropdown-label":"src/components/dropdown-menu/pk-dropdown-label.ts","components/dropdown-menu/dropdown-item":"src/components/dropdown-menu/pk-dropdown-item.ts","components/dropdown-menu/dropdown-separator":"src/components/dropdown-menu/pk-dropdown-separator.ts","components/dropdown-menu/dropdown-menu":"src/components/dropdown-menu/pk-dropdown-menu.ts","components/popover/popover":"src/components/popover/pk-popover.ts","components/tooltip/tooltip":"src/components/tooltip/pk-tooltip.ts","components/radio-group/radio":"src/components/radio-group/pk-radio.ts","components/radio-group/radio-group":"src/components/radio-group/pk-radio-group.ts","components/tabs/tab":"src/components/tabs/pk-tab.ts","components/tabs/tab-heading":"src/components/tabs/pk-tab-heading.ts","components/tabs/tab-panel":"src/components/tabs/pk-tab-panel.ts","components/tabs/tabs":"src/components/tabs/pk-tabs.ts","components/scroll-area/scroll-area":"src/components/scroll-area/pk-scroll-area.ts","components/select/option":"src/components/select/pk-option.ts","components/select/option-group":"src/components/select/pk-option-group.ts","components/select/select":"src/components/select/pk-select.ts","components/calendar/calendar":"src/components/calendar/pk-calendar.ts","components/date-picker/date-picker":"src/components/date-picker/pk-date-picker.ts","components/combobox/combobox":"src/components/combobox/pk-combobox.ts","components/time-picker/time-picker":"src/components/time-picker/pk-time-picker.ts","components/copy-button/copy-button":"src/components/copy-button/pk-copy-button.ts","components/connect/connect":"src/components/connect/pk-connect.ts","components/connect/connect-oauth":"src/components/connect/pk-connect-oauth.ts","components/editable-table/editable-table":"src/components/editable-table/pk-editable-table.ts"},Jp={"src/components/icon/pk-icon-loader.ts":"src/components/icon/pk-icon.ts"},Yp=Object.fromEntries(Object.values(Gp).map(e=>{const t=Jp[e]??e;return[t.replace(/^src\//,"").replace(/\.ts$/,""),t]}));Object.fromEntries(Object.keys(Yp).map(e=>[e.split("/").pop(),`${e}.js`]));var Zp=e=>{e.trim()},Xp=e=>{const t=(e||[]).map(o=>o.trim()).filter(Boolean);t.length>0},Qp=e=>{e.shadowRootSelectors&&Xp(e.shadowRootSelectors)},gr="";function Bi(e){gr=e}function th(e=""){if(!gr){const t=document.querySelector("[data-plugin-kit]");if(t?.hasAttribute("data-plugin-kit")){const o=new URL(t.getAttribute("data-plugin-kit")??"",window.location.href).pathname;Bi(o)}else{const o=[...document.getElementsByTagName("script")].find(n=>n.src.endsWith("plugin-kit.js")||n.src.endsWith("plugin-kit.loader.js"));o&&Bi(String(o.getAttribute("src")).split("/").slice(0,-1).join("/"))}}return gr.replace(/\/$/,"")+(e?`/${e.replace(/^\//,"")}`:"")}var Yn="pk-",eh="pk-discovery-complete";new MutationObserver(e=>{for(const{addedNodes:t}of e)for(const o of t)o.nodeType===Node.ELEMENT_NODE&&oh(o)});async function oh(e=document){const t=e instanceof Element?e.tagName.toLowerCase():"",o=t.startsWith(Yn),n=[...e.querySelectorAll(":not(:defined)")].map(l=>l.tagName.toLowerCase()).filter(l=>l.startsWith(Yn));o&&!customElements.get(t)&&n.push(t);const r=e.querySelectorAll("[data-pk-preload]"),i=e instanceof Element&&e.hasAttribute("data-pk-preload")?[e,...r]:r;for(const l of i)n.push(...l.getAttribute("data-pk-preload").split(/\s+/).filter(d=>d.startsWith(Yn)));const s=[...new Set(n)],a=await Promise.allSettled(s.map(l=>nh(l)));for(const l of a)l.status==="rejected"&&console.warn(l.reason);await new Promise(requestAnimationFrame),e.dispatchEvent(new CustomEvent(eh,{bubbles:!1,cancelable:!1,composed:!0}))}function nh(e){if(customElements.get(e))return Promise.resolve();const t=Wp[e];return t?import(th(t)).then(()=>{}):Promise.reject(new Error(`Unable to autoload <${e}> — no module path registered`))}var rh=Object.create,Hl=Object.defineProperty,ih=Object.getOwnPropertyDescriptor,sh=Object.getOwnPropertyNames,ah=Object.getPrototypeOf,lh=Object.prototype.hasOwnProperty,dt=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),ch=(e,t,o,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(var r=sh(t),i=0,s=r.length,a;i<s;i++)a=r[i],!lh.call(e,a)&&a!==o&&Hl(e,a,{get:(l=>t[l]).bind(null,a),enumerable:!(n=ih(t,a))||n.enumerable});return e},uh=(e,t,o)=>(o=e!=null?rh(ah(e)):{},ch(Hl(o,"default",{value:e,enumerable:!0}),e)),je=dt(((e,t)=>{function o(n){return n&&n.__esModule?n:{default:n}}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports})),Vl=dt(((e,t)=>{function o(n){"@babel/helpers - typeof";return t.exports=o=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(r){return typeof r}:function(r){return r&&typeof Symbol=="function"&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r},t.exports.__esModule=!0,t.exports.default=t.exports,o(n)}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports})),dh=dt(((e,t)=>{var o=Vl().default;function n(r,i){if(o(r)!="object"||!r)return r;var s=r[Symbol.toPrimitive];if(s!==void 0){var a=s.call(r,i||"default");if(o(a)!="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(i==="string"?String:Number)(r)}t.exports=n,t.exports.__esModule=!0,t.exports.default=t.exports})),Bl=dt(((e,t)=>{var o=Vl().default,n=dh();function r(i){var s=n(i,"string");return o(s)=="symbol"?s:s+""}t.exports=r,t.exports.__esModule=!0,t.exports.default=t.exports})),ph=dt(((e,t)=>{var o=Bl();function n(r,i,s){return(i=o(i))in r?Object.defineProperty(r,i,{value:s,enumerable:!0,configurable:!0,writable:!0}):r[i]=s,r}t.exports=n,t.exports.__esModule=!0,t.exports.default=t.exports})),so=dt(((e,t)=>{function o(n,r){if(!(n instanceof r))throw new TypeError("Cannot call a class as a function")}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports})),ao=dt(((e,t)=>{var o=Bl();function n(i,s){for(var a=0;a<s.length;a++){var l=s[a];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(i,o(l.key),l)}}function r(i,s,a){return s&&n(i.prototype,s),a&&n(i,a),Object.defineProperty(i,"prototype",{writable:!1}),i}t.exports=r,t.exports.__esModule=!0,t.exports.default=t.exports})),ql=dt(((e,t)=>{function o(n,r){(r==null||r>n.length)&&(r=n.length);for(var i=0,s=Array(r);i<r;i++)s[i]=n[i];return s}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports})),hh=dt(((e,t)=>{var o=ql();function n(r){if(Array.isArray(r))return o(r)}t.exports=n,t.exports.__esModule=!0,t.exports.default=t.exports})),fh=dt(((e,t)=>{function o(n){if(typeof Symbol<"u"&&n[Symbol.iterator]!=null||n["@@iterator"]!=null)return Array.from(n)}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports})),gh=dt(((e,t)=>{var o=ql();function n(r,i){if(r){if(typeof r=="string")return o(r,i);var s={}.toString.call(r).slice(8,-1);return s==="Object"&&r.constructor&&(s=r.constructor.name),s==="Map"||s==="Set"?Array.from(r):s==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s)?o(r,i):void 0}}t.exports=n,t.exports.__esModule=!0,t.exports.default=t.exports})),vh=dt(((e,t)=>{function o(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports})),bh=dt(((e,t)=>{var o=hh(),n=fh(),r=gh(),i=vh();function s(a){return o(a)||n(a)||r(a)||i()}t.exports=s,t.exports.__esModule=!0,t.exports.default=t.exports})),mh=dt((e=>{var t=je()(bh()),o={functions:"Jexl Function",transforms:"Transform"};e.ArrayLiteral=function(n){return this.evalArray(n.value)},e.BinaryExpression=function(n){var r=this,i=this._grammar.elements[n.operator];if(i.evalOnDemand){var s=function(l){return{eval:function(){return r.eval(l)}}};return i.evalOnDemand(s(n.left),s(n.right))}return this.Promise.all([this.eval(n.left),this.eval(n.right)]).then(function(a){return i.eval(a[0],a[1])})},e.ConditionalExpression=function(n){var r=this;return this.eval(n.test).then(function(i){return i?n.consequent?r.eval(n.consequent):i:r.eval(n.alternate)})},e.FilterExpression=function(n){var r=this;return this.eval(n.subject).then(function(i){return n.relative?r._filterRelative(i,n.expr):r._filterStatic(i,n.expr)})},e.Identifier=function(n){return n.from?this.eval(n.from).then(function(r){if(r!=null)return Array.isArray(r)&&(r=r[0]),r[n.value]}):n.relative?this._relContext[n.value]:this._context[n.value]},e.Literal=function(n){return n.value},e.ObjectLiteral=function(n){return this.evalMap(n.value)},e.FunctionCall=function(n){var r=o[n.pool];if(!r)throw new Error("Corrupt AST: Pool '".concat(n.pool,"' not found"));var i=this._grammar[n.pool][n.name];if(!i)throw new Error("".concat(r," ").concat(n.name," is not defined."));return this.evalArray(n.args||[]).then(function(s){return i.apply(void 0,(0,t.default)(s))})},e.UnaryExpression=function(n){var r=this;return this.eval(n.right).then(function(i){return r._grammar.elements[n.operator].eval(i)})}})),yh=dt(((e,t)=>{var o=je(),n=o(so()),r=o(ao()),i=mh();t.exports=(function(){function s(a,l,d){var c=arguments.length>3&&arguments[3]!==void 0?arguments[3]:Promise;(0,n.default)(this,s),this._grammar=a,this._context=l||{},this._relContext=d||this._context,this.Promise=c}return(0,r.default)(s,[{key:"eval",value:function(l){var d=this;return this.Promise.resolve().then(function(){return i[l.type].call(d,l)})}},{key:"evalArray",value:function(l){var d=this;return this.Promise.all(l.map(function(c){return d.eval(c)}))}},{key:"evalMap",value:function(l){var d=this,c=Object.keys(l),p={},b=c.map(function(k){return d.eval(l[k])});return this.Promise.all(b).then(function(k){return k.forEach(function(y,O){p[c[O]]=y}),p})}},{key:"_filterRelative",value:function(l,d){var c=this,p=[];return Array.isArray(l)||(l=l===void 0?[]:[l]),l.forEach(function(b){var k=new s(c._grammar,c._context,b,c.Promise);p.push(k.eval(d))}),this.Promise.all(p).then(function(b){var k=[];return b.forEach(function(y,O){y&&k.push(l[O])}),k})}},{key:"_filterStatic",value:function(l,d){return this.eval(d).then(function(c){return typeof c=="boolean"?c?l:void 0:l[c]})}}]),s})()})),kh=dt(((e,t)=>{var o=je(),n=o(so()),r=o(ao()),i=/^-?(?:(?:[0-9]*\.[0-9]+)|[0-9]+)$/,s=/^[a-zA-Zа-яА-Я_\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF$][a-zA-Zа-яА-Я0-9_\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF$]*$/,a=/\\\\/,l=/^\s*$/,d=["'(?:(?:\\\\')|[^'])*'",'"(?:(?:\\\\")|[^"])*"',"\\s+","\\btrue\\b","\\bfalse\\b"],c=["[a-zA-Zа-яА-Я_À-ÖØ-öø-ÿ\\$][a-zA-Z0-9а-яА-Я_À-ÖØ-öø-ÿ\\$]*","(?:(?:[0-9]*\\.[0-9]+)|[0-9]+)"],p=["binaryOp","unaryOp","openParen","openBracket","question","colon"];t.exports=(function(){function b(k){(0,n.default)(this,b),this._grammar=k}return(0,r.default)(b,[{key:"getElements",value:function(y){var O=this._getSplitRegex();return y.split(O).filter(function(G){return G})}},{key:"getTokens",value:function(y){for(var O=[],G=!1,P=0;P<y.length;P++)this._isWhitespace(y[P])?O.length&&(O[O.length-1].raw+=y[P]):y[P]==="-"&&this._isNegative(O)?G=!0:(G&&(y[P]="-"+y[P],G=!1),O.push(this._createToken(y[P])));return G&&O.push(this._createToken("-")),O}},{key:"tokenize",value:function(y){var O=this.getElements(y);return this.getTokens(O)}},{key:"_createToken",value:function(y){var O={type:"literal",value:y,raw:y};if(y[0]==='"'||y[0]==="'")O.value=this._unquote(y);else if(y.match(i))O.value=parseFloat(y);else if(y==="true"||y==="false")O.value=y==="true";else if(this._grammar.elements[y])O.type=this._grammar.elements[y].type;else if(y.match(s))O.type="identifier";else throw new Error("Invalid expression token: ".concat(y));return O}},{key:"_escapeRegExp",value:function(y){return y=y.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),y.match(s)&&(y="\\b"+y+"\\b"),y}},{key:"_getSplitRegex",value:function(){var y=this;if(!this._splitRegex){var O=Object.keys(this._grammar.elements).sort(function(G,P){return P.length-G.length}).map(function(G){return y._escapeRegExp(G)},this);this._splitRegex=new RegExp("("+[d.join("|"),O.join("|"),c.join("|")].join("|")+")")}return this._splitRegex}},{key:"_isNegative",value:function(y){return y.length?p.some(function(O){return O===y[y.length-1].type}):!0}},{key:"_isWhitespace",value:function(y){return!!y.match(l)}},{key:"_unquote",value:function(y){var O=y[0],G=new RegExp("\\\\"+O,"g");return y.substr(1,y.length-2).replace(G,O).replace(a,"\\")}}]),b})()})),Kl=dt((e=>{e.argVal=function(t){t&&this._cursor.args.push(t)},e.arrayStart=function(){this._placeAtCursor({type:"ArrayLiteral",value:[]})},e.arrayVal=function(t){t&&this._cursor.value.push(t)},e.binaryOp=function(t){for(var o=this._grammar.elements[t.value].precedence||0,n=this._cursor._parent;n&&n.operator&&this._grammar.elements[n.operator].precedence>=o;)this._cursor=n,n=n._parent;var r={type:"BinaryExpression",operator:t.value,left:this._cursor};this._setParent(this._cursor,r),this._cursor=n,this._placeAtCursor(r)},e.dot=function(){this._nextIdentEncapsulate=this._cursor&&this._cursor.type!=="UnaryExpression"&&(this._cursor.type!=="BinaryExpression"||this._cursor.type==="BinaryExpression"&&this._cursor.right),this._nextIdentRelative=!this._cursor||this._cursor&&!this._nextIdentEncapsulate,this._nextIdentRelative&&(this._relative=!0)},e.filter=function(t){this._placeBeforeCursor({type:"FilterExpression",expr:t,relative:this._subParser.isRelative(),subject:this._cursor})},e.functionCall=function(){this._placeBeforeCursor({type:"FunctionCall",name:this._cursor.value,args:[],pool:"functions"})},e.identifier=function(t){var o={type:"Identifier",value:t.value};this._nextIdentEncapsulate?(o.from=this._cursor,this._placeBeforeCursor(o),this._nextIdentEncapsulate=!1):(this._nextIdentRelative&&(o.relative=!0,this._nextIdentRelative=!1),this._placeAtCursor(o))},e.literal=function(t){this._placeAtCursor({type:"Literal",value:t.value})},e.objKey=function(t){this._curObjKey=t.value},e.objStart=function(){this._placeAtCursor({type:"ObjectLiteral",value:{}})},e.objVal=function(t){this._cursor.value[this._curObjKey]=t},e.subExpression=function(t){this._placeAtCursor(t)},e.ternaryEnd=function(t){this._cursor.alternate=t},e.ternaryMid=function(t){this._cursor.consequent=t},e.ternaryStart=function(){this._tree={type:"ConditionalExpression",test:this._tree},this._cursor=this._tree},e.transform=function(t){this._placeBeforeCursor({type:"FunctionCall",name:t.value,args:[this._cursor],pool:"transforms"})},e.unaryOp=function(t){this._placeAtCursor({type:"UnaryExpression",operator:t.value})}})),_h=dt((e=>{var t=Kl();e.states={expectOperand:{tokenTypes:{literal:{toState:"expectBinOp"},identifier:{toState:"identifier"},unaryOp:{},openParen:{toState:"subExpression"},openCurl:{toState:"expectObjKey",handler:t.objStart},dot:{toState:"traverse"},openBracket:{toState:"arrayVal",handler:t.arrayStart}}},expectBinOp:{tokenTypes:{binaryOp:{toState:"expectOperand"},pipe:{toState:"expectTransform"},dot:{toState:"traverse"},question:{toState:"ternaryMid",handler:t.ternaryStart}},completable:!0},expectTransform:{tokenTypes:{identifier:{toState:"postTransform",handler:t.transform}}},expectObjKey:{tokenTypes:{identifier:{toState:"expectKeyValSep",handler:t.objKey},closeCurl:{toState:"expectBinOp"}}},expectKeyValSep:{tokenTypes:{colon:{toState:"objVal"}}},postTransform:{tokenTypes:{openParen:{toState:"argVal"},binaryOp:{toState:"expectOperand"},dot:{toState:"traverse"},openBracket:{toState:"filter"},pipe:{toState:"expectTransform"}},completable:!0},postArgs:{tokenTypes:{binaryOp:{toState:"expectOperand"},dot:{toState:"traverse"},openBracket:{toState:"filter"},pipe:{toState:"expectTransform"}},completable:!0},identifier:{tokenTypes:{binaryOp:{toState:"expectOperand"},dot:{toState:"traverse"},openBracket:{toState:"filter"},openParen:{toState:"argVal",handler:t.functionCall},pipe:{toState:"expectTransform"},question:{toState:"ternaryMid",handler:t.ternaryStart}},completable:!0},traverse:{tokenTypes:{identifier:{toState:"identifier"}}},filter:{subHandler:t.filter,endStates:{closeBracket:"identifier"}},subExpression:{subHandler:t.subExpression,endStates:{closeParen:"expectBinOp"}},argVal:{subHandler:t.argVal,endStates:{comma:"argVal",closeParen:"postArgs"}},objVal:{subHandler:t.objVal,endStates:{comma:"expectObjKey",closeCurl:"expectBinOp"}},arrayVal:{subHandler:t.arrayVal,endStates:{comma:"arrayVal",closeBracket:"expectBinOp"}},ternaryMid:{subHandler:t.ternaryMid,endStates:{colon:"ternaryEnd"}},ternaryEnd:{subHandler:t.ternaryEnd,completable:!0}}})),xh=dt(((e,t)=>{var o=je(),n=o(so()),r=o(ao()),i=Kl(),s=_h().states;t.exports=(function(){function a(l,d,c){(0,n.default)(this,a),this._grammar=l,this._state="expectOperand",this._tree=null,this._exprStr=d||"",this._relative=!1,this._stopMap=c||{}}return(0,r.default)(a,[{key:"addToken",value:function(d){if(this._state==="complete")throw new Error("Cannot add a new token to a completed Parser");var c=s[this._state],p=this._exprStr;if(this._exprStr+=d.raw,c.subHandler){this._subParser||this._startSubExpression(p);var b=this._subParser.addToken(d);if(b){if(this._endSubExpression(),this._parentStop)return b;this._state=b}}else if(c.tokenTypes[d.type]){var k=c.tokenTypes[d.type],y=i[d.type];k.handler&&(y=k.handler),y&&y.call(this,d),k.toState&&(this._state=k.toState)}else{if(this._stopMap[d.type])return this._stopMap[d.type];throw new Error("Token ".concat(d.raw," (").concat(d.type,") unexpected in expression: ").concat(this._exprStr))}return!1}},{key:"addTokens",value:function(d){d.forEach(this.addToken,this)}},{key:"complete",value:function(){if(this._cursor&&!s[this._state].completable)throw new Error("Unexpected end of expression: ".concat(this._exprStr));return this._subParser&&this._endSubExpression(),this._state="complete",this._cursor?this._tree:null}},{key:"isRelative",value:function(){return this._relative}},{key:"_endSubExpression",value:function(){s[this._state].subHandler.call(this,this._subParser.complete()),this._subParser=null}},{key:"_placeAtCursor",value:function(d){this._cursor?(this._cursor.right=d,this._setParent(d,this._cursor)):this._tree=d,this._cursor=d}},{key:"_placeBeforeCursor",value:function(d){this._cursor=this._cursor._parent,this._placeAtCursor(d)}},{key:"_setParent",value:function(d,c){Object.defineProperty(d,"_parent",{value:c,writable:!0})}},{key:"_startSubExpression",value:function(d){var c=s[this._state].endStates;c||(this._parentStop=!0,c=this._stopMap),this._subParser=new a(this._grammar,d,c)}}]),a})()})),wh=dt(((e,t)=>{var o=je(),n=o(so()),r=o(ao()),i=(function(){function s(a){(0,n.default)(this,s),a(this._resolve.bind(this),this._reject.bind(this))}return(0,r.default)(s,[{key:"catch",value:function(l){if(this.error)try{this._resolve(l(this.error))}catch(d){this._reject(d)}return this}},{key:"then",value:function(l,d){if(!this.error)try{this._resolve(l(this.value))}catch(c){this._reject(c)}return d&&this.catch(d),this}},{key:"_reject",value:function(l){this.value=void 0,this.error=l}},{key:"_resolve",value:function(l){l instanceof s?l.error?this._reject(l.error):this._resolve(l.value):(this.value=l,this.error=void 0)}}]),s})();i.all=function(s){return new i(function(a){a(s.map(function(l){for(;l instanceof i;){if(l.error)throw Error(l.error);l=l.value}return l}))})},i.resolve=function(s){return new i(function(a){return a(s)})},i.reject=function(s){return new i(function(a,l){return l(s)})},t.exports=i})),Sh=dt(((e,t)=>{var o=je(),n=o(so()),r=o(ao()),i=yh(),s=kh(),a=xh(),l=wh();t.exports=(function(){function d(c,p){(0,n.default)(this,d),this._grammar=c,this._exprStr=p,this._ast=null}return(0,r.default)(d,[{key:"compile",value:function(){var p=new s(this._grammar),b=new a(this._grammar),k=p.tokenize(this._exprStr);return b.addTokens(k),this._ast=b.complete(),this}},{key:"eval",value:function(){var p=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return this._eval(p,Promise)}},{key:"evalSync",value:function(){var p=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},b=this._eval(p,l);if(b.error)throw b.error;return b.value}},{key:"_eval",value:function(p,b){var k=this;return b.resolve().then(function(){var y=k._getAst();return new i(k._grammar,p,void 0,b).eval(y)})}},{key:"_getAst",value:function(){return this._ast||this.compile(),this._ast}}]),d})()})),Ch=dt((e=>{e.getGrammar=function(){return{elements:{".":{type:"dot"},"[":{type:"openBracket"},"]":{type:"closeBracket"},"|":{type:"pipe"},"{":{type:"openCurl"},"}":{type:"closeCurl"},":":{type:"colon"},",":{type:"comma"},"(":{type:"openParen"},")":{type:"closeParen"},"?":{type:"question"},"+":{type:"binaryOp",precedence:30,eval:function(o,n){return o+n}},"-":{type:"binaryOp",precedence:30,eval:function(o,n){return o-n}},"*":{type:"binaryOp",precedence:40,eval:function(o,n){return o*n}},"/":{type:"binaryOp",precedence:40,eval:function(o,n){return o/n}},"//":{type:"binaryOp",precedence:40,eval:function(o,n){return Math.floor(o/n)}},"%":{type:"binaryOp",precedence:50,eval:function(o,n){return o%n}},"^":{type:"binaryOp",precedence:50,eval:function(o,n){return Math.pow(o,n)}},"==":{type:"binaryOp",precedence:20,eval:function(o,n){return o==n}},"!=":{type:"binaryOp",precedence:20,eval:function(o,n){return o!=n}},">":{type:"binaryOp",precedence:20,eval:function(o,n){return o>n}},">=":{type:"binaryOp",precedence:20,eval:function(o,n){return o>=n}},"<":{type:"binaryOp",precedence:20,eval:function(o,n){return o<n}},"<=":{type:"binaryOp",precedence:20,eval:function(o,n){return o<=n}},"&&":{type:"binaryOp",precedence:10,evalOnDemand:function(o,n){return o.eval().then(function(r){return r&&n.eval()})}},"||":{type:"binaryOp",precedence:10,evalOnDemand:function(o,n){return o.eval().then(function(r){return r||n.eval()})}},in:{type:"binaryOp",precedence:20,eval:function(o,n){return typeof n=="string"?n.indexOf(o)!==-1:Array.isArray(n)?n.some(function(r){return r===o}):!1}},"!":{type:"unaryOp",precedence:1/0,eval:function(o){return!o}}},functions:{},transforms:{}}}})),Zn=uh(dt(((e,t)=>{var o=je(),n=o(ph()),r=o(so()),i=o(ao()),s=Sh(),a=Ch().getGrammar,l=(function(){function d(){(0,r.default)(this,d),this.expr=this.expr.bind(this),this._grammar=a()}return(0,i.default)(d,[{key:"addBinaryOp",value:function(p,b,k,y){this._addGrammarElement(p,(0,n.default)({type:"binaryOp",precedence:b},y?"evalOnDemand":"eval",k))}},{key:"addFunction",value:function(p,b){this._grammar.functions[p]=b}},{key:"addFunctions",value:function(p){for(var b in p)this._grammar.functions[b]=p[b]}},{key:"addUnaryOp",value:function(p,b){this._addGrammarElement(p,{type:"unaryOp",weight:1/0,eval:b})}},{key:"addTransform",value:function(p,b){this._grammar.transforms[p]=b}},{key:"addTransforms",value:function(p){for(var b in p)this._grammar.transforms[b]=p[b]}},{key:"compile",value:function(p){return this.createExpression(p).compile()}},{key:"createExpression",value:function(p){return new s(this._grammar,p)}},{key:"getFunction",value:function(p){return this._grammar.functions[p]}},{key:"getTransform",value:function(p){return this._grammar.transforms[p]}},{key:"eval",value:function(p){var b=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};return this.createExpression(p).eval(b)}},{key:"evalSync",value:function(p){var b=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};return this.createExpression(p).evalSync(b)}},{key:"expr",value:function(p){for(var b=arguments.length,k=new Array(b>1?b-1:0),y=1;y<b;y++)k[y-1]=arguments[y];var O=p.reduce(function(G,P,W){var ot=W<k.length?k[W]:"";return G+=P+ot,G},"");return this.createExpression(O)}},{key:"removeOp",value:function(p){this._grammar.elements[p]&&(this._grammar.elements[p].type==="binaryOp"||this._grammar.elements[p].type==="unaryOp")&&delete this._grammar.elements[p]}},{key:"_addGrammarElement",value:function(p,b){this._grammar.elements[p]=b}}]),d})();t.exports=new l,t.exports.Jexl=l}))());"default"in Zn&&Zn.default;var Eh=e=>{e.trim()},$h=()=>{const e=globalThis.Craft;if(typeof e?.t=="function")return(t,o,n)=>e.t(t,o,n)},Ah=e=>{const{translationCategory:t,translate:o,hostBridge:n,portalClassName:r,portalContainer:i,shadowRootSelectors:s}=e;t&&Eh(t),o??$h(),n&&up(n),r&&Zp(r);const a={...i!==void 0?{portalContainer:i}:{},...s!==void 0?{shadowRootSelectors:s}:{}};(a.portalContainer!==void 0||a.shadowRootSelectors!==void 0)&&Qp(a)},zh=Symbol("pluginKitConfig"),Mh=Uo({name:"PluginKitProvider",props:{translationCategory:{type:String,default:void 0},translate:{type:Function,default:void 0},hostBridge:{type:Object,default:void 0},portalClassName:{type:String,default:void 0},portalContainer:{type:Object,default:void 0},shadowRootSelectors:{type:Array,default:void 0}},setup(e,{slots:t}){const o={...e.translationCategory?{translationCategory:e.translationCategory}:{},...e.translate?{translate:e.translate}:{},...e.hostBridge?{hostBridge:e.hostBridge}:{},...e.portalClassName?{portalClassName:e.portalClassName}:{},...e.portalContainer!==void 0?{portalContainer:e.portalContainer}:{},...e.shadowRootSelectors?{shadowRootSelectors:e.shadowRootSelectors}:{}};return Ah(o),zs(zh,o),()=>t.default?.()}});const Th={class:"af-page"},Oh={class:"af-page-header"},Lh=["href"],Ph={key:0,class:"af-banner af-banner--error",role:"alert"},Ih={class:"af-card"},Rh={key:0,class:"af-table-wrap"},jh={class:"af-table"},Uh=["href"],Nh={class:"af-actions"},Dh=["href"],Fh={key:1,class:"af-muted"},Hh={class:"af-page-header"},Vh=["href"],Bh={key:1,class:"af-banner af-banner--error",role:"alert"},qh={style:{margin:"0","padding-left":"18px"}},Kh={class:"af-card"},Wh={class:"af-grid"},Gh={key:0,class:"af-error"},Jh={key:0,class:"af-error"},Yh={key:0},Zh=["value"],Xh={key:0,class:"af-error"},Qh={key:1},tf=["value"],ef={key:0,class:"af-error"},of=["value"],nf={class:"af-toggle-list",style:{"margin-top":"16px"}},rf={class:"af-card"},sf={class:"af-page-header"},af={key:0,class:"af-muted"},lf={class:"af-row-head"},cf={class:"af-actions"},uf={class:"af-row-body"},df={class:"af-grid"},pf=["onUpdate:modelValue"],hf=["value"],ff={style:{"margin-top":"14px"}},gf={class:"af-toggle-list",style:{margin:"12px 0"}},vf={key:0,class:"af-toggle-list"},bf={key:1,class:"af-grid",style:{"margin-top":"14px"}},mf=["onUpdate:modelValue"],yf={key:0},kf={key:2,class:"af-card"},_f={class:"af-label"},xf=["onUpdate:modelValue"],wf={key:0},Sf={key:3,class:"af-card"},Cf={class:"af-grid"},Ef={class:"af-toggle-list",style:{"margin-top":"10px"}},$f={class:"af-card"},Af={key:0,class:"af-error"},zf={class:"af-page-header",style:{margin:"20px 0 8px"}},Mf={key:0,class:"af-muted"},Tf={class:"af-row-head"},Of={class:"af-row-body"},Lf={class:"af-grid"},Pf=["onUpdate:modelValue"],If=["value"],Rf={class:"af-toggle-list",style:{"margin-top":"12px"}},jf={key:0,class:"af-card",style:{"margin-top":"14px"}},Uf={class:"af-grid"},Nf={class:"af-toggle-list",style:{"margin-top":"10px"}},Df={class:"af-footer"},Ff=["href"],Hf=Uo({__name:"WorkflowApp",props:{options:{}},setup(e){const o=e.options||{},n=o.screen==="list",r=yn(o.workflow||{id:null,handle:"",name:"",scope:"entry",entryTypeUid:"",volumeUid:"",modelConfigUid:"",globalPrompt:"",actionButtonLabel:"",showUserPromptInput:!0,showOnSidebar:!1,rows:[],contextRows:[]}),i=xe(o.workflows||[]),s=xe([]),a=xe(o.metadataFields||[]),l=xe(!1),d=xe(""),c=xe("error"),p=xe({}),b=Yo(()=>s.value.filter(L=>!L.contextOnly)),k=Yo(()=>s.value),y=Yo(()=>r.scope==="entry"?r.entryTypeUid:r.volumeUid);function O(L){return L.handle?`${L.name} (${L.handle})`:L.name}function G(L,f){return!f||L.some(g=>g.uid===f)?L:[{uid:f,name:`Saved field (${f.slice(0,8)})`,adapter:""},...L]}function P(L,f=!0){return L==null?f:L===!0||L===1||L==="1"}function W(){return{targetFieldUid:"",prompt:"",requiresApproval:!0,includeCurrentFieldValue:!0,overrideCurrentValue:!0,enabled:!0,seomatic:{includeSeoTitle:!0,includeSiteNamePosition:!0,includeSeoDescription:!0,includeSeoKeywords:!0},related:{mode:"topN",topN:25,forceUseCurrentValues:!1},link:{entry:{mode:"topN",count:10},category:{mode:"topN",count:10},asset:{mode:"topN",count:10}},assets:{metadata:["title","filename"],includeFile:!1,maxFiles:3}}}function ot(){r.rows=(r.rows||[]).map(L=>({...W(),...L,seomatic:{...W().seomatic,...L.seomatic||{}},related:{...W().related,...L.related||{}},link:{...W().link,...L.link||{}},assets:{...W().assets,...L.assets||{}}})),r.contextRows=(r.contextRows||[]).map(L=>({fieldUid:"",prompt:"",enabled:!0,...L,assets:{metadata:["title","filename"],includeFile:!1,maxFiles:1,...L.assets||{}}})),r.rows.length===0&&r.rows.push(W())}ot();function j(L){return s.value.find(f=>f.uid===L)?.adapter||""}function pt(L){return["entries","categories","tags"].includes(j(L.targetFieldUid))}function Bt(L){return j(L.fieldUid)==="assets"||L.fieldUid==="__asset__:file"}function ht(L){return p.value[L]?.[0]||""}function Dt(L,f){const g=L+f;if(g<0||g>=r.rows.length)return;const[I]=r.rows.splice(L,1);r.rows.splice(g,0,I)}function Ue(){r.contextRows.push({fieldUid:"",prompt:"",enabled:!0,assets:{metadata:["title","filename"],includeFile:!1,maxFiles:1}})}async function Ft(L,f){const g=await fetch(L,{method:f===void 0?"GET":"POST",headers:f===void 0?{Accept:"application/json"}:{"Content-Type":"application/json",Accept:"application/json","X-CSRF-Token":window.Craft?.csrfTokenValue||""},body:f===void 0?void 0:JSON.stringify(f),credentials:"same-origin"}),I=await g.json();if(!g.ok||I.success===!1)throw Object.assign(new Error(I.error||`Request failed (${g.status})`),{payload:I});return I}async function _e(){if(s.value=[],!(!y.value||!o.fieldsUrl))try{const L=await Ft(o.fieldsUrl,{scope:r.scope,entryTypeUid:r.entryTypeUid,volumeUid:r.volumeUid});s.value=Array.isArray(L.fields)?L.fields:[],a.value=Array.isArray(L.metadataFields)?L.metadataFields:[]}catch(L){c.value="error",d.value=L.message||"Could not load fields for this scope."}}Go(y,_e,{immediate:!0});async function Ne(){l.value=!0,p.value={},d.value="";try{const L=JSON.parse(JSON.stringify(r));L.rows=L.rows.map(g=>({...g,requiresApproval:P(g.requiresApproval),includeCurrentFieldValue:P(g.includeCurrentFieldValue),overrideCurrentValue:P(g.overrideCurrentValue),enabled:P(g.enabled),seomatic:Object.fromEntries(Object.entries(g.seomatic||{}).map(([I,E])=>[I,P(E)])),related:{...g.related,forceUseCurrentValues:P(g.related?.forceUseCurrentValues,!1)}})),L.contextRows=L.contextRows.map(g=>({...g,enabled:P(g.enabled)}));const f=await Ft(o.saveUrl,{workflow:L});c.value="success",d.value="Workflow saved.",f.workflow&&Object.assign(r,f.workflow),window.history.replaceState({},"",f.editUrl||o.editUrl||window.location.href)}catch(L){const f=L.payload?.errors;f&&typeof f=="object"&&(p.value=f),c.value="error",d.value=L.message||"Could not save this workflow."}finally{l.value=!1}}async function De(L){if(window.confirm(`Delete “${L.name}”? Fields that reference this handle will no longer show Autofill until a workflow with the same handle exists.`))try{await Ft(o.deleteUrl,{id:L.id}),i.value=i.value.filter(f=>f.id!==L.id)}catch(f){c.value="error",d.value=f.message||"Could not delete workflow."}}function Et(L,f,g,I=!1){const E=g.target.value;L[f]=I?Number(E):String(E??"")}return(L,f)=>(D(),V("main",Th,[n?(D(),V(ct,{key:0},[m("header",Oh,[f[12]||(f[12]=m("div",null,[m("h1",null,"Workflows"),m("p",{class:"af-muted"},"Create and manage Autofill configurations for entries and assets.")],-1)),m("a",{class:"btn submit",href:B(o).newUrl},"New workflow",8,Lh)]),d.value?(D(),V("div",Ph,rt(d.value),1)):gt("",!0),m("section",Ih,[i.value.length?(D(),V("div",Rh,[m("table",jh,[f[14]||(f[14]=m("thead",null,[m("tr",null,[m("th",null,"Name"),m("th",null,"Handle"),m("th",null,"Scope"),m("th",null,"Sidebar"),m("th")])],-1)),m("tbody",null,[(D(!0),V(ct,null,It(i.value,g=>(D(),V("tr",{key:g.id},[m("td",null,[m("a",{class:"af-link",href:`${B(o).editBaseUrl}/${encodeURIComponent(g.handle)}`},rt(g.name),9,Uh)]),m("td",null,[m("code",null,rt(g.handle),1)]),m("td",null,rt(g.scope==="asset"?g.volumeName||"Asset volume":g.entryTypeName||"Entry type"),1),m("td",null,rt(g.showOnSidebar?"Shown":"Hidden"),1),m("td",Nh,[m("a",{class:"btn small",href:`${B(o).editBaseUrl}/${encodeURIComponent(g.handle)}`},"Edit",8,Dh),q(B(pe),{size:"sm",variant:"outline",onClick:I=>De(g)},{default:it(()=>[...f[13]||(f[13]=[st("Delete",-1)])]),_:1},8,["onClick"])])]))),128))])])])):(D(),V("p",Fh,"No workflows yet. Create one to configure generation for an entry type or asset volume."))])],64)):(D(),V(ct,{key:1},[m("header",Hh,[m("div",null,[m("h1",null,rt(r.id?"Edit workflow":"New workflow"),1),f[15]||(f[15]=m("p",{class:"af-muted"},"Configure generation, context, and review behavior.",-1))]),m("a",{class:"btn",href:B(o).listUrl},"Back to workflows",8,Vh)]),d.value?(D(),V("div",{key:0,class:vn(["af-banner",c.value==="success"?"af-banner--success":"af-banner--error"]),role:"status"},rt(d.value),3)):gt("",!0),Object.keys(p.value).length?(D(),V("div",Bh,[m("ul",qh,[(D(!0),V(ct,null,It(p.value,(g,I)=>(D(),V("li",{key:I},rt(g.join(" ")),1))),128))])])):gt("",!0),m("section",Kh,[f[29]||(f[29]=m("h2",null,"Workflow details",-1)),m("div",Wh,[m("div",null,[q(B(Ee),{class:"af-control",label:"Name",value:r.name,autocomplete:"off",onInput:f[0]||(f[0]=g=>Et(r,"name",g))},null,8,["value"]),ht("name")?(D(),V("span",Gh,rt(ht("name")),1)):gt("",!0)]),m("div",null,[q(B(Ee),{class:"af-control code",label:"Handle",value:r.handle,autocomplete:"off",onInput:f[1]||(f[1]=g=>Et(r,"handle",g))},null,8,["value"]),f[16]||(f[16]=m("span",{class:"af-muted"},"Fields reference workflows by handle.",-1)),ht("handle")?(D(),V("span",Jh,rt(ht("handle")),1)):gt("",!0)]),m("label",null,[f[18]||(f[18]=m("span",{class:"af-label"},"Applies to",-1)),ue(m("select",{class:"select fullwidth","onUpdate:modelValue":f[2]||(f[2]=g=>r.scope=g)},[...f[17]||(f[17]=[m("option",{value:"entry"},"Entries",-1),m("option",{value:"asset"},"Assets",-1)])],512),[[de,r.scope]])]),r.scope==="entry"?(D(),V("label",Yh,[f[20]||(f[20]=m("span",{class:"af-label"},"Entry type",-1)),ue(m("select",{class:"select fullwidth","onUpdate:modelValue":f[3]||(f[3]=g=>r.entryTypeUid=g)},[f[19]||(f[19]=m("option",{value:""},"Select an entry type",-1)),(D(!0),V(ct,null,It(B(o).entryTypes,g=>(D(),V("option",{key:g.uid,value:g.uid},rt(g.name),9,Zh))),128))],512),[[de,r.entryTypeUid]]),ht("entryTypeUid")?(D(),V("span",Xh,rt(ht("entryTypeUid")),1)):gt("",!0)])):(D(),V("label",Qh,[f[22]||(f[22]=m("span",{class:"af-label"},"Asset volume",-1)),ue(m("select",{class:"select fullwidth","onUpdate:modelValue":f[4]||(f[4]=g=>r.volumeUid=g)},[f[21]||(f[21]=m("option",{value:""},"Select an asset volume",-1)),(D(!0),V(ct,null,It(B(o).volumes,g=>(D(),V("option",{key:g.uid,value:g.uid},rt(g.name),9,tf))),128))],512),[[de,r.volumeUid]]),ht("volumeUid")?(D(),V("span",ef,rt(ht("volumeUid")),1)):gt("",!0)])),m("label",null,[f[24]||(f[24]=m("span",{class:"af-label"},"Model configuration",-1)),ue(m("select",{class:"select fullwidth","onUpdate:modelValue":f[5]||(f[5]=g=>r.modelConfigUid=g)},[f[23]||(f[23]=m("option",{value:""},"Use the default configured model",-1)),(D(!0),V(ct,null,It(B(o).modelConfigs,g=>(D(),V("option",{key:g.uid,value:g.uid},rt(g.label||g.modelId||g.provider),9,of))),128))],512),[[de,r.modelConfigUid]]),f[25]||(f[25]=m("span",{class:"af-muted"},"Credentials stay in plugin settings.",-1))]),m("div",null,[q(B(Ee),{class:"af-control",label:"Action button label",value:r.actionButtonLabel,placeholder:"Autofill",onInput:f[6]||(f[6]=g=>Et(r,"actionButtonLabel",g))},null,8,["value"])])]),m("div",nf,[q(B(vt),{class:"af-toggle",checked:r.showUserPromptInput,"onUpdate:checked":f[7]||(f[7]=g=>r.showUserPromptInput=g)},{default:it(()=>[...f[26]||(f[26]=[st("Let editors add a prompt",-1)])]),_:1},8,["checked"]),r.scope==="entry"?(D(),vo(B(vt),{key:0,class:"af-toggle",checked:r.showOnSidebar,"onUpdate:checked":f[8]||(f[8]=g=>r.showOnSidebar=g)},{default:it(()=>[...f[27]||(f[27]=[st("Show this workflow in the entry sidebar",-1)])]),_:1},8,["checked"])):(D(),vo(B(vt),{key:1,class:"af-toggle",checked:r.showOnSidebar,"onUpdate:checked":f[9]||(f[9]=g=>r.showOnSidebar=g)},{default:it(()=>[...f[28]||(f[28]=[st("Show this workflow in the asset sidebar",-1)])]),_:1},8,["checked"]))])]),m("section",rf,[m("div",sf,[f[31]||(f[31]=m("div",null,[m("h2",null,"Output fields"),m("p",{class:"af-muted"},"Rows run in order. Each row describes one output.")],-1)),q(B(pe),{variant:"secondary",onClick:f[10]||(f[10]=g=>r.rows.push(W()))},{default:it(()=>[...f[30]||(f[30]=[st("Add output field",-1)])]),_:1})]),y.value?gt("",!0):(D(),V("p",af,"Choose a scope above to load its available fields.")),(D(!0),V(ct,null,It(r.rows,(g,I)=>(D(),V("article",{key:I,class:"af-row"},[m("div",lf,[m("strong",null,"Output "+rt(I+1),1),m("div",cf,[q(B(pe),{size:"sm",variant:"secondary",disabled:I===0,"aria-label":"Move up",onClick:E=>Dt(I,-1)},{default:it(()=>[...f[32]||(f[32]=[st("Move up",-1)])]),_:1},8,["disabled","onClick"]),q(B(pe),{size:"sm",variant:"secondary",disabled:I===r.rows.length-1,"aria-label":"Move down",onClick:E=>Dt(I,1)},{default:it(()=>[...f[33]||(f[33]=[st("Move down",-1)])]),_:1},8,["disabled","onClick"]),q(B(pe),{size:"sm",variant:"ghost",onClick:E=>r.rows.splice(I,1)},{default:it(()=>[...f[34]||(f[34]=[st("Remove",-1)])]),_:1},8,["onClick"])])]),m("div",uf,[m("div",df,[m("label",null,[f[36]||(f[36]=m("span",{class:"af-label"},"Target field",-1)),ue(m("select",{class:"select fullwidth","onUpdate:modelValue":E=>g.targetFieldUid=E},[f[35]||(f[35]=m("option",{value:""},"Select a field",-1)),(D(!0),V(ct,null,It(G(b.value,g.targetFieldUid),E=>(D(),V("option",{key:E.uid,value:E.uid},rt(O(E))+rt(E.availableInLiteVersion===!1?" · Pro":""),9,hf))),128))],8,pf),[[de,g.targetFieldUid]])]),m("div",null,[q(B(Wn),{class:"af-control",label:"Prompt",value:g.prompt,rows:"2",placeholder:"Describe how this field should be generated",onInput:E=>Et(g,"prompt",E)},null,8,["value","onInput"])])]),m("details",ff,[f[55]||(f[55]=m("summary",null,"Advanced settings",-1)),m("div",gf,[q(B(vt),{class:"af-toggle",checked:g.requiresApproval,"onUpdate:checked":E=>g.requiresApproval=E},{default:it(()=>[...f[37]||(f[37]=[st("Requires editor approval",-1)])]),_:1},8,["checked","onUpdate:checked"]),q(B(vt),{class:"af-toggle",checked:g.includeCurrentFieldValue,"onUpdate:checked":E=>g.includeCurrentFieldValue=E},{default:it(()=>[...f[38]||(f[38]=[st("Include current value in prompt",-1)])]),_:1},8,["checked","onUpdate:checked"]),q(B(vt),{class:"af-toggle",checked:g.overrideCurrentValue,"onUpdate:checked":E=>g.overrideCurrentValue=E},{default:it(()=>[...f[39]||(f[39]=[st("Override current value",-1)])]),_:1},8,["checked","onUpdate:checked"]),q(B(vt),{class:"af-toggle",checked:g.enabled,"onUpdate:checked":E=>g.enabled=E},{default:it(()=>[...f[40]||(f[40]=[st("Row enabled",-1)])]),_:1},8,["checked","onUpdate:checked"])]),j(g.targetFieldUid)==="seomatic"?(D(),V("div",vf,[f[45]||(f[45]=m("strong",null,"SEO prompt includes",-1)),q(B(vt),{class:"af-toggle",checked:g.seomatic.includeSeoTitle,"onUpdate:checked":E=>g.seomatic.includeSeoTitle=E},{default:it(()=>[...f[41]||(f[41]=[st("SEO title and source",-1)])]),_:1},8,["checked","onUpdate:checked"]),q(B(vt),{class:"af-toggle",checked:g.seomatic.includeSiteNamePosition,"onUpdate:checked":E=>g.seomatic.includeSiteNamePosition=E},{default:it(()=>[...f[42]||(f[42]=[st("Site name position and source",-1)])]),_:1},8,["checked","onUpdate:checked"]),q(B(vt),{class:"af-toggle",checked:g.seomatic.includeSeoDescription,"onUpdate:checked":E=>g.seomatic.includeSeoDescription=E},{default:it(()=>[...f[43]||(f[43]=[st("SEO description and source",-1)])]),_:1},8,["checked","onUpdate:checked"]),q(B(vt),{class:"af-toggle",checked:g.seomatic.includeSeoKeywords,"onUpdate:checked":E=>g.seomatic.includeSeoKeywords=E},{default:it(()=>[...f[44]||(f[44]=[st("SEO keywords and source",-1)])]),_:1},8,["checked","onUpdate:checked"])])):gt("",!0),pt(g)?(D(),V("div",bf,[m("label",null,[f[47]||(f[47]=m("span",{class:"af-label"},"Related selection",-1)),ue(m("select",{class:"select fullwidth","onUpdate:modelValue":E=>g.related.mode=E},[...f[46]||(f[46]=[m("option",{value:"topN"},"Top N",-1),m("option",{value:"all"},"All",-1)])],8,mf),[[de,g.related.mode]])]),g.related.mode==="topN"?(D(),V("div",yf,[q(B(Ee),{class:"af-control",label:"Top N",type:"number",min:"1",max:"500",value:g.related.topN,onInput:E=>Et(g.related,"topN",E,!0)},null,8,["value","onInput"])])):gt("",!0),q(B(vt),{class:"af-toggle",checked:g.related.forceUseCurrentValues,"onUpdate:checked":E=>g.related.forceUseCurrentValues=E},{default:it(()=>[...f[48]||(f[48]=[st("Keep selected related items first",-1)])]),_:1},8,["checked","onUpdate:checked"])])):gt("",!0),j(g.targetFieldUid)==="link"?(D(),V("div",kf,[f[50]||(f[50]=m("strong",null,"Link candidate scope",-1)),(D(),V(ct,null,It(["entry","category","asset"],E=>m("div",{key:E,class:"af-grid",style:{"margin-top":"12px"}},[m("label",null,[m("span",_f,rt(E)+" links",1),ue(m("select",{class:"select fullwidth","onUpdate:modelValue":Pt=>g.link[E].mode=Pt},[...f[49]||(f[49]=[m("option",{value:"topN"},"Top N",-1),m("option",{value:"mostRecent"},"Most recent",-1),m("option",{value:"all"},"All",-1),m("option",{value:"none"},"None",-1)])],8,xf),[[de,g.link[E].mode]])]),["all","none"].includes(g.link[E].mode)?gt("",!0):(D(),V("div",wf,[q(B(Ee),{class:"af-control",label:"Candidate count",type:"number",min:"1",max:"250",value:g.link[E].count,onInput:Pt=>Et(g.link[E],"count",Pt,!0)},null,8,["value","onInput"])]))])),64))])):gt("",!0),j(g.targetFieldUid)==="assets"?(D(),V("div",Sf,[f[53]||(f[53]=m("strong",null,"Asset context",-1)),f[54]||(f[54]=m("p",{class:"af-muted"},"Reads the first N selected assets in field order, up to the per-field limit below (1–20). Content support depends on the provider and model: JPEG, PNG, GIF, WebP, text/*, JSON, XML, and RTF are supported; PDFs are supported except with DeepSeek. Unsupported content stops the whole run. Each file is limited to 10 MiB, with a 20 MiB combined limit.",-1)),m("div",Cf,[q(B(vt),{class:"af-toggle",checked:g.assets.includeFile,"onUpdate:checked":E=>g.assets.includeFile=E},{default:it(()=>[...f[51]||(f[51]=[st("Include file content",-1)])]),_:1},8,["checked","onUpdate:checked"]),m("div",null,[q(B(Ee),{class:"af-control",label:"Maximum assets",type:"number",min:"1",max:"20",value:g.assets.maxFiles,onInput:E=>Et(g.assets,"maxFiles",E,!0)},null,8,["value","onInput"])])]),m("div",Ef,[f[52]||(f[52]=m("span",{class:"af-label"},"Metadata",-1)),(D(!0),V(ct,null,It(a.value,E=>(D(),vo(B(vt),{key:E.key,class:"af-toggle",checked:g.assets.metadata.includes(E.key),"onUpdate:checked":Pt=>g.assets.metadata=Pt?[...new Set([...g.assets.metadata,E.key])]:g.assets.metadata.filter(Ht=>Ht!==E.key)},{default:it(()=>[st(rt(E.label),1)]),_:2},1032,["checked","onUpdate:checked"]))),128))])])):gt("",!0)])])]))),128))]),m("section",$f,[f[66]||(f[66]=m("h2",null,"Global instructions and context",-1)),m("div",null,[q(B(Wn),{class:"af-control",label:"Global prompt",rows:"3",value:r.globalPrompt,placeholder:"Shared tone, quality, or compliance instructions",onInput:f[11]||(f[11]=g=>Et(r,"globalPrompt",g))},null,8,["value"]),ht("globalPrompt")?(D(),V("span",Af,rt(ht("globalPrompt")),1)):gt("",!0)]),m("div",zf,[f[57]||(f[57]=m("div",null,[m("h2",null,"Read-only context fields"),m("p",{class:"af-muted"},"These values inform generation and are never output targets.")],-1)),q(B(pe),{variant:"secondary",onClick:Ue},{default:it(()=>[...f[56]||(f[56]=[st("Add context field",-1)])]),_:1})]),y.value?gt("",!0):(D(),V("p",Mf,"Choose a scope above to load context fields.")),(D(!0),V(ct,null,It(r.contextRows,(g,I)=>(D(),V("article",{key:`ctx-${I}`,class:"af-row"},[m("div",Tf,[m("strong",null,"Context "+rt(I+1),1),q(B(pe),{size:"sm",variant:"ghost",onClick:E=>r.contextRows.splice(I,1)},{default:it(()=>[...f[58]||(f[58]=[st("Remove",-1)])]),_:1},8,["onClick"])]),m("div",Of,[m("div",Lf,[m("label",null,[f[60]||(f[60]=m("span",{class:"af-label"},"Context field",-1)),ue(m("select",{class:"select fullwidth","onUpdate:modelValue":E=>g.fieldUid=E},[f[59]||(f[59]=m("option",{value:""},"Select a field",-1)),(D(!0),V(ct,null,It(G(k.value,g.fieldUid),E=>(D(),V("option",{key:E.uid,value:E.uid},rt(O(E)),9,If))),128))],8,Pf),[[de,g.fieldUid]])]),m("div",null,[q(B(Wn),{class:"af-control",label:"Context prompt (optional)",rows:"2",value:g.prompt,placeholder:"How should the model interpret this field?",onInput:E=>Et(g,"prompt",E)},null,8,["value","onInput"])])]),m("div",Rf,[q(B(vt),{class:"af-toggle",checked:g.enabled,"onUpdate:checked":E=>g.enabled=E},{default:it(()=>[...f[61]||(f[61]=[st("Row enabled",-1)])]),_:1},8,["checked","onUpdate:checked"])]),Bt(g)?(D(),V("div",jf,[f[64]||(f[64]=m("strong",null,"Asset content",-1)),f[65]||(f[65]=m("p",{class:"af-muted"},"Reads the first N selected assets in field order, up to the per-field limit below (1–20). Content support depends on the provider and model: JPEG, PNG, GIF, WebP, text/*, JSON, XML, and RTF are supported; PDFs are supported except with DeepSeek. Unsupported content stops the whole run. Each file is limited to 10 MiB, with a 20 MiB combined limit.",-1)),m("div",Uf,[q(B(vt),{class:"af-toggle",checked:g.assets.includeFile,"onUpdate:checked":E=>g.assets.includeFile=E},{default:it(()=>[...f[62]||(f[62]=[st("Include file content",-1)])]),_:1},8,["checked","onUpdate:checked"]),m("div",null,[q(B(Ee),{class:"af-control",label:"Maximum assets",type:"number",min:"1",max:"20",value:g.assets.maxFiles,onInput:E=>Et(g.assets,"maxFiles",E,!0)},null,8,["value","onInput"])])]),m("div",Nf,[f[63]||(f[63]=m("span",{class:"af-label"},"Metadata",-1)),(D(!0),V(ct,null,It(a.value,E=>(D(),vo(B(vt),{key:E.key,class:"af-toggle",checked:g.assets.metadata.includes(E.key),"onUpdate:checked":Pt=>g.assets.metadata=Pt?[...new Set([...g.assets.metadata,E.key])]:g.assets.metadata.filter(Ht=>Ht!==E.key)},{default:it(()=>[st(rt(E.label),1)]),_:2},1032,["checked","onUpdate:checked"]))),128))])])):gt("",!0)])]))),128))]),m("footer",Df,[m("a",{class:"btn",href:B(o).listUrl},"Cancel",8,Ff),q(B(pe),{variant:"primary",loading:l.value,disabled:l.value,onClick:Ne},{default:it(()=>[st(rt(l.value?"Saving…":"Save workflow"),1)]),_:1},8,["loading","disabled"])])],64))]))}});window.AutofillPluginKitDialog=Kp;for(const e of document.querySelectorAll("[data-autofill-vue-root]")){const t=JSON.parse(e.dataset.options||"{}");dd({setup:()=>()=>oo(Mh,{translationCategory:"autofill"},{default:()=>oo(Hf,{options:t})})}).mount(e)}
