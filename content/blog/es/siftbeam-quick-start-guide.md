---
slug: siftbeam-quick-start-guide
title: "Cómo usar siftbeam: Guía completa del flujo de servicio"
description: "Aprenda el flujo completo del procesamiento de datos con siftbeam, explicado de manera fácil de entender para principiantes. Guía paso a paso desde la creación de cuenta hasta la configuración de políticas, creación de grupos, procesamiento de archivos y descarga de resultados."
author: Equipo editorial de siftbeam
publishedAt: 2025-01-16
category: tutorial
tags:
  - Tutorial
  - Modo de uso
  - Guía para principiantes
  - Guía completa
  - Procesamiento de datos
readingTime: 15 min
---

# Cómo usar siftbeam: Guía completa del flujo de servicio

## Tabla de contenidos

1. [Lo que aprenderá](#lo-que-aprenderá)
2. [Descripción general del flujo de servicio](#descripción-general-del-flujo-de-servicio)
3. [Requisitos previos](#requisitos-previos)
4. [Paso 1: Creación de cuenta y registro de empresa](#paso-1-creación-de-cuenta-y-registro-de-empresa)
5. [Paso 2: Solicitar política mediante nuevo pedido](#paso-2-solicitar-política-mediante-nuevo-pedido)
6. [Paso 3: Crear grupos](#paso-3-crear-grupos)
7. [Paso 4: Procesar archivos en la página de servicio](#paso-4-procesar-archivos-en-la-página-de-servicio)
8. [Paso 5: Revisar y descargar resultados](#paso-5-revisar-y-descargar-resultados)
9. [Próximos pasos](#próximos-pasos)

## Lo que aprenderá

Al leer este artículo, podrá:

- ✅ Comprender el flujo completo del servicio siftbeam
- ✅ Crear una cuenta y registrar información de la empresa
- ✅ Solicitar una política (configuración de procesamiento) mediante un nuevo pedido
- ✅ Crear grupos y vincular usuarios con políticas
- ✅ Cargar archivos y ejecutar el procesamiento en la página de servicio
- ✅ Revisar y descargar resultados del procesamiento

**Tiempo requerido**: La configuración inicial toma varios días a 1 semana (incluida la consulta de política), el procesamiento posterior toma minutos

**Dificultad**: ★★☆☆☆ (Apto para principiantes)

## Descripción general del flujo de servicio

siftbeam es un servicio B2B que proporciona procesamiento de datos personalizado para cada empresa. El flujo para comenzar a usar el servicio es el siguiente:

```
1. Creación de cuenta y registro de empresa
   ↓
2. Solicitar política (configuración de procesamiento) mediante nuevo pedido
   ↓
3. Política completada (configurada por nuestro equipo)
   ↓
4. Crear grupos (vincular usuarios con políticas)
   ↓
5. Cargar archivos y procesar en la página de servicio
   ↓
6. Descargar resultados del procesamiento
```

**Puntos clave**:
- La característica clave de siftbeam es la "personalización por cliente"
- La configuración inicial requiere consulta de política (configuración de procesamiento)
- Una vez configurada la política, puede procesar datos repetidamente

## Requisitos previos

Antes de comenzar, prepare lo siguiente:

### Elementos necesarios

- **Dirección de correo electrónico**: Utilizada para el registro de cuenta
- **Información de la empresa**: Nombre de la empresa, dirección y otra información básica
- **Archivos de datos para procesar**: CSV, JSON, Excel, etc. (como archivos de muestra)

### Entorno recomendado

- **Navegador**: Chrome, Firefox, Safari, Edge (última versión)
- **Conexión a Internet**: Entorno de conexión estable

## Paso 1: Creación de cuenta y registro de empresa

### 1-1. Registro

Visite la [página de registro de siftbeam](https://siftbeam.com/es/signup/auth).

**Información requerida**:
- **Dirección de correo electrónico**: Dirección de correo electrónico empresarial
- **Contraseña**: 8 caracteres o más, incluyendo letras, números y símbolos

Después de la verificación por correo electrónico, será redirigido a la pantalla de inicio de sesión.

### 1-2. Registrar información de la empresa

El registro de información de la empresa es requerido en el primer inicio de sesión.

**Campos obligatorios**:
- Nombre de la empresa
- País
- Código postal
- Estado/Provincia
- Ciudad
- Dirección línea 1
- Número de teléfono
- Correo electrónico de facturación

**Campos opcionales**:
- Dirección línea 2 (Nombre del edificio, número de habitación, etc.)

### 1-3. Crear cuenta de administrador

Después de registrar la información de la empresa, cree una cuenta de administrador.

- Nombre
- Dirección de correo electrónico
- Contraseña

La creación de cuenta ahora está completa. Puede acceder al panel de control.

## Paso 2: Solicitar política mediante nuevo pedido

Una política define "qué tipo de procesamiento de datos realizar". Dado que siftbeam proporciona procesamiento personalizado para cada cliente, primero debe solicitar una consulta de política.

### 2-1. Navegar a la página Nuevo pedido

1. Haga clic en "Nuevo pedido" en el panel de control
2. Haga clic en el botón "Crear"

### 2-2. Solicitar configuración de procesamiento

Complete la siguiente información en el formulario de nuevo pedido:

**Campos obligatorios**:
- **Tipo de datos**: Seleccione entre Datos estructurados, Datos no estructurados, Mixto u Otro
- **Tipo de modelo**: Seleccione entre Clasificación, Regresión, Agrupamiento u Otro
- **Asunto**: Breve descripción de las necesidades de procesamiento
- **Detalles**: Descripción específica del procesamiento de datos requerido

**Ejemplo**:
```
Tipo de datos: Datos estructurados
Tipo de modelo: Clasificación
Asunto: Transformación de datos de archivo CSV

Detalles:
- Entrada: CSV de datos de clientes (nombre, dirección, número de teléfono, etc.)
- Procesamiento: Normalización de direcciones, estandarización de formato de números de teléfono
- Salida: Archivo CSV formateado
- Frecuencia: Aproximadamente una vez por semana
- Volumen de datos: Aproximadamente 10,000 registros por lote
```

### 2-3. Adjuntar archivos de muestra (Opcional)

Adjuntar archivos de muestra de los datos que desea procesar permite estimaciones más precisas.

- Máximo 10 archivos
- Hasta 50 MB por archivo

### 2-4. Enviar y revisar

Después de enviar el formulario, nuestro equipo revisará el contenido y:

1. **Confirmar requisitos de procesamiento**: Escucha de necesidades
2. **Proporcionar estimación**: Costos aproximados de procesamiento
3. **Crear política**: Configurar flujo de procesamiento
4. **Ejecución de prueba**: Verificar operación con datos de muestra

**Tiempo requerido**: Generalmente 2-5 días hábiles

### 2-5. Política completada

Una vez que nuestro equipo crea y completa la configuración de la política, el estado del nuevo pedido se actualizará. Puede verificar el progreso en la página "Nuevo pedido" del panel de control.

Una vez completada la política, puede proceder al siguiente paso.

## Paso 3: Crear grupos

Una vez completada la política, cree grupos. Los grupos son un mecanismo para gestionar "qué usuarios pueden usar qué políticas".

### 3-1. Navegar a la página Gestión de grupos

1. Haga clic en "Gestión de grupos" en el panel de control
2. Haga clic en el botón "Crear"

### 3-2. Ingresar información del grupo

**Campos obligatorios**:
- **Nombre del grupo**: Establezca un nombre fácil de entender (por ejemplo, Departamento de ventas, Equipo de análisis de datos)
- **Descripción**: Propósito o uso del grupo (opcional)

### 3-3. Seleccionar políticas

Seleccione las políticas que este grupo usará de las políticas creadas.

- Se pueden seleccionar múltiples políticas
- Se pueden agregar o eliminar posteriormente

### 3-4. Agregar usuarios

Agregue usuarios que pertenecerán al grupo.

**Método 1: Agregar usuarios existentes**
- Seleccione usuarios ya creados en Gestión de usuarios

**Método 2: Crear y agregar nuevos usuarios**
- Ingrese nombre y dirección de correo electrónico
- Se enviará un correo electrónico de invitación

### 3-5. Creación de grupo completada

Una vez que cree el grupo, los usuarios miembros pueden procesar datos usando las políticas seleccionadas.

## Paso 4: Procesar archivos en la página de servicio

Una vez completada la configuración del grupo, puede ejecutar el procesamiento de datos.

### 4-1. Acceder a la página de servicio

1. Haga clic en "Servicio" en el panel de control
2. Seleccione la política a usar

### 4-2. Cargar archivos

**Método 1: Arrastrar y soltar**
- Arrastre y suelte archivos en el área de carga

**Método 2: Selección de archivos**
- Haga clic en "Seleccionar archivos" y elija del explorador de archivos

**Límites**:
- Máximo 10 archivos
- Recomendado 100 MB o menos por archivo
- Formatos compatibles: Formatos configurados en la política

### 4-3. Iniciar procesamiento

1. Una vez cargados los archivos, haga clic en el botón "Iniciar procesamiento"
2. El procesamiento comienza automáticamente

### 4-4. Monitorear estado del procesamiento

Puede verificar el estado del procesamiento:

- **Estado**: "En proceso", "Completado", "Error"
- **Tiempo de procesamiento**: Tiempo transcurrido desde el inicio del procesamiento
- **Información del archivo**: Nombre del archivo, tamaño

**Tiempo estimado**:
- Varía según el volumen de datos y el contenido del procesamiento
- Generalmente algunos segundos a minutos

### 4-5. Procesamiento en segundo plano

Durante el procesamiento, puede:

- ✅ Cargar otros archivos
- ✅ Verificar historial de procesamiento pasado
- ✅ Cerrar la pantalla (el procesamiento continúa)

## Paso 5: Revisar y descargar resultados

Una vez completado el procesamiento, revise y descargue los resultados.

### 5-1. Verificar historial de procesamiento

Puede verificar el historial de procesamiento en la página de servicio o el panel de control.

**Información mostrada**:
- **Estado**: Procesamiento completado, En proceso, Error
- **Fecha/Hora de procesamiento**: Fecha y hora de ejecución del procesamiento
- **Nombre del archivo**: Nombre del archivo procesado
- **Tiempo de procesamiento**: Tiempo tomado para el procesamiento
- **Volumen de datos**: Tamaño de los datos procesados

### 5-2. Descargar resultados

Puede descargar archivos completados con los siguientes pasos:

1. Seleccione el archivo objetivo del historial de procesamiento
2. Haga clic en el botón "Descargar"
3. El archivo se descarga automáticamente

**Archivos descargables**:
- **Archivo de entrada**: Archivo original cargado
- **Archivo de salida**: Archivo después del procesamiento

### 5-3. Período de retención de datos

- **Período de retención**: 1 año desde la carga
- **Eliminación automática**: Eliminado automáticamente después de 1 año
- **Re-descarga**: Se puede descargar múltiples veces durante el período de retención

**Importante**: 
Siempre haga copias de seguridad de los datos necesarios localmente.

### 5-4. En caso de errores de procesamiento

Si ocurre un error, verifique lo siguiente:

1. **Verificar mensaje de error**: Identificar la causa
2. **Verificar formato de archivo**: ¿Es el formato especificado en la política?
3. **Verificar tamaño de archivo**: ¿Está dentro de los límites?
4. **Contactar soporte**: Si no se resuelve, contacte al soporte por chat

## Preguntas frecuentes

Para información más detallada y respuestas a preguntas comunes, visite nuestra [página de preguntas frecuentes](https://siftbeam.com/es/faq).

Los temas cubiertos incluyen:
- Seguridad y protección de datos
- Precios y facturación
- Formatos de archivo compatibles
- Sistema de soporte
- Funciones adicionales

Y mucho más.

## Próximos pasos

### Para un uso más avanzado

Una vez que comprenda los conceptos básicos de siftbeam, proceda a los siguientes pasos:

#### 1. Gestión de usuarios

- Agregar miembros del equipo
- Controlar acceso con configuración de permisos
- Crear grupos por departamento

#### 2. Integración de API

- Emitir claves de API
- Crear scripts de automatización
- Integrar con sistemas existentes

#### 3. Configurar procesamiento programado

- Configurar procesamiento programado
- Configurar cargas automáticas
- Crear informes periódicos

#### 4. Configuración avanzada

- Consultar sobre flujos de procesamiento personalizados
- Optimizar para grandes volúmenes de datos
- Reforzar configuración de seguridad

### Si encuentra problemas

Si surgen problemas, use los siguientes recursos:

- **FAQ**: Consulte soluciones en la [página de preguntas frecuentes](https://siftbeam.com/es/faq)
- **Consulta de soporte**: Envíe consultas desde Soporte en su panel de control
- **Tiempo de respuesta**: Normalmente responde en 3 días hábiles

## Resumen

Este artículo explicó el flujo completo del procesamiento de datos con siftbeam:

1. ✅ **Creación de cuenta y registro de empresa**: Registro con correo electrónico y contraseña, ingreso de información de la empresa
2. ✅ **Solicitar política mediante nuevo pedido**: Consultar a nuestro equipo sobre el procesamiento de datos requerido
3. ✅ **Crear grupos**: Vincular usuarios con políticas para preparar el uso
4. ✅ **Procesar archivos en la página de servicio**: Cargar archivos, ejecutar procesamiento, monitorear estado
5. ✅ **Revisar y descargar resultados**: Verificar historial, descargar archivos de resultados

siftbeam es un servicio de procesamiento de datos personalizable para empresas. Optimice el procesamiento de datos de su empresa con flujos de trabajo adaptados a cada cliente.

### Comience ahora

Cuando esté listo, comience con siftbeam hoy.

[Comenzar con siftbeam](https://siftbeam.com/es/signup/auth)

---

**¿Le fue útil este artículo?** Esperamos sus comentarios.

