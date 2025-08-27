# 🚴 Rent a Bike - Sistema di Gestione Noleggio Bici

Un sistema completo per la gestione del noleggio di biciclette e accessori, sviluppato con tecnologie moderne e interfaccia user-friendly.

## 🌟 Caratteristiche Principali

### 📊 Dashboard Real-time
- **Statistiche Live**: Guadagni giornalieri, contratti attivi, totali
- **Bici Fuori**: Monitoraggio bici ancora in uso con indicatori di ritardo
- **Azioni Rapide**: Accesso veloce a tutte le funzionalità principali
- **Aggiornamento Automatico**: Dati aggiornati ogni 2 minuti

### 🚴 Gestione Bici
- **Catalogo Completo**: Gestione parco bici con foto e dettagli
- **Stati Dinamici**: Disponibile, In uso, Manutenzione, Riservata
- **Upload Immagini**: Caricamento foto da PC o URL
- **Barcode Generator**: Generazione automatica codici a barre
- **Filtri Avanzati**: Ricerca per nome, tipo, barcode

### 🔧 Gestione Accessori
- **Catalogo Accessori**: Caschi, lucchetti, borse, ecc.
- **Upload Immagini**: Caricamento foto da PC o URL
- **Prezzi Flessibili**: Tariffe orarie e giornaliere
- **Gestione Stock**: Monitoraggio disponibilità

### 📋 Contratti Intelligenti
- **Wizard Guidato**: Creazione contratti step-by-step
- **Calcolo Prezzi**: Automatico con sconti e assicurazioni
- **Documenti Digitali**: Cattura foto documenti identità
- **Gestione Completa**: Modifica, chiusura, storico

### 📈 Reporting Avanzato
- **Statistiche Dettagliate**: Guadagni, utilizzo, performance
- **Grafici Interattivi**: Visualizzazione dati in tempo reale
- **Export Dati**: Esportazione report in vari formati
- **Analisi Trend**: Andamenti temporali e stagionali

### 👥 Multi-Location
- **Gestione Sedi**: Supporto multiple location
- **Ruoli Utente**: Superadmin, Admin, Operatore
- **Permessi Granulari**: Controllo accessi per funzionalità
- **Branding Personalizzato**: Logo e colori per ogni sede

## 🛠️ Tecnologie Utilizzate

### Frontend
- **React 18** - Framework UI moderno
- **React Router** - Navigazione SPA
- **Axios** - Client HTTP
- **Vite** - Build tool veloce
- **CSS-in-JS** - Styling componenti

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Database NoSQL
- **Mongoose** - ODM per MongoDB
- **JWT** - Autenticazione sicura
- **Multer** - Upload file
- **Bcrypt** - Hashing password

### Funzionalità Avanzate
- **Barcode Scanner** - Lettura codici a barre
- **Document Capture** - Cattura documenti
- **Real-time Updates** - Aggiornamenti live
- **Error Boundary** - Gestione errori React
- **Toast Notifications** - Notifiche user-friendly

## 🚀 Installazione e Setup

### Prerequisiti
- Node.js 18+ 
- MongoDB 5+
- NPM o Yarn

### 1. Clona il Repository
```bash
git clone <repository-url>
cd rent-a-bike
```

### 2. Setup Backend
```bash
cd Backend
npm install
```

Crea file `.env`:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/rentabike
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

Avvia il server:
```bash
npm start
```

### 3. Setup Frontend
```bash
cd Frontend
npm install
```

Crea file `.env`:
```env
VITE_API_BASE_URL=http://localhost:4000
```

Avvia l'applicazione:
```bash
npm run dev
```

### 4. Accesso Iniziale
- **URL**: http://localhost:5173
- **Credenziali Default**: Verranno create al primo avvio

## 📁 Struttura del Progetto

```
rent-a-bike/
├── Backend/
│   ├── src/
│   │   ├── controllers/     # Logica business
│   │   ├── models/         # Modelli MongoDB
│   │   ├── routes/         # Route API
│   │   ├── middleware/     # Middleware Express
│   │   └── server.js       # Entry point
│   ├── uploads/           # File caricati
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── components/     # Componenti React
│   │   ├── pages/         # Pagine applicazione
│   │   ├── services/      # Servizi API
│   │   ├── utils/         # Utilità
│   │   ├── config/        # Configurazioni
│   │   └── App.jsx        # Componente principale
│   └── package.json
└── README.md
```

## 🎯 Funzionalità Dettagliate

### Dashboard
- ✅ Statistiche real-time
- ✅ Widget bici fuori
- ✅ Contratti attivi
- ✅ Azioni rapide
- ✅ Auto-refresh

