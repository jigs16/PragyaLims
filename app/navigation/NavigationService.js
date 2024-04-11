import * as React from "react";
export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export const changeStack = (stackName) => {
  resetRoot(stackName);
};

const resetRoot = (routeName) => {
  navigationRef.current?.resetRoot({
    index: 0,
    routes: [{ name: routeName }],
  });
};

export const navigateRoute = (routeName, params) => {
  navigationRef.dispatch(
    CommonActions.navigate({
      name: routeName,
      params: params,
    })
  );
};

export function goto(routeName, params) {
  navigationRef.navigate(routeName, params);
}
