import React from 'react';
import { Panel, PanelHeader, Button, Div } from '@vkontakte/vkui';

const Start = (props) => {
	return (
		<Panel id={props.id}>
			<PanelHeader>Art of coding voting 2018</PanelHeader>

			<Div className='map'>
				<h2 style={{textAlign: 'center'}}>Start the vote!</h2>
			</Div>
		</Panel>
	)
}

export default Start;
