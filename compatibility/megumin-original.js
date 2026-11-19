// Original Megumin V11 adapter. Uses its existing state API; no journal copy or prompt injection.
export const RPG_FIELDS={sheet:[
 {label:'Identity',type:'text',hint:'Established race, origin and biological age'},
 {label:'Mana',type:'text',hint:'Established capacity, reserve and condition; do not invent numbers'},
 {label:'Magic Tiers',type:'text',hint:'Known schools and demonstrated or explicitly selected ranks'},
 {label:'Sword Styles',type:'text',hint:'Known sword styles and ranks'},
 {label:'Special Abilities',type:'text',hint:'Only established gifts, demon eyes, voiceless casting or limitations'},
 {label:'Languages',type:'list'}, {label:'Equipment',type:'list'}, {label:'Inventory',type:'list'},
 {label:'Current Arc',type:'text',hint:'Explicit campaign arc; unknown when unset'}
],bonds:[{label:'Relationship',type:'text',hint:'Established relationship; no invented intimacy or numerical score'}]};
export function addRpgFields(profile){if(!profile||typeof profile!=='object')throw Error('Open Megumin in this chat first.');profile.statBlocks??={};let added=0;for(const [id,fields]of Object.entries(RPG_FIELDS)){const cfg=profile.statBlocks[id]??={};cfg.fields??=[];for(const f of fields)if(!cfg.fields.some(x=>String(x.label).trim().toLowerCase()===f.label.toLowerCase())){cfg.fields.push({...f});added++;}}return added;}
export function rowsFromMegumin(world={},sheet={},bonds={}){const rows=[];const add=(label,value)=>{if(value!==undefined&&value!==null&&String(value).trim())rows.push({text:label+': '+String(value)});};
add('Location',world.scene?.location);add('Time',world.scene?.time);add('Weather',world.scene?.weather);add('Arc Phase',world.arcPhase);add('Scene Phase',world.scenePhase);
for(const [label,value]of Object.entries(world.pc?.fields||{}))add(label,value);
const present=Object.values(world.cast||{}).filter(x=>x.present).map(x=>x.name).filter(Boolean);if(present.length)add('NPCs Present',present.join(' · '));for(const person of Object.values(world.cast||{})){if(person.present)for(const [field,value]of Object.entries(person.fields||{}))add(person.name+' — '+field,value);}
for(const field of Object.values(sheet.fields||{}))if(field?.label)add(field.label,field.text);
for(const person of Object.values(bonds.people||{})){const fields=Object.values(person.fields||{}).filter(f=>f?.label&&f.text).map(f=>f.label+' — '+f.text);if(fields.length)add('Bonds — '+person.name,fields.join(' | '));}
if(world.threads?.length)add('Active Threads',world.threads.join(' · '));return rows;}
export function readMegumin(api,ctx){if(!ctx.chatMetadata?.megumin_state)return null;if(typeof api?.getWorldState!=='function'||typeof api?.statsState!=='function')throw Error('This Megumin version does not expose the V11 state reader.');const rows=rowsFromMegumin(api.getWorldState(),api.statsState('sheet')||{},api.statsState('bonds')||{});return rows.length?{rows,source:'Megumin original — World State / Character Sheet / Bonds'}:null;}
export function meguminUrl(file,folder='Megumin-Suite'){if(!/^[\w .-]+$/.test(folder)||folder==='.'||folder==='..')throw Error('Invalid Megumin folder name');return new URL('../../'+encodeURIComponent(folder)+'/'+file,import.meta.url).href;}
