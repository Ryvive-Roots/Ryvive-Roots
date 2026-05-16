import React, { useState } from 'react';
import { Users, MessageSquare, Plus, Lock, Eye, Edit, Clock, Activity, Mail, Search, X, Send, FileText } from 'lucide-react';

export default function RyviveAdminDashboard1() {
  const [activeView, setActiveView] = useState('customers');
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [showIndividualMessage, setShowIndividualMessage] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [passkeyAction, setPasskeyAction] = useState(null);
  const [passkey, setPasskey] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showQueryDetail, setShowQueryDetail] = useState(false);
  const [queryResponse, setQueryResponse] = useState('');

  // Mock data
  const customers = [
    { id: 'RR001', name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 98765 43210', plan: '3-Month Transformation', status: 'Active' },
    { id: 'RR002', name: 'Amit Patel', email: 'amit@email.com', phone: '+91 98765 43211', plan: '1-Month Wellness', status: 'Active' },
    { id: 'RR003', name: 'Sneha Desai', email: 'sneha@email.com', phone: '+91 98765 43212', plan: '3-Month Transformation', status: 'Paused' },
    { id: 'RR004', name: 'Rahul Kumar', email: 'rahul@email.com', phone: '+91 98765 43213', plan: '1-Month Wellness', status: 'Active' },
    { id: 'RR005', name: 'Anjali Singh', email: 'anjali@email.com', phone: '+91 98765 43214', plan: '3-Month Transformation', status: 'Active' }
  ];

  // Customer queries/tickets
  const customerQueries = [
    { 
      id: 'Q001', 
      customer: 'Priya Sharma', 
      customerId: 'RR001',
      type: 'Complaint', 
      subject: 'Late Delivery', 
      message: 'My meal was delivered 2 hours late today. This is affecting my schedule.',
      date: '2024-05-15', 
      time: '10:30 AM',
      status: 'Open',
      priority: 'High',
      assignedTo: null,
      response: null
    },
    { 
      id: 'Q002', 
      customer: 'Amit Patel', 
      customerId: 'RR002',
      type: 'Feedback', 
      subject: 'Menu Suggestions', 
      message: 'Would love to see more South Indian options in the menu. The current variety is great but adding dosa or idli would be amazing.',
      date: '2024-05-14', 
      time: '03:45 PM',
      status: 'In Progress',
      priority: 'Low',
      assignedTo: 'Sakshi Ughade',
      response: 'Thank you for the suggestion. We are working on expanding our menu.'
    },
    { 
      id: 'Q003', 
      customer: 'Sneha Desai', 
      customerId: 'RR003',
      type: 'Complaint', 
      subject: 'Wrong Order Delivered', 
      message: 'I received a sandwich instead of the salad I ordered. Please help resolve this.',
      date: '2024-05-14', 
      time: '11:20 AM',
      status: 'Resolved',
      priority: 'High',
      assignedTo: 'Sakshi Ughade',
      response: 'We sincerely apologize for the mix-up. A replacement salad has been sent to you. We have also credited one free meal to your account as a gesture of goodwill.'
    },
    { 
      id: 'Q004', 
      customer: 'Rahul Kumar', 
      customerId: 'RR004',
      type: 'Query', 
      subject: 'Pause Subscription', 
      message: 'How do I pause my subscription for a week? I will be traveling.',
      date: '2024-05-13', 
      time: '09:15 AM',
      status: 'Resolved',
      priority: 'Medium',
      assignedTo: 'Sakshi Ughade',
      response: 'You can pause your subscription directly from your dashboard under "My Subscription" section. We have also paused it for you from May 20-27 as requested.'
    }
  ];

  const auditLogs = [
    { id: 1, employee: 'Sakshi Ughade', customer: 'Priya Sharma', action: 'View Profile', date: '2024-05-02', time: '10:30 AM' },
    { id: 2, employee: 'Sakshi Ughade', customer: 'Amit Patel', action: 'Edit Details', date: '2024-05-02', time: '09:15 AM', changes: 'Phone: +91 98765 00000 → +91 98765 43211' },
    { id: 3, employee: 'Sakshi Ughade', customer: 'Sneha Desai', action: 'View Profile', date: '2024-05-01', time: '04:45 PM' },
    { id: 4, employee: 'Sakshi Ughade', customer: 'Rahul Kumar', action: 'Edit Details', date: '2024-05-01', time: '02:20 PM', changes: 'Address Updated' }
  ];

  const handlePasskeySubmit = () => {
    if (passkey === '1234') { // Mock validation
      if (passkeyAction === 'view') {
        setShowCustomerDetail(true);
      } else if (passkeyAction === 'message') {
        setShowIndividualMessage(true);
      }
      setShowPasskeyModal(false);
      setPasskey('');
    } else {
      alert('Invalid passkey');
    }
  };

  const requestPasskey = (customer, action) => {
    setSelectedCustomer(customer);
    setPasskeyAction(action);
    setShowPasskeyModal(true);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fdf5 0%, #fef9f3 100%)',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)',
        padding: '1.5rem 2rem',
        boxShadow: '0 4px 20px rgba(45, 80, 22, 0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '45px',
              height: '45px',
              background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '1.3rem',
              color: '#2d5016'
            }}>R</div>
            <div>
              <h1 style={{ margin: 0, color: 'white', fontSize: '1.4rem', fontWeight: '700' }}>
                Ryvive Roots Admin
              </h1>
              <p style={{ margin: 0, color: '#d4af37', fontSize: '0.85rem', fontWeight: '500' }}>
                Operations Dashboard
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setShowBroadcastModal(true)}
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
              <MessageSquare size={18} />
              Broadcast Message
            </button>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              padding: '0.5rem 1rem', 
              borderRadius: '8px',
              color: 'white',
              fontSize: '0.9rem'
            }}>
              Sakshi Ughade
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <aside style={{
          width: '260px',
          background: 'white',
          minHeight: 'calc(100vh - 90px)',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.05)',
          padding: '2rem 0'
        }}>
          <nav>
            {[
              { id: 'customers', icon: Users, label: 'Customers' },
              { id: 'queries', icon: MessageSquare, label: 'Customer Queries' },
              { id: 'create', icon: Plus, label: 'Create Account' },
              { id: 'audit', icon: Activity, label: 'Audit Logs' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                style={{
                  width: '100%',
                  padding: '1rem 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  background: activeView === item.id ? 'linear-gradient(90deg, rgba(45, 80, 22, 0.1) 0%, transparent 100%)' : 'transparent',
                  border: 'none',
                  borderLeft: activeView === item.id ? '4px solid #d4af37' : '4px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: activeView === item.id ? '#2d5016' : '#666',
                  fontSize: '0.95rem',
                  fontWeight: activeView === item.id ? '600' : '500',
                  textAlign: 'left'
                }}
              >
                <item.icon size={20} strokeWidth={activeView === item.id ? 2.5 : 2} />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '2rem' }}>
          {/* Customers List */}
          {activeView === 'customers' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: '700', color: '#2d5016' }}>
                  Customer Management
                </h2>
                <p style={{ margin: 0, color: '#666', fontSize: '1rem' }}>
                  {customers.length} active customers
                </p>
              </div>

              {/* Search Bar */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'white',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '12px',
                  border: '2px solid rgba(45, 80, 22, 0.1)',
                  maxWidth: '500px'
                }}>
                  <Search size={20} color="#666" />
                  <input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.95rem',
                      flex: 1,
                      background: 'transparent'
                    }}
                  />
                </div>
              </div>

              {/* Customer List */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                border: '1px solid rgba(45, 80, 22, 0.08)'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(135deg, #f0f7ec 0%, #fef9f3 100%)' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '700', color: '#2d5016' }}>
                        Membership ID
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '700', color: '#2d5016' }}>
                        Full Name
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '700', color: '#2d5016' }}>
                        Status
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: '700', color: '#2d5016' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer, idx) => (
                      <tr key={customer.id} style={{
                        borderBottom: idx < filteredCustomers.length - 1 ? '1px solid rgba(45, 80, 22, 0.08)' : 'none'
                      }}>
                        <td style={{ padding: '1.25rem 1rem', fontSize: '0.9rem', fontWeight: '600', color: '#2d5016' }}>
                          {customer.id}
                        </td>
                        <td style={{ padding: '1.25rem 1rem', fontSize: '0.95rem', color: '#333' }}>
                          {customer.name}
                        </td>
                        <td style={{ padding: '1.25rem 1rem' }}>
                          <span style={{
                            background: customer.status === 'Active' ? '#e8f5e9' : '#fff4e5',
                            color: customer.status === 'Active' ? '#2e7d32' : '#d4af37',
                            padding: '0.4rem 0.85rem',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                          }}>
                            {customer.status}
                          </span>
                        </td>
                        <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button
                              onClick={() => requestPasskey(customer, 'view')}
                              style={{
                                background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              <Eye size={16} />
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Customer Queries */}
          {activeView === 'queries' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: '700', color: '#2d5016' }}>
                    Customer Queries & Support Tickets
                  </h2>
                  <p style={{ margin: 0, color: '#666', fontSize: '1rem' }}>
                    {customerQueries.filter(q => q.status === 'Open').length} open queries • {customerQueries.length} total
                  </p>
                </div>
                
                {/* Filter buttons */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {['All', 'Open', 'In Progress', 'Resolved'].map(filter => (
                    <button
                      key={filter}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(45, 80, 22, 0.15)',
                        background: 'white',
                        color: '#666',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Queries List */}
              <div style={{ display: 'grid', gap: '1rem' }}>
                {customerQueries.map((query) => (
                  <div
                    key={query.id}
                    style={{
                      background: 'white',
                      borderRadius: '16px',
                      padding: '1.75rem',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                      border: '1px solid rgba(45, 80, 22, 0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => {
                      setSelectedQuery(query);
                      setShowQueryDetail(true);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(45, 80, 22, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                          <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '600', color: '#2d5016' }}>
                            {query.subject}
                          </h4>
                          <span style={{
                            background: query.type === 'Complaint' ? '#ffebee' : query.type === 'Feedback' ? '#e8f5e9' : '#e3f2fd',
                            color: query.type === 'Complaint' ? '#c62828' : query.type === 'Feedback' ? '#2e7d32' : '#1976d2',
                            padding: '0.3rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {query.type}
                          </span>
                          <span style={{
                            background: query.status === 'Open' ? '#fff4e5' : 
                                       query.status === 'In Progress' ? '#e3f2fd' : '#e8f5e9',
                            color: query.status === 'Open' ? '#d4af37' : 
                                   query.status === 'In Progress' ? '#1976d2' : '#2e7d32',
                            padding: '0.3rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {query.status}
                          </span>
                          {query.priority === 'High' && (
                            <span style={{
                              background: '#ffebee',
                              color: '#c62828',
                              padding: '0.3rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '600'
                            }}>
                              High Priority
                            </span>
                          )}
                        </div>

                        <div style={{ marginBottom: '0.75rem' }}>
                          <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>
                            Customer: <strong style={{ color: '#2d5016' }}>{query.customer}</strong> ({query.customerId})
                          </p>
                        </div>

                        <p style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', color: '#666', lineHeight: '1.6' }}>
                          {query.message}
                        </p>

                        {query.assignedTo && (
                          <div style={{
                            background: 'linear-gradient(135deg, #f0f7ec 0%, #fef9f3 100%)',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(45, 80, 22, 0.1)',
                            marginBottom: '0.75rem'
                          }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#3d6b1f', fontWeight: '500' }}>
                              Assigned to: {query.assignedTo}
                            </p>
                          </div>
                        )}

                        {query.response && (
                          <div style={{
                            background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%)',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(46, 125, 50, 0.2)'
                          }}>
                            <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#2e7d32', fontWeight: '700', textTransform: 'uppercase' }}>
                              Response:
                            </p>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#2e7d32', lineHeight: '1.5' }}>
                              {query.response}
                            </p>
                          </div>
                        )}
                      </div>

                      <div style={{ textAlign: 'right', minWidth: '150px', marginLeft: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', marginBottom: '0.25rem' }}>
                          <Clock size={14} color="#666" />
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#666', fontWeight: '500' }}>
                            {query.date}
                          </p>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#999' }}>
                          {query.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Create Customer */}
          {activeView === 'create' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <h2 style={{ margin: '0 0 2rem 0', fontSize: '1.8rem', fontWeight: '700', color: '#2d5016' }}>
                Create New Customer Account
              </h2>

              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2.5rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                maxWidth: '800px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                  {[
                    { label: 'Full Name', type: 'text', required: true },
                    { label: 'Contact Number', type: 'tel', required: true },
                    { label: 'Email ID', type: 'email', required: true },
                    { label: 'Date of Birth', type: 'date', required: true },
                    { label: 'Payment Mode', type: 'select', options: ['Cash', 'Online'], required: true },
                    { label: 'Time Slot', type: 'select', options: ['Morning (7-9 AM)', 'Evening (6-7 PM)'], required: true },
                    { label: 'Discounted Price', type: 'number', required: false }
                  ].map((field, idx) => (
                    <div key={idx} style={{ gridColumn: field.label === 'Address' ? 'span 2' : 'span 1' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: '#2d5016',
                        marginBottom: '0.5rem'
                      }}>
                        {field.label} {field.required && <span style={{ color: '#d32f2f' }}>*</span>}
                      </label>
                      {field.type === 'select' ? (
                        <select style={{
                          width: '100%',
                          padding: '0.875rem',
                          borderRadius: '10px',
                          border: '1px solid rgba(45, 80, 22, 0.15)',
                          fontSize: '0.95rem',
                          fontWeight: '500'
                        }}>
                          <option>Select {field.label}</option>
                          {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          style={{
                            width: '100%',
                            padding: '0.875rem',
                            borderRadius: '10px',
                            border: '1px solid rgba(45, 80, 22, 0.15)',
                            fontSize: '0.95rem',
                            fontWeight: '500'
                          }}
                        />
                      )}
                    </div>
                  ))}
                  
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: '#2d5016',
                      marginBottom: '0.5rem'
                    }}>
                      Address <span style={{ color: '#d32f2f' }}>*</span>
                    </label>
                    <textarea
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.875rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(45, 80, 22, 0.15)',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        fontFamily: "'Inter', sans-serif",
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                  <button style={{
                    background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2.5rem',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(45, 80, 22, 0.25)',
                    transition: 'all 0.3s ease'
                  }}>
                    Create Account
                  </button>
                  <button style={{
                    background: 'transparent',
                    color: '#666',
                    border: '1px solid #ddd',
                    padding: '1rem 2.5rem',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Audit Logs */}
          {activeView === 'audit' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <h2 style={{ margin: '0 0 2rem 0', fontSize: '1.8rem', fontWeight: '700', color: '#2d5016' }}>
                Audit Logs & Activity Tracking
              </h2>

              <div style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                border: '1px solid rgba(45, 80, 22, 0.08)'
              }}>
                {auditLogs.map((log, idx) => (
                  <div key={log.id} style={{
                    padding: '1.5rem 2rem',
                    borderBottom: idx < auditLogs.length - 1 ? '1px solid rgba(45, 80, 22, 0.08)' : 'none'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                          <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '600', color: '#2d5016' }}>
                            {log.employee}
                          </h4>
                          <span style={{
                            background: log.action.includes('Edit') ? '#fff4e5' : '#e8f5e9',
                            color: log.action.includes('Edit') ? '#d4af37' : '#2e7d32',
                            padding: '0.3rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {log.action}
                          </span>
                        </div>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
                          Customer: <strong>{log.customer}</strong>
                        </p>
                        {log.changes && (
                          <div style={{
                            background: 'linear-gradient(135deg, #f0f7ec 0%, #fef9f3 100%)',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            marginTop: '0.5rem',
                            border: '1px solid rgba(45, 80, 22, 0.1)'
                          }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#3d6b1f', fontWeight: '500' }}>
                              Changes: {log.changes}
                            </p>
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign: 'right', minWidth: '150px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', marginBottom: '0.25rem' }}>
                          <Clock size={14} color="#666" />
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#666', fontWeight: '500' }}>
                            {log.date}
                          </p>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#999' }}>
                          {log.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Passkey Modal */}
      {showPasskeyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '450px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'slideUp 0.3s ease'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #fff4e5 0%, #ffe8cc 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <Lock size={28} color="#d4af37" />
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: '700', color: '#2d5016' }}>
                Passkey Required
              </h3>
              <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
                Enter your passkey to {passkeyAction === 'view' ? 'view customer details' : 'send message'}
              </p>
            </div>

            <input
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              placeholder="Enter passkey"
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '10px',
                border: '2px solid rgba(45, 80, 22, 0.15)',
                fontSize: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'center',
                letterSpacing: '0.3em',
                fontWeight: '700'
              }}
              onKeyPress={(e) => e.key === 'Enter' && handlePasskeySubmit()}
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handlePasskeySubmit}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(45, 80, 22, 0.25)'
                }}
              >
                Verify
              </button>
              <button
                onClick={() => {
                  setShowPasskeyModal(false);
                  setPasskey('');
                }}
                style={{
                  flex: 1,
                  background: 'transparent',
                  color: '#666',
                  border: '1px solid #ddd',
                  padding: '1rem',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: '700', color: '#2d5016' }}>
                  Broadcast Message
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                  Send notification to all {customers.length} customers
                </p>
              </div>
              <button
                onClick={() => setShowBroadcastModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                <X size={24} color="#666" />
              </button>
            </div>

            <textarea
              placeholder="Type your message here..."
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '1rem',
                borderRadius: '10px',
                border: '2px solid rgba(45, 80, 22, 0.15)',
                fontSize: '0.95rem',
                fontFamily: "'Inter', sans-serif",
                resize: 'vertical',
                marginBottom: '1.5rem'
              }}
            />

            <button style={{
              width: '100%',
              background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
              color: '#2d5016',
              border: 'none',
              padding: '1rem',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
            }}>
              <Send size={20} />
              Send to All Customers
            </button>
          </div>
        </div>
      )}

      {/* Query Detail Modal */}
      {showQueryDetail && selectedQuery && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem',
          overflowY: 'auto'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2.5rem',
            maxWidth: '800px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '700', color: '#2d5016' }}>
                    {selectedQuery.subject}
                  </h3>
                  <span style={{
                    background: selectedQuery.type === 'Complaint' ? '#ffebee' : selectedQuery.type === 'Feedback' ? '#e8f5e9' : '#e3f2fd',
                    color: selectedQuery.type === 'Complaint' ? '#c62828' : selectedQuery.type === 'Feedback' ? '#2e7d32' : '#1976d2',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    {selectedQuery.type}
                  </span>
                </div>
                <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.95rem' }}>
                  Query ID: {selectedQuery.id}
                </p>
                <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
                  Submitted: {selectedQuery.date} at {selectedQuery.time}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowQueryDetail(false);
                  setQueryResponse('');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                <X size={24} color="#666" />
              </button>
            </div>

            {/* Customer Info */}
            <div style={{
              background: 'linear-gradient(135deg, #f0f7ec 0%, #fef9f3 100%)',
              padding: '1.5rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              border: '1px solid rgba(45, 80, 22, 0.1)'
            }}>
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: '600', color: '#2d5016' }}>
                Customer Details
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                  <strong>Name:</strong> {selectedQuery.customer}
                </p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                  <strong>ID:</strong> {selectedQuery.customerId}
                </p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                  <strong>Status:</strong> <span style={{
                    background: selectedQuery.status === 'Open' ? '#fff4e5' : 
                               selectedQuery.status === 'In Progress' ? '#e3f2fd' : '#e8f5e9',
                    color: selectedQuery.status === 'Open' ? '#d4af37' : 
                           selectedQuery.status === 'In Progress' ? '#1976d2' : '#2e7d32',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {selectedQuery.status}
                  </span>
                </p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                  <strong>Priority:</strong> {selectedQuery.priority}
                </p>
              </div>
            </div>

            {/* Query Message */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: '600', color: '#2d5016' }}>
                Customer Message
              </h4>
              <div style={{
                background: '#f8f9fa',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)'
              }}>
                <p style={{ margin: 0, fontSize: '1rem', color: '#333', lineHeight: '1.7' }}>
                  {selectedQuery.message}
                </p>
              </div>
            </div>

            {/* Existing Response (if any) */}
            {selectedQuery.response && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: '600', color: '#2d5016' }}>
                  Current Response
                </h4>
                <div style={{
                  background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%)',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(46, 125, 50, 0.2)'
                }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#2e7d32', fontWeight: '600' }}>
                    Responded by: {selectedQuery.assignedTo}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: '#2e7d32', lineHeight: '1.6' }}>
                    {selectedQuery.response}
                  </p>
                </div>
              </div>
            )}

            {/* Response Form */}
            {selectedQuery.status !== 'Resolved' && (
              <div>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: '600', color: '#2d5016' }}>
                  {selectedQuery.response ? 'Update Response' : 'Your Response'}
                </h4>
                <textarea
                  value={queryResponse}
                  onChange={(e) => setQueryResponse(e.target.value)}
                  placeholder="Type your response to the customer..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '2px solid rgba(45, 80, 22, 0.15)',
                    fontSize: '0.95rem',
                    fontFamily: "'Inter', sans-serif",
                    resize: 'vertical',
                    marginBottom: '1.5rem'
                  }}
                />

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button style={{
                    background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(45, 80, 22, 0.25)'
                  }}>
                    <Send size={18} />
                    Send Response
                  </button>
                  
                  {selectedQuery.status === 'Open' && (
                    <button style={{
                      background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '1rem 2rem',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)'
                    }}>
                      Mark In Progress
                    </button>
                  )}
                  
                  {selectedQuery.status === 'In Progress' && (
                    <button style={{
                      background: 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '1rem 2rem',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(46, 125, 50, 0.25)'
                    }}>
                      Mark as Resolved
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setShowQueryDetail(false);
                      setQueryResponse('');
                    }}
                    style={{
                      background: 'transparent',
                      color: '#666',
                      border: '1px solid #ddd',
                      padding: '1rem 2rem',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {selectedQuery.status === 'Resolved' && (
              <div style={{
                background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid rgba(46, 125, 50, 0.2)',
                textAlign: 'center'
              }}>
                <CheckCircle size={48} color="#2e7d32" style={{ marginBottom: '1rem' }} />
                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#2e7d32' }}>
                  This query has been resolved
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {showCustomerDetail && selectedCustomer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem',
          overflowY: 'auto'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2.5rem',
            maxWidth: '900px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: '700', color: '#2d5016' }}>
                  Customer Profile
                </h3>
                <p style={{ margin: 0, color: '#666' }}>{selectedCustomer.id}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => requestPasskey(selectedCustomer, 'message')}
                  style={{
                    background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                    color: '#2d5016',
                    border: 'none',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <MessageSquare size={16} />
                  Message
                </button>
                <button
                  onClick={() => setShowCustomerDetail(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem'
                  }}
                >
                  <X size={24} color="#666" />
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              {[
                { label: 'Full Name', value: selectedCustomer.name, editable: true, locked: false },
                { label: 'Email', value: selectedCustomer.email, editable: true },
                { label: 'Phone', value: selectedCustomer.phone, editable: true },
                { label: 'Subscription Plan', value: selectedCustomer.plan, editable: false },
                { label: 'Status', value: selectedCustomer.status, editable: false },
                { label: 'Join Date', value: 'March 15, 2024', editable: false }
              ].map((field, idx) => (
                <div key={idx}>
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
                    {field.locked !== undefined && !field.locked && <Edit size={14} color="#d4af37" />}
                  </label>
                  <input
                    type="text"
                    value={field.value}
                    disabled={!field.editable}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      borderRadius: '10px',
                      border: field.editable ? '2px solid #d4af37' : '1px solid rgba(45, 80, 22, 0.15)',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      background: field.editable ? 'white' : '#f5f5f5',
                      cursor: field.editable ? 'text' : 'not-allowed'
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button style={{
                background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(45, 80, 22, 0.25)'
              }}>
                Save Changes
              </button>
              <button
                onClick={() => setShowCustomerDetail(false)}
                style={{
                  background: 'transparent',
                  color: '#666',
                  border: '1px solid #ddd',
                  padding: '1rem 2rem',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
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
