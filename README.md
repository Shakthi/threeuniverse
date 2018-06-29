# Three Universe
Imagine a wiki-like 3D world, where anybody can create their 3d structures, forms, models and they can roam around to check out their neighbor's creation. Three universe is essentially a **ThreeJS** based universe, powered by **GitHub Pages**.

FPS controls enable to roam around the universe and check out the areas with different parts of the universe progressively loaded from individual contributor's GitHub Pages. With exception of browser cache, the changes made to universe parts dyanamically reflected, and no more pull-requests needed.


Please checkout the current progress at https://threeuniverse.org





*Quick contribution guide:*

It is super easy to create your structure in this universe. 
- Fork this repo. Let your new repo path  github.com/YourName/threeuniverse
- [Enable GitHub pages for the repository.](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/). This should create your GitHub Pages at  https://<span></span>yourname.github.io/threeuniverse/index.html *Note: Sometimes it might take couple of minutes to your GitHub pages to start to work*
- Goto the above page. Roam around in the universe. Observe your coordinates on browser URL (say https://<span></span>yourname.github.io/threeuniverse/index.html#x:744&z:495)
- Create a part at src/universe_parts. You can copy or refer to existing parts.
```javascript
//sampleCube.js - Sample cube part file
defineThreeUniverse(function (THREE) {

        var geometry = new THREE.BoxGeometry( 100, 100, 100 );
        var material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
        var cube = new THREE.Mesh( geometry, material );

        return cube;
});
  ```    
- Add your entry to src/universe_parts/mapping.js with position as the position you noted earlier.
- Save/Commit. On refresh, your model should appear at https://<span></span>yourname.github.io/threeuniverse/index.html#x:744&z:495
- Create a pull request to share your creation with threeuniverse.org You need to send pull request only once, all further modifications appears automatically on threeuniverse.org
