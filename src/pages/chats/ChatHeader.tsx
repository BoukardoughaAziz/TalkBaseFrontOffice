export default function ChatHeader(props) {
  return (
    <>
      <header className='chat-header'>
        <a
          id='back_user_list'
          className='btn btn-sm btn-icon btn-flush-dark btn-rounded flush-soft-hover back-user-list'
          href='#'
        >
          <span className='icon'>
            <span className='feather-icon'>
              <i data-feather='chevron-left'></i>
            </span>
          </span>
        </a>
        <div className='media'>
          {props.selectedAppClient !== undefined && (
            <>
              <div className='media-head'>
                <div className='avatar avatar-sm avatar-rounded position-relative'>
                  <img
                    src='../assets/img/avatar8.jpg'
                    alt='user'
                    className='avatar-img'
                  />
                  <span className='badge badge-success badge-indicator badge-indicator-lg position-bottom-end-overflow-1'></span>
                </div>
              </div>
              <div className='media-body'>
                <div className='user-name'>
                  {' '}
                  {selectedAppClient.humanIdentifier}
                </div>
                <div className='user-status'>
                  Typing<span className='one'>.</span>
                  <span className='two'>.</span>
                  <span className='three'>.</span>
                </div>
              </div>
            </>
          )}
        </div>
        <div className='chat-options-wrap'>
          <a
            className='btn btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret d-none d-xl-block'
            href='#'
            data-bs-toggle='modal'
            data-bs-target='#invite_people'
          >
            <span
              className='icon'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              title=''
              data-bs-original-title='Invite people'
            >
              <span className='feather-icon'>
                <i data-feather='user-plus'></i>
              </span>
            </span>
          </a>
          <a
            className='btn btn-icon btn-flush-dark btn-rounded flush-soft-hover d-none d-xl-block'
            href='#'
            data-bs-toggle='modal'
            data-bs-target='#audio_call'
          >
            <span
              className='icon'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              title=''
              data-bs-original-title='Audio call'
            >
              <span className='feather-icon'>
                <i data-feather='phone'></i>
              </span>
            </span>
          </a>
          <a
            className='btn btn-icon btn-flush-dark btn-rounded flush-soft-hover d-none d-xl-block'
            href='#'
            data-bs-toggle='modal'
            data-bs-target='#video_call'
          >
            <span
              className='icon'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              title=''
              data-bs-original-title='Video Call'
            >
              <span className='feather-icon'>
                <i data-feather='video'></i>
              </span>
            </span>
          </a>
          <a
            className='btn btn-icon btn-flush-dark btn-rounded flush-soft-hover chatapp-info-toggle active'
            href='#'
          >
            <span
              className='icon'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              title=''
              data-bs-original-title='Info'
            >
              <span className='feather-icon'>
                <i data-feather='info'></i>
              </span>
            </span>
          </a>
          <a
            className='btn btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret'
            href='#'
            data-bs-toggle='dropdown'
          >
            <span
              className='icon'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              title=''
              data-bs-original-title='More'
            >
              <span className='feather-icon'>
                <i data-feather='more-vertical'></i>
              </span>
            </span>
          </a>
        </div>
      </header>
    </>
  )
}
