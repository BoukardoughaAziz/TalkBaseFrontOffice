import { useState } from 'react'

export default function ClientInformationUI() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  return (
    <>
      {' '}
      <div className='chat-info'>
        <div data-simplebar className='nicescroll-bar'>
          <button type='button' className='info-close btn-close'>
            <span aria-hidden='true'>×</span>
          </button>
          <div className='text-center'>
            <div className='cp-name text-truncate mt-2'>Huma Therman</div>
            <p className='text-truncate'>No phone calls Always busy</p>
          </div>

          <ul className='nav nav-justified nav-light nav-tabs nav-segmented-tabs active-theme mt-4'>
            <li className='nav-item'>
              <a
                className='nav-link active'
                data-bs-toggle='tab'
                href='#tab_info'
              >
                <span className='nav-link-text'>Info</span>
              </a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' data-bs-toggle='tab' href='#tab_files'>
                <span className='nav-link-text'>Files</span>
              </a>
            </li>
          </ul>
          <div className='tab-content mt-4'>
            <div className='tab-pane fade show active' id='tab_info'>
              <form role='search'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Search in conversation'
                />
              </form>
              <div className='collapse-simple mt-3'>
                <div className='card'>
                  <div className='card-header'>
                    <a
                      role='button'
                      data-bs-toggle='collapse'
                      href='#gn_info'
                      aria-expanded='true'
                    >
                      General Info
                    </a>
                  </div>
                  <div id='gn_info' className='collapse show'>
                    <div className='card-body'>
                      <ul className='cp-info'>
                        <li>
                          <a href='javascript:void(0);'>
                            <span className='cp-icon-wrap'>
                              <span className='feather-icon'>
                                <i data-feather='briefcase'></i>
                              </span>
                            </span>
                            Co-Founder
                          </a>
                        </li>
                        <li>
                          <a href='javascript:void(0);'>
                            <span className='cp-icon-wrap'>
                              <span className='feather-icon'>
                                <i data-feather='mail'></i>
                              </span>
                            </span>
                            <span className='text-primary'>
                              contact@hencework.com
                            </span>
                          </a>
                        </li>
                        <li>
                          <a href='javascript:void(0);'>
                            <span className='cp-icon-wrap'>
                              <span className='feather-icon'>
                                <i data-feather='phone'></i>
                              </span>
                            </span>
                            +91-25-4125-2365
                          </a>
                        </li>
                        <li>
                          <a href='javascript:void(0);'>
                            <span className='cp-icon-wrap'>
                              <span className='feather-icon'>
                                <i data-feather='map-pin'></i>
                              </span>
                            </span>
                            Oslo, Canada
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='tab-pane fade' id='tab_files'>
              <form role='search'>
                <input
                  type='text'
                  className='form-control search-files'
                  placeholder='Search files'
                />
              </form>
              <div className='collapse-simple mt-3'>
                <div className='card'>
                  <div className='card-header'>
                    <a
                      role='button'
                      data-bs-toggle='collapse'
                      href='#files_collapse'
                      aria-expanded='true'
                    >
                      Yesterday
                    </a>
                  </div>
                  <div id='files_collapse' className='collapse show'>
                    <div className='card-body'>
                      <ul className='cp-files'>
                        <li>
                          <div className='media'>
                            <div className='media-head'>
                              <div className='avatar avatar-icon avatar-sm avatar-soft-blue'>
                                <span className='initial-wrap fs-3'>
                                  <i className='ri-file-excel-2-fill'></i>
                                </span>
                              </div>
                            </div>
                            <div className='media-body'>
                              <div>
                                <p className='file-name'>website_content.exl</p>
                                <p className='file-size'>2,635 KB</p>
                              </div>
                              <div>
                                <a
                                  href='#'
                                  className='btn btn-sm btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret'
                                  data-bs-toggle='dropdown'
                                >
                                  <span className='icon'>
                                    <span className='feather-icon'>
                                      <i data-feather='more-vertical'></i>
                                    </span>
                                  </span>
                                </a>
                                <div className='dropdown-menu dropdown-menu-end'>
                                  <a className='dropdown-item' href='#'>
                                    Download
                                  </a>
                                  <a
                                    className='dropdown-item link-danger'
                                    href='#'
                                  >
                                    Delete
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className='media'>
                            <div className='media-head'>
                              <div className='avatar avatar-icon avatar-sm avatar-soft-light'>
                                <span className='initial-wrap fs-3'>
                                  <i className='ri-file-text-fill'></i>
                                </span>
                              </div>
                            </div>
                            <div className='media-body'>
                              <div>
                                <p className='file-name'>jampack.pdf</p>
                                <p className='file-size'>1.3 GB</p>
                              </div>
                              <div>
                                <a
                                  href='#'
                                  className='btn btn-sm btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret'
                                  data-bs-toggle='dropdown'
                                >
                                  <span className='icon'>
                                    <span className='feather-icon'>
                                      <i data-feather='more-vertical'></i>
                                    </span>
                                  </span>
                                </a>
                                <div className='dropdown-menu dropdown-menu-end'>
                                  <a className='dropdown-item' href='#'>
                                    Download
                                  </a>
                                  <a
                                    className='dropdown-item link-danger'
                                    href='#'
                                  >
                                    Delete
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className='media'>
                            <div className='media-head'>
                              <div className='avatar avatar-icon avatar-sm avatar-soft-warning'>
                                <span className='initial-wrap fs-3'>
                                  <i className='ri-file-zip-fill'></i>
                                </span>
                              </div>
                            </div>
                            <div className='media-body'>
                              <div>
                                <p className='file-name'>
                                  themeforest-pack.zip
                                </p>
                                <p className='file-size'>2.45 GB</p>
                              </div>
                              <div>
                                <a
                                  href='#'
                                  className='btn btn-sm btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret'
                                  data-bs-toggle='dropdown'
                                >
                                  <span className='icon'>
                                    <span className='feather-icon'>
                                      <i data-feather='more-vertical'></i>
                                    </span>
                                  </span>
                                </a>
                                <div className='dropdown-menu dropdown-menu-end'>
                                  <a className='dropdown-item' href='#'>
                                    Download
                                  </a>
                                  <a
                                    className='dropdown-item link-danger'
                                    href='#'
                                  >
                                    Delete
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className='media'>
                            <div className='media-head'>
                              <div className='avatar avatar-logo avatar-sm'>
                                <span className='initial-wrap'>
                                  <img
                                    src='../assets/img/6image.png'
                                    alt='user'
                                  />
                                </span>
                              </div>
                            </div>
                            <div className='media-body'>
                              <div>
                                <p className='file-name'>
                                  bruce-mars-fiEG-Pk6ZASFPk6ZASF
                                </p>
                                <p className='file-size'>4,178 KB</p>
                              </div>
                              <div>
                                <a
                                  href='#'
                                  className='btn btn-sm btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret'
                                  data-bs-toggle='dropdown'
                                >
                                  <span className='icon'>
                                    <span className='feather-icon'>
                                      <i data-feather='more-vertical'></i>
                                    </span>
                                  </span>
                                </a>
                                <div className='dropdown-menu dropdown-menu-end'>
                                  <a className='dropdown-item' href='#'>
                                    Download
                                  </a>
                                  <a
                                    className='dropdown-item link-danger'
                                    href='#'
                                  >
                                    Delete
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className='media'>
                            <div className='media-head'>
                              <div className='avatar avatar-logo avatar-sm'>
                                <span className='initial-wrap'>
                                  <img
                                    src='../assets/img/2image.png'
                                    alt='user'
                                  />
                                </span>
                              </div>
                            </div>
                            <div className='media-body'>
                              <div>
                                <p className='file-name'>
                                  jonas-kakaroto-KIPqvvTKIPqvvT
                                </p>
                                <p className='file-size'>951 KB</p>
                              </div>
                              <div>
                                <a
                                  href='#'
                                  className='btn btn-sm btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret'
                                  data-bs-toggle='dropdown'
                                >
                                  <span className='icon'>
                                    <span className='feather-icon'>
                                      <i data-feather='more-vertical'></i>
                                    </span>
                                  </span>
                                </a>
                                <div className='dropdown-menu dropdown-menu-end'>
                                  <a className='dropdown-item' href='#'>
                                    Download
                                  </a>
                                  <a
                                    className='dropdown-item link-danger'
                                    href='#'
                                  >
                                    Delete
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className='card'>
                  <div className='card-header'>
                    <a
                      role='button'
                      data-bs-toggle='collapse'
                      href='#files_collapse_1'
                      aria-expanded='true'
                    >
                      23 April
                    </a>
                  </div>
                  <div id='files_collapse_1' className='collapse show'>
                    <div className='card-body'>
                      <ul className='cp-files'>
                        <li>
                          <div className='media'>
                            <div className='media-head'>
                              <div className='avatar avatar-icon avatar-sm avatar-soft-light'>
                                <span className='initial-wrap fs-3'>
                                  <i className='ri-keynote-fill'></i>
                                </span>
                              </div>
                            </div>
                            <div className='media-body'>
                              <div>
                                <p className='file-name'>
                                  presentation.keynote
                                </p>
                                <p className='file-size'>20 KB</p>
                              </div>
                              <div>
                                <a
                                  href='#'
                                  className='btn btn-sm btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret'
                                  data-bs-toggle='dropdown'
                                >
                                  <span className='icon'>
                                    <span className='feather-icon'>
                                      <i data-feather='more-vertical'></i>
                                    </span>
                                  </span>
                                </a>
                                <div className='dropdown-menu dropdown-menu-end'>
                                  <a className='dropdown-item' href='#'>
                                    Download
                                  </a>
                                  <a
                                    className='dropdown-item link-danger'
                                    href='#'
                                  >
                                    Delete
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className='media'>
                            <div className='media-head'>
                              <div className='avatar avatar-icon avatar-sm avatar-soft-warning'>
                                <span className='initial-wrap fs-3'>
                                  <i className='ri-file-zip-fill'></i>
                                </span>
                              </div>
                            </div>
                            <div className='media-body'>
                              <div>
                                <p className='file-name'>PACK-TRIAL.zip</p>
                                <p className='file-size'>2.45 GB</p>
                              </div>
                              <div>
                                <a
                                  href='#'
                                  className='btn btn-sm btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret'
                                  data-bs-toggle='dropdown'
                                >
                                  <span className='icon'>
                                    <span className='feather-icon'>
                                      <i data-feather='more-vertical'></i>
                                    </span>
                                  </span>
                                </a>
                                <div className='dropdown-menu dropdown-menu-end'>
                                  <a className='dropdown-item' href='#'>
                                    Download
                                  </a>
                                  <a className='dropdown-item' href='#'>
                                    Delete
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className='media'>
                            <div className='media-head'>
                              <div className='avatar avatar-sm'>
                                <img
                                  src='../assets/img/img-thumb1.jpg'
                                  alt='user'
                                  className='avatar-img'
                                />
                              </div>
                            </div>
                            <div className='media-body'>
                              <div>
                                <p className='file-name'>
                                  joel-mott-LaK153ghdigaghdi
                                </p>
                                <p className='file-size'>3,028 KB</p>
                              </div>
                              <div>
                                <a
                                  href='#'
                                  className='btn btn-sm btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret'
                                  data-bs-toggle='dropdown'
                                >
                                  <span className='icon'>
                                    <span className='feather-icon'>
                                      <i data-feather='more-vertical'></i>
                                    </span>
                                  </span>
                                </a>
                                <div className='dropdown-menu dropdown-menu-end'>
                                  <a className='dropdown-item' href='#'>
                                    Download
                                  </a>
                                  <a className='dropdown-item' href='#'>
                                    Delete
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
