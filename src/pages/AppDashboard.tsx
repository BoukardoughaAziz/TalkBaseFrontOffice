 
import Cookies from 'js-cookie'
import feather from 'feather-icons'
import { useEffect } from 'react'
export default function AppDashboard() {
  const defaultOpen = Cookies.get('sidebar:state') !== 'false'
  useEffect(() => {
    feather.replace() // Initialize Feather icons
  }, [])
  return (
   <>
    
	<div className="hk-wrapper" data-layout="vertical" data-layout-style="default" data-menu="light" data-footer="simple">
	 
		<nav className="hk-navbar navbar navbar-expand-xl navbar-light fixed-top">
			<div className="container-fluid">
 
		 
 
			 
			<div className="nav-end-wrap">
				<ul className="navbar-nav flex-row">
					<li className="nav-item">
						<a href="email.html" className="btn btn-icon btn-rounded btn-flush-dark flush-soft-hover"><span className="icon"><span className=" position-relative"><span className="feather-icon"><i data-feather="inbox"></i></span><span className="badge badge-sm badge-soft-primary badge-sm badge-pill position-top-end-overflow-1">4</span></span></span></a>
					</li>
			 
				</ul>
			</div>
	 
			</div>									
		</nav>
 
        <div className="hk-menu">
		 
			<div className="menu-header">
				<span>
					<a className="navbar-brand" href="index.html">
						<img className="brand-img img-fluid" src="dist/img/brand-sm.svg" alt="brand" />
						<img className="brand-img img-fluid" src="dist/img/Jampack.svg" alt="brand" />
					</a>
					<button className="btn btn-icon btn-rounded btn-flush-dark flush-soft-hover navbar-toggle">
						<span className="icon">
							<span className="svg-icon fs-5">
								<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-bar-to-left" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
									<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
									<line x1="10" y1="12" x2="20" y2="12"></line>
									<line x1="10" y1="12" x2="14" y2="16"></line>
									<line x1="10" y1="12" x2="14" y2="8"></line>
									<line x1="4" y1="4" x2="4" y2="20"></line>
								</svg>
							</span>
						</span>
					</button>
				</span>
			</div>
		 
			<div data-simplebar className="nicescroll-bar">
				<div className="menu-content-wrap">
					<div className="menu-group">
						<ul className="navbar-nav flex-column">
							<li className="nav-item active">
								<a className="nav-link" href="index.html">
									<span className="nav-icon-wrap">
										<span className="svg-icon">
											<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-template" width="24" height="24" viewBox="0 0 24 24"  strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
												<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
												<rect x="4" y="4" width="16" height="4" rx="1" />
												<rect x="4" y="12" width="6" height="8" rx="1" />
												<line x1="14" y1="12" x2="20" y2="12" />
												<line x1="14" y1="16" x2="20" y2="16" />
												<line x1="14" y1="20" x2="20" y2="20" />
											</svg>
										</span>
									</span>
									<span className="nav-link-text">Dashboard</span> 
								</a>
							</li>
						</ul>	
					</div>
					<div className="menu-gap"></div>
					<div className="menu-group">
					 
						<ul className="navbar-nav flex-column">
						 
						 
							<li className="nav-item">
								<a className="nav-link" href="calendar.html">
									<span className="nav-icon-wrap">
										<span className="svg-icon">
											<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-calendar-time" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
												<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
												<path d="M11.795 21h-6.795a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4" />
												<circle cx="18" cy="18" r="4" />
												<path d="M15 3v4" />
												<path d="M7 3v4" />
												<path d="M3 11h16" />
												<path d="M18 16.496v1.504l1 1" />
											</svg>
										</span>
									</span>
									<span className="nav-link-text">Calendar</span>
								</a>
							</li>	
						 
					 
						</ul>
					</div>
				 
				 
				</div>
			</div>
		 
		</div>
        <div id="hk_menu_backdrop" className="hk-menu-backdrop"></div>
        
	 
		<a href="#" className="btn btn-icon btn-floating btn-primary btn-lg btn-rounded btn-popup-open">
			<span className="icon">
				<span className="feather-icon"><i data-feather="message-circle"></i></span>
			</span>
		</a>
		<div className="chat-popover shadow-xl"><p>Try Jampack Chat for free and connect with your customers now!</p></div>
	 
		<div className="hk-pg-wrapper">
			<div className="container-xxl">
			 
			  
			</div>
			
	 
			<div className="hk-footer">
				<footer className="container-xxl footer">
					<div className="row">
						<div className="col-xl-8">
							<p className="footer-text"><span className="copy-text">Jampack © 2022 All rights reserved.</span> <a href="#" className="" target="_blank">Privacy Policy</a><span className="footer-link-sep">|</span><a href="#" className="" target="_blank">T&C</a><span className="footer-link-sep">|</span><a href="#" className="" target="_blank">System Status</a></p>
						</div>
						 
					</div>
				</footer>
            </div>
  

		</div>
	 
	</div>

   </>
 
  )
}
