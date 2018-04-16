import React from 'react'
import PropTypes from 'prop-types'
import {FormattedMessage} from 'react-intl'

const Footer = function(props) {
  return (
    <div
      className="fixed bottom-0 f5 w-100 bt b--light-gray pa1 bg-navy">
      {props.totalRows}&nbsp;<FormattedMessage id="Footer.records" />
    </div>
  )
}

Footer.propTypes = {
  totalRows: PropTypes.number,
}

export default Footer
