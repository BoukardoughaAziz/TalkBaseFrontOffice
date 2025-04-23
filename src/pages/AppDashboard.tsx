import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { ALL_COMPONENTS } from '@/App'
import routesConfig from '@/RoutesConfig'
import feather from 'feather-icons'
import NavItem from './NavItem'
import Chat from './chats/Chat'

export default function AppDashboard() {
  const [activeComponent, setActiveComponent] = useState('Chat')

  useEffect(() => {
    feather.replace() 
  }, [])
  return (
    <>
      <div
        className='hk-wrapper'
        data-layout='vertical'
        data-layout-style='default'
        data-menu='light'
        data-footer='simple'
      >
     

        <div className='hk-menu'>
          <div className='menu-header'>
            <span>
              <a className='navbar-brand' href='index.html'>
                <img
                  className='brand-img img-fluid'
                  src='public/images/logo2.png'
                  alt='brand'
                  style={{ width:"200px", height: "80px" }} 
                />
              </a>
              <button className='btn btn-icon btn-rounded btn-flush-dark flush-soft-hover navbar-toggle'>
                <span className='icon'>
                  <span className='svg-icon fs-5'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='icon icon-tabler icon-tabler-arrow-bar-to-left'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      strokeWidth='2'
                      stroke='currentColor'
                      fill='none'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                      <line x1='10' y1='12' x2='20' y2='12'></line>
                      <line x1='10' y1='12' x2='14' y2='16'></line>
                      <line x1='10' y1='12' x2='14' y2='8'></line>
                      <line x1='4' y1='4' x2='4' y2='20'></line>
                    </svg>
                  </span>
                </span>
              </button>
            </span>
          </div>

          <div data-simplebar className='nicescroll-bar'>
            <div className='menu-content-wrap'>
              <div className='menu-group'>
                <ul className='navbar-nav flex-column'>
                  {routesConfig.map(
                    ({ path, label, isAGap, isActive, component }) =>
                      isAGap ? (
                        <div key={path} className='menu-gap'></div>
                      ) : (
                        <li key={path} className='nav-item'>
                          <NavItem
                            componentName={label}
                            component={component}
                            active={isActive}
                            setActiveComponent={setActiveComponent}
                          />
                        </li>
                      )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {activeComponent && ALL_COMPONENTS[activeComponent] && (
          <div>{ALL_COMPONENTS[activeComponent].value}</div>
        )}

        <div className='hk-footer'>
          <footer className='container-xxl footer'>
            <div className='row'>
              <div className='col-xl-8'>
                <p className='footer-text'>
                  <span className='copy-text'>
                    Jampack © 2022 All rights reserved.
                  </span>{' '}
                  <a href='#' className='' target='_blank'>
                    Privacy Policy
                  </a>
                  <span className='footer-link-sep'>|</span>
                  <a href='#' className='' target='_blank'>
                    T&C
                  </a>
                  <span className='footer-link-sep'>|</span>
                  <a href='#' className='' target='_blank'>
                    System Status
                  </a>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}