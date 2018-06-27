import * as dat from 'dat.gui';
import Snackbar from 'node-snackbar';

export let OnScreen= {
    log:function (params) {
        Snackbar.show({pos: 'bottom-right',text:params,showAction:false}); //Set the position

    }
    
}

export let datGUI = new dat.GUI();
datGUI.close();
