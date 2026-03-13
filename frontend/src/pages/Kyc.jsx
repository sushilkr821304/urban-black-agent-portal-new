import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileCheck, Shield, Upload, CheckCircle, 
  AlertCircle, Clock, Info, ChevronRight, X, FileText
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import './KycV2.css';

const Kyc = () => {
  const [loading, setLoading] = useState(true);
  const [kycData, setKycData] = useState(null);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    agencyName: '',
    email: '',
    aadharNumber: '',
    panNumber: '',
    pinCode: '',
    city: '',
    state: ''
  });

  const [files, setFiles] = useState({
    aadharFront: null,
    aadharBack: null,
    panCard: null
  });

  const [previews, setPreviews] = useState({
    aadharFront: null,
    aadharBack: null,
    panCard: null
  });

  useEffect(() => {
    fetchKycStatus();
  }, []);

  const fetchKycStatus = async () => {
    try {
      const response = await api.get('/kyc/status');
      if (response.data && response.data.kycStatus !== 'Pending') {
        setKycData(response.data);
        setFormData({
          agencyName: response.data.agencyName || '',
          email: response.data.email || '',
          aadharNumber: response.data.aadharNumber || '',
          panNumber: response.data.panNumber || '',
          pinCode: response.data.pinCode || '',
          city: response.data.city || '',
          state: response.data.state || ''
        });
        setPreviews({
          aadharFront: response.data.aadharFrontImage,
          aadharBack: response.data.aadharBackImage,
          panCard: response.data.panImage
        });
      }
    } catch (err) {
      console.error('Failed to fetch KYC status');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFiles({ ...files, [field]: file });
      setPreviews({ ...previews, [field]: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.aadharNumber.length !== 12) {
      toast.error('Aadhar must be 12 digits');
      return;
    }
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    if (!panRegex.test(formData.panNumber.toUpperCase())) {
      toast.error('Invalid PAN Number format');
      return;
    }

    if (!files.aadharFront || !files.aadharBack || !files.panCard) {
      toast.error('Please upload all required documents');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      data.append('aadharFront', files.aadharFront);
      data.append('aadharBack', files.aadharBack);
      data.append('panCard', files.panCard);

      await api.post('/kyc/submit', data);
      toast.success('KYC submitted for evaluation');
      fetchKycStatus();
    } catch (err) {
      toast.error('Failed to submit KYC');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-container">Loading KYC Status...</div>;

  if (kycData?.kycStatus === 'Approved') {
    return (
      <div className="kyc-success-view">
        <div className="success-icon-bg">
          <CheckCircle size={64} color="#10B981" />
        </div>
        <h2>KYC Verified Successfully</h2>
        <p>Your agency account is fully active and verified.</p>
        <div className="kyc-summary-card">
           <div className="summ-row"><span>Agency</span><strong>{kycData.agencyName}</strong></div>
           <div className="summ-row"><span>Status</span><strong className="text-green">Approved</strong></div>
           <div className="summ-row"><span>Verified On</span><strong>{new Date(kycData.verifiedAt).toLocaleDateString()}</strong></div>
        </div>
      </div>
    );
  }

  return (
    <div className="kyc-page-v3">
      <div className="page-header">
        <h1 className="page-title">KYC Verification</h1>
        <p className="page-subtitle">Submit your identity documents for agency verification.</p>
      </div>

      <div className="kyc-content-grid">
        {/* Left Info Panel */}
        <div className="kyc-info-panel">
          <div className="info-card-blue">
            <Info size={24} />
            <div>
              <h4>Why KYC?</h4>
              <p>KYC is mandatory for all agents to enable payouts and wallet withdrawals.</p>
            </div>
          </div>

          <div className="kyc-steps-timeline">
            <div className={`timeline-step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-num">{step > 1 ? <CheckCircle size={16} /> : '1'}</div>
              <span>Personal Details</span>
            </div>
            <div className={`timeline-step ${step >= 2 ? 'active' : ''}`}>
               <div className="step-num">{step > 2 ? <CheckCircle size={16} /> : '2'}</div>
              <span>Identity Documents</span>
            </div>
            <div className={`timeline-step`}>
              <div className="step-num">3</div>
              <span>Admin Review</span>
            </div>
          </div>

          {kycData && (
            <div className={`status-summary-alert ${kycData.kycStatus.toLowerCase()}`}>
               {kycData.kycStatus === 'In Progress' ? <Clock size={20} /> : <AlertCircle size={20} />}
               <div>
                  <strong>Status: {kycData.kycStatus}</strong>
                  <p>{kycData.kycStatus === 'In Progress' ? 'Our team is reviewing your documents.' : 'Please re-submit corrected documents.'}</p>
               </div>
            </div>
          )}
        </div>

        {/* Right Form Container */}
        <div className="kyc-form-container">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="kyc-step-wrapper"
              >
                <h3 className="step-title">Personal & Agency Details</h3>
                <div className="kyc-form-grid">
                  <div className="input-group full-width">
                    <label>Agency Name</label>
                    <input name="agencyName" value={formData.agencyName} onChange={handleInputChange} placeholder="Legal Agency Name" />
                  </div>
                  <div className="input-group">
                    <label>Email Address</label>
                    <input name="email" value={formData.email} onChange={handleInputChange} placeholder="agency@example.com" />
                  </div>
                  <div className="input-group">
                    <label>Pin Code</label>
                    <input name="pinCode" value={formData.pinCode} onChange={handleInputChange} placeholder="411001" maxLength="6" />
                  </div>
                  <div className="input-group">
                    <label>Aadhar Number</label>
                    <input name="aadharNumber" value={formData.aadharNumber} onChange={handleInputChange} placeholder="12 Digit Aadhar" maxLength="12" />
                  </div>
                  <div className="input-group">
                    <label>PAN Number</label>
                    <input name="panNumber" value={formData.panNumber} onChange={handleInputChange} placeholder="ABCDE1234F" maxLength="10" className="uppercase" />
                  </div>
                  <div className="input-group">
                    <label>City</label>
                    <input name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Pune" />
                  </div>
                  <div className="input-group">
                    <label>State</label>
                    <input name="state" value={formData.state} onChange={handleInputChange} placeholder="e.g. Maharashtra" />
                  </div>
                </div>
                <div className="step-actions">
                  <button className="btn-primary-v3" onClick={() => setStep(2)}>
                    Next: Upload Documents <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="kyc-step-wrapper"
              >
                <div className="step-header-row">
                  <h3 className="step-title">Document Upload</h3>
                  <button className="back-link" onClick={() => setStep(1)}>Go Back</button>
                </div>
                
                <div className="upload-grid-v3">
                  <DocumentUploadItem 
                    label="Aadhar Card Front" 
                    id="aadharFront"
                    file={files.aadharFront}
                    preview={previews.aadharFront}
                    onFileChange={handleFileChange}
                  />
                  <DocumentUploadItem 
                    label="Aadhar Card Back" 
                    id="aadharBack"
                    file={files.aadharBack}
                    preview={previews.aadharBack}
                    onFileChange={handleFileChange}
                  />
                  <DocumentUploadItem 
                    label="PAN Card" 
                    id="panCard"
                    file={files.panCard}
                    preview={previews.panCard}
                    onFileChange={handleFileChange}
                  />
                </div>

                <div className="step-actions submit-row">
                   <p className="declaration">I hereby declare that the documents uploaded are genuine and belong to me.</p>
                   <button 
                    className="btn-submit-kyc" 
                    onClick={handleSubmit}
                    disabled={submitting}
                   >
                     {submitting ? 'Submitting...' : 'Submit KYC Verification'}
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const DocumentUploadItem = ({ label, id, file, preview, onFileChange }) => {
  return (
    <div className="upload-card-v3">
      <div className="upload-header-s">
        <span>{label}</span>
        {file && <CheckCircle size={16} color="#10B981" />}
      </div>
      
      <label className={`dropzone-v3 ${preview ? 'has-file' : ''}`}>
        <input type="file" hidden onChange={(e) => onFileChange(e, id)} accept="image/*,application/pdf" />
        
        {preview ? (
          <div className="preview-container">
            {file?.type?.includes('pdf') || (typeof preview === 'string' && preview.endsWith('.pdf')) ? (
              <div className="pdf-preview">
                 <FileText size={40} color="var(--primary)" />
                 <p>{file?.name || 'Uploaded Document'}</p>
              </div>
            ) : (
              <img 
                src={typeof preview === 'string' && preview.startsWith('http') ? preview : (preview?.startsWith('blob') ? preview : `http://localhost:8080/${preview}`)} 
                alt="Preview" 
              />
            )}
            <div className="change-overlay">
               <Upload size={20} />
               <span>Change File</span>
            </div>
          </div>
        ) : (
          <div className="empty-upload">
            <div className="upload-icon-circle">
               <Upload size={24} />
            </div>
            <p>Drag & drop or <span>Browse</span></p>
            <span className="file-info-s">JPG, PNG, PDF (Max 5MB)</span>
          </div>
        )}
      </label>
    </div>
  );
};

export default Kyc;
