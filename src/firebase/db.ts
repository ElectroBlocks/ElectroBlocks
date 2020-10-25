import { User, Settings, Project, ProjectList } from "./model";
import { v4 } from "uuid";
import { workspaceToXML } from "../core/blockly/helpers/workspace.helper";

export async function fbSaveSettings(uid: string, settings: Settings) {
    const db = firebase.firestore();
    await db.collection('settings').doc(uid).set(settings);
}

export async function fbSaveFile(project: Project, uid: string) {
  const db = firebase.firestore();
  project.created = project.created ? project.created : new Date();
  project.updated = new Date();
  const projectDb = await db.collection("projects").doc(uid).get();
  let projectList: Project[] = projectDb.exists
    ? projectDb.data().projects
    : [];

  project.id = project.id ? project.id : v4();
  const projectContainer: ProjectList = {
    userId: uid,
    projects: [project, ...projectList.filter((p) => p.id !== project.id)],
  };
  await saveFile(project.id, uid);
  await await db.collection("projects").doc(uid).set(projectContainer);
}

async function saveFile(projectId: string, uid: string) {
  const storage = firebase.storage();
  const storageRef = storage.ref();
  const fileRef = storageRef.child(`${uid}/${projectId}.xml`);
  await fileRef.put(
    new Blob([workspaceToXML()], { type: "application/xml;charset=utf-8" })
  );
}