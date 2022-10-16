import{c as L,h as x,a as W}from"./render.cf6875de.js";import{h as c,j as g,g as B,w as E,l as I,n as C,p as M,r as S,P as R,W as j}from"./index.d7c3f1b2.js";import{u as P,a as Q}from"./selection.687137dd.js";import{v as N,g as U,c as V,u as $,b as D}from"./QBtn.783c58cb.js";var z=L({name:"QItemLabel",props:{overline:Boolean,caption:Boolean,header:Boolean,lines:[Number,String]},setup(e,{slots:l}){const o=c(()=>parseInt(e.lines,10)),n=c(()=>"q-item__label"+(e.overline===!0?" q-item__label--overline text-overline":"")+(e.caption===!0?" q-item__label--caption text-caption":"")+(e.header===!0?" q-item__label--header":"")+(o.value===1?" ellipsis":"")),d=c(()=>e.lines!==void 0&&o.value>1?{overflow:"hidden",display:"-webkit-box","-webkit-box-orient":"vertical","-webkit-line-clamp":o.value}:null);return()=>g("div",{style:d.value,class:n.value},x(l.default))}}),X=L({name:"QList",props:{...P,bordered:Boolean,dense:Boolean,separator:Boolean,padding:Boolean},setup(e,{slots:l}){const o=B(),n=Q(e,o.proxy.$q),d=c(()=>"q-list"+(e.bordered===!0?" q-list--bordered":"")+(e.dense===!0?" q-list--dense":"")+(e.separator===!0?" q-list--separator":"")+(n.value===!0?" q-list--dark":"")+(e.padding===!0?" q-list--padding":""));return()=>g("div",{class:d.value},x(l.default))}});const Y={modelValue:{type:Boolean,default:null},"onUpdate:modelValue":[Function,Array]},G=["before-show","show","before-hide","hide"];function J({showing:e,canShow:l,hideOnRouteChange:o,handleShow:n,handleHide:d,processOnMount:_}){const b=B(),{props:i,emit:u,proxy:p}=b;let s;function v(t){e.value===!0?r(t):m(t)}function m(t){if(i.disable===!0||t!==void 0&&t.qAnchorHandled===!0||l!==void 0&&l(t)!==!0)return;const f=i["onUpdate:modelValue"]!==void 0;f===!0&&(u("update:modelValue",!0),s=t,C(()=>{s===t&&(s=void 0)})),(i.modelValue===null||f===!1)&&h(t)}function h(t){e.value!==!0&&(e.value=!0,u("before-show",t),n!==void 0?n(t):u("show",t))}function r(t){if(i.disable===!0)return;const f=i["onUpdate:modelValue"]!==void 0;f===!0&&(u("update:modelValue",!1),s=t,C(()=>{s===t&&(s=void 0)})),(i.modelValue===null||f===!1)&&w(t)}function w(t){e.value!==!1&&(e.value=!1,u("before-hide",t),d!==void 0?d(t):u("hide",t))}function q(t){i.disable===!0&&t===!0?i["onUpdate:modelValue"]!==void 0&&u("update:modelValue",!1):t===!0!==e.value&&(t===!0?h:w)(s)}E(()=>i.modelValue,q),o!==void 0&&N(b)===!0&&E(()=>p.$route.fullPath,()=>{o.value===!0&&e.value===!0&&r()}),_===!0&&I(()=>{q(i.modelValue)});const y={show:m,hide:r,toggle:v};return Object.assign(p,y),y}const H=[null,document,document.body,document.scrollingElement,document.documentElement];function Z(e,l){let o=U(l);if(o===void 0){if(e==null)return window;o=e.closest(".scroll,.scroll-y,.overflow-auto")}return H.includes(o)?window:o}function ee(e){return e===window?window.pageYOffset||window.scrollY||document.body.scrollTop||0:e.scrollTop}function te(e){return e===window?window.pageXOffset||window.scrollX||document.body.scrollLeft||0:e.scrollLeft}let k;function le(){if(k!==void 0)return k;const e=document.createElement("p"),l=document.createElement("div");V(e,{width:"100%",height:"200px"}),V(l,{position:"absolute",top:"0px",left:"0px",visibility:"hidden",width:"200px",height:"150px",overflow:"hidden"}),l.appendChild(e),document.body.appendChild(l);const o=e.offsetWidth;l.style.overflow="scroll";let n=e.offsetWidth;return o===n&&(n=l.clientWidth),l.remove(),k=o-n,k}function oe(e,l=!0){return!e||e.nodeType!==Node.ELEMENT_NODE?!1:l?e.scrollHeight>e.clientHeight&&(e.classList.contains("scroll")||e.classList.contains("overflow-auto")||["auto","scroll"].includes(window.getComputedStyle(e)["overflow-y"])):e.scrollWidth>e.clientWidth&&(e.classList.contains("scroll")||e.classList.contains("overflow-auto")||["auto","scroll"].includes(window.getComputedStyle(e)["overflow-x"]))}function ae(){let e;return M(()=>{clearTimeout(e)}),{registerTimeout(l,o){clearTimeout(e),e=setTimeout(l,o)},removeTimeout(){clearTimeout(e)}}}var ne=L({name:"QItemSection",props:{avatar:Boolean,thumbnail:Boolean,side:Boolean,top:Boolean,noWrap:Boolean},setup(e,{slots:l}){const o=c(()=>`q-item__section column q-item__section--${e.avatar===!0||e.side===!0||e.thumbnail===!0?"side":"main"}`+(e.top===!0?" q-item__section--top justify-start":" justify-center")+(e.avatar===!0?" q-item__section--avatar":"")+(e.thumbnail===!0?" q-item__section--thumbnail":"")+(e.noWrap===!0?" q-item__section--nowrap":""));return()=>g("div",{class:o.value},x(l.default))}}),ie=L({name:"QItem",props:{...P,...$,tag:{type:String,default:"div"},active:{type:Boolean,default:null},clickable:Boolean,dense:Boolean,insetLevel:Number,tabindex:[String,Number],focused:Boolean,manualFocus:Boolean},emits:["click","keyup"],setup(e,{slots:l,emit:o}){const{proxy:{$q:n}}=B(),d=Q(e,n),{hasRouterLink:_,hasLink:b,linkProps:i,linkClass:u,linkTag:p,navigateToRouterLink:s}=D(),v=S(null),m=S(null),h=c(()=>e.clickable===!0||b.value===!0||e.tag==="label"),r=c(()=>e.disable!==!0&&h.value===!0),w=c(()=>"q-item q-item-type row no-wrap"+(e.dense===!0?" q-item--dense":"")+(d.value===!0?" q-item--dark":"")+(b.value===!0&&e.active===null?u.value:e.active===!0?`${e.activeClass!==void 0?` ${e.activeClass}`:""} q-item--active`:"")+(e.disable===!0?" disabled":"")+(r.value===!0?" q-item--clickable q-link cursor-pointer "+(e.manualFocus===!0?"q-manual-focusable":"q-focusable q-hoverable")+(e.focused===!0?" q-manual-focusable--focused":""):"")),q=c(()=>{if(e.insetLevel===void 0)return null;const a=n.lang.rtl===!0?"Right":"Left";return{["padding"+a]:16+e.insetLevel*56+"px"}});function y(a){r.value===!0&&(m.value!==null&&(a.qKeyEvent!==!0&&document.activeElement===v.value?m.value.focus():document.activeElement===m.value&&v.value.focus()),_.value===!0&&s(a),o("click",a))}function t(a){if(r.value===!0&&R(a,13)===!0){j(a),a.qKeyEvent=!0;const T=new MouseEvent("click",a);T.qKeyEvent=!0,v.value.dispatchEvent(T)}o("keyup",a)}function f(){const a=W(l.default,[]);return r.value===!0&&a.unshift(g("div",{class:"q-focus-helper",tabindex:-1,ref:m})),a}return()=>{const a={ref:v,class:w.value,style:q.value,onClick:y,onKeyup:t};return r.value===!0?(a.tabindex=e.tabindex||"0",Object.assign(a,i.value)):h.value===!0&&(a["aria-disabled"]="true"),g(p.value,a,f())}}});export{ne as Q,G as a,ae as b,J as c,ee as d,te as e,le as f,Z as g,z as h,ie as i,X as j,oe as k,Y as u};