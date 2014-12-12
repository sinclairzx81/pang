var pang   = require('./bin/index.js')

var domain = pang.domain()

domain.config('configuration', 'c:/input/config.json')

domain.factory('a', function () {

    console.log('setup: a')

    return { }
})

domain.factory('b', function () {

    console.log('setup: b')

    return { }
})

domain.factory('c', function (a, info) {

    console.log('setup: c')

    return { }
})

console.log('------------------------')

var server = domain.singleton('c')

console.log(domain.singleton('configuration'))












