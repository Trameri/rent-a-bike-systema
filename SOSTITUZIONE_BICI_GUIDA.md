# 🔄 Sistema di Sostituzione Bici - Guida Completa

## 📋 Panoramica
Il sistema di sostituzione bici permette di sostituire qualsiasi bici in qualsiasi contratto attivo (stato "in-use" o "reserved") in modo semplice e tracciabile.

## 🚀 Funzionalità Implementate

### 1. **Pagina Gestione Sostituzioni** (`/bike-swap`)
- **Accesso**: Menu principale → "🔄 Sostituzioni Bici"
- **Funzionalità**:
  - Visualizza tutti i contratti attivi
  - Ricerca per cliente, telefono, ID contratto o barcode bici
  - Scansione barcode per trovare rapidamente il contratto
  - Statistiche in tempo reale
  - Storico delle sostituzioni recenti

### 2. **Sostituzione Rapida** (Integrata nella pagina contratti)
- **Accesso**: Pagina contratti → "⚡ Sostituzione Rapida"
- **Processo guidato in 4 step**:
  1. Scansiona bici da sostituire
  2. Scansiona bici sostituto
  3. Seleziona motivo
  4. Conferma operazione

### 3. **Sostituzione Avanzata** (Per contratti specifici)
- **Accesso**: Gestione contratti → "🔄 Sostituisci Bici"
- **Funzionalità**:
  - Selezione manuale o scansione barcode
  - Ricerca bici disponibili
  - Motivi predefiniti + personalizzati
  - Anteprima completa prima della conferma

## 🛠️ Come Utilizzare

### Metodo 1: Sostituzione Rapida (Consigliato)
1. Vai su `/contracts` o clicca "📋 Nuovo Contratto"
2. Clicca "⚡ Sostituzione Rapida"
3. Scansiona il barcode della bici da sostituire
4. Scansiona il barcode della bici sostituto
5. Seleziona il motivo della sostituzione
6. Conferma l'operazione

### Metodo 2: Gestione Sostituzioni
1. Vai su `/bike-swap` o clicca "🔄 Sostituzioni Bici"
2. Cerca il contratto o usa "📱 Scansiona Barcode"
3. Clicca "🔄 Sostituisci" sul contratto desiderato
4. Segui il processo guidato

### Metodo 3: Scansione Diretta
1. In qualsiasi pagina con "📱 Scansiona Barcode"
2. Scansiona il barcode di una bici in un contratto attivo
3. Il sistema trova automaticamente il contratto
4. Procedi con la sostituzione

## 📊 Tracciabilità

### Storico Sostituzioni
- **Dove**: Pagina `/bike-swap` → Sezione "📊 Sostituzioni Recenti"
- **Informazioni tracciate**:
  - Data e ora della sostituzione
  - Bici rimossa e aggiunta
  - Cliente e contratto
  - Motivo della sostituzione
  - Operatore che ha eseguito l'operazione

### Log delle Modifiche
- Ogni sostituzione viene registrata nel `modificationHistory` del contratto
- Accessibile tramite API `/api/contracts/:id/modifications`

## 🔧 API Backend

### Endpoint Principali
```
POST /api/contracts/swap-bike
- Esegue la sostituzione
- Body: { contractId, oldBikeId, newBikeId, reason }

GET /api/contracts/swap-history
- Recupera lo storico delle sostituzioni
- Query: { limit }

GET /api/contracts/active-by-barcode/:code
- Trova contratto attivo per barcode bici
```

### Validazioni
- ✅ Contratto deve essere "in-use" o "reserved"
- ✅ Bici da sostituire deve essere nel contratto
- ✅ Bici sostituto deve essere disponibile
- ✅ Motivo obbligatorio
- ✅ Aggiornamento automatico stati bici

## 🎯 Motivi di Sostituzione Predefiniti
- Guasto meccanico
- Foratura pneumatico
- Problema freni
- Problema cambio
- Richiesta cliente
- Manutenzione preventiva
- Bici danneggiata
- Upgrade richiesto
- Altro (con campo personalizzato)

## 🔐 Sicurezza e Permessi
- ✅ Autenticazione richiesta
- ✅ Filtro per location (admin non-super)
- ✅ Log completo delle operazioni
- ✅ Validazione dati lato server

## 🚀 Avvio Rapido del Sistema
Usa lo script PowerShell per avviare tutto:
```powershell
.\start-system.ps1
```

## 📱 URL Utili
- **Frontend**: http://localhost:5173
- **Sostituzioni**: http://localhost:5173/bike-swap
- **Contratti**: http://localhost:5173/contracts
- **Diagnostica**: http://localhost:5173/system-diagnostic

## 🔄 Flusso Operativo Tipico

### Scenario: Cliente riporta problema alla bici
1. **Identificazione**: Scansiona barcode bici problematica
2. **Sostituzione**: Sistema trova contratto → Scansiona bici sostituto
3. **Documentazione**: Seleziona motivo (es. "Guasto meccanico")
4. **Conferma**: Sistema aggiorna contratto e stati bici
5. **Tracciabilità**: Operazione registrata nello storico

### Scenario: Upgrade richiesto dal cliente
1. **Accesso**: Vai su gestione sostituzioni
2. **Ricerca**: Trova contratto per nome cliente
3. **Selezione**: Scegli bici da sostituire e sostituto
4. **Motivo**: "Upgrade richiesto"
5. **Completamento**: Cliente riceve bici migliore

## ⚠️ Note Importanti
- Le sostituzioni sono permesse solo per contratti attivi o prenotati
- La bici sostituto deve essere disponibile
- Ogni sostituzione è tracciata e non reversibile
- Gli stati delle bici vengono aggiornati automaticamente
- Il prezzo del contratto non cambia con la sostituzione

## 🎉 Vantaggi del Sistema
- **Velocità**: Processo guidato in pochi click
- **Flessibilità**: Funziona con qualsiasi bici e contratto
- **Tracciabilità**: Storico completo delle operazioni
- **Sicurezza**: Validazioni multiple e log dettagliati
- **Usabilità**: Interfaccia intuitiva con scansione barcode