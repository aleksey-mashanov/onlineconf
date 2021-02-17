import * as React from 'react';
import clsx from 'clsx';
import { BrowserRouter, Route } from 'react-router-dom';
import { MuiThemeProvider, withStyles, WithStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

import createTheme from './theme';
import TopBar from './components/TopBar';
import LeftMenu, { leftMenuWidth } from './components/LeftMenu';
import ConfigTree from './components/ConfigTree';
import Servers from './components/Servers';
import Access from './components/Access';
import ErrorSnackbar from './components/ErrorSnackbar';
import GlobalLog from './components/GlobalLog';

import { getWhoAmI } from './api';

const theme = createTheme();

const styles = {
	root: {
	},
	menu: {
		width: leftMenuWidth,
	},
	main: {
		overflow: 'hidden',
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	mainShift: {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		[theme.breakpoints.up('sm')]: {
			marginLeft: leftMenuWidth,
		},
	},
};

interface AppState {
	userIsRoot: boolean;
	menu: boolean;
	search: string;
	searching: boolean;
	error?: Error;
}

export default withStyles(styles)(
	class App extends React.Component<WithStyles<typeof styles>, AppState> {

		state: AppState = {
			userIsRoot: false,
			menu: false,
			search: '',
			searching: false,
		};

		componentDidMount() {
			this.loadWhoAmI();
		}

		async loadWhoAmI() {
			try {
				const data = await getWhoAmI();
				this.setState({ userIsRoot: data.can_edit_groups });
			} catch (error) {
				this.handleError(error);
			}
		}

		handleMenuToggle = () => {
			this.setState(({ menu }) => ({ menu: !menu }));
		}

		handleMenuClose = () => {
			this.setState({ menu: false });
		}

		handleSearch = (term: string) => {
			this.setState({ search: term });
		}

		handleSearching = (searching: boolean) => {
			this.setState({ searching });
		}

		handleError = (error?: Error) => {
			this.setState({ error });
		}

		public render() {
			const { classes } = this.props;
			const mainClassName = clsx(classes.main, { [classes.mainShift]: this.state.menu });
			return (
				<MuiThemeProvider theme={theme}>
					<CssBaseline/>
					<BrowserRouter>
						<div className={this.props.classes.root}>
							<TopBar onMenu={this.handleMenuToggle} onSearch={this.handleSearch} searching={this.state.searching}/>
							<LeftMenu open={this.state.menu} onClose={this.handleMenuClose}/>
							<main className={mainClassName}>
								<Route exact path="/" render={props => <ConfigTree {...props} userIsRoot={this.state.userIsRoot} search={this.state.search} onSearching={this.handleSearching} onError={this.handleError}/>}/>
								<Route exact path="/history/" render={props => <GlobalLog {...props} onLoaded={() => null} onError={this.handleError}/>}/>
								<Route exact path="/server/" render={props => <Servers {...props} userIsRoot={this.state.userIsRoot} onError={this.handleError}/>}/>
								<Route exact path="/access-group/" render={props => <Access {...props} userIsRoot={this.state.userIsRoot} onError={this.handleError}/>}/>
							</main>
						</div>
					</BrowserRouter>
					<ErrorSnackbar error={this.state.error}/>
				</MuiThemeProvider>
			);
		}

	}
);
