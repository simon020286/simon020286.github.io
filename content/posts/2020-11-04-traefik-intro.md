---
title: Traefik - Intro
draft: false
date: 2020-11-10T12:50:05.227Z
description: Introduzione a traefik
tags:
  - self-hosted
  - proxy
  - traefik
---
Buongiorno,\
oggi parleremo da [Traefik](https://doc.traefik.io/traefik/), un HTTP reverse proxy e load balancer.

![architettura](https://doc.traefik.io/traefik/v1.7/img/architecture.png)

Io lo sto utilizzando per rendere accessibili dall'esterno dei servizi hostati sul mio nas, come ad esempio Home Assistant e l'ottimo password manager Bitwarden (di cui probabilmente parlerò su questo blog). \
Si integra perfettamente con docker, è infatti in grado di leggere automaticamente le impostazioni da un container tramite label.\
Vediamo ora come installarlo proprio tramite docker, più precisamente utilizzando docker-compose per semplificare le cose.

Per prima cosa scriviamo il file di configurazione. Ci sono vari modi per configurare Traefik, via argomenti da linea di comando o via file traefik.yml, che è la strada che ho scelto io perché mi sembra più chiara. Ho commentato direttamente nel file le parti "meno" importanti.

```yaml
---

global:
  # Verifica la presenza di nuove versioni.
  checkNewVersion: true

entryPoints:
  http:
    address: :80
    forwardedHeaders:
      insecure: true
    proxyProtocol:
      insecure: true
  https:
    address: :443
    forwardedHeaders:
      insecure: true
    proxyProtocol:
      insecure: true

providers:
  docker:
    watch: true
    exposedByDefault: false
    endpoint: "unix:///var/run/docker.sock"
  file:
    directory: "/etc/traefik/dynamic/"
    watch: true
    
api:
  # Visualizza l'interfaccia web della dashboard e permetti connessioni non sicure.
  dashboard: true
  insecure: true
 
# Salva il log nel percorso specificato, con livello DEBUG.
# Ovviamente una volta impostato e verificato il corretto funzionamento si può abbassare il livello.
log:
  filePath: "/shared/logs/traefik/traefik.log"
  level: DEBUG

# Salva il log delle chiamate nel percorso specificato.
# E' possibile specificare dei filtri, nel mio caso solo le chiamate con condici di errore.
accessLog:
  filePath: "/shared/logs/traefik/access.log"
  filters:
    statusCodes: ["400-599"]

# Let's encrypt configuration
certificatesResolvers:
  le:
    acme:
      email: <email>
      storage: /etc/traefik/acme/acme.json
      tlschallenge: true
```

Per prima cosa vengono definiti gli entry points sono i punti di ingresso che può accettare il nostro proxy.\
Io mi attendo delle connessioni dalla porta 80 e 443, è possibile aggiungere molte altre opzioni, ma per questo approfondimento vi rimando alla guida ufficiale.\
I providers sono le risorse da cui è possibile accettare le configurazioni dinamiche, ossia i servizi, le routers e i middlewares.

* docker: permette di creare delle configurazioni tramite le labels di un container.

  * watch: true indica a traefik di rimanere in ascolto di modifiche sui containers, così non sarà necessario riavviare il server ad ogni modifica.
  * exposedByDefault: false, bisogna specificare in un container se esporlo a traefik, altrimenti per ogni nuovo container in esecuzione verrà creato un servizio.
  * endpoint: "unix:///var/run/docker.sock" il percorso del sock di docker per permettere la comunicazione con esso. Nel nostro caso sarà l'istanza di docker installata sul sistema host, come vedremo in seguito.
* file: permette di creare le configurazioni tramite file o files yaml o toml.

  * directory: "/etc/traefik/dynamic/" ho optato per indicare una cartella in modo da poter suddividere in modo più ordinato le impostazioni. E' possibili anche indicare un singolo file tramite l'impostazione `filename`.
  * watch: true come sopra.

L'altra parte molto importante del file è `certificatesResolvers`, cioè il modo in cui risolvere i certificati SSL. \
Nel mio caso utilizzo Let's Encrypt, un servizio gratuito che permette la generazione di certificati. Traefik integra già tutto il funzionamento basta utilizzare come provider `acme`. Le altre impostazioni sono molto semplici, una email valida per ricevere avvisi di scadenza dei certificati e il percorso dove salvare gli stessi.

Definita la configurazione base possiamo passare alla creazione del file docker-compose.yml per la creazione del container.

```yaml
version: "3"

networks:
  trproxy:
    driver: bridge

services:
  traefik:
    container_name: traefik
    image: traefik:latest
    restart: unless-stopped
    networks:
      - trproxy
    environment:
      - TZ:"Europe/Rome"
    ports:
      - 8080:8080
      - 80:80
      - 443:443
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - <dir>/traefik.yml:/etc/traefik/traefik.yml:ro
      - <dir>/dynamic:/etc/traefik/dynamic/:ro
      - <dir>/acme/acme.json:/etc/traefik/acme/acme.json
      - <dir>/shared:/shared
```

Per prima cosa viene definita la connessione, verrà utilizzata dai containers che vogliono collegarsi a traeik.\
Le tre porte esposte sono:

* 8080 dedicata alla dashboard
* 80 per le connessioni non sicure
* 443 per le connessioni sicure

I volumi invece:

* /var/run/docker.sock percorso sock docker installato sull'host

Scritto il file `docker-compose.yml` lanciamo il servizio con `docker-compose up -d`. In base alla connessione e potenza della macchina host ci può volere anche qualche minuto. Quando sarà tutto finito potrete raggiungere la dashboard da browser tramite http:\<ip della macchina su cui lo avete installato>:8080.\
Saranno già presenti un paio di servizi, tranquilli sono quelli interni che vengono creati dal proxy.

Con questo la piccola guida è finita.\
Spero di esservi stato utile.