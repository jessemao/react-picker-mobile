import React from 'react';
import ReactDOM from 'react-dom';
import Picker from '../../lib/react-mobile-picker';
import './index.css';

ReactDOM.render( <
	Picker slots = {
		[{
			flex: 1,
			values: [{
				id: '0'
			}, {
				id: '1'
			}, {
				id: '2'
			}, {
				id: '3'
			}, {
				id: '4'
			}, {
				id: '5'
			}, {
				id: '6'
			}, {
				id: '7'
			}, {
				id: '8'
			}, {
				id: '9'
			}],
			flex: 1,
			defaultIndex: 2,
			dataKey: 'id',
			className: 'slot1',
			textAlign: 'right',
		}, {
			divider: true,
			dividerContent: '-',
			className: 'slot2'
		}, {
			flex: 1,
			values: ['2015-01', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06'],
			className: 'slot3',
			textAlign: 'left'
		}]
	}
	rotateEffect = {
		true
	}
	visibleItemCount = {
		7
	}
	onChange = {
		(res) => console.log(res)
	}
	itemHeight = {
		48
	}
	/ > ,
	document.getElementById('root')
);
