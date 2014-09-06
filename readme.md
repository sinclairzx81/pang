# pang

## A simple dependency injection library for node

	npm install pang

### example

The following example illustates setting up a pang kernel. Configuration, Repository and Server are
all application types, they are ommited for clarify.

```javascript

var pang = require('pang')

var domain = pang.domain()

//---------------------------------------
// no injection
//---------------------------------------
domain.factory('configuration', function(){
	
	return new Configuration()
})

//---------------------------------------
// configuration injected on repository
//---------------------------------------
domain.factory('repository', function(configuration) {

	return new Repository(configuration)
})

//--------------------------------------------------
// configuration and repository injected on server
//--------------------------------------------------
domain.factory('server', function(configuration, repository) {
	
	return new Server(configuration, repository)
})

domain.start()

//--------------------------------------------------
// get a instance from the domain
//--------------------------------------------------

var server = domain.get('server')

```
