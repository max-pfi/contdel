# Checkliste Pfisterer

### Allgemeine Planung
- [x] Festlegung der Projektidee
    - kleines soziales Netzwerk um Events zu erstellen und finden.
- [x] Zielgruppenanalyse
    - Leute im Studentenalter, fokussiert auf outdoor Aktivitäten
- [x] Auswahl der Technologien und Tools
    - Node.js, Express, EJS, MySQL, TypeScript
- [x] Erstellung eines Projektstrukturplans
    - auf Figma einen Grundriss erstellt um die Struktur und Funktionalitäten zu umreißen
- [x] Initialisierung des Projektrepositoriums (Git)
- [x] Erstellung eines Zeitplans
    - nur ein grober Zeitraum hinter der Prüfungsphase freigehalten
- [x] kontinuierliche Bearbeitung und Nutzung von Git

### HTML (Hypertext Markup Language)
- [x] Grundgerüst der HTML-Seite erstellen (Doctype, HTML, Head, Body)
- [x] Verwendung von semantischen HTML-Tags (z. B. `<header>`, `<footer>`, `<article>`, `<section>`)
    - Die Hauptseiten besitzen alle einen Header + Sections
    - Wo Navigation erwünscht ist auch ein nav element vorhanden
- [x] Verwendung von Metadaten im `<head>` (z. B. `<title>`, `<meta>`)
    - title, charset, viewport
- [x] Textelemente verwenden (h1, p, a, etc.)
- [x] Verwendung von Listen (ul, ol, li)
    - ein ul für die Teilnehmer eines Events
    - grundsätzlich verzichtet auf li/ul weil die vorgefertigten styles eigentlich hauptsächlich in die Quere kommen
- [x] Einbindung von Multimedia-Elementen (img, video, audio)
    - img für die Events (audio und video nicht ganz passend im Umfang der Implementation)
- [ ] Verwendung von Tabellen für tabellarische Daten (table, tr, td)
    - nicht wirklich tabellarische Dtaa vorhanden
- [x] Einbindung von Formularen (form, input, select)
    - für Login/Register und Erstellen und bearbeiten von Events
  
### CSS (Cascading Style Sheets)
- [x] Externe CSS-Datei, die mit HTML verknüpft ist
- [x] Grundlegende Selektoren verwenden (Tag, Klasse, ID)
- [x] Text und Schriftarten stylen (color, font-family)
- [x] Hintergrundfarben oder -bilder
- [x] Box-Modell verstehen (margin, padding, border)
    - alles auf border-box gesetzt um keine Probleme mit padding und margin zu bekommen, wenn Größen gesetzt werden
- [x] Verwendung von Flexbox oder Grid für das Layout
    - nur Flexbox verwendet, weil wesentlich flexibler und dynamischer
- [x] Responsives Design mit Media Queries
    - 2 Breakpoints für mobile und Tablet
- [x] Übergänge und Animationen hinzufügen (transition, animation)
    - alle Buttons animiert + Überschrift auf der Hauptseite
- [ ] Nutzung von CSS Bibliothek (z.B. Bootstrap)
    - zu generisch

### Formulare
- [x] Textfelder und Textbereiche (input type="text", textarea)
- [ ] Auswahlmöglichkeiten (checkbox, radio)
    - nicht wirklich ein Anwendungsfall
- [ ] Dropdown-Listen (select)
    - nicht wirklich ein Anwendungsfall
- [x] Datei-Upload (input type="file")
    - für Bild upload
- [x] Schaltflächen (button, input type="submit")
- [x] Clientseitige Validierung (required, pattern)
- [x] Serverseitige Validierung und Verarbeitung der Formulardaten

### JavaScript
- [x] Variablen und Datentypen
- [x] Kontrollstrukturen (if-else, loops)
- [x] Funktionen und Ereignishandling
- [x] DOM-Manipulation (Elemente auswählen, ändern, hinzufügen, entfernen)
    - Dynamische Anpassung der angezeigten Daten bei joinen und verlassen von Events
- [x] Asynchrone Operationen (Promises, async/await)
    - Fetch API für Serveranfragen
- [x] Fetch-API oder Ajax für Serveranfragen
    - für alle Veränderungen die nicht automatisch mit einem Seitenwechsel einhergehen
- [ ] Zustandsmanagement (Local Storage, Session Storage)
    - Nicht benutzt, weil keine direkte Notwendikeit hier und schon in der Exercise5 verwendet

### TypeScript (Optional)
- [x] Verwendung von TypeScript für stärkere Typsicherheit
- [x] Grundlagen und Syntax
- [x] Strenge Typisierung
- [x] Interfaces und Typaliasse
    - Interfaces für die Events und User
- [ ] Generische Typen
- [x] Module und Namespaces
    - Das Modul express-session wird erweitert
- [ ] Klassen und Vererbung
- [x] Compileroptionen
    - strict auf true gesetzt + outDir gesetzt
- [x] Kompilierung von TypeScript in JavaScript

### Webserver & Hosting (Optional)
- [ ] Auswahl eines Hosting-Service
- [ ] Deployment der Webseite

### Datenformate & REST APIs (Optional)
- [ ] Datenabfrage von einer REST-API
    - nicht umgestzt weil EJS in diesem Beispiel mit Node.js verwendet wird
    - REST API schon in der Lierantenübung verwendet und im Projektscope auch kein direkter Anwendungsfall
- [ ] Darstellung der Datenabfrage
- [ ] Persistieren der Datenabfrage
- [ ] Verwendung von JSON oder XML für den Datenaustausch

### Node.js
- [x] Initialisierung eines Node.js-Projekts (npm init)
- [x] Verwendung von npm-Paketen
- [x] Einrichtung eines Web-Servers (Express.js)
- [x] Routen und Middleware implementieren
    - Routen in eigenem Folder
    - Middleware u.a. für Dateiuploads
- [x] Anbindung einer Datenbank (z.B. MongoDB, MySQL)
    - MySQL
- [ ] Implementierung von RESTful APIs
    - wie oben beschrieben
- [x] Authentifizierung und Autorisierung (z.B. mit JWT)
    - mit express-session -> nicht ideal aber für den Umfang des Projektes die beste Option für mich
- [x] Fehlerbehandlung und Logging
    - Fehlermeldungen swohl direkt im Frontend als auch aus dem Backend ans Frontend weitergegeben
    - Auch ein kompletter DB-Ausfall wird entsprechend behandelt

### Datenbank
- [x] Auswahl des geeigneten Datenbanktyps (z.B. relational, NoSQL)
    - Klassisches relationales Datenbanksystem für den Anwendungsfall ideal
- [x] Erstellung des Datenbankschemas (Tabellenstruktur, Beziehungen)
- [x] Implementierung von CRUD-Operationen (Create, Read, Update, Delete)
    - alle umgesetzt
- [x] Implementierung von Sicherheitsmaßnahmen (z.B. SQL-Injection-Prävention)
    - Prepared Statements

### Dokumentation
- [x] Erstellung einer Projekt-Dokumentation gemäß den Kursrichtlinien
- [x] Fortlaufende Bearbeitung und Erweiterung der Dokumentation
    - Umfassende Dokumenation erst gegen Ende fertiggestellt
- [x] Einholung von Feedback von Lehrenden und Kolleg:innen
- [x] Einholung von Feedback von Lehrenden und Kolleg:innen
