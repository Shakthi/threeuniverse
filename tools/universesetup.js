#!/usr/bin/env node

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const readline = require('readline');
const mappingmod = require('./mappingmod.js');
const partmod = require('./partmod.js');
const seedrandom = require('seedrandom');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



function ask(question, placeholder) {
    return new Promise((resolve) => {
        rl.question(question, (name) => {
            if (name === "" && placeholder)
                resolve(placeholder)
            else
                resolve(name)

        })
    })
}


function die(error) {
    console.error(error)
    process.exit(1);
}

function getRandomCoordinateUrl() {
    const prg = new seedrandom()
    const samplex = ((prg() * 2 - 1) * 10000).toFixed(0)
    const sampley = ((prg() * 2 - 1) * 10000).toFixed(0);
    return `https://threeuniverse.org/#x:${samplex}&z:${sampley}`

}


function githubPageOfRepo(gitorigin) {
    {
        const githubcommonurlre = /https:\/\/github.com\/([A-Za-z0-9]+)\/threeuniverse.git/
        const result = githubcommonurlre.exec(gitorigin)
        if (result != null) {
            const user = result[1];
            return { githubPageUrl: `https://${user}.github.io/threeuniverse/` }

        }
    }


    {
        const githubcommonurlre = /https:\/\/github.com\/threeuniverse\/([A-Za-z0-9]+)\/?/
        const result = githubcommonurlre.exec(gitorigin)
        if (result != null) {
            const repo = result[1];
            return { githubPageUrl: `https://threeuniverse.github.io/${repo}/`, partnamehint: repo }
        }

    }


    {

        const githubcommonurlre = /https:\/\/github.com\/threeuniverse\/([A-Za-z0-9]+).git/
        const result = githubcommonurlre.exec(gitorigin)
        if (result != null) {
            partnamehint = repo;
            const repo = result[1];
            return { githubPageUrl: `https://threeuniverse.github.io/${repo}/`, partnamehint: repo }
        }

    }

}







const upstream = "https://github.com/Shakthi/threeuniverse.git";



async function main() {
    const { stdout } = await exec('git config --get remote.origin.url');
    let knownGitorigin = stdout.trim()

    let gitorigin = await ask(`Enter the git url you want to push the repo [${knownGitorigin}]:`, knownGitorigin);

    if (gitorigin == upstream)
        die(`Cannot setup repo for upstream url [${gitorigin}]`);

    if (fs.existsSync('CNAME')) {
        console.log('Deleting CNAME file for non upstream repo')
        fs.unlinkSync('CNAME')
    }

    let { githubPageUrl, partnamehint } = githubPageOfRepo(gitorigin);

    githubPageUrl = await ask(`Url git hub page fot the repo [${githubPageUrl}]:`, githubPageUrl)
    const partFileName = await ask(`Name of the partfile you want to setup [${partnamehint}]:`, partnamehint)
    const finaljs = githubPageUrl + "src/universe_parts/" + partFileName + ".js"
    console.log("Final Url will be:", finaljs);
    console.log(`Creating part file(${partFileName})`);

    const samplecoordinateUrl = getRandomCoordinateUrl();
    const coordinateUrl = await ask(`Enter the sample coordinate url you want to setup the base [${samplecoordinateUrl}]:`, samplecoordinateUrl)
    const coordinates ={}
    try {
        const xztemp = coordinateUrl.split('#')[1].split('&');
        coordinates.x = xztemp[0].split('x:')[1];
        coordinates.z = xztemp[1].split('z:')[1];
    } catch (error) {
        die("Invalid coordinates")
    }

    

    console.log("Generating new part...")
    partmod.createASperePart(partFileName);

    
    console.log("Updatting maping file for new part...")
    mappingmod.open();
    mappingmod.setLocalPart(githubPageUrl);

    let mapingdata = {
        position: { x: coordinates.x, z: coordinates.z },
        url: finaljs,
    }

    mappingmod.appingNewPartViaMarker(mapingdata);
    mappingmod.write();

    if(knownGitorigin!=gitorigin){
        console.log("Setting gitorigin...") 
        let answer = await ask(`Confirm that your repositiory  will be pushed to remote ${gitorigin} [yes]/no:`, 'yes');   
        if(answer == 'yes')
        {
            await exec(`git remote set-url origin ${gitorigin}`);
            await exec(`git push origin`);

        }
        
    }
    
    console.log("Modfied maping file ")
    


    rl.close();
}
main();

