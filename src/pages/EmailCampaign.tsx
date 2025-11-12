import React, { useEffect, useState } from "react";
import { Mail, Send } from "lucide-react";
import axios from "axios";

const EmailCampaign: React.FC = () => {
  const [formData, setFormData] = useState({
    campaignName: "",
    subject: "",
    message: "",
    recipientGroup: "all",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(
          "https://talkbasebackend.onrender.com/NwidgetBackend/client-information/find-all-clients"
        );
        const clients = response.data;
        const emails = clients.map((client: any) => client.email);
        console.log("Client Emails:", emails);
      } catch (error) {
        console.error("Error fetching client emails:", error);
      }
    };

    fetchEmails();
  }, []);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("📧 Email campaign data:", formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({
      campaignName: "",
      subject: "",
      message: "",
      recipientGroup: "all",
    });
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        body {
          font-family: 'Poppins', sans-serif;
        }

        .email-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .card {
          width: 100%;
          max-width: 700px;
          min-width: 350px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
          padding: 40px;
          animation: slideInRight 0.6s ease-out;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .header h2 {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.3s ease;
          background-color: #f9fafb;
          box-sizing: border-box;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #667eea;
          background-color: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
        }

        .form-textarea {
          resize: vertical;
          min-height: 160px;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }

        .success-message {
          position: fixed;
          top: 24px;
          right: 24px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
          animation: slideInRight 0.4s ease-out;
          z-index: 1000;
        }

        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
          border-radius: 10px;
        }

        @media (max-width: 640px) {
          .card {
            padding: 24px;
          }

          .header h2 {
            font-size: 24px;
          }

          .success-message {
            top: 16px;
            right: 16px;
            left: 16px;
            justify-content: center;
          }
        }
      `}</style>

      <div className="email-container">
        <div className="card">
          <div className="header">
            <div className="icon-wrapper">
              <Mail size={24} style={{ color: "#667eea" }} />
            </div>
            <h2>Email Campaign</h2>
          </div>

          <div>
            <div className="form-group">
              <label className="form-label">Campaign Name</label>
              <input
                type="text"
                name="campaignName"
                value={formData.campaignName}
                onChange={handleChange}
                placeholder="e.g., Spring Promotion"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., Discover Our New Offers!"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message Content</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your email content here..."
                className="form-textarea"
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Recipient Group</label>
              <select
                name="recipientGroup"
                value={formData.recipientGroup}
                onChange={handleChange}
                className="form-select"
              >
                <option value="all">All Customers</option>
                <option value="recent">Recent Customers</option>
                <option value="inactive">Inactive Customers</option>
              </select>
            </div>

            <button onClick={handleSubmit} className="submit-btn">
              <Send size={18} />
              Send Campaign
            </button>
          </div>
        </div>

        {isSubmitted && (
          <div className="success-message">
            <span>✓</span>
            <span>Campaign sent successfully!</span>
          </div>
        )}
      </div>
    </>
  );
};

export default EmailCampaign;
