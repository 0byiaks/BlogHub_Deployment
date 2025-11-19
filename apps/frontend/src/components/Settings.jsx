import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userService } from '../services/userService'
import './Settings.css'

function Settings() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('account')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const [accountSettings, setAccountSettings] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    commentNotifications: true,
    postNotifications: true,
    weeklyDigest: false
  })

  const currentUser = userService.getCurrentUser()
  const userId = currentUser?.id || 'user1'

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const userData = await userService.getById(userId)
      setUser(userData)
      setAccountSettings({
        username: userData.username || '',
        email: userData.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccountChange = (e) => {
    setAccountSettings({
      ...accountSettings,
      [e.target.name]: e.target.value
    })
  }

  const handlePreferenceChange = (e) => {
    setPreferences({
      ...preferences,
      [e.target.name]: e.target.checked
    })
  }

  const handleSaveAccount = async (e) => {
    e.preventDefault()
    // TODO: Implement account update API call
    alert('Account settings saved! (This is a demo - actual update not implemented)')
  }

  const handleSavePreferences = async (e) => {
    e.preventDefault()
    // TODO: Implement preferences update API call
    localStorage.setItem('preferences', JSON.stringify(preferences))
    alert('Preferences saved!')
  }

  const handleLogout = () => {
    userService.logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="settings">
        <div className="loading">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="settings">
      <h1 className="settings-title">Settings</h1>

      <div className="settings-container">
        <div className="settings-sidebar">
          <button 
            className={`sidebar-item ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            Account
          </button>
          <button 
            className={`sidebar-item ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            Notifications
          </button>
          <button 
            className={`sidebar-item ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy
          </button>
          <button 
            className={`sidebar-item ${activeTab === 'danger' ? 'active' : ''}`}
            onClick={() => setActiveTab('danger')}
          >
            Danger Zone
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'account' && (
            <div className="settings-section">
              <h2 className="section-title">Account Settings</h2>
              <form onSubmit={handleSaveAccount} className="settings-form">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={accountSettings.username}
                    onChange={handleAccountChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={accountSettings.email}
                    onChange={handleAccountChange}
                    className="form-input"
                  />
                </div>

                <div className="form-divider">
                  <h3>Change Password</h3>
                </div>

                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={accountSettings.currentPassword}
                    onChange={handleAccountChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={accountSettings.newPassword}
                    onChange={handleAccountChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={accountSettings.confirmPassword}
                    onChange={handleAccountChange}
                    className="form-input"
                  />
                </div>

                <button type="submit" className="save-btn">Save Changes</button>
              </form>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="settings-section">
              <h2 className="section-title">Notification Preferences</h2>
              <form onSubmit={handleSavePreferences} className="settings-form">
                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Email Notifications</h3>
                    <p>Receive email notifications for important updates</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={preferences.emailNotifications}
                      onChange={handlePreferenceChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Comment Notifications</h3>
                    <p>Get notified when someone comments on your posts</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="commentNotifications"
                      checked={preferences.commentNotifications}
                      onChange={handlePreferenceChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Post Notifications</h3>
                    <p>Get notified about new posts from users you follow</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="postNotifications"
                      checked={preferences.postNotifications}
                      onChange={handlePreferenceChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Weekly Digest</h3>
                    <p>Receive a weekly summary of your activity</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="weeklyDigest"
                      checked={preferences.weeklyDigest}
                      onChange={handlePreferenceChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <button type="submit" className="save-btn">Save Preferences</button>
              </form>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="settings-section">
              <h2 className="section-title">Privacy Settings</h2>
              <div className="privacy-content">
                <div className="privacy-item">
                  <h3>Profile Visibility</h3>
                  <p>Control who can see your profile and posts</p>
                  <select className="form-select">
                    <option>Public</option>
                    <option>Followers Only</option>
                    <option>Private</option>
                  </select>
                </div>

                <div className="privacy-item">
                  <h3>Show Email</h3>
                  <p>Allow other users to see your email address</p>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="privacy-item">
                  <h3>Data Collection</h3>
                  <p>We collect minimal data to improve your experience. Your data is encrypted and secure.</p>
                  <button className="secondary-btn">View Privacy Policy</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="settings-section">
              <h2 className="section-title">Danger Zone</h2>
              <div className="danger-content">
                <div className="danger-item">
                  <div>
                    <h3>Logout</h3>
                    <p>Sign out of your account</p>
                  </div>
                  <button className="danger-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>

                <div className="danger-item">
                  <div>
                    <h3>Delete Account</h3>
                    <p>Permanently delete your account and all associated data</p>
                  </div>
                  <button className="danger-btn delete">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings

