# RPG Companion HMS — SillyTavern 1.3.0-beta.1

Use the **original Megumin V11** and your existing prompt. This Companion reads its existing **World State**, **Character Sheet**, and **Bonds**. No replacement Megumin, modified Radiant engine, custom HUD protocol, or parallel state store is required.

## Simple setup
1. Install/keep the original Megumin: https://github.com/Arif-salah/Megumin-Suite . If you tested our earlier fork, disable it and return to the original. Keep a backup of your chats/settings; do not run both Megumin copies.
2. Keep the original Megumin V11 Universal generation preset and your original Radiant engine/writing style. Do not use our previous HMS engine variants for this setup.
3. Install/update this Companion: https://github.com/ypedrouv80-bot/RPG_Companion_HMS_SillyTavern . Reload SillyTavern and open Megumin once in the intended chat.
4. In Companion, click **Configure RPG blocks in Megumin**. This enables the three existing blocks and adds missing RPG sheet fields plus a textual Relationship field. Existing fields, prompt, values, routing, and other enabled blocks are preserved. Reopen Megumin Blocks to review; configuration follows Megumin's currently selected profile scope (global/character/chat).
5. Continue the conversation. Companion reads saved Megumin state. If generation just ended before Megumin finished processing, click **Read current chat** to refresh.

To keep the native cards out of chat, choose **Hidden** for them in Megumin Blocks. Keep Megumin's **Hide old blocks from the AI** option enabled if you want its existing Current Info behavior. These are Megumin's own controls; Companion does not rewrite messages. Its default reader does not alter requests; the optional changed-fields mode described below modifies only the native Sheet/Bonds output templates at runtime.

If your bot still requires its own separate WORLD STATE panel, disable that panel using the bot's supported HUD controls. This setup does not silently override bot rules. No universal command is assumed. It also does not automatically convert old custom RPGHUD/RPGC_UPDATE history into native blocks: check existing values in Megumin's editors and correct them there when migrating.

## Field mapping
- World State: location, time, weather, scene, present characters.
- Character Sheet: identity, mana, magic ranks, sword styles, special abilities, languages, equipment, inventory, explicit campaign arc.
- Bonds: established relationships. No new affection numbers or intimacy are inferred.

The configuration button only adds missing labels. The original Megumin controls generation, saving, updates, editing, and swipes. Sheet/Bonds follow their own native update rules; this does not promise every block becomes a delta or has zero token cost.

## Compatibility
Original Megumin V11 source API checked against upstream commit b3696d12a39ab8f8dbcafb9ffabab2e095c77b9c. The adapter imports existing exported readers from the installed original extension, without copying its journal or source into Companion. Default folder: `Megumin-Suite`. If renamed, set **Megumin connection → installation folder → Reconnect**. This uses internal exports, so a future upstream change may require updating the adapter. Errors fall back to the existing bot HUD reader.

All previous HUD profiles, manual notes and export remain. This is the SillyTavern tracking edition, not the complete Lumiverse application. Chapters are still derived from explicit chat HUDs, not native Megumin state transitions. Lumiverse is unchanged by this release; do not install this package there.

## Validation and credits
`node tests/adapter.mjs`: 69 simulated-host assertions, including the original-state adapter, field preservation, repeat configuration and chat switching. No live browser/model-generation claim.

Original Megumin: KazumaONIISAN / Arif-salah. Original prompts: their respective authors, including Radiant. Original Companion credits and license preserved. This release replaces the earlier fork-based setup recommendation; those experimental Megumin forks are not needed.


## Optional: generate only changed Sheet/Bonds fields
1. Choose **Tracker** mode in Companion.
2. Enable **Only changed Sheet/Bonds fields (Tracker mode, main model)**.
3. Keep the original Megumin V11 Universal preset and Current Info available. World State already uses its own native updates. For Sheet/Bonds, the first baseline keeps the original full initialization request. Once saved, the adapter requests only changed or newly established fields; no-change turns are asked to omit that block. Changed inventories/lists must contain the full resulting list.

This adjusts the installed registry builders in memory while opted in; no Megumin source file or Radiant prompt file is replaced. Turning it off restores the original request builders. Observer/master-off modes do not modify output requests. Chomusuke-routed Sheet/Bonds are intentionally left unchanged; this option targets the main story model. Values continue to live only in Megumin. Native cards may still display the whole reconstructed state even when output contained only a small update. Use their Hidden control if desired. A separate bot WORLD STATE panel is not automatically disabled.

This is an experimental request change, not a guarantee that every model will obey or that input tokens vanish. No extra model call is added. Validation: 69 existing host-mock checks, 15 adapter checks, and 9 actual native storage assertions; no live model generation yet. To rerun the storage test, use `node tests/native-deltas.mjs PATH_TO_ORIGINAL_MEGUMIN`.