### Gestione Bici
- ✅ CRUD completo
- ✅ Upload immagini
- ✅ Gestione stati
- ✅ Barcode generator
- ✅ Filtri e ricerca

### Gestione Accessori
- ✅ CRUD completo
- ✅ Upload immagini da PC
- ✅ Prezzi flessibili
- ✅ Gestione stock

### Contratti
- ✅ Wizard creazione
- ✅ Calcolo prezzi automatico
- ✅ Cattura documenti
- ✅ Gestione completa
- ✅ Storico modifiche

### Bici Fuori
- ✅ Monitoraggio real-time
- ✅ Indicatori ritardo
- ✅ Filtri avanzati
- ✅ Azioni rapide

### Sistema
- ✅ Autenticazione JWT
- ✅ Gestione errori
- ✅ Validazioni
- ✅ Logging
- ✅ Performance ottimizzate

## 🔧 Configurazione Avanzata

### Variabili Ambiente Backend
```env
PORT=4000                                    # Porta server
MONGODB_URI=mongodb://localhost:27017/rentabike  # Database
JWT_SECRET=your-secret-key                   # Chiave JWT
JWT_EXPIRES_IN=7d                           # Scadenza token
NODE_ENV=production                         # Ambiente
UPLOAD_MAX_SIZE=5242880                     # Max upload (5MB)
```

### Variabili Ambiente Frontend
```env
VITE_API_BASE_URL=http://localhost:4000     # URL API
VITE_ENABLE_CONSOLE_LOGS=true              # Log console
VITE_UPLOAD_MAX_SIZE=5242880               # Max upload
```

## 📊 API Endpoints

### Autenticazione
- `POST /api/auth/login` - Login utente
- `GET /api/auth/me` - Info utente corrente
- `POST /api/auth/refresh` - Refresh token

### Bici
- `GET /api/bikes` - Lista bici
- `POST /api/bikes` - Crea bici
- `PUT /api/bikes/:id` - Modifica bici
- `DELETE /api/bikes/:id` - Elimina bici

### Accessori
- `GET /api/accessories` - Lista accessori
- `POST /api/accessories` - Crea accessorio
- `PUT /api/accessories/:id` - Modifica accessorio
- `DELETE /api/accessories/:id` - Elimina accessorio

### Contratti
- `GET /api/contracts` - Lista contratti
- `POST /api/contracts` - Crea contratto
- `PUT /api/contracts/:id` - Modifica contratto
- `GET /api/contracts/dashboard-stats` - Statistiche dashboard
- `GET /api/contracts/bikes-out` - Bici fuori

### Upload
- `POST /api/upload/image` - Upload immagine
- `DELETE /api/upload/image/:filename` - Elimina immagine

## 🎨 Personalizzazione UI

### Temi e Colori
Il sistema supporta personalizzazione completa dei colori e temi tramite il file di configurazione.

### Logo e Branding
Ogni location può avere il proprio logo e branding personalizzato.

### Layout Responsive
L'interfaccia si adatta automaticamente a desktop, tablet e mobile.

## 🔒 Sicurezza

- **Autenticazione JWT** con refresh token
- **Validazione Input** lato client e server
- **Sanitizzazione Dati** per prevenire XSS
- **Rate Limiting** per prevenire abusi
- **HTTPS Ready** per produzione
- **Gestione Errori** sicura senza leak informazioni

## 📱 Compatibilità

### Browser Supportati
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivi
- Desktop (Windows, macOS, Linux)
- Tablet (iOS, Android)
- Mobile (iOS, Android) - Layout responsive

## 🚀 Deploy in Produzione

### Backend
1. Configura MongoDB Atlas o server dedicato
2. Imposta variabili ambiente produzione
3. Deploy su Heroku, DigitalOcean, AWS, ecc.
4. Configura HTTPS e dominio

### Frontend
1. Build produzione: `npm run build`
2. Deploy su Netlify, Vercel, AWS S3, ecc.
3. Configura variabili ambiente produzione
4. Imposta redirect per SPA

## 🤝 Contribuire

1. Fork del progetto
2. Crea feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit modifiche (`git commit -m 'Add AmazingFeature'`)
4. Push branch (`git push origin feature/AmazingFeature`)
5. Apri Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi il file `LICENSE` per dettagli.

## 📞 Supporto

Per supporto e domande:
- 📧 Email: support@rentabike.com
- 💬 Discord: [Server Community]
- 📖 Documentazione: [Wiki del progetto]

## 🎉 Ringraziamenti

Grazie a tutti i contributori e alla community open source per le librerie utilizzate.

---

**Rent a Bike** - Sistema di gestione noleggio bici moderno e completo 🚴‍♂️✨