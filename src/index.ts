import { Router } from "express";

export function RoutesLoader(
  loadPath: string,
  options: { recursive?: boolean } = {}
): Router {
  const recursive: boolean = options.recursive !== false; // defaults to true

  const express = require("express");
  const fs = require("fs");
  const path = require("path");

  let router = express.Router();

  if (!loadPath) loadPath = "./routes";

  const walk = (dir: string) => {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    list.forEach((file: string) => {
      file = dir + "/" + file;
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(file));
      } else {
        results.push(file);
      }
    });
    return results;
  };

  let files = recursive ? walk(loadPath) : fs.readdirSync(loadPath);

  /**
   * =======================================
   * ROUTE RANKING
   */

  // From lowest (0) to highest (4) score.
  const SCORES = {
    EMPTY: 0,
    INDEX: 1,
    SPLAT: 2, // wildcard
    OPTIONAL: 3,
    DYNAMIC: 4, // route params
    STATIC: 5, // named routes
  };

  /**
   * These is similar to react-router score algorithm:
   * https://github.com/remix-run/react-router/blob/6b44e99f0b659428ce2ec8d5098e90c7fddda2c5/packages/react-router/lib/router.ts#L243-L274
   *
   * The difference being; this algorithm compares segment to segment instead of
   * computing the score for the entire route.
   */
  function getSegmentScore(segment: string = "") {
    segment = segment.replace(path.extname(segment), ""); // remove extension

    if (!segment) {
      return SCORES.EMPTY;
    } else if (/^index$/.test(segment)) {
      return SCORES.INDEX; // index files should be run last for error handling
    } else if (segment === "*") {
      return SCORES.SPLAT;
    } else if (/\?$/.test(segment)) {
      return SCORES.OPTIONAL; // optional, i.e. ends with "?"
    } else if (/^:/.test(segment)) {
      return SCORES.DYNAMIC; // params, i.e. starts with ":"
    }

    return SCORES.STATIC; // anything else (i.e. named routes)
  }

  /**
   * This sort algorithm compares each route segment by segment to determine
   * its priority. The higher the score of the segment; the earlier it will be
   * added to the routes.
   *
   * For example, named routes should have higher priority over :params,
   * otherwise, the named route will never be hit. Similarly, index files in
   * any directory should be executed last to allow adding error handlers, etc.
   *
   * Sample:
   *  - '/api/articles/:year/december/:day.js', // december > :month
   *  - '/api/articles/:year/:month/:day.js', // :month > :month?
   *  - '/api/articles/:year/:month?.js', // :month? > *
   *  - '/api/articles/:year/*.js', // * > index
   *  - '/api/articles/:year/index.js', // last to be executed in '/api/articles/:year'
   *  - '/api/articles/index.js',
   *  - '/api/items/thing.js',
   *  - '/api/items/:type.js',
   *  - '/api/items/*.js',
   *  - '/api/items/index.js',
   *  - '/api/index.js',
   *  - '/index.js'
   */
  const segmentScores: { [key: string]: number } = {}; // memoize segment scores
  files.sort((entry_a: string, entry_b: string) => {
    const split_a = entry_a.split("/");
    const split_b = entry_b.split("/");
    const maxNestingLevel = Math.max(split_a.length, split_b.length);
    for (let i = 0; i < maxNestingLevel; i++) {
      const folder_a = split_a[i];
      const folder_b = split_b[i];
      const spec_a = (segmentScores[folder_a] =
        segmentScores[folder_a] || getSegmentScore(folder_a));
      const spec_b = (segmentScores[folder_b] =
        segmentScores[folder_b] || getSegmentScore(folder_b));
      if (folder_a === folder_b) {
        continue;
      } else if (spec_a === SCORES.STATIC && spec_b === SCORES.STATIC) {
        return folder_a < folder_b ? -1 : 1; // alphabetical
      } else if (spec_a === spec_b) {
        continue;
      } else {
        return spec_b - spec_a;
      }
    }
    return 0; // routes have same score
  });

  /**
   * =======================================
   */

  for (const entry of files) {
    const file = recursive
      ? path.resolve(entry)
      : path.resolve(loadPath, entry);

    if (
      fs.statSync(file).isFile() &&
      [".js", ".ts"].indexOf(path.extname(file).toLowerCase()) !== -1 &&
      path.basename(file).substr(0, 1) !== "."
    ) {
      try {
        const r = require(file);
        router = (r.default || r)(router);
      } catch (e) {
        throw new Error(
          "Error when loading route file: " + file + " [" + e.toString() + "]"
        );
      }
    }
  }

  return router;
}
