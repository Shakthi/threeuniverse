

//Based on https://github.com/mrdoob/three.js/issues/758
export default class QueryTextureWrapper {

    constructor(texture){
        this.texture = texture;
        this.imageData = null;
    }

    getPixelAtUv(u,v){
        if(!this.imageData){
            this.updateImageData();
        }

        var position = ( Math.round((this.imageData.width-1)*u) + Math.round((this.imageData.height-1)*v) * this.imageData.width ) * 4, data = this.imageData.data;
        return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ], a: data[ position + 3 ] };
        
    }

    updateImageData(  ) {
        var image = this.texture.image;
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        var context = canvas.getContext( '2d' );
        context.drawImage( image, 0, 0 );
    
        this.imageData= context.getImageData( 0, 0, image.width, image.height );
    
    }



};