import assert from 'node:assert/strict';
import {installDeltaRequests,deltaRequest} from '../compatibility/megumin-deltas.js';
let n=0;function check(name,fn){try{fn();n++;}catch(e){e.message=name+': '+e.message;throw e;}}
let enabled=false,worker=false,stored={};const api={statsState:id=>stored[id],blockViaChomusuke:()=>worker};
const rules='One line for each named character in the scene, and for anyone whose numbers changed in it. Start from Current_Info, or (=) when nothing moved it. Cap changes at 10.';
const registry={MEGUMIN_BLOCK_REGISTRY:['sheet','bonds'].map(id=>({id,build:()=>id+' full',buildSplit:()=>({rules,body:'Mana: [0-100]/100 [(±N reason) or (=)]'})}))};
const [sheet,bonds]=registry.MEGUMIN_BLOCK_REGISTRY,original=sheet.build;const uninstall=installDeltaRequests(registry,api,()=>enabled);
check('disabled preserves output',()=>assert.equal(sheet.build(),'sheet full'));enabled=true;check('bootstrap preserves full request',()=>assert.equal(sheet.build(),'sheet full'));
stored.sheet={fields:{mana:{text:'80'}}};stored.bonds={people:{ariel:{}}};
check('sheet delta request',()=>assert(sheet.build().includes('CHANGED FIELDS ONLY')));check('bonds delta request',()=>assert(bonds.buildSplit().rules.includes('CHANGED FIELDS ONLY')));check('unchanged request removed',()=>assert(!bonds.buildSplit().rules.includes('or (=)')));check('all present rule removed',()=>assert(!bonds.buildSplit().rules.includes('One line for each named')));check('numeric limits retained',()=>assert(sheet.buildSplit().rules.includes('Cap changes at 10')));check('schema still available',()=>assert(sheet.buildSplit().body.includes('Mana:')));check('unchanged schema marker removed',()=>assert(!sheet.buildSplit().body.includes('(=)')));check('whole list required',()=>assert(sheet.buildSplit().rules.includes('complete resulting list')));
worker=true;check('worker mode untouched',()=>assert.equal(sheet.build(),'sheet full'));worker=false;enabled=false;check('observer/off predicate restores original behavior',()=>assert.equal(sheet.build(),'sheet full'));uninstall();check('uninstall restores original function',()=>assert.equal(sheet.build,original));
check('unsupported interface leaves original intact',()=>{assert.throws(()=>installDeltaRequests({MEGUMIN_BLOCK_REGISTRY:[sheet]},api,()=>true));assert.equal(sheet.build,original);});
const undo=installDeltaRequests(registry,api,()=>true),external=()=> 'another integration';sheet.build=external;undo();check('uninstall preserves external changes',()=>assert.equal(sheet.build,external));
console.log(n+' delta adapter checks passed');
