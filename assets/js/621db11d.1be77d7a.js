"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4212],{8071:(t,e,s)=>{s.r(e),s.d(e,{default:()=>m});s(7378);var a=s(3372),r=s(7517),o=s(1712),l=s(5354),u=s(9806),n=s(4063),i=s(8199),c=s(6229);const h={authorListItem:"authorListItem_DfOI"};var g=s(6106);function p(t){let{author:e}=t;return(0,g.jsx)("li",{className:h.authorListItem,children:(0,g.jsx)(c.A,{as:"h2",author:e,count:e.count})})}function d(t){let{authors:e}=t;return(0,g.jsx)("section",{className:(0,a.A)("margin-vert--lg",h.authorsListSection),children:(0,g.jsx)("ul",{children:e.map((t=>(0,g.jsx)(p,{author:t},t.key)))})})}function m(t){let{authors:e,sidebar:s}=t;const c=(0,l.uz)();return(0,g.jsxs)(r.e3,{className:(0,a.A)(o.G.wrapper.blogPages,o.G.page.blogAuthorsListPage),children:[(0,g.jsx)(r.be,{title:c}),(0,g.jsx)(n.A,{tag:"blog_authors_list"}),(0,g.jsxs)(u.A,{sidebar:s,children:[(0,g.jsx)(i.A,{as:"h1",children:c}),(0,g.jsx)(d,{authors:e})]})]})}},5354:(t,e,s)=>{s.d(e,{ZD:()=>l,uz:()=>u});s(7378);var a=s(428),r=s(3258);s(6106);function o(){const{selectMessage:t}=(0,r.W)();return e=>t(e,(0,a.T)({id:"theme.blog.post.plurals",description:'Pluralized label for "{count} posts". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One post|{count} posts"},{count:e}))}function l(t){const e=o();return(0,a.T)({id:"theme.blog.tagTitle",description:"The title of the page for a blog tag",message:'{nPosts} tagged with "{tagName}"'},{nPosts:e(t.count),tagName:t.label})}const u=()=>(0,a.T)({id:"theme.blog.authorsList.pageTitle",message:"Authors",description:"The title of the authors page"})}}]);