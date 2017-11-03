import React from "react";
import pathToRegExp from "path-to-regexp";
import GameContainer from "./GameContainer";
import StatsContainer from "./StatsContainer";

function addPathRegExp(routeObj) {
  const keys = [];
  const pathRe = pathToRegExp(routeObj.path, keys);
  return {
    ...routeObj,
    toPath: pathToRegExp.compile(routeObj.path),
    test: path => pathRe.test(path),
    params: uri => {
      const parts = pathRe.exec(uri);
      if (!parts) {
        return null;
      } else {
        parts.splice(0, 1);
      }

      return keys.reduce((acc, key, index) => {
        acc[key.name] = parts[index];
        return acc;
      }, {});
    }
  };
}

const routes = [
  {
    path: "/",
    action: () => <GameContainer />
  },
  {
    path: "/stats/:id+",
    action: params => {
      return <StatsContainer id={params.id} />;
    }
  }
].map(addPathRegExp);

export default routes;
