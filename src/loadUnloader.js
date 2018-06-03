
import loadScript from "simple-load-script";


class DynamicScriptTag {
    constructor(url) {
        this.url = url;
        this.status = 'loading';
        this.scriptRef = null;


        loadScript(url)
            .then( (scriptRef)=> {
                this.scriptRef = scriptRef;
                this.status = 'done';

            })
            .catch( (err)=> {
                console.log(err);
                this.status = 'error';
            });
    }


    unload(){

        this.scriptRef.parentNode.removeChild(this.scriptRef);
        this.scriptRef = null;
        this.status = 'unloaded';


    }


}

// let t = new DynamicScriptTag('//code.jquery.com/jquery-2.2.3.js');
// setTimeout(()=>{
//     debugger;
//     t.unload();

// },2000);






