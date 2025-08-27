# 👨‍💻 Guida per Sviluppatori - Rent a Bike

Questa guida contiene informazioni tecniche per sviluppatori che vogliono contribuire o modificare il sistema.

## 🏗️ Architettura del Sistema

### Stack Tecnologico
- **Frontend**: React 18 + Vite + React Router
- **Backend**: Node.js + Express + MongoDB
- **Database**: MongoDB con Mongoose ODM
- **Autenticazione**: JWT (JSON Web Tokens)
- **Upload**: Multer per gestione file
- **Styling**: CSS-in-JS (inline styles)

### Struttura Progetto
```
rent-a-bike/
├── Backend/                 # API Server
│   ├── src/
│   │   ├── config/         # Configurazioni database
│   │   ├── controllers/    # Logica business
│   │   ├── middleware/     # Middleware Express
│   │   ├── models/         # Modelli MongoDB
│   │   ├── routes/         # Route API
│   │   └── server.js       # Entry point server
│   └── uploads/            # File caricati
├── Frontend/               # React App
│   ├── src/
│   │   ├── components/     # Componenti riutilizzabili
│   │   ├── config/         # Configurazioni ambiente
│   │   ├── pages/          # Pagine applicazione
│   │   ├── services/       # Servizi API
│   │   ├── utils/          # Utilità e helper
│   │   └── App.jsx         # Componente principale
│   └── public/             # Asset statici
└── docs/                   # Documentazione
```

## 🔧 Setup Ambiente di Sviluppo

### Prerequisiti
- Node.js 18+
- MongoDB 5+
- Git
- Editor (VS Code raccomandato)

### Installazione
```bash
# Clona repository
git clone <repository-url>
cd rent-a-bike

# Setup Backend
cd Backend
npm install
cp .env.example .env  # Configura variabili ambiente

# Setup Frontend
cd ../Frontend
npm install
cp .env.example .env  # Configura variabili ambiente

# Avvia MongoDB (se locale)
mongod

# Avvia Backend (terminale 1)
cd Backend
npm run dev

# Avvia Frontend (terminale 2)
cd Frontend
npm run dev
```

## 📊 Database Schema

### Modelli Principali

#### User
```javascript
{
  _id: ObjectId,
  username: String,
  password: String (hashed),
  role: String, // 'superadmin', 'admin', 'operator'
  location: ObjectId, // ref Location
  createdAt: Date,
  updatedAt: Date
}
```

