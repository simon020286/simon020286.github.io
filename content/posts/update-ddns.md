---
title: "Update Ddns"
date: 2020-09-17T16:59:50+02:00
tags: ["bash", "ddns", "self-hosted"]
draft: false
---

Eccoci qui con il primo vero post di questo blog.  
Oggi ci dedicheremo all'aggiornamento automatico dell'ip del proprio server su alcuni servizi DDNS.  
Per fare ciò esistono innumerevoli tool, ma perché utilizzare qualcosa di già fatto quando puoi imparare qualcosa di nuovo?  
In questo periodo mi sto dilettando con gli script bash, quindi ho deciso di seguire questa strada. Il progetto è composto da soli due file, lo script vero e proprio e il file di configurazione, ad essere precisi ce ne sarebbe un terzo, ma viene creato automaticamente dallo script e serve solo per salvare l'ip corrente.  
Come detto nel post di benvenuto, questo non vuole essere un blog di tutorial, ma la condivisione delle mie esperienze, quindi vi illustrerò come aggiornare gli ip sui due servizi che sto utilizzando al momento.  
+ [No-Ip](http://no-ip.com)
+ [Duck DNS](https://www.duckdns.org/)  

No-Ip è stato il primo servizio che ho utilizzato, offre molte opzioni e molti sotto servizi. Nella versione free è possibile registrare solo 3 hostname ed è necessario rinnovarli ogni 30 giorni.  
Duck DNS invece è molto più scarno, permette la registrazione di domini che terminano solo con `.duckdns.org`, ma è possibile registrare fino a 5 nomi e non richiede il rinnovo.  
Passiamo allo script.  
La parte più complicata è parsare il file di configurazione, ma per fortuna, ovviamente, esiste qualcosa di già fatto.
Ho utilizzato il metodo descritto in [questo articolo](https://blog.sleeplessbeastie.eu/2019/11/11/how-to-parse-ini-configuration-file-using-bash/).  
Non sto a spiegare come avviene il parse della configurazione perché non è oggetto di questo post e il tutto viene già spiegato nell'articolo linkato. Proseguiamo quindi con la parte da me creata.

```bash {linenos=true,linenostart=44}
GetINISections $1

DIRECTORY=$(cd `dirname $0` && pwd)

filename="$DIRECTORY/currentip.txt"

if [[ ! -e $filename ]]; then
    touch $filename
fi

oldip=$(cat $filename)
currentip=$(curl -s 'http://ip1.dynupdate.no-ip.com/')

if [ "$2" == "--force" ]; then
  oldip="" 
fi
```

La prima riga dello script va proprio a leggere il file di configurazione, che vedremo in seguito, il cui path viene passato come primo parametro allo script.  
Nelle righe successive viene:  
1) inizializzato il path del file in cui viene salvato l'ultimo ip
1) letto l'ip dal file
1) recuperato l'ip corrente tramite l'api messa a disposizione da no-ip e salvato nella variabile `currentip`
1) se il secondo parametro passato allo script è `--force`, viene svuotato il valore dell'ultimo ip.  
Vedremo in seguito il perché.


### No-Ip
Per questo servizio è necessario utilizzare username e password utilizzati per loggarsi al sito e gli hostname che si vogliono aggiornare.
Questi se più di uno, basta separarli da virgola. E' anche possibile utilizzare i gruppi presenti su no-ip, passando il nome del gruppo verranno aggiornati automaticamente tutti gli hostname che ne fanno parte.

```ini {linenos=true,linenostart=5}
[NoIp]
domains=<NOME_DOMINIO>
username=<USERNAME>
password=<PASSWORD>
```

Nello script bash viene semplicemente chiamata l'api, tramite curl, messa a disposizione da no-ip, passando i dati necessari.
Il metodo effettua la chiamata solo se è presente una dominio per no-ip nel file di configurazione.

```bash {linenos=true,linenostart=61}
updateNoIp() {
  if [ -n "${configuration_noip["domains"]}" ]; then
    domains=${configuration_noip["domains"]}
    username=${configuration_noip["username"]}
    password=${configuration_noip["password"]}
    urlnoip="https://dynupdate.no-ip.com/nic/update?hostname=$domains&myip=$currentip"
    echo $(curl -s --user $username:$password $urlnoip)
  fi
}
```

### DuckDns

Per questo servizio è sufficiente recuperare il token presente nella pagina principale una volta loggati e gli hostname che si vogliono aggiornare.
Trovate un esempio qui sotto.

![Duckdns](https://res.cloudinary.com/drg2utgxr/image/upload/v1600434391/posts/update-ddns/duckdns_01.png)

Recuperati questi dati il file di configurazione va compilato come segue.
Se gli hostname da aggiornare sono più di uno basta scriverli separati da virgola.

```ini {linenos=true}
[DuckDns]
domains=<NOME_DOMINIO>
token=<TOKEN>
```

Anche in questo caso è sufficiente chiamare l'api fornita.

```bash {linenos=true,linenostart=72}
updateDuckDns() {
  if [ -n "${configuration_duckduck["domains"]}" ]; then
    domains=${configuration_duckduck["domains"]}
    token=${configuration_duckduck["token"]}
    urlduckduck="https://www.duckdns.org/update?domains=$domains&token=$token&ip=$currentip"
    echo $(curl -s $urlduckduck)
  fi
}
```

L'ultima parte dello script è la parte che gestisce il tutto.  
Se l'ip letto dal file è diverso da quello attuale vengono chiamate le singole funzioni per i servizi e aggiornato l'ip nel file (rig. 83), altrimenti non viene eseguita nessuna operazione.
Passando allo script come secondo parametro `--force`, come detto in precedenza, viene svuotato il valore di `$oldip` quindi l'aggiornamento verrà fatto indipendentemente dal valore letto dal file.

```bash {linenos=true,linenostart=81}
if [ "$oldip" != "$currentip" ]; then
  updateNoIp
  updateDuckDns
  echo $currentip > $filename
else
  echo 'Not changed'
fi
```

Questo script lo utilizzo sul mio nas di casa su cui girano alcuni servizi accessibili da internet, per richiamarlo l'ho schedulato ogni 30 minuti con cron.  
E con questo è tutto, al momento non utilizzo altri servizi per cui il mio script si ferma qui. Suppongo che funzionino più o meno allo stesso modo, quindi non dovrebbe essere complicato integrarne altri.  
Il codice è disponibile a questo [repository](https://github.com/simon020286/update-ddns) di GitHub, siete liberi di proporre modifiche e aggiunte.

Buon divertimento