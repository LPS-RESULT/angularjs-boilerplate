# AngularJS Boilerplate

This boilerplate is inspired by the Angular (2) build process; It is a combination of best practices,
experienced from different projects. This is an application template. It is a summary of about 5 years of
building web applications, and this app template demonstrates particularly, a full blown production-ready `AngularJS` app.

The term `app` is used to substitute the name of the application.

## Directory

The whole directory structure is meant to be bootstrapped directly to a "web" directory. A proxy server, `server.js` is available
to run and serve the frontend app (No backend)

The main folder contains all the whole frontend source files and is divided into subdirectories.

### Assets

The Assets folder contains all media files and json files that are required by the app to serve an aesthetic purpose.
Fonts are stored in the `fonts` folder. Images are stored in the `img` folder. Locales containing language mapping (for internationalization) are stored in
the `locales` folder. 

### Build

The Build folder is a temporary folder used by the app during the build process. Files here should be ignored.

### Dist

The Distribution folder is where the build process stores the final output version of the app that is production ready.
The proxy `server.js` simulates the production environment by serving the app through a separate `/prod` path.

### HTML

The HTML folder contains all html files. It would only contain html files since this configuration is taken advantage
by the build process. Html templates are automatically combined into js template files using `grunt-angular-templates` 
and packed to be cached by `$templateCache`

### JS

The JS folder contains all JavaScript files. Since we are using `AngularJS`, the angular modules make up the
directories. Each module directory is further divided into directories for their purpose - Since controllers are based
on features and UI (or widgets) they are further divided by their parts, while services and other AngularJS components
can be left undivided (by UI) since they are singletons.

### Style

The Style folder contains all style-related files, particularly css. It was separated with assets because it is possible
that you may want to use a compiler, like sass to generate css files.

## App Setup

First off install the app basic dependencies by:

    npm install
    
Then install grunt-cli

    npm install -g grunt-cli

And also karma (for testing)

    npm install -g karma-cli

### Building using Grunt

Most of the needed packages for grunt are already defined in `package.json`

To run grunt, simply execute the following where `Gruntfile.js` is found

    grunt

Or you may specify a command, simply refer to the Gruntfile. e.g.

    grunt karma
    
### Build Process Explained
The whole build process relies on the task-runner to streamline the steps. The `grunt` task-runner allows tasks to 
be declared with _grunt-plugins_. A grunt-plugin allows some customization, using a config json like the one below:

    sass: {
        dist: {
            options: {
                style: "compressed"
            },
            files: [{
                expand: true,
                cwd: 'style',
                src: ['**/*.scss'],
                dest: './style',
                ext: '.min.css'
            }]
        }
    }
    
The config above is for sass, that is in case you decide to use it.

#### Cleanup
Each build execution will probably generate and compile files, so a cleanup step is necessary to avoid generated 
duplicates. Since it would be difficult to differentiate generated files through their contents.

    grunt clean
    
This deletes `.sass-cache` which is a residue of the system as it compiles sass to css, This also clears up the 
`/build` and `/dist` folders

#### Template Compilation - (Unimplemented)
Angular is template based and it is very possible that each project will grow to use multiple partial-templates to make up
different components. This becomes problematic in production, since each partial template will be retrieved on-demand.
The solution is compiling them together and utilizing `$templateCache`; which stores the templates internally thru angular.
    
    grunt ngtemplates
    
This will compile all html files from the html directory. The resulting file would be a minified `templates.min.js`.
This is also helpful to **prevent cached html files**. And since this will result to one single file each time, adding
a build number to the resulting file will help the browser use the correct file.

