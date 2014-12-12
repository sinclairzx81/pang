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

/// <reference path="references/node.d.ts" />

module pang {

    export class Dependency {

        constructor(public domain     : pang.Domain,

                    public name       : string,

                    public names      : string[],

                    public initializer : (...args: any[]) => any,

                    public initialized : boolean,

                    public instance    : any) {
        }

        public boot(): void {

            if (!this.initialized) {
                
                var dependancies = this.names.map((name, index, list) => {

                    var dependency = this.domain.get_dependency(name)

                    if (dependency) {

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

        private fs           : typeof fs   = require('fs')

        private path         : typeof path = require('path')

        private dependencies : pang.Dependency[]

        constructor() {

            this.dependencies = []
        }

        //----------------------------------------------
        // create config dependency
        //----------------------------------------------

        public config(name: string, filename: string) : pang.Domain {

            this.dependencies.push(new Dependency(this, name, [], () => {

                var directory = this.path.dirname(filename)

                return JSON.parse(this.fs.readFileSync(filename, 'utf8')
                                                    
                                            .replace(new RegExp('~', 'g'), directory)
                                                   
                                            .replace(/\\/g, '/'))                       
            }, false, null))

            return this
        }

        //----------------------------------------------
        // create a new dependency
        //----------------------------------------------

        public factory(name: string, initializer: (...args: any[]) => any): pang.Domain {

            if (this.isfunction(initializer)) {
                
                var names = this.extractargs(initializer)
        
                this.dependencies.push(new Dependency(this, name, names, initializer, false, null))

                return this
            }
            
            this.dependencies.push(new pang.Dependency(this, name, [], () => {
                
                return initializer

            }, false, null))

            return this
        }

        //----------------------------------------------
        // returns a single instance of this dependency
        //----------------------------------------------

        public singleton(name: string): any {

            var dependency = this.get_dependency(name)

            var instance   = null

            if (dependency) {

                dependency.boot()

                instance = dependency.instance
            }

            return instance
        }

        //----------------------------------------------
        // returns a new instance of this dependency
        //----------------------------------------------

        public transient(name: string): any {

            var domain = new pang.Domain()

            for (var i = 0; i < this.dependencies.length; i++) {

                domain.dependencies.push(new Dependency(domain, this.dependencies[i].name,

                                                                this.dependencies[i].names,

                                                                this.dependencies[i].initializer,

                                                                false, null))
            }

            var dependency = domain.get_dependency(name)

            var instance   = null

            if (dependency) {

                dependency.boot()

                instance = dependency.instance
            }

            domain.dependencies = []

            return instance
        }

        //----------------------------------------------
        // starts all dependencies 
        //----------------------------------------------

        public start(): void {

            for (var i = 0; i < this.dependencies.length; i++) {

                this.dependencies[i].boot()
            }
        }

        //----------------------------------------------
        // returns a single instance of this dependency
        //----------------------------------------------

        public get_dependency(name: string): pang.Dependency {

            for (var i = 0; i < this.dependencies.length; i++) {

                if (this.dependencies[i].name == name) {

                    return this.dependencies[i]
                }
            }

            return null
        }


        //----------------------------------------------
        // tests for a function
        //----------------------------------------------

        private isfunction(obj: any): boolean {

            var getType = {}

            return obj && getType.toString.call(obj) === '[object Function]'
        }

        //----------------------------------------------
        // extracts parameter names from a function
        //----------------------------------------------

        private extractargs(func: Function): string[] {

            var match = /\(([^)]+)/.exec(func.toString())

            if (match)  {

                if (match[1]) { 
                    
                    return match[1].split(/\s*,\s*/)
                }
            }

	        return []
        }
    }

    //----------------------------------------------
    // returns a new domain
    //----------------------------------------------

    export function domain(): pang.Domain {

        return new pang.Domain()
    }
}

//-----------------------------
// export
//-----------------------------

module.exports = pang