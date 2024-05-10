import { type Settings, type Project, defaultSetting } from "./model";
import { workspaceToXML } from "../core/blockly/helpers/workspace.helper";
import {
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  doc,
  getDoc,
  collection,
  updateDoc,
  addDoc,
  deleteDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { getApp } from "firebase/app";

export async function fbSaveSettings(uid: string, settings: Settings) {
  const db = firestore();
  const settingDoc = doc(db, "settings", uid);
  await updateDoc(settingDoc, { ...settings });
}

export async function getSettings(uid: string): Promise<Settings> {
  const db = firestore();
  const settingDoc = await getDoc(doc(db, "settings", uid));

  if (settingDoc.exists) {
    return settingDoc.data() as Settings;
  }

  return defaultSetting;
}

export async function addProject(project: Project) {
  const db = firestore();
  const projectCollection = collection(db, "projects");
  project.created = project.created ? project.created : new Date();
  project.updated = new Date();
  project.canShare = false;
  const projectRef = await addDoc(projectCollection, { ...project });

  await saveFile(projectRef.id, project.userId);
  const projectData = (await getDoc(projectRef)).data() as Project;
  return { projectId: projectRef.id, project: projectData };
}

export async function saveProject(project: Project, projectId: string) {
  const db = firestore();
  const projectRef = doc(db, "projects", projectId);

  project.created = project.created ? project.created : new Date();
  project.updated = new Date();
  await updateDoc(projectRef, { ...project });

  await saveFile(projectId, project.userId);
}

export async function getProject(projectId: string): Promise<Project> {
  const db = firestore();
  const project = (
    await getDoc(doc(db, "projects", projectId))
  ).data() as Project;

  return project;
}

export async function getProjects(uid: string): Promise<[Project, string][]> {
  const db = firestore();

  const docs = await getDocs(
    query(
      collection(db, "projects"),
      where("userId", "==", uid),
      orderBy("created", "desc")
    )
  );

  return docs.docs.map((d) => [d.data(), d.id]) as [Project, string][];
}

async function saveFile(projectId: string, uid: string) {
  const storage = getStorage();
  const fileRef = ref(storage, `${uid}/${projectId}.xml`);

  await uploadBytes(
    fileRef,
    new Blob([workspaceToXML()], { type: "application/xml;charset=utf-8" })
  );
}

export async function saveUserProfile(
  bio: string,
  username: string,
  uid: string
) {
  const db = firestore();

  await updateDoc(doc(db, "profiles", uid), { bio, username });
}

export async function getUserProfile(uid: string) {
  const db = firestore();
  const profileDoc = await getDoc(doc(db, "profiles", uid));

  if (profileDoc.exists) {
    return profileDoc.data();
  }

  return { username: "", bio: "" };
}

export async function getFile(projectId: string, uid: string) {
  const storage = getStorage();
  const storageRef = ref(storage, `${uid}/${projectId}.xml`);
  const url = await getDownloadURL(storageRef);

  const response = await fetch(url);

  return await response.text();
}

export async function deleteProject(projectId: string, uid: string) {
  const storage = getStorage();
  const storageRef = ref(storage, `${uid}/${projectId}.xml`);
  await deleteObject(storageRef);

  const db = firestore();
  const projectDoc = doc(db, "projects", projectId);
  await deleteDoc(projectDoc);
}

const firestore = () => {
  return initializeFirestore(getApp(), {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  });
};