_This section is unimplemented; to implement, simply add in Grunt file:_

    ngtemplates: {
        app: {
            src: '**/**.html',
            cwd: 'html',
            dest: './dist/js/templates.min.js', //name of compiled file
            options: {
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: false,
                    removeAttributeQuotes: true,
                    removeComments: false, // Only if you don't use comment directives!
                    removeEmptyAttributes: false,
                    removeRedundantAttributes: false,
                    removeScriptTypeAttributes: false,
                    removeStyleLinkTypeAttributes: false
                },
                module: "ci", //module it will be added to
                bootstrap: function(module, script) {
                    return '(function(angular){' + //wrap in anonymous function
                                '"use strict";' +
                                '' +
                                //Set the cache
                                'angular.module("ci",[]).run(["$templateCache",function($templateCache){' +
                                    script +
                                '}])' +
                            '})(angular)';
                }
            }
        },
        options: {
            prefix: './html/' //need to prefix the template names as ./html/... as if it is in dev
        }
    }

_For additional reference, [See grunt angular-templates](https://www.npmjs.com/package/grunt-angular-templates)_

#### Script Concat and Minify
Scripts are a big chunk of an angular application. Angular is declarative; although it is very structured and organized;
controllers tend to be long and multiple files for a particular feature is common. The trick is to concatenate the related
(by module) scripts files first in a certain order. Then minify them afterwards.
  
    grunt concat
    
This concatenates all subsidiary files for every module, each module would have `module-name.all.js` file

    grunt uglify
    
This will _uglify_ or minify all concatenated script files (*.all.js). The resulting file will be minified and would be
production-ready.

#### CSS Preprocessor - (Unimplemented)
A CSS preprocessor allows some cool features like stylesheet variables. Its compiler will also build to a minified version
already.
  
    grunt sass
    
_Since this is unimplemented, you may simply add this in Gruntfile to implement it:_

    sass: {
        dist: {
            options: {
                style: "compressed"
            },
            files: [{
                expand: true,
                cwd: 'style', //search for files under style directory
                src: ['**/*.scss'], //compile all scss files
                dest: './style', //add the compiled to same directory
                ext: '.min.css' //append suffix
            }]
        }
    }

This will process all `.sass` files found in the `/style` directory. The resulting css files would be already minified.
The only problem though, is that each sass file will generate a minified css counterpart; so a css concat step is still
a necessity.

#### Stylesheet Concat and Minify - (Unimplemented)
The CSS files will be placed in the same directories where their sass counterparts are found, but most of them are almost
related, so we concatenate them to their related module. To execute this simply invoke:

    grunt cssmin
    
The resulting concatenated (and re-minified) files are placed already in the `/dist` directory. Since this is unimplemented,
simply add to gruntfile to implement:

    cssmin: {
        target: {
            files: {
                "./dist/style/feature1.css": [
                    './style/feature1/part1.min.css',
                    './style/feature1/part2.min.css',
                    './style/feature1/part3.min.css',
                ]
            }
        }
    }
    
_Note that the parts css files are originally from scss files that were compiled; they refer to styles for parts of the
feature_

#### Unit Testing
Unit test are written using Jasmine Tests; it's a testing framework. Jasmine tests are ran using `grunt` 
which integrates with the `grunt-karma` plugin. Since karma itself has its own configuration file, just reference it in the
Grunt configuration:

    karma: {
        unit: {
            configFile: 'karma.config.js'
        }
    }

The karma config is pretty straightforward, you can check documentations about it in the 
[karma site](https://karma-runner.github.io). You can then run this task with the command:

    grunt karma

#### Finalize Library Dependencies
There are multiple libraries other than angular, that the project depends on.
We extract only the `dist` library files and simply place it in the `/lib` directory. A possible last step left in the build
process would be just copying the `/lib` directories to the output dist folder.
    
    grunt copy
   
Again if you need to make a new build for the app; simply invoke

    grunt
    
as this will execute all tasks in a certain order.

#### Gruntfile.js
Since minification is a standard build process for production deployment, whenever a new file is added; that file should
be declared in the `src` array for found in the `concat` task - or you can just use regex to match multiple files; but sometimes
being declarative is helpful.

    src: [
        './js/util/util.js',  //Module definition appears first
        './js/util/controllers/popupController.js',
        //OTHER STUFF
    ]

This is generally true when you are adding a new file (like an angular service or factory to an existing module) otherwise, 
if a new module should be declared; it should have its own separate `min` destination (a different `dest` thus a different config)

    new_module: {
        src: [
            './js/new-module/new-module.js',

            './js/new-module/controllers/somethingController.js',
            // OTHER STUFF
        ],
        dest: './build/new-module.all.js'
    },

And a new module means a new setting for the `uglify` task:

    uglify: {
        new_module: {
            src: './build/new-module.all.js', 
            dest: './dist/js/new-module.min.js'
        },
        // OTHER STUFF
    }
    
The `build_placeholder`, it happens to be accessed during the build process of the OWM app; during the build,
that line is replaced by the new build number.

#### loader.js and fallback.js
You can look at [Fallback Website](http://fallback.io) for more information about fallbacking.

The declaration of a new file is one thing, setting up a new library is another. In the production environment, 
the app should run a special script called `fallback`, which enables the app to utilize CDN resource first, and only 
_falls back_ to the server file if all else fails.  The `loader.js` contains all those configuration:

    "jQuery":[
        "http://code.jquery.com/jquery-2.2.3.min.js",
        "./dist/js/lib/jquery-2.2.3.min.js"
    ]

### Karma-Jasmine Testing

Make sure karma is installed first (of course). Executing:

    karma start
    
will run the karma test server. By default test server will show results in the path: [http://localhost:9876/](http://localhost:9876/)

Karma watches the changes on the watched files, and whenever save is hit, a new test is run. While the karma server
is running, you may execute:

    karma run
    
to run the test scripts (without having to change files). Depending on the number of Jasmine suites in the test specs, all
spec files should be run to unit test all components.

### Development using dev.html

Development and Production modes are clearly separated. Dev mode allows you to work separately on the scripts and
templates, and find the problems in debug mode (since the files are not yet minified)

You may run the proxy `server.js` via

    node server.js
    
and open in the browser `http://localhost:8080/dev`

### Production using prod.html

In Production mode, always refer to `loader.js` and `Gruntfile.js` to see if all necessary files have been set. Unlike
dev, the production mode needs extra care and test because files here are minified so it would be really difficult to
debug at this stage. In this phase, it would be best to execute profiling processes and benchmarking tests, because
this is the fastest "form" in which your app will ever be.

Similar to dev, may run the proxy `server.js` via

    node server.js
    
and open in the browser `http://localhost:8080/prod`

### Testing using karma

Make sure karma is installed first. Executing:

    karma start
    
will run the karma test server. By default test server will show results in the path: `http://localhost:9876/`

Karma watches the changes on the watched files, and whenever save is hit, a new test is run. While the karma server
is running, you may execute:

    karma run
    
to run the test scripts (without having to change files)

### Running the App

When `server.js` is run, two versions of the app will be served on the following paths:

- [http://localhost:8080/dev/](http://localhost:8080/dev/) - The Development environment; using `dev.html`

- [http://localhost:8080/prod/](http://localhost:8080/prod/) - The Production environment; using `prod.html`

Take note that production environment uses the `/dist` folder and has extra features like concat and minify,
 which are handled during the build process. It also uses fallback library to load the scripts thru `xhr` 
 (not thru `<script>`) for improved network latency
 
On the other hand, the development environment uses `dev.html` and uses directly the source files 
(no build required)

## Angular Script Templates
Angular module components (like `factory` and `provider`) are strictly used to differentiate different files based on their individual purpose.

Scripts are enclosed in anonymous function execution blocks:

    (function(angular){
       "use strict";
        
        //Code content here
        
    })(angular);

### Modules
Module definitions declare the modules and their module dependencies.

    angular.module("name.of.module",[
        "dependency.module.1",
        "dependency.module.2"
    ]);
    
### Constants
Constants can be declared in the app. Usually we store keys and enumerations here:

    angular.module("name.of.module")
        .constant("featureNameConstants",{
            constant1: "constantValue1",
            constant2: "constantValue2"
        });
        
### Values
Value services store values that can be shared across different services.

    angular.module("name.of.module")
        .value("featureNameValues",{
            value1: "actualValue1",
            value2: "actualValue2"
        });

### Providers
A provider is a configurable service. A config function should be exposed.

    angular.module("name.of.module")
        .provider("featureName",[
            function(){
                var config = {};
                
                this.$get = ["dependency1"," dependency2",
                    function(dependency1,dependency2){
                        var FeatureName = function(){
                            //Feature logic here
                        };
                        
                        return FeatureName;
                    }
                ];
                
                this.config = function(k,v){
                    if(k && v && typeof k == "string"){
                        config[k] = v;
                    }else if(typeof k == "string"){
                        return config[k];
                    }else if(typeof k == "object"){
                        config = k;
                    }else{
                        throw Error("Unsupported");
                    }
                }
            }
        ]);

A provider is similar to a factory as it exports the return value of the function itself; but since it provides the
flexibility of being configurable, most framework services are written using providers.
    
    var $utilityWrapper = function(fn){
        // factory for building the wrapper
        
        // config variable is scoped to the provider function (not the $get)
        // so a service, once configured can't be changed
        doSomething(config.someProperty);
    };
        
    $utilityWrapper.doStatic = function(){
        // this is a static function
        // and accessible directly
    };
        
    // the wrapper service is exported
    return $utilityWrapper;  

Some services that are have minimal dependencies with the app (which means they are most likely candidates for reuse)
are named to look like angular standard services; take `$localization` service for example.

### Factory
A non configurable version of a provider is called a factory

    angular.module("name.of.module")
        .factory("featureName",["dependency1"," dependency2",
            function(dependency1,dependency2){
                var FeatureName = function(){
                    //Feature logic here
                };
                
                return FeatureName;
            }
        ]);

A factory returns whatever is returned in the factory function. Which means it provides the flexibility to export function
constructors; this is why most of the models are using factory.

### Service
A service exports the function directly

    angular.module("name.of.module")
        .service("featureName",["dependency1"," dependency2",
            function(dependency1,dependency2){
                this.exportFunction = function(a,b){
                    //function logic
                };
                //Feature logic here
            }
        ]);
        
We strictly use services for exporting pure non-dependent functions - functions that only rely on parameters.

### Run block
A function that is called once after bootstrapping the application. Listeners are declared here;

    angular.module("name.of.module")
        .run(["dependency1"," dependency2",
            function(dependency1,dependency2){
                dependency1.doSomething();
                //Feature logic here
            }
        ]);

### Controller
A function that is executed when compiling a directive/component that is bound to some UI.

    angular.module("name.of.module")
        .controller("featureNameController",["$scope","dependency1"," dependency2",
            function($scope,dependency1,dependency2){
                $scope.scopeFunction = function(){
                    //exposed function to template
                };
                //Feature logic here
            }
        ]);

### Config
Configures providers to modify the service's behaviors and settings.

    angular.module("name.of.module")
        .config(["dependency1Provider"," dependency2Provider",
            function(dependency1Provider,dependency2Provider){
                dependency1Provider.config({
                    //configuration here
                });
            }
        ]);

### Directive
Directives enhances the templates and wires them with controllers and functions already. A `link` function defines how
a widget is compiled by angular and how it operates.

    angular.module("name.of.module")
        .directive('directiveName', ['$compile', '$parse',
            function ($compile, $parse) {
                return {
                    restrict: 'A',
                    terminal: true,
                    priority: 100000,
                    link: function (scope, elem) {
                        //do something with the element here
                        $compile(elem)(scope);
                    }
                };
            }
        ]);
        
To use this directive in the template; simply follow the camel case and convert to snake case:

    <div directive-name>
        <!-- OTHER STUFF --->
    </div>

_Last Updated: 2/25/2019, Jason Wong_