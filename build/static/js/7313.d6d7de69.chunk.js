"use strict";(self.webpackChunkcaa_client=self.webpackChunkcaa_client||[]).push([[7313],{46504:function(e,r,n){n.r(r),n.d(r,{default:function(){return f}});var t=n(53767),a=n(20890),i=n(58069),o=n(16386),s=n(72791),c=n(11087),l=n(48367),d=n(24452),u=n(80184);function f(){var e=(0,l.TL)(),r=(0,l.CG)((function(e){return e.UI.tokenInfo})),n=(0,l.CG)((function(e){return e.FormAnswer.status})),f=(0,l.CG)((function(e){return e.FormAnswer.list}));return(0,s.useEffect)((function(){"init"===n&&e((0,d.Zr)())}),[]),r&&f?(0,u.jsxs)(t.Z,{gap:2,children:[(0,u.jsx)(t.Z,{direction:"row",alignItems:"center",justifyContent:"space-between",gap:2,sx:{},children:(0,u.jsx)(a.Z,{sx:{fontWeight:600},variant:"h5",children:"\u30d5\u30a9\u30fc\u30e0\u56de\u7b54\u4e00\u89a7"})}),(0,u.jsx)(i._,{rows:f,columns:[{field:"name",headerName:"\u30d5\u30a9\u30fc\u30e0\u540d",flex:1,renderCell:function(e){return(0,u.jsx)(c.rU,{to:"/form-answer/".concat(e.row.formId),children:(0,u.jsx)(a.Z,{variant:"caption",mr:1,children:e.row.formName})})}},{field:"count",headerName:"\u56de\u7b54\u6570",width:70,align:"center",renderCell:function(e){return(0,u.jsx)(a.Z,{variant:"caption",mr:1,children:e.row.answers.length})}},{field:"start",headerName:"\u958b\u59cb\u65e5",width:120,renderCell:function(e){return(0,u.jsx)(a.Z,{variant:"caption",mr:1,children:e.row.startDate?(0,o.Z)(new Date(e.row.startDate),"yyyy\u5e74MM\u6708dd\u65e5"):"--"})}},{field:"end",headerName:"\u7d42\u4e86\u65e5",width:120,renderCell:function(e){return(0,u.jsx)(a.Z,{variant:"caption",mr:1,children:e.row.startDate?(0,o.Z)(new Date(e.row.startDate),"yyyy\u5e74MM\u6708dd\u65e5"):"--"})}}],initialState:{pagination:{paginationModel:{page:0,pageSize:10}}},getRowId:function(e){return e.formId},pageSizeOptions:[10,20,30,50],sx:{"& .MuiDataGrid-cell:focus":{outline:"none"},"& .MuiDataGrid-cell:focus-within":{outline:"none"},"& .MuiDataGrid-cell:hover":{},"& .MuiDataGrid-columnHeaders":{bgcolor:"primary.dark",color:"#fff"},"& .MuiDataGrid-columnHeaders svg":{color:"#fff"}},density:"compact",hideFooterSelectedRowCount:!0,disableColumnMenu:!0,disableRowSelectionOnClick:!0})]}):null}},13239:function(e,r,n){n.d(r,{Z:function(){return I}});var t=n(30168),a=n(63366),i=n(87462),o=n(72791),s=n(28182),c=n(94419),l=n(52554),d=n(14036),u=n(31402),f=n(66934),h=n(75878),v=n(21217);function m(e){return(0,v.Z)("MuiCircularProgress",e)}(0,h.Z)("MuiCircularProgress",["root","determinate","indeterminate","colorPrimary","colorSecondary","svg","circle","circleDeterminate","circleIndeterminate","circleDisableShrink"]);var w,p,k,Z,g,x,y,S,C=n(80184),D=["className","color","disableShrink","size","style","thickness","value","variant"],M=44,b=(0,l.F4)(g||(g=w||(w=(0,t.Z)(["\n  0% {\n    transform: rotate(0deg);\n  }\n\n  100% {\n    transform: rotate(360deg);\n  }\n"])))),j=(0,l.F4)(x||(x=p||(p=(0,t.Z)(["\n  0% {\n    stroke-dasharray: 1px, 200px;\n    stroke-dashoffset: 0;\n  }\n\n  50% {\n    stroke-dasharray: 100px, 200px;\n    stroke-dashoffset: -15px;\n  }\n\n  100% {\n    stroke-dasharray: 100px, 200px;\n    stroke-dashoffset: -125px;\n  }\n"])))),P=(0,f.ZP)("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:function(e,r){var n=e.ownerState;return[r.root,r[n.variant],r["color".concat((0,d.Z)(n.color))]]}})((function(e){var r=e.ownerState,n=e.theme;return(0,i.Z)({display:"inline-block"},"determinate"===r.variant&&{transition:n.transitions.create("transform")},"inherit"!==r.color&&{color:(n.vars||n).palette[r.color].main})}),(function(e){return"indeterminate"===e.ownerState.variant&&(0,l.iv)(y||(y=k||(k=(0,t.Z)(["\n      animation: "," 1.4s linear infinite;\n    "]))),b)})),N=(0,f.ZP)("svg",{name:"MuiCircularProgress",slot:"Svg",overridesResolver:function(e,r){return r.svg}})({display:"block"}),G=(0,f.ZP)("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:function(e,r){var n=e.ownerState;return[r.circle,r["circle".concat((0,d.Z)(n.variant))],n.disableShrink&&r.circleDisableShrink]}})((function(e){var r=e.ownerState,n=e.theme;return(0,i.Z)({stroke:"currentColor"},"determinate"===r.variant&&{transition:n.transitions.create("stroke-dashoffset")},"indeterminate"===r.variant&&{strokeDasharray:"80px, 200px",strokeDashoffset:0})}),(function(e){var r=e.ownerState;return"indeterminate"===r.variant&&!r.disableShrink&&(0,l.iv)(S||(S=Z||(Z=(0,t.Z)(["\n      animation: "," 1.4s ease-in-out infinite;\n    "]))),j)})),I=o.forwardRef((function(e,r){var n=(0,u.Z)({props:e,name:"MuiCircularProgress"}),t=n.className,o=n.color,l=void 0===o?"primary":o,f=n.disableShrink,h=void 0!==f&&f,v=n.size,w=void 0===v?40:v,p=n.style,k=n.thickness,Z=void 0===k?3.6:k,g=n.value,x=void 0===g?0:g,y=n.variant,S=void 0===y?"indeterminate":y,b=(0,a.Z)(n,D),j=(0,i.Z)({},n,{color:l,disableShrink:h,size:w,thickness:Z,value:x,variant:S}),I=function(e){var r=e.classes,n=e.variant,t=e.color,a=e.disableShrink,i={root:["root",n,"color".concat((0,d.Z)(t))],svg:["svg"],circle:["circle","circle".concat((0,d.Z)(n)),a&&"circleDisableShrink"]};return(0,c.Z)(i,m,r)}(j),R={},F={},z={};if("determinate"===S){var _=2*Math.PI*((M-Z)/2);R.strokeDasharray=_.toFixed(3),z["aria-valuenow"]=Math.round(x),R.strokeDashoffset="".concat(((100-x)/100*_).toFixed(3),"px"),F.transform="rotate(-90deg)"}return(0,C.jsx)(P,(0,i.Z)({className:(0,s.Z)(I.root,t),style:(0,i.Z)({width:w,height:w},F,p),ownerState:j,ref:r,role:"progressbar"},z,b,{children:(0,C.jsx)(N,{className:I.svg,ownerState:j,viewBox:"".concat(22," ").concat(22," ").concat(M," ").concat(M),children:(0,C.jsx)(G,{className:I.circle,style:R,ownerState:j,cx:M,cy:M,r:(M-Z)/2,fill:"none",strokeWidth:Z})})}))}))}}]);
//# sourceMappingURL=7313.d6d7de69.chunk.js.map