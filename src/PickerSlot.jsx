import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import draggable from './utils/draggable';
import translateUtil from './utils/translate';
import { once } from './utils/dom';
import './PickerSlot.css';

var rotateElement = function(element, angle) {
  if (!element) return;
  var transformProperty = translateUtil.transformProperty;
  element.style[transformProperty] = element.style[transformProperty].replace(/rotateX\(.+?deg\)/gi, '') + ` rotateX(${angle}deg)`;
};

const VISIBLE_ITEMS_ANGLE_MAP = {
  3: -45,
  5: -20,
  7: -15
};

class PickerSlot extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentValue: props.selected,
      dragging: false,
      animationFrameId: null,
    }
  }
  componentDidMount() {
    if (!this.props.divider) {
      this.initEvents();
      this.onSelectChange();
    }
    if (this.props.rotateEffect) {
      this.planUpdateRotate();
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.dragging !== this.state.dragging || nextState.animationFrameId !== this.state.animationFrameId) {
      return false;
    }
    return true;
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentValue !== prevState.currentValue) {
      this.onSelectChange();
    }
  }
  calcDragRange() {
    const {visibleItemCount, itemHeight, data} = this.props;
    return [-itemHeight * (data.length - Math.ceil(visibleItemCount / 2)), itemHeight * Math.floor(visibleItemCount / 2)];
  }
  customClassNames() {
    const {rotateEffect, textAlign, divider, className} = this.props;
    const PREFIX = 'picker-slot-';
    return classnames({
      [`${PREFIX}${textAlign}`]: true,
      [`${PREFIX}divider`]: divider,
    }, className);
  }
  valueToTranslate(value) {
    const {data} = this.props;
    const {visibleItemCount, itemHeight} = this.props;
    var valueIndex = data.indexOf(value);
    var offset = Math.floor(visibleItemCount / 2);
    if (valueIndex !== -1) {
      return (valueIndex - offset) * -itemHeight;
    }
  }
  translateToValue(translate) {
    const {itemHeight, visibleItemCount, data} = this.props;
    translate = Math.round(translate / itemHeight) * itemHeight;
    var index = -(translate - Math.floor(visibleItemCount / 2) * itemHeight) / itemHeight;
    return data[index];
  }
  updateRotate(currentTranslate, pickerItems) {
    const {divider, visibleItemCount, itemHeight} = this.props;
    if (divider) return;
    var dragRange = this.calcDragRange();
    var wrapper = this.wrapper;
    if (!pickerItems) {
      pickerItems = wrapper.querySelectorAll('.picker-item');
    }
    if (currentTranslate === undefined) {
      currentTranslate = translateUtil.getElementTranslate(wrapper).top;
    }
    var angleUnit = VISIBLE_ITEMS_ANGLE_MAP[visibleItemCount] || -20;
    pickerItems.forEach((item, index) => {
      var itemOffsetTop = index * itemHeight;
      var translateOffset = dragRange[1] - currentTranslate;
      var itemOffset = itemOffsetTop - translateOffset;
      var percentage = itemOffset / itemHeight;
      var angle = angleUnit * percentage;
      if (angle > 180)
        angle = 180;
      if (angle < -180)
        angle = -180;
      rotateElement(item, angle);
    });
  }
  planUpdateRotate() {
    var el = this.wrapper;
    cancelAnimationFrame(this.state.animationFrameId);
    this.setState({
      animationFrameId: requestAnimationFrame(() => {
        this.updateRotate();
      })
    })
    once(el, translateUtil.transitionEndProperty, () => {
      this.setState({
        animationFrameId: null
      });
      cancelAnimationFrame(this.state.animationFrameId);
    });
  }
  initEvents() {
    const el = this.wrapper;
    var dragState = {};
    var velocityTranslate,
      prevTranslate,
      pickerItems;
    draggable(el, {
      start: (event) => {
        cancelAnimationFrame(this.animationFrameId);
        dragState = {
          range: this.calcDragRange(),
          start: new Date(),
          startLeft: event.pageX,
          startTop: event.pageY,
          startTranslateTop: translateUtil.getElementTranslate(el).top
        };
        pickerItems = el.querySelectorAll('.picker-item');
      },
      drag: (event) => {
        if (!this.state.dragging) {
          this.setState({
            dragging: true
          });
        }
        dragState.left = event.pageX;
        dragState.top = event.pageY;
        var deltaY = dragState.top - dragState.startTop;
        var translate = dragState.startTranslateTop + deltaY;
        translateUtil.translateElement(el, null, translate);
        velocityTranslate = translate - prevTranslate || translate;
        prevTranslate = translate;
        if (this.props.rotateEffect) {
          this.updateRotate(prevTranslate, pickerItems);
        }
      },
      end: () => {
        if (this.state.dragging) {
          var momentumRatio = 7;
          var currentTranslate = translateUtil.getElementTranslate(el).top;
          var duration = new Date() - dragState.start;
          var momentumTranslate;
          if (duration < 300) {
            momentumTranslate = currentTranslate + velocityTranslate * momentumRatio;
          }
          var dragRange = dragState.range;
          setTimeout(() => {
            var translate;
            const {itemHeight, rotateEffect} = this.props;
            if (momentumTranslate) {
              translate = Math.round(momentumTranslate / itemHeight) * itemHeight;
            } else {
              translate = Math.round(currentTranslate / itemHeight) * itemHeight;
            }
            translate = Math.max(Math.min(translate, dragRange[1]), dragRange[0]);
            translateUtil.translateElement(el, null, translate);
            this.setState({
              currentValue: this.translateToValue(translate),
            });
            if (rotateEffect) {
              this.planUpdateRotate();
            }
          }, 0);
          this.setState({
            animationFrameId: null,
            dragging: false,
          });
        }
        dragState = {};
      }
    });
  }
  flexStyle() {
    const {flex} = this.props;
    return {
      'flex': flex,
      'WebkitBoxFlex': flex,
      'MozBoxFlex': flex,
      'msFlex': flex
    }
  }
  onSelectChange() {
    const {currentValue} = this.state;
    const {onChange, slotIndex} = this.props;
    const wrapper = this.wrapper;
    translateUtil.translateElement(wrapper, null, this.valueToTranslate(currentValue));
    onChange(currentValue, slotIndex);
  }
  renderPickItemList() {
    const {data, itemHeight} = this.props;
    const {currentValue} = this.state
    return data.map((item, index) => {
      const className = classnames('picker-item', {
        'picker-selected': item === currentValue
      });
      return (
        <div key={ index } className={ className } style={ { height: itemHeight + 'px', lineHeight: itemHeight + 'px' } }>
          { item }
        </div>
      )
    })
  }
  render() {
    var {className, divider, dividerContent, itemHeight, visibleItemCount} = this.props
    className = classnames('picker-slot', this.customClassNames());
    const wrapperClass = classnames('picker-slot-wrapper', {
      dragging: this.state.dragging
    });

    const contentHeight = itemHeight * visibleItemCount;
    return (
      <div className={ className } style={ this.flexStyle() }>
        { !divider ? (
          <div ref={ (wrapper) => this.wrapper = wrapper } className={ wrapperClass } style={ { height: `${contentHeight}px` } }>
            { this.renderPickItemList() }
          </div>
          ) : (
          <div dangerouslySetInnerHTML={ { __html: dividerContent } }>
          </div>
          ) }
      </div>
      );
  }
}

PickerSlot.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
  dataKey: PropTypes.string,
  divider: PropTypes.bool,
  dividerContent: PropTypes.string,
  itemHeight: PropTypes.number,
  rotateEffect: PropTypes.bool,
  selected: PropTypes.string,
  slotIndex: PropTypes.number,
  visibleItemCount: PropTypes.number,
  onChange: PropTypes.func,
};

PickerSlot.defaultProps = {
  itemHeight: 36,
  visibleItemCount: 5,
  rotateEffect: false,
  divider: false,
  dividerContent: '-',
  textAlign: 'center',
  slotIndex: 0,
};

PickerSlot.displayName = 'PickerSlot';

export default PickerSlot;