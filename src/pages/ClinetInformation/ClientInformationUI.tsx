import { useState, useEffect } from 'react';
import { ClientInformation } from '@/models/ClientInformation';

interface ClientInformationUIProps {
  clientInformation: ClientInformation;
  setClientInformation: (client: ClientInformation) => void;
}

export default function ClientInformationUI({
  clientInformation,
  setClientInformation
}: ClientInformationUIProps) {
  const [formData, setFormData] = useState<ClientInformation>({
    name: '',
    identifier: '',
    email: '',
    phoneNumber: '',
    jobTitle: '',
    notes: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    console.log("these are the client infos *clientinformationui*:  " ,clientInformation)
    if (clientInformation) {
      setFormData(clientInformation);
    }
  }, [clientInformation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setClientInformation(formData);
    setIsEditing(false);
  };

  return (
    <div className='chat-info'>
      <div data-simplebar className='nicescroll-bar'>
        <button 
          type='button' 
          className='info-close btn-close'
          onClick={() => setIsEditing(false)}
        >
          <span aria-hidden='true'>×</span>
        </button>
        
        <div className='text-center'>
          <div className='cp-name text-truncate mt-2'>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control text-center"
                placeholder="Client Name"
              />
            ) : (
              formData.name || 'Client Name'
            )}
          </div>
          <p className='text-truncate'>
            {isEditing ? (
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="form-control text-center"
                placeholder="Job Title"
              />
            ) : (
              formData.jobTitle || 'No information available'
            )}
          </p>
        </div>

        <ul className='nav nav-justified nav-light nav-tabs nav-segmented-tabs active-theme mt-4'>
          <li className='nav-item'>
            <a className='nav-link active' data-bs-toggle='tab' href='#tab_info'>
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
                  <a role='button' data-bs-toggle='collapse' href='#gn_info' aria-expanded='true'>
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
                          {isEditing ? (
                            <input
                              type="text"
                              name="jobTitle"
                              value={formData.jobTitle}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Job Title"
                            />
                          ) : (
                            formData.jobTitle || 'Job Title'
                          )}
                        </a>
                      </li>
                      <li>
                        <a href='javascript:void(0);'>
                          <span className='cp-icon-wrap'>
                            <span className='feather-icon'>
                              <i data-feather='mail'></i>
                            </span>
                          </span>
                          {isEditing ? (
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Email"
                            />
                          ) : (
                            <span className='text-primary'>
                              {formData.email || 'email@example.com'}
                            </span>
                          )}
                        </a>
                      </li>
                      <li>
                        <a href='javascript:void(0);'>
                          <span className='cp-icon-wrap'>
                            <span className='feather-icon'>
                              <i data-feather='phone'></i>
                            </span>
                          </span>
                          {isEditing ? (
                            <input
                              type="text"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Phone Number"
                            />
                          ) : (
                            formData.phoneNumber || 'Phone Number'
                          )}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className='card mt-3'>
                <div className='card-header'>
                  <a role='button' data-bs-toggle='collapse' href='#notes_collapse' aria-expanded='true'>
                    Notes
                  </a>
                </div>
                <div id='notes_collapse' className='collapse show'>
                  <div className='card-body'>
                    {isEditing ? (
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="form-control"
                        rows={3}
                        placeholder="Additional notes"
                      />
                    ) : (
                      <p>{formData.notes || 'No additional notes available'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-3 text-center">
              {isEditing ? (
                <>
                  <button 
                    type="button" 
                    className="btn btn-primary me-2"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Information
                </button>
              )}
            </div>
          </div>
          
          <div className='tab-pane fade' id='tab_files'>
            {/* Files tab content remains unchanged */}
            {/* ... existing files tab code ... */}
          </div>
        </div>
      </div>
    </div>
  );
}