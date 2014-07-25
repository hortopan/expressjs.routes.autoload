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

Put your models within the **./routes** directory and add models in individual files like this:

```
module.exports = function(router){

        router.get('/', function(req, res) {

                res.json({hello:'world'});
                res.end();

        });

        return router;
}

```

Feel free to create your own hierarchy of files or directories!

Ex:

```
routes/api/item/get.js
routes/api/item/post.js
                
or 

routes/api_item_get.js
routes/api_item_delete.js
```

## Release History

* 0.1.3 Fixed package.json typo
* 0.1.2 Fixed readme
* 0.1.1 Fixed paths
* 0.1.0 Initial release
