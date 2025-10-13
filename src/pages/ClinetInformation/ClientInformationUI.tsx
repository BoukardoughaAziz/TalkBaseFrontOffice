import { useState, useEffect } from 'react';
import { ClientInformation } from '@/models/ClientInformation';
import ClientInformationService from '@/services/Client Informations/ClientInformationService';
import { useConversation } from '@/context/ConversationContext';
import { User, Mail, Phone, Briefcase, FileText, Edit2, Save, X, Loader } from 'lucide-react';

export default function ClientInformationUI() {
  const { clientInformation, setClientInformation, convo } = useConversation();
  const [formData, setFormData] = useState<ClientInformation>({
    name: '',
    identifier: convo?.AppClientID || '',
    email: '',
    phoneNumber: '',
    jobTitle: '',
    notes: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientInfo = async () => {
      if (!convo?.AppClientID) {
        setIsFetching(false);
        return;
      }

      setIsFetching(true);
      setError(null);
      
      try {
        if (clientInformation) {
          setFormData(clientInformation);
        } else {
          const data = await ClientInformationService.findClientInfoByIdentifier(convo.AppClientID);
          setFormData(data || {
            name: '',
            identifier: convo.AppClientID,
            email: '',
            phoneNumber: '',
            jobTitle: '',
            notes: '',
          });
          if (data) setClientInformation(data);
        }
      } catch (err) {
        console.error("Error fetching client information:", err);
        setError("Failed to load client information");
      } finally {
        setIsFetching(false);
      }
    };

    fetchClientInfo();
  }, [convo?.AppClientID]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      formData.identifier = convo?.AppClientID || '';
      
      if (clientInformation) {
        await ClientInformationService.updateClient(formData);
      } else {
        await ClientInformationService.createClientInfo(formData);
      }
      
      setClientInformation(formData);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving client information:", err);
      setError("Failed to save client information");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className='client-info-container'>
        <div className='loading-state'>
          <Loader className='spinner' size={40} />
          <p>Loading client information...</p>
        </div>
        <style>{clientInfoStyles}</style>
      </div>
    );
  }

  return (
    <div className='client-info-container'>
      {/* Header Section */}
      <div className='client-header'>
        <div className='avatar-section'>
          <div className='avatar-wrapper'>
            <img
              src={`https://avatar.iran.liara.run/username?username=${formData?.name || formData?.identifier || 'user'}`}
              alt='client avatar'
              className='client-avatar'
            />
            <div className='online-indicator'></div>
          </div>
          <h3 className='client-name'>{formData?.name || 'New Client'}</h3>
          <span className='client-id'>ID: {formData?.identifier?.slice(0, 8) || 'N/A'}</span>
        </div>

        {!isEditing && (
          <button 
            className='edit-btn'
            onClick={() => setIsEditing(true)}
            title='Edit information'
          >
            <Edit2 size={18} />
            <span>{clientInformation ? 'Edit' : 'Add Info'}</span>
          </button>
        )}
      </div>

      {error && (
        <div className='error-message'>
          <X size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Content Section */}
      <div className='client-content'>
        {isEditing ? (
          <div className='edit-form'>
            <h4 className='form-title'>
              {clientInformation ? 'Edit Information' : 'Add Client Information'}
            </h4>
            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <label>
                  <User size={16} />
                  Full Name *
                </label>
                <input
                  type='text'
                  name='name'
                  value={formData?.name || ''}
                  onChange={handleInputChange}
                  placeholder='Enter full name'
                  required
                />
              </div>

              <div className='form-group'>
                <label>
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  type='email'
                  name='email'
                  value={formData?.email || ''}
                  onChange={handleInputChange}
                  placeholder='client@example.com'
                />
              </div>

              <div className='form-group'>
                <label>
                  <Phone size={16} />
                  Phone Number
                </label>
                <input
                  type='tel'
                  name='phoneNumber'
                  value={formData?.phoneNumber || ''}
                  onChange={handleInputChange}
                  placeholder='+1 (555) 123-4567'
                />
              </div>

              <div className='form-group'>
                <label>
                  <Briefcase size={16} />
                  Job Title
                </label>
                <input
                  type='text'
                  name='jobTitle'
                  value={formData?.jobTitle || ''}
                  onChange={handleInputChange}
                  placeholder='e.g. Product Manager'
                />
              </div>

              <div className='form-group'>
                <label>
                  <FileText size={16} />
                  Notes
                </label>
                <textarea
                  name='notes'
                  value={formData?.notes || ''}
                  onChange={handleInputChange}
                  placeholder='Add any additional notes about this client...'
                  rows={4}
                />
              </div>

              <div className='form-actions'>
                <button
                  type='button'
                  className='btn-secondary'
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  type='submit'
                  className='btn-primary'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className='spinner-sm' size={16} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className='info-view'>
            {/* Contact Information */}
            <div className='info-section'>
              <h5 className='section-title'>Contact Information</h5>
              <div className='info-grid'>
                <div className='info-item'>
                  <div className='info-icon'>
                    <User size={18} />
                  </div>
                  <div className='info-details'>
                    <span className='info-label'>Full Name</span>
                    <span className='info-value'>{formData?.name || 'Not provided'}</span>
                  </div>
                </div>

                <div className='info-item'>
                  <div className='info-icon'>
                    <Mail size={18} />
                  </div>
                  <div className='info-details'>
                    <span className='info-label'>Email</span>
                    <span className='info-value'>{formData?.email || 'Not provided'}</span>
                  </div>
                </div>

                <div className='info-item'>
                  <div className='info-icon'>
                    <Phone size={18} />
                  </div>
                  <div className='info-details'>
                    <span className='info-label'>Phone</span>
                    <span className='info-value'>{formData?.phoneNumber || 'Not provided'}</span>
                  </div>
                </div>

                <div className='info-item'>
                  <div className='info-icon'>
                    <Briefcase size={18} />
                  </div>
                  <div className='info-details'>
                    <span className='info-label'>Job Title</span>
                    <span className='info-value'>{formData?.jobTitle || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className='info-section'>
              <h5 className='section-title'>
                <FileText size={18} />
                Notes
              </h5>
              <div className='notes-content'>
                {formData?.notes ? (
                  <p>{formData.notes}</p>
                ) : (
                  <p className='empty-state'>No additional notes available</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{clientInfoStyles}</style>
    </div>
  );
}

const clientInfoStyles = `
  .client-info-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    overflow: hidden;
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: white;
    gap: 1rem;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .spinner-sm {
    animation: spin 1s linear infinite;
  }

  /* Header Section */
  .client-header {
    padding: 2rem 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  .avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .avatar-wrapper {
    position: relative;
  }

  .client-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 4px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    object-fit: cover;
  }

  .online-indicator {
    position: absolute;
    bottom: 5px;
    right: 5px;
    width: 18px;
    height: 18px;
    background: #10b981;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .client-name {
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    text-align: center;
  }

  .client-id {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.875rem;
    font-family: monospace;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
  }

  .edit-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem 1rem;
    background: white;
    color: #667eea;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .edit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }

  /* Error Message */
  .error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    margin: 1rem 1.5rem;
    background: rgba(239, 68, 68, 0.9);
    color: white;
    border-radius: 8px;
    font-size: 0.875rem;
  }

  /* Content Section */
  .client-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    background: white;
  }

  /* Edit Form */
  .edit-form {
    max-width: 100%;
  }

  .form-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.875rem;
    transition: all 0.2s;
    font-family: inherit;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .form-group textarea {
    resize: vertical;
    min-height: 100px;
  }

  .form-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 2rem;
  }

  .btn-secondary,
  .btn-primary {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
  }

  .btn-secondary {
    background: #f3f4f6;
    color: #6b7280;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #e5e7eb;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .btn-secondary:disabled,
  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Info View */
  .info-view {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .info-section {
    background: #f9fafb;
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
  }

  .section-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .info-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .info-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    transition: all 0.2s;
  }

  .info-item:hover {
    border-color: #667eea;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
  }

  .info-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 8px;
    flex-shrink: 0;
  }

  .info-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
  }

  .info-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .info-value {
    font-size: 0.875rem;
    color: #1f2937;
    word-break: break-word;
  }

  .notes-content {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    min-height: 100px;
  }

  .notes-content p {
    margin: 0;
    color: #374151;
    font-size: 0.875rem;
    line-height: 1.6;
    white-space: pre-wrap;
  }

  .empty-state {
    color: #9ca3af !important;
    font-style: italic;
  }

  /* Scrollbar */
  .client-content::-webkit-scrollbar {
    width: 6px;
  }

  .client-content::-webkit-scrollbar-track {
    background: #f3f4f6;
  }

  .client-content::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }

  .client-content::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`;