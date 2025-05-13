/**
 * @swagger
 * tags:
 *   - name: UserProjects
 *     description: Relación entre usuarios y proyectos
 */

/**
 * @swagger
 * /api/v1/user-projects:
 *   get:
 *     summary: Obtener todos los registros de usuarios en proyectos
 *     tags: [UserProjects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asociaciones usuario-proyecto
 */

/**
 * @swagger
 * /api/v1/user-projects/{id}:
 *   get:
 *     summary: Obtener una relación usuario-proyecto por ID
 *     tags: [UserProjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f1a12b9876a1c23456def0
 *     responses:
 *       200:
 *         description: Asociación encontrada
 *       404:
 *         description: No se encontró la asociación
 */

/**
 * @swagger
 * /api/v1/user-projects:
 *   post:
 *     summary: Crear una nueva relación usuario-proyecto
 *     tags: [UserProjects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - projectId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 64f1a12b9876a1c23456aaa1
 *               projectId:
 *                 type: string
 *                 example: 64f1a12b9876a1c23456bbb2
 *     responses:
 *       201:
 *         description: Asociación creada exitosamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /api/v1/user-projects/{id}:
 *   put:
 *     summary: Actualizar una relación usuario-proyecto
 *     tags: [UserProjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f1a12b9876a1c23456def0
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 64f1a12b9876a1c23456aaa1
 *               projectId:
 *                 type: string
 *                 example: 64f1a12b9876a1c23456ccc3
 *     responses:
 *       200:
 *         description: Asociación actualizada correctamente
 *       404:
 *         description: Asociación no encontrada
 */

/**
 * @swagger
 * /api/v1/user-projects/{id}:
 *   delete:
 *     summary: Eliminar una relación usuario-proyecto
 *     tags: [UserProjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f1a12b9876a1c23456def0
 *     responses:
 *       200:
 *         description: Asociación eliminada correctamente
 *       404:
 *         description: Asociación no encontrada
 */
