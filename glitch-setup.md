# 🎨 Setup per Glitch

## 📁 Struttura Progetto per Glitch

Dopo aver importato da GitHub, dovrai:

### 1. Spostare i file Backend nella root
```
rent-a-bike-system/
├── src/           (da Backend/src/)
├── package.json   (da Backend/package.json)
├── .env          (nuovo file)
└── README.md
```

### 2. Creare il file .env
```
MONGODB_URI=mongodb+srv://rentabike:rentabike123@cluster0.jj5whnf.mongodb.net/rentabike
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=production
PORT=3000
```

### 3. Modificare package.json
Assicurati che il file package.json abbia:
```json
{
  "name": "rentabike-backend",
  "version": "1.0.0",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js"
  }
}
```

## 🚀 Procedura Rapida

1. **Import da GitHub** su Glitch
2. **Sposta** i file dalla cartella Backend/ alla root
3. **Crea** il file .env con le variabili
4. **Il progetto si riavvierà automaticamente**
5. **Testa** l'URL generato da Glitch

## 🎯 Vantaggi Glitch

- ✅ **Editor integrato** - modifiche in tempo reale
- ✅ **Logs visibili** - debug facile
- ✅ **Community** - tanti esempi
- ✅ **Remix** - puoi copiare progetti esistenti