#### Location
```javascript
{
  _id: ObjectId,
  name: String,
  address: String,
  phone: String,
  email: String,
  settings: {
    currency: String,
    timezone: String,
    businessHours: Object
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Bike
```javascript
{
  _id: ObjectId,
  name: String,
  type: String, // 'city', 'mountain', 'electric', etc.
  barcode: String,
  status: String, // 'available', 'rented', 'maintenance', 'reserved'
  priceHourly: Number,
  priceDaily: Number,
  photoUrl: String,
  location: ObjectId, // ref Location
  createdAt: Date,
  updatedAt: Date
}
```

#### Accessory
```javascript
{
  _id: ObjectId,
  name: String,
  barcode: String,
  priceHourly: Number,
  priceDaily: Number,
  photoUrl: String,
  available: Boolean,
  location: ObjectId, // ref Location
  createdAt: Date,
  updatedAt: Date
}
```

#### Contract
```javascript
{
  _id: ObjectId,
  contractNumber: String,
  customer: {
    name: String,
    phone: String,
    email: String,
    documentType: String,
    documentNumber: String,
    documentPhoto: String
  },
  items: [{
    type: String, // 'bike' or 'accessory'
    item: ObjectId, // ref Bike or Accessory
    quantity: Number,
    priceHourly: Number,
    priceDaily: Number
  }],
  startDate: Date,
  endDate: Date,
  status: String, // 'active', 'completed', 'cancelled'
  pricing: {
    subtotal: Number,
    discount: Number,
    insurance: Number,
    total: Number
  },
  location: ObjectId, // ref Location
  createdBy: ObjectId, // ref User
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Autenticazione
```
POST   /api/auth/login          # Login utente
GET    /api/auth/me             # Info utente corrente
POST   /api/auth/refresh        # Refresh token
```

### Bici
```
GET    /api/bikes               # Lista bici
POST   /api/bikes               # Crea bici
GET    /api/bikes/:id           # Dettagli bici
PUT    /api/bikes/:id           # Modifica bici
DELETE /api/bikes/:id           # Elimina bici
```

### Accessori
```
GET    /api/accessories         # Lista accessori
POST   /api/accessories         # Crea accessorio
GET    /api/accessories/:id     # Dettagli accessorio
PUT    /api/accessories/:id     # Modifica accessorio
DELETE /api/accessories/:id     # Elimina accessorio
```

### Contratti
```
GET    /api/contracts           # Lista contratti
POST   /api/contracts           # Crea contratto
GET    /api/contracts/:id       # Dettagli contratto
PUT    /api/contracts/:id       # Modifica contratto
DELETE /api/contracts/:id       # Elimina contratto
GET    /api/contracts/dashboard-stats  # Statistiche dashboard
GET    /api/contracts/bikes-out # Bici ancora fuori
```

### Upload
```
POST   /api/upload/image        # Upload immagine
DELETE /api/upload/image/:filename  # Elimina immagine
```

### Utility
```
GET    /api/health              # Health check
POST   /api/barcode/generate    # Genera barcode
```

## 🎨 Frontend Architecture

### Componenti Principali

#### App.jsx
- Componente root con ErrorBoundary
- Gestione routing
- Context providers

#### Pages
- **Dashboard**: Statistiche e overview
- **Bikes**: Gestione bici
- **Accessories**: Gestione accessori
- **Contracts**: Gestione contratti
- **BikesOut**: Bici ancora fuori

#### Services
- **api.js**: Client HTTP con interceptors
- **auth.js**: Gestione autenticazione

#### Utils
- **validation.js**: Validazioni form
- **dateUtils.js**: Utilità date
- **formatters.js**: Formattatori dati

### State Management
Il sistema usa React hooks per la gestione dello stato:
- `useState` per stato locale componenti
- `useEffect` per side effects
- Context API per stato globale (se necessario)

### Routing
```javascript
// Route principali
/                    # Dashboard
/bikes              # Gestione bici
/accessories        # Gestione accessori
/contracts          # Gestione contratti
/bikes-out          # Bici ancora fuori
/reports            # Report (futuro)
```

## 🔒 Sicurezza

### Autenticazione
- JWT tokens con scadenza
- Refresh token mechanism
- Password hashing con bcrypt
- Role-based access control

### Validazione
- Input validation lato client e server
- Sanitizzazione dati
- File upload restrictions
- Rate limiting (da implementare)

### CORS
- Configurato per domini specifici
- Credentials support per cookies

## 🧪 Testing

### Setup Testing (da implementare)
```bash
# Backend testing
cd Backend
npm install --save-dev jest supertest
npm test

# Frontend testing
cd Frontend
npm install --save-dev @testing-library/react vitest
npm test
```

### Test Structure
```
tests/
├── backend/
│   ├── unit/           # Test unitari
│   ├── integration/    # Test integrazione
│   └── e2e/           # Test end-to-end
└── frontend/
    ├── components/     # Test componenti
    ├── pages/         # Test pagine
    └── utils/         # Test utilità
```

## 📈 Performance

### Backend Optimizations
- MongoDB query optimization con `.lean()`
- Aggregation pipelines per statistiche
- File caching per uploads
- Compression middleware

### Frontend Optimizations
- Code splitting con Vite
- Lazy loading componenti
- Image optimization
- Bundle analysis

### Monitoring
```javascript
// Performance monitoring
console.time('operation');
// ... operazione
console.timeEnd('operation');

// Memory usage
console.log(process.memoryUsage());
```

## 🔧 Debugging

### Backend Debug
```bash
# Debug mode
NODE_ENV=development npm run dev

# Verbose logging
DEBUG=* npm run dev
```

### Frontend Debug
```javascript
// React DevTools
// Redux DevTools (se implementato)

// Console debugging
console.log('Debug info:', data);
console.table(arrayData);
```

### Database Debug
```javascript
// Mongoose debug
mongoose.set('debug', true);

// Query profiling
db.setProfilingLevel(2);
db.system.profile.find().pretty();
```

## 🚀 Build e Deploy

### Build Production
```bash
# Backend
cd Backend
npm run build  # Se implementato

# Frontend
cd Frontend
npm run build
```

### Environment Variables
```bash
# Backend .env
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb://...
JWT_SECRET=...
CORS_ORIGIN=https://yourdomain.com

# Frontend .env.production
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_ENABLE_CONSOLE_LOGS=false
```

## 🔄 Workflow di Sviluppo

### Git Flow
```bash
# Feature branch
git checkout -b feature/new-feature
git commit -m "feat: add new feature"
git push origin feature/new-feature

# Pull request
# Code review
# Merge to main
```

### Commit Convention
```
feat: nuova funzionalità
fix: correzione bug
docs: aggiornamento documentazione
style: formattazione codice
refactor: refactoring
test: aggiunta test
chore: task manutenzione
```

## 📚 Risorse Utili

### Documentazione
- [React Docs](https://react.dev/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://docs.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [React DevTools](https://react.dev/learn/react-developer-tools)

## 🤝 Contribuire

### Setup Contribuzione
1. Fork del repository
2. Clone del fork
3. Setup ambiente sviluppo
4. Crea feature branch
5. Sviluppa e testa
6. Commit e push
7. Crea pull request

### Code Style
- ESLint per JavaScript
- Prettier per formattazione
- Commenti JSDoc per funzioni
- Nomi variabili descrittivi

### Pull Request
- Descrizione chiara delle modifiche
- Test per nuove funzionalità
- Documentazione aggiornata
- Code review richiesta

---

## 🆘 Troubleshooting

### Problemi Comuni

#### MongoDB Connection
```javascript
// Verifica connessione
mongoose.connection.on('error', console.error);
mongoose.connection.once('open', () => console.log('Connected'));
```

#### CORS Issues
```javascript
// Backend cors config
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

#### File Upload
```javascript
// Verifica permessi cartella
fs.access('./uploads', fs.constants.W_OK, (err) => {
  if (err) console.error('Upload folder not writable');
});
```

### Debug Commands
```bash
# Verifica porte in uso
netstat -an | findstr :4000
netstat -an | findstr :5173

# Verifica processi Node
tasklist | findstr node

# Pulisci cache npm
npm cache clean --force
```

---

**Happy Coding! 🚴‍♂️💻**