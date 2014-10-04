var pang   = require('./bin/index.js')

var domain = pang.domain()

domain.factory('info', {

    version    : '0.1.8',

    name       : 'my test application',

    decription : 'a simple di framework for nodejs'
})

domain.factory('server', function (provider, provider, version, http) {

    console.log('setup: server')

    return {
        
    }
})

domain.factory('mailer', function (configuration) {

    console.log('setup: mailer')

    return {
        
    }
})

domain.factory('provider', function (configuration, notifications, repository) {

    console.log('setup: provider')

    return {
        
    }
})

domain.factory('notifications', function (configuration, mailer) {

    console.log('setup: notifications')

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
})

domain.singleton('server')

console.log('------------------------')

var server  = domain.transient('server')





