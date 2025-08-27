import React, { useEffect, useState } from 'react'
import { api } from '../services/api.js'
import { jwtDecode } from 'jwt-decode'
import LocationLogo from '../Components/LocationLogo.jsx'
import BarcodeGenerator from '../Components/BarcodeGenerator.jsx'
import ImageUpload from '../Components/ImageUpload.jsx'
import BulkBikeUpload from '../Components/BulkBikeUpload.jsx'
import BikeManagement from '../Components/BikeManagement.jsx'

export default function Bikes(){
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({ name:'', type:'ebike-full', priceHourly:5, priceDaily:30, photoUrl:'', barcode:'' })
  const [q, setQ] = useState('')
  const [user, setUser] = useState(null)
  const [locations, setLocations] = useState([])
  const [showBarcodeGenerator, setShowBarcodeGenerator] = useState(false)
  const [showAdvancedView, setShowAdvancedView] = useState(false)

  useEffect(()=>{
    // Decodifica il token per ottenere info utente
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

  useEffect(()=>{
    if(user && user.role === 'superadmin') {
      // Carica le location per il superadmin
      (async()=>{
        try {
          const { data } = await api.get('/api/locations')
          setLocations(data)
        } catch(e) {
          console.error('Errore caricamento location:', e)
        }
      })()
    }
  }, [user])

  async function load(){
    const { data } = await api.get('/api/bikes', { params: { q } })
    setRows(data)
  }
  useEffect(()=>{ load() }, [])

  async function add(e){
    e.preventDefault()
    
    // Validazione per superadmin
    if (user?.role === 'superadmin' && !form.location) {
      alert('❌ Errore: Devi selezionare una location per aggiungere la bici')
      return
    }
    
    // Validazione campi obbligatori
    if (!form.name.trim()) {
      alert('❌ Errore: Il nome della bici è obbligatorio')
      return
    }
    
    try {
      console.log('Invio dati bici:', form)
      console.log('API base URL:', api.defaults.baseURL)
      console.log('Token presente:', !!localStorage.getItem('token'))
      console.log('Authorization header:', api.defaults.headers.common['Authorization'])
      
      const response = await api.post('/api/bikes', form)
      console.log('Risposta server:', response.data)
      setForm({ name:'', type:'ebike-full', priceHourly:5, priceDaily:30, photoUrl:'', barcode:'', location:'' })
      await load()
      alert('✅ Bici aggiunta con successo!')
    } catch (e) {
      console.error('Errore completo:', e)
      console.error('Errore response:', e.response?.data)
      console.error('Errore status:', e.response?.status)
      console.error('Errore headers:', e.response?.headers)
      
      const errorMessage = e.response?.data?.error || e.message || 'Errore sconosciuto';
      
      // Gestione specifica per errori di barcode duplicato
      if (errorMessage.includes('duplicate key') || errorMessage.includes('duplicato') || errorMessage.includes('già esistente')) {
        alert('❌ Barcode Duplicato!\n\n' + 
              'Il barcode specificato è già in uso da un\'altra bici.\n\n' +
              '💡 Soluzioni:\n' +
              '• Lascia vuoto il campo barcode per generazione automatica\n' +
              '• Usa un barcode diverso\n' +
              '• Controlla se la bici esiste già nell\'inventario\n\n' +
              'Dettagli: ' + errorMessage);
      } else {
        alert('❌ Errore nell\'aggiunta della bici: ' + errorMessage);
      }
    }
  }

  async function changeStatus(bikeId, newStatus) {
    try {
      await api.patch(`/api/bikes/${bikeId}`, { status: newStatus })
      await load() // Ricarica la lista
    } catch (e) {
      alert('Errore nel cambio stato: ' + (e.response?.data?.error || e.message))
    }
  }

  async function viewActiveContract(barcode) {
    try {
      const { data } = await api.get(`/api/contracts/active-by-barcode/${barcode}`)
      alert(`Contratto attivo:\nCliente: ${data.customer?.name}\nTelefono: ${data.customer?.phone}\nInizio: ${new Date(data.startAt).toLocaleString()}`)
    } catch (e) {
      alert('Nessun contratto attivo trovato per questa bici')
    }
  }

  async function updateBikeStatus(bikeId, newStatus) {
    try {
      await api.patch(`/api/bikes/${bikeId}`, { status: newStatus })
      await load()
      alert(`✅ Stato bici aggiornato a: ${newStatus}`)
    } catch (e) {
      alert('❌ Errore aggiornamento stato: ' + (e.response?.data?.error || e.message))
    }
  }

  async function deleteBike(bikeId) {
    if (!confirm('Sei sicuro di voler rimuovere questa bici dall\'inventario?')) return
    
    try {
      await api.delete(`/api/bikes/${bikeId}`)
      await load()
      alert('✅ Bici rimossa dall\'inventario')
    } catch (e) {
      alert('❌ Errore rimozione: ' + (e.response?.data?.error || e.message))
    }
  }

  return (
    <div>
      {/* Header con logo */}
      <div style={{marginBottom: '32px'}}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '16px'
        }}>
          <LocationLogo 
            locationName={user?.location?.name || user?.username} 
            size="header"
            style={{
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: '3px solid white'
            }}
          />
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              🚴 Gestione Bici
            </h1>
            <p style={{margin: '4px 0 0 0', color: '#64748b'}}>
              {user?.role === 'superadmin' ? 'Gestisci tutte le bici del sistema' : `Gestisci le bici di ${user?.username}`}
            </p>
            {user?.location?.name && user?.role !== 'superadmin' && (
              <div style={{
                marginTop: '8px',
                padding: '4px 12px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'inline-block',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                📍 {user.location.name}
              </div>
            )}
          </div>
        </div>
      </div>
      <form onSubmit={add} style={{display:'grid', gridTemplateColumns:user?.role === 'superadmin' ? 'repeat(7, 1fr)' : 'repeat(6, 1fr)', gap:8, marginBottom:16}}>
        <input 
          placeholder="Nome bici *" 
          value={form.name} 
          onChange={e=>setForm({...form, name:e.target.value})}
          required
          style={{
            border: !form.name.trim() ? '2px solid #ef4444' : '1px solid #d1d5db',
            backgroundColor: !form.name.trim() ? '#fef2f2' : 'white'
          }}
        />
        <select value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
          <option value="ebike-full">E-bike Full</option>
          <option value="ebike-front">E-bike Front</option>
          <option value="ebike-other">E-bike (altre)</option>
          <option value="muscolare">Muscolare</option>
        </select>
        <input type="number" step="0.01" placeholder="€/h" value={form.priceHourly} onChange={e=>setForm({...form, priceHourly:Number(e.target.value)})} />
        <input type="number" step="0.01" placeholder="€/giorno" value={form.priceDaily} onChange={e=>setForm({...form, priceDaily:Number(e.target.value)})} />
        <div>
          <label style={{display:'block', marginBottom:'8px', fontWeight:'600', color:'#374151'}}>📷 Foto Bici</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  setForm({...form, photoUrl: event.target.result});
                };
                reader.readAsDataURL(file);
              }
            }}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              marginBottom: '8px',
              fontSize: '14px'
            }}
          />
          {form.photoUrl && (
            <div style={{textAlign: 'center', marginTop: '12px'}}>
              <img 
                src={form.photoUrl} 
                alt="Preview bici" 
                style={{
                  maxWidth: '200px',
                  maxHeight: '150px',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
              <div>
                <button
                  type="button"
                  onClick={() => setForm({...form, photoUrl: ''})}
                  style={{
                    marginTop: '8px',
                    padding: '6px 12px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  🗑️ Rimuovi Foto
                </button>
              </div>
            </div>
          )}
        </div>
        <input placeholder="Barcode (vuoto = auto)" value={form.barcode} onChange={e=>setForm({...form, barcode:e.target.value})} />
        {user?.role === 'superadmin' && (
          <select 
            value={form.location || ''} 
            onChange={e=>setForm({...form, location:e.target.value})} 
            required
            style={{
              border: !form.location ? '2px solid #ef4444' : '1px solid #d1d5db',
              backgroundColor: !form.location ? '#fef2f2' : 'white'
            }}
          >
            <option value="">⚠️ Seleziona Location *</option>
            {locations.map(loc => (
              <option key={loc._id} value={loc._id}>{loc.name}</option>
            ))}
          </select>
        )}
        <button>Aggiungi</button>
      </form>

      <div style={{
        display: 'flex', 
        gap: '12px', 
        alignItems: 'center', 
        marginBottom: '16px',
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <input 
          placeholder="Cerca bici per nome o barcode" 
          value={q} 
          onChange={e=>setQ(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px'
          }}
        />
        <button 
          onClick={load}
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          🔍 Cerca
        </button>
        
        <BulkBikeUpload
          onComplete={(results) => {
            console.log('Caricamento completato:', results);
            load(); // Ricarica la lista delle bici
          }}
          userRole={user?.role}
          locations={locations}
        />
        <button 
          onClick={() => setShowAdvancedView(!showAdvancedView)}
          style={{
            background: showAdvancedView ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {showAdvancedView ? '📋 Vista Classica' : '🔧 Vista Avanzata'}
        </button>
        
        <button 
          onClick={() => setShowBarcodeGenerator(true)}
          disabled={rows.length === 0}
          style={{
            background: rows.length > 0 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#9ca3af',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: rows.length > 0 ? 'pointer' : 'not-allowed',
            fontWeight: '600'
          }}
        >
          🏷️ Stampa Barcode ({rows.length})
        </button>
      </div>

      {showAdvancedView ? (
        <BikeManagement />
      ) : (
        <div style={{overflowX: 'auto'}}>
          <table width="100%" cellPadding="8" style={{
            borderCollapse:'collapse',
            background: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
          <thead>
            <tr style={{background: '#f8fafc'}}>
              <th style={{textAlign: 'left', fontWeight: '600', color: '#374151'}}>Foto</th>
              <th style={{textAlign: 'left', fontWeight: '600', color: '#374151'}}>Nome</th>
              <th style={{textAlign: 'left', fontWeight: '600', color: '#374151'}}>Tipo</th>
              <th style={{textAlign: 'left', fontWeight: '600', color: '#374151'}}>€/h</th>
              <th style={{textAlign: 'left', fontWeight: '600', color: '#374151'}}>€/g</th>
              <th style={{textAlign: 'left', fontWeight: '600', color: '#374151'}}>Barcode</th>
              <th style={{textAlign: 'left', fontWeight: '600', color: '#374151'}}>Stato</th>
              {user?.role === 'superadmin' && <th style={{textAlign: 'left', fontWeight: '600', color: '#374151'}}>Location</th>}
              <th style={{textAlign: 'center', fontWeight: '600', color: '#374151'}}>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r=> {
              const getStatusColor = (status) => {
                switch(status) {
                  case 'available': return '#10b981';
                  case 'in-use': return '#f59e0b';
                  case 'maintenance': return '#ef4444';
                  case 'loan': return '#8b5cf6';
                  case 'reserved': return '#3b82f6';
                  default: return '#6b7280';
                }
              };

              const getStatusText = (status) => {
                switch(status) {
                  case 'available': return '✅ Disponibile';
                  case 'in-use': return '🔄 In uso';
                  case 'maintenance': return '🔧 Manutenzione';
                  case 'loan': return '🤝 In prestito';
                  case 'reserved': return '📅 Riservata';
                  default: return status;
                }
              };

              return (
                <tr key={r._id} style={{borderTop:'1px solid #e5e7eb'}}>
                  <td style={{padding: '8px'}}>
                    {r.photoUrl ? (
                      <img 
                        src={r.photoUrl} 
                        alt={r.name}
                        style={{
                          width: '50px',
                          height: '40px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '50px',
                        height: '40px',
                        background: '#f3f4f6',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                      }}>
                        🚲
                      </div>
                    )}
                  </td>
                  <td style={{fontWeight: '600'}}>{r.name}</td>
                  <td style={{textTransform: 'capitalize'}}>{r.type}</td>
                  <td>€{r.priceHourly}</td>
                  <td>€{r.priceDaily}</td>
                  <td style={{fontFamily: 'monospace', fontSize: '14px'}}>{r.barcode}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: getStatusColor(r.status) + '20',
                      color: getStatusColor(r.status)
                    }}>
                      {getStatusText(r.status)}
                    </span>
                  </td>
                  {user?.role === 'superadmin' && <td>{r.location?.name || 'N/A'}</td>}
                  <td style={{textAlign: 'center'}}>
                    <div style={{display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap'}}>
                      {/* Pulsante Barcode per ogni bici */}
                      <BarcodeGenerator 
                        code={r.barcode} 
                        name={r.name} 
                        type="bike"
                        compact={true}
                      />
                      
                      {r.status === 'in-use' && (
                        <button
                          onClick={() => viewActiveContract(r.barcode)}
                          style={{
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          👁️ Contratto
                        </button>
                      )}
                      
                      <select
                        value={r.status}
                        onChange={(e) => updateBikeStatus(r._id, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '1px solid #d1d5db',
                          fontSize: '12px',
                          cursor: 'pointer',
                          marginRight: '4px'
                        }}
                      >
                        <option value="available">✅ Disponibile</option>
                        <option value="in-use">🔄 In uso</option>
                        <option value="maintenance">🔧 Manutenzione</option>
                        <option value="loan">🤝 In prestito</option>
                        <option value="reserved">📅 Riservata</option>
                      </select>
                      
                      <button
                        onClick={() => deleteBike(r._id)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                        title="Rimuovi bici dall'inventario"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      )}

      {/* Modal per generazione barcode */}
      {showBarcodeGenerator && (
        <BarcodeGenerator 
          bikes={rows}
          onClose={() => setShowBarcodeGenerator(false)}
        />
      )}
    </div>
  )
}
