defineThreeUniverse(function (THREE, UNIVERSE, SPACE) {

    return new Promise((resolve) => {

        fetch('resource/mapping.json')
            .then(data => data.json())
            .then(resolve)

    })

})
