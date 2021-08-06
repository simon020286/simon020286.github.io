---
title: Visual Studio Code - Docker
draft: false
date: 2021-08-06T09:02:15.620Z
description: Sviluppare con Visual Studio Code all'interno di un container Docker
tags:
  - visual studio code
  - ide
  - docker
---
Ciao a tutti,\
oggi vi mostro il mio ambiente di sviluppo, programmi, linguaggi e tools che utilizzo.\
Per prima cosa come IDE (Integrated development environment) utilizzo l'ottimo Visual Studio Code di Microsoft.\
Trovate tutte le informazioni [qui](https://code.visualstudio.com/).\
In breve è un software multi-piattaforma, infatti lo trovate per Windows, MacOS e Linux, integra il controllo della versione del codice tramite git, esistono un'infinità di estensioni per facilitare lo sviluppo.

![visual studio code](https://res.cloudinary.com/drg2utgxr/image/upload/v1611249440/posts/vcode/home-screenshot-win-lg_vzx2kh.png "Visual Studio Code")

Grazie alle tantissime estensioni disponibili è possibile programmare in qualsiasi linguaggio, ma in questo articolo vedremo come sviluppare in golang, sfruttando un container docker in cui installare il compilatore e tutto il necessario in modo da non "sporcare" il computer host.

I prerequisti sono pochissimi, aver installato Docker, Visual Studio Code e l'estensione Remote - Containers.
Fatto questo basterà creare la cartella del proprio progetto e al suo interno una cartella chiamata *.devcontainer,*\
all'interno di essa i seguenti file:

*Dockerfile*

```dockerfile
FROM golang:1.16

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
    && apt-get -y install --no-install-recommends apt-utils 2>&1

# Verify git, process tools, lsb-release (common in install instructions for CLIs) installed.
RUN apt-get -y install git iproute2 procps lsb-release

# Install Go tools.
RUN go env -w GO111MODULE=off \
    && apt-get update \
    # Install gocode-gomod.
    && go get -x -d github.com/stamblerre/gocode 2>&1 \
    && go build -o gocode-gomod github.com/stamblerre/gocode \
    && mv gocode-gomod $GOPATH/bin/ \
    # Install other tools.
    && go get -u \
        golang.org/x/tools/gopls \
        github.com/stamblerre/gocode \
        github.com/uudashr/gopkgs/cmd/gopkgs \
        github.com/ramya-rao-a/go-outline \
        github.com/acroca/go-symbols \
        golang.org/x/tools/cmd/guru \
        golang.org/x/tools/cmd/gorename \
        github.com/go-delve/delve/cmd/dlv \
        github.com/stamblerre/gocode \
        github.com/rogpeppe/godef \
        golang.org/x/tools/cmd/goimports 2>&1 \
    # Clean up.
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/* \
    && go env -w GO111MODULE=on

# Revert workaround at top layer.
ENV DEBIAN_FRONTEND=dialog

# Expose service ports.
EXPOSE 8000
```

*devcontainer.json*

```json
{
    "dockerFile": "./Dockerfile",
    "appPort": [
        "8000:8000"
    ],
    "extensions": [
        "golang.go"
    ]
}
```

Fatto questo Visual Studio Code ti chiederà se vuoi aprire il workspace all'interno del container, rispondere di si e attendere che docker crei il container. Probabilmente alla fine del processo vi verrà suggerito di installare alcuni tool di golang, accettate e proseguite.\
Dopo qualche secondo sarà possibile iniziare a sviluppare normalmente.\
La cosa bella di questo processo è che i file che scriverete saranno fisicamente sul sistema host, quindi navigabili e gestibile dal file manager, ma tutte le librerie e eseguibili di go saranno all'interno del container.\
Questo rende più semplice la gestione delle varie versione di golang e delle dipendenze dei propri progetti.\
Ovviamente tutto questo è possibile utilizzarlo per molti linguaggi di programmazione ad esempio Python, Flutter, C# e molti altri.

Spero di avervi aiutato e fatto scoprire qualcosa di nuovo.\
Come al solito contattatemi pure nei commenti se avete bisogno di aiuto.