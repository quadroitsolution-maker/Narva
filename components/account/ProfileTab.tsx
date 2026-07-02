'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { User, Upload, Shield, RefreshCw } from 'lucide-react'

interface ProfileTabProps {
  supabase: any
  user: any
}

export default function ProfileTab({ supabase, user }: ProfileTabProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    dob: '',
    avatar_url: ''
  })

  // Fetch profile on load
  const loadProfile = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!error && data) {
        setProfile({
          full_name: data.full_name || '',
          phone: data.phone || '',
          dob: data.dob || '',
          avatar_url: data.avatar_url || ''
        })
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadProfile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          dob: profile.dob || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error
      alert('Profile updated successfully.')
    } catch (err) {
      console.error('Failed to update profile:', err)
      alert('Error updating profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const file = files[0]

    try {
      setSaving(true)
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`

      // Upload file to avatars bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Retrieve public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const publicUrl = data.publicUrl

      // Update database profile
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (dbError) throw dbError

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }))
      alert('Avatar uploaded successfully.')
    } catch (err) {
      console.error('Avatar upload failed:', err)
      alert('Failed to upload avatar. Make sure storage buckets & policies are created.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-premium-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-light border-b border-premium-gold/10 pb-4">Profile details</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left side: Avatar Manager */}
        <div className="glass-panel p-6 rounded-2xl border border-premium-gold/10 flex flex-col items-center gap-4 bg-warm-beige/5">
          <span className="text-[9px] font-bold uppercase tracking-widest text-premium-gold">Profile Picture</span>
          
          <div className="relative w-28 h-28 rounded-full border-2 border-premium-gold/30 overflow-hidden bg-warm-beige/25 flex items-center justify-center">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="avatar"
                fill
                className="object-cover"
              />
            ) : (
              <User size={40} className="text-premium-gold/40" />
            )}
            {saving && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                <RefreshCw size={16} className="animate-spin" />
              </div>
            )}
          </div>

          <label className="bg-premium-gold/10 border border-premium-gold/25 text-premium-gold text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl hover:bg-premium-gold/20 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
            <Upload size={12} /> Upload Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={saving}
            />
          </label>
          <p className="text-[9px] text-matte-black/45 text-center">
            Supports JPEG, PNG up to 2MB.
          </p>
        </div>

        {/* Right side: Information form */}
        <form onSubmit={handleProfileSave} className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-premium-gold/10 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-premium-gold flex items-center gap-1.5">
            <Shield size={14} /> Personal Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/50">Full Name</label>
              <input
                required type="text" value={profile.full_name}
                onChange={e => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/50">Phone Number</label>
              <input
                required type="tel" value={profile.phone}
                onChange={e => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/50">Email Address (Auth ID)</label>
              <input
                disabled type="email" value={user.email}
                className="w-full bg-warm-beige/25 border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl text-matte-black/40 select-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/50">Date of Birth</label>
              <input
                type="date" value={profile.dob}
                onChange={e => setProfile(prev => ({ ...prev, dob: e.target.value }))}
                className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none text-matte-black/60"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              disabled={saving}
              type="submit"
              className="bg-premium-gold text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl hover:bg-premium-gold/90 transition-colors shadow-md"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
