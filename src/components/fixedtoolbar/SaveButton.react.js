import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Store from '../../stores/SavingStore'

class SaveButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isSaving: false }
  }
  componentDidMount() {
    this.unsubscribe = Store.listen(this.onStoreChange)
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const textKey = this.state.isSaving
      ? 'FixedToolbar.saving'
      : 'FixedToolbar.save'
    return (
      <button
        className={
          'ml3 dib v-mid pa3 ph4 br1 ba bw1 b--blue bg-blue white w5 ' +
            (this.props.disabled || this.state.isSaving
              ? 'cursor-not-allowed o-30 '
              : '')
        }
        onClick={this.handleClick}
      >
        <span className="f4">
          <FormattedMessage id={textKey} />
        </span>
      </button>
    )
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ disabled: nextProps.disabled })
  }

  onStoreChange = () => {
    const store = Store.get()
    this.setState({
      isSaving: store.isSaving,
    })
  };

  handleClick = () => {
    if (this.props.disabled || this.state.isSaving) {
      return
    }
    this.props.onClick()
  };
}

SaveButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
}

export default SaveButton
