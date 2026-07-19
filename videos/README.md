# Carpeta de videos

Los 6 videos de la exposición (introducción, tipos de consistencia, caso real, mejora con IA, ventajas
de la IA y conclusión) NO van en esta carpeta: se reproducen directamente desde Google Drive mediante
un `<iframe>` embebido en cada sección de `index.html`, para evitar que YouTube los elimine.

Si necesitas cambiar el enlace de alguno de esos videos, busca en `index.html` la línea con:
```
<iframe src="https://drive.google.com/file/d/TU_ID_AQUI/preview" ...>
```
y reemplaza `TU_ID_AQUI` por el ID del archivo de tu Google Drive (la parte de la URL entre `/d/` y
`/view`). Asegúrate también de que el archivo en Drive tenga permisos de "Cualquier persona con el
enlace puede ver", o el video no cargará para quien visite la página.

Esta carpeta actualmente no se usa para ningún archivo local (el video del pseudocódigo se quitó de
la página porque no hay nadie asignado a presentarlo). Si más adelante agregan ese video, pueden
colocarlo aquí y volver a agregar su sección en `index.html`.
