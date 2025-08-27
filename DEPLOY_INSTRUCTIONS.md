# 🚀 Istruzioni per Deploy Gratuito Online

## 📋 Prerequisiti
- Account GitHub (gratuito)
- Account Railway (gratuito)
- Account Vercel (gratuito)

## 🔄 Passo 1: Carica su GitHub

1. **Vai su** [github.com](https://github.com) e fai login
2. **Clicca** "New repository"
3. **Nome repository**: `rent-a-bike-system`
4. **Seleziona** "Public" (per account gratuiti)
5. **NON** inizializzare con README (abbiamo già i file)
6. **Clicca** "Create repository"

7. **Nel terminale**, esegui questi comandi:
```bash
cd "c:\Users\nicot\Desktop\Rent a Bike"
git remote add origin https://github.com/nicotrameri/rent-a-bike-system.git
git branch -M main
git push -u origin main
```

## 🎨 Passo 2: Deploy Backend su Render

1. **Vai su** [render.com](https://render.com)
2. **Fai login** con GitHub
3. **Clicca** "New +" → "Web Service"
4. **Seleziona** il repository `rent-a-bike-system`
5. **Clicca** "Connect"

### ⚙️ Configurazione Render:

1. **Name**: `rent-a-bike-backend`
2. **Root Directory**: `Backend`
3. **Environment**: `Node`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. **Plan**: Seleziona **"Free"**

7. **Environment Variables** (clicca "Advanced"):
   ```
   MONGODB_URI=mongodb+srv://rentabike:rentabike123@cluster0.jj5whnf.mongodb.net/rentabike
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   NODE_ENV=production
   PORT=10000
   ```

8. **Clicca** "Create Web Service"
9. **Aspetta** il deploy (3-5 minuti)
10. **Copia** l'URL del backend (es: `https://rent-a-bike-backend.onrender.com`)

## 🌐 Passo 3: Deploy Frontend su Vercel

1. **Vai su** [vercel.com](https://vercel.com)
2. **Fai login** con GitHub
3. **Clicca** "New Project"
4. **Seleziona** il repository `rent-a-bike-system`
5. **Clicca** "Import"

### ⚙️ Configurazione Vercel:

1. **Root Directory**: `Frontend`
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Install Command**: `npm install`

5. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://rent-a-bike-backend.onrender.com
   ```
   (Sostituisci con l'URL di Render dal passo 2)

6. **Clicca** "Deploy"
7. **Aspetta** il deploy (2-3 minuti)

## ✅ Passo 4: Test del Sistema

1. **Apri** l'URL di Vercel (es: `https://rent-a-bike-system.vercel.app`)
2. **Testa** il login:
   - `superadmin` / `admin123`
   - `arnoga` / `arnoga123`
   - `cancano` / `cancano123`
   - `campo` / `campo123`

3. **Verifica** che tutto funzioni:
   - ✅ Login
   - ✅ Dashboard
   - ✅ Creazione contratti
   - ✅ Chiusura contratti
   - ✅ Statistiche superadmin

## 🔧 Risoluzione Problemi

### Backend non si avvia:
- Controlla le variabili d'ambiente su Render
- Verifica i log in Render > "Logs"

### Frontend non si connette al backend:
- Controlla che `VITE_API_BASE_URL` sia corretto
- Verifica che il backend sia online

### Errori CORS:
- Il backend ha già la configurazione CORS
- Se persistono, aggiungi l'URL di Vercel nelle impostazioni CORS

## 📊 URLs Finali

Dopo il deploy avrai:
- **Frontend**: `https://rent-a-bike-system.vercel.app`
- **Backend**: `https://rent-a-bike-backend.onrender.com`
- **Database**: MongoDB Cloud (già configurato)

## 💰 Costi

- **GitHub**: Gratuito
- **Render**: Gratuito (750 ore/mese)
- **Vercel**: Gratuito (illimitato per progetti personali)
- **MongoDB Cloud**: Gratuito (512MB)

**Totale**: €0/mese 🎉

## 🔄 Aggiornamenti Futuri

Per aggiornare il sistema:
1. Modifica i file localmente
2. `git add .`
3. `git commit -m "Descrizione modifiche"`
4. `git push`
5. Render e Vercel si aggiorneranno automaticamente!