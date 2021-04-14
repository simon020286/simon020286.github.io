---
title: Risolvere problemi di boot da SSD su Raspberry Pi4
draft: true
date: 2021-04-14T15:11:49.354Z
description: Come risolvere uno dei problemi di boot da USB 3 con adattatore SATA to USB
tags:
  - raspberrypi
  - ssd
  - bootusb
---
Buongiorno a tutti,\
recentemente ho comprato un Raspberry Pi 4 8GB di Ram da utilizzare com pc per la famiglia, collegato alla tv, in modo da poter navigare comodamente su internet, editare qualche documente, stampare ecc. ecc. insomma un utilizzo saltuario e che non richiede requisiti hardware eccessivi.

Per migliorare un po' l'esperienza d'uso ho deciso di utilizzare come archivio primario un SSD Kingston da 240GB comprato per poche decine di euro su Amazon. Il boot e l'esperienza generale sarà molto più veloce e fluida.\
Ovviamente, come capita sempre a me, non potevano che esserci dei problemi, infatti seguanto tutte le guide disponibili online non c'era verso di avviare qualsiasi sistema dalla porta USB3, ma solo dalla USB2, perdendo così parte del vantaggio dell'utilizzo dell'SSD.\
Indaganto un po' ho scoperto che la causa è il controllore utilizzata dall'adattatore, nel mio caso un JMicron, ma capita la causa non riuscivo a trovare nessuna soluzione, quando oramai mi stavo per arrendere mi sono imbattuto in questo articolo.\
<https://www.raspberrypi.org/forums/viewtopic.php?t=245931>

In pratica per far funzionare correttamente l'SSD è sufficiente aprire un terminale e dare