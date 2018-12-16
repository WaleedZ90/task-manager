import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import LandingPage from '../../components/LandingPage';
import DetailsPage from '../../components/DetailsPage';
import NotFound from '../../components/NotFound';
import './styles.scss';

export default class MainLayout extends Component {
	render() {
		return (
			<article className="main-layout-container container">
				<Header />
				<Router>
					<section className="app-body-section">
						<Route exact path="/" component={LandingPage} />
						<Route exact path="/tasks" component={LandingPage} />
						<Route path="/tasks/:id" component={DetailsPage} />
						{/* TODO: Handle the fall back route */}
						{/* <Route component={NotFound} /> */}
					</section>
				</Router>
				<Footer />
			</article>
		);
	}
}
