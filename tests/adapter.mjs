import assert from 'node:assert/strict';
import fs from 'node:fs';
import '../compatibility/hud-profiles.js';
import {mount,timeline,messagesOf} from '../index.js';
const H=globalThis.HMSCompatibility,fixtures=JSON.parse(fs.readFileSync(new URL('./fixtures.json',import.meta.url)));
let count=0;function check(fn){fn();count++;}
for(const f of fixtures){const snap=H.snapshot([{id:0,role:'assistant',content:f.text}],f.id);check(()=>assert(snap));check(()=>assert(snap.location));check(()=>assert.equal(snap.id,f.id));}
check(()=>assert.equal(H.blocks('```\n'+fixtures[0].text+'\n```').length,0));
check(()=>assert.equal(H.snapshot([{role:'assistant',content:fixtures[0].text},{role:'user',content:'DanMachi_Start_Handler\nStart'}]),null));
check(()=>assert.equal(H.blocks('### WORLD STATE ###\nLocation: Road').length,0));
check(()=>assert.equal(H.selectors('<!-- DR_CURRENT MAIN | A=A1 -->\n<!-- DR_CURRENT broken -->').DR_CURRENT.valid,false));
check(()=>assert.deepEqual(H.selectors('> <!-- DR_CURRENT MAIN | A=A1 -->'),{}));
check(()=>assert.equal(H.snapshot([{role:'assistant',content:'THE WORLD STATE PANEL — one example, from a campaign already underway.\n'+fixtures[0].text}]),null));
const messages=[{role:'assistant',content:fixtures[0].text},{role:'assistant',content:fixtures[0].text},{role:'assistant',content:fixtures[0].text.replace('MT-ARC:7','MT-ARC:8')}];
check(()=>assert.equal(timeline(messages,'auto','').length,2));check(()=>assert.equal(timeline(messages,'auto','')[0].status,'closed'));check(()=>assert.equal(timeline(messages.slice(0,2),'auto','').length,1));
class E{constructor(tag){this.tag=tag;this.children=[];this.attrs={};this.textContent='';}append(...xs){this.children.push(...xs);}prepend(...xs){this.children.unshift(...xs);}replaceChildren(...xs){this.children=xs;}setAttribute(k,v){this.attrs[k]=v;}remove(){this.removed=true;}}
const body=new E('body');globalThis.document={body,createElement:t=>new E(t),getElementById:()=>null};const events=new Map();let saves=0;const metadata={};const ctx={chat:[{mes:fixtures[0].text,is_user:false}],name2:'Mushoku',extensionSettings:{},chatMetadata:metadata,saveSettingsDebounced(){saves++;},saveMetadataDebounced(){saves++;},setExtensionPrompt(){throw Error('Unexpected prompt injection')},generateRaw(){throw Error('Unexpected model call')},eventTypes:{CHAT_CHANGED:'chat',MESSAGE_SWIPED:'swipe'},eventSource:{on(e,fn){events.set(e,fn)},removeListener(e){events.delete(e)}}};
const cleanup=mount({getContext:()=>ctx});const all=n=>[n,...n.children.flatMap(all)];let nodes=all(body);check(()=>assert(nodes.some(n=>n.textContent==='📍 Rosenburg')));check(()=>assert.equal(events.size,2));
let mode=nodes.find(n=>n.tag==='select');mode.value='active';mode.onchange();nodes=all(body);const notes=nodes.find(n=>n.tag==='textarea');notes.value='Local notes';nodes.find(n=>n.textContent==='Save notes in this chat').onclick();check(()=>assert.equal(metadata.rpg_companion_hms_multibot.notes,'Local notes'));check(()=>assert.equal(ctx.chat[0].mes,fixtures[0].text));
ctx.chat=[{mes:fixtures[1].text,is_user:false}];events.get('chat')();check(()=>assert(all(body).some(n=>n.textContent==='📍 Orario')));
cleanup();check(()=>assert.equal(events.size,0));console.log('SillyTavern adapter: '+count+' assertions passed (simulated DOM/context; no live host).');

// Original Megumin integration. No fork bridge or prompt writes.
ctx.chatId='original';ctx.chatMetadata={megumin_state:{}};let configured=0;const core={localProfile:{blockStack:{order:[]},statBlocks:{sheet:{fields:[{label:'Mana',type:'text',hint:'keep me'}]}}}};
const world={scene:{location:'Original Salon',time:'Evening'},cast:{a:{name:'Ariel',present:true}},threads:[]};
const api={getWorldState:()=>world,statsState:id=>id==='sheet'?{fields:{magic:{label:'Magic Tiers',text:'Fire Imperial'}}}:{people:{a:{name:'Ariel',fields:{r:{label:'Relationship',text:'friend'}}}}}};
const loader=async url=>url.includes('core/state.js')?core:url.includes('core/profile.js')?{saveProfileToMemory(){configured++;}}:url.includes('blocks/registry.js')?{meguminSyncLegacyBlockIds(){core.localProfile.blocks=['info'];}}:api;
const closeOriginal=mount({getContext:()=>ctx},loader);await new Promise(r=>setImmediate(r));const current=body.children.at(-1);check(()=>assert(all(current).some(n=>n.textContent==='📍 Original Salon')));check(()=>assert(all(current).some(n=>String(n.textContent).includes('Fire Imperial'))));
await all(current).find(n=>n.textContent==='Configure RPG blocks in Megumin').onclick();check(()=>assert.equal(configured,1));check(()=>assert.deepEqual(core.localProfile.blockStack.order,['world','sheet','bonds']));check(()=>assert.equal(core.localProfile.statBlocks.sheet.fields.find(f=>f.label==='Mana').hint,'keep me'));
const before=core.localProfile.statBlocks.sheet.fields.length;await all(current).find(n=>n.textContent==='Configure RPG blocks in Megumin').onclick();check(()=>assert.equal(core.localProfile.statBlocks.sheet.fields.length,before));
world.scene.location='Changed Hall';events.get('swipe')();check(()=>assert(all(current).some(n=>n.textContent==='📍 Changed Hall')));
ctx.chatId='different';ctx.chatMetadata={};events.get('chat')();check(()=>assert(!all(current).some(n=>n.textContent==='📍 Changed Hall')));closeOriginal();console.log('Original Megumin adapter: '+count+' total checks passed');
