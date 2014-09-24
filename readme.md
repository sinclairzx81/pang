# pang

## A simple dependency injection library for node

	npm install pang

### example

The following example illustates setting up a pang domain/kernel.

```javascript

var pang = require('pang')

var domain = pang.domain()

domain.factory('configuration', function() {
	
	return new Configuration()
})

domain.factory('repository', function(configuration) {

	return new Repository(configuration)
})

domain.factory('server', function(configuration, repository) {
	
	return new Server(configuration, repository)
})
```
### domain.start()

Boots all instances in this domain and caches within the domain.

	domain.start()

### domain.singleton()

Returns a singleton instance from the domain. Will automatically start() the domain if not already started.

	var instance = domain.singleton('server')

### domain.transient()

Returns a transient (new) instance from the domain.

	var instance = domain.transient('server')
