---
title: Bitwarden
draft: true
date: 2020-11-12T13:32:39.017Z
description: Tutorial per installare Bitwarden tramite docker dietro reverse proxy Traefik
tags:
  - self-hosted
  - passwordmanage
  - bitwarden
  - traefik
---
```yaml
version: "3"
 
networks: 
  traefik_network: 
    external: 
      name: traefik_trproxy
services: 
  bitwarden:
    image: "bitwardenrs/server:raspberry"
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