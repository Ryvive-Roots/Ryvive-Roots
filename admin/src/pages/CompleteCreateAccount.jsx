import React, { useState } from 'react';

export default function CompleteCreateAccount() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Form data states
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
    startDate: '',
  });

  const [paymentData, setPaymentData] = useState({
    received: false,
    method: '',
    amount: '',
    transactionId: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

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

  const handleFeatureToggle = (feature) => {
    const updated = customPackage.features.includes(feature)
      ? customPackage.features.filter(f => f !== feature)
      : [...customPackage.features, feature];
    setCustomPackage({...customPackage, features: updated});
  };

  const calculateTotalMeals = (duration, mealsPerWeek) => {
    const weeks = duration === '1-month' ? 4 : 
                  duration === '2-month' ? 8 : 
                  duration === '3-month' ? 12 : 
                  duration === '6-month' ? 24 : 0;
    return weeks * parseInt(mealsPerWeek || 0);
  };

  const handleCreateAccount = () => {
    alert(`✅ Account Created Successfully!

Team Member: ${teamMembers.find(t => t.id === selectedTeamMember)?.name}

Package: ${customPackage.name}
Duration: ${customPackage.duration}
Price: ₹${customPackage.price}

Customer: ${customerData.fullName}
Phone: ${customerData.phone}
Email: ${customerData.email}

Payment: ${paymentData.method} - ₹${paymentData.amount}

Membership ID will be generated automatically.
Welcome email will be sent to customer.`);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fdf5 0%, #fef9f3 100%)',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Progress Steps */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        maxWidth: '1200px',
        margin: '0 auto 2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {[
            { step: 1, label: 'Select Team Member' },
            { step: 2, label: 'Customize Package' },
            { step: 3, label: 'Customer Details' },
            { step: 4, label: 'Payment Verification' }
          ].map((item, idx) => (
            <React.Fragment key={item.step}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '150px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: currentStep >= item.step 
                    ? 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)'
                    : '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.5rem'
                }}>
                  {currentStep > item.step ? '✓' : item.step}
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  fontWeight: currentStep === item.step ? '600' : '500',
                  color: currentStep >= item.step ? '#2d5016' : '#999',
                  textAlign: 'center'
                }}>
                  {item.label}
                </p>
              </div>
              {idx < 3 && (
                <div style={{
                  width: '80px',
                  height: '3px',
                  background: currentStep > item.step ? '#2d5016' : '#e0e0e0',
                  marginBottom: '40px'
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* STEP 1: Team Member Selection */}
        {currentStep === 1 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '3rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: '700', color: '#2d5016' }}>
                👤 Who is creating this account?
              </h2>
              <p style={{ margin: 0, color: '#666', fontSize: '1.1rem' }}>
                Select the team member responsible for this customer onboarding
              </p>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1.5rem', 
              marginBottom: '3rem' 
            }}>
              {teamMembers.map(member => (
                <div
                  key={member.id}
                  onClick={() => setSelectedTeamMember(member.id)}
                  style={{
                    padding: '2rem',
                    borderRadius: '16px',
                    border: selectedTeamMember === member.id ? '3px solid #d4af37' : '2px solid #e0e0e0',
                    background: selectedTeamMember === member.id 
                      ? 'linear-gradient(135deg, #fff4e5 0%, #fef9f3 100%)'
                      : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: selectedTeamMember === member.id
                      ? 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)'
                      : '#f0f7ec',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: selectedTeamMember === member.id ? '#2d5016' : '#666',
                    margin: '0 auto 1rem'
                  }}>
                    {member.name.charAt(0)}
                  </div>
                  <h4 style={{
                    margin: '0 0 0.5rem 0',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#2d5016'
                  }}>
                    {member.name}
                  </h4>
                  <p style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    color: '#999'
                  }}>
                    {member.role}
                  </p>
                  {selectedTeamMember === member.id && (
                    <div style={{
                      marginTop: '1rem',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: '#2e7d32',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      margin: '1rem auto 0'
                    }}>
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ 
              background: '#e3f2fd', 
              padding: '1.5rem', 
              borderRadius: '12px',
              marginBottom: '2rem'
            }}>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#666', lineHeight: '1.6' }}>
                ℹ️ <strong>Note:</strong> This selection will be recorded in audit logs and the team member will be notified.
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button
                onClick={() => selectedTeamMember && setCurrentStep(2)}
                disabled={!selectedTeamMember}
                style={{
                  background: selectedTeamMember ? 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)' : '#ccc',
                  color: 'white',
                  border: 'none',
                  padding: '1.2rem 3rem',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: selectedTeamMember ? 'pointer' : 'not-allowed',
                  boxShadow: selectedTeamMember ? '0 4px 15px rgba(45, 80, 22, 0.3)' : 'none'
                }}
              >
                Next: Customize Package →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Customize Package */}
        {currentStep === 2 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '3rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: '700', color: '#2d5016' }}>
                📦 Create Customize Package
              </h2>
              <p style={{ margin: 0, color: '#666', fontSize: '1.1rem' }}>
                Design a personalized package for this customer
              </p>
            </div>

            {/* Package Form */}
            <div style={{
              background: 'linear-gradient(135deg, #f0f7ec 0%, #fef9f3 100%)',
              padding: '2rem',
              borderRadius: '12px',
              marginBottom: '2rem'
            }}>
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d5016' }}>Package Information</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d5016' }}>
                    Package Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Premium Wellness Package"
                    value={customPackage.name}
                    onChange={(e) => setCustomPackage({...customPackage, name: e.target.value})}
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

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d5016' }}>
                    Duration <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    value={customPackage.duration}
                    onChange={(e) => {
                      const totalMeals = calculateTotalMeals(e.target.value, customPackage.mealsPerWeek);
                      setCustomPackage({
                        ...customPackage, 
                        duration: e.target.value,
                        totalMeals: totalMeals.toString()
                      });
                    }}
                    style={{
                      width: '100%',
                      padding: '0.9rem',
                      borderRadius: '8px',
                      border: '2px solid #ddd',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select duration</option>
                    <option value="1-month">1 Month</option>
                    <option value="2-month">2 Months</option>
                    <option value="3-month">3 Months</option>
                    <option value="6-month">6 Months</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d5016' }}>
                    Meals Per Week <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    value={customPackage.mealsPerWeek}
                    onChange={(e) => {
                      const totalMeals = calculateTotalMeals(customPackage.duration, e.target.value);
                      setCustomPackage({
                        ...customPackage, 
                        mealsPerWeek: e.target.value,
                        totalMeals: totalMeals.toString()
                      });
                    }}
                    style={{
                      width: '100%',
                      padding: '0.9rem',
                      borderRadius: '8px',
                      border: '2px solid #ddd',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select meals/week</option>
                    <option value="3">3 meals/week</option>
                    <option value="4">4 meals/week</option>
                    <option value="5">5 meals/week</option>
                    <option value="6">6 meals/week</option>
                    <option value="7">7 meals/week</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d5016' }}>
                    Total Meals
                  </label>
                  <input
                    type="text"
                    value={customPackage.totalMeals || '0'}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '0.9rem',
                      borderRadius: '8px',
                      border: '2px solid #ddd',
                      fontSize: '1rem',
                      background: '#f5f5f5',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d5016' }}>
                    Package Price <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    value={customPackage.price}
                    onChange={(e) => setCustomPackage({...customPackage, price: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.9rem 0.9rem 0.9rem 2.5rem',
                      borderRadius: '8px',
                      border: '2px solid #ddd',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{
                    position: 'relative',
                    left: '1rem',
                    top: '-2.5rem',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#2e7d32'
                  }}>₹</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#2d5016' }}>Select Features</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleFeatureToggle(feature)}
                    style={{
                      padding: '1rem',
                      borderRadius: '8px',
                      border: customPackage.features.includes(feature) ? '2px solid #2e7d32' : '2px solid #ddd',
                      background: customPackage.features.includes(feature) ? '#e8f5e9' : 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{feature}</span>
                    {customPackage.features.includes(feature) && (
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#2e7d32',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}>✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            {customPackage.name && customPackage.price && (
              <div style={{
                background: 'linear-gradient(135deg, #fff4e5 0%, #fef9f3 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '2px solid #d4af37',
                marginBottom: '2rem'
              }}>
                <h4 style={{ margin: '0 0 1rem 0' }}>📋 Package Summary</h4>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Package:</span>
                    <strong>{customPackage.name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Duration:</span>
                    <strong>{customPackage.duration}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Meals/week:</span>
                    <strong>{customPackage.mealsPerWeek}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total meals:</span>
                    <strong>{customPackage.totalMeals}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Features:</span>
                    <strong>{customPackage.features.length} selected</strong>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid #d4af37',
                    marginTop: '0.5rem'
                  }}>
                    <span style={{ fontWeight: 'bold' }}>Price:</span>
                    <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2e7d32' }}>
                      ₹{customPackage.price}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => setCurrentStep(1)}
                style={{
                  background: 'transparent',
                  color: '#666',
                  border: '2px solid #ddd',
                  padding: '1.2rem 2.5rem',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!customPackage.name || !customPackage.price || !customPackage.duration}
                style={{
                  background: (customPackage.name && customPackage.price && customPackage.duration)
                    ? 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)'
                    : '#ccc',
                  color: 'white',
                  border: 'none',
                  padding: '1.2rem 3rem',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: (customPackage.name && customPackage.price && customPackage.duration) ? 'pointer' : 'not-allowed'
                }}
              >
                Next: Customer Details →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Customer Details */}
        {currentStep === 3 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '3rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: '700', color: '#2d5016' }}>
                👤 Customer Information
              </h2>
              <p style={{ margin: 0, color: '#666', fontSize: '1.1rem' }}>
                Fill in customer details for account creation
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d5016' }}>
                  Full Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  value={customerData.fullName}
                  onChange={(e) => setCustomerData({...customerData, fullName: e.target.value})}
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

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d5016' }}>
                  Phone Number <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="tel"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
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

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d5016' }}>
                  Email <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
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

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d5016' }}>
                  Date of Birth <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="date"
                  value={customerData.dob}
                  onChange={(e) => setCustomerData({...customerData, dob: e.target.value})}
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

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d5016' }}>
                  Delivery Time Slot <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  value={customerData.timeSlot}
                  onChange={(e) => setCustomerData({...customerData, timeSlot: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    borderRadius: '8px',
                    border: '2px solid #ddd',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select time slot</option>
                  <option value="morning">Morning (7-9 AM)</option>
                  <option value="evening">Evening (6-7 PM)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d5016' }}>
                  Start Date <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="date"
                  value={customerData.startDate}
                  onChange={(e) => setCustomerData({...customerData, startDate: e.target.value})}
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

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d5016' }}>
                  Address <span style={{ color: 'red' }}>*</span>
                </label>
                <textarea
                  value={customerData.address}
                  onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    borderRadius: '8px',
                    border: '2px solid #ddd',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => setCurrentStep(2)}
                style={{
                  background: 'transparent',
                  color: '#666',
                  border: '2px solid #ddd',
                  padding: '1.2rem 2.5rem',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                disabled={!customerData.fullName || !customerData.phone || !customerData.email}
                style={{
                  background: (customerData.fullName && customerData.phone && customerData.email)
                    ? 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)'
                    : '#ccc',
                  color: 'white',
                  border: 'none',
                  padding: '1.2rem 3rem',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: (customerData.fullName && customerData.phone && customerData.email) ? 'pointer' : 'not-allowed'
                }}
              >
                Next: Payment Verification →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Payment Verification */}
        {currentStep === 4 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '3rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: '700', color: '#2d5016' }}>
                💰 Payment Verification
              </h2>
              <p style={{ margin: 0, color: '#666', fontSize: '1.1rem' }}>
                Verify payment to activate customer account
              </p>
            </div>

            {/* Customer Summary */}
            <div style={{
              background: '#f0f7ec',
              padding: '1.5rem',
              borderRadius: '12px',
              marginBottom: '2rem'
            }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#2d5016' }}>Customer Summary</h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Name:</span>
                  <strong>{customerData.fullName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Phone:</span>
                  <strong>{customerData.phone}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Package:</span>
                  <strong>{customPackage.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Amount:</span>
                  <strong style={{ fontSize: '1.2rem', color: '#2e7d32' }}>₹{customPackage.price}</strong>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '600', fontSize: '1.1rem', color: '#2d5016' }}>
                Has payment been received? <span style={{ color: 'red' }}>*</span>
              </label>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div
                  onClick={() => setPaymentData({...paymentData, received: true})}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: paymentData.received ? '3px solid #2e7d32' : '2px solid #ddd',
                    background: paymentData.received ? '#e8f5e9' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: paymentData.received ? '#2e7d32' : '#ccc',
                    background: paymentData.received ? '#2e7d32' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {paymentData.received && '✓'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                      ✅ Yes, payment received
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      Account will be created and activated immediately
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentData({...paymentData, received: false})}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: !paymentData.received && paymentData.received !== null ? '3px solid #d4af37' : '2px solid #ddd',
                    background: !paymentData.received && paymentData.received !== null ? '#fff4e5' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: (!paymentData.received && paymentData.received !== null) ? '#d4af37' : '#ccc',
                    background: (!paymentData.received && paymentData.received !== null) ? '#d4af37' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {(!paymentData.received && paymentData.received !== null) && '✓'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                      ⏳ No, waiting for payment
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      Save details as pending for later activation
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details (if received) */}
            {paymentData.received && (
              <div style={{
                background: '#f0f7ec',
                padding: '2rem',
                borderRadius: '12px',
                marginBottom: '2rem'
              }}>
                <h4 style={{ margin: '0 0 1.5rem 0', color: '#2d5016' }}>Payment Details</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
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
                      <option value="cash">Cash</option>
                      <option value="upi">UPI</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="card">Card</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Amount <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="number"
                      value={paymentData.amount}
                      onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                      placeholder={customPackage.price}
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

                  {paymentData.method !== 'cash' && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                        Transaction ID
                      </label>
                      <input
                        type="text"
                        value={paymentData.transactionId}
                        onChange={(e) => setPaymentData({...paymentData, transactionId: e.target.value})}
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
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => setCurrentStep(3)}
                style={{
                  background: 'transparent',
                  color: '#666',
                  border: '2px solid #ddd',
                  padding: '1.2rem 2.5rem',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ← Back
              </button>
              
              {paymentData.received ? (
                <button
                  onClick={handleCreateAccount}
                  disabled={!paymentData.method || !paymentData.amount}
                  style={{
                    background: (paymentData.method && paymentData.amount)
                      ? 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)'
                      : '#ccc',
                    color: 'white',
                    border: 'none',
                    padding: '1.2rem 3rem',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: (paymentData.method && paymentData.amount) ? 'pointer' : 'not-allowed'
                  }}
                >
                  ✓ Confirm Payment & Create Account
                </button>
              ) : (
                <button
                  onClick={() => alert('Customer saved as pending!\n\nDetails saved. You can verify payment later from the pending customers list.')}
                  style={{
                    background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                    color: '#2d5016',
                    border: 'none',
                    padding: '1.2rem 3rem',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  💾 Save as Pending
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
