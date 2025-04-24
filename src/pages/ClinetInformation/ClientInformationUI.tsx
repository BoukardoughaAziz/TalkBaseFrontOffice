import { useState, useEffect } from 'react';
import { ClientInformation } from '@/models/ClientInformation';
import { Conversation } from '@/models/Conversation';
import ClientInformationService from '@/services/Client Informations/ClientInformationService';

interface ClientInformationUIProps {
  clientInformation: ClientInformation | null;
  setClientInformation: (clientInformation: ClientInformation) => void;
  conversation: Conversation;
  onUpdate?: () => void; 
  
}

export default function ClientInformationUI({
  clientInformation,
  conversation,
  onUpdate,
  setClientInformation
}: ClientInformationUIProps) {
  const [formData, setFormData] = useState<ClientInformation>({
    name: '',
    identifier: conversation?.AppClientID || '',
    email: '',
    phoneNumber: '',
    jobTitle: '',
    notes: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("the set client information is ", clientInformation)
    console.log("thisis the identifier ", conversation?.AppClientID)
    if (clientInformation) {
      setFormData(clientInformation);
    } else {
      ClientInformationService.findClientInfoByIdentifier(conversation?.AppClientID || '').then((data) => {
        setFormData(data);
        setClientInformation(data);
      })

    }
  }, [clientInformation, conversation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!clientInformation) {
    return null; 
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (clientInformation) {
        await ClientInformationService.updateClient(formData);
      } else { 
        console.log("theis is the formdata ", formData)
        formData.identifier = conversation?.AppClientID || '';
        await ClientInformationService.createClientInfo(formData);
      }
      
      setIsEditing(false);
      if (onUpdate) onUpdate(); // Notify parent to refresh data
    } catch (error) {
      console.error('Error saving client information:', error);
      // You might want to add error notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='chat-info'>
      <div data-simplebar className='nicescroll-bar'>
        <div className='text-center'>
          <img
            src={`https://avatar.iran.liara.run/username?username=${clientInformation?.identifier || 'user'}`}
            alt='user'
            className='avatar-img avatar-rounded avatar-xl w-50 h-50'
          />

          <div className='cp-name text-truncate mt-2'>
            {clientInformation?.name || 'New Client'}
          </div>
          
          {!isEditing && (
            
            <button 
              className='btn btn-primary btn-sm mt-2'
              onClick={() => setIsEditing(true)}
            >
              {clientInformation ? 'Edit Information' : 'Add Information'}
            </button>
          )}
        </div>

        <div className='mt-4'>
          {isEditing ? (
            <div className='card'>
              <div className='card-header'>
                <h5>{clientInformation ? 'Edit' : 'Add'} Client Information</h5>
              </div>
              <div className='card-body'>
                <form onSubmit={handleSubmit}>
                  <div className='mb-3'>
                  <label className='form-label'>Full Name</label>
                  <input
                    type='text'
                    className='form-control'
                    name='name'
                    value={formData?.name || ''}
                    onChange={handleInputChange}
                    required
                  />
                  </div>
                  
                  <div className='mb-3'>
                  <label className='form-label'>Email</label>
                  <input
                    type='email'
                    className='form-control'
                    name='email'
                    value={formData?.email || ''}
                    onChange={handleInputChange}
                  />
                  </div>
                  
                  <div className='mb-3'>
                  <label className='form-label'>Phone Number</label>
                  <input
                    type='tel'
                    className='form-control'
                    name='phoneNumber'
                    value={formData?.phoneNumber || ''}
                    onChange={handleInputChange}
                  />
                  </div>
                  
                  <div className='mb-3'>
                  <label className='form-label'>Job Title</label>
                  <input
                    type='text'
                    className='form-control'
                    name='jobTitle'
                    value={formData?.jobTitle || ''}
                    onChange={handleInputChange}
                  />
                  </div>
                  
                  <div className='mb-3'>
                  <label className='form-label'>Notes</label>
                  <textarea
                    className='form-control'
                    name='notes'
                    value={formData?.notes || ''}
                    onChange={handleInputChange}
                    rows={3}
                  />
                  </div>
                  
                  <div className='d-flex justify-content-end gap-2'>
                  <button
                    type='button'
                    className='btn btn-secondary'
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='btn btn-primary'
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className='collapse-simple'>
              <div className='card'>
                <div className='card-header'>
                  <h5>General Info</h5>
                </div>
                <div id='gn_info' className='collapse show'>
                  <div className='card-body'>
                    <ul className='cp-info'>
                      <li>
                        <a href='javascript:void(0);'>
                          <span className='cp-icon-wrap'>
                            <span className='feather-icon'>
                              <i data-feather='user'></i>
                            </span>
                          </span>
                          {clientInformation?.name || 'No name provided'}
                        </a>
                      </li>
                      <li>
                        <a href='javascript:void(0);'>
                          <span className='cp-icon-wrap'>
                            <span className='feather-icon'>
                              <i data-feather='briefcase'></i>
                            </span>
                          </span>
                          {clientInformation?.jobTitle || 'No job title provided'}
                        </a>
                      </li>
                      <li>
                        <a href='javascript:void(0);'>
                          <span className='cp-icon-wrap'>
                            <span className='feather-icon'>
                              <i data-feather='mail'></i>
                            </span>
                          </span>
                          {clientInformation?.email || 'No email provided'}
                        </a>
                      </li>
                      <li>
                        <a href='javascript:void(0);'>
                          <span className='cp-icon-wrap'>
                            <span className='feather-icon'>
                              <i data-feather='phone'></i>
                            </span>
                          </span>
                          {clientInformation?.phoneNumber || 'No phone number provided'}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className='card mt-3'>
                <div className='card-header'>
                  <h5>Notes</h5>
                </div>
                <div id='notes_collapse' className='collapse show'>
                  <div className='card-body'>
                    {clientInformation?.notes ? (
                      <p>{clientInformation.notes}</p>
                    ) : (
                      <p>No additional notes available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}