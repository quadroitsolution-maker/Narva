'use client'

import React, { useState } from 'react'
import { Lock, Bell, LogOut, CheckCircle2 } from 'lucide-react'

interface SettingsTabProps {
  supabase: any
  onLogout: () => void
}

export default function SettingsTab({ supabase, onLogout }: SettingsTabProps) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword) return
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.')
      return
    }

    try {
      setChangingPassword(true)
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      alert('Password updated successfully.')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      console.error('Password change failed:', err)
      alert(err.message || 'Failed to update password.')
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-light border-b border-premium-gold/10 pb-4">Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Password Reset Section */}
        <form onSubmit={handlePasswordChange} className="glass-panel p-6 rounded-2xl border border-premium-gold/10 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-premium-gold flex items-center gap-1.5">
            <Lock size={13} /> Change Password
          </h3>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/50">New Password</label>
            <input
              required type="password" value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
              placeholder="Min 6 characters..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/50">Confirm Password</label>
            <input
              required type="password" value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
            />
          </div>

          <button
            disabled={changingPassword}
            type="submit"
            className="w-full bg-premium-gold text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl hover:bg-premium-gold/90 transition-colors"
          >
            {changingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        {/* Notifications Preferences & Session Section */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-premium-gold/10 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-premium-gold flex items-center gap-1.5">
              <Bell size={13} /> Notification Preferences
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-matte-black/75 dark:text-dark-text/75">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={e => setEmailAlerts(e.target.checked)}
                  className="accent-premium-gold h-4 w-4 rounded"
                />
                Receive Email shipping alerts & updates
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none text-matte-black/75 dark:text-dark-text/75">
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={e => setSmsAlerts(e.target.checked)}
                  className="accent-premium-gold h-4 w-4 rounded"
                />
                Receive SMS updates on formulation inventory
              </label>
            </div>
          </div>

          {/* Logout Trigger */}
          <div className="glass-panel p-6 rounded-2xl border border-red-500/20 bg-red-500/5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-500 flex items-center gap-1.5">
              <LogOut size={13} /> Log out Session
            </h3>
            <p className="text-[10px] text-red-500/80 leading-relaxed">
              Close your session. Next time you visit, you will need to sign in again.
            </p>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              Sign Out
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
