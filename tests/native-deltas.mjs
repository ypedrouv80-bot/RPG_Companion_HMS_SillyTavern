// Run against an independently checked-out original Megumin; no upstream code vendored here.
import assert from 'node:assert/strict';import path from 'node:path';import {pathToFileURL} from 'node:url';
const source=process.argv[2];if(!source)throw Error('Usage: node tests/native-deltas.mjs PATH_TO_ORIGINAL_MEGUMIN');
const load=f=>import(pathToFileURL(path.resolve(source,f)));const {parseSheet,parseBonds}=await load('src/state/modules/stats/parse.js');const {applySheet,applyBonds}=await load('src/state/modules/stats/model.js');
const a=applySheet(null,parseSheet('<Character_Sheet>Mana: 80 | Inventory: rope, torch | Magic Tiers: Fire Imperial</Character_Sheet>')).state;
const b=applySheet(a,parseSheet('<Character_Sheet>Mana: 0</Character_Sheet>')).state;assert.equal(b.fields.mana.text,'0');assert.equal(b.fields.inventory.text,'rope, torch');assert.equal(b.fields['magic tiers'].text,'Fire Imperial');
assert.deepEqual(applySheet(b,parseSheet('No block this turn')).state,b);
const c=applySheet(b,parseSheet('<Character_Sheet>Inventory: rope</Character_Sheet>')).state;assert.equal(c.fields.inventory.text,'rope');
const x=applyBonds(null,parseBonds('<Bonds>Ariel: Relationship: ally | Trust: 50/100\nLuke: Relationship: brother</Bonds>')).state;
const y=applyBonds(x,parseBonds('<Bonds>Ariel: Trust: 55/100</Bonds>')).state;assert.equal(y.people.ariel.fields.relationship.text,'ally');assert.equal(y.people.luke.fields.relationship.text,'brother');assert.equal(y.people.ariel.fields.trust.text,'55/100');assert.deepEqual(applyBonds(y,parseBonds('No changes')).state,y);
console.log('9 original Megumin storage checks passed');
