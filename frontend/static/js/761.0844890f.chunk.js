"use strict";(self.webpackChunkdavid_project=self.webpackChunkdavid_project||[]).push([[761],{5761:function(e,t,n){n.r(t),n.d(t,{default:function(){return N}});var a=n(8214),r=n(5861),s=n(1413),c=n(885),i=n(2791),o=n(5048),l=n(8182),d=(n(2426),n(4554)),u=n(6151),f=n(6409),p=n(1795),h=n(7831),x=n(890),m=n(7630),g=n(703),Z=n(5519),b=n(184),j=(0,m.ZP)(g.Z)((function(e){return{height:350,width:550,borderWidth:2,borderRadius:10,borderStyle:"dashed",borderColor:e.theme.palette.secondary.main,display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:Z.Z[200]}})),v=(0,m.ZP)(x.Z)((function(e){var t=e.theme;return{color:t.palette.text.secondary,fontWeight:"500",fontSize:t.spacing(2.2),fontStyle:"italic"}})),k=function(e){var t=e.data,n=e.name,a=e.onChange,r=e.placeholder,c=e.disabled,u=((0,o.I0)(),(0,i.useCallback)((function(e){if(e.length>0){var t=e[0];a(t)}}),[a])),f=(0,h.uI)({onDrop:u}),p=f.getRootProps,x=f.getInputProps,m=(0,i.useMemo)((function(){return t?(0,b.jsxs)(d.Z,{className:(0,l.Z)("full-width"),sx:{paddingLeft:1,paddingRight:1},children:[(0,b.jsx)(v,{children:r}),(0,b.jsx)(v,{sx:{color:function(e){return e.palette.secondary.main},paddingTop:function(e){return e.spacing(1)},fontWeight:"bold"},className:(0,l.Z)("ellipsis"),children:n})]}):(0,b.jsx)(v,{children:r})}),[t]);return(0,b.jsx)("div",{style:{textAlign:"center"},children:(0,b.jsx)(d.Z,{children:(0,b.jsxs)(j,(0,s.Z)((0,s.Z)({elevation:0},p()),{},{children:[(0,b.jsx)("input",(0,s.Z)({disabled:c},x())),m]}))})})};k.defaultProps={data:"",onChange:function(){},placeholder:"Drop New Image",loading:!1,disabled:!1};var C=(0,i.memo)(k),w=n(4390),y=n(1322),A=n(7343),I=function(){var e=(0,i.useState)({file:null,name:""}),t=(0,c.Z)(e,2),n=t[0],h=t[1],x=(0,o.I0)(),m=(0,i.useCallback)((function(e){e&&h((function(t){return(0,s.Z)((0,s.Z)({},t),{},{file:e,name:e.name})}))}),[]),g=(0,i.useCallback)((0,r.Z)((0,a.Z)().mark((function e(){var t,r,s,c,i,o,l;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(x((0,f.qA)(!0)),t=n.file,e.prev=2,!t){e.next=26;break}return e.next=6,w.N(t);case 6:if(r=e.sent,s=r.data,c=s.error,i=s.products,o=s.locations,x((0,f.qA)(!1)),!c){e.next=14;break}x((0,f.MA)({status:!1,message:c})),e.next=26;break;case 14:return l=(0,A.Z)({products:i,locations:o}),e.next=17,y.fZ("products");case 17:return e.next=19,y.fZ("fcs");case 19:return e.next=21,y.$W("products",l.products);case 21:return e.next=23,y.$W("fcs",l.fcs);case 23:x((0,f.RU)(l.products)),x((0,f._5)(l.fcs)),x((0,f.MA)({status:!0,message:"Database has been updated!"}));case 26:e.next=32;break;case 28:e.prev=28,e.t0=e.catch(2),x((0,f.qA)(!1)),x((0,f.MA)({status:!1,message:e.t0.message}));case 32:case"end":return e.stop()}}),e,null,[[2,28]])}))),[n]);return(0,b.jsx)(b.Fragment,{children:(0,b.jsx)(p.Z,{children:(0,b.jsx)(d.Z,{className:(0,l.Z)("flex","justify-center","flex-grow"),children:(0,b.jsxs)(d.Z,{children:[(0,b.jsx)(C,{name:n.name,data:n.file,placeholder:"Drop New Database",onChange:m}),(0,b.jsx)(u.Z,{variant:"contained",disabled:!n.file,sx:{width:"100%",mt:3},onClick:g,children:"Update"})]})})})})},N=(0,i.memo)(I)}}]);
//# sourceMappingURL=761.0844890f.chunk.js.map