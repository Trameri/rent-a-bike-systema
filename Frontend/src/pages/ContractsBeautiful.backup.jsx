import React, { useEffect, useState } from 'react'
import { api } from '../services/api.js'
import DocumentCapture from '../Components/DocumentCapture.jsx'
import BarcodeScannerSimple from '../Components/BarcodeScannerSimple.jsx'
import BarcodeScanner from '../Components/BarcodeScanner.jsx'
import BarcodeGenerator from '../Components/BarcodeGenerator.jsx'
import PriceCalculator from '../Components/PriceCalculator.jsx'
import ContractMirror from '../Components/ContractMirror.jsx'
import BikeSwapper from '../Components/BikeSwapper.jsx'
import BikeReturn from '../Components/BikeReturn.jsx'
import ContractClosure from '../Components/ContractClosure.jsx'
import ContractManagement from '../Components/ContractManagement.jsx'
import LocationLogo from '../Components/LocationLogo.jsx'
import { jwtDecode } from 'jwt-decode'

export default function ContractsBeautiful(){
  const [items, setItems] = useState([])
  const [customer, setCustomer] = useState({ name:'', phone:'', idFrontUrl:'', idBackUrl:'' })
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('in-use')
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [insuranceFlat, setIns] = useState(0)
  const [reservationPrepaid, setPrepaid] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  
  // Stati per i nuovi componenti
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [showPriceCalculator, setShowPriceCalculator] = useState(true)
  const [showContractMirror, setShowContractMirror] = useState(true)
  const [selectedContract, setSelectedContract] = useState(null)
  const [showBikeSwapper, setShowBikeSwapper] = useState(false)
  const [showBikeReturn, setShowBikeReturn] = useState(false)
  const [showContractClosure, setShowContractClosure] = useState(false)
  const [showContractManagement, setShowContractManagement] = useState(false)
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16))
  const [endDate, setEndDate] = useState('')
  const [calculatedPrice, setCalculatedPrice] = useState(null)
  
  // Campo per inserimento rapido barcode
  const [quickBarcode, setQuickBarcode] = useState('')
  
  // Stati per la sezione pagamenti
  const [showPaymentSection, setShowPaymentSection] = useState(false)
  const [paymentLink, setPaymentLink] = useState('')
  const [paymentNotes, setPaymentNotes] = useState('')
  const [isReservation, setIsReservation] = useState(false)

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(token) {
      try {
        const decoded = jwtDecode(token)
        setUser(decoded)
      } catch(e) {
        console.error('Errore decodifica token:', e)
      }
    }
  }, [])

  const handleBarcodeScanned = async (barcode) => {
    setLoading(true)
    try {
      // Cerca prima nelle bici
      let response = await api.get(`/api/bikes/barcode/${barcode}`)
      if (response.data && response.data.status === 'available') {
        const bike = response.data
        
        // Controlla se è già presente
        const exists = items.find(i => i.id === bike._id && i.kind === 'bike');
        if (exists) {
          alert('⚠️ Bici già aggiunta al contratto');
          setLoading(false);
          return;
        }
        
        setItems(prev => [...prev, { 
          kind: 'bike', 
          id: bike._id, 
          name: bike.name, 
          barcode: bike.barcode,
          priceHourly: bike.priceHourly,
          priceDaily: bike.priceDaily,
          image: bike.image,
          insurance: false,
          insuranceFlat: 0
        }])
        alert(`✅ Bici aggiunta: ${bike.name}`)
        setLoading(false)
        return
      }
    } catch (error) {
      // Se non trovata nelle bici, cerca negli accessori
      try {
        let response = await api.get(`/api/accessories/barcode/${barcode}`)
        if (response.data && response.data.status === 'available') {
          const accessory = response.data
          
          // Controlla se è già presente
          const exists = items.find(i => i.id === accessory._id && i.kind === 'accessory');
          if (exists) {
            alert('⚠️ Accessorio già aggiunto al contratto');
            setLoading(false);
            return;
          }
          
          setItems(prev => [...prev, { 
            kind: 'accessory', 
            id: accessory._id, 
            name: accessory.name, 
            barcode: accessory.barcode,
            priceHourly: accessory.priceHourly,
            priceDaily: accessory.priceDaily,
            image: accessory.image
          }])
          alert(`✅ Accessorio aggiunto: ${accessory.name}`)
        } else {
          alert('❌ Accessorio non trovato o non disponibile')
        }
      } catch (accessoryError) {
        alert('❌ Codice a barre non trovato')
      }
    }
    setLoading(false)
  }

  // Gestione inserimento rapido barcode
  const handleQuickBarcodeSubmit = (e) => {
    e.preventDefault();
    if (quickBarcode.trim()) {
      handleBarcodeScanned(quickBarcode.trim());
      setQuickBarcode('');
    }
  };

  // Funzione per creare contratto aggiornata
  async function createContract(){
    try {
      // Calcola assicurazione totale dalle singole bici
      const totalInsurance = items.reduce((sum, item) => {
        return sum + (item.insurance ? (item.insuranceFlat || 5) : 0);
      }, 0);
      
      const payload = {
        customer, 
        items: items.map(it => ({ 
          ...it, 
          insurance: it.insurance || false, 
          insuranceFlat: it.insurance ? (it.insuranceFlat || 5) : 0 
        })),
        notes, 
        status: isReservation ? 'reserved' : status, 
        paymentMethod, 
        reservationPrepaid,
        startAt: startDate,
        endAt: endDate || null,
        calculatedPrice: calculatedPrice,
        totalInsurance: totalInsurance,
        // Nuovi campi per i pagamenti
        paymentLink: paymentLink || null,
        paymentNotes: paymentNotes || null,
        isReservation: isReservation
      }
      
      console.log('Creazione contratto:', payload);
      const { data } = await api.post('/api/contracts', payload)
      
      const statusMessage = isReservation ? 'prenotato' : 'creato';
      alert(`✅ Contratto ${statusMessage} con successo!\nID: ${data._id}\nAssicurazione totale: €${totalInsurance}`)
      
      // Reset form
      setItems([]); 
      setCustomer({ name:'', phone:'', idFrontUrl:'', idBackUrl:'' }); 
      setNotes(''); 
      setStatus('in-use'); 
      setPaymentMethod(null); 
      setPrepaid(false);
      setStartDate(new Date().toISOString().slice(0, 16)); 
      setEndDate(''); 
      setCalculatedPrice(null);
      setCurrentStep(1);
      setShowPaymentSection(false);
      setPaymentLink('');
      setPaymentNotes('');
      setIsReservation(false);
      
    } catch (error) {
      console.error('Errore creazione contratto:', error);
      alert('❌ Errore nella creazione del contratto: ' + (error.response?.data?.error || error.message));
    }
  }

  // Funzione per attivare un contratto prenotato
  const activateReservedContract = async (contractId) => {
    try {
      await api.put(`/api/contracts/${contractId}`, { 
        status: 'in-use',
        actualStartAt: new Date().toISOString()
      });
      alert('✅ Contratto attivato con successo!');
      // Ricarica la pagina o aggiorna i dati
      window.location.reload();
    } catch (error) {
      console.error('Errore attivazione contratto:', error);
      alert('❌ Errore nell\'attivazione del contratto: ' + (error.response?.data?.error || error.message));
    }
  }

  // Gestione eventi per i modali
  const handleSwapComplete = () => {
    setShowBikeSwapper(false);
    setSelectedContract(null);
  };

  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const handleDocumentCapture = (imageData, type) => {
    setCustomer(prev => ({
      ...prev,
      [type === 'front' ? 'idFrontUrl' : 'idBackUrl']: imageData
    }))
  }



  const steps = [
    { number: 1, title: 'Dati Cliente', icon: '👤' },
    { number: 2, title: 'Documenti', icon: '📷' },
    { number: 3, title: 'Articoli', icon: '🚲' },
    { number: 4, title: 'Finalizza', icon: '✅' }
  ]

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            padding: '16px',
            backdropFilter: 'blur(10px)'
          }}>
            <LocationLogo 
              locationName={user?.location?.name || user?.username} 
              size="large"
            />
          </div>
          <div>
            <h1 style={{
              margin: '0 0 8px 0',
              fontSize: '2.5rem',
              fontWeight: '800'
            }}>
              📋 Nuovo Contratto
            </h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '18px' }}>
              Crea un nuovo contratto di noleggio
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {steps.map((step, index) => (
            <div key={step.number} style={{
              display: 'flex',
              alignItems: 'center',
              flex: 1
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: currentStep >= step.number ? 
                    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : '#e5e7eb',
                  color: currentStep >= step.number ? 'white' : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}>
                  {step.icon}
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: currentStep >= step.number ? '#3b82f6' : '#9ca3af',
                  textAlign: 'center'
                }}>
                  {step.title}
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div style={{
                  flex: 1,
                  height: '2px',
                  background: currentStep > step.number ? '#3b82f6' : '#e5e7eb',
                  margin: '0 16px',
                  transition: 'all 0.3s ease'
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Campo inserimento rapido barcode */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '2px solid #e5e7eb'
      }}>
        <h3 style={{
          margin: '0 0 16px 0',
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🔫 Inserimento Rapido Barcode
        </h3>
        <form onSubmit={handleQuickBarcodeSubmit} style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            value={quickBarcode}
            onChange={(e) => setQuickBarcode(e.target.value)}
            placeholder="Scansiona o digita barcode e premi INVIO"
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'monospace'
            }}
            autoFocus
          />
          <button
            type="submit"
            disabled={!quickBarcode.trim() || loading}
            style={{
              padding: '12px 24px',
              background: quickBarcode.trim() ? 
                'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#d1d5db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: quickBarcode.trim() ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {loading ? '⏳' : '➕ Aggiungi'}
          </button>
        </form>
      </div>

      {/* Barra pulsanti funzionalità */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setShowContractMirror(!showContractMirror)}
          style={{
            padding: '8px 16px',
            background: showContractMirror ? 
              'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#f3f4f6',
            color: showContractMirror ? 'white' : '#374151',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          🔍 Specchietto Contratti
        </button>

        <button
          onClick={() => setShowBarcodeScanner(!showBarcodeScanner)}
          style={{
            padding: '8px 16px',
            background: showBarcodeScanner ? 
              'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : '#f3f4f6',
            color: showBarcodeScanner ? 'white' : '#374151',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          📱 Scanner Barcode
        </button>

        <button
          onClick={() => setShowPriceCalculator(!showPriceCalculator)}
          style={{
            padding: '8px 16px',
            background: showPriceCalculator ? 
              'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : '#f3f4f6',
            color: showPriceCalculator ? 'white' : '#374151',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          💰 Calcolatore Prezzi
        </button>

        <button
          onClick={() => setShowBikeReturn(true)}
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          📥 Gestione Rientri
        </button>

        {selectedContract && (
          <>
            <button
              onClick={() => setShowBikeSwapper(true)}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              🔄 Sostituisci Bici
            </button>
            
            <button
              onClick={() => setShowContractManagement(true)}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              🛠️ Gestisci Contratto
            </button>
            
            <button
              onClick={() => setShowContractClosure(true)}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              💰 Chiudi Contratto
            </button>
          </>
        )}
      </div>

      {/* Specchietto contratti e scanner */}
      {showContractMirror && (
        <ContractMirror onContractSelect={setSelectedContract} />
      )}

      {showBarcodeScanner && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            color: '#374151',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📱 Scanner Barcode
          </h3>
          <BarcodeScanner
            onScan={handleBarcodeScanned}
            placeholder="Scansiona barcode per aggiungere bici/accessorio"
          />
        </div>
      )}

      {showPriceCalculator && (
        <PriceCalculator 
          onPriceCalculated={setCalculatedPrice}
          startDate={startDate}
          endDate={endDate}
        />
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
      }}>
        {/* Colonna Sinistra */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Step 1: Dati Cliente */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: currentStep === 1 ? '2px solid #3b82f6' : '1px solid #e5e7eb'
          }}>
            <h3 style={{
              margin: '0 0 20px 0',
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '1.25rem',
              fontWeight: '700'
            }}>
              👤 Dati Cliente
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Nome e Cognome *
                </label>
                <input
                  type="text"
                  value={customer.name}
                  onChange={e => setCustomer(prev => ({...prev, name: e.target.value}))}
                  placeholder="Mario Rossi"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Telefono *
                </label>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={e => setCustomer(prev => ({...prev, phone: e.target.value}))}
                  placeholder="+39 123 456 7890"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                disabled={!customer.name || !customer.phone}
                style={{
                  background: (!customer.name || !customer.phone) ? '#9ca3af' : 
                    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: (!customer.name || !customer.phone) ? 'not-allowed' : 'pointer',
                  marginTop: '8px'
                }}
              >
                Continua ai Documenti →
              </button>
            </div>
          </div>

          {/* Step 2: Documenti */}
          {currentStep >= 2 && (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: currentStep === 2 ? '2px solid #3b82f6' : '1px solid #e5e7eb'
            }}>
              <h3 style={{
                margin: '0 0 20px 0',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '1.25rem',
                fontWeight: '700'
              }}>
                📷 Documenti di Identità
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <DocumentCapture
                  onCapture={(imageData) => handleDocumentCapture(imageData, 'front')}
                  label="Documento Fronte"
                  type="front"
                />
                
                <DocumentCapture
                  onCapture={(imageData) => handleDocumentCapture(imageData, 'back')}
                  label="Documento Retro (Opzionale)"
                  type="back"
                />

                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!customer.idFrontUrl}
                  style={{
                    background: !customer.idFrontUrl ? '#9ca3af' : 
                      'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: !customer.idFrontUrl ? 'not-allowed' : 'pointer'
                  }}
                >
                  Continua agli Articoli →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Colonna Destra */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Step 3: Scanner e Articoli */}
          {currentStep >= 3 && (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: currentStep === 3 ? '2px solid #3b82f6' : '1px solid #e5e7eb'
            }}>
              <h3 style={{
                margin: '0 0 20px 0',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '1.25rem',
                fontWeight: '700'
              }}>
                🚲 Scansiona Articoli
              </h3>
              
              <BarcodeScannerSimple onScan={handleBarcodeScanned} />
              
              {/* Lista articoli */}
              {items.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#374151' }}>
                    Articoli Aggiunti ({items.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {items.map((item, index) => (
                      <div key={index} style={{
                        padding: '16px',
                        background: '#f8fafc',
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: 12
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', fontSize: 16, color: '#374151' }}>
                              {item.kind === 'bike' ? '🚲' : '🎒'} {item.name}
                            </div>
                            <div style={{ fontSize: 12, color: '#6b7280' }}>
                              {item.barcode}
                            </div>
                            <div style={{ fontSize: 12, color: '#059669', marginTop: 4 }}>
                              €{item.priceHourly}/h • €{item.priceDaily}/giorno
                            </div>
                            
                            {/* Assicurazione individuale solo per bici */}
                            {item.kind === 'bike' && (
                              <div style={{
                                marginTop: 8,
                                padding: 8,
                                background: '#fff7ed',
                                border: '1px solid #fed7aa',
                                borderRadius: 6
                              }}>
                                <label style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: '#ea580c',
                                  cursor: 'pointer'
                                }}>
                                  <input
                                    type="checkbox"
                                    checked={item.insurance || false}
                                    onChange={(e) => {
                                      setItems(prev => prev.map((prevItem, prevIndex) => 
                                        prevIndex === index 
                                          ? { ...prevItem, insurance: e.target.checked, insuranceFlat: e.target.checked ? 5 : 0 }
                                          : prevItem
                                      ));
                                    }}
                                    style={{ marginRight: 4 }}
                                  />
                                  🛡️ Assicurazione (+€5.00)
                                </label>
                                {item.insurance && (
                                  <div style={{ fontSize: 10, color: '#9a3412', marginTop: 2 }}>
                                    Copertura danni e furto
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(index)}
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              marginLeft: 8
                            }}
                          >
                            ✕
                          </button>
                        </div>
                        
                        {item.barcode && (
                          <BarcodeGenerator
                            code={item.barcode}
                            name={item.name}
                            type={item.kind}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Riepilogo assicurazioni */}
                  {items.filter(item => item.insurance).length > 0 && (
                    <div style={{
                      marginTop: 16,
                      padding: 12,
                      background: '#fff7ed',
                      border: '1px solid #fed7aa',
                      borderRadius: 8
                    }}>
                      <strong>🛡️ Riepilogo Assicurazioni:</strong> {items.filter(item => item.insurance).length} bici assicurate
                      <div style={{ fontSize: 12, color: '#ea580c', marginTop: 4 }}>
                        Totale assicurazione: €{items.reduce((sum, item) => sum + (item.insurance ? (item.insuranceFlat || 5) : 0), 0).toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {items.length > 0 && (
                <button
                  onClick={() => setCurrentStep(4)}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    width: '100%',
                    marginTop: '16px'
                  }}
                >
                  Finalizza Contratto →
                </button>
              )}
            </div>
          )}

          {/* Step 4: Finalizza */}
          {currentStep >= 4 && (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '2px solid #10b981'
            }}>
              <h3 style={{
                margin: '0 0 20px 0',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '1.25rem',
                fontWeight: '700'
              }}>
                ✅ Finalizza Contratto
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Sezione Pagamenti Opzionale */}
                <div style={{
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '16px',
                  background: '#f9fafb'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}>
                    <label style={{
                      fontWeight: '600',
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      💳 Gestione Pagamenti (Opzionale)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPaymentSection(!showPaymentSection)}
                      style={{
                        background: showPaymentSection ? '#10b981' : '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {showPaymentSection ? '✓ Attiva' : '+ Aggiungi'}
                    </button>
                  </div>

                  {showPaymentSection && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {/* Checkbox per prenotazione */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db'
                      }}>
                        <input
                          type="checkbox"
                          id="isReservation"
                          checked={isReservation}
                          onChange={(e) => setIsReservation(e.target.checked)}
                          style={{ transform: 'scale(1.2)' }}
                        />
                        <label htmlFor="isReservation" style={{
                          fontWeight: '500',
                          color: '#374151',
                          cursor: 'pointer'
                        }}>
                          📅 Crea come prenotazione (da attivare quando il cliente arriva)
                        </label>
                      </div>

                      {/* Link pagamento */}
                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontWeight: '500',
                          color: '#374151'
                        }}>
                          🔗 Link Pagamento
                        </label>
                        <input
                          type="url"
                          value={paymentLink}
                          onChange={(e) => setPaymentLink(e.target.value)}
                          placeholder="https://esempio.com/pagamento/..."
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      {/* Note pagamento */}
                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontWeight: '500',
                          color: '#374151'
                        }}>
                          📝 Note Pagamento
                        </label>
                        <textarea
                          value={paymentNotes}
                          onChange={(e) => setPaymentNotes(e.target.value)}
                          placeholder="Istruzioni per il pagamento, importo, scadenza..."
                          rows={2}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                            resize: 'vertical'
                          }}
                        />
                      </div>

                      {/* Metodo di pagamento */}
                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontWeight: '500',
                          color: '#374151'
                        }}>
                          💰 Metodo di Pagamento
                        </label>
                        <select
                          value={paymentMethod || ''}
                          onChange={(e) => setPaymentMethod(e.target.value || null)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                          }}
                        >
                          <option value="">Seleziona metodo...</option>
                          <option value="cash">Contanti</option>
                          <option value="card">Carta</option>
                          <option value="bank_transfer">Bonifico</option>
                          <option value="paypal">PayPal</option>
                          <option value="stripe">Stripe</option>
                          <option value="other">Altro</option>
                        </select>
                      </div>

                      {isReservation && (
                        <div style={{
                          background: '#fef3c7',
                          border: '1px solid #f59e0b',
                          borderRadius: '8px',
                          padding: '12px',
                          fontSize: '14px',
                          color: '#92400e'
                        }}>
                          ⚠️ <strong>Modalità Prenotazione:</strong> Il contratto verrà creato con stato "Prenotato". 
                          Potrai attivarlo dalla pagina "Gestisci Contratti" quando il cliente arriva.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Note (opzionale)
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Note aggiuntive..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  onClick={createContract}
                  disabled={loading}
                  style={{
                    background: loading ? '#9ca3af' : 
                      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: '700',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px'
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Creazione...
                    </>
                  ) : (
                    <>
                      🎉 Crea Contratto
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal per sostituzione bici */}
      {showBikeSwapper && selectedContract && (
        <BikeSwapper
          contract={selectedContract}
          onSwapComplete={handleSwapComplete}
          onClose={() => setShowBikeSwapper(false)}
        />
      )}

      {/* Modal per gestione rientri */}
      {showBikeReturn && (
        <BikeReturn
          onReturnComplete={() => {
            setShowBikeReturn(false);
            // Ricarica dati se necessario
          }}
          onClose={() => setShowBikeReturn(false)}
        />
      )}

      {/* Modal per chiusura contratto */}
      {showContractClosure && selectedContract && (
        <ContractClosure
          contract={selectedContract}
          onComplete={() => {
            setShowContractClosure(false);
            setSelectedContract(null);
            // Ricarica dati se necessario
          }}
          onClose={() => setShowContractClosure(false)}
        />
      )}

      {/* Modal per gestione contratto admin */}
      {showContractManagement && selectedContract && (
        <ContractManagement
          contract={selectedContract}
          onUpdate={(updatedContract) => {
            setSelectedContract(updatedContract);
            setShowContractManagement(false);
            // Ricarica dati se necessario
          }}
          onClose={() => setShowContractManagement(false)}
        />
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}