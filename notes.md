- Notes
    - Cmd + K + 0      -> to collapse all
    - Cmd + K + J      -> unfold all
    - Win + Shift + S  -> screenshot
    - Ctrl + G         -> go to a particular line of code.
    - Alt + Cmd + ->   -> split cursor

a72 last action id

**Update notes**
- Reworked poison to simplify its mechaic. Now poison stacks remain on the target until the end of the encounter and poison deals 1 dmg per stack at the end of the turn. Poison effect that lowers a random stat will eventually become available via passive node on tree.
- *Sickle* now deals 1 less damage and has 30% less action charges.
- Removed page scrolling to the bottom of the map at the start of the game.
- Resolved an issue when poison would leave a target with 0 life for one extra turn.
- Fixed an issue when players combat attack animation sprite would fail to load.
- Added *Burn* state that deals damage over time similar to poison but can't stack.
- Added *Torch* item to the game.
- Added *Oil jar* item to the game.
- Added village area that will contain the library and other points of interest. Players enter the area after they exit the hostile area.

- Actions merge
    - Merge jsons
    - Remove conversions
    - Update code that references jsons
    - Update currupteds

- To-do ideas

- Bugs