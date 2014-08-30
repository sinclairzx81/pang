/*--------------------------------------------------------------------------
Pang - A simple dependency injection  lbrary for nodejs
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
var pang;
(function (pang) {
    var KernelDependency = (function () {
        function KernelDependency(kernel, name, names, initializer, initialized, instance) {
            this.kernel = kernel;
            this.name = name;
            this.names = names;
            this.initializer = initializer;
            this.initialized = initialized;
            this.instance = instance;
        }
        KernelDependency.prototype.initialize = function () {
            var _this = this;
            if (!this.initialized) {
                var dependancies = this.names.map(function (name, index, list) {
                    var dependency = _this.kernel.get(name);

                    if (dependency) {
                        dependency.initialize();

                        return dependency.instance;
                    }

                    return null;
                });

                this.instance = this.initializer.apply(this, dependancies);

                this.initialized = true;
            }
        };
        return KernelDependency;
    })();
    pang.KernelDependency = KernelDependency;

    var Kernel = (function () {
        function Kernel() {
            this.dependencies = [];
        }
        Kernel.prototype.factory = function (name, names, initializer) {
            var dependency = new KernelDependency(this, name, names, initializer, false, null);

            this.dependencies.push(dependency);

            return this;
        };

        Kernel.prototype.get = function (name) {
            for (var i = 0; i < this.dependencies.length; i++) {
                if (this.dependencies[i].name == name) {
                    return this.dependencies[i];
                }
            }

            return null;
        };

        Kernel.prototype.start = function () {
            for (var i = 0; i < this.dependencies.length; i++) {
                this.dependencies[i].initialize();
            }
        };
        return Kernel;
    })();
    pang.Kernel = Kernel;

    function kernel() {
        return new Kernel();
    }
    pang.kernel = kernel;
})(pang || (pang = {}));


module.exports = pang;
