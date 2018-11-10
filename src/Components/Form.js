import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Group, List, ListItem, Avatar, PanelHeader, Button, Div, Radio, FormLayout, Slider } from '@vkontakte/vkui';

class Form extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visibility: {},
			deleteEnabled: false,
		};
	}

	componentDidMount() {
		this.setState({
			visibility: this.props.visibility,
			deleteEnabled: this.props.deleteEnabled,
		})
	}

	markName(value) {
		if (value <= 2 && value >= 0) {
			const mark = [
				'Нет 💩',
				'Скорее да, чем нет 😉',
				'Да! 😍'
			];
			return mark[value];
		} else {
			return 'Ошибка';
		}
	}

	nomintaionTitle(value) {
		if (value <= 7 && value >= 0) {
			const nominations = [
				'Уникальность/актуальность идеи проекта:',
				'Соответствие поставленной в кейсе задаче:',
				'Практическая применимость, возможность внедрения и использования:',
				'Дизайн и функциональность (наглядность, понятность интерфейса):',
				'Техническая (технологическая) реализуемость прототипа:',
				'Качество представления информации, проведения презентации прототипа:',
				'Законченность:',
			];
			return nominations[value];
		} else {
			return 'Ошибка';
		}
	}

	getTeamMark(id) {
		return [...this.props.marks].filter(mark => mark.id === id)[0].marks;
	}

	onClick = (team) => {
		let vis = this.state.visibility;
		vis[team.id] = !vis[team.id];
		this.setState({visibility: vis});
	}

	render() {
		const props = this.props;
		return (
			<Div>
				{props.teams && props.teams.map((team, teamIndex) => 
					<Group key={teamIndex} className={team.isSubmited ? 'disabled--opacity' : ''}>
						<List>
							<ListItem>
								<header onClick={() => this.onClick(team)} className='Team__header'>
									<h3>Team #{team.id} — {team.name}</h3>
									<button className={this.state.visibility[team.id] ? 'on' : ''}>
										<svg height="32" viewBox="0 0 48 48" width="32" xmlns="http://www.w3.org/2000/svg"><path d="M24 16l-12 12 2.83 2.83 9.17-9.17 9.17 9.17 2.83-2.83z"/><path d="M0 0h48v48h-48z" fill="none"/></svg>
									</button>
								</header>
								{this.state.visibility[team.id] ? <FormLayout className={team.isSubmited ? 'disabled' : ''}>
									{team.marks.map((mark, i) => {
										return (
											<div key={i}>
												<h4>{this.nomintaionTitle(i)}</h4>
												<Slider
													disabled
													step={1}
													min={0}
													max={2}
													onChange={value => {
														if (value !== this.getTeamMark(team.id)[i]) {
															props.setMark(value, team.id, i)
														}
													}}
													defaultValue={this.getTeamMark(team.id)[i]}
												/>
												<h5 style={{textAlign: 'center'}}>{this.markName(this.getTeamMark(team.id)[i])}</h5>
											</div>
										)
									})}
								</FormLayout> : null}
							</ListItem>
						</List>
						{this.state.visibility[team.id] ? <Div className={`vote-buttons ${team.isSubmited && !this.state.deleteEnabled ? 'disabled' : ''}`}>
							<Button className={this.state.visibility[team.id] ? '' : 'disabled'} size='l' stretched onClick={() => props.submitMarks(team.id)}>Отправить</Button>
							{this.state.deleteEnabled && <Button size='l' stretched onClick={() => props.deleteMarks(team.id)} level='outline'>Удалить</Button>}
							<div style={{paddingBottom: '20px'}}></div>
						</Div> : null}
					</Group>)
				}
			</Div>
		);
	}
}

export default Form;
