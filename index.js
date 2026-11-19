import './compatibility/hud-profiles.js';
const HMS=globalThis.HMSCompatibility, KEY='rpg_companion_hms_multibot';
export function timeline(messages,profile,name){
 const chapters=[];let start=0;for(let i=0;i<messages.length;i++)if(messages[i].role==='user'&&HMS.isStart(messages[i].content))start=i;
 for(let i=start;i<messages.length;i++){const m=messages[i];if(m.role!=='assistant'||HMS.isGuide(m.content))continue;const block=HMS.blocks(m.content).at(-1);if(!block)continue;const state=HMS.readRows(block.rows,name,profile);if(!state.arc)continue;const key=state.arc.replace(/\s+[—–]\s+(?:Branch|Perspective|Chapter):?.*$/i,'').trim();let prev=chapters.at(-1);if(!prev||prev.key!==key){if(prev)prev.status='closed';chapters.push({key,title:key,from:i,to:i,status:'open'});}else prev.to=i;
 }return chapters;
}
export function messagesOf(ctx){return (ctx.chat||[]).filter(m=>!m.is_system).map(m=>({id:(ctx.chat||[]).indexOf(m),role:m.is_user?'user':'assistant',content:String(m.mes||''),swipe_id:m.swipe_id||0}));}
function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
export function mount(host=globalThis.SillyTavern){
 const context=()=>host.getContext();let root=document.getElementById(KEY);if(root)return ()=>{};
 root=el('section',undefined,'hms-multibot');root.id=KEY;
 const target=document.getElementById('extensions_settings2')||document.getElementById('extensions_settings')||document.body;target.append(root);
 const settings=()=>{const c=context();return c.extensionSettings[KEY]??={enabled:true,mode:'observer',profile:'auto'};};
 function save(){context().saveSettingsDebounced();render();}
 function download(value,name){const u=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=el('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
 function group(title,rows){if(!rows.length)return;const d=el('details');d.append(el('summary',title+' ('+rows.length+')'));for(const r of rows)d.append(el('p',r.label+': '+r.value));root.append(d);}
 function render(){const c=context(),s=settings(),messages=messagesOf(c);root.replaceChildren(el('h3','🧭 RPG Companion HMS · 1.1.0'));
 const toggle=el('input');toggle.type='checkbox';toggle.checked=s.enabled;toggle.onchange=()=>{s.enabled=toggle.checked;save();};const label=el('label',' Enabled ');label.prepend(toggle);root.append(label);if(!s.enabled)return;
 const mode=el('select');for(const [value,title]of [['observer','Observer — read only'],['active','Tracker — local notes and export']]){const o=el('option',title);o.value=value;mode.append(o);}mode.value=s.mode;mode.onchange=()=>{s.mode=mode.value;save();};mode.setAttribute('aria-label','Companion mode');root.append(mode);
 const select=el('select');select.setAttribute('aria-label','Compatibility profile');for(const [id,name]of HMS.profiles){const o=el('option',name);o.value=id;select.append(o);}select.value=s.profile;select.onchange=()=>{s.profile=select.value;save();};root.append(select);
 const refresh=el('button','↻ Read current chat');refresh.onclick=render;root.append(refresh);
 root.append(el('p','No prompt injection or automatic model calls. This native edition reads HUDs and tracks local notes; Lumiverse simulation tools are not ported.','hms-note'));
 let native=null;try{native=globalThis.MeguminRPGHUD?.read?.();}catch{/* Native extension not ready; use HUD reader. */}
 const snap=native && c.chatId!=null && String(native.chatId)===String(c.chatId) && native.state?.rows?.length ? {rows:native.state.rows,...HMS.readRows(native.state.rows,c.name2||'',s.profile),messageId:messages.at(-1)?.id,swipeId:0,selectors:{},native:true} : HMS.snapshot(messages,s.profile,c.name2||'');
 if(native?.state?.error)root.append(el('p','Megumin HUD: '+native.state.error));if(!snap){root.append(el('p','Waiting for a complete HUD in this campaign. Quoted/fenced examples are ignored.'));return;}
 root.append(el('h4',snap.name),el('p','Source message '+(Number(snap.messageId)+1)+' · swipe '+snap.swipeId+(snap.stale?' · last available reading':'')));
 if(snap.location)root.append(el('h4','📍 '+snap.location));if(snap.arc)root.append(el('p','📖 '+snap.arc));
 group('Resources',snap.resources);group('Abilities / ranks as written',snap.abilities);group('Quests / obligations',snap.quests);
 const state=el('details');state.open=true;state.append(el('summary','World State — '+snap.rows.length+' lines'));for(const row of snap.rows)state.append(el('p',row.text));root.append(state);
 if(Object.keys(snap.selectors||{}).length){const d=el('details');d.append(el('summary','Routing selectors — may contain spoilers'));d.append(el('p','These are routing metadata, not proof that lore was loaded.'));for(const [key,v]of Object.entries(snap.selectors))d.append(el('pre',key+': '+(v.valid?v.value:'Invalid latest selector; no fallback')));root.append(d);}
 const ch=el('details');ch.append(el('summary','Chapters by arc / era'));const chapters=timeline(messages,s.profile,c.name2||'');for(const chapter of chapters)ch.append(el('p',chapter.title+' · '+chapter.status+' · messages '+(chapter.from+1)+'–'+(chapter.to+1)));if(!chapters.length)ch.append(el('p','No explicit arc/era in the current campaign HUDs.'));root.append(ch);
 if(s.mode==='active'){
  const scope=messages.filter(m=>m.role==='user'&&HMS.isStart(m.content)).at(-1);const scopeKey=scope?String(scope.id)+'|'+scope.content:'default';
  const meta=c.chatMetadata[KEY]||{},note=el('textarea');note.placeholder='Manual chapter / campaign notes (not sent to the model)';note.value=meta.scope===scopeKey?meta.notes||'':'';root.append(note);
  const btn=el('button','Save notes in this chat');btn.onclick=()=>{const fresh=context();if(fresh.chatMetadata!==c.chatMetadata)return;fresh.chatMetadata[KEY]={scope:scopeKey,notes:note.value};fresh.saveMetadataDebounced();};root.append(btn);
  const exp=el('button','Export reading + chapters');exp.onclick=()=>download({schema:'HMS-ST-1',snapshot:snap,chapters,notes:note.value},'HMS-campaign-reading.json');root.append(exp);
 }
 }
 const ctx=context(),types=ctx.eventTypes||ctx.event_types||{},subscriptions=[];for(const key of ['CHAT_CHANGED','MESSAGE_RECEIVED','MESSAGE_UPDATED','MESSAGE_EDITED','MESSAGE_SWIPED','MESSAGE_DELETED','GENERATION_ENDED'])if(types[key]){const fn=()=>render();ctx.eventSource.on(types[key],fn);subscriptions.push([types[key],fn]);}
 render();return ()=>{for(const[e,fn]of subscriptions)ctx.eventSource.removeListener(e,fn);root.remove();};
}
if(globalThis.SillyTavern&&typeof document!=='undefined')mount();
