import React from 'react';
import PropTypes from 'prop-types';
import FormContainer from '../Containers/FormContainer';

class Home extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const props = this.props;
		return props.marks ? <FormContainer isVoteFinished={props.isVoteFinished} isVoteStarted={props.isVoteStarted} deleteEnabled={props.deleteEnabled} teams={props.teams} marks={props.marks} id={props.id} addMark={props.addMark} deleteMark={props.deleteMark} /> : '';
	}
}

Home.propTypes = {
	id: PropTypes.string.isRequired,
	user: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
	geodata: PropTypes.shape({
		lat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		lng: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	}),
	go: PropTypes.func.isRequired,
};

export default Home;
