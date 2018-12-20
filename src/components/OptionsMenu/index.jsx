import React, { Component } from 'react';
import './styles.scss';

class OptionsMenu extends Component {
	state = {
		showMenu: false
	};

	componentDidMount() {
		document.addEventListener('mousedown', this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	handleClickOutside = (e) => {
		if (this.optionsMenu && !this.optionsMenu.contains(e.target)) {
			this.setState({ showMenu: false });
		}
	};

	toggleOptionsContainer = () => {
		this.setState({ showMenu: !this.state.showMenu });
	};

	render() {
		const { showMenu } = this.state;
		const { children } = this.props;

		return (
			<nav ref={(node) => (this.optionsMenu = node)} className="options-menu-container">
				<button onClick={this.toggleOptionsContainer}>
					<i className="fas fa-ellipsis-v" />
				</button>
				<div className={`options-items-container ${showMenu ? 'show-options-menu' : 'hide-options-menu'}`}>
					{children}
				</div>
			</nav>
		);
	}
}

export default OptionsMenu;
