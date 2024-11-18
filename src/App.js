/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import ROUTES from "./url";
import { UserProvider, useUserDispatcher, useUserStore } from "./context/user";
import { useLocalStorage } from "react-use";
import USER_ACTIONS from "./context/user/user-actions";
import Shikshalokam from "./pages/shikshalokam";
import ShikshalokamVoiceBasedChat from "./pages/ShikshalokamVoiceChat/voice-chat";



function App() {
  const elements = useRoutes([
    ...clean_routes(protected_routes_config),
    ...clean_routes(unprotected_routes_config),
    ...clean_routes(unprotected_old_routes),
  ]);

  return (
    <React.Fragment>
      <UserProvider>{elements}</UserProvider>
    </React.Fragment>
  );
}

export default App;

const ProtectedComponent = ({ component, isAccessible }) => {
  const userStore = useUserStore();
  const userDispatcher = useUserDispatcher();

  const [localUserData] =
    useLocalStorage("grit", {});

  useEffect(() => {
    if (!!localUserData) {
      userDispatcher({
        type: USER_ACTIONS.LOGIN,
        payload: localUserData,
      });
    }

    return () => {};
  }, [localUserData]);

  if (!isAccessible) {
    return <Navigate to={"/page-not-found"} />;
  } else if (
    !Object.keys(userStore || localUserData || {})?.length &&
    !Object.keys(localUserData || {})?.length
  )
    return <Navigate to={ROUTES.LOGIN} />;

  return component;
};


const protected_routes = [

];

const unprotected_old_routes = [

  { path: ROUTES.SHIKSHALOKAM_VOICE_CHAT_LOGIN, element: <Shikshalokam type={'shikshalokam'} variant={'publicBot'}/> },
  { path: ROUTES.SHIKSHALOKAM_VOICE_CHAT, element: <ShikshalokamVoiceBasedChat type={'shikshalokam'} variant={'publicBot'}/>},
  
];

const unprotected_routes_config = [
];

const protected_routes_config = protected_routes.map((x) => ({
  ...x,
  caseSensitive: true,
  element: (
    <ProtectedComponent component={x.element} isAccessible={x?.isAccessible} />
  ),
}));

const clean_routes = (unpure_collection) =>
  unpure_collection.map((x) => ({
    path: x?.path,
    element: x?.element,
    caseSensitive: x?.caseSensitive,
  }));
/* eslint-disable react-hooks/exhaustive-deps */
