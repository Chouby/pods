import React from 'react';
import * as PropTypes from 'prop-types';
import { DragLayer } from 'react-dnd';

import { Dashicon } from '@wordpress/components';
import { DRAG_ITEM_TYPES } from 'dfv/src/admin/edit-pod/store/constants';

const getLayerStyles = ( { item } ) => {
	return {
		position: 'fixed',
		opacity: .6,
		pointerEvents: 'none',
		zIndex: 100,
		left: item.left,
		top: 0,
		width: '100%',
		height: '100%',
	};
};

// Lock the dragging axis
const getItemStyles = ( { item, initialOffset, currentOffset } ) => {
	if ( ! initialOffset || ! currentOffset ) {
		return {
			display: 'none',
		};
	}
	return {
		width: item.width,
		transform: `translate(${ initialOffset.x }px, ${ currentOffset.y }px`,
		filter: 'drop-shadow(5px 5px 5px #BBB)',
	};
};

const CustomDragLayer = ( props ) => {
	const { item, itemType, isDragging } = props;

	if ( ! isDragging || DRAG_ITEM_TYPES.GROUP !== itemType ) {
		return null;
	}

	return (
		<div style={ getLayerStyles( props ) }>
			<div style={ getItemStyles( props ) }>
				<div
					className="pods-field-group-wrapper"
					style={ { cursor: 'ns-resize' } }
				>
					<div className="pods-field-group_title">
						<div className="pods-field-group_name">
							<div className="pods-field-group_handle">
								<Dashicon icon="menu" />
							</div>

							{ item.groupLabel }
						</div>

						<div className="pods-field-group_manage">
							<div className="pods-field-group_toggle">
								<Dashicon icon={ 'arrow-down' } />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

CustomDragLayer.propTypes = {
	item: PropTypes.shape( {
		groupName: PropTypes.string,
		groupLabel: PropTypes.string,
		groupID: PropTypes.number,
		index: PropTypes.number.isRequired,
	} ),
	itemType: PropTypes.string,
	isDragging: PropTypes.bool.isRequired,
	currentOffset: PropTypes.shape( {
		x: PropTypes.number,
		y: PropTypes.number,
	} ),
	initialOffset: PropTypes.shape( {
		x: PropTypes.number,
		y: PropTypes.number,
	} ),
};

export default DragLayer( ( monitor ) => {
	return {
		item: monitor.getItem(),
		itemType: monitor.getItemType(),
		initialOffset: monitor.getInitialSourceClientOffset(),
		currentOffset: monitor.getSourceClientOffset(),
		isDragging: monitor.isDragging(),
	};
} )( CustomDragLayer );

