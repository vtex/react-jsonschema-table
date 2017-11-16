import '../css/footer.less'
import React from 'react'
import PropTypes from 'prop-types'
import {FormattedMessage} from 'react-intl'

const Footer = function(props) {
  return (
    <div className="list-footer">
      {props.totalRows}&nbsp;<FormattedMessage id="Footer.records" />
    </div>
  )
}

Footer.propTypes = {
  totalRows: PropTypes.number,
}

export default Footer
