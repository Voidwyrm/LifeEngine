const CellStates = require("../CellStates");
const BodyCell = require("./BodyCell");
const Hyperparams = require("../../../Hyperparameters");

class KillerCell extends BodyCell{
    constructor(org, loc_col, loc_row){
        super(CellStates.killer, org, loc_col, loc_row);
    }

    performFunction() {
        var env = this.org.env;
        var c = this.getRealCol();
        var r = this.getRealRow();
        for (var loc of Hyperparams.killableNeighbors) {
            var cell = env.grid_map.cellAt(c+loc[0], r+loc[1]);
            this.killNeighbor(cell);
        }
    }

    killNeighbor(n_cell) {
        if(n_cell == null || n_cell.owner == null || n_cell.owner == this.org || !n_cell.owner.living || (n_cell.state == CellStates.armor && Hyperparams.armorPiercing == 0)) {
            return;
        }

        //Insta-kill 1/2
        var is_hit = n_cell.state == CellStates.killer; // has to be calculated before death

        //Damage
        var armor = n_cell.state == CellStates.armor ? Hyperparams.armorPiercing : 1;
        var damage = !Hyperparams.instaKill ? (Hyperparams.damageMultiplier * this.org.anatomy.cells.length**Hyperparams.damageExponent * armor) : null;
        n_cell.owner.harm(damage);

        //Insta-kill 2/2
        if (Hyperparams.instaKill && is_hit) {
            this.org.harm();
        }
    }
}

module.exports = KillerCell;
