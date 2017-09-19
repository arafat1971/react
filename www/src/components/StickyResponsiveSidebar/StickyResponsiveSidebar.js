/**
 * Copyright 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails react-core
*/

'use strict';

import Container from 'components/Container';
import {Component, React} from 'react';
import isItemActive from 'utils/isItemActive';
import Sidebar from 'templates/components/Sidebar';
import {colors, media} from 'theme';
import {Motion, spring} from 'react-motion';
import ChevronSvg from './ChevronSvg';

// TODO: memoize to save doing O(n) on the active section items + subitems every
// time.
function findActiveItemTitle(location, defaultActiveSection) {
  const {items} = defaultActiveSection;
  for (let i = 0, len = items.length; i < len; i++) {
    const item = items[i];
    if (isItemActive(location, item)) {
      return item.title;
    } else if (item.subitems && item.subitems.length) {
      const {subitems} = item;
      for (let j = 0, len2 = subitems.length; j < len2; j++) {
        const subitem = subitems[j];
        if (isItemActive(location, subitem)) {
          return subitem.title;
        }
      }
    }
  }
  // If nothing else is found, warn and default to section title
  console.warn('No active item title found in <StickyResponsiveSidebar>');
  return defaultActiveSection.title;
}

class StickyResponsiveSidebar extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      activeSection: props.defaultActiveSection,
      open: false,
    };
    this.toggleOpen = this._toggleOpen.bind(this);
  }

  _toggleOpen() {
    this.setState({open: !this.state.open});
  }

  render() {
    const {defaultActiveSection, location} = this.props;
    const smallScreenSidebarStyles = {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      position: 'fixed',
      backgroundColor: colors.white,
      zIndex: 2,
      height: '100vh',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      pointerEvents: this.state.open ? 'auto' : 'none',
    };

    const smallScreenBottomBarStyles = {
      display: 'block',
    };

    return (
      <Motion
        defaultStyle={{
          iconOffset: 0,
          labelOffset: 0,
          menuOpacity: 0,
          menuOffset: 40,
        }}
        style={{
          iconOffset: spring(this.state.open ? 7 : 0),
          labelOffset: spring(this.state.open ? -40 : 0),
          menuOpacity: spring(this.state.open ? 1 : 0),
          menuOffset: spring(this.state.open ? 0 : 40),
        }}>
        {value => (
          <div>
            <div
              style={{
                opacity: value.menuOpacity,
              }}
              css={{
                [media.lessThan('small')]: smallScreenSidebarStyles,

                [media.greaterThan('medium')]: {
                  marginRight: -999,
                  paddingRight: 999,
                  backgroundColor: '#f7f7f7',
                },

                [media.between('medium', 'sidebarFixed', true)]: {
                  position: 'fixed',
                  zIndex: 2,
                  height: '100%',
                },

                [media.greaterThan('small')]: {
                  position: 'fixed',
                  zIndex: 2,
                  height: 'calc(100vh - 60px)',
                  overflowY: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  marginRight: -999,
                  paddingRight: 999,
                  backgroundColor: '#f7f7f7',
                  opacity: '1 !important',
                },

                [media.size('small')]: {
                  height: 'calc(100vh - 40px)',
                },

                [media.between('medium', 'large')]: {
                  height: 'calc(100vh - 50px)',
                },

                [media.greaterThan('sidebarFixed')]: {
                  borderLeft: '1px solid #ececec',
                },
              }}>
              <div
                style={{
                  transform: `translate(0px, ${value.menuOffset}px)`,
                }}
                css={{
                  marginTop: 60,

                  [media.lessThan('small')]: {
                    marginTop: 40,
                  },

                  [media.between('medium', 'large')]: {
                    marginTop: 50,
                  },

                  [media.greaterThan('small')]: {
                    tranform: 'none !important',
                  },
                }}>
                <Sidebar {...this.props} />
              </div>
            </div>
            <div
              css={{
                backgroundColor: colors.darker,
                bottom: 0,
                color: colors.brand,
                display: 'none', // gets overriden at small screen sizes
                left: 0,
                cursor: 'pointer',
                position: 'fixed',
                right: 0,
                width: '100%',
                zIndex: 3,
                [media.lessThan('small')]: smallScreenBottomBarStyles,
              }}
              onClick={this.toggleOpen}>
              <Container>
                <div
                  css={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 60,
                    [media.between('medium', 'large')]: {
                      height: 50,
                    },
                    [media.lessThan('small')]: {
                      height: 40,
                      overflow: 'hidden',
                      alignItems: 'flex-start',
                    },
                  }}>
                  <div
                    css={{
                      width: 20,
                      marginRight: 10,
                      alignSelf: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                    <ChevronSvg
                      cssProps={{
                        transform: `translate(0, ${value.iconOffset}px) rotate(180deg)`,
                      }}
                    />
                    <ChevronSvg
                      cssProps={{
                        transform: `translate(0, ${0 - value.iconOffset}px)`,
                      }}
                    />
                  </div>
                  <div
                    css={{
                      flexGrow: 1,
                    }}>
                    <div
                      style={{
                        transform: `translate(0, ${value.labelOffset}px)`,
                      }}>
                      <div
                        css={{
                          height: 40,
                          lineHeight: '40px',
                        }}>
                        {findActiveItemTitle(location, defaultActiveSection)}
                      </div>
                      <div
                        css={{
                          height: 40,
                          lineHeight: '40px',
                        }}>
                        Close
                      </div>
                    </div>
                  </div>
                </div>
              </Container>
            </div>
          </div>
        )}
      </Motion>
    );
  }
}

export default StickyResponsiveSidebar;