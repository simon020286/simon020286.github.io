---
title: Traefik - Middlewares
draft: false
date: 2020-11-12T14:44:54.748Z
description: Creare i meddlewares base per Traefik
tags:
  - self-hosted
  - Traefik
  - Middlewares
---
Buongiorno a tutti,\
oggi vedremo come creare i primi e più semplici middlewares per Traefik.\
Cosa è un middleware? \
Semplificando molto è qualcosa che si frappone tra la chiamata e il servizio finale o viceversa.

![middlwares](https://doc.traefik.io/traefik/assets/img/middleware/overview.png "Esempio middlewares Traefik")

Nella mia configurazione ho creato tre middlewares che trovo molto utili. Per crearli basta creare un file all'interno della cartella dynamic vista nel primo articolo dedicato a Traefik ([lo trovate qui](/posts/2020-11-04-traefik-intro/)). \
E' anche possibile crearli tramite label dei container, utile se è specifico per un determinato servizio.

1. Redirect to https, abbastanza semplice da capire, effettua il redirect delle chiamate verso lo schema specificato. Nel mio caso tutte verso https.

   ```yaml
   ---

   http:
     middlewares:
       redirect-to-https:
         redirectScheme:
           scheme: https
   ```


2. Basic auth, utile per redendere un po' più sicuro un endpoint aggiungendo un'autenticazione.\
   E' possibile specificare l'elenco di coppie username: password, la password deve essere criptata tramite MD5, SHA1, o BCrypt, per fare questo è possibile utilizzare su sistemi Linux `htpasswd`. E' anche possibile specificare il path di un file contenente gli utenti, sempre nello stesso formato, tramite l'attributo `usersFile `al posto di `users`.

   ```yaml
   ---

   http:
     middlewares:
       basic-auth:
         basicAuth:
           users:
             - "<username>:<password>"
   ```
3. Compressione della risposta, credo sia uno dei più importanti per limitare il consumo di banda. Comprime le risposte limitando appunto i dati scambiati.

   ```yaml
   ---

   http:
     middlewares:
       gzip-compress:
         compress: {}
   ```

Per utilizzare un middleware basta specificarlo nella configurazione della route.

```yaml
# Se utilizzate un file come impostazione.
http:
  routers:
    nome-route:
      middlewares:
        - gzip-compress
        - redirect-to-https
        
        
# Se utilizzate le labels di un container come impostazione.
traefik.http.routers.nome-route.middlewares: gzip-compress@file, redirect-to-https@file
```

Spero di esservi stato utile e rimango sempre a disposizione per aiutarvi.