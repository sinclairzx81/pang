var pang = require('./bin/pang.js')

var kernel = pang.kernel()

kernel.factory('server', ['configuration', 'repository'], function (configuration, repository) {

    console.log('setup: server')

    console.log(repository)

    return {

    }

})

kernel.factory('repository', ['configuration'], function (configuration) {

    console.log('setup: repository')

    return {

        name: 'fluff fluff'
    }

})

kernel.factory('configuration', [], function () {

    console.log('setup: configuration')

    return {

    }

}).start(function (errors) {

})