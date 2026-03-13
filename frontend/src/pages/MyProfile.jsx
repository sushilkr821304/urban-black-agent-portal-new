import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Calendar, 
  ShieldCheck, Star, Edit2, Camera, Save, X,
  Briefcase, Hash, Map, Globe
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './MyProfile.css';

const MyProfile = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    alternateMobile: '',
    experienceYears: '',
    specialization: '',
    education: '',
    languages: '',
    agencyName: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/agents/profile');
      setProfileData(response.data);
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        dob: response.data.dob || '',
        gender: response.data.gender || '',
        address: response.data.address || '',
        city: response.data.city || '',
        state: response.data.state || '',
        pincode: response.data.pincode || '',
        alternateMobile: response.data.alternateMobile || '',
        experienceYears: response.data.experienceYears || '',
        specialization: response.data.specialization || '',
        education: response.data.education || '',
        languages: response.data.languages || '',
        agencyName: response.data.agencyName || ''
      });
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordInputChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      if (selectedFile) {
        submitData.append('profilePhoto', selectedFile);
      }

      await api.put('/agents/update', submitData);
      toast.success('Profile updated successfully');
      setEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchProfile();
      refreshUser();
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      try {
        const submitData = new FormData();
        submitData.append('profilePhoto', file);
        submitData.append('name', formData.name || user?.agent?.name || 'Agent');
        submitData.append('email', formData.email || user?.agent?.email || '');

        await api.put('/agents/update', submitData);
        toast.success('Photo updated successfully');
        fetchProfile();
        refreshUser();
      } catch (err) {
        toast.error(err.response?.data || 'Failed to upload photo');
      }
    }
  };

  if (loading) return <div className="loading-container">Loading Profile...</div>;

  return (
    <div className="profile-container-v3">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your personal information and agency settings.</p>
      </div>

      <div className="profile-grid">
        {/* Left: Overview Card */}
        <div className="overview-card">
          <div className="avatar-section">
            <div className="profile-avatar-large">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" />
              ) : profileData?.profilePhoto ? (
                <img 
                  src={profileData.profilePhoto.startsWith('http') ? profileData.profilePhoto : `http://localhost:8080/${profileData.profilePhoto}`} 
                  alt="Profile" 
                />
              ) : (
                <div className="avatar-initials-large">
                  {profileData?.name?.charAt(0) || 'A'}
                </div>
              )}
              {(!profileData?.profilePhoto || editing) && (
                <label className="change-photo-btn">
                  <Camera size={16} />
                  <input type="file" hidden onChange={editing ? handleFileChange : handlePhotoUpload} accept="image/*" />
                </label>
              )}
            </div>
            <h2 className="profile-name-v3">{profileData?.name || 'Agent Name'}</h2>
            <div className={`status-badge-v3 ${profileData?.kyc?.kycStatus?.toLowerCase() || 'unverified'}`}>
              <ShieldCheck size={14} />
              {profileData?.kyc?.kycStatus || 'Unverified'}
            </div>
          </div>

          <div className="info-list-v3">
            <div className="info-item"><Hash size={16} /> <span>ID: UB-AG-{profileData?.id?.toString().padStart(4, '0')}</span></div>
            <div className="info-item"><Phone size={16} /> <span>{user?.phoneNumber}</span></div>
            <div className="info-item"><Mail size={16} /> <span>{profileData?.email || 'No email set'}</span></div>
            <div className="info-item"><MapPin size={16} /> <span>{profileData?.city || 'City'}, {profileData?.state || 'State'}</span></div>
            <div className="info-item"><Calendar size={16} /> <span>Since {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : '---'}</span></div>
            <div className="info-item rating"><Star size={16} fill="#F59E0B" /> <span>{profileData?.rating || '4.8'} Rating</span></div>
          </div>

          {!editing && activeTab === 'profile' && (
            <button className="edit-profile-trigger" onClick={() => setEditing(true)}>
              <Edit2 size={16} /> Edit Profile
            </button>
          )}
        </div>

        {/* Right: Forms/Tabs */}
        <div className="form-content-card">
          <div className="tabs-navigation">
            <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => {setActiveTab('profile'); setEditing(false);}}>Profile Details</button>
            <button className="tab-btn" onClick={() => window.location.href = '/kyc'}>KYC Verification</button>
            <button className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`} onClick={() => {setActiveTab('security'); setEditing(false);}}>Security</button>
          </div>

          <div className="tab-panel">
            {activeTab === 'profile' && (
              <>
                {editing ? (
                  <form onSubmit={handleSave} className="edit-form-v3">
                    <div className="form-grid-v3">
                      <div className="input-group">
                        <label>Full Name</label>
                        <input name="name" value={formData.name} onChange={handleInputChange} required />
                      </div>
                      <div className="input-group">
                        <label>Email ID</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                      </div>
                      <div className="input-group">
                        <label>Mobile Number</label>
                        <input value={user?.phoneNumber} disabled className="disabled-input" />
                      </div>
                      <div className="input-group">
                        <label>Date of Birth</label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} />
                      </div>
                      <div className="input-group">
                        <label>Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleInputChange}>
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <label>Pincode</label>
                        <input name="pincode" value={formData.pincode} onChange={handleInputChange} maxLength="6" />
                      </div>
                      <div className="input-group full-width">
                        <label>Address</label>
                        <input name="address" value={formData.address} onChange={handleInputChange} />
                      </div>
                      <div className="input-group">
                        <label>City</label>
                        <input name="city" value={formData.city} onChange={handleInputChange} />
                      </div>
                      <div className="input-group">
                        <label>State</label>
                        <input name="state" value={formData.state} onChange={handleInputChange} />
                      </div>
                      <div className="input-group">
                        <label>Agency Name</label>
                        <input name="agencyName" value={formData.agencyName} onChange={handleInputChange} />
                      </div>
                      <div className="input-group">
                        <label>Alternate Mobile</label>
                        <input name="alternateMobile" value={formData.alternateMobile} onChange={handleInputChange} />
                      </div>
                      <div className="input-group">
                        <label>Experience (Years)</label>
                        <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleInputChange} />
                      </div>
                      <div className="input-group">
                        <label>Specialization</label>
                        <input name="specialization" value={formData.specialization} onChange={handleInputChange} placeholder="e.g. Electrical, Plumbing" />
                      </div>
                      <div className="input-group">
                        <label>Education</label>
                        <input name="education" value={formData.education} onChange={handleInputChange} />
                      </div>
                      <div className="input-group">
                        <label>Languages</label>
                        <input name="languages" value={formData.languages} onChange={handleInputChange} placeholder="English, Hindi, etc." />
                      </div>
                    </div>

                    <div className="form-actions-v3">
                      <button type="button" className="btn-cancel" onClick={() => { setEditing(false); setSelectedFile(null); setPreviewUrl(null); }}>
                        <X size={18} /> Cancel
                      </button>
                      <button type="submit" className="btn-save">
                        <Save size={18} /> Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="static-details-v3">
                    <div className="details-grid-v3">
                       <div className="detail-row"><span>Full Name</span><p>{profileData?.name || '---'}</p></div>
                       <div className="detail-row"><span>Email</span><p>{profileData?.email || '---'}</p></div>
                       <div className="detail-row"><span>Date of Birth</span><p>{profileData?.dob || '---'}</p></div>
                       <div className="detail-row"><span>Gender</span><p>{profileData?.gender || '---'}</p></div>
                       <div className="detail-row"><span>Full Address</span><p>{profileData?.address || '---'}</p></div>
                       <div className="detail-row"><span>City</span><p>{profileData?.city || '---'}</p></div>
                       <div className="detail-row"><span>State</span><p>{profileData?.state || '---'}</p></div>
                       <div className="detail-row"><span>Pincode</span><p>{profileData?.pincode || '---'}</p></div>
                       <div className="detail-row"><span>Agency Name</span><p>{profileData?.agencyName || '---'}</p></div>
                       <div className="detail-row"><span>Alt Mobile</span><p>{profileData?.alternateMobile || '---'}</p></div>
                       <div className="detail-row"><span>Experience</span><p>{profileData?.experienceYears ? `${profileData.experienceYears} Years` : '---'}</p></div>
                       <div className="detail-row"><span>Specialization</span><p>{profileData?.specialization || '---'}</p></div>
                       <div className="detail-row"><span>Education</span><p>{profileData?.education || '---'}</p></div>
                       <div className="detail-row"><span>Languages</span><p>{profileData?.languages || '---'}</p></div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handlePasswordUpdate} className="edit-form-v3">
                <div className="form-grid-v3">
                  <div className="input-group full-width">
                    <label>Current Password</label>
                    <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordInputChange} required />
                  </div>
                  <div className="input-group">
                    <label>New Password</label>
                    <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordInputChange} required />
                  </div>
                  <div className="input-group">
                    <label>Confirm New Password</label>
                    <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordInputChange} required />
                  </div>
                </div>
                <div className="form-actions-v3">
                  <button type="submit" className="btn-save">
                    <ShieldCheck size={18} /> Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
