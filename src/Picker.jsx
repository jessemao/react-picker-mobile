import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import PickerSlot from './PickerSlot';
import './Picker.css';

class Picker extends Component {
  constructor(props) {
    super(props);
    const defaultValue = this.getInitValue(props) || [];
    this.state = {
      pickValue: defaultValue,
    };
  }
  getInitValue(props) {
    return props.pickerSlots.map((slot) => {
      const defaultIndex = slot.defaultIndex || 0;
      if (slot.options) {
        const res = slot.options[defaultIndex];
        if (typeof res === 'object') {
          return slot.dataKey ? res[slot.dataKey] : '';
        } else {
          return res;
        }
        return res || '';
      } else {
        return '';
      }
    });
  }
  onSlotChange = (value, slotIndex) => {
    let changedValue = Object.assign({}, this.state.pickValue, {
      [slotIndex]: value
    })
    this.setState({
      pickValue: changedValue
    });
    const resultValue = []
    for (var key in changedValue) {
      if (changedValue.hasOwnProperty(key) && changedValue[key]) {
        var element = changedValue[key];
        resultValue.push(element);
      }
    }
    this.props.onChange(resultValue);
  }
  renderPickSlot() {
    const {pickerSlots, visibleItemCount, rotateEffect, itemHeight} = this.props;
    const {pickValue} = this.state;
    return pickerSlots.map((slot, idx) => {
      const values = slot.options ? slot.options.map((d) => {
        if (typeof d === 'object') {
          return slot.dataKey ? d[slot.dataKey] : '';
        }
        return d;
      }) : []

      const props = {
        className: slot.className,
        divider: slot.divider,
        dividerContent: slot.dividerContent,
        key: idx,
        flex: slot.flex,
        slotIndex: idx,
        data: values,
        selected: pickValue[idx],
        textAlign: slot.textAlign,
        onChange: this.onSlotChange,
        visibleItemCount,
        rotateEffect,
        itemHeight,
      };
      return (
        <PickerSlot {...props} />
      )
    })
  }
  render() {
    const {rotateEffect, showToolbar, children = '', itemHeight} = this.props;
    const className = classnames('picker', {
      'picker-3d': rotateEffect
    })
    return (
      <div className={ className }>
        { showToolbar && (
          <div className='picker-toolbar'>
            { children }
          </div>
          ) }
        <div className='picker-items'>
          { this.renderPickSlot() }
          <div className="picker-center-highlight" style={ { height: itemHeight + 'px', marginTop: -itemHeight / 2 + 'px' } }></div>
        </div>
      </div>
      );
  }
}

Picker.propTypes = {
  itemHeight: PropTypes.number,
  rotateEffect: PropTypes.bool,
  showToolbar: PropTypes.bool,
  pickerSlots: PropTypes.array,
  visibleItemCount: PropTypes.number,
  onChange: PropTypes.func
};

Picker.defaultProps = {
  itemHeight: 36,
  rotateEffect: false,
  showToolbar: false,
  pickerSlots: [],
  visibleItemCount: 5,
  onChange: () => {
  },
};

export default Picker;
