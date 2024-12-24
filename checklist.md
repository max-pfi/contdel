## Checkliste für die eigene fortlaufende Übung / TechDemo in Continuous Delivery

### Einführung und Grundlagen
- [x] Verständnis von Continuous Delivery und dessen Bedeutung
- [x] Unterschiede zwischen Continuous Integration, Continuous Delivery und Continuous Deployment
- [x] CI-Anti Pattern identifizieren

### 20% Projekt Setup
- [x] Initialisierung des Repository (Git) -> (Blank Project + Project Name = nachname) 
- [x] Checkliste kopieren und in neues geklontes Repository/project einfügen
- [x] Checkliste versionieren
- [ ] README anfertigen mit Verlinkungen, Hinweisen, etc. zum Inhalt des Repository
- [ ] zweites Repository für Übungen, Ausprobieren, etc. inkl. README sowie Verlinkungen und Übersicht zu den Übungen
- [x] .gitignore angepasst: Stelle sicher, dass unnötige Dateien nicht im Repository landen (z. B. durch ein angepasstes .gitignore-File).

### 10% Automatisierung
- [x] Automatisierte Builds eingerichtet
- [x] Automatisierte Tests implementiert
- [ ] Automatisierte Deployments konfiguriert
- [x] Automatisierte Code-Qualitätsanalyse: Setze statische Code-Analyse-Tools ein, um Codequalität automatisiert zu überprüfen.

### 10% Testing
- [x] (Unit) Tests geschrieben und automatisiert
- [ ] Integrationstests implementiert (optional)
- [ ] End-to-End Tests eingerichtet (optional)

### Deployment-Strategien
- [x] Deployment-Strategien identifizieren
- [ ] Rollback-Strategien (optional)

### 10% Containerisierung
- [x] Docker oder ähnliche Technologien eingesetzt
- [ ] Integration in eine Build-Pipeline

### 20% Infrastruktur- und Konfigurationsmanagement
- [x] Template Konfigurationsdateien versioniert und zentralisiert
- [x] Konfigurationsdateien ausgenommen
- [x] Verwendung in einer Build-Pipeline
- [x] Infrastructure as Code (IaC): Nutze Tools wie Terraform oder Ansible, um die Infrastruktur als Code zu verwalten und sicherzustellen, dass Deployments wiederholbar sind.

### 10% Sicherheit
- [ ] Zugangsdaten sicher hinterlegt
- [ ] Sicherheitsüberprüfungen: Integriere automatisierte Sicherheitstests (z. B. OWASP ZAP) in die Pipeline, um potenzielle Sicherheitslücken frühzeitig zu erkennen.

### Datenbanken
- [ ] Datenbank-Migrationen automatisiert
- [ ] Datenbank-Backups und Recovery-Pläne

### 20% Abschluss und Dokumentation
- [ ] Projekt-Dokumentation vervollständigt
- [ ] Branching-Strategie dokumentieren: Definiere eine Branching-Strategie (z. B. GitFlow) und dokumentiere die Entscheidungsfindung.
- [ ] Pipeline-Dokumentation: Erstelle eine vollständige technische Dokumentation deiner CI/CD-Pipeline, einschließlich aller verwendeten Tools, Skripte und Konfigurationen.
- [ ] Build Pipeline spezifizieren: Stelle sicher, dass alle Schritte der CI/CD-Pipeline klar definiert sind, inklusive Test-, Build- und Deployment-Schritte.
