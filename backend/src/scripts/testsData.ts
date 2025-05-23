import mongoose from "mongoose";
import { Project } from "../models/Project";
import { Task } from "../models/Task";
import { User } from "../models/User";
import { UserProject } from "../models/UserProject";

async function crearDatosDePrueba() {
  await mongoose.connect("mongodb://localhost:27017/taskflow");

  try {
    // 1. Crear usuario
    const user = new User({
      name: "Juan Pérez",
      email: "juan@example.com",
      password: "ClaveSegura123"
    });
    await user.save();

    // 2. Crear proyecto
    const project = new Project({
      name: "Proyecto Demo",
      description: "Proyecto de prueba",
      owner: user._id
    });
    await project.save();

    // 3. Relacionar usuario con proyecto
    const userProject = new UserProject({
      userId: user._id,
      projectId: project._id,
      roleInProject: "owner"
    });
    await userProject.save();

    // 4. Crear tarea
    const task = new Task({
      title: "Primera Tarea",
      description: "Completar la configuración inicial",
      assignee: user._id,
      projectId: project._id,
      status: "todo",
      priority: "medium",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 días después
    });
    await task.save();

    console.log("Datos de prueba creados con éxito");
  } catch (error) {
    console.error("Error al crear datos de prueba:", error);
  } finally {
    await mongoose.disconnect();
  }
}

crearDatosDePrueba();
