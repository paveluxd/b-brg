- Bugs
    -Extra attack action does't do dmg
    -Cooldowns don't cary over to the next encounter/

- To-do
    - Charge restoration.
    - Extend itemObj to generate items without itemRef.
    
    - Inventory
    - Tree
    - Shop

ctrl+k+0 to collapse all

Life = base-life + flat-life * life-mod(% change)
- whenever we add or remove in item we recalc all equipment
- not clear what to do with increases and reductions to stat.

10/10 -> 11/11
8/10 -> 9/11
it should be reversable, otherwise you will loose or gain stat by reequipping an item.

(baseLife + flatLife) * lifeMod - damage
(10 + 3)

- Char created
    - Calc init stats
    - Add init items
        - Add flat stats
        - Multiply by stat mutliplier

- Item removed
    - Get the stat diff between max and current stat -> current points of dmg
    - Recalculate stat without new item.
    - Reduce current by damage.

- Combat
...



Item management

1. Item is added
    1. Add it to player obj.
    2. Trigger item function that adds passives, actions and stats. resolveItem(item, 'add'<check if item exists in inventory>)
        *If item added % life, life has to be recalculated. If life is missing? -> we can drop %.
        - When we add stat, we add max and current.
            
    3. Item is removed
    4. Trigger item function -> it checks if item already exists.
        *When we remove stat, we check the diff between max and current, 
        - remove max by total value 
        - remove current by diff

2. Action that mods stats is added.
    1. Trigger generic stat change function that works the same way as item stat change?

3. Stat is mod during combat

4. Stat is mod via consumable