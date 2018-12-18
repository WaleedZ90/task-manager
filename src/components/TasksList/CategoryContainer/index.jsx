import React, { Component } from 'react';
import './styles.scss';

class CategoryContainer extends Component {
	state = {
		isExpanded: false
	};

	toggleCategoryContainer = () => {
		this.setState({ isExpanded: !this.state.isExpanded });
	};

	render() {
		const { isExpanded } = this.state;
		const { children, categoryName } = this.props;
		return (
			<section className="category-container container-fluid">
				<header className="category-container-header" onClick={this.toggleCategoryContainer}>
					<h2>{categoryName}</h2>
					<i className={`fas ${isExpanded ? 'fa-angle-up' : 'fa-angle-down'}`} />
				</header>
				<div
					className={`row category-container-body ${isExpanded
						? 'expand-category-container'
						: 'collapse-category-container'}`}
				>
					{children}
				</div>
			</section>
		);
	}
}

export default CategoryContainer;
