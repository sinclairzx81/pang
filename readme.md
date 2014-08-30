# pang

## A simple dependency injection library for node

	npm install pang

### example

The following example illustates setting up a pang kernel. Configuration, Repository and Server are
all application types, they are ommited for clarify.

```javascript

var pang = require('pang')

var kernel = pang.kernel()

kernel.factory('configuration', [], function(){
	
	return new Configuration()
})

kernel.factory('repository', function(repository) {

	return new Repository(repository)
})

kernel.factory('server', ['configuration', 'repository'], function(configuration, repository) {

	return new Server(configuration, repository)
})

kernel.start()

```
