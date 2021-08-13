# Autoload express routes.

Automatically load expressJS routes from a directory.

Supports setting a *path* directory and allows *recursive* loading from a directory and sub-directories.

## Installation

```
npm install expressjs.routes.autoload --save
```

## Usage javascript

```javascript
const { RoutesLoader } = require('expressjs.routes.autoload');
app.use(RoutesLoader(path.join(__dirname, './routes'), true));
```

Put your routes files within the **./routes** directory and add routes in individual files like this:

```javascript
module.exports = function(router){

	router.get('/', function(req, res) {
		res.json({hello:'world'});
	});

	return router;
}

```

## Usage typescript

```typescript
import { RoutesLoader } from 'expressjs.routes.autoload';
app.use(RoutesLoader(path.join(__dirname, './routes'), true));
```

Put your routes files within the **./routes** directory and add routes in individual files like this:

```typescript
import { Request, Response, Router } from 'express';

export default function (router: Router): Router {

    router.get('/', (_req: Request, res: Response) => {
        res.json({hello:'world'});
    });

    return router;
}

```

Please make sure that all files and routes in the routes directory are in the specified format in order to work.

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

* 0.2.0 Typescript support
* 0.1.9 Version bump mocha
* 0.1.8 Version bump express
* 0.1.7 Ignoring other files in routes systems (only loading .js files and ignoring temporary dev files, etc that previously broke the system)
* 0.1.6 Fixed readme + republished as a expressjs.routes.autoload / previously express.js.autoload
* 0.1.3 Fixed package.json typo
* 0.1.2 Fixed readme
* 0.1.1 Fixed paths
* 0.1.0 Initial release
