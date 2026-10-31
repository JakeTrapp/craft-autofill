/**
* @vue/shared v3.5.22
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function _s(e){const t=Object.create(null);for(const o of e.split(","))t[o]=1;return o=>o in t}const lt={},vo=[],de=()=>{},fa=()=>!1,li=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),Ss=e=>e.startsWith("onUpdate:"),Mt=Object.assign,Cs=(e,t)=>{const o=e.indexOf(t);o>-1&&e.splice(o,1)},Ru=Object.prototype.hasOwnProperty,rt=(e,t)=>Ru.call(e,t),q=Array.isArray,bo=e=>Cn(e)==="[object Map]",ci=e=>Cn(e)==="[object Set]",cr=e=>Cn(e)==="[object Date]",G=e=>typeof e=="function",kt=e=>typeof e=="string",ee=e=>typeof e=="symbol",ct=e=>e!==null&&typeof e=="object",ga=e=>(ct(e)||G(e))&&G(e.then)&&G(e.catch),ma=Object.prototype.toString,Cn=e=>ma.call(e),Iu=e=>Cn(e).slice(8,-1),va=e=>Cn(e)==="[object Object]",Es=e=>kt(e)&&e!=="NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e,en=_s(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),ui=e=>{const t=Object.create(null);return(o=>t[o]||(t[o]=e(o)))},Fu=/-\w/g,Ne=ui(e=>e.replace(Fu,t=>t.slice(1).toUpperCase())),Nu=/\B([A-Z])/g,Ue=ui(e=>e.replace(Nu,"-$1").toLowerCase()),ba=ui(e=>e.charAt(0).toUpperCase()+e.slice(1)),Li=ui(e=>e?`on${ba(e)}`:""),Ie=(e,t)=>!Object.is(e,t),In=(e,...t)=>{for(let o=0;o<e.length;o++)e[o](...t)},ya=(e,t,o,n=!1)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:n,value:o})},Vn=e=>{const t=parseFloat(e);return isNaN(t)?e:t};let ur;const di=()=>ur||(ur=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function As(e){if(q(e)){const t={};for(let o=0;o<e.length;o++){const n=e[o],i=kt(n)?Bu(n):As(n);if(i)for(const s in i)t[s]=i[s]}return t}else if(kt(e)||ct(e))return e}const Du=/;(?![^(]*\))/g,ju=/:([^]+)/,Uu=/\/\*[^]*?\*\//g;function Bu(e){const t={};return e.replace(Uu,"").split(Du).forEach(o=>{if(o){const n=o.split(ju);n.length>1&&(t[n[0].trim()]=n[1].trim())}}),t}function Yt(e){let t="";if(kt(e))t=e;else if(q(e))for(let o=0;o<e.length;o++){const n=Yt(e[o]);n&&(t+=n+" ")}else if(ct(e))for(const o in e)e[o]&&(t+=o+" ");return t.trim()}const Hu="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",Vu=_s(Hu);function ka(e){return!!e||e===""}function qu(e,t){if(e.length!==t.length)return!1;let o=!0;for(let n=0;o&&n<e.length;n++)o=pi(e[n],t[n]);return o}function pi(e,t){if(e===t)return!0;let o=cr(e),n=cr(t);if(o||n)return o&&n?e.getTime()===t.getTime():!1;if(o=ee(e),n=ee(t),o||n)return e===t;if(o=q(e),n=q(t),o||n)return o&&n?qu(e,t):!1;if(o=ct(e),n=ct(t),o||n){if(!o||!n)return!1;const i=Object.keys(e).length,s=Object.keys(t).length;if(i!==s)return!1;for(const r in e){const a=e.hasOwnProperty(r),l=t.hasOwnProperty(r);if(a&&!l||!a&&l||!pi(e[r],t[r]))return!1}}return String(e)===String(t)}function Ku(e,t){return e.findIndex(o=>pi(o,t))}const wa=e=>!!(e&&e.__v_isRef===!0),tt=e=>kt(e)?e:e==null?"":q(e)||ct(e)&&(e.toString===ma||!G(e.toString))?wa(e)?tt(e.value):JSON.stringify(e,xa,2):String(e),xa=(e,t)=>wa(t)?xa(e,t.value):bo(t)?{[`Map(${t.size})`]:[...t.entries()].reduce((o,[n,i],s)=>(o[Oi(n,s)+" =>"]=i,o),{})}:ci(t)?{[`Set(${t.size})`]:[...t.values()].map(o=>Oi(o))}:ee(t)?Oi(t):ct(t)&&!q(t)&&!va(t)?String(t):t,Oi=(e,t="")=>{var o;return ee(e)?`Symbol(${(o=e.description)!=null?o:t})`:e};/**
* @vue/reactivity v3.5.22
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Bt;class Wu{constructor(t=!1){this.detached=t,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.parent=Bt,!t&&Bt&&(this.index=(Bt.scopes||(Bt.scopes=[])).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let t,o;if(this.scopes)for(t=0,o=this.scopes.length;t<o;t++)this.scopes[t].pause();for(t=0,o=this.effects.length;t<o;t++)this.effects[t].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let t,o;if(this.scopes)for(t=0,o=this.scopes.length;t<o;t++)this.scopes[t].resume();for(t=0,o=this.effects.length;t<o;t++)this.effects[t].resume()}}run(t){if(this._active){const o=Bt;try{return Bt=this,t()}finally{Bt=o}}}on(){++this._on===1&&(this.prevScope=Bt,Bt=this)}off(){this._on>0&&--this._on===0&&(Bt=this.prevScope,this.prevScope=void 0)}stop(t){if(this._active){this._active=!1;let o,n;for(o=0,n=this.effects.length;o<n;o++)this.effects[o].stop();for(this.effects.length=0,o=0,n=this.cleanups.length;o<n;o++)this.cleanups[o]();if(this.cleanups.length=0,this.scopes){for(o=0,n=this.scopes.length;o<n;o++)this.scopes[o].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!t){const i=this.parent.scopes.pop();i&&i!==this&&(this.parent.scopes[this.index]=i,i.index=this.index)}this.parent=void 0}}}function Gu(){return Bt}let ut;const Ri=new WeakSet;class _a{constructor(t){this.fn=t,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,Bt&&Bt.active&&Bt.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Ri.has(this)&&(Ri.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Ca(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,dr(this),Ea(this);const t=ut,o=te;ut=this,te=!0;try{return this.fn()}finally{Aa(this),ut=t,te=o,this.flags&=-3}}stop(){if(this.flags&1){for(let t=this.deps;t;t=t.nextDep)Ps(t);this.deps=this.depsTail=void 0,dr(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?Ri.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){es(this)&&this.run()}get dirty(){return es(this)}}let Sa=0,on,nn;function Ca(e,t=!1){if(e.flags|=8,t){e.next=nn,nn=e;return}e.next=on,on=e}function $s(){Sa++}function Ts(){if(--Sa>0)return;if(nn){let t=nn;for(nn=void 0;t;){const o=t.next;t.next=void 0,t.flags&=-9,t=o}}let e;for(;on;){let t=on;for(on=void 0;t;){const o=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(n){e||(e=n)}t=o}}if(e)throw e}function Ea(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function Aa(e){let t,o=e.depsTail,n=o;for(;n;){const i=n.prevDep;n.version===-1?(n===o&&(o=i),Ps(n),Yu(n)):t=n,n.dep.activeLink=n.prevActiveLink,n.prevActiveLink=void 0,n=i}e.deps=t,e.depsTail=o}function es(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&($a(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function $a(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===pn)||(e.globalVersion=pn,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!es(e))))return;e.flags|=2;const t=e.dep,o=ut,n=te;ut=e,te=!0;try{Ea(e);const i=e.fn(e._value);(t.version===0||Ie(i,e._value))&&(e.flags|=128,e._value=i,t.version++)}catch(i){throw t.version++,i}finally{ut=o,te=n,Aa(e),e.flags&=-3}}function Ps(e,t=!1){const{dep:o,prevSub:n,nextSub:i}=e;if(n&&(n.nextSub=i,e.prevSub=void 0),i&&(i.prevSub=n,e.nextSub=void 0),o.subs===e&&(o.subs=n,!n&&o.computed)){o.computed.flags&=-5;for(let s=o.computed.deps;s;s=s.nextDep)Ps(s,!0)}!t&&!--o.sc&&o.map&&o.map.delete(o.key)}function Yu(e){const{prevDep:t,nextDep:o}=e;t&&(t.nextDep=o,e.prevDep=void 0),o&&(o.prevDep=t,e.nextDep=void 0)}let te=!0;const Ta=[];function Se(){Ta.push(te),te=!1}function Ce(){const e=Ta.pop();te=e===void 0?!0:e}function dr(e){const{cleanup:t}=e;if(e.cleanup=void 0,t){const o=ut;ut=void 0;try{t()}finally{ut=o}}}let pn=0;class Xu{constructor(t,o){this.sub=t,this.dep=o,this.version=o.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class Ms{constructor(t){this.computed=t,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(t){if(!ut||!te||ut===this.computed)return;let o=this.activeLink;if(o===void 0||o.sub!==ut)o=this.activeLink=new Xu(ut,this),ut.deps?(o.prevDep=ut.depsTail,ut.depsTail.nextDep=o,ut.depsTail=o):ut.deps=ut.depsTail=o,Pa(o);else if(o.version===-1&&(o.version=this.version,o.nextDep)){const n=o.nextDep;n.prevDep=o.prevDep,o.prevDep&&(o.prevDep.nextDep=n),o.prevDep=ut.depsTail,o.nextDep=void 0,ut.depsTail.nextDep=o,ut.depsTail=o,ut.deps===o&&(ut.deps=n)}return o}trigger(t){this.version++,pn++,this.notify(t)}notify(t){$s();try{for(let o=this.subs;o;o=o.prevSub)o.sub.notify()&&o.sub.dep.notify()}finally{Ts()}}}function Pa(e){if(e.dep.sc++,e.sub.flags&4){const t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let n=t.deps;n;n=n.nextDep)Pa(n)}const o=e.dep.subs;o!==e&&(e.prevSub=o,o&&(o.nextSub=e)),e.dep.subs=e}}const os=new WeakMap,oo=Symbol(""),ns=Symbol(""),hn=Symbol("");function $t(e,t,o){if(te&&ut){let n=os.get(e);n||os.set(e,n=new Map);let i=n.get(o);i||(n.set(o,i=new Ms),i.map=n,i.key=o),i.track()}}function ye(e,t,o,n,i,s){const r=os.get(e);if(!r){pn++;return}const a=l=>{l&&l.trigger()};if($s(),t==="clear")r.forEach(a);else{const l=q(e),u=l&&Es(o);if(l&&o==="length"){const c=Number(n);r.forEach((d,m)=>{(m==="length"||m===hn||!ee(m)&&m>=c)&&a(d)})}else switch((o!==void 0||r.has(void 0))&&a(r.get(o)),u&&a(r.get(hn)),t){case"add":l?u&&a(r.get("length")):(a(r.get(oo)),bo(e)&&a(r.get(ns)));break;case"delete":l||(a(r.get(oo)),bo(e)&&a(r.get(ns)));break;case"set":bo(e)&&a(r.get(oo));break}}Ts()}function fo(e){const t=st(e);return t===e?t:($t(t,"iterate",hn),Jt(e)?t:t.map(Et))}function hi(e){return $t(e=st(e),"iterate",hn),e}const Ju={__proto__:null,[Symbol.iterator](){return Ii(this,Symbol.iterator,Et)},concat(...e){return fo(this).concat(...e.map(t=>q(t)?fo(t):t))},entries(){return Ii(this,"entries",e=>(e[1]=Et(e[1]),e))},every(e,t){return ge(this,"every",e,t,void 0,arguments)},filter(e,t){return ge(this,"filter",e,t,o=>o.map(Et),arguments)},find(e,t){return ge(this,"find",e,t,Et,arguments)},findIndex(e,t){return ge(this,"findIndex",e,t,void 0,arguments)},findLast(e,t){return ge(this,"findLast",e,t,Et,arguments)},findLastIndex(e,t){return ge(this,"findLastIndex",e,t,void 0,arguments)},forEach(e,t){return ge(this,"forEach",e,t,void 0,arguments)},includes(...e){return Fi(this,"includes",e)},indexOf(...e){return Fi(this,"indexOf",e)},join(e){return fo(this).join(e)},lastIndexOf(...e){return Fi(this,"lastIndexOf",e)},map(e,t){return ge(this,"map",e,t,void 0,arguments)},pop(){return Xo(this,"pop")},push(...e){return Xo(this,"push",e)},reduce(e,...t){return pr(this,"reduce",e,t)},reduceRight(e,...t){return pr(this,"reduceRight",e,t)},shift(){return Xo(this,"shift")},some(e,t){return ge(this,"some",e,t,void 0,arguments)},splice(...e){return Xo(this,"splice",e)},toReversed(){return fo(this).toReversed()},toSorted(e){return fo(this).toSorted(e)},toSpliced(...e){return fo(this).toSpliced(...e)},unshift(...e){return Xo(this,"unshift",e)},values(){return Ii(this,"values",Et)}};function Ii(e,t,o){const n=hi(e),i=n[t]();return n!==e&&!Jt(e)&&(i._next=i.next,i.next=()=>{const s=i._next();return s.done||(s.value=o(s.value)),s}),i}const Zu=Array.prototype;function ge(e,t,o,n,i,s){const r=hi(e),a=r!==e&&!Jt(e),l=r[t];if(l!==Zu[t]){const d=l.apply(e,s);return a?Et(d):d}let u=o;r!==e&&(a?u=function(d,m){return o.call(this,Et(d),m,e)}:o.length>2&&(u=function(d,m){return o.call(this,d,m,e)}));const c=l.call(r,u,n);return a&&i?i(c):c}function pr(e,t,o,n){const i=hi(e);let s=o;return i!==e&&(Jt(e)?o.length>3&&(s=function(r,a,l){return o.call(this,r,a,l,e)}):s=function(r,a,l){return o.call(this,r,Et(a),l,e)}),i[t](s,...n)}function Fi(e,t,o){const n=st(e);$t(n,"iterate",hn);const i=n[t](...o);return(i===-1||i===!1)&&Os(o[0])?(o[0]=st(o[0]),n[t](...o)):i}function Xo(e,t,o=[]){Se(),$s();const n=st(e)[t].apply(e,o);return Ts(),Ce(),n}const Qu=_s("__proto__,__v_isRef,__isVue"),Ma=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!=="arguments"&&e!=="caller").map(e=>Symbol[e]).filter(ee));function td(e){ee(e)||(e=String(e));const t=st(this);return $t(t,"has",e),t.hasOwnProperty(e)}class za{constructor(t=!1,o=!1){this._isReadonly=t,this._isShallow=o}get(t,o,n){if(o==="__v_skip")return t.__v_skip;const i=this._isReadonly,s=this._isShallow;if(o==="__v_isReactive")return!i;if(o==="__v_isReadonly")return i;if(o==="__v_isShallow")return s;if(o==="__v_raw")return n===(i?s?ud:Ia:s?Ra:Oa).get(t)||Object.getPrototypeOf(t)===Object.getPrototypeOf(n)?t:void 0;const r=q(t);if(!i){let l;if(r&&(l=Ju[o]))return l;if(o==="hasOwnProperty")return td}const a=Reflect.get(t,o,Pt(t)?t:n);if((ee(o)?Ma.has(o):Qu(o))||(i||$t(t,"get",o),s))return a;if(Pt(a)){const l=r&&Es(o)?a:a.value;return i&&ct(l)?ss(l):l}return ct(a)?i?ss(a):yo(a):a}}class La extends za{constructor(t=!1){super(!1,t)}set(t,o,n,i){let s=t[o];if(!this._isShallow){const l=De(s);if(!Jt(n)&&!De(n)&&(s=st(s),n=st(n)),!q(t)&&Pt(s)&&!Pt(n))return l||(s.value=n),!0}const r=q(t)&&Es(o)?Number(o)<t.length:rt(t,o),a=Reflect.set(t,o,n,Pt(t)?t:i);return t===st(i)&&(r?Ie(n,s)&&ye(t,"set",o,n):ye(t,"add",o,n)),a}deleteProperty(t,o){const n=rt(t,o);t[o];const i=Reflect.deleteProperty(t,o);return i&&n&&ye(t,"delete",o,void 0),i}has(t,o){const n=Reflect.has(t,o);return(!ee(o)||!Ma.has(o))&&$t(t,"has",o),n}ownKeys(t){return $t(t,"iterate",q(t)?"length":oo),Reflect.ownKeys(t)}}class ed extends za{constructor(t=!1){super(!0,t)}set(t,o){return!0}deleteProperty(t,o){return!0}}const od=new La,nd=new ed,id=new La(!0);const is=e=>e,Pn=e=>Reflect.getPrototypeOf(e);function sd(e,t,o){return function(...n){const i=this.__v_raw,s=st(i),r=bo(s),a=e==="entries"||e===Symbol.iterator&&r,l=e==="keys"&&r,u=i[e](...n),c=o?is:t?qn:Et;return!t&&$t(s,"iterate",l?ns:oo),{next(){const{value:d,done:m}=u.next();return m?{value:d,done:m}:{value:a?[c(d[0]),c(d[1])]:c(d),done:m}},[Symbol.iterator](){return this}}}}function Mn(e){return function(...t){return e==="delete"?!1:e==="clear"?void 0:this}}function rd(e,t){const o={get(i){const s=this.__v_raw,r=st(s),a=st(i);e||(Ie(i,a)&&$t(r,"get",i),$t(r,"get",a));const{has:l}=Pn(r),u=t?is:e?qn:Et;if(l.call(r,i))return u(s.get(i));if(l.call(r,a))return u(s.get(a));s!==r&&s.get(i)},get size(){const i=this.__v_raw;return!e&&$t(st(i),"iterate",oo),i.size},has(i){const s=this.__v_raw,r=st(s),a=st(i);return e||(Ie(i,a)&&$t(r,"has",i),$t(r,"has",a)),i===a?s.has(i):s.has(i)||s.has(a)},forEach(i,s){const r=this,a=r.__v_raw,l=st(a),u=t?is:e?qn:Et;return!e&&$t(l,"iterate",oo),a.forEach((c,d)=>i.call(s,u(c),u(d),r))}};return Mt(o,e?{add:Mn("add"),set:Mn("set"),delete:Mn("delete"),clear:Mn("clear")}:{add(i){!t&&!Jt(i)&&!De(i)&&(i=st(i));const s=st(this);return Pn(s).has.call(s,i)||(s.add(i),ye(s,"add",i,i)),this},set(i,s){!t&&!Jt(s)&&!De(s)&&(s=st(s));const r=st(this),{has:a,get:l}=Pn(r);let u=a.call(r,i);u||(i=st(i),u=a.call(r,i));const c=l.call(r,i);return r.set(i,s),u?Ie(s,c)&&ye(r,"set",i,s):ye(r,"add",i,s),this},delete(i){const s=st(this),{has:r,get:a}=Pn(s);let l=r.call(s,i);l||(i=st(i),l=r.call(s,i)),a&&a.call(s,i);const u=s.delete(i);return l&&ye(s,"delete",i,void 0),u},clear(){const i=st(this),s=i.size!==0,r=i.clear();return s&&ye(i,"clear",void 0,void 0),r}}),["keys","values","entries",Symbol.iterator].forEach(i=>{o[i]=sd(i,e,t)}),o}function zs(e,t){const o=rd(e,t);return(n,i,s)=>i==="__v_isReactive"?!e:i==="__v_isReadonly"?e:i==="__v_raw"?n:Reflect.get(rt(o,i)&&i in n?o:n,i,s)}const ad={get:zs(!1,!1)},ld={get:zs(!1,!0)},cd={get:zs(!0,!1)};const Oa=new WeakMap,Ra=new WeakMap,Ia=new WeakMap,ud=new WeakMap;function dd(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function pd(e){return e.__v_skip||!Object.isExtensible(e)?0:dd(Iu(e))}function yo(e){return De(e)?e:Ls(e,!1,od,ad,Oa)}function hd(e){return Ls(e,!1,id,ld,Ra)}function ss(e){return Ls(e,!0,nd,cd,Ia)}function Ls(e,t,o,n,i){if(!ct(e)||e.__v_raw&&!(t&&e.__v_isReactive))return e;const s=pd(e);if(s===0)return e;const r=i.get(e);if(r)return r;const a=new Proxy(e,s===2?n:o);return i.set(e,a),a}function ko(e){return De(e)?ko(e.__v_raw):!!(e&&e.__v_isReactive)}function De(e){return!!(e&&e.__v_isReadonly)}function Jt(e){return!!(e&&e.__v_isShallow)}function Os(e){return e?!!e.__v_raw:!1}function st(e){const t=e&&e.__v_raw;return t?st(t):e}function fd(e){return!rt(e,"__v_skip")&&Object.isExtensible(e)&&ya(e,"__v_skip",!0),e}const Et=e=>ct(e)?yo(e):e,qn=e=>ct(e)?ss(e):e;function Pt(e){return e?e.__v_isRef===!0:!1}function St(e){return Fa(e,!1)}function gd(e){return Fa(e,!0)}function Fa(e,t){return Pt(e)?e:new md(e,t)}class md{constructor(t,o){this.dep=new Ms,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=o?t:st(t),this._value=o?t:Et(t),this.__v_isShallow=o}get value(){return this.dep.track(),this._value}set value(t){const o=this._rawValue,n=this.__v_isShallow||Jt(t)||De(t);t=n?t:st(t),Ie(t,o)&&(this._rawValue=t,this._value=n?t:Et(t),this.dep.trigger())}}function ot(e){return Pt(e)?e.value:e}const vd={get:(e,t,o)=>t==="__v_raw"?e:ot(Reflect.get(e,t,o)),set:(e,t,o,n)=>{const i=e[t];return Pt(i)&&!Pt(o)?(i.value=o,!0):Reflect.set(e,t,o,n)}};function Na(e){return ko(e)?e:new Proxy(e,vd)}class bd{constructor(t,o,n){this.fn=t,this.setter=o,this._value=void 0,this.dep=new Ms(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=pn-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!o,this.isSSR=n}notify(){if(this.flags|=16,!(this.flags&8)&&ut!==this)return Ca(this,!0),!0}get value(){const t=this.dep.track();return $a(this),t&&(t.version=this.dep.version),this._value}set value(t){this.setter&&this.setter(t)}}function yd(e,t,o=!1){let n,i;return G(e)?n=e:(n=e.get,i=e.set),new bd(n,i,o)}const zn={},Kn=new WeakMap;let Ze;function kd(e,t=!1,o=Ze){if(o){let n=Kn.get(o);n||Kn.set(o,n=[]),n.push(e)}}function wd(e,t,o=lt){const{immediate:n,deep:i,once:s,scheduler:r,augmentJob:a,call:l}=o,u=z=>i?z:Jt(z)||i===!1||i===0?ke(z,1):ke(z);let c,d,m,h,v=!1,w=!1;if(Pt(e)?(d=()=>e.value,v=Jt(e)):ko(e)?(d=()=>u(e),v=!0):q(e)?(w=!0,v=e.some(z=>ko(z)||Jt(z)),d=()=>e.map(z=>{if(Pt(z))return z.value;if(ko(z))return u(z);if(G(z))return l?l(z,2):z()})):G(e)?t?d=l?()=>l(e,2):e:d=()=>{if(m){Se();try{m()}finally{Ce()}}const z=Ze;Ze=c;try{return l?l(e,3,[h]):e(h)}finally{Ze=z}}:d=de,t&&i){const z=d,K=i===!0?1/0:i;d=()=>ke(z(),K)}const P=Gu(),T=()=>{c.stop(),P&&P.active&&Cs(P.effects,c)};if(s&&t){const z=t;t=(...K)=>{z(...K),T()}}let N=w?new Array(e.length).fill(zn):zn;const L=z=>{if(!(!(c.flags&1)||!c.dirty&&!z))if(t){const K=c.run();if(i||v||(w?K.some((B,V)=>Ie(B,N[V])):Ie(K,N))){m&&m();const B=Ze;Ze=c;try{const V=[K,N===zn?void 0:w&&N[0]===zn?[]:N,h];N=K,l?l(t,3,V):t(...V)}finally{Ze=B}}}else c.run()};return a&&a(L),c=new _a(d),c.scheduler=r?()=>r(L,!1):L,h=z=>kd(z,!1,c),m=c.onStop=()=>{const z=Kn.get(c);if(z){if(l)l(z,4);else for(const K of z)K();Kn.delete(c)}},t?n?L(!0):N=c.run():r?r(L.bind(null,!0),!0):c.run(),T.pause=c.pause.bind(c),T.resume=c.resume.bind(c),T.stop=T,T}function ke(e,t=1/0,o){if(t<=0||!ct(e)||e.__v_skip||(o=o||new Map,(o.get(e)||0)>=t))return e;if(o.set(e,t),t--,Pt(e))ke(e.value,t,o);else if(q(e))for(let n=0;n<e.length;n++)ke(e[n],t,o);else if(ci(e)||bo(e))e.forEach(n=>{ke(n,t,o)});else if(va(e)){for(const n in e)ke(e[n],t,o);for(const n of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,n)&&ke(e[n],t,o)}return e}/**
* @vue/runtime-core v3.5.22
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function En(e,t,o,n){try{return n?e(...n):e()}catch(i){fi(i,t,o)}}function pe(e,t,o,n){if(G(e)){const i=En(e,t,o,n);return i&&ga(i)&&i.catch(s=>{fi(s,t,o)}),i}if(q(e)){const i=[];for(let s=0;s<e.length;s++)i.push(pe(e[s],t,o,n));return i}}function fi(e,t,o,n=!0){const i=t?t.vnode:null,{errorHandler:s,throwUnhandledErrorInProduction:r}=t&&t.appContext.config||lt;if(t){let a=t.parent;const l=t.proxy,u=`https://vuejs.org/error-reference/#runtime-${o}`;for(;a;){const c=a.ec;if(c){for(let d=0;d<c.length;d++)if(c[d](e,l,u)===!1)return}a=a.parent}if(s){Se(),En(s,null,10,[e,l,u]),Ce();return}}xd(e,o,i,n,r)}function xd(e,t,o,n=!0,i=!1){if(i)throw e;console.error(e)}const It=[];let le=-1;const wo=[];let ze=null,go=0;const Da=Promise.resolve();let Wn=null;function xo(e){const t=Wn||Da;return e?t.then(this?e.bind(this):e):t}function _d(e){let t=le+1,o=It.length;for(;t<o;){const n=t+o>>>1,i=It[n],s=fn(i);s<e||s===e&&i.flags&2?t=n+1:o=n}return t}function Rs(e){if(!(e.flags&1)){const t=fn(e),o=It[It.length-1];!o||!(e.flags&2)&&t>=fn(o)?It.push(e):It.splice(_d(t),0,e),e.flags|=1,ja()}}function ja(){Wn||(Wn=Da.then(Ba))}function Sd(e){q(e)?wo.push(...e):ze&&e.id===-1?ze.splice(go+1,0,e):e.flags&1||(wo.push(e),e.flags|=1),ja()}function hr(e,t,o=le+1){for(;o<It.length;o++){const n=It[o];if(n&&n.flags&2){if(e&&n.id!==e.uid)continue;It.splice(o,1),o--,n.flags&4&&(n.flags&=-2),n(),n.flags&4||(n.flags&=-2)}}}function Ua(e){if(wo.length){const t=[...new Set(wo)].sort((o,n)=>fn(o)-fn(n));if(wo.length=0,ze){ze.push(...t);return}for(ze=t,go=0;go<ze.length;go++){const o=ze[go];o.flags&4&&(o.flags&=-2),o.flags&8||o(),o.flags&=-2}ze=null,go=0}}const fn=e=>e.id==null?e.flags&2?-1:1/0:e.id;function Ba(e){try{for(le=0;le<It.length;le++){const t=It[le];t&&!(t.flags&8)&&(t.flags&4&&(t.flags&=-2),En(t,t.i,t.i?15:14),t.flags&4||(t.flags&=-2))}}finally{for(;le<It.length;le++){const t=It[le];t&&(t.flags&=-2)}le=-1,It.length=0,Ua(),Wn=null,(It.length||wo.length)&&Ba()}}let Tt=null,Ha=null;function Gn(e){const t=Tt;return Tt=e,Ha=e&&e.type.__scopeId||null,t}function yt(e,t=Tt,o){if(!t||e._n)return e;const n=(...i)=>{n._d&&Jn(-1);const s=Gn(t);let r;try{r=e(...i)}finally{Gn(s),n._d&&Jn(1)}return r};return n._n=!0,n._c=!0,n._d=!0,n}function re(e,t){if(Tt===null)return e;const o=yi(Tt),n=e.dirs||(e.dirs=[]);for(let i=0;i<t.length;i++){let[s,r,a,l=lt]=t[i];s&&(G(s)&&(s={mounted:s,updated:s}),s.deep&&ke(r),n.push({dir:s,instance:o,value:r,oldValue:void 0,arg:a,modifiers:l}))}return e}function Ke(e,t,o,n){const i=e.dirs,s=t&&t.dirs;for(let r=0;r<i.length;r++){const a=i[r];s&&(a.oldValue=s[r].value);let l=a.dir[n];l&&(Se(),pe(l,o,8,[e.el,a,e,t]),Ce())}}const Va=Symbol("_vte"),Cd=e=>e.__isTeleport,sn=e=>e&&(e.disabled||e.disabled===""),fr=e=>e&&(e.defer||e.defer===""),gr=e=>typeof SVGElement<"u"&&e instanceof SVGElement,mr=e=>typeof MathMLElement=="function"&&e instanceof MathMLElement,rs=(e,t)=>{const o=e&&e.to;return kt(o)?t?t(o):null:o},qa={name:"Teleport",__isTeleport:!0,process(e,t,o,n,i,s,r,a,l,u){const{mc:c,pc:d,pbc:m,o:{insert:h,querySelector:v,createText:w,createComment:P}}=u,T=sn(t.props);let{shapeFlag:N,children:L,dynamicChildren:z}=t;if(e==null){const K=t.el=w(""),B=t.anchor=w("");h(K,o,n),h(B,o,n);const V=(Z,Q)=>{N&16&&c(L,Z,Q,i,s,r,a,l)},nt=()=>{const Z=t.target=rs(t.props,v),Q=Wa(Z,t,w,h);Z&&(r!=="svg"&&gr(Z)?r="svg":r!=="mathml"&&mr(Z)&&(r="mathml"),i&&i.isCE&&(i.ce._teleportTargets||(i.ce._teleportTargets=new Set)).add(Z),T||(V(Z,Q),Fn(t,!1)))};T&&(V(o,B),Fn(t,!0)),fr(t.props)?(t.el.__isMounted=!1,Rt(()=>{nt(),delete t.el.__isMounted},s)):nt()}else{if(fr(t.props)&&e.el.__isMounted===!1){Rt(()=>{qa.process(e,t,o,n,i,s,r,a,l,u)},s);return}t.el=e.el,t.targetStart=e.targetStart;const K=t.anchor=e.anchor,B=t.target=e.target,V=t.targetAnchor=e.targetAnchor,nt=sn(e.props),Z=nt?o:B,Q=nt?K:V;if(r==="svg"||gr(B)?r="svg":(r==="mathml"||mr(B))&&(r="mathml"),z?(m(e.dynamicChildren,z,Z,i,s,r,a),Ds(e,t,!0)):l||d(e,t,Z,Q,i,s,r,a,!1),T)nt?t.props&&e.props&&t.props.to!==e.props.to&&(t.props.to=e.props.to):Ln(t,o,K,u,1);else if((t.props&&t.props.to)!==(e.props&&e.props.to)){const wt=t.target=rs(t.props,v);wt&&Ln(t,wt,null,u,0)}else nt&&Ln(t,B,V,u,1);Fn(t,T)}},remove(e,t,o,{um:n,o:{remove:i}},s){const{shapeFlag:r,children:a,anchor:l,targetStart:u,targetAnchor:c,target:d,props:m}=e;if(d&&(i(u),i(c)),s&&i(l),r&16){const h=s||!sn(m);for(let v=0;v<a.length;v++){const w=a[v];n(w,t,o,h,!!w.dynamicChildren)}}},move:Ln,hydrate:Ed};function Ln(e,t,o,{o:{insert:n},m:i},s=2){s===0&&n(e.targetAnchor,t,o);const{el:r,anchor:a,shapeFlag:l,children:u,props:c}=e,d=s===2;if(d&&n(r,t,o),(!d||sn(c))&&l&16)for(let m=0;m<u.length;m++)i(u[m],t,o,2);d&&n(a,t,o)}function Ed(e,t,o,n,i,s,{o:{nextSibling:r,parentNode:a,querySelector:l,insert:u,createText:c}},d){function m(w,P,T,N){P.anchor=d(r(w),P,a(w),o,n,i,s),P.targetStart=T,P.targetAnchor=N}const h=t.target=rs(t.props,l),v=sn(t.props);if(h){const w=h._lpa||h.firstChild;if(t.shapeFlag&16)if(v)m(e,t,w,w&&r(w));else{t.anchor=r(e);let P=w;for(;P;){if(P&&P.nodeType===8){if(P.data==="teleport start anchor")t.targetStart=P;else if(P.data==="teleport anchor"){t.targetAnchor=P,h._lpa=t.targetAnchor&&r(t.targetAnchor);break}}P=r(P)}t.targetAnchor||Wa(h,t,c,u),d(w&&r(w),t,h,o,n,i,s)}Fn(t,v)}else v&&t.shapeFlag&16&&m(e,t,e,r(e));return t.anchor&&r(t.anchor)}const Ka=qa;function Fn(e,t){const o=e.ctx;if(o&&o.ut){let n,i;for(t?(n=e.el,i=e.anchor):(n=e.targetStart,i=e.targetAnchor);n&&n!==i;)n.nodeType===1&&n.setAttribute("data-v-owner",o.uid),n=n.nextSibling;o.ut()}}function Wa(e,t,o,n){const i=t.targetStart=o(""),s=t.targetAnchor=o("");return i[Va]=s,e&&(n(i,e),n(s,e)),s}const Ad=Symbol("_leaveCb");function Is(e,t){e.shapeFlag&6&&e.component?(e.transition=t,Is(e.component.subTree,t)):e.shapeFlag&128?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t}function Be(e,t){return G(e)?Mt({name:e.name},t,{setup:e}):e}function Ga(e){e.ids=[e.ids[0]+e.ids[2]+++"-",0,0]}const Yn=new WeakMap;function rn(e,t,o,n,i=!1){if(q(e)){e.forEach((v,w)=>rn(v,t&&(q(t)?t[w]:t),o,n,i));return}if(_o(n)&&!i){n.shapeFlag&512&&n.type.__asyncResolved&&n.component.subTree.component&&rn(e,t,o,n.component.subTree);return}const s=n.shapeFlag&4?yi(n.component):n.el,r=i?null:s,{i:a,r:l}=e,u=t&&t.r,c=a.refs===lt?a.refs={}:a.refs,d=a.setupState,m=st(d),h=d===lt?fa:v=>rt(m,v);if(u!=null&&u!==l){if(vr(t),kt(u))c[u]=null,h(u)&&(d[u]=null);else if(Pt(u)){u.value=null;const v=t;v.k&&(c[v.k]=null)}}if(G(l))En(l,a,12,[r,c]);else{const v=kt(l),w=Pt(l);if(v||w){const P=()=>{if(e.f){const T=v?h(l)?d[l]:c[l]:l.value;if(i)q(T)&&Cs(T,s);else if(q(T))T.includes(s)||T.push(s);else if(v)c[l]=[s],h(l)&&(d[l]=c[l]);else{const N=[s];l.value=N,e.k&&(c[e.k]=N)}}else v?(c[l]=r,h(l)&&(d[l]=r)):w&&(l.value=r,e.k&&(c[e.k]=r))};if(r){const T=()=>{P(),Yn.delete(e)};T.id=-1,Yn.set(e,T),Rt(T,o)}else vr(e),P()}}}function vr(e){const t=Yn.get(e);t&&(t.flags|=8,Yn.delete(e))}di().requestIdleCallback;di().cancelIdleCallback;const _o=e=>!!e.type.__asyncLoader,Ya=e=>e.type.__isKeepAlive;function $d(e,t){Xa(e,"a",t)}function Td(e,t){Xa(e,"da",t)}function Xa(e,t,o=Ft){const n=e.__wdc||(e.__wdc=()=>{let i=o;for(;i;){if(i.isDeactivated)return;i=i.parent}return e()});if(gi(t,n,o),o){let i=o.parent;for(;i&&i.parent;)Ya(i.parent.vnode)&&Pd(n,t,o,i),i=i.parent}}function Pd(e,t,o,n){const i=gi(t,e,n,!0);Za(()=>{Cs(n[t],i)},o)}function gi(e,t,o=Ft,n=!1){if(o){const i=o[e]||(o[e]=[]),s=t.__weh||(t.__weh=(...r)=>{Se();const a=An(o),l=pe(t,o,e,r);return a(),Ce(),l});return n?i.unshift(s):i.push(s),s}}const Ae=e=>(t,o=Ft)=>{(!vn||e==="sp")&&gi(e,(...n)=>t(...n),o)},Md=Ae("bm"),Ja=Ae("m"),zd=Ae("bu"),Ld=Ae("u"),mi=Ae("bum"),Za=Ae("um"),Od=Ae("sp"),Rd=Ae("rtg"),Id=Ae("rtc");function Fd(e,t=Ft){gi("ec",e,t)}const Nd=Symbol.for("v-ndc");function Gt(e,t,o,n){let i;const s=o,r=q(e);if(r||kt(e)){const a=r&&ko(e);let l=!1,u=!1;a&&(l=!Jt(e),u=De(e),e=hi(e)),i=new Array(e.length);for(let c=0,d=e.length;c<d;c++)i[c]=t(l?u?qn(Et(e[c])):Et(e[c]):e[c],c,void 0,s)}else if(typeof e=="number"){i=new Array(e);for(let a=0;a<e;a++)i[a]=t(a+1,a,void 0,s)}else if(ct(e))if(e[Symbol.iterator])i=Array.from(e,(a,l)=>t(a,l,void 0,s));else{const a=Object.keys(e);i=new Array(a.length);for(let l=0,u=a.length;l<u;l++){const c=a[l];i[l]=t(e[c],c,l,s)}}else i=[];return i}function Qa(e,t,o={},n,i){if(Tt.ce||Tt.parent&&_o(Tt.parent)&&Tt.parent.ce){const u=Object.keys(o).length>0;return D(),Fe(dt,null,[H("slot",o,n)],u?-2:64)}let s=e[t];s&&s._c&&(s._d=!1),D();const r=s&&tl(s(o)),a=o.key||r&&r.key,l=Fe(dt,{key:(a&&!ee(a)?a:`_${t}`)+(!r&&n?"_fb":"")},r||[],r&&e._===1?64:-2);return l.scopeId&&(l.slotScopeIds=[l.scopeId+"-s"]),s&&s._c&&(s._d=!0),l}function tl(e){return e.some(t=>mn(t)?!(t.type===Ee||t.type===dt&&!tl(t.children)):!0)?e:null}const as=e=>e?kl(e)?yi(e):as(e.parent):null,an=Mt(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>as(e.parent),$root:e=>as(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>ol(e),$forceUpdate:e=>e.f||(e.f=()=>{Rs(e.update)}),$nextTick:e=>e.n||(e.n=xo.bind(e.proxy)),$watch:e=>sp.bind(e)}),Ni=(e,t)=>e!==lt&&!e.__isScriptSetup&&rt(e,t),Dd={get({_:e},t){if(t==="__v_skip")return!0;const{ctx:o,setupState:n,data:i,props:s,accessCache:r,type:a,appContext:l}=e;let u;if(t[0]!=="$"){const h=r[t];if(h!==void 0)switch(h){case 1:return n[t];case 2:return i[t];case 4:return o[t];case 3:return s[t]}else{if(Ni(n,t))return r[t]=1,n[t];if(i!==lt&&rt(i,t))return r[t]=2,i[t];if((u=e.propsOptions[0])&&rt(u,t))return r[t]=3,s[t];if(o!==lt&&rt(o,t))return r[t]=4,o[t];ls&&(r[t]=0)}}const c=an[t];let d,m;if(c)return t==="$attrs"&&$t(e.attrs,"get",""),c(e);if((d=a.__cssModules)&&(d=d[t]))return d;if(o!==lt&&rt(o,t))return r[t]=4,o[t];if(m=l.config.globalProperties,rt(m,t))return m[t]},set({_:e},t,o){const{data:n,setupState:i,ctx:s}=e;return Ni(i,t)?(i[t]=o,!0):n!==lt&&rt(n,t)?(n[t]=o,!0):rt(e.props,t)||t[0]==="$"&&t.slice(1)in e?!1:(s[t]=o,!0)},has({_:{data:e,setupState:t,accessCache:o,ctx:n,appContext:i,propsOptions:s,type:r}},a){let l,u;return!!(o[a]||e!==lt&&a[0]!=="$"&&rt(e,a)||Ni(t,a)||(l=s[0])&&rt(l,a)||rt(n,a)||rt(an,a)||rt(i.config.globalProperties,a)||(u=r.__cssModules)&&u[a])},defineProperty(e,t,o){return o.get!=null?e._.accessCache[t]=0:rt(o,"value")&&this.set(e,t,o.value,null),Reflect.defineProperty(e,t,o)}};function br(e){return q(e)?e.reduce((t,o)=>(t[o]=null,t),{}):e}let ls=!0;function jd(e){const t=ol(e),o=e.proxy,n=e.ctx;ls=!1,t.beforeCreate&&yr(t.beforeCreate,e,"bc");const{data:i,computed:s,methods:r,watch:a,provide:l,inject:u,created:c,beforeMount:d,mounted:m,beforeUpdate:h,updated:v,activated:w,deactivated:P,beforeDestroy:T,beforeUnmount:N,destroyed:L,unmounted:z,render:K,renderTracked:B,renderTriggered:V,errorCaptured:nt,serverPrefetch:Z,expose:Q,inheritAttrs:wt,components:Vt,directives:ht,filters:xt}=t;if(u&&Ud(u,n,null),r)for(const X in r){const W=r[X];G(W)&&(n[X]=W.bind(o))}if(i){const X=i.call(o,o);ct(X)&&(e.data=yo(X))}if(ls=!0,s)for(const X in s){const W=s[X],ft=G(W)?W.bind(o,o):G(W.get)?W.get.bind(o,o):de,Pe=!G(W)&&G(W.set)?W.set.bind(o):de,At=Qe({get:ft,set:Pe});Object.defineProperty(n,X,{enumerable:!0,configurable:!0,get:()=>At.value,set:_t=>At.value=_t})}if(a)for(const X in a)el(a[X],n,o,X);if(l){const X=G(l)?l.call(o):l;Reflect.ownKeys(X).forEach(W=>{il(W,X[W])})}c&&yr(c,e,"c");function at(X,W){q(W)?W.forEach(ft=>X(ft.bind(o))):W&&X(W.bind(o))}if(at(Md,d),at(Ja,m),at(zd,h),at(Ld,v),at($d,w),at(Td,P),at(Fd,nt),at(Id,B),at(Rd,V),at(mi,N),at(Za,z),at(Od,Z),q(Q))if(Q.length){const X=e.exposed||(e.exposed={});Q.forEach(W=>{Object.defineProperty(X,W,{get:()=>o[W],set:ft=>o[W]=ft,enumerable:!0})})}else e.exposed||(e.exposed={});K&&e.render===de&&(e.render=K),wt!=null&&(e.inheritAttrs=wt),Vt&&(e.components=Vt),ht&&(e.directives=ht),Z&&Ga(e)}function Ud(e,t,o=de){q(e)&&(e=cs(e));for(const n in e){const i=e[n];let s;ct(i)?"default"in i?s=Nn(i.from||n,i.default,!0):s=Nn(i.from||n):s=Nn(i),Pt(s)?Object.defineProperty(t,n,{enumerable:!0,configurable:!0,get:()=>s.value,set:r=>s.value=r}):t[n]=s}}function yr(e,t,o){pe(q(e)?e.map(n=>n.bind(t.proxy)):e.bind(t.proxy),t,o)}function el(e,t,o,n){let i=n.includes(".")?gl(o,n):()=>o[n];if(kt(e)){const s=t[e];G(s)&&Co(i,s)}else if(G(e))Co(i,e.bind(o));else if(ct(e))if(q(e))e.forEach(s=>el(s,t,o,n));else{const s=G(e.handler)?e.handler.bind(o):t[e.handler];G(s)&&Co(i,s,e)}}function ol(e){const t=e.type,{mixins:o,extends:n}=t,{mixins:i,optionsCache:s,config:{optionMergeStrategies:r}}=e.appContext,a=s.get(t);let l;return a?l=a:!i.length&&!o&&!n?l=t:(l={},i.length&&i.forEach(u=>Xn(l,u,r,!0)),Xn(l,t,r)),ct(t)&&s.set(t,l),l}function Xn(e,t,o,n=!1){const{mixins:i,extends:s}=t;s&&Xn(e,s,o,!0),i&&i.forEach(r=>Xn(e,r,o,!0));for(const r in t)if(!(n&&r==="expose")){const a=Bd[r]||o&&o[r];e[r]=a?a(e[r],t[r]):t[r]}return e}const Bd={data:kr,props:wr,emits:wr,methods:tn,computed:tn,beforeCreate:Ot,created:Ot,beforeMount:Ot,mounted:Ot,beforeUpdate:Ot,updated:Ot,beforeDestroy:Ot,beforeUnmount:Ot,destroyed:Ot,unmounted:Ot,activated:Ot,deactivated:Ot,errorCaptured:Ot,serverPrefetch:Ot,components:tn,directives:tn,watch:Vd,provide:kr,inject:Hd};function kr(e,t){return t?e?function(){return Mt(G(e)?e.call(this,this):e,G(t)?t.call(this,this):t)}:t:e}function Hd(e,t){return tn(cs(e),cs(t))}function cs(e){if(q(e)){const t={};for(let o=0;o<e.length;o++)t[e[o]]=e[o];return t}return e}function Ot(e,t){return e?[...new Set([].concat(e,t))]:t}function tn(e,t){return e?Mt(Object.create(null),e,t):t}function wr(e,t){return e?q(e)&&q(t)?[...new Set([...e,...t])]:Mt(Object.create(null),br(e),br(t??{})):t}function Vd(e,t){if(!e)return t;if(!t)return e;const o=Mt(Object.create(null),e);for(const n in t)o[n]=Ot(e[n],t[n]);return o}function nl(){return{app:null,config:{isNativeTag:fa,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let qd=0;function Kd(e,t){return function(n,i=null){G(n)||(n=Mt({},n)),i!=null&&!ct(i)&&(i=null);const s=nl(),r=new WeakSet,a=[];let l=!1;const u=s.app={_uid:qd++,_component:n,_props:i,_container:null,_context:s,_instance:null,version:Ap,get config(){return s.config},set config(c){},use(c,...d){return r.has(c)||(c&&G(c.install)?(r.add(c),c.install(u,...d)):G(c)&&(r.add(c),c(u,...d))),u},mixin(c){return s.mixins.includes(c)||s.mixins.push(c),u},component(c,d){return d?(s.components[c]=d,u):s.components[c]},directive(c,d){return d?(s.directives[c]=d,u):s.directives[c]},mount(c,d,m){if(!l){const h=u._ceVNode||H(n,i);return h.appContext=s,m===!0?m="svg":m===!1&&(m=void 0),e(h,c,m),l=!0,u._container=c,c.__vue_app__=u,yi(h.component)}},onUnmount(c){a.push(c)},unmount(){l&&(pe(a,u._instance,16),e(null,u._container),delete u._container.__vue_app__)},provide(c,d){return s.provides[c]=d,u},runWithContext(c){const d=So;So=u;try{return c()}finally{So=d}}};return u}}let So=null;function il(e,t){if(Ft){let o=Ft.provides;const n=Ft.parent&&Ft.parent.provides;n===o&&(o=Ft.provides=Object.create(n)),o[e]=t}}function Nn(e,t,o=!1){const n=wp();if(n||So){let i=So?So._context.provides:n?n.parent==null||n.ce?n.vnode.appContext&&n.vnode.appContext.provides:n.parent.provides:void 0;if(i&&e in i)return i[e];if(arguments.length>1)return o&&G(t)?t.call(n&&n.proxy):t}}const sl={},rl=()=>Object.create(sl),al=e=>Object.getPrototypeOf(e)===sl;function Wd(e,t,o,n=!1){const i={},s=rl();e.propsDefaults=Object.create(null),ll(e,t,i,s);for(const r in e.propsOptions[0])r in i||(i[r]=void 0);o?e.props=n?i:hd(i):e.type.props?e.props=i:e.props=s,e.attrs=s}function Gd(e,t,o,n){const{props:i,attrs:s,vnode:{patchFlag:r}}=e,a=st(i),[l]=e.propsOptions;let u=!1;if((n||r>0)&&!(r&16)){if(r&8){const c=e.vnode.dynamicProps;for(let d=0;d<c.length;d++){let m=c[d];if(vi(e.emitsOptions,m))continue;const h=t[m];if(l)if(rt(s,m))h!==s[m]&&(s[m]=h,u=!0);else{const v=Ne(m);i[v]=us(l,a,v,h,e,!1)}else h!==s[m]&&(s[m]=h,u=!0)}}}else{ll(e,t,i,s)&&(u=!0);let c;for(const d in a)(!t||!rt(t,d)&&((c=Ue(d))===d||!rt(t,c)))&&(l?o&&(o[d]!==void 0||o[c]!==void 0)&&(i[d]=us(l,a,d,void 0,e,!0)):delete i[d]);if(s!==a)for(const d in s)(!t||!rt(t,d))&&(delete s[d],u=!0)}u&&ye(e.attrs,"set","")}function ll(e,t,o,n){const[i,s]=e.propsOptions;let r=!1,a;if(t)for(let l in t){if(en(l))continue;const u=t[l];let c;i&&rt(i,c=Ne(l))?!s||!s.includes(c)?o[c]=u:(a||(a={}))[c]=u:vi(e.emitsOptions,l)||(!(l in n)||u!==n[l])&&(n[l]=u,r=!0)}if(s){const l=st(o),u=a||lt;for(let c=0;c<s.length;c++){const d=s[c];o[d]=us(i,l,d,u[d],e,!rt(u,d))}}return r}function us(e,t,o,n,i,s){const r=e[o];if(r!=null){const a=rt(r,"default");if(a&&n===void 0){const l=r.default;if(r.type!==Function&&!r.skipFactory&&G(l)){const{propsDefaults:u}=i;if(o in u)n=u[o];else{const c=An(i);n=u[o]=l.call(null,t),c()}}else n=l;i.ce&&i.ce._setProp(o,n)}r[0]&&(s&&!a?n=!1:r[1]&&(n===""||n===Ue(o))&&(n=!0))}return n}const Yd=new WeakMap;function cl(e,t,o=!1){const n=o?Yd:t.propsCache,i=n.get(e);if(i)return i;const s=e.props,r={},a=[];let l=!1;if(!G(e)){const c=d=>{l=!0;const[m,h]=cl(d,t,!0);Mt(r,m),h&&a.push(...h)};!o&&t.mixins.length&&t.mixins.forEach(c),e.extends&&c(e.extends),e.mixins&&e.mixins.forEach(c)}if(!s&&!l)return ct(e)&&n.set(e,vo),vo;if(q(s))for(let c=0;c<s.length;c++){const d=Ne(s[c]);xr(d)&&(r[d]=lt)}else if(s)for(const c in s){const d=Ne(c);if(xr(d)){const m=s[c],h=r[d]=q(m)||G(m)?{type:m}:Mt({},m),v=h.type;let w=!1,P=!0;if(q(v))for(let T=0;T<v.length;++T){const N=v[T],L=G(N)&&N.name;if(L==="Boolean"){w=!0;break}else L==="String"&&(P=!1)}else w=G(v)&&v.name==="Boolean";h[0]=w,h[1]=P,(w||rt(h,"default"))&&a.push(d)}}const u=[r,a];return ct(e)&&n.set(e,u),u}function xr(e){return e[0]!=="$"&&!en(e)}const Fs=e=>e==="_"||e==="_ctx"||e==="$stable",Ns=e=>q(e)?e.map(ce):[ce(e)],Xd=(e,t,o)=>{if(t._n)return t;const n=yt((...i)=>Ns(t(...i)),o);return n._c=!1,n},ul=(e,t,o)=>{const n=e._ctx;for(const i in e){if(Fs(i))continue;const s=e[i];if(G(s))t[i]=Xd(i,s,n);else if(s!=null){const r=Ns(s);t[i]=()=>r}}},dl=(e,t)=>{const o=Ns(t);e.slots.default=()=>o},pl=(e,t,o)=>{for(const n in t)(o||!Fs(n))&&(e[n]=t[n])},Jd=(e,t,o)=>{const n=e.slots=rl();if(e.vnode.shapeFlag&32){const i=t._;i?(pl(n,t,o),o&&ya(n,"_",i,!0)):ul(t,n)}else t&&dl(e,t)},Zd=(e,t,o)=>{const{vnode:n,slots:i}=e;let s=!0,r=lt;if(n.shapeFlag&32){const a=t._;a?o&&a===1?s=!1:pl(i,t,o):(s=!t.$stable,ul(t,i)),r=t}else t&&(dl(e,t),r={default:1});if(s)for(const a in i)!Fs(a)&&r[a]==null&&delete i[a]},Rt=hp;function Qd(e){return tp(e)}function tp(e,t){const o=di();o.__VUE__=!0;const{insert:n,remove:i,patchProp:s,createElement:r,createText:a,createComment:l,setText:u,setElementText:c,parentNode:d,nextSibling:m,setScopeId:h=de,insertStaticContent:v}=e,w=(g,b,_,M=null,S=null,$=null,F=void 0,I=null,R=!!b.dynamicChildren)=>{if(g===b)return;g&&!Jo(g,b)&&(M=ho(g),_t(g,S,$,!0),g=null),b.patchFlag===-2&&(R=!1,b.dynamicChildren=null);const{type:A,ref:k,shapeFlag:p}=b;switch(A){case bi:P(g,b,_,M);break;case Ee:T(g,b,_,M);break;case ji:g==null&&N(b,_,M,F);break;case dt:Vt(g,b,_,M,S,$,F,I,R);break;default:p&1?K(g,b,_,M,S,$,F,I,R):p&6?ht(g,b,_,M,S,$,F,I,R):(p&64||p&128)&&A.process(g,b,_,M,S,$,F,I,R,qe)}k!=null&&S?rn(k,g&&g.ref,$,b||g,!b):k==null&&g&&g.ref!=null&&rn(g.ref,null,$,g,!0)},P=(g,b,_,M)=>{if(g==null)n(b.el=a(b.children),_,M);else{const S=b.el=g.el;b.children!==g.children&&u(S,b.children)}},T=(g,b,_,M)=>{g==null?n(b.el=l(b.children||""),_,M):b.el=g.el},N=(g,b,_,M)=>{[g.el,g.anchor]=v(g.children,b,_,M,g.el,g.anchor)},L=({el:g,anchor:b},_,M)=>{let S;for(;g&&g!==b;)S=m(g),n(g,_,M),g=S;n(b,_,M)},z=({el:g,anchor:b})=>{let _;for(;g&&g!==b;)_=m(g),i(g),g=_;i(b)},K=(g,b,_,M,S,$,F,I,R)=>{b.type==="svg"?F="svg":b.type==="math"&&(F="mathml"),g==null?B(b,_,M,S,$,F,I,R):Z(g,b,S,$,F,I,R)},B=(g,b,_,M,S,$,F,I)=>{let R,A;const{props:k,shapeFlag:p,transition:f,dirs:O}=g;if(R=g.el=r(g.type,$,k&&k.is,k),p&8?c(R,g.children):p&16&&nt(g.children,R,null,M,S,Di(g,$),F,I),O&&Ke(g,null,M,"created"),V(R,g,g.scopeId,F,M),k){for(const Y in k)Y!=="value"&&!en(Y)&&s(R,Y,null,k[Y],$,M);"value"in k&&s(R,"value",null,k.value,$),(A=k.onVnodeBeforeMount)&&ae(A,M,g)}O&&Ke(g,null,M,"beforeMount");const C=ep(S,f);C&&f.beforeEnter(R),n(R,b,_),((A=k&&k.onVnodeMounted)||C||O)&&Rt(()=>{A&&ae(A,M,g),C&&f.enter(R),O&&Ke(g,null,M,"mounted")},S)},V=(g,b,_,M,S)=>{if(_&&h(g,_),M)for(let $=0;$<M.length;$++)h(g,M[$]);if(S){let $=S.subTree;if(b===$||vl($.type)&&($.ssContent===b||$.ssFallback===b)){const F=S.vnode;V(g,F,F.scopeId,F.slotScopeIds,S.parent)}}},nt=(g,b,_,M,S,$,F,I,R=0)=>{for(let A=R;A<g.length;A++){const k=g[A]=I?Le(g[A]):ce(g[A]);w(null,k,b,_,M,S,$,F,I)}},Z=(g,b,_,M,S,$,F)=>{const I=b.el=g.el;let{patchFlag:R,dynamicChildren:A,dirs:k}=b;R|=g.patchFlag&16;const p=g.props||lt,f=b.props||lt;let O;if(_&&We(_,!1),(O=f.onVnodeBeforeUpdate)&&ae(O,_,b,g),k&&Ke(b,g,_,"beforeUpdate"),_&&We(_,!0),(p.innerHTML&&f.innerHTML==null||p.textContent&&f.textContent==null)&&c(I,""),A?Q(g.dynamicChildren,A,I,_,M,Di(b,S),$):F||W(g,b,I,null,_,M,Di(b,S),$,!1),R>0){if(R&16)wt(I,p,f,_,S);else if(R&2&&p.class!==f.class&&s(I,"class",null,f.class,S),R&4&&s(I,"style",p.style,f.style,S),R&8){const C=b.dynamicProps;for(let Y=0;Y<C.length;Y++){const et=C[Y],Dt=p[et],jt=f[et];(jt!==Dt||et==="value")&&s(I,et,Dt,jt,S,_)}}R&1&&g.children!==b.children&&c(I,b.children)}else!F&&A==null&&wt(I,p,f,_,S);((O=f.onVnodeUpdated)||k)&&Rt(()=>{O&&ae(O,_,b,g),k&&Ke(b,g,_,"updated")},M)},Q=(g,b,_,M,S,$,F)=>{for(let I=0;I<b.length;I++){const R=g[I],A=b[I],k=R.el&&(R.type===dt||!Jo(R,A)||R.shapeFlag&198)?d(R.el):_;w(R,A,k,null,M,S,$,F,!0)}},wt=(g,b,_,M,S)=>{if(b!==_){if(b!==lt)for(const $ in b)!en($)&&!($ in _)&&s(g,$,b[$],null,S,M);for(const $ in _){if(en($))continue;const F=_[$],I=b[$];F!==I&&$!=="value"&&s(g,$,I,F,S,M)}"value"in _&&s(g,"value",b.value,_.value,S)}},Vt=(g,b,_,M,S,$,F,I,R)=>{const A=b.el=g?g.el:a(""),k=b.anchor=g?g.anchor:a("");let{patchFlag:p,dynamicChildren:f,slotScopeIds:O}=b;O&&(I=I?I.concat(O):O),g==null?(n(A,_,M),n(k,_,M),nt(b.children||[],_,k,S,$,F,I,R)):p>0&&p&64&&f&&g.dynamicChildren?(Q(g.dynamicChildren,f,_,S,$,F,I),(b.key!=null||S&&b===S.subTree)&&Ds(g,b,!0)):W(g,b,_,k,S,$,F,I,R)},ht=(g,b,_,M,S,$,F,I,R)=>{b.slotScopeIds=I,g==null?b.shapeFlag&512?S.ctx.activate(b,_,M,F,R):xt(b,_,M,S,$,F,R):Lt(g,b,R)},xt=(g,b,_,M,S,$,F)=>{const I=g.component=kp(g,M,S);if(Ya(g)&&(I.ctx.renderer=qe),xp(I,!1,F),I.asyncDep){if(S&&S.registerDep(I,at,F),!g.el){const R=I.subTree=H(Ee);T(null,R,b,_),g.placeholder=R.el}}else at(I,g,b,_,S,$,F)},Lt=(g,b,_)=>{const M=b.component=g.component;if(dp(g,b,_))if(M.asyncDep&&!M.asyncResolved){X(M,b,_);return}else M.next=b,M.update();else b.el=g.el,M.vnode=b},at=(g,b,_,M,S,$,F)=>{const I=()=>{if(g.isMounted){let{next:p,bu:f,u:O,parent:C,vnode:Y}=g;{const ie=hl(g);if(ie){p&&(p.el=Y.el,X(g,p,F)),ie.asyncDep.then(()=>{g.isUnmounted||I()});return}}let et=p,Dt;We(g,!1),p?(p.el=Y.el,X(g,p,F)):p=Y,f&&In(f),(Dt=p.props&&p.props.onVnodeBeforeUpdate)&&ae(Dt,C,p,Y),We(g,!0);const jt=Sr(g),ne=g.subTree;g.subTree=jt,w(ne,jt,d(ne.el),ho(ne),g,S,$),p.el=jt.el,et===null&&pp(g,jt.el),O&&Rt(O,S),(Dt=p.props&&p.props.onVnodeUpdated)&&Rt(()=>ae(Dt,C,p,Y),S)}else{let p;const{el:f,props:O}=b,{bm:C,m:Y,parent:et,root:Dt,type:jt}=g,ne=_o(b);We(g,!1),C&&In(C),!ne&&(p=O&&O.onVnodeBeforeMount)&&ae(p,et,b),We(g,!0);{Dt.ce&&Dt.ce._def.shadowRoot!==!1&&Dt.ce._injectChildStyle(jt);const ie=g.subTree=Sr(g);w(null,ie,_,M,g,S,$),b.el=ie.el}if(Y&&Rt(Y,S),!ne&&(p=O&&O.onVnodeMounted)){const ie=b;Rt(()=>ae(p,et,ie),S)}(b.shapeFlag&256||et&&_o(et.vnode)&&et.vnode.shapeFlag&256)&&g.a&&Rt(g.a,S),g.isMounted=!0,b=_=M=null}};g.scope.on();const R=g.effect=new _a(I);g.scope.off();const A=g.update=R.run.bind(R),k=g.job=R.runIfDirty.bind(R);k.i=g,k.id=g.uid,R.scheduler=()=>Rs(k),We(g,!0),A()},X=(g,b,_)=>{b.component=g;const M=g.vnode.props;g.vnode=b,g.next=null,Gd(g,b.props,M,_),Zd(g,b.children,_),Se(),hr(g),Ce()},W=(g,b,_,M,S,$,F,I,R=!1)=>{const A=g&&g.children,k=g?g.shapeFlag:0,p=b.children,{patchFlag:f,shapeFlag:O}=b;if(f>0){if(f&128){Pe(A,p,_,M,S,$,F,I,R);return}else if(f&256){ft(A,p,_,M,S,$,F,I,R);return}}O&8?(k&16&&Me(A,S,$),p!==A&&c(_,p)):k&16?O&16?Pe(A,p,_,M,S,$,F,I,R):Me(A,S,$,!0):(k&8&&c(_,""),O&16&&nt(p,_,M,S,$,F,I,R))},ft=(g,b,_,M,S,$,F,I,R)=>{g=g||vo,b=b||vo;const A=g.length,k=b.length,p=Math.min(A,k);let f;for(f=0;f<p;f++){const O=b[f]=R?Le(b[f]):ce(b[f]);w(g[f],O,_,null,S,$,F,I,R)}A>k?Me(g,S,$,!0,!1,p):nt(b,_,M,S,$,F,I,R,p)},Pe=(g,b,_,M,S,$,F,I,R)=>{let A=0;const k=b.length;let p=g.length-1,f=k-1;for(;A<=p&&A<=f;){const O=g[A],C=b[A]=R?Le(b[A]):ce(b[A]);if(Jo(O,C))w(O,C,_,null,S,$,F,I,R);else break;A++}for(;A<=p&&A<=f;){const O=g[p],C=b[f]=R?Le(b[f]):ce(b[f]);if(Jo(O,C))w(O,C,_,null,S,$,F,I,R);else break;p--,f--}if(A>p){if(A<=f){const O=f+1,C=O<k?b[O].el:M;for(;A<=f;)w(null,b[A]=R?Le(b[A]):ce(b[A]),_,C,S,$,F,I,R),A++}}else if(A>f)for(;A<=p;)_t(g[A],S,$,!0),A++;else{const O=A,C=A,Y=new Map;for(A=C;A<=f;A++){const qt=b[A]=R?Le(b[A]):ce(b[A]);qt.key!=null&&Y.set(qt.key,A)}let et,Dt=0;const jt=f-C+1;let ne=!1,ie=0;const Yo=new Array(jt);for(A=0;A<jt;A++)Yo[A]=0;for(A=O;A<=p;A++){const qt=g[A];if(Dt>=jt){_t(qt,S,$,!0);continue}let se;if(qt.key!=null)se=Y.get(qt.key);else for(et=C;et<=f;et++)if(Yo[et-C]===0&&Jo(qt,b[et])){se=et;break}se===void 0?_t(qt,S,$,!0):(Yo[se-C]=A+1,se>=ie?ie=se:ne=!0,w(qt,b[se],_,null,S,$,F,I,R),Dt++)}const rr=ne?op(Yo):vo;for(et=rr.length-1,A=jt-1;A>=0;A--){const qt=C+A,se=b[qt],ar=b[qt+1],lr=qt+1<k?ar.el||ar.placeholder:M;Yo[A]===0?w(null,se,_,lr,S,$,F,I,R):ne&&(et<0||A!==rr[et]?At(se,_,lr,2):et--)}}},At=(g,b,_,M,S=null)=>{const{el:$,type:F,transition:I,children:R,shapeFlag:A}=g;if(A&6){At(g.component.subTree,b,_,M);return}if(A&128){g.suspense.move(b,_,M);return}if(A&64){F.move(g,b,_,qe);return}if(F===dt){n($,b,_);for(let p=0;p<R.length;p++)At(R[p],b,_,M);n(g.anchor,b,_);return}if(F===ji){L(g,b,_);return}if(M!==2&&A&1&&I)if(M===0)I.beforeEnter($),n($,b,_),Rt(()=>I.enter($),S);else{const{leave:p,delayLeave:f,afterLeave:O}=I,C=()=>{g.ctx.isUnmounted?i($):n($,b,_)},Y=()=>{$._isLeaving&&$[Ad](!0),p($,()=>{C(),O&&O()})};f?f($,C,Y):Y()}else n($,b,_)},_t=(g,b,_,M=!1,S=!1)=>{const{type:$,props:F,ref:I,children:R,dynamicChildren:A,shapeFlag:k,patchFlag:p,dirs:f,cacheIndex:O}=g;if(p===-2&&(S=!1),I!=null&&(Se(),rn(I,null,_,g,!0),Ce()),O!=null&&(b.renderCache[O]=void 0),k&256){b.ctx.deactivate(g);return}const C=k&1&&f,Y=!_o(g);let et;if(Y&&(et=F&&F.onVnodeBeforeUnmount)&&ae(et,b,g),k&6)Mi(g.component,_,M);else{if(k&128){g.suspense.unmount(_,M);return}C&&Ke(g,null,b,"beforeUnmount"),k&64?g.type.remove(g,b,_,qe,M):A&&!A.hasOnce&&($!==dt||p>0&&p&64)?Me(A,b,_,!1,!0):($===dt&&p&384||!S&&k&16)&&Me(R,b,_),M&&Wo(g)}(Y&&(et=F&&F.onVnodeUnmounted)||C)&&Rt(()=>{et&&ae(et,b,g),C&&Ke(g,null,b,"unmounted")},_)},Wo=g=>{const{type:b,el:_,anchor:M,transition:S}=g;if(b===dt){oe(_,M);return}if(b===ji){z(g);return}const $=()=>{i(_),S&&!S.persisted&&S.afterLeave&&S.afterLeave()};if(g.shapeFlag&1&&S&&!S.persisted){const{leave:F,delayLeave:I}=S,R=()=>F(_,$);I?I(g.el,$,R):R()}else $()},oe=(g,b)=>{let _;for(;g!==b;)_=m(g),i(g),g=_;i(b)},Mi=(g,b,_)=>{const{bum:M,scope:S,job:$,subTree:F,um:I,m:R,a:A}=g;_r(R),_r(A),M&&In(M),S.stop(),$&&($.flags|=8,_t(F,g,b,_)),I&&Rt(I,b),Rt(()=>{g.isUnmounted=!0},b)},Me=(g,b,_,M=!1,S=!1,$=0)=>{for(let F=$;F<g.length;F++)_t(g[F],b,_,M,S)},ho=g=>{if(g.shapeFlag&6)return ho(g.component.subTree);if(g.shapeFlag&128)return g.suspense.next();const b=m(g.anchor||g.el),_=b&&b[Va];return _?m(_):b};let Go=!1;const Tn=(g,b,_)=>{g==null?b._vnode&&_t(b._vnode,null,null,!0):w(b._vnode||null,g,b,null,null,null,_),b._vnode=g,Go||(Go=!0,hr(),Ua(),Go=!1)},qe={p:w,um:_t,m:At,r:Wo,mt:xt,mc:nt,pc:W,pbc:Q,n:ho,o:e};return{render:Tn,hydrate:void 0,createApp:Kd(Tn)}}function Di({type:e,props:t},o){return o==="svg"&&e==="foreignObject"||o==="mathml"&&e==="annotation-xml"&&t&&t.encoding&&t.encoding.includes("html")?void 0:o}function We({effect:e,job:t},o){o?(e.flags|=32,t.flags|=4):(e.flags&=-33,t.flags&=-5)}function ep(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function Ds(e,t,o=!1){const n=e.children,i=t.children;if(q(n)&&q(i))for(let s=0;s<n.length;s++){const r=n[s];let a=i[s];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=i[s]=Le(i[s]),a.el=r.el),!o&&a.patchFlag!==-2&&Ds(r,a)),a.type===bi&&a.patchFlag!==-1&&(a.el=r.el),a.type===Ee&&!a.el&&(a.el=r.el)}}function op(e){const t=e.slice(),o=[0];let n,i,s,r,a;const l=e.length;for(n=0;n<l;n++){const u=e[n];if(u!==0){if(i=o[o.length-1],e[i]<u){t[n]=i,o.push(n);continue}for(s=0,r=o.length-1;s<r;)a=s+r>>1,e[o[a]]<u?s=a+1:r=a;u<e[o[s]]&&(s>0&&(t[n]=o[s-1]),o[s]=n)}}for(s=o.length,r=o[s-1];s-- >0;)o[s]=r,r=t[r];return o}function hl(e){const t=e.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:hl(t)}function _r(e){if(e)for(let t=0;t<e.length;t++)e[t].flags|=8}const np=Symbol.for("v-scx"),ip=()=>Nn(np);function Co(e,t,o){return fl(e,t,o)}function fl(e,t,o=lt){const{immediate:n,deep:i,flush:s,once:r}=o,a=Mt({},o),l=t&&n||!t&&s!=="post";let u;if(vn){if(s==="sync"){const h=ip();u=h.__watcherHandles||(h.__watcherHandles=[])}else if(!l){const h=()=>{};return h.stop=de,h.resume=de,h.pause=de,h}}const c=Ft;a.call=(h,v,w)=>pe(h,c,v,w);let d=!1;s==="post"?a.scheduler=h=>{Rt(h,c&&c.suspense)}:s!=="sync"&&(d=!0,a.scheduler=(h,v)=>{v?h():Rs(h)}),a.augmentJob=h=>{t&&(h.flags|=4),d&&(h.flags|=2,c&&(h.id=c.uid,h.i=c))};const m=wd(e,t,a);return vn&&(u?u.push(m):l&&m()),m}function sp(e,t,o){const n=this.proxy,i=kt(e)?e.includes(".")?gl(n,e):()=>n[e]:e.bind(n,n);let s;G(t)?s=t:(s=t.handler,o=t);const r=An(this),a=fl(i,s.bind(n),o);return r(),a}function gl(e,t){const o=t.split(".");return()=>{let n=e;for(let i=0;i<o.length&&n;i++)n=n[o[i]];return n}}const rp=(e,t)=>t==="modelValue"||t==="model-value"?e.modelModifiers:e[`${t}Modifiers`]||e[`${Ne(t)}Modifiers`]||e[`${Ue(t)}Modifiers`];function ap(e,t,...o){if(e.isUnmounted)return;const n=e.vnode.props||lt;let i=o;const s=t.startsWith("update:"),r=s&&rp(n,t.slice(7));r&&(r.trim&&(i=o.map(c=>kt(c)?c.trim():c)),r.number&&(i=o.map(Vn)));let a,l=n[a=Li(t)]||n[a=Li(Ne(t))];!l&&s&&(l=n[a=Li(Ue(t))]),l&&pe(l,e,6,i);const u=n[a+"Once"];if(u){if(!e.emitted)e.emitted={};else if(e.emitted[a])return;e.emitted[a]=!0,pe(u,e,6,i)}}const lp=new WeakMap;function ml(e,t,o=!1){const n=o?lp:t.emitsCache,i=n.get(e);if(i!==void 0)return i;const s=e.emits;let r={},a=!1;if(!G(e)){const l=u=>{const c=ml(u,t,!0);c&&(a=!0,Mt(r,c))};!o&&t.mixins.length&&t.mixins.forEach(l),e.extends&&l(e.extends),e.mixins&&e.mixins.forEach(l)}return!s&&!a?(ct(e)&&n.set(e,null),null):(q(s)?s.forEach(l=>r[l]=null):Mt(r,s),ct(e)&&n.set(e,r),r)}function vi(e,t){return!e||!li(t)?!1:(t=t.slice(2).replace(/Once$/,""),rt(e,t[0].toLowerCase()+t.slice(1))||rt(e,Ue(t))||rt(e,t))}function Sr(e){const{type:t,vnode:o,proxy:n,withProxy:i,propsOptions:[s],slots:r,attrs:a,emit:l,render:u,renderCache:c,props:d,data:m,setupState:h,ctx:v,inheritAttrs:w}=e,P=Gn(e);let T,N;try{if(o.shapeFlag&4){const z=i||n,K=z;T=ce(u.call(K,z,c,d,h,m,v)),N=a}else{const z=t;T=ce(z.length>1?z(d,{attrs:a,slots:r,emit:l}):z(d,null)),N=t.props?a:cp(a)}}catch(z){ln.length=0,fi(z,e,1),T=H(Ee)}let L=T;if(N&&w!==!1){const z=Object.keys(N),{shapeFlag:K}=L;z.length&&K&7&&(s&&z.some(Ss)&&(N=up(N,s)),L=Io(L,N,!1,!0))}return o.dirs&&(L=Io(L,null,!1,!0),L.dirs=L.dirs?L.dirs.concat(o.dirs):o.dirs),o.transition&&Is(L,o.transition),T=L,Gn(P),T}const cp=e=>{let t;for(const o in e)(o==="class"||o==="style"||li(o))&&((t||(t={}))[o]=e[o]);return t},up=(e,t)=>{const o={};for(const n in e)(!Ss(n)||!(n.slice(9)in t))&&(o[n]=e[n]);return o};function dp(e,t,o){const{props:n,children:i,component:s}=e,{props:r,children:a,patchFlag:l}=t,u=s.emitsOptions;if(t.dirs||t.transition)return!0;if(o&&l>=0){if(l&1024)return!0;if(l&16)return n?Cr(n,r,u):!!r;if(l&8){const c=t.dynamicProps;for(let d=0;d<c.length;d++){const m=c[d];if(r[m]!==n[m]&&!vi(u,m))return!0}}}else return(i||a)&&(!a||!a.$stable)?!0:n===r?!1:n?r?Cr(n,r,u):!0:!!r;return!1}function Cr(e,t,o){const n=Object.keys(t);if(n.length!==Object.keys(e).length)return!0;for(let i=0;i<n.length;i++){const s=n[i];if(t[s]!==e[s]&&!vi(o,s))return!0}return!1}function pp({vnode:e,parent:t},o){for(;t;){const n=t.subTree;if(n.suspense&&n.suspense.activeBranch===e&&(n.el=e.el),n===e)(e=t.vnode).el=o,t=t.parent;else break}}const vl=e=>e.__isSuspense;function hp(e,t){t&&t.pendingBranch?q(e)?t.effects.push(...e):t.effects.push(e):Sd(e)}const dt=Symbol.for("v-fgt"),bi=Symbol.for("v-txt"),Ee=Symbol.for("v-cmt"),ji=Symbol.for("v-stc"),ln=[];let Kt=null;function D(e=!1){ln.push(Kt=e?null:[])}function fp(){ln.pop(),Kt=ln[ln.length-1]||null}let gn=1;function Jn(e,t=!1){gn+=e,e<0&&Kt&&t&&(Kt.hasOnce=!0)}function bl(e){return e.dynamicChildren=gn>0?Kt||vo:null,fp(),gn>0&&Kt&&Kt.push(e),e}function j(e,t,o,n,i,s){return bl(y(e,t,o,n,i,s,!0))}function Fe(e,t,o,n,i){return bl(H(e,t,o,n,i,!0))}function mn(e){return e?e.__v_isVNode===!0:!1}function Jo(e,t){return e.type===t.type&&e.key===t.key}const yl=({key:e})=>e??null,Dn=({ref:e,ref_key:t,ref_for:o})=>(typeof e=="number"&&(e=""+e),e!=null?kt(e)||Pt(e)||G(e)?{i:Tt,r:e,k:t,f:!!o}:e:null);function y(e,t=null,o=null,n=0,i=null,s=e===dt?0:1,r=!1,a=!1){const l={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&yl(t),ref:t&&Dn(t),scopeId:Ha,slotScopeIds:null,children:o,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:s,patchFlag:n,dynamicProps:i,dynamicChildren:null,appContext:null,ctx:Tt};return a?(js(l,o),s&128&&e.normalize(l)):o&&(l.shapeFlag|=kt(o)?8:16),gn>0&&!r&&Kt&&(l.patchFlag>0||s&6)&&l.patchFlag!==32&&Kt.push(l),l}const H=gp;function gp(e,t=null,o=null,n=0,i=null,s=!1){if((!e||e===Nd)&&(e=Ee),mn(e)){const a=Io(e,t,!0);return o&&js(a,o),gn>0&&!s&&Kt&&(a.shapeFlag&6?Kt[Kt.indexOf(e)]=a:Kt.push(a)),a.patchFlag=-2,a}if(Ep(e)&&(e=e.__vccOpts),t){t=mp(t);let{class:a,style:l}=t;a&&!kt(a)&&(t.class=Yt(a)),ct(l)&&(Os(l)&&!q(l)&&(l=Mt({},l)),t.style=As(l))}const r=kt(e)?1:vl(e)?128:Cd(e)?64:ct(e)?4:G(e)?2:0;return y(e,t,o,n,i,r,s,!0)}function mp(e){return e?Os(e)||al(e)?Mt({},e):e:null}function Io(e,t,o=!1,n=!1){const{props:i,ref:s,patchFlag:r,children:a,transition:l}=e,u=t?vp(i||{},t):i,c={__v_isVNode:!0,__v_skip:!0,type:e.type,props:u,key:u&&yl(u),ref:t&&t.ref?o&&s?q(s)?s.concat(Dn(t)):[s,Dn(t)]:Dn(t):s,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:a,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==dt?r===-1?16:r|16:r,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:l,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&Io(e.ssContent),ssFallback:e.ssFallback&&Io(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce};return l&&n&&Is(c,l.clone(c)),c}function gt(e=" ",t=0){return H(bi,null,e,t)}function it(e="",t=!1){return t?(D(),Fe(Ee,null,e)):H(Ee,null,e)}function ce(e){return e==null||typeof e=="boolean"?H(Ee):q(e)?H(dt,null,e.slice()):mn(e)?Le(e):H(bi,null,String(e))}function Le(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:Io(e)}function js(e,t){let o=0;const{shapeFlag:n}=e;if(t==null)t=null;else if(q(t))o=16;else if(typeof t=="object")if(n&65){const i=t.default;i&&(i._c&&(i._d=!1),js(e,i()),i._c&&(i._d=!0));return}else{o=32;const i=t._;!i&&!al(t)?t._ctx=Tt:i===3&&Tt&&(Tt.slots._===1?t._=1:(t._=2,e.patchFlag|=1024))}else G(t)?(t={default:t,_ctx:Tt},o=32):(t=String(t),n&64?(o=16,t=[gt(t)]):o=8);e.children=t,e.shapeFlag|=o}function vp(...e){const t={};for(let o=0;o<e.length;o++){const n=e[o];for(const i in n)if(i==="class")t.class!==n.class&&(t.class=Yt([t.class,n.class]));else if(i==="style")t.style=As([t.style,n.style]);else if(li(i)){const s=t[i],r=n[i];r&&s!==r&&!(q(s)&&s.includes(r))&&(t[i]=s?[].concat(s,r):r)}else i!==""&&(t[i]=n[i])}return t}function ae(e,t,o,n=null){pe(e,t,7,[o,n])}const bp=nl();let yp=0;function kp(e,t,o){const n=e.type,i=(t?t.appContext:e.appContext)||bp,s={uid:yp++,vnode:e,type:n,parent:t,appContext:i,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new Wu(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(i.provides),ids:t?t.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:cl(n,i),emitsOptions:ml(n,i),emit:null,emitted:null,propsDefaults:lt,inheritAttrs:n.inheritAttrs,ctx:lt,data:lt,props:lt,attrs:lt,slots:lt,refs:lt,setupState:lt,setupContext:null,suspense:o,suspenseId:o?o.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return s.ctx={_:s},s.root=t?t.root:s,s.emit=ap.bind(null,s),e.ce&&e.ce(s),s}let Ft=null;const wp=()=>Ft||Tt;let Zn,ds;{const e=di(),t=(o,n)=>{let i;return(i=e[o])||(i=e[o]=[]),i.push(n),s=>{i.length>1?i.forEach(r=>r(s)):i[0](s)}};Zn=t("__VUE_INSTANCE_SETTERS__",o=>Ft=o),ds=t("__VUE_SSR_SETTERS__",o=>vn=o)}const An=e=>{const t=Ft;return Zn(e),e.scope.on(),()=>{e.scope.off(),Zn(t)}},Er=()=>{Ft&&Ft.scope.off(),Zn(null)};function kl(e){return e.vnode.shapeFlag&4}let vn=!1;function xp(e,t=!1,o=!1){t&&ds(t);const{props:n,children:i}=e.vnode,s=kl(e);Wd(e,n,s,t),Jd(e,i,o||t);const r=s?_p(e,t):void 0;return t&&ds(!1),r}function _p(e,t){const o=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,Dd);const{setup:n}=o;if(n){Se();const i=e.setupContext=n.length>1?Cp(e):null,s=An(e),r=En(n,e,0,[e.props,i]),a=ga(r);if(Ce(),s(),(a||e.sp)&&!_o(e)&&Ga(e),a){if(r.then(Er,Er),t)return r.then(l=>{Ar(e,l)}).catch(l=>{fi(l,e,0)});e.asyncDep=r}else Ar(e,r)}else wl(e)}function Ar(e,t,o){G(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:ct(t)&&(e.setupState=Na(t)),wl(e)}function wl(e,t,o){const n=e.type;e.render||(e.render=n.render||de);{const i=An(e);Se();try{jd(e)}finally{Ce(),i()}}}const Sp={get(e,t){return $t(e,"get",""),e[t]}};function Cp(e){const t=o=>{e.exposed=o||{}};return{attrs:new Proxy(e.attrs,Sp),slots:e.slots,emit:e.emit,expose:t}}function yi(e){return e.exposed?e.exposeProxy||(e.exposeProxy=new Proxy(Na(fd(e.exposed)),{get(t,o){if(o in t)return t[o];if(o in an)return an[o](e)},has(t,o){return o in t||o in an}})):e.proxy}function Ep(e){return G(e)&&"__vccOpts"in e}const Qe=(e,t)=>yd(e,t,vn);function Fo(e,t,o){try{Jn(-1);const n=arguments.length;return n===2?ct(t)&&!q(t)?mn(t)?H(e,null,[t]):H(e,t):H(e,null,t):(n>3?o=Array.prototype.slice.call(arguments,2):n===3&&mn(o)&&(o=[o]),H(e,t,o))}finally{Jn(1)}}const Ap="3.5.22";/**
* @vue/runtime-dom v3.5.22
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let ps;const $r=typeof window<"u"&&window.trustedTypes;if($r)try{ps=$r.createPolicy("vue",{createHTML:e=>e})}catch{}const xl=ps?e=>ps.createHTML(e):e=>e,$p="http://www.w3.org/2000/svg",Tp="http://www.w3.org/1998/Math/MathML",ve=typeof document<"u"?document:null,Tr=ve&&ve.createElement("template"),Pp={insert:(e,t,o)=>{t.insertBefore(e,o||null)},remove:e=>{const t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,o,n)=>{const i=t==="svg"?ve.createElementNS($p,e):t==="mathml"?ve.createElementNS(Tp,e):o?ve.createElement(e,{is:o}):ve.createElement(e);return e==="select"&&n&&n.multiple!=null&&i.setAttribute("multiple",n.multiple),i},createText:e=>ve.createTextNode(e),createComment:e=>ve.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>ve.querySelector(e),setScopeId(e,t){e.setAttribute(t,"")},insertStaticContent(e,t,o,n,i,s){const r=o?o.previousSibling:t.lastChild;if(i&&(i===s||i.nextSibling))for(;t.insertBefore(i.cloneNode(!0),o),!(i===s||!(i=i.nextSibling)););else{Tr.innerHTML=xl(n==="svg"?`<svg>${e}</svg>`:n==="mathml"?`<math>${e}</math>`:e);const a=Tr.content;if(n==="svg"||n==="mathml"){const l=a.firstChild;for(;l.firstChild;)a.appendChild(l.firstChild);a.removeChild(l)}t.insertBefore(a,o)}return[r?r.nextSibling:t.firstChild,o?o.previousSibling:t.lastChild]}},Mp=Symbol("_vtc");function zp(e,t,o){const n=e[Mp];n&&(t=(t?[t,...n]:[...n]).join(" ")),t==null?e.removeAttribute("class"):o?e.setAttribute("class",t):e.className=t}const Qn=Symbol("_vod"),_l=Symbol("_vsh"),Lp={name:"show",beforeMount(e,{value:t},{transition:o}){e[Qn]=e.style.display==="none"?"":e.style.display,o&&t?o.beforeEnter(e):Zo(e,t)},mounted(e,{value:t},{transition:o}){o&&t&&o.enter(e)},updated(e,{value:t,oldValue:o},{transition:n}){!t!=!o&&(n?t?(n.beforeEnter(e),Zo(e,!0),n.enter(e)):n.leave(e,()=>{Zo(e,!1)}):Zo(e,t))},beforeUnmount(e,{value:t}){Zo(e,t)}};function Zo(e,t){e.style.display=t?e[Qn]:"none",e[_l]=!t}const Op=Symbol(""),Rp=/(?:^|;)\s*display\s*:/;function Ip(e,t,o){const n=e.style,i=kt(o);let s=!1;if(o&&!i){if(t)if(kt(t))for(const r of t.split(";")){const a=r.slice(0,r.indexOf(":")).trim();o[a]==null&&jn(n,a,"")}else for(const r in t)o[r]==null&&jn(n,r,"");for(const r in o)r==="display"&&(s=!0),jn(n,r,o[r])}else if(i){if(t!==o){const r=n[Op];r&&(o+=";"+r),n.cssText=o,s=Rp.test(o)}}else t&&e.removeAttribute("style");Qn in e&&(e[Qn]=s?n.display:"",e[_l]&&(n.display="none"))}const Pr=/\s*!important$/;function jn(e,t,o){if(q(o))o.forEach(n=>jn(e,t,n));else if(o==null&&(o=""),t.startsWith("--"))e.setProperty(t,o);else{const n=Fp(e,t);Pr.test(o)?e.setProperty(Ue(n),o.replace(Pr,""),"important"):e[n]=o}}const Mr=["Webkit","Moz","ms"],Ui={};function Fp(e,t){const o=Ui[t];if(o)return o;let n=Ne(t);if(n!=="filter"&&n in e)return Ui[t]=n;n=ba(n);for(let i=0;i<Mr.length;i++){const s=Mr[i]+n;if(s in e)return Ui[t]=s}return t}const zr="http://www.w3.org/1999/xlink";function Lr(e,t,o,n,i,s=Vu(t)){n&&t.startsWith("xlink:")?o==null?e.removeAttributeNS(zr,t.slice(6,t.length)):e.setAttributeNS(zr,t,o):o==null||s&&!ka(o)?e.removeAttribute(t):e.setAttribute(t,s?"":ee(o)?String(o):o)}function Or(e,t,o,n,i){if(t==="innerHTML"||t==="textContent"){o!=null&&(e[t]=t==="innerHTML"?xl(o):o);return}const s=e.tagName;if(t==="value"&&s!=="PROGRESS"&&!s.includes("-")){const a=s==="OPTION"?e.getAttribute("value")||"":e.value,l=o==null?e.type==="checkbox"?"on":"":String(o);(a!==l||!("_value"in e))&&(e.value=l),o==null&&e.removeAttribute(t),e._value=o;return}let r=!1;if(o===""||o==null){const a=typeof e[t];a==="boolean"?o=ka(o):o==null&&a==="string"?(o="",r=!0):a==="number"&&(o=0,r=!0)}try{e[t]=o}catch{}r&&e.removeAttribute(i||t)}function to(e,t,o,n){e.addEventListener(t,o,n)}function Np(e,t,o,n){e.removeEventListener(t,o,n)}const Rr=Symbol("_vei");function Dp(e,t,o,n,i=null){const s=e[Rr]||(e[Rr]={}),r=s[t];if(n&&r)r.value=n;else{const[a,l]=jp(t);if(n){const u=s[t]=Hp(n,i);to(e,a,u,l)}else r&&(Np(e,a,r,l),s[t]=void 0)}}const Ir=/(?:Once|Passive|Capture)$/;function jp(e){let t;if(Ir.test(e)){t={};let n;for(;n=e.match(Ir);)e=e.slice(0,e.length-n[0].length),t[n[0].toLowerCase()]=!0}return[e[2]===":"?e.slice(3):Ue(e.slice(2)),t]}let Bi=0;const Up=Promise.resolve(),Bp=()=>Bi||(Up.then(()=>Bi=0),Bi=Date.now());function Hp(e,t){const o=n=>{if(!n._vts)n._vts=Date.now();else if(n._vts<=o.attached)return;pe(Vp(n,o.value),t,5,[n])};return o.value=e,o.attached=Bp(),o}function Vp(e,t){if(q(t)){const o=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{o.call(e),e._stopped=!0},t.map(n=>i=>!i._stopped&&n&&n(i))}else return t}const Fr=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,qp=(e,t,o,n,i,s)=>{const r=i==="svg";t==="class"?zp(e,n,r):t==="style"?Ip(e,o,n):li(t)?Ss(t)||Dp(e,t,o,n,s):(t[0]==="."?(t=t.slice(1),!0):t[0]==="^"?(t=t.slice(1),!1):Kp(e,t,n,r))?(Or(e,t,n),!e.tagName.includes("-")&&(t==="value"||t==="checked"||t==="selected")&&Lr(e,t,n,r,s,t!=="value")):e._isVueCE&&(/[A-Z]/.test(t)||!kt(n))?Or(e,Ne(t),n,s,t):(t==="true-value"?e._trueValue=n:t==="false-value"&&(e._falseValue=n),Lr(e,t,n,r))};function Kp(e,t,o,n){if(n)return!!(t==="innerHTML"||t==="textContent"||t in e&&Fr(t)&&G(o));if(t==="spellcheck"||t==="draggable"||t==="translate"||t==="autocorrect"||t==="form"||t==="list"&&e.tagName==="INPUT"||t==="type"&&e.tagName==="TEXTAREA")return!1;if(t==="width"||t==="height"){const i=e.tagName;if(i==="IMG"||i==="VIDEO"||i==="CANVAS"||i==="SOURCE")return!1}return Fr(t)&&kt(o)?!1:t in e}const ti=e=>{const t=e.props["onUpdate:modelValue"]||!1;return q(t)?o=>In(t,o):t};function Wp(e){e.target.composing=!0}function Nr(e){const t=e.target;t.composing&&(t.composing=!1,t.dispatchEvent(new Event("input")))}const Eo=Symbol("_assign"),Dr={created(e,{modifiers:{lazy:t,trim:o,number:n}},i){e[Eo]=ti(i);const s=n||i.props&&i.props.type==="number";to(e,t?"change":"input",r=>{if(r.target.composing)return;let a=e.value;o&&(a=a.trim()),s&&(a=Vn(a)),e[Eo](a)}),o&&to(e,"change",()=>{e.value=e.value.trim()}),t||(to(e,"compositionstart",Wp),to(e,"compositionend",Nr),to(e,"change",Nr))},mounted(e,{value:t}){e.value=t??""},beforeUpdate(e,{value:t,oldValue:o,modifiers:{lazy:n,trim:i,number:s}},r){if(e[Eo]=ti(r),e.composing)return;const a=(s||e.type==="number")&&!/^0\d/.test(e.value)?Vn(e.value):e.value,l=t??"";a!==l&&(document.activeElement===e&&e.type!=="range"&&(n&&t===o||i&&e.value.trim()===l)||(e.value=l))}},Ge={deep:!0,created(e,{value:t,modifiers:{number:o}},n){const i=ci(t);to(e,"change",()=>{const s=Array.prototype.filter.call(e.options,r=>r.selected).map(r=>o?Vn(ei(r)):ei(r));e[Eo](e.multiple?i?new Set(s):s:s[0]),e._assigning=!0,xo(()=>{e._assigning=!1})}),e[Eo]=ti(n)},mounted(e,{value:t}){jr(e,t)},beforeUpdate(e,t,o){e[Eo]=ti(o)},updated(e,{value:t}){e._assigning||jr(e,t)}};function jr(e,t){const o=e.multiple,n=q(t);if(!(o&&!n&&!ci(t))){for(let i=0,s=e.options.length;i<s;i++){const r=e.options[i],a=ei(r);if(o)if(n){const l=typeof a;l==="string"||l==="number"?r.selected=t.some(u=>String(u)===String(a)):r.selected=Ku(t,a)>-1}else r.selected=t.has(a);else if(pi(ei(r),t)){e.selectedIndex!==i&&(e.selectedIndex=i);return}}!o&&e.selectedIndex!==-1&&(e.selectedIndex=-1)}}function ei(e){return"_value"in e?e._value:e.value}const Gp=["ctrl","shift","alt","meta"],Yp={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>"button"in e&&e.button!==0,middle:e=>"button"in e&&e.button!==1,right:e=>"button"in e&&e.button!==2,exact:(e,t)=>Gp.some(o=>e[`${o}Key`]&&!t.includes(o))},bn=(e,t)=>{const o=e._withMods||(e._withMods={}),n=t.join(".");return o[n]||(o[n]=((i,...s)=>{for(let r=0;r<t.length;r++){const a=Yp[t[r]];if(a&&a(i,t))return}return e(i,...s)}))},Xp={esc:"escape",space:" ",up:"arrow-up",left:"arrow-left",right:"arrow-right",down:"arrow-down",delete:"backspace"},hs=(e,t)=>{const o=e._withKeys||(e._withKeys={}),n=t.join(".");return o[n]||(o[n]=(i=>{if(!("key"in i))return;const s=Ue(i.key);if(t.some(r=>r===s||Xp[r]===s))return e(i)}))},Jp=Mt({patchProp:qp},Pp);let Ur;function Zp(){return Ur||(Ur=Qd(Jp))}const Qp=((...e)=>{const t=Zp().createApp(...e),{mount:o}=t;return t.mount=n=>{const i=eh(n);if(!i)return;const s=t._component;!G(s)&&!s.render&&!s.template&&(s.template=i.innerHTML),i.nodeType===1&&(i.textContent="");const r=o(i,!1,th(i));return i instanceof Element&&(i.removeAttribute("v-cloak"),i.setAttribute("data-v-app","")),r},t});function th(e){if(e instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&e instanceof MathMLElement)return"mathml"}function eh(e){return kt(e)?document.querySelector(e):e}const Us=e=>Object.keys(e).filter((t=>t!=="__")).map((t=>{const o=e[t];return(Array.isArray(o)?o:o()).map((n=>t==="default"?n:(i=>typeof i.type=="string")(n)?((i,s)=>((i.props??={}).slot=s,i))(n,t):((i,s)=>Fo("span",{style:"display: contents;",slot:s},i))(n,t)))}));function ki(e){return Be({name:e.name,inheritAttrs:!1,setup(t,{attrs:o,slots:n}){return()=>Fo(e.tagName,o,Us(n))}})}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Un=globalThis,Bs=Un.ShadowRoot&&(Un.ShadyCSS===void 0||Un.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Hs=Symbol(),Br=new WeakMap;let Sl=class{constructor(t,o,n){if(this._$cssResult$=!0,n!==Hs)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=o}get styleSheet(){let t=this.o;const o=this.t;if(Bs&&t===void 0){const n=o!==void 0&&o.length===1;n&&(t=Br.get(o)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Br.set(o,t))}return t}toString(){return this.cssText}};const yn=e=>new Sl(typeof e=="string"?e:e+"",void 0,Hs),Ct=(e,...t)=>{const o=e.length===1?e[0]:t.reduce((n,i,s)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new Sl(o,e,Hs)},oh=(e,t)=>{if(Bs)e.adoptedStyleSheets=t.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(const o of t){const n=document.createElement("style"),i=Un.litNonce;i!==void 0&&n.setAttribute("nonce",i),n.textContent=o.cssText,e.appendChild(n)}},Hr=Bs?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let o="";for(const n of t.cssRules)o+=n.cssText;return yn(o)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:nh,defineProperty:ih,getOwnPropertyDescriptor:sh,getOwnPropertyNames:rh,getOwnPropertySymbols:ah,getPrototypeOf:lh}=Object,wi=globalThis,Vr=wi.trustedTypes,ch=Vr?Vr.emptyScript:"",uh=wi.reactiveElementPolyfillSupport,cn=(e,t)=>e,oi={toAttribute(e,t){switch(t){case Boolean:e=e?ch:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=e!==null;break;case Number:o=e===null?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch{o=null}}return o}},Vs=(e,t)=>!nh(e,t),qr={attribute:!0,type:String,converter:oi,reflect:!1,useDefault:!1,hasChanged:Vs};Symbol.metadata??=Symbol("metadata"),wi.litPropertyMetadata??=new WeakMap;let mo=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,o=qr){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(t,o),!o.noAccessor){const n=Symbol(),i=this.getPropertyDescriptor(t,n,o);i!==void 0&&ih(this.prototype,t,i)}}static getPropertyDescriptor(t,o,n){const{get:i,set:s}=sh(this.prototype,t)??{get(){return this[o]},set(r){this[o]=r}};return{get:i,set(r){const a=i?.call(this);s?.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??qr}static _$Ei(){if(this.hasOwnProperty(cn("elementProperties")))return;const t=lh(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(cn("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(cn("properties"))){const o=this.properties,n=[...rh(o),...ah(o)];for(const i of n)this.createProperty(i,o[i])}const t=this[Symbol.metadata];if(t!==null){const o=litPropertyMetadata.get(t);if(o!==void 0)for(const[n,i]of o)this.elementProperties.set(n,i)}this._$Eh=new Map;for(const[o,n]of this.elementProperties){const i=this._$Eu(o,n);i!==void 0&&this._$Eh.set(i,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const o=[];if(Array.isArray(t)){const n=new Set(t.flat(1/0).reverse());for(const i of n)o.unshift(Hr(i))}else t!==void 0&&o.push(Hr(t));return o}static _$Eu(t,o){const n=o.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,o=this.constructor.elementProperties;for(const n of o.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return oh(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,o,n){this._$AK(t,n)}_$ET(t,o){const n=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,n);if(i!==void 0&&n.reflect===!0){const s=(n.converter?.toAttribute!==void 0?n.converter:oi).toAttribute(o,n.type);this._$Em=t,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(t,o){const n=this.constructor,i=n._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const s=n.getPropertyOptions(i),r=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:oi;this._$Em=i;const a=r.fromAttribute(o,s.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(t,o,n,i=!1,s){if(t!==void 0){const r=this.constructor;if(i===!1&&(s=this[t]),n??=r.getPropertyOptions(t),!((n.hasChanged??Vs)(s,o)||n.useDefault&&n.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,n))))return;this.C(t,o,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,o,{useDefault:n,reflect:i,wrapped:s},r){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??o??this[t]),s!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||n||(o=void 0),this._$AL.set(t,o)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[i,s]of this._$Ep)this[i]=s;this._$Ep=void 0}const n=this.constructor.elementProperties;if(n.size>0)for(const[i,s]of n){const{wrapped:r}=s,a=this[i];r!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,s,a)}}let t=!1;const o=this._$AL;try{t=this.shouldUpdate(o),t?(this.willUpdate(o),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(o)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(o)}willUpdate(t){}_$AE(t){this._$EO?.forEach(o=>o.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(o=>this._$ET(o,this[o])),this._$EM()}updated(t){}firstUpdated(t){}};mo.elementStyles=[],mo.shadowRootOptions={mode:"open"},mo[cn("elementProperties")]=new Map,mo[cn("finalized")]=new Map,uh?.({ReactiveElement:mo}),(wi.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const qs=globalThis,Kr=e=>e,ni=qs.trustedTypes,Wr=ni?ni.createPolicy("lit-html",{createHTML:e=>e}):void 0,Cl="$lit$",Re=`lit$${Math.random().toFixed(9).slice(2)}$`,El="?"+Re,dh=`<${El}>`,ro=document,kn=()=>ro.createComment(""),wn=e=>e===null||typeof e!="object"&&typeof e!="function",Ks=Array.isArray,ph=e=>Ks(e)||typeof e?.[Symbol.iterator]=="function",Hi=`[ 	
\f\r]`,Qo=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Gr=/-->/g,Yr=/>/g,Ye=RegExp(`>|${Hi}(?:([^\\s"'>=/]+)(${Hi}*=${Hi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Xr=/'/g,Jr=/"/g,Al=/^(?:script|style|textarea|title)$/i,hh=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),J=hh(1),Xt=Symbol.for("lit-noChange"),U=Symbol.for("lit-nothing"),Zr=new WeakMap,eo=ro.createTreeWalker(ro,129);function $l(e,t){if(!Ks(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Wr!==void 0?Wr.createHTML(t):t}const fh=(e,t)=>{const o=e.length-1,n=[];let i,s=t===2?"<svg>":t===3?"<math>":"",r=Qo;for(let a=0;a<o;a++){const l=e[a];let u,c,d=-1,m=0;for(;m<l.length&&(r.lastIndex=m,c=r.exec(l),c!==null);)m=r.lastIndex,r===Qo?c[1]==="!--"?r=Gr:c[1]!==void 0?r=Yr:c[2]!==void 0?(Al.test(c[2])&&(i=RegExp("</"+c[2],"g")),r=Ye):c[3]!==void 0&&(r=Ye):r===Ye?c[0]===">"?(r=i??Qo,d=-1):c[1]===void 0?d=-2:(d=r.lastIndex-c[2].length,u=c[1],r=c[3]===void 0?Ye:c[3]==='"'?Jr:Xr):r===Jr||r===Xr?r=Ye:r===Gr||r===Yr?r=Qo:(r=Ye,i=void 0);const h=r===Ye&&e[a+1].startsWith("/>")?" ":"";s+=r===Qo?l+dh:d>=0?(n.push(u),l.slice(0,d)+Cl+l.slice(d)+Re+h):l+Re+(d===-2?a:h)}return[$l(e,s+(e[o]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]};class xn{constructor({strings:t,_$litType$:o},n){let i;this.parts=[];let s=0,r=0;const a=t.length-1,l=this.parts,[u,c]=fh(t,o);if(this.el=xn.createElement(u,n),eo.currentNode=this.el.content,o===2||o===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=eo.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(const d of i.getAttributeNames())if(d.endsWith(Cl)){const m=c[r++],h=i.getAttribute(d).split(Re),v=/([.?@])?(.*)/.exec(m);l.push({type:1,index:s,name:v[2],strings:h,ctor:v[1]==="."?mh:v[1]==="?"?vh:v[1]==="@"?bh:xi}),i.removeAttribute(d)}else d.startsWith(Re)&&(l.push({type:6,index:s}),i.removeAttribute(d));if(Al.test(i.tagName)){const d=i.textContent.split(Re),m=d.length-1;if(m>0){i.textContent=ni?ni.emptyScript:"";for(let h=0;h<m;h++)i.append(d[h],kn()),eo.nextNode(),l.push({type:2,index:++s});i.append(d[m],kn())}}}else if(i.nodeType===8)if(i.data===El)l.push({type:2,index:s});else{let d=-1;for(;(d=i.data.indexOf(Re,d+1))!==-1;)l.push({type:7,index:s}),d+=Re.length-1}s++}}static createElement(t,o){const n=ro.createElement("template");return n.innerHTML=t,n}}function No(e,t,o=e,n){if(t===Xt)return t;let i=n!==void 0?o._$Co?.[n]:o._$Cl;const s=wn(t)?void 0:t._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),s===void 0?i=void 0:(i=new s(e),i._$AT(e,o,n)),n!==void 0?(o._$Co??=[])[n]=i:o._$Cl=i),i!==void 0&&(t=No(e,i._$AS(e,t.values),i,n)),t}class gh{constructor(t,o){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:o},parts:n}=this._$AD,i=(t?.creationScope??ro).importNode(o,!0);eo.currentNode=i;let s=eo.nextNode(),r=0,a=0,l=n[0];for(;l!==void 0;){if(r===l.index){let u;l.type===2?u=new $n(s,s.nextSibling,this,t):l.type===1?u=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(u=new yh(s,this,t)),this._$AV.push(u),l=n[++a]}r!==l?.index&&(s=eo.nextNode(),r++)}return eo.currentNode=ro,i}p(t){let o=0;for(const n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,o),o+=n.strings.length-2):n._$AI(t[o])),o++}}class $n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,o,n,i){this.type=2,this._$AH=U,this._$AN=void 0,this._$AA=t,this._$AB=o,this._$AM=n,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const o=this._$AM;return o!==void 0&&t?.nodeType===11&&(t=o.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,o=this){t=No(this,t,o),wn(t)?t===U||t==null||t===""?(this._$AH!==U&&this._$AR(),this._$AH=U):t!==this._$AH&&t!==Xt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ph(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==U&&wn(this._$AH)?this._$AA.nextSibling.data=t:this.T(ro.createTextNode(t)),this._$AH=t}$(t){const{values:o,_$litType$:n}=t,i=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=xn.createElement($l(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===i)this._$AH.p(o);else{const s=new gh(i,this),r=s.u(this.options);s.p(o),this.T(r),this._$AH=s}}_$AC(t){let o=Zr.get(t.strings);return o===void 0&&Zr.set(t.strings,o=new xn(t)),o}k(t){Ks(this._$AH)||(this._$AH=[],this._$AR());const o=this._$AH;let n,i=0;for(const s of t)i===o.length?o.push(n=new $n(this.O(kn()),this.O(kn()),this,this.options)):n=o[i],n._$AI(s),i++;i<o.length&&(this._$AR(n&&n._$AB.nextSibling,i),o.length=i)}_$AR(t=this._$AA.nextSibling,o){for(this._$AP?.(!1,!0,o);t!==this._$AB;){const n=Kr(t).nextSibling;Kr(t).remove(),t=n}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class xi{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,o,n,i,s){this.type=1,this._$AH=U,this._$AN=void 0,this.element=t,this.name=o,this._$AM=i,this.options=s,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=U}_$AI(t,o=this,n,i){const s=this.strings;let r=!1;if(s===void 0)t=No(this,t,o,0),r=!wn(t)||t!==this._$AH&&t!==Xt,r&&(this._$AH=t);else{const a=t;let l,u;for(t=s[0],l=0;l<s.length-1;l++)u=No(this,a[n+l],o,l),u===Xt&&(u=this._$AH[l]),r||=!wn(u)||u!==this._$AH[l],u===U?t=U:t!==U&&(t+=(u??"")+s[l+1]),this._$AH[l]=u}r&&!i&&this.j(t)}j(t){t===U?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class mh extends xi{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===U?void 0:t}}class vh extends xi{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==U)}}class bh extends xi{constructor(t,o,n,i,s){super(t,o,n,i,s),this.type=5}_$AI(t,o=this){if((t=No(this,t,o,0)??U)===Xt)return;const n=this._$AH,i=t===U&&n!==U||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,s=t!==U&&(n===U||i);i&&this.element.removeEventListener(this.name,this,n),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class yh{constructor(t,o,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=o,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){No(this,t)}}const kh=qs.litHtmlPolyfillSupport;kh?.(xn,$n),(qs.litHtmlVersions??=[]).push("3.3.3");const wh=(e,t,o)=>{const n=o?.renderBefore??t;let i=n._$litPart$;if(i===void 0){const s=o?.renderBefore??null;n._$litPart$=i=new $n(t.insertBefore(kn(),s),s,void 0,o??{})}return i._$AI(e),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ws=globalThis;let un=class extends mo{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=wh(o,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Xt}};un._$litElement$=!0,un.finalized=!0,Ws.litElementHydrateSupport?.({LitElement:un});const xh=Ws.litElementPolyfillSupport;xh?.({LitElement:un});(Ws.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _h={attribute:!0,type:String,converter:oi,reflect:!1,hasChanged:Vs},Sh=(e=_h,t,o)=>{const{kind:n,metadata:i}=o;let s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),n==="setter"&&((e=Object.create(e)).wrapped=!0),s.set(o.name,e),n==="accessor"){const{name:r}=o;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(r,l,e,!0,a)},init(a){return a!==void 0&&this.C(r,void 0,e,a),a}}}if(n==="setter"){const{name:r}=o;return function(a){const l=this[r];t.call(this,a),this.requestUpdate(r,l,e,!0,a)}}throw Error("Unsupported decorator location: "+n)};function E(e){return(t,o)=>typeof o=="object"?Sh(e,t,o):((n,i,s)=>{const r=i.hasOwnProperty(s);return i.constructor.createProperty(s,n),r?Object.getOwnPropertyDescriptor(i,s):void 0})(e,t,o)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Qt(e){return E({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ch=(e,t,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(e,t,o),o);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function uo(e,t){return(o,n,i)=>{const s=r=>r.renderRoot?.querySelector(e)??null;return Ch(o,n,{get(){return s(this)}})}}var He=e=>(t,o)=>{const n=()=>{customElements.get(e)||customElements.define(e,t)};o!==void 0?o.addInitializer(n):n()},Qr=new Map;function Eh(e,t,o){const n=t.flatMap(r=>Array.isArray(r)?r:[r]).map(r=>"cssText"in r&&typeof r.cssText=="string"?r.cssText:yn(r).cssText).join(`
`);if(!("adoptedStyleSheets"in Document.prototype)||typeof CSSStyleSheet>"u"){const r=o;if(!e.querySelector(`style[data-pk-adopted-styles="${r}"]`)){const a=document.createElement("style");a.dataset.pkAdoptedStyles=r,a.textContent=n,e.prepend(a)}return}const i=o;let s=Qr.get(i);s||(s=new CSSStyleSheet,s.replaceSync(n),Qr.set(i,s)),e.adoptedStyleSheets=[...e.adoptedStyleSheets,s]}var Tl=Ct`
    @layer pk-component {
        :host {
            display: inline-block;
            vertical-align: middle;
        }
    }
`;Ct`
    .pk-focus-ring:focus {
        outline: none;
    }

    .pk-focus-ring:focus-visible {
        box-shadow: var(--pk-shadow-focus);
    }
`;var Ah=Ct`
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
`,$o,Uo=($o=class extends un{constructor(...t){super(...t),this.pkRenderFailed=!1}connectedCallback(){super.connectedCallback(),this.hasAttribute("data-pk")||this.setAttribute("data-pk","")}createRenderRoot(){const t=super.createRenderRoot();return Eh(t,[Ah],"pk-shadow-reset"),t}performUpdate(){if(!this.pkRenderFailed)try{const t=super.performUpdate();t instanceof Promise&&t.catch(o=>{this.handleRenderFailure(o)})}catch(t){this.handleRenderFailure(t)}}handleRenderFailure(t){const o=t instanceof Error?t:new Error(String(t));this.pkRenderFailed=!0,this.dispatchEvent(new CustomEvent("pk-error",{detail:{tagName:this.localName||this.tagName.toLowerCase(),message:o.message,stack:o.stack},bubbles:!0,composed:!0}));try{const n=this.renderRoot;if(n){n.textContent="";const i=document.createElement("div");i.setAttribute("part","error"),i.setAttribute("role","alert"),i.textContent="This control failed to load.",n.appendChild(i)}}catch{}}},$o.shadowRootOptions={mode:"open",delegatesFocus:!0},$o);function x(e,t,o,n){var i=arguments.length,s=i<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,o):n,r;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(e,t,o,n);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(s=(i<3?r(s):i>3?r(t,o,s):r(t,o))||s);return i>3&&s&&Object.defineProperty(t,o,s),s}function Pl(e,t="var(--pk-btn-radius, var(--pk-radius-lg))"){const o=yn(e),n=yn(t);return Ct`
        ${o} {
            border-top-left-radius: var(--pk-bg-start-start-radius, ${n});
            border-top-right-radius: var(--pk-bg-start-end-radius, ${n});
            border-bottom-left-radius: var(--pk-bg-end-start-radius, ${n});
            border-bottom-right-radius: var(--pk-bg-end-end-radius, ${n});
        }
    `}function Ml(){return Ct`
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
    `}function $h(){return Ct`
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
    `}function zl(e){const t=yn(e);return Ct`
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
    `}var Ll={width:448,height:512,path:"M352 64c0-17.7-14.3-32-32-32L128 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l192 0c17.7 0 32-14.3 32-32zm96 128c0-17.7-14.3-32-32-32L32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32zM0 448c0 17.7 14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 416c-17.7 0-32 14.3-32 32zM352 320c0-17.7-14.3-32-32-32l-192 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l192 0c17.7 0 32-14.3 32-32z"},Ol={width:448,height:512,path:"M448 64c0-17.7-14.3-32-32-32L32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32L32 288c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32L32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32z"},Rl={width:448,height:512,path:"M288 64c0 17.7-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l224 0c17.7 0 32 14.3 32 32zm0 256c0 17.7-14.3 32-32 32L32 352c-17.7 0-32-14.3-32-32s14.3-32 32-32l224 0c17.7 0 32 14.3 32 32zM0 192c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 224c-17.7 0-32-14.3-32-32zM448 448c0 17.7-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"},Il={width:448,height:512,path:"M448 64c0 17.7-14.3 32-32 32L192 96c-17.7 0-32-14.3-32-32s14.3-32 32-32l224 0c17.7 0 32 14.3 32 32zm0 256c0 17.7-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l224 0c17.7 0 32 14.3 32 32zM0 192c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 224c-17.7 0-32-14.3-32-32zM448 448c0 17.7-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"},Fl={width:384,height:512,path:"M169.4 502.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 402.7 224 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 370.7-105.4-105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"},Nl={width:512,height:512,path:"M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 105.4-105.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"},Dl={width:512,height:512,path:"M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"},jl={width:512,height:512,path:"M256 64c-56.8 0-107.9 24.7-143.1 64l47.1 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 192c-17.7 0-32-14.3-32-32L0 32C0 14.3 14.3 0 32 0S64 14.3 64 32l0 54.7C110.9 33.6 179.5 0 256 0 397.4 0 512 114.6 512 256S397.4 512 256 512c-87 0-163.9-43.4-210.1-109.7-10.1-14.5-6.6-34.4 7.9-44.6s34.4-6.6 44.6 7.9c34.8 49.8 92.4 82.3 157.6 82.3 106 0 192-86 192-192S362 64 256 64z"},Ul={width:512,height:512,path:"M436.7 74.7L448 85.4 448 32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l47.9 0-7.6-7.2c-.2-.2-.4-.4-.6-.6-75-75-196.5-75-271.5 0s-75 196.5 0 271.5 196.5 75 271.5 0c8.2-8.2 15.5-16.9 21.9-26.1 10.1-14.5 30.1-18 44.6-7.9s18 30.1 7.9 44.6c-8.5 12.2-18.2 23.8-29.1 34.7-100 100-262.1 100-362 0S-25 175 75 75c99.9-99.9 261.7-100 361.7-.3z"},Bl={width:384,height:512,path:"M214.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 109.3 160 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-370.7 105.4 105.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"},Hl={width:512,height:512,path:"M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0-201.4 201.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3 448 192c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 96C35.8 96 0 131.8 0 176L0 432c0 44.2 35.8 80 80 80l256 0c44.2 0 80-35.8 80-80l0-80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 80c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l80 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 96z"},Vl={width:448,height:512,path:"M224 0c17.7 0 32 14.3 32 32l0 168.6 144-83.1c15.3-8.8 34.9-3.6 43.7 11.7s3.6 34.9-11.7 43.7L288 256 432 339.1c15.3 8.8 20.6 28.4 11.7 43.7s-28.4 20.6-43.7 11.7L256 311.4 256 480c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-168.6-144 83.1c-15.3 8.8-34.9 3.6-43.7-11.7S.7 348 16 339.1L160 256 16 172.9C.7 164-4.5 144.5 4.3 129.1S32.7 108.6 48 117.4L192 200.6 192 32c0-17.7 14.3-32 32-32z"},ql={width:384,height:512,path:"M32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l32 0 0 320-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l224 0c70.7 0 128-57.3 128-128 0-46.5-24.8-87.3-62-109.7 18.7-22.3 30-51 30-82.3 0-70.7-57.3-128-128-128L32 32zM288 160c0 35.3-28.7 64-64 64l-96 0 0-128 96 0c35.3 0 64 28.7 64 64zM128 416l0-128 128 0c35.3 0 64 28.7 64 64s-28.7 64-64 64l-128 0z"},Kl={width:576,height:512,path:"M416 32l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0c17.7 0 32 14.3 32 32l0 37.5c0 25.5 10.1 49.9 28.1 67.9l22.6 22.6-22.6 22.6c-18 18-28.1 42.4-28.1 67.9l0 37.5c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0c53 0 96-43 96-96l0-37.5c0-8.5 3.4-16.6 9.4-22.6l45.3-45.3c12.5-12.5 12.5-32.8 0-45.3l-45.3-45.3c-6-6-9.4-14.1-9.4-22.6l0-37.5c0-53-43-96-96-96zM160 32c-53 0-96 43-96 96l0 37.5c0 8.5-3.4 16.6-9.4 22.6L9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l45.3 45.3c6 6 9.4 14.1 9.4 22.6L64 384c0 53 43 96 96 96l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0c-17.7 0-32-14.3-32-32l0-37.5c0-25.5-10.1-49.9-28.1-67.9L77.3 256 99.9 233.4c18-18 28.1-42.4 28.1-67.9l0-37.5c0-17.7 14.3-32 32-32l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0z"},Wl={width:448,height:512,path:"M128 0C110.3 0 96 14.3 96 32l0 32-32 0C28.7 64 0 92.7 0 128l0 48 448 0 0-48c0-35.3-28.7-64-64-64l-32 0 0-32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 32-128 0 0-32c0-17.7-14.3-32-32-32zM0 224L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-192-448 0z"},Gl={width:320,height:512,path:"M140.3 376.8c12.6 10.2 31.1 9.5 42.8-2.2l128-128c9.2-9.2 11.9-22.9 6.9-34.9S301.4 192 288.5 192l-256 0c-12.9 0-24.6 7.8-29.6 19.8S.7 237.5 9.9 246.6l128 128 2.4 2.2z"},Yl={width:320,height:512,path:"M140.3 135.2c12.6-10.3 31.1-9.5 42.8 2.2l128 128c9.2 9.2 11.9 22.9 6.9 34.9S301.4 320 288.5 320l-256 0c-12.9 0-24.6-7.8-29.6-19.8S.7 274.5 9.9 265.4l128-128 2.4-2.2z"},Xl={width:448,height:512,path:"M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z"},Gs={width:448,height:512,path:"M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"},Jl={width:320,height:512,path:"M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"},Zl={width:320,height:512,path:"M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"},Ql={width:448,height:512,path:"M201.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 173.3 54.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"},tc={width:512,height:512,path:"M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0z"},ec={width:512,height:512,path:"M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c5 5 11.8 7.5 18.8 7s13.4-4.1 17.5-9.8L379.3 179.2c7.8-10.7 5.4-25.7-5.3-33.5z"},oc={width:512,height:512,path:"M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zm0-192a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.6 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z"},nc={width:512,height:512,path:"M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM224 160a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm-8 64l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"},ic={width:384,height:512,path:"M320 32l-8.6 0C300.4 12.9 279.7 0 256 0L128 0C104.3 0 83.6 12.9 72.6 32L64 32C28.7 32 0 60.7 0 96L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-352c0-35.3-28.7-64-64-64zM136 112c-13.3 0-24-10.7-24-24s10.7-24 24-24l112 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-112 0z"},sc={width:512,height:512,path:"M256 0a256 256 0 1 1 0 512 256 256 0 1 1 0-512zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"},rc={width:512,height:512,path:"M288 448l-224 0 0-224 48 0 0-64-48 0c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l224 0c35.3 0 64-28.7 64-64l0-48-64 0 0 48zm-64-96l224 0c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L224 0c-35.3 0-64 28.7-64 64l0 224c0 35.3 28.7 64 64 64z"},ac={width:576,height:512,path:"M360.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm64.6 136.1c-12.5 12.5-12.5 32.8 0 45.3l73.4 73.4-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0zm-274.7 0c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 150.6 182.6c12.5-12.5 12.5-32.8 0-45.3z"},lc={width:448,height:512,path:"M192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-200.6c0-17.4-7.1-34.1-19.7-46.2L370.6 17.8C358.7 6.4 342.8 0 326.3 0L192 0zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-16-64 0 0 16-192 0 0-256 16 0 0-64-16 0z"},cc={width:448,height:512,path:"M256 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 210.7-41.4-41.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 242.7 256 32zM64 320c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-46.9 0-56.6 56.6c-31.2 31.2-81.9 31.2-113.1 0L110.9 320 64 320zm304 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"},uc={width:448,height:512,path:"M0 256a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm168 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm224-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"},dc={width:512,height:512,path:"M502.6 54.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L413 53.8C369.6 20.1 315.2 0 256 0 114.6 0 0 114.6 0 256 0 315.2 20.1 369.6 53.8 413L9.4 457.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L99 458.2c43.3 33.7 97.8 53.8 157 53.8 141.4 0 256-114.6 256-256 0-59.2-20.1-113.6-53.8-157l44.4-44.4zM367.2 99.5L99.5 367.2C77.1 335.9 64 297.5 64 256 64 150 150 64 256 64 297.5 64 335.9 77.1 367.2 99.5zm-222.5 313L412.5 144.8c22.4 31.4 35.5 69.8 35.5 111.2 0 106-86 192-192 192-41.5 0-79.9-13.1-111.2-35.5z"},pc={width:576,height:512,path:"M288 32c-80.8 0-145.5 36.8-192.6 80.6-46.8 43.5-78.1 95.4-93 131.1-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64-11.5 0-22.3-3-31.7-8.4-1 10.9-.1 22.1 2.9 33.2 13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-12.2-45.7-55.5-74.8-101.1-70.8 5.3 9.3 8.4 20.1 8.4 31.7z"},hc={width:576,height:512,path:"M272 48L160 48c-8.8 0-16 7.2-16 16l0 176-48 0 0-176c0-35.3 28.7-64 64-64L293.5 0c17 0 33.3 6.7 45.3 18.7L461.3 141.3c12 12 18.7 28.3 18.7 45.3l0 53.5-48 0 0-32-88 0c-39.8 0-72-32.2-72-72l0-88zM96 384l48 0 0 64c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16l0-64 48 0 0 64c0 35.3-28.7 64-64 64l-256 0c-35.3 0-64-28.7-64-64l0-64zM412.1 160L320 67.9 320 136c0 13.3 10.7 24 24 24l68.1 0zM24 288l112 0c13.3 0 24 10.7 24 24s-10.7 24-24 24L24 336c-13.3 0-24-10.7-24-24s10.7-24 24-24zm208 0l112 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-112 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm208 0l112 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-112 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"},fc={width:448,height:512,path:"M32 0C49.7 0 64 14.3 64 32l0 16 69-17.2c38.1-9.5 78.3-5.1 113.5 12.5 46.3 23.2 100.8 23.2 147.1 0l9.6-4.8C423.8 28.1 448 43.1 448 66.1l0 279.7c0 13.3-8.3 25.3-20.8 30l-34.7 13c-46.2 17.3-97.6 14.6-141.7-7.4-37.9-19-81.4-23.7-122.5-13.4L64 384 64 480c0 17.7-14.3 32-32 32S0 497.7 0 480L0 32C0 14.3 14.3 0 32 0zM64 187.1l64-13.9 0 65.5-64 13.9 0 65.5 48.8-12.2c5.1-1.3 10.1-2.4 15.2-3.3l0-63.9 38.9-8.4c8.3-1.8 16.7-2.5 25.1-2.1l0-64c13.6 .4 27.2 2.6 40.4 6.4l23.6 6.9 0 66.7-41.7-12.3c-7.3-2.1-14.8-3.4-22.3-3.8l0 71.4c21.8 1.9 43.3 6.7 64 14.4l0-69.8 22.7 6.7c13.5 4 27.3 6.4 41.3 7.4l0-64.2c-7.8-.8-15.6-2.3-23.2-4.5l-40.8-12 0-62c-13-3.8-25.8-8.8-38.2-15-8.2-4.1-16.9-7-25.8-8.8l0 72.4c-13-.4-26 .8-38.7 3.6l-25.3 5.5 0-75.2-64 16 0 73.1zM320 335.7c16.8 1.5 33.9-.7 50-6.8l14-5.2 0-71.7-7.9 1.8c-18.4 4.3-37.3 5.7-56.1 4.5l0 77.4zm64-149.4l0-70.8c-20.9 6.1-42.4 9.1-64 9.1l0 69.4c13.9 1.4 28 .5 41.7-2.6l22.3-5.2z"},gc={width:448,height:512,path:"M71.3 295.6c-21.9-21.9-21.9-57.3 0-79.2s57.3-21.9 79.2 0 21.9 57.3 0 79.2s-57.4 21.9-79.2 0zM184.4 182.5c-21.9-21.9-21.9-57.3 0-79.2s57.3-21.9 79.2 0 21.9 57.3 0 79.2-57.3 21.8-79.2 0zm0 147c21.9-21.9 57.3-21.9 79.2 0s21.9 57.3 0 79.2s-57.3 21.9-79.2 0c-21.9-21.8-21.9-57.3 0-79.2zM297.5 216.4c21.9-21.9 57.3-21.9 79.2 0s21.9 57.3 0 79.2s-57.3 21.9-79.2 0c-21.8-21.9-21.8-57.3 0-79.2z"},mc={width:512,height:512,path:"M64 224a64 64 0 1 1 0-128 64 64 0 1 1 0 128zM256 96a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm192 0a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm0 192a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM256 416a64 64 0 1 1 0-128 64 64 0 1 1 0 128zM64 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"},vc={width:320,height:512,path:"M128 64A64 64 0 1 0 0 64 64 64 0 1 0 128 64zm0 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zM0 448c0 35.3 28.7 64 64 64s64-28.7 64-64-28.7-64-64-64-64 28.7-64 64zM320 64a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zM192 256a64 64 0 1 0 128 0 64 64 0 1 0 -128 0zM320 448c0-35.3-28.7-64-64-64s-64 28.7-64 64 28.7 64 64 64 64-28.7 64-64z"},bc={width:512,height:512,path:"M448 96c0-11.1-5.7-21.4-15.2-27.2s-21.2-6.4-31.1-1.4l-64 32c-15.8 7.9-22.2 27.1-14.3 42.9s27.1 22.2 42.9 14.3l17.7-8.8 0 236.2-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0 0-288zM64 96c0-17.7-14.3-32-32-32S0 78.3 0 96L0 416c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 128 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-128 0 0-128z"},yc={width:576,height:512,path:"M96 96c0-17.7-14.3-32-32-32S32 78.3 32 96l0 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 96 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-96 0 0-128zM368 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l81.1 0c21.5 0 38.9 17.4 38.9 38.9 0 13.9-7.5 26.8-19.6 33.8l-76.3 43.6C347.5 269.7 320 317.1 320 368.5l0 47.5c0 17.7 14.3 32 32 32l160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-128 0 0-15.5c0-28.4 15.2-54.6 39.9-68.7l76.3-43.6C532.2 237.9 552 203.8 552 166.9 552 110.1 505.9 64 449.1 64L368 64z"},kc={width:576,height:512,path:"M96 96c0-17.7-14.3-32-32-32S32 78.3 32 96l0 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 96 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-96 0 0-128zM352 256c0 17.7 14.3 32 32 32l56 0c26.5 0 48 21.5 48 48s-21.5 48-48 48l-88 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l88 0c61.9 0 112-50.1 112-112 0-31.3-12.9-59.7-33.6-80 20.7-20.3 33.6-48.7 33.6-80 0-61.9-50.1-112-112-112l-88 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l88 0c26.5 0 48 21.5 48 48s-21.5 48-48 48l-56 0c-17.7 0-32 14.3-32 32z"},wc={width:512,height:512,path:"M64 96c0-17.7-14.3-32-32-32S0 78.3 0 96L0 416c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 96 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-96 0 0-128zm288 0c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 44.2 35.8 80 80 80l80 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-80 0c-8.8 0-16-7.2-16-16l0-112z"},xc={width:576,height:512,path:"M96 96c0-17.7-14.3-32-32-32S32 78.3 32 96l0 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 96 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-96 0 0-128zM352 64c-17.7 0-32 14.3-32 32l0 144c0 17.7 14.3 32 32 32l80 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-80 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l80 0c66.3 0 120-53.7 120-120S498.3 208 432 208l-48 0 0-80 120 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L352 64z"},_c={width:512,height:512,path:"M32 64c17.7 0 32 14.3 32 32l0 128 96 0 0-128c0-17.7 14.3-32 32-32s32 14.3 32 32l0 320c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-128-96 0 0 128c0 17.7-14.3 32-32 32S0 433.7 0 416L0 96C0 78.3 14.3 64 32 64zm352 64c-17.7 0-32 14.3-32 32l0 53.5c10-3.5 20.8-5.5 32-5.5l32 0c53 0 96 43 96 96l0 48c0 53-43 96-96 96l-32 0c-53 0-96-43-96-96l0-192c0-53 43-96 96-96l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0zM352 304l0 48c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-48c0-17.7-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32z"},Sc={width:576,height:512,path:"M315 315L473.4 99.9 444.1 70.6 229 229 315 315zm-187 5l0 0 0-71.7c0-15.3 7.2-29.6 19.5-38.6L420.6 8.4C428 2.9 437 0 446.2 0 457.6 0 468.5 4.5 476.6 12.6l54.8 54.8c8.1 8.1 12.6 19 12.6 30.5 0 9.2-2.9 18.2-8.4 25.6L334.4 396.5c-9 12.3-23.4 19.5-38.6 19.5l-71.7 0-25.4 25.4c-12.5 12.5-32.8 12.5-45.3 0l-50.7-50.7c-12.5-12.5-12.5-32.8 0-45.3L128 320zM7 466.3l51.7-51.7 70.6 70.6-19.7 19.7c-4.5 4.5-10.6 7-17 7L24 512c-13.3 0-24-10.7-24-24l0-4.7c0-6.4 2.5-12.5 7-17z"},Cc={width:512,height:512,path:"M277.8 8.6c-12.3-11.4-31.3-11.4-43.5 0l-224 208c-9.6 9-12.8 22.9-8 35.1S18.8 272 32 272l16 0 0 176c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-176 16 0c13.2 0 25-8.1 29.8-20.3s1.6-26.2-8-35.1l-224-208zM240 320l32 0c26.5 0 48 21.5 48 48l0 96-128 0 0-96c0-26.5 21.5-48 48-48z"},Ec={width:384,height:512,path:"M128 64c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-58.7 0-133.3 320 64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l58.7 0 133.3-320-64 0c-17.7 0-32-14.3-32-32z"},Ac={width:384,height:512,path:"M292.9 384c7.3-22.3 21.9-42.5 38.4-59.9 32.7-34.4 52.7-80.9 52.7-132.1 0-106-86-192-192-192S0 86 0 192c0 51.2 20 97.7 52.7 132.1 16.5 17.4 31.2 37.6 38.4 59.9l201.7 0zM288 432l-192 0 0 16c0 44.2 35.8 80 80 80l32 0c44.2 0 80-35.8 80-80l0-16zM184 112c-39.8 0-72 32.2-72 72 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-66.3 53.7-120 120-120 13.3 0 24 10.7 24 24s-10.7 24-24 24z"},$c={width:576,height:512,path:"M419.5 96c-16.6 0-32.7 4.5-46.8 12.7-15.8-16-34.2-29.4-54.5-39.5 28.2-24 64.1-37.2 101.3-37.2 86.4 0 156.5 70 156.5 156.5 0 41.5-16.5 81.3-45.8 110.6l-71.1 71.1c-29.3 29.3-69.1 45.8-110.6 45.8-86.4 0-156.5-70-156.5-156.5 0-1.5 0-3 .1-4.5 .5-17.7 15.2-31.6 32.9-31.1s31.6 15.2 31.1 32.9c0 .9 0 1.8 0 2.6 0 51.1 41.4 92.5 92.5 92.5 24.5 0 48-9.7 65.4-27.1l71.1-71.1c17.3-17.3 27.1-40.9 27.1-65.4 0-51.1-41.4-92.5-92.5-92.5zM275.2 173.3c-1.9-.8-3.8-1.9-5.5-3.1-12.6-6.5-27-10.2-42.1-10.2-24.5 0-48 9.7-65.4 27.1L91.1 258.2c-17.3 17.3-27.1 40.9-27.1 65.4 0 51.1 41.4 92.5 92.5 92.5 16.5 0 32.6-4.4 46.7-12.6 15.8 16 34.2 29.4 54.6 39.5-28.2 23.9-64 37.2-101.3 37.2-86.4 0-156.5-70-156.5-156.5 0-41.5 16.5-81.3 45.8-110.6l71.1-71.1c29.3-29.3 69.1-45.8 110.6-45.8 86.6 0 156.5 70.6 156.5 156.9 0 1.3 0 2.6 0 3.9-.4 17.7-15.1 31.6-32.8 31.2s-31.6-15.1-31.2-32.8c0-.8 0-1.5 0-2.3 0-33.7-18-63.3-44.8-79.6z"},Tc={width:384,height:512,path:"M128 96l0 64 128 0 0-64c0-35.3-28.7-64-64-64s-64 28.7-64 64zM64 160l0-64C64 25.3 121.3-32 192-32S320 25.3 320 96l0 64c35.3 0 64 28.7 64 64l0 224c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 224c0-35.3 28.7-64 64-64z"},Pc={width:512,height:512,path:"M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z"},Mc={width:512,height:512,path:"M0 72C0 58.8 10.7 48 24 48l48 0c13.3 0 24 10.7 24 24l0 104 24 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-96 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l24 0 0-80-24 0C10.7 96 0 85.3 0 72zM30.4 301.2C41.8 292.6 55.7 288 70 288l4.9 0c33.7 0 61.1 27.4 61.1 61.1 0 19.6-9.4 37.9-25.2 49.4l-24 17.5 33.2 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-90.7 0C13.1 464 0 450.9 0 434.7 0 425.3 4.5 416.5 12.1 411l70.5-51.3c3.4-2.5 5.4-6.4 5.4-10.6 0-7.2-5.9-13.1-13.1-13.1L70 336c-3.9 0-7.7 1.3-10.8 3.6L38.4 355.2c-10.6 8-25.6 5.8-33.6-4.8S-1 324.8 9.6 316.8l20.8-15.6zM224 64l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"},zc={width:512,height:512,path:"M48 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM48 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM96 256a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"},Lc={width:448,height:512,path:"M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"},Oc={width:448,height:512,path:"M0 64C0 46.3 14.3 32 32 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-16 0 0 112 224 0 0-112-16 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-16 0 0 320 16 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l16 0 0-144-224 0 0 144 16 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l16 0 0-320-16 0C14.3 96 0 81.7 0 64z"},Rc={width:448,height:512,path:"M160 0L416 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0 0 416c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-416-48 0 0 416c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160-48 0C71.6 320 0 248.4 0 160S71.6 0 160 0z"},Ic={width:512,height:512,path:"M352.9 21.2L308 66.1 445.9 204 490.8 159.1C504.4 145.6 512 127.2 512 108s-7.6-37.6-21.2-51.1L455.1 21.2C441.6 7.6 423.2 0 404 0s-37.6 7.6-51.1 21.2zM274.1 100L58.9 315.1c-10.7 10.7-18.5 24.1-22.6 38.7L.9 481.6c-2.3 8.3 0 17.3 6.2 23.4s15.1 8.5 23.4 6.2l127.8-35.5c14.6-4.1 27.9-11.8 38.7-22.6L412 237.9 274.1 100z"},Fc={width:448,height:512,path:"M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"},Nc={width:512,height:512,path:"M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"},Dc={width:448,height:512,path:"M448 296c0 66.3-53.7 120-120 120l-8 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l8 0c30.9 0 56-25.1 56-56l0-8-64 0c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l64 0c35.3 0 64 28.7 64 64l0 136zm-256 0c0 66.3-53.7 120-120 120l-8 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l8 0c30.9 0 56-25.1 56-56l0-8-64 0c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l64 0c35.3 0 64 28.7 64 64l0 136z"},jc={width:512,height:512,path:"M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"},Uc={width:512,height:512,path:"M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"},Bc={width:512,height:512,path:"M307.8 18.4c-12 5-19.8 16.6-19.8 29.6l0 80-112 0c-97.2 0-176 78.8-176 176 0 113.3 81.5 163.9 100.2 174.1 2.5 1.4 5.3 1.9 8.1 1.9 10.9 0 19.7-8.9 19.7-19.7 0-7.5-4.3-14.4-9.8-19.5-9.4-8.8-22.2-26.4-22.2-56.7 0-53 43-96 96-96l96 0 0 80c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-9.2-9.2-22.9-11.9-34.9-6.9z"},Hc={width:576,height:512,path:"M32 448L160 64h64l128 384h-64l-32-96H128l-32 96H32zm117.3-160h85.3L192 160l-42.7 128zM336 448l80-240h48l80 240h-48l-16-48h-80l-16 48h-48zm80-96h48l-24-72-24 72z"},Vc={width:512,height:512,path:"M32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 224zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384z"},qc={width:512,height:512,path:"M0 416c0 8.8 7.2 16 16 16l65.6 0c7.4 36.5 39.7 64 78.4 64s71-27.5 78.4-64L496 432c8.8 0 16-7.2 16-16s-7.2-16-16-16l-257.6 0c-7.4-36.5-39.7-64-78.4-64s-71 27.5-78.4 64L16 400c-8.8 0-16 7.2-16 16zm112 0a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM304 256a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm48-80c-38.7 0-71 27.5-78.4 64L16 240c-8.8 0-16 7.2-16 16s7.2 16 16 16l257.6 0c7.4 36.5 39.7 64 78.4 64s71-27.5 78.4-64l65.6 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-65.6 0c-7.4-36.5-39.7-64-78.4-64zM192 144a48 48 0 1 1 0-96 48 48 0 1 1 0 96zm78.4-64C263 43.5 230.7 16 192 16s-71 27.5-78.4 64L16 80C7.2 80 0 87.2 0 96s7.2 16 16 16l97.6 0c7.4 36.5 39.7 64 78.4 64s71-27.5 78.4-64L496 112c8.8 0 16-7.2 16-16s-7.2-16-16-16L270.4 80z"},Kc={width:512,height:512,path:"M96 157.5C96 88.2 152.2 32 221.5 32L368 32c17.7 0 32 14.3 32 32s-14.3 32-32 32L221.5 96c-34 0-61.5 27.5-61.5 61.5 0 31 23.1 57.2 53.9 61l44.1 5.5 222 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l83.1 0C103 204.6 96 181.8 96 157.5zM349.2 336l65.5 0c.9 6.1 1.4 12.2 1.4 18.5 0 69.3-56.2 125.5-125.5 125.5L144 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l146.5 0c34 0 61.5-27.5 61.5-61.5 0-6.4-1-12.7-2.8-18.5z"},Wc={width:576,height:512,path:"M96 64C78.3 64 64 78.3 64 96s14.3 32 32 32l15.3 0 89.6 128-89.6 128-15.3 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0c10.4 0 20.2-5.1 26.2-13.6L240 311.8 325.8 434.4c6 8.6 15.8 13.6 26.2 13.6l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-15.3 0-89.6-128 89.6-128 15.3 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0c-10.4 0-20.2 5.1-26.2 13.6L240 200.2 154.2 77.6C148.2 69.1 138.4 64 128 64L96 64zM544 320c0-11.1-5.7-21.4-15.2-27.2s-21.2-6.4-31.1-1.4l-32 16c-15.8 7.9-22.2 27.1-14.3 42.9 5.6 11.2 16.9 17.7 28.6 17.7l0 80c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-128z"},Gc={width:576,height:512,path:"M544 32c0-11.1-5.7-21.4-15.2-27.2s-21.2-6.4-31.1-1.4l-32 16C449.9 27.3 443.5 46.5 451.4 62.3 457 73.5 468.3 80 480 80l0 80c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-128zM96 64C78.3 64 64 78.3 64 96s14.3 32 32 32l15.3 0 89.6 128-89.6 128-15.3 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0c10.4 0 20.2-5.1 26.2-13.6L240 311.8 325.8 434.4c6 8.6 15.8 13.6 26.2 13.6l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-15.3 0-89.6-128 89.6-128 15.3 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0c-10.4 0-20.2 5.1-26.2 13.6L240 200.2 154.2 77.6C148.2 69.1 138.4 64 128 64L96 64z"},Yc={width:448,height:512,path:"M384 32c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64l-320 0-6.5-.3C25.2 476.4 0 449.1 0 416L0 96C0 60.7 28.7 32 64 32l320 0zM64 320l0 96 128 0 0-96-128 0zm192 0l0 96 128 0 0-96-128 0zM64 256l128 0 0-96-128 0 0 96zm192 0l128 0 0-96-128 0 0 96z"},Xc={width:576,height:512,path:"M41-24.9c-9.4-9.4-24.6-9.4-33.9 0S-2.3-.3 7 9.1l528 528c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L322.7 256.9 368.2 96 471 96 465 120.2c-4.3 17.1 6.1 34.5 23.3 38.8s34.5-6.1 38.8-23.3l11-44.1C545.6 61.3 522.7 32 491.5 32l-319 0c-19.8 0-37.3 12.1-44.5 30.1l-87-87zM180.4 114.5l4.6-18.5 116.7 0-30.8 109-90.5-90.5zM241 310.8L211.3 416 160 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-42.2 0 15.1-53.3-51.9-51.9z"},Jc={width:512,height:512,path:"M256 0c14.7 0 28.2 8.1 35.2 21l216 400c6.7 12.4 6.4 27.4-.8 39.5S486.1 480 472 480L40 480c-14.1 0-27.2-7.4-34.4-19.5s-7.5-27.1-.8-39.5l216-400c7-12.9 20.5-21 35.2-21zm0 352a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.5 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z"},Zc={width:384,height:512,path:"M0 32C0 14.3 14.3 0 32 0L96 0c17.7 0 32 14.3 32 32S113.7 64 96 64l0 160c0 53 43 96 96 96s96-43 96-96l0-160c-17.7 0-32-14.3-32-32S270.3 0 288 0l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 160c0 88.4-71.6 160-160 160S32 312.4 32 224L32 64C14.3 64 0 49.7 0 32zM0 480c0-17.7 14.3-32 32-32l320 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 512c-17.7 0-32-14.3-32-32z"},Qc={width:384,height:512,path:"M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"},tu={width:128,height:512,path:"M64 144a56 56 0 1 1 0-112 56 56 0 1 1 0 112zm0 224c30.9 0 56 25.1 56 56s-25.1 56-56 56-56-25.1-56-56 25.1-56 56-56zm56-112c0 30.9-25.1 56-56 56s-56-25.1-56-56 25.1-56 56-56 56 25.1 56 56z"},eu={width:512,height:512,path:"M195.1 9.5C198.1-5.3 211.2-16 226.4-16l59.8 0c15.2 0 28.3 10.7 31.3 25.5L332 79.5c14.1 6 27.3 13.7 39.3 22.8l67.8-22.5c14.4-4.8 30.2 1.2 37.8 14.4l29.9 51.8c7.6 13.2 4.9 29.8-6.5 39.9L447 233.3c.9 7.4 1.3 15 1.3 22.7s-.5 15.3-1.3 22.7l53.4 47.5c11.4 10.1 14 26.8 6.5 39.9l-29.9 51.8c-7.6 13.1-23.4 19.2-37.8 14.4l-67.8-22.5c-12.1 9.1-25.3 16.7-39.3 22.8l-14.4 69.9c-3.1 14.9-16.2 25.5-31.3 25.5l-59.8 0c-15.2 0-28.3-10.7-31.3-25.5l-14.4-69.9c-14.1-6-27.2-13.7-39.3-22.8L73.5 432.3c-14.4 4.8-30.2-1.2-37.8-14.4L5.8 366.1c-7.6-13.2-4.9-29.8 6.5-39.9l53.4-47.5c-.9-7.4-1.3-15-1.3-22.7s.5-15.3 1.3-22.7L12.3 185.8c-11.4-10.1-14-26.8-6.5-39.9L35.7 94.1c7.6-13.2 23.4-19.2 37.8-14.4l67.8 22.5c12.1-9.1 25.3-16.7 39.3-22.8L195.1 9.5zM256.3 336a80 80 0 1 0 -.6-160 80 80 0 1 0 .6 160z"},ou={width:512,height:512,path:"M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L368 46.1 465.9 144 490.3 119.6c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L432 177.9 334.1 80 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"},nu={width:448,height:512,path:"M136.7 5.9L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-8.7-26.1C306.9-7.2 294.7-16 280.9-16L167.1-16c-13.8 0-26 8.8-30.4 21.9zM416 144L32 144 53.1 467.1C54.7 492.4 75.7 512 101 512L347 512c25.3 0 46.3-19.6 47.9-44.9L416 144z"},Th={alignCenter:Ll,alignJustify:Ol,alignLeft:Rl,alignRight:Il,arrowDown:Fl,arrowLeft:Nl,arrowRight:Dl,arrowRotateLeft:jl,arrowRotateRight:Ul,arrowUp:Bl,arrowUpRightFromSquare:Hl,asterisk:Vl,bold:ql,bracketsCurly:Kl,calendar:Wl,caretDown:Gl,caretUp:Yl,check:Xl,chevronDown:Gs,chevronLeft:Jl,chevronRight:Zl,chevronUp:Ql,circle:tc,circleCheck:ec,circleExclamation:oc,circleInfo:nc,clipboard:ic,clock:sc,clone:rc,code:ac,copy:lc,download:cc,ellipsis:uc,ellipsisVertical:tu,emptySet:dc,eye:pc,fileDashedLine:hc,flagCheckered:fc,gear:eu,gripDots:mc,gripDotsVertical:vc,gripMove:gc,h1:bc,h2:yc,h3:kc,h4:wc,h5:xc,h6:_c,heading:Oc,highlighter:Sc,house:Cc,italic:Ec,lightbulb:Ac,link:$c,lock:Tc,list:Pc,listOl:Mc,listUl:zc,minus:Lc,paragraph:Rc,pen:Ic,penToSquare:ou,plus:Fc,circlePlus:Nc,quoteRight:Dc,arrowsRotate:jc,magnifyingGlass:Uc,share:Bc,smallCaps:Hc,sliders:Vc,slidersOutline:qc,strikethrough:Kc,subscript:Wc,superscript:Gc,table:Yc,textSlash:Xc,trash:nu,triangleExclamation:Jc,underline:Zc,xmark:Qc},Ph=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),_i=e=>{const t=e.trim();return t&&(/[A-Z]/.test(t)?Ph(t):t.toLowerCase())},Vi="__PK_ICON_REGISTRY__",qi="__PK_ICON_REGISTRY_LISTENERS__",Si=()=>{const e=globalThis;return e[Vi]||(e[Vi]={}),e[Vi]},iu=()=>{const e=globalThis;return e[qi]||(e[qi]=new Set),e[qi]},su=()=>{for(const e of iu())try{e()}catch{}},Mh=e=>{const t=iu();return t.add(e),()=>{t.delete(e)}},zh=()=>Object.keys(Si()).sort(),Lh=e=>{if(!e)return;const t=Si();return t[_i(e)]??t[e]},Oh=(e,t)=>{const o=_i(e);if(!o)throw new Error("registerIcon: name must be a non-empty string");if(!t?.path||!t.width||!t.height)throw new Error(`registerIcon: icon "${o}" must include width, height, and path`);Si()[o]=t,su()},Rh=e=>{let t=!1;for(const[o,n]of Object.entries(e)){const i=_i(o);if(!i)throw new Error("registerIcon: name must be a non-empty string");if(!n?.path||!n.width||!n.height)throw new Error(`registerIcon: icon "${i}" must include width, height, and path`);Si()[i]=n,t=!0}t&&su()},ta=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),ru=e=>{const{width:t,height:o}=e;if(t===o)return`0 0 ${t} ${o}`;const n=Math.max(t,o);return`${(t-n)/2} ${(o-n)/2} ${n} ${n}`},Ys=(e,t={})=>{const{title:o,className:n,attributes:i={}}=t,s={xmlns:"http://www.w3.org/2000/svg",viewBox:ru(e),overflow:"visible",...i};return n&&(s.class=n),o?(s.role="img",s["aria-label"]=o):(s["aria-hidden"]="true",s.focusable="false"),`<svg ${Object.entries(s).map(([r,a])=>`${r}="${ta(a)}"`).join(" ")}><path fill="currentColor" d="${ta(e.path)}"/></svg>`};const Ih=Object.freeze(Object.defineProperty({__proto__:null,alignCenter:Ll,alignJustify:Ol,alignLeft:Rl,alignRight:Il,arrowDown:Fl,arrowLeft:Nl,arrowRight:Dl,arrowRotateLeft:jl,arrowRotateRight:Ul,arrowUp:Bl,arrowUpRightFromSquare:Hl,arrowsRotate:jc,asterisk:Vl,bold:ql,bracketsCurly:Kl,calendar:Wl,caretDown:Gl,caretUp:Yl,check:Xl,chevronDown:Gs,chevronLeft:Jl,chevronRight:Zl,chevronUp:Ql,circle:tc,circleCheck:ec,circleExclamation:oc,circleInfo:nc,circlePlus:Nc,clipboard:ic,clock:sc,clone:rc,code:ac,copy:lc,download:cc,ellipsis:uc,ellipsisVertical:tu,emptySet:dc,eye:pc,fileDashedLine:hc,flagCheckered:fc,gear:eu,getIcon:Lh,getIconNames:zh,gripDots:mc,gripDotsVertical:vc,gripMove:gc,h1:bc,h2:yc,h3:kc,h4:wc,h5:xc,h6:_c,heading:Oc,highlighter:Sc,house:Cc,iconToSvg:Ys,iconViewBox:ru,icons:Th,italic:Ec,lightbulb:Ac,link:$c,list:Pc,listOl:Mc,listUl:zc,lock:Tc,magnifyingGlass:Uc,minus:Lc,normalizeIconName:_i,paragraph:Rc,pen:Ic,penToSquare:ou,plus:Fc,quoteRight:Dc,registerIcon:Oh,registerIcons:Rh,share:Bc,sliders:Vc,slidersOutline:qc,smallCaps:Hc,strikethrough:Kc,subscribeIconRegistry:Mh,subscript:Wc,superscript:Gc,table:Yc,textSlash:Xc,trash:nu,triangleExclamation:Jc,underline:Zc,xmark:Qc},Symbol.toStringTag,{value:"Module"}));var Xs=(e,t={})=>Ys(e,{title:t.title}),Fh=(e,t={})=>{const o=document.createElement("template");o.innerHTML=Xs(e,t);const n=o.content.firstElementChild;if(!(n instanceof SVGSVGElement))throw new Error("Icon render did not produce an SVG element.");return n},fs=Object.defineProperty,Nh=Object.getOwnPropertyDescriptor,Dh=Object.getOwnPropertyNames,jh=Object.prototype.hasOwnProperty,Uh=(e,t)=>{let o={};for(var n in e)fs(o,n,{get:e[n],enumerable:!0});return fs(o,Symbol.toStringTag,{value:"Module"}),o},Bh=(e,t,o,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(var i=Dh(t),s=0,r=i.length,a;s<r;s++)a=i[s],!jh.call(e,a)&&a!==o&&fs(e,a,{get:(l=>t[l]).bind(null,a),enumerable:!(n=Nh(t,a))||n.enumerable});return e},Hh=(e,t,o)=>(Bh(e,t,"default"),o),Vh="M64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l208 0 32 0 16 0 256 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L320 64l-16 0-32 0L64 64zm512 48c8.8 0 16 7.2 16 16l0 256c0 8.8-7.2 16-16 16l-256 0 0-288 256 0zM178.3 175.9l64 144c4.5 10.1-.1 21.9-10.2 26.4s-21.9-.1-26.4-10.2L196.8 316l-73.6 0-8.9 20.1c-4.5 10.1-16.3 14.6-26.4 10.2s-14.6-16.3-10.2-26.4l64-144c3.2-7.2 10.4-11.9 18.3-11.9s15.1 4.7 18.3 11.9zM179 276l-19-42.8L141 276l38 0zM456 164c-11 0-20 9-20 20l0 4-52 0c-11 0-20 9-20 20s9 20 20 20l72 0 35.1 0c-7.3 16.7-17.4 31.9-29.8 45l-.5-.5-14.6-14.6c-7.8-7.8-20.5-7.8-28.3 0s-7.8 20.5 0 28.3L430 298.3c-5.9 3.6-12.1 6.9-18.5 9.8l-3.6 1.6c-10.1 4.5-14.6 16.3-10.2 26.4s16.3 14.6 26.4 10.2l3.6-1.6c12-5.3 23.4-11.8 34-19.4c4.3 3 8.6 5.8 13.1 8.5l18.9 11.3c9.5 5.7 21.8 2.6 27.4-6.9s2.6-21.8-6.9-27.4l-18.9-11.3c-.9-.5-1.8-1.1-2.7-1.6c17.2-18.8 30.7-40.9 39.6-65.4L534 228l2 0c11 0 20-9 20-20s-9-20-20-20l-16 0-44 0 0-4c0-11-9-20-20-20z",qh=()=>{const e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("aria-hidden","true"),e.setAttribute("xmlns","http://www.w3.org/2000/svg"),e.setAttribute("viewBox","0 0 640 512");const t=document.createElementNS("http://www.w3.org/2000/svg","path");return t.setAttribute("d",Vh),e.append(t),e},au=Uh({createIconElement:()=>Fh,createTranslationIconElement:()=>qh,renderIconHtml:()=>Xs});Hh(au,Ih);function Kh(e="default"){return e==="xxs"||e==="xs"?"xxs":e==="lg"||e==="xl"?"sm":"xs"}function Wh(e="default",t){return t||(e==="primary"||e==="secondary"||e==="dashed"||e==="outline"||e==="transparent"?e:"default")}var Gh=[Tl,Ct`
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
    `],To,Do=(To=class extends Uo{constructor(...t){super(...t),this.variant="default",this.size="sm",this.centered=!1}render(){return J`
            <div part="base" class="spinner" aria-hidden="true"></div>
        `}},To.styles=Gh,To);x([E({reflect:!0})],Do.prototype,"variant",void 0);x([E({reflect:!0})],Do.prototype,"size",void 0);x([E({reflect:!0})],Do.prototype,"tone",void 0);x([E({type:Boolean,reflect:!0})],Do.prototype,"centered",void 0);Do=x([He("pk-spinner")],Do);var Yh=Ct`
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
 */const Oe={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},Js=e=>(...t)=>({_$litDirective$:e,values:t});let Zs=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,o,n){this._$Ct=t,this._$AM=o,this._$Ci=n}_$AS(t,o){return this.update(t,o)}update(t,o){return this.render(...o)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ue=Js(class extends Zs{constructor(e){if(super(e),e.type!==Oe.ATTRIBUTE||e.name!=="class"||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(n=>n!=="")));for(const n in t)t[n]&&!this.nt?.has(n)&&this.st.add(n);return this.render(t)}const o=e.element.classList;for(const n of this.st)n in t||(o.remove(n),this.st.delete(n));for(const n in t){const i=!!t[n];i===this.st.has(n)||this.nt?.has(n)||(i?(o.add(n),this.st.add(n)):(o.remove(n),this.st.delete(n)))}return Xt}});/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let gs=class extends Zs{constructor(t){if(super(t),this.it=U,t.type!==Oe.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===U||t==null)return this._t=void 0,this.it=t;if(t===Xt)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const o=[t];return o.raw=o,this._t={_$litType$:this.constructor.resultType,strings:o,values:[]}}};gs.directiveName="unsafeHTML",gs.resultType=1;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ms extends gs{}ms.directiveName="unsafeSVG",ms.resultType=2;const lu=Js(ms);var Xh=[Tl,Yh,Ml(),Pl(".button"),$h(),zl(".button"),Ct`
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
    `],Jh=Ys(Gs),io,mt=(io=class extends Uo{constructor(...t){super(...t),this.variant="default",this.size="default",this.disabled=!1,this.loading=!1,this.withCaret=!1,this.groupTrigger=!1,this.icon=!1,this.title="",this.type="button",this.hasDefaultSlotContent=!1,this.hasStartSlotContent=!1,this.hasEndSlotContent=!1,this.startSlotChanged=o=>{this.iconSlotChanged(o,"start")},this.endSlotChanged=o=>{this.iconSlotChanged(o,"end")},this.handleHostClick=o=>{if(this.disabled||this.loading||this.href||this.type!=="submit"&&this.type!=="reset")return;const n=this.resolveAssociatedForm();if(n){if(o.preventDefault(),o.stopPropagation(),this.type==="reset"){n.reset();return}if(typeof n.requestSubmit=="function"){n.requestSubmit();return}n.dispatchEvent(new Event("submit",{bubbles:!0,cancelable:!0}))}}}defaultSlotChanged(t){const o=t.target;this.hasDefaultSlotContent=o.assignedNodes({flatten:!0}).some(n=>n.nodeType===Node.TEXT_NODE?n.textContent?.trim():n.nodeType===Node.ELEMENT_NODE)}iconSlotChanged(t,o){const n=t.target.assignedNodes({flatten:!0}).some(i=>i.nodeType===Node.TEXT_NODE?i.textContent?.trim():i.nodeType===Node.ELEMENT_NODE);o==="start"?this.hasStartSlotContent=n:this.hasEndSlotContent=n}buttonClasses(){return ue({button:!0,"has-label":this.hasDefaultSlotContent,loading:this.loading,caret:this.withCaret,"group-trigger":this.groupTrigger})}connectedCallback(){super.connectedCallback(),this.setAttribute("data-slot","button"),this.addEventListener("click",this.handleHostClick)}disconnectedCallback(){this.removeEventListener("click",this.handleHostClick),super.disconnectedCallback()}resolveAssociatedForm(){const t=(this.form||this.getAttribute("form")||"").trim();if(t){const n=this.ownerDocument?.getElementById(t);if(n instanceof HTMLFormElement&&n.id!=="main")return n}const o=this.closest("form");return o&&o.id!=="main"?o:null}render(){const t=this.spinnerSize||Kh(this.size),o=Wh(this.variant,this.spinnerVariant);return J`
            ${this.href?J`
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
                `:J`
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
        `}renderInner(t,o){return J`
            <span
                class=${ue({"icon-slot":!0,"icon-slot--start":!0,"icon-slot--has-content":this.hasStartSlotContent})}
            >
                <slot name="start" @slotchange=${this.startSlotChanged}></slot>
            </span>
            ${this.loading?J`
                    <pk-spinner
                        variant=${o}
                        size=${t}
                        tone=${this.spinnerTone??U}
                        centered
                    ></pk-spinner>
                `:U}
            <span
                class=${ue({label:!0,"is-empty":!this.hasDefaultSlotContent,loading:this.loading})}
            >
                <slot @slotchange=${this.defaultSlotChanged}></slot>
            </span>
            <span
                class=${ue({"icon-slot":!0,"icon-slot--end":!0,"icon-slot--has-content":this.hasEndSlotContent})}
            >
                <slot name="end" @slotchange=${this.endSlotChanged}></slot>
            </span>
            ${this.withCaret||this.groupTrigger?J`<span part="caret" class="caret">${lu(Jh)}</span>`:U}
        `}},io.shadowRootOptions={mode:"open",delegatesFocus:!0},io.styles=Xh,io);x([E({reflect:!0})],mt.prototype,"variant",void 0);x([E({reflect:!0})],mt.prototype,"size",void 0);x([E({type:Boolean,reflect:!0})],mt.prototype,"disabled",void 0);x([E({type:Boolean,reflect:!0})],mt.prototype,"loading",void 0);x([E({reflect:!0,attribute:"spinner-size"})],mt.prototype,"spinnerSize",void 0);x([E({reflect:!0,attribute:"spinner-variant"})],mt.prototype,"spinnerVariant",void 0);x([E({reflect:!0,attribute:"spinner-tone"})],mt.prototype,"spinnerTone",void 0);x([E({type:Boolean,reflect:!0,attribute:"with-caret"})],mt.prototype,"withCaret",void 0);x([E({type:Boolean,reflect:!0,attribute:"group-trigger"})],mt.prototype,"groupTrigger",void 0);x([E({type:Boolean,reflect:!0})],mt.prototype,"icon",void 0);x([E()],mt.prototype,"href",void 0);x([E()],mt.prototype,"target",void 0);x([E()],mt.prototype,"rel",void 0);x([E()],mt.prototype,"name",void 0);x([E()],mt.prototype,"value",void 0);x([E()],mt.prototype,"title",void 0);x([E()],mt.prototype,"type",void 0);x([E({reflect:!0})],mt.prototype,"form",void 0);x([Qt()],mt.prototype,"hasDefaultSlotContent",void 0);x([Qt()],mt.prototype,"hasStartSlotContent",void 0);x([Qt()],mt.prototype,"hasEndSlotContent",void 0);mt=x([He("pk-button")],mt);var Qs=class{constructor(e,...t){this.host=e,this.boundSlots=new Set,this.lastHasContent=new Map,this.handleSlotChange=()=>{let o=!1;for(const n of this.slotNames){const i=this.test(n);this.lastHasContent.get(n)!==i&&(this.lastHasContent.set(n,i),o=!0)}o&&this.host.requestUpdate()},this.slotNames=t,e.addController(this)}hostConnected(){this.bindSlotListeners()}hostUpdated(){this.bindSlotListeners()}hostDisconnected(){for(const e of this.boundSlots)e.removeEventListener("slotchange",this.handleSlotChange);this.boundSlots.clear()}bindSlotListeners(){for(const e of this.slotNames){const t=this.findSlot(e);!t||this.boundSlots.has(t)||(this.boundSlots.add(t),t.addEventListener("slotchange",this.handleSlotChange),this.lastHasContent.has(e)||this.lastHasContent.set(e,this.test(e)))}}findSlot(e){return this.host.shadowRoot?e?this.host.shadowRoot.querySelector(`slot[name="${e}"]`):this.host.shadowRoot.querySelector("slot:not([name])"):null}test(e,t=!1){if(t||this.hasLightDomSlotContent(e))return!0;const o=this.findSlot(e);return o?o.assignedNodes({flatten:!0}).some(n=>n.nodeType===Node.TEXT_NODE?!!n.textContent?.trim():n.nodeType===Node.ELEMENT_NODE):!1}hasLightDomSlotContent(e){return[...this.host.children].some(t=>t.getAttribute("slot")===e)}},cu=Ct`
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
`,ea=0;function ii(e="pk"){return ea+=1,`${e}-${ea}`}var oa={},Zh=(e={})=>{oa={...oa,...e}},uu=["aria-labelledby","aria-describedby","aria-invalid","aria-errormessage","aria-required","aria-label"];function Qh(e){return e.hasAttribute("aria-labelledby")||e.hasAttribute("aria-describedby")||e.hasAttribute("aria-errormessage")}function tf(e,t){for(const o of uu){const n=e.getAttribute(o);n!==null?t.setAttribute(o,n):t.removeAttribute(o)}}function du({control:e,labelId:t,instructionsId:o,hasLabel:n,hasInstructions:i,required:s=!1,invalid:r=!1}){n&&t?e.setAttribute("aria-labelledby",t):e.removeAttribute("aria-labelledby"),i&&o?e.setAttribute("aria-describedby",o):e.removeAttribute("aria-describedby"),s?e.setAttribute("aria-required","true"):e.removeAttribute("aria-required"),r?e.setAttribute("aria-invalid","true"):e.removeAttribute("aria-invalid"),e.removeAttribute("aria-errormessage")}var ef=class{constructor(e,t,o){this.host=e,this.getTarget=t,this.onSync=o}connect(){this.sync(),this.observer=new MutationObserver(()=>{this.sync()}),this.observer.observe(this.host,{attributes:!0,attributeFilter:[...uu]})}disconnect(){this.observer?.disconnect(),this.observer=void 0}sync(){if(!Qh(this.host)){this.onSync?.();return}const e=this.getTarget();e&&tf(this.host,e)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const be=e=>e??U;var no=[];function of(e){no.push(e)}function nf(e){for(let t=no.length-1;t>=0;t-=1)if(no[t]===e){no.splice(t,1);break}}function Ki(e){return no.length>0&&no[no.length-1]===e}var pu=class extends Event{constructor(){super("pk-show",{bubbles:!0,cancelable:!1,composed:!0})}},hu=class extends Event{constructor(){super("pk-after-show",{bubbles:!0,cancelable:!1,composed:!0})}},fu=class extends Event{constructor(e="unknown"){super("pk-hide",{bubbles:!0,cancelable:!0,composed:!0}),this.detail={source:e}}},gu=class extends Event{constructor(){super("pk-after-hide",{bubbles:!0,cancelable:!1,composed:!0})}};function tr(e){const t=e.split("-")[0];return t==="inline-start"?"left":t==="inline-end"?"right":t==="top"||t==="bottom"||t==="left"||t==="right"?t:"bottom"}function sf(e,t,o,n,i){const s=tr(e),r=t.x+t.width/2-o.x,a=t.y+t.height/2-o.y;return Math.abs(i?.y??0)>n&&(s==="top"||s==="bottom")?`${r}px ${t.y+t.height/2-o.y}px`:{top:`${r}px calc(100% + ${n}px)`,bottom:`${r}px ${-n}px`,left:`calc(100% + ${n}px) ${a}px`,right:`${-n}px ${a}px`}[s]}function na(e,t){if(!t){e.removeAttribute("data-side");return}e.setAttribute("data-side",tr(t))}function rf(e,t,o=100,n){const i=()=>e.getAttribute("data-current-placement")??t;return e.hasAttribute("data-current-placement")?Promise.resolve(i()):new Promise(s=>{let r=!1;const a=()=>{r||(r=!0,s(i()))};e.addEventListener("pk-reposition",a,{once:!0}),requestAnimationFrame(()=>{requestAnimationFrame(()=>{e.hasAttribute("data-current-placement")&&a()})}),window.setTimeout(a,o)})}var dn=typeof globalThis.HTMLElement<"u"&&Object.prototype.hasOwnProperty.call(globalThis.HTMLElement.prototype,"popover");const je=Math.min,xe=Math.max,si=Math.round,On=Math.floor,_e=e=>({x:e,y:e}),af={left:"right",right:"left",bottom:"top",top:"bottom"};function mu(e,t,o){return xe(e,je(t,o))}function Bo(e,t){return typeof e=="function"?e(t):e}function ao(e){return e.split("-")[0]}function Ho(e){return e.split("-")[1]}function vu(e){return e==="x"?"y":"x"}function er(e){return e==="y"?"height":"width"}function we(e){const t=e[0];return t==="t"||t==="b"?"y":"x"}function or(e){return vu(we(e))}function lf(e,t,o){o===void 0&&(o=!1);const n=Ho(e),i=or(e),s=er(i);let r=i==="x"?n===(o?"end":"start")?"right":"left":n==="start"?"bottom":"top";return t.reference[s]>t.floating[s]&&(r=ri(r)),[r,ri(r)]}function cf(e){const t=ri(e);return[vs(e),t,vs(t)]}function vs(e){return e.includes("start")?e.replace("start","end"):e.replace("end","start")}const ia=["left","right"],sa=["right","left"],uf=["top","bottom"],df=["bottom","top"];function pf(e,t,o){switch(e){case"top":case"bottom":return o?t?sa:ia:t?ia:sa;case"left":case"right":return t?uf:df;default:return[]}}function hf(e,t,o,n){const i=Ho(e);let s=pf(ao(e),o==="start",n);return i&&(s=s.map(r=>r+"-"+i),t&&(s=s.concat(s.map(vs)))),s}function ri(e){const t=ao(e);return af[t]+e.slice(t.length)}function ff(e){var t,o,n,i;return{top:(t=e.top)!=null?t:0,right:(o=e.right)!=null?o:0,bottom:(n=e.bottom)!=null?n:0,left:(i=e.left)!=null?i:0}}function bu(e){return typeof e!="number"?ff(e):{top:e,right:e,bottom:e,left:e}}function ai(e){const{x:t,y:o,width:n,height:i}=e;return{width:n,height:i,top:o,left:t,right:t+n,bottom:o+i,x:t,y:o}}function ra(e,t,o){let{reference:n,floating:i}=e;const s=we(t),r=or(t),a=er(r),l=ao(t),u=s==="y",c=n.x+n.width/2-i.width/2,d=n.y+n.height/2-i.height/2,m=n[a]/2-i[a]/2;let h;switch(l){case"top":h={x:c,y:n.y-i.height};break;case"bottom":h={x:c,y:n.y+n.height};break;case"right":h={x:n.x+n.width,y:d};break;case"left":h={x:n.x-i.width,y:d};break;default:h={x:n.x,y:n.y}}const v=Ho(t);return v&&(h[r]+=m*(v==="end"?1:-1)*(o&&u?-1:1)),h}async function gf(e,t){var o;t===void 0&&(t={});const{x:n,y:i,platform:s,rects:r,elements:a,strategy:l}=e,{boundary:u="clippingAncestors",rootBoundary:c="viewport",elementContext:d="floating",altBoundary:m=!1,padding:h=0}=Bo(t,e),v=bu(h),P=a[m?d==="floating"?"reference":"floating":d],T=ai(await s.getClippingRect({element:(o=await(s.isElement==null?void 0:s.isElement(P)))==null||o?P:P.contextElement||await(s.getDocumentElement==null?void 0:s.getDocumentElement(a.floating)),boundary:u,rootBoundary:c,strategy:l})),N=d==="floating"?{x:n,y:i,width:r.floating.width,height:r.floating.height}:r.reference,L=await(s.getOffsetParent==null?void 0:s.getOffsetParent(a.floating)),z=await(s.isElement==null?void 0:s.isElement(L))&&await(s.getScale==null?void 0:s.getScale(L))||{x:1,y:1},K=ai(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:N,offsetParent:L,strategy:l}):N);return{top:(T.top-K.top+v.top)/z.y,bottom:(K.bottom-T.bottom+v.bottom)/z.y,left:(T.left-K.left+v.left)/z.x,right:(K.right-T.right+v.right)/z.x}}const mf=50,vf=async(e,t,o)=>{const{placement:n="bottom",strategy:i="absolute",middleware:s=[],platform:r}=o,a=r.detectOverflow?r:{...r,detectOverflow:gf},l=await(r.isRTL==null?void 0:r.isRTL(t));let u=await r.getElementRects({reference:e,floating:t,strategy:i}),{x:c,y:d}=ra(u,n,l),m=n,h=0;const v={};for(let w=0;w<s.length;w++){const P=s[w];if(!P)continue;const{name:T,fn:N}=P,{x:L,y:z,data:K,reset:B}=await N({x:c,y:d,initialPlacement:n,placement:m,strategy:i,middlewareData:v,rects:u,platform:a,elements:{reference:e,floating:t}});c=L??c,d=z??d,v[T]={...v[T],...K},B&&h<mf&&(h++,typeof B=="object"&&(B.placement&&(m=B.placement),B.rects&&(u=B.rects===!0?await r.getElementRects({reference:e,floating:t,strategy:i}):B.rects),{x:c,y:d}=ra(u,m,l)),w=-1)}return{x:c,y:d,placement:m,strategy:i,middlewareData:v}},bf=e=>({name:"arrow",options:e,async fn(t){const{x:o,y:n,placement:i,rects:s,platform:r,elements:a,middlewareData:l}=t,{element:u,padding:c=0}=Bo(e,t)||{};if(u==null)return{};const d=bu(c),m={x:o,y:n},h=or(i),v=er(h),w=await r.getDimensions(u),P=h==="y",T=P?"top":"left",N=P?"bottom":"right",L=P?"clientHeight":"clientWidth",z=s.reference[v]+s.reference[h]-m[h]-s.floating[v],K=m[h]-s.reference[h],B=await(r.getOffsetParent==null?void 0:r.getOffsetParent(u));let V=B?B[L]:0;(!V||!await(r.isElement==null?void 0:r.isElement(B)))&&(V=a.floating[L]||s.floating[v]);const nt=z/2-K/2,Z=V/2-w[v]/2-1,Q=je(d[T],Z),wt=je(d[N],Z),Vt=V-w[v]-wt,ht=V/2-w[v]/2+nt,xt=mu(Q,ht,Vt),Lt=!l.arrow&&Ho(i)!=null&&ht!==xt&&s.reference[v]/2-(ht<Q?Q:wt)-w[v]/2<0,at=Lt?ht<Q?ht-Q:ht-Vt:0;return{[h]:m[h]+at,data:{[h]:xt,centerOffset:ht-xt-at,...Lt&&{alignmentOffset:at}},reset:Lt}}}),yf=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var o,n;const{placement:i,middlewareData:s,rects:r,initialPlacement:a,platform:l,elements:u}=t,{mainAxis:c=!0,crossAxis:d=!0,fallbackPlacements:m,fallbackStrategy:h="bestFit",fallbackAxisSideDirection:v="none",flipAlignment:w=!0,...P}=Bo(e,t);if((o=s.arrow)!=null&&o.alignmentOffset)return{};const T=ao(i),N=we(a),L=ao(a)===a,z=await(l.isRTL==null?void 0:l.isRTL(u.floating)),K=m||(L||!w?[ri(a)]:cf(a)),B=v!=="none";!m&&B&&K.push(...hf(a,w,v,z));const V=[a,...K],nt=await l.detectOverflow(t,P),Z=[];let Q=((n=s.flip)==null?void 0:n.overflows)||[];if(c&&Z.push(nt[T]),d){const xt=lf(i,r,z);Z.push(nt[xt[0]],nt[xt[1]])}if(Q=[...Q,{placement:i,overflows:Z}],!Z.every(xt=>xt<=0)){var wt,Vt;const xt=(((wt=s.flip)==null?void 0:wt.index)||0)+1,Lt=V[xt];if(Lt&&(!(d==="alignment"?N!==we(Lt):!1)||Q.every(W=>we(W.placement)===N?W.overflows[0]>0:!0)))return{data:{index:xt,overflows:Q},reset:{placement:Lt}};let at=(Vt=Q.filter(X=>X.overflows[0]<=0).sort((X,W)=>X.overflows[1]-W.overflows[1])[0])==null?void 0:Vt.placement;if(!at)switch(h){case"bestFit":{var ht;const X=(ht=Q.filter(W=>{if(B){const ft=we(W.placement);return ft===N||ft==="y"}return!0}).map(W=>[W.placement,W.overflows.filter(ft=>ft>0).reduce((ft,Pe)=>ft+Pe,0)]).sort((W,ft)=>W[1]-ft[1])[0])==null?void 0:ht[0];X&&(at=X);break}case"initialPlacement":at=a;break}if(i!==at)return{reset:{placement:at}}}return{}}}},kf=new Set(["left","top"]);async function wf(e,t){const{placement:o,platform:n,elements:i}=e,s=await(n.isRTL==null?void 0:n.isRTL(i.floating)),r=ao(o),a=Ho(o),l=we(o)==="y",u=kf.has(r)?-1:1,c=s&&l?-1:1,d=Bo(t,e);let{mainAxis:m,crossAxis:h,alignmentAxis:v}=typeof d=="number"?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return a&&typeof v=="number"&&(h=a==="end"?v*-1:v),l?{x:h*c,y:m*u}:{x:m*u,y:h*c}}const xf=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){var o,n;const{x:i,y:s,placement:r,middlewareData:a}=t,l=await wf(t,e);return r===((o=a.offset)==null?void 0:o.placement)&&(n=a.arrow)!=null&&n.alignmentOffset?{}:{x:i+l.x,y:s+l.y,data:{...l,placement:r}}}}},_f=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:o,y:n,placement:i,platform:s}=t,{mainAxis:r=!0,crossAxis:a=!1,limiter:l={fn:N=>{let{x:L,y:z}=N;return{x:L,y:z}}},...u}=Bo(e,t),c={x:o,y:n},d=await s.detectOverflow(t,u),m=we(i),h=vu(m);let v=c[h],w=c[m];const P=(N,L)=>mu(L+d[N==="y"?"top":"left"],L,L-d[N==="y"?"bottom":"right"]);r&&(v=P(h,v)),a&&(w=P(m,w));const T=l.fn({...t,[h]:v,[m]:w});return{...T,data:{x:T.x-o,y:T.y-n,enabled:{[h]:r,[m]:a}}}}}},Sf=function(e){return e===void 0&&(e={}),{name:"size",options:e,async fn(t){const{placement:o,rects:n,platform:i,elements:s}=t,{apply:r=()=>{},...a}=Bo(e,t),l=await i.detectOverflow(t,a),u=ao(o),c=Ho(o),d=we(o)==="y",{width:m,height:h}=n.floating;let v,w;u==="top"||u==="bottom"?(v=u,w=c===(await(i.isRTL==null?void 0:i.isRTL(s.floating))?"start":"end")?"left":"right"):(w=u,v=c==="end"?"top":"bottom");const P=h-l.top-l.bottom,T=m-l.left-l.right,N=je(h-l[v],P),L=je(m-l[w],T),z=t.middlewareData.shift,K=!z;let B=N,V=L;z!=null&&z.enabled.x&&(V=T),z!=null&&z.enabled.y&&(B=P),K&&!c&&(d?V=m-2*xe(l.left,l.right):B=h-2*xe(l.top,l.bottom)),await r({...t,availableWidth:V,availableHeight:B});const nt=await i.getDimensions(s.floating);return m!==nt.width||h!==nt.height?{reset:{rects:!0}}:{}}}};function Ci(){return typeof window<"u"}function Vo(e){return yu(e)?(e.nodeName||"").toLowerCase():"#document"}function Ht(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function $e(e){var t;return(t=(yu(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function yu(e){return Ci()?e instanceof Node||e instanceof Ht(e).Node:!1}function he(e){return Ci()?e instanceof Element||e instanceof Ht(e).Element:!1}function Ve(e){return Ci()?e instanceof HTMLElement||e instanceof Ht(e).HTMLElement:!1}function aa(e){return!Ci()||typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof Ht(e).ShadowRoot}function Ei(e){const{overflow:t,overflowX:o,overflowY:n,display:i}=fe(e);return/auto|scroll|overlay|hidden|clip/.test(t+n+o)&&i!=="inline"&&i!=="contents"}function Cf(e){return/^(table|td|th)$/.test(Vo(e))}function Ai(e){try{if(e.matches(":popover-open"))return!0}catch{}try{return e.matches(":modal")}catch{return!1}}const Ef=/transform|translate|scale|rotate|perspective|filter/,Af=/paint|layout|strict|content/,Xe=e=>!!e&&e!=="none";let Wi;function $i(e){const t=he(e)?fe(e):e;return Xe(t.transform)||Xe(t.translate)||Xe(t.scale)||Xe(t.rotate)||Xe(t.perspective)||!nr()&&(Xe(t.backdropFilter)||Xe(t.filter))||Ef.test(t.willChange||"")||Af.test(t.contain||"")}function $f(e){let t=lo(e);for(;Ve(t)&&!_n(t);){if($i(t))return t;if(Ai(t))return null;t=lo(t)}return null}function nr(){return Wi==null&&(Wi=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),Wi}function _n(e){return/^(html|body|#document)$/.test(Vo(e))}function fe(e){return Ht(e).getComputedStyle(e)}function Ti(e){return he(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function lo(e){if(Vo(e)==="html")return e;const t=e.assignedSlot||e.parentNode||aa(e)&&e.host||$e(e);return aa(t)?t.host:t}function ku(e){const t=lo(e);return _n(t)?(e.ownerDocument||e).body:Ve(t)&&Ei(t)?t:ku(t)}function jo(e,t,o){var n;t===void 0&&(t=[]),o===void 0&&(o=!0);const i=ku(e),s=i===((n=e.ownerDocument)==null?void 0:n.body),r=Ht(i);if(s){const a=bs(r);return t.concat(r,r.visualViewport||[],Ei(i)?i:[],a&&o?jo(a):[])}else return t.concat(i,jo(i,[],o))}function bs(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function wu(e){const t=fe(e);let o=parseFloat(t.width)||0,n=parseFloat(t.height)||0;const i=Ve(e),s=i?e.offsetWidth:o,r=i?e.offsetHeight:n,a=si(o)!==s||si(n)!==r;return a&&(o=s,n=r),{width:o,height:n,$:a}}function ir(e){return he(e)?e:e.contextElement}function Ao(e){const t=ir(e);if(!Ve(t))return _e(1);const o=t.getBoundingClientRect(),{width:n,height:i,$:s}=wu(t);let r=(s?si(o.width):o.width)/n,a=(s?si(o.height):o.height)/i;return(!r||!Number.isFinite(r))&&(r=1),(!a||!Number.isFinite(a))&&(a=1),{x:r,y:a}}const Tf=_e(0);function xu(e){const t=Ht(e);return!nr()||!t.visualViewport?Tf:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Pf(e,t,o){return t===void 0&&(t=!1),!!o&&t&&o===Ht(e)}function co(e,t,o,n){t===void 0&&(t=!1),o===void 0&&(o=!1);const i=e.getBoundingClientRect(),s=ir(e);let r=_e(1);t&&(n?he(n)&&(r=Ao(n)):r=Ao(e));const a=Pf(s,o,n)?xu(s):_e(0);let l=(i.left+a.x)/r.x,u=(i.top+a.y)/r.y,c=i.width/r.x,d=i.height/r.y;if(s&&n){const m=Ht(s),h=he(n)?Ht(n):n;let v=m,w=bs(v);for(;w&&h!==v;){const P=Ao(w),T=w.getBoundingClientRect(),N=fe(w),L=T.left+(w.clientLeft+parseFloat(N.paddingLeft))*P.x,z=T.top+(w.clientTop+parseFloat(N.paddingTop))*P.y;l*=P.x,u*=P.y,c*=P.x,d*=P.y,l+=L,u+=z,v=Ht(w),w=bs(v)}}return ai({width:c,height:d,x:l,y:u})}function Pi(e,t){const o=Ti(e).scrollLeft;return t?t.left+o:co($e(e)).left+o}function _u(e,t){const o=e.getBoundingClientRect(),n=o.left+t.scrollLeft-Pi(e,o),i=o.top+t.scrollTop;return{x:n,y:i}}function Mf(e){let{elements:t,rect:o,offsetParent:n,strategy:i}=e;const s=i==="fixed",r=$e(n),a=t?Ai(t.floating):!1;if(n===r||a&&s)return o;let l={scrollLeft:0,scrollTop:0},u=_e(1);const c=_e(0),d=Ve(n);if((d||!s)&&((Vo(n)!=="body"||Ei(r))&&(l=Ti(n)),d)){const h=co(n);u=Ao(n),c.x=h.x+n.clientLeft,c.y=h.y+n.clientTop}const m=r&&!d&&!s?_u(r,l):_e(0);return{width:o.width*u.x,height:o.height*u.y,x:o.x*u.x-l.scrollLeft*u.x+c.x+m.x,y:o.y*u.y-l.scrollTop*u.y+c.y+m.y}}function zf(e){return e.getClientRects?Array.from(e.getClientRects()):[]}function Lf(e){const t=Ti(e),o=e.ownerDocument.body,n=xe(e.scrollWidth,e.clientWidth,o.scrollWidth,o.clientWidth),i=xe(e.scrollHeight,e.clientHeight,o.scrollHeight,o.clientHeight);let s=-t.scrollLeft+Pi(e);const r=-t.scrollTop;return fe(o).direction==="rtl"&&(s+=xe(e.clientWidth,o.clientWidth)-n),{width:n,height:i,x:s,y:r}}const Of=25;function Rf(e,t,o){o===void 0&&(o="viewport");const n=o==="layoutViewport",i=Ht(e),s=$e(e),r=i.visualViewport;let a=s.clientWidth,l=s.clientHeight,u=0,c=0;if(r){const m=!nr()||t==="fixed";n?m||(u=-r.offsetLeft,c=-r.offsetTop):(a=r.width,l=r.height,m&&(u=r.offsetLeft,c=r.offsetTop))}if(Pi(s)<=0){const m=s.ownerDocument,h=m.body,v=getComputedStyle(h),w=m.compatMode==="CSS1Compat"&&parseFloat(v.marginLeft)+parseFloat(v.marginRight)||0,P=Math.abs(s.clientWidth-h.clientWidth-w),T=getComputedStyle(s).scrollbarGutter==="stable both-edges"?P/2:P;T<=Of&&(a-=T)}return{width:a,height:l,x:u,y:c}}function If(e,t){const o=co(e,!0,t==="fixed"),n=o.top+e.clientTop,i=o.left+e.clientLeft,s=Ao(e),r=e.clientWidth*s.x,a=e.clientHeight*s.y,l=i*s.x,u=n*s.y;return{width:r,height:a,x:l,y:u}}function la(e,t,o){let n;if(t==="viewport"||t==="layoutViewport")n=Rf(e,o,t);else if(t==="document")n=Lf($e(e));else if(he(t))n=If(t,o);else{const i=xu(e);n={x:t.x-i.x,y:t.y-i.y,width:t.width,height:t.height}}return ai(n)}function Ff(e,t){const o=t.get(e);if(o)return o;let n=jo(e,[],!1).filter(a=>he(a)&&Vo(a)!=="body"),i=null;const s=fe(e).position==="fixed";let r=s?lo(e):e;for(;he(r)&&!_n(r);){const a=fe(r),l=$i(r),u=i?i.position:s?"fixed":"";!l&&(u==="fixed"||u==="absolute"&&a.position==="static")?n=n.filter(d=>d!==r):i=a,r=lo(r)}return t.set(e,n),n}function Nf(e){let{element:t,boundary:o,rootBoundary:n,strategy:i}=e;const r=[...o==="clippingAncestors"?Ai(t)?[]:Ff(t,this._c):[].concat(o),n],a=la(t,r[0],i);let l=a.top,u=a.right,c=a.bottom,d=a.left;for(let m=1;m<r.length;m++){const h=la(t,r[m],i);l=xe(h.top,l),u=je(h.right,u),c=je(h.bottom,c),d=xe(h.left,d)}return{width:u-d,height:c-l,x:d,y:l}}function Df(e){const{width:t,height:o}=wu(e);return{width:t,height:o}}function jf(e,t,o){const n=Ve(t),i=$e(t),s=o==="fixed",r=co(e,!0,s,t);let a={scrollLeft:0,scrollTop:0};const l=_e(0);if((n||!s)&&((Vo(t)!=="body"||Ei(i))&&(a=Ti(t)),n)){const m=co(t,!0,s,t);l.x=m.x+t.clientLeft,l.y=m.y+t.clientTop}!n&&i&&(l.x=Pi(i));const u=i&&!n&&!s?_u(i,a):_e(0),c=r.left+a.scrollLeft-l.x-u.x,d=r.top+a.scrollTop-l.y-u.y;return{x:c,y:d,width:r.width,height:r.height}}function Gi(e){return fe(e).position==="static"}function ca(e,t){if(!Ve(e)||fe(e).position==="fixed")return null;if(t)return t(e);let o=e.offsetParent;return $e(e)===o&&(o=o.ownerDocument.body),o}function Su(e,t){const o=Ht(e);if(Ai(e))return o;if(!Ve(e)){let i=lo(e);for(;i&&!_n(i);){if(he(i)&&!Gi(i))return i;i=lo(i)}return o}let n=ca(e,t);for(;n&&Cf(n)&&Gi(n);)n=ca(n,t);return n&&_n(n)&&Gi(n)&&!$i(n)?o:n||$f(e)||o}const Uf=async function(e){const t=this.getOffsetParent||Su,o=this.getDimensions,n=await o(e.floating);return{reference:jf(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:n.width,height:n.height}}};function Bf(e){return fe(e).direction==="rtl"}const Bn={convertOffsetParentRelativeRectToViewportRelativeRect:Mf,getDocumentElement:$e,getClippingRect:Nf,getOffsetParent:Su,getElementRects:Uf,getClientRects:zf,getDimensions:Df,getScale:Ao,isElement:he,isRTL:Bf};function Cu(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function Hf(e,t,o){let n=null,i;const s=$e(e);function r(){var c;clearTimeout(i),(c=n)==null||c.disconnect(),n=null}function a(c,d){c===void 0&&(c=!1),d===void 0&&(d=1),r();const m=e.getBoundingClientRect(),{left:h,top:v,width:w,height:P}=m;if(c||t(),!w||!P)return;const T=On(v),N=On(s.clientWidth-(h+w)),L=On(s.clientHeight-(v+P)),z=On(h),B={rootMargin:-T+"px "+-N+"px "+-L+"px "+-z+"px",threshold:xe(0,je(1,d))||1};let V=!0;function nt(Z){const Q=Z[0].intersectionRatio;if(!Cu(m,e.getBoundingClientRect()))return a();if(Q!==d){if(!V)return a();Q?a(!1,Q):i=setTimeout(()=>{a(!1,1e-7)},1e3)}V=!1}try{n=new IntersectionObserver(nt,{...B,root:s.ownerDocument})}catch{n=new IntersectionObserver(nt,B)}n.observe(e)}const l=Ht(e),u=()=>a(o);return l.addEventListener("resize",u),a(!0),()=>{l.removeEventListener("resize",u),r()}}function Vf(e,t,o,n){n===void 0&&(n={});const{ancestorScroll:i=!0,ancestorResize:s=!0,elementResize:r=typeof ResizeObserver=="function",layoutShift:a=typeof IntersectionObserver=="function",animationFrame:l=!1}=n,u=ir(e),c=i||s?[...u?jo(u):[],...t?jo(t):[]]:[];c.forEach(T=>{i&&T.addEventListener("scroll",o),s&&T.addEventListener("resize",o)});const d=u&&a?Hf(u,o,s):null;let m=-1,h=null;r&&(h=new ResizeObserver(T=>{let[N]=T;N&&N.target===u&&h&&t&&(h.unobserve(t),cancelAnimationFrame(m),m=requestAnimationFrame(()=>{var L;(L=h)==null||L.observe(t)})),o()}),u&&!l&&h.observe(u),t&&h.observe(t));let v,w=l?co(e):null;l&&P();function P(){const T=co(e);w&&!Cu(w,T)&&o(),w=T,v=requestAnimationFrame(P)}return o(),()=>{var T;c.forEach(N=>{i&&N.removeEventListener("scroll",o),s&&N.removeEventListener("resize",o)}),d?.(),(T=h)==null||T.disconnect(),h=null,l&&cancelAnimationFrame(v)}}const qf=xf,Kf=_f,Wf=yf,Gf=Sf,Yf=bf,Xf=(e,t,o)=>{const n=new Map,i=o??{},s={...Bn,...i.platform,_c:n};return vf(e,t,{...i,platform:s})};function Jf(e){return Zf(e)}function Yi(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function Zf(e){for(let t=e;t;t=Yi(t))if(t instanceof Element&&getComputedStyle(t).display==="none")return null;for(let t=Yi(e);t;t=Yi(t)){if(!(t instanceof Element))continue;const o=getComputedStyle(t);if(o.display!=="contents"&&(o.position!=="static"||$i(o)||t.tagName==="BODY"))return t}return null}function Hn(e,t){if(!t)return null;const o=e.getRootNode();if(o instanceof Document||o instanceof ShadowRoot){const n=o.getElementById(t);if(n)return n}return e.ownerDocument.getElementById(t)}var ua=class extends Event{constructor(){super("pk-reposition",{bubbles:!0,cancelable:!1,composed:!0})}},Qf=Ct`
    @layer pk-component {
        :host {
            display: contents;
        }

        .popup {
            position: absolute;
            isolation: isolate;
            width: max-content;
            z-index: var(--pk-popup-z-index, 1000);
            /* Never transition coordinates — flip would animate the jump. */
            transition: none;

            /* Reset UA styles for [popover] — see  pk-popup. */
            inset: unset;
            padding: unset;
            margin: unset;
            height: unset;
            color: unset;
            background: unset;
            border: unset;
            overflow: unset;
        }

        .popup-fixed {
            position: fixed;
        }

        .popup:not(.active) {
            display: none;
        }

        /* Prefer visibility over opacity so enter animations are not fighting a
         * 0→1 fade. Matches base-ui isPositioned / hide-until-placed.
         */
        .popup.active:not(.positioned) {
            visibility: hidden;
            pointer-events: none;
        }

        .popup.show {
            animation: pk-popup-surface-in 100ms ease-out;
        }

        .popup.hide {
            animation: pk-popup-surface-out 100ms ease-in forwards;
        }

        @keyframes pk-popup-surface-in {
            from {
                opacity: 0;
                transform: scale(0.95);
            }

            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes pk-popup-surface-out {
            from {
                opacity: 1;
                transform: scale(1);
            }

            to {
                opacity: 0;
                transform: scale(0.95);
            }
        }

        .arrow {
            position: absolute;
            width: var(--pk-popup-arrow-size, 6px);
            height: var(--pk-popup-arrow-size, 6px);
            rotate: 45deg;
            background: var(--pk-popup-arrow-color, var(--pk-color-white));
            z-index: 1;
        }

        .hover-bridge {
            position: fixed;
            z-index: calc(var(--pk-popup-z-index, 1000) - 1);
            inset: 0;
            clip-path: polygon(
                var(--pk-hover-bridge-top-left-x, 0) var(--pk-hover-bridge-top-left-y, 0),
                var(--pk-hover-bridge-top-right-x, 0) var(--pk-hover-bridge-top-right-y, 0),
                var(--pk-hover-bridge-bottom-right-x, 0) var(--pk-hover-bridge-bottom-right-y, 0),
                var(--pk-hover-bridge-bottom-left-x, 0) var(--pk-hover-bridge-bottom-left-y, 0)
            );
            pointer-events: auto;
        }

        .hover-bridge:not(.hover-bridge-visible) {
            display: none;
        }
    }
`;function Eu(e){return e!==null&&typeof e=="object"&&"getBoundingClientRect"in e}function t2(e){return e||(dn?"absolute":"fixed")}function e2(e,t){if(!(!dn||Eu(e)||t!=="scroll"))return jo(e).filter(o=>o instanceof Element)}var Po,vt=(Po=class extends Uo{constructor(...t){super(...t),this.anchor="",this.active=!1,this.boundary="viewport",this.placement="bottom-start",this.distance=4,this.skidding=0,this.flip=!0,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=8,this.shift=!0,this.shiftPadding=8,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.anchorTracking=!0,this.hoverBridge=!1,this.anchorElement=null,this.settlingInitialPosition=!1,this.settleGeneration=0}disconnectedCallback(){this.stop(),super.disconnectedCallback()}updated(t){super.updated(t),t.has("active")&&(this.active?(this.resolveAnchor(),this.start()):this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&!t.has("active")&&this.reposition()}reposition(){this.settlingInitialPosition||this.repositionAsync()}async repositionAsync(t=!0){const o=this.popupElement,n=this.arrow?this.arrowElement:null;if(!this.active||!this.anchorElement||!o)return!1;const i=e2(this.anchorElement,this.boundary),s=[qf({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?s.push(Gf({apply:({rects:v})=>{const w=this.sync==="width"||this.sync==="both",P=this.sync==="height"||this.sync==="both";o.style.width=w?`${v.reference.width}px`:"",o.style.height=P?`${v.reference.height}px`:""}})):(o.style.width="",o.style.height=""),this.flip&&s.push(Wf({boundary:i,fallbackPlacements:this.flipFallbackPlacements?this.flipFallbackPlacements.split(" ").map(v=>v.trim()).filter(Boolean):void 0,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&s.push(Kf({boundary:i,padding:this.shiftPadding})),this.arrow&&n&&s.push(Yf({element:n,padding:this.arrowPadding}));const r=t2(this.positionMethod),a=r==="fixed";o.classList.toggle("popup-fixed",a);const l=dn?v=>Bn.getOffsetParent(v,Jf):Bn.getOffsetParent,{x:u,y:c,middlewareData:d,placement:m}=await Xf(this.anchorElement,o,{placement:this.placement,middleware:s,strategy:r,platform:{...Bn,getOffsetParent:l}});if(!this.active||!o.isConnected)return!1;const h={top:"bottom",right:"left",bottom:"top",left:"right"}[m.split("-")[0]];if(this.setAttribute("data-current-placement",m),Object.assign(o.style,{left:`${u}px`,top:`${c}px`,...a?{position:"fixed"}:{position:""}}),this.anchorElement){const v=this.anchorElement.getBoundingClientRect(),w=o.getBoundingClientRect();o.style.setProperty("--pk-anchor-width",`${v.width}px`),o.style.setProperty("--pk-anchor-height",`${v.height}px`);const P=sf(m,v,w,this.distance,d.shift);o.style.setProperty("--pk-transform-origin",P)}if(this.arrow&&n){const v=d.arrow?.x,w=d.arrow?.y;let P="",T="",N="",L="";if(this.arrowPlacement==="start"){const z=typeof v=="number"?`${this.arrowPadding}px`:"";P=typeof w=="number"?`${this.arrowPadding}px`:"",L=z}else this.arrowPlacement==="end"?(T=typeof v=="number"?`${this.arrowPadding}px`:"",N=typeof w=="number"?`${this.arrowPadding}px`:""):this.arrowPlacement==="center"?(L=typeof v=="number"?"50%":"",P=typeof w=="number"?"50%":""):(L=typeof v=="number"?`${v}px`:"",P=typeof w=="number"?`${w}px`:"");Object.assign(n.style,{top:P,right:T,bottom:N,left:L,transform:"",[h]:"calc(-1 * var(--pk-popup-arrow-size, 6px) / 2)"})}return requestAnimationFrame(()=>this.updateHoverBridge()),t&&this.dispatchEvent(new ua),!0}frames(t){return new Promise(o=>{const n=i=>{if(i<=0){o();return}requestAnimationFrame(()=>n(i-1))};n(t)})}async settleInitialPosition(){const t=++this.settleGeneration,o=this.popupElement;if(!o){this.settlingInitialPosition=!1;return}await this.frames(2),!(!this.active||t!==this.settleGeneration)&&(await this.repositionAsync(!1),o.offsetHeight,await this.frames(1),!(!this.active||t!==this.settleGeneration)&&(await this.repositionAsync(!1),!(!this.active||t!==this.settleGeneration)&&(o.classList.add("positioned"),this.settlingInitialPosition=!1,requestAnimationFrame(()=>this.updateHoverBridge()),this.dispatchEvent(new ua))))}resolveAnchor(){if(typeof this.anchor=="string"&&this.anchor){this.anchorElement=Hn(this,this.anchor);return}if(this.anchor instanceof Element||Eu(this.anchor)){this.anchorElement=this.anchor;return}let t=this.querySelector('[slot="anchor"]');t instanceof HTMLSlotElement&&(t=t.assignedElements({flatten:!0})[0]??null),this.anchorElement=t}async handleAnchorChange(){await this.stop(),this.resolveAnchor(),this.anchorElement&&this.active&&this.start()}usesPopoverTopLayer(){return dn&&this.positionMethod!=="fixed"}stop(){return new Promise(t=>{const o=this.popupElement;this.settleGeneration+=1,this.settlingInitialPosition=!1,o?.classList.remove("positioned"),this.usesPopoverTopLayer()&&o?.hidePopover?.(),this.cleanup?(this.cleanup(),this.cleanup=void 0,o?.style.removeProperty("--pk-transform-origin"),requestAnimationFrame(()=>t())):t(),this.removeAttribute("data-current-placement")})}releasePositioning(){this.cleanup&&(this.cleanup(),this.cleanup=void 0)}async awaitHidden(){await this.stop()}start(){!this.anchorElement||!this.active||!this.isConnected||!this.popupElement||(this.popupElement.classList.remove("positioned"),this.settlingInitialPosition=!0,this.usesPopoverTopLayer()&&this.popupElement.showPopover?.(),this.anchorTracking&&(this.cleanup=Vf(this.anchorElement,this.popupElement,()=>{this.settlingInitialPosition||this.reposition()})),this.settleInitialPosition())}getContentElement(){const t=(this.shadowRoot?.querySelector("slot:not([name])")?.assignedElements({flatten:!0})??[]).find(o=>o instanceof HTMLElement);if(t)return t;for(const o of this.childNodes)if(o instanceof HTMLElement&&o.getAttribute("slot")!=="anchor")return o;return null}updateHoverBridge(){const t=this.popupElement;if(!this.hoverBridge||!this.anchorElement||!t)return;const o=this.anchorElement.getBoundingClientRect(),n=t.getBoundingClientRect(),i=this.placement.includes("top")||this.placement.includes("bottom");let s=0,r=0,a=0,l=0,u=0,c=0,d=0,m=0;i?o.top<n.top?(s=o.left,r=o.bottom,a=o.right,l=o.bottom,u=n.left,c=n.top,d=n.right,m=n.top):(s=n.left,r=n.bottom,a=n.right,l=n.bottom,u=o.left,c=o.top,d=o.right,m=o.top):o.left<n.left?(s=o.right,r=o.top,a=n.left,l=n.top,u=o.right,c=o.bottom,d=n.left,m=n.bottom):(s=n.right,r=n.top,a=o.left,l=o.top,u=n.right,c=n.bottom,d=o.left,m=o.bottom),this.style.setProperty("--pk-hover-bridge-top-left-x",`${s}px`),this.style.setProperty("--pk-hover-bridge-top-left-y",`${r}px`),this.style.setProperty("--pk-hover-bridge-top-right-x",`${a}px`),this.style.setProperty("--pk-hover-bridge-top-right-y",`${l}px`),this.style.setProperty("--pk-hover-bridge-bottom-left-x",`${u}px`),this.style.setProperty("--pk-hover-bridge-bottom-left-y",`${c}px`),this.style.setProperty("--pk-hover-bridge-bottom-right-x",`${d}px`),this.style.setProperty("--pk-hover-bridge-bottom-right-y",`${m}px`)}render(){const t=!dn||this.positionMethod==="fixed",o=this.usesPopoverTopLayer();return J`
            <slot name="anchor" @slotchange=${()=>{this.handleAnchorChange()}}></slot>
            ${this.hoverBridge?J`
                <div
                    part="hover-bridge"
                    class=${ue({"hover-bridge":!0,"hover-bridge-visible":this.active})}
                    aria-hidden="true"
                ></div>
            `:U}
            <div
                popover=${o?"manual":U}
                part="popup"
                class=${ue({popup:!0,active:this.active,"popup-fixed":t})}
            >
                ${this.arrow?J`<div part="arrow" class="arrow"></div>`:U}
                <slot></slot>
            </div>
        `}},Po.styles=Qf,Po);x([E()],vt.prototype,"anchor",void 0);x([E({type:Boolean,reflect:!0})],vt.prototype,"active",void 0);x([E({attribute:"position-method"})],vt.prototype,"positionMethod",void 0);x([E({reflect:!0})],vt.prototype,"boundary",void 0);x([E({reflect:!0})],vt.prototype,"placement",void 0);x([E({type:Number})],vt.prototype,"distance",void 0);x([E({type:Number})],vt.prototype,"skidding",void 0);x([E({type:Boolean})],vt.prototype,"flip",void 0);x([E({attribute:"flip-fallback-placements"})],vt.prototype,"flipFallbackPlacements",void 0);x([E({attribute:"flip-fallback-strategy"})],vt.prototype,"flipFallbackStrategy",void 0);x([E({attribute:"flip-padding",type:Number})],vt.prototype,"flipPadding",void 0);x([E({type:Boolean})],vt.prototype,"shift",void 0);x([E({attribute:"shift-padding",type:Number})],vt.prototype,"shiftPadding",void 0);x([E({type:Boolean})],vt.prototype,"arrow",void 0);x([E({attribute:"arrow-placement"})],vt.prototype,"arrowPlacement",void 0);x([E({attribute:"arrow-padding",type:Number})],vt.prototype,"arrowPadding",void 0);x([E()],vt.prototype,"sync",void 0);x([E({attribute:"anchor-tracking",type:Boolean})],vt.prototype,"anchorTracking",void 0);x([E({attribute:"hover-bridge",type:Boolean})],vt.prototype,"hoverBridge",void 0);x([uo(".popup")],vt.prototype,"popupElement",void 0);x([uo(".arrow")],vt.prototype,"arrowElement",void 0);vt=x([He("pk-popup")],vt);var o2=[Ct`
    @layer pk-component {
        .content.pk-popup-content {
            transform-origin: var(--pk-transform-origin, top);
        }

        .content.pk-popup-content[data-open] {
            animation: pk-tooltip-in 150ms ease forwards;
        }

        .content.pk-popup-content[data-open][data-side='top'] {
            animation-name: pk-tooltip-in-top;
        }

        .content.pk-popup-content[data-open][data-side='bottom'] {
            animation-name: pk-tooltip-in-bottom;
        }

        .content.pk-popup-content[data-open][data-side='left'] {
            animation-name: pk-tooltip-in-left;
        }

        .content.pk-popup-content[data-open][data-side='right'] {
            animation-name: pk-tooltip-in-right;
        }

        .content.pk-popup-content.closing {
            animation: pk-tooltip-out 150ms ease;
        }

        @keyframes pk-tooltip-in {
            from {
                opacity: 0;
                transform: scale(0.95);
            }

            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes pk-tooltip-out {
            from {
                opacity: 1;
                transform: scale(1);
            }

            to {
                opacity: 0;
                transform: scale(0.95);
            }
        }

        @keyframes pk-tooltip-in-top {
            from {
                opacity: 0;
                transform: scale(0.95) translateY(0.5rem);
            }

            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        @keyframes pk-tooltip-in-bottom {
            from {
                opacity: 0;
                transform: scale(0.95) translateY(-0.5rem);
            }

            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        @keyframes pk-tooltip-in-left {
            from {
                opacity: 0;
                transform: scale(0.95) translateX(0.5rem);
            }

            to {
                opacity: 1;
                transform: scale(1) translateX(0);
            }
        }

        @keyframes pk-tooltip-in-right {
            from {
                opacity: 0;
                transform: scale(0.95) translateX(-0.5rem);
            }

            to {
                opacity: 1;
                transform: scale(1) translateX(0);
            }
        }
    }
`,Ct`
    @layer pk-component {
        :host {
            display: inline-block;
            max-width: 100%;
            align-self: flex-start;
            flex: none;
            vertical-align: middle;
            --pk-popup-z-index: 250;
            --pk-tooltip-arrow-size: 9px;
            --pk-tooltip-arrow-inset: 1px;
        }

        .content:not([data-open]):not(.closing) {
            opacity: 0;
            pointer-events: none;
        }

        .content[data-open]:not(.closing) {
            opacity: 1;
        }

        .content {
            position: relative;
            isolation: isolate;
            overflow: visible;
            width: fit-content;
            max-width: 20rem;
            padding: 4px 8px;
            border-radius: var(--pk-radius-sm);
            background: #1c2e36;
            color: var(--pk-color-white);
            font-family: var(--pk-font-family);
            font-size: 12px;
            line-height: 1.4;
            pointer-events: none;
        }

        .content::after {
            content: '';
            position: absolute;
            z-index: -1;
            width: var(--pk-tooltip-arrow-size);
            height: var(--pk-tooltip-arrow-size);
            background: #1c2e36;
            border-radius: 2px;
            rotate: 45deg;
            pointer-events: none;
        }

        .content[data-side='top']::after {
            left: calc(50% - var(--pk-tooltip-arrow-size) / 2);
            bottom: calc(var(--pk-tooltip-arrow-size) * -0.5 + var(--pk-tooltip-arrow-inset));
        }

        .content[data-side='bottom']::after {
            left: calc(50% - var(--pk-tooltip-arrow-size) / 2);
            top: calc(var(--pk-tooltip-arrow-size) * -0.5 + var(--pk-tooltip-arrow-inset));
        }

        .content[data-side='left']::after {
            top: calc(50% - var(--pk-tooltip-arrow-size) / 2);
            right: calc(var(--pk-tooltip-arrow-size) * -0.5 + var(--pk-tooltip-arrow-inset));
        }

        .content[data-side='right']::after {
            top: calc(50% - var(--pk-tooltip-arrow-size) / 2);
            left: calc(var(--pk-tooltip-arrow-size) * -0.5 + var(--pk-tooltip-arrow-inset));
        }

        .content[hidden] {
            display: none !important;
        }
    }
    `],Mo,Nt=(Mo=class extends Uo{constructor(...t){super(...t),this.placement="top",this.trigger="hover focus",this.disabled=!1,this.openDelay=0,this.closeDelay=0,this.content="",this.for="",this.open=!1,this.triggerElement=null,this.contentAnimated=!1,this.closing=!1,this.contentSide=null,this.hasSlottedBody=!1,this.triggerId=ii("pk-tooltip-trigger"),this.tooltipId=ii("pk-tooltip"),this.showGeneration=0,this.exitGeneration=0,this.syncPlacementAnimation=()=>{const o=this.popupElement?.getAttribute("data-current-placement")??this.placement,n=this.popupElement?.getContentElement();this.contentSide=o?tr(o):null,na(this.popupElement,o),n&&na(n,o)},this.onBodySlotChange=o=>{const n=o.target;this.hasSlottedBody=n.assignedNodes({flatten:!0}).some(i=>i.nodeType===Node.ELEMENT_NODE?!0:i.nodeType===Node.TEXT_NODE&&!!i.textContent?.trim())},this.scheduleShow=()=>{this.usesPointerTrigger()&&(window.clearTimeout(this.closeTimer),window.clearTimeout(this.openTimer),this.openTimer=window.setTimeout(()=>this.showTooltip(),this.openDelay))},this.scheduleHide=()=>{this.usesPointerTrigger()&&(window.clearTimeout(this.openTimer),window.clearTimeout(this.closeTimer),this.closeTimer=window.setTimeout(()=>this.hideTooltip(),this.closeDelay))}}disconnectedCallback(){this.popupElement?.removeEventListener("pk-reposition",this.syncPlacementAnimation),this.clearTimers(),this.hideTooltip(!0),super.disconnectedCallback()}updated(t){super.updated(t),(t.has("trigger")||t.has("disabled")||t.has("for"))&&this.rebindTrigger(),this.disabled&&this.open&&this.hideTooltip(!0)}firstUpdated(){this.popupElement.addEventListener("pk-reposition",this.syncPlacementAnimation),this.for&&queueMicrotask(()=>{this.resolveExternalTrigger()})}async show(){this.disabled||(this.clearTimers(),this.showTooltip(!0),await this.updateComplete)}async hide(){this.clearTimers(),this.hideTooltip(!0),await this.updateComplete}clearTimers(){window.clearTimeout(this.openTimer),window.clearTimeout(this.closeTimer)}resolveExternalTrigger(){this.triggerElement=Hn(this,this.for),this.rebindTrigger()}onTriggerSlotChange(t){const[o]=t.target.assignedElements({flatten:!0});this.unbindTrigger(this.triggerElement),this.triggerElement=o??null,this.rebindTrigger(),this.requestUpdate()}rebindTrigger(){this.unbindTrigger(this.triggerElement),this.for&&(this.triggerElement=Hn(this,this.for)),this.bindTrigger(this.triggerElement)}usesPointerTrigger(){return!this.disabled&&this.trigger!=="manual"}bindTrigger(t){!t||!this.usesPointerTrigger()||(t.id||(t.id=this.triggerId),t.setAttribute("aria-describedby",this.tooltipId),t.addEventListener("mouseenter",this.scheduleShow),t.addEventListener("mouseleave",this.scheduleHide),t.addEventListener("focus",this.scheduleShow),t.addEventListener("blur",this.scheduleHide))}unbindTrigger(t){t&&(t.removeAttribute("aria-describedby"),t.removeEventListener("mouseenter",this.scheduleShow),t.removeEventListener("mouseleave",this.scheduleHide),t.removeEventListener("focus",this.scheduleShow),t.removeEventListener("blur",this.scheduleHide))}getAnchor(){return this.for?Hn(this,this.for):this.triggerElement?this.triggerElement:null}prepareContentForEnter(t){t&&(t.classList.remove("closing"),t.style.animation="none",t.getBoundingClientRect(),t.style.removeProperty("animation"),t.style.removeProperty("opacity"),t.style.removeProperty("transform"))}showTooltip(t=!1){if(!this.getAnchor()||this.open&&this.contentAnimated&&!this.closing&&!t)return;this.open||this.dispatchEvent(new pu);const o=++this.showGeneration;this.exitGeneration+=1,this.closing=!1,this.open=!0,this.contentAnimated=!1,this.prepareContentForEnter(this.popupElement?.getContentElement()),this.updateComplete.then(async()=>{o===this.showGeneration&&(await rf(this.popupElement,this.placement),o===this.showGeneration&&(this.syncPlacementAnimation(),this.prepareContentForEnter(this.popupElement?.getContentElement()),this.contentAnimated=!0,this.dispatchEvent(new hu),this.dispatchEvent(new CustomEvent("pk-open-change",{detail:{open:!0},bubbles:!0,composed:!0}))))})}hideTooltip(t=!1,o=!1){if(!(!this.open&&!this.closing&&!t)&&!(this.closing&&!t)){if(o){const n=new fu("api");if(!this.dispatchEvent(n))return}if(this.showGeneration+=1,t){this.finishHide();return}if(!this.contentAnimated){this.finishHide();return}this.playExitAnimation()}}async playExitAnimation(){if(!this.open)return;const t=this.exitGeneration+1;this.exitGeneration=t;const o=this.popupElement?.getContentElement();this.closing=!0,this.contentAnimated=!1,o&&await this.waitForExitAnimation(o),t===this.exitGeneration&&this.finishHide()}waitForExitAnimation(t){return new Promise(o=>{let n=!1;const i=()=>{n||(n=!0,t.removeEventListener("animationend",s),window.clearTimeout(r),t.classList.remove("closing"),o())},s=a=>{a.target===t&&a.animationName.startsWith("pk-tooltip-out")&&i()};t.classList.add("closing"),t.addEventListener("animationend",s);const r=window.setTimeout(i,200)})}finishHide(){const t=this.popupElement?.getContentElement();this.closing=!1,this.contentAnimated=!1,this.contentSide=null,this.open=!1,this.popupElement?.removeAttribute("data-side"),this.prepareContentForEnter(t),this.dispatchEvent(new gu),this.dispatchEvent(new CustomEvent("pk-open-change",{detail:{open:!1},bubbles:!0,composed:!0}))}render(){const t=this.getAnchor();return J`
            <slot name="trigger" @slotchange=${this.onTriggerSlotChange}></slot>
            <pk-popup
                .active=${this.open||this.closing}
                .anchor=${t??""}
                .placement=${this.placement}
                .distance=${4}
                hover-bridge
                flip
                shift
            >
                <div
                    part="content"
                    class=${ue({content:!0,"pk-popup-content":!0,closing:this.closing})}
                    id=${this.tooltipId}
                    role="tooltip"
                    ?hidden=${!this.open&&!this.closing}
                    data-open=${this.contentAnimated&&!this.closing?"":U}
                    data-side=${this.contentSide??U}
                >
                    <slot @slotchange=${this.onBodySlotChange}></slot>
                    ${this.hasSlottedBody?U:this.content||U}
                </div>
            </pk-popup>
        `}},Mo.styles=o2,Mo);x([E({reflect:!0})],Nt.prototype,"placement",void 0);x([E({reflect:!0})],Nt.prototype,"trigger",void 0);x([E({type:Boolean,reflect:!0})],Nt.prototype,"disabled",void 0);x([E({type:Number,attribute:"open-delay"})],Nt.prototype,"openDelay",void 0);x([E({type:Number,attribute:"close-delay"})],Nt.prototype,"closeDelay",void 0);x([E()],Nt.prototype,"content",void 0);x([E({reflect:!0})],Nt.prototype,"for",void 0);x([uo("pk-popup")],Nt.prototype,"popupElement",void 0);x([Qt()],Nt.prototype,"open",void 0);x([Qt()],Nt.prototype,"contentAnimated",void 0);x([Qt()],Nt.prototype,"closing",void 0);x([Qt()],Nt.prototype,"contentSide",void 0);x([Qt()],Nt.prototype,"hasSlottedBody",void 0);Nt=x([He("pk-tooltip")],Nt);var n2=ki({name:"PkTooltip",tagName:"pk-tooltip"}),i2=class extends Event{constructor(){super("pk-invalid",{bubbles:!0,cancelable:!1,composed:!0})}};function s2(){return{observedAttributes:["custom-error"],checkValidity(e){const t={message:"",isValid:!0,invalidKeys:[]};return e.customError&&(t.message=e.customError,t.isValid=!1,t.invalidKeys.push("customError")),t}}}var zo,Te=(zo=class extends Uo{static get validators(){return[s2()]}static get observedAttributes(){const t=new Set(super.observedAttributes??[]);for(const o of this.validators)for(const n of o.observedAttributes??[])t.add(n);return[...t]}constructor(){super(),this.internals=this.attachInternals(),this.assumeInteractionOn=["input"],this.validators=[],this.name=null,this.disabled=!1,this.required=!1,this.customError=null,this.valueHasChanged=!1,this.hasInteracted=!1,this.emittedEvents=[],this.emitInvalid=t=>{t.target===this&&(this.hasInteracted=!0,this.dispatchEvent(new i2))},this.handleInteraction=t=>{this.emittedEvents.includes(t.type)||this.emittedEvents.push(t.type),this.emittedEvents.length>=this.assumeInteractionOn.length&&(this.hasInteracted=!0,this.updateValidity())},this.addEventListener("invalid",this.emitInvalid)}connectedCallback(){super.connectedCallback();for(const t of this.assumeInteractionOn)this.addEventListener(t,this.handleInteraction);this.updateValidity()}disconnectedCallback(){this.hostAriaMirror?.disconnect(),this.hostAriaMirror=void 0;for(const t of this.assumeInteractionOn)this.removeEventListener(t,this.handleInteraction);this.removeEventListener("invalid",this.emitInvalid),super.disconnectedCallback()}updated(t){t.has("customError")&&this.setCustomValidity(this.customError??""),t.has("disabled")&&this.setState("disabled",!!this.disabled),(t.has("value")||t.has("disabled")||t.has("required")||t.has("name"))&&this.syncFormValue(),this.updateValidity(),super.updated(t),this.syncHostAriaMirror()}firstUpdated(t){super.firstUpdated(t),this.connectHostAriaMirror()}getAriaMirrorTarget(){return this.input??null}syncStandaloneAria(){}connectHostAriaMirror(){this.hostAriaMirror?.disconnect(),this.hostAriaMirror=new ef(this,()=>this.getAriaMirrorTarget(),()=>this.syncStandaloneAria()),this.hostAriaMirror.connect()}syncHostAriaMirror(){this.hostAriaMirror?.sync()}formResetCallback(){this.resetValidity(),this.hasInteracted=!1,this.valueHasChanged=!1,this.emittedEvents=[],this.resetToDefaultValue(),this.syncFormValue(),this.updateValidity()}formDisabledCallback(t){this.disabled=t,this.updateValidity()}formStateRestoreCallback(t,o){this.restoreFormState(t),this.syncFormValue(),this.updateValidity()}set form(t){t?this.setAttribute("form",t):this.removeAttribute("form")}get form(){return this.internals.form}get labels(){return this.internals.labels}get validity(){return this.internals.validity}get willValidate(){return this.internals.willValidate}get validationMessage(){return this.internals.validationMessage}getForm(){return this.internals.form}checkValidity(){return this.updateValidity(),this.internals.checkValidity()}reportValidity(){return this.updateValidity(),this.hasInteracted=!0,this.internals.reportValidity()}resetValidity(){this.setCustomValidity(""),this.internals.setValidity({}),this.syncCustomStates()}setCustomValidity(t){if(!t){this.customError=null,this.internals.setValidity({}),this.syncCustomStates();return}this.customError=t;const o=this.validationTarget;o instanceof HTMLElement?this.internals.setValidity({customError:!0},t,o):this.internals.setValidity({customError:!0},t),this.syncCustomStates()}get validationTarget(){return this.input}get allValidators(){return[...this.constructor.validators??[],...this.validators??[]]}setFormValue(t,o){this.internals.setFormValue(t,o??t)}setValue(t,o){this.setFormValue(t,o??t)}updateValidity(){if(this.disabled||this.hasAttribute("disabled")||!this.willValidate){this.internals.setValidity({}),this.syncCustomStates();return}const t=this.allValidators;if(!t.length)return;const o={customError:!!this.customError};let n="";const i=this.validationTarget;for(const s of t){const{isValid:r,message:a,invalidKeys:l}=s.checkValidity(this);if(!r){n||(n=a);for(const u of l)o[u]=!0}}n||(n=this.validationMessage),i instanceof HTMLElement?this.internals.setValidity(o,n,i):this.internals.setValidity(o,n),this.syncCustomStates()}syncCustomStates(){const t=this.internals.validity.valid;this.setState("required",this.required),this.setState("optional",!this.required),this.setState("invalid",!t),this.setState("valid",t),this.setState("user-invalid",!t&&this.hasInteracted),this.setState("user-valid",t&&this.hasInteracted)}setState(t,o){const n=this.internals.states;n&&(o?n.add(t):n.delete(t))}syncFormValue(){}resetToDefaultValue(){}restoreFormState(t){}},zo.formAssociated=!0,zo);x([E({reflect:!0})],Te.prototype,"name",void 0);x([E({type:Boolean,reflect:!0})],Te.prototype,"disabled",void 0);x([E({type:Boolean,reflect:!0})],Te.prototype,"required",void 0);x([E({attribute:"custom-error",reflect:!0})],Te.prototype,"customError",void 0);x([E({attribute:!1,state:!0})],Te.prototype,"valueHasChanged",void 0);x([E({attribute:!1,state:!0})],Te.prototype,"hasInteracted",void 0);function Au(){return{checkValidity(e){const t=e.input,o={message:"",isValid:!0,invalidKeys:[]};if(!t)return o;let n=!0;if("checkValidity"in t&&typeof t.checkValidity=="function"&&(n=t.checkValidity()),n)return o;if(o.isValid=!1,"validationMessage"in t&&typeof t.validationMessage=="string"&&(o.message=t.validationMessage),!("validity"in t)||!t.validity)return o.invalidKeys.push("customError"),o;for(const i of Object.keys(t.validity)){if(i==="valid")continue;const s=i;t.validity[s]&&o.invalidKeys.push(s)}return o}}}function sr(e={}){let{validationElement:t,validationProperty:o}=e;!t&&typeof document<"u"&&(t=Object.assign(document.createElement("input"),{required:!0})),o||(o="value");const n={observedAttributes:["required"],message:t?.validationMessage??"Please fill out this field.",checkValidity(i){const s={message:"",isValid:!0,invalidKeys:[]};if(!i.required)return s;const r=i[o];return(r==null||r===!1||r==="")&&(s.isValid=!1,s.message=typeof n.message=="function"?n.message(i):n.message??"",s.invalidKeys.push("valueMissing")),s}};return n}function r2(){return J`
        <svg xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" viewBox="0 0 640 640">
            <path
                fill="currentColor"
                d="M557.5 192L534.9 214.6L278.9 470.6C266.4 483.1 246.1 483.1 233.6 470.6L105.6 342.6L83 320L128.3 274.7C129.6 276 172.3 318.7 256.3 402.7L489.7 169.3L512.3 146.7L557.6 192z"
            />
        </svg>
    `}function a2(){return J`
        <svg xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" viewBox="0 0 640 640">
            <path fill="currentColor" d="M96 352V288H544V352H96z" />
        </svg>
    `}var l2=[Ct`
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
`,Ct`
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
`],so,Wt=(so=class extends Te{constructor(...t){super(...t),this.assumeInteractionOn=["change"],this.hasSlotController=new Qs(this,"hint"),this.checked=!1,this.indeterminate=!1,this.disabled=!1,this.invalid=!1,this.checkboxValue="on",this.defaultChecked=!1,this.ariaLabel=null,this.hint="",this.withHint=!1,this.hasDefaultSlotContent=!1}static get validators(){return[...super.validators,sr({validationProperty:"checked"})]}get validationTarget(){return this.input}syncFormValue(){this.setFormValue(this.checked?this.checkboxValue:null,this.checked?"on":"off")}resetToDefaultValue(){this.checked=this.defaultChecked,this.indeterminate=!1}restoreFormState(t){t==="on"||t===this.checkboxValue?this.checked=!0:this.checked=!1}updated(t){if(!this.input){super.updated(t);return}(t.has("indeterminate")||t.has("checked"))&&(this.input.indeterminate=this.indeterminate,this.input.checked=this.checked),super.updated(t)}defaultSlotChanged(t){const o=t.target;this.hasDefaultSlotContent=o.assignedNodes({flatten:!0}).some(n=>n.nodeType===Node.TEXT_NODE?n.textContent?.trim():n.nodeType===Node.ELEMENT_NODE)}handleChange(t){const o=t.target;this.checked=o.checked,this.indeterminate=!1,this.dispatchEvent(new CustomEvent("pk-change",{detail:{checked:this.checked},bubbles:!0,composed:!0})),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}render(){const t=this.hasDefaultSlotContent,o=!!this.hint||this.hasSlotController.test("hint",this.withHint);return J`
            <label
                part="base"
                class=${ue({root:!0,"root--with-hint":o})}
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
                    <span part="checked-icon" class="icon-check">${r2()}</span>
                    <span part="indeterminate-icon" class="icon-indeterminate">${a2()}</span>
                </span>
                ${t||o?J`
                        <span class="text">
                            ${t?J`
                                    <span part="label" class="label" id="label">
                                        <slot @slotchange=${this.defaultSlotChanged}></slot>
                                    </span>
                                `:J`<slot @slotchange=${this.defaultSlotChanged} hidden></slot>`}
                            ${o?J`
                                    <span part="hint" class="hint" id="hint">
                                        <slot name="hint">${this.hint}</slot>
                                    </span>
                                `:U}
                        </span>
                    `:J`<slot @slotchange=${this.defaultSlotChanged} hidden></slot>`}
            </label>
        `}},so.shadowRootOptions={mode:"open",delegatesFocus:!0},so.styles=l2,so);x([E({type:Boolean,reflect:!0})],Wt.prototype,"checked",void 0);x([E({type:Boolean,reflect:!0})],Wt.prototype,"indeterminate",void 0);x([E({type:Boolean,reflect:!0})],Wt.prototype,"disabled",void 0);x([E({type:Boolean,reflect:!0})],Wt.prototype,"invalid",void 0);x([E()],Wt.prototype,"checkboxValue",void 0);x([E({attribute:"default-checked",type:Boolean})],Wt.prototype,"defaultChecked",void 0);x([E({attribute:"aria-label"})],Wt.prototype,"ariaLabel",void 0);x([E()],Wt.prototype,"hint",void 0);x([E({type:Boolean,attribute:"with-hint"})],Wt.prototype,"withHint",void 0);x([uo(".input")],Wt.prototype,"input",void 0);x([Qt()],Wt.prototype,"hasDefaultSlotContent",void 0);Wt=x([He("pk-checkbox")],Wt);var c2=class extends Event{constructor(){super("pk-clear",{bubbles:!0,cancelable:!1,composed:!0})}};function $u(e,t){return t||(e.getAttribute("hint")??"")}function ys(e,t,o=!1){return!!t||e("instructions",o)||e("hint")}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const u2=e=>e.strings===void 0,d2={},p2=(e,t=d2)=>e._$AH=t;/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tu=Js(class extends Zs{constructor(e){if(super(e),e.type!==Oe.PROPERTY&&e.type!==Oe.ATTRIBUTE&&e.type!==Oe.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!u2(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===Xt||t===U)return t;const o=e.element,n=e.name;if(e.type===Oe.PROPERTY){if(t===o[n])return Xt}else if(e.type===Oe.BOOLEAN_ATTRIBUTE){if(!!t===o.hasAttribute(n))return Xt}else if(e.type===Oe.ATTRIBUTE&&o.getAttribute(n)===t+"")return Xt;return p2(e),t}});var h2=new Set(["button","submit","reset","checkbox","radio","file","image","hidden"]),f2="pk-implicit-submit",g2=(e,t)=>{if(e.key!=="Enter"||e.defaultPrevented||e.isComposing||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return!1;const o=(t||"text").toLowerCase();return!h2.has(o)},m2=e=>{const t=e.closest?.("pk-dialog");if(t){const n=t.querySelector("form");if(n)return n}const o=e.form;return o&&o.id==="main"?e.closest?.("form")!==o?e.closest("form"):null:o},v2=(e,t,o)=>{if(e.disabled||e.readonly||!g2(t,o))return!1;const n=m2(e);return!n||n.id==="main"?!1:(t.preventDefault(),t.stopPropagation(),n.dispatchEvent(new CustomEvent(f2,{bubbles:!1,cancelable:!0})),!0)},b2=Ct`
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
`,Lo,pt=(Lo=class extends Te{constructor(...t){super(...t),this.assumeInteractionOn=["blur","input"],this.hasSlotController=new Qs(this,"instructions","hint","label","start","end"),this.inputId=ii("pk-input"),this.type="text",this._value=null,this.defaultValue=null,this.size="default",this.label="",this.instructions="",this.withClear=!1,this.placeholder="",this.readonly=!1,this.invalid=!1,this.fitCell=!1,this.mono=!1,this.autofocus=!1,this.withLabel=!1,this.withInstructions=!1}static get validators(){return[...super.validators,Au(),sr()]}get value(){return this.valueHasChanged?this._value??"":this._value??this.defaultValue??""}set value(t){const o=t??"";this._value!==o&&(this.valueHasChanged=!0,this._value=o)}connectedCallback(){this.instructions=$u(this,this.instructions),this.hasAttribute("with-hint")&&(this.withInstructions=!0),super.connectedCallback()}syncFormValue(){this.setValue(this.value||"")}resetToDefaultValue(){this.valueHasChanged=!1,this._value=null}restoreFormState(t){typeof t=="string"&&(this.value=t)}formResetCallback(){this.valueHasChanged=!1,this._value=null,this.input&&(this.input.value=this.defaultValue??""),super.formResetCallback()}updated(t){(t.has("value")||t.has("defaultValue"))&&this.setState("blank",!this.value),super.updated(t)}syncStandaloneAria(){if(!this.input)return;const t=!!this.label||this.hasSlotController.test("label",this.withLabel),o=ys((n,i)=>this.hasSlotController.test(n,i),this.instructions,this.withInstructions);du({control:this.input,labelId:`${this.inputId}-label`,instructionsId:`${this.inputId}-instructions`,hasLabel:t,hasInstructions:o,required:this.required,invalid:this.invalid||!this.internals.validity.valid})}hasLabelContent(){return!!this.label||this.hasSlotController.test("label",this.withLabel)}hasInstructionsContent(){return ys((t,o)=>this.hasSlotController.test(t,o),this.instructions,this.withInstructions)}focus(t){this.input?.focus(t)}blur(){this.input?.blur()}select(){this.input?.select()}handleInput(){this.value=this.input.value,this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}handleChange(t){this.value=this.input.value,t.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}handleKeyDown(t){v2(this,t,this.type)}handleClearClick(t){t.preventDefault(),this.value!==""&&(this.value="",this.dispatchEvent(new c2),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0})),this.input.focus())}render(){const t=this.hasLabelContent(),o=this.hasInstructionsContent(),n=this.withClear&&!this.disabled&&!this.readonly&&this.value.length>0,i=this.hasSlotController.test("start"),s=this.hasSlotController.test("end");return J`
            <div part="form-control" class="form-control">
                ${t||o?J`
                        <div part="header" class="form-control__header">
                            ${t?J`
                                    <label
                                        part="label"
                                        class="form-control__label"
                                        id=${`${this.inputId}-label`}
                                        for=${`${this.inputId}-control`}
                                    >
                                        <slot name="label">${this.label}</slot>
                                    </label>
                                `:U}

                            ${o?J`
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
                    ${i?J`
                            <span part="start" class="form-control__start">
                                <slot name="start"></slot>
                            </span>
                        `:J`<slot name="start" hidden></slot>`}

                    <input
                        part="input"
                        class="input"
                        id=${t?`${this.inputId}-control`:U}
                        type=${this.type}
                        .value=${Tu(this.value)}
                        placeholder=${this.placeholder||U}
                        pattern=${be(this.pattern)}
                        minlength=${be(this.minlength)}
                        maxlength=${be(this.maxlength)}
                        min=${be(this.min)}
                        max=${be(this.max)}
                        step=${be(this.step)}
                        autocomplete=${be(this.autocomplete)}
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

                    ${n?J`
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

                    ${s?J`
                            <span part="end" class="form-control__end">
                                <slot name="end"></slot>
                            </span>
                        `:J`<slot name="end" hidden></slot>`}
                </div>
            </div>
        `}},Lo.styles=[cu,Ml(),Pl(".input","var(--pk-input-border-radius, var(--pk-radius-sm))"),zl(".input"),b2],Lo);x([uo("input")],pt.prototype,"input",void 0);x([E({reflect:!0})],pt.prototype,"type",void 0);x([Qt()],pt.prototype,"value",null);x([E({attribute:"value",reflect:!0})],pt.prototype,"defaultValue",void 0);x([E({reflect:!0})],pt.prototype,"size",void 0);x([E()],pt.prototype,"label",void 0);x([E()],pt.prototype,"instructions",void 0);x([E({attribute:"with-clear",type:Boolean})],pt.prototype,"withClear",void 0);x([E()],pt.prototype,"placeholder",void 0);x([E({type:Boolean,reflect:!0})],pt.prototype,"readonly",void 0);x([E({type:Boolean,reflect:!0})],pt.prototype,"invalid",void 0);x([E({type:Boolean,reflect:!0,attribute:"fit-cell"})],pt.prototype,"fitCell",void 0);x([E({type:Boolean,reflect:!0})],pt.prototype,"mono",void 0);x([E()],pt.prototype,"pattern",void 0);x([E({type:Number})],pt.prototype,"minlength",void 0);x([E({type:Number})],pt.prototype,"maxlength",void 0);x([E()],pt.prototype,"min",void 0);x([E()],pt.prototype,"max",void 0);x([E()],pt.prototype,"step",void 0);x([E()],pt.prototype,"autocomplete",void 0);x([E({type:Boolean,reflect:!0})],pt.prototype,"autofocus",void 0);x([E({attribute:"with-label",type:Boolean})],pt.prototype,"withLabel",void 0);x([E({attribute:"with-instructions",type:Boolean})],pt.prototype,"withInstructions",void 0);pt=x([He("pk-input")],pt);var Je=ki({name:"PkInput",tagName:"pk-input"});function y2(e){return!!e.detail?.checked}var k2=Ct`
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
`,Oo,zt=(Oo=class extends Te{constructor(...t){super(...t),this.assumeInteractionOn=["blur","input"],this.hasSlotController=new Qs(this,"instructions","hint","label"),this.controlId=ii("pk-textarea"),this.placeholder="",this._value=null,this.defaultValue=null,this.size="default",this.label="",this.instructions="",this.readonly=!1,this.invalid=!1,this.fitCell=!1,this.withLabel=!1,this.withInstructions=!1}static get validators(){return[...super.validators,Au(),sr()]}get value(){return this.valueHasChanged?this._value??"":this._value??this.defaultValue??""}set value(t){const o=t??"";this._value!==o&&(this.valueHasChanged=!0,this._value=o)}connectedCallback(){this.instructions=$u(this,this.instructions),this.hasAttribute("with-hint")&&(this.withInstructions=!0),super.connectedCallback()}syncFormValue(){this.setValue(this.value||"")}resetToDefaultValue(){this.valueHasChanged=!1,this._value=null}restoreFormState(t){typeof t=="string"&&(this.value=t)}formResetCallback(){this.valueHasChanged=!1,this._value=null,this.input&&(this.input.value=this.defaultValue??""),super.formResetCallback()}updated(t){(t.has("value")||t.has("defaultValue"))&&this.setState("blank",!this.value),super.updated(t)}syncStandaloneAria(){if(!this.input)return;const t=this.hasLabelContent(),o=this.hasInstructionsContent();du({control:this.input,labelId:`${this.controlId}-label`,instructionsId:`${this.controlId}-instructions`,hasLabel:t,hasInstructions:o,required:this.required,invalid:this.invalid||!this.internals.validity.valid})}hasLabelContent(){return!!this.label||this.hasSlotController.test("label",this.withLabel)}hasInstructionsContent(){return ys((t,o)=>this.hasSlotController.test(t,o),this.instructions,this.withInstructions)}focus(t){this.input?.focus(t)}blur(){this.input?.blur()}handleInput(){this.value=this.input.value,this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}handleChange(t){this.value=this.input.value,t.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}render(){const t=this.hasLabelContent(),o=this.hasInstructionsContent();return J`
            <div part="form-control" class="form-control">
                ${t?J`
                        <label
                            part="label"
                            class="form-control__label"
                            id=${`${this.controlId}-label`}
                            for=${`${this.controlId}-control`}
                        >
                            <slot name="label">${this.label}</slot>
                        </label>
                    `:U}

                ${o?J`
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
                    rows=${be(this.fitCell?this.rows??1:this.rows)}
                    .value=${Tu(this.value)}
                    placeholder=${this.placeholder||U}
                    maxlength=${be(this.maxlength)}
                    ?disabled=${this.disabled}
                    ?readonly=${this.readonly}
                    ?required=${this.required}
                    @input=${this.handleInput}
                    @change=${this.handleChange}
                    @focus=${()=>this.dispatchEvent(new Event("focus",{bubbles:!0,composed:!0}))}
                    @blur=${()=>this.dispatchEvent(new Event("blur",{bubbles:!0,composed:!0}))}
                ></textarea>
            </div>
        `}},Oo.styles=[cu,k2],Oo);x([uo("textarea")],zt.prototype,"input",void 0);x([E()],zt.prototype,"placeholder",void 0);x([Qt()],zt.prototype,"value",null);x([E({attribute:"value",reflect:!0})],zt.prototype,"defaultValue",void 0);x([E({reflect:!0})],zt.prototype,"size",void 0);x([E()],zt.prototype,"label",void 0);x([E()],zt.prototype,"instructions",void 0);x([E({type:Boolean,reflect:!0})],zt.prototype,"readonly",void 0);x([E({type:Boolean,reflect:!0})],zt.prototype,"invalid",void 0);x([E({type:Boolean,reflect:!0,attribute:"fit-cell"})],zt.prototype,"fitCell",void 0);x([E({type:Number})],zt.prototype,"rows",void 0);x([E({type:Number,attribute:"max-length"})],zt.prototype,"maxlength",void 0);x([E({attribute:"with-label",type:Boolean})],zt.prototype,"withLabel",void 0);x([E({attribute:"with-instructions",type:Boolean})],zt.prototype,"withInstructions",void 0);zt=x([He("pk-textarea")],zt);var Xi=ki({name:"PkTextarea",tagName:"pk-textarea"}),Sn=new Set,ks=null,w2=new Set([" ","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","PageUp","PageDown","Home","End"]);function Ji(e){for(const t of e.composedPath())if(t instanceof HTMLElement&&Sn.has(t))return!0;return!1}function x2(e){if(!(e instanceof HTMLElement))return!1;if(e.isContentEditable)return!0;const t=e.tagName;return t==="INPUT"||t==="TEXTAREA"||t==="SELECT"}function _2(){const e=document.body,t=e.style.overflow;e.style.setProperty("overflow","hidden","important");const o=s=>{Ji(s)||s.preventDefault()},n=s=>{Ji(s)||s.preventDefault()},i=s=>{w2.has(s.key)&&(Ji(s)||x2(s.target)||s.preventDefault())};return window.addEventListener("wheel",o,{passive:!1,capture:!0}),window.addEventListener("touchmove",n,{passive:!1,capture:!0}),window.addEventListener("keydown",i,{capture:!0}),()=>{window.removeEventListener("wheel",o,{capture:!0}),window.removeEventListener("touchmove",n,{capture:!0}),window.removeEventListener("keydown",i,{capture:!0}),e.style.removeProperty("overflow"),t&&(e.style.overflow=t)}}function S2(e){Sn.add(e),Sn.size===1&&(document.documentElement.classList.add("pk-scroll-lock"),document.documentElement.style.setProperty("--pk-scroll-lock-size","0px"),ks=_2())}function Zi(e){Sn.delete(e),Sn.size===0&&(ks?.(),ks=null,document.documentElement.classList.remove("pk-scroll-lock"),document.documentElement.style.removeProperty("--pk-scroll-lock-size"),document.documentElement.style.removeProperty("--pk-scroll-lock-gutter"))}function Rn(e,t,o=500){return new Promise(n=>{const i=new AbortController,{signal:s}=i;if(e.classList.contains(t)){n();return}e.classList.add(t);let r=!1;const a=()=>{r||(r=!0,e.classList.remove(t),window.clearTimeout(l),n(),i.abort())};e.addEventListener("animationend",a,{once:!0,signal:s}),e.addEventListener("animationcancel",a,{once:!0,signal:s});const l=window.setTimeout(a,o);requestAnimationFrame(()=>{!r&&e.getAnimations().length===0&&a()})})}var C2=".modal-shade, .modal",E2=e=>{const t=getComputedStyle(e);return t.display!=="none"&&t.visibility!=="hidden"&&Number.parseFloat(t.opacity||"1")>0};function ws(e=document){const t=e.querySelectorAll(C2);for(const o of t)if(o instanceof HTMLElement&&!o.closest("pk-dialog")&&E2(o))return!0;return!1}function A2(e,t={}){const o=t.getDocument?.()??document,n=t.root??o.body;let i=ws(o);const s=()=>{const l=ws(o);l!==i&&(i=l,e(l))},r=new MutationObserver(()=>{s()});r.observe(n,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","hidden"]});const a=window.setInterval(s,250);return{disconnect:()=>{r.disconnect(),window.clearInterval(a)}}}var $2=Ct`
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
`,T2=Xs(au.xmark),Ro,Zt=(Ro=class extends Uo{constructor(...t){super(...t),this.open=!1,this.label="",this.description="",this.disablePointerDismissal=!1,this.withoutHeader=!1,this.withoutBodyPadding=!1,this.disableScrollLock=!1,this.size="default",this.triggerElement=null,this.previouslyFocused=null,this.yieldingToHostModal=!1,this.hostModalObserver=null,this.yieldBox=null,this.handleDocumentKeyDown=o=>{this.yieldingToHostModal||o.key==="Escape"&&this.open&&Ki(this)&&(o.preventDefault(),o.stopPropagation(),this.requestClose("escape"))},this.onHostModalPresenceChange=o=>{o?this.yieldToHostModal():this.restoreFromHostModal()},this.showing=!1,this.handleDialogCancel=o=>{o.preventDefault(),!this.dialogElement.classList.contains("hide")&&Ki(this)&&this.requestClose("escape")},this.handleDialogClick=o=>{o.composedPath().some(n=>n instanceof Element&&n.matches('[data-dialog="close"], [data-dialog-close]'))&&(o.stopPropagation(),this.requestClose("close-button"))},this.handleDialogPointerDown=async o=>{if(o.target===this.dialogElement&&Ki(this)){if(!this.disablePointerDismissal){this.requestClose("pointer-dismiss");return}await Rn(this.dialogElement,"pulse")}},this.onTriggerClick=o=>{o.preventDefault(),this.open=!0},this.onFooterSlotChange=()=>{this.requestUpdate()}}hasCustomHeaderSlot(){return this.querySelector(':scope > [slot="header"]')!==null}applyYieldPosition(t){const o=this.dialogElement;o.style.position="fixed",o.style.top=`${t.top}px`,o.style.left=`${t.left}px`,o.style.width=`${t.width}px`,o.style.height=`${t.height}px`,o.style.margin="0",o.style.maxHeight="none",o.style.zIndex="99",o.toggleAttribute("data-yielding",!0)}clearYieldPosition(){const t=this.dialogElement;t&&(t.style.position="",t.style.top="",t.style.left="",t.style.width="",t.style.height="",t.style.margin="",t.style.maxHeight="",t.style.zIndex="",t.removeAttribute("data-yielding"),this.yieldBox=null)}yieldToHostModal(){if(this.yieldingToHostModal||!this.open||!this.dialogElement?.open)return;const t=this.dialogElement.getBoundingClientRect();this.yieldBox={top:t.top,left:t.left,width:t.width,height:t.height},this.yieldingToHostModal=!0;try{this.dialogElement.close(),this.dialogElement.show(),this.applyYieldPosition(this.yieldBox)}catch{this.yieldingToHostModal=!1,this.clearYieldPosition()}}restoreFromHostModal(){if(this.yieldingToHostModal&&(this.yieldingToHostModal=!1,this.clearYieldPosition(),!(!this.open||!this.dialogElement)))try{this.dialogElement.open&&this.dialogElement.close(),this.dialogElement.showModal()}catch{}}firstUpdated(){this.open&&this.show()}disconnectedCallback(){this.disableScrollLock||Zi(this),this.removeOpenListeners(),super.disconnectedCallback()}updated(t){super.updated(t),!(!t.has("open")||!this.hasUpdated)&&this.handleOpenChange()}handleOpenChange(){this.open&&!this.dialogElement.open?this.show():!this.open&&this.dialogElement.open&&(this.open=!0,this.requestClose("api"))}async show(t="api"){if(!(this.showing||this.dialogElement?.open)){this.showing=!0;try{const o=new pu;if(!this.dispatchEvent(o)){this.open=!1;return}this.addOpenListeners(),this.previouslyFocused=document.activeElement,this.open=!0,this.dialogElement.showModal(),this.disableScrollLock||S2(this),requestAnimationFrame(()=>{const n=this.querySelector("[autofocus]");if(n){(n.shadowRoot?.querySelector("input, textarea, select, button")??n).focus({preventScroll:!0});return}this.dialogElement.focus({preventScroll:!0})}),await Rn(this.dialogElement,"show"),this.dispatchEvent(new CustomEvent("pk-open-change",{detail:{open:!0},bubbles:!0,composed:!0})),this.dispatchEvent(new hu)}finally{this.showing=!1}}}async hide(t="unknown"){await this.requestClose(t)}closeDialog(){this.requestClose("close-button")}async requestClose(t="unknown"){const o=new fu(typeof t=="string"?t:"close-button");if(!this.dispatchEvent(o)){this.open=!0,await Rn(this.dialogElement,"pulse");return}this.removeOpenListeners(),await Rn(this.dialogElement,"hide"),this.open=!1,this.dialogElement.close(),this.disableScrollLock||Zi(this);const n=this.previouslyFocused;this.previouslyFocused=null,n?.isConnected&&window.setTimeout(()=>{n.focus({preventScroll:!0})},0),this.dispatchEvent(new gu),this.dispatchEvent(new CustomEvent("pk-open-change",{detail:{open:!1},bubbles:!0,composed:!0}))}forceOverlayReset(){if(this.open=!1,this.yieldingToHostModal=!1,this.clearYieldPosition(),this.removeOpenListeners(),this.dialogElement?.open)try{this.dialogElement.close()}catch{}this.dialogElement?.classList.remove("hide","show","pulse"),this.disableScrollLock||Zi(this)}addOpenListeners(){document.addEventListener("keydown",this.handleDocumentKeyDown),of(this),this.hostModalObserver?.disconnect(),this.hostModalObserver=A2(this.onHostModalPresenceChange),this.onHostModalPresenceChange(ws())}removeOpenListeners(){document.removeEventListener("keydown",this.handleDocumentKeyDown),nf(this),this.hostModalObserver?.disconnect(),this.hostModalObserver=null,this.yieldingToHostModal=!1,this.clearYieldPosition()}syncHasTriggerAttribute(){this.toggleAttribute("data-has-trigger",!!this.triggerElement)}onTriggerSlotChange(t){const[o]=t.target.assignedElements({flatten:!0});this.triggerElement&&this.triggerElement.removeEventListener("click",this.onTriggerClick),this.triggerElement=o??null,this.syncHasTriggerAttribute(),this.triggerElement&&this.triggerElement.addEventListener("click",this.onTriggerClick)}render(){const t=!this.hasCustomHeaderSlot()&&!this.withoutHeader&&!!this.label,o=t&&!this.withoutBodyPadding,n=this.querySelector(':scope > [slot="footer"]')!==null;return J`
            <slot name="trigger" @slotchange=${this.onTriggerSlotChange}></slot>
            <dialog
                part="panel"
                class=${ue({dialog:!0,open:this.open,"dialog--wide":this.size==="wide"})}
                tabindex="-1"
                @cancel=${this.handleDialogCancel}
                @click=${this.handleDialogClick}
                @pointerdown=${this.handleDialogPointerDown}
            >
                <slot name="header">
                    ${t?J`
                            <header part="header" class="header">
                                <h2 part="title" class="title">
                                    <slot name="label">${this.label}</slot>
                                </h2>
                                ${this.description?J`
                                        <p part="description" class="description">
                                            <slot name="description">${this.description}</slot>
                                        </p>
                                    `:J`<slot name="description" hidden></slot>`}
                                <button type="button" class="close" data-dialog="close" aria-label="Close">
                                    <span class="close-icon" aria-hidden="true">${lu(T2)}</span>
                                </button>
                            </header>
                        `:U}
                </slot>
                <div
                    part="body"
                    class=${ue({body:!0,"body--padded":o})}
                >
                    <slot></slot>
                </div>
                ${n?J`
                        <footer part="footer" class="footer">
                            <slot name="footer" @slotchange=${this.onFooterSlotChange}></slot>
                        </footer>
                    `:J`<slot name="footer" @slotchange=${this.onFooterSlotChange} hidden></slot>`}
            </dialog>
        `}},Ro.styles=$2,Ro);x([E({type:Boolean,reflect:!0})],Zt.prototype,"open",void 0);x([E()],Zt.prototype,"label",void 0);x([E()],Zt.prototype,"description",void 0);x([E({attribute:"disable-pointer-dismissal",type:Boolean,reflect:!0})],Zt.prototype,"disablePointerDismissal",void 0);x([E({attribute:"without-header",type:Boolean,reflect:!0})],Zt.prototype,"withoutHeader",void 0);x([E({attribute:"without-body-padding",type:Boolean,reflect:!0})],Zt.prototype,"withoutBodyPadding",void 0);x([E({attribute:"disable-scroll-lock",type:Boolean,reflect:!0})],Zt.prototype,"disableScrollLock",void 0);x([E({reflect:!0})],Zt.prototype,"size",void 0);x([uo("dialog")],Zt.prototype,"dialogElement",void 0);x([Qt()],Zt.prototype,"triggerElement",void 0);Zt=x([He("pk-dialog")],Zt);var P2=ki({name:"PkDialog",tagName:"pk-dialog"}),Ut=Be({name:"PkCheckbox",inheritAttrs:!1,props:{checked:{type:Boolean,default:!1},indeterminate:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},invalid:{type:Boolean,default:!1},required:{type:Boolean,default:!1},name:{type:String,default:void 0},value:{type:String,default:"on"},dataState:{type:String,default:void 0}},emits:{"update:checked":e=>typeof e=="boolean"},setup(e,{attrs:t,slots:o,emit:n}){const i=s=>{const r=t.onPkChange;r?.(s),n("update:checked",y2(s))};return()=>Fo("pk-checkbox",{...t,checked:e.checked,indeterminate:e.indeterminate||void 0,disabled:e.disabled||void 0,invalid:e.invalid||void 0,required:e.required||void 0,...e.name?{name:e.name}:{},checkboxValue:e.value,...e.dataState?{"data-state":e.dataState}:{},onPkChange:i},Us(o))}}),da=Be({name:"PkButton",inheritAttrs:!1,props:{variant:{type:String,default:"default"},size:{type:String,default:"default"},loading:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},type:{type:String,default:"button"},spinnerVariant:{type:String,default:void 0},spinnerTone:{type:String,default:void 0},dataState:{type:String,default:void 0},withCaret:{type:Boolean,default:!1},groupTrigger:{type:Boolean,default:!1}},setup(e,{attrs:t,slots:o}){return()=>Fo("pk-button",{...t,variant:e.variant,size:e.size,loading:e.loading||void 0,disabled:e.disabled||void 0,type:e.type,...e.spinnerVariant?{"spinner-variant":e.spinnerVariant}:{},...e.spinnerTone?{"spinner-tone":e.spinnerTone}:{},...e.dataState?{"data-state":e.dataState}:{},...e.withCaret?{"with-caret":""}:{},...e.groupTrigger?{"group-trigger":""}:{}},Us(o))}}),M2={"pk-spinner":"components/spinner/spinner.js","pk-icon":"components/icon/icon.js","pk-button":"components/button/button.js","pk-checkbox":"components/checkbox/checkbox.js","pk-checkbox-select":"components/checkbox-select/checkbox-select.js","pk-color-input":"components/color-input/color-input.js","pk-code-editor":"components/code-editor/code-editor.js","pk-input":"components/input/input.js","pk-input-group":"components/input-group/input-group.js","pk-input-group-addon":"components/input-group/input-group-addon.js","pk-input-group-button":"components/input-group/input-group-button.js","pk-input-group-input":"components/input-group/input-group-input.js","pk-input-group-text":"components/input-group/input-group-text.js","pk-input-group-textarea":"components/input-group/input-group-textarea.js","pk-textarea":"components/textarea/textarea.js","pk-tiptap-editor":"components/tiptap/tiptap-editor.js","pk-tiptap-input":"components/tiptap/tiptap-input.js","pk-tiptap-content":"components/tiptap/tiptap-content.js","pk-field":"components/field/field.js","pk-separator":"components/separator/separator.js","pk-status":"components/status/status.js","pk-toggle":"components/toggle/toggle.js","pk-toggle-group":"components/toggle-group/toggle-group.js","pk-lightswitch":"components/lightswitch/lightswitch.js","pk-button-group":"components/button-group/button-group.js","pk-button-group-separator":"components/button-group/button-group-separator.js","pk-button-group-text":"components/button-group/button-group-text.js","pk-dialog":"components/dialog/dialog.js","pk-popup":"components/popup/popup.js","pk-dropdown-label":"components/dropdown-menu/dropdown-label.js","pk-dropdown-item":"components/dropdown-menu/dropdown-item.js","pk-dropdown-separator":"components/dropdown-menu/dropdown-separator.js","pk-dropdown-menu":"components/dropdown-menu/dropdown-menu.js","pk-popover":"components/popover/popover.js","pk-tooltip":"components/tooltip/tooltip.js","pk-radio":"components/radio-group/radio.js","pk-radio-group":"components/radio-group/radio-group.js","pk-tab":"components/tabs/tab.js","pk-tab-heading":"components/tabs/tab-heading.js","pk-tab-panel":"components/tabs/tab-panel.js","pk-tabs":"components/tabs/tabs.js","pk-scroll-area":"components/scroll-area/scroll-area.js","pk-option":"components/select/option.js","pk-option-group":"components/select/option-group.js","pk-select":"components/select/select.js","pk-calendar":"components/calendar/calendar.js","pk-date-picker":"components/date-picker/date-picker.js","pk-combobox":"components/combobox/combobox.js","pk-time-picker":"components/time-picker/time-picker.js","pk-copy-button":"components/copy-button/copy-button.js","pk-connect":"components/connect/connect.js","pk-connect-oauth":"components/connect/connect-oauth.js","pk-editable-table":"components/editable-table/editable-table.js"},z2={"components/spinner/spinner":"src/components/spinner/pk-spinner.ts","components/icon/icon":"src/components/icon/pk-icon-loader.ts","components/button/button":"src/components/button/pk-button.ts","components/checkbox/checkbox":"src/components/checkbox/pk-checkbox.ts","components/checkbox-select/checkbox-select":"src/components/checkbox-select/pk-checkbox-select.ts","components/color-input/color-input":"src/components/color-input/pk-color-input.ts","components/code-editor/code-editor":"src/components/code-editor/pk-code-editor.ts","components/input/input":"src/components/input/pk-input.ts","components/input-group/input-group":"src/components/input-group/pk-input-group.ts","components/input-group/input-group-addon":"src/components/input-group/pk-input-group-addon.ts","components/input-group/input-group-button":"src/components/input-group/pk-input-group-button.ts","components/input-group/input-group-input":"src/components/input-group/pk-input-group-input.ts","components/input-group/input-group-text":"src/components/input-group/pk-input-group-text.ts","components/input-group/input-group-textarea":"src/components/input-group/pk-input-group-textarea.ts","components/textarea/textarea":"src/components/textarea/pk-textarea.ts","components/tiptap/tiptap-editor":"src/components/tiptap/pk-tiptap-editor.ts","components/tiptap/tiptap-input":"src/components/tiptap/pk-tiptap-input.ts","components/tiptap/tiptap-content":"src/components/tiptap/pk-tiptap-content.ts","components/field/field":"src/components/field/pk-field.ts","components/separator/separator":"src/components/separator/pk-separator.ts","components/status/status":"src/components/status/pk-status.ts","components/toggle/toggle":"src/components/toggle/pk-toggle.ts","components/toggle-group/toggle-group":"src/components/toggle-group/pk-toggle-group.ts","components/lightswitch/lightswitch":"src/components/lightswitch/pk-lightswitch.ts","components/button-group/button-group":"src/components/button-group/pk-button-group.ts","components/button-group/button-group-separator":"src/components/button-group/pk-button-group-separator.ts","components/button-group/button-group-text":"src/components/button-group/pk-button-group-text.ts","components/dialog/dialog":"src/components/dialog/pk-dialog.ts","components/popup/popup":"src/components/popup/pk-popup.ts","components/dropdown-menu/dropdown-label":"src/components/dropdown-menu/pk-dropdown-label.ts","components/dropdown-menu/dropdown-item":"src/components/dropdown-menu/pk-dropdown-item.ts","components/dropdown-menu/dropdown-separator":"src/components/dropdown-menu/pk-dropdown-separator.ts","components/dropdown-menu/dropdown-menu":"src/components/dropdown-menu/pk-dropdown-menu.ts","components/popover/popover":"src/components/popover/pk-popover.ts","components/tooltip/tooltip":"src/components/tooltip/pk-tooltip.ts","components/radio-group/radio":"src/components/radio-group/pk-radio.ts","components/radio-group/radio-group":"src/components/radio-group/pk-radio-group.ts","components/tabs/tab":"src/components/tabs/pk-tab.ts","components/tabs/tab-heading":"src/components/tabs/pk-tab-heading.ts","components/tabs/tab-panel":"src/components/tabs/pk-tab-panel.ts","components/tabs/tabs":"src/components/tabs/pk-tabs.ts","components/scroll-area/scroll-area":"src/components/scroll-area/pk-scroll-area.ts","components/select/option":"src/components/select/pk-option.ts","components/select/option-group":"src/components/select/pk-option-group.ts","components/select/select":"src/components/select/pk-select.ts","components/calendar/calendar":"src/components/calendar/pk-calendar.ts","components/date-picker/date-picker":"src/components/date-picker/pk-date-picker.ts","components/combobox/combobox":"src/components/combobox/pk-combobox.ts","components/time-picker/time-picker":"src/components/time-picker/pk-time-picker.ts","components/copy-button/copy-button":"src/components/copy-button/pk-copy-button.ts","components/connect/connect":"src/components/connect/pk-connect.ts","components/connect/connect-oauth":"src/components/connect/pk-connect-oauth.ts","components/editable-table/editable-table":"src/components/editable-table/pk-editable-table.ts"},L2={"src/components/icon/pk-icon-loader.ts":"src/components/icon/pk-icon.ts"},O2=Object.fromEntries(Object.values(z2).map(e=>{const t=L2[e]??e;return[t.replace(/^src\//,"").replace(/\.ts$/,""),t]}));Object.fromEntries(Object.keys(O2).map(e=>[e.split("/").pop(),`${e}.js`]));var R2=e=>{e.trim()},I2=e=>{const t=(e||[]).map(o=>o.trim()).filter(Boolean);t.length>0},F2=e=>{e.shadowRootSelectors&&I2(e.shadowRootSelectors)},xs="";function pa(e){xs=e}function N2(e=""){if(!xs){const t=document.querySelector("[data-plugin-kit]");if(t?.hasAttribute("data-plugin-kit")){const o=new URL(t.getAttribute("data-plugin-kit")??"",window.location.href).pathname;pa(o)}else{const o=[...document.getElementsByTagName("script")].find(n=>n.src.endsWith("plugin-kit.js")||n.src.endsWith("plugin-kit.loader.js"));o&&pa(String(o.getAttribute("src")).split("/").slice(0,-1).join("/"))}}return xs.replace(/\/$/,"")+(e?`/${e.replace(/^\//,"")}`:"")}var Qi="pk-",D2="pk-discovery-complete";new MutationObserver(e=>{for(const{addedNodes:t}of e)for(const o of t)o.nodeType===Node.ELEMENT_NODE&&j2(o)});async function j2(e=document){const t=e instanceof Element?e.tagName.toLowerCase():"",o=t.startsWith(Qi),n=[...e.querySelectorAll(":not(:defined)")].map(l=>l.tagName.toLowerCase()).filter(l=>l.startsWith(Qi));o&&!customElements.get(t)&&n.push(t);const i=e.querySelectorAll("[data-pk-preload]"),s=e instanceof Element&&e.hasAttribute("data-pk-preload")?[e,...i]:i;for(const l of s)n.push(...l.getAttribute("data-pk-preload").split(/\s+/).filter(u=>u.startsWith(Qi)));const r=[...new Set(n)],a=await Promise.allSettled(r.map(l=>U2(l)));for(const l of a)l.status==="rejected"&&console.warn(l.reason);await new Promise(requestAnimationFrame),e.dispatchEvent(new CustomEvent(D2,{bubbles:!1,cancelable:!1,composed:!0}))}function U2(e){if(customElements.get(e))return Promise.resolve();const t=M2[e];return t?import(N2(t)).then(()=>{}):Promise.reject(new Error(`Unable to autoload <${e}> — no module path registered`))}var B2=Object.create,Pu=Object.defineProperty,H2=Object.getOwnPropertyDescriptor,V2=Object.getOwnPropertyNames,q2=Object.getPrototypeOf,K2=Object.prototype.hasOwnProperty,bt=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),W2=(e,t,o,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(var i=V2(t),s=0,r=i.length,a;s<r;s++)a=i[s],!K2.call(e,a)&&a!==o&&Pu(e,a,{get:(l=>t[l]).bind(null,a),enumerable:!(n=H2(t,a))||n.enumerable});return e},G2=(e,t,o)=>(o=e!=null?B2(q2(e)):{},W2(Pu(o,"default",{value:e,enumerable:!0}),e)),po=bt(((e,t)=>{function o(n){return n&&n.__esModule?n:{default:n}}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports})),Mu=bt(((e,t)=>{function o(n){"@babel/helpers - typeof";return t.exports=o=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(i){return typeof i}:function(i){return i&&typeof Symbol=="function"&&i.constructor===Symbol&&i!==Symbol.prototype?"symbol":typeof i},t.exports.__esModule=!0,t.exports.default=t.exports,o(n)}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports})),Y2=bt(((e,t)=>{var o=Mu().default;function n(i,s){if(o(i)!="object"||!i)return i;var r=i[Symbol.toPrimitive];if(r!==void 0){var a=r.call(i,s||"default");if(o(a)!="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(s==="string"?String:Number)(i)}t.exports=n,t.exports.__esModule=!0,t.exports.default=t.exports})),zu=bt(((e,t)=>{var o=Mu().default,n=Y2();function i(s){var r=n(s,"string");return o(r)=="symbol"?r:r+""}t.exports=i,t.exports.__esModule=!0,t.exports.default=t.exports})),X2=bt(((e,t)=>{var o=zu();function n(i,s,r){return(s=o(s))in i?Object.defineProperty(i,s,{value:r,enumerable:!0,configurable:!0,writable:!0}):i[s]=r,i}t.exports=n,t.exports.__esModule=!0,t.exports.default=t.exports})),qo=bt(((e,t)=>{function o(n,i){if(!(n instanceof i))throw new TypeError("Cannot call a class as a function")}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports})),Ko=bt(((e,t)=>{var o=zu();function n(s,r){for(var a=0;a<r.length;a++){var l=r[a];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(s,o(l.key),l)}}function i(s,r,a){return r&&n(s.prototype,r),a&&n(s,a),Object.defineProperty(s,"prototype",{writable:!1}),s}t.exports=i,t.exports.__esModule=!0,t.exports.default=t.exports})),Lu=bt(((e,t)=>{function o(n,i){(i==null||i>n.length)&&(i=n.length);for(var s=0,r=Array(i);s<i;s++)r[s]=n[s];return r}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports})),J2=bt(((e,t)=>{var o=Lu();function n(i){if(Array.isArray(i))return o(i)}t.exports=n,t.exports.__esModule=!0,t.exports.default=t.exports})),Z2=bt(((e,t)=>{function o(n){if(typeof Symbol<"u"&&n[Symbol.iterator]!=null||n["@@iterator"]!=null)return Array.from(n)}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports})),Q2=bt(((e,t)=>{var o=Lu();function n(i,s){if(i){if(typeof i=="string")return o(i,s);var r={}.toString.call(i).slice(8,-1);return r==="Object"&&i.constructor&&(r=i.constructor.name),r==="Map"||r==="Set"?Array.from(i):r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?o(i,s):void 0}}t.exports=n,t.exports.__esModule=!0,t.exports.default=t.exports})),t1=bt(((e,t)=>{function o(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports})),e1=bt(((e,t)=>{var o=J2(),n=Z2(),i=Q2(),s=t1();function r(a){return o(a)||n(a)||i(a)||s()}t.exports=r,t.exports.__esModule=!0,t.exports.default=t.exports})),o1=bt((e=>{var t=po()(e1()),o={functions:"Jexl Function",transforms:"Transform"};e.ArrayLiteral=function(n){return this.evalArray(n.value)},e.BinaryExpression=function(n){var i=this,s=this._grammar.elements[n.operator];if(s.evalOnDemand){var r=function(l){return{eval:function(){return i.eval(l)}}};return s.evalOnDemand(r(n.left),r(n.right))}return this.Promise.all([this.eval(n.left),this.eval(n.right)]).then(function(a){return s.eval(a[0],a[1])})},e.ConditionalExpression=function(n){var i=this;return this.eval(n.test).then(function(s){return s?n.consequent?i.eval(n.consequent):s:i.eval(n.alternate)})},e.FilterExpression=function(n){var i=this;return this.eval(n.subject).then(function(s){return n.relative?i._filterRelative(s,n.expr):i._filterStatic(s,n.expr)})},e.Identifier=function(n){return n.from?this.eval(n.from).then(function(i){if(i!=null)return Array.isArray(i)&&(i=i[0]),i[n.value]}):n.relative?this._relContext[n.value]:this._context[n.value]},e.Literal=function(n){return n.value},e.ObjectLiteral=function(n){return this.evalMap(n.value)},e.FunctionCall=function(n){var i=o[n.pool];if(!i)throw new Error("Corrupt AST: Pool '".concat(n.pool,"' not found"));var s=this._grammar[n.pool][n.name];if(!s)throw new Error("".concat(i," ").concat(n.name," is not defined."));return this.evalArray(n.args||[]).then(function(r){return s.apply(void 0,(0,t.default)(r))})},e.UnaryExpression=function(n){var i=this;return this.eval(n.right).then(function(s){return i._grammar.elements[n.operator].eval(s)})}})),n1=bt(((e,t)=>{var o=po(),n=o(qo()),i=o(Ko()),s=o1();t.exports=(function(){function r(a,l,u){var c=arguments.length>3&&arguments[3]!==void 0?arguments[3]:Promise;(0,n.default)(this,r),this._grammar=a,this._context=l||{},this._relContext=u||this._context,this.Promise=c}return(0,i.default)(r,[{key:"eval",value:function(l){var u=this;return this.Promise.resolve().then(function(){return s[l.type].call(u,l)})}},{key:"evalArray",value:function(l){var u=this;return this.Promise.all(l.map(function(c){return u.eval(c)}))}},{key:"evalMap",value:function(l){var u=this,c=Object.keys(l),d={},m=c.map(function(h){return u.eval(l[h])});return this.Promise.all(m).then(function(h){return h.forEach(function(v,w){d[c[w]]=v}),d})}},{key:"_filterRelative",value:function(l,u){var c=this,d=[];return Array.isArray(l)||(l=l===void 0?[]:[l]),l.forEach(function(m){var h=new r(c._grammar,c._context,m,c.Promise);d.push(h.eval(u))}),this.Promise.all(d).then(function(m){var h=[];return m.forEach(function(v,w){v&&h.push(l[w])}),h})}},{key:"_filterStatic",value:function(l,u){return this.eval(u).then(function(c){return typeof c=="boolean"?c?l:void 0:l[c]})}}]),r})()})),i1=bt(((e,t)=>{var o=po(),n=o(qo()),i=o(Ko()),s=/^-?(?:(?:[0-9]*\.[0-9]+)|[0-9]+)$/,r=/^[a-zA-Zа-яА-Я_\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF$][a-zA-Zа-яА-Я0-9_\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF$]*$/,a=/\\\\/,l=/^\s*$/,u=["'(?:(?:\\\\')|[^'])*'",'"(?:(?:\\\\")|[^"])*"',"\\s+","\\btrue\\b","\\bfalse\\b"],c=["[a-zA-Zа-яА-Я_À-ÖØ-öø-ÿ\\$][a-zA-Z0-9а-яА-Я_À-ÖØ-öø-ÿ\\$]*","(?:(?:[0-9]*\\.[0-9]+)|[0-9]+)"],d=["binaryOp","unaryOp","openParen","openBracket","question","colon"];t.exports=(function(){function m(h){(0,n.default)(this,m),this._grammar=h}return(0,i.default)(m,[{key:"getElements",value:function(v){var w=this._getSplitRegex();return v.split(w).filter(function(P){return P})}},{key:"getTokens",value:function(v){for(var w=[],P=!1,T=0;T<v.length;T++)this._isWhitespace(v[T])?w.length&&(w[w.length-1].raw+=v[T]):v[T]==="-"&&this._isNegative(w)?P=!0:(P&&(v[T]="-"+v[T],P=!1),w.push(this._createToken(v[T])));return P&&w.push(this._createToken("-")),w}},{key:"tokenize",value:function(v){var w=this.getElements(v);return this.getTokens(w)}},{key:"_createToken",value:function(v){var w={type:"literal",value:v,raw:v};if(v[0]==='"'||v[0]==="'")w.value=this._unquote(v);else if(v.match(s))w.value=parseFloat(v);else if(v==="true"||v==="false")w.value=v==="true";else if(this._grammar.elements[v])w.type=this._grammar.elements[v].type;else if(v.match(r))w.type="identifier";else throw new Error("Invalid expression token: ".concat(v));return w}},{key:"_escapeRegExp",value:function(v){return v=v.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),v.match(r)&&(v="\\b"+v+"\\b"),v}},{key:"_getSplitRegex",value:function(){var v=this;if(!this._splitRegex){var w=Object.keys(this._grammar.elements).sort(function(P,T){return T.length-P.length}).map(function(P){return v._escapeRegExp(P)},this);this._splitRegex=new RegExp("("+[u.join("|"),w.join("|"),c.join("|")].join("|")+")")}return this._splitRegex}},{key:"_isNegative",value:function(v){return v.length?d.some(function(w){return w===v[v.length-1].type}):!0}},{key:"_isWhitespace",value:function(v){return!!v.match(l)}},{key:"_unquote",value:function(v){var w=v[0],P=new RegExp("\\\\"+w,"g");return v.substr(1,v.length-2).replace(P,w).replace(a,"\\")}}]),m})()})),Ou=bt((e=>{e.argVal=function(t){t&&this._cursor.args.push(t)},e.arrayStart=function(){this._placeAtCursor({type:"ArrayLiteral",value:[]})},e.arrayVal=function(t){t&&this._cursor.value.push(t)},e.binaryOp=function(t){for(var o=this._grammar.elements[t.value].precedence||0,n=this._cursor._parent;n&&n.operator&&this._grammar.elements[n.operator].precedence>=o;)this._cursor=n,n=n._parent;var i={type:"BinaryExpression",operator:t.value,left:this._cursor};this._setParent(this._cursor,i),this._cursor=n,this._placeAtCursor(i)},e.dot=function(){this._nextIdentEncapsulate=this._cursor&&this._cursor.type!=="UnaryExpression"&&(this._cursor.type!=="BinaryExpression"||this._cursor.type==="BinaryExpression"&&this._cursor.right),this._nextIdentRelative=!this._cursor||this._cursor&&!this._nextIdentEncapsulate,this._nextIdentRelative&&(this._relative=!0)},e.filter=function(t){this._placeBeforeCursor({type:"FilterExpression",expr:t,relative:this._subParser.isRelative(),subject:this._cursor})},e.functionCall=function(){this._placeBeforeCursor({type:"FunctionCall",name:this._cursor.value,args:[],pool:"functions"})},e.identifier=function(t){var o={type:"Identifier",value:t.value};this._nextIdentEncapsulate?(o.from=this._cursor,this._placeBeforeCursor(o),this._nextIdentEncapsulate=!1):(this._nextIdentRelative&&(o.relative=!0,this._nextIdentRelative=!1),this._placeAtCursor(o))},e.literal=function(t){this._placeAtCursor({type:"Literal",value:t.value})},e.objKey=function(t){this._curObjKey=t.value},e.objStart=function(){this._placeAtCursor({type:"ObjectLiteral",value:{}})},e.objVal=function(t){this._cursor.value[this._curObjKey]=t},e.subExpression=function(t){this._placeAtCursor(t)},e.ternaryEnd=function(t){this._cursor.alternate=t},e.ternaryMid=function(t){this._cursor.consequent=t},e.ternaryStart=function(){this._tree={type:"ConditionalExpression",test:this._tree},this._cursor=this._tree},e.transform=function(t){this._placeBeforeCursor({type:"FunctionCall",name:t.value,args:[this._cursor],pool:"transforms"})},e.unaryOp=function(t){this._placeAtCursor({type:"UnaryExpression",operator:t.value})}})),s1=bt((e=>{var t=Ou();e.states={expectOperand:{tokenTypes:{literal:{toState:"expectBinOp"},identifier:{toState:"identifier"},unaryOp:{},openParen:{toState:"subExpression"},openCurl:{toState:"expectObjKey",handler:t.objStart},dot:{toState:"traverse"},openBracket:{toState:"arrayVal",handler:t.arrayStart}}},expectBinOp:{tokenTypes:{binaryOp:{toState:"expectOperand"},pipe:{toState:"expectTransform"},dot:{toState:"traverse"},question:{toState:"ternaryMid",handler:t.ternaryStart}},completable:!0},expectTransform:{tokenTypes:{identifier:{toState:"postTransform",handler:t.transform}}},expectObjKey:{tokenTypes:{identifier:{toState:"expectKeyValSep",handler:t.objKey},closeCurl:{toState:"expectBinOp"}}},expectKeyValSep:{tokenTypes:{colon:{toState:"objVal"}}},postTransform:{tokenTypes:{openParen:{toState:"argVal"},binaryOp:{toState:"expectOperand"},dot:{toState:"traverse"},openBracket:{toState:"filter"},pipe:{toState:"expectTransform"}},completable:!0},postArgs:{tokenTypes:{binaryOp:{toState:"expectOperand"},dot:{toState:"traverse"},openBracket:{toState:"filter"},pipe:{toState:"expectTransform"}},completable:!0},identifier:{tokenTypes:{binaryOp:{toState:"expectOperand"},dot:{toState:"traverse"},openBracket:{toState:"filter"},openParen:{toState:"argVal",handler:t.functionCall},pipe:{toState:"expectTransform"},question:{toState:"ternaryMid",handler:t.ternaryStart}},completable:!0},traverse:{tokenTypes:{identifier:{toState:"identifier"}}},filter:{subHandler:t.filter,endStates:{closeBracket:"identifier"}},subExpression:{subHandler:t.subExpression,endStates:{closeParen:"expectBinOp"}},argVal:{subHandler:t.argVal,endStates:{comma:"argVal",closeParen:"postArgs"}},objVal:{subHandler:t.objVal,endStates:{comma:"expectObjKey",closeCurl:"expectBinOp"}},arrayVal:{subHandler:t.arrayVal,endStates:{comma:"arrayVal",closeBracket:"expectBinOp"}},ternaryMid:{subHandler:t.ternaryMid,endStates:{colon:"ternaryEnd"}},ternaryEnd:{subHandler:t.ternaryEnd,completable:!0}}})),r1=bt(((e,t)=>{var o=po(),n=o(qo()),i=o(Ko()),s=Ou(),r=s1().states;t.exports=(function(){function a(l,u,c){(0,n.default)(this,a),this._grammar=l,this._state="expectOperand",this._tree=null,this._exprStr=u||"",this._relative=!1,this._stopMap=c||{}}return(0,i.default)(a,[{key:"addToken",value:function(u){if(this._state==="complete")throw new Error("Cannot add a new token to a completed Parser");var c=r[this._state],d=this._exprStr;if(this._exprStr+=u.raw,c.subHandler){this._subParser||this._startSubExpression(d);var m=this._subParser.addToken(u);if(m){if(this._endSubExpression(),this._parentStop)return m;this._state=m}}else if(c.tokenTypes[u.type]){var h=c.tokenTypes[u.type],v=s[u.type];h.handler&&(v=h.handler),v&&v.call(this,u),h.toState&&(this._state=h.toState)}else{if(this._stopMap[u.type])return this._stopMap[u.type];throw new Error("Token ".concat(u.raw," (").concat(u.type,") unexpected in expression: ").concat(this._exprStr))}return!1}},{key:"addTokens",value:function(u){u.forEach(this.addToken,this)}},{key:"complete",value:function(){if(this._cursor&&!r[this._state].completable)throw new Error("Unexpected end of expression: ".concat(this._exprStr));return this._subParser&&this._endSubExpression(),this._state="complete",this._cursor?this._tree:null}},{key:"isRelative",value:function(){return this._relative}},{key:"_endSubExpression",value:function(){r[this._state].subHandler.call(this,this._subParser.complete()),this._subParser=null}},{key:"_placeAtCursor",value:function(u){this._cursor?(this._cursor.right=u,this._setParent(u,this._cursor)):this._tree=u,this._cursor=u}},{key:"_placeBeforeCursor",value:function(u){this._cursor=this._cursor._parent,this._placeAtCursor(u)}},{key:"_setParent",value:function(u,c){Object.defineProperty(u,"_parent",{value:c,writable:!0})}},{key:"_startSubExpression",value:function(u){var c=r[this._state].endStates;c||(this._parentStop=!0,c=this._stopMap),this._subParser=new a(this._grammar,u,c)}}]),a})()})),a1=bt(((e,t)=>{var o=po(),n=o(qo()),i=o(Ko()),s=(function(){function r(a){(0,n.default)(this,r),a(this._resolve.bind(this),this._reject.bind(this))}return(0,i.default)(r,[{key:"catch",value:function(l){if(this.error)try{this._resolve(l(this.error))}catch(u){this._reject(u)}return this}},{key:"then",value:function(l,u){if(!this.error)try{this._resolve(l(this.value))}catch(c){this._reject(c)}return u&&this.catch(u),this}},{key:"_reject",value:function(l){this.value=void 0,this.error=l}},{key:"_resolve",value:function(l){l instanceof r?l.error?this._reject(l.error):this._resolve(l.value):(this.value=l,this.error=void 0)}}]),r})();s.all=function(r){return new s(function(a){a(r.map(function(l){for(;l instanceof s;){if(l.error)throw Error(l.error);l=l.value}return l}))})},s.resolve=function(r){return new s(function(a){return a(r)})},s.reject=function(r){return new s(function(a,l){return l(r)})},t.exports=s})),l1=bt(((e,t)=>{var o=po(),n=o(qo()),i=o(Ko()),s=n1(),r=i1(),a=r1(),l=a1();t.exports=(function(){function u(c,d){(0,n.default)(this,u),this._grammar=c,this._exprStr=d,this._ast=null}return(0,i.default)(u,[{key:"compile",value:function(){var d=new r(this._grammar),m=new a(this._grammar),h=d.tokenize(this._exprStr);return m.addTokens(h),this._ast=m.complete(),this}},{key:"eval",value:function(){var d=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return this._eval(d,Promise)}},{key:"evalSync",value:function(){var d=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},m=this._eval(d,l);if(m.error)throw m.error;return m.value}},{key:"_eval",value:function(d,m){var h=this;return m.resolve().then(function(){var v=h._getAst();return new s(h._grammar,d,void 0,m).eval(v)})}},{key:"_getAst",value:function(){return this._ast||this.compile(),this._ast}}]),u})()})),c1=bt((e=>{e.getGrammar=function(){return{elements:{".":{type:"dot"},"[":{type:"openBracket"},"]":{type:"closeBracket"},"|":{type:"pipe"},"{":{type:"openCurl"},"}":{type:"closeCurl"},":":{type:"colon"},",":{type:"comma"},"(":{type:"openParen"},")":{type:"closeParen"},"?":{type:"question"},"+":{type:"binaryOp",precedence:30,eval:function(o,n){return o+n}},"-":{type:"binaryOp",precedence:30,eval:function(o,n){return o-n}},"*":{type:"binaryOp",precedence:40,eval:function(o,n){return o*n}},"/":{type:"binaryOp",precedence:40,eval:function(o,n){return o/n}},"//":{type:"binaryOp",precedence:40,eval:function(o,n){return Math.floor(o/n)}},"%":{type:"binaryOp",precedence:50,eval:function(o,n){return o%n}},"^":{type:"binaryOp",precedence:50,eval:function(o,n){return Math.pow(o,n)}},"==":{type:"binaryOp",precedence:20,eval:function(o,n){return o==n}},"!=":{type:"binaryOp",precedence:20,eval:function(o,n){return o!=n}},">":{type:"binaryOp",precedence:20,eval:function(o,n){return o>n}},">=":{type:"binaryOp",precedence:20,eval:function(o,n){return o>=n}},"<":{type:"binaryOp",precedence:20,eval:function(o,n){return o<n}},"<=":{type:"binaryOp",precedence:20,eval:function(o,n){return o<=n}},"&&":{type:"binaryOp",precedence:10,evalOnDemand:function(o,n){return o.eval().then(function(i){return i&&n.eval()})}},"||":{type:"binaryOp",precedence:10,evalOnDemand:function(o,n){return o.eval().then(function(i){return i||n.eval()})}},in:{type:"binaryOp",precedence:20,eval:function(o,n){return typeof n=="string"?n.indexOf(o)!==-1:Array.isArray(n)?n.some(function(i){return i===o}):!1}},"!":{type:"unaryOp",precedence:1/0,eval:function(o){return!o}}},functions:{},transforms:{}}}})),ts=G2(bt(((e,t)=>{var o=po(),n=o(X2()),i=o(qo()),s=o(Ko()),r=l1(),a=c1().getGrammar,l=(function(){function u(){(0,i.default)(this,u),this.expr=this.expr.bind(this),this._grammar=a()}return(0,s.default)(u,[{key:"addBinaryOp",value:function(d,m,h,v){this._addGrammarElement(d,(0,n.default)({type:"binaryOp",precedence:m},v?"evalOnDemand":"eval",h))}},{key:"addFunction",value:function(d,m){this._grammar.functions[d]=m}},{key:"addFunctions",value:function(d){for(var m in d)this._grammar.functions[m]=d[m]}},{key:"addUnaryOp",value:function(d,m){this._addGrammarElement(d,{type:"unaryOp",weight:1/0,eval:m})}},{key:"addTransform",value:function(d,m){this._grammar.transforms[d]=m}},{key:"addTransforms",value:function(d){for(var m in d)this._grammar.transforms[m]=d[m]}},{key:"compile",value:function(d){return this.createExpression(d).compile()}},{key:"createExpression",value:function(d){return new r(this._grammar,d)}},{key:"getFunction",value:function(d){return this._grammar.functions[d]}},{key:"getTransform",value:function(d){return this._grammar.transforms[d]}},{key:"eval",value:function(d){var m=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};return this.createExpression(d).eval(m)}},{key:"evalSync",value:function(d){var m=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};return this.createExpression(d).evalSync(m)}},{key:"expr",value:function(d){for(var m=arguments.length,h=new Array(m>1?m-1:0),v=1;v<m;v++)h[v-1]=arguments[v];var w=d.reduce(function(P,T,N){var L=N<h.length?h[N]:"";return P+=T+L,P},"");return this.createExpression(w)}},{key:"removeOp",value:function(d){this._grammar.elements[d]&&(this._grammar.elements[d].type==="binaryOp"||this._grammar.elements[d].type==="unaryOp")&&delete this._grammar.elements[d]}},{key:"_addGrammarElement",value:function(d,m){this._grammar.elements[d]=m}}]),u})();t.exports=new l,t.exports.Jexl=l}))());"default"in ts&&ts.default;var u1=e=>{e.trim()},d1=()=>{const e=globalThis.Craft;if(typeof e?.t=="function")return(t,o,n)=>e.t(t,o,n)},p1=e=>{const{translationCategory:t,translate:o,hostBridge:n,portalClassName:i,portalContainer:s,shadowRootSelectors:r}=e;t&&u1(t),o??d1(),n&&Zh(n),i&&R2(i);const a={...s!==void 0?{portalContainer:s}:{},...r!==void 0?{shadowRootSelectors:r}:{}};(a.portalContainer!==void 0||a.shadowRootSelectors!==void 0)&&F2(a)},h1=Symbol("pluginKitConfig"),f1=Be({name:"PluginKitProvider",props:{translationCategory:{type:String,default:void 0},translate:{type:Function,default:void 0},hostBridge:{type:Object,default:void 0},portalClassName:{type:String,default:void 0},portalContainer:{type:Object,default:void 0},shadowRootSelectors:{type:Array,default:void 0}},setup(e,{slots:t}){const o={...e.translationCategory?{translationCategory:e.translationCategory}:{},...e.translate?{translate:e.translate}:{},...e.hostBridge?{hostBridge:e.hostBridge}:{},...e.portalClassName?{portalClassName:e.portalClassName}:{},...e.portalContainer!==void 0?{portalContainer:e.portalContainer}:{},...e.shadowRootSelectors?{shadowRootSelectors:e.shadowRootSelectors}:{}};return p1(o),il(h1,o),()=>t.default?.()}});const g1=["aria-label","onKeydown"],me=Be({__name:"HelpTip",props:{text:{},label:{}},setup(e){function t(o){o.currentTarget.closest("pk-tooltip")?.hide()}return(o,n)=>(D(),Fe(ot(n2),{class:"af-tooltip",content:e.text,placement:"top"},{default:yt(()=>[y("button",{slot:"trigger",type:"button",class:"af-help","aria-label":e.label,onKeydown:hs(bn(t,["stop"]),["esc"])},"?",40,g1)]),_:1},8,["content"]))}}),m1={class:"visually-hidden","aria-live":"polite"},v1=["aria-label","onPointerdown","onKeydown"],b1={width:"12",height:"18",viewBox:"0 0 12 18","aria-hidden":"true"},y1=["cx","cy"],k1=["aria-label","onClick"],ha=Be({__name:"SortableFields",props:{items:{},label:{}},emits:["reorder","remove"],setup(e,{emit:t}){const o=e,n=t,i=St(),s=St(-1),r=St(-1),a=St(""),l=new WeakMap;let u=0;function c(L){return l.has(L)||l.set(L,++u),l.get(L)}let d=0,m=!1;function h(L,z){L.button!==0||o.items.length<2||(L.preventDefault(),d=L.clientY,m=!1,s.value=z,r.value=z,L.currentTarget.setPointerCapture(L.pointerId))}function v(L){if(s.value<0||Math.abs(L.clientY-d)<5&&!m)return;m=!0;const K=[...i.value?.querySelectorAll(":scope > .af-sort-item")||[]].filter((B,V)=>V!==s.value);r.value=K.filter(B=>{const V=B.getBoundingClientRect();return L.clientY>V.top+V.height/2}).length,L.clientY<100&&window.scrollBy(0,-12),L.clientY>window.innerHeight-70&&window.scrollBy(0,12)}function w(L,z){L===z||z<0||z>=o.items.length||(n("reorder",L,z),a.value=`Field moved to position ${z+1} of ${o.items.length}.`)}function P(){m&&s.value>=0&&w(s.value,r.value),T()}function T(){s.value=-1,r.value=-1,m=!1}function N(L){return s.value<0||r.value===s.value?!1:r.value<s.value?L===r.value:L===r.value+1}return mi(T),(L,z)=>(D(),j("div",{ref_key:"root",ref:i,class:Yt(["af-sortable",{"af-sorting":s.value>=0}])},[y("p",m1,tt(a.value),1),(D(!0),j(dt,null,Gt(e.items,(K,B)=>(D(),j("div",{key:c(K),class:Yt(["af-sort-item",{"af-sort-item--dragging":s.value===B,"af-drop-before":N(B),"af-drop-after":s.value>=0&&r.value===e.items.length-1&&r.value!==s.value&&B===e.items.length-1}])},[y("button",{type:"button",class:"af-drag-handle","aria-label":`Reorder ${e.label} field ${B+1}`,title:"Drag to reorder. Use Up or Down arrows to move with the keyboard.",onPointerdown:V=>h(V,B),onPointermove:v,onPointerup:P,onPointercancel:T,onLostpointercapture:T,onKeydown:[hs(bn(V=>w(B,B-1),["prevent"]),["up"]),hs(bn(V=>w(B,B+1),["prevent"]),["down"])]},[(D(),j("svg",b1,[(D(),j(dt,null,Gt([[3,4],[9,4],[3,9],[9,9],[3,14],[9,14]],(V,nt)=>y("circle",{key:nt,cx:V[0],cy:V[1],r:"1.4",fill:"currentColor"},null,8,y1)),64))]))],40,v1),Qa(L.$slots,"default",{row:K,index:B}),y("button",{type:"button",class:"af-remove-field","aria-label":`Remove ${e.label} field ${B+1}`,title:"Remove field",onClick:V=>n("remove",B)},"×",8,k1)],2))),128))],2))}}),w1=Be({__name:"NativeFieldPicker",props:{open:{type:Boolean},anchor:{},label:{}},emits:["close","show","hidden"],setup(e,{emit:t}){const o=e,n=t,i=gd();let s;return Co(()=>o.open,async r=>{if(r&&o.anchor){if(await xo(),!o.open||(s=new window.Garnish.HUD(o.anchor,{hudClass:"hud fld-library-hud af-native-field-picker-hud",orientations:["right","bottom","left"],showOnInit:!1,listenToMainResize:!0,onHide:()=>n("close")}),i.value=s.$main[0],s.$hud.attr({role:"dialog","aria-label":o.label}),await xo(),!o.open||!s))return;s.show(),n("show")}else if(s){const a=s;s=void 0,a.hide(),i.value=void 0,await xo(),a.destroy(),n("hidden")}}),mi(()=>{s?.hide(),s?.destroy()}),(r,a)=>i.value?(D(),Fe(Ka,{key:0,to:i.value},[Qa(r.$slots,"default")],8,["to"])):it("",!0)}}),x1={key:0,class:"af-banner af-banner--error",role:"alert"},_1={class:"af-workflow-list"},S1={class:"af-workflow-list-tools"},C1={class:"texticon search icon"},E1={class:"select"},A1={key:0,class:"af-table-wrap"},$1={class:"data fullwidth af-workflow-table"},T1=["href"],P1={class:"af-list-scope"},M1={class:"af-menu"},z1=["aria-label"],L1={class:"af-menu-content"},O1=["href"],R1=["onClick"],I1={key:1,class:"af-empty"},F1=["disabled"],N1={key:0,class:"af-banner af-banner--error",role:"alert"},D1={key:1,class:"af-banner af-banner--error",role:"alert"},j1={style:{margin:"0","padding-left":"18px"}},U1={class:"af-card",id:"workflow-basics"},B1={class:"af-grid"},H1={key:0,class:"af-error"},V1={class:"select fullwidth"},q1={key:0},K1={class:"select fullwidth"},W1=["value"],G1={key:0,class:"af-error"},Y1={key:1},X1={class:"select fullwidth"},J1=["value"],Z1={key:0,class:"af-error"},Q1=["open"],t0={class:"af-grid"},e0={class:"af-inline-help"},o0={key:0,class:"af-error"},n0={class:"af-full"},i0={class:"select fullwidth"},s0=["value"],r0={class:"af-panel-header"},a0=["aria-expanded"],l0={class:"af-field-count"},c0={key:0,class:"af-shared-preview"},u0={class:"af-shared-instructions"},d0={key:0,class:"af-error"},p0={key:1,class:"af-muted"},h0=["open"],f0=["onClick"],g0=["innerHTML"],m0={class:"af-field-heading"},v0={key:0,class:"af-field-status af-field-status--error"},b0={key:1,class:"af-instruction-preview"},y0={class:"af-row-body"},k0={key:0,class:"af-error"},w0={class:"af-grid"},x0={class:"af-advanced"},_0={class:"af-toggle-list",style:{"margin-top":"12px"}},S0={key:0,class:"af-card",style:{"margin-top":"14px"}},C0={class:"af-grid"},E0={class:"af-toggle-list",style:{"margin-top":"10px"}},A0={class:"af-panel-header"},$0=["aria-expanded"],T0={class:"af-field-count"},P0={key:0,class:"af-inline-note"},M0=["open"],z0=["onClick"],L0=["innerHTML"],O0={class:"af-field-heading"},R0={key:0,class:"af-field-status af-field-status--error"},I0={key:1,class:"af-field-status af-field-status--attention"},F0={key:2,class:"af-instruction-preview"},N0={class:"af-row-body"},D0={key:0,class:"af-error"},j0={class:"af-prompt"},U0={key:1,class:"af-attention-note"},B0={class:"af-advanced"},H0={class:"af-behavior-grid"},V0={class:"af-label-line"},q0=["for"],K0={class:"select fullwidth"},W0=["id","value","onChange"],G0={class:"af-label-line"},Y0=["for"],X0={class:"select fullwidth"},J0=["id","value","onChange"],Z0={class:"af-row-options"},Q0={class:"af-label-line"},tg={key:0,class:"af-format-help"},eg={key:0,class:"af-toggle-list"},og={key:1,class:"af-grid",style:{"margin-top":"14px"}},ng={class:"select fullwidth"},ig=["onUpdate:modelValue"],sg={key:0},rg={key:2,class:"af-card"},ag={class:"af-label"},lg={class:"select fullwidth"},cg=["onUpdate:modelValue"],ug={key:0},dg={key:3,class:"af-card"},pg={class:"af-grid"},hg={class:"af-toggle-list",style:{"margin-top":"10px"}},fg={key:1,class:"af-inline-note"},gg={class:"af-card af-editor-options",id:"workflow-placement"},mg={class:"af-grid"},vg={class:"af-placement-options"},bg={class:"af-label-line"},yg={class:"af-placement-help"},kg={class:"fld-library af-native-field-picker"},wg={class:"texticon search icon"},xg={class:"fld-field-library"},_g=["disabled","onClick"],Sg=["innerHTML"],Cg={class:"field-name"},Eg={class:"fld-element-label"},Ag={key:0,class:"fld-attribute"},$g={key:0,class:"light"},Tg=Be({__name:"WorkflowApp",props:{options:{}},setup(e){const t=St(),o=St(null),n=St(null),i=St(),s=St(""),r=St();let a=null,l;function u(k){n.value||(!(k.target instanceof Element)||!k.target.closest(".af-builder-panel"))&&oe(null)}Ja(()=>{m||document.addEventListener("pointerdown",u);const k=document.querySelector("#header");k&&(l=new ResizeObserver(()=>t.value?.style.setProperty("--af-header-offset",`${k.getBoundingClientRect().height}px`)),l.observe(k))}),mi(()=>{l?.disconnect(),document.removeEventListener("pointerdown",u)});const d=e.options||{},m=d.screen==="list",h=yo(d.workflow||{id:null,handle:"",name:"",scope:"entry",entryTypeUid:"",volumeUid:"",modelConfigUid:"",globalPrompt:"",actionButtonLabel:"",showUserPromptInput:!0,showOnSidebar:!1,rows:[],contextRows:[]}),v=St(d.workflows||[]),w=St([]),P=St(!1),T=St(d.metadataFields||[]),N=St(!1),L=St(""),z=St({}),K=Qe(()=>w.value.filter(k=>!k.contextOnly)),B=Qe(()=>w.value),V=Qe(()=>(n.value==="context"?B.value:K.value).filter(k=>`${k.name} ${k.handle||""}`.toLowerCase().includes(s.value.trim().toLowerCase()))),nt=Qe(()=>[{label:"Built-in fields",fields:V.value.filter(k=>k.uid.startsWith("__"))},{label:"Custom fields",fields:V.value.filter(k=>!k.uid.startsWith("__"))}].filter(k=>k.fields.length)),Z=Qe(()=>h.scope==="entry"?h.entryTypeUid:h.volumeUid),Q=St(""),wt=St(""),Vt=Qe(()=>v.value.filter(k=>(!wt.value||k.scope===wt.value)&&`${k.name} ${k.handle} ${k.entryTypeName||""} ${k.volumeName||""}`.toLowerCase().includes(Q.value.toLowerCase().trim())));function ht(k){return!!Z.value&&P.value&&!w.value.some(p=>p.uid===k)}function xt(k){return k.enabled!==!1&&!k.prompt?.trim()}function Lt(k){return w.value.find(p=>p.uid===k)?.iconSvg||""}function at(k,p){return w.value.find(f=>f.uid===k)?.name||(k?"Unavailable field":p)}function X(k){return h.contextRows.some(p=>p.fieldUid===k)?"Already in context":h.rows.some(p=>p.targetFieldUid===k)?"Already in outputs":""}function W(k,p=!0){return k==null?p:k===!0||k===1||k==="1"}function ft(){return{targetFieldUid:"",prompt:"",requiresApproval:!0,includeCurrentFieldValue:!0,overrideCurrentValue:!0,enabled:!0,seomatic:{includeSeoTitle:!0,includeSiteNamePosition:!0,includeSeoDescription:!0,includeSeoKeywords:!0},related:{mode:"topN",topN:25,forceUseCurrentValues:!1},link:{entry:{mode:"topN",count:10},category:{mode:"topN",count:10},asset:{mode:"topN",count:10}},assets:{metadata:["title","filename"],includeFile:!1,maxFiles:3}}}function Pe(){h.rows=(h.rows||[]).map(k=>({...ft(),...k,seomatic:{...ft().seomatic,...k.seomatic||{}},related:{...ft().related,...k.related||{}},link:{...ft().link,...k.link||{}},assets:{...ft().assets,...k.assets||{}}})),h.contextRows=(h.contextRows||[]).map(k=>({fieldUid:"",prompt:"",enabled:!0,...k,assets:{metadata:["title","filename"],includeFile:!1,maxFiles:1,...k.assets||{}}}))}Pe();const At=yo(new Set),_t=yo(new Set);h.rows.forEach((k,p)=>{(!h.id||p===0)&&At.add(k)}),h.contextRows.forEach(k=>{h.id||_t.add(k)});function Wo(k,p){const f=k==="context"?_t:At,O=o.value===k&&f.has(p);oe(k),O?f.delete(p):f.add(p)}function oe(k){o.value=k,k!=="output"&&At.clear(),k!=="context"&&_t.clear()}async function Mi(k){await xo();const f=t.value?.querySelector(k==="context"?"#workflow-source":"#workflow-outputs")?.querySelector(".af-sort-item:last-child");f?.scrollIntoView({behavior:"instant",block:"nearest"}),f?.querySelector("pk-textarea, textarea")?.focus({preventScroll:!0})}function Me(k,p){i.value=p.currentTarget,oe(k),s.value="",n.value=k}function ho(k){Me("output",k)}function Go(k){Me("context",k)}function Tn(k){const p=n.value;!p||X(k.uid)||(oe(p),p==="output"?(h.rows.push({...ft(),targetFieldUid:k.uid}),At.add(h.rows[h.rows.length-1])):(h.contextRows.push({fieldUid:k.uid,prompt:"",enabled:!0,assets:{metadata:["title","filename"],includeFile:!1,maxFiles:1}}),_t.add(h.contextRows[h.contextRows.length-1])),a=p,n.value=null)}function qe(){if(!a)return;const k=a;a=null,Mi(k)}function zi(k){const p=k.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");return p&&!/^[a-z]/.test(p)?`workflow-${p}`:p}Co(()=>h.name,(k,p)=>{!h.id&&(!h.handle||h.handle===zi(p))&&(h.handle=zi(k))});function g(k){return["seomatic","entries","categories","tags","link","assets"].includes(b(k.targetFieldUid))}function b(k){return w.value.find(p=>p.uid===k)?.adapter||""}function _(k){return["entries","categories","tags"].includes(b(k.targetFieldUid))}function M(k){return b(k.fieldUid)==="assets"||k.fieldUid==="__asset__:file"}function S(k){return z.value[k]?.[0]||""}async function $(k,p){const f=await fetch(k,{method:p===void 0?"GET":"POST",headers:p===void 0?{Accept:"application/json"}:{"Content-Type":"application/json",Accept:"application/json","X-CSRF-Token":window.Craft?.csrfTokenValue||""},body:p===void 0?void 0:JSON.stringify(p),credentials:"same-origin"}),O=await f.json();if(!f.ok||O.success===!1)throw Object.assign(new Error(O.error||`Request failed (${f.status})`),{payload:O});return O}async function F(){if(w.value=[],P.value=!1,!(!Z.value||!d.fieldsUrl))try{const k=await $(d.fieldsUrl,{scope:h.scope,entryTypeUid:h.entryTypeUid,volumeUid:h.volumeUid});w.value=Array.isArray(k.fields)?k.fields:[],P.value=!0,T.value=Array.isArray(k.metadataFields)?k.metadataFields:[]}catch(k){L.value=k.message||"Could not load fields for this scope."}}Co(Z,F,{immediate:!0});async function I(){N.value=!0,z.value={},L.value="";try{const k=JSON.parse(JSON.stringify(h));k.rows=k.rows.map(f=>({...f,requiresApproval:W(f.requiresApproval),includeCurrentFieldValue:W(f.includeCurrentFieldValue),overrideCurrentValue:W(f.overrideCurrentValue),enabled:W(f.enabled),seomatic:Object.fromEntries(Object.entries(f.seomatic||{}).map(([O,C])=>[O,W(C)])),related:{...f.related,forceUseCurrentValues:W(f.related?.forceUseCurrentValues,!1)}})),k.contextRows=k.contextRows.map(f=>({...f,enabled:W(f.enabled)}));const p=await $(d.saveUrl,{workflow:k});if(window.Craft?.cp?.displayNotice("Workflow saved."),p.workflow){const f=h.rows.map((C,Y)=>At.has(C)?Y:-1),O=h.contextRows.map((C,Y)=>_t.has(C)?Y:-1);Object.assign(h,p.workflow),At.clear(),_t.clear(),f.forEach(C=>{h.rows[C]&&At.add(h.rows[C])}),O.forEach(C=>{h.contextRows[C]&&_t.add(h.contextRows[C])})}window.history.replaceState({},"",p.editUrl||d.editUrl||window.location.href)}catch(k){const p=k.payload?.errors;p&&typeof p=="object"&&(z.value=p),L.value=k.message||"Could not save this workflow."}finally{N.value=!1}}async function R(k){if(window.confirm(`Delete “${k.name}”? Fields that reference this handle will no longer show Autofill until a workflow with the same handle exists.`))try{await $(d.deleteUrl,{id:k.id}),v.value=v.value.filter(p=>p.id!==k.id)}catch(p){L.value=p.message||"Could not delete workflow."}}function A(k,p,f,O=!1){const C=f.target.value;k[p]=O?Number(C):String(C??"")}return(k,p)=>(D(),j("main",{ref_key:"page",ref:t,class:Yt(["af-page",{"af-editor":!m}])},[m?(D(),j(dt,{key:0},[L.value?(D(),j("div",x1,tt(L.value),1)):it("",!0),y("section",_1,[y("div",S1,[y("div",C1,[re(y("input",{class:"text fullwidth",type:"search","aria-label":"Search workflows",placeholder:"Search workflows","onUpdate:modelValue":p[0]||(p[0]=f=>Q.value=f)},null,512),[[Dr,Q.value]])]),y("div",E1,[re(y("select",{"aria-label":"Content type","onUpdate:modelValue":p[1]||(p[1]=f=>wt.value=f)},[...p[24]||(p[24]=[y("option",{value:""},"All workflows",-1),y("option",{value:"entry"},"Entries",-1),y("option",{value:"asset"},"Assets",-1)])],512),[[Ge,wt.value]])])]),Vt.value.length?(D(),j("div",A1,[y("table",$1,[p[25]||(p[25]=y("thead",null,[y("tr",null,[y("th",null,"Name"),y("th",null,"Applies to"),y("th",null,[y("span",{class:"visually-hidden"},"Actions")])])],-1)),y("tbody",null,[(D(!0),j(dt,null,Gt(Vt.value,f=>(D(),j("tr",{key:f.id},[y("td",null,[y("a",{href:`${ot(d).editBaseUrl}/${encodeURIComponent(f.handle)}`},tt(f.name),9,T1)]),y("td",null,[gt(tt(f.scope==="asset"?f.volumeName||"Unavailable volume":f.entryTypeName||"Unavailable entry type")+" ",1),y("span",P1,"· "+tt(f.scope==="asset"?"Assets":"Entries"),1)]),y("td",null,[y("details",M1,[y("summary",{"aria-label":`Actions for ${f.name}`},"•••",8,z1),y("div",L1,[y("a",{href:`${ot(d).editBaseUrl}/${encodeURIComponent(f.handle)}`},"Edit workflow",8,O1),y("button",{type:"button",class:"af-danger",onClick:O=>R(f)},"Delete workflow",8,R1)])])])]))),128))])])])):(D(),j("div",I1,[y("p",null,tt(v.value.length?"No matching workflows.":"No workflows yet."),1),v.value.length?(D(),j("button",{key:0,type:"button",class:"btn",onClick:p[2]||(p[2]=f=>{Q.value="",wt.value=""})},"Clear filters")):it("",!0)]))])],64)):(D(),j(dt,{key:1},[(D(),Fe(Ka,{to:"#autofill-workflow-actions"},[y("button",{type:"button",class:"btn submit",disabled:N.value,onClick:I},tt(N.value?"Saving…":"Save workflow"),9,F1)])),L.value?(D(),j("div",N1,tt(L.value),1)):it("",!0),Object.keys(z.value).length?(D(),j("div",D1,[y("ul",j1,[(D(!0),j(dt,null,Gt(z.value,(f,O)=>(D(),j("li",{key:O},tt(f.join(" ")),1))),128))])])):it("",!0),y("section",U1,[p[36]||(p[36]=y("div",{class:"af-section-title"},[y("span",{class:"af-step"},"1"),y("div",null,[y("h2",null,"Basics")])],-1)),y("div",B1,[y("div",null,[H(ot(Je),{class:"af-control",label:"Name",value:h.name,placeholder:"For example, Product descriptions",autocomplete:"off",onInput:p[3]||(p[3]=f=>A(h,"name",f))},null,8,["value"]),S("name")?(D(),j("span",H1,tt(S("name")),1)):it("",!0)]),y("label",null,[p[27]||(p[27]=y("span",{class:"af-label"},"Applies to",-1)),y("div",V1,[re(y("select",{"onUpdate:modelValue":p[4]||(p[4]=f=>h.scope=f)},[...p[26]||(p[26]=[y("option",{value:"entry"},"Entries",-1),y("option",{value:"asset"},"Assets",-1)])],512),[[Ge,h.scope]])])]),h.scope==="entry"?(D(),j("label",q1,[p[29]||(p[29]=y("span",{class:"af-label"},"Entry type",-1)),y("div",K1,[re(y("select",{"onUpdate:modelValue":p[5]||(p[5]=f=>h.entryTypeUid=f)},[p[28]||(p[28]=y("option",{value:""},"Select an entry type",-1)),(D(!0),j(dt,null,Gt(ot(d).entryTypes,f=>(D(),j("option",{key:f.uid,value:f.uid},tt(f.name),9,W1))),128))],512),[[Ge,h.entryTypeUid]])]),S("entryTypeUid")?(D(),j("span",G1,tt(S("entryTypeUid")),1)):it("",!0)])):(D(),j("label",Y1,[p[31]||(p[31]=y("span",{class:"af-label"},"Asset volume",-1)),y("div",X1,[re(y("select",{"onUpdate:modelValue":p[6]||(p[6]=f=>h.volumeUid=f)},[p[30]||(p[30]=y("option",{value:""},"Select an asset volume",-1)),(D(!0),j(dt,null,Gt(ot(d).volumes,f=>(D(),j("option",{key:f.uid,value:f.uid},tt(f.name),9,J1))),128))],512),[[Ge,h.volumeUid]])]),S("volumeUid")?(D(),j("span",Z1,tt(S("volumeUid")),1)):it("",!0)]))]),y("details",{class:"af-advanced",open:!!z.value.handle},[p[35]||(p[35]=y("summary",null,"Advanced",-1)),y("div",t0,[y("div",null,[H(ot(Je),{class:"af-control code",label:"Handle",value:h.handle,placeholder:"product-descriptions",autocomplete:"off",onInput:p[7]||(p[7]=f=>A(h,"handle",f))},null,8,["value"]),y("span",e0,[H(me,{label:"About workflow handles",text:"For new workflows, this is filled from the name. Autofill fields connect to this handle. Changing it can leave existing fields disconnected until their references are updated."})]),S("handle")?(D(),j("span",o0,tt(S("handle")),1)):it("",!0)]),p[34]||(p[34]=gt()),y("label",n0,[p[33]||(p[33]=y("span",{class:"af-label"},"Model configuration",-1)),y("div",i0,[re(y("select",{"onUpdate:modelValue":p[8]||(p[8]=f=>h.modelConfigUid=f)},[p[32]||(p[32]=y("option",{value:""},"Use the default configured model",-1)),(D(!0),j(dt,null,Gt(ot(d).modelConfigs,f=>(D(),j("option",{key:f.uid,value:f.uid},tt(f.label||f.modelId||f.provider),9,s0))),128))],512),[[Ge,h.modelConfigUid]])])])])],8,Q1)]),y("div",{class:Yt(["af-builder",`af-builder--${o.value}`])},[y("section",{class:Yt(["af-card af-builder-panel",{"af-panel--active":o.value==="context"}]),id:"workflow-source",onClick:p[13]||(p[13]=f=>oe("context"))},[y("div",r0,[y("h2",null,[y("button",{type:"button",class:"af-panel-tab","aria-expanded":o.value==="context",onClick:p[9]||(p[9]=f=>oe("context"))},[p[37]||(p[37]=y("svg",{class:"af-role-icon",viewBox:"0 0 20 20",fill:"none",stroke:"currentColor","stroke-width":"1.5","aria-hidden":"true"},[y("path",{d:"M10 5C7 3 4 3 2 4v12c2-1 5-1 8 1 3-2 6-2 8-1V4c-2-1-5-1-8 1Zm0 0v12"})],-1)),p[38]||(p[38]=gt("Context ",-1)),y("span",l0,tt(h.contextRows.length),1)],8,a0),H(me,{label:"About context fields",text:"These fields supply information to the model. Autofill does not change their values. Select a field to edit its instructions."})]),H(ot(da),{variant:"secondary",disabled:!Z.value,onClick:Go},{default:yt(()=>[...p[39]||(p[39]=[gt("Add field",-1)])]),_:1},8,["disabled"])]),o.value!=="context"&&h.globalPrompt?.trim()?(D(),j("p",c0,[p[40]||(p[40]=y("span",null,"Shared instructions",-1)),gt(tt(h.globalPrompt),1)])):it("",!0),re(y("div",u0,[H(ot(Xi),{class:"af-control",label:"Shared instructions (optional)",rows:"2",value:h.globalPrompt,placeholder:"Shared tone, quality, or compliance instructions",onInput:p[10]||(p[10]=f=>A(h,"globalPrompt",f))},null,8,["value"]),S("globalPrompt")?(D(),j("span",d0,tt(S("globalPrompt")),1)):it("",!0)],512),[[Lp,o.value==="context"]]),Z.value?it("",!0):(D(),j("p",p0,"Choose a scope above to load context fields.")),H(ha,{items:h.contextRows,label:"context",onReorder:p[11]||(p[11]=(f,O)=>h.contextRows.splice(O,0,h.contextRows.splice(f,1)[0])),onRemove:p[12]||(p[12]=f=>h.contextRows.splice(f,1))},{default:yt(({row:f,index:O})=>[y("details",{class:Yt(["af-row",{"af-field--error":ht(f.fieldUid)}]),open:o.value==="context"&&_t.has(f)},[y("summary",{class:"af-row-head af-context-summary",onClick:bn(C=>Wo("context",f),["prevent","stop"])},[Lt(f.fieldUid)?(D(),j("span",{key:0,class:"cp-icon medium af-field-type-icon","aria-hidden":"true",innerHTML:Lt(f.fieldUid)},null,8,g0)):it("",!0),y("div",m0,[y("strong",null,tt(at(f.fieldUid,"Unassigned context field")),1),ht(f.fieldUid)?(D(),j("span",v0,"Unavailable")):f.prompt?.trim()?(D(),j("span",b0,tt(f.prompt),1)):it("",!0)])],8,f0),y("div",y0,[ht(f.fieldUid)?(D(),j("p",k0,"This field is unavailable in the selected layout. Remove this card and add a replacement field.")):it("",!0),y("div",w0,[y("div",null,[H(ot(Xi),{class:"af-control",label:"Instructions (optional)",rows:"2",value:f.prompt,placeholder:"How should the model interpret this field?",onInput:C=>A(f,"prompt",C)},null,8,["value","onInput"])])]),y("details",x0,[p[46]||(p[46]=y("summary",null,"Advanced",-1)),y("div",_0,[H(ot(Ut),{class:"af-toggle",checked:f.enabled,"onUpdate:checked":C=>f.enabled=C},{default:yt(()=>[...p[41]||(p[41]=[gt("Row enabled",-1)])]),_:1},8,["checked","onUpdate:checked"])]),M(f)?(D(),j("div",S0,[p[44]||(p[44]=y("strong",null,"Asset content",-1)),p[45]||(p[45]=y("details",{class:"af-format-help"},[y("summary",null,"Supported formats and file limits"),y("p",null,"Reads the first N selected assets in field order, up to the per-field limit below (1–20). Content support depends on the provider and model: JPEG, PNG, GIF, WebP, text/*, JSON, XML, and RTF are supported; PDFs are supported except with DeepSeek. Unsupported content stops the whole run. Each file is limited to 10 MiB, with a 20 MiB combined limit.")],-1)),y("div",C0,[H(ot(Ut),{class:"af-toggle",checked:f.assets.includeFile,"onUpdate:checked":C=>f.assets.includeFile=C},{default:yt(()=>[...p[42]||(p[42]=[gt("Include file content",-1)])]),_:1},8,["checked","onUpdate:checked"]),y("div",null,[H(ot(Je),{class:"af-control",label:"Maximum assets",type:"number",min:"1",max:"20",value:f.assets.maxFiles,onInput:C=>A(f.assets,"maxFiles",C,!0)},null,8,["value","onInput"])])]),y("div",E0,[p[43]||(p[43]=y("span",{class:"af-label"},"Metadata",-1)),(D(!0),j(dt,null,Gt(T.value,C=>(D(),Fe(ot(Ut),{key:C.key,class:"af-toggle",checked:f.assets.metadata.includes(C.key),"onUpdate:checked":Y=>f.assets.metadata=Y?[...new Set([...f.assets.metadata,C.key])]:f.assets.metadata.filter(et=>et!==C.key)},{default:yt(()=>[gt(tt(C.label),1)]),_:2},1032,["checked","onUpdate:checked"]))),128))])])):it("",!0)])])],10,h0)]),_:1},8,["items"])],2),y("section",{class:Yt(["af-card af-builder-panel",{"af-panel--active":o.value==="output"}]),id:"workflow-outputs",onClick:p[17]||(p[17]=f=>oe("output"))},[y("div",A0,[y("h2",null,[y("button",{type:"button",class:"af-panel-tab","aria-expanded":o.value==="output",onClick:p[14]||(p[14]=f=>oe("output"))},[p[47]||(p[47]=y("svg",{class:"af-role-icon",viewBox:"0 0 20 20",fill:"none",stroke:"currentColor","stroke-width":"1.5","aria-hidden":"true"},[y("path",{d:"m4 12 9-9 4 4-9 9-5 1 1-5Zm7-7 4 4M4 12l4 4"})],-1)),p[48]||(p[48]=gt("Output fields ",-1)),y("span",T0,tt(h.rows.length),1)],8,$0),H(me,{label:"About output fields",text:"Choose the fields Autofill will write, then give each one instructions. Drag the handles to reorder fields. Review and replacement rules are under Advanced."})]),H(ot(da),{variant:"secondary",disabled:!Z.value,onClick:ho},{default:yt(()=>[...p[49]||(p[49]=[gt("Add field",-1)])]),_:1},8,["disabled"])]),Z.value?it("",!0):(D(),j("p",P0,"Choose an entry type or asset volume in Basics to see its fields.")),H(ha,{items:h.rows,label:"output",onReorder:p[15]||(p[15]=(f,O)=>h.rows.splice(O,0,h.rows.splice(f,1)[0])),onRemove:p[16]||(p[16]=f=>h.rows.splice(f,1))},{default:yt(({row:f,index:O})=>[y("details",{class:Yt(["af-output",{"af-output--disabled":!f.enabled,"af-field--error":ht(f.targetFieldUid),"af-field--attention":!ht(f.targetFieldUid)&&xt(f)}]),open:o.value==="output"&&At.has(f)},[y("summary",{class:"af-output-summary",onClick:bn(C=>Wo("output",f),["prevent","stop"])},[Lt(f.targetFieldUid)?(D(),j("span",{key:0,class:"cp-icon medium af-field-type-icon","aria-hidden":"true",innerHTML:Lt(f.targetFieldUid)},null,8,L0)):it("",!0),y("span",O0,[y("strong",null,tt(at(f.targetFieldUid,"Unassigned output field")),1),ht(f.targetFieldUid)?(D(),j("span",R0,"Unavailable")):xt(f)?(D(),j("span",I0,"Needs instructions")):f.prompt?.trim()?(D(),j("span",F0,tt(f.prompt),1)):it("",!0)])],8,z0),y("div",N0,[ht(f.targetFieldUid)?(D(),j("p",D0,"This field is unavailable in the selected layout. Remove this card and add a replacement field.")):it("",!0),y("div",j0,[H(ot(Xi),{class:"af-control",label:"Instructions",value:f.prompt,rows:"2",placeholder:"For example, Write a concise product summary using only facts from the source information.",onInput:C=>A(f,"prompt",C)},null,8,["value","onInput"])]),!ht(f.targetFieldUid)&&xt(f)?(D(),j("p",U0,"Add instructions so Autofill knows what to write.")):it("",!0),y("details",B0,[p[69]||(p[69]=y("summary",null,"Advanced",-1)),y("div",H0,[y("div",null,[y("span",V0,[y("label",{class:"af-label",for:`af-review-${O}`},"Apply suggestions",8,q0),H(me,{label:"About review requirements",text:"Review before applying lets an editor inspect and edit the suggestion. Automatic application saves eligible suggestions without opening the review dialog."})]),y("div",K0,[y("select",{id:`af-review-${O}`,value:f.requiresApproval?"review":"automatic",onChange:C=>f.requiresApproval=C.target.value==="review"},[...p[50]||(p[50]=[y("option",{value:"review"},"Review before applying",-1),y("option",{value:"automatic"},"Apply automatically",-1)])],40,W0)])]),y("div",null,[y("span",G0,[y("label",{class:"af-label",for:`af-existing-${O}`},"Existing content",8,Y0),H(me,{label:"About replacing existing content",text:"Only fill empty fields preserves existing content. Replace existing content allows an accepted or automatically applied suggestion to change it."})]),y("div",X0,[y("select",{id:`af-existing-${O}`,value:f.overrideCurrentValue?"replace":"empty",onChange:C=>f.overrideCurrentValue=C.target.value==="replace"},[...p[51]||(p[51]=[y("option",{value:"empty"},"Only fill empty fields",-1),y("option",{value:"replace"},"Replace existing content",-1)])],40,J0)])])]),y("div",Z0,[y("div",Q0,[H(ot(Ut),{class:"af-toggle",checked:f.includeCurrentFieldValue,"onUpdate:checked":C=>f.includeCurrentFieldValue=C},{default:yt(()=>[...p[52]||(p[52]=[gt("Use the current value as context",-1)])]),_:1},8,["checked","onUpdate:checked"]),H(me,{label:"About current values as context",text:"Includes this field's current content in the AI instructions. This is separate from whether Autofill may replace the value."})]),H(ot(Ut),{class:"af-toggle",checked:f.enabled,"onUpdate:checked":C=>f.enabled=C},{default:yt(()=>[...p[53]||(p[53]=[gt("Output enabled",-1)])]),_:1},8,["checked","onUpdate:checked"])]),g(f)?(D(),j("details",tg,[p[68]||(p[68]=y("summary",null,"Field-specific options",-1)),b(f.targetFieldUid)==="seomatic"?(D(),j("div",eg,[p[58]||(p[58]=y("strong",null,"SEO prompt includes",-1)),H(ot(Ut),{class:"af-toggle",checked:f.seomatic.includeSeoTitle,"onUpdate:checked":C=>f.seomatic.includeSeoTitle=C},{default:yt(()=>[...p[54]||(p[54]=[gt("SEO title and source",-1)])]),_:1},8,["checked","onUpdate:checked"]),H(ot(Ut),{class:"af-toggle",checked:f.seomatic.includeSiteNamePosition,"onUpdate:checked":C=>f.seomatic.includeSiteNamePosition=C},{default:yt(()=>[...p[55]||(p[55]=[gt("Site name position and source",-1)])]),_:1},8,["checked","onUpdate:checked"]),H(ot(Ut),{class:"af-toggle",checked:f.seomatic.includeSeoDescription,"onUpdate:checked":C=>f.seomatic.includeSeoDescription=C},{default:yt(()=>[...p[56]||(p[56]=[gt("SEO description and source",-1)])]),_:1},8,["checked","onUpdate:checked"]),H(ot(Ut),{class:"af-toggle",checked:f.seomatic.includeSeoKeywords,"onUpdate:checked":C=>f.seomatic.includeSeoKeywords=C},{default:yt(()=>[...p[57]||(p[57]=[gt("SEO keywords and source",-1)])]),_:1},8,["checked","onUpdate:checked"])])):it("",!0),_(f)?(D(),j("div",og,[y("label",null,[p[60]||(p[60]=y("span",{class:"af-label"},"Related selection",-1)),y("div",ng,[re(y("select",{"onUpdate:modelValue":C=>f.related.mode=C},[...p[59]||(p[59]=[y("option",{value:"topN"},"Top N",-1),y("option",{value:"all"},"All",-1)])],8,ig),[[Ge,f.related.mode]])])]),f.related.mode==="topN"?(D(),j("div",sg,[H(ot(Je),{class:"af-control",label:"Top N",type:"number",min:"1",max:"500",value:f.related.topN,onInput:C=>A(f.related,"topN",C,!0)},null,8,["value","onInput"])])):it("",!0),H(ot(Ut),{class:"af-toggle",checked:f.related.forceUseCurrentValues,"onUpdate:checked":C=>f.related.forceUseCurrentValues=C},{default:yt(()=>[...p[61]||(p[61]=[gt("Keep selected related items first",-1)])]),_:1},8,["checked","onUpdate:checked"])])):it("",!0),b(f.targetFieldUid)==="link"?(D(),j("div",rg,[p[63]||(p[63]=y("strong",null,"Link candidate scope",-1)),(D(),j(dt,null,Gt(["entry","category","asset"],C=>y("div",{key:C,class:"af-grid",style:{"margin-top":"12px"}},[y("label",null,[y("span",ag,tt(C)+" links",1),y("div",lg,[re(y("select",{"onUpdate:modelValue":Y=>f.link[C].mode=Y},[...p[62]||(p[62]=[y("option",{value:"topN"},"Top N",-1),y("option",{value:"mostRecent"},"Most recent",-1),y("option",{value:"all"},"All",-1),y("option",{value:"none"},"None",-1)])],8,cg),[[Ge,f.link[C].mode]])])]),["all","none"].includes(f.link[C].mode)?it("",!0):(D(),j("div",ug,[H(ot(Je),{class:"af-control",label:"Candidate count",type:"number",min:"1",max:"250",value:f.link[C].count,onInput:Y=>A(f.link[C],"count",Y,!0)},null,8,["value","onInput"])]))])),64))])):it("",!0),b(f.targetFieldUid)==="assets"?(D(),j("div",dg,[p[66]||(p[66]=y("strong",null,"Asset context",-1)),p[67]||(p[67]=y("details",{class:"af-format-help"},[y("summary",null,"Supported formats and file limits"),y("p",null,"Reads the first N selected assets in field order, up to the per-field limit below (1–20). Content support depends on the provider and model: JPEG, PNG, GIF, WebP, text/*, JSON, XML, and RTF are supported; PDFs are supported except with DeepSeek. Unsupported content stops the whole run. Each file is limited to 10 MiB, with a 20 MiB combined limit.")],-1)),y("div",pg,[H(ot(Ut),{class:"af-toggle",checked:f.assets.includeFile,"onUpdate:checked":C=>f.assets.includeFile=C},{default:yt(()=>[...p[64]||(p[64]=[gt("Include file content",-1)])]),_:1},8,["checked","onUpdate:checked"]),y("div",null,[H(ot(Je),{class:"af-control",label:"Maximum assets",type:"number",min:"1",max:"20",value:f.assets.maxFiles,onInput:C=>A(f.assets,"maxFiles",C,!0)},null,8,["value","onInput"])])]),y("div",hg,[p[65]||(p[65]=y("span",{class:"af-label"},"Metadata",-1)),(D(!0),j(dt,null,Gt(T.value,C=>(D(),Fe(ot(Ut),{key:C.key,class:"af-toggle",checked:f.assets.metadata.includes(C.key),"onUpdate:checked":Y=>f.assets.metadata=Y?[...new Set([...f.assets.metadata,C.key])]:f.assets.metadata.filter(et=>et!==C.key)},{default:yt(()=>[gt(tt(C.label),1)]),_:2},1032,["checked","onUpdate:checked"]))),128))])])):it("",!0)])):it("",!0)])])],10,M0)]),_:1},8,["items"]),h.rows.length?it("",!0):(D(),j("p",fg,"Add an output field to tell Autofill what to write."))],2)],2),y("details",gg,[y("summary",null,[p[70]||(p[70]=gt("Editor options ",-1)),H(me,{label:"About editor options",text:"Customize the Autofill button, sidebar placement, and whether editors can add instructions at run time."})]),y("div",mg,[y("div",null,[H(ot(Je),{class:"af-control",label:"Action button label",value:h.actionButtonLabel,placeholder:"Autofill",onInput:p[18]||(p[18]=f=>A(h,"actionButtonLabel",f))},null,8,["value"])]),y("div",vg,[H(ot(Ut),{class:"af-toggle",checked:h.showUserPromptInput,"onUpdate:checked":p[19]||(p[19]=f=>h.showUserPromptInput=f)},{default:yt(()=>[...p[71]||(p[71]=[gt("Let editors add a prompt",-1)])]),_:1},8,["checked"]),y("div",bg,[H(ot(Ut),{class:"af-toggle",checked:h.showOnSidebar,"onUpdate:checked":p[20]||(p[20]=f=>h.showOnSidebar=f)},{default:yt(()=>[gt(tt(h.scope==="entry"?"Show this workflow in the entry sidebar":"Show this workflow in the asset sidebar"),1)]),_:1},8,["checked"]),H(me,{label:"About sidebar placement",text:"Shows the workflow on matching content editors, independently of any inline Autofill field. Both placements can be used together."})])])]),y("div",yg,[H(me,{label:"About inline placement",text:"To place Autofill beside a particular field, add an Autofill field to the layout and reference this workflow’s handle."})])]),H(w1,{open:n.value!==null,anchor:i.value,label:n.value==="context"?"Add context field":"Add output field",onClose:p[22]||(p[22]=f=>n.value=null),onShow:p[23]||(p[23]=f=>r.value?.focus()),onHidden:qe},{default:yt(()=>[y("div",kg,[y("div",wg,[re(y("input",{ref_key:"fieldSearchInput",ref:r,"onUpdate:modelValue":p[21]||(p[21]=f=>s.value=f),class:"text fullwidth",type:"search","aria-label":"Search fields",placeholder:"Search",autocomplete:"off"},null,512),[[Dr,s.value]])]),y("div",xg,[(D(!0),j(dt,null,Gt(nt.value,f=>(D(),j("div",{key:f.label,class:"fld-field-group"},[y("h6",null,tt(f.label),1),(D(!0),j(dt,null,Gt(f.fields,O=>(D(),j("button",{key:O.uid,type:"button",class:"fld-element fld-field af-native-field-choice",disabled:!!X(O.uid),onClick:C=>Tn(O)},[O.iconSvg?(D(),j("span",{key:0,class:"cp-icon medium","aria-hidden":"true",innerHTML:O.iconSvg},null,8,Sg)):it("",!0),y("span",Cg,[y("span",Eg,[y("h4",null,tt(O.name)+tt(n.value==="output"&&O.availableInLiteVersion===!1?" · Pro":""),1)]),X(O.uid)||O.handle?(D(),j("span",Ag,[y("span",{class:Yt(["smalltext light fld-attribute-label",{code:!X(O.uid)}])},tt(X(O.uid)||O.handle),3)])):it("",!0)])],8,_g))),128))]))),128)),V.value.length?it("",!0):(D(),j("p",$g,tt(s.value?"No matching fields.":"No fields available for this content type."),1))])])]),_:1},8,["open","anchor","label"])],64))],2))}});window.AutofillPluginKitDialog=P2;for(const e of document.querySelectorAll("[data-autofill-vue-root]")){const t=JSON.parse(e.dataset.options||"{}");Qp({setup:()=>()=>Fo(f1,{translationCategory:"autofill"},{default:()=>Fo(Tg,{options:t})})}).mount(e)}
