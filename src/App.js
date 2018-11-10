import React from 'react';
import connect from '@vkontakte/vkui-connect';
import { View } from '@vkontakte/vkui';
import Home from './Panels/Home';
import { ROUTES } from './config';
import '@vkontakte/vkui/dist/vkui.css';

const location = window.location.hash.substr(1);

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activePanel: ~ROUTES.indexOf(location) ? location : 'home',
			submittedTeams: [],
		};
	}

	componentDidMount() {
		connect.subscribe((e) => {
			if (e.detail.hasOwnProperty('type')) {
				switch (e.detail.type) {
					case 'VKWebAppAccessTokenReceived':
						this.setState({
							token: e.detail.data.access_token
						});
						this.getTeams();
						break;
					case 'VKWebAppCallAPIMethodResult':
						if (e.detail.data.request_id === '34bc') {
							if (e.detail.data.response.items.length > 0) {
								const teams = e.detail.data.response.items.map(team => {
									if (team.marks) {
										this.setSubmittedTeam(team.id);
									}
									return {
										...team,
										marks: team.marks ? team.marks : [0, 1, 2, 0, 1, 2, 0],
										isSubmited: team.marks ? true : false
									};
								}).sort((a, b) => a.isSubmited - b.isSubmited);
								this.setState({ teams });
							}
						}
						if (e.detail.data.request_id === '777c') {
							const id = e.detail.data.response.team_id;
							if (id) {
								this.setSubmittedTeam(id);
							}
						}
						break;
					default:
						break;
				}
			}
			// let teams = [
			// 	{
			// 		id: 22,
			// 		name: 'Lol'
			// 	},
			// 	{
			// 		id: 44,
			// 		name: 'Lucky boys'
			// 	},
			// 	{
			// 		id: 25,
			// 		name: 'LAL'
			// 	},
			// 	{
			// 		id: 43,
			// 		name: 'MUN'
			// 	}
			// ].map(team => {
			// 	return {
			// 		...team,
			// 		marks: team.marks ? team.marks : [0, 1, 2, 0, 1, 2, 0],
			// 		// isSubmited: team.marks ? true : false
			// 		isSubmited: !Math.round(Math.random())
			// 	};
			// }).sort((a, b) => a.isSubmited - b.isSubmited);
			// this.setState({ teams });
		});
		connect.send('VKWebAppGetUserInfo', {});
		this.getToken();
	}

	setSubmittedTeam(id) {
		let teams = this.state.submittedTeams;
		if (!~teams.indexOf(id)) {
			teams.push(id);
		}
		this.setState({
			submittedTeams: teams
		});
	}

	setMarksSubmitted(id) {
		const teams = [...this.state.marks];
		teams.map((team) => {
			if (team.id === id) {
				team.isSubmitted = true;
			}
		});
		this.setState({ marks: teams });
	}

	marksStructure(marks) {
		return marks && marks.map(team => {
			return {
				id: team.id,
				marks: team.marks,
			}
		});
	}

	getToken = () => {
		connect.send("VKWebAppGetAuthToken", {"app_id": 6747093, "scope": ""});
	}

	getTeams() {
		connect.send("VKWebAppCallAPIMethod", {
			'method': "hackathon.getTeams",
			'request_id': '34bc',
			'params': {
				'access_token': this.state.token,
				'v': '5.87',
			}
		});
	}

	addMark = (team) => {
		connect.send("VKWebAppCallAPIMethod", {
			'method': "hackathon.addMark",
			'request_id': '777c',
			'params': {
				'access_token': this.state.token,
				'v': '5.87',
				team_id: team.id,
				marks: JSON.stringify(team.marks),
			}
		});
	}
	mergeSubmitInfo(teams) {
		if (teams) {
			return teams.map(team => {
				if (~this.state.submittedTeams.indexOf(team.id) && !team.isSubmited) {
					team.isSubmited = true;
				}
				return team;
			})
		} else {
			return teams;
		}
	}

	setLocation = (route) => {
		if (route !== 'home') {
			connect.send('VKWebAppSetLocation', { location: route });
		} else {
			connect.send('VKWebAppSetLocation', { location: '' });
		}
	}

	go = (e) => {
		const route = e.currentTarget.dataset.to;
		this.setState({ activePanel: route })
		this.setLocation(route)
	};

	render() {
		return (
			<View activePanel={this.state.activePanel}>
				<Home id="home" submittedTeams={this.state.submittedTeams} go={this.go} teams={this.mergeSubmitInfo(this.state.teams)} marks={this.marksStructure(this.state.teams)} addMark={this.addMark} />
			</View>
		);
	}
}

export default App;
