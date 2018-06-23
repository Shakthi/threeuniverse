import * as dat from 'dat.gui';
import Snackbar from 'node-snackbar';

export let OnScreen= {
    log:function (params) {
        Snackbar.show({pos: 'bottom-right',text:params}); //Set the position

    }
    
}

let gui = new dat.GUI();
export { gui as datGUI }