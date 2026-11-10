/**
* @vue/shared v3.5.22
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Us(e){const t=Object.create(null);for(const o of e.split(","))t[o]=1;return o=>o in t}const ct={},Ao=[],be=()=>{},Ua=()=>!1,Cn=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),Hs=e=>e.startsWith("onUpdate:"),Ot=Object.assign,Vs=(e,t)=>{const o=e.indexOf(t);o>-1&&e.splice(o,1)},ou=Object.prototype.hasOwnProperty,rt=(e,t)=>ou.call(e,t),G=Array.isArray,$o=e=>Di(e)==="[object Map]",An=e=>Di(e)==="[object Set]",Ir=e=>Di(e)==="[object Date]",X=e=>typeof e=="function",wt=e=>typeof e=="string",re=e=>typeof e=="symbol",dt=e=>e!==null&&typeof e=="object",Ha=e=>(dt(e)||X(e))&&X(e.then)&&X(e.catch),Va=Object.prototype.toString,Di=e=>Va.call(e),iu=e=>Di(e).slice(8,-1),qa=e=>Di(e)==="[object Object]",qs=e=>wt(e)&&e!=="NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e,fi=Us(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),$n=e=>{const t=Object.create(null);return(o=>t[o]||(t[o]=e(o)))},nu=/-\w/g,We=$n(e=>e.replace(nu,t=>t.slice(1).toUpperCase())),su=/\B([A-Z])/g,Xe=$n(e=>e.replace(su,"-$1").toLowerCase()),Ka=$n(e=>e.charAt(0).toUpperCase()+e.slice(1)),Qn=$n(e=>e?`on${Ka(e)}`:""),Ke=(e,t)=>!Object.is(e,t),Xi=(e,...t)=>{for(let o=0;o<e.length;o++)e[o](...t)},Wa=(e,t,o,i=!1)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:i,value:o})},sn=e=>{const t=parseFloat(e);return isNaN(t)?e:t};let Dr;const Tn=()=>Dr||(Dr=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function Ks(e){if(G(e)){const t={};for(let o=0;o<e.length;o++){const i=e[o],n=wt(i)?cu(i):Ks(i);if(n)for(const s in n)t[s]=n[s]}return t}else if(wt(e)||dt(e))return e}const ru=/;(?![^(]*\))/g,au=/:([^]+)/,lu=/\/\*[^]*?\*\//g;function cu(e){const t={};return e.replace(lu,"").split(ru).forEach(o=>{if(o){const i=o.split(au);i.length>1&&(t[i[0].trim()]=i[1].trim())}}),t}function ne(e){let t="";if(wt(e))t=e;else if(G(e))for(let o=0;o<e.length;o++){const i=ne(e[o]);i&&(t+=i+" ")}else if(dt(e))for(const o in e)e[o]&&(t+=o+" ");return t.trim()}const du="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",uu=Us(du);function Ga(e){return!!e||e===""}function pu(e,t){if(e.length!==t.length)return!1;let o=!0;for(let i=0;o&&i<e.length;i++)o=zn(e[i],t[i]);return o}function zn(e,t){if(e===t)return!0;let o=Ir(e),i=Ir(t);if(o||i)return o&&i?e.getTime()===t.getTime():!1;if(o=re(e),i=re(t),o||i)return e===t;if(o=G(e),i=G(t),o||i)return o&&i?pu(e,t):!1;if(o=dt(e),i=dt(t),o||i){if(!o||!i)return!1;const n=Object.keys(e).length,s=Object.keys(t).length;if(n!==s)return!1;for(const r in e){const a=e.hasOwnProperty(r),l=t.hasOwnProperty(r);if(a&&!l||!a&&l||!zn(e[r],t[r]))return!1}}return String(e)===String(t)}function hu(e,t){return e.findIndex(o=>zn(o,t))}const Ya=e=>!!(e&&e.__v_isRef===!0),nt=e=>wt(e)?e:e==null?"":G(e)||dt(e)&&(e.toString===Va||!X(e.toString))?Ya(e)?nt(e.value):JSON.stringify(e,Xa,2):String(e),Xa=(e,t)=>Ya(t)?Xa(e,t.value):$o(t)?{[`Map(${t.size})`]:[...t.entries()].reduce((o,[i,n],s)=>(o[ts(i,s)+" =>"]=n,o),{})}:An(t)?{[`Set(${t.size})`]:[...t.values()].map(o=>ts(o))}:re(t)?ts(t):dt(t)&&!G(t)&&!qa(t)?String(t):t,ts=(e,t="")=>{var o;return re(e)?`Symbol(${(o=e.description)!=null?o:t})`:e};/**
* @vue/reactivity v3.5.22
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Vt;class fu{constructor(t=!1){this.detached=t,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.parent=Vt,!t&&Vt&&(this.index=(Vt.scopes||(Vt.scopes=[])).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let t,o;if(this.scopes)for(t=0,o=this.scopes.length;t<o;t++)this.scopes[t].pause();for(t=0,o=this.effects.length;t<o;t++)this.effects[t].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let t,o;if(this.scopes)for(t=0,o=this.scopes.length;t<o;t++)this.scopes[t].resume();for(t=0,o=this.effects.length;t<o;t++)this.effects[t].resume()}}run(t){if(this._active){const o=Vt;try{return Vt=this,t()}finally{Vt=o}}}on(){++this._on===1&&(this.prevScope=Vt,Vt=this)}off(){this._on>0&&--this._on===0&&(Vt=this.prevScope,this.prevScope=void 0)}stop(t){if(this._active){this._active=!1;let o,i;for(o=0,i=this.effects.length;o<i;o++)this.effects[o].stop();for(this.effects.length=0,o=0,i=this.cleanups.length;o<i;o++)this.cleanups[o]();if(this.cleanups.length=0,this.scopes){for(o=0,i=this.scopes.length;o<i;o++)this.scopes[o].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!t){const n=this.parent.scopes.pop();n&&n!==this&&(this.parent.scopes[this.index]=n,n.index=this.index)}this.parent=void 0}}}function gu(){return Vt}let ut;const es=new WeakSet;class Ja{constructor(t){this.fn=t,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,Vt&&Vt.active&&Vt.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,es.has(this)&&(es.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Qa(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Fr(this),tl(this);const t=ut,o=se;ut=this,se=!0;try{return this.fn()}finally{el(this),ut=t,se=o,this.flags&=-3}}stop(){if(this.flags&1){for(let t=this.deps;t;t=t.nextDep)Ys(t);this.deps=this.depsTail=void 0,Fr(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?es.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){ks(this)&&this.run()}get dirty(){return ks(this)}}let Za=0,gi,mi;function Qa(e,t=!1){if(e.flags|=8,t){e.next=mi,mi=e;return}e.next=gi,gi=e}function Ws(){Za++}function Gs(){if(--Za>0)return;if(mi){let t=mi;for(mi=void 0;t;){const o=t.next;t.next=void 0,t.flags&=-9,t=o}}let e;for(;gi;){let t=gi;for(gi=void 0;t;){const o=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(i){e||(e=i)}t=o}}if(e)throw e}function tl(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function el(e){let t,o=e.depsTail,i=o;for(;i;){const n=i.prevDep;i.version===-1?(i===o&&(o=n),Ys(i),mu(i)):t=i,i.dep.activeLink=i.prevActiveLink,i.prevActiveLink=void 0,i=n}e.deps=t,e.depsTail=o}function ks(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(ol(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function ol(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===Si)||(e.globalVersion=Si,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!ks(e))))return;e.flags|=2;const t=e.dep,o=ut,i=se;ut=e,se=!0;try{tl(e);const n=e.fn(e._value);(t.version===0||Ke(n,e._value))&&(e.flags|=128,e._value=n,t.version++)}catch(n){throw t.version++,n}finally{ut=o,se=i,el(e),e.flags&=-3}}function Ys(e,t=!1){const{dep:o,prevSub:i,nextSub:n}=e;if(i&&(i.nextSub=n,e.prevSub=void 0),n&&(n.prevSub=i,e.nextSub=void 0),o.subs===e&&(o.subs=i,!i&&o.computed)){o.computed.flags&=-5;for(let s=o.computed.deps;s;s=s.nextDep)Ys(s,!0)}!t&&!--o.sc&&o.map&&o.map.delete(o.key)}function mu(e){const{prevDep:t,nextDep:o}=e;t&&(t.nextDep=o,e.prevDep=void 0),o&&(o.prevDep=t,e.nextDep=void 0)}let se=!0;const il=[];function Re(){il.push(se),se=!1}function Ie(){const e=il.pop();se=e===void 0?!0:e}function Fr(e){const{cleanup:t}=e;if(e.cleanup=void 0,t){const o=ut;ut=void 0;try{t()}finally{ut=o}}}let Si=0;class vu{constructor(t,o){this.sub=t,this.dep=o,this.version=o.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class Xs{constructor(t){this.computed=t,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(t){if(!ut||!se||ut===this.computed)return;let o=this.activeLink;if(o===void 0||o.sub!==ut)o=this.activeLink=new vu(ut,this),ut.deps?(o.prevDep=ut.depsTail,ut.depsTail.nextDep=o,ut.depsTail=o):ut.deps=ut.depsTail=o,nl(o);else if(o.version===-1&&(o.version=this.version,o.nextDep)){const i=o.nextDep;i.prevDep=o.prevDep,o.prevDep&&(o.prevDep.nextDep=i),o.prevDep=ut.depsTail,o.nextDep=void 0,ut.depsTail.nextDep=o,ut.depsTail=o,ut.deps===o&&(ut.deps=i)}return o}trigger(t){this.version++,Si++,this.notify(t)}notify(t){Ws();try{for(let o=this.subs;o;o=o.prevSub)o.sub.notify()&&o.sub.dep.notify()}finally{Gs()}}}function nl(e){if(e.dep.sc++,e.sub.flags&4){const t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let i=t.deps;i;i=i.nextDep)nl(i)}const o=e.dep.subs;o!==e&&(e.prevSub=o,o&&(o.nextSub=e)),e.dep.subs=e}}const ws=new WeakMap,ao=Symbol(""),xs=Symbol(""),Ei=Symbol("");function Pt(e,t,o){if(se&&ut){let i=ws.get(e);i||ws.set(e,i=new Map);let n=i.get(o);n||(i.set(o,n=new Xs),n.map=i,n.key=o),n.track()}}function ze(e,t,o,i,n,s){const r=ws.get(e);if(!r){Si++;return}const a=l=>{l&&l.trigger()};if(Ws(),t==="clear")r.forEach(a);else{const l=G(e),d=l&&qs(o);if(l&&o==="length"){const u=Number(i);r.forEach((p,c)=>{(c==="length"||c===Ei||!re(c)&&c>=u)&&a(p)})}else switch((o!==void 0||r.has(void 0))&&a(r.get(o)),d&&a(r.get(Ei)),t){case"add":l?d&&a(r.get("length")):(a(r.get(ao)),$o(e)&&a(r.get(xs)));break;case"delete":l||(a(r.get(ao)),$o(e)&&a(r.get(xs)));break;case"set":$o(e)&&a(r.get(ao));break}}Gs()}function wo(e){const t=st(e);return t===e?t:(Pt(t,"iterate",Ei),te(e)?t:t.map($t))}function Pn(e){return Pt(e=st(e),"iterate",Ei),e}const bu={__proto__:null,[Symbol.iterator](){return os(this,Symbol.iterator,$t)},concat(...e){return wo(this).concat(...e.map(t=>G(t)?wo(t):t))},entries(){return os(this,"entries",e=>(e[1]=$t(e[1]),e))},every(e,t){return Ee(this,"every",e,t,void 0,arguments)},filter(e,t){return Ee(this,"filter",e,t,o=>o.map($t),arguments)},find(e,t){return Ee(this,"find",e,t,$t,arguments)},findIndex(e,t){return Ee(this,"findIndex",e,t,void 0,arguments)},findLast(e,t){return Ee(this,"findLast",e,t,$t,arguments)},findLastIndex(e,t){return Ee(this,"findLastIndex",e,t,void 0,arguments)},forEach(e,t){return Ee(this,"forEach",e,t,void 0,arguments)},includes(...e){return is(this,"includes",e)},indexOf(...e){return is(this,"indexOf",e)},join(e){return wo(this).join(e)},lastIndexOf(...e){return is(this,"lastIndexOf",e)},map(e,t){return Ee(this,"map",e,t,void 0,arguments)},pop(){return li(this,"pop")},push(...e){return li(this,"push",e)},reduce(e,...t){return Nr(this,"reduce",e,t)},reduceRight(e,...t){return Nr(this,"reduceRight",e,t)},shift(){return li(this,"shift")},some(e,t){return Ee(this,"some",e,t,void 0,arguments)},splice(...e){return li(this,"splice",e)},toReversed(){return wo(this).toReversed()},toSorted(e){return wo(this).toSorted(e)},toSpliced(...e){return wo(this).toSpliced(...e)},unshift(...e){return li(this,"unshift",e)},values(){return os(this,"values",$t)}};function os(e,t,o){const i=Pn(e),n=i[t]();return i!==e&&!te(e)&&(n._next=n.next,n.next=()=>{const s=n._next();return s.done||(s.value=o(s.value)),s}),n}const yu=Array.prototype;function Ee(e,t,o,i,n,s){const r=Pn(e),a=r!==e&&!te(e),l=r[t];if(l!==yu[t]){const p=l.apply(e,s);return a?$t(p):p}let d=o;r!==e&&(a?d=function(p,c){return o.call(this,$t(p),c,e)}:o.length>2&&(d=function(p,c){return o.call(this,p,c,e)}));const u=l.call(r,d,i);return a&&n?n(u):u}function Nr(e,t,o,i){const n=Pn(e);let s=o;return n!==e&&(te(e)?o.length>3&&(s=function(r,a,l){return o.call(this,r,a,l,e)}):s=function(r,a,l){return o.call(this,r,$t(a),l,e)}),n[t](s,...i)}function is(e,t,o){const i=st(e);Pt(i,"iterate",Ei);const n=i[t](...o);return(n===-1||n===!1)&&Qs(o[0])?(o[0]=st(o[0]),i[t](...o)):n}function li(e,t,o=[]){Re(),Ws();const i=st(e)[t].apply(e,o);return Gs(),Ie(),i}const ku=Us("__proto__,__v_isRef,__isVue"),sl=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!=="arguments"&&e!=="caller").map(e=>Symbol[e]).filter(re));function wu(e){re(e)||(e=String(e));const t=st(this);return Pt(t,"has",e),t.hasOwnProperty(e)}class rl{constructor(t=!1,o=!1){this._isReadonly=t,this._isShallow=o}get(t,o,i){if(o==="__v_skip")return t.__v_skip;const n=this._isReadonly,s=this._isShallow;if(o==="__v_isReactive")return!n;if(o==="__v_isReadonly")return n;if(o==="__v_isShallow")return s;if(o==="__v_raw")return i===(n?s?Pu:dl:s?cl:ll).get(t)||Object.getPrototypeOf(t)===Object.getPrototypeOf(i)?t:void 0;const r=G(t);if(!n){let l;if(r&&(l=bu[o]))return l;if(o==="hasOwnProperty")return wu}const a=Reflect.get(t,o,Lt(t)?t:i);if((re(o)?sl.has(o):ku(o))||(n||Pt(t,"get",o),s))return a;if(Lt(a)){const l=r&&qs(o)?a:a.value;return n&&dt(l)?Ss(l):l}return dt(a)?n?Ss(a):To(a):a}}class al extends rl{constructor(t=!1){super(!1,t)}set(t,o,i,n){let s=t[o];if(!this._isShallow){const l=Ge(s);if(!te(i)&&!Ge(i)&&(s=st(s),i=st(i)),!G(t)&&Lt(s)&&!Lt(i))return l||(s.value=i),!0}const r=G(t)&&qs(o)?Number(o)<t.length:rt(t,o),a=Reflect.set(t,o,i,Lt(t)?t:n);return t===st(n)&&(r?Ke(i,s)&&ze(t,"set",o,i):ze(t,"add",o,i)),a}deleteProperty(t,o){const i=rt(t,o);t[o];const n=Reflect.deleteProperty(t,o);return n&&i&&ze(t,"delete",o,void 0),n}has(t,o){const i=Reflect.has(t,o);return(!re(o)||!sl.has(o))&&Pt(t,"has",o),i}ownKeys(t){return Pt(t,"iterate",G(t)?"length":ao),Reflect.ownKeys(t)}}class xu extends rl{constructor(t=!1){super(!0,t)}set(t,o){return!0}deleteProperty(t,o){return!0}}const _u=new al,Su=new xu,Eu=new al(!0);const _s=e=>e,qi=e=>Reflect.getPrototypeOf(e);function Cu(e,t,o){return function(...i){const n=this.__v_raw,s=st(n),r=$o(s),a=e==="entries"||e===Symbol.iterator&&r,l=e==="keys"&&r,d=n[e](...i),u=o?_s:t?rn:$t;return!t&&Pt(s,"iterate",l?xs:ao),{next(){const{value:p,done:c}=d.next();return c?{value:p,done:c}:{value:a?[u(p[0]),u(p[1])]:u(p),done:c}},[Symbol.iterator](){return this}}}}function Ki(e){return function(...t){return e==="delete"?!1:e==="clear"?void 0:this}}function Au(e,t){const o={get(n){const s=this.__v_raw,r=st(s),a=st(n);e||(Ke(n,a)&&Pt(r,"get",n),Pt(r,"get",a));const{has:l}=qi(r),d=t?_s:e?rn:$t;if(l.call(r,n))return d(s.get(n));if(l.call(r,a))return d(s.get(a));s!==r&&s.get(n)},get size(){const n=this.__v_raw;return!e&&Pt(st(n),"iterate",ao),n.size},has(n){const s=this.__v_raw,r=st(s),a=st(n);return e||(Ke(n,a)&&Pt(r,"has",n),Pt(r,"has",a)),n===a?s.has(n):s.has(n)||s.has(a)},forEach(n,s){const r=this,a=r.__v_raw,l=st(a),d=t?_s:e?rn:$t;return!e&&Pt(l,"iterate",ao),a.forEach((u,p)=>n.call(s,d(u),d(p),r))}};return Ot(o,e?{add:Ki("add"),set:Ki("set"),delete:Ki("delete"),clear:Ki("clear")}:{add(n){!t&&!te(n)&&!Ge(n)&&(n=st(n));const s=st(this);return qi(s).has.call(s,n)||(s.add(n),ze(s,"add",n,n)),this},set(n,s){!t&&!te(s)&&!Ge(s)&&(s=st(s));const r=st(this),{has:a,get:l}=qi(r);let d=a.call(r,n);d||(n=st(n),d=a.call(r,n));const u=l.call(r,n);return r.set(n,s),d?Ke(s,u)&&ze(r,"set",n,s):ze(r,"add",n,s),this},delete(n){const s=st(this),{has:r,get:a}=qi(s);let l=r.call(s,n);l||(n=st(n),l=r.call(s,n)),a&&a.call(s,n);const d=s.delete(n);return l&&ze(s,"delete",n,void 0),d},clear(){const n=st(this),s=n.size!==0,r=n.clear();return s&&ze(n,"clear",void 0,void 0),r}}),["keys","values","entries",Symbol.iterator].forEach(n=>{o[n]=Cu(n,e,t)}),o}function Js(e,t){const o=Au(e,t);return(i,n,s)=>n==="__v_isReactive"?!e:n==="__v_isReadonly"?e:n==="__v_raw"?i:Reflect.get(rt(o,n)&&n in i?o:i,n,s)}const $u={get:Js(!1,!1)},Tu={get:Js(!1,!0)},zu={get:Js(!0,!1)};const ll=new WeakMap,cl=new WeakMap,dl=new WeakMap,Pu=new WeakMap;function Mu(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function Lu(e){return e.__v_skip||!Object.isExtensible(e)?0:Mu(iu(e))}function To(e){return Ge(e)?e:Zs(e,!1,_u,$u,ll)}function Ou(e){return Zs(e,!1,Eu,Tu,cl)}function Ss(e){return Zs(e,!0,Su,zu,dl)}function Zs(e,t,o,i,n){if(!dt(e)||e.__v_raw&&!(t&&e.__v_isReactive))return e;const s=Lu(e);if(s===0)return e;const r=n.get(e);if(r)return r;const a=new Proxy(e,s===2?i:o);return n.set(e,a),a}function zo(e){return Ge(e)?zo(e.__v_raw):!!(e&&e.__v_isReactive)}function Ge(e){return!!(e&&e.__v_isReadonly)}function te(e){return!!(e&&e.__v_isShallow)}function Qs(e){return e?!!e.__v_raw:!1}function st(e){const t=e&&e.__v_raw;return t?st(t):e}function Ru(e){return!rt(e,"__v_skip")&&Object.isExtensible(e)&&Wa(e,"__v_skip",!0),e}const $t=e=>dt(e)?To(e):e,rn=e=>dt(e)?Ss(e):e;function Lt(e){return e?e.__v_isRef===!0:!1}function At(e){return ul(e,!1)}function Iu(e){return ul(e,!0)}function ul(e,t){return Lt(e)?e:new Du(e,t)}class Du{constructor(t,o){this.dep=new Xs,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=o?t:st(t),this._value=o?t:$t(t),this.__v_isShallow=o}get value(){return this.dep.track(),this._value}set value(t){const o=this._rawValue,i=this.__v_isShallow||te(t)||Ge(t);t=i?t:st(t),Ke(t,o)&&(this._rawValue=t,this._value=i?t:$t(t),this.dep.trigger())}}function tt(e){return Lt(e)?e.value:e}const Fu={get:(e,t,o)=>t==="__v_raw"?e:tt(Reflect.get(e,t,o)),set:(e,t,o,i)=>{const n=e[t];return Lt(n)&&!Lt(o)?(n.value=o,!0):Reflect.set(e,t,o,i)}};function pl(e){return zo(e)?e:new Proxy(e,Fu)}class Nu{constructor(t,o,i){this.fn=t,this.setter=o,this._value=void 0,this.dep=new Xs(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Si-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!o,this.isSSR=i}notify(){if(this.flags|=16,!(this.flags&8)&&ut!==this)return Qa(this,!0),!0}get value(){const t=this.dep.track();return ol(this),t&&(t.version=this.dep.version),this._value}set value(t){this.setter&&this.setter(t)}}function ju(e,t,o=!1){let i,n;return X(e)?i=e:(i=e.get,n=e.set),new Nu(i,n,o)}const Wi={},an=new WeakMap;let no;function Bu(e,t=!1,o=no){if(o){let i=an.get(o);i||an.set(o,i=[]),i.push(e)}}function Uu(e,t,o=ct){const{immediate:i,deep:n,once:s,scheduler:r,augmentJob:a,call:l}=o,d=M=>n?M:te(M)||n===!1||n===0?Pe(M,1):Pe(M);let u,p,c,v,y=!1,x=!1;if(Lt(e)?(p=()=>e.value,y=te(e)):zo(e)?(p=()=>d(e),y=!0):G(e)?(x=!0,y=e.some(M=>zo(M)||te(M)),p=()=>e.map(M=>{if(Lt(M))return M.value;if(zo(M))return d(M);if(X(M))return l?l(M,2):M()})):X(e)?t?p=l?()=>l(e,2):e:p=()=>{if(c){Re();try{c()}finally{Ie()}}const M=no;no=u;try{return l?l(e,3,[v]):e(v)}finally{no=M}}:p=be,t&&n){const M=p,V=n===!0?1/0:n;p=()=>Pe(M(),V)}const C=gu(),A=()=>{u.stop(),C&&C.active&&Vs(C.effects,u)};if(s&&t){const M=t;t=(...V)=>{M(...V),A()}}let D=x?new Array(e.length).fill(Wi):Wi;const L=M=>{if(!(!(u.flags&1)||!u.dirty&&!M))if(t){const V=u.run();if(n||y||(x?V.some((B,q)=>Ke(B,D[q])):Ke(V,D))){c&&c();const B=no;no=u;try{const q=[V,D===Wi?void 0:x&&D[0]===Wi?[]:D,v];D=V,l?l(t,3,q):t(...q)}finally{no=B}}}else u.run()};return a&&a(L),u=new Ja(p),u.scheduler=r?()=>r(L,!1):L,v=M=>Bu(M,!1,u),c=u.onStop=()=>{const M=an.get(u);if(M){if(l)l(M,4);else for(const V of M)V();an.delete(u)}},t?i?L(!0):D=u.run():r?r(L.bind(null,!0),!0):u.run(),A.pause=u.pause.bind(u),A.resume=u.resume.bind(u),A.stop=A,A}function Pe(e,t=1/0,o){if(t<=0||!dt(e)||e.__v_skip||(o=o||new Map,(o.get(e)||0)>=t))return e;if(o.set(e,t),t--,Lt(e))Pe(e.value,t,o);else if(G(e))for(let i=0;i<e.length;i++)Pe(e[i],t,o);else if(An(e)||$o(e))e.forEach(i=>{Pe(i,t,o)});else if(qa(e)){for(const i in e)Pe(e[i],t,o);for(const i of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,i)&&Pe(e[i],t,o)}return e}/**
* @vue/runtime-core v3.5.22
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Fi(e,t,o,i){try{return i?e(...i):e()}catch(n){Mn(n,t,o)}}function ye(e,t,o,i){if(X(e)){const n=Fi(e,t,o,i);return n&&Ha(n)&&n.catch(s=>{Mn(s,t,o)}),n}if(G(e)){const n=[];for(let s=0;s<e.length;s++)n.push(ye(e[s],t,o,i));return n}}function Mn(e,t,o,i=!0){const n=t?t.vnode:null,{errorHandler:s,throwUnhandledErrorInProduction:r}=t&&t.appContext.config||ct;if(t){let a=t.parent;const l=t.proxy,d=`https://vuejs.org/error-reference/#runtime-${o}`;for(;a;){const u=a.ec;if(u){for(let p=0;p<u.length;p++)if(u[p](e,l,d)===!1)return}a=a.parent}if(s){Re(),Fi(s,null,10,[e,l,d]),Ie();return}}Hu(e,o,n,i,r)}function Hu(e,t,o,i=!0,n=!1){if(n)throw e;console.error(e)}const Nt=[];let fe=-1;const Po=[];let Ue=null,So=0;const hl=Promise.resolve();let ln=null;function Mo(e){const t=ln||hl;return e?t.then(this?e.bind(this):e):t}function Vu(e){let t=fe+1,o=Nt.length;for(;t<o;){const i=t+o>>>1,n=Nt[i],s=Ci(n);s<e||s===e&&n.flags&2?t=i+1:o=i}return t}function tr(e){if(!(e.flags&1)){const t=Ci(e),o=Nt[Nt.length-1];!o||!(e.flags&2)&&t>=Ci(o)?Nt.push(e):Nt.splice(Vu(t),0,e),e.flags|=1,fl()}}function fl(){ln||(ln=hl.then(ml))}function qu(e){G(e)?Po.push(...e):Ue&&e.id===-1?Ue.splice(So+1,0,e):e.flags&1||(Po.push(e),e.flags|=1),fl()}function jr(e,t,o=fe+1){for(;o<Nt.length;o++){const i=Nt[o];if(i&&i.flags&2){if(e&&i.id!==e.uid)continue;Nt.splice(o,1),o--,i.flags&4&&(i.flags&=-2),i(),i.flags&4||(i.flags&=-2)}}}function gl(e){if(Po.length){const t=[...new Set(Po)].sort((o,i)=>Ci(o)-Ci(i));if(Po.length=0,Ue){Ue.push(...t);return}for(Ue=t,So=0;So<Ue.length;So++){const o=Ue[So];o.flags&4&&(o.flags&=-2),o.flags&8||o(),o.flags&=-2}Ue=null,So=0}}const Ci=e=>e.id==null?e.flags&2?-1:1/0:e.id;function ml(e){try{for(fe=0;fe<Nt.length;fe++){const t=Nt[fe];t&&!(t.flags&8)&&(t.flags&4&&(t.flags&=-2),Fi(t,t.i,t.i?15:14),t.flags&4||(t.flags&=-2))}}finally{for(;fe<Nt.length;fe++){const t=Nt[fe];t&&(t.flags&=-2)}fe=-1,Nt.length=0,gl(),ln=null,(Nt.length||Po.length)&&ml()}}let Mt=null,vl=null;function cn(e){const t=Mt;return Mt=e,vl=e&&e.type.__scopeId||null,t}function ft(e,t=Mt,o){if(!t||e._n)return e;const i=(...n)=>{i._d&&pn(-1);const s=cn(t);let r;try{r=e(...n)}finally{cn(s),i._d&&pn(1)}return r};return i._n=!0,i._c=!0,i._d=!0,i}function Ce(e,t){if(Mt===null)return e;const o=Dn(Mt),i=e.dirs||(e.dirs=[]);for(let n=0;n<t.length;n++){let[s,r,a,l=ct]=t[n];s&&(X(s)&&(s={mounted:s,updated:s}),s.deep&&Pe(r),i.push({dir:s,instance:o,value:r,oldValue:void 0,arg:a,modifiers:l}))}return e}function Qe(e,t,o,i){const n=e.dirs,s=t&&t.dirs;for(let r=0;r<n.length;r++){const a=n[r];s&&(a.oldValue=s[r].value);let l=a.dir[i];l&&(Re(),ye(l,o,8,[e.el,a,e,t]),Ie())}}const bl=Symbol("_vte"),Ku=e=>e.__isTeleport,vi=e=>e&&(e.disabled||e.disabled===""),Br=e=>e&&(e.defer||e.defer===""),Ur=e=>typeof SVGElement<"u"&&e instanceof SVGElement,Hr=e=>typeof MathMLElement=="function"&&e instanceof MathMLElement,Es=(e,t)=>{const o=e&&e.to;return wt(o)?t?t(o):null:o},yl={name:"Teleport",__isTeleport:!0,process(e,t,o,i,n,s,r,a,l,d){const{mc:u,pc:p,pbc:c,o:{insert:v,querySelector:y,createText:x,createComment:C}}=d,A=vi(t.props);let{shapeFlag:D,children:L,dynamicChildren:M}=t;if(e==null){const V=t.el=x(""),B=t.anchor=x("");v(V,o,i),v(B,o,i);const q=(at,et)=>{D&16&&u(L,at,et,n,s,r,a,l)},it=()=>{const at=t.target=Es(t.props,y),et=wl(at,t,x,v);at&&(r!=="svg"&&Ur(at)?r="svg":r!=="mathml"&&Hr(at)&&(r="mathml"),n&&n.isCE&&(n.ce._teleportTargets||(n.ce._teleportTargets=new Set)).add(at),A||(q(at,et),Ji(t,!1)))};A&&(q(o,B),Ji(t,!0)),Br(t.props)?(t.el.__isMounted=!1,Ft(()=>{it(),delete t.el.__isMounted},s)):it()}else{if(Br(t.props)&&e.el.__isMounted===!1){Ft(()=>{yl.process(e,t,o,i,n,s,r,a,l,d)},s);return}t.el=e.el,t.targetStart=e.targetStart;const V=t.anchor=e.anchor,B=t.target=e.target,q=t.targetAnchor=e.targetAnchor,it=vi(e.props),at=it?o:B,et=it?V:q;if(r==="svg"||Ur(B)?r="svg":(r==="mathml"||Hr(B))&&(r="mathml"),M?(c(e.dynamicChildren,M,at,n,s,r,a),nr(e,t,!0)):l||p(e,t,at,et,n,s,r,a,!1),A)it?t.props&&e.props&&t.props.to!==e.props.to&&(t.props.to=e.props.to):Gi(t,o,V,d,1);else if((t.props&&t.props.to)!==(e.props&&e.props.to)){const Tt=t.target=Es(t.props,y);Tt&&Gi(t,Tt,null,d,0)}else it&&Gi(t,B,q,d,1);Ji(t,A)}},remove(e,t,o,{um:i,o:{remove:n}},s){const{shapeFlag:r,children:a,anchor:l,targetStart:d,targetAnchor:u,target:p,props:c}=e;if(p&&(n(d),n(u)),s&&n(l),r&16){const v=s||!vi(c);for(let y=0;y<a.length;y++){const x=a[y];i(x,t,o,v,!!x.dynamicChildren)}}},move:Gi,hydrate:Wu};function Gi(e,t,o,{o:{insert:i},m:n},s=2){s===0&&i(e.targetAnchor,t,o);const{el:r,anchor:a,shapeFlag:l,children:d,props:u}=e,p=s===2;if(p&&i(r,t,o),(!p||vi(u))&&l&16)for(let c=0;c<d.length;c++)n(d[c],t,o,2);p&&i(a,t,o)}function Wu(e,t,o,i,n,s,{o:{nextSibling:r,parentNode:a,querySelector:l,insert:d,createText:u}},p){function c(x,C,A,D){C.anchor=p(r(x),C,a(x),o,i,n,s),C.targetStart=A,C.targetAnchor=D}const v=t.target=Es(t.props,l),y=vi(t.props);if(v){const x=v._lpa||v.firstChild;if(t.shapeFlag&16)if(y)c(e,t,x,x&&r(x));else{t.anchor=r(e);let C=x;for(;C;){if(C&&C.nodeType===8){if(C.data==="teleport start anchor")t.targetStart=C;else if(C.data==="teleport anchor"){t.targetAnchor=C,v._lpa=t.targetAnchor&&r(t.targetAnchor);break}}C=r(C)}t.targetAnchor||wl(v,t,u,d),p(x&&r(x),t,v,o,i,n,s)}Ji(t,y)}else y&&t.shapeFlag&16&&c(e,t,e,r(e));return t.anchor&&r(t.anchor)}const kl=yl;function Ji(e,t){const o=e.ctx;if(o&&o.ut){let i,n;for(t?(i=e.el,n=e.anchor):(i=e.targetStart,n=e.targetAnchor);i&&i!==n;)i.nodeType===1&&i.setAttribute("data-v-owner",o.uid),i=i.nextSibling;o.ut()}}function wl(e,t,o,i){const n=t.targetStart=o(""),s=t.targetAnchor=o("");return n[bl]=s,e&&(i(n,e),i(s,e)),s}const Gu=Symbol("_leaveCb");function er(e,t){e.shapeFlag&6&&e.component?(e.transition=t,er(e.component.subTree,t)):e.shapeFlag&128?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t}function Fe(e,t){return X(e)?Ot({name:e.name},t,{setup:e}):e}function xl(e){e.ids=[e.ids[0]+e.ids[2]+++"-",0,0]}const dn=new WeakMap;function bi(e,t,o,i,n=!1){if(G(e)){e.forEach((y,x)=>bi(y,t&&(G(t)?t[x]:t),o,i,n));return}if(Lo(i)&&!n){i.shapeFlag&512&&i.type.__asyncResolved&&i.component.subTree.component&&bi(e,t,o,i.component.subTree);return}const s=i.shapeFlag&4?Dn(i.component):i.el,r=n?null:s,{i:a,r:l}=e,d=t&&t.r,u=a.refs===ct?a.refs={}:a.refs,p=a.setupState,c=st(p),v=p===ct?Ua:y=>rt(c,y);if(d!=null&&d!==l){if(Vr(t),wt(d))u[d]=null,v(d)&&(p[d]=null);else if(Lt(d)){d.value=null;const y=t;y.k&&(u[y.k]=null)}}if(X(l))Fi(l,a,12,[r,u]);else{const y=wt(l),x=Lt(l);if(y||x){const C=()=>{if(e.f){const A=y?v(l)?p[l]:u[l]:l.value;if(n)G(A)&&Vs(A,s);else if(G(A))A.includes(s)||A.push(s);else if(y)u[l]=[s],v(l)&&(p[l]=u[l]);else{const D=[s];l.value=D,e.k&&(u[e.k]=D)}}else y?(u[l]=r,v(l)&&(p[l]=r)):x&&(l.value=r,e.k&&(u[e.k]=r))};if(r){const A=()=>{C(),dn.delete(e)};A.id=-1,dn.set(e,A),Ft(A,o)}else Vr(e),C()}}}function Vr(e){const t=dn.get(e);t&&(t.flags|=8,dn.delete(e))}Tn().requestIdleCallback;Tn().cancelIdleCallback;const Lo=e=>!!e.type.__asyncLoader,_l=e=>e.type.__isKeepAlive;function Yu(e,t){Sl(e,"a",t)}function Xu(e,t){Sl(e,"da",t)}function Sl(e,t,o=jt){const i=e.__wdc||(e.__wdc=()=>{let n=o;for(;n;){if(n.isDeactivated)return;n=n.parent}return e()});if(Ln(t,i,o),o){let n=o.parent;for(;n&&n.parent;)_l(n.parent.vnode)&&Ju(i,t,o,n),n=n.parent}}function Ju(e,t,o,i){const n=Ln(t,e,i,!0);Cl(()=>{Vs(i[t],n)},o)}function Ln(e,t,o=jt,i=!1){if(o){const n=o[e]||(o[e]=[]),s=t.__weh||(t.__weh=(...r)=>{Re();const a=Ni(o),l=ye(t,o,e,r);return a(),Ie(),l});return i?n.unshift(s):n.push(s),s}}const Ne=e=>(t,o=jt)=>{(!Ti||e==="sp")&&Ln(e,(...i)=>t(...i),o)},Zu=Ne("bm"),El=Ne("m"),Qu=Ne("bu"),tp=Ne("u"),On=Ne("bum"),Cl=Ne("um"),ep=Ne("sp"),op=Ne("rtg"),ip=Ne("rtc");function np(e,t=jt){Ln("ec",e,t)}const sp=Symbol.for("v-ndc");function ie(e,t,o,i){let n;const s=o,r=G(e);if(r||wt(e)){const a=r&&zo(e);let l=!1,d=!1;a&&(l=!te(e),d=Ge(e),e=Pn(e)),n=new Array(e.length);for(let u=0,p=e.length;u<p;u++)n[u]=t(l?d?rn($t(e[u])):$t(e[u]):e[u],u,void 0,s)}else if(typeof e=="number"){n=new Array(e);for(let a=0;a<e;a++)n[a]=t(a+1,a,void 0,s)}else if(dt(e))if(e[Symbol.iterator])n=Array.from(e,(a,l)=>t(a,l,void 0,s));else{const a=Object.keys(e);n=new Array(a.length);for(let l=0,d=a.length;l<d;l++){const u=a[l];n[l]=t(e[u],u,l,s)}}else n=[];return n}function Al(e,t,o={},i,n){if(Mt.ce||Mt.parent&&Lo(Mt.parent)&&Mt.parent.ce){const d=Object.keys(o).length>0;return F(),Gt(mt,null,[K("slot",o,i)],d?-2:64)}let s=e[t];s&&s._c&&(s._d=!1),F();const r=s&&$l(s(o)),a=o.key||r&&r.key,l=Gt(mt,{key:(a&&!re(a)?a:`_${t}`)+(!r&&i?"_fb":"")},r||[],r&&e._===1?64:-2);return l.scopeId&&(l.slotScopeIds=[l.scopeId+"-s"]),s&&s._c&&(s._d=!0),l}function $l(e){return e.some(t=>$i(t)?!(t.type===De||t.type===mt&&!$l(t.children)):!0)?e:null}const Cs=e=>e?Gl(e)?Dn(e):Cs(e.parent):null,yi=Ot(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>Cs(e.parent),$root:e=>Cs(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>zl(e),$forceUpdate:e=>e.f||(e.f=()=>{tr(e.update)}),$nextTick:e=>e.n||(e.n=Mo.bind(e.proxy)),$watch:e=>Cp.bind(e)}),ns=(e,t)=>e!==ct&&!e.__isScriptSetup&&rt(e,t),rp={get({_:e},t){if(t==="__v_skip")return!0;const{ctx:o,setupState:i,data:n,props:s,accessCache:r,type:a,appContext:l}=e;let d;if(t[0]!=="$"){const v=r[t];if(v!==void 0)switch(v){case 1:return i[t];case 2:return n[t];case 4:return o[t];case 3:return s[t]}else{if(ns(i,t))return r[t]=1,i[t];if(n!==ct&&rt(n,t))return r[t]=2,n[t];if((d=e.propsOptions[0])&&rt(d,t))return r[t]=3,s[t];if(o!==ct&&rt(o,t))return r[t]=4,o[t];As&&(r[t]=0)}}const u=yi[t];let p,c;if(u)return t==="$attrs"&&Pt(e.attrs,"get",""),u(e);if((p=a.__cssModules)&&(p=p[t]))return p;if(o!==ct&&rt(o,t))return r[t]=4,o[t];if(c=l.config.globalProperties,rt(c,t))return c[t]},set({_:e},t,o){const{data:i,setupState:n,ctx:s}=e;return ns(n,t)?(n[t]=o,!0):i!==ct&&rt(i,t)?(i[t]=o,!0):rt(e.props,t)||t[0]==="$"&&t.slice(1)in e?!1:(s[t]=o,!0)},has({_:{data:e,setupState:t,accessCache:o,ctx:i,appContext:n,propsOptions:s,type:r}},a){let l,d;return!!(o[a]||e!==ct&&a[0]!=="$"&&rt(e,a)||ns(t,a)||(l=s[0])&&rt(l,a)||rt(i,a)||rt(yi,a)||rt(n.config.globalProperties,a)||(d=r.__cssModules)&&d[a])},defineProperty(e,t,o){return o.get!=null?e._.accessCache[t]=0:rt(o,"value")&&this.set(e,t,o.value,null),Reflect.defineProperty(e,t,o)}};function qr(e){return G(e)?e.reduce((t,o)=>(t[o]=null,t),{}):e}let As=!0;function ap(e){const t=zl(e),o=e.proxy,i=e.ctx;As=!1,t.beforeCreate&&Kr(t.beforeCreate,e,"bc");const{data:n,computed:s,methods:r,watch:a,provide:l,inject:d,created:u,beforeMount:p,mounted:c,beforeUpdate:v,updated:y,activated:x,deactivated:C,beforeDestroy:A,beforeUnmount:D,destroyed:L,unmounted:M,render:V,renderTracked:B,renderTriggered:q,errorCaptured:it,serverPrefetch:at,expose:et,inheritAttrs:Tt,components:Et,directives:ht,filters:xt}=t;if(d&&lp(d,i,null),r)for(const Q in r){const Y=r[Q];X(Y)&&(i[Q]=Y.bind(o))}if(n){const Q=n.call(o,o);dt(Q)&&(e.data=To(Q))}if(As=!0,s)for(const Q in s){const Y=s[Q],gt=X(Y)?Y.bind(o,o):X(Y.get)?Y.get.bind(o,o):be,Se=!X(Y)&&X(Y.set)?Y.set.bind(o):be,zt=Ae({get:gt,set:Se});Object.defineProperty(i,Q,{enumerable:!0,configurable:!0,get:()=>zt.value,set:_t=>zt.value=_t})}if(a)for(const Q in a)Tl(a[Q],i,o,Q);if(l){const Q=X(l)?l.call(o):l;Reflect.ownKeys(Q).forEach(Y=>{Ml(Y,Q[Y])})}u&&Kr(u,e,"c");function lt(Q,Y){G(Y)?Y.forEach(gt=>Q(gt.bind(o))):Y&&Q(Y.bind(o))}if(lt(Zu,p),lt(El,c),lt(Qu,v),lt(tp,y),lt(Yu,x),lt(Xu,C),lt(np,it),lt(ip,B),lt(op,q),lt(On,D),lt(Cl,M),lt(ep,at),G(et))if(et.length){const Q=e.exposed||(e.exposed={});et.forEach(Y=>{Object.defineProperty(Q,Y,{get:()=>o[Y],set:gt=>o[Y]=gt,enumerable:!0})})}else e.exposed||(e.exposed={});V&&e.render===be&&(e.render=V),Tt!=null&&(e.inheritAttrs=Tt),Et&&(e.components=Et),ht&&(e.directives=ht),at&&xl(e)}function lp(e,t,o=be){G(e)&&(e=$s(e));for(const i in e){const n=e[i];let s;dt(n)?"default"in n?s=Zi(n.from||i,n.default,!0):s=Zi(n.from||i):s=Zi(n),Lt(s)?Object.defineProperty(t,i,{enumerable:!0,configurable:!0,get:()=>s.value,set:r=>s.value=r}):t[i]=s}}function Kr(e,t,o){ye(G(e)?e.map(i=>i.bind(t.proxy)):e.bind(t.proxy),t,o)}function Tl(e,t,o,i){let n=i.includes(".")?Hl(o,i):()=>o[i];if(wt(e)){const s=t[e];X(s)&&Ro(n,s)}else if(X(e))Ro(n,e.bind(o));else if(dt(e))if(G(e))e.forEach(s=>Tl(s,t,o,i));else{const s=X(e.handler)?e.handler.bind(o):t[e.handler];X(s)&&Ro(n,s,e)}}function zl(e){const t=e.type,{mixins:o,extends:i}=t,{mixins:n,optionsCache:s,config:{optionMergeStrategies:r}}=e.appContext,a=s.get(t);let l;return a?l=a:!n.length&&!o&&!i?l=t:(l={},n.length&&n.forEach(d=>un(l,d,r,!0)),un(l,t,r)),dt(t)&&s.set(t,l),l}function un(e,t,o,i=!1){const{mixins:n,extends:s}=t;s&&un(e,s,o,!0),n&&n.forEach(r=>un(e,r,o,!0));for(const r in t)if(!(i&&r==="expose")){const a=cp[r]||o&&o[r];e[r]=a?a(e[r],t[r]):t[r]}return e}const cp={data:Wr,props:Gr,emits:Gr,methods:pi,computed:pi,beforeCreate:Dt,created:Dt,beforeMount:Dt,mounted:Dt,beforeUpdate:Dt,updated:Dt,beforeDestroy:Dt,beforeUnmount:Dt,destroyed:Dt,unmounted:Dt,activated:Dt,deactivated:Dt,errorCaptured:Dt,serverPrefetch:Dt,components:pi,directives:pi,watch:up,provide:Wr,inject:dp};function Wr(e,t){return t?e?function(){return Ot(X(e)?e.call(this,this):e,X(t)?t.call(this,this):t)}:t:e}function dp(e,t){return pi($s(e),$s(t))}function $s(e){if(G(e)){const t={};for(let o=0;o<e.length;o++)t[e[o]]=e[o];return t}return e}function Dt(e,t){return e?[...new Set([].concat(e,t))]:t}function pi(e,t){return e?Ot(Object.create(null),e,t):t}function Gr(e,t){return e?G(e)&&G(t)?[...new Set([...e,...t])]:Ot(Object.create(null),qr(e),qr(t??{})):t}function up(e,t){if(!e)return t;if(!t)return e;const o=Ot(Object.create(null),e);for(const i in t)o[i]=Dt(e[i],t[i]);return o}function Pl(){return{app:null,config:{isNativeTag:Ua,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let pp=0;function hp(e,t){return function(i,n=null){X(i)||(i=Ot({},i)),n!=null&&!dt(n)&&(n=null);const s=Pl(),r=new WeakSet,a=[];let l=!1;const d=s.app={_uid:pp++,_component:i,_props:n,_container:null,_context:s,_instance:null,version:Gp,get config(){return s.config},set config(u){},use(u,...p){return r.has(u)||(u&&X(u.install)?(r.add(u),u.install(d,...p)):X(u)&&(r.add(u),u(d,...p))),d},mixin(u){return s.mixins.includes(u)||s.mixins.push(u),d},component(u,p){return p?(s.components[u]=p,d):s.components[u]},directive(u,p){return p?(s.directives[u]=p,d):s.directives[u]},mount(u,p,c){if(!l){const v=d._ceVNode||K(i,n);return v.appContext=s,c===!0?c="svg":c===!1&&(c=void 0),e(v,u,c),l=!0,d._container=u,u.__vue_app__=d,Dn(v.component)}},onUnmount(u){a.push(u)},unmount(){l&&(ye(a,d._instance,16),e(null,d._container),delete d._container.__vue_app__)},provide(u,p){return s.provides[u]=p,d},runWithContext(u){const p=Oo;Oo=d;try{return u()}finally{Oo=p}}};return d}}let Oo=null;function Ml(e,t){if(jt){let o=jt.provides;const i=jt.parent&&jt.parent.provides;i===o&&(o=jt.provides=Object.create(i)),o[e]=t}}function Zi(e,t,o=!1){const i=Up();if(i||Oo){let n=Oo?Oo._context.provides:i?i.parent==null||i.ce?i.vnode.appContext&&i.vnode.appContext.provides:i.parent.provides:void 0;if(n&&e in n)return n[e];if(arguments.length>1)return o&&X(t)?t.call(i&&i.proxy):t}}const Ll={},Ol=()=>Object.create(Ll),Rl=e=>Object.getPrototypeOf(e)===Ll;function fp(e,t,o,i=!1){const n={},s=Ol();e.propsDefaults=Object.create(null),Il(e,t,n,s);for(const r in e.propsOptions[0])r in n||(n[r]=void 0);o?e.props=i?n:Ou(n):e.type.props?e.props=n:e.props=s,e.attrs=s}function gp(e,t,o,i){const{props:n,attrs:s,vnode:{patchFlag:r}}=e,a=st(n),[l]=e.propsOptions;let d=!1;if((i||r>0)&&!(r&16)){if(r&8){const u=e.vnode.dynamicProps;for(let p=0;p<u.length;p++){let c=u[p];if(Rn(e.emitsOptions,c))continue;const v=t[c];if(l)if(rt(s,c))v!==s[c]&&(s[c]=v,d=!0);else{const y=We(c);n[y]=Ts(l,a,y,v,e,!1)}else v!==s[c]&&(s[c]=v,d=!0)}}}else{Il(e,t,n,s)&&(d=!0);let u;for(const p in a)(!t||!rt(t,p)&&((u=Xe(p))===p||!rt(t,u)))&&(l?o&&(o[p]!==void 0||o[u]!==void 0)&&(n[p]=Ts(l,a,p,void 0,e,!0)):delete n[p]);if(s!==a)for(const p in s)(!t||!rt(t,p))&&(delete s[p],d=!0)}d&&ze(e.attrs,"set","")}function Il(e,t,o,i){const[n,s]=e.propsOptions;let r=!1,a;if(t)for(let l in t){if(fi(l))continue;const d=t[l];let u;n&&rt(n,u=We(l))?!s||!s.includes(u)?o[u]=d:(a||(a={}))[u]=d:Rn(e.emitsOptions,l)||(!(l in i)||d!==i[l])&&(i[l]=d,r=!0)}if(s){const l=st(o),d=a||ct;for(let u=0;u<s.length;u++){const p=s[u];o[p]=Ts(n,l,p,d[p],e,!rt(d,p))}}return r}function Ts(e,t,o,i,n,s){const r=e[o];if(r!=null){const a=rt(r,"default");if(a&&i===void 0){const l=r.default;if(r.type!==Function&&!r.skipFactory&&X(l)){const{propsDefaults:d}=n;if(o in d)i=d[o];else{const u=Ni(n);i=d[o]=l.call(null,t),u()}}else i=l;n.ce&&n.ce._setProp(o,i)}r[0]&&(s&&!a?i=!1:r[1]&&(i===""||i===Xe(o))&&(i=!0))}return i}const mp=new WeakMap;function Dl(e,t,o=!1){const i=o?mp:t.propsCache,n=i.get(e);if(n)return n;const s=e.props,r={},a=[];let l=!1;if(!X(e)){const u=p=>{l=!0;const[c,v]=Dl(p,t,!0);Ot(r,c),v&&a.push(...v)};!o&&t.mixins.length&&t.mixins.forEach(u),e.extends&&u(e.extends),e.mixins&&e.mixins.forEach(u)}if(!s&&!l)return dt(e)&&i.set(e,Ao),Ao;if(G(s))for(let u=0;u<s.length;u++){const p=We(s[u]);Yr(p)&&(r[p]=ct)}else if(s)for(const u in s){const p=We(u);if(Yr(p)){const c=s[u],v=r[p]=G(c)||X(c)?{type:c}:Ot({},c),y=v.type;let x=!1,C=!0;if(G(y))for(let A=0;A<y.length;++A){const D=y[A],L=X(D)&&D.name;if(L==="Boolean"){x=!0;break}else L==="String"&&(C=!1)}else x=X(y)&&y.name==="Boolean";v[0]=x,v[1]=C,(x||rt(v,"default"))&&a.push(p)}}const d=[r,a];return dt(e)&&i.set(e,d),d}function Yr(e){return e[0]!=="$"&&!fi(e)}const or=e=>e==="_"||e==="_ctx"||e==="$stable",ir=e=>G(e)?e.map(ge):[ge(e)],vp=(e,t,o)=>{if(t._n)return t;const i=ft((...n)=>ir(t(...n)),o);return i._c=!1,i},Fl=(e,t,o)=>{const i=e._ctx;for(const n in e){if(or(n))continue;const s=e[n];if(X(s))t[n]=vp(n,s,i);else if(s!=null){const r=ir(s);t[n]=()=>r}}},Nl=(e,t)=>{const o=ir(t);e.slots.default=()=>o},jl=(e,t,o)=>{for(const i in t)(o||!or(i))&&(e[i]=t[i])},bp=(e,t,o)=>{const i=e.slots=Ol();if(e.vnode.shapeFlag&32){const n=t._;n?(jl(i,t,o),o&&Wa(i,"_",n,!0)):Fl(t,i)}else t&&Nl(e,t)},yp=(e,t,o)=>{const{vnode:i,slots:n}=e;let s=!0,r=ct;if(i.shapeFlag&32){const a=t._;a?o&&a===1?s=!1:jl(n,t,o):(s=!t.$stable,Fl(t,n)),r=t}else t&&(Nl(e,t),r={default:1});if(s)for(const a in n)!or(a)&&r[a]==null&&delete n[a]},Ft=Op;function kp(e){return wp(e)}function wp(e,t){const o=Tn();o.__VUE__=!0;const{insert:i,remove:n,patchProp:s,createElement:r,createText:a,createComment:l,setText:d,setElementText:u,parentNode:p,nextSibling:c,setScopeId:v=be,insertStaticContent:y}=e,x=(g,b,_,z=null,$=null,E=null,I=void 0,R=null,O=!!b.dynamicChildren)=>{if(g===b)return;g&&!ci(g,b)&&(z=ko(g),_t(g,$,E,!0),g=null),b.patchFlag===-2&&(O=!1,b.dynamicChildren=null);const{type:P,ref:U,shapeFlag:m}=b;switch(P){case In:C(g,b,_,z);break;case De:A(g,b,_,z);break;case rs:g==null&&D(b,_,z,I);break;case mt:Et(g,b,_,z,$,E,I,R,O);break;default:m&1?V(g,b,_,z,$,E,I,R,O):m&6?ht(g,b,_,z,$,E,I,R,O):(m&64||m&128)&&P.process(g,b,_,z,$,E,I,R,O,Ze)}U!=null&&$?bi(U,g&&g.ref,E,b||g,!b):U==null&&g&&g.ref!=null&&bi(g.ref,null,E,g,!0)},C=(g,b,_,z)=>{if(g==null)i(b.el=a(b.children),_,z);else{const $=b.el=g.el;b.children!==g.children&&d($,b.children)}},A=(g,b,_,z)=>{g==null?i(b.el=l(b.children||""),_,z):b.el=g.el},D=(g,b,_,z)=>{[g.el,g.anchor]=y(g.children,b,_,z,g.el,g.anchor)},L=({el:g,anchor:b},_,z)=>{let $;for(;g&&g!==b;)$=c(g),i(g,_,z),g=$;i(b,_,z)},M=({el:g,anchor:b})=>{let _;for(;g&&g!==b;)_=c(g),n(g),g=_;n(b)},V=(g,b,_,z,$,E,I,R,O)=>{b.type==="svg"?I="svg":b.type==="math"&&(I="mathml"),g==null?B(b,_,z,$,E,I,R,O):at(g,b,$,E,I,R,O)},B=(g,b,_,z,$,E,I,R)=>{let O,P;const{props:U,shapeFlag:m,transition:h,dirs:f}=g;if(O=g.el=r(g.type,E,U&&U.is,U),m&8?u(O,g.children):m&16&&it(g.children,O,null,z,$,ss(g,E),I,R),f&&Qe(g,null,z,"created"),q(O,g,g.scopeId,I,z),U){for(const T in U)T!=="value"&&!fi(T)&&s(O,T,null,U[T],E,z);"value"in U&&s(O,"value",null,U.value,E),(P=U.onVnodeBeforeMount)&&pe(P,z,g)}f&&Qe(g,null,z,"beforeMount");const N=xp($,h);N&&h.beforeEnter(O),i(O,b,_),((P=U&&U.onVnodeMounted)||N||f)&&Ft(()=>{P&&pe(P,z,g),N&&h.enter(O),f&&Qe(g,null,z,"mounted")},$)},q=(g,b,_,z,$)=>{if(_&&v(g,_),z)for(let E=0;E<z.length;E++)v(g,z[E]);if($){let E=$.subTree;if(b===E||ql(E.type)&&(E.ssContent===b||E.ssFallback===b)){const I=$.vnode;q(g,I,I.scopeId,I.slotScopeIds,$.parent)}}},it=(g,b,_,z,$,E,I,R,O=0)=>{for(let P=O;P<g.length;P++){const U=g[P]=R?He(g[P]):ge(g[P]);x(null,U,b,_,z,$,E,I,R)}},at=(g,b,_,z,$,E,I)=>{const R=b.el=g.el;let{patchFlag:O,dynamicChildren:P,dirs:U}=b;O|=g.patchFlag&16;const m=g.props||ct,h=b.props||ct;let f;if(_&&to(_,!1),(f=h.onVnodeBeforeUpdate)&&pe(f,_,b,g),U&&Qe(b,g,_,"beforeUpdate"),_&&to(_,!0),(m.innerHTML&&h.innerHTML==null||m.textContent&&h.textContent==null)&&u(R,""),P?et(g.dynamicChildren,P,R,_,z,ss(b,$),E):I||Y(g,b,R,null,_,z,ss(b,$),E,!1),O>0){if(O&16)Tt(R,m,h,_,$);else if(O&2&&m.class!==h.class&&s(R,"class",null,h.class,$),O&4&&s(R,"style",m.style,h.style,$),O&8){const N=b.dynamicProps;for(let T=0;T<N.length;T++){const J=N[T],Ct=m[J],Ut=h[J];(Ut!==Ct||J==="value")&&s(R,J,Ct,Ut,$,_)}}O&1&&g.children!==b.children&&u(R,b.children)}else!I&&P==null&&Tt(R,m,h,_,$);((f=h.onVnodeUpdated)||U)&&Ft(()=>{f&&pe(f,_,b,g),U&&Qe(b,g,_,"updated")},z)},et=(g,b,_,z,$,E,I)=>{for(let R=0;R<b.length;R++){const O=g[R],P=b[R],U=O.el&&(O.type===mt||!ci(O,P)||O.shapeFlag&198)?p(O.el):_;x(O,P,U,null,z,$,E,I,!0)}},Tt=(g,b,_,z,$)=>{if(b!==_){if(b!==ct)for(const E in b)!fi(E)&&!(E in _)&&s(g,E,b[E],null,$,z);for(const E in _){if(fi(E))continue;const I=_[E],R=b[E];I!==R&&E!=="value"&&s(g,E,R,I,$,z)}"value"in _&&s(g,"value",b.value,_.value,$)}},Et=(g,b,_,z,$,E,I,R,O)=>{const P=b.el=g?g.el:a(""),U=b.anchor=g?g.anchor:a("");let{patchFlag:m,dynamicChildren:h,slotScopeIds:f}=b;f&&(R=R?R.concat(f):f),g==null?(i(P,_,z),i(U,_,z),it(b.children||[],_,U,$,E,I,R,O)):m>0&&m&64&&h&&g.dynamicChildren?(et(g.dynamicChildren,h,_,$,E,I,R),(b.key!=null||$&&b===$.subTree)&&nr(g,b,!0)):Y(g,b,_,U,$,E,I,R,O)},ht=(g,b,_,z,$,E,I,R,O)=>{b.slotScopeIds=R,g==null?b.shapeFlag&512?$.ctx.activate(b,_,z,I,O):xt(b,_,z,$,E,I,O):It(g,b,O)},xt=(g,b,_,z,$,E,I)=>{const R=g.component=Bp(g,z,$);if(_l(g)&&(R.ctx.renderer=Ze),Hp(R,!1,I),R.asyncDep){if($&&$.registerDep(R,lt,I),!g.el){const O=R.subTree=K(De);A(null,O,b,_),g.placeholder=O.el}}else lt(R,g,b,_,$,E,I)},It=(g,b,_)=>{const z=b.component=g.component;if(Mp(g,b,_))if(z.asyncDep&&!z.asyncResolved){Q(z,b,_);return}else z.next=b,z.update();else b.el=g.el,z.vnode=b},lt=(g,b,_,z,$,E,I)=>{const R=()=>{if(g.isMounted){let{next:m,bu:h,u:f,parent:N,vnode:T}=g;{const de=Bl(g);if(de){m&&(m.el=T.el,Q(g,m,I)),de.asyncDep.then(()=>{g.isUnmounted||R()});return}}let J=m,Ct;to(g,!1),m?(m.el=T.el,Q(g,m,I)):m=T,h&&Xi(h),(Ct=m.props&&m.props.onVnodeBeforeUpdate)&&pe(Ct,N,m,T),to(g,!0);const Ut=Jr(g),ce=g.subTree;g.subTree=Ut,x(ce,Ut,p(ce.el),ko(ce),g,$,E),m.el=Ut.el,J===null&&Lp(g,Ut.el),f&&Ft(f,$),(Ct=m.props&&m.props.onVnodeUpdated)&&Ft(()=>pe(Ct,N,m,T),$)}else{let m;const{el:h,props:f}=b,{bm:N,m:T,parent:J,root:Ct,type:Ut}=g,ce=Lo(b);to(g,!1),N&&Xi(N),!ce&&(m=f&&f.onVnodeBeforeMount)&&pe(m,J,b),to(g,!0);{Ct.ce&&Ct.ce._def.shadowRoot!==!1&&Ct.ce._injectChildStyle(Ut);const de=g.subTree=Jr(g);x(null,de,_,z,g,$,E),b.el=de.el}if(T&&Ft(T,$),!ce&&(m=f&&f.onVnodeMounted)){const de=b;Ft(()=>pe(m,J,de),$)}(b.shapeFlag&256||J&&Lo(J.vnode)&&J.vnode.shapeFlag&256)&&g.a&&Ft(g.a,$),g.isMounted=!0,b=_=z=null}};g.scope.on();const O=g.effect=new Ja(R);g.scope.off();const P=g.update=O.run.bind(O),U=g.job=O.runIfDirty.bind(O);U.i=g,U.id=g.uid,O.scheduler=()=>tr(U),to(g,!0),P()},Q=(g,b,_)=>{b.component=g;const z=g.vnode.props;g.vnode=b,g.next=null,gp(g,b.props,z,_),yp(g,b.children,_),Re(),jr(g),Ie()},Y=(g,b,_,z,$,E,I,R,O=!1)=>{const P=g&&g.children,U=g?g.shapeFlag:0,m=b.children,{patchFlag:h,shapeFlag:f}=b;if(h>0){if(h&128){Se(P,m,_,z,$,E,I,R,O);return}else if(h&256){gt(P,m,_,z,$,E,I,R,O);return}}f&8?(U&16&&Be(P,$,E),m!==P&&u(_,m)):U&16?f&16?Se(P,m,_,z,$,E,I,R,O):Be(P,$,E,!0):(U&8&&u(_,""),f&16&&it(m,_,z,$,E,I,R,O))},gt=(g,b,_,z,$,E,I,R,O)=>{g=g||Ao,b=b||Ao;const P=g.length,U=b.length,m=Math.min(P,U);let h;for(h=0;h<m;h++){const f=b[h]=O?He(b[h]):ge(b[h]);x(g[h],f,_,null,$,E,I,R,O)}P>U?Be(g,$,E,!0,!1,m):it(b,_,z,$,E,I,R,O,m)},Se=(g,b,_,z,$,E,I,R,O)=>{let P=0;const U=b.length;let m=g.length-1,h=U-1;for(;P<=m&&P<=h;){const f=g[P],N=b[P]=O?He(b[P]):ge(b[P]);if(ci(f,N))x(f,N,_,null,$,E,I,R,O);else break;P++}for(;P<=m&&P<=h;){const f=g[m],N=b[h]=O?He(b[h]):ge(b[h]);if(ci(f,N))x(f,N,_,null,$,E,I,R,O);else break;m--,h--}if(P>m){if(P<=h){const f=h+1,N=f<U?b[f].el:z;for(;P<=h;)x(null,b[P]=O?He(b[P]):ge(b[P]),_,N,$,E,I,R,O),P++}}else if(P>h)for(;P<=m;)_t(g[P],$,E,!0),P++;else{const f=P,N=P,T=new Map;for(P=N;P<=h;P++){const Wt=b[P]=O?He(b[P]):ge(b[P]);Wt.key!=null&&T.set(Wt.key,P)}let J,Ct=0;const Ut=h-N+1;let ce=!1,de=0;const ai=new Array(Ut);for(P=0;P<Ut;P++)ai[P]=0;for(P=f;P<=m;P++){const Wt=g[P];if(Ct>=Ut){_t(Wt,$,E,!0);continue}let ue;if(Wt.key!=null)ue=T.get(Wt.key);else for(J=N;J<=h;J++)if(ai[J-N]===0&&ci(Wt,b[J])){ue=J;break}ue===void 0?_t(Wt,$,E,!0):(ai[ue-N]=P+1,ue>=de?de=ue:ce=!0,x(Wt,b[ue],_,null,$,E,I,R,O),Ct++)}const Lr=ce?_p(ai):Ao;for(J=Lr.length-1,P=Ut-1;P>=0;P--){const Wt=N+P,ue=b[Wt],Or=b[Wt+1],Rr=Wt+1<U?Or.el||Or.placeholder:z;ai[P]===0?x(null,ue,_,Rr,$,E,I,R,O):ce&&(J<0||P!==Lr[J]?zt(ue,_,Rr,2):J--)}}},zt=(g,b,_,z,$=null)=>{const{el:E,type:I,transition:R,children:O,shapeFlag:P}=g;if(P&6){zt(g.component.subTree,b,_,z);return}if(P&128){g.suspense.move(b,_,z);return}if(P&64){I.move(g,b,_,Ze);return}if(I===mt){i(E,b,_);for(let m=0;m<O.length;m++)zt(O[m],b,_,z);i(g.anchor,b,_);return}if(I===rs){L(g,b,_);return}if(z!==2&&P&1&&R)if(z===0)R.beforeEnter(E),i(E,b,_),Ft(()=>R.enter(E),$);else{const{leave:m,delayLeave:h,afterLeave:f}=R,N=()=>{g.ctx.isUnmounted?n(E):i(E,b,_)},T=()=>{E._isLeaving&&E[Gu](!0),m(E,()=>{N(),f&&f()})};h?h(E,N,T):T()}else i(E,b,_)},_t=(g,b,_,z=!1,$=!1)=>{const{type:E,props:I,ref:R,children:O,dynamicChildren:P,shapeFlag:U,patchFlag:m,dirs:h,cacheIndex:f}=g;if(m===-2&&($=!1),R!=null&&(Re(),bi(R,null,_,g,!0),Ie()),f!=null&&(b.renderCache[f]=void 0),U&256){b.ctx.deactivate(g);return}const N=U&1&&h,T=!Lo(g);let J;if(T&&(J=I&&I.onVnodeBeforeUnmount)&&pe(J,b,g),U&6)Jn(g.component,_,z);else{if(U&128){g.suspense.unmount(_,z);return}N&&Qe(g,null,b,"beforeUnmount"),U&64?g.type.remove(g,b,_,Ze,z):P&&!P.hasOnce&&(E!==mt||m>0&&m&64)?Be(P,b,_,!1,!0):(E===mt&&m&384||!$&&U&16)&&Be(O,b,_),z&&si(g)}(T&&(J=I&&I.onVnodeUnmounted)||N)&&Ft(()=>{J&&pe(J,b,g),N&&Qe(g,null,b,"unmounted")},_)},si=g=>{const{type:b,el:_,anchor:z,transition:$}=g;if(b===mt){le(_,z);return}if(b===rs){M(g);return}const E=()=>{n(_),$&&!$.persisted&&$.afterLeave&&$.afterLeave()};if(g.shapeFlag&1&&$&&!$.persisted){const{leave:I,delayLeave:R}=$,O=()=>I(_,E);R?R(g.el,E,O):O()}else E()},le=(g,b)=>{let _;for(;g!==b;)_=c(g),n(g),g=_;n(b)},Jn=(g,b,_)=>{const{bum:z,scope:$,job:E,subTree:I,um:R,m:O,a:P}=g;Xr(O),Xr(P),z&&Xi(z),$.stop(),E&&(E.flags|=8,_t(I,g,b,_)),R&&Ft(R,b),Ft(()=>{g.isUnmounted=!0},b)},Be=(g,b,_,z=!1,$=!1,E=0)=>{for(let I=E;I<g.length;I++)_t(g[I],b,_,z,$)},ko=g=>{if(g.shapeFlag&6)return ko(g.component.subTree);if(g.shapeFlag&128)return g.suspense.next();const b=c(g.anchor||g.el),_=b&&b[bl];return _?c(_):b};let ri=!1;const Vi=(g,b,_)=>{g==null?b._vnode&&_t(b._vnode,null,null,!0):x(b._vnode||null,g,b,null,null,null,_),b._vnode=g,ri||(ri=!0,jr(),gl(),ri=!1)},Ze={p:x,um:_t,m:zt,r:si,mt:xt,mc:it,pc:Y,pbc:et,n:ko,o:e};return{render:Vi,hydrate:void 0,createApp:hp(Vi)}}function ss({type:e,props:t},o){return o==="svg"&&e==="foreignObject"||o==="mathml"&&e==="annotation-xml"&&t&&t.encoding&&t.encoding.includes("html")?void 0:o}function to({effect:e,job:t},o){o?(e.flags|=32,t.flags|=4):(e.flags&=-33,t.flags&=-5)}function xp(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function nr(e,t,o=!1){const i=e.children,n=t.children;if(G(i)&&G(n))for(let s=0;s<i.length;s++){const r=i[s];let a=n[s];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=n[s]=He(n[s]),a.el=r.el),!o&&a.patchFlag!==-2&&nr(r,a)),a.type===In&&a.patchFlag!==-1&&(a.el=r.el),a.type===De&&!a.el&&(a.el=r.el)}}function _p(e){const t=e.slice(),o=[0];let i,n,s,r,a;const l=e.length;for(i=0;i<l;i++){const d=e[i];if(d!==0){if(n=o[o.length-1],e[n]<d){t[i]=n,o.push(i);continue}for(s=0,r=o.length-1;s<r;)a=s+r>>1,e[o[a]]<d?s=a+1:r=a;d<e[o[s]]&&(s>0&&(t[i]=o[s-1]),o[s]=i)}}for(s=o.length,r=o[s-1];s-- >0;)o[s]=r,r=t[r];return o}function Bl(e){const t=e.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:Bl(t)}function Xr(e){if(e)for(let t=0;t<e.length;t++)e[t].flags|=8}const Sp=Symbol.for("v-scx"),Ep=()=>Zi(Sp);function Ro(e,t,o){return Ul(e,t,o)}function Ul(e,t,o=ct){const{immediate:i,deep:n,flush:s,once:r}=o,a=Ot({},o),l=t&&i||!t&&s!=="post";let d;if(Ti){if(s==="sync"){const v=Ep();d=v.__watcherHandles||(v.__watcherHandles=[])}else if(!l){const v=()=>{};return v.stop=be,v.resume=be,v.pause=be,v}}const u=jt;a.call=(v,y,x)=>ye(v,u,y,x);let p=!1;s==="post"?a.scheduler=v=>{Ft(v,u&&u.suspense)}:s!=="sync"&&(p=!0,a.scheduler=(v,y)=>{y?v():tr(v)}),a.augmentJob=v=>{t&&(v.flags|=4),p&&(v.flags|=2,u&&(v.id=u.uid,v.i=u))};const c=Uu(e,t,a);return Ti&&(d?d.push(c):l&&c()),c}function Cp(e,t,o){const i=this.proxy,n=wt(e)?e.includes(".")?Hl(i,e):()=>i[e]:e.bind(i,i);let s;X(t)?s=t:(s=t.handler,o=t);const r=Ni(this),a=Ul(n,s.bind(i),o);return r(),a}function Hl(e,t){const o=t.split(".");return()=>{let i=e;for(let n=0;n<o.length&&i;n++)i=i[o[n]];return i}}const Ap=(e,t)=>t==="modelValue"||t==="model-value"?e.modelModifiers:e[`${t}Modifiers`]||e[`${We(t)}Modifiers`]||e[`${Xe(t)}Modifiers`];function $p(e,t,...o){if(e.isUnmounted)return;const i=e.vnode.props||ct;let n=o;const s=t.startsWith("update:"),r=s&&Ap(i,t.slice(7));r&&(r.trim&&(n=o.map(u=>wt(u)?u.trim():u)),r.number&&(n=o.map(sn)));let a,l=i[a=Qn(t)]||i[a=Qn(We(t))];!l&&s&&(l=i[a=Qn(Xe(t))]),l&&ye(l,e,6,n);const d=i[a+"Once"];if(d){if(!e.emitted)e.emitted={};else if(e.emitted[a])return;e.emitted[a]=!0,ye(d,e,6,n)}}const Tp=new WeakMap;function Vl(e,t,o=!1){const i=o?Tp:t.emitsCache,n=i.get(e);if(n!==void 0)return n;const s=e.emits;let r={},a=!1;if(!X(e)){const l=d=>{const u=Vl(d,t,!0);u&&(a=!0,Ot(r,u))};!o&&t.mixins.length&&t.mixins.forEach(l),e.extends&&l(e.extends),e.mixins&&e.mixins.forEach(l)}return!s&&!a?(dt(e)&&i.set(e,null),null):(G(s)?s.forEach(l=>r[l]=null):Ot(r,s),dt(e)&&i.set(e,r),r)}function Rn(e,t){return!e||!Cn(t)?!1:(t=t.slice(2).replace(/Once$/,""),rt(e,t[0].toLowerCase()+t.slice(1))||rt(e,Xe(t))||rt(e,t))}function Jr(e){const{type:t,vnode:o,proxy:i,withProxy:n,propsOptions:[s],slots:r,attrs:a,emit:l,render:d,renderCache:u,props:p,data:c,setupState:v,ctx:y,inheritAttrs:x}=e,C=cn(e);let A,D;try{if(o.shapeFlag&4){const M=n||i,V=M;A=ge(d.call(V,M,u,p,v,c,y)),D=a}else{const M=t;A=ge(M.length>1?M(p,{attrs:a,slots:r,emit:l}):M(p,null)),D=t.props?a:zp(a)}}catch(M){ki.length=0,Mn(M,e,1),A=K(De)}let L=A;if(D&&x!==!1){const M=Object.keys(D),{shapeFlag:V}=L;M.length&&V&7&&(s&&M.some(Hs)&&(D=Pp(D,s)),L=Xo(L,D,!1,!0))}return o.dirs&&(L=Xo(L,null,!1,!0),L.dirs=L.dirs?L.dirs.concat(o.dirs):o.dirs),o.transition&&er(L,o.transition),A=L,cn(C),A}const zp=e=>{let t;for(const o in e)(o==="class"||o==="style"||Cn(o))&&((t||(t={}))[o]=e[o]);return t},Pp=(e,t)=>{const o={};for(const i in e)(!Hs(i)||!(i.slice(9)in t))&&(o[i]=e[i]);return o};function Mp(e,t,o){const{props:i,children:n,component:s}=e,{props:r,children:a,patchFlag:l}=t,d=s.emitsOptions;if(t.dirs||t.transition)return!0;if(o&&l>=0){if(l&1024)return!0;if(l&16)return i?Zr(i,r,d):!!r;if(l&8){const u=t.dynamicProps;for(let p=0;p<u.length;p++){const c=u[p];if(r[c]!==i[c]&&!Rn(d,c))return!0}}}else return(n||a)&&(!a||!a.$stable)?!0:i===r?!1:i?r?Zr(i,r,d):!0:!!r;return!1}function Zr(e,t,o){const i=Object.keys(t);if(i.length!==Object.keys(e).length)return!0;for(let n=0;n<i.length;n++){const s=i[n];if(t[s]!==e[s]&&!Rn(o,s))return!0}return!1}function Lp({vnode:e,parent:t},o){for(;t;){const i=t.subTree;if(i.suspense&&i.suspense.activeBranch===e&&(i.el=e.el),i===e)(e=t.vnode).el=o,t=t.parent;else break}}const ql=e=>e.__isSuspense;function Op(e,t){t&&t.pendingBranch?G(e)?t.effects.push(...e):t.effects.push(e):qu(e)}const mt=Symbol.for("v-fgt"),In=Symbol.for("v-txt"),De=Symbol.for("v-cmt"),rs=Symbol.for("v-stc"),ki=[];let Yt=null;function F(e=!1){ki.push(Yt=e?null:[])}function Rp(){ki.pop(),Yt=ki[ki.length-1]||null}let Ai=1;function pn(e,t=!1){Ai+=e,e<0&&Yt&&t&&(Yt.hasOnce=!0)}function Kl(e){return e.dynamicChildren=Ai>0?Yt||Ao:null,Rp(),Ai>0&&Yt&&Yt.push(e),e}function H(e,t,o,i,n,s){return Kl(w(e,t,o,i,n,s,!0))}function Gt(e,t,o,i,n){return Kl(K(e,t,o,i,n,!0))}function $i(e){return e?e.__v_isVNode===!0:!1}function ci(e,t){return e.type===t.type&&e.key===t.key}const Wl=({key:e})=>e??null,Qi=({ref:e,ref_key:t,ref_for:o})=>(typeof e=="number"&&(e=""+e),e!=null?wt(e)||Lt(e)||X(e)?{i:Mt,r:e,k:t,f:!!o}:e:null);function w(e,t=null,o=null,i=0,n=null,s=e===mt?0:1,r=!1,a=!1){const l={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&Wl(t),ref:t&&Qi(t),scopeId:vl,slotScopeIds:null,children:o,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:s,patchFlag:i,dynamicProps:n,dynamicChildren:null,appContext:null,ctx:Mt};return a?(sr(l,o),s&128&&e.normalize(l)):o&&(l.shapeFlag|=wt(o)?8:16),Ai>0&&!r&&Yt&&(l.patchFlag>0||s&6)&&l.patchFlag!==32&&Yt.push(l),l}const K=Ip;function Ip(e,t=null,o=null,i=0,n=null,s=!1){if((!e||e===sp)&&(e=De),$i(e)){const a=Xo(e,t,!0);return o&&sr(a,o),Ai>0&&!s&&Yt&&(a.shapeFlag&6?Yt[Yt.indexOf(e)]=a:Yt.push(a)),a.patchFlag=-2,a}if(Wp(e)&&(e=e.__vccOpts),t){t=Dp(t);let{class:a,style:l}=t;a&&!wt(a)&&(t.class=ne(a)),dt(l)&&(Qs(l)&&!G(l)&&(l=Ot({},l)),t.style=Ks(l))}const r=wt(e)?1:ql(e)?128:Ku(e)?64:dt(e)?4:X(e)?2:0;return w(e,t,o,i,n,r,s,!0)}function Dp(e){return e?Qs(e)||Rl(e)?Ot({},e):e:null}function Xo(e,t,o=!1,i=!1){const{props:n,ref:s,patchFlag:r,children:a,transition:l}=e,d=t?Fp(n||{},t):n,u={__v_isVNode:!0,__v_skip:!0,type:e.type,props:d,key:d&&Wl(d),ref:t&&t.ref?o&&s?G(s)?s.concat(Qi(t)):[s,Qi(t)]:Qi(t):s,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:a,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==mt?r===-1?16:r|16:r,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:l,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&Xo(e.ssContent),ssFallback:e.ssFallback&&Xo(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce};return l&&i&&er(u,l.clone(u)),u}function kt(e=" ",t=0){return K(In,null,e,t)}function Z(e="",t=!1){return t?(F(),Gt(De,null,e)):K(De,null,e)}function ge(e){return e==null||typeof e=="boolean"?K(De):G(e)?K(mt,null,e.slice()):$i(e)?He(e):K(In,null,String(e))}function He(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:Xo(e)}function sr(e,t){let o=0;const{shapeFlag:i}=e;if(t==null)t=null;else if(G(t))o=16;else if(typeof t=="object")if(i&65){const n=t.default;n&&(n._c&&(n._d=!1),sr(e,n()),n._c&&(n._d=!0));return}else{o=32;const n=t._;!n&&!Rl(t)?t._ctx=Mt:n===3&&Mt&&(Mt.slots._===1?t._=1:(t._=2,e.patchFlag|=1024))}else X(t)?(t={default:t,_ctx:Mt},o=32):(t=String(t),i&64?(o=16,t=[kt(t)]):o=8);e.children=t,e.shapeFlag|=o}function Fp(...e){const t={};for(let o=0;o<e.length;o++){const i=e[o];for(const n in i)if(n==="class")t.class!==i.class&&(t.class=ne([t.class,i.class]));else if(n==="style")t.style=Ks([t.style,i.style]);else if(Cn(n)){const s=t[n],r=i[n];r&&s!==r&&!(G(s)&&s.includes(r))&&(t[n]=s?[].concat(s,r):r)}else n!==""&&(t[n]=i[n])}return t}function pe(e,t,o,i=null){ye(e,t,7,[o,i])}const Np=Pl();let jp=0;function Bp(e,t,o){const i=e.type,n=(t?t.appContext:e.appContext)||Np,s={uid:jp++,vnode:e,type:i,parent:t,appContext:n,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new fu(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(n.provides),ids:t?t.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:Dl(i,n),emitsOptions:Vl(i,n),emit:null,emitted:null,propsDefaults:ct,inheritAttrs:i.inheritAttrs,ctx:ct,data:ct,props:ct,attrs:ct,slots:ct,refs:ct,setupState:ct,setupContext:null,suspense:o,suspenseId:o?o.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return s.ctx={_:s},s.root=t?t.root:s,s.emit=$p.bind(null,s),e.ce&&e.ce(s),s}let jt=null;const Up=()=>jt||Mt;let hn,zs;{const e=Tn(),t=(o,i)=>{let n;return(n=e[o])||(n=e[o]=[]),n.push(i),s=>{n.length>1?n.forEach(r=>r(s)):n[0](s)}};hn=t("__VUE_INSTANCE_SETTERS__",o=>jt=o),zs=t("__VUE_SSR_SETTERS__",o=>Ti=o)}const Ni=e=>{const t=jt;return hn(e),e.scope.on(),()=>{e.scope.off(),hn(t)}},Qr=()=>{jt&&jt.scope.off(),hn(null)};function Gl(e){return e.vnode.shapeFlag&4}let Ti=!1;function Hp(e,t=!1,o=!1){t&&zs(t);const{props:i,children:n}=e.vnode,s=Gl(e);fp(e,i,s,t),bp(e,n,o||t);const r=s?Vp(e,t):void 0;return t&&zs(!1),r}function Vp(e,t){const o=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,rp);const{setup:i}=o;if(i){Re();const n=e.setupContext=i.length>1?Kp(e):null,s=Ni(e),r=Fi(i,e,0,[e.props,n]),a=Ha(r);if(Ie(),s(),(a||e.sp)&&!Lo(e)&&xl(e),a){if(r.then(Qr,Qr),t)return r.then(l=>{ta(e,l)}).catch(l=>{Mn(l,e,0)});e.asyncDep=r}else ta(e,r)}else Yl(e)}function ta(e,t,o){X(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:dt(t)&&(e.setupState=pl(t)),Yl(e)}function Yl(e,t,o){const i=e.type;e.render||(e.render=i.render||be);{const n=Ni(e);Re();try{ap(e)}finally{Ie(),n()}}}const qp={get(e,t){return Pt(e,"get",""),e[t]}};function Kp(e){const t=o=>{e.exposed=o||{}};return{attrs:new Proxy(e.attrs,qp),slots:e.slots,emit:e.emit,expose:t}}function Dn(e){return e.exposed?e.exposeProxy||(e.exposeProxy=new Proxy(pl(Ru(e.exposed)),{get(t,o){if(o in t)return t[o];if(o in yi)return yi[o](e)},has(t,o){return o in t||o in yi}})):e.proxy}function Wp(e){return X(e)&&"__vccOpts"in e}const Ae=(e,t)=>ju(e,t,Ti);function fo(e,t,o){try{pn(-1);const i=arguments.length;return i===2?dt(t)&&!G(t)?$i(t)?K(e,null,[t]):K(e,t):K(e,null,t):(i>3?o=Array.prototype.slice.call(arguments,2):i===3&&$i(o)&&(o=[o]),K(e,t,o))}finally{pn(1)}}const Gp="3.5.22";/**
* @vue/runtime-dom v3.5.22
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Ps;const ea=typeof window<"u"&&window.trustedTypes;if(ea)try{Ps=ea.createPolicy("vue",{createHTML:e=>e})}catch{}const Xl=Ps?e=>Ps.createHTML(e):e=>e,Yp="http://www.w3.org/2000/svg",Xp="http://www.w3.org/1998/Math/MathML",$e=typeof document<"u"?document:null,oa=$e&&$e.createElement("template"),Jp={insert:(e,t,o)=>{t.insertBefore(e,o||null)},remove:e=>{const t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,o,i)=>{const n=t==="svg"?$e.createElementNS(Yp,e):t==="mathml"?$e.createElementNS(Xp,e):o?$e.createElement(e,{is:o}):$e.createElement(e);return e==="select"&&i&&i.multiple!=null&&n.setAttribute("multiple",i.multiple),n},createText:e=>$e.createTextNode(e),createComment:e=>$e.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>$e.querySelector(e),setScopeId(e,t){e.setAttribute(t,"")},insertStaticContent(e,t,o,i,n,s){const r=o?o.previousSibling:t.lastChild;if(n&&(n===s||n.nextSibling))for(;t.insertBefore(n.cloneNode(!0),o),!(n===s||!(n=n.nextSibling)););else{oa.innerHTML=Xl(i==="svg"?`<svg>${e}</svg>`:i==="mathml"?`<math>${e}</math>`:e);const a=oa.content;if(i==="svg"||i==="mathml"){const l=a.firstChild;for(;l.firstChild;)a.appendChild(l.firstChild);a.removeChild(l)}t.insertBefore(a,o)}return[r?r.nextSibling:t.firstChild,o?o.previousSibling:t.lastChild]}},Zp=Symbol("_vtc");function Qp(e,t,o){const i=e[Zp];i&&(t=(t?[t,...i]:[...i]).join(" ")),t==null?e.removeAttribute("class"):o?e.setAttribute("class",t):e.className=t}const fn=Symbol("_vod"),Jl=Symbol("_vsh"),th={name:"show",beforeMount(e,{value:t},{transition:o}){e[fn]=e.style.display==="none"?"":e.style.display,o&&t?o.beforeEnter(e):di(e,t)},mounted(e,{value:t},{transition:o}){o&&t&&o.enter(e)},updated(e,{value:t,oldValue:o},{transition:i}){!t!=!o&&(i?t?(i.beforeEnter(e),di(e,!0),i.enter(e)):i.leave(e,()=>{di(e,!1)}):di(e,t))},beforeUnmount(e,{value:t}){di(e,t)}};function di(e,t){e.style.display=t?e[fn]:"none",e[Jl]=!t}const eh=Symbol(""),oh=/(?:^|;)\s*display\s*:/;function ih(e,t,o){const i=e.style,n=wt(o);let s=!1;if(o&&!n){if(t)if(wt(t))for(const r of t.split(";")){const a=r.slice(0,r.indexOf(":")).trim();o[a]==null&&tn(i,a,"")}else for(const r in t)o[r]==null&&tn(i,r,"");for(const r in o)r==="display"&&(s=!0),tn(i,r,o[r])}else if(n){if(t!==o){const r=i[eh];r&&(o+=";"+r),i.cssText=o,s=oh.test(o)}}else t&&e.removeAttribute("style");fn in e&&(e[fn]=s?i.display:"",e[Jl]&&(i.display="none"))}const ia=/\s*!important$/;function tn(e,t,o){if(G(o))o.forEach(i=>tn(e,t,i));else if(o==null&&(o=""),t.startsWith("--"))e.setProperty(t,o);else{const i=nh(e,t);ia.test(o)?e.setProperty(Xe(i),o.replace(ia,""),"important"):e[i]=o}}const na=["Webkit","Moz","ms"],as={};function nh(e,t){const o=as[t];if(o)return o;let i=We(t);if(i!=="filter"&&i in e)return as[t]=i;i=Ka(i);for(let n=0;n<na.length;n++){const s=na[n]+i;if(s in e)return as[t]=s}return t}const sa="http://www.w3.org/1999/xlink";function ra(e,t,o,i,n,s=uu(t)){i&&t.startsWith("xlink:")?o==null?e.removeAttributeNS(sa,t.slice(6,t.length)):e.setAttributeNS(sa,t,o):o==null||s&&!Ga(o)?e.removeAttribute(t):e.setAttribute(t,s?"":re(o)?String(o):o)}function aa(e,t,o,i,n){if(t==="innerHTML"||t==="textContent"){o!=null&&(e[t]=t==="innerHTML"?Xl(o):o);return}const s=e.tagName;if(t==="value"&&s!=="PROGRESS"&&!s.includes("-")){const a=s==="OPTION"?e.getAttribute("value")||"":e.value,l=o==null?e.type==="checkbox"?"on":"":String(o);(a!==l||!("_value"in e))&&(e.value=l),o==null&&e.removeAttribute(t),e._value=o;return}let r=!1;if(o===""||o==null){const a=typeof e[t];a==="boolean"?o=Ga(o):o==null&&a==="string"?(o="",r=!0):a==="number"&&(o=0,r=!0)}try{e[t]=o}catch{}r&&e.removeAttribute(n||t)}function so(e,t,o,i){e.addEventListener(t,o,i)}function sh(e,t,o,i){e.removeEventListener(t,o,i)}const la=Symbol("_vei");function rh(e,t,o,i,n=null){const s=e[la]||(e[la]={}),r=s[t];if(i&&r)r.value=i;else{const[a,l]=ah(t);if(i){const d=s[t]=dh(i,n);so(e,a,d,l)}else r&&(sh(e,a,r,l),s[t]=void 0)}}const ca=/(?:Once|Passive|Capture)$/;function ah(e){let t;if(ca.test(e)){t={};let i;for(;i=e.match(ca);)e=e.slice(0,e.length-i[0].length),t[i[0].toLowerCase()]=!0}return[e[2]===":"?e.slice(3):Xe(e.slice(2)),t]}let ls=0;const lh=Promise.resolve(),ch=()=>ls||(lh.then(()=>ls=0),ls=Date.now());function dh(e,t){const o=i=>{if(!i._vts)i._vts=Date.now();else if(i._vts<=o.attached)return;ye(uh(i,o.value),t,5,[i])};return o.value=e,o.attached=ch(),o}function uh(e,t){if(G(t)){const o=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{o.call(e),e._stopped=!0},t.map(i=>n=>!n._stopped&&i&&i(n))}else return t}const da=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,ph=(e,t,o,i,n,s)=>{const r=n==="svg";t==="class"?Qp(e,i,r):t==="style"?ih(e,o,i):Cn(t)?Hs(t)||rh(e,t,o,i,s):(t[0]==="."?(t=t.slice(1),!0):t[0]==="^"?(t=t.slice(1),!1):hh(e,t,i,r))?(aa(e,t,i),!e.tagName.includes("-")&&(t==="value"||t==="checked"||t==="selected")&&ra(e,t,i,r,s,t!=="value")):e._isVueCE&&(/[A-Z]/.test(t)||!wt(i))?aa(e,We(t),i,s,t):(t==="true-value"?e._trueValue=i:t==="false-value"&&(e._falseValue=i),ra(e,t,i,r))};function hh(e,t,o,i){if(i)return!!(t==="innerHTML"||t==="textContent"||t in e&&da(t)&&X(o));if(t==="spellcheck"||t==="draggable"||t==="translate"||t==="autocorrect"||t==="form"||t==="list"&&e.tagName==="INPUT"||t==="type"&&e.tagName==="TEXTAREA")return!1;if(t==="width"||t==="height"){const n=e.tagName;if(n==="IMG"||n==="VIDEO"||n==="CANVAS"||n==="SOURCE")return!1}return da(t)&&wt(o)?!1:t in e}const gn=e=>{const t=e.props["onUpdate:modelValue"]||!1;return G(t)?o=>Xi(t,o):t};function fh(e){e.target.composing=!0}function ua(e){const t=e.target;t.composing&&(t.composing=!1,t.dispatchEvent(new Event("input")))}const Io=Symbol("_assign"),pa={created(e,{modifiers:{lazy:t,trim:o,number:i}},n){e[Io]=gn(n);const s=i||n.props&&n.props.type==="number";so(e,t?"change":"input",r=>{if(r.target.composing)return;let a=e.value;o&&(a=a.trim()),s&&(a=sn(a)),e[Io](a)}),o&&so(e,"change",()=>{e.value=e.value.trim()}),t||(so(e,"compositionstart",fh),so(e,"compositionend",ua),so(e,"change",ua))},mounted(e,{value:t}){e.value=t??""},beforeUpdate(e,{value:t,oldValue:o,modifiers:{lazy:i,trim:n,number:s}},r){if(e[Io]=gn(r),e.composing)return;const a=(s||e.type==="number")&&!/^0\d/.test(e.value)?sn(e.value):e.value,l=t??"";a!==l&&(document.activeElement===e&&e.type!=="range"&&(i&&t===o||n&&e.value.trim()===l)||(e.value=l))}},xo={deep:!0,created(e,{value:t,modifiers:{number:o}},i){const n=An(t);so(e,"change",()=>{const s=Array.prototype.filter.call(e.options,r=>r.selected).map(r=>o?sn(mn(r)):mn(r));e[Io](e.multiple?n?new Set(s):s:s[0]),e._assigning=!0,Mo(()=>{e._assigning=!1})}),e[Io]=gn(i)},mounted(e,{value:t}){ha(e,t)},beforeUpdate(e,t,o){e[Io]=gn(o)},updated(e,{value:t}){e._assigning||ha(e,t)}};function ha(e,t){const o=e.multiple,i=G(t);if(!(o&&!i&&!An(t))){for(let n=0,s=e.options.length;n<s;n++){const r=e.options[n],a=mn(r);if(o)if(i){const l=typeof a;l==="string"||l==="number"?r.selected=t.some(d=>String(d)===String(a)):r.selected=hu(t,a)>-1}else r.selected=t.has(a);else if(zn(mn(r),t)){e.selectedIndex!==n&&(e.selectedIndex=n);return}}!o&&e.selectedIndex!==-1&&(e.selectedIndex=-1)}}function mn(e){return"_value"in e?e._value:e.value}const gh=["ctrl","shift","alt","meta"],mh={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>"button"in e&&e.button!==0,middle:e=>"button"in e&&e.button!==1,right:e=>"button"in e&&e.button!==2,exact:(e,t)=>gh.some(o=>e[`${o}Key`]&&!t.includes(o))},zi=(e,t)=>{const o=e._withMods||(e._withMods={}),i=t.join(".");return o[i]||(o[i]=((n,...s)=>{for(let r=0;r<t.length;r++){const a=mh[t[r]];if(a&&a(n,t))return}return e(n,...s)}))},vh={esc:"escape",space:" ",up:"arrow-up",left:"arrow-left",right:"arrow-right",down:"arrow-down",delete:"backspace"},Ms=(e,t)=>{const o=e._withKeys||(e._withKeys={}),i=t.join(".");return o[i]||(o[i]=(n=>{if(!("key"in n))return;const s=Xe(n.key);if(t.some(r=>r===s||vh[r]===s))return e(n)}))},bh=Ot({patchProp:ph},Jp);let fa;function yh(){return fa||(fa=kp(bh))}const kh=((...e)=>{const t=yh().createApp(...e),{mount:o}=t;return t.mount=i=>{const n=xh(i);if(!n)return;const s=t._component;!X(s)&&!s.render&&!s.template&&(s.template=n.innerHTML),n.nodeType===1&&(n.textContent="");const r=o(n,!1,wh(n));return n instanceof Element&&(n.removeAttribute("v-cloak"),n.setAttribute("data-v-app","")),r},t});function wh(e){if(e instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&e instanceof MathMLElement)return"mathml"}function xh(e){return wt(e)?document.querySelector(e):e}const Fn=e=>Object.keys(e).filter((t=>t!=="__")).map((t=>{const o=e[t];return(Array.isArray(o)?o:o()).map((i=>t==="default"?i:(n=>typeof n.type=="string")(i)?((n,s)=>((n.props??={}).slot=s,n))(i,t):((n,s)=>fo("span",{style:"display: contents;",slot:s},n))(i,t)))}));function ji(e){return Fe({name:e.name,inheritAttrs:!1,setup(t,{attrs:o,slots:i}){return()=>fo(e.tagName,o,Fn(i))}})}function _h(e){return`Pk${(e.startsWith("pk-")?e.slice(3):e).split("-").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join("")}`}function Sh(e){const t={};for(const[o,i]of Object.entries(e))t[o]=ji({name:_h(i),tagName:i});return t}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const en=globalThis,rr=en.ShadowRoot&&(en.ShadyCSS===void 0||en.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ar=Symbol(),ga=new WeakMap;let Zl=class{constructor(t,o,i){if(this._$cssResult$=!0,i!==ar)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=o}get styleSheet(){let t=this.o;const o=this.t;if(rr&&t===void 0){const i=o!==void 0&&o.length===1;i&&(t=ga.get(o)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&ga.set(o,t))}return t}toString(){return this.cssText}};const Pi=e=>new Zl(typeof e=="string"?e:e+"",void 0,ar),ot=(e,...t)=>{const o=e.length===1?e[0]:t.reduce((i,n,s)=>i+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+e[s+1],e[0]);return new Zl(o,e,ar)},Eh=(e,t)=>{if(rr)e.adoptedStyleSheets=t.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(const o of t){const i=document.createElement("style"),n=en.litNonce;n!==void 0&&i.setAttribute("nonce",n),i.textContent=o.cssText,e.appendChild(i)}},ma=rr?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let o="";for(const i of t.cssRules)o+=i.cssText;return Pi(o)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ch,defineProperty:Ah,getOwnPropertyDescriptor:$h,getOwnPropertyNames:Th,getOwnPropertySymbols:zh,getPrototypeOf:Ph}=Object,Nn=globalThis,va=Nn.trustedTypes,Mh=va?va.emptyScript:"",Lh=Nn.reactiveElementPolyfillSupport,wi=(e,t)=>e,vn={toAttribute(e,t){switch(t){case Boolean:e=e?Mh:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=e!==null;break;case Number:o=e===null?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch{o=null}}return o}},lr=(e,t)=>!Ch(e,t),ba={attribute:!0,type:String,converter:vn,reflect:!1,useDefault:!1,hasChanged:lr};Symbol.metadata??=Symbol("metadata"),Nn.litPropertyMetadata??=new WeakMap;let Eo=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,o=ba){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(t,o),!o.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(t,i,o);n!==void 0&&Ah(this.prototype,t,n)}}static getPropertyDescriptor(t,o,i){const{get:n,set:s}=$h(this.prototype,t)??{get(){return this[o]},set(r){this[o]=r}};return{get:n,set(r){const a=n?.call(this);s?.call(this,r),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ba}static _$Ei(){if(this.hasOwnProperty(wi("elementProperties")))return;const t=Ph(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(wi("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(wi("properties"))){const o=this.properties,i=[...Th(o),...zh(o)];for(const n of i)this.createProperty(n,o[n])}const t=this[Symbol.metadata];if(t!==null){const o=litPropertyMetadata.get(t);if(o!==void 0)for(const[i,n]of o)this.elementProperties.set(i,n)}this._$Eh=new Map;for(const[o,i]of this.elementProperties){const n=this._$Eu(o,i);n!==void 0&&this._$Eh.set(n,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const o=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const n of i)o.unshift(ma(n))}else t!==void 0&&o.push(ma(t));return o}static _$Eu(t,o){const i=o.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,o=this.constructor.elementProperties;for(const i of o.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Eh(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,o,i){this._$AK(t,i)}_$ET(t,o){const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const s=(i.converter?.toAttribute!==void 0?i.converter:vn).toAttribute(o,i.type);this._$Em=t,s==null?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(t,o){const i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const s=i.getPropertyOptions(n),r=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:vn;this._$Em=n;const a=r.fromAttribute(o,s.type);this[n]=a??this._$Ej?.get(n)??a,this._$Em=null}}requestUpdate(t,o,i,n=!1,s){if(t!==void 0){const r=this.constructor;if(n===!1&&(s=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??lr)(s,o)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,o,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,o,{useDefault:i,reflect:n,wrapped:s},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??o??this[t]),s!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(o=void 0),this._$AL.set(t,o)),n===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[n,s]of this._$Ep)this[n]=s;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,s]of i){const{wrapped:r}=s,a=this[n];r!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,s,a)}}let t=!1;const o=this._$AL;try{t=this.shouldUpdate(o),t?(this.willUpdate(o),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(o)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(o)}willUpdate(t){}_$AE(t){this._$EO?.forEach(o=>o.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(o=>this._$ET(o,this[o])),this._$EM()}updated(t){}firstUpdated(t){}};Eo.elementStyles=[],Eo.shadowRootOptions={mode:"open"},Eo[wi("elementProperties")]=new Map,Eo[wi("finalized")]=new Map,Lh?.({ReactiveElement:Eo}),(Nn.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const cr=globalThis,ya=e=>e,bn=cr.trustedTypes,ka=bn?bn.createPolicy("lit-html",{createHTML:e=>e}):void 0,Ql="$lit$",qe=`lit$${Math.random().toFixed(9).slice(2)}$`,tc="?"+qe,Oh=`<${tc}>`,go=document,Mi=()=>go.createComment(""),Li=e=>e===null||typeof e!="object"&&typeof e!="function",dr=Array.isArray,Rh=e=>dr(e)||typeof e?.[Symbol.iterator]=="function",cs=`[ 	
\f\r]`,ui=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,wa=/-->/g,xa=/>/g,eo=RegExp(`>|${cs}(?:([^\\s"'>=/]+)(${cs}*=${cs}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),_a=/'/g,Sa=/"/g,ec=/^(?:script|style|textarea|title)$/i,Ih=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),W=Ih(1),Qt=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),Ea=new WeakMap,ro=go.createTreeWalker(go,129);function oc(e,t){if(!dr(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return ka!==void 0?ka.createHTML(t):t}const Dh=(e,t)=>{const o=e.length-1,i=[];let n,s=t===2?"<svg>":t===3?"<math>":"",r=ui;for(let a=0;a<o;a++){const l=e[a];let d,u,p=-1,c=0;for(;c<l.length&&(r.lastIndex=c,u=r.exec(l),u!==null);)c=r.lastIndex,r===ui?u[1]==="!--"?r=wa:u[1]!==void 0?r=xa:u[2]!==void 0?(ec.test(u[2])&&(n=RegExp("</"+u[2],"g")),r=eo):u[3]!==void 0&&(r=eo):r===eo?u[0]===">"?(r=n??ui,p=-1):u[1]===void 0?p=-2:(p=r.lastIndex-u[2].length,d=u[1],r=u[3]===void 0?eo:u[3]==='"'?Sa:_a):r===Sa||r===_a?r=eo:r===wa||r===xa?r=ui:(r=eo,n=void 0);const v=r===eo&&e[a+1].startsWith("/>")?" ":"";s+=r===ui?l+Oh:p>=0?(i.push(d),l.slice(0,p)+Ql+l.slice(p)+qe+v):l+qe+(p===-2?a:v)}return[oc(e,s+(e[o]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]};class Oi{constructor({strings:t,_$litType$:o},i){let n;this.parts=[];let s=0,r=0;const a=t.length-1,l=this.parts,[d,u]=Dh(t,o);if(this.el=Oi.createElement(d,i),ro.currentNode=this.el.content,o===2||o===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(n=ro.nextNode())!==null&&l.length<a;){if(n.nodeType===1){if(n.hasAttributes())for(const p of n.getAttributeNames())if(p.endsWith(Ql)){const c=u[r++],v=n.getAttribute(p).split(qe),y=/([.?@])?(.*)/.exec(c);l.push({type:1,index:s,name:y[2],strings:v,ctor:y[1]==="."?Nh:y[1]==="?"?jh:y[1]==="@"?Bh:jn}),n.removeAttribute(p)}else p.startsWith(qe)&&(l.push({type:6,index:s}),n.removeAttribute(p));if(ec.test(n.tagName)){const p=n.textContent.split(qe),c=p.length-1;if(c>0){n.textContent=bn?bn.emptyScript:"";for(let v=0;v<c;v++)n.append(p[v],Mi()),ro.nextNode(),l.push({type:2,index:++s});n.append(p[c],Mi())}}}else if(n.nodeType===8)if(n.data===tc)l.push({type:2,index:s});else{let p=-1;for(;(p=n.data.indexOf(qe,p+1))!==-1;)l.push({type:7,index:s}),p+=qe.length-1}s++}}static createElement(t,o){const i=go.createElement("template");return i.innerHTML=t,i}}function Jo(e,t,o=e,i){if(t===Qt)return t;let n=i!==void 0?o._$Co?.[i]:o._$Cl;const s=Li(t)?void 0:t._$litDirective$;return n?.constructor!==s&&(n?._$AO?.(!1),s===void 0?n=void 0:(n=new s(e),n._$AT(e,o,i)),i!==void 0?(o._$Co??=[])[i]=n:o._$Cl=n),n!==void 0&&(t=Jo(e,n._$AS(e,t.values),n,i)),t}class Fh{constructor(t,o){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:o},parts:i}=this._$AD,n=(t?.creationScope??go).importNode(o,!0);ro.currentNode=n;let s=ro.nextNode(),r=0,a=0,l=i[0];for(;l!==void 0;){if(r===l.index){let d;l.type===2?d=new Bi(s,s.nextSibling,this,t):l.type===1?d=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(d=new Uh(s,this,t)),this._$AV.push(d),l=i[++a]}r!==l?.index&&(s=ro.nextNode(),r++)}return ro.currentNode=go,n}p(t){let o=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,o),o+=i.strings.length-2):i._$AI(t[o])),o++}}class Bi{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,o,i,n){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=o,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const o=this._$AM;return o!==void 0&&t?.nodeType===11&&(t=o.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,o=this){t=Jo(this,t,o),Li(t)?t===j||t==null||t===""?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==Qt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Rh(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==j&&Li(this._$AH)?this._$AA.nextSibling.data=t:this.T(go.createTextNode(t)),this._$AH=t}$(t){const{values:o,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Oi.createElement(oc(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(o);else{const s=new Fh(n,this),r=s.u(this.options);s.p(o),this.T(r),this._$AH=s}}_$AC(t){let o=Ea.get(t.strings);return o===void 0&&Ea.set(t.strings,o=new Oi(t)),o}k(t){dr(this._$AH)||(this._$AH=[],this._$AR());const o=this._$AH;let i,n=0;for(const s of t)n===o.length?o.push(i=new Bi(this.O(Mi()),this.O(Mi()),this,this.options)):i=o[n],i._$AI(s),n++;n<o.length&&(this._$AR(i&&i._$AB.nextSibling,n),o.length=n)}_$AR(t=this._$AA.nextSibling,o){for(this._$AP?.(!1,!0,o);t!==this._$AB;){const i=ya(t).nextSibling;ya(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class jn{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,o,i,n,s){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=o,this._$AM=n,this.options=s,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}_$AI(t,o=this,i,n){const s=this.strings;let r=!1;if(s===void 0)t=Jo(this,t,o,0),r=!Li(t)||t!==this._$AH&&t!==Qt,r&&(this._$AH=t);else{const a=t;let l,d;for(t=s[0],l=0;l<s.length-1;l++)d=Jo(this,a[i+l],o,l),d===Qt&&(d=this._$AH[l]),r||=!Li(d)||d!==this._$AH[l],d===j?t=j:t!==j&&(t+=(d??"")+s[l+1]),this._$AH[l]=d}r&&!n&&this.j(t)}j(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Nh extends jn{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===j?void 0:t}}class jh extends jn{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==j)}}class Bh extends jn{constructor(t,o,i,n,s){super(t,o,i,n,s),this.type=5}_$AI(t,o=this){if((t=Jo(this,t,o,0)??j)===Qt)return;const i=this._$AH,n=t===j&&i!==j||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==j&&(i===j||n);n&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Uh{constructor(t,o,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=o,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Jo(this,t)}}const Hh=cr.litHtmlPolyfillSupport;Hh?.(Oi,Bi),(cr.litHtmlVersions??=[]).push("3.3.3");const Vh=(e,t,o)=>{const i=o?.renderBefore??t;let n=i._$litPart$;if(n===void 0){const s=o?.renderBefore??null;i._$litPart$=n=new Bi(t.insertBefore(Mi(),s),s,void 0,o??{})}return n._$AI(e),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ur=globalThis;let xi=class extends Eo{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Vh(o,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Qt}};xi._$litElement$=!0,xi.finalized=!0,ur.litElementHydrateSupport?.({LitElement:xi});const qh=ur.litElementPolyfillSupport;qh?.({LitElement:xi});(ur.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Kh={attribute:!0,type:String,converter:vn,reflect:!1,hasChanged:lr},Wh=(e=Kh,t,o)=>{const{kind:i,metadata:n}=o;let s=globalThis.litPropertyMetadata.get(n);if(s===void 0&&globalThis.litPropertyMetadata.set(n,s=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),s.set(o.name,e),i==="accessor"){const{name:r}=o;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(r,l,e,!0,a)},init(a){return a!==void 0&&this.C(r,void 0,e,a),a}}}if(i==="setter"){const{name:r}=o;return function(a){const l=this[r];t.call(this,a),this.requestUpdate(r,l,e,!0,a)}}throw Error("Unsupported decorator location: "+i)};function S(e){return(t,o)=>typeof o=="object"?Wh(e,t,o):((i,n,s)=>{const r=n.hasOwnProperty(s);return n.constructor.createProperty(s,i),r?Object.getOwnPropertyDescriptor(n,s):void 0})(e,t,o)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Jt(e){return S({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Gh=(e,t,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(e,t,o),o);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Kt(e,t){return(o,i,n)=>{const s=r=>r.renderRoot?.querySelector(e)??null;return Gh(o,i,{get(){return s(this)}})}}var Zt=e=>(t,o)=>{const i=()=>{customElements.get(e)||customElements.define(e,t)};o!==void 0?o.addInitializer(i):i()},Ca=new Map;function Yh(e,t,o){const i=t.flatMap(r=>Array.isArray(r)?r:[r]).map(r=>"cssText"in r&&typeof r.cssText=="string"?r.cssText:Pi(r).cssText).join(`
`);if(!("adoptedStyleSheets"in Document.prototype)||typeof CSSStyleSheet>"u"){const r=o;if(!e.querySelector(`style[data-pk-adopted-styles="${r}"]`)){const a=document.createElement("style");a.dataset.pkAdoptedStyles=r,a.textContent=i,e.prepend(a)}return}const n=o;let s=Ca.get(n);s||(s=new CSSStyleSheet,s.replaceSync(i),Ca.set(n,s)),e.adoptedStyleSheets=[...e.adoptedStyleSheets,s]}var ic=ot`
    @layer pk-component {
        :host {
            display: inline-block;
            vertical-align: middle;
        }
    }
`;ot`
    .pk-focus-ring:focus {
        outline: none;
    }

    .pk-focus-ring:focus-visible {
        box-shadow: var(--pk-shadow-focus);
    }
`;var Xh=ot`
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
`,No,xe=(No=class extends xi{constructor(...t){super(...t),this.pkRenderFailed=!1}connectedCallback(){super.connectedCallback(),this.hasAttribute("data-pk")||this.setAttribute("data-pk","")}createRenderRoot(){const t=super.createRenderRoot();return Yh(t,[Xh],"pk-shadow-reset"),t}performUpdate(){if(!this.pkRenderFailed)try{const t=super.performUpdate();t instanceof Promise&&t.catch(o=>{this.handleRenderFailure(o)})}catch(t){this.handleRenderFailure(t)}}handleRenderFailure(t){const o=t instanceof Error?t:new Error(String(t));this.pkRenderFailed=!0,this.dispatchEvent(new CustomEvent("pk-error",{detail:{tagName:this.localName||this.tagName.toLowerCase(),message:o.message,stack:o.stack},bubbles:!0,composed:!0}));try{const i=this.renderRoot;if(i){i.textContent="";const n=document.createElement("div");n.setAttribute("part","error"),n.setAttribute("role","alert"),n.textContent="This control failed to load.",i.appendChild(n)}}catch{}}},No.shadowRootOptions={mode:"open",delegatesFocus:!0},No);function k(e,t,o,i){var n=arguments.length,s=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,o):i,r;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(e,t,o,i);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(s=(n<3?r(s):n>3?r(t,o,s):r(t,o))||s);return n>3&&s&&Object.defineProperty(t,o,s),s}function nc(e,t="var(--pk-btn-radius, var(--pk-radius-lg))"){const o=Pi(e),i=Pi(t);return ot`
        ${o} {
            border-top-left-radius: var(--pk-bg-start-start-radius, ${i});
            border-top-right-radius: var(--pk-bg-start-end-radius, ${i});
            border-bottom-left-radius: var(--pk-bg-end-start-radius, ${i});
            border-bottom-right-radius: var(--pk-bg-end-end-radius, ${i});
        }
    `}function pr(){return ot`
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
    `}function Jh(){return ot`
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
    `}function sc(e){const t=Pi(e);return ot`
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
    `}var rc={width:448,height:512,path:"M352 64c0-17.7-14.3-32-32-32L128 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l192 0c17.7 0 32-14.3 32-32zm96 128c0-17.7-14.3-32-32-32L32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32zM0 448c0 17.7 14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 416c-17.7 0-32 14.3-32 32zM352 320c0-17.7-14.3-32-32-32l-192 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l192 0c17.7 0 32-14.3 32-32z"},ac={width:448,height:512,path:"M448 64c0-17.7-14.3-32-32-32L32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32L32 288c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32L32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32z"},lc={width:448,height:512,path:"M288 64c0 17.7-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l224 0c17.7 0 32 14.3 32 32zm0 256c0 17.7-14.3 32-32 32L32 352c-17.7 0-32-14.3-32-32s14.3-32 32-32l224 0c17.7 0 32 14.3 32 32zM0 192c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 224c-17.7 0-32-14.3-32-32zM448 448c0 17.7-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"},cc={width:448,height:512,path:"M448 64c0 17.7-14.3 32-32 32L192 96c-17.7 0-32-14.3-32-32s14.3-32 32-32l224 0c17.7 0 32 14.3 32 32zm0 256c0 17.7-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l224 0c17.7 0 32 14.3 32 32zM0 192c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 224c-17.7 0-32-14.3-32-32zM448 448c0 17.7-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"},dc={width:384,height:512,path:"M169.4 502.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 402.7 224 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 370.7-105.4-105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"},uc={width:512,height:512,path:"M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 105.4-105.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"},pc={width:512,height:512,path:"M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"},hc={width:512,height:512,path:"M256 64c-56.8 0-107.9 24.7-143.1 64l47.1 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 192c-17.7 0-32-14.3-32-32L0 32C0 14.3 14.3 0 32 0S64 14.3 64 32l0 54.7C110.9 33.6 179.5 0 256 0 397.4 0 512 114.6 512 256S397.4 512 256 512c-87 0-163.9-43.4-210.1-109.7-10.1-14.5-6.6-34.4 7.9-44.6s34.4-6.6 44.6 7.9c34.8 49.8 92.4 82.3 157.6 82.3 106 0 192-86 192-192S362 64 256 64z"},fc={width:512,height:512,path:"M436.7 74.7L448 85.4 448 32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l47.9 0-7.6-7.2c-.2-.2-.4-.4-.6-.6-75-75-196.5-75-271.5 0s-75 196.5 0 271.5 196.5 75 271.5 0c8.2-8.2 15.5-16.9 21.9-26.1 10.1-14.5 30.1-18 44.6-7.9s18 30.1 7.9 44.6c-8.5 12.2-18.2 23.8-29.1 34.7-100 100-262.1 100-362 0S-25 175 75 75c99.9-99.9 261.7-100 361.7-.3z"},gc={width:384,height:512,path:"M214.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 109.3 160 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-370.7 105.4 105.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"},mc={width:512,height:512,path:"M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0-201.4 201.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3 448 192c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 96C35.8 96 0 131.8 0 176L0 432c0 44.2 35.8 80 80 80l256 0c44.2 0 80-35.8 80-80l0-80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 80c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l80 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 96z"},vc={width:448,height:512,path:"M224 0c17.7 0 32 14.3 32 32l0 168.6 144-83.1c15.3-8.8 34.9-3.6 43.7 11.7s3.6 34.9-11.7 43.7L288 256 432 339.1c15.3 8.8 20.6 28.4 11.7 43.7s-28.4 20.6-43.7 11.7L256 311.4 256 480c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-168.6-144 83.1c-15.3 8.8-34.9 3.6-43.7-11.7S.7 348 16 339.1L160 256 16 172.9C.7 164-4.5 144.5 4.3 129.1S32.7 108.6 48 117.4L192 200.6 192 32c0-17.7 14.3-32 32-32z"},bc={width:384,height:512,path:"M32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l32 0 0 320-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l224 0c70.7 0 128-57.3 128-128 0-46.5-24.8-87.3-62-109.7 18.7-22.3 30-51 30-82.3 0-70.7-57.3-128-128-128L32 32zM288 160c0 35.3-28.7 64-64 64l-96 0 0-128 96 0c35.3 0 64 28.7 64 64zM128 416l0-128 128 0c35.3 0 64 28.7 64 64s-28.7 64-64 64l-128 0z"},yc={width:576,height:512,path:"M416 32l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0c17.7 0 32 14.3 32 32l0 37.5c0 25.5 10.1 49.9 28.1 67.9l22.6 22.6-22.6 22.6c-18 18-28.1 42.4-28.1 67.9l0 37.5c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0c53 0 96-43 96-96l0-37.5c0-8.5 3.4-16.6 9.4-22.6l45.3-45.3c12.5-12.5 12.5-32.8 0-45.3l-45.3-45.3c-6-6-9.4-14.1-9.4-22.6l0-37.5c0-53-43-96-96-96zM160 32c-53 0-96 43-96 96l0 37.5c0 8.5-3.4 16.6-9.4 22.6L9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l45.3 45.3c6 6 9.4 14.1 9.4 22.6L64 384c0 53 43 96 96 96l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0c-17.7 0-32-14.3-32-32l0-37.5c0-25.5-10.1-49.9-28.1-67.9L77.3 256 99.9 233.4c18-18 28.1-42.4 28.1-67.9l0-37.5c0-17.7 14.3-32 32-32l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0z"},kc={width:448,height:512,path:"M128 0C110.3 0 96 14.3 96 32l0 32-32 0C28.7 64 0 92.7 0 128l0 48 448 0 0-48c0-35.3-28.7-64-64-64l-32 0 0-32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 32-128 0 0-32c0-17.7-14.3-32-32-32zM0 224L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-192-448 0z"},wc={width:320,height:512,path:"M140.3 376.8c12.6 10.2 31.1 9.5 42.8-2.2l128-128c9.2-9.2 11.9-22.9 6.9-34.9S301.4 192 288.5 192l-256 0c-12.9 0-24.6 7.8-29.6 19.8S.7 237.5 9.9 246.6l128 128 2.4 2.2z"},xc={width:320,height:512,path:"M140.3 135.2c12.6-10.3 31.1-9.5 42.8 2.2l128 128c9.2 9.2 11.9 22.9 6.9 34.9S301.4 320 288.5 320l-256 0c-12.9 0-24.6-7.8-29.6-19.8S.7 274.5 9.9 265.4l128-128 2.4-2.2z"},hr={width:448,height:512,path:"M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z"},fr={width:448,height:512,path:"M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"},_c={width:320,height:512,path:"M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"},gr={width:320,height:512,path:"M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"},Sc={width:448,height:512,path:"M201.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 173.3 54.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"},Ec={width:512,height:512,path:"M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0z"},Cc={width:512,height:512,path:"M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c5 5 11.8 7.5 18.8 7s13.4-4.1 17.5-9.8L379.3 179.2c7.8-10.7 5.4-25.7-5.3-33.5z"},Ac={width:512,height:512,path:"M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zm0-192a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.6 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z"},$c={width:512,height:512,path:"M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM224 160a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm-8 64l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"},Tc={width:384,height:512,path:"M320 32l-8.6 0C300.4 12.9 279.7 0 256 0L128 0C104.3 0 83.6 12.9 72.6 32L64 32C28.7 32 0 60.7 0 96L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-352c0-35.3-28.7-64-64-64zM136 112c-13.3 0-24-10.7-24-24s10.7-24 24-24l112 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-112 0z"},zc={width:512,height:512,path:"M256 0a256 256 0 1 1 0 512 256 256 0 1 1 0-512zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"},Pc={width:512,height:512,path:"M288 448l-224 0 0-224 48 0 0-64-48 0c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l224 0c35.3 0 64-28.7 64-64l0-48-64 0 0 48zm-64-96l224 0c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L224 0c-35.3 0-64 28.7-64 64l0 224c0 35.3 28.7 64 64 64z"},Mc={width:576,height:512,path:"M360.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm64.6 136.1c-12.5 12.5-12.5 32.8 0 45.3l73.4 73.4-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0zm-274.7 0c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 150.6 182.6c12.5-12.5 12.5-32.8 0-45.3z"},Lc={width:448,height:512,path:"M192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-200.6c0-17.4-7.1-34.1-19.7-46.2L370.6 17.8C358.7 6.4 342.8 0 326.3 0L192 0zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-16-64 0 0 16-192 0 0-256 16 0 0-64-16 0z"},Oc={width:448,height:512,path:"M256 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 210.7-41.4-41.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 242.7 256 32zM64 320c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-46.9 0-56.6 56.6c-31.2 31.2-81.9 31.2-113.1 0L110.9 320 64 320zm304 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"},Rc={width:448,height:512,path:"M0 256a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm168 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm224-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"},Ic={width:512,height:512,path:"M502.6 54.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L413 53.8C369.6 20.1 315.2 0 256 0 114.6 0 0 114.6 0 256 0 315.2 20.1 369.6 53.8 413L9.4 457.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L99 458.2c43.3 33.7 97.8 53.8 157 53.8 141.4 0 256-114.6 256-256 0-59.2-20.1-113.6-53.8-157l44.4-44.4zM367.2 99.5L99.5 367.2C77.1 335.9 64 297.5 64 256 64 150 150 64 256 64 297.5 64 335.9 77.1 367.2 99.5zm-222.5 313L412.5 144.8c22.4 31.4 35.5 69.8 35.5 111.2 0 106-86 192-192 192-41.5 0-79.9-13.1-111.2-35.5z"},Dc={width:576,height:512,path:"M288 32c-80.8 0-145.5 36.8-192.6 80.6-46.8 43.5-78.1 95.4-93 131.1-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64-11.5 0-22.3-3-31.7-8.4-1 10.9-.1 22.1 2.9 33.2 13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-12.2-45.7-55.5-74.8-101.1-70.8 5.3 9.3 8.4 20.1 8.4 31.7z"},Fc={width:576,height:512,path:"M272 48L160 48c-8.8 0-16 7.2-16 16l0 176-48 0 0-176c0-35.3 28.7-64 64-64L293.5 0c17 0 33.3 6.7 45.3 18.7L461.3 141.3c12 12 18.7 28.3 18.7 45.3l0 53.5-48 0 0-32-88 0c-39.8 0-72-32.2-72-72l0-88zM96 384l48 0 0 64c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16l0-64 48 0 0 64c0 35.3-28.7 64-64 64l-256 0c-35.3 0-64-28.7-64-64l0-64zM412.1 160L320 67.9 320 136c0 13.3 10.7 24 24 24l68.1 0zM24 288l112 0c13.3 0 24 10.7 24 24s-10.7 24-24 24L24 336c-13.3 0-24-10.7-24-24s10.7-24 24-24zm208 0l112 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-112 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm208 0l112 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-112 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"},Nc={width:448,height:512,path:"M32 0C49.7 0 64 14.3 64 32l0 16 69-17.2c38.1-9.5 78.3-5.1 113.5 12.5 46.3 23.2 100.8 23.2 147.1 0l9.6-4.8C423.8 28.1 448 43.1 448 66.1l0 279.7c0 13.3-8.3 25.3-20.8 30l-34.7 13c-46.2 17.3-97.6 14.6-141.7-7.4-37.9-19-81.4-23.7-122.5-13.4L64 384 64 480c0 17.7-14.3 32-32 32S0 497.7 0 480L0 32C0 14.3 14.3 0 32 0zM64 187.1l64-13.9 0 65.5-64 13.9 0 65.5 48.8-12.2c5.1-1.3 10.1-2.4 15.2-3.3l0-63.9 38.9-8.4c8.3-1.8 16.7-2.5 25.1-2.1l0-64c13.6 .4 27.2 2.6 40.4 6.4l23.6 6.9 0 66.7-41.7-12.3c-7.3-2.1-14.8-3.4-22.3-3.8l0 71.4c21.8 1.9 43.3 6.7 64 14.4l0-69.8 22.7 6.7c13.5 4 27.3 6.4 41.3 7.4l0-64.2c-7.8-.8-15.6-2.3-23.2-4.5l-40.8-12 0-62c-13-3.8-25.8-8.8-38.2-15-8.2-4.1-16.9-7-25.8-8.8l0 72.4c-13-.4-26 .8-38.7 3.6l-25.3 5.5 0-75.2-64 16 0 73.1zM320 335.7c16.8 1.5 33.9-.7 50-6.8l14-5.2 0-71.7-7.9 1.8c-18.4 4.3-37.3 5.7-56.1 4.5l0 77.4zm64-149.4l0-70.8c-20.9 6.1-42.4 9.1-64 9.1l0 69.4c13.9 1.4 28 .5 41.7-2.6l22.3-5.2z"},jc={width:448,height:512,path:"M71.3 295.6c-21.9-21.9-21.9-57.3 0-79.2s57.3-21.9 79.2 0 21.9 57.3 0 79.2s-57.4 21.9-79.2 0zM184.4 182.5c-21.9-21.9-21.9-57.3 0-79.2s57.3-21.9 79.2 0 21.9 57.3 0 79.2-57.3 21.8-79.2 0zm0 147c21.9-21.9 57.3-21.9 79.2 0s21.9 57.3 0 79.2s-57.3 21.9-79.2 0c-21.9-21.8-21.9-57.3 0-79.2zM297.5 216.4c21.9-21.9 57.3-21.9 79.2 0s21.9 57.3 0 79.2s-57.3 21.9-79.2 0c-21.8-21.9-21.8-57.3 0-79.2z"},Bc={width:512,height:512,path:"M64 224a64 64 0 1 1 0-128 64 64 0 1 1 0 128zM256 96a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm192 0a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm0 192a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM256 416a64 64 0 1 1 0-128 64 64 0 1 1 0 128zM64 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"},Uc={width:320,height:512,path:"M128 64A64 64 0 1 0 0 64 64 64 0 1 0 128 64zm0 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zM0 448c0 35.3 28.7 64 64 64s64-28.7 64-64-28.7-64-64-64-64 28.7-64 64zM320 64a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zM192 256a64 64 0 1 0 128 0 64 64 0 1 0 -128 0zM320 448c0-35.3-28.7-64-64-64s-64 28.7-64 64 28.7 64 64 64 64-28.7 64-64z"},Hc={width:512,height:512,path:"M448 96c0-11.1-5.7-21.4-15.2-27.2s-21.2-6.4-31.1-1.4l-64 32c-15.8 7.9-22.2 27.1-14.3 42.9s27.1 22.2 42.9 14.3l17.7-8.8 0 236.2-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0 0-288zM64 96c0-17.7-14.3-32-32-32S0 78.3 0 96L0 416c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 128 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-128 0 0-128z"},Vc={width:576,height:512,path:"M96 96c0-17.7-14.3-32-32-32S32 78.3 32 96l0 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 96 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-96 0 0-128zM368 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l81.1 0c21.5 0 38.9 17.4 38.9 38.9 0 13.9-7.5 26.8-19.6 33.8l-76.3 43.6C347.5 269.7 320 317.1 320 368.5l0 47.5c0 17.7 14.3 32 32 32l160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-128 0 0-15.5c0-28.4 15.2-54.6 39.9-68.7l76.3-43.6C532.2 237.9 552 203.8 552 166.9 552 110.1 505.9 64 449.1 64L368 64z"},qc={width:576,height:512,path:"M96 96c0-17.7-14.3-32-32-32S32 78.3 32 96l0 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 96 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-96 0 0-128zM352 256c0 17.7 14.3 32 32 32l56 0c26.5 0 48 21.5 48 48s-21.5 48-48 48l-88 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l88 0c61.9 0 112-50.1 112-112 0-31.3-12.9-59.7-33.6-80 20.7-20.3 33.6-48.7 33.6-80 0-61.9-50.1-112-112-112l-88 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l88 0c26.5 0 48 21.5 48 48s-21.5 48-48 48l-56 0c-17.7 0-32 14.3-32 32z"},Kc={width:512,height:512,path:"M64 96c0-17.7-14.3-32-32-32S0 78.3 0 96L0 416c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 96 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-96 0 0-128zm288 0c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 44.2 35.8 80 80 80l80 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-80 0c-8.8 0-16-7.2-16-16l0-112z"},Wc={width:576,height:512,path:"M96 96c0-17.7-14.3-32-32-32S32 78.3 32 96l0 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 96 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-96 0 0-128zM352 64c-17.7 0-32 14.3-32 32l0 144c0 17.7 14.3 32 32 32l80 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-80 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l80 0c66.3 0 120-53.7 120-120S498.3 208 432 208l-48 0 0-80 120 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L352 64z"},Gc={width:512,height:512,path:"M32 64c17.7 0 32 14.3 32 32l0 128 96 0 0-128c0-17.7 14.3-32 32-32s32 14.3 32 32l0 320c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-128-96 0 0 128c0 17.7-14.3 32-32 32S0 433.7 0 416L0 96C0 78.3 14.3 64 32 64zm352 64c-17.7 0-32 14.3-32 32l0 53.5c10-3.5 20.8-5.5 32-5.5l32 0c53 0 96 43 96 96l0 48c0 53-43 96-96 96l-32 0c-53 0-96-43-96-96l0-192c0-53 43-96 96-96l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0zM352 304l0 48c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-48c0-17.7-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32z"},Yc={width:576,height:512,path:"M315 315L473.4 99.9 444.1 70.6 229 229 315 315zm-187 5l0 0 0-71.7c0-15.3 7.2-29.6 19.5-38.6L420.6 8.4C428 2.9 437 0 446.2 0 457.6 0 468.5 4.5 476.6 12.6l54.8 54.8c8.1 8.1 12.6 19 12.6 30.5 0 9.2-2.9 18.2-8.4 25.6L334.4 396.5c-9 12.3-23.4 19.5-38.6 19.5l-71.7 0-25.4 25.4c-12.5 12.5-32.8 12.5-45.3 0l-50.7-50.7c-12.5-12.5-12.5-32.8 0-45.3L128 320zM7 466.3l51.7-51.7 70.6 70.6-19.7 19.7c-4.5 4.5-10.6 7-17 7L24 512c-13.3 0-24-10.7-24-24l0-4.7c0-6.4 2.5-12.5 7-17z"},Xc={width:512,height:512,path:"M277.8 8.6c-12.3-11.4-31.3-11.4-43.5 0l-224 208c-9.6 9-12.8 22.9-8 35.1S18.8 272 32 272l16 0 0 176c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-176 16 0c13.2 0 25-8.1 29.8-20.3s1.6-26.2-8-35.1l-224-208zM240 320l32 0c26.5 0 48 21.5 48 48l0 96-128 0 0-96c0-26.5 21.5-48 48-48z"},Jc={width:384,height:512,path:"M128 64c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-58.7 0-133.3 320 64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l58.7 0 133.3-320-64 0c-17.7 0-32-14.3-32-32z"},Zc={width:384,height:512,path:"M292.9 384c7.3-22.3 21.9-42.5 38.4-59.9 32.7-34.4 52.7-80.9 52.7-132.1 0-106-86-192-192-192S0 86 0 192c0 51.2 20 97.7 52.7 132.1 16.5 17.4 31.2 37.6 38.4 59.9l201.7 0zM288 432l-192 0 0 16c0 44.2 35.8 80 80 80l32 0c44.2 0 80-35.8 80-80l0-16zM184 112c-39.8 0-72 32.2-72 72 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-66.3 53.7-120 120-120 13.3 0 24 10.7 24 24s-10.7 24-24 24z"},Qc={width:576,height:512,path:"M419.5 96c-16.6 0-32.7 4.5-46.8 12.7-15.8-16-34.2-29.4-54.5-39.5 28.2-24 64.1-37.2 101.3-37.2 86.4 0 156.5 70 156.5 156.5 0 41.5-16.5 81.3-45.8 110.6l-71.1 71.1c-29.3 29.3-69.1 45.8-110.6 45.8-86.4 0-156.5-70-156.5-156.5 0-1.5 0-3 .1-4.5 .5-17.7 15.2-31.6 32.9-31.1s31.6 15.2 31.1 32.9c0 .9 0 1.8 0 2.6 0 51.1 41.4 92.5 92.5 92.5 24.5 0 48-9.7 65.4-27.1l71.1-71.1c17.3-17.3 27.1-40.9 27.1-65.4 0-51.1-41.4-92.5-92.5-92.5zM275.2 173.3c-1.9-.8-3.8-1.9-5.5-3.1-12.6-6.5-27-10.2-42.1-10.2-24.5 0-48 9.7-65.4 27.1L91.1 258.2c-17.3 17.3-27.1 40.9-27.1 65.4 0 51.1 41.4 92.5 92.5 92.5 16.5 0 32.6-4.4 46.7-12.6 15.8 16 34.2 29.4 54.6 39.5-28.2 23.9-64 37.2-101.3 37.2-86.4 0-156.5-70-156.5-156.5 0-41.5 16.5-81.3 45.8-110.6l71.1-71.1c29.3-29.3 69.1-45.8 110.6-45.8 86.6 0 156.5 70.6 156.5 156.9 0 1.3 0 2.6 0 3.9-.4 17.7-15.1 31.6-32.8 31.2s-31.6-15.1-31.2-32.8c0-.8 0-1.5 0-2.3 0-33.7-18-63.3-44.8-79.6z"},td={width:384,height:512,path:"M128 96l0 64 128 0 0-64c0-35.3-28.7-64-64-64s-64 28.7-64 64zM64 160l0-64C64 25.3 121.3-32 192-32S320 25.3 320 96l0 64c35.3 0 64 28.7 64 64l0 224c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 224c0-35.3 28.7-64 64-64z"},ed={width:512,height:512,path:"M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z"},od={width:512,height:512,path:"M0 72C0 58.8 10.7 48 24 48l48 0c13.3 0 24 10.7 24 24l0 104 24 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-96 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l24 0 0-80-24 0C10.7 96 0 85.3 0 72zM30.4 301.2C41.8 292.6 55.7 288 70 288l4.9 0c33.7 0 61.1 27.4 61.1 61.1 0 19.6-9.4 37.9-25.2 49.4l-24 17.5 33.2 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-90.7 0C13.1 464 0 450.9 0 434.7 0 425.3 4.5 416.5 12.1 411l70.5-51.3c3.4-2.5 5.4-6.4 5.4-10.6 0-7.2-5.9-13.1-13.1-13.1L70 336c-3.9 0-7.7 1.3-10.8 3.6L38.4 355.2c-10.6 8-25.6 5.8-33.6-4.8S-1 324.8 9.6 316.8l20.8-15.6zM224 64l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"},id={width:512,height:512,path:"M48 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM48 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM96 256a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"},nd={width:448,height:512,path:"M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"},sd={width:448,height:512,path:"M0 64C0 46.3 14.3 32 32 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-16 0 0 112 224 0 0-112-16 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-16 0 0 320 16 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l16 0 0-144-224 0 0 144 16 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l16 0 0-320-16 0C14.3 96 0 81.7 0 64z"},rd={width:448,height:512,path:"M160 0L416 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0 0 416c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-416-48 0 0 416c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160-48 0C71.6 320 0 248.4 0 160S71.6 0 160 0z"},ad={width:512,height:512,path:"M352.9 21.2L308 66.1 445.9 204 490.8 159.1C504.4 145.6 512 127.2 512 108s-7.6-37.6-21.2-51.1L455.1 21.2C441.6 7.6 423.2 0 404 0s-37.6 7.6-51.1 21.2zM274.1 100L58.9 315.1c-10.7 10.7-18.5 24.1-22.6 38.7L.9 481.6c-2.3 8.3 0 17.3 6.2 23.4s15.1 8.5 23.4 6.2l127.8-35.5c14.6-4.1 27.9-11.8 38.7-22.6L412 237.9 274.1 100z"},ld={width:448,height:512,path:"M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"},cd={width:512,height:512,path:"M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"},dd={width:448,height:512,path:"M448 296c0 66.3-53.7 120-120 120l-8 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l8 0c30.9 0 56-25.1 56-56l0-8-64 0c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l64 0c35.3 0 64 28.7 64 64l0 136zm-256 0c0 66.3-53.7 120-120 120l-8 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l8 0c30.9 0 56-25.1 56-56l0-8-64 0c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l64 0c35.3 0 64 28.7 64 64l0 136z"},ud={width:512,height:512,path:"M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"},pd={width:512,height:512,path:"M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"},hd={width:512,height:512,path:"M307.8 18.4c-12 5-19.8 16.6-19.8 29.6l0 80-112 0c-97.2 0-176 78.8-176 176 0 113.3 81.5 163.9 100.2 174.1 2.5 1.4 5.3 1.9 8.1 1.9 10.9 0 19.7-8.9 19.7-19.7 0-7.5-4.3-14.4-9.8-19.5-9.4-8.8-22.2-26.4-22.2-56.7 0-53 43-96 96-96l96 0 0 80c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-9.2-9.2-22.9-11.9-34.9-6.9z"},fd={width:576,height:512,path:"M32 448L160 64h64l128 384h-64l-32-96H128l-32 96H32zm117.3-160h85.3L192 160l-42.7 128zM336 448l80-240h48l80 240h-48l-16-48h-80l-16 48h-48zm80-96h48l-24-72-24 72z"},gd={width:512,height:512,path:"M32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 224zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384z"},md={width:512,height:512,path:"M0 416c0 8.8 7.2 16 16 16l65.6 0c7.4 36.5 39.7 64 78.4 64s71-27.5 78.4-64L496 432c8.8 0 16-7.2 16-16s-7.2-16-16-16l-257.6 0c-7.4-36.5-39.7-64-78.4-64s-71 27.5-78.4 64L16 400c-8.8 0-16 7.2-16 16zm112 0a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM304 256a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm48-80c-38.7 0-71 27.5-78.4 64L16 240c-8.8 0-16 7.2-16 16s7.2 16 16 16l257.6 0c7.4 36.5 39.7 64 78.4 64s71-27.5 78.4-64l65.6 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-65.6 0c-7.4-36.5-39.7-64-78.4-64zM192 144a48 48 0 1 1 0-96 48 48 0 1 1 0 96zm78.4-64C263 43.5 230.7 16 192 16s-71 27.5-78.4 64L16 80C7.2 80 0 87.2 0 96s7.2 16 16 16l97.6 0c7.4 36.5 39.7 64 78.4 64s71-27.5 78.4-64L496 112c8.8 0 16-7.2 16-16s-7.2-16-16-16L270.4 80z"},vd={width:512,height:512,path:"M96 157.5C96 88.2 152.2 32 221.5 32L368 32c17.7 0 32 14.3 32 32s-14.3 32-32 32L221.5 96c-34 0-61.5 27.5-61.5 61.5 0 31 23.1 57.2 53.9 61l44.1 5.5 222 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l83.1 0C103 204.6 96 181.8 96 157.5zM349.2 336l65.5 0c.9 6.1 1.4 12.2 1.4 18.5 0 69.3-56.2 125.5-125.5 125.5L144 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l146.5 0c34 0 61.5-27.5 61.5-61.5 0-6.4-1-12.7-2.8-18.5z"},bd={width:576,height:512,path:"M96 64C78.3 64 64 78.3 64 96s14.3 32 32 32l15.3 0 89.6 128-89.6 128-15.3 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0c10.4 0 20.2-5.1 26.2-13.6L240 311.8 325.8 434.4c6 8.6 15.8 13.6 26.2 13.6l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-15.3 0-89.6-128 89.6-128 15.3 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0c-10.4 0-20.2 5.1-26.2 13.6L240 200.2 154.2 77.6C148.2 69.1 138.4 64 128 64L96 64zM544 320c0-11.1-5.7-21.4-15.2-27.2s-21.2-6.4-31.1-1.4l-32 16c-15.8 7.9-22.2 27.1-14.3 42.9 5.6 11.2 16.9 17.7 28.6 17.7l0 80c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-128z"},yd={width:576,height:512,path:"M544 32c0-11.1-5.7-21.4-15.2-27.2s-21.2-6.4-31.1-1.4l-32 16C449.9 27.3 443.5 46.5 451.4 62.3 457 73.5 468.3 80 480 80l0 80c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-128zM96 64C78.3 64 64 78.3 64 96s14.3 32 32 32l15.3 0 89.6 128-89.6 128-15.3 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0c10.4 0 20.2-5.1 26.2-13.6L240 311.8 325.8 434.4c6 8.6 15.8 13.6 26.2 13.6l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-15.3 0-89.6-128 89.6-128 15.3 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0c-10.4 0-20.2 5.1-26.2 13.6L240 200.2 154.2 77.6C148.2 69.1 138.4 64 128 64L96 64z"},kd={width:448,height:512,path:"M384 32c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64l-320 0-6.5-.3C25.2 476.4 0 449.1 0 416L0 96C0 60.7 28.7 32 64 32l320 0zM64 320l0 96 128 0 0-96-128 0zm192 0l0 96 128 0 0-96-128 0zM64 256l128 0 0-96-128 0 0 96zm192 0l128 0 0-96-128 0 0 96z"},wd={width:576,height:512,path:"M41-24.9c-9.4-9.4-24.6-9.4-33.9 0S-2.3-.3 7 9.1l528 528c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L322.7 256.9 368.2 96 471 96 465 120.2c-4.3 17.1 6.1 34.5 23.3 38.8s34.5-6.1 38.8-23.3l11-44.1C545.6 61.3 522.7 32 491.5 32l-319 0c-19.8 0-37.3 12.1-44.5 30.1l-87-87zM180.4 114.5l4.6-18.5 116.7 0-30.8 109-90.5-90.5zM241 310.8L211.3 416 160 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-42.2 0 15.1-53.3-51.9-51.9z"},xd={width:512,height:512,path:"M256 0c14.7 0 28.2 8.1 35.2 21l216 400c6.7 12.4 6.4 27.4-.8 39.5S486.1 480 472 480L40 480c-14.1 0-27.2-7.4-34.4-19.5s-7.5-27.1-.8-39.5l216-400c7-12.9 20.5-21 35.2-21zm0 352a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.5 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z"},_d={width:384,height:512,path:"M0 32C0 14.3 14.3 0 32 0L96 0c17.7 0 32 14.3 32 32S113.7 64 96 64l0 160c0 53 43 96 96 96s96-43 96-96l0-160c-17.7 0-32-14.3-32-32S270.3 0 288 0l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 160c0 88.4-71.6 160-160 160S32 312.4 32 224L32 64C14.3 64 0 49.7 0 32zM0 480c0-17.7 14.3-32 32-32l320 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 512c-17.7 0-32-14.3-32-32z"},Sd={width:384,height:512,path:"M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"},Ed={width:128,height:512,path:"M64 144a56 56 0 1 1 0-112 56 56 0 1 1 0 112zm0 224c30.9 0 56 25.1 56 56s-25.1 56-56 56-56-25.1-56-56 25.1-56 56-56zm56-112c0 30.9-25.1 56-56 56s-56-25.1-56-56 25.1-56 56-56 56 25.1 56 56z"},Cd={width:512,height:512,path:"M195.1 9.5C198.1-5.3 211.2-16 226.4-16l59.8 0c15.2 0 28.3 10.7 31.3 25.5L332 79.5c14.1 6 27.3 13.7 39.3 22.8l67.8-22.5c14.4-4.8 30.2 1.2 37.8 14.4l29.9 51.8c7.6 13.2 4.9 29.8-6.5 39.9L447 233.3c.9 7.4 1.3 15 1.3 22.7s-.5 15.3-1.3 22.7l53.4 47.5c11.4 10.1 14 26.8 6.5 39.9l-29.9 51.8c-7.6 13.1-23.4 19.2-37.8 14.4l-67.8-22.5c-12.1 9.1-25.3 16.7-39.3 22.8l-14.4 69.9c-3.1 14.9-16.2 25.5-31.3 25.5l-59.8 0c-15.2 0-28.3-10.7-31.3-25.5l-14.4-69.9c-14.1-6-27.2-13.7-39.3-22.8L73.5 432.3c-14.4 4.8-30.2-1.2-37.8-14.4L5.8 366.1c-7.6-13.2-4.9-29.8 6.5-39.9l53.4-47.5c-.9-7.4-1.3-15-1.3-22.7s.5-15.3 1.3-22.7L12.3 185.8c-11.4-10.1-14-26.8-6.5-39.9L35.7 94.1c7.6-13.2 23.4-19.2 37.8-14.4l67.8 22.5c12.1-9.1 25.3-16.7 39.3-22.8L195.1 9.5zM256.3 336a80 80 0 1 0 -.6-160 80 80 0 1 0 .6 160z"},Ad={width:512,height:512,path:"M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L368 46.1 465.9 144 490.3 119.6c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L432 177.9 334.1 80 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"},$d={width:448,height:512,path:"M136.7 5.9L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-8.7-26.1C306.9-7.2 294.7-16 280.9-16L167.1-16c-13.8 0-26 8.8-30.4 21.9zM416 144L32 144 53.1 467.1C54.7 492.4 75.7 512 101 512L347 512c25.3 0 46.3-19.6 47.9-44.9L416 144z"},Zh={alignCenter:rc,alignJustify:ac,alignLeft:lc,alignRight:cc,arrowDown:dc,arrowLeft:uc,arrowRight:pc,arrowRotateLeft:hc,arrowRotateRight:fc,arrowUp:gc,arrowUpRightFromSquare:mc,asterisk:vc,bold:bc,bracketsCurly:yc,calendar:kc,caretDown:wc,caretUp:xc,check:hr,chevronDown:fr,chevronLeft:_c,chevronRight:gr,chevronUp:Sc,circle:Ec,circleCheck:Cc,circleExclamation:Ac,circleInfo:$c,clipboard:Tc,clock:zc,clone:Pc,code:Mc,copy:Lc,download:Oc,ellipsis:Rc,ellipsisVertical:Ed,emptySet:Ic,eye:Dc,fileDashedLine:Fc,flagCheckered:Nc,gear:Cd,gripDots:Bc,gripDotsVertical:Uc,gripMove:jc,h1:Hc,h2:Vc,h3:qc,h4:Kc,h5:Wc,h6:Gc,heading:sd,highlighter:Yc,house:Xc,italic:Jc,lightbulb:Zc,link:Qc,lock:td,list:ed,listOl:od,listUl:id,minus:nd,paragraph:rd,pen:ad,penToSquare:Ad,plus:ld,circlePlus:cd,quoteRight:dd,arrowsRotate:ud,magnifyingGlass:pd,share:hd,smallCaps:fd,sliders:gd,slidersOutline:md,strikethrough:vd,subscript:bd,superscript:yd,table:kd,textSlash:wd,trash:$d,triangleExclamation:xd,underline:_d,xmark:Sd},Qh=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Bn=e=>{const t=e.trim();return t&&(/[A-Z]/.test(t)?Qh(t):t.toLowerCase())},ds="__PK_ICON_REGISTRY__",us="__PK_ICON_REGISTRY_LISTENERS__",Un=()=>{const e=globalThis;return e[ds]||(e[ds]={}),e[ds]},Td=()=>{const e=globalThis;return e[us]||(e[us]=new Set),e[us]},zd=()=>{for(const e of Td())try{e()}catch{}},tf=e=>{const t=Td();return t.add(e),()=>{t.delete(e)}},ef=()=>Object.keys(Un()).sort(),of=e=>{if(!e)return;const t=Un();return t[Bn(e)]??t[e]},nf=(e,t)=>{const o=Bn(e);if(!o)throw new Error("registerIcon: name must be a non-empty string");if(!t?.path||!t.width||!t.height)throw new Error(`registerIcon: icon "${o}" must include width, height, and path`);Un()[o]=t,zd()},sf=e=>{let t=!1;for(const[o,i]of Object.entries(e)){const n=Bn(o);if(!n)throw new Error("registerIcon: name must be a non-empty string");if(!i?.path||!i.width||!i.height)throw new Error(`registerIcon: icon "${n}" must include width, height, and path`);Un()[n]=i,t=!0}t&&zd()},Aa=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),Pd=e=>{const{width:t,height:o}=e;if(t===o)return`0 0 ${t} ${o}`;const i=Math.max(t,o);return`${(t-i)/2} ${(o-i)/2} ${i} ${i}`},mr=(e,t={})=>{const{title:o,className:i,attributes:n={}}=t,s={xmlns:"http://www.w3.org/2000/svg",viewBox:Pd(e),overflow:"visible",...n};return i&&(s.class=i),o?(s.role="img",s["aria-label"]=o):(s["aria-hidden"]="true",s.focusable="false"),`<svg ${Object.entries(s).map(([r,a])=>`${r}="${Aa(a)}"`).join(" ")}><path fill="currentColor" d="${Aa(e.path)}"/></svg>`};const rf=Object.freeze(Object.defineProperty({__proto__:null,alignCenter:rc,alignJustify:ac,alignLeft:lc,alignRight:cc,arrowDown:dc,arrowLeft:uc,arrowRight:pc,arrowRotateLeft:hc,arrowRotateRight:fc,arrowUp:gc,arrowUpRightFromSquare:mc,arrowsRotate:ud,asterisk:vc,bold:bc,bracketsCurly:yc,calendar:kc,caretDown:wc,caretUp:xc,check:hr,chevronDown:fr,chevronLeft:_c,chevronRight:gr,chevronUp:Sc,circle:Ec,circleCheck:Cc,circleExclamation:Ac,circleInfo:$c,circlePlus:cd,clipboard:Tc,clock:zc,clone:Pc,code:Mc,copy:Lc,download:Oc,ellipsis:Rc,ellipsisVertical:Ed,emptySet:Ic,eye:Dc,fileDashedLine:Fc,flagCheckered:Nc,gear:Cd,getIcon:of,getIconNames:ef,gripDots:Bc,gripDotsVertical:Uc,gripMove:jc,h1:Hc,h2:Vc,h3:qc,h4:Kc,h5:Wc,h6:Gc,heading:sd,highlighter:Yc,house:Xc,iconToSvg:mr,iconViewBox:Pd,icons:Zh,italic:Jc,lightbulb:Zc,link:Qc,list:ed,listOl:od,listUl:id,lock:td,magnifyingGlass:pd,minus:nd,normalizeIconName:Bn,paragraph:rd,pen:ad,penToSquare:Ad,plus:ld,quoteRight:dd,registerIcon:nf,registerIcons:sf,share:hd,sliders:gd,slidersOutline:md,smallCaps:fd,strikethrough:vd,subscribeIconRegistry:tf,subscript:bd,superscript:yd,table:kd,textSlash:wd,trash:$d,triangleExclamation:xd,underline:_d,xmark:Sd},Symbol.toStringTag,{value:"Module"}));var Ui=(e,t={})=>mr(e,{title:t.title}),af=(e,t={})=>{const o=document.createElement("template");o.innerHTML=Ui(e,t);const i=o.content.firstElementChild;if(!(i instanceof SVGSVGElement))throw new Error("Icon render did not produce an SVG element.");return i},Ls=Object.defineProperty,lf=Object.getOwnPropertyDescriptor,cf=Object.getOwnPropertyNames,df=Object.prototype.hasOwnProperty,uf=(e,t)=>{let o={};for(var i in e)Ls(o,i,{get:e[i],enumerable:!0});return Ls(o,Symbol.toStringTag,{value:"Module"}),o},pf=(e,t,o,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(var n=cf(t),s=0,r=n.length,a;s<r;s++)a=n[s],!df.call(e,a)&&a!==o&&Ls(e,a,{get:(l=>t[l]).bind(null,a),enumerable:!(i=lf(t,a))||i.enumerable});return e},hf=(e,t,o)=>(pf(e,t,"default"),o),ff="M64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l208 0 32 0 16 0 256 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L320 64l-16 0-32 0L64 64zm512 48c8.8 0 16 7.2 16 16l0 256c0 8.8-7.2 16-16 16l-256 0 0-288 256 0zM178.3 175.9l64 144c4.5 10.1-.1 21.9-10.2 26.4s-21.9-.1-26.4-10.2L196.8 316l-73.6 0-8.9 20.1c-4.5 10.1-16.3 14.6-26.4 10.2s-14.6-16.3-10.2-26.4l64-144c3.2-7.2 10.4-11.9 18.3-11.9s15.1 4.7 18.3 11.9zM179 276l-19-42.8L141 276l38 0zM456 164c-11 0-20 9-20 20l0 4-52 0c-11 0-20 9-20 20s9 20 20 20l72 0 35.1 0c-7.3 16.7-17.4 31.9-29.8 45l-.5-.5-14.6-14.6c-7.8-7.8-20.5-7.8-28.3 0s-7.8 20.5 0 28.3L430 298.3c-5.9 3.6-12.1 6.9-18.5 9.8l-3.6 1.6c-10.1 4.5-14.6 16.3-10.2 26.4s16.3 14.6 26.4 10.2l3.6-1.6c12-5.3 23.4-11.8 34-19.4c4.3 3 8.6 5.8 13.1 8.5l18.9 11.3c9.5 5.7 21.8 2.6 27.4-6.9s2.6-21.8-6.9-27.4l-18.9-11.3c-.9-.5-1.8-1.1-2.7-1.6c17.2-18.8 30.7-40.9 39.6-65.4L534 228l2 0c11 0 20-9 20-20s-9-20-20-20l-16 0-44 0 0-4c0-11-9-20-20-20z",gf=()=>{const e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("aria-hidden","true"),e.setAttribute("xmlns","http://www.w3.org/2000/svg"),e.setAttribute("viewBox","0 0 640 512");const t=document.createElementNS("http://www.w3.org/2000/svg","path");return t.setAttribute("d",ff),e.append(t),e},Md=uf({createIconElement:()=>af,createTranslationIconElement:()=>gf,renderIconHtml:()=>Ui});hf(Md,rf);function mf(e="default"){return e==="xxs"||e==="xs"?"xxs":e==="lg"||e==="xl"?"sm":"xs"}function vf(e="default",t){return t||(e==="primary"||e==="secondary"||e==="dashed"||e==="outline"||e==="transparent"?e:"default")}var bf=[ic,ot`
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
    `],jo,Zo=(jo=class extends xe{constructor(...t){super(...t),this.variant="default",this.size="sm",this.centered=!1}render(){return W`
            <div part="base" class="spinner" aria-hidden="true"></div>
        `}},jo.styles=bf,jo);k([S({reflect:!0})],Zo.prototype,"variant",void 0);k([S({reflect:!0})],Zo.prototype,"size",void 0);k([S({reflect:!0})],Zo.prototype,"tone",void 0);k([S({type:Boolean,reflect:!0})],Zo.prototype,"centered",void 0);Zo=k([Zt("pk-spinner")],Zo);var yf=ot`
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
 */const Ve={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},vr=e=>(...t)=>({_$litDirective$:e,values:t});let br=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,o,i){this._$Ct=t,this._$AM=o,this._$Ci=i}_$AS(t,o){return this.update(t,o)}update(t,o){return this.render(...o)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ve=vr(class extends br{constructor(e){if(super(e),e.type!==Ve.ATTRIBUTE||e.name!=="class"||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(i=>i!=="")));for(const i in t)t[i]&&!this.nt?.has(i)&&this.st.add(i);return this.render(t)}const o=e.element.classList;for(const i of this.st)i in t||(o.remove(i),this.st.delete(i));for(const i in t){const n=!!t[i];n===this.st.has(i)||this.nt?.has(i)||(n?(o.add(i),this.st.add(i)):(o.remove(i),this.st.delete(i)))}return Qt}});/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Os=class extends br{constructor(t){if(super(t),this.it=j,t.type!==Ve.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===j||t==null)return this._t=void 0,this.it=t;if(t===Qt)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const o=[t];return o.raw=o,this._t={_$litType$:this.constructor.resultType,strings:o,values:[]}}};Os.directiveName="unsafeHTML",Os.resultType=1;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Rs extends Os{}Rs.directiveName="unsafeSVG",Rs.resultType=2;const yn=vr(Rs);var kf=[ic,yf,pr(),nc(".button"),Jh(),sc(".button"),ot`
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
    `],wf=mr(fr),co,vt=(co=class extends xe{constructor(...t){super(...t),this.variant="default",this.size="default",this.disabled=!1,this.loading=!1,this.withCaret=!1,this.groupTrigger=!1,this.icon=!1,this.title="",this.type="button",this.hasDefaultSlotContent=!1,this.hasStartSlotContent=!1,this.hasEndSlotContent=!1,this.startSlotChanged=o=>{this.iconSlotChanged(o,"start")},this.endSlotChanged=o=>{this.iconSlotChanged(o,"end")},this.handleHostClick=o=>{if(this.disabled||this.loading||this.href||this.type!=="submit"&&this.type!=="reset")return;const i=this.resolveAssociatedForm();if(i){if(o.preventDefault(),o.stopPropagation(),this.type==="reset"){i.reset();return}if(typeof i.requestSubmit=="function"){i.requestSubmit();return}i.dispatchEvent(new Event("submit",{bubbles:!0,cancelable:!0}))}}}defaultSlotChanged(t){const o=t.target;this.hasDefaultSlotContent=o.assignedNodes({flatten:!0}).some(i=>i.nodeType===Node.TEXT_NODE?i.textContent?.trim():i.nodeType===Node.ELEMENT_NODE)}iconSlotChanged(t,o){const i=t.target.assignedNodes({flatten:!0}).some(n=>n.nodeType===Node.TEXT_NODE?n.textContent?.trim():n.nodeType===Node.ELEMENT_NODE);o==="start"?this.hasStartSlotContent=i:this.hasEndSlotContent=i}buttonClasses(){return ve({button:!0,"has-label":this.hasDefaultSlotContent,loading:this.loading,caret:this.withCaret,"group-trigger":this.groupTrigger})}connectedCallback(){super.connectedCallback(),this.setAttribute("data-slot","button"),this.addEventListener("click",this.handleHostClick)}disconnectedCallback(){this.removeEventListener("click",this.handleHostClick),super.disconnectedCallback()}resolveAssociatedForm(){const t=(this.form||this.getAttribute("form")||"").trim();if(t){const i=this.ownerDocument?.getElementById(t);if(i instanceof HTMLFormElement&&i.id!=="main")return i}const o=this.closest("form");return o&&o.id!=="main"?o:null}render(){const t=this.spinnerSize||mf(this.size),o=vf(this.variant,this.spinnerVariant);return W`
            ${this.href?W`
                    <a
                        part="base"
                        class=${this.buttonClasses()}
                        href=${this.href}
                        target=${this.target??j}
                        rel=${this.rel??j}
                        title=${this.title||j}
                    >
                        ${this.renderInner(t,o)}
                    </a>
                `:W`
                    <button
                        part="base"
                        class=${this.buttonClasses()}
                        type=${this.type}
                        ?disabled=${this.disabled}
                        aria-disabled=${this.disabled?"true":j}
                        aria-busy=${this.loading?"true":j}
                        name=${this.name??j}
                        value=${this.value??j}
                        title=${this.title||j}
                    >
                        ${this.renderInner(t,o)}
                    </button>
                `}
        `}renderInner(t,o){return W`
            <span
                class=${ve({"icon-slot":!0,"icon-slot--start":!0,"icon-slot--has-content":this.hasStartSlotContent})}
            >
                <slot name="start" @slotchange=${this.startSlotChanged}></slot>
            </span>
            ${this.loading?W`
                    <pk-spinner
                        variant=${o}
                        size=${t}
                        tone=${this.spinnerTone??j}
                        centered
                    ></pk-spinner>
                `:j}
            <span
                class=${ve({label:!0,"is-empty":!this.hasDefaultSlotContent,loading:this.loading})}
            >
                <slot @slotchange=${this.defaultSlotChanged}></slot>
            </span>
            <span
                class=${ve({"icon-slot":!0,"icon-slot--end":!0,"icon-slot--has-content":this.hasEndSlotContent})}
            >
                <slot name="end" @slotchange=${this.endSlotChanged}></slot>
            </span>
            ${this.withCaret||this.groupTrigger?W`<span part="caret" class="caret">${yn(wf)}</span>`:j}
        `}},co.shadowRootOptions={mode:"open",delegatesFocus:!0},co.styles=kf,co);k([S({reflect:!0})],vt.prototype,"variant",void 0);k([S({reflect:!0})],vt.prototype,"size",void 0);k([S({type:Boolean,reflect:!0})],vt.prototype,"disabled",void 0);k([S({type:Boolean,reflect:!0})],vt.prototype,"loading",void 0);k([S({reflect:!0,attribute:"spinner-size"})],vt.prototype,"spinnerSize",void 0);k([S({reflect:!0,attribute:"spinner-variant"})],vt.prototype,"spinnerVariant",void 0);k([S({reflect:!0,attribute:"spinner-tone"})],vt.prototype,"spinnerTone",void 0);k([S({type:Boolean,reflect:!0,attribute:"with-caret"})],vt.prototype,"withCaret",void 0);k([S({type:Boolean,reflect:!0,attribute:"group-trigger"})],vt.prototype,"groupTrigger",void 0);k([S({type:Boolean,reflect:!0})],vt.prototype,"icon",void 0);k([S()],vt.prototype,"href",void 0);k([S()],vt.prototype,"target",void 0);k([S()],vt.prototype,"rel",void 0);k([S()],vt.prototype,"name",void 0);k([S()],vt.prototype,"value",void 0);k([S()],vt.prototype,"title",void 0);k([S()],vt.prototype,"type",void 0);k([S({reflect:!0})],vt.prototype,"form",void 0);k([Jt()],vt.prototype,"hasDefaultSlotContent",void 0);k([Jt()],vt.prototype,"hasStartSlotContent",void 0);k([Jt()],vt.prototype,"hasEndSlotContent",void 0);vt=k([Zt("pk-button")],vt);var Hi=class{constructor(e,...t){this.host=e,this.boundSlots=new Set,this.lastHasContent=new Map,this.handleSlotChange=()=>{let o=!1;for(const i of this.slotNames){const n=this.test(i);this.lastHasContent.get(i)!==n&&(this.lastHasContent.set(i,n),o=!0)}o&&this.host.requestUpdate()},this.slotNames=t,e.addController(this)}hostConnected(){this.bindSlotListeners()}hostUpdated(){this.bindSlotListeners()}hostDisconnected(){for(const e of this.boundSlots)e.removeEventListener("slotchange",this.handleSlotChange);this.boundSlots.clear()}bindSlotListeners(){for(const e of this.slotNames){const t=this.findSlot(e);!t||this.boundSlots.has(t)||(this.boundSlots.add(t),t.addEventListener("slotchange",this.handleSlotChange),this.lastHasContent.has(e)||this.lastHasContent.set(e,this.test(e)))}}findSlot(e){return this.host.shadowRoot?e?this.host.shadowRoot.querySelector(`slot[name="${e}"]`):this.host.shadowRoot.querySelector("slot:not([name])"):null}test(e,t=!1){if(t||this.hasLightDomSlotContent(e))return!0;const o=this.findSlot(e);return o?o.assignedNodes({flatten:!0}).some(i=>i.nodeType===Node.TEXT_NODE?!!i.textContent?.trim():i.nodeType===Node.ELEMENT_NODE):!1}hasLightDomSlotContent(e){return[...this.host.children].some(t=>t.getAttribute("slot")===e)}},yr=ot`
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
`;function*Ld(e=document.activeElement){e!=null&&(yield e,"shadowRoot"in e&&e.shadowRoot&&e.shadowRoot.mode!=="closed"&&(yield*Ld(e.shadowRoot.activeElement)))}var $a=0;function kn(e="pk"){return $a+=1,`${e}-${$a}`}var Ta={},xf=(e={})=>{Ta={...Ta,...e}},Od=["aria-labelledby","aria-describedby","aria-invalid","aria-errormessage","aria-required","aria-label"];function _f(e){return e.hasAttribute("aria-labelledby")||e.hasAttribute("aria-describedby")||e.hasAttribute("aria-errormessage")}function Sf(e,t){for(const o of Od){const i=e.getAttribute(o);i!==null?t.setAttribute(o,i):t.removeAttribute(o)}}function Rd({control:e,labelId:t,instructionsId:o,hasLabel:i,hasInstructions:n,required:s=!1,invalid:r=!1}){i&&t?e.setAttribute("aria-labelledby",t):e.removeAttribute("aria-labelledby"),n&&o?e.setAttribute("aria-describedby",o):e.removeAttribute("aria-describedby"),s?e.setAttribute("aria-required","true"):e.removeAttribute("aria-required"),r?e.setAttribute("aria-invalid","true"):e.removeAttribute("aria-invalid"),e.removeAttribute("aria-errormessage")}var Ef=class{constructor(e,t,o){this.host=e,this.getTarget=t,this.onSync=o}connect(){this.sync(),this.observer=new MutationObserver(()=>{this.sync()}),this.observer.observe(this.host,{attributes:!0,attributeFilter:[...Od]})}disconnect(){this.observer?.disconnect(),this.observer=void 0}sync(){if(!_f(this.host)){this.onSync?.();return}const e=this.getTarget();e&&Sf(this.host,e)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Te=e=>e??j;var lo=[];function Id(e){lo.push(e)}function hi(e){for(let t=lo.length-1;t>=0;t-=1)if(lo[t]===e){lo.splice(t,1);break}}function on(e){return lo.length>0&&lo[lo.length-1]===e}var kr=class extends Event{constructor(){super("pk-show",{bubbles:!0,cancelable:!1,composed:!0})}},wr=class extends Event{constructor(){super("pk-after-show",{bubbles:!0,cancelable:!1,composed:!0})}},xr=class extends Event{constructor(e="unknown"){super("pk-hide",{bubbles:!0,cancelable:!0,composed:!0}),this.detail={source:e}}},_r=class extends Event{constructor(){super("pk-after-hide",{bubbles:!0,cancelable:!1,composed:!0})}};function Sr(e){const t=e.split("-")[0];return t==="inline-start"?"left":t==="inline-end"?"right":t==="top"||t==="bottom"||t==="left"||t==="right"?t:"bottom"}function Cf(e,t,o,i,n){const s=Sr(e),r=t.x+t.width/2-o.x,a=t.y+t.height/2-o.y;return Math.abs(n?.y??0)>i&&(s==="top"||s==="bottom")?`${r}px ${t.y+t.height/2-o.y}px`:{top:`${r}px calc(100% + ${i}px)`,bottom:`${r}px ${-i}px`,left:`calc(100% + ${i}px) ${a}px`,right:`${-i}px ${a}px`}[s]}function wn(e,t){if(!t){e.removeAttribute("data-side");return}e.setAttribute("data-side",Sr(t))}function Er(e,t,o=100,i){const n=()=>e.getAttribute("data-current-placement")??t;return!i?.requireEvent&&e.hasAttribute("data-current-placement")?Promise.resolve(n()):new Promise(s=>{let r=!1;const a=()=>{r||(r=!0,s(n()))};e.addEventListener("pk-reposition",a,{once:!0}),i?.requireEvent||requestAnimationFrame(()=>{requestAnimationFrame(()=>{e.hasAttribute("data-current-placement")&&a()})}),window.setTimeout(a,o)})}var _i=typeof globalThis.HTMLElement<"u"&&Object.prototype.hasOwnProperty.call(globalThis.HTMLElement.prototype,"popover");const Ye=Math.min,Le=Math.max,xn=Math.round,Yi=Math.floor,Oe=e=>({x:e,y:e}),Af={left:"right",right:"left",bottom:"top",top:"bottom"};function Dd(e,t,o){return Le(e,Ye(t,o))}function ti(e,t){return typeof e=="function"?e(t):e}function mo(e){return e.split("-")[0]}function ei(e){return e.split("-")[1]}function Fd(e){return e==="x"?"y":"x"}function Cr(e){return e==="y"?"height":"width"}function Me(e){const t=e[0];return t==="t"||t==="b"?"y":"x"}function Ar(e){return Fd(Me(e))}function $f(e,t,o){o===void 0&&(o=!1);const i=ei(e),n=Ar(e),s=Cr(n);let r=n==="x"?i===(o?"end":"start")?"right":"left":i==="start"?"bottom":"top";return t.reference[s]>t.floating[s]&&(r=_n(r)),[r,_n(r)]}function Tf(e){const t=_n(e);return[Is(e),t,Is(t)]}function Is(e){return e.includes("start")?e.replace("start","end"):e.replace("end","start")}const za=["left","right"],Pa=["right","left"],zf=["top","bottom"],Pf=["bottom","top"];function Mf(e,t,o){switch(e){case"top":case"bottom":return o?t?Pa:za:t?za:Pa;case"left":case"right":return t?zf:Pf;default:return[]}}function Lf(e,t,o,i){const n=ei(e);let s=Mf(mo(e),o==="start",i);return n&&(s=s.map(r=>r+"-"+n),t&&(s=s.concat(s.map(Is)))),s}function _n(e){const t=mo(e);return Af[t]+e.slice(t.length)}function Of(e){var t,o,i,n;return{top:(t=e.top)!=null?t:0,right:(o=e.right)!=null?o:0,bottom:(i=e.bottom)!=null?i:0,left:(n=e.left)!=null?n:0}}function Nd(e){return typeof e!="number"?Of(e):{top:e,right:e,bottom:e,left:e}}function Sn(e){const{x:t,y:o,width:i,height:n}=e;return{width:i,height:n,top:o,left:t,right:t+i,bottom:o+n,x:t,y:o}}function Ma(e,t,o){let{reference:i,floating:n}=e;const s=Me(t),r=Ar(t),a=Cr(r),l=mo(t),d=s==="y",u=i.x+i.width/2-n.width/2,p=i.y+i.height/2-n.height/2,c=i[a]/2-n[a]/2;let v;switch(l){case"top":v={x:u,y:i.y-n.height};break;case"bottom":v={x:u,y:i.y+i.height};break;case"right":v={x:i.x+i.width,y:p};break;case"left":v={x:i.x-n.width,y:p};break;default:v={x:i.x,y:i.y}}const y=ei(t);return y&&(v[r]+=c*(y==="end"?1:-1)*(o&&d?-1:1)),v}async function Rf(e,t){var o;t===void 0&&(t={});const{x:i,y:n,platform:s,rects:r,elements:a,strategy:l}=e,{boundary:d="clippingAncestors",rootBoundary:u="viewport",elementContext:p="floating",altBoundary:c=!1,padding:v=0}=ti(t,e),y=Nd(v),C=a[c?p==="floating"?"reference":"floating":p],A=Sn(await s.getClippingRect({element:(o=await(s.isElement==null?void 0:s.isElement(C)))==null||o?C:C.contextElement||await(s.getDocumentElement==null?void 0:s.getDocumentElement(a.floating)),boundary:d,rootBoundary:u,strategy:l})),D=p==="floating"?{x:i,y:n,width:r.floating.width,height:r.floating.height}:r.reference,L=await(s.getOffsetParent==null?void 0:s.getOffsetParent(a.floating)),M=await(s.isElement==null?void 0:s.isElement(L))&&await(s.getScale==null?void 0:s.getScale(L))||{x:1,y:1},V=Sn(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:D,offsetParent:L,strategy:l}):D);return{top:(A.top-V.top+y.top)/M.y,bottom:(V.bottom-A.bottom+y.bottom)/M.y,left:(A.left-V.left+y.left)/M.x,right:(V.right-A.right+y.right)/M.x}}const If=50,Df=async(e,t,o)=>{const{placement:i="bottom",strategy:n="absolute",middleware:s=[],platform:r}=o,a=r.detectOverflow?r:{...r,detectOverflow:Rf},l=await(r.isRTL==null?void 0:r.isRTL(t));let d=await r.getElementRects({reference:e,floating:t,strategy:n}),{x:u,y:p}=Ma(d,i,l),c=i,v=0;const y={};for(let x=0;x<s.length;x++){const C=s[x];if(!C)continue;const{name:A,fn:D}=C,{x:L,y:M,data:V,reset:B}=await D({x:u,y:p,initialPlacement:i,placement:c,strategy:n,middlewareData:y,rects:d,platform:a,elements:{reference:e,floating:t}});u=L??u,p=M??p,y[A]={...y[A],...V},B&&v<If&&(v++,typeof B=="object"&&(B.placement&&(c=B.placement),B.rects&&(d=B.rects===!0?await r.getElementRects({reference:e,floating:t,strategy:n}):B.rects),{x:u,y:p}=Ma(d,c,l)),x=-1)}return{x:u,y:p,placement:c,strategy:n,middlewareData:y}},Ff=e=>({name:"arrow",options:e,async fn(t){const{x:o,y:i,placement:n,rects:s,platform:r,elements:a,middlewareData:l}=t,{element:d,padding:u=0}=ti(e,t)||{};if(d==null)return{};const p=Nd(u),c={x:o,y:i},v=Ar(n),y=Cr(v),x=await r.getDimensions(d),C=v==="y",A=C?"top":"left",D=C?"bottom":"right",L=C?"clientHeight":"clientWidth",M=s.reference[y]+s.reference[v]-c[v]-s.floating[y],V=c[v]-s.reference[v],B=await(r.getOffsetParent==null?void 0:r.getOffsetParent(d));let q=B?B[L]:0;(!q||!await(r.isElement==null?void 0:r.isElement(B)))&&(q=a.floating[L]||s.floating[y]);const it=M/2-V/2,at=q/2-x[y]/2-1,et=Ye(p[A],at),Tt=Ye(p[D],at),Et=q-x[y]-Tt,ht=q/2-x[y]/2+it,xt=Dd(et,ht,Et),It=!l.arrow&&ei(n)!=null&&ht!==xt&&s.reference[y]/2-(ht<et?et:Tt)-x[y]/2<0,lt=It?ht<et?ht-et:ht-Et:0;return{[v]:c[v]+lt,data:{[v]:xt,centerOffset:ht-xt-lt,...It&&{alignmentOffset:lt}},reset:It}}}),Nf=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var o,i;const{placement:n,middlewareData:s,rects:r,initialPlacement:a,platform:l,elements:d}=t,{mainAxis:u=!0,crossAxis:p=!0,fallbackPlacements:c,fallbackStrategy:v="bestFit",fallbackAxisSideDirection:y="none",flipAlignment:x=!0,...C}=ti(e,t);if((o=s.arrow)!=null&&o.alignmentOffset)return{};const A=mo(n),D=Me(a),L=mo(a)===a,M=await(l.isRTL==null?void 0:l.isRTL(d.floating)),V=c||(L||!x?[_n(a)]:Tf(a)),B=y!=="none";!c&&B&&V.push(...Lf(a,x,y,M));const q=[a,...V],it=await l.detectOverflow(t,C),at=[];let et=((i=s.flip)==null?void 0:i.overflows)||[];if(u&&at.push(it[A]),p){const xt=$f(n,r,M);at.push(it[xt[0]],it[xt[1]])}if(et=[...et,{placement:n,overflows:at}],!at.every(xt=>xt<=0)){var Tt,Et;const xt=(((Tt=s.flip)==null?void 0:Tt.index)||0)+1,It=q[xt];if(It&&(!(p==="alignment"?D!==Me(It):!1)||et.every(Y=>Me(Y.placement)===D?Y.overflows[0]>0:!0)))return{data:{index:xt,overflows:et},reset:{placement:It}};let lt=(Et=et.filter(Q=>Q.overflows[0]<=0).sort((Q,Y)=>Q.overflows[1]-Y.overflows[1])[0])==null?void 0:Et.placement;if(!lt)switch(v){case"bestFit":{var ht;const Q=(ht=et.filter(Y=>{if(B){const gt=Me(Y.placement);return gt===D||gt==="y"}return!0}).map(Y=>[Y.placement,Y.overflows.filter(gt=>gt>0).reduce((gt,Se)=>gt+Se,0)]).sort((Y,gt)=>Y[1]-gt[1])[0])==null?void 0:ht[0];Q&&(lt=Q);break}case"initialPlacement":lt=a;break}if(n!==lt)return{reset:{placement:lt}}}return{}}}},jf=new Set(["left","top"]);async function Bf(e,t){const{placement:o,platform:i,elements:n}=e,s=await(i.isRTL==null?void 0:i.isRTL(n.floating)),r=mo(o),a=ei(o),l=Me(o)==="y",d=jf.has(r)?-1:1,u=s&&l?-1:1,p=ti(t,e);let{mainAxis:c,crossAxis:v,alignmentAxis:y}=typeof p=="number"?{mainAxis:p,crossAxis:0,alignmentAxis:null}:{mainAxis:p.mainAxis||0,crossAxis:p.crossAxis||0,alignmentAxis:p.alignmentAxis};return a&&typeof y=="number"&&(v=a==="end"?y*-1:y),l?{x:v*u,y:c*d}:{x:c*d,y:v*u}}const Uf=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){var o,i;const{x:n,y:s,placement:r,middlewareData:a}=t,l=await Bf(t,e);return r===((o=a.offset)==null?void 0:o.placement)&&(i=a.arrow)!=null&&i.alignmentOffset?{}:{x:n+l.x,y:s+l.y,data:{...l,placement:r}}}}},Hf=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:o,y:i,placement:n,platform:s}=t,{mainAxis:r=!0,crossAxis:a=!1,limiter:l={fn:D=>{let{x:L,y:M}=D;return{x:L,y:M}}},...d}=ti(e,t),u={x:o,y:i},p=await s.detectOverflow(t,d),c=Me(n),v=Fd(c);let y=u[v],x=u[c];const C=(D,L)=>Dd(L+p[D==="y"?"top":"left"],L,L-p[D==="y"?"bottom":"right"]);r&&(y=C(v,y)),a&&(x=C(c,x));const A=l.fn({...t,[v]:y,[c]:x});return{...A,data:{x:A.x-o,y:A.y-i,enabled:{[v]:r,[c]:a}}}}}},Vf=function(e){return e===void 0&&(e={}),{name:"size",options:e,async fn(t){const{placement:o,rects:i,platform:n,elements:s}=t,{apply:r=()=>{},...a}=ti(e,t),l=await n.detectOverflow(t,a),d=mo(o),u=ei(o),p=Me(o)==="y",{width:c,height:v}=i.floating;let y,x;d==="top"||d==="bottom"?(y=d,x=u===(await(n.isRTL==null?void 0:n.isRTL(s.floating))?"start":"end")?"left":"right"):(x=d,y=u==="end"?"top":"bottom");const C=v-l.top-l.bottom,A=c-l.left-l.right,D=Ye(v-l[y],C),L=Ye(c-l[x],A),M=t.middlewareData.shift,V=!M;let B=D,q=L;M!=null&&M.enabled.x&&(q=A),M!=null&&M.enabled.y&&(B=C),V&&!u&&(p?q=c-2*Le(l.left,l.right):B=v-2*Le(l.top,l.bottom)),await r({...t,availableWidth:q,availableHeight:B});const it=await n.getDimensions(s.floating);return c!==it.width||v!==it.height?{reset:{rects:!0}}:{}}}};function Hn(){return typeof window<"u"}function oi(e){return jd(e)?(e.nodeName||"").toLowerCase():"#document"}function qt(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function je(e){var t;return(t=(jd(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function jd(e){return Hn()?e instanceof Node||e instanceof qt(e).Node:!1}function ke(e){return Hn()?e instanceof Element||e instanceof qt(e).Element:!1}function Je(e){return Hn()?e instanceof HTMLElement||e instanceof qt(e).HTMLElement:!1}function La(e){return!Hn()||typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof qt(e).ShadowRoot}function Vn(e){const{overflow:t,overflowX:o,overflowY:i,display:n}=we(e);return/auto|scroll|overlay|hidden|clip/.test(t+i+o)&&n!=="inline"&&n!=="contents"}function qf(e){return/^(table|td|th)$/.test(oi(e))}function qn(e){try{if(e.matches(":popover-open"))return!0}catch{}try{return e.matches(":modal")}catch{return!1}}const Kf=/transform|translate|scale|rotate|perspective|filter/,Wf=/paint|layout|strict|content/,oo=e=>!!e&&e!=="none";let ps;function Kn(e){const t=ke(e)?we(e):e;return oo(t.transform)||oo(t.translate)||oo(t.scale)||oo(t.rotate)||oo(t.perspective)||!$r()&&(oo(t.backdropFilter)||oo(t.filter))||Kf.test(t.willChange||"")||Wf.test(t.contain||"")}function Gf(e){let t=vo(e);for(;Je(t)&&!Ri(t);){if(Kn(t))return t;if(qn(t))return null;t=vo(t)}return null}function $r(){return ps==null&&(ps=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),ps}function Ri(e){return/^(html|body|#document)$/.test(oi(e))}function we(e){return qt(e).getComputedStyle(e)}function Wn(e){return ke(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function vo(e){if(oi(e)==="html")return e;const t=e.assignedSlot||e.parentNode||La(e)&&e.host||je(e);return La(t)?t.host:t}function Bd(e){const t=vo(e);return Ri(t)?(e.ownerDocument||e).body:Je(t)&&Vn(t)?t:Bd(t)}function Qo(e,t,o){var i;t===void 0&&(t=[]),o===void 0&&(o=!0);const n=Bd(e),s=n===((i=e.ownerDocument)==null?void 0:i.body),r=qt(n);if(s){const a=Ds(r);return t.concat(r,r.visualViewport||[],Vn(n)?n:[],a&&o?Qo(a):[])}else return t.concat(n,Qo(n,[],o))}function Ds(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function Ud(e){const t=we(e);let o=parseFloat(t.width)||0,i=parseFloat(t.height)||0;const n=Je(e),s=n?e.offsetWidth:o,r=n?e.offsetHeight:i,a=xn(o)!==s||xn(i)!==r;return a&&(o=s,i=r),{width:o,height:i,$:a}}function Tr(e){return ke(e)?e:e.contextElement}function Do(e){const t=Tr(e);if(!Je(t))return Oe(1);const o=t.getBoundingClientRect(),{width:i,height:n,$:s}=Ud(t);let r=(s?xn(o.width):o.width)/i,a=(s?xn(o.height):o.height)/n;return(!r||!Number.isFinite(r))&&(r=1),(!a||!Number.isFinite(a))&&(a=1),{x:r,y:a}}const Yf=Oe(0);function Hd(e){const t=qt(e);return!$r()||!t.visualViewport?Yf:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Xf(e,t,o){return t===void 0&&(t=!1),!!o&&t&&o===qt(e)}function bo(e,t,o,i){t===void 0&&(t=!1),o===void 0&&(o=!1);const n=e.getBoundingClientRect(),s=Tr(e);let r=Oe(1);t&&(i?ke(i)&&(r=Do(i)):r=Do(e));const a=Xf(s,o,i)?Hd(s):Oe(0);let l=(n.left+a.x)/r.x,d=(n.top+a.y)/r.y,u=n.width/r.x,p=n.height/r.y;if(s&&i){const c=qt(s),v=ke(i)?qt(i):i;let y=c,x=Ds(y);for(;x&&v!==y;){const C=Do(x),A=x.getBoundingClientRect(),D=we(x),L=A.left+(x.clientLeft+parseFloat(D.paddingLeft))*C.x,M=A.top+(x.clientTop+parseFloat(D.paddingTop))*C.y;l*=C.x,d*=C.y,u*=C.x,p*=C.y,l+=L,d+=M,y=qt(x),x=Ds(y)}}return Sn({width:u,height:p,x:l,y:d})}function Gn(e,t){const o=Wn(e).scrollLeft;return t?t.left+o:bo(je(e)).left+o}function Vd(e,t){const o=e.getBoundingClientRect(),i=o.left+t.scrollLeft-Gn(e,o),n=o.top+t.scrollTop;return{x:i,y:n}}function Jf(e){let{elements:t,rect:o,offsetParent:i,strategy:n}=e;const s=n==="fixed",r=je(i),a=t?qn(t.floating):!1;if(i===r||a&&s)return o;let l={scrollLeft:0,scrollTop:0},d=Oe(1);const u=Oe(0),p=Je(i);if((p||!s)&&((oi(i)!=="body"||Vn(r))&&(l=Wn(i)),p)){const v=bo(i);d=Do(i),u.x=v.x+i.clientLeft,u.y=v.y+i.clientTop}const c=r&&!p&&!s?Vd(r,l):Oe(0);return{width:o.width*d.x,height:o.height*d.y,x:o.x*d.x-l.scrollLeft*d.x+u.x+c.x,y:o.y*d.y-l.scrollTop*d.y+u.y+c.y}}function Zf(e){return e.getClientRects?Array.from(e.getClientRects()):[]}function Qf(e){const t=Wn(e),o=e.ownerDocument.body,i=Le(e.scrollWidth,e.clientWidth,o.scrollWidth,o.clientWidth),n=Le(e.scrollHeight,e.clientHeight,o.scrollHeight,o.clientHeight);let s=-t.scrollLeft+Gn(e);const r=-t.scrollTop;return we(o).direction==="rtl"&&(s+=Le(e.clientWidth,o.clientWidth)-i),{width:i,height:n,x:s,y:r}}const t1=25;function e1(e,t,o){o===void 0&&(o="viewport");const i=o==="layoutViewport",n=qt(e),s=je(e),r=n.visualViewport;let a=s.clientWidth,l=s.clientHeight,d=0,u=0;if(r){const c=!$r()||t==="fixed";i?c||(d=-r.offsetLeft,u=-r.offsetTop):(a=r.width,l=r.height,c&&(d=r.offsetLeft,u=r.offsetTop))}if(Gn(s)<=0){const c=s.ownerDocument,v=c.body,y=getComputedStyle(v),x=c.compatMode==="CSS1Compat"&&parseFloat(y.marginLeft)+parseFloat(y.marginRight)||0,C=Math.abs(s.clientWidth-v.clientWidth-x),A=getComputedStyle(s).scrollbarGutter==="stable both-edges"?C/2:C;A<=t1&&(a-=A)}return{width:a,height:l,x:d,y:u}}function o1(e,t){const o=bo(e,!0,t==="fixed"),i=o.top+e.clientTop,n=o.left+e.clientLeft,s=Do(e),r=e.clientWidth*s.x,a=e.clientHeight*s.y,l=n*s.x,d=i*s.y;return{width:r,height:a,x:l,y:d}}function Oa(e,t,o){let i;if(t==="viewport"||t==="layoutViewport")i=e1(e,o,t);else if(t==="document")i=Qf(je(e));else if(ke(t))i=o1(t,o);else{const n=Hd(e);i={x:t.x-n.x,y:t.y-n.y,width:t.width,height:t.height}}return Sn(i)}function i1(e,t){const o=t.get(e);if(o)return o;let i=Qo(e,[],!1).filter(a=>ke(a)&&oi(a)!=="body"),n=null;const s=we(e).position==="fixed";let r=s?vo(e):e;for(;ke(r)&&!Ri(r);){const a=we(r),l=Kn(r),d=n?n.position:s?"fixed":"";!l&&(d==="fixed"||d==="absolute"&&a.position==="static")?i=i.filter(p=>p!==r):n=a,r=vo(r)}return t.set(e,i),i}function n1(e){let{element:t,boundary:o,rootBoundary:i,strategy:n}=e;const r=[...o==="clippingAncestors"?qn(t)?[]:i1(t,this._c):[].concat(o),i],a=Oa(t,r[0],n);let l=a.top,d=a.right,u=a.bottom,p=a.left;for(let c=1;c<r.length;c++){const v=Oa(t,r[c],n);l=Le(v.top,l),d=Ye(v.right,d),u=Ye(v.bottom,u),p=Le(v.left,p)}return{width:d-p,height:u-l,x:p,y:l}}function s1(e){const{width:t,height:o}=Ud(e);return{width:t,height:o}}function r1(e,t,o){const i=Je(t),n=je(t),s=o==="fixed",r=bo(e,!0,s,t);let a={scrollLeft:0,scrollTop:0};const l=Oe(0);if((i||!s)&&((oi(t)!=="body"||Vn(n))&&(a=Wn(t)),i)){const c=bo(t,!0,s,t);l.x=c.x+t.clientLeft,l.y=c.y+t.clientTop}!i&&n&&(l.x=Gn(n));const d=n&&!i&&!s?Vd(n,a):Oe(0),u=r.left+a.scrollLeft-l.x-d.x,p=r.top+a.scrollTop-l.y-d.y;return{x:u,y:p,width:r.width,height:r.height}}function hs(e){return we(e).position==="static"}function Ra(e,t){if(!Je(e)||we(e).position==="fixed")return null;if(t)return t(e);let o=e.offsetParent;return je(e)===o&&(o=o.ownerDocument.body),o}function qd(e,t){const o=qt(e);if(qn(e))return o;if(!Je(e)){let n=vo(e);for(;n&&!Ri(n);){if(ke(n)&&!hs(n))return n;n=vo(n)}return o}let i=Ra(e,t);for(;i&&qf(i)&&hs(i);)i=Ra(i,t);return i&&Ri(i)&&hs(i)&&!Kn(i)?o:i||Gf(e)||o}const a1=async function(e){const t=this.getOffsetParent||qd,o=this.getDimensions,i=await o(e.floating);return{reference:r1(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:i.width,height:i.height}}};function l1(e){return we(e).direction==="rtl"}const nn={convertOffsetParentRelativeRectToViewportRelativeRect:Jf,getDocumentElement:je,getClippingRect:n1,getOffsetParent:qd,getElementRects:a1,getClientRects:Zf,getDimensions:s1,getScale:Do,isElement:ke,isRTL:l1};function Kd(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function c1(e,t,o){let i=null,n;const s=je(e);function r(){var u;clearTimeout(n),(u=i)==null||u.disconnect(),i=null}function a(u,p){u===void 0&&(u=!1),p===void 0&&(p=1),r();const c=e.getBoundingClientRect(),{left:v,top:y,width:x,height:C}=c;if(u||t(),!x||!C)return;const A=Yi(y),D=Yi(s.clientWidth-(v+x)),L=Yi(s.clientHeight-(y+C)),M=Yi(v),B={rootMargin:-A+"px "+-D+"px "+-L+"px "+-M+"px",threshold:Le(0,Ye(1,p))||1};let q=!0;function it(at){const et=at[0].intersectionRatio;if(!Kd(c,e.getBoundingClientRect()))return a();if(et!==p){if(!q)return a();et?a(!1,et):n=setTimeout(()=>{a(!1,1e-7)},1e3)}q=!1}try{i=new IntersectionObserver(it,{...B,root:s.ownerDocument})}catch{i=new IntersectionObserver(it,B)}i.observe(e)}const l=qt(e),d=()=>a(o);return l.addEventListener("resize",d),a(!0),()=>{l.removeEventListener("resize",d),r()}}function d1(e,t,o,i){i===void 0&&(i={});const{ancestorScroll:n=!0,ancestorResize:s=!0,elementResize:r=typeof ResizeObserver=="function",layoutShift:a=typeof IntersectionObserver=="function",animationFrame:l=!1}=i,d=Tr(e),u=n||s?[...d?Qo(d):[],...t?Qo(t):[]]:[];u.forEach(A=>{n&&A.addEventListener("scroll",o),s&&A.addEventListener("resize",o)});const p=d&&a?c1(d,o,s):null;let c=-1,v=null;r&&(v=new ResizeObserver(A=>{let[D]=A;D&&D.target===d&&v&&t&&(v.unobserve(t),cancelAnimationFrame(c),c=requestAnimationFrame(()=>{var L;(L=v)==null||L.observe(t)})),o()}),d&&!l&&v.observe(d),t&&v.observe(t));let y,x=l?bo(e):null;l&&C();function C(){const A=bo(e);x&&!Kd(x,A)&&o(),x=A,y=requestAnimationFrame(C)}return o(),()=>{var A;u.forEach(D=>{n&&D.removeEventListener("scroll",o),s&&D.removeEventListener("resize",o)}),p?.(),(A=v)==null||A.disconnect(),v=null,l&&cancelAnimationFrame(y)}}const u1=Uf,p1=Hf,h1=Nf,f1=Vf,g1=Ff,m1=(e,t,o)=>{const i=new Map,n=o??{},s={...nn,...n.platform,_c:i};return Df(e,t,{...n,platform:s})};function v1(e){return b1(e)}function fs(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function b1(e){for(let t=e;t;t=fs(t))if(t instanceof Element&&getComputedStyle(t).display==="none")return null;for(let t=fs(e);t;t=fs(t)){if(!(t instanceof Element))continue;const o=getComputedStyle(t);if(o.display!=="contents"&&(o.position!=="static"||Kn(o)||t.tagName==="BODY"))return t}return null}function Fo(e,t){if(!t)return null;const o=e.getRootNode();if(o instanceof Document||o instanceof ShadowRoot){const i=o.getElementById(t);if(i)return i}return e.ownerDocument.getElementById(t)}var Ia=class extends Event{constructor(){super("pk-reposition",{bubbles:!0,cancelable:!1,composed:!0})}},y1=ot`
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
`;function Wd(e){return e!==null&&typeof e=="object"&&"getBoundingClientRect"in e}function k1(e){return e||(_i?"absolute":"fixed")}function w1(e,t){if(!(!_i||Wd(e)||t!=="scroll"))return Qo(e).filter(o=>o instanceof Element)}var Bo,bt=(Bo=class extends xe{constructor(...t){super(...t),this.anchor="",this.active=!1,this.boundary="viewport",this.placement="bottom-start",this.distance=4,this.skidding=0,this.flip=!0,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=8,this.shift=!0,this.shiftPadding=8,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.anchorTracking=!0,this.hoverBridge=!1,this.anchorElement=null,this.settlingInitialPosition=!1,this.settleGeneration=0}disconnectedCallback(){this.stop(),super.disconnectedCallback()}updated(t){super.updated(t),t.has("active")&&(this.active?(this.resolveAnchor(),this.start()):this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&!t.has("active")&&this.reposition()}reposition(){this.settlingInitialPosition||this.repositionAsync()}async repositionAsync(t=!0){const o=this.popupElement,i=this.arrow?this.arrowElement:null;if(!this.active||!this.anchorElement||!o)return!1;const n=w1(this.anchorElement,this.boundary),s=[u1({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?s.push(f1({apply:({rects:y})=>{const x=this.sync==="width"||this.sync==="both",C=this.sync==="height"||this.sync==="both";o.style.width=x?`${y.reference.width}px`:"",o.style.height=C?`${y.reference.height}px`:""}})):(o.style.width="",o.style.height=""),this.flip&&s.push(h1({boundary:n,fallbackPlacements:this.flipFallbackPlacements?this.flipFallbackPlacements.split(" ").map(y=>y.trim()).filter(Boolean):void 0,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&s.push(p1({boundary:n,padding:this.shiftPadding})),this.arrow&&i&&s.push(g1({element:i,padding:this.arrowPadding}));const r=k1(this.positionMethod),a=r==="fixed";o.classList.toggle("popup-fixed",a);const l=_i?y=>nn.getOffsetParent(y,v1):nn.getOffsetParent,{x:d,y:u,middlewareData:p,placement:c}=await m1(this.anchorElement,o,{placement:this.placement,middleware:s,strategy:r,platform:{...nn,getOffsetParent:l}});if(!this.active||!o.isConnected)return!1;const v={top:"bottom",right:"left",bottom:"top",left:"right"}[c.split("-")[0]];if(this.setAttribute("data-current-placement",c),Object.assign(o.style,{left:`${d}px`,top:`${u}px`,...a?{position:"fixed"}:{position:""}}),this.anchorElement){const y=this.anchorElement.getBoundingClientRect(),x=o.getBoundingClientRect();o.style.setProperty("--pk-anchor-width",`${y.width}px`),o.style.setProperty("--pk-anchor-height",`${y.height}px`);const C=Cf(c,y,x,this.distance,p.shift);o.style.setProperty("--pk-transform-origin",C)}if(this.arrow&&i){const y=p.arrow?.x,x=p.arrow?.y;let C="",A="",D="",L="";if(this.arrowPlacement==="start"){const M=typeof y=="number"?`${this.arrowPadding}px`:"";C=typeof x=="number"?`${this.arrowPadding}px`:"",L=M}else this.arrowPlacement==="end"?(A=typeof y=="number"?`${this.arrowPadding}px`:"",D=typeof x=="number"?`${this.arrowPadding}px`:""):this.arrowPlacement==="center"?(L=typeof y=="number"?"50%":"",C=typeof x=="number"?"50%":""):(L=typeof y=="number"?`${y}px`:"",C=typeof x=="number"?`${x}px`:"");Object.assign(i.style,{top:C,right:A,bottom:D,left:L,transform:"",[v]:"calc(-1 * var(--pk-popup-arrow-size, 6px) / 2)"})}return requestAnimationFrame(()=>this.updateHoverBridge()),t&&this.dispatchEvent(new Ia),!0}frames(t){return new Promise(o=>{const i=n=>{if(n<=0){o();return}requestAnimationFrame(()=>i(n-1))};i(t)})}async settleInitialPosition(){const t=++this.settleGeneration,o=this.popupElement;if(!o){this.settlingInitialPosition=!1;return}await this.frames(2),!(!this.active||t!==this.settleGeneration)&&(await this.repositionAsync(!1),o.offsetHeight,await this.frames(1),!(!this.active||t!==this.settleGeneration)&&(await this.repositionAsync(!1),!(!this.active||t!==this.settleGeneration)&&(o.classList.add("positioned"),this.settlingInitialPosition=!1,requestAnimationFrame(()=>this.updateHoverBridge()),this.dispatchEvent(new Ia))))}resolveAnchor(){if(typeof this.anchor=="string"&&this.anchor){this.anchorElement=Fo(this,this.anchor);return}if(this.anchor instanceof Element||Wd(this.anchor)){this.anchorElement=this.anchor;return}let t=this.querySelector('[slot="anchor"]');t instanceof HTMLSlotElement&&(t=t.assignedElements({flatten:!0})[0]??null),this.anchorElement=t}async handleAnchorChange(){await this.stop(),this.resolveAnchor(),this.anchorElement&&this.active&&this.start()}usesPopoverTopLayer(){return _i&&this.positionMethod!=="fixed"}stop(){return new Promise(t=>{const o=this.popupElement;this.settleGeneration+=1,this.settlingInitialPosition=!1,o?.classList.remove("positioned"),this.usesPopoverTopLayer()&&o?.hidePopover?.(),this.cleanup?(this.cleanup(),this.cleanup=void 0,o?.style.removeProperty("--pk-transform-origin"),requestAnimationFrame(()=>t())):t(),this.removeAttribute("data-current-placement")})}releasePositioning(){this.cleanup&&(this.cleanup(),this.cleanup=void 0)}async awaitHidden(){await this.stop()}start(){!this.anchorElement||!this.active||!this.isConnected||!this.popupElement||(this.popupElement.classList.remove("positioned"),this.settlingInitialPosition=!0,this.usesPopoverTopLayer()&&this.popupElement.showPopover?.(),this.anchorTracking&&(this.cleanup=d1(this.anchorElement,this.popupElement,()=>{this.settlingInitialPosition||this.reposition()})),this.settleInitialPosition())}getContentElement(){const t=(this.shadowRoot?.querySelector("slot:not([name])")?.assignedElements({flatten:!0})??[]).find(o=>o instanceof HTMLElement);if(t)return t;for(const o of this.childNodes)if(o instanceof HTMLElement&&o.getAttribute("slot")!=="anchor")return o;return null}updateHoverBridge(){const t=this.popupElement;if(!this.hoverBridge||!this.anchorElement||!t)return;const o=this.anchorElement.getBoundingClientRect(),i=t.getBoundingClientRect(),n=this.placement.includes("top")||this.placement.includes("bottom");let s=0,r=0,a=0,l=0,d=0,u=0,p=0,c=0;n?o.top<i.top?(s=o.left,r=o.bottom,a=o.right,l=o.bottom,d=i.left,u=i.top,p=i.right,c=i.top):(s=i.left,r=i.bottom,a=i.right,l=i.bottom,d=o.left,u=o.top,p=o.right,c=o.top):o.left<i.left?(s=o.right,r=o.top,a=i.left,l=i.top,d=o.right,u=o.bottom,p=i.left,c=i.bottom):(s=i.right,r=i.top,a=o.left,l=o.top,d=i.right,u=i.bottom,p=o.left,c=o.bottom),this.style.setProperty("--pk-hover-bridge-top-left-x",`${s}px`),this.style.setProperty("--pk-hover-bridge-top-left-y",`${r}px`),this.style.setProperty("--pk-hover-bridge-top-right-x",`${a}px`),this.style.setProperty("--pk-hover-bridge-top-right-y",`${l}px`),this.style.setProperty("--pk-hover-bridge-bottom-left-x",`${d}px`),this.style.setProperty("--pk-hover-bridge-bottom-left-y",`${u}px`),this.style.setProperty("--pk-hover-bridge-bottom-right-x",`${p}px`),this.style.setProperty("--pk-hover-bridge-bottom-right-y",`${c}px`)}render(){const t=!_i||this.positionMethod==="fixed",o=this.usesPopoverTopLayer();return W`
            <slot name="anchor" @slotchange=${()=>{this.handleAnchorChange()}}></slot>
            ${this.hoverBridge?W`
                <div
                    part="hover-bridge"
                    class=${ve({"hover-bridge":!0,"hover-bridge-visible":this.active})}
                    aria-hidden="true"
                ></div>
            `:j}
            <div
                popover=${o?"manual":j}
                part="popup"
                class=${ve({popup:!0,active:this.active,"popup-fixed":t})}
            >
                ${this.arrow?W`<div part="arrow" class="arrow"></div>`:j}
                <slot></slot>
            </div>
        `}},Bo.styles=y1,Bo);k([S()],bt.prototype,"anchor",void 0);k([S({type:Boolean,reflect:!0})],bt.prototype,"active",void 0);k([S({attribute:"position-method"})],bt.prototype,"positionMethod",void 0);k([S({reflect:!0})],bt.prototype,"boundary",void 0);k([S({reflect:!0})],bt.prototype,"placement",void 0);k([S({type:Number})],bt.prototype,"distance",void 0);k([S({type:Number})],bt.prototype,"skidding",void 0);k([S({type:Boolean})],bt.prototype,"flip",void 0);k([S({attribute:"flip-fallback-placements"})],bt.prototype,"flipFallbackPlacements",void 0);k([S({attribute:"flip-fallback-strategy"})],bt.prototype,"flipFallbackStrategy",void 0);k([S({attribute:"flip-padding",type:Number})],bt.prototype,"flipPadding",void 0);k([S({type:Boolean})],bt.prototype,"shift",void 0);k([S({attribute:"shift-padding",type:Number})],bt.prototype,"shiftPadding",void 0);k([S({type:Boolean})],bt.prototype,"arrow",void 0);k([S({attribute:"arrow-placement"})],bt.prototype,"arrowPlacement",void 0);k([S({attribute:"arrow-padding",type:Number})],bt.prototype,"arrowPadding",void 0);k([S()],bt.prototype,"sync",void 0);k([S({attribute:"anchor-tracking",type:Boolean})],bt.prototype,"anchorTracking",void 0);k([S({attribute:"hover-bridge",type:Boolean})],bt.prototype,"hoverBridge",void 0);k([Kt(".popup")],bt.prototype,"popupElement",void 0);k([Kt(".arrow")],bt.prototype,"arrowElement",void 0);bt=k([Zt("pk-popup")],bt);var x1=ot`
    @layer pk-component {
        .pk-popup-content {
            transform-origin: var(--pk-transform-origin, top);
        }

        .pk-popup-content[data-open] {
            animation: pk-popup-content-in 100ms ease-out;
        }

        .pk-popup-content[data-open][data-side='bottom'] {
            animation-name: pk-popup-content-in-bottom;
        }

        .pk-popup-content[data-open][data-side='top'] {
            animation-name: pk-popup-content-in-top;
        }

        .pk-popup-content[data-open][data-side='left'] {
            animation-name: pk-popup-content-in-left;
        }

        .pk-popup-content[data-open][data-side='right'] {
            animation-name: pk-popup-content-in-right;
        }

        /* Exit: fade + zoom only — matches tw-animate animate-out / tooltip motion. */
        .pk-popup-content.closing {
            animation: pk-popup-content-out 100ms ease-in forwards;
        }
    }

    @keyframes pk-popup-content-in {
        from {
            opacity: 0;
            transform: scale(0.95);
        }

        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes pk-popup-content-out {
        from {
            opacity: 1;
            transform: scale(1);
        }

        to {
            opacity: 0;
            transform: scale(0.95);
        }
    }

    @keyframes pk-popup-content-in-bottom {
        from {
            opacity: 0;
            transform: scale(0.95) translateY(-0.5rem);
        }

        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    @keyframes pk-popup-content-in-top {
        from {
            opacity: 0;
            transform: scale(0.95) translateY(0.5rem);
        }

        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    @keyframes pk-popup-content-in-left {
        from {
            opacity: 0;
            transform: scale(0.95) translateX(0.5rem);
        }

        to {
            opacity: 1;
            transform: scale(1) translateX(0);
        }
    }

    @keyframes pk-popup-content-in-right {
        from {
            opacity: 0;
            transform: scale(0.95) translateX(-0.5rem);
        }

        to {
            opacity: 1;
            transform: scale(1) translateX(0);
        }
    }
`,_1=[ot`
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
`,ot`
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
    `],Uo,Bt=(Uo=class extends xe{constructor(...t){super(...t),this.placement="top",this.trigger="hover focus",this.disabled=!1,this.openDelay=0,this.closeDelay=0,this.content="",this.for="",this.open=!1,this.triggerElement=null,this.contentAnimated=!1,this.closing=!1,this.contentSide=null,this.hasSlottedBody=!1,this.triggerId=kn("pk-tooltip-trigger"),this.tooltipId=kn("pk-tooltip"),this.showGeneration=0,this.exitGeneration=0,this.syncPlacementAnimation=()=>{const o=this.popupElement?.getAttribute("data-current-placement")??this.placement,i=this.popupElement?.getContentElement();this.contentSide=o?Sr(o):null,wn(this.popupElement,o),i&&wn(i,o)},this.onBodySlotChange=o=>{const i=o.target;this.hasSlottedBody=i.assignedNodes({flatten:!0}).some(n=>n.nodeType===Node.ELEMENT_NODE?!0:n.nodeType===Node.TEXT_NODE&&!!n.textContent?.trim())},this.scheduleShow=()=>{this.usesPointerTrigger()&&(window.clearTimeout(this.closeTimer),window.clearTimeout(this.openTimer),this.openTimer=window.setTimeout(()=>this.showTooltip(),this.openDelay))},this.scheduleHide=()=>{this.usesPointerTrigger()&&(window.clearTimeout(this.openTimer),window.clearTimeout(this.closeTimer),this.closeTimer=window.setTimeout(()=>this.hideTooltip(),this.closeDelay))}}disconnectedCallback(){this.popupElement?.removeEventListener("pk-reposition",this.syncPlacementAnimation),this.clearTimers(),this.hideTooltip(!0),super.disconnectedCallback()}updated(t){super.updated(t),(t.has("trigger")||t.has("disabled")||t.has("for"))&&this.rebindTrigger(),this.disabled&&this.open&&this.hideTooltip(!0)}firstUpdated(){this.popupElement.addEventListener("pk-reposition",this.syncPlacementAnimation),this.for&&queueMicrotask(()=>{this.resolveExternalTrigger()})}async show(){this.disabled||(this.clearTimers(),this.showTooltip(!0),await this.updateComplete)}async hide(){this.clearTimers(),this.hideTooltip(!0),await this.updateComplete}clearTimers(){window.clearTimeout(this.openTimer),window.clearTimeout(this.closeTimer)}resolveExternalTrigger(){this.triggerElement=Fo(this,this.for),this.rebindTrigger()}onTriggerSlotChange(t){const[o]=t.target.assignedElements({flatten:!0});this.unbindTrigger(this.triggerElement),this.triggerElement=o??null,this.rebindTrigger(),this.requestUpdate()}rebindTrigger(){this.unbindTrigger(this.triggerElement),this.for&&(this.triggerElement=Fo(this,this.for)),this.bindTrigger(this.triggerElement)}usesPointerTrigger(){return!this.disabled&&this.trigger!=="manual"}bindTrigger(t){!t||!this.usesPointerTrigger()||(t.id||(t.id=this.triggerId),t.setAttribute("aria-describedby",this.tooltipId),t.addEventListener("mouseenter",this.scheduleShow),t.addEventListener("mouseleave",this.scheduleHide),t.addEventListener("focus",this.scheduleShow),t.addEventListener("blur",this.scheduleHide))}unbindTrigger(t){t&&(t.removeAttribute("aria-describedby"),t.removeEventListener("mouseenter",this.scheduleShow),t.removeEventListener("mouseleave",this.scheduleHide),t.removeEventListener("focus",this.scheduleShow),t.removeEventListener("blur",this.scheduleHide))}getAnchor(){return this.for?Fo(this,this.for):this.triggerElement?this.triggerElement:null}prepareContentForEnter(t){t&&(t.classList.remove("closing"),t.style.animation="none",t.getBoundingClientRect(),t.style.removeProperty("animation"),t.style.removeProperty("opacity"),t.style.removeProperty("transform"))}showTooltip(t=!1){if(!this.getAnchor()||this.open&&this.contentAnimated&&!this.closing&&!t)return;this.open||this.dispatchEvent(new kr);const o=++this.showGeneration;this.exitGeneration+=1,this.closing=!1,this.open=!0,this.contentAnimated=!1,this.prepareContentForEnter(this.popupElement?.getContentElement()),this.updateComplete.then(async()=>{o===this.showGeneration&&(await Er(this.popupElement,this.placement),o===this.showGeneration&&(this.syncPlacementAnimation(),this.prepareContentForEnter(this.popupElement?.getContentElement()),this.contentAnimated=!0,this.dispatchEvent(new wr),this.dispatchEvent(new CustomEvent("pk-open-change",{detail:{open:!0},bubbles:!0,composed:!0}))))})}hideTooltip(t=!1,o=!1){if(!(!this.open&&!this.closing&&!t)&&!(this.closing&&!t)){if(o){const i=new xr("api");if(!this.dispatchEvent(i))return}if(this.showGeneration+=1,t){this.finishHide();return}if(!this.contentAnimated){this.finishHide();return}this.playExitAnimation()}}async playExitAnimation(){if(!this.open)return;const t=this.exitGeneration+1;this.exitGeneration=t;const o=this.popupElement?.getContentElement();this.closing=!0,this.contentAnimated=!1,o&&await this.waitForExitAnimation(o),t===this.exitGeneration&&this.finishHide()}waitForExitAnimation(t){return new Promise(o=>{let i=!1;const n=()=>{i||(i=!0,t.removeEventListener("animationend",s),window.clearTimeout(r),t.classList.remove("closing"),o())},s=a=>{a.target===t&&a.animationName.startsWith("pk-tooltip-out")&&n()};t.classList.add("closing"),t.addEventListener("animationend",s);const r=window.setTimeout(n,200)})}finishHide(){const t=this.popupElement?.getContentElement();this.closing=!1,this.contentAnimated=!1,this.contentSide=null,this.open=!1,this.popupElement?.removeAttribute("data-side"),this.prepareContentForEnter(t),this.dispatchEvent(new _r),this.dispatchEvent(new CustomEvent("pk-open-change",{detail:{open:!1},bubbles:!0,composed:!0}))}render(){const t=this.getAnchor();return W`
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
                    class=${ve({content:!0,"pk-popup-content":!0,closing:this.closing})}
                    id=${this.tooltipId}
                    role="tooltip"
                    ?hidden=${!this.open&&!this.closing}
                    data-open=${this.contentAnimated&&!this.closing?"":j}
                    data-side=${this.contentSide??j}
                >
                    <slot @slotchange=${this.onBodySlotChange}></slot>
                    ${this.hasSlottedBody?j:this.content||j}
                </div>
            </pk-popup>
        `}},Uo.styles=_1,Uo);k([S({reflect:!0})],Bt.prototype,"placement",void 0);k([S({reflect:!0})],Bt.prototype,"trigger",void 0);k([S({type:Boolean,reflect:!0})],Bt.prototype,"disabled",void 0);k([S({type:Number,attribute:"open-delay"})],Bt.prototype,"openDelay",void 0);k([S({type:Number,attribute:"close-delay"})],Bt.prototype,"closeDelay",void 0);k([S()],Bt.prototype,"content",void 0);k([S({reflect:!0})],Bt.prototype,"for",void 0);k([Kt("pk-popup")],Bt.prototype,"popupElement",void 0);k([Jt()],Bt.prototype,"open",void 0);k([Jt()],Bt.prototype,"contentAnimated",void 0);k([Jt()],Bt.prototype,"closing",void 0);k([Jt()],Bt.prototype,"contentSide",void 0);k([Jt()],Bt.prototype,"hasSlottedBody",void 0);Bt=k([Zt("pk-tooltip")],Bt);var S1=ji({name:"PkTooltip",tagName:"pk-tooltip"}),E1=class extends Event{constructor(){super("pk-invalid",{bubbles:!0,cancelable:!1,composed:!0})}};function C1(){return{observedAttributes:["custom-error"],checkValidity(e){const t={message:"",isValid:!0,invalidKeys:[]};return e.customError&&(t.message=e.customError,t.isValid=!1,t.invalidKeys.push("customError")),t}}}var Ho,_e=(Ho=class extends xe{static get validators(){return[C1()]}static get observedAttributes(){const t=new Set(super.observedAttributes??[]);for(const o of this.validators)for(const i of o.observedAttributes??[])t.add(i);return[...t]}constructor(){super(),this.internals=this.attachInternals(),this.assumeInteractionOn=["input"],this.validators=[],this.name=null,this.disabled=!1,this.required=!1,this.customError=null,this.valueHasChanged=!1,this.hasInteracted=!1,this.emittedEvents=[],this.emitInvalid=t=>{t.target===this&&(this.hasInteracted=!0,this.dispatchEvent(new E1))},this.handleInteraction=t=>{this.emittedEvents.includes(t.type)||this.emittedEvents.push(t.type),this.emittedEvents.length>=this.assumeInteractionOn.length&&(this.hasInteracted=!0,this.updateValidity())},this.addEventListener("invalid",this.emitInvalid)}connectedCallback(){super.connectedCallback();for(const t of this.assumeInteractionOn)this.addEventListener(t,this.handleInteraction);this.updateValidity()}disconnectedCallback(){this.hostAriaMirror?.disconnect(),this.hostAriaMirror=void 0;for(const t of this.assumeInteractionOn)this.removeEventListener(t,this.handleInteraction);this.removeEventListener("invalid",this.emitInvalid),super.disconnectedCallback()}updated(t){t.has("customError")&&this.setCustomValidity(this.customError??""),t.has("disabled")&&this.setState("disabled",!!this.disabled),(t.has("value")||t.has("disabled")||t.has("required")||t.has("name"))&&this.syncFormValue(),this.updateValidity(),super.updated(t),this.syncHostAriaMirror()}firstUpdated(t){super.firstUpdated(t),this.connectHostAriaMirror()}getAriaMirrorTarget(){return this.input??null}syncStandaloneAria(){}connectHostAriaMirror(){this.hostAriaMirror?.disconnect(),this.hostAriaMirror=new Ef(this,()=>this.getAriaMirrorTarget(),()=>this.syncStandaloneAria()),this.hostAriaMirror.connect()}syncHostAriaMirror(){this.hostAriaMirror?.sync()}formResetCallback(){this.resetValidity(),this.hasInteracted=!1,this.valueHasChanged=!1,this.emittedEvents=[],this.resetToDefaultValue(),this.syncFormValue(),this.updateValidity()}formDisabledCallback(t){this.disabled=t,this.updateValidity()}formStateRestoreCallback(t,o){this.restoreFormState(t),this.syncFormValue(),this.updateValidity()}set form(t){t?this.setAttribute("form",t):this.removeAttribute("form")}get form(){return this.internals.form}get labels(){return this.internals.labels}get validity(){return this.internals.validity}get willValidate(){return this.internals.willValidate}get validationMessage(){return this.internals.validationMessage}getForm(){return this.internals.form}checkValidity(){return this.updateValidity(),this.internals.checkValidity()}reportValidity(){return this.updateValidity(),this.hasInteracted=!0,this.internals.reportValidity()}resetValidity(){this.setCustomValidity(""),this.internals.setValidity({}),this.syncCustomStates()}setCustomValidity(t){if(!t){this.customError=null,this.internals.setValidity({}),this.syncCustomStates();return}this.customError=t;const o=this.validationTarget;o instanceof HTMLElement?this.internals.setValidity({customError:!0},t,o):this.internals.setValidity({customError:!0},t),this.syncCustomStates()}get validationTarget(){return this.input}get allValidators(){return[...this.constructor.validators??[],...this.validators??[]]}setFormValue(t,o){this.internals.setFormValue(t,o??t)}setValue(t,o){this.setFormValue(t,o??t)}updateValidity(){if(this.disabled||this.hasAttribute("disabled")||!this.willValidate){this.internals.setValidity({}),this.syncCustomStates();return}const t=this.allValidators;if(!t.length)return;const o={customError:!!this.customError};let i="";const n=this.validationTarget;for(const s of t){const{isValid:r,message:a,invalidKeys:l}=s.checkValidity(this);if(!r){i||(i=a);for(const d of l)o[d]=!0}}i||(i=this.validationMessage),n instanceof HTMLElement?this.internals.setValidity(o,i,n):this.internals.setValidity(o,i),this.syncCustomStates()}syncCustomStates(){const t=this.internals.validity.valid;this.setState("required",this.required),this.setState("optional",!this.required),this.setState("invalid",!t),this.setState("valid",t),this.setState("user-invalid",!t&&this.hasInteracted),this.setState("user-valid",t&&this.hasInteracted)}setState(t,o){const i=this.internals.states;i&&(o?i.add(t):i.delete(t))}syncFormValue(){}resetToDefaultValue(){}restoreFormState(t){}},Ho.formAssociated=!0,Ho);k([S({reflect:!0})],_e.prototype,"name",void 0);k([S({type:Boolean,reflect:!0})],_e.prototype,"disabled",void 0);k([S({type:Boolean,reflect:!0})],_e.prototype,"required",void 0);k([S({attribute:"custom-error",reflect:!0})],_e.prototype,"customError",void 0);k([S({attribute:!1,state:!0})],_e.prototype,"valueHasChanged",void 0);k([S({attribute:!1,state:!0})],_e.prototype,"hasInteracted",void 0);function zr(){return{checkValidity(e){const t=e.input,o={message:"",isValid:!0,invalidKeys:[]};if(!t)return o;let i=!0;if("checkValidity"in t&&typeof t.checkValidity=="function"&&(i=t.checkValidity()),i)return o;if(o.isValid=!1,"validationMessage"in t&&typeof t.validationMessage=="string"&&(o.message=t.validationMessage),!("validity"in t)||!t.validity)return o.invalidKeys.push("customError"),o;for(const n of Object.keys(t.validity)){if(n==="valid")continue;const s=n;t.validity[s]&&o.invalidKeys.push(s)}return o}}}function Yn(e={}){let{validationElement:t,validationProperty:o}=e;!t&&typeof document<"u"&&(t=Object.assign(document.createElement("input"),{required:!0})),o||(o="value");const i={observedAttributes:["required"],message:t?.validationMessage??"Please fill out this field.",checkValidity(n){const s={message:"",isValid:!0,invalidKeys:[]};if(!n.required)return s;const r=n[o];return(r==null||r===!1||r==="")&&(s.isValid=!1,s.message=typeof i.message=="function"?i.message(n):i.message??"",s.invalidKeys.push("valueMissing")),s}};return i}function A1(){return W`
        <svg xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" viewBox="0 0 640 640">
            <path
                fill="currentColor"
                d="M557.5 192L534.9 214.6L278.9 470.6C266.4 483.1 246.1 483.1 233.6 470.6L105.6 342.6L83 320L128.3 274.7C129.6 276 172.3 318.7 256.3 402.7L489.7 169.3L512.3 146.7L557.6 192z"
            />
        </svg>
    `}function $1(){return W`
        <svg xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" viewBox="0 0 640 640">
            <path fill="currentColor" d="M96 352V288H544V352H96z" />
        </svg>
    `}var T1=[ot`
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
`,ot`
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
`],uo,Xt=(uo=class extends _e{constructor(...t){super(...t),this.assumeInteractionOn=["change"],this.hasSlotController=new Hi(this,"hint"),this.checked=!1,this.indeterminate=!1,this.disabled=!1,this.invalid=!1,this.checkboxValue="on",this.defaultChecked=!1,this.ariaLabel=null,this.hint="",this.withHint=!1,this.hasDefaultSlotContent=!1}static get validators(){return[...super.validators,Yn({validationProperty:"checked"})]}get validationTarget(){return this.input}syncFormValue(){this.setFormValue(this.checked?this.checkboxValue:null,this.checked?"on":"off")}resetToDefaultValue(){this.checked=this.defaultChecked,this.indeterminate=!1}restoreFormState(t){t==="on"||t===this.checkboxValue?this.checked=!0:this.checked=!1}updated(t){if(!this.input){super.updated(t);return}(t.has("indeterminate")||t.has("checked"))&&(this.input.indeterminate=this.indeterminate,this.input.checked=this.checked),super.updated(t)}defaultSlotChanged(t){const o=t.target;this.hasDefaultSlotContent=o.assignedNodes({flatten:!0}).some(i=>i.nodeType===Node.TEXT_NODE?i.textContent?.trim():i.nodeType===Node.ELEMENT_NODE)}handleChange(t){const o=t.target;this.checked=o.checked,this.indeterminate=!1,this.dispatchEvent(new CustomEvent("pk-change",{detail:{checked:this.checked},bubbles:!0,composed:!0})),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}render(){const t=this.hasDefaultSlotContent,o=!!this.hint||this.hasSlotController.test("hint",this.withHint);return W`
            <label
                part="base"
                class=${ve({root:!0,"root--with-hint":o})}
            >
                <input
                    part="input"
                    class="input"
                    type="checkbox"
                    .checked=${this.checked}
                    ?disabled=${this.disabled}
                    ?required=${this.required}
                    name=${this.name??j}
                    value=${this.checkboxValue}
                    aria-labelledby=${t?"label":j}
                    aria-describedby=${o?"hint":j}
                    aria-label=${t?j:this.ariaLabel??j}
                    aria-invalid=${this.invalid?"true":j}
                    @change=${this.handleChange}
                />
                <span part="control" class="control">
                    <span part="checked-icon" class="icon-check">${A1()}</span>
                    <span part="indeterminate-icon" class="icon-indeterminate">${$1()}</span>
                </span>
                ${t||o?W`
                        <span class="text">
                            ${t?W`
                                    <span part="label" class="label" id="label">
                                        <slot @slotchange=${this.defaultSlotChanged}></slot>
                                    </span>
                                `:W`<slot @slotchange=${this.defaultSlotChanged} hidden></slot>`}
                            ${o?W`
                                    <span part="hint" class="hint" id="hint">
                                        <slot name="hint">${this.hint}</slot>
                                    </span>
                                `:j}
                        </span>
                    `:W`<slot @slotchange=${this.defaultSlotChanged} hidden></slot>`}
            </label>
        `}},uo.shadowRootOptions={mode:"open",delegatesFocus:!0},uo.styles=T1,uo);k([S({type:Boolean,reflect:!0})],Xt.prototype,"checked",void 0);k([S({type:Boolean,reflect:!0})],Xt.prototype,"indeterminate",void 0);k([S({type:Boolean,reflect:!0})],Xt.prototype,"disabled",void 0);k([S({type:Boolean,reflect:!0})],Xt.prototype,"invalid",void 0);k([S()],Xt.prototype,"checkboxValue",void 0);k([S({attribute:"default-checked",type:Boolean})],Xt.prototype,"defaultChecked",void 0);k([S({attribute:"aria-label"})],Xt.prototype,"ariaLabel",void 0);k([S()],Xt.prototype,"hint",void 0);k([S({type:Boolean,attribute:"with-hint"})],Xt.prototype,"withHint",void 0);k([Kt(".input")],Xt.prototype,"input",void 0);k([Jt()],Xt.prototype,"hasDefaultSlotContent",void 0);Xt=k([Zt("pk-checkbox")],Xt);var z1=class extends Event{constructor(){super("pk-clear",{bubbles:!0,cancelable:!1,composed:!0})}};function Pr(e,t){return t||(e.getAttribute("hint")??"")}function En(e,t,o=!1){return!!t||e("instructions",o)||e("hint")}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const P1=e=>e.strings===void 0,M1={},L1=(e,t=M1)=>e._$AH=t;/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Gd=vr(class extends br{constructor(e){if(super(e),e.type!==Ve.PROPERTY&&e.type!==Ve.ATTRIBUTE&&e.type!==Ve.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!P1(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===Qt||t===j)return t;const o=e.element,i=e.name;if(e.type===Ve.PROPERTY){if(t===o[i])return Qt}else if(e.type===Ve.BOOLEAN_ATTRIBUTE){if(!!t===o.hasAttribute(i))return Qt}else if(e.type===Ve.ATTRIBUTE&&o.getAttribute(i)===t+"")return Qt;return L1(e),t}});var O1=new Set(["button","submit","reset","checkbox","radio","file","image","hidden"]),R1="pk-implicit-submit",I1=(e,t)=>{if(e.key!=="Enter"||e.defaultPrevented||e.isComposing||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return!1;const o=(t||"text").toLowerCase();return!O1.has(o)},D1=e=>{const t=e.closest?.("pk-dialog");if(t){const i=t.querySelector("form");if(i)return i}const o=e.form;return o&&o.id==="main"?e.closest?.("form")!==o?e.closest("form"):null:o},F1=(e,t,o)=>{if(e.disabled||e.readonly||!I1(t,o))return!1;const i=D1(e);return!i||i.id==="main"?!1:(t.preventDefault(),t.stopPropagation(),i.dispatchEvent(new CustomEvent(R1,{bubbles:!1,cancelable:!0})),!0)},N1=ot`
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
`,Vo,pt=(Vo=class extends _e{constructor(...t){super(...t),this.assumeInteractionOn=["blur","input"],this.hasSlotController=new Hi(this,"instructions","hint","label","start","end"),this.inputId=kn("pk-input"),this.type="text",this._value=null,this.defaultValue=null,this.size="default",this.label="",this.instructions="",this.withClear=!1,this.placeholder="",this.readonly=!1,this.invalid=!1,this.fitCell=!1,this.mono=!1,this.autofocus=!1,this.withLabel=!1,this.withInstructions=!1}static get validators(){return[...super.validators,zr(),Yn()]}get value(){return this.valueHasChanged?this._value??"":this._value??this.defaultValue??""}set value(t){const o=t??"";this._value!==o&&(this.valueHasChanged=!0,this._value=o)}connectedCallback(){this.instructions=Pr(this,this.instructions),this.hasAttribute("with-hint")&&(this.withInstructions=!0),super.connectedCallback()}syncFormValue(){this.setValue(this.value||"")}resetToDefaultValue(){this.valueHasChanged=!1,this._value=null}restoreFormState(t){typeof t=="string"&&(this.value=t)}formResetCallback(){this.valueHasChanged=!1,this._value=null,this.input&&(this.input.value=this.defaultValue??""),super.formResetCallback()}updated(t){(t.has("value")||t.has("defaultValue"))&&this.setState("blank",!this.value),super.updated(t)}syncStandaloneAria(){if(!this.input)return;const t=!!this.label||this.hasSlotController.test("label",this.withLabel),o=En((i,n)=>this.hasSlotController.test(i,n),this.instructions,this.withInstructions);Rd({control:this.input,labelId:`${this.inputId}-label`,instructionsId:`${this.inputId}-instructions`,hasLabel:t,hasInstructions:o,required:this.required,invalid:this.invalid||!this.internals.validity.valid})}hasLabelContent(){return!!this.label||this.hasSlotController.test("label",this.withLabel)}hasInstructionsContent(){return En((t,o)=>this.hasSlotController.test(t,o),this.instructions,this.withInstructions)}focus(t){this.input?.focus(t)}blur(){this.input?.blur()}select(){this.input?.select()}handleInput(){this.value=this.input.value,this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}handleChange(t){this.value=this.input.value,t.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}handleKeyDown(t){F1(this,t,this.type)}handleClearClick(t){t.preventDefault(),this.value!==""&&(this.value="",this.dispatchEvent(new z1),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0})),this.input.focus())}render(){const t=this.hasLabelContent(),o=this.hasInstructionsContent(),i=this.withClear&&!this.disabled&&!this.readonly&&this.value.length>0,n=this.hasSlotController.test("start"),s=this.hasSlotController.test("end");return W`
            <div part="form-control" class="form-control">
                ${t||o?W`
                        <div part="header" class="form-control__header">
                            ${t?W`
                                    <label
                                        part="label"
                                        class="form-control__label"
                                        id=${`${this.inputId}-label`}
                                        for=${`${this.inputId}-control`}
                                    >
                                        <slot name="label">${this.label}</slot>
                                    </label>
                                `:j}

                            ${o?W`
                                    <p
                                        part="instructions"
                                        class="form-control__instructions"
                                        id=${`${this.inputId}-instructions`}
                                    >
                                        <slot name="instructions">${this.instructions}</slot>
                                        <slot name="hint"></slot>
                                    </p>
                                `:j}
                        </div>
                    `:j}

                <div part="base" class="form-control__input">
                    ${n?W`
                            <span part="start" class="form-control__start">
                                <slot name="start"></slot>
                            </span>
                        `:W`<slot name="start" hidden></slot>`}

                    <input
                        part="input"
                        class="input"
                        id=${t?`${this.inputId}-control`:j}
                        type=${this.type}
                        .value=${Gd(this.value)}
                        placeholder=${this.placeholder||j}
                        pattern=${Te(this.pattern)}
                        minlength=${Te(this.minlength)}
                        maxlength=${Te(this.maxlength)}
                        min=${Te(this.min)}
                        max=${Te(this.max)}
                        step=${Te(this.step)}
                        autocomplete=${Te(this.autocomplete)}
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

                    ${i?W`
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
                        `:j}

                    ${s?W`
                            <span part="end" class="form-control__end">
                                <slot name="end"></slot>
                            </span>
                        `:W`<slot name="end" hidden></slot>`}
                </div>
            </div>
        `}},Vo.styles=[yr,pr(),nc(".input","var(--pk-input-border-radius, var(--pk-radius-sm))"),sc(".input"),N1],Vo);k([Kt("input")],pt.prototype,"input",void 0);k([S({reflect:!0})],pt.prototype,"type",void 0);k([Jt()],pt.prototype,"value",null);k([S({attribute:"value",reflect:!0})],pt.prototype,"defaultValue",void 0);k([S({reflect:!0})],pt.prototype,"size",void 0);k([S()],pt.prototype,"label",void 0);k([S()],pt.prototype,"instructions",void 0);k([S({attribute:"with-clear",type:Boolean})],pt.prototype,"withClear",void 0);k([S()],pt.prototype,"placeholder",void 0);k([S({type:Boolean,reflect:!0})],pt.prototype,"readonly",void 0);k([S({type:Boolean,reflect:!0})],pt.prototype,"invalid",void 0);k([S({type:Boolean,reflect:!0,attribute:"fit-cell"})],pt.prototype,"fitCell",void 0);k([S({type:Boolean,reflect:!0})],pt.prototype,"mono",void 0);k([S()],pt.prototype,"pattern",void 0);k([S({type:Number})],pt.prototype,"minlength",void 0);k([S({type:Number})],pt.prototype,"maxlength",void 0);k([S()],pt.prototype,"min",void 0);k([S()],pt.prototype,"max",void 0);k([S()],pt.prototype,"step",void 0);k([S()],pt.prototype,"autocomplete",void 0);k([S({type:Boolean,reflect:!0})],pt.prototype,"autofocus",void 0);k([S({attribute:"with-label",type:Boolean})],pt.prototype,"withLabel",void 0);k([S({attribute:"with-instructions",type:Boolean})],pt.prototype,"withInstructions",void 0);pt=k([Zt("pk-input")],pt);var io=ji({name:"PkInput",tagName:"pk-input"});function Yd(e){return!!e.detail?.checked}var j1=ot`
    @layer pk-component {
        :host {
            display: inline-flex;
            vertical-align: middle;
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-sm);
            line-height: var(--pk-line-height);
            --pk-lightswitch-border-color: var(--pk-color-slate-800);
            --pk-lightswitch-track-off: var(--pk-color-gray-200);
            --pk-lightswitch-track-on: var(--pk-color-teal-550);
            --pk-lightswitch-track-on-border: var(--pk-color-teal-550-border);
            --pk-lightswitch-focus-shadow: 0 0 0 1px #fff, 0 0 0 3px var(--pk-color-sky-600),
                0 0 6px 1px hsl(from var(--pk-color-sky-600) h s l / 0.8);
            --pk-lightswitch-invalid-shadow: 0 0 0 1px #fff, 0 0 0 2.5px var(--pk-color-rose-600);
            --pk-lightswitch-invalid-focus-shadow: 0 0 0 1px #fff, 0 0 0 3px var(--pk-color-rose-600),
                0 0 6px 1px hsl(from var(--pk-color-rose-600) h s l / 0.8);
        }

        :host([disabled]) {
            cursor: not-allowed;
        }

        .base {
            display: inline-flex;
            align-items: flex-start;
            gap: 0.5rem;
        }

        :host([disabled]) .base {
            opacity: 0.5;
        }

        .content {
            min-width: 0;
            cursor: pointer;
            user-select: none;
        }

        :host([disabled]) .content {
            cursor: not-allowed;
        }

        .label {
            display: block;
            /* Match checkbox / radio option labels (gray-700), not gray-900. */
            color: var(--pk-color-gray-700);
            line-height: 1rem;
        }

        .label:empty {
            display: none;
        }

        .instructions:empty,
        .hint:empty {
            display: none;
        }

        .switch {
            display: inline-flex;
            flex-shrink: 0;
            align-items: center;
            margin: 0;
            padding: 0;
            border: 0;
            border-radius: 11px;
            background: var(--pk-lightswitch-track-off, #d8dee7);
            box-shadow: inset 0 0 0 1px var(--pk-lightswitch-border-color, #667c92);
            cursor: pointer;
            user-select: none;
            appearance: none;
            transition: background-color 0.15s ease, box-shadow 0.15s ease;
        }

        .switch:focus {
            outline: none;
        }

        .switch:focus-visible {
            box-shadow: var(--pk-lightswitch-focus-shadow);
        }

        .switch[aria-checked='true'] {
            background: var(--pk-lightswitch-track-on, #0f9d8a);
            box-shadow: inset 0 0 0 1px var(--pk-lightswitch-track-on-border, #007d6f);
        }

        .switch[aria-checked='true']:focus-visible {
            box-shadow: var(--pk-lightswitch-focus-shadow);
        }

        :host([invalid]) .switch,
        :host(:state(user-invalid)) .switch,
        .switch[aria-invalid='true'] {
            box-shadow: var(--pk-lightswitch-invalid-shadow);
        }

        :host([invalid]) .switch[aria-checked='true'],
        :host(:state(user-invalid)) .switch[aria-checked='true'],
        .switch[aria-invalid='true'][aria-checked='true'] {
            background: var(--pk-lightswitch-track-on);
        }

        :host([invalid]) .switch:focus-visible,
        :host(:state(user-invalid)) .switch:focus-visible,
        .switch[aria-invalid='true']:focus-visible {
            box-shadow: var(--pk-lightswitch-invalid-focus-shadow);
        }

        .switch:disabled {
            cursor: not-allowed;
        }

        :host([size='default']) .switch {
            width: 34px;
            height: 22px;
        }

        :host([size='sm']) .switch {
            width: 28px;
            height: 18px;
            border-radius: 9px;
        }

        :host([size='xs']) .switch {
            width: 24px;
            height: 16px;
            border-radius: 8px;
        }

        :host([size='xxs']) .switch {
            width: 24px;
            height: 14px;
            border-radius: 7px;
        }

        .thumb {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: var(--pk-color-white, #fff);
            box-shadow: inset 0 0 0 1px var(--pk-lightswitch-border-color, #667c92);
            pointer-events: none;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        :host([size='default']) .thumb {
            width: 18px;
            height: 18px;
            transform: translateX(2px);
        }

        :host([size='default']) .switch[aria-checked='true'] .thumb {
            transform: translateX(calc(100% - 4px));
            box-shadow: inset 0 0 0 1px var(--pk-lightswitch-track-on-border);
        }

        :host([size='sm']) .thumb {
            width: 14px;
            height: 14px;
            transform: translateX(2px);
        }

        :host([size='sm']) .switch[aria-checked='true'] .thumb {
            transform: translateX(calc(100% - 2px));
            box-shadow: inset 0 0 0 1px var(--pk-lightswitch-track-on-border);
        }

        :host([size='xs']) .thumb {
            width: 12px;
            height: 12px;
            transform: translateX(2px);
        }

        :host([size='xs']) .switch[aria-checked='true'] .thumb {
            transform: translateX(calc(100% - 2px));
            box-shadow: inset 0 0 0 1px var(--pk-lightswitch-track-on-border);
        }

        :host([size='xxs']) .thumb {
            width: 10px;
            height: 10px;
            transform: translateX(2px);
        }

        :host([size='xxs']) .switch[aria-checked='true'] .thumb {
            transform: translateX(12px);
            box-shadow: inset 0 0 0 1px var(--pk-lightswitch-track-on-border, #007d6f);
        }

        .thumb svg {
            width: 14px;
            height: 14px;
            color: var(--pk-lightswitch-track-on);
            opacity: 0;
            transform: translateY(1px);
            transition: opacity 0.15s ease;
        }

        .switch[aria-checked='true'] .thumb svg {
            opacity: 1;
        }

        :host([size='sm']) .thumb svg {
            width: 10px;
            height: 10px;
        }

        :host([size='xs']) .thumb svg,
        :host([size='xxs']) .thumb svg {
            display: none;
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
        }
    }
`,B1=W`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true">
        <path fill="currentColor" d="M557.5 192L534.9 214.6L278.9 470.6C266.4 483.1 246.1 483.1 233.6 470.6L105.6 342.6L83 320L128.3 274.7C129.6 276 172.3 318.7 256.3 402.7L489.7 169.3L512.3 146.7L557.6 192z" />
    </svg>
`,po,ae=(po=class extends _e{constructor(...t){super(...t),this.assumeInteractionOn=["change"],this.hasSlotController=new Hi(this,"instructions","hint"),this.checked=!1,this.defaultChecked=!1,this.invalid=!1,this.size="default",this.value="on",this.label="",this.instructions=""}static get validators(){return[...super.validators,zr(),Yn({validationProperty:"checked"})]}connectedCallback(){this.instructions=Pr(this,this.instructions),super.connectedCallback()}get validationTarget(){return this.input}syncFormValue(){this.setFormValue(this.checked?this.value:null,this.checked?"on":"off")}resetToDefaultValue(){this.checked=this.defaultChecked}restoreFormState(t){t==="on"||t===this.value?this.checked=!0:this.checked=!1}updated(t){this.input&&t.has("checked")&&(this.input.checked=this.checked),super.updated(t)}click(){this.switchElement?.click()}focus(t){this.switchElement?.focus(t)}blur(){this.switchElement?.blur()}toggle(){this.disabled||(this.checked=!this.checked,this.emitCheckedChange())}handleKeyDown(t){const o=this.matches(":dir(rtl)");if(t.key===" "||t.key==="Enter"){t.preventDefault(),this.toggle();return}if(t.key==="ArrowLeft"){t.preventDefault(),this.checked=o,this.emitCheckedChange();return}t.key==="ArrowRight"&&(t.preventDefault(),this.checked=!o,this.emitCheckedChange())}emitCheckedChange(){this.hasInteracted=!0,this.dispatchEvent(new CustomEvent("pk-change",{detail:{checked:this.checked},bubbles:!0,composed:!0})),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}handleLabelClick(t){this.disabled||t.target===this.switchElement||this.toggle()}hasLabelContent(){if(this.label)return!0;const t=this.shadowRoot?.querySelector("slot:not([name])");return t?t.assignedNodes({flatten:!0}).some(o=>o.nodeType===Node.TEXT_NODE?!!o.textContent?.trim():o.nodeType===Node.ELEMENT_NODE):!1}render(){const t=En((i,n)=>this.hasSlotController.test(i,n),this.instructions),o=this.hasLabelContent();return W`
            <div part="base" class="base">
                <button
                    part="switch"
                    class="switch"
                    type="button"
                    role="switch"
                    ?disabled=${this.disabled}
                    aria-checked=${this.checked?"true":"false"}
                    aria-invalid=${this.invalid?"true":j}
                    aria-describedby=${t?"instructions":j}
                    aria-labelledby=${o?"label":j}
                    @click=${this.toggle}
                    @keydown=${this.handleKeyDown}
                >
                    <span part="thumb" class="thumb">${B1}</span>
                </button>
                <input
                    part="input"
                    class="input"
                    type="checkbox"
                    tabindex="-1"
                    .checked=${this.checked}
                    ?disabled=${this.disabled}
                    ?required=${this.required}
                    value=${this.value}
                    aria-invalid=${this.invalid?"true":j}
                    @change=${i=>i.stopPropagation()}
                />
                ${o||t?W`
                        <div class="content" @click=${this.handleLabelClick}>
                            ${o?W`
                                    <span part="label" class="label" id="label">
                                        <slot></slot>${this.label}
                                    </span>
                                `:j}
                            ${t?W`
                                    <span part="instructions" class="instructions form-control__instructions" id="instructions">
                                        <slot name="instructions">${this.instructions}</slot>
                                        <slot name="hint"></slot>
                                    </span>
                                `:j}
                        </div>
                    `:j}
            </div>
        `}},po.shadowRootOptions={mode:"open",delegatesFocus:!0},po.styles=[yr,j1],po);k([S({type:Boolean,reflect:!0})],ae.prototype,"checked",void 0);k([S({attribute:"default-checked",type:Boolean})],ae.prototype,"defaultChecked",void 0);k([S({type:Boolean,reflect:!0})],ae.prototype,"invalid",void 0);k([S({reflect:!0})],ae.prototype,"size",void 0);k([S()],ae.prototype,"value",void 0);k([S()],ae.prototype,"label",void 0);k([S()],ae.prototype,"instructions",void 0);k([Kt(".input")],ae.prototype,"input",void 0);k([Kt('[part="switch"]')],ae.prototype,"switchElement",void 0);ae=k([Zt("pk-lightswitch")],ae);var U1=Fe({name:"PkLightswitch",inheritAttrs:!1,props:{checked:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},invalid:{type:Boolean,default:!1},required:{type:Boolean,default:!1},name:{type:String,default:void 0},value:{type:String,default:"on"},label:{type:String,default:void 0},instructions:{type:String,default:void 0},size:{type:String,default:void 0}},emits:{"update:checked":e=>typeof e=="boolean"},setup(e,{attrs:t,slots:o,emit:i}){const n=s=>{const r=t.onPkChange;r?.(s),i("update:checked",Yd(s))};return()=>fo("pk-lightswitch",{...t,checked:e.checked,disabled:e.disabled||void 0,invalid:e.invalid||void 0,required:e.required||void 0,...e.name?{name:e.name}:{},value:e.value,...e.label?{label:e.label}:{},...e.instructions?{instructions:e.instructions}:{},...e.size?{size:e.size}:{},onPkChange:n},Fn(o))}}),H1=ot`
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
`,qo,Rt=(qo=class extends _e{constructor(...t){super(...t),this.assumeInteractionOn=["blur","input"],this.hasSlotController=new Hi(this,"instructions","hint","label"),this.controlId=kn("pk-textarea"),this.placeholder="",this._value=null,this.defaultValue=null,this.size="default",this.label="",this.instructions="",this.readonly=!1,this.invalid=!1,this.fitCell=!1,this.withLabel=!1,this.withInstructions=!1}static get validators(){return[...super.validators,zr(),Yn()]}get value(){return this.valueHasChanged?this._value??"":this._value??this.defaultValue??""}set value(t){const o=t??"";this._value!==o&&(this.valueHasChanged=!0,this._value=o)}connectedCallback(){this.instructions=Pr(this,this.instructions),this.hasAttribute("with-hint")&&(this.withInstructions=!0),super.connectedCallback()}syncFormValue(){this.setValue(this.value||"")}resetToDefaultValue(){this.valueHasChanged=!1,this._value=null}restoreFormState(t){typeof t=="string"&&(this.value=t)}formResetCallback(){this.valueHasChanged=!1,this._value=null,this.input&&(this.input.value=this.defaultValue??""),super.formResetCallback()}updated(t){(t.has("value")||t.has("defaultValue"))&&this.setState("blank",!this.value),super.updated(t)}syncStandaloneAria(){if(!this.input)return;const t=this.hasLabelContent(),o=this.hasInstructionsContent();Rd({control:this.input,labelId:`${this.controlId}-label`,instructionsId:`${this.controlId}-instructions`,hasLabel:t,hasInstructions:o,required:this.required,invalid:this.invalid||!this.internals.validity.valid})}hasLabelContent(){return!!this.label||this.hasSlotController.test("label",this.withLabel)}hasInstructionsContent(){return En((t,o)=>this.hasSlotController.test(t,o),this.instructions,this.withInstructions)}focus(t){this.input?.focus(t)}blur(){this.input?.blur()}handleInput(){this.value=this.input.value,this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}handleChange(t){this.value=this.input.value,t.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}render(){const t=this.hasLabelContent(),o=this.hasInstructionsContent();return W`
            <div part="form-control" class="form-control">
                ${t?W`
                        <label
                            part="label"
                            class="form-control__label"
                            id=${`${this.controlId}-label`}
                            for=${`${this.controlId}-control`}
                        >
                            <slot name="label">${this.label}</slot>
                        </label>
                    `:j}

                ${o?W`
                        <p
                            part="instructions"
                            class="form-control__instructions"
                            id=${`${this.controlId}-instructions`}
                        >
                            <slot name="instructions">${this.instructions}</slot>
                            <slot name="hint"></slot>
                        </p>
                    `:j}

                <textarea
                    part="textarea"
                    class="textarea"
                    id=${t?`${this.controlId}-control`:j}
                    rows=${Te(this.fitCell?this.rows??1:this.rows)}
                    .value=${Gd(this.value)}
                    placeholder=${this.placeholder||j}
                    maxlength=${Te(this.maxlength)}
                    ?disabled=${this.disabled}
                    ?readonly=${this.readonly}
                    ?required=${this.required}
                    @input=${this.handleInput}
                    @change=${this.handleChange}
                    @focus=${()=>this.dispatchEvent(new Event("focus",{bubbles:!0,composed:!0}))}
                    @blur=${()=>this.dispatchEvent(new Event("blur",{bubbles:!0,composed:!0}))}
                ></textarea>
            </div>
        `}},qo.styles=[yr,H1],qo);k([Kt("textarea")],Rt.prototype,"input",void 0);k([S()],Rt.prototype,"placeholder",void 0);k([Jt()],Rt.prototype,"value",null);k([S({attribute:"value",reflect:!0})],Rt.prototype,"defaultValue",void 0);k([S({reflect:!0})],Rt.prototype,"size",void 0);k([S()],Rt.prototype,"label",void 0);k([S()],Rt.prototype,"instructions",void 0);k([S({type:Boolean,reflect:!0})],Rt.prototype,"readonly",void 0);k([S({type:Boolean,reflect:!0})],Rt.prototype,"invalid",void 0);k([S({type:Boolean,reflect:!0,attribute:"fit-cell"})],Rt.prototype,"fitCell",void 0);k([S({type:Number})],Rt.prototype,"rows",void 0);k([S({type:Number,attribute:"max-length"})],Rt.prototype,"maxlength",void 0);k([S({attribute:"with-label",type:Boolean})],Rt.prototype,"withLabel",void 0);k([S({attribute:"with-instructions",type:Boolean})],Rt.prototype,"withInstructions",void 0);Rt=k([Zt("pk-textarea")],Rt);var gs=ji({name:"PkTextarea",tagName:"pk-textarea"}),Ii=new Set,Fs=null,V1=new Set([" ","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","PageUp","PageDown","Home","End"]);function ms(e){for(const t of e.composedPath())if(t instanceof HTMLElement&&Ii.has(t))return!0;return!1}function q1(e){if(!(e instanceof HTMLElement))return!1;if(e.isContentEditable)return!0;const t=e.tagName;return t==="INPUT"||t==="TEXTAREA"||t==="SELECT"}function K1(){const e=document.body,t=e.style.overflow;e.style.setProperty("overflow","hidden","important");const o=s=>{ms(s)||s.preventDefault()},i=s=>{ms(s)||s.preventDefault()},n=s=>{V1.has(s.key)&&(ms(s)||q1(s.target)||s.preventDefault())};return window.addEventListener("wheel",o,{passive:!1,capture:!0}),window.addEventListener("touchmove",i,{passive:!1,capture:!0}),window.addEventListener("keydown",n,{capture:!0}),()=>{window.removeEventListener("wheel",o,{capture:!0}),window.removeEventListener("touchmove",i,{capture:!0}),window.removeEventListener("keydown",n,{capture:!0}),e.style.removeProperty("overflow"),t&&(e.style.overflow=t)}}function W1(e){Ii.add(e),Ii.size===1&&(document.documentElement.classList.add("pk-scroll-lock"),document.documentElement.style.setProperty("--pk-scroll-lock-size","0px"),Fs=K1())}function vs(e){Ii.delete(e),Ii.size===0&&(Fs?.(),Fs=null,document.documentElement.classList.remove("pk-scroll-lock"),document.documentElement.style.removeProperty("--pk-scroll-lock-size"),document.documentElement.style.removeProperty("--pk-scroll-lock-gutter"))}function Co(e,t,o=500){return new Promise(i=>{const n=new AbortController,{signal:s}=n;if(e.classList.contains(t)){i();return}e.classList.add(t);let r=!1;const a=()=>{r||(r=!0,e.classList.remove(t),window.clearTimeout(l),i(),n.abort())};e.addEventListener("animationend",a,{once:!0,signal:s}),e.addEventListener("animationcancel",a,{once:!0,signal:s});const l=window.setTimeout(a,o);requestAnimationFrame(()=>{!r&&e.getAnimations().length===0&&a()})})}var G1=".modal-shade, .modal",Y1=e=>{const t=getComputedStyle(e);return t.display!=="none"&&t.visibility!=="hidden"&&Number.parseFloat(t.opacity||"1")>0};function Ns(e=document){const t=e.querySelectorAll(G1);for(const o of t)if(o instanceof HTMLElement&&!o.closest("pk-dialog")&&Y1(o))return!0;return!1}function X1(e,t={}){const o=t.getDocument?.()??document,i=t.root??o.body;let n=Ns(o);const s=()=>{const l=Ns(o);l!==n&&(n=l,e(l))},r=new MutationObserver(()=>{s()});r.observe(i,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","hidden"]});const a=window.setInterval(s,250);return{disconnect:()=>{r.disconnect(),window.clearInterval(a)}}}var J1=ot`
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
`,Z1=Ui(Md.xmark),Ko,ee=(Ko=class extends xe{constructor(...t){super(...t),this.open=!1,this.label="",this.description="",this.disablePointerDismissal=!1,this.withoutHeader=!1,this.withoutBodyPadding=!1,this.disableScrollLock=!1,this.size="default",this.triggerElement=null,this.previouslyFocused=null,this.yieldingToHostModal=!1,this.hostModalObserver=null,this.yieldBox=null,this.handleDocumentKeyDown=o=>{this.yieldingToHostModal||o.key==="Escape"&&this.open&&on(this)&&(o.preventDefault(),o.stopPropagation(),this.requestClose("escape"))},this.onHostModalPresenceChange=o=>{o?this.yieldToHostModal():this.restoreFromHostModal()},this.showing=!1,this.handleDialogCancel=o=>{o.preventDefault(),!this.dialogElement.classList.contains("hide")&&on(this)&&this.requestClose("escape")},this.handleDialogClick=o=>{o.composedPath().some(i=>i instanceof Element&&i.matches('[data-dialog="close"], [data-dialog-close]'))&&(o.stopPropagation(),this.requestClose("close-button"))},this.handleDialogPointerDown=async o=>{if(o.target===this.dialogElement&&on(this)){if(!this.disablePointerDismissal){this.requestClose("pointer-dismiss");return}await Co(this.dialogElement,"pulse")}},this.onTriggerClick=o=>{o.preventDefault(),this.open=!0},this.onFooterSlotChange=()=>{this.requestUpdate()}}hasCustomHeaderSlot(){return this.querySelector(':scope > [slot="header"]')!==null}applyYieldPosition(t){const o=this.dialogElement;o.style.position="fixed",o.style.top=`${t.top}px`,o.style.left=`${t.left}px`,o.style.width=`${t.width}px`,o.style.height=`${t.height}px`,o.style.margin="0",o.style.maxHeight="none",o.style.zIndex="99",o.toggleAttribute("data-yielding",!0)}clearYieldPosition(){const t=this.dialogElement;t&&(t.style.position="",t.style.top="",t.style.left="",t.style.width="",t.style.height="",t.style.margin="",t.style.maxHeight="",t.style.zIndex="",t.removeAttribute("data-yielding"),this.yieldBox=null)}yieldToHostModal(){if(this.yieldingToHostModal||!this.open||!this.dialogElement?.open)return;const t=this.dialogElement.getBoundingClientRect();this.yieldBox={top:t.top,left:t.left,width:t.width,height:t.height},this.yieldingToHostModal=!0;try{this.dialogElement.close(),this.dialogElement.show(),this.applyYieldPosition(this.yieldBox)}catch{this.yieldingToHostModal=!1,this.clearYieldPosition()}}restoreFromHostModal(){if(this.yieldingToHostModal&&(this.yieldingToHostModal=!1,this.clearYieldPosition(),!(!this.open||!this.dialogElement)))try{this.dialogElement.open&&this.dialogElement.close(),this.dialogElement.showModal()}catch{}}firstUpdated(){this.open&&this.show()}disconnectedCallback(){this.disableScrollLock||vs(this),this.removeOpenListeners(),super.disconnectedCallback()}updated(t){super.updated(t),!(!t.has("open")||!this.hasUpdated)&&this.handleOpenChange()}handleOpenChange(){this.open&&!this.dialogElement.open?this.show():!this.open&&this.dialogElement.open&&(this.open=!0,this.requestClose("api"))}async show(t="api"){if(!(this.showing||this.dialogElement?.open)){this.showing=!0;try{const o=new kr;if(!this.dispatchEvent(o)){this.open=!1;return}this.addOpenListeners(),this.previouslyFocused=document.activeElement,this.open=!0,this.dialogElement.showModal(),this.disableScrollLock||W1(this),requestAnimationFrame(()=>{const i=this.querySelector("[autofocus]");if(i){(i.shadowRoot?.querySelector("input, textarea, select, button")??i).focus({preventScroll:!0});return}this.dialogElement.focus({preventScroll:!0})}),await Co(this.dialogElement,"show"),this.dispatchEvent(new CustomEvent("pk-open-change",{detail:{open:!0},bubbles:!0,composed:!0})),this.dispatchEvent(new wr)}finally{this.showing=!1}}}async hide(t="unknown"){await this.requestClose(t)}closeDialog(){this.requestClose("close-button")}async requestClose(t="unknown"){const o=new xr(typeof t=="string"?t:"close-button");if(!this.dispatchEvent(o)){this.open=!0,await Co(this.dialogElement,"pulse");return}this.removeOpenListeners(),await Co(this.dialogElement,"hide"),this.open=!1,this.dialogElement.close(),this.disableScrollLock||vs(this);const i=this.previouslyFocused;this.previouslyFocused=null,i?.isConnected&&window.setTimeout(()=>{i.focus({preventScroll:!0})},0),this.dispatchEvent(new _r),this.dispatchEvent(new CustomEvent("pk-open-change",{detail:{open:!1},bubbles:!0,composed:!0}))}forceOverlayReset(){if(this.open=!1,this.yieldingToHostModal=!1,this.clearYieldPosition(),this.removeOpenListeners(),this.dialogElement?.open)try{this.dialogElement.close()}catch{}this.dialogElement?.classList.remove("hide","show","pulse"),this.disableScrollLock||vs(this)}addOpenListeners(){document.addEventListener("keydown",this.handleDocumentKeyDown),Id(this),this.hostModalObserver?.disconnect(),this.hostModalObserver=X1(this.onHostModalPresenceChange),this.onHostModalPresenceChange(Ns())}removeOpenListeners(){document.removeEventListener("keydown",this.handleDocumentKeyDown),hi(this),this.hostModalObserver?.disconnect(),this.hostModalObserver=null,this.yieldingToHostModal=!1,this.clearYieldPosition()}syncHasTriggerAttribute(){this.toggleAttribute("data-has-trigger",!!this.triggerElement)}onTriggerSlotChange(t){const[o]=t.target.assignedElements({flatten:!0});this.triggerElement&&this.triggerElement.removeEventListener("click",this.onTriggerClick),this.triggerElement=o??null,this.syncHasTriggerAttribute(),this.triggerElement&&this.triggerElement.addEventListener("click",this.onTriggerClick)}render(){const t=!this.hasCustomHeaderSlot()&&!this.withoutHeader&&!!this.label,o=t&&!this.withoutBodyPadding,i=this.querySelector(':scope > [slot="footer"]')!==null;return W`
            <slot name="trigger" @slotchange=${this.onTriggerSlotChange}></slot>
            <dialog
                part="panel"
                class=${ve({dialog:!0,open:this.open,"dialog--wide":this.size==="wide"})}
                tabindex="-1"
                @cancel=${this.handleDialogCancel}
                @click=${this.handleDialogClick}
                @pointerdown=${this.handleDialogPointerDown}
            >
                <slot name="header">
                    ${t?W`
                            <header part="header" class="header">
                                <h2 part="title" class="title">
                                    <slot name="label">${this.label}</slot>
                                </h2>
                                ${this.description?W`
                                        <p part="description" class="description">
                                            <slot name="description">${this.description}</slot>
                                        </p>
                                    `:W`<slot name="description" hidden></slot>`}
                                <button type="button" class="close" data-dialog="close" aria-label="Close">
                                    <span class="close-icon" aria-hidden="true">${yn(Z1)}</span>
                                </button>
                            </header>
                        `:j}
                </slot>
                <div
                    part="body"
                    class=${ve({body:!0,"body--padded":o})}
                >
                    <slot></slot>
                </div>
                ${i?W`
                        <footer part="footer" class="footer">
                            <slot name="footer" @slotchange=${this.onFooterSlotChange}></slot>
                        </footer>
                    `:W`<slot name="footer" @slotchange=${this.onFooterSlotChange} hidden></slot>`}
            </dialog>
        `}},Ko.styles=J1,Ko);k([S({type:Boolean,reflect:!0})],ee.prototype,"open",void 0);k([S()],ee.prototype,"label",void 0);k([S()],ee.prototype,"description",void 0);k([S({attribute:"disable-pointer-dismissal",type:Boolean,reflect:!0})],ee.prototype,"disablePointerDismissal",void 0);k([S({attribute:"without-header",type:Boolean,reflect:!0})],ee.prototype,"withoutHeader",void 0);k([S({attribute:"without-body-padding",type:Boolean,reflect:!0})],ee.prototype,"withoutBodyPadding",void 0);k([S({attribute:"disable-scroll-lock",type:Boolean,reflect:!0})],ee.prototype,"disableScrollLock",void 0);k([S({reflect:!0})],ee.prototype,"size",void 0);k([Kt("dialog")],ee.prototype,"dialogElement",void 0);k([Jt()],ee.prototype,"triggerElement",void 0);ee=k([Zt("pk-dialog")],ee);var me={default:ot`
        --pk-dropdown-item-padding-block: 8px;
        --pk-dropdown-item-padding-inline: 12px;
        --pk-dropdown-item-gap: 0.625rem;
        --pk-dropdown-item-font-size: var(--pk-font-size-base);
        --pk-dropdown-item-line-height: 1.5;
        --pk-dropdown-item-icon-size: 12px;
        --pk-dropdown-label-padding-inline: 12px;
        --pk-dropdown-label-font-size: 13px;
        --pk-dropdown-details-font-size: var(--pk-font-size-sm);
    `,xs:ot`
        --pk-dropdown-item-padding-block: 3px;
        --pk-dropdown-item-padding-inline: 8px;
        --pk-dropdown-item-gap: 0.375rem;
        --pk-dropdown-item-font-size: 12px;
        --pk-dropdown-item-line-height: 1.5;
        --pk-dropdown-item-icon-size: 10px;
        --pk-dropdown-label-padding-inline: 8px;
        --pk-dropdown-label-font-size: 11px;
        --pk-dropdown-details-font-size: 11px;
    `,sm:ot`
        --pk-dropdown-item-padding-block: 4px;
        --pk-dropdown-item-padding-inline: 10px;
        --pk-dropdown-item-gap: 0.4375rem;
        --pk-dropdown-item-font-size: 13px;
        --pk-dropdown-item-line-height: 1.5;
        --pk-dropdown-item-icon-size: 12px;
        --pk-dropdown-label-padding-inline: 10px;
        --pk-dropdown-label-font-size: 11px;
        --pk-dropdown-details-font-size: 12px;
    `,lg:ot`
        --pk-dropdown-item-padding-block: 10px;
        --pk-dropdown-item-padding-inline: 14px;
        --pk-dropdown-item-gap: 0.75rem;
        --pk-dropdown-item-font-size: 16px;
        --pk-dropdown-item-line-height: 1.5;
        --pk-dropdown-item-icon-size: 14px;
        --pk-dropdown-label-padding-inline: 14px;
        --pk-dropdown-label-font-size: 14px;
        --pk-dropdown-details-font-size: var(--pk-font-size-sm);
    `,xl:ot`
        --pk-dropdown-item-padding-block: 12px;
        --pk-dropdown-item-padding-inline: 16px;
        --pk-dropdown-item-gap: 0.75rem;
        --pk-dropdown-item-font-size: 18px;
        --pk-dropdown-item-line-height: 1.5;
        --pk-dropdown-item-icon-size: 16px;
        --pk-dropdown-label-padding-inline: 16px;
        --pk-dropdown-label-font-size: 15px;
        --pk-dropdown-details-font-size: var(--pk-font-size-base);
    `},Xd=ot`
    @layer pk-component {
        :host {
            ${me.default}
        }

        :host([size='xs']) {
            ${me.xs}
        }

        :host([size='sm']) {
            ${me.sm}
        }

        :host([size='lg']) {
            ${me.lg}
        }

        :host([size='xl']) {
            ${me.xl}
        }
    }
`,Mr=ot`
    @layer pk-component {
        .panel[data-size='default'],
        .submenu-panel[data-size='default'] {
            ${me.default}
        }

        .panel[data-size='xs'],
        .submenu-panel[data-size='xs'] {
            ${me.xs}
        }

        .panel[data-size='sm'],
        .submenu-panel[data-size='sm'] {
            ${me.sm}
        }

        .panel[data-size='lg'],
        .submenu-panel[data-size='lg'] {
            ${me.lg}
        }

        .panel[data-size='xl'],
        .submenu-panel[data-size='xl'] {
            ${me.xl}
        }
    }
`;ot`
    ${Xd}
    ${Mr}
`;var Q1=[x1,Mr,ot`
    @layer pk-component {
        :host {
            display: block;
            position: relative;
            /*
             * Slotted label text inherits from this host (light DOM), not from
             * shadow .item — pin size-token metrics so Craft CP / Tailwind /
             * bare hosts all get the same item rhythm.
             */
            font-size: var(--pk-dropdown-item-font-size, var(--pk-font-size-base));
            line-height: var(--pk-dropdown-item-line-height, 1.5);
            color: var(--text-color, var(--pk-color-gray-700));
        }

        .item {
            display: flex;
            align-items: center;
            gap: var(--pk-dropdown-item-gap, 0.625rem);
            width: 100%;
            margin: 0;
            padding: var(--pk-dropdown-item-padding-block, 8px) var(--pk-dropdown-item-padding-inline, 12px);
            border: 0;
            background: transparent;
            color: inherit;
            font: inherit;
            font-size: var(--pk-dropdown-item-font-size, var(--pk-font-size-base));
            /* Explicit — do not let font:inherit re-leak page line-height. */
            line-height: var(--pk-dropdown-item-line-height, 1.5);
            font-weight: normal;
            text-align: left;
            white-space: nowrap;
            cursor: default;
            user-select: none;
            outline: none;
            box-sizing: border-box;
        }

        .item:hover:not([disabled]):not([aria-disabled='true']),
        :host([data-highlighted]) .item,
        :host([submenu-open]) .item {
            background: var(--pk-color-slate-100);
        }

        .item:focus-visible {
            background: var(--pk-color-slate-100);
        }

        .item[aria-disabled='true'] {
            pointer-events: none;
            opacity: 0.5;
        }

        .label {
            flex: 1 1 auto;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .prefix {
            display: inline-flex;
            flex: 0 0 auto;
            align-items: center;
            justify-content: center;
            width: var(--pk-dropdown-item-icon-size, 12px);
            height: var(--pk-dropdown-item-icon-size, 12px);
            line-height: 0;
        }

        .prefix--empty {
            display: none;
        }

        .prefix ::slotted(*) {
            display: inline-flex;
            flex: 0 0 auto;
            align-items: center;
            justify-content: center;
            width: var(--pk-dropdown-item-icon-size, 12px);
            height: var(--pk-dropdown-item-icon-size, 12px);
            /* Kill pk-icon text-baseline nudge inside the padded flex row. */
            vertical-align: 0;
        }

        .prefix ::slotted(svg),
        .prefix ::slotted(*) svg,
        .prefix ::slotted(.pk-dropdown-item__prefix-icon) {
            display: block;
            width: var(--pk-dropdown-item-icon-size, 12px) !important;
            height: var(--pk-dropdown-item-icon-size, 12px) !important;
            max-width: var(--pk-dropdown-item-icon-size, 12px);
            max-height: var(--pk-dropdown-item-icon-size, 12px);
            flex-shrink: 0;
            pointer-events: none;
        }

        .details {
            margin-left: auto;
            color: var(--pk-color-gray-500);
            font-size: var(--pk-dropdown-details-font-size, var(--pk-font-size-sm));
            letter-spacing: 0.04em;
        }

        .details:empty {
            display: none;
        }

        .check {
            display: inline-flex;
            flex: 0 0 auto;
            align-items: center;
            justify-content: center;
            width: 12px;
            height: 12px;
            color: var(--pk-color-gray-700);
        }

        .check svg {
            display: block;
            width: 12px;
            height: 12px;
            flex-shrink: 0;
            pointer-events: none;
        }

        .submenu-icon {
            display: inline-flex;
            flex: 0 0 auto;
            align-items: center;
            justify-content: center;
            width: 1rem;
            color: var(--pk-color-gray-700);
        }

        .submenu-icon svg {
            display: block;
            width: 1em;
            height: 1em;
            flex-shrink: 0;
            pointer-events: none;
        }

        .check {
            opacity: 0;
        }

        :host([checked]) .check {
            opacity: 1;
        }

        :host([type='checkbox']) .check,
        :host([type='radio']) .check {
            margin-left: auto;
        }

        :host([type='checkbox'][checked]) .check,
        :host([type='radio'][checked]) .check {
            opacity: 1;
        }

        .submenu-icon:empty {
            display: none;
        }

        :host([destructive]) .item {
            color: var(--pk-color-error);
        }

        :host([destructive]) .item:hover:not([disabled]):not([aria-disabled='true']),
        :host([destructive]) .item:focus-visible {
            color: var(--pk-color-error);
        }

        .submenu-panel {
            width: max-content;
            min-width: 8rem;
            overflow: hidden;
            padding: 4px 0;
            border-radius: var(--pk-radius-md);
            background: var(--pk-color-white);
            box-shadow: var(--pk-shadow-popup);
            /* Match root menu panel — Craft body text, not gray-900. */
            color: var(--text-color, var(--pk-color-gray-700));
        }

        .submenu-panel ::slotted(pk-dropdown-item),
        .submenu-panel ::slotted(pk-dropdown-separator),
        .submenu-panel ::slotted(pk-dropdown-label) {
            display: block;
        }

        .submenu-panel[hidden] {
            display: none !important;
        }
    }
`],js,t0=Ui(hr),e0=Ui(gr),ho,St=(ho=class extends xe{constructor(...t){super(...t),this.value="",this.type="normal",this.radioGroup="",this.disabled=!1,this.destructive=!1,this.checked=!1,this.submenuOpen=!1,this.active=!1,this.submenuAnimated=!1,this.hasSlotController=new Hi(this,"submenu","details","start","prefix"),this.handleMouseEnter=()=>{!this.hasSubmenu()||this.disabled||(this.notifyParentOfOpening(),this.submenuOpen=!0)},this.handleHostClick=o=>{this.disabled&&(o.preventDefault(),o.stopImmediatePropagation())}}connectedCallback(){super.connectedCallback(),this.syncRole(),this.syncSubmenuAria(),this.addEventListener("click",this.handleHostClick),this.addEventListener("mouseenter",this.handleMouseEnter)}disconnectedCallback(){this.removeEventListener("click",this.handleHostClick),this.removeEventListener("mouseenter",this.handleMouseEnter),this.closeSubmenu(),super.disconnectedCallback()}updated(t){(t.has("type")||t.has("checked"))&&this.syncRole(),(t.has("submenuOpen")||t.size===0)&&this.syncSubmenuAria(),t.has("submenuOpen")&&(this.submenuOpen?this.ensureSubmenuSurface():this.submenuAnimated=!1)}hasSubmenu(){return this.hasSlotController.test("submenu")}syncSubmenuAria(){const t=this.hasSubmenu();t?this.setAttribute("aria-haspopup","menu"):this.removeAttribute("aria-haspopup"),this.setAttribute("aria-expanded",t&&this.submenuOpen?"true":"false")}focusControl(){this.shadowRoot?.querySelector(".item")?.focus({preventScroll:!0})}focus(t){const o=this.shadowRoot?.querySelector(".item");if(o){o.focus(t);return}super.focus(t)}get submenuElement(){return this.submenuPanelElement??null}closeSubmenu(){this.submenuAnimated=!1,this.submenuOpen=!1}openSubmenu(){!this.hasSubmenu()||this.disabled||!this.isConnected||(this.notifyParentOfOpening(),this.submenuOpen=!0)}notifyParentOfOpening(){this.dispatchEvent(new CustomEvent("pk-submenu-open",{bubbles:!0,composed:!0,detail:{item:this}}));const t=this.parentElement;if(t)for(const o of t.children)o!==this&&o instanceof js&&o.getAttribute("slot")===this.getAttribute("slot")&&o.submenuOpen&&(o.submenuOpen=!1)}ensureSubmenuSurface(){!this.hasSubmenu()||this.disabled||(this.submenuAnimated=!0,this.updateComplete.then(()=>{!this.submenuOpen||!this.submenuPanelElement||(this.submenuPanelElement.hidden=!1,wn(this.submenuPanelElement,"right-start"),Er(this.submenuPopupElement,"right-start").then(t=>{wn(this.submenuPanelElement,t)}))}))}syncRole(){if(this.type==="checkbox"){this.setAttribute("role","menuitemcheckbox"),this.setAttribute("aria-checked",this.checked?"true":"false");return}if(this.type==="radio"){this.setAttribute("role","menuitemradio"),this.setAttribute("aria-checked",this.checked?"true":"false");return}this.setAttribute("role","menuitem"),this.removeAttribute("aria-checked")}handleClick(t){if(this.disabled){t.preventDefault(),t.stopImmediatePropagation();return}this.hasSubmenu()&&(t.preventDefault(),this.openSubmenu())}render(){const t=this.hasSubmenu(),o=this.type==="checkbox"||this.type==="radio",i=this.hasSlotController.test("start")||this.hasSlotController.test("prefix");return W`
            <button
                part="item"
                type="button"
                class="item"
                ?disabled=${this.disabled}
                aria-disabled=${this.disabled?"true":j}
                @click=${this.handleClick}
            >
                <span
                    part="prefix"
                    class=${i?"prefix":"prefix prefix--empty"}
                >
                    <slot name="start"></slot>
                    <slot name="prefix"></slot>
                </span>
                <span class="label"><slot></slot></span>
                <span class="details"><slot name="details"></slot></span>
                ${o?W`<span class="check" aria-hidden="true">${yn(t0)}</span>`:j}
                ${t?W`<span class="submenu-icon" aria-hidden="true">${yn(e0)}</span>`:j}
            </button>
            ${t?W`
                <pk-popup
                    .active=${this.submenuOpen}
                    .anchor=${this}
                    placement="right-start"
                    .distance=${0}
                    .skidding=${-4}
                    flip
                    shift
                    hover-bridge
                    style="--pk-popup-z-index: 1001"
                >
                    <div
                        part="submenu"
                        class="submenu-panel pk-popup-content"
                        role="menu"
                        data-size=${o0(this)}
                        ?hidden=${!this.submenuOpen}
                        data-open=${this.submenuAnimated?"":j}
                        aria-orientation="vertical"
                    >
                        <slot name="submenu"></slot>
                    </div>
                </pk-popup>
            `:j}
        `}},js=ho,ho.styles=Q1,ho);k([S()],St.prototype,"value",void 0);k([S({reflect:!0})],St.prototype,"type",void 0);k([S({attribute:"radio-group"})],St.prototype,"radioGroup",void 0);k([S({type:Boolean,reflect:!0})],St.prototype,"disabled",void 0);k([S({type:Boolean,reflect:!0})],St.prototype,"destructive",void 0);k([S({type:Boolean,reflect:!0})],St.prototype,"checked",void 0);k([S({attribute:"submenu-open",type:Boolean,reflect:!0})],St.prototype,"submenuOpen",void 0);k([S({type:Boolean})],St.prototype,"active",void 0);k([Jt()],St.prototype,"submenuAnimated",void 0);k([Kt(".submenu-panel")],St.prototype,"submenuPanelElement",void 0);k([Kt("pk-popup")],St.prototype,"submenuPopupElement",void 0);St=js=k([Zt("pk-dropdown-item")],St);function o0(e){const t=e.parentElement?.getAttribute("data-size");if(t==="xs"||t==="sm"||t==="default"||t==="lg"||t==="xl")return t;const o=e.closest("pk-dropdown-menu")?.getAttribute("size");return o==="xs"||o==="sm"||o==="lg"||o==="xl"?o:"default"}var i0=[pr(),Xd,Mr,ot`
        @layer pk-component {
            /* Standalone: keep a real box so the trigger is not a flex-stretched
               child of the page (display:contents flattened pk-button to full card width).
               Button groups override below — same as legacy + React MenuButton inline-flex wrap. */
            :host {
                display: inline-block;
                position: relative;
                width: fit-content;
                max-width: 100%;
                align-self: flex-start;
                vertical-align: middle;
            }

            :host([data-pk-group-orientation]) {
                display: inline-flex;
                vertical-align: middle;
                flex: 0 0 auto;
                width: auto;
                max-width: none;
                align-self: auto;
            }

            /* Belt-and-suspenders if a parent still flattens layout onto the trigger. */
            ::slotted([slot='trigger']) {
                width: fit-content;
                max-width: 100%;
                flex: 0 0 auto;
                align-self: flex-start;
            }

            :host([data-pk-group-orientation]) ::slotted([slot='trigger']) {
                --pk-bg-start-start-radius: inherit;
                --pk-bg-start-end-radius: inherit;
                --pk-bg-end-start-radius: inherit;
                --pk-bg-end-end-radius: inherit;
                align-self: auto;
                max-width: none;
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-join]) {
                margin-inline-start: var(--pk-bg-horizontal-indent, 0);
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-join]) {
                margin-block-start: var(--pk-bg-vertical-indent, 0);
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:has([slot='trigger'][variant='outline'], [slot='trigger'][variant='dashed'])) {
                margin-inline-start: var(--pk-bg-horizontal-indent-outlined, 0);
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-join]:has([slot='trigger'][variant='outline'], [slot='trigger'][variant='dashed'])) {
                margin-block-start: var(--pk-bg-vertical-indent-outlined, 0);
            }

            /* Menu panel — hug content; do not stretch to trigger/anchor width. */
            .panel {
                display: flex;
                flex-direction: column;
                width: max-content;
                min-width: 8rem;
                margin: 0;
                overflow: auto;
                padding: 4px 0;
                border: 0;
                border-radius: var(--pk-radius-md);
                background: var(--pk-color-white);
                box-shadow: var(--pk-shadow-popup);
                /* v1 DropdownMenuItem had no face color — inherited Craft body
                 * (--text-color ≈ gray-700). Do not force gray-900 (too dark). */
                color: var(--text-color, var(--pk-color-gray-700));
                outline: none;
                text-align: start;
                user-select: none;
                /* Match v1 Base UI: popup writes --pk-transform-origin from the
                 * anchor center on the connecting edge (e.g. top-right for
                 * bottom-end). Keyword edge centers made end-aligned menus
                 * scale from the middle of the panel. */
                transform-origin: var(--pk-transform-origin, top);
            }

            .panel.show {
                animation: pk-dropdown-menu-show 100ms ease;
            }

            .panel.hide {
                animation: pk-dropdown-menu-show 100ms ease reverse;
            }

            .panel[hidden] {
                display: none !important;
            }

            ::slotted(pk-dropdown-item),
            ::slotted(pk-dropdown-separator),
            ::slotted(pk-dropdown-label),
            .panel > pk-dropdown-item,
            .panel > pk-dropdown-separator,
            .panel > pk-dropdown-label {
                display: block;
            }

            ::slotted([data-menu-item]) {
                display: flex;
                align-items: center;
                gap: 0.625rem;
                width: 100%;
                margin: 0;
                padding: 8px 12px;
                border: 0;
                background: transparent;
                color: inherit;
                font: inherit;
                font-size: var(--pk-font-size-base);
                text-align: left;
                white-space: nowrap;
                cursor: default;
                user-select: none;
                outline: none;
                box-sizing: border-box;
            }

            ::slotted([data-menu-item]:hover:not([disabled])) {
                background: var(--pk-color-slate-100);
            }

            ::slotted([data-menu-item]:focus-visible) {
                background: var(--pk-color-slate-100);
            }

            ::slotted([data-menu-item][disabled]) {
                pointer-events: none;
                opacity: 0.5;
            }

            ::slotted(pk-dropdown-item[destructive]),
            ::slotted([data-destructive]) {
                color: var(--pk-color-error);
            }

            ::slotted([data-menu-separator]) {
                display: block;
                height: 1px;
                margin: 4px 0;
                background: var(--pk-color-slate-200);
                border: 0;
                padding: 0;
            }
        }

        /* Outside @layer so constructed stylesheets resolve the name reliably. */
        @keyframes pk-dropdown-menu-show {
            from {
                scale: 0.9;
                opacity: 0;
            }

            to {
                scale: 1;
                opacity: 1;
            }
        }
    `],_o=new Set,Wo,oe=(Wo=class extends xe{constructor(...t){super(...t),this.open=!1,this.size="default",this.placement="bottom-start",this.sideOffset=4,this.distance=4,this.skidding=0,this.for="",this.userTypedQuery="",this.userTypedTimeout=0,this.openSubmenuStack=[],this.openedByKeyboard=!1,this.triggerElement=null,this.handleMenuClick=o=>{const i=this.resolveMenuItem(o);if(!(!i||i.disabled)){if(i.hasSubmenu()){i.submenuOpen||(this.closeSiblingSubmenus(i),this.addToSubmenuStack(i),i.openSubmenu()),o.stopPropagation();return}this.makeSelection(i)}},this.handleSubmenuOpening=o=>{const i=o.detail?.item;i instanceof St&&(this.closeSiblingSubmenus(i),this.addToSubmenuStack(i))},this.handleGlobalMouseMove=o=>{const i=this.getCurrentSubmenuItem();if(!i?.submenuOpen||!i.submenuElement)return;const n=i.submenuElement,s=o.composedPath(),r=i.matches(":hover"),a=!!n.matches(":hover"),l=r||s.some(u=>u===i),d=a||s.some(u=>u instanceof HTMLElement&&u.closest('[part="submenu"]')===n);!l&&!d&&window.setTimeout(()=>{!r&&!a&&(i.submenuOpen=!1)},100)},this.handleTriggerClick=o=>{const i=this.getTrigger();!i||!o.composedPath().includes(i)||(o.preventDefault(),o.stopPropagation(),this.openedByKeyboard=!1,this.open=!this.open)},this.handleExternalTriggerClick=o=>{o.preventDefault(),o.stopPropagation(),this.openedByKeyboard=!1,this.open=!this.open},this.handleTriggerKeyDown=o=>{const i=this.getTrigger();!i||!o.composedPath().includes(i)||this.open||(o.key==="ArrowDown"||o.key==="ArrowUp")&&(o.preventDefault(),o.stopPropagation(),this.openedByKeyboard=!0,this.open=!0)},this.handleDocumentKeyDown=o=>{const i=this.isRtl();if(o.key==="Escape"&&this.open&&on(this)){o.preventDefault(),o.stopPropagation(),this.open=!1,this.getTrigger()?.focus({preventScroll:!0});return}if(!this.open)return;const n=[...Ld()].find(c=>c.localName==="pk-dropdown-item"),s=n?.localName==="pk-dropdown-item",r=this.getCurrentSubmenuItem(),a=!!r;let l,d,u;a&&r?(l=this.getSubmenuItems(r),d=l.find(c=>c.active||c===n),u=d?l.indexOf(d):-1):(l=this.getItems(),d=l.find(c=>c.active||c===n),u=d?l.indexOf(d):-1);let p;if(o.key==="ArrowUp"&&(o.preventDefault(),o.stopPropagation(),p=u>0?l[u-1]:l[l.length-1]),o.key==="ArrowDown"&&(o.preventDefault(),o.stopPropagation(),p=u!==-1&&u<l.length-1?l[u+1]:l[0]),o.key===(i?"ArrowLeft":"ArrowRight")&&s&&d&&d.hasSubmenu()){o.preventDefault(),o.stopPropagation(),this.closeSiblingSubmenus(d),d.openSubmenu(),this.addToSubmenuStack(d),window.setTimeout(()=>{const c=this.getSubmenuItems(d);c.length>0&&this.setActiveItem(c,c[0])},0);return}if(o.key===(i?"ArrowRight":"ArrowLeft")&&a){o.preventDefault(),o.stopPropagation();const c=this.removeFromSubmenuStack();c&&(c.submenuOpen=!1,window.setTimeout(()=>{c.focus({preventScroll:!0}),c.active=!0,(c.slot==="submenu"&&c.parentElement instanceof St?this.getSubmenuItems(c.parentElement):this.getItems()).forEach(v=>{v!==c&&(v.active=!1)})},0));return}if((o.key==="Home"||o.key==="End")&&(o.preventDefault(),o.stopPropagation(),p=o.key==="Home"?l[0]:l[l.length-1]),o.key==="Tab"){this.open=!1;return}if(o.key.length===1&&!(o.metaKey||o.ctrlKey||o.altKey)&&!(o.key===" "&&this.userTypedQuery==="")){window.clearTimeout(this.userTypedTimeout),this.userTypedTimeout=window.setTimeout(()=>{this.userTypedQuery=""},1e3),this.userTypedQuery+=o.key;const c=this.userTypedQuery.trim().toLowerCase();p=l.find(v=>(v.textContent||"").trim().toLowerCase().startsWith(c))}if(p){o.preventDefault(),o.stopPropagation(),this.setActiveItem(l,p);return}(o.key==="Enter"||o.key===" "&&this.userTypedQuery==="")&&s&&d&&(o.preventDefault(),o.stopPropagation(),d.hasSubmenu()?(this.closeSiblingSubmenus(d),d.openSubmenu(),this.addToSubmenuStack(d),window.setTimeout(()=>{const c=this.getSubmenuItems(d);c.length>0&&this.setActiveItem(c,c[0])},0)):this.makeSelection(d))},this.handleDocumentPointerDown=o=>{const i=o.composedPath(),n=this.getTrigger();i.some(s=>s===this||s===n)||(this.open=!1)}}get panelElement(){return this.menuElement??null}get popup(){return this.popupElement??null}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.handleTriggerClick,!0),this.addEventListener("keydown",this.handleTriggerKeyDown)}firstUpdated(){const t=()=>{if(this.for){this.resolveExternalTrigger();return}this.syncSlottedTrigger()};queueMicrotask(t),requestAnimationFrame(t)}disconnectedCallback(){window.clearTimeout(this.userTypedTimeout),this.removeEventListener("click",this.handleTriggerClick,!0),this.removeEventListener("keydown",this.handleTriggerKeyDown),this.unbindTrigger(this.triggerElement),this.triggerElement=null,this.closeAllSubmenus(),this.popupElement&&(this.popupElement.active=!1),this.menuElement?.classList.remove("show","hide"),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("pointerdown",this.handleDocumentPointerDown,!0),document.removeEventListener("mousemove",this.handleGlobalMouseMove),hi(this),_o.delete(this),super.disconnectedCallback()}async updated(t){if(super.updated(t),t.has("for")&&this.resolveExternalTrigger(),t.has("open")&&this.syncTriggerExpanded(),!t.has("open"))return;const o=t.get("open");o!==this.open&&(o===void 0&&this.open===!1||(this.open?await this.showMenu():(this.closeAllSubmenus(),await this.hideMenu("unknown"))))}getItems(t=!1){const o=(this.defaultSlot?.assignedElements({flatten:!0})??[]).filter(i=>i.localName==="pk-dropdown-item");return t?o:o.filter(i=>!i.disabled)}getSubmenuItems(t,o=!1){const i=(t.shadowRoot?.querySelector('slot[name="submenu"]')?.assignedElements({flatten:!0})??[...t.children].filter(n=>n.getAttribute("slot")==="submenu")).filter(n=>n.localName==="pk-dropdown-item");return o?i:i.filter(n=>!n.disabled)}getTrigger(){return this.for?Fo(this,this.for)??this.triggerElement:this.querySelector('[slot="trigger"]')??this.triggerElement}getAnchor(){return this.getTrigger()??""}resolveExternalTrigger(){this.unbindTrigger(this.triggerElement),this.triggerElement=this.for?Fo(this,this.for):null,this.bindTrigger(this.triggerElement),this.requestUpdate()}onTriggerSlotChange(t){if(this.for)return;const[o]=t.target.assignedElements({flatten:!0});this.unbindTrigger(this.triggerElement),this.triggerElement=o??null,this.bindTrigger(this.triggerElement),this.requestUpdate()}syncSlottedTrigger(){const t=this.renderRoot.querySelector('slot[name="trigger"]');t&&this.onTriggerSlotChange({target:t})}bindTrigger(t){t&&(t.setAttribute("aria-haspopup","menu"),this.for&&(t.addEventListener("click",this.handleExternalTriggerClick),t.addEventListener("keydown",this.handleTriggerKeyDown)),this.syncTriggerExpanded())}unbindTrigger(t){t?.removeEventListener("click",this.handleExternalTriggerClick),t?.removeEventListener("keydown",this.handleTriggerKeyDown)}syncTriggerExpanded(){this.getTrigger()?.setAttribute("aria-expanded",this.open?"true":"false")}closeAfterSelect(t="api"){this.open=!1}makeSelection(t){const o=this.getTrigger();if(t.disabled)return;t.type==="checkbox"&&(t.checked=!t.checked),t.type==="radio"&&!t.checked&&(t.checked=!0);const i={value:t.value,type:t.type,checked:t.checked,radioGroup:t.radioGroup};t.dispatchEvent(new CustomEvent("pk-select",{detail:i,bubbles:!1,composed:!1,cancelable:!0}));const n=new CustomEvent("pk-select",{detail:i,bubbles:!0,composed:!0,cancelable:!0});this.dispatchEvent(n),n.defaultPrevented||(this.open=!1,o?.focus({preventScroll:!0}))}resolveMenuItem(t){const o=t.target;if(o instanceof St)return o;if(o instanceof Element){const i=o.closest("pk-dropdown-item");if(i instanceof St)return i}return t.composedPath().find(i=>i instanceof St)??null}whenClosed(){return this.open?new Promise(t=>{this.addEventListener("pk-after-hide",()=>{this.popupElement.stop().then(()=>t())},{once:!0})}):this.popupElement?.active?this.popupElement.stop():Promise.resolve()}forceDismissCleanup(){this.open=!1,this.popupElement.active=!1,this.menuElement?.classList.remove("show","hide"),this.closeAllSubmenus(),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("pointerdown",this.handleDocumentPointerDown,!0),document.removeEventListener("mousemove",this.handleGlobalMouseMove),hi(this),_o.delete(this)}isRtl(){return getComputedStyle(this).direction==="rtl"}addToSubmenuStack(t){const o=this.openSubmenuStack.indexOf(t);o!==-1?this.openSubmenuStack=this.openSubmenuStack.slice(0,o+1):this.openSubmenuStack.push(t)}removeFromSubmenuStack(){return this.openSubmenuStack.pop()}getCurrentSubmenuItem(){return this.openSubmenuStack.length>0?this.openSubmenuStack[this.openSubmenuStack.length-1]:void 0}closeAllSubmenus(){this.getItems(!0).forEach(t=>{t.submenuOpen=!1,t.active=!1}),this.openSubmenuStack=[]}closeSiblingSubmenus(t){const o=t.closest('pk-dropdown-item:not([slot="submenu"])');(o instanceof St?this.getSubmenuItems(o,!0):this.getItems(!0)).forEach(i=>{i!==t&&i.submenuOpen&&(i.submenuOpen=!1)}),this.openSubmenuStack.includes(t)||this.openSubmenuStack.push(t)}setActiveItem(t,o){t.forEach(i=>{i.active=i===o,i===o?i.setAttribute("data-highlighted",""):i.removeAttribute("data-highlighted")}),o.focus({preventScroll:!0}),o.scrollIntoView({block:"nearest"})}async showMenu(){if(!this.popupElement||!this.menuElement)return;this.for&&!this.triggerElement?.isConnected&&this.resolveExternalTrigger();const t=new kr;if(!this.dispatchEvent(t)){this.open=!1;return}if(this.popupElement.active&&(this.popupElement.active=!1,this.menuElement.classList.remove("show","hide"),await this.updateComplete),_o.forEach(i=>{i!==this&&(i.open=!1)}),this.popupElement.active=!0,this.open=!0,_o.add(this),Id(this),document.addEventListener("keydown",this.handleDocumentKeyDown),document.addEventListener("pointerdown",this.handleDocumentPointerDown,!0),document.addEventListener("mousemove",this.handleGlobalMouseMove),await this.updateComplete,await Er(this.popupElement,this.placement,100,{requireEvent:!0}),!this.open){this.popupElement.active=!1,_o.delete(this),hi(this),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("pointerdown",this.handleDocumentPointerDown,!0),document.removeEventListener("mousemove",this.handleGlobalMouseMove);return}this.menuElement.classList.remove("hide"),await Co(this.menuElement,"show");const o=this.getItems();o.length>0&&(this.openedByKeyboard?this.setActiveItem(o,o[0]):(o.forEach(i=>{i.active=!1,i.removeAttribute("data-highlighted")}),this.menuElement.focus({preventScroll:!0}))),this.openedByKeyboard=!1,this.dispatchEvent(new wr),this.dispatchEvent(new CustomEvent("pk-open-change",{detail:{open:!0},bubbles:!0,composed:!0}))}async hideMenu(t){if(!this.popupElement||!this.menuElement)return;const o=new xr(t);if(!this.dispatchEvent(o)){this.open=!0;return}this.open=!1,_o.delete(this),hi(this),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("pointerdown",this.handleDocumentPointerDown,!0),document.removeEventListener("mousemove",this.handleGlobalMouseMove),this.userTypedQuery="",window.clearTimeout(this.userTypedTimeout),this.getItems(!0).forEach(i=>{i.active=!1,i.removeAttribute("data-highlighted")}),this.menuElement.classList.remove("show"),await Co(this.menuElement,"hide"),this.popupElement.active=!1,this.dispatchEvent(new _r),this.dispatchEvent(new CustomEvent("pk-open-change",{detail:{open:!1},bubbles:!0,composed:!0}))}render(){const t=this.hasUpdated?this.popupElement?.active:this.open;return W`
            <pk-popup
                .anchor=${this.for?this.getAnchor():""}
                placement=${this.placement}
                .distance=${this.distance||this.sideOffset}
                .skidding=${this.skidding}
                ?active=${t}
                flip
                shift
                .shiftPadding=${10}
                auto-size="vertical"
                .autoSizePadding=${10}
            >
                <slot
                    name="trigger"
                    slot="anchor"
                    @slotchange=${this.onTriggerSlotChange}
                ></slot>

                <div
                    id="menu"
                    part="panel"
                    class="panel"
                    role="menu"
                    tabindex="-1"
                    aria-orientation="vertical"
                    data-size=${this.size}
                    @click=${this.handleMenuClick}
                    @pk-submenu-open=${this.handleSubmenuOpening}
                >
                    <slot></slot>
                </div>
            </pk-popup>
        `}},Wo.styles=i0,Wo);k([S({type:Boolean,reflect:!0})],oe.prototype,"open",void 0);k([S({reflect:!0})],oe.prototype,"size",void 0);k([S({reflect:!0})],oe.prototype,"placement",void 0);k([S({attribute:"side-offset",type:Number})],oe.prototype,"sideOffset",void 0);k([S({type:Number})],oe.prototype,"distance",void 0);k([S({type:Number})],oe.prototype,"skidding",void 0);k([S({reflect:!0})],oe.prototype,"for",void 0);k([Kt("slot:not([name])")],oe.prototype,"defaultSlot",void 0);k([Kt("#menu")],oe.prototype,"menuElement",void 0);k([Kt("pk-popup")],oe.prototype,"popupElement",void 0);oe=k([Zt("pk-dropdown-menu")],oe);var Go,Da=(Go=class extends xe{connectedCallback(){super.connectedCallback(),this.setAttribute("role","separator")}render(){return W`<hr part="base" />`}},Go.styles=ot`
        @layer pk-component {
            :host {
                display: block;
            }

            hr {
                display: block;
                height: 1px;
                margin: 4px 0;
                border: 0;
                padding: 0;
                background: var(--pk-color-slate-200);
            }
        }
    `,Go);Da=k([Zt("pk-dropdown-separator")],Da);var n0=ji({name:"PkDialog",tagName:"pk-dialog"}),s0=ot`
    @layer pk-component {
        :host {
            display: block;
            /*
             * Slotted label copy inherits through the flat tree from this host
             * when page metrics would otherwise leak via font:inherit chains.
             */
            font-size: var(--pk-dropdown-label-font-size, 13px);
            line-height: 1.3;
            color: var(--pk-color-slate-700, rgba(96, 125, 159, 0.7));
        }

        /* Match v1 DropdownMenuLabel — text-slate-700, regular weight (not medium). */
        .label {
            margin: 0;
            padding-block-start: 6px;
            padding-block-end: 4px;
            padding-inline: var(--pk-dropdown-label-padding-inline, 12px);
            color: inherit;
            font: inherit;
            font-weight: 400;
            user-select: none;
            pointer-events: none;
        }
    }
`,Yo,Fa=(Yo=class extends xe{connectedCallback(){super.connectedCallback(),this.setAttribute("role","presentation")}render(){return W`
            <div part="label" class="label">
                <slot></slot>
            </div>
        `}},Yo.styles=s0,Yo);Fa=k([Zt("pk-dropdown-label")],Fa);var Xn=Sh({DropdownMenu:"pk-dropdown-menu",DropdownItem:"pk-dropdown-item",DropdownLabel:"pk-dropdown-label",DropdownSeparator:"pk-dropdown-separator"}),r0=Xn.DropdownMenu,a0=Xn.DropdownItem;Xn.DropdownLabel;Xn.DropdownSeparator;var Ht=Fe({name:"PkCheckbox",inheritAttrs:!1,props:{checked:{type:Boolean,default:!1},indeterminate:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},invalid:{type:Boolean,default:!1},required:{type:Boolean,default:!1},name:{type:String,default:void 0},value:{type:String,default:"on"},dataState:{type:String,default:void 0}},emits:{"update:checked":e=>typeof e=="boolean"},setup(e,{attrs:t,slots:o,emit:i}){const n=s=>{const r=t.onPkChange;r?.(s),i("update:checked",Yd(s))};return()=>fo("pk-checkbox",{...t,checked:e.checked,indeterminate:e.indeterminate||void 0,disabled:e.disabled||void 0,invalid:e.invalid||void 0,required:e.required||void 0,...e.name?{name:e.name}:{},checkboxValue:e.value,...e.dataState?{"data-state":e.dataState}:{},onPkChange:n},Fn(o))}}),Na=Fe({name:"PkButton",inheritAttrs:!1,props:{variant:{type:String,default:"default"},size:{type:String,default:"default"},loading:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},type:{type:String,default:"button"},spinnerVariant:{type:String,default:void 0},spinnerTone:{type:String,default:void 0},dataState:{type:String,default:void 0},withCaret:{type:Boolean,default:!1},groupTrigger:{type:Boolean,default:!1}},setup(e,{attrs:t,slots:o}){return()=>fo("pk-button",{...t,variant:e.variant,size:e.size,loading:e.loading||void 0,disabled:e.disabled||void 0,type:e.type,...e.spinnerVariant?{"spinner-variant":e.spinnerVariant}:{},...e.spinnerTone?{"spinner-tone":e.spinnerTone}:{},...e.dataState?{"data-state":e.dataState}:{},...e.withCaret?{"with-caret":""}:{},...e.groupTrigger?{"group-trigger":""}:{}},Fn(o))}}),l0={"pk-spinner":"components/spinner/spinner.js","pk-icon":"components/icon/icon.js","pk-button":"components/button/button.js","pk-checkbox":"components/checkbox/checkbox.js","pk-checkbox-select":"components/checkbox-select/checkbox-select.js","pk-color-input":"components/color-input/color-input.js","pk-code-editor":"components/code-editor/code-editor.js","pk-input":"components/input/input.js","pk-input-group":"components/input-group/input-group.js","pk-input-group-addon":"components/input-group/input-group-addon.js","pk-input-group-button":"components/input-group/input-group-button.js","pk-input-group-input":"components/input-group/input-group-input.js","pk-input-group-text":"components/input-group/input-group-text.js","pk-input-group-textarea":"components/input-group/input-group-textarea.js","pk-textarea":"components/textarea/textarea.js","pk-tiptap-editor":"components/tiptap/tiptap-editor.js","pk-tiptap-input":"components/tiptap/tiptap-input.js","pk-tiptap-content":"components/tiptap/tiptap-content.js","pk-field":"components/field/field.js","pk-separator":"components/separator/separator.js","pk-status":"components/status/status.js","pk-toggle":"components/toggle/toggle.js","pk-toggle-group":"components/toggle-group/toggle-group.js","pk-lightswitch":"components/lightswitch/lightswitch.js","pk-button-group":"components/button-group/button-group.js","pk-button-group-separator":"components/button-group/button-group-separator.js","pk-button-group-text":"components/button-group/button-group-text.js","pk-dialog":"components/dialog/dialog.js","pk-popup":"components/popup/popup.js","pk-dropdown-label":"components/dropdown-menu/dropdown-label.js","pk-dropdown-item":"components/dropdown-menu/dropdown-item.js","pk-dropdown-separator":"components/dropdown-menu/dropdown-separator.js","pk-dropdown-menu":"components/dropdown-menu/dropdown-menu.js","pk-popover":"components/popover/popover.js","pk-tooltip":"components/tooltip/tooltip.js","pk-radio":"components/radio-group/radio.js","pk-radio-group":"components/radio-group/radio-group.js","pk-tab":"components/tabs/tab.js","pk-tab-heading":"components/tabs/tab-heading.js","pk-tab-panel":"components/tabs/tab-panel.js","pk-tabs":"components/tabs/tabs.js","pk-scroll-area":"components/scroll-area/scroll-area.js","pk-option":"components/select/option.js","pk-option-group":"components/select/option-group.js","pk-select":"components/select/select.js","pk-calendar":"components/calendar/calendar.js","pk-date-picker":"components/date-picker/date-picker.js","pk-combobox":"components/combobox/combobox.js","pk-time-picker":"components/time-picker/time-picker.js","pk-copy-button":"components/copy-button/copy-button.js","pk-connect":"components/connect/connect.js","pk-connect-oauth":"components/connect/connect-oauth.js","pk-editable-table":"components/editable-table/editable-table.js"},c0={"components/spinner/spinner":"src/components/spinner/pk-spinner.ts","components/icon/icon":"src/components/icon/pk-icon-loader.ts","components/button/button":"src/components/button/pk-button.ts","components/checkbox/checkbox":"src/components/checkbox/pk-checkbox.ts","components/checkbox-select/checkbox-select":"src/components/checkbox-select/pk-checkbox-select.ts","components/color-input/color-input":"src/components/color-input/pk-color-input.ts","components/code-editor/code-editor":"src/components/code-editor/pk-code-editor.ts","components/input/input":"src/components/input/pk-input.ts","components/input-group/input-group":"src/components/input-group/pk-input-group.ts","components/input-group/input-group-addon":"src/components/input-group/pk-input-group-addon.ts","components/input-group/input-group-button":"src/components/input-group/pk-input-group-button.ts","components/input-group/input-group-input":"src/components/input-group/pk-input-group-input.ts","components/input-group/input-group-text":"src/components/input-group/pk-input-group-text.ts","components/input-group/input-group-textarea":"src/components/input-group/pk-input-group-textarea.ts","components/textarea/textarea":"src/components/textarea/pk-textarea.ts","components/tiptap/tiptap-editor":"src/components/tiptap/pk-tiptap-editor.ts","components/tiptap/tiptap-input":"src/components/tiptap/pk-tiptap-input.ts","components/tiptap/tiptap-content":"src/components/tiptap/pk-tiptap-content.ts","components/field/field":"src/components/field/pk-field.ts","components/separator/separator":"src/components/separator/pk-separator.ts","components/status/status":"src/components/status/pk-status.ts","components/toggle/toggle":"src/components/toggle/pk-toggle.ts","components/toggle-group/toggle-group":"src/components/toggle-group/pk-toggle-group.ts","components/lightswitch/lightswitch":"src/components/lightswitch/pk-lightswitch.ts","components/button-group/button-group":"src/components/button-group/pk-button-group.ts","components/button-group/button-group-separator":"src/components/button-group/pk-button-group-separator.ts","components/button-group/button-group-text":"src/components/button-group/pk-button-group-text.ts","components/dialog/dialog":"src/components/dialog/pk-dialog.ts","components/popup/popup":"src/components/popup/pk-popup.ts","components/dropdown-menu/dropdown-label":"src/components/dropdown-menu/pk-dropdown-label.ts","components/dropdown-menu/dropdown-item":"src/components/dropdown-menu/pk-dropdown-item.ts","components/dropdown-menu/dropdown-separator":"src/components/dropdown-menu/pk-dropdown-separator.ts","components/dropdown-menu/dropdown-menu":"src/components/dropdown-menu/pk-dropdown-menu.ts","components/popover/popover":"src/components/popover/pk-popover.ts","components/tooltip/tooltip":"src/components/tooltip/pk-tooltip.ts","components/radio-group/radio":"src/components/radio-group/pk-radio.ts","components/radio-group/radio-group":"src/components/radio-group/pk-radio-group.ts","components/tabs/tab":"src/components/tabs/pk-tab.ts","components/tabs/tab-heading":"src/components/tabs/pk-tab-heading.ts","components/tabs/tab-panel":"src/components/tabs/pk-tab-panel.ts","components/tabs/tabs":"src/components/tabs/pk-tabs.ts","components/scroll-area/scroll-area":"src/components/scroll-area/pk-scroll-area.ts","components/select/option":"src/components/select/pk-option.ts","components/select/option-group":"src/components/select/pk-option-group.ts","components/select/select":"src/components/select/pk-select.ts","components/calendar/calendar":"src/components/calendar/pk-calendar.ts","components/date-picker/date-picker":"src/components/date-picker/pk-date-picker.ts","components/combobox/combobox":"src/components/combobox/pk-combobox.ts","components/time-picker/time-picker":"src/components/time-picker/pk-time-picker.ts","components/copy-button/copy-button":"src/components/copy-button/pk-copy-button.ts","components/connect/connect":"src/components/connect/pk-connect.ts","components/connect/connect-oauth":"src/components/connect/pk-connect-oauth.ts","components/editable-table/editable-table":"src/components/editable-table/pk-editable-table.ts"},d0={"src/components/icon/pk-icon-loader.ts":"src/components/icon/pk-icon.ts"},u0=Object.fromEntries(Object.values(c0).map(e=>{const t=d0[e]??e;return[t.replace(/^src\//,"").replace(/\.ts$/,""),t]}));Object.fromEntries(Object.keys(u0).map(e=>[e.split("/").pop(),`${e}.js`]));var p0=e=>{e.trim()},h0=e=>{const t=(e||[]).map(o=>o.trim()).filter(Boolean);t.length>0},f0=e=>{e.shadowRootSelectors&&h0(e.shadowRootSelectors)},Bs="";function ja(e){Bs=e}function g0(e=""){if(!Bs){const t=document.querySelector("[data-plugin-kit]");if(t?.hasAttribute("data-plugin-kit")){const o=new URL(t.getAttribute("data-plugin-kit")??"",window.location.href).pathname;ja(o)}else{const o=[...document.getElementsByTagName("script")].find(i=>i.src.endsWith("plugin-kit.js")||i.src.endsWith("plugin-kit.loader.js"));o&&ja(String(o.getAttribute("src")).split("/").slice(0,-1).join("/"))}}return Bs.replace(/\/$/,"")+(e?`/${e.replace(/^\//,"")}`:"")}var bs="pk-",m0="pk-discovery-complete";new MutationObserver(e=>{for(const{addedNodes:t}of e)for(const o of t)o.nodeType===Node.ELEMENT_NODE&&v0(o)});async function v0(e=document){const t=e instanceof Element?e.tagName.toLowerCase():"",o=t.startsWith(bs),i=[...e.querySelectorAll(":not(:defined)")].map(l=>l.tagName.toLowerCase()).filter(l=>l.startsWith(bs));o&&!customElements.get(t)&&i.push(t);const n=e.querySelectorAll("[data-pk-preload]"),s=e instanceof Element&&e.hasAttribute("data-pk-preload")?[e,...n]:n;for(const l of s)i.push(...l.getAttribute("data-pk-preload").split(/\s+/).filter(d=>d.startsWith(bs)));const r=[...new Set(i)],a=await Promise.allSettled(r.map(l=>b0(l)));for(const l of a)l.status==="rejected"&&console.warn(l.reason);await new Promise(requestAnimationFrame),e.dispatchEvent(new CustomEvent(m0,{bubbles:!1,cancelable:!1,composed:!0}))}function b0(e){if(customElements.get(e))return Promise.resolve();const t=l0[e];return t?import(g0(t)).then(()=>{}):Promise.reject(new Error(`Unable to autoload <${e}> — no module path registered`))}var y0=Object.create,Jd=Object.defineProperty,k0=Object.getOwnPropertyDescriptor,w0=Object.getOwnPropertyNames,x0=Object.getPrototypeOf,_0=Object.prototype.hasOwnProperty,yt=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),S0=(e,t,o,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(var n=w0(t),s=0,r=n.length,a;s<r;s++)a=n[s],!_0.call(e,a)&&a!==o&&Jd(e,a,{get:(l=>t[l]).bind(null,a),enumerable:!(i=k0(t,a))||i.enumerable});return e},E0=(e,t,o)=>(o=e!=null?y0(x0(e)):{},S0(Jd(o,"default",{value:e,enumerable:!0}),e)),yo=yt(((e,t)=>{function o(i){return i&&i.__esModule?i:{default:i}}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports})),Zd=yt(((e,t)=>{function o(i){"@babel/helpers - typeof";return t.exports=o=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},t.exports.__esModule=!0,t.exports.default=t.exports,o(i)}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports})),C0=yt(((e,t)=>{var o=Zd().default;function i(n,s){if(o(n)!="object"||!n)return n;var r=n[Symbol.toPrimitive];if(r!==void 0){var a=r.call(n,s||"default");if(o(a)!="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(s==="string"?String:Number)(n)}t.exports=i,t.exports.__esModule=!0,t.exports.default=t.exports})),Qd=yt(((e,t)=>{var o=Zd().default,i=C0();function n(s){var r=i(s,"string");return o(r)=="symbol"?r:r+""}t.exports=n,t.exports.__esModule=!0,t.exports.default=t.exports})),A0=yt(((e,t)=>{var o=Qd();function i(n,s,r){return(s=o(s))in n?Object.defineProperty(n,s,{value:r,enumerable:!0,configurable:!0,writable:!0}):n[s]=r,n}t.exports=i,t.exports.__esModule=!0,t.exports.default=t.exports})),ii=yt(((e,t)=>{function o(i,n){if(!(i instanceof n))throw new TypeError("Cannot call a class as a function")}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports})),ni=yt(((e,t)=>{var o=Qd();function i(s,r){for(var a=0;a<r.length;a++){var l=r[a];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(s,o(l.key),l)}}function n(s,r,a){return r&&i(s.prototype,r),a&&i(s,a),Object.defineProperty(s,"prototype",{writable:!1}),s}t.exports=n,t.exports.__esModule=!0,t.exports.default=t.exports})),tu=yt(((e,t)=>{function o(i,n){(n==null||n>i.length)&&(n=i.length);for(var s=0,r=Array(n);s<n;s++)r[s]=i[s];return r}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports})),$0=yt(((e,t)=>{var o=tu();function i(n){if(Array.isArray(n))return o(n)}t.exports=i,t.exports.__esModule=!0,t.exports.default=t.exports})),T0=yt(((e,t)=>{function o(i){if(typeof Symbol<"u"&&i[Symbol.iterator]!=null||i["@@iterator"]!=null)return Array.from(i)}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports})),z0=yt(((e,t)=>{var o=tu();function i(n,s){if(n){if(typeof n=="string")return o(n,s);var r={}.toString.call(n).slice(8,-1);return r==="Object"&&n.constructor&&(r=n.constructor.name),r==="Map"||r==="Set"?Array.from(n):r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?o(n,s):void 0}}t.exports=i,t.exports.__esModule=!0,t.exports.default=t.exports})),P0=yt(((e,t)=>{function o(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports})),M0=yt(((e,t)=>{var o=$0(),i=T0(),n=z0(),s=P0();function r(a){return o(a)||i(a)||n(a)||s()}t.exports=r,t.exports.__esModule=!0,t.exports.default=t.exports})),L0=yt((e=>{var t=yo()(M0()),o={functions:"Jexl Function",transforms:"Transform"};e.ArrayLiteral=function(i){return this.evalArray(i.value)},e.BinaryExpression=function(i){var n=this,s=this._grammar.elements[i.operator];if(s.evalOnDemand){var r=function(l){return{eval:function(){return n.eval(l)}}};return s.evalOnDemand(r(i.left),r(i.right))}return this.Promise.all([this.eval(i.left),this.eval(i.right)]).then(function(a){return s.eval(a[0],a[1])})},e.ConditionalExpression=function(i){var n=this;return this.eval(i.test).then(function(s){return s?i.consequent?n.eval(i.consequent):s:n.eval(i.alternate)})},e.FilterExpression=function(i){var n=this;return this.eval(i.subject).then(function(s){return i.relative?n._filterRelative(s,i.expr):n._filterStatic(s,i.expr)})},e.Identifier=function(i){return i.from?this.eval(i.from).then(function(n){if(n!=null)return Array.isArray(n)&&(n=n[0]),n[i.value]}):i.relative?this._relContext[i.value]:this._context[i.value]},e.Literal=function(i){return i.value},e.ObjectLiteral=function(i){return this.evalMap(i.value)},e.FunctionCall=function(i){var n=o[i.pool];if(!n)throw new Error("Corrupt AST: Pool '".concat(i.pool,"' not found"));var s=this._grammar[i.pool][i.name];if(!s)throw new Error("".concat(n," ").concat(i.name," is not defined."));return this.evalArray(i.args||[]).then(function(r){return s.apply(void 0,(0,t.default)(r))})},e.UnaryExpression=function(i){var n=this;return this.eval(i.right).then(function(s){return n._grammar.elements[i.operator].eval(s)})}})),O0=yt(((e,t)=>{var o=yo(),i=o(ii()),n=o(ni()),s=L0();t.exports=(function(){function r(a,l,d){var u=arguments.length>3&&arguments[3]!==void 0?arguments[3]:Promise;(0,i.default)(this,r),this._grammar=a,this._context=l||{},this._relContext=d||this._context,this.Promise=u}return(0,n.default)(r,[{key:"eval",value:function(l){var d=this;return this.Promise.resolve().then(function(){return s[l.type].call(d,l)})}},{key:"evalArray",value:function(l){var d=this;return this.Promise.all(l.map(function(u){return d.eval(u)}))}},{key:"evalMap",value:function(l){var d=this,u=Object.keys(l),p={},c=u.map(function(v){return d.eval(l[v])});return this.Promise.all(c).then(function(v){return v.forEach(function(y,x){p[u[x]]=y}),p})}},{key:"_filterRelative",value:function(l,d){var u=this,p=[];return Array.isArray(l)||(l=l===void 0?[]:[l]),l.forEach(function(c){var v=new r(u._grammar,u._context,c,u.Promise);p.push(v.eval(d))}),this.Promise.all(p).then(function(c){var v=[];return c.forEach(function(y,x){y&&v.push(l[x])}),v})}},{key:"_filterStatic",value:function(l,d){return this.eval(d).then(function(u){return typeof u=="boolean"?u?l:void 0:l[u]})}}]),r})()})),R0=yt(((e,t)=>{var o=yo(),i=o(ii()),n=o(ni()),s=/^-?(?:(?:[0-9]*\.[0-9]+)|[0-9]+)$/,r=/^[a-zA-Zа-яА-Я_\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF$][a-zA-Zа-яА-Я0-9_\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF$]*$/,a=/\\\\/,l=/^\s*$/,d=["'(?:(?:\\\\')|[^'])*'",'"(?:(?:\\\\")|[^"])*"',"\\s+","\\btrue\\b","\\bfalse\\b"],u=["[a-zA-Zа-яА-Я_À-ÖØ-öø-ÿ\\$][a-zA-Z0-9а-яА-Я_À-ÖØ-öø-ÿ\\$]*","(?:(?:[0-9]*\\.[0-9]+)|[0-9]+)"],p=["binaryOp","unaryOp","openParen","openBracket","question","colon"];t.exports=(function(){function c(v){(0,i.default)(this,c),this._grammar=v}return(0,n.default)(c,[{key:"getElements",value:function(y){var x=this._getSplitRegex();return y.split(x).filter(function(C){return C})}},{key:"getTokens",value:function(y){for(var x=[],C=!1,A=0;A<y.length;A++)this._isWhitespace(y[A])?x.length&&(x[x.length-1].raw+=y[A]):y[A]==="-"&&this._isNegative(x)?C=!0:(C&&(y[A]="-"+y[A],C=!1),x.push(this._createToken(y[A])));return C&&x.push(this._createToken("-")),x}},{key:"tokenize",value:function(y){var x=this.getElements(y);return this.getTokens(x)}},{key:"_createToken",value:function(y){var x={type:"literal",value:y,raw:y};if(y[0]==='"'||y[0]==="'")x.value=this._unquote(y);else if(y.match(s))x.value=parseFloat(y);else if(y==="true"||y==="false")x.value=y==="true";else if(this._grammar.elements[y])x.type=this._grammar.elements[y].type;else if(y.match(r))x.type="identifier";else throw new Error("Invalid expression token: ".concat(y));return x}},{key:"_escapeRegExp",value:function(y){return y=y.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),y.match(r)&&(y="\\b"+y+"\\b"),y}},{key:"_getSplitRegex",value:function(){var y=this;if(!this._splitRegex){var x=Object.keys(this._grammar.elements).sort(function(C,A){return A.length-C.length}).map(function(C){return y._escapeRegExp(C)},this);this._splitRegex=new RegExp("("+[d.join("|"),x.join("|"),u.join("|")].join("|")+")")}return this._splitRegex}},{key:"_isNegative",value:function(y){return y.length?p.some(function(x){return x===y[y.length-1].type}):!0}},{key:"_isWhitespace",value:function(y){return!!y.match(l)}},{key:"_unquote",value:function(y){var x=y[0],C=new RegExp("\\\\"+x,"g");return y.substr(1,y.length-2).replace(C,x).replace(a,"\\")}}]),c})()})),eu=yt((e=>{e.argVal=function(t){t&&this._cursor.args.push(t)},e.arrayStart=function(){this._placeAtCursor({type:"ArrayLiteral",value:[]})},e.arrayVal=function(t){t&&this._cursor.value.push(t)},e.binaryOp=function(t){for(var o=this._grammar.elements[t.value].precedence||0,i=this._cursor._parent;i&&i.operator&&this._grammar.elements[i.operator].precedence>=o;)this._cursor=i,i=i._parent;var n={type:"BinaryExpression",operator:t.value,left:this._cursor};this._setParent(this._cursor,n),this._cursor=i,this._placeAtCursor(n)},e.dot=function(){this._nextIdentEncapsulate=this._cursor&&this._cursor.type!=="UnaryExpression"&&(this._cursor.type!=="BinaryExpression"||this._cursor.type==="BinaryExpression"&&this._cursor.right),this._nextIdentRelative=!this._cursor||this._cursor&&!this._nextIdentEncapsulate,this._nextIdentRelative&&(this._relative=!0)},e.filter=function(t){this._placeBeforeCursor({type:"FilterExpression",expr:t,relative:this._subParser.isRelative(),subject:this._cursor})},e.functionCall=function(){this._placeBeforeCursor({type:"FunctionCall",name:this._cursor.value,args:[],pool:"functions"})},e.identifier=function(t){var o={type:"Identifier",value:t.value};this._nextIdentEncapsulate?(o.from=this._cursor,this._placeBeforeCursor(o),this._nextIdentEncapsulate=!1):(this._nextIdentRelative&&(o.relative=!0,this._nextIdentRelative=!1),this._placeAtCursor(o))},e.literal=function(t){this._placeAtCursor({type:"Literal",value:t.value})},e.objKey=function(t){this._curObjKey=t.value},e.objStart=function(){this._placeAtCursor({type:"ObjectLiteral",value:{}})},e.objVal=function(t){this._cursor.value[this._curObjKey]=t},e.subExpression=function(t){this._placeAtCursor(t)},e.ternaryEnd=function(t){this._cursor.alternate=t},e.ternaryMid=function(t){this._cursor.consequent=t},e.ternaryStart=function(){this._tree={type:"ConditionalExpression",test:this._tree},this._cursor=this._tree},e.transform=function(t){this._placeBeforeCursor({type:"FunctionCall",name:t.value,args:[this._cursor],pool:"transforms"})},e.unaryOp=function(t){this._placeAtCursor({type:"UnaryExpression",operator:t.value})}})),I0=yt((e=>{var t=eu();e.states={expectOperand:{tokenTypes:{literal:{toState:"expectBinOp"},identifier:{toState:"identifier"},unaryOp:{},openParen:{toState:"subExpression"},openCurl:{toState:"expectObjKey",handler:t.objStart},dot:{toState:"traverse"},openBracket:{toState:"arrayVal",handler:t.arrayStart}}},expectBinOp:{tokenTypes:{binaryOp:{toState:"expectOperand"},pipe:{toState:"expectTransform"},dot:{toState:"traverse"},question:{toState:"ternaryMid",handler:t.ternaryStart}},completable:!0},expectTransform:{tokenTypes:{identifier:{toState:"postTransform",handler:t.transform}}},expectObjKey:{tokenTypes:{identifier:{toState:"expectKeyValSep",handler:t.objKey},closeCurl:{toState:"expectBinOp"}}},expectKeyValSep:{tokenTypes:{colon:{toState:"objVal"}}},postTransform:{tokenTypes:{openParen:{toState:"argVal"},binaryOp:{toState:"expectOperand"},dot:{toState:"traverse"},openBracket:{toState:"filter"},pipe:{toState:"expectTransform"}},completable:!0},postArgs:{tokenTypes:{binaryOp:{toState:"expectOperand"},dot:{toState:"traverse"},openBracket:{toState:"filter"},pipe:{toState:"expectTransform"}},completable:!0},identifier:{tokenTypes:{binaryOp:{toState:"expectOperand"},dot:{toState:"traverse"},openBracket:{toState:"filter"},openParen:{toState:"argVal",handler:t.functionCall},pipe:{toState:"expectTransform"},question:{toState:"ternaryMid",handler:t.ternaryStart}},completable:!0},traverse:{tokenTypes:{identifier:{toState:"identifier"}}},filter:{subHandler:t.filter,endStates:{closeBracket:"identifier"}},subExpression:{subHandler:t.subExpression,endStates:{closeParen:"expectBinOp"}},argVal:{subHandler:t.argVal,endStates:{comma:"argVal",closeParen:"postArgs"}},objVal:{subHandler:t.objVal,endStates:{comma:"expectObjKey",closeCurl:"expectBinOp"}},arrayVal:{subHandler:t.arrayVal,endStates:{comma:"arrayVal",closeBracket:"expectBinOp"}},ternaryMid:{subHandler:t.ternaryMid,endStates:{colon:"ternaryEnd"}},ternaryEnd:{subHandler:t.ternaryEnd,completable:!0}}})),D0=yt(((e,t)=>{var o=yo(),i=o(ii()),n=o(ni()),s=eu(),r=I0().states;t.exports=(function(){function a(l,d,u){(0,i.default)(this,a),this._grammar=l,this._state="expectOperand",this._tree=null,this._exprStr=d||"",this._relative=!1,this._stopMap=u||{}}return(0,n.default)(a,[{key:"addToken",value:function(d){if(this._state==="complete")throw new Error("Cannot add a new token to a completed Parser");var u=r[this._state],p=this._exprStr;if(this._exprStr+=d.raw,u.subHandler){this._subParser||this._startSubExpression(p);var c=this._subParser.addToken(d);if(c){if(this._endSubExpression(),this._parentStop)return c;this._state=c}}else if(u.tokenTypes[d.type]){var v=u.tokenTypes[d.type],y=s[d.type];v.handler&&(y=v.handler),y&&y.call(this,d),v.toState&&(this._state=v.toState)}else{if(this._stopMap[d.type])return this._stopMap[d.type];throw new Error("Token ".concat(d.raw," (").concat(d.type,") unexpected in expression: ").concat(this._exprStr))}return!1}},{key:"addTokens",value:function(d){d.forEach(this.addToken,this)}},{key:"complete",value:function(){if(this._cursor&&!r[this._state].completable)throw new Error("Unexpected end of expression: ".concat(this._exprStr));return this._subParser&&this._endSubExpression(),this._state="complete",this._cursor?this._tree:null}},{key:"isRelative",value:function(){return this._relative}},{key:"_endSubExpression",value:function(){r[this._state].subHandler.call(this,this._subParser.complete()),this._subParser=null}},{key:"_placeAtCursor",value:function(d){this._cursor?(this._cursor.right=d,this._setParent(d,this._cursor)):this._tree=d,this._cursor=d}},{key:"_placeBeforeCursor",value:function(d){this._cursor=this._cursor._parent,this._placeAtCursor(d)}},{key:"_setParent",value:function(d,u){Object.defineProperty(d,"_parent",{value:u,writable:!0})}},{key:"_startSubExpression",value:function(d){var u=r[this._state].endStates;u||(this._parentStop=!0,u=this._stopMap),this._subParser=new a(this._grammar,d,u)}}]),a})()})),F0=yt(((e,t)=>{var o=yo(),i=o(ii()),n=o(ni()),s=(function(){function r(a){(0,i.default)(this,r),a(this._resolve.bind(this),this._reject.bind(this))}return(0,n.default)(r,[{key:"catch",value:function(l){if(this.error)try{this._resolve(l(this.error))}catch(d){this._reject(d)}return this}},{key:"then",value:function(l,d){if(!this.error)try{this._resolve(l(this.value))}catch(u){this._reject(u)}return d&&this.catch(d),this}},{key:"_reject",value:function(l){this.value=void 0,this.error=l}},{key:"_resolve",value:function(l){l instanceof r?l.error?this._reject(l.error):this._resolve(l.value):(this.value=l,this.error=void 0)}}]),r})();s.all=function(r){return new s(function(a){a(r.map(function(l){for(;l instanceof s;){if(l.error)throw Error(l.error);l=l.value}return l}))})},s.resolve=function(r){return new s(function(a){return a(r)})},s.reject=function(r){return new s(function(a,l){return l(r)})},t.exports=s})),N0=yt(((e,t)=>{var o=yo(),i=o(ii()),n=o(ni()),s=O0(),r=R0(),a=D0(),l=F0();t.exports=(function(){function d(u,p){(0,i.default)(this,d),this._grammar=u,this._exprStr=p,this._ast=null}return(0,n.default)(d,[{key:"compile",value:function(){var p=new r(this._grammar),c=new a(this._grammar),v=p.tokenize(this._exprStr);return c.addTokens(v),this._ast=c.complete(),this}},{key:"eval",value:function(){var p=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return this._eval(p,Promise)}},{key:"evalSync",value:function(){var p=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},c=this._eval(p,l);if(c.error)throw c.error;return c.value}},{key:"_eval",value:function(p,c){var v=this;return c.resolve().then(function(){var y=v._getAst();return new s(v._grammar,p,void 0,c).eval(y)})}},{key:"_getAst",value:function(){return this._ast||this.compile(),this._ast}}]),d})()})),j0=yt((e=>{e.getGrammar=function(){return{elements:{".":{type:"dot"},"[":{type:"openBracket"},"]":{type:"closeBracket"},"|":{type:"pipe"},"{":{type:"openCurl"},"}":{type:"closeCurl"},":":{type:"colon"},",":{type:"comma"},"(":{type:"openParen"},")":{type:"closeParen"},"?":{type:"question"},"+":{type:"binaryOp",precedence:30,eval:function(o,i){return o+i}},"-":{type:"binaryOp",precedence:30,eval:function(o,i){return o-i}},"*":{type:"binaryOp",precedence:40,eval:function(o,i){return o*i}},"/":{type:"binaryOp",precedence:40,eval:function(o,i){return o/i}},"//":{type:"binaryOp",precedence:40,eval:function(o,i){return Math.floor(o/i)}},"%":{type:"binaryOp",precedence:50,eval:function(o,i){return o%i}},"^":{type:"binaryOp",precedence:50,eval:function(o,i){return Math.pow(o,i)}},"==":{type:"binaryOp",precedence:20,eval:function(o,i){return o==i}},"!=":{type:"binaryOp",precedence:20,eval:function(o,i){return o!=i}},">":{type:"binaryOp",precedence:20,eval:function(o,i){return o>i}},">=":{type:"binaryOp",precedence:20,eval:function(o,i){return o>=i}},"<":{type:"binaryOp",precedence:20,eval:function(o,i){return o<i}},"<=":{type:"binaryOp",precedence:20,eval:function(o,i){return o<=i}},"&&":{type:"binaryOp",precedence:10,evalOnDemand:function(o,i){return o.eval().then(function(n){return n&&i.eval()})}},"||":{type:"binaryOp",precedence:10,evalOnDemand:function(o,i){return o.eval().then(function(n){return n||i.eval()})}},in:{type:"binaryOp",precedence:20,eval:function(o,i){return typeof i=="string"?i.indexOf(o)!==-1:Array.isArray(i)?i.some(function(n){return n===o}):!1}},"!":{type:"unaryOp",precedence:1/0,eval:function(o){return!o}}},functions:{},transforms:{}}}})),ys=E0(yt(((e,t)=>{var o=yo(),i=o(A0()),n=o(ii()),s=o(ni()),r=N0(),a=j0().getGrammar,l=(function(){function d(){(0,n.default)(this,d),this.expr=this.expr.bind(this),this._grammar=a()}return(0,s.default)(d,[{key:"addBinaryOp",value:function(p,c,v,y){this._addGrammarElement(p,(0,i.default)({type:"binaryOp",precedence:c},y?"evalOnDemand":"eval",v))}},{key:"addFunction",value:function(p,c){this._grammar.functions[p]=c}},{key:"addFunctions",value:function(p){for(var c in p)this._grammar.functions[c]=p[c]}},{key:"addUnaryOp",value:function(p,c){this._addGrammarElement(p,{type:"unaryOp",weight:1/0,eval:c})}},{key:"addTransform",value:function(p,c){this._grammar.transforms[p]=c}},{key:"addTransforms",value:function(p){for(var c in p)this._grammar.transforms[c]=p[c]}},{key:"compile",value:function(p){return this.createExpression(p).compile()}},{key:"createExpression",value:function(p){return new r(this._grammar,p)}},{key:"getFunction",value:function(p){return this._grammar.functions[p]}},{key:"getTransform",value:function(p){return this._grammar.transforms[p]}},{key:"eval",value:function(p){var c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};return this.createExpression(p).eval(c)}},{key:"evalSync",value:function(p){var c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};return this.createExpression(p).evalSync(c)}},{key:"expr",value:function(p){for(var c=arguments.length,v=new Array(c>1?c-1:0),y=1;y<c;y++)v[y-1]=arguments[y];var x=p.reduce(function(C,A,D){var L=D<v.length?v[D]:"";return C+=A+L,C},"");return this.createExpression(x)}},{key:"removeOp",value:function(p){this._grammar.elements[p]&&(this._grammar.elements[p].type==="binaryOp"||this._grammar.elements[p].type==="unaryOp")&&delete this._grammar.elements[p]}},{key:"_addGrammarElement",value:function(p,c){this._grammar.elements[p]=c}}]),d})();t.exports=new l,t.exports.Jexl=l}))());"default"in ys&&ys.default;var B0=e=>{e.trim()},U0=()=>{const e=globalThis.Craft;if(typeof e?.t=="function")return(t,o,i)=>e.t(t,o,i)},H0=e=>{const{translationCategory:t,translate:o,hostBridge:i,portalClassName:n,portalContainer:s,shadowRootSelectors:r}=e;t&&B0(t),o??U0(),i&&xf(i),n&&p0(n);const a={...s!==void 0?{portalContainer:s}:{},...r!==void 0?{shadowRootSelectors:r}:{}};(a.portalContainer!==void 0||a.shadowRootSelectors!==void 0)&&f0(a)},V0=Symbol("pluginKitConfig"),q0=Fe({name:"PluginKitProvider",props:{translationCategory:{type:String,default:void 0},translate:{type:Function,default:void 0},hostBridge:{type:Object,default:void 0},portalClassName:{type:String,default:void 0},portalContainer:{type:Object,default:void 0},shadowRootSelectors:{type:Array,default:void 0}},setup(e,{slots:t}){const o={...e.translationCategory?{translationCategory:e.translationCategory}:{},...e.translate?{translate:e.translate}:{},...e.hostBridge?{hostBridge:e.hostBridge}:{},...e.portalClassName?{portalClassName:e.portalClassName}:{},...e.portalContainer!==void 0?{portalContainer:e.portalContainer}:{},...e.shadowRootSelectors?{shadowRootSelectors:e.shadowRootSelectors}:{}};return H0(o),Ml(V0,o),()=>t.default?.()}});const K0=["aria-label","onKeydown"],he=Fe({__name:"HelpTip",props:{text:{},label:{}},setup(e){function t(o){o.currentTarget.closest("pk-tooltip")?.hide()}return(o,i)=>(F(),Gt(tt(S1),{class:"af-tooltip",content:e.text,placement:"top"},{default:ft(()=>[w("button",{slot:"trigger",type:"button",class:"af-help","aria-label":e.label,onKeydown:Ms(zi(t,["stop"]),["esc"])},"?",40,K0)]),_:1},8,["content"]))}}),W0={class:"visually-hidden","aria-live":"polite"},G0=["disabled","aria-label","onPointerdown","onKeydown"],Y0={width:"12",height:"18",viewBox:"0 0 12 18","aria-hidden":"true"},X0=["cx","cy"],J0=["disabled","aria-label","onClick"],Ba=Fe({__name:"SortableFields",props:{items:{},label:{},locked:{},readonly:{type:Boolean}},emits:["reorder","remove"],setup(e,{emit:t}){const o=e,i=t,n=At(),s=At(-1),r=At(-1),a=At(""),l=new WeakMap;let d=0;function u(L){return l.has(L)||l.set(L,++d),l.get(L)}let p=0,c=!1;function v(L,M){o.readonly||o.locked?.includes(o.items[M])||L.button!==0||o.items.length<2||(L.preventDefault(),p=L.clientY,c=!1,s.value=M,r.value=M,L.currentTarget.setPointerCapture(L.pointerId))}function y(L){if(s.value<0||Math.abs(L.clientY-p)<5&&!c)return;c=!0;const V=[...n.value?.querySelectorAll(":scope > .af-sort-item")||[]].filter((B,q)=>q!==s.value);r.value=V.filter(B=>{const q=B.getBoundingClientRect();return L.clientY>q.top+q.height/2}).length,L.clientY<100&&window.scrollBy(0,-12),L.clientY>window.innerHeight-70&&window.scrollBy(0,12)}function x(L,M){o.readonly||o.locked?.includes(o.items[L])||L===M||M<0||M>=o.items.length||(i("reorder",L,M),a.value=`Field moved to position ${M+1} of ${o.items.length}.`)}function C(){c&&s.value>=0&&x(s.value,r.value),A()}function A(){s.value=-1,r.value=-1,c=!1}function D(L){return s.value<0||r.value===s.value?!1:r.value<s.value?L===r.value:L===r.value+1}return On(A),(L,M)=>(F(),H("div",{ref_key:"root",ref:n,class:ne(["af-sortable",{"af-sorting":s.value>=0}])},[w("p",W0,nt(a.value),1),(F(!0),H(mt,null,ie(e.items,(V,B)=>(F(),H("div",{key:u(V),class:ne(["af-sort-item",{"af-sort-item--dragging":s.value===B,"af-drop-before":D(B),"af-drop-after":s.value>=0&&r.value===e.items.length-1&&r.value!==s.value&&B===e.items.length-1}])},[w("button",{type:"button",class:"af-drag-handle",disabled:e.readonly||e.locked?.includes(V),"aria-label":`Reorder ${e.label} field ${B+1}`,title:"Drag to reorder. Use Up or Down arrows to move with the keyboard.",onPointerdown:q=>v(q,B),onPointermove:y,onPointerup:C,onPointercancel:A,onLostpointercapture:A,onKeydown:[Ms(zi(q=>x(B,B-1),["prevent"]),["up"]),Ms(zi(q=>x(B,B+1),["prevent"]),["down"])]},[(F(),H("svg",Y0,[(F(),H(mt,null,ie([[3,4],[9,4],[3,9],[9,9],[3,14],[9,14]],(q,it)=>w("circle",{key:it,cx:q[0],cy:q[1],r:"1.4",fill:"currentColor"},null,8,X0)),64))]))],40,G0),Al(L.$slots,"default",{row:V,index:B}),w("button",{type:"button",class:"af-remove-field",disabled:e.readonly||e.locked?.includes(V),"aria-label":`Remove ${e.label} field ${B+1}`,title:"Remove field",onClick:q=>i("remove",B)},"×",8,J0)],2))),128))],2))}}),Z0=Fe({__name:"NativeFieldPicker",props:{open:{type:Boolean},anchor:{},label:{}},emits:["close","show","hidden"],setup(e,{emit:t}){const o=e,i=t,n=Iu();let s;return Ro(()=>o.open,async r=>{if(r&&o.anchor){if(await Mo(),!o.open||(s=new window.Garnish.HUD(o.anchor,{hudClass:"hud fld-library-hud af-native-field-picker-hud",orientations:["right","bottom","left"],showOnInit:!1,listenToMainResize:!0,onHide:()=>i("close")}),n.value=s.$main[0],s.$hud.attr({role:"dialog","aria-label":o.label}),await Mo(),!o.open||!s))return;s.show(),i("show")}else if(s){const a=s;s=void 0,a.hide(),n.value=void 0,await Mo(),a.destroy(),i("hidden")}}),On(()=>{s?.hide(),s?.destroy()}),(r,a)=>n.value?(F(),Gt(kl,{key:0,to:n.value},[Al(r.$slots,"default")],8,["to"])):Z("",!0)}}),Q0=["disabled"],t2=["disabled"],e2={key:0,class:"af-banner af-banner--error",role:"alert"},o2={key:1,class:"af-banner af-banner--error",role:"alert"},i2={style:{margin:"0","padding-left":"18px"}},n2={key:2,class:"notice"},s2={key:3,class:"notice"},r2=["disabled"],a2={id:"workflow-basics"},l2={class:"af-basics-heading"},c2={class:"af-label-line"},d2={class:"af-label-line"},u2={class:"af-basics-name"},p2={key:0,class:"af-error"},h2={class:"af-basics-description"},f2={key:0,class:"af-error"},g2={class:"af-setup-grid"},m2={class:"select fullwidth"},v2={key:0},b2={class:"select fullwidth"},y2=["value"],k2={key:0,class:"af-error"},w2={key:1},x2={class:"select fullwidth"},_2=["value"],S2={key:0,class:"af-error"},E2={class:"af-panel-header"},C2=["aria-expanded"],A2={class:"af-field-count"},$2={key:0,class:"af-shared-preview"},T2={class:"af-shared-instructions"},z2={key:0,class:"af-error"},P2={class:"af-context-options"},M2={key:1,class:"af-muted"},L2=["open"],O2=["onClick"],R2=["innerHTML"],I2={class:"af-field-heading"},D2={key:0,class:"af-field-status af-field-status--error"},F2={key:1,class:"af-instruction-preview"},N2={class:"af-row-body"},j2={key:0,class:"af-error"},B2={class:"af-grid"},U2={class:"af-advanced"},H2={class:"af-toggle-list",style:{"margin-top":"12px"}},V2={key:0,class:"af-card",style:{"margin-top":"14px"}},q2={class:"af-grid"},K2={class:"af-toggle-list",style:{"margin-top":"10px"}},W2={class:"af-panel-header"},G2=["aria-expanded"],Y2={class:"af-field-count"},X2={key:0,class:"af-inline-note"},J2=["open"],Z2=["onClick"],Q2=["innerHTML"],tg={class:"af-field-heading"},eg={key:0,class:"af-field-status af-field-status--error"},og={key:1,class:"af-field-status af-field-status--attention"},ig={key:2,class:"af-instruction-preview"},ng=["disabled"],sg={key:0,class:"light"},rg={key:1,class:"af-error"},ag={class:"af-prompt"},lg={key:2,class:"af-attention-note"},cg={class:"af-advanced"},dg={class:"af-behavior-grid"},ug={class:"af-label-line"},pg=["for"],hg={class:"select fullwidth"},fg=["id","value","onChange"],gg=["disabled"],mg={class:"af-label-line"},vg=["for"],bg={class:"select fullwidth"},yg=["id","value","onChange"],kg={class:"af-row-options"},wg={class:"af-label-line"},xg={key:0,class:"af-format-help"},_g={key:0,class:"af-toggle-list"},Sg={key:4},Eg={key:1,class:"af-grid",style:{"margin-top":"14px"}},Cg={class:"select fullwidth"},Ag=["onUpdate:modelValue"],$g={key:0},Tg={key:2,class:"af-card"},zg={class:"af-label"},Pg={class:"select fullwidth"},Mg=["onUpdate:modelValue"],Lg={key:0},Og={key:3,class:"af-card"},Rg={class:"af-grid"},Ig={class:"af-toggle-list",style:{"margin-top":"10px"}},Dg={key:1,class:"af-inline-note"},Fg=["open"],Ng={class:"af-disclosure-body af-advanced-fields"},jg={class:"af-label-line"},Bg={class:"af-label-line"},Ug={class:"select fullwidth"},Hg=["value"],Vg={class:"af-label-line af-handle-label"},qg={key:0,class:"af-error"},Kg={class:"fld-library af-native-field-picker"},Wg={class:"texticon search icon"},Gg={class:"fld-field-library"},Yg=["disabled","onClick"],Xg=["innerHTML"],Jg={class:"field-name"},Zg={class:"fld-element-label"},Qg={key:0,class:"fld-attribute"},tm={key:0,class:"light"},em=Fe({__name:"WorkflowApp",props:{options:{}},setup(e){const t=At(),o=At(null),i=At(null),n=At(),s=At(""),r=At();let a=null,l;function d(m){i.value||(!(m.target instanceof Element)||!m.target.closest(".af-builder-panel"))&&le(null)}El(()=>{document.addEventListener("pointerdown",d);const m=document.querySelector("#header");m&&(l=new ResizeObserver(()=>t.value?.style.setProperty("--af-header-offset",`${m.getBoundingClientRect().height}px`)),l.observe(m))}),On(()=>{l?.disconnect(),document.removeEventListener("pointerdown",d)});const p=e.options||{},c=To(p.workflow||{id:null,handle:"",name:"",description:"",scope:"entry",entryTypeUid:"",volumeUid:"",modelConfigUid:"",globalPrompt:"",actionButtonLabel:"",showUserPromptInput:!0,showOnSidebar:!1,visibility:"private",rows:[],contextRows:[]}),v=At(),y=Ae({get:()=>c.id?c.showOnSidebar:v.value??c.scope==="asset",set:m=>{c.id?c.showOnSidebar=m:v.value=m}}),x=new Map((p.workflow?.rows||[]).filter(m=>p.workflow?.canConfigureAutomatic===!1&&m.requiresApproval===!1).map(m=>[m.targetFieldUid,JSON.parse(JSON.stringify(m))])),C=Ae(()=>c.canEdit===!1||c.processing===!0),A=Ae(()=>c.canConfigureAutomatic===!1?c.rows.filter(m=>m.requiresApproval===!1):[]),D=At([]),L=At(!1),M=At(p.metadataFields||[]),V=At(!1),B=At(""),q=At({}),it=Ae(()=>D.value.filter(m=>!m.contextOnly)),at=Ae(()=>D.value),et=Ae(()=>(i.value==="context"?at.value:it.value).filter(m=>`${m.name} ${m.handle||""}`.toLowerCase().includes(s.value.trim().toLowerCase()))),Tt=Ae(()=>[{label:"Built-in fields",fields:et.value.filter(m=>m.uid.startsWith("__"))},{label:"Custom fields",fields:et.value.filter(m=>!m.uid.startsWith("__"))}].filter(m=>m.fields.length)),Et=Ae(()=>c.scope==="entry"?c.entryTypeUid:c.volumeUid);function ht(m){return!!Et.value&&L.value&&!D.value.some(h=>h.uid===m)}function xt(m){return m.enabled!==!1&&!m.prompt?.trim()}function It(m){return D.value.find(h=>h.uid===m)?.iconSvg||""}function lt(m,h){return D.value.find(f=>f.uid===m)?.name||(m?"Unavailable field":h)}function Q(m){return c.contextRows.some(h=>h.fieldUid===m)?"Already in context":c.rows.some(h=>h.targetFieldUid===m)?"Already in outputs":""}function Y(m,h=!0){return m==null?h:m===!0||m===1||m==="1"}function gt(){return{targetFieldUid:"",prompt:"",requiresApproval:!0,includeCurrentFieldValue:!0,overrideCurrentValue:!0,enabled:!0,seomatic:{includeSeoTitle:!0,includeSiteNamePosition:!0,includeSeoDescription:!0,includeSeoKeywords:!0},related:{mode:"topN",topN:25,forceUseCurrentValues:!1},link:{entry:{mode:"topN",count:10},category:{mode:"topN",count:10},asset:{mode:"topN",count:10}},assets:{metadata:["title","filename"],includeFile:!1,maxFiles:3}}}function Se(){c.rows=(c.rows||[]).map(m=>({...gt(),...m,seomatic:{...gt().seomatic,...m.seomatic||{}},related:{...gt().related,...m.related||{}},link:{...gt().link,...m.link||{}},assets:{...gt().assets,...m.assets||{}}})),c.contextRows=(c.contextRows||[]).map(m=>({fieldUid:"",prompt:"",enabled:!0,...m,assets:{metadata:["title","filename"],includeFile:!1,maxFiles:1,...m.assets||{}}}))}Se();const zt=To(new Set),_t=To(new Set);c.rows.forEach((m,h)=>{(!c.id||h===0)&&zt.add(m)}),c.contextRows.forEach(m=>{c.id||_t.add(m)});function si(m,h){const f=m==="context"?_t:zt,N=o.value===m&&f.has(h);le(m),N?f.delete(h):f.add(h)}function le(m){o.value=m,m!=="output"&&zt.clear(),m!=="context"&&_t.clear()}async function Jn(m){await Mo();const f=t.value?.querySelector(m==="context"?"#workflow-source":"#workflow-outputs")?.querySelector(".af-sort-item:last-child");f?.scrollIntoView({behavior:"instant",block:"nearest"}),f?.querySelector("pk-textarea, textarea")?.focus({preventScroll:!0})}function Be(m,h){n.value=h.currentTarget,le(m),s.value="",i.value=m}function ko(m){Be("output",m)}function ri(m){Be("context",m)}function Vi(m){const h=i.value;!h||Q(m.uid)||(le(h),h==="output"?(c.rows.push({...gt(),targetFieldUid:m.uid}),zt.add(c.rows[c.rows.length-1])):(c.contextRows.push({fieldUid:m.uid,prompt:"",enabled:!0,assets:{metadata:["title","filename"],includeFile:m.adapter==="assets",maxFiles:1}}),_t.add(c.contextRows[c.contextRows.length-1])),a=h,i.value=null)}function Ze(){if(!a)return;const m=a;a=null,Jn(m)}function Zn(m){const h=m.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");return h&&!/^[a-z]/.test(h)?`workflow-${h}`:h}Ro(()=>c.name,(m,h)=>{!c.id&&(!c.handle||c.handle===Zn(h))&&(c.handle=Zn(m))});function g(m){return["seomatic","entries","categories","tags","link","assets"].includes(b(m.targetFieldUid))}function b(m){return D.value.find(h=>h.uid===m)?.adapter||""}function _(m){return D.value.find(h=>h.uid===m)?.seomaticSections||{}}function z(m){return["entries","categories","tags"].includes(b(m.targetFieldUid))}function $(m){return b(m.fieldUid)==="assets"||m.fieldUid==="__asset__:file"}function E(m){return q.value[m]?.[0]||""}async function I(m,h){const f=await fetch(m,{method:h===void 0?"GET":"POST",headers:h===void 0?{Accept:"application/json"}:{"Content-Type":"application/json",Accept:"application/json","X-CSRF-Token":window.Craft?.csrfTokenValue||""},body:h===void 0?void 0:JSON.stringify(h),credentials:"same-origin"}),N=await f.json();if(!f.ok||N.success===!1)throw Object.assign(new Error(N.error||`Request failed (${f.status})`),{payload:N});return N}async function R(){if(D.value=[],L.value=!1,!(!Et.value||!p.fieldsUrl))try{const m=await I(p.fieldsUrl,{scope:c.scope,entryTypeUid:c.entryTypeUid,volumeUid:c.volumeUid});D.value=Array.isArray(m.fields)?m.fields:[],L.value=!0,M.value=Array.isArray(m.metadataFields)?m.metadataFields:[]}catch(m){B.value=m.message||"Could not load fields for this scope."}}Ro(Et,R,{immediate:!0});async function O(){V.value=!0,q.value={},B.value="";try{const m=JSON.parse(JSON.stringify(c));m.showOnSidebar=y.value,m.rows=m.rows.map(f=>({...f,requiresApproval:Y(f.requiresApproval),includeCurrentFieldValue:Y(f.includeCurrentFieldValue),overrideCurrentValue:Y(f.overrideCurrentValue),enabled:Y(f.enabled),seomatic:Object.fromEntries(Object.entries(f.seomatic||{}).map(([N,T])=>[N,Y(T)])),related:{...f.related,forceUseCurrentValues:Y(f.related?.forceUseCurrentValues,!1)}})),m.contextRows=m.contextRows.map(f=>({...f,enabled:Y(f.enabled)})),m.rows=m.rows.map(f=>x.get(f.targetFieldUid)||f);const h=await I(p.saveUrl,{workflow:m});if(window.Craft?.cp?.displayNotice("Workflow saved."),h.workflow){const f=c.rows.map((T,J)=>zt.has(T)?J:-1),N=c.contextRows.map((T,J)=>_t.has(T)?J:-1);Object.assign(c,h.workflow),Se(),zt.clear(),_t.clear(),f.forEach(T=>{c.rows[T]&&zt.add(c.rows[T])}),N.forEach(T=>{c.contextRows[T]&&_t.add(c.contextRows[T])})}window.history.replaceState({},"",h.editUrl||p.editUrl||window.location.href)}catch(m){const h=m.payload?.errors;h&&typeof h=="object"&&(q.value=h),B.value=m.message||"Could not save this workflow."}finally{V.value=!1}}async function P(){if(!(V.value||C.value||!p.isAdmin||!c.id)){V.value=!0,B.value="";try{const m=await I(p.archiveUrl,{id:c.id,archived:!c.archived});c.archived=m.archived,window.Craft?.cp?.displayNotice(c.archived?"Workflow archived.":"Workflow restored.")}catch(m){B.value=m.message||"Could not change the workflow archive status."}finally{V.value=!1}}}function U(m,h,f,N=!1){const T=f.target.value;m[h]=N?Number(T):String(T??"")}return(m,h)=>(F(),H("main",{ref_key:"page",ref:t,class:"af-page af-editor"},[(F(),Gt(kl,{to:"#autofill-workflow-actions"},[w("button",{type:"button",class:"btn submit",disabled:V.value||C.value,onClick:O},nt(V.value?"Saving…":"Save workflow"),9,Q0),tt(p).isAdmin&&c.id?(F(),Gt(tt(r0),{key:0,placement:"bottom-end",onPkSelect:P},{trigger:ft(()=>[w("button",{type:"button",class:"btn action-btn","aria-label":"Workflow actions",disabled:V.value||C.value},null,8,t2)]),default:ft(()=>[K(tt(a0),{value:"toggle-archive"},{default:ft(()=>[kt(nt(c.archived?"Restore workflow":"Archive workflow"),1)]),_:1})]),_:1})):Z("",!0)])),B.value?(F(),H("div",e2,nt(B.value),1)):Z("",!0),Object.keys(q.value).length?(F(),H("div",o2,[w("ul",i2,[(F(!0),H(mt,null,ie(q.value,(f,N)=>(F(),H("li",{key:N},nt(f.join(" ")),1))),128))])])):Z("",!0),C.value?(F(),H("p",n2,nt(c.processing?"This workflow is processing. Editing is available when generation finishes.":"You can view this workflow, but cannot edit it."),1)):Z("",!0),c.archived?(F(),H("p",s2,"This workflow is archived.")):Z("",!0),w("fieldset",{disabled:C.value,style:{border:"0",padding:"0",margin:"0","min-width":"0"}},[w("section",a2,[w("div",l2,[w("div",c2,[h[23]||(h[23]=w("h2",null,"Workflow setup",-1)),K(he,{label:"About workflow setup",text:"Choose the content this workflow belongs to. Add the source information and fields to fill below."})]),w("div",d2,[K(tt(U1),{class:"af-share-switch",size:"sm",label:"Share",checked:c.visibility==="public",disabled:C.value,"onUpdate:checked":h[0]||(h[0]=f=>c.visibility=f?"public":"private")},null,8,["checked","disabled"]),K(he,{label:"About sharing",text:"When shared, users with the appropriate Craft permissions can find and run this workflow. Otherwise, it’s private to its creator and administrators."})])]),w("div",u2,[K(tt(io),{class:"af-control",label:"Name",value:c.name,placeholder:"For example, Product descriptions",autocomplete:"off",onInput:h[1]||(h[1]=f=>U(c,"name",f))},null,8,["value"]),E("name")?(F(),H("span",p2,nt(E("name")),1)):Z("",!0)]),w("div",h2,[K(tt(io),{class:"af-control",label:"Description (optional)",value:c.description,placeholder:"Describe what this workflow does and when to use it",onInput:h[2]||(h[2]=f=>U(c,"description",f))},null,8,["value"]),E("description")?(F(),H("span",f2,nt(E("description")),1)):Z("",!0)]),w("div",g2,[w("label",null,[h[25]||(h[25]=w("span",{class:"af-label"},"Content",-1)),w("div",m2,[Ce(w("select",{"onUpdate:modelValue":h[3]||(h[3]=f=>c.scope=f)},[...h[24]||(h[24]=[w("option",{value:"entry"},"Entries",-1),w("option",{value:"asset"},"Assets",-1)])],512),[[xo,c.scope]])])]),c.scope==="entry"?(F(),H("label",v2,[h[27]||(h[27]=w("span",{class:"af-label"},"Entry type",-1)),w("div",b2,[Ce(w("select",{"onUpdate:modelValue":h[4]||(h[4]=f=>c.entryTypeUid=f)},[h[26]||(h[26]=w("option",{value:""},"Select an entry type",-1)),(F(!0),H(mt,null,ie(tt(p).entryTypes,f=>(F(),H("option",{key:f.uid,value:f.uid},nt(f.name),9,y2))),128))],512),[[xo,c.entryTypeUid]])]),E("entryTypeUid")?(F(),H("span",k2,nt(E("entryTypeUid")),1)):Z("",!0)])):(F(),H("label",w2,[h[29]||(h[29]=w("span",{class:"af-label"},"Asset volume",-1)),w("div",x2,[Ce(w("select",{"onUpdate:modelValue":h[5]||(h[5]=f=>c.volumeUid=f)},[h[28]||(h[28]=w("option",{value:""},"Select an asset volume",-1)),(F(!0),H(mt,null,ie(tt(p).volumes,f=>(F(),H("option",{key:f.uid,value:f.uid},nt(f.name),9,_2))),128))],512),[[xo,c.volumeUid]])]),E("volumeUid")?(F(),H("span",S2,nt(E("volumeUid")),1)):Z("",!0)]))])]),w("div",{class:ne(["af-builder",`af-builder--${o.value}`])},[w("section",{class:ne(["af-card af-builder-panel",{"af-panel--active":o.value==="context"}]),id:"workflow-source",onClick:h[11]||(h[11]=f=>le("context"))},[w("div",E2,[w("h2",null,[w("button",{type:"button",class:"af-panel-tab","aria-expanded":o.value==="context",onClick:h[6]||(h[6]=f=>le("context"))},[h[30]||(h[30]=w("svg",{class:"af-role-icon",viewBox:"0 0 20 20",fill:"none",stroke:"currentColor","stroke-width":"1.5","aria-hidden":"true"},[w("path",{d:"M10 5C7 3 4 3 2 4v12c2-1 5-1 8 1 3-2 6-2 8-1V4c-2-1-5-1-8 1Zm0 0v12"})],-1)),h[31]||(h[31]=kt("Context ",-1)),w("span",A2,nt(c.contextRows.length),1)],8,C2),K(he,{label:"About context fields",text:"These fields supply information to the model. Autofill does not change their values. Select a field to edit its instructions."})]),K(tt(Na),{variant:"secondary",disabled:!Et.value,onClick:ri},{default:ft(()=>[...h[32]||(h[32]=[kt("Add",-1)])]),_:1},8,["disabled"])]),o.value!=="context"&&c.globalPrompt?.trim()?(F(),H("p",$2,[h[33]||(h[33]=w("span",null,"Shared instructions",-1)),kt(nt(c.globalPrompt),1)])):Z("",!0),Ce(w("div",T2,[K(tt(gs),{class:"af-control",label:"Shared instructions (optional)",rows:"2",value:c.globalPrompt,placeholder:"Shared tone, quality, or compliance instructions",onInput:h[7]||(h[7]=f=>U(c,"globalPrompt",f))},null,8,["value"]),E("globalPrompt")?(F(),H("span",z2,nt(E("globalPrompt")),1)):Z("",!0)],512),[[th,o.value==="context"]]),w("div",P2,[K(tt(Ht),{class:"af-toggle",checked:c.showUserPromptInput,"onUpdate:checked":h[8]||(h[8]=f=>c.showUserPromptInput=f)},{default:ft(()=>[...h[34]||(h[34]=[kt("Allow additional instructions",-1)])]),_:1},8,["checked"])]),Et.value?Z("",!0):(F(),H("p",M2,"Choose a scope above to load context fields.")),K(Ba,{items:c.contextRows,label:"context",onReorder:h[9]||(h[9]=(f,N)=>c.contextRows.splice(N,0,c.contextRows.splice(f,1)[0])),onRemove:h[10]||(h[10]=f=>c.contextRows.splice(f,1))},{default:ft(({row:f,index:N})=>[w("details",{class:ne(["af-row",{"af-field--error":ht(f.fieldUid)}]),open:o.value==="context"&&_t.has(f)},[w("summary",{class:"af-row-head af-context-summary",onClick:zi(T=>si("context",f),["prevent","stop"])},[It(f.fieldUid)?(F(),H("span",{key:0,class:"cp-icon medium af-field-type-icon","aria-hidden":"true",innerHTML:It(f.fieldUid)},null,8,R2)):Z("",!0),w("div",I2,[w("strong",null,nt(lt(f.fieldUid,"Unassigned context field")),1),ht(f.fieldUid)?(F(),H("span",D2,"Unavailable")):f.prompt?.trim()?(F(),H("span",F2,nt(f.prompt),1)):Z("",!0)])],8,O2),w("div",N2,[ht(f.fieldUid)?(F(),H("p",j2,"This field is unavailable in the selected layout. Remove this card and add a replacement field.")):Z("",!0),w("div",B2,[w("div",null,[K(tt(gs),{class:"af-control",label:"Instructions (optional)",rows:"2",value:f.prompt,placeholder:"How should the model interpret this field?",onInput:T=>U(f,"prompt",T)},null,8,["value","onInput"])])]),w("details",U2,[h[40]||(h[40]=w("summary",null,"Advanced",-1)),w("div",H2,[K(tt(Ht),{class:"af-toggle",checked:f.enabled,"onUpdate:checked":T=>f.enabled=T},{default:ft(()=>[...h[35]||(h[35]=[kt("Row enabled",-1)])]),_:1},8,["checked","onUpdate:checked"])]),$(f)?(F(),H("div",V2,[h[38]||(h[38]=w("strong",null,"Asset content",-1)),h[39]||(h[39]=w("details",{class:"af-format-help"},[w("summary",null,"Supported formats and file limits"),w("p",null,"Reads the first N selected assets in field order, up to the per-field limit below (1–20). Content support depends on the provider and model: JPEG, PNG, GIF, WebP, text/*, JSON, XML, and RTF are supported; PDFs are supported except with DeepSeek. Unsupported content stops the whole run. Each file is limited to 10 MiB, with a 20 MiB combined limit.")],-1)),w("div",q2,[K(tt(Ht),{class:"af-toggle",checked:f.assets.includeFile,"onUpdate:checked":T=>f.assets.includeFile=T},{default:ft(()=>[...h[36]||(h[36]=[kt("Include file content",-1)])]),_:1},8,["checked","onUpdate:checked"]),w("div",null,[K(tt(io),{class:"af-control",label:"Maximum assets",type:"number",min:"1",max:"20",value:f.assets.maxFiles,onInput:T=>U(f.assets,"maxFiles",T,!0)},null,8,["value","onInput"])])]),w("div",K2,[h[37]||(h[37]=w("span",{class:"af-label"},"Metadata",-1)),(F(!0),H(mt,null,ie(M.value,T=>(F(),Gt(tt(Ht),{key:T.key,class:"af-toggle",checked:f.assets.metadata.includes(T.key),"onUpdate:checked":J=>f.assets.metadata=J?[...new Set([...f.assets.metadata,T.key])]:f.assets.metadata.filter(Ct=>Ct!==T.key)},{default:ft(()=>[kt(nt(T.label),1)]),_:2},1032,["checked","onUpdate:checked"]))),128))])])):Z("",!0)])])],10,L2)]),_:1},8,["items"])],2),w("section",{class:ne(["af-card af-builder-panel",{"af-panel--active":o.value==="output"}]),id:"workflow-outputs",onClick:h[15]||(h[15]=f=>le("output"))},[w("div",W2,[w("h2",null,[w("button",{type:"button",class:"af-panel-tab","aria-expanded":o.value==="output",onClick:h[12]||(h[12]=f=>le("output"))},[h[41]||(h[41]=w("svg",{class:"af-role-icon",viewBox:"0 0 20 20",fill:"none",stroke:"currentColor","stroke-width":"1.5","aria-hidden":"true"},[w("path",{d:"m4 12 9-9 4 4-9 9-5 1 1-5Zm7-7 4 4M4 12l4 4"})],-1)),h[42]||(h[42]=kt("Output fields ",-1)),w("span",Y2,nt(c.rows.length),1)],8,G2),K(he,{label:"About output fields",text:"Choose the fields Autofill will write, then give each one instructions. Drag the handles to reorder fields. Review and replacement rules are under Advanced."})]),K(tt(Na),{variant:"secondary",disabled:!Et.value,onClick:ko},{default:ft(()=>[...h[43]||(h[43]=[kt("Add",-1)])]),_:1},8,["disabled"])]),Et.value?Z("",!0):(F(),H("p",X2,"Choose an entry type or asset volume in Basics to see its fields.")),K(Ba,{items:c.rows,locked:A.value,readonly:C.value,label:"output",onReorder:h[13]||(h[13]=(f,N)=>c.rows.splice(N,0,c.rows.splice(f,1)[0])),onRemove:h[14]||(h[14]=f=>c.rows.splice(f,1))},{default:ft(({row:f,index:N})=>[w("details",{class:ne(["af-output",{"af-output--disabled":!f.enabled,"af-field--error":ht(f.targetFieldUid),"af-field--attention":!ht(f.targetFieldUid)&&xt(f)}]),open:o.value==="output"&&zt.has(f)},[w("summary",{class:"af-output-summary",onClick:zi(T=>si("output",f),["prevent","stop"])},[It(f.targetFieldUid)?(F(),H("span",{key:0,class:"cp-icon medium af-field-type-icon","aria-hidden":"true",innerHTML:It(f.targetFieldUid)},null,8,Q2)):Z("",!0),w("span",tg,[w("strong",null,nt(lt(f.targetFieldUid,"Unassigned output field")),1),ht(f.targetFieldUid)?(F(),H("span",eg,"Unavailable")):xt(f)?(F(),H("span",og,"Needs instructions")):f.prompt?.trim()?(F(),H("span",ig,nt(f.prompt),1)):Z("",!0)])],8,Z2),w("fieldset",{class:"af-row-body",style:{border:"0",margin:"0","min-width":"0"},disabled:A.value.includes(f)},[A.value.includes(f)?(F(),H("p",sg,"Automatic output. You do not have permission to change this field.")):Z("",!0),ht(f.targetFieldUid)?(F(),H("p",rg,"This field is unavailable in the selected layout. Remove this card and add a replacement field.")):Z("",!0),w("div",ag,[K(tt(gs),{class:"af-control",label:"Instructions",value:f.prompt,rows:"2",placeholder:"For example, Write a concise product summary using only facts from the source information.",onInput:T=>U(f,"prompt",T)},null,8,["value","onInput"])]),!ht(f.targetFieldUid)&&xt(f)?(F(),H("p",lg,"Add instructions so Autofill knows what to write.")):Z("",!0),w("details",cg,[h[63]||(h[63]=w("summary",null,"Advanced",-1)),w("div",dg,[w("div",null,[w("span",ug,[w("label",{class:"af-label",for:`af-review-${N}`},"Apply suggestions",8,pg),K(he,{label:"About review requirements",text:"Review before applying lets an editor inspect and edit the suggestion. Automatic application saves eligible suggestions without opening the review dialog."})]),w("div",hg,[w("select",{id:`af-review-${N}`,value:f.requiresApproval?"review":"automatic",onChange:T=>f.requiresApproval=T.target.value==="review"},[h[44]||(h[44]=w("option",{value:"review"},"Review before applying",-1)),w("option",{value:"automatic",disabled:c.canConfigureAutomatic===!1},"Apply automatically",8,gg)],40,fg)])]),w("div",null,[w("span",mg,[w("label",{class:"af-label",for:`af-existing-${N}`},"Existing content",8,vg),K(he,{label:"About replacing existing content",text:"Only fill empty fields preserves existing content. Replace existing content allows an accepted or automatically applied suggestion to change it."})]),w("div",bg,[w("select",{id:`af-existing-${N}`,value:f.overrideCurrentValue?"replace":"empty",onChange:T=>f.overrideCurrentValue=T.target.value==="replace"},[...h[45]||(h[45]=[w("option",{value:"empty"},"Only fill empty fields",-1),w("option",{value:"replace"},"Replace existing content",-1)])],40,yg)])])]),w("div",kg,[w("div",wg,[K(tt(Ht),{class:"af-toggle",checked:f.includeCurrentFieldValue,"onUpdate:checked":T=>f.includeCurrentFieldValue=T},{default:ft(()=>[...h[46]||(h[46]=[kt("Use the current value as context",-1)])]),_:1},8,["checked","onUpdate:checked"]),K(he,{label:"About current values as context",text:"Includes this field's current content in the AI instructions. This is separate from whether Autofill may replace the value."})]),K(tt(Ht),{class:"af-toggle",checked:f.enabled,"onUpdate:checked":T=>f.enabled=T},{default:ft(()=>[...h[47]||(h[47]=[kt("Output enabled",-1)])]),_:1},8,["checked","onUpdate:checked"])]),g(f)?(F(),H("details",xg,[h[62]||(h[62]=w("summary",null,"Field-specific options",-1)),b(f.targetFieldUid)==="seomatic"?(F(),H("div",_g,[h[52]||(h[52]=w("strong",null,"SEO prompt includes",-1)),_(f.targetFieldUid).seoTitle?(F(),Gt(tt(Ht),{key:0,class:"af-toggle",checked:f.seomatic.includeSeoTitle,"onUpdate:checked":T=>f.seomatic.includeSeoTitle=T},{default:ft(()=>[...h[48]||(h[48]=[kt("SEO title and source",-1)])]),_:1},8,["checked","onUpdate:checked"])):Z("",!0),_(f.targetFieldUid).siteNamePosition?(F(),Gt(tt(Ht),{key:1,class:"af-toggle",checked:f.seomatic.includeSiteNamePosition,"onUpdate:checked":T=>f.seomatic.includeSiteNamePosition=T},{default:ft(()=>[...h[49]||(h[49]=[kt("Site name position and source",-1)])]),_:1},8,["checked","onUpdate:checked"])):Z("",!0),_(f.targetFieldUid).seoDescription?(F(),Gt(tt(Ht),{key:2,class:"af-toggle",checked:f.seomatic.includeSeoDescription,"onUpdate:checked":T=>f.seomatic.includeSeoDescription=T},{default:ft(()=>[...h[50]||(h[50]=[kt("SEO description and source",-1)])]),_:1},8,["checked","onUpdate:checked"])):Z("",!0),_(f.targetFieldUid).seoKeywords?(F(),Gt(tt(Ht),{key:3,class:"af-toggle",checked:f.seomatic.includeSeoKeywords,"onUpdate:checked":T=>f.seomatic.includeSeoKeywords=T},{default:ft(()=>[...h[51]||(h[51]=[kt("SEO keywords and source",-1)])]),_:1},8,["checked","onUpdate:checked"])):Z("",!0),Object.values(_(f.targetFieldUid)).some(Boolean)?Z("",!0):(F(),H("p",Sg,"Enable supported SEO sections in the SEOmatic field settings."))])):Z("",!0),z(f)?(F(),H("div",Eg,[w("label",null,[h[54]||(h[54]=w("span",{class:"af-label"},"Related selection",-1)),w("div",Cg,[Ce(w("select",{"onUpdate:modelValue":T=>f.related.mode=T},[...h[53]||(h[53]=[w("option",{value:"topN"},"Top N",-1),w("option",{value:"all"},"All",-1)])],8,Ag),[[xo,f.related.mode]])])]),f.related.mode==="topN"?(F(),H("div",$g,[K(tt(io),{class:"af-control",label:"Top N",type:"number",min:"1",max:"500",value:f.related.topN,onInput:T=>U(f.related,"topN",T,!0)},null,8,["value","onInput"])])):Z("",!0),K(tt(Ht),{class:"af-toggle",checked:f.related.forceUseCurrentValues,"onUpdate:checked":T=>f.related.forceUseCurrentValues=T},{default:ft(()=>[...h[55]||(h[55]=[kt("Keep selected related items first",-1)])]),_:1},8,["checked","onUpdate:checked"])])):Z("",!0),b(f.targetFieldUid)==="link"?(F(),H("div",Tg,[h[57]||(h[57]=w("strong",null,"Link candidate scope",-1)),(F(),H(mt,null,ie(["entry","category","asset"],T=>w("div",{key:T,class:"af-grid",style:{"margin-top":"12px"}},[w("label",null,[w("span",zg,nt(T)+" links",1),w("div",Pg,[Ce(w("select",{"onUpdate:modelValue":J=>f.link[T].mode=J},[...h[56]||(h[56]=[w("option",{value:"topN"},"Top N",-1),w("option",{value:"mostRecent"},"Most recent",-1),w("option",{value:"all"},"All",-1),w("option",{value:"none"},"None",-1)])],8,Mg),[[xo,f.link[T].mode]])])]),["all","none"].includes(f.link[T].mode)?Z("",!0):(F(),H("div",Lg,[K(tt(io),{class:"af-control",label:"Candidate count",type:"number",min:"1",max:"250",value:f.link[T].count,onInput:J=>U(f.link[T],"count",J,!0)},null,8,["value","onInput"])]))])),64))])):Z("",!0),b(f.targetFieldUid)==="assets"?(F(),H("div",Og,[h[60]||(h[60]=w("strong",null,"Asset context",-1)),h[61]||(h[61]=w("details",{class:"af-format-help"},[w("summary",null,"Supported formats and file limits"),w("p",null,"Reads the first N selected assets in field order, up to the per-field limit below (1–20). Content support depends on the provider and model: JPEG, PNG, GIF, WebP, text/*, JSON, XML, and RTF are supported; PDFs are supported except with DeepSeek. Unsupported content stops the whole run. Each file is limited to 10 MiB, with a 20 MiB combined limit.")],-1)),w("div",Rg,[K(tt(Ht),{class:"af-toggle",checked:f.assets.includeFile,"onUpdate:checked":T=>f.assets.includeFile=T},{default:ft(()=>[...h[58]||(h[58]=[kt("Include file content",-1)])]),_:1},8,["checked","onUpdate:checked"]),w("div",null,[K(tt(io),{class:"af-control",label:"Maximum assets",type:"number",min:"1",max:"20",value:f.assets.maxFiles,onInput:T=>U(f.assets,"maxFiles",T,!0)},null,8,["value","onInput"])])]),w("div",Ig,[h[59]||(h[59]=w("span",{class:"af-label"},"Metadata",-1)),(F(!0),H(mt,null,ie(M.value,T=>(F(),Gt(tt(Ht),{key:T.key,class:"af-toggle",checked:f.assets.metadata.includes(T.key),"onUpdate:checked":J=>f.assets.metadata=J?[...new Set([...f.assets.metadata,T.key])]:f.assets.metadata.filter(Ct=>Ct!==T.key)},{default:ft(()=>[kt(nt(T.label),1)]),_:2},1032,["checked","onUpdate:checked"]))),128))])])):Z("",!0)])):Z("",!0)])],8,ng)],10,J2)]),_:1},8,["items","locked","readonly"]),c.rows.length?Z("",!0):(F(),H("p",Dg,"Add an output field to tell Autofill what to write."))],2)],2),w("details",{class:"af-setup-details af-settings-disclosure af-advanced",open:!!q.value.handle},[h[67]||(h[67]=w("summary",null,"Advanced",-1)),w("div",Ng,[w("div",jg,[K(tt(Ht),{class:"af-toggle",checked:y.value,"onUpdate:checked":h[16]||(h[16]=f=>y.value=f)},{default:ft(()=>[kt(nt(c.scope==="entry"?"Show this workflow in the entry sidebar":"Show this workflow in the asset sidebar"),1)]),_:1},8,["checked"]),K(he,{label:"About sidebar placement",text:"Shows the workflow on matching content editors. It can also be attached to an inline Autofill field."})]),w("label",null,[w("span",Bg,[h[64]||(h[64]=w("span",{class:"af-label"},"Model",-1)),K(he,{label:"About workflow models",text:"Use the site’s default model or choose an enabled configuration from Autofill settings."})]),w("div",Ug,[Ce(w("select",{"onUpdate:modelValue":h[17]||(h[17]=f=>c.modelConfigUid=f)},[h[65]||(h[65]=w("option",{value:""},"Default model",-1)),(F(!0),H(mt,null,ie(tt(p).modelConfigs,f=>(F(),H("option",{key:f.uid,value:f.uid},nt(f.label||f.modelId||f.provider),9,Hg))),128))],512),[[xo,c.modelConfigUid]])])]),K(tt(io),{class:"af-control",label:"Action button label",value:c.actionButtonLabel,placeholder:"Autofill",onInput:h[18]||(h[18]=f=>U(c,"actionButtonLabel",f))},null,8,["value"]),w("div",null,[w("div",Vg,[h[66]||(h[66]=w("label",{class:"af-label",for:"af-workflow-handle"},"Handle",-1)),K(he,{label:"About workflow handles",text:"Autofill fields connect to this handle. Changing it can disconnect existing field references."})]),Ce(w("input",{id:"af-workflow-handle","onUpdate:modelValue":h[19]||(h[19]=f=>c.handle=f),class:"text fullwidth code",placeholder:"product-descriptions",autocomplete:"off"},null,512),[[pa,c.handle]]),E("handle")?(F(),H("span",qg,nt(E("handle")),1)):Z("",!0)])])],8,Fg),K(Z0,{open:i.value!==null,anchor:n.value,label:i.value==="context"?"Add context field":"Add output field",onClose:h[21]||(h[21]=f=>i.value=null),onShow:h[22]||(h[22]=f=>r.value?.focus()),onHidden:Ze},{default:ft(()=>[w("div",Kg,[w("div",Wg,[Ce(w("input",{ref_key:"fieldSearchInput",ref:r,"onUpdate:modelValue":h[20]||(h[20]=f=>s.value=f),class:"text fullwidth",type:"search","aria-label":"Search fields",placeholder:"Search",autocomplete:"off"},null,512),[[pa,s.value]])]),w("div",Gg,[(F(!0),H(mt,null,ie(Tt.value,f=>(F(),H("div",{key:f.label,class:"fld-field-group"},[w("h6",null,nt(f.label),1),(F(!0),H(mt,null,ie(f.fields,N=>(F(),H("button",{key:N.uid,type:"button",class:"fld-element fld-field af-native-field-choice",disabled:!!Q(N.uid),onClick:T=>Vi(N)},[N.iconSvg?(F(),H("span",{key:0,class:"cp-icon medium","aria-hidden":"true",innerHTML:N.iconSvg},null,8,Xg)):Z("",!0),w("span",Jg,[w("span",Zg,[w("h4",null,nt(N.name)+nt(i.value==="output"&&N.availableInLiteVersion===!1?" · Pro":""),1)]),Q(N.uid)||N.handle?(F(),H("span",Qg,[w("span",{class:ne(["smalltext light fld-attribute-label",{code:!Q(N.uid)}])},nt(Q(N.uid)||N.handle),3)])):Z("",!0)])],8,Yg))),128))]))),128)),et.value.length?Z("",!0):(F(),H("p",tm,nt(s.value?"No matching fields.":"No fields available for this content type."),1))])])]),_:1},8,["open","anchor","label"])],8,r2)],512))}});window.AutofillPluginKitDialog=n0;for(const e of document.querySelectorAll("[data-autofill-vue-root]")){const t=JSON.parse(e.dataset.options||"{}");kh({setup:()=>()=>fo(q0,{translationCategory:"autofill"},{default:()=>fo(em,{options:t})})}).mount(e)}
