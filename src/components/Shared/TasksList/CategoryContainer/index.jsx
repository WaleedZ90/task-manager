import React from 'react';
import './styles.scss';

const CategoryContainer = (props) => {
	const { children, categoryName } = props;
	return (
		<section className="category-container">
			<h2>{categoryName}</h2>
			{children}
		</section>
	);
};

export default CategoryContainer;
