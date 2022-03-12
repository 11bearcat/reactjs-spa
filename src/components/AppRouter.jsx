import React, {useContext} from 'react';
import { Route, Routes } from "react-router-dom";
import {privateRoutes, publicRoutes} from "../router";
import Posts from "../pages/Posts";
import Login from "../pages/Login";
import {AuthContext} from "../context";
import Loader from "./UI/loader/Loader";

const AppRouter = () => {
	const {isAuth, isLoading} = useContext(AuthContext);

	if (isLoading) {
		return <Loader />
	}

	return (
		isAuth
			?
				<Routes>
					{privateRoutes.map((route, number) =>
						<Route
							key={number}
							path={route.path}
							element={route.element}
							exact={route.exact}
						/>
					)}
					<Route path="*" element={<Posts />} />
				</Routes>
			:
				<Routes>
					{publicRoutes.map((route, number) =>
						<Route
							key={number}
							path={route.path}
							element={route.element}
							exact={route.exact}
						/>
					)}
					<Route path="*" element={<Login />} />
				</Routes>
	);
};

export default AppRouter;