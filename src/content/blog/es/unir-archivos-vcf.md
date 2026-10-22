---
title: "Unir varios archivos VCF en uno: 3 métodos"
description: "Varios VCF con contactos repetidos y quieres uno solo. Tres métodos, cuál evita duplicados y cómo lograrlo con un flujo de dos pasos en el navegador."
pubDate: 2026-10-22
topic: "merge-vcf-files"
author: "Equipo Excel2VCF"
tags: ["Unir VCF", "Fusionar contactos", "Quitar duplicados", "Tutorial"]
---

Cambias de móvil y exportas la agenda. Tu CRM te entrega otra lista de clientes en forma de `.vcf`. Un proveedor te manda su tarjeta de visita como archivo adjunto. En dos meses tienes cuatro archivos que se solapan y ninguno contiene la lista completa.

Unirlos parece trivial, pero son dos tareas: reunir todos los contactos en una sola lista y eliminar los duplicados que aparecen cuando la misma persona está en dos exportaciones, una con el móvil y otra con el fijo. Tres métodos —la tabla, la libreta de contactos y el texto concatenado—, con el trabajo manual que exige cada uno.

## Por qué concatenar los VCF no basta

Un VCF es una secuencia de bloques de texto. Cada contacto empieza en `BEGIN:VCARD` y termina en `END:VCARD`, y un mismo archivo puede contener cientos de bloques. Por eso pegar un archivo detrás de otro funciona a medias: el resultado sigue siendo un VCF válido y el móvil lo importa sin protestar.

Lo que no hace es comparar nada. Si Ana Pérez aparece en dos exportaciones, acabarás con dos fichas suyas y tendrás que decidir a mano cuál conservas. Tampoco respeta los límites del archivo: si el último bloque no termina en salto de línea, la unión deja `END:VCARDBEGIN:VCARD` en una sola línea y ningún programa la interpreta. Y un archivo en UTF-8 junto a otro en una codificación heredada basta para que las tildes salgan como símbolos.

## Método 1: fusiona a través de una tabla (recomendado)

Una hoja de cálculo sí sabe comparar filas. La vía fiable es convertir los VCF en una tabla, limpiarla y volver a generar un único VCF. Son dos pasos con dos herramientas; no hay ningún botón de «fusionar» que lo haga todo de golpe.

1. Abre el [convertidor de VCF a Excel](/es/vCard-to-Excel/) y selecciona o arrastra varios `.vcf` a la vez. Los contactos de todos los archivos aparecen juntos en la misma vista previa.
2. Revisa la tabla combinada: cada contacto es una fila y cada campo tiene su columna (nombre, apellidos, teléfonos, correos, empresa, cargo, dirección, notas).
3. Descarga en **XLSX** o **CSV**, abre el archivo y ordena por nombre; después usa `Datos` → `Quitar duplicados` para quedarte con una ficha por persona.
4. Con la tabla limpia, genera un único VCF con la herramienta de [Excel a VCF](/es/Excel-to-vCard/). El archivo descargado contiene todos los contactos en un solo `.vcf`.

Todo ocurre en el navegador y los archivos no se envían a ningún servidor. El analizador entiende vCard 2.1, 3.0 y 4.0, acepta archivos con varios contactos y separa los teléfonos y correos múltiples en columnas distintas. Si exportas en CSV se añade la marca UTF-8 (BOM) para que Excel no rompa los acentos al abrirlo.

## Método 2: fusiona dentro de la libreta de contactos

Si tu destino no es un archivo sino una agenda viva, importa los VCF uno tras otro en la misma libreta y exporta después un único VCF.

- **macOS**: en Contactos, `Archivo` → `Importar` por cada `.vcf`; al final, `Archivo` → `Exportar tarjeta vCard`. En el iPhone, abre cada `.vcf` desde Archivos o usa `icloud.com`.
- **Google Contactos**: en `contacts.google.com`, menú lateral → `Importar`, un archivo cada vez; después `Exportar` → `vCard`.
- **Outlook**: `Archivo` → `Abrir y exportar` → `Importar o exportar` → `Archivo vCard (.vcf)`, repitiendo el asistente por cada archivo.

Funciona, pero es el método más lento. La libreta no compara fichas por ti: como mucho ofrece `Combinar duplicados` (Google) o `Enlazar contactos` (iPhone). Además, al importar se normalizan los campos, así que notas largas, direcciones secundarias y propiedades poco habituales pueden quedar recortadas.

## Método 3: concatena los archivos de texto

Como el VCF es texto plano, también puedes pegar los archivos directamente. En macOS y Linux, desde la terminal:

```
cat agenda1.vcf agenda2.vcf > fusionado.vcf
```

En Windows, con el símbolo del sistema (`copy /b` para no reinterpretar bytes):

```
copy /b agenda1.vcf+agenda2.vcf fusionado.vcf
```

Sin línea de comandos, abre el primer archivo con el Bloc de notas, pega al final el segundo y guarda como `.vcf`. Comprueba que cada archivo termina en salto de línea; si no, añádelo entre bloques.

Es rápido y no depende de ninguna aplicación, pero solo suma: no quita duplicados ni avisa de conflictos, y cualquier error de codificación pasa directo al archivo final. Guárdalo como UTF-8, nunca como ANSI.

## Cómo comprobar y quitar duplicados después de fusionar

Antes de tocar nada, copia los VCF originales: si la fusión sale mal, podrás volver a empezar.

Ordena por apellidos y mira las filas contiguas, porque los duplicados suelen quedar juntos. Para los teléfonos, normaliza antes de comparar: `+34 600 000 000`, `0034 600 000 000` y `600 000 000` son el mismo número escrito de tres maneras. Una columna auxiliar con `CONTAR.SI` sobre el teléfono, o un formato condicional sobre valores repetidos, muestra qué fichas comparten número. Cuando dos filas sean la misma persona, conserva la que tenga más campos rellenos.

Para inspeccionar el VCF resultante, ábrelo con un editor de texto: cada `BEGIN:VCARD` es un contacto. La guía de [cómo abrir un VCF en Excel](/es/blog/abrir-vcf-en-excel/) repasa ese mapeo.

## Preguntas frecuentes

**¿Se pierden campos al pasar por la tabla?**
Los campos habituales —nombre, apellidos, teléfonos, correos, empresa, cargo, dirección, notas y web— tienen su columna. Las propiedades poco frecuentes, como fotos, aniversarios o campos `X-` de una app concreta, pueden no sobrevivir; conserva los originales hasta verificar el resultado.

**¿Puedo importar el VCF fusionado en el móvil?**
Sí. Es un `.vcf` normal con varios bloques `BEGIN:VCARD`, y tanto iOS como Android lo leen como varios contactos: en iPhone, ábrelo desde Archivos; en Android, desde Contactos → `Gestionar` → `Importar`.

**¿Hay un límite de archivos o de contactos?**
No publicamos un número máximo: el límite lo ponen la memoria del navegador y el tamaño de los archivos, así que con decenas de miles de contactos conviene trocear.

**¿Se suben mis contactos a algún servidor?**
No. Tanto la conversión de VCF a tabla como la de tabla a VCF se ejecutan en tu navegador y los archivos no se envían a ningún servidor.

## Conclusión

Unir varios VCF en uno son dos pasos, no un botón: primero reúnes los contactos en una tabla y quitas duplicados, después vuelves a generar el VCF. De los tres métodos, el de la tabla es el único que te permite comparar y limpiar antes de exportar. Empieza cargando todos tus archivos a la vez en el convertidor de VCF a Excel y cierra el círculo pasando la tabla limpia a VCF.
