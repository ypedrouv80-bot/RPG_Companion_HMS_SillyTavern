# 1.3.0-beta.1 — Optional changed-field output

- Added opt-in **Only changed Sheet/Bonds fields**, available in Tracker mode with the original Megumin V11.
- First initialization uses the full native template. Subsequent requests ask for changed/newly recorded fields only, omitting the block if nothing changed.
- Native Megumin storage preserves omitted fields. Changed lists require the complete resulting list.
- Numeric limits are preserved; repetitive (=) instructions are removed from the adjusted requests.
- Observer/master-off and Chomusuke-routed blocks keep original behavior. Disabling the option restores the request builders.
- No replacement Megumin, modified engine file, new journal or extra model call. The option changes runtime block instructions only; model compliance still requires live testing.

69 host-mock +15 delta-adapter +9 original-storage checks passed. See SETUP-MEGUMIN-ORIGINAL.md for setup, scope and rollback. Native cards can show complete saved state even after delta-only output. The bot's separate HUD must be disabled through its own controls if it should not repeat.
