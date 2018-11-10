import React from 'react';
import connect from '@vkontakte/vkui-connect';
import { View } from '@vkontakte/vkui';
import Home from './Panels/Home';
import Start from './Panels/Start';
import Finish from './Panels/Finish';
import { ROUTES } from './config';
import '@vkontakte/vkui/dist/vkui.css';

const location = window.location.hash.substr(1);

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activePanel: ~ROUTES.indexOf(location) ? location : 'home',
			submitedTeams: [],
			deleteEnabled: false,
			// isVoteStarted: true,
			// isVoteFinished: false,
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
							let state = {};
							if (e.detail.data.response.hasOwnProperty('is_delete_enabled')) {
								state.deleteEnabled = e.detail.data.response.is_delete_enabled;
							}
							if (e.detail.data.response.hasOwnProperty('is_vote_start')) {
								state.isVoteStarted = e.detail.data.response.is_vote_start;
							}
							if (e.detail.data.response.hasOwnProperty('is_vote_finish')) {
								state.isVoteFinished = e.detail.data.response.is_vote_finish;
							}
							if (e.detail.data.response.items.length > 0) {
								const teams = e.detail.data.response.items.map(team => {
									if (team.marks) {
										this.setSubmitedTeam(team.id);
									}
									return {
										...team,
										marks: team.marks ? team.marks : [1, 1, 1, 1, 1, 1, 1],
										isSubmited: team.marks ? true : false
									};
								}).sort((a, b) => a.isSubmited - b.isSubmited);
								state.teams = teams;
							}
							this.setState({
								...state,
							})
						}
						if (e.detail.data.request_id === '777c') {
							const id = e.detail.data.response.team_id;
							if (id) {
								this.setSubmitedTeam(id);
							}
						}
						if (e.detail.data.request_id === '999a') {
							const id = e.detail.data.response.team_id;
							if (id) {
								this.deleteSubmitedTeam(id);
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

	setSubmitedTeam(id) {
		let teams = this.state.submitedTeams;
		if (!~teams.indexOf(id)) {
			teams.push(id);
		}
		this.setState({
			submitedTeams: teams
		});
	}

	deleteSubmitedTeam(id) {
		let teams = this.state.submitedTeams;
		let _teams = this.state.teams.map(team => {
			if (team.id === id) {
				team.isSubmited = false
			}
			return team;
		});
		if (~teams.indexOf(id)) {
			teams.splice(teams.indexOf(id), 1);
		}
		this.setState({
			submitedTeams: teams,
			teams: _teams,
		});
	}

	setMarksSubmited(id) {
		const teams = [...this.state.marks];
		teams.map((team) => {
			if (team.id === id) {
				team.isSubmited = true;
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

	deleteMark = (team) => {
		connect.send("VKWebAppCallAPIMethod", {
			'method': "hackathon.delMark",
			'request_id': '999a',
			'params': {
				'access_token': this.state.token,
				'v': '5.87',
				team_id: team.id,
			}
		});
	}

	mergeSubmitInfo(teams) {
		if (teams) {
			return teams.map(team => {
				if (~this.state.submitedTeams.indexOf(team.id) && !team.isSubmited) {
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
				<Home id='home' isVoteFinished={this.state.isVoteFinished} isVoteStarted={this.state.isVoteStarted} deleteEnabled={this.state.deleteEnabled} submitedTeams={this.state.submitedTeams} go={this.go} teams={this.mergeSubmitInfo(this.state.teams)} marks={this.marksStructure(this.state.teams)} addMark={this.addMark} deleteMark={this.deleteMark} />
			</View>
		);
	}
}

export default App;
