---
title: Risolvere problemi di boot da SSD su Raspberry Pi4
draft: false
date: 2021-04-14T15:11:49.354Z
description: Come risolvere uno dei problemi di boot da USB 3 con adattatore SATA to USB
tags:
  - raspberrypi
  - ssd
  - bootusb
---
Buongiorno a tutti,\
recentemente ho comprato un Raspberry Pi 4 8GB di Ram da utilizzare come pc per la famiglia, collegato alla tv, in modo da poter navigare comodamente su internet, editare qualche documento, stampare ecc. ecc. insomma un utilizzo saltuario e che non richiede requisiti hardware eccessivi.

Per migliorare un po' l'esperienza d'uso ho deciso di utilizzare come archivio primario un SSD Kingston da 240GB comprato per poche decine di euro su Amazon. Il boot e l'esperienza generale sarebbe stata molto più veloce e fluida.\
Ovviamente, come capita sempre a me, non potevano che esserci dei problemi, infatti seguendo tutte le guide disponibili online non c'era verso di avviare qualsiasi sistema dalla porta USB3, ma solo dalla USB2, perdendo così parte del vantaggio dell'utilizzo dell'SSD.\
Indagando un po' ho scoperto che la causa è il controllore utilizzato dall'adattatore, nel mio caso un JMicron, ma capita la causa non riuscivo a trovare nessuna soluzione, quando oramai mi stavo per arrendere mi sono imbattuto in questo articolo.\
<https://www.raspberrypi.org/forums/viewtopic.php?t=245931>

In pratica per far funzionare correttamente l'SSD è sufficiente aprire un terminale e dare `lsusb` dopo aver collegato l'SSD, se non avete modo di utilizzare il raspberry avviandolo da scheda di memoria, basta collegare l'SSD a una delle porte USB2.

![lsusb](https://res.cloudinary.com/drg2utgxr/image/upload/v1618490056/posts/risolvere-problemi-di-boot-da-ssd-su-raspberry-pi4%20/2021-04-14_17-28_hcttky.png "Terminale")

Ora basta aggiungere all'inizio del file `/boot/cmdline.txt`, ovviamente quello che risiede sull'SSD, la seguente stringa `usb-storage.quirks=aaaa:bbbb:u`, dove aaaa:bbbb è l'id trovato in precedenza.

Riavviate il raspberry con l'SSD collegato a una posta USB3 e godetevi il sistema alla massima velocità.