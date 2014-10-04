# pang

## A simple dependency injection library for node

	npm install pang

### example

The following example illustates setting up a pang domain/kernel. 

```javascript

var pang = require('pang')

var domain = pang.domain()

domain.factory('http', require('http'))

domain.factory('configuration', {

	server: {

		port: 8080
	}
})

domain.factory('repository', function(configuration) {

	return new Repository(configuration)
})

domain.factory('server', function(configuration, http, repository) {
	
	return new Server(configuration, http, repository)
})
```
### domain.start()

Boots all instances in this domain and caches within the domain.

	domain.start()

### domain.singleton()

Returns a singleton instance from the domain. Will automatically start() the domain if not already started.

	var instance = domain.singleton('repository')

### domain.transient()

Returns a transient (new) instance from the domain.

	var instance = domain.transient('repository')
