(()=>{
const $=s=>document.querySelector(s),H=document.documentElement,
ar=()=>H.lang==="ar",
tr=s=>{
 if(!ar())return s;
 if(s.startsWith("Game Over: "))return "انتهت اللعبة: "+tr(s.slice(11));
 const numbers=s.match(/-?\d+/g)||[];let i=0;
 const translated=AR[s.replace(/-?\d+/g,"#")];
 return translated?translated.replace(/#/g,()=>numbers[i++]):s;
},
L=s=>ar()?AR[s]||s:s,
mk=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e},
fmt=(e,t)=>t.split(/\*([^*]+)\*/).forEach((p,i)=>e.append(i%2?mk("em","",p):p)),
para=(t,c)=>{const p=mk("p",c);fmt(p,t);return p},
btn=(t,f)=>{const b=mk("button","",t);b.onclick=f;return b},
best=()=>{try{return +localStorage.getItem("gd-best")||0}catch(e){return 0}},
keep=s=>{try{if(s>best())localStorage.setItem("gd-best",s)}catch(e){}},
img=a=>{const i=new Image();i.alt="";i.decoding="async";i.src=a+".webp";i.onerror=()=>i.remove();return i};
let q=[],art="",pg=null,name="";
const T=s=>tr(s).replace(/\{n\}/g,()=>name);

function hud(v){
 $("#hp").style.width=v.hp+"%";
 $("#hpn").textContent=v.hp+" / 100";
 $("#sc").textContent=v.score;
 $("#sp").textContent=L(["None yet","Aetheris Revertum (ready)","Aetheris Revertum (spent)"][v.spell]);
 const inv=$("#inv");
 inv.replaceChildren(...v.items.map(i=>{
  const li=mk("li");
  li.append(mk("b","",T(i[0])),mk("span","",T(i[1])));
  return li;
 }));
 if(!v.items.length)inv.append(mk("li","empty",L("Nothing yet.")));
}
function render(){
 const p=pg,v=p.v,b=$("#leaf");
 b.replaceChildren();b.className="right";
 if(p.k==="o"){
  v.pre.forEach(t=>b.append(para(T(t),"pre")));
  v.notes.forEach(t=>b.append(mk("p","note",T(t))));
  b.append(btn(L("Turn the page"),show));
 }else{
  b.classList.add("scn");
  v.text.forEach(t=>b.append(para(T(t))));
  const c=mk("div","choices");
  v.choices.forEach((t,i)=>c.append(btn(T(t),()=>draw(Game.pick(i)))));
  b.append(c);
 }
 void b.offsetWidth;
 b.classList.add("flip");
 (b.querySelector("button")||b).focus({preventScroll:true});
}
function show(){pg=q.shift();render()}
function draw(v){
 name=v.name;hud(v);
 if(art!==v.art){art=v.art;$("#art").replaceChildren(img(art))}
 q=[];
 if(v.pre.length||v.notes.length)q.push({k:"o",v});
 q.push({k:"s",v});
 show();
 if(v.id==="over"||v.id==="win")keep(v.score);
 $("#best").textContent=best();
 window.scrollTo(0,0);
}
function lang(l){
 H.lang=l;H.dir=l==="ar"?"rtl":"ltr";
 try{localStorage.setItem("gd-lang",l)}catch(e){}
 document.querySelectorAll("[data-t]").forEach(e=>{
  e.dataset.en=e.dataset.en||e.textContent;
  e.textContent=L(e.dataset.en);
 });
 document.querySelectorAll(".lang-toggle").forEach(b=>{
  b.textContent=l==="ar"?"English":"العربية";
  b.setAttribute("aria-label",l==="ar"?"Switch to English":"التبديل إلى العربية");
  b.setAttribute("title",l==="ar"?"Switch to English":"التبديل إلى العربية");
 });
 $("#n").placeholder=L("Adventurer");
 $("#bestland").textContent=best()?tr("Best score: "+best()):"";
 if(pg){hud(pg.v);render()}
}
$("#land-art").append(img("forest"));
$("#f").onsubmit=e=>{
 e.preventDefault();
 $("#land").hidden=true;$("#game").hidden=false;
 draw(Game.start($("#n").value||L("Adventurer")));
};
document.querySelectorAll(".lang-toggle").forEach(b=>{
 b.addEventListener("click",()=>lang(ar()?"en":"ar"));
});
addEventListener("keydown",e=>{
 const b=document.querySelectorAll("#leaf button")[+e.key-1];
 if(b&&e.target.tagName!=="INPUT")b.click();
});
let saved=null;
try{saved=localStorage.getItem("gd-lang")}catch(e){}
lang(saved||((navigator.language||"").toLowerCase().startsWith("ar")?"ar":"en"));
})();