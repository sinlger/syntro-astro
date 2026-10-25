---
title: "Importar contactos VCF en Outlook: 3 versiones"
description: "El Outlook clásico lee los .vcf, el nuevo y la web solo aceptan CSV, y el de Mac no importa en lote. Guía por versión, con pasos y atascos típicos."
pubDate: 2026-10-25
topic: "import-vcf-outlook"
author: "Equipo Excel2VCF"
tags: ["VCF a Outlook", "Importar contactos", "CSV", "Tutorial"]
---

Te llega un `.vcf` por correo, lo abres y aparece una sola persona. O lo importas en Outlook y de los ochenta contactos del archivo entra uno. O te has pasado al nuevo Outlook y el menú para importar vCard ya no existe. Tres síntomas del mismo problema: **no todas las versiones de Outlook tratan igual un archivo vCard**.

El VCF (vCard) es un formato de intercambio, no de trabajo, y Outlook lo acepta según el programa. Identifica tu versión antes de tocar nada; si no admite VCF, el camino CSV de abajo funciona en las cuatro.

## Antes de nada: qué versión de Outlook tienes

- **Outlook clásico (Windows de escritorio)**: la barra de título dice «Outlook (clásico)» y arriba a la izquierda aparece `Archivo` con `Abrir y exportar`. Es el único de Windows que abre un `.vcf`.
- **Nuevo Outlook**: en el menú Inicio figura como «Outlook (nuevo)», navega con una barra de iconos y no tiene menú `Archivo`; los ajustes están en el engranaje superior derecho.
- **Outlook en la web / Microsoft 365**: la URL es `outlook.office.com` u `outlook.live.com`; todo ocurre en el navegador, con los contactos en `Personas`.
- **Outlook para Mac**: el menú superior es `Outlook`, `Archivo`, `Editar`; la importación vive dentro de `Archivo`.

## Outlook clásico: importar un VCF

1. `Archivo` → `Abrir y exportar` → `Importar/exportar`.
2. Elige `Importar de otro programa o archivo` y pulsa `Siguiente`.
3. En el tipo de archivo, selecciona `Archivo vCard (.vcf)` y `Siguiente`.
4. Busca el `.vcf`, elige la carpeta `Contactos` como destino y termina con `Finalizar`.

Aquí está el detalle que arruina la tarde: **en muchas versiones del importador clásico, un `.vcf` con varios contactos solo aporta el primero**. El comportamiento cambia según la compilación —unas leen todas las tarjetas, otras solo la primera— y la documentación oficial no aclara el VCF multicontacto.

Si aun así quieres ir por aquí, abre el `.vcf` con el Bloc de notas y separa los bloques entre `BEGIN:VCARD` y `END:VCARD` en archivos individuales. Cuando la tabla esté limpia y quieras volver a tener un solo VCF con todos, el proceso de [unir varios archivos VCF](/es/blog/unir-archivos-vcf/) es ese.

## Nuevo Outlook y Outlook en la web: usa CSV

Ninguna de las dos importa vCard; la única vía oficial es un CSV.

En el nuevo Outlook: barra de navegación → `Personas` → en la cinta, `Importar contactos` (a veces, `Administrar contactos` → `Importar contactos`) → `Examinar` → `Importar`.

En Outlook en la web o Microsoft 365: `Personas` → `Administrar contactos` → `Importar contactos` → `Examinar` → `Importar`.

Ambas avisan de lo mismo: **el CSV debe estar en UTF-8**; si el texto de la vista previa sale mal, hay que cancelar y convertir de nuevo. El trabajo real no es encontrar el botón, sino llegar con un CSV bien codificado y con columnas que Outlook reconozca.

Cuatro pasos con la herramienta del sitio:

