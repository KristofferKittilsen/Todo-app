//React
import React, { ReactElement, useContext } from "react";
import { RouteComponentProps } from "react-router";
import { Redirect, Route } from "react-router-dom";

//Utils
import { AuthContext } from "../contexts/AuthContext";

interface IProtectedRoute {
    component: React.FC | React.FC<RouteComponentProps>,
    path: string,
    exact: boolean
}

export const ProtectedRoute = ({component, path, exact} : IProtectedRoute) : ReactElement => {

    const [user] = useContext(AuthContext)

    return user !== undefined ? 
        <Route path={path} component={component} exact={exact} /> :
        <Redirect to="/login" />

}