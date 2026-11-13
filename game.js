/* The Golden Dragon — game engine (pure logic, no DOM). Port of Adventure_Game.py. */
const Game=(()=>{
let S,rnd=Math.random;
const fresh=n=>({name:n,hp:100,score:0,key:false,spell:false,spellUsed:false,mirror:false,items:[],pre:[],notes:[],end:"",revHp:100,id:"intro"});
const N=()=>S.name,L=(...a)=>S.pre.push(...a),
pts=(n,m)=>{S.score+=n;S.notes.push(`You ${n<0?"lost "+-n:"earned "+n} points ${m}`)},
add=(k,d)=>{S.items.some(i=>i[0]==k)||S.items.push([k,d])},
over=(m,hb)=>{S.end=m;S.revHp=hb??S.hp;S.hp=Math.max(0,S.hp);return"over"},
cont=()=>L(`{n} continues on the journey with newfound strength or resources.`),
wrong=()=>{const b=S.hp;pts(-20,"for your choice");S.hp-=50;
 if(S.hp<=0){L("You’ve been hit by an arrow again.","I warned you to choose wisely.");return over("The gate remains closed. You are trapped by the curse.",b)}
 L("An arrow has struck you.",`Your health now is : ${S.hp}`,"You have another try.","Don’t waste it or else....");return"gate"};
const T={
intro:{art:"forest",t:()=>["Long ago, before the kingdoms of men and elves,","there was a forest cursed by betrayal and blood magic.","They called it *Velmora*, where the trees whisper names and the winds remember every lie.",`{n}, your journey begins where others have vanished... at the very edge of the Cursed Forest.`,"A tale waits to be written. Will yours be of glory... or regret?"],ch:[["Begin the journey",()=>"entrance"]]},
entrance:{art:"forest",t:()=>[`{n}, a brave adventurer, stood at the edge of the Cursed Forest.`,"Legends speak of a golden dragon and treasure hidden deep inside.","The path ahead splits into two:"],ch:[
 ["A broken trail, dangerous but direct.",()=>{pts(10,"for your bravery!");L("You carefully follow the broken trail...");return"wolf"}],
 ["A river route, calmer but less certain.",()=>{pts(20,"for your carefulness!");L("You venture into the mist along the river...");return"river"}]]},
wolf:{art:"wolf",t:()=>["A black wolf with red glowing eyes emerges from the mist.","Its breath fogs the air like smoke from a dying fire, and its growl sounds almost... human."],ch:[
 ["Attack directly.",()=>{L("You charge at the wolf!");
  if(rnd()<.5){L("You defeat the wolf but receive a scar that glows ominously...");S.hp-=30;pts(5,"for your choice");L(`You now have ${S.hp} health.`)}
  else{S.hp-=60;pts(-10,"because of your haste");if(S.hp<=0)return over("The wolf bites deeply. You fall.");L(`You are badly hurt. Health now: ${S.hp}`)}
  return"echo"}],
 ["Hide and wait.",()=>{pts(20,"for your thinking!");L("You wait patiently, then strike! The wolf is defeated without harm.");return"echo"}]]},
river:{art:"river",t:()=>["You follow the river. The air grows colder.","The mist thickens, and from it glides a figure of water and light — a river spirit.","She speaks not with words but memories — your memories.","She reaches into your soul and asks, without sound: ‘What will you give?’"],ch:[
 ["Offer something dear to you — a memory you love, perhaps.",()=>{pts(5,"for your choice");L("You give a precious memory. The spirit lets you pass.",`You feel the loss of your memory, {n}. A piece of you is gone, but you press on.`);add("Lost memory","A piece of you is gone, but you press on.");return"echo"}],
 ["Step back and refuse.",()=>{pts(-10,"for your choice");return over("The spirit pulls you into the water. You vanish.")}]]},
echo:{art:"echo",t:()=>["As you walk, you hear a mysterious echo behind you."],ch:[
 ["Follow the echo.",()=>{pts(10,"for your choice");return"cave"}],
 ["Ignore and continue to the temple.",()=>"gate"]]},
cave:{art:"cave",t:()=>["You find a hidden cave.","The cave hums with forgotten magic. Walls shimmer with runes in a language you almost remember.","A deep voice echoes, not from around you, but inside your skull:","I speak without a mouth... and hear without ears... What am I?"],ch:[
 ["An echo",()=>{L("The wall opens, revealing a glowing shield, a glowing scroll, and a carved key!","You have obtained the Aetheric Shield, the one-time spell ‘Aetheris Revertum’, and a Temple Key.");S.key=S.spell=true;
  add("Aetheric Shield","A glowing shield from the cave wall.");add("Temple Key","A carved key. Opens the temple gate.");pts(20,"for your correct answer!");return"gate"}],
 ["A shadow",()=>{pts(-10,"for your choice");return over("The cave collapses, trapping you inside.")}],
 ["Look into the Mirror of Secrets",()=>{if(S.mirror){L("The mirror has already revealed its secrets.");return"cave"}
  S.mirror=true;pts(20,"for your choice");L("You gaze into the Mirror of Secrets...","A vision appears: You see a gate and hear the word ‘egg’ echoing in your mind.","The mirror darkens. It can show no more.");add("Vision of the gate","The word ‘egg’ echoes in your mind.");return"cave"}],
 ["Entering and passing through the side corridor",()=>{L(`{n} Alright, you barely escaped from it.`);pts(15,"for your choice");return"corridor"}]]},
corridor:{art:"corridor",t:()=>["After entering the corridor, you find yourself in a place where the walls are covered with strange carvings and symbols.","As you move deeper, you feel a strange energy surrounding you, and you discover two paths ahead:"],ch:[
 ["A narrow passage, filled with glowing crystals.",()=>{L(`You carefully move through the crystal passage, {n}. The crystals give off a faint glow.`,"You find a hidden artifact in the cave: a powerful amulet that boosts your strength!",`You now possess the powerful amulet, {n}. Your strength is greatly increased!`,"The amulet glows with an ancient energy as you continue deeper into the cave.");
  add("Amulet of Strength","A powerful amulet from the crystal passage.");pts(15,"for your choice");cont();return"gate"}],
 ["A dark tunnel, ominous and silent.",()=>{L(`You step into the dark tunnel, {n}. Suddenly, a strange creature emerges!`,"You must decide whether to fight or flee!");return"creature"}]]},
creature:{art:"tunnel",t:()=>[`A strange creature emerges from the shadows, {n}. It has glowing eyes and sharp claws!`],ch:[
 ["Fight the creature.",()=>{if(rnd()<.5){L(`You bravely fight the creature and defeat it, {n}!`,"You find a treasure chest hidden in the tunnel. Inside, there’s a magical potion!");pts(20,"for your choice");
   L(`You have found a magical potion, {n}. It will heal you and restore your energy!`);S.hp=100;pts(10,"for your choice");L("Now your health is 100")}
  else L(`You narrowly escape the creature, {n}, and find a safe passage out of the tunnel.`);cont();return"gate"}],
 ["Try to escape.",()=>{L(`You quickly flee from the creature, {n}, and find yourself at the cave’s exit.`,"But your score will decrease:");pts(-5,"for your choice");cont();return"gate"}]]},
gate:{art:"gate",t:()=>["You arrive at an ancient stone gate and you go on ......","You find yourself inside a dilapidated place","There’s a strange sound coming from an unknown source, saying: Solve this riddle","I’m whole until you break me. Then I am no more if you used me. What am I?"],ch:[
 ["A stone",wrong],
 ["An egg",()=>{pts(30,"for your correct answer");L("Correct! The gate creaks open.");return"hall"}],
 ["An apple",wrong],
 ["Use Temple Key",()=>{if(S.key){L("You insert the carved key. The gate opens with a magical hum.");return"hall"}L("You have no key. The gate remains locked.","Choose an answer.");return"gate"}]]},
hall:{art:"hall",t:()=>["You arrive at the Golden Hall.","The Hall of Gold is silent — almost too silent.","A golden dragon watches with ancient eyes. It does not move. It does not need to.","There is also an old, worn-out box with a rough appearance.","A voice stirs in your mind, not from the dragon, but the very gold around you.","It whispers: ‘Greed speaks louder than wisdom. Choose.’"],ch:[
 ["Take the gold.",()=>{pts(-30,"for your greed");return over("The dragon awakens in fury and engulfs you in flame.")}],
 ["Open the chest.",()=>{pts(30,"for your wisdom");add("Dragon Ring","A ring marked with a dragon.");return"win"}]]},
over:{art:"over",t:()=>[`Game Over: ${S.end}`,`Your final score: ${S.score}`,`Your final health: ${Math.max(0,S.hp)}`],ch:[
 ["Use your one-time spell to return",()=>{S.spell=false;S.spellUsed=true;S.hp=S.revHp;L("You whisper ‘Aetheris Revertum’... Time reverses around you...");return"gate"},()=>S.spell],
 ["Play again",()=>{Object.assign(S,fresh(S.name));return"entrance"}]]},
win:{art:"win",t:()=>["Inside the chest is a ring marked with a dragon.","A note reads: ‘Only the wise may claim what they do not take by force.’","The dragon bows to you. You are victorious!",`Congratulations, {n}. You have claimed the treasure of legends!`,`Your final score: ${S.score}`,`Your final health: ${S.hp}`],ch:[
 ["Play again",()=>{Object.assign(S,fresh(S.name));return"entrance"}]]}};
const opts=()=>T[S.id].ch.filter(c=>!c[2]||c[2]());
const view=()=>{const d=T[S.id];return{id:S.id,art:d.art,text:d.t(),choices:opts().map(c=>c[0]),pre:S.pre,notes:S.notes,hp:Math.max(0,S.hp),score:S.score,spell:S.spell?1:S.spellUsed?2:0,items:S.items,name:S.name}};
return{start:n=>{S=fresh((n||"").trim()||"Adventurer");return view()},
 pick:i=>{const c=opts()[i];S.pre=[];S.notes=[];S.id=c[1]();return view()},
 setRng:f=>{rnd=f},state:()=>S};
})();
if(typeof module!="undefined")module.exports=Game;
