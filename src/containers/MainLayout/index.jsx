import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchTaskCategories } from '../../redux/actions';
import Header from './Header';
import Footer from './Footer';
import LandingPage from '../LandingPage';
import DetailsPage from '../DetailsPage';
// import NotFound from '../NotFound';
import ErrorBoundary from '../../components/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.scss';

function mapStateToProps(state) {
	return {};
}
function mapDispatchToProps(dispatch) {
	return {
		fetchTaskCategories: () => dispatch(fetchTaskCategories())
	};
}
class MainLayout extends Component {
	componentWillMount() {
		const { fetchTaskCategories } = this.props;
		fetchTaskCategories();
	}
	render() {
		return (
			<article className="main-layout-container container">
				<Header />
				<ErrorBoundary>
					<Router>
						<section className="app-body-section">
							<Route exact path="/" component={LandingPage} />
							<Route exact path="/tasks" component={LandingPage} />
							<Route path="/tasks/:id" component={DetailsPage} />
							{/* TODO: Handle the fall back route */}
							{/* <Route component={NotFound} /> */}
						</section>
					</Router>
					<ToastContainer />
				</ErrorBoundary>
				{/* <Footer /> */}
			</article>
		);
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