1. Abre el [convertidor de VCF a Excel](/es/vCard-to-Excel/); no hay nada que instalar.
2. Selecciona varios `.vcf` a la vez: se analizan y se unen en una sola tabla, así que procesas de una vez varias copias del móvil.
3. Revisa la vista previa: nombre, teléfono, correo, empresa, cargo, dirección y notas en su columna, con los repetidos a la vista.
4. Elige la salida: **CSV** para Outlook (lleva BOM UTF-8, así nadie convierte las tildes en símbolos) o **Excel (.xlsx)** si quieres limpiar antes.

La conversión ocurre en el navegador: los archivos no se suben a ningún servidor y puedes usarla con agendas de clientes sin exponerlas. Con el CSV en la mano, impórtalo por la ruta de arriba.

## Outlook para Mac

Mac es el caso más ambiguo y el que más se presta a copiar mal la receta de Windows. La documentación oficial confirma que un `.vcf` se importa con doble clic en el archivo o en los datos adjuntos. Pero **si la vCard contiene varios contactos, la ventana solo muestra el primero; el resto se guarda por separado, uno a uno**.

La misma página añade que Outlook para Mac **no admite la importación masiva de varios archivos vCard ni de archivos CSV**: justo lo contrario que en Windows, donde el nuevo Outlook al menos acepta CSV. En versiones anteriores (2016 y 2019 para Mac) existía `Archivo` → `Importar` → «Contactos u otros elementos de un archivo vCard», de uno en uno. Con pocos contactos basta el doble clic; con muchos, convierte a tabla y trabaja desde ahí o desde un equipo Windows.

## Problemas habituales al importar

- **Duplicados**: el asistente clásico permite reemplazar, permitir o descartar repetidos; el nuevo Outlook y la web no, así que despégalos en la tabla antes.
- **Campos vacíos o descolocados**: el CSV se empareja por el nombre de la columna. Con `First Name`, `Last Name`, `E-mail Address` y `Mobile Phone` aciertas casi siempre.
- **Acentos raros**: es codificación. El CSV de la herramienta lleva BOM; si viene de otro sitio, ábrelo con `Datos` → `Desde texto/CSV` y elige `65001: Unicode (UTF-8)`.
- **La empresa no aparece**: Outlook separa «Empresa» y «Departamento»; una sola columna de empresa puede perderse. Prepara `Company` y `Department`.
- **Todo cae en una columna**: algunos Excel guardan el CSV con punto y coma y Outlook espera comas. Vuelve a exportar con coma.

## Preguntas frecuentes

**¿Puedo importar un VCF con varios contactos de una vez?**
Depende de la versión: el clásico suele quedarse con el primero, el nuevo y la web no aceptan VCF, y el de Mac guarda todos pero muestra uno. Lo más rápido es pasar a CSV.

**¿La conversión sube los archivos a un servidor?**
No. Todo se procesa en el navegador: el `.vcf` no sale de tu equipo y funciona sin conexión.

**¿Puedo recuperar un VCF después de importar?**
En el clásico, sí: `Archivo` → `Abrir y exportar` → `Importar/exportar` → `Exportar a un archivo` → `Archivo vCard`. El nuevo Outlook y la web solo exportan CSV; si necesitas `.vcf`, pasa la tabla por el [conversor de Excel a VCF](/es/Excel-to-vCard/).

**¿Por qué recomiendas CSV y no el VCF original?**
Porque de los cuatro entornos solo uno acepta VCF y su soporte multicontacto es irregular. El CSV se revisa columna por columna, permite quitar duplicados y corregir encabezados, y si algo falla sabes qué columna lo causó.

## Conclusión

El atasco casi nunca está en el clic sino en la versión: el clásico reconoce VCF pero a menudo solo se queda con el primer contacto, el nuevo y la web solo aceptan CSV, y el de Mac no hace importaciones en lote. La única ruta que vale en todas es **convertir primero el VCF en una tabla limpia y dejar que Outlook importe el CSV**. Abre el [convertidor de VCF a Excel](/es/vCard-to-Excel/), suelta los archivos y lleva el CSV a Outlook.
