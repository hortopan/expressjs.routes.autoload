#expressjs.routes.autoload

Automatically load expressJs routes from a directory.

Supports setting a *path* directory and allows *recursive* loading from a directory and sub-directories.

##Installation

``` 
npm install expressjs.routes.autoload
```

## Usage

```
app.use(require('expressjs.routes.autoload')(path = './routes', recursive = false));
```

Put your models within the **./rotes** directory and add models in files:

```
module.exports = function(router){

        router.get('/', function(req, res) {

                res.json({hello:'world'});
                res.end();

        });

        return router;
}

```

## Release History

* 0.1.0 Initial release
