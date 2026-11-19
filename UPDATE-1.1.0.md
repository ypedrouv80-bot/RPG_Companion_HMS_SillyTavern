# RPG Companion SillyTavern 1.1.0

Reads the active Megumin V11 HMS fork's native RPG HUD state through a read-only bridge. Validates chat identity, displays all stored fields, and shows rejected-update warnings. Falls back to the ordinary HUD reader when the bridge is absent/disabled. No new prompt injection, automatic generation or state writer. Existing chapter tracking continues to use explicit HUD messages; delta-only arc changes do not yet create native-journal chapter boundaries.

Requires Megumin_Suite_HMS_SillyTavern 11.0.1-hms.1 for native-state integration. Existing independent HUD profiles remain supported.
