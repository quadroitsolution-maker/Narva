'use client'

import React, { useState, useEffect } from 'react'
import { Bell, Check, Trash2, Eye } from 'lucide-react'

interface NotificationsTabProps {
  supabase: any
  user: any
}

export default function NotificationsTab({ supabase, user }: NotificationsTabProps) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setNotifications(data)
      }
    } catch (err) {
      console.error('Error fetching notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadNotifications()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)

      if (error) throw error
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      )
    } catch (err) {
      console.error('Failed to mark read:', err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)

      if (error) throw error
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (err) {
      console.error('Failed to delete notification:', err)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)

      if (error) throw error
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (err) {
      console.error('Failed to mark all read:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-premium-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-premium-gold/10 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-2xl font-light">Alerts & Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-premium-gold text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount} New
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1 border border-premium-gold/25 text-premium-gold hover:bg-premium-gold/5 px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors"
          >
            <Check size={12} /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="glass-panel text-center py-16 rounded-2xl border border-premium-gold/10">
          <Bell className="text-premium-gold/25 mx-auto mb-3" size={32} />
          <p className="text-xs text-matte-black/45">You have no active alerts.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(n => {
            const dateStr = new Date(n.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })

            return (
              <div
                key={n.id}
                className={`glass-panel p-4 rounded-xl border flex justify-between items-start gap-4 transition-all duration-300 ${
                  n.read ? 'border-premium-gold/5 opacity-65 bg-warm-beige/5' : 'border-premium-gold/20 shadow-md bg-premium-gold/5'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-premium-gold flex-shrink-0 animate-pulse" />
                    )}
                    <h3 className="font-serif text-sm font-medium text-matte-black dark:text-dark-text">
                      {n.title}
                    </h3>
                  </div>
                  <p className="text-xs text-matte-black/60 dark:text-dark-text/60 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="block text-[9px] text-matte-black/40 dark:text-dark-text/40 pt-1">
                    {dateStr}
                  </span>
                </div>

                <div className="flex gap-2">
                  {!n.read && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="p-2 border border-premium-gold/10 hover:border-premium-gold hover:bg-premium-gold/5 text-premium-gold rounded-full transition-all"
                      title="Mark as Read"
                    >
                      <Eye size={12} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="p-2 border border-red-500/10 hover:border-red-500 hover:bg-red-500/5 text-red-500 rounded-full transition-all"
                    title="Delete Notification"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
