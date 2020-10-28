import { Settings, Project } from "./model";
import { v4 } from "uuid";
import { workspaceToXML } from "../core/blockly/helpers/workspace.helper";
import firebase from "firebase";

export async function fbSaveSettings(uid: string, settings: Settings) {
    const db = firebase.firestore();
    await db.collection('settings').doc(uid).set(settings);
}

export async function addProject(project: Project) {
  const db = firebase.firestore();
  const projectDb = db.collection("projects");
  project.created = project.created ? project.created : new Date();
  project.updated = new Date();
  const projectRef = await projectDb.add(project);

  await saveFile(projectRef.id, project.userId);
  const projectData = (await projectRef.get()).data();
  return [projectRef.id,  projectData];
}

export async function saveProject(project: Project, projectId: string) {
  const db = firebase.firestore();
  const projectDb = db.collection("projects");
  project.created = project.created ? project.created : new Date();
  project.updated = new Date();
  await saveFile(projectId, project.userId);
  await projectDb.doc(projectId).set(project);
}

export async function getProject(projectId: string): Promise<Project> {
  const db = firebase.firestore();
  const projectDb = db.collection("projects");
  const project = await projectDb.doc(projectId).get();
  return project.data() as Project;
}


async function saveFile(projectId: string, uid: string) {
  const storage = firebase.storage();
  const storageRef = storage.ref();
  const fileRef = storageRef.child(`${uid}/${projectId}.xml`);
  await fileRef.put(
    new Blob([workspaceToXML()], { type: "application/xml;charset=utf-8" })
  );
}

export async function getFile(projectId: string, uid: string) {
  const storage = firebase.storage();
  const storageRef = storage.ref();
  const fileRef = storageRef.child(`${uid}/${projectId}.xml`);
  alert(`${uid}/${projectId}.xml`);
  const url = await fileRef.getDownloadURL();

  const response = await fetch(url);

  return await response.text();
}