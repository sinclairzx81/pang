/*--------------------------------------------------------------------------
pang - A simple dependency injection library for nodejs

The MIT License (MIT)

Copyright (c) 2014 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
---------------------------------------------------------------------------*/

module pang {

    export class Dependency {

        constructor(public domain      : pang.Domain, 

                    public name        : string,

                    public names       : string[],

                    public initializer : (...args:any[]) => any,

                    public initialized : boolean,

                    public instance    : any) {
        }

        public boot (): void {

            if(!this.initialized) {

                var dependancies = this.names.map((name, index, list) => {

                    var dependency = this.domain.dependency(name)

                    if(dependency) {

                        dependency.boot()

                        return dependency.instance
                    }

                    return null
                })

                this.instance = this.initializer.apply(this, dependancies)

                this.initialized = true
            }
        }
    }

    export class Domain {

        private started      : boolean
        
        private dependencies : Dependency[]

        constructor () {

            this.started      = false

            this.dependencies = []
        }

        /**
        * sets up a factory on this domain
        */
        public factory    (name:string, initializer: (...args:any[]) => any) : Domain {

            if(!this.isfunction(initializer)) {

                throw Error('pang: initializer should be a function.')
            }

            var names      = this.extractargs(initializer)

            var dependency = new Dependency(this, name, names, initializer, false, null)

            this.dependencies.push(dependency)

            return this
        }

        /**
        * returns a single instance of this dependency
        */
        public singleton  (name: string) : any {

            this.start()

            for(var i = 0; i < this.dependencies.length; i++) {

                if(this.dependencies[i].name == name) {

                    return this.dependencies[i].instance
                }
            }

            return null
        }

        /**
        * returns a transient / new instance of this dependency
        */
        public transient  (name: string) : any {

            var domain = new pang.Domain()

            for(var i = 0; i < this.dependencies.length; i++) {

                var dependency = new Dependency(domain, this.dependencies[i].name, this.dependencies[i].names, this.dependencies[i].initializer, false, null)

                domain.dependencies.push(dependency)
            }

            for(var i = 0; i < domain.dependencies.length; i++) {

                if(domain.dependencies[i].name == name) {

                    domain.dependencies[i].boot()

                    var instance = domain.dependencies[i].instance

                    domain.dependencies = []

                    return instance
                }
            }
            
            domain.dependencies = []

            return null
        }

        /**
        * returns a dependency managed in this domain.
        */
        public dependency (name: string) : Dependency {

            for(var i = 0; i < this.dependencies.length; i++) {

                if(this.dependencies[i].name == name) {

                    return this.dependencies[i]
                }
            }

            return null
        }

        /**
        * starts the domain
        */
        public start(): void {

            if(!this.started) {
                
                this.started = true
                
                for(var i = 0; i < this.dependencies.length; i++) {

                    this.dependencies[i].boot()
                }
            }
        }

        /**
        * tests this object to ensure its a function
        */
        private isfunction(obj:any) : boolean {

            var getType = {};
            
            return obj && getType.toString.call(obj) === '[object Function]'
        }

        /**
        * extracts the arguments from this function
        */
        private extractargs(func: Function) : string[] {

	        var match = /\(([^)]+)/.exec(func.toString())
	        
            if(!match) {

                return []
            }

            if (match[1]) {

		        var arguments = match[1].split(/\s*,\s*/)
	        }

	        return arguments
        }
    }

    /**
    * returns a new domain
    */
    export function domain () : Domain {

        return new Domain();
    }
}

//-----------------------------
// export
//-----------------------------

declare var module: any

module.exports = pang