# RPG Companion HMS — SillyTavern 1.0.0

Native **HUD tracking edition** for SillyTavern. Install from:

https://github.com/ypedrouv80-bot/RPG_Companion_HMS_SillyTavern

In SillyTavern, open Extensions → Install extension, paste the repository URL, and reload. Open the RPG Companion HMS section in Extension Settings. No server plugin or Extras installation is needed.

## Features

- Automatic or manually selected reading profiles for HMS/Living World bots.
- WORLD STATE and Harry Potter Chronicle (English/Russian) parsing.
- Separate, collapsible Danganronpa selector metadata; not a claim of lore activation.
- Exact source HUD rows, location, explicit arc/era, resources, abilities and quests.
- Chapter ranges derived from actual arc/era changes; edits, swipes and deletions are reread from the current chat.
- Observer mode by default. Tracker mode adds per-chat manual notes and JSON export.
- No prompt injection, message rewriting, automatic model calls or hidden card changes.

## Scope

This is a new native tracking implementation using the shared HMS reader. **It is not a feature-complete port of the Lumiverse application:** combat simulation, generated chapter summaries, Minds/Cortex, image generation and catalog-based spell suggestions are not included. Notes are local chat metadata; chapter grouping is derived from HUDs and does not force canon events.

No replacement prompt preset is required. `preset/HMS_Compatible_Instructions.txt` is an optional short block to copy into your current preset. Do not import the Lumiverse JSON preset into SillyTavern; their formats differ.

## Validation

Run `node tests/adapter.mjs`. 57 assertions cover profile fixtures, source isolation, completed HUDs, selector handling, chapter transitions and the actual extension UI with a simulated SillyTavern context/DOM. No live-host rendering or model-generation claim.

Built against the documented getContext API and current release source:
- https://docs.sillytavern.app/for-contributors/writing-extensions/
- https://github.com/SillyTavern/SillyTavern/blob/release/public/scripts/st-context.js

## Credits and license

Compatibility adaptation requested by Mazaki. HMS project credits: TenderTriper (Perch); RPG Companion by Marinara; FrankenSIM work by Wireless (Ryah); TFDY by Pyropia. These credits acknowledge the parent project; this tracking edition does not claim to include all of those systems. AGPL-3.0, see LICENSE. Third-party cards, artwork and full lorebooks are not included.
