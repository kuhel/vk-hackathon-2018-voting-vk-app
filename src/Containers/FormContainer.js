import React from 'react';
import { Panel, Group, List, ListItem, Avatar, PanelHeader, Button, Div, Radio, FormLayout, Slider } from '@vkontakte/vkui';
import connect from '@vkontakte/vkui-connect';
import Form from '../Components/Form';
import compare from '../Utils/Equal';


class FormContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			marks: null,
		}
		this.setMark = this.setMark.bind(this);
	}

	submitMarks = (id) => {
		const mark = this.state.marks.filter(mark => mark.id === id);
		if (mark.length > 0) {
			this.props.addMark(mark[0]);
		}
	}

	componentDidMount() {
		this.setState({
			marks: this.props.marks,
		});
	}

	initialVisibility(teams) {
		let visibility = {};
		teams.forEach((team, i) => {
			visibility[team.id] = false;
		});
		return visibility;
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.marks && this.state.marks && !compare(nextState.marks, this.state.marks)) {
			return !compare(nextState.marks, this.state.marks);
		} else {
			return true;
		}
	}

	setMark(value, id, i) {
		const teams = [...this.state.marks];
		teams.map((team) => {
			if (team.id === id) {
				team.marks[i] = value;
			}
		});
		this.setState({ marks: teams });
	}

	render() {
		const props = this.props;
		return (
			<Panel id={props.id}>
				<PanelHeader>Art of coding voting 2018</PanelHeader>

				<Div className='map'>
					<h2>Teams</h2>
				</Div>

				{this.state.marks && <Form teams={props.teams} marks={this.state.marks} visibility={this.initialVisibility(props.teams)} setMark={this.setMark} submitMarks={this.submitMarks} />}
			</Panel>
		);
	}
}

export default FormContainer;
