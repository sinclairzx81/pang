var pang = require('./bin/index.js')

var domain = pang.domain()

domain.factory('server', function (configuration, repository) {

    console.log('setup: server')

    return {
        
    }

})

domain.factory('repository', function (configuration) {

    console.log('setup: repository')

    return {

    }
})

domain.factory('configuration', function () {

    console.log('setup: configuration')

    return {

    }

}).start()

var server = domain.get('server')

console.log(server)