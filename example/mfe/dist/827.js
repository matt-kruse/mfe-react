"use strict";(self.webpackChunk_mfe_react_mfe=self.webpackChunk_mfe_react_mfe||[]).push([[827,183],{827:(e,o,n)=>{n.r(o),n.d(o,{default:()=>m});var t=n(117),l=n(661),u=n(917),r=n(183);let c=null,s=null;const m={mount:({domElement:e,...o})=>{console.log("Vue component props:"),console.log("Vue",o),s=(0,t.qj)(o),c=(0,l.ri)({render:()=>(0,u.h)(r.default,s)}),c.mount(e)},unmount:()=>{console.log("Unmounting Vue"),c&&(console.log("app exists"),c.unmount())},update:({domElement:e,...o})=>{console.log("VUE UPDATE!"),console.log("Vue",o);for(let e in o)console.log("Vue",e),s[e]=o[e];console.log("VUE UPDATE COMPLETE")}}},183:(e,o,n)=>{n.r(o),n.d(o,{default:()=>m});var t=n(917),l=n(319),u=n(117);const r={style:{color:"green","font-weight":"bold"}},c=(0,t._)("div",null,"Even a component in a different framework can share methods through props!",-1),s=["onClick"],m={name:"VueComponent",props:["count","increment"],setup(e){const o=e;return(e,n)=>((0,t.wg)(),(0,t.iD)(t.HY,null,[(0,t._)("div",r,(0,l.zw)((0,u.SU)("This output is generated from a Vue component!"))+" Count: "+(0,l.zw)(o.count),1),c,(0,t._)("button",{onClick:o.increment},"Increment Counter",8,s)],64))}}}}]);