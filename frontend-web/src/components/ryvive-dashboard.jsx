import React, { useState } from 'react';
import { User, Calendar, TrendingUp, Receipt, MessageCircle, Bell, LogOut, Edit3, Lock, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function RyviveDashboard() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [editMode, setEditMode] = useState(false);
  
  // Mock user data
  const userData = {
    name: "Priya Sharma",
    memberId: "RYV2024001",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    address: "123, Green Valley, Dombivli East",
    currentPlan: "3-Month Transformation",
    joinDate: "March 15, 2024"
  };

  // Check if editing is allowed (before 5 PM)
  const currentHour = new Date().getHours();
  const canEdit = currentHour < 17;

  // Sample schedule data
  const weeklySchedule = [
    { week: 1, days: [
      { day: 'Mon', date: 'Apr 22', meal: 'Quinoa Bowl + Detox Juice', isCurrent: true },
      { day: 'Tue', date: 'Apr 23', meal: 'Grilled Chicken Salad + Green Tea' },
      { day: 'Wed', date: 'Apr 24', meal: 'Buddha Bowl + Immunity Shot' },
      { day: 'Thu', date: 'Apr 25', meal: 'Protein Smoothie Bowl + Nuts' },
      { day: 'Fri', date: 'Apr 26', meal: 'Mediterranean Wrap + Fresh Juice' },
      { day: 'Sat', date: 'Apr 27', meal: 'Power Breakfast + Herbal Tea' },
      { day: 'Sun', date: 'Apr 28', meal: 'Weekend Special + Wellness Shot' }
    ]},
    { week: 2, days: [
      { day: 'Mon', date: 'Apr 29', meal: 'Avocado Toast + Protein Shake' },
      { day: 'Tue', date: 'Apr 30', meal: 'Veggie Wrap + Green Smoothie' },
      { day: 'Wed', date: 'May 1', meal: 'Greek Salad + Fresh Juice' },
      { day: 'Thu', date: 'May 2', meal: 'Energy Bowl + Immunity Booster' },
      { day: 'Fri', date: 'May 3', meal: 'Grilled Fish + Detox Water' },
      { day: 'Sat', date: 'May 4', meal: 'Weekend Brunch + Herbal Infusion' },
      { day: 'Sun', date: 'May 5', meal: 'Recovery Meal + Wellness Drink' }
    ]},
    { week: 3, days: [
      { day: 'Mon', date: 'May 6', meal: 'Superfood Bowl + Matcha Latte' },
      { day: 'Tue', date: 'May 7', meal: 'Protein Wrap + Fresh Juice' },
      { day: 'Wed', date: 'May 8', meal: 'Buddha Bowl + Green Tea' },
      { day: 'Thu', date: 'May 9', meal: 'Wellness Salad + Immunity Shot' },
      { day: 'Fri', date: 'May 10', meal: 'Power Lunch + Detox Drink' },
      { day: 'Sat', date: 'May 11', meal: 'Weekend Special + Smoothie' },
      { day: 'Sun', date: 'May 12', meal: 'Rest Day Meal + Herbal Tea' }
    ]},
    { week: 4, days: [
      { day: 'Mon', date: 'May 13', meal: 'Energy Bowl + Power Smoothie' },
      { day: 'Tue', date: 'May 14', meal: 'Mediterranean Plate + Fresh Juice' },
      { day: 'Wed', date: 'May 15', meal: 'Protein Bowl + Wellness Shot' },
      { day: 'Thu', date: 'May 16', meal: 'Transformation Special + Green Tea' },
      { day: 'Fri', date: 'May 17', meal: 'Celebration Meal + Fresh Juice' },
      { day: 'Sat', date: 'May 18', meal: 'Weekend Treat + Smoothie Bowl' },
      { day: 'Sun', date: 'May 19', meal: 'Completion Meal + Wellness Drink' }
    ]}
  ];

  // Upgrade options
  const upgradePlans = [
    { name: '6-Month Transformation', price: '₹24,999', savings: 'Save ₹3,000', features: ['Extended program', 'Personal coach', 'Monthly check-ins'] },
    { name: '12-Month Lifestyle Reset', price: '₹45,999', savings: 'Save ₹8,000', features: ['Full year support', 'Quarterly assessments', 'Priority support'] }
  ];

  // Purchase history
  const transactions = [
    { id: 'TXN2024001', date: 'Mar 15, 2024', plan: '3-Month Transformation', amount: '₹12,999', method: 'UPI', status: 'Successful' },
    { id: 'TXN2024002', date: 'Feb 10, 2024', plan: 'Monthly Wellness', amount: '₹4,999', method: 'Card', status: 'Successful' }
  ];

  // Support tickets
  const tickets = [
    { id: 'TICK001', date: 'Apr 18, 2024', subject: 'Meal delivery timing', status: 'Resolved' },
    { id: 'TICK002', date: 'Apr 10, 2024', subject: 'Recipe customization', status: 'In Progress' }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fdf5 0%, #fef9f3 100%)',
      fontFamily: "'Outfit', sans-serif"
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(45, 80, 22, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '1.5rem',
            color: '#2d5016',
            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
          }}>R</div>
          <div>
            <h1 style={{ 
              margin: 0, 
              color: 'white', 
              fontSize: '1.5rem',
              fontWeight: '700',
              letterSpacing: '-0.02em'
            }}>Ryvive Roots</h1>
            <p style={{ margin: 0, color: '#d4af37', fontSize: '0.85rem', fontWeight: '500' }}>Wellness Dashboard</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '0.5rem 1rem', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: '1px solid rgba(212, 175, 55, 0.3)'
          }}>
            <User size={18} color="#d4af37" />
            <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>{userData.name}</span>
          </div>
          <button style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '8px',
            padding: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Bell size={20} color="#d4af37" />
          </button>
          <button style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '8px',
            padding: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}>
            <LogOut size={20} color="#d4af37" />
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 90px)' }}>
        {/* Sidebar */}
        <aside style={{
          width: '280px',
          background: 'white',
          padding: '2rem 0',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.05)',
          borderRight: '1px solid rgba(45, 80, 22, 0.08)'
        }}>
          <nav>
            {[
              { id: 'schedule', icon: Calendar, label: 'My Daily Schedule' },
              { id: 'info', icon: User, label: 'My Information' },
              { id: 'upgrade', icon: TrendingUp, label: 'Upgrade Plan' },
              { id: 'history', icon: Receipt, label: 'Purchase History' },
              { id: 'support', icon: MessageCircle, label: 'Support & Tickets' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '100%',
                  padding: '1rem 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  background: activeTab === item.id ? 'linear-gradient(90deg, rgba(45, 80, 22, 0.1) 0%, transparent 100%)' : 'transparent',
                  border: 'none',
                  borderLeft: activeTab === item.id ? '4px solid #d4af37' : '4px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: activeTab === item.id ? '#2d5016' : '#666',
                  fontSize: '0.95rem',
                  fontWeight: activeTab === item.id ? '600' : '500',
                  textAlign: 'left'
                }}
              >
                <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Summary Card */}
          <div style={{
            margin: '2rem 1.5rem',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #f0f7ec 0%, #fef9f3 100%)',
            borderRadius: '12px',
            border: '1px solid rgba(45, 80, 22, 0.1)'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#666', fontWeight: '500' }}>Membership ID</p>
            <p style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '700', color: '#2d5016' }}>{userData.memberId}</p>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#666', fontWeight: '500' }}>Current Plan</p>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: '#3d6b1f' }}>{userData.currentPlan}</p>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
          {/* My Daily Schedule */}
          {activeTab === 'schedule' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <h2 style={{ 
                margin: '0 0 0.5rem 0', 
                fontSize: '2rem', 
                fontWeight: '700', 
                color: '#2d5016',
                letterSpacing: '-0.02em'
              }}>My Daily Schedule</h2>
              <p style={{ margin: '0 0 2rem 0', color: '#666', fontSize: '1rem' }}>Your personalized 4-week transformation journey</p>

              {weeklySchedule.map((week) => (
                <div key={week.week} style={{ marginBottom: '2rem' }}>
                  <h3 style={{ 
                    margin: '0 0 1rem 0', 
                    fontSize: '1.2rem', 
                    fontWeight: '600', 
                    color: '#3d6b1f',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      color: '#2d5016'
                    }}>{week.week}</span>
                    Week {week.week}
                  </h3>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
                    gap: '1rem' 
                  }}>
                    {week.days.map((day) => (
                      <div key={day.date} style={{
                        background: day.isCurrent 
                          ? 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)' 
                          : 'white',
                        padding: '1.25rem',
                        borderRadius: '12px',
                        border: day.isCurrent ? 'none' : '1px solid rgba(45, 80, 22, 0.1)',
                        boxShadow: day.isCurrent 
                          ? '0 8px 24px rgba(45, 80, 22, 0.25)' 
                          : '0 2px 8px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {day.isCurrent && (
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: '#d4af37',
                            color: '#2d5016',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            padding: '4px 8px',
                            borderRadius: '6px'
                          }}>TODAY</div>
                        )}
                        <div style={{ 
                          fontWeight: '700', 
                          fontSize: '0.9rem', 
                          color: day.isCurrent ? '#d4af37' : '#2d5016',
                          marginBottom: '0.25rem'
                        }}>{day.day}</div>
                        <div style={{ 
                          fontSize: '0.8rem', 
                          color: day.isCurrent ? 'rgba(255, 255, 255, 0.8)' : '#999',
                          marginBottom: '0.75rem'
                        }}>{day.date}</div>
                        <div style={{ 
                          fontSize: '0.85rem', 
                          color: day.isCurrent ? 'white' : '#3d6b1f',
                          lineHeight: '1.4',
                          fontWeight: '500'
                        }}>{day.meal}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* My Information */}
          {activeTab === 'info' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ 
                    margin: '0 0 0.5rem 0', 
                    fontSize: '2rem', 
                    fontWeight: '700', 
                    color: '#2d5016',
                    letterSpacing: '-0.02em'
                  }}>My Information</h2>
                  <p style={{ margin: 0, color: '#666', fontSize: '1rem' }}>View and update your profile details</p>
                </div>
                {!editMode && canEdit && (
                  <button 
                    onClick={() => setEditMode(true)}
                    style={{
                      background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                      color: '#2d5016',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Edit3 size={16} />
                    Edit Information
                  </button>
                )}
              </div>

              {!canEdit && (
                <div style={{
                  background: 'linear-gradient(135deg, #fff4e5 0%, #ffe8cc 100%)',
                  padding: '1rem 1.25rem',
                  borderRadius: '10px',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  border: '1px solid rgba(212, 175, 55, 0.3)'
                }}>
                  <Clock size={20} color="#d4af37" />
                  <p style={{ margin: 0, color: '#8b6914', fontSize: '0.9rem', fontWeight: '500' }}>
                    Profile editing is only allowed until 5:00 PM daily. Please try again tomorrow.
                  </p>
                </div>
              )}

              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                border: '1px solid rgba(45, 80, 22, 0.08)'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {[
                    { label: 'Full Name', value: userData.name, locked: true },
                    { label: 'Membership ID', value: userData.memberId, locked: true },
                    { label: 'Email Address', value: userData.email },
                    { label: 'Phone Number', value: userData.phone },
                    { label: 'Address', value: userData.address },
                    { label: 'Join Date', value: userData.joinDate, locked: true }
                  ].map((field) => (
                    <div key={field.label}>
                      <label style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem', 
                        fontWeight: '600', 
                        color: '#666', 
                        marginBottom: '0.5rem' 
                      }}>
                        {field.label}
                        {field.locked && <Lock size={14} color="#999" />}
                      </label>
                      <input
                        type="text"
                        value={field.value}
                        disabled={!editMode || field.locked}
                        style={{
                          width: '100%',
                          padding: '0.875rem',
                          borderRadius: '10px',
                          border: editMode && !field.locked ? '2px solid #d4af37' : '1px solid rgba(45, 80, 22, 0.15)',
                          fontSize: '0.95rem',
                          fontWeight: '500',
                          color: field.locked ? '#999' : '#2d5016',
                          background: field.locked ? '#f5f5f5' : 'white',
                          cursor: field.locked ? 'not-allowed' : editMode ? 'text' : 'default',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </div>
                  ))}
                </div>

                {editMode && (
                  <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <button style={{
                      background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.875rem 2rem',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(45, 80, 22, 0.25)',
                      transition: 'all 0.3s ease'
                    }}>
                      Save Changes
                    </button>
                    <button 
                      onClick={() => setEditMode(false)}
                      style={{
                        background: 'transparent',
                        color: '#666',
                        border: '1px solid #ddd',
                        padding: '0.875rem 2rem',
                        borderRadius: '10px',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upgrade Plan */}
          {activeTab === 'upgrade' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <h2 style={{ 
                margin: '0 0 0.5rem 0', 
                fontSize: '2rem', 
                fontWeight: '700', 
                color: '#2d5016',
                letterSpacing: '-0.02em'
              }}>Upgrade Your Plan</h2>
              <p style={{ margin: '0 0 2rem 0', color: '#666', fontSize: '1rem' }}>Take your wellness journey to the next level</p>

              <div style={{
                background: 'linear-gradient(135deg, #f0f7ec 0%, #fef9f3 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                border: '1px solid rgba(45, 80, 22, 0.1)'
              }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#666', fontWeight: '500' }}>Current Plan</p>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#2d5016' }}>{userData.currentPlan}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {upgradePlans.map((plan) => (
                  <div key={plan.name} style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '2rem',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                    border: '2px solid rgba(212, 175, 55, 0.2)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                      color: '#2d5016',
                      padding: '0.5rem 1rem',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      borderBottomLeftRadius: '12px'
                    }}>{plan.savings}</div>

                    <h3 style={{ 
                      margin: '0 0 1rem 0', 
                      fontSize: '1.4rem', 
                      fontWeight: '700', 
                      color: '#2d5016' 
                    }}>{plan.name}</h3>
                    
                    <div style={{ 
                      fontSize: '2.5rem', 
                      fontWeight: '800', 
                      color: '#3d6b1f', 
                      marginBottom: '1.5rem',
                      letterSpacing: '-0.02em'
                    }}>{plan.price}</div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      {plan.features.map((feature, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.75rem'
                        }}>
                          <CheckCircle size={18} color="#3d6b1f" />
                          <span style={{ fontSize: '0.9rem', color: '#666' }}>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '1rem',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(45, 80, 22, 0.25)',
                      transition: 'all 0.3s ease'
                    }}>
                      Upgrade Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Purchase History */}
          {activeTab === 'history' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <h2 style={{ 
                margin: '0 0 0.5rem 0', 
                fontSize: '2rem', 
                fontWeight: '700', 
                color: '#2d5016',
                letterSpacing: '-0.02em'
              }}>Purchase History</h2>
              <p style={{ margin: '0 0 2rem 0', color: '#666', fontSize: '1rem' }}>View all your transactions and download receipts</p>

              <div style={{ 
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                border: '1px solid rgba(45, 80, 22, 0.08)'
              }}>
                {transactions.map((txn, idx) => (
                  <div key={txn.id} style={{
                    padding: '1.5rem 2rem',
                    borderBottom: idx < transactions.length - 1 ? '1px solid rgba(45, 80, 22, 0.08)' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'background 0.2s ease'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#2d5016' }}>
                          {txn.plan}
                        </h4>
                        <span style={{
                          background: txn.status === 'Successful' ? '#e8f5e9' : '#ffebee',
                          color: txn.status === 'Successful' ? '#2e7d32' : '#c62828',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}>
                          {txn.status}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#666' }}>
                        <span>Transaction ID: {txn.id}</span>
                        <span>Date: {txn.date}</span>
                        <span>Method: {txn.method}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                      <div style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: '700', 
                        color: '#3d6b1f' 
                      }}>{txn.amount}</div>
                      <button style={{
                        background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                        color: '#2d5016',
                        border: 'none',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
                        transition: 'all 0.3s ease'
                      }}>
                        <Receipt size={16} />
                        Download Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Support & Tickets */}
          {activeTab === 'support' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <h2 style={{ 
                margin: '0 0 0.5rem 0', 
                fontSize: '2rem', 
                fontWeight: '700', 
                color: '#2d5016',
                letterSpacing: '-0.02em'
              }}>Support & Tickets</h2>
              <p style={{ margin: '0 0 2rem 0', color: '#666', fontSize: '1rem' }}>Get help and track your queries</p>

              {/* Contact Info */}
              <div style={{
                background: 'linear-gradient(135deg, #f0f7ec 0%, #fef9f3 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                border: '1px solid rgba(45, 80, 22, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#666', fontWeight: '500' }}>Need immediate help?</p>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: '600', color: '#2d5016' }}>customersupport@ryviveroots.com</p>
                  <p style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#2d5016' }}>+91 97656 00701</p>
                </div>
              </div>

              {/* New Complaint/Feedback */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                marginBottom: '2rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                border: '1px solid rgba(45, 80, 22, 0.08)'
              }}>
                <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.3rem', fontWeight: '600', color: '#2d5016' }}>
                  Raise a Complaint or Share Feedback
                </h3>
                
                <select style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(45, 80, 22, 0.15)',
                  fontSize: '0.95rem',
                  marginBottom: '1rem',
                  fontWeight: '500',
                  color: '#2d5016',
                  cursor: 'pointer'
                }}>
                  <option>Select Type</option>
                  <option>Complaint</option>
                  <option>Feedback</option>
                </select>

                <textarea 
                  placeholder="Describe your concern or feedback in detail..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(45, 80, 22, 0.15)',
                    fontSize: '0.95rem',
                    fontFamily: "'Outfit', sans-serif",
                    resize: 'vertical',
                    marginBottom: '1rem'
                  }}
                />

                <button style={{
                  background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(45, 80, 22, 0.25)',
                  transition: 'all 0.3s ease'
                }}>
                  Submit
                </button>
              </div>

              {/* Ticket History */}
              <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.3rem', fontWeight: '600', color: '#2d5016' }}>
                  Your Tickets
                </h3>
                <div style={{ 
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                  border: '1px solid rgba(45, 80, 22, 0.08)'
                }}>
                  {tickets.map((ticket, idx) => (
                    <div key={ticket.id} style={{
                      padding: '1.5rem 2rem',
                      borderBottom: idx < tickets.length - 1 ? '1px solid rgba(45, 80, 22, 0.08)' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#2d5016' }}>
                            {ticket.subject}
                          </h4>
                          <span style={{
                            background: ticket.status === 'Resolved' ? '#e8f5e9' : 
                                       ticket.status === 'In Progress' ? '#fff4e5' : '#f5f5f5',
                            color: ticket.status === 'Resolved' ? '#2e7d32' : 
                                   ticket.status === 'In Progress' ? '#d4af37' : '#666',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            {ticket.status === 'Resolved' && <CheckCircle size={14} />}
                            {ticket.status === 'In Progress' && <Clock size={14} />}
                            {ticket.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>
                          Ticket ID: {ticket.id} • Raised on {ticket.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        button:hover {
          transform: translateY(-2px);
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }
      `}</style>
    </div>
  );
}
