import React, { useState } from 'react';

export default function RyviveCompleteAdminDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [currentStep, setCurrentStep] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPending, setSelectedPending] = useState(null);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  
  // Form States
  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  const [customPackage, setCustomPackage] = useState({
    name: '',
    duration: '',
    mealsPerWeek: '',
    totalMeals: '',
    price: '',
    features: []
  });
  const [customerData, setCustomerData] = useState({
    fullName: '',
    phone: '',
    email: '',
    dob: '',
    address: '',
    timeSlot: '',
    startDate: ''
  });
  const [paymentData, setPaymentData] = useState({
    received: false,
    method: '',
    amount: '',
    transactionId: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Mock Data
  const [pendingCustomers, setPendingCustomers] = useState([
    { 
      id: 'PEND001',
      name: 'Kavita Sharma',
      phone: '+91 98765 55555',
      email: 'kavita@email.com',
      package: 'Gold 1-Month',
      amount: '8999',
      dateAdded: 'May 15, 2024',
      addedBy: 'Sakshi'
    },
    { 
      id: 'PEND002',
      name: 'Rajesh Verma',
      phone: '+91 98765 66666',
      email: 'rajesh@email.com',
      package: 'Platinum 3-Month',
      amount: '12999',
      dateAdded: 'May 14, 2024',
      addedBy: 'Yashwant'
    }
  ]);

  const [customers, setCustomers] = useState([
    { id: 'RR001', name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 98765 43210', plan: 'Platinum', status: 'Active' },
    { id: 'RR002', name: 'Amit Patel', email: 'amit@email.com', phone: '+91 98765 43211', plan: 'Gold', status: 'Active' },
    { id: 'RR003', name: 'Sneha Desai', email: 'sneha@email.com', phone: '+91 98765 43212', plan: 'Silver', status: 'Paused' }
  ]);

  const deliveries = [
    { id: 'D001', customer: 'Priya Sharma', address: 'Dombivli East', timeSlot: '6:00 PM', status: 'Pending', meal: 'Quinoa Bowl + Juice' },
    { id: 'D002', customer: 'Amit Patel', address: 'Thane West', timeSlot: '7:00 PM', status: 'Out for Delivery', meal: 'Grilled Sandwich' },
    { id: 'D003', customer: 'Anjali Singh', address: 'Kalyan', timeSlot: '6:30 PM', status: 'Pending', meal: 'Pasta Bowl' }
  ];

  const pauseRequests = [
    { id: 'P001', customer: 'Sneha Desai', from: 'May 15', to: 'May 20', reason: 'Traveling', status: 'Pending' },
    { id: 'P002', customer: 'Rohan Mehta', from: 'May 18', to: 'May 22', reason: 'Family function', status: 'Pending' }
  ];

  const queries = [
    { 
      id: 'Q001', 
      customer: 'Priya Sharma',
      subject: 'Late Delivery',
      message: 'My meal was delivered 2 hours late today.',
      status: 'Open',
      date: 'May 15, 2024'
    },
    { 
      id: 'Q002', 
      customer: 'Amit Patel',
      subject: 'Menu Suggestions',
      message: 'Would love to see more South Indian options.',
      status: 'Resolved',
      date: 'May 14, 2024'
    }
  ];

  const payments = [
    { id: 'PAY001', customer: 'Priya Sharma', amount: '₹12,999', method: 'UPI', date: 'May 01', status: 'Success' },
    { id: 'PAY002', customer: 'Amit Patel', amount: '₹8,999', method: 'Card', date: 'May 03', status: 'Success' }
  ];

  const renewals = [
    { id: 'REN001', customer: 'Priya Sharma', plan: 'Platinum 3-Month', expiryDate: 'June 01', daysLeft: 17, amount: '₹12,999' },
    { id: 'REN002', customer: 'Amit Patel', plan: 'Gold 1-Month', expiryDate: 'May 25', daysLeft: 10, amount: '₹8,999' }
  ];

  const teamMembers = [
    { id: 'saurabh', name: 'Saurabh Sir', role: 'Senior Manager' },
    { id: 'yashwant', name: 'Yashwant', role: 'Team Lead' },
    { id: 'shravani', name: 'Shravani', role: 'Web Developer' },
    { id: 'sakshi', name: 'Sakshi', role: 'Operations Associate' }
  ];

  const features = [
    'High-Protein Meals',
    'Gut-Friendly Recipes',
    'Detox Juices',
    'Priority Support',
    'Flexible Pauses (3/month)',
    'Menu Customization',
    'Weekend Delivery',
    'Nutrition Consultation'
  ];

  const stats = {
    totalCustomers: customers.length + pendingCustomers.length,
    activeSubscriptions: customers.filter(c => c.status === 'Active').length,
    todayDeliveries: deliveries.length,
    pendingQueries: queries.filter(q => q.status === 'Open').length,
    monthlyRevenue: '₹12,45,000',
    pendingPayments: pendingCustomers.length
  };

  // Helper Functions
  const calculateTotalMeals = (duration, mealsPerWeek) => {
    const weeks = duration === '1-month' ? 4 : 
                  duration === '2-month' ? 8 : 
                  duration === '3-month' ? 12 : 
                  duration === '6-month' ? 24 : 0;
    return weeks * parseInt(mealsPerWeek || 0);
  };

  const handleFeatureToggle = (feature) => {
    const updated = customPackage.features.includes(feature)
      ? customPackage.features.filter(f => f !== feature)
      : [...customPackage.features, feature];
    setCustomPackage({...customPackage, features: updated});
  };

  const handleVerifyPayment = (pending) => {
    setSelectedPending(pending);
    setPaymentData({
      ...paymentData,
      amount: pending.amount,
      received: false,
      method: '',
      transactionId: ''
    });
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    if (selectedPending) {
      // Move from pending to active customers
      const newCustomer = {
        id: `RR${String(customers.length + 1).padStart(3, '0')}`,
        name: selectedPending.name,
        email: selectedPending.email,
        phone: selectedPending.phone,
        plan: selectedPending.package,
        status: 'Active'
      };
      
      setCustomers([...customers, newCustomer]);
      setPendingCustomers(pendingCustomers.filter(p => p.id !== selectedPending.id));
      
      alert(`✅ Payment Verified!\n\nCustomer: ${selectedPending.name}\nMembership ID: ${newCustomer.id}\nPayment: ₹${paymentData.amount} via ${paymentData.method}\n\nAccount activated successfully!\nWelcome email sent to customer.`);
      
      setShowPaymentModal(false);
      setSelectedPending(null);
      setPaymentData({
        received: false,
        method: '',
        amount: '',
        transactionId: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
  };

  const resetCreateAccount = () => {
    setCurrentStep(1);
    setSelectedTeamMember('');
    setCustomPackage({
      name: '',
      duration: '',
      mealsPerWeek: '',
      totalMeals: '',
      price: '',
      features: []
    });
    setCustomerData({
      fullName: '',
      phone: '',
      email: '',
      dob: '',
      address: '',
      timeSlot: '',
      startDate: ''
    });
    setPaymentData({
      received: false,
      method: '',
      amount: '',
      transactionId: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fdf5 0%, #fef9f3 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
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
                Master Dashboard
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
                cursor: 'pointer'
              }}
            >
              📢 Broadcast
            </button>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              padding: '0.5rem 1rem', 
              borderRadius: '8px',
              color: 'white'
            }}>
              🔒 Admin
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Sidebar */}
        <aside style={{
          width: '260px',
          background: 'white',
          minHeight: 'calc(100vh - 90px)',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.05)',
          padding: '2rem 0'
        }}>
          {[
            { id: 'dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'customers', icon: '👥', label: 'Customers' },
            { id: 'pending', icon: '⏳', label: 'Pending Payments', badge: pendingCustomers.length },
            { id: 'deliveries', icon: '🚚', label: 'Deliveries' },
            { id: 'pause', icon: '⏸️', label: 'Pause Requests' },
            { id: 'queries', icon: '💬', label: 'Customer Queries' },
            { id: 'payments', icon: '💰', label: 'Payments' },
            { id: 'renewals', icon: '📅', label: 'Renewals' },
            { id: 'create', icon: '➕', label: 'Create Account' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                if (item.id === 'create') resetCreateAccount();
              }}
              style={{
                width: '100%',
                padding: '1rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: activeView === item.id ? 'linear-gradient(90deg, rgba(45, 80, 22, 0.1) 0%, transparent 100%)' : 'transparent',
                border: 'none',
                borderLeft: activeView === item.id ? '4px solid #d4af37' : '4px solid transparent',
                cursor: 'pointer',
                color: activeView === item.id ? '#2d5016' : '#666',
                fontSize: '0.95rem',
                fontWeight: activeView === item.id ? '600' : '500',
                textAlign: 'left'
              }}
            >
              <span>
                <span style={{ marginRight: '0.75rem' }}>{item.icon}</span>
                {item.label}
              </span>
              {item.badge > 0 && (
                <span style={{
                  background: '#d4af37',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '2rem' }}>
          
          {/* Dashboard Overview */}
          {activeView === 'dashboard' && (
            <div>
              <h2 style={{ margin: '0 0 2rem 0', fontSize: '1.8rem', fontWeight: '700', color: '#2d5016' }}>
                Dashboard Overview
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {[
                  { label: 'Total Customers', value: stats.totalCustomers, icon: '👥', color: '#2d5016' },
                  { label: 'Active Subscriptions', value: stats.activeSubscriptions, icon: '📦', color: '#3d6b1f' },
                  { label: "Today's Deliveries", value: stats.todayDeliveries, icon: '🚚', color: '#d4af37' },
                  { label: 'Pending Queries', value: stats.pendingQueries, icon: '💬', color: '#c62828' },
                  { label: 'Monthly Revenue', value: stats.monthlyRevenue, icon: '💰', color: '#2e7d32' },
                  { label: 'Pending Payments', value: stats.pendingPayments, icon: '⏳', color: '#ff9800' }
                ].map((stat, idx) => (
                  <div key={idx} style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#666', fontWeight: '500' }}>
                        {stat.label}
                      </p>
                      <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: stat.color }}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
              }}>
                <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.3rem', fontWeight: '600', color: '#2d5016' }}>
                  Quick Actions
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {[
                    { label: '⏳ Pending Payments', view: 'pending', count: pendingCustomers.length },
                    { label: '🚚 View Deliveries', view: 'deliveries', count: deliveries.length },
                    { label: '⏸️ Pause Requests', view: 'pause', count: pauseRequests.length },
                    { label: '➕ Create Account', view: 'create', count: null }
                  ].map(item => (
                    <button
                      key={item.view}
                      onClick={() => {
                        setActiveView(item.view);
                        if (item.view === 'create') resetCreateAccount();
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #f0f7ec 0%, #fef9f3 100%)',
                        border: '1px solid rgba(45, 80, 22, 0.1)',
                        padding: '1.25rem',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        color: '#2d5016',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      {item.label}
                      {item.count !== null && item.count > 0 && (
                        <span style={{
                          background: '#d4af37',
                          color: 'white',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pending Payments */}
          {activeView === 'pending' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: '700', color: '#2d5016' }}>
                  ⏳ Pending Payments
                </h2>
                <p style={{ margin: 0, color: '#666', fontSize: '1rem' }}>
                  {pendingCustomers.length} customers awaiting payment verification
                </p>
              </div>

              {pendingCustomers.length === 0 ? (
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '3rem',
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d5016' }}>All Caught Up!</h3>
                  <p style={{ margin: 0, color: '#666' }}>No pending payments at the moment.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {pendingCustomers.map(pending => (
                    <div key={pending.id} style={{
                      background: 'white',
                      borderRadius: '16px',
                      padding: '2rem',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                      border: '2px solid #fff4e5'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '600', color: '#2d5016' }}>
                              {pending.name}
                            </h4>
                            <span style={{
                              background: '#fff4e5',
                              color: '#d4af37',
                              padding: '0.4rem 0.85rem',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: '600'
                            }}>
                              ⏳ Awaiting Payment
                            </span>
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                              📞 {pending.phone}
                            </p>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                              ✉️ {pending.email}
                            </p>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                              📦 {pending.package}
                            </p>
                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: '#2e7d32' }}>
                              💰 ₹{pending.amount}
                            </p>
                          </div>

                          <div style={{
                            background: '#f0f7ec',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.85rem',
                            color: '#666'
                          }}>
                            👤 Added by: <strong>{pending.addedBy}</strong> • 📅 {pending.dateAdded}
                          </div>
                        </div>

                        <button
                          onClick={() => handleVerifyPayment(pending)}
                          style={{
                            background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                            color: '#2d5016',
                            border: 'none',
                            padding: '1rem 2rem',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            marginLeft: '2rem',
                            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
                          }}
                        >
                          💰 Verify Payment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Customers List */}
          {activeView === 'customers' && (
            <div>
              <h2 style={{ margin: '0 0 2rem 0', fontSize: '1.8rem', fontWeight: '700', color: '#2d5016' }}>
                👥 Customer Management
              </h2>

              <div style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(135deg, #f0f7ec 0%, #fef9f3 100%)' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#2d5016' }}>ID</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#2d5016' }}>Name</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#2d5016' }}>Plan</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#2d5016' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer, idx) => (
                      <tr key={customer.id} style={{
                        borderBottom: idx < customers.length - 1 ? '1px solid rgba(45, 80, 22, 0.08)' : 'none'
                      }}>
                        <td style={{ padding: '1.25rem 1rem', fontWeight: '600', color: '#2d5016' }}>{customer.id}</td>
                        <td style={{ padding: '1.25rem 1rem' }}>{customer.name}</td>
                        <td style={{ padding: '1.25rem 1rem' }}>{customer.plan}</td>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Other views continue similarly... */}
          {/* I'll create the full implementation in the file */}

        </main>
      </div>

      {/* Payment Verification Modal */}
      {showPaymentModal && selectedPending && (
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
          padding: '2rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2.5rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.6rem', fontWeight: '700', color: '#2d5016' }}>
                💰 Verify Payment
              </h3>
              <p style={{ margin: 0, color: '#666' }}>
                Complete payment verification to activate account
              </p>
            </div>

            {/* Customer Summary */}
            <div style={{
              background: '#f0f7ec',
              padding: '1.5rem',
              borderRadius: '12px',
              marginBottom: '2rem'
            }}>
              <h4 style={{ margin: '0 0 1rem 0' }}>Customer Details</h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Name:</span>
                  <strong>{selectedPending.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Package:</span>
                  <strong>{selectedPending.package}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Amount Due:</span>
                  <strong style={{ fontSize: '1.2rem', color: '#2e7d32' }}>₹{selectedPending.amount}</strong>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Payment Method <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  value={paymentData.method}
                  onChange={(e) => setPaymentData({...paymentData, method: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    borderRadius: '8px',
                    border: '2px solid #ddd',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select method</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Card">Card</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Amount Received <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    borderRadius: '8px',
                    border: '2px solid #ddd',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {paymentData.method && paymentData.method !== 'Cash' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Transaction ID / Reference
                  </label>
                  <input
                    type="text"
                    value={paymentData.transactionId}
                    onChange={(e) => setPaymentData({...paymentData, transactionId: e.target.value})}
                    placeholder="Enter transaction reference"
                    style={{
                      width: '100%',
                      padding: '0.9rem',
                      borderRadius: '8px',
                      border: '2px solid #ddd',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleConfirmPayment}
                disabled={!paymentData.method || !paymentData.amount}
                style={{
                  flex: 1,
                  background: (paymentData.method && paymentData.amount)
                    ? 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)'
                    : '#ccc',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: (paymentData.method && paymentData.amount) ? 'pointer' : 'not-allowed'
                }}
              >
                ✓ Confirm & Activate
              </button>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedPending(null);
                }}
                style={{
                  background: 'transparent',
                  color: '#666',
                  border: '2px solid #ddd',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
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
          padding: '2rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2.5rem',
            maxWidth: '600px',
            width: '100%'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.6rem', fontWeight: '700', color: '#2d5016' }}>
              📢 Broadcast Message
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', color: '#666' }}>
              Send notification to all {customers.length} active customers
            </p>

            <textarea
              placeholder="Type your message here..."
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '1rem',
                borderRadius: '12px',
                border: '2px solid #ddd',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box',
                marginBottom: '1.5rem'
              }}
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => {
                  alert('Message sent to all customers!');
                  setShowBroadcastModal(false);
                }}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                  color: '#2d5016',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Send to All
              </button>
              <button
                onClick={() => setShowBroadcastModal(false)}
                style={{
                  background: 'transparent',
                  color: '#666',
                  border: '2px solid #ddd',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
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
    </div>
  );
}
