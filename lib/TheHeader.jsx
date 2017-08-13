'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { TheLink } from 'the-link'
import { TheIcon } from 'the-icon'
import { TheButton } from 'the-button'
import c from 'classnames'
import TheHeaderStyle from './TheHeaderStyle'
import { TheContainer } from 'the-container'
import { htmlAttributesFor } from 'the-component-util'

const NOTICE_HEIGHT = 36

/**
 * Header of the-components
 */
class TheHeader extends React.Component {
  constructor (props) {
    super(props)
    const s = this
    s.inner = null
    s.handleResize = s.handleResize.bind(s)
    s.state = {
      innerHeight: null
    }
  }

  render () {
    const s = this
    const {props, state} = s
    const {
      className,
      children,
      style,
      asOverlay,
      notices,
    } = props
    const {innerHeight} = state
    const noticeCount = Object.keys(notices).length
    return (
      <header {...htmlAttributesFor(props, {except: ['className', 'style']})}
              className={c('the-header', className, {
                'the-header-as-overlay': asOverlay
              })}
              style={{minHeight: innerHeight}}
      >
        <div className='the-header-inner'
             style={style}
             ref={(inner) => { s.inner = inner }}
        >
          <TheContainer>
            {children}
          </TheContainer>
          <div className={c('the-header-notices-wrap', {
            'the-header-notices-wrap-empty': noticeCount === 0
          })}
               style={{height: NOTICE_HEIGHT * noticeCount}}
          >
            {
              Object.keys(notices).map((message) => (
                <TheHeader.Notice key={message}
                                  message={message}
                                  actions={notices[message]}
                >
                </TheHeader.Notice>
              ))
            }
          </div>
        </div>
      </header>
    )
  }

  componentDidMount () {
    const s = this
    window.addEventListener('resize', s.handleResize)
    s.doLayout()
  }

  componentDidUpdate () {
    const s = this
    s.layoutIfNeeded()
  }

  componentWillUnmount () {
    const s = this
    window.removeEventListener('resize', s.handleResize)
  }

  handleResize (e) {
    const s = this
    s.doLayout()
  }

  layoutIfNeeded () {
    const s = this
    const {inner} = s
    const innerHeight = inner && inner.offsetHeight
    const needsLayout = innerHeight && (s.state.innerHeight !== innerHeight)
    if (needsLayout) {
      s.doLayout()
    }
  }

  doLayout () {
    const s = this
    const {inner} = s
    const innerHeight = inner && inner.offsetHeight
    s.setState({innerHeight})
  }

  static Logo ({to = '/', children}) {
    return (
      <TheLink to={to}
               className='the-header-logo'>
        {children}
      </TheLink>
    )
  }

  static Tab ({children}) {
    return (
      <ul className='the-header-tab'>
        {children}
      </ul>
    )
  }

  static TabItem ({
                    to,
                    text,
                    icon,
                    activeClassName,
                    activeStyle,
                    children
                  }) {
    return (
      <li className='the-header-tab-item'>
        <TheLink to={to}
                 activeClassName={activeClassName}
                 activeStyle={activeStyle}
        >
          {icon && (<TheIcon className={icon}/>)}
          {text && (<span className='the-header-tab-item-text'/>)}
          {children}
        </TheLink>
      </li>
    )
  }

  static RightArea (props) {
    const {className, children} = props
    return (
      <div {...htmlAttributesFor(props, {except: ['className']})}
           className={c('the-header-right-area', className)}>
        {children}
      </div>
    )
  }

  static Notice (props) {
    const {
      className,
      message,
      actions,
      children
    } = props
    return (
      <div {...htmlAttributesFor(props, {except: ['className', 'actions']})}
           className={c('the-header-notice', className)}
           style={{height: NOTICE_HEIGHT}}>
        <TheContainer className="the-header-notice-inner">
          <div className='the-header-notice-message'>
            {message}
          </div>
          {children}
          <div className='the-header-notice-actions'>
            {
              Object.keys(actions).map((title) => (
                <TheButton key={title}
                           className='the-header-notice-button'
                           onClick={actions[title]}>
                  {title}
                </TheButton>
              ))
            }
          </div>
        </TheContainer>
      </div>
    )
  }
}

TheHeader.Style = TheHeaderStyle

TheHeader.propTypes = {
  /** Style as overlay */
  asOverlay: PropTypes.bool,
  /** Notices */
  notices: PropTypes.object
}

TheHeader.defaultProps = {
  asOverlay: false,
  notices: {}
}

TheHeader.displayName = 'TheHeader'

export default TheHeader
