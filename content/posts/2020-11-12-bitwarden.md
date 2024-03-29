---
title: Bitwarden
draft: false
date: 2020-12-02T10:42:33.662Z
description: Tutorial per installare Bitwarden tramite docker dietro reverse proxy Traefik
tags:
  - self-hosted
  - passwordmanage
  - bitwarden
  - traefik
---
Buongiorno a tutti, eccoci con un nuovo articolo.\
Oggi vedremo come utilizzare un password manager il cui server gira interamente sul tuo host personale.\
Iniziamo col dire che come server non utilizzeremo Bitwarden ufficiale, ma una versione compatibile Bitwarden_Rs, \
scritto in Rust che implementa quasi tutte le API ufficiali. E' molto più leggero, completamente gratuito, e in più utilizza l'app e le estensioni per browser ufficiali. \
Come detto nell'articolo dedicato a Traefik ([link](/posts/2020-11-04-traefik-intro)) è possibile impostare l'utilizzo del reverse proxy tramite labels, come potete vedere nel `docker-compose.yml` seguente.

```yaml
version: "3"
 
networks: 
  traefik_network: 
    external: 
      name: traefik_trproxy
services: 
  bitwarden:
    image: "bitwardenrs/server"
    container_name: bitwarden
    environment: 
      DOMAIN: "https://<dominio>"
      LOG_FILE: /shared/logs/bitwarden/bitwarden.log
      LOG_LEVEL: warn
      ROCKET_LOG: critical
      WEBSOCKET_ENABLED: "true"
      SIGNUPS_ALLOWED: "false"
    labels: 
      traefik.enable: true
      traefik.docker.network: traefik_trproxy
      traefik.http.middlewares.bitwarden-security.headers.browserXssFilter: true
      traefik.http.middlewares.bitwarden-security.headers.contentTypeNosniff: true
      traefik.http.middlewares.bitwarden-security.headers.customResponseHeaders.X-Robots-Tag: noindex,nofollow,nosnippet,noarchive,notranslate,noimageindex
      traefik.http.middlewares.bitwarden-security.headers.forceSTSHeader: true
      traefik.http.middlewares.bitwarden-security.headers.frameDeny: true
      traefik.http.middlewares.bitwarden-security.headers.sslRedirect: true
      traefik.http.middlewares.bitwarden-security.headers.sslHost: <dominio>
      traefik.http.middlewares.bitwarden-security.headers.stsIncludeSubdomains: true
      traefik.http.middlewares.bitwarden-security.headers.stsPreload: true
      traefik.http.middlewares.bitwarden-security.headers.stsSeconds: 315360000
      traefik.http.services.bitwarden.loadbalancer.server.scheme: http
      traefik.http.services.bitwarden.loadbalancer.server.port: 80
      traefik.http.services.bitwarden-ws.loadbalancer.server.port: 3012
      traefik.http.routers.bitwarden-http.service: bitwarden
      traefik.http.routers.bitwarden-http.rule: Host(`<dominio>`)
      traefik.http.routers.bitwarden-http.entrypoints: http
      traefik.http.routers.bitwarden-http.middlewares: bitwarden-security, gzip-compress@file, redirect-to-https@file
      traefik.http.routers.bitwarden.service: bitwarden
      traefik.http.routers.bitwarden.rule: Host(`<dominio>`)
      traefik.http.routers.bitwarden.entrypoints: https
      traefik.http.routers.bitwarden.middlewares: bitwarden-security, gzip-compress@file
      traefik.http.routers.bitwarden.tls: true
      traefik.http.routers.bitwarden.tls.certresolver: le
      traefik.http.routers.bitwarden-ws.service: bitwarden-ws
      traefik.http.routers.bitwarden-ws.rule: Host(`<dominio>`) && Path(`/notifications/hub`)
      traefik.http.routers.bitwarden-ws.entrypoints: https
      traefik.http.routers.bitwarden-ws.middlewares: bitwarden-security
      traefik.http.routers.bitwarden-ws.tls: true
      traefik.http.routers.bitwarden-ws.tls.certresolver: le
    networks: 
      - traefik_network
    restart: unless-stopped
    volumes: 
      - <dir>/data:/data
      - <shared dir>:/shared
```

E' molto importante rispettare alcune regole.

1. il nome della connessione `traefik_network` deve essere lo stesso definito per traefik
2. `LOG_FILE: /shared/logs/bitwarden/bitwarden.log` il path `/shared` deve essere lo stesso mappato nel volume
3. `SIGNUPS_ALLOWED: "false"` al primo avvio bisogna impostarlo a `true`, altrimenti non sarà possibile registrare nessun utente, io l'ho messo a `false` dopo aver creato il mio utente e quello di mia moglie, in modo che nessuno sconosciuto si possa registrare. Siete liberi di lasciarlo a `true`.
4. sostituire `<dominio>` con il vostro dominio

Fatto questo è possibile lanciare il container semplicemente con il comando `docker-compose up -d`.\
Avviato il container sarà possibile procedere alla registrazione del primo utente andato all'url specificato in `<dominio>`.

Buon divertimento con il vostro nuovo password manager.