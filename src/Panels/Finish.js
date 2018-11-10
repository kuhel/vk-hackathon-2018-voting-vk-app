import React from 'react';
import { Panel, PanelHeader, Button, Div } from '@vkontakte/vkui';

const Finish = (props) => {
	return (
		<Panel id={props.id}>
			<PanelHeader>Art of coding voting 2018</PanelHeader>

			<Div className='map'>
				<h2 style={{textAlign: 'center'}}>Голосование окончено</h2>
			</Div>
		</Panel>
	)
}

export default Finish;
