var pang   = require('./bin/index.js')

var domain = pang.domain()

domain.factory('info', {

    version    : '0.1.8',

    name       : 'my test application',

    decription : 'a simple di framework for nodejs'
})

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











