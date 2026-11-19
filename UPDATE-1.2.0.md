# 1.2.0 — Original Megumin, simple setup

- Removed the dependency on our experimental Megumin fork and its special HUD protocol.
- Reads the original V11 World State, Character Sheet and Bonds through its existing readers. No second state database or model call.
- Added **Configure RPG blocks in Megumin**: enables existing native blocks and adds missing RPG fields only when clicked; retains current fields and engine.
- Uses the original Megumin preset and original Radiant prompt. No modified engine required.
- Falls back to bot HUD reading when Megumin is unavailable; provides a folder setting for renamed installs.
- 65 simulated-host assertions passed. Live testing remains necessary. Installation and migration limitations are in SETUP-MEGUMIN-ORIGINAL.md. This release is for SillyTavern; Lumiverse is unchanged.
